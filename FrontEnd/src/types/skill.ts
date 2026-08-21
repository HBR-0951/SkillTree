/** 技能樹的資料模型 — 對應 repo 裡 skills/*.yaml 的欄位。 */

export type Tier = 'foundation' | 'build' | 'orchestrate' | 'operate'

export const TIERS: readonly Tier[] = ['foundation', 'build', 'orchestrate', 'operate']

export interface Note {
  slug: string
  title: string
  summary: string
  /** ISO 8601, e.g. 2026-08-14 */
  date: string
  tags: string[]
}

export interface NoteRef {
  slug: string
  title: string
}

/** 單篇筆記閱讀頁的資料 */
export interface NoteDetail extends Note {
  skillSlug: string
  skillName: string
  /** 後端把 markdown 轉好的 HTML；前端只負責排版 */
  contentHtml: string
  /** 目錄，由 h2 / h3 產生 */
  headings: { id: string; text: string; level: 2 | 3 }[]
  updated: string | null
  prev: NoteRef | null
  next: NoteRef | null
}

export interface Work {
  title: string
  kind: 'repo' | 'site' | 'demo'
  desc: string
  stack: string
  url: string
}

export interface Position {
  x: number
  y: number
}

export interface Skill {
  /** 資料庫 primary key。未來會接上真的 DB 後換成 long；前端邏輯完全不參照這個欄位。 */
  id: string
  /** 人類可讀、建立後不變的識別碼。parent / URL / notesDir 等所有「參照」都用這個欄位。 */
  slug: string
  name: string
  tier: Tier
  /** 前置技能的 slug；null 代表直接接在 root */
  parent: string | null
  level: number
  /** 0–100 */
  progress: number
  blurb: string
  tags: string[]
  /** 手動微調過的座標；沒有就用自動排版 */
  position: Position | null
  notesDir: string
  noteCount: number
  works: Work[]
  /** 有 PR 尚未合併的節點 */
  pending?: { prNumber: number; prUrl: string }
}

/** 新增或編輯時送出的內容 */
export interface SkillDraft {
  /** 有值代表編輯既有技能（取自 Skill.slug）；新建立時交給後端指派 */
  slug?: string
  name: string
  tier: Tier
  parent: string | null
  level: number
  progress: number
  blurb: string
  tags: string[]
  position: Position | null
  notesDir: string
  workUrls: string[]
}

export interface DiffLine {
  sign: ' ' | '+' | '-'
  text: string
  line: number
}

export interface DiffFile {
  path: string
  status: 'added' | 'modified' | 'removed'
  lines: DiffLine[]
}

export interface DiffPreview {
  files: DiffFile[]
  additions: number
  deletions: number
  checks: { label: string; level: 'ok' | 'warn' | 'error' }[]
}

export interface PullRequest {
  number: number
  url: string
  branch: string
  title: string
}

/** 排版後的節點：原始資料 + 畫面座標 */
export interface LaidOutSkill extends Skill {
  x: number
  y: number
}

export interface Edge {
  /** 兩端都是 Skill.slug（root 用字面 'root'） */
  from: string
  to: string
  path: string
  /** 兩端進度的最小值，用來決定線的亮度 */
  strength: number
}
