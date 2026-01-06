// frontend/src/app/layout.js

import './globals.css';
import { ThemeProvider } from '../contexts/ThemeContext';
import { NotificationProvider } from '../contexts/NotificationContext';
import SecurityMiddleware from '../components/SecurityMiddleware';

export const metadata = {
  title: 'Todo App',
  description: 'A full-stack todo application',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="h-screen bg-gray-50 dark:bg-gray-900">
        <ThemeProvider>
          <NotificationProvider>
            <SecurityMiddleware>
              {children}
            </SecurityMiddleware>
          </NotificationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}