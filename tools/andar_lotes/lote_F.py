"""Lote F: os iniciais de Hoenn, a Ralts, o Zigzagoon e o Wingull — andando
no mapa (formato em tools/andar_base.py)."""
from andar_base import *  # noqa: F401,F403


# ------------------------------------------------------------------ TREECKO
TR, TR_C, TR_E = H("98d048"), H("b8f870"), H("70a830")
TR_BARRIGA, TR_RABO = H("f86850"), H("488858")


def treecko(t, lado):
    if lado in ("frente", "costas"):
        if lado == "costas":
            t.elipse(12, 12, 6, 7, TR_RABO)                # o rabo grande de folha
        t.elipse(12, 8, 6, 5, TR)                          # a cabeça larga
        t.elipse(12, 17, 4, 4, TR)
        t.pxs([(7, 16), (6, 17), (17, 16), (18, 17)], TR)
        sombrear(t, {TR: (TR_C, TR_E), TR_RABO: (H("58a070"), H("306038"))})
        if lado == "frente":
            t.elipse(12, 18, 2, 2, TR_BARRIGA)             # a barriga vermelha
            for x in (8, 16):                              # os olhos amarelos de lagartixa
                t.pxs([(x, 7), (x + 1 if x < 12 else x - 1, 7)], H("f8e050")); t.px(x, 7, P_)
            t.linha([(9, 10), (15, 10)], TR_E, 1)
        pes(t, [(9, 21), (10, 21), (14, 21), (15, 21)], TR_E)
    else:
        t.elipse(18, 12, 4, 7, TR_RABO)
        t.elipse(8, 8, 6, 5, TR)
        t.elipse(12, 17, 4, 4, TR)
        sombrear(t, {TR: (TR_C, TR_E), TR_RABO: (H("58a070"), H("306038"))})
        t.elipse(10, 18, 2, 2, TR_BARRIGA)
        t.pxs([(5, 7), (6, 7)], H("f8e050")); t.px(5, 7, P_)
        t.linha([(2, 10), (6, 10)], TR_E, 1)
        pes(t, [(10, 21), (11, 21), (14, 21), (15, 21)], TR_E)
    contorno_gba(t)


# ------------------------------------------------------------------ TORCHIC
TC, TC_C, TC_E = H("f86838"), H("f8a038"), H("d05838")
TC_AMARELO, TC_AMARELO_E = H("f8d060"), H("d09838")


def torchic(t, lado):
    t.poli([(10, 4), (12, 0), (14, 4)], TC_AMARELO)        # o topete
    t.elipse(12, 12, 7, 7, TC)                             # a bolinha de pintinho
    sombrear(t, {TC: (TC_C, TC_E)})
    if lado == "frente":
        t.elipse(12, 16, 4, 3, TC_AMARELO)                 # o peito amarelo
        olhinho(t, 9, 10); olhinho(t, 15, 10)
        t.poli([(11, 12), (13, 12), (12, 14)], TC_AMARELO_E)   # o bico
    elif lado == "costas":
        t.poli([(10, 16), (12, 20), (14, 16)], TC_AMARELO)
    else:
        t.elipse(10, 16, 3, 3, TC_AMARELO)
        olhinho(t, 7, 10)
        t.poli([(3, 12), (5, 11), (5, 13)], TC_AMARELO_E)
    pes(t, [(9, 21), (10, 21), (14, 21), (15, 21)], TC_AMARELO_E)
    contorno_gba(t)


# ------------------------------------------------------------------- MUDKIP
MD, MD_C, MD_E = H("58a8e0"), H("78c0f8"), H("3080c0")
MD_LARANJA = H("f8b050")


def mudkip(t, lado):
    if lado in ("frente", "costas"):
        t.poli([(9, 4), (12, 0), (15, 4)], MD)             # a barbatana da cabeça
        t.elipse(12, 12, 8, 6, MD)
        for x in (6, 17):
            t.ret(x, 17, x + 1, 20, MD)
        sombrear(t, {MD: (MD_C, MD_E)})
        for x, d in ((3, -1), (21, 1)):                     # as guelras laranja das bochechas
            t.poli([(x - d * 2, 11), (x, 9), (x, 15)], MD_LARANJA)
        if lado == "frente":
            olhinho(t, 9, 11); olhinho(t, 15, 11)
            t.linha([(10, 14), (14, 14)], MD_E, 1)
        else:
            t.poli([(10, 16), (12, 22), (14, 16)], MD)     # o rabo de barbatana
            t.linha([(12, 17), (12, 21)], H("b0b8f0"), 1)
        pes(t, [(6, 21), (7, 21), (17, 21), (18, 21)], MD_E)
    else:
        t.poli([(11, 4), (14, 0), (16, 5)], MD)
        t.elipse(11, 12, 8, 6, MD)
        t.poli([(18, 12), (23, 9), (23, 16)], MD)
        sombrear(t, {MD: (MD_C, MD_E)})
        t.poli([(12, 11), (14, 8), (14, 14)], MD_LARANJA)
        olhinho(t, 6, 11)
        t.linha([(3, 14), (6, 14)], MD_E, 1)
        pes(t, [(7, 21), (8, 21), (15, 21), (16, 21)], MD_E)
    contorno_gba(t)


# -------------------------------------------------------------------- RALTS
RA_CAB, RA_CAB_C, RA_CAB_E = H("70b870"), H("c8f8a8"), H("307848")
RA, RA_C, RA_E = H("e8e8f8"), H("ffffff"), H("c0c8d8")
RA_CHIFRE = H("e05038")


def ralts(t, lado):
    t.elipse(12, 7, 6, 5, RA_CAB)                          # o capacete de cabelo verde
    t.poli([(7, 10), (12, 13), (17, 10), (16, 15), (8, 15)], RA_CAB)
    t.poli([(8, 14), (16, 14), (18, 22), (6, 22)], RA)     # o vestido branco
    sombrear(t, {RA_CAB: (RA_CAB_C, RA_CAB_E), RA: (RA_C, RA_E)})
    if lado == "frente":
        t.poli([(9, 3), (11, 1), (11, 4)], RA_CHIFRE); t.poli([(15, 3), (13, 1), (13, 4)], RA_CHIFRE)   # os chifrinhos
        t.linha([(9, 11), (15, 11)], RA_CAB_E, 1)          # a franja tapando os olhos
    elif lado == "costas":
        t.poli([(9, 3), (11, 1), (11, 4)], RA_CHIFRE); t.poli([(15, 3), (13, 1), (13, 4)], RA_CHIFRE)
    else:
        t.poli([(8, 3), (10, 0), (10, 4)], RA_CHIFRE)
        t.px(7, 11, RA_CAB_E)
    contorno_gba(t)


# ---------------------------------------------------------------- ZIGZAGOON
ZG, ZG_C, ZG_E = H("c0a888"), H("e0d0a8"), H("685848")
ZG_LISTRA = H("685848")


def zigzagoon(t, lado):
    if lado in ("frente", "costas"):
        t.poli([(5, 5), (8, 9), (5, 10)], ZG); t.poli([(19, 5), (16, 9), (19, 10)], ZG)
        t.elipse(12, 11, 7, 5, ZG)
        t.elipse(12, 18, 6, 3, ZG)
        if lado == "costas":
            t.elipse(12, 16, 4, 4, ZG)                     # o rabo
        sombrear(t, {ZG: (ZG_C, ZG_E)})
        if lado == "frente":
            t.linha([(6, 11), (10, 11)], ZG_LISTRA, 1); t.linha([(14, 11), (18, 11)], ZG_LISTRA, 1)   # a máscara
            olhinho(t, 9, 11, H("100000")); olhinho(t, 15, 11, H("100000"))
            t.elipse(12, 13, 1, 1, P_)
        else:
            for y in (13, 16, 19):                         # as listras em zigue-zague
                t.linha([(8, y), (10, y + 1), (12, y), (14, y + 1), (16, y)], ZG_LISTRA, 1)
        pes(t, [(8, 21), (9, 21), (15, 21), (16, 21)], ZG_E)
    else:
        t.poli([(8, 5), (11, 9), (7, 10)], ZG)
        t.elipse(7, 12, 5, 4, ZG)
        t.elipse(14, 16, 7, 4, ZG)
        t.elipse(21, 14, 2, 3, ZG)
        sombrear(t, {ZG: (ZG_C, ZG_E)})
        for x in (11, 14, 17):
            t.linha([(x, 13), (x + 1, 15), (x, 17)], ZG_LISTRA, 1)
        t.linha([(3, 11), (7, 11)], ZG_LISTRA, 1)
        olhinho(t, 5, 11, H("100000"))
        t.px(2, 13, P_)
        pes(t, [(9, 21), (10, 21), (17, 21), (18, 21)], ZG_E)
    contorno_gba(t)


# ------------------------------------------------------------------ WINGULL
WG, WG_C, WG_E = H("f0e8f8"), H("ffffff"), H("c0b8e0")
WG_ASA, WG_BICO = H("5070e0"), H("f8c040")


def wingull(t, lado):
    if lado == "lado":
        t.elipse(10, 12, 6, 4, WG)
        t.poli([(9, 10), (16, 4), (23, 7), (15, 12)], WG_ASA)   # a asa comprida
        t.poli([(2, 12), (5, 11), (5, 14)], WG_BICO)
        sombrear(t, {WG: (WG_C, WG_E)})
        t.pxs([(7, 11)], P_)
    else:
        t.poli([(1, 9), (8, 10), (8, 13), (1, 13)], WG_ASA)     # as duas asas abertas
        t.poli([(23, 9), (16, 10), (16, 13), (23, 13)], WG_ASA)
        t.elipse(12, 12, 5, 4, WG)
        sombrear(t, {WG: (WG_C, WG_E)})
        if lado == "frente":
            t.poli([(10, 14), (14, 14), (12, 18)], WG_BICO)
            t.pxs([(10, 11), (14, 11)], P_)
    contorno_gba(t)


# ---------------------------------------------------------------- POOCHYENA
PO, PO_C, PO_E = H("a098a8"), H("c0b8c8"), H("807888")
PO_PRETO = H("303040")


def poochyena(t, lado):
    if lado in ("frente", "costas"):
        t.poli([(5, 3), (9, 8), (5, 9)], PO_PRETO); t.poli([(19, 3), (15, 8), (19, 9)], PO_PRETO)
        t.elipse(12, 10, 6, 5, PO)
        t.elipse(12, 17, 5, 4, PO)
        for x in (7, 16):
            t.ret(x, 18, x + 1, 20, PO_PRETO)
        sombrear(t, {PO: (PO_C, PO_E)})
        t.poli([(8, 6), (12, 4), (16, 6), (12, 9)], PO_PRETO)   # a máscara preta de cima
        if lado == "frente":
            for x in (9, 15):
                t.pxs([(x, 10), (x, 11)], H("f0d000")); t.px(x, 11, H("c03020"))   # olhos amarelos e vermelhos
            t.elipse(12, 13, 1, 1, P_)
        else:
            t.elipse(12, 17, 3, 3, PO_PRETO)               # o pelo escuro das costas
        pes(t, [(7, 21), (8, 21), (16, 21), (17, 21)], PO_PRETO)
    else:
        t.poli([(8, 3), (11, 8), (7, 9)], PO_PRETO)
        t.elipse(7, 11, 5, 4, PO)
        t.elipse(14, 16, 6, 4, PO)
        t.poli([(19, 15), (23, 11), (22, 17)], PO_PRETO)
        for x in (10, 17):
            t.ret(x, 18, x + 1, 20, PO_PRETO)
        sombrear(t, {PO: (PO_C, PO_E)})
        t.elipse(14, 14, 4, 2, PO_PRETO)
        t.pxs([(5, 10), (5, 11)], H("f0d000"))
        t.px(2, 12, P_)
        pes(t, [(10, 21), (11, 21), (17, 21), (18, 21)], PO_PRETO)
    contorno_gba(t)


# ------------------------------------------------------------------ WURMPLE
WU, WU_C, WU_E = H("c85058"), H("f07860"), H("a03040")
WU_CREME = H("d8d0a0")


def wurmple(t, lado):
    if lado == "lado":
        for i, x in enumerate((18, 14, 10)):               # os gomos da lagarta
            t.elipse(x, 17, 3, 3, WU)
        t.elipse(6, 13, 4, 4, WU)
        sombrear(t, {WU: (WU_C, WU_E)})
        for x in (10, 14, 18):
            t.pxs([(x - 1, 15), (x, 14), (x + 1, 15)], WU_CREME)   # os espinhos claros
        t.linha([(7, 9), (9, 5)], WU_CREME, 1)             # o chifre da testa
        t.pxs([(4, 12)], P_)
        pes(t, [(9, 21), (13, 21), (17, 21)], WU_CREME)
    else:
        t.elipse(12, 17, 6, 4, WU)
        t.elipse(12, 10, 5, 5, WU)
        sombrear(t, {WU: (WU_C, WU_E)})
        t.linha([(12, 5), (12, 1)], WU_CREME, 1); t.linha([(9, 6), (7, 3)], WU_CREME, 1); t.linha([(15, 6), (17, 3)], WU_CREME, 1)
        if lado == "frente":
            olhinho(t, 10, 10); olhinho(t, 14, 10)
            t.elipse(12, 13, 2, 1, WU_CREME)
        else:
            for x in (7, 12, 17):
                t.pxs([(x - 1, 16), (x, 15), (x + 1, 16)], WU_CREME)
        pes(t, [(8, 21), (10, 21), (14, 21), (16, 21)], WU_CREME)
    contorno_gba(t)


# -------------------------------------------------------------------- LOTAD
LO, LO_C, LO_E = H("60b830"), H("78d048"), H("488828")
LO_CORPO, LO_CORPO_C, LO_CORPO_E = H("307090"), H("4890b0"), H("204858")


def lotad(t, lado):
    t.elipse(12, 16, 7, 5, LO_CORPO)                       # o corpo azul
    t.elipse(12, 9, 10, 4, LO)                             # a folha de vitória-régia na cabeça
    sombrear(t, {LO: (LO_C, LO_E), LO_CORPO: (LO_CORPO_C, LO_CORPO_E)})
    t.linha([(12, 6), (12, 12)], LO_E, 1)
    if lado == "frente":
        olhinho(t, 9, 15); olhinho(t, 15, 15)
        t.elipse(12, 18, 2, 1, H("f8d048"))                # o bico amarelo
    elif lado == "lado":
        olhinho(t, 7, 15)
        t.elipse(5, 18, 2, 1, H("f8d048"))
    pes(t, [(7, 21), (8, 21), (16, 21), (17, 21)], LO_CORPO_E)
    contorno_gba(t)


# ------------------------------------------------------------------- SEEDOT
SD, SD_C, SD_E = H("985830"), H("d09030"), H("604020")
SD_CHAPEU, SD_CHAPEU_C, SD_CHAPEU_E = H("505020"), H("789050"), H("383810")
SD_CARA = H("f8e8a8")


def seedot(t, lado):
    t.elipse(12, 15, 6, 7, SD)                             # a bolota
    t.elipse(12, 7, 6, 3, SD_CHAPEU)                       # o chapéu
    t.ret(11, 2, 12, 4, SD_CHAPEU)                         # o cabinho
    sombrear(t, {SD: (SD_C, SD_E), SD_CHAPEU: (SD_CHAPEU_C, SD_CHAPEU_E)})
    if lado == "frente":
        t.elipse(12, 12, 4, 2, SD_CARA)                    # a faixa clara da cara
        olhinho(t, 10, 11); olhinho(t, 14, 11)
    elif lado == "lado":
        t.elipse(9, 12, 3, 2, SD_CARA)
        olhinho(t, 8, 11)
    pes(t, [(9, 22), (10, 22), (14, 22), (15, 22)], SD_E)
    contorno_gba(t)


# ---------------------------------------------------------------- SHROOMISH
SH, SH_C, SH_E = H("eec58b"), H("ffe6ac"), H("d5a45a")
SH_TOPO, SH_TOPO_C, SH_TOPO_E = H("5a834a"), H("8bc583"), H("415231")


def shroomish(t, lado):
    t.elipse(12, 15, 7, 6, SH)                             # o cogumelo creme
    t.elipse(12, 9, 6, 4, SH_TOPO)                         # o chapéu verde
    sombrear(t, {SH: (SH_C, SH_E), SH_TOPO: (SH_TOPO_C, SH_TOPO_E)})
    for x, y in ((9, 8), (14, 7), (12, 10)):
        t.px(x, y, SH_TOPO_C)                              # as pintas do chapéu
    if lado == "frente":
        olhinho(t, 9, 14); olhinho(t, 15, 14)
        t.linha([(11, 17), (13, 17)], H("946a31"), 1)
    elif lado == "lado":
        olhinho(t, 7, 14)
    pes(t, [(8, 21), (9, 21), (15, 21), (16, 21)], SH_E)
    contorno_gba(t)


# ------------------------------------------------------------------ SLAKOTH
SK, SK_C, SK_E = H("b4946a"), H("cdb48b"), H("8b6a41")
SK_CARA = H("e6cda4")


def slakoth(t, lado):
    if lado == "lado":
        t.elipse(13, 15, 8, 5, SK)                         # deitado de preguiça
        t.elipse(5, 13, 4, 4, SK)
        sombrear(t, {SK: (SK_C, SK_E)})
        t.elipse(4, 14, 2, 2, SK_CARA)
        t.linha([(3, 12), (5, 12)], P_, 1)                 # o olho de sono
        t.px(2, 14, H("d06070"))
        pes(t, [(9, 21), (10, 21), (17, 21), (18, 21)], SK_E)
    else:
        t.elipse(12, 15, 7, 6, SK)
        t.elipse(12, 8, 5, 4, SK)
        sombrear(t, {SK: (SK_C, SK_E)})
        if lado == "frente":
            t.elipse(12, 9, 4, 3, SK_CARA)
            t.linha([(9, 8), (11, 9)], P_, 1); t.linha([(13, 9), (15, 8)], P_, 1)   # olhos pesados
            t.px(12, 10, H("d06070"))
        pes(t, [(7, 21), (8, 21), (16, 21), (17, 21)], SK_E)
    contorno_gba(t)


# ------------------------------------------------------------------- SKITTY
SKI, SKI_C, SKI_E = H("f8a890"), H("f8c8b8"), H("f88068")
SKI_CREME = H("f8f090")


def skitty(t, lado):
    if lado in ("frente", "costas"):
        t.poli([(4, 3), (9, 8), (5, 11)], SKI); t.poli([(20, 3), (15, 8), (19, 11)], SKI)
        t.elipse(12, 11, 6, 5, SKI)
        t.elipse(12, 18, 4, 3, SKI)
        if lado == "costas":                               # o rabo com a bolinha
            t.linha([(14, 18), (19, 14), (19, 9)], SKI, 1)
            t.elipse(19, 7, 2, 2, SKI_E)
        sombrear(t, {SKI: (SKI_C, SKI_E)})
        if lado == "frente":
            t.elipse(12, 13, 4, 2, SKI_CREME)              # o focinho creme
            t.pxs([(9, 10), (10, 11), (15, 10), (14, 11)], P_)   # os olhinhos fechados de sorriso
            t.px(12, 13, H("c05038"))
        pes(t, [(9, 21), (10, 21), (14, 21), (15, 21)], SKI_E)
    else:
        t.poli([(8, 2), (12, 9), (7, 10)], SKI)
        t.elipse(8, 11, 5, 5, SKI)
        t.elipse(13, 18, 4, 3, SKI)
        t.linha([(16, 18), (20, 14), (21, 8)], SKI, 1)
        t.elipse(21, 7, 2, 2, SKI_E)
        sombrear(t, {SKI: (SKI_C, SKI_E)})
        t.elipse(5, 13, 2, 2, SKI_CREME)
        t.pxs([(6, 10), (7, 11)], P_)
        pes(t, [(11, 21), (12, 21), (15, 21), (16, 21)], SKI_E)
    contorno_gba(t)


# --------------------------------------------------------------------- ARON
AR, AR_C, AR_E = H("bdacac"), H("decdcd"), H("6a6a6a")
AR_PRETO = H("4a4a41")


def aron(t, lado):
    t.elipse(12, 16, 7, 5, AR_PRETO)                       # o corpo preto
    t.elipse(12, 10, 7, 5, AR)                             # a armadura de aço
    sombrear(t, {AR: (AR_C, AR_E), AR_PRETO: (H("6a6a6a"), H("202018"))})
    if lado == "frente":
        for x in (8, 16):
            t.pxs([(x, 10), (x, 11)], H("6abdff")); t.px(x, 10, BR)   # os olhos azuis
        t.linha([(9, 8), (15, 8)], AR_E, 1)
    elif lado == "lado":
        t.pxs([(6, 10), (6, 11)], H("6abdff"))
    for x in (7, 17):
        t.px(x, 6, AR_E)                                   # os furinhos da armadura
    pes(t, [(7, 21), (8, 21), (16, 21), (17, 21)], AR_PRETO)
    contorno_gba(t)


# ------------------------------------------- PLUSLE e MINUN (os gêmeos)
PM_CREME, PM_CREME_C, PM_CREME_E = H("ffeec5"), H("fff6de"), H("eed583")


def _gemeo(t, lado, cor, sinal):
    if lado in ("frente", "costas"):
        t.poli([(4, 2), (9, 8), (6, 11)], cor); t.poli([(20, 2), (15, 8), (18, 11)], cor)   # as orelhas coloridas
        t.elipse(12, 12, 6, 5, PM_CREME)
        t.elipse(12, 19, 4, 3, PM_CREME)
        sombrear(t, {PM_CREME: (PM_CREME_C, PM_CREME_E)})
        if lado == "frente":
            olhinho(t, 9, 11); olhinho(t, 15, 11)
            t.elipse(7, 14, 1, 1, cor); t.elipse(17, 14, 1, 1, cor)      # as bochechas
            sinal(t, 12, 17)
        else:
            t.poli([(14, 19), (19, 15), (18, 12)], cor)    # o rabo de raio
        pes(t, [(9, 21), (10, 21), (14, 21), (15, 21)], PM_CREME_E)
    else:
        t.poli([(8, 1), (13, 9), (8, 10)], cor)
        t.elipse(9, 12, 5, 5, PM_CREME)
        t.elipse(13, 19, 4, 3, PM_CREME)
        t.poli([(16, 19), (21, 15), (20, 12)], cor)
        sombrear(t, {PM_CREME: (PM_CREME_C, PM_CREME_E)})
        olhinho(t, 6, 11)
        t.elipse(5, 14, 1, 1, cor)
        pes(t, [(11, 21), (12, 21), (15, 21), (16, 21)], PM_CREME_E)
    contorno_gba(t)


def plusle(t, lado):
    def mais(t, x, y):                                     # o + vermelho
        cor = H("de624a")
        t.linha([(x - 1, y), (x + 1, y)], cor, 1); t.linha([(x, y - 1), (x, y + 1)], cor, 1)
    _gemeo(t, lado, H("de624a"), mais)


def minun(t, lado):
    def menos(t, x, y):                                    # o − azul
        t.linha([(x - 1, y), (x + 1, y)], H("5a7be6"), 1)
    _gemeo(t, lado, H("5a7be6"), menos)


# ------------------------------------------------------------------- SWABLU
SB, SB_C, SB_E = H("7bcdff"), H("a8e0ff"), H("5a94cd")
SB_NUVEM, SB_NUVEM_C, SB_NUVEM_E = H("d5d5e6"), H("ffffff"), H("9c9cc5")


def swablu(t, lado):
    if lado == "lado":
        t.elipse(9, 12, 5, 4, SB)                          # o passarinho azul
        t.elipse(15, 13, 6, 5, SB_NUVEM)                   # a asa de algodão
        sombrear(t, {SB: (SB_C, SB_E), SB_NUVEM: (SB_NUVEM_C, SB_NUVEM_E)})
        t.px(7, 11, P_)
        t.poli([(3, 12), (5, 11), (5, 13)], H("f8d048"))
    else:
        t.elipse(5, 13, 4, 5, SB_NUVEM); t.elipse(19, 13, 4, 5, SB_NUVEM)   # as duas asas de nuvem
        t.elipse(12, 12, 5, 5, SB)
        sombrear(t, {SB: (SB_C, SB_E), SB_NUVEM: (SB_NUVEM_C, SB_NUVEM_E)})
        if lado == "frente":
            olhinho(t, 10, 11); olhinho(t, 14, 11)
            t.poli([(11, 14), (13, 14), (12, 16)], H("f8d048"))
    contorno_gba(t)


# ------------------------------------------------------------------- FEEBAS
FB, FB_C, FB_E = H("b4a473"), H("d5d583"), H("948352")
FB_PINTA = H("5a4a39")


def feebas(t, lado):
    if lado == "lado":
        t.elipse(11, 13, 8, 5, FB)                         # o peixe feioso
        t.poli([(18, 13), (23, 8), (23, 18)], H("a4acc5"))  # o rabo azulado
        sombrear(t, {FB: (FB_C, FB_E)})
        for x, y in ((9, 11), (13, 14), (15, 11)):
            t.px(x, y, FB_PINTA)                           # as pintas
        t.px(5, 12, P_)
        t.linha([(3, 15), (6, 15)], FB_E, 1)
    else:
        t.elipse(12, 13, 6, 8, FB)
        t.poli([(9, 20), (12, 23), (15, 20)], H("a4acc5"))
        sombrear(t, {FB: (FB_C, FB_E)})
        for x, y in ((9, 15), (15, 15), (12, 18)):
            t.px(x, y, FB_PINTA)
        if lado == "frente":
            t.pxs([(9, 9), (15, 9)], P_)
            t.linha([(10, 12), (14, 12)], FB_E, 1)
    contorno_gba(t)


# ------------------------------------------------------------------ AZURILL
AZ, AZ_C, AZ_E = H("6a94ff"), H("9cbdff"), H("395abd")


def azurill(t, lado):
    if lado == "lado":
        t.linha([(14, 18), (19, 15), (19, 10)], P_, 1)     # o rabo de mola
        t.elipse(19, 8, 3, 3, AZ)
        t.elipse(10, 13, 5, 6, AZ)
        t.poli([(8, 7), (6, 2), (10, 6)], AZ)
        sombrear(t, {AZ: (AZ_C, AZ_E)})
        t.pxs([(7, 11), (7, 12)], P_); t.px(6, 14, H("bd4a41"))
        pes(t, [(9, 21), (12, 21)], AZ_E)
    else:
        t.poli([(8, 7), (6, 1), (10, 6)], AZ); t.poli([(16, 7), (18, 1), (14, 6)], AZ)   # as orelhinhas
        if lado == "costas":
            t.linha([(12, 18), (18, 16), (19, 10)], P_, 1)
            t.elipse(19, 8, 3, 3, AZ)
        t.elipse(12, 13, 6, 6, AZ)
        t.elipse(12, 16, 3, 2, H("deeeff")) if lado == "frente" else None   # a barriguinha
        sombrear(t, {AZ: (AZ_C, AZ_E)})
        if lado == "frente":
            t.pxs([(9, 10), (9, 11), (15, 10), (15, 11)], P_)
            t.px(12, 13, H("bd4a41"))
        pes(t, [(9, 21), (10, 21), (14, 21), (15, 21)], AZ_E)
    contorno_gba(t)


# ------------------------------------------------------------------- SPOINK
SP, SP_C, SP_E = H("8b8b94"), H("acaca4"), H("6a737b")
SP_PERO = H("ff98c8")


def spoink(t, lado):
    t.linha([(12, 15), (10, 17), (14, 18), (10, 20), (12, 22)], P_, 1)   # a mola
    t.elipse(12, 10, 6, 5, SP)
    t.poli([(10, 5), (12, 2), (14, 5)], SP)
    t.elipse(12, 2, 2, 2, SP_PERO)                         # a pérola na cabeça
    sombrear(t, {SP: (SP_C, SP_E)})
    if lado == "frente":
        t.pxs([(9, 9), (9, 10), (15, 9), (15, 10)], P_)
        t.elipse(12, 13, 2, 1, H("ffcdbd"))                # o focinho
        t.pxs([(6, 11), (18, 11)], H("ffcdbd"))            # as mãozinhas
    elif lado == "lado":
        t.pxs([(8, 9), (8, 10)], P_)
        t.elipse(6, 12, 2, 1, H("ffcdbd"))
    contorno_gba(t)


# ----------------------------------------------------------------- TRAPINCH
TP, TP_C, TP_E = H("e89848"), H("f8b878"), H("c87870")


def trapinch(t, lado):
    if lado == "lado":
        t.elipse(9, 12, 6, 6, TP)                          # o cabeção
        t.elipse(17, 17, 4, 3, TP)
        sombrear(t, {TP: (TP_C, TP_E)})
        t.linha([(3, 15), (8, 14)], P_, 1)                 # a bocarra
        t.pxs([(7, 9), (7, 10)], P_); t.px(8, 9, BR)
        pes(t, [(15, 21), (19, 21)], TP_E)
    else:
        t.elipse(12, 11, 7, 7, TP)
        sombrear(t, {TP: (TP_C, TP_E)})
        if lado == "frente":
            t.linha([(6, 14), (18, 14)], P_, 1)            # a boca enorme
            for x in (7, 10, 14, 17):
                t.px(x, 15, BR)                            # os dentes
            t.pxs([(8, 9), (8, 10), (16, 9), (16, 10)], P_); t.pxs([(9, 9), (15, 9)], BR)
        pes(t, [(8, 21), (9, 21), (15, 21), (16, 21)], TP_E)
    contorno_gba(t)


# ----------------------------------------------------------------- ZANGOOSE
ZG, ZG_C, ZG_E = H("d5c5cd"), H("ffffff"), H("94838b")
ZG_V = H("ff626a")


def zangoose(t, lado):
    if lado == "lado":
        t.elipse(12, 15, 5, 5, ZG)
        t.elipse(9, 8, 4, 4, ZG)
        t.poli([(10, 4), (12, 0), (13, 5)], ZG)
        t.poli([(16, 15), (22, 9), (21, 16)], ZG)          # o rabão
        sombrear(t, {ZG: (ZG_C, ZG_E)})
        t.linha([(10, 11), (14, 17), (16, 13)], ZG_V, 1)   # a cicatriz vermelha
        t.linha([(6, 15), (5, 17)], ZG_V, 1)               # as garras
        t.pxs([(7, 7), (7, 8)], ZG_V)
        pes(t, [(10, 21), (11, 21), (14, 21), (15, 21)], ZG_E)
    else:
        if lado == "costas":
            t.poli([(14, 17), (22, 10), (20, 19)], ZG)
        t.elipse(12, 15, 6, 5, ZG)
        t.elipse(12, 8, 5, 4, ZG)
        t.poli([(7, 6), (6, 1), (10, 5)], ZG); t.poli([(17, 6), (18, 1), (14, 5)], ZG)
        sombrear(t, {ZG: (ZG_C, ZG_E)})
        if lado == "frente":
            t.linha([(9, 11), (12, 15), (15, 11)], ZG_V, 1)
            t.pxs([(10, 7), (10, 8), (14, 7), (14, 8)], ZG_V); t.px(12, 9, P_)
            t.pxs([(5, 16), (5, 17), (19, 16), (19, 17)], ZG_V)
        else:
            t.linha([(8, 6), (12, 4), (16, 6)], ZG_V, 1)
        pes(t, [(9, 21), (10, 21), (14, 21), (15, 21)], ZG_E)
    contorno_gba(t)


# ----------------------------------------------------------------- BARBOACH
BB, BB_C, BB_E = H("8ba4de"), H("a4c5ff"), H("4a5a9c")


def barboach(t, lado):
    if lado == "lado":
        t.elipse(11, 13, 7, 4, BB)
        t.poli([(17, 13), (22, 9), (22, 17)], BB)
        sombrear(t, {BB: (BB_C, BB_E)})
        t.pxs([(6, 11), (6, 12)], P_)
        t.linha([(4, 15), (2, 19)], H("737383"), 1)         # os bigodes
        t.linha([(9, 13), (14, 13)], H("d5d5de"), 1)
    else:
        t.elipse(12, 13, 5, 6, BB)
        t.poli([(9, 18), (12, 22), (15, 18)], BB_E)
        sombrear(t, {BB: (BB_C, BB_E)})
        if lado == "frente":
            t.pxs([(9, 11), (9, 12), (15, 11), (15, 12)], P_)
            t.linha([(10, 16), (6, 20)], H("737383"), 1); t.linha([(14, 16), (18, 20)], H("737383"), 1)
    contorno_gba(t)


# ----------------------------------------------------------------- CASTFORM
CF, CF_C, CF_E = H("e6dede"), H("ffffff"), H("949494")


def castform(t, lado):
    t.elipse(12, 12, 6, 6, CF)                             # a nuvenzinha
    t.linha([(12, 6), (16, 3), (18, 6)], CF, 1)            # o cachinho
    t.linha([(7, 17), (5, 21)], CF_E, 1); t.linha([(17, 17), (19, 21)], CF_E, 1)
    sombrear(t, {CF: (CF_C, CF_E)})
    if lado == "frente":
        t.pxs([(9, 11), (9, 12), (15, 11), (15, 12)], P_)
        t.linha([(11, 14), (13, 14)], H("5a5252"), 1)
    elif lado == "lado":
        t.pxs([(8, 11), (8, 12)], P_)
    contorno_gba(t)


# ------------------------------------------------------------------ SHUPPET
SH, SH_C, SH_E = H("4a4a6a"), H("7b7b9c"), H("292939")


def shuppet(t, lado):
    t.poli([(12, 4), (15, 0), (16, 6)], SH)                # o chifrinho
    t.elipse(12, 11, 6, 6, SH)
    t.poli([(7, 14), (12, 22), (17, 14)], SH)              # o rabinho de lençol
    sombrear(t, {SH: (SH_C, SH_E)})
    if lado == "frente":
        t.pxs([(9, 10), (10, 10), (14, 10), (15, 10)], H("f6d531"))   # os olhos amarelos
        t.pxs([(9, 11), (15, 11)], H("bdb400"))
    elif lado == "lado":
        t.pxs([(7, 10), (8, 10), (7, 11)], H("f6d531"))
    contorno_gba(t)


# ------------------------------------------------------------------ DUSKULL
DK, DK_C, DK_E = H("6a6a5a"), H("8b8b7b"), H("393931")
DK_OSSO = H("ded5ac")


def duskull(t, lado):
    t.elipse(12, 10, 6, 6, DK)
    t.poli([(6, 12), (8, 21), (12, 17), (16, 21), (18, 12)], DK)   # o manto
    sombrear(t, {DK: (DK_C, DK_E)})
    if lado == "frente":
        t.elipse(12, 9, 5, 4, DK_OSSO)                     # a caveira
        t.pxs([(9, 9), (10, 9), (14, 9), (15, 9)], P_)
        t.px(12, 9, H("ff3030"))                           # o olho vermelho
    elif lado == "lado":
        t.elipse(9, 9, 3, 4, DK_OSSO)
        t.px(8, 9, H("ff3030"))
    else:
        t.linha([(9, 6), (15, 6)], DK_OSSO, 1)
    contorno_gba(t)


# -------------------------------------------------------------------- ABSOL
AB, AB_C, AB_E = H("dedeee"), H("ffffff"), H("9494ac")
AB_ESC = H("526262")


def absol(t, lado):
    if lado == "lado":
        t.elipse(13, 14, 7, 4, AB)
        t.elipse(6, 9, 4, 4, AB_ESC)                       # a cara escura
        t.poli([(6, 6), (13, 0), (10, 7)], AB_ESC)         # a foice
        t.poli([(19, 13), (23, 9), (22, 16)], AB_ESC)      # o rabo
        t.poli([(10, 12), (15, 8), (14, 13)], AB)          # a juba
        sombrear(t, {AB: (AB_C, AB_E), AB_ESC: (H("738383"), H("293939"))})
        t.px(4, 9, H("de4a52"))
        pes(t, [(8, 21), (10, 21), (16, 21), (18, 21)], AB_ESC)
    else:
        t.elipse(12, 14, 6, 5, AB)
        t.elipse(12, 8, 4, 4, AB_ESC)
        t.poli([(13, 5), (20, 0), (16, 7)], AB_ESC)
        t.poli([(6, 11), (3, 6), (9, 10)], AB) if lado == "frente" else None
        sombrear(t, {AB: (AB_C, AB_E), AB_ESC: (H("738383"), H("293939"))})
        if lado == "frente":
            t.pxs([(10, 8), (14, 8)], H("de4a52"))
        pes(t, [(8, 21), (9, 21), (15, 21), (16, 21)], AB_ESC)
    contorno_gba(t)


# ------------------------------------------------------------------- WYNAUT
WY, WY_C, WY_E = H("6abdde"), H("9cd5ee"), H("397ba4")


def wynaut(t, lado):
    t.elipse(12, 16, 6, 5, WY)
    t.elipse(12, 8, 5, 4, WY)
    t.linha([(12, 4), (14, 1)], WY_E, 1)                   # o tufinho
    sombrear(t, {WY: (WY_C, WY_E)})
    if lado == "frente":
        t.pxs([(9, 7), (10, 7), (9, 8), (10, 8), (14, 7), (15, 7), (14, 8), (15, 8)], P_)
        t.elipse(12, 11, 2, 1, H("a43141"))                # o sorrisão
        t.pxs([(5, 14), (19, 14)], WY_E)                   # as mãozinhas
    elif lado == "lado":
        t.pxs([(8, 7), (9, 7), (8, 8), (9, 8)], P_)
        t.pxs([(8, 11), (9, 11)], H("a43141"))
    pes(t, [(8, 21), (9, 21), (15, 21), (16, 21)], WY_E)
    contorno_gba(t)


# ------------------------------------------------------------------- SPHEAL
SL, SL_C, SL_E = H("98a0f8"), H("c0c0f8"), H("6878d0")
SL_CREME = H("f0e0b8")


def spheal(t, lado):
    t.elipse(12, 13, 8, 8, SL)                             # a bola
    sombrear(t, {SL: (SL_C, SL_E)})
    if lado == "frente":
        t.elipse(12, 16, 5, 4, SL_CREME)                   # a barriga
        t.pxs([(9, 10), (9, 11), (15, 10), (15, 11)], P_)
        t.elipse(12, 13, 2, 1, SL_CREME); t.px(12, 12, P_)
        t.poli([(4, 15), (2, 19), (6, 18)], SL_E); t.poli([(20, 15), (22, 19), (18, 18)], SL_E)
    elif lado == "lado":
        t.elipse(8, 16, 3, 3, SL_CREME)
        t.pxs([(7, 10), (7, 11)], P_)
        t.poli([(11, 17), (9, 21), (14, 20)], SL_E)
    contorno_gba(t)


DESENHOS = {252: treecko, 255: torchic, 258: mudkip, 280: ralts, 263: zigzagoon, 278: wingull,
            261: poochyena, 265: wurmple, 270: lotad, 273: seedot, 285: shroomish, 287: slakoth,
            300: skitty, 304: aron, 311: plusle, 312: minun, 333: swablu, 349: feebas,
            298: azurill, 325: spoink, 328: trapinch, 335: zangoose, 339: barboach, 351: castform,
            353: shuppet, 355: duskull, 359: absol, 360: wynaut, 363: spheal}
TAMANHO = {252: 0.82, 255: 0.72, 258: 0.8, 280: 0.75, 263: 0.85, 278: 0.85,
           261: 0.85, 265: 0.75, 270: 0.78, 273: 0.72, 285: 0.75, 287: 0.85,
           300: 0.8, 304: 0.75, 311: 0.72, 312: 0.72, 333: 0.82, 349: 0.85,
           298: 0.72, 325: 0.8, 328: 0.75, 335: 0.95, 339: 0.75, 351: 0.72,
           353: 0.75, 355: 0.85, 359: 1, 360: 0.85, 363: 0.8}
