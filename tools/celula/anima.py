"""A CÉLULA DE ZYGARDE animada (pedido do CAIO, nov/2026: "faz assim só que com
núcleo vermelho e mais frames"). A base é tools/celula/base.txt, pixel por
pixel; os outros quadros saem dela sem borrar (fileiras tiradas ou repetidas):
  amassa (tira fileiras de cima) -> normal -> estica (repete fileiras do meio),
  o núcleo pulsando (o brilho rosa acende e apaga) e uma piscada.
Sai:
  assets/sprites/pokemon/31050.png e back/31050.png   (parado, 2x, num quadro de 96)
  assets/sprites/pokemon/anim/31050.png e anim/back/31050.png + quadros.json
  assets/sprites/pokemon/andar/31050.png + andar.json (pequena, quicando)"""
import json, os
from PIL import Image
R = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..")
BASE = [l.rstrip("\n") for l in open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "base.txt")) if l.strip()]
C = {'k': (58, 40, 16), 'H': (232, 255, 176), 'L': (176, 232, 72), 'M': (128, 200, 40), 'D': (80, 144, 24),
     'W': (250, 250, 240), 'g': (96, 176, 40), 'R': (224, 40, 40), 'r': (140, 16, 24), 'P': (255, 170, 160), 'Q': (255, 120, 110)}

def costas(rows):
    """de costas: sem olho e sem núcleo, só o verde com o brilho"""
    out = []
    for r in rows:
        r = "".join("M" if ch in "WgRrPQ" else ch for ch in r)
        out.append(r)
    return [tira_olho(r, y) for y, r in enumerate(out)]

# onde ficam os olhos na base (colunas), pra tirar o contorno deles sem mexer no da beira
OLHOS = [(5, 11), (19, 28)]
def tira_olho(r, y, risco=False):
    if not 14 <= y <= 26: return r
    l = list(r)
    for a, b in OLHOS:
        for x in range(a, b + 1):
            if x < len(l) and l[x] in "kWg": l[x] = "k" if (risco and y == 20 and a + 1 <= x <= b - 1) else "M"
    return "".join(l)

def amassa(rows, n):        # tira `n` fileiras do alto do corpo (a ponta desce)
    tirar = list(range(4, 4 + n))
    return [r for i, r in enumerate(rows) if i not in tirar]
def estica(rows, n):        # repete `n` fileiras do meio (fica mais alta)
    out = []
    for i, r in enumerate(rows):
        out.append(r)
        if 12 <= i < 12 + n: out.append(r)
    return out
def pisca(rows):            # o olho fecha: vira um risquinho
    return [tira_olho(r, y, risco=True) for y, r in enumerate(rows)]
def nucleo(rows, aceso):    # o brilho do núcleo
    return ["".join(("P" if aceso else "Q") if ch == "P" else ch for ch in r) for r in rows]

def img(rows, E=1):
    w = max(map(len, rows)); im = Image.new("RGBA", (w, len(rows)))
    for y, r in enumerate(rows):
        for x, ch in enumerate(r):
            if ch in C: im.putpixel((x, y), C[ch] + (255,))
    return im.resize((w * E, len(rows) * E), Image.NEAREST) if E > 1 else im

def quadro96(rows, E=2):
    c = Image.new("RGBA", (96, 96), (0, 0, 0, 0)); g = img(rows, E)
    c.alpha_composite(g, ((96 - g.width) // 2, 96 - g.height - 14))
    return c

# os quadros (e quanto tempo cada um fica): quica duas vezes, pisca no fim
seq = [(amassa(BASE, 2), 1, 110), (amassa(BASE, 1), 1, 90), (BASE, 0, 90), (estica(BASE, 1), 0, 90), (estica(BASE, 2), 1, 120),
       (estica(BASE, 1), 1, 90), (BASE, 0, 90), (amassa(BASE, 1), 0, 90), (amassa(BASE, 2), 1, 110), (BASE, 1, 140),
       (pisca(BASE), 1, 90), (BASE, 0, 160)]
frente = [quadro96(nucleo(r, a)) for r, a, _ in seq]
tras = [quadro96(costas(r)) for r, a, _ in seq]
ms = [t for _, _, t in seq]

P = f"{R}/assets/sprites/pokemon"
frente[2].save(f"{P}/31050.png"); tras[2].save(f"{P}/back/31050.png")
def folha(qs, dest, col=6):
    lin = (len(qs) + col - 1) // col
    f = Image.new("RGBA", (96 * col, 96 * lin), (0, 0, 0, 0))
    for i, q in enumerate(qs): f.alpha_composite(q, ((i % col) * 96, (i // col) * 96))
    f.save(dest)
folha(frente, f"{P}/anim/31050.png"); folha(tras, f"{P}/anim/back/31050.png")
qj = f"{P}/anim/quadros.json"; d = json.load(open(qj))
d["31050"] = {"f": [96, 96, 6, ms], "c": [96, 96, 6, ms]}
json.dump(d, open(qj, "w"), separators=(",", ":"), sort_keys=True)

# ANDANDO no mapa: a célula pequena (metade, pegando 1 de cada 2 pixels com cuidado: os olhos ficam)
def pequena(rows, olhando=0):
    im = img(rows).resize((17, 17 * len(rows) // 32), Image.NEAREST)
    return im
FW, FH = 20, 22
qs = [amassa(BASE, 2), BASE, estica(BASE, 2), BASE]
fa = Image.new("RGBA", (FW * 4, FH * 4), (0, 0, 0, 0))
for linha in range(4):
    for i, rows in enumerate(qs):
        rr = costas(rows) if linha == 1 else rows
        q = pequena(rr)
        if linha == 2: q = q.transpose(Image.FLIP_LEFT_RIGHT)      # esq: o olho grande vai pro lado de lá
        fa.alpha_composite(q, (i * FW + (FW - q.width) // 2, linha * FH + FH - q.height - 1))
fa.save(f"{P}/andar/31050.png")
aj = f"{P}/andar/andar.json"; d = json.load(open(aj)); d["31050"] = [FW, FH, 4, [150, 150, 150, 150]]
json.dump(d, open(aj, "w"), separators=(",", ":"), sort_keys=True)
print("ok", len(seq), "quadros")
