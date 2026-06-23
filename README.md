# imwriter

Pi 扩展：游戏文案与小说创作助手。复用 Pi 主 Agent 写作能力，通过 `.imwriter/prompt.md` 注入写作人格与工作流。

## 安装

**同一扩展只装一处**，不要全局 + 项目各装一份，否则会报 Tool conflicts。

### 创作项目（推荐）

在小说/游戏文案项目目录（如 `Story/`）中项目级安装，与团队共享 `.pi/settings.json`：

```bash
cd D:\Code\JadeGambling\Doc\Story
pi install -l git:github.com/huangmeme/imwriter
pi install -l npm:@juicesharp/rpiv-ask-user-question
pi
```

`.pi/settings.json` 示例（团队共享）：

```json
{
  "packages": [
    "git:github.com/huangmeme/imwriter",
    "npm:@juicesharp/rpiv-ask-user-question"
  ]
}
```

`ask_user_question` 提供选项卡式询问 UI（[文档](https://pi.dev/packages/@juicesharp/rpiv-ask-user-question?name=ask)）；imwriter 的 prompt 规定需要确认时必须调用它，并附带 schema 约束与失败重试说明。

### 全局安装（所有项目通用）

```bash
pi install git:github.com/huangmeme/imwriter
```

若已全局安装，**不要再**在单个项目里 `pi install -l` 同仓库。

### 更新已安装的版本

Pi 会缓存 git 包，改代码 push 后需**重新 install** 才会生效：

```bash
cd D:\Code\JadeGambling\Doc\Story
pi install -l git:github.com/huangmeme/imwriter@main
```

启动后应看到：`[imwriter] 创作根目录：D:\...\Story（直接存 参考/、作品/ 等，无 vault/）`

### 本地开发扩展代码

在 `imwriter` 仓库目录：

```bash
npm install
npm run dev    # 用 --extension 加载当前源码，勿同时 pi install .
```

模型与 API Key 由 Pi 管理（`/model`、`/login`），插件无需单独配置。

## Skills

按需调用的专项工作流位于 `skills/`（Pi 注册为 `/skill:<name>`）：

| Skill | 来源 | 用途 |
|-------|------|------|
| `criticmarkup-reviewer` | [obsidian-track-changes](https://github.com/philphilphil/obsidian-track-changes) | 在 Markdown 中插入 CriticMarkup 行内批注（评稿/track changes），不改写正文 |

## 工作流

安装后，扩展在每轮对话的 `before_agent_start` 自动 append 包内 `.imwriter/prompt.md`（写作人格、目录约定、格式、评稿规则等）。

1. **读上下文** — `MEMORY.md`、`品味/taste.md`、`参考/`、相关 `角色/`
2. **在对话中创作** — 由 Pi Agent 直接写作
3. **改已有稿** — 默认 `/skill:criticmarkup-reviewer` 行内批注，不直接删原文
4. **落盘** — 用 `write`/`edit` 写入项目根目录对应文件夹，每个内容只写一次

## 目录结构

文件保存在 **Pi 启动时的工作目录（项目根）** 下，**没有 `vault/` 层**。首次写入时自动创建：

```
Story/                 ← 项目根（在此运行 pi）
├── 参考/              # 世界观、设定
├── 作品/              # 小说、剧本
├── 角色/              # 角色卡
├── 对白/              # NPC 对白
├── 任务/              # 任务/道具文案
├── 大纲/              # 故事大纲
├── 品味/taste.md      # 写作偏好（主册）
└── MEMORY.md          # 跨会话摘要
```

创作内容纳入 Git 跟踪。可通过 `WORKSPACE_DIR` 环境变量指定其他根目录。

## 项目结构

```
src/
├── extension.ts    # session_start + before_agent_start 注入 prompt
├── config.ts       # 项目根路径配置
└── prompt.ts       # 读取 .imwriter/prompt.md
.imwriter/
└── prompt.md       # 主系统提示词（随包分发）
skills/
└── criticmarkup-reviewer/
    └── SKILL.md    # CriticMarkup 行内评稿（第三方）
```

## 开发

```bash
npm run typecheck
```
