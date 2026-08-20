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
  selectedSlug: string | null
  /** 表單填寫中的預覽節點 */
  ghost?: LaidOutSkill | null
}>()

const emit = defineEmits<{
  select: [slug: string]
  addChild: [slug: string]
  move: [slug: string, x: number, y: number]
}>()

const scroller = ref<HTMLElement | null>(null)
const draggingSlug = ref<string | null>(null)
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

function onDragStart(slug: string, event: PointerEvent) {
  if (!props.editMode) return
  const node = props.nodes.find((n) => n.slug === slug)
  const host = scroller.value
  if (!node || !host) return

  const rect = host.getBoundingClientRect()
  const offsetX = event.clientX - rect.left + host.scrollLeft - node.x
  const offsetY = event.clientY - rect.top + host.scrollTop - node.y
  let moved = false

  const onMove = (e: PointerEvent) => {
    moved = true
    draggingSlug.value = slug
    const raw = clampToCanvas(
      e.clientX - rect.left + host.scrollLeft - offsetX,
      e.clientY - rect.top + host.scrollTop - offsetY,
    )
    const snap = snapToTier(raw.y, node.tier)
    snappedTier.value = snap.snapped ? node.tier : null
    emit('move', slug, Math.round(raw.x), Math.round(snap.y))
  }

  const onUp = () => {
    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('pointerup', onUp)
    draggingSlug.value = null
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
        :key="node.slug"
        :node="node"
        :edit-mode="editMode"
        :selected="node.slug === selectedSlug"
        :dragging="node.slug === draggingSlug"
        @select="emit('select', $event)"
        @add-child="emit('addChild', $event)"
        @drag-start="onDragStart"
      />

      <SkillNode v-if="ghost" :node="ghost" :edit-mode="false" :selected="false" ghost @select="() => {}" />
    </div>
  </div>
</template>

<style scoped src="@/styles/components/SkillTree.css"></style>
