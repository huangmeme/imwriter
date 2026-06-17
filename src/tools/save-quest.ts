import { Type } from '@sinclair/typebox';
import type { ExtensionAPI } from '@earendil-works/pi-coding-agent';
import { writeQuest } from '../store/vault.js';
import { SAVE_ONCE_GUIDELINE } from './guidelines.js';

const QUEST_FORMAT = `
任务文案结构参考：
- **标题**
- **描述**（玩家可见的任务介绍）
- **目标**（可勾选项）
- **奖励**（可选）
`.trim();

export function registerSaveQuestTool(pi: ExtensionAPI) {
  pi.registerTool({
    name: 'save_quest',
    label: '保存任务文案',
    description: '将任务/道具文案存入项目根 任务/。对话中写完后调用一次。',
    promptSnippet: 'save_quest: save quest or item copy under 任务/',
    promptGuidelines: [
      SAVE_ONCE_GUIDELINE,
      QUEST_FORMAT,
    ],
    parameters: Type.Object({
      title: Type.String({ description: '任务/道具标题' }),
      content: Type.String({ description: '完整 Markdown 正文' }),
      quest_type: Type.Union([
        Type.Literal('main'),
        Type.Literal('side'),
        Type.Literal('daily'),
        Type.Literal('item'),
      ], { default: 'side', description: 'main=主线，side=支线，daily=日常，item=道具' }),
      tone: Type.Optional(Type.String({ description: '语气风格' })),
    }),
    async execute(_toolCallId, params) {
      const path = writeQuest({
        title: params.title,
        content: params.content,
        quest_type: params.quest_type ?? 'side',
        tone: params.tone,
      });
      return {
        content: [{ type: 'text' as const, text: `任务文案已保存到 ${path}` }],
        details: {},
      };
    },
  });
}
