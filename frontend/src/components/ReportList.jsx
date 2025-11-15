import React, { useState, useEffect } from 'react';
import { getAssignedReports, updateReportStatus } from '../utils/api';
import '../css/ReportList.css';

const ReportList = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAssignedReports();
  }, []);

  const fetchAssignedReports = async () => {
    try {
      const response = await getAssignedReports();
      setReports(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  const handleStatusUpdate = async (reportId, newStatus) => {
    try {
      await updateReportStatus(reportId, { status: newStatus });
      fetchAssignedReports();
      alert('Status updated successfully');
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div className="report-list">
      <h2>Assigned Reports</h2>
      <div className="reports-grid">
        {reports.map(report => (
          <div key={report.id} className="report-card">
            <h3>{report.title}</h3>
            <p className="report-description">{report.description}</p>
            <div className="report-details">
              <p><strong>Location:</strong> {report.location}</p>
              <p><strong>Priority:</strong> 
                <span className={`priority-${report.priority}`}>
                  {report.priority}
                </span>
              </p>
              <p><strong>Reported By:</strong> {report.reportedBy?.name || 'Public User'}</p>
              <p><strong>Date:</strong> {new Date(report.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="status-section">
              <label>Update Status:</label>
              <select 
                value={report.status}
                onChange={(e) => handleStatusUpdate(report.id, e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="assigned">Assigned</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportList;