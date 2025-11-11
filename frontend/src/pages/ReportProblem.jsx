import { useState } from "react";
import api from "../utils/api";

export default function ReportProblem() {
  const [data, setData] = useState({
    name: "",
    contact: "",
    department: "Revenue & Disaster Management",
    problem: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/public/report", data);
    alert("Problem submitted successfully!");
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 shadow-md rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Report a Problem</h2>

        <input
          className="border p-2 mb-3 w-full rounded"
          placeholder="Your Name"
          onChange={(e) => setData({ ...data, name: e.target.value })}
        />
        <input
          className="border p-2 mb-3 w-full rounded"
          placeholder="Contact Number"
          onChange={(e) => setData({ ...data, contact: e.target.value })}
        />

        <select
          className="border p-2 mb-3 w-full rounded"
          onChange={(e) => setData({ ...data, department: e.target.value })}
        >
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
          ].map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>

        <textarea
          className="border p-2 mb-3 w-full rounded"
          rows="4"
          placeholder="Describe your problem..."
          onChange={(e) => setData({ ...data, problem: e.target.value })}
        />

        <button className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700">
          Submit Problem
        </button>
      </form>
    </div>
  );
}
