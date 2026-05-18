# API Gateway

A simple gateway service for the social media app that forwards auth requests to the identity service and applies shared security rules.

## What it does

- Receives authentication traffic at `POST /api/v1/auth/register`
- Applies global rate limiting for incoming requests
- Proxies requests to the identity service at `IDENTITY_SERVICE_URL`
- Logs requests and proxy responses
- Uses Helmet and CORS for basic security

## Run

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file with:
   ```env
   PORT=9090
   IDENTITY_SERVICE_URL=http://localhost:8080
   REDIS_URL=redis://localhost:6379
   ```
3. Start the gateway:
   ```bash
   npm run dev
   ```

## Notes

- The gateway forwards auth registration requests to the identity service.
- It is meant to sit in front of the identity microservice and add shared middleware.
