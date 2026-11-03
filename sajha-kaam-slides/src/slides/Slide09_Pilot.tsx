import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { INK, BRICK, SAGE, CLAY, LINE, WHITE, MUSTARD, TEAL,
         slideContainer, card, sectionLabel, crayonUnderline, smoothEase } from '../styles';
import { StageFrame } from '../StageFrame';
import { LaptopCodeIcon, BuildingIcon, DocumentCheckIcon, CheckCircleIcon } from '../components/Icons';

const PilotCard: React.FC<{
  IconComponent: React.FC<{ size?: number; color?: string }>;
  number: string; label: string; sub: string;
  accent?: boolean; delay: number; t: number;
}> = ({ IconComponent, number, label, sub, accent, delay, t }) => {
  const op = interpolate(t, [delay, delay + 0.5], [0, 1], { easing: smoothEase, extrapolateRight: 'clamp' });
  const y  = interpolate(t, [delay, delay + 0.5], [24, 0], { easing: smoothEase, extrapolateRight: 'clamp' });
  return (
    <div
      style={{
        ...card(!!accent),
        flex: 1,
        opacity: op,
        transform: `translateY(${y}px)`,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: accent ? 'rgba(184,74,43,0.12)' : 'rgba(58,99,81,0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <IconComponent size={22} color={accent ? BRICK : SAGE} />
        </div>
        <span style={{ fontSize: 36, fontWeight: 800, color: accent ? BRICK : INK, letterSpacing: '-0.02em' }}>
          {number}
        </span>
      </div>
      <div style={{ fontSize: 18, fontWeight: 700, color: INK, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 13, color: '#4B5563', lineHeight: 1.5, marginTop: 'auto' }}>{sub}</div>
    </div>
  );
};

export const Slide09: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const titleOp  = interpolate(t, [0, 0.5], [0, 1], { easing: smoothEase, extrapolateRight: 'clamp' });
  const titleY   = interpolate(t, [0, 0.5], [20, 0], { easing: smoothEase, extrapolateRight: 'clamp' });
  const metricOp = interpolate(t, [1.0, 1.5], [0, 1], { easing: smoothEase, extrapolateRight: 'clamp' });

  return (
    <div style={{ ...slideContainer }}>
      {/* ── Section label ── */}
      <div style={{ ...sectionLabel }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: BRICK }} />
        Four-Week Pilot Proposal
      </div>
      <div style={{ ...crayonUnderline, width: 160 }} />

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
          letterSpacing: '-0.02em',
        }}
      >
        A four-week pilot to validate the closed loop.
      </div>

      {/* ── Pilot cards ── */}
      <div style={{ display: 'flex', gap: 20, flex: 1, marginBottom: 20 }}>
        <PilotCard
          IconComponent={LaptopCodeIcon}
          number="20"
          label="Vetted Workers"
          sub="Trained in targeted task categories through university partnerships and local hubs."
          delay={0.3}
          t={t}
        />
        <PilotCard
          IconComponent={BuildingIcon}
          number="5"
          label="Committed Buyers"
          sub="Diaspora-led SMEs with verified projects, budget allocation, and clear task scopes."
          accent
          delay={0.5}
          t={t}
        />
        <PilotCard
          IconComponent={DocumentCheckIcon}
          number="10"
          label="Paid Projects"
          sub="Bounded small contracts with clear milestones to test payout and satisfaction."
          delay={0.7}
          t={t}
        />
      </div>

      {/* ── Metrics strip ── */}
      <div style={{ opacity: metricOp }}>
        <div
          style={{
            background: WHITE,
            border: `1px solid ${LINE}`,
            borderRadius: 14,
            padding: '14px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
          }}
        >
          {[
            'Measure completed work quality',
            'Track repeat buyer intent',
            'Median shortlist < 7 days',
            '100% upfront price clarity',
          ].map((m) => (
            <div key={m} style={{ fontSize: 13, color: SAGE, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
              <CheckCircleIcon size={14} color={SAGE} strokeWidth={2.5} />
              <span>{m}</span>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 11, color: '#718096', marginTop: 8, textAlign: 'center', fontStyle: 'italic' }}>
          * Proposed pilot benchmarks for validation phase, not historical or past financial performance.
        </div>
      </div>

      <StageFrame />
    </div>
  );
};


