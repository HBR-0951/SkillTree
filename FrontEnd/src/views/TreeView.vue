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

const props = defineProps<{ initialSkillId?: string | null }>()

const tree = useSkillTree()
const editor = useSkillEditor()

/** 從筆記頁帶著 ?skill=… 回來時，自動打開那個節點 */
watch(
  () => tree.loading.value,
  (loading) => {
    if (!loading && props.initialSkillId && !tree.selectedId.value) {
      void tree.select(props.initialSkillId)
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

function onAddChild(parentId: string) {
  const parent = tree.skills.value.find((s) => s.id === parentId) ?? null
  editor.startCreate(parent)
}

function onEdit(id: string) {
  const skill = tree.skills.value.find((s) => s.id === id)
  if (skill) editor.startEdit(skill)
}

function onMove(id: string, x: number, y: number) {
  if (id === '__ghost__') {
    editor.draft.value = { ...editor.draft.value, position: { x, y } }
    return
  }
  tree.moveNode(id, x, y)
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
          :selected-id="tree.selectedId.value"
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
        @request-delete="editor.draft.value.id && editor.remove(editor.draft.value.id, null)"
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

<style scoped>
.page {
  min-height: 100vh;
  background: var(--bg-page);
  padding: 0 40px 60px;
}
.top {
  max-width: 1680px;
  margin: 0 auto;
  padding: 32px 0 20px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 36px;
  flex-wrap: wrap;
  border-bottom: 1px solid #241a11;
}
.intro {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
h1 {
  margin: 0;
  font-size: 40px;
  line-height: 1;
  font-weight: 600;
  letter-spacing: -0.025em;
}
.intro p {
  margin: 0;
  max-width: 440px;
  font-size: 14px;
  line-height: 1.65;
  color: #9c8b78;
  text-wrap: pretty;
}
.stats {
  display: flex;
  align-items: flex-end;
  gap: 24px;
  flex-wrap: wrap;
}
.stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.num {
  font-size: 25px;
  font-weight: 600;
}
.green {
  color: var(--green);
}

.toggle {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 6px 12px 6px 8px;
  border-radius: 999px;
  border: 1px solid var(--wood-line);
  background: #16100b;
  color: #9c8b78;
  font-size: 11px;
  letter-spacing: 0.08em;
}
.toggle.on {
  border-color: var(--green);
  background: rgba(63, 185, 80, 0.14);
  color: var(--green-bright);
}
.knob {
  width: 26px;
  height: 15px;
  border-radius: 999px;
  background: var(--wood-faint);
  display: flex;
  align-items: center;
  padding: 2px;
}
.knob::after {
  content: '';
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: #12210f;
}
.toggle.on .knob {
  background: var(--green);
  justify-content: flex-end;
}
.add-skill {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 7px 13px;
  border-radius: 999px;
  border: 1px solid var(--wood);
  background: var(--card);
  color: var(--label);
  font-size: 12.5px;
  font-weight: 600;
}
.plus {
  color: var(--green);
  font-size: 14px;
}

main {
  max-width: 1680px;
  margin: 18px auto 0;
}
.split {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 400px;
  gap: 24px;
  align-items: start;
}
.centered {
  max-width: 460px;
}
.tree-col {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
}
.legend {
  display: flex;
  align-items: center;
  gap: 20px;
  font-size: 11px;
  color: var(--text-dim);
  padding: 0 2px;
}
.legend span {
  display: flex;
  align-items: center;
  gap: 7px;
}
.legend .hint {
  margin-left: auto;
}
.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.dot.mastered {
  background: var(--green);
  box-shadow: 0 0 9px 1px rgba(63, 185, 80, 0.9);
}
.dot.learning {
  background: var(--green-soft);
}
.dot.idle {
  background: var(--wood-faint);
  border: 1px solid #6b5238;
}
.loading,
.error {
  font-size: 12px;
  color: var(--text-dim);
}
.error {
  color: var(--danger);
}

.panel.empty {
  border: 1px solid #2e2116;
  border-radius: 18px;
  background: var(--panel);
  padding: 22px;
  min-height: 320px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.panel.empty h2 {
  margin: 0;
  font-size: 23px;
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.25;
}
</style>
