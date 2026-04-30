# 🍅 Tomato - Food Delivery App

A full-stack food delivery web application built with a microservices architecture.

## Tech Stack

**Frontend**
- React + Vite

**Backend (Microservices)**
- Node.js + Express.js (TypeScript)
- MongoDB (Mongoose)
- RabbitMQ (inter-service messaging)
- Google OAuth 2.0 (authentication)
- JWT (session management)

## Project Structure

```
tomato/
├── frontend/          # React + Vite app
└── services/
    ├── auth/          # Authentication microservice
    └── rider/         # Rider microservice
```

## Services

### Auth Service (Port: 5000)

Handles user authentication and role management via Google OAuth.

| Method | Endpoint         | Auth | Description          |
|--------|------------------|------|----------------------|
| POST   | /api/auth/login  | No   | Login with Google    |
| PUT    | /api/auth/add/role | Yes | Assign user role   |
| GET    | /api/auth/me     | Yes  | Get current profile  |

**User Roles:** `customer`, `rider`, `seller`

## Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB
- RabbitMQ

### Auth Service Setup

```bash
cd services/auth
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGO_URI=<your_mongodb_uri>
SECRET_KEY=<your_jwt_secret>
GOOGLE_CLIENT_ID=<your_google_client_id>
GOOGLE_CLIENT_SECRET=<your_google_client_secret>
```

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Authentication Flow

1. Client sends Google OAuth authorization code to `POST /api/auth/login`
2. Server exchanges code for user info via Google API
3. User is created or fetched from MongoDB
4. JWT token is returned to the client
5. Client includes token in `Authorization: Bearer <token>` header for protected routes
