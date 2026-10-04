"""Lote 27: as formas de FERNANDO DE NOROWLET, a oitava e última ilha.

Fernando de Noronha virada ilha de Braglitch: o MORRO DO PICO espetado no
meio do mar, os golfinhos, a base de rádio velha e as praias de água verde.
Por ser a última ilha, é onde moram os bichos mais fortes (nível 40-45).

Doze formas, cada uma desenhada do zero: dá pra ver o Pokémon de base, mas
virou bicho da ilha —

ROWLET vira o RABO-DE-JUNCO (ave branca de cauda comprida), CHINCHOU o
PEIXE-LANTERNA das fossas, RELICANTH o CELACANTO de pedra, SOLROCK e LUNATONE
são o MORRO DO PICO de dia e de noite, SABLEYE é a MARIA-FARINHA (o
caranguejo-fantasma da areia), CUTIEFLY a abelha JATAÍ, MAREEP o CABRITO da
ilha, WISHIWASHI um CARDUME DE SARDINHA, DRAMPA o DRAGÃO que dorme debaixo da
ilha, CASTFORM o tempo que muda toda hora (sol e chuva juntos) e COMFEY um
colar de flores de IPÊ.
"""
import math

from pixelart import Tela, clarear, escurecer  # noqa: F401

BRANCO = (250, 250, 250, 255)
PRETO = (30, 26, 34, 255)
VAZIO = (0, 0, 0, 0)

MAR = (60, 170, 190, 255)
MAR_E = (34, 116, 150, 255)
ESPUMA = (220, 244, 246, 255)
AREIA = (236, 214, 160, 255)
AREIA_E = (196, 166, 110, 255)
PEDRA = (120, 110, 104, 255)
PEDRA_E = (78, 70, 70, 255)
MATO = (70, 150, 64, 255)
MATO_E = (40, 102, 48, 255)


def olho(t, cx, cy, r=2, iris=PRETO, brilho=BRANCO):
    t.elipse(cx, cy, r, r, iris)
    t.px(cx - 1, cy - 1, brilho)


def _pico(t, bx, by, larg, alto, cor):
    """A silhueta do MORRO DO PICO: base larga e um dedo de pedra espetado,
    um tiquinho torto pra esquerda. (bx, by) é o meio da base."""
    h = alto
    t.poli([(bx - larg, by), (bx - larg * 0.55, by - h * 0.30),
            (bx - larg * 0.30, by - h * 0.55), (bx - larg * 0.22, by - h * 0.92),
            (bx - larg * 0.10, by - h), (bx + larg * 0.08, by - h * 0.97),
            (bx + larg * 0.16, by - h * 0.60), (bx + larg * 0.40, by - h * 0.42),
            (bx + larg * 0.62, by - h * 0.25), (bx + larg, by)], cor)


# -------------------------------------------------------------- ROWLET-BRAG
def rowletbrag(t, costas=False):
    """ROWLET-BRAG: o RABO-DE-JUNCO. A bolinha de coruja do ROWLET, mas toda
    branca, com a máscara preta no olho, bico vermelho e as duas penas de
    cauda compridas que o rabo-de-junco arrasta pelo céu. VOADOR/ÁGUA."""
    ROSADO = (246, 240, 236, 255)
    CINZA = (200, 204, 212, 255)
    BICO = (226, 58, 46, 255)
    FOLHA = (84, 172, 90, 255)
    # as penas da cauda, longas, curvando pra cima-direita
    for dx, alto in ((0, 42), (7, 34)):
        pts = []
        for i in range(15):
            f = i / 14
            pts.append((round(38 + dx + 16 * f + 4 * f * f), round(46 - alto * f + 10 * math.sin(f * 3.1))))
        t.linha(pts, ROSADO, 2)
    # corpo redondo
    t.elipse(28, 38, 18, 18, ROSADO)
    # asinhas (com a barra preta da asa do rabo-de-junco)
    t.poli([(11, 34), (3, 44), (6, 48), (13, 46)], ROSADO)
    t.poli([(45, 34), (53, 44), (50, 48), (43, 46)], ROSADO)
    # pezinhos
    t.ret(21, 55, 25, 58, (60, 60, 64, 255))
    t.ret(31, 55, 35, 58, (60, 60, 64, 255))
    t.luz()
    t.linha([(4, 44), (10, 38)], PRETO, 2)
    t.linha([(52, 44), (46, 38)], PRETO, 2)
    t.linha([(20, 58), (26, 58)], PRETO, 1)
    t.linha([(30, 58), (36, 58)], PRETO, 1)
    # a ponta preta das penas da cauda
    t.pxs([(58, 4), (59, 4), (58, 5), (59, 5)], PRETO)
    t.pxs([(62, 12), (63, 12), (62, 13), (63, 13)], PRETO)
    if not costas:
        # o disco do rosto do ROWLET
        t.elipse(28, 32, 13, 9, BRANCO)
        t.linha([(15, 34), (41, 34)], CINZA, 1)
        # a máscara preta, faixa curva atravessando os olhos
        t.linha([(14, 28), (18, 30), (22, 31)], PRETO, 2)
        t.linha([(42, 28), (38, 30), (34, 31)], PRETO, 2)
        for cx in (22, 34):
            t.elipse(cx, 31, 3, 3, PRETO)
            t.px(cx - 1, 30, BRANCO)
        # bico vermelho
        t.poli([(26, 34), (30, 34), (28, 39)], BICO)
        t.px(27, 34, clarear(BICO, 0.4))
        # a gravatinha de folha do ROWLET, que aqui é de alga
        t.poli([(28, 44), (20, 41), (21, 47)], FOLHA)
        t.poli([(28, 44), (36, 41), (35, 47)], FOLHA)
        t.elipse(28, 44, 1, 1, escurecer(FOLHA, 0.3))
    else:
        # costas: o leque de penas cinzas e o barrado fininho
        for x in range(16, 41, 5):
            t.linha([(x, 30), (x + 2, 36)], CINZA, 1)
        t.linha([(14, 42), (28, 46), (42, 42)], PRETO, 1)
        t.poli([(22, 22), (28, 18), (34, 22)], CINZA)
    t.contorno()
    return t


# -------------------------------------------------------------- CHINCHOU-BRAG
def chinchoubrag(t, costas=False):
    """CHINCHOU-BRAG: PEIXE-LANTERNA das fossas. O corpo redondo do CHINCHOU,
    azul-escuro quase preto, com as duas antenas-lanterna acesas e uma fileira
    de pontinhos que brilham na barriga. A cauda some em fumaça. ÁGUA/FANTASMA."""
    CORPO = (42, 46, 96, 255)
    CORPO_E = (26, 26, 60, 255)
    BARRIGA = (70, 84, 140, 255)
    LUZ_C = (170, 250, 240, 255)
    LUZ_A = (110, 220, 230, 255)
    FUMO = (120, 110, 170, 255)
    # a cauda que vira fumaça, pra trás
    t.poli([(44, 40), (58, 30), (54, 40), (62, 44), (54, 48), (58, 58), (44, 48)], FUMO)
    # corpo
    t.elipse(28, 40, 20, 17, CORPO)
    t.elipse(26, 46, 14, 8, BARRIGA)
    # nadadeiras laterais
    t.poli([(14, 50), (4, 56), (12, 58), (20, 54)], CORPO)
    t.poli([(40, 52), (46, 60), (36, 58)], CORPO)
    # as antenas (como as do CHINCHOU), finas e curvas
    t.linha([(22, 24), (18, 14), (12, 8), (8, 8)], CORPO_E, 2)
    t.linha([(34, 24), (38, 13), (46, 6), (50, 7)], CORPO_E, 2)
    t.luz(poupar=(LUZ_C[:3], LUZ_A[:3]))
    # cauda esfiapada: buraquinhos de fumaça
    for x, y in ((56, 36), (58, 52), (52, 44)):
        t.px(x, y, VAZIO)
    t.pxs([(60, 30), (62, 36), (63, 52)], FUMO)
    # as lanternas: bolinhas acesas com halo
    for cx, cy in ((7, 8), (51, 7)):
        t.elipse(cx, cy, 5, 5, LUZ_A)
        t.elipse(cx, cy, 3, 3, LUZ_C)
        t.px(cx - 1, cy - 1, BRANCO)
    # pontinhos luminosos da barriga (os fotóforos)
    for x in range(14, 40, 4):
        y = 50 + round(((x - 27) / 14) ** 2 * 3)
        t.px(x, y, LUZ_C)
    if not costas:
        # olho grande de peixe de fossa, meio leitoso
        t.elipse(20, 34, 5, 5, (220, 230, 240, 255))
        t.elipse(21, 35, 3, 3, (40, 200, 210, 255))
        t.elipse(21, 35, 1, 1, PRETO)
        t.px(19, 32, BRANCO)
        t.elipse(36, 34, 4, 4, (220, 230, 240, 255))
        t.elipse(37, 35, 2, 2, (40, 200, 210, 255))
        t.px(37, 35, PRETO)
        # bocarra cheia de dente fino
        t.poli([(14, 42), (36, 42), (30, 47), (19, 47)], (18, 12, 30, 255))
        for x in range(16, 35, 3):
            t.px(x, 43, BRANCO)
            t.px(x + 1, 46, BRANCO)
    else:
        # costas: a crista escura e as pintas claras
        t.linha([(28, 23), (28, 50)], CORPO_E, 1)
        for x, y in ((18, 32), (38, 32), (22, 42), (34, 42)):
            t.px(x, y, LUZ_A)
    t.contorno()
    return t


# -------------------------------------------------------------- RELICANTH-BRAG
def relicanthbrag(t, costas=False):
    """RELICANTH-BRAG: o CELACANTO. O peixe de pedra do RELICANTH, azul-cinza
    com as pintas brancas do celacanto, nadadeiras que parecem perninhas,
    placas de rocha no lombo e dois chifres de dragão. PEDRA/DRAGÃO."""
    CORPO = (72, 96, 126, 255)
    CORPO_E = (46, 62, 86, 255)
    PLACA = (150, 138, 118, 255)
    PINTA = (226, 232, 238, 255)
    CHIFRE = (232, 210, 150, 255)
    # corpo: gordo, virado pra esquerda, afinando no rabo
    t.poli([(4, 38), (8, 28), (18, 22), (32, 22), (46, 28), (54, 34), (54, 44),
            (44, 50), (28, 54), (14, 52), (6, 46)], CORPO)
    # o rabo em três lobos do celacanto
    t.poli([(52, 34), (62, 24), (60, 36), (63, 40), (60, 44), (62, 56), (52, 44)], CORPO)
    # nadadeiras-perninha (os lobos carnudos)
    t.poli([(16, 50), (12, 58), (18, 60), (22, 52)], CORPO_E)
    t.poli([(34, 51), (32, 59), (38, 60), (40, 50)], CORPO_E)
    t.poli([(26, 22), (22, 12), (30, 14), (34, 22)], CORPO_E)          # dorsal
    t.poli([(40, 25), (42, 16), (48, 20), (46, 28)], CORPO_E)
    # placas de pedra no lombo (como as do RELICANTH)
    for x, y in ((12, 26), (20, 23), (36, 24)):
        t.poli([(x, y), (x + 6, y - 3), (x + 9, y + 2), (x + 3, y + 4)], PLACA)
    # chifres de dragão
    t.poli([(10, 28), (4, 16), (8, 16), (14, 26)], CHIFRE)
    t.poli([(16, 24), (14, 12), (18, 13), (20, 23)], CHIFRE)
    t.luz()
    # rachaduras nas placas
    t.linha([(15, 25), (17, 28)], escurecer(PLACA, 0.3), 1)
    t.linha([(38, 23), (41, 27)], escurecer(PLACA, 0.3), 1)
    # as pintas brancas do celacanto
    for x, y in ((24, 30), (30, 36), (38, 32), (44, 38), (22, 42), (34, 44),
                 (46, 30), (28, 48), (40, 46), (50, 40)):
        t.pxs([(x, y), (x + 1, y), (x, y + 1)], PINTA)
    # listras do rabo
    t.linha([(56, 32), (60, 27)], CORPO_E, 1)
    t.linha([(56, 46), (60, 53)], CORPO_E, 1)
    if not costas:
        # olho de pedra, vermelho como o do RELICANTH, e a boca velha
        t.elipse(12, 33, 3, 3, (250, 200, 80, 255))
        t.elipse(12, 33, 1, 2, PRETO)
        t.px(11, 31, BRANCO)
        t.linha([(4, 40), (10, 41), (15, 40)], CORPO_E, 1)
        t.pxs([(7, 41), (11, 42)], BRANCO)
    else:
        t.linha([(10, 36), (50, 36)], CORPO_E, 1)          # a linha lateral
    t.contorno()
    return t


# -------------------------------------------------------------- SOLROCK-BRAG
def solrockbrag(t, costas=False):
    """SOLROCK-BRAG: o MORRO DO PICO AO SOL. O disco de fogo do SOLROCK com
    os raios em volta e, no meio dele, o dedo de pedra do morro com o
    mato na base. Os olhos vermelhos ficam na rocha. PEDRA/FOGO."""
    RAIO = (246, 134, 40, 255)
    RAIO_C = (255, 208, 80, 255)
    DISCO = (250, 182, 60, 255)
    ROCHA = (140, 96, 70, 255)
    ROCHA_E = (96, 62, 48, 255)
    cx, cy = 32, 32
    # os raios em ponta (como o SOLROCK)
    for i in range(12):
        a = i * math.pi / 6
        a1, a2 = a - 0.18, a + 0.18
        pts = [(cx + 17 * math.cos(a1), cy + 17 * math.sin(a1)),
               (cx + 29 * math.cos(a), cy + 29 * math.sin(a)),
               (cx + 17 * math.cos(a2), cy + 17 * math.sin(a2))]
        t.poli([(round(x), round(y)) for x, y in pts], RAIO)
    t.elipse(cx, cy, 19, 19, DISCO)
    t.luz(poupar=(RAIO[:3],))
    t.elipse(cx, cy, 15, 15, RAIO_C)
    # o morro de pé no disco
    _pico(t, 32, 50, 16, 34, ROCHA)
    t.elipse(32, 49, 16, 3, MATO)
    t.linha([(24, 20), (26, 30), (22, 40)], ROCHA_E, 1)     # fendas da pedra
    t.linha([(36, 34), (40, 44)], ROCHA_E, 1)
    t.linha([(29, 18), (30, 24)], clarear(ROCHA, 0.3), 1)
    for x in (20, 26, 38, 44):
        t.px(x, 48, MATO_E)
    if not costas:
        # os olhos do SOLROCK, vermelhos e bravos, na pedra
        for ex in (27, 36):
            t.elipse(ex, 36, 2, 2, (230, 40, 40, 255))
            t.px(ex, 36, (255, 230, 120, 255))
        t.linha([(24, 32), (29, 34)], PRETO, 1)
        t.linha([(39, 32), (34, 34)], PRETO, 1)
    else:
        # de costas: só o morro visto de trás, com um coqueirinho
        t.linha([(30, 26), (33, 44)], ROCHA_E, 1)
        t.linha([(44, 46), (46, 38)], (120, 80, 40, 255), 1)
        t.pxs([(44, 37), (45, 36), (47, 36), (48, 37), (46, 36)], MATO_E)
    t.contorno()
    return t


# -------------------------------------------------------------- LUNATONE-BRAG
def lunatonebrag(t, costas=False):
    """LUNATONE-BRAG: o MORRO DO PICO À NOITE. A lua crescente do LUNATONE,
    de pedra pálida, e aninhado na curva dela o morro virado sombra, com o
    olho vermelho aceso e estrelinhas em volta. PEDRA/FANTASMA."""
    LUA = (214, 212, 196, 255)
    LUA_E = (160, 156, 146, 255)
    SOMBRA = (70, 62, 110, 255)
    SOMBRA_E = (44, 38, 76, 255)
    ESTRELA = (250, 244, 190, 255)
    # a crescente: disco menos um disco deslocado
    t.elipse(28, 32, 26, 26, LUA)
    t.elipse(40, 26, 22, 22, VAZIO)
    t.luz()
    # crateras
    for x, y, r in ((10, 30, 2), (14, 44, 3), (24, 52, 2), (8, 38, 1)):
        t.elipse(x, y, r, r, LUA_E)
    # o morro-sombra na curva da lua
    _pico(t, 40, 56, 16, 40, SOMBRA)
    t.linha([(35, 22), (37, 34), (34, 46)], SOMBRA_E, 1)
    t.linha([(38, 18), (39, 24)], clarear(SOMBRA, 0.25), 1)
    # fiapos de fantasma escorrendo da base
    for x in (28, 34, 42, 50):
        t.linha([(x, 56), (x - 1, 59)], SOMBRA, 1)
    for x, y in ((56, 8), (50, 16), (60, 22), (46, 4)):
        t.pxs([(x, y - 1), (x - 1, y), (x + 1, y), (x, y + 1)], ESTRELA)
        t.px(x, y, BRANCO)
    if not costas:
        # o olho do LUNATONE, na lua, e o segundo olho aceso na pedra do morro
        t.elipse(16, 24, 4, 3, (200, 40, 50, 255))
        t.elipse(16, 24, 2, 1, (255, 160, 150, 255))
        t.linha([(11, 20), (20, 21)], LUA_E, 1)
        t.elipse(40, 36, 2, 2, (230, 50, 60, 255))
        t.px(40, 36, (255, 200, 200, 255))
    else:
        t.linha([(10, 18), (6, 32), (10, 48)], LUA_E, 1)
    t.contorno()
    return t


# -------------------------------------------------------------- SABLEYE-BRAG
def sableyebrag(t, costas=False):
    """SABLEYE-BRAG: a MARIA-FARINHA, o caranguejo-fantasma da areia. A
    carapaça é da cor da areia e meio transparente de azul; os olhos de
    pedra preciosa do SABLEYE ficam em cima de dois pedúnculos altos, e o
    sorriso de dente serrado continua o mesmo. FANTASMA/ÁGUA."""
    CASCA = (226, 216, 190, 255)
    CASCA_E = (150, 150, 170, 255)
    FANTASMA = (170, 190, 230, 255)
    GEMA = (80, 230, 230, 255)
    GEMA_E = (30, 150, 170, 255)
    RUBI = (220, 40, 70, 255)
    # pernas (quatro de cada lado), finas e dobradas
    for i, x in enumerate((14, 18, 22, 26)):
        t.linha([(x, 46), (x - 10, 48 + i), (x - 12, 58)], CASCA, 2)
    for i, x in enumerate((38, 42, 46, 50)):
        t.linha([(x, 46), (x + 10, 48 + i), (x + 12, 58)], CASCA, 2)
    # carapaça larga
    t.elipse(32, 42, 19, 11, CASCA)
    # garras: uma grande (esquerda) e uma pequena
    t.linha([(16, 40), (8, 32)], CASCA, 3)
    t.poli([(2, 22), (10, 18), (14, 26), (10, 34), (4, 32)], CASCA)
    t.linha([(48, 40), (54, 34)], CASCA, 3)
    t.poli([(52, 28), (58, 26), (60, 32), (56, 36)], CASCA)
    # pedúnculos dos olhos
    t.ret(24, 18, 26, 34, CASCA)
    t.ret(38, 18, 40, 34, CASCA)
    t.luz()
    # o fantasma: a borda da carapaça fica azulada, meio transparente
    for x in range(14, 51):
        for y in range(33, 54):
            c = t.cor(x, y)
            if c[3] and c[:3] == CASCA[:3] and ((x + y) % 5 == 0):
                t.px(x, y, FANTASMA)
    t.linha([(15, 46), (32, 51), (49, 46)], CASCA_E, 1)
    # o talho da garra grande
    t.poli([(4, 26), (10, 24), (6, 29)], VAZIO)
    if not costas:
        # olhos de gema do SABLEYE, em losango, no alto dos pedúnculos
        for cx in (25, 39):
            t.poli([(cx, 10), (cx + 5, 15), (cx, 20), (cx - 5, 15)], GEMA)
            t.poli([(cx, 12), (cx + 3, 15), (cx, 18)], GEMA_E)
            t.px(cx - 2, 14, BRANCO)
        # o sorriso de dente serrado
        t.poli([(22, 40), (42, 40), (38, 46), (26, 46)], (40, 20, 50, 255))
        for x in range(23, 42, 3):
            t.pxs([(x, 41), (x + 1, 42)], BRANCO)
            t.px(x + 1, 45, BRANCO)
        # a pedra vermelha do peito do SABLEYE
        t.poli([(32, 34), (35, 37), (32, 39), (29, 37)], RUBI)
        t.px(31, 36, BRANCO)
    else:
        # de costas: pedúnculos com os olhos por trás e a costura da casca
        for cx in (25, 39):
            t.poli([(cx, 11), (cx + 4, 15), (cx, 19), (cx - 4, 15)], CASCA_E)
        t.linha([(20, 38), (32, 34), (44, 38)], CASCA_E, 1)
        t.linha([(32, 34), (32, 50)], CASCA_E, 1)
    t.contorno()
    return t


# -------------------------------------------------------------- CUTIEFLY-BRAG
def cutieflybrag(t, costas=False):
    """CUTIEFLY-BRAG: a abelha JATAÍ. O cabeção redondo e os olhões do
    CUTIEFLY, mas cor de mel com a nuca escura da jataí, quatro asas de
    vidro, antenas de pompom e duas bolotas de pólen nas perninhas; segura
    uma florzinha. INSETO/PLANTA."""
    MEL = (240, 196, 70, 255)
    MEL_E = (190, 130, 40, 255)
    NUCA = (70, 52, 40, 255)
    ASA = (200, 236, 250, 255)
    ASA_E = (140, 190, 220, 255)
    POLEN = (250, 150, 40, 255)
    FOLHA = (90, 170, 70, 255)
    # asas grandes atrás (duas de cada lado)
    t.elipse(12, 22, 11, 9, ASA)
    t.elipse(52, 22, 11, 9, ASA)
    t.elipse(12, 38, 8, 6, ASA)
    t.elipse(52, 38, 8, 6, ASA)
    # corpinho listrado embaixo
    t.elipse(32, 50, 8, 8, MEL)
    # cabeção
    t.elipse(32, 30, 15, 14, MEL)
    # antenas de pompom
    t.linha([(26, 17), (20, 8), (18, 5)], NUCA, 1)
    t.linha([(38, 17), (44, 8), (46, 5)], NUCA, 1)
    t.elipse(17, 4, 3, 3, (250, 236, 200, 255))
    t.elipse(47, 4, 3, 3, (250, 236, 200, 255))
    # perninhas com bolota de pólen
    t.linha([(27, 55), (24, 59)], NUCA, 1)
    t.linha([(37, 55), (40, 59)], NUCA, 1)
    t.elipse(22, 58, 2, 2, POLEN)
    t.elipse(42, 58, 2, 2, POLEN)
    t.luz()
    # nervuras das asas
    t.linha([(4, 18), (20, 26)], ASA_E, 1)
    t.linha([(60, 18), (44, 26)], ASA_E, 1)
    t.linha([(6, 38), (18, 38)], ASA_E, 1)
    t.linha([(58, 38), (46, 38)], ASA_E, 1)
    # listras da barriga
    for y in (48, 52, 56):
        t.linha([(26, y), (38, y)], MEL_E, 1)
    if not costas:
        # os olhões do CUTIEFLY
        for cx in (26, 38):
            t.elipse(cx, 31, 5, 6, PRETO)
            t.elipse(cx - 1, 29, 2, 2, BRANCO)
            t.px(cx + 2, 34, (120, 110, 150, 255))
        t.pxs([(31, 38), (32, 39), (33, 38)], NUCA)
        t.pxs([(20, 36), (21, 36), (43, 36), (44, 36)], (246, 140, 110, 255))
        # a florzinha que ela carrega (com o talo e uma folha)
        t.linha([(44, 44), (50, 50)], FOLHA, 1)
        t.px(47, 48, FOLHA)
        t.px(48, 46, FOLHA)
        for dx, dy in ((0, -2), (-2, 0), (2, 0), (0, 2)):
            t.elipse(44 + dx, 43 + dy, 1, 1, (250, 240, 250, 255))
        t.px(44, 43, POLEN)
    else:
        # a nuca escura da jataí e o risco no meio
        t.elipse(32, 27, 12, 10, NUCA)
        t.linha([(32, 18), (32, 42)], escurecer(NUCA, 0.3), 1)
        t.pxs([(28, 22), (29, 21)], clarear(NUCA, 0.3))
    t.contorno()
    return t


# -------------------------------------------------------------- MAREEP-BRAG
def mareepbrag(t, costas=False):
    """MAREEP-BRAG: o CABRITO da ilha. Pelo marrom e branco de cabra, a
    gola fofa de lã do MAREEP no pescoço, chifres enrolados, barbicha — e no
    lugar da bola da cauda, uma pedra redonda. NORMAL/PEDRA."""
    PELO = (170, 120, 80, 255)
    PELO_E = (112, 76, 52, 255)
    LA = (244, 240, 228, 255)
    CHIFRE = (200, 184, 150, 255)
    CASCO = (60, 50, 50, 255)
    ROCHA = (130, 124, 120, 255)
    # pernas
    for x in (18, 25, 38, 45):
        t.ret(x, 44, x + 4, 56, PELO)
        t.ret(x, 56, x + 4, 58, CASCO)
    # corpo
    t.elipse(32, 40, 18, 10, PELO)
    # cauda com a pedra na ponta
    t.linha([(48, 36), (54, 30)], PELO, 3)
    t.elipse(56, 27, 5, 5, ROCHA)
    # cabeça (virada pra esquerda) e pescoço
    t.poli([(16, 34), (12, 22), (20, 20), (24, 34)], PELO)
    t.elipse(12, 18, 7, 6, PELO)
    t.poli([(6, 18), (2, 24), (8, 26), (12, 22)], PELO)             # focinho
    # orelhas
    t.poli([(16, 14), (24, 12), (20, 18)], PELO)
    # gola de lã do MAREEP
    for cx, cy in ((16, 28), (22, 30), (19, 34), (13, 32), (25, 35)):
        t.elipse(cx, cy, 5, 4, LA)
    # lã na barriga
    t.elipse(32, 46, 12, 4, LA)
    # chifres enrolados
    t.linha([(12, 13), (15, 7), (20, 4), (25, 5), (27, 9), (25, 12)], CHIFRE, 3)
    t.luz()
    t.linha([(20, 46), (44, 46)], clarear(LA, 0.2), 1)
    # rachaduras na pedra da cauda
    t.linha([(54, 25), (57, 28), (56, 31)], escurecer(ROCHA, 0.35), 1)
    # manchas do pelo
    t.elipse(40, 36, 4, 3, PELO_E)
    t.pxs([(15, 8), (19, 5), (24, 6), (26, 9)], escurecer(CHIFRE, 0.3))
    # barbicha
    t.poli([(5, 26), (9, 26), (7, 32)], LA)
    if not costas:
        olho(t, 11, 18, 1)
        t.pxs([(9, 16), (10, 16), (11, 16)], (240, 200, 90, 255))
        t.px(11, 18, PRETO)
        t.pxs([(2, 23), (3, 24)], PRETO)                           # narina
        t.linha([(4, 25), (7, 25)], PELO_E, 1)
    else:
        # de costas: a faixa escura do lombo de cabra
        t.linha([(16, 32), (32, 30), (48, 34)], PELO_E, 2)
    t.contorno()
    return t


# -------------------------------------------------------------- WISHIWASHI-BRAG
def wishiwashibrag(t, costas=False):
    """WISHIWASHI-BRAG: o CARDUME DE SARDINHA. A forma de cardume do
    WISHIWASHI, um peixão feito de dezenas de sardinhas prateadas nadando
    juntas, com o olhão no meio e a cauda que se desfaz em peixinhos
    soltos. ÁGUA/NORMAL."""
    AZUL = (40, 90, 150, 255)
    AZUL_E = (26, 58, 110, 255)
    PRATA = (200, 214, 226, 255)
    PRATA_E = (130, 150, 176, 255)
    DORSO = (70, 120, 170, 255)
    # o peixão
    t.elipse(28, 36, 24, 17, AZUL)
    t.poli([(46, 30), (62, 18), (58, 36), (62, 54), (46, 42)], AZUL)
    t.poli([(20, 20), (30, 8), (36, 20)], AZUL)                  # barbatana do alto
    t.poli([(22, 52), (28, 60), (34, 52)], AZUL)
    t.luz()
    # as sardinhas: cada uma é um risquinho prateado com dorso azul
    for y in range(22, 54, 4):
        for x in range(8, 58, 6):
            dx = 3 if (y // 4) % 2 else 0
            px = x + dx
            if t.cor(px, y)[3] == 0 or t.cor(px + 4, y)[3] == 0:
                continue
            t.linha([(px, y), (px + 3, y)], PRATA, 1)
            t.px(px + 1, y - 1, DORSO)
            t.px(px + 4, y, PRATA_E)
    # peixinhos soltos escapando da cauda
    for x, y in ((60, 8), (62, 60), (56, 4)):
        t.linha([(x - 2, y), (x, y)], PRATA, 1)
        t.px(x + 1, y, PRATA_E)
    if not costas:
        # o olhão do cardume
        t.elipse(14, 32, 7, 7, BRANCO)
        t.elipse(13, 32, 4, 4, PRETO)
        t.px(11, 30, BRANCO)
        t.anel(14, 32, 7, 7, AZUL_E, 1)
        # a boca
        t.linha([(4, 42), (10, 44), (14, 42)], AZUL_E, 2)
    else:
        t.linha([(20, 16), (56, 36)], AZUL_E, 1)
    t.contorno()
    return t


# -------------------------------------------------------------- DRAMPA-BRAG
def drampabrag(t, costas=False):
    """DRAMPA-BRAG: o DRAGÃO QUE DORME DEBAIXO DA ILHA. O corpão comprido e
    claro do DRAMPA, deitado na água; a juba de nuvem virou mato e alga, e
    nas costas cresceu um coqueiro. Dorme de olho fechado, com o bigodão
    boiando. DRAGÃO/ÁGUA."""
    CORPO = (214, 208, 230, 255)
    CORPO_E = (160, 150, 186, 255)
    JUBA = (94, 170, 90, 255)
    JUBA_E = (54, 118, 64, 255)
    BIGODE = (246, 246, 236, 255)
    TRONCO = (140, 96, 56, 255)
    # o mar embaixo
    t.elipse(32, 58, 31, 5, MAR)
    # o rabo saindo da água do lado direito
    t.poli([(44, 52), (52, 44), (58, 38), (62, 40), (58, 48), (52, 56)], CORPO)
    # corpo deitado, costas altas como um morro
    t.elipse(34, 46, 20, 12, CORPO)
    # pescoço e cabeça à esquerda, apoiada no chão
    t.poli([(20, 40), (12, 34), (6, 40), (14, 50), (22, 52)], CORPO)
    t.elipse(12, 42, 10, 8, CORPO)
    t.poli([(2, 44), (4, 50), (14, 52), (12, 44)], CORPO)             # focinho
    # juba-mato sobre a cabeça e o pescoço (a nuvem do DRAMPA)
    for cx, cy, r in ((14, 32, 6), (22, 32, 5), (28, 34, 5), (8, 35, 4)):
        t.elipse(cx, cy, r, r - 1, JUBA)
    # a ilha nas costas: pedra e mato
    t.elipse(36, 34, 14, 5, JUBA)
    _pico(t, 40, 34, 7, 14, PEDRA)
    # o coqueiro
    t.linha([(28, 32), (26, 22), (27, 14)], TRONCO, 2)
    t.luz(poupar=(MAR[:3],))
    for a in (-2.6, -2.0, -1.2, -0.5, 0.2):
        t.linha([(27, 14), (round(27 + 8 * math.cos(a)), round(14 + 6 * math.sin(a) + 3))], JUBA_E, 2)
    t.pxs([(26, 15), (28, 16)], (120, 80, 40, 255))
    # espuma onde o corpo encosta no mar
    for x in range(4, 62, 5):
        t.px(x, 56 + (x % 3), ESPUMA)
    # escamas da barriga
    for x in range(22, 50, 5):
        t.linha([(x, 54), (x + 3, 52)], CORPO_E, 1)
    t.linha([(52, 48), (58, 42)], CORPO_E, 1)
    if not costas:
        # olho fechado, dormindo
        t.linha([(10, 40), (13, 42), (16, 40)], PRETO, 1)
        t.pxs([(3, 45), (4, 46)], PRETO)                               # narina
        # o bigodão boiando
        t.linha([(6, 48), (2, 52), (1, 57)], BIGODE, 2)
        t.linha([(12, 50), (14, 55), (18, 57)], BIGODE, 2)
        # os zzz
        for x, y in ((4, 28), (1, 22)):
            t.linha([(x, y), (x + 3, y), (x, y + 3), (x + 3, y + 3)], BRANCO, 1)
    else:
        # de costas: a espinha de juba correndo pelo lombo
        for x in range(18, 56, 5):
            t.elipse(x, 38 + abs(x - 36) // 4, 2, 1, JUBA_E)
    t.contorno()
    return t


# -------------------------------------------------------------- CASTFORM-BRAG
def castformbrag(t, costas=False):
    """CASTFORM-BRAG: o TEMPO QUE MUDA TODA HORA. O CASTFORM de cabeça
    redonda e topete, mas metade é sol laranja e metade é nuvem de chuva —
    sol e chuva ao mesmo tempo — com um arco-íris passando por trás.
    NORMAL/ÁGUA."""
    SOL = (252, 170, 50, 255)
    SOL_C = (255, 222, 110, 255)
    NUVEM = (150, 170, 200, 255)
    NUVEM_E = (96, 112, 150, 255)
    GOTA = (80, 160, 240, 255)
    ARCO = [(230, 60, 60, 255), (246, 160, 50, 255), (250, 220, 70, 255),
            (90, 190, 90, 255), (70, 130, 230, 255)]
    # o arco-íris por trás
    for i, c in enumerate(ARCO):
        t.anel(32, 36, 30 - i * 2, 28 - i * 2, c, 2)
    t.ret(0, 37, 63, 63, VAZIO)
    # raios do sol à esquerda
    for a in (2.4, 3.0, 3.6, 4.2):
        x, y = 24 + 20 * math.cos(a), 30 + 20 * math.sin(a)
        t.linha([(round(24 + 14 * math.cos(a)), round(30 + 14 * math.sin(a))), (round(x), round(y))], SOL, 2)
    # a cabeça redonda (esquerda sol, direita nuvem)
    t.elipse(32, 32, 16, 15, SOL)
    for cx, cy, r in ((38, 24, 9), (44, 32, 8), (40, 40, 8), (34, 32, 8)):
        t.elipse(cx, cy, r, r, NUVEM)
    # o topete do CASTFORM: metade chama, metade gota
    t.poli([(28, 18), (24, 6), (32, 12)], SOL)
    t.poli([(32, 12), (38, 2), (40, 12), (36, 18)], NUVEM)
    # o rabinho de baixo (o corpo em gota do CASTFORM)
    t.poli([(26, 44), (38, 44), (32, 54)], NUVEM)
    t.poli([(26, 44), (32, 44), (32, 54)], SOL)
    t.luz(poupar=(SOL[:3],))
    t.elipse(24, 26, 4, 3, SOL_C)
    # gotas de chuva caindo do lado da nuvem
    for x, y in ((46, 48), (52, 44), (42, 54), (54, 54), (48, 58)):
        t.linha([(x, y), (x - 1, y + 3)], GOTA, 1)
    t.linha([(32, 46), (32, 52)], NUVEM_E, 1)
    if not costas:
        for cx in (26, 38):
            t.elipse(cx, 32, 2, 3, PRETO)
            t.px(cx - 1, 31, BRANCO)
        t.linha([(29, 38), (32, 40), (35, 38)], PRETO, 1)
        t.pxs([(21, 36), (22, 36)], (240, 110, 80, 255))
        t.pxs([(42, 36), (43, 36)], NUVEM_E)
    else:
        t.linha([(32, 18), (32, 44)], NUVEM_E, 1)
        t.pxs([(26, 24), (27, 22)], SOL_C)
    t.contorno()
    return t


# -------------------------------------------------------------- COMFEY-BRAG
def comfeybrag(t, costas=False):
    """COMFEY-BRAG: o COLAR DE FLORES DE IPÊ. O aro de cipó do COMFEY virou
    um colar trançado com flores de ipê amarelo, roxo e branco; a fadinha
    verde no meio segura o colar como o COMFEY faz. PLANTA/FADA."""
    CIPO = (70, 140, 70, 255)
    CIPO_E = (40, 96, 50, 255)
    FADA = (130, 206, 120, 255)
    FADA_C = (190, 236, 170, 255)
    AMARELO = (250, 206, 40, 255)
    ROXO = (200, 110, 200, 255)
    BRANCO_I = (250, 240, 246, 255)
    MIOLO = (180, 90, 40, 255)
    cx, cy = 32, 32
    # o aro do colar
    t.anel(cx, cy, 25, 25, CIPO, 4)
    # a fadinha no meio: cabeça, corpinho e bracinhos que seguram o aro
    t.elipse(32, 28, 8, 7, FADA)
    t.poli([(28, 34), (36, 34), (38, 46), (26, 46)], FADA)
    t.linha([(26, 36), (12, 36)], FADA, 2)
    t.linha([(38, 36), (52, 36)], FADA, 2)
    # anteninhas-folha
    t.poli([(28, 22), (22, 14), (30, 20)], FADA)
    t.poli([(36, 22), (42, 14), (34, 20)], FADA)
    t.luz()
    t.anel(cx, cy, 25, 25, CIPO_E, 1)
    # as flores de ipê em volta: cinco pétalas e o miolo
    cores = [AMARELO, ROXO, AMARELO, BRANCO_I, AMARELO, ROXO, AMARELO, BRANCO_I, AMARELO, ROXO]
    for i, c in enumerate(cores):
        a = -math.pi / 2 + i * 2 * math.pi / len(cores)
        fx, fy = round(cx + 24 * math.cos(a)), round(cy + 24 * math.sin(a))
        for k in range(5):
            b = a + k * 2 * math.pi / 5
            t.elipse(round(fx + 3 * math.cos(b)), round(fy + 3 * math.sin(b)), 2, 2, c)
        t.px(fx, fy, MIOLO)
        t.px(fx - 1, fy - 1, clarear(c, 0.5))
    # folhinhas entre as flores
    for i in range(10):
        a = -math.pi / 2 + (i + 0.5) * 2 * math.pi / 10
        fx, fy = round(cx + 26 * math.cos(a)), round(cy + 26 * math.sin(a))
        t.pxs([(fx, fy), (fx + 1, fy)], CIPO_E)
    # a flor grande que ela tem na cabeça
    for k in range(5):
        b = -math.pi / 2 + k * 2 * math.pi / 5
        t.elipse(round(32 + 3 * math.cos(b)), round(21 + 3 * math.sin(b)), 2, 2, AMARELO)
    t.px(32, 21, MIOLO)
    if not costas:
        t.elipse(29, 29, 1, 2, PRETO)
        t.elipse(35, 29, 1, 2, PRETO)
        t.pxs([(29, 28), (35, 28)], BRANCO)
        t.pxs([(31, 33), (32, 34), (33, 33)], CIPO_E)
        t.pxs([(26, 31), (38, 31)], (246, 150, 170, 255))
        t.linha([(28, 40), (36, 40)], FADA_C, 1)
    else:
        t.linha([(32, 24), (32, 46)], CIPO_E, 1)
    t.contorno()
    return t


DESENHOS = {
    21801: (rowletbrag, "rowletbrag"),
    21802: (chinchoubrag, "chinchoubrag"),
    21803: (relicanthbrag, "relicanthbrag"),
    21804: (solrockbrag, "solrockbrag"),
    21805: (lunatonebrag, "lunatonebrag"),
    21806: (sableyebrag, "sableyebrag"),
    21807: (cutieflybrag, "cutieflybrag"),
    21808: (mareepbrag, "mareepbrag"),
    21809: (wishiwashibrag, "wishiwashibrag"),
    21810: (drampabrag, "drampabrag"),
    21811: (castformbrag, "castformbrag"),
    21812: (comfeybrag, "comfeybrag"),
}
