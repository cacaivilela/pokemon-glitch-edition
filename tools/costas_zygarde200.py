#!/usr/bin/env python3
"""As COSTAS do ZYGARDE 200%, tiradas da base do CAIO (tools/zygarde200_base.png):
o mesmo corpo visto de trás. Some o que é da frente — a BOCA azul do peito, o
NÚCLEO branco dentro dela, as PRESAS e os OLHOS das pontas da crista viram
corpo — e o desenho vira de lado (de trás, a capa azul fica na direita e a
vermelha na esquerda). Nas costas entra uma fileira de CÉLULAS verdes descendo
pela espinha. Depois o mesmo acabamento de sombra da frente.

    python3 tools/costas_zygarde200.py    # grava assets/sprites/pokemon/back/zygarde200.png
"""
import os
import sys
from PIL import Image

AQUI = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(AQUI)
sys.path.insert(0, AQUI)
from acabar_zygarde200 import acabar  # noqa: E402

PRETO = (5, 5, 5, 255)
AZUL, BRANCO, VERMELHO = (0x3e, 0x51, 0xa8), (0xfe, 0xfe, 0xfe), (0xec, 0x48, 0x4d)
# a fileira de células da espinha: cada uma uma grade (h claro, G médio, g escuro)
CELULA = [".hh.", "hGGh", "hGgh", ".gg."]
VERDES = {"h": (0xaf, 0xcf, 0x4f, 255), "G": (0x7f, 0x9f, 0x1f, 255), "g": (0x4f, 0x7f, 0x1f, 255)}


def costas(src, dest_base):
    im = Image.open(src).convert("RGBA")
    p = im.load()
    for y in range(im.height):
        for x in range(im.width):
            c = p[x, y][:3]
            if p[x, y][3] < 128:
                continue
            # a boca e o núcleo (o azul e o branco do peito), as presas e os olhos
            if (c == AZUL and y <= 50) or (c == BRANCO and 20 <= y <= 45) or (c in (VERMELHO, BRANCO) and y <= 14):
                p[x, y] = PRETO
            if c == (0x56, 0x8b, 0xdc) and y <= 50:
                p[x, y] = PRETO
    im = im.transpose(Image.FLIP_LEFT_RIGHT)
    p = im.load()
    for k, y in enumerate((24, 31, 38, 45, 52)):
        for j, linha in enumerate(CELULA):
            for i, ch in enumerate(linha):
                if ch != ".":
                    p[46 + i, y + j] = VERDES[ch]
    im.save(dest_base)
    return im


if __name__ == "__main__":
    base = os.path.join(ROOT, "tools", "zygarde200_costas_base.png")
    costas(os.path.join(ROOT, "tools", "zygarde200_base.png"), base)
    dest = os.path.join(ROOT, "assets", "sprites", "pokemon", "back", "zygarde200.png")
    acabar(base, dest)
    print(dest)
