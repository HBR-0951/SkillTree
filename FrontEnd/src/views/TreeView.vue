<script setup lang="ts">
import { computed, watch } from 'vue'
import SkillTree from '@/components/SkillTree.vue'
import SkillDetailPanel from '@/components/SkillDetailPanel.vue'
import SkillFormPanel from '@/components/SkillFormPanel.vue'
import YamlDiff from '@/components/YamlDiff.vue'
import PrSuccess from '@/components/PrSuccess.vue'
import { useSkillTree } from '@/composables/useSkillTree'
import { useSkillEditor } from '@/composables/useSkillEditor'
import { TIER_Y } from '@/lib/layout'
import type { LaidOutSkill, SkillDraft } from '@/types/skill'

const props = defineProps<{ initialSkillSlug?: string | null }>()

const tree = useSkillTree()
const editor = useSkillEditor()

/** 從筆記頁帶著 ?skill=… 回來時，自動打開那個節點 */
watch(
  () => tree.loading.value,
  (loading) => {
    if (!loading && props.initialSkillSlug && !tree.selectedSlug.value) {
      void tree.select(props.initialSkillSlug)
    }
  },
  { immediate: true },
)

/** 表單填寫中時，樹上要顯示的半透明預覽節點 */
const ghost = computed<LaidOutSkill | null>(() => {
  if (editor.step.value !== 'form' && editor.step.value !== 'position') return null
  const d = editor.draft.value
  if (!d.name.trim()) return null
  return {
    id: '__ghost__',
    slug: '__ghost__',
    name: d.name,
    tier: d.tier,
    parent: d.parent,
    level: d.level,
    progress: d.progress,
    blurb: d.blurb,
    tags: d.tags,
    position: d.position,
    notesDir: d.notesDir,
    noteCount: 0,
    works: [],
    x: d.position?.x ?? 700,
    y: d.position?.y ?? TIER_Y[d.tier],
  }
})

function onAddChild(parentSlug: string) {
  const parent = tree.skills.value.find((s) => s.slug === parentSlug) ?? null
  editor.startCreate(parent)
}

function onEdit(slug: string) {
  const skill = tree.skills.value.find((s) => s.slug === slug)
  if (skill) editor.startEdit(skill)
}

function onMove(slug: string, x: number, y: number) {
  if (slug === '__ghost__') {
    editor.draft.value = { ...editor.draft.value, position: { x, y } }
    return
  }
  tree.moveNode(slug, x, y)
}

function updateDraft(next: SkillDraft) {
  editor.draft.value = next
}

async function afterSubmit() {
  editor.cancel()
  await tree.load()
}
</script>

<template>
  <div class="page">
    <header class="top">
      <div class="intro">
        <span class="label">devops learning path</span>
        <h1>Skill Tree</h1>
        <p>一棵持續生長的樹。每個節點是一項技能，點開就是我在那條路上寫下的 notes 與做出來的 works。</p>
      </div>

      <div class="stats">
        <div class="stat">
          <span class="label">total lv</span>
          <span class="mono num green">{{ tree.totals.value.level }}</span>
        </div>
        <div class="stat">
          <span class="label">notes</span>
          <span class="mono num">{{ tree.totals.value.notes }}</span>
        </div>
        <div class="stat">
          <span class="label">works</span>
          <span class="mono num">{{ tree.totals.value.works }}</span>
        </div>

        <button
          class="toggle"
          :class="{ on: editor.editMode.value }"
          type="button"
          @click="editor.editMode.value = !editor.editMode.value"
        >
          <span class="knob" />
          <span class="mono">EDIT MODE</span>
        </button>
        <button v-if="editor.editMode.value" class="add-skill" type="button" @click="editor.startCreate(null)">
          <span class="plus">+</span> Add Skill
        </button>
      </div>
    </header>

    <p v-if="tree.error.value" class="error mono">{{ tree.error.value }}</p>

    <main v-if="editor.step.value === 'diff' && editor.diff.value">
      <YamlDiff
        :diff="editor.diff.value"
        :busy="editor.busy.value"
        @submit="editor.submit"
        @back="editor.step.value = 'form'"
      />
    </main>

    <main v-else-if="editor.step.value === 'submitted' && editor.pr.value" class="centered">
      <PrSuccess :pr="editor.pr.value" @again="editor.startCreate(null)" @done="afterSubmit" />
    </main>

    <main v-else class="split">
      <div class="tree-col">
        <div class="legend mono">
          <span><i class="dot mastered" />MASTERED</span>
          <span><i class="dot learning" />LEARNING</span>
          <span><i class="dot idle" />NOT STARTED</span>
          <span class="hint">{{
            editor.editMode.value ? '點節點右上「+」→ 從那裡長新枝' : '全部可點 · 亮度代表進度'
          }}</span>
        </div>

        <p v-if="tree.loading.value" class="mono loading">讀取技能樹…</p>
        <SkillTree
          v-else
          :nodes="tree.nodes.value"
          :edges="tree.edges.value"
          :edit-mode="editor.editMode.value"
          :selected-slug="tree.selectedSlug.value"
          :ghost="ghost"
          @select="tree.select"
          @add-child="onAddChild"
          @move="onMove"
        />
      </div>

      <SkillFormPanel
        v-if="editor.step.value === 'form' || editor.step.value === 'position'"
        :draft="editor.draft.value"
        :mode="editor.mode.value"
        :skills="tree.skills.value"
        :errors="editor.errors"
        :busy="editor.busy.value"
        @update:draft="updateDraft"
        @next="editor.toDiff"
        @cancel="editor.cancel"
        @request-delete="editor.draft.value.slug && editor.remove(editor.draft.value.slug, null)"
      />

      <SkillDetailPanel
        v-else-if="tree.selected.value"
        :skill="tree.selected.value"
        :notes="tree.notes.value"
        :loading="tree.notesLoading.value"
        :edit-mode="editor.editMode.value"
        @close="tree.select(null)"
        @edit="onEdit"
      />

      <section v-else class="panel empty">
        <span class="label">overview</span>
        <h2>選一個節點，<br />看那條路上的筆記</h2>
      </section>
    </main>
  </div>
</template>

<style scoped src="@/styles/views/TreeView.css"></style>
