import pc from 'picocolors';
import gradient from 'gradient-string';
import boxen from 'boxen';
import type { AnalysisResult, Archetype, Category } from './types.js';
import { ARCHETYPES } from './phrases.js';

// ── Helpers ──────────────────────────────────────────────────────

function formatNumber(n: number): string {
  return n.toLocaleString('en-US');
}

function makeBar(value: number, max: number, width: number = 30): string {
  const filled = max > 0 ? Math.round((value / max) * width) : 0;
  const empty = width - filled;
  return pc.magenta('\u2588'.repeat(filled)) + pc.dim('\u2591'.repeat(empty));
}

function getVerbosityLabel(avg: number): string {
  if (avg < 20) return 'Terse';
  if (avg < 50) return 'Concise';
  if (avg < 120) return 'Thorough';
  if (avg < 250) return 'Verbose';
  return 'Novelist';
}

function getArchetype(result: AnalysisResult): Archetype {
  // Score each archetype by summing up the category counts it cares about
  let bestScore = -1;
  let bestArchetype = ARCHETYPES[0];

  for (const archetype of ARCHETYPES) {
    let score = 0;
    for (const cat of archetype.categories) {
      score += result.categoryBreakdown.get(cat) ?? 0;
    }
    if (score > bestScore) {
      bestScore = score;
      bestArchetype = archetype;
    }
  }

  if (bestScore === 0) {
    return { name: 'The Mystery', description: 'Not enough data to determine your archetype', icon: '🔮', categories: [] as Category[] };
  }

  return bestArchetype;
}

function formatDate(d: Date): string {
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function pad(str: string, len: number): string {
  // Pad right with spaces (based on visible length, ignoring ANSI codes)
  const visible = str.replace(/\x1b\[[0-9;]*m/g, '');
  const diff = len - visible.length;
  return diff > 0 ? str + ' '.repeat(diff) : str;
}

function center(str: string, width: number): string {
  const visible = str.replace(/\x1b\[[0-9;]*m/g, '');
  const diff = width - visible.length;
  if (diff <= 0) return str;
  const left = Math.floor(diff / 2);
  return ' '.repeat(left) + str;
}

// ── Color helpers ────────────────────────────────────────────────

const purpleOrange = gradient(['#7c3aed', '#c084fc', '#f97316']);
const categoryColors: Record<Category, (s: string) => string> = {
  apology: pc.red,
  agreement: pc.green,
  narration: pc.cyan,
  hedge: pc.yellow,
  enthusiasm: pc.magenta,
  'over-explain': pc.blue,
  structured: pc.cyan,
  completion: pc.green,
  'claude-code': pc.magenta,
  qualifier: pc.yellow,
  safety: pc.red,
};

function rankColor(rank: number): (s: string) => string {
  if (rank === 1) return (s: string) => pc.bold(pc.yellow(s));   // gold
  if (rank === 2) return (s: string) => pc.bold(pc.white(s));    // silver
  if (rank === 3) return (s: string) => pc.bold(pc.red(s));      // bronze
  return pc.dim;
}

function rankBadge(rank: number): string {
  const color = rankColor(rank);
  if (rank === 1) return color('\u2605 #1');
  if (rank === 2) return color('\u2605 #2');
  if (rank === 3) return color('\u2605 #3');
  return color(`  #${rank}`);
}

// ── Section renderers ────────────────────────────────────────────

const WIDTH = 64;
const DIVIDER = pc.dim('\u2500'.repeat(WIDTH));

function sectionTitle(title: string): string {
  const line = pc.dim('\u2500'.repeat(3));
  return `\n${line} ${pc.bold(pc.cyan(title))} ${pc.dim('\u2500'.repeat(Math.max(0, WIDTH - title.length - 6)))}\n`;
}

function renderHeader(): string {
  const asciiArt = [
    '   _____ _                 _      _                   ',
    '  / ____| |               | |    (_)                  ',
    ' | |    | | __ _ _   _  __| | ___ _ ___ _ __ ___  ___ ',
    ' | |    | |/ _` | | | |/ _` |/ _ \\ / __| \'_ ` _ \\/ __|',
    ' | |____| | (_| | |_| | (_| |  __/ \\__ \\ | | | | \\__ \\',
    '  \\_____|_|\\__,_|\\__,_|\\__,_|\\___|_|___/_| |_| |_|___/',
  ].join('\n');

  const title = purpleOrange(asciiArt);

  const subtitle = center(
    pc.dim('~ Your Claude Code Wrapped ~'),
    WIDTH,
  );

  return '\n' + title + '\n\n' + subtitle;
}

function renderBigNumbers(result: AnalysisResult): string {
  const dateStr =
    formatDate(result.dateRange.first) +
    '  \u2192  ' +
    formatDate(result.dateRange.last);

  const lines = [
    '',
    center(pc.dim(dateStr), WIDTH - 4),
    '',
    `  ${pc.bold(pc.cyan(formatNumber(result.totalConversations)))}  conversations`,
    `  ${pc.bold(pc.magenta(formatNumber(result.totalMessages)))}  messages from Claude`,
    `  ${pc.bold(pc.yellow(formatNumber(result.totalWords)))}  words generated`,
    '',
  ];

  return boxen(lines.join('\n'), {
    padding: { top: 0, bottom: 0, left: 1, right: 1 },
    borderColor: 'magenta',
    borderStyle: 'round',
    dimBorder: true,
    width: WIDTH,
  });
}

function renderTopPhrases(result: AnalysisResult): string {
  const phrases = result.topPhrases.slice(0, 10);
  if (phrases.length === 0) return '';

  const maxCount = phrases[0].count;
  const lines: string[] = [];

  lines.push(sectionTitle('TOP CLAUDEISMS'));

  for (const phrase of phrases) {
    const badge = pad(rankBadge(phrase.rank), 8);
    const name = pc.bold(`"${phrase.displayName}"`);
    const catColor = categoryColors[phrase.category] ?? pc.white;
    const tag = catColor(`[${phrase.category}]`);
    const countStr = pc.bold(pc.white(formatNumber(phrase.count)));
    const bar = makeBar(phrase.count, maxCount, 24);

    lines.push(`  ${badge} ${name}`);
    lines.push(`         ${bar} ${countStr}  ${tag}`);

    if (phrase.funFact) {
      lines.push(`         ${pc.dim(pc.italic(`\u2514 ${phrase.funFact}`))}`);
    }

    lines.push('');
  }

  return lines.join('\n');
}

function renderArchetype(result: AnalysisResult): string {
  const arch = getArchetype(result);

  const inner = [
    '',
    center(`${arch.icon}`, WIDTH - 8),
    '',
    center(pc.bold(pc.magenta(arch.name.toUpperCase())), WIDTH - 8),
    center(pc.dim(arch.description), WIDTH - 8),
    '',
    center(
      pc.dim('Dominant categories: ') +
        arch.categories
          .map((c) => {
            const color = categoryColors[c] ?? pc.white;
            return color(c);
          })
          .join(pc.dim(', ')),
      WIDTH - 8,
    ),
    '',
  ].join('\n');

  const header = sectionTitle('YOUR ARCHETYPE');
  const box = boxen(inner, {
    padding: { top: 0, bottom: 0, left: 2, right: 2 },
    borderColor: 'yellow',
    borderStyle: 'round',
    width: WIDTH,
  });

  return header + '\n' + box;
}

function renderFunStats(result: AnalysisResult): string {
  const lines: string[] = [];
  lines.push(sectionTitle('FUN STATS'));

  const bullet = pc.dim('\u2502');

  // Apologeticness
  lines.push(
    `  ${bullet}  ${pc.red('\u2665')} Claude apologized to you ${pc.bold(pc.red(formatNumber(result.apologyCount)))} times`,
  );

  // Agreement
  lines.push(
    `  ${bullet}  ${pc.green('\u2714')} Claude agreed with you ${pc.bold(pc.green(formatNumber(result.agreementCount)))} times`,
  );

  // Verbosity
  const verbLabel = getVerbosityLabel(result.verbosityAvg);
  const verbColor =
    result.verbosityAvg > 150
      ? pc.red
      : result.verbosityAvg > 80
        ? pc.yellow
        : pc.green;
  lines.push(
    `  ${bullet}  ${pc.cyan('\u270e')} Average ${verbColor(pc.bold(String(Math.round(result.verbosityAvg))))} words/message ${pc.dim('=')} ${pc.bold(verbLabel)}`,
  );

  // Self-corrections
  lines.push(
    `  ${bullet}  ${pc.yellow('\u21ba')} Self-corrected ${pc.bold(pc.yellow(formatNumber(result.selfCorrections)))} times`,
  );

  // Longest message
  lines.push(
    `  ${bullet}  ${pc.magenta('\u2195')} Longest message: ${pc.bold(formatNumber(result.longestMessage.words))} words`,
  );
  if (result.longestMessage.preview) {
    const preview =
      result.longestMessage.preview.length > 45
        ? result.longestMessage.preview.slice(0, 45) + '...'
        : result.longestMessage.preview;
    lines.push(`  ${bullet}     ${pc.dim(`"${preview}"`)}`);
  }

  // Shortest message
  const shortText =
    result.shortestMessage.text.length > 40
      ? result.shortestMessage.text.slice(0, 40) + '...'
      : result.shortestMessage.text;
  lines.push(
    `  ${bullet}  ${pc.blue('\u2193')} Shortest message: ${pc.dim(`"${shortText}"`)} ${pc.dim(`(${result.shortestMessage.chars} chars)`)}`,
  );

  // Code vs Prose ratio
  lines.push('');
  const { code, prose } = result.codeVsProseRatio;
  const total = code + prose;
  if (total > 0) {
    const codeWidth = Math.round((code / total) * 36);
    const proseWidth = 36 - codeWidth;
    const codePct = Math.round((code / total) * 100);
    const prosePct = 100 - codePct;
    lines.push(
      `  ${bullet}  Code vs Prose`,
    );
    lines.push(
      `  ${bullet}  ${pc.cyan('\u2588'.repeat(codeWidth))}${pc.yellow('\u2588'.repeat(proseWidth))} `,
    );
    lines.push(
      `  ${bullet}  ${pc.cyan(`Code ${codePct}%`)}${' '.repeat(Math.max(1, 30 - String(codePct).length - String(prosePct).length))}${pc.yellow(`Prose ${prosePct}%`)}`,
    );
  }

  // Most active hour
  lines.push('');
  const peakHour = result.hourlyActivity.length > 0
    ? result.hourlyActivity.indexOf(Math.max(...result.hourlyActivity))
    : 12; // default to noon if no data
  const hourLabel =
    peakHour === 0
      ? '12 AM'
      : peakHour < 12
        ? `${peakHour} AM`
        : peakHour === 12
          ? '12 PM'
          : `${peakHour - 12} PM`;
  lines.push(
    `  ${bullet}  ${pc.yellow('\u231a')} Most active hour: ${pc.bold(pc.yellow(hourLabel))}`,
  );

  // Activity sparkline
  const maxActivity = Math.max(...result.hourlyActivity, 1);
  const sparks = ['\u2581', '\u2582', '\u2583', '\u2584', '\u2585', '\u2586', '\u2587', '\u2588'];
  const sparkline = result.hourlyActivity
    .map((v) => {
      const idx = Math.min(
        Math.floor((v / maxActivity) * (sparks.length - 1)),
        sparks.length - 1,
      );
      return sparks[idx];
    })
    .join('');
  lines.push(
    `  ${bullet}  ${pc.dim('0h')} ${pc.magenta(sparkline)} ${pc.dim('23h')}`,
  );

  // Emojis
  if (result.emojiCount > 0) {
    lines.push('');
    const topEmojis = result.topEmojis
      .slice(0, 5)
      .map((e) => `${e.emoji} ${pc.dim(`x${e.count}`)}`)
      .join('  ');
    lines.push(
      `  ${bullet}  Top emojis: ${topEmojis}  ${pc.dim(`(${formatNumber(result.emojiCount)} total)`)}`,
    );
  }

  lines.push('');
  return lines.join('\n');
}

function renderFooter(): string {
  const now = new Date();
  const dateStr = formatDate(now);
  return (
    '\n' +
    DIVIDER +
    '\n' +
    center(
      pc.dim(`claudeisms v0.1.0 \u00b7 generated ${dateStr}`),
      WIDTH,
    ) +
    '\n'
  );
}

// ── Main export ──────────────────────────────────────────────────

export function render(result: AnalysisResult): void {
  const output = [
    '',
    renderHeader(),
    '',
    renderBigNumbers(result),
    renderTopPhrases(result),
    renderArchetype(result),
    renderFunStats(result),
    renderFooter(),
    '',
  ].join('\n');

  process.stdout.write(output);
}
