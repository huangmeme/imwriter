import { Type } from '@sinclair/typebox';
import type { ExtensionAPI } from '@earendil-works/pi-coding-agent';
import { writeWork } from '../store/vault.js';

export function registerSaveWorkTool(pi: ExtensionAPI) {
  pi.registerTool({
    name: 'save_work',
    label: '保存作品',
    description: '将已写好的小说正文、剧本或世界观设定存入 vault。你在对话中写完后再调用此工具存盘。',
    promptSnippet: 'save_work: save prose, script, or reference document to vault',
    promptGuidelines: [
      '你在对话中完成创作后，调 save_work 存盘。',
      '小说/剧本用 category=work；世界观等设定文档用 category=reference，title 如「世界观」。',
      '覆盖已有文件前，先向用户确认。',
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
        details: { path, category: params.category ?? 'work' },
      };
    },
  });
}
