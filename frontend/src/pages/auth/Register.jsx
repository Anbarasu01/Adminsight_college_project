import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { 
  EyeIcon, 
  EyeSlashIcon, 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  KeyIcon, 
  UserGroupIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ShieldCheckIcon,
  MapPinIcon 
} from "@heroicons/react/24/outline";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  // Departments (for staff and department_head)
  const [departments, setDepartments] = useState([
    { _id: "65f8a1b2c3d4e5f6a7b8c9d0", name: "Health Department" },
    { _id: "65f8a1b2c3d4e5f6a7b8c9d1", name: "Education Department" },
    { _id: "65f8a1b2c3d4e5f6a7b8c9d2", name: "Public Works Department" },
    { _id: "65f8a1b2c3d4e5f6a7b8c9d3", name: "Revenue Department" },
  ]);

  // Districts (for collectors - if needed)
  const [districts, setDistricts] = useState([
    { _id: "d1", name: "Chennai District" },
    { _id: "d2", name: "Coimbatore District" },
    { _id: "d3", name: "Madurai District" },
    { _id: "d4", name: "Tiruchirappalli District" },
  ]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "staff",
    department_id: "", // For staff only
    managesDepartment: "", // For department_head only
    // Note: collectors don't have department fields
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Reset fields when role changes
  useEffect(() => {
    if (form.role === "staff") {
      setForm(prev => ({ 
        ...prev, 
        department_id: departments[0]?._id || "",
        managesDepartment: "" 
      }));
    } else if (form.role === "department_head") {
      setForm(prev => ({ 
        ...prev, 
        managesDepartment: departments[0]?._id || "",
        department_id: "" 
      }));
    } else {
      // For collector and public - clear department fields
      setForm(prev => ({ 
        ...prev, 
        department_id: "",
        managesDepartment: ""
      }));
    }
  }, [form.role, departments]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const numbersOnly = value.replace(/\D/g, "").slice(0, 10);
      setForm({ ...form, phone: numbersOnly });
    } else {
      setForm({ ...form, [name]: value });
    }

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
    
    if (errors.submit) {
      setErrors({ ...errors, submit: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim() || form.name.trim().length < 2)
      newErrors.name = "Name must be at least 2 characters";

    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Please enter a valid email address";

    if (!form.password || form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (!form.phone || form.phone.length !== 10)
      newErrors.phone = "Phone number must be 10 digits";

    if (!form.role)
      newErrors.role = "Please select a role";

    // Department validation - ONLY for staff
    if (form.role === "staff" && !form.department_id) {
      newErrors.department_id = "Department is required for staff";
    }

    // Department validation for department_head
    if (form.role === "department_head" && !form.managesDepartment) {
      newErrors.managesDepartment = "Please select a department to manage";
    }

    // Note: No department validation for collector or public

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Map frontend role to backend role name
      const roleMapping = {
        staff: "staff",
        collector: "collector", 
        departmentHead: "department_head",
        public: "public"
      };

      // Prepare payload
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        role: roleMapping[form.role] || form.role,
      };

      // Add department field ONLY for staff
      if (form.role === "staff") {
        payload.department_id = form.department_id;
      } 
      // Add managesDepartment for department_head
      else if (form.role === "departmentHead") {
        payload.managesDepartment = form.managesDepartment;
      }
      // Collector and public get no department fields

      console.log("Register Payload:", payload);

      const user = await register(payload);

      // Navigate based on role
      const routeMapping = {
        staff: "/staff/dashboard",
        collector: "/collector/dashboard",
        department_head: "/department-head/dashboard",
        public: "/public/dashboard"
      };

      navigate(routeMapping[user.role] || "/dashboard");

    } catch (error) {
      console.error("Registration error:", error?.response?.data || error);
      setErrors({
        submit: error?.response?.data?.message || "Registration failed. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleDisplayName = (role) => {
    const roleNames = {
      staff: "Staff Member",
      collector: "District Collector", 
      departmentHead: "Department Head",
      public: "Public User"
    };
    return roleNames[role] || role;
  };

  const getRoleDescription = (role) => {
    const descriptions = {
      staff: "Assigned to a specific department with defined responsibilities",
      collector: "Oversees district administration and public services",
      departmentHead: "Manages a specific department and its staff",
      public: "Access public services and submit requests/complaints"
    };
    return descriptions[role] || "";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-4xl flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-2xl">
        {/* Left Panel */}
        <div className="md:w-2/5 bg-gradient-to-br from-blue-600 to-indigo-800 text-white p-8 md:p-12 flex flex-col justify-between">
          <div>
            <div className="flex items-center mb-8">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center mr-3">
                <KeyIcon className="h-6 w-6" />
              </div>
              <h1 className="text-2xl font-bold">GovPortal</h1>
            </div>
            
            <h2 className="text-3xl font-bold mb-4">Join Our Platform</h2>
            <p className="text-blue-100 mb-8">
              Create an account to access government services. Different roles have different permissions and responsibilities.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <CheckCircleIcon className="h-6 w-6 mr-3 flex-shrink-0 text-green-300" />
                <div>
                  <h3 className="font-semibold">{getRoleDisplayName(form.role)}</h3>
                  <p className="text-sm text-blue-100">{getRoleDescription(form.role)}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <CheckCircleIcon className="h-6 w-6 mr-3 flex-shrink-0 text-green-300" />
                <div>
                  <h3 className="font-semibold">Role-Specific Access</h3>
                  <p className="text-sm text-blue-100">
                    {form.role === "collector" 
                      ? "District-wide administrative access"
                      : form.role === "departmentHead"
                      ? "Department management privileges"
                      : form.role === "staff"
                      ? "Department-specific workflow access"
                      : "Public service access"}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <CheckCircleIcon className="h-6 w-6 mr-3 flex-shrink-0 text-green-300" />
                <div>
                  <h3 className="font-semibold">Secure Platform</h3>
                  <p className="text-sm text-blue-100">Government-grade security for all data and transactions</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-blue-500">
            <p className="text-blue-100">
              Already have an account?{" "}
              <Link to="/auth/login" className="font-bold text-white hover:text-blue-200 transition">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
        
        {/* Right Panel - Form */}
        <div className="md:w-3/5 bg-white p-8 md:p-12">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
              <p className="text-gray-600 mt-2">
                Register as: <span className="font-semibold text-blue-600">{getRoleDisplayName(form.role)}</span>
              </p>
            </div>
            
            {errors.submit && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start">
                <ExclamationCircleIcon className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-red-700">{errors.submit}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center">
                    <UserIcon className="h-4 w-4 mr-1" />
                    Full Name
                  </div>
                </label>
                <div className={`relative rounded-lg border ${errors.name && isSubmitted ? 'border-red-300' : 'border-gray-300'} focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200`}>
                  <input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full py-3 px-4 rounded-lg focus:outline-none"
                  />
                </div>
                {errors.name && isSubmitted && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center">
                    <EnvelopeIcon className="h-4 w-4 mr-1" />
                    Email Address
                  </div>
                </label>
                <div className={`relative rounded-lg border ${errors.email && isSubmitted ? 'border-red-300' : 'border-gray-300'} focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200`}>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full py-3 px-4 rounded-lg focus:outline-none"
                  />
                </div>
                {errors.email && isSubmitted && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center">
                    <KeyIcon className="h-4 w-4 mr-1" />
                    Password
                  </div>
                </label>
                <div className={`relative rounded-lg border ${errors.password && isSubmitted ? 'border-red-300' : 'border-gray-300'} focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200`}>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="At least 6 characters"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full py-3 px-4 rounded-lg focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && isSubmitted && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center">
                    <PhoneIcon className="h-4 w-4 mr-1" />
                    Phone Number
                  </div>
                </label>
                <div className={`relative rounded-lg border ${errors.phone && isSubmitted ? 'border-red-300' : 'border-gray-300'} focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200`}>
                  <div className="flex items-center">
                    <span className="py-3 px-4 border-r border-gray-300 text-gray-600">+91</span>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="9876543210"
                      value={form.phone}
                      onChange={handleChange}
                      className="w-full py-3 px-4 rounded-r-lg focus:outline-none"
                      maxLength="10"
                    />
                  </div>
                </div>
                {errors.phone && isSubmitted && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center">
                    <UserGroupIcon className="h-4 w-4 mr-1" />
                    Select Your Role
                  </div>
                </label>
                <div className={`relative rounded-lg border ${errors.role && isSubmitted ? 'border-red-300' : 'border-gray-300'} focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200`}>
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="w-full py-3 px-4 rounded-lg bg-white focus:outline-none appearance-none"
                  >
                    <option value="">Select your role</option>
                    <option value="collector">District Collector</option>
                    <option value="departmentHead">Department Head</option>
                    <option value="staff">Staff Member</option>
                    <option value="public">Public User</option>
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
                {errors.role && isSubmitted && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                    {errors.role}
                  </p>
                )}
              </div>

              {/* Department for Staff ONLY */}
              {form.role === "staff" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center">
                      <BuildingOfficeIcon className="h-4 w-4 mr-1" />
                      Assigned Department
                    </div>
                  </label>
                  <div className={`relative rounded-lg border ${errors.department_id && isSubmitted ? 'border-red-300' : 'border-gray-300'} focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200`}>
                    <select
                      name="department_id"
                      value={form.department_id}
                      onChange={handleChange}
                      className="w-full py-3 px-4 rounded-lg bg-white focus:outline-none appearance-none"
                    >
                      <option value="">Select department</option>
                      {departments.map(dept => (
                        <option key={dept._id} value={dept._id}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </div>
                  {errors.department_id && isSubmitted && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                      {errors.department_id}
                    </p>
                  )}
                  <p className="mt-1 text-sm text-gray-500">
                    Staff members must be assigned to a department for workflow assignment.
                  </p>
                </div>
              )}

              {/* Department for Department Head */}
              {form.role === "departmentHead" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center">
                      <ShieldCheckIcon className="h-4 w-4 mr-1" />
                      Department to Manage
                    </div>
                  </label>
                  <div className={`relative rounded-lg border ${errors.managesDepartment && isSubmitted ? 'border-red-300' : 'border-gray-300'} focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200`}>
                    <select
                      name="managesDepartment"
                      value={form.managesDepartment}
                      onChange={handleChange}
                      className="w-full py-3 px-4 rounded-lg bg-white focus:outline-none appearance-none"
                    >
                      <option value="">Select department to manage</option>
                      {departments.map(dept => (
                        <option key={dept._id} value={dept._id}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </div>
                  {errors.managesDepartment && isSubmitted && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                      {errors.managesDepartment}
                    </p>
                  )}
                  <p className="mt-1 text-sm text-gray-500">
                    Department Heads manage specific departments and oversee staff.
                  </p>
                </div>
              )}

              {/* Note for Collector */}
              {form.role === "collector" && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start">
                    <MapPinIcon className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm text-blue-700 font-medium">District Collector Role</p>
                      <p className="text-sm text-blue-600 mt-1">
                        District Collectors have administrative authority over entire districts.
                        You'll be assigned district-wide responsibilities after registration.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Note for Public Users */}
              {form.role === "public" && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-700">
                    <strong>Public User Account:</strong> You'll have access to public services and can submit requests/complaints to government departments.
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold py-3.5 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Account...
                    </span>
                  ) : (
                    `Register as ${getRoleDisplayName(form.role)}`
                  )}
                </button>
              </div>
              
              <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-gray-600 text-sm">
                  Already have an account?{" "}
                  <Link to="/auth/login" className="text-blue-600 font-medium hover:text-blue-800">
                    Login here
                  </Link>
                </p>
                <p className="text-gray-500 text-xs mt-2">
                  By creating an account, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;