"""Acaba a BASE DO CAIO (dev/captures/celula_base.png, desenhada em
dev/pixelart.html): o desenho dele fica, só ganha luz e sombra, pixel por pixel:
  - o verde: luz em cima/à esquerda (perto do contorno), sombra embaixo/à direita
  - o brilho: uns pixels bem claros no alto da cabeça
  - o NÚCLEO: vermelho escuro embaixo/à direita, rosa no canto de cima
  - o contorno preto vira marrom-escuro (como o da célula de verdade)
Sai tools/celula/base_acabada.png (o 1º quadro da animação)."""
import os
from PIL import Image
R = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..")
import sys
EMPE = "--empe" in sys.argv
im = Image.open(f"{R}/dev/captures/celula_base.png").convert("RGBA")
# EM PÉ (o CAIO: "em pé é com o rabinho pra baixo"; "usa como base o meu"): o
# desenho DELE de cabeça pra baixo (espelhado de cima pra baixo, o olho grande
# continua na direita) — a luz é pintada depois, então continua vindo de cima
if EMPE:
    # (a CABEÇA não gira junto com o corpo — o CAIO): a cabeça é a parte de baixo
    # do desenho (a grande, com os olhos), e o corpo é a de cima (o núcleo e o
    # rabinho). Em pé: a cabeça fica igualzinha, em cima, e o corpo vira de
    # ponta-cabeça e vai pra baixo dela, com o rabinho pra baixo.
    bb = im.getbbox(); x0, y0, x1, y1 = bb
    larg = lambda y: sum(1 for x in range(im.width) if im.getpixel((x, y))[3])
    # o pescoço: a fileira mais fina LOGO ABAIXO do núcleo (o vermelho fica todo no corpo)
    fim_nucleo = max(y for y in range(im.height) for x in range(im.width) if im.getpixel((x, y))[:3] == (224, 40, 40) and im.getpixel((x, y))[3])
    pesc = min(range(fim_nucleo + 1, fim_nucleo + 6), key=larg)
    corpo = im.crop((0, y0, im.width, pesc + 1)).transpose(Image.FLIP_TOP_BOTTOM)
    cabeca = im.crop((0, pesc, im.width, y1))
    # mais 4 fileiras de testa em cima dos olhos (a fileira do pescoço repetida), pra o olho não encostar no alto
    testa = cabeca.crop((0, 0, cabeca.width, 1))
    alta = Image.new("RGBA", (cabeca.width, cabeca.height + 4), (0, 0, 0, 0))
    for k in range(4): alta.alpha_composite(testa, (0, k))
    alta.alpha_composite(cabeca, (0, 4)); cabeca = alta
    # o ALTO da cabeça fica REDONDO: as primeiras fileiras copiam a largura das
    # últimas (o fundo da cabeça, que já é redondo no desenho dele), de trás pra frente
    cq = cabeca.load(); CW, CH = cabeca.size
    def faixa(y):
        xs = [x for x in range(CW) if cq[x, y][3]]
        return (min(xs), max(xs)) if xs else None
    meio_cabeca = CH // 2
    for k in range(0, min(8, CH // 3)):
        alvo = faixa(CH - 1 - k - 2)          # (pula a pontinha do fundo)
        if not alvo: continue
        a, b = alvo
        for x in range(CW):
            if cq[x, k][3] and not (a <= x <= b): cq[x, k] = (0, 0, 0, 0)
    # a pontinha de baixo da cabeça some (ali agora gruda o corpo)
    novo = Image.new("RGBA", im.size, (0, 0, 0, 0))
    novo.alpha_composite(cabeca, (0, 2))
    novo.alpha_composite(corpo, (0, 2 + cabeca.height - 4))
    im = novo.crop((0, 0, im.width, im.height))
    # fecha o contorno onde cortou: pixel do desenho encostado no vazio vira contorno preto
    q = im.load(); Wn, Hn = im.size
    beira = [(x, y) for y in range(Hn) for x in range(Wn) if q[x, y][3] and q[x, y][:3] != (8, 8, 8)
             and any(not (0 <= x + dx < Wn and 0 <= y + dy < Hn) or not q[x + dx, y + dy][3] for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)))]
    for x, y in beira: q[x, y] = (8, 8, 8, 255)
    # e tira os risquinhos soltos (contorno com quase nada do desenho em volta)
    for _ in range(2):
        for y in range(Hn):
            for x in range(Wn):
                if q[x, y][:3] == (8, 8, 8) and q[x, y][3]:
                    viz = sum(1 for dx in (-1, 0, 1) for dy in (-1, 0, 1) if (dx or dy) and 0 <= x + dx < Wn and 0 <= y + dy < Hn and q[x + dx, y + dy][3] and q[x + dx, y + dy][:3] != (8, 8, 8))
                    if viz == 0: q[x, y] = (0, 0, 0, 0)
p = im.load(); W, H = im.size
VERDE, PRETO, VERM, BRANCO = (128, 200, 40), (8, 8, 8), (224, 40, 40), (250, 250, 240)
LUZ, SOMBRA, BRILHO = (176, 232, 72), (80, 144, 24), (232, 255, 176)
VESC, ROSA, CONT = (140, 16, 24), (255, 170, 160), (40, 28, 12)
cor = lambda x, y: p[x, y][:3] if 0 <= x < W and 0 <= y < H and p[x, y][3] else None
orig = {(x, y): cor(x, y) for y in range(H) for x in range(W)}
o = lambda x, y: orig.get((x, y))
for y in range(H):
    for x in range(W):
        c = o(x, y)
        if c == VERDE:
            # o contorno de fora fica a 1-2 pixels: em cima/esquerda é luz, embaixo/direita é sombra
            if o(x - 1, y) == PRETO or o(x, y - 1) == PRETO or o(x - 2, y) == PRETO and o(x, y - 1) != VERDE: p[x, y] = LUZ + (255,)
            if o(x + 1, y) == PRETO or o(x, y + 1) == PRETO or o(x + 2, y) == PRETO or o(x, y + 2) == PRETO: p[x, y] = SOMBRA + (255,)
        elif c == VERM:
            if o(x + 1, y) != VERM or o(x, y + 1) != VERM: p[x, y] = VESC + (255,)
        elif c == PRETO:
            p[x, y] = CONT + (255,)
# o brilho do núcleo: o canto de cima-esquerda dele
vs = [(x, y) for (x, y), c in orig.items() if c == VERM]
if vs:
    y0 = min(y for _, y in vs)
    for k, yy in enumerate((y0 + 1, y0 + 2)):        # 2 fileiras de cima: os 2 primeiros da esquerda
        linha = sorted(x for x, y in vs if y == yy)
        for x in linha[1:3 - k]: p[x, yy] = ROSA + (255,)
# o brilho do corpo: 3 pixels no alto, à esquerda do núcleo
vd = [(x, y) for (x, y), c in orig.items() if c == VERDE]
topo = min(y for _, y in vd) + 3
alvos = sorted([(x, y) for x, y in vd if y in (topo, topo + 1)], key=lambda q: q[0])[:2]
for q in alvos: p[q] = BRILHO + (255,)
im.save(f"{R}/tools/celula/" + ("empe.png" if EMPE else "base_acabada.png"))
print("ok", im.getbbox())
