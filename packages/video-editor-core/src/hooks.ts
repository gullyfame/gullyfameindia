/**
 * Unified Hooks for Video Editor
 * 
 * All custom hooks needed for video editing are here.
 * Apps can import and use them consistently.
 */

import { useState, useCallback } from 'react';
import type { CameraClip, AudioTrack, VideoEditorState } from './types';

/**
 * Hook: useVideoEditor
 * Main state management for video editor
 */
export function useVideoEditor() {
  const [state, setState] = useState<VideoEditorState>({
    clips: [],
    isPlaying: false,
    currentTime: 0,
    audioTracks: [],
  });

  const addClip = useCallback((clip: CameraClip) => {
    setState((prev) => ({
      ...prev,
      clips: [...prev.clips, clip],
    }));
  }, []);

  const removeClip = useCallback((clipId: string) => {
    setState((prev) => ({
      ...prev,
      clips: prev.clips.filter((c) => c.id !== clipId),
    }));
  }, []);

  const updateClip = useCallback((clipId: string, updates: Partial<CameraClip>) => {
    setState((prev) => ({
      ...prev,
      clips: prev.clips.map((c) =>
        c.id === clipId ? { ...c, ...updates } : c
      ),
    }));
  }, []);

  const setCurrentTime = useCallback((time: number) => {
    setState((prev) => ({
      ...prev,
      currentTime: time,
    }));
  }, []);

  const togglePlayPause = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isPlaying: !prev.isPlaying,
    }));
  }, []);

  return {
    state,
    addClip,
    removeClip,
    updateClip,
    setCurrentTime,
    togglePlayPause,
  };
}

/**
 * Hook: useAudioTracks
 * Manage audio tracks separately
 */
export function useAudioTracks() {
  const [tracks, setTracks] = useState<AudioTrack[]>([]);

  const addTrack = useCallback((track: AudioTrack) => {
    setTracks((prev) => [...prev, track]);
  }, []);

  const removeTrack = useCallback((trackId: string) => {
    setTracks((prev) => prev.filter((t) => t.id !== trackId));
  }, []);

  const updateTrack = useCallback(
    (trackId: string, updates: Partial<AudioTrack>) => {
      setTracks((prev) =>
        prev.map((t) =>
          t.id === trackId ? { ...t, ...updates } : t
        )
      );
    },
    []
  );

  const muteTrack = useCallback((trackId: string) => {
    updateTrack(trackId, { isMuted: true });
  }, [updateTrack]);

  const unmuteTrack = useCallback((trackId: string) => {
    updateTrack(trackId, { isMuted: false });
  }, [updateTrack]);

  return {
    tracks,
    addTrack,
    removeTrack,
    updateTrack,
    muteTrack,
    unmuteTrack,
  };
}

/**
 * Hook: useVideoExport
 * Handle video export logic
 */
export function useVideoExport() {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportError, setExportError] = useState<string | null>(null);

  const exportVideo = useCallback(
    async (clips: CameraClip[], audioTracks: AudioTrack[], outputPath: string) => {
      setIsExporting(true);
      setExportProgress(0);
      setExportError(null);

      try {
        // Simulate export process
        for (let i = 0; i <= 100; i += 10) {
          setExportProgress(i);
          await new Promise((resolve) => setTimeout(resolve, 300));
        }

        setIsExporting(false);
        return outputPath;
      } catch (error) {
        setExportError(error instanceof Error ? error.message : 'Export failed');
        setIsExporting(false);
        throw error;
      }
    },
    []
  );

  return {
    isExporting,
    exportProgress,
    exportError,
    exportVideo,
  };
}
