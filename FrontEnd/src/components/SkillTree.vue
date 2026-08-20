<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import SkillNode from './SkillNode.vue'
import { edgeStyle } from '@/lib/appearance'
import { CANVAS, ROOT, TIER_Y, clampToCanvas, snapToTier } from '@/lib/layout'
import type { Edge, LaidOutSkill } from '@/types/skill'

const props = defineProps<{
  nodes: LaidOutSkill[]
  edges: Edge[]
  editMode: boolean
  selectedId: string | null
  /** 表單填寫中的預覽節點 */
  ghost?: LaidOutSkill | null
}>()

const emit = defineEmits<{
  select: [id: string]
  addChild: [id: string]
  move: [id: string, x: number, y: number]
}>()

const scroller = ref<HTMLElement | null>(null)
const draggingId = ref<string | null>(null)
const snappedTier = ref<string | null>(null)

/** 樹是從 root 往上長的，所以一進來先看底部中央 */
onMounted(() => {
  const el = scroller.value
  if (!el) return
  el.scrollTop = el.scrollHeight
  el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2
})

const leaves = computed(() => {
  const greens = ['#3FB950', '#7EE787', '#2A7A38', '#5FC46B']
  let seed = 7
  const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648
  return Array.from({ length: 46 }, (_, i) => {
    const cx = Math.round(60 + rnd() * 1120)
    const cy = Math.round(90 + rnd() * 800)
    const r = 9 + rnd() * 17
    return {
      cx,
      cy,
      rx: Math.round(r),
      ry: Math.round(r * (0.36 + rnd() * 0.2)),
      fill: greens[i % greens.length],
      opacity: Number((0.05 + rnd() * 0.13).toFixed(3)),
      rot: `rotate(${Math.round(-70 + rnd() * 140)} ${cx} ${cy})`,
    }
  })
})

function onDragStart(id: string, event: PointerEvent) {
  if (!props.editMode) return
  const node = props.nodes.find((n) => n.id === id)
  const host = scroller.value
  if (!node || !host) return

  const rect = host.getBoundingClientRect()
  const offsetX = event.clientX - rect.left + host.scrollLeft - node.x
  const offsetY = event.clientY - rect.top + host.scrollTop - node.y
  let moved = false

  const onMove = (e: PointerEvent) => {
    moved = true
    draggingId.value = id
    const raw = clampToCanvas(
      e.clientX - rect.left + host.scrollLeft - offsetX,
      e.clientY - rect.top + host.scrollTop - offsetY,
    )
    const snap = snapToTier(raw.y, node.tier)
    snappedTier.value = snap.snapped ? node.tier : null
    emit('move', id, Math.round(raw.x), Math.round(snap.y))
  }

  const onUp = () => {
    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('pointerup', onUp)
    draggingId.value = null
    snappedTier.value = null
    // 沒真的移動就當成點擊，交給 SkillNode 的 click
    if (!moved) return
  }

  window.addEventListener('pointermove', onMove)
  window.addEventListener('pointerup', onUp)
}
</script>

<template>
  <div ref="scroller" class="scroller">
    <div class="canvas" :style="{ width: `${CANVAS.width}px`, height: `${CANVAS.height}px` }">
      <svg class="layer" :viewBox="`0 0 ${CANVAS.width} ${CANVAS.height}`" aria-hidden="true">
        <ellipse
          v-for="(l, i) in leaves"
          :key="i"
          :cx="l.cx"
          :cy="l.cy"
          :rx="l.rx"
          :ry="l.ry"
          :fill="l.fill"
          :opacity="l.opacity"
          :transform="l.rot"
        />
      </svg>

      <svg class="layer" :viewBox="`0 0 ${CANVAS.width} ${CANVAS.height}`" aria-hidden="true">
        <path
          v-for="edge in edges"
          :key="`${edge.from}-${edge.to}`"
          :d="edge.path"
          fill="none"
          stroke-linecap="round"
          :stroke="edgeStyle(edge.strength).stroke"
          :stroke-width="edge.from === 'root' ? 4.5 : edgeStyle(edge.strength).width"
          :stroke-dasharray="edgeStyle(edge.strength).dash"
        />
        <path
          v-if="ghost"
          :d="`M ${ROOT.x} ${ROOT.y - 20} C ${ROOT.x} ${ghost.y} ${ghost.x} ${ghost.y} ${ghost.x} ${ghost.y + 44}`"
          fill="none"
          stroke="var(--green)"
          stroke-width="2.4"
          stroke-dasharray="7 6"
          stroke-linecap="round"
        />
      </svg>

      <div v-if="snappedTier" class="guide" :style="{ top: `${TIER_Y[snappedTier as keyof typeof TIER_Y]}px` }">
        <span class="guide-label mono">TIER · {{ snappedTier.toUpperCase() }}</span>
      </div>

      <div class="root" :style="{ left: `${ROOT.x}px`, top: `${ROOT.y}px` }">
        <span class="diamond" />
        <span class="root-label mono">root · ./start</span>
      </div>

      <SkillNode
        v-for="node in nodes"
        :key="node.id"
        :node="node"
        :edit-mode="editMode"
        :selected="node.id === selectedId"
        :dragging="node.id === draggingId"
        @select="emit('select', $event)"
        @add-child="emit('addChild', $event)"
        @drag-start="onDragStart"
      />

      <SkillNode v-if="ghost" :node="ghost" :edit-mode="false" :selected="false" ghost @select="() => {}" />
    </div>
  </div>
</template>

<style scoped>
.scroller {
  border: 1px solid var(--wood-faint);
  border-radius: 18px;
  background:
    radial-gradient(700px 460px at 50% 96%, rgba(92, 68, 48, 0.55) 0%, transparent 70%),
    linear-gradient(180deg, rgba(37, 58, 38, 0.42) 0%, rgba(46, 40, 26, 0.34) 46%, rgba(52, 38, 25, 0.42) 100%);
  overflow: auto;
  max-height: 82vh;
}
.canvas {
  position: relative;
}
.layer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
.guide {
  position: absolute;
  left: 0;
  right: 0;
  height: 1px;
  background: repeating-linear-gradient(90deg, var(--green) 0 6px, transparent 6px 12px);
  opacity: 0.8;
}
.guide-label {
  position: absolute;
  left: 10px;
  top: 6px;
  font-size: 10px;
  letter-spacing: 0.1em;
  color: var(--green-bright);
}
.root {
  position: absolute;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.diamond {
  width: 20px;
  height: 20px;
  background: var(--wood);
  transform: rotate(45deg);
  box-shadow: 0 0 20px 3px rgba(139, 94, 52, 0.6);
}
.root-label {
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #d4b58e;
  white-space: nowrap;
}
</style>
