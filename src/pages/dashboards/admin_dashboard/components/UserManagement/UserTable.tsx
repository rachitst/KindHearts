import React, { useState } from 'react';
import { Check, X, MoreVertical, Ban, UserCheck, Trash2, Loader2 } from 'lucide-react';
import { User } from '../../types';

interface UserTableProps {
  users: User[];
  onApprove: (userId: string) => void;
  onBlock: (userId: string) => void;
  onUnblock: (userId: string) => void;
  onDelete: (userId: string) => void;
  actionInProgress: string | null;
}

const UserTable: React.FC<UserTableProps> = ({
  users: initialUsers,
  onApprove,
  onBlock,
  onUnblock,
  onDelete,
  actionInProgress
}) => {
  const [users, setUsers] = useState(initialUsers);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});

  // Update users when initialUsers changes
  React.useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsers]);

  const handleActionClick = (e: React.MouseEvent, userId: string) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === userId ? null : userId);
  };

  const getActionMessage = (action: string, userName: string) => {
    switch (action) {
      case 'approve':
        return `Request accepted for ${userName}`;
      case 'reject':
        return `Request rejected for ${userName}`;
      case 'block':
        return `${userName}'s access has been blocked`;
      case 'unblock':
        return `${userName}'s access has been restored`;
      case 'delete':
        return `${userName}'s account has been deleted`;
      default:
        return 'Action completed successfully';
    }
  };

  const handleAction = async (action: (id: string) => void, userId: string, actionType: string) => {
    try {
      setLoading({ ...loading, [userId]: true });
      setActiveDropdown(null);
      
      // Call the action
      await action(userId);
      
      // Find user name for the message
      const user = users.find(u => u.id === userId);
      const userName = user?.name || 'User';
      
      // Show success message
      showNotification(getActionMessage(actionType, userName), 'success');
    } catch (error) {
      console.error('Action failed:', error);
      showNotification('Action failed. Please try again.', 'error');
    } finally {
      setLoading({ ...loading, [userId]: false });
    }
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const showNotification = (message: string, type: 'success' | 'error') => {
    const notificationDiv = document.createElement('div');
    notificationDiv.className = `fixed bottom-4 right-4 p-4 rounded-md shadow-lg ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white z-50 transition-opacity duration-500 flex items-center gap-2`;
    
    // Add icon to notification
    const icon = document.createElement('span');
    icon.innerHTML = type === 'success' 
      ? '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>'
      : '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" /></svg>';
    
    notificationDiv.appendChild(icon);
    
    const messageSpan = document.createElement('span');
    messageSpan.textContent = message;
    notificationDiv.appendChild(messageSpan);
    
    document.body.appendChild(notificationDiv);

    setTimeout(() => {
      notificationDiv.style.opacity = '0';
      setTimeout(() => document.body.removeChild(notificationDiv), 500);
    }, 3000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'blocked':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{user.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{user.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500 capitalize">{user.type}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(user.status)}`}>
                  {user.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end gap-2">
                  {user.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleAction(onApprove, user.id, 'approve')}
                        disabled={loading[user.id] || actionInProgress === user.id}
                        className="inline-flex items-center p-2 border border-transparent rounded-full text-green-600 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Accept Request"
                      >
                        {loading[user.id] ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <Check className="h-5 w-5" />
                        )}
                      </button>
                      <button
                        onClick={() => handleAction(onBlock, user.id, 'reject')}
                        disabled={loading[user.id] || actionInProgress === user.id}
                        className="inline-flex items-center p-2 border border-transparent rounded-full text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Reject Request"
                      >
                        {loading[user.id] ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <X className="h-5 w-5" />
                        )}
                      </button>
                    </>
                  )}
                  <div className="relative">
                    <button
                      onClick={(e) => handleActionClick(e, user.id)}
                      disabled={loading[user.id] || actionInProgress === user.id}
                      className="inline-flex items-center p-2 border border-transparent rounded-full text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="More actions"
                    >
                      {loading[user.id] ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <MoreVertical className="h-5 w-5" />
                      )}
                    </button>
                    {activeDropdown === user.id && (
                      <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                        <div className="py-1" role="menu">
                          {user.status === 'active' && (
                            <button
                              onClick={() => handleAction(onBlock, user.id, 'block')}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors duration-150"
                              role="menuitem"
                              disabled={loading[user.id]}
                            >
                              <Ban className="h-4 w-4" />
                              Block Access
                            </button>
                          )}
                          {user.status === 'blocked' && (
                            <button
                              onClick={() => handleAction(onUnblock, user.id, 'unblock')}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors duration-150"
                              role="menuitem"
                              disabled={loading[user.id]}
                            >
                              <UserCheck className="h-4 w-4" />
                              Restore Access
                            </button>
                          )}
                          <button
                            onClick={() => handleAction(onDelete, user.id, 'delete')}
                            className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 flex items-center gap-2 transition-colors duration-150"
                            role="menuitem"
                            disabled={loading[user.id]}
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete Account
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {users.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No users found matching the current filters.
        </div>
      )}
    </div>
  );
};

export default UserTable;