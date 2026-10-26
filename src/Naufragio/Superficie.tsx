import React from "react";
import {
  Easing,
  interpolate,
  interpolateColors,
  random,
  useCurrentFrame,
} from "remotion";
import { CENTRO_X, LINHA_DAGUA, Navio } from "./Navio";
import { COLISAO, LUZES_APAGAM, SUBMERSO } from "./roteiro";

const LARGURA = 1080;
const ALTURA = 1920;
const HORIZONTE = 1060;
const AGUA = 1190;
const ESCALA_NAVIO = 0.9;

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

const onda = (
  base: number,
  amplitude: number,
  comprimento: number,
  fase: number,
) => {
  let d = `M0,${ALTURA} L0,${base}`;
  for (let x = 0; x <= LARGURA; x += 24) {
    const y =
      base + Math.sin((x / comprimento) * Math.PI * 2 + fase) * amplitude;
    d += ` L${x},${y.toFixed(1)}`;
  }
  return `${d} L${LARGURA},${ALTURA} Z`;
};

const ESTRELAS = new Array(110).fill(true).map((_, i) => ({
  x: random(`estrela-x-${i}`) * LARGURA,
  y: random(`estrela-y-${i}`) * (HORIZONTE - 80),
  r: 0.8 + random(`estrela-r-${i}`) * 2.4,
  fase: random(`estrela-f-${i}`) * Math.PI * 2,
}));

const ICEBERG =
  "-170,0 -140,-60 -110,-70 -80,-150 -40,-175 -10,-230 30,-200 60,-210 95,-120 130,-90 165,-30 190,0";
const ICEBERG_SOMBRA =
  "-10,-230 30,-200 60,-210 95,-120 130,-90 165,-30 190,0 40,0 10,-120";

export const Superficie: React.FC = () => {
  const frame = useCurrentFrame();

  // Do pôr do sol à noite sem lua de 14 de abril
  const noite = interpolate(frame, [60, 340], [0, 1], clamp);
  const cor = (dia: string, escuro: string) =>
    interpolateColors(noite, [0, 1], [dia, escuro]);

  const sol = interpolate(frame, [0, 220], [1000, 1160], clamp);
  const estrelas = interpolate(frame, [200, 340], [0, 1], clamp);

  const piscar =
    frame >= LUZES_APAGAM - 12 && frame < LUZES_APAGAM
      ? random(`piscar-${frame}`) > 0.5
        ? 1
        : 0.2
      : 1;
  const luzes =
    interpolate(frame, [150, 320], [0, 1], clamp) *
    (frame >= LUZES_APAGAM ? 0 : piscar);
  const fumaca = interpolate(frame, [COLISAO, 560], [1, 0], clamp);

  const navioX = interpolate(
    frame,
    [0, COLISAO, COLISAO + 50],
    [330, 560, 575],
    {
      ...clamp,
      easing: Easing.out(Easing.quad),
    },
  );
  const inclinacao = interpolate(
    frame,
    [495, 630, 700, SUBMERSO],
    [0, 5, 14, 30],
    { ...clamp, easing: Easing.in(Easing.quad) },
  );
  const afundar = interpolate(
    frame,
    [495, 630, 690, SUBMERSO + 10],
    [0, 40, 120, 950],
    { ...clamp, easing: Easing.in(Easing.quad) },
  );

  const icebergX = interpolate(
    frame,
    [360, COLISAO, 520],
    [1360, 990, 1180],
    clamp,
  );
  const icebergOpacidade = interpolate(frame, [440, 510], [1, 0], clamp);

  const tremor = interpolate(
    frame,
    [COLISAO, COLISAO + 3, COLISAO + 30],
    [0, 26, 0],
    clamp,
  );
  const dx = (random(`tremor-x-${frame}`) - 0.5) * tremor;
  const dy = (random(`tremor-y-${frame}`) - 0.5) * tremor;
  const zoom = interpolate(frame, [0, SUBMERSO], [1, 1.08], clamp);

  const t = frame / 30;

  return (
    <svg
      viewBox={`0 0 ${LARGURA} ${ALTURA}`}
      style={{
        position: "absolute",
        inset: 0,
        transform: `translate(${dx}px, ${dy}px) scale(${zoom})`,
        transformOrigin: `${LARGURA / 2}px ${AGUA}px`,
      }}
    >
      <defs>
        <linearGradient id="ceu" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={cor("#1d2b55", "#01030a")} />
          <stop offset="60%" stopColor={cor("#7a4b7a", "#06112a")} />
          <stop offset="100%" stopColor={cor("#f08a4b", "#12284a")} />
        </linearGradient>
        <linearGradient id="mar-fundo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={cor("#3b4a6b", "#0b1a2e")} />
          <stop offset="100%" stopColor={cor("#1a2238", "#040a14")} />
        </linearGradient>
        <linearGradient id="mar-frente" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={cor("#23304d", "#06101e")} />
          <stop offset="100%" stopColor={cor("#0b1020", "#010409")} />
        </linearGradient>
        <radialGradient id="brilho-sol">
          <stop offset="0%" stopColor="#ffd29a" stopOpacity={0.9} />
          <stop offset="100%" stopColor="#ff8a3d" stopOpacity={0} />
        </radialGradient>
        <linearGradient id="gelo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#dbe9f2" />
          <stop offset="100%" stopColor="#6f93ab" />
        </linearGradient>
      </defs>

      <rect width={LARGURA} height={HORIZONTE + 10} fill="url(#ceu)" />

      <g opacity={estrelas}>
        {ESTRELAS.map((e, i) => (
          <circle
            key={i}
            cx={e.x}
            cy={e.y}
            r={e.r}
            fill="#fff"
            opacity={0.55 + 0.45 * Math.sin(frame * 0.12 + e.fase)}
          />
        ))}
      </g>

      <circle
        cx={210}
        cy={sol}
        r={220}
        fill="url(#brilho-sol)"
        opacity={1 - noite}
      />
      <circle cx={210} cy={sol} r={70} fill="#ffc07a" />

      <path d={onda(HORIZONTE, 3, 300, t * 0.8)} fill="url(#mar-fundo)" />
      {new Array(8).fill(true).map((_, i) => (
        <line
          key={i}
          x1={0}
          x2={LARGURA}
          y1={HORIZONTE + 14 + i * 15}
          y2={HORIZONTE + 14 + i * 15}
          stroke="#fff"
          strokeOpacity={0.05 + i * 0.006}
          strokeWidth={2}
          strokeDasharray={`${30 + i * 6} ${80 + i * 10}`}
          strokeDashoffset={frame * (1.2 + i * 0.3)}
        />
      ))}
      {/* Reflexo do sol na água */}
      {new Array(7).fill(true).map((_, i) => (
        <rect
          key={i}
          x={210 - (60 - i * 6) + Math.sin(frame * 0.2 + i) * 8}
          y={HORIZONTE + 8 + i * 16}
          width={(60 - i * 6) * 2}
          height={4}
          rx={2}
          fill="#ffb46b"
          opacity={(1 - noite) * 0.6}
        />
      ))}

      <g
        transform={`translate(${icebergX}, 1150) scale(0.85)`}
        opacity={icebergOpacidade}
      >
        <polygon points={ICEBERG} fill="url(#gelo)" />
        <polygon points={ICEBERG_SOMBRA} fill="#4f7590" opacity={0.6} />
        <ellipse cx={10} cy={0} rx={200} ry={8} fill="#cfe3ee" opacity={0.25} />
      </g>

      <g
        transform={`translate(${navioX}, ${AGUA + afundar}) rotate(${inclinacao}) scale(${ESCALA_NAVIO}) translate(${-CENTRO_X}, ${-LINHA_DAGUA})`}
      >
        <Navio luzes={luzes} fumaca={fumaca} />
      </g>

      {/* Reflexo das luzes do navio */}
      {new Array(6).fill(true).map((_, i) => (
        <rect
          key={i}
          x={navioX - 380 + i * 130 + Math.sin(frame * 0.15 + i * 2) * 10}
          y={AGUA + 14 + (i % 3) * 14}
          width={70}
          height={3}
          rx={1.5}
          fill="#ffd77a"
          opacity={luzes * 0.35 * interpolate(afundar, [0, 120], [1, 0], clamp)}
        />
      ))}

      <path d={onda(AGUA, 5, 220, t * 1.4)} fill="url(#mar-frente)" />
      {new Array(10).fill(true).map((_, i) => (
        <line
          key={i}
          x1={0}
          x2={LARGURA}
          y1={AGUA + 30 + i * 70}
          y2={AGUA + 30 + i * 70}
          stroke="#fff"
          strokeOpacity={0.035}
          strokeWidth={3}
          strokeDasharray={`${60 + i * 10} ${140 + i * 12}`}
          strokeDashoffset={frame * (2 + i * 0.4)}
        />
      ))}

      {/* Bolhas onde o navio desapareceu */}
      {new Array(24).fill(true).map((_, i) => {
        const inicio = 690 + random(`bolha-i-${i}`) * 60;
        const vida = interpolate(frame, [inicio, inicio + 30], [0, 1], clamp);
        if (vida <= 0 || vida >= 1) {
          return null;
        }
        return (
          <circle
            key={i}
            cx={navioX - 220 + random(`bolha-x-${i}`) * 440}
            cy={AGUA + 30 - vida * 34}
            r={3 + random(`bolha-r-${i}`) * 7}
            fill="none"
            stroke="#cfe3ee"
            strokeWidth={2}
            opacity={1 - vida}
          />
        );
      })}
    </svg>
  );
};
