# claudeisms

> Spotify Wrapped, but for your Claude Code conversations

Ever wonder how many times Claude said "You're absolutely right" to you? Or how often it apologized? Now you can find out.

## Quick Start

```bash
npx claudeisms
```

That's it. No config needed.

## What You Get

claudeisms scans your Claude Code conversation history and generates a beautiful terminal report showing:

- **Top Claudeisms** - The phrases Claude says to you most (ranked with counts)
- **Your Claude Archetype** - Are you talking to The Apologizer? The Over-Explainer? The Eager Helper?
- **The Apology Index** - How sorry is your Claude, really?
- **Fun Stats** - Verbosity scores, code vs prose ratios, peak coding hours, and more

## Example Output

```
  ┌─────────────────────────────────────────────────┐
  │                                                 │
  │          ✦  c l a u d e i s m s  ✦              │
  │                                                 │
  │        your claude code personality report      │
  │             scanned 1,247 conversations         │
  │                                                 │
  └─────────────────────────────────────────────────┘

  TOP CLAUDEISMS
  ──────────────────────────────────────────────────

  1. "Let me"                 ████████████████████  347
  2. "I'll help you"          ██████████████░░░░░░  238
  3. "You're absolutely right" ███████████░░░░░░░░░  192
  4. "I apologize"            █████████░░░░░░░░░░░  156
  5. "Great question"         ████████░░░░░░░░░░░░  139
  6. "Here's what I'd suggest" ██████░░░░░░░░░░░░░░  104
  7. "Let me fix that"        █████░░░░░░░░░░░░░░░   87
  8. "Actually, looking..."   ████░░░░░░░░░░░░░░░░   71
  9. "Happy to help"          ███░░░░░░░░░░░░░░░░░   53
  10. "To be thorough"        ██░░░░░░░░░░░░░░░░░░   42

  YOUR CLAUDE ARCHETYPE
  ──────────────────────────────────────────────────

  ╔══════════════════════════════════════╗
  ║  You're talking to...               ║
  ║                                     ║
  ║    ✦ THE EAGER HELPER ✦             ║
  ║                                     ║
  ║  Your Claude can't wait to dive in. ║
  ║  Every message starts with "Let me" ║
  ║  and ends with offering to do more. ║
  ╚══════════════════════════════════════╝

  FUN STATS
  ──────────────────────────────────────────────────

  Apology Index ........... 12.5% of responses (yikes)
  Verbosity Score ......... 7.3/10 (your Claude is chatty)
  Code vs Prose ........... 62% code, 38% prose
  Peak Coding Hour ........ 2:00 AM (night owl detected)
  Longest Conversation .... 847 messages (Mar 2, a Thursday)
  Total Tokens Received ... ~4.2M (that's a novel)
```

## Options

| Flag | Description |
|------|-------------|
| `-d, --days <n>` | Only scan last N days |
| `-t, --top <n>` | Show top N phrases (default: 10) |
| `-j, --json` | Output as JSON |
| `--dir <path>` | Custom Claude data directory |

## How It Works

claudeisms reads the conversation logs stored locally by Claude Code at `~/.claude/projects/`. It streams through your JSONL files, runs 70+ phrase patterns against Claude's responses, and generates your personalized report. All processing happens locally -- nothing is sent anywhere.

## Requirements

- Node.js 18+
- Claude Code installed (with conversation history)

## License

MIT
