<script setup lang="ts">
import type { LaidOutSkill, Note } from '@/types/skill'

defineProps<{
  skill: LaidOutSkill
  notes: Note[]
  loading: boolean
  editMode: boolean
}>()

const emit = defineEmits<{ close: []; edit: [slug: string] }>()
</script>

<template>
  <section class="panel">
    <header>
      <div class="head-text">
        <span class="label">{{ skill.tier }} · Lv.{{ skill.level }}</span>
        <h2>{{ skill.name }}</h2>
      </div>
      <div class="head-actions">
        <button v-if="editMode" class="icon" type="button" title="編輯這個節點" @click="emit('edit', skill.slug)">✎</button>
        <button class="icon" type="button" title="關閉" @click="emit('close')">×</button>
      </div>
    </header>

    <div class="progress">
      <span class="mono lv">Lv.{{ skill.level }}</span>
      <span class="bar"><span class="fill" :style="{ width: `${skill.progress}%` }" /></span>
      <span class="mono pct">{{ skill.progress }}%</span>
    </div>

    <p class="blurb">{{ skill.blurb }}</p>

    <ul class="tags">
      <li v-for="tag in skill.tags" :key="tag" class="mono">{{ tag }}</li>
    </ul>

    <hr />

    <div class="section-head">
      <span class="label">notes</span>
      <span class="mono meta">{{ skill.noteCount }} entries</span>
    </div>

    <p v-if="loading" class="mono meta">載入中…</p>
    <p v-else-if="notes.length === 0" class="mono meta">這個技能還沒有筆記。</p>
    <ul v-else class="notes">
      <li v-for="note in notes" :key="note.slug">
        <RouterLink :to="`/notes/${note.slug}`">
          <span class="note-head">
            <span class="mono date">{{ note.date.slice(5) }}</span>
            <span class="note-title">{{ note.title }}</span>
          </span>
          <span class="excerpt">{{ note.excerpt }}</span>
        </RouterLink>
      </li>
    </ul>

    <template v-if="skill.works.length">
      <hr />
      <div class="section-head">
        <span class="label">works</span>
        <span class="mono meta">{{ skill.works.length }} projects</span>
      </div>
      <ul class="works">
        <li v-for="work in skill.works" :key="work.url">
          <a :href="work.url" target="_blank" rel="noreferrer">
            <span class="work-head">
              <span class="work-title">{{ work.title }}</span>
              <span class="mono kind">{{ work.kind }} ↗</span>
            </span>
            <span class="excerpt">{{ work.desc }}</span>
            <span class="mono stack">{{ work.stack }}</span>
          </a>
        </li>
      </ul>
    </template>
  </section>
</template>

<style scoped src="@/styles/components/SkillDetailPanel.css"></style>
