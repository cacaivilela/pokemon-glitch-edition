"""LOTE 3 — MATA, PLANTAS E INSETOS de Braglitch.

Saúvas, açaí, guaraná, vitória-régia, mandacaru e o CURUPIRA, desenhados por
forma com tools/pixelart.py (frente e costas).
"""
import math

from pixelart import Tela, clarear, escurecer  # noqa: F401

BRANCO = (250, 250, 250, 255)
PRETO = (30, 26, 34, 255)


def olho(t, cx, cy, r=2, iris=PRETO, brilho=BRANCO):
    t.elipse(cx, cy, r, r, iris)
    t.px(cx - 1, cy - 1, brilho)


def folha_palmeira(t, x0, y0, x1, y1, cor, cor_e, curva=4, folheta=4):
    """Fronde de palmeira: um talo curvo com folíolos pendurados."""
    pts = []
    for i in range(9):
        k = i / 8
        x = x0 + (x1 - x0) * k
        y = y0 + (y1 - y0) * k - math.sin(k * math.pi) * curva
        pts.append((round(x), round(y)))
    for i, (x, y) in enumerate(pts[1:], 1):
        comp = folheta if i < 7 else folheta - 1
        t.linha([(x, y), (x, y + comp)], cor_e if i % 2 else cor, 1)
    t.linha(pts, cor, 2)


# ------------------------------------------------------------- SAUVINHA
def sauvinha(t, costas=False):
    """Saúva pequenininha, vermelho-escura, carregando nas mandíbulas uma
    folha verde três vezes maior que ela. INSETO/PLANTA."""
    corpo = (150, 44, 36, 255)
    corpo_e = (96, 26, 26, 255)
    folha = (96, 176, 64, 255)
    folha_e = (58, 124, 44, 255)
    nervura = (176, 222, 120, 255)

    # a folha, erguida por cima das costas
    t.linha([(13, 48), (16, 42), (21, 34)], folha_e, 2)                # talo mordido
    t.poli([(20, 36), (14, 24), (18, 12), (28, 5), (40, 4), (52, 9), (57, 18),
            (54, 28), (46, 34), (34, 37)], folha)
    for x, y in ((14, 24), (18, 12), (28, 5), (40, 4), (52, 9), (57, 18), (54, 28)):
        t.px(x, y, (0, 0, 0, 0))                                        # borda serrilhada

    # pernas (atrás do corpo)
    for x0, x1 in ((26, 20), (30, 30), (33, 40)):
        t.linha([(x0, 48), ((x0 + x1) // 2, 52), (x1, 58)], corpo_e, 2)
    t.elipse(42, 49, 9, 7, corpo)                                       # gáster
    t.elipse(30, 49, 5, 4, corpo)                                       # tórax
    t.ret(34, 48, 36, 50, corpo_e)                                      # cinturinha
    t.elipse(19, 47, 7, 6, corpo)                                       # cabeça
    for x0, x1 in ((27, 22), (30, 32), (33, 43)):                       # pernas da frente
        t.linha([(x0, 51), ((x0 + x1) // 2 + 1, 54), (x1, 59)], corpo, 2)

    t.luz(poupar=())

    # nervuras da folha
    t.linha([(20, 36), (30, 22), (40, 14), (50, 12)], nervura, 1)
    for a, b in (((26, 27), (20, 20)), ((30, 22), (28, 12)), ((35, 18), (38, 8)),
                 ((32, 21), (42, 26)), ((40, 14), (48, 20)), ((45, 13), (52, 16))):
        t.linha([a, b], nervura, 1)
    # espinhos do tórax e listra do gáster
    t.pxs([(29, 44), (31, 44)], corpo_e)
    t.linha([(40, 44), (44, 55)], corpo_e, 1)
    # antenas
    t.linha([(17, 42), (13, 36), (9, 37)], corpo_e, 1)
    t.linha([(21, 41), (19, 35), (15, 33)], corpo_e, 1)
    t.pxs([(15, 49), (13, 49), (12, 48)], corpo_e)                      # mandíbula
    if not costas:
        olho(t, 17, 46, 2)
        t.px(15, 51, PRETO)
    t.contorno()
    return t


# ---------------------------------------------------------- SAUVARAINHA
def sauvarainha(t, costas=False):
    """A içá, rainha das saúvas: cabeçona coroada de folhas, asas de vidro e,
    nas costas, o jardim de fungo onde a colônia planta sua comida.
    INSETO/PLANTA."""
    corpo = (160, 48, 38, 255)
    corpo_e = (98, 26, 26, 255)
    asa = (206, 226, 236, 255)
    asa_e = (150, 180, 200, 255)
    fungo = (236, 226, 196, 255)
    fungo_e = (196, 180, 148, 255)
    folha = (96, 176, 64, 255)
    folha_e = (52, 118, 42, 255)
    coroa = (128, 200, 72, 255)

    # asas atrás de tudo
    t.poli([(30, 36), (46, 12), (60, 8), (58, 18), (38, 40)], asa)
    t.poli([(30, 40), (52, 28), (62, 30), (56, 38), (36, 44)], asa_e)
    # pernas de trás
    for x0, x1 in ((30, 22), (34, 34), (38, 48)):
        t.linha([(x0, 46), ((x0 + x1) // 2, 52), (x1, 59)], corpo_e, 3)
    t.elipse(45, 48, 13, 10, corpo)                                     # gáster enorme
    # o jardim de fungo, montado no lombo
    for cx, cy, r in ((40, 36, 6), (47, 33, 6), (54, 37, 5), (44, 40, 5), (51, 41, 4)):
        t.elipse(cx, cy, r, r - 1, fungo)
    t.elipse(31, 44, 7, 6, corpo)                                       # tórax
    t.elipse(18, 34, 12, 11, corpo)                                     # cabeçona
    # coroa de folhas
    for pts in (((8, 26), (4, 14), (12, 22)), ((12, 24), (11, 9), (17, 22)),
                ((17, 23), (20, 7), (23, 23)), ((22, 24), (29, 11), (27, 26))):
        t.poli(list(pts), coroa)
    # pernas da frente
    for x0, x1 in ((30, 26), (33, 36), (37, 44)):
        t.linha([(x0, 48), ((x0 + x1) // 2 + 1, 54), (x1, 60)], corpo, 3)
    # mandíbulas
    t.poli([(10, 40), (6, 46), (10, 47), (13, 43)], corpo_e)

    t.luz(poupar=())

    # nervuras das asas
    t.linha([(32, 37), (46, 16), (58, 12)], asa_e, 1)
    t.linha([(34, 41), (52, 32), (60, 32)], (120, 150, 176, 255), 1)
    # textura do fungo e folhinhas cortadas plantadas nele
    for x, y in ((38, 34), (45, 31), (52, 35), (42, 39), (49, 39), (55, 38)):
        t.px(x, y, fungo_e)
    for x, y in ((41, 30), (48, 28), (54, 32)):
        t.poli([(x, y + 3), (x - 2, y), (x + 1, y - 2), (x + 2, y + 1)], folha)
        t.px(x, y, folha_e)
    # nervura central da coroa e listras do gáster
    for x0, y0, x1, y1 in ((7, 23, 6, 17), (13, 22, 12, 13), (20, 21, 20, 11), (25, 23, 27, 15)):
        t.linha([(x0, y0), (x1, y1)], folha_e, 1)
    for x in (44, 50):
        t.linha([(x, 51), (x + 2, 57)], corpo_e, 1)
    # antenas
    t.linha([(10, 28), (4, 30), (2, 36)], corpo_e, 1)
    t.linha([(24, 26), (30, 20), (34, 22)], corpo_e, 1)
    if not costas:
        olho(t, 13, 33, 3)
        olho(t, 22, 32, 3)
        t.pxs([(12, 29), (13, 29), (14, 29), (21, 28), (22, 28), (23, 28)], corpo_e)
        t.linha([(14, 40), (18, 41), (20, 40)], PRETO, 1)
    t.contorno()
    return t


# ------------------------------------------------------------ ACAIZINHO
def acaizinho(t, costas=False):
    """Um cachinho de açaí de carinha redonda: bolinhas roxo-quase-pretas
    grudadas umas nas outras e um topete de folha de palmeira. PLANTA/VENENO."""
    roxo = (74, 36, 88, 255)
    roxo_e = (44, 20, 56, 255)
    roxo_c = (150, 96, 170, 255)
    talo = (132, 96, 56, 255)
    folha = (86, 164, 72, 255)
    folha_e = (46, 110, 50, 255)

    bagas = [(32, 30), (26, 34), (38, 34), (21, 40), (32, 38), (43, 40),
             (18, 47), (27, 45), (37, 45), (46, 47), (22, 53), (32, 52),
             (42, 53), (27, 58), (37, 58)]
    t.elipse(32, 45, 14, 13, roxo_e)                                    # miolo do cacho
    for x, y in bagas:
        t.elipse(x, y, 5, 5, roxo)
    t.ret(31, 18, 33, 26, talo)                                         # talo
    # topete de folhas de palmeira
    t.poli([(32, 20), (18, 10), (8, 16), (20, 14)], folha)
    t.poli([(32, 20), (46, 10), (56, 16), (44, 14)], folha)
    t.poli([(32, 20), (24, 4), (30, 6)], folha_e)
    t.poli([(32, 20), (40, 4), (34, 6)], folha)

    t.luz(poupar=())

    for x, y in bagas:                                                  # cada bolinha com brilho
        t.anel(x, y, 5, 5, roxo_e, 1)
        t.px(x - 2, y - 2, roxo_c)
        t.px(x - 1, y - 3, roxo_c)
    for x0, y0, x1, y1 in ((30, 18, 12, 13), (34, 18, 52, 13)):         # folíolos
        for k in range(1, 6):
            x = x0 + (x1 - x0) * k // 6
            y = y0 + (y1 - y0) * k // 6
            t.linha([(x, y), (x + (1 if x1 < x0 else -1), y + 3)], folha_e, 1)
    if not costas:
        # carinha no meio do cacho
        t.elipse(32, 44, 9, 7, roxo)
        for x in (28, 36):
            t.ret(x - 1, 40, x + 1, 44, PRETO)
            t.pxs([(x - 1, 40), (x - 1, 41)], BRANCO)
        t.linha([(30, 47), (32, 48), (34, 47)], roxo_c, 1)
        t.pxs([(24, 46), (40, 46)], (190, 90, 150, 255))                # bochechas
    t.contorno()
    return t


# ------------------------------------------------------------ ACAIZEIRO
def acaizeiro(t, costas=False):
    """A palmeira-açaí de pé: tronco fininho anelado, copa de frondes e os
    cachos roxos pendurados como dois braços pesados. PLANTA/VENENO."""
    tronco = (150, 132, 100, 255)
    tronco_e = (104, 90, 66, 255)
    folha = (82, 160, 70, 255)
    folha_e = (40, 104, 48, 255)
    cabeca = (104, 150, 64, 255)
    raque = (196, 120, 60, 255)
    roxo = (74, 36, 88, 255)
    roxo_e = (44, 20, 56, 255)
    roxo_c = (150, 96, 170, 255)

    # tronco e raízes-pés
    t.ret(29, 26, 35, 56, tronco)
    t.poli([(29, 54), (22, 61), (28, 61), (32, 57), (36, 61), (42, 61), (35, 54)], tronco_e)
    # frondes da copa (atrás da cabeça)
    for x1, y1, c in ((4, 22, 8), (8, 8, 5), (20, 2, 3), (44, 2, 3), (56, 8, 5), (60, 22, 8)):
        folha_palmeira(t, 32, 16, x1, y1, folha, folha_e, curva=c, folheta=5)
    # cabeça: o palmito verde onde as frondes nascem
    t.elipse(32, 20, 9, 8, cabeca)
    # braços-cacho
    for lado in (-1, 1):
        ox = 32 + lado * 5
        t.linha([(ox, 26), (32 + lado * 12, 30), (32 + lado * 15, 36)], raque, 2)
        for dx, dy in ((12, 36), (16, 38), (14, 41), (18, 43), (12, 44), (16, 47), (14, 51)):
            t.elipse(32 + lado * dx, dy, 3, 3, roxo)

    t.luz(poupar=())

    for y in range(30, 55, 4):                                          # anéis do tronco
        t.linha([(29, y), (35, y)], tronco_e, 1)
    for lado in (-1, 1):
        for dx, dy in ((12, 36), (16, 38), (14, 41), (18, 43), (12, 44), (16, 47), (14, 51)):
            t.px(32 + lado * dx - 1, dy - 1, roxo_c)
            t.px(32 + lado * dx + 1, dy + 2, roxo_e)
    if not costas:
        olho(t, 28, 20, 2)
        olho(t, 36, 20, 2)
        t.pxs([(26, 16), (27, 16), (28, 16), (36, 16), (37, 16), (38, 16)], folha_e)
        t.linha([(30, 25), (32, 26), (34, 25)], PRETO, 1)
    t.contorno()
    return t


# ----------------------------------------------------------- GUARANINHO
def guaraninho(t, costas=False):
    """O fruto do guaraná aberto: a casca vermelha racha e de dentro olha a
    semente preta no arilo branco — um olho que não pisca. PLANTA/PSÍQUICO."""
    casca = (206, 44, 40, 255)
    casca_e = (140, 24, 30, 255)
    arilo = (248, 244, 236, 255)
    semente = (26, 20, 24, 255)
    psi = (236, 110, 200, 255)
    folha = (86, 164, 72, 255)
    folha_e = (46, 110, 50, 255)
    talo = (120, 86, 50, 255)

    t.elipse(32, 42, 17, 17, casca)                                     # o fruto
    t.poli([(28, 57), (26, 61), (31, 60)], casca_e)                     # biquinho de baixo
    t.ret(31, 18, 33, 26, talo)
    t.poli([(32, 22), (18, 14), (10, 20), (22, 22)], folha)             # folhinhas
    t.poli([(32, 22), (46, 12), (54, 18), (42, 22)], folha)
    t.poli([(18, 44), (10, 44), (4, 50), (12, 50)], folha_e)            # folhinhas-braço
    t.poli([(46, 44), (54, 44), (60, 50), (52, 50)], folha_e)

    t.luz(poupar=())

    t.linha([(31, 21), (18, 17)], folha_e, 1)
    t.linha([(33, 21), (46, 16)], folha_e, 1)
    if not costas:
        # a casca aberta em duas "pálpebras"
        t.elipse(32, 42, 12, 11, casca_e)
        t.elipse(32, 42, 11, 10, arilo)
        t.elipse(32, 43, 7, 7, semente)
        t.anel(32, 43, 7, 7, (70, 40, 70, 255), 1)
        t.anel(32, 43, 4, 4, psi, 1)                                    # o anel hipnótico
        t.elipse(30, 40, 1, 1, BRANCO)
        t.px(35, 46, (120, 110, 130, 255))
        # ondas psíquicas
        for x, y in ((10, 32), (8, 36), (54, 32), (56, 36)):
            t.px(x, y, psi)
        t.pxs([(12, 30), (52, 30)], psi)
    else:
        t.linha([(32, 26), (32, 58)], casca_e, 1)                       # a costura da casca fechada
        t.linha([(25, 30), (22, 42), (25, 54)], casca_e, 1)
    t.contorno()
    return t


# ---------------------------------------------------------- VITORIREGIA
def vitoriregia(t, costas=False):
    """A vitória-régia: uma bandeja redonda de folha com a borda levantada e
    avermelhada, boiando; no meio, a flor branco-rosada é o rosto, de olhos
    fechados, na calma da água parada. PLANTA/ÁGUA."""
    folha = (84, 156, 72, 255)
    folha_e = (50, 110, 54, 255)
    borda = (184, 74, 72, 255)
    borda_c = (226, 120, 104, 255)
    agua = (84, 150, 210, 255)
    agua_c = (180, 222, 246, 255)
    petala = (250, 244, 248, 255)
    petala_e = (220, 206, 222, 255)
    rosa = (242, 150, 184, 255)
    rosa_e = (206, 96, 140, 255)
    miolo = (252, 214, 90, 255)

    t.elipse(32, 56, 30, 4, agua)                                       # a água
    t.elipse(32, 49, 29, 8, borda)                                      # a borda levantada
    t.elipse(32, 47, 27, 7, folha)                                      # a bandeja
    # a flor: pétalas brancas em leque, pontudas, abertas pra cima
    for ang in range(-165, -10, 25):
        a = math.radians(ang)
        c, n = (math.cos(a), math.sin(a)), (-math.sin(a), math.cos(a))
        pto = lambda k, w: (round(32 + c[0] * 20 * k + n[0] * w), round(42 + c[1] * 22 * k + n[1] * w))
        t.poli([pto(0, 3), pto(0.6, 6), pto(1, 0), pto(0.6, -6), pto(0, -3)], petala)
    t.elipse(32, 36, 11, 9, rosa)                                       # a cabeça-flor
    t.luz(poupar=())

    t.elipse(32, 47, 25, 5, folha_e)                                    # o fundo da bandeja
    t.elipse(32, 46, 24, 4, folha)
    for ang in range(0, 180, 22):                                       # nervuras radiais
        a = math.radians(ang)
        t.linha([(32, 47), (32 + round(math.cos(a) * 24), 47 + round(math.sin(a) * 5))], folha_e, 1)
    for x in range(7, 58, 4):                                           # gomos da borda
        t.px(x, 52 + (x % 3 == 0), borda_c)
    for ang in range(-165, -10, 25):                                    # o risco no meio de cada pétala
        a = math.radians(ang)
        t.linha([(32 + round(math.cos(a) * 12), 42 + round(math.sin(a) * 13)),
                 (32 + round(math.cos(a) * 17), 42 + round(math.sin(a) * 19))], petala_e, 1)
    for dx in (-9, 9):                                                  # pétalas da frente, deitadas
        t.elipse(32 + dx, 45, 5, 2, petala)
        t.px(32 + dx - 2 * (dx > 0) + 1, 45, rosa)
    t.pxs([(25, 31), (26, 30), (27, 30), (28, 29)], clarear(rosa, 0.45))
    # ondinhas
    for x0 in (3, 13, 45, 55):
        t.linha([(x0, 59), (x0 + 5, 59)], agua_c, 1)
    t.linha([(26, 61), (38, 61)], agua_c, 1)
    if not costas:
        # olhos fechados: calma total
        t.pxs([(25, 36), (26, 37), (27, 37), (28, 37), (29, 36)], PRETO)
        t.pxs([(35, 36), (36, 37), (37, 37), (38, 37), (39, 36)], PRETO)
        t.pxs([(31, 40), (32, 41), (33, 40)], rosa_e)
        t.pxs([(24, 39), (25, 39), (39, 39), (40, 39)], (252, 196, 214, 255))
    else:
        t.elipse(32, 35, 5, 4, miolo)                                   # o miolo amarelo, visto de trás e de cima
        t.px(31, 33, clarear(miolo, 0.4))
    t.contorno()
    return t


# ------------------------------------------------------------- MANDACARU
def mandacaru(t, costas=False):
    """O mandacaru do sertão: coluna verde-azulada de gomos, braços em
    candelabro, espinhos claros, a flor branca que abre de noite e a cara
    fechada de quem aguenta a seca. PLANTA/TERRA."""
    verde = (78, 140, 104, 255)
    verde_e = (44, 92, 72, 255)
    espinho = (250, 236, 180, 255)
    terra = (176, 120, 72, 255)
    terra_e = (112, 72, 44, 255)
    flor = (250, 250, 244, 255)
    miolo = (246, 210, 90, 255)

    t.elipse(32, 59, 22, 4, terra)                                      # chão rachado
    t.ret(25, 16, 39, 58, verde)                                        # coluna
    t.elipse(32, 16, 7, 5, verde)
    # braços em candelabro
    t.ret(13, 36, 25, 42, verde)
    t.ret(11, 18, 17, 40, verde)
    t.elipse(14, 18, 3, 3, verde)
    t.ret(39, 30, 51, 36, verde)
    t.ret(47, 12, 53, 34, verde)
    t.elipse(50, 12, 3, 3, verde)
    t.elipse(11, 40, 2, 2, verde)
    t.elipse(53, 34, 2, 2, verde)

    t.luz(poupar=())

    # gomos (costelas verticais)
    for x in (29, 35):
        t.linha([(x, 14), (x, 57)], verde_e, 1)
    t.linha([(14, 19), (14, 39)], verde_e, 1)
    t.linha([(50, 13), (50, 33)], verde_e, 1)
    # espinhos
    for x, y in ((24, 20), (24, 30), (24, 48), (40, 22), (40, 42), (40, 52), (32, 12),
                 (10, 24), (10, 32), (18, 22), (46, 18), (46, 26), (54, 16), (54, 26),
                 (20, 35), (44, 29), (27, 56), (37, 56)):
        t.px(x, y, espinho)
        t.px(x + (1 if x > 32 else -1), y - 1, espinho)
    # rachaduras no chão
    t.linha([(12, 59), (17, 60), (20, 58)], terra_e, 1)
    t.linha([(44, 58), (48, 60), (53, 59)], terra_e, 1)
    t.linha([(22, 61), (26, 62)], terra_e, 1)
    # a flor branca no alto
    for dx, dy in ((-3, 0), (3, 0), (0, -3), (-2, -2), (2, -2)):
        t.elipse(32 + dx, 9 + dy, 2, 2, flor)
    t.elipse(32, 9, 1, 1, miolo)
    if not costas:
        # cara séria
        t.linha([(26, 24), (30, 26)], PRETO, 1)
        t.linha([(38, 24), (34, 26)], PRETO, 1)
        olho(t, 28, 28, 2)
        olho(t, 36, 28, 2)
        t.linha([(29, 34), (35, 34)], PRETO, 1)
    t.contorno()
    return t


# -------------------------------------------------------------- CURUPIRA
def curupira(t, costas=False):
    """O CURUPIRA, guardião da mata. Corpo de cipó trançado e folhas,
    cabeleira de fogo verde e laranja, olhos acesos e — o que denuncia — os
    pés virados pra trás: calcanhar na frente, dedos apontando pro lado
    errado. PLANTA/FANTASMA, lendário."""
    cipo = (104, 84, 54, 255)
    cipo_e = (66, 50, 34, 255)
    pele = (140, 112, 72, 255)
    folha = (70, 150, 70, 255)
    folha_e = (38, 100, 52, 255)
    fogo_v = (110, 230, 110, 255)
    fogo_l = (255, 140, 40, 255)
    fogo_a = (255, 224, 90, 255)
    aura = (150, 250, 200, 255)
    olho_cor = (200, 255, 150, 255)

    # a cabeleira de fogo (atrás da cabeça)
    t.poli([(12, 30), (6, 16), (14, 20), (14, 6), (22, 14), (26, 1), (32, 10), (38, 1),
            (42, 14), (50, 6), (50, 20), (58, 16), (52, 30), (44, 32), (20, 32)], fogo_l)
    t.poli([(16, 28), (12, 20), (18, 22), (19, 11), (25, 17), (29, 7), (32, 14), (35, 7),
            (39, 17), (45, 11), (46, 22), (52, 20), (48, 28)], fogo_v)
    # pernas
    t.poli([(22, 44), (28, 44), (27, 56), (23, 56)], cipo)
    t.poli([(37, 44), (43, 44), (42, 56), (38, 56)], cipo)
    # os pés virados: calcanhar redondo pra frente (esquerda), dedos pra trás
    for x in (17, 35):
        t.elipse(x + 5, 58, 4, 3, pele)                                 # calcanhar
        t.ret(x + 5, 56, x + 13, 61, pele)                              # sola
        for dy in (55, 57, 59, 61):                                     # dedos
            t.ret(x + 13, dy, x + 15, dy, pele)
    # tronco de cipó
    t.poli([(20, 30), (44, 30), (41, 46), (23, 46)], cipo)
    # saiote de folhas
    for x in range(20, 44, 5):
        t.poli([(x - 1, 42), (x + 6, 42), (x + 2, 52)], folha)
    # braços de cipó, fortes, abertos
    t.linha([(22, 32), (14, 38), (9, 47)], cipo, 4)
    t.linha([(42, 32), (50, 38), (55, 47)], cipo, 4)
    t.poli([(10, 34), (18, 36), (14, 40)], folha)                       # braçadeiras de folha
    t.poli([(54, 34), (46, 36), (50, 40)], folha)
    t.poli([(9, 46), (3, 54), (12, 52)], folha)                         # mãos-folha
    t.poli([(55, 46), (61, 54), (52, 52)], folha)
    # cabeça
    t.elipse(32, 23, 9, 9, pele)

    t.luz(poupar=(fogo_l[:3], fogo_v[:3], fogo_a[:3]))

    # labaredas internas
    for x, y in ((14, 10), (26, 5), (38, 5), (50, 10), (8, 19), (56, 19)):
        t.pxs([(x, y), (x, y + 1), (x, y + 2)], fogo_a)
    # cipó trançado no peito (em X, com folhinhas)
    t.linha([(22, 31), (41, 44)], cipo_e, 1)
    t.linha([(42, 31), (23, 44)], cipo_e, 1)
    t.linha([(26, 31), (26, 40)], cipo_e, 1)
    t.linha([(38, 31), (38, 40)], cipo_e, 1)
    for x, y in ((32, 37), (27, 34), (37, 34)):
        t.pxs([(x, y), (x + 1, y - 1), (x - 1, y + 1)], folha)
    for x in range(20, 44, 5):
        t.linha([(x + 2, 43), (x + 2, 49)], folha_e, 1)
    # dedos separados e o calcanhar marcado
    for x in (17, 35):
        t.pxs([(x + 13, 56), (x + 13, 58), (x + 13, 60)], escurecer(pele, 0.45))
        t.px(x + 3, 57, clarear(pele, 0.35))
    # a aura
    for x, y in ((4, 32), (6, 24), (58, 32), (60, 26), (2, 42), (61, 42), (6, 60),
                 (58, 58), (4, 8), (60, 8), (16, 50), (48, 50)):
        t.px(x, y, aura)
        if (x + y) % 3 == 0:
            t.pxs([(x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)], aura)
    if not costas:
        olho(t, 28, 23, 2, olho_cor, BRANCO)
        olho(t, 36, 23, 2, olho_cor, BRANCO)
        t.pxs([(28, 23), (36, 23)], (40, 140, 70, 255))
        t.pxs([(25, 19), (26, 20), (27, 20), (39, 19), (38, 20), (37, 20)], PRETO)
        t.linha([(29, 28), (35, 28)], PRETO, 1)
        t.pxs([(30, 29), (34, 29)], PRETO)
    else:
        # a nuca é só cabelo em chamas
        t.poli([(23, 30), (22, 18), (27, 20), (29, 14), (32, 19), (35, 14), (37, 20),
                (42, 18), (41, 30)], fogo_l)
        t.poli([(26, 30), (26, 22), (30, 24), (32, 19), (34, 24), (38, 22), (38, 30)], fogo_v)
        t.pxs([(29, 26), (29, 27), (35, 26), (35, 27)], fogo_a)
    t.contorno()
    return t


DESENHOS = {
    1045: (sauvinha, "sauvinha"),
    1046: (sauvarainha, "sauvarainha"),
    1047: (acaizinho, "acaizinho"),
    1048: (acaizeiro, "acaizeiro"),
    1049: (guaraninho, "guaraninho"),
    1050: (vitoriregia, "vitoriregia"),
    1063: (mandacaru, "mandacaru"),
    1078: (curupira, "curupira"),
}
