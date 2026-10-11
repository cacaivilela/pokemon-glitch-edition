"""LOTE B4: SCIZOR, HERACROSS, SNEASEL, SKARMORY, HOUNDOUR, HOUNDOOM, PUPITAR,
TYRANITAR, RAIKOU, ENTEI, SUICUNE — andando no mapa."""
from andar_base import *  # noqa: F401,F403


def olhos2(t, xs, y, cor=P_, alto=2, brilho=True):
    """olhos de 2 de largura (sobrevivem ao encolher)"""
    for x in xs:
        t.ret(x, y, x + 1, y + alto - 1, cor)
        if brilho:
            t.px(x, y, BR)


# ------------------------------------------------------------------- SCIZOR
SC, SC_C, SC_E = H("ff6210"), H("ff8b29"), H("cd3900")
SC_ESCURO = H("7b2000")
SC_CINZA, SC_CINZA_C, SC_CINZA_E = H("94949c"), H("c5c5cd"), H("5a5a6a")
SC_OLHO = H("ffcd10")


def pinca(t, x, y):
    """a pinça com o 'olho' falso"""
    t.elipse(x, y, 3, 3, SC)


def scizor(t, lado):
    if lado in ("frente", "costas"):
        t.poli([(9, 9), (3, 4), (6, 11)], SC_CINZA); t.poli([(15, 9), (21, 4), (18, 11)], SC_CINZA)   # as asinhas
        t.elipse(12, 6, 4, 4, SC)                          # cabeça
        t.poli([(10, 3), (12, 0), (14, 3)], SC)            # o chifre
        t.elipse(12, 14, 3, 4, SC)                         # o tronco fino
        t.linha([(9, 12), (5, 14)], SC, 1); t.linha([(15, 12), (19, 14)], SC, 1)
        pinca(t, 4, 16); pinca(t, 20, 16)                  # as pinças grandes
        t.linha([(11, 18), (9, 20)], SC_CINZA, 2); t.linha([(13, 18), (15, 20)], SC_CINZA, 2)   # pernas
        sombrear(t, {SC: (SC_C, SC_E), SC_CINZA: (SC_CINZA_C, SC_CINZA_E)})
        t.linha([(2, 16), (6, 16)], SC_ESCURO, 1); t.linha([(18, 16), (22, 16)], SC_ESCURO, 1)   # a boca da pinça
        for x in (4, 20):
            t.pxs([(x - 1, 14), (x, 14)], P_); t.px(x - 1, 14, BR)
        if lado == "frente":
            olhos2(t, (9, 14), 5, cor=SC_OLHO, brilho=False)
            t.pxs([(10, 6), (14, 6)], P_)
            t.linha([(11, 13), (13, 13)], SC_CINZA, 1)
        else:
            t.linha([(12, 11), (12, 17)], SC_E, 1)
        pes(t, [(8, 21), (9, 21), (15, 21), (16, 21)], SC_CINZA_E)
    else:
        t.poli([(13, 9), (21, 3), (18, 11)], SC_CINZA)
        t.elipse(9, 6, 4, 4, SC)
        t.poli([(10, 3), (14, 0), (13, 4)], SC)
        t.elipse(12, 14, 3, 4, SC)
        t.linha([(11, 18), (10, 20)], SC_CINZA, 2); t.linha([(13, 18), (15, 20)], SC_CINZA, 2)
        sombrear(t, {SC: (SC_C, SC_E), SC_CINZA: (SC_CINZA_C, SC_CINZA_E)})
        t.linha([(10, 12), (6, 14)], SC, 1)
        pinca(t, 4, 15)                                    # a pinça na frente
        sombrear(t, {SC: (SC_C, SC_E)})
        t.linha([(1, 15), (5, 15)], SC_ESCURO, 1)
        t.pxs([(3, 13), (4, 13)], P_); t.px(3, 13, BR)
        olhos2(t, (6,), 5, cor=SC_OLHO, brilho=False); t.px(6, 6, P_)
        pes(t, [(9, 21), (10, 21), (15, 21), (16, 21)], SC_CINZA_E)
    contorno_gba(t)


# ---------------------------------------------------------------- HERACROSS
HE, HE_C, HE_E = H("6068b0"), H("7888d8"), H("303860")
HE_OLHO = H("f8f888")


def heracross(t, lado):
    if lado in ("frente", "costas"):
        t.elipse(12, 15, 6, 6, HE)                         # o corpo de besouro
        t.elipse(4, 14, 2, 3, HE); t.elipse(20, 14, 2, 3, HE)   # braços
        t.elipse(12, 8, 4, 3, HE)                          # cabeça
        if lado == "frente":
            t.poli([(10, 7), (10, 1), (12, 0), (14, 1), (14, 7)], HE)   # o chifrão
            t.pxs([(8, 1), (9, 1), (9, 2), (15, 1), (16, 1), (15, 2)], HE)   # a ponta em forquilha
        else:
            t.pxs([(7, 5), (8, 5), (16, 5), (17, 5)], HE)  # as antenas
        sombrear(t, {HE: (HE_C, HE_E)})
        if lado == "frente":
            olhos2(t, (8, 15), 7, cor=HE_OLHO, brilho=False)
            t.linha([(9, 14), (15, 14)], HE_E, 1); t.linha([(9, 17), (15, 17)], HE_E, 1)   # o peito
            t.pxs([(3, 17), (21, 17)], BR)                 # as garras
        else:
            t.linha([(12, 10), (12, 20)], HE_E, 1)         # a divisa das asas
            t.linha([(7, 12), (9, 17)], HE_C, 1); t.linha([(17, 12), (15, 17)], HE_C, 1)
        pes(t, [(8, 21), (9, 21), (15, 21), (16, 21)], HE_E)
    else:
        t.elipse(13, 15, 6, 6, HE)
        t.elipse(8, 8, 4, 3, HE)
        t.poli([(6, 7), (2, 1), (4, 0), (8, 5)], HE)       # o chifre pra frente
        t.px(1, 3, HE)
        sombrear(t, {HE: (HE_C, HE_E)})
        t.elipse(9, 14, 2, 3, HE)
        t.px(8, 17, BR)
        olhos2(t, (7,), 7, cor=HE_OLHO, brilho=False)
        t.linha([(14, 10), (17, 19)], HE_E, 1)
        pes(t, [(9, 21), (10, 21), (15, 21), (16, 21)], HE_E)
    contorno_gba(t)


# ------------------------------------------------------------------ SNEASEL
SN2, SN2_C, SN2_E = H("385848"), H("507868"), H("283828")
PENA, PENA_C, PENA_E = H("c04848"), H("f87068"), H("801020")
SN2_JOIA, SN2_ROSA = H("c88000"), H("f8c8d0")


def sneasel(t, lado):
    if lado in ("frente", "costas"):
        t.poli([(5, 2), (9, 6), (6, 9)], SN2); t.poli([(19, 2), (15, 6), (18, 9)], SN2)   # orelhas
        t.poli([(15, 4), (19, 0), (20, 2), (16, 6)], PENA)   # a pena vermelha da orelha
        t.elipse(12, 9, 5, 4, SN2)
        t.elipse(12, 17, 4, 4, SN2)
        t.linha([(8, 15), (4, 17)], SN2, 1); t.linha([(16, 15), (20, 17)], SN2, 1)
        if lado == "costas":
            t.poli([(13, 19), (19, 22), (17, 17)], PENA)   # as penas do rabo
        sombrear(t, {SN2: (SN2_C, SN2_E), PENA: (PENA_C, PENA_E)})
        t.pxs([(3, 18), (4, 18), (20, 18), (21, 18)], BR)   # as garras
        if lado == "frente":
            t.pxs([(6, 4), (18, 4)], SN2_ROSA)
            olhos2(t, (9, 14), 8, cor=H("801020"), brilho=False); t.pxs([(9, 8), (15, 8)], H("f87068"))
            t.px(12, 11, SN2_ROSA)
            t.elipse(12, 15, 1, 1, SN2_JOIA)               # a joia do peito
        pes(t, [(9, 21), (10, 21), (14, 21), (15, 21)], SN2_E)
    else:
        t.poli([(17, 18), (22, 21), (21, 16)], PENA)
        t.poli([(8, 2), (12, 7), (8, 8)], SN2)
        t.poli([(10, 3), (14, 0), (13, 5)], PENA)
        t.elipse(8, 9, 5, 4, SN2)
        t.elipse(13, 17, 4, 4, SN2)
        sombrear(t, {SN2: (SN2_C, SN2_E), PENA: (PENA_C, PENA_E)})
        t.linha([(11, 15), (7, 17)], SN2_C, 1)
        t.pxs([(5, 17), (6, 18)], BR)
        olhos2(t, (5,), 8, cor=H("801020"), brilho=False)
        t.px(3, 11, SN2_ROSA)
        pes(t, [(11, 21), (12, 21), (15, 21), (16, 21)], SN2_E)
    contorno_gba(t)


# ----------------------------------------------------------------- SKARMORY
SK, SK_C, SK_E = H("a4a4ac"), H("e6e6ee"), H("7b7b83")
SK_ASA, SK_ASA_C, SK_ASA_E = H("c53931"), H("f66252"), H("942000")


def skarmory(t, lado):
    """o pássaro de aço: asas de lâmina com o vermelho por dentro"""
    if lado in ("frente", "costas"):
        t.poli([(9, 9), (1, 4), (0, 12), (4, 14), (9, 13)], SK); t.poli([(15, 9), (23, 4), (24, 12), (20, 14), (15, 13)], SK)
        t.elipse(12, 6, 3, 3, SK)                          # cabeça
        t.poli([(12, 3), (17, 0), (14, 4)], SK)            # a crista
        t.elipse(12, 13, 4, 4, SK)
        t.linha([(10, 16), (9, 20)], SK_E, 1); t.linha([(14, 16), (15, 20)], SK_E, 1)   # as pernas finas
        sombrear(t, {SK: (SK_C, SK_E)})
        if lado == "frente":
            t.poli([(3, 7), (8, 11), (3, 11)], SK_ASA); t.poli([(21, 7), (16, 11), (21, 11)], SK_ASA)   # o vermelho das asas
            olhos2(t, (10, 13), 5, cor=H("ffde00"), alto=1, brilho=False)
            t.poli([(11, 8), (13, 8), (12, 11)], SK_E)     # o bico
        else:
            t.linha([(2, 7), (8, 11)], SK_E, 1); t.linha([(22, 7), (16, 11)], SK_E, 1)
            t.poli([(10, 16), (14, 16), (12, 20)], SK_ASA)   # o rabo
        pes(t, [(8, 21), (9, 21), (15, 21), (16, 21)], SK_E)
    else:
        t.poli([(12, 9), (21, 2), (23, 8), (17, 14)], SK)
        t.elipse(8, 6, 3, 3, SK)
        t.poli([(9, 3), (14, 0), (11, 5)], SK)
        t.poli([(5, 6), (1, 9), (5, 8)], SK)               # o bico comprido
        t.elipse(11, 13, 4, 4, SK)
        t.poli([(14, 15), (20, 19), (16, 13)], SK_ASA)
        t.linha([(10, 16), (9, 20)], SK_E, 1); t.linha([(12, 16), (14, 20)], SK_E, 1)
        sombrear(t, {SK: (SK_C, SK_E), SK_ASA: (SK_ASA_C, SK_ASA_E)})
        t.poli([(14, 8), (20, 4), (19, 8), (16, 11)], SK_ASA)
        t.px(7, 5, H("ffde00"))
        pes(t, [(8, 21), (9, 21), (14, 21), (15, 21)], SK_E)
    contorno_gba(t)


# --------------------------------------------- HOUNDOUR e HOUNDOOM (os cães)
HD, HD_C, HD_E = H("524a4a"), H("8b7b7b"), H("393131")
HD_BEGE, HD_BEGE_C, HD_BEGE_E = H("eea452"), H("ffd58b"), H("bd7b39")
HD_OSSO, HD_OSSO_E = H("ffffff"), H("b4a4a4")


def cao(t, lado, grande):
    """o cão preto com o focinho bege e os ossos; o grande tem chifres e rabo de seta"""
    if lado in ("frente", "costas"):
        if grande:                                         # os chifres curvos
            t.linha([(8, 5), (5, 3), (5, 0)], HD_OSSO, 1); t.linha([(16, 5), (19, 3), (19, 0)], HD_OSSO, 1)
        t.poli([(6, 3), (9, 6), (7, 9)], HD); t.poli([(18, 3), (15, 6), (17, 9)], HD)   # orelhas
        t.elipse(12, 18, 5, 3, HD)
        t.elipse(12, 9, 5, 4, HD)
        if lado == "costas":
            t.linha([(14, 18), (19, 15), (20, 11)], HD, 1)
            if grande:
                t.poli([(19, 11), (21, 8), (22, 11)], HD)  # a ponta de seta
        sombrear(t, {HD: (HD_C, HD_E), HD_OSSO: (HD_OSSO, HD_OSSO_E)})
        if lado == "frente":
            t.elipse(12, 12, 2, 1, HD_BEGE)                # o focinho bege
            t.px(12, 11, P_)
            t.elipse(12, 16, 3, 1, HD_BEGE)                # o peito
            olhos2(t, (8, 15), 8, cor=H("b43108") if grande else P_, brilho=not grande)
            t.ret(10, 14, 14, 14, HD_OSSO)                 # a coleira de osso
            t.pxs([(9, 20), (15, 20)], HD_OSSO)            # os anéis das pernas
        else:
            for y in (13, 16):                             # as costelas de osso
                t.linha([(9, y), (15, y)], HD_OSSO_E, 1)
        pes(t, [(8, 21), (9, 21), (15, 21), (16, 21)], HD_BEGE_E)
    else:
        t.linha([(17, 16), (21, 13), (22, 9)], HD, 1)
        if grande:
            t.poli([(21, 9), (22, 6), (23, 9)], HD)
            t.linha([(9, 5), (12, 3), (13, 0)], HD_OSSO, 1)
        t.poli([(8, 3), (12, 7), (8, 9)], HD)
        t.elipse(7, 10, 4, 4, HD)
        t.elipse(13, 17, 6, 3, HD)
        sombrear(t, {HD: (HD_C, HD_E), HD_OSSO: (HD_OSSO, HD_OSSO_E)})
        t.elipse(3, 12, 2, 1, HD_BEGE); t.px(1, 12, P_)
        t.elipse(10, 18, 2, 1, HD_BEGE)
        olhos2(t, (5,), 9, cor=H("b43108") if grande else P_, brilho=not grande)
        t.linha([(14, 15), (14, 17)], HD_OSSO_E, 1); t.linha([(17, 15), (17, 17)], HD_OSSO_E, 1)
        t.pxs([(9, 13), (10, 13)], HD_OSSO)
        pes(t, [(9, 21), (10, 21), (16, 21), (17, 21)], HD_BEGE_E)
    contorno_gba(t)


def houndour(t, lado):
    cao(t, lado, False)


def houndoom(t, lado):
    cao(t, lado, True)


# ------------------------------------------------------------------ PUPITAR
PU, PU_C, PU_E = H("7098c0"), H("88c0e8"), H("285880")
PU_OLHO = H("b04000")


def pupitar(t, lado):
    """o casulo de pedra, pulando sem pé"""
    t.poli([(12, 1), (17, 6), (18, 15), (12, 21), (6, 15), (7, 6)], PU)
    t.pxs([(5, 11), (19, 11), (4, 12), (20, 12)], PU)      # as pontas dos lados
    sombrear(t, {PU: (PU_C, PU_E)})
    if lado == "frente":
        t.linha([(7, 10), (17, 10)], PU_E, 1)              # o rasgo do olho
        t.ret(8, 11, 16, 12, P_)
        t.pxs([(9, 11), (10, 11), (14, 11), (15, 11)], PU_OLHO)
        t.linha([(8, 15), (12, 18), (16, 15)], PU_E, 1)
    elif lado == "costas":
        t.linha([(12, 3), (12, 19)], PU_E, 1)
        t.linha([(8, 8), (16, 8)], PU_E, 1); t.linha([(8, 14), (16, 14)], PU_E, 1)
    else:
        t.ret(6, 11, 9, 12, P_); t.pxs([(7, 11), (8, 11)], PU_OLHO)
        t.linha([(11, 3), (14, 18)], PU_E, 1)
    contorno_gba(t)


# ---------------------------------------------------------------- TYRANITAR
TY, TY_C, TY_E = H("70a070"), H("a0d0a0"), H("385038")
TY_PEITO, TY_PEITO_C, TY_PEITO_E = H("4898e0"), H("60b0f8"), H("2078b8")


def tyranitar(t, lado):
    if lado in ("frente", "costas"):
        if lado == "costas":
            t.poli([(14, 18), (22, 21), (23, 16), (17, 15)], TY)   # o rabão
        t.elipse(12, 15, 7, 6, TY)
        t.elipse(4, 13, 2, 3, TY); t.elipse(20, 13, 2, 3, TY)
        t.elipse(12, 6, 4, 4, TY)
        t.poli([(10, 3), (12, 0), (14, 3)], TY)            # o chifre
        for x, y in ((6, 9), (18, 9)):
            t.poli([(x, y), (x + (-2 if x < 12 else 2), y - 3), (x + (1 if x < 12 else -1), y + 1)], TY)   # os espinhos
        sombrear(t, {TY: (TY_C, TY_E)})
        if lado == "frente":
            t.poli([(10, 12), (14, 12), (15, 16), (12, 19), (9, 16)], TY_PEITO)   # o losango azul
            sombrear(t, {TY_PEITO: (TY_PEITO_C, TY_PEITO_E)})
            olhos2(t, (9, 14), 5, cor=H("902800"), brilho=False)
            t.linha([(10, 9), (14, 9)], TY_E, 1)
            t.pxs([(3, 15), (21, 15)], BR)
        else:
            for y in (10, 14, 18):
                t.poli([(10, y), (12, y - 2), (14, y)], TY_E)   # as placas das costas
                t.poli([(10, y), (12, y - 2), (14, y)], TY_E)
        pes(t, [(7, 21), (8, 21), (9, 21), (15, 21), (16, 21), (17, 21)], TY_E)
    else:
        t.poli([(16, 17), (23, 21), (23, 14)], TY)
        t.elipse(13, 15, 6, 6, TY)
        t.elipse(8, 6, 4, 4, TY)
        t.poli([(7, 3), (8, 0), (10, 3)], TY)
        for x, y in ((13, 3), (18, 8), (20, 12)):
            t.poli([(x - 2, y + 2), (x + 2, y - 2), (x + 1, y + 3)], TY)
        sombrear(t, {TY: (TY_C, TY_E)})
        t.poli([(8, 12), (10, 12), (10, 18), (8, 16)], TY_PEITO)
        t.elipse(12, 14, 2, 2, TY)
        olhos2(t, (6,), 5, cor=H("902800"), brilho=False)
        t.linha([(4, 9), (7, 9)], TY_E, 1)
        pes(t, [(9, 21), (10, 21), (11, 21), (15, 21), (16, 21), (17, 21)], TY_E)
    contorno_gba(t)


# ------------------------------------------ OS TRÊS CÃES LENDÁRIOS (felinos)
def fera(t, lado, cor, juba, cara, traços):
    """o corpo comum dos três: quatro patas, a juba nas costas e a cara;
    `traços(t, lado)` desenha o que faz cada um ser ele"""
    (B, B_C, B_E), (J, J_C, J_E), (F, F_C, F_E) = cor, juba, cara
    if lado in ("frente", "costas"):
        t.elipse(12, 17, 6, 4, B)                          # o corpo
        t.elipse(12, 10, 8, 5, J)                          # a juba atrás da cabeça
        t.elipse(12, 9, 4, 4, F)                           # a cara
        t.pxs([(7, 21), (8, 21), (16, 21), (17, 21)], B)
        sombrear(t, {B: (B_C, B_E), J: (J_C, J_E), F: (F_C, F_E)})
    else:
        t.elipse(14, 16, 7, 4, B)
        t.elipse(11, 9, 6, 5, J)
        t.elipse(6, 10, 4, 4, F)
        t.poli([(3, 11), (0, 13), (4, 14)], F)             # o focinho
        sombrear(t, {B: (B_C, B_E), J: (J_C, J_E), F: (F_C, F_E)})
    traços(t, lado)
    if lado in ("frente", "costas"):
        pes(t, [(7, 21), (8, 21), (16, 21), (17, 21)], B_E)
    else:
        pes(t, [(9, 21), (10, 21), (17, 21), (18, 21)], B_E)
    contorno_gba(t)


RA, RA_C, RA_E = H("ffcd41"), H("ffee94"), H("d59c29")
RA_NUVEM, RA_NUVEM_C, RA_NUVEM_E = H("7b29de"), H("b473ff"), H("411094")
RA_CARA, RA_CARA_C, RA_CARA_E = H("d5d5d5"), H("ffffff"), H("a4a4a4")


def raikou(t, lado):
    def tracos(t, lado):
        if lado == "frente":
            olhos2(t, (9, 13), 8, cor=H("e62900"), brilho=False)
            t.poli([(10, 4), (12, 2), (14, 4)], RA_CARA_E)   # a coroa
            t.pxs([(11, 12), (13, 12)], H("6a6a6a"))       # as presas
            t.linha([(8, 17), (9, 19)], P_, 1); t.linha([(16, 17), (15, 19)], P_, 1)   # as listras raio
        elif lado == "costas":
            t.linha([(8, 16), (10, 17), (9, 19)], P_, 1); t.linha([(16, 16), (14, 17), (15, 19)], P_, 1)
            t.linha([(11, 15), (13, 15)], P_, 1)
        else:
            olhos2(t, (4,), 9, cor=H("e62900"), brilho=False)
            t.linha([(14, 14), (15, 16), (14, 18)], P_, 1); t.linha([(18, 14), (19, 16), (18, 18)], P_, 1)
            t.linha([(20, 15), (23, 11)], RA_CARA, 1)       # o rabo de raio
    fera(t, lado, (RA, RA_C, RA_E), (RA_NUVEM, RA_NUVEM_C, RA_NUVEM_E), (RA_CARA, RA_CARA_C, RA_CARA_E), tracos)


EN, EN_C, EN_E = H("b4944a"), H("debd62"), H("836220")
EN_JUBA, EN_JUBA_C, EN_JUBA_E = H("d5d5d5"), H("ffffff"), H("acacac")
EN_CARA, EN_CARA_C, EN_CARA_E = H("e62900"), H("ff6a31"), H("9c0000")
EN_OURO = H("ffe694")


def entei(t, lado):
    def tracos(t, lado):
        if lado == "frente":
            t.poli([(9, 5), (12, 1), (15, 5), (12, 6)], EN_OURO)   # a coroa dourada
            t.elipse(12, 10, 2, 2, EN_JUBA)                # a máscara branca no rosto
            olhos2(t, (9, 14), 8, cor=P_, brilho=False)
            t.px(12, 11, P_)
            t.linha([(7, 19), (17, 19)], H("626262"), 1)   # as algemas cinzas
        elif lado == "costas":
            t.linha([(9, 15), (15, 15)], EN_E, 1)
            t.poli([(10, 6), (12, 3), (14, 6)], EN_JUBA_E)
        else:
            t.poli([(5, 6), (7, 3), (9, 6)], EN_OURO)
            t.elipse(4, 11, 1, 2, EN_JUBA)
            olhos2(t, (6,), 8, cor=P_, brilho=False)
            t.linha([(9, 18), (19, 18)], H("626262"), 1)
    fera(t, lado, (EN, EN_C, EN_E), (EN_JUBA, EN_JUBA_C, EN_JUBA_E), (EN_CARA, EN_CARA_C, EN_CARA_E), tracos)


SU, SU_C, SU_E = H("7bbdff"), H("bdeeff"), H("5a73d5")
SU_JUBA, SU_JUBA_C, SU_JUBA_E = H("8b31e6"), H("ac6aff"), H("52398b")
SU_BRANCO = H("ffffff")


def suicune(t, lado):
    def tracos(t, lado):
        if lado == "frente":
            t.poli([(11, 6), (12, 0), (13, 6)], SU_BRANCO)  # o cristal da testa
            olhos2(t, (9, 13), 8, cor=H("394a94"), brilho=True)
            t.pxs([(9, 16), (15, 16), (12, 18)], SU_BRANCO)   # os losangos brancos
        elif lado == "costas":
            t.pxs([(10, 15), (14, 15), (12, 17)], SU_BRANCO)
            t.linha([(12, 3), (12, 6)], SU_BRANCO, 1)     # a ponta do cristal
        else:
            t.poli([(6, 7), (4, 1), (8, 6)], SU_BRANCO)
            olhos2(t, (4,), 9, cor=H("394a94"))
            t.pxs([(13, 15), (17, 16)], SU_BRANCO)
            t.linha([(20, 14), (23, 19)], SU_BRANCO, 1)
    fera(t, lado, (SU, SU_C, SU_E), (SU_JUBA, SU_JUBA_C, SU_JUBA_E), (SU, SU_C, SU_E), tracos)


DESENHOS = {212: scizor, 214: heracross, 215: sneasel, 227: skarmory, 228: houndour, 229: houndoom,
            247: pupitar, 248: tyranitar, 243: raikou, 244: entei, 245: suicune}
TAMANHO = {215: 0.9, 228: 0.85, 247: 0.85}
