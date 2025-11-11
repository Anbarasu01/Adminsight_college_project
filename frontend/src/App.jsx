import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
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

export default function App() {
  return (
    <AuthProvider>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1">
          <Navbar />
          <div className="p-6">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/public-login" element={<PublicLogin />} />
              <Route path="/report-problem" element={<ReportProblem />} />
              <Route path="/collector-dashboard" element={<CollectorDashboard />} />
              <Route path="/department-dashboard" element={<DepartmentDashboard />} />
              <Route path="/staff-dashboard" element={<StaffDashboard />} />
              <Route path="/notifications" element={<Notifications />} />
            </Routes>
          </div>
        </div>
      </div>
    </AuthProvider>
  );
}
