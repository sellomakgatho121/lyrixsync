export interface LrcLine {
  timeMs: number;
  text: string;
}

const timestampRegex = /\[(\d{1,2}):(\d{1,2})(?:\.(\d{1,3}))?\]/g;

function toMs(minutes: number, seconds: number, millis?: number): number {
  return minutes * 60_000 + seconds * 1000 + (millis ?? 0);
}

export function parseLrc(lrcContent: string): LrcLine[] {
  const lines = lrcContent.split(/\r?\n/);
  const results: LrcLine[] = [];

  for (const rawLine of lines) {
    if (!rawLine.trim()) continue;
    let match: RegExpExecArray | null;
    const timestamps: number[] = [];
    while ((match = timestampRegex.exec(rawLine)) !== null) {
      const m = parseInt(match[1], 10) || 0;
      const s = parseInt(match[2], 10) || 0;
      const frac = match[3] ? parseInt(match[3].padEnd(3, '0').slice(0, 3), 10) : 0;
      timestamps.push(toMs(m, s, frac));
    }
    const text = rawLine.replace(timestampRegex, '').trim();
    if (!text) continue;
    for (const timeMs of timestamps) {
      results.push({ timeMs, text });
    }
  }

  return results.sort((a, b) => a.timeMs - b.timeMs);
}

export function formatMs(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const hundredths = Math.floor((ms % 1000) / 10);
  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');
  const hh = String(hundredths).padStart(2, '0');
  return `[${mm}:${ss}.${hh}]`;
}

export function toLrc(lines: LrcLine[]): string {
  const sorted = [...lines].sort((a, b) => a.timeMs - b.timeMs);
  return sorted.map(l => `${formatMs(l.timeMs)} ${l.text}`).join('\n');
}

