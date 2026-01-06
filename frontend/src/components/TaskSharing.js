'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNotification } from '../contexts/NotificationContext';

const TaskSharing = ({ taskId, taskTitle }) => {
  const [isSharing, setIsSharing] = useState(false);
  const [shareMethod, setShareMethod] = useState('link');
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);
  const { addNotification } = useNotification();

  const handleShare = () => {
    if (shareMethod === 'link') {
      const taskUrl = `${window.location.origin}/tasks/${taskId}`;
      navigator.clipboard.writeText(taskUrl)
        .then(() => {
          setCopied(true);
          addNotification('Link copied to clipboard!', 'success');
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(err => {
          addNotification('Failed to copy link', 'error');
        });
    } else if (shareMethod === 'email' && email) {
      // In a real app, this would send an email
      const subject = `Task Sharing: ${taskTitle}`;
      const body = `Check out this task: ${window.location.origin}/tasks/${taskId}`;
      window.open(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
      addNotification('Email client opened', 'info');
    }
  };

  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Share Task</h3>
      
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShareMethod('link')}
            className={`px-4 py-2 rounded-lg font-medium ${
              shareMethod === 'link'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Share Link
          </button>
          <button
            onClick={() => setShareMethod('email')}
            className={`px-4 py-2 rounded-lg font-medium ${
              shareMethod === 'email'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Share via Email
          </button>
        </div>
        
        {shareMethod === 'email' && (
          <div className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        )}
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleShare}
          className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
        >
          {shareMethod === 'link' ? 'Copy Link' : 'Send Email'}
        </motion.button>
        
        {shareMethod === 'link' && (
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            {copied ? 'Link copied!' : 'Click "Copy Link" to share this task'}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TaskSharing;