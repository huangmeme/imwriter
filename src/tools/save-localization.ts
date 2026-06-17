import { Type } from '@sinclair/typebox';
import type { ExtensionAPI } from '@earendil-works/pi-coding-agent';
import { writeLocalization } from '../store/vault.js';
import { SAVE_ONCE_GUIDELINE } from './guidelines.js';

const LOCALIZE_FORMAT = `
本地化输出格式：
- 原文段落
- 各目标语言对照（保持专有名词一致）
- 可用表格：| 原文 | en | ja | ...
术语表 glossary 中的词必须统一译法。
`.trim();

export function registerSaveLocalizationTool(pi: ExtensionAPI) {
  pi.registerTool({
    name: 'save_localization',
    label: '保存本地化稿',
    description: '将多语言稿存入项目根 作品/{标题}-i18n.md。对话中写完后调用一次。',
    promptSnippet: 'save_localization: save multilingual variant under 作品/',
    promptGuidelines: [
      SAVE_ONCE_GUIDELINE,
      LOCALIZE_FORMAT,
    ],
    parameters: Type.Object({
      title: Type.String({ description: '作品标题' }),
      content: Type.String({ description: '多语言对照 Markdown 正文' }),
      target_langs: Type.Array(Type.String(), { description: '目标语言代码，如 ["en","ja"]' }),
    }),
    async execute(_toolCallId, params) {
      const path = writeLocalization({
        title: params.title,
        content: params.content,
        target_langs: params.target_langs,
      });
      return {
        content: [{ type: 'text' as const, text: `本地化稿已保存到 ${path}` }],
        details: {},
      };
    },
  });
}
