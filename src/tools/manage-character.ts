import { Type } from '@sinclair/typebox';
import type { ExtensionAPI } from '@earendil-works/pi-coding-agent';
import { listCharacters, readCharacter, writeCharacter } from '../store/vault.js';

function formatCharacter(name: string): string {
  const ch = readCharacter(name);
  if (!ch) return `角色「${name}」不存在。`;
  const lines = [
    `# ${name}`,
    ch.meta.traits ? `**性格**：${String(ch.meta.traits)}` : '',
    ch.meta.voice_style ? `**说话风格**：${String(ch.meta.voice_style)}` : '',
    ch.meta.backstory ? `**背景**：${String(ch.meta.backstory)}` : '',
    ch.body ? `\n${ch.body}` : '',
  ].filter(Boolean);
  return lines.join('\n');
}

export function registerManageCharacterTool(pi: ExtensionAPI) {
  pi.registerTool({
    name: 'manage_character',
    label: '角色档案',
    description: '创建、更新、读取或列出角色卡。角色卡存入 vault/角色/。写 NPC 对白前建议先创建或读取角色卡。',
    promptSnippet: 'manage_character: CRUD character profile cards in vault',
    promptGuidelines: [
      '写 NPC 对白前，先用 manage_character action=list 查看已有角色，无档案时用 create 创建。',
      'create/update 只需传入要修改的字段。',
    ],
    parameters: Type.Object({
      action: Type.Union([
        Type.Literal('create'),
        Type.Literal('update'),
        Type.Literal('read'),
        Type.Literal('list'),
      ], { description: '操作类型' }),
      name: Type.Optional(Type.String({ description: '角色名（list 时不需要）' })),
      traits: Type.Optional(Type.String({ description: '性格特点' })),
      voice_style: Type.Optional(Type.String({ description: '说话风格/口癖' })),
      backstory: Type.Optional(Type.String({ description: '背景故事' })),
      body: Type.Optional(Type.String({ description: '补充正文（Markdown）' })),
    }),
    async execute(_toolCallId, params) {
      if (params.action === 'list') {
        const names = listCharacters();
        const text = names.length > 0
          ? `已有角色（${names.length}）：\n${names.map((n) => `- ${n}`).join('\n')}`
          : '（暂无角色卡）';
        return { content: [{ type: 'text' as const, text }], details: {} };
      }

      if (!params.name) {
        return {
          content: [{ type: 'text' as const, text: 'read/create/update 需要提供 name 参数。' }],
          details: {},
        };
      }

      if (params.action === 'read') {
        const text = formatCharacter(params.name);
        return {
          content: [{ type: 'text' as const, text }],
          details: {},
        };
      }

      const path = writeCharacter({
        name: params.name,
        traits: params.traits,
        voice_style: params.voice_style,
        backstory: params.backstory,
        body: params.body,
      });
      return {
        content: [{ type: 'text' as const, text: `角色卡已保存：${path}\n\n${formatCharacter(params.name)}` }],
        details: {},
      };
    },
  });
}
