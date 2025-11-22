import React, { useState, useEffect } from 'react';
import { getDepartmentReports, assignStaff, getDepartmentStaff } from '../utils/api'; // Fixed import
import '../css/DepartmentReports.css';

const DepartmentReports = () => {
  const [reports, setReports] = useState([]);
  const [departmentStaff, setDepartmentStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDepartmentReports();
    fetchDepartmentStaff();
  }, []);

  const fetchDepartmentReports = async () => {
    try {
      setLoading(true);
      const response = await getDepartmentReports();
      setReports(response.data || []);
    } catch (error) {
      console.error('Error fetching department reports:', error);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartmentStaff = async () => {
    try {
      const response = await getDepartmentStaff();
      setDepartmentStaff(response.data || []);
    } catch (error) {
      console.error('Error fetching department staff:', error);
      setDepartmentStaff([]);
    }
  };

  const handleAssignStaff = async (reportId, staffId) => {
    try {
      await assignStaff(reportId, { staffId });
      fetchDepartmentReports();
      alert('Staff assigned successfully');
    } catch (error) {
      console.error('Error assigning staff:', error);
      alert('Failed to assign staff. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="department-reports">
        <h2>Department Reports</h2>
        <div className="loading">Loading reports...</div>
      </div>
    );
  }

  return (
    <div className="department-reports">
      <h2>Department Reports ({reports.length})</h2>
      <div className="reports-table">
        {reports.length === 0 ? (
          <div className="empty-state">
            <p>No reports available for your department.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Assigned Staff</th>
                <th>Assigned Collector</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map(report => (
                <tr key={report.id}>
                  <td>{report.title}</td>
                  <td>{report.description}</td>
                  <td>
                    <span className={`status-badge status-${report.status}`}>
                      {report.status}
                    </span>
                  </td>
                  <td>{report.priority}</td>
                  <td>
                    <select 
                      value={report.assignedStaff || ''}
                      onChange={(e) => handleAssignStaff(report.id, e.target.value)}
                    >
                      <option value="">Assign Staff</option>
                      {departmentStaff.map(staff => (
                        <option key={staff.id} value={staff.id}>
                          {staff.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>{report.assignedCollector?.name || 'Not assigned'}</td>
                  <td>
                    <button className="view-btn">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DepartmentReports;