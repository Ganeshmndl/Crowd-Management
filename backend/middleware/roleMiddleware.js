const authorizeRoles = (...allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    res.status(403);
    throw new Error("You do not have permission to access this resource");
  }

  next();
};

const requireAdmin = authorizeRoles("admin");
const requireCommittee = authorizeRoles("committee", "admin");
const requireCommitteeOnly = authorizeRoles("committee");

export { authorizeRoles, requireAdmin, requireCommittee, requireCommitteeOnly };
