# Link Up Social Platform

A scalable, headless social media platform built with Node.js and Azure services, designed for content creators and digital communities.

## System Overview

Link Up is a flexible backend system that provides a robust foundation for social media applications. It offers a comprehensive API that can be integrated with any front-end interface.

### Core Features

- **User Management**
  - Secure authentication
  - Profile privacy controls
  - User profile management

- **Content Management**
  - Create, read, update, and delete posts
  - Media upload support (images, videos)
  - Content search capabilities

- **Media Handling**
  - Secure file uploads
  - Azure Blob Storage integration
  - Media optimization

### Architecture

The system is built using the following Azure services:

- **Azure App Service**: Hosts the Node.js application
- **Azure Cosmos DB**: Main database for user and post data
- **Azure Blob Storage**: Media file storage
- **Azure Cognitive Search**: Content search functionality
- **Azure Communication Services**: User communication features

## API Documentation

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

Response:
```json
{
  "token": "string"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "string",
  "password": "string"
}
```

Response:
```json
{
  "token": "string"
}
```

### Posts Endpoints

#### Create Post
```http
POST /posts
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "content": "string",
  "media": "file"
}
```

Response:
```json
{
  "id": "string",
  "userId": "string",
  "content": "string",
  "mediaUrl": "string",
  "createdAt": "string"
}
```

#### Get User Posts
```http
GET /posts/{userId}
Authorization: Bearer {token}
```

Response:
```json
[
  {
    "id": "string",
    "userId": "string",
    "content": "string",
    "mediaUrl": "string",
    "createdAt": "string"
  }
]
```

### User Endpoints

#### Get User
```http
GET /users/{userId}
Authorization: Bearer {token}
```

Response:
```json
{
  "id": "string",
  "username": "string",
  "email": "string",
  "isPrivate": "boolean",
  "createdAt": "string",
  "_rid": "string",
  "_self": "string",
  "_etag": "string",
  "_attachments": "string",
  "_ts": "integer"
}
```

#### Get User Profile
```http
GET /users/{userId}/profile
Authorization: Bearer {token}
```

Response:
```json
{
    "id": "string",
    "username": "string",
    "isPrivate": "boolean",
}
```

### Search Endpoints

#### Search Posts
```http
GET /search?q={query}
Authorization: Bearer {token}
```

Response:
```json
[
  {
    "id": "string",
    "userId": "string",
    "content": "string",
    "mediaUrl": "string",
    "createdAt": "string"
  }
]
```

## Security

- JWT-based authentication
- Secure file upload handling
- Azure Key Vault integration for secrets
- CORS protection
- Rate limiting

## Error Handling

All API endpoints return standard HTTP status codes:

- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

Error responses follow this format:
```json
{
  "error": "Error message description"
}
```

## Data Models

### User
```json
{
  "id": "string",
  "username": "string",
  "email": "string",
  "isPrivate": "boolean",
  "createdAt": "string"
}
```

### Post
```json
{
  "id": "string",
  "userId": "string",
  "content": "string",
  "mediaUrl": "string",
  "createdAt": "string"
}
```