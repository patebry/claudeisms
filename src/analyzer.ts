import type { AnalysisResult, Category, RankedPhrase } from './types.js';
import type { ParsedMessage } from './parser.js';
import { PHRASES } from './phrases.js';

const EMOJI_RE = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;

const CODE_BLOCK_RE = /```[\s\S]*?```/g;

const SELF_CORRECTION_RE =
  /\b(?:Actually,|Wait,|Let me reconsider|On second thought|I was mistaken|correction:)/gi;

/**
 * Class-based accumulator that can ingest messages from one or many files and
 * produce a single AnalysisResult at the end. All regex objects are compiled
 * once; per-message work is a single pass over the text.
 */
export class Analyzer {
  // ---- internal accumulators ----

  private messageCount = 0;
  private wordCount = 0;
  private charCount = 0;

  private sessionIds = new Set<string>();

  private firstDate: Date | null = null;
  private lastDate: Date | null = null;

  private phraseCounts = new Map<string, number>();

  private longestWords = 0;
  private longestPreview = '';
  private shortestChars = Infinity;
  private shortestText = '';

  private codeChars = 0;
  private proseChars = 0;

  private selfCorrections = 0;

  private hourly: number[] = new Array(24).fill(0);

  private emojiTotal = 0;
  private emojiMap = new Map<string, number>();

  // ------------------------------------------------------------------ public

  /**
   * Process a single parsed message. This is the hot path -- every message
   * from every conversation file passes through here exactly once.
   */
  processMessage(msg: ParsedMessage): void {
    const { text, timestamp, sessionId } = msg;

    if (text.trim().length === 0) return;

    this.messageCount++;
    this.charCount += text.length;

    // ---- session / conversation tracking ----
    if (sessionId) {
      this.sessionIds.add(sessionId);
    }

    // ---- date range ----
    if (this.firstDate === null || timestamp < this.firstDate) {
      this.firstDate = timestamp;
    }
    if (this.lastDate === null || timestamp > this.lastDate) {
      this.lastDate = timestamp;
    }

    // ---- hourly activity ----
    const hour = timestamp.getHours();
    this.hourly[hour]++;

    // ---- word count & min/max message length ----
    const words = text.split(/\s+/).filter((w) => w.length > 0);
    const wordLen = words.length;
    this.wordCount += wordLen;

    if (wordLen > this.longestWords) {
      this.longestWords = wordLen;
      this.longestPreview =
        text.length > 120 ? text.slice(0, 120) + '...' : text;
    }

    if (text.length < this.shortestChars) {
      this.shortestChars = text.length;
      this.shortestText =
        text.length > 120 ? text.slice(0, 120) + '...' : text;
    }

    // ---- code vs prose ----
    let codeInMessage = 0;
    for (const m of text.matchAll(CODE_BLOCK_RE)) {
      codeInMessage += m[0].length;
    }
    this.codeChars += codeInMessage;
    this.proseChars += text.length - codeInMessage;

    // ---- phrase detection (single pass over all patterns) ----
    for (const phrase of PHRASES) {
      // Reset lastIndex for global regexes before matchAll (matchAll creates
      // a fresh iterator, but we still reset to be safe with stateful regexes).
      phrase.pattern.lastIndex = 0;
      let count = 0;
      for (const _hit of text.matchAll(phrase.pattern)) {
        count++;
      }
      if (count > 0) {
        this.phraseCounts.set(
          phrase.id,
          (this.phraseCounts.get(phrase.id) ?? 0) + count,
        );
      }
    }

    // ---- self-corrections ----
    SELF_CORRECTION_RE.lastIndex = 0;
    for (const _hit of text.matchAll(SELF_CORRECTION_RE)) {
      this.selfCorrections++;
    }

    // ---- emoji detection ----
    EMOJI_RE.lastIndex = 0;
    for (const em of text.matchAll(EMOJI_RE)) {
      this.emojiTotal++;
      const ch = em[0];
      this.emojiMap.set(ch, (this.emojiMap.get(ch) ?? 0) + 1);
    }
  }

  /**
   * Consume every message from an async iterable (e.g. parseConversation()).
   */
  async processStream(messages: AsyncIterable<ParsedMessage>): Promise<void> {
    for await (const msg of messages) {
      this.processMessage(msg);
    }
  }

  /**
   * Compute derived statistics and return the final AnalysisResult.
   *
   * @param topN - How many phrases to include in the ranked list (default 25).
   */
  getResults(topN = 25): AnalysisResult {
    // ---- top phrases ----
    const phraseEntries = [...this.phraseCounts.entries()].sort(
      (a, b) => b[1] - a[1],
    );

    const phraseIndex = new Map<string, (typeof PHRASES)[number]>();
    for (const p of PHRASES) {
      phraseIndex.set(p.id, p);
    }

    const topPhrases: RankedPhrase[] = phraseEntries
      .slice(0, topN)
      .map(([id, count], i) => {
        const def = phraseIndex.get(id);
        return {
          id,
          displayName: def?.displayName ?? id,
          category: def?.category ?? ('hedge' as Category),
          count,
          rank: i + 1,
          funFact: def?.funFact,
        };
      });

    // ---- category breakdown ----
    const categoryBreakdown = new Map<Category, number>();
    for (const [id, count] of this.phraseCounts) {
      const def = phraseIndex.get(id);
      if (def) {
        categoryBreakdown.set(
          def.category,
          (categoryBreakdown.get(def.category) ?? 0) + count,
        );
      }
    }

    // ---- apology / agreement counts from category totals ----
    const apologyCount = categoryBreakdown.get('apology') ?? 0;
    const agreementCount = categoryBreakdown.get('agreement') ?? 0;

    // ---- verbosity average ----
    const verbosityAvg =
      this.messageCount > 0 ? this.wordCount / this.messageCount : 0;

    // ---- code vs prose ratio ----
    const totalCodeProse = this.codeChars + this.proseChars;
    const codeVsProseRatio =
      totalCodeProse > 0
        ? {
            code: this.codeChars / totalCodeProse,
            prose: this.proseChars / totalCodeProse,
          }
        : { code: 0, prose: 1 };

    // ---- top emojis ----
    const topEmojis = [...this.emojiMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([emoji, count]) => ({ emoji, count }));

    // ---- date range (fallback to epoch if no messages seen) ----
    const now = new Date();
    const dateRange = {
      first: this.firstDate ?? now,
      last: this.lastDate ?? now,
    };

    return {
      totalConversations: this.sessionIds.size,
      totalMessages: this.messageCount,
      totalWords: this.wordCount,
      totalCharacters: this.charCount,
      dateRange,
      phraseCounts: new Map(this.phraseCounts),
      categoryBreakdown,
      topPhrases,
      verbosityAvg,
      longestMessage: {
        words: this.longestWords,
        preview: this.longestPreview,
      },
      shortestMessage: {
        text: this.shortestText,
        chars: this.shortestChars === Infinity ? 0 : this.shortestChars,
      },
      selfCorrections: this.selfCorrections,
      apologyCount,
      agreementCount,
      codeVsProseRatio,
      hourlyActivity: [...this.hourly],
      emojiCount: this.emojiTotal,
      topEmojis,
    };
  }
}
