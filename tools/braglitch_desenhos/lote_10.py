"""Lote 10: SANDBASH, a evolução do SANDSLASH-BRAG — a bola de futebol com
quatro patas, duas cabeças de SANDSHREW dos lados e a de SANDSLASH no meio.

Tem SHINY desenhado à mão (`SHINIES`): a bola vira preta com os pentágonos
roxos. tools/braglitch_sprites.py grava em assets/sprites/pokemon/shiny/.
"""
import math

from pixelart import Tela, clarear, escurecer

BRANCO = (250, 250, 250, 255)
PRETO = (30, 26, 34, 255)

# as cores da linha -BRAG (o tatu-bola marrom-acinzentado)
CASCA = (150, 112, 78, 255)
CASCA_E = (108, 78, 54, 255)
CREME = (232, 214, 176, 255)
GARRA = (240, 236, 226, 255)


def _pentagono(t, cx, cy, r, cor):
    pts = [(cx + r * math.cos(math.radians(-90 + k * 72)), cy + r * math.sin(math.radians(-90 + k * 72))) for k in range(5)]
    t.poli(pts, cor)


def _bola(t, couro, mancha, costura):
    """O corpo: a bola, com a costura e os pentágonos."""
    t.elipse(32, 40, 18, 16, couro)
    t.luz(poupar=())
    centros = [(32, 38), (21, 33), (43, 33), (24, 48), (40, 48), (32, 26), (14, 44), (50, 44)]
    for cx, cy in centros[:5]:                     # a costura liga o do meio aos outros
        t.linha([(32, 38), (cx, cy)], costura, 1)
    for cx, cy in ((21, 33), (43, 33), (24, 48), (40, 48)):
        for ox, oy in ((-8, 4), (8, 4), (0, -9)):
            t.linha([(cx, cy), (cx + ox, cy + oy)], costura, 1)
    for cx, cy in centros:
        _pentagono(t, cx, cy, 4, mancha)
    # o que sai fora do contorno da bola é apagado: a estampa fica na bola
    for y in range(64):
        for x in range(64):
            if ((x - 32) / 18) ** 2 + ((y - 40) / 16) ** 2 > 1.0 and t.cor(x, y)[3]:
                t.px(x, y, (0, 0, 0, 0))


def _patas(t):
    for x, y in ((13, 50), (22, 54), (38, 54), (47, 50)):
        t.ret(x, y, x + 5, y + 7, CASCA)
        t.ret(x, y + 5, x + 5, y + 7, CASCA_E)
        for k in range(3):                         # as garras brancas
            t.px(x + k * 2, y + 8, GARRA)


def _cabeca_sandshrew(t, cx, cy, costas):
    t.poli([(cx - 6, cy - 2), (cx - 9, cy - 10), (cx - 3, cy - 5)], CASCA)   # orelhas
    t.poli([(cx + 6, cy - 2), (cx + 9, cy - 10), (cx + 3, cy - 5)], CASCA)
    t.elipse(cx, cy, 7, 6, CASCA)
    if not costas:
        t.elipse(cx, cy + 3, 4, 3, CREME)          # o focinho claro
        t.px(cx - 3, cy - 1, PRETO)
        t.px(cx + 3, cy - 1, PRETO)
        t.px(cx - 3, cy - 2, BRANCO)
        t.px(cx, cy + 2, PRETO)
    else:
        t.linha([(cx - 4, cy), (cx + 4, cy)], CASCA_E, 1)


def _cabeca_sandslash(t, cx, cy, costas):
    for k in range(5):                             # os espinhos grossos em leque atrás da cabeça
        a = math.radians(-155 + k * 32)
        t.poli([(cx + 6 * math.cos(a - 0.3), cy + 6 * math.sin(a - 0.3)),
                (cx + 17 * math.cos(a), cy + 15 * math.sin(a)),
                (cx + 6 * math.cos(a + 0.3), cy + 6 * math.sin(a + 0.3))], CASCA_E)
        t.px(round(cx + 15 * math.cos(a)), round(cy + 13 * math.sin(a)), clarear(CASCA_E, 0.3))
    t.elipse(cx, cy, 9, 8, CASCA)
    if not costas:
        t.elipse(cx, cy + 3, 6, 4, CREME)
        for ox in (-4, 4):                         # olhos bravos
            t.ret(cx + ox - 1, cy - 2, cx + ox + 1, cy - 1, PRETO)
            t.px(cx + ox, cy - 2, BRANCO)
        t.linha([(cx - 6, cy - 5), (cx - 2, cy - 3)], CASCA_E, 1)
        t.linha([(cx + 6, cy - 5), (cx + 2, cy - 3)], CASCA_E, 1)
        t.px(cx, cy + 2, PRETO)
        t.linha([(cx - 2, cy + 5), (cx + 2, cy + 5)], PRETO, 1)
    else:
        t.elipse(cx, cy - 1, 5, 4, CASCA_E)


def _sandbash(t, costas, couro, mancha, costura):
    _bola(t, couro, mancha, costura)             # a bola primeiro: o recorte da estampa
    _patas(t)                                    # apagaria as patas se elas viessem antes
    # os pescoços saindo do alto da bola
    t.ret(12, 22, 18, 30, CASCA)
    t.ret(46, 22, 52, 30, CASCA)
    t.ret(28, 18, 36, 27, CASCA)
    _cabeca_sandshrew(t, 14, 19, costas)
    _cabeca_sandshrew(t, 50, 19, costas)
    _cabeca_sandslash(t, 32, 14, costas)
    t.contorno()
    return t


def sandbash(t, costas=False):
    """SANDBASH: bola de futebol branca de verdade, com a costura e os
    pentágonos pretos, quatro patas de tatu com garra, duas cabeças de
    SANDSHREW dos lados e a de SANDSLASH no meio, com o leque de espinhos."""
    return _sandbash(t, costas, (238, 238, 242, 255), (34, 34, 42, 255), (150, 150, 156, 255))


def sandbash_shiny(t, costas=False):
    """O SHINY: a bola vira preta, com os pentágonos roxos."""
    return _sandbash(t, costas, (40, 36, 52, 255), (150, 70, 220, 255), (96, 70, 130, 255))


DESENHOS = {1083: (sandbash, "sandbash")}
SHINIES = {1083: sandbash_shiny}
