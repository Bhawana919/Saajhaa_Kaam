import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { PAPER, INK, BRICK, SAGE, CLAY, LINE, WHITE, MUSTARD, TEAL, CORAL,
         slideContainer, card, sectionLabel, crayonUnderline, smoothEase, gentleFloat } from '../styles';
import { StageFrame } from '../StageFrame';
import { FlagNepalIcon, GlobeIcon, UserIcon, BriefcaseIcon } from '../components/Icons';

export const Slide01: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const titleOp = interpolate(t, [0, 0.6], [0, 1], { easing: smoothEase, extrapolateRight: 'clamp' });
  const titleY  = interpolate(t, [0, 0.6], [28, 0], { easing: smoothEase, extrapolateRight: 'clamp' });

  const subOp = interpolate(t, [0.35, 0.9], [0, 1], { easing: smoothEase, extrapolateRight: 'clamp' });
  const subY  = interpolate(t, [0.35, 0.9], [20, 0], { easing: smoothEase, extrapolateRight: 'clamp' });

  const cardLeftOp = interpolate(t, [0.65, 1.2], [0, 1], { easing: smoothEase, extrapolateRight: 'clamp' });
  const cardLeftY  = interpolate(t, [0.65, 1.2], [30, 0], { easing: smoothEase, extrapolateRight: 'clamp' });

  const cardRightOp = interpolate(t, [0.85, 1.4], [0, 1], { easing: smoothEase, extrapolateRight: 'clamp' });
  const cardRightY  = interpolate(t, [0.85, 1.4], [30, 0], { easing: smoothEase, extrapolateRight: 'clamp' });

  const arrowOp = interpolate(t, [1.1, 1.6], [0, 1], { easing: smoothEase, extrapolateRight: 'clamp' });
  const arrowScale = interpolate(t, [1.1, 1.6], [0.7, 1], { easing: smoothEase, extrapolateRight: 'clamp' });

  return (
    <div style={{ ...slideContainer }}>
      {/* ── Mountain silhouette SVG (Lokta layered papercraft) ── */}
      <svg
        style={{
          position: 'absolute',
          right: 40,
          bottom: 40,
          width: 580,
          height: 260,
          opacity: 0.15,
          pointerEvents: 'none',
        }}
        viewBox="0 0 600 300"
      >
        <path d="M0,300 L120,130 L220,240 L360,70 L480,210 L600,100 L600,300 Z" fill={SAGE} />
        <path d="M80,300 L240,110 L340,220 L440,90 L560,260 L600,200 L600,300 Z" fill={BRICK} opacity="0.4" />
      </svg>

      {/* ── Sun ambient glow ── */}
      <div
        style={{
          position: 'absolute',
          right: 120,
          top: 60,
          width: 90,
          height: 90,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${MUSTARD} 0%, rgba(212,151,38,0) 70%)`,
          opacity: 0.45,
          ...gentleFloat(frame, 160, 6),
        }}
      />

      {/* ── Section label ── */}
      <div style={{ ...sectionLabel }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: BRICK }} />
        The Opportunity
      </div>
      <div style={{ ...crayonUnderline, width: 80 }} />

      {/* ── Title ── */}
      <div style={{ opacity: titleOp, transform: `translateY(${titleY}px)` }}>
        <div style={{ fontSize: 62, fontWeight: 800, color: INK, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 6 }}>
          Nepali talent.
        </div>
        <div style={{
          fontSize: 62,
          fontWeight: 800,
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
          marginBottom: 20,
          background: `linear-gradient(135deg, ${BRICK} 0%, ${CORAL} 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Global opportunity.
        </div>
      </div>

      {/* ── Sub-text ── */}
      <div
        style={{
          opacity: subOp,
          transform: `translateY(${subY}px)`,
          fontSize: 21,
          color: '#4B5563',
          marginBottom: 36,
          maxWidth: 720,
          lineHeight: 1.6,
          fontWeight: 400,
        }}
      >
        Nepal has no shortage of talent. Yet for many young people, a good job still seems to begin with a flight abroad.
      </div>

      {/* ── Cards row ── */}
      <div style={{ display: 'flex', gap: 28, alignItems: 'center', marginTop: 'auto', marginBottom: 20 }}>
        {/* Left card */}
        <div
          style={{
            ...card(false),
            flex: 1,
            opacity: cardLeftOp,
            transform: `translateY(${cardLeftY}px)`,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: BRICK, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              LOCAL TALENT
            </span>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(184,74,43,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FlagNepalIcon size={20} color={BRICK} />
            </div>
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: INK, marginBottom: 6 }}>Skills & Ambition</div>
          <div style={{ fontSize: 15, color: SAGE, fontWeight: 500, lineHeight: 1.5 }}>
            A real choice to build a global career from home.
          </div>
        </div>

        {/* Arrow connector */}
        <div
          style={{
            opacity: arrowOp,
            transform: `scale(${arrowScale})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: WHITE,
            border: `1.5px solid rgba(30,35,42,0.12)`,
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
            flexShrink: 0,
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={BRICK} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </div>

        {/* Right card */}
        <div
          style={{
            ...card(true),
            flex: 1,
            opacity: cardRightOp,
            transform: `translateY(${cardRightY}px)`,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: SAGE, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              GLOBAL CLIENTS
            </span>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(58,99,81,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GlobeIcon size={18} color={SAGE} />
            </div>
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: INK, marginBottom: 6 }}>Customers & Projects</div>
          <div style={{ fontSize: 15, color: '#55606E', fontWeight: 500, lineHeight: 1.5 }}>
            Real commercial demand with verifiable results.
          </div>
        </div>
      </div>

      <StageFrame />
    </div>
  );
};


