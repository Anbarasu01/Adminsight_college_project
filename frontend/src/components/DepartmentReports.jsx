import React, { useState, useEffect } from 'react';
import { getDepartmentReports, assignStaff } from '../utils/api';
import '../css/DepartmentReports.css';

const DepartmentReports = () => {
  const [reports, setReports] = useState([]);
  const [departmentStaff, setDepartmentStaff] = useState([]);

  useEffect(() => {
    fetchDepartmentReports();
    fetchDepartmentStaff();
  }, []);

  const fetchDepartmentReports = async () => {
    try {
      const response = await getDepartmentReports();
      setReports(response.data);
    } catch (error) {
      console.error('Error fetching department reports:', error);
    }
  };

  const fetchDepartmentStaff = async () => {
    // This would fetch staff from the same department
    // const response = await getDepartmentStaff();
    // setDepartmentStaff(response.data);
  };

  const handleAssignStaff = async (reportId, staffId) => {
    try {
      await assignStaff(reportId, { staffId });
      fetchDepartmentReports();
      alert('Staff assigned successfully');
    } catch (error) {
      console.error('Error assigning staff:', error);
    }
  };

  return (
    <div className="department-reports">
      <h2>Department Reports</h2>
      <div className="reports-table">
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
      </div>
    </div>
  );
};

export default DepartmentReports;