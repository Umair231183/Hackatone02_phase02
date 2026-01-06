# UI Specification: Components

**Feature Branch**: `001-full-stack-todo`
**Created**: 2026-01-04
**Status**: Draft

## Purpose

This document specifies the reusable UI components for the Full-Stack Todo Web Application. These components provide consistent user interface elements across all pages of the application.

## Component Architecture

### Framework & Technology
- **Framework**: Next.js 16+ with App Router
- **Language**: TypeScript
- **Component Strategy**: Server Components by default, Client Components only when necessary
- **Styling**: Responsive design with CSS Modules or Tailwind CSS

## Core Components

### Authentication Components

#### `AuthForm` Component
**Purpose**: Reusable form component for authentication pages (login/register)

**Props**:
- `formType`: 'login' | 'register'
- `onSubmit`: Function to handle form submission
- `onError`: Function to handle error display

**Features**:
- Dynamic form fields based on formType
- Form validation
- Loading states
- Error messaging

#### `LoginForm` Component
**Purpose**: Specific implementation of AuthForm for login functionality

**Features**:
- Email and password fields
- "Remember me" option
- Forgot password link
- Social login options (if applicable)

#### `RegisterForm` Component
**Purpose**: Specific implementation of AuthForm for registration functionality

**Features**:
- Username, email, and password fields
- Password confirmation
- Terms and conditions agreement
- Privacy policy link

### Task Management Components

#### `TaskCard` Component
**Purpose**: Display an individual task with key information and actions

**Props**:
- `task`: Task object with id, title, description, completed status
- `onToggleComplete`: Function to handle completion status change
- `onEdit`: Function to handle task editing
- `onDelete`: Function to handle task deletion

**Features**:
- Visual indication of completion status
- Title and description display
- Action buttons (edit, delete, mark complete)
- Responsive design

#### `TaskList` Component
**Purpose**: Display a list of TaskCard components

**Props**:
- `tasks`: Array of task objects
- `onTaskUpdate`: Function to handle task updates
- `onTaskDelete`: Function to handle task deletion

**Features**:
- Filtering options (all, completed, pending)
- Empty state handling
- Loading states
- Infinite scroll or pagination (if needed)

#### `TaskForm` Component
**Purpose**: Form for creating or editing tasks

**Props**:
- `initialData`: Optional initial task data for editing
- `onSubmit`: Function to handle form submission
- `onCancel`: Function to handle form cancellation

**Features**:
- Title input field
- Description text area
- Completion status toggle
- Form validation
- Loading states

### Navigation Components

#### `Navbar` Component
**Purpose**: Navigation bar displayed on all pages

**Props**:
- `user`: Optional user object (if authenticated)
- `onLogout`: Function to handle logout

**Features**:
- Logo/branding
- Navigation links (conditional based on auth status)
- User profile dropdown (when authenticated)
- Mobile responsive menu

#### `Sidebar` Component
**Purpose**: Additional navigation options for authenticated users

**Props**:
- `activePage`: Current active page for highlighting

**Features**:
- Dashboard link
- Task management links
- Profile/settings link
- Collapsible on mobile

### Layout Components

#### `MainLayout` Component
**Purpose**: Main layout wrapper for authenticated pages

**Props**:
- `children`: Page content
- `user`: Current user object

**Features**:
- Includes Navbar and Sidebar
- Responsive layout management
- Content area with appropriate padding

#### `AuthLayout` Component
**Purpose**: Layout wrapper for authentication pages

**Props**:
- `children`: Page content

**Features**:
- Minimal layout without navigation
- Centered content
- Appropriate spacing

### Utility Components

#### `LoadingSpinner` Component
**Purpose**: Display loading state during API requests

**Features**:
- Animated spinner
- Optional text message
- Accessible loading indicators

#### `Alert` Component
**Purpose**: Display success, error, warning, or info messages

**Props**:
- `type`: 'success' | 'error' | 'warning' | 'info'
- `message`: Message to display
- `onClose`: Optional function to handle closing

**Features**:
- Different styling based on type
- Dismissible option
- Accessible alerts

#### `Modal` Component
**Purpose**: Display modal dialogs for confirmation or additional information

**Props**:
- `isOpen`: Boolean to control visibility
- `title`: Modal title
- `children`: Modal content
- `onClose`: Function to handle closing

**Features**:
- Overlay background
- Close button
- Keyboard accessibility (ESC to close)
- Focus management

## Client-Specific Components

### `TaskActionsClient` Component
**Purpose**: Client component for task actions that require interactivity

**Props**:
- `taskId`: ID of the task to act upon
- `onCompleteToggle`: Function to handle completion toggle
- `onEdit`: Function to handle edit action
- `onDelete`: Function to handle delete action

**Features**:
- Client-side interactivity for task actions
- Optimistic updates
- Error handling for API calls

## Styling Guidelines

### Responsive Design
- Components must be responsive across mobile, tablet, and desktop
- Use CSS Grid or Flexbox for layout
- Implement mobile-first approach

### Accessibility
- All components must be keyboard navigable
- Proper ARIA attributes where needed
- Sufficient color contrast
- Semantic HTML elements

### Consistency
- Use consistent color palette
- Maintain consistent spacing and typography
- Follow design system principles

## Security Considerations

### Client-Side Security
- Components should not expose sensitive data
- Proper input sanitization
- Secure handling of JWT tokens
- Prevent XSS through proper escaping

### User Isolation
- Components should only display user's own data
- Proper authentication checks before rendering sensitive components
- Clear components when user logs out

## Performance Requirements

### Component Optimization
- Implement proper React.memo where appropriate
- Use lazy loading for non-critical components
- Optimize images and assets
- Minimize unnecessary re-renders

### Bundle Size
- Keep component bundle sizes small
- Use code splitting where appropriate
- Tree-shake unused code

## Constraints

- Server Components by default; Client Components only when necessary
- All components must be responsive
- Follow accessibility guidelines (WCAG 2.1 AA)
- Use TypeScript for type safety
- Components must be reusable and modular
- Proper error boundaries for error handling
- Follow Next.js best practices for component organization