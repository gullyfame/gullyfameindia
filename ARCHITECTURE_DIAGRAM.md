# 🏗️ Complete Video Editor Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER (React Native)                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌─────────────────────┐  ┌──────────────────┐  ┌──────────────────┐   │
│  │   Camera Module     │  │  Timeline Editor │  │  Audio Editor    │   │
│  │                     │  │                  │  │                  │   │
│  │ • Capture video     │  │ • Clip mgmt      │  │ • Multi-track    │   │
│  │ • Front/back camera │  │ • Trim/cut       │  │ • Voiceover      │   │
│  │ • Quality selector  │  │ • Speed control  │  │ • Music library  │   │
│  └────────┬────────────┘  └────────┬─────────┘  └────────┬─────────┘   │
│           │                        │                      │             │
│           │  ┌──────────────────────────────────┐        │             │
│           │  │   Filter Panel   │  Text Overlay  │        │             │
│           │  │                  │                │        │             │
│           │  │ • 15+ filters    │ • Font/color   │        │             │
│           │  │ • Real-time      │ • Position     │        │             │
│           │  │   preview        │ • Timing       │        │             │
│           │  └────────┬─────────────────────────┘        │             │
│           │           │                                  │             │
│           └─────┬─────┴──────────────────────────────────┘             │
│                 │                                                       │
│         ┌───────▼─────────┐                                            │
│         │  Service Layer  │                                            │
│         │                 │                                            │
│         │ videoEditor     │  (9 functions - READY TO USE)             │
│         │  Service.ts     │                                            │
│         │                 │                                            │
│         │ • Session mgmt  │                                            │
│         │ • API calls     │                                            │
│         │ • Error handle  │                                            │
│         └───────┬─────────┘                                            │
└────────────────┼────────────────────────────────────────────────────────┘
                 │
        ┌────────▼────────┐
        │   HTTP Request  │
        │   (Axios)       │
        └────────┬────────┘
                 │
                 │ REST API
                 │
┌────────────────▼────────────────────────────────────────────────────────┐
│                      SERVER LAYER (Node.js/Express)                     │
├────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────────┐   │
│  │  Upload Handler  │ │  Video Processor │ │  Storage Manager     │   │
│  │                  │ │                  │ │                      │   │
│  │ • Multipart      │ │ • FFmpeg wrapper │ │ • S3 Integration     │   │
│  │ • Validation     │ │ • Trim/cut       │ │ • File streaming     │   │
│  │ • Temp storage   │ │ • Filters        │ │ • Cleanup/TTL        │   │
│  └────────┬─────────┘ │ • Effects        │ │                      │   │
│           │           │ • Text render    │ └──────────┬───────────┘   │
│           │           │ • Audio merge    │            │               │
│           │           │ • Encoding       │    ┌───────▼────────────┐  │
│           │           └────────┬─────────┘    │  ┌──────────────┐   │  │
│           │                    │              │  │  S3 Bucket   │   │  │
│           │           ┌────────▼────────┐    │  └──────────────┘   │  │
│           │           │  Job Queue      │    │  ┌──────────────┐   │  │
│           │           │  (Bull/Redis)   │    │  │ Video Files  │   │  │
│           │           │                 │    │  │ Thumbnails   │   │  │
│           │           │ • Background    │    │  │ Audio Files  │   │  │
│           │           │   processing    │    │  │ Metadata     │   │  │
│           │           │ • Concurrency   │    │  └──────────────┘   │  │
│           │           │ • Retries       │    └────────────────────┘   │
│           │           └─────┬───────────┘                             │
│           │                 │                                         │
│           │   ┌─────────────▼────────────────┐                       │
│           │   │   Database Models            │                       │
│           │   │                              │                       │
│           │   │ • VideoSession               │                       │
│           │   │ • EditingProject             │                       │
│           │   │ • AudioTrack                 │                       │
│           │   │ • User (ref)                 │                       │
│           │   └─────────────┬────────────────┘                       │
│           │                 │                                         │
│  ┌────────▼──────────────────▼──────────────────────────────────┐    │
│  │         MongoDB (Persistent Storage)                         │    │
│  │                                                              │    │
│  │ Collections:                                                 │    │
│  │ • videosessions  → Editing state                            │    │
│  │ • editingprojects → Exported videos                         │    │
│  │ • audiotracks     → Music library                           │    │
│  │ • users           → User data                               │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │         Microservices (External)                            │   │
│  │                                                              │   │
│  │ • Google Cloud TTS    (Text-to-Speech)                     │   │
│  │ • AWS Polly           (Alternative TTS)                    │   │
│  │ • Redis               (Caching & Queue)                    │   │
│  │ • FFmpeg              (Video Processing)                   │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagram

### 1. VIDEO UPLOAD & PROCESSING FLOW
```
┌─────────────────────────────────────────────────────────────────────┐
│ User selects video from gallery                                      │
└────────────────────┬────────────────────────────────────────────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │ uploadVideo()          │ (Frontend)
         │ - Compress/prepare     │
         │ - Show progress        │
         └────────┬──────────────┘
                  │
                  ▼
         ┌──────────────────────────────┐
         │ POST /video-editor/upload    │ (Multipart)
         └────────┬─────────────────────┘
                  │
                  ▼
      ┌──────────────────────────────┐
      │ Backend Handler              │
      │ - Validate file              │
      │ - Store temp file            │
      │ - Extract metadata (ffprobe) │
      │ - Create VideoSession        │
      │ - Return sessionId           │
      └────────┬─────────────────────┘
               │
               ▼
      ┌──────────────────────────────┐
      │ S3 Upload                    │
      │ - Upload to /uploads/:uid/   │
      │ - Store metadata.json        │
      │ - Return signed URL          │
      └────────┬─────────────────────┘
               │
      ┌────────▼─────────┐
      │ Frontend receives│
      │ sessionId +      │
      │ videoUrl         │
      └──────────────────┘
```

### 2. VIDEO EDITING FLOW
```
┌──────────────────────────────────────────┐
│ User applies edits (trim, filter, etc.)  │
└────────────┬─────────────────────────────┘
             │
             ├─────────────────────────────┐
             │                             │
             ▼                             ▼
    ┌─────────────────┐         ┌──────────────────┐
    │ POST /trim      │         │ POST /filter     │
    │ - startTime     │         │ - name           │
    │ - endTime       │         │ - value          │
    └────────┬────────┘         └────────┬─────────┘
             │                           │
             ├───────────────────────────┤
             │                           │
             ▼                           ▼
    Queue Job in Bull            Queue Job in Bull
             │                           │
             ▼                           ▼
    FFmpeg Command:         FFmpeg Command:
    ffmpeg -i input.mp4   ffmpeg -i input.mp4
      -ss 0 -to 30           -vf "eq=brightness=0.2"
      output.mp4             output.mp4
             │                           │
             └───────────────────────────┘
                     │
                     ▼
          Update VideoSession
             in Database
                     │
                     ▼
          WebSocket Notification
          (Real-time progress)
                     │
                     ▼
        Frontend updates timeline
           (Refreshes preview)
```

### 3. VIDEO EXPORT FLOW
```
┌────────────────────────────────────┐
│ User clicks "Export Video"         │
├────────────────────────────────────┤
│ Quality: 720p                      │
│ Format: MP4                        │
│ Bitrate: 3Mbps                     │
└────────────────┬────────────────────┘
                 │
                 ▼
     ┌───────────────────────────┐
     │ POST /export              │
     │ - sessionId               │
     │ - quality/resolution      │
     │ - format                  │
     └─────────────┬─────────────┘
                   │
                   ▼
     ┌──────────────────────────────┐
     │ Backend Compilation          │
     │ 1. Fetch all edits           │
     │ 2. Build FFmpeg command      │
     │    with all filters/effects  │
     │ 3. Queue encoding job        │
     └─────────────┬────────────────┘
                   │
      ┌────────────▼──────────────┐
      │ FFmpeg Multi-step Build:  │
      │                           │
      │ 1. Apply trims           │
      │    ffmpeg -i input       │
      │      -ss 0 -to 30        │
      │      intermediate_1.mp4  │
      │                           │
      │ 2. Apply filters         │
      │    ffmpeg -i inter_1     │
      │      -vf "filters..."    │
      │      intermediate_2.mp4  │
      │                           │
      │ 3. Merge audio           │
      │    ffmpeg -i inter_2     │
      │      -i music.mp3        │
      │      -c:v copy           │
      │      -c:a aac            │
      │      intermediate_3.mp4  │
      │                           │
      │ 4. Render text overlay   │
      │    ffmpeg -i inter_3     │
      │      -vf drawtext        │
      │      intermediate_4.mp4  │
      │                           │
      │ 5. Encode final          │
      │    ffmpeg -i inter_4     │
      │      -b:v 3M             │
      │      -s 1280x720         │
      │      final.mp4           │
      │                           │
      │ (Cleanup intermediate)   │
      └────────────┬─────────────┘
                   │
                   ▼
      ┌──────────────────────┐
      │ Upload to S3         │
      │ /exports/{projectId} │
      │ /video_720p.mp4      │
      └─────────────┬────────┘
                    │
                    ▼
      ┌──────────────────────────┐
      │ Create EditingProject    │
      │ - Store export URL       │
      │ - Mark as completed      │
      │ - Create thumbnail       │
      └─────────────┬────────────┘
                    │
                    ▼
      ┌──────────────────────────┐
      │ Return to Frontend       │
      │ - downloadUrl            │
      │ - shareUrl (S3 signed)   │
      │ - metadata               │
      └──────────────────────────┘
                    │
                    ▼
      ┌──────────────────────────┐
      │ Frontend                 │
      │ - Show "Export Complete" │
      │ - Download or share      │
      │ - Post to feed           │
      └──────────────────────────┘
```

---

## Request/Response Examples

### CREATE SESSION
```
REQUEST:
POST /video-editor/session
Authorization: Bearer {USER_TOKEN}
Content-Type: application/json

{
  "videoUri": "https://s3.../uploads/user_123/raw_video.mp4",
  "duration": 120
}

RESPONSE:
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
    "createdAt": "2026-07-29T10:00:00Z",
    "updatedAt": "2026-07-29T10:00:00Z"
  }
}
```

### TRIM VIDEO
```
REQUEST:
POST /video-editor/{sessionId}/trim
Authorization: Bearer {USER_TOKEN}
Content-Type: application/json

{
  "startTime": 5,
  "endTime": 30
}

RESPONSE:
{
  "code": 1,
  "message": "success",
  "data": {
    "id": "clip_001",
    "uri": "https://s3.../sessions/session_67890/trimmed.mp4",
    "duration": 25,
    "startTime": 5,
    "endTime": 30,
    "thumbnail": "https://s3.../sessions/session_67890/thumb.jpg"
  }
}
```

### APPLY FILTER
```
REQUEST:
POST /video-editor/{sessionId}/filter
Authorization: Bearer {USER_TOKEN}
Content-Type: application/json

{
  "id": "filter_001",
  "name": "Brightness",
  "type": "brightness",
  "value": 0.2,
  "min": -1,
  "max": 1
}

RESPONSE:
{
  "code": 1,
  "message": "Filter queued for processing",
  "data": {
    "id": "filter_001",
    "name": "Brightness",
    "type": "brightness",
    "value": 0.2,
    "jobId": "job_12345"
  }
}
```

### EXPORT VIDEO
```
REQUEST:
POST /video-editor/{sessionId}/export
Authorization: Bearer {USER_TOKEN}
Content-Type: application/json

{
  "quality": "high",
  "resolution": "720p",
  "format": "mp4",
  "bitrate": 3000,
  "fps": 30
}

RESPONSE:
{
  "code": 1,
  "message": "Export started",
  "data": {
    "jobId": "job_export_99999",
    "status": "processing",
    "progress": 0,
    "estimatedTime": 120
  }
}

(WebSocket progress updates):
{
  "type": "export_progress",
  "data": {
    "jobId": "job_export_99999",
    "progress": 25,
    "stage": "applying_filters"
  }
}

(When complete):
{
  "type": "export_complete",
  "data": {
    "videoUri": "https://s3.../exports/project_123/video_720p.mp4",
    "duration": 120,
    "fileSize": 45000000,
    "thumbnail": "https://s3.../exports/project_123/thumb.jpg"
  }
}
```

---

## Component Integration Map

```
┌─────────────────────────────────────────────────────────────────┐
│                   Frontend (React Native)                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  CameraScreen → videoEditorService.createEditingSession()      │
│       │                                                         │
│       ▼                                                         │
│  ModernPreviewEditor                                            │
│       │                                                         │
│       ├─► TimelineEditor → videoEditorService.trimVideo()      │
│       │                                                         │
│       ├─► FilterPanel → videoEditorService.applyFilter()       │
│       │                                                         │
│       ├─► TextEditorModal → videoEditorService.addTextOverlay()│
│       │                                                         │
│       ├─► AudioEditor → videoEditorService.addMusic()          │
│       │                                                         │
│       ├─► VoiceRecorder → upload audio                         │
│       │                                                         │
│       ├─► TransitionEditor → videoEditorService.addTransition()│
│       │                                                         │
│       └─► ExportModal → videoEditorService.exportVideo()       │
│                                                                 │
└──────────────────────────────────────────────────────────────────┘
               │
               │ (All routes to same BASE_URL)
               │
┌──────────────▼──────────────────────────────────────────────────┐
│               Backend Express Router                            │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  POST   /video-editor/session         → createSession()        │
│  GET    /video-editor/:id             → getSession()           │
│  POST   /video-editor/:id/trim        → trimVideo()            │
│  POST   /video-editor/:id/filter      → applyFilter()          │
│  POST   /video-editor/:id/text        → addTextOverlay()       │
│  POST   /video-editor/:id/music       → addMusic()             │
│  POST   /video-editor/:id/transition  → addTransition()        │
│  POST   /video-editor/:id/export      → exportVideo()          │
│  DELETE /video-editor/:id             → deleteSession()        │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## Technology Stack Summary

```
Frontend:
├── React Native 0.81.5
├── Expo 54.0
├── FFmpeg-kit-react-native 6.0.2
├── Redux/Zustand
├── React Native Reanimated 4.1.1
└── Axios (API client)

Backend:
├── Node.js 18+
├── Express 4.x
├── MongoDB 5.0+
├── FFmpeg 6.0+
├── AWS S3 SDK
├── Bull (Job Queue)
├── Redis (Cache)
├── Socket.io (Real-time)
└── Google Cloud TTS / AWS Polly

Infrastructure:
├── AWS S3 (Storage)
├── AWS EC2 (or Docker container for FFmpeg)
├── MongoDB Atlas (Database)
├── Redis Cloud (Queue)
├── Google Cloud TTS API
└── CloudFront CDN
```

