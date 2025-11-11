import { useState } from "react";
import api from "../utils/api";

const ProblemForm = () => {
  const [form, setForm] = useState({ title: "", description: "", department: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/problems", form);
    setMessage("Problem reported successfully!");
    setForm({ title: "", description: "", department: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md space-y-3">
      <h2 className="text-xl font-semibold">Report a Problem</h2>
      <input
        type="text"
        name="title"
        placeholder="Problem Title"
        value={form.title}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />
      <textarea
        name="description"
        placeholder="Describe the problem"
        value={form.description}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />
      <select
        name="department"
        value={form.department}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      >
        <option value="">Select Department</option>
        {[
          "Revenue & Disaster Management",
          "Health",
          "Education",
          "Agriculture",
          "Police",
          "Rural Development",
          "Public Works (PWD)",
          "Transport",
          "Social Welfare",
          "Electricity & Water",
        ].map((dept, idx) => (
          <option key={idx} value={dept}>{dept}</option>
        ))}
      </select>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Submit
      </button>
      {message && <p className="text-green-600">{message}</p>}
    </form>
  );
};

export default ProblemForm;
