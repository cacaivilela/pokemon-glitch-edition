"""Fósseis puros, lote C: a linha do CRÂNIO e a do ESCUDO.

CRANIDOS/RAMPARDOS puros: sem a pedra, o crânio volta a ser osso — branco de
osso novo no filhote, marfim polido como espelho no adulto. O corpo é de bicho
vivo (cinza-azulado quente), não de rocha.

SHIELDON/BASTIODON puros: o escudo/muralha da cara é de gelo que nunca derrete,
da era fria; o corpo fica no tom de pele de antes.
"""
from pixelart import Tela, clarear, escurecer  # noqa: F401

BRANCO = (250, 250, 250, 255)
PRETO = (30, 26, 34, 255)
OSSO = (240, 234, 214, 255)
OSSO_E = (196, 186, 160, 255)
MARFIM = (246, 236, 204, 255)
MARFIM_E = (204, 186, 140, 255)
GELO = (196, 236, 250, 255)
GELO_M = (140, 202, 236, 255)
GELO_E = (86, 150, 200, 255)
VERMELHO = (220, 50, 50, 255)


# --------------------------------------------------------------- CRANIDOS
def cranidospuro(t, costas=False):
    """O filhote de cabeça-dura com o crânio branco de osso novo."""
    PELE = (128, 140, 160, 255)
    PELE_M = (106, 116, 138, 255)
    PELE_E = (82, 90, 112, 255)
    BARRIGA = (184, 190, 202, 255)
    # rabo com espinhos
    t.poli([(36, 44), (50, 38), (58, 32), (54, 42), (42, 52)], PELE_M)
    t.poli([(48, 39), (50, 33), (53, 37)], OSSO)
    t.poli([(54, 36), (57, 30), (58, 34)], OSSO)
    # pernas (a de trás mais escura)
    t.poli([(33, 46), (41, 46), (43, 58), (33, 58)], PELE_E)
    t.poli([(21, 46), (30, 46), (31, 58), (19, 58)], PELE)
    t.ret(17, 56, 31, 58, PELE)
    # corpo
    t.elipse(31, 41, 10, 11, PELE)
    t.elipse(35, 43, 6, 8, PELE_M)
    if not costas:
        t.elipse(27, 43, 6, 8, BARRIGA)
    # pescoço e focinho (sai pra frente, embaixo do domo)
    t.elipse(28, 31, 8, 6, PELE)
    t.poli([(10, 25), (28, 23), (30, 34), (20, 36), (12, 33), (9, 29)], PELE)
    # o crânio de osso
    t.elipse(30, 16, 15, 12, OSSO)
    t.ret(16, 16, 45, 23, OSSO)
    t.elipse(38, 18, 8, 7, OSSO_E)
    t.ret(36, 18, 45, 23, OSSO_E)
    # chifrinhos de trás
    t.poli([(42, 11), (54, 7), (47, 16)], OSSO)
    t.poli([(44, 20), (55, 21), (46, 25)], OSSO_E)
    # braço
    t.poli([(22, 38), (13, 42), (15, 45), (24, 42)], PELE)
    t.luz(0.30, 0.24)
    for x in (18, 22, 26, 30):
        t.px(x, 58, BRANCO)
    for x in (36, 40, 43):
        t.px(x, 58, BRANCO)
    t.pxs([(13, 43), (13, 45)], BRANCO)
    if not costas:
        # aba do domo e brilho
        t.linha([(16, 23), (45, 23)], escurecer(OSSO_E, 0.15), 1)
        t.linha([(21, 8), (29, 5)], BRANCO, 2)
        t.pxs([(19, 12), (33, 5)], BRANCO)
        t.linha([(30, 5), (38, 12)], OSSO_E, 1)
        # olho bravo sob a aba
        t.ret(17, 24, 24, 27, PELE_E)
        t.elipse(21, 26, 2, 1, VERMELHO)
        t.px(20, 25, BRANCO)
        t.linha([(17, 24), (24, 25)], PRETO, 1)
        # focinho: narina, boca, queixo
        t.px(11, 27, PRETO)
        t.linha([(10, 31), (22, 32)], PRETO, 1)
        t.px(23, 31, PRETO)
        t.linha([(13, 34), (22, 35)], PELE_M, 1)
        t.pxs([(13, 30), (16, 31)], BRANCO)
    else:
        t.linha([(30, 4), (30, 23)], OSSO_E, 1)
        t.linha([(26, 6), (26, 12)], BRANCO, 1)
        for y in (31, 36, 41):
            t.poli([(37, y), (41, y + 2), (37, y + 3)], OSSO)
        t.linha([(28, 32), (34, 48)], PELE_M, 1)
    t.contorno()
    return t


# -------------------------------------------------------------- RAMPARDOS
def rampardospuro(t, costas=False):
    """O adulto: crânio de marfim liso como espelho, com o reflexo forte."""
    PELE = (120, 124, 136, 255)
    PELE_M = (100, 104, 118, 255)
    PELE_E = (76, 80, 94, 255)
    BARRIGA = (148, 150, 160, 255)
    LISTA = (222, 208, 170, 255)
    # rabo com espinhos
    t.poli([(44, 44), (58, 38), (62, 40), (54, 54), (44, 54)], PELE_M)
    t.poli([(52, 40), (56, 33), (57, 39)], MARFIM)
    t.poli([(58, 40), (62, 34), (62, 41)], MARFIM)
    # pernas
    t.poli([(37, 48), (49, 48), (51, 61), (37, 61)], PELE_E)
    t.poli([(15, 48), (28, 48), (29, 61), (13, 61)], PELE)
    # barrigão
    t.elipse(32, 42, 17, 15, PELE)
    t.elipse(40, 44, 10, 12, PELE_M)
    # pescoço
    t.elipse(26, 24, 10, 9, PELE)
    # o domo de marfim
    t.elipse(28, 11, 12, 10, MARFIM)
    t.ret(17, 11, 39, 16, MARFIM)
    t.elipse(34, 12, 6, 6, MARFIM_E)
    t.ret(32, 12, 39, 16, MARFIM_E)
    # chifres laterais
    t.poli([(16, 10), (5, 2), (14, 15)], MARFIM)
    t.poli([(39, 10), (51, 2), (41, 16)], MARFIM_E)
    # braço
    t.poli([(16, 34), (6, 38), (8, 42), (18, 39)], PELE)
    # joelheiras
    t.elipse(21, 50, 4, 3, LISTA)
    t.elipse(43, 50, 4, 3, MARFIM_E)
    t.luz(0.28, 0.24)
    for x in (14, 18, 22, 26):
        t.px(x, 61, BRANCO)
    for x in (40, 44, 48):
        t.px(x, 61, BRANCO)
    t.pxs([(6, 39), (6, 41)], BRANCO)
    t.px(20, 49, BRANCO)
    if not costas:
        # reflexo de espelho no domo
        t.linha([(20, 7), (26, 3)], BRANCO, 2)
        t.pxs([(29, 3), (31, 3), (21, 10), (19, 12)], BRANCO)
        t.linha([(18, 16), (39, 16)], MARFIM_E, 1)
        # cara
        t.poli([(16, 17), (34, 17), (32, 26), (20, 30), (12, 26)], PELE)
        t.ret(17, 17, 26, 19, PRETO)
        t.elipse(22, 19, 2, 1, VERMELHO)
        t.px(21, 18, BRANCO)
        t.linha([(13, 26), (25, 27)], PRETO, 1)
        t.px(14, 23, PRETO)
        t.linha([(16, 28), (24, 29)], PELE_M, 1)
        # gola de marfim no peito
        t.poli([(20, 30), (36, 27), (39, 32), (24, 36)], LISTA)
        t.linha([(24, 35), (38, 32)], MARFIM_E, 1)
        t.poli([(36, 27), (41, 22), (40, 31)], MARFIM)
        # barriga clara
        t.elipse(29, 46, 9, 8, BARRIGA)
        t.linha([(22, 44), (36, 44)], PELE, 1)
        t.linha([(22, 49), (36, 49)], PELE, 1)
    else:
        # domo visto por trás: reflexo e a costura do meio
        t.linha([(20, 7), (25, 4)], BRANCO, 1)
        t.linha([(28, 2), (28, 21)], MARFIM_E, 1)
        # gola nas costas + fileira de espinhos de marfim
        t.poli([(18, 26), (38, 24), (42, 30), (22, 32)], LISTA)
        for x, y in ((24, 26), (32, 25)):
            t.poli([(x, y), (x + 3, y - 5), (x + 5, y)], MARFIM)
        for y in (32, 38, 44):
            t.poli([(42, y), (48, y - 2), (44, y + 4)], MARFIM)
        # sombra da coluna e escamas
        t.linha([(34, 32), (40, 52)], PELE_E, 1)
        for x, y in ((24, 38), (30, 42), (26, 46), (34, 48)):
            t.linha([(x, y), (x + 3, y)], PELE_M, 1)
    t.contorno()
    return t


# --------------------------------------------------------------- SHIELDON
def shieldonpuro(t, costas=False):
    """O escudo da cara é de gelo que nunca derrete."""
    PELE = (220, 178, 108, 255)
    PELE_M = (192, 150, 86, 255)
    PELE_E = (156, 116, 64, 255)
    CARA = (78, 80, 94, 255)
    # rabo e corpo
    t.poli([(44, 40), (56, 30), (60, 34), (52, 46)], PELE)
    t.elipse(38, 44, 15, 9, PELE)
    t.elipse(42, 48, 11, 5, PELE_M)
    # pernas
    for x, c in ((26, PELE_E), (34, PELE), (44, PELE_E), (51, PELE)):
        t.ret(x - 3, 48, x + 3, 58, c)
    # focinho embaixo
    t.elipse(22, 49, 9, 5, PELE_M)
    # faixa escura dos olhos
    t.ret(7, 38, 37, 46, CARA)
    # o escudo de gelo
    t.elipse(22, 24, 15, 18, GELO_M)
    t.ret(8, 32, 36, 38, GELO_M)
    t.luz(0.35, 0.25)
    for x in (24, 32, 42, 49):
        t.pxs([(x, 58), (x + 2, 58)], BRANCO)
    if not costas:
        # facetas de gelo (3 tons) e brilho
        t.elipse(20, 22, 10, 13, GELO)
        t.elipse(20, 26, 10, 10, GELO)
        t.poli([(30, 14), (34, 22), (34, 35), (30, 35)], clarear(GELO_E, 0.2))
        t.linha([(12, 14), (16, 9)], BRANCO, 2)
        t.pxs([(12, 19), (11, 22), (24, 10), (26, 11)], BRANCO)
        t.linha([(20, 14), (23, 24), (19, 34)], GELO_M, 1)
        t.linha([(23, 24), (30, 26)], GELO_M, 1)
        t.linha([(8, 37), (36, 37)], GELO_E, 1)
        # os olhos na faixa escura
        t.ret(12, 40, 16, 42, BRANCO)
        t.ret(27, 40, 31, 42, BRANCO)
        t.ret(13, 40, 15, 42, PRETO)
        t.ret(28, 40, 30, 42, PRETO)
        t.linha([(8, 45), (36, 45)], escurecer(CARA, 0.3), 1)
        # boca
        t.linha([(16, 51), (28, 51)], PELE_E, 1)
        t.pxs([(18, 48), (25, 48)], PRETO)
    else:
        # o escudo por trás: borda de gelo e a parte de dentro escura
        t.elipse(23, 25, 11, 13, GELO_E)
        t.ret(12, 30, 34, 36, GELO_E)
        t.linha([(23, 13), (23, 36)], GELO_M, 1)
        t.pxs([(16, 18), (30, 20), (18, 30)], GELO_M)
        t.linha([(10, 12), (14, 7)], BRANCO, 1)
        # costas: crista de espinhos curtos
        for x in (38, 44, 50):
            t.poli([(x, 37), (x + 2, 33), (x + 4, 37)], PELE_E)
        t.linha([(36, 40), (54, 40)], PELE_M, 1)
    t.contorno()
    return t


# -------------------------------------------------------------- BASTIODON
def bastiodonpuro(t, costas=False):
    """A muralha de gelo antigo; os filhotes se escondiam atrás dela."""
    PELE = (220, 178, 108, 255)
    PELE_E = (160, 120, 66, 255)
    CORPO = (96, 100, 116, 255)
    CORPO_E = (66, 70, 86, 255)
    # traseiro (corpo)
    t.elipse(44, 42, 17, 13, CORPO)
    t.poli([(40, 30), (58, 33), (60, 46), (44, 46)], PELE)
    t.poli([(48, 42), (60, 40), (60, 46), (44, 46)], PELE_E)
    t.poli([(56, 40), (63, 50), (56, 52)], CORPO_E)
    # pernas
    t.poli([(40, 50), (50, 50), (52, 61), (40, 61)], CORPO_E)
    t.poli([(52, 48), (60, 48), (61, 58), (54, 58)], CORPO_E)
    t.poli([(10, 50), (22, 50), (22, 61), (8, 61)], CORPO)
    t.poli([(24, 50), (34, 50), (36, 61), (24, 61)], CORPO_E)
    # a muralha de gelo
    t.poli([(4, 12), (16, 6), (30, 6), (40, 12), (42, 46), (34, 52), (8, 52), (2, 44)], GELO_M)
    for p in ([(6, 10), (8, 0), (13, 7)], [(31, 7), (36, 0), (38, 11)],
              [(40, 22), (49, 18), (41, 28)], [(2, 26), (0, 32), (3, 34)]):
        t.poli(p, GELO)
    t.luz(0.35, 0.25)
    for x in (10, 14, 18, 27, 31, 35):
        t.px(x, 61, BRANCO)
    if not costas:
        # tijolos de gelo, com o lado direito na sombra
        t.poli([(8, 14), (18, 10), (28, 10), (36, 15), (37, 36), (8, 36)], GELO)
        t.poli([(29, 11), (36, 15), (37, 36), (29, 36)], clarear(GELO_M, 0.25))
        for x in (16, 22, 29):
            t.linha([(x, 11), (x + 1, 36)], GELO_M, 1)
        t.linha([(8, 25), (37, 25)], GELO_M, 1)
        for x, y in ((12, 18), (32, 18), (14, 30), (31, 30)):
            t.elipse(x, y, 2, 3, GELO_E)
            t.px(x - 1, y - 1, BRANCO)
        t.linha([(9, 13), (13, 10)], BRANCO, 2)
        t.pxs([(24, 14), (19, 21), (10, 20)], BRANCO)
        # rosto embaixo da muralha
        t.ret(8, 38, 36, 48, CORPO)
        t.ret(8, 38, 36, 39, GELO_E)
        t.ret(8, 47, 36, 48, CORPO_E)
        t.ret(11, 41, 16, 43, BRANCO)
        t.ret(12, 41, 14, 43, PRETO)
        t.ret(28, 41, 33, 43, BRANCO)
        t.ret(29, 41, 31, 43, PRETO)
        t.linha([(12, 46), (32, 46)], VERMELHO, 1)
        t.pxs([(14, 45), (19, 45), (25, 45), (30, 45)], BRANCO)
        t.poli([(3, 40), (12, 44), (3, 45)], GELO)
        t.poli([(41, 40), (32, 44), (41, 45)], GELO)
    else:
        # a muralha por trás: gelo mais escuro, em placas, e o corpo encaixado
        t.poli([(8, 14), (36, 14), (38, 46), (8, 48)], GELO_E)
        for y in (24, 35):
            t.linha([(8, y), (37, y)], GELO_M, 1)
        for x, y1, y2 in ((18, 14, 24), (28, 24, 35), (16, 35, 47), (30, 35, 46)):
            t.linha([(x, y1), (x, y2)], GELO_M, 1)
        t.linha([(9, 13), (13, 10)], BRANCO, 1)
        t.linha([(42, 34), (58, 36)], PELE_E, 1)
        for x in (44, 50, 55):
            t.poli([(x, 33), (x + 2, 26), (x + 5, 33)], GELO)
    t.contorno()
    return t


DESENHOS = {
    22010: (cranidospuro, "cranidospuro"),
    22011: (rampardospuro, "rampardospuro"),
    22012: (shieldonpuro, "shieldonpuro"),
    22013: (bastiodonpuro, "bastiodonpuro"),
}
