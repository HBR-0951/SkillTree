import { request } from './client'
import type { NoteDetail } from '@/types/skill'

/** GET /api/notes/:slug — 單篇筆記（含渲染好的 HTML） */
export function getNote(slug: string, _signal?: AbortSignal): Promise<NoteDetail> {
  return request<NoteDetail>(`/notes/${encodeURIComponent(slug)}`, { signal: _signal })
}
