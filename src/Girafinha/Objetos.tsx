import React from "react";
import { useCurrentFrame } from "remotion";

// Todos centrados em (0,0), com ~300px de tamanho
const CONTORNO = "#4A2C12";

export const Maca: React.FC = () => (
  <g>
    <path
      d="M0,-90 C60,-140 150,-90 140,10 C130,110 60,150 0,120 C-60,150 -130,110 -140,10 C-150,-90 -60,-140 0,-90 Z"
      fill="#E63946"
      stroke={CONTORNO}
      strokeWidth={6}
    />
    <path
      d="M0,-90 C-4,-120 4,-140 14,-160"
      stroke={CONTORNO}
      strokeWidth={10}
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M14,-130 C40,-170 90,-160 100,-140 C70,-110 30,-110 14,-130 Z"
      fill="#2BA84A"
      stroke={CONTORNO}
      strokeWidth={5}
    />
    <ellipse
      cx={-70}
      cy={-30}
      rx={22}
      ry={40}
      fill="#fff"
      opacity={0.45}
      transform="rotate(20 -70 -30)"
    />
  </g>
);

export const Sol: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <g>
      <g transform={`rotate(${frame * 1.2})`}>
        {new Array(12).fill(true).map((_, i) => (
          <path
            key={i}
            d="M-16,-120 L0,-165 L16,-120 Z"
            fill="#FFC300"
            stroke={CONTORNO}
            strokeWidth={4}
            transform={`rotate(${i * 30})`}
          />
        ))}
      </g>
      <circle r={110} fill="#FFC300" stroke={CONTORNO} strokeWidth={6} />
      <circle cx={-36} cy={-18} r={11} fill={CONTORNO} />
      <circle cx={36} cy={-18} r={11} fill={CONTORNO} />
      <path
        d="M-40,28 Q0,66 40,28"
        stroke={CONTORNO}
        strokeWidth={8}
        fill="none"
        strokeLinecap="round"
      />
      <ellipse cx={-62} cy={18} rx={16} ry={10} fill="#ff8fa3" opacity={0.6} />
      <ellipse cx={62} cy={18} rx={16} ry={10} fill="#ff8fa3" opacity={0.6} />
    </g>
  );
};

export const Folha: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <g transform={`rotate(${-30 + Math.sin(frame / 10) * 8})`}>
      <path
        d="M0,150 C-120,60 -110,-90 0,-150 C110,-90 120,60 0,150 Z"
        fill="#2BA84A"
        stroke={CONTORNO}
        strokeWidth={6}
      />
      <path
        d="M0,170 L0,-120"
        stroke="#1d7a35"
        strokeWidth={8}
        strokeLinecap="round"
      />
      {[-60, -10, 40].map((y) => (
        <g key={y}>
          <path
            d={`M0,${y + 30} L-55,${y - 10}`}
            stroke="#1d7a35"
            strokeWidth={6}
            strokeLinecap="round"
          />
          <path
            d={`M0,${y + 30} L55,${y - 10}`}
            stroke="#1d7a35"
            strokeWidth={6}
            strokeLinecap="round"
          />
        </g>
      ))}
    </g>
  );
};

export const Borboleta: React.FC = () => {
  const frame = useCurrentFrame();
  const bater = 0.35 + Math.abs(Math.sin(frame / 3)) * 0.65;
  return (
    <g
      transform={`translate(${Math.sin(frame / 18) * 40}, ${Math.sin(frame / 11) * 30})`}
    >
      {[1, -1].map((lado) => (
        <g key={lado} transform={`scale(${lado * bater}, 1)`}>
          <path
            d="M0,-10 C40,-150 160,-130 140,-40 C130,0 60,10 0,0 Z"
            fill="#8E44AD"
            stroke={CONTORNO}
            strokeWidth={5}
          />
          <path
            d="M0,5 C50,10 120,30 100,95 C80,140 20,100 0,20 Z"
            fill="#B072D1"
            stroke={CONTORNO}
            strokeWidth={5}
          />
          <circle cx={85} cy={-70} r={18} fill="#fff" opacity={0.7} />
        </g>
      ))}
      <ellipse rx={14} ry={70} fill={CONTORNO} />
      <path
        d="M-4,-66 Q-30,-120 -44,-118 M4,-66 Q30,-120 44,-118"
        stroke={CONTORNO}
        strokeWidth={5}
        fill="none"
      />
    </g>
  );
};

export const Coracao: React.FC = () => {
  const frame = useCurrentFrame();
  const s = 1 + Math.sin(frame / 5) * 0.06;
  return (
    <path
      transform={`scale(${s})`}
      d="M0,120 C-150,20 -150,-120 -60,-120 C-20,-120 0,-90 0,-70 C0,-90 20,-120 60,-120 C150,-120 150,20 0,120 Z"
      fill="#1E7FA6"
      stroke={CONTORNO}
      strokeWidth={6}
    />
  );
};
