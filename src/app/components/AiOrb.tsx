import React from 'react';

interface AiOrbProps {
  size?: number;
  thinking?: boolean;
  style?: React.CSSProperties;
}

// Matches reference: bright cornflower blue center → blue-purple → soft lavender edge
// with a warm glow outer shadow
export function AiOrb({ size = 48, thinking = false, style }: AiOrbProps) {
  const glow = Math.round(size * 0.55);
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: [
        'radial-gradient(',
        'circle at 42% 36%,',
        '#BED4FF 0%,',    // bright highlight
        '#6B96F5 22%,',   // electric blue
        '#5272EC 44%,',   // core blue
        '#7060E8 66%,',   // blue-purple
        '#9575E0 85%,',   // soft purple
        '#B49AE8 100%',   // lavender edge
        ')',
      ].join(''),
      boxShadow: [
        `0 ${Math.round(size * 0.1)}px ${glow}px rgba(91,120,239,.45)`,
        `0 0 ${Math.round(glow * 1.6)}px rgba(149,117,224,.25)`,
        `inset 0 1px 2px rgba(255,255,255,.4)`,
      ].join(', '),
      animation: thinking ? 'orb-spin 1.8s linear infinite' : 'orb-idle 3.5s ease-in-out infinite',
      flexShrink: 0,
      ...style,
    }} />
  );
}
