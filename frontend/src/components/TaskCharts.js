'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function TaskCharts({ tasks }) {
  // Prepare data for the bar chart
  const barChartData = [
    { name: 'Total', tasks: tasks.length },
    { name: 'Completed', tasks: tasks.filter(t => t.completed).length },
    { name: 'Pending', tasks: tasks.filter(t => !t.completed).length },
  ];

  // Prepare data for the pie chart
  const pieChartData = [
    { name: 'Completed', value: tasks.filter(t => t.completed).length },
    { name: 'Pending', value: tasks.filter(t => !t.completed).length },
  ].filter(item => item.value > 0); // Only show non-zero values

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Bar Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Task Overview</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barChartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgb(255, 255, 255)', 
                  borderColor: 'rgb(229, 231, 235)',
                  borderRadius: '0.5rem',
                  color: 'rgb(17, 24, 39)'
                }} 
              />
              <Legend />
              <Bar dataKey="tasks" fill="#4f46e5" name="Number of Tasks" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Task Distribution</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {pieChartData.map((entry, index) => (
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
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}