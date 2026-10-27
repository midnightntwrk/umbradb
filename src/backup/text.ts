/**
 * A backup file's text as a restore reads it (`openspec/changes/core-arch/specs/backups/spec.md` BK-3, BK-5;
 * `design.md` §9.1, §9.2; tasks 15.2, 16.1): its first line (the manifest) and then, as a stream, the lines after it
 * (the dump), each read as often as the restore needs. A file on disk is read through `node:fs` (`./restore.ts`); the
 * browser page's file — a `Blob` the user picked (BR-3) — through {@link blobText}, with the web's streams only, so
 * this module runs in Node.js and in a browser worker alike.
 *
 * **Lines** are the text between line feeds: a carriage return is kept (a dumped string may hold one, which a reader
 * that also ends a line there would split), and a last line without a feed is given.
 */

/** A backup's text (see the module comment). */
export interface BackupText {
  /** The first line, without its line feed: read until its first line feed, or the end. */
  firstLine(): Promise<string>;
  /** The lines from the second on (the dump), as a stream. */
  lines(): AsyncIterable<string>;
}

/** The first line of the text `chunks` give (see {@link BackupText.firstLine}); stops reading once it has it. */
export async function firstLineOf(chunks: AsyncIterable<string>): Promise<string> {
  let line = "";
  for await (const chunk of chunks) {
    const end = chunk.indexOf("\n");
    if (end >= 0) return line + chunk.slice(0, end);
    line += chunk;
  }
  return line;
}

/** The lines of the text `chunks` give, from the second on (see the module comment). */
export async function* linesAfterFirst(chunks: AsyncIterable<string>): AsyncGenerator<string> {
  let rest = "";
  let first = true;
  for await (const chunk of chunks) {
    rest += chunk;
    let from = 0;
    for (let at = rest.indexOf("\n"); at >= 0; at = rest.indexOf("\n", from)) {
      const line = rest.slice(from, at);
      from = at + 1;
      if (first) first = false;
      else yield line;
    }
    rest = rest.slice(from);
  }
  if (rest.length > 0 && !first) yield rest;
}

/** The text of `blob`, decoded as UTF-8, in chunks; the reading is cancelled when the caller stops early. */
async function* blobChunks(blob: Blob): AsyncGenerator<string> {
  const reader = blob.stream().pipeThrough(new TextDecoderStream()).getReader();
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) return;
      yield value;
    }
  } finally {
    await reader.cancel().catch(() => undefined);
  }
}

/** A backup's text from a `Blob` (the page's picked file, or any other), read anew each time (see the module comment). */
export function blobText(blob: Blob): BackupText {
  return Object.freeze({
    firstLine: () => firstLineOf(blobChunks(blob)),
    lines: () => linesAfterFirst(blobChunks(blob)),
  });
}
