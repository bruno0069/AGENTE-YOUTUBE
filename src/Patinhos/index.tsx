import React from "react";
import {
  AbsoluteFill,
  Html5Audio,
  interpolate,
  random,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { carregarFontes, FonteTitulo } from "../Naufragio/fonte";
import { Cenario } from "./Cenario";
import { Pato } from "./Pato";

carregarFontes();

export const FPS = 30;
export const DURACAO = 30 * FPS;

const INICIO_CONTAGEM = 90;
const PASSO = 100;
const INICIO_REVISAO = 590;
const PASSO_REVISAO = 28;
const INICIO_FESTA = 750;

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

const NUMEROS = [
  { n: "1", palavra: "UM PATINHO", cor: "#ff5d73" },
  { n: "2", palavra: "DOIS PATINHOS", cor: "#ff9f1c" },
  { n: "3", palavra: "TRÊS PATINHOS", cor: "#2ec4b6" },
  { n: "4", palavra: "QUATRO PATINHOS", cor: "#4d96ff" },
  { n: "5", palavra: "CINCO PATINHOS", cor: "#9b5de5" },
];

const POSICOES = [
  { x: 300, y: 1190 },
  { x: 540, y: 1130 },
  { x: 780, y: 1190 },
  { x: 410, y: 1350 },
  { x: 670, y: 1350 },
];

const estiloTexto = (tamanho: number): React.CSSProperties => ({
  fontFamily: FonteTitulo,
  fontSize: tamanho,
  color: "white",
  WebkitTextStroke: `${Math.round(tamanho * 0.16)}px #1b3a6b`,
  paintOrder: "stroke",
  textAlign: "center",
  lineHeight: 1.05,
});

const PatoAnimado: React.FC<{ readonly indice: number }> = ({ indice }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { x, y } = POSICOES[indice];

  const chegada = INICIO_CONTAGEM + indice * PASSO;
  const queda = spring({
    frame: frame - chegada,
    fps,
    config: { damping: 9, stiffness: 110 },
    durationInFrames: 28,
  });
  if (frame < chegada) {
    return null;
  }

  const pulo = Math.max(0, frame - (INICIO_REVISAO + indice * PASSO_REVISAO));
  const saltoRevisao =
    pulo > 0 && pulo < 18 ? Math.sin((pulo / 18) * Math.PI) * 70 : 0;
  const festa = frame >= INICIO_FESTA;
  const danca = festa
    ? Math.abs(Math.sin((frame - INICIO_FESTA) / 5 + indice)) * 50
    : 0;
  const balanco = festa
    ? Math.sin((frame - INICIO_FESTA) / 5 + indice) * 10
    : 0;
  const flutuar = Math.sin(frame / 9 + indice * 1.7) * 5;

  const dy =
    interpolate(queda, [0, 1], [-900, 0]) + flutuar - saltoRevisao - danca;

  const ondaIdade = frame - (chegada + 10);
  const onda = ondaIdade > 0 && ondaIdade < 30 ? ondaIdade / 30 : 0;

  return (
    <g>
      {onda > 0
        ? [0, 0.25].map((atraso, i) => {
            const p = Math.max(0, onda - atraso) / (1 - atraso);
            return (
              <ellipse
                key={i}
                cx={x}
                cy={y + 6}
                rx={60 + p * 140}
                ry={14 + p * 36}
                fill="none"
                stroke="#fff"
                strokeWidth={8 * (1 - p)}
                opacity={1 - p}
              />
            );
          })
        : null}
      <Pato x={x} y={y + dy} escala={1.05} inclinar={balanco} />
      {/* água na frente do corpo */}
      <ellipse
        cx={x}
        cy={y + 8}
        rx={118}
        ry={24}
        fill="#37b3e6"
        opacity={interpolate(queda, [0, 0.4], [0, 0.9], clamp)}
      />
    </g>
  );
};

const NumeroGrande: React.FC<{ readonly indice: number }> = ({ indice }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { n, palavra, cor } = NUMEROS[indice];

  const entrada = spring({
    frame: frame - 6,
    fps,
    config: { damping: 8, stiffness: 150 },
    durationInFrames: 24,
  });
  const saida = interpolate(frame, [88, 100], [1, 0], clamp);

  return (
    <AbsoluteFill style={{ opacity: saida }}>
      <div
        style={{
          position: "absolute",
          top: 300,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          transform: `scale(${entrada}) rotate(${interpolate(entrada, [0, 1], [-25, 0])}deg)`,
        }}
      >
        <div
          style={{
            width: 360,
            height: 360,
            borderRadius: 180,
            backgroundColor: cor,
            border: "16px solid white",
            boxShadow: "0 18px 0 rgba(0,0,0,0.18)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            ...estiloTexto(260),
            WebkitTextStroke: "0px",
            lineHeight: 1,
          }}
        >
          {n}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: 1530,
          left: 40,
          right: 40,
          opacity: interpolate(frame, [10, 20], [0, 1], clamp),
          transform: `translateY(${interpolate(frame, [10, 22], [40, 0], clamp)}px)`,
          ...estiloTexto(92),
        }}
      >
        {palavra}
      </div>
    </AbsoluteFill>
  );
};

const Numeracao: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <>
      {POSICOES.map(({ x, y }, i) => {
        const t = frame - (INICIO_REVISAO + i * PASSO_REVISAO);
        const e = spring({
          frame: t,
          fps,
          config: { damping: 9 },
          durationInFrames: 16,
        });
        if (t < 0) {
          return null;
        }
        return (
          <g
            key={i}
            transform={`translate(${x + 20}, ${(i < 3 ? y - 270 : y + 85) - interpolate(e, [0, 1], [-40, 0])}) scale(${e})`}
          >
            <circle
              r={52}
              fill={NUMEROS[i].cor}
              stroke="#fff"
              strokeWidth={8}
            />
            <text
              textAnchor="middle"
              y={30}
              fontSize={80}
              fill="#fff"
              style={{ fontFamily: FonteTitulo }}
            >
              {NUMEROS[i].n}
            </text>
          </g>
        );
      })}
    </>
  );
};

const CORES_CONFETE = [
  "#ff5d73",
  "#ff9f1c",
  "#2ec4b6",
  "#4d96ff",
  "#9b5de5",
  "#ffd93b",
];

const Confete: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <svg
      viewBox="0 0 1080 1920"
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      {new Array(70).fill(true).map((_, i) => {
        const inicio = random(`c-i-${i}`) * 40;
        const t = frame - inicio;
        if (t < 0) {
          return null;
        }
        const x = random(`c-x-${i}`) * 1080 + Math.sin(t / 10 + i) * 40;
        const y = -60 + t * (6 + random(`c-v-${i}`) * 8);
        return (
          <rect
            key={i}
            x={-12}
            y={-6}
            width={24}
            height={12}
            fill={CORES_CONFETE[i % CORES_CONFETE.length]}
            transform={`translate(${x}, ${y % 2100}) rotate(${t * (6 + (i % 5) * 3)})`}
          />
        );
      })}
    </svg>
  );
};

const Titulo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = spring({
    frame: frame - 4,
    fps,
    config: { damping: 9 },
    durationInFrames: 26,
  });
  const saida = interpolate(frame, [74, 88], [1, 0], clamp);

  return (
    <AbsoluteFill style={{ opacity: saida, top: 320 }}>
      <div style={{ ...estiloTexto(130), transform: `scale(${e})` }}>VAMOS</div>
      <div
        style={{
          ...estiloTexto(130),
          transform: `scale(${e})`,
          color: "#ffd93b",
        }}
      >
        CONTAR?
      </div>
      <div
        style={{
          ...estiloTexto(70),
          marginTop: 30,
          opacity: interpolate(frame, [26, 40], [0, 1], clamp),
        }}
      >
        COM OS PATINHOS
      </div>
    </AbsoluteFill>
  );
};

const Revisao: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: 330,
          left: 0,
          right: 0,
          opacity: interpolate(frame, [0, 12], [0, 1], clamp),
          ...estiloTexto(100),
        }}
      >
        VAMOS
        <br />
        CONTAR JUNTOS!
      </div>
      <div
        style={{
          position: "absolute",
          top: 1530,
          left: 40,
          right: 40,
          ...estiloTexto(110),
          color: "#ffd93b",
          display: "flex",
          justifyContent: "center",
          gap: 50,
        }}
      >
        {NUMEROS.map((n, i) => (
          <span
            key={i}
            style={{ opacity: frame >= i * PASSO_REVISAO + 6 ? 1 : 0 }}
          >
            {n.n}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const Festa: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = spring({
    frame,
    fps,
    config: { damping: 7 },
    durationInFrames: 30,
  });
  const e2 = spring({
    frame: frame - 18,
    fps,
    config: { damping: 12 },
    durationInFrames: 24,
  });

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: 300,
          left: 0,
          right: 0,
          transform: `scale(${e}) rotate(${Math.sin(frame / 6) * 3}deg)`,
          ...estiloTexto(150),
          color: "#ffd93b",
        }}
      >
        PARABÉNS!
      </div>
      <div
        style={{
          position: "absolute",
          top: 1520,
          left: 40,
          right: 40,
          transform: `scale(${e2})`,
          ...estiloTexto(78),
        }}
      >
        VOCÊ CONTOU ATÉ 5!
      </div>
      <Confete />
    </AbsoluteFill>
  );
};

export const Patinhos: React.FC = () => {
  const frame = useCurrentFrame();
  const fim = interpolate(frame, [DURACAO - 15, DURACAO], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: "#59c2ff" }}>
      <Cenario />
      <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        {NUMEROS.map((_, i) => (
          <PatoAnimado key={i} indice={i} />
        ))}
        {frame >= INICIO_REVISAO && frame < INICIO_FESTA ? <Numeracao /> : null}
      </svg>

      <Sequence durationInFrames={90}>
        <Titulo />
      </Sequence>
      {NUMEROS.map((_, i) => (
        <Sequence
          key={i}
          from={INICIO_CONTAGEM + i * PASSO}
          durationInFrames={PASSO}
        >
          <NumeroGrande indice={i} />
        </Sequence>
      ))}
      <Sequence
        from={INICIO_REVISAO}
        durationInFrames={INICIO_FESTA - INICIO_REVISAO}
      >
        <Revisao />
      </Sequence>
      <Sequence from={INICIO_FESTA}>
        <Festa />
      </Sequence>

      <AbsoluteFill style={{ backgroundColor: "white", opacity: fim }} />
      <Html5Audio src={staticFile("patinhos/musica.wav")} />
    </AbsoluteFill>
  );
};
