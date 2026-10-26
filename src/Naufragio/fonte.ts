import {
  cancelRender,
  continueRender,
  delayRender,
  staticFile,
} from "remotion";

// A TheBoldFont do template não tem ã, õ, ç, â, ê, í, à...
// então este vídeo usa a Inter Display (licença OFL).
export const FonteTitulo = "InterDisplayBlack";
export const FonteTexto = "InterDisplayMedium";

let carregada = false;

export const carregarFontes = () => {
  if (carregada) {
    return;
  }

  carregada = true;
  const handle = delayRender("Carregando fontes");

  const fontes = [
    new FontFace(
      FonteTitulo,
      `url('${staticFile("naufragio/InterDisplay-Black.otf")}') format('opentype')`,
    ),
    new FontFace(
      FonteTexto,
      `url('${staticFile("naufragio/InterDisplay-Medium.otf")}') format('opentype')`,
    ),
  ];

  Promise.all(fontes.map((f) => f.load()))
    .then((carregadas) => {
      carregadas.forEach((f) => document.fonts.add(f));
      continueRender(handle);
    })
    .catch((err) => cancelRender(err));
};
