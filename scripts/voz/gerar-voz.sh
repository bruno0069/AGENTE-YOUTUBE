#!/usr/bin/env bash
# Gera narração em português com o Piper (TTS local, open source).
#
# Uso:
#   scripts/voz/gerar-voz.sh "Texto a ser falado" saida.wav
#   echo "Texto" | scripts/voz/gerar-voz.sh - saida.wav
#
# Variáveis opcionais:
#   VOZ=caminho/para/modelo.onnx   usa outra voz (ex.: pt_BR-faber-medium.onnx,
#                                  baixada do HuggingFace na sua máquina)
#   VELOCIDADE=1.0                 >1 fala mais devagar, <1 mais rápido
#
# Na primeira execução instala o piper-tts (PyPI) em .cache/piper-venv e baixa
# a voz pt-br-edresson-low (GitHub, licença CC BY 4.0) em .cache/vozes.
set -euo pipefail

if [ $# -lt 2 ]; then
  sed -n '2,13p' "$0"
  exit 1
fi

TEXTO="$1"
SAIDA="$2"
RAIZ="$(cd "$(dirname "$0")/../.." && pwd)"
CACHE="$RAIZ/.cache"
VENV="$CACHE/piper-venv"
VOZES="$CACHE/vozes"
VOZ_PADRAO="$VOZES/pt-br-edresson-low.onnx"
VOZ="${VOZ:-$VOZ_PADRAO}"
VELOCIDADE="${VELOCIDADE:-1.0}"

if [ ! -x "$VENV/bin/piper" ]; then
  echo "Instalando piper-tts em $VENV..." >&2
  python3 -m venv "$VENV"
  "$VENV/bin/pip" install -q piper-tts
fi

if [ "$VOZ" = "$VOZ_PADRAO" ] && [ ! -f "$VOZ_PADRAO" ]; then
  echo "Baixando voz pt-br-edresson-low..." >&2
  mkdir -p "$VOZES"
  TMP="$(mktemp -d)"
  curl -sSL -o "$TMP/voz.tgz" \
    https://github.com/rhasspy/piper/releases/download/v0.0.2/voice-pt-br-edresson-low.tar.gz
  tar -xzf "$TMP/voz.tgz" -C "$VOZES"
  rm -rf "$TMP"
fi

if [ "$TEXTO" = "-" ]; then
  TEXTO="$(cat)"
fi

mkdir -p "$(dirname "$SAIDA")"
printf '%s\n' "$TEXTO" | "$VENV/bin/piper" -m "$VOZ" -f "$SAIDA" --length-scale "$VELOCIDADE" 2>/dev/null
echo "$SAIDA"
