"""Lote E: os bebês, os iniciais de Johto, o Marill, o Wooper e as evoluções
do EEVEE — andando no mapa (formato em tools/andar_base.py)."""
from andar_base import *  # noqa: F401,F403


# -------------------------------------------------------------------- PICHU
PI, PI_C, PI_E = H("ffee83"), H("ffffc5"), H("e6b441")


def pichu(t, lado):
    if lado in ("frente", "costas"):
        t.poli([(2, 3), (9, 8), (5, 11)], PI); t.poli([(22, 3), (15, 8), (19, 11)], PI)   # orelhonas
        t.elipse(12, 12, 6, 5, PI)
        t.elipse(12, 19, 4, 3, PI)
        sombrear(t, {PI: (PI_C, PI_E)})
        t.pxs([(2, 3), (3, 3), (3, 4), (4, 5), (22, 3), (21, 3), (21, 4), (20, 5)], P_)   # a borda preta da orelha
        if lado == "frente":
            olhinho(t, 9, 11); olhinho(t, 15, 11)
            t.pxs([(7, 14), (8, 14), (16, 14), (17, 14)], H("ff734a"))   # bochechas rosadas
            t.px(12, 14, P_)
        else:
            t.poli([(15, 19), (19, 16), (18, 14), (20, 13)], P_)          # o rabinho preto
        pes(t, [(9, 21), (10, 21), (14, 21), (15, 21)], PI_E)
    else:
        t.poli([(8, 1), (13, 9), (7, 10)], PI)
        t.elipse(9, 12, 6, 5, PI)
        t.elipse(13, 19, 4, 3, PI)
        t.poli([(16, 19), (20, 16), (19, 14), (21, 13), (22, 17)], P_)
        sombrear(t, {PI: (PI_C, PI_E)})
        t.pxs([(8, 1), (8, 2), (9, 2), (9, 3)], P_)
        olhinho(t, 6, 11)
        t.pxs([(4, 14), (5, 14)], H("ff734a"))
        pes(t, [(11, 21), (12, 21), (15, 21), (16, 21)], PI_E)
    contorno_gba(t)


# ---------------------------------------------------------------- IGGLYBUFF
IG, IG_C, IG_E = H("ffcd9c"), H("ffe4c4"), H("ff9473")


def igglybuff(t, lado):
    t.elipse(12, 14, 8, 7, IG)
    t.poli([(5, 9), (7, 5), (9, 8)], IG); t.poli([(19, 9), (17, 5), (15, 8)], IG)
    sombrear(t, {IG: (IG_C, IG_E)})
    if lado == "frente":
        t.poli([(10, 7), (13, 4), (15, 6), (13, 8)], IG_E)       # o cachinho
        for x in (9, 15):
            t.elipse(x, 13, 1, 2, H("620000")); t.px(x, 12, BR)
        t.pxs([(11, 17), (12, 18), (13, 17)], H("c54a00"))
    elif lado == "lado":
        t.poli([(6, 7), (9, 4), (11, 6), (9, 8)], IG_E)
        t.elipse(6, 13, 1, 2, H("620000")); t.px(6, 12, BR)
    pes(t, [(8, 21), (9, 21), (15, 21), (16, 21)], IG_E)
    contorno_gba(t)


# ---------------------------------------------------------------- CHIKORITA
CK, CK_C, CK_E = H("c8e860"), H("d8f880"), H("98c008")
FOLHA, FOLHA_C, FOLHA_E = H("60a848"), H("98d070"), H("388028")


def chikorita(t, lado):
    if lado in ("frente", "costas"):
        t.poli([(12, 7), (8, 1), (13, 0), (15, 4)], FOLHA)       # a folha da cabeça
        t.elipse(12, 10, 6, 5, CK)
        t.elipse(12, 18, 5, 4, CK)
        sombrear(t, {CK: (CK_C, CK_E), FOLHA: (FOLHA_C, FOLHA_E)})
        t.linha([(11, 2), (13, 6)], FOLHA_E, 1)
        if lado == "frente":
            olhinho(t, 9, 10); olhinho(t, 15, 10)
            for x in (6, 8, 10, 14, 16, 18):                     # as sementinhas do pescoço
                t.px(x, 15, FOLHA)
        else:
            for x in (6, 8, 10, 14, 16, 18):
                t.px(x, 15, FOLHA)
        pes(t, [(8, 21), (9, 21), (15, 21), (16, 21)], CK_E)
    else:
        t.poli([(10, 7), (14, 1), (19, 2), (15, 6)], FOLHA)
        t.elipse(8, 10, 6, 5, CK)
        t.elipse(14, 18, 6, 4, CK)
        sombrear(t, {CK: (CK_C, CK_E), FOLHA: (FOLHA_C, FOLHA_E)})
        t.linha([(14, 2), (12, 6)], FOLHA_E, 1)
        olhinho(t, 5, 10)
        for x in (9, 11, 13):
            t.px(x, 15, FOLHA)
        pes(t, [(10, 21), (11, 21), (17, 21), (18, 21)], CK_E)
    contorno_gba(t)


# ---------------------------------------------------------------- CYNDAQUIL
CY, CY_C, CY_E = H("405088"), H("6080b8"), H("284060")
CY_CREME, CY_CREME_E = H("f8e8a0"), H("e0c868")
FOGO_C, FOGO, FOGO_E = H("f8d800"), H("f86000"), H("e80000")


def cyndaquil(t, lado):
    if lado == "costas":
        for x in (6, 10, 14, 18):                                 # as chamas das costas
            t.elipse(x, 9, 2, 4, FOGO_E); t.elipse(x, 10, 1, 2, FOGO); t.px(x, 10, FOGO_C)
        t.elipse(12, 15, 7, 6, CY)
        sombrear(t, {CY: (CY_C, CY_E)})
        pes(t, [(8, 21), (9, 21), (15, 21), (16, 21)], CY_CREME_E)
    elif lado == "frente":
        t.elipse(12, 15, 7, 6, CY)
        t.elipse(12, 9, 5, 4, CY)                                 # o focinho comprido
        sombrear(t, {CY: (CY_C, CY_E)})
        t.elipse(12, 17, 5, 4, CY_CREME)                          # a barriga creme
        t.linha([(9, 9), (11, 9)], P_, 1); t.linha([(13, 9), (15, 9)], P_, 1)   # olhinhos fechados
        pes(t, [(8, 21), (9, 21), (15, 21), (16, 21)], CY_CREME_E)
    else:
        t.elipse(14, 15, 7, 6, CY)
        t.poli([(9, 11), (2, 12), (4, 15), (10, 15)], CY)         # o focinho comprido pra frente
        sombrear(t, {CY: (CY_C, CY_E)})
        t.elipse(12, 18, 4, 3, CY_CREME)
        t.linha([(6, 11), (8, 11)], P_, 1)
        t.elipse(19, 9, 2, 3, FOGO_E); t.elipse(19, 10, 1, 2, FOGO); t.px(19, 10, FOGO_C)
        pes(t, [(10, 21), (11, 21), (17, 21), (18, 21)], CY_CREME_E)
    contorno_gba(t)


# ----------------------------------------------------------------- TOTODILE
TO, TO_C, TO_E = H("68b0e0"), H("90d0f8"), H("3080c0")
TO_CRISTA, TO_BARRIGA = H("c82810"), H("f8c050")


def totodile(t, lado):
    if lado in ("frente", "costas"):
        t.elipse(12, 9, 7, 6, TO)
        t.elipse(12, 18, 5, 4, TO)
        sombrear(t, {TO: (TO_C, TO_E)})
        if lado == "frente":
            t.elipse(12, 18, 3, 3, TO_BARRIGA)
            t.linha([(5, 11), (19, 11)], P_, 1)                   # a bocarra
            t.pxs([(7, 12), (10, 12), (14, 12), (17, 12)], BR)     # os dentes
            olhinho(t, 8, 6, H("c82810")); olhinho(t, 16, 6, H("c82810"))
        else:
            for y in (13, 16, 19):                                # a crista vermelha descendo
                t.pxs([(11, y), (12, y - 1), (13, y)], TO_CRISTA)
            t.poli([(15, 19), (20, 17), (19, 21)], TO)
        pes(t, [(9, 21), (10, 21), (14, 21), (15, 21)], TO_E)
    else:
        t.elipse(10, 9, 7, 6, TO)
        t.elipse(14, 18, 5, 4, TO)
        t.poli([(18, 18), (23, 15), (22, 20)], TO)
        sombrear(t, {TO: (TO_C, TO_E)})
        t.linha([(3, 11), (10, 11)], P_, 1)
        t.pxs([(5, 12), (8, 12)], BR)
        olhinho(t, 9, 6, H("c82810"))
        for y in (13, 16):
            t.pxs([(17, y), (18, y - 1)], TO_CRISTA)
        pes(t, [(11, 21), (12, 21), (16, 21), (17, 21)], TO_E)
    contorno_gba(t)


# ------------------------------------------------------------------- MARILL
MR, MR_C, MR_E = H("6890f8"), H("98b8f8"), H("3858b8")
MR_B = H("f8f8f8")


def marill(t, lado):
    if lado in ("frente", "costas"):
        t.elipse(7, 4, 3, 3, MR); t.elipse(17, 4, 3, 3, MR)        # as orelhas redondas
        t.elipse(12, 14, 8, 7, MR)
        sombrear(t, {MR: (MR_C, MR_E)})
        if lado == "frente":
            t.elipse(12, 17, 5, 4, MR_B)                          # a barriga branca
            olhinho(t, 9, 11); olhinho(t, 15, 11)
            t.pxs([(7, 14), (17, 14)], H("f898a8"))
        else:
            t.linha([(19, 18), (22, 14), (22, 9)], P_, 1)         # o rabo de mola...
            t.elipse(22, 7, 2, 2, MR)                             # ...e a bola azul
        pes(t, [(8, 21), (9, 21), (15, 21), (16, 21)], MR_E)
    else:
        t.elipse(10, 4, 3, 3, MR)
        t.elipse(11, 14, 8, 7, MR)
        t.linha([(18, 17), (22, 13), (22, 8)], P_, 1)
        t.elipse(22, 6, 2, 2, MR)
        sombrear(t, {MR: (MR_C, MR_E)})
        t.elipse(7, 17, 3, 4, MR_B)
        olhinho(t, 6, 11)
        pes(t, [(8, 21), (9, 21), (14, 21), (15, 21)], MR_E)
    contorno_gba(t)


# ------------------------------------------------------------------- WOOPER
WO, WO_C, WO_E = H("8bc5f6"), H("c5e6e6"), H("4a9cd5")
WO_GUELRA, WO_GUELRA_C = H("9462a4"), H("c57bc5")


def wooper(t, lado):
    if lado in ("frente", "costas"):
        for x, d in ((4, -1), (20, 1)):                           # as guelras-galho
            t.linha([(x - d * 2, 10), (x + d, 6)], WO_GUELRA, 1); t.linha([(x - d * 2, 10), (x + d * 2, 11)], WO_GUELRA, 1)
            t.px(x + d, 6, WO_GUELRA_C)
        t.elipse(12, 13, 8, 7, WO)
        sombrear(t, {WO: (WO_C, WO_E)})
        if lado == "frente":
            olhinho(t, 8, 10); olhinho(t, 16, 10)
            t.linha([(7, 14), (10, 16), (14, 16), (17, 14)], H("314a83"), 1)   # o sorrisão
        else:
            t.poli([(10, 19), (12, 23), (14, 19)], WO)
        pes(t, [(8, 21), (9, 21), (15, 21), (16, 21)], WO_E)
    else:
        t.linha([(10, 10), (12, 5)], WO_GUELRA, 1); t.linha([(10, 10), (14, 9)], WO_GUELRA, 1)
        t.elipse(10, 13, 8, 7, WO)
        t.poli([(16, 16), (23, 14), (21, 19)], WO)
        sombrear(t, {WO: (WO_C, WO_E)})
        olhinho(t, 5, 10)
        t.linha([(2, 14), (6, 16)], H("314a83"), 1)
        pes(t, [(7, 21), (8, 21), (13, 21), (14, 21)], WO_E)
    contorno_gba(t)


# ---------------------------------------------- AS EVOLUÇÕES DO EEVEE
# As cinco têm o mesmo corpo de raposinha; mudam as cores e o enfeite.
def _eeveelucao(t, lado, base, claro, escuro, enfeite):
    if lado in ("frente", "costas"):
        t.poli([(3, 1), (9, 7), (5, 10)], base); t.poli([(21, 1), (15, 7), (19, 10)], base)   # orelhas
        t.elipse(12, 9, 6, 5, base)                       # cabeça
        t.elipse(12, 17, 5, 3, base)                      # corpo
        for x in (7, 10, 14, 17):                         # as quatro patas
            t.ret(x, 18, x + 1, 20, base)
        if lado == "costas":
            t.poli([(13, 17), (19, 13), (21, 8), (18, 8), (16, 12)], base)   # o rabo
        sombrear(t, {base: (claro, escuro)})
        enfeite(t, lado)
        if lado == "frente":
            for x in (9, 15):                             # olhos grandes, com brilho
                t.pxs([(x, 8), (x + 1, 8), (x, 9), (x + 1, 9)], P_); t.px(x, 8, BR)
            t.px(12, 11, P_)
        pes(t, [(7, 21), (8, 21), (16, 21), (17, 21)], escuro)
    else:
        t.poli([(9, 1), (13, 9), (8, 10)], base)
        t.elipse(8, 10, 5, 4, base)
        t.elipse(14, 16, 6, 3, base)
        for x in (10, 12, 16, 18):
            t.ret(x, 18, x, 20, base)
        t.poli([(19, 16), (23, 11), (22, 8), (20, 12)], base)
        sombrear(t, {base: (claro, escuro)})
        enfeite(t, lado)
        t.pxs([(5, 9), (6, 9), (5, 10), (6, 10)], P_); t.px(5, 9, BR)
        t.px(3, 11, P_)
        pes(t, [(10, 21), (12, 21), (16, 21), (18, 21)], escuro)
    contorno_gba(t)


VA, VA_C, VA_E = H("38a088"), H("80e8d0"), H("106850")


def vaporeon(t, lado):
    def enfeite(t, lado):
        if lado != "lado":                                        # a gola branca de barbatana
            t.elipse(12, 14, 6, 1, H("e0e0e0"))
        else:
            t.elipse(10, 14, 3, 1, H("e0e0e0"))
        if lado != "lado":
            t.poli([(10, 5), (12, 1), (14, 5)], H("304078"))      # a barbatana da cabeça
        else:
            t.poli([(10, 4), (13, 0), (14, 5)], H("304078"))
    _eeveelucao(t, lado, VA, VA_C, VA_E, enfeite)


JO, JO_C, JO_E = H("f8d830"), H("f0e870"), H("d0b830")


def jolteon(t, lado):
    def enfeite(t, lado):
        xs = (6, 9, 12, 15, 18) if lado != "lado" else (10, 12)
        for x in xs:                                              # os espinhos brancos da gola
            t.poli([(x - 1, 15), (x, 12), (x + 1, 15)], H("f8f8f8"))
    _eeveelucao(t, lado, JO, JO_C, JO_E, enfeite)


FL, FL_C, FL_E = H("e04000"), H("f87800"), H("802020")


def flareon(t, lado):
    def enfeite(t, lado):
        if lado != "lado":
            t.elipse(12, 14, 6, 2, H("f8e028"))                   # a juba amarela
            t.poli([(10, 6), (12, 3), (14, 6)], H("f8e028"))      # o topete
        else:
            t.elipse(10, 14, 3, 2, H("f8e028"))
            t.poli([(20, 10), (23, 8), (22, 13)], H("f8e028"))    # a ponta do rabo
    _eeveelucao(t, lado, FL, FL_C, FL_E, enfeite)


ES, ES_C, ES_E = H("b473e6"), H("d5ace6"), H("7b52b4")


def espeon(t, lado):
    def enfeite(t, lado):
        if lado == "frente":
            t.elipse(12, 6, 1, 1, H("833941"))                    # a joia vermelha da testa
        elif lado == "lado":
            t.px(9, 7, H("833941"))
            t.pxs([(22, 9), (23, 8)], ES_E)                       # o rabo bifurcado
    _eeveelucao(t, lado, ES, ES_C, ES_E, enfeite)


UM, UM_C, UM_E = H("5a5252"), H("948383"), H("312929")


def umbreon(t, lado):
    def enfeite(t, lado):
        ouro = H("ffc500")
        if lado != "lado":
            t.anel(12, 5, 2, 1, ouro, 1)                          # o anel da testa
            t.pxs([(4, 5), (20, 5)], ouro)                        # os anéis das orelhas
        else:
            t.anel(8, 8, 1, 1, ouro, 1)
            t.px(10, 3, ouro)
            t.pxs([(21, 11), (21, 12)], ouro)                     # o anel do rabo
    _eeveelucao(t, lado, UM, UM_C, UM_E, enfeite)


# ------------------------------------------------------------------- MAREEP
LA, LA_C, LA_E = H("ffee83"), H("fff6c0"), H("e6c562")
MA_AZUL, MA_AZUL_C, MA_AZUL_E = H("4ab4e6"), H("80d0f0"), H("2094bd")


def mareep(t, lado):
    if lado in ("frente", "costas"):
        t.elipse(12, 14, 8, 6, LA)                         # a lã amarela fofa
        for x in (5, 9, 13, 17):
            t.elipse(x + 1, 9, 2, 2, LA)
        if lado == "frente":
            t.elipse(12, 12, 4, 4, MA_AZUL)                # a cara azul
        for x in (8, 15):
            t.ret(x, 19, x + 1, 20, MA_AZUL)               # as patas azuis
        if lado == "costas":
            t.poli([(11, 19), (12, 23), (13, 19)], MA_AZUL)
            t.elipse(12, 23, 1, 1, H("f8e000"))            # a bolinha do rabo
        sombrear(t, {LA: (LA_C, LA_E), MA_AZUL: (MA_AZUL_C, MA_AZUL_E)})
        if lado == "frente":
            olhinho(t, 10, 11); olhinho(t, 14, 11)
            t.pxs([(5, 11), (19, 11)], H("004a94"))        # as orelhas listradas
        pes(t, [(8, 21), (9, 21), (15, 21), (16, 21)], MA_AZUL_E)
    else:
        t.elipse(13, 14, 8, 6, LA)
        for x in (8, 12, 16):
            t.elipse(x, 9, 2, 2, LA)
        t.elipse(5, 12, 4, 3, MA_AZUL)
        t.poli([(20, 16), (23, 13), (23, 18)], MA_AZUL)
        for x in (9, 16):
            t.ret(x, 19, x + 1, 20, MA_AZUL)
        sombrear(t, {LA: (LA_C, LA_E), MA_AZUL: (MA_AZUL_C, MA_AZUL_E)})
        olhinho(t, 4, 11)
        t.px(23, 12, H("f8e000"))
        pes(t, [(9, 21), (10, 21), (16, 21), (17, 21)], MA_AZUL_E)
    contorno_gba(t)


# ------------------------------------------------------------------- HOPPIP
HO, HO_C, HO_E = H("f86050"), H("f89870"), H("d04010")
HF, HF_C, HF_E = H("60c838"), H("80e038"), H("40a020")


def hoppip(t, lado):
    t.poli([(12, 7), (3, 3), (7, 1), (12, 5)], HF); t.poli([(12, 7), (21, 3), (17, 1), (12, 5)], HF)   # as duas folhas
    t.linha([(12, 9), (12, 5)], HF_E, 1)
    t.elipse(12, 14, 6, 6, HO)                             # o corpo rosado redondo
    t.pxs([(5, 17), (4, 18), (19, 17), (20, 18)], HO)
    sombrear(t, {HO: (HO_C, HO_E), HF: (HF_C, HF_E)})
    if lado == "frente":
        olhinho(t, 10, 13); olhinho(t, 14, 13)
        t.px(12, 16, H("a01000"))
    elif lado == "lado":
        olhinho(t, 8, 13)
    pes(t, [(9, 21), (10, 21), (14, 21), (15, 21)], HO_E)
    contorno_gba(t)


# ---------------------------------------------------------------- TEDDIURSA
TE, TE_C, TE_E = H("c5a452"), H("dec573"), H("a48339")
TE_LUA = H("fff6a4")


def teddiursa(t, lado):
    if lado in ("frente", "costas"):
        t.elipse(6, 4, 2, 2, TE); t.elipse(18, 4, 2, 2, TE)   # orelhinhas redondas
        t.elipse(12, 9, 6, 5, TE)
        t.elipse(12, 18, 5, 4, TE)
        t.pxs([(6, 15), (5, 16), (18, 15), (19, 16)], TE)
        sombrear(t, {TE: (TE_C, TE_E)})
        if lado == "frente":
            olhinho(t, 9, 8); olhinho(t, 15, 8)
            t.elipse(12, 11, 2, 1, TE_LUA); t.px(12, 10, P_)
            t.poli([(10, 17), (12, 14), (14, 17), (12, 16)], TE_LUA)   # a lua crescente da barriga
        pes(t, [(9, 21), (10, 21), (14, 21), (15, 21)], TE_E)
    else:
        t.elipse(10, 4, 2, 2, TE)
        t.elipse(9, 9, 6, 5, TE)
        t.elipse(13, 18, 5, 4, TE)
        sombrear(t, {TE: (TE_C, TE_E)})
        olhinho(t, 6, 8)
        t.elipse(4, 11, 2, 1, TE_LUA); t.px(3, 10, P_)
        pes(t, [(11, 21), (12, 21), (15, 21), (16, 21)], TE_E)
    contorno_gba(t)


# ------------------------------------------------------------------- SWINUB
SW, SW_C, SW_E = H("a08038"), H("c0a050"), H("584000")
SW_NARIZ = H("f8b880")


def swinub(t, lado):
    t.elipse(12, 14, 8, 6, SW)                             # a bola de pelo
    sombrear(t, {SW: (SW_C, SW_E)})
    for x in range(6, 19, 3):                              # as listras do pelo
        t.linha([(x, 10), (x + 1, 13)], SW_E, 1)
    if lado == "frente":
        t.elipse(12, 17, 2, 1, SW_NARIZ); t.pxs([(11, 17), (13, 17)], H("784020"))
    elif lado == "lado":
        t.elipse(4, 16, 2, 1, SW_NARIZ)
    pes(t, [(8, 21), (9, 21), (15, 21), (16, 21)], SW_E)
    contorno_gba(t)


# ------------------------------------------------------------------- PHANPY
PH, PH_C, PH_E = H("98b8e8"), H("a8d0e8"), H("6090c0")
PH_ORELHA = H("f06850")


def phanpy(t, lado):
    if lado in ("frente", "costas"):
        t.elipse(4, 10, 3, 4, PH); t.elipse(20, 10, 3, 4, PH)   # as orelhonas
        t.elipse(12, 11, 6, 5, PH)
        t.elipse(12, 18, 5, 3, PH)
        for x in (7, 16):
            t.ret(x, 19, x + 1, 20, PH)
        sombrear(t, {PH: (PH_C, PH_E)})
        t.elipse(4, 10, 1, 2, PH_ORELHA); t.elipse(20, 10, 1, 2, PH_ORELHA)
        if lado == "frente":
            t.ret(11, 12, 13, 16, PH)                      # a tromba
            t.px(12, 16, PH_E)
            olhinho(t, 9, 9); olhinho(t, 15, 9)
        pes(t, [(7, 21), (8, 21), (16, 21), (17, 21)], PH_E)
    else:
        t.elipse(11, 9, 3, 4, PH)
        t.elipse(8, 11, 5, 5, PH)
        t.elipse(14, 17, 6, 3, PH)
        t.poli([(4, 12), (1, 15), (2, 16), (5, 14)], PH)   # a tromba pra frente
        sombrear(t, {PH: (PH_C, PH_E)})
        t.elipse(11, 9, 1, 2, PH_ORELHA)
        olhinho(t, 6, 9)
        pes(t, [(10, 21), (11, 21), (17, 21), (18, 21)], PH_E)
    contorno_gba(t)


# ----------------------------------------------------------------- LARVITAR
LV, LV_C, LV_E = H("78a878"), H("b0d8b0"), H("486048")
LV_BARRIGA = H("e85028")


def larvitar(t, lado):
    if lado in ("frente", "costas"):
        t.poli([(11, 3), (12, 0), (13, 3)], LV)            # o chifrinho
        t.elipse(12, 8, 6, 5, LV)
        t.elipse(12, 17, 5, 5, LV)
        sombrear(t, {LV: (LV_C, LV_E)})
        if lado == "frente":
            t.poli([(10, 15), (12, 13), (14, 15), (12, 19)], LV_BARRIGA)   # o losango vermelho da barriga
            for x in (9, 15):
                t.pxs([(x, 7), (x, 8)], H("682000")); t.px(x, 7, BR)
        else:
            t.pxs([(9, 13), (15, 13), (12, 16)], LV_E)     # os furos das costas
        pes(t, [(9, 21), (10, 21), (14, 21), (15, 21)], LV_E)
    else:
        t.poli([(9, 3), (10, 0), (12, 3)], LV)
        t.elipse(9, 8, 6, 5, LV)
        t.elipse(13, 17, 5, 5, LV)
        sombrear(t, {LV: (LV_C, LV_E)})
        t.poli([(9, 15), (10, 13), (11, 15), (10, 18)], LV_BARRIGA)
        t.pxs([(5, 7), (5, 8)], H("682000")); t.px(5, 7, BR)
        pes(t, [(11, 21), (12, 21), (15, 21), (16, 21)], LV_E)
    contorno_gba(t)


# ------------------------------------------------------------------ SENTRET
SE, SE_C, SE_E = H("906820"), H("b08838"), H("704010")
SE_CREME = H("e8d888")


def sentret(t, lado):
    if lado in ("frente", "costas"):
        if lado == "costas":                               # o rabo listrado enrolado atrás
            t.elipse(12, 6, 5, 5, SE)
            t.anel(12, 6, 3, 3, SE_CREME, 1)
        t.elipse(7, 5, 2, 2, SE); t.elipse(17, 5, 2, 2, SE)
        t.elipse(12, 10, 6, 5, SE)
        t.elipse(12, 18, 4, 4, SE)
        sombrear(t, {SE: (SE_C, SE_E)})
        if lado == "frente":
            t.elipse(12, 12, 3, 2, SE_CREME)
            t.elipse(12, 18, 2, 3, SE_CREME)
            olhinho(t, 9, 9); olhinho(t, 15, 9)
            t.px(12, 11, P_)
        pes(t, [(9, 21), (10, 21), (14, 21), (15, 21)], SE_E)
    else:
        t.elipse(18, 9, 4, 6, SE)                          # o rabo em pé
        t.linha([(17, 5), (20, 5)], SE_CREME, 1); t.linha([(17, 9), (21, 9)], SE_CREME, 1); t.linha([(17, 13), (20, 13)], SE_CREME, 1)
        t.elipse(10, 5, 2, 2, SE)
        t.elipse(9, 10, 5, 5, SE)
        t.elipse(12, 18, 4, 4, SE)
        sombrear(t, {SE: (SE_C, SE_E)})
        t.elipse(6, 12, 2, 2, SE_CREME)
        olhinho(t, 6, 9)
        pes(t, [(10, 21), (11, 21), (14, 21), (15, 21)], SE_E)
    contorno_gba(t)


# ----------------------------------------------------------------- HOOTHOOT
HH, HH_C, HH_E = H("ac9c20"), H("ded55a"), H("7b6a10")
HH_ANEL, HH_BICO = H("f6ffbd"), H("e67b29")


def hoothoot(t, lado):
    if lado in ("frente", "costas"):
        t.elipse(12, 14, 7, 7, HH)                         # a coruja redonda
        t.pxs([(11, 6), (12, 5), (13, 6)], HH_E)           # o relógio de pena na cabeça
        sombrear(t, {HH: (HH_C, HH_E)})
        if lado == "frente":
            for x in (9, 15):                              # os olhões com o anel claro
                t.elipse(x, 12, 2, 2, HH_ANEL); t.elipse(x, 12, 1, 1, P_); t.px(x - 1, 11, BR)
            t.poli([(11, 15), (13, 15), (12, 17)], HH_BICO)
        pes(t, [(9, 21), (10, 21), (14, 21), (15, 21)], HH_BICO)
    else:
        t.elipse(12, 14, 7, 7, HH)
        t.pxs([(11, 6), (12, 5)], HH_E)
        sombrear(t, {HH: (HH_C, HH_E)})
        t.elipse(7, 12, 2, 2, HH_ANEL); t.elipse(7, 12, 1, 1, P_)
        t.poli([(4, 14), (6, 14), (5, 16)], HH_BICO)
        pes(t, [(10, 21), (11, 21), (14, 21), (15, 21)], HH_BICO)
    contorno_gba(t)


# --------------------------------------------------------------------- NATU
NA, NA_C, NA_E = H("50c048"), H("98e048"), H("3a8a30")
NA_ASA, NA_BICO = H("f84800"), H("f8d840")


def natu(t, lado):
    t.elipse(12, 14, 7, 7, NA)                             # a bolinha verde
    t.pxs([(11, 6), (12, 6), (13, 6), (12, 5)], NA_E)      # o topete preto
    sombrear(t, {NA: (NA_C, NA_E)})
    if lado == "frente":
        olhinho(t, 9, 12); olhinho(t, 15, 12)
        t.poli([(11, 15), (13, 15), (12, 17)], NA_BICO)
        t.pxs([(5, 16), (19, 16)], NA_ASA)
    elif lado == "costas":
        t.elipse(12, 14, 4, 4, NA_ASA)                     # as asinhas vermelhas e amarelas
        t.elipse(12, 15, 2, 2, NA_BICO)
    else:
        olhinho(t, 7, 12)
        t.poli([(4, 14), (6, 14), (5, 16)], NA_BICO)
        t.elipse(14, 15, 3, 3, NA_ASA)
    pes(t, [(9, 21), (10, 21), (14, 21), (15, 21)], NA_BICO)
    contorno_gba(t)


# -------------------------------------------------------------------- AIPOM
AI, AI_C, AI_E = H("b462e6"), H("d090f0"), H("8b39b4")
AI_CREME = H("ffeea4")


def aipom(t, lado):
    mao = lambda x, y: (t.elipse(x, y, 2, 2, AI_CREME))
    if lado in ("frente", "costas"):
        if lado == "costas":                               # o rabo de mão, pra cima
            t.linha([(12, 18), (17, 12), (18, 5)], AI, 2)
            mao(18, 4)
        t.elipse(5, 9, 2, 2, AI_CREME); t.elipse(19, 9, 2, 2, AI_CREME)   # orelhas
        t.elipse(12, 10, 6, 5, AI)
        t.elipse(12, 18, 4, 4, AI)
        sombrear(t, {AI: (AI_C, AI_E)})
        if lado == "frente":
            t.elipse(12, 11, 4, 3, AI_CREME)
            olhinho(t, 10, 10); olhinho(t, 14, 10)
            t.linha([(10, 13), (14, 13)], H("52206a"), 1)
        pes(t, [(9, 21), (10, 21), (14, 21), (15, 21)], AI_E)
    else:
        t.linha([(14, 18), (19, 13), (21, 6)], AI, 2)
        mao(21, 5)
        t.elipse(11, 8, 2, 2, AI_CREME)
        t.elipse(9, 10, 5, 5, AI)
        t.elipse(12, 18, 4, 4, AI)
        sombrear(t, {AI: (AI_C, AI_E)})
        t.elipse(6, 11, 3, 3, AI_CREME)
        olhinho(t, 6, 10)
        pes(t, [(10, 21), (11, 21), (14, 21), (15, 21)], AI_E)
    contorno_gba(t)


# --------------------------------------------------------------- MISDREAVUS
MI, MI_C, MI_E = H("709890"), H("90b8b0"), H("486870")
MI_COLAR, MI_OLHO = H("a81048"), H("e85890")


def misdreavus(t, lado):
    t.poli([(6, 12), (5, 19), (8, 22), (11, 19), (13, 22), (16, 19), (19, 22), (19, 12)], MI)   # o cabelo-saia ondulado
    t.elipse(12, 10, 7, 6, MI)
    sombrear(t, {MI: (MI_C, MI_E)})
    if lado == "frente":
        for x in (9, 15):
            t.pxs([(x, 9), (x, 10)], MI_OLHO); t.px(x, 9, BR)
        for x in (8, 12, 16):                              # as pérolas do colar
            t.elipse(x, 14, 1, 1, MI_COLAR)
    elif lado == "lado":
        t.pxs([(7, 9), (7, 10)], MI_OLHO); t.px(7, 9, BR)
        t.elipse(7, 14, 1, 1, MI_COLAR)
    contorno_gba(t)


# ------------------------------------------------------------------- SLUGMA
SG, SG_C, SG_E = H("d85820"), H("f88048"), H("902000")
SG_GOTA = H("f8d070")


def slugma(t, lado):
    if lado == "lado":
        t.elipse(9, 11, 6, 6, SG)                          # a cabeça de lava
        t.poli([(4, 16), (22, 18), (22, 22), (4, 22)], SG)   # o corpo escorrendo pra trás
        sombrear(t, {SG: (SG_C, SG_E)})
        olhinho(t, 6, 10, H("f8e898"), brilho=False)
        for x, y in ((12, 7), (16, 19), (10, 16)):
            t.px(x, y, SG_GOTA)
    else:
        t.elipse(12, 10, 6, 6, SG)
        t.poli([(5, 15), (19, 15), (21, 22), (3, 22)], SG)
        sombrear(t, {SG: (SG_C, SG_E)})
        if lado == "frente":
            for x in (9, 15):
                t.pxs([(x, 9), (x, 10)], H("f8e898"))
            t.linha([(10, 13), (14, 13)], SG_E, 1)
        for x, y in ((8, 6), (16, 7), (6, 19), (18, 19)):
            t.px(x, y, SG_GOTA)
    contorno_gba(t)


# ---------------------------------------------------------------- WOBBUFFET
WB, WB_C, WB_E = H("68b8d8"), H("98d0e8"), H("4898b8")


def wobbuffet(t, lado):
    t.elipse(12, 13, 7, 9, WB)                             # o corpo de saco de pancada
    t.pxs([(5, 9), (4, 10), (19, 9), (20, 10)], WB)        # os bracinhos colados
    sombrear(t, {WB: (WB_C, WB_E)})
    if lado == "frente":
        t.linha([(8, 8), (10, 8)], P_, 1); t.linha([(14, 8), (16, 8)], P_, 1)   # os olhos fechados de sempre
        t.linha([(9, 13), (15, 13)], H("a01000"), 1)
    elif lado == "costas":
        t.poli([(17, 18), (22, 16), (21, 21)], P_)         # o rabo preto com olhos
        t.pxs([(20, 17), (20, 19)], BR)
    else:
        t.linha([(5, 8), (7, 8)], P_, 1)
    pes(t, [(9, 22), (10, 22), (14, 22), (15, 22)], WB_E)
    contorno_gba(t)


# ----------------------------------------------------------------- DELIBIRD
DL, DL_C, DL_E = H("d54100"), H("ff7310"), H("943100")
DL_B = H("ffffff")


def delibird(t, lado):
    if lado in ("frente", "costas"):
        t.elipse(12, 15, 7, 6, DL)
        t.elipse(12, 8, 5, 4, DL)
        t.poli([(4, 12), (2, 16), (6, 16)], DL); t.poli([(20, 12), (22, 16), (18, 16)], DL)
        sombrear(t, {DL: (DL_C, DL_E)})
        if lado == "frente":
            t.elipse(12, 16, 5, 4, DL_B)                   # a barriga branca
            olhinho(t, 10, 7); olhinho(t, 14, 7)
            t.poli([(11, 10), (13, 10), (12, 12)], H("ffbd6a"))
        else:
            t.poli([(4, 6), (8, 3), (10, 10), (5, 11)], DL_B)   # o saco de presente nas costas
            t.linha([(6, 5), (8, 9)], H("d5d5d5"), 1)
        pes(t, [(9, 21), (10, 21), (14, 21), (15, 21)], H("ffbd6a"))
    else:
        t.elipse(12, 15, 7, 6, DL)
        t.elipse(9, 8, 5, 4, DL)
        t.poli([(16, 4), (21, 3), (22, 10), (17, 11)], DL_B)   # o saco
        sombrear(t, {DL: (DL_C, DL_E)})
        t.elipse(9, 16, 4, 4, DL_B)
        olhinho(t, 7, 7)
        t.poli([(3, 9), (5, 9), (4, 11)], H("ffbd6a"))
        pes(t, [(10, 21), (11, 21), (14, 21), (15, 21)], H("ffbd6a"))
    contorno_gba(t)


# ----------------------------------------------------------------- SMOOCHUM
SM, SM_C, SM_E = H("ff94a4"), H("ffc0c8"), H("de4a7b")
SM_CABELO, SM_CABELO_E = H("ffe652"), H("bdac29")


def smoochum(t, lado):
    t.elipse(12, 8, 6, 5, SM_CABELO)                       # o cabelo loiro
    t.elipse(12, 11, 5, 4, SM)
    t.elipse(12, 18, 4, 3, SM_E)                           # o vestidinho
    sombrear(t, {SM: (SM_C, SM_E), SM_CABELO: (H("fff0a0"), SM_CABELO_E)})
    if lado == "frente":
        t.elipse(12, 6, 4, 2, SM_CABELO)                   # a franja
        olhinho(t, 10, 11, H("8b105a")); olhinho(t, 14, 11, H("8b105a"))
        t.pxs([(11, 14), (12, 14), (13, 14)], H("8b105a"))   # o bico dos lábios
    elif lado == "lado":
        olhinho(t, 8, 11, H("8b105a"))
        t.pxs([(6, 14), (7, 14)], H("8b105a"))
    pes(t, [(9, 21), (10, 21), (14, 21), (15, 21)], SM_E)
    contorno_gba(t)


# ------------------------------------------------------------------- ELEKID
EL, EL_C, EL_E = H("f6c54a"), H("ffe69c"), H("b46a00")


def elekid(t, lado):
    for x in (8, 16):                                      # os pinos da cabeça
        t.ret(x, 2, x + 1, 5, H("6a6a6a"))
    t.elipse(12, 9, 6, 5, EL)
    t.elipse(12, 18, 4, 4, EL)
    t.pxs([(6, 16), (5, 17), (18, 16), (19, 17)], EL)
    sombrear(t, {EL: (EL_C, EL_E)})
    t.poli([(9, 15), (14, 15), (11, 18), (14, 18), (10, 21)], H("313141"))   # o raio preto da barriga
    if lado == "frente":
        olhinho(t, 9, 8); olhinho(t, 15, 8)
        t.linha([(10, 11), (14, 11)], EL_E, 1)
    elif lado == "lado":
        olhinho(t, 7, 8)
    pes(t, [(9, 21), (10, 21), (14, 21), (15, 21)], H("313141"))
    contorno_gba(t)


# -------------------------------------------------------------------- MAGBY
MB, MB_C, MB_E = H("d55239"), H("ff7b62"), H("943120")
MB_FOGO = H("f6d539")


def magby(t, lado):
    t.poli([(9, 5), (12, 0), (15, 5)], MB_FOGO)            # a chama da cabeça
    t.elipse(12, 9, 6, 5, MB)
    t.elipse(12, 18, 4, 4, MB)
    sombrear(t, {MB: (MB_C, MB_E)})
    t.elipse(12, 18, 2, 3, H("ffc583"))                    # a barriga
    if lado == "frente":
        olhinho(t, 9, 9); olhinho(t, 15, 9)
        t.elipse(12, 11, 2, 1, H("ffc583"))
    elif lado == "lado":
        olhinho(t, 7, 9)
        t.elipse(6, 11, 2, 1, H("ffc583"))
    else:
        t.poli([(14, 19), (19, 21), (18, 17)], MB)
    pes(t, [(9, 21), (10, 21), (14, 21), (15, 21)], MB_E)
    contorno_gba(t)


# ------------------------------------------------------------------- LEDYBA
LE, LE_C, LE_E = H("e85018"), H("f08048"), H("b04028")


def ledyba(t, lado):
    t.elipse(12, 14, 7, 6, LE)                             # o casco vermelho de joaninha
    t.elipse(12, 7, 4, 3, P_)                              # a cabeça preta
    sombrear(t, {LE: (LE_C, LE_E)})
    for x, y in ((9, 12), (15, 12), (9, 17), (15, 17)):    # as pintas pretas
        t.elipse(x, y, 1, 1, P_)
    if lado != "frente":
        t.linha([(12, 9), (12, 20)], P_, 1)                # a costura das asas
    else:
        t.pxs([(10, 6), (14, 6)], BR)                      # os olhos
    t.linha([(10, 4), (8, 1)], P_, 1); t.linha([(14, 4), (16, 1)], P_, 1)   # antenas
    pes(t, [(9, 21), (10, 21), (14, 21), (15, 21)], P_)
    contorno_gba(t)


DESENHOS = {172: pichu, 174: igglybuff, 152: chikorita, 155: cyndaquil, 158: totodile,
            183: marill, 194: wooper, 134: vaporeon, 135: jolteon, 136: flareon,
            196: espeon, 197: umbreon, 179: mareep, 187: hoppip, 216: teddiursa,
            220: swinub, 231: phanpy, 246: larvitar, 161: sentret, 163: hoothoot,
            177: natu, 190: aipom, 200: misdreavus, 218: slugma, 202: wobbuffet,
            225: delibird, 238: smoochum, 239: elekid, 240: magby, 165: ledyba}
TAMANHO = {172: 0.72, 174: 0.72, 152: 0.82, 155: 0.8, 158: 0.82, 183: 0.78, 194: 0.78,
           179: 0.82, 187: 0.72, 216: 0.78, 220: 0.72, 231: 0.8, 246: 0.82,
           161: 0.8, 163: 0.75, 177: 0.65, 190: 0.82, 200: 0.85, 218: 0.75,
           225: 0.9, 238: 0.75, 239: 0.75, 240: 0.75, 165: 0.8}
