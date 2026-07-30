# 🎬 Gully Fame - Frontend Developer Integration Guide

**For:** React Native & Web Developers  
**Date:** July 29, 2026  
**Focus:** How to integrate with backend APIs

---

## 📚 QUICK REFERENCE BY FEATURE

### 1. Authentication Flow

```typescript
// Registration with OTP
1. POST /auth/register { email, password, name }
   ↓ Returns: { userId, token, requiresOTP }
2. User gets OTP via email
3. POST /auth/verify-otp { email, otp }
   ↓ Returns: { authToken, refreshToken }
4. Store tokens in secure storage
5. Set Authorization header for all requests

// Login
1. POST /auth/login { email, password }
   ↓ Returns: { token, user: { id, name, role } }
2. Store token
3. GET /auth/profile → Get full profile

// Social Login
1. Get ID token from Google/Facebook
2. POST /auth/social-login { provider, idToken }
   ↓ Returns: { token, isNewUser }
```

### 2. Video Reels (Main Feed)

```typescript
// Get Feed
GET /reels?page=1&limit=20&sort=-createdAt
↓ Returns: 
{
  page: 1,
  total: 150,
  items: [
    {
      _id, title, videoUrl, likes, views,
      creator: { name, avatar },
      comments: []
    }
  ]
}

// Upload Video
1. Get upload URL: POST /reels/upload-url { filename }
   ↓ Returns: { uploadUrl, fileKey }
2. Upload to S3 using signed URL
3. Publish reel: POST /reels/publish 
   { title, description, videoKey, thumbnail }

// Like Reel
POST /reels/:reelId/action { action: 'like' }
↓ Returns: { liked: true, likeCount: 45 }

// Add Comment
POST /reels/:reelId/comments { text: 'Great video!' }
↓ Returns: { commentId, createdAt }

// Send Tip
POST /reels/:reelId/tip { amount: 100 }
↓ Returns: { tipId, status, message: 'Tip sent!' }
```

### 3. Competitions (Gaming)

```typescript
// Get Competitions List
GET /competitions?page=1&limit=20&status=active
↓ Returns: [
  { _id, title, rules, startDate, participants: 45 }
]

// Join Competition
POST /competitions/:compId/join
↓ Returns: { participantId, joinedAt }

// Get Leaderboard
GET /competitions/:compId/leaderboard?limit=50
↓ Returns: [
  { rank: 1, userId, username, score: 1000 }
]

// Submit Reel to Competition
When publishing reel, add: { competitionId: 'comp_123' }
```

### 4. Chat (Real-time Messaging)

```typescript
// Setup Socket Connection
import io from 'socket.io-client';

const socket = io('https://api.gullyfame.com', {
  auth: { token: authToken }
});

// Connect to specific chat
socket.emit('join:chat', { chatId: 'chat_123' });

// Listen for messages
socket.on('message:new', (msg) => {
  console.log('New message:', msg);
  // Update UI
});

// Send message
socket.emit('message:send', {
  chatId: 'chat_123',
  text: 'Hello!',
  media: [] // optional
});

// Get Chat History
GET /chat/chatDetails?chatId=chat_123&limit=50
↓ Returns: [
  { _id, text, sender, timestamp, reactions: [] }
]

// Mark as Read
PUT /chat/read { chatId: 'chat_123' }
```

### 5. Follow System

```typescript
// Follow/Unfollow User
POST /follow/:userId
↓ Returns: { following: true/false, totalFollowers: 123 }

// Get Followers
GET /user/:userId/followers?page=1&limit=20
↓ Returns: { page, total, items: [users] }

// Get Following
GET /user/:userId/following?page=1&limit=20
↓ Returns: { page, total, items: [users] }
```

### 6. User Profile

```typescript
// Get My Profile
GET /auth/profile
↓ Returns: {
  _id, email, username, avatar, bio,
  followers: 1200, following: 450,
  totalEarnings: 5000, reelsCount: 25
}

// Update Profile
PUT /auth/profile {
  username, bio, avatar,
  phone, language, preferences
}
↓ Returns: { updated: true, user: {...} }

// Get Another User Profile
GET /user/:userId
↓ Returns: { user profile without email/phone }
```

### 7. Earnings & Wallet

```typescript
// Get My Earnings
GET /earnings
↓ Returns: {
  totalEarnings: 5000,
  monthlyEarnings: 500,
  pendingAmount: 200,
  breakdown: [
    { source: 'tips', amount: 300 },
    { source: 'competition_prize', amount: 200 }
  ]
}

// Get Wallet Balance
GET /wallet
↓ Returns: {
  balance: 5000,
  totalDeposited: 10000,
  totalWithdrawn: 5000
}

// Recharge Wallet (Payment Integration)
POST /wallet/recharge { amount: 100, paymentMethod: 'card' }
↓ Returns: { transactionId, paymentUrl }

// Get Top Earners
GET /winners/top-earners?limit=10
↓ Returns: [
  { rank: 1, username, avatar, totalEarnings: 50000 }
]
```

### 8. Search

```typescript
// Search Everything
GET /search?q=keyword&page=1
↓ Returns: {
  users: [{ id, name, avatar }],
  reels: [{ id, title, likes }],
  competitions: [{ id, title }]
}

// Search Specific
GET /search/users?q=john
GET /search/reels?q=viral
GET /search/competitions?q=dance
```

### 9. Notifications

```typescript
// Get Notifications
GET /notification
↓ Returns: [
  {
    _id, title: 'New follower!',
    message: '@john followed you',
    type: 'follow',
    relatedId: 'user_123',
    isRead: false,
    createdAt
  }
]

// Real-time Notifications (Socket.io)
socket.on('notification:new', (notif) => {
  console.log('Notification:', notif);
});
```

### 10. Video Editor Integration

```typescript
// Create Session
POST /video-editor/session { videoUri, duration }
↓ Returns: { sessionId, videoUri }

// Trim Video
POST /video-editor/:sessionId/trim { startTime: 5, endTime: 30 }
↓ Returns: { clipId, uri, thumbnail }

// Apply Filter
POST /video-editor/:sessionId/filter {
  name: 'Brightness',
  type: 'brightness',
  value: 0.2
}
↓ Returns: { filterId, status: 'queued' }

// Export Video
POST /video-editor/:sessionId/export {
  quality: 'high',
  resolution: '720p',
  format: 'mp4'
}
↓ Returns: { jobId, status: 'processing' }

// Monitor Export Progress
socket.on('export:progress', (data) => {
  console.log(`Export progress: ${data.progress}%`);
});

// Export Complete
socket.on('export:complete', (data) => {
  console.log('Download URL:', data.videoUri);
});
```

---

## 🔧 API CLIENT SETUP

### React Native (Axios)

```typescript
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiClient = axios.create({
  baseURL: 'https://api.gullyfame.com/api/v1',
  timeout: 10000,
});

// Request Interceptor
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => response.data, // Return just data
  async (error) => {
    const originalRequest = error.config;

    // Handle token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        const { data } = await axios.post(
          `${apiClient.defaults.baseURL}/auth/refresh`,
          { refreshToken }
        );
        
        await AsyncStorage.setItem('authToken', data.token);
        originalRequest.headers.Authorization = `Bearer ${data.token}`;
        
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Logout user
        await AsyncStorage.multiRemove(['authToken', 'refreshToken']);
        // Redirect to login
        return Promise.reject(refreshError);
      }
    }

    // Handle error responses
    const message = error.response?.data?.message || error.message;
    throw new Error(message);
  }
);

export default apiClient;
```

### Web (React with Axios)

```typescript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1',
  timeout: 10000,
});

// Request Interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

---

## 📝 SERVICE LAYER EXAMPLES

### Authentication Service

```typescript
import apiClient from './apiClient';

export const authService = {
  register: async (email: string, password: string, name: string) => {
    return apiClient.post('/auth/register', { email, password, name });
  },

  verifyOTP: async (email: string, otp: string) => {
    return apiClient.post('/auth/verify-otp', { email, otp });
  },

  login: async (email: string, password: string) => {
    return apiClient.post('/auth/login', { email, password });
  },

  socialLogin: async (provider: string, idToken: string) => {
    return apiClient.post('/auth/social-login', { provider, idToken });
  },

  getProfile: async () => {
    return apiClient.get('/auth/profile');
  },

  updateProfile: async (updates: any) => {
    return apiClient.put('/auth/profile', updates);
  },
};
```

### Reels Service

```typescript
export const reelsService = {
  getFeed: async (page = 1, limit = 20) => {
    return apiClient.get('/reels', { params: { page, limit } });
  },

  getReel: async (reelId: string) => {
    return apiClient.get(`/reels/${reelId}`);
  },

  publishReel: async (reelData: any) => {
    return apiClient.post('/reels/publish', reelData);
  },

  saveDraft: async (reelData: any) => {
    return apiClient.post('/reels/draft', reelData);
  },

  getDrafts: async () => {
    return apiClient.get('/reels/draft');
  },

  likeReel: async (reelId: string) => {
    return apiClient.post(`/reels/${reelId}/action`, { action: 'like' });
  },

  addComment: async (reelId: string, text: string) => {
    return apiClient.post(`/reels/${reelId}/comments`, { text });
  },

  sendTip: async (reelId: string, amount: number) => {
    return apiClient.post(`/reels/${reelId}/tip`, { amount });
  },

  getUploadURL: async (filename: string) => {
    return apiClient.post('/reels/upload-url', { filename });
  },

  autoCaption: async (reelId: string) => {
    return apiClient.post(`/reels/${reelId}/auto-caption`);
  },
};
```

### Chat Service

```typescript
import io from 'socket.io-client';

export class ChatService {
  private socket: any;

  connect(token: string) {
    this.socket = io(process.env.REACT_APP_API_URL, {
      auth: { token }
    });
  }

  joinChat(chatId: string) {
    this.socket.emit('join:chat', { chatId });
  }

  sendMessage(chatId: string, text: string, media: any[] = []) {
    this.socket.emit('message:send', { chatId, text, media });
  }

  onNewMessage(callback: (msg: any) => void) {
    this.socket.on('message:new', callback);
  }

  onReaction(callback: (data: any) => void) {
    this.socket.on('message:react', callback);
  }

  getHistory(chatId: string, limit = 50) {
    return apiClient.get('/chat/chatDetails', { params: { chatId, limit } });
  }

  getChats() {
    return apiClient.get('/chat/chatlist');
  }

  markAsRead(chatId: string) {
    return apiClient.put('/chat/read', { chatId });
  }

  disconnect() {
    this.socket?.disconnect();
  }
}
```

### Video Editor Service

```typescript
export const videoEditorService = {
  createSession: async (videoUri: string, duration: number) => {
    return apiClient.post('/video-editor/session', { videoUri, duration });
  },

  trim: async (sessionId: string, startTime: number, endTime: number) => {
    return apiClient.post(`/video-editor/${sessionId}/trim`, {
      startTime,
      endTime,
    });
  },

  applyFilter: async (sessionId: string, filter: any) => {
    return apiClient.post(`/video-editor/${sessionId}/filter`, filter);
  },

  addText: async (sessionId: string, text: any) => {
    return apiClient.post(`/video-editor/${sessionId}/text`, text);
  },

  mergeAudio: async (sessionId: string, audio: any) => {
    return apiClient.post(`/video-editor/${sessionId}/music`, audio);
  },

  export: async (sessionId: string, options: any) => {
    return apiClient.post(`/video-editor/${sessionId}/export`, options);
  },

  getExportStatus: async (sessionId: string) => {
    return apiClient.get(`/video-editor/${sessionId}/export-status`);
  },
};
```

---

## 🎨 REDUX STATE MANAGEMENT EXAMPLE

```typescript
// authSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../services/authService';

export const login = createAsyncThunk('auth/login', async (credentials: any) => {
  const response = await authService.login(credentials.email, credentials.password);
  return response.data;
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default authSlice.reducer;
```

---

## 🚀 OPTIMIZATION TIPS

### 1. Image Optimization
```typescript
// Compress before upload
import ImageResizer from 'react-native-image-resizer';

const compressImage = async (imagePath: string) => {
  return ImageResizer.createResizedImage(
    imagePath,
    1080, // width
    1080, // height
    'JPEG',
    80, // quality
    0, // rotation
    null, // outputPath
    true, // keepAspectRatio
  );
};
```

### 2. Video Upload Progress
```typescript
const uploadVideoToS3 = async (file: File, signedUrl: string) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    
    xhr.upload.onprogress = (event) => {
      const percentComplete = (event.loaded / event.total) * 100;
      console.log(`Upload progress: ${percentComplete}%`);
    };
    
    xhr.onload = () => resolve(xhr.responseText);
    xhr.onerror = () => reject(xhr.error);
    
    xhr.open('PUT', signedUrl, true);
    xhr.send(file);
  });
};
```

### 3. Pagination with Infinite Scroll
```typescript
const InfiniteScrollReels = () => {
  const [reels, setReels] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const loadMore = async () => {
    setLoading(true);
    const newReels = await reelsService.getFeed(page);
    setReels([...reels, ...newReels.items]);
    setPage(page + 1);
    setLoading(false);
  };

  return (
    <FlatList
      data={reels}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
    />
  );
};
```

### 4. Caching Strategies
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

const getCachedData = async (key: string) => {
  const cached = await AsyncStorage.getItem(key);
  if (!cached) return null;
  
  const { data, timestamp } = JSON.parse(cached);
  const isExpired = Date.now() - timestamp > 5 * 60 * 1000; // 5 min
  
  return isExpired ? null : data;
};

const setCachedData = async (key: string, data: any) => {
  await AsyncStorage.setItem(key, JSON.stringify({
    data,
    timestamp: Date.now()
  }));
};
```

---

## ⚠️ ERROR HANDLING

```typescript
const handleAPIError = (error: any) => {
  if (error.code === 'NETWORK_ERROR') {
    return 'Network error. Please check your connection.';
  }

  if (error.response?.status === 400) {
    return error.response.data.message || 'Invalid request';
  }

  if (error.response?.status === 401) {
    return 'Session expired. Please login again.';
  }

  if (error.response?.status === 403) {
    return 'You don\'t have permission for this action.';
  }

  if (error.response?.status === 429) {
    return 'Too many requests. Please try again later.';
  }

  if (error.response?.status >= 500) {
    return 'Server error. Please try again later.';
  }

  return error.message || 'Something went wrong';
};
```

---

## 📦 TESTING ENDPOINTS

### Using Postman
1. Import collection: `Gully Fame API.postman_collection (1).json`
2. Set environment variables (BASE_URL, tokens)
3. Test endpoints before integration

### Using cURL
```bash
# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"password"}'

# Get Reels
curl -X GET http://localhost:5000/api/v1/reels?page=1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🎓 BEST PRACTICES

1. **Always use token refresh logic**
2. **Implement proper error boundaries**
3. **Cache user data for offline use**
4. **Use pagination for lists**
5. **Handle network timeouts gracefully**
6. **Compress media before upload**
7. **Use Socket.io for real-time features**
8. **Monitor API response times**
9. **Log errors for debugging**
10. **Test with real device/network**

---

**Ready to integrate? Start with auth, then reels, then everything else! 🚀**

