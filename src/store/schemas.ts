/** 角色卡 frontmatter 字段 */
export interface CharacterFrontmatter {
  name: string;
  traits?: string;
  voice_style?: string;
  backstory?: string;
  updated_at?: string;
}

/** 对白存盘 frontmatter */
export interface DialogueFrontmatter {
  character: string;
  title: string;
  mode: 'linear' | 'branch' | 'barks';
  tone?: string;
  created_at?: string;
}

/** 任务文案 frontmatter */
export interface QuestFrontmatter {
  title: string;
  quest_type: 'main' | 'side' | 'daily' | 'item';
  tone?: string;
  created_at?: string;
}

/** 大纲 frontmatter */
export interface OutlineFrontmatter {
  title: string;
  structure: 'three_act' | 'hero_journey' | 'game_chapter';
  chapter_count?: number;
  created_at?: string;
}

/** 作品/参考存盘 frontmatter */
export interface WorkFrontmatter {
  title: string;
  category: 'work' | 'reference';
  format?: 'prose' | 'script';
  created_at?: string;
}

/** 本地化存盘 frontmatter */
export interface LocalizationFrontmatter {
  title: string;
  target_langs: string[];
  created_at?: string;
}
