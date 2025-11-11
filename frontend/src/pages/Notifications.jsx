import { useEffect, useState } from "react";
import api from "../utils/api";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await api.get("/notifications");
      setNotifications(res.data);
    };
    fetchData();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Notifications</h2>
      <div className="space-y-3">
        {notifications.map((n) => (
          <div key={n._id} className="bg-white p-4 rounded shadow-md">
            <p className="font-semibold">{n.title}</p>
            <p className="text-gray-600">{n.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
