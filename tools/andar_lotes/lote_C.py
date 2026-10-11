"""LOTE C: Bellsprout, Tentacool, Geodude, Ponyta, Magnemite, Doduo, Seel,
Grimer, Shellder, Gastly, Onix e Drowzee andando no mapa."""
from andar_base import *  # noqa: F401,F403


# --------------------------------------------------------------- BELLSPROUT
BS, BS_C, BS_E = H("f8e870"), H("f0f8b8"), H("d8c070")
BS_BOCA, BS_BOCA_E = H("e87040"), H("a03820")
BS_CAULE, BS_CAULE_E = H("987020"), H("684000")
BS_FO, BS_FO_C, BS_FO_E = H("70a830"), H("98d048"), H("506028")


def folha(t, base, ponta, larg):
    """uma folha: da base no caule até a ponta, gordinha no meio"""
    (x0, y0), (x1, y1) = base, ponta
    mx, my = (x0 + x1) / 2, (y0 + y1) / 2
    t.poli([(x0, y0), (mx, my - larg), (x1, y1), (mx, my + larg)], BS_FO)


def bellsprout(t, lado):
    if lado == "frente":
        folha(t, (12, 15), (4, 12), 3); folha(t, (12, 16), (20, 13), 3)     # as duas folhas
        t.linha([(12, 9), (12, 20)], BS_CAULE, 1)                           # o caule fininho
        t.elipse(12, 6, 6, 5, BS)                                           # a cabeça-sino
        sombrear(t, {BS: (BS_C, BS_E), BS_FO: (BS_FO_C, BS_FO_E)})
        t.linha([(6, 13), (11, 15)], BS_FO_E, 1); t.linha([(13, 16), (18, 15)], BS_FO_E, 1)   # a nervura
        olhinho(t, 9, 4); olhinho(t, 15, 4)
        t.elipse(12, 8, 2, 2, BS_BOCA); t.px(12, 8, BS_BOCA_E); t.px(11, 7, H("f8a878"))   # a boca redonda
        pes(t, [(10, 21), (11, 21), (13, 21), (14, 21)], BS_CAULE_E)       # as raízes
    elif lado == "costas":
        folha(t, (12, 15), (4, 12), 3); folha(t, (12, 16), (20, 13), 3)
        t.linha([(12, 9), (12, 20)], BS_CAULE, 1)
        t.elipse(12, 6, 6, 5, BS)
        sombrear(t, {BS: (BS_C, BS_E), BS_FO: (BS_FO_C, BS_FO_E)})
        t.linha([(6, 13), (11, 15)], BS_FO_E, 1); t.linha([(13, 16), (18, 15)], BS_FO_E, 1)
        pes(t, [(10, 21), (11, 21), (13, 21), (14, 21)], BS_CAULE_E)
    else:
        folha(t, (13, 14), (20, 10), 3)                                     # a folha de trás
        t.linha([(12, 10), (14, 13), (13, 17), (12, 20)], BS_CAULE, 1)      # o caule curvo
        folha(t, (13, 16), (4, 16), 3)                                      # a da frente
        t.elipse(11, 6, 6, 5, BS)
        t.elipse(5, 8, 2, 2, BS)                                            # o bico da boca
        sombrear(t, {BS: (BS_C, BS_E), BS_FO: (BS_FO_C, BS_FO_E)})
        t.linha([(7, 17), (12, 16)], BS_FO_E, 1)
        olhinho(t, 9, 4)
        t.elipse(4, 8, 1, 2, BS_BOCA); t.px(3, 8, BS_BOCA_E)               # a boca aberta pra frente
        pes(t, [(11, 21), (12, 21), (14, 21)], BS_CAULE_E)
    contorno_gba(t)


# ---------------------------------------------------------------- TENTACOOL
TC, TC_C, TC_E = H("68b0e0"), H("90d0f0"), H("3878b0")
TC_RUBI, TC_RUBI_C, TC_RUBI_E = H("f85048"), H("f8b0a8"), H("b02820")
TC_PE, TC_PE_C, TC_PE_E = H("808040"), H("b0a870"), H("505020")
TC_BICO = H("d0d8e8")


def tentacool(t, lado):
    if lado in ("frente", "costas"):
        t.linha([(9, 13), (8, 17), (6, 20)], TC_PE, 2)                     # os dois tentáculos
        t.linha([(15, 13), (16, 17), (18, 20)], TC_PE, 2)
        t.elipse(12, 8, 7, 6, TC)                                           # o domo
        t.elipse(12, 13, 4, 2, TC)
        sombrear(t, {TC: (TC_C, TC_E), TC_PE: (TC_PE_C, TC_PE_E)})
        for x in (8, 16):                                                   # os rubis dos lados
            t.elipse(x, 9, 2, 2, TC_RUBI); t.px(x + 1, 10, TC_RUBI_E); t.px(x - 1, 8, TC_RUBI_C)
        if lado == "frente":
            t.px(12, 13, TC_RUBI); t.px(12, 12, TC_RUBI_C)                  # a jóia do meio
            olhinho(t, 10, 12, brilho=False); olhinho(t, 14, 12, brilho=False)   # os olhinhos
            t.linha([(11, 15), (13, 15)], TC_BICO, 1)
        else:
            t.linha([(12, 3), (12, 12)], TC_C, 1)                           # o domo liso, transparente
    else:
        t.linha([(10, 13), (9, 17), (7, 20)], TC_PE, 2)
        t.linha([(14, 13), (15, 17), (17, 20)], TC_PE, 2)
        t.elipse(13, 8, 6, 6, TC)
        t.elipse(9, 13, 4, 2, TC)
        sombrear(t, {TC: (TC_C, TC_E), TC_PE: (TC_PE_C, TC_PE_E)})
        t.elipse(10, 9, 2, 2, TC_RUBI); t.px(11, 10, TC_RUBI_E); t.px(9, 8, TC_RUBI_C)
        olhinho(t, 6, 11, brilho=False)
        t.linha([(5, 14), (7, 14)], TC_BICO, 1)
    contorno_gba(t)


# ------------------------------------------------------------------ GEODUDE
GD, GD_C, GD_E = H("a8b060"), H("c8d080"), H("788058")
GD_FENDA = H("404810")


def geodude(t, lado):
    if lado in ("frente", "costas"):
        t.linha([(8, 12), (4, 10)], GD, 2); t.linha([(16, 12), (20, 10)], GD, 2)   # os braços
        t.elipse(4, 8, 3, 3, GD); t.elipse(20, 8, 3, 3, GD)                 # os punhos
        t.elipse(12, 13, 6, 6, GD)                                          # a pedra
        sombrear(t, {GD: (GD_C, GD_E)})
        t.pxs([(3, 7), (3, 8), (5, 7), (5, 8), (19, 7), (19, 8), (21, 7), (21, 8)], GD_FENDA)   # os dedos do punho
        if lado == "frente":
            t.linha([(8, 10), (11, 12)], GD_FENDA, 1); t.linha([(16, 10), (13, 12)], GD_FENDA, 1)   # a testa brava
            olhinho(t, 10, 12); olhinho(t, 14, 12)
            t.linha([(10, 16), (14, 16)], GD_FENDA, 1)
        else:
            t.pxs([(10, 10), (11, 11), (14, 15), (15, 15), (9, 16)], GD_FENDA)    # as rachaduras
    else:
        t.linha([(14, 11), (18, 7)], GD, 2); t.elipse(18, 6, 3, 3, GD)     # o braço de trás, pra cima
        t.elipse(13, 13, 6, 6, GD)
        t.linha([(10, 14), (5, 13)], GD, 2); t.elipse(4, 12, 3, 3, GD)     # o punho da frente
        sombrear(t, {GD: (GD_C, GD_E)})
        t.pxs([(3, 11), (3, 12), (5, 11), (5, 12)], GD_FENDA)
        t.linha([(8, 10), (10, 11)], GD_FENDA, 1)
        olhinho(t, 9, 12)
        t.pxs([(15, 16), (16, 15), (16, 10)], GD_FENDA)
    contorno_gba(t)


# ------------------------------------------------------------------- PONYTA
PO, PO_C, PO_E = H("f8e878"), H("f8f0b0"), H("e8c868")
FO_, FO_C_, FO_E_ = H("f86000"), H("f8e020"), H("d00000")
PO_CASCO = H("585858")
PO_OLHO = H("885018")


def fogo(t, pontos):
    """uma labareda: o contorno no laranja (o sombrear dá o amarelo e o vermelho)"""
    t.poli(pontos, FO_)


def ponyta(t, lado):
    if lado == "frente":
        fogo(t, [(7, 9), (5, 3), (8, 5), (9, 0), (12, 3), (15, 0), (16, 5), (19, 3), (17, 9)])   # a crina
        fogo(t, [(17, 14), (22, 10), (21, 15), (23, 16), (18, 18)])        # o rabo aparecendo
        t.elipse(12, 16, 5, 3, PO)                                          # o corpo atrás
        t.ret(8, 17, 9, 20, PO); t.ret(15, 17, 16, 20, PO)                  # as patas da frente
        t.elipse(12, 9, 4, 4, PO)                                           # a cabeça
        t.elipse(12, 13, 2, 2, PO)                                          # o focinho
        t.pxs([(8, 5), (16, 5)], PO)                                        # as orelhas
        sombrear(t, {PO: (PO_C, PO_E), FO_: (FO_C_, FO_E_)})
        olhinho(t, 10, 9, PO_OLHO); olhinho(t, 14, 9, PO_OLHO)
        t.pxs([(11, 14), (13, 14)], PO_E)                                   # as narinas
        pes(t, [(8, 21), (9, 21), (15, 21), (16, 21)], PO_CASCO)
    elif lado == "costas":
        fogo(t, [(12, 18), (9, 20), (10, 15), (12, 13), (14, 15), (15, 20)])   # o rabo de fogo
        t.elipse(12, 15, 5, 3, PO)
        t.ret(8, 17, 9, 20, PO); t.ret(15, 17, 16, 20, PO)
        t.elipse(12, 8, 4, 4, PO)
        t.pxs([(8, 4), (16, 4)], PO)
        fogo(t, [(9, 3), (10, 0), (12, 2), (14, 0), (15, 3), (14, 12), (12, 15), (10, 12)])   # a crina descendo
        sombrear(t, {PO: (PO_C, PO_E), FO_: (FO_C_, FO_E_)})
        t.linha([(12, 3), (12, 11)], FO_C_, 1)
        pes(t, [(8, 21), (9, 21), (15, 21), (16, 21)], PO_CASCO)
    else:
        fogo(t, [(17, 13), (23, 8), (21, 12), (23, 14), (20, 17)])          # o rabo
        t.elipse(14, 15, 5, 3, PO)                                          # o corpo
        t.ret(10, 16, 11, 20, PO); t.ret(16, 16, 17, 20, PO)                # as patas
        t.poli([(8, 9), (11, 8), (12, 14), (9, 15)], PO)                    # o pescoço
        t.elipse(7, 8, 4, 3, PO)                                            # a cabeça
        t.elipse(3, 10, 2, 2, PO)                                           # o focinho
        t.px(8, 4, PO)                                                      # a orelha
        fogo(t, [(9, 4), (11, 0), (12, 4), (16, 3), (14, 7), (16, 10), (12, 13), (10, 7)])   # a crina
        sombrear(t, {PO: (PO_C, PO_E), FO_: (FO_C_, FO_E_)})
        olhinho(t, 6, 7, PO_OLHO)
        t.px(2, 10, PO_E)
        pes(t, [(10, 21), (11, 21), (16, 21), (17, 21)], PO_CASCO)
    contorno_gba(t)



# ---------------------------------------------------------------- MAGNEMITE
MG, MG_C, MG_E = H("90b898"), H("d0f0d8"), H("588060")
IMA, IMA_C = H("605050"), H("888888")
IMA_V, IMA_A = H("f86040"), H("50c8f0")
PARAFUSO, PARAFUSO_E = H("e0e0e0"), H("b0b0b0")


def ima(t, x, d):
    """o ímã em U de um lado (d = -1 esquerda, 1 direita): as pontas vermelha e azul pra fora"""
    for y in (9, 13):
        t.linha([(x, y), (x + 3 * d, y)], IMA, 1); t.linha([(x, y + 1), (x + 3 * d, y + 1)], IMA, 1)
    t.ret(min(x, x + d), 9, max(x, x + d), 14, IMA)
    t.px(x, 11, IMA_C)
    t.pxs([(x + 3 * d, 9), (x + 3 * d, 10)], IMA_V); t.pxs([(x + 3 * d, 13), (x + 3 * d, 14)], IMA_A)


def magnemite(t, lado):
    if lado in ("frente", "costas"):
        t.ret(11, 2, 13, 6, PARAFUSO)                                       # o parafuso de cima
        t.linha([(9, 15), (8, 18)], PARAFUSO, 2); t.linha([(15, 15), (16, 18)], PARAFUSO, 2)   # os de baixo
        t.elipse(12, 11, 5, 5, MG)                                          # a bola de aço
        ima(t, 6, -1); ima(t, 18, 1)
        sombrear(t, {MG: (MG_C, MG_E), PARAFUSO: (PARAFUSO, PARAFUSO_E)})
        t.linha([(11, 3), (13, 3)], PARAFUSO_E, 1); t.linha([(11, 5), (13, 5)], PARAFUSO_E, 1)   # a rosca
        if lado == "frente":
            t.elipse(12, 10, 2, 2, BR); t.px(12, 10, P_); t.px(12, 11, P_)   # o olhão
        else:
            t.pxs([(10, 9), (14, 9), (10, 13), (14, 13)], MG_E)              # os rebites
    else:
        t.ret(11, 2, 13, 6, PARAFUSO)
        t.linha([(10, 15), (9, 18)], PARAFUSO, 2); t.linha([(15, 15), (16, 18)], PARAFUSO, 2)
        t.elipse(12, 11, 5, 5, MG)
        sombrear(t, {MG: (MG_C, MG_E), PARAFUSO: (PARAFUSO, PARAFUSO_E)})
        t.linha([(11, 3), (13, 3)], PARAFUSO_E, 1); t.linha([(11, 5), (13, 5)], PARAFUSO_E, 1)
        t.elipse(9, 10, 1, 2, BR); t.pxs([(8, 10), (8, 11)], P_)             # o olho de lado
        t.ret(13, 10, 18, 11, IMA); t.ret(17, 10, 18, 14, IMA)              # o ímã virado pra gente
        t.ret(13, 13, 18, 14, IMA)
        t.pxs([(13, 10), (13, 11)], IMA_V); t.pxs([(13, 13), (13, 14)], IMA_A)
    contorno_gba(t)


# -------------------------------------------------------------------- DODUO
DD, DD_C, DD_E = H("b88850"), H("d0a068"), H("906040")
DD_BICO, DD_BICO_E = H("e8d8a8"), H("c8b080")
DD_PERNA = H("c8b080")
DD_PESCOCO = H("584020")


def cabeca_doduo(t, x, y, bico):
    t.elipse(x, y, 3, 3, DD)
    if bico == "baixo":
        t.poli([(x - 1, y + 2), (x, y + 6), (x + 1, y + 2)], DD_BICO)       # o bico comprido pra baixo
    else:
        t.poli([(x - 2, y), (x - 7, y + 2), (x - 2, y + 2)], DD_BICO)       # o bico pra esquerda


def doduo(t, lado):
    if lado in ("frente", "costas"):
        t.linha([(10, 13), (7, 8)], DD_PESCOCO, 1); t.linha([(14, 13), (17, 7)], DD_PESCOCO, 1)   # os pescoços
        t.linha([(10, 18), (10, 20)], DD_PERNA, 1); t.linha([(14, 18), (14, 20)], DD_PERNA, 1)    # as pernas finas
        t.elipse(12, 15, 5, 4, DD)                                          # o corpo redondo
        if lado == "frente":
            cabeca_doduo(t, 7, 6, "baixo"); cabeca_doduo(t, 17, 5, "baixo")
        else:
            t.elipse(7, 6, 3, 3, DD); t.elipse(17, 5, 3, 3, DD)
            t.poli([(10, 18), (12, 21), (14, 18)], DD)                      # o rabinho
        sombrear(t, {DD: (DD_C, DD_E), DD_BICO: (DD_BICO, DD_BICO_E)})
        if lado == "frente":
            olhinho(t, 6, 5); olhinho(t, 8, 5); olhinho(t, 16, 4); olhinho(t, 18, 4)
        else:
            t.pxs([(11, 13), (13, 13), (12, 15)], DD_E)                    # as penas
        pes(t, [(9, 21), (10, 21), (11, 21), (13, 21), (14, 21), (15, 21)], DD_BICO_E)
    else:
        t.linha([(14, 12), (15, 5)], DD_PESCOCO, 1); t.linha([(11, 13), (8, 9)], DD_PESCOCO, 1)
        t.linha([(12, 18), (12, 20)], DD_PERNA, 1); t.linha([(15, 18), (15, 20)], DD_PERNA, 1)
        t.elipse(14, 15, 5, 4, DD)
        cabeca_doduo(t, 16, 3, "esq")                                      # a de trás, mais alta
        cabeca_doduo(t, 8, 9, "esq")
        sombrear(t, {DD: (DD_C, DD_E), DD_BICO: (DD_BICO, DD_BICO_E)})
        olhinho(t, 15, 2); olhinho(t, 7, 8)
        t.pxs([(15, 14), (17, 15), (16, 17)], DD_E)
        pes(t, [(11, 21), (12, 21), (14, 21), (15, 21)], DD_BICO_E)
    contorno_gba(t)


# --------------------------------------------------------------------- SEEL
SE, SE_C, SE_E = H("e0e0f0"), H("f8f8f8"), H("a8a8c8")
SE_FOCINHO, SE_FOCINHO_E = H("f8e0b0"), H("c8b888")
SE_LINGUA = H("f87868")


def seel(t, lado):
    if lado in ("frente", "costas"):
        t.poli([(9, 18), (5, 22), (2, 20)], SE); t.poli([(15, 18), (19, 22), (22, 20)], SE)   # as nadadeiras
        t.elipse(12, 16, 6, 5, SE)                                          # o corpo
        t.elipse(12, 8, 6, 5, SE)                                           # a cabeça
        t.poli([(11, 4), (12, 1), (13, 4)], SE)                             # o chifrinho
        sombrear(t, {SE: (SE_C, SE_E)})
        if lado == "frente":
            olhinho(t, 9, 7); olhinho(t, 15, 7)
            t.elipse(12, 11, 3, 2, SE_FOCINHO); t.px(12, 10, SE_FOCINHO_E)   # o focinho de bigode
            t.pxs([(11, 13), (12, 13), (12, 14)], SE_LINGUA)                # a língua pra fora
        else:
            t.poli([(10, 20), (12, 23), (14, 20)], SE_E)                    # o rabo
    else:
        t.poli([(18, 18), (23, 13), (23, 19)], SE)                          # o rabo pra cima
        t.elipse(14, 17, 7, 4, SE)                                          # o corpo comprido
        t.elipse(8, 10, 5, 5, SE)
        t.poli([(8, 6), (9, 2), (10, 6)], SE)
        t.poli([(9, 18), (6, 22), (12, 21)], SE)                            # a nadadeira da frente
        sombrear(t, {SE: (SE_C, SE_E)})
        olhinho(t, 6, 9)
        t.elipse(4, 12, 2, 2, SE_FOCINHO); t.px(3, 11, SE_FOCINHO_E)
        t.pxs([(3, 14), (4, 14)], SE_LINGUA)
    contorno_gba(t)


# ------------------------------------------------------------------- GRIMER
GR, GR_C, GR_E = H("906898"), H("c098b0"), H("583070")
GR_BOCA = H("381848")


def grimer(t, lado):
    t.elipse(12, 19, 10, 3, GR)                                             # a poça de lodo
    if lado == "lado":
        t.elipse(11, 12, 6, 7, GR)
        t.elipse(5, 9, 2, 3, GR); t.elipse(17, 12, 2, 3, GR)                # os bracinhos
    else:
        t.elipse(12, 12, 6, 7, GR)
        t.elipse(5, 9, 2, 3, GR); t.elipse(19, 12, 2, 3, GR)
    t.pxs([(3, 21), (21, 20), (8, 21), (16, 21)], GR)                       # os pingos
    sombrear(t, {GR: (GR_C, GR_E)})
    if lado == "frente":
        for x in (10, 14):                                                  # os olhões vazios
            t.elipse(x, 9, 1, 1, BR); t.px(x, 9, P_)
        t.elipse(12, 14, 3, 2, GR_BOCA); t.pxs([(11, 13), (13, 13)], H("e0b8d8"))   # a bocona
    elif lado == "lado":
        t.elipse(8, 9, 1, 1, BR); t.px(7, 9, P_)
        t.elipse(7, 14, 2, 2, GR_BOCA)
    else:
        t.pxs([(9, 8), (14, 11), (11, 15), (16, 16)], H("e0b8d8"))            # o brilho do lodo
    contorno_gba(t)



# ----------------------------------------------------------------- SHELLDER
SH, SH_C, SH_E = H("b088b8"), H("d0b0e0"), H("583860")
SH_DENTRO = H("282030")
SH_LINGUA, SH_LINGUA_C = H("c04048"), H("f86028")


def shellder(t, lado):
    if lado == "frente":
        t.poli([(3, 8), (1, 13), (4, 15)], SH); t.poli([(21, 8), (23, 13), (20, 15)], SH)   # os espinhos
        t.elipse(12, 9, 9, 6, SH)                                           # a concha de cima
        t.elipse(12, 16, 8, 4, SH)                                          # a de baixo
        sombrear(t, {SH: (SH_C, SH_E)})
        for x in (8, 12, 16):
            t.linha([(x, 4), (x, 8)], SH_E, 1)                              # os gomos da concha
        t.elipse(12, 13, 6, 3, SH_DENTRO)                                   # aberta: o bichinho preto
        t.elipse(9, 12, 1, 1, BR); t.elipse(15, 12, 1, 1, BR)
        t.px(10, 12, P_); t.px(14, 12, P_)
        t.poli([(11, 14), (13, 14), (14, 19), (12, 20)], SH_LINGUA); t.px(12, 15, SH_LINGUA_C)   # a língua
    elif lado == "costas":
        t.poli([(3, 8), (1, 13), (4, 15)], SH); t.poli([(21, 8), (23, 13), (20, 15)], SH)
        t.elipse(12, 12, 9, 8, SH)
        sombrear(t, {SH: (SH_C, SH_E)})
        for x0, x1 in ((12, 12), (8, 6), (16, 18)):
            t.linha([(12, 7), (x1, 18)], SH_E, 1)
        t.anel(12, 7, 2, 2, SH_E, 1)                                        # o miolo da concha
    else:
        t.poli([(18, 6), (23, 4), (21, 9)], SH); t.poli([(18, 17), (23, 19), (21, 14)], SH)
        t.poli([(4, 10), (10, 3), (17, 3), (20, 8), (20, 15), (17, 20), (10, 20), (4, 15), (9, 12)], SH)   # a concha de lado, aberta
        sombrear(t, {SH: (SH_C, SH_E)})
        t.linha([(12, 5), (17, 8)], SH_E, 1); t.linha([(12, 18), (17, 15)], SH_E, 1)
        t.poli([(5, 11), (9, 7), (12, 12), (9, 16), (5, 14)], SH_DENTRO)
        t.elipse(8, 10, 1, 1, BR); t.px(7, 10, P_)
        t.poli([(6, 13), (2, 15), (3, 17), (7, 14)], SH_LINGUA); t.px(3, 16, SH_LINGUA_C)
    contorno_gba(t)


# ------------------------------------------------------------------- GASTLY
GA, GA_C, GA_E = H("503058"), H("704868"), H("281830")
GAS, GAS_C, GAS_E = H("b890b0"), H("d0a8c8"), H("886080")
GA_OLHO = H("d85038")


def gastly(t, lado):
    for x, y, r in ((5, 5, 3), (18, 4, 2), (20, 11, 3), (4, 14, 2), (6, 18, 2), (17, 18, 3),
                    (12, 19, 2), (11, 3, 2), (2, 9, 1), (22, 16, 1)):
        t.elipse(x, y, r, r, GAS)                                           # o gás em volta, desigual
    t.elipse(12, 11, 7, 7, GAS)
    cx = 11 if lado == "lado" else 12
    t.elipse(cx, 11, 6, 6, GA)                                              # a bola escura no meio
    sombrear(t, {GAS: (GAS_C, GAS_E), GA: (GA_C, GA_E)})
    if lado == "frente":
        for x, d in ((10, 1), (14, -1)):                                    # o olhar mau
            t.poli([(x - 3 * d, 7), (x + d, 10), (x - 2 * d, 11)], BR); t.px(x - d, 10, P_)
        t.linha([(9, 13), (15, 13)], GA_E, 1); t.linha([(10, 14), (14, 14)], GA_E, 1)   # a bocona
        t.pxs([(9, 13), (15, 13)], BR)                                      # as presinhas
        t.px(12, 14, GA_OLHO)
    elif lado == "lado":
        t.poli([(6, 7), (9, 10), (6, 11)], BR); t.px(7, 10, P_)
        t.linha([(7, 13), (10, 13)], GA_E, 1); t.px(7, 13, BR)
    contorno_gba(t)


# --------------------------------------------------------------------- ONIX
OX, OX_C, OX_E = H("b8b0b0"), H("e8e0e0"), H("788068")
OX_JUNTA = H("504848")


def pedra(t, x, y, r):
    """um gomo da corrente de pedra: o redondo com a junta escura em volta"""
    t.elipse(x, y, r, r, OX)
    t.anel(x, y, r, r, OX_JUNTA, 1)
    t.px(x - 1, y - 1, OX_C); t.px(x - r + 1, y, OX_C)


def onix(t, lado):
    if lado == "frente":
        for x, y, r in ((7, 19, 2), (4, 15, 2), (5, 11, 3), (9, 18, 3), (15, 19, 3), (19, 16, 3), (18, 11, 3), (14, 9, 3)):
            pedra(t, x, y, r)                                               # a corrente enrolada atrás
        t.poli([(12, 0), (13, 3), (11, 3)], OX)                             # o chifre
        t.elipse(12, 6, 4, 3, OX); t.elipse(12, 10, 3, 3, OX)               # a cabeçona comprida
        sombrear(t, {OX: (OX_C, OX_E)})
        t.linha([(9, 6), (11, 7)], OX_JUNTA, 1); t.linha([(15, 6), (13, 7)], OX_JUNTA, 1)   # a testa
        olhinho(t, 10, 7); olhinho(t, 14, 7)
        t.linha([(11, 11), (13, 11)], OX_JUNTA, 1)
    elif lado == "costas":
        for x, y, r in ((12, 20, 2), (16, 19, 2), (19, 15, 3), (16, 11, 3), (9, 18, 3), (5, 14, 3), (7, 10, 3)):
            pedra(t, x, y, r)
        t.elipse(12, 6, 4, 4, OX)
        t.poli([(11, 3), (12, 0), (13, 3)], OX)
        sombrear(t, {OX: (OX_C, OX_E)})
        t.linha([(12, 3), (12, 9)], OX_E, 1)                                # a crista de pedra
        pedra(t, 12, 12, 2)                                                 # o pescoço saindo pra trás
    else:
        for x, y, r in ((21, 6, 2), (20, 11, 3), (17, 16, 3), (12, 19, 3), (6, 18, 2), (13, 12, 3)):
            pedra(t, x, y, r)
        t.poli([(12, 2), (16, 0), (13, 4)], OX)                             # o chifre pra trás
        t.poli([(2, 8), (5, 4), (11, 3), (13, 7), (11, 10), (4, 10)], OX)    # a cabeça de lado
        sombrear(t, {OX: (OX_C, OX_E)})
        t.linha([(5, 6), (8, 7)], OX_JUNTA, 1)
        olhinho(t, 6, 7, brilho=True)
        t.linha([(2, 9), (6, 9)], OX_JUNTA, 1)                              # a boca
    contorno_gba(t)


# ------------------------------------------------------------------ DROWZEE
DR, DR_C, DR_E = H("f8d840"), H("f8e890"), H("d8b828")
DM, DM_C, DM_E = H("906840"), H("b88850"), H("685028")


def drowzee(t, lado):
    if lado in ("frente", "costas"):
        t.elipse(12, 16, 6, 5, DM)                                          # a parte de baixo marrom
        t.ret(7, 19, 9, 20, DM); t.ret(15, 19, 17, 20, DM)                  # as perninhas
        t.poli([(6, 15), (6, 12), (9, 10), (15, 10), (18, 12), (18, 15)], DR)   # o peito amarelo
        t.elipse(12, 7, 5, 4, DR)                                           # a cabeça
        t.pxs([(5, 12), (4, 13), (19, 12), (20, 13)], DR)                   # os braços
        sombrear(t, {DR: (DR_C, DR_E), DM: (DM_C, DM_E)})
        if lado == "frente":
            t.ret(11, 9, 13, 13, DR); t.linha([(13, 9), (13, 13)], DR_E, 1)   # a tromba
            t.pxs([(10, 9), (14, 9)], DR_E)
            t.px(11, 10, DR_C)
            t.linha([(8, 6), (10, 7)], P_, 1); t.linha([(16, 6), (14, 7)], P_, 1)   # o olhar sonolento
            t.pxs([(11, 13), (13, 13)], DM_E)                              # as narinas
        else:
            t.pxs([(9, 4), (15, 4)], DR_E)                                   # as orelhinhas
        pes(t, [(7, 21), (8, 21), (9, 21), (15, 21), (16, 21), (17, 21)], DR_E)
    else:
        t.elipse(13, 16, 6, 5, DM)
        t.ret(10, 19, 12, 20, DM); t.ret(15, 19, 17, 20, DM)
        t.poli([(7, 15), (7, 11), (10, 9), (16, 9), (19, 12), (19, 14)], DR)
        t.elipse(11, 7, 5, 4, DR)
        t.poli([(7, 8), (3, 10), (3, 12), (5, 12), (8, 10)], DR)            # a tromba pra frente
        t.pxs([(6, 13), (5, 14)], DR)                                       # o braço
        sombrear(t, {DR: (DR_C, DR_E), DM: (DM_C, DM_E)})
        t.linha([(4, 10), (7, 9)], DM_E, 1); t.px(3, 11, DM_E)               # a tromba marcada
        t.linha([(8, 6), (10, 7)], P_, 1)
        t.px(14, 4, DR_E)
        pes(t, [(10, 21), (11, 21), (12, 21), (15, 21), (16, 21), (17, 21)], DR_E)
    contorno_gba(t)


DESENHOS = {69: bellsprout, 72: tentacool, 74: geodude, 77: ponyta,
            81: magnemite, 84: doduo, 86: seel, 88: grimer,
            90: shellder, 92: gastly, 95: onix, 96: drowzee}
TAMANHO = {69: 0.8, 72: 0.85, 74: 0.8, 77: 0.95, 81: 0.8, 84: 0.95, 86: 0.9, 88: 0.85,
           90: 0.7, 92: 0.9, 95: 1, 96: 0.95}
