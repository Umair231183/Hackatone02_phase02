'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useNotification } from '../../../contexts/NotificationContext';
import Header from '../../../components/Header';
import ProtectedRoute from '../../../components/ProtectedRoute';

export default function ProfilePage() {
  const [user, setUser] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: '', email: '' });
  const router = useRouter();
  const { addNotification } = useNotification();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    
    // In a real app, you would fetch user data from an API
    // For now, we'll simulate it with data from localStorage
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ name: payload.name || 'User', email: payload.email || 'user@example.com' });
        setEditData({ name: payload.name || 'User', email: payload.email || 'user@example.com' });
      }
    } catch (error) {
      addNotification('Error parsing user data', 'error');
    } finally {
      setLoading(false);
    }
  }, [router, addNotification]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({ name: user.name, email: user.email });
  };

  const handleSave = () => {
    // In a real app, you would send this data to an API
    setUser({ name: editData.name, email: editData.email });
    setIsEditing(false);
    addNotification('Profile updated successfully', 'success');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({ name: user.name, email: user.email });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 dark:border-gray-600 dark:border-t-indigo-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-4xl mx-auto p-4 sm:p-6">
          <Header title="Profile" showBackButton={true} />

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
          <div className="flex flex-col items-center mb-8">
            <div className="w-24 h-24 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-4">
              <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
            <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Personal Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => setEditData({...editData, name: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white">{user.name}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => setEditData({...editData, email: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white">{user.email}</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3 pt-4">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={handleEdit}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                >
                  Edit Profile
                </button>
              )}
              
              <button
                onClick={handleLogout}
                className="ml-auto px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
      
    </ProtectedRoute>
  );
}