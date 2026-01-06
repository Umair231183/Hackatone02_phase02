'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNotification } from '../contexts/NotificationContext';

const CategoryManager = ({ categories, onAddCategory, onDeleteCategory }) => {
  const [newCategory, setNewCategory] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const { addNotification } = useNotification();

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      addNotification('Category name cannot be empty', 'error');
      return;
    }

    if (categories.some(cat => cat.name.toLowerCase() === newCategory.trim().toLowerCase())) {
      addNotification('Category already exists', 'error');
      return;
    }

    onAddCategory({
      id: Date.now(),
      name: newCategory.trim(),
      color: getRandomColor()
    });
    
    setNewCategory('');
    setIsAdding(false);
    addNotification('Category added successfully', 'success');
  };

  const getRandomColor = () => {
    const colors = [
      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
      'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
      'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Task Categories</h3>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((category) => (
          <motion.div
            key={category.id}
            className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${category.color} transition-all duration-200`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
          >
            {category.name}
            <button
              onClick={() => onDeleteCategory(category.id)}
              className="ml-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        ))}
      </div>
      
      {isAdding ? (
        <motion.div 
          className="flex gap-2"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
        >
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Enter category name"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddCategory}
            className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
          >
            Add
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAdding(false)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
          >
            Cancel
          </motion.button>
        </motion.div>
      ) : (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsAdding(true)}
          className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-indigo-400 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-400 dark:hover:border-indigo-500 dark:hover:text-indigo-400 transition-colors"
        >
          + Add Category
        </motion.button>
      )}
    </motion.div>
  );
};

export default CategoryManager;