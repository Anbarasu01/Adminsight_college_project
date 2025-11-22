import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    departmentId: "",
    role: "public",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Special handling for phone number
    if (name === "phoneNumber") {
      // Only allow numbers and limit to 10 digits
      const numbersOnly = value.replace(/\D/g, "").slice(0, 10);
      setForm({ ...form, [name]: numbersOnly });
    } else {
      setForm({ ...form, [name]: value });
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Phone number validation
    if (!form.phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (form.phoneNumber.length !== 10) {
      newErrors.phoneNumber = "Phone number must be exactly 10 digits";
    }

    // Email validation
    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Name validation
    if (!form.name) {
      newErrors.name = "Full name is required";
    } else if (form.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // In the handleSubmit function of Register.jsx, update it like this:
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (validateForm()) {
      try {
        console.log("Form submitted:", form);
        const user = await register(form);

        // Redirect based on user role after registration
        switch (user.role) {
          case "collector":
            navigate("/collector-dashboard");
            break;
          case "departmentHead":
            navigate("/department-dashboard");
            break;
          case "staff":
            navigate("/staff-dashboard");
            break;
          case "public":
          default:
            navigate("/report-problem");
            break;
        }
      } catch (error) {
        console.error("Registration error:", error);
        setErrors({ submit: "Registration failed. Please try again." });
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Left Section */}
      <div className="hidden md:flex w-1/2 bg-blue-600 text-white flex-col justify-center items-center p-10 rounded-r-3xl shadow-xl">
        <h1 className="text-4xl font-extrabold mb-4 tracking-wide">
          ADMINSIGHT
        </h1>
        <p className="text-lg text-blue-100 max-w-sm text-center">
          Simplify administration with smart insights and powerful role-based
          access.
        </p>
        <img
          src="https://cdn-icons-png.flaticon.com/512/2972/2972185.png"
          alt="Register Illustration"
          className="mt-10 w-64 opacity-90 drop-shadow-lg"
        />
      </div>

      {/* Right Section - Registration Form */}
      <div className="flex w-full md:w-1/2 justify-center items-center p-6">
        <form
          onSubmit={handleSubmit}
          className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-200"
          noValidate
        >
          <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
            Create Account
          </h2>

          {errors.submit && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {errors.submit}
            </div>
          )}

          <div className="space-y-4">
            {/* Name */}
            <div>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 ${
                  errors.name
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-blue-400"
                }`}
                required
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 ${
                  errors.email
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-blue-400"
                }`}
                required
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <input
                type="password"
                name="password"
                placeholder="Password (min. 6 characters)"
                value={form.password}
                onChange={handleChange}
                className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 ${
                  errors.password
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-blue-400"
                }`}
                required
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <input
                type="tel"
                name="phoneNumber"
                placeholder="Phone Number (10 digits)"
                value={form.phoneNumber}
                onChange={handleChange}
                className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 ${
                  errors.phoneNumber
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-blue-400"
                }`}
                maxLength="10"
                required
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.phoneNumber}
                </p>
              )}
              {form.phoneNumber && form.phoneNumber.length === 10 && (
                <p className="text-green-500 text-sm mt-1">
                  ✓ Valid phone number
                </p>
              )}
            </div>

            {/* Department ID */}
            <input
              type="text"
              name="departmentId"
              placeholder="Department ID (Optional)"
              value={form.departmentId}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            {/* Role */}
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="public">Public</option>
              <option value="collector">District Collector</option>
              <option value="departmentHead">Department Head</option>
              <option value="staff">Staff</option>
            </select>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-lg font-semibold shadow-md transition duration-300 ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {isLoading ? "Registering..." : "Register"}
            </button>
          </div>

          <p className="text-center text-gray-600 mt-5 text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-medium hover:underline cursor-pointer"
            >
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
