import React from "react";
import { useCurrentFrame } from "remotion";

// Coordenadas locais: o navio vai de x=40 (popa) a x=975 (proa),
// com a linha d'água em y=235.
export const LINHA_DAGUA = 235;
export const CENTRO_X = 500;

const CASCO =
  "M40,148 L975,138 L945,300 L125,300 C95,300 70,260 62,220 C55,200 45,170 40,148 Z";

// Só a seção da proa ficou inteira no fundo do mar
const QUEBRA =
  "M430,-200 L1100,-200 L1100,400 L470,400 L440,330 L465,280 L425,220 L455,160 L420,90 L450,20 Z";

const CHAMINES = [310, 425, 540, 655];

const vigias = (y: number, de: number, ate: number, passo: number) => {
  const pontos: number[] = [];
  for (let x = de; x <= ate; x += passo) {
    pontos.push(x);
  }
  return pontos.map((x) => ({ x, y }));
};

const VIGIAS = [
  ...vigias(172, 90, 930, 17),
  ...vigias(197, 110, 920, 21),
  ...vigias(122, 185, 800, 15),
];

export const Navio: React.FC<{
  readonly luzes: number;
  readonly fumaca: number;
  readonly destrocos?: boolean;
}> = ({ luzes, fumaca, destrocos = false }) => {
  const frame = useCurrentFrame();

  const corCasco = destrocos ? "#2a211c" : "#111317";
  const corFundo = destrocos ? "#3a2418" : "#7a1c14";
  const corSuper = destrocos ? "#4a3d33" : "#eceae4";
  const corChamine = "#d79a3c";

  return (
    <g clipPath={destrocos ? "url(#quebra-proa)" : undefined}>
      <defs>
        <clipPath id={destrocos ? "casco-destrocos" : "casco-navio"}>
          <path d={CASCO} />
        </clipPath>
        <clipPath id="quebra-proa">
          <path d={QUEBRA} />
        </clipPath>
        <radialGradient id="baforada">
          <stop offset="0%" stopColor="#5d616b" stopOpacity={0.9} />
          <stop offset="100%" stopColor="#5d616b" stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* Fumaça das três chaminés que funcionavam (a quarta era decorativa) */}
      {!destrocos && fumaca > 0
        ? CHAMINES.slice(0, 3).map((cx, c) =>
            new Array(6).fill(true).map((_, i) => {
              const t = ((frame + i * 12 + c * 7) % 72) / 72;
              return (
                <circle
                  key={`${c}-${i}`}
                  cx={cx - 18 - t * 280}
                  cy={-30 - t * 110}
                  r={16 + t * 46}
                  fill="url(#baforada)"
                  opacity={(1 - t) * 0.55 * fumaca}
                />
              );
            }),
          )
        : null}

      {/* Mastros e cabo entre eles */}
      <line
        x1={880}
        y1={145}
        x2={872}
        y2={-85}
        stroke={corCasco}
        strokeWidth={6}
      />
      <line
        x1={112}
        y1={150}
        x2={104}
        y2={-62}
        stroke={corCasco}
        strokeWidth={6}
      />
      {destrocos ? null : (
        <line
          x1={872}
          y1={-84}
          x2={104}
          y2={-60}
          stroke={corCasco}
          strokeWidth={1.5}
        />
      )}

      {/* Chaminés */}
      {destrocos
        ? null
        : CHAMINES.map((cx) => (
            <g key={cx}>
              <polygon
                points={`${cx - 23},90 ${cx + 23},90 ${cx + 5},-30 ${cx - 41},-30`}
                fill={corChamine}
              />
              <polygon
                points={`${cx - 26},-2 ${cx + 9},-2 ${cx + 5},-30 ${cx - 41},-30`}
                fill="#15161a"
              />
            </g>
          ))}

      {/* Superestrutura */}
      <rect x={170} y={104} width={650} height={48} fill={corSuper} />
      <rect x={230} y={86} width={530} height={20} fill={corSuper} />
      <rect x={718} y={68} width={52} height={20} fill={corSuper} />
      {destrocos
        ? null
        : [260, 290, 360, 390, 470, 500, 600, 630].map((x) => (
            <rect
              key={x}
              x={x}
              y={76}
              width={24}
              height={10}
              rx={4}
              fill="#f8f6f0"
            />
          ))}

      {/* Casco: preto em cima, vermelho abaixo da linha d'água */}
      <path d={CASCO} fill={corCasco} />
      <rect
        x={0}
        y={LINHA_DAGUA - 3}
        width={1000}
        height={100}
        fill={corFundo}
        clipPath={`url(#${destrocos ? "casco-destrocos" : "casco-navio"})`}
      />
      <line
        x1={42}
        y1={152}
        x2={975}
        y2={142}
        stroke={corSuper}
        strokeWidth={3}
      />

      {/* Vigias e janelas: apagadas de dia, acesas à noite */}
      {VIGIAS.map(({ x, y }) => (
        <g key={`${x}-${y}`}>
          <circle
            cx={x}
            cy={y}
            r={3.2}
            fill={destrocos ? "#1a1411" : "#2b2e35"}
          />
          {luzes > 0 ? (
            <circle cx={x} cy={y} r={3.6} fill="#ffd77a" opacity={luzes} />
          ) : null}
        </g>
      ))}
    </g>
  );
};
