import '../css/NotificationCard.css';

const NotificationCard = ({ notification }) => {
  return (
    <div className={`notification-card ${notification.type || 'info'}`}>
      <div className="notification-header">
        <h3 className="notification-title">{notification.title}</h3>
        <span className="notification-type">
          {notification.type || 'info'}
        </span>
      </div>
      <p className="notification-message">{notification.message}</p>
      <div className="notification-footer">
        <small className="notification-time">
          {notification.department && `${notification.department} • `}
          {notification.time || new Date().toLocaleDateString()}
        </small>
        <div className="notification-actions">
          <button className="action-btn mark-read">
            Mark Read
          </button>
          <button className="action-btn delete-btn">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;