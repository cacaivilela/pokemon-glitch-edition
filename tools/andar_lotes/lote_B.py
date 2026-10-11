"""LOTE B: WEEDLE, EKANS, SANDSHREW, NIDORAN♀, NIDORAN♂, ZUBAT, PARAS,
VENONAT, MANKEY, GROWLITHE, ABRA, MACHOP — andando no mapa."""
from andar_base import *  # noqa: F401,F403


# ------------------------------------------------------------------- WEEDLE
WE, WE_C, WE_E = H("e8a840"), H("f8c870"), H("d08868")
WE_GOMO, WE_NARIZ = H("882810"), H("e06868")
FERRAO, FERRAO_E = H("f8f8f8"), H("808090")


def weedle(t, lado):
    if lado == "frente":
        t.elipse(12, 17, 5, 4, WE)                         # o gomo de trás aparecendo
        t.elipse(12, 10, 6, 5, WE)                         # cabeçona
        t.poli([(10, 6), (12, 0), (14, 6)], FERRAO)        # o ferrão da testa
        sombrear(t, {WE: (WE_C, WE_E), FERRAO: (FERRAO, FERRAO_E)})
        t.linha([(8, 16), (16, 16)], WE_GOMO, 1)           # a divisa do gomo
        for x in (9, 15):
            t.pxs([(x, 9), (x, 10)], P_); t.px(x, 9, BR)
        t.elipse(12, 13, 1, 1, WE_NARIZ)                   # o narizão rosa
        pes(t, [(9, 21), (10, 21), (14, 21), (15, 21)], WE_E)
    elif lado == "costas":
        t.elipse(12, 18, 4, 3, WE)                         # os gomos, do rabo pra cabeça
        t.elipse(12, 14, 5, 3, WE)
        t.elipse(12, 9, 6, 5, WE)
        t.poli([(10, 5), (12, 0), (14, 5)], FERRAO)
        t.poli([(11, 19), (12, 23), (13, 19)], FERRAO)     # o ferrão do rabo
        sombrear(t, {WE: (WE_C, WE_E), FERRAO: (FERRAO, FERRAO_E)})
        t.linha([(8, 13), (16, 13)], WE_GOMO, 1); t.linha([(9, 17), (15, 17)], WE_GOMO, 1)
        pes(t, [(8, 20), (16, 20)], WE_E)
    else:
        for x, y in ((19, 15), (15, 17), (11, 17)):        # os gomos atrás
            t.elipse(x, y, 3, 3, WE)
        t.poli([(20, 13), (23, 7), (22, 13)], FERRAO)      # o ferrão do rabo, pra cima
        t.elipse(7, 12, 5, 5, WE)
        t.poli([(6, 8), (6, 1), (10, 8)], FERRAO)
        sombrear(t, {WE: (WE_C, WE_E), FERRAO: (FERRAO, FERRAO_E)})
        for x in (13, 17):
            t.linha([(x, 15), (x, 19)], WE_GOMO, 1)
        t.pxs([(5, 11), (5, 12)], P_); t.px(5, 11, BR)
        t.elipse(3, 14, 1, 1, WE_NARIZ)
        pes(t, [(7, 21), (11, 21), (15, 21), (18, 20)], WE_E)
    contorno_gba(t)


# -------------------------------------------------------------------- EKANS
EK, EK_C, EK_E = H("984880"), H("b870a0"), H("682058")
EK_AMARELO, EK_AMARELO_E = H("f8e098"), H("e0a070")
EK_BOCA = H("982828")


def ekans(t, lado):
    if lado == "frente":
        t.elipse(12, 18, 9, 4, EK)                         # a rodilha no chão
        t.linha([(12, 16), (12, 11)], EK, 4)               # o pescoço erguido
        t.elipse(12, 8, 6, 5, EK)                          # cabeça
        sombrear(t, {EK: (EK_C, EK_E)})
        t.ret(11, 13, 13, 17, EK_AMARELO)                  # a barriga
        t.linha([(5, 17), (10, 17)], EK_E, 1); t.linha([(14, 17), (19, 17)], EK_E, 1)   # a volta da rodilha
        for x in (8, 15):
            t.ret(x, 7, x + 1, 8, EK_AMARELO); t.pxs([(x + 1, 7), (x + 1, 8)] if x < 12 else [(x, 7), (x, 8)], P_)
        t.linha([(9, 11), (15, 11)], EK_BOCA, 1)
        pes(t, [(6, 21), (7, 21), (17, 21), (18, 21)], EK_E)
    elif lado == "costas":
        t.elipse(12, 18, 9, 4, EK)
        t.linha([(12, 16), (12, 11)], EK, 4)
        t.elipse(12, 8, 6, 5, EK)
        t.linha([(19, 17), (22, 13), (21, 10)], EK, 2)     # o rabo de chocalho
        sombrear(t, {EK: (EK_C, EK_E)})
        t.pxs([(21, 10), (21, 11), (22, 11)], EK_AMARELO_E)
        t.linha([(5, 17), (10, 17)], EK_E, 1); t.linha([(14, 17), (19, 17)], EK_E, 1)
        pes(t, [(6, 21), (7, 21), (17, 21), (18, 21)], EK_E)
    else:
        t.elipse(13, 18, 9, 4, EK)
        t.linha([(10, 16), (8, 11)], EK, 4)
        t.elipse(7, 8, 6, 4, EK)                           # cabeça olhando pra frente
        t.linha([(21, 17), (23, 12)], EK, 2)
        sombrear(t, {EK: (EK_C, EK_E)})
        t.linha([(6, 12), (7, 16)], EK_AMARELO, 1)
        t.pxs([(23, 12), (23, 13)], EK_AMARELO_E)
        t.linha([(9, 17), (19, 17)], EK_E, 1)
        t.pxs([(5, 6), (5, 7)], EK_AMARELO); t.px(5, 7, P_)
        t.linha([(1, 10), (5, 10)], EK_BOCA, 1)
        pes(t, [(7, 21), (8, 21), (18, 21), (19, 21)], EK_E)
    contorno_gba(t)


# ---------------------------------------------------------------- SANDSHREW
SS, SS_C, SS_E = H("c8b000"), H("e0d810"), H("a88010")
SS_LISTRA = H("704818")
SS_CREME, SS_CREME_E = H("e8e8d8"), H("c8b8b0")


def sandshrew(t, lado):
    if lado == "frente":
        t.pxs([(6, 4), (7, 4), (6, 5), (17, 4), (18, 4), (18, 5)], SS)   # orelhinhas
        t.elipse(12, 9, 6, 5, SS)
        t.elipse(12, 17, 6, 4, SS)
        t.pxs([(5, 15), (4, 16), (19, 15), (20, 16)], SS)
        sombrear(t, {SS: (SS_C, SS_E)})
        t.elipse(12, 17, 4, 3, SS_CREME)                   # a barriga creme
        t.linha([(9, 17), (15, 17)], SS_CREME_E, 1); t.linha([(10, 19), (14, 19)], SS_CREME_E, 1)
        for x in (8, 15):                                  # olhinhos de 2
            t.ret(x, 7, x + 1, 9, P_); t.px(x, 7, BR)
        t.pxs([(11, 11), (12, 11)], P_)
        pes(t, [(9, 21), (10, 21), (14, 21), (15, 21)], SS_E)
    elif lado == "costas":
        t.pxs([(6, 4), (7, 4), (6, 5), (17, 4), (18, 4), (18, 5)], SS)
        t.elipse(12, 9, 6, 5, SS)
        t.elipse(12, 17, 6, 4, SS)
        t.poli([(14, 19), (19, 21), (20, 18)], SS)         # o rabinho
        sombrear(t, {SS: (SS_C, SS_E)})
        for y in (12, 15, 18):                             # as escamas do lombo
            t.linha([(8, y), (16, y)], SS_LISTRA, 1)
        for x, y in ((10, 13), (14, 13), (12, 16), (9, 16), (15, 16), (10, 19), (14, 19)):
            t.px(x, y, SS_LISTRA)
        pes(t, [(9, 21), (10, 21), (14, 21), (15, 21)], SS_E)
    else:
        t.pxs([(9, 4), (10, 4), (10, 5)], SS)
        t.elipse(8, 9, 6, 5, SS)
        t.elipse(13, 17, 6, 4, SS)
        t.poli([(18, 18), (22, 20), (22, 17)], SS)
        sombrear(t, {SS: (SS_C, SS_E)})
        t.elipse(10, 18, 3, 3, SS_CREME)
        for x in (14, 17):
            t.linha([(x, 14), (x + 1, 19)], SS_LISTRA, 1)
        t.ret(5, 8, 6, 9, P_); t.px(5, 8, BR)
        t.pxs([(2, 11), (3, 11)], P_)
        t.px(7, 18, BR)
        pes(t, [(10, 21), (11, 21), (15, 21), (16, 21)], SS_E)
    contorno_gba(t)


# --------------------------------------------------------------- NIDORAN ♀
NF, NF_C, NF_E = H("c0e0e8"), H("d8f8f8"), H("90c8b8")
NF_MANCHA, NF_ORELHA = H("486060"), H("58a090")
NF_OLHO = H("b83048")


def nidoran_f(t, lado):
    if lado in ("frente", "costas"):
        t.poli([(4, 2), (10, 7), (7, 11)], NF); t.poli([(20, 2), (14, 7), (17, 11)], NF)   # orelhonas
        t.elipse(12, 11, 7, 5, NF)
        t.elipse(12, 18, 6, 3, NF)
        sombrear(t, {NF: (NF_C, NF_E)})
        if lado == "frente":
            t.poli([(5, 4), (9, 7), (7, 9)], NF_ORELHA); t.poli([(19, 4), (15, 7), (17, 9)], NF_ORELHA)
            t.pxs([(12, 4), (12, 5), (12, 6)], NF_E)       # o chifrinho
            for x in (8, 15):
                t.ret(x, 10, x + 1, 11, NF_OLHO); t.px(x, 10, BR)
            t.pxs([(11, 13), (12, 13), (13, 13)], NF_MANCHA)
            t.pxs([(6, 18), (18, 17)], NF_MANCHA)
        else:
            t.pxs([(9, 9), (12, 8), (15, 9), (8, 13), (16, 13)], NF_MANCHA)   # as manchas
            t.linha([(10, 17), (11, 19)], NF_MANCHA, 1); t.linha([(14, 17), (13, 19)], NF_MANCHA, 1)
            t.pxs([(11, 6), (13, 6)], NF_E)                # os espinhinhos
        pes(t, [(8, 21), (9, 21), (15, 21), (16, 21)], NF_E)
    else:
        t.poli([(10, 1), (14, 8), (9, 9)], NF)
        t.elipse(8, 11, 5, 4, NF)
        t.elipse(14, 17, 6, 4, NF)
        sombrear(t, {NF: (NF_C, NF_E)})
        t.poli([(11, 3), (13, 7), (11, 8)], NF_ORELHA)
        t.ret(5, 10, 6, 11, NF_OLHO); t.px(5, 10, BR)
        t.px(3, 12, NF_MANCHA)
        t.pxs([(14, 14), (17, 15), (12, 17), (19, 17)], NF_MANCHA)
        pes(t, [(9, 21), (10, 21), (17, 21), (18, 21)], NF_E)
    contorno_gba(t)


# --------------------------------------------------------------- NIDORAN ♂
NM, NM_C, NM_E = H("b860b8"), H("e098d0"), H("604068")
NM_MANCHA, NM_ORELHA = H("006040"), H("00a070")
CHIFRE, CHIFRE_E = H("e8b8e8"), H("808080")


def nidoran_m(t, lado):
    if lado in ("frente", "costas"):
        t.poli([(2, 4), (9, 7), (7, 12)], NM); t.poli([(22, 4), (15, 7), (17, 12)], NM)   # orelhonas
        t.elipse(12, 11, 6, 5, NM)
        t.elipse(12, 18, 6, 3, NM)
        if lado == "frente":
            t.poli([(10, 7), (12, 1), (14, 7)], CHIFRE)    # o chifre grande
        sombrear(t, {NM: (NM_C, NM_E), CHIFRE: (CHIFRE, CHIFRE_E)})
        if lado == "frente":
            t.poli([(4, 5), (8, 7), (7, 10)], NM_ORELHA); t.poli([(20, 5), (16, 7), (17, 10)], NM_ORELHA)
            for x in (8, 15):
                t.ret(x, 10, x + 1, 11, P_); t.px(x, 10, BR)
            t.pxs([(11, 14), (13, 14)], NM_E)              # o focinho
            t.pxs([(6, 17), (18, 18)], NM_MANCHA)
        else:
            for x, y in ((12, 7), (10, 10), (14, 10), (12, 13)):   # os espinhos das costas
                t.pxs([(x, y), (x, y - 1)], CHIFRE); t.px(x, y + 1, NM_E)
            t.pxs([(8, 9), (16, 9), (8, 17), (16, 18), (12, 18)], NM_MANCHA)
        pes(t, [(8, 21), (9, 21), (15, 21), (16, 21)], NM_E)
    else:
        t.poli([(10, 2), (15, 9), (9, 9)], NM)
        t.elipse(8, 12, 5, 4, NM)
        t.elipse(14, 17, 6, 4, NM)
        t.poli([(4, 9), (3, 3), (7, 8)], CHIFRE)
        sombrear(t, {NM: (NM_C, NM_E), CHIFRE: (CHIFRE, CHIFRE_E)})
        t.poli([(11, 4), (13, 8), (11, 8)], NM_ORELHA)
        t.pxs([(14, 13), (17, 13), (20, 15)], CHIFRE)     # espinhos do lombo
        t.ret(5, 11, 6, 12, P_); t.px(5, 11, BR)
        t.px(3, 14, NM_E)
        t.pxs([(13, 17), (17, 16)], NM_MANCHA)
        pes(t, [(9, 21), (10, 21), (17, 21), (18, 21)], NM_E)
    contorno_gba(t)


# -------------------------------------------------------------------- ZUBAT
ZU, ZU_C, ZU_E = H("6888b8"), H("88b0e8"), H("484078")
ASA, ASA_C, ASA_E = H("b05098"), H("d070b8"), H("702058")
ZU_BOCA = H("702058")


def zubat(t, lado):
    """morcego voando: sem pé, as asas abertas"""
    if lado in ("frente", "costas"):
        cor_asa = ASA if lado == "frente" else ZU
        t.poli([(9, 10), (1, 4), (0, 13), (3, 11), (5, 15), (9, 13)], cor_asa)   # as asas
        t.poli([(15, 10), (23, 4), (24, 13), (21, 11), (19, 15), (15, 13)], cor_asa)
        t.poli([(8, 7), (7, 1), (11, 5)], ZU); t.poli([(16, 7), (17, 1), (13, 5)], ZU)   # orelhas
        t.elipse(12, 11, 5, 5, ZU)
        t.linha([(10, 16), (9, 20)], ZU, 1); t.linha([(14, 16), (15, 20)], ZU, 1)   # as pernas compridas
        sombrear(t, {ZU: (ZU_C, ZU_E), ASA: (ASA_C, ASA_E)})
        if lado == "frente":
            t.pxs([(8, 4), (16, 4)], ASA)                  # dentro da orelha
            t.elipse(12, 12, 3, 2, ZU_BOCA)                # a bocona aberta
            t.pxs([(10, 11), (14, 11)], BR)                # os caninos
        else:
            t.linha([(2, 6), (8, 12)], ZU_E, 1); t.linha([(22, 6), (16, 12)], ZU_E, 1)
    else:
        t.poli([(13, 10), (17, 1), (22, 6), (20, 8), (21, 12), (14, 13)], ASA)   # a asa de cima
        t.poli([(7, 7), (8, 1), (11, 6)], ZU)
        t.elipse(10, 11, 5, 5, ZU)
        t.linha([(12, 16), (16, 20)], ZU, 1)
        sombrear(t, {ZU: (ZU_C, ZU_E), ASA: (ASA_C, ASA_E)})
        t.elipse(6, 13, 2, 2, ZU_BOCA)
        t.px(5, 12, BR)
        t.linha([(16, 3), (17, 10)], ASA_E, 1)
    contorno_gba(t)


# -------------------------------------------------------------------- PARAS
PA, PA_C, PA_E = H("e88830"), H("f8a860"), H("b88030")
CO, CO_C, CO_E = H("e03838"), H("f87878"), H("b00808")
CO_PINTA = H("d8d038")
PA_OLHO = H("e0e0e0")


def cogumelo(t, x, y):
    t.elipse(x, y, 4, 3, CO)


def paras(t, lado):
    if lado in ("frente", "costas"):
        t.elipse(12, 16, 7, 5, PA)                         # o corpo baixinho
        cogumelo(t, 7, 9); cogumelo(t, 17, 9)              # os dois cogumelos
        if lado == "frente":
            t.pxs([(4, 18), (3, 19), (20, 18), (21, 19)], PA)   # as garras
        sombrear(t, {PA: (PA_C, PA_E), CO: (CO_C, CO_E)})
        if lado == "costas":
            t.linha([(12, 8), (12, 11)], CO_E, 1)
        for x, y in ((6, 8), (8, 10), (16, 8), (18, 10)):
            t.px(x, y, CO_PINTA)
        if lado == "frente":
            for x in (9, 15):                              # os olhos claros
                t.ret(x - 1, 15, x, 16, PA_OLHO); t.px(x, 16, P_)
            t.pxs([(11, 18), (13, 18)], PA_E)              # as pinças da boca
        pes(t, [(6, 21), (8, 21), (16, 21), (18, 21)], PA_E)
    else:
        t.elipse(12, 16, 7, 5, PA)
        cogumelo(t, 15, 9); cogumelo(t, 10, 10)
        t.pxs([(4, 18), (3, 19)], PA)
        sombrear(t, {PA: (PA_C, PA_E), CO: (CO_C, CO_E)})
        t.linha([(13, 7), (13, 11), (12, 13)], CO_E, 1)    # a divisa dos dois chapéus
        for x, y in ((9, 9), (15, 8), (17, 10)):
            t.px(x, y, CO_PINTA)
        t.ret(6, 15, 7, 16, PA_OLHO); t.px(6, 16, P_)
        pes(t, [(7, 21), (9, 21), (14, 21), (16, 21), (18, 21)], PA_E)
    contorno_gba(t)


# ------------------------------------------------------------------ VENONAT
VE, VE_C, VE_E = H("886898"), H("a088b8"), H("685070")
VE_OLHO, VE_OLHO_C, VE_OLHO_E = H("f87850"), H("f8b0a8"), H("c05020")
VE_BOCA = H("b88868")
ANTENA, ANTENA_E = H("f8f8f8"), H("d0d0d0")


def venonat(t, lado):
    if lado in ("frente", "costas"):
        t.linha([(9, 6), (7, 1)], ANTENA, 1); t.linha([(15, 6), (17, 1)], ANTENA, 1)   # as antenas
        t.elipse(12, 13, 8, 7, VE)                         # a bola peluda
        t.pxs([(3, 9), (21, 9), (3, 16), (21, 16), (5, 6), (19, 6)], VE)   # o pelo arrepiado
        sombrear(t, {VE: (VE_C, VE_E), ANTENA: (ANTENA, ANTENA_E)})
        if lado == "frente":
            for x in (8, 16):                              # os olhões compostos
                t.elipse(x, 12, 2, 2, VE_OLHO)
                t.pxs([(x - 1, 11), (x, 11)], VE_OLHO_C); t.px(x + 1, 13, VE_OLHO_E)
            t.elipse(12, 16, 2, 1, VE_BOCA)
            t.pxs([(11, 16), (13, 16)], P_)
        else:
            t.linha([(8, 10), (16, 10)], VE_E, 1); t.linha([(7, 14), (17, 14)], VE_E, 1)
        pes(t, [(8, 21), (9, 21), (15, 21), (16, 21)], VE_BOCA)
    else:
        t.linha([(8, 6), (5, 1)], ANTENA, 1)
        t.elipse(12, 13, 8, 7, VE)
        t.pxs([(12, 5), (20, 9), (21, 14), (18, 19)], VE)
        sombrear(t, {VE: (VE_C, VE_E), ANTENA: (ANTENA, ANTENA_E)})
        t.elipse(6, 12, 2, 2, VE_OLHO)
        t.pxs([(5, 11), (6, 11)], VE_OLHO_C); t.px(7, 13, VE_OLHO_E)
        t.elipse(5, 16, 1, 1, VE_BOCA)
        t.linha([(14, 11), (17, 15)], VE_E, 1)
        pes(t, [(9, 21), (10, 21), (15, 21), (16, 21)], VE_BOCA)
    contorno_gba(t)


# ------------------------------------------------------------------- MANKEY
MK, MK_C, MK_E = H("f0d8b0"), H("f8f0c8"), H("d0b898")
MK_PELE, MK_PELE_E = H("d8a070"), H("c07848")
MK_MARROM = H("684828")


def mankey(t, lado):
    if lado in ("frente", "costas"):
        t.elipse(3, 15, 2, 2, MK_PELE); t.elipse(21, 15, 2, 2, MK_PELE)   # os punhos fechados
        t.elipse(5, 7, 2, 2, MK); t.elipse(19, 7, 2, 2, MK)   # as orelhas
        t.elipse(12, 12, 7, 7, MK)                         # a bola de pelo
        t.pxs([(11, 4), (12, 3), (13, 4), (10, 5)], MK)    # o tufo de cima
        sombrear(t, {MK: (MK_C, MK_E), MK_PELE: (H("f8c080"), MK_PELE_E)})
        if lado == "frente":
            t.linha([(7, 9), (10, 11)], P_, 1); t.linha([(17, 9), (14, 11)], P_, 1)   # a testa franzida
            for x in (9, 15):
                t.pxs([(x, 11), (x, 12)], P_)
            t.elipse(12, 14, 2, 1, MK_PELE)                # o focinho de porco
            t.pxs([(11, 14), (13, 14)], MK_MARROM)
            t.linha([(10, 17), (14, 17)], MK_MARROM, 1)
        else:
            t.linha([(16, 17), (20, 18), (21, 15)], MK_MARROM, 1)   # o rabinho
        if lado == "frente":
            t.pxs([(5, 7), (19, 7)], MK_PELE)              # dentro da orelha
        pes(t, [(8, 20), (9, 20), (15, 20), (16, 20), (8, 21), (9, 21), (15, 21), (16, 21)], MK_PELE_E)
    else:
        t.elipse(15, 5, 2, 2, MK)
        t.elipse(13, 12, 7, 7, MK)
        t.pxs([(12, 4), (13, 3), (14, 4)], MK)
        sombrear(t, {MK: (MK_C, MK_E), MK_PELE: (H("f8c080"), MK_PELE_E)})
        t.linha([(7, 9), (10, 11)], P_, 1)
        t.pxs([(8, 11), (8, 12)], P_)
        t.elipse(6, 14, 1, 1, MK_PELE); t.px(5, 14, MK_MARROM)
        t.linha([(19, 17), (22, 16), (22, 13)], MK_MARROM, 1)
        t.elipse(8, 16, 2, 2, MK_PELE); t.px(9, 17, MK_PELE_E)   # o punho na frente
        t.px(15, 5, MK_PELE)
        pes(t, [(10, 20), (11, 20), (16, 20), (17, 20), (10, 21), (11, 21), (16, 21), (17, 21)], MK_PELE_E)
    contorno_gba(t)


# ---------------------------------------------------------------- GROWLITHE
GR, GR_C, GR_E = H("c05020"), H("e88848"), H("703810")
GR_CREME, GR_CREME_C, GR_CREME_E = H("e0d090"), H("f8f0b0"), H("c8b070")


def growlithe(t, lado):
    if lado in ("frente", "costas"):
        if lado == "costas":
            t.elipse(12, 17, 4, 3, GR_CREME)               # o rabo felpudo
        t.poli([(5, 3), (9, 6), (6, 10)], GR); t.poli([(19, 3), (15, 6), (18, 10)], GR)   # orelhas
        t.elipse(12, 18, 5, 3, GR)                         # corpo
        if lado == "costas":
            t.elipse(12, 15, 4, 3, GR_CREME)
        t.elipse(12, 9, 6, 5, GR)                          # cabeça
        if lado == "frente":
            t.elipse(12, 15, 5, 2, GR_CREME)               # a juba do peito
        t.poli([(9, 5), (12, 2), (15, 5), (12, 7)], GR_CREME)   # o topete
        sombrear(t, {GR: (GR_C, GR_E), GR_CREME: (GR_CREME_C, GR_CREME_E)})
        if lado == "frente":
            for x in (9, 15):
                t.pxs([(x, 9), (x, 10)], P_); t.px(x, 9, BR)
            t.elipse(12, 12, 2, 1, GR_CREME_C)             # o focinho
            t.px(12, 11, P_)
            t.linha([(7, 17), (8, 18)], P_, 1); t.linha([(17, 17), (16, 18)], P_, 1)   # listras pretas
        else:
            for x in (8, 16):
                t.linha([(x, 10), (x + (1 if x < 12 else -1), 12)], P_, 1)
            t.pxs([(8, 18), (16, 18)], P_)
        pes(t, [(8, 21), (9, 21), (15, 21), (16, 21)], GR_E)
    else:
        t.elipse(20, 13, 3, 3, GR_CREME)                   # o rabo
        t.elipse(13, 17, 6, 3, GR)
        t.poli([(9, 2), (13, 7), (8, 9)], GR)
        t.elipse(8, 10, 5, 5, GR)
        t.elipse(10, 15, 3, 2, GR_CREME)                   # a juba
        t.poli([(5, 6), (8, 3), (11, 6)], GR_CREME)
        sombrear(t, {GR: (GR_C, GR_E), GR_CREME: (GR_CREME_C, GR_CREME_E)})
        t.elipse(3, 12, 2, 1, GR_CREME_C); t.px(2, 11, P_)
        t.pxs([(5, 9), (5, 10)], P_); t.px(5, 9, BR)
        for x in (14, 17):                                 # as listras do lombo
            t.linha([(x, 15), (x + 1, 17)], P_, 1)
        pes(t, [(9, 21), (10, 21), (16, 21), (17, 21)], GR_E)
    contorno_gba(t)


# --------------------------------------------------------------------- ABRA
AB, AB_C, AB_E = H("d8c820"), H("f8e828"), H("906810")
AB_ARMADURA, AB_ARMADURA_C, AB_ARMADURA_E = H("805810"), H("a88028"), H("603000")


def abra(t, lado):
    if lado in ("frente", "costas"):
        if lado == "costas":
            t.poli([(13, 17), (20, 21), (21, 17), (16, 15)], AB)   # o rabo
        t.poli([(5, 1), (9, 5), (6, 8)], AB); t.poli([(19, 1), (15, 5), (18, 8)], AB)   # orelhas pontudas
        t.elipse(12, 17, 6, 4, AB_ARMADURA)                # o corpo de armadura marrom
        t.elipse(12, 8, 6, 5, AB)                          # cabeça
        t.pxs([(5, 15), (5, 16), (19, 15), (19, 16)], AB)  # os ombros
        sombrear(t, {AB: (AB_C, AB_E), AB_ARMADURA: (AB_ARMADURA_C, AB_ARMADURA_E)})
        if lado == "frente":
            t.linha([(8, 9), (10, 9)], P_, 1); t.linha([(14, 9), (16, 9)], P_, 1)   # olho sempre fechado
            t.pxs([(11, 11), (13, 11)], AB_E)
            t.elipse(12, 18, 2, 2, AB)                     # as mãos juntas na frente
            t.px(12, 18, AB_E)
        else:
            t.linha([(12, 14), (12, 20)], AB_ARMADURA_E, 1)
        pes(t, [(8, 21), (9, 21), (15, 21), (16, 21)], AB_E)
    else:
        t.poli([(16, 17), (22, 19), (22, 15), (18, 15)], AB)
        t.poli([(10, 0), (13, 6), (9, 7)], AB)
        t.elipse(13, 17, 5, 4, AB_ARMADURA)
        t.elipse(9, 8, 6, 5, AB)
        sombrear(t, {AB: (AB_C, AB_E), AB_ARMADURA: (AB_ARMADURA_C, AB_ARMADURA_E)})
        t.linha([(4, 9), (6, 9)], P_, 1)
        t.px(3, 11, AB_E)
        t.elipse(9, 17, 2, 2, AB)
        pes(t, [(10, 21), (11, 21), (15, 21), (16, 21)], AB_E)
    contorno_gba(t)


# ------------------------------------------------------------------- MACHOP
MC, MC_C, MC_E = H("789080"), H("a0c0a8"), H("304838")
MC_CRISTA = H("b8d8c0")
MC_OLHO = H("f83838")


def machop(t, lado):
    if lado in ("frente", "costas"):
        t.elipse(12, 8, 6, 5, MC)                          # cabeça
        t.poli([(9, 4), (10, 0), (14, 0), (15, 4)], MC)    # as três cristas
        t.elipse(12, 17, 5, 4, MC)                         # o tronco
        t.elipse(5, 16, 2, 3, MC); t.elipse(19, 16, 2, 3, MC)   # os braços fortes
        sombrear(t, {MC: (MC_C, MC_E)})
        t.linha([(10, 1), (10, 4)], MC_E, 1); t.linha([(12, 0), (12, 4)], MC_CRISTA, 1); t.linha([(14, 1), (14, 4)], MC_E, 1)
        if lado == "frente":
            for x in (9, 15):
                t.ret(x - (1 if x < 12 else 0), 8, x + (0 if x < 12 else 1), 9, MC_OLHO); t.px(x, 9, P_)
            t.linha([(8, 7), (10, 8)], P_, 1); t.linha([(16, 7), (14, 8)], P_, 1)   # o olhar bravo
            t.linha([(10, 11), (14, 11)], MC_E, 1)
            t.linha([(10, 15), (14, 15)], MC_CRISTA, 1)   # o peitoral
            t.linha([(7, 14), (7, 18)], P_, 1); t.linha([(17, 14), (17, 18)], P_, 1)   # o braço solto do corpo
            t.linha([(12, 15), (12, 19)], MC_E, 1)
        else:
            t.linha([(12, 13), (12, 19)], MC_E, 1)
            t.linha([(7, 14), (7, 18)], P_, 1); t.linha([(17, 14), (17, 18)], P_, 1)
        pes(t, [(9, 21), (10, 21), (14, 21), (15, 21)], MC_E)
    else:
        t.elipse(9, 8, 6, 5, MC)
        t.poli([(8, 4), (10, 0), (13, 1), (13, 5)], MC)
        t.elipse(12, 17, 5, 4, MC)
        t.elipse(9, 16, 2, 3, MC)
        sombrear(t, {MC: (MC_C, MC_E)})
        t.linha([(10, 1), (11, 4)], MC_CRISTA, 1)
        t.linha([(4, 6), (7, 7)], P_, 1)
        t.ret(4, 8, 5, 9, MC_OLHO); t.px(4, 9, P_)
        t.linha([(3, 11), (5, 11)], MC_E, 1)
        t.linha([(11, 14), (11, 19)], P_, 1)
        pes(t, [(10, 21), (11, 21), (14, 21), (15, 21)], MC_E)
    contorno_gba(t)


DESENHOS = {13: weedle, 23: ekans, 27: sandshrew, 29: nidoran_f, 32: nidoran_m,
            41: zubat, 46: paras, 48: venonat, 56: mankey, 58: growlithe, 63: abra, 66: machop}
TAMANHO = {13: 0.78, 23: 0.9, 27: 0.85, 29: 0.85, 32: 0.85, 41: 0.85, 46: 0.8, 48: 0.9,
           56: 0.85, 58: 0.9, 63: 0.9, 66: 0.9}
