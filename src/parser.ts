import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';

export interface ParsedMessage {
  text: string;
  timestamp: Date;
  sessionId: string;
}

/**
 * Streams a Claude Code conversation JSONL file and yields assistant text
 * messages one at a time. Thinking blocks and tool_use blocks are discarded.
 *
 * The file is read line-by-line through a readline interface on a read stream,
 * so memory usage stays constant regardless of file size.
 */
export async function* parseConversation(
  filePath: string,
): AsyncGenerator<ParsedMessage> {
  const stream = createReadStream(filePath, { encoding: 'utf-8' });
  const rl = createInterface({ input: stream, crlfDelay: Infinity });

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

    if (envelope.type !== 'assistant') {
      continue;
    }

    const message = envelope.message as Record<string, unknown> | undefined | null;
    if (!message || typeof message !== 'object') {
      continue;
    }

    const sessionId = typeof envelope.sessionId === 'string' ? envelope.sessionId : '';
    const timestamp =
      typeof envelope.timestamp === 'string'
        ? new Date(envelope.timestamp)
        : new Date(0);

    const content = message.content;

    // content may be a plain string instead of the typical array of blocks.
    if (typeof content === 'string') {
      if (content.length > 0) {
        yield { text: content, timestamp, sessionId };
      }
      continue;
    }

    if (!Array.isArray(content)) {
      continue;
    }

    for (const block of content) {
      if (
        block !== null &&
        typeof block === 'object' &&
        block.type === 'text' &&
        typeof block.text === 'string' &&
        block.text.length > 0
      ) {
        yield { text: block.text, timestamp, sessionId };
      }
    }
  }
}
