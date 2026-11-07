"""A ANIMAÇÃO DA CÉLULA DE ZYGARDE (pedido do CAIO, nov/2026), em cima da BASE
DELE (dev/captures/celula_base.png, acabada por tools/celula/melhora.py):
  1. ESCORREGA de onde está pro lado (inclinando, o pé vai na frente)
  2. PULA (amassa, estica subindo, cai, amassa)
  3. fica TODA BRANCA
  4. JUNTA PONTINHOS VERDES (vêm de fora e grudam nela)
  5. EXPLODE (vira pontinhos voando pra fora)
  6. e VOLTA PRO INÍCIO (os pontinhos voltam e ela se monta de novo)
Cada quadro é o desenho dele MEXIDO um pouco (fileiras deslocadas, tiradas ou
repetidas — nada borrado). Sai:
  assets/sprites/pokemon/31050.png e back/31050.png (parado)
  assets/sprites/pokemon/anim/31050.png e anim/back/31050.png + quadros.json
  assets/sprites/pokemon/andar/31050.png + andar.json"""
import json, os, math, random
from PIL import Image
R = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..")
P = f"{R}/assets/sprites/pokemon"
base = Image.open(f"{R}/tools/celula/base_acabada.png").convert("RGBA")
bx0, by0, bx1, by1 = base.getbbox()
B = base.crop((bx0, by0, bx1, by1))          # só a célula
BW, BH = B.size
E = 2                                        # no quadro de 96 ela fica em dobro (cada pixel dela = 2x2)
CHAO = 96 - 10                               # onde fica o pé dela no quadro

def linhas(img):
    return [[img.getpixel((x, y)) for x in range(img.width)] for y in range(img.height)]
def de_linhas(L):
    w = max(len(r) for r in L); im = Image.new("RGBA", (w, len(L)), (0, 0, 0, 0))
    for y, r in enumerate(L):
        for x, c in enumerate(r): im.putpixel((x, y), c)
    return im
BL = linhas(B)

def inclina(L, k):
    """escorregando: cada fileira anda pro lado; a de baixo anda mais (o pé vai na frente)"""
    n = len(L); pad = abs(k) + 1
    out = []
    for y, r in enumerate(L):
        d = round(k * (y / (n - 1)))
        vazio = [(0, 0, 0, 0)]
        out.append(vazio * (pad + d) + r + vazio * (pad - d))
    return out
# amassa e estica na BARRIGA (embaixo dos olhos): assim nunca corta olho nem núcleo
def _largura(r): return sum(1 for c in r if c[3])
def _faixas(L):
    n = len(L)
    # a BARRIGA: as fileiras entre o fim dos olhos e o pé (sem branco nem vermelho nelas)
    limpa = [i for i in range(n // 2, n - 2) if not any(c[3] and (c[0] > 200 and c[1] > 200 and c[2] > 200 or c[0] > 120 and c[1] < 90) for c in L[i])]
    return (limpa[:2] + limpa[-4:] + limpa)[:6]
def amassa(L, n):       # tira n fileiras (fica baixinha)
    tira = set(_faixas(L)[:n])
    return [r for i, r in enumerate(L) if i not in tira]
def estica(L, n):       # repete n fileiras (fica alta)
    rep = set(_faixas(L)[:n]); out = []
    for i, r in enumerate(L):
        out.append(r)
        if i in rep: out.append(r)
    return out
def branca(L, k=1.0):   # fica BRANCA (o contorno fica)
    out = []
    for r in L:
        nr = []
        for c in r:
            if c[3] and sum(c[:3]) > 120:
                nr.append(tuple(round(c[i] + (255 - c[i]) * k) for i in range(3)) + (255,))
            else: nr.append(c)
        out.append(nr)
    return out

def quadro(L, dx=0, dy=0, pontos=(), sobra=1.0, giro=0):
    """o quadro de 96: a célula (em dobro) com o pé no chão, deslocada (dx, dy), e os pontinhos.
    `giro`: a CAMBALHOTA do pulo (90, 180, 270 graus — girar de 90 em 90 não borra pixel)"""
    c = Image.new("RGBA", (96, 96), (0, 0, 0, 0))
    if L is not None:
        g = de_linhas(L)
        if giro: g = g.rotate(giro, expand=True)
        g = g.resize((g.width * E, g.height * E), Image.NEAREST)
        c.alpha_composite(g, (48 - g.width // 2 + dx, CHAO - g.height - dy))
    for (x, y, cor) in pontos:
        x, y = round(x), round(y)
        for (a, b) in ((0, 0), (1, 0), (2, 0), (0, 1), (1, 1), (2, 1), (0, 2), (1, 2), (2, 2)):   # pontinho de 3x3
            if 0 <= x + a < 96 and 0 <= y + b < 96: c.putpixel((x + a, y + b), cor)
    return c

random.seed(718)
VERDES = [(128, 200, 40, 255), (80, 144, 24, 255), (60, 120, 20, 255), (176, 232, 72, 255)]
CX, CY = 48, CHAO - BH * E // 2
# os pontinhos: cada um tem um lugar NA célula (de onde ele sai quando ela explode)
corpo = [(x, y) for y in range(BH) for x in range(BW) if BL[y][x][3] and sum(BL[y][x][:3]) > 120]
alvo = [(48 - BW * E // 2 + x * E, CHAO - BH * E + y * E) for x, y in random.sample(corpo, 40)]
fora = [(CX + math.cos(a) * r, CY + math.sin(a) * r) for a, r in ((random.random() * 6.28, 44 + random.random() * 14) for _ in alvo)]
cores = [random.choice(VERDES) for _ in alvo]
mix = lambda a, b, t: (a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t)

Q = []   # (quadro da frente, ms)
# 0. parada, respirando
Q += [(quadro(BL), 300), (quadro(estica(BL, 1)), 160), (quadro(BL), 200)]
# 1. ESCORREGA pro lado (e volta inclinando) 
for k, dx in ((2, 2), (4, 6), (5, 11), (4, 15), (2, 17), (0, 18)): Q.append((quadro(inclina(BL, -k), dx=dx), 70))
# 2. PULA
# (o "RABINHO" é a pontinha de cima do desenho: EM PÉ é com ele pra baixo, pedido do CAIO)
# EM PÉ: o desenho DO CAIO com o rabinho pra baixo (tools/celula/melhora.py --empe)
_e = Image.open(f"{R}/tools/celula/empe.png").convert("RGBA")
EMPE = linhas(_e.crop(_e.getbbox()))
Q += [(quadro(amassa(BL, 1), dx=18), 90), (quadro(amassa(BL, 2), dx=18), 80), (quadro(estica(BL, 2), dx=17, dy=6), 70),
      # (a CABEÇA não gira: no alto do pulo só o CORPO passa pra baixo dela)
      (quadro(BL, dx=16, dy=16), 80), (quadro(estica(BL, 1), dx=15, dy=22), 80), (quadro(EMPE, dx=15, dy=22), 90), (quadro(EMPE, dx=14, dy=20), 70),
      # e CAI EM PÉ, com o rabinho pra baixo, dobrando um tiquinho
      (quadro(EMPE, dx=13, dy=12), 60), (quadro(EMPE, dx=12, dy=5), 60), (quadro(EMPE, dx=12, dy=1), 60),
      (quadro(amassa(EMPE, 1), dx=12), 90), (quadro(EMPE, dx=12), 140)]
# 3. FICA TODA BRANCA
for k in (0.35, 0.7, 1.0): Q.append((quadro(branca(EMPE, k), dx=12), 70))
Q.append((quadro(branca(EMPE), dx=12), 160))
# 4. JUNTA PONTINHOS VERDES (vêm de fora e grudam nela, que fica verde de novo devagar)
for i, t in enumerate((0, 0.2, 0.4, 0.6, 0.8, 0.95)):
    pts = [(*mix((f[0] + 12, f[1]), (a[0] + 12, a[1]), t), c) for f, a, c in zip(fora, alvo, cores)]
    Q.append((quadro(branca(EMPE, 1 - t * 0.5), dx=12, pontos=pts), 80))
# 5. EXPLODE: um clarão e os pontinhos voando pra longe
Q.append((quadro(branca(EMPE), dx=12, pontos=[]), 60))
for t in (0.25, 0.55, 0.85, 1.15, 1.5):
    pts = [(*mix((a[0] + 12, a[1]), (f[0] + 12 + (f[0] - CX) * 0.4, f[1] + (f[1] - CY) * 0.4), t), c) for f, a, c in zip(fora, alvo, cores)]
    Q.append((quadro(None, pontos=pts), 70))
Q.append((quadro(None), 220))
# 6. VOLTA PRO INÍCIO: os pontinhos voltam pro meio e ela se monta onde estava no começo
for t in (0.2, 0.45, 0.7, 0.9):
    pts = [(*mix((f[0], f[1]), (a[0], a[1]), t), c) for f, a, c in zip(fora, alvo, cores)]
    Q.append((quadro(None if t < 0.9 else branca(BL, 0.6), pontos=pts), 80))
Q += [(quadro(amassa(BL, 2)), 90), (quadro(BL), 200)]

frente = [q for q, _ in Q]; ms = [t for _, t in Q]
# de COSTAS: a mesma animação, só com o verde (sem olho e sem núcleo)
def costas_img(im):
    o = im.copy(); p = o.load()
    for y in range(o.height):
        for x in range(o.width):
            c = p[x, y]
            if c[3] and (c[0] > 200 and c[1] < 120 or c[0] > 230 and c[1] > 230 and c[2] > 200 and c[2] > c[1] - 20 or c[0] > 120 and c[1] < 40):
                p[x, y] = (128, 200, 40, 255)
    return o
COL = 8
def folha(qs, dest):
    lin = (len(qs) + COL - 1) // COL
    f = Image.new("RGBA", (96 * COL, 96 * lin), (0, 0, 0, 0))
    for i, q in enumerate(qs): f.alpha_composite(q, ((i % COL) * 96, (i // COL) * 96))
    f.save(dest)
folha(frente, f"{P}/anim/31050.png")
folha([costas_img(q) for q in frente], f"{P}/anim/back/31050.png")
frente[0].save(f"{P}/31050.png"); costas_img(frente[0]).save(f"{P}/back/31050.png")
qj = f"{P}/anim/quadros.json"; d = json.load(open(qj))
d["31050"] = {"f": [96, 96, COL, ms], "c": [96, 96, COL, ms]}
json.dump(d, open(qj, "w"), separators=(",", ":"), sort_keys=True)

# ANDANDO no mapa: a célula dele em tamanho natural, quicando (4 quadros), nas 4 direções
FW, FH = BW + 4, BH + 6
fa = Image.new("RGBA", (FW * 4, FH * 4), (0, 0, 0, 0))
passos = [amassa(BL, 2), BL, estica(BL, 2), BL]
for linha in range(4):
    for i, L in enumerate(passos):
        q = de_linhas(L)
        if linha == 1: q = costas_img(q)
        if linha == 2: q = q.transpose(Image.FLIP_LEFT_RIGHT)
        fa.alpha_composite(q, (i * FW + (FW - q.width) // 2, linha * FH + FH - q.height - 1 - (2 if i == 2 else 0)))
fa.save(f"{P}/andar/31050.png")
aj = f"{P}/andar/andar.json"; d = json.load(open(aj)); d["31050"] = [FW, FH, 4, [140, 140, 140, 140]]
json.dump(d, open(aj, "w"), separators=(",", ":"), sort_keys=True)
print("ok", len(Q), "quadros", sum(ms), "ms")
