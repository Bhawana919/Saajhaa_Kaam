import React from 'react';
import { BRICK, MUSTARD, SAGE, LINE } from './styles';

// ─── Refined Nepali Lokta Paper Frame ────────────────────────────────────────

export const StageFrame: React.FC = () => {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 50,
        overflow: 'hidden',
      }}
    >
      {/* ── Outer subtle paper border ── */}
      <div
        style={{
          position: 'absolute',
          inset: 16,
          border: `1.5px solid rgba(184, 74, 43, 0.2)`,
          borderRadius: 8,
          pointerEvents: 'none',
        }}
      />

      {/* ── Inner fine decorative border ── */}
      <div
        style={{
          position: 'absolute',
          inset: 22,
          border: `1px dashed rgba(217, 206, 188, 0.6)`,
          borderRadius: 6,
          pointerEvents: 'none',
        }}
      />

      {/* ── Top-left corner knot ── */}
      <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 3 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: BRICK, opacity: 0.8 }} />
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: MUSTARD, opacity: 0.8 }} />
      </div>

      {/* ── Top-right corner knot ── */}
      <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 3 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: MUSTARD, opacity: 0.8 }} />
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: BRICK, opacity: 0.8 }} />
      </div>

      {/* ── Bottom-left corner knot ── */}
      <div style={{ position: 'absolute', bottom: 12, left: 12, display: 'flex', gap: 3 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: SAGE, opacity: 0.8 }} />
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: LINE, opacity: 0.8 }} />
      </div>

      {/* ── Bottom-right corner knot ── */}
      <div style={{ position: 'absolute', bottom: 12, right: 12, display: 'flex', gap: 3 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: LINE, opacity: 0.8 }} />
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: SAGE, opacity: 0.8 }} />
      </div>

      {/* ── Bottom subtle branding tag ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 28,
          right: 36,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.12em',
          color: 'rgba(30, 35, 42, 0.35)',
          textTransform: 'uppercase',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: BRICK, display: 'inline-block' }} />
        SAJHA KAAM · HACKATHON 2025
      </div>
    </div>
  );
};

