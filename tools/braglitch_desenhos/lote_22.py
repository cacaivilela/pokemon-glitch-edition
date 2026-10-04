"""LOTE 22: as formas da ILHA DA QUEIMADA SANDACONDA (a Queimada Grande de SP).

A ilha das cobras: costão de granito batido de onda, capim seco que pega fogo,
poça de maré entre as pedras. Quem ficou preso lá virou bicho de lá — a
JARARACA-ILHOA dourada (SEVIPER), a fumaça da queimada (KOFFING), a pedra de
costão cheia de craca (GEODUDE), o escorpião-amarelo (GLIGAR), o urubu
(MURKROW), o jacaré-de-papo-amarelo (SANDILE), a formiga-leão no funil de
areia (TRAPINCH), o caramujo-africano (SHUCKLE), o aratu (CRABRAWLER), a
baratinha-da-praia (WIMPOD), o ouriço-do-mar (MAREANIE) e a brasa que anda no
capim (SLUGMA). Todos desenhados do zero, com a silhueta da base por baixo.
"""
from pixelart import Tela, clarear, escurecer  # noqa: F401

BRANCO = (250, 250, 250, 255)
PRETO = (30, 26, 34, 255)

# granito do costão (usado em vários)
GRANITO = (168, 156, 154, 255)
GRANITO_E = (112, 102, 104, 255)
FELDSPATO = (214, 170, 160, 255)
CRACA = (236, 230, 214, 255)
CRACA_E = (150, 140, 124, 255)
CAPIM = (214, 184, 96, 255)
CAPIM_E = (160, 128, 60, 255)
BRASA = (255, 128, 40, 255)
BRASA_C = (255, 214, 90, 255)


def tubo(t, pts, r, cor, r_fim=None):
    """Um corpo roliço (cobra, rabo) passando pelos pontos, raio `r` que pode
    afinar até `r_fim` no fim."""
    r_fim = r if r_fim is None else r_fim
    segs = list(zip(pts, pts[1:]))
    total = sum(max(abs(b[0] - a[0]), abs(b[1] - a[1]), 1) for a, b in segs)
    feito = 0
    for a, b in segs:
        n = max(abs(b[0] - a[0]), abs(b[1] - a[1]), 1)
        for i in range(n + 1):
            f = (feito + i) / total
            rr = r + (r_fim - r) * f
            x = a[0] + (b[0] - a[0]) * i / n
            y = a[1] + (b[1] - a[1]) * i / n
            t.elipse(round(x), round(y), round(rr), round(rr), cor)
        feito += n


def olho(t, cx, cy, r=2, iris=PRETO, fundo=BRANCO):
    t.elipse(cx, cy, r, r, fundo)
    t.elipse(cx, cy, max(1, r - 1), max(1, r - 1), iris)
    t.px(cx - 1, cy - 1, BRANCO)


def chaminha(t, x, y, alto, largo=2):
    t.poli([(x - largo, y), (x, y - alto), (x + largo, y)], BRASA)
    t.poli([(x - largo + 1, y), (x, y - alto // 2), (x + largo - 1, y)], BRASA_C)


# ----------------------------------------------------------------- SEVIPER
def seviperbrag(t, costas=False):
    """SEVIPER-BRAG: a jararaca-ilhoa, dourada, com as manchas em V da
    jararaca, enrolada no chão; a lâmina do rabo virou lasca de granito.
    VENENO/PEDRA."""
    ouro = (222, 178, 74, 255)
    ouro_e = (156, 112, 42, 255)
    mancha = (96, 60, 30, 255)
    barriga = (244, 226, 162, 255)
    presa = (220, 50, 60, 255)
    # a lasca de granito do rabo (atrás de tudo)
    t.poli([(50, 36), (55, 3), (62, 14), (61, 30), (57, 38)], GRANITO)
    # rabo subindo pra lasca
    tubo(t, [(46, 54), (54, 48), (56, 40)], 4, ouro, 3)
    # o rolo no chão, duas voltas
    t.elipse(31, 54, 25, 6, ouro)
    t.elipse(34, 46, 18, 5, ouro)
    # o pescoço subindo, e a cabeça de lança da jararaca
    tubo(t, [(40, 44), (36, 36), (28, 28), (22, 22)], 5, ouro, 4)
    t.poli([(5, 16), (12, 8), (26, 8), (32, 14), (28, 22), (12, 23)], ouro)
    t.luz()
    # facetas da lasca
    t.linha([(55, 5), (56, 36)], GRANITO_E, 1)
    t.pxs([(58, 14), (59, 22), (53, 20), (57, 28), (52, 30)], FELDSPATO)
    t.pxs([(59, 18), (54, 26)], GRANITO_E)
    # barriga clara nas voltas e no pescoço
    t.linha([(12, 59), (50, 59)], barriga, 1)
    t.linha([(20, 50), (48, 50)], barriga, 1)
    if not costas:
        t.linha([(24, 25), (30, 31), (36, 38), (38, 44)], barriga, 2)
    # as manchas em V da jararaca, ao longo do corpo
    for x in range(10, 54, 7):
        t.poli([(x, 51), (x + 3, 55), (x + 6, 51), (x + 4, 51), (x + 3, 53), (x + 2, 51)], mancha)
    for x in range(20, 50, 7):
        t.poli([(x, 43), (x + 3, 47), (x + 6, 43), (x + 4, 43), (x + 3, 45), (x + 2, 43)], mancha)
    for x, y in ((31, 29), (36, 35), (26, 25)):
        t.pxs([(x - 2, y - 1), (x - 1, y), (x, y + 1), (x + 1, y), (x + 2, y - 1)], mancha)
    t.pxs([(51, 49), (52, 50), (54, 46), (55, 45)], mancha)
    if not costas:
        # olhos de fenda, amarelos, e a faixa escura atrás do olho
        t.linha([(12, 13), (26, 13)], mancha, 1)
        for cx in (13, 24):
            t.elipse(cx, 14, 2, 2, (255, 226, 60, 255))
            t.linha([(cx, 12), (cx, 16)], PRETO, 1)
        t.pxs([(9, 19), (10, 19)], PRETO)                   # fosseta
        # a boca aberta com as presas vermelhas do SEVIPER
        t.poli([(10, 20), (28, 20), (24, 23), (14, 23)], (120, 30, 40, 255))
        t.pxs([(12, 21), (12, 22), (25, 21), (25, 22)], presa)
        t.linha([(19, 23), (19, 26)], presa, 1)             # a língua
        t.pxs([(18, 27), (20, 27)], presa)
    else:
        t.linha([(19, 9), (19, 21)], mancha, 1)
        for y in (11, 15, 19):
            t.pxs([(16, y), (17, y + 1), (21, y + 1), (22, y)], mancha)
    t.contorno()
    return t


# ----------------------------------------------------------------- KOFFING
def koffingbrag(t, costas=False):
    """KOFFING-BRAG: uma bola de fumaça de queimada, cinza de carvão, com as
    crateras acesas de brasa e a caveira do KOFFING em cinza. VENENO/FOGO."""
    fumo = (96, 84, 80, 255)
    fumo_e = (62, 54, 54, 255)
    nuvem = (196, 190, 186, 255)
    nuvem_e = (150, 144, 142, 255)
    # a fumaça que sai por cima e pelos lados
    for x, y, r in ((22, 8, 5), (30, 5, 6), (39, 7, 5), (46, 12, 4), (15, 13, 4)):
        t.elipse(x, y, r, r - 1, nuvem)
    t.elipse(32, 34, 21, 21, fumo)
    for x, y, r in ((9, 46, 4), (55, 44, 4), (13, 53, 3), (52, 54, 3)):
        t.elipse(x, y, r, r - 1, nuvem)
    t.luz(poupar=(BRASA[:3], BRASA_C[:3]))
    # as crateras, cada uma com brasa acesa no fundo
    for x, y, r in ((17, 22, 4), (46, 20, 4), (44, 46, 3), (19, 45, 3), (32, 14, 3)):
        t.elipse(x, y, r, r - 1, fumo_e)
        t.elipse(x, y + 1, r - 1, r - 2, BRASA)
        t.px(x, y + 1, BRASA_C)
    # rachaduras em brasa
    t.linha([(12, 32), (15, 36), (13, 40)], BRASA, 1)
    t.linha([(51, 30), (49, 35), (52, 38)], BRASA, 1)
    # a caveira do KOFFING, em cinza claro, embaixo
    t.elipse(32, 49, 4, 3, nuvem)
    t.pxs([(30, 49), (34, 49)], fumo_e)
    t.linha([(26, 51), (38, 55)], nuvem, 1)
    t.linha([(38, 51), (26, 55)], nuvem, 1)
    if not costas:
        # olhões do KOFFING e o sorrisão de dentes
        for cx, esp in ((24, 1), (40, -1)):
            t.poli([(cx - 5, 26), (cx + 5, 26), (cx + 4, 33), (cx - 4, 33)], BRANCO)
            t.ret(cx - 1 + esp, 28, cx + 1 + esp, 32, PRETO)
            t.linha([(cx - 6, 24 - esp), (cx + 5, 24 + esp)], PRETO, 1)
        t.poli([(22, 37), (42, 37), (38, 43), (26, 43)], (70, 20, 20, 255))
        for x in range(24, 41, 3):
            t.px(x, 38, BRANCO)
            t.px(x, 39, BRANCO)
    else:
        t.elipse(32, 32, 5, 4, fumo_e)
        t.elipse(32, 33, 4, 2, BRASA)
        t.px(32, 33, BRASA_C)
    # cinza voando
    for x, y in ((4, 26), (60, 22), (6, 36), (58, 34)):
        t.px(x, y, nuvem)
    t.contorno()
    return t


# ----------------------------------------------------------------- GEODUDE
def geodudebrag(t, costas=False):
    """GEODUDE-BRAG: pedra do costão, granito rosado e pintado, com craca
    grudada em cima e alga no pé; os dois braços fortes do GEODUDE.
    PEDRA/ÁGUA."""
    alga = (70, 132, 70, 255)
    agua = (90, 170, 210, 255)
    agua_c = (170, 224, 240, 255)
    # a poça de maré embaixo dele
    t.elipse(32, 58, 22, 3, agua)
    # braços: ombro, antebraço erguido e o punho fechado
    for s in (-1, 1):
        cx = 32 + s * 17
        t.poli([(32 + s * 12, 32), (cx + s * 8, 32), (cx + s * 11, 26),
                (cx + s * 5, 24), (cx + s * 3, 29), (32 + s * 12, 40)], GRANITO)
        t.elipse(cx + s * 9, 20, 6, 6, GRANITO)
    # o corpo: uma pedra bojuda e um tiquinho achatada
    t.poli([(14, 32), (18, 20), (28, 14), (40, 15), (48, 22), (51, 34),
            (48, 46), (38, 52), (24, 52), (16, 45)], GRANITO)
    t.luz(poupar=(agua[:3], agua_c[:3]))
    # o granito pintado: feldspato rosa e mica escura
    for x, y in ((20, 26), (26, 20), (44, 28), (40, 44), (22, 42), (47, 38), (30, 48),
                 (6, 14), (57, 16), (16, 30), (10, 22), (54, 22), (36, 18)):
        t.px(x, y, FELDSPATO)
        t.px(x + 1, y, FELDSPATO)
    for x, y in ((24, 30), (42, 22), (18, 38), (34, 46), (45, 42), (9, 18), (58, 20), (29, 16)):
        t.px(x, y, GRANITO_E)
    # nós dos dedos
    for s in (-1, 1):
        cx = 32 + s * 26
        t.linha([(cx - 3, 18), (cx + 3, 18)], GRANITO_E, 1)
        t.linha([(cx - 3, 21), (cx + 3, 21)], GRANITO_E, 1)
    # as cracas: conezinhos brancos com o furo escuro no topo
    for x, y in ((24, 15), (31, 12), (38, 14), (44, 18), (19, 20), (49, 26), (8, 27)):
        t.poli([(x - 2, y + 2), (x - 1, y - 1), (x + 1, y - 1), (x + 2, y + 2)], CRACA)
        t.px(x, y - 1, CRACA_E)
        t.px(x + 1, y + 2, CRACA_E)
    # alga pendurada na beirada de baixo
    for x in (20, 26, 40, 45):
        t.linha([(x, 48), (x - 1, 51), (x, 53)], alga, 1)
    t.pxs([(14, 58), (15, 58), (46, 57), (47, 57)], agua_c)
    if not costas:
        # sobrancelha de pedra, olhos fundos e a boca firme do GEODUDE
        t.poli([(19, 27), (45, 27), (43, 31), (21, 31)], GRANITO_E)
        for cx in (26, 38):
            t.elipse(cx, 33, 3, 2, PRETO)
            t.px(cx - 1, 32, BRANCO)
        t.linha([(26, 41), (38, 41)], PRETO, 1)
        t.pxs([(25, 40), (39, 40)], PRETO)
    else:
        t.linha([(28, 24), (34, 34), (30, 46)], GRANITO_E, 1)    # a trinca da pedra
        t.linha([(34, 34), (42, 38)], GRANITO_E, 1)
    t.contorno()
    return t


# ------------------------------------------------------------------ GLIGAR
def gligarbrag(t, costas=False):
    """GLIGAR-BRAG: o escorpião-amarelo, com as pinças do GLIGAR, a membrana
    entre braço e corpo e o rabo de gomos curvado por cima da cabeça com o
    ferrão. VENENO/TERRA."""
    amarelo = (230, 194, 74, 255)
    amarelo_e = (164, 120, 40, 255)
    membrana = (206, 146, 86, 255)
    ferrao = (80, 50, 40, 255)
    # as membranas (como as asas do GLIGAR), atrás dos braços
    t.poli([(24, 32), (10, 28), (6, 44), (14, 50), (24, 48)], membrana)
    t.poli([(40, 32), (54, 28), (58, 44), (50, 50), (40, 48)], membrana)
    # o rabo: gomos subindo por trás e curvando por cima da cabeça
    gomos = [(38, 44, 5), (42, 34, 5), (43, 24, 4), (42, 15, 4), (38, 8, 4), (31, 5, 3)]
    for x, y, r in gomos:
        t.elipse(x, y, r, r, amarelo)
    # patinhas do escorpião
    for s in (-1, 1):
        for i, y in enumerate((48, 52, 55)):
            t.linha([(32 + s * 6, y), (32 + s * (13 + i), y + 2), (32 + s * (14 + i), 59)], amarelo_e, 2)
    # corpo e cabeça
    t.elipse(32, 44, 10, 11, amarelo)
    t.elipse(32, 28, 10, 8, amarelo)
    # braços e as pinças abertas
    for s in (-1, 1):
        t.linha([(32 + s * 8, 30), (32 + s * 16, 26), (32 + s * 22, 22)], amarelo, 4)
        cx = 32 + s * 24
        t.elipse(cx, 19, 5, 5, amarelo)
        t.poli([(cx - 4, 16), (cx - 3, 6), (cx - 1, 5), (cx, 15)], amarelo)
        t.poli([(cx + 1, 15), (cx + 3, 6), (cx + 5, 7), (cx + 4, 17)], amarelo)
    t.luz()
    # dobras da membrana
    for s in (-1, 1):
        t.linha([(32 + s * 14, 30), (32 + s * 20, 46)], amarelo_e, 1)
        t.linha([(32 + s * 18, 29), (32 + s * 25, 42)], amarelo_e, 1)
    # gomos: risquinho escuro entre um e outro
    for (x0, y0, _), (x1, y1, _) in zip(gomos, gomos[1:]):
        t.px((x0 + x1) // 2, (y0 + y1) // 2, amarelo_e)
    # o ferrão, apontando pra baixo-frente
    t.poli([(29, 5), (25, 7), (24, 13), (27, 9), (30, 8)], ferrao)
    t.linha([(26, 40), (38, 40)], amarelo_e, 1)
    t.linha([(27, 45), (37, 45)], amarelo_e, 1)
    t.linha([(28, 50), (36, 50)], amarelo_e, 1)
    for s in (-1, 1):                                      # pontas escuras das pinças
        cx = 32 + s * 24
        t.pxs([(cx - 3, 6), (cx - 2, 6), (cx + 3, 6), (cx + 4, 7)], ferrao)
    if not costas:
        # os olhões do GLIGAR e as presinhas
        for cx in (27, 37):
            t.elipse(cx, 26, 3, 3, BRANCO)
            t.elipse(cx, 27, 2, 2, (160, 30, 40, 255))
            t.px(cx, 27, PRETO)
        t.linha([(24, 22), (29, 24)], PRETO, 1)
        t.linha([(40, 22), (35, 24)], PRETO, 1)
        t.pxs([(29, 32), (30, 33), (34, 33), (35, 32)], BRANCO)
        t.linha([(29, 31), (35, 31)], PRETO, 1)
    else:
        t.linha([(32, 22), (32, 52)], amarelo_e, 1)
    t.contorno()
    return t


# ----------------------------------------------------------------- MURKROW
def murkrowbrag(t, costas=False):
    """MURKROW-BRAG: o urubu, de asas abertas tomando sol no costão, cabeça
    pelada e enrugada, as pontas brancas das asas — e o topete de chapéu do
    MURKROW ainda lá. SOMBRIO/VOADOR."""
    preto = (46, 44, 58, 255)
    preto_c = (78, 80, 104, 255)
    pele = (118, 116, 118, 255)
    pele_e = (80, 78, 82, 255)
    bico = (214, 208, 190, 255)
    pe = (170, 166, 160, 255)
    # asas abertas, a borda de baixo em franja de pena
    for s in (-1, 1):
        pts = [(32 + s * 8, 26), (32 + s * 20, 18), (32 + s * 30, 20), (32 + s * 31, 30)]
        for i in range(6):
            x = 32 + s * (30 - i * 4)
            pts.append((x, 44 - i * 0 + (i % 2) * 2))
            pts.append((x - s * 2, 38 + i))
        pts.append((32 + s * 8, 44))
        t.poli(pts, preto)
    # rabo de vassoura (o do MURKROW) aparecendo embaixo
    t.poli([(26, 50), (38, 50), (42, 58), (22, 58)], preto)
    # corpo
    t.elipse(32, 40, 11, 13, preto)
    # a cabeça pelada
    t.elipse(32, 22, 7, 7, pele)
    # o topete de chapéu, torto pra trás
    t.poli([(20, 17), (44, 15), (40, 12), (36, 4), (28, 3), (24, 12)], preto)
    t.luz()
    # as primárias brancas do urubu, na ponta de cada asa
    for s in (-1, 1):
        for i in range(3):
            x = 32 + s * (29 - i * 3)
            t.linha([(x, 30), (x - s, 40 + (i % 2))], (226, 226, 230, 255), 1)
    # pena por pena nas asas
    for s in (-1, 1):
        for i in range(4):
            x = 32 + s * (12 + i * 4)
            t.linha([(x, 26), (x + s * 2, 38)], preto_c, 1)
    t.linha([(24, 16), (42, 14)], preto_c, 1)             # aba do chapéu
    # pés cinzentos
    for x in (27, 36):
        t.linha([(x, 52), (x, 56)], pe, 2)
        t.pxs([(x - 2, 57), (x - 1, 57), (x, 57), (x + 1, 57), (x + 2, 57)], pe)
    # rugas da cabeça
    t.pxs([(27, 20), (28, 21), (36, 20), (37, 21), (30, 27), (34, 27)], pele_e)
    if not costas:
        for cx in (29, 35):
            t.elipse(cx, 21, 1, 1, (200, 40, 40, 255))
            t.px(cx, 21, PRETO)
        # o bico adunco
        t.poli([(30, 23), (34, 23), (34, 28), (32, 30), (30, 27)], bico)
        t.px(32, 30, PRETO)
        t.pxs([(31, 24), (33, 24)], PRETO)                   # narinas vazadas
        t.elipse(32, 42, 6, 8, preto_c)                      # peito
        t.elipse(32, 43, 5, 7, preto)
    else:
        t.elipse(32, 22, 6, 6, pele_e)
        t.linha([(32, 30), (32, 48)], preto_c, 1)
    t.contorno()
    return t


# ----------------------------------------------------------------- SANDILE
def sandilebrag(t, costas=False):
    """SANDILE-BRAG: o jacaré-de-papo-amarelo, verde-lodo, com o papo amarelo
    embaixo da queixada e a máscara preta do SANDILE nos olhos. TERRA/ÁGUA."""
    lodo = (104, 122, 66, 255)
    lodo_e = (66, 82, 44, 255)
    papo = (246, 212, 72, 255)
    mascara = (40, 38, 40, 255)
    lama = (120, 96, 66, 255)
    # rabo pra trás, subindo e afinando
    t.poli([(46, 38), (56, 32), (63, 22), (62, 30), (58, 42), (50, 50)], lodo)
    # patas
    for x in (20, 44):
        t.poli([(x - 4, 46), (x + 4, 46), (x + 5, 56), (x - 6, 56)], lodo_e)
    for x in (14, 36):
        t.poli([(x - 4, 46), (x + 4, 46), (x + 3, 57), (x - 6, 57)], lodo)
    # corpo baixo e comprido
    t.elipse(32, 42, 20, 9, lodo)
    # a cabeça: focinho largo pra esquerda
    t.poli([(1, 38), (2, 32), (12, 26), (24, 24), (30, 30), (28, 44), (14, 46), (2, 44)], lodo)
    t.luz()
    # o papo amarelo embaixo da queixada e na barriga
    t.poli([(4, 42), (26, 42), (30, 48), (14, 49), (5, 46)], papo)
    t.linha([(26, 49), (48, 49)], papo, 2)
    # placas das costas (as escamas do jacaré)
    for x in range(26, 56, 5):
        y = 33 if x < 50 else 30 - (x - 50)
        t.poli([(x, y + 2), (x + 2, y - 1), (x + 4, y + 2)], lodo_e)
    for x in range(28, 50, 5):
        t.pxs([(x, 38), (x + 1, 38)], lodo_e)
        t.pxs([(x + 2, 42), (x + 3, 42)], lodo_e)
    # a boca, com os dentinhos do jacaré
    t.linha([(2, 41), (26, 41)], mascara, 1)
    for x in range(4, 25, 3):
        t.px(x, 40, BRANCO)
    t.px(6, 42, BRANCO)
    t.px(12, 42, BRANCO)
    # garras e lama nas patas
    for x in (14, 36):
        t.pxs([(x - 5, 57), (x - 3, 57), (x - 1, 57)], CRACA)
    t.pxs([(18, 56), (42, 55), (43, 55)], lama)
    if not costas:
        # a máscara preta do SANDILE atravessando os olhos
        t.poli([(9, 28), (26, 25), (28, 32), (10, 34)], mascara)
        t.elipse(19, 30, 2, 2, (250, 200, 60, 255))
        t.linha([(19, 29), (19, 31)], PRETO, 1)
        t.px(18, 29, BRANCO)
        t.pxs([(3, 33), (5, 32)], PRETO)                     # narinas
    else:
        t.poli([(9, 28), (26, 25), (28, 32), (10, 34)], mascara)
        t.linha([(10, 31), (27, 28)], lodo_e, 1)
    t.contorno()
    return t


# ---------------------------------------------------------------- TRAPINCH
def trapinchbrag(t, costas=False):
    """TRAPINCH-BRAG: a formiga-leão (o tatuzinho-de-areia), cabeçona com as
    mandíbulas de foice, sentada no fundo do funil de areia que ela cava.
    TERRA/INSETO."""
    areia = (228, 204, 150, 255)
    areia_e = (186, 158, 108, 255)
    funil = (140, 112, 76, 255)
    casca = (176, 138, 96, 255)
    casca_e = (120, 88, 58, 255)
    mandi = (98, 58, 34, 255)
    # o funil de areia
    t.elipse(32, 53, 30, 9, areia)
    t.elipse(32, 54, 22, 6, areia_e)
    t.elipse(32, 55, 12, 3, funil)
    # o corpinho peludo atrás
    t.elipse(32, 44, 13, 9, casca_e)
    # mandíbulas em foice, abertas pros lados e pra cima
    for s in (-1, 1):
        t.poli([(32 + s * 10, 30), (32 + s * 20, 26), (32 + s * 26, 16), (32 + s * 25, 6),
                (32 + s * 21, 3), (32 + s * 21, 8), (32 + s * 20, 16), (32 + s * 14, 24),
                (32 + s * 8, 26)], mandi)
    # a cabeçona
    t.elipse(32, 31, 16, 13, casca)
    t.luz()
    # dentes na beirada de dentro das mandíbulas
    for s in (-1, 1):
        for x, y in ((20, 12), (19, 17), (16, 21)):
            t.px(32 + s * x, y, CRACA)
    # pelos do corpo
    for x in (19, 22, 42, 45, 16, 48):
        t.linha([(x, 44), (x - 1 if x < 32 else x + 1, 41)], casca_e, 1)
    for x in (18, 46):
        t.linha([(x, 46), (x - 3 if x < 32 else x + 3, 45)], mandi, 1)
    # pintas do dorso da cabeça
    t.pxs([(24, 21), (25, 21), (39, 21), (40, 21), (32, 19)], casca_e)
    # grãos de areia escorrendo pro funil
    t.pxs([(6, 50), (10, 48), (55, 49), (58, 51), (14, 58), (50, 58)], areia_e)
    if not costas:
        # olhinhos de conta e a bocarra do TRAPINCH em losango, cheia de dente
        for cx in (24, 40):
            t.elipse(cx, 27, 2, 2, PRETO)
            t.px(cx - 1, 26, BRANCO)
        t.poli([(20, 34), (32, 30), (44, 34), (32, 42)], (110, 40, 40, 255))
        for x in range(22, 43, 3):
            yb = 34 - (2 if abs(x - 32) < 6 else 0)
            t.px(x, yb, BRANCO)
        t.pxs([(28, 39), (32, 41), (36, 39)], BRANCO)
    else:
        t.linha([(32, 20), (32, 42)], casca_e, 1)
        t.linha([(22, 28), (42, 28)], casca_e, 1)
    t.contorno()
    return t


# ----------------------------------------------------------------- SHUCKLE
def shucklebrag(t, costas=False):
    """SHUCKLE-BRAG: o caramujo-africano, concha comprida de cone listrada de
    marrom, ainda com os furos do SHUCKLE pingando suco; o corpo amarelo do
    SHUCKLE virou o pé do caramujo, com os dois olhos em antena.
    INSETO/VENENO."""
    concha = (150, 96, 56, 255)
    listra = (82, 50, 32, 255)
    concha_c = (214, 170, 112, 255)
    corpo = (234, 208, 110, 255)
    corpo_e = (170, 144, 70, 255)
    suco = (220, 70, 60, 255)
    gosma = (178, 110, 196, 255)
    # rastro de gosma roxa (o veneno)
    t.elipse(34, 59, 28, 2, gosma)
    # o pé comprido do caramujo
    t.poli([(4, 58), (6, 52), (18, 48), (54, 48), (62, 56), (60, 58)], corpo)
    # o pescoço/cabeça erguidos na frente, com as antenas
    t.poli([(6, 54), (6, 36), (10, 30), (18, 32), (20, 50)], corpo)
    t.linha([(9, 32), (5, 18), (4, 12)], corpo, 2)
    t.linha([(15, 32), (16, 18), (18, 12)], corpo, 2)
    t.elipse(4, 11, 2, 2, corpo)
    t.elipse(18, 11, 2, 2, corpo)
    # a concha: um cone comprido e inclinado, a boca larga embaixo
    t.poli([(24, 50), (26, 38), (36, 24), (46, 8), (50, 3), (54, 5), (57, 18),
            (57, 34), (54, 46), (46, 51)], concha_c)
    t.luz(poupar=(gosma[:3],))
    # as costuras das voltas, em diagonal, e entre elas as chamas marrons
    costuras = [((26, 40), (40, 46), (56, 36)), ((33, 29), (44, 34), (57, 25)),
                ((40, 19), (48, 23), (57, 16)), ((45, 11), (51, 13), (55, 9))]
    for a, m, b in costuras:
        t.linha([a, m, b], listra, 2)
    for x0, y0, alto in ((29, 44, 6), (33, 46, 8), (38, 47, 9), (44, 46, 9), (50, 43, 8),
                         (54, 40, 7), (36, 34, 5), (41, 36, 6), (47, 35, 6), (52, 32, 5),
                         (43, 24, 4), (47, 26, 4), (52, 23, 5), (48, 16, 3), (52, 16, 3)):
        t.linha([(x0, y0), (x0 + 1, y0 - alto // 2), (x0, y0 - alto)], (126, 76, 44, 255), 2)
    t.linha([(26, 48), (34, 50), (46, 50)], listra, 1)       # a boca da concha
    t.pxs([(50, 4), (51, 4), (52, 5)], listra)               # a pontinha
    # os furos do SHUCKLE, pingando suco de fruta fermentado
    for x, y in ((31, 38), (45, 41), (49, 29), (51, 20)):
        t.elipse(x, y, 2, 1, PRETO)
        t.px(x, y + 2, suco)
    t.px(31, 41, suco)
    t.px(45, 44, suco)
    # pintas escuras do corpo do caramujo
    t.pxs([(10, 44), (14, 40), (22, 52), (28, 54), (56, 54), (12, 50)], corpo_e)
    t.linha([(6, 57), (60, 57)], corpo_e, 1)
    if not costas:
        # olhos de conta do SHUCKLE nas pontas das antenas, e a boquinha
        for cx in (4, 18):
            t.px(cx, 11, PRETO)
            t.px(cx, 10, PRETO)
        t.linha([(9, 40), (14, 40)], corpo_e, 1)
        t.pxs([(10, 36), (13, 36)], PRETO)
    else:
        t.linha([(12, 34), (12, 50)], corpo_e, 1)
    t.contorno()
    return t


# -------------------------------------------------------------- CRABRAWLER
def crabrawlerbrag(t, costas=False):
    """CRABRAWLER-BRAG: o aratu das pedras, carapaça vermelha pintada de
    escuro, em guarda de boxe com as duas pinças-luva do CRABRAWLER.
    ÁGUA/LUTADOR."""
    verm = (200, 62, 44, 255)
    verm_e = (132, 34, 30, 255)
    luva = (236, 118, 70, 255)
    luva_c = (250, 214, 170, 255)
    barriga = (244, 214, 96, 255)
    olhos = (60, 40, 40, 255)
    # pernas finas, três de cada lado
    for s in (-1, 1):
        for i in range(3):
            y = 40 + i * 4
            t.linha([(32 + s * 10, y), (32 + s * (19 + i * 2), y - 2),
                     (32 + s * (24 + i * 2), 58)], verm_e, 2)
    # os pedúnculos dos olhos
    t.linha([(26, 26), (24, 16)], verm, 2)
    t.linha([(38, 26), (40, 16)], verm, 2)
    # carapaça quadradona
    t.poli([(16, 28), (22, 22), (42, 22), (48, 28), (47, 44), (40, 50), (24, 50), (17, 44)], verm)
    # braços e as pinças-luva, uma erguida na guarda e outra pronta pro soco
    t.linha([(18, 34), (10, 28), (10, 18)], verm, 5)
    t.linha([(46, 34), (54, 32), (56, 24)], verm, 5)
    t.elipse(10, 12, 8, 8, luva)
    t.elipse(55, 18, 7, 8, luva)
    t.luz()
    # a abertura da pinça nas luvas
    t.linha([(4, 12), (11, 11)], verm_e, 1)
    t.linha([(49, 18), (56, 17)], verm_e, 1)
    t.pxs([(7, 7), (8, 6), (52, 13), (53, 12)], luva_c)
    t.pxs([(12, 17), (14, 16), (57, 23), (59, 22)], verm_e)
    # manchas do aratu na carapaça
    for x, y in ((24, 27), (30, 25), (38, 26), (42, 31), (21, 34), (44, 38), (26, 44), (37, 45)):
        t.pxs([(x, y), (x + 1, y)], verm_e)
    # a barriga amarela do CRABRAWLER
    t.poli([(24, 40), (40, 40), (37, 48), (27, 48)], barriga)
    t.linha([(26, 44), (38, 44)], escurecer(barriga, 0.2), 1)
    # pontas das pernas
    for s in (-1, 1):
        for i in range(3):
            t.px(32 + s * (24 + i * 2), 59, verm_e)
    if not costas:
        for cx in (24, 40):
            t.elipse(cx, 15, 2, 2, olhos)
            t.px(cx - 1, 14, BRANCO)
        # cara brava de lutador
        t.linha([(26, 29), (30, 31)], PRETO, 1)
        t.linha([(38, 29), (34, 31)], PRETO, 1)
        t.pxs([(28, 32), (36, 32)], BRANCO)
        t.linha([(29, 36), (35, 36)], PRETO, 1)
        t.pxs([(30, 35), (34, 35)], PRETO)
    else:
        t.elipse(24, 15, 2, 2, verm_e)
        t.elipse(40, 15, 2, 2, verm_e)
        t.linha([(22, 30), (32, 26), (42, 30)], verm_e, 1)
        t.linha([(20, 38), (32, 34), (44, 38)], verm_e, 1)
    t.contorno()
    return t


# ------------------------------------------------------------------ WIMPOD
def wimpodbrag(t, costas=False):
    """WIMPOD-BRAG: a baratinha-da-praia (a lígia) das pedras molhadas:
    corpo achatado de gomos cor de granito, as antenas compridas e os dois
    garfinhos do rabo; os olhões do WIMPOD na frente. INSETO/PEDRA."""
    cinza = (138, 130, 128, 255)
    cinza_e = (92, 86, 90, 255)
    pintas = (190, 178, 170, 255)
    perna = (84, 76, 82, 255)
    # antenas compridas, pra trás e pra cima
    t.linha([(12, 36), (8, 22), (14, 10), (24, 5)], cinza_e, 2)
    t.linha([(14, 38), (18, 24), (28, 16), (36, 14)], cinza_e, 2)
    # pernas, muitas
    for x in range(14, 54, 5):
        t.linha([(x, 50), (x - 3, 57), (x - 4, 59)], perna, 2)
    # os garfinhos do rabo
    t.poli([(52, 44), (62, 40), (62, 43), (54, 48)], cinza_e)
    t.poli([(52, 48), (62, 50), (61, 53), (51, 51)], cinza_e)
    # corpo achatado e comprido
    t.elipse(33, 44, 21, 9, cinza)
    # cabeça redonda na frente (esquerda)
    t.elipse(13, 42, 10, 9, cinza)
    t.luz()
    # os gomos do corpo
    for x in range(22, 52, 5):
        t.linha([(x, 36), (x - 1, 43), (x, 52)], cinza_e, 1)
    # pintado de granito
    for x, y in ((26, 39), (31, 38), (36, 41), (41, 39), (46, 42), (29, 46), (39, 47), (24, 49)):
        t.px(x, y, pintas)
    t.pxs([(50, 45), (53, 45)], pintas)
    if not costas:
        # os olhões do WIMPOD, brancos com a pupila miudinha
        t.elipse(10, 40, 5, 5, BRANCO)
        t.elipse(10, 40, 4, 4, (220, 230, 236, 255))
        t.elipse(9, 40, 1, 1, PRETO)
        t.elipse(19, 40, 3, 4, BRANCO)
        t.px(18, 40, PRETO)
        t.linha([(6, 48), (12, 49)], cinza_e, 1)             # a boquinha
    else:
        t.linha([(13, 34), (13, 50)], cinza_e, 1)
    t.contorno()
    return t


# ---------------------------------------------------------------- MAREANIE
def mareaniebrag(t, costas=False):
    """MAREANIE-BRAG: o ouriço-do-mar, bola roxo-escura de espinhos compridos
    de aço; por baixo, a carinha sonsa e as pernas-tentáculo rosadas do
    MAREANIE. ÁGUA/AÇO."""
    import math
    roxo = (66, 46, 86, 255)
    roxo_c = (110, 80, 134, 255)
    aco = (184, 194, 210, 255)
    aco_e = (104, 112, 132, 255)
    rosa = (238, 120, 170, 255)
    rosa_c = (255, 186, 214, 255)
    # os espinhos, irradiando da bola (mais compridos em cima)
    cx, cy = 32, 32
    for i in range(22):
        a = math.pi + math.pi * i / 21 + (0.06 if i % 2 else -0.06)
        comp = 29 if i % 2 else 23
        x1, y1 = cx + math.cos(a) * comp, cy + math.sin(a) * comp
        xm, ym = cx + math.cos(a) * 14, cy + math.sin(a) * 14
        t.linha([(round(xm), round(ym)), (round(x1), round(y1))], aco_e, 2)
        t.linha([(round(xm), round(ym)), (round(x1), round(y1))], aco, 1)
    # as pernas-tentáculo do MAREANIE, rosadas, embaixo
    for s in (-1, 1):
        t.linha([(32 + s * 6, 42), (32 + s * 12, 52), (32 + s * 18, 56), (32 + s * 22, 55)], rosa, 4)
        t.linha([(32 + s * 3, 44), (32 + s * 5, 54), (32 + s * 8, 58)], rosa, 4)
    # a bola do ouriço
    t.elipse(32, 34, 16, 13, roxo)
    t.luz(poupar=(aco[:3], aco_e[:3]))
    # espinhos curtinhos saindo da frente da bola
    for x, y in ((22, 26), (28, 23), (36, 23), (42, 26), (19, 33), (45, 33)):
        t.pxs([(x, y), (x, y - 1)], aco)
    # as bolinhas das pernas-tentáculo
    for s in (-1, 1):
        t.pxs([(32 + s * 12, 51), (32 + s * 17, 55), (32 + s * 5, 52)], rosa_c)
        t.px(32 + s * 22, 55, rosa_c)
    t.linha([(20, 40), (44, 40)], roxo_c, 1)
    if not costas:
        # a carinha do MAREANIE: olhos meio fechados, boquinha rosa
        for ex in (26, 38):
            t.elipse(ex, 33, 3, 3, BRANCO)
            t.elipse(ex, 34, 2, 2, (200, 60, 120, 255))
            t.linha([(ex - 3, 31), (ex + 3, 31)], roxo, 2)   # a pálpebra sonsa
        t.pxs([(30, 38), (31, 39), (32, 39), (33, 39), (34, 38)], rosa)
    else:
        t.elipse(32, 34, 5, 5, roxo_c)
        t.elipse(32, 34, 2, 2, rosa)
    t.contorno()
    return t


# ------------------------------------------------------------------ SLUGMA
def slugmabrag(t, costas=False):
    """SLUGMA-BRAG: a brasa que anda no capim seco: lesma de lava com casca de
    carvão rachada em cima, pingando fogo; em volta, o capim pegando.
    FOGO/PEDRA."""
    lava = (238, 96, 38, 255)
    lava_c = (255, 176, 60, 255)
    carvao = (62, 52, 50, 255)
    carvao_c = (100, 88, 84, 255)
    cinza = (150, 140, 136, 255)
    # o capim seco atrás
    for x, h in ((4, 16), (8, 22), (12, 14), (52, 20), (56, 14), (60, 18), (48, 12)):
        t.poli([(x - 1, 60), (x + 1 + (1 if x < 32 else -1) * 2, 60 - h), (x + 2, 60)], CAPIM)
    # a poça de lava no pé
    t.elipse(32, 54, 24, 6, lava)
    # o corpo em pé e a cabeça tombando pra frente (esquerda)
    t.elipse(34, 40, 11, 14, lava)
    t.elipse(26, 24, 13, 11, lava)
    # os pingos de lava de cima da cabeça (os do SLUGMA)
    t.elipse(30, 12, 4, 4, lava)
    t.elipse(38, 16, 3, 3, lava)
    t.elipse(22, 14, 3, 3, lava)
    # a casca de carvão por cima (a pedra)
    t.poli([(16, 20), (22, 14), (34, 14), (38, 20), (40, 30), (44, 38), (40, 34), (30, 22), (18, 24)], carvao)
    t.poli([(42, 44), (46, 40), (46, 50), (40, 52)], carvao)
    t.luz(poupar=(lava_c[:3], BRASA_C[:3]))
    # rachaduras acesas na casca
    t.linha([(20, 20), (26, 18), (30, 22)], lava_c, 1)
    t.linha([(34, 18), (36, 24), (41, 30)], lava_c, 1)
    t.linha([(44, 42), (43, 48)], lava_c, 1)
    t.pxs([(24, 16), (32, 16), (28, 20)], carvao_c)
    # brilho da lava
    t.pxs([(30, 10), (29, 11), (37, 15), (21, 13)], BRASA_C)
    t.linha([(14, 55), (48, 55)], lava_c, 1)
    t.linha([(26, 30), (28, 46)], lava_c, 1)
    # capim da frente, uns pegando fogo
    for x, h, fogo in ((10, 10, True), (18, 7, False), (46, 8, False), (54, 11, True), (6, 6, False)):
        t.poli([(x - 1, 61), (x, 61 - h), (x + 1, 61)], CAPIM_E)
        if fogo:
            chaminha(t, x, 61 - h, 6)
    # cinza subindo
    t.pxs([(12, 4), (46, 6), (50, 2), (16, 8)], cinza)
    if not costas:
        # os olhos amarelos do SLUGMA e a boquinha
        for ex in (20, 30):
            t.elipse(ex, 26, 2, 3, BRASA_C)
            t.linha([(ex, 25), (ex, 28)], PRETO, 1)
        t.linha([(22, 32), (27, 32)], (150, 40, 20, 255), 1)
    else:
        t.linha([(28, 14), (32, 22), (40, 34)], carvao_c, 1)
    t.contorno()
    return t


DESENHOS = {
    21301: (seviperbrag, "seviperbrag"),
    21302: (koffingbrag, "koffingbrag"),
    21303: (geodudebrag, "geodudebrag"),
    21304: (gligarbrag, "gligarbrag"),
    21305: (murkrowbrag, "murkrowbrag"),
    21306: (sandilebrag, "sandilebrag"),
    21307: (trapinchbrag, "trapinchbrag"),
    21308: (shucklebrag, "shucklebrag"),
    21309: (crabrawlerbrag, "crabrawlerbrag"),
    21310: (wimpodbrag, "wimpodbrag"),
    21311: (mareaniebrag, "mareaniebrag"),
    21312: (slugmabrag, "slugmabrag"),
}
