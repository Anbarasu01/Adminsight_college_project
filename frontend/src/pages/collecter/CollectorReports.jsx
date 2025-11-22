import React, { useState, useEffect } from 'react';
import { getAllReports, deleteReport, assignCollector } from '../../utils/api';

const CollectorReports = () => {
  const [reports, setReports] = useState([]);
  const [collectors, setCollectors] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [reportsRes, usersRes] = await Promise.all([
        getAllReports(),
        getAllUsers()
      ]);
      setReports(reportsRes.data || []);
      setCollectors(usersRes.data.filter(user => user.role === 'collector') || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReport = async (reportId) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        await deleteReport(reportId);
        fetchData();
      } catch (error) {
        console.error('Error deleting report:', error);
        alert('Failed to delete report');
      }
    }
  };

  const handleAssignCollector = async (reportId, collectorId) => {
    try {
      await assignCollector(reportId, { collectorId });
      fetchData();
    } catch (error) {
      console.error('Error assigning collector:', error);
      alert('Failed to assign collector');
    }
  };

  const filteredReports = reports.filter(report => {
    if (filter === 'all') return true;
    return report.status === filter;
  });

  const getStatusStyles = (status) => {
    const baseStyles = "px-3 py-1 rounded-full text-xs font-semibold";
    switch (status) {
      case 'pending': return `${baseStyles} bg-yellow-100 text-yellow-800`;
      case 'assigned': return `${baseStyles} bg-blue-100 text-blue-800`;
      case 'in_progress': return `${baseStyles} bg-orange-100 text-orange-800`;
      case 'completed': return `${baseStyles} bg-green-100 text-green-800`;
      case 'cancelled': return `${baseStyles} bg-red-100 text-red-800`;
      default: return `${baseStyles} bg-gray-100 text-gray-800`;
    }
  };

  const getPriorityStyles = (priority) => {
    const baseStyles = "px-3 py-1 rounded-full text-xs font-semibold";
    switch (priority) {
      case 'high': return `${baseStyles} bg-red-100 text-red-800`;
      case 'medium': return `${baseStyles} bg-yellow-100 text-yellow-800`;
      case 'low': return `${baseStyles} bg-green-100 text-green-800`;
      default: return `${baseStyles} bg-gray-100 text-gray-800`;
    }
  };

  const formatStatus = (status) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const formatPriority = (priority) => {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Report Management
              </h1>
              <p className="text-gray-600 text-lg">
                View and manage all system reports with assignment capabilities
              </p>
            </div>
            <button 
              onClick={fetchData}
              className="mt-4 lg:mt-0 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold shadow-sm transition-all duration-200 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh Data</span>
            </button>
          </div>
        </div>

        {/* Filters and Stats Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Filter by Status:
              </label>
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
              >
                <option value="all">All Reports</option>
                <option value="pending">Pending</option>
                <option value="assigned">Assigned</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            
            <div className="bg-blue-50 rounded-xl px-4 py-3">
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-blue-700 font-semibold">Total Reports:</span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg font-bold">
                    {reports.length}
                  </span>
                </div>
                <div className="w-px h-6 bg-blue-200"></div>
                <div className="flex items-center space-x-2">
                  <span className="text-blue-700 font-semibold">Showing:</span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg font-bold">
                    {filteredReports.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reports Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">Reports Overview</h3>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600">Loading reports...</p>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">No Reports Found</h4>
              <p className="text-gray-600 max-w-md mx-auto">
                {filter === 'all' 
                  ? "There are no reports in the system yet." 
                  : `No reports found with status "${filter}".`
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Report Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Assignment
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredReports.map(report => (
                    <tr key={report.id} className="hover:bg-gray-50 transition-colors duration-150">
                      {/* Report Details */}
                      <td className="px-6 py-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-sm font-mono text-gray-500 font-semibold">
                                #{report.id}
                              </span>
                            </div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-1">
                              {report.title}
                            </h4>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {report.description}
                            </p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                              <span>
                                Created: {new Date(report.createdAt).toLocaleDateString()}
                              </span>
                              {report.updatedAt && report.updatedAt !== report.createdAt && (
                                <span>
                                  Updated: {new Date(report.updatedAt).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span className={getStatusStyles(report.status)}>
                          {formatStatus(report.status)}
                        </span>
                      </td>

                      {/* Priority */}
                      <td className="px-6 py-4">
                        <span className={getPriorityStyles(report.priority)}>
                          {formatPriority(report.priority)}
                        </span>
                      </td>

                      {/* Assignment */}
                      <td className="px-6 py-4">
                        <select 
                          value={report.assignedCollector || ''}
                          onChange={(e) => handleAssignCollector(report.id, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-sm"
                        >
                          <option value="">Assign Collector</option>
                          {collectors.map(collector => (
                            <option key={collector.id} value={collector.id}>
                              {collector.name}
                            </option>
                          ))}
                        </select>
                        {report.assignedCollector && (
                          <p className="text-green-600 text-xs mt-1 font-medium">
                            ✓ Assigned
                          </p>
                        )}
                      </td>

                      {/* Department */}
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900 font-medium">
                          {report.department || 'Not Assigned'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button 
                            className="text-blue-600 hover:text-blue-800 transition-colors duration-200 p-2 rounded-lg hover:bg-blue-50"
                            title="View Details"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => handleDeleteReport(report.id)}
                            className="text-red-600 hover:text-red-800 transition-colors duration-200 p-2 rounded-lg hover:bg-red-50"
                            title="Delete Report"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollectorReports;