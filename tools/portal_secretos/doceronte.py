#!/usr/bin/env python3
"""DOCERONTE (nº 1109, FADA/NORMAL) — o secreto de 2 runas DOCE + 2 FRUIT. Um
RINOCERONTE DE DOCE, de lado (virado pra esquerda): o corpo cor-de-rosa de
marshmallow, a CASCA das costas listrada como bala de goma, o CHIFRE é um
PIRULITO de espiral (no palitinho branco), a orelhinha, as patas de bala e o
rabinho de PAPEL DE BALA torcido.

O corpo (as manchas grandes) é a soma de três ovais; o resto — o pirulito, o
olho, a orelha, as patas, o rabo — é grade pixel por pixel.
    python3 tools/portal_secretos/doceronte.py
"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from comum import Quadro, salvar

DEX = 1109

PIRULITO = [        # a espiral de bala (C rosa forte, W branco, A amarelo)
    "..CCCCC..",
    ".CWWWWWC.",
    "CWCCCCCWC",
    "CWCAAACWC",
    "CWCAWACWC",
    "CWCAACCWC",
    "CWWCCCWWC",
    ".CWWWWWC.",
    "..CCCCC..",
]
PALITO = [          # o palitinho saindo do focinho e subindo pra frente, até o pirulito
    "ww....",
    ".ww...",
    "..ww..",
    "...ww.",
    "....ww",
    ".....w",
]
CHIFRINHO = [       # o chifre pequeno de trás: uma bala de milho (amarelo, laranja, branco)
    "..W.",
    ".WW.",
    ".AA.",
    "AAAA",
    "OOOO",
]
OLHO = [
    "kkk",
    "kek",
    "kkk",
]
ORELHA = [
    "..P.",
    ".PPP",
    "PPpP",
    "PPP.",
]
PATA = [            # a pata grossa, com a "unha" de bala listrada
    "PPPPPP",
    "PPPPPP",
    "PPPPPP",
    "PPPPPP",
    "PPPPPP",
    "PPPPPP",
    "PPPPPP",
    "cCcCcC",
    "CcCcCc",
]
RABO = [            # o papel de bala torcido
    "....AA",
    "AA.AAA",
    "AAAAA.",
    "AA.AAA",
    "....AA",
]


def corpo(q):
    # o corpão, a cabeça baixa e o focinho comprido pra frente
    ovais = [(56, 48, 21, 13), (31, 50, 11, 9.5), (20, 54, 8, 6)]
    for y in range(96):
        for x in range(96):
            if any(((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1 for cx, cy, rx, ry in ovais):
                if x > 38 and y < 44:
                    # a CASCA: listras de bala na diagonal
                    q.px[(x, y)] = "S" if ((x + y) // 3) % 2 else "s"
                elif y > 54:
                    q.px[(x, y)] = "b"          # a barriga, mais clara
                else:
                    q.px[(x, y)] = "P"


def montar():
    q = Quadro()
    # as patas de trás (mais escuras) atrás do corpo
    q.por([l.replace("P", "Q") for l in PATA], 63, 56)
    q.por([l.replace("P", "Q") for l in PATA], 41, 56)
    corpo(q)
    q.por(PATA, 69, 57)
    q.por(PATA, 47, 57)
    q.por(PALITO, 10, 43)  # de (10,43) até o focinho em (15,48)
    q.por(PIRULITO, 3, 35)
    q.por(CHIFRINHO, 22, 41)
    q.por(OLHO, 28, 47)
    q.por(ORELHA, 34, 38)
    q.por(RABO, 76, 42)
    # a narina e o sorriso
    q.por(["k.", ".k"], 14, 53)
    q.por(["k...k", ".kkk."], 17, 56)
    return q


NORMAL = {
    "k": (60, 20, 40), "P": (248, 170, 200), "p": (255, 210, 228), "Q": (214, 130, 166), "b": (255, 220, 236),
    "S": (240, 96, 150), "s": (255, 236, 244), "C": (240, 70, 130), "W": (255, 255, 255), "A": (250, 210, 70),
    "w": (250, 250, 250), "c": (120, 210, 240), "e": (255, 255, 255), "q": (180, 100, 136), "O": (240, 140, 50),
}
LUZ = {"P": "p"}
SOMBRA = {"P": "Q", "Q": "q", "b": "P"}
# SHINY: de chocolate com menta (corpo marrom, casca verde-menta)
SHINY = dict(NORMAL, **{"P": (150, 96, 60), "p": (190, 136, 96), "Q": (110, 68, 40), "q": (80, 48, 28),
                        "b": (200, 150, 110), "S": (110, 220, 170), "s": (230, 255, 240), "C": (110, 220, 170)})


def main():
    q = montar()
    salvar(DEX, q.imagem(NORMAL, luz=LUZ, sombra=SOMBRA), q.imagem(SHINY, luz=LUZ, sombra=SOMBRA), "doceronte")
    print("ok")


if __name__ == "__main__":
    main()
