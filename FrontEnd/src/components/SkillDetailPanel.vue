<script setup lang="ts">
import type { LaidOutSkill, Note } from '@/types/skill'

defineProps<{
  skill: LaidOutSkill
  notes: Note[]
  loading: boolean
  editMode: boolean
}>()

const emit = defineEmits<{ close: []; edit: [id: string] }>()
</script>

<template>
  <section class="panel">
    <header>
      <div class="head-text">
        <span class="label">{{ skill.tier }} · Lv.{{ skill.level }}</span>
        <h2>{{ skill.name }}</h2>
      </div>
      <div class="head-actions">
        <button v-if="editMode" class="icon" type="button" title="編輯這個節點" @click="emit('edit', skill.id)">✎</button>
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

<style scoped>
.panel {
  border: 1px solid #2e2116;
  border-radius: 18px;
  background: var(--panel);
  background-image: repeating-linear-gradient(108deg, rgba(139, 94, 52, 0.055) 0 1px, transparent 1px 6px);
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 86vh;
  overflow-y: auto;
}
header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}
.head-text {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
h2 {
  margin: 0;
  font-size: 27px;
  font-weight: 600;
  letter-spacing: -0.025em;
  line-height: 1.08;
}
.head-actions {
  display: flex;
  gap: 8px;
}
.icon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid var(--wood-line);
  background: #16100b;
  color: #9c8b78;
  font-size: 14px;
  line-height: 1;
}
.icon:hover {
  border-color: var(--wood);
  color: var(--text);
}

.progress {
  display: flex;
  align-items: center;
  gap: 12px;
}
.lv {
  font-size: 12px;
  font-weight: 600;
  color: var(--green);
}
.bar {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: #1b130d;
  border: 1px solid rgba(139, 94, 52, 0.3);
  overflow: hidden;
}
.fill {
  display: block;
  height: 100%;
  background: var(--green);
  box-shadow: 0 0 10px rgba(63, 185, 80, 0.7);
}
.pct {
  font-size: 11px;
  color: #7a6853;
}

.blurb {
  margin: 0;
  font-size: 13.5px;
  line-height: 1.7;
  color: var(--text-muted);
  text-wrap: pretty;
}

ul {
  margin: 0;
  padding: 0;
  list-style: none;
}
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}
.tags li {
  font-size: 10.5px;
  padding: 5px 9px;
  border-radius: 5px;
  background: #1e1610;
  border: 1px solid var(--wood-line);
  color: var(--label);
}

hr {
  border: none;
  height: 1px;
  background: #2e2116;
  margin: 0;
}
.section-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}
.meta {
  font-size: 10px;
  color: #5c4c3a;
}

.notes :deep(a),
.works a {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 11px 10px;
  margin: 0 -6px;
  border-radius: 9px;
  border: 1px solid transparent;
}
.notes :deep(a):hover,
.works a:hover {
  background: #1e1610;
  border-color: var(--wood-line);
}
.note-head {
  display: flex;
  align-items: baseline;
  gap: 10px;
}
.date {
  flex: none;
  width: 54px;
  font-size: 10px;
  color: #5c4c3a;
}
.note-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--text);
  line-height: 1.35;
}
.excerpt {
  font-size: 12.5px;
  color: #8e7d69;
  line-height: 1.55;
  text-wrap: pretty;
}
.notes .excerpt {
  padding-left: 64px;
}

.works li a {
  border: 1px solid var(--wood-line);
  background: #16100b;
  padding: 13px;
  margin: 0;
}
.work-head {
  display: flex;
  align-items: center;
  gap: 10px;
}
.work-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
}
.kind {
  margin-left: auto;
  font-size: 10px;
  color: var(--green);
}
.stack {
  font-size: 10.5px;
  color: #7a6853;
}
</style>
