<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Skill, SkillDraft, Tier } from '@/types/skill'
import { TIERS } from '@/types/skill'

const props = defineProps<{
  draft: SkillDraft
  mode: 'create' | 'edit'
  skills: Skill[]
  errors: Record<string, string>
  busy: boolean
}>()

const emit = defineEmits<{
  'update:draft': [draft: SkillDraft]
  next: []
  cancel: []
  requestDelete: []
}>()

const tagInput = ref('')

const parents = computed(() => props.skills.filter((s) => s.id !== props.draft.id))

const downstream = computed(() =>
  props.draft.id ? props.skills.filter((s) => s.parent === props.draft.id) : [],
)

function patch<K extends keyof SkillDraft>(key: K, value: SkillDraft[K]) {
  emit('update:draft', { ...props.draft, [key]: value })
}

function addTag() {
  const tag = tagInput.value.trim().toLowerCase()
  if (!tag || props.draft.tags.includes(tag)) return
  patch('tags', [...props.draft.tags, tag])
  tagInput.value = ''
}
</script>

<template>
  <section class="panel">
    <header>
      <span class="label">{{ mode === 'create' ? 'new skill' : 'edit skill' }}</span>
      <button class="icon" type="button" @click="emit('cancel')">×</button>
    </header>

    <div class="field">
      <label for="name">技能名稱</label>
      <input
        id="name"
        :value="draft.name"
        placeholder="GitOps / ArgoCD"
        @input="patch('name', ($event.target as HTMLInputElement).value)"
      />
      <span v-if="errors.name" class="error">{{ errors.name }}</span>
    </div>

    <div class="grid">
      <div class="field">
        <label for="parent">前置技能</label>
        <select id="parent" :value="draft.parent ?? ''" @change="patch('parent', ($event.target as HTMLSelectElement).value || null)">
          <option value="">（直接接在 root）</option>
          <option v-for="s in parents" :key="s.id" :value="s.id">{{ s.name }}</option>
        </select>
      </div>
      <div class="field">
        <label for="tier">層級 tier</label>
        <select id="tier" :value="draft.tier" @change="patch('tier', ($event.target as HTMLSelectElement).value as Tier)">
          <option v-for="t in TIERS" :key="t" :value="t">{{ t }}</option>
        </select>
      </div>
    </div>

    <div class="field">
      <div class="row">
        <label for="progress">初始 lv. / 進度</label>
        <span class="mono value">Lv.{{ draft.level }} · {{ draft.progress }}%</span>
      </div>
      <input
        id="progress"
        class="range"
        type="range"
        min="0"
        max="100"
        step="1"
        :value="draft.progress"
        @input="patch('progress', Number(($event.target as HTMLInputElement).value))"
      />
      <span v-if="errors.progress" class="error">{{ errors.progress }}</span>
    </div>

    <div class="field">
      <label for="blurb">一句描述</label>
      <textarea
        id="blurb"
        rows="3"
        :value="draft.blurb"
        placeholder="把 Git 當成唯一的真實來源，讓叢集狀態自己追上 repo。"
        @input="patch('blurb', ($event.target as HTMLTextAreaElement).value)"
      />
    </div>

    <div class="field">
      <label for="tag">技術標籤</label>
      <div class="tag-box">
        <span v-for="tag in draft.tags" :key="tag" class="mono tag">
          {{ tag }}
          <button type="button" @click="patch('tags', draft.tags.filter((t) => t !== tag))">×</button>
        </span>
        <input
          id="tag"
          v-model="tagInput"
          class="tag-input"
          placeholder="+ 新增"
          @keydown.enter.prevent="addTag"
          @keydown.,.prevent="addTag"
        />
      </div>
    </div>

    <div class="field">
      <label for="notesDir">筆記路徑</label>
      <input
        id="notesDir"
        :value="draft.notesDir"
        placeholder="notes/gitops/"
        @input="patch('notesDir', ($event.target as HTMLInputElement).value)"
      />
      <span v-if="errors.notesDir" class="error">{{ errors.notesDir }}</span>
    </div>

    <div class="actions">
      <button class="btn-primary" type="button" :disabled="busy" @click="emit('next')">
        {{ busy ? '計算 diff…' : '下一步：看 diff →' }}
      </button>
      <button class="btn-ghost" type="button" @click="emit('cancel')">取消</button>
    </div>

    <template v-if="mode === 'edit'">
      <hr />
      <div class="danger">
        <span class="danger-label mono">danger zone</span>
        <p>
          刪除這個節點。{{ downstream.length }} 個下游節點會失去前置技能，筆記檔案不會被刪除。
        </p>
        <button class="danger-btn" type="button" @click="emit('requestDelete')">刪除 {{ draft.name }}</button>
      </div>
    </template>
  </section>
</template>

<style scoped>
.panel {
  border: 1px solid #2e2116;
  border-radius: 18px;
  background: var(--panel);
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-height: 86vh;
  overflow-y: auto;
}
header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.icon {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 1px solid var(--wood-line);
  background: transparent;
  color: #9c8b78;
  font-size: 14px;
  line-height: 1;
}
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}
.value {
  font-size: 11px;
  color: var(--green);
}
.range {
  padding: 0;
  border: none;
  background: transparent;
  accent-color: var(--green);
}
.tag-box {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  padding: 9px 10px;
  border-radius: 8px;
  border: 1px solid var(--wood-line);
  background: #16100b;
}
.tag {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 10.5px;
  padding: 4px 8px;
  border-radius: 5px;
  background: #1e1610;
  border: 1px solid var(--wood-line);
  color: var(--label);
}
.tag button {
  border: none;
  background: none;
  color: #8b7050;
  padding: 0;
  font-size: 12px;
  line-height: 1;
}
.tag-input {
  flex: 1;
  min-width: 70px;
  border: none;
  background: transparent;
  color: var(--text);
  font: inherit;
  font-size: 12px;
}
.tag-input:focus {
  outline: none;
}
.actions {
  display: flex;
  gap: 10px;
}
.actions .btn-primary {
  flex: 1;
}
hr {
  border: none;
  height: 1px;
  background: #2e2116;
  margin: 4px 0 0;
}
.danger {
  border: 1px solid rgba(229, 72, 77, 0.4);
  border-radius: 10px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: rgba(229, 72, 77, 0.06);
}
.danger-label {
  font-size: 10px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--danger);
}
.danger p {
  margin: 0;
  font-size: 12.5px;
  line-height: 1.65;
  color: var(--text-dim);
}
.danger-btn {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid rgba(229, 72, 77, 0.35);
  background: transparent;
  color: var(--danger);
  font-size: 12.5px;
  font-weight: 600;
}
</style>
