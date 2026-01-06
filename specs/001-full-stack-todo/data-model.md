# Data Model: Full-Stack Todo Web Application

**Feature**: Full-Stack Todo Web Application
**Date**: 2026-01-04

## Overview

This document defines the data models for the Full-Stack Todo Web Application, including entities, their attributes, relationships, and validation rules based on the functional requirements.

## Entity: User

**Description**: Represents an authenticated user in the system

**Attributes**:
- `id` (string): Unique identifier for the user (managed by Better Auth)
- `email` (string): User's email address
- `name` (string, optional): User's display name
- `created_at` (timestamp): When the user account was created
- `updated_at` (timestamp): When the user account was last updated

**Relationships**:
- One-to-Many: A user can have many tasks

**Validation Rules**:
- `email` must be a valid email format
- `email` must be unique across all users
- `id` is required and immutable after creation

## Entity: Task

**Description**: Represents a todo item that belongs to a specific user

**Attributes**:
- `id` (integer): Unique identifier for the task (auto-increment primary key)
- `user_id` (string): Foreign key to the user who owns the task
- `title` (string): Title of the task
- `description` (text, optional): Detailed description of the task
- `completed` (boolean): Completion status of the task (default: false)
- `created_at` (timestamp): When the task was created
- `updated_at` (timestamp): When the task was last updated

**Relationships**:
- Many-to-One: A task belongs to one user

**Validation Rules**:
- `user_id` must reference a valid user
- `title` is required and must not be empty
- `title` must be no more than 255 characters
- `completed` defaults to false if not specified
- `user_id` cannot be changed after creation
- `created_at` is set automatically on creation
- `updated_at` is updated automatically on any modification

**State Transitions**:
- `completed` can transition from `false` to `true` or `true` to `false`
- All other attributes remain constant except for `updated_at` which updates on any change

## Database Schema

### Tasks Table

```sql
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_user_completed ON tasks(user_id, completed);
```

### Indexes

- Primary key index on `id`
- Index on `user_id` for efficient user-based queries
- Composite index on (`user_id`, `completed`) for common filtering operations

## Constraints

### User Isolation
- All database queries must be filtered by `user_id` to ensure users can only access their own tasks
- Foreign key constraint ensures `user_id` references a valid user
- Application logic must validate that the authenticated user matches the `user_id` in the task

### Data Integrity
- `title` field cannot be null or empty
- `user_id` field cannot be null
- `completed` field defaults to false
- Timestamps are automatically managed by the database

## API Data Contracts

### Task Creation Request
```json
{
  "title": "string (required, max 255 chars)",
  "description": "string (optional)"
}
```

### Task Response
```json
{
  "id": "integer",
  "user_id": "string",
  "title": "string",
  "description": "string or null",
  "completed": "boolean",
  "created_at": "ISO 8601 timestamp",
  "updated_at": "ISO 8601 timestamp"
}
```

### Task Update Request
```json
{
  "title": "string (required, max 255 chars)",
  "description": "string (optional)",
  "completed": "boolean (optional)"
}
```