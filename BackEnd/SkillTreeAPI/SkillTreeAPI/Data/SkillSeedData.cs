using SkillTreeAPI.Core.Enums;
using SkillTreeAPI.Core.Models;

namespace SkillTreeAPI.Data;

public static class SkillSeedData
{
    public static List<Skill> All { get; } = new()
    {
        new Skill(
            id: "1",
            slug: "linux",
            name: "Linux / Shell",
            tier: Tier.Foundation,
            parent: null,
            number: 4,
            progress: 88,
            blurb: "所有東西的地板。權限、程序、檔案系統，還有讓我少打幾百次字的 shell script。",
            tags: new List<string> { "bash", "systemd", "vim" },
            position: new Position(300, 792),
            notesDir: "notes/linux",
            noteCount: 4,
            works: new List<Work>
            {
                new Work(
                    title: "dotfiles",
                    description: "我自己的 zsh / tmux / nvim 設定，一行指令裝到新機器上。",
                    kind: Kind.Repo,
                    stack: "Bash · Stow · Make",
                    url: "https://github.com/example/dotfiles"),
            },
            pending: null),

        new Skill(
            id: "2",
            slug: "git",
            name: "Git & 版本控制",
            tier: Tier.Foundation,
            parent: null,
            number: 4,
            progress: 90,
            blurb: "不只是 commit 和 push。分支策略決定了整個團隊怎麼協作，也決定了 CI 要怎麼設計。",
            tags: new List<string> { "rebase", "trunk-based", "hooks" },
            position: new Position(620, 802),
            notesDir: "notes/git",
            noteCount: 3,
            works: new List<Work>(),
            pending: null),

        new Skill(
            id: "3",
            slug: "network",
            name: "Networking",
            tier: Tier.Foundation,
            parent: null,
            number: 3,
            progress: 62,
            blurb: "排查問題時最常回來的地方。DNS、TLS、路由，弄懂之後很多「玄學問題」就不玄了。",
            tags: new List<string> { "tcp/ip", "dns", "tls" },
            position: new Position(940, 792),
            notesDir: "notes/network",
            noteCount: 3,
            works: new List<Work>(),
            pending: null),

        new Skill(
            id: "4",
            slug: "docker",
            name: "Docker / 容器",
            tier: Tier.Build,
            parent: "linux",
            number: 4,
            progress: 85,
            blurb: "容器不是輕量 VM。理解 namespace 與 layer 之後，映像檔才會又小又快。",
            tags: new List<string> { "dockerfile", "multi-stage", "registry" },
            position: new Position(268, 604),
            notesDir: "notes/docker",
            noteCount: 3,
            works: new List<Work>
            {
                new Work(
                    title: "note-api",
                    description: "自己寫的筆記後端，容器化並推上 registry，映像 90MB。",
                    kind: Kind.Repo,
                    stack: "Go · Docker · PostgreSQL",
                    url: "https://github.com/example/note-api"),
            },
            pending: null),

        new Skill(
            id: "5",
            slug: "db",
            name: "資料庫",
            tier: Tier.Build,
            parent: "git",
            number: 2,
            progress: 45,
            blurb: "維運的資料庫和開發用的資料庫是兩件事。備份、還原、連線池才是我現在的重點。",
            tags: new List<string> { "postgres", "backup", "index" },
            position: new Position(596, 616),
            notesDir: "notes/db",
            noteCount: 2,
            works: new List<Work>(),
            pending: null),

        new Skill(
            id: "6",
            slug: "cicd",
            name: "CI / CD",
            tier: Tier.Build,
            parent: "git",
            number: 3,
            progress: 70,
            blurb: "整條路上最有成就感的一段：從 push 到部署完成，全部自動跑完。",
            tags: new List<string> { "github actions", "pipeline", "artifact" },
            position: new Position(928, 604),
            notesDir: "notes/cicd",
            noteCount: 3,
            works: new List<Work>
            {
                new Work(
                    title: "ci-templates",
                    description: "可重複使用的 Actions workflow 範本，四個專案共用。",
                    kind: Kind.Repo,
                    stack: "GitHub Actions · YAML",
                    url: "https://github.com/example/ci-templates"),
            },
            pending: null),

        new Skill(
            id: "7",
            slug: "k8s",
            name: "Kubernetes",
            tier: Tier.Orchestrate,
            parent: "docker",
            number: 2,
            progress: 42,
            blurb: "目前投入最多時間的地方。宣告式設定的思維一旦轉過來，看什麼都不一樣。",
            tags: new List<string> { "deployment", "service", "helm" },
            position: new Position(248, 414),
            notesDir: "notes/k8s",
            noteCount: 3,
            works: new List<Work>
            {
                new Work(
                    title: "homelab-k8s",
                    description: "三台舊筆電組的 k3s 叢集，跑我自己的服務與監控。",
                    kind: Kind.Repo,
                    stack: "k3s · Helm · Traefik",
                    url: "https://github.com/example/homelab-k8s"),
            },
            pending: null),

        new Skill(
            id: "8",
            slug: "iac",
            name: "Terraform / Ansible",
            tier: Tier.Orchestrate,
            parent: "cicd",
            number: 2,
            progress: 38,
            blurb: "把基礎設施寫成程式碼。state 的概念是我卡最久、也最值得的一關。",
            tags: new List<string> { "terraform", "ansible", "state" },
            position: new Position(596, 424),
            notesDir: "notes/iac",
            noteCount: 2,
            works: new List<Work>(),
            pending: null),

        new Skill(
            id: "9",
            slug: "cloud",
            name: "AWS / 雲端",
            tier: Tier.Orchestrate,
            parent: "network",
            number: 2,
            progress: 40,
            blurb: "先把 IAM、VPC、運算三塊弄清楚，其他服務都是這三塊的組合。",
            tags: new List<string> { "iam", "vpc", "ec2/eks" },
            position: new Position(940, 414),
            notesDir: "notes/cloud",
            noteCount: 2,
            works: new List<Work>(),
            pending: null),

        new Skill(
            id: "10",
            slug: "observ",
            name: "監控 & 可觀測性",
            tier: Tier.Operate,
            parent: "k8s",
            number: 1,
            progress: 22,
            blurb: "從「服務好像有點慢」到「這個 endpoint p99 在 08:40 開始升高」的距離。",
            tags: new List<string> { "prometheus", "grafana", "slo" },
            position: new Position(400, 228),
            notesDir: "notes/observ",
            noteCount: 2,
            works: new List<Work>
            {
                new Work(
                    title: "homelab-dashboards",
                    description: "叢集監控儀表板與告警規則，全部版本控管。",
                    kind: Kind.Repo,
                    stack: "Prometheus · Grafana · Loki",
                    url: "https://github.com/example/homelab-dashboards"),
            },
            pending: null),

        new Skill(
            id: "11",
            slug: "sec",
            name: "DevSecOps",
            tier: Tier.Operate,
            parent: "iac",
            number: 0,
            progress: 8,
            blurb: "還沒正，只讀了一些。計畫從供應鏈安全與 secret 管理切入。",
            tags: new List<string> { "secrets", "scanning", "supply chain" },
            position: new Position(800, 228),
            notesDir: "notes/sec",
            noteCount: 1,
            works: new List<Work>(),
            pending: null),
    };
}
