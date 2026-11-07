#!/usr/bin/env python3
"""O CARDUME DE MAGIKARP: a BASE é do CAIO (dev/pixelart.html ->
dev/captures/cardume_magikarp_base.png): o MAGIKARP gigante e monstruoso, de
coroa enorme e barbatanas em ponta. Aqui ele vira FEITO DE MAGIKARPS:

- a forma e as cores dele não mudam; ganha contorno e volume (luz em cima,
  sombra embaixo), com os tons do próprio MAGIKARP;
- o corpo vermelho é coberto de MINI MAGIKARPS (a grade MINI, desenhada
  pixel por pixel), em fileiras tortas como escamas, cada fileira de um tom;
- nas partes largas das barbatanas amarelas, mini magikarps amarelos;
- e na beirada alguns escapam pra fora — o cardume nunca fica todo junto.

    python3 tools/cardumes/magikarp.py   # -> assets/sprites/pokemon/cardume/magikarp.png
"""
import os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
BASE = os.path.join(ROOT, "dev", "captures", "cardume_magikarp_base.png")
SAIDA = os.path.join(ROOT, "assets", "sprites", "pokemon", "cardume", "magikarp.png")

VERMELHO = (236, 72, 77)
AMARELO = (224, 168, 32)
CONTORNO = (74, 16, 26)

# o MINI MAGIKARP, virado pra esquerda como o grandão (8x6). k contorno,
# R corpo, L luz, w olho, y coroa/barbatana, t rabo
MINI = [
    "...yy....",
    ".kkkkkk.k",
    "kwLLRRRkt",
    "kRRRRRRRk",
    "kRRRRRRkt",
    ".kkRRkk.k",
    "..y..y...",
]
# as letras que precisam ficar DENTRO do corpo (coroa, rabo e bigode podem
# passar da beirada: o contorno abraça eles depois)
CORPO_MINI = set("kRLw")


def mistura(a, b, k):
    return tuple(round(a[i] + (b[i] - a[i]) * k) for i in range(3))


def main():
    base = Image.open(BASE).convert("RGBA")
    W, H = base.size
    src = base.load()
    out = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    o = out.load()
    cor = lambda x, y: src[x, y][:3] if 0 <= x < W and 0 <= y < H and src[x, y][3] else None
    eh = lambda x, y, c: cor(x, y) == c

    # 1) VOLUME: cada pixel ganha luz ou sombra pela distância até a beirada de
    #    cima e de baixo da própria parte (vermelho ou amarelo)
    for y in range(H):
        for x in range(W):
            c = cor(x, y)
            if not c:
                continue
            if c in (VERMELHO, AMARELO):
                cima = next((k for k in range(1, 6) if cor(x, y - k) != c), 6)
                baixo = next((k for k in range(1, 6) if cor(x, y + k) != c), 6)
                if cima <= 1:
                    c = mistura(c, (255, 255, 255), 0.28)
                elif baixo <= 1:
                    c = mistura(c, (40, 0, 10), 0.35)
                elif baixo <= 3:
                    c = mistura(c, (40, 0, 10), 0.18)
            o[x, y] = c + (255,)

    # 2) OS MINI MAGIKARPS no corpo: fileiras tortas, cada uma num tom
    def cabe(x0, y0, dentro, so_corpo=False):
        for j, linha in enumerate(MINI):
            for i, ch in enumerate(linha):
                if ch == "." or (so_corpo and ch not in CORPO_MINI):
                    continue
                if not dentro(x0 + i, y0 + j):
                    return False
        return True

    def carimba(x0, y0, pal):
        for j, linha in enumerate(MINI):
            for i, ch in enumerate(linha):
                if ch != "." and 0 <= x0 + i < W and 0 <= y0 + j < H:
                    o[x0 + i, y0 + j] = pal[ch] + (255,)

    tons_corpo = [
        {"k": (138, 26, 36), "R": (250, 112, 84), "L": (255, 176, 140), "w": (255, 255, 255), "y": (240, 196, 64), "t": (200, 52, 60)},
        {"k": (120, 20, 32), "R": (232, 92, 72), "L": (252, 150, 120), "w": (255, 255, 255), "y": (230, 180, 50), "t": (180, 40, 52)},
    ]
    olho = lambda x, y: cor(x, y) in ((254, 254, 254), (106, 232, 255), (86, 139, 220))
    perto_do_olho = lambda x, y: any(olho(x + i, y + j) for i in range(-2, 3) for j in range(-2, 3))
    no_corpo = lambda x, y: eh(x, y, VERMELHO) and not perto_do_olho(x, y)
    # ESCAMAS: fileiras de 4 em 4 pixels, cada uma deslocada meio peixe — um
    # peixe encosta no outro e cobre o de trás, como escama de verdade
    fileira = 0
    for y0 in range(-2, H - 4, 4):
        desloca = 0 if fileira % 2 == 0 else 4
        for x0 in range(-8 + desloca, W - 4, 8):
            if cabe(x0, y0, no_corpo, so_corpo=True):
                carimba(x0, y0, tons_corpo[fileira % 2])
        fileira += 1

    # 3) NAS BARBATANAS AMARELAS, mini magikarps amarelos onde couber
    tons_fin = {"k": (130, 84, 10), "R": (248, 206, 80), "L": (255, 236, 150), "w": (255, 255, 255), "y": (236, 72, 77), "t": (190, 130, 20)}
    na_fin = lambda x, y: eh(x, y, AMARELO)
    for y0 in range(-2, H - 4, 4):
        for x0 in range(-8 + (4 if (y0 // 4) % 2 else 0), W - 4, 8):
            if cabe(x0, y0, na_fin, so_corpo=True):
                carimba(x0, y0, tons_fin)

    # 4) CONTORNO em volta de tudo
    cheio = lambda x, y: 0 <= x < W and 0 <= y < H and o[x, y][3] > 0
    borda = [(x, y) for y in range(H) for x in range(W)
             if not cheio(x, y) and any(cheio(x + i, y + j) for i, j in ((1, 0), (-1, 0), (0, 1), (0, -1)))]
    for x, y in borda:
        o[x, y] = CONTORNO + (255,)

    # 5) OS QUE ESCAPAM: mini magikarps soltos perto da beirada (do rabo e das
    #    costas), sem encostar no corpo
    livre = lambda x, y: 0 <= x < W and 0 <= y < H and not any(
        0 <= x + i < W and 0 <= y + j < H and o[x + i, y + j][3] > 0 for i in range(-1, 2) for j in range(-1, 2))
    soltos = 0
    for x0, y0 in [(86, 20), (87, 40), (84, 58), (60, 18), (74, 8), (30, 72), (50, 70), (70, 66), (6, 22), (16, 10)]:
        if x0 + 9 <= W and y0 + 7 <= H and cabe(x0, y0, livre):
            carimba(x0, y0, tons_corpo[soltos % 2])
            soltos += 1

    os.makedirs(os.path.dirname(SAIDA), exist_ok=True)
    out.save(SAIDA)
    prev = Image.new("RGBA", (W * 2, H), (236, 240, 244, 255))
    prev.alpha_composite(base, (0, 0)); prev.alpha_composite(out, (W, 0))
    prev.resize((W * 2 * 4, H * 4), Image.NEAREST).save(os.environ.get("PREVIA", "/tmp/cardume_magikarp.png"))
    print("ok", SAIDA, "soltos:", soltos)


if __name__ == "__main__":
    main()
