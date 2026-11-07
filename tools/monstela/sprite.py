#!/usr/bin/env python3
"""MONSTELA: o desenho é do CAIO (dev/criar-brag.html -> dev/captures/brag_novo.png).

A cabeça é uma TV — rosto de pontinhos azuis na tela, os botões coloridos do
lado — em cima de um corpo preto com mãos amarelas de garra.

O desenho é quase todo PRETO, e é por isso que o acabamento aqui não é o do
VOLTURG (contorno escuro em volta): num bicho preto, contorno preto some. O que
falta é VOLUME. Então o preto dele vira o CONTORNO, e o miolo ganha um preto
arroxeado com luz em cima/esquerda e sombra embaixo/direita — a luz de todo
sprite de batalha. A TELA vira um vidro azul quase preto, com moldura, linhas de
TV e um reflexo, e cada pontinho do rosto acende no meio. Forma e cores dele não
mudam: nenhum pixel aparece onde ele não desenhou.

O SHINY é o que ele pediu: rosto branco, e tudo que era preto fica azul-claro.

    python3 tools/monstela/sprite.py
"""
import os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
ORIGEM = os.path.join(ROOT, "dev", "captures", "brag_novo.png")
DEX = 1104

PRETO = (8, 8, 8)
AZUL_ROSTO = (86, 139, 220)
AMARELO = (249, 240, 107)
VERDE_SUPORTE = (216, 236, 138)

# a TELA: o retângulo de dentro da cabeça (a moldura fica de fora; os botões,
# que ele pôs na moldura da direita, também)
TELA = (25, 12, 67, 34)          # x0, y0, x1, y1, os dois incluídos

NORMAL = {
    "contorno": PRETO,
    "corpo": (34, 32, 44), "luz": (60, 57, 76), "sombra": (21, 20, 28),
    "tela": (10, 22, 40), "linha": (15, 31, 54), "reflexo": (44, 74, 116), "moldura": PRETO,
    "rosto": AZUL_ROSTO, "rosto_meio": (176, 210, 255),
}
SHINY = {
    "contorno": (34, 70, 120),
    "corpo": (122, 182, 232), "luz": (172, 216, 250), "sombra": (84, 138, 200),
    "tela": (98, 160, 222), "linha": (110, 172, 232), "reflexo": (190, 226, 255), "moldura": (34, 70, 120),
    "rosto": (250, 250, 250), "rosto_meio": (255, 255, 255),
}


def mistura(c, alvo, k):
    return tuple(round(a + (b - a) * k) for a, b in zip(c, alvo))


def acabamento(im, pal):
    w, h = im.size
    src = im.load()
    out = im.copy()
    o = out.load()
    cheio = lambda x, y: 0 <= x < w and 0 <= y < h and src[x, y][3] > 0
    na_tela = lambda x, y: TELA[0] <= x <= TELA[2] and TELA[1] <= y <= TELA[3]
    vazio_perto = lambda x, y, dx, dy, n: any(not cheio(x + dx * k, y + dy * k) for k in range(1, n + 1))

    for y in range(h):
        for x in range(w):
            p = src[x, y]
            if not p[3]:
                continue
            cor = p[:3]

            if cor == PRETO:
                if na_tela(x, y):
                    borda = x in (TELA[0], TELA[2]) or y in (TELA[1], TELA[3])
                    if borda:
                        o[x, y] = pal["moldura"] + (255,)
                    elif (x - TELA[0]) + (y - TELA[1]) in (3, 4, 5) and y < TELA[1] + 5:
                        o[x, y] = pal["reflexo"] + (255,)      # o brilho no vidro, canto de cima
                    else:
                        o[x, y] = (pal["linha"] if y % 2 else pal["tela"]) + (255,)
                    continue
                # o corpo e a moldura da TV
                if any(not cheio(x + dx, y + dy) for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))):
                    o[x, y] = pal["contorno"] + (255,)
                elif vazio_perto(x, y, -1, 0, 2) or vazio_perto(x, y, 0, -1, 2):
                    o[x, y] = pal["luz"] + (255,)
                elif vazio_perto(x, y, 1, 0, 3) or vazio_perto(x, y, 0, 1, 3):
                    o[x, y] = pal["sombra"] + (255,)
                else:
                    o[x, y] = pal["corpo"] + (255,)

            elif cor == AZUL_ROSTO:
                # cada pontinho do rosto é um bloco 3x3: o do meio acende
                meio = all(cheio(x + dx, y + dy) and src[x + dx, y + dy][:3] == AZUL_ROSTO
                           for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)))
                o[x, y] = (pal["rosto_meio"] if meio else pal["rosto"]) + (255,)

            elif cor == AMARELO:
                # as garras: luz em cima, sombra embaixo (do próprio amarelo dele)
                if not cheio(x, y - 1) or src[x, y - 1][:3] != AMARELO:
                    o[x, y] = mistura(AMARELO, (255, 255, 230), 0.55) + (255,)
                elif not cheio(x, y + 1) or not cheio(x, y + 2):
                    o[x, y] = mistura(AMARELO, (150, 110, 20), 0.45) + (255,)

            elif cor == VERDE_SUPORTE:
                if not cheio(x, y + 1) or src[x, y + 1][:3] != VERDE_SUPORTE:
                    o[x, y] = mistura(VERDE_SUPORTE, (60, 90, 30), 0.35) + (255,)

            else:
                # os BOTÕES da TV (3x3): um ponto de luz no canto de cima
                if src[x - 1, y][:3] != cor and src[x, y - 1][:3] != cor:
                    o[x, y] = mistura(cor, (255, 255, 255), 0.45) + (255,)
    return out


if __name__ == "__main__":
    base = Image.open(ORIGEM).convert("RGBA")
    comum = acabamento(base, NORMAL)
    brilho = acabamento(base, SHINY)
    comum.save(os.path.join(ROOT, "assets", "sprites", "pokemon", f"{DEX}.png"))
    os.makedirs(os.path.join(ROOT, "assets", "sprites", "pokemon", "shiny"), exist_ok=True)
    brilho.save(os.path.join(ROOT, "assets", "sprites", "pokemon", "shiny", f"{DEX}.png"))
    # a prévia: o desenho dele, o acabamento e o shiny, lado a lado
    prev = Image.new("RGBA", (96 * 3 + 16, 96), (52, 56, 66, 255))
    for i, im in enumerate((base, comum, brilho)):
        prev.alpha_composite(im, (i * 104, 0))
    prev.resize((prev.width * 3, prev.height * 3), Image.NEAREST).save(os.environ.get("PREVIA", "/tmp/monstela_prev.png"))
    print(f"MONSTELA -> assets/sprites/pokemon/{DEX}.png (+ shiny)")
