import type { ExtensionAPI } from '@earendil-works/pi-coding-agent';
import { buildContextSummary } from './store/vault.js';

/**
 * 在每次 Agent 启动前，将 vault 中的品味与参考设定注入 system prompt。
 */
export function registerContextInjection(pi: ExtensionAPI) {
  pi.on('before_agent_start', async (event) => {
    const summary = buildContextSummary();
    if (!summary.trim()) return;

    const block = [
      '',
      '---',
      '# 创作上下文（来自 vault，自动注入）',
      summary,
      '---',
      '',
    ].join('\n');

    return {
      systemPrompt: event.systemPrompt + block,
    };
  });
}
