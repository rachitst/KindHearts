// Create a new reusable component for consistent stats cards
export const StatsCard = ({ title, value, icon, color = 'indigo' }) => {
  const colorClasses = {
    indigo: 'bg-indigo-50 text-indigo-600',
    gold: 'bg-amber-50 text-amber-600',
    purple: 'bg-purple-50 text-purple-600',
    emerald: 'bg-emerald-50 text-emerald-600'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-indigo-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <h3 className="text-2xl font-bold mt-1 text-indigo-900">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}; 