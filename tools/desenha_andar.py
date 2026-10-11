#!/usr/bin/env python3
"""OS POKÉMON ANDANDO NO MAPA, desenhados à mão (em código, como as -BRAG).

Cada Pokémon daqui tem três desenhos de 24x24 — FRENTE (andando pra baixo),
COSTAS (pra cima) e LADO (virado pra esquerda; a direita é o lado espelhado)
— no jeito do boneco do treinador do FireRed: contorno preto, três tons de
sombra e o passo em quatro quadros (parado, pé esquerdo, parado, pé direito). Sai no formato que o jogo lê (src/core/sprites.js, `pedirAndar`):

    assets/sprites/pokemon/andar/025.png    4 linhas: baixo, cima, esquerda, direita
    assets/sprites/pokemon/andar/andar.json {"025": [24, 24, 4, [150, 150, 150, 150]]}

    python3 tools/desenha_andar.py

Quem não está aqui continua no mapa com o sprite de batalha, como antes.
"""
import json
import os
import sys

from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from pixelart import Tela, escurecer  # noqa: E402

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(RAIZ, "assets", "sprites", "pokemon", "andar")
from andar_base import *  # noqa: E402,F401,F403
import andar_base  # noqa: E402


# ------------------------------------------------------------------ PIKACHU
PK, PK_C, PK_E = H("f8e800"), H("f8f878"), H("e8b800")
PK_MARROM, PK_RUBRO = H("805000"), H("e00000")


def pikachu(t, lado):
    if lado == "frente":
        t.poli([(4, 1), (9, 8), (6, 10)], PK); t.poli([(20, 1), (15, 8), (18, 10)], PK)      # orelhas
        t.elipse(12, 11, 7, 5, PK)                        # cabeça larga
        t.elipse(12, 18, 5, 3, PK)                        # corpinho
        t.pxs([(6, 17), (5, 18), (18, 17), (19, 18)], PK)  # bracinhos
        sombrear(t, {PK: (PK_C, PK_E)})
        t.pxs([(4, 1), (5, 1), (4, 2), (5, 2), (5, 3), (20, 1), (19, 1), (20, 2), (19, 2), (19, 3)], H("101010"))
        for x in (9, 15):                                 # olhos com o brilhinho
            t.pxs([(x, 10), (x, 11)], H("101010")); t.px(x, 10, (250, 250, 250, 255))
        t.pxs([(6, 13), (7, 13), (6, 14), (7, 14), (17, 13), (18, 13), (17, 14), (18, 14)], PK_RUBRO)   # bochechas
        t.pxs([(11, 13), (13, 13)], H("101010")); t.px(12, 14, H("b00000"))     # boca de gato
        pes(t, [(9, 21), (10, 21), (14, 21), (15, 21)], PK_E)
    elif lado == "costas":
        t.poli([(4, 1), (9, 8), (6, 10)], PK); t.poli([(20, 1), (15, 8), (18, 10)], PK)
        t.elipse(12, 11, 7, 5, PK)
        t.elipse(12, 18, 5, 3, PK)
        t.poli([(14, 18), (19, 14), (17, 11), (22, 9), (23, 4), (20, 3), (19, 8), (15, 10), (16, 14), (13, 17)], PK)   # rabo raio
        sombrear(t, {PK: (PK_C, PK_E)})
        t.pxs([(4, 1), (5, 1), (4, 2), (5, 2), (5, 3), (20, 1), (19, 1), (20, 2), (19, 2), (19, 3)], H("101010"))
        t.linha([(9, 16), (15, 16)], PK_MARROM, 1); t.linha([(10, 18), (14, 18)], PK_MARROM, 1)   # as listras
        t.pxs([(13, 17), (14, 17), (14, 18)], PK_MARROM)        # a base marrom do rabo
        pes(t, [(9, 21), (10, 21), (14, 21), (15, 21)], PK_E)
    else:                                                  # virado pra esquerda
        t.poli([(9, 0), (13, 9), (9, 10)], PK)             # orelha
        t.elipse(9, 11, 6, 5, PK)                          # cabeça
        t.elipse(13, 18, 5, 3, PK)
        t.poli([(16, 18), (20, 14), (18, 11), (22, 9), (23, 4), (20, 3), (19, 8), (15, 11), (17, 14), (15, 17)], PK)
        sombrear(t, {PK: (PK_C, PK_E)})
        t.pxs([(9, 0), (9, 1), (10, 1), (10, 2), (10, 3)], H("101010"))
        t.pxs([(6, 10), (6, 11)], H("101010")); t.px(6, 10, (250, 250, 250, 255))
        t.pxs([(4, 13), (5, 13), (4, 14), (5, 14)], PK_RUBRO)
        t.px(3, 12, H("101010"))
        t.pxs([(15, 17), (16, 17), (16, 18)], PK_MARROM)
        pes(t, [(11, 21), (12, 21), (15, 21), (16, 21)], PK_E)
    contorno_gba(t)


# ---------------------------------------------------------------- BULBASAUR
BU, BU_C, BU_E = H("60d0a0"), H("80e8c0"), H("609098")
BU_MANCHA = H("285860")
BO, BO_C, BO_E = H("78a840"), H("98d048"), H("587040")
BU_OLHO = H("b82820")


def bulbasaur(t, lado):
    if lado == "frente":
        t.elipse(12, 9, 6, 5, BO)                          # o bulbo atrás
        t.elipse(12, 15, 9, 5, BU)                         # cabeça larga
        t.elipse(12, 19, 6, 3, BU)
        t.poli([(4, 12), (3, 8), (7, 11)], BU); t.poli([(20, 12), (21, 8), (17, 11)], BU)   # orelhinhas
        sombrear(t, {BU: (BU_C, BU_E), BO: (BO_C, BO_E)})
        t.linha([(12, 5), (12, 11)], BO_E, 1); t.linha([(9, 7), (10, 10)], BO_E, 1); t.linha([(15, 7), (14, 10)], BO_E, 1)  # as folhas
        for x in (8, 15):                                  # olho vermelho com o branco
            t.pxs([(x, 14), (x + 1, 14), (x, 15), (x + 1, 15)], BU_OLHO); t.px(x, 14, (250, 250, 250, 255))
        t.linha([(10, 18), (14, 18)], BU_MANCHA, 1)        # boca
        t.pxs([(5, 15), (6, 16), (19, 15), (18, 16), (12, 12)], BU_MANCHA)   # manchas
        pes(t, [(6, 21), (7, 21), (10, 21), (14, 21), (17, 21), (18, 21)], BU_E)
    elif lado == "costas":
        t.elipse(12, 16, 9, 5, BU)
        t.elipse(12, 11, 7, 6, BO)                         # o bulbo, grande
        sombrear(t, {BU: (BU_C, BU_E), BO: (BO_C, BO_E)})
        t.linha([(12, 5), (12, 16)], BO_E, 1); t.linha([(8, 8), (10, 14)], BO_E, 1); t.linha([(16, 8), (14, 14)], BO_E, 1)
        t.pxs([(5, 16), (19, 17), (7, 19)], BU_MANCHA)
        pes(t, [(6, 21), (7, 21), (17, 21), (18, 21)], BU_E)
    else:
        t.elipse(15, 11, 6, 5, BO)
        t.elipse(14, 17, 8, 4, BU)                         # corpo
        t.elipse(7, 15, 6, 4, BU)                          # cabeça pra frente
        t.poli([(9, 11), (10, 7), (12, 12)], BU)
        sombrear(t, {BU: (BU_C, BU_E), BO: (BO_C, BO_E)})
        t.linha([(15, 6), (15, 13)], BO_E, 1); t.linha([(12, 9), (13, 13)], BO_E, 1)
        t.pxs([(4, 14), (5, 14), (4, 15), (5, 15)], BU_OLHO); t.px(4, 14, (250, 250, 250, 255))
        t.linha([(1, 17), (5, 17)], BU_MANCHA, 1)
        t.pxs([(10, 16), (14, 18), (18, 17)], BU_MANCHA)
        pes(t, [(7, 21), (8, 21), (11, 21), (16, 21), (17, 21), (20, 21)], BU_E)
    contorno_gba(t)


# --------------------------------------------------------------- CHARMANDER
CH, CH_C, CH_E = H("f89040"), H("f8c060"), H("d84848")
CH_BARRIGA = H("f8d068")
FG, FG_C, FG_E = H("f8a008"), H("f8e800"), H("f06000")


def chama(t, x, y):
    t.elipse(x, y, 2, 3, FG_E); t.elipse(x, y + 1, 1, 2, FG); t.px(x, y + 1, FG_C)


def charmander(t, lado):
    if lado == "frente":
        t.elipse(12, 8, 6, 5, CH)                          # cabeça
        t.elipse(12, 17, 5, 4, CH)
        t.poli([(16, 17), (21, 15), (20, 19)], CH)         # rabo
        t.pxs([(6, 15), (5, 16), (18, 15), (19, 16)], CH)
        sombrear(t, {CH: (CH_C, CH_E)})
        t.elipse(12, 18, 3, 3, CH_BARRIGA)
        chama(t, 21, 12)
        for x in (9, 15):
            t.pxs([(x, 7), (x, 8), (x, 9)], H("101010")); t.px(x, 7, (250, 250, 250, 255))
        t.linha([(10, 11), (14, 11)], CH_E, 1)
        pes(t, [(9, 21), (10, 21), (14, 21), (15, 21)], CH_E)
    elif lado == "costas":
        t.elipse(12, 8, 6, 5, CH)
        t.elipse(12, 17, 5, 4, CH)
        t.poli([(13, 19), (19, 21), (21, 17), (20, 15), (16, 18)], CH)
        sombrear(t, {CH: (CH_C, CH_E)})
        chama(t, 20, 12)
        pes(t, [(9, 21), (10, 21), (14, 21), (15, 21)], CH_E)
    else:
        t.elipse(8, 8, 6, 5, CH)
        t.elipse(11, 17, 5, 4, CH)
        t.poli([(15, 18), (21, 16), (22, 12), (18, 17)], CH)
        sombrear(t, {CH: (CH_C, CH_E)})
        t.elipse(9, 18, 2, 3, CH_BARRIGA)
        chama(t, 21, 9)
        t.pxs([(5, 7), (5, 8), (5, 9)], H("101010")); t.px(5, 7, (250, 250, 250, 255))
        t.linha([(2, 10), (5, 10)], CH_E, 1)
        pes(t, [(9, 21), (10, 21), (13, 21), (14, 21)], CH_E)
    contorno_gba(t)


# ----------------------------------------------------------------- SQUIRTLE
SQ, SQ_C, SQ_E = H("88c0d0"), H("b0d8e8"), H("8090a8")
CA, CA_C, CA_E = H("b86800"), H("e0a858"), H("602800")
SQ_BARRIGA = H("f8d068")


def squirtle(t, lado):
    if lado == "frente":
        t.elipse(12, 8, 6, 5, SQ)
        t.elipse(12, 17, 6, 4, CA)                         # o casco dos lados
        t.pxs([(5, 15), (4, 16), (19, 15), (20, 16)], SQ)
        sombrear(t, {SQ: (SQ_C, SQ_E), CA: (CA_C, CA_E)})
        t.elipse(12, 17, 4, 4, SQ_BARRIGA)                 # a barriga em placas
        t.linha([(9, 16), (15, 16)], CA_C, 1); t.linha([(9, 18), (15, 18)], CA_C, 1); t.linha([(12, 14), (12, 20)], CA_C, 1)
        for x in (9, 15):
            t.pxs([(x, 7), (x, 8), (x, 9)], H("101010")); t.px(x, 7, (250, 250, 250, 255))
        t.linha([(10, 11), (14, 11)], SQ_E, 1)
        pes(t, [(9, 21), (10, 21), (14, 21), (15, 21)], SQ_E)
    elif lado == "costas":
        t.elipse(12, 8, 6, 5, SQ)
        t.elipse(12, 17, 6, 5, CA)
        t.elipse(19, 20, 2, 2, SQ)                         # o rabo enrolado
        sombrear(t, {SQ: (SQ_C, SQ_E), CA: (CA_C, CA_E)})
        t.anel(12, 17, 6, 5, CA_C, 1)                      # a borda clara do casco
        t.anel(12, 17, 3, 2, CA_E, 1)
        t.px(19, 20, SQ_E)
        pes(t, [(9, 21), (10, 21), (14, 21), (15, 21)], SQ_E)
    else:
        t.elipse(8, 8, 6, 5, SQ)
        t.elipse(13, 17, 6, 4, CA)
        t.elipse(21, 18, 2, 2, SQ)
        sombrear(t, {SQ: (SQ_C, SQ_E), CA: (CA_C, CA_E)})
        t.elipse(10, 17, 3, 4, SQ_BARRIGA)
        t.linha([(13, 13), (18, 20)], CA_C, 1)
        t.pxs([(5, 7), (5, 8), (5, 9)], H("101010")); t.px(5, 7, (250, 250, 250, 255))
        t.linha([(2, 10), (5, 10)], SQ_E, 1)
        pes(t, [(9, 21), (10, 21), (14, 21), (15, 21)], SQ_E)
    contorno_gba(t)


# -------------------------------------------------------------------- EEVEE
EV, EV_C, EV_E = H("d09858"), H("e0b070"), H("a07030")
EV_GOLA, EV_GOLA_E = H("f8f0c8"), H("d0c898")
EV_ORELHA = H("584820")


def eevee(t, lado):
    if lado == "frente":
        t.poli([(2, 1), (9, 8), (5, 11)], EV); t.poli([(22, 1), (15, 8), (19, 11)], EV)   # orelhonas
        t.elipse(12, 10, 6, 5, EV)
        t.elipse(12, 18, 5, 3, EV)
        sombrear(t, {EV: (EV_C, EV_E)})
        t.poli([(4, 3), (8, 8), (6, 9)], EV_ORELHA); t.poli([(20, 3), (16, 8), (18, 9)], EV_ORELHA)   # dentro da orelha
        t.elipse(12, 15, 6, 2, EV_GOLA)                    # a gola felpuda
        t.pxs([(6, 16), (8, 17), (16, 17), (18, 16)], EV_GOLA)
        t.pxs([(7, 15), (17, 15)], EV_GOLA_E)
        for x in (9, 15):
            t.pxs([(x, 9), (x, 10), (x, 11)], H("584820")); t.px(x, 9, (250, 250, 250, 255))
        t.px(12, 12, H("101010"))
        pes(t, [(9, 21), (10, 21), (14, 21), (15, 21)], EV_E)
    elif lado == "costas":
        t.poli([(2, 1), (9, 8), (5, 11)], EV); t.poli([(22, 1), (15, 8), (19, 11)], EV)
        t.elipse(12, 10, 6, 5, EV)
        t.elipse(12, 18, 5, 3, EV)
        t.elipse(12, 16, 4, 4, EV)                         # o rabo felpudo
        sombrear(t, {EV: (EV_C, EV_E)})
        t.elipse(12, 14, 3, 2, EV_GOLA)                    # a ponta creme do rabo
        pes(t, [(9, 21), (10, 21), (14, 21), (15, 21)], EV_E)
    else:
        t.poli([(9, 0), (13, 8), (8, 10)], EV)
        t.elipse(8, 11, 5, 4, EV)
        t.elipse(13, 17, 5, 3, EV)
        t.elipse(19, 13, 3, 4, EV)                         # rabo
        sombrear(t, {EV: (EV_C, EV_E)})
        t.poli([(10, 2), (12, 7), (10, 8)], EV_ORELHA)
        t.elipse(9, 15, 3, 2, EV_GOLA)
        t.elipse(20, 11, 2, 2, EV_GOLA)
        t.pxs([(5, 10), (5, 11), (5, 12)], H("584820")); t.px(5, 10, (250, 250, 250, 255))
        t.px(3, 12, H("101010"))
        pes(t, [(10, 21), (11, 21), (15, 21), (16, 21)], EV_E)
    contorno_gba(t)


# --------------------------------------------------------------- JIGGLYPUFF
JG, JG_C, JG_E = H("f8a8a0"), H("f8c8c0"), H("e07070")
JG_OLHO, JG_OLHO_C = H("403098"), H("7060d8")


def jigglypuff(t, lado):
    if lado == "frente":
        t.poli([(4, 5), (8, 9), (5, 10)], JG); t.poli([(20, 5), (16, 9), (19, 10)], JG)
        t.elipse(12, 14, 8, 7, JG)
        sombrear(t, {JG: (JG_C, JG_E)})
        t.pxs([(4, 5), (5, 6), (20, 5), (19, 6)], H("101010"))               # pontinha escura da orelha
        t.poli([(10, 6), (14, 5), (14, 8), (12, 9), (13, 7)], JG_E)          # o topete enrolado
        for x in (8, 16):                                                    # olhões
            t.elipse(x, 13, 2, 2, (250, 250, 250, 255)); t.elipse(x, 13, 1, 1, JG_OLHO)
            t.px(x, 13, JG_OLHO_C); t.px(x - 1, 12, (250, 250, 250, 255))
        t.pxs([(11, 17), (12, 18), (13, 17)], H("a04848"))
        pes(t, [(8, 21), (9, 21), (15, 21), (16, 21)], JG_E)
    elif lado == "costas":
        t.poli([(4, 5), (8, 9), (5, 10)], JG); t.poli([(20, 5), (16, 9), (19, 10)], JG)
        t.elipse(12, 14, 8, 7, JG)
        sombrear(t, {JG: (JG_C, JG_E)})
        t.pxs([(4, 5), (5, 6), (20, 5), (19, 6)], H("101010"))
        pes(t, [(8, 21), (9, 21), (15, 21), (16, 21)], JG_E)
    else:
        t.poli([(10, 4), (14, 9), (9, 9)], JG)
        t.elipse(12, 14, 8, 7, JG)
        sombrear(t, {JG: (JG_C, JG_E)})
        t.pxs([(10, 4), (11, 5)], H("101010"))
        t.poli([(6, 7), (10, 6), (10, 9), (8, 10), (9, 8)], JG_E)
        t.elipse(7, 13, 2, 2, (250, 250, 250, 255)); t.elipse(6, 13, 1, 1, JG_OLHO); t.px(6, 12, (250, 250, 250, 255))
        t.pxs([(4, 17), (5, 18)], H("a04848"))
        pes(t, [(9, 21), (10, 21), (15, 21), (16, 21)], JG_E)
    contorno_gba(t)


# ------------------------------------------------------------------- GENGAR
GE, GE_C, GE_E = H("986880"), H("c080b0"), H("583058")
GE_OLHO = H("e86048")


def gengar(t, lado):
    espinhos = [(3, 10), (5, 4), (8, 8), (10, 2), (12, 7), (14, 2), (16, 8), (19, 4), (21, 10)]
    if lado in ("frente", "costas"):
        t.poli([(3, 13), *espinhos, (21, 13)], GE)
        t.elipse(12, 15, 9, 6, GE)
        t.pxs([(3, 15), (2, 16), (2, 17), (21, 15), (22, 16), (22, 17)], GE)
        sombrear(t, {GE: (GE_C, GE_E)})
        if lado == "frente":
            for x, d in ((8, 1), (16, -1)):                                  # o olhar mau
                t.poli([(x - 2 * d, 11), (x + 2 * d, 12), (x - d, 13)], GE_OLHO)
                t.px(x, 12, H("101010"))
            t.poli([(6, 16), (18, 16), (16, 19), (8, 19)], (250, 250, 250, 255))   # o sorrisão
            t.linha([(7, 17), (17, 17)], H("d8d8d8"), 1)
            for x in range(8, 17, 2):
                t.px(x, 18, H("d8d8d8"))
        else:
            t.linha([(12, 8), (12, 19)], GE_E, 1)
        pes(t, [(7, 21), (8, 21), (16, 21), (17, 21)], GE_E)
    else:
        t.poli([(5, 13), (7, 5), (10, 8), (12, 2), (15, 7), (18, 4), (21, 12)], GE)
        t.elipse(13, 15, 8, 6, GE)
        sombrear(t, {GE: (GE_C, GE_E)})
        t.poli([(4, 11), (8, 12), (5, 13)], GE_OLHO); t.px(6, 12, H("101010"))
        t.poli([(4, 16), (10, 16), (9, 19), (5, 18)], (250, 250, 250, 255))
        pes(t, [(9, 21), (10, 21), (16, 21), (17, 21)], GE_E)
    contorno_gba(t)


# ------------------------------------------------------------------ PSYDUCK
PS, PS_C, PS_E = H("f8d048"), H("f8e8b8"), H("e0a030")
PS_BICO, PS_BICO_E = H("f8e0a0"), H("d8b050")


def psyduck(t, lado):
    if lado == "frente":
        t.elipse(12, 9, 7, 6, PS)
        t.elipse(12, 18, 5, 4, PS)
        t.pxs([(5, 16), (4, 17), (19, 16), (20, 17)], PS)
        sombrear(t, {PS: (PS_C, PS_E)})
        t.linha([(11, 3), (10, 0)], H("101010"), 1); t.linha([(12, 3), (12, 0)], H("101010"), 1); t.linha([(13, 3), (14, 0)], H("101010"), 1)
        t.elipse(12, 12, 3, 2, PS_BICO); t.linha([(10, 13), (14, 13)], PS_BICO_E, 1)
        for x in (8, 16):                                  # olhão vazio
            t.elipse(x, 8, 2, 2, (250, 250, 250, 255)); t.px(x, 8, H("101010"))
        pes(t, [(8, 21), (9, 21), (10, 21), (14, 21), (15, 21), (16, 21)], PS_BICO_E)
    elif lado == "costas":
        t.elipse(12, 9, 7, 6, PS)
        t.elipse(12, 18, 5, 4, PS)
        sombrear(t, {PS: (PS_C, PS_E)})
        t.linha([(11, 3), (10, 0)], H("101010"), 1); t.linha([(12, 3), (12, 0)], H("101010"), 1); t.linha([(13, 3), (14, 0)], H("101010"), 1)
        pes(t, [(8, 21), (9, 21), (15, 21), (16, 21)], PS_BICO_E)
    else:
        t.elipse(11, 9, 6, 6, PS)
        t.elipse(13, 18, 5, 4, PS)
        sombrear(t, {PS: (PS_C, PS_E)})
        t.linha([(12, 3), (11, 0)], H("101010"), 1); t.linha([(13, 3), (14, 0)], H("101010"), 1)
        t.elipse(5, 12, 3, 2, PS_BICO); t.linha([(3, 13), (7, 13)], PS_BICO_E, 1)
        t.elipse(8, 8, 2, 2, (250, 250, 250, 255)); t.px(7, 8, H("101010"))
        pes(t, [(10, 21), (11, 21), (12, 21), (15, 21), (16, 21)], PS_BICO_E)
    contorno_gba(t)


# ------------------------------------------------------------------ SNORLAX
SN, SN_C, SN_E = H("608070"), H("789888"), H("385040")
SN_CREME, SN_CREME_C, SN_CREME_E = H("e8d898"), H("f8f8c0"), H("c0b070")
SN_GARRA = H("f8f8f8")


def snorlax(t, lado):
    if lado == "frente":
        t.elipse(12, 15, 10, 8, SN)
        t.elipse(12, 7, 6, 4, SN)
        t.pxs([(6, 3), (7, 3), (7, 4), (17, 3), (16, 3), (16, 4)], SN)       # orelhinhas
        sombrear(t, {SN: (SN_C, SN_E)})
        t.elipse(12, 16, 7, 6, SN_CREME)                   # a barriga
        t.elipse(12, 8, 4, 2, SN_CREME)                    # a cara clara
        sombrear(t, {SN_CREME: (SN_CREME_C, SN_CREME_E)})
        t.linha([(9, 7), (11, 7)], H("101010"), 1); t.linha([(13, 7), (15, 7)], H("101010"), 1)   # olho fechado
        t.linha([(10, 9), (14, 9)], SN_CREME_E, 1)
        t.pxs([(11, 10), (13, 10)], SN_GARRA)              # os dentinhos
        pes(t, [(5, 22), (6, 22), (7, 22), (17, 22), (18, 22), (19, 22)], SN_CREME_E)
        t.pxs([(5, 21), (7, 21), (17, 21), (19, 21)], SN_GARRA)
    elif lado == "costas":
        t.elipse(12, 15, 10, 8, SN)
        t.elipse(12, 7, 6, 4, SN)
        t.pxs([(6, 3), (7, 3), (7, 4), (17, 3), (16, 3), (16, 4)], SN)
        sombrear(t, {SN: (SN_C, SN_E)})
        pes(t, [(5, 22), (6, 22), (7, 22), (17, 22), (18, 22), (19, 22)], SN_CREME_E)
    else:
        t.elipse(13, 15, 9, 8, SN)
        t.elipse(8, 8, 5, 4, SN)
        t.pxs([(9, 3), (10, 3), (10, 4)], SN)
        sombrear(t, {SN: (SN_C, SN_E)})
        t.elipse(9, 16, 5, 6, SN_CREME)
        t.elipse(5, 9, 2, 2, SN_CREME)
        sombrear(t, {SN_CREME: (SN_CREME_C, SN_CREME_E)})
        t.linha([(5, 7), (7, 7)], H("101010"), 1)
        pes(t, [(7, 22), (8, 22), (9, 22), (17, 22), (18, 22)], SN_CREME_E)
        t.pxs([(7, 21), (9, 21)], SN_GARRA)
    contorno_gba(t)


# ==================================================== LOTE 2 (12 a mais)


# -------------------------------------------------------------------- DITTO
DI, DI_C, DI_E = H("e898d0"), H("f0c0e8"), H("b05080")


def ditto(t, lado):
    corpo = [(4, 21), (3, 16), (5, 12), (8, 10), (12, 11), (16, 9), (19, 12), (21, 17), (20, 21)]
    if lado == "lado":
        corpo = [(4, 21), (3, 15), (6, 11), (11, 10), (16, 11), (20, 14), (21, 21)]
    t.poli(corpo, DI)
    sombrear(t, {DI: (DI_C, DI_E)})
    if lado == "frente":
        t.pxs([(9, 15), (15, 15)], P_)                     # os olhinhos de ponto
        t.linha([(10, 18), (12, 19), (14, 18)], H("702858"), 1)   # o sorrisinho
    elif lado == "lado":
        t.pxs([(6, 15)], P_)
        t.linha([(4, 18), (6, 19)], H("702858"), 1)
    contorno_gba(t)


# ------------------------------------------------------------------ VOLTORB
VO, VO_C, VO_E = H("f85020"), H("f8a898"), H("c84040")
VB, VB_C, VB_E = H("f8f8f8"), H("ffffff"), H("b0a8a8")


def voltorb(t, lado):
    t.elipse(12, 14, 8, 8, VB)
    t.poli([(4, 14), (4, 9), (7, 7), (12, 6), (17, 7), (20, 9), (20, 14)], VO)   # a metade de cima vermelha
    sombrear(t, {VO: (VO_C, VO_E), VB: (VB_C, VB_E)})
    t.linha([(4, 14), (20, 14)], P_, 1)                    # a costura
    if lado == "frente":
        for x, d in ((9, 1), (15, -1)):                    # o olhar bravo
            t.pxs([(x, 11), (x, 12)], P_); t.px(x - d, 10, P_)
    elif lado == "lado":
        t.pxs([(7, 11), (7, 12)], P_); t.px(8, 10, P_)
    contorno_gba(t)


# ------------------------------------------------------------------ DIGLETT
DG, DG_C, DG_E = H("c07840"), H("d89858"), H("a05840")
TERRA, TERRA_E = H("807848"), H("585020")
NARIZ = H("e86070")


def diglett(t, lado):
    t.elipse(12, 21, 9, 2, TERRA)                          # o buraco/terra em volta
    t.elipse(12, 13, 5, 7, DG)
    t.ret(7, 13, 17, 20, DG)
    sombrear(t, {DG: (DG_C, DG_E), TERRA: (TERRA, TERRA_E)})
    t.pxs([(5, 21), (9, 22), (16, 22), (19, 21)], TERRA_E)   # pedrinhas
    if lado == "frente":
        olhinho(t, 10, 11); olhinho(t, 14, 11)
        t.elipse(12, 15, 2, 1, NARIZ); t.px(11, 14, H("f8b0b8"))
    elif lado == "lado":
        olhinho(t, 9, 11)
        t.elipse(7, 15, 2, 1, NARIZ)
    contorno_gba(t)


# ------------------------------------------------------------------- ODDISH
OD, OD_C, OD_E = H("486880"), H("7090a0"), H("283848")
FO, FO_C, FO_E = H("70a830"), H("98d048"), H("485820")


def oddish(t, lado):
    for a, b in (((12, 9), (5, 1)), ((12, 9), (12, 0)), ((12, 9), (19, 1)), ((12, 9), (8, 3)), ((12, 9), (16, 3))):
        t.poli([(a[0] - 1, a[1]), b, (a[0] + 1, a[1])], FO)                 # as folhas
    t.elipse(12, 15, 6, 5, OD)                             # o corpo-cebola
    sombrear(t, {OD: (OD_C, OD_E), FO: (FO_C, FO_E)})
    for x0, x1 in ((6, 9), (11, 13), (15, 18)):
        t.linha([(x0, 3), (12, 9)], FO_E, 1) if x0 < 12 else None
    if lado == "frente":
        t.pxs([(9, 14), (9, 15), (15, 14), (15, 15)], H("c02838"))          # olhos vermelhos
        t.linha([(11, 17), (13, 17)], OD_E, 1)
    elif lado == "lado":
        t.pxs([(8, 14), (8, 15)], H("c02838"))
    pes(t, [(8, 21), (9, 21), (15, 21), (16, 21)], OD_E)
    contorno_gba(t)


# ------------------------------------------------------------------ POLIWAG
PW, PW_C, PW_E = H("505890"), H("8088b0"), H("283850")
PW_B = H("f8f8f8")


def poliwag(t, lado):
    if lado in ("frente", "costas"):
        t.elipse(12, 14, 8, 7, PW)
        t.poli([(10, 19), (12, 23), (14, 19)], PW)         # o rabinho
        sombrear(t, {PW: (PW_C, PW_E)})
        if lado == "frente":
            t.elipse(12, 15, 5, 5, PW_B)                   # a barriga branca com a espiral
            t.anel(12, 15, 3, 3, P_, 1); t.px(12, 15, P_); t.px(13, 14, P_)
            for x in (8, 16):
                t.elipse(x, 10, 2, 2, BR); t.px(x, 10, P_)
            t.pxs([(11, 20), (13, 20)], H("e07070"))
        pes(t, [(6, 21), (7, 21), (17, 21), (18, 21)], PW_E)
    else:
        t.elipse(10, 14, 7, 7, PW)
        t.poli([(16, 15), (23, 12), (22, 18)], PW_C)       # o rabo transparente
        sombrear(t, {PW: (PW_C, PW_E)})
        t.elipse(8, 15, 3, 4, PW_B); t.anel(8, 15, 2, 2, P_, 1)
        t.elipse(7, 10, 2, 2, BR); t.px(6, 10, P_)
        pes(t, [(7, 21), (8, 21), (13, 21), (14, 21)], PW_E)
    contorno_gba(t)


# ----------------------------------------------------------------- MAGIKARP
MK, MK_C, MK_E = H("f86820"), H("f8a060"), H("d84848")
MK_B, MK_FIM = H("e8f880"), H("e8d060")


def magikarp(t, lado):
    if lado == "lado":
        t.elipse(11, 14, 8, 6, MK)                         # o peixão de lado
        t.poli([(18, 14), (23, 9), (23, 19)], MK_FIM)      # o rabo
        t.poli([(8, 8), (11, 4), (15, 9)], MK_FIM)         # a barbatana de cima, coroa
        sombrear(t, {MK: (MK_C, MK_E)})
        t.elipse(6, 13, 2, 2, BR); t.px(6, 13, P_)
        t.elipse(3, 16, 1, 1, H("f8c8a8"))                 # a boca aberta
        t.linha([(4, 14), (1, 11)], MK_FIM, 1); t.linha([(4, 17), (1, 20)], MK_FIM, 1)   # bigodes
        for x in (9, 12, 15):
            t.px(x, 15, MK_E)                              # escamas
    else:
        t.elipse(12, 14, 6, 8, MK)
        t.poli([(9, 21), (12, 23), (15, 21)], MK_FIM)
        t.poli([(9, 6), (12, 2), (15, 6)], MK_FIM)
        sombrear(t, {MK: (MK_C, MK_E)})
        if lado == "frente":
            for x in (9, 15):
                t.elipse(x, 11, 1, 1, BR); t.px(x, 11, P_)
            t.elipse(12, 15, 2, 2, H("f8c8a8"))
            t.linha([(9, 15), (5, 12)], MK_FIM, 1); t.linha([(15, 15), (19, 12)], MK_FIM, 1)
    contorno_gba(t)


# ------------------------------------------------------------------- MEOWTH
MW, MW_C, MW_E = H("f8e080"), H("f8f8b0"), H("e0b040")
MW_MARROM, MW_MOEDA = H("986800"), H("e89830")


def meowth(t, lado):
    if lado in ("frente", "costas"):
        t.poli([(4, 3), (9, 7), (5, 10)], MW); t.poli([(20, 3), (15, 7), (19, 10)], MW)
        t.elipse(12, 10, 7, 6, MW)
        t.elipse(12, 18, 4, 3, MW)
        sombrear(t, {MW: (MW_C, MW_E)})
        t.pxs([(5, 4), (6, 5), (19, 4), (18, 5)], MW_MARROM)   # dentro da orelha
        if lado == "frente":
            t.elipse(12, 5, 2, 1, MW_MOEDA); t.px(12, 5, H("f8d878"))   # a moeda da testa
            for x in (9, 15):
                t.pxs([(x, 9), (x, 10)], P_); t.px(x, 9, BR)
            t.pxs([(11, 12), (13, 12)], P_); t.px(12, 13, H("e07070"))
            t.linha([(5, 11), (8, 12)], P_, 1); t.linha([(19, 11), (16, 12)], P_, 1)   # bigode
        else:
            t.poli([(15, 18), (20, 15), (21, 9), (19, 9), (18, 14)], MW_MARROM)   # o rabo enrolado
        pes(t, [(9, 21), (10, 21), (14, 21), (15, 21)], MW_E)
    else:
        t.poli([(9, 2), (13, 8), (8, 9)], MW)
        t.elipse(9, 10, 6, 6, MW)
        t.elipse(13, 18, 4, 3, MW)
        t.poli([(16, 18), (21, 14), (22, 8), (20, 8), (19, 14)], MW_MARROM)
        sombrear(t, {MW: (MW_C, MW_E)})
        t.elipse(7, 5, 2, 1, MW_MOEDA)
        t.pxs([(6, 9), (6, 10)], P_); t.px(6, 9, BR)
        t.linha([(1, 11), (5, 12)], P_, 1)
        pes(t, [(11, 21), (12, 21), (15, 21), (16, 21)], MW_E)
    contorno_gba(t)


# ----------------------------------------------------------------- CLEFAIRY
CF, CF_C, CF_E = H("f8c0a0"), H("f8d8c8"), H("e08078")
CF_ORELHA = H("985850")


def clefairy(t, lado):
    if lado in ("frente", "costas"):
        t.poli([(4, 2), (9, 8), (5, 10)], CF); t.poli([(20, 2), (15, 8), (19, 10)], CF)
        t.elipse(12, 14, 7, 7, CF)
        sombrear(t, {CF: (CF_C, CF_E)})
        t.pxs([(4, 2), (5, 3), (20, 2), (19, 3)], CF_ORELHA)
        if lado == "frente":
            t.poli([(11, 7), (13, 4), (14, 7), (12, 9)], CF_E)   # o cachinho
            for x in (9, 15):
                t.pxs([(x, 12), (x, 13)], P_)
            t.pxs([(6, 15), (7, 15), (17, 15), (18, 15)], H("f89880"))   # bochechas
            t.px(12, 16, CF_ORELHA)
        else:
            t.poli([(10, 9), (12, 5), (14, 9)], CF_E)
            t.poli([(17, 14), (22, 10), (22, 16)], CF_C)     # as asinhas
            t.poli([(7, 14), (2, 10), (2, 16)], CF_C)
        pes(t, [(9, 21), (10, 21), (14, 21), (15, 21)], CF_E)
    else:
        t.poli([(9, 1), (13, 8), (8, 9)], CF)
        t.elipse(11, 14, 7, 7, CF)
        t.poli([(16, 14), (22, 10), (22, 16)], CF_C)
        sombrear(t, {CF: (CF_C, CF_E)})
        t.pxs([(9, 1), (10, 2)], CF_ORELHA)
        t.pxs([(7, 12), (7, 13)], P_)
        t.pxs([(5, 15), (6, 15)], H("f89880"))
        pes(t, [(9, 21), (10, 21), (14, 21), (15, 21)], CF_E)
    contorno_gba(t)


# ----------------------------------------------------------------- SLOWPOKE
SL, SL_C, SL_E = H("f88060"), H("f8b090"), H("e05868")
SL_CREME = H("f8f080")


def slowpoke(t, lado):
    if lado == "lado":
        t.elipse(14, 16, 8, 5, SL)                         # corpo deitado
        t.elipse(6, 11, 5, 5, SL)                          # cabeça pra frente
        t.poli([(21, 14), (23, 6), (21, 5)], SL)           # o rabo pra cima
        sombrear(t, {SL: (SL_C, SL_E)})
        t.elipse(3, 13, 3, 2, SL_CREME)                    # o focinho creme
        t.linha([(5, 10), (7, 10)], P_, 1)                 # o olhar vazio
        t.px(22, 5, BR)
        pes(t, [(9, 21), (10, 21), (17, 21), (18, 21)], SL_E)
    else:
        t.elipse(12, 17, 8, 5, SL)
        t.elipse(12, 9, 6, 5, SL)
        sombrear(t, {SL: (SL_C, SL_E)})
        if lado == "frente":
            t.elipse(12, 11, 4, 2, SL_CREME)
            t.linha([(8, 8), (10, 8)], P_, 1); t.linha([(14, 8), (16, 8)], P_, 1)
            t.px(12, 12, H("983030"))
        else:
            t.poli([(15, 18), (20, 15), (22, 8), (20, 7), (19, 13), (14, 16)], SL)   # o rabo subindo por trás
            t.pxs([(8, 4), (9, 4), (15, 4), (16, 4)], SL)          # as orelhinhas
            sombrear(t, {SL: (SL_C, SL_E)})
            t.pxs([(21, 7), (21, 8)], BR)                          # a pontinha clara do rabo
        pes(t, [(6, 21), (7, 21), (17, 21), (18, 21)], SL_E)
    contorno_gba(t)


# ------------------------------------------------------------------- VULPIX
VX, VX_C, VX_E = H("d86828"), H("f88048"), H("803800")
VX_CREME, VX_CAUDA = H("f0b878"), H("e09068")


def vulpix(t, lado):
    if lado in ("frente", "costas"):
        if lado == "frente":                               # de frente, as caudas só aparecem dos lados
            for x, y in ((4, 16), (20, 16), (5, 11), (19, 11)):
                t.elipse(x, y, 3, 3, VX_CAUDA)
        else:                                              # de costas, as seis em leque
            for x, y in ((12, 8), (7, 9), (17, 9), (4, 14), (20, 14), (12, 13)):
                t.elipse(x, y, 3, 4, VX_CAUDA)
        t.poli([(5, 2), (10, 8), (6, 11)], VX); t.poli([(19, 2), (14, 8), (18, 11)], VX)   # orelhas pontudas
        t.elipse(12, 11, 6, 5, VX)
        t.elipse(12, 18, 4, 3, VX)
        sombrear(t, {VX: (VX_C, VX_E), VX_CAUDA: (VX_CREME, VX_E)})
        t.pxs([(6, 4), (7, 6), (18, 4), (17, 6)], VX_E)    # dentro da orelha
        if lado == "frente":
            t.poli([(9, 7), (12, 5), (15, 7), (12, 9)], VX_C)   # o topete
            for x in (9, 15):
                t.pxs([(x, 10), (x, 11)], H("583018")); t.px(x, 10, BR)
            t.px(12, 13, P_)
            t.elipse(12, 17, 2, 1, VX_CREME)
        pes(t, [(9, 21), (10, 21), (14, 21), (15, 21)], VX_E)
    else:
        for x, y in ((18, 8), (21, 11), (20, 15)):
            t.elipse(x, y, 3, 3, VX_CAUDA)
        t.poli([(7, 6), (11, 10), (7, 12)], VX)
        t.elipse(8, 12, 5, 4, VX)
        t.elipse(13, 18, 5, 3, VX)
        sombrear(t, {VX: (VX_C, VX_E), VX_CAUDA: (VX_CREME, VX_E)})
        t.pxs([(5, 12), (5, 13)], H("583018")); t.px(5, 12, BR)
        t.px(3, 14, P_)
        pes(t, [(10, 21), (11, 21), (15, 21), (16, 21)], VX_E)
    contorno_gba(t)


# ---------------------------------------------------------------------- MEW
MEW, MEW_C, MEW_E = H("f8c0c8"), H("f0d0e0"), H("d89080")
MEW_OLHO = H("1858a0")


def mew(t, lado):
    if lado == "lado":
        t.elipse(9, 9, 5, 5, MEW)
        t.elipse(12, 16, 4, 4, MEW)
        t.linha([(15, 18), (20, 17), (22, 11), (21, 5)], MEW, 2)   # o rabo comprido
        t.elipse(21, 4, 2, 2, MEW)
        sombrear(t, {MEW: (MEW_C, MEW_E)})
        t.pxs([(6, 8), (6, 9), (6, 10)], MEW_OLHO); t.px(6, 8, BR)
    else:
        t.poli([(6, 3), (9, 7), (6, 8)], MEW); t.poli([(18, 3), (15, 7), (18, 8)], MEW)
        t.elipse(12, 9, 6, 5, MEW)
        t.elipse(12, 16, 4, 4, MEW)
        t.linha([(14, 18), (19, 16), (21, 10), (20, 4)], MEW, 2)
        t.elipse(20, 3, 2, 2, MEW)
        sombrear(t, {MEW: (MEW_C, MEW_E)})
        if lado == "frente":
            for x in (9, 15):
                t.pxs([(x, 8), (x, 9), (x, 10)], MEW_OLHO); t.px(x, 8, BR)
            t.px(12, 12, MEW_E)
    contorno_gba(t)


# ------------------------------------------------------------------- TOGEPI
TG, TG_C, TG_E = H("fff6ac"), H("ffffcd"), H("dec573")
CASCA, CASCA_E = H("f6f6ff"), H("cdcdcd")


def togepi(t, lado):
    t.elipse(12, 17, 6, 5, CASCA)                          # a casca
    t.elipse(12, 9, 5, 5, TG)                              # a cabeça saindo
    t.poli([(9, 5), (10, 1), (12, 4), (14, 1), (15, 5)], TG)   # a coroinha de espinhos
    sombrear(t, {CASCA: (CASCA, CASCA_E), TG: (TG_C, TG_E)})
    t.linha([(6, 14), (8, 13), (10, 15), (12, 13), (14, 15), (16, 13), (18, 14)], CASCA_E, 1)   # o zigue-zague
    for x, y, cor in ((9, 18, H("c51800")), (15, 18, H("1858c0")), (12, 20, H("c51800"))):
        t.elipse(x, y, 1, 1, cor)                          # os triângulos coloridos
    if lado == "frente":
        for x in (10, 14):
            t.pxs([(x, 8), (x, 9)], P_); t.px(x, 8, BR)
        t.px(12, 11, H("f08080"))
    elif lado == "lado":
        t.pxs([(9, 8), (9, 9)], P_); t.px(9, 8, BR)
    pes(t, [(9, 22), (10, 22), (14, 22), (15, 22)], TG_E)
    contorno_gba(t)



DESENHOS = {25: pikachu, 1: bulbasaur, 4: charmander, 7: squirtle, 133: eevee,
            39: jigglypuff, 94: gengar, 54: psyduck, 143: snorlax,
            132: ditto, 100: voltorb, 50: diglett, 43: oddish, 60: poliwag, 129: magikarp,
            52: meowth, 35: clefairy, 79: slowpoke, 37: vulpix, 151: mew, 175: togepi}


# OS PEQUENOS ficam menores no mapa (o PIKACHU não é do tamanho do treinador):
# o desenho é feito em 24 e reduzido com cuidado de pixel art (`encolher`)
TAMANHO = {25: 0.78, 4: 0.82, 7: 0.82, 1: 0.85, 133: 0.82, 39: 0.78, 54: 0.85,
           132: 0.7, 100: 0.72, 50: 0.7, 43: 0.75, 60: 0.8, 129: 0.85, 52: 0.82, 35: 0.8,
           37: 0.82, 151: 0.75, 175: 0.82}


def lotes():
    """os desenhos dos lotes de tools/andar_lotes/ (cada um com DESENHOS e TAMANHO)"""
    import importlib.util
    pasta = os.path.join(os.path.dirname(os.path.abspath(__file__)), "andar_lotes")
    desenhos, tamanhos = {}, {}
    for nome in sorted(os.listdir(pasta)) if os.path.isdir(pasta) else []:
        if not nome.endswith(".py") or nome.startswith("_"):
            continue
        spec = importlib.util.spec_from_file_location(nome[:-3], os.path.join(pasta, nome))
        mod = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(mod)
        desenhos.update(getattr(mod, "DESENHOS", {}))
        tamanhos.update(getattr(mod, "TAMANHO", {}))
    return desenhos, tamanhos


def main():
    """sem nada: grava tudo. `--ver saida.png 25,26`: só mostra (frente, costas,
    esquerda e direita, 4x) quem pediu, sem gravar nada no jogo."""
    desenhos, tamanhos = dict(DESENHOS), dict(TAMANHO)
    d2, t2 = lotes()
    desenhos.update(d2); tamanhos.update(t2)
    if "--ver" in sys.argv:
        i = sys.argv.index("--ver")
        saida, quais = sys.argv[i + 1], [int(x) for x in sys.argv[i + 2].split(",")]
        prev = Image.new("RGBA", (len(quais) * (L * 4 + 8), L), (120, 180, 120, 255))
        for j, dex in enumerate(quais):
            f = folha_do(desenhos[dex], tamanhos.get(dex, 1))
            for linha in range(4):
                prev.alpha_composite(f.crop((0, linha * L, L, linha * L + L)), (j * (L * 4 + 8) + linha * L, 0))
        prev.convert("RGB").resize((prev.width * 5, prev.height * 5), 0).save(saida)
        return print("prévia em", saida)
    os.makedirs(OUT, exist_ok=True)
    indice = {}
    for dex, desenho in sorted(desenhos.items()):
        folha_do(desenho, tamanhos.get(dex, 1)).save(os.path.join(OUT, f"{dex:03d}.png"))
        indice[f"{dex:03d}"] = [L, L, len(QUADROS), [150] * len(QUADROS)]
    with open(os.path.join(OUT, "andar.json"), "w", encoding="utf-8") as f:
        json.dump(indice, f, separators=(",", ":"), sort_keys=True)
    print(f"{len(indice)} Pokémon andando")


if __name__ == "__main__":
    main()
