import React, { useState, useEffect } from 'react';
import { getUserReports, getPublicStats } from '../../utils/api';
import DashboardCard from '../../components/DashboardCard';

const PublicDashboard = () => {
  const [stats, setStats] = useState({
    reported: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0
  });
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, reportsRes] = await Promise.all([
        getPublicStats(),
        getUserReports()
      ]);
      setStats(statsRes.data);
      setReports(reportsRes.data);
    } catch (error) {
      console.error('Error fetching public data:', error);
    }
  };

  return (
    <div className="public-dashboard">
      <div className="dashboard-header">
        <h1>Public Dashboard</h1>
        <p>Track your reported issues and community updates</p>
      </div>

      <div className="stats-grid">
        <DashboardCard title="Reported Issues" value={stats.reported} icon="📝" color="blue" />
        <DashboardCard title="Pending" value={stats.pending} icon="⏳" color="yellow" />
        <DashboardCard title="In Progress" value={stats.inProgress} icon="🔄" color="purple" />
        <DashboardCard title="Resolved" value={stats.resolved} icon="✅" color="green" />
      </div>

      <div className="recent-reports">
        <h2>Your Recent Reports</h2>
        <div className="reports-list">
          {reports.slice(0, 5).map(report => (
            <div key={report.id} className="report-item">
              <h4>{report.title}</h4>
              <p>Status: <span className={`status ${report.status}`}>{report.status}</span></p>
              <small>Reported on: {new Date(report.createdAt).toLocaleDateString()}</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PublicDashboard;