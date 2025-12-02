import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import MainLayout from './layouts/MainLayout';

// Public Pages
import ModernHomePage from '../src/pages/homepage.jsx'; // Add this import

// Auth Pages
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import PublicLogin from './pages/auth/PublicLogin.jsx';

// Collector Pages
import CollectorDashboard from './pages/collector/CollectorDashboard.jsx';
import CollectorDepartments from './pages/collector/CollectorDepartments.jsx';
import CollectorProfile from './pages/collector/CollectorProfile.jsx';
import CollectorTasks from './pages/collector/CollectorTasks.jsx';
import CollectorNotifications from './pages/collector/CollectorNotifications.jsx';
import CollectorReports from './pages/collector/CollectorReports.jsx';
import CollectorUsers from './pages/collector/CollectorUsers.jsx';

// Department Head Pages
import DepartmentHeadDashboard from './pages/department-head/DepartmentHeadDashboard.jsx';
import DepartmentHeadProfile from './pages/department-head/DepartmentHeadProfile.jsx';
import DepartmentHeadNotifications from './pages/department-head/DepartmentHeadNotifications.jsx';
import DepartmentReports from './pages/department-head/DepartmentReports.jsx';
import DepartmentStaff from './pages/department-head/DepartmentStaff.jsx';

// Staff Pages
import StaffDashboard from './pages/staff/StaffDashboard.jsx';
import StaffProfile from './pages/staff/StaffProfile.jsx';
import StaffNotifications from './pages/staff/StaffNotifications.jsx';
import StaffTasks from './pages/staff/StaffTasks.jsx';
import ReportProblem from './pages/staff/ReportProblem.jsx';

// Public Pages
import PublicDashboard from './pages/public/PublicDashboard.jsx';
import PublicProfile from './pages/public/PublicProfile.jsx';
import MyReports from './pages/public/MyReports.jsx';
import PublicReportProblem from './pages/public/PublicReportProblem.jsx';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
            <p className="text-gray-600 mb-6">We're sorry, but something went wrong. Please try refreshing the page.</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const AppRouter = () => {
  const { user } = useAuth();

  // Protected Route component
  const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    if (!user) {
      return <Navigate to="/auth/login" replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      return <Navigate to="/unauthorized" replace />;
    }

    return children;
  };

  // Public Route component (redirect if already authenticated)
  const PublicRoute = ({ children }) => {
    if (user) {
      // Redirect to appropriate dashboard based on role
      const dashboardPaths = {
        public: '/public/dashboard',
        staff: '/staff/dashboard',
        collector: '/collector/dashboard',
        departmentHead: '/department-head/dashboard'
      };
      return <Navigate to={dashboardPaths[user.role] || '/dashboard'} replace />;
    }
    return children;
  };

  return (
    <ErrorBoundary>
      <Routes>
        {/* Public Home Page - No authentication required */}
        <Route path="/" element={<ModernHomePage />} />

        {/* Public Auth Routes */}
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
          <Route path="public-login" element={<PublicLogin />} />
          <Route index element={<Navigate to="login" replace />} />
        </Route>

        {/* Protected Routes with Main Layout */}
        <Route 
          path="/*" 
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          {/* Redirect root to appropriate dashboard */}
          <Route index element={<Navigate to="/dashboard" replace />} />

          {/* Collector Routes */}
          <Route 
            path="collector/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['collector']}>
                <CollectorDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="collector/department" 
            element={
              <ProtectedRoute allowedRoles={['collector']}>
                <CollectorDepartments />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="collector/tasks" 
            element={
              <ProtectedRoute allowedRoles={['collector']}>
                <CollectorTasks />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="collector/profile" 
            element={
              <ProtectedRoute allowedRoles={['collector']}>
                <CollectorProfile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="collector/notifications" 
            element={
              <ProtectedRoute allowedRoles={['collector']}>
                <CollectorNotifications />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="collector/reports" 
            element={
              <ProtectedRoute allowedRoles={['collector']}>
                <CollectorReports />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="collector/users" 
            element={
              <ProtectedRoute allowedRoles={['collector']}>
                <CollectorUsers />
              </ProtectedRoute>
            } 
          />

          {/* Department Head Routes */}
          <Route 
            path="department-head/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['departmentHead']}>
                <DepartmentHeadDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="department-head/reports" 
            element={
              <ProtectedRoute allowedRoles={['departmentHead']}>
                <DepartmentReports />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="department-head/staff" 
            element={
              <ProtectedRoute allowedRoles={['departmentHead']}>
                <DepartmentStaff />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="department-head/profile" 
            element={
              <ProtectedRoute allowedRoles={['departmentHead']}>
                <DepartmentHeadProfile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="department-head/notifications" 
            element={
              <ProtectedRoute allowedRoles={['departmentHead']}>
                <DepartmentHeadNotifications />
              </ProtectedRoute>
            } 
          />

          {/* Staff Routes */}
          <Route 
            path="staff/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['staff']}>
                <StaffDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="staff/tasks" 
            element={
              <ProtectedRoute allowedRoles={['staff']}>
                <StaffTasks />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="staff/profile" 
            element={
              <ProtectedRoute allowedRoles={['staff']}>
                <StaffProfile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="staff/notifications" 
            element={
              <ProtectedRoute allowedRoles={['staff']}>
                <StaffNotifications />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="staff/report-problem" 
            element={
              <ProtectedRoute allowedRoles={['staff']}>
                <ReportProblem />
              </ProtectedRoute>
            } 
          />

          {/* Public User Routes */}
          <Route 
            path="public/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['public']}>
                <PublicDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="public/profile" 
            element={
              <ProtectedRoute allowedRoles={['public']}>
                <PublicProfile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="public/my-reports" 
            element={
              <ProtectedRoute allowedRoles={['public']}>
                <MyReports />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="public/report-problem" 
            element={
              <ProtectedRoute allowedRoles={['public']}>
                <PublicReportProblem />
              </ProtectedRoute>
            } 
          />

          {/* Common Routes accessible by all authenticated users */}
          <Route path="dashboard" element={
            user?.role === 'public' ? <PublicDashboard /> :
            user?.role === 'staff' ? <StaffDashboard /> :
            user?.role === 'collector' ? <CollectorDashboard /> :
            user?.role === 'departmentHead' ? <DepartmentHeadDashboard /> :
            <Navigate to="/auth/login" replace />
          } />

          {/* Fallback for unknown routes */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>

        {/* Unauthorized page */}
        <Route path="/unauthorized" element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Unauthorized Access</h1>
              <p className="text-gray-600 mb-6">You don't have permission to access this page.</p>
              <button 
                onClick={() => window.history.back()} 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
              >
                Go Back
              </button>
            </div>
          </div>
        } />

        {/* Catch all route - Redirect to home page instead of login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  );
};

export default AppRouter;