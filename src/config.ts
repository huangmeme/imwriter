import { resolve } from 'node:path';

/** 创作文件根目录，默认 Pi 启动时的工作目录（项目根） */
export const workspaceDir = resolve(process.env.WORKSPACE_DIR ?? process.cwd());

export const contentSubdirs = {
  reference: '参考',
  works: '作品',
  characters: '角色',
  dialogue: '对白',
  quests: '任务',
  outlines: '大纲',
  annotations: '批注',
  taste: '品味',
} as const;

export type ContentSubdir = keyof typeof contentSubdirs;

/** load_context 时参考文件单文件最大字符数 */
export const contextMaxCharsPerFile = 4000;

/** load_context 时参考文件总最大字符数 */
export const contextMaxTotalChars = 12000;
