# Media Service

A microservice for handling media file uploads and storage for posts in the social media app.

**Status:** ⚠️ In Planning Phase - Implementation not yet started

## Purpose

The Media Service will handle media file uploads, storage, and retrieval for posts. It will be integrated with the post service to allow users to attach images and other media to their posts.

## Planned Features

- Media file upload functionality
- File storage management (local or cloud storage)
- Media retrieval by ID
- Media metadata storage (MIME type, file size, upload date)
- Association of media with posts via `mediaIds`
- Rate limiting on uploads
- File validation (type, size)

## Planned Architecture

### API Endpoints (To be implemented)

- `POST /api/v1/media/upload` - Upload a media file
- `GET /api/v1/media/:id` - Retrieve media by ID
- `DELETE /api/v1/media/:id` - Delete a media file

### Database Models (To be designed)

- **Media:** Store media metadata
  - `fileId`: Unique file identifier
  - `userId`: User who uploaded
  - `mimeType`: File MIME type
  - `fileSize`: File size in bytes
  - `uploadedAt`: Upload timestamp
  - `storageUrl`: URL or path to stored file

## Setup (When ready)

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file with:

   ```env
   PORT=7072
   MONGO_URI=mongodb://localhost:27017/social-media
   REDIS_URL=redis://localhost:6379
   JWT_ACCESS_SECRET=your_jwt_secret
   STORAGE_PATH=./uploads  # or cloud storage config
   ```

3. Start the service:
   ```bash
   npm run dev
   ```

## Planned Technologies

- **Express.js:** Web framework
- **Mongoose:** MongoDB ODM
- **ioredis:** Redis client (for caching and rate limiting)
- **Multer:** File upload middleware
- **Winston:** Logging
- **Helmet:** Security headers
- **CORS:** Cross-origin support

## Integration Points

- Integrated with **Post Service** - Posts can reference media via `mediaIds` array
- Integrated with **API Gateway** - Routes will be available at `/api/v1/media`
- Uses **Redis** - For caching media metadata and rate limiting

## Next Steps

1. Design media metadata schema
2. Choose storage solution (local filesystem, AWS S3, etc.)
3. Implement file upload endpoint with validation
4. Implement file retrieval endpoint
5. Add caching strategy for media metadata
6. Implement delete functionality with cleanup

## Notes

- This service is currently in the planning phase
- No implementation has been started yet
- Will follow the same patterns as other microservices (error handling, logging, caching)
- Storage solution (local/cloud) needs to be decided before implementation
