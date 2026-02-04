import React from 'react';
import { Bell, X, CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ isOpen, onClose }) => {
  const notifications = [
    {
      id: 1,
      type: 'success',
      message: 'Order #1234 has been delivered successfully',
      time: '2 minutes ago',
      icon: <CheckCircle className="text-green-500" size={20} />
    },
    {
      id: 2,
      type: 'warning',
      message: 'New urgent order requires immediate attention',
      time: '5 minutes ago',
      icon: <AlertCircle className="text-yellow-500" size={20} />
    },
    {
      id: 3,
      type: 'info',
      message: 'System maintenance scheduled for tonight',
      time: '1 hour ago',
      icon: <Clock className="text-blue-500" size={20} />
    }
  ];

  return (
    <div className={`
      fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-lg transform transition-transform duration-300
      ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      z-50
    `}>
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <Bell size={20} className="text-gray-600" />
          <h2 className="text-lg font-semibold">Notifications</h2>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="overflow-y-auto h-full pb-20">
        {notifications.map(notification => (
          <div 
            key={notification.id}
            className="p-4 border-b hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start space-x-3">
              {notification.icon}
              <div className="flex-1">
                <p className="text-sm text-gray-800">{notification.message}</p>
                <span className="text-xs text-gray-500">{notification.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPanel; 