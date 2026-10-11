"""Lote E: AS METADES DE GALAR, PURAS (espécies novas, exclusivas do jogo).

TURBOZOLT — o velocirraptor inteiro de quem o DRACOZOLT roubou a cabeça:
corpo magro inclinado pra frente, cauda dura soltando faísca, garra-foice no
pé. ABISSOVISH — o tubarão do fundo do mar antigo com a cabeça do DRACOVISH.
DRACOSSAURO — o pescoçudo manso de cauda longa: a metade de baixo inteira.
"""
from pixelart import Tela, clarear, escurecer  # noqa: F401

BRANCO = (250, 250, 250, 255)
PRETO = (30, 26, 34, 255)

# a paleta dos Dracos de Galar
AMARELO = (250, 226, 40, 255)
AMARELO_C = (255, 252, 140, 255)
OURO = (228, 160, 32, 255)
LARANJA = (255, 150, 70, 255)
VERDE = (0, 134, 104, 255)
VERDE_E = (0, 94, 68, 255)
ROSA = (238, 80, 118, 255)
ROSA_C = (255, 142, 160, 255)
VERMELHO = (150, 40, 30, 255)
FAISCA = (255, 255, 200, 255)
AZUL_F = (120, 230, 255, 255)


def olho(t, cx, cy, r=2, iris=PRETO, brilho=BRANCO):
    t.elipse(cx, cy, r, r, iris)
    t.px(cx - 1, cy - 1, brilho)


def volume(t, cx, cy, rx, ry, cor, sombra=0.30, brilho=0.0):
    """Elipse em três tons: sombra embaixo-direita, cor no meio e, se pedir,
    um brilho em cima-esquerda."""
    t.elipse(cx, cy, rx, ry, escurecer(cor, sombra))
    t.elipse(cx - max(1, rx // 5), cy - max(1, ry // 4), rx - max(1, rx // 5), ry - max(1, ry // 4), cor)
    if brilho:
        t.elipse(cx - rx // 3, cy - ry // 2, max(1, rx // 3), max(1, ry // 4), clarear(cor, brilho))


# ------------------------------------------------------------- TURBOZOLT
def turbozolt(t, costas=False):
    """Velocirraptor em disparada, cabeça do DRACOZOLT: bico amarelo, crista
    de penas espetadas, máscara rosa no olho. Cauda dura com faísca."""
    VERDE_M = escurecer(VERDE, 0.15)
    AMARELO_S = (226, 186, 30, 255)
    # faíscas em volta da cauda (ganham contorno, então aparecem no fundo)
    for pts in (((42, 19), (45, 16), (46, 19), (49, 14)),
                ((51, 13), (53, 10), (54, 13), (57, 9)),
                ((45, 36), (48, 33), (50, 36), (53, 32))):
        t.linha(list(pts), AZUL_F, 1)
    # cauda: dura e reta, quase na horizontal, afinando até a ponta de penas
    t.poli([(36, 25), (53, 21), (54, 25), (40, 35)], VERDE)
    t.poli([(38, 31), (54, 24), (54, 25), (40, 35)], VERDE_M)
    t.poli([(52, 21), (57, 17), (56, 21), (60, 21), (57, 23), (59, 26), (53, 25)], AMARELO)
    t.poli([(54, 24), (59, 26), (53, 25)], OURO)
    # perna de trás (a do fundo): coxa, canela pra trás, pé pra frente
    PF = escurecer(VERDE, 0.32)
    t.elipse(41, 35, 5, 6, PF)
    t.poli([(38, 37), (44, 37), (49, 47), (45, 49)], PF)
    t.poli([(45, 46), (49, 47), (46, 56), (43, 56)], PF)
    t.poli([(41, 55), (47, 55), (48, 58), (37, 58), (38, 56)], PF)
    # corpo magro, inclinado pra frente
    volume(t, 30, 32, 11, 6, AMARELO, 0.12)
    t.poli([(33, 26), (41, 27), (42, 36), (34, 38)], VERDE)        # quadril verde
    # pescoço em S
    t.poli([(18, 22), (24, 20), (27, 28), (22, 35), (15, 29)], AMARELO)
    t.poli([(22, 26), (27, 28), (22, 35), (20, 31)], AMARELO_S)
    # perna da frente: coxa forte, canela pra trás, pé chato com a foice
    volume(t, 35, 36, 6, 7, VERDE, 0.25)
    t.poli([(31, 39), (39, 40), (39, 48), (35, 49)], VERDE)
    t.poli([(37, 42), (39, 40), (39, 48), (36, 48)], VERDE_M)
    t.poli([(35, 46), (39, 47), (33, 56), (29, 55)], VERDE)
    t.poli([(28, 54), (33, 54), (34, 59), (21, 59), (22, 57)], VERDE)
    # bracinho com garras, encolhido
    t.poli([(20, 32), (25, 31), (21, 40), (17, 39)], AMARELO)
    t.poli([(23, 33), (25, 31), (21, 40), (20, 39)], AMARELO_S)
    # cabeça do DRACOZOLT: crânio + bico comprido
    volume(t, 17, 17, 7, 6, AMARELO, 0.12)
    t.poli([(12, 14), (2, 19), (3, 23), (14, 23)], AMARELO)        # bico
    t.poli([(3, 22), (14, 20), (14, 23), (3, 23)], AMARELO_S)
    # crista de penas espetadas (amarelo e ouro), jogada pra trás
    t.poli([(14, 12), (10, 1), (17, 9), (20, 0), (22, 9), (29, 3), (25, 12),
            (33, 10), (26, 17), (20, 15)], AMARELO)
    t.poli([(17, 10), (21, 3), (22, 10), (27, 6), (24, 12)], OURO)
    t.poli([(24, 13), (32, 11), (26, 16)], OURO)
    if not costas:
        t.poli([(17, 27), (23, 26), (23, 34), (19, 33)], LARANJA)  # garganta
        t.poli([(21, 35), (33, 37), (29, 39), (21, 38)], LARANJA)  # peito
        t.linha([(22, 38), (29, 39)], escurecer(LARANJA, 0.2), 1)
    else:
        t.poli([(19, 23), (34, 27), (30, 29), (21, 27)], OURO)
        t.poli([(26, 27), (40, 27), (38, 30), (28, 30)], VERDE_M)
    t.luz(poupar=(AZUL_F[:3],))
    for x, y in ((49, 14), (57, 9), (53, 32)):                     # ponta acesa
        t.px(x, y, BRANCO)
    # anéis rosas na cauda e listras na coxa (o quarto de baixo do DRACOZOLT)
    for x, y in ((42, 26), (46, 25), (50, 23)):
        t.linha([(x, y), (x + 2, y + 6)], ROSA, 1)
    for a, b in (((32, 32), (38, 31)), ((31, 36), (39, 36)), ((32, 43), (37, 43))):
        t.linha([a, b], ROSA, 1)
    t.linha([(40, 33), (44, 35)], escurecer(ROSA, 0.3), 1)
    t.linha([(44, 41), (46, 44)], escurecer(ROSA, 0.3), 1)
    # espinhos rosas nas costas, dois tons
    for x, y in ((24, 27), (29, 26), (34, 26), (39, 26)):
        t.poli([(x - 2, y + 1), (x + 1, y - 4), (x + 2, y + 1)], ROSA_C)
        t.linha([(x + 1, y - 3), (x + 2, y)], ROSA, 1)
    # garras: mão, pé, a FOICE levantada
    t.pxs([(16, 40), (17, 41), (19, 41), (20, 42)], BRANCO)
    t.pxs([(20, 59), (21, 60), (24, 60), (25, 60)], BRANCO)
    t.linha([(30, 54), (28, 50), (26, 49)], BRANCO, 2)
    t.px(25, 50, BRANCO)
    t.pxs([(36, 58), (37, 59), (40, 59)], (200, 200, 210, 255))
    if not costas:
        t.linha([(3, 21), (13, 21)], escurecer(OURO, 0.4), 1)    # boca
        t.pxs([(2, 20), (2, 21)], escurecer(OURO, 0.4))
        t.px(5, 18, escurecer(OURO, 0.3))                          # narina
        t.elipse(16, 17, 3, 2, ROSA)                               # máscara rosa
        t.pxs([(13, 18), (19, 16)], ROSA_C)
        olho(t, 16, 17, 1)
        t.linha([(12, 14), (19, 15)], VERMELHO, 1)                 # sobrancelha brava
    else:
        t.linha([(20, 10), (22, 22)], OURO, 1)
    t.contorno()
    return t


# ------------------------------------------------------------ ABISSOVISH
def abissovish(t, costas=False):
    """Megalodonte do fundo: corpo enorme de tubarão, costas escuras e barriga
    clara, barbatana alta cheia de cicatriz, cauda em meia-lua — e a cabeça
    do DRACOVISH, a bocarra aberta cheia de dente."""
    AZUL = (132, 188, 238, 255)
    AZUL_S = (104, 150, 214, 255)
    CORPO = (92, 110, 176, 255)
    CORPO_S = (70, 84, 140, 255)
    MARINHO = (52, 62, 104, 255)
    BARRIGA = (220, 232, 240, 255)
    BARRIGA_S = (176, 192, 214, 255)
    LISTRA = (255, 60, 109, 255)
    GENGIVA = (210, 70, 100, 255)
    BOCA = (110, 24, 30, 255)
    # cauda em meia-lua (lobo de cima maior)
    t.poli([(50, 32), (60, 10), (62, 12), (58, 32), (62, 50), (59, 51), (52, 40)], MARINHO)
    # barbatana dorsal alta
    t.poli([(26, 22), (36, 4), (39, 6), (44, 24)], MARINHO)
    # o corpo enorme, fusiforme
    t.poli([(12, 26), (28, 18), (44, 20), (56, 32), (54, 38), (44, 48), (26, 52), (12, 44)], CORPO_S)
    t.poli([(14, 26), (28, 19), (43, 21), (54, 32), (40, 38), (16, 38)], CORPO)
    t.poli([(30, 20), (42, 22), (36, 26), (28, 24)], clarear(CORPO, 0.18))
    if not costas:
        t.poli([(22, 44), (40, 41), (54, 36), (44, 48), (26, 52)], BARRIGA)
        t.poli([(30, 49), (44, 46), (50, 41), (44, 48), (26, 52)], BARRIGA_S)
    # peitorais
    t.poli([(26, 44), (34, 46), (22, 60), (18, 58)], MARINHO)
    t.poli([(44, 44), (48, 44), (48, 54)], MARINHO)
    t.poli([(46, 20), (50, 18), (50, 25)], MARINHO)                # segunda dorsal
    # cabeça do DRACOVISH, menor, enfiada na frente do tubarão
    t.elipse(12, 25, 9, 8, AZUL_S)
    t.elipse(11, 24, 8, 7, AZUL)
    t.poli([(3, 30), (20, 30), (19, 44), (11, 47), (5, 41)], AZUL_S)  # mandíbula
    t.poli([(3, 30), (16, 30), (14, 40), (6, 40)], AZUL)
    t.luz()
    # listra vermelha no alto da cabeça (do DRACOVISH)
    t.linha([(5, 18), (11, 16), (19, 19)], LISTRA, 2)
    if costas:
        # vista de trás: costas escuras, listra descendo, guelras dos dois lados
        t.poli([(16, 26), (30, 21), (44, 22), (52, 32), (30, 30)], MARINHO)
        t.linha([(19, 19), (30, 24), (46, 27)], LISTRA, 1)
        for x in (24, 27, 30):
            t.linha([(x, 32), (x - 1, 40)], MARINHO, 1)
        for x, y in ((34, 34), (40, 31), (46, 34)):                # cicatrizes
            t.linha([(x, y), (x + 3, y + 2)], clarear(CORPO, 0.35), 1)
        t.linha([(36, 8), (40, 22)], CORPO, 1)
    else:
        # guelras
        for x in (24, 27, 30, 33):
            t.linha([(x, 30), (x - 1, 39)], MARINHO, 1)
        # cicatrizes de briga no flanco e na barbatana
        t.linha([(38, 28), (43, 32)], clarear(CORPO, 0.35), 1)
        t.linha([(42, 27), (46, 30)], clarear(CORPO, 0.35), 1)
        t.pxs([(34, 12), (35, 14), (36, 16)], clarear(MARINHO, 0.3))
        # bocarra aberta
        t.poli([(3, 30), (19, 29), (17, 41), (10, 43), (4, 38)], BOCA)
        t.poli([(8, 34), (16, 33), (14, 40), (9, 40)], escurecer(BOCA, 0.4))
        t.linha([(4, 30), (18, 29)], GENGIVA, 2)
        t.linha([(6, 42), (16, 41)], GENGIVA, 1)
        for x in range(4, 18, 3):                                   # dentes de cima
            t.poli([(x, 30), (x + 2, 30), (x + 1, 34)], BRANCO)
        for x in range(6, 17, 3):                                   # dentes de baixo
            t.poli([(x, 41), (x + 2, 41), (x + 1, 37)], BRANCO)
        olho(t, 14, 22, 2, iris=MARINHO)
        t.anel(14, 22, 3, 3, BRANCO, 1)
        t.px(14, 22, PRETO)
    t.contorno()
    return t


# ----------------------------------------------------------- DRACOSSAURO
def dracossauro(t, costas=False):
    """O pescoçudo manso: corpo de saurópode verde com listras rosa, as
    pernas grossas e curtas dos Dracos, pescoço e cauda compridos."""
    CABECA = (57, 174, 90, 255)
    VERDE_M = escurecer(VERDE, 0.16)
    BARRIGA = (236, 206, 150, 255)
    BARRIGA_S = (204, 170, 116, 255)
    PE = (255, 142, 160, 255)
    UNHA = (250, 236, 230, 255)
    # cauda longa, afinando pra direita
    t.poli([(40, 35), (54, 39), (61, 46), (60, 49), (50, 47), (38, 46)], VERDE)
    t.poli([(44, 43), (52, 44), (60, 49), (50, 47), (40, 46)], VERDE_M)
    # pernas do fundo
    t.ret(19, 44, 25, 56, VERDE_E)
    t.ret(37, 44, 43, 56, VERDE_E)
    # corpo em três tons
    volume(t, 32, 40, 15, 11, VERDE, 0.25, 0.12)
    # pescoço comprido subindo pra esquerda
    t.poli([(18, 36), (10, 11), (16, 9), (28, 34)], VERDE)
    t.poli([(14, 14), (16, 9), (28, 34), (22, 35)], VERDE_M)
    # cabeça
    t.elipse(11, 10, 7, 5, CABECA)
    t.poli([(5, 8), (1, 11), (2, 14), (12, 14)], CABECA)
    t.poli([(2, 13), (12, 13), (13, 15), (4, 15)], escurecer(CABECA, 0.2))
    # pernas da frente
    t.ret(24, 46, 31, 57, VERDE)
    t.ret(41, 46, 48, 57, VERDE)
    t.ret(29, 46, 31, 57, VERDE_M)
    t.ret(46, 46, 48, 57, VERDE_M)
    if not costas:
        t.elipse(30, 46, 10, 4, BARRIGA)
        t.poli([(22, 48), (38, 48), (36, 50), (24, 50)], BARRIGA_S)
    t.luz()
    if not costas:
        for x in (24, 28, 32, 36):                                  # placas da barriga
            t.linha([(x, 43), (x, 49)], BARRIGA_S, 1)
    # listras rosas e pintas
    for x in range(20, 46, 5):
        t.linha([(x, 31), (x + 3, 38)], ROSA, 1)
    for x, y in ((22, 40), (28, 38), (34, 40), (40, 38), (44, 42)):
        t.pxs([(x, y), (x + 1, y), (x, y + 1)], VERDE_E)
    for y in (17, 22, 27):
        t.linha([(12, y), (18, y + 2)], ROSA, 1)
    for x in (48, 53, 57):
        t.linha([(x, 41), (x - 1, 46)], ROSA, 1)
    # espinhos rosas na crista do lombo e da nuca
    for x, y in ((24, 30), (30, 28), (36, 29), (42, 31), (48, 36)):
        t.poli([(x - 2, y + 1), (x, y - 3), (x + 2, y + 1)], ROSA_C)
        t.linha([(x, y - 2), (x + 1, y)], ROSA, 1)
    for x, y in ((15, 6), (17, 11)):
        t.poli([(x, y), (x + 3, y - 2), (x + 2, y + 2)], ROSA_C)
    # pés rosados com três unhas
    for x in (19, 37):
        t.ret(x, 55, x + 6, 57, escurecer(PE, 0.25))
    for x in (24, 41):
        t.ret(x, 56, x + 7, 59, PE)
        t.pxs([(x + 1, 60), (x + 3, 60), (x + 5, 60)], UNHA)
    if not costas:
        t.elipse(10, 9, 2, 2, BRANCO)                               # olho manso
        t.pxs([(9, 9), (10, 9), (9, 10), (10, 10)], PRETO)
        t.px(9, 9, BRANCO)
        t.linha([(8, 6), (12, 6)], VERDE_E, 1)
        t.px(3, 10, VERDE_E)                                        # narina
        t.linha([(2, 13), (7, 13), (9, 12)], VERDE_E, 1)            # sorriso
        t.pxs([(13, 12), (14, 12)], ROSA_C)                         # bochecha
    else:
        t.linha([(14, 10), (24, 34)], VERDE_E, 1)
        t.linha([(26, 31), (46, 33)], VERDE_E, 1)
    t.contorno()
    return t


DESENHOS = {
    1092: (turbozolt, "turbozolt"),
    1093: (abissovish, "abissovish"),
    1094: (dracossauro, "dracossauro"),
}
