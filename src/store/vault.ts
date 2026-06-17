import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';
import { join } from 'node:path';
import {
  contentSubdirs,
  contextMaxCharsPerFile,
  contextMaxTotalChars,
  workspaceDir,
  type ContentSubdir,
} from '../config.js';
import type {
  CharacterFrontmatter,
  DialogueFrontmatter,
  LocalizationFrontmatter,
  OutlineFrontmatter,
  QuestFrontmatter,
  WorkFrontmatter,
} from './schemas.js';

/** 文件名安全化 */
export function sanitizeFilename(name: string): string {
  return name.replace(/[\\/:*?"<>|]/g, '_').trim() || '未命名';
}

/** 子目录绝对路径（位于项目根下，如 参考/、作品/） */
export function subdirPath(key: ContentSubdir): string {
  return join(workspaceDir, contentSubdirs[key]);
}

/** 写入前按需创建子目录 */
export function ensureDir(key: ContentSubdir): string {
  const dir = subdirPath(key);
  mkdirSync(dir, { recursive: true });
  return dir;
}

function buildFrontmatter(data: Record<string, unknown>): string {
  const lines = ['---'];
  for (const [k, v] of Object.entries(data)) {
    if (v === undefined || v === null) continue;
    if (Array.isArray(v)) {
      lines.push(`${k}: [${v.map((x) => JSON.stringify(x)).join(', ')}]`);
    } else if (typeof v === 'string' && (v.includes(':') || v.includes('\n'))) {
      lines.push(`${k}: ${JSON.stringify(v)}`);
    } else {
      lines.push(`${k}: ${v}`);
    }
  }
  lines.push('---', '');
  return lines.join('\n');
}

function parseFrontmatter(content: string): {
  meta: Record<string, unknown>;
  body: string;
} {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { meta: {}, body: content.trim() };
  const meta: Record<string, unknown> = {};
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let val: unknown = line.slice(idx + 1).trim();
    if (typeof val === 'string' && val.startsWith('[') && val.endsWith(']')) {
      try {
        val = JSON.parse(val.replace(/'/g, '"'));
      } catch {
        /* keep string */
      }
    } else if (typeof val === 'string' && val.startsWith('"') && val.endsWith('"')) {
      val = JSON.parse(val);
    }
    meta[key] = val;
  }
  return { meta, body: match[2].trim() };
}

/** 读取品味全文 */
export function readTaste(): string {
  const path = join(subdirPath('taste'), 'taste.md');
  if (!existsSync(path)) return '';
  return readFileSync(path, 'utf-8');
}

/** 追加品味规则 */
export function appendTaste(rule: string, category = '通用'): string {
  ensureDir('taste');
  const path = join(subdirPath('taste'), 'taste.md');
  const trimmed = rule.trim();
  if (!trimmed) return path;

  let content = existsSync(path) ? readFileSync(path, 'utf-8') : '# 我的写作品味\n\n';
  const catHeader = `## ${category}`;
  if (!content.includes(catHeader)) {
    content = content.trimEnd() + `\n\n${catHeader}\n`;
  }
  const lines = content.split('\n');
  const catIdx = lines.findIndex((l) => l.trim() === catHeader);
  let insertAt = catIdx + 1;
  while (insertAt < lines.length && lines[insertAt].match(/^\s*[-*]\s/)) {
    insertAt++;
  }
  lines.splice(insertAt, 0, `- ${trimmed}`);
  writeFileSync(path, lines.join('\n'), 'utf-8');
  return path;
}

/** 扫描参考目录，拼接设定文本 */
export function readReference(maxTotal = contextMaxTotalChars): string {
  const dir = subdirPath('reference');
  if (!existsSync(dir)) return '';

  const parts: string[] = [];
  let total = 0;
  const files = readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .sort();

  for (const f of files) {
    if (total >= maxTotal) break;
    const raw = readFileSync(join(dir, f), 'utf-8').trim();
    if (!raw) continue;
    const slice = raw.slice(0, contextMaxCharsPerFile);
    const chunk = `### ${f}\n${slice}${raw.length > contextMaxCharsPerFile ? '\n...(已截断)' : ''}`;
    parts.push(chunk);
    total += chunk.length;
  }
  return parts.join('\n\n---\n\n');
}

/** 写入作品或参考文档 */
export function writeWork(params: {
  title: string;
  content: string;
  category: 'work' | 'reference';
  format?: 'prose' | 'script';
}): string {
  const key = params.category === 'reference' ? 'reference' : 'works';
  ensureDir(key);
  const safe = sanitizeFilename(params.title);
  const fm: WorkFrontmatter = {
    title: params.title,
    category: params.category,
    format: params.format,
    created_at: new Date().toISOString(),
  };
  const path = join(subdirPath(key), `${safe}.md`);
  writeFileSync(path, buildFrontmatter(fm as unknown as Record<string, unknown>) + params.content.trim() + '\n', 'utf-8');
  return path;
}

export function writeDialogue(params: {
  character: string;
  title: string;
  content: string;
  mode: DialogueFrontmatter['mode'];
  tone?: string;
}): string {
  ensureDir('dialogue');
  const safe = sanitizeFilename(`${params.character}-${params.title}`);
  const fm: DialogueFrontmatter = {
    character: params.character,
    title: params.title,
    mode: params.mode,
    tone: params.tone,
    created_at: new Date().toISOString(),
  };
  const path = join(subdirPath('dialogue'), `${safe}.md`);
  writeFileSync(path, buildFrontmatter(fm as unknown as Record<string, unknown>) + params.content.trim() + '\n', 'utf-8');
  return path;
}

export function writeQuest(params: {
  title: string;
  content: string;
  quest_type: QuestFrontmatter['quest_type'];
  tone?: string;
}): string {
  ensureDir('quests');
  const safe = sanitizeFilename(params.title);
  const fm: QuestFrontmatter = {
    title: params.title,
    quest_type: params.quest_type,
    tone: params.tone,
    created_at: new Date().toISOString(),
  };
  const path = join(subdirPath('quests'), `${safe}.md`);
  writeFileSync(path, buildFrontmatter(fm as unknown as Record<string, unknown>) + params.content.trim() + '\n', 'utf-8');
  return path;
}

export function writeOutline(params: {
  title: string;
  content: string;
  structure: OutlineFrontmatter['structure'];
  chapter_count?: number;
}): string {
  ensureDir('outlines');
  const safe = sanitizeFilename(params.title);
  const fm: OutlineFrontmatter = {
    title: params.title,
    structure: params.structure,
    chapter_count: params.chapter_count,
    created_at: new Date().toISOString(),
  };
  const path = join(subdirPath('outlines'), `${safe}.md`);
  writeFileSync(path, buildFrontmatter(fm as unknown as Record<string, unknown>) + params.content.trim() + '\n', 'utf-8');
  return path;
}

export function writeLocalization(params: {
  title: string;
  content: string;
  target_langs: string[];
}): string {
  ensureDir('works');
  const safe = sanitizeFilename(`${params.title}-i18n`);
  const fm: LocalizationFrontmatter = {
    title: params.title,
    target_langs: params.target_langs,
    created_at: new Date().toISOString(),
  };
  const path = join(subdirPath('works'), `${safe}.md`);
  writeFileSync(path, buildFrontmatter(fm as unknown as Record<string, unknown>) + params.content.trim() + '\n', 'utf-8');
  return path;
}

export function writeAnnotation(params: { title: string; content: string }): string {
  ensureDir('annotations');
  const safe = sanitizeFilename(params.title);
  const path = join(subdirPath('annotations'), `${safe}.md`);
  writeFileSync(path, params.content.trim() + '\n', 'utf-8');
  return path;
}

/** 读取角色卡 */
export function readCharacter(name: string): { meta: Record<string, unknown>; body: string } | null {
  const dir = subdirPath('characters');
  const path = join(dir, `${sanitizeFilename(name)}.md`);
  if (!existsSync(path)) return null;
  const raw = readFileSync(path, 'utf-8');
  return parseFrontmatter(raw);
}

/** 列出所有角色名 */
export function listCharacters(): string[] {
  const dir = subdirPath('characters');
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''));
}

/** 写入/更新角色卡 */
export function writeCharacter(params: {
  name: string;
  traits?: string;
  voice_style?: string;
  backstory?: string;
  body?: string;
}): string {
  ensureDir('characters');
  const existing = readCharacter(params.name);
  const fm: CharacterFrontmatter = {
    name: params.name,
    traits: params.traits ?? (existing?.meta.traits as string | undefined),
    voice_style: params.voice_style ?? (existing?.meta.voice_style as string | undefined),
    backstory: params.backstory ?? (existing?.meta.backstory as string | undefined),
    updated_at: new Date().toISOString(),
  };
  const body = params.body ?? existing?.body ?? '';
  const path = join(subdirPath('characters'), `${sanitizeFilename(params.name)}.md`);
  writeFileSync(path, buildFrontmatter(fm as unknown as Record<string, unknown>) + body.trim() + '\n', 'utf-8');
  return path;
}

/** 加载写作 brief：参考 + 品味 + 可选角色 */
export function buildWritingBrief(characterName?: string): string {
  const parts: string[] = [];
  const taste = readTaste().trim();
  if (taste) parts.push(`### 品味规则\n${taste}`);
  const reference = readReference();
  if (reference) parts.push(`### 参考设定\n${reference}`);
  if (characterName) {
    const ch = readCharacter(characterName);
    if (ch) {
      const lines = [
        `### 角色：${characterName}`,
        ch.meta.traits ? `性格：${String(ch.meta.traits)}` : '',
        ch.meta.voice_style ? `说话风格：${String(ch.meta.voice_style)}` : '',
        ch.meta.backstory ? `背景：${String(ch.meta.backstory)}` : '',
        ch.body ? `\n${ch.body}` : '',
      ].filter(Boolean);
      parts.push(lines.join('\n'));
    } else {
      parts.push(`### 角色：${characterName}\n（尚未创建角色卡，可用 manage_character 创建）`);
    }
  }
  if (parts.length === 0) {
    return '（项目目录中暂无设定与品味，可直接创作；完成后用 save_* 工具存盘一次即可）';
  }
  return parts.join('\n\n---\n\n');
}

/** 返回全部设定文本供一致性检查 */
export function readAllSettings(): string {
  const parts: string[] = [];
  const reference = readReference(contextMaxTotalChars * 2);
  if (reference) parts.push(`## 参考设定\n${reference}`);

  const chars = listCharacters();
  for (const name of chars) {
    const ch = readCharacter(name);
    if (!ch) continue;
    parts.push(
      `## 角色：${name}\n` +
        [ch.meta.traits, ch.meta.voice_style, ch.meta.backstory, ch.body].filter(Boolean).map(String).join('\n'),
    );
  }
  const taste = readTaste().trim();
  if (taste) parts.push(`## 品味规则\n${taste}`);

  return parts.length > 0 ? parts.join('\n\n---\n\n') : '（项目目录中暂无设定文件）';
}
