import { parseArgs } from 'node:util';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { existsSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { getDefaultClaudeDir, scanConversations } from './scanner.js';
import { getDefaultCodexDir, scanCodexConversations } from './codex-scanner.js';
import { parseConversation } from './parser.js';
import { parseCodexConversation } from './codex-parser.js';
import { Analyzer } from './analyzer.js';
import { render } from './renderer.js';
import { generateCard } from './card.js';
import { PHRASES, ARCHETYPES } from './phrases.js';
import { CODEX_PHRASES, CODEX_ARCHETYPES } from './codex-phrases.js';
import type { ScanOptions } from './types.js';

const VERSION = '0.2.0';

const HELP_TEXT = `claudeisms - Spotify Wrapped for Claude Code

Usage: claudeisms [options]

Options:
  -d, --days <n>    Only scan last N days
  -t, --top <n>     Show top N phrases (default: 10)
  -j, --json        Output as JSON
  -p, --png <path>  Save PNG card to custom path (default: claudeisms.png)
      --no-png      Skip PNG card generation
      --dir <path>  Custom Claude directory
      --codex       Analyze Codex CLI instead of Claude Code
  -h, --help        Show this help
  -v, --version     Show version
`;

function mapReplacer(_key: string, value: unknown): unknown {
  if (value instanceof Map) {
    return Object.fromEntries(value);
  }
  return value;
}

async function main() {
  const { values } = parseArgs({
    options: {
      days: { type: 'string', short: 'd' },
      top: { type: 'string', short: 't' },
      json: { type: 'boolean', short: 'j' },
      png: { type: 'string', short: 'p' },
      'no-png': { type: 'boolean' },
      dir: { type: 'string' },
      codex: { type: 'boolean' },
      help: { type: 'boolean', short: 'h' },
      version: { type: 'boolean', short: 'v' },
    },
  });

  if (values.help) {
    console.log(HELP_TEXT);
    process.exit(0);
  }

  if (values.version) {
    console.log(VERSION);
    process.exit(0);
  }

  const isCodex = values.codex ?? false;
  const claudeDir = values.dir ?? (isCodex ? getDefaultCodexDir() : getDefaultClaudeDir());
  const title = isCodex ? 'CODEXISMS' : 'CLAUDEISMS';
  const topN = values.top ? parseInt(values.top, 10) : 10;
  const days = values.days ? parseInt(values.days, 10) : undefined;

  if (values.top && (isNaN(topN) || topN <= 0)) {
    console.error('--top must be a positive number');
    process.exit(1);
  }
  if (values.days && (isNaN(days!) || days! <= 0)) {
    console.error('--days must be a positive number');
    process.exit(1);
  }

  const scanOptions: ScanOptions = {
    claudeDir,
    ...(days !== undefined && { days }),
  };

  const dataDir = isCodex ? join(claudeDir, 'sessions') : join(claudeDir, 'projects');
  if (!existsSync(dataDir)) {
    console.error(`No ${isCodex ? 'Codex' : 'Claude Code'} data found at ${claudeDir}`);
    console.error(`Make sure you have ${isCodex ? 'Codex CLI' : 'Claude Code'} installed and have had some conversations.`);
    process.exit(1);
  }

  process.stderr.write('Scanning conversations...\n');

  const phrases = isCodex ? CODEX_PHRASES : PHRASES;
  const archetypes = isCodex ? CODEX_ARCHETYPES : ARCHETYPES;
  const analyzer = new Analyzer(phrases);
  let processed = 0;

  const scanner = isCodex ? scanCodexConversations(scanOptions) : scanConversations(scanOptions);
  const parse = isCodex ? parseCodexConversation : parseConversation;

  for await (const filePath of scanner) {
    try {
      const messages = parse(filePath);
      await analyzer.processStream(messages);
    } catch {
      // Skip files that fail to parse
    }
    processed++;
    process.stderr.write(`\rAnalyzed ${processed} conversations...`);
  }

  process.stderr.write('\n');

  if (processed === 0) {
    console.error('No conversations found. Start chatting with Claude Code first!');
    process.exit(1);
  }

  const results = analyzer.getResults(topN);

  if (values.json) {
    console.log(JSON.stringify(results, mapReplacer, 2));
  } else {
    render(results, archetypes, title);
  }

  if (!values['no-png'] && !values.json || values.png) {
    const pngPath = values.png || join(tmpdir(), `${title.toLowerCase()}.png`);
    const pngBuffer = await generateCard(results, archetypes, title);
    writeFileSync(pngPath, pngBuffer);
    console.log(`\n📸 Share card saved to ${pngPath}`);

    // Auto-open the image if we saved to tmp (not a custom path)
    if (!values.png) {
      try {
        const cmd = process.platform === 'darwin' ? 'open'
          : process.platform === 'win32' ? 'start'
          : 'xdg-open';
        execSync(`${cmd} "${pngPath}"`, { stdio: 'ignore' });
      } catch {
        // Silently fail if we can't open — the path is already printed
      }
    }
  }
}

main().catch((err: Error) => {
  console.error('Error:', err.message);
  process.exit(1);
});
