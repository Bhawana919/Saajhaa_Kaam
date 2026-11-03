import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { INK, BRICK, SAGE, CLAY, LINE, MUSTARD, WHITE,
         slideContainer, sectionLabel, crayonUnderline, smoothEase } from '../styles';
import { StageFrame } from '../StageFrame';
import { LightbulbIcon, DocumentCheckIcon } from '../components/Icons';

export const Slide02: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const titleOp = interpolate(t, [0, 0.5], [0, 1], { easing: smoothEase, extrapolateRight: 'clamp' });
  const titleY  = interpolate(t, [0, 0.5], [20, 0], { easing: smoothEase, extrapolateRight: 'clamp' });

  const numOp    = interpolate(t, [0.35, 0.9], [0, 1], { easing: smoothEase, extrapolateRight: 'clamp' });
  const numScale = interpolate(t, [0.35, 0.9], [0.92, 1], { easing: smoothEase, extrapolateRight: 'clamp' });

  const noteOp = interpolate(t, [0.75, 1.3], [0, 1], { easing: smoothEase, extrapolateRight: 'clamp' });
  const noteY  = interpolate(t, [0.75, 1.3], [20, 0], { easing: smoothEase, extrapolateRight: 'clamp' });

  const srcOp = interpolate(t, [1.1, 1.7], [0, 1], { easing: smoothEase, extrapolateRight: 'clamp' });

  return (
    <div style={{ ...slideContainer }}>
      {/* ── Background passport stamp watermark ── */}
      <div
        style={{
          position: 'absolute',
          right: 80,
          top: 80,
          width: 220,
          height: 220,
          borderRadius: '50%',
          border: `2px dashed rgba(184, 74, 43, 0.15)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <div style={{
          fontSize: 12,
          fontWeight: 800,
          color: 'rgba(184, 74, 43, 0.2)',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          textAlign: 'center',
        }}>
          OFFICIAL DATA · ILO NEPAL
        </div>
      </div>

      {/* ── Section label ── */}
      <div style={{ ...sectionLabel }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: BRICK }} />
        The Scale of Movement
      </div>
      <div style={{ ...crayonUnderline, width: 120 }} />

      {/* ── Title ── */}
      <div
        style={{
          opacity: titleOp,
          transform: `translateY(${titleY}px)`,
          fontSize: 44,
          fontWeight: 800,
          color: INK,
          marginBottom: 32,
          maxWidth: 820,
          lineHeight: 1.2,
          letterSpacing: '-0.02em',
        }}
      >
        The problem is bigger than a number.
      </div>

      {/* ── Big stat card ── */}
      <div
        style={{
          opacity: numOp,
          transform: `scale(${numScale})`,
          transformOrigin: 'left center',
          marginBottom: 16,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'baseline',
            gap: 20,
            background: WHITE,
            border: `2px solid rgba(212, 151, 38, 0.4)`,
            borderRadius: 20,
            padding: '16px 36px',
            boxShadow: '0 12px 32px rgba(212, 151, 38, 0.12), 0 4px 12px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{
            fontSize: 92,
            fontWeight: 800,
            color: BRICK,
            lineHeight: 1,
            letterSpacing: '-0.03em',
          }}>
            740,000+
          </div>
          <div style={{ fontSize: 22, color: INK, fontWeight: 600, maxWidth: 360, lineHeight: 1.3 }}>
            labour permits issued in FY 2023/24
          </div>
        </div>
      </div>

      {/* ── Clarification note card ── */}
      <div
        style={{
          opacity: noteOp,
          transform: `translateY(${noteY}px)`,
          background: CLAY,
          border: `1.5px solid rgba(184, 74, 43, 0.2)`,
          borderRadius: 16,
          padding: '20px 28px',
          marginTop: 16,
          maxWidth: 840,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.04)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <div style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(212,151,38,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LightbulbIcon size={18} color={BRICK} />
          </div>
          <div style={{ fontSize: 19, color: INK, fontWeight: 700 }}>
            Permits are not a count of unique emigrants.
          </div>
        </div>
        <div style={{ fontSize: 16, color: '#4A5568', lineHeight: 1.5, marginLeft: 38 }}>
          We cannot solve migration with an app — but we can make one better option real for digital and remote talent.
        </div>
      </div>

      {/* ── Source footnote ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 34,
          left: 80,
          opacity: srcOp,
          fontSize: 12,
          color: '#718096',
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <DocumentCheckIcon size={14} color={SAGE} />
        <span>Source: ILO Nepal · FY 2023/24 labour permit statistics (Permit counts include renewals, not unique people)</span>
      </div>

      <StageFrame />
    </div>
  );
};


