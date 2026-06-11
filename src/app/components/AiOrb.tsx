import React from 'react';

interface AiOrbProps {
  size?: number;
  thinking?: boolean;
  style?: React.CSSProperties;
}

export function AiOrb({ size = 48, thinking = false, style }: AiOrbProps) {
  const ringInset = Math.max(2, size * 0.08);
  const coreInset = Math.max(5, size * 0.18);
  const blur = Math.max(8, Math.round(size * 0.22));

  return (
    <div
      style={{
        width: size,
        height: size,
        position: 'relative',
        borderRadius: '50%',
        flexShrink: 0,
        ...style,
      }}
    >
      {/* Soft ambient glow */}
      <div
        style={{
          position: 'absolute',
          inset: -size * 0.18,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(236,194,255,0.18) 0%, rgba(186,208,255,0.14) 36%, rgba(173,232,255,0.08) 52%, rgba(255,255,255,0) 74%)',
          filter: `blur(${blur}px)`,
          opacity: thinking ? 0.95 : 0.8,
          transform: thinking ? 'scale(1.04)' : 'scale(1)',
          transition: 'all 220ms ease',
          pointerEvents: 'none',
        }}
      />

      {/* Outer glass ring */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background:
            'linear-gradient(145deg, rgba(255,255,255,0.98) 0%, rgba(243,238,255,0.96) 34%, rgba(235,243,255,0.98) 68%, rgba(255,249,252,0.96) 100%)',
          border: '1px solid rgba(203,210,255,0.72)',
          boxShadow: `
            inset 0 1px 1px rgba(255,255,255,0.92),
            0 8px 18px rgba(166, 176, 255, 0.14),
            0 2px 5px rgba(255,255,255,0.75)
          `,
        }}
      />

      {/* Colored ring accent */}
      <div
        style={{
          position: 'absolute',
          inset: ringInset,
          borderRadius: '50%',
          border: '1.5px solid rgba(182, 171, 255, 0.42)',
          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.45)',
          opacity: 0.95,
        }}
      />

      {/* Inner orb */}
      <div
        style={{
          position: 'absolute',
          inset: coreInset,
          borderRadius: '50%',
          background: `
            radial-gradient(circle at 68% 32%, rgba(244,146,255,0.82) 0%, rgba(244,146,255,0.18) 22%, rgba(244,146,255,0) 44%),
            radial-gradient(circle at 34% 72%, rgba(117,144,255,0.88) 0%, rgba(117,144,255,0.2) 26%, rgba(117,144,255,0) 48%),
            radial-gradient(circle at 72% 68%, rgba(173,234,255,0.34) 0%, rgba(173,234,255,0.10) 18%, rgba(173,234,255,0) 40%),
            radial-gradient(circle at 50% 38%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.18) 24%, rgba(255,255,255,0) 52%),
            linear-gradient(150deg, rgba(248,244,255,0.95) 0%, rgba(239,236,255,0.92) 44%, rgba(235,242,255,0.96) 100%)
          `,
          boxShadow: `
            inset 0 1px 0 rgba(255,255,255,0.72),
            inset 0 -6px 10px rgba(154, 165, 255, 0.14)
          `,
        }}
      />

      {/* Highlight */}
      <div
        style={{
          position: 'absolute',
          left: '22%',
          top: '18%',
          width: '34%',
          height: '16%',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.72)',
          filter: `blur(${Math.max(3, Math.round(size * 0.04))}px)`,
          transform: 'rotate(-18deg)',
          pointerEvents: 'none',
        }}
      />

      {/* Small arc for identity */}
      <div
        style={{
          position: 'absolute',
          inset: size * 0.14,
          borderRadius: '50%',
          borderTop: '1.5px solid rgba(255,255,255,0.82)',
          borderLeft: '1.5px solid rgba(196,208,255,0.45)',
          borderRight: '1.5px solid transparent',
          borderBottom: '1.5px solid transparent',
          transform: 'rotate(-30deg)',
          opacity: 0.9,
          pointerEvents: 'none',
        }}
      />

      {/* Thinking pulse */}
      {thinking && (
        <div
          style={{
            position: 'absolute',
            inset: -size * 0.08,
            borderRadius: '50%',
            border: '1px solid rgba(196, 182, 255, 0.24)',
            opacity: 0.7,
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
}