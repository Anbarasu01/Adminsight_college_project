import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'collector': return 'District Collector';
      case 'departmentHead': return 'Department Head';
      case 'staff': return 'Staff';
      case 'public': return 'Public User';
      default: return 'User';
    }
  };

  return (
    <nav className="bg-white shadow-lg border-b-2 border-blue-600">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-600">ADMINSIGHT</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <span className="text-gray-700 font-medium">{user?.name}</span>
              <p className="text-sm text-gray-500">{getRoleDisplayName(user?.role)}</p>
            </div>
            <button
              onClick={logout}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;