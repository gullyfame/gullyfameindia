/**
 * Unified Video Editor - Core Package
 * 
 * This is the single source of truth for video editing across all GFM apps.
 * 
 * Usage:
 * 
 * // In standalone app
 * import { useVideoEditor } from '@gfm/video-editor-core';
 * <VideoEditor mode="standalone" />
 * 
 * // In mobile app
 * import { useVideoEditor } from '@gfm/video-editor-core';
 * <VideoEditor mode="mobile" />
 * 
 * // In any app - import specific utilities
 * import { getEditorConfig, isButtonEnabled } from '@gfm/video-editor-core';
 */

export * from './config';
export * from './types';
export * from './hooks';
export * from './utils';

// Re-export main types for convenience
export type { EditorMode, EditorConfig, ButtonType } from './config';
export { 
  STANDALONE_CONFIG, 
  MOBILE_CONFIG, 
  MINIMAL_CONFIG,
  getEditorConfig,
  isButtonEnabled,
  getButtonOrder,
  getUIStyles,
} from './config';
