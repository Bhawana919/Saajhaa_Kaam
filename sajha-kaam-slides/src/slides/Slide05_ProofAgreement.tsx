import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { INK, BRICK, SAGE, CLAY, LINE, WHITE, MUSTARD, TEAL,
         slideContainer, card, sectionLabel, crayonUnderline, smoothEase } from '../styles';
import { StageFrame } from '../StageFrame';
import { HandshakeIcon, DocumentCheckIcon, UserIcon, BriefcaseIcon } from '../components/Icons';

export const Slide05: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const titleOp = interpolate(t, [0, 0.5], [0, 1], { easing: smoothEase, extrapolateRight: 'clamp' });
  const titleY  = interpolate(t, [0, 0.5], [20, 0], { easing: smoothEase, extrapolateRight: 'clamp' });

  const c1Op = interpolate(t, [0.35, 0.9], [0, 1], { easing: smoothEase, extrapolateRight: 'clamp' });
  const c1Y  = interpolate(t, [0.35, 0.9], [24, 0], { easing: smoothEase, extrapolateRight: 'clamp' });

  const c2Op = interpolate(t, [0.65, 1.2], [0, 1], { easing: smoothEase, extrapolateRight: 'clamp' });
  const c2Y  = interpolate(t, [0.65, 1.2], [24, 0], { easing: smoothEase, extrapolateRight: 'clamp' });

  const flowOp = interpolate(t, [0.95, 1.5], [0, 1], { easing: smoothEase, extrapolateRight: 'clamp' });

  return (
    <div style={{ ...slideContainer }}>
      {/* ── Section label ── */}
      <div style={{ ...sectionLabel }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: BRICK }} />
        Proof and Agreement
      </div>
      <div style={{ ...crayonUnderline, width: 130 }} />

      {/* ── Title ── */}
      <div
        style={{
          opacity: titleOp,
          transform: `translateY(${titleY}px)`,
          fontSize: 44,
          fontWeight: 800,
          color: INK,
          marginBottom: 32,
          maxWidth: 800,
          lineHeight: 1.2,
          letterSpacing: '-0.02em',
        }}
      >
        Proof first. Both sides enter with mutual consent.
      </div>

      <div style={{ display: 'flex', gap: 28, flex: 1, alignItems: 'stretch' }}>
        {/* ── Worker card ── */}
        <div
          style={{
            ...card(false),
            flex: 1,
            opacity: c1Op,
            transform: `translateY(${c1Y}px)`,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: SAGE, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              WORKER APPLICATION
            </div>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(58,99,81,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UserIcon size={16} color={SAGE} />
            </div>
          </div>

          {[
            'One selected relevant proof sample',
            'Concise 280-character targeted pitch',
            'Explicit consent to share work proof',
            'Verified schedule & availability',
          ].map((item) => (
            <div key={item} style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 14 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: SAGE, flexShrink: 0 }} />
              <div style={{ fontSize: 16, color: INK, fontWeight: 500 }}>{item}</div>
            </div>
          ))}
        </div>

        {/* ── Flow connector ── */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            opacity: flowOp,
          }}
        >
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              background: MUSTARD,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(212, 151, 38, 0.3)',
            }}
          >
            <HandshakeIcon size={24} color={INK} />
          </div>
          <div style={{ fontSize: 12, color: '#4B5563', textAlign: 'center', fontWeight: 700 }}>
            Mutual Lock
          </div>
        </div>

        {/* ── Client card ── */}
        <div
          style={{
            ...card(true),
            flex: 1,
            opacity: c2Op,
            transform: `translateY(${c2Y}px)`,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: BRICK, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              CLIENT OFFER
            </div>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(184,74,43,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BriefcaseIcon size={16} color={BRICK} />
            </div>
          </div>

          {[
            'Evaluates actual sample deliverable',
            'Guaranteed fixed price and timeline',
            'One revision pre-agreed in contract',
            'Both parties electronically lock terms',
          ].map((item) => (
            <div key={item} style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 14 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: BRICK, flexShrink: 0 }} />
              <div style={{ fontSize: 16, color: INK, fontWeight: 500 }}>{item}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Note strip ── */}
      <div
        style={{
          opacity: flowOp,
          fontSize: 14,
          color: '#4B5563',
          marginTop: 20,
          background: WHITE,
          border: `1px solid ${LINE}`,
          borderRadius: 12,
          padding: '10px 20px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}
      >
        <span style={{ color: BRICK, fontWeight: 700 }}>No black-box AI filtering:</span>
        <span>Human review of source-verified samples and clear portfolio evidence.</span>
      </div>

      <StageFrame />
    </div>
  );
};


