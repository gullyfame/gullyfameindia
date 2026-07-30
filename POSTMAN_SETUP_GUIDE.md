# Postman Collection Setup & Usage Guide

## Quick Start

### Step 1: Import Postman Collection

1. Open **Postman** desktop application
2. Click **Import** button (top-left)
3. Select **Upload Files**
4. Choose file: `Gully Fame API.postman_collection (1).json`
5. Click **Import**

You should now see "Gully Fame API" collection in the left sidebar.

---

## Step 2: Create Environment

### Option A: Manual Setup

1. Click **Environments** (left sidebar)
2. Click **+ Create New** button
3. Name: `Gully Fame Dev`
4. Add variables:

```
VARIABLE        VALUE                                    ENABLED
BASE_URL        http://103.194.228.68:3552/v1/api/       ✓
ADMIN_TOKEN     (leave empty)                            ✓
USER_TOKEN      (leave empty)                            ✓
```

5. Click **Save**

### Option B: Import Environment File

Create a file `gully-fame-environment.json`:

```json
{
  "id": "gully-fame-env",
  "name": "Gully Fame Dev",
  "values": [
    {
      "key": "BASE_URL",
      "value": "http://103.194.228.68:3552/v1/api/",
      "enabled": true
    },
    {
      "key": "ADMIN_TOKEN",
      "value": "",
      "enabled": true
    },
    {
      "key": "USER_TOKEN",
      "value": "",
      "enabled": true
    }
  ]
}
```

Then import via **Postman → Import → Upload Files**.

---

## Step 3: Login to Get Token

### Method 1: Manual Token Copy

1. Navigate to **Admin APIs → Auth → Auth** request
2. Verify request shows:
   - Method: `POST`
   - URL: `{{BASE_URL}}admin/login`
   - Body has email/password
3. Click **Send**
4. In the response, find the `data.token` value
5. **Copy the token** (entire JWT string)
6. Go to **Environments → Gully Fame Dev**
7. Paste token into `ADMIN_TOKEN` value field
8. Click **Save**

### Method 2: Auto-Populate via Test Script (Advanced)

Add this test script to the login request:

```javascript
// Save token to environment
var jsonData = pm.response.json();
if (jsonData.data.token) {
  pm.environment.set("ADMIN_TOKEN", jsonData.data.token);
  console.log("✓ Token saved to ADMIN_TOKEN");
}
```

Steps:
1. Go to **Admin APIs → Auth → Auth** request
2. Click **Tests** tab
3. Paste the script above
4. Send request
5. Token automatically saved!

---

## Step 4: Verify Token is Set

1. Open **Environments → Gully Fame Dev**
2. Confirm `ADMIN_TOKEN` is now populated (shows long JWT string)
3. Click outside to close

---

## Common Workflows

### Workflow 1: Create a Banner

1. **Login First** (if token expired)
   - Go to: **Admin APIs → Auth → Auth**
   - Click **Send**
   - Copy token, update environment

2. **Create Banner**
   - Go to: **Admin APIs → Banners → Add**
   - In **Body** tab:
     - Select **form-data**
     - Row 1: key=`title`, value=`My Banner`, type=Text
     - Row 2: key=`banner`, value=`select file`, type=File
   - Click **Select Files** and choose image
   - Click **Send**

3. **View Response**
   - Check response has `"code": 1`
   - Copy the S3 URL from `data.banner`
   - Banner created! ✓

### Workflow 2: List & Delete Category

1. **List Categories**
   - Go to: **Admin APIs → Categories → List**
   - Click **Send**
   - View all categories in response

2. **Delete Category**
   - Copy a category `_id` from the list response
   - Go to: **Admin APIs → Categories → Delete**
   - In **Params** tab, set:
     - `id` = `<paste category id>`
   - Click **Send**
   - Response shows: `{ "code": 1, "data": {} }`
   - Category deleted! ✓

### Workflow 3: Update User KYC Status

1. **Get Users**
   - Go to: **Admin APIs → Users → List**
   - Click **Send**
   - Copy a user `_id`

2. **Update KYC**
   - Go to: **Admin APIs → Users → Update KYC**
   - In **Params**, set: `id` = `<user id>`
   - In **Body**, raw JSON:
     ```json
     {
       "status": "verified"
     }
     ```
   - Click **Send**
   - User KYC updated! ✓

---

## Variable Reference

### Environment Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `BASE_URL` | API base path | `http://103.194.228.68:3552/v1/api/` |
| `ADMIN_TOKEN` | JWT for admin requests | `eyJhbGciOi...` |
| `USER_TOKEN` | JWT for user requests | `eyJhbGciOi...` |

### Using Variables in Requests

Variables are automatically replaced when enclosed in `{{}}`:

```
URL:     {{BASE_URL}}admin/banners
Header:  Authorization: Bearer {{ADMIN_TOKEN}}
```

---

## Tips & Tricks

### Tip 1: Save Responses for Later

1. Send a request
2. Click **Save Response** (below response)
3. Click **Save as example**
4. Name it (e.g., "Banner Create Success")
5. Later: Click **Examples** dropdown to replay

### Tip 2: Pre-Request Scripts

Add common setup in collection **Pre-request Script**:

```javascript
// Validate token exists
if (!pm.environment.get('ADMIN_TOKEN')) {
  console.warn('⚠️ ADMIN_TOKEN not set. Please login first!');
}
```

1. Right-click **Gully Fame API** collection
2. Click **Edit**
3. Go to **Pre-request Script** tab
4. Paste script

### Tip 3: Test Assertions

Auto-validate responses in **Tests** tab:

```javascript
pm.test("Response is success", function () {
  var jsonData = pm.response.json();
  pm.expect(jsonData.code).to.equal(1);
});

pm.test("Response time < 500ms", function () {
  pm.expect(pm.response.responseTime).to.be.below(500);
});
```

### Tip 4: Run Requests in Sequence

1. Click **Collection Runner** icon (top-left)
2. Select **Gully Fame API** collection
3. Select **Gully Fame Dev** environment
4. Click **Start Test Run**
5. Runs all requests in order

---

## File Upload Guide

For requests that upload files (banners, categories):

### Step 1: Select Form Data
- Go to **Body** tab
- Click **form-data** radio button

### Step 2: Add Text Fields
- Click **+ Add**
- Key: `title`
- Value: `My Banner Title`
- Type: **Text** (default)

### Step 3: Add File Field
- Click **+ Add**
- Key: `banner` (or `icon` for categories)
- Click **File** type dropdown
- Click **Select Files** button
- Choose image from computer

### Step 4: Send Request
- Click **Send**
- Monitor response for S3 URL

### Supported Formats
- Images: JPG, PNG, GIF, SVG
- Max file size: Check backend limits (typically 5-10 MB)

---

## Authentication Troubleshooting

### Problem: 401 Unauthorized

**Solution:**
1. Token might be expired
2. Regenerate: Go to **Auth → Auth**, click **Send**
3. Copy new token
4. Update `ADMIN_TOKEN` in environment
5. Try request again

### Problem: CORS Error

**Solution:**
1. This is a backend issue (not Postman)
2. Contact backend team
3. Backend needs to allow your origin in CORS settings

### Problem: 403 Forbidden

**Solution:**
1. You might not have admin permissions
2. Verify you logged in with admin account
3. Check user role in response

### Problem: 404 Not Found

**Solution:**
1. Resource ID might be wrong
2. Check {{BASE_URL}} is correct
3. Verify endpoint path is typed correctly

---

## Collection Structure

```
Gully Fame API (root collection)
│
├── Admin APIs
│   ├── Add public
│   │   └── Add logo
│   ├── Auth
│   │   ├── Auth (Login)
│   │   ├── Register
│   │   └── Detail
│   ├── Banners
│   │   ├── Add
│   │   ├── Get all
│   │   ├── Detail
│   │   ├── Update
│   │   └── Delete
│   ├── Categories
│   │   ├── Add
│   │   ├── List
│   │   └── Delete
│   ├── CMS
│   ├── Competitions
│   ├── Users
│   ├── Sponsors
│   ├── Reports
│   └── Dashboard
│
├── User APIs
│   ├── Authentication
│   ├── Profile
│   ├── Videos
│   └── Competitions
│
└── Public APIs
    ├── Logo
    ├── Categories
    └── CMS
```

---

## Best Practices

### 1. Environment Management
- Keep dev and prod environments separate
- Never commit tokens to Git
- Use environment files for team sharing (remove tokens)

### 2. Request Organization
- Use folders for logical grouping
- Name requests clearly (verb + resource)
- Add descriptions in request details

### 3. Testing
- Add test scripts to validate responses
- Check response codes
- Monitor response times

### 4. Documentation
- Add examples to each request
- Document required fields
- Note any special requirements

### 5. Security
- Never share `ADMIN_TOKEN` in chat/email
- Regenerate tokens regularly
- Use separate admin accounts for testing

---

## Advanced Features

### Mock Server

1. Right-click collection
2. Click **Mock collection**
3. Postman generates mock URLs
4. Use for frontend development without backend

### API Documentation

1. Right-click collection
2. Click **View in web**
3. Generates shareable API docs
4. Can be published publicly

### Collections Export

1. Right-click collection
2. Click **Export**
3. Save as JSON
4. Share with team via Git

```bash
git add Gully\ Fame\ API.postman_collection.json
git commit -m "Update API collection"
git push
```

---

## Integration with Admin Panel

### Connection Flow

```
Postman Testing
       ↓
Verify Endpoints Work
       ↓
Admin Panel Calls Same Endpoints
       ↓
Same Response Format
       ↓
Admin Panel Works Correctly
```

### Testing Before Admin Panel Implementation

1. Test endpoint in Postman first
2. Verify response format
3. Copy response JSON
4. Use in admin panel's TypeScript types
5. Implement UI with real data

---

## Common Postman Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd + Enter` | Send request |
| `Cmd + Alt + C` | Open console |
| `Cmd + Shift + E` | Manage environments |
| `Cmd + B` | Toggle sidebar |
| `Cmd + Alt + E` | Open environment editor |

---

## Support & Resources

- **Postman Learning Center**: https://learning.postman.com/
- **Postman API**: https://www.postman.com/api-platform/
- **Backend Team**: For API issues, contact backend developers

---

## Next Steps

After testing in Postman:

1. **Verify all endpoints work** with your credentials
2. **Document any issues** you find
3. **Share environment file** with team (without tokens)
4. **Use as reference** while building admin panel
5. **Validate response formats** match documentation

Happy testing! 🚀

