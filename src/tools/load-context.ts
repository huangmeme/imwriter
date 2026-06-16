import { Type } from '@sinclair/typebox';
import type { ExtensionAPI } from '@earendil-works/pi-coding-agent';
import { buildWritingBrief } from '../store/vault.js';

export function registerLoadContextTool(pi: ExtensionAPI) {
  pi.registerTool({
    name: 'load_context',
    label: '加载创作上下文',
    description: '开始写作前调用。聚合 vault 中的品味规则、参考设定、可选角色卡，返回写作 brief。你应基于此 brief 在对话中直接创作，然后用 save_* 工具存盘。',
    promptSnippet: 'load_context: load taste, reference settings, and optional character card before writing',
    promptGuidelines: [
      '开始写小说、对白、任务、大纲前，先调 load_context 获取设定与品味。',
      'load_context 只返回上下文，不会代写。你在对话中创作完成后，调对应的 save_* 工具存盘。',
    ],
    parameters: Type.Object({
      character: Type.Optional(Type.String({ description: '可选：指定角色名，注入角色卡' })),
    }),
    async execute(_toolCallId, params) {
      const brief = buildWritingBrief(params.character);
      return {
        content: [{ type: 'text' as const, text: brief }],
        details: { hasCharacter: !!params.character },
      };
    },
  });
}
