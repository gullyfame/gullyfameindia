# API Endpoints Reference Guide

## Complete Admin API Endpoints from Postman Collection

### Base URL
```
http://103.194.228.68:3552/v1/api/
```

---

## Authentication Endpoints

### 1. Admin Login
```
POST /admin/login
Content-Type: application/json

Request Body:
{
  "email": "admin@gullyfame.com",
  "password": "admin123",
  "role": "ADMIN"
}

Response:
{
  "code": 1,
  "message": "success",
  "data": {
    "admin": {
      "_id": "6956a295f61b3a1bdb8faf51",
      "email": "admin@gullyfame.com",
      "role": "ADMIN",
      "isActive": true,
      "createdAt": "2026-01-01T16:36:37.271Z",
      "updatedAt": "2026-01-01T16:37:47.535Z"
    },
    "token": "<JWT_TOKEN>"
  }
}
```

### 2. Admin Registration
```
POST /admin/register
Content-Type: application/json

Request Body:
{
  "email": "admin@gullyfame.com",
  "password": "admin123"
}

Response:
{
  "code": 1,
  "message": "success",
  "data": { ... }
}
```

### 3. Get Admin Details
```
GET /admin/getDetails
Authorization: Bearer {{ADMIN_TOKEN}}

Response:
{
  "code": 1,
  "data": {
    "admin": {
      "_id": "6956a295f61b3a1bdb8faf51",
      "email": "admin@gullyfame.com",
      "role": "ADMIN",
      "isActive": true,
      "createdAt": "2026-01-01T16:36:37.271Z",
      "updatedAt": "2026-01-01T16:39:45.079Z"
    }
  }
}
```

---

## Banner Management Endpoints

### 1. Create Banner
```
POST /admin/banners
Authorization: Bearer {{ADMIN_TOKEN}}
Content-Type: multipart/form-data

Form Data:
- title (text): "Banner Title"
- banner (file): <image_file>

Response:
{
  "code": 1,
  "message": "success",
  "data": {
    "_id": "6956a5393461e9dd726aa7a2",
    "title": "Banner Title",
    "banner": "https://bank-ster-dev.s3.ap-south-1.amazonaws.com/banner.png",
    "isActive": true,
    "createdAt": "2026-01-01T16:47:53.258Z",
    "updatedAt": "2026-01-01T16:47:53.258Z"
  }
}
```

### 2. Get All Banners
```
GET /admin/banners?page=1&limit=10
Authorization: Bearer {{ADMIN_TOKEN}}

Query Parameters:
- page (optional): Page number (default: 1)
- limit (optional): Items per page (default: 10)

Response:
{
  "code": 1,
  "message": "success",
  "data": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "banners": [
      {
        "_id": "6956a5393461e9dd726aa7a2",
        "title": "Banner Title",
        "banner": "https://bucket.s3.amazonaws.com/banner.png",
        "isActive": true,
        "createdAt": "2026-01-01T16:47:53.258Z",
        "updatedAt": "2026-01-01T16:47:53.258Z"
      }
    ]
  }
}
```

### 3. Get Banner Details
```
GET /admin/banners/{id}
Authorization: Bearer {{ADMIN_TOKEN}}

Path Parameters:
- id: Banner ID

Response:
{
  "code": 1,
  "message": "success",
  "data": {
    "_id": "6956a5393461e9dd726aa7a2",
    "title": "Banner Title",
    "banner": "https://bucket.s3.amazonaws.com/banner.png",
    "isActive": true,
    "createdAt": "2026-01-01T16:47:53.258Z",
    "updatedAt": "2026-01-01T16:47:53.258Z"
  }
}
```

### 4. Update Banner
```
PUT /admin/banners/{id}
Authorization: Bearer {{ADMIN_TOKEN}}
Content-Type: multipart/form-data

Form Data:
- title (text): "Updated Title" (optional)
- banner (file): <image_file> (optional)

Response:
{
  "code": 1,
  "message": "success",
  "data": { ... updated banner ... }
}
```

### 5. Delete Banner
```
DELETE /admin/banners/{id}
Authorization: Bearer {{ADMIN_TOKEN}}

Response:
{
  "code": 1,
  "message": "success",
  "data": {}
}
```

---

## Category Management Endpoints

### 1. Create Category
```
POST /admin/categories
Authorization: Bearer {{ADMIN_TOKEN}}
Content-Type: multipart/form-data

Form Data:
- name (text): "Category Name"
- icon (file): <icon_file>

Response:
{
  "code": 1,
  "data": {
    "_id": "6956a8b133a17dd2e79acfcf",
    "name": "Category Name",
    "icon": "https://bucket.s3.amazonaws.com/icon.png",
    "isActive": true,
    "createdAt": "2026-01-01T17:02:41.568Z",
    "updatedAt": "2026-01-01T17:02:41.568Z"
  }
}
```

### 2. List Categories
```
GET /admin/categories?page=1&limit=10
Authorization: Bearer {{ADMIN_TOKEN}}

Query Parameters:
- page (optional): Page number
- limit (optional): Items per page

Response:
{
  "code": 1,
  "message": "success",
  "data": [
    {
      "_id": "6956a8b133a17dd2e79acfcf",
      "name": "Category Name",
      "icon": "https://bucket.s3.amazonaws.com/icon.png",
      "isActive": true,
      "createdAt": "2026-01-01T17:02:41.568Z",
      "updatedAt": "2026-01-01T17:02:41.568Z"
    }
  ]
}
```

### 3. Delete Category
```
DELETE /admin/categories/{id}
Authorization: Bearer {{ADMIN_TOKEN}}

Response:
{
  "code": 1,
  "data": {}
}
```

---

## Public Branding Endpoints

### 1. Upload Logo & Splash
```
POST /public/logo
Content-Type: multipart/form-data

Form Data:
- logo (file): <logo_file> (optional)
- splash (file): <splash_file> (optional)

Response:
{
  "code": 1,
  "message": "success",
  "data": {
    "logo": "https://bucket.s3.amazonaws.com/logo.png",
    "splash": "https://bucket.s3.amazonaws.com/splash.png"
  }
}
```

---

## CMS Content Management

### 1. Update Terms & Conditions
```
POST /admin/cms/terms
Authorization: Bearer {{ADMIN_TOKEN}}
Content-Type: application/json

Request Body:
{
  "content": "<h1>Terms & Conditions</h1><p>...</p>"
}

Response:
{
  "code": 1,
  "data": { ... updated content ... }
}
```

### 2. Get Terms & Conditions
```
GET /admin/cms/terms

Response:
{
  "code": 1,
  "data": {
    "_id": "...",
    "type": "terms",
    "content": "<h1>Terms & Conditions</h1>...",
    "updatedAt": "2026-01-01T17:02:41.568Z"
  }
}
```

### 3. Update Privacy Policy
```
POST /admin/cms/privacy
Authorization: Bearer {{ADMIN_TOKEN}}
Content-Type: application/json

Request Body:
{
  "content": "<h1>Privacy Policy</h1><p>...</p>"
}
```

### 4. Get Privacy Policy
```
GET /admin/cms/privacy
```

---

## User Management Endpoints

### 1. List Users
```
GET /admin/users?page=1&limit=10&search=john
Authorization: Bearer {{ADMIN_TOKEN}}

Query Parameters:
- page (optional): Page number
- limit (optional): Items per page
- search (optional): Search by name/email

Response:
{
  "code": 1,
  "data": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "users": [
      {
        "_id": "...",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "9876543210",
        "kycStatus": "verified",
        "isActive": true,
        "createdAt": "2026-01-01T..."
      }
    ]
  }
}
```

### 2. Get User Details
```
GET /admin/users/{id}
Authorization: Bearer {{ADMIN_TOKEN}}

Response:
{
  "code": 1,
  "data": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "kycStatus": "verified",
    "kycData": { ... },
    "wallet": { ... },
    "createdAt": "2026-01-01T..."
  }
}
```

### 3. Update KYC Status
```
PUT /admin/users/{id}/kyc
Authorization: Bearer {{ADMIN_TOKEN}}
Content-Type: application/json

Request Body:
{
  "status": "verified"
}

Response:
{
  "code": 1,
  "data": { ... updated user ... }
}
```

---

## Competition Management

### 1. Create Competition
```
POST /admin/competitions
Authorization: Bearer {{ADMIN_TOKEN}}
Content-Type: application/json

Request Body:
{
  "title": "Summer Challenge",
  "description": "Compete with others",
  "category": "dance",
  "startDate": "2026-01-15",
  "endDate": "2026-02-15",
  "prizePool": 10000,
  "participantLimit": 100
}

Response:
{
  "code": 1,
  "data": { ... created competition ... }
}
```

### 2. List Competitions
```
GET /admin/competitions?page=1&limit=10
Authorization: Bearer {{ADMIN_TOKEN}}

Response:
{
  "code": 1,
  "data": {
    "page": 1,
    "total": 5,
    "competitions": [ ... ]
  }
}
```

### 3. Get Participants
```
GET /admin/competitions/{id}/participants?page=1
Authorization: Bearer {{ADMIN_TOKEN}}

Response:
{
  "code": 1,
  "data": {
    "total": 45,
    "participants": [
      {
        "_id": "...",
        "userId": "...",
        "userName": "john_doe",
        "joinedAt": "2026-01-01T...",
        "score": 850
      }
    ]
  }
}
```

### 4. Get Leaderboard
```
GET /admin/competitions/{id}/leaderboard
Authorization: Bearer {{ADMIN_TOKEN}}

Response:
{
  "code": 1,
  "data": [
    {
      "rank": 1,
      "userName": "top_user",
      "score": 1000,
      "prize": 5000
    }
  ]
}
```

---

## Dashboard & Analytics

### 1. Get Dashboard Statistics
```
GET /admin/dashboard
Authorization: Bearer {{ADMIN_TOKEN}}

Response:
{
  "code": 1,
  "data": {
    "totalUsers": 1250,
    "activeUsers": 856,
    "totalRevenue": 125000,
    "monthlyRevenue": 15000,
    "totalCompetitions": 12,
    "activeCompetitions": 3,
    "totalParticipations": 3500
  }
}
```

### 2. Get Revenue Report
```
GET /admin/reports/revenue?month=01&year=2026
Authorization: Bearer {{ADMIN_TOKEN}}

Query Parameters:
- month: Month (01-12)
- year: Year (YYYY)

Response:
{
  "code": 1,
  "data": {
    "month": "January 2026",
    "totalRevenue": 15000,
    "breakdown": {
      "competitions": 8000,
      "ads": 5000,
      "sponsorships": 2000
    }
  }
}
```

---

## Sponsor Management

### 1. Create Sponsor
```
POST /admin/sponsors
Authorization: Bearer {{ADMIN_TOKEN}}
Content-Type: multipart/form-data

Form Data:
- name: "Nike"
- logo: <file>
- website: "https://nike.com"

Response:
{
  "code": 1,
  "data": { ... created sponsor ... }
}
```

### 2. List Sponsors
```
GET /admin/sponsors
Authorization: Bearer {{ADMIN_TOKEN}}

Response:
{
  "code": 1,
  "data": [ ... sponsors ... ]
}
```

---

## Error Responses

### 401 Unauthorized
```json
{
  "code": 0,
  "message": "Unauthorized",
  "error": "INVALID_TOKEN"
}
```

### 400 Bad Request
```json
{
  "code": 0,
  "message": "Validation error",
  "error": "INVALID_INPUT"
}
```

### 404 Not Found
```json
{
  "code": 0,
  "message": "Resource not found",
  "error": "NOT_FOUND"
}
```

### 500 Server Error
```json
{
  "code": 0,
  "message": "Internal server error",
  "error": "SERVER_ERROR"
}
```

---

## Header Requirements

### All Authenticated Requests
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

### File Upload Requests
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: multipart/form-data
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Invalid/missing token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 500 | Server Error - Backend error |

