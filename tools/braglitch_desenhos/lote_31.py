"""Lote 31: AS EVOLUÇÕES DA ILHA DO MELTAN.

As formas da Ilha do Mel (lote 20) nasceram como estágio único. Aqui cada uma
cresce do jeito do bicho de lá — a linha do Pokémon de base, mas com o animal
da ilha ficando adulto:

SABIÁ -> PIDGEOTTO-BRAG (sabiá em pé, asa aberta) -> PIDGEOT-BRAG (o sabiá
adulto do farol, crista ferrugem ao vento); PREÁ -> RATICATE-BRAG (a cutia);
TATURANA -> BEAUTIFLY-BRAG (a mariposa-de-flanela); MORCEGO-PESCADOR ->
GOLBAT-BRAG; CARANGUEJO-UÇÁ -> KINGLER-BRAG (a pinça-rei); OSTRA -> CLOYSTER-
BRAG (o banco de ostras); SEMENTE DE PAINEIRA -> SKIPLOOM-BRAG (a flor) ->
JUMPLUFF-BRAG (a paina solta); PINHÃO -> NUZLEAF-BRAG (o broto de araucária)
-> SHIFTRY-BRAG (a araucária); SAPO-CURURU -> QUAGSIRE-BRAG (o cururu velho);
CARANGUEJEIRA -> ARIADOS-BRAG; TAINHA -> GYARADOS-BRAG (o tainhão do mar).

Todos desenhados do zero, com as cores da forma de antes.
"""
import math

from pixelart import Tela, clarear, escurecer  # noqa: F401

BRANCO = (250, 250, 250, 255)
PRETO = (30, 26, 34, 255)


def olho(t, cx, cy, r=2, iris=PRETO, brilho=BRANCO):
    t.elipse(cx, cy, r, r, iris)
    t.px(cx - 1, cy - 1, brilho)


# -------------------------------------------------------- PIDGEOTTO-BRAG
def pidgeottobrag(t, costas=False):
    """O sabiá crescido, em pé no galho: peito ferrugem maior, a asa meio
    aberta e o topete virou duas penas compridas."""
    PARDO = (140, 116, 84, 255)
    PARDO_E = (98, 78, 56, 255)
    LARANJA = (222, 120, 48, 255)
    CREME = (236, 220, 184, 255)
    BICO = (232, 190, 60, 255)
    PE = (196, 150, 120, 255)
    GALHO = (110, 80, 50, 255)
    t.linha([(4, 58), (60, 56)], GALHO, 3)                       # o galho
    t.poli([(36, 44), (58, 50), (62, 58), (54, 60), (34, 52)], PARDO_E)   # rabo
    t.elipse(30, 38, 15, 16, PARDO)                               # corpo
    t.elipse(26, 18, 11, 10, PARDO)                               # cabeça
    t.poli([(26, 10), (40, 0), (36, 8), (48, 4), (38, 14), (30, 13)], PARDO)   # topete
    t.poli([(36, 26), (56, 20), (60, 32), (52, 44), (38, 42)], PARDO_E)        # asa aberta
    if not costas:
        t.elipse(27, 42, 11, 11, LARANJA)
        t.elipse(21, 28, 6, 3, CREME)
    t.luz()
    for x in (24, 32):
        t.linha([(x, 52), (x, 56)], PE, 2)
    for i in range(4):
        t.linha([(40 + i * 4, 26 + i), (44 + i * 4, 40)], escurecer(PARDO_E, 0.25), 1)
    if not costas:
        for x, y in ((18, 27), (21, 28), (24, 27), (20, 30), (23, 30)):
            t.px(x, y, PARDO_E)
        t.poli([(15, 17), (6, 20), (15, 22)], BICO)
        t.linha([(7, 20), (15, 20)], escurecer(BICO, 0.35), 1)
        t.elipse(20, 15, 3, 3, BICO)
        olho(t, 20, 15, 2)
        t.linha([(23, 14), (30, 11)], PRETO, 1)
    else:
        t.linha([(26, 10), (26, 26)], PARDO_E, 1)
        t.linha([(30, 30), (30, 50)], PARDO_E, 1)
    t.contorno()
    return t


# ---------------------------------------------------------- PIDGEOT-BRAG
def pidgeotbrag(t, costas=False):
    """O sabiá adulto do farol: asas abertas em voo, peito ferrugem, e a
    crista do PIDGEOT longa, cor de ferrugem e ouro, voando pra trás."""
    PARDO = (140, 116, 84, 255)
    PARDO_E = (92, 72, 52, 255)
    LARANJA = (222, 120, 48, 255)
    OURO = (244, 176, 64, 255)
    CREME = (236, 220, 184, 255)
    BICO = (232, 190, 60, 255)
    PE = (196, 150, 120, 255)
    # as duas asas abertas
    t.poli([(30, 30), (2, 14), (6, 24), (0, 30), (10, 36), (6, 42), (28, 44)], PARDO_E)
    t.poli([(36, 30), (62, 10), (60, 22), (64, 28), (56, 36), (60, 42), (38, 46)], PARDO_E)
    t.poli([(28, 48), (24, 62), (32, 58), (40, 62), (36, 48)], PARDO_E)   # rabo em leque
    t.elipse(32, 38, 11, 14, PARDO)                              # corpo
    t.elipse(30, 18, 9, 9, PARDO)                                # cabeça
    # a crista comprida, ferrugem por baixo e ouro por cima
    t.poli([(30, 10), (46, 0), (60, 4), (48, 8), (62, 12), (44, 14), (36, 16)], LARANJA)
    t.poli([(34, 10), (48, 3), (56, 5), (44, 9)], OURO)
    if not costas:
        t.elipse(30, 41, 8, 10, LARANJA)
        t.elipse(26, 27, 5, 3, CREME)
    t.luz(poupar=(OURO[:3],))
    for i in range(4):                                           # penas das asas
        t.linha([(26 - i * 5, 32 + i), (10 - i * 2, 22 + i * 4)], escurecer(PARDO_E, 0.3), 1)
        t.linha([(40 + i * 5, 32 + i), (56 + i, 18 + i * 5)], escurecer(PARDO_E, 0.3), 1)
    for x in (28, 35):
        t.linha([(x, 51), (x, 55)], PE, 2)
        t.pxs([(x - 1, 56), (x + 1, 56)], PE)
    if not costas:
        t.poli([(22, 17), (13, 20), (22, 22)], BICO)
        t.linha([(14, 20), (22, 20)], escurecer(BICO, 0.35), 1)
        t.elipse(26, 15, 3, 3, BICO)
        olho(t, 26, 15, 2)
        t.linha([(29, 14), (36, 12)], PRETO, 1)
    else:
        t.linha([(32, 26), (32, 50)], PARDO_E, 1)
    t.contorno()
    return t


# --------------------------------------------------------- RATICATE-BRAG
def raticatebrag(t, costas=False):
    """A CUTIA: o preá cresceu, ficou de pernas compridas e alaranjado, com os
    dentões do RATICATE e uma moita de capim com florzinha no lombo."""
    PELO = (184, 120, 64, 255)
    PELO_E = (130, 82, 44, 255)
    BARRIGA = (230, 204, 160, 255)
    ORELHA = (216, 150, 140, 255)
    CAPIM = (96, 170, 60, 255)
    CAPIM_E = (56, 120, 40, 255)
    FLOR = (250, 220, 90, 255)
    DENTE = (250, 240, 200, 255)
    for x in (22, 30, 42, 50):                                   # pernas finas
        t.linha([(x, 44), (x + 1, 58)], PELO_E, 3)
    t.elipse(36, 38, 18, 11, PELO)                               # corpo
    t.elipse(16, 30, 10, 9, PELO)                                # cabeça
    t.elipse(10, 34, 6, 5, PELO)                                 # focinho
    t.elipse(20, 21, 4, 4, PELO)                                 # orelha
    if not costas:
        t.elipse(32, 44, 13, 5, BARRIGA)
        t.elipse(20, 21, 2, 2, ORELHA)
    # a moita de capim no lombo
    for i, x in enumerate(range(28, 52, 4)):
        t.linha([(x, 30), (x - 2 + (i % 2) * 4, 18 - (i % 3) * 3)], CAPIM if i % 2 else CAPIM_E, 2)
    t.luz(poupar=(CAPIM[:3], CAPIM_E[:3]))
    t.elipse(42, 17, 2, 2, FLOR)
    t.px(42, 17, (240, 140, 60, 255))
    if not costas:
        olho(t, 15, 28, 2)
        t.px(5, 33, PRETO)                                       # nariz
        t.ret(7, 38, 10, 43, DENTE)                              # os dentões
        t.linha([(8, 38), (8, 43)], escurecer(DENTE, 0.3), 1)
        for dy in (-1, 1):
            t.linha([(6, 35 + dy), (0, 33 + dy * 3)], PELO_E, 1)  # bigodes
    else:
        t.linha([(20, 26), (50, 32)], PELO_E, 1)
    t.contorno()
    return t


# -------------------------------------------------------- BEAUTIFLY-BRAG
def beautiflybrag(t, costas=False):
    """A MARIPOSA-DE-FLANELA: a taturana virou mariposa peluda — o corpo
    continua de pelo que queima, laranja e ouro, e as asas são de veludo
    creme com olho de fogo, do jeito das asas do BEAUTIFLY."""
    PELO = (250, 150, 40, 255)
    PELO_C = (255, 220, 90, 255)
    ASA = (232, 210, 170, 255)
    ASA_E = (180, 150, 110, 255)
    FOGO = (230, 80, 40, 255)
    ANTENA = (120, 70, 40, 255)
    # asas (de cima maiores, de baixo menores)
    t.poli([(30, 30), (6, 6), (0, 18), (4, 32), (26, 38)], ASA)
    t.poli([(34, 30), (58, 6), (64, 18), (60, 32), (38, 38)], ASA)
    t.poli([(30, 38), (10, 42), (8, 54), (20, 56), (30, 44)], ASA_E)
    t.poli([(34, 38), (54, 42), (56, 54), (44, 56), (34, 44)], ASA_E)
    t.elipse(32, 36, 6, 14, PELO)                                # corpo peludo
    t.elipse(32, 20, 6, 5, PELO_C)                               # cabeça
    t.luz(poupar=(FOGO[:3],))
    # os olhos de fogo nas asas
    for cx in (14, 50):
        t.elipse(cx, 20, 5, 4, FOGO)
        t.elipse(cx, 20, 2, 2, PELO_C)
    # o pelo arrepiado do corpo
    for y in range(26, 50, 4):
        t.pxs([(25, y), (39, y), (24, y + 1), (40, y + 1)], PELO_C)
    t.linha([(29, 16), (24, 6), (20, 4)], ANTENA, 1)            # antenas plumosas
    t.linha([(35, 16), (40, 6), (44, 4)], ANTENA, 1)
    for x, y in ((22, 6), (24, 8), (42, 6), (40, 8)):
        t.px(x, y, ANTENA)
    if not costas:
        olho(t, 29, 20, 1)
        olho(t, 35, 20, 1)
    t.contorno()
    return t


# ----------------------------------------------------------- GOLBAT-BRAG
def golbatbrag(t, costas=False):
    """O morcego-pescador grande: a bocarra do GOLBAT ocupa o corpo inteiro,
    e os pés compridos levam um peixe maior que o de antes."""
    PELO = (190, 110, 60, 255)
    ASA = (110, 70, 90, 255)
    ASA_C = (160, 110, 140, 255)
    BOCA = (120, 20, 50, 255)
    LINGUA = (220, 100, 120, 255)
    PE = (230, 180, 140, 255)
    PEIXE = (180, 196, 210, 255)
    DENTE = (250, 250, 240, 255)
    t.poli([(24, 22), (0, 4), (4, 16), (0, 28), (8, 30), (6, 40), (24, 36)], ASA)
    t.poli([(40, 22), (64, 4), (60, 16), (64, 28), (56, 30), (58, 40), (40, 36)], ASA)
    for x in (8, 14, 50, 56):
        t.linha([(x, 30), (x + (3 if x < 32 else -3), 10)], ASA_C, 1)
    t.elipse(32, 28, 14, 15, PELO)                               # corpo
    t.poli([(22, 14), (18, 2), (28, 12)], PELO)                  # orelhas
    t.poli([(42, 14), (46, 2), (36, 12)], PELO)
    t.luz()
    if not costas:
        t.elipse(32, 31, 10, 10, BOCA)                           # a bocarra
        t.elipse(32, 36, 5, 4, LINGUA)
        t.pxs([(24, 23), (25, 25), (40, 23), (39, 25)], DENTE)   # presas
        t.pxs([(27, 39), (37, 39)], DENTE)
    # pés com o peixe
    t.linha([(28, 42), (26, 50)], PE, 2)
    t.linha([(36, 42), (38, 50)], PE, 2)
    t.elipse(32, 54, 12, 4, PEIXE)
    t.poli([(44, 54), (52, 49), (52, 59)], PEIXE)
    t.px(23, 53, PRETO)
    t.linha([(26, 50), (24, 53)], PE, 1)
    t.linha([(38, 50), (40, 53)], PE, 1)
    t.contorno()
    return t


# ----------------------------------------------------------- KINGLER-BRAG
def kinglerbrag(t, costas=False):
    """O uçá-rei: uma pinça gigante, como a do KINGLER, a casca roxa de
    mangue e as pernas peludas sujas de lama."""
    CASCA = (96, 80, 130, 255)
    CASCA_C = (140, 120, 170, 255)
    PERNA = (190, 100, 60, 255)
    PERNA_E = (130, 64, 40, 255)
    PINCA = (210, 120, 80, 255)
    PELO = (70, 50, 40, 255)
    LAMA = (98, 76, 52, 255)
    for i, x in enumerate((16, 22, 42, 48)):                      # pernas
        lado = -1 if x < 32 else 1
        t.linha([(x, 44), (x + lado * 6, 52), (x + lado * 8, 60)], PERNA, 3)
        t.pxs([(x + lado * 5, 50), (x + lado * 6, 51)], PELO)
    # a pinça gigante (direita do desenho) e a pequena
    t.linha([(42, 36), (50, 28)], PERNA, 4)
    t.elipse(54, 18, 10, 13, PINCA)
    t.poli([(50, 4), (60, 0), (62, 10), (56, 12)], escurecer(PINCA, 0.15))
    t.linha([(22, 38), (12, 32)], PERNA, 3)
    t.elipse(9, 28, 5, 5, PINCA)
    t.elipse(32, 38, 16, 11, CASCA)                              # casca
    t.luz()
    t.elipse(28, 34, 6, 3, CASCA_C)
    t.linha([(51, 18), (60, 14)], escurecer(PINCA, 0.4), 1)      # boca da pinça
    for x, y in ((18, 46), (30, 48), (44, 46), (24, 30)):
        t.pxs([(x, y), (x + 1, y), (x, y + 1)], LAMA)
    if not costas:
        for cx in (26, 36):                                      # olhos no talo
            t.linha([(cx, 28), (cx, 22)], CASCA, 2)
            t.elipse(cx, 21, 3, 3, (240, 230, 200, 255))
            olho(t, cx, 21, 1)
        t.linha([(28, 42), (36, 42)], PRETO, 1)
    else:
        t.linha([(20, 38), (44, 38)], escurecer(CASCA, 0.3), 1)
    t.contorno()
    return t


# ---------------------------------------------------------- CLOYSTER-BRAG
def cloysterbrag(t, costas=False):
    """O banco de ostras: a concha grande do CLOYSTER, de pedra, coberta de
    ostrinhas e cracas que viraram espinhos, e a cara escura lá dentro com a
    pérola na testa."""
    CONCHA = (150, 146, 130, 255)
    CONCHA_E = (104, 100, 90, 255)
    CONCHA_C = (196, 190, 170, 255)
    NACAR = (230, 220, 236, 255)
    CORPO = (46, 42, 60, 255)
    CRACA = (220, 214, 196, 255)
    PEROLA = (250, 236, 240, 255)
    t.elipse(32, 34, 28, 24, CONCHA)                             # a concha
    for a in range(0, 360, 30):                                  # espinhos de craca
        x = 32 + math.cos(math.radians(a)) * 27
        y = 34 + math.sin(math.radians(a)) * 23
        t.poli([(x - 3, y), (x + math.cos(math.radians(a)) * 7, y + math.sin(math.radians(a)) * 7), (x + 3, y)], CONCHA_E)
    t.luz()
    for r in (22, 16):                                           # as camadas da concha
        t.anel(32, 34, r, r - 3, CONCHA_E, 1)
    if not costas:
        t.elipse(32, 36, 15, 13, NACAR)
        t.elipse(32, 37, 11, 10, CORPO)
        t.elipse(32, 28, 3, 3, PEROLA)                            # a pérola
        t.px(31, 27, BRANCO)
        t.elipse(27, 36, 2, 2, BRANCO)                            # olhos
        t.elipse(37, 36, 2, 2, BRANCO)
        t.linha([(28, 42), (36, 42)], (120, 110, 140, 255), 1)
    for x, y in ((12, 22), (50, 20), (18, 52), (46, 52), (8, 38), (56, 38)):
        t.elipse(x, y, 3, 2, CRACA)                              # as ostrinhas grudadas
        t.px(x, y, CONCHA_E)
    t.contorno()
    return t


# ---------------------------------------------------------- SKIPLOOM-BRAG
def skiploombrag(t, costas=False):
    """A flor da paineira: a semente abriu a flor rosa grande do SKIPLOOM na
    cabeça, e a paina começa a sair pelos lados."""
    SEMENTE = (126, 84, 58, 255)
    SEMENTE_C = (170, 120, 84, 255)
    PAINA = (246, 244, 236, 255)
    FLOR = (236, 120, 170, 255)
    FLOR_E = (190, 70, 120, 255)
    MIOLO = (250, 220, 120, 255)
    CAULE = (90, 150, 70, 255)
    for i in range(5):                                           # as pétalas
        a = math.radians(-90 + (i - 2) * 34)
        t.elipse(32 + math.cos(a) * 12, 16 + math.sin(a) * 9, 7, 6, FLOR)
    t.elipse(32, 16, 6, 5, MIOLO)
    t.linha([(32, 20), (32, 28)], CAULE, 2)
    t.elipse(32, 40, 13, 12, SEMENTE)                            # corpo-semente
    t.elipse(18, 42, 6, 5, PAINA)                                # paina nos lados
    t.elipse(46, 42, 6, 5, PAINA)
    t.luz(poupar=(PAINA[:3], MIOLO[:3]))
    for x in (26, 38):                                           # pezinhos
        t.elipse(x, 53, 3, 2, SEMENTE_C)
    for i in range(5):
        a = math.radians(-90 + (i - 2) * 34)
        t.px(round(32 + math.cos(a) * 15), round(16 + math.sin(a) * 11), FLOR_E)
    if not costas:
        olho(t, 27, 38, 2)
        olho(t, 37, 38, 2)
        t.linha([(30, 45), (34, 45)], escurecer(SEMENTE, 0.5), 1)
        t.elipse(23, 43, 2, 1, FLOR)
        t.elipse(41, 43, 2, 1, FLOR)
    t.contorno()
    return t


# ---------------------------------------------------------- JUMPLUFF-BRAG
def jumpluffbrag(t, costas=False):
    """A paina solta: a paineira jogou a paina toda, e ela virou as três
    bolas de algodão do JUMPLUFF, que levam a semente pelo vento."""
    SEMENTE = (126, 84, 58, 255)
    PAINA = (246, 244, 236, 255)
    PAINA_E = (212, 206, 196, 255)
    FLOR = (236, 120, 170, 255)
    for cx, cy in ((14, 18), (50, 18), (32, 8)):                  # três bolas de paina
        for k in range(6):
            a = math.radians(k * 60)
            t.elipse(cx + math.cos(a) * 5, cy + math.sin(a) * 4, 6, 5, PAINA)
    t.elipse(32, 40, 11, 12, SEMENTE)                            # o corpo
    for x, y in ((20, 26), (44, 26)):                            # bracinhos até a paina
        t.linha([(32 + (x - 32) // 3, 32), (x, y)], SEMENTE, 2)
    t.luz(poupar=(PAINA[:3],))
    for cx, cy in ((14, 18), (50, 18), (32, 8)):
        t.anel(cx, cy, 9, 8, PAINA_E, 1)
        t.elipse(cx, cy, 2, 2, FLOR)                              # a florzinha de cada uma
    t.linha([(32, 52), (32, 58)], PAINA_E, 1)                     # um fio de paina caindo
    t.elipse(32, 60, 2, 2, PAINA)
    if not costas:
        olho(t, 28, 38, 2)
        olho(t, 36, 38, 2)
        t.linha([(30, 44), (34, 44)], escurecer(SEMENTE, 0.5), 1)
        t.elipse(24, 43, 2, 1, FLOR)
        t.elipse(40, 43, 2, 1, FLOR)
    t.contorno()
    return t


# ----------------------------------------------------------- NUZLEAF-BRAG
def nuzleafbrag(t, costas=False):
    """O broto de araucária: o pinhão ficou em pé, de nariz comprido como o
    NUZLEAF, e a grimpa verde brotou na cabeça."""
    CASCA = (150, 62, 50, 255)
    CASCA_E = (104, 40, 36, 255)
    ROSTO = (240, 214, 170, 255)
    FOLHA = (46, 110, 60, 255)
    FOLHA_C = (80, 150, 80, 255)
    for x in (26, 38):                                           # pernas
        t.linha([(x, 48), (x, 58)], CASCA_E, 3)
    t.linha([(20, 34), (10, 42)], CASCA_E, 2)                     # braços
    t.linha([(44, 34), (54, 42)], CASCA_E, 2)
    t.elipse(32, 38, 12, 14, CASCA)                              # corpo
    t.elipse(32, 22, 11, 10, ROSTO if not costas else CASCA)      # rosto
    # a grimpa: folhas pontudas da araucária em leque
    for i in range(5):
        a = math.radians(-150 + i * 30)
        t.linha([(32, 12), (32 + math.cos(a) * 16, 12 + math.sin(a) * 10)], FOLHA, 2)
    t.luz()
    for i in range(5):
        a = math.radians(-150 + i * 30)
        t.px(round(32 + math.cos(a) * 16), round(12 + math.sin(a) * 10), FOLHA_C)
    for y in range(30, 50, 5):                                   # escamas
        t.linha([(24, y), (40, y + 2)], CASCA_E, 1)
    if not costas:
        t.poli([(32, 22), (18, 26), (32, 27)], ROSTO)            # o nariz comprido
        t.linha([(19, 26), (31, 26)], escurecer(ROSTO, 0.3), 1)
        t.linha([(34, 19), (39, 18)], PRETO, 2)                   # olho de lado, bravo
        t.linha([(26, 30), (33, 31)], escurecer(ROSTO, 0.5), 1)
    t.contorno()
    return t


# ----------------------------------------------------------- SHIFTRY-BRAG
def shiftrybrag(t, costas=False):
    """A ARAUCÁRIA: o SHIFTRY com os leques de folha virou o pinheiro-do-
    paraná — os braços são os galhos em taça, de grimpa, e a cabeleira é a
    copa. A casca ficou de pinha, e ele guarda pinhão nos galhos."""
    CASCA = (150, 62, 50, 255)
    CASCA_E = (104, 40, 36, 255)
    ROSTO = (240, 214, 170, 255)
    FOLHA = (46, 110, 60, 255)
    FOLHA_E = (30, 76, 40, 255)
    PINHAO = (180, 90, 60, 255)
    # os galhos-braço em taça, com tufos de grimpa na ponta
    for lado in (-1, 1):
        t.linha([(32 + lado * 8, 36), (32 + lado * 20, 26), (32 + lado * 26, 14)], CASCA_E, 3)
        for k in range(4):
            a = math.radians(-90 + lado * (20 + k * 25))
            t.linha([(32 + lado * 26, 14), (32 + lado * 26 + math.cos(a) * 9, 14 + math.sin(a) * 7)], FOLHA, 2)
    t.elipse(32, 6, 16, 6, FOLHA)                                # a copa
    for x in (24, 40):                                           # pernas de raiz
        t.linha([(x, 50), (x + (x - 32) // 2, 60)], CASCA_E, 3)
    t.elipse(32, 40, 11, 13, CASCA)                              # tronco-corpo
    t.elipse(32, 20, 10, 10, ROSTO if not costas else CASCA)
    t.luz()
    t.elipse(32, 5, 12, 3, FOLHA_E)
    for y in range(32, 52, 4):                                   # escamas da pinha
        for x in (26, 32, 38):
            t.px(x + (y // 4) % 2 * 2, y, CASCA_E)
    for x, y in ((8, 18), (56, 18), (12, 24)):
        t.elipse(x, y, 2, 3, PINHAO)                             # pinhões nos galhos
    if not costas:
        t.poli([(32, 20), (20, 24), (32, 25)], ROSTO)
        t.linha([(21, 24), (31, 24)], escurecer(ROSTO, 0.3), 1)
        t.linha([(33, 16), (39, 15)], PRETO, 2)
        t.linha([(26, 28), (34, 29)], escurecer(ROSTO, 0.5), 1)
    t.contorno()
    return t


# --------------------------------------------------------- QUAGSIRE-BRAG
def quagsirebrag(t, costas=False):
    """O cururu velho: o sapo cresceu de pé e de papo, gordão como o
    QUAGSIRE, o sorriso vazio de sempre e as glândulas de veneno maiores."""
    PELE = (138, 128, 72, 255)
    PELE_E = (96, 88, 48, 255)
    BARRIGA = (214, 200, 150, 255)
    VERRUGA = (180, 150, 80, 255)
    GLANDULA = (196, 170, 60, 255)
    for x in (22, 42):                                           # pernas grossas
        t.elipse(x, 54, 7, 5, PELE_E)
    t.elipse(32, 40, 19, 17, PELE)                               # corpo
    t.elipse(32, 18, 15, 11, PELE)                               # cabeção
    t.elipse(12, 38, 4, 7, PELE)                                 # bracinhos
    t.elipse(52, 38, 4, 7, PELE)
    if not costas:
        t.elipse(32, 44, 13, 11, BARRIGA)
    t.luz()
    for x in (18, 46):                                           # glândulas atrás dos olhos
        t.elipse(x, 16, 4, 3, GLANDULA)
    for x, y in ((24, 30), (40, 32), (20, 44), (44, 46), (30, 8), (38, 10), (14, 26), (50, 28)):
        t.elipse(x, y, 1, 1, VERRUGA)
    if not costas:
        olho(t, 25, 15, 2)
        olho(t, 39, 15, 2)
        t.linha([(20, 23), (26, 26), (38, 26), (44, 23)], PRETO, 1)   # sorrisão
    else:
        t.linha([(32, 10), (32, 52)], PELE_E, 1)
    t.contorno()
    return t


# ----------------------------------------------------------- ARIADOS-BRAG
def ariadosbrag(t, costas=False):
    """A caranguejeira adulta: o ARIADOS de pernas compridas listradas, peluda
    da cabeça ao abdômen, o chifre vermelho e a cara desenhada nas costas."""
    PELO = (70, 52, 46, 255)
    PELO_C = (120, 92, 76, 255)
    PELO_E = (42, 32, 30, 255)
    CHIFRE = (200, 60, 70, 255)
    DESENHO = (220, 200, 110, 255)
    OLHO = (230, 60, 60, 255)
    for i in range(4):                                           # oito pernas
        for lado in (-1, 1):
            x0, y0 = 32 + lado * 8, 34 + i * 3
            t.linha([(x0, y0), (32 + lado * (20 + i * 2), 22 + i * 6), (32 + lado * (28 + i), 46 + i * 4)], PELO, 2)
            t.px(32 + lado * (20 + i * 2), 22 + i * 6, DESENHO)        # a listra do joelho
    t.elipse(32, 44, 15, 12, PELO)                               # abdômen
    t.elipse(32, 28, 10, 8, PELO_C)                              # cabeça
    t.poli([(30, 22), (32, 8), (34, 22)], CHIFRE)                # o chifre
    t.luz(poupar=(CHIFRE[:3],))
    for x, y in ((24, 40), (40, 40), (28, 50), (36, 50)):         # o pelo arrepiado
        t.pxs([(x, y), (x + 1, y - 1)], PELO_E)
    if costas:
        t.elipse(28, 42, 3, 2, DESENHO)                          # a cara nas costas
        t.elipse(36, 42, 3, 2, DESENHO)
        t.linha([(27, 48), (32, 51), (37, 48)], DESENHO, 1)
    else:
        for x, y in ((28, 28), (36, 28), (30, 25), (34, 25)):
            t.elipse(x, y, 1, 1, OLHO)
        t.linha([(28, 33), (30, 35)], PELO_E, 1)                  # as quelíceras
        t.linha([(36, 33), (34, 35)], PELO_E, 1)
    t.contorno()
    return t


# ---------------------------------------------------------- GYARADOS-BRAG
def gyaradosbrag(t, costas=False):
    """O TAINHÃO DO MAR: a tainha que pulou demais virou a serpente do
    GYARADOS — o corpo comprido prateado de escamas, as listras escuras de
    tainha correndo nele, o rabo em garfo e os bigodes dourados."""
    PRATA = (170, 184, 196, 255)
    DORSO = (80, 100, 120, 255)
    BARRIGA = (228, 232, 236, 255)
    BARBATANA = (140, 150, 160, 255)
    BIGODE = (230, 200, 120, 255)
    BOCA = (120, 30, 50, 255)
    DENTE = (250, 250, 240, 255)
    # o corpo em S, de baixo pra cima
    pontos = [(54, 58), (58, 48), (50, 40), (36, 40), (26, 34), (24, 24), (28, 14)]
    t.linha(pontos, PRATA, 13)
    t.poli([(54, 58), (64, 52), (60, 60), (64, 64), (52, 62)], BARBATANA)   # rabo em garfo
    for x, y in ((50, 40), (36, 40), (26, 30)):                   # barbatanas do dorso
        t.poli([(x - 3, y - 5), (x, y - 12), (x + 3, y - 5)], BARBATANA)
    t.elipse(24, 12, 11, 9, PRATA)                                # cabeça
    t.poli([(20, 4), (16, 0), (26, 4)], BARBATANA)                # crista
    t.luz()
    t.linha([(56, 50), (48, 44), (38, 44), (28, 38)], BARRIGA, 3)  # barriga
    t.linha([(52, 38), (36, 36), (28, 30), (27, 22)], DORSO, 2)    # listra de tainha
    t.linha([(56, 46), (46, 42)], DORSO, 1)
    if not costas:
        t.elipse(18, 16, 6, 5, BOCA)                              # bocarra aberta
        t.pxs([(14, 12), (17, 12), (20, 12), (15, 20), (19, 20)], DENTE)
        olho(t, 25, 8, 2, iris=(200, 40, 40, 255))
        t.linha([(14, 16), (6, 12), (2, 4)], BIGODE, 1)           # bigodes dourados
        t.linha([(15, 19), (8, 24), (4, 30)], BIGODE, 1)
    else:
        t.linha([(26, 4), (26, 18)], DORSO, 2)
    t.contorno()
    return t


DESENHOS = {
    21151: (pidgeottobrag, "pidgeottobrag"),
    21152: (pidgeotbrag, "pidgeotbrag"),
    21153: (raticatebrag, "raticatebrag"),
    21154: (beautiflybrag, "beautiflybrag"),
    21155: (golbatbrag, "golbatbrag"),
    21156: (kinglerbrag, "kinglerbrag"),
    21157: (cloysterbrag, "cloysterbrag"),
    21158: (skiploombrag, "skiploombrag"),
    21159: (jumpluffbrag, "jumpluffbrag"),
    21160: (nuzleafbrag, "nuzleafbrag"),
    21161: (shiftrybrag, "shiftrybrag"),
    21162: (quagsirebrag, "quagsirebrag"),
    21163: (ariadosbrag, "ariadosbrag"),
    21164: (gyaradosbrag, "gyaradosbrag"),
}
