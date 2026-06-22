/**
 * Pi 叙事创作扩展入口（prompt-only：系统提示驱动工作流）
 */
import type { ExtensionAPI } from '@earendil-works/pi-coding-agent';
import { getWorkspaceDir, setSessionCwd } from './config.js';
import { getImwriterPrompt, shouldInjectPrompt } from './prompt.js';

export default function (pi: ExtensionAPI) {
  pi.on('session_start', async (_event, ctx) => {
    setSessionCwd(ctx.cwd);
    process.stderr.write(
      `[imwriter] 创作根目录：${getWorkspaceDir()}（直接存 参考/、作品/ 等，无 vault/）\n`,
    );
  });

  pi.on('before_agent_start', async (event) => {
    const imwriterPrompt = getImwriterPrompt();
    if (!shouldInjectPrompt(event.systemPrompt, imwriterPrompt)) return;

    return {
      systemPrompt: `${event.systemPrompt}\n\n${imwriterPrompt}`,
    };
  });
}
