const Sidebar = () => {
  const links = [
    { label: "Login", path: "/" },
    { label: "Register", path: "/register" },
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
