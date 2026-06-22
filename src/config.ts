import { resolve } from 'node:path';

/** Pi 会话工作目录（session_start 时由 extension 设置） */
let sessionCwd = process.cwd();

export function setSessionCwd(cwd: string): void {
  sessionCwd = cwd;
}

/** 创作文件根目录：WORKSPACE_DIR > 会话 cwd > process.cwd()，无 vault 层 */
export function getWorkspaceDir(): string {
  return resolve(process.env.WORKSPACE_DIR ?? sessionCwd);
}
