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

const parents = computed(() => props.skills.filter((s) => s.slug !== props.draft.slug))

const downstream = computed(() =>
  props.draft.slug ? props.skills.filter((s) => s.parent === props.draft.slug) : [],
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
          <option v-for="s in parents" :key="s.slug" :value="s.slug">{{ s.name }}</option>
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

<style scoped src="@/styles/components/SkillFormPanel.css"></style>
