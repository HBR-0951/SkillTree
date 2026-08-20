/**
 * 假資料 — 後端還沒寫好前用這個撐畫面。
 * 資料形狀完全照 src/types/skill.ts，之後把 api/*.ts 裡註解掉的 request() 打開即可。
 */
import type {
  DiffFile,
  DiffPreview,
  Note,
  NoteDetail,
  PullRequest,
  Skill,
  SkillDraft,
} from '@/types/skill'

/** 模擬網路延遲，讓 loading 狀態看得出來 */
export function delay<T>(value: T, ms = 260): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

type NoteSeed = [date: string, title: string, excerpt: string]

interface SkillSeed {
  id: string
  name: string
  tier: Skill['tier']
  parent: string | null
  level: number
  progress: number
  blurb: string
  tags: string[]
  position: { x: number; y: number }
  notes: NoteSeed[]
  works: Skill['works']
}

const SEEDS: SkillSeed[] = [
  {
    id: 'linux',
    name: 'Linux / Shell',
    tier: 'foundation',
    parent: null,
    level: 4,
    progress: 88,
    blurb: '所有東西的地板。權限、程序、檔案系統，還有讓我少打幾百次字的 shell script。',
    tags: ['bash', 'systemd', 'vim'],
    position: { x: 300, y: 792 },
    notes: [
      ['2026-08-14', 'systemd unit 從零寫到能開機自啟', 'service / timer / socket 三種 unit 的差別，還有 journalctl 該怎麼追。'],
      ['2026-07-28', '權限模型：rwx 之外的 setuid 與 ACL', '為什麼 chmod 777 不是解法，以及 getfacl 的實際用途。'],
      ['2026-07-09', '把重複操作收成 shell function', 'set -euo pipefail、trap 清理、參數檢查的固定寫法。'],
      ['2026-06-22', '用 strace 找出卡住的程序', '一次線上服務無回應的排查流程紀錄。'],
    ],
    works: [
      {
        title: 'dotfiles',
        kind: 'repo',
        desc: '我自己的 zsh / tmux / nvim 設定，一行指令裝到新機器上。',
        stack: 'Bash · Stow · Make',
        url: 'https://github.com/example/dotfiles',
      },
    ],
  },
  {
    id: 'git',
    name: 'Git & 版本控制',
    tier: 'foundation',
    parent: null,
    level: 4,
    progress: 90,
    blurb: '不只是 commit 和 push。分支策略決定了整個團隊怎麼協作，也決定了 CI 要怎麼設計。',
    tags: ['rebase', 'trunk-based', 'hooks'],
    position: { x: 620, y: 802 },
    notes: [
      ['2026-08-02', 'rebase 與 merge 我最後怎麼選', '個人分支 rebase、進主線 merge，加上不可 force-push 的界線。'],
      ['2026-07-15', 'Trunk-based 與 Git Flow 的實務差異', '發佈頻率如何反過來決定分支模型。'],
      ['2026-06-30', 'pre-commit hook 擋掉低級錯誤', 'lint、secret 掃描、commit message 格式。'],
    ],
    works: [],
  },
  {
    id: 'network',
    name: 'Networking',
    tier: 'foundation',
    parent: null,
    level: 3,
    progress: 62,
    blurb: '排查問題時最常回來的地方。DNS、TLS、路由，弄懂之後很多「玄學問題」就不玄了。',
    tags: ['tcp/ip', 'dns', 'tls'],
    position: { x: 940, y: 792 },
    notes: [
      ['2026-08-17', '一次 DNS 解析失敗的完整排查', 'dig 逐層追、TTL 快取、resolv.conf 的優先序。'],
      ['2026-07-21', 'TLS 握手到底在做什麼', '憑證鏈驗證、SNI，以及憑證過期造成的典型症狀。'],
      ['2026-06-12', '子網切分與 CIDR 手算練習', '為了看懂 VPC 設定而補的基礎。'],
    ],
    works: [],
  },
  {
    id: 'docker',
    name: 'Docker / 容器',
    tier: 'build',
    parent: 'linux',
    level: 4,
    progress: 85,
    blurb: '容器不是輕量 VM。理解 namespace 與 layer 之後，映像檔才會又小又快。',
    tags: ['dockerfile', 'multi-stage', 'registry'],
    position: { x: 268, y: 604 },
    notes: [
      ['2026-08-11', 'multi-stage build 讓映像從 1.2G 降到 90M', '編譯階段與執行階段分離，加上 distroless base。'],
      ['2026-07-25', 'layer cache 的命中規則', 'COPY 的順序如何決定重建速度。'],
      ['2026-07-03', '容器裡不要跑 root', '非 root user、唯讀檔案系統、capability 最小化。'],
    ],
    works: [
      {
        title: 'note-api',
        kind: 'repo',
        desc: '自己寫的筆記後端，容器化並推上 registry，映像 90MB。',
        stack: 'Go · Docker · PostgreSQL',
        url: 'https://github.com/example/note-api',
      },
    ],
  },
  {
    id: 'db',
    name: '資料庫',
    tier: 'build',
    parent: 'git',
    level: 2,
    progress: 45,
    blurb: '維運的資料庫和開發用的資料庫是兩件事。備份、還原、連線池才是我現在的重點。',
    tags: ['postgres', 'backup', 'index'],
    position: { x: 596, y: 616 },
    notes: [
      ['2026-08-06', 'PostgreSQL 備份還原實際演練一次', 'pg_dump 與 PITR 的取捨，還有還原比備份難的原因。'],
      ['2026-07-18', '連線數爆掉之後才學會的連線池', 'PgBouncer 的三種 pool mode。'],
    ],
    works: [],
  },
  {
    id: 'cicd',
    name: 'CI / CD',
    tier: 'build',
    parent: 'git',
    level: 3,
    progress: 70,
    blurb: '整條路上最有成就感的一段：從 push 到部署完成，全部自動跑完。',
    tags: ['github actions', 'pipeline', 'artifact'],
    position: { x: 928, y: 604 },
    notes: [
      ['2026-08-19', 'GitHub Actions 建一條會過的 pipeline', 'lint → test → build → push image → deploy 的實際 workflow。'],
      ['2026-08-04', 'cache 讓 CI 從 9 分鐘變 2 分鐘', '依賴快取與 layer 快取的設定位置。'],
      ['2026-07-12', '把 secret 從 pipeline 裡拿出來', 'OIDC 短期憑證取代長期 access key。'],
    ],
    works: [
      {
        title: 'ci-templates',
        kind: 'repo',
        desc: '可重複使用的 Actions workflow 範本，四個專案共用。',
        stack: 'GitHub Actions · YAML',
        url: 'https://github.com/example/ci-templates',
      },
    ],
  },
  {
    id: 'k8s',
    name: 'Kubernetes',
    tier: 'orchestrate',
    parent: 'docker',
    level: 2,
    progress: 42,
    blurb: '目前投入最多時間的地方。宣告式設定的思維一旦轉過來，看什麼都不一樣。',
    tags: ['deployment', 'service', 'helm'],
    position: { x: 248, y: 414 },
    notes: [
      ['2026-08-18', 'Pod 一直 CrashLoopBackOff 的六種原因', '從 describe 到 logs --previous 的固定排查順序。'],
      ['2026-08-09', 'Service 與 Ingress 的流量路徑', 'ClusterIP / NodePort / LoadBalancer 到底差在哪。'],
      ['2026-07-30', 'requests 與 limits 設錯的後果', 'QoS class 如何影響誰先被 OOMKill。'],
    ],
    works: [
      {
        title: 'homelab-k8s',
        kind: 'repo',
        desc: '三台舊筆電組的 k3s 叢集，跑我自己的服務與監控。',
        stack: 'k3s · Helm · Traefik',
        url: 'https://github.com/example/homelab-k8s',
      },
    ],
  },
  {
    id: 'iac',
    name: 'Terraform / Ansible',
    tier: 'orchestrate',
    parent: 'cicd',
    level: 2,
    progress: 38,
    blurb: '把基礎設施寫成程式碼。state 的概念是我卡最久、也最值得的一關。',
    tags: ['terraform', 'ansible', 'state'],
    position: { x: 596, y: 424 },
    notes: [
      ['2026-08-15', 'Terraform state 到底存了什麼', 'remote backend、鎖，以及手改資源後的災難。'],
      ['2026-07-27', 'module 化：不要複製貼上 tf 檔', '變數、輸出、版本鎖定的組織方式。'],
    ],
    works: [],
  },
  {
    id: 'cloud',
    name: 'AWS / 雲端',
    tier: 'orchestrate',
    parent: 'network',
    level: 2,
    progress: 40,
    blurb: '先把 IAM、VPC、運算三塊弄清楚，其他服務都是這三塊的組合。',
    tags: ['iam', 'vpc', 'ec2/eks'],
    position: { x: 940, y: 414 },
    notes: [
      ['2026-08-12', 'IAM policy 讀懂的那一天', 'Principal / Action / Resource / Condition 四段結構。'],
      ['2026-07-22', 'VPC 自己手動搭一次', '子網、路由表、NAT gateway 與帳單的關係。'],
    ],
    works: [],
  },
  {
    id: 'observ',
    name: '監控 & 可觀測性',
    tier: 'operate',
    parent: 'k8s',
    level: 1,
    progress: 22,
    blurb: '從「服務好像有點慢」到「這個 endpoint p99 在 08:40 開始升高」的距離。',
    tags: ['prometheus', 'grafana', 'slo'],
    position: { x: 400, y: 228 },
    notes: [
      ['2026-08-16', 'Prometheus 的四種 metric type', 'counter、gauge、histogram、summary 各自的用途。'],
      ['2026-08-01', '第一塊自己做的 Grafana 儀表板', '從 golden signals 開始選指標。'],
    ],
    works: [
      {
        title: 'homelab-dashboards',
        kind: 'repo',
        desc: '叢集監控儀表板與告警規則，全部版本控管。',
        stack: 'Prometheus · Grafana · Loki',
        url: 'https://github.com/example/homelab-dashboards',
      },
    ],
  },
  {
    id: 'sec',
    name: 'DevSecOps',
    tier: 'operate',
    parent: 'iac',
    level: 0,
    progress: 8,
    blurb: '還沒正式開始，只讀了一些。計畫從供應鏈安全與 secret 管理切入。',
    tags: ['secrets', 'scanning', 'supply chain'],
    position: { x: 800, y: 228 },
    notes: [['2026-07-06', '先弄懂 secret 管理的幾種做法', '環境變數、Vault、雲端 secret manager 的比較筆記。']],
    works: [],
  },
]

function slugify(skillId: string, index: number) {
  return `${skillId}-${String(index + 1).padStart(2, '0')}`
}

export const MOCK_SKILLS: Skill[] = SEEDS.map((seed) => ({
  id: seed.id,
  name: seed.name,
  tier: seed.tier,
  parent: seed.parent,
  level: seed.level,
  progress: seed.progress,
  blurb: seed.blurb,
  tags: seed.tags,
  position: seed.position,
  notesDir: `notes/${seed.id}/`,
  noteCount: seed.notes.length,
  works: seed.works,
}))

export const MOCK_NOTES: Record<string, Note[]> = Object.fromEntries(
  SEEDS.map((seed) => [
    seed.id,
    seed.notes.map(([date, title, excerpt], i) => ({
      slug: slugify(seed.id, i),
      title,
      excerpt,
      date,
      tags: seed.tags.slice(0, 2),
    })),
  ]),
)

const FLAT_NOTES = SEEDS.flatMap((seed) =>
  seed.notes.map(([date, title, excerpt], i) => ({
    skillId: seed.id,
    skillName: seed.name,
    note: {
      slug: slugify(seed.id, i),
      title,
      excerpt,
      date,
      tags: seed.tags.slice(0, 2),
    } satisfies Note,
  })),
)

export function mockRecentNotes(limit: number) {
  return [...FLAT_NOTES]
    .sort((a, b) => (a.note.date < b.note.date ? 1 : -1))
    .slice(0, limit)
    .map((entry) => ({ ...entry.note, skillId: entry.skillId, skillName: entry.skillName }))
}

/** 只有這篇寫了完整內文，其他篇用同樣結構的示意內容 */
const FULL_BODY = `
<p>這週有一個 Pod 一直 <code>CrashLoopBackOff</code>，前後花了兩小時。整理成固定順序之後，後面再遇到就快很多。</p>
<h2 id="check-order">固定的排查順序</h2>
<ol>
  <li><code>kubectl describe pod</code> — 先看 Events，八成的答案在這裡。</li>
  <li><code>kubectl logs --previous</code> — 看上一個已死容器的輸出。</li>
  <li><code>kubectl get events --sort-by=.lastTimestamp</code> — 確認是不是節點層級的問題。</li>
</ol>
<h2 id="six-causes">六種常見原因</h2>
<h3 id="cause-config">設定錯誤</h3>
<p>ConfigMap 或 Secret 沒掛上，程式啟動就找不到必要的環境變數。Events 會顯示 <code>CreateContainerConfigError</code>。</p>
<pre><code>kubectl describe pod api-7d9f -n prod | grep -A5 Events</code></pre>
<h3 id="cause-probe">Liveness probe 太急</h3>
<p>應用啟動要 20 秒，probe 卻在第 5 秒開始打，於是被反覆重啟。<code>initialDelaySeconds</code> 沒設好就會這樣。</p>
<blockquote>Probe 的目的是判斷「還活著嗎」，不是「啟動好了嗎」。啟動階段用 startupProbe。</blockquote>
<h3 id="cause-oom">記憶體不足被 OOMKill</h3>
<p><code>limits.memory</code> 設得比實際用量低，容器一到上限就被殺。<code>describe</code> 裡會看到 <code>Reason: OOMKilled</code>。</p>
<h2 id="takeaway">結論</h2>
<p>大部分情況不需要看程式碼，Events 加上前一個容器的 log 就夠了。真正花時間的是沒有照順序看。</p>
`.trim()

function genericBody(title: string, excerpt: string) {
  return `
<p>${excerpt}</p>
<h2 id="context">為什麼記這篇</h2>
<p>這篇是「${title}」的筆記。內文之後由後端從 <code>notes/</code> 底下的 markdown 渲染後回傳，目前顯示的是假資料。</p>
<h2 id="notes">重點</h2>
<ul>
  <li>先弄清楚問題的邊界，再動手。</li>
  <li>把可以重複的操作寫成腳本或設定檔。</li>
  <li>紀錄失敗的過程，比紀錄成功的結果有用。</li>
</ul>
<pre><code># 示意指令
echo "replace me with real content"</code></pre>
`.trim()
}

export function mockNoteDetail(slug: string): NoteDetail {
  const index = FLAT_NOTES.findIndex((entry) => entry.note.slug === slug)
  if (index === -1) throw new Error(`找不到筆記：${slug}`)

  const entry = FLAT_NOTES[index]!
  const prev = FLAT_NOTES[index - 1]
  const next = FLAT_NOTES[index + 1]
  const isFull = slug === 'k8s-01'

  return {
    ...entry.note,
    skillId: entry.skillId,
    skillName: entry.skillName,
    contentHtml: isFull ? FULL_BODY : genericBody(entry.note.title, entry.note.excerpt),
    headings: isFull
      ? [
          { id: 'check-order', text: '固定的排查順序', level: 2 },
          { id: 'six-causes', text: '六種常見原因', level: 2 },
          { id: 'cause-config', text: '設定錯誤', level: 3 },
          { id: 'cause-probe', text: 'Liveness probe 太急', level: 3 },
          { id: 'cause-oom', text: '記憶體不足被 OOMKill', level: 3 },
          { id: 'takeaway', text: '結論', level: 2 },
        ]
      : [
          { id: 'context', text: '為什麼記這篇', level: 2 },
          { id: 'notes', text: '重點', level: 2 },
        ],
    updated: null,
    prev: prev ? { slug: prev.note.slug, title: prev.note.title } : null,
    next: next ? { slug: next.note.slug, title: next.note.title } : null,
    sourcePath: `notes/${entry.skillId}/${slug}.md`,
  }
}

/** 假的 YAML diff：新增技能時全部是 + 行，索引檔改一行 */
export function mockDiff(draft: SkillDraft, mode: 'create' | 'edit'): DiffPreview {
  const id = draft.id ?? draft.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const yaml = [
    `id: ${id}`,
    `name: ${draft.name}`,
    `tier: ${draft.tier}`,
    `parent: ${draft.parent ?? 'null'}`,
    `level: ${draft.level}`,
    `progress: ${draft.progress}`,
    'blurb: >-',
    `  ${draft.blurb || '（尚未填寫）'}`,
    'tags:',
    ...draft.tags.map((t) => `  - ${t}`),
    'position:',
    `  x: ${draft.position?.x ?? 700}`,
    `  y: ${draft.position?.y ?? 110}`,
    `notes_dir: ${draft.notesDir || `notes/${id}/`}`,
    'works:',
    ...draft.workUrls.map((u) => `  - url: ${u}`),
    `created: ${new Date().toISOString().slice(0, 10)}`,
  ]

  const skillFile: DiffFile = {
    path: `skills/${id}.yaml`,
    status: mode === 'create' ? 'added' : 'modified',
    lines: yaml.map((text, i) => ({ sign: '+' as const, text, line: i + 1 })),
  }

  const parentId = draft.parent ?? 'root'
  const indexFile: DiffFile = {
    path: `skills/${parentId}.yaml`,
    status: 'modified',
    lines: [
      { sign: ' ', text: 'children:', line: 12 },
      { sign: '-', text: '  - aws-cloud', line: 13 },
      { sign: '+', text: '  - aws-cloud', line: 13 },
      { sign: '+', text: `  - ${id}`, line: 14 },
    ],
  }

  const files = mode === 'create' ? [skillFile, indexFile] : [skillFile]

  return {
    files,
    additions: files.reduce((n, f) => n + f.lines.filter((l) => l.sign === '+').length, 0),
    deletions: files.reduce((n, f) => n + f.lines.filter((l) => l.sign === '-').length, 0),
    checks: [
      { label: 'YAML 語法檢查通過', level: 'ok' },
      { label: `前置技能 ${parentId} 存在`, level: 'ok' },
      { label: 'id 未重複', level: 'ok' },
      { label: `${draft.notesDir || `notes/${id}/`} 目前是空的`, level: 'warn' },
    ],
  }
}

let prCounter = 127

export function mockPullRequest(draft: SkillDraft, action: 'add' | 'update' | 'remove'): PullRequest {
  const id = draft.id ?? draft.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  const verb = action === 'add' ? 'Add' : action === 'update' ? 'Update' : 'Remove'
  prCounter += 1
  return {
    number: prCounter,
    url: `https://github.com/example/skill-tree/pull/${prCounter}`,
    branch: `skill/${id}`,
    title: `${verb} skill: ${draft.name}`,
  }
}
