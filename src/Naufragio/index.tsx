import React from "react";
import {
  AbsoluteFill,
  Html5Audio,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { carregarFontes, FonteTexto, FonteTitulo } from "./fonte";
import { FundoDoMar } from "./FundoDoMar";
import { Legenda } from "./Legenda";
import { CENAS, COLISAO, DURACAO, FUNDO_DO_MAR } from "./roteiro";
import { Superficie } from "./Superficie";

carregarFontes();

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

const Titulo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrada = spring({
    frame: frame - 8,
    fps,
    config: { damping: 200 },
    durationInFrames: 30,
  });
  const saida = interpolate(frame, [72, 90], [1, 0], clamp);

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        top: 360,
        opacity: saida,
        color: "white",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontFamily: FonteTexto,
          fontSize: 50,
          letterSpacing: 12,
          opacity: interpolate(frame, [0, 15], [0, 1], clamp),
        }}
      >
        O NAUFRÁGIO DO
      </div>
      <div
        style={{
          fontFamily: FonteTitulo,
          fontSize: 200,
          lineHeight: 1,
          letterSpacing: interpolate(entrada, [0, 1], [40, 6]),
          opacity: entrada,
          transform: `scale(${interpolate(entrada, [0, 1], [1.15, 1])})`,
          textShadow: "0 10px 40px rgba(0, 0, 0, 0.5)",
        }}
      >
        TITANIC
      </div>
      <div
        style={{
          marginTop: 24,
          width: interpolate(entrada, [0, 1], [0, 520]),
          height: 4,
          backgroundColor: "#FFD23F",
        }}
      />
      <div
        style={{
          marginTop: 24,
          fontFamily: FonteTexto,
          fontSize: 36,
          letterSpacing: 6,
          opacity: interpolate(frame, [25, 40], [0, 1], clamp),
        }}
      >
        UMA HISTÓRIA EM 30 SEGUNDOS
      </div>
    </AbsoluteFill>
  );
};

export const Naufragio: React.FC = () => {
  const frame = useCurrentFrame();

  const flash = interpolate(
    frame,
    [COLISAO - 1, COLISAO, COLISAO + 12],
    [0, 0.55, 0],
    clamp,
  );
  const mergulho = interpolate(
    frame,
    [FUNDO_DO_MAR, FUNDO_DO_MAR + 20],
    [0, 1],
    clamp,
  );
  const fim = interpolate(frame, [DURACAO - 20, DURACAO], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Superficie />
      <Sequence from={FUNDO_DO_MAR} layout="none">
        <AbsoluteFill style={{ opacity: mergulho }}>
          <FundoDoMar />
        </AbsoluteFill>
      </Sequence>

      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)",
        }}
      />
      <AbsoluteFill style={{ backgroundColor: "white", opacity: flash }} />

      <Sequence durationInFrames={90}>
        <Titulo />
      </Sequence>
      {CENAS.map((cena) => (
        <Sequence
          key={cena.inicio}
          from={cena.inicio}
          durationInFrames={cena.fim - cena.inicio}
        >
          <Legenda cena={cena} />
        </Sequence>
      ))}

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: 8,
          width: `${(frame / DURACAO) * 100}%`,
          backgroundColor: "#FFD23F",
        }}
      />
      <AbsoluteFill style={{ backgroundColor: "black", opacity: fim }} />

      <Html5Audio src={staticFile("naufragio/ambiente.wav")} />
    </AbsoluteFill>
  );
};
