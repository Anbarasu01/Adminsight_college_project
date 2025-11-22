import '../css/NotificationCard.css';

const NotificationCard = ({ notification, onMarkRead, onDelete }) => {
  const handleMarkRead = () => {
    if (onMarkRead) {
      onMarkRead(notification.id);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(notification.id);
    }
  };

  return (
    <div className={`notification-card ${notification.type || 'info'} ${notification.read ? 'read' : 'unread'}`}>
      <div className="notification-header">
        <h3 className="notification-title">{notification.title}</h3>
        <span className={`notification-type ${notification.type || 'info'}`}>
          {notification.type || 'info'}
        </span>
      </div>
      
      <p className="notification-message">{notification.message}</p>
      
      {notification.details && (
        <div className="notification-details">
          <p>{notification.details}</p>
        </div>
      )}
      
      <div className="notification-footer">
        <div className="notification-meta">
          <small className="notification-time">
            {notification.timestamp ? new Date(notification.timestamp).toLocaleString() : new Date().toLocaleDateString()}
          </small>
          {notification.department && (
            <small className="notification-department">
              {notification.department}
            </small>
          )}
          {notification.priority && (
            <span className={`priority-badge ${notification.priority}`}>
              {notification.priority}
            </span>
          )}
        </div>
        
        <div className="notification-actions">
          {!notification.read && (
            <button 
              className="action-btn mark-read"
              onClick={handleMarkRead}
            >
              Mark Read
            </button>
          )}
          <button 
            className="action-btn delete-btn"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>
      
      {!notification.read && <div className="unread-indicator"></div>}
    </div>
  );
};

export default NotificationCard;