"""LOTE D: os Pokémon andando no mapa (formato em tools/andar_base.py)."""
from andar_base import *  # noqa: F401,F403


# ------------------------------------------------------------------- KRABBY
KR, KR_C, KR_E = H("e85020"), H("f89870"), H("b85018")
KR_BAR, KR_BAR_C, KR_BAR_E = H("e0b878"), H("f0d8a8"), H("b09040")
KR_GARRA_E = H("882018")


def garra_kr(t, x, y, d):
    """a pinça: a bola grande com o corte e a pontinha clara"""
    t.elipse(x, y, 3, 3, KR)
    t.linha([(x + 2 * d, y + 3), (x + 3 * d, y + 6)], KR_BAR, 2)   # o braço
    return [(x - 3 * d, y), (x, y)]


def krabby(t, lado):
    if lado in ("frente", "costas"):
        t.elipse(12, 16, 8, 4, KR)                         # a carapaça
        t.linha([(7, 15), (5, 12)], KR_BAR, 2); t.linha([(17, 15), (19, 12)], KR_BAR, 2)   # braços
        t.elipse(4, 8, 4, 4, KR); t.elipse(20, 8, 4, 4, KR)   # as pinças levantadas
        t.pxs([(10, 11), (10, 12), (14, 11), (14, 12), (9, 9), (10, 9), (9, 10), (10, 10), (14, 9), (15, 9), (14, 10), (15, 10)], KR_BAR)   # as hastes dos olhos
        sombrear(t, {KR: (KR_C, KR_E), KR_BAR: (KR_BAR_C, KR_BAR_E)})
        for x, d in ((4, 1), (20, -1)):                    # o corte da pinça
            t.linha([(x - 3 * d, 7), (x + d, 8)], P_, 1)
            t.px(x - 2 * d, 5, KR_C)
        if lado == "frente":
            t.elipse(12, 18, 5, 2, KR_BAR)                 # a barriga clara embaixo
            t.pxs([(9, 18), (15, 18)], KR_BAR_E)
            for x in (10, 14):                             # os olhinhos na ponta das hastes
                t.pxs([(x - 1, 9), (x, 9), (x - 1, 10), (x, 10)], BR); t.pxs([(x, 9), (x, 10)], P_)
            t.linha([(11, 15), (13, 15)], KR_GARRA_E, 1)
        else:
            t.pxs([(10, 10), (14, 10)], KR_BAR)
            t.linha([(8, 15), (16, 15)], KR_GARRA_E, 1)    # as listras da carapaça
            t.pxs([(12, 13), (12, 14)], KR_GARRA_E)
        pes(t, [(5, 21), (7, 21), (9, 21), (15, 21), (17, 21), (19, 21)], KR_BAR_E)
    else:
        t.elipse(13, 16, 7, 4, KR)
        t.linha([(17, 14), (18, 11)], KR_BAR, 2)           # o braço de trás
        t.elipse(18, 8, 3, 3, KR_GARRA_E)                  # a pinça de trás, na sombra
        t.linha([(8, 15), (6, 12)], KR_BAR, 2)
        t.elipse(5, 8, 4, 4, KR)                           # a pinça da frente
        t.pxs([(9, 11), (9, 12), (8, 9), (9, 9), (8, 10), (9, 10)], KR_BAR)
        sombrear(t, {KR: (KR_C, KR_E), KR_BAR: (KR_BAR_C, KR_BAR_E)})
        t.linha([(1, 8), (6, 9)], P_, 1); t.px(3, 6, KR_C)
        t.elipse(10, 18, 4, 2, KR_BAR)
        t.pxs([(8, 9), (9, 9), (8, 10), (9, 10)], BR); t.pxs([(8, 9), (8, 10)], P_)
        pes(t, [(7, 21), (9, 21), (11, 21), (16, 21), (18, 21), (20, 21)], KR_BAR_E)
    contorno_gba(t)


# ---------------------------------------------------------------- EXEGGCUTE
EG, EG_C, EG_E = H("f8b8a0"), H("f8d8c0"), H("e89880")
EG_RACHA = H("c08060")


def ovo(t, x, y, cara=None):
    """um ovo: a borda escura, o rosado e o brilho; cara = 'f' (de frente) ou 'l' (de lado)"""
    t.elipse(x, y, 4, 4, P_)
    t.elipse(x, y, 3, 3, EG)
    t.pxs([(x + 1, y + 2), (x + 2, y + 1), (x + 3, y), (x, y + 3), (x + 2, y + 2)], EG_E)
    t.pxs([(x - 1, y - 2), (x - 2, y - 1), (x - 2, y - 2)], EG_C)
    if cara == "f":
        t.pxs([(x - 1, y), (x - 1, y + 1), (x + 1, y), (x + 1, y + 1)], P_)   # os olhinhos
        t.pxs([(x - 2, y - 1), (x + 2, y - 1)], EG_RACHA)                 # a sobrancelha brava
    elif cara == "l":
        t.pxs([(x - 2, y), (x - 2, y + 1)], P_); t.px(x - 3, y - 1, EG_RACHA)


def exeggcute(t, lado):
    if lado == "frente":
        ovo(t, 12, 6)                                      # o de trás
        ovo(t, 6, 11, "f"); ovo(t, 18, 11, "f")
        ovo(t, 12, 13, "f")
        ovo(t, 7, 18, "f"); ovo(t, 17, 18, "f")
        t.pxs([(19, 16), (20, 17)], H("f8c848")); t.px(20, 16, P_)   # um rachado com a gema
    elif lado == "costas":
        for x, y in ((7, 18), (17, 18), (12, 13), (6, 11), (18, 11)):
            ovo(t, x, y)
        ovo(t, 12, 7)
        t.linha([(10, 11), (11, 13)], EG_RACHA, 1)         # as rachaduras
        t.linha([(16, 17), (17, 19)], EG_RACHA, 1)
    else:
        ovo(t, 15, 7); ovo(t, 18, 13); ovo(t, 17, 18)
        ovo(t, 10, 10, "l"); ovo(t, 6, 16, "l"); ovo(t, 11, 18, "l")
    contorno_gba(t)


# ------------------------------------------------------------------- CUBONE
CB, CB_C, CB_E = H("c09848"), H("d8b868"), H("906830")
CR, CR_C, CR_E = H("e8e8e8"), H("f8f8f8"), H("c8c8b0")     # o crânio
CR_FUNDO = H("888868")
CB_BARRIGA = H("f8d0a0")
CB_OLHO = H("282828")


def osso(t, pontos):
    """o osso: as duas bolotas nas pontas, a sombra do lado direito"""
    t.linha(pontos, CR, 2)
    for x, y in (pontos[0], pontos[-1]):
        t.elipse(x, y, 1, 1, CR); t.px(x + 1, y, CR_E)
    t.linha([(x + 1, y) for x, y in pontos], CR_E, 1)


def cubone(t, lado):
    if lado == "frente":
        t.elipse(12, 17, 5, 4, CB)                         # o corpinho
        t.pxs([(7, 15), (6, 16), (17, 15), (18, 16), (19, 16)], CB)
        t.elipse(12, 8, 7, 6, CR)                          # o crânio
        t.poli([(8, 11), (16, 11), (15, 15), (9, 15)], CR)  # o focinho do crânio
        sombrear(t, {CB: (CB_C, CB_E), CR: (CR_C, CR_E)})
        t.elipse(12, 18, 3, 2, CB_BARRIGA)
        for x in (8, 15):                                  # os buracos dos olhos
            t.ret(x, 9, x + 1, 11, CB_OLHO); t.px(x + (x < 12), 10, BR)
        t.pxs([(11, 13), (13, 13)], CR_FUNDO)              # o nariz do crânio
        t.linha([(9, 3), (15, 3)], CR_FUNDO, 1)            # as rachaduras da testa
        t.pxs([(9, 15), (10, 14), (14, 14), (15, 15)], CB) # o rosto marrom por baixo
        osso(t, [(20, 13), (20, 20)])                      # o osso na mão
        pes(t, [(8, 21), (9, 21), (15, 21), (16, 21)], CB_E)
    elif lado == "costas":
        t.elipse(12, 17, 5, 4, CB)
        t.poli([(15, 19), (20, 20), (18, 17)], CB)         # o rabinho
        t.pxs([(7, 15), (6, 16), (17, 15), (18, 16)], CB)
        osso(t, [(4, 12), (4, 19)])
        t.elipse(12, 9, 7, 6, CR)
        t.poli([(9, 2), (12, 0), (15, 2)], CR)             # o chifrinho de trás
        sombrear(t, {CB: (CB_C, CB_E), CR: (CR_C, CR_E)})
        t.linha([(12, 4), (12, 13)], CR_E, 1)              # a costura do crânio
        t.pxs([(8, 8), (16, 8), (10, 12), (14, 12)], CR_E)
        pes(t, [(8, 21), (9, 21), (15, 21), (16, 21)], CB_E)
    else:
        t.elipse(13, 17, 5, 4, CB)
        t.poli([(17, 18), (22, 20), (20, 16)], CB)
        t.elipse(11, 8, 7, 6, CR)
        t.poli([(5, 9), (2, 11), (3, 14), (9, 14)], CR)    # o focinho comprido pra frente
        t.poli([(15, 3), (19, 1), (18, 6)], CR)            # o chifre de trás
        sombrear(t, {CB: (CB_C, CB_E), CR: (CR_C, CR_E)})
        t.elipse(10, 18, 2, 2, CB_BARRIGA)
        t.ret(6, 8, 7, 10, CB_OLHO); t.px(6, 9, BR)
        t.px(2, 11, CR_FUNDO)
        t.pxs([(4, 14), (5, 14), (6, 13)], CB)
        osso(t, [(13, 14), (19, 19)])                      # o osso atravessado
        pes(t, [(10, 21), (11, 21), (15, 21), (16, 21)], CB_E)
    contorno_gba(t)


# ------------------------------------------------------------------ KOFFING
KO, KO_C, KO_E = H("985090"), H("b878b0"), H("683060")
GAS, GAS_E = H("e8d068"), H("c0b028")


def koffing(t, lado):
    cx = 12 if lado != "lado" else 13
    t.elipse(cx, 12, 8, 8, KO)
    for x, y in ((cx - 6, 6), (cx + 6, 6), (cx, 4), (cx + 7, 13), (cx - 7, 13)):
        t.elipse(x, y, 2, 2, KO)                           # as bolotas (crateras)
    sombrear(t, {KO: (KO_C, KO_E), GAS: (H("f0e890"), GAS_E)})
    for x, y in ((cx - 6, 5), (cx + 6, 5), (cx, 3)):
        t.pxs([(x, y), (x + 1, y)], H("d888d0")); t.px(x, y + 1, KO_E)   # o furinho de cada cratera
    if lado == "frente":
        for x in (9, 15):
            t.elipse(x, 9, 1, 1, BR); t.px(x, 9, P_); t.px(x + (1 if x < 12 else -1), 8, P_)
        t.poli([(8, 12), (16, 12), (14, 15), (10, 15)], P_)  # a bocona
        t.pxs([(9, 12), (11, 12), (13, 12), (15, 12)], BR)  # os dentinhos
        t.px(12, 14, H("e84040"))
        t.ret(11, 16, 13, 17, GAS); t.px(12, 17, KO_E)      # a caveirinha
        t.pxs([(10, 18), (14, 18), (11, 19), (13, 19), (12, 18)], GAS)
        for x, y in ((2, 19), (21, 18), (20, 3)):          # uns fiapos de gás
            t.pxs([(x, y), (x + 1, y), (x, y - 1)], GAS)
    elif lado == "costas":
        t.pxs([(12, 10), (8, 15), (16, 16)], KO_E)
    else:
        t.elipse(8, 9, 1, 1, BR); t.px(7, 9, P_); t.px(8, 8, P_)
        t.poli([(5, 12), (10, 12), (9, 15), (6, 15)], P_)
        t.pxs([(6, 12), (8, 12)], BR)
        t.pxs([(9, 17), (10, 18), (8, 19)], GAS)
    contorno_gba(t)


# ------------------------------------------------------------------ RHYHORN
RH, RH_C, RH_E = H("b8b8c8"), H("e0e0e8"), H("8080a8")
RH_PLACA, RH_FUNDO = H("585878"), H("404058")
RH_OLHO = H("a83828")


def chifre(t, pontos):
    """o chifre claro, com a borda preta mesmo em cima do corpo"""
    t.poli(pontos, P_)
    (x0, y0), (x1, y1), (x2, y2) = pontos
    t.poli([(x0 + 1, y0 - 1), (x1, y1 + 2), (x2 - 1, y2 - 1)], RH_C)


def rhyhorn(t, lado):
    if lado == "frente":
        t.poli([(4, 9), (7, 3), (9, 8), (12, 2), (15, 8), (17, 3), (20, 9)], RH)   # os espinhos das costas, atrás
        t.elipse(12, 13, 10, 6, RH)                        # o corpo de pedra
        sombrear(t, {RH: (RH_C, RH_E)})
        t.elipse(12, 15, 6, 6, P_)                         # a cabeçona na frente
        t.elipse(12, 15, 5, 5, RH)
        t.poli([(7, 17), (17, 17), (15, 20), (9, 20)], RH)
        t.linha([(8, 20), (16, 20)], RH_E, 1); t.pxs([(17, 18), (16, 19), (7, 16)], RH_E)
        t.pxs([(9, 12), (10, 11), (8, 13)], RH_C)
        chifre(t, [(9, 14), (12, 5), (15, 14)])            # o chifre
        for x in (9, 15):                                  # os olhinhos vermelhos
            t.pxs([(x, 15), (x, 16)], RH_OLHO); t.px(x, 15, P_)
        t.pxs([(11, 18), (13, 18)], RH_FUNDO)              # as narinas
        t.linha([(3, 12), (6, 10)], RH_PLACA, 1); t.linha([(21, 12), (18, 10)], RH_PLACA, 1)   # as placas
        pes(t, [(4, 21), (5, 21), (7, 21), (17, 21), (19, 21), (20, 21)], RH_FUNDO)
    elif lado == "costas":
        t.elipse(12, 14, 9, 7, RH)
        t.poli([(5, 10), (7, 4), (9, 9), (12, 3), (15, 9), (17, 4), (19, 10)], RH)
        t.poli([(10, 19), (12, 22), (14, 19)], RH)         # o rabinho
        sombrear(t, {RH: (RH_C, RH_E)})
        t.linha([(12, 6), (12, 18)], RH_PLACA, 1)          # o espinhaço
        t.linha([(5, 13), (9, 11)], RH_PLACA, 1); t.linha([(19, 13), (15, 11)], RH_PLACA, 1)
        t.linha([(5, 17), (9, 15)], RH_PLACA, 1); t.linha([(19, 17), (15, 15)], RH_PLACA, 1)
        pes(t, [(5, 21), (6, 21), (18, 21), (19, 21)], RH_FUNDO)
    else:
        t.elipse(15, 14, 8, 6, RH)                         # o corpão
        t.poli([(11, 10), (13, 4), (15, 8), (17, 3), (19, 8), (22, 5), (23, 12)], RH)   # espinhos
        sombrear(t, {RH: (RH_C, RH_E)})
        t.linha([(16, 11), (21, 12)], RH_PLACA, 1); t.linha([(15, 16), (21, 16)], RH_PLACA, 1)
        t.elipse(7, 15, 6, 5, P_)                          # a cabeça na frente do corpo
        t.elipse(7, 15, 5, 4, RH)
        t.poli([(10, 10), (13, 7), (12, 14)], RH)          # a crista
        t.pxs([(4, 12), (5, 11), (6, 11)], RH_C); t.linha([(3, 18), (9, 19)], RH_E, 1)
        chifre(t, [(1, 13), (2, 4), (6, 12)])              # o chifre no focinho
        t.pxs([(8, 14), (8, 15)], RH_OLHO); t.px(8, 14, P_)
        t.px(2, 16, RH_FUNDO)
        pes(t, [(6, 21), (7, 21), (10, 21), (17, 21), (19, 21), (20, 21)], RH_FUNDO)
    contorno_gba(t)


# ------------------------------------------------------------------ CHANSEY
CS, CS_C, CS_E = H("f8d0d0"), H("f8e0e0"), H("e8a8b8")
CS_PE = H("e05030")
OVO_B, OVO_E = H("f8f8f8"), H("f0e8a0")


def cachos(t, x, d):
    """os três cachinhos de cada lado da cabeça"""
    for i, y in enumerate((7, 10, 13)):
        t.elipse(x + d * (3 - i), y, 2, 1, CS)
        t.px(x + d * (5 - i), y - 1, CS)                   # a pontinha virada pra cima


def risca_cachos(t, x, d):
    """o risco preto entre um cachinho e outro"""
    for y, n in ((9, 4), (12, 3)):
        t.linha([(x, y), (x + d * n, y)], P_, 1)


def chansey(t, lado):
    if lado in ("frente", "costas"):
        cachos(t, 5, -1); cachos(t, 19, 1)
        t.elipse(12, 13, 8, 8, CS)                         # o ovão rosa
        t.pxs([(4, 15), (3, 16), (20, 15), (21, 16)], CS)  # bracinhos
        if lado == "costas":
            t.poli([(15, 18), (20, 20), (17, 16)], CS)     # o rabinho
        sombrear(t, {CS: (CS_C, CS_E)})
        risca_cachos(t, 5, -1); risca_cachos(t, 19, 1)
        if lado == "frente":
            for x in (9, 15):
                t.pxs([(x, 9), (x, 10), (x, 11)], P_); t.px(x, 9, BR)
            t.px(12, 13, H("a03828"))                      # a boquinha
            t.elipse(12, 17, 4, 2, H("e8a8b8"))            # a bolsa
            t.linha([(8, 17), (16, 17)], H("c07888"), 1)
            t.elipse(12, 16, 2, 2, OVO_B); t.pxs([(13, 17), (14, 16)], OVO_E)   # o ovo
            t.px(11, 15, BR)
        pes(t, [(8, 21), (9, 21), (15, 21), (16, 21)], CS_PE)
    else:
        cachos(t, 18, 1)
        t.elipse(11, 13, 8, 8, CS)
        t.pxs([(3, 15), (2, 16)], CS)
        t.poli([(17, 18), (22, 20), (19, 15)], CS)
        sombrear(t, {CS: (CS_C, CS_E)})
        risca_cachos(t, 18, 1)
        t.pxs([(6, 9), (6, 10), (6, 11)], P_); t.px(6, 9, BR)
        t.px(3, 12, H("a03828"))
        t.elipse(6, 17, 2, 2, OVO_B); t.px(7, 18, OVO_E)
        pes(t, [(8, 21), (9, 21), (14, 21), (15, 21)], CS_PE)
    contorno_gba(t)


# ------------------------------------------------------------------- HORSEA
HO, HO_C, HO_E = H("a0c0e8"), H("b8d8f8"), H("8090b0")
HO_FUNDO = H("385060")
HO_BAR, HO_BAR_E = H("f8f8a8"), H("e0c848")
HO_OLHO = H("c02828")


def espinhos_ho(t, x, y, d):
    """as três barbatanas pontudas do lado da cabeça"""
    for i in range(3):
        t.poli([(x, y + 3 * i - 1), (x + d * (5 - i), y + 3 * i - 3), (x, y + 3 * i + 1)], HO)


def horsea(t, lado):
    if lado in ("frente", "costas"):
        espinhos_ho(t, 7, 6, -1); espinhos_ho(t, 17, 6, 1)
        t.elipse(12, 19, 3, 3, HO)                         # o rabo enrolado
        t.elipse(12, 15, 4, 4, HO)                         # o corpinho
        t.elipse(12, 8, 5, 5, HO)                          # a cabeça
        sombrear(t, {HO: (HO_C, HO_E)})
        t.pxs([(11, 18), (12, 18), (13, 19), (12, 20), (11, 20), (10, 19)], P_)   # a espiral do rabo
        if lado == "frente":
            t.elipse(12, 15, 2, 3, HO_BAR)                 # a barriga em gomos
            t.pxs([(11, 14), (12, 14), (13, 14), (11, 16), (12, 16), (13, 16)], HO_BAR_E)
            t.elipse(12, 11, 1, 1, HO_E); t.px(12, 11, HO_FUNDO)   # o focinho de canudo, de frente
            for x, d in ((10, -1), (14, 1)):               # os olhões vermelhos, de pupila preta
                t.pxs([(x + d, 7), (x + d, 8), (x + d, 9)], HO_OLHO)
                t.pxs([(x, 7), (x, 8), (x, 9)], P_); t.px(x, 7, BR)
        else:
            t.poli([(12, 11), (15, 14), (12, 17)], HO_FUNDO)   # a barbatana das costas
            t.px(13, 14, HO_E)
    else:
        t.poli([(14, 4), (19, 2), (17, 6), (20, 7), (16, 9)], HO)   # as barbatanas da nuca
        t.elipse(15, 19, 3, 3, HO)
        t.elipse(13, 14, 4, 4, HO)
        t.elipse(12, 7, 4, 4, HO)
        t.ret(3, 7, 9, 9, HO)                              # o focinho de canudo
        t.poli([(16, 11), (20, 12), (17, 15)], HO)          # a barbatana das costas
        sombrear(t, {HO: (HO_C, HO_E)})
        t.pxs([(3, 7), (3, 8), (3, 9)], HO_FUNDO)          # a boca na ponta
        t.pxs([(14, 18), (15, 18), (16, 19), (15, 20), (14, 20), (13, 19)], P_)
        t.elipse(10, 14, 2, 3, HO_BAR); t.pxs([(9, 13), (10, 15)], HO_BAR_E)
        t.ret(9, 5, 10, 6, HO_OLHO); t.px(9, 5, BR); t.px(9, 6, P_)
        t.linha([(18, 12), (17, 14)], HO_FUNDO, 1)
    contorno_gba(t)


# ------------------------------------------------------------------ GOLDEEN
GO, GO_C, GO_E = H("f8f8f8"), H("ffffff"), H("b8b8c0")
GL, GL_C, GL_E = H("e87840"), H("f8c078"), H("d04010")


def goldeen(t, lado):
    if lado == "lado":
        t.poli([(16, 13), (22, 6), (21, 12), (22, 20)], GL)  # o rabo de véu
        t.poli([(8, 9), (13, 2), (17, 9)], GL)              # a barbatana de cima
        t.poli([(9, 17), (12, 22), (15, 17)], GL)           # a de baixo
        t.elipse(10, 13, 8, 5, GO)                         # o corpo branco
        t.poli([(4, 10), (0, 5), (6, 9)], GO_E)             # o chifre
        sombrear(t, {GO: (GO_C, GO_E), GL: (GL_C, GL_E)})
        t.elipse(13, 11, 3, 2, GL); t.elipse(9, 16, 2, 1, GL)   # as manchas laranja
        t.pxs([(14, 10), (12, 10)], GL_C)
        t.elipse(5, 12, 1, 1, BR); t.px(5, 12, P_); t.px(6, 11, GL_E)
        t.pxs([(2, 14), (3, 14)], GL)                      # a boca
        t.linha([(18, 10), (20, 8)], GO, 1); t.linha([(18, 16), (20, 18)], GO, 1)   # as listras do rabo
    else:
        t.poli([(9, 18), (5, 23), (12, 20), (19, 23), (15, 18)], GL)   # o rabo
        t.poli([(4, 12), (0, 9), (2, 16)], GL); t.poli([(20, 12), (24, 9), (22, 16)], GL)   # as nadadeiras
        t.elipse(12, 12, 7, 8, GO)
        t.poli([(10, 6), (12, 0), (14, 6)], GO_E if lado == "frente" else GL)   # o chifre / a barbatana
        sombrear(t, {GO: (GO_C, GO_E), GL: (GL_C, GL_E)})
        if lado == "frente":
            for x in (8, 16):                              # os olhos dos lados, com o laranja em volta
                t.elipse(x, 10, 1, 1, GL); t.px(x, 10, P_); t.px(x + (1 if x < 12 else -1), 9, BR)
            t.elipse(12, 14, 2, 1, GL)                     # o bico
            t.px(12, 14, GL_E)
            t.elipse(12, 18, 3, 1, GL)
        else:
            t.elipse(12, 12, 3, 4, GL); t.pxs([(11, 10), (12, 9)], GL_C)
            t.linha([(12, 4), (12, 9)], GL_E, 1)
    contorno_gba(t)


# ------------------------------------------------------------------- STARYU
import math  # noqa: E402

ST, ST_C, ST_E = H("a07030"), H("d0b070"), H("684020")
NU, NU_C, NU_E = H("f0d050"), H("f8f8b0"), H("c0a810")
JOIA, JOIA_E = H("e06040"), H("a84020")


def estrela(t, cx, cy, r1, r2, giro, cor, achatar=1.0):
    pts = []
    for i in range(10):
        a = math.radians(giro + i * 36 - 90)
        r = r1 if i % 2 == 0 else r2
        pts.append((round(cx + r * math.cos(a) * achatar), round(cy + r * math.sin(a))))
    t.poli(pts, cor)


def staryu(t, lado):
    if lado == "lado":                                     # de lado, a estrela fica de perfil, estreita
        estrela(t, 12, 12, 10, 4, 0, ST, 0.55)
        sombrear(t, {ST: (ST_C, ST_E)})
        t.elipse(9, 12, 1, 3, NU); t.px(8, 11, NU_C)
        t.pxs([(8, 12), (8, 13)], JOIA); t.px(8, 12, BR)
        t.linha([(14, 4), (14, 20)], ST_E, 1)
    else:
        estrela(t, 12, 12, 11, 5, 0, ST)
        sombrear(t, {ST: (ST_C, ST_E)})
        t.linha([(12, 3), (12, 7)], ST_C, 1)               # o vinco das pontas
        if lado == "frente":
            t.elipse(12, 12, 4, 4, NU)                     # o núcleo dourado
            t.anel(12, 12, 4, 4, NU_E, 1)
            t.pxs([(12, 8), (8, 12), (16, 12), (10, 15), (14, 15)], NU_C)
            t.elipse(12, 12, 2, 2, JOIA)                   # a joia vermelha
            t.pxs([(13, 13), (13, 14), (14, 13)], JOIA_E); t.px(11, 11, BR)
        else:
            t.elipse(12, 12, 3, 3, ST_E)                   # as costas, o miolo marrom
            t.elipse(12, 12, 2, 2, ST)
    contorno_gba(t)


# ------------------------------------------------------------------ SCYTHER
SC, SC_C, SC_E = H("98d848"), H("b8f870"), H("70a840")
SC_FUNDO = H("406020")
SC_BAR, SC_BAR_E = H("f0e078"), H("988830")
FOICE, FOICE_C, FOICE_E = H("d8d8d8"), H("f8f8f8"), H("8a8a8a")
ASA, ASA_E = H("d0f0e0"), H("a8d0b8")                     # as asas, verdinhas de transparência


def foice(t, x, y, d):
    """a lâmina em meia-lua: sai do ombro (x, y), abre pra fora e desce até a ponta"""
    t.poli([(x, y), (x + 4 * d, y), (x + 6 * d, y + 3), (x + 6 * d, y + 9), (x + 4 * d, y + 4), (x + d, y + 2)], FOICE)


def scyther(t, lado):
    if lado in ("frente", "costas"):
        t.poli([(10, 8), (2, 0), (5, 9)], ASA); t.poli([(14, 8), (22, 0), (19, 9)], ASA)   # as asas
        t.elipse(12, 14, 4, 4, SC)                         # o corpo
        t.elipse(12, 6, 4, 4, SC)                          # a cabeça
        t.poli([(11, 3), (13, 3), (12, 0)], SC)            # a crista
        t.linha([(8, 11), (6, 12)], SC, 2); t.linha([(16, 11), (18, 12)], SC, 2)   # os braços
        foice(t, 8, 12, -1); foice(t, 16, 12, 1)           # as foices
        sombrear(t, {SC: (SC_C, SC_E), FOICE: (FOICE_C, FOICE_E), ASA: (H("f0fff8"), ASA_E)})
        t.linha([(4, 13), (3, 15)], FOICE_C, 1); t.linha([(20, 13), (21, 15)], FOICE_C, 1)
        t.linha([(3, 2), (7, 7)], ASA_E, 1); t.linha([(21, 2), (17, 7)], ASA_E, 1)   # as veias das asas
        if lado == "frente":
            t.elipse(12, 15, 2, 3, SC_BAR)                 # a barriga em gomos
            t.pxs([(11, 14), (13, 14), (11, 16), (13, 16)], SC_BAR_E)
            for x in (9, 15):
                t.pxs([(x, 6), (x, 7)], P_); t.px(x, 6, BR)
            t.linha([(11, 9), (13, 9)], SC_FUNDO, 1)
        else:
            t.poli([(11, 10), (5, 4), (8, 14)], ASA); t.poli([(13, 10), (19, 4), (16, 14)], ASA)   # as asas de baixo
            t.linha([(12, 11), (12, 18)], SC_FUNDO, 1)
        pes(t, [(9, 21), (10, 21), (14, 21), (15, 21)], SC_FUNDO)
    else:
        t.poli([(13, 10), (21, 1), (21, 6), (23, 8), (21, 13), (14, 13)], ASA)   # as asas
        t.elipse(13, 14, 4, 4, SC)
        t.poli([(13, 17), (20, 20), (16, 15)], SC)         # o rabo/abdômen
        t.elipse(9, 6, 4, 4, SC)
        t.poli([(9, 3), (13, 1), (12, 4)], SC)             # a crista pra trás
        foice(t, 10, 10, -1)                               # a foice da frente
        sombrear(t, {SC: (SC_C, SC_E), FOICE: (FOICE_C, FOICE_E), ASA: (H("f0fff8"), ASA_E)})
        t.pxs([(10, 10), (9, 10)], SC_E)
        t.linha([(17, 4), (20, 9)], ASA_E, 1)              # a veia da asa
        t.elipse(11, 15, 2, 3, SC_BAR); t.px(11, 14, SC_BAR_E)
        t.pxs([(6, 6), (6, 7)], P_); t.px(6, 6, BR)
        t.px(5, 9, SC_FUNDO)
        pes(t, [(11, 21), (12, 21), (15, 21), (16, 21)], SC_FUNDO)
    contorno_gba(t)


# ------------------------------------------------------------------ DRATINI
DR, DR_C, DR_E = H("a080c0"), H("c0a0e0"), H("705090")
DR_BAR, DR_BAR_E = H("e8e8c0"), H("c8c898")
DR_ASA = H("f8f8f8")


def orelha_dr(t, x, y, d):
    """a barbatana branca de três pontas do lado da cabeça"""
    t.poli([(x, y - 1), (x + 4 * d, y - 3), (x + 2 * d, y), (x + 4 * d, y + 1), (x, y + 2)], DR_ASA)


def dratini(t, lado):
    if lado in ("frente", "costas"):
        t.elipse(12, 18, 8, 3, DR)                         # o corpo enrolado no chão
        t.elipse(12, 14, 3, 4, DR)                         # o pescoço
        t.elipse(12, 8, 5, 5, DR)                          # a cabeça
        orelha_dr(t, 7, 7, -1); orelha_dr(t, 17, 7, 1)
        sombrear(t, {DR: (DR_C, DR_E), DR_ASA: (DR_ASA, H("c8c8d0"))})
        if lado == "frente":
            t.elipse(12, 15, 1, 3, DR_BAR)                 # a barriga creme
            t.linha([(6, 19), (18, 19)], DR_BAR, 1)
            t.elipse(12, 11, 2, 1, DR_C)                   # o focinho
            t.px(12, 3, DR_ASA)                            # o carocinho da testa
            for x in (9, 14):                              # olhão de 2x3, senão some no encolher
                t.ret(x, 7, x + 1, 9, P_); t.px(x + (x < 12), 7, BR)
        else:
            t.linha([(5, 17), (19, 17)], DR_E, 1)          # a dobra do rabo
            t.pxs([(19, 15), (20, 14)], DR)
    else:
        t.linha([(9, 13), (11, 18), (16, 19), (20, 17), (21, 13)], DR, 4)   # o corpo em S
        t.elipse(21, 12, 1, 1, DR)                         # a pontinha do rabo
        t.elipse(8, 9, 5, 4, DR)
        t.ret(2, 9, 6, 12, DR)                             # o focinho
        orelha_dr(t, 11, 8, 1)
        sombrear(t, {DR: (DR_C, DR_E), DR_ASA: (DR_ASA, H("c8c8d0"))})
        t.linha([(8, 14), (10, 19), (16, 21)], DR_BAR, 1)  # a barriga creme embaixo
        t.pxs([(5, 7), (5, 8), (5, 9)], P_); t.px(5, 7, BR)
        t.px(6, 4, DR_ASA)
        t.px(2, 10, DR_E)
    contorno_gba(t)


# ------------------------------------------------------------------- LAPRAS
LP, LP_C, LP_E = H("70b0e0"), H("98c8f0"), H("7088c0")
LP_FUNDO = H("304868")
LP_BAR, LP_BAR_E = H("f8e890"), H("e0c068")
CASCO, CASCO_C, CASCO_E = H("d0c0b8"), H("e8e0d8"), H("a09088")
CASCO_BOLA = H("605058")


def bolotas(t, pontos):
    """os carocinhos do casco"""
    for x, y in pontos:
        t.elipse(x, y, 1, 1, CASCO_E); t.px(x - 1, y - 1, CASCO_C); t.px(x, y, CASCO_BOLA)


def lapras(t, lado):
    if lado == "frente":
        t.elipse(12, 16, 10, 5, CASCO)                     # o casco atrás, aparecendo dos lados
        t.elipse(12, 17, 7, 5, LP)                         # o corpo
        t.ret(10, 7, 14, 14, LP)                           # o pescoção
        t.elipse(12, 6, 5, 4, LP)                          # a cabeça
        t.poli([(13, 2), (15, 0), (16, 3)], LP)            # o chifrinho
        sombrear(t, {LP: (LP_C, LP_E), CASCO: (CASCO_C, CASCO_E)})
        t.ret(11, 10, 13, 14, LP_BAR)                      # a garganta creme
        t.elipse(12, 18, 4, 3, LP_BAR)
        t.pxs([(9, 18), (15, 18), (12, 20)], LP_BAR_E)
        bolotas(t, [(4, 13), (20, 13), (3, 17), (21, 17)])
        for x in (9, 15):
            t.pxs([(x, 5), (x, 6)], P_); t.px(x, 5, BR)
        t.linha([(10, 8), (14, 8)], LP_FUNDO, 1)
        pes(t, [(5, 21), (6, 21), (7, 21), (17, 21), (18, 21), (19, 21)], LP_E)   # as nadadeiras
    elif lado == "costas":
        t.ret(10, 4, 14, 12, LP)
        t.elipse(12, 5, 5, 4, LP)
        t.poli([(13, 2), (15, 0), (16, 3)], LP)
        t.elipse(12, 16, 10, 6, CASCO)                     # o casco grande
        sombrear(t, {LP: (LP_C, LP_E), CASCO: (CASCO_C, CASCO_E)})
        t.anel(12, 16, 10, 6, CASCO_E, 1)
        bolotas(t, [(8, 13), (16, 13), (12, 15), (6, 18), (18, 18), (12, 19)])
        t.pxs([(9, 4), (15, 4)], LP_E)
        pes(t, [(3, 21), (4, 21), (5, 21), (19, 21), (20, 21), (21, 21)], LP_E)
    else:
        t.elipse(14, 16, 9, 5, LP)                         # o corpo
        t.linha([(8, 14), (6, 9), (6, 5)], LP, 4)          # o pescoço pra cima
        t.elipse(5, 5, 4, 3, LP)                           # a cabeça virada pra esquerda
        t.poli([(7, 3), (10, 0), (9, 4)], LP)
        t.elipse(15, 13, 8, 5, CASCO)                      # o casco nas costas
        sombrear(t, {LP: (LP_C, LP_E), CASCO: (CASCO_C, CASCO_E)})
        t.linha([(5, 8), (6, 12), (8, 17)], LP_BAR, 2)     # a frente creme do pescoço
        t.elipse(10, 18, 3, 2, LP_BAR)
        bolotas(t, [(11, 11), (16, 9), (20, 12), (15, 14)])
        t.pxs([(4, 4), (4, 5)], P_); t.px(4, 4, BR)
        t.linha([(1, 6), (3, 7)], LP_FUNDO, 1)
        pes(t, [(7, 21), (8, 21), (9, 21), (18, 21), (19, 21), (20, 21)], LP_E)
    contorno_gba(t)


DESENHOS = {98: krabby, 102: exeggcute, 104: cubone, 109: koffing, 111: rhyhorn, 113: chansey,
            116: horsea, 118: goldeen, 120: staryu, 123: scyther, 147: dratini, 131: lapras}
TAMANHO = {98: 0.82, 102: 0.9, 104: 0.8, 109: 0.85, 113: 0.9, 116: 0.85, 118: 0.85, 120: 0.85,
           147: 0.85}
