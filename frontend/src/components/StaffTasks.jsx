import React, { useState, useEffect } from 'react';
import { getStaffTasks, updateTaskStatus } from '../utils/api';
import '../css/StaffTasks.css';

const StaffTasks = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchStaffTasks();
  }, []);

  const fetchStaffTasks = async () => {
    try {
      const response = await getStaffTasks();
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleStatusUpdate = async (taskId, newStatus) => {
    try {
      await updateTaskStatus(taskId, { status: newStatus });
      fetchStaffTasks();
      alert('Task status updated successfully');
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <div className="staff-tasks">
      <h2>My Tasks</h2>
      <div className="tasks-list">
        {tasks.map(task => (
          <div key={task.id} className="task-card">
            <div className="task-header">
              <h3>{task.title}</h3>
              <span className={`priority-badge priority-${task.priority}`}>
                {task.priority}
              </span>
            </div>
            <p className="task-description">{task.description}</p>
            <div className="task-details">
              <p><strong>Department:</strong> {task.department}</p>
              <p><strong>Assigned By:</strong> {task.assignedBy?.name}</p>
              <p><strong>Due Date:</strong> {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Not set'}</p>
            </div>
            <div className="task-actions">
              <select 
                value={task.status}
                onChange={(e) => handleStatusUpdate(task.id, e.target.value)}
                className="status-select"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="on_hold">On Hold</option>
              </select>
              <button className="details-btn">View Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaffTasks;