# Identity Service

The authentication microservice for the social media app. Handles user registration, authentication, and token management.

## What it does

- Registers new users with email validation
- Hashes passwords securely using Argon2
- Generates JWT access tokens for authenticated sessions
- Manages refresh tokens for extended sessions
- Applies Redis-based rate limiting on sensitive endpoints
- Validates user input with Joi

## Key Features

### Authentication

- User registration via `POST /api/v1/auth/register`
- Argon2 password hashing for security
- JWT-based access tokens
- Refresh token management (stored in MongoDB)
- Token validation and verification

### Security

- Rate limiting on sensitive endpoints (using Redis)
- Password hashing with Argon2
- Input validation with Joi
- Helmet security headers
- CORS configuration
- Request logging

### API Endpoints

#### Register User

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secure_password",
  "username": "username"
}
```

Response:

```json
{
  "success": true,
  "accessToken": "jwt_token_here",
  "refreshToken": "refresh_token_here"
}
```

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file with:

   ```env
   PORT=8080
   MONGO_URI=mongodb://localhost:27017/social-media
   REDIS_URL=redis://localhost:6379
   JWT_ACCESS_SECRET=your_jwt_secret_key
   JWT_REFRESH_SECRET=your_refresh_secret_key
   ```

3. Start the service:
   ```bash
   npm run dev
   ```

## Database

- **MongoDB:** Stores user documents and refresh tokens
- **Redis:** Rate limiting data

## Models

### User

- `email`: User email (unique)
- `password`: Hashed password (Argon2)
- `username`: Human-readable username
- `createdAt`: Registration timestamp

### RefreshToken

- `token`: Refresh token string
- `userId`: Associated user ID
- `expiresAt`: Token expiration time

## Rate Limiting

Sensitive endpoints (like registration) have Redis-based rate limiting to prevent abuse.

## Dependencies

- Express.js: Web framework
- Mongoose: MongoDB ODM
- jsonwebtoken: JWT generation and verification
- Argon2: Password hashing
- ioredis: Redis client
- Joi: Schema validation
- Winston: Logging
- Helmet: Security headers
- CORS: Cross-origin support

## Error Handling

- Validation errors return 400 status
- Authentication failures return 401 status
- Server errors return 500 status
- All errors include descriptive messages

## Notes

- Passwords are hashed using Argon2 for maximum security
- JWT tokens are short-lived (typically 15-30 minutes)
- Refresh tokens are long-lived (typically 7 days) and stored in the database
- All endpoints include comprehensive error logging
- MongoDB and Redis must be running for the service to work
