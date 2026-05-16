# Social Media App

A microservices-based social media application.

## Microservices

### Identity Service

Handles user authentication and registration.

- **Location:** `identity-service/`
- **Port:** 8080 (default)
- **Key Features:** User registration, JWT tokens, refresh tokens, rate limiting

See [identity-service/README.md](identity-service/README.md) for details.

## Getting Started

Each microservice is independent. Navigate to its directory and follow the service-specific README.

```bash
cd identity-service
npm install
npm run dev
```

## Project Structure

```
social-media-app/
├── identity-service/        # Auth microservice
├── README.md               # This file
└── ...                     # More services to be added
```

## Notes

- More microservices and features will be added over time.
- Each service has its own dependencies and environment configuration.
