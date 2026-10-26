import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FonteTexto, FonteTitulo } from "./fonte";
import { Cena } from "./roteiro";

const DESTAQUE = "#FFD23F";

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

const separarPalavras = (texto: string) => {
  let dentro = false;
  return texto.split(" ").map((bruta) => {
    const marcas = (bruta.match(/\*/g) ?? []).length;
    const destaque = dentro || marcas > 0;
    if (marcas % 2 === 1) {
      dentro = !dentro;
    }
    return { palavra: bruta.replace(/\*/g, ""), destaque };
  });
};

// O frame aqui é relativo ao início da cena (via <Sequence>)
export const Legenda: React.FC<{ readonly cena: Cena }> = ({ cena }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const duracao = cena.fim - cena.inicio;

  const palavras = separarPalavras(cena.texto);
  const porPalavra = Math.min(7, (duracao * 0.5) / palavras.length);
  const saida = interpolate(frame, [duracao - 8, duracao], [1, 0], clamp);

  const entradaData = spring({
    frame,
    fps,
    config: { damping: 200 },
    durationInFrames: 12,
  });

  return (
    <AbsoluteFill style={{ opacity: saida }}>
      <div
        style={{
          position: "absolute",
          top: 210,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          opacity: entradaData,
          transform: `translateY(${interpolate(entradaData, [0, 1], [-30, 0])}px)`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            padding: "14px 34px",
            borderRadius: 999,
            backgroundColor: "rgba(0, 0, 0, 0.55)",
            border: "2px solid rgba(255, 255, 255, 0.25)",
            color: "white",
            fontFamily: FonteTexto,
            fontSize: 40,
            letterSpacing: 4,
          }}
        >
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: 8,
              backgroundColor: "#ff3b30",
              opacity: 0.6 + 0.4 * Math.sin(frame / 5),
            }}
          />
          {cena.data}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 1240,
          height: 400,
          left: 70,
          right: 70,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            textAlign: "center",
            fontFamily: FonteTitulo,
            fontSize: 76,
            lineHeight: 1.16,
            textTransform: "uppercase",
            color: "white",
            WebkitTextStroke: "14px black",
            paintOrder: "stroke",
          }}
        >
          {palavras.map(({ palavra, destaque }, i) => {
            const entrada = spring({
              frame: frame - 6 - i * porPalavra,
              fps,
              config: { damping: 14, stiffness: 180 },
              durationInFrames: 10,
            });
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  margin: "0 0.14em",
                  color: destaque ? DESTAQUE : "white",
                  opacity: entrada > 0.01 ? 1 : 0,
                  transform: `scale(${interpolate(entrada, [0, 1], [0.6, 1])})`,
                }}
              >
                {palavra}
              </span>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
