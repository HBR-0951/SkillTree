import { reactive, ref } from 'vue'
import { createSkill, deleteSkill, previewSkill, updateSkill } from '@/api/skills'
import type { DiffPreview, PullRequest, Skill, SkillDraft, Tier } from '@/types/skill'

export type FlowStep = 'idle' | 'form' | 'position' | 'diff' | 'submitted'

function emptyDraft(parent: string | null, tier: Tier): SkillDraft {
  return {
    name: '',
    tier,
    parent,
    level: 1,
    progress: 20,
    blurb: '',
    tags: [],
    position: null,
    notesDir: '',
    workUrls: [],
  }
}

function draftFrom(skill: Skill): SkillDraft {
  return {
    slug: skill.slug,
    name: skill.name,
    tier: skill.tier,
    parent: skill.parent,
    level: skill.level,
    progress: skill.progress,
    blurb: skill.blurb,
    tags: [...skill.tags],
    position: skill.position ? { ...skill.position } : null,
    notesDir: skill.notesDir,
    workUrls: skill.works.map((w) => w.url),
  }
}

export function useSkillEditor() {
  const editMode = ref(false)
  const step = ref<FlowStep>('idle')
  const mode = ref<'create' | 'edit'>('create')
  const draft = ref<SkillDraft>(emptyDraft(null, 'foundation'))
  const diff = ref<DiffPreview | null>(null)
  const pr = ref<PullRequest | null>(null)
  const busy = ref(false)
  const errors = reactive<Record<string, string>>({})

  function startCreate(parent: Skill | null) {
    mode.value = 'create'
    draft.value = emptyDraft(parent?.slug ?? null, nextTier(parent?.tier))
    diff.value = null
    pr.value = null
    step.value = 'form'
  }

  function startEdit(skill: Skill) {
    mode.value = 'edit'
    draft.value = draftFrom(skill)
    diff.value = null
    pr.value = null
    step.value = 'form'
  }

  function cancel() {
    step.value = 'idle'
    diff.value = null
    pr.value = null
  }

  function validate(): boolean {
    for (const key of Object.keys(errors)) delete errors[key]
    if (draft.value.name.trim().length < 2) errors.name = '請輸入技能名稱'
    if (draft.value.progress < 0 || draft.value.progress > 100) errors.progress = '進度需在 0–100'
    if (draft.value.notesDir && !draft.value.notesDir.endsWith('/')) errors.notesDir = '請以 / 結尾'
    return Object.keys(errors).length === 0
  }

  async function toDiff() {
    if (!validate()) return
    busy.value = true
    try {
      diff.value = await previewSkill(draft.value)
      step.value = 'diff'
    } finally {
      busy.value = false
    }
  }

  async function submit() {
    busy.value = true
    try {
      pr.value =
        mode.value === 'edit' && draft.value.slug
          ? await updateSkill(draft.value.slug, draft.value)
          : await createSkill(draft.value)
      step.value = 'submitted'
    } finally {
      busy.value = false
    }
  }

  async function remove(slug: string, reassignChildrenTo: string | null) {
    busy.value = true
    try {
      pr.value = await deleteSkill(slug, reassignChildrenTo)
      step.value = 'submitted'
    } finally {
      busy.value = false
    }
  }

  return { editMode, step, mode, draft, diff, pr, busy, errors, startCreate, startEdit, cancel, toDiff, submit, remove }
}

const ORDER: Tier[] = ['foundation', 'build', 'orchestrate', 'operate']

/** 新節點預設放在前置技能的上一層 */
function nextTier(parentTier: Tier | undefined): Tier {
  if (!parentTier) return 'foundation'
  const i = ORDER.indexOf(parentTier)
  return ORDER[Math.min(i + 1, ORDER.length - 1)] ?? 'operate'
}
