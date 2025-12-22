// src/pages/staff/StaffDashboard.jsx
import React from 'react';
import './StaffDashboard.css';

const StaffDashboard = () => {
  // Task statistics data
  const taskStats = [
    { id: 1, title: 'Completed', count: 8, icon: '✅', color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.1)', trend: '+2 this week' },
    { id: 2, title: 'In Progress', count: 5, icon: '🔄', color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.1)', trend: '3 active' },
    { id: 3, title: 'Pending', count: 3, icon: '⏳', color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.1)', trend: 'Awaiting review' },
    { id: 4, title: 'Overdue', count: 2, icon: '⚠️', color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.1)', trend: 'Need attention' },
  ];

  // Recent tasks data
  const recentTasks = [
    { id: 1, title: 'Update client documentation', priority: 'high', dueDate: '2024-01-15', status: 'in-progress', assignee: 'You' },
    { id: 2, title: 'Prepare quarterly report', priority: 'medium', dueDate: '2024-01-18', status: 'pending', assignee: 'Team' },
    { id: 3, title: 'Fix critical bug in system', priority: 'high', dueDate: '2024-01-12', status: 'completed', assignee: 'You' },
    { id: 4, title: 'Team meeting preparation', priority: 'low', dueDate: '2024-01-16', status: 'in-progress', assignee: 'You' },
    { id: 5, title: 'Review project proposal', priority: 'medium', dueDate: '2024-01-20', status: 'pending', assignee: 'You' },
  ];

  // Performance metrics
  const performanceMetrics = [
    { label: 'Productivity', value: 87, color: '#10b981' },
    { label: 'Quality', value: 92, color: '#3b82f6' },
    { label: 'Timeliness', value: 78, color: '#f59e0b' },
    { label: 'Collaboration', value: 95, color: '#8b5cf6' },
  ];

  // Upcoming deadlines
  const upcomingDeadlines = [
    { id: 1, task: 'Client presentation', due: 'Today, 3:00 PM', priority: 'high' },
    { id: 2, task: 'Monthly report submission', due: 'Tomorrow', priority: 'medium' },
    { id: 3, task: 'Team retrospective', due: 'Jan 17, 10:00 AM', priority: 'low' },
    { id: 4, task: 'Project milestone review', due: 'Jan 19', priority: 'high' },
  ];

  const getPriorityBadge = (priority) => {
    const styles = {
      high: { bg: '#fee', color: '#dc2626', text: 'High' },
      medium: { bg: '#fef3c7', color: '#d97706', text: 'Medium' },
      low: { bg: '#d1fae5', color: '#059669', text: 'Low' }
    };
    return styles[priority] || styles.medium;
  };

  const getStatusBadge = (status) => {
    const styles = {
      'completed': { bg: '#d1fae5', color: '#059669', text: 'Completed' },
      'in-progress': { bg: '#dbeafe', color: '#2563eb', text: 'In Progress' },
      'pending': { bg: '#fef3c7', color: '#d97706', text: 'Pending' }
    };
    return styles[status] || styles.pending;
  };

  return (
    <div className="staff-dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">Staff Dashboard</h1>
          <p className="dashboard-subtitle">Manage your assigned tasks and reports efficiently</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary">
            <span className="btn-icon">➕</span>
            New Task
          </button>
          <button className="btn-secondary">
            <span className="btn-icon">📊</span>
            Generate Report
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="stats-section">
        <h2 className="section-title">Assignment Tasks Overview</h2>
        <div className="stats-grid">
          {taskStats.map((stat) => (
            <div key={stat.id} className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: stat.bgColor, color: stat.color }}>
                {stat.icon}
              </div>
              <div className="stat-content">
                <h3 className="stat-count">{stat.count}</h3>
                <p className="stat-title">{stat.title}</p>
                <span className="stat-trend">{stat.trend}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="content-grid">
        {/* Left Column - Recent Tasks */}
        <div className="content-column">
          <div className="dashboard-card">
            <div className="card-header">
              <h2 className="card-title">Recent Tasks</h2>
              <button className="card-action">View All →</button>
            </div>
            <div className="task-list">
              {recentTasks.map((task) => {
                const priorityBadge = getPriorityBadge(task.priority);
                const statusBadge = getStatusBadge(task.status);
                
                return (
                  <div key={task.id} className="task-item">
                    <div className="task-main">
                      <div className="task-checkbox">
                        <input type="checkbox" checked={task.status === 'completed'} readOnly />
                      </div>
                      <div className="task-details">
                        <h4 className="task-title">{task.title}</h4>
                        <div className="task-meta">
                          <span className="task-assignee">👤 {task.assignee}</span>
                          <span className="task-date">📅 Due: {task.dueDate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="task-actions">
                      <span 
                        className="priority-badge"
                        style={{ backgroundColor: priorityBadge.bg, color: priorityBadge.color }}
                      >
                        {priorityBadge.text}
                      </span>
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: statusBadge.bg, color: statusBadge.color }}
                      >
                        {statusBadge.text}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="dashboard-card">
            <div className="card-header">
              <h2 className="card-title">Performance Metrics</h2>
              <span className="card-subtitle">This Month</span>
            </div>
            <div className="metrics-grid">
              {performanceMetrics.map((metric, index) => (
                <div key={index} className="metric-item">
                  <div className="metric-header">
                    <span className="metric-label">{metric.label}</span>
                    <span className="metric-value" style={{ color: metric.color }}>
                      {metric.value}%
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ 
                        width: `${metric.value}%`,
                        backgroundColor: metric.color 
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="metric-summary">
              <div className="summary-item">
                <span className="summary-label">Overall Score</span>
                <span className="summary-value">88%</span>
              </div>
              <span className="summary-trend positive">↑ 5% from last month</span>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="content-column">
          {/* Upcoming Deadlines */}
          <div className="dashboard-card">
            <div className="card-header">
              <h2 className="card-title">Upcoming Deadlines</h2>
              <button className="card-action">Calendar →</button>
            </div>
            <div className="deadlines-list">
              {upcomingDeadlines.map((deadline) => {
                const priorityBadge = getPriorityBadge(deadline.priority);
                
                return (
                  <div key={deadline.id} className="deadline-item">
                    <div className="deadline-info">
                      <h4 className="deadline-task">{deadline.task}</h4>
                      <span className="deadline-due">⏰ {deadline.due}</span>
                    </div>
                    <span 
                      className="priority-badge small"
                      style={{ backgroundColor: priorityBadge.bg, color: priorityBadge.color }}
                    >
                      {priorityBadge.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="dashboard-card">
            <div className="card-header">
              <h2 className="card-title">Quick Actions</h2>
            </div>
            <div className="quick-actions-grid">
              <button className="quick-action">
                <span className="action-icon">📋</span>
                <span className="action-label">Submit Timesheet</span>
              </button>
              <button className="quick-action">
                <span className="action-icon">📄</span>
                <span className="action-label">Create Report</span>
              </button>
              <button className="quick-action">
                <span className="action-icon">💬</span>
                <span className="action-label">Request Support</span>
              </button>
              <button className="quick-action">
                <span className="action-icon">📊</span>
                <span className="action-label">View Analytics</span>
              </button>
              <button className="quick-action">
                <span className="action-icon">🔄</span>
                <span className="action-label">Sync Data</span>
              </button>
              <button className="quick-action">
                <span className="action-icon">⚙️</span>
                <span className="action-label">Settings</span>
              </button>
            </div>
          </div>

          {/* Team Activity */}
          <div className="dashboard-card">
            <div className="card-header">
              <h2 className="card-title">Team Activity</h2>
              <span className="card-subtitle">Recent updates</span>
            </div>
            <div className="activity-feed">
              <div className="activity-item">
                <div className="activity-avatar">JD</div>
                <div className="activity-content">
                  <p><strong>John Doe</strong> completed "Client Presentation"</p>
                  <span className="activity-time">2 hours ago</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-avatar">AS</div>
                <div className="activity-content">
                  <p><strong>Alice Smith</strong> requested review on "Q4 Report"</p>
                  <span className="activity-time">4 hours ago</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-avatar">MJ</div>
                <div className="activity-content">
                  <p><strong>Mike Johnson</strong> commented on your task</p>
                  <span className="activity-time">Yesterday</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-avatar">SD</div>
                <div className="activity-content">
                  <p><strong>System</strong> New tasks assigned to you</p>
                  <span className="activity-time">2 days ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Footer */}
      <div className="summary-footer">
        <div className="summary-card">
          <div className="summary-icon">📈</div>
          <div className="summary-content">
            <h3>Productivity Insights</h3>
            <p>You've completed 8 tasks this week. Keep up the great work!</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon">🎯</div>
          <div className="summary-content">
            <h3>Weekly Goals</h3>
            <p>2 tasks remaining to achieve your weekly target</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon">🏆</div>
          <div className="summary-content">
            <h3>Achievements</h3>
            <p>You're in the top 20% of performers this month</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;