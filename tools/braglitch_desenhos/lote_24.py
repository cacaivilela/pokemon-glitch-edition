"""Lote 24: as 14 formas da ILHA 5, ITAPARICHU (a Ilha de Itaparica, na Bahia).

Do outro lado da baía, os bichos que ficaram na ilha por gerações pegaram o
jeito do lugar: a roda de capoeira e o berimbau, o tabuleiro da baiana com o
acarajé frito no dendê, a moqueca na panela de barro, o saveiro de vela
cruzando a baía, as fitinhas do Senhor do Bonfim e as flores que se levam pro
mar no dia de Iemanjá. Cada desenho parte da silhueta do Pokémon de sempre —
dá pra reconhecer o MACHOP, a LAPRAS, o SPOINK — e troca o resto pela coisa da
ilha. Nível 25 a 29.
"""
import math

from pixelart import Tela, clarear, escurecer  # noqa: F401

BRANCO = (250, 250, 250, 255)
PRETO = (30, 26, 34, 255)
VAZIO = (0, 0, 0, 0)

# o mar da baía
MAR = (70, 150, 210, 255)
MAR_E = (40, 104, 170, 255)
ESPUMA = (220, 240, 250, 255)

# as cores das fitinhas do Bonfim
FITAS = [(60, 170, 80, 255), (250, 210, 50, 255), (60, 110, 220, 255),
         (220, 50, 60, 255), (240, 130, 190, 255), (250, 250, 250, 255)]

DENDE = (232, 96, 24, 255)
DENDE_C = (255, 170, 60, 255)


def olho(t, cx, cy, r=2, iris=PRETO, brilho=BRANCO):
    t.elipse(cx, cy, r, r, iris)
    t.px(cx - 1, cy - 1, brilho)


def _curva(pts, passos=40):
    """Uma curva suave (Catmull-Rom) passando pelos pontos, pra fita e rabo."""
    out = []
    p = [pts[0]] + list(pts) + [pts[-1]]
    for i in range(1, len(p) - 2):
        p0, p1, p2, p3 = p[i - 1], p[i], p[i + 1], p[i + 2]
        for k in range(passos):
            s = k / passos
            s2, s3 = s * s, s * s * s
            x = 0.5 * ((2 * p1[0]) + (-p0[0] + p2[0]) * s + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * s2
                       + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * s3)
            y = 0.5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * s + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * s2
                       + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * s3)
            out.append((round(x), round(y)))
    out.append(pts[-1])
    return out


def _ondas(t, y, x1=4, x2=60):
    """Faixa de mar com espuma, na base da tela."""
    t.ret(x1, y, x2, 59, MAR)
    for x in range(x1, x2 + 1):
        if (x // 4) % 2 == 0:
            t.px(x, y - 1, MAR)
    t.linha([(x1, y + 3), (x2, y + 3)], MAR_E, 1)


# ------------------------------------------------------------ MACHOP-BRAG
def machopbrag(t, costas=False):
    """MACHOP-BRAG: capoeirista na ginga — calça de abadá branca, cordão na
    cintura, um braço guardando o rosto. LUTADOR/PSÍQUICO."""
    pele = (130, 158, 178, 255)
    pele_e = escurecer(pele, 0.3)
    crista = (150, 120, 100, 255)
    abada = (244, 242, 232, 255)
    abada_e = (196, 192, 180, 255)
    cordao = (150, 90, 200, 255)

    # pernas abertas na ginga: a da esquerda esticada, a da direita dobrada
    t.poli([(22, 36), (32, 36), (20, 50), (13, 57), (5, 57), (8, 52), (17, 44)], abada)
    t.poli([(30, 36), (41, 36), (45, 44), (50, 50), (52, 57), (43, 57), (41, 50), (34, 44)], abada)
    t.poli([(4, 55), (13, 55), (14, 59), (2, 59)], pele)                          # pés
    t.poli([(43, 55), (52, 55), (56, 59), (43, 59)], pele)
    # tronco forte
    t.poli([(20, 22), (42, 22), (40, 32), (37, 38), (24, 38), (21, 32)], pele)
    # braço de trás, lá embaixo, pra equilibrar
    t.linha([(40, 25), (50, 32), (56, 28)], pele, 5)
    t.elipse(57, 27, 4, 4, pele)
    # braço da frente dobrado na guarda, na frente do rosto
    t.linha([(22, 25), (12, 22), (15, 12)], pele, 5)
    t.elipse(16, 10, 4, 4, pele)
    # cabeça com a crista de três cristas do MACHOP
    t.elipse(31, 14, 9, 9, pele)
    for x in (25, 31, 37):
        t.poli([(x - 3, 8), (x, 1), (x + 3, 8)], crista)
    t.luz()

    # cordão da capoeira, com o nó e as pontas caindo
    t.ret(22, 35, 40, 37, cordao)
    t.linha([(35, 37), (34, 44)], cordao, 2)
    t.linha([(37, 37), (39, 43)], cordao, 2)
    t.px(34, 45, clarear(cordao, 0.4))
    t.px(39, 44, clarear(cordao, 0.4))
    # dobras da calça
    t.linha([(24, 40), (17, 48)], abada_e, 1)
    t.linha([(36, 40), (42, 47)], abada_e, 1)
    t.linha([(8, 53), (14, 53)], abada_e, 1)
    t.linha([(43, 53), (51, 53)], abada_e, 1)
    # músculos
    t.linha([(31, 24), (31, 32)], pele_e, 1)
    t.linha([(25, 28), (29, 29)], pele_e, 1)
    t.linha([(37, 28), (33, 29)], pele_e, 1)
    if not costas:
        for cx in (28, 35):
            t.ret(cx - 1, 13, cx + 1, 16, BRANCO)
            t.ret(cx, 14, cx + 1, 16, (200, 40, 50, 255))
        t.linha([(26, 11), (29, 12)], PRETO, 1)
        t.linha([(37, 11), (34, 12)], PRETO, 1)
        t.linha([(29, 19), (33, 19)], pele_e, 1)
    else:
        t.linha([(31, 6), (31, 22)], pele_e, 1)
        t.linha([(26, 26), (30, 30)], pele_e, 1)
        t.linha([(36, 26), (32, 30)], pele_e, 1)
    t.contorno()
    return t


# -------------------------------------------------------------- JYNX-BRAG
def jynxbrag(t, costas=False):
    """JYNX-BRAG: baiana do acarajé — torço branco, bata e saia rodada de
    renda, fios de contas e o tabuleiro na mão. FOGO/PSÍQUICO."""
    rosto = (150, 112, 190, 255)
    cabelo = (250, 210, 70, 255)
    renda = (248, 246, 240, 255)
    renda_e = (206, 200, 190, 255)
    barra = (60, 130, 210, 255)
    tabu = (170, 120, 70, 255)
    acaraje = (196, 110, 40, 255)

    # a saia rodada
    t.poli([(22, 32), (40, 32), (52, 44), (58, 56), (52, 59), (10, 59), (4, 56), (10, 44)], renda)
    # o cabelo do JYNX escorrendo pelos ombros
    t.poli([(21, 14), (16, 30), (19, 36), (24, 30), (24, 18)], cabelo)
    t.poli([(41, 14), (46, 30), (43, 36), (38, 30), (38, 18)], cabelo)
    # a bata
    t.poli([(23, 22), (39, 22), (41, 34), (21, 34)], renda)
    # braço que segura o tabuleiro e o braço na cintura
    t.linha([(39, 25), (46, 30), (50, 26)], renda, 4)
    t.linha([(23, 25), (16, 31), (22, 35)], renda, 4)
    # o rosto
    t.elipse(31, 17, 7, 7, rosto)
    # o torço, com as voltas do pano
    t.elipse(31, 10, 12, 5, renda)
    t.elipse(32, 6, 9, 3, renda)
    t.poli([(40, 6), (47, 2), (48, 7), (42, 10)], renda)            # a ponta do laço
    # o tabuleiro de madeira com o acarajé e o tacho
    t.ret(44, 22, 62, 25, tabu)
    t.luz()

    t.linha([(21, 11), (28, 7), (40, 5)], renda_e, 1)
    t.linha([(25, 13), (33, 9), (42, 9)], renda_e, 1)
    t.linha([(42, 6), (46, 4)], renda_e, 1)
    # a renda da saia em duas faixas e a barra azul
    for y in (44, 51):
        t.linha([(9 - (y - 44) // 3, y), (53 + (y - 44) // 3, y)], renda_e, 1)
        for x in range(10, 54, 3):
            t.px(x, y + 1, renda_e)
    t.ret(6, 56, 56, 57, barra)
    t.linha([(31, 34), (31, 55)], renda_e, 1)
    # os fios de contas
    for i, y in enumerate((24, 26, 28)):
        cor = FITAS[(i * 2) % len(FITAS)]
        for x in range(25 + i, 38 - i, 2):
            t.px(x, y + (1 if 28 < x < 34 else 0), cor)
    # o acarajé no tabuleiro e o tacho de dendê fervendo
    for x in (46, 51):
        t.elipse(x, 20, 2, 2, acaraje)
        t.px(x - 1, 19, clarear(acaraje, 0.4))
    t.ret(55, 17, 61, 21, (60, 50, 50, 255))
    t.ret(56, 17, 60, 18, DENDE)
    for x, y in ((56, 15), (58, 13), (60, 15)):
        t.pxs([(x, y), (x, y + 1)], DENDE_C)
    if not costas:
        # olhos semicerrados e a boca grande do JYNX
        t.ret(26, 17, 29, 18, BRANCO)
        t.ret(33, 17, 36, 18, BRANCO)
        t.pxs([(28, 18), (34, 18)], PRETO)
        t.linha([(26, 16), (29, 16)], escurecer(rosto, 0.4), 1)
        t.linha([(33, 16), (36, 16)], escurecer(rosto, 0.4), 1)
        t.ret(29, 21, 33, 23, (236, 120, 150, 255))
        t.linha([(29, 22), (33, 22)], (170, 60, 90, 255), 1)
    else:
        t.elipse(31, 17, 7, 7, cabelo)
        t.elipse(31, 10, 12, 5, renda)
        t.linha([(22, 8), (40, 12)], renda_e, 1)
        t.linha([(26, 18), (26, 24)], escurecer(cabelo, 0.25), 1)
        t.linha([(36, 18), (36, 24)], escurecer(cabelo, 0.25), 1)
    t.contorno()
    return t


# ------------------------------------------------------------ LAPRAS-BRAG
def laprasbrag(t, costas=False):
    """LAPRAS-BRAG: o casco virou saveiro de madeira, com o mastro e a vela
    armados nas costas. ÁGUA/NORMAL."""
    azul = (80, 150, 220, 255)
    azul_e = escurecer(azul, 0.3)
    barriga = (236, 226, 190, 255)
    madeira = (150, 96, 56, 255)
    madeira_e = (104, 64, 38, 255)
    faixa = (200, 50, 50, 255)
    vela = (240, 226, 196, 255)
    vela_e = (200, 180, 150, 255)

    # o mar embaixo
    _ondas(t, 54, 2, 62)
    # o corpo azul, as nadadeiras
    t.elipse(34, 47, 20, 8, azul)
    t.poli([(14, 48), (4, 56), (12, 57), (22, 52)], azul)
    t.poli([(50, 48), (60, 55), (54, 57), (46, 52)], azul)
    # o pescoço subindo e a cabeça
    t.linha(_curva([(22, 44), (15, 34), (13, 24), (15, 17)], 12), azul, 6)
    t.elipse(13, 14, 7, 6, azul)
    t.poli([(7, 14), (1, 17), (6, 19)], azul)                         # focinho
    t.poli([(14, 8), (17, 2), (19, 9)], azul)                         # chifre
    t.elipse(18, 42, 3, 5, barriga)
    # o casco de saveiro por cima do lombo
    t.poli([(20, 36), (60, 34), (56, 42), (50, 46), (26, 46), (22, 42)], madeira)
    # o mastro e a vela
    t.ret(39, 3, 40, 36, madeira_e)
    t.poli([(41, 4), (54, 9), (60, 32), (41, 32)], vela)
    t.luz(poupar=(MAR[:3], MAR_E[:3]))

    t.ret(21, 37, 59, 38, faixa)
    t.linha([(23, 41), (57, 40)], madeira_e, 1)
    t.linha([(26, 44), (53, 43)], madeira_e, 1)
    t.linha([(47, 7), (47, 32)], vela_e, 1)
    t.linha([(53, 9), (54, 32)], vela_e, 1)
    t.linha([(41, 20), (58, 20)], vela_e, 1)
    t.linha([(40, 4), (60, 33)], vela_e, 1)
    t.linha([(12, 20), (13, 11)], azul_e, 1)
    for x in range(8, 58, 6):
        t.px(x, 54, ESPUMA)
        t.px(x + 1, 54, ESPUMA)
    if not costas:
        olho(t, 11, 13, 2)
        t.linha([(3, 18), (7, 17)], azul_e, 1)
    else:
        t.elipse(13, 14, 7, 6, azul)
        t.pxs([(12, 11), (13, 12), (14, 11)], azul_e)
    t.contorno()
    return t


# ------------------------------------------------------------ STARYU-BRAG
def _estrela(cx, cy, r1, r2, giro=-90):
    pts = []
    for i in range(10):
        a = math.radians(giro + i * 36)
        r = r1 if i % 2 == 0 else r2
        pts.append((round(cx + r * math.cos(a)), round(cy + r * math.sin(a))))
    return pts


def staryubrag(t, costas=False):
    """STARYU-BRAG: estrela-do-mar cor de coral, cheia de carocinhos, com uma
    pérola rosada no miolo. ÁGUA/FADA."""
    coral = (236, 128, 132, 255)
    coral_e = escurecer(coral, 0.3)
    coral_c = (255, 206, 190, 255)
    aro = (246, 214, 120, 255)
    perola = (250, 190, 220, 255)

    t.poli(_estrela(32, 33, 29, 12), coral)
    t.luz()
    # carocinhos pelos braços
    for i in range(5):
        a = math.radians(-90 + i * 72)
        for d in (12, 17, 22):
            x, y = round(32 + d * math.cos(a)), round(33 + d * math.sin(a))
            t.px(x, y, coral_c)
            t.px(x + 1, y + 1, coral_e)
    if not costas:
        t.elipse(32, 33, 7, 7, aro)
        t.anel(32, 33, 7, 7, escurecer(aro, 0.3), 1)
        t.elipse(32, 33, 4, 4, perola)
        t.pxs([(30, 31), (31, 31), (30, 32)], BRANCO)
        t.px(34, 35, (210, 120, 170, 255))
        for x, y in ((12, 10), (54, 12), (8, 44)):             # brilhinho de fada
            t.pxs([(x, y - 1), (x - 1, y), (x + 1, y), (x, y + 1)], (255, 200, 230, 255))
    else:
        t.elipse(32, 33, 6, 6, coral_e)
        t.elipse(32, 33, 3, 3, coral)
        for i in range(5):
            a = math.radians(-90 + i * 72)
            t.linha([(32, 33), (round(32 + 24 * math.cos(a)), round(33 + 24 * math.sin(a)))], coral_e, 1)
    t.contorno()
    return t


# ------------------------------------------------------------ HORSEA-BRAG
def horseabrag(t, costas=False):
    """HORSEA-BRAG: o cavalo-marinho amarelo da baía, de rabo enrolado e
    faixa vermelha amarrada na cabeça, pronto pra briga. ÁGUA/LUTADOR."""
    amar = (246, 186, 50, 255)
    amar_e = escurecer(amar, 0.3)
    creme = (252, 236, 180, 255)
    faixa = (210, 44, 50, 255)
    barb = (120, 190, 230, 255)

    # o rabo enrolado
    t.linha(_curva([(36, 40), (40, 48), (36, 55), (30, 54), (29, 49), (33, 47)], 10), amar, 5)
    # o corpo
    t.elipse(34, 32, 10, 12, amar)
    # a nadadeira das costas
    t.poli([(43, 26), (54, 22), (56, 30), (53, 38), (44, 38)], barb)
    # a cabeça e o focinho comprido
    t.elipse(30, 14, 9, 8, amar)
    t.poli([(22, 12), (8, 12), (6, 15), (8, 18), (22, 18)], amar)
    # os espinhos da cabeça
    for x, y in ((32, 5), (37, 7), (40, 12)):
        t.poli([(x - 2, y + 2), (x + 2, y - 3), (x + 2, y + 3)], amar)
    # as nadadeirinhas da frente, de punho fechado
    t.elipse(24, 32, 3, 3, barb)
    t.luz()

    t.elipse(31, 33, 5, 9, creme)
    for y in range(26, 42, 3):
        t.linha([(27, y), (35, y)], escurecer(creme, 0.15), 1)
    t.linha([(45, 30), (54, 26)], escurecer(barb, 0.3), 1)
    t.linha([(45, 34), (54, 33)], escurecer(barb, 0.3), 1)
    t.elipse(7, 15, 2, 2, amar_e)
    # a faixa de lutador na testa, com as pontas soltas atrás
    t.ret(24, 9, 38, 10, faixa)
    t.poli([(38, 9), (46, 6), (47, 9), (39, 11)], faixa)
    t.poli([(38, 10), (45, 14), (43, 16), (38, 11)], faixa)
    for x, y in ((12, 30), (10, 40), (16, 46)):
        t.anel(x, y, 2, 2, ESPUMA, 1)
    if not costas:
        t.elipse(28, 14, 3, 3, BRANCO)
        olho(t, 28, 14, 2, (200, 40, 50, 255))
        t.linha([(25, 11), (31, 12)], PRETO, 1)
    else:
        t.elipse(30, 14, 7, 6, amar)
        t.linha([(34, 20), (38, 44)], amar_e, 1)
    t.contorno()
    return t


# ---------------------------------------------------------- REMORAID-BRAG
def remoraidbrag(t, costas=False):
    """REMORAID-BRAG: peixe-voador pulando da onda com as nadadeiras abertas
    feito asa. ÁGUA/VOADOR."""
    lombo = (70, 110, 170, 255)
    lombo_e = escurecer(lombo, 0.3)
    prata = (210, 220, 232, 255)
    asa = (150, 200, 240, 255)
    asa_e = (90, 150, 210, 255)

    _ondas(t, 52, 2, 62)
    # a asa de trás
    t.poli([(36, 34), (46, 10), (56, 12), (46, 34)], asa_e)
    # o rabo em forquilha, ainda molhado
    t.poli([(46, 36), (60, 24), (62, 28), (54, 38), (62, 50), (58, 52)], lombo)
    # o corpo comprido
    t.poli([(4, 36), (10, 30), (26, 27), (42, 30), (50, 36), (42, 42), (24, 44), (10, 42)], lombo)
    # a barriga de prata
    t.poli([(8, 39), (24, 38), (44, 37), (40, 42), (22, 44), (10, 42)], prata)
    # a asa da frente
    t.poli([(20, 32), (10, 8), (22, 4), (38, 12), (32, 32)], asa)
    # nadadeira de baixo, pequena
    t.poli([(26, 42), (22, 50), (32, 46)], asa)
    t.luz(poupar=(MAR[:3], MAR_E[:3]))

    for a, b in (((21, 30), (13, 9)), ((24, 30), (20, 6)), ((28, 30), (29, 9)), ((30, 31), (36, 13))):
        t.linha([a, b], asa_e, 1)
    t.linha([(40, 32), (50, 13)], lombo_e, 1)
    t.linha([(12, 36), (44, 35)], lombo_e, 1)
    for x, y in ((54, 50), (58, 46), (8, 50), (4, 46), (60, 40)):   # respingos
        t.px(x, y, ESPUMA)
    if not costas:
        t.elipse(12, 35, 3, 3, BRANCO)
        olho(t, 12, 35, 2)
        t.anel(12, 35, 4, 4, (220, 180, 70, 255), 1)
        t.ret(2, 36, 5, 38, lombo_e)                     # a boca de cano do REMORAID
    else:
        t.linha([(8, 34), (44, 34)], lombo_e, 1)
    t.contorno()
    return t


# ------------------------------------------------------------ SPOINK-BRAG
def spoinkbrag(t, costas=False):
    """SPOINK-BRAG: berimbau vivo — a cabaça no lugar da pérola, a verga e o
    arame subindo da cabeça, e a mola do rabo que marca o ritmo.
    PSÍQUICO/LUTADOR."""
    cinza = (168, 164, 176, 255)
    cinza_e = escurecer(cinza, 0.3)
    focinho = (240, 150, 170, 255)
    cabaca = (206, 150, 80, 255)
    cabaca_e = (130, 84, 40, 255)
    verga = (130, 86, 50, 255)
    mola = (200, 200, 210, 255)

    # a mola
    for y in range(49, 58, 3):
        t.linha([(24, y), (40, y + 2)], mola, 2)
        t.linha([(40, y + 2), (24, y + 3)], escurecer(mola, 0.25), 2)
    # a verga: arco comprido que nasce na cabaça e sobe até o alto
    t.linha(_curva([(26, 22), (36, 16), (43, 8), (42, 0)], 12), verga, 3)
    # o corpo de porquinho
    t.elipse(32, 39, 15, 12, cinza)
    t.poli([(20, 32), (13, 24), (25, 29)], cinza)                    # orelhas
    t.poli([(44, 32), (51, 24), (39, 29)], cinza)
    t.elipse(17, 44, 4, 4, cinza)                                    # bracinhos
    t.elipse(47, 44, 4, 4, cinza)
    # a cabaça em cima da cabeça, com a boca virada pra frente
    t.elipse(28, 21, 9, 8, cabaca)
    t.luz()

    # o arame esticado entre as pontas da verga
    t.linha([(30, 18), (41, 1)], (220, 220, 220, 255), 1)
    t.linha([(19, 14), (37, 14)], cabaca_e, 1)                        # o cordão que prende
    # a baqueta na mão e o caxixi
    t.linha([(49, 44), (58, 33)], (190, 150, 100, 255), 2)
    t.elipse(56, 46, 3, 4, (200, 170, 100, 255))
    t.linha([(54, 43), (58, 43)], (130, 90, 50, 255), 1)
    t.ret(56, 40, 56, 42, (130, 90, 50, 255))
    if not costas:
        t.elipse(28, 22, 5, 5, cabaca_e)
        t.elipse(28, 22, 3, 3, escurecer(cabaca_e, 0.4))
        olho(t, 25, 38, 3)
        olho(t, 39, 38, 3)
        t.elipse(32, 44, 5, 3, focinho)
        t.pxs([(30, 44), (34, 44)], escurecer(focinho, 0.4))
        t.pxs([(8, 18), (54, 20), (6, 32)], (190, 130, 230, 255))
    else:
        t.linha([(32, 30), (32, 48)], cinza_e, 1)
        t.anel(28, 21, 9, 8, cabaca_e, 1)
    t.contorno()
    return t


# ---------------------------------------------------------- CHIMECHO-BRAG
def chimechobrag(t, costas=False):
    """CHIMECHO-BRAG: o sininho de vento virou um nó de fitinhas do Senhor do
    Bonfim, que voam compridas no vento. PSÍQUICO/FADA."""
    corpo = (246, 242, 230, 255)
    corpo_e = (200, 196, 180, 255)
    topo = (250, 210, 60, 255)

    # as fitas compridas
    caminhos = [
        [(26, 26), (22, 36), (14, 44), (10, 54), (14, 58)],
        [(29, 27), (28, 38), (22, 48), (24, 57)],
        [(32, 28), (34, 40), (30, 50), (35, 58)],
        [(35, 27), (40, 36), (44, 46), (44, 56)],
        [(38, 26), (46, 32), (54, 40), (57, 50), (54, 56)],
    ]
    for i, pts in enumerate(caminhos):
        t.linha(_curva(pts, 10), FITAS[i], 3)
    # a cabeça redonda de sino
    t.elipse(32, 18, 11, 10, corpo)
    t.poli([(22, 20), (12, 26), (22, 25)], corpo)                  # bracinhos
    t.poli([(42, 20), (52, 26), (42, 25)], corpo)
    t.elipse(32, 6, 4, 3, topo)
    t.luz()
    t.anel(32, 2, 2, 2, topo, 1)
    # as letrinhas bordadas nas fitas (pontinhos)
    for i, pts in enumerate(caminhos):
        c = _curva(pts, 10)
        letra = escurecer(FITAS[i], 0.45) if i != 5 else (120, 120, 140, 255)
        for j in range(4, len(c), 4):
            t.px(c[j][0], c[j][1], letra)
    # o nó apertado na base
    t.elipse(32, 28, 4, 2, FITAS[3])
    t.linha([(28, 28), (36, 28)], escurecer(FITAS[3], 0.4), 1)
    if not costas:
        t.linha([(26, 17), (28, 16), (30, 17)], PRETO, 1)
        t.linha([(34, 17), (36, 16), (38, 17)], PRETO, 1)
        t.elipse(32, 22, 2, 2, (220, 70, 90, 255))
        t.pxs([(25, 20), (39, 20)], (250, 170, 180, 255))
    else:
        t.linha([(32, 9), (32, 26)], corpo_e, 1)
    t.contorno()
    return t


# ------------------------------------------------------------ SPINDA-BRAG
def spindabrag(t, costas=False):
    """SPINDA-BRAG: passista de samba de roda rodando a saia branca, as
    manchas vermelhas de sempre e os olhos em espiral. NORMAL/FADA."""
    bege = (236, 218, 180, 255)
    bege_e = escurecer(bege, 0.25)
    mancha = (208, 70, 60, 255)
    saia = (250, 248, 244, 255)
    saia_e = (210, 206, 200, 255)
    barra = (240, 110, 150, 255)

    # a saia rodada, larga e inclinada do giro
    t.poli([(24, 32), (40, 32), (58, 50), (54, 57), (30, 59), (8, 56), (4, 50)], saia)
    # os pezinhos
    t.elipse(26, 59, 3, 2, bege)
    t.elipse(38, 59, 3, 2, bege)
    # o tronco
    t.elipse(32, 29, 8, 6, bege)
    # braços: um lá em cima, outro na saia
    t.linha([(38, 27), (46, 20), (50, 12)], bege, 4)
    t.linha([(26, 28), (18, 34), (14, 40)], bege, 4)
    # a cabeça e as orelhas compridas do SPINDA
    t.elipse(31, 16, 10, 9, bege)
    t.poli([(23, 10), (16, 2), (14, 6), (21, 14)], bege)
    t.poli([(39, 10), (46, 2), (48, 6), (41, 14)], bege)
    t.luz()

    t.pxs([(16, 4), (17, 5), (18, 6), (45, 4), (44, 5), (43, 6)], mancha)
    # as manchas
    t.elipse(24, 10, 3, 2, mancha)
    t.elipse(38, 20, 3, 2, mancha)
    t.elipse(35, 10, 2, 2, mancha)
    # a renda e a barra da saia
    t.poli([(8, 52), (56, 52), (54, 57), (30, 59), (8, 56), (5, 52)], barra)
    for x in range(10, 54, 4):
        t.px(x, 54, saia)
        t.px(x + 1, 55, clarear(barra, 0.4))
    t.linha([(24, 34), (14, 50)], saia_e, 1)
    t.linha([(32, 34), (30, 51)], saia_e, 1)
    t.linha([(40, 34), (46, 50)], saia_e, 1)
    # as linhas do giro
    t.linha([(2, 44), (6, 40)], saia_e, 1)
    t.linha([(60, 42), (62, 46)], saia_e, 1)
    if not costas:
        for cx in (27, 35):
            t.anel(cx, 16, 2, 2, PRETO, 1)
            t.px(cx, 16, PRETO)
            t.px(cx + 1, 15, bege)
        t.linha([(29, 21), (31, 22), (33, 21)], escurecer(bege, 0.5), 1)
    else:
        t.elipse(31, 16, 9, 8, bege)
        t.elipse(28, 14, 3, 2, mancha)
        t.elipse(35, 19, 2, 2, mancha)
    t.contorno()
    return t


# ----------------------------------------------------------- KECLEON-BRAG
def kecleonbrag(t, costas=False):
    """KECLEON-BRAG: calango de pedra quente, cor de areia, com o zigue-zague
    vermelho na barriga e o rabo enrolado do KECLEON. NORMAL/FOGO."""
    areia = (212, 164, 90, 255)
    areia_e = escurecer(areia, 0.3)
    listra = (208, 50, 36, 255)
    barriga = (242, 214, 150, 255)
    pedra = (140, 124, 110, 255)
    pedra_e = escurecer(pedra, 0.3)

    # a pedra quente
    t.poli([(4, 52), (14, 49), (44, 49), (58, 52), (60, 59), (2, 59)], pedra)
    # o rabo enrolado
    t.linha(_curva([(38, 44), (48, 44), (54, 38), (52, 31), (46, 30), (44, 35), (48, 37)], 10), areia, 5)
    # pernas e corpo
    t.poli([(20, 42), (26, 42), (26, 50), (16, 50)], areia)
    t.poli([(32, 42), (38, 42), (42, 50), (32, 50)], areia)
    t.elipse(29, 36, 11, 12, areia)
    # braços
    t.linha([(20, 32), (14, 38), (16, 42)], areia, 3)
    t.linha([(38, 32), (44, 36), (42, 40)], areia, 3)
    # a cabeça com a crista de babado
    t.elipse(28, 17, 11, 9, areia)
    t.poli([(20, 10), (22, 3), (26, 8), (30, 2), (33, 8), (37, 4), (38, 11)], areia_e)
    # as torrinhas dos olhos
    t.elipse(19, 17, 5, 5, areia)
    t.elipse(37, 17, 5, 5, areia)
    t.luz()

    t.elipse(29, 38, 6, 8, barriga)
    zig = [(23, 30), (26, 33), (29, 30), (32, 33), (35, 30)]
    t.linha(zig, listra, 2)
    for x, y in ((24, 22), (30, 24), (22, 42), (36, 44), (45, 34)):   # pintinhas
        t.px(x, y, areia_e)
    t.linha([(8, 55), (22, 54)], pedra_e, 1)
    t.linha([(36, 56), (52, 55)], pedra_e, 1)
    for x in (10, 30, 50):                                           # o bafo quente
        t.linha([(x, 47), (x + 1, 45), (x, 43)], (255, 150, 60, 255), 1)
    if not costas:
        for cx in (19, 37):
            t.elipse(cx, 17, 3, 3, (250, 220, 90, 255))
            t.linha([(cx, 15), (cx, 19)], PRETO, 1)
        t.linha([(22, 23), (34, 23)], areia_e, 1)
    else:
        t.elipse(28, 17, 11, 9, areia)
        t.linha([(28, 10), (29, 46)], listra, 1)
        for y in range(14, 44, 5):
            t.pxs([(25, y), (32, y)], areia_e)
    t.contorno()
    return t


# ----------------------------------------------------------- LUVDISC-BRAG
def luvdiscbrag(t, costas=False):
    """LUVDISC-BRAG: presente de Iemanjá — coração-peixe cercado de pétalas
    brancas e fita azul, boiando na onda. ÁGUA/PSÍQUICO."""
    rosa = (244, 130, 170, 255)
    rosa_e = escurecer(rosa, 0.3)
    petala = (250, 250, 246, 255)
    petala_e = (210, 214, 220, 255)
    fita = (130, 190, 240, 255)

    _ondas(t, 50, 2, 62)
    # as pétalas atrás, em roda
    for ang in range(0, 360, 40):
        a = math.radians(ang)
        t.elipse(round(32 + 21 * math.cos(a)), round(30 + 17 * math.sin(a)), 6, 5, petala)
    # o coração
    t.elipse(24, 25, 9, 9, rosa)
    t.elipse(40, 25, 9, 9, rosa)
    t.poli([(15, 27), (49, 27), (32, 46)], rosa)
    t.luz(poupar=(MAR[:3], MAR_E[:3]))

    for ang in range(0, 360, 40):
        a = math.radians(ang)
        x, y = round(32 + 23 * math.cos(a)), round(30 + 19 * math.sin(a))
        t.px(x, y, petala_e)
    # a fita azul amarrada de lado, com as pontas descendo pra água
    t.linha([(47, 26), (53, 36), (50, 46)], fita, 2)
    t.linha([(47, 26), (57, 30), (60, 40)], fita, 2)
    t.elipse(47, 25, 2, 2, fita)
    for x in range(6, 60, 7):
        t.px(x, 50, ESPUMA)
        t.px(x + 1, 50, ESPUMA)
    if not costas:
        olho(t, 25, 26, 2)
        t.px(26, 27, rosa_e)
        t.ret(36, 31, 39, 32, (200, 60, 110, 255))
        t.pxs([(20, 33), (21, 33), (43, 33), (44, 33)], clarear(rosa, 0.3))
    else:
        t.linha([(32, 22), (32, 44)], rosa_e, 1)
    t.contorno()
    return t


# ---------------------------------------------------------- CLAMPERL-BRAG
def clamperlbrag(t, costas=False):
    """CLAMPERL-BRAG: ostra de concha lilás e fria, aberta, guardando uma
    pérola de oferenda que brilha sozinha no escuro. ÁGUA/FANTASMA."""
    concha = (130, 136, 200, 255)
    concha_e = escurecer(concha, 0.35)
    dentro = (226, 214, 240, 255)
    perola = (240, 244, 255, 255)
    alma = (190, 200, 250, 255)

    # a concha de cima, levantada como tampa, com as ondulações
    t.poli([(10, 36), (8, 24), (14, 12), (24, 5), (40, 5), (50, 12), (56, 24), (54, 36)], concha)
    # a concha de baixo
    t.elipse(32, 49, 24, 10, concha)
    t.elipse(32, 45, 20, 6, dentro)
    t.poli([(13, 34), (51, 34), (48, 42), (16, 42)], dentro)
    if not costas:
        # o miolo claro da tampa
        t.poli([(16, 34), (14, 24), (20, 14), (28, 10), (36, 10), (44, 14), (50, 24), (48, 34)], dentro)
    t.luz(poupar=(perola[:3], alma[:3]))

    for i in range(-3, 4):
        t.linha([(32, 58), (32 + i * 7, 45)], concha_e, 1)
    for x in range(10, 55, 5):
        t.px(x, 58, concha_e)
    if not costas:
        # a pérola, brilhando, com a carinha de assombração
        t.elipse(32, 34, 9, 9, perola)
        t.anel(32, 34, 9, 9, alma, 1)
        t.pxs([(27, 29), (28, 28), (29, 28)], BRANCO)
        t.ret(28, 32, 29, 35, (60, 60, 110, 255))
        t.ret(35, 32, 36, 35, (60, 60, 110, 255))
        t.elipse(32, 38, 1, 1, (60, 60, 110, 255))
        # pétala de oferenda caída na borda
        t.elipse(18, 42, 3, 2, (250, 250, 250, 255))
        t.elipse(46, 42, 3, 2, (130, 190, 240, 255))
        # o fiozinho de alma subindo
        for x, y in ((31, 22), (30, 19), (31, 16), (33, 14)):
            t.px(x, y, alma)
    else:
        for i in range(-3, 4):
            t.linha([(32, 36), (32 + i * 7, 7)], concha_e, 1)
        t.linha([(10, 36), (54, 36)], concha_e, 1)
        for x, y in ((6, 20), (58, 16), (60, 30)):
            t.pxs([(x, y), (x, y - 1)], alma)
    t.contorno()
    return t


# ----------------------------------------------------------- TORKOAL-BRAG
def torkoalbrag(t, costas=False):
    """TORKOAL-BRAG: o casco é uma panela de barro com a moqueca borbulhando
    no dendê, e o vapor sai por cima. FOGO/ÁGUA."""
    pele = (220, 110, 60, 255)
    pele_e = escurecer(pele, 0.3)
    barro = (74, 52, 46, 255)
    barro_e = (48, 34, 32, 255)
    caldo = DENDE
    coentro = (70, 150, 60, 255)
    camarao = (250, 150, 120, 255)
    vapor = (236, 236, 240, 255)

    # patas
    for x in (20, 30, 42, 52):
        t.poli([(x - 4, 50), (x + 4, 50), (x + 4, 58), (x - 5, 58)], pele)
    # a cabeça, esticada pra frente
    t.elipse(12, 42, 9, 7, pele)
    t.poli([(16, 38), (24, 36), (24, 48), (16, 48)], pele)
    # a panela: bojo largo, as asas e a borda
    t.elipse(37, 42, 21, 12, barro)
    t.ret(14, 30, 60, 42, barro)
    t.elipse(37, 42, 21, 12, barro)
    t.ret(11, 30, 16, 33, barro)
    t.ret(58, 30, 63, 33, barro)
    t.ret(15, 28, 59, 31, barro)
    t.luz(poupar=(caldo[:3],))

    # a moqueca na boca da panela
    t.elipse(37, 28, 20, 3, caldo)
    t.ret(18, 28, 56, 29, caldo)
    t.elipse(28, 28, 3, 1, camarao)
    t.elipse(44, 27, 3, 1, camarao)
    t.elipse(36, 28, 2, 1, BRANCO)
    t.pxs([(22, 28), (33, 27), (40, 29), (49, 28), (52, 27)], coentro)
    t.pxs([(25, 27), (47, 29)], DENDE_C)
    t.linha([(16, 36), (58, 36)], barro_e, 1)
    t.linha([(18, 46), (56, 46)], barro_e, 1)
    for x in (22, 32, 42, 52):
        t.px(x, 41, (110, 80, 70, 255))
    # vapor
    for i, (x, y) in enumerate(((26, 20), (24, 13), (28, 7), (40, 21), (42, 14), (39, 8), (50, 18), (52, 11))):
        t.elipse(x, y, 2 + i % 2, 2, vapor)
    if not costas:
        for cx in (8, 15):
            t.ret(cx - 1, 39, cx + 1, 41, BRANCO)
            t.linha([(cx - 2, 39), (cx + 1, 39)], PRETO, 1)
            t.px(cx, 41, PRETO)
        t.linha([(5, 45), (12, 46)], pele_e, 1)
    else:
        t.elipse(12, 42, 8, 6, pele)
        t.linha([(8, 38), (16, 38)], pele_e, 1)
    t.contorno()
    return t


# ----------------------------------------------------------- CHERUBI-BRAG
def _cacho(t, cx, cy, rx, ry, cores):
    """Um cacho de dendê: bolo de frutinhas ovais, alaranjadas de ponta
    escura."""
    t.elipse(cx, cy, rx, ry, cores[0])
    t.luz()
    i = 0
    for y in range(cy - ry + 3, cy + ry, 5):
        for x in range(cx - rx + 3 + (i % 2) * 2, cx + rx - 1, 5):
            if ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 0.75:
                t.elipse(x, y, 2, 2, cores[1 + (x + y) % 2])
                t.px(x - 1, y - 1, clarear(cores[1], 0.4))
                t.pxs([(x + 1, y + 2), (x + 2, y + 1)], cores[3])
        i += 1


def cherubibrag(t, costas=False):
    """CHERUBI-BRAG: dois cachos de dendê pendurados do mesmo talo, com as
    folhas de palmeira em cima; o grandão tem a cara. PLANTA/FOGO."""
    folha = (70, 150, 60, 255)
    folha_e = (40, 100, 44, 255)
    talo = (110, 90, 50, 255)
    cores = [(214, 80, 30, 255), (240, 120, 30, 255), (200, 50, 30, 255), (70, 30, 24, 255)]

    # talos
    t.linha([(26, 32), (34, 14)], talo, 2)
    t.linha([(48, 42), (36, 14)], talo, 2)
    # as folhas de palmeira
    for (x2, y2) in ((12, 8), (56, 6)):
        t.linha([(35, 13), (x2, y2)], folha_e, 2)
        n = 7
        for k in range(1, n):
            x = 35 + (x2 - 35) * k / n
            y = 13 + (y2 - 13) * k / n
            t.linha([(round(x), round(y)), (round(x + 2), round(y - 6))], folha, 2)
            t.linha([(round(x), round(y)), (round(x - 1), round(y + 6))], folha, 2)
    _cacho(t, 48, 48, 9, 9, cores)
    _cacho(t, 25, 42, 16, 15, cores)
    if not costas:
        t.elipse(25, 42, 9, 6, cores[1])
        olho(t, 21, 41, 2)
        olho(t, 29, 41, 2)
        t.linha([(23, 45), (25, 46), (27, 45)], PRETO, 1)
        t.pxs([(17, 44), (33, 44)], DENDE_C)
    t.contorno()
    return t


DESENHOS = {
    21501: (machopbrag, "machopbrag"),
    21502: (jynxbrag, "jynxbrag"),
    21503: (laprasbrag, "laprasbrag"),
    21504: (staryubrag, "staryubrag"),
    21505: (horseabrag, "horseabrag"),
    21506: (remoraidbrag, "remoraidbrag"),
    21507: (spoinkbrag, "spoinkbrag"),
    21508: (chimechobrag, "chimechobrag"),
    21509: (spindabrag, "spindabrag"),
    21510: (kecleonbrag, "kecleonbrag"),
    21511: (luvdiscbrag, "luvdiscbrag"),
    21512: (clamperlbrag, "clamperlbrag"),
    21513: (torkoalbrag, "torkoalbrag"),
    21514: (cherubibrag, "cherubibrag"),
}
