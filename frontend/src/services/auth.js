// frontend/src/services/auth.js

// Get the API base URL from environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Function to login user
export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Login failed');
    }

    const data = await response.json();
    // Store the token in localStorage or sessionStorage
    localStorage.setItem('token', data.access_token);
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Function to register user
export const register = async (email, name, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, name, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Registration failed');
    }

    const data = await response.json();
    // Store the token in localStorage or sessionStorage
    localStorage.setItem('token', data.access_token);
    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Function to logout user
export const logout = () => {
  localStorage.removeItem('token');
};

// Function to get token
export const getToken = () => {
  return localStorage.getItem('token');
};

// Function to check if user is authenticated
export const isAuthenticated = () => {
  const token = getToken();
  return !!token;
};

// Function to add auth headers to requests
export const authHeaders = () => {
  const token = getToken();
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};