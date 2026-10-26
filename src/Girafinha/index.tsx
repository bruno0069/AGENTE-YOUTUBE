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
import { CHAO, Cenario } from "./Cenario";
import { Girafa } from "./Girafa";
import { Borboleta, Coracao, Folha, Maca, Sol } from "./Objetos";

carregarFontes();

export const FPS = 30;
export const DURACAO = 60 * FPS;

const CONTORNO = "#4A2C12";
const VITRINE = { x: 850, y: 1130 };

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

type Fala = {
  inicio: number;
  fim: number;
  linha1: string;
  linha2: string;
  cor: string;
};

type Cor = {
  inicio: number;
  nome: string;
  cor: string;
  Objeto: React.FC;
};

const CORES: Cor[] = [
  { inicio: 300, nome: "VERMELHO", cor: "#E63946", Objeto: Maca },
  { inicio: 540, nome: "AMARELO", cor: "#FFC300", Objeto: Sol },
  { inicio: 780, nome: "VERDE", cor: "#2BA84A", Objeto: Folha },
  { inicio: 1020, nome: "ROXO", cor: "#8E44AD", Objeto: Borboleta },
  { inicio: 1260, nome: "AZUL", cor: "#1E7FA6", Objeto: Coracao },
];
const DURACAO_COR = 240;
const INICIO_REVISAO = 1500;
const INICIO_TCHAU = 1650;

const FALAS: Fala[] = [
  {
    inicio: 150,
    fim: 225,
    linha1: "OI! EU SOU A",
    linha2: "GIGI!",
    cor: "#A9622D",
  },
  {
    inicio: 225,
    fim: 300,
    linha1: "VAMOS APRENDER",
    linha2: "AS CORES?",
    cor: "#1E7FA6",
  },
  {
    inicio: 300,
    fim: 540,
    linha1: "A MAÇÃ É",
    linha2: "VERMELHA!",
    cor: "#E63946",
  },
  {
    inicio: 540,
    fim: 780,
    linha1: "O SOL É",
    linha2: "AMARELO!",
    cor: "#FFC300",
  },
  {
    inicio: 780,
    fim: 1020,
    linha1: "A FOLHA É",
    linha2: "VERDE!",
    cor: "#2BA84A",
  },
  {
    inicio: 1020,
    fim: 1260,
    linha1: "A BORBOLETA É",
    linha2: "ROXA!",
    cor: "#8E44AD",
  },
  {
    inicio: 1260,
    fim: 1380,
    linha1: "MEU CACHECOL É",
    linha2: "AZUL!",
    cor: "#1E7FA6",
  },
  {
    inicio: 1380,
    fim: 1500,
    linha1: "É A MINHA COR",
    linha2: "FAVORITA!",
    cor: "#1E7FA6",
  },
  {
    inicio: INICIO_REVISAO,
    fim: INICIO_TCHAU,
    linha1: "VAMOS",
    linha2: "LEMBRAR?",
    cor: "#A9622D",
  },
  {
    inicio: INICIO_TCHAU,
    fim: DURACAO,
    linha1: "TCHAU!",
    linha2: "ATÉ A PRÓXIMA!",
    cor: "#E63946",
  },
];

const texto = (tamanho: number, cor: string): React.CSSProperties => ({
  fontFamily: FonteTitulo,
  fontSize: tamanho,
  color: cor,
  WebkitTextStroke: `${Math.round(tamanho * 0.12)}px ${CONTORNO}`,
  paintOrder: "stroke",
  textAlign: "center",
  lineHeight: 1.05,
});

const Balao: React.FC<{ readonly fala: Fala; readonly ultimo: boolean }> = ({
  fala,
  ultimo,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const duracao = fala.fim - fala.inicio;

  const entrada = spring({
    frame,
    fps,
    config: { damping: 12 },
    durationInFrames: 14,
  });
  const palavra = spring({
    frame: frame - 12,
    fps,
    config: { damping: 7, stiffness: 160 },
    durationInFrames: 22,
  });
  const saida = ultimo
    ? 1
    : interpolate(frame, [duracao - 8, duracao], [1, 0], clamp);

  return (
    <AbsoluteFill style={{ opacity: saida }}>
      <div
        style={{
          position: "absolute",
          top: 230,
          left: 70,
          right: 70,
          padding: "36px 30px 44px",
          borderRadius: 70,
          backgroundColor: "white",
          border: `8px solid ${CONTORNO}`,
          boxShadow: "0 14px 0 rgba(74, 44, 18, 0.15)",
          transform: `scale(${entrada})`,
          transformOrigin: "30% 100%",
        }}
      >
        <div style={{ ...texto(66, CONTORNO), WebkitTextStroke: "0px" }}>
          {fala.linha1}
        </div>
        <div
          style={{
            ...texto(fala.linha2.length > 10 ? 104 : 130, fala.cor),
            marginTop: 10,
            transform: `scale(${palavra})`,
          }}
        >
          {fala.linha2}
        </div>
        {/* rabinho do balão */}
        <div
          style={{
            position: "absolute",
            bottom: -38,
            left: 250,
            width: 64,
            height: 64,
            backgroundColor: "white",
            borderRight: `8px solid ${CONTORNO}`,
            borderBottom: `8px solid ${CONTORNO}`,
            transform: "rotate(45deg)",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

const Brilhos: React.FC<{ readonly cor: string }> = ({ cor }) => {
  const frame = useCurrentFrame();
  return (
    <g>
      {new Array(8).fill(true).map((_, i) => {
        const angulo = (i / 8) * Math.PI * 2;
        const t = interpolate(frame, [4, 30], [0, 1], clamp);
        const r = 150 + t * 120;
        const s = Math.sin(t * Math.PI) * 1.2;
        return (
          <path
            key={i}
            transform={`translate(${Math.cos(angulo) * r}, ${Math.sin(angulo) * r}) scale(${s})`}
            d="M0,-28 L8,-8 L28,0 L8,8 L0,28 L-8,8 L-28,0 L-8,-8 Z"
            fill={i % 2 ? cor : "#fff"}
            stroke={CONTORNO}
            strokeWidth={3}
          />
        );
      })}
    </g>
  );
};

const Vitrine: React.FC<{ readonly cor: Cor }> = ({ cor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { Objeto } = cor;

  const entrada = spring({
    frame,
    fps,
    config: { damping: 9, stiffness: 120 },
    durationInFrames: 26,
  });
  const saida = interpolate(
    frame,
    [DURACAO_COR - 10, DURACAO_COR],
    [1, 0],
    clamp,
  );
  const flutuar = Math.sin(frame / 14) * 12;

  return (
    <svg
      viewBox="0 0 1080 1920"
      style={{ position: "absolute", inset: 0, opacity: saida }}
    >
      <g transform={`translate(${VITRINE.x}, ${VITRINE.y + flutuar})`}>
        <circle r={190 * entrada} fill="#fff" opacity={0.55} />
        <Brilhos cor={cor.cor} />
        <g
          transform={`scale(${entrada * 0.85}) rotate(${interpolate(entrada, [0, 1], [-40, 0])})`}
        >
          <Objeto />
        </g>
      </g>
    </svg>
  );
};

const Revisao: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      {CORES.map((c, i) => {
        const e = spring({
          frame: frame - 20 - i * 22,
          fps,
          config: { damping: 10 },
          durationInFrames: 16,
        });
        return (
          <div
            key={c.nome}
            style={{
              position: "absolute",
              left: VITRINE.x - 170,
              top: 790 + i * 120,
              width: 340,
              height: 100,
              borderRadius: 50,
              backgroundColor: c.cor,
              border: `7px solid ${CONTORNO}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `scale(${e})`,
              ...texto(56, "white"),
              WebkitTextStroke: `6px ${CONTORNO}`,
            }}
          >
            {c.nome}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const CORES_TITULO = ["#E63946", "#FFC300", "#2BA84A", "#1E7FA6", "#8E44AD"];

const Titulo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = spring({
    frame: frame - 6,
    fps,
    config: { damping: 8 },
    durationInFrames: 28,
  });
  const saida = interpolate(frame, [135, 150], [1, 0], clamp);

  return (
    <AbsoluteFill style={{ top: 230, opacity: saida }}>
      <div
        style={{
          ...texto(84, "white"),
          opacity: interpolate(frame, [0, 12], [0, 1], clamp),
        }}
      >
        A GIRAFINHA
      </div>
      <div
        style={{
          ...texto(250, "#FDC53F"),
          transform: `scale(${e}) rotate(${Math.sin(frame / 10) * 3}deg)`,
        }}
      >
        GIGI
      </div>
      <div style={{ ...texto(96, "white"), marginTop: 6 }}>
        {"E AS CORES".split("").map((letra, i) => {
          const pop = spring({
            frame: frame - 30 - i * 4,
            fps,
            config: { damping: 9 },
            durationInFrames: 14,
          });
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                whiteSpace: "pre",
                color: CORES_TITULO[i % CORES_TITULO.length],
                transform: `scale(${pop}) translateY(${Math.sin(frame / 6 + i) * 6}px)`,
              }}
            >
              {letra}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const Coracoes: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
      {new Array(14).fill(true).map((_, i) => {
        const inicio = random(`co-i-${i}`) * 90;
        const t = frame - inicio;
        if (t < 0) {
          return null;
        }
        const x = 60 + random(`co-x-${i}`) * 960 + Math.sin(t / 12 + i) * 30;
        const y = 1900 - t * (5 + random(`co-v-${i}`) * 4);
        return (
          <path
            key={i}
            transform={`translate(${x}, ${y}) scale(${0.25 + random(`co-s-${i}`) * 0.2})`}
            d="M0,120 C-150,20 -150,-120 -60,-120 C-20,-120 0,-90 0,-70 C0,-90 20,-120 60,-120 C150,-120 150,20 0,120 Z"
            fill={CORES_TITULO[i % CORES_TITULO.length]}
            opacity={0.85}
          />
        );
      })}
    </svg>
  );
};

const dentro = (frame: number, de: number, ate: number) =>
  frame >= de && frame < ate;

export const Girafinha: React.FC = () => {
  const frame = useCurrentFrame();

  const falaAtual = FALAS.find((f) => dentro(frame, f.inicio, f.fim));
  const falando = falaAtual ? dentro(frame - falaAtual.inicio, 8, 60) : false;
  const acenando =
    dentro(frame, 20, 225) || dentro(frame, INICIO_TCHAU, DURACAO);
  const pulando =
    CORES.some((c) => dentro(frame, c.inicio + 14, c.inicio + 50)) ||
    dentro(frame, INICIO_TCHAU + 10, INICIO_TCHAU + 70);
  const olhandoVitrine = CORES.some((c) =>
    dentro(frame, c.inicio, c.inicio + DURACAO_COR - 20),
  );
  const vento = dentro(frame, 1260, 1500) ? 9 : 0;
  const arcoIris = interpolate(
    frame,
    [INICIO_TCHAU, INICIO_TCHAU + 50],
    [0, 1],
    clamp,
  );
  const fim = interpolate(frame, [DURACAO - 15, DURACAO], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: "#bfe3ea" }}>
      <Cenario arcoIris={arcoIris} />
      <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <Girafa
          x={380}
          y={CHAO - 10}
          escala={0.95}
          falando={falando}
          acenando={acenando}
          pulando={pulando}
          ventoCachecol={vento}
          olhar={olhandoVitrine ? 12 : 0}
        />
      </svg>

      {CORES.map((c) => (
        <Sequence key={c.nome} from={c.inicio} durationInFrames={DURACAO_COR}>
          <Vitrine cor={c} />
        </Sequence>
      ))}
      <Sequence
        from={INICIO_REVISAO}
        durationInFrames={INICIO_TCHAU - INICIO_REVISAO}
      >
        <Revisao />
      </Sequence>
      <Sequence from={INICIO_TCHAU}>
        <Coracoes />
      </Sequence>

      <Sequence durationInFrames={150}>
        <Titulo />
      </Sequence>
      {FALAS.map((f, i) => (
        <Sequence
          key={f.inicio}
          from={f.inicio}
          durationInFrames={f.fim - f.inicio}
        >
          <Balao fala={f} ultimo={i === FALAS.length - 1} />
        </Sequence>
      ))}

      <AbsoluteFill style={{ backgroundColor: "white", opacity: fim }} />
      <Html5Audio src={staticFile("girafinha/musica.wav")} />
    </AbsoluteFill>
  );
};
