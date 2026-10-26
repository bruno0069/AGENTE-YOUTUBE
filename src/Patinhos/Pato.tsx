import React from "react";

// Origem (0,0) = linha d'água, no centro do corpo. O pato olha para a direita.
export const Pato: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly escala?: number;
  readonly inclinar?: number;
  readonly espelhar?: boolean;
}> = ({ x, y, escala = 1, inclinar = 0, espelhar = false }) => {
  return (
    <g
      transform={`translate(${x}, ${y}) rotate(${inclinar}) scale(${espelhar ? -escala : escala}, ${escala})`}
    >
      {/* rabinho */}
      <path d="M-80,-60 L-135,-105 L-100,-30 Z" fill="#F5C000" />
      {/* corpo */}
      <ellipse cx={0} cy={-45} rx={92} ry={62} fill="#FFD93B" />
      {/* asinha */}
      <ellipse
        cx={-14}
        cy={-40}
        rx={46}
        ry={28}
        fill="#F5C000"
        transform="rotate(-18 -14 -40)"
      />
      {/* cabeça */}
      <circle cx={58} cy={-125} r={50} fill="#FFD93B" />
      {/* bico */}
      <ellipse cx={108} cy={-112} rx={32} ry={16} fill="#FF8A1F" />
      <path
        d="M80,-112 Q108,-106 138,-112"
        stroke="#C85F00"
        strokeWidth={3}
        fill="none"
      />
      {/* olho */}
      <circle cx={70} cy={-137} r={10} fill="#1b1b2f" />
      <circle cx={73} cy={-140} r={3.5} fill="#fff" />
      {/* bochecha */}
      <circle cx={84} cy={-105} r={11} fill="#FF9AA8" opacity={0.7} />
      {/* topete */}
      <path d="M52,-172 Q48,-198 66,-190 Q60,-182 64,-170 Z" fill="#FFD93B" />
    </g>
  );
};
