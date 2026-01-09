import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

/* ========== GLOBAL CSS ========== */
import "./pages/auth/AuthCommon.css";
import "./pages/public/PublicAuth.css";
import "./pages/public/PublicLogin.css";

/* ========== LAYOUTS ========== */
import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";

/* ========== HOME ========== */
import ModernHomePage from "./pages/homepage.jsx";

/* ========== AUTH PAGES ========== */
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";
import ResetPassword from "./pages/auth/ResetPassword.jsx";

/* ========== PUBLIC AUTH ========== */
import PublicLogin from "./pages/public/PublicLogin.jsx";
import PublicRegister from "./pages/public/PublicRegister.jsx";

/* ========== COLLECTOR ========== */
import CollectorDashboard from "./pages/collector/CollectorDashboard.jsx";
import CollectorDepartments from "./pages/collector/CollectorDepartments.jsx";
import CollectorProfile from "./pages/collector/CollectorProfile.jsx";
import CollectorTasks from "./pages/collector/CollectorTasks.jsx";
import CollectorNotifications from "./pages/collector/CollectorNotifications.jsx";
import CollectorReports from "./pages/collector/CollectorReports.jsx";
import CollectorUsers from "./pages/collector/CollectorUsers.jsx";

/* ========== DEPARTMENT HEAD ========== */
import DepartmentHeadDashboard from "./pages/department-head/DepartmentHeadDashboard.jsx";
import DepartmentHeadProfile from "./pages/department-head/DepartmentHeadProfile.jsx";
import DepartmentHeadNotifications from "./pages/department-head/DepartmentHeadNotifications.jsx";
import DepartmentReports from "./pages/department-head/DepartmentReports.jsx";
import DepartmentStaff from "./pages/department-head/DepartmentStaff.jsx";

/* ========== STAFF ========== */
import StaffDashboard from "./pages/staff/StaffDashboard.jsx";
import StaffProfile from "./pages/staff/StaffProfile.jsx";
import StaffNotifications from "./pages/staff/StaffNotifications.jsx";
import StaffTasks from "./pages/staff/StaffTasks.jsx";
import ReportProblem from "./pages/staff/ReportProblem.jsx";

/* ========== PUBLIC USER ========== */
import PublicDashboard from "./pages/public/PublicDashboard.jsx";
import PublicProfile from "./pages/public/PublicProfile.jsx";
import MyReports from "./pages/public/PublicMyReports.jsx";
import PublicReportProblem from "./pages/public/PublicReportProblem.jsx";

/* ========== ERROR BOUNDARY ========== */
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, textAlign: "center" }}>
          <h2>Something went wrong</h2>
          <button onClick={() => window.location.reload()}>Reload</button>
        </div>
      );
    }
    return this.props.children;
  }
}

/* ========== ROUTER ========== */
const AppRouter = () => {
  /* ===== Protected Route ===== */
  /* ===== Protected Route ===== */
  const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth(); // ✅ Get auth state here

    if (loading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (!user) return <Navigate to="/auth/login" replace />;

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return <Navigate to="/unauthorized" replace />;
    }

    return children;
  };

  /* ===== Public Route (login/register only) ===== */
  const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth(); // ✅ THIS WAS MISSING

    if (loading) return null; // or <Spinner />

    if (!user) return children;

    switch (user.role) {
      case "public":
        return <Navigate to="/public/dashboard" replace />;
      case "staff":
        return <Navigate to="/staff/dashboard" replace />;
      case "collector":
        return <Navigate to="/collector/dashboard" replace />;
      case "department_head": // ✅ Correct - matches backend
        return <Navigate to="/department-head/dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  };

  return (
    <ErrorBoundary>
      <Routes>
        {/* ===== HOME PAGE (DEFAULT) ===== */}
        <Route path="/" element={<ModernHomePage />} />

        {/* ===== AUTH ROUTES ===== */}
        <Route
          path="/auth"
          element={
            <PublicRoute>
              <AuthLayout />
            </PublicRoute>
          }
        >
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
        </Route>

        {/* ===== PUBLIC AUTH ===== */}
        <Route
          path="/public/login"
          element={
            <PublicRoute>
              <PublicLogin />
            </PublicRoute>
          }
        />
        <Route
          path="/public/register"
          element={
            <PublicRoute>
              <PublicRegister />
            </PublicRoute>
          }
        />

        {/* ===== PUBLIC REPORT (NO LOGIN) ===== */}
        <Route
          path="/public/report-problem"
          element={<PublicReportProblem />}
        />

        {/* ===== MAIN PROTECTED LAYOUT ===== */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          {/* ---- Collector ---- */}
          <Route path="collector/dashboard" element={<CollectorDashboard />} />
          <Route
            path="collector/department"
            element={<CollectorDepartments />}
          />
          <Route path="collector/tasks" element={<CollectorTasks />} />
          <Route path="collector/profile" element={<CollectorProfile />} />
          <Route
            path="collector/notifications"
            element={<CollectorNotifications />}
          />
          <Route path="collector/reports" element={<CollectorReports />} />
          <Route path="collector/users" element={<CollectorUsers />} />

          {/* ---- Department Head ---- */}
          <Route
            path="department-head/dashboard"
            element={<DepartmentHeadDashboard />}
          />
          <Route
            path="department-head/profile"
            element={<DepartmentHeadProfile />}
          />
          <Route
            path="department-head/notifications"
            element={<DepartmentHeadNotifications />}
          />
          <Route
            path="department-head/reports"
            element={<DepartmentReports />}
          />
          <Route path="department-head/staff" element={<DepartmentStaff />} />

          {/* ---- Staff ---- */}
          <Route path="staff/dashboard" element={<StaffDashboard />} />
          <Route path="staff/tasks" element={<StaffTasks />} />
          <Route path="staff/profile" element={<StaffProfile />} />
          <Route path="staff/notifications" element={<StaffNotifications />} />
          <Route path="staff/report-problem" element={<ReportProblem />} />

          {/* ---- Public User ---- */}
          <Route path="public/dashboard" element={<PublicDashboard />} />
          <Route path="public/profile" element={<PublicProfile />} />
          <Route path="public/my-reports" element={<MyReports />} />
        </Route>

        {/* ===== UNAUTHORIZED ===== */}
        <Route path="/unauthorized" element={<h2>Unauthorized</h2>} />

        {/* ===== FALLBACK ===== */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  );
};

export default AppRouter;
