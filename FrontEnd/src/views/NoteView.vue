<script setup lang="ts">
import { ref, watch } from 'vue'
import { fetchNote } from '@/api/notes'
import type { NoteDetail } from '@/types/skill'

const props = defineProps<{ slug: string }>()

const note = ref<NoteDetail | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

watch(
  () => props.slug,
  async (slug) => {
    loading.value = true
    error.value = null
    note.value = null
    try {
      note.value = await fetchNote(slug)
    } catch (e) {
      error.value = e instanceof Error ? e.message : '讀取筆記失敗'
    } finally {
      loading.value = false
    }
  },
  { immediate: true },
)

function formatDate(iso: string) {
  const [y, m, d] = iso.split('-')
  return `${y}.${m}.${d}`
}
</script>

<template>
  <div class="page">
    <p v-if="loading" class="mono state">載入筆記…</p>

    <div v-else-if="error" class="state-block">
      <p class="mono error">{{ error }}</p>
      <RouterLink class="btn-ghost" to="/">← 回技能樹</RouterLink>
    </div>

    <article v-else-if="note" class="note">
      <header>
        <nav class="crumbs mono">
          <RouterLink to="/">skill tree</RouterLink>
          <span class="sep">/</span>
          <RouterLink :to="{ path: '/', query: { skill: note.skillId } }">{{ note.skillName }}</RouterLink>
        </nav>

        <h1>{{ note.title }}</h1>

        <div class="meta mono">
          <span>{{ formatDate(note.date) }}</span>
          <span v-if="note.updated" class="dim">updated {{ formatDate(note.updated) }}</span>
          <span class="dim">{{ note.sourcePath }}</span>
        </div>

        <ul v-if="note.tags.length" class="tags">
          <li v-for="tag in note.tags" :key="tag" class="mono">{{ tag }}</li>
        </ul>
      </header>

      <div class="body">
        <!-- contentHtml 由後端把 markdown 渲染並淨化後回傳 -->
        <div class="prose" v-html="note.contentHtml" />

        <aside class="rail">
          <div v-if="note.headings.length" class="rail-block">
            <span class="label">on this page</span>
            <ul class="toc">
              <li v-for="h in note.headings" :key="h.id" :class="`lv${h.level}`">
                <a :href="`#${h.id}`">{{ h.text }}</a>
              </li>
            </ul>
          </div>

          <div class="rail-block">
            <span class="label">skill</span>
            <RouterLink class="skill-link" :to="{ path: '/', query: { skill: note.skillId } }">
              {{ note.skillName }} →
            </RouterLink>
          </div>
        </aside>
      </div>

      <footer>
        <RouterLink v-if="note.prev" class="adj" :to="`/notes/${note.prev.slug}`">
          <span class="mono dir">← 上一篇</span>
          <span class="adj-title">{{ note.prev.title }}</span>
        </RouterLink>
        <span v-else class="adj empty" />

        <RouterLink v-if="note.next" class="adj right" :to="`/notes/${note.next.slug}`">
          <span class="mono dir">下一篇 →</span>
          <span class="adj-title">{{ note.next.title }}</span>
        </RouterLink>
        <span v-else class="adj empty" />
      </footer>
    </article>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: var(--bg-page);
  padding: 40px 40px 80px;
}
.state,
.state-block {
  max-width: 820px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: flex-start;
  font-size: 13px;
  color: var(--text-dim);
}
.error {
  color: var(--danger);
}

.note {
  max-width: 1120px;
  margin: 0 auto;
}

header {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding-bottom: 26px;
  border-bottom: 1px solid #241a11;
}
.crumbs {
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}
.crumbs a {
  color: var(--label);
}
.crumbs a:hover {
  color: var(--green-bright);
}
.sep {
  color: #5c4c3a;
}

h1 {
  margin: 0;
  max-width: 20ch;
  font-size: 40px;
  line-height: 1.12;
  font-weight: 600;
  letter-spacing: -0.03em;
  text-wrap: pretty;
}

.meta {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  font-size: 11.5px;
  color: var(--label);
}
.meta .dim {
  color: #7a6853;
}

ul {
  margin: 0;
  padding: 0;
  list-style: none;
}
.tags {
  display: flex;
  gap: 7px;
  flex-wrap: wrap;
}
.tags li {
  font-size: 10.5px;
  padding: 5px 9px;
  border-radius: 5px;
  background: #1e1610;
  border: 1px solid var(--wood-line);
  color: var(--label);
}

.body {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 220px;
  gap: 48px;
  padding-top: 32px;
  align-items: start;
}

.rail {
  position: sticky;
  top: 32px;
  display: flex;
  flex-direction: column;
  gap: 22px;
}
.rail-block {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.toc {
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-left: 1px solid #2e2116;
}
.toc a {
  display: block;
  padding-left: 12px;
  font-size: 12.5px;
  line-height: 1.45;
  color: #8e7d69;
}
.toc a:hover {
  color: var(--text);
}
.toc .lv3 a {
  padding-left: 24px;
  font-size: 12px;
}
.skill-link {
  font-size: 13.5px;
  font-weight: 500;
  color: var(--label);
}
.skill-link:hover {
  color: var(--green-bright);
}

footer {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 56px;
  padding-top: 24px;
  border-top: 1px solid #241a11;
}
.adj {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 16px 18px;
  border: 1px solid var(--wood-line);
  border-radius: 12px;
  background: var(--card);
}
.adj:hover {
  border-color: var(--wood);
}
.adj.right {
  text-align: right;
}
.adj.empty {
  border: none;
  background: none;
}
.dir {
  font-size: 10.5px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #7a6853;
}
.adj-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--text);
  line-height: 1.4;
}

/* ---- markdown 內容 ---- */
.prose {
  font-size: 16px;
  line-height: 1.78;
  color: #d8cbba;
  max-width: 68ch;
}
.prose :deep(h2) {
  margin: 44px 0 14px;
  font-size: 24px;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--text);
  scroll-margin-top: 24px;
}
.prose :deep(h3) {
  margin: 32px 0 10px;
  font-size: 18px;
  font-weight: 600;
  color: var(--text);
  scroll-margin-top: 24px;
}
.prose :deep(p) {
  margin: 0 0 18px;
  text-wrap: pretty;
}
.prose :deep(ul),
.prose :deep(ol) {
  margin: 0 0 18px;
  padding-left: 22px;
  list-style: revert;
}
.prose :deep(li) {
  margin-bottom: 8px;
}
.prose :deep(a) {
  color: var(--green-bright);
  text-decoration: underline;
  text-decoration-color: rgba(126, 231, 135, 0.35);
  text-underline-offset: 3px;
}
.prose :deep(code) {
  font-family: var(--font-mono);
  font-size: 13.5px;
  padding: 2px 6px;
  border-radius: 5px;
  background: #1e1610;
  border: 1px solid var(--wood-line);
  color: var(--label);
}
.prose :deep(pre) {
  margin: 0 0 22px;
  padding: 16px 18px;
  border-radius: 12px;
  background: #100c08;
  border: 1px solid var(--wood-line);
  overflow-x: auto;
}
.prose :deep(pre code) {
  padding: 0;
  border: none;
  background: none;
  color: #c8dcc9;
  font-size: 13px;
  line-height: 1.75;
}
.prose :deep(blockquote) {
  margin: 0 0 20px;
  padding: 2px 0 2px 18px;
  border-left: 2px solid var(--green-soft);
  color: var(--text-muted);
}
.prose :deep(hr) {
  border: none;
  height: 1px;
  background: #2e2116;
  margin: 36px 0;
}
.prose :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 0 0 22px;
  font-size: 14px;
}
.prose :deep(th),
.prose :deep(td) {
  text-align: left;
  padding: 9px 12px;
  border-bottom: 1px solid #2e2116;
}
.prose :deep(th) {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--label);
}
.prose :deep(img) {
  max-width: 100%;
  border-radius: 12px;
  border: 1px solid var(--wood-line);
}

@media (max-width: 900px) {
  .body {
    grid-template-columns: minmax(0, 1fr);
    gap: 28px;
  }
  .rail {
    position: static;
  }
  footer {
    grid-template-columns: minmax(0, 1fr);
  }
  h1 {
    font-size: 30px;
  }
}
</style>
