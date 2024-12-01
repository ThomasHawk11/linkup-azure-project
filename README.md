# Link Up - Headless Social Media Platform

A scalable, efficient backend system for content creators built with Node.js and Azure services. This platform provides a flexible social media backend that can be integrated with any front-end interface.

## System Architecture

### Azure Services Used
- **Azure Cosmos DB**: Main database for users and posts
- **Azure Blob Storage**: Media file storage
- **Azure Cognitive Search**: Content search functionality
- **Azure Service Bus**: Notification system
- **Azure Communication Services**: User communication features
- **Azure App Service**: Application hosting

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
  "media": "file" (optional)
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

## Deployment Guide

### Prerequisites
- Azure CLI installed
- Node.js 18 or higher
- Azure subscription

### Environment Variables
Create a `.env` file with the following variables:
```
COSMOS_ENDPOINT=your_cosmos_db_endpoint
COSMOS_KEY=your_cosmos_db_key
STORAGE_CONNECTION_STRING=your_storage_connection_string
SEARCH_ENDPOINT=your_search_endpoint
SEARCH_API_KEY=your_search_api_key
JWT_SECRET=your_jwt_secret
COMMUNICATION_CONNECTION_STRING=your_communication_connection_string
```

### Deployment Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd linkup-social-platform
```

2. **Install dependencies**
```bash
npm install
```

5. **Run the application locally**
```bash
npm start
```


## Development Setup

1. **Install dependencies**
```bash
npm install
```

2. **Start development server**
```bash
npm run dev
```

The server will start on `http://localhost:3000`

## Testing

Run the test suite:
```bash
npm test
```

## License

This project is licensed under the MIT License - see the LICENSE file for details