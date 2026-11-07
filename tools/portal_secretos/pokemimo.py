#!/usr/bin/env python3
"""POKÉMIMO (nº 1106, NORMAL/AÇO) — o secreto das runas POKÉ + GREAT + ULTRA +
MASTER. Uma POKÉ BOLA VIVA: a tampa de cima é das quatro bolas ao mesmo
tempo (a fatia vermelha da POKÉ, a azul com as duas marcas vermelhas da
GREAT, a preta com o H amarelo da ULTRA e a roxa com o M e as bolinhas
rosa da MASTER), a de baixo é branca, e ela está MEIO ABERTA: no vão, dois
olhos amarelos olhando de dentro. Bracinhos e pezinhos brancos.

    python3 tools/portal_secretos/pokemimo.py
"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from comum import Quadro, salvar

DEX = 1106
R = 24            # o raio da bola
CX, CY = 48, 52   # o meio dela no quadro


def bola(q):
    # a esfera: tampa (4 fatias) em cima, o vão aberto no meio, branco embaixo
    for y in range(96):
        for x in range(96):
            dx, dy = x + 0.5 - CX, y + 0.5 - CY
            if dx * dx + dy * dy > R * R:
                continue
            if -5 <= dy < 3:                       # o VÃO: a bola entreaberta
                q.px[(x, y)] = "i"
            elif dy < -5:                          # a TAMPA, em quatro fatias
                f = int((dx + R) / (2 * R) * 4)
                q.px[(x, y)] = "RBUP"[max(0, min(3, f))]
            else:
                q.px[(x, y)] = "W"
    # a borda escura da tampa e do fundo, encostando no vão
    for x in range(96):
        for y in (CY - 6, CY + 3):
            if (x, y) in q.px:
                q.px[(x, y)] = "k"


# os detalhes, pixel por pixel (coordenadas no quadro)
OLHOS = [          # no vão: dois olhos amarelos acesos, olhando de dentro
    ".YYY......YYY.",
    "YYyYY....YYyYY",
    "YyyYY....YyyYY",
    ".YYY......YYY.",
]
GREAT = [          # as duas marcas vermelhas da GREAT BALL
    "RR..RR",
    ".RR..RR",
    "..RR..RR",
]
ULTRA = [          # o H amarelo da ULTRA BALL
    "Y...Y",
    "Y...Y",
    "YYYYY",
    "Y...Y",
    "Y...Y",
]
MASTER = [         # o M branco e as bolinhas rosa da MASTER BALL
    "pp.....pp",
    "pp.....pp",
    "..W...W..",
    "..WW.WW..",
    "..W.W.W..",
    "..W...W..",
]
BRACO = [
    "..kk",
    ".kWk",
    "kWWk",
    "kWwk",
    ".kk.",
]
PE = [
    ".kkkk.",
    "kwWWwk",
    "kkkkkk",
]
BRILHO = [
    ".HH",
    "HHH",
    "HH.",
]


def montar():
    q = Quadro()
    bola(q)
    q.por(OLHOS, CX - 7, CY - 4)
    q.por(GREAT, CX - 11, CY - 18)
    q.por(ULTRA, CX + 1, CY - 17)
    q.por(MASTER, CX + 11, CY - 16)
    q.por(BRILHO, CX - 18, CY - 18)
    q.por(BRACO, CX - 27, CY + 6)
    q.por([l[::-1] for l in BRACO], CX + 23, CY + 6)
    q.por(PE, CX - 14, CY + 22)
    q.por(PE, CX + 8, CY + 22)
    # o botão do fundo virou o "queixo": um botãozinho embaixo do vão
    q.por([".kkk.", "kwWwk", ".kkk."], CX - 3, CY + 4)
    return q


NORMAL = {
    "k": (26, 22, 34), "R": (226, 58, 58), "B": (58, 112, 220), "U": (40, 40, 48), "P": (128, 70, 196),
    "W": (240, 240, 246), "w": (196, 198, 212), "i": (14, 10, 22), "Y": (255, 214, 60), "y": (255, 250, 200),
    "p": (240, 120, 190), "H": (255, 255, 255),
    "r": (255, 120, 110), "b": (120, 170, 255), "u": (80, 80, 92), "q": (176, 120, 236),
    "R2": (150, 30, 40),
}
LUZ = {"R": "r", "B": "b", "U": "u", "P": "q"}
SOMBRA = {"W": "w"}
# SHINY: a tampa toda dourada (as quatro fatias em tons de ouro) e o fundo preto
SHINY = dict(NORMAL, **{"R": (230, 170, 40), "B": (210, 150, 30), "U": (190, 130, 20), "P": (240, 190, 70),
                        "r": (255, 220, 120), "b": (250, 200, 100), "u": (230, 170, 60), "q": (255, 230, 140),
                        "W": (60, 56, 72), "w": (40, 36, 50)})


def main():
    q = montar()
    salvar(DEX, q.imagem(NORMAL, luz=LUZ, sombra=SOMBRA), q.imagem(SHINY, luz=LUZ, sombra=SOMBRA), "pokemimo")
    print("ok")


if __name__ == "__main__":
    main()
