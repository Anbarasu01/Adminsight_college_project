// import { useState, useContext } from "react";
// import { AuthContext } from "../context/AuthContext";

// const Register = () => {
//   const { register } = useContext(AuthContext);
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//     phone: "",
//     role: "public",
//   });

//   const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     register(form);
//   };

//   return (
//     <div className="flex justify-center items-center h-screen bg-gray-100">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-6 rounded shadow w-96 space-y-3"
//       >
//         <h2 className="text-xl font-semibold text-center">Register</h2>

//         <input
//           type="text"
//           name="name"
//           placeholder="Name"
//           onChange={handleChange}
//           className="w-full border p-2 rounded"
//           required
//         />

//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           onChange={handleChange}
//           className="w-full border p-2 rounded"
//           required
//         />

//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           onChange={handleChange}
//           className="w-full border p-2 rounded"
//           required
//         />

//         <input
//           type="tel"
//           name="phone"
//           placeholder="Phone Number"
//           pattern="[0-9]{10}"
//           maxLength="10"
//           onChange={handleChange}
//           className="w-full border p-2 rounded"
//           required
//         />

//         <select
//           name="role"
//           onChange={handleChange}
//           className="w-full border p-2 rounded"
//           required
//         >
//           <option value="">Select Role</option>
//           <option value="collector">District Collector</option>
//           <option value="departmentHead">Department Head</option>
//           <option value="staff">Staff</option>
//           <option value="Public">Public</option>
//         </select>

//         <button
//           type="submit"
//           className="bg-blue-600 text-white w-full py-2 rounded"
//         >
//           Register
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Register;


import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Register = () => {
  const { register } = useContext(AuthContext);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "public",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    register(form);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Left Section - Illustration / Logo */}
      <div className="hidden md:flex w-1/2 bg-blue-600 text-white flex-col justify-center items-center p-10 rounded-r-3xl shadow-xl">
        <h1 className="text-4xl font-extrabold mb-4 tracking-wide">ADMINSIGHT</h1>
        <p className="text-lg text-blue-100 max-w-sm text-center">
          Simplify administration with smart insights and powerful role-based access.
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
        >
          <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
            Create Account
          </h2>

          <div className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              pattern="[0-9]{10}"
              maxLength="10"
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />

            <select
              name="role"
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="">Select Role</option>
              <option value="collector">District Collector</option>
              <option value="departmentHead">Department Head</option>
              <option value="staff">Staff</option>
              <option value="Public">Public</option>
            </select>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-blue-700 hover:shadow-lg transition duration-300"
            >
              Register
            </button>
          </div>

          <p className="text-center text-gray-600 mt-5 text-sm">
            Already have an account?{" "}
            <span className="text-blue-600 font-medium hover:underline cursor-pointer">
              Login here
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
