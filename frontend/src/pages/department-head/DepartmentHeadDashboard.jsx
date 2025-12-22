import React, { useEffect, useState } from "react";
import api from "../../utils/api";

const DepartmentHeadDashboard = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    batched: 0
  });
  const [filter, setFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const department = localStorage.getItem("department");

  useEffect(() => {
    fetchProblems();
  }, [department]);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/problems/department/${department}`);
      setProblems(res.data);
      calculateStats(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (problemsData) => {
    const stats = {
      total: problemsData.length,
      pending: problemsData.filter(p => p.status === 'Pending').length,
      inProgress: problemsData.filter(p => p.status === 'In Progress').length,
      resolved: problemsData.filter(p => p.status === 'Resolved').length,
      batched: problemsData.filter(p => p.status === 'Batched').length
    };
    setStats(stats);
  };

  const updateStatus = async (id, status) => {
    try {
      setRefreshing(true);
      await api.put(`/problems/${id}/status`, { status });
      
      // Update local state immediately for better UX
      setProblems(prev => prev.map(p => 
        p._id === id ? { ...p, status } : p
      ));
      
      // Recalculate stats
      calculateStats(problems.map(p => p._id === id ? { ...p, status } : p));
      
    } catch (error) {
      console.error(error);
      alert('Failed to update status');
    } finally {
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchProblems();
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': 
        return 'bg-gradient-to-r from-orange-50 to-amber-50 text-orange-800 border border-orange-200';
      case 'In Progress': 
        return 'bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-800 border border-blue-200';
      case 'Resolved': 
        return 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border border-green-200';
      case 'Batched':
        return 'bg-gradient-to-r from-purple-50 to-violet-50 text-purple-800 border border-purple-200';
      default: 
        return 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'In Progress':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        );
      case 'Resolved':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'Batched':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border border-green-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const filteredProblems = problems.filter(problem => {
    if (filter === 'all') return true;
    return problem.status === filter;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Enhanced status options with icons
  const statusOptions = [
    { value: 'Pending', label: 'Pending', color: 'text-orange-600', icon: '🕒' },
    { value: 'In Progress', label: 'In Progress', color: 'text-blue-600', icon: '⚡' },
    { value: 'Batched', label: 'Batched', color: 'text-purple-600', icon: '📦' },
    { value: 'Resolved', label: 'Resolved', color: 'text-green-600', icon: '✅' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      {/* Stats Overview Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Problems Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Problems</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500">Across all statuses</p>
          </div>
        </div>

        {/* Pending Card */}
        <div className="bg-white rounded-2xl shadow-lg border-l-4 border-orange-500 p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Pending</p>
              <p className="text-3xl font-bold text-orange-600">{stats.pending}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-orange-100">
            <p className="text-xs text-orange-600 font-medium">Awaiting action</p>
          </div>
        </div>

        {/* In Progress Card */}
        <div className="bg-white rounded-2xl shadow-lg border-l-4 border-blue-500 p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">In Progress</p>
              <p className="text-3xl font-bold text-blue-600">{stats.inProgress}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-blue-100">
            <p className="text-xs text-blue-600 font-medium">Active investigations</p>
          </div>
        </div>

        {/* Batched Card */}
        <div className="bg-white rounded-2xl shadow-lg border-l-4 border-purple-500 p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Batched</p>
              <p className="text-3xl font-bold text-purple-600">{stats.batched}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-violet-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-purple-100">
            <p className="text-xs text-purple-600 font-medium">Grouped for processing</p>
          </div>
        </div>
      </div>

      {/* Filter & Controls Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Problem Management</h2>
            <p className="text-gray-600 text-sm">Filter and manage department issues</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-3 rounded-xl font-medium flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              {refreshing ? 'Refreshing...' : 'Refresh Data'}
            </button>
          </div>
        </div>
        
        {/* Filter Tabs */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Filter by Status:</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleFilterChange('all')}
              className={`px-5 py-3 rounded-xl font-medium transition-all duration-200 ${filter === 'all' 
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm'}`}
            >
              All Problems
            </button>
            
            <button
              onClick={() => handleFilterChange('Pending')}
              className={`px-5 py-3 rounded-xl font-medium transition-all duration-200 ${filter === 'Pending' 
                ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm'}`}
            >
              Pending
            </button>
            
            <button
              onClick={() => handleFilterChange('In Progress')}
              className={`px-5 py-3 rounded-xl font-medium transition-all duration-200 ${filter === 'In Progress' 
                ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-md' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm'}`}
            >
              In Progress
            </button>
            
            <button
              onClick={() => handleFilterChange('Batched')}
              className={`px-5 py-3 rounded-xl font-medium transition-all duration-200 ${filter === 'Batched' 
                ? 'bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-md' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm'}`}
            >
              Batched
            </button>

            <button
              onClick={() => handleFilterChange('Resolved')}
              className={`px-5 py-3 rounded-xl font-medium transition-all duration-200 ${filter === 'Resolved' 
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm'}`}
            >
              Resolved
            </button>
          </div>
        </div>
        
        {/* Active Filter Display */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-800">
                Active Filter: <span className="font-bold capitalize">{filter === 'all' ? 'All Problems' : filter}</span>
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Showing problems based on selected status filter
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-blue-800">
                Displaying <span className="font-bold text-xl">{filteredProblems.length}</span> of <span className="font-bold">{problems.length}</span> problems
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Problems List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
          <p className="text-gray-600 font-medium">Loading problems...</p>
          <p className="text-gray-500 text-sm mt-1">Fetching data for {department} department</p>
        </div>
      ) : filteredProblems.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">No Problems Found</h3>
          <p className="text-gray-600 max-w-md mx-auto mb-8">
            {filter === 'all' 
              ? `There are currently no problems reported for ${department} department.` 
              : `No problems found with status "${filter}" in ${department} department.`
            }
          </p>
          <button
            onClick={handleRefresh}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium inline-flex items-center gap-2 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh Data
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProblems.map((problem) => (
            <div key={problem._id} className="bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden group">
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  {/* Problem Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {problem.title}
                          </h3>
                          {problem.priority && (
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityColor(problem.priority)}`}>
                              {problem.priority.toUpperCase()}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 leading-relaxed mb-4">
                          {problem.description}
                        </p>
                      </div>
                    </div>

                    {/* Problem Metadata */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Status */}
                      <div className="flex items-center gap-2">
                        <div className="flex-shrink-0">
                          {getStatusIcon(problem.status)}
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500">Status</p>
                          <span className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${getStatusColor(problem.status)}`}>
                            {problem.status}
                          </span>
                        </div>
                      </div>

                      {/* Reported Date */}
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <div>
                          <p className="text-xs font-medium text-gray-500">Reported</p>
                          <p className="text-sm font-medium text-gray-900">{formatDate(problem.createdAt)}</p>
                        </div>
                      </div>

                      {/* Reporter */}
                      {problem.reporter && (
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <div>
                            <p className="text-xs font-medium text-gray-500">Reported By</p>
                            <p className="text-sm font-medium text-gray-900">{problem.reporter}</p>
                          </div>
                        </div>
                      )}

                      {/* Location */}
                      {problem.location && (
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <div>
                            <p className="text-xs font-medium text-gray-500">Location</p>
                            <p className="text-sm font-medium text-gray-900">{problem.location}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status Update */}
                  <div className="lg:w-60 flex-shrink-0">
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4">
                      <label className="block text-sm font-bold text-gray-900 mb-3">
                        Update Status
                      </label>
                      <div className="space-y-2">
                        {statusOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => updateStatus(problem._id, option.value)}
                            disabled={refreshing}
                            className={`w-full px-4 py-2.5 rounded-lg flex items-center justify-between transition-all duration-200 ${
                              problem.status === option.value
                                ? 'bg-white shadow-md border border-gray-200'
                                : 'hover:bg-white hover:shadow-sm'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className={`text-lg ${option.color}`}>{option.icon}</span>
                              <span className={`text-sm font-medium ${
                                problem.status === option.value ? 'text-gray-900' : 'text-gray-600'
                              }`}>
                                {option.label}
                              </span>
                            </div>
                            {problem.status === option.value && (
                              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DepartmentHeadDashboard;