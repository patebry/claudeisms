export type Category =
  | 'apology'
  | 'agreement'
  | 'narration'
  | 'hedge'
  | 'enthusiasm'
  | 'over-explain'
  | 'structured'
  | 'completion'
  | 'claude-code'
  | 'qualifier'
  | 'safety';

export interface PhrasePattern {
  id: string;
  pattern: RegExp;
  displayName: string;
  category: Category;
  funFact?: string;
}

export interface RankedPhrase {
  id: string;
  displayName: string;
  category: Category;
  count: number;
  rank: number;
  funFact?: string;
}

export interface AnalysisResult {
  totalConversations: number;
  totalMessages: number;
  totalWords: number;
  totalCharacters: number;
  dateRange: { first: Date; last: Date };
  phraseCounts: Map<string, number>;
  categoryBreakdown: Map<Category, number>;
  topPhrases: RankedPhrase[];
  verbosityAvg: number;
  longestMessage: { words: number; preview: string };
  shortestMessage: { text: string; chars: number };
  selfCorrections: number;
  apologyCount: number;
  agreementCount: number;
  codeVsProseRatio: { code: number; prose: number };
  hourlyActivity: number[];
  emojiCount: number;
  topEmojis: Array<{ emoji: string; count: number }>;
}

export interface ScanOptions {
  claudeDir: string;
  days?: number;
}

export interface Archetype {
  name: string;
  description: string;
  icon: string;
  categories: Category[];
}
