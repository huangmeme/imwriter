import { resolve } from 'node:path';

/** vault 根目录，默认 Pi 启动时工作目录下的 vault/ */
export const vaultDir = resolve(process.env.VAULT_DIR ?? resolve(process.cwd(), 'vault'));

export const vaultSubdirs = {
  reference: '参考',
  works: '作品',
  characters: '角色',
  dialogue: '对白',
  quests: '任务',
  outlines: '大纲',
  annotations: '批注',
  taste: '品味',
} as const;

export type VaultSubdir = keyof typeof vaultSubdirs;

/** context 注入时参考文件单文件最大字符数 */
export const contextMaxCharsPerFile = 4000;

/** context 注入时参考文件总最大字符数 */
export const contextMaxTotalChars = 12000;
