#!/usr/bin/env python3
"""A TURMA (ideia do CAIO, nov/2026): seis linhas de bebê -> criança, uma
homenagem à turminha dos gibis, como a NENÊJAMA/MENINIJAMA. São bichos nossos,
cada um com o jeito de um personagem e um tipo de Pokémon:
  CEBOLETE -> CEBOLÍNIO     folhas de cebolinha no lugar do cabelo, o PLANO no papel
  MONINÊ -> MONICAPOW       dentões e o coelho de pelúcia de bater
  MELANQUINHA -> MAGALANCIA a fatia de melancia maior que ela
  LAMINHA -> CASCALAMA      sujeira, poeira e o guarda-chuva (água, nunca!)
  RABISQUINHA -> MARINARTE  o lápis gigante, o laço e os respingos de tinta
  CACHINHO -> MILECACHOS    o cabelo cacheado enorme, soltando faísca

Mesmo jeito do COELHATRASADO (tools/coelhatrasado/sprite.py): peças num mapa de
MATERIAIS, acabamento de luz/sombra/contorno e os detalhes pixel a pixel. Um
molde de BEBÊ (sentadinho, cabeção) e um de CRIANÇA (de pé), e cada um ganha o
que é dele por cima.
    python3 tools/turma/sprite.py
"""
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "coelhatrasado"))
from sprite import Tela, acabamento, ROOT  # noqa: E402
from PIL import Image  # noqa: E402


def mat(b, l, s, c):
    return (b, l, s, c)


PELE = mat((250, 214, 180), (255, 232, 206), (222, 170, 140), (110, 64, 52))
PELE_ESCURA = mat((150, 96, 64), (182, 126, 90), (116, 70, 44), (56, 30, 16))
BASE = {
    "cabelo":  mat((40, 36, 44), (74, 68, 82), (24, 20, 28), (10, 8, 12)),
    "folha":   mat((90, 180, 70), (140, 220, 110), (56, 130, 44), (20, 60, 16)),
    "papel":   mat((248, 248, 240), (255, 255, 255), (214, 214, 200), (90, 90, 80)),
    "cebola":  mat((240, 226, 236), (255, 246, 252), (206, 176, 200), (96, 60, 86)),
    "coelho":  mat((110, 150, 226), (150, 186, 246), (76, 110, 186), (26, 40, 90)),
    "casca":   mat((60, 150, 60), (100, 190, 90), (36, 106, 40), (16, 50, 16)),
    "polpa":   mat((236, 64, 76), (255, 120, 120), (190, 40, 56), (90, 16, 24)),
    "lama":    mat((120, 84, 50), (150, 110, 72), (90, 60, 34), (44, 28, 14)),
    "poeira":  mat((176, 160, 136), (206, 192, 170), (146, 128, 104), (90, 76, 58)),
    "guarda":  mat((200, 60, 60), (236, 100, 100), (150, 36, 40), (66, 14, 18)),
    "lapis":   mat((246, 200, 60), (255, 228, 120), (210, 160, 30), (100, 70, 10)),
    "borracha": mat((240, 140, 170), (255, 180, 200), (200, 100, 130), (100, 40, 60)),
    "ponta":   mat((230, 196, 150), (250, 222, 180), (196, 160, 110), (90, 64, 30)),
    "laco":    mat((226, 60, 90), (250, 110, 130), (170, 36, 60), (80, 12, 26)),
    "ruivo":   mat((222, 110, 50), (246, 150, 80), (178, 76, 30), (86, 34, 10)),
    "cacho":   mat((70, 44, 30), (104, 70, 48), (48, 28, 18), (22, 12, 6)),
    "faixa":   mat((250, 210, 60), (255, 236, 130), (210, 166, 30), (100, 70, 10)),
    "giz":     mat((90, 120, 230), (130, 160, 250), (60, 86, 186), (20, 30, 90)),
    "sapato":  mat((60, 54, 66), (96, 90, 104), (40, 36, 46), (16, 14, 20)),
    "preto":   mat((50, 50, 60), (80, 80, 92), (34, 34, 42), (12, 12, 16)),
    "ouro":    mat((232, 184, 48), (255, 228, 120), (168, 120, 24), (100, 62, 8)),
    "gola":    mat((248, 248, 250), (255, 255, 255), (206, 206, 220), (70, 70, 90)),
    "coracao": mat((220, 30, 50), (250, 80, 90), (160, 16, 34), (70, 6, 14)),
}


def roupa(b):
    """um material de roupa a partir da cor base"""
    r, g, bl = b
    return mat(b, tuple(min(255, int(v * 1.22) + 16) for v in b), tuple(int(v * 0.72) for v in b),
               tuple(int(v * 0.3) for v in b))


# ---------------------------------------------------------------- os moldes

def crianca(t, roupa_de_cima, vestido=True, short="preto"):
    t.ret(42, 68, 46, 79, "pele")
    t.ret(50, 68, 54, 79, "pele")
    t.elipse(44, 81, 4.4, 2.4, "sapato")
    t.elipse(52, 81, 4.4, 2.4, "sapato")
    if vestido:
        t.poligono([(40, 44), (56, 44), (61, 70), (35, 70)], roupa_de_cima)
    else:
        t.ret(39, 59, 57, 67, short)
        t.poligono([(39, 44), (57, 44), (58, 61), (38, 61)], roupa_de_cima)
    t.elipse(36, 52, 2.8, 7, "pele", 12)
    t.elipse(60, 52, 2.8, 7, "pele", -12)
    t.elipse(35, 59, 2.6, 2.6, "pele")
    t.elipse(61, 59, 2.6, 2.6, "pele")
    t.ret(46, 39, 50, 44, "pele")
    t.elipse(48, 31, 10, 10, "pele")


def bebe(t, roupa_de_bebe):
    t.elipse(48, 70, 11, 10, roupa_de_bebe)
    t.elipse(41, 80, 4.8, 3, roupa_de_bebe)
    t.elipse(55, 80, 4.8, 3, roupa_de_bebe)
    t.elipse(38, 68, 3, 4.6, roupa_de_bebe, 25)
    t.elipse(58, 68, 3, 4.6, roupa_de_bebe, -25)
    t.elipse(37, 72.5, 2.3, 2.3, "pele")
    t.elipse(59, 72.5, 2.3, 2.3, "pele")
    t.elipse(48, 48, 11, 10, "pele")


def cara_crianca(c, k, sorriso=True, y=31):
    for ox in (43, 51):
        c(ox, y, (30, 24, 30)); c(ox + 1, y, (30, 24, 30)); c(ox, y + 1, (30, 24, 30)); c(ox + 1, y + 1, (30, 24, 30))
        c(ox, y, (255, 255, 255))
    if sorriso:
        for x, yy in ((45, y + 5), (46, y + 6), (47, y + 6), (48, y + 6), (49, y + 6), (50, y + 5)):
            c(x, yy, k)
    for x in (41, 42, 53, 54):
        c(x, y + 3, (250, 170, 170))


def cara_bebe(c, k, y=48):
    for ox in (42, 51):
        for dx in (0, 1, 2):
            for dy in (0, 1, 2):
                c(ox + dx, y + dy, (30, 24, 30))
        c(ox, y, (255, 255, 255)); c(ox + 2, y + 2, (255, 255, 255))
    c(47, y + 5, k); c(48, y + 5, k)
    for x in (40, 41, 55, 56):
        c(x, y + 4, (250, 170, 170))


# ---------------------------------------------------------------- a turma
def cebolinio(t):
    crianca(t, "roupa", vestido=False)
    for x, ang in ((40, -28), (44, -13), (48, 0), (52, 13), (56, 28)):       # as 5 folhas de cebolinha
        t.elipse(x, 18, 1.5, 6.5, "folha", ang)
    t.ret(60, 52, 67, 61, "papel")                                          # o PLANO INFALÍVEL


def cebolete(t):
    t.elipse(62, 73, 6.5, 6.5, "cebola")                                     # a cebola, maior que a mão
    t.elipse(62, 64, 1.4, 4, "folha")
    bebe(t, "roupa")
    for x, ang in ((44, -22), (48, 0), (52, 22)):                            # três brotinhos
        t.elipse(x, 36, 1.3, 4.2, "folha", ang)


def monicapow(t):
    # o COELHO DE PELÚCIA pendurado pela orelha (atrás da mão)
    t.elipse(66, 69, 5, 6, "coelho")
    t.elipse(66, 60, 4.2, 4, "coelho")
    t.elipse(64.5, 52, 1.5, 4.5, "coelho", -8)
    t.elipse(67.5, 52, 1.5, 4.5, "coelho", 8)
    crianca(t, "roupa", vestido=True)
    t.elipse(48, 26, 11, 7, "cabelo")
    t.ret(37, 26, 40, 37, "cabelo")
    t.ret(56, 26, 59, 37, "cabelo")


def monine(t):
    t.elipse(64, 72, 7, 8, "coelho")                                          # o coelho, maior que ela
    t.elipse(64, 58, 6, 5.5, "coelho")
    t.elipse(61, 47, 1.9, 6, "coelho", -8)
    t.elipse(67, 47, 1.9, 6, "coelho", 8)
    bebe(t, "roupa")
    t.elipse(48, 41, 8, 4, "cabelo")


def magalancia(t):
    crianca(t, "roupa", vestido=True)
    t.elipse(48, 26, 11, 7, "cabelo")
    t.ret(37, 26, 40, 38, "cabelo")
    t.ret(56, 26, 59, 38, "cabelo")
    t.ret(40, 23, 56, 26, "cabelo")                                          # a franja
    t.poligono([(57, 49), (73, 49), (65, 62)], "casca")                       # a MELANCIA
    t.poligono([(59, 49), (71, 49), (65, 59)], "polpa")


def melanquinha(t):
    bebe(t, "roupa")
    t.elipse(48, 40, 6, 3, "cabelo")
    t.poligono([(53, 54), (81, 54), (67, 78)], "casca")                       # a fatia GIGANTE
    t.poligono([(56, 54), (78, 54), (67, 74)], "polpa")


def cascalama(t):
    t.elipse(48, 80, 17, 5, "poeira")                                         # a nuvem de poeira no pé
    t.ret(65, 40, 66, 66, "guarda")                                          # o guarda-chuva fechado
    t.poligono([(63, 46), (68, 46), (66, 64), (65, 64)], "guarda")
    crianca(t, "roupa", vestido=False, short="guarda")
    for x0, y0, x1, y1 in ((40, 20, 44, 26), (45, 18, 49, 24), (50, 19, 54, 25), (54, 22, 57, 27)):   # os tufos espetados
        t.poligono([(x0, y1), ((x0 + x1) / 2, y0), (x1, y1)], "cabelo")


def laminha(t):
    t.elipse(48, 82, 19, 4.4, "lama")                                         # a poça de lama
    bebe(t, "roupa")
    t.poligono([(44, 40), (46, 35), (48, 39), (50, 35), (52, 40)], "cabelo")


def marinarte(t):
    t.poligono([(60, 34), (64, 32), (72, 64), (68, 66)], "lapis")              # o LÁPIS gigante
    t.poligono([(68, 66), (72, 64), (71, 70)], "ponta")
    t.poligono([(60, 34), (64, 32), (63, 29), (59, 31)], "borracha")
    crianca(t, "roupa", vestido=True)
    t.elipse(48, 26, 11, 7, "ruivo")
    t.ret(37, 26, 41, 46, "ruivo")
    t.ret(55, 26, 59, 46, "ruivo")
    t.poligono([(48, 20), (41, 15), (41, 23)], "laco")                         # o laço
    t.poligono([(48, 20), (55, 15), (55, 23)], "laco")


def rabisquinha(t):
    t.poligono([(58, 52), (62, 50), (70, 78), (66, 80)], "giz")                # o giz de cera gigante
    t.poligono([(66, 80), (70, 78), (69, 84)], "giz")
    bebe(t, "roupa")
    t.elipse(48, 40, 7, 3.5, "ruivo")
    t.poligono([(48, 37), (43, 33), (43, 40)], "laco")
    t.poligono([(48, 37), (53, 33), (53, 40)], "laco")


def milecachos(t):
    t.elipse(48, 24, 16, 13, "cacho")                                         # o CABELO cacheado enorme (atrás)
    crianca(t, "roupa", vestido=True)
    t.elipse(48, 21, 10, 3, "cacho")
    t.ret(38, 23, 58, 25, "faixa")                                            # a faixa, por cima do cabelo


def cachinho(t):
    t.elipse(48, 38, 15, 12, "cacho")
    bebe(t, "roupa")
    t.elipse(48, 39, 10, 3.5, "cacho")


def rainhacopa(t):
    # o CETRO de coração, na mão direita (atrás da mão)
    t.ret(62, 40, 64, 70, "ouro")
    t.poligono([(63, 41), (58, 36), (59, 33), (61, 32), (63, 34), (65, 32), (67, 33), (68, 36)], "coracao")
    # o VESTIDO de rainha: rodado, vermelho, com a faixa preta no meio
    t.poligono([(40, 46), (56, 46), (71, 83), (25, 83)], "roupa")
    t.poligono([(45, 47), (51, 47), (57, 83), (39, 83)], "preto")
    t.ret(25, 81, 71, 83, "ouro")                                            # a barra dourada
    t.elipse(36, 54, 3, 8, "roupa", 15)
    t.elipse(60, 54, 3, 8, "roupa", -15)
    t.elipse(34.5, 62, 2.6, 2.6, "pele")
    t.elipse(62.5, 62, 2.6, 2.6, "pele")
    t.ret(46, 40, 50, 45, "pele")
    t.elipse(48, 44, 11, 3.4, "gola")                                        # a gola de babado
    # a cabeça, o COQUE e a COROA
    t.elipse(48, 33, 8, 8.5, "pele")
    t.elipse(48, 26, 9.5, 5.5, "cabelo")
    t.ret(39, 26, 41, 34, "cabelo")
    t.ret(55, 26, 57, 34, "cabelo")
    t.elipse(48, 19, 5, 3.6, "cabelo")
    t.ret(42, 14, 54, 18, "ouro")
    for x in (43, 48, 53):
        t.poligono([(x - 2, 14), (x, 8), (x + 2, 14)], "ouro")


def copinha(t):
    t.ret(60, 60, 61, 72, "ouro")                                            # o CHOCALHO de coração
    t.poligono([(60.5, 61), (56, 57), (57, 54), (59, 53), (60.5, 55), (62, 53), (64, 54), (65, 57)], "coracao")
    bebe(t, "roupa")
    t.elipse(48, 40, 6, 3, "cabelo")
    t.ret(43, 35, 53, 38, "ouro")                                            # a coroinha
    for x in (44, 48, 52):
        t.poligono([(x - 1.5, 35), (x, 31), (x + 1.5, 35)], "ouro")


# o detalhe de cada um (cara, peças finas), e a cor da roupa
def det_cebolinio(c, k, p):
    cara_crianca(c, k)
    for y in (55, 57, 59):                                                  # o "PLANO" rabiscado
        for x in range(61, 66):
            if (x + y) % 2:
                c(x, y, (80, 80, 160))
    c(62, 53, (220, 60, 60)); c(63, 53, (220, 60, 60))


def det_cebolete(c, k, p):
    cara_bebe(c, k)
    for x, y in ((60, 71), (62, 69), (64, 72)):
        c(x, y, (190, 150, 190))


def det_monicapow(c, k, p):
    cara_crianca(c, k)
    c(47, 37, (255, 255, 255)); c(48, 37, (255, 255, 255)); c(47, 38, (255, 255, 255)); c(48, 38, (255, 255, 255))   # os DENTÕES
    c(46, 37, k); c(49, 37, k); c(47, 39, k); c(48, 39, k)
    c(65, 59, (20, 20, 40)); c(67, 59, (20, 20, 40))                         # os olhinhos do coelho
    c(66, 61, (240, 140, 170))


def det_monine(c, k, p):
    cara_bebe(c, k)
    c(47, 54, (255, 255, 255)); c(48, 54, (255, 255, 255))                   # os dentinhos
    c(62, 57, (20, 20, 40)); c(66, 57, (20, 20, 40)); c(64, 60, (240, 140, 170))


def det_magalancia(c, k, p):
    cara_crianca(c, k, sorriso=False)
    for x, y in ((46, 36), (47, 37), (48, 37), (49, 36)):                    # a boca mastigando
        c(x, y, k)
    c(47, 36, (236, 64, 76)); c(48, 36, (236, 64, 76))
    for x, y in ((62, 52), (65, 54), (68, 52), (64, 51), (66, 51)):          # as sementes
        c(x, y, (30, 24, 20))


def det_melanquinha(c, k, p):
    cara_bebe(c, k)
    for x, y in ((60, 58), (64, 62), (68, 57), (72, 59), (66, 66), (70, 63)):
        c(x, y, (30, 24, 20))
    c(46, 54, (236, 64, 76)); c(49, 54, (236, 64, 76))                        # a boca suja de melancia


def det_cascalama(c, k, p):
    cara_crianca(c, k)
    lama = (120, 84, 50)
    for x, y in ((41, 34), (55, 30), (42, 50), (54, 47), (44, 72), (52, 75), (36, 56), (60, 55)):   # as manchas de sujeira
        c(x, y, lama); c(x + 1, y, lama)
    for x, y in ((30, 76), (33, 73), (64, 74), (67, 77)):                    # a poeirinha subindo
        c(x, y, (206, 192, 170))


def det_laminha(c, k, p):
    cara_bebe(c, k)
    lama = (120, 84, 50)
    for x, y in ((40, 52), (55, 45), (42, 66), (53, 72), (47, 64), (58, 70)):
        c(x, y, lama); c(x + 1, y, lama); c(x, y + 1, lama)


def det_marinarte(c, k, p):
    cara_crianca(c, k)
    for x, y, cor in ((40, 52, (80, 140, 230)), (54, 58, (250, 200, 60)), (44, 64, (230, 70, 90)), (52, 49, (90, 190, 90))):
        c(x, y, cor); c(x + 1, y, cor); c(x, y + 1, cor)                     # os respingos de tinta


def det_rabisquinha(c, k, p):
    cara_bebe(c, k)
    for i, x in enumerate(range(22, 40)):                                    # o rabisco no chão
        c(x, 84 + (i % 4 if i % 8 < 4 else 4 - i % 4), (90, 120, 230))


def det_milecachos(c, k, p):
    cara_crianca(c, k)
    for x, y in ((34, 18), (36, 14), (40, 30), (58, 16), (61, 22), (56, 30)):   # os cachinhos
        c(x, y, (104, 70, 48)); c(x + 1, y + 1, (48, 28, 18))
    for x, y in ((30, 12), (31, 13), (30, 14), (65, 10), (66, 11), (65, 12)):   # as FAÍSCAS
        c(x, y, (255, 236, 90))


def coracaozinho(c, x, y, cor):
    for dx, dy in ((0, 0), (2, 0), (-1, 1), (0, 1), (1, 1), (2, 1), (3, 1), (0, 2), (1, 2), (2, 2), (1, 3)):
        c(x + dx, y + dy, cor)


def det_rainhacopa(c, k, p):
    # a cara de brava: sobrancelha em V, olho, boca vermelha e o coraçãozinho na bochecha
    for x, y in ((43, 30), (44, 31), (45, 31), (51, 31), (52, 31), (53, 30)):
        c(x, y, k)
    for ox in (44, 51):
        c(ox, 33, (30, 24, 30)); c(ox + 1, 33, (30, 24, 30)); c(ox, 32, (255, 255, 255))
    for x in (46, 47, 48, 49, 50):
        c(x, 37, (200, 30, 50))
    c(47, 36, (200, 30, 50)); c(49, 36, (200, 30, 50))
    c(54, 35, (230, 60, 80)); c(55, 35, (230, 60, 80))
    for y in (52, 60, 68, 76):                                              # os coraçõezinhos brancos da faixa
        coracaozinho(c, 47, y, (250, 250, 255))
    c(48, 15, (230, 30, 60)); c(48, 16, (230, 30, 60))                      # a pedra da coroa
    for x in range(27, 70, 4):                                              # o bordado da barra
        c(x, 82, (255, 240, 170))


def det_copinha(c, k, p):
    cara_bebe(c, k)
    for x, y in ((44, 64), (52, 68), (47, 74)):
        coracaozinho(c, x, y, (250, 250, 255))
    c(48, 36, (230, 30, 60))


def det_cachinho(c, k, p):
    cara_bebe(c, k)
    for x, y in ((36, 32), (40, 28), (56, 28), (60, 34), (48, 27)):
        c(x, y, (104, 70, 48)); c(x + 1, y + 1, (48, 28, 18))
    for x, y in ((31, 28), (32, 29), (31, 30), (64, 26), (65, 27), (64, 28)):
        c(x, y, (255, 236, 90))


# (nº, desenho, detalhe, cor da roupa, pele, cor da roupa do shiny)
TURMA = [
    (1138, cebolete, det_cebolete, (80, 170, 80), PELE, (230, 200, 60)),
    (1139, cebolinio, det_cebolinio, (80, 170, 80), PELE, (230, 200, 60)),
    (1140, monine, det_monine, (220, 50, 50), PELE, (60, 160, 220)),
    (1141, monicapow, det_monicapow, (220, 50, 50), PELE, (60, 160, 220)),
    (1142, melanquinha, det_melanquinha, (246, 210, 60), PELE, (240, 150, 190)),
    (1143, magalancia, det_magalancia, (246, 210, 60), PELE, (240, 150, 190)),
    (1144, laminha, det_laminha, (220, 210, 190), PELE, (180, 220, 240)),
    (1145, cascalama, det_cascalama, (246, 214, 70), PELE, (150, 220, 150)),
    (1146, rabisquinha, det_rabisquinha, (120, 190, 240), PELE, (190, 140, 230)),
    (1147, marinarte, det_marinarte, (120, 190, 240), PELE, (190, 140, 230)),
    (1148, cachinho, det_cachinho, (160, 90, 200), PELE_ESCURA, (240, 120, 80)),
    (1149, milecachos, det_milecachos, (160, 90, 200), PELE_ESCURA, (240, 120, 80)),
    (1150, copinha, det_copinha, (210, 40, 60), PELE, (60, 60, 70)),
    (1151, rainhacopa, det_rainhacopa, (210, 40, 60), PELE, (60, 60, 70)),
]


def gera(desenho, detalhe, cor, pele):
    pal = dict(BASE, pele=pele, roupa=roupa(cor))
    t = Tela()
    desenho(t)
    im = acabamento(t, pal)
    px = im.load()
    c = lambda x, y, cr: px.__setitem__((x, y), cr + (255,)) if 0 <= x < 96 and 0 <= y < 96 else None
    detalhe(c, pele[3], pal)
    return im


if __name__ == "__main__":
    pasta = os.path.join(ROOT, "assets", "sprites", "pokemon")
    feitos = []
    for dex, desenho, detalhe, cor, pele, cor_shiny in TURMA:
        comum, brilho = gera(desenho, detalhe, cor, pele), gera(desenho, detalhe, cor_shiny, pele)
        comum.save(os.path.join(pasta, f"{dex}.png"))
        brilho.save(os.path.join(pasta, "shiny", f"{dex}.png"))
        feitos.append(comum)
    prev = Image.new("RGBA", (100 * 7, 96 * 2), (52, 56, 66, 255))
    for i, im in enumerate(feitos):
        prev.alpha_composite(im, ((i // 2) * 100, (i % 2) * 96))
    prev.resize((prev.width * 3, prev.height * 3), Image.NEAREST).save(os.environ.get("PREVIA", "/tmp/turma_prev.png"))
    print("A TURMA (1138-1149) -> assets/sprites/pokemon/ (+ shiny)")
