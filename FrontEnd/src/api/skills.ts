/**
 * fetchSkills 已經接上真的後端（GET /api/skills）。
 * 其他函式後端還沒寫好，繼續回假資料；要接真後端時把對應那行 mock 刪掉，並打開下面註解掉的 request(...)。
 */
import { request } from './client'
import type { DiffPreview, Note, PullRequest, Skill, SkillDraft } from '@/types/skill'
import { MOCK_NOTES, MOCK_SKILLS, delay, mockDiff, mockPullRequest, mockRecentNotes } from './mock'

/** GET /api/skills — 整棵樹 */
export function fetchSkills(_signal?: AbortSignal): Promise<Skill[]> {
  return request<Skill[]>('/skills', { signal: _signal })
}

/** GET /api/skills/:slug/notes — 某個技能底下的筆記 */
export function fetchNotes(skillSlug: string, _signal?: AbortSignal): Promise<Note[]> {
  // return request<Note[]>(`/skills/${encodeURIComponent(skillSlug)}/notes`, { signal: _signal })
  return delay(MOCK_NOTES[skillSlug] ?? [], 180)
}

/** GET /api/notes/recent?limit=7 — 首頁「最新筆記」 */
export function fetchRecentNotes(
  limit = 7,
): Promise<(Note & { skillSlug: string; skillName: string })[]> {
  // return request(`/notes/recent?limit=${limit}`)
  return delay(mockRecentNotes(limit), 180)
}

/** POST /api/skills/preview — 只算 diff，不寫任何東西 */
export function previewSkill(draft: SkillDraft): Promise<DiffPreview> {
  // return request<DiffPreview>('/skills/preview', { method: 'POST', body: draft })
  return delay(mockDiff(draft, draft.slug ? 'edit' : 'create'), 320)
}

/** POST /api/skills — 開一個新增技能的 PR */
export function createSkill(draft: SkillDraft): Promise<PullRequest> {
  // return request<PullRequest>('/skills', { method: 'POST', body: draft })
  return delay(mockPullRequest(draft, 'add'), 480)
}

/** PUT /api/skills/:slug — 開一個修改技能的 PR */
export function updateSkill(slug: string, draft: SkillDraft): Promise<PullRequest> {
  // return request<PullRequest>(`/skills/${encodeURIComponent(slug)}`, { method: 'PUT', body: draft })
  return delay(mockPullRequest({ ...draft, slug }, 'update'), 480)
}

/** DELETE /api/skills/:slug — 開一個刪除技能的 PR。筆記檔案不會被刪。 */
export function deleteSkill(slug: string, _reassignChildrenTo: string | null): Promise<PullRequest> {
  // return request<PullRequest>(`/skills/${encodeURIComponent(slug)}`, {
  //   method: 'DELETE',
  //   body: { reassignChildrenTo: _reassignChildrenTo },
  // })
  const skill = MOCK_SKILLS.find((s) => s.slug === slug)
  return delay(
    mockPullRequest(
      {
        slug,
        name: skill?.name ?? slug,
        tier: skill?.tier ?? 'foundation',
        parent: skill?.parent ?? null,
        level: 0,
        progress: 0,
        blurb: '',
        tags: [],
        position: null,
        notesDir: '',
        workUrls: [],
      },
      'remove',
    ),
    480,
  )
}
