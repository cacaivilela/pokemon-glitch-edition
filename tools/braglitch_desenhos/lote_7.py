"""Lote 7: o VICTREEBEL de Braglitch, que é uma CUIA — nas duas formas.

O corpo é o mesmo nas duas (a cuia bojuda com o aro de metal, a erva por cima,
a bomba saindo em diagonal no lugar do caule do VICTREEBEL e duas folhas de
braço). O que muda é a bebida: CHIMARRÃO quente, cuia de porongo marrom e
vapor; TERERÊ gelado, cuia clara com gelo, limão e cristal de frio.
"""
from pixelart import Tela, clarear, escurecer

BRANCO = (250, 250, 250, 255)
PRETO = (30, 26, 34, 255)
PRATA = (196, 202, 212, 255)
PRATA_E = (120, 128, 142, 255)
FOLHA = (70, 150, 60, 255)
FOLHA_E = (40, 100, 44, 255)


def _cuia(t, costas, casca, casca_e, desenho, erva, espuma):
    # a cuia: bojo embaixo, pescoço mais estreito em cima
    t.elipse(32, 44, 17, 15, casca)
    t.poli([(20, 34), (44, 34), (41, 22), (23, 22)], casca)
    # as folhas-braço, como as do VICTREEBEL
    t.poli([(16, 38), (3, 30), (2, 36), (8, 44), (16, 46)], FOLHA)
    t.poli([(48, 38), (61, 30), (62, 36), (56, 44), (48, 46)], FOLHA)
    # o aro de metal da boca
    t.ret(21, 19, 43, 23, PRATA)
    # a erva por cima
    t.elipse(32, 18, 10, 4, erva)
    t.luz(poupar=())
    t.linha([(4, 34), (15, 42)], FOLHA_E, 1)
    t.linha([(60, 34), (49, 42)], FOLHA_E, 1)
    t.ret(21, 23, 43, 23, PRATA_E)
    # o desenho entalhado da cuia (faixa em zigue-zague)
    for x in range(18, 47, 4):
        t.linha([(x, 50), (x + 2, 53), (x + 4, 50)], desenho, 1)
    t.linha([(17, 55), (47, 55)], desenho, 1)
    # espuma da erva
    for x, y in ((27, 16), (31, 15), (35, 17), (29, 18)):
        t.px(x, y, espuma)
    # a bomba: sai da erva em diagonal e termina no bocal (é o caule dele)
    t.linha([(34, 17), (46, 4)], PRATA, 2)
    t.linha([(35, 18), (47, 5)], PRATA_E, 1)
    t.ret(45, 1, 50, 4, PRATA)
    t.px(47, 2, BRANCO)
    if not costas:
        # olhos e a bocarra do VICTREEBEL, pintados no bojo
        for cx in (25, 39):
            t.elipse(cx, 37, 3, 4, BRANCO)
            t.elipse(cx + 1, 38, 2, 2, PRETO)
            t.px(cx, 36, BRANCO)
        t.linha([(24, 32), (28, 33)], casca_e, 1)
        t.linha([(40, 32), (36, 33)], casca_e, 1)
        t.poli([(24, 44), (40, 44), (37, 49), (27, 49)], (120, 40, 40, 255))
        t.ret(26, 44, 38, 45, BRANCO)
    else:
        t.linha([(32, 26), (32, 56)], casca_e, 1)       # a costura do porongo


def chimarrao(t, costas=False):
    """VICTREEBEL-CHIMARRÃO: cuia de porongo marrom com aro de prata, erva
    verde espumando e vapor subindo. PLANTA/FOGO."""
    casca = (150, 98, 54, 255)
    _cuia(t, costas, casca, escurecer(casca, 0.4), (96, 58, 30, 255),
          (86, 150, 52, 255), (190, 222, 140, 255))
    vapor = (236, 236, 240, 255)
    for i, (x, y) in enumerate(((24, 10), (22, 5), (26, 1), (30, 8), (29, 3))):
        t.elipse(x, y, 2, 1 + i % 2, vapor)
    for x, y in ((14, 24), (50, 22), (12, 52), (54, 54)):   # brasinhas do calor
        t.px(x, y, (255, 150, 60, 255))
    t.contorno()
    return t


def terere(t, costas=False):
    """VICTREEBEL-TERERÊ: a mesma cuia, clara e pintada, com gelo, uma rodela
    de limão e cristais de frio em volta. PLANTA/GELO."""
    casca = (226, 214, 180, 255)
    _cuia(t, costas, casca, escurecer(casca, 0.35), (60, 140, 90, 255),
          (110, 176, 80, 255), (210, 240, 255, 255))
    gelo = (190, 230, 250, 255)
    for x, y in ((25, 14), (37, 13)):                       # os cubos de gelo
        t.ret(x, y, x + 4, y + 4, gelo)
        t.px(x + 1, y + 1, BRANCO)
    t.elipse(31, 13, 3, 3, (250, 226, 70, 255))            # a rodela de limão
    t.px(31, 13, (200, 230, 90, 255))
    for x, y in ((12, 20), (52, 18), (10, 50), (55, 52), (18, 8)):   # cristais de frio
        t.pxs([(x, y - 1), (x - 1, y), (x + 1, y), (x, y + 1)], (170, 225, 255, 255))
        t.px(x, y, BRANCO)
    t.contorno()
    return t


DESENHOS = {
    21023: (chimarrao, "victreebelchimarrao"),
    21024: (terere, "victreebelterere"),
}
