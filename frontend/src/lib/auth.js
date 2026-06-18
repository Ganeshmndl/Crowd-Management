const dashboardPaths = {
  user: "/user/dashboard",
  committee: "/committee/dashboard",
  admin: "/admin/dashboard",
};

const getDashboardPath = (role) => dashboardPaths[role] || "/";
const getPostAuthPath = (user) => {
  if (user?.role === "committee" || user?.role === "admin") {
    return getDashboardPath(user.role);
  }

  return user?.eventId ? getDashboardPath(user.role) : "/select-event";
};

export { getDashboardPath, getPostAuthPath };
