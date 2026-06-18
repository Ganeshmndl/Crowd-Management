import { Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import UserDashboard from "./pages/UserDashboard";
import CommitteeDashboard from "./pages/CommitteeDashboard";
import CommitteeMatchCenterPage from "./pages/CommitteeMatchCenterPage";
import CommitteeMatchesPage from "./pages/CommitteeMatchesPage";
import CommitteeReportsPage from "./pages/CommitteeReportsPage";
import CommitteeSOSPage from "./pages/CommitteeSOSPage";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import EventSelectionPage from "./pages/EventSelectionPage";
import FamilyPage from "./pages/FamilyPage";
import MyReportsPage from "./pages/MyReportsPage";
import ReportFormPage from "./pages/ReportFormPage";
import SOSPage from "./pages/SOSPage";
import ReunificationPage from "./pages/ReunificationPage";
import UserMapPage from "./pages/UserMapPage";
import CommitteeMapPage from "./pages/CommitteeMapPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route
        path="/select-event"
        element={
          <ProtectedRoute>
            <EventSelectionPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/dashboard"
        element={
          <ProtectedRoute allowedRoles={["user"]} requireEvent>
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/reports"
        element={
          <ProtectedRoute allowedRoles={["user"]} requireEvent>
            <MyReportsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/missing/new"
        element={
          <ProtectedRoute allowedRoles={["user"]} requireEvent>
            <ReportFormPage type="missing" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/missing/:id/edit"
        element={
          <ProtectedRoute allowedRoles={["user"]} requireEvent>
            <ReportFormPage type="missing" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/found/new"
        element={
          <ProtectedRoute allowedRoles={["user"]} requireEvent>
            <ReportFormPage type="found" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/found/:id/edit"
        element={
          <ProtectedRoute allowedRoles={["user"]} requireEvent>
            <ReportFormPage type="found" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/family"
        element={
          <ProtectedRoute allowedRoles={["user"]} requireEvent>
            <FamilyPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/sos"
        element={
          <ProtectedRoute allowedRoles={["user"]} requireEvent>
            <SOSPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/reunification/:ticketId"
        element={
          <ProtectedRoute allowedRoles={["user"]} requireEvent>
            <ReunificationPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/map"
        element={
          <ProtectedRoute allowedRoles={["user"]} requireEvent>
            <UserMapPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/committee/dashboard"
        element={
          <ProtectedRoute allowedRoles={["committee"]}>
            <CommitteeDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/committee/reports"
        element={
          <ProtectedRoute allowedRoles={["committee"]}>
            <CommitteeReportsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/committee/match-center"
        element={
          <ProtectedRoute allowedRoles={["committee"]}>
            <CommitteeMatchCenterPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/committee/matches"
        element={
          <ProtectedRoute allowedRoles={["committee"]}>
            <CommitteeMatchesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/committee/sos"
        element={
          <ProtectedRoute allowedRoles={["committee"]}>
            <CommitteeSOSPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/committee/map"
        element={
          <ProtectedRoute allowedRoles={["committee"]}>
            <CommitteeMapPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
