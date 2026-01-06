// src/lib/validation.js
import { z } from 'zod';

// User registration validation schema
export const registerSchema = z.object({
  name: z.string()
    .min(2, { message: 'Name must be at least 2 characters long' })
    .max(50, { message: 'Name must be at most 50 characters long' })
    .regex(/^[a-zA-Z\s]+$/, { message: 'Name can only contain letters and spaces' }),
  email: z.string()
    .email({ message: 'Please enter a valid email address' })
    .max(100, { message: 'Email must be at most 100 characters long' }),
  password: z.string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .max(100, { message: 'Password must be at most 100 characters long' })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, { 
      message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' 
    })
});

// User login validation schema
export const loginSchema = z.object({
  email: z.string()
    .email({ message: 'Please enter a valid email address' }),
  password: z.string()
    .min(1, { message: 'Password is required' })
});

// Task validation schema
export const taskSchema = z.object({
  title: z.string()
    .min(1, { message: 'Task title is required' })
    .max(255, { message: 'Task title must be at most 255 characters long' }),
  description: z.string()
    .max(1000, { message: 'Description must be at most 1000 characters long' })
    .optional()
    .nullable(),
});

// Profile update validation schema
export const profileSchema = z.object({
  name: z.string()
    .min(2, { message: 'Name must be at least 2 characters long' })
    .max(50, { message: 'Name must be at most 50 characters long' })
    .regex(/^[a-zA-Z\s]+$/, { message: 'Name can only contain letters and spaces' }),
  email: z.string()
    .email({ message: 'Please enter a valid email address' })
    .max(100, { message: 'Email must be at most 100 characters long' })
});

// Password change validation schema
export const passwordChangeSchema = z.object({
  currentPassword: z.string()
    .min(1, { message: 'Current password is required' }),
  newPassword: z.string()
    .min(8, { message: 'New password must be at least 8 characters long' })
    .max(100, { message: 'New password must be at most 100 characters long' })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, { 
      message: 'New password must contain at least one uppercase letter, one lowercase letter, and one number' 
    }),
  confirmPassword: z.string()
    .min(1, { message: 'Please confirm your new password' })
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'New passwords do not match',
  path: ['confirmPassword']
});