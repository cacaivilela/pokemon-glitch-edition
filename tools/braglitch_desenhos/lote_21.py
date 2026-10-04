"""Lote 21: as 14 formas da ILHABELLOSSOM (a ILHABELA de Braglitch).

Ilha de mata fechada descendo até o mar, cachoeira em todo canto, veleiro na
baía e borrachudo em tudo que é perna. Os bichos que ficaram presos lá viraram
a fauna da ilha: o VENONAT virou BORRACHUDO, o PSYDUCK virou PATO-MERGULHÃO, o
POLIWAG é girino de RÃ-PIMENTA, o EXEGGCUTE é um cacho de JABUTICABA grudado
no tronco, o TANGELA é um bolo de CIPÓ-IMBÉ, o SENTRET é SARUÊ, o HOOTHOOT é
CORUJA-BURAQUEIRA, o LEDYBA é VAGA-LUME, o MARILL é LONTRA, o WINGULL é
FRAGATA, o CORPHISH é LAGOSTA SAPATEIRA, o TENTACOOL é CARAVELA-PORTUGUESA,
o SKITTY é GATO-DO-MATO-PEQUENO e o NINCADA é CIGARRA.

Todos desenhados do zero, mantendo a silhueta da base: dá pra ver o Pokémon
de Kanto (ou de Johto, ou de Hoenn) por baixo do bicho da ilha.
"""
import math

from pixelart import Tela, clarear, escurecer  # noqa: F401

BRANCO = (250, 250, 250, 255)
PRETO = (30, 26, 34, 255)
VAZIO = (0, 0, 0, 0)


def olho(t, cx, cy, r=2, iris=PRETO, brilho=BRANCO):
    t.elipse(cx, cy, r, r, iris)
    t.px(cx - 1, cy - 1, brilho)


def _perna(t, pts, cor, cor_b=None, grossura=2):
    """Perninha fina de inseto; `cor_b` pinta as faixas brancas do borrachudo."""
    t.linha(pts, cor, grossura)
    if cor_b:
        for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
            t.px((x0 + x1) // 2, (y0 + y1) // 2, cor_b)


# ------------------------------------------------------------- BORRACHUDO
BORRA = (70, 62, 80, 255)
BORRA_E = (44, 38, 52, 255)
BORRA_C = (118, 108, 128, 255)
OLHO_V = (214, 44, 54, 255)
OLHO_VC = (255, 120, 110, 255)
ASA_V = (196, 226, 240, 255)
ASA_VE = (140, 180, 204, 255)
CINZA_P = (220, 220, 226, 255)


def venonatbrag(t, costas=False):
    """VENONAT-BRAG: o borrachudo da ilha — bolota peluda escura, corcunda,
    olhões vermelhos de VENONAT, asinha transparente e perna listrada de
    branco. INSETO/VOADOR."""
    # as asas, atrás do corpo
    t.poli([(22, 30), (4, 16), (2, 24), (8, 34), (20, 40)], ASA_V)
    t.poli([(42, 30), (60, 16), (62, 24), (56, 34), (44, 40)], ASA_V)
    # pernas (atrás do corpo, saindo pra baixo)
    for pts in (((20, 46), (12, 52), (10, 60)), ((26, 50), (22, 56), (22, 61)),
                ((44, 46), (52, 52), (54, 60)), ((38, 50), (42, 56), (42, 61))):
        t.linha(list(pts), BORRA_E, 2)
    # o corpo redondo, com a corcunda do borrachudo em cima
    t.elipse(32, 38, 17, 15, BORRA)
    t.elipse(32, 25, 12, 8, BORRA)
    # antenas curtas
    t.linha([(27, 19), (23, 11), (21, 10)], BORRA_E, 2)
    t.linha([(37, 19), (41, 11), (43, 10)], BORRA_E, 2)
    t.luz()
    # nervuras das asas
    t.linha([(20, 32), (6, 20)], ASA_VE, 1)
    t.linha([(20, 36), (5, 27)], ASA_VE, 1)
    t.linha([(44, 32), (58, 20)], ASA_VE, 1)
    t.linha([(44, 36), (59, 27)], ASA_VE, 1)
    # faixas brancas das pernas
    for x, y in ((11, 55), (16, 49), (22, 57), (53, 55), (48, 49), (42, 57)):
        t.px(x, y, CINZA_P)
        t.px(x + 1, y, CINZA_P)
    # pelo: tufinhos na borda
    for x, y in ((16, 34), (15, 40), (17, 46), (48, 34), (49, 40), (47, 46), (24, 52), (32, 54), (40, 52)):
        t.px(x, y, BORRA_C)
    if not costas:
        # olhões compostos do VENONAT, vermelhos com faceta
        for cx in (24, 40):
            t.elipse(cx, 35, 6, 6, OLHO_V)
            for dx, dy in ((-3, -2), (0, -3), (-2, 1), (1, 0), (3, 2), (-1, 4), (2, -2)):
                t.px(cx + dx, 35 + dy, OLHO_VC)
            t.px(cx - 3, 32, BRANCO)
            t.px(cx - 2, 31, BRANCO)
        # a tromba que pica
        t.linha([(32, 42), (32, 49)], PRETO, 1)
        t.px(31, 42, BORRA_E)
        t.px(33, 42, BORRA_E)
        t.px(32, 50, OLHO_V)
    else:
        # de costas: a corcunda com listras cinza e o bundão do abdome
        t.linha([(24, 22), (40, 22)], BORRA_C, 1)
        t.linha([(22, 26), (42, 26)], BORRA_C, 1)
        for y in (38, 43, 48):
            t.linha([(20, y), (44, y)], BORRA_E, 1)
        t.linha([(32, 18), (32, 30)], BORRA_E, 1)
    t.contorno()
    return t


# --------------------------------------------------------- PATO-MERGULHÃO
MERG = (152, 150, 146, 255)
MERG_E = (104, 102, 100, 255)
MERG_C = (208, 204, 196, 255)
CABECA = (40, 60, 52, 255)
CABECA_C = (70, 100, 86, 255)
BICO = (96, 92, 100, 255)
PE_V = (212, 90, 60, 255)
PEITO = (226, 222, 210, 255)


def psyduckbrag(t, costas=False):
    """PSYDUCK-BRAG: o pato-mergulhão — corpo cinza de PSYDUCK com as mãos na
    cabeça, cabeça escura de topete arrepiado e bico fino de serra.
    ÁGUA/PSÍQUICO."""
    # pés de pato
    t.poli([(18, 55), (28, 55), (30, 61), (14, 61)], PE_V)
    t.poli([(36, 55), (46, 55), (50, 61), (34, 61)], PE_V)
    # corpo gordinho sentado
    t.elipse(32, 45, 16, 13, MERG)
    # cabeça grande do PSYDUCK
    t.elipse(32, 22, 15, 13, CABECA)
    # o topete desgrenhado do mergulhão (no lugar dos três fios)
    t.poli([(24, 12), (18, 4), (26, 8), (28, 1), (32, 8), (38, 2), (38, 10), (46, 6), (44, 14)], CABECA)
    if not costas:
        # bico fino, comprido e com gancho na ponta
        t.poli([(28, 27), (36, 27), (34, 38), (32, 40), (30, 38)], BICO)
    # braços levantados, mão segurando a cabeça
    t.poli([(17, 40), (10, 32), (12, 22), (18, 20), (19, 28), (22, 38)], MERG)
    t.poli([(47, 40), (54, 32), (52, 22), (46, 20), (45, 28), (42, 38)], MERG)
    t.luz()
    if not costas:
        t.elipse(32, 48, 10, 8, PEITO)
        # pontilhado do peito
        for x, y in ((27, 45), (31, 44), (35, 45), (29, 49), (33, 49), (37, 49), (31, 52)):
            t.px(x, y, MERG_C)
        # o serrilhado do bico e o ganchinho
        for y in (30, 33, 36):
            t.px(30, y, BRANCO)
            t.px(34, y, BRANCO)
        t.px(32, 40, PE_V)
        t.linha([(32, 28), (32, 38)], (58, 54, 62, 255), 1)
        # os olhos vazios do PSYDUCK (a dor de cabeça de sempre)
        for cx in (25, 39):
            t.elipse(cx, 21, 4, 4, BRANCO)
            t.px(cx, 21, PRETO)
        # brilho verde da cabeça
        t.linha([(21, 14), (25, 11)], CABECA_C, 1)
    else:
        # de costas: o dorso riscado e a cauda curtinha
        t.poli([(26, 56), (38, 56), (32, 60)], MERG_E)
        for y in (40, 44, 48, 52):
            t.linha([(22, y), (42, y)], MERG_E, 1)
        t.linha([(24, 14), (40, 14)], CABECA_C, 1)
        t.linha([(22, 20), (42, 20)], CABECA_C, 1)
    # dedos das mãos na cabeça
    for x, y in ((13, 20), (15, 19), (49, 19), (51, 20)):
        t.px(x, y, MERG_C)
    t.contorno()
    return t


# ----------------------------------------------------- GIRINO DE RÃ-PIMENTA
GIRI = (132, 98, 62, 255)
GIRI_E = (84, 60, 38, 255)
GIRI_C = (186, 150, 104, 255)
PIMENTA = (232, 70, 30, 255)
PIMENTA_C = (255, 170, 60, 255)
BARRIGA_G = (240, 214, 170, 255)
BEICO_G = (238, 200, 160, 255)


def poliwagbrag(t, costas=False):
    """POLIWAG-BRAG: girino de rã-pimenta — o corpão redondo do POLIWAG,
    marrom pintado de escuro, com a espiral da barriga ardendo em vermelho
    de pimenta e as perninhas de trás já brotando. ÁGUA/FOGO."""
    # o rabo, grande e em curva, saindo pra cima-direita
    rabo = []
    for i in range(13):
        f = i / 12
        cx, cy = 44 + 16 * f, 40 - 30 * f + 6 * f * f
        w = 7 * math.sin(math.pi * min(1, f * 1.1 + 0.08))
        rabo.append((cx, cy, w))
    t.poli([(round(x - w), round(y - w * 0.5)) for x, y, w in rabo] +
           [(round(x + w), round(y + w * 0.5)) for x, y, w in reversed(rabo)], GIRI_C)
    # perninhas de trás brotando (dobradas, de rã)
    t.elipse(14, 55, 6, 4, GIRI)
    t.poli([(10, 57), (4, 61), (12, 61)], GIRI)
    t.elipse(48, 55, 6, 4, GIRI)
    t.poli([(52, 57), (58, 61), (50, 61)], GIRI)
    # o corpo
    t.elipse(31, 38, 20, 19, GIRI)
    t.luz()
    t.linha([(47, 36), (53, 24), (59, 13)], GIRI, 1)            # nervura do rabo
    # manchas escuras da rã-pimenta
    for cx, cy in ((16, 30), (20, 22), (44, 26), (47, 42), (14, 44), (38, 21), (26, 18)):
        t.elipse(cx, cy, 2, 1, GIRI_E)
    t.pxs([(6, 60), (9, 60), (55, 60), (58, 60)], GIRI_E)       # dedinhos
    if not costas:
        # a barriga clara com a espiral de pimenta
        t.elipse(31, 42, 12, 12, BARRIGA_G)
        cx, cy = 31, 42
        pts = []
        for i in range(0, 60):
            a = i * 0.28
            r = 1 + i * 0.17
            pts.append((round(cx + r * math.cos(a)), round(cy + r * math.sin(a))))
        t.linha(pts, PIMENTA, 2)
        t.px(cx, cy, PIMENTA_C)
        # olhos em cima da cabeça e o beiço grosso do POLIWAG
        for ex in (22, 40):
            t.elipse(ex, 26, 4, 4, BRANCO)
            t.elipse(ex + 1, 26, 2, 2, PRETO)
            t.px(ex, 25, BRANCO)
        t.elipse(31, 31, 4, 2, BEICO_G)
        t.linha([(28, 31), (34, 31)], GIRI_E, 1)
    else:
        # de costas: fileira de verruguinhas vermelhas de pimenta
        for cx, cy in ((24, 28), (31, 25), (38, 28), (22, 38), (31, 36), (40, 38), (26, 47), (36, 47)):
            t.elipse(cx, cy, 1, 1, PIMENTA)
            t.px(cx, cy - 1, PIMENTA_C)
    t.contorno()
    return t


# ------------------------------------------------------------ JABUTICABA
JABU = (58, 30, 70, 255)
JABU_C = (110, 70, 132, 255)
JABU_E = (34, 16, 42, 255)
TRONCO = (150, 118, 92, 255)
TRONCO_E = (104, 78, 60, 255)
TRONCO_C = (196, 170, 140, 255)
FLOR_J = (250, 248, 232, 255)
MIOLO_J = (230, 214, 150, 255)


def exeggcutebrag(t, costas=False):
    """EXEGGCUTE-BRAG: cacho de jabuticaba. Como a fruta de verdade, as seis
    bolinhas nascem grudadas no tronco — então ele anda com um pedaço do
    tronco malhado junto. PLANTA/PSÍQUICO."""
    # o pedaço de tronco malhado, atrás
    t.poli([(24, 6), (40, 6), (42, 60), (22, 60)], TRONCO)
    t.poli([(24, 6), (27, 3), (33, 5), (37, 2), (40, 6)], TRONCO)
    t.luz(forca=0.2, sombra=0.2)
    for cx, cy in ((28, 12), (35, 18), (30, 24), (26, 40), (37, 46), (31, 55)):
        t.elipse(cx, cy, 2, 1, TRONCO_C)
    for cx, cy in ((36, 10), (27, 30), (35, 36), (29, 50)):
        t.elipse(cx, cy, 2, 1, TRONCO_E)
    # as seis jabuticabas, grudadas no tronco (o cacho do EXEGGCUTE)
    bagas = ((14, 26), (48, 22), (12, 44), (50, 42), (24, 51), (40, 53))
    if costas:
        bagas = ((16, 24), (46, 20), (13, 42), (51, 40), (22, 52), (42, 52))
    for cx, cy in bagas:
        t.elipse(cx, cy, 8, 8, JABU)
    t.luz(forca=0.35, sombra=0.3, poupar=(TRONCO[:3], TRONCO_C[:3], TRONCO_E[:3]))
    for cx, cy in bagas:
        t.px(cx - 4, cy - 4, BRANCO)          # o brilho da casca lustrosa
        t.px(cx - 3, cy - 5, JABU_C)
        t.px(cx - 5, cy - 3, JABU_C)
        if not costas:
            # a carinha de EXEGGCUTE, uma diferente da outra
            olho(t, cx - 3, cy, 1, BRANCO, BRANCO)
            olho(t, cx + 2, cy, 1, BRANCO, BRANCO)
            t.px(cx - 3, cy, PRETO)
            t.px(cx + 2, cy, PRETO)
            t.linha([(cx - 2, cy + 4), (cx + 1, cy + 4)], JABU_E, 1)
        else:
            # o cabinho curto onde encosta no tronco
            t.px(cx, cy - 7, (120, 150, 70, 255))
            t.px(cx, cy - 8, (120, 150, 70, 255))
    # florzinhas brancas da jabuticabeira, grudadas na casca
    for cx, cy in ((32, 14), (30, 36), (34, 28)):
        t.pxs([(cx, cy - 1), (cx - 1, cy), (cx + 1, cy), (cx, cy + 1)], FLOR_J)
        t.px(cx, cy, MIOLO_J)
    t.contorno()
    return t


# ------------------------------------------------------------ CIPÓ-IMBÉ
CIPO = (122, 84, 56, 255)
CIPO_E = (80, 54, 36, 255)
CIPO_C = (170, 128, 88, 255)
IMBE = (44, 132, 66, 255)
IMBE_E = (24, 86, 44, 255)
IMBE_C = (104, 186, 96, 255)
PE_C = (92, 64, 44, 255)


def _folha_imbe(t, cx, cy, ang, tam):
    """Folha recortada do imbé (aquela cheia de dedos)."""
    ca, sa = math.cos(ang), math.sin(ang)
    gira = lambda x, y: (round(cx + x * ca - y * sa), round(cy + x * sa + y * ca))
    # folha em coração, ponta pra cima (o talo fica embaixo, em cx, cy)
    pts = []
    for i in range(25):
        a = i / 24 * 2 * math.pi
        x = 16 * math.sin(a) ** 3
        y = -(13 * math.cos(a) - 5 * math.cos(2 * a) - 2 * math.cos(3 * a) - math.cos(4 * a))
        pts.append(gira(x * tam / 16, -y * tam / 16 - tam * 0.9))
    t.poli(pts, IMBE)
    # os recortes fundos do imbé, da borda até perto da nervura
    for k in (-1, 1):
        for h in (0.5, 1.0):
            t.linha([gira(k * tam * 0.95, -tam * h), gira(k * tam * 0.35, -tam * (h + 0.15))], VAZIO, 1)
    t.linha([gira(0, 0), gira(0, -tam * 1.6)], IMBE_E, 1)


def tangelabrag(t, costas=False):
    """TANGELA-BRAG: bolo de cipó-imbé — raiz aérea marrom enrolada no lugar
    dos cipós azuis, folhas recortadas de imbé espetadas e dois punhos de
    cipó trançado. PLANTA/LUTADOR."""
    # os pés de raiz (as botas do TANGELA)
    t.elipse(22, 57, 7, 4, PE_C)
    t.elipse(42, 57, 7, 4, PE_C)
    # o bolo de cipó
    t.elipse(32, 34, 21, 21, CIPO)
    # folhas de imbé espetadas pra fora
    _folha_imbe(t, 18, 20, -0.7, 9)
    _folha_imbe(t, 46, 20, 0.7, 9)
    _folha_imbe(t, 32, 16, 0.0, 8)
    # os punhos de cipó trançado, cerrados
    t.linha([(12, 38), (5, 44)], CIPO, 4)
    t.elipse(5, 47, 5, 5, CIPO)
    t.linha([(52, 38), (59, 44)], CIPO, 4)
    t.elipse(58, 47, 5, 5, CIPO)
    t.luz()
    # a trama: laçadas de cipó cruzando o bolo
    for a0 in range(0, 360, 40):
        a = math.radians(a0)
        pts = []
        for k in range(10):
            s = k / 9
            r = 19 * s
            pts.append((round(32 + r * math.cos(a + s * 1.6)), round(34 + r * math.sin(a + s * 1.6))))
        t.linha(pts, CIPO_E, 1)
    for x, y in ((20, 24), (40, 26), (24, 46), (44, 42), (16, 36), (48, 34)):
        t.px(x, y, CIPO_C)
    # nervuras das folhas
    # nós dos dedos
    t.linha([(2, 46), (8, 46)], CIPO_E, 1)
    t.linha([(55, 46), (61, 46)], CIPO_E, 1)
    if not costas:
        # a fresta escura onde moram os olhos do TANGELA
        t.elipse(32, 34, 11, 5, PRETO)
        t.elipse(27, 34, 2, 2, BRANCO)
        t.elipse(37, 34, 2, 2, BRANCO)
        t.px(28, 34, PRETO)
        t.px(38, 34, PRETO)
    else:
        # de costas: uma raiz aérea comprida pendurada, como rabo
        t.linha([(38, 50), (46, 58), (52, 60)], CIPO_E, 2)
    t.contorno()
    return t


# --------------------------------------------------------------- SARUÊ
SARU = (150, 148, 150, 255)
SARU_E = (96, 94, 100, 255)
SARU_C = (208, 206, 206, 255)
ORELHA = (248, 244, 238, 255)
ORELHA_P = (40, 34, 40, 255)
FOCINHO = (244, 238, 230, 255)
ROSA = (238, 160, 170, 255)
RABO_R = (226, 196, 190, 255)


def sentretbrag(t, costas=False):
    """SENTRET-BRAG: o saruê — em pé no rabo como o SENTRET, mas o rabo é
    pelado e enrolado de gambá, a orelha é branca e a cara tem a listra
    preta no meio. NORMAL/VENENO."""
    # o rabo pelado, em mola, que segura ele em pé
    pts = []
    for i in range(46):
        a = -math.pi / 2 + i * 0.24
        r = 10 - i * 0.17
        pts.append((round(46 + r * math.cos(a)), round(48 + r * math.sin(a))))
    t.linha([(36, 52), (42, 57), (48, 57), (54, 52), (56, 46), (53, 40), (46, 38)], RABO_R, 3)
    t.linha(pts, RABO_R, 3)
    # pé
    t.elipse(28, 58, 6, 3, SARU_E)
    # corpo comprido em pé
    t.elipse(29, 42, 11, 15, SARU)
    # cabeça
    t.elipse(29, 20, 12, 10, SARU)
    # orelhonas
    t.elipse(18, 9, 5, 6, ORELHA_P)
    t.elipse(40, 9, 5, 6, ORELHA_P)
    # focinho comprido
    t.poli([(22, 22), (36, 22), (31, 32), (27, 32)], FOCINHO)
    # bracinhos
    t.poli([(20, 36), (14, 42), (17, 45), (22, 40)], SARU)
    t.poli([(38, 36), (44, 42), (41, 45), (36, 40)], SARU)
    t.luz()
    # a ponta branca das orelhas (saruê de orelha branca)
    t.elipse(18, 7, 3, 4, ORELHA)
    t.elipse(40, 7, 3, 4, ORELHA)
    t.pxs([(15, 44), (16, 45), (42, 44), (43, 45)], ROSA)          # mãozinhas rosas
    # anéis de pelo claro, lembrando as listras do SENTRET
    for y in (38, 46):
        t.linha([(20, y), (38, y)], SARU_C, 1)
    t.linha([(42, 58), (48, 58), (54, 53)], escurecer(RABO_R, 0.2), 1)
    if not costas:
        t.elipse(29, 46, 6, 8, SARU_C)
        # a listra preta do meio da testa, e a mancha em volta dos olhos
        t.linha([(29, 11), (29, 22)], ORELHA_P, 2)
        for ex in (23, 35):
            t.elipse(ex, 19, 3, 2, ORELHA_P)
            t.px(ex, 19, BRANCO)
            t.px(ex + (1 if ex < 29 else -1), 19, (200, 40, 40, 255))
        t.elipse(29, 31, 2, 1, ROSA)                          # narizinho rosa
        t.linha([(24, 28), (19, 27)], SARU_E, 1)              # bigode
        t.linha([(34, 28), (39, 27)], SARU_E, 1)
        # a nuvenzinha de cheiro (é por isso que é VENENO)
        for x, y in ((50, 26), (53, 23), (55, 28), (48, 22)):
            t.px(x, y, (170, 196, 90, 255))
    else:
        # de costas: um filhotinho agarrado nas costas, como gambá faz
        t.linha([(29, 14), (29, 52)], SARU_E, 1)
        t.elipse(33, 36, 6, 5, SARU)
        t.elipse(33, 33, 4, 3, SARU_C)
        t.elipse(28, 30, 2, 3, ORELHA_P)
        t.elipse(38, 30, 2, 3, ORELHA_P)
        t.px(28, 29, ORELHA)
        t.px(38, 29, ORELHA)
        t.linha([(33, 30), (33, 34)], ORELHA_P, 1)
        t.px(31, 34, PRETO)
        t.px(35, 34, PRETO)
        t.px(33, 36, ROSA)
        t.linha([(27, 38), (39, 38)], SARU_E, 1)
    t.contorno()
    return t


# -------------------------------------------------- CORUJA-BURAQUEIRA
CORU = (170, 128, 84, 255)
CORU_E = (116, 84, 54, 255)
CORU_C = (214, 184, 140, 255)
PINTA = (248, 240, 222, 255)
AMARELO = (250, 206, 50, 255)
PERNA_C = (190, 180, 160, 255)
BARRO = (178, 132, 88, 255)
BARRO_E = (130, 92, 60, 255)
BURACO = (46, 32, 26, 255)


def hoothootbrag(t, costas=False):
    """HOOTHOOT-BRAG: coruja-buraqueira — o corpo redondo do HOOTHOOT,
    pintadinho de branco, em cima de pernas compridas de buraqueira, de
    guarda na boca da toca. NORMAL/TERRA."""
    # o montinho de terra com a toca
    t.elipse(32, 60, 26, 5, BARRO)
    # pernas compridas
    t.linha([(26, 46), (25, 57)], PERNA_C, 2)
    t.linha([(38, 46), (39, 57)], PERNA_C, 2)
    # corpo redondo
    t.elipse(32, 32, 17, 16, CORU)
    # os dois tufos do HOOTHOOT (ponteiros de relógio)
    t.poli([(24, 18), (20, 6), (27, 16)], CORU_E)
    t.poli([(38, 16), (46, 9), (40, 19)], CORU_E)
    t.luz()
    t.linha([(10, 60), (54, 60)], BARRO_E, 1)
    t.elipse(50, 59, 5, 2, BURACO)                              # a toca
    # dedos
    t.linha([(22, 57), (28, 57)], PERNA_C, 1)
    t.linha([(36, 57), (42, 57)], PERNA_C, 1)
    # asas fechadas
    t.poli([(15, 30), (19, 44), (22, 36)], CORU_E)
    t.poli([(49, 30), (45, 44), (42, 36)], CORU_E)
    if not costas:
        # peito claro de listras
        t.elipse(32, 40, 8, 6, CORU_C)
        for y in (37, 40, 43):
            t.linha([(28, y), (36, y)], CORU, 1)
        # sobrancelha branca da buraqueira e os olhões amarelos de aro
        t.poli([(19, 22), (32, 26), (45, 22), (45, 24), (32, 28), (19, 24)], PINTA)
        for ex in (25, 39):
            t.elipse(ex, 29, 5, 4, CORU_E)
            t.elipse(ex, 29, 4, 3, AMARELO)
            t.elipse(ex, 29, 1, 1, PRETO)
            t.px(ex - 2, 28, BRANCO)
        t.poli([(31, 31), (33, 31), (32, 35)], (200, 190, 150, 255))   # bico
        t.linha([(26, 49), (38, 49)], PINTA, 1)                      # papo branco
    # pintinhas brancas
    for x, y in ((20, 24), (44, 24), (18, 32), (46, 32), (22, 42), (42, 42),
                 (26, 20), (38, 20)) if not costas else \
            ((24, 22), (32, 20), (40, 22), (22, 30), (30, 28), (38, 30), (44, 32),
             (26, 38), (34, 36), (40, 40), (20, 38), (30, 44)):
        t.px(x, y, PINTA)
    t.contorno()
    return t


# ------------------------------------------------------------ VAGA-LUME
VAGA = (56, 44, 40, 255)
VAGA_C = (100, 84, 76, 255)
PRONO = (236, 132, 60, 255)
LUZ_V = (214, 250, 90, 255)
LUZ_C = (250, 255, 200, 255)
CABECA_V = (40, 34, 42, 255)


def ledybabrag(t, costas=False):
    """LEDYBA-BRAG: vaga-lume — casco escuro no lugar da joaninha vermelha,
    gola laranja, as pintas viraram pontinhos de luz e o rabo acende
    verde. Os quatro bracinhos do LEDYBA continuam. INSETO/ELÉTRICO."""
    # o rabo aceso, atrás embaixo
    t.elipse(32, 52, 10, 7, LUZ_V)
    # a luz em volta (halo), sem contorno de corpo
    # o casco
    t.elipse(32, 38, 17, 15, VAGA)
    # a cabeça redonda do LEDYBA, com a gola laranja
    t.elipse(32, 20, 10, 5, PRONO)
    t.elipse(32, 17, 9, 8, CABECA_V)
    # antenas compridas
    t.linha([(27, 11), (20, 4), (15, 3)], CABECA_V, 1)
    t.linha([(37, 11), (44, 4), (49, 3)], CABECA_V, 1)
    # quatro bracinhos
    for pts in (((16, 32), (8, 30), (6, 26)), ((16, 42), (8, 44), (5, 48)),
                ((48, 32), (56, 30), (58, 26)), ((48, 42), (56, 44), (59, 48))):
        t.linha(list(pts), CABECA_V, 2)
    t.luz(poupar=(LUZ_V[:3],))
    for x, y in ((6, 26), (5, 48), (58, 26), (59, 48)):
        t.elipse(x, y, 2, 2, BRANCO)                         # luvinhas brancas
    t.elipse(15, 3, 1, 1, LUZ_V)
    t.elipse(49, 3, 1, 1, LUZ_V)
    t.elipse(32, 54, 6, 3, LUZ_C)
    if not costas:
        # olhões do LEDYBA
        for ex in (28, 36):
            t.elipse(ex, 17, 2, 3, BRANCO)
            t.elipse(ex, 18, 1, 1, PRETO)
        t.linha([(30, 22), (34, 22)], PRONO, 1)
        # barriga listrada de segmentos
        for y in (34, 39, 44):
            t.linha([(24, y), (40, y)], VAGA_C, 1)
    else:
        # de costas: o casco dividido, com as pintas que acendem
        t.linha([(32, 24), (32, 50)], PRETO, 1)
        for cx, cy in ((24, 32), (40, 32), (22, 42), (42, 42), (27, 47), (37, 47)):
            t.elipse(cx, cy, 2, 2, LUZ_V)
            t.px(cx - 1, cy - 1, LUZ_C)
    # faíscas em volta do rabo
    for x, y in ((18, 56), (46, 56), (14, 52), (50, 52), (32, 62)):
        t.px(x, y, LUZ_C)
    t.contorno()
    return t


# --------------------------------------------------------------- LONTRA
LONT = (126, 84, 52, 255)
LONT_E = (84, 54, 34, 255)
LONT_C = (170, 124, 82, 255)
GARGANTA = (236, 220, 190, 255)
BOLHA = (170, 220, 250, 255)
BOLHA_C = (230, 246, 255, 255)
BOLHA_R = (250, 180, 220, 255)
NARIZ = (40, 30, 30, 255)


def marillbrag(t, costas=False):
    """MARILL-BRAG: a lontra — corpo redondo de MARILL, mas marrom e de
    pelo molhado, papo creme, e na ponta do rabo a bolinha virou uma bolha
    de água com brilho cor-de-rosa. ÁGUA/FADA."""
    # o rabo: fino e em zigue-zague, com a bolha na ponta
    t.linha([(46, 50), (52, 46), (50, 38), (55, 32)], LONT, 2)
    t.elipse(55, 24, 7, 7, BOLHA)
    # pés espalmados
    t.elipse(22, 58, 6, 3, LONT_E)
    t.elipse(42, 58, 6, 3, LONT_E)
    # corpo-bola
    t.elipse(32, 40, 18, 17, LONT)
    # orelhinhas redondas pequenas (de lontra, não as do MARILL)
    t.elipse(19, 24, 4, 4, LONT)
    t.elipse(45, 24, 4, 4, LONT)
    # bracinhos
    t.elipse(14, 44, 4, 3, LONT)
    t.elipse(50, 44, 4, 3, LONT)
    t.luz(poupar=(BOLHA[:3],))
    t.elipse(19, 24, 2, 2, LONT_E)
    t.elipse(45, 24, 2, 2, LONT_E)
    # a bolha: brilho e reflexo de fada
    t.anel(55, 24, 7, 7, (120, 180, 220, 255), 1)
    t.elipse(52, 21, 2, 2, BOLHA_C)
    t.pxs([(58, 27), (57, 28), (59, 26)], BOLHA_R)
    # pés com os dedinhos
    t.pxs([(19, 60), (22, 60), (25, 60), (39, 60), (42, 60), (45, 60)], LONT_C)
    if not costas:
        # papo creme e focinho largo
        t.elipse(32, 46, 11, 10, GARGANTA)
        t.elipse(32, 35, 8, 4, GARGANTA)
        t.elipse(32, 33, 2, 1, NARIZ)
        t.pxs([(31, 36), (33, 36), (32, 37)], LONT_E)
        # bigodes
        for dy in (-1, 1):
            t.linha([(24, 35 + dy), (19, 34 + dy * 2)], BRANCO, 1)
            t.linha([(40, 35 + dy), (45, 34 + dy * 2)], BRANCO, 1)
        # olhinhos pretos brilhantes
        for ex in (25, 39):
            t.elipse(ex, 29, 2, 2, PRETO)
            t.px(ex - 1, 28, BRANCO)
    else:
        # de costas: pelo molhado em mechas e o rabo grosso na base
        for x, y in ((22, 30), (30, 28), (38, 30), (26, 40), (34, 40), (42, 40)):
            t.linha([(x, y), (x + 1, y + 3)], LONT_E, 1)
        t.elipse(32, 54, 5, 3, LONT_E)
    t.contorno()
    return t


# --------------------------------------------------------------- FRAGATA
FRAG = (40, 38, 50, 255)
FRAG_C = (80, 76, 96, 255)
FRAG_E = (22, 20, 30, 255)
PAPO = (226, 36, 48, 255)
PAPO_C = (255, 110, 110, 255)
BICO_F = (160, 164, 176, 255)
BICO_FE = (100, 104, 116, 255)
PES_F = (60, 56, 70, 255)


def wingullbrag(t, costas=False):
    """WINGULL-BRAG: a fragata, o tesourão — as asas retas e compridas do
    WINGULL, só que pretas, rabo em tesoura, bico cinza de gancho e o papo
    vermelho inflado de exibido. VOADOR/SOMBRIO."""
    # rabo em tesoura, comprido e fino, as duas pontas abertas
    t.poli([(23, 44), (41, 44), (45, 61), (39, 58), (32, 52), (25, 58), (19, 61)], FRAG)
    # as asas compridas e finas, com a dobra do WINGULL (cotovelo pra cima)
    t.poli([(25, 36), (14, 28), (2, 34), (0, 40), (10, 38), (26, 44)], FRAG)
    t.poli([(39, 36), (50, 28), (62, 34), (64, 40), (54, 38), (38, 44)], FRAG)
    # o corpo
    t.elipse(32, 40, 9, 10, FRAG)
    t.elipse(32, 28, 7, 6, FRAG)
    if not costas:
        # o papo vermelho estufado
        t.elipse(32, 43, 8, 8, PAPO)
    t.luz(forca=0.35)
    # penas de ponta das asas
    t.linha([(14, 30), (24, 37)], FRAG_C, 1)
    t.linha([(50, 30), (40, 37)], FRAG_C, 1)
    t.linha([(4, 36), (14, 37)], FRAG_E, 1)
    t.linha([(60, 36), (50, 37)], FRAG_E, 1)
    if not costas:
        t.elipse(29, 40, 2, 2, PAPO_C)
        # bico comprido de gancho descendo por cima do papo (o bico do WINGULL)
        t.poli([(30, 29), (34, 29), (34, 40), (32, 42), (30, 40)], BICO_F)
        t.linha([(32, 30), (32, 41)], BICO_FE, 1)
        t.pxs([(31, 42), (32, 43), (33, 42)], BICO_FE)
        # olhos pretos com o anel escuro, jeito de mau
        for ex, s in ((26, 1), (38, -1)):
            t.elipse(ex + 2 * s, 27, 2, 2, BRANCO)
            t.px(ex + 2 * s, 27, PRETO)
            t.px(ex + 3 * s, 27, PRETO)
            t.linha([(ex - s, 23), (ex + 4 * s, 25)], FRAG_E, 1)
    else:
        # de costas: dorso lustroso e o bico aparecendo em cima
        t.linha([(32, 30), (32, 48)], FRAG_E, 1)
        t.linha([(27, 36), (37, 36)], FRAG_C, 1)
    # pezinhos
    t.pxs([(29, 50), (35, 50), (28, 51), (36, 51)], PES_F)
    t.contorno()
    return t


# ------------------------------------------------------ LAGOSTA SAPATEIRA
LAGO = (196, 108, 60, 255)
LAGO_E = (136, 68, 36, 255)
LAGO_C = (236, 164, 100, 255)
ACO = (150, 164, 180, 255)
ACO_E = (98, 110, 128, 255)
ACO_C = (214, 222, 232, 255)
ESTRELA = (250, 214, 70, 255)


def corphishbrag(t, costas=False):
    """CORPHISH-BRAG: a lagosta sapateira — o bichinho troncudo do CORPHISH,
    mas achatado e cheio de placa, e as pinças viraram as duas pás chatas
    de aço da sapateira. ÁGUA/AÇO."""
    # rabo em leque atrás
    t.poli([(26, 50), (38, 50), (44, 60), (32, 58), (20, 60)], LAGO_E)
    # perninhas
    for s in (-1, 1):
        for i, y in enumerate((44, 48, 52)):
            t.linha([(32 + s * 12, y), (32 + s * (19 + i), y + 6)], LAGO_E, 2)
    # o corpo achatado e largo
    t.elipse(32, 42, 16, 12, LAGO)
    # a cabeça com a estrela do CORPHISH
    t.elipse(32, 29, 12, 9, LAGO)
    # as pás de aço (as antenas-chinelo da sapateira, no lugar das pinças)
    t.linha([(22, 34), (12, 28)], ACO, 4)
    t.linha([(42, 34), (52, 28)], ACO, 4)
    t.poli([(3, 12), (14, 8), (20, 18), (16, 30), (6, 28), (1, 20)], ACO)
    t.poli([(61, 12), (50, 8), (44, 18), (48, 30), (58, 28), (63, 20)], ACO)
    t.luz()
    # rebite e ranhura nas pás
    for s in (-1, 1):
        x0 = 32 + s * 22
        t.linha([(x0 - s * 6, 12), (x0 + s * 2, 26)], ACO_E, 1)
        t.linha([(x0 - s * 8, 18), (x0 - s * 1, 28)], ACO_E, 1)
        t.px(x0 - s * 4, 14, ACO_C)
    # placas da carapaça
    for y in (40, 45, 50):
        t.linha([(20, y), (44, y)], LAGO_E, 1)
    for x, y in ((24, 38), (32, 37), (40, 38)):
        t.px(x, y, ACO_C)
    if not costas:
        # a estrela do CORPHISH na testa, de aço
        t.pxs([(32, 21), (31, 22), (32, 22), (33, 22), (30, 23), (31, 23), (32, 23), (33, 23), (34, 23),
               (31, 24), (33, 24)], ESTRELA)
        # olhinhos de talo
        for ex in (26, 38):
            t.elipse(ex, 28, 3, 3, BRANCO)
            t.elipse(ex, 28, 1, 2, PRETO)
        # boca de bigodinho
        t.linha([(29, 33), (35, 33)], LAGO_E, 1)
        t.pxs([(28, 34), (36, 34)], LAGO_E)
    else:
        # de costas: a carapaça em placas de aço sobrepostas
        for y in (24, 30, 36):
            t.linha([(24, y), (40, y)], ACO_E, 1)
        t.linha([(32, 21), (32, 54)], LAGO_E, 1)
        for x, y in ((26, 27), (38, 27), (28, 33), (36, 33)):
            t.px(x, y, ACO_C)
    t.contorno()
    return t


# -------------------------------------------------- CARAVELA-PORTUGUESA
BOIA = (160, 176, 236, 255)
BOIA_C = (214, 222, 255, 255)
BOIA_E = (110, 120, 200, 255)
CRISTA = (230, 110, 190, 255)
CRISTA_C = (255, 180, 230, 255)
GEMA = (240, 60, 30, 255)
GEMA_C = (255, 200, 90, 255)
TENT = (90, 110, 210, 255)
TENT_C = (150, 170, 250, 255)
BRASA_T = (255, 120, 60, 255)


def tentacoolbrag(t, costas=False):
    """TENTACOOL-BRAG: a caravela-portuguesa — a cabeça de TENTACOOL virou a
    boia azul de ar com a vela rosa em cima, as duas joias vermelhas ardem
    de verdade, e embaixo desce a cortina de tentáculos que queima. ÁGUA/FOGO."""
    # tentáculos compridos, ondulando até o chão
    for i, x0 in enumerate((18, 22, 26, 30, 34, 38, 42, 46)):
        pts = []
        for y in range(38, 62, 2):
            pts.append((round(x0 + 2 * math.sin(y * 0.35 + i)), y))
        t.linha(pts, TENT if i % 2 else TENT_C, 2 if i in (0, 3, 4, 7) else 1)
    # os dois tentáculos grossos do TENTACOOL
    t.linha([(22, 38), (18, 46), (14, 56), (12, 62)], TENT, 3)
    t.linha([(42, 38), (46, 46), (50, 56), (52, 62)], TENT, 3)
    # a vela rosa
    t.poli([(14, 22), (18, 12), (30, 6), (44, 2), (52, 6), (52, 22)], CRISTA)
    # a boia
    t.elipse(33, 28, 22, 12, BOIA)
    t.luz(poupar=(TENT_C[:3],))
    # a borda enrugada da vela
    t.linha([(19, 12), (24, 9), (28, 8), (32, 5), (36, 5), (40, 3), (44, 3), (48, 4), (51, 7)], CRISTA_C, 1)
    for x, y in ((24, 12), (32, 9), (40, 6), (47, 6)):
        t.linha([(x, y), (x - 2, 17)], escurecer(CRISTA, 0.15), 1)
    # brilho da boia
    t.linha([(16, 24), (22, 20)], BOIA_C, 2)
    t.linha([(14, 32), (52, 34)], BOIA_E, 1)
    if not costas:
        # as duas joias em brasa do TENTACOOL, na frente da boia
        for gx in (24, 42):
            t.elipse(gx, 29, 4, 3, GEMA)
            t.px(gx - 1, 28, GEMA_C)
            t.px(gx - 2, 28, GEMA_C)
        # olhinhos entre as joias
        t.elipse(30, 31, 1, 1, PRETO)
        t.elipse(36, 31, 1, 1, PRETO)
        t.px(33, 34, GEMA_C)
    else:
        # de costas: a joia de trás, pequena
        t.elipse(33, 29, 3, 2, GEMA)
        t.px(32, 28, GEMA_C)
    # pontas dos tentáculos em brasa (é o FOGO)
    for x in (12, 52, 18, 46, 30, 34):
        t.px(x, 61, BRASA_T)
    t.contorno()
    return t


# ------------------------------------------------ GATO-DO-MATO-PEQUENO
GATO = (214, 168, 90, 255)
GATO_E = (150, 108, 52, 255)
GATO_C = (240, 210, 150, 255)
ROSETA = (70, 46, 30, 255)
CREME = (248, 238, 214, 255)
BROMA = (70, 160, 74, 255)
BROMA_C = (130, 206, 104, 255)
BROMA_V = (226, 60, 80, 255)
NARIZ_G = (220, 120, 120, 255)
OLHO_G = (170, 200, 70, 255)


def skittybrag(t, costas=False):
    """SKITTY-BRAG: gato-do-mato-pequeno — a cabeçona e as orelhas enormes do
    SKITTY, mas amarelo-palha cheio de roseta; e a bolinha do rabo virou
    uma bromélia. NORMAL/PLANTA."""
    # rabo levantado em S, terminando na bromélia
    t.linha([(44, 50), (52, 46), (54, 36), (50, 28)], GATO, 3)
    # a bromélia na ponta do rabo
    for dx, dy in ((-9, -5), (-5, -10), (0, -12), (5, -10), (9, -5), (-8, 1), (8, 1)):
        t.poli([(47, 28), (53, 28), (50 + dx + 2, 26 + dy), (50 + dx, 26 + dy - 1),
                (50 + dx - 2, 26 + dy)], BROMA)
    # patas
    t.elipse(22, 58, 5, 3, GATO)
    t.elipse(36, 58, 5, 3, GATO)
    # corpo pequeno
    t.elipse(30, 49, 12, 9, GATO)
    # cabeçona
    t.elipse(28, 30, 15, 12, GATO)
    # orelhas enormes do SKITTY
    t.poli([(14, 26), (8, 6), (24, 20)], GATO)
    t.poli([(42, 26), (48, 6), (32, 20)], GATO)
    t.luz()
    t.poli([(14, 22), (11, 10), (20, 20)], CREME)
    t.poli([(42, 22), (45, 10), (36, 20)], CREME)
    # miolo vermelho da bromélia
    t.elipse(50, 24, 2, 2, BROMA_V)
    t.px(49, 23, BRANCO)
    for dx, dy in ((-5, -8), (4, -8), (0, -10), (-7, -4), (7, -4)):
        t.px(50 + dx, 26 + dy, BROMA_C)
    # rosetas do gato-do-mato
    ros = ((20, 45), (27, 42), (35, 44), (24, 51), (32, 51), (39, 49), (16, 30), (40, 30))
    for x, y in ros:
        # roseta: um C aberto de pintinhas, não um anel fechado
        t.pxs([(x - 1, y - 1), (x, y - 1), (x - 1, y), (x - 1, y + 1), (x, y + 1), (x + 1, y + 1)], ROSETA)
    for x, y in ((53, 44), (54, 38), (53, 32)):
        t.px(x, y, ROSETA)
    # dedos
    t.pxs([(20, 60), (23, 60), (34, 60), (37, 60)], GATO_E)
    if not costas:
        # focinho creme e bochecha
        t.elipse(28, 35, 7, 5, CREME)
        # olhos grandes de gato
        for ex in (21, 35):
            t.elipse(ex, 29, 3, 3, OLHO_G)
            t.linha([(ex, 27), (ex, 31)], PRETO, 1)
            t.px(ex - 1, 28, BRANCO)
        # listras da testa
        t.linha([(26, 20), (26, 25)], ROSETA, 1)
        t.linha([(30, 20), (30, 25)], ROSETA, 1)
        t.pxs([(27, 33), (28, 33), (29, 33), (28, 34)], NARIZ_G)
        t.pxs([(26, 36), (27, 37), (28, 36), (29, 37), (30, 36)], GATO_E)
        # bigodes
        t.linha([(20, 35), (13, 34)], BRANCO, 1)
        t.linha([(36, 35), (43, 34)], BRANCO, 1)
    else:
        # de costas: a mancha branca atrás das orelhas e as listras da nuca
        t.elipse(14, 22, 2, 2, BRANCO)
        t.elipse(42, 22, 2, 2, BRANCO)
        for x in (24, 28, 32):
            t.linha([(x, 30), (x, 40)], ROSETA, 1)
    t.contorno()
    return t


# ---------------------------------------------------------------- CIGARRA
CIGA = (104, 120, 64, 255)
CIGA_E = (64, 76, 40, 255)
CIGA_C = (160, 176, 100, 255)
ASA_C = (214, 236, 228, 255)
ASA_CE = (120, 150, 120, 255)
OLHO_C = (180, 60, 50, 255)
SOM = (250, 230, 120, 255)
GARRA = (150, 110, 70, 255)


def nincadabrag(t, costas=False):
    """NINCADA-BRAG: a cigarra que canta até estourar — o corpo baixo e as
    garras de cavar do NINCADA, cabeça larga de olho nas pontas e as asas
    transparentes enormes de nervura verde. INSETO/NORMAL."""
    # asas grandes transparentes, abertas pra trás e pra cima
    t.poli([(26, 36), (6, 20), (2, 10), (10, 8), (22, 22), (30, 34)], ASA_C)
    t.poli([(38, 36), (58, 20), (62, 10), (54, 8), (42, 22), (34, 34)], ASA_C)
    # patas de cavar (as garras do NINCADA)
    t.linha([(20, 48), (10, 54), (8, 60)], GARRA, 3)
    t.linha([(44, 48), (54, 54), (56, 60)], GARRA, 3)
    t.linha([(26, 52), (22, 60)], GARRA, 2)
    t.linha([(38, 52), (42, 60)], GARRA, 2)
    # corpo baixo e comprido
    t.elipse(32, 46, 13, 11, CIGA)
    # cabeça larga, olho em cada ponta
    t.elipse(32, 34, 14, 7, CIGA)
    t.luz()
    # nervuras das asas
    for (a, b) in (((26, 34), (4, 12)), ((24, 30), (12, 12)), ((14, 22), (6, 19)),
                   ((38, 34), (60, 12)), ((40, 30), (52, 12)), ((50, 22), (58, 19))):
        t.linha([a, b], ASA_CE, 1)
    # a ponta das garras
    t.pxs([(7, 60), (9, 61), (55, 61), (57, 60)], CIGA_E)
    if not costas:
        # olhos saltados nas pontas da cabeça
        for ex in (20, 44):
            t.elipse(ex, 33, 3, 3, OLHO_C)
            t.px(ex - 1, 32, BRANCO)
        # os três olhinhos do meio e a boca de tromba
        t.pxs([(30, 31), (32, 30), (34, 31)], (250, 200, 80, 255))
        t.linha([(32, 36), (32, 42)], CIGA_E, 1)
        # a barriga de sanfona (é ela que faz o barulho)
        for y in (46, 49, 52, 55):
            t.linha([(25, y), (39, y)], CIGA_C, 1)
        # o som saindo: arcos amarelos
        for r in (3, 6):
            t.linha([(7 - r, 38 - r), (6 - r, 42), (7 - r, 46 + r)], SOM, 1)
            t.linha([(57 + r, 38 - r), (58 + r, 42), (57 + r, 46 + r)], SOM, 1)
    else:
        # de costas: a casca rachando no meio (de tanto cantar, estoura)
        t.linha([(32, 28), (31, 34), (33, 40), (31, 46), (32, 54)], PRETO, 1)
        t.linha([(31, 34), (29, 36)], PRETO, 1)
        t.linha([(33, 40), (35, 42)], PRETO, 1)
        t.pxs([(30, 31), (34, 37), (30, 43)], CIGA_C)
        # o W claro no dorso da cigarra
        t.linha([(24, 38), (27, 42), (32, 38), (37, 42), (40, 38)], CIGA_C, 1)
    t.contorno()
    return t


DESENHOS = {
    21201: (venonatbrag, "venonatbrag"),
    21202: (psyduckbrag, "psyduckbrag"),
    21203: (poliwagbrag, "poliwagbrag"),
    21204: (exeggcutebrag, "exeggcutebrag"),
    21205: (tangelabrag, "tangelabrag"),
    21206: (sentretbrag, "sentretbrag"),
    21207: (hoothootbrag, "hoothootbrag"),
    21208: (ledybabrag, "ledybabrag"),
    21209: (marillbrag, "marillbrag"),
    21210: (wingullbrag, "wingullbrag"),
    21211: (corphishbrag, "corphishbrag"),
    21212: (tentacoolbrag, "tentacoolbrag"),
    21213: (skittybrag, "skittybrag"),
    21214: (nincadabrag, "nincadabrag"),
}
