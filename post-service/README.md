# Post Service

A microservice for managing posts in the social media app with Redis caching for improved performance.

## What it does

- Creates new posts with user attribution
- Retrieves all posts with pagination support
- Retrieves individual posts by ID
- Updates existing posts
- Deletes posts
- Caches post data in Redis for better performance
- Automatically invalidates cache when posts change

## Key Features

### Redis Caching Strategy

- **List Cache:** Posts list is cached with pagination (key: `posts:${page}:${limit}`)
  - TTL: 180 seconds (3 minutes)
  - Automatically invalidated when new posts are created or existing posts are updated/deleted

- **Detail Cache:** Individual posts are cached (key: `posts:${postId}`)
  - TTL: 180 seconds (3 minutes)
  - Invalidated when that specific post is updated or deleted

### API Endpoints

All endpoints require authentication via JWT token in `Authorization: Bearer <token>` header.

#### Create Post

```http
POST /api/v1/post/create
Content-Type: application/json

{
  "content": "Post content here",
  "mediaIds": []
}
```

#### Get All Posts

```http
GET /api/v1/post/all?page=1&limit=10
```

Query Parameters:

- `page`: Page number (default: 1)
- `limit`: Posts per page (default: 10)

#### Get Post by ID

```http
GET /api/v1/post/:id
```

#### Update Post

```http
PUT /api/v1/post/:id
Content-Type: application/json

{
  "content": "Updated content"
}
```

#### Delete Post

```http
DELETE /api/v1/post/:id
```

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file with:

   ```env
   PORT=7071
   MONGO_URI=mongodb://localhost:27017/social-media
   REDIS_URL=redis://localhost:6379
   JWT_ACCESS_SECRET=your_jwt_secret
   ```

3. Start the service:
   ```bash
   npm run dev
   ```

## Database

- **MongoDB:** Stores post documents
- **Redis:** Caches post lists and individual posts

## Cache Invalidation Strategy

- **createPost:** Invalidates all list caches (`posts:*`)
- **updatePost:** Invalidates detail cache (`posts:${postId}`) and all list caches
- **deletePost:** Invalidates detail cache (`posts:${postId}`) and all list caches

## Performance Notes

- First request for a post list/detail is fetched from MongoDB and cached
- Subsequent requests within 180 seconds are served from Redis cache
- After 180 seconds, cache expires and fresh data is fetched from database
- Any modification to posts clears relevant cache entries immediately

## Dependencies

- Express.js: Web framework
- Mongoose: MongoDB ODM
- ioredis: Redis client
- Joi: Schema validation
- Winston: Logging
- Helmet: Security headers
- CORS: Cross-origin support

## Notes

- Posts are sorted by creation date (newest first)
- Pagination is required for the `/all` endpoint
- Authentication middleware is applied to all routes
- MongoDB and Redis must be running for the service to work
