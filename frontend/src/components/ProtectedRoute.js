// src/components/ProtectedRoute.js
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useNotification } from '../contexts/NotificationContext';

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const { addNotification } = useNotification();
  const [authorized, setAuthorized] = useState(undefined); // undefined = loading, true/false = loaded
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Mark that we're on the client side
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return; // Only run on client side

    // Check if user is logged in by checking for token in localStorage
    const token = localStorage.getItem('token');

    if (!token) {
      // No token found, redirect to login
      addNotification('Please log in to access this page', 'info');
      router.push('/login');
      setAuthorized(false);
    } else {
      // Token exists, allow access
      setAuthorized(true);
    }
  }, [isClient, router, addNotification]);

  // Show loading state while checking authentication
  if (!isClient || authorized === undefined) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If not authorized, don't render anything (redirect happens in useEffect)
  if (authorized === false) {
    return null;
  }

  // If authorized, render the children
  return <>{children}</>;
}