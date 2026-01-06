'use client';

import { useTheme } from '../../../contexts/ThemeContext';
import { useNotification } from '../../../contexts/NotificationContext';
import Header from '../../../components/Header';
import ProtectedRoute from '../../../components/ProtectedRoute';

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { addNotification } = useNotification();

  const handleSaveSettings = () => {
    addNotification('Settings saved successfully', 'success');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-4xl mx-auto p-4 sm:p-6">
          <Header title="Settings" showBackButton={true} />

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Application Settings</h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg dark:border-gray-700">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Dark Mode</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Toggle between light and dark themes</p>
              </div>
              <button
                onClick={toggleTheme}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  theme === 'dark' ? 'bg-indigo-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg dark:border-gray-700">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">Notification Preferences</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Email Notifications</span>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-indigo-600">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Push Notifications</span>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-indigo-600">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Task Reminders</span>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 dark:bg-gray-600">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg dark:border-gray-700">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">Privacy Settings</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Share Activity</span>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-indigo-600">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Data Collection</span>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 dark:bg-gray-600">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <button
                onClick={handleSaveSettings}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </ProtectedRoute>
  );
}