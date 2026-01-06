'use client';

import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AnalyticsDashboard = ({ tasks }) => {
  // Prepare data for the bar chart (tasks completed per day)
  const getTasksByDay = () => {
    const tasksByDay = {};
    
    tasks.forEach(task => {
      if (task.completed) {
        const date = new Date(task.created_at).toDateString();
        tasksByDay[date] = (tasksByDay[date] || 0) + 1;
      }
    });
    
    return Object.entries(tasksByDay)
      .map(([date, count]) => ({ date, tasks: count }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  // Prepare data for the pie chart (completed vs pending)
  const completionData = [
    { name: 'Completed', value: tasks.filter(t => t.completed).length },
    { name: 'Pending', value: tasks.filter(t => !t.completed).length },
  ];

  // Calculate additional metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const avgCompletionTime = "N/A"; // Placeholder - would need actual completion time data

  const COLORS = ['#4f46e5', '#94a3b8'];

  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Task Analytics</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Stats cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{totalTasks}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Total Tasks</div>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{completedTasks}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Completed</div>
          </div>
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{completionRate}%</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Completion Rate</div>
          </div>
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{avgCompletionTime}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Avg. Time</div>
          </div>
        </div>
        
        {/* Pie chart */}
        <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
          <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Task Status</h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={completionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {completionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgb(255, 255, 255)', 
                  borderColor: 'rgb(229, 231, 235)',
                  borderRadius: '0.5rem',
                  color: 'rgb(17, 24, 39)'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Bar chart */}
      <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
        <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Tasks Completed Over Time</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={getTasksByDay()}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
            <XAxis dataKey="date" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgb(255, 255, 255)', 
                borderColor: 'rgb(229, 231, 235)',
                borderRadius: '0.5rem',
                color: 'rgb(17, 24, 39)'
              }} 
            />
            <Bar dataKey="tasks" fill="#4f46e5" name="Tasks Completed" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default AnalyticsDashboard;