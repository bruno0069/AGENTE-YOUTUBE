export const FPS = 30;
export const DURACAO = 30 * FPS;

// Momentos-chave da animação (em frames)
export const COLISAO = 420;
export const LUZES_APAGAM = 700;
export const SUBMERSO = 740;
export const FUNDO_DO_MAR = 765;

export type Cena = {
  inicio: number;
  fim: number;
  data: string;
  // Palavras entre *asteriscos* aparecem destacadas
  texto: string;
};

export const CENAS: Cena[] = [
  {
    inicio: 90,
    fim: 225,
    data: "10 ABR 1912",
    texto: "O maior navio do mundo parte da Inglaterra rumo a Nova York.",
  },
  {
    inicio: 225,
    fim: 360,
    data: "A BORDO",
    texto: "Chamado de *“inafundável”*, ele leva cerca de *2.200* pessoas.",
  },
  {
    inicio: 360,
    fim: 495,
    data: "14 ABR · 23H40",
    texto: "No Atlântico Norte, o Titanic colide com um *iceberg.*",
  },
  {
    inicio: 495,
    fim: 630,
    data: "15 ABR · MADRUGADA",
    texto: "A água invade o casco. Só há botes para *metade* das pessoas.",
  },
  {
    inicio: 630,
    fim: 765,
    data: "15 ABR · 02H20",
    texto: "O Titanic afunda. Mais de *1.500* pessoas morrem.",
  },
  {
    inicio: 765,
    fim: DURACAO,
    data: "1985",
    texto: "Os destroços são encontrados a *3.800 metros* de profundidade.",
  },
];
