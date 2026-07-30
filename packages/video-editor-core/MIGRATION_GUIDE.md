# Migration Guide - Using Unified Video Editor

## Problem Being Solved

❌ **Before**: Two separate video editor implementations with duplicate code
- `/apps/videoeditor/camera-module/`
- `/apps/gully-fame-mobile/src/modules/video-editor/camera-module/`

✅ **After**: One shared package with configuration system
- `/packages/video-editor-core/`

Both apps import from the same package and use different configurations.

---

## Migration Steps

### Step 1: Update Root package.json

Add the workspace path:

```json
{
  "workspaces": [
    "apps/*",
    "packages/*"
  ]
}
```

### Step 2: Install Dependencies in Shared Package

```bash
cd packages/video-editor-core
npm install
```

### Step 3: Update apps/videoeditor/package.json

Add dependency:
```json
{
  "dependencies": {
    "@gfm/video-editor-core": "*"
  }
}
```

### Step 4: Update apps/videoeditor/camera-module/index.tsx

**Before:**
```typescript
import HomeScreen from './screens/HomeScreen';
import CameraScreen from './screens/CameraScreen';
import PreviewScreen from './screens/PreviewScreen';
```

**After:**
```typescript
import { useVideoEditor, STANDALONE_CONFIG } from '@gfm/video-editor-core';
import HomeScreen from './screens/HomeScreen';
import CameraScreen from './screens/CameraScreen';
import PreviewScreen from './screens/PreviewScreen';

export default function CameraModule() {
  const { state, addClip, updateClip } = useVideoEditor();
  const config = STANDALONE_CONFIG;

  return (
    // Pass config and state to screens
    ...
  );
}
```

### Step 5: Update apps/gully-fame-mobile/src/modules/video-editor/index.tsx

**Before:**
```typescript
import HomeScreen from './camera-module/screens/HomeScreen';
import CameraScreen from './camera-module/screens/CameraScreen';
```

**After:**
```typescript
import { useVideoEditor, MOBILE_CONFIG } from '@gfm/video-editor-core';
import HomeScreen from './camera-module/screens/HomeScreen';
import CameraScreen from './camera-module/screens/CameraScreen';

export default function VideoEditorModule() {
  const { state, addClip, updateClip } = useVideoEditor();
  const config = MOBILE_CONFIG;

  return (
    // Pass config and state to screens
    ...
  );
}
```

### Step 6: Update Types

In both apps, replace local type imports:

**Before:**
```typescript
import type { CameraClip } from '../types/camera.types';
```

**After:**
```typescript
import type { CameraClip } from '@gfm/video-editor-core';
```

### Step 7: Update Utilities

Replace utility function imports:

**Before:**
```typescript
import { formatTime } from '../utils/timelineHelpers';
```

**After:**
```typescript
import { formatTime } from '@gfm/video-editor-core';
```

### Step 8: Update Components - PreviewActionButtons

The button order should now be dynamic based on config:

```typescript
import { getButtonOrder, isButtonEnabled } from '@gfm/video-editor-core';
import type { EditorConfig } from '@gfm/video-editor-core';

interface PreviewActionButtonsProps {
  config: EditorConfig;
  onFilter?: () => void;
  onText?: () => void;
  onMusic?: () => void;
  // ... other handlers
}

export function PreviewActionButtons({ config, onFilter, onText, onMusic }: PreviewActionButtonsProps) {
  const buttons = getButtonOrder(config);

  return (
    <ScrollView horizontal>
      {buttons.map((buttonType) => {
        if (buttonType === 'filter' && isButtonEnabled('filter', config)) {
          return <FilterButton key="filter" onPress={onFilter} />;
        }
        if (buttonType === 'text' && isButtonEnabled('text', config)) {
          return <TextButton key="text" onPress={onText} />;
        }
        if (buttonType === 'music' && isButtonEnabled('music', config)) {
          return <MusicButton key="music" onPress={onMusic} />;
        }
        // ... handle other buttons
      })}
    </ScrollView>
  );
}
```

### Step 9: Keep Camera Module Components

Don't delete the camera-module components yet! Keep them in both apps:
- `/apps/videoeditor/camera-module/components/` (can stay for now)
- `/apps/gully-fame-mobile/src/modules/video-editor/camera-module/components/` (can stay for now)

These will eventually be moved to the shared package, but for now they support the UI rendering.

### Step 10: Test Both Apps

```bash
# Terminal 1: Standalone
cd apps/videoeditor
npm start

# Terminal 2: Mobile
cd apps/gully-fame-mobile
npm start
```

Both should work with the shared configuration!

---

## Configuration Comparison

### Standalone App (Port 8083)
```typescript
import { STANDALONE_CONFIG } from '@gfm/video-editor-core';

// Enables all 13 buttons
// Full preview
// Advanced timeline
```

### Mobile App (Port 8084)
```typescript
import { MOBILE_CONFIG } from '@gfm/video-editor-core';

// Enables 8 buttons only
// Compact preview
// Simple timeline
```

---

## Key Changes

| Aspect | Before | After |
|--------|--------|-------|
| Config | Hardcoded in each app | Dynamic from `@gfm/video-editor-core` |
| Types | Duplicated in each app | Shared from core package |
| Utilities | Duplicated in each app | Imported from core package |
| Hooks | Hardcoded in each app | Provided by core package |
| Button Order | Different in each app | Defined in config, auto-ordered |

---

## Benefits After Migration

✅ Update types once, applies everywhere
✅ New features added to core package instantly available in all apps
✅ No more maintaining duplicate code
✅ Consistent video editor experience
✅ Easier to scale to new platforms (tablet, web)
✅ Single source of truth for video editing logic

---

## What Gets Shared

### Shared
- ✅ Configuration system (config.ts)
- ✅ Type definitions (types.ts)
- ✅ Custom hooks (hooks.ts)
- ✅ Utility functions (utils.ts)

### Still Separate (for now)
- Components (PreviewEditor, ActionButtons, etc.)
- Screens (HomeScreen, CameraScreen, PreviewScreen)
- Styles and themes

Eventually, these will also move to the shared package, but this phased approach lets us migrate gradually.

---

## Troubleshooting

### Issue: Package not found
**Solution**: Run `npm install` in root to link workspace package
```bash
cd /Users/dhruvkathuria/Project/gfm-mobile-source-main
npm install
```

### Issue: Type conflicts
**Solution**: Delete the old type files once migration is complete
```bash
rm apps/videoeditor/camera-module/types/camera.types.ts
rm apps/gully-fame-mobile/src/modules/video-editor/camera-module/types/camera.types.ts
```

### Issue: Different buttons showing
**Solution**: Check that the config is passed correctly
```typescript
// Make sure you're using:
import { MOBILE_CONFIG } from '@gfm/video-editor-core';  // NOT STANDALONE
```

---

## Next Phase: Full Component Migration

Once this is working, we can move components too:

```
/packages/video-editor-core/
├── src/
│   ├── components/           ← Components move here
│   │   ├── ModernPreviewEditor.tsx
│   │   ├── PreviewActionButtons.tsx
│   │   └── buttons/
│   ├── screens/              ← Screens move here
│   │   ├── HomeScreen.tsx
│   │   ├── CameraScreen.tsx
│   │   └── PreviewScreen.tsx
│   ├── config.ts
│   ├── types.ts
│   ├── hooks.ts
│   └── utils.ts
└── package.json
```

Then both apps will just import from the shared package with minimal customization.

---

**Migration Status**: ✅ Ready to implement
