# Admin Panel to Backend Integration Checklist

## Overview

This checklist ensures the admin panel (Next.js) is properly connected to the Gully Fame backend (Express.js) via the Postman collection APIs.

---

## Phase 1: Environment Setup ✓

### Backend Configuration

- [ ] Backend running at: `http://103.194.228.68:3552`
- [ ] API prefix configured: `/v1/api/`
- [ ] CORS enabled for admin panel domain
- [ ] MongoDB connection verified
- [ ] AWS S3 bucket configured for file uploads
- [ ] JWT_SECRET environment variable set
- [ ] Admin user created in database (`admin@gullyfame.com`)

### Admin Panel Configuration

- [ ] `NEXT_PUBLIC_API_BASE_URL` environment variable set
- [ ] `.env.local` created with correct backend URL
- [ ] Node.js version compatible (v16+)
- [ ] Dependencies installed: `npm install`
- [ ] Build successful: `npm run build`

### Postman Setup

- [ ] Postman collection imported
- [ ] Environment created with BASE_URL
- [ ] Login endpoint tested (token received)
- [ ] ADMIN_TOKEN variable populated

---

## Phase 2: Authentication Integration ✓

### Backend Endpoints

- [ ] POST `/admin/login` - Returns JWT token
- [ ] POST `/admin/register` - Admin registration works
- [ ] GET `/admin/getDetails` - Requires valid token
- [ ] Token validation middleware implemented

### Admin Panel Implementation

- [ ] `authApi.ts` created with `loginAdmin()` function
- [ ] Token stored in localStorage (`gf_admin_token`)
- [ ] `getAuthHeaders()` adds Bearer token to requests
- [ ] Logout functionality clears localStorage
- [ ] Session persistence on page reload
- [ ] Token expiration handling

### Login Page

- [ ] Email/password form created
- [ ] Form validation implemented
- [ ] Loading state during login
- [ ] Error messages displayed
- [ ] Redirect to dashboard on success
- [ ] Test credentials: `admin@gullyfame.com` / `admin123`

### Protected Routes

- [ ] Middleware checks token existence
- [ ] Redirect to login if not authenticated
- [ ] Token validation on each request
- [ ] 401 errors handled (redirect to login)

---

## Phase 3: Banner Management ✓

### Backend Endpoints

- [ ] POST `/admin/banners` - Create banner with file upload
- [ ] GET `/admin/banners` - List banners (paginated)
- [ ] GET `/admin/banners/:id` - Get single banner
- [ ] PUT `/admin/banners/:id` - Update banner
- [ ] DELETE `/admin/banners/:id` - Delete banner

### Admin Panel Implementation

- [ ] `bannerApi.ts` created with all CRUD functions
- [ ] File upload to FormData implemented
- [ ] S3 URL returned and stored
- [ ] Error handling for file size/format

### Banner Management UI

- [ ] Banner creation form
  - [ ] Title input field
  - [ ] File upload (image picker)
  - [ ] Submit button
  - [ ] Loading state

- [ ] Banner listing
  - [ ] Table/grid view
  - [ ] Pagination controls
  - [ ] Search functionality

- [ ] Banner detail view
  - [ ] Display image preview
  - [ ] Show metadata (created date, etc.)
  - [ ] Edit button

- [ ] Banner editing
  - [ ] Update title
  - [ ] Replace image
  - [ ] Save changes

- [ ] Banner deletion
  - [ ] Delete button
  - [ ] Confirmation dialog
  - [ ] Optimistic update (remove from list)

### Testing

- [ ] Postman: Create banner request works
- [ ] Postman: List banners returns data
- [ ] Admin panel: Upload image works
- [ ] Admin panel: Image displays correctly
- [ ] Admin panel: Edit updates backend
- [ ] Admin panel: Delete removes from list

---

## Phase 4: Category Management ✓

### Backend Endpoints

- [ ] POST `/admin/categories` - Create category with icon
- [ ] GET `/admin/categories` - List categories
- [ ] DELETE `/admin/categories/:id` - Delete category

### Admin Panel Implementation

- [ ] `categoryApi.ts` created
- [ ] Icon file upload working
- [ ] FormData with icon field

### Category Management UI

- [ ] Category creation form
  - [ ] Name input
  - [ ] Icon file upload
  - [ ] Submit button

- [ ] Category listing
  - [ ] Display all categories
  - [ ] Show category icons
  - [ ] Edit/Delete actions

- [ ] Category deletion
  - [ ] Confirmation prompt
  - [ ] Update list after delete

### Testing

- [ ] Postman: Create category works
- [ ] Admin panel: Add category form functional
- [ ] Admin panel: Icons upload and display
- [ ] Admin panel: Categories list shows all items
- [ ] Admin panel: Delete removes category

---

## Phase 5: User Management ✓

### Backend Endpoints

- [ ] GET `/admin/users` - List users with search
- [ ] GET `/admin/users/:id` - Get user details
- [ ] PUT `/admin/users/:id/kyc` - Update KYC status

### Admin Panel Implementation

- [ ] `userApi.ts` created
- [ ] User search/filter implemented
- [ ] KYC status update function

### User Management UI

- [ ] Users listing page
  - [ ] Table with user data
  - [ ] Search by name/email
  - [ ] Pagination
  - [ ] Sort options

- [ ] User detail view
  - [ ] User profile info
  - [ ] KYC status display
  - [ ] KYC documents view
  - [ ] Update KYC button

- [ ] KYC management
  - [ ] Status options: pending, verified, rejected
  - [ ] Reason for rejection
  - [ ] Update confirmation

### Testing

- [ ] Postman: List users works
- [ ] Postman: Get user details works
- [ ] Admin panel: Users table loads
- [ ] Admin panel: Search filters users
- [ ] Admin panel: KYC status updates

---

## Phase 6: Dashboard & Analytics ✓

### Backend Endpoints

- [ ] GET `/admin/dashboard` - Dashboard statistics
- [ ] GET `/admin/reports/revenue` - Revenue data

### Admin Panel Implementation

- [ ] `dashboardApi.ts` created
- [ ] Dashboard data fetching

### Dashboard UI

- [ ] Stats cards
  - [ ] Total users
  - [ ] Active users
  - [ ] Total revenue
  - [ ] Active competitions

- [ ] Charts
  - [ ] Revenue chart (line/bar)
  - [ ] User growth chart
  - [ ] Competition participation

- [ ] Recent activities
  - [ ] Latest competitions
  - [ ] Recent signups
  - [ ] Top performers

### Testing

- [ ] Postman: Dashboard endpoint returns data
- [ ] Admin panel: Stats load correctly
- [ ] Admin panel: Charts render data
- [ ] Admin panel: Numbers are accurate

---

## Phase 7: Competition Management ✓

### Backend Endpoints

- [ ] POST `/admin/competitions` - Create competition
- [ ] GET `/admin/competitions` - List competitions
- [ ] GET `/admin/competitions/:id/participants` - Get participants
- [ ] GET `/admin/competitions/:id/leaderboard` - Get leaderboard

### Admin Panel Implementation

- [ ] `competitionApi.ts` created
- [ ] Competition CRUD functions
- [ ] Participant fetching

### Competition Management UI

- [ ] Competitions listing
- [ ] Create competition form
- [ ] Edit competition
- [ ] View participants
- [ ] View leaderboard

### Testing

- [ ] Postman: Create competition works
- [ ] Admin panel: Competitions list displays
- [ ] Admin panel: Can view participants
- [ ] Admin panel: Leaderboard shows rankings

---

## Phase 8: CMS & Content Management ✓

### Backend Endpoints

- [ ] POST `/admin/cms/terms` - Update terms
- [ ] GET `/admin/cms/terms` - Get terms
- [ ] POST `/admin/cms/privacy` - Update privacy
- [ ] GET `/admin/cms/privacy` - Get privacy

### Admin Panel Implementation

- [ ] `cmsApi.ts` created
- [ ] Rich text editor integration (if needed)

### CMS UI

- [ ] Terms & conditions editor
- [ ] Privacy policy editor
- [ ] Save changes
- [ ] Preview content

### Testing

- [ ] Postman: Update terms works
- [ ] Admin panel: Terms editor functional
- [ ] Changes persist to backend

---

## Phase 9: File Upload & S3 Integration ✓

### Backend Configuration

- [ ] AWS S3 bucket created
- [ ] AWS credentials configured
- [ ] File upload middleware (multer) set up
- [ ] File size limits configured
- [ ] Allowed file types restricted

### Admin Panel Implementation

- [ ] File input handling
- [ ] File size validation (client-side)
- [ ] File type validation
- [ ] Progress indicator during upload

### File Upload UI

- [ ] Drag-and-drop support
- [ ] File picker fallback
- [ ] Error messages for invalid files
- [ ] Success confirmation

### Testing

- [ ] Postman: File upload works
- [ ] Admin panel: Multiple formats (PNG, JPG, SVG)
- [ ] Admin panel: File size limit enforced
- [ ] Admin panel: S3 URL returned

---

## Phase 10: Error Handling & Validation ✓

### Request Validation

- [ ] Input validation before API calls
- [ ] Required fields checked
- [ ] Format validation (email, dates, etc.)
- [ ] File type/size validation

### Response Handling

- [ ] Success responses (code: 1) processed
- [ ] Error responses (code: 0) handled
- [ ] HTTP error codes handled (401, 404, 500)
- [ ] Network errors handled

### User Feedback

- [ ] Toast notifications for success
- [ ] Alert dialogs for errors
- [ ] Loading states during requests
- [ ] Retry logic for failed requests

### Type Safety

- [ ] TypeScript interfaces for all responses
- [ ] `ApiResponse<T>` type used consistently
- [ ] No `any` types (use proper types)

### Testing

- [ ] Invalid data rejected
- [ ] 401 redirects to login
- [ ] 404 shows error message
- [ ] Network error shows retry option

---

## Phase 11: Security & Authorization ✓

### Token Management

- [ ] Token stored securely (HttpOnly cookie recommended)
- [ ] Token refresh implemented (if backend supports)
- [ ] Token expiration handled
- [ ] Logout clears token

### Access Control

- [ ] Only admins can access `/admin` routes
- [ ] Role-based permissions checked
- [ ] Public endpoints don't require auth
- [ ] Protected endpoints require token

### Data Protection

- [ ] Sensitive data not logged
- [ ] Passwords never sent in plaintext
- [ ] HTTPS enforced in production
- [ ] CORS whitelist configured

### Testing

- [ ] No token: 401 error
- [ ] Expired token: Redirect to login
- [ ] Wrong role: 403 error
- [ ] Valid token: Requests work

---

## Phase 12: Performance Optimization ✓

### Frontend Optimization

- [ ] API responses cached where appropriate
- [ ] Pagination implemented for large lists
- [ ] Lazy loading for heavy components
- [ ] Debouncing for search/filter

### Backend Optimization

- [ ] Database indexes created
- [ ] Pagination implemented
- [ ] Query optimization
- [ ] Response compression enabled

### Monitoring

- [ ] Response times logged
- [ ] Error rates tracked
- [ ] Failed requests monitored
- [ ] Performance metrics collected

### Testing

- [ ] Load time < 2 seconds (most pages)
- [ ] API response < 500ms
- [ ] List operations paginated
- [ ] No unnecessary API calls

---

## Phase 13: Testing & Verification ✓

### Unit Tests

- [ ] API functions tested
- [ ] Error handling tested
- [ ] Response parsing tested
- [ ] Auth functions tested

### Integration Tests

- [ ] Login → Dashboard flow works
- [ ] Create banner → Display in list flow works
- [ ] Edit item → Update reflected flow works
- [ ] Delete item → Remove from list flow works

### E2E Tests (Optional)

- [ ] Full admin workflow tested
- [ ] Multiple user scenarios tested
- [ ] Error scenarios tested
- [ ] Permission scenarios tested

### Manual Testing

- [ ] All CRUD operations work
- [ ] All endpoints callable from admin panel
- [ ] Error messages clear
- [ ] UI/UX flows smooth

---

## Phase 14: Documentation ✓

### Code Documentation

- [ ] API service functions documented
- [ ] Complex logic commented
- [ ] Type definitions documented
- [ ] Error codes documented

### API Documentation

- [ ] Endpoint descriptions
- [ ] Request/response examples
- [ ] Error responses documented
- [ ] Authentication requirements clear

### User Documentation

- [ ] Admin panel user guide created
- [ ] Common workflows documented
- [ ] Troubleshooting guide created
- [ ] FAQ compiled

---

## Phase 15: Deployment Preparation ✓

### Environment Configuration

- [ ] Development `.env.local` created
- [ ] Staging `.env.staging` created
- [ ] Production `.env.production` created
- [ ] No secrets in code/git

### Build & Deployment

- [ ] Build successful: `npm run build`
- [ ] No console errors/warnings
- [ ] Bundle size acceptable
- [ ] Deployment script prepared

### Staging Verification

- [ ] Deployed to staging environment
- [ ] All endpoints reachable
- [ ] Backend URL correctly configured
- [ ] Auth flow works
- [ ] CRUD operations work

### Production Readiness

- [ ] Monitoring/logging configured
- [ ] Error tracking enabled
- [ ] Backup strategy in place
- [ ] Rollback plan prepared
- [ ] Documentation updated

---

## Phase 16: Post-Launch Monitoring ✓

### Performance Monitoring

- [ ] API response times tracked
- [ ] Error rates monitored
- [ ] User activity logged
- [ ] Performance alerts set

### Bug Tracking

- [ ] Bug report system in place
- [ ] Issues prioritized
- [ ] Hotfixes ready
- [ ] Rollback plan tested

### User Support

- [ ] Support team trained
- [ ] FAQ available
- [ ] Escalation procedures defined
- [ ] Response time SLA set

---

## Postman Collection Usage Summary

### Test All Endpoints

```
✓ Login (Admin APIs → Auth → Auth)
✓ Create Banner (Admin APIs → Banners → Add)
✓ List Banners (Admin APIs → Banners → Get all)
✓ Create Category (Admin APIs → Categories → Add)
✓ List Categories (Admin APIs → Categories → List)
✓ Get Users (Admin APIs → Users → List)
✓ Get Dashboard (Admin APIs → Dashboard → Get stats)
```

### Key Variables

```
BASE_URL: http://103.194.228.68:3552/v1/api/
ADMIN_TOKEN: <JWT from login response>
```

---

## Success Criteria

All checklist items complete when:

- ✅ All API endpoints accessible from admin panel
- ✅ Authentication working (login/logout)
- ✅ All CRUD operations functional
- ✅ File uploads working to S3
- ✅ Error handling complete
- ✅ Performance acceptable
- ✅ Security validated
- ✅ Documentation complete
- ✅ Staging deployment successful
- ✅ Team trained and ready

---

## Notes & Issues Log

### Issues Found

| # | Issue | Status | Resolution |
|---|-------|--------|------------|
| 1 | | OPEN | |
| 2 | | OPEN | |
| 3 | | OPEN | |

### Fixes Applied

| Date | Issue | Fix | Status |
|------|-------|-----|--------|
| | | | COMPLETE |
| | | | COMPLETE |

---

## Signatures & Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Frontend Lead | __________ | ________ | ☐ Approve |
| Backend Lead | __________ | ________ | ☐ Approve |
| QA Lead | __________ | ________ | ☐ Approve |
| Product Owner | __________ | ________ | ☐ Approve |

---

## Revision History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-30 | Initial checklist created |

