import { Type } from '@sinclair/typebox';
import type { ExtensionAPI } from '@earendil-works/pi-coding-agent';
import { buildWritingBrief } from '../store/vault.js';

export function registerLoadContextTool(pi: ExtensionAPI) {
  pi.registerTool({
    name: 'load_context',
    label: '加载创作上下文',
    description: '开始写作前调用一次。聚合项目根目录下品味/参考/角色卡，返回写作 brief。设定仅通过本工具加载，勿重复 read_file。',
    promptSnippet: 'load_context: load taste, reference settings, and optional character card before writing',
    promptGuidelines: [
      '开始写小说、对白、任务、大纲前，先调 load_context 一次。',
      'load_context 只读上下文不代写；创作完成后用 save_* 存盘一次，不要用 write/edit。',
    ],
    parameters: Type.Object({
      character: Type.Optional(Type.String({ description: '可选：指定角色名，注入角色卡' })),
    }),
    async execute(_toolCallId, params) {
      const brief = buildWritingBrief(params.character);
      return {
        content: [{ type: 'text' as const, text: brief }],
        details: {},
      };
    },
  });
}
