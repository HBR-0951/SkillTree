<script setup lang="ts">
import { computed } from 'vue'
import { nodeState } from '@/lib/appearance'
import { CARD } from '@/lib/layout'
import type { LaidOutSkill } from '@/types/skill'

const props = defineProps<{
  node: LaidOutSkill
  editMode: boolean
  selected: boolean
  dragging?: boolean
  ghost?: boolean
}>()

const emit = defineEmits<{
  select: [id: string]
  addChild: [id: string]
  dragStart: [id: string, event: PointerEvent]
}>()

const state = computed(() => nodeState(props.node.progress))
const countLabel = computed(() => {
  const w = props.node.works.length
  return `${props.node.noteCount}n${w ? ` · ${w}w` : ''}`
})
</script>

<template>
  <div
    class="node"
    :class="[state, { selected, dragging, ghost, pending: !!node.pending }]"
    :style="{ left: `${node.x}px`, top: `${node.y}px`, width: `${CARD.width}px` }"
  >
    <button class="body" type="button" @click="emit('select', node.id)" @pointerdown="emit('dragStart', node.id, $event)">
      <span class="row">
        <span class="dot" />
        <span class="tier mono">{{ node.tier }}</span>
        <span class="lv mono">Lv.{{ node.level }}</span>
      </span>
      <span class="name">{{ node.name }}</span>
      <span class="row">
        <span class="bar"><span class="fill" :style="{ width: `${node.progress}%` }" /></span>
        <span class="count mono">{{ countLabel }}</span>
      </span>
    </button>

    <button v-if="editMode && !ghost" class="add" type="button" title="從這裡長新枝" @click.stop="emit('addChild', node.id)">
      +
    </button>

    <span v-if="node.pending" class="badge mono">#{{ node.pending.prNumber }} · 等待合併</span>
  </div>
</template>

<style scoped>
.node {
  position: absolute;
  transform: translate(-50%, -50%);
}

.body {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: left;
  padding: 13px 14px 12px;
  border-radius: 13px;
  background-color: var(--card);
  background-image: var(--wood-grain);
  border: 1px solid #4e3722;
  color: var(--text);
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    border-color 0.18s ease;
}
.body:hover {
  transform: translateY(-3px);
  border-color: #b87f45;
  box-shadow:
    0 0 0 1px rgba(184, 127, 69, 0.35),
    0 14px 28px -12px #000,
    0 0 26px -6px rgba(63, 185, 80, 0.35);
}

.mastered .body {
  background-color: var(--card-strong);
  border-color: var(--wood);
  box-shadow:
    0 0 0 1px rgba(139, 94, 52, 0.25),
    0 12px 26px -14px #000,
    0 0 22px -8px rgba(63, 185, 80, 0.4);
}
.idle .body {
  background-color: var(--card-idle);
  border-color: #332417;
  color: #8e7d69;
}
.selected .body {
  border-color: var(--label);
  box-shadow: 0 0 0 3px rgba(201, 169, 129, 0.15);
}
.dragging .body {
  cursor: grabbing;
  border-color: var(--green);
  box-shadow:
    0 18px 34px -14px #000,
    0 0 34px -6px rgba(63, 185, 80, 0.55);
}
.ghost .body {
  background-color: rgba(30, 38, 26, 0.55);
  border: 1.5px dashed var(--green);
  box-shadow: 0 0 30px -6px rgba(63, 185, 80, 0.45);
}
.pending .body {
  border: 1px dashed var(--wood);
}

.row {
  display: flex;
  align-items: center;
  gap: 9px;
}
.dot {
  width: 9px;
  height: 9px;
  flex: none;
  border-radius: 50%;
  background: var(--green-soft);
}
.mastered .dot {
  background: var(--green);
  box-shadow: 0 0 10px 1px rgba(63, 185, 80, 0.9);
}
.idle .dot {
  background: #3a2a1b;
}

.tier {
  font-size: 10px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #8b7050;
}
.mastered .tier {
  color: var(--label);
}
.lv {
  margin-left: auto;
  font-size: 11px;
  font-weight: 600;
  color: var(--label);
}
.mastered .lv {
  color: var(--green);
}

.name {
  font-size: 15.5px;
  font-weight: 600;
  letter-spacing: -0.01em;
  line-height: 1.2;
}

.bar {
  flex: 1;
  display: block;
  height: 4px;
  border-radius: 2px;
  background: #1b130d;
  border: 1px solid rgba(139, 94, 52, 0.28);
  overflow: hidden;
}
.fill {
  display: block;
  height: 100%;
  background: var(--green-soft);
}
.mastered .fill {
  background: var(--green);
  box-shadow: 0 0 8px rgba(63, 185, 80, 0.67);
}
.idle .fill {
  background: var(--wood-faint);
}
.count {
  font-size: 10px;
  color: #8b7050;
}

.add {
  position: absolute;
  top: -11px;
  right: -11px;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 1px solid var(--green);
  background: rgba(63, 185, 80, 0.18);
  color: var(--green-bright);
  font-size: 16px;
  font-weight: 700;
  line-height: 1;
}
.add:hover {
  background: var(--green);
  color: #0d1a0c;
  box-shadow: 0 0 16px 2px rgba(63, 185, 80, 0.6);
}

.badge {
  position: absolute;
  bottom: -9px;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  font-size: 9.5px;
  letter-spacing: 0.1em;
  padding: 2px 6px;
  border-radius: 4px;
  background: #1e1610;
  border: 1px solid var(--wood-faint);
  color: var(--text-dim);
}
</style>
