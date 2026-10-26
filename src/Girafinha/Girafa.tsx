import React from "react";
import { useCurrentFrame } from "remotion";

// Desenho baseado na ilustração de referência (coordenadas da imagem 896×1216).
// Os pés tocam o chão em (450, 1075).
export const PE_X = 450;
export const PE_Y = 1075;

const AMARELO = "#FDC53F";
const MANCHA = "#A9622D";
const CONTORNO = "#4A2C12";
const CASCO = "#E2A54C";
const AZUL = "#1E7FA6";
const AZUL_ESCURO = "#176A8C";

const CABECA =
  "M450,210 C560,205 625,250 640,330 C665,420 675,520 610,585 C560,630 340,630 290,585 C225,520 235,420 260,330 C275,250 340,215 450,210 Z";
const CORPO =
  "M330,640 C290,700 285,850 300,940 C320,975 580,975 600,940 C615,850 610,700 570,640 Z";

const MANCHAS_CABECA: [number, number, number, number][] = [
  [368, 240, 38, 30],
  [455, 222, 40, 22],
  [428, 284, 25, 18],
  [505, 272, 27, 19],
  [268, 515, 30, 28],
  [325, 562, 28, 24],
  [632, 522, 30, 30],
  [572, 568, 22, 20],
];

const MANCHAS_CORPO: [number, number, number, number][] = [
  [292, 760, 30, 36],
  [318, 840, 34, 40],
  [312, 925, 32, 34],
  [598, 780, 28, 36],
  [590, 880, 32, 40],
  [560, 950, 26, 20],
  [420, 955, 22, 14],
];

const Olho: React.FC<{ readonly piscar: number; readonly olhar: number }> = ({
  piscar,
  olhar,
}) => (
  <g>
    <g transform={`translate(0, 432) scale(1, ${piscar}) translate(0, -432)`}>
      <clipPath id="branco-olho">
        <ellipse cx={340} cy={432} rx={62} ry={48} />
      </clipPath>
      <ellipse
        cx={340}
        cy={432}
        rx={62}
        ry={48}
        fill="#fff"
        stroke={CONTORNO}
        strokeWidth={4}
      />
      <g clipPath="url(#branco-olho)">
        <circle
          cx={352 + olhar}
          cy={430}
          r={44}
          fill="#8B4A1F"
          stroke={CONTORNO}
          strokeWidth={3}
        />
        <circle cx={352 + olhar} cy={430} r={26} fill="#111" />
        <circle cx={366 + olhar} cy={414} r={9} fill="#fff" />
      </g>
    </g>
    {/* pálpebra e cílios */}
    <path
      d="M272,418 Q336,358 406,426"
      stroke="#111"
      strokeWidth={10}
      fill="none"
      strokeLinecap="round"
    />
    {[
      [276, 418, 250, 402],
      [286, 404, 262, 380],
      [302, 392, 288, 364],
      [320, 384, 312, 356],
    ].map(([x1, y1, x2, y2]) => (
      <line
        key={x1}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="#111"
        strokeWidth={7}
        strokeLinecap="round"
      />
    ))}
    {/* sobrancelha */}
    <path
      d="M306,322 Q334,302 364,314"
      stroke="#111"
      strokeWidth={9}
      fill="none"
      strokeLinecap="round"
    />
  </g>
);

const Orelha: React.FC = () => (
  <g>
    <path
      d="M302,262 C255,212 200,204 172,218 C176,272 216,322 270,332 Z"
      fill={AMARELO}
      stroke={CONTORNO}
      strokeWidth={4}
    />
    <path
      d="M282,282 C250,252 220,242 205,246 C214,276 238,296 262,304"
      stroke={CONTORNO}
      strokeWidth={3}
      fill="none"
    />
  </g>
);

const Chifre: React.FC = () => (
  <g>
    <line
      x1={368}
      y1={240}
      x2={348}
      y2={168}
      stroke={CONTORNO}
      strokeWidth={42}
      strokeLinecap="round"
    />
    <line
      x1={368}
      y1={240}
      x2={348}
      y2={168}
      stroke={AMARELO}
      strokeWidth={34}
      strokeLinecap="round"
    />
    <circle
      cx={344}
      cy={158}
      r={31}
      fill={MANCHA}
      stroke={CONTORNO}
      strokeWidth={4}
    />
  </g>
);

const Espelhar: React.FC<{ readonly children: React.ReactNode }> = ({
  children,
}) => <g transform="translate(900, 0) scale(-1, 1)">{children}</g>;

const Braco: React.FC<{
  readonly direito?: boolean;
  readonly angulo?: number;
}> = ({ direito = false, angulo = 0 }) => {
  const ombro = { x: 318, y: 700 };
  const mao = { x: 255, y: 842 };
  return (
    <g transform={`rotate(${angulo} ${ombro.x} ${ombro.y})`}>
      <line
        x1={ombro.x}
        y1={ombro.y}
        x2={mao.x}
        y2={mao.y}
        stroke={CONTORNO}
        strokeWidth={78}
        strokeLinecap="round"
      />
      <line
        x1={ombro.x}
        y1={ombro.y}
        x2={mao.x}
        y2={mao.y}
        stroke={AMARELO}
        strokeWidth={70}
        strokeLinecap="round"
      />
      <ellipse
        cx={direito ? 290 : 292}
        cy={752}
        rx={16}
        ry={22}
        fill={MANCHA}
      />
      <ellipse
        cx={252}
        cy={858}
        rx={40}
        ry={30}
        fill={CASCO}
        stroke={CONTORNO}
        strokeWidth={4}
      />
    </g>
  );
};

export const Girafa: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly escala: number;
  readonly falando?: boolean;
  readonly acenando?: boolean;
  readonly pulando?: boolean;
  readonly ventoCachecol?: number;
  readonly olhar?: number;
}> = ({
  x,
  y,
  escala,
  falando = false,
  acenando = false,
  pulando = false,
  ventoCachecol = 0,
  olhar = 0,
}) => {
  const frame = useCurrentFrame();

  // pisca por 5 frames a cada ~3,3 s
  const ciclo = frame % 100;
  const piscar = ciclo < 5 ? [1, 0.5, 0.1, 0.5, 1][ciclo] : 1;
  const respirar = Math.sin(frame / 22) * 5;
  const pulo = pulando ? Math.abs(Math.sin(frame / 7)) * 40 : 0;
  const cabeca = Math.sin(frame / 35) * 3;
  const rabo = Math.sin(frame / 8) * 12;
  const aceno = acenando ? 125 + Math.sin(frame / 4) * 22 : 0;
  const bocaAberta = falando && Math.floor(frame / 5) % 2 === 0;
  const cachecol = Math.sin(frame / 5) * ventoCachecol;

  return (
    <g
      transform={`translate(${x}, ${y - pulo}) scale(${escala}) translate(${-PE_X}, ${-PE_Y})`}
    >
      <ellipse cx={450} cy={1075} rx={230} ry={26} fill="#000" opacity={0.08} />
      <g transform={`translate(0, ${respirar * 0.3})`}>
        {/* rabo */}
        <g transform={`rotate(${rabo} 598 925)`}>
          <path
            d="M598,925 Q650,948 702,924"
            stroke={CONTORNO}
            strokeWidth={12}
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M598,925 Q650,948 702,924"
            stroke={AMARELO}
            strokeWidth={6}
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M698,926 C702,896 734,880 768,868 C764,906 742,934 698,926 Z"
            fill={CASCO}
            stroke={CONTORNO}
            strokeWidth={4}
          />
        </g>

        {/* pernas */}
        {[
          { x: 330, casco: 358 },
          { x: 480, casco: 545 },
        ].map((p) => (
          <g key={p.x}>
            <rect
              x={p.x}
              y={900}
              width={92}
              height={150}
              rx={30}
              fill={AMARELO}
              stroke={CONTORNO}
              strokeWidth={4}
            />
            <ellipse cx={p.x + 26} cy={985} rx={18} ry={14} fill={MANCHA} />
            <ellipse cx={p.x + 64} cy={1012} rx={14} ry={11} fill={MANCHA} />
            <ellipse
              cx={p.casco}
              cy={1046}
              rx={56}
              ry={32}
              fill={CASCO}
              stroke={CONTORNO}
              strokeWidth={4}
            />
          </g>
        ))}

        {/* corpo */}
        <clipPath id="corpo-girafa">
          <path d={CORPO} />
        </clipPath>
        <path d={CORPO} fill={AMARELO} stroke={CONTORNO} strokeWidth={4} />
        <g clipPath="url(#corpo-girafa)">
          {MANCHAS_CORPO.map(([cx, cy, rx, ry]) => (
            <ellipse
              key={`${cx}-${cy}`}
              cx={cx}
              cy={cy}
              rx={rx}
              ry={ry}
              fill={MANCHA}
            />
          ))}
        </g>
        <path
          d="M372,955 Q450,972 528,955"
          stroke={CONTORNO}
          strokeWidth={3}
          fill="none"
        />

        <Braco />

        {/* cabeça */}
        <g transform={`rotate(${cabeca} 450 610)`}>
          <Chifre />
          <Espelhar>
            <Chifre />
          </Espelhar>
          <Orelha />
          <Espelhar>
            <Orelha />
          </Espelhar>
          <clipPath id="cabeca-girafa">
            <path d={CABECA} />
          </clipPath>
          <path d={CABECA} fill={AMARELO} stroke={CONTORNO} strokeWidth={4} />
          <g clipPath="url(#cabeca-girafa)">
            {MANCHAS_CABECA.map(([cx, cy, rx, ry]) => (
              <ellipse
                key={`${cx}-${cy}`}
                cx={cx}
                cy={cy}
                rx={rx}
                ry={ry}
                fill={MANCHA}
              />
            ))}
          </g>
          <Olho piscar={piscar} olhar={olhar} />
          <Espelhar>
            <Olho piscar={piscar} olhar={-olhar} />
          </Espelhar>
          {/* focinho */}
          <ellipse
            cx={450}
            cy={520}
            rx={76}
            ry={56}
            fill={AMARELO}
            stroke={CONTORNO}
            strokeWidth={4}
          />
          <path
            d="M416,514 q9,-14 18,0"
            stroke={CONTORNO}
            strokeWidth={4}
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M466,514 q9,-14 18,0"
            stroke={CONTORNO}
            strokeWidth={4}
            fill="none"
            strokeLinecap="round"
          />
          {bocaAberta ? (
            <g>
              <ellipse
                cx={450}
                cy={556}
                rx={26}
                ry={16}
                fill="#7a2e1a"
                stroke={CONTORNO}
                strokeWidth={3}
              />
              <ellipse cx={450} cy={564} rx={14} ry={7} fill="#ff8fa3" />
            </g>
          ) : (
            <path
              d="M408,550 Q450,584 492,550"
              stroke={CONTORNO}
              strokeWidth={4}
              fill="none"
              strokeLinecap="round"
            />
          )}
          <ellipse
            cx={312}
            cy={490}
            rx={22}
            ry={13}
            fill="#ff9aa8"
            opacity={0.45}
          />
          <ellipse
            cx={588}
            cy={490}
            rx={22}
            ry={13}
            fill="#ff9aa8"
            opacity={0.45}
          />
        </g>

        {/* cachecol */}
        <g transform={`rotate(${cachecol} 495 690)`}>
          <path
            d="M455,688 L542,688 L562,832 C532,848 472,852 438,846 Z"
            fill={AZUL}
            stroke={CONTORNO}
            strokeWidth={4}
          />
          <path d="M520,700 L536,836" stroke={AZUL_ESCURO} strokeWidth={14} />
          <path d="M440,826 L560,816" stroke={AZUL_ESCURO} strokeWidth={4} />
        </g>
        <path
          d="M318,612 C334,590 566,588 584,608 C600,640 592,680 572,692 C500,716 400,714 330,692 C310,676 306,640 318,612 Z"
          fill={AZUL}
          stroke={CONTORNO}
          strokeWidth={4}
        />
        <path
          d="M352,642 C392,658 420,662 446,660"
          stroke={AZUL_ESCURO}
          strokeWidth={4}
          fill="none"
        />

        <Espelhar>
          <Braco direito angulo={aceno} />
        </Espelhar>
      </g>
    </g>
  );
};
