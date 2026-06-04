# Social Media App

A microservices-based social media application with caching, authentication, and post management.

## Microservices

### Identity Service

Handles user authentication and registration.

- **Location:** `identity-service/`
- **Port:** 8080 (default)
- **Key Features:**
  - User registration with Argon2 password hashing
  - JWT access token generation
  - Refresh token management
  - Redis-based rate limiting on sensitive endpoints

See [identity-service/README.md](identity-service/README.md) for details.

### API Gateway

Central gateway that routes requests to microservices and applies shared security middleware.

- **Location:** `api-gateway/`
- **Port:** 9090 (default)
- **Key Features:**
  - Request proxying to microservices
  - Global rate limiting
  - Helmet security headers
  - CORS configuration
  - Shared Redis client

See [api-gateway/README.md](api-gateway/README.md) for details.

### Post Service

Manages post creation, retrieval, updates, and deletion with Redis caching.

- **Location:** `post-service/`
- **Port:** 7071 (default)
- **Key Features:**
  - CRUD operations for posts
  - Redis caching for list and detail views
  - Automatic cache invalidation
  - Pagination support
  - Authentication required

See [post-service/README.md](post-service/README.md) for details.

### Media Service

Handles media file uploads and storage for posts.

- **Location:** `media-service/`
- **Key Features:** Media upload and retrieval

See [media-service/README.md](media-service/README.md) for details.

## Getting Started

Each microservice is independent. Navigate to its directory and follow the service-specific README.

### Quick Start

1. Start Redis (required for caching and rate limiting):

   ```bash
   redis-server
   ```

2. Start each service in separate terminals:

   ```bash
   # Terminal 1: Identity Service
   cd identity-service
   npm install
   npm run dev

   # Terminal 2: API Gateway
   cd api-gateway
   npm install
   npm run dev

   # Terminal 3: Post Service
   cd post-service
   npm install
   npm run dev
   ```

## Project Structure

```
social-media-app/
├── api-gateway/             # Request routing and middleware
├── identity-service/        # Authentication microservice
├── post-service/            # Post management microservice
├── media-service/           # Media handling microservice
└── README.md                # This file
```

## Architecture Highlights

- **Microservices:** Independent services with clear responsibilities
- **Redis Caching:** Improves performance for frequently accessed data
- **Rate Limiting:** Protects endpoints from abuse
- **JWT Authentication:** Secure token-based access control
- **Shared Redis:** Centralized cache and session management

## Environment Setup

Each service requires a `.env` file. See individual service READMEs for specifics.

Common variables:

- `REDIS_URL`: Redis connection URL (default: `redis://localhost:6379`)
- `PORT`: Service port
- `MONGO_URI`: MongoDB connection (for services using databases)

## Notes

- Each service has its own dependencies and environment configuration
- Redis is required for caching and rate limiting
- MongoDB is required for identity and post services
- Start services in order: Identity Service → API Gateway → Post Service
