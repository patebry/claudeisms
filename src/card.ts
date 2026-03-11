import { createCanvas, GlobalFonts } from '@napi-rs/canvas';
import type { SKRSContext2D } from '@napi-rs/canvas';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';
import type { AnalysisResult, Archetype, Category } from './types.js';
import { ARCHETYPES } from './phrases.js';

// ── Color Palette ────────────────────────────────────────────────

const COLORS = {
  bg: '#0D0D0F',
  surface: '#16161A',
  border: '#2A2A35',
  muted: '#4B5563',
  subtle: '#6B7280',
  secondary: '#9CA3AF',
  primary: '#E5E7EB',
  white: '#FFFFFF',
  violet300: '#A78BFA',
  violet500: '#8B5CF6',
  violet900: '#4C1D95',
  deepPurple: '#1A0A2E',
  pink500: '#EC4899',
  amber400: '#F59E0B',
  orange500: '#F97316',
};

// ── Helpers ──────────────────────────────────────────────────────

function formatNumber(n: number): string {
  return n.toLocaleString('en-US');
}

function roundRect(
  ctx: SKRSContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

function getArchetype(result: AnalysisResult, archetypes: Archetype[]): Archetype {
  let totalAll = 0;
  for (const count of result.categoryBreakdown.values()) {
    totalAll += count;
  }
  if (totalAll === 0) {
    return {
      name: 'The Mystery',
      description: 'Not enough data yet',
      icon: '🔮',
      categories: [] as Category[],
    };
  }

  let best = archetypes[0];
  let bestScore = -1;
  for (const arch of archetypes) {
    let score = 0;
    for (const cat of arch.categories) {
      const catCount = result.categoryBreakdown.get(cat) ?? 0;
      score += catCount / totalAll;
    }
    score /= arch.categories.length || 1;
    if (score > bestScore) {
      bestScore = score;
      best = arch;
    }
  }
  return best;
}

function formatDateShort(d: Date): string {
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const n = parseInt(hex.replace('#', ''), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function rgbString(r: number, g: number, b: number, a = 1): string {
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

// ── Drawing Functions ────────────────────────────────────────────

function drawBackground(ctx: SKRSContext2D, w: number, h: number) {
  // Solid background
  ctx.fillStyle = COLORS.bg;
  ctx.fillRect(0, 0, w, h);

  // Radial gradient overlay centered on canvas
  const gradient = ctx.createRadialGradient(600, 315, 0, 600, 315, Math.max(w, h) * 0.7);
  gradient.addColorStop(0, COLORS.deepPurple);
  gradient.addColorStop(0.7, 'rgba(26, 10, 46, 0)');
  gradient.addColorStop(1, 'rgba(26, 10, 46, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);
}

function drawHeader(ctx: SKRSContext2D, result: AnalysisResult, title?: string) {
  // Title
  ctx.save();
  ctx.font = 'bold 18px Inter, sans-serif';
  ctx.fillStyle = COLORS.violet500;
  ctx.letterSpacing = '4px';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(title || 'CLAUDEISMS', 60, 45);

  // Gradient underline
  const lineGrad = ctx.createLinearGradient(60, 68, 220, 68);
  lineGrad.addColorStop(0, COLORS.violet500);
  lineGrad.addColorStop(1, COLORS.pink500);
  ctx.strokeStyle = lineGrad;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(60, 68);
  ctx.lineTo(220, 68);
  ctx.stroke();

  // Date range (right-aligned)
  ctx.letterSpacing = '0px';
  ctx.font = '13px Inter, sans-serif';
  ctx.fillStyle = COLORS.subtle;
  ctx.textAlign = 'right';
  const dateStr = `${formatDateShort(result.dateRange.first)} — ${formatDateShort(result.dateRange.last)}`;
  ctx.fillText(dateStr, 1140, 45);
  ctx.restore();
}

function drawHero(ctx: SKRSContext2D, result: AnalysisResult, archetypes: Archetype[]) {
  const arch = getArchetype(result, archetypes);

  ctx.save();
  // Archetype name
  ctx.font = 'bold 64px Inter, sans-serif';
  ctx.fillStyle = COLORS.white;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  const nameUpper = arch.name.toUpperCase();
  ctx.fillText(nameUpper, 60, 200);

  // Description
  ctx.font = 'italic 16px Inter, sans-serif';
  ctx.fillStyle = COLORS.violet300;
  ctx.fillText(arch.description, 60, 235);
  ctx.restore();
}

function drawPhrases(ctx: SKRSContext2D, result: AnalysisResult) {
  ctx.save();

  // Section label
  ctx.font = 'bold 11px Inter, sans-serif';
  ctx.fillStyle = COLORS.subtle;
  ctx.letterSpacing = '3px';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('TOP PHRASES', 60, 305);
  ctx.letterSpacing = '0px';

  const top5 = result.topPhrases.slice(0, 5);
  if (top5.length === 0) {
    ctx.font = '14px Inter, sans-serif';
    ctx.fillStyle = COLORS.muted;
    ctx.fillText('No phrases detected yet', 60, 350);
    ctx.restore();
    return;
  }

  const maxCount = top5[0].count;
  const rowHeight = 44;
  const startY = 324;

  const barOpacities = [1.0, 0.8, 0.6, 0.45, 0.3];

  for (let i = 0; i < top5.length; i++) {
    const phrase = top5[i];
    const y = startY + i * rowHeight;

    // Rank number
    ctx.font = '13px monospace';
    ctx.fillStyle = COLORS.muted;
    ctx.textAlign = 'left';
    const rank = String(i + 1).padStart(2, '0');
    ctx.fillText(rank, 60, y + 12);

    // Phrase text (truncate at 28 chars)
    ctx.font = '15px Inter, sans-serif';
    ctx.fillStyle = COLORS.primary;
    let displayPhrase = phrase.displayName;
    if (displayPhrase.length > 28) {
      displayPhrase = displayPhrase.slice(0, 27) + '...';
    }
    ctx.fillText(`"${displayPhrase}"`, 100, y + 12);

    // Bar
    const barY = y + 20;
    const barMaxWidth = 380;
    const barWidth = maxCount > 0 ? (phrase.count / maxCount) * barMaxWidth : 0;

    if (i === 0) {
      // Rank 1: gradient bar
      const barGrad = ctx.createLinearGradient(100, barY, 100 + barWidth, barY);
      barGrad.addColorStop(0, COLORS.violet500);
      barGrad.addColorStop(1, COLORS.pink500);
      ctx.fillStyle = barGrad;
    } else {
      // Other ranks: violet500 at decreasing opacity
      const { r, g, b } = hexToRgb(COLORS.violet500);
      ctx.fillStyle = rgbString(r, g, b, barOpacities[i]);
    }

    roundRect(ctx, 100, barY, Math.max(barWidth, 4), 4, 2);
    ctx.fill();

    // Count (right-aligned)
    ctx.font = '12px monospace';
    ctx.fillStyle = COLORS.secondary;
    ctx.textAlign = 'right';
    ctx.fillText(`\u00D7${formatNumber(phrase.count)}`, 560, y + 12);
  }

  ctx.restore();
}

function drawStats(ctx: SKRSContext2D, result: AnalysisResult) {
  ctx.save();

  // Section label
  ctx.font = 'bold 11px Inter, sans-serif';
  ctx.fillStyle = COLORS.subtle;
  ctx.letterSpacing = '3px';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('STATS', 620, 305);
  ctx.letterSpacing = '0px';

  const tiles = [
    { value: result.totalConversations, label: 'CONVERSATIONS', accent: COLORS.violet500 },
    { value: result.totalMessages, label: 'MESSAGES', accent: COLORS.pink500 },
    { value: result.apologyCount, label: 'APOLOGIES', accent: COLORS.amber400 },
  ];

  const tileW = 160;
  const tileH = 80;
  const gap = 10;
  const startX = 620;
  const startY = 324;

  for (let i = 0; i < tiles.length; i++) {
    const tile = tiles[i];
    const tx = startX + i * (tileW + gap);
    const ty = startY;

    // Tile background
    ctx.fillStyle = COLORS.surface;
    roundRect(ctx, tx, ty, tileW, tileH, 8);
    ctx.fill();

    // Accent dot
    ctx.fillStyle = tile.accent;
    ctx.beginPath();
    ctx.arc(tx + 10, ty + 10, 4, 0, Math.PI * 2);
    ctx.fill();

    // Big number
    ctx.font = 'bold 26px Inter, sans-serif';
    ctx.fillStyle = COLORS.white;
    ctx.textAlign = 'center';
    ctx.fillText(formatNumber(tile.value), tx + tileW / 2, ty + 35);

    // Label
    ctx.font = 'bold 10px Inter, sans-serif';
    ctx.fillStyle = COLORS.subtle;
    ctx.letterSpacing = '1px';
    ctx.fillText(tile.label, tx + tileW / 2, ty + 58);
    ctx.letterSpacing = '0px';
  }

  ctx.restore();
}

function drawActivity(ctx: SKRSContext2D, result: AnalysisResult) {
  ctx.save();

  // Section label
  ctx.font = 'bold 11px Inter, sans-serif';
  ctx.fillStyle = COLORS.subtle;
  ctx.letterSpacing = '3px';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('ACTIVITY', 620, 445);
  ctx.letterSpacing = '0px';

  const hours = result.hourlyActivity;
  const maxVal = Math.max(...hours, 1);
  const barW = 18;
  const gapW = 2;
  const maxBarH = 80;
  const baseY = 540;
  const startX = 620;

  // Color interpolation helpers
  const cLow = hexToRgb(COLORS.violet900);
  const cMid = hexToRgb(COLORS.violet500);
  const cHigh = hexToRgb(COLORS.violet300);

  for (let h = 0; h < 24; h++) {
    const val = hours[h] ?? 0;
    const ratio = maxVal > 0 ? val / maxVal : 0;
    const barH = Math.max(ratio * maxBarH, 2); // minimum 2px so every hour shows
    const bx = startX + h * (barW + gapW);
    const by = baseY - barH;

    // Color based on intensity
    let r: number, g: number, b: number;
    if (ratio < 0.5) {
      const t = ratio * 2;
      r = Math.round(cLow.r + (cMid.r - cLow.r) * t);
      g = Math.round(cLow.g + (cMid.g - cLow.g) * t);
      b = Math.round(cLow.b + (cMid.b - cLow.b) * t);
    } else {
      const t = (ratio - 0.5) * 2;
      r = Math.round(cMid.r + (cHigh.r - cMid.r) * t);
      g = Math.round(cMid.g + (cHigh.g - cMid.g) * t);
      b = Math.round(cMid.b + (cHigh.b - cMid.b) * t);
    }

    ctx.fillStyle = rgbString(r, g, b);
    roundRect(ctx, bx, by, barW, barH, 3);
    ctx.fill();
  }

  // Hour labels
  ctx.font = '10px monospace';
  ctx.fillStyle = COLORS.muted;
  ctx.textAlign = 'center';
  const labels: [number, string][] = [
    [0, '12a'],
    [6, '6a'],
    [12, '12p'],
    [18, '6p'],
  ];
  for (const [hour, label] of labels) {
    const lx = startX + hour * (barW + gapW) + barW / 2;
    ctx.fillText(label, lx, baseY + 14);
  }

  ctx.restore();
}

function drawFooter(ctx: SKRSContext2D, w: number, h: number, title?: string) {
  ctx.save();

  // Separator line
  ctx.strokeStyle = COLORS.border;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(60, 570);
  ctx.lineTo(w - 60, 570);
  ctx.stroke();

  // Center pill: "npx claudeisms"
  const pillText = title === 'CODEXISMS' ? 'npx codexisms' : 'npx claudeisms';
  ctx.font = 'bold 14px monospace';
  const pillMetrics = ctx.measureText(pillText);
  const pillTextW = pillMetrics.width;
  const pillPadH = 20;
  const pillPadV = 8;
  const pillW = pillTextW + pillPadH * 2;
  const pillH = 14 + pillPadV * 2;
  const pillX = (w - pillW) / 2;
  const pillY = 600 - pillH / 2;

  // Pill background
  ctx.fillStyle = COLORS.deepPurple;
  roundRect(ctx, pillX, pillY, pillW, pillH, 16);
  ctx.fill();

  // Pill border
  ctx.strokeStyle = COLORS.violet500;
  ctx.lineWidth = 1;
  roundRect(ctx, pillX, pillY, pillW, pillH, 16);
  ctx.stroke();

  // Pill text
  ctx.fillStyle = COLORS.violet500;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(pillText, w / 2, 600);

  // Right: github link
  ctx.font = '11px Inter, sans-serif';
  ctx.fillStyle = COLORS.muted;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  ctx.fillText('github.com/patebry/claudeisms', 1140, 600);

  ctx.restore();
}

// ── Main Export ──────────────────────────────────────────────────

export async function generateCard(result: AnalysisResult, archetypes?: Archetype[], title?: string): Promise<Buffer> {
  // Register bundled Inter font if available
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const fontsDir = join(__dirname, '..', 'fonts');
  if (existsSync(join(fontsDir, 'Inter-Bold.ttf'))) {
    GlobalFonts.registerFromPath(join(fontsDir, 'Inter-Bold.ttf'), 'Inter');
    GlobalFonts.registerFromPath(join(fontsDir, 'Inter-Regular.ttf'), 'Inter');
  }

  const WIDTH = 1200;
  const HEIGHT = 630;
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');

  drawBackground(ctx, WIDTH, HEIGHT);
  drawHeader(ctx, result, title);
  drawHero(ctx, result, archetypes ?? ARCHETYPES);
  drawPhrases(ctx, result);
  drawStats(ctx, result);
  drawActivity(ctx, result);
  drawFooter(ctx, WIDTH, HEIGHT, title);

  return canvas.toBuffer('image/png');
}
