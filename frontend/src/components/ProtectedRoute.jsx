import { Navigate, Outlet, useLocation } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import useAuth from "@/hooks/useAuth";
import { getDashboardPath } from "@/lib/auth";

function ProtectedRoute({ allowedRoles, children, requireEvent = false }) {
  const { isAuthenticated, loading, selectedEvent, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50">
        <LoaderCircle className="size-7 animate-spin text-brand-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles?.length && !allowedRoles.includes(user.role)) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  if (requireEvent && (!user.eventId || !selectedEvent)) {
    return <Navigate to="/select-event" replace />;
  }

  return children || <Outlet />;
}

export default ProtectedRoute;
