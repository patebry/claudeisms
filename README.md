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

> Plain text shown below -- colors and gradients render in your actual terminal.

```
   _____ _                 _      _
  / ____| |               | |    (_)
 | |    | | __ _ _   _  __| | ___ _ ___ _ __ ___  ___
 | |    | |/ _` | | | |/ _` |/ _ \ / __| '_ ` _ \/ __|
 | |____| | (_| | |_| | (_| |  __/ \__ \ | | | | \__ \
  \_____|_|\__,_|\__,_|\__,_|\___|_|___/_| |_| |_|___/

                  ~ Your Claude Code Wrapped ~

╭──────────────────────────────────────────────────────────────╮
│                                                              │
│                 Feb 9, 2026  →  Mar 11, 2026                 │
│                                                              │
│   559  conversations                                         │
│   8,820  messages from Claude                                │
│   720,919  words generated                                   │
│                                                              │
╰──────────────────────────────────────────────────────────────╯

─── TOP CLAUDEISMS ────────────────────────────────────────────

  ★ #1     "Let me check"
         ████████████████████████ 780  [narration]

  ★ #2     "Now let me"
         ████████████████████░░░░ 647  [narration]

  ★ #3     "Perfect!"
         █████████████░░░░░░░░░░░ 431  [enthusiasm]

    #4     "Successfully"
         ████░░░░░░░░░░░░░░░░░░░░ 140  [completion]

    #5     "Great!"
         █░░░░░░░░░░░░░░░░░░░░░░░ 41  [enthusiasm]


─── YOUR ARCHETYPE ────────────────────────────────────────────

╭──────────────────────────────────────────────────────────────╮
│                                                              │
│                             🎬                               │
│                                                              │
│                        THE NARRATOR                          │
│           Let me tell you what I am about to do              │
│                                                              │
│        Dominant categories: narration, claude-code           │
│                                                              │
╰──────────────────────────────────────────────────────────────╯

─── FUN STATS ─────────────────────────────────────────────────

  │  ♥ Claude apologized to you 1 times
  │  ✔ Claude agreed with you 38 times
  │  ✎ Average 82 words/message = Thorough
  │  ↺ Self-corrected 34 times
  │  ↕ Longest message: 3,694 words
  │  ↓ Shortest message: "Done." (5 chars)

  │  Code vs Prose
  │  ████████████████████████████████████
  │  Code 20%                          Prose 80%

  │  ⌚ Most active hour: 11 AM
  │  0h ▁▁▁▁▁▁▁▃▅▇▇█▅▃▄▅▆▄▅▄▃▂▂▁ 23h

────────────────────────────────────────────────────────────────
           claudeisms v0.1.0 · generated Mar 11, 2026
```

## Share Card

A 1200x630 PNG share card is generated automatically — perfect for Twitter, LinkedIn, or your team Slack:

```bash
npx claudeisms                    # saves claudeisms.png by default
npx claudeisms --png custom.png   # custom filename
npx claudeisms --no-png           # skip card generation
```

![Example share card](https://raw.githubusercontent.com/patebry/claudeisms/main/examples/card.png)

Dark theme with gradient bars, stat tiles, hourly activity chart, and your archetype front and center.

## Options

| Flag | Description |
|------|-------------|
| `-d, --days <n>` | Only scan last N days |
| `-t, --top <n>` | Show top N phrases (default: 10) |
| `-j, --json` | Output as JSON |
| `-p, --png <path>` | Save PNG card to custom path (default: claudeisms.png) |
| `--no-png` | Skip PNG card generation |
| `--dir <path>` | Custom Claude data directory |

## How It Works

claudeisms reads the conversation logs stored locally by Claude Code at `~/.claude/projects/`. It streams through your JSONL files, runs 70+ phrase patterns against Claude's responses, and generates your personalized report. All processing happens locally -- nothing is sent anywhere.

## Requirements

- Node.js 18+
- Claude Code installed (with conversation history)

## License

MIT
