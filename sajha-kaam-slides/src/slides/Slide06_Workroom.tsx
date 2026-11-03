import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { INK, BRICK, SAGE, CLAY, LINE, WHITE, MUSTARD, CORAL, TEAL,
         slideContainer, card, sectionLabel, crayonUnderline, smoothEase } from '../styles';
import { StageFrame } from '../StageFrame';
import { ShieldCheckIcon, DollarIcon, ShieldAlertIcon, CheckCircleIcon } from '../components/Icons';

const TimelineItem: React.FC<{
  label: string; sub?: string; accent?: boolean; delay: number; t: number; index: number;
}> = ({ label, sub, accent, delay, t, index }) => {
  const op = interpolate(t, [delay, delay + 0.45], [0, 1], { easing: smoothEase, extrapolateRight: 'clamp' });
  const x  = interpolate(t, [delay, delay + 0.45], [-16, 0], { easing: smoothEase, extrapolateRight: 'clamp' });
  return (
    <div
      style={{
        display: 'flex',
        gap: 14,
        alignItems: 'flex-start',
        marginBottom: 14,
        opacity: op,
        transform: `translateX(${x}px)`,
      }}
    >
      <div
        style={{
          width: 24,
          height: 24,
          borderRadius: '50%',
          background: accent ? BRICK : SAGE,
          color: WHITE,
          fontSize: 11,
          fontWeight: 800,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 2,
          flexShrink: 0,
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        }}
      >
        {index + 1}
      </div>
      <div>
        <div style={{ fontSize: 16, fontWeight: 700, color: INK }}>{label}</div>
        {sub && <div style={{ fontSize: 13, color: '#6B7280', marginTop: 1, lineHeight: 1.4 }}>{sub}</div>}
      </div>
    </div>
  );
};

export const Slide06: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const titleOp = interpolate(t, [0, 0.5], [0, 1], { easing: smoothEase, extrapolateRight: 'clamp' });
  const titleY  = interpolate(t, [0, 0.5], [20, 0], { easing: smoothEase, extrapolateRight: 'clamp' });

  const timelineOp = interpolate(t, [0.3, 0.8], [0, 1], { easing: smoothEase, extrapolateRight: 'clamp' });
  const timelineY  = interpolate(t, [0.3, 0.8], [24, 0], { easing: smoothEase, extrapolateRight: 'clamp' });

  const rightOp = interpolate(t, [0.55, 1.05], [0, 1], { easing: smoothEase, extrapolateRight: 'clamp' });
  const rightY  = interpolate(t, [0.55, 1.05], [24, 0], { easing: smoothEase, extrapolateRight: 'clamp' });

  return (
    <div style={{ ...slideContainer }}>
      {/* ── Section label ── */}
      <div style={{ ...sectionLabel }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: BRICK }} />
        The Workroom
      </div>
      <div style={{ ...crayonUnderline, width: 100 }} />

      {/* ── Title ── */}
      <div
        style={{
          opacity: titleOp,
          transform: `translateY(${titleY}px)`,
          fontSize: 44,
          fontWeight: 800,
          color: INK,
          marginBottom: 32,
          letterSpacing: '-0.02em',
        }}
      >
        One shared, accountable workroom.
      </div>

      <div style={{ display: 'flex', gap: 28, flex: 1, alignItems: 'stretch' }}>
        {/* ── Timeline card ── */}
        <div
          style={{
            ...card(false),
            flex: 1.2,
            opacity: timelineOp,
            transform: `translateY(${timelineY}px)`,
            position: 'relative',
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 800, color: SAGE, marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Structured Project Lifecycle
          </div>

          <TimelineItem index={0} label="Offer Accepted" sub="Both parties confirmed fixed scope & delivery date" delay={0.3} t={t} />
          <TimelineItem index={1} label="Work Submitted" sub="Deliverable & verifiable proof uploaded" delay={0.5} t={t} />
          <TimelineItem index={2} label="Feedback & Revision" sub="One structured, bounded feedback loop" delay={0.7} t={t} accent />
          <TimelineItem index={3} label="Client Acceptance" sub="Milestone verified and signed off" delay={0.9} t={t} />
          <TimelineItem index={4} label="Human Help & Appeal" sub="Escalation route open for any disagreement" delay={1.1} t={t} accent />
        </div>

        {/* ── Right column ── */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
            flex: 1,
            opacity: rightOp,
            transform: `translateY(${rightY}px)`,
          }}
        >
          {/* Payment card */}
          <div style={{ ...card(true) }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: INK, display: 'flex', alignItems: 'center', gap: 6 }}>
                <DollarIcon size={16} color={BRICK} />
                <span>Payment Handling</span>
              </div>
              <span
                style={{
                  background: MUSTARD,
                  color: INK,
                  fontSize: 11,
                  fontWeight: 800,
                  padding: '3px 10px',
                  borderRadius: 20,
                  letterSpacing: '0.04em',
                }}
              >
                PROTOTYPE SIMULATION
              </span>
            </div>
            <div style={{ fontSize: 15, color: '#374151', lineHeight: 1.5 }}>
              Awaiting licensed banking integration. Clear milestone escrow model.
            </div>
            <div style={{ fontSize: 12, color: BRICK, marginTop: 8, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
              <ShieldAlertIcon size={14} color={BRICK} />
              <span>No custodial digital wallet operated in this MVP.</span>
            </div>
          </div>

          {/* Help card */}
          <div style={{ ...card(false) }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: INK, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 26, height: 26, borderRadius: 6, background: 'rgba(58,99,81,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheckIcon size={16} color={SAGE} />
              </div>
              <span>Human Dispute Resolution</span>
            </div>
            <div style={{ fontSize: 14, color: '#4B5563', lineHeight: 1.6 }}>
              Either party can request human moderation. Structured checklist, timestamps, and verifiable evidence trail.
            </div>
          </div>
        </div>
      </div>

      <StageFrame />
    </div>
  );
};


