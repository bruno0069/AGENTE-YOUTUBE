import React from "react";
import { Easing, interpolate, random, useCurrentFrame } from "remotion";
import { CENTRO_X, LINHA_DAGUA, Navio } from "./Navio";

const LARGURA = 1080;
const ALTURA = 1920;
const LEITO = 1120;

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

const NEVE_MARINHA = new Array(80).fill(true).map((_, i) => ({
  x: random(`neve-x-${i}`) * LARGURA,
  y: random(`neve-y-${i}`) * ALTURA,
  r: 1 + random(`neve-r-${i}`) * 2.5,
  velocidade: 0.4 + random(`neve-v-${i}`) * 1.2,
}));

const DUNAS = (() => {
  let d = `M0,${ALTURA} L0,${LEITO}`;
  for (let x = 0; x <= LARGURA; x += 30) {
    const y = LEITO + Math.sin(x / 140) * 18 + Math.sin(x / 57 + 1) * 7;
    d += ` L${x},${y.toFixed(1)}`;
  }
  return `${d} L${LARGURA},${ALTURA} Z`;
})();

// O frame aqui é relativo ao início da cena (via <Sequence>)
export const FundoDoMar: React.FC = () => {
  const frame = useCurrentFrame();

  const descida = interpolate(frame, [0, 75], [700, 0], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const raios = interpolate(frame, [0, 70], [0.35, 0.08], clamp);

  return (
    <svg
      viewBox={`0 0 ${LARGURA} ${ALTURA}`}
      style={{ position: "absolute", inset: 0 }}
    >
      <defs>
        <linearGradient id="abismo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0b3a5a" />
          <stop offset="55%" stopColor="#041726" />
          <stop offset="100%" stopColor="#01060d" />
        </linearGradient>
        <linearGradient id="raio" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bfe6ff" stopOpacity={1} />
          <stop offset="100%" stopColor="#bfe6ff" stopOpacity={0} />
        </linearGradient>
        <linearGradient id="areia" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b3a33" />
          <stop offset="100%" stopColor="#0d0d0b" />
        </linearGradient>
        <radialGradient id="lanterna">
          <stop offset="0%" stopColor="#9fd8ff" stopOpacity={0.35} />
          <stop offset="100%" stopColor="#9fd8ff" stopOpacity={0} />
        </radialGradient>
      </defs>

      <rect width={LARGURA} height={ALTURA} fill="url(#abismo)" />

      {[120, 380, 640, 900].map((x, i) => (
        <polygon
          key={x}
          points={`${x - 40},0 ${x + 40},0 ${x + 220 + Math.sin(frame / 25 + i) * 40},${ALTURA * 0.7} ${x + 60 + Math.sin(frame / 25 + i) * 40},${ALTURA * 0.7}`}
          fill="url(#raio)"
          opacity={raios}
        />
      ))}

      <g transform={`translate(0, ${descida})`}>
        <ellipse
          cx={600}
          cy={LEITO - 60}
          rx={520}
          ry={260}
          fill="url(#lanterna)"
        />
        <g
          transform={`translate(560, ${LEITO + 5}) rotate(-4) scale(0.95) translate(${-CENTRO_X}, ${-LINHA_DAGUA})`}
        >
          <Navio luzes={0} fumaca={0} destrocos />
        </g>
        <path d={DUNAS} fill="url(#areia)" />
      </g>

      {NEVE_MARINHA.map((p, i) => (
        <circle
          key={i}
          cx={p.x + Math.sin(frame / 20 + i) * 6}
          cy={
            (p.y + frame * p.velocidade - descida * 0.6 + ALTURA * 2) % ALTURA
          }
          r={p.r}
          fill="#d9eefa"
          opacity={0.35}
        />
      ))}
    </svg>
  );
};
