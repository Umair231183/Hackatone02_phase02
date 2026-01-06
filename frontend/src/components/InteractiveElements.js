'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const InteractiveElements = () => {
  const [activeTab, setActiveTab] = useState('tasks');
  const [isExpanded, setIsExpanded] = useState(false);
  const [sliderValue, setSliderValue] = useState(50);
  const [checkedItems, setCheckedItems] = useState([]);

  const toggleItem = (id) => {
    if (checkedItems.includes(id)) {
      setCheckedItems(checkedItems.filter(item => item !== id));
    } else {
      setCheckedItems([...checkedItems, id]);
    }
  };

  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Interactive Elements</h3>
      
      <div className="space-y-6">
        {/* Tabs */}
        <div>
          <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
            {['tasks', 'notes', 'files'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'text-indigo-600 border-b-2 border-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          
          <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            {activeTab === 'tasks' && <p>Task content goes here...</p>}
            {activeTab === 'notes' && <p>Note content goes here...</p>}
            {activeTab === 'files' && <p>File content goes here...</p>}
          </div>
        </div>
        
        {/* Expandable section */}
        <div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-700 rounded-lg"
          >
            <span className="font-medium text-gray-900 dark:text-white">Expandable Section</span>
            <motion.span
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.span>
          </button>
          
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-2 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg"
            >
              <p>This is the expanded content. You can put any content here.</p>
            </motion.div>
          )}
        </div>
        
        {/* Slider */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Priority: {sliderValue}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={sliderValue}
            onChange={(e) => setSliderValue(e.target.value)}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
        </div>
        
        {/* Checkboxes */}
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Select Options</h4>
          <div className="space-y-2">
            {['Option 1', 'Option 2', 'Option 3', 'Option 4'].map((option, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="checkbox"
                  checked={checkedItems.includes(index)}
                  onChange={() => toggleItem(index)}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">{option}</span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Toggle Switch */}
        <div className="flex items-center justify-between">
          <span className="text-gray-700 dark:text-gray-300">Enable notifications</span>
          <button
            onClick={() => {}}
            className={`relative inline-flex h-6 w-11 items-center rounded-full ${
              true ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                true ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default InteractiveElements;