/**
 * 後端 API 還沒寫好，所以直接回假資料。
 * 要接真後端時：刪掉 mock 那行，打開註解掉的 request(...)。
 */
// import { request } from './client'
import type { NoteDetail } from '@/types/skill'
import { delay, mockNoteDetail } from './mock'

/** GET /api/notes/:slug — 單篇筆記（含渲染好的 HTML） */
export function fetchNote(slug: string, _signal?: AbortSignal): Promise<NoteDetail> {
  // return request<NoteDetail>(`/notes/${encodeURIComponent(slug)}`, { signal: _signal })
  return delay(mockNoteDetail(slug), 220)
}
