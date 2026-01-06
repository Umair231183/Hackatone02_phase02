// src/components/SecurityMiddleware.js
'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { isAuthenticated, validateToken } from '../services/auth';
import { useNotification } from '../contexts/NotificationContext';

export default function SecurityMiddleware({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { addNotification } = useNotification();

  useEffect(() => {
    const checkAuth = async () => {
      // Public routes that don't require authentication
      const publicRoutes = ['/', '/login', '/register'];
      
      // Check if the current route requires authentication
      const isProtectedRoute = !publicRoutes.includes(pathname);
      
      if (isProtectedRoute) {
        // Check if user is authenticated
        if (!isAuthenticated()) {
          // Redirect to login if not authenticated
          router.push('/login');
          addNotification('Please log in to access this page', 'info');
          return;
        }
        
        // Optionally validate the token with the backend
        // const isValid = await validateToken();
        // if (!isValid) {
        //   // Token is invalid, log out the user
        //   localStorage.removeItem('token');
        //   router.push('/login');
        //   addNotification('Session expired. Please log in again.', 'warning');
        // }
      }
      
      // For login/register pages, redirect to dashboard if already logged in
      if (['/login', '/register'].includes(pathname) && isAuthenticated()) {
        router.push('/dashboard');
      }
    };

    checkAuth();
  }, [pathname, router, addNotification]);

  // Additional security measures
  useEffect(() => {
    // Prevent common XSS attacks by sanitizing inputs
    // Add security headers if possible
    // Implement other security measures as needed
    
    // Example: Add a security header to prevent clickjacking
    if (typeof document !== 'undefined') {
      document.addEventListener('DOMContentLoaded', () => {
        // Add security measures after DOM loads
      });
    }
  }, []);

  return <>{children}</>;
}