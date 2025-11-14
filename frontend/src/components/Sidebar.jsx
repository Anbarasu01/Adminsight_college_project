import { useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  // Pages where sidebar should NOT appear
  const hideSidebar =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/";

  if (hideSidebar) return null; // Do not render sidebar

  const links = [
    { label: "Report Problem", path: "/report-problem" },
    { label: "Notifications", path: "/notifications" },
  ];

  return (
    <aside className="bg-gray-100 w-64 h-full p-4 border-r">
      <ul className="space-y-3">
        {links.map((link, idx) => (
          <li key={idx}>
            <a href={link.path} className="text-blue-600 hover:underline">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
