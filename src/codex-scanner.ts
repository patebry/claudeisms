import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { homedir } from 'node:os';
import type { ScanOptions } from './types.js';

/**
 * Returns the default Codex CLI configuration directory (~/.codex).
 */
export function getDefaultCodexDir(): string {
  return join(homedir(), '.codex');
}

/**
 * Reads directory entries that are themselves directories, silently
 * returning an empty array when the path does not exist or is
 * inaccessible.
 */
async function listSubdirs(dir: string): Promise<string[]> {
  let names: string[];
  try {
    names = await readdir(dir);
  } catch {
    return [];
  }

  const dirs: string[] = [];
  for (const name of names) {
    try {
      const s = await stat(join(dir, name));
      if (s.isDirectory()) {
        dirs.push(name);
      }
    } catch {
      // Skip entries we cannot stat.
    }
  }
  return dirs;
}

/**
 * Async generator that discovers OpenAI Codex CLI conversation log files.
 *
 * The on-disk layout is:
 *   {codexDir}/sessions/YYYY/MM/DD/rollout-{timestamp}-{uuid}.jsonl
 *
 * The generator walks the three-level year/month/day directory tree under
 * `sessions/` and yields every `.jsonl` file path it finds. When the
 * `days` option is set, files whose mtime is older than the cutoff are
 * skipped.
 */
export async function* scanCodexConversations(
  options: ScanOptions,
): AsyncGenerator<string> {
  const sessionsDir = join(options.claudeDir, 'sessions');
  const cutoff = options.days
    ? Date.now() - options.days * 24 * 60 * 60 * 1000
    : null;

  // Level 1 -- year directories (e.g. 2026)
  const years = await listSubdirs(sessionsDir);

  for (const year of years) {
    const yearPath = join(sessionsDir, year);

    // Level 2 -- month directories (e.g. 03)
    const months = await listSubdirs(yearPath);

    for (const month of months) {
      const monthPath = join(yearPath, month);

      // Level 3 -- day directories (e.g. 09)
      const days = await listSubdirs(monthPath);

      for (const day of days) {
        const dayPath = join(monthPath, day);

        let entries: string[];
        try {
          entries = await readdir(dayPath);
        } catch {
          continue;
        }

        for (const entry of entries) {
          if (!entry.endsWith('.jsonl')) {
            continue;
          }

          const filePath = join(dayPath, entry);

          // Apply the days filter when requested.
          if (cutoff !== null) {
            try {
              const fileStat = await stat(filePath);
              if (fileStat.mtimeMs < cutoff) {
                continue;
              }
            } catch {
              continue;
            }
          }

          yield filePath;
        }
      }
    }
  }
}
