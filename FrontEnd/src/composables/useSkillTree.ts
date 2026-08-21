import { computed, onMounted, ref, shallowRef } from 'vue'
import { getSkillNotes, getSkills } from '@/api/skills'
import { buildEdges, layout } from '@/lib/layout'
import type { Note, Skill } from '@/types/skill'

export function useSkillTree() {
  const skills = shallowRef<Skill[]>([])
  const loading = ref(true)
  const error = ref<string | null>(null)

  const selectedSlug = ref<string | null>(null)
  const notes = shallowRef<Note[]>([])
  const notesLoading = ref(false)

  const nodes = computed(() => layout(skills.value))
  const edges = computed(() => buildEdges(nodes.value))
  const selected = computed(() => nodes.value.find((n) => n.slug === selectedSlug.value) ?? null)

  const totals = computed(() => ({
    level: skills.value.reduce((sum, s) => sum + (s.pending ? 0 : s.level), 0),
    notes: skills.value.reduce((sum, s) => sum + s.noteCount, 0),
    works: skills.value.reduce((sum, s) => sum + s.works.length, 0),
  }))

  async function load() {
    loading.value = true
    error.value = null
    try {
      skills.value = await getSkills()
    } catch (e) {
      error.value = e instanceof Error ? e.message : '讀取技能樹失敗'
    } finally {
      loading.value = false
    }
  }

  async function select(slug: string | null) {
    selectedSlug.value = slug
    notes.value = []
    if (!slug) return
    notesLoading.value = true
    try {
      notes.value = await getSkillNotes(slug)
    } catch (e) {
      error.value = e instanceof Error ? e.message : '讀取筆記失敗'
    } finally {
      notesLoading.value = false
    }
  }

  /** 拖拉後先在前端更新座標，等 PR 合併才是真的 */
  function moveNode(slug: string, x: number, y: number) {
    skills.value = skills.value.map((s) => (s.slug === slug ? { ...s, position: { x, y } } : s))
  }

  onMounted(load)

  return {
    skills,
    nodes,
    edges,
    loading,
    error,
    selectedSlug,
    selected,
    notes,
    notesLoading,
    totals,
    load,
    select,
    moveNode,
  }
}
