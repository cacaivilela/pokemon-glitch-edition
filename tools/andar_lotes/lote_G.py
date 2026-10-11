"""Lote G: os iniciais de Sinnoh e a turma do começo da Gen 4 — andando no
mapa (formato em tools/andar_base.py). Olho é 2x2 e longe do contorno, senão
some quando encolhe."""
from andar_base import *  # noqa: F401,F403


def olhos2(t, pontos, cor=P_, brilho=True):
    """olhos de 2x2 (o de cima-esquerda vira brilho se der)"""
    for x, y in pontos:
        t.pxs([(x, y), (x + 1, y), (x, y + 1), (x + 1, y + 1)], cor)
        if brilho:
            t.px(x + 1, y, BR)


# ------------------------------------------------------------------ TURTWIG
TW, TW_C, TW_E = H("94ad5a"), H("bdce84"), H("5a7b42")
TW_CASCO, TW_FOLHA = H("634a3a"), H("3aa542")


def turtwig(t, lado):
    if lado == "lado":
        t.elipse(14, 15, 6, 4, TW_CASCO)                  # o casco marrom
        t.elipse(7, 11, 5, 5, TW)                          # a cabeça
        t.poli([(8, 6), (5, 1), (11, 5)], TW_FOLHA)        # o brotinho
        sombrear(t, {TW: (TW_C, TW_E), TW_CASCO: (H("8b6b52"), H("3a2a20"))})
        olhos2(t, [(4, 10)])
        t.linha([(3, 13), (6, 13)], H("c5bd3a"), 1)        # o bico amarelo
        pes(t, [(9, 21), (11, 21), (16, 21), (18, 21)], TW_E)
    else:
        t.elipse(12, 16, 7, 4, TW_CASCO)
        t.elipse(12, 10, 6, 5, TW)
        t.poli([(11, 5), (8, 0), (13, 3)], TW_FOLHA); t.poli([(13, 5), (16, 0), (11, 3)], TW_FOLHA)
        sombrear(t, {TW: (TW_C, TW_E), TW_CASCO: (H("8b6b52"), H("3a2a20"))})
        if lado == "frente":
            olhos2(t, [(8, 9), (14, 9)])
            t.linha([(10, 13), (14, 13)], H("c5bd3a"), 1)
        pes(t, [(7, 21), (8, 21), (16, 21), (17, 21)], TW_E)
    contorno_gba(t)


# ----------------------------------------------------------------- CHIMCHAR
CC, CC_C, CC_E = H("ef7b42"), H("ff9c63"), H("c56b29")
CC_CREME = H("ffe6ad")
FOGO, FOGO_C = H("e63131"), H("ffd040")


def chimchar(t, lado):
    if lado == "lado":
        t.elipse(10, 9, 5, 5, CC)
        t.elipse(12, 16, 4, 4, CC)
        t.poli([(15, 15), (21, 10), (19, 17)], FOGO); t.px(20, 11, FOGO_C)   # a chama do bumbum
        sombrear(t, {CC: (CC_C, CC_E)})
        t.elipse(7, 10, 3, 3, CC_CREME)
        olhos2(t, [(6, 8)])
        t.px(5, 12, H("7b4210"))
        pes(t, [(10, 21), (11, 21), (14, 21), (15, 21)], H("deb552"))
    else:
        if lado == "costas":
            t.poli([(13, 18), (19, 14), (18, 20)], FOGO)
        t.elipse(12, 9, 6, 5, CC)
        t.elipse(12, 16, 4, 4, CC)
        sombrear(t, {CC: (CC_C, CC_E)})
        if lado == "frente":
            t.elipse(12, 10, 4, 3, CC_CREME)               # a cara creme
            olhos2(t, [(9, 8), (14, 8)])
            t.px(12, 11, H("e63131"))
            t.elipse(12, 17, 2, 2, CC_CREME)
        else:
            t.poli([(10, 5), (12, 2), (14, 5)], CC_E)      # o topete
        pes(t, [(9, 21), (10, 21), (14, 21), (15, 21)], H("deb552"))
    contorno_gba(t)


# ------------------------------------------------------------------- PIPLUP
PP, PP_C, PP_E = H("318cd6"), H("6ba5e6"), H("21639c")
PP_BR, PP_BICO = H("ffffff"), H("f8c838")


def piplup(t, lado):
    if lado == "lado":
        t.elipse(11, 15, 5, 6, PP)
        t.elipse(10, 8, 5, 5, PP)
        t.poli([(14, 14), (17, 18), (13, 18)], PP_E)       # a asinha
        sombrear(t, {PP: (PP_C, PP_E)})
        t.elipse(8, 9, 3, 3, PP_BR)
        olhos2(t, [(7, 8)])
        t.poli([(4, 10), (1, 11), (4, 12)], PP_BICO)
        t.elipse(9, 17, 2, 3, PP_BR)
        pes(t, [(9, 21), (10, 21), (13, 21), (14, 21)], PP_BICO)
    else:
        t.elipse(12, 15, 6, 6, PP)
        t.elipse(12, 8, 6, 5, PP)
        sombrear(t, {PP: (PP_C, PP_E)})
        if lado == "frente":
            t.elipse(12, 9, 4, 3, PP_BR)                   # a "máscara" branca
            olhos2(t, [(9, 8), (14, 8)])
            t.poli([(11, 11), (13, 11), (12, 13)], PP_BICO)
            t.elipse(12, 17, 3, 3, PP_BR)
            t.pxs([(9, 15), (15, 15)], PP_BR)              # as bolinhas
        t.poli([(5, 14), (3, 18), (7, 17)], PP_E); t.poli([(19, 14), (21, 18), (17, 17)], PP_E)
        pes(t, [(8, 21), (9, 21), (15, 21), (16, 21)], PP_BICO)
    contorno_gba(t)


# ------------------------------------------------------------------- BIDOOF
BD, BD_C, BD_E = H("c58c42"), H("cebd84"), H("9c6331")
BD_ESC, BD_CREME = H("5a4229"), H("ffefbd")


def bidoof(t, lado):
    if lado == "lado":
        t.elipse(13, 14, 7, 6, BD)
        t.elipse(5, 15, 3, 3, BD_CREME)                    # o focinho
        t.poli([(19, 13), (22, 18), (18, 18)], BD_ESC)
        sombrear(t, {BD: (BD_C, BD_E)})
        t.linha([(9, 9), (16, 9)], BD_ESC, 1)              # a faixa escura
        olhos2(t, [(7, 11)], brilho=False)
        t.pxs([(4, 17), (4, 18)], BR)                      # o dentão
        t.px(3, 14, BD_ESC)
        pes(t, [(9, 21), (11, 21), (15, 21), (17, 21)], BD_ESC)
    else:
        t.elipse(12, 14, 8, 6, BD)
        t.poli([(5, 10), (5, 6), (8, 9)], BD_E); t.poli([(19, 10), (19, 6), (16, 9)], BD_E)
        sombrear(t, {BD: (BD_C, BD_E)})
        if lado == "frente":
            t.elipse(12, 16, 3, 2, BD_CREME)
            t.ret(9, 9, 15, 10, BD_ESC)
            olhos2(t, [(8, 12), (15, 12)], brilho=False)
            t.elipse(12, 14, 1, 1, H("423110"))
            t.pxs([(11, 18), (12, 18)], BR)
        else:
            t.ret(9, 8, 15, 9, BD_ESC)
        pes(t, [(6, 21), (7, 21), (17, 21), (18, 21)], BD_ESC)
    contorno_gba(t)


# -------------------------------------------------------------------- SHINX
SX, SX_C, SX_E = H("7badf7"), H("a8ccff"), H("637bb5")
SX_PRETO, SX_AM = H("42426b"), H("ffe65a")


def shinx(t, lado):
    if lado == "lado":
        t.elipse(14, 15, 5, 4, SX_PRETO)                   # o corpo preto
        t.elipse(8, 10, 5, 5, SX)
        t.poli([(9, 5), (13, 1), (12, 7)], SX)
        t.linha([(19, 15), (22, 11)], SX_PRETO, 1)
        t.poli([(21, 8), (24, 9), (22, 12)], SX_AM)        # a estrelinha do rabo
        sombrear(t, {SX: (SX_C, SX_E), SX_PRETO: (H("5a5a8b"), H("29294a"))})
        olhos2(t, [(5, 9)], SX_AM, brilho=False)
        t.pxs([(5, 9), (5, 10)], P_)
        pes(t, [(10, 21), (12, 21), (16, 21), (18, 21)], SX_PRETO)
    else:
        t.elipse(12, 16, 5, 4, SX_PRETO)
        t.elipse(12, 10, 6, 5, SX)
        t.poli([(6, 7), (4, 1), (9, 5)], SX); t.poli([(18, 7), (20, 1), (15, 5)], SX)
        sombrear(t, {SX: (SX_C, SX_E), SX_PRETO: (H("5a5a8b"), H("29294a"))})
        if lado == "frente":
            olhos2(t, [(8, 9), (14, 9)], SX_AM, brilho=False)
            t.pxs([(9, 9), (9, 10), (14, 9), (14, 10)], P_)
            t.px(12, 12, P_)
        else:
            t.poli([(14, 15), (20, 9), (19, 14)], SX_AM)
        pes(t, [(8, 21), (9, 21), (15, 21), (16, 21)], SX_PRETO)
    contorno_gba(t)


# ---------------------------------------------------------------- PACHIRISU
PC, PC_C, PC_E = H("f7f7f7"), H("ffffff"), H("cec5c5")
PC_AZ = H("7bb5e6")


def pachirisu(t, lado):
    if lado == "lado":
        t.elipse(18, 9, 5, 7, PC)                          # o rabão de esquilo
        t.elipse(10, 15, 4, 5, PC)
        t.elipse(9, 9, 5, 4, PC)
        t.poli([(10, 5), (13, 1), (13, 6)], PC)
        sombrear(t, {PC: (PC_C, PC_E)})
        t.linha([(17, 3), (19, 15)], PC_AZ, 1)
        t.linha([(9, 5), (12, 9)], PC_AZ, 1)
        olhos2(t, [(6, 8)], brilho=False)
        t.px(5, 11, H("f8c838"))
        pes(t, [(9, 21), (12, 21)], PC_E)
    else:
        if lado == "costas":
            t.elipse(12, 9, 6, 8, PC)
            t.linha([(12, 2), (12, 16)], PC_AZ, 1)
        t.elipse(12, 16, 4, 4, PC)
        t.elipse(12, 9, 6, 5, PC)
        t.poli([(6, 7), (4, 1), (9, 5)], PC); t.poli([(18, 7), (20, 1), (15, 5)], PC)
        sombrear(t, {PC: (PC_C, PC_E)})
        t.linha([(12, 4), (12, 7)], PC_AZ, 1)              # a faixa azul na testa
        if lado == "frente":
            olhos2(t, [(8, 9), (14, 9)], brilho=False)
            t.pxs([(7, 12), (17, 12)], H("f8c838"))       # as bochechas amarelas
        pes(t, [(9, 21), (10, 21), (14, 21), (15, 21)], PC_E)
    contorno_gba(t)


# ------------------------------------------------------------------- BUIZEL
BZ, BZ_C, BZ_E = H("ef7b19"), H("e6a531"), H("ad5a21")
BZ_CREME, BZ_AZ = H("f7f7b5"), H("2163a5")


def buizel(t, lado):
    if lado == "lado":
        t.elipse(11, 15, 4, 5, BZ)
        t.elipse(9, 8, 4, 4, BZ)
        t.poli([(15, 17), (22, 12), (21, 18)], BZ)         # o rabo duplo
        t.poli([(15, 18), (22, 20), (19, 16)], BZ)
        t.ret(7, 12, 14, 13, H("ffde00"))                  # a boia
        sombrear(t, {BZ: (BZ_C, BZ_E)})
        t.elipse(7, 9, 2, 2, BZ_CREME)
        olhos2(t, [(6, 7)], brilho=False)
        t.linha([(12, 15), (14, 17)], BZ_AZ, 1)            # a barbatana azul
        pes(t, [(10, 21), (13, 21)], BZ_E)
    else:
        if lado == "costas":
            t.poli([(12, 18), (19, 12), (18, 18)], BZ); t.poli([(12, 18), (5, 12), (6, 18)], BZ)
        t.elipse(12, 15, 5, 5, BZ)
        t.elipse(12, 8, 5, 4, BZ)
        t.ret(7, 11, 17, 12, H("ffde00"))
        sombrear(t, {BZ: (BZ_C, BZ_E)})
        if lado == "frente":
            t.elipse(12, 9, 3, 2, BZ_CREME)
            olhos2(t, [(9, 7), (14, 7)], brilho=False)
            t.elipse(12, 16, 3, 3, BZ_CREME)
        t.pxs([(6, 15), (18, 15)], BZ_AZ)
        pes(t, [(9, 21), (10, 21), (14, 21), (15, 21)], BZ_E)
    contorno_gba(t)


# ------------------------------------------------------------------ BUNEARY
BN, BN_C, BN_E = H("b57b4a"), H("c5a57b"), H("8c5a42")
BN_CREME = H("efdea5")


def buneary(t, lado):
    if lado == "lado":
        t.elipse(13, 5, 3, 4, BN_CREME)                    # a orelha enrolada
        t.elipse(11, 16, 4, 5, BN)
        t.elipse(10, 10, 4, 4, BN)
        t.elipse(14, 19, 3, 2, BN_CREME)                   # o pompom de baixo
        sombrear(t, {BN: (BN_C, BN_E), BN_CREME: (H("fff6d0"), H("c5a57b"))})
        olhos2(t, [(7, 9)], brilho=False)
        t.px(6, 12, H("c55a7b"))
        pes(t, [(9, 21), (12, 21)], BN_E)
    else:
        t.elipse(7, 5, 3, 5, BN_CREME) if lado == "frente" else None
        t.linha([(10, 6), (8, 1)], BN, 2); t.linha([(14, 6), (17, 1)], BN, 2)   # as orelhas
        t.elipse(17, 3, 3, 3, BN_CREME) if lado == "costas" else None
        t.elipse(12, 16, 5, 5, BN)
        t.elipse(12, 10, 5, 4, BN)
        t.elipse(12, 20, 5, 2, BN_CREME)
        sombrear(t, {BN: (BN_C, BN_E), BN_CREME: (H("fff6d0"), H("c5a57b"))})
        if lado == "frente":
            olhos2(t, [(9, 9), (14, 9)], brilho=False)
            t.px(12, 12, H("c55a7b"))
        pes(t, [(8, 22), (9, 22), (15, 22), (16, 22)], BN_E)
    contorno_gba(t)


# -------------------------------------------------------------------- RIOLU
RI, RI_C, RI_E = H("29739c"), H("4a9cef"), H("104a7b")
RI_PRETO, RI_CREME = H("3a3a3a"), H("f0e0a0")


def riolu(t, lado):
    if lado == "lado":
        t.elipse(11, 15, 4, 4, RI_CREME)
        t.elipse(9, 9, 4, 4, RI)
        t.poli([(10, 6), (14, 1), (12, 7)], RI)            # a orelha
        t.poli([(14, 16), (20, 14), (16, 18)], RI)         # o rabinho
        sombrear(t, {RI: (RI_C, RI_E)})
        t.ret(6, 8, 10, 9, RI_PRETO)                       # a máscara preta
        t.pxs([(7, 8), (8, 8)], H("de4242"))
        pes(t, [(9, 21), (10, 21), (13, 21), (14, 21)], RI)
    else:
        t.elipse(12, 16, 5, 4, RI_CREME)
        t.elipse(12, 9, 5, 4, RI)
        t.poli([(8, 7), (5, 1), (10, 5)], RI); t.poli([(16, 7), (19, 1), (14, 5)], RI)
        t.ret(7, 15, 7, 18, RI); t.ret(17, 15, 17, 18, RI)   # os braços azuis
        sombrear(t, {RI: (RI_C, RI_E)})
        if lado == "frente":
            t.ret(8, 8, 16, 9, RI_PRETO)
            t.pxs([(9, 8), (10, 8), (14, 8), (15, 8)], H("de4242"))
            t.pxs([(9, 9), (10, 9), (14, 9), (15, 9)], P_)
        else:
            t.poli([(11, 18), (12, 22), (14, 18)], RI)
        pes(t, [(9, 21), (10, 21), (14, 21), (15, 21)], RI)
    contorno_gba(t)


# -------------------------------------------------------------------- GIBLE
GB, GB_C, GB_E = H("5294ad"), H("8cc5d6"), H("426b84")
GB_V = H("de5a29")


def gible(t, lado):
    if lado == "lado":
        t.elipse(10, 10, 7, 6, GB)                         # o cabeção de tubarão
        t.poli([(12, 4), (16, 0), (16, 6)], GB)            # a barbatana
        t.elipse(13, 18, 3, 3, GB)
        t.poli([(15, 18), (21, 21), (16, 21)], GB)
        sombrear(t, {GB: (GB_C, GB_E)})
        t.ret(3, 12, 10, 13, GB_V)                         # a boca vermelha
        t.pxs([(4, 12), (6, 12), (8, 12)], BR)
        olhos2(t, [(6, 8)], P_, brilho=False)
        t.px(6, 8, H("f8c838"))
        pes(t, [(11, 21), (14, 21)], GB_E)
    else:
        t.elipse(12, 10, 8, 6, GB)
        t.poli([(10, 4), (12, 0), (14, 4)], GB)
        t.elipse(12, 18, 3, 3, GB)
        sombrear(t, {GB: (GB_C, GB_E)})
        if lado == "frente":
            t.ret(6, 13, 18, 14, GB_V)
            t.pxs([(7, 13), (10, 13), (14, 13), (17, 13)], BR)
            olhos2(t, [(7, 9), (15, 9)], brilho=False)
            t.pxs([(7, 9), (16, 9)], H("f8c838"))
        else:
            t.poli([(10, 18), (12, 23), (14, 18)], GB_E)
        pes(t, [(9, 21), (10, 21), (14, 21), (15, 21)], GB_E)
    contorno_gba(t)


# ----------------------------------------------------------------- DRIFLOON
DF, DF_C, DF_E = H("946be6"), H("b494ff"), H("7b42a5")


def drifloon(t, lado):
    t.elipse(12, 9, 7, 7, DF)                              # o balão
    t.poli([(12, 0), (14, 2), (10, 2)], H("f8f8f8"))       # o tufinho branco
    sombrear(t, {DF: (DF_C, DF_E)})
    t.linha([(10, 16), (8, 20), (9, 22)], H("ffde08"), 1)  # as cordinhas
    t.linha([(14, 16), (16, 20), (15, 22)], H("ffde08"), 1)
    t.elipse(9, 22, 1, 1, H("ffde08")); t.elipse(15, 22, 1, 1, H("ffde08"))
    if lado == "frente":
        olhos2(t, [(8, 8), (14, 8)], brilho=False)
        t.ret(10, 12, 14, 12, H("ffde08"))                 # o X amarelo
        t.pxs([(11, 11), (13, 11), (11, 13), (13, 13)], H("ffde08"))
    elif lado == "lado":
        olhos2(t, [(6, 8)], brilho=False)
    contorno_gba(t)


# ------------------------------------------------------------------- STARLY
ST, ST_C, ST_E = H("736363"), H("8c7373"), H("524a4a")


def starly(t, lado):
    if lado == "lado":
        t.elipse(12, 14, 6, 5, ST)
        t.elipse(8, 9, 4, 4, ST)
        t.poli([(16, 13), (22, 12), (18, 17)], ST_E)       # o rabo
        sombrear(t, {ST: (ST_C, ST_E)})
        t.elipse(10, 16, 3, 2, H("f8f8f8"))
        t.px(7, 10, BR)
        olhos2(t, [(6, 8)], brilho=False)
        t.poli([(4, 10), (1, 11), (4, 12)], H("f8a040"))
        pes(t, [(10, 21), (13, 21)], H("f8a040"))
    else:
        t.elipse(12, 14, 6, 6, ST)
        t.elipse(12, 8, 5, 4, ST)
        t.poli([(4, 12), (2, 18), (7, 16)], ST_E); t.poli([(20, 12), (22, 18), (17, 16)], ST_E)
        sombrear(t, {ST: (ST_C, ST_E)})
        if lado == "frente":
            t.elipse(12, 15, 3, 3, H("f8f8f8"))
            olhos2(t, [(9, 7), (14, 7)], brilho=False)
            t.poli([(11, 10), (13, 10), (12, 12)], H("f8a040"))
        pes(t, [(9, 21), (10, 21), (14, 21), (15, 21)], H("f8a040"))
    contorno_gba(t)


DESENHOS = {387: turtwig, 390: chimchar, 393: piplup, 396: starly, 399: bidoof, 403: shinx,
            417: pachirisu, 418: buizel, 425: drifloon, 427: buneary, 443: gible, 447: riolu}
TAMANHO = {387: 0.8, 390: 0.82, 393: 0.8, 396: 0.75, 399: 0.82, 403: 0.8,
           417: 0.78, 418: 0.85, 425: 0.85, 427: 0.82, 443: 0.85, 447: 0.85}
