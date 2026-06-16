import { Type } from '@sinclair/typebox';
import type { ExtensionAPI } from '@earendil-works/pi-coding-agent';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { subdirPath } from '../store/vault.js';

const CRITIQUE_GUIDE = `
请对以上文本进行四维度评审（每项 1-10 分，附简短评语）：
1. **叙事张力** — 冲突、节奏、悬念
2. **人物塑造** — 性格鲜明、动机合理、对白有个性
3. **文笔风格** — 用词、句式、画面感
4. **设定一致性** — 与已有世界观/角色是否吻合

最后给出：总分（四项均值）、主要优点、优先修改建议（最多 3 条）。
`.trim();

export function registerCritiqueTool(pi: ExtensionAPI) {
  pi.registerTool({
    name: 'critique_draft',
    label: '评稿',
    description: '加载待评稿件与评稿指南。用户说「评价」「打分」时调用，然后你在对话中给出四维度评审。',
    promptSnippet: 'critique_draft: load draft text and critique rubric for review',
    promptGuidelines: [
      '用户要求评稿时，调 critique_draft 加载文本，再在对话中按四维度打分。',
      '评稿结果可在对话中展示；用户要求保存时，用 save_work category=reference 或告知路径。',
    ],
    parameters: Type.Object({
      text: Type.Optional(Type.String({ description: '直接传入待评文本；与 work_title 二选一' })),
      work_title: Type.Optional(Type.String({ description: '从 vault/作品/{title}.md 读取' })),
    }),
    async execute(_toolCallId, params) {
      let draft = params.text?.trim() ?? '';
      if (!draft && params.work_title) {
        const path = join(subdirPath('works'), `${params.work_title.replace(/[\\/:*?"<>|]/g, '_')}.md`);
        if (existsSync(path)) {
          draft = readFileSync(path, 'utf-8');
        } else {
          return {
            content: [{ type: 'text' as const, text: `作品不存在：${path}` }],
            details: {},
          };
        }
      }
      if (!draft) {
        return {
          content: [{ type: 'text' as const, text: '请提供 text 或 work_title 参数。' }],
          details: {},
        };
      }

      const body = `### 待评稿件\n\n${draft}\n\n---\n\n${CRITIQUE_GUIDE}`;
      return {
        content: [{ type: 'text' as const, text: body }],
        details: {},
      };
    },
  });
}
