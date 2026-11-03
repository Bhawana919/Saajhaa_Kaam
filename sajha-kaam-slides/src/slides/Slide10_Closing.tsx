import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { INK, BRICK, SAGE, CLAY, LINE, MUSTARD, CORAL, TEAL,
         slideContainer, smoothEase } from '../styles';
import { StageFrame } from '../StageFrame';
import { MountainIcon, FlagNepalIcon } from '../components/Icons';

export const Slide10: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const iconOp = interpolate(t, [0, 0.5], [0, 1], { easing: smoothEase, extrapolateRight: 'clamp' });
  const titleOp = interpolate(t, [0.15, 0.7], [0, 1], { easing: smoothEase, extrapolateRight: 'clamp' });
  const titleY  = interpolate(t, [0.15, 0.7], [24, 0], { easing: smoothEase, extrapolateRight: 'clamp' });

  const devanagariOp = interpolate(t, [0.35, 0.85], [0, 1], { easing: smoothEase, extrapolateRight: 'clamp' });
  const taglineOp    = interpolate(t, [0.55, 1.05], [0, 1], { easing: smoothEase, extrapolateRight: 'clamp' });
  const pitchOp      = interpolate(t, [0.85, 1.45], [0, 1], { easing: smoothEase, extrapolateRight: 'clamp' });
  const pitchY       = interpolate(t, [0.85, 1.45], [20, 0], { easing: smoothEase, extrapolateRight: 'clamp' });

  return (
    <div
      style={{
        ...slideContainer,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      {/* ── Background soft glow ── */}
      <div
        style={{
          position: 'absolute',
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 500,
          height: 300,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(212,151,38,0.12) 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      {/* ── Top Crest Emblem ── */}
      <div
        style={{
          opacity: iconOp,
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: 'rgba(184, 74, 43, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16,
          boxShadow: '0 4px 14px rgba(184, 74, 43, 0.12)',
        }}
      >
        <MountainIcon size={30} color={BRICK} strokeWidth={2.2} />
      </div>

      {/* ── Main Brand Title ── */}
      <div
        style={{
          opacity: titleOp,
          transform: `translateY(${titleY}px)`,
          fontSize: 76,
          fontWeight: 800,
          lineHeight: 1.05,
          letterSpacing: '-0.03em',
          marginBottom: 6,
        }}
      >
        <span style={{ color: INK }}>Sajha </span>
        <span
          style={{
            background: `linear-gradient(135deg, ${BRICK} 0%, ${CORAL} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Kaam
        </span>
      </div>

      {/* ── Devanagari ── */}
      <div
        style={{
          opacity: devanagariOp,
          fontSize: 30,
          color: BRICK,
          fontFamily: `'Noto Sans Devanagari', sans-serif`,
          fontWeight: 700,
          marginBottom: 16,
        }}
      >
        साझा काम
      </div>

      {/* ── Tagline ── */}
      <div
        style={{
          opacity: taglineOp,
          fontSize: 22,
          color: '#4B5563',
          fontWeight: 600,
          marginBottom: 32,
        }}
      >
        Local talent. Global work. Clear terms.
      </div>

      {/* ── Pitch note card ── */}
      <div
        style={{
          opacity: pitchOp,
          transform: `translateY(${pitchY}px)`,
          background: WHITE,
          border: `1.5px solid rgba(184, 74, 43, 0.2)`,
          borderRadius: 20,
          padding: '24px 44px',
          maxWidth: 720,
          boxShadow: '0 16px 36px rgba(0, 0, 0, 0.06)',
        }}
      >
        <div style={{ fontSize: 20, color: INK, lineHeight: 1.6, fontWeight: 600, marginBottom: 8 }}>
          "Sajha Kaam turns a first paid cross-border project into repeatable, verifiable trust."
        </div>
        <div style={{ fontSize: 15, color: BRICK, fontWeight: 700 }}>
          Global work should be a real choice from home.
        </div>
      </div>

      <StageFrame />
    </div>
  );
};


