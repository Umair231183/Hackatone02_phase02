'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const VisualProgress = ({ tasks }) => {
  const [completionData, setCompletionData] = useState({ completed: 0, pending: 0, total: 0 });

  useEffect(() => {
    const completed = tasks.filter(task => task.completed).length;
    const pending = tasks.filter(task => !task.completed).length;
    const total = tasks.length;
    
    setCompletionData({
      completed,
      pending,
      total
    });
  }, [tasks]);

  const completionPercentage = completionData.total > 0 
    ? Math.round((completionData.completed / completionData.total) * 100) 
    : 0;

  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Visual Progress</h3>
      
      <div className="space-y-6">
        {/* Progress circle */}
        <div className="flex justify-center">
          <div className="relative w-40 h-40">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="rgba(209, 213, 219, 0.2)"
                strokeWidth="8"
                className="dark:stroke-gray-700"
              />
              {/* Progress circle */}
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#4f46e5"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray="283" // Circumference of the circle (2 * π * r)
                strokeDashoffset={283 - (283 * completionPercentage) / 100}
                transform="rotate(-90 50 50)"
                initial={{ strokeDashoffset: 283 }}
                animate={{ strokeDashoffset: 283 - (283 * completionPercentage) / 100 }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </svg>
            
            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {completionPercentage}%
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">Complete</span>
            </div>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{completionData.total}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Total</div>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{completionData.completed}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Done</div>
          </div>
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{completionData.pending}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Pending</div>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-6">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
            <span>Task Completion</span>
            <span>{completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
            <motion.div 
              className="bg-indigo-600 h-4 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            ></motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default VisualProgress;