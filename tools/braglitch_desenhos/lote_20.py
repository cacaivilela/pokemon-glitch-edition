"""Lote 20: ILHA DO MELTAN — as formas braglitchianas da Ilha do Mel (PR).

Mata atlântica de beira de mar, gruta, farol e mangue. São os bichos do
começo da viagem (nível 5-9), e cada um é o Pokémon de sempre que ficou
isolado na ilha e virou bicho de lá:

PIDGEY -> SABIÁ-LARANJEIRA, RATTATA -> PREÁ, WURMPLE -> TATURANA,
ZUBAT -> MORCEGO-PESCADOR, KRABBY -> CARANGUEJO-UÇÁ, SHELLDER -> OSTRA DE
MANGUE, HOPPIP -> SEMENTE DE PAINEIRA, SEEDOT -> PINHÃO, WOOPER ->
SAPO-CURURU, SPINARAK -> CARANGUEJEIRA, MAGIKARP -> TAINHA.

Todos desenhados do zero: a silhueta é a do Pokémon de base (dá pra
reconhecer), o resto é o bicho da ilha.
"""
import math

from pixelart import Tela, clarear, escurecer  # noqa: F401

BRANCO = (250, 250, 250, 255)
PRETO = (30, 26, 34, 255)
VAZIO = (0, 0, 0, 0)


def olho(t, cx, cy, r=2, iris=PRETO, brilho=BRANCO):
    t.elipse(cx, cy, r, r, iris)
    t.px(cx - 1, cy - 1, brilho)


def _perna(t, pts, cor, grossura=2):
    t.linha(pts, cor, grossura)


# ------------------------------------------------------------ PIDGEY-BRAG
def pidgeybrag(t, costas=False):
    """Sabiá-laranjeira: o corpinho gordo do PIDGEY, costas pardas, peito
    laranja-ferrugem, o topete do PIDGEY virado pena parda e o bico amarelo."""
    PARDO = (140, 116, 84, 255)
    PARDO_E = (98, 78, 56, 255)
    LARANJA = (222, 120, 48, 255)
    CREME = (236, 220, 184, 255)
    BICO = (232, 190, 60, 255)
    PE = (196, 150, 120, 255)
    # rabo (atrás, pra baixo-direita)
    t.poli([(40, 44), (58, 52), (60, 57), (54, 58), (38, 52)], PARDO_E)
    # corpo
    t.elipse(31, 42, 17, 14, PARDO)
    # cabeça
    t.elipse(27, 22, 12, 11, PARDO)
    # topete do PIDGEY: penas pra trás
    t.poli([(24, 12), (36, 4), (32, 10), (42, 8), (36, 15), (30, 16)], PARDO)
    # asa
    t.poli([(36, 32), (50, 36), (54, 46), (46, 52), (36, 46)], PARDO_E)
    if not costas:
        # peito laranja
        t.elipse(28, 45, 11, 10, LARANJA)
        t.elipse(22, 32, 6, 3, CREME)          # a gargantinha clara riscada
    t.luz()
    # pés
    for x in (24, 33):
        _perna(t, [(x, 55), (x, 59)], PE, 2)
        t.pxs([(x - 2, 60), (x - 1, 60), (x + 1, 60), (x + 2, 60)], PE)
    # penas da asa
    for i in range(3):
        t.linha([(40 + i * 4, 38 + i), (44 + i * 3, 48)], escurecer(PARDO_E, 0.25), 1)
    if not costas:
        for x, y in ((19, 31), (22, 32), (25, 31), (21, 34), (24, 34)):
            t.px(x, y, PARDO_E)                            # pintinhas da garganta
        # bico
        t.poli([(15, 22), (8, 25), (15, 27)], BICO)
        t.linha([(9, 25), (15, 25)], escurecer(BICO, 0.35), 1)
        # olho com o anel amarelo do sabiá
        t.elipse(21, 20, 3, 3, BICO)
        olho(t, 21, 20, 2)
        # a riscadinha preta do PIDGEY atrás do olho
        t.linha([(24, 19), (29, 17)], PRETO, 1)
    else:
        t.linha([(27, 14), (27, 30)], PARDO_E, 1)
        t.linha([(31, 34), (31, 54)], PARDO_E, 1)
    t.contorno()
    return t


# ------------------------------------------------------------ RATTATA-BRAG
def rattatabrag(t, costas=False):
    """Preá: gordinho, sem rabo, orelhas redondas do RATTATA, os dentões da
    frente, e o capim que ele mastiga e que brota no lombo. NORMAL/PLANTA."""
    PELO = (150, 122, 92, 255)
    PELO_E = (104, 82, 62, 255)
    BARRIGA = (220, 200, 162, 255)
    ORELHA = (216, 150, 140, 255)
    CAPIM = (96, 170, 60, 255)
    CAPIM_E = (56, 120, 40, 255)
    # corpo gordo, rente ao chão
    t.elipse(34, 44, 22, 14, PELO)
    # cabeça
    t.elipse(22, 32, 14, 12, PELO)
    # orelhas redondas (grandes, como as do RATTATA)
    t.elipse(12, 20, 6, 7, PELO)
    t.elipse(31, 18, 6, 7, PELO)
    # patinhas
    for x in (18, 28, 42, 50):
        t.elipse(x, 57, 4, 3, PELO_E)
    t.luz()
    # tufos de capim no lombo
    for bx, h in ((34, 10), (40, 13), (46, 11), (52, 8)):
        t.poli([(bx - 2, 33), (bx - 4, 33 - h), (bx + 1, 33)], CAPIM)
        t.poli([(bx, 33), (bx + 3, 33 - h + 2), (bx + 3, 33)], CAPIM_E)
    if not costas:
        t.elipse(12, 20, 3, 4, ORELHA)
        t.elipse(31, 18, 3, 4, ORELHA)
        t.elipse(24, 46, 10, 7, BARRIGA)
        t.elipse(16, 37, 6, 4, BARRIGA)          # focinho
        olho(t, 15, 28, 3, (120, 30, 60, 255))
        olho(t, 28, 28, 3, (120, 30, 60, 255))
        t.pxs([(15, 34), (16, 34), (17, 34)], PRETO)   # narizinho
        # os dentões
        t.ret(15, 38, 18, 42, BRANCO)
        t.linha([(16, 38), (16, 42)], (200, 200, 200, 255), 1)
        # bigode
        for dy in (-1, 1):
            t.linha([(10, 36 + dy), (3, 34 + dy * 3)], PELO_E, 1)
            t.linha([(22, 36 + dy), (29, 34 + dy * 3)], PELO_E, 1)
        # o capim que ele está mastigando
        t.linha([(19, 41), (27, 44), (31, 43)], CAPIM, 1)
    else:
        t.elipse(12, 20, 3, 4, PELO_E)
        t.elipse(31, 18, 3, 4, PELO_E)
        t.linha([(22, 24), (46, 36)], PELO_E, 1)
        t.linha([(20, 34), (34, 46)], PELO_E, 1)
    t.contorno()
    return t


# ------------------------------------------------------------ WURMPLE-BRAG
def wurmplebrag(t, costas=False):
    """Taturana: a lagarta do WURMPLE, empinada, coberta de pelo que queima —
    tufos laranja e amarelos em cada gomo, o ferrão da cabeça e os da cauda.
    INSETO/FOGO."""
    GOMO = (150, 60, 40, 255)
    GOMO_C = (200, 90, 50, 255)
    PELO = (250, 150, 40, 255)
    PELO_C = (255, 220, 90, 255)
    PE = (240, 210, 170, 255)
    # gomos: a cauda à direita no chão, subindo pra cabeça à esquerda
    gomos = [(52, 52, 7), (43, 51, 8), (34, 48, 8), (26, 42, 8), (21, 33, 9)]
    for i, (x, y, r) in enumerate(gomos):
        t.elipse(x, y, r, r, GOMO if i % 2 else GOMO_C)
    # cabeça
    t.elipse(18, 22, 10, 9, GOMO_C)
    # ferrão da cabeça (o do WURMPLE)
    t.poli([(16, 13), (13, 3), (20, 12)], PE)
    # ferrões da cauda
    t.poli([(57, 49), (62, 44), (59, 52)], PE)
    t.poli([(56, 55), (62, 58), (55, 58)], PE)
    t.luz()
    # pezinhos
    for x, y in ((47, 58), (39, 56), (31, 55)):
        t.ret(x - 1, y, x + 1, y + 2, PE)
    # os pelos que queimam: leque de fios em cima de cada gomo
    for x, y, r in gomos:
        for k in range(-3, 4):
            ang = -math.pi / 2 + k * 0.32
            x1 = x + round(math.cos(ang) * (r - 1))
            y1 = y + round(math.sin(ang) * (r - 1))
            x2 = x + round(math.cos(ang) * (r + 6))
            y2 = y + round(math.sin(ang) * (r + 6))
            t.linha([(x1, y1), (x2, y2)], PELO if k % 2 else PELO_C, 1)
    # tufos no rosto
    for k in (-2, 2):
        t.linha([(18 + k * 3, 16), (18 + k * 5, 10)], PELO, 1)
    if not costas:
        olho(t, 13, 21, 2)
        olho(t, 22, 21, 2)
        t.poli([(14, 26), (22, 26), (18, 29)], (90, 30, 30, 255))   # boquinha
        t.pxs([(15, 26), (21, 26)], BRANCO)
    else:
        for x, y, r in gomos:
            t.px(x, y, PELO_C)
            t.px(x + 1, y, PELO_C)
    t.contorno()
    return t


# ------------------------------------------------------------ ZUBAT-BRAG
def zubatbrag(t, costas=False):
    """Morcego-pescador: o ZUBAT sem olho e de bocarra, pelo ruivo, as asas
    abertas e os pés compridos com garras enormes segurando um peixinho."""
    PELO = (190, 110, 60, 255)
    ASA = (110, 70, 90, 255)
    ASA_C = (160, 110, 140, 255)
    BOCA = (120, 20, 50, 255)
    PE = (230, 180, 140, 255)
    PEIXE = (180, 196, 210, 255)
    AGUA = (110, 180, 230, 255)
    # asas grandes com as pontas recortadas
    for lado in (-1, 1):
        cx = 32
        pts = [(cx + lado * 8, 18), (cx + lado * 20, 6), (cx + lado * 31, 12),
               (cx + lado * 28, 22), (cx + lado * 24, 20), (cx + lado * 22, 30),
               (cx + lado * 17, 26), (cx + lado * 12, 34), (cx + lado * 8, 32)]
        t.poli(pts, ASA)
    # corpo
    t.elipse(32, 26, 11, 12, PELO)
    # orelhas
    t.poli([(24, 18), (21, 5), (29, 15)], PELO)
    t.poli([(40, 18), (43, 5), (35, 15)], PELO)
    t.luz()
    # dedos das asas
    for lado in (-1, 1):
        t.linha([(32 + lado * 9, 20), (32 + lado * 20, 7)], ASA_C, 1)
        t.linha([(32 + lado * 9, 22), (32 + lado * 27, 20)], ASA_C, 1)
        t.linha([(32 + lado * 9, 26), (32 + lado * 21, 29)], ASA_C, 1)
    # pés compridos, do ZUBAT, descendo até o peixe
    t.linha([(28, 36), (25, 48)], PE, 2)
    t.linha([(36, 36), (39, 48)], PE, 2)
    # o peixinho seguro nas garras
    t.elipse(32, 52, 10, 4, PEIXE)
    t.poli([(41, 52), (47, 48), (47, 56)], PEIXE)
    t.linha([(24, 51), (40, 51)], escurecer(PEIXE, 0.3), 1)
    t.px(26, 51, PRETO)
    # garras
    for x in (25, 39):
        t.pxs([(x - 2, 49), (x - 2, 50), (x, 50), (x + 2, 49), (x + 2, 50)], PE)
    # pingos d'água caindo
    for x, y in ((18, 58), (46, 60), (30, 60), (12, 50)):
        t.pxs([(x, y), (x, y + 1)], AGUA)
    if not costas:
        # a bocarra do ZUBAT com os caninos
        t.elipse(32, 29, 6, 5, BOCA)
        t.ret(26, 24, 38, 25, PELO)
        t.poli([(28, 25), (30, 25), (29, 28)], BRANCO)
        t.poli([(34, 25), (36, 25), (35, 28)], BRANCO)
        t.elipse(32, 32, 3, 1, (220, 90, 110, 255))
        t.pxs([(24, 13), (40, 13)], (240, 170, 150, 255))   # dentro da orelha
    else:
        t.linha([(32, 16), (32, 36)], escurecer(PELO, 0.3), 1)
    t.contorno()
    return t


# ------------------------------------------------------------ KRABBY-BRAG
def krabbybrag(t, costas=False):
    """Caranguejo-uçá: a casca larga do KRABBY, roxa-azulada de mangue, pernas
    peludas cor de ferrugem, as duas pinças levantadas e os olhos de palito,
    tudo sujo de lama. ÁGUA/TERRA."""
    CASCA = (96, 80, 130, 255)
    CASCA_C = (140, 120, 170, 255)
    PERNA = (190, 100, 60, 255)
    PERNA_E = (130, 64, 40, 255)
    PINCA = (210, 120, 80, 255)
    PELO = (70, 50, 40, 255)
    LAMA = (98, 76, 52, 255)
    # pernas (4 de cada lado, pro chão)
    for lado in (-1, 1):
        for i in range(3):
            x0 = 32 + lado * (12 + i * 2)
            y0 = 42 + i * 3
            xm = 32 + lado * (22 + i * 3)
            t.linha([(x0, y0), (xm, y0 - 2), (xm + lado * 4, 59)], PERNA, 3)
    # casca
    t.elipse(32, 40, 18, 12, CASCA)
    # braços e pinças levantadas
    t.linha([(18, 36), (10, 28)], PERNA, 4)
    t.linha([(46, 36), (54, 28)], PERNA, 4)
    t.elipse(9, 20, 8, 9, PINCA)
    t.elipse(55, 20, 8, 9, PINCA)
    # a abertura da pinça
    t.poli([(4, 10), (10, 18), (13, 8)], VAZIO)
    t.poli([(60, 10), (54, 18), (51, 8)], VAZIO)
    # olhos de palito
    t.ret(25, 22, 27, 30, CASCA)
    t.ret(37, 22, 39, 30, CASCA)
    t.elipse(26, 21, 4, 4, CASCA_C)
    t.elipse(38, 21, 4, 4, CASCA_C)
    t.luz()
    # pelinho das pernas (uçá tem perna peluda)
    for lado in (-1, 1):
        for i in range(3):
            xm = 32 + lado * (22 + i * 3)
            t.pxs([(xm + lado * 2, 50 + i), (xm + lado * 3, 54 + i)], PELO)
    t.linha([(6, 14), (10, 17)], PERNA_E, 1)
    t.linha([(58, 14), (54, 17)], PERNA_E, 1)
    # lama na casca
    for x, y, r in ((22, 46, 3), (41, 47, 4), (32, 50, 2)):
        t.elipse(x, y, r, 2, LAMA)
    if not costas:
        olho(t, 26, 21, 2)
        olho(t, 38, 21, 2)
        # a boca de caranguejo, com bolhinhas
        t.linha([(28, 40), (36, 40)], escurecer(CASCA, 0.4), 1)
        for x, y in ((30, 36), (34, 35), (32, 33)):
            t.px(x, y, (220, 240, 255, 255))
    else:
        t.linha([(20, 36), (44, 36)], CASCA_C, 1)
        t.linha([(32, 30), (32, 50)], escurecer(CASCA, 0.3), 1)
        t.elipse(26, 21, 2, 2, escurecer(CASCA_C, 0.2))
        t.elipse(38, 21, 2, 2, escurecer(CASCA_C, 0.2))
    t.contorno()
    return t


# ------------------------------------------------------------ SHELLDER-BRAG
def shellderbrag(t, costas=False):
    """Ostra de mangue: as duas conchas do SHELLDER, só que tortas, grossas e
    cascudas feito pedra, com cracas grudadas; lá dentro a pérola preta que é
    o corpo, com o olhão e a língua pra fora. ÁGUA/PEDRA."""
    CONCHA = (150, 146, 130, 255)
    CONCHA_E = (104, 100, 90, 255)
    CONCHA_C = (196, 190, 170, 255)
    NACAR = (230, 220, 236, 255)
    CORPO = (46, 42, 60, 255)
    LINGUA = (230, 110, 130, 255)
    CRACA = (220, 214, 196, 255)
    # concha de baixo
    t.poli([(6, 40), (14, 54), (30, 60), (48, 58), (58, 46), (54, 36), (8, 34)], CONCHA)
    # concha de cima, aberta pra cima, torta
    t.poli([(8, 32), (6, 20), (14, 8), (30, 3), (46, 6), (57, 16), (58, 30), (54, 34)], CONCHA)
    t.luz()
    # beiradas onduladas das camadas (ostra é folhada)
    for k in range(3):
        t.linha([(10 + k * 3, 12 + k * 5), (30, 6 + k * 5), (52, 14 + k * 5)], CONCHA_E, 1)
        t.linha([(12 + k * 3, 52 - k * 4), (30, 57 - k * 4), (52, 50 - k * 4)], CONCHA_E, 1)
    # cracas
    for x, y in ((18, 10), (44, 9), (52, 48), (14, 48), (40, 56)):
        t.elipse(x, y, 2, 2, CRACA)
        t.px(x, y, CONCHA_E)
    t.linha([(12, 20), (18, 14)], CONCHA_C, 1)
    if not costas:
        # a boca aberta: nácar e o corpo escuro
        t.elipse(32, 33, 22, 8, NACAR)
        t.elipse(32, 33, 18, 6, CORPO)
        olho(t, 26, 31, 3, BRANCO, PRETO)
        t.px(26, 31, PRETO)
        t.px(27, 31, PRETO)
        olho(t, 38, 31, 3, BRANCO, PRETO)
        t.px(38, 31, PRETO)
        t.px(39, 31, PRETO)
        # a língua do SHELLDER, pra fora da concha
        t.poli([(30, 36), (36, 36), (40, 44), (35, 47), (31, 42)], LINGUA)
        t.linha([(33, 37), (36, 44)], escurecer(LINGUA, 0.25), 1)
    else:
        # de costas: a charneira e as camadas cascudas
        t.ret(26, 30, 38, 36, CONCHA_E)
        t.linha([(26, 33), (38, 33)], CONCHA_C, 1)
        t.linha([(20, 24), (44, 24)], CONCHA_E, 1)
        t.linha([(20, 42), (44, 42)], CONCHA_E, 1)
    t.contorno()
    return t


# ------------------------------------------------------------ HOPPIP-BRAG
def hoppipbrag(t, costas=False):
    """Semente de paineira: o corpinho redondo do HOPPIP é a semente marrom, e
    no lugar das folhas da cabeça e das pompons ele tem a paina — a nuvem de
    algodão que carrega ele no vento. Uma flor rosa de paineira no topo.
    PLANTA/FADA."""
    SEMENTE = (126, 84, 58, 255)
    SEMENTE_C = (170, 120, 84, 255)
    PAINA = (246, 244, 236, 255)
    PAINA_E = (212, 206, 196, 255)
    FLOR = (236, 120, 170, 255)
    FLOR_E = (190, 70, 120, 255)
    MIOLO = (250, 220, 120, 255)
    # a paina de cima (nuvem grande)
    for x, y, r in ((21, 16, 9), (32, 12, 10), (43, 16, 9), (27, 23, 7), (37, 23, 7)):
        t.elipse(x, y, r, r - 1, PAINA)
    t.ret(31, 24, 33, 29, (150, 110, 70, 255))              # o cabinho
    # pompons de paina nos braços
    for x, y in ((11, 40), (53, 40)):
        t.elipse(x, y, 7, 6, PAINA)
    # corpo-semente
    t.elipse(32, 42, 15, 13, SEMENTE)
    t.ret(15, 39, 19, 42, SEMENTE)                          # bracinhos
    t.ret(45, 39, 49, 42, SEMENTE)
    # pezinhos
    t.elipse(25, 55, 5, 3, SEMENTE)
    t.elipse(39, 55, 5, 3, SEMENTE)
    t.luz()
    # fios da paina
    for x, y in ((17, 14), (30, 9), (45, 14), (24, 22), (40, 22), (8, 38), (56, 38), (34, 18)):
        t.px(x, y, PAINA_E)
        t.px(x + 1, y + 1, PAINA_E)
    # o fiapo que liga a paina à cabeça
    # flor de paineira em cima
    for ang in range(5):
        a = ang * 2 * math.pi / 5 - math.pi / 2
        t.elipse(32 + round(math.cos(a) * 4), 7 + round(math.sin(a) * 4), 3, 3, FLOR)
    t.elipse(32, 7, 2, 2, MIOLO)
    t.px(32 + 3, 7 + 3, FLOR_E)
    if not costas:
        olho(t, 27, 41, 2)
        olho(t, 37, 41, 2)
        t.elipse(22, 46, 2, 1, (220, 130, 130, 255))
        t.elipse(42, 46, 2, 1, (220, 130, 130, 255))
        t.linha([(30, 47), (32, 48), (34, 47)], PRETO, 1)
        t.px(26, 34, SEMENTE_C)
    else:
        t.linha([(32, 31), (32, 53)], escurecer(SEMENTE, 0.3), 1)
    t.contorno()
    return t


# ------------------------------------------------------------ SEEDOT-BRAG
def seedotbrag(t, costas=False):
    """Pinhão: o SEEDOT é uma bolota com chapéu; este é um pinhão comprido,
    casca vinho, ponta clara em cima, e o chapéu virou um pedaço da pinha de
    araucária, de escamas duras feito pedra. PLANTA/PEDRA."""
    CASCA = (150, 62, 50, 255)
    CASCA_E = (104, 40, 36, 255)
    PONTA = (226, 196, 150, 255)
    PINHA = (110, 86, 62, 255)
    PINHA_C = (156, 128, 92, 255)
    FOLHA = (46, 110, 60, 255)
    ROSTO = (240, 214, 170, 255)
    # corpo: gota comprida, mais gorda embaixo
    t.poli([(32, 10), (40, 18), (45, 32), (46, 46), (42, 56), (32, 59),
            (22, 56), (18, 46), (19, 32), (24, 18)], CASCA)
    # chapéu de pinha (escamas em leque)
    t.elipse(32, 22, 15, 7, PINHA)
    # galhinho de araucária em cima
    t.linha([(32, 16), (32, 4)], FOLHA, 2)
    for y in (5, 9, 13):
        t.linha([(32, y), (26, y - 3)], FOLHA, 1)
        t.linha([(32, y), (38, y - 3)], FOLHA, 1)
    # pezinhos
    t.elipse(26, 59, 3, 2, CASCA_E)
    t.elipse(38, 59, 3, 2, CASCA_E)
    t.luz()
    # escamas da pinha
    for i, x in enumerate(range(20, 45, 5)):
        y = 22 + (1 if i % 2 else 0)
        t.poli([(x - 2, y + 3), (x, y - 3), (x + 3, y + 3)], PINHA_C)
        t.px(x, y + 1, escurecer(PINHA, 0.3))
    # veios da casca
    t.linha([(23, 34), (22, 48)], CASCA_E, 1)
    t.linha([(42, 34), (43, 48)], CASCA_E, 1)
    if not costas:
        # a cara num rostinho claro (como a do SEEDOT)
        t.elipse(32, 38, 9, 7, ROSTO)
        olho(t, 28, 37, 2)
        olho(t, 36, 37, 2)
        t.linha([(26, 33), (29, 34)], PRETO, 1)
        t.linha([(38, 33), (35, 34)], PRETO, 1)
        t.linha([(30, 42), (34, 42)], CASCA_E, 1)
    else:
        # a pontinha clara do pinhão, embaixo
        t.poli([(28, 52), (36, 52), (32, 58)], PONTA)
        t.linha([(32, 30), (32, 50)], CASCA_E, 1)
    t.contorno()
    return t


# ------------------------------------------------------------ WOOPER-BRAG
def wooperbrag(t, costas=False):
    """Sapo-cururu: o sorrisão largo e as guelras-galho do WOOPER, mas o corpo
    é de cururu: marrom-oliva, verruguento, com as glândulas de veneno
    inchadas atrás dos olhos. ÁGUA/VENENO."""
    PELE = (138, 128, 72, 255)
    PELE_E = (96, 88, 48, 255)
    BARRIGA = (214, 200, 150, 255)
    VERRUGA = (180, 150, 80, 255)
    GLANDULA = (196, 170, 60, 255)
    GUELRA = (130, 70, 150, 255)
    GUELRA_C = (180, 120, 200, 255)
    # guelras do WOOPER: três galhinhos de cada lado
    for lado in (-1, 1):
        x0 = 32 + lado * 17
        for k, dy in enumerate((-8, 0, 8)):
            t.linha([(x0, 26 + dy // 2), (x0 + lado * 10, 22 + dy)], GUELRA, 3)
            t.elipse(x0 + lado * 10, 22 + dy, 2, 2, GUELRA_C)
    # corpo largo e achatado
    t.elipse(32, 42, 21, 16, PELE)
    # cabeça (larga, fundida no corpo)
    t.elipse(32, 28, 19, 12, PELE)
    # olhos saltados
    t.elipse(22, 18, 6, 5, PELE)
    t.elipse(42, 18, 6, 5, PELE)
    # patas dobradas
    t.elipse(13, 54, 7, 4, PELE)
    t.elipse(51, 54, 7, 4, PELE)
    t.luz()
    # verrugas
    for x, y in ((14, 34), (50, 34), (18, 44), (47, 45), (12, 42), (52, 40), (20, 52), (44, 52),
                 (26, 22), (38, 22)):
        t.px(x, y, VERRUGA)
        t.px(x + 1, y, PELE_E)
    # dedos
    for x in (8, 12, 16, 48, 52, 56):
        t.linha([(x, 56), (x, 58)], PELE_E, 1)
    if not costas:
        t.elipse(32, 46, 12, 9, BARRIGA)
        # glândulas de veneno atrás dos olhos
        t.elipse(14, 25, 4, 3, GLANDULA)
        t.elipse(50, 25, 4, 3, GLANDULA)
        olho(t, 22, 18, 3, (200, 150, 40, 255))
        t.ret(20, 18, 24, 18, PRETO)
        olho(t, 42, 18, 3, (200, 150, 40, 255))
        t.ret(40, 18, 44, 18, PRETO)
        # o sorrisão do WOOPER
        t.linha([(17, 30), (24, 34), (32, 35), (40, 34), (47, 30)], PRETO, 1)
        t.pxs([(30, 26), (34, 26)], PELE_E)
    else:
        # as glândulas e as verrugas de costas
        t.elipse(20, 26, 5, 3, GLANDULA)
        t.elipse(44, 26, 5, 3, GLANDULA)
        for x, y in ((26, 36), (38, 36), (32, 42), (24, 46), (40, 46), (32, 30)):
            t.elipse(x, y, 1, 1, VERRUGA)
        t.linha([(32, 34), (32, 54)], PELE_E, 1)
    t.contorno()
    return t


# ------------------------------------------------------------ SPINARAK-BRAG
def spinarakbrag(t, costas=False):
    """Caranguejeira: o SPINARAK de chifre na testa e cara desenhada nas
    costas, só que grandão, peludo e escuro, pernas grossas cheias de pelo e
    os olhinhos brilhando no escuro da gruta. INSETO/SOMBRIO."""
    PELO = (70, 52, 46, 255)
    PELO_C = (120, 92, 76, 255)
    PELO_E = (42, 32, 30, 255)
    CHIFRE = (200, 60, 70, 255)
    DESENHO = (220, 200, 110, 255)
    OLHO = (230, 60, 60, 255)
    # pernas: 4 de cada lado, grossas, dobradas no joelho
    for lado in (-1, 1):
        for i, (jx, jy, px, py) in enumerate(((22, 20, 30, 34), (26, 30, 30, 50),
                                              (24, 40, 28, 59), (18, 46, 20, 60))):
            x0 = 32 + lado * 8
            y0 = 34 + i * 3
            t.linha([(x0, y0), (32 + lado * jx, jy + 10), (32 + lado * px, py)], PELO, 4)
    # abdome (atrás, maior) e cefalotórax
    t.elipse(32, 42, 14, 12, PELO)
    t.elipse(32, 28, 11, 9, PELO_C if costas else PELO)
    # quelíceras
    t.elipse(28, 36, 3, 3, PELO_E)
    t.elipse(36, 36, 3, 3, PELO_E)
    # o chifre do SPINARAK
    t.poli([(30, 20), (32, 8), (34, 20)], CHIFRE)
    t.luz()
    # pelinhos nas pernas
    for lado in (-1, 1):
        for jx, jy in ((22, 30), (26, 40), (24, 50), (18, 56)):
            x = 32 + lado * jx
            t.pxs([(x, jy - 2), (x + lado * 2, jy - 1)], PELO_C)
    if not costas:
        # olhinhos (vários, como aranha de verdade), dois grandes
        olho(t, 28, 26, 2, OLHO)
        olho(t, 36, 26, 2, OLHO)
        t.pxs([(25, 23), (39, 23), (30, 22), (34, 22)], OLHO)
        # presas
        t.pxs([(28, 39), (28, 40), (36, 39), (36, 40)], BRANCO)
    else:
        # a cara de desenho nas costas, igual à do SPINARAK
        t.elipse(32, 44, 9, 7, PELO_C)
        t.elipse(28, 42, 2, 2, DESENHO)
        t.elipse(36, 42, 2, 2, DESENHO)
        t.linha([(27, 48), (32, 50), (37, 48)], DESENHO, 1)
        t.linha([(26, 38), (29, 39)], DESENHO, 1)
        t.linha([(38, 38), (35, 39)], DESENHO, 1)
    t.contorno()
    return t


# ------------------------------------------------------------ MAGIKARP-BRAG
def magikarpbrag(t, costas=False):
    """Tainha: o MAGIKARP pulando fora d'água, só que prateado com as listras
    escuras da tainha, o bigode e a boca aberta de sempre, e a cauda de
    garfo. ÁGUA/NORMAL."""
    PRATA = (170, 184, 196, 255)
    PRATA_E = (110, 124, 140, 255)
    DORSO = (80, 100, 120, 255)
    BARRIGA = (228, 232, 236, 255)
    BARBATANA = (140, 150, 160, 255)
    BIGODE = (230, 200, 120, 255)
    LABIO = (230, 160, 150, 255)
    ESPUMA = (220, 240, 255, 255)
    AGUA = (90, 160, 220, 255)
    # respingo embaixo
    # cauda em garfo, à direita
    t.poli([(46, 36), (60, 22), (62, 26), (56, 36), (62, 48), (59, 50)], BARBATANA)
    # corpo arqueado
    t.elipse(28, 36, 21, 14, PRATA)
    # nadadeira do dorso
    t.poli([(18, 24), (26, 12), (36, 16), (38, 24)], BARBATANA)
    # nadadeiras de baixo
    t.poli([(20, 47), (30, 55), (32, 48)], BARBATANA)
    t.poli([(36, 46), (46, 52), (44, 45)], BARBATANA)
    t.luz()
    t.elipse(26, 43, 15, 5, BARRIGA)
    # listras da tainha
    for k, y in enumerate((29, 33, 37)):
        t.linha([(22, y), (47, y + 1 - k)], DORSO if k == 0 else PRATA_E, 1)
    t.linha([(12, 26), (40, 24)], DORSO, 2)
    # escamas
    for x in range(24, 46, 4):
        for y in (31, 35, 39):
            t.px(x + (y // 2) % 2, y, PRATA_E)
    for i, x in enumerate((22, 28, 34)):
        t.linha([(x, 23), (x + 2, 15 + i)], PRATA_E, 1)
    # pingos
    for x, y in ((6, 50), (52, 54), (8, 20), (56, 12)):
        t.pxs([(x, y), (x + 1, y), (x, y + 1)], ESPUMA)
    # o respingo da água de onde ele pulou
    t.anel(30, 66, 22, 6, AGUA, 2)
    for x, y in ((8, 57), (12, 54), (50, 56), (54, 53), (46, 58), (16, 58)):
        t.pxs([(x, y), (x + 1, y)], AGUA)
        t.px(x, y - 1, ESPUMA)
    if not costas:
        # o olhão vazio do MAGIKARP
        t.elipse(15, 30, 5, 5, BRANCO)
        t.elipse(15, 30, 2, 2, PRETO)
        # boca aberta
        t.elipse(8, 39, 4, 4, LABIO)
        t.elipse(8, 39, 2, 2, (120, 40, 50, 255))
        # bigodes
        t.linha([(10, 35), (4, 31), (2, 24)], BIGODE, 1)
        t.linha([(12, 43), (8, 49), (3, 52)], BIGODE, 1)
    else:
        t.linha([(10, 34), (46, 34)], DORSO, 1)
    t.contorno()
    return t


DESENHOS = {
    21101: (pidgeybrag, "pidgeybrag"),
    21102: (rattatabrag, "rattatabrag"),
    21103: (wurmplebrag, "wurmplebrag"),
    21104: (zubatbrag, "zubatbrag"),
    21105: (krabbybrag, "krabbybrag"),
    21106: (shellderbrag, "shellderbrag"),
    21107: (hoppipbrag, "hoppipbrag"),
    21108: (seedotbrag, "seedotbrag"),
    21109: (wooperbrag, "wooperbrag"),
    21110: (spinarakbrag, "spinarakbrag"),
    21111: (magikarpbrag, "magikarpbrag"),
}
