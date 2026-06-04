# API Gateway

The central gateway service that routes requests to microservices and applies shared security middleware.

## What it does

- Routes authentication requests to the identity service
- Routes post-related requests to the post service
- Applies global rate limiting for incoming requests
- Proxies requests to appropriate microservices
- Logs requests and responses
- Uses Helmet and CORS for security
- Manages shared Redis client for caching and rate limiting

## Key Features

- **Request Routing:** Forwards requests to appropriate microservices based on URL path
- **Rate Limiting:** Global rate limiting to prevent abuse
- **Security Headers:** Helmet middleware for HTTP security
- **CORS:** Cross-origin request handling
- **Request Logging:** Logs all incoming requests
- **Redis Integration:** Shared Redis client for caching across services

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file with:

   ```env
   PORT=9090
   IDENTITY_SERVICE_URL=http://localhost:8080
   POST_SERVICE_URL=http://localhost:7071
   REDIS_URL=redis://localhost:6379
   ```

3. Start the gateway:
   ```bash
   npm run dev
   ```

## Routes

- `POST /api/v1/auth/*` → Identity Service
- `GET|POST|PUT|DELETE /api/v1/post/*` → Post Service

## Environment Variables

- `PORT`: Gateway port (default: 9090)
- `IDENTITY_SERVICE_URL`: Identity service URL
- `POST_SERVICE_URL`: Post service URL
- `REDIS_URL`: Redis connection URL (default: redis://localhost:6379)

## Notes

- The gateway must be started before other services can be accessed from a client
- Ensure Redis is running before starting the gateway
- The gateway is the single entry point for all client requests
