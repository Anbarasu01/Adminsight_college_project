import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">AI</span>
            </div>
            <span className="text-xl font-bold text-gray-800">ADMINSIGHT</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            {user ? (
              <>
                <Link 
                  to="/report-problem" 
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Report Problem
                </Link>
                <Link 
                  to="/notifications" 
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Notifications
                </Link>
                <button 
                  onClick={logout}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 font-medium"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;