/**
 * Utility Functions for Video Editor
 * 
 * Common utility functions shared across all video editor implementations.
 */

import type { CameraClip } from './types';

/**
 * Format time for display
 * @param seconds - Time in seconds
 * @returns Formatted string like "0:00:00"
 */
export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${minutes}:${String(secs).padStart(2, '0')}`;
}

/**
 * Calculate total video duration
 */
export function calculateTotalDuration(clips: CameraClip[]): number {
  return clips.reduce((total, clip) => total + (clip.duration || 0), 0);
}

/**
 * Generate unique ID
 */
export function generateId(prefix = 'clip'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Validate clip data
 */
export function isValidClip(clip: any): clip is CameraClip {
  return (
    clip &&
    typeof clip.id === 'string' &&
    typeof clip.uri === 'string' &&
    (clip.type === 'photo' || clip.type === 'video') &&
    typeof clip.duration === 'number'
  );
}

/**
 * Merge clip arrays without duplicates
 */
export function mergeClips(clips1: CameraClip[], clips2: CameraClip[]): CameraClip[] {
  const seen = new Set(clips1.map((c) => c.id));
  return [
    ...clips1,
    ...clips2.filter((c) => !seen.has(c.id)),
  ];
}

/**
 * Sort clips by timeline position
 */
export function sortClipsByTimeline(clips: CameraClip[]): CameraClip[] {
  return [...clips].sort((a, b) => (a.timelineStart || 0) - (b.timelineStart || 0));
}

/**
 * Find clip at specific time
 */
export function findClipAtTime(clips: CameraClip[], time: number): CameraClip | undefined {
  return clips.find(
    (clip) =>
      (clip.timelineStart || 0) <= time &&
      time <= (clip.timelineEnd || clip.timelineStart || 0 + clip.duration)
  );
}

/**
 * Calculate clip timeline positions
 */
export function calculateTimelinePositions(
  clips: CameraClip[]
): CameraClip[] {
  let currentTime = 0;

  return clips.map((clip) => {
    const start = currentTime;
    const end = currentTime + clip.duration;
    currentTime = end;

    return {
      ...clip,
      timelineStart: start,
      timelineEnd: end,
    };
  });
}

/**
 * Validate before export
 */
export function validateForExport(clips: CameraClip[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (clips.length === 0) {
    errors.push('No clips to export');
  }

  clips.forEach((clip, index) => {
    if (!clip.uri) {
      errors.push(`Clip ${index + 1}: Missing video URI`);
    }
    if (clip.duration <= 0) {
      errors.push(`Clip ${index + 1}: Invalid duration`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}
