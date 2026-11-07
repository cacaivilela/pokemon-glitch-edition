#!/usr/bin/env python3
"""A EVOLUÇÃO DO BEBBIDAH (nome provisório: BEBBIDÃO), desenhada no estilo do
desenho do CAIO (dev/captures/novo_brag_base.png): traço preto fino, cor chapada.

O BEBBIDAH é uma caneca; o BEBBIDÃO é uma JARRA: bico do lado esquerdo, alça
do lado direito, e a bebida dentro é o corpo dele. O rosto é o mesmo da caneca:
UM olho grande com a pupila em pé e o sorrisão embaixo.

    python3 tools/bebbidah/evolucao.py   -> dev/captures/bebbidao_rascunho.png
"""
import os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

COR = {
    "k": (8, 8, 8, 255),          # traço
    "w": (236, 244, 250, 255),    # vidro
    "g": (196, 214, 228, 255),    # vidro de dentro (o fundo da jarra)
    "b": (86, 139, 220, 255),     # a bebida (a mesma água do desenho dele)
    "l": (140, 184, 240, 255),    # a superfície da bebida
    "e": (250, 250, 250, 255),    # brilho do olho
    "p": (226, 98, 120, 255),     # língua
    "m": (40, 20, 40, 255),       # dentro da boca
    "i": (214, 240, 255, 255),    # gelo
    "I": (160, 210, 240, 255),    # gelo, lado da sombra
    "f": (236, 236, 236, 200),    # fumaça
}

# ---------------------------------------------------------------- a jarra
# meia jarra (lado esquerdo até o meio, coluna 47); o lado direito é o espelho.
# cada linha é desenhada a partir da coluna 14 do sprite.
MEIA = """
.................................
.................................
....kkkkkkkkkkkkkkkkkkkkkkkkkkkkkk
...kwwwwwwwwwwwwwwwwwwwwwwwwwwwwww
...kwwkkkkkkkkkkkkkkkkkkkkkkkkkkkk
....kwkgggggggggggggggggggggggggggg
....kwkgggggggggggggggggggggggggggg
.....kwkggggggggggggggggggggggggggg
......kwkgggggggggggggggggggggggggg
......kwkgggggggggggggggggggggggggg
.......kwgggggggggggggggggggggggggg
.......kwgggggggggggggggggggggggggg
.......kwwggggggggggggggggggggggggg
.......kwwggggggggggggggggggggggggg
........kwgggggggggggggggggggggggggg
........kwggggggggggggggggggggggggg
........kwkkkkgggggggggggggggkkkkkkk
........kwkllkkkkgggggggkkkkklllllll
........kwkllllllkkkkkkkklllllllllll
.......kwwkbllllllllllllllllllllllll
.......kwwkbbbbbllllllllllllllllllll
......kwwkbbbbbbbbbbbbbbbbbbbbbbbbbb
......kwwkbbbbbbbbbbbbbbbbbbbbbbbbbb
.....kwwkbbbbbbbbbbbbbbbbbbbbbbbbbbb
.....kwwkbbbbbbbbbbbbbbbbbbbbbbbbbbb
....kwwkbbbbbbbbbbbbbbbbbbbbbbbbbbbb
....kwwkbbbbbbbbbbbbbbbbbbbbbbbbbbbb
...kwwkbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
...kwwkbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
..kwwkbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
..kwwkbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
..kwwkbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
.kwwkbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
.kwwkbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
.kwwkbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
.kwwkbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
.kwwkbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
.kwwkbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
.kwwkbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
.kwwkbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
.kwwkbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
.kwwkbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
.kwwkbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
.kwwkbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
.kwwkbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
..kwwkbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
..kwwkbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
..kwwkbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
...kwwkbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
...kwwkbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
....kwwkbbbbbbbbbbbbbbbbbbbbbbbbbbbb
....kwwkbbbbbbbbbbbbbbbbbbbbbbbbbbbb
.....kwwkbbbbbbbbbbbbbbbbbbbbbbbbbbb
.....kwwkbbbbbbbbbbbbbbbbbbbbbbbbbbb
......kwwkkbbbbbbbbbbbbbbbbbbbbbbbbb
.......kwwwkkkbbbbbbbbbbbbbbbbbbbbbb
........kkwwwwkkkkkkbbbbbbbbbbbbbbbb
..........kkwwwwwwwwkkkkkkkkkkkkkkkk
............kkkwwwwwwwwwwwwwwwwwwwww
...............kkkkkkkkkkkkkkkkkkkkk
"""

# o bico: por cima da beirada esquerda (coluna 6 do sprite, linha 12)
BICO = """
......kkkk
....kkwwww
..kkwwkkkk
.kwwkk....
kwkk......
kk........
"""

# a alça: do lado direito (coluna 76, linha 22)
ALCA = """
kkkkkkk.....
wwwwwwwkk...
kkkkkkwwwk..
......kkwwk.
........kwwk
.........kwk
.........kwk
.........kwk
.........kwk
.........kwk
.........kwk
.........kwk
.........kwk
.........kwk
.........kwk
.........kwk
.........kwk
.........kwk
........kwwk
.......kwwk.
......kwwk..
kkkkkkwwk...
wwwwwwwk....
kkkkkkk.....
"""

# o olho: o mesmo da caneca, maior (coluna 39, linha 37)
OLHO = """
.....kkkkk.....
...kkeeeeekk...
..keeeeeeeeek..
.keeeekkkeeeek.
.keeekkkkkeeek.
keeeekkkkkeeeek
keeeekkekkeeeek
keeeekkkkkeeeek
keeeekkkkkeeeek
keeeekkkkkeeeek
keeeekkkkkeeeek
keeeekkkkkeeeek
.keeekkkkkeeek.
.keeeekkkeeeek.
..keeeeeeeeek..
...kkeeeeekk...
.....kkkkk.....
"""

# o sorrisão de canto a canto (coluna 29, linha 58)
BOCA = """
kk..............................kk
.kk............................kk.
..kkk........................kkk..
...kmkkk..................kkkmk...
....kmmmkkkkk........kkkkkmmmk....
.....kmmmmmmmkkkkkkkkmmmmmmmk.....
......kkmmmmmmmmmmmmmmmmmmkk......
........kkmmmmmppppmmmmmkk........
..........kkkmpppppppmkkk.........
.............kkkkkkkkk............
"""

# GELADO: cubos de gelo boiando na superfície (colunas 22 e 54, linha 26)
GELO = """
..kkkkkkkk..
.kiiiiiiiik.
kiiiiiiiiIk.
kiiiiiiiiIk.
kiiiiiiiiIk.
kiiiiiiiiIk.
kIIIIIIIIIk.
.kkkkkkkkk..
"""

# QUENTE: fumacinha subindo da boca da jarra (colunas 26, 40 e 54, linha 0)
FUMACA = """
...ff..
..ff...
..ff...
...ff..
....ff.
....ff.
...ff..
..ff...
..ff...
...ff..
"""


def grade(txt):
    return [l for l in txt.strip("\n").split("\n")]


def carimbar(im, txt, x0, y0, espelho=False):
    for dy, linha in enumerate(grade(txt)):
        if espelho:
            linha = linha[::-1]
        for dx, ch in enumerate(linha):
            if ch != ".":
                im.putpixel((x0 + dx, y0 + dy), COR[ch])


def jarra(temp=None, rosto=True):
    im = Image.new("RGBA", (96, 96), (0, 0, 0, 0))
    meio = 47
    for dy, linha in enumerate(grade(MEIA)):
        y = 22 + dy
        for dx, ch in enumerate(linha):
            x = 14 + dx
            if ch == "." or x > meio:
                continue
            im.putpixel((x, y), COR[ch])
            im.putpixel((2 * meio + 1 - x, y), COR[ch])
    carimbar(im, BICO, 9, 24)
    carimbar(im, ALCA, 78, 43)
    if rosto:
        carimbar(im, OLHO, 41, 44)
        carimbar(im, BOCA, 31, 63)
    if temp == "gelado":
        carimbar(im, GELO, 24, 35)
        carimbar(im, GELO, 58, 36, espelho=True)
    if temp == "quente":
        for x in (30, 45, 60):
            carimbar(im, FUMACA, x, 8)
    return im


if __name__ == "__main__":
    out = Image.new("RGBA", (96 * 3, 96), (40, 40, 52, 255))
    for i, t in enumerate((None, "gelado", "quente")):
        out.alpha_composite(jarra(t), (96 * i, 0))
    caminho = os.path.join(ROOT, "dev/captures/bebbidao_rascunho.png")
    out.resize((96 * 3 * 4, 96 * 4), Image.NEAREST).save(caminho)
    print(caminho)
