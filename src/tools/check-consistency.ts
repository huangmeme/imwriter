import { Type } from '@sinclair/typebox';
import type { ExtensionAPI } from '@earendil-works/pi-coding-agent';
import { readAllSettings } from '../store/vault.js';

const CHECK_GUIDE = `
请根据以上全部设定，列出可能存在的矛盾与不一致之处：
1. 时间线冲突
2. 角色人设前后矛盾
3. 世界观规则互相抵触
4. 地理/势力/能力体系逻辑漏洞

每条矛盾注明：涉及文件/角色、矛盾描述、修改建议。
若未发现明显矛盾，说明「未发现明显设定冲突」。
`.trim();

export function registerCheckConsistencyTool(pi: ExtensionAPI) {
  pi.registerTool({
    name: 'check_consistency',
    label: '检查设定矛盾',
    description: '加载 vault 中全部参考设定与角色卡，供你分析是否存在矛盾。用户说「检查矛盾」「有没有 bug」时调用，然后你在对话中给出分析结果。',
    promptSnippet: 'check_consistency: load all settings for consistency analysis',
    promptGuidelines: [
      '用户要求检查矛盾时，先调 check_consistency 获取全部设定，再在对话中分析。',
      '不要跳过分析直接说没问题。',
    ],
    parameters: Type.Object({}),
    async execute() {
      const settings = readAllSettings();
      return {
        content: [{
          type: 'text' as const,
          text: `${settings}\n\n---\n\n${CHECK_GUIDE}`,
        }],
        details: {},
      };
    },
  });
}
