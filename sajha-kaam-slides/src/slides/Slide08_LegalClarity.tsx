import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { INK, BRICK, SAGE, CLAY, LINE, WHITE, MUSTARD, TEAL,
         slideContainer, card, sectionLabel, crayonUnderline, smoothEase } from '../styles';
import { StageFrame } from '../StageFrame';
import { BuildingIcon, HandshakeIcon, ShieldCheckIcon, ShieldAlertIcon } from '../components/Icons';

export const Slide08: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const titleOp = interpolate(t, [0, 0.5], [0, 1], { easing: smoothEase, extrapolateRight: 'clamp' });
  const titleY  = interpolate(t, [0, 0.5], [20, 0], { easing: smoothEase, extrapolateRight: 'clamp' });

  const c1Op = interpolate(t, [0.35, 0.85], [0, 1], { easing: smoothEase, extrapolateRight: 'clamp' });
  const c1Y  = interpolate(t, [0.35, 0.85], [24, 0], { easing: smoothEase, extrapolateRight: 'clamp' });

  const c2Op = interpolate(t, [0.55, 1.05], [0, 1], { easing: smoothEase, extrapolateRight: 'clamp' });
  const c2Y  = interpolate(t, [0.55, 1.05], [24, 0], { easing: smoothEase, extrapolateRight: 'clamp' });

  const c3Op = interpolate(t, [0.75, 1.25], [0, 1], { easing: smoothEase, extrapolateRight: 'clamp' });
  const c3Y  = interpolate(t, [0.75, 1.25], [24, 0], { easing: smoothEase, extrapolateRight: 'clamp' });

  const crossOp = interpolate(t, [1.05, 1.55], [0, 1], { easing: smoothEase, extrapolateRight: 'clamp' });

  return (
    <div style={{ ...slideContainer }}>
      {/* ── Section label ── */}
      <div style={{ ...sectionLabel }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: BRICK }} />
        Legal & Regulatory Clarity
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
          letterSpacing: '-0.02em',
        }}
      >
        Keep the useful idea. Respect real law.
      </div>

      {/* ── 3-column flow ── */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'stretch', flex: 1, marginBottom: 16 }}>
        {/* Col 1 */}
        <div
          style={{
            ...card(false),
            flex: 1,
            opacity: c1Op,
            transform: `translateY(${c1Y}px)`,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: SAGE, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              1. LOCAL SKILLS HUB
            </div>
            <div style={{ width: 26, height: 26, borderRadius: 6, background: 'rgba(58,99,81,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BuildingIcon size={14} color={SAGE} />
            </div>
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: INK, marginBottom: 6 }}>
            Train & Onboard
          </div>
          <div style={{ fontSize: 14, color: '#4B5563', lineHeight: 1.5 }}>
            Universities or municipal programs recruit talent, mentor youth, and provide shared access.
          </div>
        </div>

        {/* Arrow */}
        <div style={{ display: 'flex', alignItems: 'center', opacity: c2Op, color: BRICK, fontSize: 20 }}>
          →
        </div>

        {/* Col 2 */}
        <div
          style={{
            ...card(true),
            flex: 1,
            opacity: c2Op,
            transform: `translateY(${c2Y}px)`,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: BRICK, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              2. SAJHA KAAM
            </div>
            <div style={{ width: 26, height: 26, borderRadius: 6, background: 'rgba(184,74,43,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <HandshakeIcon size={14} color={BRICK} />
            </div>
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: INK, marginBottom: 6 }}>
            Clear Agreement
          </div>
          <div style={{ fontSize: 14, color: '#4B5563', lineHeight: 1.5 }}>
            Auditable record, verified proof tracking, and legally compliant contract templates.
          </div>
        </div>

        {/* Arrow */}
        <div style={{ display: 'flex', alignItems: 'center', opacity: c3Op, color: BRICK, fontSize: 20 }}>
          →
        </div>

        {/* Col 3 */}
        <div
          style={{
            ...card(false),
            flex: 1,
            opacity: c3Op,
            transform: `translateY(${c3Y}px)`,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: SAGE, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              3. LICENSED PARTNER
            </div>
            <div style={{ width: 26, height: 26, borderRadius: 6, background: 'rgba(58,99,81,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheckIcon size={14} color={SAGE} />
            </div>
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: INK, marginBottom: 6 }}>
            Settlement & Compliance
          </div>
          <div style={{ fontSize: 14, color: '#4B5563', lineHeight: 1.5 }}>
            Licensed commercial banks and payment partners handle foreign exchange and cross-border disbursements.
          </div>
        </div>
      </div>

      {/* ── Crossed-out "bad idea" strip ── */}
      <div
        style={{
          opacity: crossOp,
          background: '#FAF6EE',
          border: `1.5px dashed rgba(184, 74, 43, 0.4)`,
          borderRadius: 12,
          padding: '12px 20px',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <ShieldAlertIcon size={18} color={BRICK} />
        <div style={{ fontSize: 14, color: '#6B7280', textDecoration: 'line-through', fontWeight: 500 }}>
          "Unregulated digital charter zone · fake micronation sovereignty · non-compliant cryptocurrency rails"
        </div>
      </div>

      <StageFrame />
    </div>
  );
};


