// frontend/src/pages/dashboard/page.js

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getTasks, createTask, updateTaskCompletion, deleteTask } from '../../services/api';
import { isAuthenticated, logout } from '../../services/auth';

export default function DashboardPage() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const userId = typeof window !== 'undefined' ? localStorage.getItem('token') ? 'user123' : null : null; // In a real app, you'd extract user ID from the token

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      if (userId) {
        const tasksData = await getTasks(userId);
        setTasks(tasksData);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    
    if (!newTask.title.trim()) {
      setError('Task title is required');
      return;
    }

    try {
      if (userId) {
        const createdTask = await createTask(userId, newTask);
        setTasks([...tasks, createdTask]);
        setNewTask({ title: '', description: '' });
        setError('');
      }
    } catch (err) {
      setError(err.message || 'Failed to create task');
    }
  };

  const handleToggleComplete = async (taskId, currentStatus) => {
    try {
      if (userId) {
        const updatedTask = await updateTaskCompletion(userId, taskId, !currentStatus);
        setTasks(tasks.map(task => 
          task.id === taskId ? updatedTask : task
        ));
      }
    } catch (err) {
      setError(err.message || 'Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      if (userId) {
        await deleteTask(userId, taskId);
        setTasks(tasks.filter(task => task.id !== taskId));
      }
    } catch (err) {
      setError(err.message || 'Failed to delete task');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!isAuthenticated()) {
    return null; // Redirect happens in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Todo Dashboard</h1>
          <button
            onClick={handleLogout}
            className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
          >
            Logout
          </button>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}
          
          {/* Add Task Form */}
          <div className="mb-8 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
            <form onSubmit={handleCreateTask}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  rows="3"
                />
              </div>
              <button
                type="submit"
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Add Task
              </button>
            </form>
          </div>

          {/* Tasks List */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Your Tasks</h2>
            {loading ? (
              <p>Loading tasks...</p>
            ) : tasks.length === 0 ? (
              <p className="text-gray-500">No tasks yet. Add a new task to get started!</p>
            ) : (
              <ul className="space-y-4">
                {tasks.map((task) => (
                  <li key={task.id} className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => handleToggleComplete(task.id, task.completed)}
                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <div className="ml-3">
                        <p className={`text-sm font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          {task.title}
                        </p>
                        {task.description && (
                          <p className={`text-sm ${task.completed ? 'line-through text-gray-500' : 'text-gray-500'}`}>
                            {task.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="rounded-md bg-red-600 px-3 py-1 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}