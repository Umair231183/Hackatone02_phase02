'use client';

import { motion } from 'framer-motion';
import { fadeIn, pulse } from '../utils/animations';

export default function StatsCard({ title, value, icon, color = 'blue', trend }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl"
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</p>
          <motion.p
            className="text-3xl font-bold mt-2 text-gray-900 dark:text-white"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            {value}
          </motion.p>
          {trend && (
            <motion.p
              className={`text-sm mt-1 flex items-center ${
                trend.value >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {trend.value >= 0 ? (
                <motion.svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </motion.svg>
              ) : (
                <motion.svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  animate={{ y: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </motion.svg>
              )}
              {Math.abs(trend.value)}% {trend.label}
            </motion.p>
          )}
        </div>
        <motion.div
          className={`p-3 rounded-full bg-${color}-100 dark:bg-${color}-900/30`}
          variants={pulse}
          initial="hidden"
          animate="visible"
          whileHover={{ rotate: 10, scale: 1.1 }}
        >
          <motion.div
            className={`w-8 h-8 flex items-center justify-center text-${color}-600 dark:text-${color}-400`}
            whileHover={{ rotate: 5, scale: 1.1 }}
          >
            {icon}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}