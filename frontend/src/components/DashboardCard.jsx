import React from 'react';
import '../css/DashboardCard.css';
 

const DashboardCard = ({ title, value, icon, color, gradient, subtitle, trend }) => {
  // Color mappings for different card variants
  const colorClasses = {
    blue: 'from-blue-500 to-cyan-500',
    green: 'from-green-500 to-teal-500',
    yellow: 'from-yellow-500 to-orange-500',
    purple: 'from-purple-500 to-pink-500',
    red: 'from-red-500 to-pink-500'
  };

  const gradientClass = gradient || colorClasses[color] || colorClasses.blue;

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mb-2">{value}</p>
          {subtitle && (
            <p className="text-gray-500 text-xs">{subtitle}</p>
          )}
          {trend && (
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              trend > 0 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}%
            </div>
          )}
        </div>
        
        <div className={`w-16 h-16 bg-gradient-to-r ${gradientClass} rounded-2xl flex items-center justify-center shadow-lg`}>
          <span className="text-2xl text-white">{icon}</span>
        </div>
      </div>
    </div>
  );
};

// Alternative more advanced version with progress bars:
const DashboardCardAdvanced = ({ title, value, icon, color, gradient, maxValue, progress }) => {
  const gradientClass = gradient || `from-${color}-500 to-${color}-600`;
  const percentage = maxValue ? (value / maxValue) * 100 : 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
        </div>
        <div className={`w-14 h-14 bg-gradient-to-r ${gradientClass} rounded-xl flex items-center justify-center`}>
          <span className="text-xl text-white">{icon}</span>
        </div>
      </div>
      
      {progress && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`bg-gradient-to-r ${gradientClass} h-2 rounded-full transition-all duration-500`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default DashboardCard;