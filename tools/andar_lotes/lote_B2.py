"""LOTE B2: BUTTERFREE, BEEDRILL, RATICATE, ARBOK, SANDSLASH, NIDOKING,
CLEFABLE, NINETALES, WIGGLYTUFF, GOLBAT, GLOOM, PARASECT — andando no mapa."""
from andar_base import *  # noqa: F401,F403


# --------------------------------------------------------------- BUTTERFREE
BF, BF_C, BF_E = H("505070"), H("787898"), H("404058")
BF_ASA, BF_ASA_E, BF_VEIA = H("f8f8f8"), H("c0c0c0"), H("404058")
BF_OLHO, BF_OLHO_E = H("c86068"), H("902010")
BF_PERNA = H("98c8c0")


def butterfree(t, lado):
    """borboleta voando: sem pé, as asonas brancas"""
    if lado in ("frente", "costas"):
        t.poli([(10, 9), (2, 3), (0, 9), (3, 14), (10, 13)], BF_ASA)   # asas de cima
        t.poli([(14, 9), (22, 3), (24, 9), (21, 14), (14, 13)], BF_ASA)
        t.poli([(10, 13), (4, 15), (6, 20), (11, 16)], BF_ASA)          # asas de baixo
        t.poli([(14, 13), (20, 15), (18, 20), (13, 16)], BF_ASA)
        t.linha([(10, 6), (8, 1)], BF, 1); t.linha([(14, 6), (16, 1)], BF, 1)   # as antenas
        t.elipse(12, 9, 4, 3, BF)                          # cabeça
        t.elipse(12, 15, 2, 3, BF)                         # corpinho
        sombrear(t, {BF: (BF_C, BF_E), BF_ASA: (BF_ASA, BF_ASA_E)})
        t.pxs([(1, 9), (2, 4), (23, 9), (22, 4), (5, 19), (19, 19)], P_)   # as pontas pretas
        t.linha([(4, 6), (9, 11)], BF_VEIA, 1); t.linha([(20, 6), (15, 11)], BF_VEIA, 1)
        if lado == "frente":
            for x in (9, 15):                              # olhões vermelhos
                t.ret(x - (1 if x < 12 else 0), 8, x + (0 if x < 12 else 1), 10, BF_OLHO)
                t.px(x, 10, BF_OLHO_E)
            t.px(12, 11, BF_PERNA)
            t.pxs([(11, 19), (13, 19)], BF_PERNA)          # as perninhas
    else:
        t.poli([(12, 10), (16, 1), (23, 3), (22, 10), (15, 13)], BF_ASA)
        t.poli([(13, 13), (19, 13), (19, 19), (14, 17)], BF_ASA)
        t.linha([(7, 6), (4, 1)], BF, 1)
        t.elipse(8, 10, 4, 3, BF)
        t.elipse(11, 15, 2, 3, BF)
        sombrear(t, {BF: (BF_C, BF_E), BF_ASA: (BF_ASA, BF_ASA_E)})
        t.pxs([(16, 1), (22, 3), (19, 19)], P_)
        t.linha([(15, 4), (20, 9)], BF_VEIA, 1)
        t.ret(5, 9, 6, 11, BF_OLHO); t.px(5, 11, BF_OLHO_E)
        t.pxs([(10, 19), (12, 19)], BF_PERNA)
    contorno_gba(t)


# ----------------------------------------------------------------- BEEDRILL
BD, BD_C, BD_E = H("d8b038"), H("f8d848"), H("887000")
BD_ASA, BD_ASA_C, BD_ASA_E = H("d8c8f0"), H("e8e0f8"), H("b8a8c0")
BD_FERRAO, BD_FERRAO_E = H("f8f8f8"), H("606060")
BD_OLHO = H("980008")


def beedrill(t, lado):
    """abelha voando: as duas brocas nos braços e o ferrão no rabo"""
    if lado in ("frente", "costas"):
        t.poli([(10, 9), (2, 2), (4, 10)], BD_ASA); t.poli([(14, 9), (22, 2), (20, 10)], BD_ASA)   # asas
        t.poli([(7, 13), (2, 19), (6, 14)], BD_FERRAO); t.poli([(17, 13), (22, 19), (18, 14)], BD_FERRAO)   # as brocas
        t.elipse(12, 15, 3, 4, BD)                         # o abdome listrado
        t.poli([(11, 18), (12, 23), (13, 18)], BD_FERRAO)
        t.elipse(12, 8, 4, 4, BD)                          # cabeça
        t.linha([(10, 4), (8, 1)], P_, 1); t.linha([(14, 4), (16, 1)], P_, 1)
        sombrear(t, {BD: (BD_C, BD_E), BD_ASA: (BD_ASA_C, BD_ASA_E), BD_FERRAO: (BD_FERRAO, BD_FERRAO_E)})
        t.linha([(10, 15), (14, 15)], P_, 1); t.linha([(10, 17), (14, 17)], P_, 1)   # as listras
        if lado == "frente":
            for x in (9, 15):
                t.ret(x - (1 if x < 12 else 0), 7, x + (0 if x < 12 else 1), 8, BD_OLHO)
            t.px(12, 10, BD_E)
    else:
        t.poli([(12, 8), (18, 1), (21, 3), (16, 10)], BD_ASA)
        t.poli([(7, 12), (1, 18), (6, 14)], BD_FERRAO)
        t.elipse(14, 15, 4, 3, BD)
        t.poli([(17, 16), (22, 21), (18, 14)], BD_FERRAO)
        t.elipse(8, 9, 4, 4, BD)
        t.linha([(7, 5), (4, 1)], P_, 1)
        sombrear(t, {BD: (BD_C, BD_E), BD_ASA: (BD_ASA_C, BD_ASA_E), BD_FERRAO: (BD_FERRAO, BD_FERRAO_E)})
        t.linha([(13, 13), (13, 18)], P_, 1); t.linha([(16, 13), (16, 17)], P_, 1)
        t.ret(5, 8, 6, 9, BD_OLHO)
    contorno_gba(t)


# ----------------------------------------------------------------- RATICATE
RT, RT_C, RT_E = H("a07830"), H("c09840"), H("704800")
RT_CREME, RT_CREME_E = H("f0f0a0"), H("d0b880")
RT_PE = H("d88060")


def raticate(t, lado):
    if lado in ("frente", "costas"):
        t.elipse(5, 6, 2, 2, RT); t.elipse(19, 6, 2, 2, RT)   # orelhas
        t.elipse(12, 14, 8, 6, RT)                         # o corpão redondo
        t.pxs([(3, 9), (2, 10), (21, 9), (22, 10)], RT)    # a juba dos lados
        sombrear(t, {RT: (RT_C, RT_E)})
        if lado == "frente":
            t.pxs([(5, 6), (19, 6)], RT_PE)
            t.elipse(12, 17, 5, 3, RT_CREME)               # a barriga creme
            for x in (8, 15):
                t.ret(x, 10, x + 1, 11, P_); t.px(x, 10, BR)
            t.elipse(12, 13, 2, 1, RT_CREME_E)
            t.px(12, 13, P_)
            t.ret(11, 14, 13, 16, BR); t.linha([(12, 14), (12, 16)], BD_FERRAO_E, 1)   # os dentões
            t.linha([(4, 13), (8, 14)], P_, 1); t.linha([(20, 13), (16, 14)], P_, 1)   # bigode
        else:
            t.linha([(17, 18), (21, 19), (22, 15)], RT_PE, 1)   # o rabo pelado
            t.linha([(9, 8), (12, 10), (15, 8)], RT_E, 1)
        pes(t, [(7, 21), (8, 21), (16, 21), (17, 21)], RT_PE)
    else:
        t.elipse(10, 5, 2, 2, RT)
        t.elipse(13, 14, 8, 6, RT)
        t.poli([(7, 11), (2, 13), (5, 16), (8, 16)], RT)   # o focinho
        sombrear(t, {RT: (RT_C, RT_E)})
        t.px(10, 5, RT_PE)
        t.elipse(10, 18, 3, 2, RT_CREME)
        t.ret(7, 10, 8, 11, P_); t.px(7, 10, BR)
        t.px(2, 13, P_)
        t.ret(3, 16, 4, 18, BR)
        t.linha([(20, 18), (23, 17), (23, 13)], RT_PE, 1)
        pes(t, [(8, 21), (9, 21), (16, 21), (17, 21)], RT_PE)
    contorno_gba(t)


# -------------------------------------------------------------------- ARBOK
AR, AR_C, AR_E = H("905880"), H("b880a8"), H("603858")
AR_VERMELHO, AR_AMARELO = H("c04018"), H("f8e010")
AR_BARRIGA = H("d8a0c0")


def capuz(t, x, y):
    """a cara assustadora no capuz"""
    for d in (-1, 1):
        t.poli([(x + 2 * d, y - 1), (x + 4 * d, y), (x + 3 * d, y + 2), (x + d, y + 1)], AR_VERMELHO)
        t.px(x + 3 * d, y + 1, AR_AMARELO)
    t.poli([(x - 2, y + 4), (x, y + 3), (x + 2, y + 4), (x, y + 6)], P_)


def arbok(t, lado):
    if lado in ("frente", "costas"):
        t.elipse(12, 19, 10, 3, AR)                        # a rodilha
        t.elipse(12, 9, 8, 6, AR)                          # o capuz aberto
        t.elipse(12, 4, 3, 3, AR)                          # a cabeça em cima
        sombrear(t, {AR: (AR_C, AR_E)})
        t.linha([(4, 19), (10, 19)], AR_E, 1); t.linha([(14, 19), (20, 19)], AR_E, 1)
        if lado == "frente":
            t.ret(11, 13, 13, 17, AR_BARRIGA)
            capuz(t, 12, 8)
            t.pxs([(10, 3), (14, 3)], AR_AMARELO); t.pxs([(10, 4), (14, 4)], P_)   # os olhos
            t.px(12, 6, AR_VERMELHO)
        else:
            t.linha([(12, 7), (12, 14)], AR_E, 1)
            t.linha([(21, 18), (23, 13)], AR, 1)
        pes(t, [(5, 22), (6, 22), (18, 22), (19, 22)], AR_E)
    else:
        t.elipse(13, 19, 9, 3, AR)
        t.elipse(12, 10, 4, 6, AR)                         # o capuz de lado
        t.elipse(8, 4, 4, 3, AR)
        sombrear(t, {AR: (AR_C, AR_E)})
        t.linha([(9, 9), (9, 16)], AR_BARRIGA, 1)
        t.linha([(11, 8), (14, 12)], AR_VERMELHO, 1)
        t.pxs([(6, 3)], AR_AMARELO); t.px(6, 4, P_)
        t.linha([(4, 6), (7, 6)], AR_VERMELHO, 1)
        t.linha([(6, 19), (20, 19)], AR_E, 1)
        pes(t, [(7, 22), (8, 22), (18, 22), (19, 22)], AR_E)
    contorno_gba(t)


# ---------------------------------------------------------------- SANDSLASH
SL2, SL2_C, SL2_E = H("d8c020"), H("e8d868"), H("a88030")
ESPINHO, ESPINHO_C, ESPINHO_E = H("886018"), H("c8a048"), H("584010")
SL2_CREME = H("f0e0d0")


def sandslash(t, lado):
    if lado == "frente":
        for x, y in ((4, 9), (20, 9), (6, 4), (18, 4), (12, 2)):   # os espinhos atrás aparecendo
            t.poli([(x, y), (12 + (x - 12) // 2, y + 6), (12 + (x - 12) // 2 + (2 if x <= 12 else -2), y + 7)], ESPINHO)
        t.elipse(12, 10, 5, 4, SL2)
        t.elipse(12, 17, 6, 4, SL2)
        t.pxs([(5, 15), (4, 16), (19, 15), (20, 16)], SL2)
        sombrear(t, {SL2: (SL2_C, SL2_E), ESPINHO: (ESPINHO_C, ESPINHO_E)})
        t.elipse(12, 17, 4, 3, SL2_CREME)
        t.linha([(9, 17), (15, 17)], H("d8d0b0"), 1)
        for x in (9, 15):
            t.ret(x - (1 if x < 12 else 0), 9, x + (0 if x < 12 else 1), 10, P_)
        t.pxs([(11, 12), (12, 12)], P_)
        t.pxs([(3, 17), (21, 17)], BR)
        pes(t, [(9, 21), (10, 21), (14, 21), (15, 21)], SL2_E)
    elif lado == "costas":
        t.elipse(12, 9, 5, 4, SL2)
        for x, y in ((3, 12), (21, 12), (5, 6), (19, 6), (8, 3), (16, 3), (12, 4), (8, 9), (16, 9), (12, 9)):
            t.poli([(x, y), (x - 2, y + 5), (x + 2, y + 5)], ESPINHO)   # o lombo de espinhos
        t.elipse(12, 16, 7, 5, ESPINHO)
        sombrear(t, {SL2: (SL2_C, SL2_E), ESPINHO: (ESPINHO_C, ESPINHO_E)})
        for x, y in ((9, 15), (15, 15), (12, 13), (12, 18)):
            t.linha([(x, y), (x, y + 2)], ESPINHO_C, 1)
        pes(t, [(9, 21), (10, 21), (14, 21), (15, 21)], SL2_E)
    else:
        for x, y in ((14, 2), (19, 4), (22, 9), (22, 14)):
            t.poli([(x, y), (x - 4, y + 5), (x - 1, y + 7)], ESPINHO)
        t.elipse(15, 13, 6, 5, ESPINHO)
        t.elipse(8, 9, 5, 4, SL2)
        t.elipse(11, 17, 5, 4, SL2)
        sombrear(t, {SL2: (SL2_C, SL2_E), ESPINHO: (ESPINHO_C, ESPINHO_E)})
        t.elipse(9, 18, 2, 2, SL2_CREME)
        t.ret(5, 8, 6, 9, P_)
        t.px(3, 11, P_)
        t.px(6, 18, BR)
        pes(t, [(9, 21), (10, 21), (14, 21), (15, 21)], SL2_E)
    contorno_gba(t)


# ----------------------------------------------------------------- NIDOKING
NK, NK_C, NK_E = H("a05898"), H("d078e0"), H("683078")
NK_BARRIGA, NK_BARRIGA_E = H("e0e0d0"), H("c0c0a0")
NK_CHIFRE, NK_CHIFRE_E = H("f8f8f8"), H("c0c0a0")
NK_ORELHA = H("289078")


def nidoking(t, lado):
    if lado in ("frente", "costas"):
        t.poli([(5, 2), (9, 5), (7, 9)], NK); t.poli([(19, 2), (15, 5), (17, 9)], NK)   # orelhas
        if lado == "costas":
            t.poli([(15, 18), (21, 21), (22, 17)], NK)     # o rabão
        t.elipse(12, 16, 7, 6, NK)                         # o corpo parrudo
        t.elipse(4, 14, 2, 3, NK); t.elipse(20, 14, 2, 3, NK)   # braços
        t.elipse(12, 8, 5, 4, NK)                          # cabeça
        if lado == "frente":
            t.poli([(11, 5), (12, 0), (13, 5)], NK_CHIFRE)
        sombrear(t, {NK: (NK_C, NK_E), NK_CHIFRE: (NK_CHIFRE, NK_CHIFRE_E)})
        if lado == "frente":
            t.pxs([(6, 4), (7, 5), (18, 4), (17, 5)], NK_ORELHA)
            t.elipse(12, 17, 4, 4, NK_BARRIGA)             # a barriga creme com as placas
            t.linha([(9, 16), (15, 16)], NK_BARRIGA_E, 1); t.linha([(9, 18), (15, 18)], NK_BARRIGA_E, 1)
            for x in (9, 15):
                t.ret(x - (1 if x < 12 else 0), 8, x + (0 if x < 12 else 1), 9, P_)
                t.px(x, 8, BR)
            t.linha([(10, 11), (14, 11)], NK_E, 1)
        else:
            for y in (7, 11, 14, 17):                      # os espinhos das costas
                t.pxs([(12, y), (12, y + 1)], NK_CHIFRE); t.px(12, y + 2, NK_E)
        pes(t, [(7, 21), (8, 21), (9, 21), (15, 21), (16, 21), (17, 21)], NK_E)
    else:
        t.poli([(16, 18), (23, 21), (23, 16)], NK)
        t.poli([(9, 1), (13, 5), (9, 7)], NK)
        t.elipse(13, 15, 6, 6, NK)
        t.elipse(8, 8, 5, 4, NK)
        t.poli([(5, 5), (2, 1), (7, 4)], NK_CHIFRE)
        sombrear(t, {NK: (NK_C, NK_E), NK_CHIFRE: (NK_CHIFRE, NK_CHIFRE_E)})
        t.px(10, 3, NK_ORELHA)
        t.elipse(10, 16, 2, 4, NK_BARRIGA)
        t.elipse(12, 14, 2, 2, NK)                         # o braço
        t.ret(5, 7, 6, 8, P_); t.px(5, 7, BR)
        t.linha([(3, 10), (6, 10)], NK_E, 1)
        t.pxs([(16, 10), (18, 13), (19, 16)], NK_CHIFRE)
        pes(t, [(9, 21), (10, 21), (11, 21), (15, 21), (16, 21), (17, 21)], NK_E)
    contorno_gba(t)


# ----------------------------------------------------------------- CLEFABLE
CB, CB_C, CB_E = H("f8c0b0"), H("f8d8c8"), H("e89090")
CB_PONTA, CB_ASA = H("504038"), H("d86060")


def clefable(t, lado):
    if lado in ("frente", "costas"):
        t.poli([(3, 1), (9, 7), (6, 10)], CB); t.poli([(21, 1), (15, 7), (18, 10)], CB)   # orelhonas
        if lado == "costas":
            t.poli([(7, 12), (1, 9), (2, 17)], CB_ASA); t.poli([(17, 12), (23, 9), (22, 17)], CB_ASA)   # as asas
        t.elipse(12, 14, 7, 7, CB)
        t.pxs([(4, 13), (3, 14), (20, 13), (21, 14)], CB)
        sombrear(t, {CB: (CB_C, CB_E), CB_ASA: (CB_E, H("985858"))})
        t.pxs([(3, 1), (4, 1), (4, 2), (21, 1), (20, 1), (20, 2)], CB_PONTA)   # a ponta escura da orelha
        if lado == "frente":
            t.poli([(10, 7), (12, 3), (14, 5), (13, 8)], CB_E)   # o cacho da testa
            for x in (9, 15):
                t.ret(x - (1 if x < 12 else 0), 11, x + (0 if x < 12 else 1), 12, P_)
            t.pxs([(6, 14), (7, 14), (17, 14), (18, 14)], H("f8a8a8"))
            t.px(12, 14, H("985858"))
        else:
            t.linha([(16, 19), (19, 16), (21, 18)], CB_E, 1)   # o rabinho enrolado
        pes(t, [(8, 21), (9, 21), (15, 21), (16, 21)], CB_E)
    else:
        t.poli([(17, 11), (23, 8), (22, 16)], CB_ASA)
        t.poli([(9, 0), (14, 7), (8, 9)], CB)
        t.elipse(11, 14, 7, 7, CB)
        sombrear(t, {CB: (CB_C, CB_E), CB_ASA: (CB_E, H("985858"))})
        t.pxs([(9, 0), (10, 1), (9, 1)], CB_PONTA)
        t.poli([(5, 7), (7, 4), (8, 8)], CB_E)
        t.ret(6, 11, 7, 12, P_)
        t.pxs([(4, 14), (5, 14)], H("f8a8a8"))
        pes(t, [(8, 21), (9, 21), (14, 21), (15, 21)], CB_E)
    contorno_gba(t)


# ---------------------------------------------------------------- NINETALES
NT, NT_C, NT_E = H("f0e070"), H("f8e8b0"), H("c89860")
NT_CAUDA = H("e0c068")
NT_OLHO = H("b01000")


def ninetales(t, lado):
    if lado in ("frente", "costas"):
        rabos = ((4, 16), (20, 16), (4, 10), (20, 10)) if lado == "frente" else \
                ((12, 5), (7, 6), (17, 6), (4, 10), (20, 10), (4, 15), (20, 15), (9, 11), (15, 11))
        for x, y in rabos:                                 # o leque de caudas
            t.elipse(x, y, 2, 3, NT_CAUDA)
        t.poli([(6, 2), (10, 7), (7, 9)], NT); t.poli([(18, 2), (14, 7), (17, 9)], NT)   # orelhas
        t.elipse(12, 10, 5, 4, NT)
        t.elipse(12, 18, 4, 3, NT)
        sombrear(t, {NT: (NT_C, NT_E), NT_CAUDA: (NT_C, NT_E)})
        if lado == "frente":
            t.poli([(9, 6), (12, 4), (15, 6), (12, 8)], NT_C)   # o topete
            for x in (9, 15):
                t.ret(x - (1 if x < 12 else 0), 10, x + (0 if x < 12 else 1), 11, NT_OLHO)
            t.px(12, 13, P_)
            t.elipse(12, 16, 3, 1, NT_C)                   # a gola
        else:
            for x, y in ((12, 2), (7, 3), (17, 3), (4, 7), (20, 7)):
                t.px(x, y, H("f86828"))                    # as pontinhas laranja
        pes(t, [(9, 21), (10, 21), (14, 21), (15, 21)], NT_E)
    else:
        for x, y in ((18, 7), (21, 10), (20, 15), (16, 11)):
            t.elipse(x, y, 2, 3, NT_CAUDA)
        t.poli([(7, 4), (11, 8), (7, 11)], NT)
        t.elipse(7, 11, 4, 4, NT)
        t.elipse(12, 18, 5, 3, NT)
        t.linha([(8, 14), (10, 17)], NT, 3)                # o pescoço
        sombrear(t, {NT: (NT_C, NT_E), NT_CAUDA: (NT_C, NT_E)})
        t.ret(4, 10, 5, 11, NT_OLHO)
        t.px(2, 13, P_)
        t.pxs([(18, 4), (22, 8)], H("f86828"))
        pes(t, [(9, 21), (10, 21), (15, 21), (16, 21)], NT_E)
    contorno_gba(t)


# --------------------------------------------------------------- WIGGLYTUFF
WG, WG_C, WG_E = H("f8c0a8"), H("f8d8c8"), H("f09090")
WG_BRANCO, WG_BRANCO_E = H("f8f8f8"), H("e0e0e0")
WG_ORELHA = H("c86860")
WG_OLHO, WG_OLHO_C = H("205860"), H("90d8c8")


def wigglytuff(t, lado):
    if lado in ("frente", "costas"):
        t.poli([(3, 1), (9, 6), (5, 10)], WG); t.poli([(21, 1), (15, 6), (19, 10)], WG)   # orelhas de coelho
        t.elipse(12, 14, 8, 7, WG)                         # o corpo de bola
        sombrear(t, {WG: (WG_C, WG_E)})
        t.poli([(4, 3), (8, 6), (6, 8)], WG_ORELHA); t.poli([(20, 3), (16, 6), (18, 8)], WG_ORELHA)
        if lado == "frente":
            t.elipse(12, 17, 5, 3, WG_BRANCO)              # a barriga branca
            t.px(16, 19, WG_BRANCO_E)
            t.poli([(10, 7), (13, 4), (15, 7), (12, 9)], WG_E)   # o topete
            for x in (8, 16):                              # os olhões verdes
                t.elipse(x, 12, 2, 2, WG_BRANCO); t.ret(x - 1, 12, x, 13, WG_OLHO); t.px(x - 1, 12, WG_OLHO_C)
            t.px(12, 14, WG_ORELHA)
        else:
            t.elipse(12, 6, 2, 2, WG_E)
        pes(t, [(8, 21), (9, 21), (15, 21), (16, 21)], WG_E)
    else:
        t.poli([(10, 0), (15, 7), (9, 8)], WG)
        t.elipse(12, 14, 8, 7, WG)
        sombrear(t, {WG: (WG_C, WG_E)})
        t.poli([(11, 2), (13, 6), (11, 7)], WG_ORELHA)
        t.elipse(7, 17, 3, 3, WG_BRANCO)
        t.poli([(6, 7), (9, 5), (10, 8)], WG_E)
        t.elipse(6, 12, 2, 2, WG_BRANCO); t.ret(5, 12, 6, 13, WG_OLHO); t.px(5, 12, WG_OLHO_C)
        pes(t, [(9, 21), (10, 21), (15, 21), (16, 21)], WG_E)
    contorno_gba(t)


# ------------------------------------------------------------------- GOLBAT
GB, GB_C, GB_E = H("6080c8"), H("88b0e8"), H("383878")
GB_ASA, GB_ASA_C, GB_ASA_E = H("a85098"), H("c868b0"), H("601050")
GB_BOCA = H("903878")


def golbat(t, lado):
    """morcegão voando: sem pé, a bocona aberta"""
    if lado in ("frente", "costas"):
        cor_asa = GB_ASA if lado == "frente" else GB
        t.poli([(8, 9), (0, 2), (0, 13), (3, 11), (5, 15), (8, 13)], cor_asa)
        t.poli([(16, 9), (24, 2), (24, 13), (21, 11), (19, 15), (16, 13)], cor_asa)
        t.poli([(8, 6), (7, 1), (10, 4)], GB); t.poli([(16, 6), (17, 1), (14, 4)], GB)
        t.elipse(12, 11, 6, 7, GB)
        t.linha([(10, 18), (9, 21)], GB, 1); t.linha([(14, 18), (15, 21)], GB, 1)
        sombrear(t, {GB: (GB_C, GB_E), GB_ASA: (GB_ASA_C, GB_ASA_E)})
        if lado == "frente":
            t.linha([(9, 6), (11, 7)], P_, 1); t.linha([(15, 6), (13, 7)], P_, 1)   # olhinhos apertados
            t.elipse(12, 12, 4, 4, P_)                     # a bocona
            t.elipse(12, 13, 2, 2, GB_BOCA)
            t.pxs([(9, 10), (15, 10), (10, 15), (14, 15)], BR)   # os caninos
        else:
            t.linha([(1, 4), (7, 11)], GB_E, 1); t.linha([(23, 4), (17, 11)], GB_E, 1)
    else:
        t.poli([(13, 9), (18, 0), (23, 5), (21, 8), (22, 13), (15, 13)], GB_ASA)
        t.poli([(8, 6), (8, 1), (11, 5)], GB)
        t.elipse(10, 11, 5, 6, GB)
        t.linha([(12, 17), (16, 21)], GB, 1)
        sombrear(t, {GB: (GB_C, GB_E), GB_ASA: (GB_ASA_C, GB_ASA_E)})
        t.linha([(6, 6), (8, 7)], P_, 1)
        t.poli([(4, 9), (8, 11), (8, 14), (4, 15)], P_)
        t.ret(5, 11, 7, 13, GB_BOCA)
        t.pxs([(5, 10), (5, 14)], BR)
        t.linha([(17, 3), (18, 10)], GB_ASA_E, 1)
    contorno_gba(t)


# -------------------------------------------------------------------- GLOOM
GL, GL_C, GL_E = H("485878"), H("7880a0"), H("103048")
PETALA, PETALA_C, PETALA_E = H("a85038"), H("c06828"), H("603000")
GL_PINTA, GL_BABA = H("f87000"), H("d0c8b0")


def gloom(t, lado):
    if lado in ("frente", "costas"):
        t.elipse(12, 16, 6, 5, GL)                         # o corpo azul
        for x, y in ((6, 6), (18, 6), (12, 3), (8, 2), (16, 2)):   # a flor grandona
            t.elipse(x, y + 2, 4, 3, PETALA)
        sombrear(t, {GL: (GL_C, GL_E), PETALA: (PETALA_C, PETALA_E)})
        for x, y in ((5, 8), (19, 8), (12, 4), (8, 3), (16, 3)):
            t.px(x, y, GL_PINTA)
        if lado == "frente":
            for x in (9, 15):
                t.ret(x - 1 if x < 12 else x, 14, x if x < 12 else x + 1, 15, BR); t.px(x, 15, P_)
            t.elipse(12, 18, 2, 1, GL_E)                   # a boca babando
            t.pxs([(13, 19), (13, 20)], GL_BABA)
        pes(t, [(8, 21), (9, 21), (15, 21), (16, 21)], GL_E)
    else:
        t.elipse(11, 16, 6, 5, GL)
        for x, y in ((14, 5), (9, 4), (18, 8), (13, 2)):
            t.elipse(x, y + 2, 4, 3, PETALA)
        sombrear(t, {GL: (GL_C, GL_E), PETALA: (PETALA_C, PETALA_E)})
        for x, y in ((14, 6), (9, 5), (18, 9)):
            t.px(x, y, GL_PINTA)
        t.ret(6, 14, 7, 15, BR); t.px(6, 15, P_)
        t.px(5, 18, GL_E); t.pxs([(5, 19), (5, 20)], GL_BABA)
        pes(t, [(8, 21), (9, 21), (14, 21), (15, 21)], GL_E)
    contorno_gba(t)


# ----------------------------------------------------------------- PARASECT
PS2, PS2_C, PS2_E = H("e83030"), H("f86868"), H("b04030")
PS2_PINTA = H("f8d050")
PSC, PSC_C, PSC_E = H("d86830"), H("f88050"), H("681808")
PS2_OLHO = H("f8f8f8")


def parasect(t, lado):
    """o cogumelão tomou conta: o chapéu cobre quase tudo"""
    if lado in ("frente", "costas"):
        t.elipse(12, 17, 6, 3, PSC)                        # o bicho embaixo
        if lado == "frente":
            t.poli([(6, 16), (1, 15), (3, 19)], PSC); t.poli([(18, 16), (23, 15), (21, 19)], PSC)   # as pinças
        t.elipse(12, 9, 10, 6, PS2)                        # o chapéu
        t.pxs([(4, 14), (20, 14)], PS2)
        sombrear(t, {PS2: (PS2_C, PS2_E), PSC: (PSC_C, PSC_E)})
        for x, y in ((7, 7), (12, 5), (17, 7), (9, 11), (15, 11), (4, 10), (20, 10)):
            t.px(x, y, PS2_PINTA)
        if lado == "frente":
            for x in (9, 15):                              # o olho branco vazio
                t.ret(x - (1 if x < 12 else 0), 16, x + (0 if x < 12 else 1), 17, PS2_OLHO)
            t.pxs([(11, 19), (13, 19)], PSC_E)
        pes(t, [(6, 21), (8, 21), (10, 21), (14, 21), (16, 21), (18, 21)], PSC_E)
    else:
        t.elipse(11, 17, 7, 3, PSC)
        t.poli([(5, 16), (1, 13), (2, 19)], PSC)
        t.elipse(13, 9, 9, 6, PS2)
        t.poli([(4, 10), (2, 15), (7, 13)], PS2)           # a aba caída na frente
        sombrear(t, {PS2: (PS2_C, PS2_E), PSC: (PSC_C, PSC_E)})
        for x, y in ((9, 6), (14, 5), (18, 8), (11, 11), (16, 12)):
            t.px(x, y, PS2_PINTA)
        t.ret(5, 16, 6, 17, PS2_OLHO)
        pes(t, [(6, 21), (8, 21), (12, 21), (15, 21), (17, 21)], PSC_E)
    contorno_gba(t)


DESENHOS = {12: butterfree, 15: beedrill, 20: raticate, 24: arbok, 28: sandslash, 34: nidoking,
            36: clefable, 38: ninetales, 40: wigglytuff, 42: golbat, 44: gloom, 47: parasect}
TAMANHO = {12: 0.95, 15: 0.95, 20: 0.9, 40: 0.95, 44: 0.9}
