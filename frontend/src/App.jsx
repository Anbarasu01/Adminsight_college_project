import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PublicLogin from "./pages/PublicLogin";
import ReportProblem from "./pages/ReportProblem";
import CollectorDashboard from "./pages/CollectorDashboard";
import DepartmentDashboard from "./pages/DepartmentDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import Notifications from "./pages/Notifications";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

// Layout component for pages with sidebar and navbar
const DashboardLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// Public layout for login/register pages
const PublicLayout = ({ children }) => {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
};

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

// Role-based Protected Route component
const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (!allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on user's actual role
    switch (user.role) {
      case 'collector':
        return <Navigate to="/collector-dashboard" replace />;
      case 'departmentHead':
        return <Navigate to="/department-dashboard" replace />;
      case 'staff':
        return <Navigate to="/staff-dashboard" replace />;
      case 'public':
      default:
        return <Navigate to="/report-problem" replace />;
    }
  }
  
  return children;
};

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public routes without sidebar/navbar */}
      <Route path="/" element={
        <PublicLayout>
          <PublicLogin />
        </PublicLayout>
      } />
      <Route path="/login" element={
        <PublicLayout>
          <Login />
        </PublicLayout>
      } />
      <Route path="/register" element={
        <PublicLayout>
          <Register />
        </PublicLayout>
      } />
      <Route path="/public-login" element={
        <PublicLayout>
          <PublicLogin />
        </PublicLayout>
      } />

      {/* Protected dashboard routes with sidebar/navbar */}
      
      {/* Report Problem - Accessible by all authenticated users */}
      <Route path="/report-problem" element={
        <ProtectedRoute>
          <DashboardLayout>
            <ReportProblem />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      {/* Notifications - Accessible by all authenticated users */}
      <Route path="/notifications" element={
        <ProtectedRoute>
          <DashboardLayout>
            <Notifications />
          </DashboardLayout>
        </ProtectedRoute>
      } />

      {/* Role-specific dashboards */}
      <Route path="/collector-dashboard" element={
        <RoleProtectedRoute allowedRoles={['collector']}>
          <DashboardLayout>
            <CollectorDashboard />
          </DashboardLayout>
        </RoleProtectedRoute>
      } />

      <Route path="/department-dashboard" element={
        <RoleProtectedRoute allowedRoles={['departmentHead']}>
          <DashboardLayout>
            <DepartmentDashboard />
          </DashboardLayout>
        </RoleProtectedRoute>
      } />

      <Route path="/staff-dashboard" element={
        <RoleProtectedRoute allowedRoles={['staff']}>
          <DashboardLayout>
            <StaffDashboard />
          </DashboardLayout>
        </RoleProtectedRoute>
      } />

      {/* Redirect based on authentication and role */}
      <Route path="*" element={
        user ? (
          // If user is logged in, redirect to appropriate dashboard
          (() => {
            switch (user.role) {
              case 'collector':
                return <Navigate to="/collector-dashboard" replace />;
              case 'departmentHead':
                return <Navigate to="/department-dashboard" replace />;
              case 'staff':
                return <Navigate to="/staff-dashboard" replace />;
              case 'public':
              default:
                return <Navigate to="/report-problem" replace />;
            }
          })()
        ) : (
          // If user is not logged in, redirect to home
          <Navigate to="/" replace />
        )
      } />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}