import { Type } from '@sinclair/typebox';
import type { ExtensionAPI } from '@earendil-works/pi-coding-agent';
import { appendTaste } from '../store/vault.js';

export function registerRememberTasteTool(pi: ExtensionAPI) {
  pi.registerTool({
    name: 'remember_taste',
    label: '记住品味',
    description: '将一条写作偏好规则追加到 vault/品味/taste.md。用户说「记住：…」时调用。',
    promptSnippet: 'remember_taste: append a writing preference rule to taste.md',
    promptGuidelines: [
      '用户说「记住：…」时直接调 remember_taste。',
      '主动发现用户偏好时，先征求同意再记录。',
    ],
    parameters: Type.Object({
      rule: Type.String({ description: '要记录的品味规则' }),
      category: Type.Optional(Type.String({ description: '分类名，默认「通用」' })),
    }),
    async execute(_toolCallId, params) {
      const path = appendTaste(params.rule, params.category ?? '通用');
      return {
        content: [{ type: 'text' as const, text: `已记录品味规则到 ${path}` }],
        details: { path },
      };
    },
  });
}
