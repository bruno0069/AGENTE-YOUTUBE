import wave, math, random, struct
from pathlib import Path
SR = 44100
DUR = 30
N = SR * DUR
buf = [0.0] * N
random.seed(7)

def add(t0, dur, fn, vol):
    i0 = int(t0 * SR)
    for i in range(int(dur * SR)):
        j = i0 + i
        if j >= N: break
        buf[j] += fn(i / SR, dur) * vol

def note(freq):
    def f(t, d):
        env = min(1, t / 0.01) * math.exp(-t * 5)
        tri = 2 / math.pi * math.asin(math.sin(2 * math.pi * freq * t))
        return (tri + 0.3 * math.sin(2 * math.pi * freq * 2 * t)) * env
    return f

def bass(freq):
    def f(t, d):
        env = min(1, t / 0.01) * math.exp(-t * 3)
        return math.sin(2 * math.pi * freq * t) * env
    return f

def quack(t, d):
    freq = 650 - 330 * (t / d)
    env = min(1, t / 0.01) * (1 - t / d)
    ph = (freq * t) % 1.0
    sq = 1.0 if ph < 0.5 else -1.0
    return sq * env * 0.6 + 0.2 * math.sin(2 * math.pi * freq * 2.01 * t) * env

C5, D5, E5, G5, A5, C6 = 523.25, 587.33, 659.25, 783.99, 880.0, 1046.5
C3, F3, G3, A3 = 130.81, 174.61, 196.0, 220.0
melody = [C5,E5,G5,E5, A5,G5,E5,D5, C5,E5,G5,C6, A5,G5,E5,D5]
bassl = [C3, C3, F3, G3]
beat = 0.25
for k in range(int(DUR / beat)):
    t = k * beat
    add(t, 0.35, note(melody[k % len(melody)]), 0.22)
    if k % 4 == 0:
        add(t, 0.9, bass(bassl[(k // 4) % 4]), 0.3)

# quacks: pato k cai no frame 90+100k+10; recap a partir do frame 590, a cada 28 frames
for k in range(5):
    add((90 + 100 * k + 10) / 30, 0.18, quack, 0.45)
for k in range(5):
    add((590 + 28 * k + 6) / 30, 0.18, quack, 0.45)
# fanfarra final no frame 750
for i, fq in enumerate([C5, E5, G5, C6]):
    add(25 + i * 0.12, 0.6, note(fq), 0.35)

fade = SR
for i in range(fade):
    buf[N - 1 - i] *= i / fade
peak = max(abs(x) for x in buf)
sc = 0.85 / peak
with wave.open(str(Path(__file__).resolve().parents[2] / "public" / "patinhos" / "musica.wav"), "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes(b"".join(struct.pack("<h", int(x * sc * 32767)) for x in buf))
