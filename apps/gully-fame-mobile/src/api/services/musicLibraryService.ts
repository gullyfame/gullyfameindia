/**
 * Music Library Service
 * Connects the Video Editor's music picker to the Gully Fame backend.
 *
 * Postman collection endpoints implemented:
 *  - Public  : GET  /public/audio?sort=trending|newest|popular  → listAudio()
 *  - User    : POST /user/audio/:id/save                        → toggleSaveAudio()
 *  - User    : GET  /user/audio/saved                           → getSavedAudio()
 *  - Helper  : buildReelMusicPayload()  ← converts MusicTrack → reel publish shape
 */

import apiClient from "../axios";
import { ApiResponse } from "../types";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export type AudioSortOption = "trending" | "newest" | "popular";

/** A single audio/music track as returned by the backend */
export interface MusicTrack {
  _id: string;
  /** Track title shown in the music library picker */
  title: string;
  /** Artist / creator name */
  artist?: string;
  /** Duration in seconds */
  duration: number;
  /** Streamable / playable URL */
  audioUrl: string;
  /** Optional waveform / cover art */
  coverImage?: string;
  /** How many reels use this track */
  usageCount?: number;
  /** Whether the current logged-in user has saved this track */
  isSaved?: boolean;
  isActive?: boolean;
  createdAt?: string;
}

/** Paginated list response for audio tracks */
export interface AudioListData {
  page: number;
  limit: number;
  total: number;
  tracks: MusicTrack[];
}

/** Minimal music object embedded inside a reel publish payload */
export interface ReelMusicPayload {
  id: string;
  name: string;
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

/** Normalise a raw API audio object → MusicTrack */
function normaliseTrack(raw: any): MusicTrack {
  return {
    _id: raw._id ?? raw.id ?? "",
    title: raw.title ?? raw.name ?? "Unknown Track",
    artist: raw.artist ?? raw.artistName ?? undefined,
    duration: raw.duration ?? 0,
    audioUrl: raw.audioUrl ?? raw.audio_url ?? raw.url ?? "",
    coverImage: raw.coverImage ?? raw.cover_image ?? raw.thumbnail ?? undefined,
    usageCount: raw.usageCount ?? raw.usage_count ?? undefined,
    isSaved: raw.isSaved ?? raw.is_saved ?? false,
    isActive: raw.isActive ?? true,
    createdAt: raw.createdAt ?? undefined,
  };
}

// ─────────────────────────────────────────────
// Public API – GET /public/audio
// ─────────────────────────────────────────────

/**
 * Fetch the public audio / music library.
 * Used by the Music Picker inside the Video Editor.
 *
 * @param sort    Sort order  – "trending" | "newest" | "popular"  (default: "trending")
 * @param page    Page number (default: 1)
 * @param limit   Items per page (default: 20)
 * @param search  Optional search keyword to filter tracks by title / artist
 */
export async function listAudio(
  sort: AudioSortOption = "trending",
  page = 1,
  limit = 20,
  search?: string
): Promise<ApiResponse<AudioListData>> {
  try {
    console.log("[musicLibraryService] Fetching audio list:", { sort, page, limit, search });

    const params: Record<string, any> = { sort, page, limit };
    if (search && search.trim()) params.search = search.trim();

    const response = await apiClient.get<any>("public/audio", { params });
    const responseData = response.data as any;

    if (responseData.code === 1) {
      const raw = responseData.data;

      // Backend may return array directly OR wrapped in an object
      const rawTracks: any[] = Array.isArray(raw)
        ? raw
        : raw?.tracks ?? raw?.audio ?? raw?.data ?? [];

      const tracks: MusicTrack[] = rawTracks.map(normaliseTrack);

      const listData: AudioListData = {
        page: raw?.page ?? page,
        limit: raw?.limit ?? limit,
        total: raw?.total ?? tracks.length,
        tracks,
      };

      console.log(`[musicLibraryService] Loaded ${tracks.length} tracks`);

      return {
        success: true,
        data: listData,
        message: responseData.message ?? "Audio list fetched successfully",
      };
    }

    return {
      success: false,
      message: responseData.message ?? "Failed to fetch audio list",
      error: "API returned unsuccessful response",
      data: undefined,
    };
  } catch (error: any) {
    console.error("[musicLibraryService] listAudio error:", error.message);
    return {
      success: false,
      message: error.response?.data?.message ?? error.message ?? "Network error",
      error: error.message,
      data: undefined,
    };
  }
}

// ─────────────────────────────────────────────
// User API – POST /user/audio/:id/save (toggle)
// ─────────────────────────────────────────────

/**
 * Toggle save / unsave an audio track for the current user.
 * The backend handles the toggle logic; returns the new saved state.
 *
 * @param audioId  The `_id` of the MusicTrack to save / unsave
 */
export async function toggleSaveAudio(
  audioId: string
): Promise<ApiResponse<{ isSaved: boolean }>> {
  try {
    console.log("[musicLibraryService] Toggling save for audio:", audioId);

    const response = await apiClient.post<any>(`user/audio/${audioId}/save`);
    const responseData = response.data as any;

    if (responseData.code === 1) {
      // Backend may return { isSaved: boolean } or just a success message
      const isSaved: boolean =
        responseData.data?.isSaved ??
        responseData.data?.is_saved ??
        responseData.data?.saved ??
        !responseData.data?.removed ??
        true;

      console.log(`[musicLibraryService] Audio ${audioId} saved: ${isSaved}`);

      return {
        success: true,
        data: { isSaved },
        message: responseData.message ?? (isSaved ? "Audio saved" : "Audio unsaved"),
      };
    }

    return {
      success: false,
      message: responseData.message ?? "Failed to toggle save",
      error: "API returned unsuccessful response",
      data: undefined,
    };
  } catch (error: any) {
    console.error("[musicLibraryService] toggleSaveAudio error:", error.message);
    return {
      success: false,
      message: error.response?.data?.message ?? error.message ?? "Network error",
      error: error.message,
      data: undefined,
    };
  }
}

// ─────────────────────────────────────────────
// User API – GET /user/audio/saved
// ─────────────────────────────────────────────

/**
 * Fetch all audio tracks saved by the current user.
 * Shown in the "Saved" / "My Music" tab inside the music picker.
 *
 * @param page   Page number  (default: 1)
 * @param limit  Items per page (default: 20)
 */
export async function getSavedAudio(
  page = 1,
  limit = 20
): Promise<ApiResponse<AudioListData>> {
  try {
    console.log("[musicLibraryService] Fetching saved audio:", { page, limit });

    const response = await apiClient.get<any>("user/audio/saved", {
      params: { page, limit },
    });
    const responseData = response.data as any;

    if (responseData.code === 1) {
      const raw = responseData.data;

      const rawTracks: any[] = Array.isArray(raw)
        ? raw
        : raw?.tracks ?? raw?.audio ?? raw?.data ?? [];

      const tracks: MusicTrack[] = rawTracks.map((t) => ({
        ...normaliseTrack(t),
        isSaved: true, // All tracks from /saved are by definition saved
      }));

      const listData: AudioListData = {
        page: raw?.page ?? page,
        limit: raw?.limit ?? limit,
        total: raw?.total ?? tracks.length,
        tracks,
      };

      console.log(`[musicLibraryService] Loaded ${tracks.length} saved tracks`);

      return {
        success: true,
        data: listData,
        message: responseData.message ?? "Saved audio fetched successfully",
      };
    }

    return {
      success: false,
      message: responseData.message ?? "Failed to fetch saved audio",
      error: "API returned unsuccessful response",
      data: undefined,
    };
  } catch (error: any) {
    console.error("[musicLibraryService] getSavedAudio error:", error.message);
    return {
      success: false,
      message: error.response?.data?.message ?? error.message ?? "Network error",
      error: error.message,
      data: undefined,
    };
  }
}

// ─────────────────────────────────────────────
// Helper – Build music payload for reel publish
// ─────────────────────────────────────────────

/**
 * Converts a selected MusicTrack into the compact shape expected
 * by the `POST /reels/publish` endpoint:
 *
 * ```json
 * {
 *   "music": { "id": "<audioId>", "name": "<title>" }
 * }
 * ```
 *
 * Returns `null` when no track is selected (music is optional on reels).
 */
export function buildReelMusicPayload(
  track: MusicTrack | null | undefined
): ReelMusicPayload | null {
  if (!track || !track._id) return null;

  return {
    id: track._id,
    name: track.title,
  };
}

// ─────────────────────────────────────────────
// Search helper (client-side fallback)
// ─────────────────────────────────────────────

/**
 * Filter a local list of MusicTrack objects by a search term.
 * Useful for instant search before the backend query resolves.
 */
export function filterTracksBySearch(
  tracks: MusicTrack[],
  query: string
): MusicTrack[] {
  if (!query.trim()) return tracks;
  const q = query.toLowerCase();
  return tracks.filter(
    (t) =>
      t.title.toLowerCase().includes(q) ||
      (t.artist ?? "").toLowerCase().includes(q)
  );
}

// ─────────────────────────────────────────────
// Default export – namespaced service object
// ─────────────────────────────────────────────

export const musicLibraryService = {
  /** Fetch public audio library (trending / newest / popular) */
  listAudio,
  /** Toggle save / unsave an audio track for the logged-in user */
  toggleSaveAudio,
  /** Get all audio tracks saved by the logged-in user */
  getSavedAudio,
  /** Build the `{ id, name }` payload for reel publish */
  buildReelMusicPayload,
  /** Client-side search filter helper */
  filterTracksBySearch,
};

export default musicLibraryService;
