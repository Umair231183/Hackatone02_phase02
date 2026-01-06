# Architecture Specification: Full-Stack Todo Web Application

**Feature Branch**: `001-full-stack-todo`
**Created**: 2026-01-04
**Status**: Draft

## Purpose

This document outlines the architectural design for the Full-Stack Todo Web Application, detailing the system components, their interactions, and the overall technical approach.

## System Architecture

The application follows a clear separation of concerns with distinct layers:

### Frontend Layer (Next.js)
- **Responsibility**: UI, routing, session handling
- **Technology**: Next.js (App Router)
- **Components**: Server Components by default, Client Components only when necessary
- **Communication**: API calls to backend only (no direct database access)

### Backend Layer (FastAPI)
- **Responsibility**: Business logic, validation, authentication enforcement
- **Technology**: Python FastAPI
- **Components**: API endpoints, business logic, JWT validation
- **Communication**: Database operations via SQLModel ORM

### Authentication Layer (Better Auth)
- **Responsibility**: Identity management, JWT issuance
- **Technology**: Better Auth (JWT-based)
- **Components**: User registration, login, JWT generation/validation

### Database Layer (Neon PostgreSQL)
- **Responsibility**: Persistent storage
- **Technology**: Neon Serverless PostgreSQL with SQLModel
- **Components**: Task and User data storage

## API Architecture

### Base Path
- All API endpoints will be under `/api`

### Endpoints
- GET `/api/{user_id}/tasks` - Retrieve user's task list
- POST `/api/{user_id}/tasks` - Create a new task for user
- GET `/api/{user_id}/tasks/{id}` - Retrieve specific task
- PUT `/api/{user_id}/tasks/{id}` - Update specific task
- DELETE `/api/{user_id}/tasks/{id}` - Delete specific task
- PATCH `/api/{user_id}/tasks/{id}/complete` - Update task completion status

### Authentication
- All endpoints require a valid JWT in the Authorization header
- JWT must be issued by Better Auth
- Backend must verify JWT using shared secret
- User identity must be extracted from JWT, not from request body

## Data Architecture

### Task Entity
- id (integer, primary key)
- user_id (string, indexed)
- title (string, required)
- description (text, optional)
- completed (boolean, default false)
- created_at (timestamp)
- updated_at (timestamp)

### User Isolation
- All database queries must be filtered by authenticated user ID
- URL `user_id` must match JWT user ID
- Users can only access their own tasks

## Security Architecture

### Authentication Flow
1. User registers/ logs in via frontend
2. Better Auth issues JWT on successful authentication
3. JWT is stored client-side and sent with each API request
4. Backend validates JWT on each request
5. User identity is extracted from JWT for authorization

### Authorization Flow
1. JWT is validated for each API request
2. User identity is extracted from JWT
3. Requested action is validated against user's permissions
4. Database queries are filtered by authenticated user ID

## Technology Stack

- **Frontend**: Next.js 16+ (App Router, TypeScript)
- **Backend**: Python FastAPI
- **ORM**: SQLModel
- **Database**: Neon Serverless PostgreSQL
- **Authentication**: Better Auth (JWT-based)
- **Spec System**: SpecifyPlus Kit
- **AI Implementation**: Qwen CLI

## Error Handling Architecture

### Standard HTTP Responses
- 401 Unauthorized → missing/invalid JWT
- 403 Forbidden → user accessing another user's data
- 404 Not Found → task does not exist
- 422 Unprocessable Entity → validation error

## Deployment Architecture

- Frontend: Deployed to Vercel
- Backend API: Deployed to appropriate hosting platform
- Database: Neon PostgreSQL serverless instance