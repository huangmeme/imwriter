import { Type } from '@sinclair/typebox';
import type { ExtensionAPI } from '@earendil-works/pi-coding-agent';
import { writeOutline } from '../store/vault.js';

const OUTLINE_FORMAT = `
大纲结构参考：
- **three_act**：第一幕（铺垫）→ 第二幕（对抗）→ 第三幕（解决）
- **hero_journey**：启程 → 试炼 → 启示 → 归来
- **game_chapter**：按章节/关卡列出：章节名、核心冲突、玩法钩子、伏笔

每节拍注明：场景/章节、冲突点、转折、伏笔位。
`.trim();

export function registerSaveOutlineTool(pi: ExtensionAPI) {
  pi.registerTool({
    name: 'save_outline',
    label: '保存故事大纲',
    description: '将已写好的章节大纲/剧情节拍存入 vault/大纲/。你在对话中写完后再调用。',
    promptSnippet: 'save_outline: save story outline or beat sheet to vault',
    promptGuidelines: [
      '写大纲：load_context → 在对话中创作 → save_outline。',
      OUTLINE_FORMAT,
    ],
    parameters: Type.Object({
      title: Type.String({ description: '大纲标题' }),
      content: Type.String({ description: '完整 Markdown 大纲' }),
      structure: Type.Union([
        Type.Literal('three_act'),
        Type.Literal('hero_journey'),
        Type.Literal('game_chapter'),
      ], { default: 'game_chapter', description: '结构类型' }),
      chapter_count: Type.Optional(Type.Number({ description: '章节/节拍数量' })),
    }),
    async execute(_toolCallId, params) {
      const path = writeOutline({
        title: params.title,
        content: params.content,
        structure: params.structure ?? 'game_chapter',
        chapter_count: params.chapter_count,
      });
      return {
        content: [{ type: 'text' as const, text: `大纲已保存到 ${path}` }],
        details: { path, structure: params.structure ?? 'game_chapter' },
      };
    },
  });
}
