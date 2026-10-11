"""LOTE A4: os iniciais de Johto que evoluíram (BAYLEEF, MEGANIUM, QUILAVA,
TYPHLOSION, CROCONAW, FERALIGATR), CROBAT, TOGETIC, AMPHAROS, AZUMARILL e
SUDOWOODO."""
from andar_base import *  # noqa: F401,F403


def bola(t, x, y, cor):
    """bolinha 2x2 (a elipse de raio 1 vira um +)"""
    t.pxs([(x, y), (x + 1, y), (x, y + 1), (x + 1, y + 1)], cor)


def olho2(t, x, y, cor=P_):
    """olho 2x2 com o brilho: no encolhido ele não some"""
    t.pxs([(x, y), (x + 1, y), (x, y + 1), (x + 1, y + 1)], cor)
    t.px(x, y, BR)


# ------------------------------------------------------- BAYLEEF/MEGANIUM
BY, BY_C, BY_E = H("f0e868"), H("f8f8a8"), H("a08018")
BY_FOLHA, BY_FOLHA_C, BY_FOLHA_E = H("48a010"), H("68c030"), H("105010")
MG, MG_C, MG_E = H("98e050"), H("c8f890"), H("208810")
MG_PETALA, MG_PETALA_C, MG_PETALA_E = H("f83858"), H("f0a098"), H("c82038")
MG_ANTENA = H("f8d820")


def bayleef(t, lado):
    if lado == "lado":
        t.linha([(9, 6), (16, 1), (21, 3)], BY_FOLHA, 2)   # a folha da cabeça pra trás
        t.elipse(7, 8, 5, 4, BY)
        t.linha([(9, 11), (11, 14)], BY, 3)                # o pescoço
        t.elipse(14, 16, 6, 4, BY)
        t.poli([(19, 15), (23, 12), (21, 17)], BY)
        for x in (8, 11, 14):                              # o colar de brotos
            t.elipse(x, 13, 1, 1, BY_FOLHA)
        sombrear(t, {BY: (BY_C, BY_E), BY_FOLHA: (BY_FOLHA_C, BY_FOLHA_E)})
        olho2(t, 4, 7, BY_FOLHA_E)
        t.linha([(2, 10), (4, 10)], BY_E, 1)
        pes(t, [(10, 21), (11, 21), (17, 21), (18, 21)], BY_E)
    else:
        t.poli([(11, 4), (14, 0), (21, 1), (15, 4)], BY_FOLHA)   # a folha
        t.elipse(12, 8, 5, 4, BY)
        t.elipse(12, 17, 6, 4, BY)
        for x in (6, 9, 12, 15, 18):                       # o colar de brotos
            t.elipse(x, 13 if x in (6, 18) else 12, 1, 1, BY_FOLHA)
        sombrear(t, {BY: (BY_C, BY_E), BY_FOLHA: (BY_FOLHA_C, BY_FOLHA_E)})
        if lado == "frente":
            olho2(t, 9, 7, BY_FOLHA_E); olho2(t, 14, 7, BY_FOLHA_E)
            t.linha([(11, 10), (13, 10)], BY_E, 1)
        else:
            t.poli([(12, 19), (17, 22), (14, 19)], BY)
        pes(t, [(8, 21), (9, 21), (15, 21), (16, 21)], BY_E)
    contorno_gba(t)


def meganium(t, lado):
    if lado == "lado":
        t.linha([(8, 4), (9, 0)], MG_ANTENA, 1); t.linha([(9, 4), (11, 1)], MG_ANTENA, 1)   # as anteninhas
        t.elipse(7, 6, 4, 4, MG)
        t.linha([(9, 9), (10, 13)], MG, 3)
        t.elipse(14, 17, 6, 4, MG)
        t.poli([(19, 16), (23, 13), (21, 18)], MG)
        t.elipse(11, 12, 5, 3, MG_PETALA)                  # a flor no pescoço
        sombrear(t, {MG: (MG_C, MG_E), MG_PETALA: (MG_PETALA_C, MG_PETALA_E)})
        t.px(11, 12, MG_ANTENA)
        olho2(t, 4, 5, MG_E)
        t.linha([(2, 8), (4, 8)], MG_E, 1)
        pes(t, [(10, 21), (11, 21), (17, 21), (18, 21)], MG_E)
    else:
        t.linha([(10, 3), (8, 0)], MG_ANTENA, 1); t.linha([(14, 3), (16, 0)], MG_ANTENA, 1)
        t.elipse(12, 18, 6, 4, MG)
        t.elipse(12, 13, 10, 4, MG_PETALA)                 # a flor aberta em volta do pescoço
        t.elipse(12, 7, 5, 4, MG)
        sombrear(t, {MG: (MG_C, MG_E), MG_PETALA: (MG_PETALA_C, MG_PETALA_E)})
        for x in (5, 19, 12):
            t.px(x, 13 if x != 12 else 15, MG_PETALA_C)
        t.linha([(8, 11), (6, 15)], MG_PETALA_E, 1); t.linha([(16, 11), (18, 15)], MG_PETALA_E, 1)   # as divisões das pétalas
        if lado == "frente":
            olho2(t, 9, 6, MG_E); olho2(t, 14, 6, MG_E)
            t.linha([(11, 9), (13, 9)], MG_E, 1)
        pes(t, [(8, 21), (9, 21), (15, 21), (16, 21)], MG_E)
    contorno_gba(t)


# ------------------------------------------------------ QUILAVA/TYPHLOSION
QC, QC_C, QC_E = H("f8e8a0"), H("f8f8d0"), H("b09850")       # o creme da barriga
QA, QA_C, QA_E = H("405088"), H("6080b8"), H("182850")       # o azul das costas
FOGO, FOGO_C, FOGO_E = H("f86000"), H("f8d800"), H("e80000")


def labareda(t, pontos):
    """a juba de fogo: chamas pontudas"""
    t.poli(pontos, FOGO_E)
    cx = sum(x for x, _ in pontos) / len(pontos); cy = sum(y for _, y in pontos) / len(pontos)
    t.poli([(round(x + (cx - x) * 0.4), round(y + (cy - y) * 0.4)) for x, y in pontos], FOGO)
    t.poli([(round(x + (cx - x) * 0.75), round(y + (cy - y) * 0.75)) for x, y in pontos], FOGO_C)


def quilava(t, lado):
    if lado == "lado":
        labareda(t, [(9, 5), (13, 0), (14, 4), (18, 1), (17, 6), (22, 5), (19, 10), (12, 9)])   # fogo da cabeça
        labareda(t, [(18, 15), (23, 11), (22, 16), (23, 19), (19, 19)])   # fogo do rabo
        t.elipse(7, 9, 5, 4, QA)
        t.elipse(13, 16, 7, 4, QA)
        sombrear(t, {QA: (QA_C, QA_E)})
        t.elipse(5, 10, 3, 3, QC); t.elipse(11, 18, 5, 2, QC)
        olho2(t, 4, 8)
        pes(t, [(8, 21), (9, 21), (16, 21), (17, 21)], QC_E)
    else:
        labareda(t, [(5, 7), (2, 2), (8, 4), (12, 0), (16, 4), (22, 2), (19, 7)])
        t.elipse(12, 9, 6, 4, QA)
        t.elipse(12, 17, 6, 4, QA if lado == "costas" else QC)
        if lado == "costas":
            labareda(t, [(9, 19), (12, 14), (15, 19), (12, 22)])
        sombrear(t, {QA: (QA_C, QA_E), QC: (QC_C, QC_E)})
        if lado == "frente":
            t.elipse(12, 10, 5, 3, QC)                     # a cara creme
            olho2(t, 9, 9); olho2(t, 14, 9)
            t.px(12, 12, QA_E)
        pes(t, [(8, 21), (9, 21), (15, 21), (16, 21)], QC_E)
    contorno_gba(t)


def typhlosion(t, lado):
    if lado == "lado":
        labareda(t, [(6, 4), (8, 0), (11, 3), (15, 0), (16, 4), (21, 3), (19, 8), (10, 8)])   # a gola de fogo
        t.elipse(6, 7, 4, 3, QA)
        t.poli([(3, 6), (0, 9), (4, 10)], QA)
        t.elipse(12, 15, 6, 6, QC)
        t.elipse(15, 13, 4, 5, QA)                         # as costas azuis
        t.linha([(9, 13), (5, 15)], QC, 2)
        sombrear(t, {QA: (QA_C, QA_E), QC: (QC_C, QC_E)})
        olho2(t, 4, 6, FOGO_E)
        pes(t, [(9, 21), (10, 21), (14, 21), (15, 21)], QC_E)
    else:
        labareda(t, [(3, 10), (1, 3), (6, 5), (8, 0), (12, 3), (16, 0), (18, 5), (23, 3), (21, 10)])
        t.elipse(12, 15, 7, 6, QC)
        t.elipse(12, 7, 5, 4, QA if lado == "costas" else QC)
        if lado == "costas":
            t.elipse(12, 15, 7, 6, QA)
        t.pxs([(5, 13), (4, 14), (19, 13), (20, 14)], QC)
        sombrear(t, {QA: (QA_C, QA_E), QC: (QC_C, QC_E)})
        if lado == "frente":
            t.ret(7, 4, 17, 5, QA)                         # a testa azul
            olho2(t, 9, 6, FOGO_E); olho2(t, 14, 6, FOGO_E)
            t.linha([(10, 9), (14, 9)], QC_E, 1)
        pes(t, [(8, 21), (9, 21), (15, 21), (16, 21)], QC_E)
    contorno_gba(t)


# ------------------------------------------------------ CROCONAW/FERALIGATR
CR, CR_C, CR_E = H("58a8e0"), H("80c8f8"), H("3080c0")
CR_ESC = H("484880")
CR_CREME, CR_CREME_E = H("f8e060"), H("e0b050")
CR_CRISTA, CR_CRISTA_C, CR_CRISTA_E = H("f85820"), H("f8a060"), H("c82818")
CR_BOCA = H("c82818")


def jacare(grande):
    """CROCONAW e (grande) FERALIGATR: bocão, crista vermelha, barriga amarela"""
    def crista(t, x, y, n):
        for i in range(n):
            t.poli([(x + 3 * i, y), (x + 3 * i + 1, y - 3), (x + 3 * i + 3, y)], CR_CRISTA)

    def desenho(t, lado):
        if lado == "lado":
            crista(t, 10, 5, 3 if grande else 2)
            t.elipse(8, 8, 5, 4, CR)
            t.poli([(4, 7), (0, 9), (0, 12), (6, 12)], CR)     # o focinho comprido
            t.elipse(13, 16, 6 if grande else 5, 5, CR)
            t.poli([(17, 18), (23, 21), (19, 21)], CR)
            sombrear(t, {CR: (CR_C, CR_E), CR_CRISTA: (CR_CRISTA_C, CR_CRISTA_E)})
            t.linha([(0, 10), (6, 11)], CR_BOCA, 1)
            t.pxs([(1, 9), (3, 9)], BR)                     # os dentes
            t.elipse(10, 17, 3, 3, CR_CREME)
            olho2(t, 6, 6, CR_BOCA)
            t.linha([(5, 5), (8, 5)], CR_ESC, 1)
            pes(t, [(9, 21), (10, 21), (15, 21), (16, 21)], CR_E)
        else:
            crista(t, 8, 5, 3)
            t.elipse(12, 8, 6, 5, CR)
            t.elipse(12, 17, 6 if grande else 5, 4, CR)
            t.pxs([(5, 15), (4, 16), (19, 15), (20, 16)], CR)
            sombrear(t, {CR: (CR_C, CR_E), CR_CRISTA: (CR_CRISTA_C, CR_CRISTA_E)})
            if lado == "frente":
                t.elipse(12, 11, 4, 2, CR_BOCA)              # o bocão aberto
                t.pxs([(9, 10), (11, 10), (13, 10), (15, 10)], BR)
                olho2(t, 8, 6, CR_BOCA); olho2(t, 15, 6, CR_BOCA)
                t.elipse(12, 18, 3, 3, CR_CREME)
                t.linha([(9, 17), (15, 17)], CR_CREME_E, 1)
            else:
                crista(t, 9, 16, 2)
                t.poli([(12, 19), (18, 23), (15, 19)], CR)
            pes(t, [(8, 21), (9, 21), (15, 21), (16, 21)], CR_E)
        contorno_gba(t)
    return desenho


croconaw = jacare(False)
feraligatr = jacare(True)


# ------------------------------------------------------------------- CROBAT
CB, CB_C, CB_E = H("c55acd"), H("e68bf6"), H("731894")
CB_ASA, CB_ASA_C, CB_ASA_E = H("206a94"), H("4a9cbd"), H("104a73")
CB_OLHO = H("ffd500")


def crobat(t, lado):
    if lado == "lado":
        t.poli([(10, 10), (20, 1), (22, 9), (18, 14)], CB)     # a asa de cima, pra trás
        t.poli([(12, 11), (19, 4), (20, 10)], CB_ASA)
        t.elipse(10, 12, 5, 5, CB)
        t.poli([(10, 15), (17, 21), (9, 19)], CB)              # a asa de baixo
        sombrear(t, {CB: (CB_C, CB_E), CB_ASA: (CB_ASA_C, CB_ASA_E)})
        t.poli([(6, 7), (8, 3), (10, 7)], CB)                  # a orelha
        olho2(t, 6, 10, CB_OLHO); t.px(6, 10, P_)
        t.pxs([(5, 14), (6, 14), (6, 15)], BR)                 # o dente
    else:
        for d in (-1, 1):                                      # as quatro asas
            t.poli([(12 + 4 * d, 9), (12 + 12 * d, 1), (12 + 11 * d, 11), (12 + 5 * d, 12)], CB)
            t.poli([(12 + 4 * d, 14), (12 + 11 * d, 17), (12 + 8 * d, 21), (12 + 3 * d, 17)], CB)
        t.elipse(12, 12, 5, 5, CB)
        t.poli([(8, 8), (8, 3), (11, 7)], CB); t.poli([(16, 8), (16, 3), (13, 7)], CB)
        sombrear(t, {CB: (CB_C, CB_E)})
        for d in (-1, 1):
            t.poli([(12 + 6 * d, 9), (12 + 10 * d, 3), (12 + 10 * d, 10)], CB_ASA)
        if lado == "frente":
            olho2(t, 9, 11, CB_OLHO); olho2(t, 14, 11, CB_OLHO)
            t.pxs([(9, 11), (15, 11)], P_)
            t.linha([(10, 15), (14, 15)], CB_E, 1); t.pxs([(10, 16), (14, 16)], BR)
    contorno_gba(t)


# ------------------------------------------------------------------ TOGETIC
TT, TT_C, TT_E = H("e6e6ee"), H("ffffff"), H("acacbd")
TT_ASA = H("cdcdcd")
TT_AZUL, TT_RUBRO = H("0029c5"), H("b40000")


def togetic(t, lado):
    if lado == "lado":
        t.poli([(12, 11), (21, 6), (20, 13)], TT_ASA)         # a asinha
        t.elipse(10, 7, 5, 5, TT)
        t.poli([(10, 2), (13, 0), (13, 3)], TT)
        t.elipse(11, 16, 4, 5, TT)
        sombrear(t, {TT: (TT_C, TT_E), TT_ASA: (TT_C, TT_E)})
        olho2(t, 6, 7)
        bola(t, 9, 16, TT_RUBRO)
        pes(t, [(10, 21), (12, 21)], TT_E)
    else:
        t.poli([(8, 13), (1, 9), (3, 16)], TT_ASA); t.poli([(16, 13), (23, 9), (21, 16)], TT_ASA)
        t.poli([(9, 4), (10, 0), (12, 3), (14, 0), (15, 4)], TT)   # a coroinha
        t.elipse(12, 8, 5, 5, TT)
        t.elipse(12, 16, 4, 5, TT)
        sombrear(t, {TT: (TT_C, TT_E), TT_ASA: (TT_C, TT_E)})
        if lado == "frente":
            olho2(t, 9, 7); olho2(t, 14, 7)
            t.px(12, 10, H("f08080"))
            bola(t, 9, 15, TT_RUBRO); bola(t, 14, 15, TT_AZUL)   # os triângulos coloridos
            t.px(12, 18, TT_RUBRO)
        pes(t, [(10, 21), (14, 21)], TT_E)
    contorno_gba(t)


# ----------------------------------------------------------------- AMPHAROS
AM, AM_C, AM_E = H("ffc510"), H("ffee4a"), H("d59400")
AM_BRANCO, AM_BRANCO_E = H("ffffff"), H("acacac")
AM_JOIA, AM_JOIA_E = H("c54100"), H("8b2000")
AM_LISTRA = H("101010")


def ampharos(t, lado):
    if lado == "lado":
        t.elipse(8, 6, 4, 4, AM)
        t.linha([(10, 9), (11, 12)], AM, 3)
        t.elipse(13, 16, 5, 5, AM_BRANCO)
        t.elipse(15, 15, 4, 5, AM)
        t.linha([(18, 18), (22, 14), (22, 10)], AM, 2)     # o rabo listrado
        sombrear(t, {AM: (AM_C, AM_E), AM_BRANCO: (AM_BRANCO, AM_BRANCO_E)})
        t.pxs([(10, 2), (11, 2), (12, 3)], AM_LISTRA)      # o chifre/orelha listrado
        t.pxs([(21, 15), (22, 13)], AM_LISTRA)
        bola(t, 21, 8, AM_JOIA)
        bola(t, 4, 3, AM_JOIA)                             # a joia da testa
        olho2(t, 6, 6)
        pes(t, [(10, 21), (11, 21), (15, 21), (16, 21)], AM_E)
    else:
        t.elipse(12, 7, 5, 4, AM)
        t.poli([(7, 6), (5, 1), (9, 4)], AM); t.poli([(17, 6), (19, 1), (15, 4)], AM)   # orelhas listradas
        t.elipse(12, 16, 6, 5, AM_BRANCO if lado == "frente" else AM)
        t.pxs([(5, 14), (4, 15), (19, 14), (20, 15)], AM)
        if lado == "costas":
            t.linha([(14, 19), (20, 18), (21, 13)], AM, 2)
        sombrear(t, {AM: (AM_C, AM_E), AM_BRANCO: (AM_BRANCO, AM_BRANCO_E)})
        t.pxs([(6, 2), (7, 4), (18, 2), (17, 4)], AM_LISTRA)
        if lado == "frente":
            bola(t, 11, 3, AM_JOIA)
            olho2(t, 9, 6); olho2(t, 14, 6)
            t.px(12, 9, AM_E)
        else:
            t.linha([(8, 14), (16, 14)], AM_LISTRA, 1); t.linha([(9, 17), (15, 17)], AM_LISTRA, 1)   # as listras pretas
            bola(t, 20, 11, AM_JOIA)
        pes(t, [(8, 21), (9, 21), (15, 21), (16, 21)], AM_E)
    contorno_gba(t)


# ---------------------------------------------------------------- AZUMARILL
AZ, AZ_C, AZ_E = H("58a8e0"), H("80c8f8"), H("3080c0")
AZ_BRANCO, AZ_BRANCO_E = H("f8f8f8"), H("c8c8c8")
AZ_ORELHA = H("e05000")


def azumarill(t, lado):
    if lado == "lado":
        t.poli([(9, 5), (13, 0), (14, 1), (12, 7)], AZ)    # a orelhona comprida
        t.elipse(8, 9, 4, 4, AZ)
        t.elipse(12, 16, 7, 5, AZ)
        t.linha([(19, 17), (22, 19)], P_, 1); t.elipse(22, 16, 2, 2, AZ)   # o rabo com a bola
        sombrear(t, {AZ: (AZ_C, AZ_E)})
        t.elipse(10, 17, 4, 3, AZ_BRANCO)
        t.pxs([(13, 1), (12, 3)], AZ_ORELHA)
        olho2(t, 5, 8)
        t.pxs([(7, 18), (13, 15)], AZ)                     # as bolhas da barriga
        pes(t, [(9, 21), (10, 21), (15, 21), (16, 21)], AZ_E)
    else:
        t.poli([(8, 6), (6, 0), (10, 4)], AZ); t.poli([(16, 6), (18, 0), (14, 4)], AZ)
        t.elipse(12, 8, 5, 4, AZ)
        t.elipse(12, 16, 7, 5, AZ)
        if lado == "costas":
            t.linha([(14, 18), (20, 20)], P_, 1); t.elipse(20, 17, 2, 2, AZ)
        sombrear(t, {AZ: (AZ_C, AZ_E)})
        t.pxs([(7, 1), (7, 3), (17, 1), (17, 3)], AZ_ORELHA)
        if lado == "frente":
            t.elipse(12, 17, 5, 3, AZ_BRANCO)              # a barriga branca de bolinhas
            t.pxs([(9, 16), (13, 18), (15, 16)], AZ)
            olho2(t, 9, 7); olho2(t, 14, 7)
            t.px(12, 10, H("e05080"))
        pes(t, [(8, 21), (9, 21), (15, 21), (16, 21)], AZ_E)
    contorno_gba(t)


# ---------------------------------------------------------------- SUDOWOODO
SW, SW_C, SW_E = H("bd9c52"), H("e6c56a"), H("947331")
SW_FOLHA, SW_FOLHA_C, SW_FOLHA_E = H("29ac31"), H("8bff8b"), H("186a20")
SW_MARROM = H("624a10")


def sudowoodo(t, lado):
    if lado == "lado":
        t.linha([(10, 5), (11, 0)], SW, 2)                 # o galho de cima
        t.elipse(10, 12, 5, 9, SW)
        t.linha([(9, 9), (3, 6)], SW, 2)                   # o braço-galho
        for x, y in ((2, 4), (4, 3), (3, 7)):
            t.elipse(x, y, 1, 1, SW_FOLHA)
        sombrear(t, {SW: (SW_C, SW_E), SW_FOLHA: (SW_FOLHA_C, SW_FOLHA_E)})
        olho2(t, 6, 7)
        t.pxs([(8, 14), (10, 16), (12, 12)], SW_MARROM)    # as manchas de casca
        pes(t, [(8, 21), (9, 21), (12, 21), (13, 21)], SW_E)
    else:
        t.poli([(10, 4), (12, 0), (14, 4)], SW)            # o galho de cima
        t.elipse(12, 12, 5, 9, SW)
        t.linha([(8, 10), (3, 6)], SW, 2); t.linha([(16, 10), (21, 6)], SW, 2)   # os braços
        for x, y in ((2, 4), (4, 4), (3, 6), (20, 4), (22, 4), (21, 6)):         # as bolinhas verdes
            t.elipse(x, y, 1, 1, SW_FOLHA)
        sombrear(t, {SW: (SW_C, SW_E), SW_FOLHA: (SW_FOLHA_C, SW_FOLHA_E)})
        if lado == "frente":
            olho2(t, 9, 7); olho2(t, 14, 7)
            t.linha([(11, 11), (13, 11)], SW_MARROM, 1)
        t.pxs([(10, 15), (14, 14), (12, 18)], SW_MARROM)
        pes(t, [(8, 21), (9, 21), (15, 21), (16, 21)], SW_E)
    contorno_gba(t)


DESENHOS = {153: bayleef, 154: meganium, 156: quilava, 157: typhlosion, 159: croconaw,
            160: feraligatr, 169: crobat, 176: togetic, 181: ampharos, 184: azumarill,
            185: sudowoodo}
TAMANHO = {153: 0.9, 156: 0.88, 159: 0.88, 176: 0.8, 184: 0.85, 185: 0.92}
