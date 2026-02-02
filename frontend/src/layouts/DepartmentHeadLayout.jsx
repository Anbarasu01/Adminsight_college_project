import { Outlet } from "react-router-dom";
import DepartmentHeadSidebar from "../components/DepartmentHeadSidebar";

const DepartmentHeadLayout = () => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500">
      <DepartmentHeadSidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default DepartmentHeadLayout;
