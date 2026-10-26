import wave, math, random, struct, array
from pathlib import Path
SR = 44100
DUR = 60
N = SR * DUR
buf = array.array("d", [0.0]) * N
random.seed(3)

def pluck(t0, freq, dur, vol):
    # Karplus-Strong (som de ukulele)
    period = int(SR / freq)
    ring = [random.uniform(-1, 1) for _ in range(period)]
    i0 = int(t0 * SR)
    n = int(dur * SR)
    idx = 0
    for i in range(n):
        j = i0 + i
        if j >= N: break
        a = ring[idx]; b = ring[(idx + 1) % period]
        ring[idx] = 0.996 * 0.5 * (a + b)
        buf[j] += a * vol
        idx = (idx + 1) % period

def tone(t0, freq, dur, vol, decay=4.0):
    i0 = int(t0 * SR)
    for i in range(int(dur * SR)):
        j = i0 + i
        if j >= N: break
        t = i / SR
        env = min(1, t / 0.005) * math.exp(-t * decay)
        buf[j] += (math.sin(2*math.pi*freq*t) + 0.25*math.sin(2*math.pi*freq*3*t)) * env * vol

def nota(n):  # semitons a partir de C4
    return 261.63 * 2 ** (n / 12)

# Progressão C - Am - F - G, 100 bpm
beat = 0.6
acordes = [[0,4,7],[ -3,0,4],[ -7,-3,0],[ -5,-1,2]]
melodia = [12,16,19,16, 9,12,16,12, 5,9,12,9, 7,11,14,11]
k = 0
t = 0.0
while t < DUR - 1:
    ac = acordes[(k // 4) % 4]
    if k % 2 == 0:
        for n in ac:
            pluck(t, nota(n), 1.2, 0.10)
        pluck(t, nota(ac[0] - 12), 1.2, 0.16)
    tone(t, nota(melodia[k % 16]), 0.5, 0.06, 6)
    k += 1
    t = k * beat

def chime(t0):
    for i, n in enumerate([24, 28, 31, 36]):
        tone(t0 + i * 0.07, nota(n), 0.9, 0.12, 5)

def pop(t0):
    i0 = int(t0 * SR)
    for i in range(int(0.12 * SR)):
        t = i / SR
        f = 300 + 900 * t / 0.12
        buf[i0 + i] += math.sin(2*math.pi*f*t) * (1 - t/0.12) * 0.25

for c in range(5):
    chime((312 + 240 * c) / 30)
for c in range(5):
    pop((1520 + 22 * c) / 30)
for i, n in enumerate([12, 16, 19, 24, 28]):
    tone(1650 / 30 + i * 0.1, nota(n), 1.2, 0.14, 3)

for i in range(SR * 2):
    buf[N - 1 - i] *= i / (SR * 2)
peak = max(abs(x) for x in buf)
sc = 0.85 / peak
with wave.open(str(Path(__file__).resolve().parents[2] / "public" / "girafinha" / "musica.wav"), "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes(array.array("h", (int(x * sc * 32767) for x in buf)).tobytes())
