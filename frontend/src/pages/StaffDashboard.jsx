import React, { useEffect, useState } from "react";
import api from "../utils/api";
import Sidebar from "../components/Sidebar";
import NotificationCard from "../components/NotificationCard";

const StaffDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const staffId = localStorage.getItem("userId");

  useEffect(() => {
    api.get(`/tasks/staff/${staffId}`)
      .then(res => setTasks(res.data))
      .catch(err => console.error(err));
  }, [staffId]);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <h2 className="text-2xl font-bold mb-4">Staff Dashboard</h2>
        {tasks.map((t) => (
          <NotificationCard key={t._id} title={t.title} description={t.description}>
            <p>Status: {t.status}</p>
          </NotificationCard>
        ))}
      </div>
    </div>
  );
};

export default StaffDashboard;
