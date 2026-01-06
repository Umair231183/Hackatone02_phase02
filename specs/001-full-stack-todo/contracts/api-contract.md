# API Contract: Full-Stack Todo Web Application

**Feature**: Full-Stack Todo Web Application
**Date**: 2026-01-04

## Overview

This document defines the API contracts for the Full-Stack Todo Web Application based on the functional requirements. It specifies the endpoints, request/response formats, and authentication requirements.

## Base URL

All API endpoints are under `/api`

## Authentication

All endpoints (except authentication endpoints) require a valid JWT in the Authorization header:
```
Authorization: Bearer {jwt_token}
```

## API Endpoints

### GET /api/{user_id}/tasks

**Purpose**: Retrieve the list of tasks for a specific user

**Authentication**: Required - Valid JWT

**Parameters**:
- `user_id` (path parameter): The ID of the user whose tasks to retrieve
  - Must match the user ID in the JWT for authorization

**Headers**:
- `Authorization`: Bearer {valid JWT token}

**Response**:
- `200 OK`: Successfully retrieved task list
  - Response body: Array of task objects
  - Example: 
    ```json
    [
      {
        "id": 1,
        "user_id": "user123",
        "title": "Sample task",
        "description": "Sample description",
        "completed": false,
        "created_at": "2026-01-04T10:00:00Z",
        "updated_at": "2026-01-04T10:00:00Z"
      }
    ]
    ```
- `401 Unauthorized`: Missing or invalid JWT
- `403 Forbidden`: user_id in URL doesn't match JWT user ID
- `404 Not Found`: User doesn't exist

### POST /api/{user_id}/tasks

**Purpose**: Create a new task for a specific user

**Authentication**: Required - Valid JWT

**Parameters**:
- `user_id` (path parameter): The ID of the user creating the task
  - Must match the user ID in the JWT for authorization

**Headers**:
- `Authorization`: Bearer {valid JWT token}

**Request Body**:
- `title` (string, required): The title of the task
- `description` (string, optional): The description of the task

**Response**:
- `201 Created`: Task successfully created
  - Response body: Created task object
  - Example: 
    ```json
    {
      "id": 1,
      "user_id": "user123",
      "title": "New task",
      "description": "New description",
      "completed": false,
      "created_at": "2026-01-04T10:00:00Z",
      "updated_at": "2026-01-04T10:00:00Z"
    }
    ```
- `400 Bad Request`: Invalid request body (e.g., missing title)
- `401 Unauthorized`: Missing or invalid JWT
- `403 Forbidden`: user_id in URL doesn't match JWT user ID
- `422 Unprocessable Entity`: Validation error

### GET /api/{user_id}/tasks/{id}

**Purpose**: Retrieve a specific task for a user

**Authentication**: Required - Valid JWT

**Parameters**:
- `user_id` (path parameter): The ID of the user whose task to retrieve
  - Must match the user ID in the JWT for authorization
- `id` (path parameter): The ID of the task to retrieve

**Headers**:
- `Authorization`: Bearer {valid JWT token}

**Response**:
- `200 OK`: Successfully retrieved task
  - Response body: Task object
  - Example: 
    ```json
    {
      "id": 1,
      "user_id": "user123",
      "title": "Sample task",
      "description": "Sample description",
      "completed": false,
      "created_at": "2026-01-04T10:00:00Z",
      "updated_at": "2026-01-04T10:00:00Z"
    }
    ```
- `401 Unauthorized`: Missing or invalid JWT
- `403 Forbidden`: user_id in URL doesn't match JWT user ID or task doesn't belong to user
- `404 Not Found`: Task doesn't exist

### PUT /api/{user_id}/tasks/{id}

**Purpose**: Update a specific task for a user

**Authentication**: Required - Valid JWT

**Parameters**:
- `user_id` (path parameter): The ID of the user whose task to update
  - Must match the user ID in the JWT for authorization
- `id` (path parameter): The ID of the task to update

**Headers**:
- `Authorization`: Bearer {valid JWT token}

**Request Body**:
- `title` (string, required): The updated title of the task
- `description` (string, optional): The updated description of the task

**Response**:
- `200 OK`: Task successfully updated
  - Response body: Updated task object
  - Example: 
    ```json
    {
      "id": 1,
      "user_id": "user123",
      "title": "Updated task",
      "description": "Updated description",
      "completed": false,
      "created_at": "2026-01-04T10:00:00Z",
      "updated_at": "2026-01-04T11:00:00Z"
    }
    ```
- `400 Bad Request`: Invalid request body
- `401 Unauthorized`: Missing or invalid JWT
- `403 Forbidden`: user_id in URL doesn't match JWT user ID or task doesn't belong to user
- `404 Not Found`: Task doesn't exist
- `422 Unprocessable Entity`: Validation error

### DELETE /api/{user_id}/tasks/{id}

**Purpose**: Delete a specific task for a user

**Authentication**: Required - Valid JWT

**Parameters**:
- `user_id` (path parameter): The ID of the user whose task to delete
  - Must match the user ID in the JWT for authorization
- `id` (path parameter): The ID of the task to delete

**Headers**:
- `Authorization`: Bearer {valid JWT token}

**Response**:
- `204 No Content`: Task successfully deleted
- `401 Unauthorized`: Missing or invalid JWT
- `403 Forbidden`: user_id in URL doesn't match JWT user ID or task doesn't belong to user
- `404 Not Found`: Task doesn't exist

### PATCH /api/{user_id}/tasks/{id}/complete

**Purpose**: Update the completion status of a specific task for a user

**Authentication**: Required - Valid JWT

**Parameters**:
- `user_id` (path parameter): The ID of the user whose task to update
  - Must match the user ID in the JWT for authorization
- `id` (path parameter): The ID of the task to update

**Headers**:
- `Authorization`: Bearer {valid JWT token}

**Request Body**:
- `completed` (boolean, required): The new completion status of the task

**Response**:
- `200 OK`: Task completion status successfully updated
  - Response body: Updated task object
  - Example: 
    ```json
    {
      "id": 1,
      "user_id": "user123",
      "title": "Sample task",
      "description": "Sample description",
      "completed": true,
      "created_at": "2026-01-04T10:00:00Z",
      "updated_at": "2026-01-04T11:00:00Z"
    }
    ```
- `400 Bad Request`: Invalid request body (e.g., missing completed field)
- `401 Unauthorized`: Missing or invalid JWT
- `403 Forbidden`: user_id in URL doesn't match JWT user ID or task doesn't belong to user
- `404 Not Found`: Task doesn't exist
- `422 Unprocessable Entity`: Validation error

## Error Response Format

All error responses follow this format:
```
{
  "detail": "Error message describing the issue"
}
```

## Security Considerations

### User Isolation
- URL user_id must match JWT user ID for authorization
- All database queries must be filtered by authenticated user ID
- Users cannot access tasks belonging to other users

### Authentication Validation
- All protected endpoints validate JWT tokens
- Invalid or expired tokens result in 401 Unauthorized responses
- Proper error messages without exposing sensitive information