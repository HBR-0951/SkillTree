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
  select: [slug: string]
  addChild: [slug: string]
  dragStart: [slug: string, event: PointerEvent]
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
    <button class="body" type="button" @click="emit('select', node.slug)" @pointerdown="emit('dragStart', node.slug, $event)">
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

    <button v-if="editMode && !ghost" class="add" type="button" title="從這裡長新枝" @click.stop="emit('addChild', node.slug)">
      +
    </button>

    <span v-if="node.pending" class="badge mono">#{{ node.pending.prNumber }} · 等待合併</span>
  </div>
</template>

<style scoped src="@/styles/components/SkillNode.css"></style>
