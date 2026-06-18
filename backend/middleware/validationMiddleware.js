const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateRegister = (req, res, next) => {
  const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
  const email =
    typeof req.body.email === "string"
      ? req.body.email.trim().toLowerCase()
      : "";
  const password =
    typeof req.body.password === "string" ? req.body.password : "";

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Name, email, and password are required");
  }

  if (name.length > 80) {
    res.status(400);
    throw new Error("Name cannot exceed 80 characters");
  }

  if (!emailPattern.test(email)) {
    res.status(400);
    throw new Error("Enter a valid email address");
  }

  if (password.length < 6 || password.length > 72) {
    res.status(400);
    throw new Error("Password must be between 6 and 72 characters");
  }

  req.body = { name, email, password };
  next();
};

const validateLogin = (req, res, next) => {
  const email =
    typeof req.body.email === "string"
      ? req.body.email.trim().toLowerCase()
      : "";
  const password =
    typeof req.body.password === "string" ? req.body.password : "";

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  if (!emailPattern.test(email)) {
    res.status(400);
    throw new Error("Enter a valid email address");
  }

  req.body = { email, password };
  next();
};

export { validateLogin, validateRegister };
