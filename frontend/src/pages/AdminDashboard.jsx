import {
  Activity,
  CalendarDays,
  CheckCircle2,
  ImagePlus,
  LoaderCircle,
  MapPin,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Siren,
  Trash2,
  UserRound,
  UsersRound,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import AdminLayout from "@/components/AdminLayout";
import FormAlert from "@/components/FormAlert";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import useAuth from "@/hooks/useAuth";
import { apiRequest } from "@/lib/api";

const initialEventForm = {
  name: "",
  province: "",
  district: "",
  venue: "",
  startDate: "",
  endDate: "",
  capacity: "",
  description: "",
  status: "upcoming",
  committeeIds: [],
};

const initialLocationForm = {
  eventId: "",
  name: "",
  type: "help_desk",
  description: "",
  latitude: "",
  longitude: "",
};

const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(
        new Date(value),
      )
    : "-";

const formatLocationType = (type) => {
  switch (type) {
    case "help_desk":
      return "Help Desk";
    case "volunteer_point":
      return "Volunteer Point";
    case "sos_point":
      return "SOS Point";
    case "lost_found":
      return "Lost & Found";
    case "medical":
      return "Medical Booth";
    default:
      return type;
  }
};

function AdminDashboard() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [dashboard, setDashboard] = useState(null);
  const [users, setUsers] = useState([]);
  const [committees, setCommittees] = useState([]);
  const [events, setEvents] = useState([]);
  const [mapLocations, setMapLocations] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedEventFilter, setSelectedEventFilter] = useState("");
  const [eventForm, setEventForm] = useState(initialEventForm);
  const [locationForm, setLocationForm] = useState(initialLocationForm);
  const [editingEvent, setEditingEvent] = useState(null);
  const [editingLocation, setEditingLocation] = useState(null);
  const [banner, setBanner] = useState(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showLocationForm, setShowLocationForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const authHeaders = useMemo(
    () => ({ Authorization: `Bearer ${token}` }),
    [token],
  );

  const filteredLocations = useMemo(() => {
    if (!selectedEventFilter) {
      return mapLocations;
    }
    return mapLocations.filter(
      (loc) => loc.eventId?._id === selectedEventFilter,
    );
  }, [mapLocations, selectedEventFilter]);

  const loadAll = useCallback(async () => {
    setLoading(true);
    const [
      dashboardData,
      usersData,
      committeesData,
      eventsData,
      locationsData,
    ] = await Promise.all([
      apiRequest("/admin/dashboard", { headers: authHeaders }),
      apiRequest(
        `/admin/users${search ? `?search=${encodeURIComponent(search)}` : ""}`,
        { headers: authHeaders },
      ),
      apiRequest("/admin/committees", { headers: authHeaders }),
      apiRequest("/admin/events", { headers: authHeaders }),
      apiRequest("/admin/map-locations", { headers: authHeaders }),
    ]);
    setDashboard(dashboardData);
    setUsers(usersData.users);
    setCommittees(committeesData.committees);
    setEvents(eventsData.events);
    setMapLocations(locationsData.locations);
    setLoading(false);
  }, [authHeaders, search]);

  useEffect(() => {
    loadAll().catch((requestError) => {
      setError(requestError.message);
      setLoading(false);
    });
  }, [loadAll]);

  const updateUser = async (user, patch) => {
    const data = await apiRequest(`/admin/users/${user._id}`, {
      method: "PATCH",
      headers: authHeaders,
      body: JSON.stringify(patch),
    });
    setUsers((current) =>
      current.map((item) => (item._id === user._id ? data.user : item)),
    );
    await loadAll();
  };

  const deleteUser = async (user) => {
    if (!window.confirm(`Delete ${user.name}?`)) return;
    await apiRequest(`/admin/users/${user._id}`, {
      method: "DELETE",
      headers: authHeaders,
    });
    await loadAll();
  };

  const openEventForm = (event = null) => {
    setEditingEvent(event);
    setBanner(null);
    setEventForm(
      event
        ? {
            name: event.name,
            province: event.province,
            district: event.district,
            venue: event.venue,
            startDate: new Date(event.startDate).toISOString().slice(0, 16),
            endDate: new Date(event.endDate || event.startDate)
              .toISOString()
              .slice(0, 16),
            capacity: event.capacity,
            description: event.description || "",
            status: event.status,
            committeeIds:
              event.committeeIds?.map(
                (committee) => committee._id || committee,
              ) || [],
          }
        : initialEventForm,
    );
    setShowEventForm(true);
    setActiveTab("events");
  };

  const saveEvent = async (event) => {
    event.preventDefault();
    const payload = new FormData();
    Object.entries(eventForm).forEach(([key, value]) => {
      if (key === "committeeIds") payload.append(key, value.join(","));
      else payload.append(key, value);
    });
    if (banner) payload.append("banner", banner);
    await apiRequest(
      editingEvent ? `/admin/events/${editingEvent._id}` : "/admin/events",
      {
        method: editingEvent ? "PATCH" : "POST",
        headers: authHeaders,
        body: payload,
      },
    );
    setShowEventForm(false);
    setEditingEvent(null);
    await loadAll();
  };

  const deleteEvent = async (event) => {
    if (!window.confirm(`Delete ${event.name}?`)) return;
    await apiRequest(`/admin/events/${event._id}`, {
      method: "DELETE",
      headers: authHeaders,
    });
    await loadAll();
  };

  const updateEventStatus = async (event, status) => {
    await apiRequest(`/admin/events/${event._id}`, {
      method: "PATCH",
      headers: authHeaders,
      body: JSON.stringify({ status }),
    });
    await loadAll();
  };

  const assignCommittee = async (event, committeeId, action) => {
    await apiRequest(`/admin/events/${event._id}/assign-committee`, {
      method: "PATCH",
      headers: authHeaders,
      body: JSON.stringify({ committeeId, action }),
    });
    await loadAll();
  };

  const openLocationForm = (location = null) => {
    setEditingLocation(location);
    setLocationForm(
      location
        ? {
            eventId: location.eventId?._id || location.eventId,
            name: location.name,
            type: location.type,
            description: location.description || "",
            latitude: location.latitude,
            longitude: location.longitude,
          }
        : initialLocationForm,
    );
    setShowLocationForm(true);
    setActiveTab("map-locations");
  };

  const saveLocation = async (e) => {
    e.preventDefault();
    const payload = {
      ...locationForm,
      latitude: Number(locationForm.latitude),
      longitude: Number(locationForm.longitude),
    };
    if (editingLocation) {
      await apiRequest(`/admin/map-locations/${editingLocation._id}`, {
        method: "PATCH",
        headers: authHeaders,
        body: JSON.stringify(payload),
      });
    } else {
      await apiRequest("/admin/map-locations", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify(payload),
      });
    }
    setShowLocationForm(false);
    setEditingLocation(null);
    await loadAll();
  };

  const deleteLocation = async (location) => {
    if (!window.confirm(`Delete ${location.name}?`)) return;
    await apiRequest(`/admin/map-locations/${location._id}`, {
      method: "DELETE",
      headers: authHeaders,
    });
    await loadAll();
  };

  const kpiConfig = dashboard
    ? [
        ["totalUsers", "Total Users", UserRound],
        ["totalCommittees", "Total Committees", ShieldCheck],
        ["activeEvents", "Active Events", CalendarDays],
        ["missingReports", "Missing Reports", UsersRound],
        ["foundReports", "Found Reports", CheckCircle2],
        ["sosRequests", "SOS Requests", Siren],
      ]
    : [];

  return (
    <AdminLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      title="Admin Dashboard"
      description="Manage users, committees, events, assignments, and platform analytics."
    >
      {error && (
        <div className="mb-5">
          <FormAlert>{error}</FormAlert>
        </div>
      )}
      {loading || !dashboard ? (
        <div className="grid min-h-72 place-items-center">
          <LoaderCircle className="size-7 animate-spin text-brand-600" />
        </div>
      ) : (
        <>
          {activeTab === "overview" && (
            <section>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
                {kpiConfig.map(([key, label, Icon]) => (
                  <Card key={key} className="shadow-sm">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between">
                        <Icon className="size-5 text-brand-600" />
                        <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">
                          {dashboard.trends[key]}
                        </span>
                      </div>
                      <p className="mt-4 text-2xl font-black text-slate-950">
                        {dashboard.kpis[key]}
                      </p>
                      <p className="mt-1 text-xs font-semibold text-slate-500">
                        {label}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Analytics dashboard={dashboard} />
            </section>
          )}

          {activeTab === "users" && (
            <UsersPanel
              users={users}
              events={events}
              search={search}
              setSearch={setSearch}
              updateUser={updateUser}
              deleteUser={deleteUser}
            />
          )}

          {activeTab === "committees" && (
            <CommitteesPanel
              committees={committees}
              events={events}
              assignCommittee={assignCommittee}
            />
          )}

          {activeTab === "events" && (
            <EventsPanel
              events={events}
              committees={committees}
              showEventForm={showEventForm}
              setShowEventForm={setShowEventForm}
              eventForm={eventForm}
              setEventForm={setEventForm}
              editingEvent={editingEvent}
              setEditingEvent={setEditingEvent}
              banner={banner}
              setBanner={setBanner}
              openEventForm={openEventForm}
              saveEvent={saveEvent}
              deleteEvent={deleteEvent}
              updateEventStatus={updateEventStatus}
              assignCommittee={assignCommittee}
            />
          )}

          {activeTab === "map-locations" && (
            <MapLocationsPanel
              locations={filteredLocations}
              events={events}
              showLocationForm={showLocationForm}
              setShowLocationForm={setShowLocationForm}
              locationForm={locationForm}
              setLocationForm={setLocationForm}
              editingLocation={editingLocation}
              setEditingLocation={setEditingLocation}
              openLocationForm={openLocationForm}
              saveLocation={saveLocation}
              deleteLocation={deleteLocation}
              selectedEventFilter={selectedEventFilter}
              setSelectedEventFilter={setSelectedEventFilter}
            />
          )}
          {activeTab === "analytics" && <Analytics dashboard={dashboard} />}
        </>
      )}
    </AdminLayout>
  );
}

function MapLocationsPanel(props) {
  const {
    locations,
    events,
    showLocationForm,
    setShowLocationForm,
    locationForm,
    setLocationForm,
    editingLocation,
    setEditingLocation,
    openLocationForm,
    saveLocation,
    deleteLocation,
    selectedEventFilter,
    setSelectedEventFilter,
  } = props;

  const setField = (field, value) =>
    setLocationForm((current) => ({ ...current, [field]: value }));

  const getFilterLabel = () => {
    if (!selectedEventFilter) {
      return `All Events (${locations.length})`;
    }
    const selectedEvent = events.find((e) => e._id === selectedEventFilter);
    return `${selectedEvent?.name || "Unknown"} (${locations.length})`;
  };

  return (
    <section>
      <div className="mb-5 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-3">
          <label className="text-sm font-semibold text-slate-700">Event</label>
          <select
            value={selectedEventFilter}
            onChange={(e) => setSelectedEventFilter(e.target.value)}
            className="h-10 px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 shadow-sm"
          >
            <option value="">All Events</option>
            {events.map((event) => (
              <option key={event._id} value={event._id}>
                {event.name}
              </option>
            ))}
          </select>
          <span className="text-sm font-bold text-slate-800">
            {getFilterLabel()}
          </span>
        </div>
        <Button onClick={() => openLocationForm()}>
          <Plus className="size-4" />
          Create location
        </Button>
      </div>
      {showLocationForm && (
        <form
          onSubmit={saveLocation}
          className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-950">
              {editingLocation ? "Edit location" : "Create location"}
            </h2>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setShowLocationForm(false);
                setEditingLocation(null);
              }}
            >
              Close
            </Button>
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <Select
              required
              value={locationForm.eventId}
              onChange={(e) => setField("eventId", e.target.value)}
            >
              <option value="">Select event</option>
              {events.map((event) => (
                <option key={event._id} value={event._id}>
                  {event.name}
                </option>
              ))}
            </Select>
            <Input
              required
              placeholder="Location name"
              value={locationForm.name}
              onChange={(e) => setField("name", e.target.value)}
            />
            <Select
              value={locationForm.type}
              onChange={(e) => setField("type", e.target.value)}
            >
              {[
                "help_desk",
                "volunteer_point",
                "sos_point",
                "lost_found",
                "medical",
              ].map((type) => (
                <option key={type} value={type}>
                  {formatLocationType(type)}
                </option>
              ))}
            </Select>
            <Input
              required
              type="number"
              step="any"
              placeholder="Latitude"
              value={locationForm.latitude}
              onChange={(e) => setField("latitude", e.target.value)}
            />
            <Input
              required
              type="number"
              step="any"
              placeholder="Longitude"
              value={locationForm.longitude}
              onChange={(e) => setField("longitude", e.target.value)}
            />
            <Textarea
              className="md:col-span-2"
              placeholder="Description"
              value={locationForm.description}
              onChange={(e) => setField("description", e.target.value)}
            />
          </div>
          <div className="mt-6 flex justify-end">
            <Button type="submit">
              {editingLocation ? "Save changes" : "Create location"}
            </Button>
          </div>
        </form>
      )}
      <Card className="shadow-sm">
        <CardContent className="p-0">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-5 md:flex-row md:items-center md:justify-between">
            <h2 className="font-bold text-slate-950">Map locations</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  {[
                    "Name",
                    "Event",
                    "Type",
                    "Latitude",
                    "Longitude",
                    "Actions",
                  ].map((item) => (
                    <th key={item} className="px-5 py-3">
                      {item}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {locations.map((location) => (
                  <tr key={location._id}>
                    <td className="px-5 py-4 font-bold text-slate-900">
                      {location.name}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {location.eventId?.name || "-"}
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                        <MapPin className="size-3" />
                        {formatLocationType(location.type)}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {location.latitude}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {location.longitude}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openLocationForm(location)}
                        >
                          <Pencil className="size-3.5" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600"
                          onClick={() => deleteLocation(location)}
                        >
                          <Trash2 className="size-3.5" />
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function Analytics({ dashboard }) {
  const pieData = [
    { name: "Resolved", value: dashboard.analytics.resolutionRate },
    {
      name: "Open",
      value: Math.max(0, 100 - dashboard.analytics.resolutionRate),
    },
  ];
  return (
    <div className="mt-8 grid gap-6 xl:grid-cols-[1.5fr_0.8fr]">
      <Card className="shadow-sm">
        <CardContent>
          <h2 className="font-bold text-slate-950">Reports by event</h2>
          <div className="mt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboard.analytics.byEvent}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="missing" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                <Bar dataKey="found" fill="#10b981" radius={[8, 8, 0, 0]} />
                <Bar dataKey="sos" fill="#ef4444" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-sm">
        <CardContent>
          <h2 className="font-bold text-slate-950">Resolution rate</h2>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={70}
                  outerRadius={100}
                  dataKey="value"
                >
                  <Cell fill="#10b981" />
                  <Cell fill="#e2e8f0" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="text-center text-3xl font-black text-slate-950">
            {dashboard.analytics.resolutionRate}%
          </p>
          <p className="mt-1 text-center text-sm text-slate-500">
            Resolved cases and SOS requests
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function UsersPanel({
  users,
  events,
  search,
  setSearch,
  updateUser,
  deleteUser,
}) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-0">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-5 md:flex-row md:items-center md:justify-between">
          <h2 className="font-bold text-slate-950">User management</h2>
          <div className="relative md:w-80">
            <Search className="pointer-events-none absolute left-3.5 top-3.5 size-4 text-slate-400" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search users"
              className="pl-10"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                {[
                  "Name",
                  "Email",
                  "Role",
                  "Event",
                  "Status",
                  "Created Date",
                  "Actions",
                ].map((item) => (
                  <th key={item} className="px-5 py-3">
                    {item}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-5 py-4 font-bold text-slate-900">
                    {user.name}
                  </td>
                  <td className="px-5 py-4 text-slate-600">{user.email}</td>
                  <td className="px-5 py-4">
                    <Select
                      className="h-9"
                      value={user.role}
                      onChange={(event) =>
                        updateUser(user, { role: event.target.value })
                      }
                    >
                      {["user", "committee", "admin"].map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </Select>
                  </td>
                  <td className="px-5 py-4">
                    <Select
                      className="h-9"
                      value={user.eventId?._id || ""}
                      onChange={(event) =>
                        updateUser(user, { eventId: event.target.value })
                      }
                    >
                      <option value="">None</option>
                      {events.map((event) => (
                        <option key={event._id} value={event._id}>
                          {event.name}
                        </option>
                      ))}
                    </Select>
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge
                      status={user.isActive ? "active" : "cancelled"}
                    />
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          updateUser(user, { isActive: !user.isActive })
                        }
                      >
                        {user.isActive ? "Disable" : "Enable"}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-600"
                        onClick={() => deleteUser(user)}
                      >
                        <Trash2 className="size-3.5" />
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function CommitteesPanel({ committees, events, assignCommittee }) {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {committees.map((committee) => (
        <Card key={committee._id} className="shadow-sm">
          <CardContent>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-bold text-slate-950">{committee.name}</h2>
                <p className="mt-1 text-sm text-slate-500">{committee.email}</p>
              </div>
              <StatusBadge
                status={committee.isActive ? "active" : "cancelled"}
              />
            </div>
            <div className="mt-5">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Assigned events
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {committee.assignedEvents.length ? (
                  committee.assignedEvents.map((event) => (
                    <span
                      key={event._id}
                      className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700"
                    >
                      {event.name}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-slate-500">
                    No assigned events
                  </span>
                )}
              </div>
            </div>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {events.map((event) => {
                const assigned = event.committeeIds?.some(
                  (item) => (item._id || item) === committee._id,
                );
                return (
                  <Button
                    key={event._id}
                    size="sm"
                    variant={assigned ? "secondary" : "outline"}
                    onClick={() =>
                      assignCommittee(
                        event,
                        committee._id,
                        assigned ? "remove" : "assign",
                      )
                    }
                  >
                    {assigned ? "Remove from" : "Assign to"} {event.name}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function EventsPanel(props) {
  const {
    events,
    committees,
    showEventForm,
    setShowEventForm,
    eventForm,
    setEventForm,
    editingEvent,
    setEditingEvent,
    setBanner,
    openEventForm,
    saveEvent,
    deleteEvent,
    updateEventStatus,
    assignCommittee,
  } = props;

  const setField = (field, value) =>
    setEventForm((current) => ({ ...current, [field]: value }));

  return (
    <section>
      <div className="mb-5 flex justify-end">
        <Button onClick={() => openEventForm()}>
          <Plus className="size-4" />
          Create event
        </Button>
      </div>
      {showEventForm && (
        <form
          onSubmit={saveEvent}
          className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-950">
              {editingEvent ? "Edit event" : "Create event"}
            </h2>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setShowEventForm(false);
                setEditingEvent(null);
              }}
            >
              Close
            </Button>
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <Input
              required
              placeholder="Event name"
              value={eventForm.name}
              onChange={(event) => setField("name", event.target.value)}
            />
            <Input
              required
              placeholder="Province"
              value={eventForm.province}
              onChange={(event) => setField("province", event.target.value)}
            />
            <Input
              required
              placeholder="District"
              value={eventForm.district}
              onChange={(event) => setField("district", event.target.value)}
            />
            <Input
              required
              placeholder="Venue"
              value={eventForm.venue}
              onChange={(event) => setField("venue", event.target.value)}
            />
            <Input
              required
              type="datetime-local"
              value={eventForm.startDate}
              onChange={(event) => setField("startDate", event.target.value)}
            />
            <Input
              required
              type="datetime-local"
              value={eventForm.endDate}
              onChange={(event) => setField("endDate", event.target.value)}
            />
            <Input
              required
              type="number"
              min="1"
              placeholder="Crowd capacity"
              value={eventForm.capacity}
              onChange={(event) => setField("capacity", event.target.value)}
            />
            <Select
              value={eventForm.status}
              onChange={(event) => setField("status", event.target.value)}
            >
              {["upcoming", "active", "completed"].map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </Select>
            <label className="flex h-12 cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-3.5 text-sm font-semibold text-slate-500 shadow-sm">
              <ImagePlus className="size-4" />
              Banner image
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(event) => setBanner(event.target.files[0] || null)}
              />
            </label>
            <Select
              multiple
              className="h-28"
              value={eventForm.committeeIds}
              onChange={(event) =>
                setField(
                  "committeeIds",
                  [...event.target.selectedOptions].map(
                    (option) => option.value,
                  ),
                )
              }
            >
              {committees.map((committee) => (
                <option key={committee._id} value={committee._id}>
                  {committee.name}
                </option>
              ))}
            </Select>
            <Textarea
              className="md:col-span-2"
              placeholder="Description"
              value={eventForm.description}
              onChange={(event) => setField("description", event.target.value)}
            />
          </div>
          <div className="mt-6 flex justify-end">
            <Button type="submit">
              {editingEvent ? "Save changes" : "Create event"}
            </Button>
          </div>
        </form>
      )}
      <div className="grid gap-5 xl:grid-cols-2">
        {events.map((event) => (
          <Card key={event._id} className="overflow-hidden shadow-sm">
            {event.banner?.url && (
              <img
                src={event.banner.url}
                alt=""
                className="h-44 w-full object-cover"
              />
            )}
            <CardContent>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-950">
                    {event.name}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {event.venue}, {event.district}
                  </p>
                </div>
                <StatusBadge status={event.status} />
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                {event.description || "No description yet."}
              </p>
              <div className="mt-5 grid gap-2 text-xs font-semibold text-slate-500 sm:grid-cols-3">
                <span>Start {formatDate(event.startDate)}</span>
                <span>End {formatDate(event.endDate)}</span>
                <span>
                  {new Intl.NumberFormat().format(event.capacity)} capacity
                </span>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openEventForm(event)}
                >
                  <Pencil className="size-3.5" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    updateEventStatus(
                      event,
                      event.status === "active" ? "completed" : "active",
                    )
                  }
                >
                  {event.status === "active" ? "Deactivate" : "Activate"}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-red-600"
                  onClick={() => deleteEvent(event)}
                >
                  <Trash2 className="size-3.5" />
                  Delete
                </Button>
              </div>
              <div className="mt-5 border-t border-slate-100 pt-5">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Committee assignments
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {committees.map((committee) => {
                    const assigned = event.committeeIds?.some(
                      (item) => (item._id || item) === committee._id,
                    );
                    return (
                      <Button
                        key={committee._id}
                        size="sm"
                        variant={assigned ? "secondary" : "outline"}
                        onClick={() =>
                          assignCommittee(
                            event,
                            committee._id,
                            assigned ? "remove" : "assign",
                          )
                        }
                      >
                        {committee.name}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

export default AdminDashboard;
