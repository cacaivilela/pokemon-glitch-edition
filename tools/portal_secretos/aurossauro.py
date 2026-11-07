#!/usr/bin/env python3
"""AUROSSAURO (nº 1108, PEDRA/DRAGÃO) — o secreto de 2 runas FÓSSIL + 2 OURO.
Um ESQUELETO DE DINOSSAURO DE OURO andando, de lado (virado pra esquerda):
o crânio com a boca cheia de dente e o OLHO VERMELHO aceso no buraco, o
pescoço de vértebras, a espinha com os espinhos pra cima, as costelas, a
cauda subindo, a patinha da frente e as duas pernas fortes de garra.

As grades aqui são só o osso (Y); o contorno escuro vem do acabamento (ele
entra também nos buracos: é o que separa vértebra de vértebra e costela de
costela).
    python3 tools/portal_secretos/aurossauro.py
"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from comum import Quadro, salvar

DEX = 1108

CRANIO = [
    ".....YYYYYYYY.......",
    "...YYYYYYYYYYYY.....",
    "..YYYY...YYYYYYY....",
    ".YYYY.EE.YYYYYYYY...",
    "YYYYY....YYYYYYYYY..",
    "YYYYYYYYYYYYYYYYYY..",
    "YwYwYwYwYYYYYYYYY...",
    "........YYYYYYY.....",
    "wYwYwYwYYYYYYY......",
    "YYYYYYYYYYYY........",
]
PESCOCO = [          # o pescoço subindo em S até a cabeça
    "YY........",
    ".YY.......",
    "..YY......",
    "...YYY....",
    ".....YY...",
    "......YY..",
    ".......YY.",
    "........YY",
]
ESPINHA = [
    ".Y...Y...Y...Y...Y...Y...Y...Y.",
    "YYY.YYY.YYY.YYY.YYY.YYY.YYY.YYY",
    "YyY.YyY.YyY.YyY.YyY.YyY.YyY.YyY",
]
CAUDA = [
    "....................YY",
    ".................YY.Y.",
    "..............YY.YY...",
    "...........YY.YY......",
    "........YYY.YY........",
    ".....YYY.YYY..........",
    "..YYY.YYY.............",
    "YYY.YYY...............",
]
COSTELAS = [           # mais compridas na frente, encurtando até o quadril
    "YY...YY...YY...YY...YY",
    "YY...YY...YY...YY...YY",
    "YY...YY...YY...YY...Y.",
    ".YY...YY...YY...YY..Y.",
    ".YY...YY...YY...YY....",
    ".YY...YY...YY...YY....",
    "..YY...YY...YY...Y....",
    "..YY...YY...YY........",
    "..YY...YY...YY........",
    "...YY...YY...Y........",
    "...YY...YY............",
    "....YY...Y............",
    ".....YYYYYY...........",
]
BRACO = [
    "YY..",
    ".YY.",
    "..YY",
    "..wY",
]
PERNA = [
    "..YYYYYY....",
    ".YYYYYYYY...",
    "..YYYYYY....",
    "...YYYY.....",
    "....YYY.....",
    "....YYY.....",
    "...YYYy.....",
    "..YYYY......",
    "..YYY.......",
    ".YYY........",
    ".YYY........",
    "..YYY.......",
    "...YYY......",
    "....YYY.....",
    "....YYY.....",
    "...YYYY.....",
    "..wYwYwY....",
]


def montar():
    q = Quadro()
    # a perna de trás primeiro (mais escura), depois o corpo por cima
    q.por([l.replace("Y", "D").replace("y", "D") for l in PERNA], 56, 40)
    q.por(CAUDA, 62, 26)
    q.por(ESPINHA, 32, 34)
    q.por(COSTELAS, 32, 38)
    q.por(PESCOCO, 22, 27)
    q.por(CRANIO, 6, 17)
    q.por(BRACO, 34, 50)
    q.por(PERNA, 48, 38)
    return q


NORMAL = {
    "k": (40, 26, 10), "Y": (232, 184, 56), "y": (255, 236, 150), "D": (170, 122, 30), "d": (130, 90, 20),
    "w": (255, 250, 230), "E": (255, 60, 40),
}
LUZ = {"Y": "y"}
SOMBRA = {"Y": "D", "D": "d"}
# SHINY: osso de PRATA (platina), com o olho azul
SHINY = dict(NORMAL, **{"Y": (196, 206, 222), "y": (240, 246, 255), "D": (140, 150, 170), "d": (100, 108, 128),
                        "E": (60, 200, 255), "k": (30, 34, 48)})


def main():
    q = montar()
    salvar(DEX, q.imagem(NORMAL, luz=LUZ, sombra=SOMBRA), q.imagem(SHINY, luz=LUZ, sombra=SOMBRA), "aurossauro")
    print("ok")


if __name__ == "__main__":
    main()
