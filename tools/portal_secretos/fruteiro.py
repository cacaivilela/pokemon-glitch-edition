#!/usr/bin/env python3
"""FRUTEIRO (nº 1107, PLANTA/FADA) — o secreto das quatro runas FRUIT. Uma
ÁRVORE QUE ANDA: a copa redonda e cheia, carregada de BERRIES de cores
diferentes (uma de cada: CHERI, ORAN, PECHA, SITRUS, LUM...), o tronco com o
ROSTO (olhos na casca e um sorriso), dois GALHOS de braço — um oferecendo
uma fruta — e as RAÍZES fazendo de pé.

    python3 tools/portal_secretos/fruteiro.py
"""
import sys, os, math
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from comum import Quadro, salvar

DEX = 1107

TRONCO = [
    "....kkkkkkkkkk....",
    "...kTTTTtTTTTTk...",
    "..kTTtTTTTTTtTTk..",
    "..kTTTTTTTTTTTTk..",
    "..kTkkTTTTTTkkTk..",
    "..kTkekTTTTkekTk..",
    "..kTkkkTTTTkkkTk..",
    "..kTTTTTTTTTTTTk..",
    "..kTtTTkTTkTTTtk..",
    "..kTTTTTkkTTTTTk..",
    "..kTTTTTTTTTTTTk..",
    "..kTTtTTTTTTTtTk..",
    "..kTTTTTTTTTTTTk..",
    ".kTTTTTTTtTTTTTTk.",
    ".kTTTTTTTTTTTTTTk.",
    "kTTkkTTTTTTTTkkTTk",
    "kTk..kTTkkTTk..kTk",
    "kk....kkk.kkk...kk",
]
GALHO_ESQ = [      # o braço esquerdo, oferecendo uma berry (a CHERI, vermelha)
    "kk..........",
    "kRRk........",
    "kRrRk.......",
    ".kRRkk......",
    "..kkTTk.....",
    "....kTTkkk..",
    ".....kkTTTk.",
    ".......kkkk.",
]
GALHO_DIR = [
    "........kk..",
    "......kkTk..",
    ".....kTTk...",
    "..kkkTTk.k..",
    ".kTTTTkkLk..",
    ".kkkkk..kk..",
]
# as berries penduradas na copa: cada uma uma cor, com o cabinho e o brilho
BERRY = lambda c: ["..s..", f".k{c}k.", f"k{c}h{c}k", f"k{c}{c}{c}k", ".kkk."]


def copa(q, cx, cy):
    """a copa: a soma de cinco bolas de folha (fofa, não redonda certinha), e a
    textura de folha por cima (um tom mais escuro em escama)"""
    bolas = [(0, 0, 21), (-14, 6, 13), (14, 6, 13), (-8, -9, 12), (9, -9, 12)]
    for y in range(96):
        for x in range(96):
            if any((x - cx - bx) ** 2 + (y - cy - by) ** 2 <= r * r for bx, by, r in bolas):
                # tufos de folha: em cada célula de 5x4 (deslocada a cada fileira),
                # a beirada de baixo do tufo é escura e o miolo de cima é claro
                cy4 = (y - cy) % 4
                cx5 = (x + ((y // 4) % 2) * 2) % 5
                if cy4 == 3 and cx5 in (1, 2, 3):
                    q.px[(x, y)] = "G"
                elif cy4 == 1 and cx5 == 2:
                    q.px[(x, y)] = "f"
                else:
                    q.px[(x, y)] = "F"


def montar():
    q = Quadro()
    copa(q, 48, 32)
    q.por(TRONCO, 39, 52)
    q.por(GALHO_ESQ, 29, 54)
    q.por(GALHO_DIR, 55, 52)
    for (c, x, y) in [("R", 33, 20), ("B", 51, 16), ("P", 61, 30), ("Y", 28, 35), ("O", 44, 28),
                      ("V", 57, 22), ("B", 37, 41), ("P", 24, 26), ("Y", 64, 39), ("R", 50, 39)]:
        q.por(BERRY(c), x, y)
    return q


NORMAL = {
    "k": (30, 24, 20), "F": (74, 168, 72), "G": (52, 128, 56), "f": (130, 210, 110), "g": (36, 96, 44),
    "T": (138, 96, 58), "t": (108, 72, 42), "w": (90, 60, 34), "e": (255, 255, 220),
    "R": (232, 56, 60), "B": (70, 122, 216), "P": (244, 150, 192), "Y": (240, 200, 56), "O": (240, 136, 56),
    "V": (138, 216, 96), "h": (255, 255, 255), "s": (60, 110, 40), "L": (90, 180, 80), "r": (255, 140, 130),
}
LUZ = {"F": "f"}
SOMBRA = {"F": "g", "G": "g", "T": "w"}
# SHINY: a copa de outono (laranja e vermelha) e as frutas douradas
SHINY = dict(NORMAL, **{"F": (226, 128, 48), "G": (196, 92, 40), "f": (250, 186, 90), "g": (150, 64, 30),
                        "R": (240, 200, 60), "B": (240, 200, 60), "P": (250, 220, 90), "V": (230, 180, 50)})


def main():
    q = montar()
    salvar(DEX, q.imagem(NORMAL, luz=LUZ, sombra=SOMBRA), q.imagem(SHINY, luz=LUZ, sombra=SOMBRA), "fruteiro")
    print("ok")


if __name__ == "__main__":
    main()
