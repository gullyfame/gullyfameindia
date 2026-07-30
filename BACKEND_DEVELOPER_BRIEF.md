# 🚀 Gully Fame Video Editor - Backend Developer Task Brief

**To:** Backend Development Team  
**From:** Project Lead  
**Date:** July 29, 2026  
**Priority:** 🔴 HIGH - Core Feature  
**Timeline:** Phase 1 (2 weeks) | Full Implementation (2-3 weeks)

---

## 📌 EXECUTIVE CONTEXT

**Status:** Frontend React Native video editor 95% complete ✅  
**Current Gap:** Backend video processing completely missing ❌  
**Your Mission:** Build production-ready backend API for video editing

Frontend team ne hamara video editor bilkul tayyar kar diya hai. Ab hamein iska **core processing engine** build karna hai jo actual video processing karenge.

---

## 🎯 PROJECT SCOPE

### What Frontend Already Has (Hume nahi karna)
- ✅ 40+ React Native components (Camera, Timeline, Editor, Effects)
- ✅ Complete service layer (9 API functions ready)
- ✅ Type-safe interfaces & error handling
- ✅ Real-time preview & UI state management

### What Backend Must Build (Aapka kaam)
- ❌ Video upload & storage management
- ❌ Session persistence in database
- ❌ FFmpeg-based video processing
- ❌ Job queue for background tasks
- ❌ 14 API endpoints
- ❌ Real-time progress tracking

---

## 🛠️ TECH STACK (Fixed - No Negotiation)

```
Runtime:       Node.js 18+
Framework:     Express.js
Database:      MongoDB (existing)
Storage:       AWS S3
Queue:         Bull + Redis
Video Engine:  FFmpeg 6.0+
Real-time:     Socket.io
Package Mgr:   npm/yarn (already using)
```

---

## 📊 DATABASE SCHEMAS (3 Collections)

### 1. VideoSession Schema
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  sessionId: String (unique),
  
  // Raw video
  videoUri: String (S3 path),
  duration: Number,
  resolution: String,
  fileSize: Number,
  
  // Editing state
  clips: [{
    id: String,
    uri: String,
    startTime: Number,
    endTime: Number,
    duration: Number,
    position: Number
  }],
  
  filters: [{
    id: String,
    name: String,
    type: String (brightness|contrast|saturation|hue|blur|sepia|grayscale),
    value: Number,
    min: Number,
    max: Number,
    applied: Boolean
  }],
  
  effects: [{
    id: String,
    name: String,
    type: String (transition|text|sticker|music|voiceover),
    duration: Number,
    startTime: Number,
    endTime: Number,
    data: Object
  }],
  
  texts: [{
    id: String,
    text: String,
    fontSize: Number,
    color: String,
    fontFamily: String,
    position: String (top|center|bottom),
    startTime: Number,
    endTime: Number,
    opacity: Number,
    x: Number, // positioning
    y: Number
  }],
  
  music: [{
    id: String,
    title: String,
    artist: String,
    audioUrl: String,
    startTime: Number,
    volume: Number,
    duration: Number
  }],
  
  // Metadata
  createdAt: Date,
  updatedAt: Date,
  expiresAt: Date (TTL: 24 hours for auto-cleanup)
}
```

### 2. EditingProject Schema
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  projectId: String (unique),
  sessionId: ObjectId (ref: VideoSession),
  
  // Project info
  title: String,
  description: String,
  thumbnail: String (S3 URL),
  
  // Export data
  exportedVideoUrl: String (S3 signed URL),
  
  metadata: {
    resolution: String (360p|480p|720p|1080p),
    quality: String (low|medium|high|ultra),
    format: String (mp4|mov|webm),
    fileSize: Number,
    duration: Number,
    bitrate: Number,
    fps: Number
  },
  
  // Processing status
  status: String (draft|processing|completed|failed),
  progress: Number (0-100),
  error: String (if failed),
  jobId: String (Bull job reference),
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date,
  processedAt: Date,
  publishedAt: Date
}
```

### 3. AudioTrack Schema
```javascript
{
  _id: ObjectId,
  trackId: String (unique),
  
  // Track info
  title: String,
  artist: String,
  category: String (music|soundfx|voiceover|background),
  
  // Audio data
  audioUrl: String (S3 URL),
  duration: Number,
  thumbnailUrl: String,
  waveformUrl: String,
  
  // Metadata
  metadata: {
    bitrate: Number,
    sampleRate: Number,
    channels: Number,
    codec: String
  },
  
  // Management
  isActive: Boolean,
  isFeatured: Boolean,
  uploadedBy: ObjectId (ref: User),
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔌 14 API ENDPOINTS (Must Build)

### Group 1: Session Management (3 endpoints)

**1. CREATE EDITING SESSION**
```
POST /video-editor/session
Authorization: Bearer {USER_TOKEN}
Content-Type: application/json

Request:
{
  "videoUri": "https://s3.../uploads/user_123/raw_video.mp4",
  "duration": 120
}

Response:
{
  "code": 1,
  "message": "success",
  "data": {
    "id": "session_67890",
    "videoUri": "https://s3.../uploads/user_123/raw_video.mp4",
    "duration": 120,
    "clips": [],
    "filters": [],
    "effects": [],
    "texts": [],
    "music": [],
    "createdAt": "2026-07-29T10:00:00Z"
  }
}
```

**2. GET SESSION DETAILS**
```
GET /video-editor/:sessionId
Authorization: Bearer {USER_TOKEN}

Response: (Same as above)
```

**3. DELETE SESSION (Cleanup)**
```
DELETE /video-editor/:sessionId
Authorization: Bearer {USER_TOKEN}

Response:
{
  "code": 1,
  "message": "Session deleted successfully",
  "data": {}
}
```

---

### Group 2: Video Processing (5 endpoints)

**4. UPLOAD RAW VIDEO**
```
POST /video-editor/upload
Authorization: Bearer {USER_TOKEN}
Content-Type: multipart/form-data

Form:
- file: video file (MP4, MOV, WebM)
- quality: optional (hd|fhd)

Response:
{
  "code": 1,
  "message": "Video uploaded successfully",
  "data": {
    "uploadId": "upload_123",
    "videoUri": "https://s3.../uploads/user_123/video_abc.mp4",
    "duration": 120,
    "resolution": "1080x1920",
    "fileSize": 50000000
  }
}
```

**5. TRIM VIDEO (FFmpeg)**
```
POST /video-editor/:sessionId/trim
Authorization: Bearer {USER_TOKEN}
Content-Type: application/json

Request:
{
  "startTime": 5,
  "endTime": 30
}

Response:
{
  "code": 1,
  "message": "Trim operation queued",
  "data": {
    "clipId": "clip_001",
    "uri": "https://s3.../sessions/session_67890/trimmed.mp4",
    "duration": 25,
    "startTime": 5,
    "endTime": 30,
    "thumbnail": "https://s3.../sessions/session_67890/thumb_001.jpg",
    "jobId": "job_trim_xyz"
  }
}
```

**6. APPLY FILTER (FFmpeg)**
```
POST /video-editor/:sessionId/filter
Authorization: Bearer {USER_TOKEN}
Content-Type: application/json

Request:
{
  "id": "filter_001",
  "name": "Brightness",
  "type": "brightness",
  "value": 0.2,
  "min": -1,
  "max": 1
}

Response:
{
  "code": 1,
  "message": "Filter queued for processing",
  "data": {
    "filterId": "filter_001",
    "jobId": "job_filter_xyz",
    "status": "queued"
  }
}
```

**7. ADD TEXT OVERLAY (FFmpeg)**
```
POST /video-editor/:sessionId/text
Authorization: Bearer {USER_TOKEN}
Content-Type: application/json

Request:
{
  "id": "text_001",
  "text": "Hello World",
  "fontSize": 40,
  "color": "#FFFFFF",
  "fontFamily": "Arial",
  "position": "center",
  "startTime": 0,
  "endTime": 5,
  "opacity": 1
}

Response:
{
  "code": 1,
  "message": "Text overlay queued",
  "data": {
    "textId": "text_001",
    "jobId": "job_text_xyz",
    "status": "queued"
  }
}
```

**8. MERGE AUDIO (FFmpeg)**
```
POST /video-editor/:sessionId/music
Authorization: Bearer {USER_TOKEN}
Content-Type: application/json

Request:
{
  "id": "music_001",
  "title": "Background Music",
  "audioUrl": "https://s3.../audio/music_123.mp3",
  "startTime": 0,
  "volume": 0.8
}

Response:
{
  "code": 1,
  "message": "Audio merge queued",
  "data": {
    "musicId": "music_001",
    "jobId": "job_audio_xyz",
    "status": "queued"
  }
}
```

---

### Group 3: Export (2 endpoints)

**9. EXPORT VIDEO (Main Processing)**
```
POST /video-editor/:sessionId/export
Authorization: Bearer {USER_TOKEN}
Content-Type: application/json

Request:
{
  "quality": "high",
  "resolution": "720p",
  "format": "mp4",
  "bitrate": 3000,
  "fps": 30
}

Response:
{
  "code": 1,
  "message": "Export started - watch progress via WebSocket",
  "data": {
    "jobId": "job_export_99999",
    "status": "processing",
    "progress": 0,
    "estimatedTime": 120,
    "wsChannel": "export_job_export_99999"
  }
}

// WebSocket Progress Updates:
// Channel: export_job_export_99999
// Event: progress
{
  "type": "export_progress",
  "data": {
    "jobId": "job_export_99999",
    "progress": 25,
    "stage": "trimming_video",
    "eta": 90
  }
}

// When Complete:
{
  "type": "export_complete",
  "data": {
    "projectId": "project_123",
    "videoUri": "https://s3.../exports/project_123/video_720p.mp4",
    "duration": 120,
    "fileSize": 45000000,
    "thumbnail": "https://s3.../exports/project_123/thumb.jpg"
  }
}
```

**10. GET EXPORT STATUS**
```
GET /video-editor/:sessionId/export-status
Authorization: Bearer {USER_TOKEN}

Response:
{
  "code": 1,
  "message": "success",
  "data": {
    "jobId": "job_export_99999",
    "status": "processing",
    "progress": 65,
    "stage": "applying_filters",
    "estimatedTimeRemaining": 60
  }
}
```

---

### Group 4: Metadata & Library (4 endpoints)

**11. GET VIDEO METADATA**
```
GET /video-editor/:sessionId/metadata
Authorization: Bearer {USER_TOKEN}

Response:
{
  "code": 1,
  "message": "success",
  "data": {
    "duration": 120,
    "resolution": "1080x1920",
    "bitrate": 5000,
    "codec": "h264",
    "fps": 30,
    "fileSize": 50000000
  }
}
```

**12. GENERATE THUMBNAIL**
```
POST /video-editor/:sessionId/thumbnail
Authorization: Bearer {USER_TOKEN}
Content-Type: application/json

Request:
{
  "timestamp": 2.5,
  "width": 320,
  "height": 480
}

Response:
{
  "code": 1,
  "message": "Thumbnail generated",
  "data": {
    "thumbnailUrl": "https://s3.../sessions/session_67890/thumb_custom.jpg"
  }
}
```

**13. LIST AUDIO LIBRARY**
```
GET /public/audio?category=&page=1&limit=20
Authorization: Bearer {USER_TOKEN} (optional)

Response:
{
  "code": 1,
  "message": "success",
  "data": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "tracks": [
      {
        "id": "audio_001",
        "title": "Track Name",
        "artist": "Artist Name",
        "category": "music",
        "duration": 180,
        "audioUrl": "https://s3.../audio/music_001.mp3",
        "thumbnailUrl": "https://..."
      }
    ]
  }
}
```

**14. SAVE/UNSAVE AUDIO FOR USER**
```
POST /user/audio/:audioId/save
Authorization: Bearer {USER_TOKEN}
Content-Type: application/json

Request:
{
  "action": "save" // or "unsave"
}

Response:
{
  "code": 1,
  "message": "Audio saved successfully",
  "data": {
    "audioId": "audio_001",
    "isSaved": true
  }
}
```

---

## 🔧 NPM PACKAGES (Install These)

```bash
# AWS S3
npm install aws-sdk multer-s3

# Video Processing
npm install fluent-ffmpeg ffmpeg-static

# Job Queue
npm install bull redis

# Real-time
npm install socket.io socket.io-client

# Database
npm install mongoose

# Utilities
npm install dotenv cors helmet compression
```

---

## 📁 FOLDER STRUCTURE (Create This)

```
backend/
├── src/
│   ├── api/
│   │   ├── routes/
│   │   │   ├── videoEditor.ts      ← Upload, Trim, Export
│   │   │   ├── audioLibrary.ts     ← Music library
│   │   │   └── index.ts
│   │   └── middleware/
│   │       ├── auth.ts
│   │       └── upload.ts           ← Multer S3 config
│   │
│   ├── services/
│   │   ├── videoProcessor.ts       ← FFmpeg wrapper
│   │   ├── storageService.ts       ← S3 operations
│   │   ├── metadataService.ts      ← Extract video info
│   │   └── sessionService.ts       ← Session management
│   │
│   ├── models/
│   │   ├── VideoSession.ts
│   │   ├── EditingProject.ts
│   │   └── AudioTrack.ts
│   │
│   ├── workers/
│   │   └── videoProcessor.ts       ← Bull queue handlers
│   │
│   ├── config/
│   │   ├── database.ts
│   │   ├── s3.ts
│   │   ├── ffmpeg.ts
│   │   └── redis.ts
│   │
│   └── app.ts                       ← Express app
│
├── .env.example
├── package.json
└── README.md
```

---

## 🌍 ENVIRONMENT VARIABLES

```env
# Server
NODE_ENV=development
PORT=3000

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/gullyfame

# AWS S3
AWS_ACCESS_KEY_ID=xxxxxxxxxx
AWS_SECRET_ACCESS_KEY=xxxxxxxxxx
AWS_REGION=ap-south-1
S3_BUCKET_NAME=gfm-videos
S3_UPLOAD_FOLDER=uploads

# Redis
REDIS_URL=redis://localhost:6379

# FFmpeg
FFMPEG_PATH=/usr/local/bin/ffmpeg
FFPROBE_PATH=/usr/local/bin/ffprobe

# Video Constraints
MAX_VIDEO_SIZE=500000000           # 500MB
MAX_VIDEO_DURATION=900             # 15 minutes
MAX_VIDEO_RESOLUTION=1080

# API
API_URL=http://localhost:3000
FRONTEND_URL=http://localhost:8081
```

---

## 🎯 PHASE 1: PRIORITY TASKS (Start With These)

### Week 1: Core Foundation

**Day 1-2: Database + AWS S3**
- [ ] VideoSession, EditingProject, AudioTrack schemas create & test
- [ ] AWS S3 connection setup
- [ ] Multer S3 middleware ready
- [ ] `/video-editor/upload` endpoint working

**Day 3-4: FFmpeg Integration**
- [ ] FFmpeg server testing
- [ ] Fluent-ffmpeg wrapper created
- [ ] Bull + Redis queue setup
- [ ] Basic trim operation working

**Day 5: Export + Testing**
- [ ] Export endpoint created
- [ ] Full workflow: Upload → Trim → Export working
- [ ] Postman testing complete
- [ ] Error handling robust

---

## ✅ SUCCESS CRITERIA (Phase 1)

```
✅ User uploads video file → File stored in S3
✅ User trims video (5-30 sec) → Trimmed video created
✅ User exports video → MP4 file ready for download
✅ Processing doesn't crash server → Queue system working
✅ Errors are handled gracefully → User gets meaningful messages
✅ File size limit respected → Max 500MB enforced
✅ Sessions auto-cleanup → After 24 hours deleted from DB
```

---

## 🔗 REFERENCES

**Frontend Ready to Use:**
- Service Layer: `/apps/gully-fame-mobile/src/api/services/videoEditorService.ts`
- Types: `/apps/gully-fame-mobile/src/api/types/video.ts`
- Endpoints: `/apps/gully-fame-mobile/src/api/endpoints.ts`

**Existing API Pattern:**
- All responses follow: `{ code: 1, message: "success", data: {...} }`
- Authentication: Bearer token (JWT)
- Error format: `{ code: 0, message: "error msg", error: "details" }`

**Documentation:**
- Full Architecture: `/ARCHITECTURE_DIAGRAM.md`
- Complete Analysis: `/VIDEO_EDITOR_COMPLETE_ANALYSIS.md`
- Postman Collection: `Gully Fame API.postman_collection (1).json`

---

## 📞 COLLABORATION POINTS

**Questions/Blockers?**
1. AWS Credentials - Contact DevOps team
2. FFmpeg Setup Help - I'll provide docker image
3. Database Access - Contact DBA
4. Architecture Discussion - Quick sync call

**Timeline Confirmation:**
- When can you start? (ASAP?)
- How many devs on this? (Recommended: 1-2 for Phase 1)
- Any blockers I should know?

---

## 🚀 LET'S BUILD!

Yeh Phase 1 ka complete roadmap hai. 2 weeks mein basic video editor functionality live kar denge.

**Key Points:**
- ✅ Architecture fixed, no changes
- ✅ Tech stack approved, stick to it
- ✅ Database schemas ready, just create
- ✅ API contracts defined, no ambiguity
- ✅ Timeline is realistic, 40 hours effort

**Next Steps:**
1. ✋ Confirm you can start
2. 📝 Get AWS credentials from DevOps
3. 🎯 Follow Week 1 checklist exactly
4. 🔗 Daily standups for blockers

---

**Ready to build the best video editor? Let's go! 🎬**

---

*Generated: July 29, 2026 | Analysis Complete | Ready for Implementation*

