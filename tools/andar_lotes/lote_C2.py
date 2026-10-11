"""LOTE C2: Rapidash, Slowbro, Magneton, Dodrio, Dewgong, Muk, Cloyster,
Haunter, Hypno, Kingler, Electrode e Exeggutor andando no mapa."""
from andar_base import *  # noqa: F401,F403


# ----------------------------------------------------------------- RAPIDASH
RA, RA_C, RA_E = H("f8e878"), H("f8f0b0"), H("e0c850")
RF, RF_C, RF_E = H("f86000"), H("f8e020"), H("c80000")
RA_CASCO, RA_CHIFRE = H("585858"), H("989898")
RA_OLHO = H("906818")


def rapidash(t, lado):
    if lado == "frente":
        t.poli([(6, 10), (3, 2), (7, 4), (8, 0), (12, 3), (16, 0), (17, 4), (21, 2), (18, 10)], RF)   # a crina
        t.poli([(17, 13), (23, 7), (22, 13), (23, 17), (18, 18)], RF)      # o rabo
        t.elipse(12, 15, 5, 3, RA)
        t.ret(7, 16, 8, 19, RA); t.ret(16, 16, 17, 19, RA)                  # as patas finas
        t.elipse(12, 9, 4, 4, RA)
        t.elipse(12, 13, 2, 2, RA)                                          # o focinho comprido
        sombrear(t, {RA: (RA_C, RA_E), RF: (RF_C, RF_E)})
        t.poli([(11, 6), (12, 1), (13, 6)], RA_CHIFRE); t.px(12, 3, BR)    # o chifre
        olhinho(t, 10, 9, RA_OLHO); olhinho(t, 14, 9, RA_OLHO)
        t.pxs([(11, 14), (13, 14)], RA_E)
        t.pxs([(7, 20), (8, 20), (16, 20), (17, 20)], RF)                   # o fogo nos cascos
        pes(t, [(7, 21), (8, 21), (16, 21), (17, 21)], RA_CASCO)
    elif lado == "costas":
        t.poli([(12, 18), (8, 21), (9, 14), (12, 12), (15, 14), (16, 21)], RF)
        t.elipse(12, 14, 5, 3, RA)
        t.ret(7, 15, 8, 19, RA); t.ret(16, 15, 17, 19, RA)
        t.elipse(12, 7, 4, 4, RA)
        t.poli([(8, 3), (9, 0), (12, 2), (15, 0), (16, 3), (15, 12), (12, 15), (9, 12)], RF)
        sombrear(t, {RA: (RA_C, RA_E), RF: (RF_C, RF_E)})
        t.linha([(12, 2), (12, 11)], RF_C, 1)
        t.pxs([(7, 20), (8, 20), (16, 20), (17, 20)], RF)
        pes(t, [(7, 21), (8, 21), (16, 21), (17, 21)], RA_CASCO)
    else:
        t.poli([(17, 12), (23, 5), (21, 11), (23, 15), (19, 17)], RF)
        t.elipse(14, 14, 5, 3, RA)
        t.ret(10, 15, 11, 19, RA); t.ret(17, 15, 18, 19, RA)
        t.poli([(7, 9), (10, 7), (12, 13), (9, 14)], RA)                   # o pescoço comprido
        t.elipse(7, 7, 4, 3, RA)
        t.elipse(3, 9, 2, 2, RA)
        t.poli([(9, 4), (11, 0), (13, 3), (17, 2), (15, 6), (17, 10), (12, 12), (10, 6)], RF)
        sombrear(t, {RA: (RA_C, RA_E), RF: (RF_C, RF_E)})
        t.poli([(5, 4), (2, 0), (7, 3)], RA_CHIFRE)                         # o chifre pra frente
        olhinho(t, 6, 6, RA_OLHO)
        t.px(2, 9, RA_E)
        t.pxs([(10, 20), (11, 20), (17, 20), (18, 20)], RF)
        pes(t, [(10, 21), (11, 21), (17, 21), (18, 21)], RA_CASCO)
    contorno_gba(t)


# ------------------------------------------------------------------ SLOWBRO
SB, SB_C, SB_E = H("f88868"), H("f8b890"), H("e06868")
SB_CREME, SB_CREME_E = H("f8d878"), H("d8b858")
SB_CONCHA, SB_CONCHA_C, SB_CONCHA_E = H("98a860"), H("c0d098"), H("506030")
SB_BOCA = H("903838")


def concha_slowbro(t, x, y, r):
    """o Shellder mordendo o rabo: a concha em espiral"""
    t.elipse(x, y, r, r + 1, SB_CONCHA)


def slowbro(t, lado):
    if lado == "frente":
        concha_slowbro(t, 19, 16, 3)                                        # a concha aparecendo do lado
        t.elipse(12, 16, 6, 5, SB)                                          # o corpo
        t.pxs([(5, 14), (4, 15), (19, 13), (20, 14)], SB)                   # os braços
        t.elipse(12, 7, 6, 5, SB)                                           # a cabeça
        sombrear(t, {SB: (SB_C, SB_E), SB_CONCHA: (SB_CONCHA_C, SB_CONCHA_E)})
        t.elipse(12, 17, 4, 3, SB_CREME)                                    # a barriga
        t.elipse(12, 10, 4, 2, SB_CREME); t.linha([(9, 10), (15, 10)], SB_BOCA, 1)   # o focinho de boca aberta
        t.linha([(8, 6), (10, 6)], P_, 1); t.linha([(14, 6), (16, 6)], P_, 1)   # o olhar vazio
        t.pxs([(20, 15), (19, 17)], SB_CONCHA_E)
        pes(t, [(8, 21), (9, 21), (15, 21), (16, 21)], SB_CREME_E)
    elif lado == "costas":
        t.elipse(12, 15, 6, 5, SB)
        t.pxs([(5, 14), (4, 15), (19, 14), (20, 15)], SB)
        t.elipse(12, 7, 6, 5, SB)
        t.pxs([(8, 2), (9, 2), (15, 2), (16, 2)], SB)                       # as orelhinhas
        concha_slowbro(t, 12, 17, 4)                                        # o Shellder no rabo, nas costas
        t.poli([(9, 15), (6, 13), (8, 17)], SB_CONCHA); t.poli([(15, 15), (18, 13), (16, 17)], SB_CONCHA)   # os espinhos
        sombrear(t, {SB: (SB_C, SB_E), SB_CONCHA: (SB_CONCHA_C, SB_CONCHA_E)})
        t.anel(12, 17, 2, 2, SB_CONCHA_E, 1); t.px(12, 17, SB_CONCHA_E)    # a espiral
        t.pxs([(10, 14), (14, 20), (9, 19)], SB_CONCHA_E)
        pes(t, [(8, 21), (9, 21), (15, 21), (16, 21)], SB_CREME_E)
    else:
        t.poli([(16, 18), (19, 14), (17, 12), (14, 15)], SB)                # o rabo indo pra trás
        concha_slowbro(t, 19, 14, 4)
        t.poli([(19, 9), (22, 7), (21, 11)], SB_CONCHA); t.poli([(22, 13), (23, 16), (21, 16)], SB_CONCHA)
        t.elipse(11, 15, 5, 5, SB)
        t.elipse(8, 7, 5, 5, SB)
        t.elipse(4, 10, 3, 2, SB)                                           # o focinho
        t.pxs([(6, 14), (5, 15)], SB)
        sombrear(t, {SB: (SB_C, SB_E), SB_CONCHA: (SB_CONCHA_C, SB_CONCHA_E)})
        t.elipse(9, 16, 3, 3, SB_CREME)
        t.elipse(3, 10, 2, 2, SB_CREME); t.linha([(1, 10), (5, 10)], SB_BOCA, 1)
        t.linha([(6, 6), (8, 6)], P_, 1)
        t.anel(19, 14, 2, 2, SB_CONCHA_E, 1)
        pes(t, [(9, 21), (10, 21), (13, 21), (14, 21)], SB_CREME_E)
    contorno_gba(t)


# ----------------------------------------------------------------- MAGNETON
MN, MN_C, MN_E = H("90b898"), H("d0f0d8"), H("588060")
MN_IMA, MN_IMA_C = H("504848"), H("888888")
MN_V, MN_A = H("f86038"), H("50c8f0")
MN_PARAFUSO, MN_PARAFUSO_E = H("d8d8d8"), H("888888")


def ima_u(t, x, y, d):
    """um ímã em U deitado, aberto pro lado d (-1 esquerda, 1 direita), de 5 de altura"""
    t.linha([(x, y - 2), (x, y + 2)], MN_IMA, 1)
    t.linha([(x, y - 2), (x + 2 * d, y - 2)], MN_IMA, 1); t.linha([(x, y + 2), (x + 2 * d, y + 2)], MN_IMA, 1)
    t.px(x + 2 * d, y - 2, MN_V); t.px(x + 2 * d, y + 2, MN_A)


def magneton(t, lado):
    if lado != "lado":
        bolas = ((12, 6), (7, 15), (17, 15))
        t.ret(11, 0, 13, 2, MN_PARAFUSO)                                    # o parafuso de cima
        t.linha([(9, 9), (10, 11)], MN_PARAFUSO, 2); t.linha([(15, 9), (14, 11)], MN_PARAFUSO, 2)   # os que unem
        for x, y in bolas:
            t.elipse(x, y, 4, 4, MN)
        sombrear(t, {MN: (MN_C, MN_E), MN_PARAFUSO: (MN_PARAFUSO, MN_PARAFUSO_E)})
        ima_u(t, 7, 6, -1); ima_u(t, 17, 6, 1)                              # os ímãs da de cima
        ima_u(t, 2, 15, -1); ima_u(t, 22, 15, 1)                            # e os de fora das de baixo
        for x, y in bolas:
            if lado == "frente":
                t.elipse(x, y, 1, 1, BR); t.pxs([(x, y), (x, y - 1)], P_)   # os olhões
            else:
                t.pxs([(x - 2, y - 2), (x + 2, y - 2), (x - 2, y + 2), (x + 2, y + 2)], MN_E)   # os rebites
    else:
        bolas = ((14, 6), (9, 15), (16, 16))
        t.ret(13, 0, 15, 2, MN_PARAFUSO)
        for x, y in bolas:
            t.elipse(x, y, 4, 4, MN)
        sombrear(t, {MN: (MN_C, MN_E), MN_PARAFUSO: (MN_PARAFUSO, MN_PARAFUSO_E)})
        for x, y in bolas:
            t.elipse(x - 2, y, 1, 1, BR); t.pxs([(x - 3, y), (x - 3, y - 1)], P_)
        for x, y in bolas:                                                  # o ímã de cada uma, virado pra gente
            t.ret(x + 1, y + 1, x + 3, y + 3, MN_IMA); t.px(x + 1, y + 1, MN_V); t.px(x + 1, y + 3, MN_A)
    contorno_gba(t)


# ------------------------------------------------------------------- DODRIO
DO, DO_C, DO_E = H("a07848"), H("d09038"), H("604830")
DO_BICO, DO_BICO_E = H("e8d8a8"), H("c0b080")
DO_PESCOCO = H("383028")
DO_PENA = H("f080a0")


def cabeca_dodrio(t, x, y, bico):
    t.elipse(x, y, 2, 2, DO)
    if bico == "baixo":
        t.poli([(x - 1, y + 1), (x, y + 5), (x + 1, y + 1)], DO_BICO)
    else:
        t.poli([(x - 1, y), (x - 6, y + 1), (x - 1, y + 2)], DO_BICO)
    t.px(x + 1, y - 3, DO_E)                                                # a peninha da cabeça


def dodrio(t, lado):
    if lado in ("frente", "costas"):
        for hx, hy in ((5, 6), (12, 3), (19, 6)):
            t.linha([(12, 13), (hx, hy)], DO_PESCOCO, 1)                    # os três pescoços pretos
        t.linha([(9, 18), (9, 20)], DO_BICO_E, 1); t.linha([(15, 18), (15, 20)], DO_BICO_E, 1)
        t.elipse(12, 15, 6, 4, DO)
        if lado == "costas":
            t.poli([(11, 17), (8, 22), (12, 19), (16, 22), (13, 17)], DO_PENA)   # o rabo de penas rosa
        for hx, hy in ((5, 6), (12, 3), (19, 6)):
            if lado == "frente":
                cabeca_dodrio(t, hx, hy, "baixo")
            else:
                t.elipse(hx, hy, 2, 2, DO)
        sombrear(t, {DO: (DO_C, DO_E), DO_BICO: (DO_BICO, DO_BICO_E)})
        if lado == "frente":
            for hx, hy in ((5, 6), (12, 3), (19, 6)):
                t.pxs([(hx - 1, hy - 1), (hx + 1, hy - 1)], P_)
        else:
            t.pxs([(10, 13), (14, 13), (12, 15)], DO_E)
        pes(t, [(8, 21), (9, 21), (10, 21), (14, 21), (15, 21), (16, 21)], DO_BICO_E)
    else:
        for hx, hy in ((17, 3), (12, 5), (7, 9)):
            t.linha([(14, 13), (hx, hy)], DO_PESCOCO, 1)
        t.linha([(12, 18), (12, 20)], DO_BICO_E, 1); t.linha([(16, 18), (16, 20)], DO_BICO_E, 1)
        t.poli([(18, 14), (23, 10), (22, 15)], DO_PENA)
        t.elipse(14, 15, 6, 4, DO)
        for hx, hy in ((17, 3), (12, 5), (7, 9)):                          # de trás pra frente
            cabeca_dodrio(t, hx, hy, "esq")
        sombrear(t, {DO: (DO_C, DO_E), DO_BICO: (DO_BICO, DO_BICO_E)})
        for hx, hy in ((17, 3), (12, 5), (7, 9)):
            t.px(hx - 1, hy - 1, P_)
        t.pxs([(15, 14), (17, 15), (16, 17)], DO_E)
        pes(t, [(11, 21), (12, 21), (15, 21), (16, 21)], DO_BICO_E)
    contorno_gba(t)



# ------------------------------------------------------------------ DEWGONG
DW, DW_C, DW_E = H("e0f0e8"), H("f8f8f8"), H("a8b0c8")
DW_LINGUA, DW_CHIFRE = H("e85838"), H("d0c8c8")


def dewgong(t, lado):
    if lado in ("frente", "costas"):
        t.poli([(9, 17), (3, 21), (2, 18)], DW); t.poli([(15, 17), (21, 21), (22, 18)], DW)   # as nadadeiras
        t.elipse(12, 15, 6, 6, DW)
        t.elipse(12, 7, 5, 5, DW)
        sombrear(t, {DW: (DW_C, DW_E)})
        t.poli([(11, 3), (12, 0), (13, 3)], DW_CHIFRE)                      # o chifre
        if lado == "frente":
            olhinho(t, 10, 6); olhinho(t, 14, 6)
            t.elipse(12, 10, 2, 1, DW_E); t.px(12, 11, DW_LINGUA)           # o focinho e a linguinha
            t.pxs([(9, 2), (15, 2)], DW_E)
        else:
            t.poli([(9, 20), (12, 22), (15, 20), (12, 18)], DW_E)           # o rabo de sereia
            t.linha([(12, 9), (12, 18)], DW_C, 1)
    else:
        t.poli([(17, 18), (23, 11), (21, 9), (19, 13), (14, 16)], DW)       # o rabo subindo
        t.poli([(21, 9), (23, 4), (23, 12)], DW)                            # a nadadeira do rabo
        t.elipse(13, 17, 7, 4, DW)
        t.elipse(7, 9, 5, 5, DW)
        t.poli([(8, 12), (12, 13), (10, 17), (5, 14)], DW)                  # o pescoço
        t.poli([(9, 18), (5, 22), (12, 21)], DW)
        sombrear(t, {DW: (DW_C, DW_E)})
        t.poli([(8, 5), (10, 1), (10, 6)], DW_CHIFRE)
        olhinho(t, 5, 8)
        t.elipse(3, 11, 1, 1, DW_E); t.px(2, 12, DW_LINGUA)
    contorno_gba(t)


# ---------------------------------------------------------------------- MUK
MU, MU_C, MU_E = H("c098b0"), H("e0b8d8"), H("906898")
MU_BOCA, MU_DENTE = H("404858"), H("e8d8e8")


def muk(t, lado):
    t.elipse(12, 19, 11, 3, MU)                                             # a poça grandona
    if lado == "lado":
        t.elipse(12, 12, 7, 8, MU)
        t.elipse(4, 12, 3, 3, MU); t.elipse(19, 10, 3, 3, MU)               # os braços
    else:
        t.elipse(12, 11, 8, 8, MU)
        t.elipse(3, 13, 3, 3, MU); t.elipse(21, 13, 3, 3, MU)
    t.pxs([(2, 21), (22, 20), (7, 22), (17, 22)], MU)                       # os pingos
    sombrear(t, {MU: (MU_C, MU_E)})
    if lado == "frente":
        for x in (9, 15):
            t.elipse(x, 7, 1, 1, BR); t.px(x, 7, P_)
        t.elipse(12, 13, 5, 3, MU_BOCA)                                     # a bocona larga
        t.linha([(8, 11), (16, 11)], MU_DENTE, 1)                           # os dentes
        t.linha([(9, 15), (15, 15)], MU_E, 1)
    elif lado == "lado":
        t.elipse(8, 7, 1, 1, BR); t.px(7, 7, P_)
        t.elipse(7, 13, 3, 3, MU_BOCA); t.linha([(5, 11), (9, 11)], MU_DENTE, 1)
    else:
        t.pxs([(8, 6), (15, 9), (10, 14), (17, 16), (6, 17)], MU_C)         # o brilho do lodo
    contorno_gba(t)


# ----------------------------------------------------------------- CLOYSTER
CL, CL_C, CL_E = H("a878b8"), H("d0a8e0"), H("482050")
CL_PEROLA, CL_PEROLA_C, CL_PEROLA_E = H("607870"), H("808868"), H("485040")
CL_ROSTO = H("202020")


def cloyster(t, lado):
    espinhos = ((12, 0), (4, 3), (20, 3), (1, 11), (23, 11), (3, 19), (21, 19))
    if lado == "lado":
        espinhos = ((14, 0), (21, 4), (23, 12), (20, 20), (8, 1))
    for ex, ey in espinhos:                                                 # os espinhos da concha
        t.poli([(12 + (ex - 12) // 3 - 2, 11 + (ey - 11) // 3), (ex, ey), (12 + (ex - 12) // 3 + 2, 11 + (ey - 11) // 3 + 1)], CL)
    t.elipse(12, 12, 8, 8, CL)
    sombrear(t, {CL: (CL_C, CL_E)})
    if lado == "frente":
        t.elipse(12, 12, 4, 6, CL_PEROLA)                                   # a pérola de dentro
        t.poli([(11, 7), (12, 3), (13, 7)], CL_PEROLA_C)                    # o chifre
        t.elipse(12, 13, 2, 3, CL_ROSTO)                                    # o rosto escuro
        t.pxs([(11, 12), (13, 12)], BR); t.linha([(11, 15), (13, 15)], CL_PEROLA_C, 1)
        t.anel(12, 12, 5, 7, CL_E, 1)                                       # a borda da concha aberta
    elif lado == "costas":
        for x in (8, 12, 16):
            t.linha([(x, 5), (x, 19)], CL_E, 1)                              # os gomos
    else:
        t.poli([(4, 7), (9, 6), (9, 18), (4, 17), (6, 12)], CL_PEROLA)
        t.elipse(6, 12, 1, 3, CL_ROSTO); t.px(5, 11, BR)
        t.linha([(10, 5), (10, 19)], CL_E, 1); t.linha([(15, 5), (15, 19)], CL_E, 1)
    contorno_gba(t)


# ------------------------------------------------------------------ HAUNTER
HA, HA_C, HA_E = H("9068b0"), H("c090d8"), H("583870")
HA_OLHO, HA_BOCA = H("d83030"), H("601010")


def haunter(t, lado):
    if lado in ("frente", "costas"):
        t.poli([(4, 9), (3, 2), (8, 5), (12, 0), (16, 5), (21, 2), (20, 9), (19, 14), (14, 17), (12, 21), (10, 17), (5, 14)], HA)   # a cabeça espinhuda e o rabo de fumaça
        t.elipse(2, 15, 2, 2, HA); t.elipse(22, 15, 2, 2, HA)                # as mãos soltas no ar
        t.pxs([(0, 13), (1, 12), (3, 12), (21, 12), (23, 12), (24, 13)], HA)   # os dedos
        sombrear(t, {HA: (HA_C, HA_E)})
        if lado == "frente":
            for x, d in ((8, 1), (16, -1)):                                  # o olhar mau
                t.poli([(x - 2 * d, 6), (x + 2 * d, 8), (x - d, 10)], BR); t.px(x, 8, P_)
            t.poli([(6, 11), (18, 11), (12, 16)], HA_BOCA)                   # a bocona
            t.pxs([(8, 11), (16, 11), (10, 12), (14, 12)], BR)
            t.px(12, 14, HA_OLHO)
        else:
            t.linha([(12, 3), (12, 17)], HA_E, 1)
    else:
        t.poli([(5, 10), (6, 3), (10, 6), (13, 0), (16, 6), (21, 4), (19, 10), (18, 15), (16, 21), (12, 16), (6, 14)], HA)
        t.elipse(2, 13, 2, 2, HA); t.elipse(21, 15, 2, 2, HA)
        t.pxs([(1, 10), (3, 10)], HA)
        sombrear(t, {HA: (HA_C, HA_E)})
        t.poli([(5, 7), (9, 8), (6, 10)], BR); t.px(7, 8, P_)
        t.poli([(5, 12), (10, 12), (7, 15)], HA_BOCA); t.px(6, 12, BR)
    contorno_gba(t)



# -------------------------------------------------------------------- HYPNO
HY, HY_C, HY_E = H("f8d860"), H("f8e898"), H("c8b068")
HY_GOLA, HY_GOLA_E = H("f8f8f8"), H("d0c0d8")
HY_PENDULO, HY_FIO = H("989898"), H("706880")


def hypno(t, lado):
    if lado in ("frente", "costas"):
        t.poli([(7, 5), (6, 0), (10, 3)], HY); t.poli([(17, 5), (18, 0), (14, 3)], HY)   # as orelhas
        t.elipse(12, 16, 5, 4, HY)                                          # o corpo
        t.ret(8, 18, 10, 20, HY); t.ret(14, 18, 16, 20, HY)
        t.elipse(12, 6, 5, 4, HY)                                           # a cabeça
        t.pxs([(6, 14), (5, 15), (18, 14), (19, 15)], HY)
        if lado == "frente":
            t.elipse(12, 9, 2, 2, HY)                                       # o narigão
        sombrear(t, {HY: (HY_C, HY_E)})
        t.elipse(12, 12, 6, 2, HY_GOLA); t.linha([(7, 13), (17, 13)], HY_GOLA_E, 1)   # a gola branca
        if lado == "frente":
            t.linha([(8, 5), (10, 6)], P_, 1); t.linha([(16, 5), (14, 6)], P_, 1)   # o olhar meio fechado
            t.px(12, 10, HY_E)
            t.linha([(20, 14), (20, 18)], HY_FIO, 1); t.elipse(20, 19, 1, 1, HY_PENDULO); t.px(20, 19, BR)   # o pêndulo
        else:
            t.pxs([(9, 16), (15, 16), (12, 18)], HY_E)
        pes(t, [(8, 21), (9, 21), (10, 21), (14, 21), (15, 21), (16, 21)], HY_E)
    else:
        t.poli([(11, 4), (13, 0), (14, 4)], HY)
        t.elipse(13, 16, 5, 4, HY)
        t.ret(10, 18, 12, 20, HY); t.ret(15, 18, 17, 20, HY)
        t.elipse(11, 6, 5, 4, HY)
        t.poli([(7, 6), (3, 9), (4, 11), (8, 9)], HY)                       # o narigão pra frente
        t.pxs([(8, 14), (7, 15), (6, 15)], HY)                              # o braço com o pêndulo
        sombrear(t, {HY: (HY_C, HY_E)})
        t.elipse(12, 12, 5, 2, HY_GOLA); t.linha([(8, 13), (16, 13)], HY_GOLA_E, 1)
        t.linha([(7, 5), (9, 6)], P_, 1)
        t.linha([(5, 16), (5, 18)], HY_FIO, 1); t.elipse(5, 19, 1, 1, HY_PENDULO); t.px(5, 19, BR)
        pes(t, [(10, 21), (11, 21), (12, 21), (15, 21), (16, 21), (17, 21)], HY_E)
    contorno_gba(t)


# ------------------------------------------------------------------ KINGLER
KI, KI_C, KI_E = H("e86828"), H("f89860"), H("b06038")
KI_BEGE, KI_BEGE_C, KI_BEGE_E = H("b88850"), H("e0b888"), H("604810")


def garra(t, x, y, r):
    """a pinça: o redondo grande com o corte no meio"""
    t.elipse(x, y, r, r + 1, KI)


def kingler(t, lado):
    if lado in ("frente", "costas"):
        t.linha([(11, 11), (11, 7)], KI_BEGE, 1); t.linha([(16, 11), (16, 7)], KI_BEGE, 1)   # os olhos no talo
        for x in (9, 11, 16, 18):
            t.linha([(x, 17), (x - 1 if x < 13 else x + 1, 20)], KI_BEGE, 1)   # as perninhas
        t.linha([(8, 13), (5, 10)], KI, 2)                                  # o braço da garrona
        t.elipse(14, 14, 6, 4, KI)                                          # a carapaça
        garra(t, 4, 6, 4)                                                   # a garrona, levantada
        t.linha([(19, 14), (21, 12)], KI, 1); garra(t, 21, 11, 2)           # a pequena
        sombrear(t, {KI: (KI_C, KI_E), KI_BEGE: (KI_BEGE_C, KI_BEGE_E)})
        t.linha([(0, 6), (4, 6)], P_, 1); t.px(4, 7, P_)                    # o corte das pinças
        t.pxs([(21, 11), (22, 11)], P_)
        t.pxs([(3, 3), (2, 4)], KI_C)
        if lado == "frente":
            t.elipse(11, 6, 1, 1, BR); t.elipse(16, 6, 1, 1, BR); t.pxs([(11, 6), (16, 6)], P_)
            t.elipse(14, 16, 3, 1, KI_BEGE)                                 # a boca de bolhas
            t.pxs([(13, 16), (15, 16)], KI_BEGE_C)
        else:
            t.pxs([(11, 5), (16, 5)], KI_BEGE_C)
            t.pxs([(11, 13), (14, 12), (17, 13)], KI_E)
    else:
        t.linha([(12, 11), (11, 7)], KI_BEGE, 1)
        for x in (11, 14, 17, 20):
            t.linha([(x, 16), (x + 1, 20)], KI_BEGE, 1)
        t.linha([(10, 13), (6, 10)], KI, 2)
        t.elipse(15, 13, 6, 4, KI)
        garra(t, 4, 6, 4)
        sombrear(t, {KI: (KI_C, KI_E), KI_BEGE: (KI_BEGE_C, KI_BEGE_E)})
        t.linha([(0, 6), (4, 6)], P_, 1); t.px(4, 7, P_)
        t.pxs([(3, 3), (2, 4)], KI_C)
        t.elipse(11, 6, 1, 1, BR); t.px(10, 6, P_)
        t.elipse(11, 15, 2, 1, KI_BEGE)
    contorno_gba(t)


# ---------------------------------------------------------------- ELECTRODE
EL, EL_C, EL_E = H("e04000"), H("f87848"), H("b03000")
EB, EB_C, EB_E = H("e8e8e8"), H("f8f8f8"), H("c8c8c8")


def electrode(t, lado):
    t.elipse(12, 12, 8, 8, EB)                                              # a bola, branca embaixo
    t.poli([(4, 12), (4, 8), (7, 5), (12, 4), (17, 5), (20, 8), (20, 12)], EL)   # e a metade de cima vermelha
    sombrear(t, {EL: (EL_C, EL_E), EB: (EB_C, EB_E)})
    t.linha([(4, 12), (20, 12)], P_, 1)                                     # a costura
    t.pxs([(8, 6), (9, 5)], EL_C)                                           # o brilho
    if lado == "frente":
        for x, d in ((9, 1), (15, -1)):                                     # o olhar bravo
            t.pxs([(x, 9), (x, 10), (x - d, 8)], P_)
        t.poli([(7, 13), (17, 13), (15, 16), (9, 16)], P_)                  # o sorrisão de dentes
        t.linha([(8, 14), (16, 14)], EB_C, 1)
        t.pxs([(10, 15), (12, 15), (14, 15)], EB_C)
    elif lado == "lado":
        t.pxs([(6, 9), (6, 10), (7, 8)], P_)
        t.poli([(4, 13), (9, 13), (8, 16), (5, 15)], P_); t.linha([(5, 14), (8, 14)], EB_C, 1)
    contorno_gba(t)


# ---------------------------------------------------------------- EXEGGUTOR
EX_FO, EX_FO_C, EX_FO_E = H("70a830"), H("b8f870"), H("506028")
EX, EX_C, EX_E = H("f8d868"), H("f8e8a0"), H("e0a858")
EX_TRONCO, EX_TRONCO_C, EX_TRONCO_E = H("887040"), H("b09848"), H("583808")


def palmeira(t, cx):
    """as folhas de coqueiro abertas em leque"""
    for ex, ey in ((cx - 10, 4), (cx - 7, 0), (cx, -1), (cx + 7, 0), (cx + 10, 4)):
        t.poli([(cx - 1, 6), (ex, ey), (cx + 1, 6)], EX_FO)
        t.poli([(cx, 5), (ex, ey), ((cx + ex) // 2, (6 + ey) // 2 + 2)], EX_FO)


def exeggutor(t, lado):
    cx = 12 if lado != "lado" else 13
    palmeira(t, cx)
    t.ret(cx - 3, 12, cx + 3, 19, EX_TRONCO)                                # o tronco
    t.elipse(cx, 15, 4, 3, EX_TRONCO)
    if lado == "lado":
        t.elipse(14, 7, 3, 3, EX); t.elipse(9, 9, 3, 3, EX); t.elipse(12, 11, 3, 2, EX)   # os cocos-cabeça
        t.pxs([(9, 15), (8, 16)], EX_TRONCO)
    else:
        t.elipse(8, 8, 3, 3, EX); t.elipse(16, 8, 3, 3, EX); t.elipse(12, 11, 3, 3, EX)
        t.pxs([(8, 14), (7, 15), (16, 14), (17, 15)], EX_TRONCO)            # os bracinhos
    sombrear(t, {EX_FO: (EX_FO_C, EX_FO_E), EX: (EX_C, EX_E), EX_TRONCO: (EX_TRONCO_C, EX_TRONCO_E)})
    if lado == "frente":
        for x, y in ((8, 8), (16, 8), (12, 11)):                            # as três caras
            t.pxs([(x - 1, y - 1), (x + 1, y - 1)], P_); t.px(x, y + 1, EX_TRONCO_E)
    elif lado == "lado":
        for x, y in ((14, 7), (9, 9), (12, 11)):
            t.px(x - 2, y - 1, P_)
    pes(t, [(cx - 3, 21), (cx - 2, 21), (cx + 2, 21), (cx + 3, 21)], EX_TRONCO_E)
    contorno_gba(t)


DESENHOS = {78: rapidash, 80: slowbro, 82: magneton, 85: dodrio,
            87: dewgong, 89: muk, 91: cloyster, 93: haunter,
            97: hypno, 99: kingler, 101: electrode, 103: exeggutor}
TAMANHO = {78: 1, 80: 0.95, 82: 0.85, 85: 1, 87: 1, 89: 1, 91: 0.9, 93: 1,
           97: 1, 99: 0.95, 101: 0.8, 103: 1}
