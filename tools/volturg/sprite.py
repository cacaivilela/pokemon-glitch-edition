#!/usr/bin/env python3
"""VOLTURG, VOLTABUM e GHOTOLT: os desenhos são do CAIO (dev/pixelart.html ->
dev/captures/brag_<nome>.png).
Aqui ele só ganha o contorno escuro dos sprites de Braglitch, e o SHINY sai
trocando as cores: o laranja vira AZUL e o amarelo continua (pedido dele).
As linhas verdes do casco são VINHAS; o raio preto-esverdeado é a RACHADURA.

    python3 tools/volturg/sprite.py
"""
import os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
# nome do desenho -> número do sprite
QUEM = {"volturg": 1101, "voltabum": 1102, "ghotolt": 1103}

# o shiny: cada laranja do desenho -> um azul do mesmo claro/escuro
SHINY = {
    (232, 139, 36): (64, 112, 214),    # o corpo
    (255, 115, 0): (92, 156, 248),     # a cabeça e a flor do para-raios
    (245, 110, 0): (92, 156, 248),     # VOLTABUM: a cabeça e o fogo do pavio
    (219, 106, 0): (70, 130, 230),
    (73, 14, 78): (36, 64, 168),       # GHOTOLT: o espírito roxo vira azul
}


def contorno(im):
    """cada pixel vazio encostado no desenho vira a cor do vizinho, bem escura"""
    out = im.copy()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            if im.getpixel((x, y))[3]:
                continue
            for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nx, ny = x + dx, y + dy
                if 0 <= nx < w and 0 <= ny < h and im.getpixel((nx, ny))[3]:
                    r, g, b, _ = im.getpixel((nx, ny))
                    out.putpixel((x, y), (int(r * 0.3), int(g * 0.3), int(b * 0.3), 255))
                    break
    return out


def shiny(im):
    out = im.copy()
    for y in range(im.height):
        for x in range(im.width):
            p = im.getpixel((x, y))
            if p[3] and p[:3] in SHINY:
                out.putpixel((x, y), SHINY[p[:3]] + (255,))
    return out


# O GHOTOLT: a casca do desenho, com o MESMO formato, mas escura como pedra de
# túmulo (pedido do CAIO: "mais escura e parecida com um túmulo", depois "menos
# lápide, mais casco"). Luz na borda esquerda, sombra na direita, a saia de
# baixo um tom mais escura, e uma cruz pequena gravada. A rachadura, o espírito
# e a auréola ficam como ele desenhou.
AMARELO = (225, 194, 55)
PEDRA, PEDRA_LUZ, PEDRA_SOMBRA, GRAVADO = (92, 94, 102), (124, 126, 134), (64, 66, 74), (44, 46, 52)
SAIA = 56                            # dessa linha pra baixo, a saia da casca


def tumulo(im):
    out = im.copy()
    w = im.width
    cheio = lambda x, y: 0 <= x < w and im.getpixel((x, y))[3] and im.getpixel((x, y))[:3] == AMARELO
    for y in range(im.height):
        for x in range(w):
            if not cheio(x, y):
                continue
            borda_esq = not cheio(x - 1, y) or not cheio(x - 2, y)
            borda_dir = not cheio(x + 1, y) or not cheio(x + 2, y)
            cor = PEDRA_LUZ if borda_esq else PEDRA_SOMBRA if borda_dir else PEDRA
            if y >= SAIA and cor == PEDRA:
                cor = PEDRA_SOMBRA if (x + y) % 4 else PEDRA
            out.putpixel((x, y), cor + (255,))
    # a cruz gravada, no lado sem rachadura
    for y in range(26, 35):
        out.putpixel((56, y), GRAVADO + (255,))
    for x in range(54, 59):
        out.putpixel((x, 28), GRAVADO + (255,))
    return out


if __name__ == "__main__":
    prev = Image.new("RGBA", (200, 100 * len(QUEM)), (200, 220, 200, 255))
    for k, (nome, dex) in enumerate(QUEM.items()):
        base = Image.open(os.path.join(ROOT, "dev", "captures", f"brag_{nome}.png")).convert("RGBA")
        if nome == "ghotolt":
            base = tumulo(base)
        comum, brilho = contorno(base), contorno(shiny(base))
        comum.save(os.path.join(ROOT, "assets", "sprites", "pokemon", f"{dex}.png"))
        brilho.save(os.path.join(ROOT, "assets", "sprites", "pokemon", "shiny", f"{dex}.png"))
        prev.alpha_composite(comum, (2, 2 + 100 * k)); prev.alpha_composite(brilho, (102, 2 + 100 * k))
    prev.resize((prev.width * 4, prev.height * 4), Image.NEAREST).save("/tmp/volturg_prev.png")
    print("ok")
