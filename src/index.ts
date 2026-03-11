import { parseArgs } from 'node:util';
import { join } from 'node:path';
import { existsSync } from 'node:fs';
import { getDefaultClaudeDir, scanConversations } from './scanner.js';
import { parseConversation } from './parser.js';
import { Analyzer } from './analyzer.js';
import { render } from './renderer.js';
import { generateCard } from './card.js';
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

  const claudeDir = values.dir ?? getDefaultClaudeDir();
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

  const projectsDir = join(scanOptions.claudeDir, 'projects');
  if (!existsSync(projectsDir)) {
    console.error(`No Claude Code data found at ${scanOptions.claudeDir}`);
    console.error('Make sure you have Claude Code installed and have had some conversations.');
    process.exit(1);
  }

  process.stderr.write('Scanning conversations...\n');

  const analyzer = new Analyzer();
  let processed = 0;

  for await (const filePath of scanConversations(scanOptions)) {
    try {
      const messages = parseConversation(filePath);
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
    render(results);
  }

  if (!values['no-png'] && !values.json) {
    const pngPath = values.png || 'claudeisms.png';
    const pngBuffer = await generateCard(results);
    const { writeFileSync } = await import('node:fs');
    writeFileSync(pngPath, pngBuffer);
    console.log(`\n📸 Share card saved to ${pngPath}`);
  } else if (values.png) {
    const pngBuffer = await generateCard(results);
    const { writeFileSync } = await import('node:fs');
    writeFileSync(values.png, pngBuffer);
    console.log(`\n📸 Share card saved to ${values.png}`);
  }
}

main().catch((err: Error) => {
  console.error('Error:', err.message);
  process.exit(1);
});
