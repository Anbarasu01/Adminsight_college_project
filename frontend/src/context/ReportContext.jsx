import React, { createContext, useState, useContext, useCallback } from 'react';

const ReportContext = createContext();

export const useReport = () => {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error('useReport must be used within a ReportProvider');
  }
  return context;
};

export const ReportProvider = ({ children }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mock data - replace with actual API calls
  const fetchReports = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockReports = [
        {
          id: 1,
          title: 'Broken Window',
          description: 'Window broken on 3rd floor',
          status: 'pending',
          priority: 'high',
          category: 'maintenance',
          location: 'Building A, Floor 3',
          reporter: 'john@example.com',
          createdAt: '2024-01-10T10:00:00Z',
          assignedTo: null
        },
        {
          id: 2,
          title: 'Leaking Pipe',
          description: 'Water leakage in restroom',
          status: 'in-progress',
          priority: 'medium',
          category: 'plumbing',
          location: 'Building B, Floor 1',
          reporter: 'jane@example.com',
          createdAt: '2024-01-09T14:30:00Z',
          assignedTo: 'collector@example.com'
        }
      ];
      
      setReports(mockReports);
      return mockReports;
    } catch (error) {
      console.error('Failed to fetch reports:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const createReport = useCallback(async (reportData) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newReport = {
        id: Date.now(),
        ...reportData,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      
      setReports(prev => [newReport, ...prev]);
      return newReport;
    } catch (error) {
      console.error('Failed to create report:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateReport = useCallback(async (reportId, updates) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setReports(prev =>
        prev.map(report =>
          report.id === reportId ? { ...report, ...updates } : report
        )
      );
    } catch (error) {
      console.error('Failed to update report:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteReport = useCallback(async (reportId) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setReports(prev => prev.filter(report => report.id !== reportId));
    } catch (error) {
      console.error('Failed to delete report:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    reports,
    loading,
    fetchReports,
    createReport,
    updateReport,
    deleteReport
  };

  return (
    <ReportContext.Provider value={value}>
      {children}
    </ReportContext.Provider>
  );
};