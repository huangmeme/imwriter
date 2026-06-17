import { Type } from '@sinclair/typebox';
import type { ExtensionAPI } from '@earendil-works/pi-coding-agent';
import { writeWork } from '../store/vault.js';
import { SAVE_ONCE_GUIDELINE } from './guidelines.js';

export function registerSaveWorkTool(pi: ExtensionAPI) {
  pi.registerTool({
    name: 'save_work',
    label: '保存作品',
    description: '将小说、剧本或世界观设定存入项目根下的 作品/ 或 参考/。对话中写完后调用一次。',
    promptSnippet: 'save_work: save prose, script, or reference document under project root',
    promptGuidelines: [
      SAVE_ONCE_GUIDELINE,
      '小说/剧本 → category=work，存 作品/；世界观等 → category=reference，存 参考/。',
      '覆盖已有文件前先确认。',
    ],
    parameters: Type.Object({
      title: Type.String({ description: '标题，用于文件名' }),
      content: Type.String({ description: '完整 Markdown 正文' }),
      category: Type.Union([
        Type.Literal('work'),
        Type.Literal('reference'),
      ], { default: 'work', description: 'work=作品，reference=参考设定' }),
      format: Type.Optional(Type.Union([
        Type.Literal('prose'),
        Type.Literal('script'),
      ], { description: 'prose=小说，script=剧本' })),
    }),
    async execute(_toolCallId, params) {
      const path = writeWork({
        title: params.title,
        content: params.content,
        category: params.category ?? 'work',
        format: params.format,
      });
      return {
        content: [{ type: 'text' as const, text: `已保存到 ${path}` }],
        details: {},
      };
    },
  });
}
