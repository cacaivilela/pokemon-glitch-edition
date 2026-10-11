"""LOTE B3: GRAVELER, GOLEM, FARFETCH'D, MAROWAK, HITMONLEE, HITMONCHAN,
LICKITUNG, WEEZING, RHYDON, TANGELA, KANGASKHAN — andando no mapa."""
from andar_base import *  # noqa: F401,F403


def olhos2(t, xs, y, cor=P_, alto=2, brilho=True):
    """olhos de 2 de largura (sobrevivem ao encolher)"""
    for x in xs:
        t.ret(x, y, x + 1, y + alto - 1, cor)
        if brilho:
            t.px(x, y, BR)


# ----------------------------------------------------------------- GRAVELER
GV, GV_C, GV_E = H("708050"), H("a0b070"), H("504810")
GV_BOCA = H("b82038")


def graveler(t, lado):
    """a pedra com quatro braços"""
    if lado in ("frente", "costas"):
        for x, y in ((3, 9), (21, 9), (3, 16), (21, 16)):  # os quatro braços
            t.elipse(x, y, 2, 2, GV)
        t.linha([(5, 10), (8, 12)], GV, 2); t.linha([(19, 10), (16, 12)], GV, 2)
        t.linha([(5, 16), (8, 15)], GV, 2); t.linha([(19, 16), (16, 15)], GV, 2)
        t.elipse(12, 12, 7, 7, GV)                         # o corpo de pedra
        t.pxs([(7, 5), (12, 4), (17, 5), (5, 12), (19, 12)], GV)   # as pontas da rocha
        sombrear(t, {GV: (GV_C, GV_E)})
        for x, y in ((9, 6), (15, 7), (7, 15), (16, 16), (12, 18)):   # as rachaduras
            t.pxs([(x, y), (x + 1, y)], GV_E)
        if lado == "frente":
            t.linha([(8, 9), (10, 10)], P_, 1); t.linha([(16, 9), (14, 10)], P_, 1)
            olhos2(t, (8, 14), 10, alto=2)
            t.ret(10, 14, 14, 15, GV_BOCA); t.linha([(10, 14), (14, 14)], P_, 1)   # a boca
        pes(t, [(8, 21), (9, 21), (15, 21), (16, 21)], GV_E)
    else:
        t.elipse(5, 10, 2, 2, GV); t.elipse(5, 16, 2, 2, GV)
        t.elipse(13, 12, 7, 7, GV)
        t.pxs([(13, 4), (18, 6), (20, 12)], GV)
        sombrear(t, {GV: (GV_C, GV_E)})
        t.elipse(7, 11, 2, 2, GV); t.elipse(8, 16, 2, 2, GV)   # os braços da frente
        t.pxs([(8, 13), (9, 18)], GV_E)
        for x, y in ((14, 7), (17, 14), (12, 17)):
            t.pxs([(x, y), (x + 1, y)], GV_E)
        olhos2(t, (9,), 8, alto=2)
        t.ret(7, 12, 8, 13, GV_BOCA)
        pes(t, [(10, 21), (11, 21), (15, 21), (16, 21)], GV_E)
    contorno_gba(t)


# -------------------------------------------------------------------- GOLEM
GO_CASCO, GO_CASCO_C, GO_CASCO_E = H("90a060"), H("b0b860"), H("485010")
GO, GO_C, GO_E = H("988838"), H("d0b058"), H("504008")


def golem(t, lado):
    if lado == "frente":
        t.elipse(12, 12, 10, 9, GO_CASCO)                  # o casco de pedra
        t.elipse(12, 12, 4, 3, GO)                         # a cara saindo do casco
        t.elipse(4, 16, 2, 3, GO); t.elipse(20, 16, 2, 3, GO)   # os braços
        sombrear(t, {GO_CASCO: (GO_CASCO_C, GO_CASCO_E), GO: (GO_C, GO_E)})
        t.linha([(6, 6), (9, 9)], GO_CASCO_E, 1); t.linha([(18, 6), (15, 9)], GO_CASCO_E, 1)
        t.linha([(12, 3), (12, 8)], GO_CASCO_E, 1)
        olhos2(t, (9, 13), 11, alto=2)
        t.linha([(11, 14), (13, 14)], GO_E, 1)
        pes(t, [(7, 21), (8, 21), (16, 21), (17, 21)], GO_E)
    elif lado == "costas":
        t.elipse(12, 12, 10, 9, GO_CASCO)
        t.elipse(4, 16, 2, 3, GO); t.elipse(20, 16, 2, 3, GO)
        sombrear(t, {GO_CASCO: (GO_CASCO_C, GO_CASCO_E), GO: (GO_C, GO_E)})
        for pts in ([(5, 7), (9, 10), (15, 10), (19, 7)], [(9, 10), (8, 15), (12, 18), (16, 15), (15, 10)],
                    [(12, 3), (12, 7)], [(4, 13), (8, 15)], [(20, 13), (16, 15)]):
            t.linha(pts, GO_CASCO_E, 1)                    # as placas do casco
        pes(t, [(7, 21), (8, 21), (16, 21), (17, 21)], GO_E)
    else:
        t.elipse(13, 12, 9, 9, GO_CASCO)
        t.elipse(5, 13, 4, 3, GO)                          # cabeça pra fora
        t.elipse(10, 17, 2, 3, GO)
        sombrear(t, {GO_CASCO: (GO_CASCO_C, GO_CASCO_E), GO: (GO_C, GO_E)})
        t.linha([(10, 5), (14, 9), (19, 7)], GO_CASCO_E, 1); t.linha([(14, 9), (15, 16)], GO_CASCO_E, 1)
        olhos2(t, (3,), 11, alto=2)
        t.linha([(2, 15), (4, 15)], GO_E, 1)
        pes(t, [(8, 21), (9, 21), (16, 21), (17, 21)], GO_E)
    contorno_gba(t)


# ---------------------------------------------------------------- FARFETCH'D
FF, FF_C, FF_E = H("b09050"), H("e0a858"), H("885828")
FF_CREME, FF_CREME_E = H("e0e0a0"), H("c0c080")
FF_BICO = H("f8d858")
ALHO, ALHO_C, ALHO_E = H("78c840"), H("c8f888"), H("488018")


def farfetchd(t, lado):
    """o pato com o alho-poró"""
    if lado in ("frente", "costas"):
        t.elipse(12, 8, 5, 5, FF)                          # cabeça
        t.elipse(12, 16, 6, 5, FF)                         # corpo
        t.poli([(17, 13), (22, 10), (21, 17)], FF)         # a asa segurando o alho
        sombrear(t, {FF: (FF_C, FF_E)})
        t.linha([(20, 4), (21, 13)], ALHO, 2)              # o alho-poró
        t.pxs([(20, 4), (21, 5)], ALHO_C); t.pxs([(21, 12), (21, 13)], ALHO_E)
        if lado == "frente":
            t.elipse(12, 16, 4, 4, FF_CREME)               # o peito claro
            t.linha([(8, 7), (16, 7)], P_, 1)              # a faixa preta do olho
            olhos2(t, (9, 14), 7, alto=2)
            t.poli([(10, 10), (14, 10), (12, 13)], FF_BICO)   # o bico
        else:
            t.linha([(10, 12), (12, 18), (14, 12)], FF_E, 1)
        pes(t, [(9, 21), (10, 21), (14, 21), (15, 21)], FF_BICO)
    else:
        t.elipse(8, 8, 5, 5, FF)
        t.elipse(13, 16, 6, 5, FF)
        t.poli([(18, 15), (23, 18), (19, 19)], FF)         # o rabo
        sombrear(t, {FF: (FF_C, FF_E)})
        t.elipse(10, 17, 3, 3, FF_CREME)
        t.linha([(14, 13), (18, 17)], FF_E, 1)             # a asa
        t.linha([(4, 7), (8, 7)], P_, 1)
        olhos2(t, (5,), 7, alto=2)
        t.poli([(3, 10), (0, 11), (3, 12)], FF_BICO)
        t.linha([(14, 2), (12, 15)], ALHO, 2)              # o alho debaixo da asa
        t.pxs([(14, 2), (14, 3)], ALHO_C)
        pes(t, [(11, 21), (12, 21), (15, 21), (16, 21)], FF_BICO)
    contorno_gba(t)


# ------------------------------------------------------------------ MAROWAK
MW2, MW2_C, MW2_E = H("a07030"), H("c09848"), H("603818")
OSSO, OSSO_C, OSSO_E = H("e0e0d0"), H("f8f8f8"), H("c0c0a8")
MW2_BARRIGA = H("d8b868")


def osso(t, pontos):
    t.linha(pontos, OSSO, 1)
    for x, y in (pontos[0], pontos[-1]):
        t.elipse(x, y, 1, 1, OSSO)


def marowak(t, lado):
    if lado in ("frente", "costas"):
        t.elipse(12, 17, 5, 4, MW2)
        t.pxs([(6, 15), (5, 16), (18, 15), (19, 16)], MW2)
        if lado == "costas":
            t.poli([(15, 19), (21, 21), (20, 17)], MW2)    # o rabo
        t.elipse(12, 8, 6, 6, OSSO)                        # o crânio
        t.pxs([(6, 3), (7, 3), (6, 4), (18, 3), (17, 3), (18, 4)], OSSO)   # os chifrinhos
        osso(t, [(20, 8), (20, 18)])                       # o porrete de osso
        sombrear(t, {MW2: (MW2_C, MW2_E), OSSO: (OSSO_C, OSSO_E)})
        if lado == "frente":
            for x in (8, 14):                              # os buracos do crânio
                t.ret(x, 7, x + 2, 9, P_); t.px(x + 1, 8, H("e05038"))
            t.pxs([(11, 11), (13, 11)], OSSO_E)
            t.elipse(12, 18, 3, 2, MW2_BARRIGA)
            t.linha([(11, 13), (13, 13)], MW2, 1)          # o focinho saindo
        else:
            t.linha([(8, 5), (12, 3), (16, 5)], OSSO_E, 1)
        pes(t, [(9, 21), (10, 21), (14, 21), (15, 21)], MW2_E)
    else:
        t.poli([(15, 18), (22, 20), (21, 16)], MW2)
        t.elipse(12, 17, 5, 4, MW2)
        t.elipse(10, 8, 6, 6, OSSO)
        t.pxs([(13, 2), (14, 2), (14, 3)], OSSO)
        t.elipse(4, 11, 2, 2, MW2)                         # o focinho
        sombrear(t, {MW2: (MW2_C, MW2_E), OSSO: (OSSO_C, OSSO_E)})
        osso(t, [(6, 10), (8, 19)])
        t.ret(6, 7, 8, 9, P_); t.px(7, 8, H("e05038"))
        t.elipse(10, 18, 2, 2, MW2_BARRIGA)
        pes(t, [(10, 21), (11, 21), (14, 21), (15, 21)], MW2_E)
    contorno_gba(t)


# ---------------------------------------------------------------- HITMONLEE
HL, HL_C, HL_E = H("c8a080"), H("e0b090"), H("a07858")
HL_FAIXA, HL_FAIXA_E = H("e0e0b8"), H("c0b8a0")


def hitmonlee(t, lado):
    """o chutador: cabeça oval sem pescoço, pernas compridas"""
    if lado in ("frente", "costas"):
        t.elipse(12, 9, 5, 7, HL)                          # o corpo-cabeça
        t.linha([(7, 9), (4, 14)], HL, 2); t.linha([(17, 9), (20, 14)], HL, 2)   # braços
        t.elipse(4, 15, 2, 2, HL_FAIXA); t.elipse(20, 15, 2, 2, HL_FAIXA)   # as mãos enfaixadas
        t.linha([(10, 15), (9, 20)], HL, 2); t.linha([(14, 15), (15, 20)], HL, 2)   # as pernonas
        sombrear(t, {HL: (HL_C, HL_E), HL_FAIXA: (HL_FAIXA, HL_FAIXA_E)})
        t.linha([(9, 18), (10, 18)], HL_FAIXA_E, 1); t.linha([(15, 18), (16, 18)], HL_FAIXA_E, 1)
        if lado == "frente":
            olhos2(t, (9, 14), 6, alto=2)
            t.linha([(8, 5), (11, 6)], P_, 1); t.linha([(16, 5), (13, 6)], P_, 1)
            t.linha([(11, 10), (13, 10)], HL_E, 1)
        pes(t, [(8, 21), (9, 21), (10, 21), (14, 21), (15, 21), (16, 21)], HL_FAIXA_E)
    else:
        t.elipse(11, 9, 5, 7, HL)
        t.linha([(9, 10), (6, 14)], HL, 2)
        t.linha([(11, 15), (9, 20)], HL, 2); t.linha([(13, 15), (15, 20)], HL, 2)
        sombrear(t, {HL: (HL_C, HL_E)})
        t.elipse(5, 15, 2, 2, HL_FAIXA)
        olhos2(t, (7,), 6, alto=2)
        t.linha([(6, 5), (9, 6)], P_, 1)
        pes(t, [(7, 21), (8, 21), (9, 21), (15, 21), (16, 21), (17, 21)], HL_FAIXA_E)
    contorno_gba(t)


# --------------------------------------------------------------- HITMONCHAN
HC, HC_C, HC_E = H("c8b078"), H("e8d098"), H("a08850")
LUVA, LUVA_C, LUVA_E = H("e06038"), H("f89058"), H("b83010")
SAIA, SAIA_C, SAIA_E = H("a090a0"), H("c0b0c0"), H("706070")


def hitmonchan(t, lado):
    """o boxeador: as luvas vermelhas e a sainha roxa"""
    if lado in ("frente", "costas"):
        t.elipse(12, 6, 4, 4, HC)                          # cabeça
        t.poli([(10, 1), (12, 0), (14, 1), (12, 3)], HC)   # o topete
        t.elipse(12, 12, 4, 3, HC)
        t.poli([(8, 14), (16, 14), (17, 18), (7, 18)], SAIA)   # a sainha
        t.linha([(10, 18), (9, 20)], HC, 2); t.linha([(14, 18), (15, 20)], HC, 2)
        t.elipse(5, 11, 3, 3, LUVA); t.elipse(19, 11, 3, 3, LUVA)   # as luvas
        sombrear(t, {HC: (HC_C, HC_E), LUVA: (LUVA_C, LUVA_E), SAIA: (SAIA_C, SAIA_E)})
        if lado == "frente":
            olhos2(t, (9, 14), 5, alto=2)
            t.linha([(11, 8), (13, 8)], HC_E, 1)
            t.linha([(9, 12), (15, 12)], HC_E, 1)          # o peito
        pes(t, [(8, 21), (9, 21), (15, 21), (16, 21)], HC_E)
    else:
        t.elipse(11, 6, 4, 4, HC)
        t.poli([(11, 1), (14, 1), (14, 4)], HC)
        t.elipse(12, 12, 3, 3, HC)
        t.poli([(8, 14), (16, 14), (17, 18), (7, 18)], SAIA)
        t.linha([(11, 18), (9, 20)], HC, 2); t.linha([(13, 18), (15, 20)], HC, 2)
        sombrear(t, {HC: (HC_C, HC_E), SAIA: (SAIA_C, SAIA_E)})
        t.elipse(5, 11, 3, 3, LUVA)                        # a luva lá na frente
        sombrear(t, {LUVA: (LUVA_C, LUVA_E)})
        olhos2(t, (8,), 5, alto=2)
        pes(t, [(8, 21), (9, 21), (15, 21), (16, 21)], HC_E)
    contorno_gba(t)


# ---------------------------------------------------------------- LICKITUNG
LK, LK_C, LK_E = H("f8a080"), H("f8c8b0"), H("e86850")
LK_BARRIGA, LK_BARRIGA_E = H("f8f8a0"), H("e0d070")
LINGUA, LINGUA_E = H("e04818"), H("901000")


def lickitung(t, lado):
    """a linguona pendurada até o chão"""
    if lado in ("frente", "costas"):
        t.elipse(12, 15, 8, 6, LK)                         # o corpão
        t.elipse(12, 7, 5, 4, LK)                          # cabeça
        t.elipse(4, 13, 2, 2, LK); t.elipse(20, 13, 2, 2, LK)
        if lado == "costas":
            t.poli([(15, 18), (22, 20), (20, 15)], LK)     # o rabo
        sombrear(t, {LK: (LK_C, LK_E)})
        if lado == "frente":
            t.elipse(12, 16, 5, 4, LK_BARRIGA)
            t.anel(12, 16, 2, 2, LK_BARRIGA_E, 1)          # o redemoinho da barriga
            olhos2(t, (9, 14), 6, alto=2)
            t.linha([(12, 9), (12, 16), (10, 19)], LINGUA, 3)   # a língua
            t.linha([(12, 10), (11, 18)], LINGUA_E, 1)
        else:
            t.anel(12, 15, 3, 2, LK_BARRIGA_E, 1)
        pes(t, [(6, 21), (7, 21), (8, 21), (16, 21), (17, 21), (18, 21)], LK_E)
    else:
        t.poli([(17, 17), (23, 20), (22, 14)], LK)
        t.elipse(13, 15, 7, 6, LK)
        t.elipse(8, 7, 5, 4, LK)
        sombrear(t, {LK: (LK_C, LK_E)})
        t.elipse(9, 16, 3, 4, LK_BARRIGA)
        olhos2(t, (6,), 6, alto=2)
        t.linha([(3, 9), (2, 14), (5, 18)], LINGUA, 3)
        t.linha([(3, 10), (3, 15)], LINGUA_E, 1)
        pes(t, [(9, 21), (10, 21), (16, 21), (17, 21)], LK_E)
    contorno_gba(t)


# ------------------------------------------------------------------ WEEZING
WZ, WZ_C, WZ_E = H("b06888"), H("d090a8"), H("884060")
WZ_CAVEIRA, WZ_GAS = H("f8e000"), H("e0c838")
WZ_BOCA = H("602840")


def weezing(t, lado):
    """duas bolas de gás flutuando, sem pé"""
    if lado in ("frente", "costas"):
        t.elipse(15, 10, 7, 7, WZ)                         # a bola grande
        t.elipse(6, 16, 5, 5, WZ)                          # a pequena
        t.linha([(9, 15), (11, 13)], WZ, 2)                # o tubo entre elas
        for x, y in ((14, 2), (21, 4), (2, 10), (11, 19)):
            t.pxs([(x, y), (x + 1, y), (x, y + 1)], WZ)    # os biquinhos de gás
        sombrear(t, {WZ: (WZ_C, WZ_E)})
        for x, y in ((22, 17), (19, 20), (1, 22), (13, 21)):   # nuvenzinhas de gás
            t.pxs([(x, y), (x + 1, y)], WZ_GAS)
        if lado == "frente":
            olhos2(t, (12, 17), 7, alto=2, brilho=False)
            t.linha([(11, 6), (13, 7)], P_, 1); t.linha([(19, 6), (17, 7)], P_, 1)
            t.ret(12, 11, 18, 13, WZ_BOCA); t.pxs([(13, 11), (15, 11), (17, 11)], BR)   # a boca com dente
            t.ret(4, 15, 4, 16, P_); t.ret(7, 15, 7, 16, P_)
            t.linha([(5, 18), (7, 18)], WZ_BOCA, 1)
        else:
            t.anel(15, 11, 2, 2, WZ_CAVEIRA, 1)            # a caveira amarela
            t.anel(6, 16, 1, 1, WZ_CAVEIRA, 1)
    else:
        t.elipse(11, 10, 7, 7, WZ)
        t.elipse(17, 16, 5, 5, WZ)
        t.pxs([(10, 2), (11, 2), (3, 8), (21, 12)], WZ)
        sombrear(t, {WZ: (WZ_C, WZ_E)})
        for x, y in ((2, 18), (5, 21), (22, 22)):
            t.pxs([(x, y), (x + 1, y)], WZ_GAS)
        olhos2(t, (6,), 7, alto=2, brilho=False)
        t.ret(4, 11, 7, 13, WZ_BOCA); t.px(5, 11, BR)
        t.anel(12, 11, 1, 1, WZ_CAVEIRA, 1)
        t.ret(14, 15, 14, 16, P_)
    contorno_gba(t)


# ------------------------------------------------------------------- RHYDON
RH, RH_C, RH_E = H("888890"), H("c0c0b8"), H("585860")
RH_BARRIGA, RH_BARRIGA_E = H("d8d8d0"), H("b0a070")
RH_CHIFRE = H("f8f8f8")


def rhydon(t, lado):
    if lado in ("frente", "costas"):
        if lado == "costas":
            t.poli([(13, 17), (21, 20), (22, 14), (17, 15)], RH)   # o rabão
        t.elipse(12, 16, 7, 6, RH)
        t.elipse(4, 14, 2, 3, RH); t.elipse(20, 14, 2, 3, RH)
        t.elipse(12, 7, 5, 4, RH)                          # cabeça
        t.pxs([(7, 3), (7, 4), (17, 3), (17, 4)], RH)      # as orelhas
        if lado == "frente":
            t.poli([(11, 6), (12, 1), (13, 6)], RH_CHIFRE)   # o chifre de broca
        sombrear(t, {RH: (RH_C, RH_E), RH_CHIFRE: (RH_CHIFRE, RH_BARRIGA_E)})
        if lado == "frente":
            t.elipse(12, 17, 4, 4, RH_BARRIGA)
            t.linha([(9, 16), (15, 16)], RH_BARRIGA_E, 1); t.linha([(9, 18), (15, 18)], RH_BARRIGA_E, 1)
            olhos2(t, (8, 15), 6, alto=2, cor=H("e05038"))
            t.pxs([(9, 7), (15, 7)], P_)
            t.linha([(10, 10), (14, 10)], RH_E, 1)
        else:
            for y in (7, 11, 14):                          # os espinhos das costas
                t.pxs([(12, y), (12, y + 1)], RH_C); t.px(12, y + 2, RH_E)
        pes(t, [(7, 21), (8, 21), (9, 21), (15, 21), (16, 21), (17, 21)], RH_E)
    else:
        t.poli([(16, 18), (23, 20), (23, 14)], RH)
        t.elipse(13, 15, 6, 6, RH)
        t.elipse(7, 8, 5, 4, RH)
        t.pxs([(10, 3), (10, 4)], RH)
        t.poli([(3, 6), (2, 1), (5, 5)], RH_CHIFRE)
        sombrear(t, {RH: (RH_C, RH_E), RH_CHIFRE: (RH_CHIFRE, RH_BARRIGA_E)})
        t.elipse(10, 16, 2, 4, RH_BARRIGA)
        t.elipse(12, 14, 2, 2, RH)
        olhos2(t, (6,), 6, alto=2, cor=H("e05038"))
        t.px(7, 7, P_)
        t.linha([(2, 10), (5, 10)], RH_E, 1)
        t.pxs([(17, 10), (19, 13)], RH_C)
        pes(t, [(9, 21), (10, 21), (11, 21), (15, 21), (16, 21), (17, 21)], RH_E)
    contorno_gba(t)


# ------------------------------------------------------------------ TANGELA
TA, TA_C, TA_E = H("407890"), H("80b8d0"), H("204050")
TA_PE, TA_PE_E = H("d04050"), H("902828")


def tangela(t, lado):
    """o novelo de cipós com os sapatinhos vermelhos"""
    t.elipse(12, 12, 8, 8, TA)
    for x, y in ((3, 7), (21, 8), (5, 18), (19, 18), (8, 3), (16, 3), (2, 13), (22, 13)):
        t.pxs([(x, y), (x + 1, y), (x, y + 1)], TA)        # as pontas dos cipós
    sombrear(t, {TA: (TA_C, TA_E)})
    for pts in ([(6, 8), (10, 6), (13, 9)], [(14, 5), (18, 9), (17, 13)], [(5, 13), (9, 16), (8, 19)],
                [(15, 16), (18, 15), (19, 18)], [(10, 18), (13, 15)]):
        t.linha(pts, TA_E, 1)                              # o emaranhado
    if lado == "frente":
        t.elipse(12, 11, 5, 2, P_)                         # o vão escuro dos olhos
        for x in (9, 14):
            t.ret(x, 10, x + 1, 12, BR); t.px(x + 1 if x < 12 else x, 11, P_)
    elif lado == "lado":
        t.elipse(6, 11, 3, 2, P_)
        t.ret(5, 10, 6, 12, BR); t.px(5, 11, P_)
    pes(t, [(8, 21), (9, 21), (10, 21), (14, 21), (15, 21), (16, 21)], TA_PE)
    contorno_gba(t)


# --------------------------------------------------------------- KANGASKHAN
KA, KA_C, KA_E = H("987058"), H("b8a068"), H("504010")
KA_BARRIGA, KA_BARRIGA_E = H("f8f088"), H("d8d068")


def kangaskhan(t, lado):
    """a mãe com o filhote na bolsa"""
    if lado in ("frente", "costas"):
        if lado == "costas":
            t.poli([(14, 18), (21, 21), (22, 16), (17, 15)], KA)   # o rabo grosso
        t.elipse(12, 16, 7, 6, KA)
        t.elipse(4, 14, 2, 3, KA); t.elipse(20, 14, 2, 3, KA)
        t.elipse(12, 6, 5, 4, KA)
        t.pxs([(8, 2), (8, 3), (16, 2), (16, 3)], KA)      # as orelhas
        sombrear(t, {KA: (KA_C, KA_E)})
        if lado == "frente":
            t.elipse(12, 16, 4, 5, KA_BARRIGA)
            t.elipse(12, 15, 3, 2, KA_BARRIGA_E)           # a bolsa
            t.elipse(12, 14, 2, 2, KA)                     # o filhote espiando
            t.pxs([(11, 14), (13, 14)], P_)
            olhos2(t, (8, 15), 5, alto=2)
            t.linha([(10, 9), (14, 9)], KA_E, 1)
        else:
            t.linha([(9, 9), (12, 11), (15, 9)], KA_E, 1)
        pes(t, [(7, 21), (8, 21), (9, 21), (15, 21), (16, 21), (17, 21)], KA_E)
    else:
        t.poli([(16, 18), (23, 21), (23, 15)], KA)
        t.elipse(13, 15, 6, 6, KA)
        t.elipse(7, 7, 5, 4, KA)
        t.pxs([(10, 2), (10, 3)], KA)
        sombrear(t, {KA: (KA_C, KA_E)})
        t.elipse(9, 16, 3, 4, KA_BARRIGA)
        t.elipse(8, 14, 2, 2, KA); t.px(7, 14, P_)         # o filhote
        t.elipse(13, 13, 2, 2, KA_E)
        olhos2(t, (5,), 5, alto=2)
        t.linha([(2, 9), (5, 9)], KA_E, 1)
        pes(t, [(9, 21), (10, 21), (11, 21), (15, 21), (16, 21), (17, 21)], KA_E)
    contorno_gba(t)


DESENHOS = {75: graveler, 76: golem, 83: farfetchd, 105: marowak, 106: hitmonlee, 107: hitmonchan,
            108: lickitung, 110: weezing, 112: rhydon, 114: tangela, 115: kangaskhan}
TAMANHO = {75: 0.95, 83: 0.85, 105: 0.9, 114: 0.85}
