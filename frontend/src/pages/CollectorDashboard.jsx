// src/pages/CollectorDashboard.jsx
import React, { useEffect, useState } from "react";
import api from "../utils/api";
import Sidebar from "../components/Sidebar";
import NotificationCard from "../components/NotificationCard";

const CollectorDashboard = () => {
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    api.get("/problems")
      .then(res => setProblems(res.data))
      .catch(err => console.error(err));
  }, []);

  const assignDepartment = async (problemId, department) => {
    try {
      await api.put(`/problems/${problemId}/assign`, { department });
      alert(`Problem assigned to ${department}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <h2 className="text-2xl font-bold mb-4">Collector Dashboard</h2>
        {problems.map((p) => (
          <NotificationCard key={p._id} title={p.title} description={p.description}>
            <select
              onChange={(e) => assignDepartment(p._id, e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">Assign Department</option>
              <option value="Revenue & Disaster Management">Revenue & Disaster Management</option>
              <option value="Health">Health</option>
              <option value="Education">Education</option>
              <option value="Agriculture">Agriculture</option>
              <option value="Police">Police</option>
              <option value="Rural Development">Rural Development</option>
              <option value="Public Works (PWD)">Public Works (PWD)</option>
              <option value="Transport">Transport</option>
              <option value="Social Welfare">Social Welfare</option>
              <option value="Electricity & Water">Electricity & Water</option>
            </select>
          </NotificationCard>
        ))}
      </div>
    </div>
  );
};

export default CollectorDashboard;
