import { Type } from '@sinclair/typebox';
import type { ExtensionAPI } from '@earendil-works/pi-coding-agent';
import { writeDialogue } from '../store/vault.js';

const DIALOGUE_FORMAT = `
对白输出格式参考：
- **linear**：按场景顺序写对白，用 **角色名**：台词
- **branch**：用节点 ID，如 [N1] 文本 → 选项 A→N2 / 选项 B→N3
- **barks**：短句列表，适合 NPC 随机台词池
`.trim();

export function registerSaveDialogueTool(pi: ExtensionAPI) {
  pi.registerTool({
    name: 'save_dialogue',
    label: '保存对白',
    description: '将已写好的游戏对白存入 vault/对白/。你在对话中写完对白后调用。',
    promptSnippet: 'save_dialogue: save NPC dialogue to vault after you write it',
    promptGuidelines: [
      '写 NPC 对白流程：load_context(character=...) → 在对话中创作 → save_dialogue。',
      DIALOGUE_FORMAT,
    ],
    parameters: Type.Object({
      character: Type.String({ description: '角色名' }),
      title: Type.String({ description: '对白标题/场景名' }),
      content: Type.String({ description: '完整对白 Markdown 正文' }),
      mode: Type.Union([
        Type.Literal('linear'),
        Type.Literal('branch'),
        Type.Literal('barks'),
      ], { default: 'linear', description: 'linear=线性，branch=分支树，barks=台词池' }),
      tone: Type.Optional(Type.String({ description: '语气/氛围' })),
    }),
    async execute(_toolCallId, params) {
      const path = writeDialogue({
        character: params.character,
        title: params.title,
        content: params.content,
        mode: params.mode ?? 'linear',
        tone: params.tone,
      });
      return {
        content: [{ type: 'text' as const, text: `对白已保存到 ${path}` }],
        details: { path, mode: params.mode ?? 'linear' },
      };
    },
  });
}
