import { NavLink } from "react-router-dom";

const menuItems = [
  {
    name: "Dashboard",
    path: "/department-head/dashboard",
    icon: "📊",
  },
  {
    name: "Reports",
    path: "/department-head/reports",
    icon: "📑",
  },
  {
    name: "Staff",
    path: "/department-head/staff",
    icon: "👥",
  },
  {
    name: "Notifications",
    path: "/department-head/notifications",
    icon: "🔔",
  },
  {
    name: "Profile",
    path: "/department-head/profile",
    icon: "⚙️",
  },
];

const DepartmentHeadSidebar = () => {
  return (
    <aside className="w-64 min-h-screen bg-white/10 backdrop-blur-xl border-r border-white/20 p-5">
      {/* Logo */}
      <div className="mb-10 flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold">
          DH
        </div>
        <h2 className="text-white font-bold text-lg">
          Dept Head
        </h2>
      </div>

      {/* Menu */}
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300
              ${
                isActive
                  ? "bg-white/20 text-white shadow-lg"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default DepartmentHeadSidebar;
