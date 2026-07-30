/**
 * Video Editor Configuration
 * 
 * This file defines the button layouts for different editor modes.
 * Allows both standalone and mobile apps to use the same code
 * with different UI presentations.
 */

export type EditorMode = 'standalone' | 'mobile' | 'minimal';

export interface EditorConfig {
  mode: EditorMode;
  enabledButtons: ButtonType[];
  buttonOrder: ButtonType[];
  previewStyle: 'full' | 'compact';
  timelineStyle: 'advanced' | 'simple';
  headerStyle: 'standalone' | 'integrated';
  colorScheme: 'dark' | 'light';
  playButtonColor: string;
}

export type ButtonType = 
  | 'music'
  | 'text'
  | 'voice'
  | 'links'
  | 'captions'
  | 'adjust'
  | 'filter'
  | 'overlay'
  | 'soundfx'
  | 'cutout'
  | 'sticker'
  | 'paste'
  | 'transition'
  | 'script'
  | 'tts'
  | 'effects'
  | 'audio';

/**
 * STANDALONE MODE (Port 8083)
 * Full-featured video editor with all tools
 * Best for: Power users, content creators, feature-complete editing
 */
export const STANDALONE_CONFIG: EditorConfig = {
  mode: 'standalone',
  enabledButtons: [
    'music',
    'text',
    'voice',
    'links',
    'captions',
    'adjust',
    'filter',
    'overlay',
    'soundfx',
    'cutout',
    'sticker',
    'paste',
    'transition',
  ],
  buttonOrder: [
    'music',
    'text',
    'voice',
    'links',
    'captions',
    'adjust',
    'filter',
    'overlay',
  ],
  previewStyle: 'full',
  timelineStyle: 'advanced',
  headerStyle: 'standalone',
  colorScheme: 'dark',
  playButtonColor: '#ffffff',
};

/**
 * MOBILE MODE (Port 8084)
 * Simplified video editor optimized for mobile UX
 * Best for: Quick edits, social media posts, limited screen space
 */
export const MOBILE_CONFIG: EditorConfig = {
  mode: 'mobile',
  enabledButtons: [
    'filter',
    'overlay',
    'text',
    'sticker',
    'music',
    'voice',
    'captions',
    'adjust',
  ],
  buttonOrder: [
    'filter',
    'overlay',
    'text',
    'sticker',
    'music',
    'voice',
    'captions',
    'adjust',
  ],
  previewStyle: 'compact',
  timelineStyle: 'simple',
  headerStyle: 'integrated',
  colorScheme: 'dark',
  playButtonColor: '#f59e0b', // Orange
};

/**
 * MINIMAL MODE
 * Bare essentials for quick edits
 * Best for: In-app quick edits, embedded editors
 */
export const MINIMAL_CONFIG: EditorConfig = {
  mode: 'minimal',
  enabledButtons: [
    'filter',
    'text',
    'music',
    'voice',
  ],
  buttonOrder: [
    'filter',
    'text',
    'music',
    'voice',
  ],
  previewStyle: 'compact',
  timelineStyle: 'simple',
  headerStyle: 'integrated',
  colorScheme: 'dark',
  playButtonColor: '#3b82f6',
};

/**
 * Get config by mode
 */
export function getEditorConfig(mode: EditorMode): EditorConfig {
  switch (mode) {
    case 'standalone':
      return STANDALONE_CONFIG;
    case 'mobile':
      return MOBILE_CONFIG;
    case 'minimal':
      return MINIMAL_CONFIG;
    default:
      return MOBILE_CONFIG;
  }
}

/**
 * Check if button should be enabled
 */
export function isButtonEnabled(button: ButtonType, config: EditorConfig): boolean {
  return config.enabledButtons.includes(button);
}

/**
 * Get button display order
 */
export function getButtonOrder(config: EditorConfig): ButtonType[] {
  return config.buttonOrder.filter((btn) =>
    config.enabledButtons.includes(btn)
  );
}

/**
 * Get UI style settings
 */
export function getUIStyles(config: EditorConfig) {
  return {
    playButtonColor: config.playButtonColor,
    previewHeight: config.previewStyle === 'full' ? '60%' : '50%',
    timelineHeight: config.timelineStyle === 'advanced' ? '30%' : '25%',
    showAdvancedControls: config.mode === 'standalone',
    compactMode: config.previewStyle === 'compact',
  };
}
