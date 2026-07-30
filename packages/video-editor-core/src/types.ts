/**
 * Unified Type Definitions for Video Editor
 */

export type ClipType = 'photo' | 'video';
export type ClipSource = 'camera' | 'gallery';
export type CameraMode = 'photo' | 'video';
export type FlashMode = 'on' | 'off';
export type Resolution = 'HD' | '4K';

export interface CameraClip {
  id: string;
  uri: string;
  type: ClipType;
  source: ClipSource;
  duration: number;
  speed?: number;
  filterPreset?: string;
  textOverlays?: TextOverlay[];
  audioTracks?: AudioTrack[];
  trimStart?: number;
  trimEnd?: number;
  timelineStart?: number;
  timelineEnd?: number;
  thumbnailUri?: string;
}

export interface TextOverlay {
  id: string;
  text: string;
  position: { x: number; y: number };
  fontSize: number;
  color: string;
  fontWeight: 'normal' | 'bold';
  opacity: number;
  rotation: number;
  alignment: 'left' | 'center' | 'right';
  startTime?: number;
  endTime?: number;
}

export interface AudioTrack {
  id: string;
  uri: string;
  type: 'music' | 'voiceover' | 'tts' | 'sound_effect';
  startTime: number;
  endTime: number;
  duration: number;
  volume: number;
  isMuted?: boolean;
}

export interface SpeedSegment {
  startTime: number;
  endTime: number;
  speed: number;
}

export interface FilterPreset {
  id: string;
  name: string;
  params: Record<string, number>;
}

export interface VideoEditorState {
  clips: CameraClip[];
  currentClipId?: string;
  isPlaying: boolean;
  currentTime: number;
  selectedFilter?: string;
  audioTracks: AudioTrack[];
}
