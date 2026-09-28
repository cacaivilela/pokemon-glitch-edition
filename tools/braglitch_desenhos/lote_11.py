"""LOTE 11 — AS MONTARIAS DE BRAGLITCH.

Criaturas-máquina que carregam o treinador: o submarino-baleia, o 14-Bis vivo,
o trator, a britadeira e a roçadeira. Todas têm lugar pra sentar (escotilha,
cesto de vime, banco, sela) e todas têm cara de bicho, não de veículo.
"""
import math

from pixelart import Tela, clarear, escurecer

BRANCO = (250, 250, 250, 255)
PRETO = (30, 26, 34, 255)
ACO = (170, 178, 192, 255)
ACO_E = (108, 116, 132, 255)
SELA = (92, 52, 34, 255)
SELA_C = (138, 84, 52, 255)


def olho(t, cx, cy, r=3, iris=PRETO, bravo=None):
    """Olho redondo de bicho com brilho. `bravo` = 'e'/'d' corta a pálpebra."""
    t.elipse(cx, cy, r, r, BRANCO)
    t.elipse(cx, cy + 1, max(1, r - 2), max(1, r - 1), iris)
    t.px(cx - 1, cy - 1, BRANCO)
    if bravo == "e":      # sobrancelha descendo pra dentro (direita)
        t.linha([(cx - r - 1, cy - r - 1), (cx + r, cy - 1)], PRETO, 2)
    elif bravo == "d":
        t.linha([(cx - r, cy - 1), (cx + r + 1, cy - r - 1)], PRETO, 2)


# ------------------------------------------------------------ SUBMARINUM
def submarinum(t, costas=False):
    """Submarino-baleia amarelo com barriga azul e rebites; as escotilhas da
    frente são os olhos, a torre tem a escotilha aberta pro treinador e o
    periscópio espia por cima. ÁGUA/AÇO."""
    amar = (246, 200, 52, 255)
    azul = (52, 110, 200, 255)
    azul_c = (120, 190, 240, 255)
    rebite = (196, 150, 30, 255)
    bolha = (190, 232, 255, 255)

    # cauda: barbatanas em cruz e a hélice
    t.poli([(50, 36), (60, 26), (62, 30), (56, 40)], azul)
    t.poli([(50, 46), (60, 56), (62, 52), (56, 42)], azul)
    t.ret(56, 38, 59, 44, ACO_E)
    t.elipse(61, 41, 2, 7, ACO)                      # hélice girando
    # o corpo de baleia
    t.elipse(30, 42, 26, 14, amar)
    t.elipse(30, 50, 22, 7, azul)                    # barriga
    t.poli([(8, 46), (4, 42), (8, 38)], amar)         # focinho
    # torre (cabine) com a escotilha aberta
    t.ret(28, 20, 44, 31, amar)
    t.ret(26, 18, 46, 21, azul)                      # borda da escotilha
    # periscópio
    t.ret(39, 7, 41, 18, ACO)
    t.ret(33, 6, 41, 9, ACO)
    # barbatana lateral
    t.poli([(24, 50), (34, 50), (30, 58), (20, 58)], azul)
    t.luz()

    # escotilha aberta: buraco escuro com banquinho e a tampa levantada
    t.ret(28, 18, 44, 19, (40, 44, 70, 255))
    t.ret(30, 18, 42, 18, SELA_C)
    t.poli([(44, 17), (50, 11), (52, 13), (46, 19)], azul_c)
    t.px(50, 12, BRANCO)
    t.ret(33, 7, 34, 8, azul_c)                      # lente do periscópio
    t.px(33, 7, BRANCO)
    # rebites
    for x in range(12, 52, 5):
        t.px(x, 36 - (1 if 20 < x < 42 else 0) - (0 if 14 < x < 46 else -2), rebite)
    for y in (23, 27):
        for x in (30, 42):
            t.px(x, y, rebite)
    t.linha([(10, 44), (50, 44)], rebite, 1)          # costura das chapas
    t.linha([(9, 50), (51, 50)], clarear(azul, 0.15), 1)
    # escotilhas da lateral (janelinhas)
    for cx in (34, 43):
        t.elipse(cx, 39, 2, 2, ACO_E)
        t.elipse(cx, 39, 1, 1, azul_c)
    # bolhas
    for x, y, r in ((3, 30, 2), (7, 24, 1), (2, 20, 1), (58, 20, 1), (55, 14, 2)):
        t.anel(x, y, r, r, bolha, 1)
        t.px(x - 1 + (r == 1), y - 1 + (r == 1), BRANCO)
    if not costas:
        # escotilhas da frente viram os olhões
        for cx in (11, 20):
            t.elipse(cx, 39, 4, 4, ACO)
            t.elipse(cx, 39, 3, 3, BRANCO)
            t.elipse(cx - 1, 40, 2, 2, (30, 60, 120, 255))
            t.px(cx - 2, 38, BRANCO)
        t.pxs([(6, 46), (7, 47), (8, 47), (9, 48), (10, 48), (11, 48), (12, 47),
               (13, 47), (14, 46)], PRETO)                  # sorrisão de baleia
        t.pxs([(6, 45), (15, 45)], (240, 130, 130, 255))    # bochechas
    else:
        t.linha([(8, 40), (8, 48)], escurecer(amar, 0.3), 1)  # emenda do focinho
        t.elipse(14, 40, 2, 2, ACO_E)
    t.contorno()
    return t


# -------------------------------------------------------------- CATORBIS
def catorbis(t, costas=False):
    """O 14-Bis vivo: asas em caixa de pano bege presas em bambu, corpo de
    treliça, a cabeça é a caixa-leme da frente (com bigodinho de aviador) e o
    cesto de vime no meio é o assento. Hélice atrás. VOADOR/AÇO."""
    pano = (236, 222, 184, 255)
    pano_e = (200, 182, 140, 255)
    bambu = (176, 136, 72, 255)
    bambu_e = (120, 88, 44, 255)
    vime = (200, 150, 80, 255)
    roda = (60, 56, 64, 255)

    # rodinhas de bicicleta (as patas)
    for cx in (36, 52):
        t.linha([(cx, 38), (cx, 54)], bambu, 2)
        t.anel(cx, 55, 5, 5, roda, 2)
    # a asa em caixa: fundo das células (pano de trás, na sombra)
    t.ret(24, 11, 60, 38, pano_e)
    # as duas pranchas da asa
    t.ret(22, 8, 61, 13, pano)
    t.ret(22, 35, 61, 40, pano)
    # a treliça do corpo até a cabeça
    t.ret(16, 20, 26, 28, bambu)
    # cabeça: a caixa-leme da frente
    t.ret(2, 12, 19, 36, pano)
    # hélice atrás
    t.ret(60, 21, 62, 27, bambu_e)
    t.elipse(62, 24, 1, 11, clarear(bambu, 0.2))
    t.luz()

    # dentro das células: sombra, bambu das divisórias
    for x in (24, 36, 48, 59):
        t.ret(x, 13, x + 1, 35, bambu)
        t.px(x + 1, 13, bambu_e)
    for x0 in (26, 38, 50):
        t.ret(x0, 14, x0 + 9, 15, escurecer(pano_e, 0.25))
    # o cesto de vime, dentro da célula do meio
    t.poli([(37, 25), (48, 25), (47, 35), (38, 35)], vime)
    for y in (27, 29, 31, 33):
        for x in range(38 + (y % 4 == 1), 47, 2):
            t.px(x, y, escurecer(vime, 0.3))
    t.ret(36, 24, 49, 25, SELA_C)                    # borda do cesto
    t.ret(36, 26, 36, 34, escurecer(vime, 0.4))
    # xadrezinho da treliça
    t.ret(17, 21, 25, 27, escurecer(bambu, 0.45))
    for x in (17, 21):
        t.linha([(x, 21), (x + 4, 27)], bambu, 1)
        t.linha([(x, 27), (x + 4, 21)], bambu, 1)
    # costuras do pano da asa
    for x in range(24, 61, 3):
        t.px(x, 10, pano_e)
        t.px(x, 37, pano_e)
    t.ret(3, 12, 18, 12, clarear(pano, 0.4))
    t.ret(2, 36, 19, 36, pano_e)
    # rajadinhas de vento
    for x, y in ((4, 4), (12, 2), (2, 44), (12, 46), (44, 3)):
        t.linha([(x, y), (x + 4, y)], (220, 236, 250, 255), 1)
    if not costas:
        # a cara no pano da caixa da frente
        for cx in (7, 14):
            t.ret(cx - 2, 20, cx + 1, 24, BRANCO)
            t.ret(cx - 1, 21, cx + 1, 24, PRETO)
            t.px(cx - 1, 21, BRANCO)
        t.linha([(4, 18), (8, 17)], bambu_e, 1)
        t.linha([(13, 17), (17, 18)], bambu_e, 1)
        # bigodinho de Santos Dumont
        t.pxs([(6, 27), (7, 27), (8, 28), (9, 28), (10, 28), (11, 28), (12, 27),
               (13, 27), (5, 28), (14, 28)], (70, 44, 30, 255))
        t.pxs([(8, 30), (9, 31), (10, 31), (11, 30)], PRETO)
        t.pxs([(4, 26), (4, 27), (15, 26), (15, 27)], (236, 150, 140, 255))
        # chapeuzinho panamá
        t.ret(1, 10, 20, 11, (250, 246, 230, 255))
        t.ret(5, 5, 16, 9, (250, 246, 230, 255))
        t.ret(5, 8, 16, 9, (60, 40, 30, 255))
    else:
        t.ret(2, 23, 19, 24, pano_e)
        t.ret(10, 12, 11, 36, bambu)
    t.contorno()
    return t


# -------------------------------------------------------------- TRATORAO
def tratorao(t, costas=False):
    """Trator vivo vermelho e verde: a grade da frente é a boca, os faróis são
    os olhos, rodão traseiro enlameado, banco de mola em cima e chaminé
    soltando fumaça. TERRA/AÇO."""
    verm = (214, 50, 44, 255)
    verde = (60, 150, 64, 255)
    pneu = (50, 46, 52, 255)
    aro = (246, 196, 40, 255)
    lama = (122, 84, 48, 255)
    fumaca = (200, 196, 206, 255)

    # rodas
    t.elipse(44, 45, 15, 15, pneu)
    t.elipse(13, 52, 9, 9, pneu)
    # capô e corpo
    t.poli([(4, 30), (34, 30), (36, 46), (4, 46)], verm)
    t.ret(30, 22, 40, 44, verm)                      # cabine/tanque
    # para-lama verde
    t.poli([(30, 30), (36, 24), (52, 24), (60, 32), (60, 36), (30, 36)], verde)
    # chaminé
    t.ret(18, 16, 21, 30, ACO_E)
    # banco
    t.ret(40, 17, 49, 20, pneu)
    t.ret(47, 10, 50, 20, pneu)
    t.linha([(44, 21), (44, 24)], ACO, 2)
    t.luz()

    # aros amarelos e cravos do pneu
    t.elipse(44, 45, 7, 7, aro)
    t.elipse(44, 45, 3, 3, escurecer(aro, 0.3))
    t.px(43, 44, clarear(aro, 0.5))
    for i in range(12):
        a = i * math.pi / 6
        t.px(round(44 + 13 * math.cos(a)), round(45 + 13 * math.sin(a)), escurecer(pneu, 0.4))
    t.elipse(13, 52, 4, 4, aro)
    t.px(13, 52, escurecer(aro, 0.3))
    # lama respingada
    for x, y in ((32, 50), (34, 55), (38, 58), (52, 57), (56, 52), (6, 57),
                 (19, 58), (8, 47), (47, 58)):
        t.ret(x, y, x + 1, y + 1, lama)
    t.pxs([(28, 58), (25, 56), (60, 58)], lama)
    # faixa do capô e boca do escape
    t.ret(5, 38, 29, 38, escurecer(verm, 0.25))
    t.ret(17, 15, 22, 16, PRETO)
    # fumaça
    for x, y, r in ((20, 11, 2), (16, 6, 3), (22, 3, 2)):
        t.elipse(x, y, r, r - (r > 2), fumaca)
    t.ret(41, 17, 48, 17, clarear(pneu, 0.3))
    if not costas:
        # faróis = olhos
        for cx in (7, 15):
            t.elipse(cx, 33, 4, 4, ACO)
            t.elipse(cx, 33, 3, 3, (255, 244, 170, 255))
            t.ret(cx, 33, cx + 1, 35, PRETO)
            t.px(cx - 1, 32, BRANCO)
        t.linha([(4, 29), (10, 31)], PRETO, 1)          # sobrancelha marota
        t.linha([(12, 30), (18, 29)], PRETO, 1)
        # grade = boca sorrindo com dentes de grelha
        t.poli([(4, 40), (18, 40), (16, 45), (5, 45)], PRETO)
        for x in (6, 9, 12, 15):
            t.ret(x, 40, x, 42, ACO)
        t.px(10, 44, (220, 90, 110, 255))
    else:
        t.ret(4, 40, 18, 44, escurecer(verm, 0.3))
        for x in (6, 10, 14):
            t.ret(x, 41, x + 1, 43, ACO_E)
    t.contorno()
    return t


# ------------------------------------------------------------ BRITADEIRO
def britadeiro(t, costas=False):
    """Britadeira viva: corpo de pedra com cinta de aço, capacete de obra com
    sela, o guidão virou chifres, e a perna única é a ponteira batendo no chão
    e espirrando pedra. PEDRA/AÇO."""
    pedra = (150, 136, 120, 255)
    pedra_e = (104, 92, 82, 255)
    capa = (250, 200, 30, 255)
    grip = (40, 36, 44, 255)
    caco = (180, 166, 146, 255)

    # chifres-guidão
    t.linha([(18, 22), (10, 20), (6, 12), (8, 4)], ACO, 3)
    t.linha([(46, 22), (54, 20), (58, 12), (56, 4)], ACO, 3)
    t.ret(5, 2, 10, 10, grip)
    t.ret(54, 2, 59, 10, grip)
    # corpo de pedra
    t.elipse(32, 35, 18, 14, pedra)
    t.linha([(14, 36), (9, 42)], pedra_e, 3)                    # bracinhos
    t.linha([(50, 36), (55, 42)], pedra_e, 3)
    t.elipse(8, 44, 4, 4, pedra)                                # punhos de pedra
    t.elipse(56, 44, 4, 4, pedra)
    # cinta de aço
    t.ret(15, 42, 49, 46, ACO)
    # a perna-britadeira
    t.ret(27, 46, 37, 52, ACO_E)
    t.ret(29, 52, 35, 55, ACO)
    t.poli([(30, 55), (34, 55), (33, 60), (31, 60)], ACO)
    # capacete de obra
    t.elipse(32, 22, 16, 10, capa)
    t.ret(12, 23, 52, 26, capa)
    t.luz()

    t.ret(16, 21, 48, 22, capa)                      # tira do meio do capacete
    t.ret(30, 12, 34, 22, clarear(capa, 0.25))
    # sela em cima do capacete
    t.poli([(22, 12), (42, 12), (40, 17), (24, 17)], SELA)
    t.ret(24, 12, 40, 13, SELA_C)
    t.ret(12, 26, 52, 26, escurecer(capa, 0.3))
    # rebites da cinta
    for x in range(18, 48, 6):
        t.px(x, 44, ACO_E)
    # rachaduras da pedra
    t.linha([(20, 30), (22, 34), (20, 37)], pedra_e, 1)
    t.linha([(46, 30), (43, 33)], pedra_e, 1)
    # tremedeira da ponteira e chão rachando
    for dx in (-1, 1):
        t.linha([(32 + 7 * dx, 50), (32 + 9 * dx, 50)], PRETO, 1)
        t.linha([(32 + 6 * dx, 53), (32 + 8 * dx, 54)], PRETO, 1)
    t.linha([(22, 61), (28, 60), (36, 60), (42, 61)], pedra_e, 1)
    t.pxs([(25, 62), (39, 62)], pedra_e)
    # pedrinhas voando
    for x, y in ((20, 55), (16, 51), (44, 55), (48, 51), (12, 58), (52, 58)):
        t.ret(x, y, x + 1, y + 1, caco)
        t.px(x + 1, y + 1, pedra_e)
    if not costas:
        olho(t, 25, 34, 3, bravo="e")
        olho(t, 39, 34, 3, bravo="d")
        # boca brava cerrada com dentes
        t.ret(26, 39, 38, 41, PRETO)
        for x in (28, 31, 34, 37):
            t.px(x, 40, BRANCO)
    else:
        t.linha([(32, 28), (32, 41)], pedra_e, 1)
        t.linha([(26, 34), (38, 34)], pedra_e, 1)
    t.contorno()
    return t


# --------------------------------------------------------------- ROCADOR
def rocador(t, costas=False):
    """Moita viva com óculos de proteção e sorriso de quem ama cortar grama:
    o braço longo termina num disco girando, o motor laranja vai nas costas e
    tem sela no lombo. PLANTA/AÇO."""
    mato = (80, 170, 60, 255)
    mato_e = (46, 114, 42, 255)
    motor = (240, 120, 30, 255)
    lamina = (214, 220, 230, 255)
    folha = (120, 200, 70, 255)
    oculos = (130, 220, 240, 255)

    # braço-cabo e o disco
    t.linha([(22, 40), (8, 52)], ACO_E, 3)
    t.elipse(8, 53, 7, 5, lamina)
    # motor nas costas
    t.ret(46, 22, 60, 38, motor)
    t.ret(56, 16, 58, 22, ACO_E)                     # escapamento
    # pernas
    t.ret(26, 50, 31, 60, mato_e)
    t.ret(40, 50, 45, 60, mato_e)
    t.ret(24, 57, 32, 60, ACO_E)
    t.ret(38, 57, 46, 60, ACO_E)
    # corpo de moita, com topete espetado
    t.elipse(35, 38, 16, 14, mato)
    for x, h in ((20, 22), (25, 16), (30, 19), (35, 14), (40, 18), (45, 21)):
        t.poli([(x, 30), (x + 2 + (x % 3), h), (x + 7, 30)], mato)
    t.luz()

    # dentes do disco + borrão de giro
    for i in range(10):
        a = i * math.pi / 5
        t.px(round(8 + 8 * math.cos(a)), round(53 + 6 * math.sin(a)), ACO_E)
    t.anel(8, 53, 4, 3, escurecer(lamina, 0.2), 1)
    t.ret(7, 52, 9, 54, ACO_E)
    t.linha([(3, 49), (6, 47)], BRANCO, 1)
    # detalhes do motor
    for y in (26, 29, 32):
        t.ret(48, y, 58, y, escurecer(motor, 0.3))
    t.ret(52, 34, 55, 36, PRETO)
    t.linha([(60, 30), (62, 34)], PRETO, 1)          # cordinha de partida
    t.px(62, 35, (220, 40, 40, 255))
    for x, y in ((58, 12), (60, 8)):                  # fumacinha
        t.elipse(x, y, 1, 1, (200, 200, 210, 255))
    # sela no lombo
    t.poli([(34, 24), (46, 24), (44, 30), (36, 30)], SELA)
    t.ret(35, 24, 45, 25, SELA_C)
    # tufos do mato
    for x, y in ((28, 44), (40, 46), (44, 38), (33, 49)):
        t.pxs([(x, y), (x + 1, y - 1), (x - 1, y - 1)], mato_e)
    # folhas cortadas voando
    for x, y in ((2, 40), (16, 42), (5, 60), (18, 60), (13, 36)):
        t.pxs([(x, y), (x + 1, y), (x + 1, y - 1)], folha)
    if not costas:
        # óculos de proteção com a tira
        t.ret(20, 32, 36, 33, PRETO)
        for cx in (23, 32):
            t.elipse(cx, 35, 4, 3, ACO_E)
            t.elipse(cx, 35, 3, 2, oculos)
            t.ret(cx, 35, cx + 1, 36, PRETO)
            t.px(cx - 2, 34, BRANCO)
        # sorrisão aberto
        t.poli([(21, 41), (33, 41), (30, 46), (24, 46)], (110, 30, 40, 255))
        t.ret(22, 41, 32, 41, BRANCO)
        t.pxs([(26, 45), (27, 45), (28, 45)], (230, 110, 130, 255))
    else:
        t.ret(20, 34, 50, 35, PRETO)                 # tira dos óculos por trás
    t.contorno()
    return t


DESENHOS = {
    1084: (submarinum, "submarinum"),
    1085: (catorbis, "catorbis"),
    1086: (tratorao, "tratorao"),
    1087: (britadeiro, "britadeiro"),
    1088: (rocador, "rocador"),
}
