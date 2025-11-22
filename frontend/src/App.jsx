// import React from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import { AuthProvider, useAuth } from './context/AuthContext';

// // Layouts
// import MainLayout from './layouts/MainLayout';
// import AuthLayout from './layouts/AuthLayout';

// // Import all pages
// import Homepage from './pages/shared/homepage';
// import Login from './pages/auth/Login';
// import Register from './pages/auth/Register';
// import PublicLogin from './pages/auth/PublicLogin';

// // Collector Pages
// import CollectorDashboard from './pages/collector/CollectorDashboard';
// import CollectorUsers from './pages/collector/CollectorUsers';
// import CollectorDepartments from './pages/collector/CollectorDepartments';
// import CollectorReports from './pages/collector/CollectorReports';
// import CollectorNotifications from './pages/collector/CollectorNotifications';

// // Department Head Pages
// import DepartmentDashboard from './pages/department-head/DepartmentDashboard';
// import DepartmentStaff from './pages/department-head/DepartmentStaff';
// import DepartmentReports from './pages/department-head/DepartmentReports';

// // Staff Pages
// import StaffDashboard from './pages/staff/StaffDashboard';
// import StaffTasks from './pages/staff/StaffTasks';

// // Public Pages
// import PublicDashboard from './pages/public/PublicDashboard';
// import ReportProblem from './pages/public/ReportProblem';
// import MyReports from './pages/public/MyReports';

// // Shared Pages
// import Notifications from './pages/shared/Notifications';

// // Layout components
// const DashboardLayout = ({ children }) => {
//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       <Sidebar />
//       <div className="flex-1">
//         <Navbar />
//         <div className="p-6">
//           {children}
//         </div>
//       </div>
//     </div>
//   );
// };

// const PublicLayout = ({ children }) => {
//   return <div className="min-h-screen">{children}</div>;
// };

// // Protected Route components (same as before)
// const ProtectedRoute = ({ children }) => {
//   const { user } = useAuth();
//   return user ? children : <Navigate to="/login" replace />;
// };

// const RoleProtectedRoute = ({ children, allowedRoles }) => {
//   const { user } = useAuth();
//   if (!user) return <Navigate to="/login" replace />;
//   if (!allowedRoles.includes(user.role)) {
//     switch (user.role) {
//       case 'collector': return <Navigate to="/collector/dashboard" replace />;
//       case 'department_head': return <Navigate to="/department/dashboard" replace />;
//       case 'staff': return <Navigate to="/staff/dashboard" replace />;
//       case 'public': return <Navigate to="/public/dashboard" replace />;
//       default: return <Navigate to="/" replace />;
//     }
//   }
//   return children;
// };

// function AppRoutes() {
//   const { user } = useAuth();

//   return (
//     <Routes>
//       {/* Public Routes */}
//       <Route path="/auth" element={<PublicLayout><Homepage /></PublicLayout>} />
//       <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
//       <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />
//       <Route path="/public-login" element={<PublicLayout><PublicLogin /></PublicLayout>} />

//       {/* Collector Routes */}
//       <Route path="/collector/dashboard" element={
//         <RoleProtectedRoute allowedRoles={['collector']}>
//           <DashboardLayout><CollectorDashboard /></DashboardLayout>
//         </RoleProtectedRoute>
//       } />
//       <Route path="/collector/users" element={
//         <RoleProtectedRoute allowedRoles={['collector']}>
//           <DashboardLayout><CollectorUsers /></DashboardLayout>
//         </RoleProtectedRoute>
//       } />
//       <Route path="/collector/departments" element={
//         <RoleProtectedRoute allowedRoles={['collector']}>
//           <DashboardLayout><CollectorDepartments /></DashboardLayout>
//         </RoleProtectedRoute>
//       } />
//       <Route path="/collector/reports" element={
//         <RoleProtectedRoute allowedRoles={['collector']}>
//           <DashboardLayout><CollectorReports /></DashboardLayout>
//         </RoleProtectedRoute>
//       } />
//       <Route path="/collector/notifications" element={
//         <RoleProtectedRoute allowedRoles={['collector']}>
//           <DashboardLayout><CollectorNotifications /></DashboardLayout>
//         </RoleProtectedRoute>
//       } />

//       {/* Department Head Routes */}
//       <Route path="/department/dashboard" element={
//         <RoleProtectedRoute allowedRoles={['department_head']}>
//           <DashboardLayout><DepartmentDashboard /></DashboardLayout>
//         </RoleProtectedRoute>
//       } />
//       <Route path="/department/staff" element={
//         <RoleProtectedRoute allowedRoles={['department_head']}>
//           <DashboardLayout><DepartmentStaff /></DashboardLayout>
//         </RoleProtectedRoute>
//       } />
//       <Route path="/department/reports" element={
//         <RoleProtectedRoute allowedRoles={['department_head']}>
//           <DashboardLayout><DepartmentReports /></DashboardLayout>
//         </RoleProtectedRoute>
//       } />

//       {/* Staff Routes */}
//       <Route path="/staff/dashboard" element={
//         <RoleProtectedRoute allowedRoles={['staff']}>
//           <DashboardLayout><StaffDashboard /></DashboardLayout>
//         </RoleProtectedRoute>
//       } />
//       <Route path="/staff/tasks" element={
//         <RoleProtectedRoute allowedRoles={['staff']}>
//           <DashboardLayout><StaffTasks /></DashboardLayout>
//         </RoleProtectedRoute>
//       } />

//       {/* Public User Routes */}
//       <Route path="/public/dashboard" element={
//         <RoleProtectedRoute allowedRoles={['public']}>
//           <DashboardLayout><PublicDashboard /></DashboardLayout>
//         </RoleProtectedRoute>
//       } />
//       <Route path="/public/report-problem" element={
//         <RoleProtectedRoute allowedRoles={['public']}>
//           <DashboardLayout><ReportProblem /></DashboardLayout>
//         </RoleProtectedRoute>
//       } />
//       <Route path="/public/my-reports" element={
//         <RoleProtectedRoute allowedRoles={['public']}>
//           <DashboardLayout><MyReports /></DashboardLayout>
//         </RoleProtectedRoute>
//       } />

//       {/* Shared Routes */}
//       <Route path="/notifications" element={
//         <ProtectedRoute>
//           <DashboardLayout><Notifications /></DashboardLayout>
//         </ProtectedRoute>
//       } />

//       {/* Redirect based on role */}
//       <Route path="*" element={
//         user ? (
//           (() => {
//             switch (user.role) {
//               case 'collector': return <Navigate to="/collector/dashboard" replace />;
//               case 'department_head': return <Navigate to="/department/dashboard" replace />;
//               case 'staff': return <Navigate to="/staff/dashboard" replace />;
//               case 'public': return <Navigate to="/public/dashboard" replace />;
//               default: return <Navigate to="/" replace />;
//             }
//           })()
//         ) : (
//           <Navigate to="/" replace />
//         )
//       } />
//     </Routes>
//   );
// }

// export default function App() {
//   return (
//     <AuthProvider>
//       <AppRoutes />
//     </AuthProvider>
//   );
// }


import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'

// Context Providers
import { AuthProvider } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'
import { ReportProvider } from './context/ReportContext'
import { ThemeProvider } from './context/ThemeContext'

// Router
import AppRouter from './router'

// CSS
import './css/App.css'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <ReportProvider>
            <Router>
              <div className="App">
                <AppRouter />
              </div>
            </Router>
          </ReportProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App