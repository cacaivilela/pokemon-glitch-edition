"""Lote 29: ORBEETLE-BRAG — o ABAJUR DE JOANINHA, bravo.

O ORBEETLE é uma joaninha redonda que flutua. Do lado de cá do mar ele virou
um abajur de quarto de criança: a carapaça vermelha de pintas pretas é a
CÚPULA, embaixo dela a LÂMPADA acesa é a cara (de sobrancelha franzida — ele
acorda bravo toda vez que alguém aperta o interruptor), a haste e o pé são de
metal e o rabo é o FIO, com a tomada na ponta soltando faísca. ELÉTRICO/AÇO.
"""
from PIL import Image, ImageDraw  # noqa: F401

from pixelart import Tela, clarear, escurecer  # noqa: F401

BRANCO = (250, 250, 250, 255)
PRETO = (30, 26, 34, 255)


def orbeetlebrag(t, costas=False):
    CUPULA = (214, 40, 46, 255)
    CUPULA_E = (150, 24, 34, 255)
    PINTA = (34, 28, 36, 255)
    METAL = (178, 184, 196, 255)
    METAL_E = (112, 118, 132, 255)
    LUZ = (255, 236, 120, 255)
    LUZ_C = (255, 252, 214, 255)
    FIO = (60, 56, 66, 255)
    FAISCA = (255, 220, 40, 255)
    # o fio: sai do pé e faz uma curva pra direita, com a tomada na ponta
    t.linha([(38, 58), (46, 60), (52, 57), (54, 51), (57, 47)], FIO, 2)
    t.ret(55, 41, 60, 46, METAL_E)                       # a tomada
    t.ret(56, 38, 56, 40, METAL)                          # os dois pinos
    t.ret(59, 38, 59, 40, METAL)
    # o pé redondo de metal e a haste
    t.elipse(32, 58, 11, 3, METAL_E)
    t.elipse(32, 57, 10, 2, METAL)
    t.ret(30, 31, 34, 56, METAL)
    t.ret(33, 31, 34, 56, METAL_E)
    # as perninhas de joaninha, dobradas, agarradas na haste
    for y in (47, 52):
        t.linha([(30, y), (25, y - 3), (23, y)], PINTA, 1)
        t.linha([(34, y), (39, y - 3), (41, y)], PINTA, 1)
    if not costas:
        # a lâmpada acesa: é a cara
        t.elipse(32, 36, 9, 8, LUZ)
    # a cúpula: a carapaça (meia-lua grande), com a borda de metal embaixo
    t.d.pieslice([6, 4, 58, 52], 180, 360, fill=CUPULA)
    t.ret(6, 28, 58, 30, METAL)
    t.ret(6, 30, 58, 30, METAL_E)
    # as antenas: as correntinhas de puxar a luz, com a bolinha na ponta
    t.linha([(26, 6), (20, 0)], PINTA, 1)
    t.linha([(38, 6), (44, 0)], PINTA, 1)
    t.luz(poupar=(LUZ[:3], LUZ_C[:3], FAISCA[:3]))
    t.elipse(20, 1, 1, 1, METAL)
    t.elipse(44, 1, 1, 1, METAL)
    if costas:
        # de costas, a carapaça abre no meio como asa de joaninha
        t.linha([(32, 4), (32, 27)], PINTA, 1)

    # as pintas pretas
    for cx, cy, r in ((16, 21, 3), (25, 13, 3), (39, 13, 3), (48, 21, 3), (12, 26, 2), (52, 26, 2), (32, 8, 2)):
        t.elipse(cx, cy, r, r, PINTA)
    t.elipse(32, 21, 3, 3, PINTA) if not costas else (t.elipse(27, 21, 3, 3, PINTA), t.elipse(37, 21, 3, 3, PINTA))
    # o brilho do plástico da cúpula
    t.linha([(13, 16), (17, 10)], clarear(CUPULA, 0.5), 1)
    t.linha([(19, 8), (21, 7)], clarear(CUPULA, 0.5), 1)
    if not costas:
        # o miolo mais claro da lâmpada
        t.elipse(32, 37, 5, 4, LUZ_C)
        # os olhos BRAVOS: brancos com pupila, e a sobrancelha descendo pro meio
        for ex in (28, 36):
            t.ret(ex - 2, 34, ex + 1, 37, BRANCO)
            t.ret(ex - 1 if ex < 32 else ex - 2, 35, ex if ex < 32 else ex - 1, 37, PRETO)
        t.linha([(24, 31), (30, 34)], PRETO, 2)
        t.linha([(40, 31), (34, 34)], PRETO, 2)
        # a boca: dentinho cerrado
        t.linha([(29, 41), (35, 41)], PRETO, 1)
        t.pxs([(30, 40), (32, 40), (34, 40)], PRETO)
    # as faíscas da tomada e da cúpula
    for pts in (((58, 36), (61, 33), (59, 32), (62, 28)),
                ((4, 14), (1, 11), (4, 10), (1, 6)),
                ((60, 18), (63, 16), (61, 14))):
        t.linha(list(pts), FAISCA, 1)
    t.contorno()
    return t


DESENHOS = {21902: (orbeetlebrag, "orbeetlebrag")}
