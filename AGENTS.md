## Learned User Preferences

- 用中文沟通。
- 不要用独立的 ai SDK 或 OpenAI 兼容 API 层；创作由 Pi 主 Agent 完成，工具只负责读设定与存盘。
- 创作内容放在 Pi 启动时的工作目录（项目根）下，如 `参考/`、`作品/`，不要 `vault/` 层。
- 避免重复写入：写作前 `load_context` 一次，完成后 `save_*` 一次；不要用 Pi 内置 `write`/`edit` 再调用 `save_*`。
- 团队用法优先项目级 `pi install -l git:github.com/...`，通过 `.pi/settings.json` 共享扩展配置。
- imwriter 扩展只装一处（全局或项目二选一），避免 Tool conflicts。
- 仓库不预置创作子目录（`参考/`、`作品/` 等），运行时按需创建。
- 运行时产生的创作内容纳入 Git 跟踪，不要加入 `.gitignore`。

## Learned Workspace Facts

- 本仓库是 `pi-narrative-writer`：Pi 扩展包，辅助游戏文案与小说创作。
- 入口为 `src/extension.ts`，通过 `registerTool` 注册 11 个叙事工具。
- 文件读写层在 `src/store/vault.ts`；路径由 `src/config.ts` 的 `workspaceDir` 与 `contentSubdirs` 控制。
- 默认 `workspaceDir` 为 `process.cwd()`，可用 `WORKSPACE_DIR` 环境变量覆盖。
- 创作目录包括 `参考/`、`作品/`、`角色/`、`对白/`、`任务/`、`大纲/`、`批注/`、`品味/`。
- `.gitignore` 忽略 `node_modules`、`dist`、`.env`、`.pi/git/`、`.pi/npm/`，不忽略创作目录。
- 参考实现曾位于 `ZCodeProject/game-narrative-ai`，当前主力开发在 `Documents/imwriter`。
