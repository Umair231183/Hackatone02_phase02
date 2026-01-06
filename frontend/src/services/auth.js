// frontend/src/services/auth.js

// Get the API base URL from environment variables
import { validateLoginAttempt, recordFailedAttempt, validateRegistrationAttempt } from '../lib/rateLimiter';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Function to login user
export const login = async (email, password) => {
  try {
    // Validate login attempt to prevent brute force
    validateLoginAttempt(email);

    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();

      // Record failed attempt for rate limiting
      recordFailedAttempt(email);

      // Provide more specific error messages based on response status
      if (response.status === 401) {
        throw new Error('Invalid email or password. Please try again.');
      } else if (response.status === 422) {
        throw new Error('Invalid input data. Please check your email and password.');
      } else {
        // Extract the specific error message from the backend if available
        const errorMessage = errorData.detail || 'Login failed. Please try again later.';
        throw new Error(errorMessage);
      }
    }

    const data = await response.json();
    // Store the token in localStorage or sessionStorage
    localStorage.setItem('token', data.access_token);
    return data;
  } catch (error) {
    console.error('Login error:', error);
    // Re-throw the error to be handled by the UI
    throw error;
  }
};

// Function to register user
export const register = async (email, name, password) => {
  try {
    // Validate registration attempt to prevent abuse
    validateRegistrationAttempt(email);

    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, name, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();

      // Provide more specific error messages based on response status
      if (response.status === 400) {
        throw new Error('User already exists with this email. Please use a different email.');
      } else if (response.status === 422) {
        throw new Error('Invalid input data. Please check your name, email, and password.');
      } else {
        // Extract the specific error message from the backend if available
        const errorMessage = errorData.detail || 'Registration failed. Please try again later.';
        throw new Error(errorMessage);
      }
    }

    const data = await response.json();
    // Store the token in localStorage or sessionStorage
    localStorage.setItem('token', data.access_token);
    return data;
  } catch (error) {
    console.error('Registration error:', error);
    // Re-throw the error to be handled by the UI
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

// Function to refresh token (if needed)
export const refreshToken = async () => {
  const token = getToken();
  if (!token) {
    throw new Error('No token available');
  }

  try {
    // In a real app, you would have an endpoint to refresh the token
    // This is just a placeholder implementation
    const response = await fetch(`${API_BASE_URL}/refresh`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    const data = await response.json();
    localStorage.setItem('token', data.access_token);
    return data;
  } catch (error) {
    console.error('Token refresh error:', error);
    logout(); // If refresh fails, log the user out
    throw error;
  }
};

// Function to validate token
export const validateToken = async () => {
  const token = getToken();
  if (!token) {
    return false;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/validate`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.ok;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
};