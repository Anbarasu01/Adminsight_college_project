import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CollectorLayout from '../../layouts/CollectorLayout';

const CollectorReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReportForm, setShowReportForm] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [reportForm, setReportForm] = useState({
    title: '',
    type: 'daily',
    period: 'today',
    startDate: '',
    endDate: '',
    includeDetails: true,
    includeCharts: true
  });
  const [performanceMetrics, setPerformanceMetrics] = useState({
    collectionRate: 85.5,
    successPercentage: 92.3,
    dailyTarget: 5000,
    weeklyTarget: 25000,
    dailyAchieved: 4250,
    weeklyAchieved: 21500,
    totalCustomers: 5,
    activeCustomers: 4,
    overdueCustomers: 2,
    totalBalance: 9800.50,
    collectedThisMonth: 28500.75
  });
  const [historicalData, setHistoricalData] = useState([]);
  const navigate = useNavigate();

  // Mock collector ID
  const collectorId = 'collector_001';

  useEffect(() => {
    fetchPersonalReports();
    fetchPerformanceMetrics();
    fetchHistoricalData();
  }, []);

  const fetchPersonalReports = async () => {
    setLoading(true);
    try {
      // Mock personal reports for this collector only
      const mockReports = [
        {
          id: '1',
          title: 'Daily Collection Report - Jan 15, 2024',
          description: 'Summary of collections made today in Area A1',
          type: 'daily',
          status: 'completed',
          period: '2024-01-15',
          collectorId: collectorId,
          createdAt: '2024-01-15T16:30:00Z',
          generatedBy: 'System',
          data: {
            totalCollections: 3,
            totalAmount: 1500.75,
            customersVisited: 3,
            successfulCollections: 2,
            pendingFollowups: 1
          },
          exportable: true
        },
        {
          id: '2',
          title: 'Weekly Performance Report - Week 2, Jan 2024',
          description: 'Weekly performance summary and collection trends',
          type: 'weekly',
          status: 'completed',
          period: '2024-01-08 to 2024-01-12',
          collectorId: collectorId,
          createdAt: '2024-01-12T17:45:00Z',
          generatedBy: 'Self',
          data: {
            totalCollections: 12,
            totalAmount: 5250.50,
            customersVisited: 15,
            successfulCollections: 10,
            pendingFollowups: 2,
            collectionRate: '85.5%'
          },
          exportable: true
        },
        {
          id: '3',
          title: 'Overdue Customers Report',
          description: 'List of customers with overdue payments',
          type: 'customer',
          status: 'completed',
          period: 'As of Jan 15, 2024',
          collectorId: collectorId,
          createdAt: '2024-01-15T10:15:00Z',
          generatedBy: 'System',
          data: {
            totalOverdue: 2,
            totalAmount: 7700.50,
            averageOverdueDays: 20,
            customers: ['Jane Smith', 'Mike Brown']
          },
          exportable: true
        },
        {
          id: '4',
          title: 'Monthly Collection Forecast - February 2024',
          description: 'Projected collections based on current performance',
          type: 'forecast',
          status: 'pending',
          period: 'February 2024',
          collectorId: collectorId,
          createdAt: '2024-01-14T14:20:00Z',
          generatedBy: 'Self',
          data: {
            projectedCollections: 28,
            projectedAmount: 32000.00,
            expectedGrowth: '12%'
          },
          exportable: false
        }
      ];

      await new Promise(resolve => setTimeout(resolve, 500));
      setReports(mockReports);
    } catch (error) {
      console.error('Error fetching reports:', error);
      alert('Failed to load reports. Using demo data.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPerformanceMetrics = async () => {
    try {
      // Mock performance metrics
      const mockMetrics = {
        collectionRate: 85.5,
        successPercentage: 92.3,
        dailyTarget: 5000,
        weeklyTarget: 25000,
        dailyAchieved: 4250,
        weeklyAchieved: 21500,
        totalCustomers: 5,
        activeCustomers: 4,
        overdueCustomers: 2,
        totalBalance: 9800.50,
        collectedThisMonth: 28500.75,
        avgCollectionPerDay: 1425.38,
        tasksCompleted: 15,
        tasksPending: 3
      };
      
      setPerformanceMetrics(mockMetrics);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  const fetchHistoricalData = async () => {
    try {
      // Mock historical performance data
      const mockHistory = [
        { month: 'Oct 2023', collections: 18, amount: 24500.00, rate: 82.1 },
        { month: 'Nov 2023', collections: 22, amount: 28500.50, rate: 85.3 },
        { month: 'Dec 2023', collections: 25, amount: 31500.75, rate: 88.7 },
        { month: 'Jan 2024', collections: 12, amount: 15500.25, rate: 85.5 }
      ];
      
      setHistoricalData(mockHistory);
    } catch (error) {
      console.error('Error fetching historical data:', error);
    }
  };

  const generateReport = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Validate form
      if (!reportForm.title || !reportForm.type) {
        alert('Please fill in all required fields');
        setLoading(false);
        return;
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newReport = {
        id: String(reports.length + 1),
        title: reportForm.title,
        description: `Generated ${reportForm.type} report for ${reportForm.period}`,
        type: reportForm.type,
        status: 'completed',
        period: reportForm.period === 'custom' 
          ? `${reportForm.startDate} to ${reportForm.endDate}`
          : reportForm.period,
        collectorId: collectorId,
        createdAt: new Date().toISOString(),
        generatedBy: 'Self',
        data: {
          collectionRate: performanceMetrics.collectionRate,
          totalCollections: Math.floor(Math.random() * 20) + 5,
          totalAmount: Math.floor(Math.random() * 20000) + 5000,
          customersVisited: Math.floor(Math.random() * 15) + 3
        },
        exportable: true
      };
      
      setReports(prev => [newReport, ...prev]);
      
      // Reset form
      setReportForm({
        title: '',
        type: 'daily',
        period: 'today',
        startDate: '',
        endDate: '',
        includeDetails: true,
        includeCharts: true
      });
      
      setShowReportForm(false);
      alert(`Report "${newReport.title}" generated successfully!`);
      
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const exportReport = (reportId, format) => {
    const report = reports.find(r => r.id === reportId);
    if (!report) return;
    
    if (!report.exportable) {
      alert('This report cannot be exported');
      return;
    }
    
    // Mock export functionality
    const exportData = {
      report: report,
      metrics: performanceMetrics,
      exportedAt: new Date().toISOString(),
      exportedBy: 'Collector'
    };
    
    if (format === 'pdf') {
      alert(`PDF export started for: ${report.title}\n\nIn a real app, this would download a PDF file.`);
      // In real app: generate and download PDF
    } else if (format === 'excel') {
      alert(`Excel export started for: ${report.title}\n\nIn a real app, this would download an Excel file.`);
      // In real app: generate and download Excel
    } else if (format === 'print') {
      alert(`Print preview for: ${report.title}\n\nIn a real app, this would open print dialog.`);
      // In real app: window.print();
    }
    
    setShowExportMenu(false);
  };

  const deleteReport = (reportId) => {
    if (window.confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
      const report = reports.find(r => r.id === reportId);
      if (report && report.collectorId === collectorId) {
        setReports(prev => prev.filter(r => r.id !== reportId));
        alert('Report deleted successfully');
      } else {
        alert('You can only delete your own reports');
      }
    }
  };

  const viewReportDetails = (report) => {
    const details = [
      `📋 Title: ${report.title}`,
      `📄 Type: ${report.type.toUpperCase()} Report`,
      `📅 Period: ${report.period}`,
      `🔄 Status: ${report.status}`,
      `👤 Generated By: ${report.generatedBy}`,
      `📅 Created: ${new Date(report.createdAt).toLocaleString()}`,
      `\n📊 Report Data:`,
      ...Object.entries(report.data || {}).map(([key, value]) => 
        `  • ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}: ${value}`
      )
    ].join('\n');
    
    alert(`Report Details:\n\n${details}`);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'daily': return '📅';
      case 'weekly': return '📊';
      case 'monthly': return '📈';
      case 'customer': return '👥';
      case 'forecast': return '🔮';
      default: return '📋';
    }
  };

  return (
    <CollectorLayout 
      title="My Reports" 
      description="Generate and view your personal collection reports"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Performance Metrics */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-100">
            <h2 className="text-xl font-bold text-gray-900">Performance Summary</h2>
            <p className="text-gray-600 text-sm mt-1">Your personal collection metrics</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-700 font-medium">Collection Rate</p>
                    <p className="text-2xl font-bold text-blue-900">{performanceMetrics.collectionRate}%</p>
                  </div>
                  <span className="text-2xl">📈</span>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${Math.min(performanceMetrics.collectionRate, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-700 font-medium">Daily Target</p>
                    <p className="text-2xl font-bold text-green-900">
                      ${performanceMetrics.dailyAchieved.toLocaleString()}/${performanceMetrics.dailyTarget.toLocaleString()}
                    </p>
                  </div>
                  <span className="text-2xl">🎯</span>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-green-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${(performanceMetrics.dailyAchieved / performanceMetrics.dailyTarget) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-700 font-medium">Active Customers</p>
                    <p className="text-2xl font-bold text-purple-900">{performanceMetrics.activeCustomers}</p>
                  </div>
                  <span className="text-2xl">👥</span>
                </div>
                <p className="text-xs text-purple-600 mt-1">
                  {performanceMetrics.overdueCustomers} overdue
                </p>
              </div>
              
              <div className="bg-orange-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-orange-700 font-medium">Monthly Collection</p>
                    <p className="text-2xl font-bold text-orange-900">${performanceMetrics.collectedThisMonth.toLocaleString()}</p>
                  </div>
                  <span className="text-2xl">💰</span>
                </div>
                <p className="text-xs text-orange-600 mt-1">This month's total</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Reports</h2>
            <p className="text-gray-600">Generate and manage your personal collection reports</p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={() => setShowReportForm(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-200 flex items-center space-x-2"
            >
              <span>➕</span>
              <span>Generate Report</span>
            </button>
            <button 
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-200 flex items-center space-x-2 relative"
            >
              <span>📤</span>
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Export Dropdown Menu */}
        {showExportMenu && (
          <div className="absolute right-4 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 w-64">
            <div className="p-2">
              <h3 className="px-3 py-2 text-sm font-semibold text-gray-700">Export Options</h3>
              <div className="space-y-1">
                <button 
                  onClick={() => exportReport(reports[0]?.id, 'excel')}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg flex items-center space-x-2"
                >
                  <span>📊</span>
                  <span>Export to Excel</span>
                </button>
                <button 
                  onClick={() => exportReport(reports[0]?.id, 'pdf')}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg flex items-center space-x-2"
                >
                  <span>📄</span>
                  <span>Export to PDF</span>
                </button>
                <button 
                  onClick={() => exportReport(reports[0]?.id, 'print')}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg flex items-center space-x-2"
                >
                  <span>🖨️</span>
                  <span>Print Report</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reports List */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-100">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Generated Reports</h3>
                <p className="text-gray-600 text-sm mt-1">Your personal collection reports</p>
              </div>
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                {reports.length} reports
              </span>
            </div>
          </div>
          
          <div className="p-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-600">Loading your reports...</p>
              </div>
            ) : reports.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📭</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reports Generated</h3>
                <p className="text-gray-600 mb-4 max-w-md mx-auto">
                  Generate your first report to view your collection performance and trends.
                </p>
                <button 
                  onClick={() => setShowReportForm(true)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-200"
                >
                  Generate First Report
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {reports.map(report => (
                  <div key={report.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-xl">{getTypeIcon(report.type)}</span>
                          <div>
                            <h3 className="font-semibold text-gray-900">{report.title}</h3>
                            <div className="flex flex-wrap gap-2 mt-1">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                                {report.status.toUpperCase()}
                              </span>
                              <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                                {report.type.toUpperCase()}
                              </span>
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                                Period: {report.period}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{report.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Generated by: {report.generatedBy}</span>
                          <span>Created: {new Date(report.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => viewReportDetails(report)}
                          className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                        >
                          <span>👁️</span>
                          <span>View</span>
                        </button>
                        {report.exportable && (
                          <button 
                            onClick={() => exportReport(report.id, 'pdf')}
                            className="bg-green-50 hover:bg-green-100 text-green-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                          >
                            <span>📤</span>
                            <span>Export</span>
                          </button>
                        )}
                        <button 
                          onClick={() => deleteReport(report.id)}
                          className="bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2 rounded-lg font-medium transition-colors"
                          title="Delete report"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Historical Trends */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-100">
            <h3 className="text-lg font-semibold text-gray-900">Historical Performance Trends</h3>
            <p className="text-gray-600 text-sm mt-1">Your collection performance over time</p>
          </div>
          <div className="p-6">
            {historicalData.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No historical data available
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Month</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Collections</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Amount</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Collection Rate</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historicalData.map((month, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-800">{month.month}</td>
                        <td className="py-3 px-4">{month.collections}</td>
                        <td className="py-3 px-4">${month.amount.toLocaleString()}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            {month.rate}%
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {index > 0 && (
                            <span className={`text-sm ${month.rate > historicalData[index-1].rate ? 'text-green-600' : 'text-red-600'}`}>
                              {month.rate > historicalData[index-1].rate ? '↗' : '↘'} 
                              {Math.abs(month.rate - historicalData[index-1].rate).toFixed(1)}%
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Access Restrictions Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <span className="text-2xl">🔒</span>
            </div>
            <div className="ml-4">
              <h4 className="text-lg font-semibold text-yellow-800">Report Access Restrictions</h4>
              <p className="text-yellow-700 mt-1">
                As a Collector, you can only generate and view your personal reports.
              </p>
              <div className="mt-3 text-sm text-yellow-600 grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="flex items-start">
                  <span className="mr-2">✅</span>
                  <span>Can generate personal performance reports</span>
                </div>
                <div className="flex items-start">
                  <span className="mr-2">✅</span>
                  <span>Can export own collection data (Excel/PDF)</span>
                </div>
                <div className="flex items-start">
                  <span className="mr-2">✅</span>
                  <span>Can view historical performance trends</span>
                </div>
                <div className="flex items-start">
                  <span className="mr-2">✅</span>
                  <span>Can print visit/collection reports</span>
                </div>
                <div className="flex items-start">
                  <span className="mr-2">❌</span>
                  <span>Cannot generate team/department reports</span>
                </div>
                <div className="flex items-start">
                  <span className="mr-2">❌</span>
                  <span>Cannot access financial reconciliation reports</span>
                </div>
                <div className="flex items-start">
                  <span className="mr-2">❌</span>
                  <span>Cannot view other collectors' performance</span>
                </div>
                <div className="flex items-start">
                  <span className="mr-2">❌</span>
                  <span>Cannot access system-wide analytics</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Generate Report Modal */}
      {showReportForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Generate New Report</h3>
                  <p className="text-gray-600 text-sm mt-1">Create a personal collection report</p>
                </div>
                <button 
                  onClick={() => setShowReportForm(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 hover:bg-gray-100 rounded-lg"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>
            </div>
            
            <form onSubmit={generateReport} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Report Title *
                </label>
                <input
                  type="text"
                  value={reportForm.title}
                  onChange={(e) => setReportForm({...reportForm, title: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="e.g., Daily Collection Report - Jan 15, 2024"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Report Type *
                  </label>
                  <select
                    value={reportForm.type}
                    onChange={(e) => setReportForm({...reportForm, type: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                    required
                  >
                    <option value="daily">📅 Daily Report</option>
                    <option value="weekly">📊 Weekly Report</option>
                    <option value="monthly">📈 Monthly Report</option>
                    <option value="customer">👥 Customer Report</option>
                    <option value="performance">⭐ Performance Report</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Period
                  </label>
                  <select
                    value={reportForm.period}
                    onChange={(e) => setReportForm({...reportForm, period: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                  >
                    <option value="today">Today</option>
                    <option value="this_week">This Week</option>
                    <option value="this_month">This Month</option>
                    <option value="last_month">Last Month</option>
                    <option value="custom">Custom Range</option>
                  </select>
                </div>
              </div>

              {reportForm.period === 'custom' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      value={reportForm.startDate}
                      onChange={(e) => setReportForm({...reportForm, startDate: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date *
                    </label>
                    <input
                      type="date"
                      value={reportForm.endDate}
                      onChange={(e) => setReportForm({...reportForm, endDate: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Report Options
                </label>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={reportForm.includeDetails}
                      onChange={(e) => setReportForm({...reportForm, includeDetails: e.target.checked})}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">Include detailed collection data</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={reportForm.includeCharts}
                      onChange={(e) => setReportForm({...reportForm, includeCharts: e.target.checked})}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">Include performance charts</span>
                  </label>
                </div>
              </div>

              <div className="flex space-x-3 pt-6 border-t border-gray-200">
                <button 
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-blue-400 disabled:to-purple-500 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <span>📊</span>
                  )}
                  <span>{loading ? 'Generating...' : 'Generate Report'}</span>
                </button>
                <button 
                  type="button"
                  onClick={() => setShowReportForm(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 px-4 rounded-xl font-semibold transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </CollectorLayout>
  );
};

export default CollectorReports;