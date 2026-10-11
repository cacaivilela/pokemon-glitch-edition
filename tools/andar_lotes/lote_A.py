"""LOTE A: as evoluções dos iniciais, RAICHU e os primeiros da rota
(PIDGEY, PIDGEOTTO, RATTATA, SPEAROW, CATERPIE)."""
from andar_base import *  # noqa: F401,F403


# ------------------------------------------------------------------ IVYSAUR
IV, IV_C, IV_E = H("78c8b8"), H("88e0d8"), H("508890")
IV_MANCHA = H("185850")
IF, IF_C, IF_E = H("70b828"), H("98d048"), H("608830")         # as folhas
BOT, BOT_C, BOT_E = H("d05888"), H("f87878"), H("b82840")      # o botão rosa
IV_OLHO = H("b82840")


def ivysaur(t, lado):
    if lado == "frente":
        t.poli([(0, 10), (5, 6), (12, 8), (19, 6), (23, 10), (18, 12), (12, 11), (6, 12)], IF)   # as folhonas abertas
        t.elipse(12, 5, 3, 4, BOT)                         # o botão em cima
        t.elipse(12, 15, 8, 5, IV)                         # cabeça larga
        t.elipse(12, 19, 6, 3, IV)
        t.poli([(5, 12), (4, 8), (8, 11)], IV); t.poli([(19, 12), (20, 8), (16, 11)], IV)   # orelhinhas
        sombrear(t, {IV: (IV_C, IV_E), IF: (IF_C, IF_E), BOT: (BOT_C, BOT_E)})
        t.linha([(12, 2), (12, 7)], BOT_E, 1)              # a dobra do botão
        t.linha([(4, 8), (8, 9)], IF_E, 1); t.linha([(20, 8), (16, 9)], IF_E, 1)
        for x in (8, 15):                                  # olho vermelho bravinho
            t.pxs([(x, 14), (x + 1, 14), (x, 15), (x + 1, 15)], IV_OLHO); t.px(x, 14, BR)
        t.pxs([(7, 13), (17, 13)], IV_MANCHA)              # a sobrancelha
        t.linha([(10, 18), (14, 18)], IV_MANCHA, 1)
        t.pxs([(6, 16), (18, 16), (12, 12)], IV_MANCHA)
        pes(t, [(6, 21), (7, 21), (10, 21), (14, 21), (17, 21), (18, 21)], IV_E)
    elif lado == "costas":
        t.elipse(12, 16, 9, 5, IV)
        t.poli([(1, 14), (6, 9), (12, 13), (18, 9), (23, 14), (12, 17)], IF)   # folhas
        t.elipse(12, 9, 4, 5, BOT)                         # o botão grande
        sombrear(t, {IV: (IV_C, IV_E), IF: (IF_C, IF_E), BOT: (BOT_C, BOT_E)})
        t.linha([(12, 5), (12, 12)], BOT_E, 1); t.linha([(10, 7), (10, 11)], BOT_C, 1)
        t.elipse(12, 14, 3, 1, IF_E)                       # o cálice verde
        t.pxs([(5, 17), (19, 18), (8, 19), (16, 19)], IV_MANCHA)
        pes(t, [(6, 21), (7, 21), (17, 21), (18, 21)], IV_E)
    else:
        t.poli([(9, 12), (13, 7), (20, 7), (23, 13), (16, 14)], IF)   # as folhas pra trás
        t.elipse(15, 8, 3, 4, BOT)
        t.elipse(14, 17, 8, 4, IV)                         # corpo
        t.elipse(7, 15, 6, 4, IV)                          # cabeça pra frente
        t.poli([(9, 11), (10, 7), (12, 12)], IV)
        sombrear(t, {IV: (IV_C, IV_E), IF: (IF_C, IF_E), BOT: (BOT_C, BOT_E)})
        t.linha([(16, 5), (16, 10)], BOT_E, 1)
        t.pxs([(4, 14), (5, 14), (4, 15), (5, 15)], IV_OLHO); t.px(4, 14, BR); t.px(3, 13, IV_MANCHA)
        t.linha([(1, 17), (5, 17)], IV_MANCHA, 1)
        t.pxs([(10, 16), (14, 18), (18, 17)], IV_MANCHA)
        pes(t, [(7, 21), (8, 21), (11, 21), (16, 21), (17, 21), (20, 21)], IV_E)
    contorno_gba(t)


# ----------------------------------------------------------------- VENUSAUR
VE, VE_C, VE_E = H("58c890"), H("88e8b8"), H("609870")
VE_MANCHA = H("206030")
FL, FL_C, FL_E = H("e04840"), H("f88070"), H("883800")         # a flor
FL_PINTA = H("f8e850")
VF, VF_C, VF_E = H("68c840"), H("98f088"), H("40a018")         # as folhas
TRONCO = H("883800")
VE_OLHO = H("b82840")


def flor(t, cx, cy, rx, ry):
    """a flor grande vista de cima: pétalas em volta do miolo"""
    t.elipse(cx, cy, rx, ry, FL)
    t.pxs([(cx - rx // 2, cy - 1), (cx + rx // 2, cy - 1), (cx - rx + 1, cy + 1), (cx + rx - 1, cy + 1)], FL_PINTA)


def venusaur(t, lado):
    if lado == "frente":
        t.poli([(0, 12), (3, 8), (12, 10), (21, 8), (23, 12), (18, 14), (6, 14)], VF)   # folhagem
        t.elipse(12, 6, 10, 4, FL)                         # a flor aberta por cima
        t.elipse(12, 16, 8, 5, VE)                         # cabeça
        t.elipse(12, 19, 8, 3, VE)
        sombrear(t, {VE: (VE_C, VE_E), FL: (FL_C, FL_E), VF: (VF_C, VF_E)})
        t.elipse(12, 6, 2, 1, TRONCO)                      # o miolo
        t.pxs([(6, 5), (18, 5), (9, 8), (15, 8), (4, 7), (20, 7)], FL_PINTA)   # as pintas da pétala
        t.linha([(8, 4), (9, 6)], FL_E, 1); t.linha([(16, 4), (15, 6)], FL_E, 1)
        for x in (8, 15):
            t.pxs([(x, 15), (x + 1, 15), (x, 16)], VE_OLHO); t.px(x, 15, BR)
        t.linha([(7, 14), (9, 14)], VE_MANCHA, 1); t.linha([(15, 14), (17, 14)], VE_MANCHA, 1)
        t.linha([(9, 19), (15, 19)], VE_MANCHA, 1)         # bocão
        t.pxs([(5, 17), (19, 17)], VE_MANCHA)
        pes(t, [(5, 21), (6, 21), (7, 21), (17, 21), (18, 21), (19, 21)], VE_E)
    elif lado == "costas":
        t.elipse(12, 17, 10, 5, VE)
        t.poli([(1, 15), (4, 10), (12, 12), (20, 10), (23, 15), (12, 18)], VF)
        t.elipse(12, 10, 10, 6, FL)
        sombrear(t, {VE: (VE_C, VE_E), FL: (FL_C, FL_E), VF: (VF_C, VF_E)})
        t.elipse(12, 10, 2, 2, TRONCO)
        t.linha([(12, 4), (12, 7)], FL_E, 1); t.linha([(4, 10), (9, 10)], FL_E, 1); t.linha([(15, 10), (20, 10)], FL_E, 1)
        t.linha([(12, 13), (12, 15)], FL_E, 1)
        t.pxs([(7, 7), (17, 7), (6, 13), (18, 13), (9, 15), (15, 15)], FL_PINTA)
        t.pxs([(4, 18), (20, 18), (8, 20), (16, 20)], VE_MANCHA)
        pes(t, [(5, 21), (6, 21), (7, 21), (17, 21), (18, 21), (19, 21)], VE_E)
    else:
        t.poli([(8, 12), (13, 9), (21, 10), (23, 15), (15, 15)], VF)
        t.elipse(15, 8, 8, 4, FL)                          # a flor
        t.elipse(14, 17, 9, 4, VE)
        t.elipse(7, 15, 6, 5, VE)
        t.poli([(9, 11), (10, 8), (12, 12)], VE)
        sombrear(t, {VE: (VE_C, VE_E), FL: (FL_C, FL_E), VF: (VF_C, VF_E)})
        t.elipse(15, 8, 2, 1, TRONCO)
        t.pxs([(10, 7), (20, 7), (13, 10), (18, 10)], FL_PINTA)
        t.pxs([(3, 14), (4, 14), (3, 15)], VE_OLHO); t.px(3, 14, BR); t.linha([(2, 13), (5, 13)], VE_MANCHA, 1)
        t.linha([(1, 18), (6, 18)], VE_MANCHA, 1)
        t.pxs([(11, 16), (15, 18), (19, 17)], VE_MANCHA)
        pes(t, [(5, 21), (6, 21), (9, 21), (16, 21), (17, 21), (20, 21)], VE_E)
    contorno_gba(t)


# ------------------------------------------------------- a chama do rabo
FG, FG_C, FG_E = H("f8a018"), H("f8e098"), H("f07000")


def chama(t, x, y, g=1):
    """a chama da ponta do rabo (g=2, a do CHARIZARD, maior)"""
    t.elipse(x, y, 1 + g, 2 + g, FG_E); t.elipse(x, y + 1, g, 1 + g, FG); t.px(x, y + 1, FG_C)
    t.px(x, y - 2 - g, FG_E)


# --------------------------------------------------------------- CHARMELEON
CM, CM_C, CM_E = H("d04848"), H("f86848"), H("903010")
CM_BARRIGA = H("f8d068")


def charmeleon(t, lado):
    if lado == "frente":
        t.poli([(13, 3), (17, 0), (17, 4)], CM)            # o chifre pra trás
        t.elipse(12, 7, 6, 5, CM)                          # cabeça
        t.elipse(12, 17, 5, 4, CM)
        t.poli([(16, 18), (21, 15), (21, 19)], CM)         # rabo
        t.pxs([(6, 14), (5, 15), (5, 16), (18, 14), (19, 15), (19, 16)], CM)   # bracinhos com garra
        sombrear(t, {CM: (CM_C, CM_E)})
        t.elipse(12, 18, 3, 3, CM_BARRIGA)
        chama(t, 21, 11)
        for x, d in ((9, 1), (15, -1)):                    # o olhar bravo
            t.pxs([(x, 6), (x, 7), (x, 8)], P_); t.px(x, 7, BR); t.px(x - d, 5, CM_E)
        t.linha([(10, 10), (14, 10)], CM_E, 1)
        t.pxs([(5, 17), (19, 17)], BR)
        pes(t, [(9, 21), (10, 21), (14, 21), (15, 21)], CM_E)
    elif lado == "costas":
        t.poli([(12, 3), (16, 0), (16, 4)], CM)
        t.elipse(12, 7, 6, 5, CM)
        t.elipse(12, 17, 5, 4, CM)
        t.linha([(14, 19), (19, 19), (21, 15)], CM, 2)
        sombrear(t, {CM: (CM_C, CM_E)})
        chama(t, 21, 10)
        pes(t, [(9, 21), (10, 21), (14, 21), (15, 21)], CM_E)
    else:
        t.poli([(10, 4), (16, 2), (12, 7)], CM)            # o chifre
        t.elipse(8, 8, 6, 5, CM)
        t.poli([(2, 9), (1, 11), (6, 12)], CM)             # o focinho comprido
        t.elipse(11, 17, 5, 4, CM)
        t.linha([(15, 19), (19, 18), (21, 13)], CM, 2)
        t.pxs([(7, 15), (6, 16), (6, 17)], CM)
        sombrear(t, {CM: (CM_C, CM_E)})
        t.elipse(9, 18, 2, 3, CM_BARRIGA)
        chama(t, 21, 8)
        t.pxs([(5, 6), (5, 7), (5, 8)], P_); t.px(5, 7, BR); t.px(4, 5, CM_E)
        t.linha([(1, 11), (5, 11)], CM_E, 1)
        t.px(6, 18, BR)
        pes(t, [(9, 21), (10, 21), (13, 21), (14, 21)], CM_E)
    contorno_gba(t)


# ---------------------------------------------------------------- CHARIZARD
CZ, CZ_C, CZ_E = H("f89040"), H("f8c060"), H("a84000")
CZ_BARRIGA, CZ_BARRIGA_E = H("f0d088"), H("d8c080")
AS, AS_C, AS_E = H("207890"), H("28a8b8"), H("185070")       # a membrana das asas


def asa(t, pontos):
    """uma asa: a armação laranja e a membrana azul por dentro"""
    t.poli(pontos, CZ)
    cx = sum(x for x, _ in pontos) / len(pontos); cy = sum(y for _, y in pontos) / len(pontos)
    t.poli([(round(x + (cx - x) * 0.35), round(y + (cy - y) * 0.35)) for x, y in pontos], AS)


def charizard(t, lado):
    if lado == "frente":
        asa(t, [(7, 12), (0, 2), (2, 9), (1, 14), (6, 16)])
        asa(t, [(17, 12), (23, 2), (22, 9), (23, 14), (18, 16)])
        t.poli([(8, 4), (7, 0), (10, 3)], CZ); t.poli([(16, 4), (17, 0), (14, 3)], CZ)   # os chifres
        t.elipse(12, 6, 5, 4, CZ)                          # cabeça
        t.elipse(12, 16, 6, 5, CZ)                         # corpo grande
        t.pxs([(5, 14), (5, 15), (19, 14), (19, 15)], CZ)
        sombrear(t, {CZ: (CZ_C, CZ_E), AS: (AS_C, AS_E)})
        t.elipse(12, 17, 4, 4, CZ_BARRIGA)
        t.linha([(10, 15), (14, 15)], CZ_BARRIGA_E, 1); t.linha([(10, 18), (14, 18)], CZ_BARRIGA_E, 1)
        chama(t, 20, 18, 1)
        for x in (9, 15):
            t.pxs([(x, 5), (x, 6)], P_); t.px(x, 5, BR)
        t.linha([(10, 8), (14, 8)], CZ_E, 1)
        pes(t, [(8, 21), (9, 21), (15, 21), (16, 21)], CZ_E)
    elif lado == "costas":
        t.poli([(8, 4), (7, 0), (10, 3)], CZ); t.poli([(16, 4), (17, 0), (14, 3)], CZ)
        t.elipse(12, 6, 5, 4, CZ)
        t.elipse(12, 16, 6, 5, CZ)
        t.poli([(13, 19), (19, 21), (21, 18), (17, 18)], CZ)   # rabo
        asa(t, [(10, 11), (1, 1), (2, 9), (1, 15), (9, 16)])     # de costas as asas tampam o corpo
        asa(t, [(14, 11), (23, 1), (22, 9), (23, 15), (15, 16)])
        sombrear(t, {CZ: (CZ_C, CZ_E), AS: (AS_C, AS_E)})
        chama(t, 21, 14, 1)
        pes(t, [(8, 21), (9, 21), (15, 21), (16, 21)], CZ_E)
    else:
        asa(t, [(13, 11), (20, 0), (19, 7), (21, 11), (16, 14)])  # a asa de longe, aberta pra trás
        t.poli([(9, 3), (13, 0), (11, 4)], CZ)             # chifre
        t.elipse(7, 6, 5, 4, CZ)
        t.poli([(3, 6), (0, 8), (5, 9)], CZ)               # focinho
        t.linha([(9, 9), (11, 12)], CZ, 3)                 # pescoço
        t.elipse(12, 16, 5, 5, CZ)
        t.linha([(15, 19), (19, 19), (22, 17)], CZ, 2)
        asa(t, [(12, 12), (17, 3), (17, 9), (19, 13), (15, 16)])   # a de perto
        sombrear(t, {CZ: (CZ_C, CZ_E), AS: (AS_C, AS_E)})
        t.elipse(10, 17, 2, 3, CZ_BARRIGA)
        chama(t, 22, 13, 1)
        t.pxs([(5, 5), (5, 6)], P_); t.px(5, 5, BR)
        t.linha([(1, 8), (4, 8)], CZ_E, 1)
        pes(t, [(10, 21), (11, 21), (14, 21), (15, 21)], CZ_E)
    contorno_gba(t)


# ---------------------------------------------------------------- WARTORTLE
WT, WT_C, WT_E = H("7868c0"), H("a888e8"), H("504078")
WC, WC_C, WC_E = H("d8c088"), H("f0e888"), H("906060")       # o casco
WB, WB_C, WB_E = H("e0e8e0"), H("f8f8f8"), H("c0d0d8")       # o pelo branco (orelhas e rabo)
WT_BARRIGA = H("f0e888")
WT_ORELHA = H("d0b8f8")


def wartortle(t, lado):
    if lado == "frente":
        t.poli([(7, 5), (2, 1), (3, 4), (1, 7), (6, 8)], WB)   # as orelhas felpudas
        t.poli([(17, 5), (22, 1), (21, 4), (23, 7), (18, 8)], WB)
        t.elipse(18, 17, 4, 4, WB)                         # o rabo aparece do lado
        t.elipse(12, 8, 6, 5, WT)
        t.elipse(12, 17, 6, 4, WC)
        t.pxs([(5, 15), (4, 16), (19, 15), (20, 16)], WT)
        sombrear(t, {WT: (WT_C, WT_E), WC: (WC_C, WC_E), WB: (WB_C, WB_E)})
        t.linha([(3, 2), (5, 5)], WT_ORELHA, 1); t.linha([(21, 2), (19, 5)], WT_ORELHA, 1)   # a dobra da orelha
        t.elipse(12, 17, 4, 4, WT_BARRIGA)
        t.linha([(9, 16), (15, 16)], WC, 1); t.linha([(9, 18), (15, 18)], WC, 1); t.linha([(12, 14), (12, 20)], WC, 1)
        for x in (9, 15):
            t.pxs([(x, 7), (x, 8), (x, 9)], P_); t.px(x, 7, BR)
        t.linha([(10, 11), (14, 11)], WT_E, 1)
        pes(t, [(9, 21), (10, 21), (14, 21), (15, 21)], WT_E)
    elif lado == "costas":
        t.poli([(7, 5), (2, 1), (3, 4), (1, 7), (6, 8)], WB)
        t.poli([(17, 5), (22, 1), (21, 4), (23, 7), (18, 8)], WB)
        t.elipse(12, 8, 6, 5, WT)
        t.elipse(12, 16, 7, 5, WC)
        t.elipse(15, 19, 5, 3, WB)                         # o rabão enrolado
        t.elipse(18, 16, 3, 3, WB)
        sombrear(t, {WT: (WT_C, WT_E), WC: (WC_C, WC_E), WB: (WB_C, WB_E)})
        t.anel(12, 16, 7, 5, WB_E, 1)                      # a borda clara do casco
        t.anel(11, 15, 3, 2, WC_E, 1)
        t.linha([(14, 19), (17, 17)], WB_E, 1); t.px(18, 16, WT_C)
        pes(t, [(8, 21), (9, 21), (15, 21), (16, 21)], WT_E)
    else:
        t.poli([(11, 5), (16, 1), (16, 4), (18, 6), (13, 9)], WB)   # a orelha pra trás
        t.elipse(8, 8, 6, 5, WT)
        t.elipse(13, 17, 6, 4, WC)
        t.elipse(20, 15, 3, 5, WB)                         # o rabão
        sombrear(t, {WT: (WT_C, WT_E), WC: (WC_C, WC_E), WB: (WB_C, WB_E)})
        t.elipse(10, 17, 3, 4, WT_BARRIGA)
        t.linha([(13, 13), (17, 20)], WB_E, 1)
        t.linha([(19, 12), (21, 16)], WB_E, 1)
        t.pxs([(5, 7), (5, 8), (5, 9)], P_); t.px(5, 7, BR)
        t.linha([(2, 10), (5, 10)], WT_E, 1)
        pes(t, [(9, 21), (10, 21), (14, 21), (15, 21)], WT_E)
    contorno_gba(t)


# ---------------------------------------------------------------- BLASTOISE
BL, BL_C, BL_E = H("7090e0"), H("a0c0f8"), H("484870")
BC, BC_C, BC_E = H("b88838"), H("d8a070"), H("684830")       # o casco
CN, CN_C, CN_E = H("d8d0d0"), H("f8f8f8"), H("90a0a0")       # os canhões
BL_BARRIGA = H("f8d068")


def blastoise(t, lado):
    if lado == "frente":
        t.elipse(12, 15, 10, 6, BC)                        # o cascão por trás
        t.elipse(12, 7, 6, 5, BL)
        t.elipse(12, 16, 6, 5, BL)
        t.pxs([(5, 13), (4, 14), (4, 15), (19, 13), (20, 14), (20, 15)], BL)   # bração
        for x in (4, 20):                                  # os canhões apontando pra cá
            t.elipse(x, 9, 3, 3, CN)
        sombrear(t, {BL: (BL_C, BL_E), BC: (BC_C, BC_E), CN: (CN_C, CN_E)})
        for x in (4, 20):
            t.elipse(x, 9, 1, 1, P_)
        t.elipse(12, 17, 4, 4, BL_BARRIGA)
        t.linha([(9, 16), (15, 16)], BC, 1); t.linha([(9, 18), (15, 18)], BC, 1)
        for x in (9, 15):
            t.pxs([(x, 6), (x, 7)], P_); t.px(x, 6, BR)
        t.pxs([(8, 5), (16, 5)], BL_E)                     # cara séria
        t.linha([(10, 10), (14, 10)], BL_E, 1)
        t.pxs([(6, 3), (18, 3)], BL)                       # as orelhinhas
        pes(t, [(7, 21), (8, 21), (9, 21), (15, 21), (16, 21), (17, 21)], BL_E)
    elif lado == "costas":
        t.elipse(12, 7, 6, 5, BL)
        t.elipse(12, 15, 10, 7, BC)
        t.ret(7, 6, 10, 13, CN); t.ret(14, 6, 17, 13, CN)  # os canhões saindo do casco
        sombrear(t, {BL: (BL_C, BL_E), BC: (BC_C, BC_E), CN: (CN_C, CN_E)})
        t.ret(8, 6, 9, 7, P_); t.ret(15, 6, 16, 7, P_)
        t.anel(12, 15, 10, 7, CN_C, 1)                     # a borda branca do casco
        t.anel(12, 16, 4, 3, BC_E, 1)
        pes(t, [(6, 21), (7, 21), (8, 21), (16, 21), (17, 21), (18, 21)], BL_E)
    else:
        t.elipse(16, 14, 7, 7, WB)                         # a borda branca do casco
        t.elipse(16, 14, 6, 6, BC)
        t.elipse(6, 10, 5, 4, BL)
        t.elipse(11, 16, 5, 5, BL)
        t.ret(4, 3, 15, 6, CN)                             # o canhão em cima do ombro, pra frente
        sombrear(t, {BL: (BL_C, BL_E), BC: (BC_C, BC_E), CN: (CN_C, CN_E), WB: (WB_C, WB_E)})
        t.ret(4, 4, 4, 5, P_)
        t.elipse(9, 17, 2, 3, BL_BARRIGA)
        t.pxs([(3, 9), (3, 10)], P_); t.px(3, 9, BR)
        t.linha([(1, 12), (4, 12)], BL_E, 1)
        pes(t, [(7, 21), (8, 21), (9, 21), (13, 21), (14, 21), (15, 21)], BL_E)
    contorno_gba(t)


# ------------------------------------------------------------------- RAICHU
RA, RA_C, RA_E = H("d8a058"), H("f8d878"), H("b88040")
RA_MARROM, RA_MARROM_E = H("906030"), H("604018")
RA_AMARELO = H("f8c020")
RA_BOCHECHA = H("f8d828")


def raio(t, x, y):
    """a ponta de raio do rabo"""
    t.poli([(x, y), (x + 4, y - 4), (x + 3, y - 1), (x + 5, y - 1), (x + 1, y + 4), (x + 2, y + 1), (x, y + 1)], RA_AMARELO)


def raichu(t, lado):
    if lado == "frente":
        t.poli([(5, 9), (2, 1), (8, 5)], RA_MARROM); t.poli([(19, 9), (22, 1), (16, 5)], RA_MARROM)   # orelhas largas
        t.elipse(12, 10, 7, 5, RA)
        t.elipse(12, 18, 6, 4, RA)
        t.pxs([(5, 16), (4, 17), (19, 16), (20, 17)], RA)
        sombrear(t, {RA: (RA_C, RA_E)})
        t.poli([(4, 5), (3, 2), (6, 5)], RA_AMARELO); t.poli([(20, 5), (21, 2), (18, 5)], RA_AMARELO)   # dentro da orelha
        t.elipse(12, 18, 3, 3, BR)                         # a barriga branca
        for x in (9, 15):
            olhinho(t, x, 9)
        t.pxs([(5, 12), (6, 12), (5, 13), (18, 12), (19, 12), (19, 13)], RA_BOCHECHA)   # bochechas amarelas
        t.pxs([(11, 12), (13, 12)], P_); t.px(12, 13, H("b00000"))
        pes(t, [(8, 21), (9, 21), (15, 21), (16, 21)], RA_E)
    elif lado == "costas":
        t.poli([(5, 9), (2, 1), (8, 5)], RA_MARROM); t.poli([(19, 9), (22, 1), (16, 5)], RA_MARROM)
        t.elipse(12, 10, 7, 5, RA)
        t.elipse(12, 18, 6, 4, RA)
        t.linha([(13, 19), (19, 18), (20, 12)], RA_MARROM_E, 1)   # o rabo fininho subindo
        raio(t, 18, 8)
        sombrear(t, {RA: (RA_C, RA_E)})
        t.linha([(9, 16), (15, 16)], RA_E, 1)
        pes(t, [(8, 21), (9, 21), (15, 21), (16, 21)], RA_E)
    else:
        t.poli([(9, 8), (13, 0), (13, 7)], RA_MARROM)      # a orelha
        t.elipse(8, 10, 6, 5, RA)
        t.elipse(12, 18, 5, 4, RA)
        t.linha([(16, 19), (20, 17), (21, 12)], RA_MARROM_E, 1)
        raio(t, 18, 8)
        sombrear(t, {RA: (RA_C, RA_E)})
        t.poli([(12, 2), (12, 5), (11, 5)], RA_AMARELO)
        t.elipse(10, 18, 2, 3, BR)
        olhinho(t, 5, 9)
        t.pxs([(3, 12), (4, 12), (4, 13)], RA_BOCHECHA)
        t.px(2, 11, P_)
        pes(t, [(10, 21), (11, 21), (14, 21), (15, 21)], RA_E)
    contorno_gba(t)


# ------------------------------------------------------------------- PIDGEY
PG, PG_C, PG_E = H("c88860"), H("d8a878"), H("a86038")
PG_CREME, PG_CREME_E = H("f8e088"), H("d8c060")
PG_LISTRA = H("583828")
PG_BICO = H("e07870")


def pidgey(t, lado):
    if lado == "frente":
        t.poli([(10, 5), (11, 1), (13, 4)], PG)            # o topetinho
        t.elipse(12, 9, 6, 5, PG)
        t.elipse(12, 17, 6, 4, PG)
        t.poli([(6, 14), (3, 19), (7, 19)], PG); t.poli([(18, 14), (21, 19), (17, 19)], PG)   # as asas fechadas
        sombrear(t, {PG: (PG_C, PG_E)})
        t.elipse(12, 18, 3, 3, PG_CREME)                   # o peito creme
        t.elipse(12, 11, 3, 2, PG_CREME)
        for x, d in ((8, -1), (16, 1)):                    # a listra preta do olho
            t.pxs([(x, 9), (x + d, 9), (x + 2 * d, 10)], PG_LISTRA)
            t.pxs([(x, 8), (x, 9)], P_); t.px(x, 8, BR)
        t.pxs([(11, 10), (12, 10), (12, 11)], PG_LISTRA)   # o biquinho
        pes(t, [(10, 21), (14, 21)], PG_BICO)
    elif lado == "costas":
        t.poli([(10, 5), (11, 1), (13, 4)], PG)
        t.elipse(12, 9, 6, 5, PG)
        t.elipse(12, 17, 6, 4, PG)
        t.poli([(9, 19), (12, 23), (15, 19)], PG_E)        # o rabo
        sombrear(t, {PG: (PG_C, PG_E)})
        t.linha([(8, 15), (11, 19)], PG_E, 1); t.linha([(16, 15), (13, 19)], PG_E, 1)   # as asas dobradas
        t.pxs([(11, 2), (11, 3)], PG_CREME)
        pes(t, [(10, 21), (14, 21)], PG_BICO)
    else:
        t.poli([(10, 5), (13, 1), (13, 5)], PG)
        t.elipse(9, 9, 5, 5, PG)
        t.elipse(13, 16, 6, 4, PG)
        t.poli([(17, 15), (22, 18), (18, 19)], PG_E)       # o rabo
        sombrear(t, {PG: (PG_C, PG_E)})
        t.elipse(10, 17, 3, 3, PG_CREME)
        t.poli([(13, 14), (19, 15), (15, 18)], PG_E)       # a asa
        t.pxs([(3, 10), (2, 11), (3, 11)], PG_LISTRA)      # o bico
        t.pxs([(6, 9), (7, 9), (8, 10)], PG_LISTRA)
        t.pxs([(6, 8), (6, 9)], P_); t.px(6, 8, BR)
        pes(t, [(11, 21), (14, 21)], PG_BICO)
    contorno_gba(t)


# ---------------------------------------------------------------- PIDGEOTTO
PO, PO_C, PO_E = H("a87858"), H("c89878"), H("785848")
PO_CREME, PO_CREME_E = H("f0e068"), H("e0c068")
PO_CRISTA, PO_CRISTA_C = H("c04040"), H("e86040")
PO_PE = H("f8a870")


def crista(t, pontos):
    t.poli(pontos, PO_CRISTA)


def pidgeotto(t, lado):
    if lado == "frente":
        crista(t, [(9, 5), (8, 0), (12, 3), (16, 0), (15, 5)])   # a crista vermelha
        t.elipse(12, 8, 5, 4, PO)
        t.elipse(12, 16, 7, 5, PO)
        t.poli([(5, 12), (1, 19), (6, 20)], PO); t.poli([(19, 12), (23, 19), (18, 20)], PO)   # asas
        sombrear(t, {PO: (PO_C, PO_E)})
        t.pxs([(12, 2), (11, 3), (13, 3)], PO_CREME)       # o amarelo no meio da crista
        t.elipse(12, 17, 4, 4, PO_CREME)
        t.linha([(10, 15), (14, 15)], PO_CREME_E, 1); t.linha([(10, 18), (14, 18)], PO_CREME_E, 1)
        for x, d in ((9, -1), (15, 1)):
            t.pxs([(x, 7), (x, 8)], P_); t.px(x, 7, BR); t.px(x + d, 8, P_)
        t.pxs([(11, 9), (12, 9), (13, 9), (12, 10)], H("583828"))
        pes(t, [(9, 21), (10, 21), (14, 21), (15, 21)], PO_PE)
    elif lado == "costas":
        crista(t, [(8, 5), (7, 0), (12, 3), (17, 0), (16, 5)])
        t.elipse(12, 8, 5, 4, PO)
        t.elipse(12, 16, 7, 5, PO)
        t.poli([(9, 19), (6, 23), (12, 21), (18, 23), (15, 19)], PO_CRISTA)   # o rabo vermelho e amarelo
        sombrear(t, {PO: (PO_C, PO_E)})
        t.pxs([(9, 21), (15, 21)], PO_CREME)
        t.linha([(7, 13), (11, 19)], PO_E, 1); t.linha([(17, 13), (13, 19)], PO_E, 1)
        pes(t, [(9, 21), (10, 21), (14, 21), (15, 21)], PO_PE)
    else:
        crista(t, [(9, 4), (16, 0), (14, 3), (19, 3), (13, 7)])  # a crista pra trás
        t.elipse(8, 8, 5, 4, PO)
        t.elipse(13, 15, 6, 5, PO)
        t.poli([(17, 16), (23, 20), (18, 20)], PO_CRISTA)
        sombrear(t, {PO: (PO_C, PO_E)})
        t.pxs([(15, 2), (16, 2)], PO_CREME)
        t.elipse(10, 16, 3, 3, PO_CREME)
        t.poli([(12, 12), (20, 14), (15, 18)], PO_E)       # a asa
        t.pxs([(3, 8), (2, 9), (3, 9)], H("583828"))
        t.pxs([(5, 7), (5, 8)], P_); t.px(5, 7, BR)
        pes(t, [(11, 21), (12, 21), (14, 21), (15, 21)], PO_PE)
    contorno_gba(t)


# ------------------------------------------------------------------ RATTATA
RT, RT_C, RT_E = H("806088"), H("b070b0"), H("603050")
RT_CREME = H("d8d8c0")
RT_OLHO = H("a01838")


def rattata(t, lado):
    if lado == "frente":
        t.elipse(5, 6, 3, 3, RT); t.elipse(19, 6, 3, 3, RT)   # orelhonas redondas
        t.elipse(12, 11, 7, 5, RT)
        t.elipse(12, 18, 5, 3, RT)
        sombrear(t, {RT: (RT_C, RT_E)})
        t.pxs([(5, 6), (6, 6), (5, 7), (18, 6), (19, 6), (19, 7)], RT_C)   # dentro da orelha
        t.elipse(12, 18, 3, 2, RT_CREME)
        for x in (9, 15):
            t.pxs([(x, 9), (x, 10)], RT_OLHO); t.px(x, 9, BR)
        t.elipse(12, 13, 2, 1, RT_CREME)                   # o focinho
        t.px(12, 12, P_)
        t.pxs([(11, 15), (13, 15)], BR)                    # os dentões
        t.linha([(4, 12), (8, 13)], RT_E, 1); t.linha([(20, 12), (16, 13)], RT_E, 1)   # bigode
        pes(t, [(9, 21), (10, 21), (14, 21), (15, 21)], RT_CREME)
    elif lado == "costas":
        t.elipse(5, 6, 3, 3, RT); t.elipse(19, 6, 3, 3, RT)
        t.elipse(12, 11, 7, 5, RT)
        t.elipse(12, 18, 5, 3, RT)
        t.linha([(14, 19), (19, 19), (21, 15), (20, 11), (18, 12)], RT, 1)   # o rabo enrolado
        sombrear(t, {RT: (RT_C, RT_E)})
        t.pxs([(10, 9), (12, 8), (14, 9)], RT_E)
        pes(t, [(9, 21), (10, 21), (14, 21), (15, 21)], RT_CREME)
    else:
        t.elipse(11, 6, 3, 3, RT)
        t.elipse(8, 11, 6, 5, RT)
        t.poli([(3, 10), (0, 13), (4, 15)], RT)            # o focinho comprido
        t.elipse(14, 17, 6, 4, RT)
        t.linha([(19, 19), (22, 17), (22, 12), (20, 11)], RT, 1)
        sombrear(t, {RT: (RT_C, RT_E)})
        t.pxs([(11, 6), (12, 6), (11, 7)], RT_C)
        t.elipse(11, 18, 3, 2, RT_CREME)
        t.pxs([(5, 9), (5, 10)], RT_OLHO); t.px(5, 9, BR)
        t.px(0, 13, P_)
        t.pxs([(2, 15), (2, 16)], BR)
        t.linha([(1, 12), (4, 13)], RT_E, 1)
        pes(t, [(9, 21), (10, 21), (16, 21), (17, 21)], RT_CREME)
    contorno_gba(t)


# ------------------------------------------------------------------ SPEAROW
SP, SP_C, SP_E = H("a87010"), H("d09838"), H("784000")
SP_ASA, SP_ASA_C, SP_ASA_E = H("c04050"), H("f05058"), H("781800")
SP_CREME = H("d0c098")
SP_BICO = H("f88070")


def spearow(t, lado):
    if lado == "frente":
        t.poli([(9, 5), (8, 1), (11, 3), (12, 0), (13, 3), (16, 1), (15, 5)], SP)   # o penacho arrepiado
        t.elipse(12, 9, 6, 5, SP)
        t.elipse(12, 17, 5, 4, SP_CREME)
        t.poli([(7, 13), (2, 15), (3, 20), (8, 18)], SP_ASA); t.poli([(17, 13), (22, 15), (21, 20), (16, 18)], SP_ASA)   # asas vermelhas
        sombrear(t, {SP: (SP_C, SP_E), SP_ASA: (SP_ASA_C, SP_ASA_E)})
        for x, d in ((9, 1), (15, -1)):                    # olhar bravo
            t.pxs([(x, 8), (x, 9)], P_); t.px(x, 9, BR); t.px(x - d, 7, P_)
        t.poli([(11, 10), (13, 10), (12, 13)], SP_BICO)    # o bico
        t.linha([(10, 16), (14, 16)], SP_E, 1)
        pes(t, [(10, 21), (14, 21)], SP_BICO)
    elif lado == "costas":
        t.poli([(9, 5), (8, 1), (11, 3), (12, 0), (13, 3), (16, 1), (15, 5)], SP)
        t.elipse(12, 9, 6, 5, SP)
        t.elipse(12, 17, 5, 4, SP)
        t.poli([(7, 13), (12, 15), (8, 20)], SP_ASA); t.poli([(17, 13), (12, 15), (16, 20)], SP_ASA)
        t.poli([(10, 20), (12, 23), (14, 20)], SP_ASA_E)
        sombrear(t, {SP: (SP_C, SP_E), SP_ASA: (SP_ASA_C, SP_ASA_E)})
        pes(t, [(10, 21), (14, 21)], SP_BICO)
    else:
        t.poli([(10, 5), (15, 1), (13, 4), (17, 4), (13, 7)], SP)
        t.elipse(8, 9, 5, 5, SP)
        t.elipse(13, 16, 5, 4, SP_CREME)
        t.poli([(11, 13), (20, 14), (21, 19), (14, 18)], SP_ASA)
        sombrear(t, {SP: (SP_C, SP_E), SP_ASA: (SP_ASA_C, SP_ASA_E)})
        t.poli([(4, 9), (0, 11), (4, 12)], SP_BICO)
        t.pxs([(6, 8), (6, 9)], P_); t.px(6, 9, BR); t.px(7, 7, P_)
        pes(t, [(11, 21), (14, 21)], SP_BICO)
    contorno_gba(t)


# ----------------------------------------------------------------- CATERPIE
CT, CT_C, CT_E = H("98d048"), H("b8f870"), H("789860")
CT_CREME, CT_CREME_E = H("e8e878"), H("d0c860")
CT_ANTENA = H("c04040")


def caterpie(t, lado):
    if lado in ("frente", "costas"):
        t.elipse(12, 18, 5, 4, CT)                         # o gomo de baixo
        t.elipse(12, 11, 7, 6, CT)                         # a cabeçona
        sombrear(t, {CT: (CT_C, CT_E)})
        t.poli([(11, 5), (8, 1), (12, 3), (16, 1), (13, 5)], CT_ANTENA)   # a antena em Y
        if lado == "frente":
            t.elipse(12, 13, 3, 2, CT_CREME)               # o queixo creme
            for x in (8, 16):                              # os olhões pretos com a bola branca
                t.elipse(x, 10, 1, 2, P_); t.px(x, 9, BR)
            t.elipse(12, 18, 2, 2, CT_CREME)
        else:
            t.pxs([(9, 9), (15, 9), (12, 15)], CT_CREME)   # as bolinhas de trás
            t.linha([(7, 16), (17, 16)], CT_E, 1)
        pes(t, [(9, 21), (10, 21), (14, 21), (15, 21)], CT_CREME_E)
    else:
        for x, y in ((18, 18), (14, 18)):                  # os gomos do corpo
            t.elipse(x, y, 3, 3, CT)
        t.elipse(20, 15, 2, 2, CT)                         # o rabinho
        t.elipse(8, 13, 6, 6, CT)                          # a cabeçona
        sombrear(t, {CT: (CT_C, CT_E)})
        t.poli([(9, 7), (12, 2), (11, 6), (15, 4), (11, 8)], CT_ANTENA)
        t.elipse(4, 15, 2, 2, CT_CREME)
        t.elipse(5, 12, 1, 2, P_); t.px(5, 11, BR)
        for x in (14, 18):
            t.elipse(x, 19, 2, 1, CT_CREME)                # a barriga dos gomos
        t.pxs([(13, 15), (17, 15)], CT_CREME_E)
        pes(t, [(7, 21), (8, 21), (13, 21), (14, 21), (18, 21)], CT_CREME_E)
    contorno_gba(t)


DESENHOS = {2: ivysaur, 3: venusaur, 5: charmeleon, 6: charizard,
            8: wartortle, 9: blastoise, 26: raichu,
            16: pidgey, 17: pidgeotto, 19: rattata, 21: spearow, 10: caterpie}
TAMANHO = {2: 0.9, 5: 0.9, 8: 0.88, 26: 0.9, 16: 0.75, 17: 0.9, 19: 0.75, 21: 0.75, 10: 0.72}
