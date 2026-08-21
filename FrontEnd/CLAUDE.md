# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Vue 3 + TypeScript frontend for a personal DevOps "skill tree" website. Renders skills as a tree/graph, lets you view notes per skill, and edit skills through a PR-review flow (see below). The backend is a separate ASP.NET Core repo at `D:\SideProject\SkillTreeAPI` (sibling directory, separate git repo).

## Commands

```bash
npm install
npm run dev          # http://localhost:5173, /api proxied to VITE_API_TARGET
npm run typecheck    # vue-tsc --noEmit
npm run build         # typecheck + vite build
npm run preview
```

Env vars (`.env.local`, not committed):
```
VITE_API_BASE=/api                      # prefix used by src/api/client.ts
VITE_API_TARGET=http://localhost:5028   # dev-server proxy target (see vite.config.ts); currently pointed at the local SkillTreeAPI ASP.NET Core project
```

There is no lint script and no test suite currently configured — `typecheck` is the only static check.

## Architecture

**Data model** (`src/types/skill.ts`) mirrors the backend's `Skill` shape one-to-one — if the backend model changes, update this file first since almost everything else derives its types from it. Note `Skill.id` is currently typed `string` with a comment that it'll become a real DB-backed id later — the backend (`SkillTreeAPI.Core`) already switched to a `long` EF Core identity column, so this type is stale relative to the backend and should be reconciled during integration.

**API layer** (`src/api/`):
- `client.ts` — thin `fetch` wrapper (`request<T>()`) + `ApiError`, used for calls that talk to a real backend.
- `skills.ts` / `notes.ts` — one function per endpoint. **Naming convention: function names match the backend controller action names** (`Get*` prefix — `getSkills`, `getSkillNotes`, `getNote` — not `fetch*`), so it's obvious which frontend function calls which backend action. Apply this to any new API function.
- **Mixed integration state**: `getSkills()`, `getSkillNotes()`, `getNote()` already call the real backend via `request()`; every other function (`getRecentNotes`, `previewSkill`, `createSkill`, `updateSkill`, `deleteSkill`) still returns mock data from `mock.ts` with the real `request(...)` call commented out directly above each mock fallback. To wire one up: uncomment the `request(...)` line and delete the mock fallback beneath it.
- `mock.ts` — fake skills/notes/diff/PR generator with artificial delay; doubles as the reference for what each endpoint's real response shape should look like.

**Rendering pipeline**: `composables/useSkillTree.ts` loads skills and drives selection/notes/drag-to-reposition; `lib/layout.ts` computes auto-layout, connector paths, and edge snapping when a `Skill.position` is null; `lib/appearance.ts` maps progress → node/edge brightness. `components/SkillTree.vue` is the canvas that consumes the laid-out nodes; `SkillNode.vue` renders one node.

**Edit flow is a state machine, not a form submit**: `composables/useSkillEditor.ts` drives `SkillFormPanel.vue` (form) → `YamlDiff.vue` (diff preview, calls `previewSkill` which must not persist anything) → `PrSuccess.vue` (after `createSkill`/`updateSkill` opens a PR). A skill with a `pending` PR is rendered with a dashed connector and **excluded from level totals** until the PR merges.

**⚠️ Backend data-source mismatch to resolve before finishing integration**: this README/frontend was designed around skill data living in `skills/*.yaml` files in a repo, with every write going through a GitHub Pull Request (no direct writes) — that's why `createSkill`/`updateSkill`/`deleteSkill` all return a `PullRequest`, not the updated `Skill`. The actual `SkillTreeAPI` backend currently built is a conventional EF Core + SQL Server CRUD API with no YAML/PR involvement at all. Either the backend needs a YAML+PR write path added, or this frontend's write flow needs to be redesigned around direct CRUD responses — don't assume one matches the other without checking current backend state first.

**Two other conventions from the README worth keeping in mind:**
- Notes: backend renders markdown to `contentHtml` and must sanitize it server-side — frontend inserts it via `v-html` as-is.
- Deleting a skill only removes the tree link; the underlying `notes/` markdown file is kept.
