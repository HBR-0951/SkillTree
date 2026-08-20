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

<style scoped src="@/styles/components/YamlDiff.css"></style>
