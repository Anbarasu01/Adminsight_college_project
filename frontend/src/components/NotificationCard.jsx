const NotificationCard = ({ notification }) => {
  return (
    <div className="bg-gray-50 border p-4 rounded mb-2 shadow-sm">
      <h3 className="font-bold">{notification.title}</h3>
      <p>{notification.message}</p>
      <small className="text-gray-500">{notification.department}</small>
    </div>
  );
};

export default NotificationCard;
