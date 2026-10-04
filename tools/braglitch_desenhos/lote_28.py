"""Lote 28: EXEGGUTOR-BRAG — a AVE-BURITI, de três cabeças.

O EXEGGUTOR é um coqueiro com várias cabeças no alto. Do lado de cá do mar
ele virou um pássaro de planta: o pescoço é um tronco só de palmeira (o
buriti das veredas), e lá em cima, no lugar dos cocos, saem três cabeças de
passarinho, cada uma com o seu topete de folha. O corpo e as asas são folhas.
"""
from PIL import Image, ImageDraw

from pixelart import Tela, clarear, escurecer  # noqa: F401

BRANCO = (250, 250, 250, 255)
PRETO = (30, 26, 34, 255)


def exeggutorbrag(t, costas=False):
    FOLHA = (76, 160, 72, 255)
    FOLHA_E = (44, 112, 56, 255)
    FOLHA_C = (150, 206, 96, 255)
    TRONCO = (150, 104, 62, 255)
    TRONCO_E = (104, 70, 44, 255)
    CABECA = (104, 184, 84, 255)
    BICO = (238, 176, 48, 255)
    PE = (120, 84, 52, 255)
    # pernas
    for x in (28, 39):
        t.linha([(x, 53), (x, 60)], PE, 2)
        t.pxs([(x - 2, 61), (x - 1, 61), (x + 1, 61), (x + 2, 61), (x + 3, 61)], PE)
    # o rabo: três folhas de palmeira
    for dy, cor in ((-6, FOLHA_E), (0, FOLHA), (5, FOLHA_E)):
        t.poli([(44, 45), (60, 40 + dy), (58, 44 + dy), (46, 50)], cor)
    # o corpo de folha
    t.elipse(33, 46, 14, 9, FOLHA)
    # a asa: uma folha grande com a nervura
    t.poli([(26, 42), (44, 38), (52, 46), (40, 53), (28, 50)], FOLHA_E)
    t.linha([(28, 47), (50, 45)], FOLHA_C, 1)
    for i in range(4):
        t.linha([(32 + i * 5, 46), (35 + i * 5, 41)], FOLHA_C, 1)
        t.linha([(32 + i * 5, 47), (35 + i * 5, 51)], FOLHA_C, 1)
    # o pescoço: um tronco só, de palmeira
    t.linha([(33, 40), (33, 22)], TRONCO, 6)
    for y in range(24, 40, 3):                       # os anéis do tronco
        t.linha([(30, y), (36, y)], TRONCO_E, 1)
    # no alto ele abre em três: os galhinhos que seguram as cabeças
    t.linha([(33, 23), (22, 16)], TRONCO, 3)
    t.linha([(33, 23), (33, 13)], TRONCO, 3)
    t.linha([(33, 23), (44, 16)], TRONCO, 3)
    # a coroa de folhas embaixo das cabeças (onde o buriti tem os cocos)
    for pts in (((33, 22), (18, 24), (24, 20)), ((33, 22), (48, 24), (42, 20)), ((33, 22), (26, 28), (30, 22)), ((33, 22), (40, 28), (36, 22))):
        t.poli(list(pts), FOLHA_E)
    # as três cabeças, cada uma com o topete de folha
    cabecas = ((20, 13), (33, 9), (46, 13))
    for cx, cy in cabecas:
        t.poli([(cx - 1, cy - 4), (cx - 4, cy - 10), (cx + 1, cy - 6), (cx + 3, cy - 11), (cx + 3, cy - 4)], FOLHA_E)
        t.elipse(cx, cy, 5, 5, CABECA)
    # os bicos: a da esquerda olha pra esquerda, a do meio pra frente, a da direita pra direita
    t.poli([(15, 12), (8, 14), (15, 16)], BICO)
    t.poli([(31, 12), (33, 17), (35, 12)], BICO)
    t.poli([(51, 12), (58, 14), (51, 16)], BICO)
    t.luz(poupar=(BICO[:3],))
    if not costas:
        for x, y in ((18, 12), (31, 8), (35, 8), (48, 12)):
            t.px(x, y, PRETO)
            t.px(x, y - 1, BRANCO)
        t.linha([(9, 14), (14, 14)], escurecer(BICO, 0.35), 1)
        t.linha([(52, 14), (57, 14)], escurecer(BICO, 0.35), 1)
    # desce 2 px: o topete da cabeça do meio encostava no topo da tela
    desce = Image.new("RGBA", t.img.size, (0, 0, 0, 0))
    desce.paste(t.img, (0, 2))
    t.img = desce
    t.d = ImageDraw.Draw(t.img)
    t.contorno()
    return t


DESENHOS = {21901: (exeggutorbrag, "exeggutorbrag")}
