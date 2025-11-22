import React, { useState, useEffect } from 'react';
import { getStaffTasks, updateTaskStatus } from '../../utils/api';

const StaffTasks = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await getStaffTasks();
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleStatusUpdate = async (taskId, status) => {
    try {
      await updateTaskStatus(taskId, { status });
      fetchTasks();
      alert('Task status updated successfully');
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <div className="staff-tasks">
      <h2>My Tasks</h2>
      <div className="tasks-grid">
        {tasks.map(task => (
          <div key={task.id} className="task-card">
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <div className="task-details">
              <span>Priority: {task.priority}</span>
              <span>Due: {task.dueDate}</span>
            </div>
            <select 
              value={task.status} 
              onChange={(e) => handleStatusUpdate(task.id, e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaffTasks;