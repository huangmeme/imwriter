## Learned User Preferences

- 用中文沟通。
- 不要用独立的 ai SDK 或 OpenAI 兼容 API 层；创作由 Pi 主 Agent 完成。
- 创作内容放在 Pi 启动时的工作目录（项目根）下，如 `参考/`、`作品/`，不要 `vault/` 层。
- 避免重复写入：每个成品只落盘一次；用 `write`/`edit` 直接写到对应目录。
- 团队用法优先项目级 `pi install -l git:github.com/...`，通过 `.pi/settings.json` 共享扩展配置。
- imwriter 扩展只装一处（全局或项目二选一），避免 Tool conflicts。
- 仓库不预置创作子目录（`参考/`、`作品/` 等），运行时按需创建。
- 运行时产生的创作内容纳入 Git 跟踪，不要加入 `.gitignore`。

## Learned Workspace Facts

- 本仓库是 `pi-narrative-writer`：Pi 扩展包，辅助游戏文案与小说创作（prompt-only）。
- 入口为 `src/extension.ts`：`session_start` 设置创作根目录；`before_agent_start` 注入 `.imwriter/prompt.md`。
- 主提示词在 `.imwriter/prompt.md`，包含人格、工作流、格式、评稿、落盘约定；无独立 skills 目录。
- 路径由 `getWorkspaceDir()` 控制（无 `vault/` 层），可用 `WORKSPACE_DIR` 环境变量覆盖。
- 创作目录包括 `参考/`、`作品/`、`角色/`、`对白/`、`任务/`、`大纲/`、`品味/`、`MEMORY.md`。
- `.gitignore` 忽略 `node_modules`、`dist`、`.env`、`.pi/git/`、`.pi/npm/`，不忽略创作目录。
- 参考实现曾位于 `ZCodeProject/game-narrative-ai`；写作提示词优化来自 `Documents/imwriter-mimo`。
