"""Lote 26: as 14 formas da ILHA 7, o ATOL DAS ROCKRUFF (Atol das Rocas, RN).

O único atol do Atlântico Sul: um anel de coral no meio do mar, piscinas
naturais que a maré enche e esvazia, tartaruga desovando na areia, filhote de
tubarão-limão nas piscinas rasas, atobá por todo lado e casco de navio
naufragado no recife. Quem ficou preso ali virou bicho de maré:

ROCKRUFF lobo-marinho filhote, CORSOLA coral-de-fogo, TIRTOUGA tartaruga-de-
pente, CARVANHA tubarão-limão, DUCKLETT atobá, CLAUNCHER camarão-pistola,
BINACLE craca, FRILLISH água-viva-lua, PYUKUMUKU pepino-do-mar, DHELMISE
âncora de naufrágio enferrujada com sargaço, WAILMER jubarte filhote, MANTYKE
raia-chita, ALOMOMOLA peixe-lua e BRUXISH peixe-papagaio (o budião-azul).
"""
import math

from pixelart import Tela, clarear, escurecer  # noqa: F401

BRANCO = (250, 250, 250, 255)
PRETO = (30, 26, 34, 255)
VAZIO = (0, 0, 0, 0)

AREIA = (236, 214, 160, 255)
AREIA_E = (200, 172, 116, 255)
PEDRA = (140, 136, 130, 255)
PEDRA_E = (98, 94, 92, 255)
PEDRA_C = (184, 180, 172, 255)


def olho(t, cx, cy, r=2, iris=PRETO, brilho=BRANCO):
    t.elipse(cx, cy, r, r, iris)
    t.px(cx - 1, cy - 1, brilho)


def olhao(t, cx, cy, r=3, iris=(60, 120, 200, 255)):
    """Olho de desenho: branco, íris colorida, pupila e brilho."""
    t.elipse(cx, cy, r, r, BRANCO)
    t.elipse(cx, cy, r - 1, r - 1, iris)
    t.elipse(cx, cy, max(1, r - 2), max(1, r - 2), PRETO)
    t.px(cx - 1, cy - 1, BRANCO)


def bolhas(t, pts, cor=(200, 236, 250, 255)):
    for x, y in pts:
        t.pxs([(x, y - 1), (x - 1, y), (x + 1, y), (x, y + 1)], cor)


# ---------------------------------------------------------------- ROCKRUFF
def rockruffbrag(t, costas=False):
    """ROCKRUFF-BRAG: filhote de lobo-marinho sentado nas nadadeiras da
    frente, com as orelhinhas em ponta do ROCKRUFF e a coleira de pedra virada
    colar de coral e cascalho. PEDRA/ÁGUA."""
    pelo = (132, 98, 70, 255)
    pelo_e = (96, 68, 50, 255)
    barriga = (206, 174, 132, 255)
    # rabo de nadadeiras, espalmado atrás
    t.poli([(40, 52), (58, 50), (62, 55), (58, 58), (40, 59)], pelo_e)
    # corpo em gota, sentado
    t.elipse(34, 46, 16, 12, pelo)
    t.poli([(22, 40), (40, 40), (38, 20), (24, 20)], pelo)
    # nadadeiras da frente, abertas no chão
    t.poli([(20, 46), (8, 56), (8, 60), (20, 58), (26, 52)], pelo_e)
    t.poli([(40, 50), (46, 58), (36, 60), (32, 54)], pelo_e)
    # cabeça
    t.elipse(30, 18, 11, 10, pelo)
    if not costas:                                     # focinho comprido de foca
        t.elipse(30, 23, 6, 4, barriga)
    # orelhinhas em ponta do ROCKRUFF (curtas: lobo-marinho tem orelha pequena)
    t.poli([(21, 12), (20, 5), (27, 9)], pelo)
    t.poli([(34, 9), (40, 5), (40, 13)], pelo)
    t.luz()
    t.poli([(24, 36), (36, 36), (42, 48), (34, 56), (24, 54), (20, 46)], barriga)   # peito claro
    t.pxs([(22, 8), (22, 9), (23, 9)], (200, 150, 120, 255))
    t.pxs([(38, 8), (38, 9), (37, 9)], (200, 150, 120, 255))
    # colar de cascalho e coral no pescoço (as pedras do ROCKRUFF)
    for i, x in enumerate(range(19, 44, 5)):
        y = 29 + abs(x - 31) // 5
        cor = PEDRA if i % 2 == 0 else (230, 120, 100, 255)
        t.elipse(x, y, 3, 3, cor)
        t.px(x - 1, y - 1, clarear(cor, 0.5))
        t.px(x + 1, y + 2, escurecer(cor, 0.35))
    t.linha([(10, 58), (18, 58)], escurecer(pelo_e, 0.3), 1)
    t.linha([(56, 54), (46, 56)], escurecer(pelo_e, 0.3), 1)
    if not costas:
        olhao(t, 25, 15, 3, (80, 170, 220, 255))
        olhao(t, 35, 15, 3, (80, 170, 220, 255))
        t.elipse(30, 21, 2, 1, PRETO)                     # nariz
        t.pxs([(30, 23), (28, 25), (29, 25), (31, 25), (32, 25)], PRETO)
        for y in (22, 24):                                # bigode
            t.linha([(15, y - 1), (25, y)], (244, 236, 226, 255), 1)
            t.linha([(35, y), (45, y - 1)], (244, 236, 226, 255), 1)
    else:
        t.elipse(30, 18, 10, 9, pelo)
        t.elipse(32, 42, 13, 12, pelo)                    # costas inteiras
        t.poli([(22, 10), (21, 6), (26, 9)], pelo_e)
        t.poli([(35, 9), (39, 6), (39, 12)], pelo_e)
        t.linha([(31, 34), (31, 54)], pelo_e, 1)
        for i, x in enumerate(range(19, 44, 5)):
            y = 29 + abs(x - 31) // 5
            t.elipse(x, y, 3, 2, PEDRA if i % 2 == 0 else (230, 120, 100, 255))
    t.contorno()
    return t


# ----------------------------------------------------------------- CORSOLA
def corsolabrag(t, costas=False):
    """CORSOLA-BRAG: coral-de-fogo. O corpinho redondo virou laranja-queimado,
    os galhos da cabeça são de coral com a ponta branca acesa, e quem encosta
    sai queimado. PEDRA/FOGO."""
    coral = (230, 120, 40, 255)
    coral_e = (170, 70, 26, 255)
    ponta = (255, 236, 150, 255)
    brasa = (255, 90, 40, 255)
    # galhos (chifres de coral), vários, ramificados
    galhos = [((24, 30), (14, 12), (8, 4)), ((14, 12), (20, 6)),
              ((32, 28), (32, 8), (30, 1)), ((32, 14), (38, 6)),
              ((40, 30), (50, 12), (56, 4)), ((50, 12), (44, 5)),
              ((22, 34), (10, 26), (4, 24)), ((42, 34), (54, 26), (60, 24))]
    for g in galhos:
        t.linha(list(g), coral, 4)
    # corpo redondo
    t.elipse(32, 42, 17, 14, coral)
    # perninhas
    for x in (20, 30, 38, 46):
        t.elipse(x, 56, 4, 3, coral)
    t.luz(poupar=(ponta[:3],))
    # pontas acesas dos galhos
    for x, y in ((8, 4), (20, 6), (30, 1), (38, 6), (56, 4), (44, 5), (4, 24), (60, 24)):
        t.elipse(x, y, 2, 2, ponta)
        t.px(x, y, BRANCO)
    # poros do coral-de-fogo no corpo
    for x, y in ((22, 36), (27, 48), (40, 38), (45, 46), (34, 52), (19, 45), (42, 52)):
        t.px(x, y, coral_e)
        t.px(x + 1, y, ponta)
    # chaminhas em volta
    for x, y in ((12, 40), (52, 38), (9, 50)):
        t.poli([(x - 2, y + 3), (x, y - 3), (x + 2, y + 3)], brasa)
        t.px(x, y + 1, ponta)
    if not costas:
        t.elipse(32, 40, 10, 7, (255, 200, 150, 255))     # carinha clara
        olho(t, 28, 39, 2, PRETO)
        olho(t, 36, 39, 2, PRETO)
        t.pxs([(30, 44), (31, 45), (32, 45), (33, 45), (34, 44)], coral_e)
        t.pxs([(25, 42), (26, 42), (38, 42), (39, 42)], (250, 140, 110, 255))
    else:
        for x, y in ((28, 36), (36, 36), (32, 44), (26, 46), (38, 46)):
            t.elipse(x, y, 2, 2, coral_e)
            t.px(x, y, ponta)
    t.contorno()
    return t


# ---------------------------------------------------------------- TIRTOUGA
def tirtougabrag(t, costas=False):
    """TIRTOUGA-BRAG: tartaruga-de-pente. Casco de placas âmbar e marrom,
    bico de gavião e as nadadeiras azuis antigas do TIRTOUGA. ÁGUA/DRAGÃO."""
    azul = (70, 128, 190, 255)
    azul_e = (40, 80, 140, 255)
    ambar = (214, 150, 56, 255)
    marrom = (110, 62, 32, 255)
    bico = (236, 206, 120, 255)
    # casco em domo: meia elipse cortada reta embaixo
    t.elipse(36, 42, 22, 17, ambar)
    t.ret(10, 47, 60, 62, VAZIO)
    t.ret(14, 46, 58, 50, marrom)                         # a borda de baixo
    # nadadeiras (a da frente grande, de remar; a de trás pequena)
    t.poli([(20, 46), (8, 50), (2, 58), (8, 60), (22, 56), (30, 50)], azul)
    t.poli([(46, 48), (54, 56), (62, 60), (52, 60), (42, 52)], azul)
    t.poli([(56, 44), (63, 44), (58, 48)], azul)          # rabinho
    # pescoço e a cabeça grande do TIRTOUGA, com o bico de gavião
    t.poli([(22, 42), (12, 34), (16, 28), (26, 36)], azul)
    t.elipse(12, 28, 9, 8, azul)
    t.poli([(5, 27), (0, 30), (1, 35), (5, 36), (10, 34)], bico)
    t.luz()
    # placas do casco (o "pente" imbricado)
    for cx, cy in ((36, 31), (26, 37), (46, 37), (20, 43), (32, 43), (42, 43), (52, 43)):
        t.poli([(cx - 5, cy + 3), (cx - 3, cy - 3), (cx + 3, cy - 3), (cx + 5, cy + 3)], marrom)
        t.poli([(cx - 3, cy + 1), (cx - 2, cy - 2), (cx + 2, cy - 2), (cx + 3, cy + 1)], ambar)
        t.px(cx - 1, cy - 1, (250, 214, 130, 255))
        t.px(cx + 1, cy, (160, 90, 40, 255))
    for x in range(16, 58, 4):                            # serrilha da borda
        t.px(x, 50, ambar)
    # as placas azul-escuras da cabeça e das nadadeiras
    t.linha([(6, 22), (12, 20), (18, 24)], azul_e, 1)
    for x, y in ((16, 30), (19, 34), (10, 54), (16, 55), (52, 57)):
        t.px(x, y, azul_e)
    t.linha([(1, 32), (6, 32)], escurecer(bico, 0.35), 1)
    t.px(0, 31, escurecer(bico, 0.35))
    if not costas:
        olhao(t, 11, 27, 3, (210, 60, 60, 255))
        t.linha([(6, 23), (14, 24)], azul_e, 1)
    else:
        t.elipse(12, 28, 8, 7, azul)
        t.linha([(8, 24), (16, 24)], azul_e, 1)
        t.linha([(36, 26), (36, 49)], marrom, 1)
    t.contorno()
    return t


# ---------------------------------------------------------------- CARVANHA
def carvanhabrag(t, costas=False):
    """CARVANHA-BRAG: filhote de tubarão-limão. A bocarra do CARVANHA num
    corpo amarelado de tubarão, duas barbatanas de dorso do mesmo tamanho e a
    estrela da testa virada joia psíquica. ÁGUA/PSÍQUICO."""
    limao = (206, 190, 110, 255)
    limao_e = (150, 136, 74, 255)
    barriga = (244, 238, 206, 255)
    joia = (240, 90, 200, 255)
    # rabo de tubarão (lobo de cima maior)
    t.poli([(48, 38), (62, 22), (60, 36), (63, 52), (48, 44)], limao)
    # duas barbatanas de dorso
    t.poli([(20, 26), (30, 8), (36, 26)], limao)
    t.poli([(40, 30), (47, 18), (50, 32)], limao)
    # corpo: a bola-torpedo do CARVANHA
    t.elipse(28, 38, 24, 15, limao)
    # nadadeiras de peito
    t.poli([(22, 48), (14, 60), (30, 52)], limao_e)
    t.poli([(40, 48), (46, 58), (48, 48)], limao_e)
    t.luz()
    t.elipse(26, 45, 20, 7, barriga)
    t.ret(4, 38, 50, 40, limao)
    # a bocarra
    t.poli([(4, 38), (22, 42), (4, 48)], (140, 30, 50, 255))
    for x in range(5, 20, 3):                             # dentes de cima e de baixo
        y = 38 + (x - 4) * 4 // 18
        t.px(x, y + 1, BRANCO)
        t.px(x + 1, 47 - (x - 4) * 4 // 18, BRANCO)
    # guelras
    for x in (32, 35, 38):
        t.linha([(x, 32), (x - 1, 40)], limao_e, 1)
    # a joia na testa
    t.pxs([(18, 25), (17, 26), (18, 26), (19, 26), (18, 27)], joia)
    t.pxs([(18, 24), (16, 26), (20, 26), (18, 28)], (255, 180, 240, 255))
    if not costas:
        t.poli([(10, 30), (17, 30), (16, 34), (10, 33)], (255, 220, 60, 255))
        t.pxs([(13, 31), (13, 32)], PRETO)
        t.linha([(9, 28), (18, 30)], PRETO, 1)            # sobrancelha brava
    else:
        t.elipse(20, 34, 8, 6, limao)
        t.linha([(10, 36), (46, 34)], limao_e, 1)
    t.contorno()
    return t


# ---------------------------------------------------------------- DUCKLETT
def ducklettbrag(t, costas=False):
    """DUCKLETT-BRAG: atobá-marrom. O patinho azul ficou marrom de costas e
    branco de peito, com o bico amarelo comprido e o pé-de-pato amarelo; o
    tufo da cabeça continua. ÁGUA/VOADOR."""
    marrom = (110, 76, 52, 255)
    marrom_e = (78, 52, 38, 255)
    amarelo = (240, 200, 70, 255)
    amarelo_e = (196, 150, 40, 255)
    # pés
    t.poli([(20, 54), (12, 60), (26, 60)], amarelo)
    t.poli([(38, 54), (32, 60), (46, 60)], amarelo)
    # corpo
    t.elipse(32, 44, 16, 13, marrom)
    t.poli([(44, 40), (60, 44), (58, 50), (46, 50)], marrom)     # rabo
    # asas
    t.poli([(18, 38), (6, 46), (10, 50), (20, 48)], marrom_e)
    t.poli([(46, 38), (56, 36), (52, 46), (44, 48)], marrom_e)
    # cabeça
    t.elipse(30, 20, 11, 10, marrom)
    # bico comprido e pontudo
    t.poli([(20, 20), (4, 26), (20, 26)], amarelo)
    # tufo branco do DUCKLETT
    t.elipse(33, 9, 5, 3, (246, 246, 240, 255))
    t.poli([(34, 6), (42, 3), (38, 10)], (246, 246, 240, 255))
    t.luz()
    # peito branco do atobá: a linha reta que separa marrom e branco
    t.poli([(20, 36), (44, 36), (47, 44), (42, 54), (22, 54), (17, 44)], (250, 248, 242, 255))
    t.linha([(5, 26), (20, 24)], amarelo_e, 1)
    t.linha([(19, 56), (19, 60)], amarelo_e, 1)
    t.linha([(38, 56), (38, 60)], amarelo_e, 1)
    for x, y in ((8, 47), (11, 49), (50, 40), (48, 44)):
        t.px(x, y, marrom)
    if not costas:
        olhao(t, 25, 17, 3, (230, 220, 90, 255))
        olhao(t, 35, 17, 3, (230, 220, 90, 255))
        t.pxs([(21, 22), (22, 22)], (70, 50, 40, 255))
    else:
        t.elipse(30, 20, 10, 9, marrom)
        t.elipse(32, 44, 15, 12, marrom)
        t.linha([(32, 34), (32, 54)], marrom_e, 1)
        t.poli([(18, 38), (8, 48), (22, 50)], marrom_e)
        t.poli([(46, 38), (56, 48), (42, 50)], marrom_e)
    t.contorno()
    return t


# --------------------------------------------------------------- CLAUNCHER
def clauncherbrag(t, costas=False):
    """CLAUNCHER-BRAG: camarão-pistola. Corpo de camarão listrado de laranja,
    enroladinho, e a garra azul do CLAUNCHER maior que ele todo: quando fecha,
    estala tão rápido que solta um clarão e um choque na água. ÁGUA/ELÉTRICO."""
    corpo = (236, 124, 80, 255)
    corpo_e = (176, 76, 54, 255)
    faixa = (250, 214, 180, 255)
    garra = (80, 150, 226, 255)
    garra_e = (46, 96, 170, 255)
    ponta = (240, 60, 60, 255)
    raio = (255, 236, 80, 255)
    # o rabo: gomos em arco descendo pra direita até o leque
    gomos = [(46, 36, 8), (52, 41, 7), (55, 47, 6), (54, 53, 5)]
    for x, y, r in gomos:
        t.elipse(x, y, r, r - 1, corpo)
    t.poli([(50, 55), (44, 60), (52, 61), (58, 60), (58, 55)], corpo)   # leque
    # a carapaça (cabeça-tórax)
    t.elipse(38, 36, 10, 8, corpo)
    t.poli([(30, 32), (24, 30), (30, 36)], corpo)        # o rostro
    # perninhas
    for x in (34, 38, 42, 46):
        t.linha([(x, 42), (x - 2, 50), (x - 3, 51)], corpo_e, 1)
    # o braço e a garra enorme
    t.linha([(32, 40), (26, 44)], garra, 4)
    t.elipse(16, 40, 13, 9, garra)                        # a palma
    t.poli([(6, 34), (0, 36), (0, 40), (6, 40)], garra)   # dedo fixo de baixo
    t.poli([(4, 29), (14, 28), (18, 32), (8, 34), (1, 34)], garra_e)   # o dedo "cão", de cima
    t.luz(poupar=(raio[:3],))
    # listras claras dos gomos
    for x, y, r in gomos:
        t.linha([(x - r + 2, y - r + 2), (x + r - 3, y + r - 3)], faixa, 1)
    t.linha([(33, 30), (37, 42)], faixa, 1)
    t.linha([(44, 57), (58, 57)], corpo_e, 1)
    # a garra: fresta, pontas vermelhas e brilho
    t.linha([(1, 35), (10, 35)], PRETO, 1)
    t.pxs([(0, 36), (0, 37), (1, 37), (0, 34), (1, 33), (2, 33)], ponta)
    t.linha([(10, 36), (22, 34), (28, 38)], garra_e, 1)
    t.pxs([(12, 42), (16, 44), (20, 42)], clarear(garra, 0.5))
    # o estalo: clarão e raio na frente da garra
    t.linha([(4, 24), (1, 20), (5, 16), (2, 11)], raio, 1)
    t.linha([(2, 46), (6, 50), (3, 54)], raio, 1)
    bolhas(t, [(10, 22), (8, 54), (16, 56)])
    # antenas
    t.linha([(34, 30), (40, 14), (50, 4)], corpo_e, 1)
    t.linha([(36, 30), (46, 18), (60, 12)], corpo_e, 1)
    if not costas:
        # olhinhos em talo
        for x in (32, 37):
            t.linha([(x, 30), (x, 27)], corpo_e, 1)
            olho(t, x, 26, 2)
    else:
        t.elipse(38, 36, 9, 7, corpo)
        t.linha([(30, 36), (46, 36)], corpo_e, 1)
        t.linha([(8, 38), (26, 40)], garra_e, 1)
    t.contorno()
    return t


# ----------------------------------------------------------------- BINACLE
def binaclebrag(t, costas=False):
    """BINACLE-BRAG: duas cracas coladas numa pedra do recife. De cada boca do
    cone sai a mãozinha de pena do BINACLE — com os olhos na palma, como
    sempre. PEDRA/ÁGUA."""
    casca = (226, 220, 206, 255)
    casca_e = (170, 162, 150, 255)
    mao = (244, 204, 90, 255)
    mao_e = (190, 140, 50, 255)
    # a pedra de baixo
    t.elipse(32, 55, 29, 7, PEDRA)
    # dois cones de craca
    cones = ((18, 30), (46, 34))
    for cx, alto in cones:
        t.poli([(cx - 14, 54), (cx - 6, alto), (cx + 6, alto), (cx + 14, 54)], casca)
    # os braços saindo da boca e a mão espalmada com três dedos de pena
    for (cx, alto), lado in zip(cones, (-1, 1)):
        mx, my = cx + lado * 4, alto - 14
        t.linha([(cx, alto), (mx, my + 4)], mao, 4)
        t.elipse(mx, my, 7, 6, mao)
        for dx in (-5, 0, 5):
            t.linha([(mx + dx, my - 4), (mx + dx * 2 + lado * 2, my - 13)], mao, 3)
    t.luz()
    for cx, alto in cones:
        for dx in (-8, 0, 8):                             # placas do cone
            t.linha([(cx + dx, 54), (cx + dx * 2 // 5, alto + 2)], casca_e, 1)
        t.ret(cx - 5, alto, cx + 5, alto + 2, (60, 50, 60, 255))    # a boca
    for (cx, alto), lado in zip(cones, (-1, 1)):
        mx, my = cx + lado * 4, alto - 14
        for dx in (-5, 0, 5):                             # as cerdas da pena
            x0, y0 = mx + dx, my - 4
            x1, y1 = mx + dx * 2 + lado * 2, my - 13
            for f in (0.35, 0.65, 0.95):
                x = round(x0 + (x1 - x0) * f)
                y = round(y0 + (y1 - y0) * f)
                t.px(x - 2, y, mao)
                t.px(x + 2, y, mao)
        t.linha([(cx + lado, alto - 1), (mx + lado, my + 5)], mao_e, 1)
    # algas na pedra
    for x in (5, 32, 59):
        t.linha([(x, 54), (x + 1, 49)], (80, 150, 80, 255), 1)
    t.pxs([(14, 58), (34, 59), (50, 58)], PEDRA_E)
    if not costas:
        for (cx, alto), lado in zip(cones, (-1, 1)):
            mx, my = cx + lado * 4, alto - 14
            olho(t, mx - 3, my, 2)
            olho(t, mx + 3, my, 2)
            t.pxs([(mx - 1, my + 3), (mx, my + 4), (mx + 1, my + 3)], mao_e)
    else:
        for (cx, alto), lado in zip(cones, (-1, 1)):
            mx, my = cx + lado * 4, alto - 14
            t.linha([(mx - 3, my + 1), (mx + 3, my + 1)], mao_e, 1)
    t.contorno()
    return t


# ---------------------------------------------------------------- FRILLISH
def frillishbrag(t, costas=False):
    """FRILLISH-BRAG: água-viva-lua. Sino claro, meio transparente, com o
    trevo de quatro anéis rosados no alto e a gola de babado do FRILLISH;
    embaixo, a franja fininha e os quatro braços de véu. ÁGUA/FADA."""
    sino = (220, 222, 246, 255)
    sino_e = (170, 170, 214, 255)
    rosa = (240, 140, 190, 255)
    veu = (236, 190, 226, 255)
    # sino (a metade de cima de uma elipse, com a borda achatada)
    t.elipse(32, 22, 22, 16, sino)
    t.ret(8, 26, 56, 40, VAZIO)
    t.elipse(32, 26, 22, 4, sino)
    # braços de véu, pendurados do meio do sino
    for x, dx in ((22, -5), (29, -2), (35, 2), (42, 5)):
        pts = [(x + round(math.sin(i / 1.6) * 2) + dx * i // 9, 28 + i * 3) for i in range(11)]
        t.linha(pts, veu, 3)
        t.linha(pts[1:], clarear(veu, 0.4), 1)
    # coroa de babado do FRILLISH
    for i, x in enumerate(range(12, 54, 6)):
        t.elipse(x, 6 + abs(x - 32) // 3, 3, 3, veu)
    t.luz()
    # o trevo: quatro ferraduras rosas
    for cx, cy in ((26, 15), (38, 15), (26, 23), (38, 23)):
        t.anel(cx, cy, 3, 3, rosa, 1)
        t.px(cx, cy, clarear(rosa, 0.3))
    # franja fina na borda do sino
    for x in range(12, 53, 2):
        t.linha([(x, 30), (x + (1 if x > 32 else -1), 35)], sino_e, 1)
    t.linha([(10, 27), (54, 27)], sino_e, 1)
    for x, y in ((6, 10), (58, 14), (4, 40), (60, 44)):   # brilhinho de fada
        t.pxs([(x, y - 1), (x - 1, y), (x + 1, y), (x, y + 1)], (255, 200, 240, 255))
        t.px(x, y, BRANCO)
    if not costas:
        t.elipse(32, 20, 8, 5, sino)
        olho(t, 28, 20, 2, (80, 60, 140, 255))
        olho(t, 36, 20, 2, (80, 60, 140, 255))
        t.pxs([(31, 24), (32, 25), (33, 24)], rosa)
    else:
        t.elipse(32, 19, 6, 6, clarear(rosa, 0.3))
    t.contorno()
    return t


# -------------------------------------------------------------- PYUKUMUKU
def pyukumukubrag(t, costas=False):
    """PYUKUMUKU-BRAG: pepino-do-mar das piscinas do atol, roxo-escuro e cheio
    de verruga amarela. O punho do PYUKUMUKU ele solta pela boca, pegajoso e
    venenoso. ÁGUA/VENENO."""
    corpo = (104, 60, 130, 255)
    corpo_e = (70, 38, 92, 255)
    verruga = (240, 200, 60, 255)
    punho = (190, 240, 120, 255)
    # corpo de salsicha deitado
    t.elipse(36, 44, 25, 14, corpo)
    # espinhos do dorso (os do PYUKUMUKU)
    for x in range(16, 58, 7):
        y = 32 + abs(x - 36) // 3
        t.poli([(x - 3, y + 3), (x, y - 6), (x + 3, y + 3)], corpo)
    # o punho saindo pela boca, à esquerda
    t.poli([(14, 42), (6, 36), (8, 30), (14, 32), (18, 40)], punho)
    t.elipse(6, 30, 5, 5, punho)
    t.luz()
    for x in range(16, 58, 7):                            # pontas amarelas
        y = 32 + abs(x - 36) // 3
        t.pxs([(x, y - 5), (x, y - 4)], verruga)
    for x, y in ((24, 42), (32, 38), (40, 40), (48, 42), (28, 50), (44, 50), (52, 48), (36, 48)):
        t.elipse(x, y, 1, 1, verruga)
    t.linha([(14, 52), (58, 52)], corpo_e, 1)
    for x in range(18, 56, 3):                            # pezinhos-ventosa
        t.px(x, 57, clarear(corpo, 0.4))
    t.pxs([(3, 28), (5, 26), (8, 27), (10, 30)], clarear(punho, 0.4))
    for x, y in ((2, 38), (10, 24), (1, 22)):             # gota de veneno
        t.px(x, y, (170, 90, 220, 255))
    if not costas:
        olho(t, 20, 42, 2, PRETO)
        olho(t, 27, 42, 2, PRETO)
        t.pxs([(22, 46), (23, 47), (24, 46)], corpo_e)
    else:
        t.linha([(20, 36), (54, 36)], corpo_e, 1)
    t.contorno()
    return t


# ---------------------------------------------------------------- DHELMISE
def dhelmisebrag(t, costas=False):
    """DHELMISE-BRAG: âncora de um navio que afundou no recife, comida de
    ferrugem e cracas, com o sargaço dourado enrolado em vez da alga verde, e
    o leme podre pendurado. FANTASMA/AÇO."""
    ferro = (150, 100, 70, 255)
    ferro_e = (100, 60, 44, 255)
    ferrugem = (206, 110, 50, 255)
    sargaco = (178, 150, 50, 255)
    sargaco_e = (120, 100, 30, 255)
    boia = (230, 200, 80, 255)
    madeira = (130, 90, 56, 255)
    # a âncora: haste, cepo em cima, braços curvos embaixo
    t.ret(29, 8, 35, 52, ferro)
    t.ret(20, 12, 44, 16, ferro)
    t.anel(32, 5, 5, 5, ferro, 3)                         # argola
    t.poli([(8, 40), (12, 38), (22, 52), (32, 56), (42, 52), (52, 38), (56, 40),
            (52, 52), (40, 60), (24, 60), (12, 52)], ferro)
    t.poli([(4, 38), (12, 34), (14, 42)], ferro)          # patas
    t.poli([(60, 38), (52, 34), (50, 42)], ferro)
    # o sargaço enrolado, uma cabeleira caindo da argola
    for x0, x1 in ((28, 14), (36, 50), (30, 22), (34, 44)):
        pts = [(round(x0 + (x1 - x0) * i / 8 + math.sin(i) * 2), 10 + i * 4) for i in range(9)]
        t.linha(pts, sargaco, 3)
    t.elipse(32, 20, 11, 7, sargaco)
    # o leme podre pendurado do lado
    t.anel(50, 22, 7, 7, madeira, 2)
    for a in range(0, 360, 60):
        x = 50 + round(math.cos(math.radians(a)) * 9)
        y = 22 + round(math.sin(math.radians(a)) * 9)
        t.linha([(50, 22), (x, y)], madeira, 1)
    t.luz()
    for x, y in ((31, 30), (33, 44), (18, 50), (46, 50), (30, 58), (22, 14), (41, 14)):
        t.elipse(x, y, 1, 1, ferrugem)                    # manchas de ferrugem
    for x, y in ((14, 46), (48, 46), (34, 36)):           # cracas
        t.elipse(x, y, 2, 2, (220, 214, 200, 255))
        t.px(x, y, PRETO)
    for x, y in ((18, 24), (46, 26), (22, 38), (42, 40), (26, 30)):   # boias do sargaço
        t.elipse(x, y, 1, 1, boia)
    t.linha([(24, 22), (40, 22)], sargaco_e, 1)
    t.elipse(50, 22, 2, 2, madeira)
    if not costas:
        # os olhos-fantasma no meio do sargaço
        for cx in (27, 37):
            t.elipse(cx, 19, 2, 3, (150, 240, 200, 255))
            t.px(cx, 19, BRANCO)
    else:
        t.linha([(26, 18), (38, 18)], sargaco_e, 1)
        t.linha([(32, 16), (32, 24)], sargaco_e, 1)
    t.contorno()
    return t


# ----------------------------------------------------------------- WAILMER
def wailmerbrag(t, costas=False):
    """WAILMER-BRAG: filhote de jubarte. A bola do WAILMER ficou cinza-escura,
    com os caroços na cabeça, a barriga branca de pregas e as nadadeiras de
    peito compridas e brancas, que são o orgulho da jubarte. ÁGUA/NORMAL."""
    pele = (60, 70, 92, 255)
    pele_e = (40, 46, 64, 255)
    branco = (236, 238, 242, 255)
    branco_e = (190, 196, 206, 255)
    agua = (140, 210, 240, 255)
    # rabo em cima atrás
    t.poli([(48, 30), (56, 20), (62, 14), (63, 22), (58, 26), (54, 34)], pele)
    # corpo-bola
    t.elipse(30, 38, 24, 20, pele)
    # nadadeiras longas brancas, penduradas pro chão
    t.poli([(10, 42), (0, 50), (2, 60), (8, 58), (16, 48)], branco)
    t.poli([(46, 44), (58, 54), (60, 60), (52, 60), (42, 50)], branco)
    t.luz()
    # barriga branca de pregas
    t.elipse(28, 49, 18, 9, branco)
    t.ret(8, 38, 50, 42, pele)
    for x in range(14, 44, 4):
        t.linha([(x, 44), (x + 1, 56)], branco_e, 1)
    # caroços (tubérculos) da cabeça
    for x, y in ((14, 26), (20, 22), (26, 20), (33, 20), (18, 30), (24, 26)):
        t.elipse(x, y, 1, 1, clarear(pele, 0.3))
    # bordinha serrilhada da nadadeira
    for y in range(46, 60, 3):
        t.px(2 + (y - 46) // 6, y, branco_e)
    # o esguicho pelo espiráculo
    t.linha([(34, 17), (34, 8)], agua, 2)
    for x, y in ((30, 5), (34, 3), (38, 5), (27, 8), (41, 8)):
        t.elipse(x, y, 1, 1, agua)
    if not costas:
        olho(t, 12, 36, 2)
        t.linha([(6, 42), (12, 44), (20, 45), (30, 44)], pele_e, 1)   # a bocona
        t.pxs([(16, 40), (17, 40)], (240, 150, 170, 255))
    else:
        t.elipse(30, 38, 22, 18, pele)
        for x, y in ((20, 28), (28, 26), (36, 28), (24, 34), (32, 32)):
            t.elipse(x, y, 1, 1, clarear(pele, 0.3))
        t.linha([(30, 22), (30, 54)], pele_e, 1)
    t.contorno()
    return t


# ----------------------------------------------------------------- MANTYKE
def mantykebrag(t, costas=False):
    """MANTYKE-BRAG: raia-chita. Asas azul-marinho pintadas de bolinha branca,
    focinho de bico de pato, as anteninhas do MANTYKE e o rabo de chicote
    comprido. ÁGUA/VOADOR."""
    azul = (40, 56, 110, 255)
    azul_e = (26, 36, 76, 255)
    barriga = (240, 240, 246, 255)
    # rabo de chicote
    t.linha([(32, 44), (36, 52), (44, 57), (58, 60)], azul_e, 2)
    # asas
    t.poli([(32, 20), (2, 34), (6, 42), (22, 44), (32, 48), (42, 44), (58, 42), (62, 34)], azul)
    # cabeça com o focinho redondo de pato
    t.elipse(32, 24, 9, 8, azul)
    t.elipse(32, 32, 6, 4, azul)
    # anteninhas do MANTYKE
    t.linha([(28, 17), (24, 6)], azul, 2)
    t.linha([(36, 17), (40, 6)], azul, 2)
    t.luz()
    # barriga clara aparecendo embaixo das asas
    t.poli([(10, 41), (22, 43), (32, 47), (42, 43), (54, 41), (42, 46), (32, 50), (22, 46)], barriga)
    # bolinhas brancas de chita
    for x, y in ((12, 36), (18, 33), (16, 39), (24, 30), (24, 38), (40, 30), (40, 38),
                 (46, 33), (48, 39), (52, 36), (30, 22), (35, 26), (7, 37), (57, 37)):
        t.px(x, y, BRANCO)
        t.px(x + 1, y, (200, 210, 230, 255))
    t.pxs([(24, 6), (40, 6)], (120, 200, 250, 255))
    if not costas:
        t.elipse(32, 33, 5, 2, (200, 210, 230, 255))
        olho(t, 26, 26, 2, (230, 220, 90, 255))
        olho(t, 38, 26, 2, (230, 220, 90, 255))
        t.pxs([(26, 26), (38, 26)], PRETO)
        t.pxs([(30, 34), (31, 35), (32, 35), (33, 35), (34, 34)], azul_e)
    else:
        # o desenho de "carinha" que o MANTYKE tem nas costas, em bolinha
        t.elipse(24, 36, 3, 3, BRANCO)
        t.elipse(40, 36, 3, 3, BRANCO)
        t.linha([(28, 42), (36, 42)], BRANCO, 1)
    t.contorno()
    return t


# -------------------------------------------------------------- ALOMOMOLA
def alomomolabrag(t, costas=False):
    """ALOMOMOLA-BRAG: peixe-lua. Um disco prateado enorme que parece só
    cabeça, com a barbatana de cima e a de baixo altíssimas e o rabo curto de
    babado. O coração rosa do ALOMOMOLA virou as marcas da pele. ÁGUA/PSÍQUICO."""
    prata = (176, 184, 200, 255)
    prata_e = (120, 128, 150, 255)
    rosa = (240, 130, 170, 255)
    # barbatanas altas
    t.poli([(34, 18), (44, 0), (48, 2), (46, 20)], prata_e)
    t.poli([(34, 46), (44, 62), (48, 60), (46, 44)], prata_e)
    # o clavus (rabo de babado)
    for y in range(20, 46, 5):
        t.elipse(52, y, 4, 3, prata)
    # disco
    t.elipse(30, 32, 22, 18, prata)
    t.luz()
    # coraçõezinhos
    def coracao(x, y):
        t.pxs([(x, y), (x + 2, y), (x - 1, y + 1), (x, y + 1), (x + 1, y + 1),
               (x + 2, y + 1), (x + 3, y + 1), (x, y + 2), (x + 1, y + 2), (x + 2, y + 2),
               (x + 1, y + 3)], rosa)
    for x, y in ((28, 20), (38, 28), (30, 40), (20, 44), (42, 40)):
        coracao(x, y)
    for y in range(20, 46, 5):
        t.linha([(49, y), (55, y)], prata_e, 1)
    t.linha([(8, 36), (48, 42)], clarear(prata, 0.25), 1)   # a faixa clara da barriga
    t.poli([(42, 1), (45, 2), (43, 6)], clarear(prata_e, 0.3))
    if not costas:
        olhao(t, 18, 28, 3, (200, 80, 160, 255))
        t.elipse(10, 34, 2, 2, (200, 100, 130, 255))        # a boquinha em "o"
        t.px(10, 34, PRETO)
        t.poli([(22, 34), (28, 30), (28, 38)], prata_e)     # nadadeira de peito
    else:
        t.elipse(30, 32, 20, 16, prata)
        for x, y in ((20, 26), (34, 24), (26, 38), (38, 36)):
            coracao(x, y)
    t.contorno()
    return t


# ----------------------------------------------------------------- BRUXISH
def bruxishbrag(t, costas=False):
    """BRUXISH-BRAG: budião-azul, o peixe-papagaio que só existe no Brasil.
    Os dentes do BRUXISH viraram bico de papagaio que rói coral e cospe
    areia, a crista virou alga e as escamas são azul e verde. ÁGUA/PLANTA."""
    azul = (60, 140, 200, 255)
    azul_e = (36, 92, 150, 255)
    verde = (90, 190, 130, 255)
    alga = (70, 160, 70, 255)
    alga_e = (40, 110, 44, 255)
    bico = (236, 236, 220, 255)
    rosa = (240, 120, 170, 255)
    # rabo
    t.poli([(48, 34), (62, 22), (60, 34), (62, 48)], azul)
    # barbatanas
    t.poli([(16, 22), (28, 14), (46, 20), (44, 26)], azul_e)
    t.poli([(26, 46), (34, 56), (42, 46)], azul_e)
    # corpo gordo
    t.elipse(28, 35, 22, 14, azul)
    # a crista de alga (no lugar do penacho do BRUXISH)
    for x0, ang in ((22, -2.0), (26, -1.7), (30, -1.4), (34, -1.1)):
        pts = [(round(x0 + math.cos(ang) * i * 3 + math.sin(i) * 1.5),
                round(22 + math.sin(ang) * i * 3)) for i in range(5)]
        t.linha(pts, alga, 3)
    # bico de papagaio
    t.poli([(8, 30), (0, 34), (2, 40), (10, 40)], bico)
    t.luz()
    # escamas quadriculadas azul e verde
    for y in range(26, 46, 4):
        for x in range(18 + (y // 4 % 2) * 2, 48, 4):
            if (x - 28) ** 2 / 22 ** 2 + (y - 35) ** 2 / 14 ** 2 < 0.8:
                t.pxs([(x, y), (x + 1, y)], verde)
    t.linha([(1, 37), (9, 36)], (170, 170, 150, 255), 1)    # a racha do bico
    t.pxs([(3, 35), (5, 35), (4, 38), (6, 38)], (200, 200, 180, 255))
    for x in range(52, 62, 3):
        t.linha([(x, 30), (x, 40)], verde, 1)
    t.linha([(10, 32), (16, 44)], azul_e, 1)               # guelra
    # grãozinho de areia saindo (ele faz areia de coral)
    for x, y in ((2, 46), (5, 50), (1, 53), (7, 56)):
        t.px(x, y, AREIA)
    t.pxs([(20, 11), (27, 9), (33, 11)], alga_e)
    if not costas:
        # o olhão psíquico do BRUXISH, rosa com cílio
        t.elipse(15, 31, 4, 4, BRANCO)
        t.elipse(15, 31, 3, 3, rosa)
        t.elipse(15, 31, 1, 1, PRETO)
        t.px(14, 30, BRANCO)
        t.linha([(10, 26), (19, 26)], azul_e, 1)
    else:
        t.elipse(24, 35, 12, 9, azul)
        t.linha([(10, 30), (46, 30)], azul_e, 1)
        t.linha([(14, 40), (46, 40)], verde, 1)
    t.contorno()
    return t


DESENHOS = {
    21701: (rockruffbrag, "rockruffbrag"),
    21702: (corsolabrag, "corsolabrag"),
    21703: (tirtougabrag, "tirtougabrag"),
    21704: (carvanhabrag, "carvanhabrag"),
    21705: (ducklettbrag, "ducklettbrag"),
    21706: (clauncherbrag, "clauncherbrag"),
    21707: (binaclebrag, "binaclebrag"),
    21708: (frillishbrag, "frillishbrag"),
    21709: (pyukumukubrag, "pyukumukubrag"),
    21710: (dhelmisebrag, "dhelmisebrag"),
    21711: (wailmerbrag, "wailmerbrag"),
    21712: (mantykebrag, "mantykebrag"),
    21713: (alomomolabrag, "alomomolabrag"),
    21714: (bruxishbrag, "bruxishbrag"),
}
