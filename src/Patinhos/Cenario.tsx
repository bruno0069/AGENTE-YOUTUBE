import React from "react";
import { random, useCurrentFrame } from "remotion";

export const LARGURA = 1080;
export const ALTURA = 1920;
export const LAGOA = { x: 540, y: 1250, rx: 520, ry: 330 };

const FLORES = new Array(14).fill(true).map((_, i) => ({
  x: 40 + random(`flor-x-${i}`) * 1000,
  y: 1620 + random(`flor-y-${i}`) * 260,
  cor: ["#ff6b8b", "#ffffff", "#ffb703", "#c77dff"][i % 4],
  fase: random(`flor-f-${i}`) * 6,
}));

const NUVENS = [
  { y: 330, x: 120, s: 1.1, v: 0.5 },
  { y: 560, x: 700, s: 0.8, v: 0.35 },
  { y: 180, x: 520, s: 0.7, v: 0.6 },
];

export const Cenario: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <svg
      viewBox={`0 0 ${LARGURA} ${ALTURA}`}
      style={{ position: "absolute", inset: 0 }}
    >
      <defs>
        <linearGradient id="ceu-p" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#59c2ff" />
          <stop offset="100%" stopColor="#d6f3ff" />
        </linearGradient>
        <linearGradient id="lagoa-p" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#52c7f0" />
          <stop offset="100%" stopColor="#1f93d1" />
        </linearGradient>
      </defs>

      <rect width={LARGURA} height={ALTURA} fill="url(#ceu-p)" />

      {/* sol com raios girando */}
      <g transform="translate(880, 250)">
        <g transform={`rotate(${frame * 0.6})`}>
          {new Array(12).fill(true).map((_, i) => (
            <rect
              key={i}
              x={-8}
              y={-165}
              width={16}
              height={50}
              rx={8}
              fill="#FFC93C"
              transform={`rotate(${i * 30})`}
            />
          ))}
        </g>
        <circle r={95} fill="#FFD93B" />
        <circle cx={-28} cy={-10} r={9} fill="#7a4b00" />
        <circle cx={28} cy={-10} r={9} fill="#7a4b00" />
        <path
          d="M-32,25 Q0,55 32,25"
          stroke="#7a4b00"
          strokeWidth={8}
          fill="none"
          strokeLinecap="round"
        />
      </g>

      {/* nuvens */}
      {NUVENS.map((n, i) => {
        const x = ((n.x + frame * n.v + 300) % (LARGURA + 600)) - 300;
        return (
          <g
            key={i}
            transform={`translate(${x}, ${n.y}) scale(${n.s})`}
            fill="#fff"
          >
            <ellipse cx={0} cy={0} rx={110} ry={42} />
            <circle cx={-40} cy={-30} r={48} />
            <circle cx={30} cy={-44} r={58} />
          </g>
        );
      })}

      {/* colinas */}
      <path
        d="M0,980 Q270,820 540,940 T1080,900 L1080,1920 L0,1920 Z"
        fill="#7ed957"
      />
      <path
        d="M0,1100 Q300,980 620,1080 T1080,1040 L1080,1920 L0,1920 Z"
        fill="#5fc441"
      />

      {/* lagoa */}
      <ellipse
        cx={LAGOA.x}
        cy={LAGOA.y + 14}
        rx={LAGOA.rx + 14}
        ry={LAGOA.ry + 14}
        fill="#2f8f3a"
      />
      <ellipse
        cx={LAGOA.x}
        cy={LAGOA.y}
        rx={LAGOA.rx}
        ry={LAGOA.ry}
        fill="url(#lagoa-p)"
      />
      {new Array(6).fill(true).map((_, i) => (
        <path
          key={i}
          d="M-60,0 Q-30,-12 0,0 T60,0"
          stroke="#fff"
          strokeWidth={5}
          strokeLinecap="round"
          fill="none"
          opacity={0.45}
          transform={`translate(${LAGOA.x - 330 + i * 130 + Math.sin(frame / 15 + i) * 14}, ${LAGOA.y - 190 + (i % 3) * 190 + 40})`}
        />
      ))}

      {/* flores */}
      {FLORES.map((f, i) => (
        <g
          key={i}
          transform={`translate(${f.x}, ${f.y}) rotate(${Math.sin(frame / 20 + f.fase) * 6})`}
        >
          <line x1={0} y1={0} x2={0} y2={46} stroke="#2f8f3a" strokeWidth={6} />
          {new Array(5).fill(true).map((_, p) => (
            <circle
              key={p}
              cx={Math.cos((p / 5) * Math.PI * 2) * 17}
              cy={Math.sin((p / 5) * Math.PI * 2) * 17}
              r={13}
              fill={f.cor}
            />
          ))}
          <circle r={9} fill="#ffd93b" />
        </g>
      ))}
    </svg>
  );
};
