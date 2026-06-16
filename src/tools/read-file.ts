import { Type } from '@sinclair/typebox';
import type { ExtensionAPI } from '@earendil-works/pi-coding-agent';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { isAbsolute, resolve } from 'node:path';

const MAX_BYTES = 200 * 1024;

export function registerReadFileTool(pi: ExtensionAPI) {
  pi.registerTool({
    name: 'read_file',
    label: '读文件',
    description: '读取任意目录下的文本文件。可以读小说草稿、设定文档、参考资料。只读，不能写入或删除。',
    promptSnippet: 'read_file: read any text file from disk (read-only)',
    parameters: Type.Object({
      path: Type.String({ description: '文件路径（绝对或相对）' }),
    }),
    async execute(_toolCallId, params) {
      const filePath = isAbsolute(params.path) ? params.path : resolve(process.cwd(), params.path);
      const details = (size: number, truncated = false) => ({ size, truncated });
      if (!existsSync(filePath)) {
        return { content: [{ type: 'text' as const, text: `文件不存在：${filePath}` }], details: details(0) };
      }
      const stat = statSync(filePath);
      if (stat.isDirectory()) {
        return { content: [{ type: 'text' as const, text: `${filePath} 是目录。` }], details: details(0) };
      }
      const head = readFileSync(filePath, { encoding: 'utf-8' }).slice(0, 512);
      if (head.includes('\x00')) {
        return { content: [{ type: 'text' as const, text: `${filePath} 是二进制文件。` }], details: details(stat.size) };
      }
      let content = readFileSync(filePath, 'utf-8');
      let truncated = false;
      if (Buffer.byteLength(content, 'utf-8') > MAX_BYTES) {
        content = content.slice(0, MAX_BYTES);
        truncated = true;
      }
      return {
        content: [{
          type: 'text' as const,
          text: `=== ${filePath} (${stat.size} bytes) ===\n${content}${truncated ? '\n... (已截断)' : ''}`,
        }],
        details: details(stat.size, truncated),
      };
    },
  });
}
