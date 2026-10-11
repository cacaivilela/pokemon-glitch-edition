"""LOTE D2: os fósseis, os pássaros lendários, os dragões e o MEWTWO andando
no mapa (formato em tools/andar_base.py)."""
from andar_base import *  # noqa: F401,F403


def olhao(t, x, y, cor=P_):
    """olho de 2 de largura e 3 de altura: o de 1 pixel some no encolher"""
    t.ret(x, y, x + 1, y + 2, cor)
    t.px(x, y, BR)


# --------------------------------------------------- OMANYTE e OMASTAR
CON, CON_C, CON_E = H("e8e088"), H("f8f8a8"), H("a8a048")   # a concha
CON_RISCO = H("605810")
OM, OM_C, OM_E = H("80c8c0"), H("98e0d8"), H("60a8a0")      # o corpo de polvo
OM_FUNDO = H("105850")


def concha(t, cx, cy, rx, ry, lado, espinhos=False):
    """a concha em espiral: de frente/costas os gomos, de lado a espiral"""
    if espinhos:                                            # os espinhos do OMASTAR
        for pts in ([(cx - rx + 1, cy - 2), (cx - rx - 2, cy - ry - 1), (cx - rx + 4, cy - ry + 2)],
                    [(cx - 2, cy - ry + 1), (cx + 1, cy - ry - 3), (cx + 3, cy - ry + 1)],
                    [(cx + rx - 1, cy - 2), (cx + rx + 2, cy - ry - 1), (cx + rx - 4, cy - ry + 2)]):
            t.poli(pts, CON_E)
    t.elipse(cx, cy, rx, ry, CON)


def riscos_concha(t, cx, cy, rx, ry, lado):
    if lado == "lado":
        t.anel(cx, cy, rx - 2, ry - 2, CON_RISCO, 1)        # a espiral
        t.anel(cx + 1, cy, rx - 4, ry - 4, CON_E, 1)
        t.px(cx + 1, cy, CON_RISCO)
    else:
        for i in range(1, 4):                               # os gomos da concha
            y = cy - ry + 2 * i + 1
            t.linha([(cx - rx + 2, y), (cx + rx - 2, y)], CON_E, 1)
        t.linha([(cx, cy - ry + 1), (cx, cy + ry - 1)], CON_RISCO, 1) if lado == "costas" else None


def tentaculos(t, xs, y, cor):
    for x in xs:
        t.linha([(x, y), (x, 20)], cor, 2)
    pes(t, [(x, 21) for x in xs], OM_E)                     # as pontinhas andam


def polvo(t, lado, n, espinhos):
    """o corpo de polvo com a concha: OMANYTE (n=4) e OMASTAR (n=6)"""
    xs = (7, 10, 14, 17) if n == 4 else (4, 7, 10, 14, 17, 20)
    if lado == "frente":
        concha(t, 12, 7, 8 + (n > 4), 6, lado, espinhos)
        t.elipse(12, 15, 6 + (n > 4), 4, OM)                # a cara na frente da concha
        tentaculos(t, xs, 17, OM)
        sombrear(t, {OM: (OM_C, OM_E), CON: (CON_C, CON_E)})
        riscos_concha(t, 12, 6, 8, 5, lado)
        for x in (8, 14):                                   # os olhões
            t.ret(x, 13, x + 1, 15, P_); t.px(x + (x > 12), 13, BR)
        if n > 4:
            t.poli([(10, 15), (14, 15), (12, 18)], CON_RISCO)   # o bico do OMASTAR
        else:
            t.pxs([(11, 17), (13, 17)], OM_FUNDO)
    elif lado == "costas":
        tentaculos(t, xs, 17, OM)
        concha(t, 12, 11, 8 + (n > 4), 8, lado, espinhos)
        sombrear(t, {OM: (OM_C, OM_E), CON: (CON_C, CON_E)})
        riscos_concha(t, 12, 11, 8, 8, lado)
    else:
        concha(t, 13, 10, 8, 8, lado, espinhos)
        t.elipse(7, 15, 5, 4, OM)
        tentaculos(t, (3, 6, 9, 12) if n == 4 else (2, 4, 6, 9, 12), 17, OM)
        sombrear(t, {OM: (OM_C, OM_E), CON: (CON_C, CON_E)})
        riscos_concha(t, 13, 10, 8, 8, lado)
        t.ret(4, 13, 5, 15, P_); t.px(4, 13, BR)
        if n > 4:
            t.poli([(1, 15), (4, 16), (2, 18)], CON_RISCO)
    contorno_gba(t)


def omanyte(t, lado):
    polvo(t, lado, 4, False)


def omastar(t, lado):
    polvo(t, lado, 6, True)


# ------------------------------------------------------------------- KABUTO
KB, KB_C, KB_E = H("b88828"), H("e0a840"), H("986018")
KB_FUNDO = H("683808")
KB_OLHO, KB_OLHO_C = H("e84840"), H("f8d030")


def kabuto(t, lado):
    if lado in ("frente", "costas"):
        t.elipse(12, 15, 9, 6, KB)                          # o casco
        t.ret(3, 15, 21, 18, KB)
        sombrear(t, {KB: (KB_C, KB_E)})
        if lado == "frente":
            t.poli([(5, 15), (19, 15), (17, 19), (7, 19)], P_)   # a cara escura embaixo do casco
            for x in (8, 14):                               # os olhos que brilham
                t.ret(x, 16, x + 2, 17, KB_OLHO); t.px(x, 16, KB_OLHO_C)
            t.linha([(4, 14), (20, 14)], KB_FUNDO, 1)
        else:
            t.linha([(12, 10), (12, 18)], KB_FUNDO, 1)      # a costura do casco
            t.pxs([(7, 13), (17, 13)], KB_FUNDO)
        pes(t, [(7, 21), (9, 21), (15, 21), (17, 21)], KB_FUNDO)
    else:
        t.elipse(13, 15, 9, 6, KB)
        t.ret(4, 15, 22, 18, KB)
        sombrear(t, {KB: (KB_C, KB_E)})
        t.poli([(4, 15), (10, 15), (9, 19), (4, 19)], P_)
        t.ret(5, 16, 7, 17, KB_OLHO); t.px(5, 16, KB_OLHO_C)
        t.linha([(4, 14), (21, 14)], KB_FUNDO, 1)
        pes(t, [(7, 21), (9, 21), (11, 21), (15, 21), (17, 21)], KB_FUNDO)
    contorno_gba(t)


# ---------------------------------------------------------------- KABUTOPS
KT, KT_C, KT_E = H("d8b870"), H("f0d890"), H("a89058")
KT_FUNDO = H("584818")
KT_FOICE, KT_FOICE_C, KT_FOICE_E = H("e0d8c0"), H("f8f8f8"), H("989890")
KT_OLHO = H("e84840")


def foice_kt(t, x, y, d):
    """a foice em meia-lua, abrindo pra fora do braço (x, y)"""
    t.poli([(x, y), (x + 4 * d, y), (x + 6 * d, y + 3), (x + 6 * d, y + 9), (x + 4 * d, y + 4), (x + d, y + 2)], KT_FOICE)


def kabutops(t, lado):
    if lado in ("frente", "costas"):
        t.elipse(12, 14, 4, 5, KT)                          # o corpo magro
        t.poli([(7, 6), (12, 1), (17, 6), (15, 9), (9, 9)], KT)   # a cabeça chata de lâmina
        t.linha([(9, 11), (7, 12)], KT, 2); t.linha([(15, 11), (17, 12)], KT, 2)
        foice_kt(t, 7, 12, -1); foice_kt(t, 17, 12, 1)
        t.linha([(10, 18), (9, 21)], KT, 2); t.linha([(14, 18), (15, 21)], KT, 2)   # as pernas
        sombrear(t, {KT: (KT_C, KT_E), KT_FOICE: (KT_FOICE_C, KT_FOICE_E)})
        if lado == "frente":
            t.ret(9, 6, 10, 7, KT_OLHO); t.ret(14, 6, 15, 7, KT_OLHO)   # os olhos vermelhos
            t.pxs([(9, 6), (15, 6)], P_)
            for y in (12, 14, 16):                          # a barriga em gomos
                t.linha([(10, y), (14, y)], KT_E, 1)
        else:
            t.poli([(10, 10), (12, 7), (14, 10), (12, 18)], KT_E)   # o casco das costas
            t.linha([(12, 8), (12, 17)], KT_FUNDO, 1)
        pes(t, [(8, 21), (9, 21), (15, 21), (16, 21)], KT_FUNDO)
    else:
        t.elipse(13, 14, 4, 5, KT)
        t.poli([(17, 11), (22, 17), (19, 18)], KT)          # o rabo
        t.poli([(5, 6), (10, 3), (19, 2), (14, 8), (8, 9)], KT)   # a cabeça pontuda pra trás
        t.linha([(11, 11), (9, 12)], KT, 2)
        foice_kt(t, 9, 12, -1)
        t.linha([(12, 18), (11, 21)], KT, 2); t.linha([(15, 18), (16, 21)], KT, 2)
        sombrear(t, {KT: (KT_C, KT_E), KT_FOICE: (KT_FOICE_C, KT_FOICE_E)})
        t.ret(7, 5, 8, 6, KT_OLHO); t.px(7, 5, P_)
        t.poli([(14, 10), (17, 12), (16, 17), (14, 16)], KT_E)
        pes(t, [(10, 21), (11, 21), (16, 21), (17, 21)], KT_FUNDO)
    contorno_gba(t)


# --------------------------------------------------------------- AERODACTYL
AE, AE_C, AE_E = H("c8c8d8"), H("e0d8e8"), H("90a8b0")
AE_FUNDO = H("486050")
AS, AS_C, AS_E = H("9060b0"), H("b880c0"), H("604890")   # as asas roxas
AE_BOCA = H("d86060")


def aerodactyl(t, lado):
    if lado in ("frente", "costas"):
        for d in (-1, 1):                                   # as asas abertas
            t.poli([(12 + 3 * d, 9), (12 + 10 * d, 2), (12 + 10 * d, 14), (12 + 8 * d, 11),
                    (12 + 6 * d, 15), (12 + 4 * d, 13)], AS)
        t.poli([(12, 16), (14, 22), (10, 22)], AE)           # o rabo
        t.elipse(12, 13, 4, 5, AE)                          # o corpo
        t.elipse(12, 6, 4, 4, AE)                           # a cabeça
        t.poli([(9, 4), (7, 1), (11, 3)], AE); t.poli([(15, 4), (17, 1), (13, 3)], AE)   # os chifrinhos
        sombrear(t, {AE: (AE_C, AE_E), AS: (AS_C, AS_E)})
        for d in (-1, 1):
            t.linha([(12 + 4 * d, 9), (12 + 9 * d, 3)], AE_E, 1)   # o osso da asa
        if lado == "frente":
            t.pxs([(10, 5), (10, 6), (14, 5), (14, 6)], P_); t.pxs([(10, 5), (14, 5)], BR)
            t.ret(10, 8, 14, 9, AE_BOCA)                    # a bocarra com dentes
            t.pxs([(10, 8), (12, 8), (14, 8)], BR)
        else:
            t.linha([(12, 9), (12, 17)], AE_E, 1)
    else:
        t.poli([(10, 9), (19, 0), (22, 3), (21, 13), (17, 10), (15, 14)], AS)   # a asa levantada
        t.poli([(13, 16), (22, 20), (23, 17), (16, 13)], AE)  # o rabo
        t.elipse(12, 14, 5, 4, AE)
        t.linha([(9, 12), (6, 9)], AE, 3)                   # o pescoço
        t.poli([(1, 6), (5, 3), (9, 5), (8, 9), (2, 10)], AE)   # a cabeça comprida
        t.poli([(7, 4), (11, 2), (9, 6)], AE)
        t.linha([(10, 17), (10, 21)], AE, 2); t.linha([(14, 17), (14, 21)], AE, 2)
        sombrear(t, {AE: (AE_C, AE_E), AS: (AS_C, AS_E)})
        t.linha([(12, 10), (19, 2)], AE_E, 1)
        t.linha([(1, 8), (6, 8)], AE_BOCA, 1); t.pxs([(2, 8), (4, 8)], BR)   # a boca
        t.pxs([(5, 5), (5, 6)], P_); t.px(5, 5, BR)
        pes(t, [(9, 21), (10, 21), (14, 21), (15, 21)], AE_FUNDO)
    contorno_gba(t)


# ------------------------------------------------- OS PÁSSAROS LENDÁRIOS
def passaro(t, lado, corpo, asa_cor, crista, rabo, olho, bico, asa_pts=None):
    """o molde dos três pássaros: asas abertas de frente/costas, uma levantada
    de lado; a crista e o rabo de cada um vêm de fora (listas de polígonos)"""
    if lado in ("frente", "costas"):
        asas = asa_pts or [(15, 9), (22, 3), (21, 10), (22, 13), (18, 14)]
        for d in (-1, 1):
            t.poli([(12 + d * (x - 12), y) for x, y in asas], asa_cor)
        for pts in rabo:
            t.poli(pts, asa_cor)
        t.elipse(12, 14, 4, 5, corpo)
        t.elipse(12, 7, 4, 4, corpo)
        for pts in crista:
            t.poli(pts, corpo)
    else:
        asas = asa_pts or [(15, 9), (22, 3), (21, 10), (22, 13), (18, 14)]
        t.poli([(x - 1, y - 1) for x, y in asas], asa_cor)   # a asa levantada pras costas
        t.poli([(10, 4), (19, 3), (20, 12), (13, 14)], asa_cor)   # a raiz da asa, sem buraco
        t.poli([(14, 12), (22, 17), (21, 21), (14, 19)], asa_cor)   # o rabo, emendado na asa
        t.elipse(12, 14, 5, 5, corpo)
        t.elipse(8, 7, 4, 4, corpo)
        for pts in crista:
            t.poli([(x + 2, y) for x, y in pts], corpo)


ARC, ARC_C, ARC_E = H("88b0e0"), H("c0c8f8"), H("6090c8")
ARC_FUNDO, ARC_OLHO = H("3868a0"), H("e06070")
ARC_BICO = H("484868")


def articuno(t, lado):
    crista = [[(10, 4), (12, -1), (14, 4)]]
    rabo = [[(11, 18), (5, 23), (9, 23), (12, 20), (15, 23), (19, 23), (13, 18)]]   # o rabo comprido
    passaro(t, lado, ARC, ARC_FUNDO, crista, rabo, ARC_OLHO, ARC_BICO)
    sombrear(t, {ARC: (ARC_C, ARC_E), ARC_FUNDO: (ARC, H("284870"))})
    if lado == "frente":
        for x, d in ((9, -1), (14, 1)):
            t.ret(x, 6, x + 1, 7, ARC_OLHO); t.px(x + (d < 0), 6, P_)
        t.poli([(11, 9), (13, 9), (12, 11)], ARC_BICO)
        t.elipse(12, 15, 2, 3, ARC_C)                       # o peito claro
    elif lado == "costas":
        t.linha([(12, 9), (12, 18)], ARC_E, 1)
    else:
        t.ret(6, 6, 7, 7, ARC_OLHO); t.px(6, 6, P_)
        t.poli([(4, 8), (1, 9), (4, 10)], ARC_BICO)
        t.elipse(10, 15, 2, 3, ARC_C)
    contorno_gba(t)


ZP, ZP_C, ZP_E = H("f8e800"), H("f8f888"), H("e0c810")
ZP_PRETO, ZP_BICO, ZP_BICO_E = H("404040"), H("d8a030"), H("a88840")


def zapdos(t, lado):
    espetos = [(15, 9), (22, 1), (19, 6), (22, 8), (19, 10), (22, 14), (17, 14)]   # a asa de raio
    crista = [[(9, 5), (5, 0), (11, 3)], [(11, 4), (12, -1), (13, 4)], [(15, 5), (19, 0), (13, 3)]]
    rabo = [[(10, 18), (6, 23), (12, 20), (18, 23), (14, 18)]]
    passaro(t, lado, ZP, ZP_E, crista, rabo, P_, ZP_BICO, espetos)
    sombrear(t, {ZP: (ZP_C, ZP_E), ZP_E: (ZP, H("a89000"))})
    if lado == "lado":
        t.linha([(15, 8), (21, 0)], ZP_PRETO, 1); t.linha([(16, 10), (21, 13)], ZP_PRETO, 1)   # as listras pretas das penas
        olhao(t, 6, 6)
        t.poli([(5, 8), (0, 10), (5, 10)], ZP_BICO); t.px(4, 10, ZP_BICO_E)   # o bico comprido
        t.linha([(10, 16), (13, 19)], ZP_E, 1)
    else:
        for d in (-1, 1):                                   # as listras pretas das penas
            t.linha([(12 + 4 * d, 9), (12 + 9 * d, 2)], ZP_PRETO, 1)
            t.linha([(12 + 5 * d, 12), (12 + 9 * d, 13)], ZP_PRETO, 1)
        if lado == "frente":
            olhao(t, 9, 6); olhao(t, 14, 6)
            t.poli([(11, 9), (13, 9), (12, 13)], ZP_BICO); t.px(12, 11, ZP_BICO_E)
            t.linha([(10, 16), (14, 16)], ZP_E, 1)
        else:
            t.linha([(12, 9), (12, 18)], ZP_E, 1)
    contorno_gba(t)


MO, MO_C, MO_E = H("f8d810"), H("f8f040"), H("f8a800")
FOGO, FOGO_C, FOGO_E = H("f86000"), H("f8a800"), H("e80000")
MO_BICO = H("c87820")


def moltres(t, lado):
    chamas = [(15, 9), (20, 1), (20, 5), (22, 4), (21, 9), (22, 11), (19, 14)]   # a asa de fogo
    crista = [[(10, 4), (9, -1), (12, 2), (13, -1), (14, 4)]]
    rabo = [[(10, 18), (5, 23), (9, 21), (12, 24), (15, 21), (19, 23), (14, 18)]]
    passaro(t, lado, MO, FOGO, crista, rabo, P_, MO_BICO, chamas)
    sombrear(t, {MO: (MO_C, MO_E), FOGO: (FOGO_C, FOGO_E)})
    if lado == "lado":
        t.poli([(17, 7), (20, 2), (20, 8)], FOGO_C)          # o miolo amarelo da chama
        olhao(t, 6, 6)
        t.poli([(5, 8), (1, 9), (5, 10)], MO_BICO)
    else:
        for d in (-1, 1):
            t.poli([(12 + 6 * d, 9), (12 + 9 * d, 4), (12 + 9 * d, 10)], FOGO_C)
        if lado == "frente":
            olhao(t, 9, 6); olhao(t, 14, 6)
            t.poli([(11, 9), (13, 9), (12, 12)], MO_BICO)
        else:
            t.linha([(12, 9), (12, 18)], MO_E, 1)
    contorno_gba(t)


# ---------------------------------------------------------------- DRAGONAIR
DA, DA_C, DA_E = H("50a0d0"), H("78b8f0"), H("6080a0")
DA_FUNDO, DA_BOLA = H("204870"), H("204088")
DA_BAR, DA_BAR_E = H("e0f0f0"), H("d0d0e0")


def bolinha(t, x, y):
    """a pérola azul-escura do pescoço e do rabo"""
    t.elipse(x, y, 1, 1, DA_BOLA); t.px(x - 1, y - 1, DA_C)


def asinha(t, x, y, d):
    """as asinhas brancas da cabeça"""
    t.poli([(x, y + 2), (x + 3 * d, y - 2), (x + 3 * d, y + 1), (x + d, y + 3)], DA_BAR)


def dragonair(t, lado):
    if lado in ("frente", "costas"):
        t.elipse(12, 18, 9, 3, DA)                          # o corpo enrolado
        t.elipse(12, 13, 3, 5, DA)                          # o pescoço
        t.elipse(12, 6, 4, 4, DA)
        asinha(t, 8, 3, -1); asinha(t, 16, 3, 1)
        t.poli([(11, 3), (12, -1), (13, 3)], DA_BAR)         # o chifre
        sombrear(t, {DA: (DA_C, DA_E), DA_BAR: (DA_BAR, DA_BAR_E)})
        bolinha(t, 12, 11) if lado == "frente" else None
        if lado == "frente":
            t.elipse(12, 15, 1, 2, DA_BAR)
            t.linha([(5, 19), (19, 19)], DA_BAR, 1)
            olhao(t, 9, 6); olhao(t, 14, 6)
            t.linha([(11, 9), (13, 9)], DA_E, 1)
        else:
            t.linha([(4, 17), (20, 17)], DA_FUNDO, 1)
            bolinha(t, 20, 15); bolinha(t, 4, 16)
    else:
        t.linha([(8, 11), (10, 17), (16, 19), (20, 16), (21, 11)], DA, 4)   # o corpo em S
        t.elipse(7, 7, 4, 4, DA)
        t.ret(1, 7, 6, 10, DA)                              # o focinho
        asinha(t, 10, 5, 1)
        t.poli([(5, 4), (5, 0), (7, 4)], DA_BAR)
        sombrear(t, {DA: (DA_C, DA_E), DA_BAR: (DA_BAR, DA_BAR_E)})
        t.linha([(7, 12), (9, 18), (16, 21)], DA_BAR, 1)    # a barriga clara embaixo
        bolinha(t, 9, 12); bolinha(t, 21, 9); bolinha(t, 21, 6)
        olhao(t, 4, 6)
    contorno_gba(t)


# ---------------------------------------------------------------- DRAGONITE
DN, DN_C, DN_E = H("d0b058"), H("f8c850"), H("706038")
DN_BAR, DN_BAR_E = H("f8f0c8"), H("d0d0a0")
DN_ASA, DN_ASA_C, DN_ASA_E = H("50a0a0"), H("78c0c0"), H("306868")


def dragonite(t, lado):
    if lado in ("frente", "costas"):
        for d in (-1, 1):                                   # as asinhas
            t.poli([(12 + 4 * d, 9), (12 + 11 * d, 3), (12 + 10 * d, 11)], DN_ASA)
        t.elipse(12, 16, 7, 6, DN)                          # o barrigão
        t.elipse(12, 6, 4, 4, DN)
        t.linha([(10, 2), (8, -1)], DN, 1); t.linha([(14, 2), (16, -1)], DN, 1)   # as anteninhas
        t.pxs([(5, 14), (4, 15), (19, 14), (20, 15)], DN)
        if lado == "costas":
            t.poli([(14, 19), (20, 22), (18, 18)], DN)      # o rabo
        sombrear(t, {DN: (DN_C, DN_E), DN_ASA: (DN_ASA_C, DN_ASA_E)})
        if lado == "frente":
            t.elipse(12, 16, 4, 5, DN_BAR)
            for y in (13, 15, 17, 19):
                t.linha([(10, y), (14, y)], DN_BAR_E, 1)    # os gomos da barriga
            olhao(t, 9, 5); olhao(t, 14, 5)
            t.pxs([(11, 8), (13, 8)], DN_E)
        else:
            t.pxs([(12, 11), (12, 14)], DN_E)
        pes(t, [(7, 21), (8, 21), (9, 21), (15, 21), (16, 21), (17, 21)], DN_E)
    else:
        t.poli([(13, 9), (21, 2), (20, 11)], DN_ASA)
        t.poli([(16, 16), (23, 19), (22, 21), (16, 20)], DN)   # o rabo
        t.elipse(12, 16, 6, 6, DN)
        t.elipse(8, 7, 4, 4, DN)
        t.ret(3, 7, 6, 9, DN)                               # o focinho
        t.linha([(8, 3), (5, -1)], DN, 1)
        sombrear(t, {DN: (DN_C, DN_E), DN_ASA: (DN_ASA_C, DN_ASA_E)})
        t.elipse(9, 16, 3, 5, DN_BAR)
        for y in (13, 16, 19):
            t.linha([(7, y), (10, y)], DN_BAR_E, 1)
        olhao(t, 6, 5)
        t.px(3, 8, DN_E)
        pes(t, [(8, 21), (9, 21), (10, 21), (14, 21), (15, 21), (16, 21)], DN_E)
    contorno_gba(t)


# ------------------------------------------------------------------- MEWTWO
MT, MT_C, MT_E = H("e0e0f0"), H("f8f8f8"), H("b8b8d0")
MR, MR_C, MR_E = H("b080d0"), H("e0b0f8"), H("8858a8")      # o roxo do rabo e da barriga
MT_OLHO = H("703090")


def mewtwo(t, lado):
    if lado in ("frente", "costas"):
        rabo = [(15, 17), (20, 15), (22, 10), (21, 6)] if lado == "frente" else [(13, 16), (18, 18), (21, 13), (20, 8)]
        t.linha(rabo, MR, 3)                                # o rabão roxo
        t.elipse(*rabo[-1], 2, 2, MR)
        t.elipse(12, 15, 4, 4, MT)                          # o corpo
        t.linha([(10, 18), (9, 21)], MT, 3); t.linha([(14, 18), (15, 21)], MT, 3)   # as pernas fortes
        t.linha([(8, 12), (6, 16)], MT, 2); t.linha([(16, 12), (18, 16)], MT, 2)   # os braços
        t.elipse(12, 6, 4, 4, MT)
        t.poli([(8, 4), (7, 0), (10, 3)], MT); t.poli([(16, 4), (17, 0), (14, 3)], MT)   # os chifrinhos
        t.linha([(12, 9), (12, 12)], MT, 2)                 # o tubo do pescoço
        sombrear(t, {MT: (MT_C, MT_E), MR: (MR_C, MR_E)})
        if lado == "frente":
            t.elipse(12, 17, 2, 2, MR)                      # a barriga roxa
            t.px(11, 16, MR_C)
            t.ret(9, 6, 10, 7, MT_OLHO); t.ret(14, 6, 15, 7, MT_OLHO)
            t.pxs([(9, 6), (15, 6)], P_)
        else:
            t.linha([(12, 10), (12, 13)], MT_E, 1)
        pes(t, [(8, 21), (9, 21), (15, 21), (16, 21)], MT_E)
    else:
        t.linha([(14, 17), (20, 18), (22, 13), (21, 8)], MR, 3)
        t.elipse(21, 7, 2, 2, MR)
        t.elipse(12, 15, 4, 4, MT)
        t.linha([(11, 18), (10, 21)], MT, 3); t.linha([(14, 18), (15, 21)], MT, 3)
        t.linha([(10, 12), (6, 15)], MT, 2)                 # o braço pra frente
        t.linha([(13, 9), (16, 4)], MT, 2)                  # o tubo de trás da cabeça
        t.elipse(10, 6, 4, 4, MT)
        t.poli([(11, 3), (13, 0), (13, 4)], MT)
        sombrear(t, {MT: (MT_C, MT_E), MR: (MR_C, MR_E)})
        t.elipse(11, 17, 2, 2, MR)
        t.ret(7, 6, 8, 7, MT_OLHO); t.px(7, 6, P_)
        pes(t, [(9, 21), (10, 21), (15, 21), (16, 21)], MT_E)
    contorno_gba(t)


DESENHOS = {138: omanyte, 139: omastar, 140: kabuto, 141: kabutops, 142: aerodactyl,
            144: articuno, 145: zapdos, 146: moltres, 148: dragonair, 149: dragonite, 150: mewtwo}
TAMANHO = {138: 0.85, 140: 0.75}
