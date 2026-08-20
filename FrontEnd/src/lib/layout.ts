import type { Edge, LaidOutSkill, Skill, Tier } from '@/types/skill'
import { TIERS } from '@/types/skill'

export const CANVAS = { width: 1240, height: 1030 } as const
export const CARD = { width: 196, height: 88 } as const
export const ROOT = { x: 620, y: 962 } as const

/** 每個層級的 y 座標，越上面越進階 */
const TIER_Y: Record<Tier, number> = {
  foundation: 796,
  build: 610,
  orchestrate: 420,
  operate: 228,
}

const H_MARGIN = 140

/**
 * 自動排版：同層節點平均分佈在畫布寬度上，順序依前置節點的 x 排序，
 * 讓連線盡量不交叉。已手動拖過的節點沿用自己的座標。
 */
export function layout(skills: Skill[]): LaidOutSkill[] {
  const placed = new Map<string, LaidOutSkill>()

  for (const tier of TIERS) {
    const row = skills.filter((s) => s.tier === tier)
    if (row.length === 0) continue

    const parentX = (s: Skill): number => {
      if (!s.parent) return ROOT.x
      return placed.get(s.parent)?.x ?? ROOT.x
    }
    row.sort((a, b) => parentX(a) - parentX(b) || a.name.localeCompare(b.name))

    const usable = CANVAS.width - H_MARGIN * 2
    const step = row.length === 1 ? 0 : usable / (row.length - 1)

    row.forEach((skill, i) => {
      const autoX = row.length === 1 ? CANVAS.width / 2 : H_MARGIN + step * i
      placed.set(skill.slug, {
        ...skill,
        x: skill.position?.x ?? Math.round(autoX),
        y: skill.position?.y ?? TIER_Y[tier],
      })
    })
  }

  return [...placed.values()]
}

/** 節點中心 → 連線起訖點（避開卡片本體） */
function anchor(node: { x: number; y: number }, side: 'top' | 'bottom') {
  const half = CARD.height / 2
  return { x: node.x, y: side === 'top' ? node.y - half : node.y + half }
}

export function buildEdges(nodes: LaidOutSkill[]): Edge[] {
  const bySlug = new Map(nodes.map((n) => [n.slug, n]))

  return nodes.map((node) => {
    const parent = node.parent ? bySlug.get(node.parent) : undefined
    const from = parent ? anchor(parent, 'top') : { x: ROOT.x, y: ROOT.y - 20 }
    const to = anchor(node, 'bottom')
    const mid = (from.y + to.y) / 2

    return {
      from: parent?.slug ?? 'root',
      to: node.slug,
      path: `M ${from.x} ${from.y} C ${from.x} ${mid} ${to.x} ${mid} ${to.x} ${to.y}`,
      strength: Math.min(parent?.progress ?? 100, node.progress),
    }
  })
}

/** 拖拉時把座標夾在畫布內 */
export function clampToCanvas(x: number, y: number) {
  const hw = CARD.width / 2
  const hh = CARD.height / 2
  return {
    x: Math.min(Math.max(x, hw), CANVAS.width - hw),
    y: Math.min(Math.max(y, hh), CANVAS.height - hh),
  }
}

/** 吸附到同層基準線，回傳吸附後的 y 與是否吸附成功 */
export function snapToTier(y: number, tier: Tier, threshold = 18) {
  const target = TIER_Y[tier]
  return Math.abs(y - target) <= threshold ? { y: target, snapped: true } : { y, snapped: false }
}

export { TIER_Y }
