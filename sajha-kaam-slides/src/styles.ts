import type { CSSProperties } from 'react';
import { Easing } from 'remotion';

// ─── Paper-cutout palette (Sajha Kaam Edition) ──────────────────────────────
export const PAPER      = '#FAF6EE';   // Warm Lokta paper background
export const INK        = '#1E232A';   // Deep charcoal slate
export const BRICK      = '#B84A2B';   // Warm terracotta brick red
export const SAGE       = '#3A6351';   // Deep muted sage green
export const CLAY       = '#F0E5D3';   // Warm handmade clay paper
export const LINE       = '#D9CEBC';   // Subtle paper edge tone
export const WHITE      = '#FFFFFF';   // Crisp clean surface
export const MUSTARD    = '#D49726';   // Himalayan warm ochre / mustard
export const TEAL       = '#2A7F74';   // Vibrant mountain teal
export const CORAL      = '#DE5D42';   // Terracotta coral
export const NAVY       = '#15202B';   // Deep midnight slate
export const VIOLET     = '#533D6B';   // Muted violet accent

// ─── Typography ─────────────────────────────────────────────────────────────
export const fontHeading = `'Plus Jakarta Sans', 'Inter', system-ui, -apple-system, sans-serif`;
export const fontBody    = `'Inter', system-ui, -apple-system, sans-serif`;
export const fontAccent  = `'Caveat', cursive, sans-serif`;
export const devanagari  = `'Noto Sans Devanagari', 'Plus Jakarta Sans', system-ui, sans-serif`;

// ─── Smooth Animation Easing ────────────────────────────────────────────────
export const smoothEase = Easing.bezier(0.16, 1, 0.3, 1);
export const smoothIn = Easing.in(Easing.cubic);

// Zero jitter function — smooth calm motion instead of rapid vibration
export const boilWobble = (_frame: number, _strength = 1): CSSProperties => {
  return {};
};

// Gentle organic float for background accents (period in frames, e.g. 120 = 4s)
export const gentleFloat = (frame: number, period = 120, distance = 4): CSSProperties => {
  const y = Math.sin((frame / period) * Math.PI * 2) * distance;
  return { transform: `translateY(${y.toFixed(2)}px)` };
};

// ─── Base slide container ───────────────────────────────────────────────────
export const slideContainer: CSSProperties = {
  width: '100%',
  height: '100%',
  background: PAPER,
  fontFamily: fontHeading,
  color: INK,
  display: 'flex',
  flexDirection: 'column',
  padding: '64px 80px 50px',
  boxSizing: 'border-box',
  position: 'relative',
  overflow: 'hidden',
  backgroundImage: `
    radial-gradient(circle at 15% 15%, rgba(184, 74, 43, 0.03) 0%, transparent 60%),
    radial-gradient(circle at 85% 85%, rgba(58, 99, 81, 0.04) 0%, transparent 60%),
    repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(180, 155, 110, 0.03) 3px, rgba(180, 155, 110, 0.03) 4px)
  `,
};

// ─── Paper card ─────────────────────────────────────────────────────────────
export const card = (accent = false): CSSProperties => ({
  background: accent ? CLAY : WHITE,
  border: `2px solid ${accent ? '#CBB89E' : 'rgba(30, 35, 42, 0.12)'}`,
  borderRadius: 16,
  padding: '24px 28px',
  boxSizing: 'border-box',
  boxShadow: accent
    ? '0 10px 25px -5px rgba(184, 74, 43, 0.08), 0 4px 10px -2px rgba(0, 0, 0, 0.04)'
    : '0 12px 30px -6px rgba(30, 35, 42, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.03)',
  position: 'relative',
  transition: 'transform 0.3s ease',
});

// ─── Badge / pill ───────────────────────────────────────────────────────────
export const badge = (bg = MUSTARD, color = INK): CSSProperties => ({
  background: bg,
  borderRadius: 30,
  padding: '6px 16px',
  fontSize: 13,
  fontWeight: 700,
  color: color,
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  letterSpacing: '0.04em',
  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
});

// ─── Section label ───────────────────────────────────────────────────────────
export const sectionLabel: CSSProperties = {
  fontSize: 13,
  fontWeight: 800,
  color: BRICK,
  letterSpacing: '0.16em',
  marginBottom: 8,
  textTransform: 'uppercase',
  fontFamily: fontHeading,
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
};

// ─── Clean underline decorator ──────────────────────────────────────────────
export const crayonUnderline: CSSProperties = {
  height: 3,
  borderRadius: 2,
  background: `linear-gradient(90deg, ${BRICK} 0%, ${MUSTARD} 100%)`,
  opacity: 0.9,
  marginTop: 2,
  marginBottom: 20,
};

