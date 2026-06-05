# Task Management Backend

## Overview

This is a Node.js + Express backend for a task management application. It uses MongoDB via Mongoose and supports user authentication with JWT, task creation, task retrieval, update, and deletion.

## Installation

1. Clone or copy the project into `c:\Users\Krish\Desktop\backend`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the project root with the following values:
   ```env
   MONGO_URI=<your-mongo-connection-string>
   JWT_SECRET=<your-secret-key>
   PORT=5000
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

## Environment Variables

- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - secret key used to sign JWT tokens
- `PORT` - port to run the backend server (optional, defaults to `5000`)

## Project Structure

- `server.js` - application entry point
- `config/db.js` - MongoDB connection setup
- `controllers/` - route handler logic
- `middleware/` - request middleware
- `models/` - Mongoose schemas
- `routes/` - Express route definitions

## Authentication

### Auth Flow

- Users register via `POST /api/auth/register`
- Users login via `POST /api/auth/login`
- Both endpoints return a JWT token and user data
- The token is signed with `process.env.JWT_SECRET`
- Token payload contains:
  - `id`: the authenticated user's MongoDB `_id`
- Token expiration is set to `1d` (one day)

### Token generation

In `controllers/authController.js`:

```js
const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
);
```

The returned response includes:

```json
{ "token": "<jwt>", "user": { ... } }
```

## Models

### `models/User.js`

Defines the user schema with:
- `name` (String, required)
- `email` (String, required, unique)
- `password` (String, required)
- timestamps for creation/update

### `models/Task.js`

Defines the task schema with fields such as:
- `title`
- `description`
- `status`
- `userId` to link the task to a user
- timestamps for creation/update

## Middleware

### `middleware/authMiddleware.js`

Protects routes by verifying the `Authorization` header bearer token.

Behavior:
- Reads `req.headers.authorization`
- Extracts token from `Bearer <token>`
- Verifies token with `jwt.verify(token, process.env.JWT_SECRET)`
- Attaches decoded payload to `req.user`
- Returns `401` if the token is missing or invalid

## Routes

### Auth routes

Defined in `routes/authRoutes.js`

- `POST /api/auth/register` - register a new user
- `POST /api/auth/login` - login existing user

### Task routes

Defined in `routes/taskRoutes.js`

- `POST /api/tasks` - create a new task
- `GET /api/tasks/tasks` - get tasks for the authenticated user
- `PUT /api/tasks/:id` - update a task by ID
- `DELETE /api/tasks/:id` - delete a task by ID

> Note: the current route definitions make the task list endpoint available at `/api/tasks/tasks` because `taskRoutes` is mounted at `/api/tasks` and the GET route path is `"/tasks"`.

## Controllers

### `controllers/authController.js`

- `register(req, res)`
  - checks if user exists
  - hashes password with `bcrypt.hash(password, 10)`
  - creates a new user
  - returns JWT and user data

- `login(req, res)`
  - finds user by email
  - compares password with `bcrypt.compare`
  - returns JWT and user data

### `controllers/taskController.js`

- `createTask(req, res)`
  - creates a task linked to `req.user.id`
- `getTasksByUserId(req, res)`
  - returns tasks for the authenticated user
  - supports pagination via `page` and `limit` query params
- `updateTask(req, res)`
  - updates an existing task by ID
- `deleteTask(req, res)`
  - deletes a task by ID

## Usage Examples

### Register

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "securepassword"
}
```

### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "alice@example.com",
  "password": "securepassword"
}
```

### Create Task

```http
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "New task",
  "description": "Task details",
  "status": "pending"
}
```

### Get Tasks

```http
GET /api/tasks/tasks?page=1&limit=10
Authorization: Bearer <token>
```

## Notes

- Ensure `JWT_SECRET` is a strong, unpredictable value
- Confirm `MONGO_URI` points to your MongoDB deployment
- The auth middleware is required for all task routes
