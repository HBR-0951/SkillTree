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

<style scoped>
.panel {
  border: 1px solid var(--green-soft);
  border-radius: 16px;
  background: linear-gradient(180deg, #16210f 0%, #100c08 100%);
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.tick {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1.5px solid var(--green);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 24px -4px rgba(63, 185, 80, 0.6);
}
.text {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
h3 {
  margin: 0;
  font-size: 21px;
  font-weight: 600;
  letter-spacing: -0.02em;
}
p {
  margin: 0;
  font-size: 13px;
  line-height: 1.7;
  color: var(--text-muted);
  text-wrap: pretty;
}
.card {
  border: 1px solid #2e2116;
  border-radius: 10px;
  padding: 13px;
  background: #140f0a;
  display: flex;
  flex-direction: column;
  gap: 7px;
}
.head {
  display: flex;
  align-items: center;
  gap: 9px;
}
.num {
  font-size: 11px;
  color: var(--green);
}
.title {
  font-size: 13.5px;
  font-weight: 600;
}
.branch {
  font-size: 11px;
  color: #8b7050;
}
.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.actions .btn-primary {
  text-align: center;
}
</style>
