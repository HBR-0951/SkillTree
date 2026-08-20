<script setup lang="ts">
import type { PullRequest } from '@/types/skill'

defineProps<{ pr: PullRequest }>()
const emit = defineEmits<{ again: []; done: [] }>()
</script>

<template>
  <section class="panel">
    <span class="tick">
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="var(--green)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 12.5 L9.5 18 L20 6.5" />
      </svg>
    </span>

    <div class="text">
      <h3>Pull request 已開啟</h3>
      <p>合併之後這個節點就會正式長在樹上。在那之前它以虛線顯示，不計入 Lv. 總和。</p>
    </div>

    <div class="card">
      <div class="head">
        <span class="mono num">#{{ pr.number }}</span>
        <span class="title">{{ pr.title }}</span>
      </div>
      <span class="mono branch">{{ pr.branch }} → main</span>
    </div>

    <div class="actions">
      <a class="btn-primary" :href="pr.url" target="_blank" rel="noreferrer">在 GitHub 打開 ↗</a>
      <button class="btn-ghost" type="button" @click="emit('again')">再加一個</button>
      <button class="btn-ghost" type="button" @click="emit('done')">完成</button>
    </div>
  </section>
</template>

<style scoped src="@/styles/components/PrSuccess.css"></style>
