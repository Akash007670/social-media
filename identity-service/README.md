# Identity Service

A auth microservice for the social media app.

## What it does

- Registers new users via `POST /api/v1/auth/register`
- Hashes passwords with Argon2
- Generates JWT access tokens
- Stores refresh tokens in MongoDB
- Uses Helmet, CORS, and Redis-based rate limiting

## Run

1. Install dependencies:
   ```bash
   npm install
   ```
2. Add `.env` with `MONGO_URI`, `REDIS_URL`, and `JWT_ACCESS_SECRET`
3. Start:
   ```bash
   npm run dev
   ```

## Notes

- Current scope: registration and token generation.
- More auth features can be added later.
