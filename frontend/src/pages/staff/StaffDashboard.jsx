import React, { useState, useEffect } from 'react';
import { getStaffStats, getAssignedTasks } from '../../utils/api';
import DashboardCard from '../../components/DashboardCard';

const StaffDashboard = () => {
  const [stats, setStats] = useState({
    assignedTasks: 0,
    completed: 0,
    inProgress: 0,
    overdue: 0
  });
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, tasksRes] = await Promise.all([
        getStaffStats(),
        getAssignedTasks()
      ]);
      setStats(statsRes.data);
      setTasks(tasksRes.data);
    } catch (error) {
      console.error('Error fetching staff data:', error);
    }
  };

  return (
    <div className="staff-dashboard">
      <div className="dashboard-header">
        <h1>Staff Dashboard</h1>
        <p>Manage your assigned tasks and reports</p>
      </div>

      <div className="stats-grid">
        <DashboardCard title="Assigned Tasks" value={stats.assignedTasks} icon="📝" color="blue" />
        <DashboardCard title="Completed" value={stats.completed} icon="✅" color="green" />
        <DashboardCard title="In Progress" value={stats.inProgress} icon="🔄" color="yellow" />
        <DashboardCard title="Overdue" value={stats.overdue} icon="⚠️" color="red" />
      </div>

      <div className="recent-tasks">
        <h2>Recent Tasks</h2>
        <div className="tasks-list">
          {tasks.slice(0, 5).map(task => (
            <div key={task.id} className="task-item">
              <h4>{task.title}</h4>
              <p>{task.description}</p>
              <span className={`status ${task.status}`}>{task.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;