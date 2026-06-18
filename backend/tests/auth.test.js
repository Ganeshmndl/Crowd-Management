import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-secret-that-is-long-enough-for-auth-tests";

const [{ app }, { default: Event }, { default: User }, roleMiddleware] =
  await Promise.all([
  import("../server.js"),
  import("../models/Event.js"),
  import("../models/User.js"),
  import("../middleware/roleMiddleware.js"),
  ]);

const users = new Map();
const events = new Map();
const originalMethods = {
  eventCreate: Event.create,
  eventDelete: Event.findByIdAndDelete,
  eventFind: Event.find,
  eventFindById: Event.findById,
  eventUpdate: Event.findByIdAndUpdate,
  userCreate: User.create,
  userFindById: User.findById,
  userFindOne: User.findOne,
  userUpdateMany: User.updateMany,
};

const makeQuery = (value) => ({
  select: async () => value,
  then: (resolve, reject) => Promise.resolve(value).then(resolve, reject),
});

User.findOne = ({ email }) => makeQuery(users.get(email) || null);
User.findById = async (id) =>
  [...users.values()].find((user) => user._id.toString() === id) || null;
User.create = async ({ name, email, password, role }) => {
  const user = new User({
    _id: new mongoose.Types.ObjectId(),
    name,
    email,
    password: await bcrypt.hash(password, 4),
    role,
  });
  user.save = async () => user;
  users.set(email, user);
  return user;
};
User.updateMany = async ({ eventId }, update) => {
  for (const user of users.values()) {
    if (user.eventId?.toString() === eventId.toString()) {
      user.eventId = update.$set.eventId;
    }
  }
};
Event.find = () => ({
  sort: async () => [...events.values()],
});
Event.findById = async (id) => events.get(id.toString()) || null;
Event.create = async (details) => {
  const event = new Event({
    _id: new mongoose.Types.ObjectId(),
    ...details,
  });
  events.set(event._id.toString(), event);
  return event;
};
Event.findByIdAndUpdate = async (id, details) => {
  const event = events.get(id.toString());
  if (!event) return null;
  Object.assign(event, details);
  return event;
};
Event.findByIdAndDelete = async (id) => {
  const event = events.get(id.toString());
  events.delete(id.toString());
  return event || null;
};

let server;
let baseUrl;

before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  Event.create = originalMethods.eventCreate;
  Event.findByIdAndDelete = originalMethods.eventDelete;
  Event.find = originalMethods.eventFind;
  Event.findById = originalMethods.eventFindById;
  Event.findByIdAndUpdate = originalMethods.eventUpdate;
  User.create = originalMethods.userCreate;
  User.findById = originalMethods.userFindById;
  User.findOne = originalMethods.userFindOne;
  User.updateMany = originalMethods.userUpdateMany;
  await new Promise((resolve) => server.close(resolve));
});

const request = async (path, options = {}) => {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  const body = await response.json();
  return { body, response };
};

test("register creates a user account and never accepts a privileged role", async () => {
  const { body, response } = await request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({
      name: "Test User",
      email: "test@example.com",
      password: "secret123",
      role: "admin",
    }),
  });

  assert.equal(response.status, 201);
  assert.equal(body.user.role, "user");
  assert.equal(body.user.email, "test@example.com");
  assert.equal(body.user.eventId, null);
  assert.ok(body.user.createdAt);
  assert.equal("password" in body.user, false);
  assert.ok(body.token);

  const storedUser = users.get("test@example.com");
  assert.notEqual(storedUser.password, "secret123");
  assert.equal(await bcrypt.compare("secret123", storedUser.password), true);

  const payload = jwt.verify(body.token, process.env.JWT_SECRET);
  assert.equal(payload.id, body.user.id);
  assert.equal(payload.role, "user");
});

test("register rejects duplicate email addresses", async () => {
  const { body, response } = await request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({
      name: "Duplicate User",
      email: "test@example.com",
      password: "secret123",
    }),
  });

  assert.equal(response.status, 409);
  assert.match(body.message, /already exists/i);
});

test("registration validates input before creating a user", async () => {
  const shortPassword = await request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({
      name: "Invalid User",
      email: "invalid@example.com",
      password: "123",
    }),
  });
  assert.equal(shortPassword.response.status, 400);

  const invalidEmail = await request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({
      name: "Invalid User",
      email: "not-an-email",
      password: "secret123",
    }),
  });
  assert.equal(invalidEmail.response.status, 400);
});

test("login validates credentials and returns a reusable JWT", async () => {
  const { body, response } = await request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: "test@example.com",
      password: "secret123",
    }),
  });

  assert.equal(response.status, 200);
  assert.equal(body.user.name, "Test User");

  const currentUser = await request("/api/auth/me", {
    headers: { Authorization: `Bearer ${body.token}` },
  });

  assert.equal(currentUser.response.status, 200);
  assert.equal(currentUser.body.user.email, "test@example.com");
});

test("login and protected routes reject invalid credentials", async () => {
  const loginResponse = await request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: "test@example.com",
      password: "incorrect",
    }),
  });
  assert.equal(loginResponse.response.status, 401);

  const meResponse = await request("/api/auth/me", {
    headers: { Authorization: "Bearer invalid-token" },
  });
  assert.equal(meResponse.response.status, 401);
});

test("role middleware enforces admin and committee access", () => {
  const response = {
    statusCode: 200,
    status(code) {
      this.statusCode = code;
      return this;
    },
  };

  assert.throws(
    () => roleMiddleware.requireAdmin({ user: { role: "user" } }, response, () => {}),
    /permission/i,
  );
  assert.equal(response.statusCode, 403);

  let committeeAllowed = false;
  roleMiddleware.requireCommittee(
    { user: { role: "committee" } },
    response,
    () => {
      committeeAllowed = true;
    },
  );
  assert.equal(committeeAllowed, true);

  let adminAllowed = false;
  roleMiddleware.requireCommittee(
    { user: { role: "admin" } },
    response,
    () => {
      adminAllowed = true;
    },
  );
  assert.equal(adminAllowed, true);
});

test("event CRUD is authenticated and restricted to administrators", async () => {
  const user = users.get("test@example.com");
  const userToken = jwt.sign(
    { id: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
  );

  const forbidden = await request("/api/events", {
    method: "POST",
    headers: { Authorization: `Bearer ${userToken}` },
    body: JSON.stringify({
      name: "Community Fair",
      province: "Bagmati",
      district: "Kathmandu",
      venue: "City Hall",
      date: "2026-08-10T04:00:00.000Z",
      capacity: 5000,
      status: "upcoming",
      committeeIds: [],
    }),
  });
  assert.equal(forbidden.response.status, 403);

  const admin = new User({
    _id: new mongoose.Types.ObjectId(),
    name: "Admin User",
    email: "admin@example.com",
    password: "hashed-password",
    role: "admin",
  });
  admin.save = async () => admin;
  users.set(admin.email, admin);
  const adminToken = jwt.sign(
    { id: admin._id.toString(), role: admin.role },
    process.env.JWT_SECRET,
  );

  const created = await request("/api/events", {
    method: "POST",
    headers: { Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify({
      name: "Community Fair",
      province: "Bagmati",
      district: "Kathmandu",
      venue: "City Hall",
      date: "2026-08-10T04:00:00.000Z",
      capacity: 5000,
      status: "upcoming",
      committeeIds: [],
    }),
  });
  assert.equal(created.response.status, 201);
  assert.equal(created.body.event.name, "Community Fair");

  const eventId = created.body.event._id;
  const listed = await request("/api/events", {
    headers: { Authorization: `Bearer ${userToken}` },
  });
  assert.equal(listed.response.status, 200);
  assert.equal(listed.body.events.length, 1);

  const updated = await request(`/api/events/${eventId}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify({ status: "active", capacity: 5500 }),
  });
  assert.equal(updated.response.status, 200);
  assert.equal(updated.body.event.status, "active");
  assert.equal(updated.body.event.capacity, 5500);
});

test("event selection persists on the user and deletion clears the relation", async () => {
  const user = users.get("test@example.com");
  const event = [...events.values()][0];
  const userToken = jwt.sign(
    { id: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
  );

  const selected = await request("/api/auth/select-event", {
    method: "PUT",
    headers: { Authorization: `Bearer ${userToken}` },
    body: JSON.stringify({ eventId: event._id.toString() }),
  });
  assert.equal(selected.response.status, 200);
  assert.equal(selected.body.user.eventId, event._id.toString());
  assert.equal(user.eventId.toString(), event._id.toString());

  const admin = users.get("admin@example.com");
  const adminToken = jwt.sign(
    { id: admin._id.toString(), role: admin.role },
    process.env.JWT_SECRET,
  );
  const deleted = await request(`/api/events/${event._id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert.equal(deleted.response.status, 200);
  assert.equal(user.eventId, null);
});
