import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { INK, BRICK, SAGE, CLAY, LINE, WHITE, MUSTARD, TEAL, CORAL,
         slideContainer, card, sectionLabel, crayonUnderline, smoothEase } from '../styles';
import { StageFrame } from '../StageFrame';
import { TargetIcon, UserIcon, BriefcaseIcon, HandshakeIcon } from '../components/Icons';

export const Slide03: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const titleOp      = interpolate(t, [0, 0.5], [0, 1], { easing: smoothEase, extrapolateRight: 'clamp' });
  const devanagariOp = interpolate(t, [0.25, 0.75], [0, 1], { easing: smoothEase, extrapolateRight: 'clamp' });
  const taglineOp    = interpolate(t, [0.45, 0.95], [0, 1], { easing: smoothEase, extrapolateRight: 'clamp' });

  const card1Op = interpolate(t, [0.65, 1.15], [0, 1], { easing: smoothEase, extrapolateRight: 'clamp' });
  const card1Y  = interpolate(t, [0.65, 1.15], [24, 0], { easing: smoothEase, extrapolateRight: 'clamp' });

  const card2Op = interpolate(t, [0.85, 1.35], [0, 1], { easing: smoothEase, extrapolateRight: 'clamp' });
  const card2Y  = interpolate(t, [0.85, 1.35], [24, 0], { easing: smoothEase, extrapolateRight: 'clamp' });

  const resultOp    = interpolate(t, [1.15, 1.65], [0, 1], { easing: smoothEase, extrapolateRight: 'clamp' });
  const resultScale = interpolate(t, [1.15, 1.65], [0.95, 1], { easing: smoothEase, extrapolateRight: 'clamp' });

  return (
    <div style={{ ...slideContainer }}>
      {/* ── Section label ── */}
      <div style={{ ...sectionLabel }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: BRICK }} />
        The Solution
      </div>
      <div style={{ ...crayonUnderline, width: 80 }} />

      {/* ── Title Header ── */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 18, marginBottom: 8, opacity: titleOp }}>
        <div style={{ fontSize: 58, fontWeight: 800, color: INK, letterSpacing: '-0.02em' }}>
          Sajha Kaam
        </div>
        <div
          style={{
            opacity: devanagariOp,
            fontSize: 28,
            color: BRICK,
            fontWeight: 700,
            fontFamily: `'Noto Sans Devanagari', sans-serif`,
          }}
        >
          साझा काम
        </div>
      </div>

      <div
        style={{
          opacity: taglineOp,
          fontSize: 20,
          color: '#4A5568',
          marginBottom: 32,
          lineHeight: 1.5,
          fontWeight: 500,
        }}
      >
        <span style={{ color: BRICK, fontWeight: 700 }}>"Shared work."</span> Local talent. Global projects. Clear terms.
      </div>

      {/* ── Two role cards ── */}
      <div style={{ display: 'flex', gap: 24, alignItems: 'stretch', marginBottom: 24 }}>
        {/* Talent card */}
        <div
          style={{
            ...card(false),
            flex: 1,
            opacity: card1Op,
            transform: `translateY(${card1Y}px)`,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: SAGE, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              NEPALI TALENT
            </div>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(58,99,81,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UserIcon size={18} color={SAGE} />
            </div>
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: INK, marginBottom: 8 }}>
            One relevant work sample
          </div>
          <div style={{ fontSize: 15, color: '#4B5563', lineHeight: 1.6 }}>
            Show what you can actually deliver — not just a lengthy CV. The first result proves competence.
          </div>
        </div>

        {/* Connector arrow */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            minWidth: 48,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: WHITE,
              border: `1.5px solid ${LINE}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            }}
          >
            <HandshakeIcon size={22} color={BRICK} />
          </div>
        </div>

        {/* Client card */}
        <div
          style={{
            ...card(true),
            flex: 1,
            opacity: card2Op,
            transform: `translateY(${card2Y}px)`,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: BRICK, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              GLOBAL CLIENT
            </div>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(184,74,43,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BriefcaseIcon size={18} color={BRICK} />
            </div>
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: INK, marginBottom: 8 }}>
            One clearly priced project
          </div>
          <div style={{ fontSize: 15, color: '#4B5563', lineHeight: 1.6 }}>
            Fixed scope, transparent pricing, pre-set deadline. Zero friction, significantly reduced hiring risk.
          </div>
        </div>
      </div>

      {/* ── Result tag ── */}
      <div
        style={{
          opacity: resultOp,
          transform: `scale(${resultScale})`,
          textAlign: 'center',
          display: 'flex',
          justifyContent: 'center',
          marginTop: 'auto',
          marginBottom: 16,
        }}
      >
        <div
          style={{
            background: MUSTARD,
            borderRadius: 30,
            padding: '10px 32px',
            fontSize: 15,
            fontWeight: 800,
            color: INK,
            letterSpacing: '0.04em',
            boxShadow: '0 4px 14px rgba(212, 151, 38, 0.25)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <TargetIcon size={18} color={INK} strokeWidth={2.5} />
          <span>A FIRST PAID RESULT · PROVEN TRUST</span>
        </div>
      </div>

      <StageFrame />
    </div>
  );
};


