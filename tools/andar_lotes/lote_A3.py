"""LOTE A3: os casulos (METAPOD, KAKUNA), POLIWHIRL, POLIWRATH, KADABRA,
ALAKAZAM, MACHOKE, MACHAMP, WEEPINBELL, VICTREEBEL e TENTACRUEL."""
from andar_base import *  # noqa: F401,F403


# ------------------------------------------------------------------ METAPOD
MT, MT_C, MT_E = H("70a830"), H("98d048"), H("506028")


def metapod(t, lado):
    if lado == "lado":
        t.poli([(4, 10), (8, 4), (16, 6), (21, 12), (19, 20), (8, 20)], MT)   # o casulo de lado, bico pra frente
        t.poli([(4, 10), (1, 12), (5, 14)], MT)
        sombrear(t, {MT: (MT_C, MT_E)})
        t.linha([(9, 9), (16, 13)], MT_E, 1); t.linha([(9, 15), (17, 17)], MT_E, 1)   # as placas
        t.linha([(4, 11), (7, 12)], P_, 1); t.px(6, 11, BR)   # o olho meio fechado
        pes(t, [(10, 21), (11, 21), (16, 21), (17, 21)], MT_E)
    else:
        t.poli([(5, 9), (8, 3), (12, 5), (16, 3), (19, 9), (18, 20), (6, 20)], MT)
        sombrear(t, {MT: (MT_C, MT_E)})
        t.linha([(7, 14), (17, 14)], MT_E, 1)
        t.linha([(12, 5), (12, 13)], MT_E, 1)
        if lado == "frente":
            for x, d in ((9, 1), (15, -1)):                # os olhinhos desconfiados
                t.linha([(x - d, 9), (x + d, 10)], P_, 1); t.pxs([(x, 11), (x + d, 11)], P_); t.px(x, 11, BR)
        pes(t, [(9, 21), (10, 21), (14, 21), (15, 21)], MT_E)
    contorno_gba(t)


# ------------------------------------------------------------------- KAKUNA
KK, KK_C, KK_E = H("c8b850"), H("f0d858"), H("887800")


def kakuna(t, lado):
    for y, r in ((7, 5), (12, 6), (16, 5), (19, 3)):        # os anéis do casulo, afinando embaixo
        t.elipse(12 if lado != "lado" else 13, y, r, 3, KK)
    sombrear(t, {KK: (KK_C, KK_E)})
    for y, r in ((10, 5), (14, 5), (18, 4)):
        t.linha([(12 - r + (1 if lado == "lado" else 0), y), (12 + r + (1 if lado == "lado" else 0), y)], KK_E, 1)
    if lado == "frente":
        for x in (9, 15):                                  # os olhos tristes
            t.linha([(x - 1, 6), (x + 1, 7)] if x < 12 else [(x + 1, 6), (x - 1, 7)], P_, 1)
            t.pxs([(x, 8), (x, 9), (x, 10), (x + (1 if x < 12 else -1), 9)], P_); t.px(x, 8, BR)
    elif lado == "lado":
        t.linha([(7, 6), (9, 7)], P_, 1); t.pxs([(8, 8), (8, 9), (8, 10)], P_); t.px(8, 8, BR)
        t.pxs([(9, 3), (10, 2)], KK_E)                     # o espinho do lado
    pes(t, [(11, 22), (13, 22)], KK_E)
    contorno_gba(t)


# ------------------------------------------------------- POLIWHIRL/POLIWRATH
PH, PH_C, PH_E = H("606890"), H("8090c0"), H("203860")
PR, PR_C, PR_E = H("506890"), H("98b8d0"), H("303068")
LUVA, LUVA_C, LUVA_E = H("d8d8d8"), H("f8f8f8"), H("b8b8b8")


def poli_(cor, claro, escuro, bravo):
    """POLIWHIRL e POLIWRATH: a bola com a espiral, as luvas brancas"""
    def desenho(t, lado):
        if lado == "lado":
            t.elipse(11, 13, 7, 7, cor)
            t.linha([(10, 14), (6, 16)], cor, 3)           # o braço pra frente
            sombrear(t, {cor: (claro, escuro)})
            t.elipse(5, 16, 2, 2, LUVA)
            t.elipse(7, 8, 2, 2, BR); t.pxs([(6, 8), (6, 9)], P_)
            if bravo:
                t.linha([(5, 6), (9, 7)], P_, 1)
            t.anel(9, 14, 3, 3, P_, 1)                     # a espiral de lado
            pes(t, [(8, 21), (9, 21), (14, 21), (15, 21)], escuro)
        else:
            t.elipse(12, 13, 8, 7, cor)
            t.elipse(7, 7, 3, 2, cor); t.elipse(17, 7, 3, 2, cor)   # os olhos no alto
            sombrear(t, {cor: (claro, escuro)})
            t.elipse(3, 15, 2, 2, LUVA); t.elipse(21, 15, 2, 2, LUVA)   # as luvas
            sombrear(t, {LUVA: (LUVA_C, LUVA_E)})
            if lado == "frente":
                t.elipse(12, 14, 5, 5, BR)                 # a barriga com a espiral
                t.anel(12, 14, 4, 4, P_, 1); t.anel(12, 14, 2, 2, P_, 1); t.px(12, 14, P_)
                t.pxs([(13, 10), (16, 14)], BR)
                for x in (7, 17):
                    t.elipse(x, 7, 1, 1, BR); t.pxs([(x, 7), (x, 8)], P_)
                if bravo:
                    t.linha([(5, 5), (9, 6)], P_, 1); t.linha([(19, 5), (15, 6)], P_, 1)
            pes(t, [(7, 21), (8, 21), (9, 21), (15, 21), (16, 21), (17, 21)], escuro)
        contorno_gba(t)
    return desenho


poliwhirl = poli_(PH, PH_C, PH_E, False)
poliwrath = poli_(PR, PR_C, PR_E, True)


# -------------------------------------------------------- KADABRA/ALAKAZAM
KD, KD_C, KD_E = H("d8b810"), H("f8e828"), H("806810")
KD_MARROM, KD_MARROM_E = H("885010"), H("684008")
COLHER, COLHER_E = H("d8d8d8"), H("585858")
BIGODE = H("503008")


def psiquico(cor, claro, escuro, bigode, colheres):
    """KADABRA e ALAKAZAM: orelhonas pontudas, bigode, a colher na mão"""
    def colher(t, x, y):
        t.linha([(x, y), (x, y - 3)], COLHER_E, 1); t.pxs([(x, y - 4), (x + 1, y - 4), (x, y - 5), (x + 1, y - 5)], COLHER)

    def desenho(t, lado):
        if lado == "lado":
            t.poli([(9, 4), (16, 0), (12, 6)], cor)
            t.elipse(8, 7, 4, 4, cor)
            t.poli([(4, 7), (1, 9), (5, 10)], cor)         # o focinho
            t.elipse(12, 15, 5, 5, cor)
            t.elipse(11, 13, 3, 2, KD_MARROM)              # a couraça marrom do peito
            t.linha([(14, 17), (20, 18), (22, 14)], cor, 2)   # o rabo
            t.linha([(9, 13), (5, 16)], cor, 2)
            sombrear(t, {cor: (claro, escuro), KD_MARROM: (KD_MARROM, KD_MARROM_E)})
            colher(t, 4, 15)
            t.linha([(4, 6), (6, 7)], P_, 1); t.px(5, 7, H("c03020"))
            t.linha([(2, 10), (3, 10 + bigode)], BIGODE, 2)
            pes(t, [(9, 21), (10, 21), (14, 21), (15, 21)], escuro)
        else:
            t.poli([(8, 6), (4, 0), (10, 4)], cor); t.poli([(16, 6), (20, 0), (14, 4)], cor)   # orelhonas
            t.elipse(12, 7, 5, 4, cor)
            t.elipse(12, 16, 6, 5, cor)
            t.linha([(7, 14), (4, 17)], cor, 2); t.linha([(17, 14), (20, 17)], cor, 2)
            t.ret(8, 12, 16, 15, KD_MARROM)                # a couraça marrom do peito
            sombrear(t, {cor: (claro, escuro), KD_MARROM: (KD_MARROM, KD_MARROM_E)})
            colher(t, 3, 17)
            if colheres:
                colher(t, 21, 17)
            if lado == "frente":
                t.px(12, 4, H("c03020"))                   # a estrela da testa
                for x, d in ((10, -1), (14, 1)):           # olhos puxados
                    t.pxs([(x + d, 6), (x, 7), (x + d, 7)], P_)
                t.pxs([(11, 9), (12, 9), (13, 9)], KD_MARROM)  # o focinho e o bigodão
                t.linha([(10, 9), (7, 10 + bigode)], BIGODE, 2); t.linha([(14, 9), (17, 10 + bigode)], BIGODE, 2)
            else:
                t.linha([(15, 19), (20, 20), (22, 16)], cor, 2)   # rabo
            pes(t, [(9, 21), (10, 21), (14, 21), (15, 21)], escuro)
        contorno_gba(t)
    return desenho


AZ, AZ_C, AZ_E = H("d8c018"), H("f8e828"), H("786810")
kadabra = psiquico(KD, KD_C, KD_E, 3, False)
alakazam = psiquico(AZ, AZ_C, AZ_E, 6, True)


# -------------------------------------------------------- MACHOKE/MACHAMP
MC, MC_C, MC_E = H("807898"), H("a8a0d0"), H("404068")
MA, MA_C, MA_E = H("80a880"), H("a8d0b0"), H("385840")
CINTO = H("604808")
CRISTA_M = H("c8b848")
MC_OLHO = H("c00000")


def musculo(cor, claro, escuro, quatro):
    """MACHOKE e (com quatro braços) MACHAMP: crista, ombro largo, cinto"""
    def desenho(t, lado):
        if lado == "lado":
            t.elipse(8, 7, 4, 4, cor)
            t.elipse(12, 14, 6, 6, cor)
            t.linha([(10, 11), (5, 15)], cor, 3)
            if quatro:
                t.linha([(13, 9), (9, 5)], cor, 3)
            sombrear(t, {cor: (claro, escuro)})
            t.poli([(7, 3), (12, 2), (10, 6)], CRISTA_M)   # a crista
            t.linha([(7, 18), (17, 18)], CINTO, 1)
            t.pxs([(5, 6), (5, 7)], MC_OLHO); t.px(5, 6, BR)
            t.linha([(4, 9), (6, 9)], escuro, 1)
            pes(t, [(9, 21), (10, 21), (14, 21), (15, 21)], escuro)
        else:
            t.elipse(12, 7, 4, 4, cor)
            t.elipse(12, 15, 7, 6, cor)                    # o peitoral largo
            t.elipse(4, 14, 3, 3, cor); t.elipse(20, 14, 3, 3, cor)   # os punhos
            if quatro:
                t.elipse(3, 7, 3, 3, cor); t.elipse(21, 7, 3, 3, cor)   # o par de braços de cima
                t.linha([(6, 10), (8, 12)], cor, 2); t.linha([(18, 10), (16, 12)], cor, 2)
            sombrear(t, {cor: (claro, escuro)})
            t.ret(6, 18, 18, 19, CINTO); t.ret(11, 18, 13, 19, CRISTA_M)   # o cinto e a fivela
            t.linha([(9, 13), (15, 13)], escuro, 1); t.linha([(12, 13), (12, 17)], escuro, 1)   # os músculos
            if lado == "frente":
                t.poli([(10, 4), (12, 1), (14, 4)], CRISTA_M)
                for x in (10, 14):
                    t.pxs([(x, 6), (x, 7)], MC_OLHO); t.px(x, 6, BR)
                t.linha([(11, 9), (13, 9)], escuro, 1)
            else:
                t.poli([(10, 4), (12, 1), (14, 4)], CRISTA_M)
            pes(t, [(8, 21), (9, 21), (15, 21), (16, 21)], escuro)
        contorno_gba(t)
    return desenho


machoke = musculo(MC, MC_C, MC_E, False)
machamp = musculo(MA, MA_C, MA_E, True)


# --------------------------------------------------------------- WEEPINBELL
WP, WP_C, WP_E = H("f8d068"), H("f8e098"), H("e8b000")
WF, WF_C, WF_E = H("70a830"), H("b8f870"), H("506028")       # folhas
WP_BOCA = H("f8a070")


def weepinbell(t, lado):
    if lado == "lado":
        t.poli([(13, 12), (22, 8), (20, 15)], WF)          # a folha
        t.elipse(12, 9, 6, 6, WP)                          # o sino
        t.poli([(7, 12), (2, 18), (8, 20), (12, 15)], WP)  # a boca pra frente/baixo
        sombrear(t, {WP: (WP_C, WP_E), WF: (WF_C, WF_E)})
        t.linha([(12, 3), (14, 0), (17, 1)], WF_E, 1)      # o cabinho
        t.linha([(3, 18), (8, 18)], WP_BOCA, 1)
        t.pxs([(8, 9), (8, 10)], P_); t.px(8, 9, BR)
        t.pxs([(14, 8), (16, 12)], WF)
        pes(t, [(10, 21), (11, 21)], WF_E)
    else:
        t.poli([(7, 12), (0, 8), (3, 15)], WF); t.poli([(17, 12), (24, 8), (21, 15)], WF)   # folhas
        t.elipse(12, 10, 6, 7, WP)
        sombrear(t, {WP: (WP_C, WP_E), WF: (WF_C, WF_E)})
        t.linha([(12, 3), (13, 0), (16, 1)], WF_E, 1)
        if lado == "frente":
            t.elipse(12, 16, 5, 3, WP_BOCA); t.linha([(8, 16), (16, 16)], H("e87040"), 1)   # o bocão
            for x in (9, 15):
                t.pxs([(x, 9), (x, 10)], P_); t.px(x, 9, BR)
        else:
            t.linha([(12, 16), (12, 20)], WF_E, 1)         # o caule
            t.pxs([(9, 8), (15, 12), (11, 14)], WF)        # as pintas verdes
        pes(t, [(11, 21), (13, 21)], WF_E)
    contorno_gba(t)


# --------------------------------------------------------------- VICTREEBEL
VB_, VB_C, VB_E = H("98d048"), H("b8f870"), H("506028")
VB_BOCA, VB_BOCA_E = H("f8e098"), H("e0a858")
VB_CIPO = H("684000")


def victreebel(t, lado):
    if lado == "lado":
        t.elipse(12, 12, 7, 9, VB_)
        t.poli([(6, 4), (11, 2), (13, 8)], VB_E)           # a tampa/folha de cima
        sombrear(t, {VB_: (VB_C, VB_E)})
        t.poli([(5, 8), (1, 13), (6, 16)], VB_BOCA_E)      # o bocão de lado
        t.linha([(2, 13), (6, 12)], P_, 1)
        t.pxs([(7, 9), (7, 10)], P_); t.px(7, 9, BR)
        t.linha([(16, 4), (20, 2), (22, 6), (20, 12)], VB_CIPO, 1)   # o cipó
        t.poli([(16, 13), (23, 15), (17, 18)], VB_)
        pes(t, [(10, 21), (13, 21)], VB_E)
    else:
        t.poli([(6, 14), (0, 9), (2, 19)], VB_); t.poli([(18, 14), (24, 9), (22, 19)], VB_)   # as folhonas
        t.elipse(12, 12, 8, 9, VB_)
        sombrear(t, {VB_: (VB_C, VB_E)})
        t.linha([(12, 3), (15, 0), (19, 2), (20, 6)], VB_CIPO, 1)   # o cipó
        if lado == "frente":
            t.elipse(12, 12, 6, 5, VB_BOCA)                # a boca aberta
            t.ret(7, 10, 17, 12, P_)
            t.pxs([(8, 10), (16, 10)], BR); t.pxs([(9, 10), (15, 10)], BR)
            t.linha([(6, 9), (9, 8)], P_, 1); t.linha([(18, 9), (15, 8)], P_, 1)   # olhar de cima
            t.pxs([(10, 16), (14, 15)], VB_BOCA_E)
        else:
            t.linha([(12, 5), (12, 19)], VB_E, 1)
        pes(t, [(10, 21), (14, 21)], VB_E)
    contorno_gba(t)


# --------------------------------------------------------------- TENTACRUEL
TC, TC_C, TC_E = H("68b0e0"), H("90c8f0"), H("205080")
TC_JOIA, TC_JOIA_C, TC_JOIA_E = H("b02820"), H("f85048"), H("801010")
TC_TENT, TC_TENT_E = H("888840"), H("585820")


def tentacruel(t, lado):
    for x0, x1 in ((6, 3), (9, 8), (12, 12), (15, 16), (18, 21)):   # os tentáculos
        t.linha([(x0, 12), (x1, 17), (x0 + (x1 - x0) // 2, 21)], TC_TENT, 2)
    if lado == "lado":
        t.elipse(12, 8, 8, 6, TC)
        sombrear(t, {TC: (TC_C, TC_E)})
        t.elipse(7, 6, 2, 2, TC_JOIA)
        t.px(6, 5, TC_JOIA_C)
        t.pxs([(4, 10), (4, 11)], P_)
    else:
        t.elipse(12, 8, 9, 6, TC)
        sombrear(t, {TC: (TC_C, TC_E)})
        t.elipse(8, 6, 2, 2, TC_JOIA); t.elipse(16, 6, 2, 2, TC_JOIA)   # as joias vermelhas
        t.pxs([(7, 5), (15, 5)], TC_JOIA_C)
        if lado == "frente":
            t.elipse(12, 9, 1, 1, TC_JOIA)
            for x in (8, 16):
                t.pxs([(x, 11), (x, 12)], P_)
    sombrear(t, {TC_TENT: (TC_TENT, TC_TENT_E)})
    contorno_gba(t)


DESENHOS = {11: metapod, 14: kakuna, 61: poliwhirl, 62: poliwrath, 64: kadabra,
            65: alakazam, 67: machoke, 68: machamp, 70: weepinbell, 71: victreebel,
            73: tentacruel}
TAMANHO = {11: 0.78, 14: 0.8, 61: 0.88, 64: 0.95, 67: 0.95, 70: 0.82}
