import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const PROMPT_MARKER = '俺是小作家';

let cached: string | undefined;

/** 读取包内 .imwriter/prompt.md（安装后随扩展一起分发） */
export function getImwriterPrompt(): string {
  if (cached !== undefined) return cached;

  const packageRoot = dirname(dirname(fileURLToPath(import.meta.url)));
  const path = join(packageRoot, '.imwriter', 'prompt.md');
  if (!existsSync(path)) {
    cached = '';
    return cached;
  }
  cached = readFileSync(path, 'utf-8').trim();
  return cached;
}

/** 避免重复拼接（多扩展或重载场景） */
export function shouldInjectPrompt(systemPrompt: string, imwriterPrompt: string): boolean {
  if (!imwriterPrompt) return false;
  if (systemPrompt.includes(PROMPT_MARKER)) return false;
  return true;
}
