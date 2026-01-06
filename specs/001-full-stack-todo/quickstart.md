# Quickstart Guide: Full-Stack Todo Web Application

**Feature**: Full-Stack Todo Web Application
**Date**: 2026-01-04

## Overview

This quickstart guide provides instructions for setting up, running, and testing the Full-Stack Todo Web Application. The application consists of a Next.js frontend and a FastAPI backend with Neon PostgreSQL database and Better Auth for authentication.

## Prerequisites

- Node.js 18+ (for frontend development)
- Python 3.11+ (for backend development)
- PostgreSQL client tools (for database operations)
- Git
- A Neon account for PostgreSQL hosting
- A Better Auth account for authentication

## Environment Setup

### Backend Setup

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Create a virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install fastapi uvicorn sqlmodel python-jose[cryptography] passlib[bcrypt] psycopg2-binary python-multipart python-dotenv
   ```

4. **Set up environment variables**:
   Create a `.env` file in the backend directory with the following:
   ```
   DATABASE_URL=postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require
   SECRET_KEY=your-super-secret-key-here
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ```

### Frontend Setup

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file in the frontend directory with the following:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:8000
   ```

## Database Setup

1. **Initialize the database**:
   ```bash
   # In the backend directory
   python -c "from src.database.database import create_db_and_tables; create_db_and_tables()"
   ```

2. **Run migrations** (if using alembic):
   ```bash
   alembic revision --autogenerate -m "Initial migration"
   alembic upgrade head
   ```

## Running the Application

### Backend (FastAPI)

1. **Start the backend server**:
   ```bash
   cd backend
   uvicorn src.api.main:app --reload --port 8000
   ```

2. **API will be available at**: `http://localhost:8000`

3. **API documentation will be available at**: `http://localhost:8000/docs`

### Frontend (Next.js)

1. **Start the frontend server**:
   ```bash
   cd frontend
   npm run dev
   # or
   yarn dev
   ```

2. **Application will be available at**: `http://localhost:3000`

## Testing the Application

### API Testing

1. **Using the API documentation**:
   - Visit `http://localhost:8000/docs`
   - Test endpoints directly from the Swagger UI
   - Remember to authenticate first to get a JWT token

2. **Using curl**:
   ```bash
   # Get all tasks for a user (requires authentication)
   curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
        http://localhost:8000/api/user123/tasks
   ```

### Frontend Testing

1. **Visit the application**: `http://localhost:3000`
2. **Register a new user** or **log in** with existing credentials
3. **Create, read, update, and delete tasks** to verify functionality
4. **Verify user isolation** by logging in with different user accounts

## Key Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token

### Task Management
- `GET /api/{user_id}/tasks` - Get all tasks for a user
- `POST /api/{user_id}/tasks` - Create a new task
- `GET /api/{user_id}/tasks/{id}` - Get a specific task
- `PUT /api/{user_id}/tasks/{id}` - Update a task
- `DELETE /api/{user_id}/tasks/{id}` - Delete a task
- `PATCH /api/{user_id}/tasks/{id}/complete` - Update task completion status

## Troubleshooting

### Common Issues

1. **Database Connection Issues**:
   - Verify your Neon PostgreSQL connection string is correct
   - Check that your database credentials are valid
   - Ensure your Neon project is active and accessible

2. **Authentication Issues**:
   - Verify that the SECRET_KEY is set correctly in both frontend and backend
   - Check that JWT tokens are being properly included in requests
   - Ensure Better Auth is properly configured

3. **Frontend-Backend Communication**:
   - Verify that the API URL is correctly set in frontend environment variables
   - Check that CORS is properly configured in the backend
   - Ensure both servers are running simultaneously

### Verification Steps

1. **Check backend is running**: Visit `http://localhost:8000/health` (should return `{"status": "ok"}`)
2. **Check database connection**: Visit `http://localhost:8000/db-health` (should return database status)
3. **Test API endpoints**: Use the built-in Swagger UI at `http://localhost:8000/docs`
4. **Verify authentication**: Register a user and verify you can get a JWT token
5. **Test task operations**: Create, read, update, and delete tasks to ensure full functionality

## Next Steps

1. **Deploy the backend** to a cloud platform (Railway, Render, etc.)
2. **Deploy the frontend** to Vercel or Netlify
3. **Set up CI/CD pipelines** for automated testing and deployment
4. **Add monitoring and logging** for production readiness
5. **Implement additional features** as needed