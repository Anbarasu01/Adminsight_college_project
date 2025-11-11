import React, { useEffect, useState } from "react";
import api from "../utils/api";
import Sidebar from "../components/Sidebar";
import NotificationCard from "../components/NotificationCard";

const DepartmentDashboard = () => {
  const [problems, setProblems] = useState([]);
  const department = localStorage.getItem("department");

  useEffect(() => {
    api.get(`/problems/department/${department}`)
      .then(res => setProblems(res.data))
      .catch(err => console.error(err));
  }, [department]);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/problems/${id}/status`, { status });
      alert(`Status updated to ${status}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <h2 className="text-2xl font-bold mb-4">Department Dashboard</h2>
        {problems.map((p) => (
          <NotificationCard key={p._id} title={p.title} description={p.description}>
            <select
              onChange={(e) => updateStatus(p._id, e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">Update Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </NotificationCard>
        ))}
      </div>
    </div>
  );
};

export default DepartmentDashboard;
