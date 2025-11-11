import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  return (
    <nav className="bg-blue-600 text-white flex justify-between items-center px-6 py-3">
      <h1 className="text-xl font-bold">ADMINSIGHT</h1>
      {user ? (
        <button onClick={logout} className="bg-white text-blue-600 px-3 py-1 rounded">
          Logout
        </button>
      ) : null}
    </nav>
  );
};

export default Navbar;
