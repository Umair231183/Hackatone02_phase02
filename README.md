# Full-Stack Todo Web Application

This is a full-stack todo web application with user authentication and task management. The application uses Next.js for the frontend, Python FastAPI for the backend, with Neon PostgreSQL as the database and Better Auth for JWT-based authentication. The system enforces user isolation, ensuring users can only access their own tasks.

## Tech Stack

- **Frontend**: Next.js 16+ (App Router, TypeScript)
- **Backend**: Python FastAPI
- **ORM**: SQLModel
- **Database**: Neon Serverless PostgreSQL
- **Authentication**: Better Auth (JWT-based)
- **Spec System**: SpecifyPlus Kit
- **AI Implementation**: Qwen CLI

## Features

1. **User Registration and Authentication**
   - Secure user registration
   - JWT-based authentication
   - Protected routes

2. **Task Management**
   - Create, read, update, and delete tasks
   - Mark tasks as complete/incomplete
   - View task lists

3. **User Isolation**
   - Users can only access their own tasks
   - Proper authorization checks

## Setup

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   Create a `.env` file in the backend directory with the following:
   ```
   DATABASE_URL=postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require
   SECRET_KEY=your-super-secret-key-here
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ```

5. Start the backend server:
   ```bash
   python start_server.py
   # or
   uvicorn src.api.main:app --reload --port 8000
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the frontend directory with the following:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   ```

4. Start the frontend server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/login` - Login and get JWT token
- `POST /api/register` - Register a new user

### Task Management
- `GET /api/{user_id}/tasks` - Get all tasks for a user
- `POST /api/{user_id}/tasks` - Create a new task
- `GET /api/{user_id}/tasks/{id}` - Get a specific task
- `PUT /api/{user_id}/tasks/{id}` - Update a task
- `DELETE /api/{user_id}/tasks/{id}` - Delete a task
- `PATCH /api/{user_id}/tasks/{id}/complete` - Update task completion status

## Environment Variables

### Backend
- `DATABASE_URL` - PostgreSQL connection string
- `SECRET_KEY` - Secret key for JWT signing
- `ALGORITHM` - JWT algorithm (default: HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES` - Token expiration time (default: 30)

### Frontend
- `NEXT_PUBLIC_API_URL` - Backend API URL

## Error Handling

The application returns standardized HTTP responses:
- `401 Unauthorized` - Missing or invalid JWT
- `403 Forbidden` - User attempting to access another user's data
- `404 Not Found` - Requested resource doesn't exist
- `422 Unprocessable Entity` - Validation error

## Security Considerations

- JWT tokens are required for all authenticated endpoints
- User isolation is enforced at the API and database level
- URL user_id must match JWT user ID for authorization
- All sensitive data is protected by authentication

## Running the Application

1. Start the backend server first:
   ```bash
   cd backend
   python start_server.py
   ```

2. In a new terminal, start the frontend server:
   ```bash
   cd frontend
   npm run dev
   ```

3. Access the application at `http://localhost:3000`

The backend API will be available at `http://localhost:8000` with documentation at `http://localhost:8000/docs`