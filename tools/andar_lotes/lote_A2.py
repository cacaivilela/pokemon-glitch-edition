"""LOTE A2: PIDGEOT, FEAROW, os NIDO, VILEPLUME, VENOMOTH, DUGTRIO, PERSIAN,
GOLDUCK, PRIMEAPE e ARCANINE."""
from andar_base import *  # noqa: F401,F403


# ------------------------------------------------------------------ PIDGEOT
PT, PT_C, PT_E = H("c89878"), H("e0c0a0"), H("785848")
PT_CREME, PT_CREME_E = H("f0e898"), H("d0c870")
PT_CRISTA, PT_CRISTA_C = H("c04040"), H("e86040")
PT_PE = H("f8a870")


def pidgeot(t, lado):
    if lado == "frente":
        t.poli([(10, 4), (6, 0), (12, 2), (18, 0), (14, 4)], PT_CRISTA)   # a crista comprida
        t.elipse(12, 8, 5, 4, PT)
        t.elipse(12, 16, 7, 5, PT)
        t.poli([(5, 11), (0, 19), (6, 20)], PT); t.poli([(19, 11), (24, 19), (18, 20)], PT)   # asas
        sombrear(t, {PT: (PT_C, PT_E)})
        t.pxs([(9, 1), (12, 2), (15, 1)], PT_CRISTA_C); t.pxs([(11, 3), (12, 3), (13, 3)], PT_CREME)
        t.elipse(12, 17, 4, 4, PT_CREME)
        t.linha([(10, 15), (14, 15)], PT_CREME_E, 1); t.linha([(10, 18), (14, 18)], PT_CREME_E, 1)
        for x, d in ((9, -1), (15, 1)):
            t.pxs([(x, 7), (x, 8)], P_); t.px(x, 7, BR); t.px(x + d, 8, P_)
        t.pxs([(11, 9), (12, 9), (13, 9), (12, 10)], H("604030"))
        pes(t, [(9, 21), (10, 21), (14, 21), (15, 21)], PT_PE)
    elif lado == "costas":
        t.poli([(9, 4), (5, 0), (12, 2), (19, 0), (15, 4)], PT_CRISTA)
        t.elipse(12, 8, 5, 4, PT)
        t.elipse(12, 16, 7, 5, PT)
        t.poli([(9, 19), (5, 23), (12, 21), (19, 23), (15, 19)], PT_CRISTA)   # o rabo de leque
        sombrear(t, {PT: (PT_C, PT_E)})
        t.pxs([(8, 22), (12, 22), (16, 22)], PT_CREME)
        t.linha([(7, 12), (11, 19)], PT_E, 1); t.linha([(17, 12), (13, 19)], PT_E, 1)
        pes(t, [(9, 21), (10, 21), (14, 21), (15, 21)], PT_PE)
    else:
        t.poli([(8, 4), (17, 0), (14, 3), (22, 4), (12, 7)], PT_CRISTA)  # a crista voando pra trás
        t.elipse(8, 8, 5, 4, PT)
        t.elipse(13, 15, 6, 5, PT)
        t.poli([(17, 16), (23, 21), (17, 21)], PT_CRISTA)
        sombrear(t, {PT: (PT_C, PT_E)})
        t.pxs([(15, 2), (16, 2), (19, 3)], PT_CREME)
        t.elipse(10, 16, 3, 3, PT_CREME)
        t.poli([(12, 11), (21, 13), (16, 18)], PT_E)       # a asa
        t.pxs([(3, 8), (2, 9), (3, 9)], H("604030"))
        t.pxs([(5, 7), (5, 8)], P_); t.px(5, 7, BR)
        pes(t, [(11, 21), (12, 21), (14, 21), (15, 21)], PT_PE)
    contorno_gba(t)


# ------------------------------------------------------------------- FEAROW
FE, FE_C, FE_E = H("a87050"), H("d09838"), H("784000")
FE_CREME, FE_CREME_E = H("f8c878"), H("f0b058")
FE_CRISTA = H("c83848")
FE_BICO = H("e8d0a8")


def fearow(t, lado):
    if lado == "frente":
        t.poli([(5, 10), (0, 2), (3, 14), (7, 17)], FE); t.poli([(19, 10), (24, 2), (21, 14), (17, 17)], FE)   # asonas
        t.elipse(12, 7, 4, 4, FE)
        t.linha([(12, 10), (12, 13)], FE, 3)               # o pescoço comprido
        t.elipse(12, 17, 5, 4, FE)
        sombrear(t, {FE: (FE_C, FE_E)})
        t.poli([(10, 4), (12, 0), (14, 4)], FE_CRISTA)     # o topete vermelho
        t.linha([(11, 10), (13, 10)], FE_CRISTA, 1); t.linha([(11, 12), (13, 12)], FE_CRISTA, 1)   # o colar de penas
        t.elipse(12, 17, 3, 3, FE_CREME)
        for x in (10, 14):
            t.pxs([(x, 6), (x, 7)], P_); t.px(x, 6, BR)
        t.linha([(12, 8), (12, 11)], FE_BICO, 1)           # o bicão pra frente
        pes(t, [(10, 21), (14, 21)], FE_CRISTA)
    elif lado == "costas":
        t.poli([(5, 10), (0, 2), (3, 14), (7, 17)], FE); t.poli([(19, 10), (24, 2), (21, 14), (17, 17)], FE)
        t.elipse(12, 7, 4, 4, FE)
        t.linha([(12, 10), (12, 13)], FE, 3)
        t.elipse(12, 17, 5, 4, FE)
        t.poli([(10, 20), (12, 23), (14, 20)], FE_E)
        sombrear(t, {FE: (FE_C, FE_E)})
        t.poli([(10, 4), (12, 0), (14, 4)], FE_CRISTA)
        t.linha([(2, 5), (5, 13)], FE_CREME_E, 1); t.linha([(22, 5), (19, 13)], FE_CREME_E, 1)
        pes(t, [(10, 21), (14, 21)], FE_CRISTA)
    else:
        t.poli([(13, 12), (22, 0), (21, 9), (18, 16)], FE)  # a asa erguida
        t.elipse(9, 6, 4, 4, FE)
        t.linha([(10, 9), (12, 13)], FE, 3)
        t.elipse(14, 16, 5, 4, FE)
        t.poli([(18, 17), (23, 20), (18, 20)], FE_E)
        sombrear(t, {FE: (FE_C, FE_E)})
        t.poli([(10, 3), (14, 0), (13, 4)], FE_CRISTA)
        t.linha([(10, 10), (12, 10)], FE_CRISTA, 1)
        t.elipse(12, 17, 2, 2, FE_CREME)
        t.linha([(0, 8), (5, 7)], FE_BICO, 2)              # o bicão comprido
        t.pxs([(7, 5), (7, 6)], P_); t.px(7, 5, BR)
        pes(t, [(12, 21), (15, 21)], FE_CRISTA)
    contorno_gba(t)


# --------------------------------------------------------- NIDORINA/NIDORINO
NA, NA_C, NA_E = H("88c0c8"), H("c0e0e8"), H("5890b0")
NA_PINTA, NA_ORELHA = H("385860"), H("4880f0")
NO, NO_C, NO_E = H("a878b8"), H("d890c8"), H("684078")
NO_PINTA, NO_ORELHA = H("684078"), H("48c8a0")
CHIFRE = H("f8f8f8")


def nido(cor, claro, escuro, pinta, orelha, olho, chifre):
    """os NIDO de quatro patas: orelhonas, espinhos nas costas e (o macho) o chifre"""
    def desenho(t, lado):
        if lado in ("frente", "costas"):
            t.poli([(6, 9), (2, 1), (9, 6)], cor); t.poli([(18, 9), (22, 1), (15, 6)], cor)   # orelhonas
            t.elipse(12, 10, 6, 5, cor)
            t.elipse(12, 18, 6, 3, cor)
            sombrear(t, {cor: (claro, escuro)})
            t.poli([(4, 6), (3, 2), (7, 6)], orelha); t.poli([(20, 6), (21, 2), (17, 6)], orelha)
            if lado == "frente":
                if chifre:
                    t.poli([(11, 6), (12, 2), (13, 6)], CHIFRE)
                for x in (9, 15):
                    t.pxs([(x, 10), (x, 11)], olho); t.px(x, 10, BR)
                t.pxs([(11, 13), (13, 13)], P_)
                t.pxs([(11, 14), (13, 14)], BR)            # os dentinhos
                t.pxs([(6, 17), (18, 17)], pinta)
            else:
                for x, y in ((10, 9), (14, 9), (12, 12), (9, 16), (15, 16), (12, 18)):
                    t.pxs([(x, y), (x, y - 1)], pinta)     # os espinhos das costas
            pes(t, [(7, 21), (8, 21), (11, 21), (13, 21), (16, 21), (17, 21)], escuro)
        else:
            t.poli([(9, 8), (14, 1), (13, 8)], cor)
            t.elipse(7, 11, 5, 4, cor)
            t.elipse(14, 17, 7, 4, cor)
            sombrear(t, {cor: (claro, escuro)})
            t.poli([(11, 6), (13, 3), (12, 7)], orelha)
            if chifre:
                t.poli([(5, 8), (6, 4), (7, 8)], CHIFRE)
            for x, y in ((11, 13), (14, 13), (17, 14), (20, 15)):
                t.pxs([(x, y), (x, y + 1)], pinta)
            t.pxs([(4, 10), (4, 11)], olho); t.px(4, 10, BR)
            t.pxs([(2, 13), (2, 14)], BR); t.px(1, 12, P_)
            pes(t, [(8, 21), (9, 21), (12, 21), (17, 21), (18, 21), (20, 21)], escuro)
        contorno_gba(t)
    return desenho


nidorina = nido(NA, NA_C, NA_E, NA_PINTA, NA_ORELHA, H("c03030"), False)
nidorino = nido(NO, NO_C, NO_E, NO_PINTA, NO_ORELHA, H("b01800"), True)


# ---------------------------------------------------------------- NIDOQUEEN
NQ, NQ_C, NQ_E = H("6888a8"), H("98d0d8"), H("385058")
NQ_CREME, NQ_CREME_E = H("e0c888"), H("b8a858")


def nidoqueen(t, lado):
    if lado == "frente":
        t.poli([(6, 7), (4, 1), (9, 5)], NQ); t.poli([(18, 7), (20, 1), (15, 5)], NQ)
        t.elipse(12, 7, 6, 5, NQ)
        t.elipse(12, 16, 7, 6, NQ)
        t.pxs([(4, 13), (3, 14), (3, 15), (20, 13), (21, 14), (21, 15)], NQ)
        sombrear(t, {NQ: (NQ_C, NQ_E)})
        t.elipse(12, 17, 4, 4, NQ_CREME)                   # a barriga creme em placas
        t.linha([(9, 16), (15, 16)], NQ_CREME_E, 1); t.linha([(9, 19), (15, 19)], NQ_CREME_E, 1)
        t.elipse(12, 9, 3, 2, NQ_CREME)                    # o focinho
        for x in (9, 15):
            t.pxs([(x, 6), (x, 7)], H("c03030")); t.px(x, 6, BR)
        t.linha([(10, 10), (14, 10)], NQ_E, 1)
        pes(t, [(7, 21), (8, 21), (9, 21), (15, 21), (16, 21), (17, 21)], NQ_E)
    elif lado == "costas":
        t.poli([(6, 7), (4, 1), (9, 5)], NQ); t.poli([(18, 7), (20, 1), (15, 5)], NQ)
        t.elipse(12, 7, 6, 5, NQ)
        t.elipse(12, 16, 7, 6, NQ)
        t.poli([(10, 20), (12, 23), (14, 20)], NQ)         # rabão
        sombrear(t, {NQ: (NQ_C, NQ_E)})
        for y in (11, 14, 17):                             # os espinhos nas costas
            t.pxs([(10, y), (14, y), (12, y + 1)], NQ_E)
        pes(t, [(7, 21), (8, 21), (9, 21), (15, 21), (16, 21), (17, 21)], NQ_E)
    else:
        t.poli([(9, 5), (13, 0), (12, 6)], NQ)
        t.elipse(8, 7, 5, 5, NQ)
        t.poli([(4, 7), (0, 10), (5, 11)], NQ)
        t.elipse(12, 16, 6, 6, NQ)
        t.poli([(16, 17), (23, 21), (17, 21)], NQ)
        sombrear(t, {NQ: (NQ_C, NQ_E)})
        t.elipse(9, 17, 3, 4, NQ_CREME)
        t.linha([(7, 16), (11, 16)], NQ_CREME_E, 1)
        for y in (11, 14, 17):
            t.px(17, y, NQ_E)
        t.pxs([(5, 6), (5, 7)], H("c03030")); t.px(5, 6, BR)
        t.linha([(1, 10), (4, 10)], NQ_E, 1)
        pes(t, [(8, 21), (9, 21), (10, 21), (14, 21), (15, 21)], NQ_E)
    contorno_gba(t)


# ---------------------------------------------------------------- VILEPLUME
VP, VP_C, VP_E = H("e83030"), H("f86060"), H("882018")
VP_PINTA = H("f8c8d0")
VC, VC_C, VC_E = H("404860"), H("586080"), H("182848")      # o corpo azul-escuro


def vileplume(t, lado):
    if lado == "lado":
        t.elipse(13, 16, 5, 5, VC)
        t.elipse(12, 8, 11, 5, VP)                         # a pétala gigante
        sombrear(t, {VP: (VP_C, VP_E), VC: (VC_C, VC_E)})
        t.pxs([(4, 7), (8, 5), (15, 5), (19, 8), (11, 9)], VP_PINTA)
        t.linha([(7, 4), (8, 11)], VP_E, 1); t.linha([(17, 4), (16, 11)], VP_E, 1)
        t.pxs([(9, 15), (9, 16)], P_)
        t.px(8, 18, H("882018"))
        pes(t, [(10, 21), (11, 21), (15, 21), (16, 21)], VC_E)
    else:
        t.elipse(12, 17, 6, 5, VC)
        t.elipse(12, 8, 11, 6, VP)
        sombrear(t, {VP: (VP_C, VP_E), VC: (VC_C, VC_E)})
        t.linha([(12, 2), (12, 14)], VP_E, 1); t.linha([(1, 8), (23, 8)], VP_E, 1)   # as divisões das pétalas
        t.pxs([(5, 5), (8, 4), (16, 4), (19, 5), (6, 11), (18, 11), (9, 12), (15, 12)], VP_PINTA)
        if lado == "frente":
            t.elipse(12, 8, 2, 1, H("c8a838"))             # o miolo
            for x in (9, 15):
                t.pxs([(x, 16), (x, 17)], P_)
            t.elipse(12, 19, 1, 1, H("882018"))            # a boca aberta
        pes(t, [(8, 21), (9, 21), (15, 21), (16, 21)], VC_E)
    contorno_gba(t)


# ----------------------------------------------------------------- VENOMOTH
VM, VM_C, VM_E = H("a888c8"), H("d0a8d8"), H("604870")
VA, VA_C, VA_E = H("e8c0f8"), H("f0d8f8"), H("d0a8d8")       # as asas
VM_OLHO = H("4870c8")


def venomoth(t, lado):
    if lado == "lado":
        t.poli([(10, 13), (16, 0), (23, 4), (22, 12), (14, 16)], VA)   # as asas pra cima
        t.elipse(8, 9, 4, 4, VM)
        t.elipse(11, 16, 3, 4, VM)
        t.linha([(7, 5), (4, 1)], VM_E, 1)
        sombrear(t, {VM: (VM_C, VM_E), VA: (VA_C, VA_E)})
        t.linha([(14, 9), (20, 4)], VA_E, 1)
        t.pxs([(15, 13), (21, 9)], VM)
        t.elipse(5, 9, 1, 2, VM_OLHO); t.px(5, 8, BR)
        t.linha([(9, 19), (14, 19)], H("a08068"), 1)
        pes(t, [(10, 21), (13, 21)], VM_E)
    else:
        t.poli([(10, 12), (0, 2), (1, 12), (8, 17)], VA); t.poli([(14, 12), (24, 2), (23, 12), (16, 17)], VA)
        t.elipse(12, 8, 5, 4, VM)
        t.elipse(12, 16, 3, 4, VM)
        t.linha([(9, 5), (6, 0)], VM_E, 1); t.linha([(15, 5), (18, 0)], VM_E, 1)   # as antenas
        sombrear(t, {VM: (VM_C, VM_E), VA: (VA_C, VA_E)})
        t.linha([(2, 4), (9, 13)], VA_E, 1); t.linha([(22, 4), (15, 13)], VA_E, 1)   # as nervuras
        t.pxs([(3, 9), (21, 9), (5, 14), (19, 14)], VM)
        if lado == "frente":
            for x in (9, 15):                              # os olhões azuis
                t.elipse(x, 8, 1, 2, VM_OLHO); t.px(x, 7, BR)
            t.linha([(10, 18), (14, 18)], H("a08068"), 1)
        pes(t, [(10, 21), (14, 21)], VM_E)
    contorno_gba(t)


# ------------------------------------------------------------------ DUGTRIO
DT, DT_C, DT_E = H("c07840"), H("e0a060"), H("a05040")
DT_TERRA, DT_TERRA_E = H("b0a870"), H("807848")
DT_NARIZ = H("f86858")


def dugtrio(t, lado):
    t.elipse(12, 21, 11, 2, DT_TERRA)                      # o monte de terra
    for x, y in ((5, 10), (19, 10)):                       # os dois de trás, mais altos
        t.elipse(x, y, 3, 4, DT); t.ret(x - 3, y, x + 3, 20, DT)
    t.elipse(12, 13, 5, 5, P_); t.ret(7, 13, 17, 20, P_)   # a borda preta do da frente
    t.elipse(12, 13, 4, 4, DT); t.ret(8, 13, 16, 20, DT)
    sombrear(t, {DT: (DT_C, DT_E), DT_TERRA: (DT_TERRA, DT_TERRA_E)})
    t.pxs([(2, 21), (9, 22), (15, 22), (21, 21)], DT_TERRA_E)
    if lado == "frente":
        for x, y in ((5, 10), (19, 10), (12, 13)):
            t.pxs([(x - 1, y - 1), (x - 1, y), (x + 1, y - 1), (x + 1, y)], P_)   # olhos de 2px de altura
            t.pxs([(x - 1, y + 2), (x, y + 2), (x + 1, y + 2)], DT_NARIZ)
    elif lado == "lado":
        for x, y in ((5, 10), (19, 10), (12, 13)):
            t.pxs([(x - 2, y - 1), (x - 2, y)], P_)
            t.pxs([(x - 3, y + 2), (x - 2, y + 2)], DT_NARIZ)
    contorno_gba(t)


# ------------------------------------------------------------------ PERSIAN
PE, PE_C, PE_E = H("f8e080"), H("f8f8a8"), H("d8b050")
PE_MARROM = H("805000")
PE_JOIA = H("a01000")


def persian(t, lado):
    if lado == "frente":
        t.poli([(6, 8), (5, 1), (10, 5)], PE); t.poli([(18, 8), (19, 1), (14, 5)], PE)
        t.elipse(12, 9, 6, 5, PE)
        t.elipse(12, 18, 5, 3, PE)
        t.linha([(9, 14), (9, 21)], PE, 2); t.linha([(15, 14), (15, 21)], PE, 2)   # as patas compridas
        sombrear(t, {PE: (PE_C, PE_E)})
        t.pxs([(6, 3), (6, 4), (18, 3), (18, 4)], PE_MARROM)
        t.elipse(12, 5, 1, 1, PE_JOIA); t.px(12, 5, H("f86060"))   # a joia vermelha
        for x in (9, 15):
            t.linha([(x - 1, 9), (x + 1, 8)] if x < 12 else [(x - 1, 8), (x + 1, 9)], P_, 1)   # olho fino de gato
            t.px(x, 10, PE_JOIA)
        t.pxs([(12, 11), (11, 12), (13, 12)], PE_MARROM)
        t.linha([(3, 11), (6, 11)], P_, 1); t.linha([(21, 11), (18, 11)], P_, 1)   # bigodes
        pes(t, [(8, 21), (9, 21), (15, 21), (16, 21)], PE_E)
    elif lado == "costas":
        t.poli([(6, 8), (5, 1), (10, 5)], PE); t.poli([(18, 8), (19, 1), (14, 5)], PE)
        t.elipse(12, 9, 6, 5, PE)
        t.elipse(12, 17, 6, 4, PE)
        t.linha([(14, 19), (20, 17), (21, 12), (18, 11)], PE, 2)   # o rabo enrolado
        sombrear(t, {PE: (PE_C, PE_E)})
        t.pxs([(6, 3), (18, 3)], PE_MARROM)
        pes(t, [(8, 21), (9, 21), (15, 21), (16, 21)], PE_E)
    else:
        t.poli([(8, 3), (12, 6), (8, 8)], PE)
        t.elipse(7, 9, 5, 4, PE)
        t.elipse(14, 15, 7, 4, PE)
        t.linha([(9, 17), (8, 21)], PE, 2); t.linha([(18, 17), (19, 21)], PE, 2)
        t.linha([(20, 14), (23, 10), (21, 7)], PE, 2)
        sombrear(t, {PE: (PE_C, PE_E)})
        t.px(9, 5, PE_MARROM)
        t.px(4, 6, PE_JOIA)
        t.linha([(3, 8), (5, 9)], P_, 1)
        t.linha([(0, 10), (3, 11)], P_, 1)
        pes(t, [(7, 21), (8, 21), (19, 21), (20, 21)], PE_E)
    contorno_gba(t)


# ------------------------------------------------------------------ GOLDUCK
GD, GD_C, GD_E = H("7878b0"), H("a0c0f8"), H("305068")
GD_AZUL = H("88a8d0")
GD_BICO, GD_BICO_E = H("f8f8a0"), H("d0d068")
GD_JOIA = H("c03030")


def golduck(t, lado):
    if lado == "frente":
        t.poli([(10, 3), (12, 0), (14, 3)], GD)            # o topete
        t.elipse(12, 7, 5, 5, GD)
        t.elipse(12, 16, 5, 5, GD)
        t.linha([(7, 14), (4, 17)], GD, 2); t.linha([(17, 14), (20, 17)], GD, 2)
        sombrear(t, {GD: (GD_C, GD_E)})
        t.elipse(12, 5, 1, 1, GD_JOIA)                     # a joia da testa
        t.elipse(12, 10, 3, 2, GD_BICO); t.linha([(10, 11), (14, 11)], GD_BICO_E, 1)
        for x in (9, 15):
            t.pxs([(x, 7), (x, 8)], GD_JOIA); t.px(x, 7, BR)
        t.elipse(12, 17, 2, 3, GD_AZUL)
        pes(t, [(8, 21), (9, 21), (10, 21), (14, 21), (15, 21), (16, 21)], GD_BICO_E)
    elif lado == "costas":
        t.poli([(10, 3), (12, 0), (14, 3)], GD)
        t.elipse(12, 7, 5, 5, GD)
        t.elipse(12, 16, 5, 5, GD)
        t.poli([(14, 18), (20, 15), (18, 20)], GD)         # o rabo
        sombrear(t, {GD: (GD_C, GD_E)})
        t.linha([(12, 13), (12, 19)], GD_AZUL, 1)
        pes(t, [(8, 21), (9, 21), (15, 21), (16, 21)], GD_BICO_E)
    else:
        t.poli([(9, 3), (14, 0), (13, 4)], GD)
        t.elipse(9, 7, 5, 5, GD)
        t.elipse(12, 16, 5, 5, GD)
        t.poli([(16, 17), (22, 14), (20, 20)], GD)
        t.linha([(9, 14), (6, 17)], GD, 2)
        sombrear(t, {GD: (GD_C, GD_E)})
        t.px(8, 4, GD_JOIA)
        t.poli([(5, 8), (0, 9), (0, 11), (5, 11)], GD_BICO); t.linha([(0, 11), (5, 11)], GD_BICO_E, 1)   # o bico comprido
        t.pxs([(6, 6), (6, 7)], GD_JOIA); t.px(6, 6, BR)
        pes(t, [(10, 21), (11, 21), (14, 21), (15, 21)], GD_BICO_E)
    contorno_gba(t)


# ----------------------------------------------------------------- PRIMEAPE
PM, PM_C, PM_E = H("e0b888"), H("f8e0b0"), H("c88858")
PM_MARROM, PM_MARROM_E = H("986840"), H("583000")
PM_NARIZ = H("e09888")


def primeape(t, lado):
    if lado == "lado":
        t.elipse(18, 11, 2, 2, PM_MARROM)                  # o punho de trás
        t.elipse(11, 13, 8, 7, PM)
        sombrear(t, {PM: (PM_C, PM_E)})
        t.elipse(5, 15, 3, 2, PM_MARROM)                   # o punho pra frente
        t.px(15, 6, PM_E); t.px(16, 7, PM_E)
        t.elipse(5, 12, 2, 2, PM_NARIZ); t.px(4, 12, P_)
        t.linha([(5, 9), (8, 10)], P_, 1); t.px(7, 10, BR)
        pes(t, [(9, 21), (10, 21), (14, 21), (15, 21)], PM_MARROM)
    else:
        t.elipse(12, 12, 8, 8, PM)                         # a bola de pelo
        t.pxs([(5, 5), (6, 4), (18, 4), (19, 5)], PM)      # os tufos
        sombrear(t, {PM: (PM_C, PM_E)})
        t.elipse(3, 13, 2, 2, PM_MARROM); t.elipse(21, 13, 2, 2, PM_MARROM)   # os punhos
        if lado == "frente":
            for x, d in ((9, 1), (15, -1)):                # a cara de bravo
                t.linha([(x - 2 * d, 8), (x + d, 10)], P_, 1); t.px(x, 11, P_)
            t.elipse(12, 13, 2, 2, PM_NARIZ); t.pxs([(11, 13), (13, 13)], PM_MARROM_E)
            t.linha([(9, 16), (15, 16)], PM_MARROM_E, 1)
        pes(t, [(8, 21), (9, 21), (15, 21), (16, 21)], PM_MARROM)
    contorno_gba(t)


# ----------------------------------------------------------------- ARCANINE
AR, AR_C, AR_E = H("e87030"), H("f89868"), H("a86020")
AP, AP_C, AP_E = H("f8f090"), H("f8f8c0"), H("e8c070")       # a juba creme
AR_LISTRA = H("601000")


def arcanine(t, lado):
    if lado == "frente":
        t.elipse(12, 16, 9, 6, AP)                         # o peito felpudo
        t.poli([(5, 6), (6, 1), (9, 5)], AR); t.poli([(19, 6), (18, 1), (15, 5)], AR)
        t.elipse(12, 9, 6, 5, AR)
        t.elipse(12, 4, 3, 2, AP)                          # o topete
        t.linha([(8, 17), (8, 21)], AR, 3); t.linha([(16, 17), (16, 21)], AR, 3)
        sombrear(t, {AR: (AR_C, AR_E), AP: (AP_C, AP_E)})
        t.elipse(12, 11, 3, 2, AP)                         # o focinho creme
        for x in (9, 15):
            t.pxs([(x, 8), (x, 9)], P_); t.px(x, 8, BR)
        t.px(12, 10, P_)
        t.linha([(5, 9), (7, 10)], AR_LISTRA, 1); t.linha([(19, 9), (17, 10)], AR_LISTRA, 1)
        t.pxs([(7, 18), (17, 18)], AR_LISTRA)
        pes(t, [(7, 21), (8, 21), (9, 21), (15, 21), (16, 21), (17, 21)], AR_E)
    elif lado == "costas":
        t.elipse(12, 15, 8, 6, AR)
        t.poli([(5, 6), (6, 1), (9, 5)], AR); t.poli([(19, 6), (18, 1), (15, 5)], AR)
        t.elipse(12, 9, 6, 5, AP)                          # a juba atrás da cabeça
        t.elipse(12, 19, 3, 3, AP)                         # o rabo felpudo
        sombrear(t, {AR: (AR_C, AR_E), AP: (AP_C, AP_E)})
        for x in (6, 9, 15, 18):                           # as listras pretas
            t.linha([(x, 13), (x + (1 if x < 12 else -1), 16)], AR_LISTRA, 1)
        pes(t, [(5, 21), (6, 21), (7, 21), (17, 21), (18, 21), (19, 21)], AR_E)
    else:
        t.elipse(19, 13, 4, 4, AP)                         # o rabo
        t.elipse(14, 15, 7, 5, AR)
        t.elipse(8, 12, 5, 6, AP)                          # a juba
        t.elipse(6, 8, 4, 4, AR)
        t.poli([(3, 8), (0, 10), (4, 11)], AR)
        t.poli([(7, 5), (10, 1), (10, 6)], AR)
        t.linha([(8, 18), (8, 21)], AR, 2); t.linha([(18, 18), (18, 21)], AR, 2)
        sombrear(t, {AR: (AR_C, AR_E), AP: (AP_C, AP_E)})
        t.pxs([(4, 7), (4, 8)], P_); t.px(4, 7, BR)
        t.px(0, 10, P_)
        for x in (13, 16, 19):
            t.linha([(x, 11), (x - 1, 14)], AR_LISTRA, 1)
        pes(t, [(7, 21), (8, 21), (9, 21), (17, 21), (18, 21), (19, 21)], AR_E)
    contorno_gba(t)


DESENHOS = {18: pidgeot, 22: fearow, 30: nidorina, 31: nidoqueen, 33: nidorino,
            45: vileplume, 49: venomoth, 51: dugtrio, 53: persian, 55: golduck,
            57: primeape, 59: arcanine}
TAMANHO = {30: 0.82, 33: 0.82, 45: 0.88, 53: 0.92, 57: 0.85}
