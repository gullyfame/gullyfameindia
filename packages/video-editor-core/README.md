# @gfm/video-editor-core

**Unified Video Editor Core Package** - Single source of truth for video editing across all GFM applications.

## 🎯 Purpose

This package consolidates the video editor logic that was previously duplicated across:
- `/apps/videoeditor/` (standalone app)
- `/apps/gully-fame-mobile/src/modules/video-editor/` (mobile integration)

Instead of maintaining two separate implementations, we now have:
- ✅ **One configuration system** (`config.ts`)
- ✅ **One type definition** (`types.ts`)
- ✅ **Shared hooks** (`hooks.ts`)
- ✅ **Utility functions** (`utils.ts`)

## 📦 Contents

```
src/
├── config.ts      # Editor configurations (Standalone, Mobile, Minimal)
├── types.ts       # Unified type definitions
├── hooks.ts       # Custom React hooks
├── utils.ts       # Utility functions
└── index.ts       # Main entry point
```

## 🚀 Quick Start

### Import and Use in Any App

```typescript
// In standalone video editor app
import { STANDALONE_CONFIG, useVideoEditor } from '@gfm/video-editor-core';

export function VideoEditor() {
  const { state, addClip, updateClip } = useVideoEditor();
  
  return (
    <VideoEditorScreen
      config={STANDALONE_CONFIG}
      state={state}
      onAddClip={addClip}
      onUpdateClip={updateClip}
    />
  );
}
```

```typescript
// In mobile app (Gully Fame)
import { MOBILE_CONFIG, useVideoEditor } from '@gfm/video-editor-core';

export function VideoEditorModule() {
  const { state, addClip, updateClip } = useVideoEditor();
  
  return (
    <VideoEditorScreen
      config={MOBILE_CONFIG}
      state={state}
      onAddClip={addClip}
      onUpdateClip={updateClip}
    />
  );
}
```

## 🎨 Editor Modes

### Standalone Mode
- **Best for**: Power users, full-featured editing
- **Buttons**: 13 total (Music, Text, Voice, Links, Captions, Adjust, Filter, Overlay, SoundFX, Cutout, Sticker, Paste, Transition)
- **Preview**: Full-size
- **Timeline**: Advanced with speed controls
- **Header**: Standalone project header

```typescript
import { STANDALONE_CONFIG } from '@gfm/video-editor-core';
```

### Mobile Mode
- **Best for**: Quick edits, social media posts
- **Buttons**: 8 total (Filter, Overlay, Text, Sticker, Music, Voice, Captions, Adjust)
- **Preview**: Compact
- **Timeline**: Simple
- **Header**: Integrated with back button

```typescript
import { MOBILE_CONFIG } from '@gfm/video-editor-core';
```

### Minimal Mode
- **Best for**: In-app embedded editors
- **Buttons**: 4 total (Filter, Text, Music, Voice)
- **Preview**: Compact
- **Timeline**: Simple
- **Header**: Minimal

```typescript
import { MINIMAL_CONFIG } from '@gfm/video-editor-core';
```

## 🎣 Hooks

### useVideoEditor()
Main hook for video editor state management.

```typescript
const {
  state,           // { clips, currentClipId, isPlaying, currentTime, audioTracks }
  addClip,         // (clip: CameraClip) => void
  removeClip,      // (clipId: string) => void
  updateClip,      // (clipId: string, updates: Partial<CameraClip>) => void
  setCurrentTime,  // (time: number) => void
  togglePlayPause, // () => void
} = useVideoEditor();
```

### useAudioTracks()
Manage audio tracks (music, voiceover, TTS, sound effects).

```typescript
const {
  tracks,      // AudioTrack[]
  addTrack,    // (track: AudioTrack) => void
  removeTrack, // (trackId: string) => void
  updateTrack, // (trackId: string, updates: Partial<AudioTrack>) => void
  muteTrack,   // (trackId: string) => void
  unmuteTrack, // (trackId: string) => void
} = useAudioTracks();
```

### useVideoExport()
Handle video export with progress tracking.

```typescript
const {
  isExporting,    // boolean
  exportProgress, // 0-100
  exportError,    // string | null
  exportVideo,    // async (clips, audioTracks, outputPath) => Promise<string>
} = useVideoExport();
```

## 🛠️ Utilities

### Time Formatting
```typescript
import { formatTime } from '@gfm/video-editor-core';

formatTime(65);  // "1:05"
formatTime(3661); // "1:01:01"
```

### Clip Management
```typescript
import {
  calculateTotalDuration,
  sortClipsByTimeline,
  findClipAtTime,
  calculateTimelinePositions,
  validateForExport,
} from '@gfm/video-editor-core';

const duration = calculateTotalDuration(clips); // Total video length
const sorted = sortClipsByTimeline(clips);      // Sorted by timeline
const clip = findClipAtTime(clips, 2.5);        // Find at 2.5 seconds
const positioned = calculateTimelinePositions(clips); // Calculate positions
const validation = validateForExport(clips);    // Validate before export
```

## 📋 Type System

All types are unified in one place:

```typescript
import type {
  CameraClip,
  TextOverlay,
  AudioTrack,
  SpeedSegment,
  FilterPreset,
  VideoEditorState,
} from '@gfm/video-editor-core';
```

## 🔧 Configuration

### Get Config by Mode
```typescript
import { getEditorConfig } from '@gfm/video-editor-core';

const config = getEditorConfig('mobile');      // MOBILE_CONFIG
const config = getEditorConfig('standalone');  // STANDALONE_CONFIG
const config = getEditorConfig('minimal');     // MINIMAL_CONFIG
```

### Check Button Availability
```typescript
import { isButtonEnabled } from '@gfm/video-editor-core';

const enabled = isButtonEnabled('voice', config); // true/false
```

### Get Button Order
```typescript
import { getButtonOrder } from '@gfm/video-editor-core';

const buttons = getButtonOrder(config); // ['filter', 'overlay', ...]
```

## 📱 Integration Steps

### 1. Install in Package.json
```json
{
  "dependencies": {
    "@gfm/video-editor-core": "^1.0.0"
  }
}
```

### 2. Import in Your App
```typescript
import {
  getEditorConfig,
  useVideoEditor,
  useAudioTracks,
  STANDALONE_CONFIG,
  MOBILE_CONFIG,
} from '@gfm/video-editor-core';
```

### 3. Use in Components
```typescript
export function MyVideoEditor() {
  const config = getEditorConfig('mobile');
  const { state, addClip } = useVideoEditor();
  const { tracks, addTrack } = useAudioTracks();

  return (
    <VideoEditorScreen
      config={config}
      clips={state.clips}
      audioTracks={tracks}
      onAddClip={addClip}
      onAddTrack={addTrack}
    />
  );
}
```

## ✅ Benefits

- ✅ **Single Source of Truth** - One config system for all apps
- ✅ **Type Safety** - Unified type definitions
- ✅ **No Duplication** - Shared code, not copied
- ✅ **Easier Maintenance** - Update once, applies everywhere
- ✅ **Consistent UX** - Same video editor logic across apps
- ✅ **Scalable** - Add new modes easily (tablet, web, etc.)
- ✅ **Feature Parity** - All apps get new features automatically

## 🚀 What's Next

1. Move actual camera-module components here (ModernPreviewEditor, PreviewActionButtons, etc.)
2. Create component library with theme support
3. Add export pipeline with FFmpeg integration
4. Add plugin system for custom effects
5. Add analytics and performance monitoring

## 📝 Version History

- **1.0.0** (2026-07-01) - Initial release with config system, types, and hooks
