<script setup lang="ts">
import type { DiffPreview } from '@/types/skill'

defineProps<{ diff: DiffPreview; busy: boolean }>()
const emit = defineEmits<{ submit: []; back: [] }>()

const statusLabel: Record<string, string> = {
  added: 'new file',
  modified: 'modified',
  removed: 'removed',
}
</script>

<template>
  <section class="wrap">
    <div class="files">
      <div class="summary mono">
        <span>{{ diff.files.length }} files changed</span>
        <span class="add">+{{ diff.additions }}</span>
        <span class="del">−{{ diff.deletions }}</span>
      </div>

      <article v-for="file in diff.files" :key="file.path" class="file">
        <header>
          <span class="mono path">{{ file.path }}</span>
          <span class="mono status" :class="file.status">{{ statusLabel[file.status] }}</span>
        </header>
        <div class="lines mono">
          <div v-for="line in file.lines" :key="line.line" class="line" :class="line.sign === '+' ? 'plus' : line.sign === '-' ? 'minus' : ''">
            <span class="n">{{ line.line }}</span>
            <span class="sign">{{ line.sign }}</span>
            <span class="text">{{ line.text }}</span>
          </div>
        </div>
      </article>
    </div>

    <aside class="panel">
      <span class="label">open pull request</span>
      <ul class="checks">
        <li v-for="check in diff.checks" :key="check.label" :class="check.level">
          <span class="mark">{{ check.level === 'ok' ? '✓' : check.level === 'warn' ? '!' : '×' }}</span>
          {{ check.label }}
        </li>
      </ul>
      <div class="actions">
        <button class="btn-primary" type="button" :disabled="busy" @click="emit('submit')">
          {{ busy ? '送出中…' : '送出 Pull Request' }}
        </button>
        <button class="btn-ghost" type="button" @click="emit('back')">回上一步</button>
      </div>
    </aside>
  </section>
</template>

<style scoped>
.wrap {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 340px;
  gap: 20px;
  align-items: start;
}
.files {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
}
.summary {
  display: flex;
  gap: 14px;
  font-size: 12px;
  color: var(--text);
}
.summary .add {
  color: var(--green);
}
.summary .del {
  color: var(--danger);
}

.file {
  border: 1px solid var(--wood-line);
  border-radius: 12px;
  overflow: hidden;
  background: #100c08;
}
.file header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 14px;
  background: #1a130d;
  border-bottom: 1px solid var(--wood-line);
}
.path {
  font-size: 11.5px;
  color: var(--label);
}
.status {
  font-size: 10px;
  padding: 2px 7px;
  border-radius: 4px;
  border: 1px solid var(--wood-faint);
  background: #1e1610;
  color: var(--text-dim);
}
.status.added {
  background: #16210f;
  border-color: var(--green-soft);
  color: var(--green-bright);
}

.lines {
  font-size: 12.5px;
  line-height: 1.85;
  padding: 12px 0;
  overflow-x: auto;
}
.line {
  display: flex;
}
.line.plus {
  background: rgba(63, 185, 80, 0.1);
}
.line.minus {
  background: rgba(229, 72, 77, 0.1);
}
.n {
  width: 46px;
  flex: none;
  text-align: right;
  padding-right: 12px;
  color: #5c4c3a;
}
.sign {
  width: 18px;
  flex: none;
  color: #5c4c3a;
}
.plus .sign {
  color: var(--green);
}
.minus .sign {
  color: var(--danger);
}
.text {
  white-space: pre;
  color: var(--text-dim);
}
.plus .text {
  color: #b8e6bf;
}
.minus .text {
  color: #e8b3b5;
}

.panel {
  border: 1px solid #2e2116;
  border-radius: 16px;
  background: var(--panel);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.checks {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 9px;
}
.checks li {
  display: flex;
  gap: 9px;
  font-size: 12.5px;
  color: var(--text-dim);
}
.checks .mark {
  color: var(--green);
}
.checks .warn .mark,
.checks li.warn {
  color: var(--label);
}
.checks li.error {
  color: var(--danger);
}
.actions {
  display: flex;
  gap: 10px;
}
.actions .btn-primary {
  flex: 1;
}
</style>
