'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const FocusMode = ({ tasks, onTaskComplete }) => {
  const [isActive, setIsActive] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isBreak, setIsBreak] = useState(false);
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [completedTasks, setCompletedTasks] = useState([]);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // Timer completed
      setIsActive(false);
      
      if (!isBreak) {
        // Work session completed
        setIsBreak(true);
        setTimeLeft(breakDuration * 60);
        alert('Work session completed! Take a break.');
      } else {
        // Break completed
        setIsBreak(false);
        setTimeLeft(workDuration * 60);
        alert('Break time is over! Back to work.');
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, isBreak, workDuration, breakDuration]);

  const startFocusMode = () => {
    if (tasks.length === 0) {
      alert('Add some tasks first!');
      return;
    }
    
    // Select a random task to focus on
    const incompleteTasks = tasks.filter(task => !task.completed);
    if (incompleteTasks.length === 0) {
      alert('All tasks are completed!');
      return;
    }
    
    const randomTask = incompleteTasks[Math.floor(Math.random() * incompleteTasks.length)];
    setCurrentTask(randomTask);
    setIsBreak(false);
    setTimeLeft(workDuration * 60);
    setIsActive(true);
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetFocusMode = () => {
    setIsActive(false);
    setIsBreak(false);
    setCurrentTask(null);
    setTimeLeft(workDuration * 60);
  };

  const completeCurrentTask = () => {
    if (currentTask) {
      onTaskComplete(currentTask.id);
      setCompletedTasks([...completedTasks, currentTask.id]);
      setCurrentTask(null);
      setIsActive(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = isBreak 
    ? (timeLeft / (breakDuration * 60)) * 100 
    : (timeLeft / (workDuration * 60)) * 100;

  return (
    <motion.div 
      className={`rounded-2xl shadow-xl p-6 ${
        isActive ? 'bg-indigo-50 dark:bg-indigo-900/20' : 'bg-white dark:bg-gray-800'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Focus Mode</h3>
      
      <div className="text-center">
        {currentTask ? (
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Current Focus:</h4>
            <p className="text-gray-700 dark:text-gray-300">{currentTask.title}</p>
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {isActive ? 'Selecting a task to focus on...' : 'Start focus mode to begin'}
          </p>
        )}
        
        <div className="relative flex justify-center items-center mb-6">
          <div className="relative w-48 h-48">
            {/* Circular progress bar */}
            <svg className="w-full h-full" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={isBreak ? "rgba(34, 197, 94, 0.2)" : "rgba(99, 102, 241, 0.2)"}
                strokeWidth="8"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={isBreak ? "#22C55E" : "#6366F1"}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray="283" // Circumference of the circle (2 * π * r)
                strokeDashoffset={283 - (283 * progress) / 100}
                transform="rotate(-90 50 50)"
              />
            </svg>
            
            {/* Timer text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {formatTime(timeLeft)}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {isBreak ? 'Break Time' : 'Focus Time'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center space-x-4 mb-6">
          {!isActive ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startFocusMode}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700"
            >
              Start Focus
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTimer}
              className={`px-6 py-3 rounded-lg font-semibold text-white ${
                isBreak ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {isActive ? 'Pause' : 'Resume'}
            </motion.button>
          )}
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetFocusMode}
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
          >
            Reset
          </motion.button>
        </div>
        
        {currentTask && !isActive && !isBreak && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={completeCurrentTask}
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
          >
            Mark Task Complete
          </motion.button>
        )}
        
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Work Duration (min)
            </label>
            <input
              type="number"
              min="1"
              max="60"
              value={workDuration}
              onChange={(e) => setWorkDuration(parseInt(e.target.value) || 25)}
              disabled={isActive}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-50"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Break Duration (min)
            </label>
            <input
              type="number"
              min="1"
              max="30"
              value={breakDuration}
              onChange={(e) => setBreakDuration(parseInt(e.target.value) || 5)}
              disabled={isActive}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-50"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FocusMode;