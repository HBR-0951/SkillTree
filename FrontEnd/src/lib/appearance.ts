/**
 * 節點外觀只由進度決定：亮度分三段，全部都可點。
 * 對應設計稿：mastered ≥ 80、learning ≥ 20、not started < 20。
 */

export type NodeState = 'mastered' | 'learning' | 'idle'

export function nodeState(progress: number): NodeState {
  if (progress >= 80) return 'mastered'
  if (progress >= 20) return 'learning'
  return 'idle'
}

export function edgeStyle(strength: number) {
  if (strength >= 60) return { stroke: 'var(--wood)', width: 2.2, dash: 'none' }
  if (strength >= 30) return { stroke: 'var(--wood-dim)', width: 1.5, dash: 'none' }
  return { stroke: 'var(--wood-faint)', width: 1.5, dash: '5 7' }
}
