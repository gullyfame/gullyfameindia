# Postman Collection & Admin Panel Backend Integration Analysis

## Executive Summary

This document provides a comprehensive analysis of how the Postman collection connects the admin panel (Next.js) with the Gully Fame backend (Express.js). The integration follows a **client-server architecture** with centralized API endpoints, bearer token authentication, and file upload capabilities via form-data.

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     ADMIN PANEL (Next.js)                       │
│              /apps/gully-fame-admin                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              UI Components (React)                       │   │
│  │  - Dashboard, Categories, Banners, Users, Reports, etc  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              ↓                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │         API Service Layer (/lib/*.ts)                    │   │
│  │  - authApi.ts, categoryApi.ts, bannerApi.ts, etc         │   │
│  │  - Uses: Fetch API, FormData, Bearer Tokens             │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              ↓                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │    Environment Configuration                             │   │
│  │    BASE_URL: http://103.194.228.68:3552/v1/api/          │   │
│  │    AUTH_TOKEN: Stored in localStorage                   │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↕ (HTTP/REST)
         ┌─────────────────────────────────────────┐
         │    NETWORK (CORS Enabled)               │
         │    http://103.194.228.68:3552           │
         └─────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                 BACKEND (Express.js)                            │
│            /gully-fame-backend                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │         API Routes/Controllers                           │   │
│  │  - /admin/login, /admin/categories, /admin/banners, etc  │   │
│  │  - Authentication: Bearer Token Verification            │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              ↓                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │         Business Logic & Middleware                      │   │
│  │  - CORS, File Upload (Multer), Auth Middleware          │   │
│  │  - File Storage: AWS S3                                 │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              ↓                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │         MongoDB Database                                 │   │
│  │  - Collections: admins, banners, categories, users, etc  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              ↓                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │         AWS S3 (File Storage)                            │   │
│  │  - Bucket: bank-ster-dev.s3.ap-south-1.amazonaws.com    │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Postman Collection Structure

### 2.1 Collection Metadata
- **File**: `Gully Fame API.postman_collection (1).json`
- **Location**: Root directory
- **Version**: Postman Collection v2.1.0
- **Environment**: Uses `{{BASE_URL}}` and `{{ADMIN_TOKEN}}` variables

### 2.2 API Collection Organization

The Postman collection is organized into **3 main sections**:

#### A. **Admin APIs** (Require ADMIN_TOKEN)
Primary endpoints for admin panel operations:

```
Admin APIs/
├── Add public/
│   └── Add logo (POST /public/logo)
├── Auth/
│   ├── Auth (POST /admin/login)
│   ├── Register (POST /admin/register)
│   └── Detail (GET /admin/getDetails)
├── Banners/
│   ├── Add (POST /admin/banners)
│   ├── Get all (GET /admin/banners)
│   ├── Detail (GET /admin/banners/:id)
│   ├── Update (PUT /admin/banners/:id)
│   └── Delete (DELETE /admin/banners/:id)
├── Categories/
│   ├── Add (POST /admin/categories)
│   ├── List (GET /admin/categories)
│   └── Delete (DELETE /admin/categories/:id)
├── CMS/
│   ├── Terms and conditions
│   ├── Privacy policy
│   └── Other content
├── Competitions/
│   ├── Create, Update, Delete
│   ├── Participants management
│   └── Leaderboard
├── Sponsors/
│   ├── Sponsor management
│   └── Campaign tracking
├── Reports/
│   ├── Revenue reports
│   ├── User engagement
│   └── Performance metrics
├── Users/
│   ├── User listing with search
│   ├── KYC status
│   └── User details
└── Dashboard/
    ├── Statistics
    ├── Revenue data
    └── User metrics
```

#### B. **User APIs** (Require USER_TOKEN)
Mobile app endpoints:
- Authentication (login, register, social login)
- Profile management
- Video interactions (like, follow, etc.)
- Competition participation
- Wallet/earnings

#### C. **Public APIs** (No Authentication Required)
- Logo/splash screen fetch
- Category list (public)
- Banner list (public)
- Terms and conditions
- Privacy policy

---

## 3. Admin Panel API Integration

### 3.1 Authentication Flow

```
┌──────────────────┐
│  Admin Login     │
│  (Email/Pass)    │
└────────┬─────────┘
         │
         ↓
┌─────────────────────────────────────┐
│ loginAdmin(email, password, role)   │
│ - File: authApi.ts                  │
└────────┬────────────────────────────┘
         │
         ↓
┌──────────────────────────────────────────────┐
│ POST /admin/login                            │
│ Base URL: http://103.194.228.68:3552/v1/api/ │
│ Body: { email, password, role: "ADMIN" }     │
└────────┬─────────────────────────────────────┘
         │
         ↓ (Backend verifies credentials)
┌──────────────────────────────────────────┐
│ Response: { token, admin: {...} }        │
└────────┬─────────────────────────────────┘
         │
         ↓
┌──────────────────────────────────────────────┐
│ Store in localStorage:                       │
│ - gf_admin_token (JWT)                      │
│ - gf_admin_data (Admin object)              │
│ - isLoggedIn = true                          │
│ - userRole = "ADMIN"                         │
└────────┬─────────────────────────────────────┘
         │
         ↓
┌──────────────────────────────────────────────┐
│ All Subsequent Requests Include:             │
│ Authorization: Bearer <token>                │
└──────────────────────────────────────────────┘
```

**Code Implementation** (`authApi.ts`):

```typescript
export async function loginAdmin(
  email: string,
  password: string,
  role: 'ADMIN' | 'SPONSOR' = 'ADMIN'
): Promise<ApiResponse<{ token?: string; admin?: AdminUser }>> {
  const endpoint = `${BASE_URL}admin/login`;
  
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ email, password, role }),
  });

  const data = await response.json();
  
  if (data.data?.token) {
    setToken(data.data.token, role);
    setAdminData(data.data.admin);
  }
  
  return { success: response.ok, ...data };
}
```

### 3.2 Authorization Headers

All authenticated requests use **Bearer Token** authentication:

```typescript
export function getAuthHeaders(): Record<string, string> {
  const token = getToken();
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}
```

### 3.3 API Service Layer Files

Located in `/apps/gully-fame-admin/lib/`:

| File | Purpose | Key Methods |
|------|---------|-------------|
| `authApi.ts` | Admin authentication & session | `loginAdmin()`, `getToken()`, `logout()`, `getAdminDetails()` |
| `categoryApi.ts` | Category CRUD | `createCategory()`, `getCategories()`, `deleteCategory()` |
| `bannerApi.ts` | Banner management | `createBanner()`, `getBanners()`, `updateBanner()`, `deleteBanner()` |
| `competitionApi.ts` | Competitions & leaderboard | `createCompetition()`, `getParticipants()`, `getLeaderboard()` |
| `userApi.ts` | User management & KYC | `getUsers()`, `getUserDetails()`, `updateKYCStatus()` |
| `earningsApi.ts` | Earnings tracking | `getEarnings()`, `getEarningHistory()` |
| `dashboardApi.ts` | Dashboard statistics | `getDashboardStats()`, `getRevenueData()` |
| `reportsApi.ts` | Report generation | `generateReport()`, `getReports()` |
| `sponsorApi.ts` | Sponsor management | `createSponsor()`, `getSponsor()` |
| `brandingApi.ts` | Logo/splash uploads | `uploadLogo()`, `uploadSplash()` |
| `cmsApi.ts` | CMS content | `updateTerms()`, `updatePrivacy()` |
| `adminApi.ts` | General admin ops | `getDetails()`, `updateProfile()` |

---

## 4. Base URL Configuration

### 4.1 Environment Variables

```env
# Development
NEXT_PUBLIC_API_BASE_URL=http://103.194.228.68:3552/v1/api/

# Production (from .env.example)
API_BASE_URL=https://gullyfame.com/v1/api/
```

### 4.2 Next.js Configuration (next.config.js)

```javascript
async rewrites() {
  return [
    {
      source: '/v1/api/:path*',
      destination: 'http://103.194.228.68:3552/v1/api/:path*',
    },
  ];
}
```

This allows requests to both:
- Direct backend calls: `http://103.194.228.68:3552/v1/api/...`
- Via Next.js proxy: `/v1/api/...`

---

## 5. Postman Collection Authentication Setup

### 5.1 Environment Variables in Postman

Create or import a Postman environment with these variables:

```json
{
  "name": "Gully Fame Dev",
  "values": [
    {
      "key": "BASE_URL",
      "value": "http://103.194.228.68:3552/v1/api/",
      "enabled": true
    },
    {
      "key": "ADMIN_TOKEN",
      "value": "{{Populate after login}}",
      "enabled": true
    },
    {
      "key": "USER_TOKEN",
      "value": "{{Populate after user login}}",
      "enabled": true
    }
  ]
}
```

### 5.2 Login Flow in Postman

1. **Go to Auth → Auth request**
2. **Send** the login request with credentials:
   ```json
   {
     "email": "admin@gullyfame.com",
     "password": "admin123",
     "role": "ADMIN"
   }
   ```
3. **Copy the token** from response
4. **Set Postman variable**:
   - Open "Manage Environments"
   - Paste token into `ADMIN_TOKEN`
   - Save

### 5.3 Token Usage in Postman

Each authenticated request uses:
```
Authorization: Bearer {{ADMIN_TOKEN}}
```

---

## 6. Request/Response Examples

### 6.1 Login Request/Response

**Postman Collection Request:**
```
POST {{BASE_URL}}admin/login
Content-Type: application/json

{
  "email": "admin@gullyfame.com",
  "password": "admin123",
  "role": "ADMIN"
}
```

**Response (200 OK):**
```json
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
    "token": "<jwt_token_here>"
  }
}
```

**Admin Panel Implementation:**
```typescript
// UI: Login component sends credentials
const result = await loginAdmin(email, password, 'ADMIN');

if (result.success) {
  // Token automatically stored in localStorage
  // Redirect to dashboard
  router.push('/dashboard');
}
```

### 6.2 Banner Creation (File Upload)

**Postman Collection Request:**
```
POST {{BASE_URL}}admin/banners
Authorization: Bearer {{ADMIN_TOKEN}}
Content-Type: multipart/form-data

Form Data:
- title: "test"
- banner: [file]
```

**Response (200 OK):**
```json
{
  "code": 1,
  "message": "success",
  "data": {
    "_id": "6956a5393461e9dd726aa7a2",
    "title": "test",
    "banner": "https://bank-ster-dev.s3.ap-south-1.amazonaws.com/1767286069603_banner.png",
    "isActive": true,
    "createdAt": "2026-01-01T16:47:53.258Z",
    "updatedAt": "2026-01-01T16:47:53.258Z"
  }
}
```

**Admin Panel Implementation** (`bannerApi.ts`):
```typescript
export async function createBanner(
  title: string,
  bannerFile: File
): Promise<ApiResponse<Banner>> {
  const formData = new FormData();
  formData.append('title', title);
  formData.append('banner', bannerFile);

  const httpResponse = await fetch(
    `${BASE_URL}admin/banners`,
    {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData,
    }
  );

  const responseData = await httpResponse.json();
  return {
    success: httpResponse.ok,
    data: responseData.data,
  };
}
```

### 6.3 Category Listing

**Postman Collection Request:**
```
GET {{BASE_URL}}admin/categories?page=1&limit=10
Authorization: Bearer {{ADMIN_TOKEN}}
```

**Response (200 OK):**
```json
{
  "code": 1,
  "message": "success",
  "data": [
    {
      "_id": "6956a8b133a17dd2e79acfcf",
      "name": "test",
      "icon": "https://bucket.s3.amazonaws.com/icon.png",
      "isActive": true,
      "createdAt": "2026-01-01T17:02:41.568Z",
      "updatedAt": "2026-01-01T17:02:41.568Z"
    }
  ]
}
```

---

## 7. Error Handling

### 7.1 Response Codes

| Code | Meaning | Example |
|------|---------|---------|
| 1 | Success | All successful operations return `code: 1` |
| 0 | Error | Generic error response |
| 401 | Unauthorized | Invalid/expired token |
| 403 | Forbidden | Insufficient permissions |
| 400 | Bad Request | Invalid input data |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Backend error |

### 7.2 Error Response Format

```json
{
  "code": 0,
  "message": "Invalid credentials",
  "error": "INVALID_CREDENTIALS"
}
```

### 7.3 Admin Panel Error Handling

```typescript
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
}

// Usage in components
const response = await createBanner(title, file);

if (!response.success) {
  console.error('Banner creation failed:', response.message);
  // Show error toast
} else {
  // Show success toast and refresh list
}
```

---

## 8. Security Considerations

### 8.1 Token Storage

**Current Implementation:**
- Tokens stored in `localStorage`
- Key: `gf_admin_token`
- Available to JavaScript (XSS vulnerable)

**Recommendation:**
```typescript
// Use HttpOnly cookies instead (requires backend support)
// Document in backend: Set-Cookie: token=<jwt>; HttpOnly; Secure; SameSite=Strict
```

### 8.2 CORS Configuration

**Backend CORS Setup** (Express):
```javascript
const cors = require('cors');
app.use(cors());  // Currently allows all origins
```

**Recommendation:**
```javascript
app.use(cors({
  origin: ['http://localhost:3000', 'https://admin.gullyfame.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
```

### 8.3 Input Validation

**Current Admin Panel Validation** (`categoryApi.ts`):
```typescript
if (!name?.trim()) {
  return {
    success: false,
    message: 'Category name is required',
    error: 'MISSING_NAME',
  };
}
```

**Recommendation:**
- Use form libraries (Zod, Yup) for client-side validation
- Always validate on backend
- Sanitize file uploads

---

## 9. API Endpoint Reference

### 9.1 Authentication Endpoints

```
POST   /admin/login          - Admin login
POST   /admin/register       - Admin registration
GET    /admin/getDetails     - Get current admin details
POST   /admin/logout         - Logout (client-side)
```

### 9.2 Content Management

```
POST   /admin/banners        - Create banner
GET    /admin/banners        - List banners
GET    /admin/banners/:id    - Get banner details
PUT    /admin/banners/:id    - Update banner
DELETE /admin/banners/:id    - Delete banner

POST   /admin/categories     - Create category
GET    /admin/categories     - List categories
DELETE /admin/categories/:id - Delete category
```

### 9.3 User Management

```
GET    /admin/users          - List users with search
GET    /admin/users/:id      - Get user details
PUT    /admin/users/:id/kyc  - Update KYC status
```

### 9.4 Competition Management

```
POST   /admin/competitions   - Create competition
GET    /admin/competitions   - List competitions
PUT    /admin/competitions/:id - Update competition
GET    /admin/competitions/:id/participants - Get participants
GET    /admin/competitions/:id/leaderboard  - Get leaderboard
```

### 9.5 Reports & Analytics

```
GET    /admin/dashboard      - Dashboard statistics
GET    /admin/reports        - List reports
POST   /admin/reports/generate - Generate new report
```

### 9.6 File Uploads

```
POST   /public/logo          - Upload logo and splash
POST   /admin/banners        - Upload banner image
POST   /admin/categories     - Upload category icon
```

### 9.7 CMS Endpoints

```
POST   /admin/cms/terms      - Update terms & conditions
GET    /admin/cms/terms      - Get terms & conditions
POST   /admin/cms/privacy    - Update privacy policy
GET    /admin/cms/privacy    - Get privacy policy
```

---

## 10. Testing with Postman

### 10.1 Pre-request Script (Token Refresh)

Add to Postman collection pre-request:
```javascript
// Auto-populate token from environment
if (!pm.environment.get('ADMIN_TOKEN')) {
  console.log('⚠️ ADMIN_TOKEN not set. Please login first.');
}
```

### 10.2 Tests (Validate Responses)

Add to requests:
```javascript
// Test: Verify response code
pm.test("Response code is success", function () {
  pm.expect(pm.response.json().code).to.equal(1);
});

// Test: Verify required fields
pm.test("Response has token", function () {
  pm.expect(pm.response.json().data.token).to.be.a('string');
});

// Save token for subsequent requests
var jsonData = pm.response.json();
pm.environment.set("ADMIN_TOKEN", jsonData.data.token);
```

### 10.3 Collection Runner

1. **File → Export Collection**
2. **Runner → Import collection**
3. **Select environment** (with BASE_URL)
4. **Run requests in order** (login first, then others)

---

## 11. Debugging & Troubleshooting

### 11.1 Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| 401 Unauthorized | Invalid/expired token | Login again, update `ADMIN_TOKEN` |
| 403 Forbidden | Insufficient permissions | Use admin account, check role |
| 400 Bad Request | Missing/invalid data | Verify Postman form fields match docs |
| CORS error | Backend CORS not configured | Add frontend domain to CORS whitelist |
| File upload fails | File too large or wrong format | Check file size limits, use supported formats |
| 500 Server Error | Backend crashed or error | Check backend logs, restart server |

### 11.2 Admin Panel Logging

All API calls are logged in browser console:

```typescript
console.log('[Categories API] POST Create Category - Endpoint:', endpoint);
console.log('[Categories API] POST Create Category - Status:', httpResponse.status);
console.log('[Categories API] POST Create Category - Response:', responseData);
```

### 11.3 Network Inspection

Use Chrome DevTools → Network tab to:
1. Inspect request headers (Authorization)
2. View request body (FormData)
3. Verify response status/body
4. Check response times

---

## 12. Deployment Considerations

### 12.1 Environment Configuration

**Development:**
```env
NEXT_PUBLIC_API_BASE_URL=http://103.194.228.68:3552/v1/api/
NODE_ENV=development
```

**Production:**
```env
NEXT_PUBLIC_API_BASE_URL=https://gullyfame.com/v1/api/
NODE_ENV=production
```

### 12.2 Backend Deployment

1. **Ensure CORS is configured** for admin domain
2. **Set JWT_SECRET** in environment
3. **Configure AWS S3** bucket for file uploads
4. **MongoDB connection** string set
5. **SSL/TLS** certificates installed

### 12.3 Admin Panel Deployment

1. **Build**: `npm run build`
2. **Set environment variables** for production
3. **Deploy to Vercel/hosting service**
4. **Verify API connectivity** after deployment

---

## 13. Integration Flow Diagram

```
ADMIN PANEL WORKFLOW:

┌─────────────────────────┐
│   Admin Opens App       │
│   /login page           │
└────────────┬────────────┘
             │
             ↓
┌─────────────────────────────────────────┐
│  loginAdmin(email, password)            │
│  authApi.ts                             │
│  POST /admin/login                      │
└────────────┬────────────────────────────┘
             │
             ├─ Success: Save token → localStorage
             │
             ↓
┌─────────────────────────┐
│   Redirect to /admin    │
│   Dashboard             │
└────────────┬────────────┘
             │
             ↓
┌───────────────────────────────────────────────┐
│  Load Dashboard Data                          │
│  - getDashboardStats()  → GET /admin/dashboard │
│  - getCategories()      → GET /admin/categories│
│  - getBanners()         → GET /admin/banners  │
└────────────┬────────────────────────────────┘
             │
             ↓
┌──────────────────────────────────────────┐
│  Each request includes:                  │
│  Authorization: Bearer <token>           │
│  Content-Type: application/json          │
└──────────────────────────────────────────┘
             │
             ├─ All requests validated by backend
             │
             ↓
┌────────────────────────────────────────┐
│  Display Data in UI Components         │
│  - Tables, Charts, Forms               │
└────────────┬────────────────────────────┘
             │
             ↓
┌────────────────────────────────────────┐
│  User Actions (Create/Update/Delete)   │
│  - createBanner(title, file)           │
│  - POST /admin/banners                 │
│  - PUT /admin/banners/:id              │
│  - DELETE /admin/banners/:id           │
└────────────┬────────────────────────────┘
             │
             ↓
┌────────────────────────────────────────┐
│  File Uploaded to AWS S3               │
│  URL returned in response              │
│  - bank-ster-dev.s3...                 │
└────────────┬────────────────────────────┘
             │
             ↓
┌────────────────────────────────────────┐
│  Data Stored in MongoDB                │
│  Response: { code: 1, data: {...} }    │
└────────────┬────────────────────────────┘
             │
             ↓
┌────────────────────────────────────────┐
│  UI Updated (Toast notification)       │
│  - Success message displayed           │
│  - List refreshed                      │
└────────────────────────────────────────┘
```

---

## 14. Quick Reference

### 14.1 Most Used Endpoints

```
1. Admin Login
   POST /admin/login
   
2. Get Admin Details
   GET /admin/getDetails
   
3. Create Banner
   POST /admin/banners
   
4. List Categories
   GET /admin/categories
   
5. Create Category
   POST /admin/categories
   
6. Get Users
   GET /admin/users
   
7. Get Dashboard Stats
   GET /admin/dashboard
```

### 14.2 Token Format

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 14.3 Response Format

```json
{
  "code": 1,                    // 1 = success, 0 = error
  "message": "success",          // Human readable message
  "data": { ... },              // Response payload
  "error": "ERROR_CODE"         // Optional error code
}
```

---

## 15. Summary Table

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Admin Panel | Next.js 14 | UI for admin operations |
| API Client | Fetch API | HTTP requests |
| Authentication | Bearer Token (JWT) | Secure API access |
| Token Storage | localStorage | Client-side session |
| Backend | Express.js | REST API server |
| Database | MongoDB | Data persistence |
| File Storage | AWS S3 | Image/file uploads |
| Configuration | Environment variables | Dynamic settings |

---

## 16. Additional Resources

- **Postman Collection File**: `Gully Fame API.postman_collection (1).json`
- **Admin Panel Code**: `/apps/gully-fame-admin/lib/*.ts`
- **Backend Code**: `/gully-fame-backend/`
- **Environment Config**: `/apps/gully-fame-admin/.env.example`

---

## Notes

1. **Current Backend URL**: `http://103.194.228.68:3552`
2. **API Prefix**: `/v1/api/`
3. **Authentication**: All admin endpoints require Bearer token (except login)
4. **File Uploads**: Use multipart/form-data, stored on AWS S3
5. **CORS**: Currently allows all origins (should restrict in production)
6. **Roles**: ADMIN, SPONSOR, USER supported

