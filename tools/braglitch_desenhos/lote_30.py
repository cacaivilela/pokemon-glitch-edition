"""Lote 30: PARASECTROM — a evolução secreta do PARASECT.

Levou um choque nas ilhas SEVII e foi derrotado; o cogumelo cresceu, virou um
"robô" por dentro, e agora ele age como um. O COGUMELO ficou DE CABEÇA PRA
BAIXO e cresceu: o chapéu SAI DE BAIXO do caule e desce enorme, como uma
tigela funda de pintas apoiada em DOIS PÉS de metal, cobrindo quase o caule
inteiro — dele só sobra a pontinha, por cima, com um anel de metal. Logo
abaixo da boca do chapéu, os OLHOS BRANCOS vazios e acesos; as garras ficaram
pequenas, nos lados da boca, e ele solta faísca amarela. INSETO/ELÉTRICO.
"""
from PIL import Image, ImageDraw  # noqa: F401

from pixelart import Tela, clarear, escurecer  # noqa: F401

BRANCO = (250, 250, 250, 255)
PRETO = (30, 26, 34, 255)


# AS TRÊS VARIANTES (src/data/secretas.js): a cor do chapéu e das pintas. O
# raio MATOU o cogumelo, então as três são de cogumelo morto — bem mais
# escuras, as pintas apagadas (mas sem marca de queimado). A NORMAL é o
# laranja pálido escurecido; a AZUL e a DOURADA guardam a cor do cogumelo que
# ele tinha comido.
CORES = {
    "normal": ((128, 84, 56, 255), (84, 52, 36, 255), (166, 132, 104, 255)),
    "azul": ((34, 54, 104, 255), (20, 32, 66, 255), (92, 120, 160, 255)),
    "amarelo": ((134, 104, 26, 255), (90, 66, 18, 255), (176, 158, 100, 255)),
}
def parasectrom(t, costas=False, cor="normal"):
    CHAPEU, CHAPEU_E, PINTA = CORES[cor]
    # as lamelas e o caule também escureceram com o raio
    LAMELA = (150, 120, 86, 255)
    LAMELA_E = (104, 80, 56, 255)
    CAULE = (170, 146, 112, 255)
    CAULE_E = (120, 98, 72, 255)
    CORPO = (234, 120, 52, 255)
    CORPO_E = (176, 78, 34, 255)
    METAL = (176, 184, 198, 255)
    METAL_E = (104, 112, 128, 255)
    REBITE = (226, 232, 240, 255)
    FAISCA = (255, 224, 40, 255)
    OLHO = (255, 255, 255, 255)
    BRILHO = (196, 240, 255, 255)

    # OS PÉS: dois pés grandes de metal, de bota, com três dedos de inseto
    for cx in (21, 43):
        t.ret(cx - 3, 51, cx + 3, 56, METAL_E)            # o tornozelo
        t.elipse(cx, 59, 8, 4, METAL_E)                    # a sola
        t.elipse(cx, 58, 7, 3, METAL)
        for d in (-6, 0, 6):                               # os dedos
            t.elipse(cx + d, 61, 2, 2, CORPO_E)
            t.px(cx + d, 61, CORPO)
        t.px(cx - 2, 57, REBITE)
        t.px(cx + 2, 57, REBITE)

    # O CAULE: o cogumelo está de cabeça pra baixo, então do caule só sai um
    # toco por CIMA do chapéu, com um anel de metal — e na ponta, a cabeça
    t.ret(28, 12, 36, 21, CAULE_E)
    t.ret(29, 12, 35, 21, CAULE)
    t.ret(28, 16, 36, 17, METAL)
    for x in (30, 34):
        t.px(x, 16, REBITE)

    # as GARRAS do parasect, pequenas, saindo dos lados da boca do chapéu
    for lado in (-1, 1):
        bx = 32 + lado * 22
        ox = 32 + lado * 27
        t.linha([(bx, 24), (ox, 22), (ox, 15)], CORPO_E, 3)
        t.linha([(bx, 24), (ox, 22), (ox, 15)], CORPO, 1)
        t.elipse(ox, 22, 2, 2, METAL)                      # o cotovelo de metal
        t.elipse(ox, 13, 3, 3, CORPO_E)
        t.poli([(ox - 2, 11), (ox - 3, 6), (ox, 10)], CORPO_E)
        t.poli([(ox + 2, 11), (ox + 3, 6), (ox, 10)], CORPO_E)

    # O CHAPÉU, DE CABEÇA PRA BAIXO: sai de baixo do caule e desce, enorme,
    # como uma tigela funda — cobre quase o caule inteiro
    t.d.pieslice([4, -16, 60, 58], 0, 180, fill=CHAPEU_E)
    t.d.pieslice([5, -16, 59, 57], 0, 180, fill=CHAPEU)
    # as pintas, da boca até o fundo
    for cx, cy, r in ((14, 36, 3), (50, 36, 3), (24, 46, 3), (40, 46, 3), (32, 53, 2),
                      (9, 28, 2), (55, 28, 2), (32, 38, 2), (18, 53, 1), (46, 53, 1), (24, 30, 2), (40, 30, 2)):
        t.elipse(cx, cy, r, r, PINTA)
    # a boca do chapéu, em cima: as lamelas viradas pro céu e o aro rebitado
    t.elipse(32, 21, 27, 4, LAMELA_E)
    t.elipse(32, 20, 26, 3, LAMELA)
    for x in range(8, 58, 4):
        t.linha([(x, 19), (32 + (x - 32) // 4, 22)], LAMELA_E, 1)
    t.ret(4, 23, 60, 24, METAL)
    for x in range(7, 59, 5):
        t.px(x, 23, REBITE)
    # o caule de novo por cima das lamelas (ele sai do meio delas)
    t.ret(29, 18, 35, 21, CAULE)

    # A CABEÇA DO PARASECT, na ponta do caule: laranja, com as presas
    t.elipse(32, 7, 9, 6, CORPO_E)
    t.elipse(32, 6, 8, 5, CORPO)
    t.poli([(27, 11), (25, 14), (29, 12)], CORPO_E)       # as presinhas
    t.poli([(37, 11), (39, 14), (35, 12)], CORPO_E)

    if costas:
        # de costas: a nuca com um parafuso, e uma placa aparafusada no chapéu
        t.ret(30, 3, 34, 6, METAL)
        t.px(32, 4, REBITE)
        t.ret(26, 30, 38, 38, METAL)
        t.ret(26, 38, 38, 38, METAL_E)
        for x, y in ((27, 31), (37, 31), (27, 37), (37, 37)):
            t.px(x, y, REBITE)
        t.linha([(29, 34), (35, 34)], METAL_E, 1)

    t.luz(poupar=(FAISCA[:3], OLHO[:3], BRILHO[:3], REBITE[:3]))

    if not costas:
        # os OLHOS BRANCOS do PARASECT, vazios e acesos, na cabeça
        for ex in (28, 36):
            t.elipse(ex, 7, 3, 2, BRILHO)
            t.elipse(ex, 7, 2, 1, OLHO)

    # as faíscas: em volta da cabeça e nas garras
    for pts in (((22, 4), (19, 2), (21, 6), (17, 5)),
                ((42, 4), (45, 2), (43, 6), (47, 5)),
                ((2, 6), (0, 4), (2, 2), (0, 0)),
                ((62, 6), (63, 4), (62, 2), (63, 0))):
        t.linha(list(pts), FAISCA, 1)
    t.contorno()
    return t


def parasectromazul(t, costas=False):
    return parasectrom(t, costas, "azul")


def parasectromamarelo(t, costas=False):
    return parasectrom(t, costas, "amarelo")


DESENHOS = {
    31001: (parasectrom, "parasectrom"),
    31002: (parasectromazul, "parasectromazul"),
    31003: (parasectromamarelo, "parasectromamarelo"),
}
