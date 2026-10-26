#!/usr/bin/env bash
# Gera o som ambiente do vídeo do Titanic (oceano + drone + estrondo da colisão aos 14 s)
set -euo pipefail
cd "$(dirname "$0")/../.."
ffmpeg -v error -y \
 -f lavfi -i "anoisesrc=d=30:c=brown:r=48000:a=0.6" \
 -f lavfi -i "sine=f=55:d=30:r=48000" \
 -f lavfi -i "sine=f=82.4:d=30:r=48000" \
 -f lavfi -i "anoisesrc=d=2.5:c=brown:r=48000:a=1" \
 -f lavfi -i "sine=f=38:d=2.5:r=48000" \
 -filter_complex "\
[0]lowpass=f=600,tremolo=f=0.18:d=0.6,volume='if(lt(t,25.5),1,max(0.2,1-(t-25.5)/1.5))':eval=frame[ocean];\
[1][2]amix=inputs=2,volume='0.25*min(1,0.3+t/20)':eval=frame[drone];\
[3]lowpass=f=180[bn];[bn][4]amix=inputs=2,volume=2.2,afade=t=out:st=0.05:d=2.4:curve=exp,adelay=14000:all=1[boom];\
[ocean][drone][boom]amix=inputs=3:normalize=0,afade=t=in:d=1,afade=t=out:st=28.5:d=1.5,alimiter=limit=0.9,aformat=channel_layouts=stereo,atrim=0:30[out]" \
 -map "[out]" -ar 48000 public/naufragio/ambiente.wav
