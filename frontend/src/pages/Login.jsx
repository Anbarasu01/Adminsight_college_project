import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [form, setForm] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const user = await login(form.email, form.password);
      
      // Redirect based on user role
      switch (user.role) {
        case 'collector':
          navigate('/collector-dashboard');
          break;
        case 'departmentHead':
          navigate('/department-dashboard');
          break;
        case 'staff':
          navigate('/staff-dashboard');
          break;
        case 'public':
        default:
          navigate('/report-problem');
          break;
      }
    } catch (err) {
      setError("Login failed. Please check your credentials.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Left Section */}
      <div className="hidden md:flex w-1/2 bg-blue-600 text-white flex-col justify-center items-center p-10 rounded-r-3xl shadow-xl">
        <h1 className="text-4xl font-extrabold mb-4 tracking-wide">ADMINSIGHT</h1>
        <p className="text-lg text-blue-100 max-w-sm text-center">
          Access your personalized dashboard based on your role and responsibilities.
        </p>
        <img
          src="https://cdn-icons-png.flaticon.com/512/2990/2990686.png"
          alt="Login Illustration"
          className="mt-10 w-64 opacity-90 drop-shadow-lg"
        />
      </div>

      {/* Right Section - Login Form */}
      <div className="flex w-full md:w-1/2 justify-center items-center p-6">
        <form
          onSubmit={handleSubmit}
          className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-200"
        >
          <h2 className="text-3xl font-bold text-center text-blue-700 mb-2">
            Welcome Back
          </h2>
          <p className="text-center text-gray-600 mb-6">
            Sign in to your account
          </p>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
              autoComplete="email"
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
              autoComplete="current-password"
            />

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-lg font-semibold shadow-md transition duration-300 ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700 text-center font-medium">
              Demo Accounts:
            </p>
            <p className="text-xs text-blue-600 text-center mt-1">
              collector@example.com • department@example.com • staff@example.com
            </p>
          </div>

          <p className="text-center text-gray-600 mt-6 text-sm">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 font-medium hover:underline"
            >
              Register here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;