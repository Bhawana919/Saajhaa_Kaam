import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { INK, BRICK, SAGE, CLAY, LINE, WHITE, MUSTARD, TEAL,
         slideContainer, card, sectionLabel, crayonUnderline, smoothEase } from '../styles';
import { StageFrame } from '../StageFrame';
import { SearchIcon, LockIcon, DownloadIcon, LinkIcon, BadgeCheckIcon } from '../components/Icons';

const PassportPhone: React.FC<{ op: number; y: number }> = ({ op, y }) => (
  <div
    style={{
      opacity: op,
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
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, paddingBottom: 10, borderBottom: `1px solid ${LINE}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 15, fontWeight: 800, color: INK }}>Sajha</span>
        <span style={{ fontSize: 15, fontWeight: 800, color: BRICK }}>Passport</span>
      </div>
      <span style={{ fontSize: 11, fontWeight: 700, color: SAGE, background: 'rgba(58,99,81,0.1)', padding: '2px 8px', borderRadius: 10 }}>
        PORTABLE ID
      </span>
    </div>

    <div style={{ fontSize: 13, fontWeight: 700, color: INK, marginBottom: 10 }}>
      Verified Work & Evidence Records
    </div>

    {[
      { label: 'Work sample · worker-uploaded', badge: 'PORTFOLIO' },
      { label: 'Completed project · client-verified', badge: 'COMPLETED' },
    ].map((item) => (
      <div
        key={item.label}
        style={{
          background: CLAY,
          borderRadius: 10,
          padding: '10px 12px',
          marginBottom: 8,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: 12, color: INK, fontWeight: 600 }}>{item.label}</span>
        <span style={{ fontSize: 9, fontWeight: 800, background: SAGE, color: WHITE, padding: '2px 6px', borderRadius: 4 }}>
          {item.badge}
        </span>
      </div>
    ))}

    {/* Share toggle switch */}
    <div
      style={{
        marginTop: 14,
        background: '#FAF6EE',
        border: `1px solid ${LINE}`,
        borderRadius: 12,
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <span style={{ fontSize: 13, color: INK, fontWeight: 700 }}>Public share link</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ width: 34, height: 20, background: SAGE, borderRadius: 12, position: 'relative' }}>
          <div style={{ width: 14, height: 14, background: WHITE, borderRadius: '50%', position: 'absolute', top: 3, right: 3 }} />
        </div>
        <span style={{ fontSize: 11, color: SAGE, fontWeight: 800 }}>LIVE</span>
      </div>
    </div>
    <div style={{ fontSize: 11, color: BRICK, marginTop: 8, fontWeight: 600, textAlign: 'center' }}>
      Worker can revoke access with 1 click anytime.
    </div>
  </div>
);

export const Slide07: React.FC = () => {
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
        Work Passport
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
          maxWidth: 780,
          letterSpacing: '-0.02em',
        }}
      >
        A Work Passport that workers own and control.
      </div>

      <div style={{ display: 'flex', gap: 36, flex: 1, alignItems: 'flex-start' }}>
        <PassportPhone op={phoneOp} y={phoneY} />

        <div
          style={{
            ...card(false),
            flex: 1,
            opacity: cardOp,
            transform: `translateY(${cardY}px)`,
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 700, color: INK, marginBottom: 16 }}>
            Portable, privacy-preserving credential:
          </div>

          {[
            { Icon: SearchIcon, label: 'Clear evidence origin timestamp and signed client validation' },
            { Icon: LockIcon, label: 'Private profile data and client details remain protected' },
            { Icon: DownloadIcon, label: 'Standard JSON & PDF export on demand' },
            { Icon: LinkIcon, label: 'Customizable revocable public URL for client portfolios' },
            { Icon: BadgeCheckIcon, label: 'Product credentials only — not a government national ID' },
          ].map((item) => (
            <div key={item.label} style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 14 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  background: 'rgba(58, 99, 81, 0.1)',
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <item.Icon size={18} color={SAGE} />
              </div>
              <span style={{ fontSize: 15, color: INK, fontWeight: 500 }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <StageFrame />
    </div>
  );
};


