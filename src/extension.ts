/**
 * Pi 叙事创作扩展入口
 */
import type { ExtensionAPI } from '@earendil-works/pi-coding-agent';
import { registerContextInjection } from './context.js';
import { registerLoadContextTool } from './tools/load-context.js';
import { registerSaveWorkTool } from './tools/save-work.js';
import { registerRememberTasteTool } from './tools/remember-taste.js';
import { registerCheckConsistencyTool } from './tools/check-consistency.js';
import { registerCritiqueTool } from './tools/critique.js';
import { registerReadFileTool } from './tools/read-file.js';
import { registerManageCharacterTool } from './tools/manage-character.js';
import { registerSaveDialogueTool } from './tools/save-dialogue.js';
import { registerSaveQuestTool } from './tools/save-quest.js';
import { registerSaveOutlineTool } from './tools/save-outline.js';
import { registerSaveLocalizationTool } from './tools/save-localization.js';

export default function (pi: ExtensionAPI) {
  registerContextInjection(pi);

  registerLoadContextTool(pi);
  registerSaveWorkTool(pi);
  registerRememberTasteTool(pi);
  registerCheckConsistencyTool(pi);
  registerCritiqueTool(pi);
  registerReadFileTool(pi);

  registerManageCharacterTool(pi);
  registerSaveDialogueTool(pi);
  registerSaveQuestTool(pi);
  registerSaveOutlineTool(pi);
  registerSaveLocalizationTool(pi);
}
