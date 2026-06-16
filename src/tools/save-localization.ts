import { Type } from '@sinclair/typebox';
import type { ExtensionAPI } from '@earendil-works/pi-coding-agent';
import { writeLocalization } from '../store/vault.js';

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
    description: '将已写好的多语言对照稿存入 vault/作品/{标题}-i18n.md。你在对话中完成翻译/本地化后调用。',
    promptSnippet: 'save_localization: save multilingual variant to vault',
    promptGuidelines: [
      '本地化流程：提供原文与 glossary → 在对话中创作多语言稿 → save_localization。',
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
        details: { path, langs: params.target_langs },
      };
    },
  });
}
