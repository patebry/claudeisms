import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { homedir } from 'node:os';
import type { ScanOptions } from './types.js';

/**
 * Returns the default Claude configuration directory (~/.claude).
 */
export function getDefaultClaudeDir(): string {
  return join(homedir(), '.claude');
}

/**
 * Async generator that discovers Claude Code conversation log files.
 *
 * Walks {claudeDir}/projects/{projectDir}/*.jsonl and yields each
 * file path. Optionally filters by file modification time when the
 * `days` option is set.
 */
export async function* scanConversations(
  options: ScanOptions,
): AsyncGenerator<string> {
  const projectsDir = join(options.claudeDir, 'projects');
  const cutoff = options.days
    ? Date.now() - options.days * 24 * 60 * 60 * 1000
    : null;

  let projectDirs: string[];
  try {
    projectDirs = await readdir(projectsDir);
  } catch {
    // ~/.claude/projects doesn't exist or is inaccessible -- nothing to scan.
    return;
  }

  for (const projectName of projectDirs) {
    const projectPath = join(projectsDir, projectName);

    // Only descend into directories.
    let projectStat;
    try {
      projectStat = await stat(projectPath);
    } catch {
      continue;
    }
    if (!projectStat.isDirectory()) {
      continue;
    }

    let entries: string[];
    try {
      entries = await readdir(projectPath);
    } catch {
      // Skip inaccessible project directories.
      continue;
    }

    for (const entry of entries) {
      // Only consider .jsonl files.
      if (!entry.endsWith('.jsonl')) {
        continue;
      }

      // Skip the user input history file -- it is not a conversation log.
      if (entry === 'history.jsonl') {
        continue;
      }

      const filePath = join(projectPath, entry);

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
