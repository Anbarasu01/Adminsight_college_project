const DashboardCard = ({ title, value }) => {
  return (
    <div className="bg-white p-4 rounded shadow text-center">
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
};

export default DashboardCard;
