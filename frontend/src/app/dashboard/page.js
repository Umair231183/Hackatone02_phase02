'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useNotification } from '../../contexts/NotificationContext';
import { getTasks, createTask, deleteTask, toggleTaskComplete, updateTask } from '../../services/api';
import TaskCard from '../../components/TaskCard';
import TaskCharts from '../../components/TaskCharts';
import StatsCard from '../../components/StatsCard';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function DashboardPage() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created');
  const router = useRouter();
  const { addNotification } = useNotification();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    loadTasks();
  }, [router]);

  const loadTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      if (err.message.includes('401')) {
        localStorage.removeItem('token');
        router.push('/login');
      } else {
        addNotification('Failed to load tasks', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) {
      addNotification('Task title is required', 'error');
      return;
    }

    try {
      const task = await createTask(newTask);
      setTasks([...tasks, task]);
      setNewTask({ title: '', description: '' });
      addNotification('Task created successfully', 'success');
    } catch (err) {
      addNotification('Failed to create task', 'error');
    }
  };

  const handleToggleComplete = async (taskId, completed) => {
    try {
      const updatedTask = await toggleTaskComplete(taskId, !completed);
      setTasks(tasks.map(task =>
        task.id === taskId ? updatedTask : task
      ));
      addNotification(`Task ${completed ? 'marked incomplete' : 'completed'} successfully`, 'success');
    } catch (err) {
      addNotification('Failed to update task', 'error');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
      addNotification('Task deleted successfully', 'success');
    } catch (err) {
      addNotification('Failed to delete task', 'error');
    }
  };

  const handleUpdateTask = async (taskId, updatedData) => {
    try {
      const updatedTask = await updateTask(null, taskId, updatedData);
      setTasks(tasks.map(task =>
        task.id === taskId ? updatedTask : task
      ));
      addNotification('Task updated successfully', 'success');
    } catch (err) {
      addNotification('Failed to update task', 'error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'created') {
      return new Date(b.created_at) - new Date(a.created_at);
    } else if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    } else if (sortBy === 'completed') {
      return a.completed - b.completed;
    }
    return 0;
  });

  const completedCount = tasks.filter(task => task.completed).length;
  const pendingCount = tasks.length - completedCount;
  const completionRate = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 dark:border-gray-600 dark:border-t-indigo-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <div className="w-full md:w-64 flex-shrink-0">
              <Sidebar />
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <Header title="Dashboard" />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <StatsCard
                  title="Total Tasks"
                  value={tasks.length}
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  }
                  color="blue"
                />
                <StatsCard
                  title="Completed"
                  value={completedCount}
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                  color="green"
                />
                <StatsCard
                  title="Completion Rate"
                  value={`${completionRate}%`}
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  }
                  color="purple"
                  trend={{ value: completionRate > 50 ? 5 : -5, label: 'from last week' }}
                />
              </div>

              {/* Task Charts */}
              <TaskCharts tasks={tasks} />

              {/* Add Task Form */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">
                <form onSubmit={handleCreateTask} className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Task Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={newTask.title}
                      onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                      placeholder="What do you need to do?"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description (Optional)
                    </label>
                    <textarea
                      id="description"
                      value={newTask.description}
                      onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                      placeholder="Add details about your task..."
                      rows="2"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-105 active:scale-95 dark:focus:ring-offset-gray-800"
                  >
                    Add New Task
                  </button>
                </form>
              </div>

              {/* Controls */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="flex flex-wrap gap-2">
                    {['all', 'pending', 'completed'].map((filterType) => (
                      <button
                        key={filterType}
                        onClick={() => setFilter(filterType)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                          filter === filterType
                            ? 'bg-indigo-600 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Sort by:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="created">Newest First</option>
                      <option value="title">Title</option>
                      <option value="completed">Completion</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Tasks List */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                {sortedTasks.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 0a9 9 0 110 18 9 9 0 010-18zm0 0a9 9 0 019 9" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No tasks found</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      {filter === 'completed'
                        ? "You haven't completed any tasks yet."
                        : filter === 'pending'
                          ? "You have no pending tasks. Great job!"
                          : "Create your first task to get started!"}
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {sortedTasks.map((task, index) => (
                      <div key={task.id} className="p-1 animate-fadeIn" style={{ animationDelay: `${index * 50}ms` }}>
                        <TaskCard
                          task={task}
                          onToggleComplete={handleToggleComplete}
                          onDelete={handleDeleteTask}
                          onUpdate={handleUpdateTask}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}