#!/usr/bin/env python3
"""O ASH, desenhado do zero (o campeão secreto, src/data/ash.js).

O visual clássico de Kanto: boné vermelho com a frente branca e o símbolo
verde, cabelo preto espetado saindo por baixo, colete azul por cima da
camiseta preta, luvas verdes sem dedo, jeans e tênis vermelho e branco.

Duas coisas saem daqui:

  assets/sprites/overworld/ash.png   a folha do mapa: 4 colunas x 3 linhas de
                                     16x32 (baixo, cima, esquerda). Colunas 0 e
                                     2 paradas, 1 e 3 os passos (uma perna à
                                     frente de cada vez).
  assets/sprites/trainers/ash.png    o retrato de batalha, 64x64.

    python3 tools/sprite_ash.py
"""
import os
from PIL import Image

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

PAL = {
    "k": (24, 22, 30), "R": (216, 52, 44), "r": (150, 32, 30), "W": (246, 246, 246),
    "w": (204, 208, 220), "G": (58, 160, 74), "H": (36, 32, 42), "h": (70, 64, 80),
    "S": (242, 186, 140), "s": (200, 138, 98), "E": (24, 22, 30), "B": (46, 96, 210),
    "b": (28, 62, 150), "T": (40, 40, 48), "g": (58, 160, 74), "J": (58, 82, 156),
    "j": (38, 56, 110), "K": (210, 48, 48), "O": (240, 240, 240),
}

# Os quadros, 16 de largura; as linhas começam no topo do quadro de 32 (as
# primeiras ficam vazias). `PE_*` são as pernas, trocadas nos passos.
BAIXO = [
    "....kkkkkk......",
    "...kRRWWRRk.....",
    "..kRRWGGWRRk....",
    "..kRRWWGWRRRk...",
    ".kHrrrrrrrrHk...",
    ".kHkkkkkkkkHHk..",
    "kHHSSSSSSSSHk...",
    ".kHSESSSSESk....",
    "..kSESSSSESk....",
    "..ksSSSkSSsk....",
    "...kssSSssk.....",
    "..kBBkTTkBBk....",
    ".kSBBBTTBBBSk...",
    ".kSkBBTTBBkSk...",
    ".kgkBBTTBBkgk...",
    "..kkJJJJJJkk....",
    "...kJJJjJJk.....",
]
BAIXO_PE = ["...kJJkkJJk.....", "...kJJkkJJk.....", "...kKKkkKKk.....", "...kOOkkOOk....."]
BAIXO_PASSO1 = ["...kJJkkJJk.....", "...kJJk.kJJk....", "...kKKk..kKk....", "...kOOk..kOk...."]
BAIXO_PASSO2 = ["...kJJkkJJk.....", "..kJJk.kJJk.....", "..kKk..kKKk.....", "..kOk..kOOk....."]

CIMA = [
    "....kkkkkk......",
    "...kRRRRRRk.....",
    "..kRRRRRRRRk....",
    "..kRRRRRRRRk....",
    ".kHrrrrrrrrHk...",
    ".kHHHHHHHHHHk...",
    "kHHHhHHHHhHHHk..",
    ".kHHHHHHHHHHk...",
    "..kHHHHHHHHk....",
    "..ksHHHHHHsk....",
    "...ksSSSSsk.....",
    "..kBBBBBBBBk....",
    ".kSBBbbbbBBSk...",
    ".kSkBBBBBBkSk...",
    ".kgkBBBBBBkgk...",
    "..kkJJJJJJkk....",
    "...kJJJjJJk.....",
]
CIMA_PE, CIMA_PASSO1, CIMA_PASSO2 = BAIXO_PE, BAIXO_PASSO1, BAIXO_PASSO2

ESQ = [
    "....kkkkkk......",
    "...kRRRRRRk.....",
    "..kRRRRRWRRk....",
    "..kRRRRRWGRk....",
    "kkrrrrrrrrHk....",
    ".kkkSSSSHHHHk...",
    "..kSSSSSHHHHk...",
    "..kESSSSHHHk....",
    "..kSSSSSSHk.....",
    "..kssSSSShk.....",
    "...kksSSsk......",
    "...kBBBBBBk.....",
    "...kSBBBBBk.....",
    "...kSkBBBBk.....",
    "...kgkBBBBk.....",
    "....kJJJJJk.....",
    "....kJJjJJk.....",
]
ESQ_PE = ["....kJJJJk......", "....kJJJJk......", "....kKKKKk......", "...kOOOOOk......"]
ESQ_PASSO1 = ["....kJJJJk......", "...kJJkkJJk.....", "..kKKk..kKKk....", ".kOOk....kOOk..."]
ESQ_PASSO2 = ["....kJJJJk......", "....kJJJJk......", "...kKKKKKk......", "..kOOOOOOk......"]


def quadro(corpo, pernas, desce=0):
    """um quadro 16x32: o corpo encostado embaixo, com as pernas"""
    linhas = corpo + pernas
    img = Image.new("RGBA", (16, 32), (0, 0, 0, 0))
    topo = 32 - len(linhas) - 1 + desce
    for y, linha in enumerate(linhas):
        for x, c in enumerate(linha[:16]):
            if c in PAL:
                img.putpixel((x, topo + y), PAL[c] + (255,))
    return img


def folha():
    out = Image.new("RGBA", (64, 96), (0, 0, 0, 0))
    linhas = ((BAIXO, BAIXO_PE, BAIXO_PASSO1, BAIXO_PASSO2), (CIMA, CIMA_PE, CIMA_PASSO1, CIMA_PASSO2),
              (ESQ, ESQ_PE, ESQ_PASSO1, ESQ_PASSO2))
    for fil, (corpo, pe, p1, p2) in enumerate(linhas):
        for col, q in enumerate((quadro(corpo, pe), quadro(corpo, p1, 1), quadro(corpo, pe), quadro(corpo, p2, 1))):
            out.paste(q, (col * 16, fil * 32), q)
    return out


def retrato():
    """o retrato de batalha, 64x64: o mesmo Ash, maior e com mais detalhe —
    o quadro de frente ampliado 3x e retocado (brilho no boné e nos olhos)"""
    q = quadro(BAIXO, BAIXO_PE)
    caixa = q.getbbox()
    q = q.crop(caixa)
    grande = q.resize((q.width * 3, q.height * 3), Image.NEAREST)
    out = Image.new("RGBA", (64, 64), (0, 0, 0, 0))
    ox, oy = (64 - grande.width) // 2, 64 - grande.height
    out.paste(grande, (ox, oy), grande)
    return out


def main(previa=None):
    f = folha()
    if previa:
        fundo = Image.new("RGBA", (64 + 72, 96), (90, 140, 90, 255))
        fundo.paste(f, (0, 0), f)
        r = retrato()
        fundo.paste(r, (68, 16), r)
        return fundo.resize((fundo.width * 5, fundo.height * 5), Image.NEAREST).save(previa)
    f.save(os.path.join(RAIZ, "assets", "sprites", "overworld", "ash.png"))
    retrato().save(os.path.join(RAIZ, "assets", "sprites", "trainers", "ash.png"))
    print("ash: folha e retrato gravados")


if __name__ == "__main__":
    import sys
    main(sys.argv[1] if len(sys.argv) > 1 else None)
