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
          <RouterLink :to="{ path: '/', query: { skill: note.skillSlug } }">{{ note.skillName }}</RouterLink>
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
            <RouterLink class="skill-link" :to="{ path: '/', query: { skill: note.skillSlug } }">
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

<style scoped src="@/styles/views/NoteView.css"></style>
