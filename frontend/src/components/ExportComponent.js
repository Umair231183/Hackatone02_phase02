'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNotification } from '../contexts/NotificationContext';

const ExportComponent = ({ tasks }) => {
  const [exportFormat, setExportFormat] = useState('json');
  const [isExporting, setIsExporting] = useState(false);
  const { addNotification } = useNotification();

  const exportTasks = () => {
    setIsExporting(true);
    
    try {
      let data, mimeType, filename;
      
      switch (exportFormat) {
        case 'json':
          data = JSON.stringify(tasks, null, 2);
          mimeType = 'application/json';
          filename = `tasks-${new Date().toISOString().slice(0, 10)}.json`;
          break;
          
        case 'csv':
          // Create CSV content
          const headers = ['ID', 'Title', 'Description', 'Completed', 'Created At'];
          const rows = tasks.map(task => [
            task.id,
            `"${task.title.replace(/"/g, '""')}"`, // Escape quotes
            `"${task.description ? task.description.replace(/"/g, '""') : ''}"`,
            task.completed ? 'true' : 'false',
            task.created_at
          ]);
          
          data = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
          mimeType = 'text/csv';
          filename = `tasks-${new Date().toISOString().slice(0, 10)}.csv`;
          break;
          
        case 'txt':
          data = tasks.map(task => 
            `ID: ${task.id}\nTitle: ${task.title}\nDescription: ${task.description || 'N/A'}\nCompleted: ${task.completed ? 'Yes' : 'No'}\nCreated: ${task.created_at}\n---\n`
          ).join('');
          mimeType = 'text/plain';
          filename = `tasks-${new Date().toISOString().slice(0, 10)}.txt`;
          break;
          
        default:
          throw new Error('Invalid export format');
      }
      
      // Create and download the file
      const blob = new Blob([data], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      addNotification(`Tasks exported as ${exportFormat.toUpperCase()} successfully!`, 'success');
    } catch (error) {
      addNotification(`Error exporting tasks: ${error.message}`, 'error');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Export Tasks</h3>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Export Format
          </label>
          <div className="grid grid-cols-3 gap-2">
            {['json', 'csv', 'txt'].map((format) => (
              <button
                key={format}
                onClick={() => setExportFormat(format)}
                className={`py-2 px-4 rounded-lg text-center font-medium ${
                  exportFormat === format
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {format.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Export Summary</h4>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            You have <span className="font-semibold">{tasks.length}</span> tasks to export.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            Format: <span className="font-semibold">{exportFormat.toUpperCase()}</span>
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={exportTasks}
          disabled={isExporting}
          className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExporting ? 'Exporting...' : `Export as ${exportFormat.toUpperCase()}`}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ExportComponent;