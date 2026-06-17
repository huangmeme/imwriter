# pi-narrative-writer

Pi 扩展：游戏文案与小说创作助手。复用 Pi 主 Agent 写作能力，工具负责读设定、存盘与工作流引导。

## 安装

**同一扩展只装一处**，不要全局 + 项目各装一份，否则会报 Tool conflicts。

### 创作项目（推荐）

在小说/游戏文案项目目录（如 `Story/`）中项目级安装，与团队共享 `.pi/settings.json`：

```bash
cd D:\Code\JadeGambling\Doc\Story
pi install -l git:github.com/huangmeme/imwriter
pi
```

### 全局安装（所有项目通用）

```bash
pi install git:github.com/huangmeme/imwriter
```

若已全局安装，**不要再**在单个项目里 `pi install -l` 同仓库。

### 本地开发扩展代码

在 `imwriter` 仓库目录：

```bash
npm install
npm run dev    # 用 --extension 加载当前源码，勿同时 pi install .
```

模型与 API Key 由 Pi 管理（`/model`、`/login`），插件无需单独配置。

## 工作流

1. **load_context** — 加载品味、参考设定、角色卡（每次写作前调用一次）
2. **在对话中创作** — 由 Pi Agent 直接写作
3. **save_*** — 将成品存入项目根目录对应文件夹（每个内容只存一次）

设定**不会**自动重复注入；也不要用 Pi 内置 `write`/`edit` 与 `save_*` 各写一遍。

## 工具

| 工具 | 作用 |
|------|------|
| `load_context` | 聚合设定与品味，返回写作 brief |
| `save_work` | 保存小说/剧本/参考设定 |
| `save_dialogue` | 保存 NPC 对白 |
| `save_quest` | 保存任务/道具文案 |
| `save_outline` | 保存故事大纲 |
| `save_localization` | 保存多语言稿 |
| `manage_character` | 角色卡 CRUD |
| `critique_draft` | 加载评稿指南 |
| `check_consistency` | 加载全部设定供矛盾分析 |
| `remember_taste` | 记录品味规则 |
| `read_file` | 读任意文本文件 |

## 目录结构

文件保存在 **Pi 启动时的工作目录（项目根）** 下，**没有 `vault/` 层**。首次存盘时自动创建：

```
Story/                 ← 项目根（在此运行 pi）
├── 参考/              # 世界观等（save_work category=reference）
├── 作品/              # 小说、剧本、本地化稿
├── 角色/
├── 对白/
├── 任务/
├── 大纲/
├── 批注/
└── 品味/taste.md
```

创作内容纳入 Git 跟踪。可通过 `WORKSPACE_DIR` 环境变量指定其他根目录。

## 项目结构

```
src/
├── extension.ts    # Pi 扩展入口
├── config.ts       # 项目根路径配置
├── tools/          # 11 个工具
└── store/
    ├── vault.ts    # 文件读写（按需建目录）
    └── schemas.ts  # frontmatter 类型
```

## 开发

```bash
npm run typecheck
```
