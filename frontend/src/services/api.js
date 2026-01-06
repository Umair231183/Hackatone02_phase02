// frontend/src/services/api.js

// Get the API base URL from environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Helper function to get user ID from JWT token
const getUserIdFromToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.user_id; // Use user_id instead of sub
  } catch (error) {
    return null;
  }
};

// Function to get all tasks for a user
export const getTasks = async () => {
  try {
    const token = localStorage.getItem('token');
    const userId = getUserIdFromToken();
    
    if (!token || !userId) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/${userId}/tasks`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized: Please log in again');
      } else if (response.status === 403) {
        throw new Error('Forbidden: You do not have permission to access these tasks');
      } else if (response.status === 404) {
        throw new Error('User not found');
      } else {
        throw new Error('Failed to fetch tasks');
      }
    }

    return await response.json();
  } catch (error) {
    console.error('Get tasks error:', error);
    throw error;
  }
};

// Function to create a new task
export const createTask = async (taskData) => {
  try {
    const token = localStorage.getItem('token');
    const userId = getUserIdFromToken();
    
    if (!token || !userId) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/${userId}/tasks`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized: Please log in again');
      } else if (response.status === 403) {
        throw new Error('Forbidden: You do not have permission to create tasks for this user');
      } else if (response.status === 422) {
        throw new Error('Unprocessable Entity: Task title is required');
      } else {
        throw new Error('Failed to create task');
      }
    }

    return await response.json();
  } catch (error) {
    console.error('Create task error:', error);
    throw error;
  }
};

// Function to get a specific task
export const getTask = async (userId, taskId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/${userId}/tasks/${taskId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized: Please log in again');
      } else if (response.status === 403) {
        throw new Error('Forbidden: You do not have permission to access this task');
      } else if (response.status === 404) {
        throw new Error('Task not found');
      } else {
        throw new Error('Failed to fetch task');
      }
    }

    return await response.json();
  } catch (error) {
    console.error('Get task error:', error);
    throw error;
  }
};

// Function to update a task
export const updateTask = async (userId, taskId, taskData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/${userId}/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized: Please log in again');
      } else if (response.status === 403) {
        throw new Error('Forbidden: You do not have permission to update this task');
      } else if (response.status === 404) {
        throw new Error('Task not found');
      } else {
        throw new Error('Failed to update task');
      }
    }

    return await response.json();
  } catch (error) {
    console.error('Update task error:', error);
    throw error;
  }
};

// Function to delete a task
export const deleteTask = async (taskId) => {
  try {
    const token = localStorage.getItem('token');
    const userId = getUserIdFromToken();
    
    if (!token || !userId) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/${userId}/tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized: Please log in again');
      } else if (response.status === 403) {
        throw new Error('Forbidden: You do not have permission to delete this task');
      } else if (response.status === 404) {
        throw new Error('Task not found');
      } else {
        throw new Error('Failed to delete task');
      }
    }

    return await response.json();
  } catch (error) {
    console.error('Delete task error:', error);
    throw error;
  }
};

// Function to update task completion status
export const toggleTaskComplete = async (taskId, completed) => {
  try {
    const token = localStorage.getItem('token');
    const userId = getUserIdFromToken();
    
    if (!token || !userId) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/${userId}/tasks/${taskId}/complete`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completed }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized: Please log in again');
      } else if (response.status === 403) {
        throw new Error('Forbidden: You do not have permission to update this task');
      } else if (response.status === 404) {
        throw new Error('Task not found');
      } else {
        throw new Error('Failed to update task completion status');
      }
    }

    return await response.json();
  } catch (error) {
    console.error('Update task completion error:', error);
    throw error;
  }
};