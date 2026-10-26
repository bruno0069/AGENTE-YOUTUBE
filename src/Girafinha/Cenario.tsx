import React from "react";
import { random, useCurrentFrame } from "remotion";

export const LARGURA = 1080;
export const ALTURA = 1920;
export const CHAO = 1640;

const NUVENS = [
  { x: 80, y: 220, s: 0.9, v: 0.35 },
  { x: 620, y: 140, s: 0.7, v: 0.25 },
  { x: 900, y: 420, s: 0.6, v: 0.45 },
];

const FLORES = new Array(16).fill(true).map((_, i) => ({
  x: 30 + random(`gf-x-${i}`) * 1020,
  y: CHAO + 20 + random(`gf-y-${i}`) * 240,
  cor: ["#ff8fa3", "#ffffff", "#ffd166", "#b8a1ff"][i % 4],
  fase: random(`gf-f-${i}`) * 6,
}));

const CORES_ARCO = ["#E63946", "#FFC300", "#2BA84A", "#1E7FA6", "#8E44AD"];

export const Cenario: React.FC<{ readonly arcoIris: number }> = ({
  arcoIris,
}) => {
  const frame = useCurrentFrame();

  return (
    <svg
      viewBox={`0 0 ${LARGURA} ${ALTURA}`}
      style={{ position: "absolute", inset: 0 }}
    >
      <defs>
        <linearGradient id="ceu-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bfe3ea" />
          <stop offset="100%" stopColor="#eef8f3" />
        </linearGradient>
      </defs>
      <rect width={LARGURA} height={ALTURA} fill="url(#ceu-g)" />

      {NUVENS.map((n, i) => {
        const x = ((n.x + frame * n.v + 300) % (LARGURA + 600)) - 300;
        return (
          <g
            key={i}
            transform={`translate(${x}, ${n.y}) scale(${n.s})`}
            fill="#fff"
          >
            <ellipse rx={120} ry={44} />
            <circle cx={-44} cy={-30} r={50} />
            <circle cx={34} cy={-48} r={62} />
          </g>
        );
      })}

      {/* arco-íris final */}
      {arcoIris > 0 ? (
        <g opacity={Math.min(1, arcoIris * 1.5)}>
          {CORES_ARCO.map((cor, i) => {
            const r = 560 - i * 44;
            const comp = Math.PI * r;
            return (
              <path
                key={cor}
                d={`M${540 - r},${CHAO - 300} A${r},${r} 0 0 1 ${540 + r},${CHAO - 300}`}
                stroke={cor}
                strokeWidth={46}
                fill="none"
                strokeDasharray={comp}
                strokeDashoffset={comp * (1 - arcoIris)}
              />
            );
          })}
        </g>
      ) : null}

      {/* colinas da savana */}
      <path
        d="M0,1380 Q260,1250 560,1360 T1080,1330 L1080,1920 L0,1920 Z"
        fill="#b9e08f"
      />
      {/* acácia ao fundo */}
      <g transform="translate(110, 1290)">
        <rect x={-10} y={-120} width={20} height={130} fill="#8a5a2b" />
        <ellipse cy={-140} rx={120} ry={38} fill="#7cc36a" />
        <ellipse cx={-50} cy={-160} rx={60} ry={24} fill="#8fd17b" />
      </g>
      <path
        d={`M0,${CHAO - 60} Q300,${CHAO - 120} 620,${CHAO - 50} T1080,${CHAO - 70} L1080,1920 L0,1920 Z`}
        fill="#93cf6e"
      />

      {FLORES.map((f, i) => (
        <g
          key={i}
          transform={`translate(${f.x}, ${f.y}) rotate(${Math.sin(frame / 20 + f.fase) * 6})`}
        >
          <line x1={0} y1={0} x2={0} y2={40} stroke="#4f9a3a" strokeWidth={5} />
          {new Array(5).fill(true).map((_, p) => (
            <circle
              key={p}
              cx={Math.cos((p / 5) * Math.PI * 2) * 14}
              cy={Math.sin((p / 5) * Math.PI * 2) * 14}
              r={11}
              fill={f.cor}
            />
          ))}
          <circle r={7} fill="#ffc300" />
        </g>
      ))}
    </svg>
  );
};
