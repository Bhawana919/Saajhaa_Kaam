import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { INK, BRICK, SAGE, CLAY, LINE, WHITE, MUSTARD, CORAL, TEAL,
         slideContainer, card, sectionLabel, crayonUnderline, smoothEase } from '../styles';
import { StageFrame } from '../StageFrame';
import { DocumentCheckIcon, CalendarIcon, DollarIcon, RevisionIcon, ClockIcon } from '../components/Icons';

const PhoneFrame: React.FC<{ opacity: number; y: number }> = ({ opacity, y }) => (
  <div
    style={{
      opacity,
      transform: `translateY(${y}px)`,
      width: 320,
      background: WHITE,
      border: `2px solid rgba(30, 35, 42, 0.15)`,
      borderRadius: 24,
      padding: '20px 18px',
      flexShrink: 0,
      boxShadow: '0 16px 36px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.03)',
    }}
  >
    {/* Phone top bar */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingBottom: 10, borderBottom: `1px solid ${LINE}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 15, fontWeight: 800, color: INK }}>Sajha</span>
        <span style={{ fontSize: 15, fontWeight: 800, color: BRICK }}>Kaam</span>
      </div>
      <span style={{ fontSize: 11, fontWeight: 700, color: SAGE, background: 'rgba(58,99,81,0.1)', padding: '2px 8px', borderRadius: 10 }}>
        VERIFIED TASK
      </span>
    </div>

    {/* Task card inside phone */}
    <div
      style={{
        background: CLAY,
        border: `1.5px solid rgba(184, 74, 43, 0.2)`,
        borderRadius: 14,
        padding: '16px',
        marginBottom: 12,
      }}
    >
      <div style={{ fontSize: 15, fontWeight: 700, color: INK, marginBottom: 4 }}>
        12 product listings
      </div>
      <div style={{ fontSize: 24, fontWeight: 800, color: BRICK, marginBottom: 8 }}>
        $60 <span style={{ fontSize: 13, color: '#4B5563', fontWeight: 500 }}>· fixed sample</span>
      </div>
      <div style={{ display: 'flex', gap: 14, fontSize: 12, color: SAGE, fontWeight: 600, alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <ClockIcon size={14} color={SAGE} />
          <span>7 days</span>
        </div>
        <span>•</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <RevisionIcon size={14} color={SAGE} />
          <span>1 revision</span>
        </div>
      </div>
    </div>

    <div style={{ fontSize: 11, color: '#6B7280', lineHeight: 1.4, textAlign: 'center' }}>
      $60 is illustrative. All fees disclosed prior to worker application.
    </div>
  </div>
);

export const Slide04: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const titleOp = interpolate(t, [0, 0.5], [0, 1], { easing: smoothEase, extrapolateRight: 'clamp' });
  const titleY  = interpolate(t, [0, 0.5], [20, 0], { easing: smoothEase, extrapolateRight: 'clamp' });

  const phoneOp = interpolate(t, [0.35, 0.9], [0, 1], { easing: smoothEase, extrapolateRight: 'clamp' });
  const phoneY  = interpolate(t, [0.35, 0.9], [28, 0], { easing: smoothEase, extrapolateRight: 'clamp' });

  const cardOp = interpolate(t, [0.65, 1.2], [0, 1], { easing: smoothEase, extrapolateRight: 'clamp' });
  const cardY  = interpolate(t, [0.65, 1.2], [28, 0], { easing: smoothEase, extrapolateRight: 'clamp' });

  return (
    <div style={{ ...slideContainer }}>
      {/* ── Section label ── */}
      <div style={{ ...sectionLabel }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: BRICK }} />
        Clear Terms Before You Apply
      </div>
      <div style={{ ...crayonUnderline, width: 140 }} />

      {/* ── Title ── */}
      <div
        style={{
          opacity: titleOp,
          transform: `translateY(${titleY}px)`,
          fontSize: 44,
          fontWeight: 800,
          color: INK,
          marginBottom: 32,
          maxWidth: 780,
          lineHeight: 1.2,
          letterSpacing: '-0.02em',
        }}
      >
        Every task starts with clear, upfront terms.
      </div>

      {/* ── Content row ── */}
      <div style={{ display: 'flex', gap: 36, alignItems: 'flex-start', flex: 1 }}>
        <PhoneFrame opacity={phoneOp} y={phoneY} />

        {/* Info card */}
        <div
          style={{
            ...card(false),
            flex: 1,
            opacity: cardOp,
            transform: `translateY(${cardY}px)`,
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 700, color: INK, marginBottom: 16 }}>
            Before applying, talent sees exact terms:
          </div>

          {[
            { Icon: DocumentCheckIcon, label: 'Clear scope and required deliverables' },
            { Icon: CalendarIcon, label: 'Firm deadline and IP rights ownership' },
            { Icon: DollarIcon, label: 'Gross payment amount & zero hidden platform deductions' },
            { Icon: RevisionIcon, label: 'Pre-agreed revision limit (1 round standard)' },
          ].map((item) => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  background: 'rgba(184, 74, 43, 0.1)',
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <item.Icon size={18} color={BRICK} />
              </div>
              <div style={{ fontSize: 16, color: INK, fontWeight: 500 }}>{item.label}</div>
            </div>
          ))}

          <div style={{ borderTop: `1px solid ${LINE}`, paddingTop: 14, marginTop: 10, fontSize: 13, color: SAGE, fontWeight: 600 }}>
            ✓ Client identity verification source displayed · Transparent milestone rules
          </div>
        </div>
      </div>

      <StageFrame />
    </div>
  );
};


