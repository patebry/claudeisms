import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';
import { basename } from 'node:path';
import type { ParsedMessage } from './parser.js';

/**
 * Streams an OpenAI Codex CLI conversation JSONL file and yields assistant
 * text messages one at a time. Only `response_item` lines with
 * `payload.role === "assistant"` are considered, and only `output_text`
 * content blocks are extracted.
 *
 * The first `session_meta` line is used to capture the session ID. If no
 * session_meta line is present, the filename is used as a fallback.
 *
 * The file is read line-by-line through a readline interface on a read
 * stream, so memory usage stays constant regardless of file size.
 */
export async function* parseCodexConversation(
  filePath: string,
): AsyncGenerator<ParsedMessage> {
  const stream = createReadStream(filePath, { encoding: 'utf-8' });
  const rl = createInterface({ input: stream, crlfDelay: Infinity });

  let sessionId: string = basename(filePath, '.jsonl');

  for await (const line of rl) {
    const trimmed = line.trim();
    if (trimmed.length === 0) {
      continue;
    }

    let envelope: Record<string, unknown>;
    try {
      envelope = JSON.parse(trimmed);
    } catch {
      // Malformed JSON line -- skip silently.
      continue;
    }

    // Capture session ID from session_meta if we haven't seen one yet.
    if (envelope.type === 'session_meta') {
      const payload = envelope.payload as Record<string, unknown> | undefined;
      if (payload && typeof payload === 'object' && typeof payload.id === 'string') {
        sessionId = payload.id;
      }
      continue;
    }

    // We only care about response_item lines.
    if (envelope.type !== 'response_item') {
      continue;
    }

    const payload = envelope.payload as Record<string, unknown> | undefined | null;
    if (!payload || typeof payload !== 'object') {
      continue;
    }

    // Only assistant messages.
    if (payload.role !== 'assistant' || payload.type !== 'message') {
      continue;
    }

    const timestamp =
      typeof envelope.timestamp === 'string'
        ? new Date(envelope.timestamp)
        : new Date(0);

    const content = payload.content;
    if (!Array.isArray(content)) {
      continue;
    }

    for (const block of content) {
      if (
        block !== null &&
        typeof block === 'object' &&
        block.type === 'output_text' &&
        typeof block.text === 'string' &&
        block.text.length > 0
      ) {
        yield { text: block.text, timestamp, sessionId };
      }
    }
  }
}
