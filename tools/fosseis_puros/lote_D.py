"""Fósseis puros, lote D: as tartarugas de coral e as aves de arco-íris.

TIRTOUGA PURO (casco de coral vivo, com peixinhos morando nele) ->
CARRACOSTA PURO (um recife inteiro nas costas); ARCHEN PURO (cada pena de
um tom) -> ARCHEOPS PURO (as penas em arco-íris).

A silhueta é a do Pokémon de verdade; as cores são as de antes da pedra.
"""
from pixelart import Tela, clarear, escurecer  # noqa: F401

BRANCO = (250, 250, 250, 255)
PRETO = (30, 26, 34, 255)

# o mar raso e o coral vivo
AQUA = (84, 196, 222, 255)
AQUA_E = (40, 132, 176, 255)
AQUA_C = (186, 236, 240, 255)
CORAL = (246, 120, 120, 255)
CORAL_C = (255, 176, 160, 255)
ROSA = (238, 110, 180, 255)
LARANJA = (250, 156, 64, 255)
AMARELO = (250, 216, 72, 255)
LILAS = (176, 120, 226, 255)
VERDE_ALGA = (92, 196, 120, 255)
PEIXE = (255, 196, 40, 255)

# o arco-íris das penas
ARCO = [
    (236, 64, 72, 255),    # vermelho
    (250, 146, 48, 255),   # laranja
    (250, 218, 64, 255),   # amarelo
    (96, 204, 96, 255),    # verde
    (64, 168, 236, 255),   # azul
    (124, 96, 220, 255),   # anil
    (200, 104, 220, 255),  # violeta
]


def olho(t, cx, cy, r=2, iris=PRETO, brilho=BRANCO):
    t.elipse(cx, cy, r, r, iris)
    t.px(cx - 1, cy - 1, brilho)


def peixinho(t, x, y, cor=PEIXE, vira=1):
    """um peixinho de 4px, de frente pra `vira` (1 = direita, -1 = esquerda)."""
    t.elipse(x, y, 2, 1, cor)
    t.poli([(x - 2 * vira, y), (x - 4 * vira, y - 2), (x - 4 * vira, y + 2)], cor)
    t.px(x + 1 * vira, y, PRETO)


def ramo(t, x, y, cor, alto=6):
    """um galhinho de coral: um tronco e dois braços."""
    t.linha([(x, y), (x, y - alto)], cor, 2)
    t.linha([(x, y - alto // 2), (x - 3, y - alto + 1)], cor, 2)
    t.linha([(x, y - alto // 2 - 1), (x + 3, y - alto)], cor, 2)


# -------------------------------------------------------------- TIRTOUGA
def tirtougapuro(t, costas=False):
    """A tartaruguinha de frente, nadando rente ao chão; o casco é um coral
    vivo, rosado e cheio de galhos, e um peixinho mora nele."""
    # nadadeiras de trás e de frente
    t.poli([(40, 46), (58, 40), (62, 44), (50, 52), (40, 52)], AQUA_E)        # traseira dir.
    t.poli([(6, 36), (2, 44), (8, 46), (20, 46), (24, 42)], AQUA)            # dianteira esq.
    t.poli([(40, 50), (54, 54), (58, 60), (44, 58), (36, 56)], AQUA)          # dianteira dir.
    # casco de coral
    t.elipse(32, 38, 22, 12, escurecer(CORAL, 0.2))
    t.elipse(31, 36, 20, 10, CORAL)
    t.elipse(30, 33, 14, 6, CORAL_C)
    # pescoço + cabeça (embaixo e à esquerda, olhando pra gente)
    t.elipse(22, 50, 10, 7, AQUA)
    if not costas:
        t.elipse(22, 53, 6, 3, AQUA_C)
    t.luz()
    # placas do casco: os "pólipos" do coral
    for x, y in ((18, 34), (26, 30), (34, 30), (42, 34), (30, 38), (40, 40), (22, 40)):
        t.anel(x, y, 2, 2, escurecer(CORAL, 0.18), 1)
        t.px(x, y, clarear(CORAL_C, 0.4))
    # galhos de coral crescendo em cima
    ramo(t, 22, 28, ROSA, 6)
    ramo(t, 36, 27, LARANJA, 7)
    ramo(t, 46, 31, LILAS, 5)
    t.linha([(12, 38), (10, 33)], VERDE_ALGA, 1)
    t.linha([(52, 38), (55, 33)], VERDE_ALGA, 1)
    peixinho(t, 30, 21 if not costas else 22, PEIXE, -1)
    if not costas:
        olho(t, 18, 49, 2)
        olho(t, 27, 49, 2)
        t.linha([(19, 54), (25, 54)], escurecer(AQUA_E, 0.3), 1)    # boquinha
        t.px(22, 55, CORAL)
    else:
        t.linha([(12, 50), (32, 50)], AQUA_E, 1)
    t.contorno()
    return t


# ------------------------------------------------------------ CARRACOSTA
def pena(t, x0, y0, x1, y1, cor, larg=3, raque=True):
    """uma pena afinando: larga em (x0, y0), ponta em (x1, y1)."""
    import math
    dx, dy = x1 - x0, y1 - y0
    n = math.hypot(dx, dy) or 1
    px_, py_ = -dy / n * larg / 2, dx / n * larg / 2
    t.poli([(x0 + px_, y0 + py_), (x0 - px_, y0 - py_), (x1, y1)], cor)
    if raque:
        t.linha([(x0, y0), (round(x0 + dx * 0.7), round(y0 + dy * 0.7))], escurecer(cor, 0.22), 1)


def pluma(t, x0, y0, x1, y1, cor, larg=5):
    """pena redonda de filhote: a pena afinando com a barriga cheia."""
    pena(t, x0, y0, x1, y1, cor, larg, raque=False)
    t.elipse(round(x0 + (x1 - x0) * 0.6), round(y0 + (y1 - y0) * 0.6), 2, 2, cor)


def carracostapuro(t, costas=False):
    """Em pé e corcunda como o de verdade: cabeça pequena de testa alta e bico
    em gancho, ombros largos, as nadadeiras enormes caindo até o chão feito
    capa, e nas costas um recife inteiro (corais, anêmona, alga, peixinhos)."""
    PELE = AQUA
    PELE_E = AQUA_E
    PELE_EE = escurecer(AQUA_E, 0.25)
    BARRIGA = AQUA_C
    # o recife nas costas, alto atrás do ombro direito
    t.poli([(30, 14), (42, 6), (54, 8), (60, 20), (60, 40), (54, 50), (38, 48)], CORAL)
    t.poli([(44, 10), (54, 12), (58, 24), (50, 30), (42, 22)], CORAL_C)
    t.poli([(56, 30), (60, 40), (54, 50), (46, 46)], escurecer(CORAL, 0.2))
    ramo(t, 38, 10, ROSA, 7)
    ramo(t, 48, 8, LARANJA, 8)
    ramo(t, 57, 14, LILAS, 6)
    # nadadeira de trás (direita): cai do ombro até o chão
    t.poli([(40, 22), (50, 30), (56, 44), (58, 58), (52, 60), (48, 50), (42, 38)], PELE_E)
    # pernas grossas
    t.elipse(22, 53, 6, 6, PELE_E)
    t.elipse(38, 53, 6, 6, PELE_E)
    t.ret(15, 57, 29, 60, PELE_EE)
    t.ret(31, 57, 45, 60, PELE_EE)
    # tronco e ombros largos
    t.elipse(30, 40, 13, 14, PELE)
    t.elipse(30, 28, 15, 8, PELE)
    if not costas:
        t.elipse(29, 43, 7, 9, BARRIGA)
        t.elipse(31, 47, 5, 5, mistura_(BARRIGA, PELE))
    # cabeça pequena: testa em domo, bico em gancho pra baixo
    t.elipse(22, 16, 8, 9, PELE)
    t.poli([(16, 8), (22, 4), (30, 8), (31, 18), (24, 14), (17, 14)], PELE_E)   # placa da testa
    if not costas:
        t.poli([(17, 16), (12, 20), (11, 26), (14, 30), (16, 26), (22, 26), (24, 20)], BARRIGA)  # bico
    # nadadeira da frente (esquerda): capa até o chão
    t.poli([(20, 24), (12, 28), (6, 38), (2, 50), (4, 60), (10, 58), (12, 48), (16, 38), (22, 32)], PELE)
    t.poli([(8, 40), (4, 50), (5, 59), (10, 57), (11, 48)], PELE_E)
    t.luz()
    # dedos/garras
    for x in (16, 20, 24, 32, 36, 40):
        t.px(x, 60, BRANCO)
    t.pxs([(4, 59), (7, 59), (53, 59), (56, 58)], BRANCO)
    # placas do corpo (linhas da pele, mais escuras)
    t.linha([(18, 30), (24, 34), (36, 34), (42, 30)], PELE_E, 1)
    t.linha([(12, 36), (16, 46)], PELE_E, 1)
    t.linha([(48, 36), (52, 50)], PELE_EE, 1)
    # pólipos do recife
    for x, y in ((46, 16), (40, 12), (56, 26), (58, 34)):
        t.anel(x, y, 2, 2, escurecer(CORAL, 0.2), 1)
        t.px(x, y, CORAL_C)
    t.elipse(55, 22, 2, 2, AMARELO)
    t.pxs([(53, 20), (57, 20), (55, 19)], AMARELO)
    t.linha([(60, 44), (62, 34)], VERDE_ALGA, 2)
    peixinho(t, 34, 2, (120, 220, 255, 255), -1)
    if not costas:
        olho(t, 18, 15, 2, iris=(30, 70, 90, 255))
        t.px(18, 15, PRETO)
        t.linha([(14, 12), (21, 13)], PRETO, 1)                       # cenho
        t.linha([(13, 25), (21, 24)], escurecer(AQUA_E, 0.35), 1)     # boca
        t.px(12, 27, escurecer(BARRIGA, 0.3))
        for y in (38, 42, 46):
            t.linha([(25, y), (33, y)], clarear(AQUA_E, 0.25), 1)
    else:
        # vista de trás: o casco-recife cobre as costas
        t.elipse(32, 34, 14, 15, CORAL)
        t.elipse(30, 30, 8, 8, CORAL_C)
        t.elipse(36, 42, 7, 5, escurecer(CORAL, 0.18))
        ramo(t, 28, 28, ROSA, 6)
        ramo(t, 38, 34, LARANJA, 6)
        t.elipse(24, 40, 2, 2, AMARELO)
        peixinho(t, 40, 24, PEIXE, 1)
    t.contorno()
    return t


def mistura_(a, b):
    return tuple((x + y) // 2 for x, y in zip(a, b))


# ---------------------------------------------------------------- ARCHEN
def archenpuro(t, costas=False):
    """Deitado pra frente como o de verdade: cabeça grande de bico vermelho
    e nuca azul, braço-asa esticado, rabo comprido pra trás. Cada pena de
    volta à cor, cada uma de um tom."""
    VERMELHO, LAR, AMA, VER, AZU, ANIL, VIO = ARCO
    CORPO = (250, 214, 96, 255)
    CORPO_E = (220, 168, 64, 255)
    PELE = (214, 90, 72, 255)
    # rabo pra trás e pra cima, com leque de penas coloridas na ponta
    t.poli([(40, 40), (52, 34), (56, 36), (46, 46)], CORPO_E)
    for i, c in enumerate((VIO, ANIL, AZU, VER, AMA)):
        pluma(t, 48, 39, 61, 28 + i * 4, c, 5)
    # pernas
    t.linha([(32, 46), (30, 54)], PELE, 2)
    t.linha([(40, 46), (42, 54)], PELE, 2)
    t.linha([(26, 55), (34, 55)], PELE, 2)
    t.linha([(38, 55), (46, 55)], PELE, 2)
    # asa de trás (direita, pra cima): penas em leque
    for i, c in enumerate((VERMELHO, LAR, VIO)):
        pluma(t, 36 + i * 3, 35, 41 + i * 4, 26 + i, c, 5)
    # corpo
    t.elipse(36, 40, 10, 8, CORPO)
    t.elipse(38, 44, 7, 4, CORPO_E)
    # pescoço + cabeça
    t.poli([(26, 30), (32, 32), (34, 38), (28, 40)], CORPO)
    t.elipse(26, 22, 9, 8, AZU)                     # nuca azul
    t.elipse(22, 24, 8, 7, VERMELHO)                # cara vermelha
    if not costas:
        t.poli([(16, 20), (8, 24), (10, 30), (18, 30)], VERMELHO)   # focinho/bico
        t.poli([(9, 28), (18, 29), (17, 31), (11, 31)], escurecer(VERMELHO, 0.3))  # mandíbula
    # braço-asa da frente esticado pra esquerda: osso amarelo, penas coloridas
    t.poli([(30, 36), (16, 36), (12, 40), (18, 42), (30, 42)], CORPO)
    for i, c in enumerate((VERMELHO, LAR, AMA, VER, AZU)):
        pluma(t, 20, 39, 5 + i, 31 + i * 4, c, 5)
    t.luz()
    # garrinhas da mão e dos pés
    t.pxs([(11, 35), (12, 34), (13, 35)], BRANCO)
    for x in (26, 28, 34, 38, 44, 46):
        t.px(x, 57, BRANCO)
    # penugem: cada pena um tom
    for (x, y), c in zip(((32, 38), (36, 37), (40, 38), (34, 42), (38, 41), (42, 42)),
                         (VERMELHO, VER, AZU, VIO, LAR, ANIL)):
        t.px(x, y, c)
        t.px(x + 1, y + 1, escurecer(c, 0.2))
    if not costas:
        t.elipse(25, 21, 3, 3, BRANCO)
        t.elipse(25, 21, 1, 2, PRETO)
        t.linha([(10, 28), (20, 28)], escurecer(VERMELHO, 0.45), 1)  # boca
        t.px(10, 27, BRANCO)
        t.px(13, 29, BRANCO)
        t.px(12, 24, escurecer(VERMELHO, 0.4))                        # narina
    else:
        t.linha([(28, 16), (30, 28)], escurecer(AZU, 0.25), 1)
        t.linha([(32, 34), (44, 38)], CORPO_E, 1)
    t.contorno()
    return t


# -------------------------------------------------------------- ARCHEOPS
def archeopspuro(t, costas=False):
    """A primeira ave que voou: magro, as duas asas erguidas com penas longas
    e esfiapadas, a cauda comprida de lagarto enrolada embaixo. As penas são
    o arco-íris, e deixam um rastro dele no ar."""
    import math
    VERMELHO, LAR, AMA, VER, AZU, ANIL, VIO = ARCO
    CORPO = (250, 214, 96, 255)
    CORPO_E = (218, 164, 60, 255)
    PELE = (200, 72, 64, 255)
    PELE_E = (150, 48, 48, 255)

    def asa(ombro, pulso, ang0, ang1):
        # braço amarelo, penas longas e esfiapadas saindo pra fora dele
        (ox, oy), (wx, wy) = ombro, pulso
        n = len(ARCO)
        for i in reversed(range(n)):
            f = i / (n - 1)
            bx = wx + (ox - wx) * f * 0.85
            by = wy + (oy - wy) * f * 0.85
            a = math.radians(ang0 + (ang1 - ang0) * f)
            L = 19 - i * 1.4 + (2 if i % 2 else -1)        # esfiapada
            ex, ey = bx + L * math.cos(a), by - L * math.sin(a)
            pena(t, round(bx), round(by), round(ex), round(ey), ARCO[i], 7)
        t.linha([ombro, pulso], CORPO, 3)
        t.linha([ombro, pulso], CORPO_E, 1)

    # asa de trás (direita): erguida pra cima e pra fora
    asa((38, 28), (48, 14), 70, -15)
    # cauda comprida enrolada, terminando num leque azul
    t.linha([(36, 42), (40, 48), (40, 54), (34, 58), (26, 58)], PELE, 3)
    t.linha([(38, 44), (41, 50), (40, 55)], PELE_E, 1)
    for i, c in enumerate((AZU, ANIL, VER)):
        pena(t, 26, 58, 16 + i * 3, 52 + i * 5, c, 4)
    # pernas finas com garras
    t.linha([(30, 40), (26, 48), (24, 52)], PELE, 2)
    t.linha([(38, 40), (40, 48), (42, 52)], PELE, 2)
    # corpo magro
    t.elipse(34, 34, 7, 9, CORPO)
    t.elipse(36, 38, 4, 5, CORPO_E)
    # gola de penas verdes/azuis
    for i, c in enumerate((VER, AZU, VER, ANIL)):
        pena(t, 30 + i * 3, 27, 28 + i * 4, 34 + (i % 2) * 2, c, 4, raque=False)
    # asa da frente (esquerda): erguida pra cima e pra fora
    asa((29, 29), (16, 14), 112, 195)
    # cabeça: bico aberto, crista verde
    t.elipse(24, 20, 7, 6, VERMELHO)
    t.poli([(22, 14), (36, 12), (32, 20), (26, 18)], VER)          # crista pra trás
    t.poli([(30, 14), (38, 14), (34, 18)], AZU)
    if not costas:
        t.poli([(18, 18), (8, 20), (16, 22)], VERMELHO)            # bico de cima
        t.poli([(16, 23), (10, 25), (19, 26)], escurecer(VERMELHO, 0.25))  # bico de baixo
    # asa da frente (esquerda): erguida pra cima e pra fora
    t.luz()
    t.pxs([(15, 12), (17, 12), (49, 12), (47, 12)], BRANCO)          # garras das asas
    t.pxs([(22, 53), (24, 53), (41, 53), (43, 53)], BRANCO)
    if not costas:
        t.elipse(24, 18, 2, 2, BRANCO)
        t.px(23, 18, PRETO)
        t.pxs([(12, 21), (15, 22)], BRANCO)                         # dentinhos
        t.px(10, 22, escurecer(VERMELHO, 0.5))
    else:
        t.linha([(34, 28), (34, 42)], CORPO_E, 1)
    t.contorno()
    # o rastro de arco-íris, translúcido, atrás das asas (sem contorno)
    for i, c in enumerate(ARCO):
        for x in range(52, 64):
            y = 26 + i + (x - 52) // 3
            if t.cor(x, y)[3] == 0:
                t.px(x, y, (*c[:3], 110))
    return t


DESENHOS = {
    22014: (tirtougapuro, "tirtougapuro"),
    22015: (carracostapuro, "carracostapuro"),
    22016: (archenpuro, "archenpuro"),
    22017: (archeopspuro, "archeopspuro"),
}
