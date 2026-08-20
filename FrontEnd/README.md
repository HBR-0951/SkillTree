# Skill Tree — 前端 (Vue 3 + TypeScript)

DevOps 技能樹網站的前端。技能資料存在 repo 的 `skills/*.yaml`，一個技能一支檔案；
所有變更都透過後端開 Pull Request，前端不直接寫檔。

## 跑起來

```bash
cd frontend
npm install
npm run dev          # http://localhost:5173，/api 會 proxy 到 localhost:8080
npm run typecheck
npm run build
```

環境變數（`.env.local`）：

```
VITE_API_BASE=/api                      # 前端呼叫的 API 前綴
VITE_API_TARGET=http://localhost:8080   # dev proxy 的後端位址
```

## 檔案結構

```
src/
  types/skill.ts            資料模型（對應 skills/*.yaml）
  api/client.ts             fetch 包裝 + ApiError（目前未使用，接真後端時才派上場）
  api/mock.ts               假資料 + 假 diff / PR 產生器
  api/skills.ts             所有 endpoint
  lib/layout.ts             自動排版、連線路徑、拖拉夾邊、同層吸附
  lib/appearance.ts         進度 → 節點亮度 / 連線亮度
  composables/useSkillTree.ts    讀樹、選節點、讀筆記、拖拉後更新座標
  composables/useSkillEditor.ts  新增／編輯流程狀態機（form → diff → submitted）
  router/index.ts           路由：/ 、/notes/:slug 、404
  views/TreeView.vue        首頁（技能樹 + 右側面板 + 新增流程）
  views/NoteView.vue        單篇筆記閱讀頁
  views/NotFoundView.vue    404
  components/SkillTree.vue       畫布、葉子、連線、拖拉
  components/SkillNode.vue       單一節點卡片
  components/SkillDetailPanel.vue 右側筆記 + Works
  components/SkillFormPanel.vue  新增／編輯表單（含 danger zone）
  components/YamlDiff.vue        YAML diff 確認
  components/PrSuccess.vue       PR 已送出
  App.vue                        RouterView 外殼
```

## 路由

| Path | 畫面 |
| --- | --- |
| `/` | 技能樹。`?skill=kubernetes` 會自動打開該節點的面板 |
| `/notes/:slug` | 單篇筆記（麵包屑、目錄、上/下一篇）|

筆記內容由後端把 markdown 渲染並**淨化**後以 `contentHtml` 回传（前端用 `v-html` 插入，
所以淨化必須在後端做）。`headings` 用來產生右側目錄，`id` 要與 HTML 裡的 heading id 一致。

## 目前是假資料模式

後端還沒寫，所以 `src/api/skills.ts` 與 `src/api/notes.ts` 裡的 `request(...)` 全部被**註解掉**，
直接回 `src/api/mock.ts` 的假資料（含 11 個技能、29 篇筆記、diff 與 PR 結果，並加上約 200–500ms 延遲讓 loading 看得到）。

接真後端時只要做兩件事：

1. 把那兩支檔案裡 `// return request(...)` 的註解打開
2. 刪掉下方的 `return delay(mock...)` 與 `./mock` 的 import

`src/api/mock.ts` 可以當成後端的回傳範例——裡面的資料形状就是 API 該長的樣子。

## 後端需要提供的 API

| Method | Path | 說明 |
| --- | --- | --- |
| GET | `/api/skills` | 回傳 `Skill[]`，整棵樹 |
| GET | `/api/skills/:id/notes` | 該技能的 `Note[]` |
| GET | `/api/notes/:slug` | 單篇筆記 `NoteDetail`（含渲染好的 `contentHtml`）|
| GET | `/api/notes/recent?limit=7` | 最新筆記，附 `skillId` / `skillName` |
| POST | `/api/skills/preview` | 收 `SkillDraft`，回 `DiffPreview`，**不寫任何東西** |
| POST | `/api/skills` | 收 `SkillDraft`，開新增 PR，回 `PullRequest` |
| PUT | `/api/skills/:id` | 收 `SkillDraft`，開修改 PR |
| DELETE | `/api/skills/:id` | body `{ reassignChildrenTo }`，開刪除 PR |

型別定義全部在 `src/types/skill.ts`，後端照那個 shape 回就好。

### 三個約定

1. **`pending` 節點不計入 Lv. 總和** — PR 還沒合併前不該讓數字先跳。
   後端在 `Skill.pending` 帶上 `{ prNumber, prUrl }`，前端就會畫成虛線。
2. **刪除不動筆記檔案** — 只斷連結，`notes/` 底下的 markdown 保留。
3. **`position` 只影響版面** — 節點關係由 `parent` 決定；`position` 是 null 時走自動排版。

## 還沒做的

- 單篇筆記頁的程式碼 high‑light（目前沒有 syntax highlighting）
- 手機版：1240×1030 的畫布在手機上不可用，需要另做折疊清單
- 認證：Edit mode 目前沒有權限判斷，實際上要看登入者是不是 repo owner
