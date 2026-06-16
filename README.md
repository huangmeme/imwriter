# pi-narrative-writer

Pi 扩展：游戏文案与小说创作助手。复用 Pi 主 Agent 写作能力，工具负责读设定、存盘与工作流引导。

## 安装

```bash
cd imwriter
npm install
pi install .
```

或本地开发：

```bash
npm run dev
```

模型与 API Key 由 Pi 管理（`/model`、`/login`），插件无需单独配置。

## 工作流

1. **load_context** — 加载品味、参考设定、角色卡
2. **在对话中创作** — 由 Pi Agent 直接写作
3. **save_*** — 将成品存入 vault

vault 中的品味与参考设定会在每次 Agent 启动时自动注入 system prompt。

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

## vault 目录

**仓库不预置 vault 子目录**。首次存盘时自动创建：

```
vault/
├── 参考/      # 世界观等设定（save_work category=reference）
├── 作品/      # 小说、剧本、本地化稿
├── 角色/      # 角色卡
├── 对白/      # NPC 对白
├── 任务/      # 任务/道具文案
├── 大纲/      # 故事大纲
├── 批注/      # 评稿等批注
└── 品味/      # taste.md 品味规则
```

运行时产生的 vault 内容纳入 Git 跟踪，可随仓库提交上传。

可通过环境变量 `VAULT_DIR` 指向其他目录（如已有 Obsidian vault）。

## 项目结构

```
src/
├── extension.ts    # Pi 扩展入口
├── config.ts       # vault 路径配置
├── context.ts      # 自动注入品味/设定
├── tools/          # 11 个工具
└── store/
    ├── vault.ts    # 文件读写（按需建目录）
    └── schemas.ts  # frontmatter 类型
```

## 开发

```bash
npm run typecheck
```
