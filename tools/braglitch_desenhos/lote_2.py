"""LOTE 2 — FAUNA DO BRASIL: capivara, tucano, tatu, macaco capoeirista, arara
elétrica e o lobo-guará que vira lobisomem. Todos olhando pra esquerda, como
sprite de frente de GBA; as costas são a mesma pose sem o rosto."""
from pixelart import Tela, clarear, escurecer  # noqa: F401

BRANCO = (250, 250, 250, 255)
PRETO = (30, 26, 34, 255)


def olho(t, cx, cy, r=2, iris=PRETO, brilho=BRANCO):
    t.elipse(cx, cy, r, r, iris)
    t.px(cx - 1, cy - 1, brilho)


# ------------------------------------------------------------ CAPIVARINHA
def capivarinha(t, costas=False):
    """Filhote de capivara de quatro, cabeçona quadrada e olhinho de sono, com
    uma florzinha de ipê no cocuruto. NORMAL/ÁGUA."""
    pelo = (170, 102, 64, 255)
    pelo_e = (120, 70, 46, 255)
    focinho = (92, 56, 40, 255)
    flor = (250, 206, 50, 255)
    miolo = (200, 100, 30, 255)
    agua = (110, 180, 230, 255)

    t.elipse(36, 47, 15, 10, pelo)                 # corpo roliço
    for x in (26, 33, 41, 47):                     # patinhas curtas
        t.ret(x - 2, 52, x + 2, 59, pelo_e if x in (33, 47) else pelo)
    t.poli([(14, 34), (28, 30), (32, 36), (32, 48), (14, 50), (11, 44)], pelo)   # cabeça quadrada
    t.ret(10, 41, 18, 50, pelo)                    # o focinho reto
    t.elipse(26, 31, 3, 2, pelo_e)                 # orelhinha

    t.luz()

    t.ret(10, 43, 14, 49, focinho)                 # ponta do focinho escura
    t.pxs([(11, 44), (13, 44)], PRETO)             # narinas
    t.pxs([(28, 47), (27, 48)], pelo_e)
    # gotinhas d'água nas costas
    t.pxs([(44, 40), (45, 41), (48, 42)], agua)
    if not costas:
        t.ret(19, 38, 22, 39, PRETO)               # olho calmo, meio fechado
        t.px(20, 40, PRETO)
        t.linha([(12, 50), (17, 50)], PRETO, 1)    # boca
    # florzinha de ipê
    t.elipse(22, 28, 3, 3, flor)
    t.pxs([(19, 26), (25, 26), (19, 30), (25, 30)], flor)
    t.px(22, 28, miolo)
    t.contorno()
    return t


# -------------------------------------------------------------- CAPIVARÃO
def capivarao(t, costas=False):
    """Capivara adulta sentada, grande feito um sofá e calma feito domingo, com
    um bem-te-vi pousado no lombo. NORMAL/ÁGUA."""
    pelo = (156, 94, 60, 255)
    pelo_e = (110, 64, 42, 255)
    focinho = (84, 52, 38, 255)
    bemtevi = (250, 214, 60, 255)
    bemtevi_c = (110, 84, 60, 255)

    t.elipse(36, 44, 20, 16, pelo)                 # o corpão sentado
    t.elipse(44, 55, 12, 6, pelo_e)                # a coxa traseira no chão
    t.ret(22, 48, 27, 60, pelo)                    # pata da frente
    t.ret(30, 50, 35, 60, pelo_e)
    t.poli([(10, 22), (26, 16), (32, 22), (32, 38), (20, 42), (8, 36)], pelo)  # cabeça
    t.ret(6, 26, 16, 38, pelo)                     # focinho largo
    t.elipse(26, 17, 3, 3, pelo_e)                 # orelha

    t.luz()

    t.ret(6, 28, 11, 37, focinho)
    t.pxs([(7, 29), (7, 31)], PRETO)
    t.ret(22, 60, 27, 60, pelo_e)
    t.ret(30, 60, 35, 60, focinho)
    t.linha([(28, 50), (28, 60)], focinho, 1)     # o vão entre as patas da frente
    t.linha([(21, 48), (21, 60)], pelo_e, 1)
    if not costas:
        t.ret(16, 24, 20, 25, PRETO)               # olho sereno
        t.pxs([(17, 26), (18, 26)], PRETO)
        t.linha([(8, 38), (14, 38)], PRETO, 1)
    else:
        t.elipse(24, 26, 7, 7, pelo)               # nuca
    # o bem-te-vi no lombo
    t.elipse(46, 25, 4, 3, bemtevi)
    t.elipse(49, 22, 3, 3, bemtevi_c)
    t.ret(47, 21, 51, 21, BRANCO)
    t.poli([(42, 25), (38, 28), (43, 27)], bemtevi_c)   # rabinho
    t.pxs([(52, 22), (53, 22)], PRETO)                   # bico
    t.px(50, 22, PRETO)
    t.contorno()
    return t


# -------------------------------------------------------------- BIQUINHO
def biquinho(t, costas=False):
    """Filhote de tucano: uma bolinha preta de peito amarelo carregando um bico
    laranja que ainda é grande demais pra ele. NORMAL/VOADOR."""
    preto = (44, 40, 52, 255)
    peito = (252, 236, 180, 255)
    amarelo = (252, 206, 60, 255)
    bico = (248, 140, 36, 255)
    bico_c = (255, 196, 90, 255)
    azul = (90, 170, 230, 255)
    pe = (90, 140, 200, 255)
    vermelho = (220, 50, 50, 255)

    t.elipse(34, 45, 13, 13, preto)                # corpinho
    t.poli([(44, 50), (52, 56), (46, 57)], preto)  # rabinho
    t.ret(28, 56, 30, 60, pe)
    t.ret(36, 56, 38, 60, pe)
    t.elipse(27, 45, 7, 8, peito)                  # peito
    t.elipse(26, 38, 6, 3, amarelo)                # papo amarelo
    t.poli([(24, 34), (8, 38), (6, 44), (12, 44), (24, 41)], bico)   # o bico enorme

    t.luz(poupar=(bico[:3],))

    t.linha([(10, 38), (22, 35)], bico_c, 1)       # brilho de cima do bico
    t.px(7, 43, PRETO)
    t.ret(28, 52, 34, 53, vermelho)                # o vermelho de baixo
    t.linha([(38, 42), (42, 48)], escurecer(preto, 0.4), 1)  # asinha
    if not costas:
        t.elipse(29, 36, 3, 3, azul)               # anel azul do olho
        olho(t, 29, 36, 1)
        t.px(29, 36, PRETO)
        t.px(28, 35, BRANCO)
    t.contorno()
    return t


# -------------------------------------------------------------- TUCANAÇU
def tucanacu(t, costas=False):
    """Tucano-toco adulto de asa aberta, peito branco e o bicão laranja com a
    ponta preta que atravessa meia tela. NORMAL/VOADOR."""
    preto = (40, 36, 48, 255)
    branco = (246, 242, 232, 255)
    bico = (250, 136, 30, 255)
    bico_c = (255, 190, 80, 255)
    ponta = (36, 30, 34, 255)
    azul = (80, 160, 230, 255)
    vermelho = (220, 44, 44, 255)
    pe = (80, 120, 190, 255)

    # asas abertas
    t.poli([(34, 30), (50, 12), (60, 14), (62, 22), (56, 30), (48, 40)], preto)
    t.poli([(34, 30), (26, 12), (16, 4), (10, 8), (14, 18), (26, 36)], preto)
    t.elipse(36, 40, 11, 14, preto)                # corpo
    t.poli([(34, 52), (40, 62), (46, 62), (44, 50)], preto)   # cauda
    t.ret(32, 53, 34, 59, pe)
    t.elipse(30, 36, 7, 8, branco)                 # papo branco
    t.elipse(33, 26, 7, 6, preto)                  # cabeça
    t.poli([(28, 22), (8, 26), (2, 32), (8, 34), (28, 31)], bico)   # bicão
    t.poli([(2, 32), (8, 26), (9, 34)], ponta)     # ponta preta

    t.luz(poupar=(bico[:3], ponta[:3]))

    t.linha([(10, 26), (26, 23)], bico_c, 1)
    t.linha([(10, 32), (27, 30)], escurecer(bico, 0.2), 1)
    t.ret(33, 47, 40, 49, vermelho)
    for x in range(50, 61, 4):                     # penas das pontas
        t.linha([(x, 16), (x - 4, 28)], escurecer(preto, 0.4), 1)
    for x in range(12, 23, 4):
        t.linha([(x, 8), (x + 8, 22)], escurecer(preto, 0.4), 1)
    if not costas:
        t.elipse(33, 25, 3, 3, azul)
        t.px(33, 25, PRETO)
        t.px(32, 24, BRANCO)
    t.contorno()
    return t


# -------------------------------------------------------------- TATUBOLA
def tatubola(t, costas=False):
    """Tatu-bola meio enrolado: um domo de placas bege com a cabecinha de
    escudo e as orelhinhas espiando pela frente. TERRA."""
    casca = (196, 176, 136, 255)
    casca_e = (140, 120, 90, 255)
    pele = (220, 190, 170, 255)
    cabeca = (160, 126, 100, 255)

    t.elipse(34, 44, 19, 16, casca)                # o domo
    t.ret(15, 44, 53, 58, casca)
    t.ret(20, 56, 25, 60, pele)                    # patinhas
    t.ret(42, 56, 47, 60, pele)
    t.poli([(20, 36), (10, 40), (8, 50), (14, 54), (22, 50)], cabeca)   # cabecinha de escudo
    t.poli([(14, 36), (12, 30), (17, 34)], pele)   # orelhinhas
    t.poli([(19, 35), (19, 29), (22, 34)], pele)
    t.poli([(52, 50), (58, 54), (52, 56)], cabeca) # rabo curto

    t.luz()

    for x in (24, 31, 38, 45):                     # as cintas da carapaça
        t.linha([(x, 30 if 28 < x < 42 else 33), (x, 57)], casca_e, 1)
    for y in (40, 48):                             # e as placas miúdas
        for x in range(19, 52, 4):
            t.px(x, y, casca_e)
    t.linha([(11, 44), (19, 42)], casca_e, 1)
    if not costas:
        olho(t, 15, 45, 1)
        t.px(9, 51, PRETO)                         # nariz
    t.contorno()
    return t


# -------------------------------------------------------------- TATURRÃO
def taturrao(t, costas=False):
    """Tatu-canastra blindado de aço: placas metálicas rebitadas, cauda de
    lança e duas garras de cavar do tamanho da cabeça. TERRA/AÇO."""
    aco = (150, 162, 180, 255)
    aco_e = (96, 106, 124, 255)
    aco_c = (212, 222, 236, 255)
    pele = (170, 140, 120, 255)
    garra = (236, 226, 200, 255)
    cabeca = (122, 132, 150, 255)

    t.elipse(36, 38, 22, 17, aco)                  # a carapaça
    t.ret(14, 38, 58, 50, aco)
    t.poli([(56, 44), (63, 56), (54, 50)], aco_e)  # cauda de lança
    t.ret(44, 48, 52, 58, pele)                    # pata de trás
    t.poli([(16, 30), (4, 36), (2, 44), (10, 46), (20, 42)], cabeca)   # cabeça
    t.poli([(14, 30), (12, 22), (18, 29)], pele)   # orelha
    t.ret(16, 46, 28, 56, pele)                    # braço grosso

    t.luz()

    for x in (22, 29, 36, 43, 50):                 # cintas de aço
        t.linha([(x, 24 if 26 < x < 48 else 28), (x, 50)], aco_e, 1)
        t.px(x + 3, 30, aco_c)                     # rebites
        t.px(x + 3, 44, aco_c)
    t.linha([(15, 50), (57, 50)], aco_e, 1)        # barra da armadura
    t.linha([(20, 22), (50, 22)], aco_c, 1)        # brilho de metal
    # as garras de cavar
    for i, x in enumerate((10, 15, 20)):
        t.poli([(x + 6, 55), (x, 62), (x + 3, 62), (x + 9, 56)], garra)
    t.poli([(42, 58), (40, 62), (46, 62)], garra)
    if not costas:
        olho(t, 11, 37, 1, (240, 70, 50, 255))
        t.px(11, 37, PRETO)
        t.px(3, 43, PRETO)
    t.contorno()
    return t


# ------------------------------------------------------------ MACACOEIRA
def macacoeira(t, costas=False):
    """Macaco-prego capoeirista na ginga: perna pra trás, braço guardando o
    rosto, topetinho escuro e a corda crua amarrada na cintura. LUTADOR."""
    pelo = (140, 92, 56, 255)
    pelo_e = (86, 56, 38, 255)
    cara = (232, 196, 150, 255)
    corda = (238, 232, 210, 255)
    corda_e = (170, 160, 130, 255)

    t.elipse(31, 38, 8, 9, pelo)                   # tronco
    t.poli([(26, 44), (18, 52), (14, 60), (20, 60), (24, 54), (32, 46)], pelo)   # perna da frente
    t.poli([(34, 44), (44, 52), (50, 58), (53, 56), (46, 48), (37, 42)], pelo)   # perna de trás
    t.poli([(25, 34), (18, 30), (16, 24), (19, 23), (22, 28), (29, 32)], pelo)   # braço guardando
    t.poli([(37, 34), (46, 36), (52, 32), (53, 35), (46, 40), (36, 38)], pelo)   # braço aberto
    t.linha([(38, 46), (46, 42), (52, 34), (54, 26), (52, 22)], pelo_e, 2)       # rabo
    t.elipse(28, 22, 8, 7, pelo)                   # cabeça
    t.elipse(21, 21, 3, 3, cara)                   # orelha
    t.elipse(35, 21, 3, 3, pelo)

    t.luz()

    t.elipse(27, 24, 5, 5, cara)                   # a carinha clara
    t.ret(24, 15, 32, 17, pelo_e)                  # o topetinho de prego
    t.pxs([(26, 14), (30, 14)], pelo_e)
    t.ret(24, 44, 38, 45, corda)                   # a corda
    t.pxs([(35, 46), (36, 47), (37, 48), (38, 49)], corda)
    t.pxs([(26, 44), (30, 44), (34, 44)], corda_e)
    t.ret(13, 59, 19, 60, pelo_e)                  # pés
    t.ret(50, 55, 53, 57, pelo_e)
    if not costas:
        olho(t, 25, 23, 1)
        olho(t, 30, 23, 1)
        t.linha([(26, 27), (29, 27)], pelo_e, 1)
    else:
        t.elipse(28, 22, 7, 6, pelo)
        t.ret(24, 15, 32, 17, pelo_e)
    t.contorno()
    return t


# ---------------------------------------------------------------- GINGÃO
def gingao(t, costas=False):
    """Macaco-prego adulto no meio da meia-lua de compasso: mão no chão, perna
    varrendo o ar lá em cima, braços compridos e a corda colorida de mestre.
    LUTADOR/NORMAL."""
    pelo = (126, 80, 48, 255)
    pelo_e = (78, 50, 34, 255)
    cara = (230, 190, 140, 255)
    faixa = ((230, 50, 50, 255), (250, 210, 50, 255), (60, 170, 80, 255))

    t.elipse(30, 36, 10, 11, pelo)                 # tronco inclinado
    t.poli([(26, 42), (22, 50), (20, 60), (27, 60), (28, 50), (34, 44)], pelo)   # perna de apoio
    t.poli([(34, 30), (42, 18), (50, 8), (57, 2), (62, 7), (56, 14), (48, 26), (42, 38)], pelo)
    t.elipse(40, 30, 5, 6, pelo)                   # a coxa  # perna no alto
    t.poli([(24, 38), (16, 46), (10, 56), (14, 58), (20, 50), (28, 44)], pelo)   # braço no chão
    t.poli([(34, 28), (42, 34), (52, 38), (52, 42), (40, 40), (32, 34)], pelo)   # braço de guarda
    t.linha([(38, 44), (46, 50), (54, 50), (58, 44)], pelo_e, 2)                 # rabo
    t.elipse(22, 24, 9, 8, pelo)                   # cabeça
    t.elipse(14, 22, 3, 3, cara)                   # orelhas
    t.elipse(30, 20, 3, 3, pelo)

    t.luz()

    t.elipse(21, 26, 6, 5, cara)
    t.ret(17, 16, 27, 18, pelo_e)                  # topete
    t.pxs([(18, 15), (22, 14), (26, 15)], pelo_e)
    for i, c in enumerate(faixa):                  # a corda colorida de mestre
        t.linha([(22, 40 + i), (38, 40 + i)], c, 1)
    t.linha([(26, 43), (24, 48)], faixa[0], 1)
    t.linha([(28, 43), (28, 49)], faixa[2], 1)
    t.ret(9, 56, 15, 58, pelo_e)                   # a mão no chão
    t.ret(19, 59, 28, 60, pelo_e)
    t.ret(57, 3, 61, 7, pelo_e)                    # o pé lá em cima
    for x, y in ((50, 2), (46, 5), (42, 10)):      # o risco do chute
        t.px(x, y, BRANCO)
    if not costas:
        olho(t, 18, 25, 1)
        olho(t, 24, 25, 1)
        t.linha([(19, 29), (23, 29)], PRETO, 1)
    else:
        t.elipse(22, 24, 8, 7, pelo)
        t.ret(17, 16, 27, 18, pelo_e)
    t.contorno()
    return t


# -------------------------------------------------------------- ARARAIO
def araraio(t, costas=False):
    """Arara-azul de asa aberta com as pontas das penas amarelas feito fio
    desencapado e raios pulando das asas; bico preto curvo e o anel amarelo
    do olho. ELÉTRICO/VOADOR."""
    azul = (40, 84, 196, 255)
    azul_c = (100, 150, 240, 255)
    amarelo = (252, 222, 50, 255)
    raio = (255, 250, 150, 255)
    bico = (54, 50, 64, 255)
    bico_c = (120, 116, 134, 255)
    pe = (90, 90, 100, 255)

    # asas de ponta serrilhada: a asa inteira em amarelo e, por cima, a mesma
    # asa encolhida pra base em azul — sobra a beirada das penas acesa
    dir_ = [(36, 28), (44, 14), (51, 5), (54, 9), (58, 8), (57, 14), (62, 15),
            (59, 20), (63, 24), (57, 26), (59, 31), (50, 33), (42, 38)]
    esq = [(64 - x - 1, y) for x, y in dir_]
    for asa, (bx, by) in ((dir_, (38, 34)), (esq, (25, 34))):
        t.poli(asa, amarelo)
        t.poli([(bx + (x - bx) * 0.8, by + (y - by) * 0.8) for x, y in asa], azul)
    t.elipse(31, 38, 10, 12, azul)                 # corpo
    t.poli([(27, 48), (25, 62), (31, 57), (37, 62), (36, 48)], azul)   # cauda comprida
    t.ret(26, 49, 28, 52, pe)
    t.ret(34, 49, 36, 52, pe)
    t.elipse(30, 23, 8, 7, azul)                   # cabeça
    t.poli([(24, 17), (18, 17), (14, 20), (13, 25), (14, 31), (16, 31), (17, 26), (20, 25), (24, 25)], bico)  # bico curvo
    t.poli([(18, 26), (20, 31), (25, 30), (25, 26)], bico)                           # mandíbula

    t.luz(poupar=(bico[:3], amarelo[:3]))

    t.linha([(17, 19), (22, 19)], bico_c, 1)
    t.px(15, 22, bico_c)
    t.linha([(25, 26), (25, 30)], amarelo, 1)       # a faixa amarela do bico
    for a, b in (((44, 22), (54, 16)), ((46, 28), (56, 24)), ((19, 22), (9, 16)), ((17, 28), (7, 24))):
        t.linha([a, b], azul_c, 1)                   # penas
    t.pxs([(25, 61), (31, 57), (37, 61)], amarelo)
    t.elipse(31, 40, 5, 6, azul_c)                 # peito
    # raios
    t.linha([(62, 32), (59, 35), (62, 37), (58, 41)], raio, 1)
    t.linha([(1, 32), (4, 35), (1, 37), (5, 41)], raio, 1)
    t.linha([(56, 1), (58, 3), (55, 4), (57, 6)], raio, 1)
    t.linha([(7, 1), (5, 3), (8, 4), (6, 6)], raio, 1)
    if not costas:
        t.elipse(28, 21, 2, 2, amarelo)            # o anel amarelo do olho
        t.px(28, 21, PRETO)
        t.px(27, 21, PRETO)
    t.contorno()
    return t


# ------------------------------------------------------------ LOBISOMEM
def lobisomem(t, costas=False):
    """Lobo-guará de pé nas pernas de pau, crina preta arrepiada, garras
    abertas e olho amarelo de noite de lua cheia. SOMBRIO/LUTADOR."""
    laranja = (214, 104, 42, 255)
    laranja_c = (240, 150, 80, 255)
    preto = (44, 34, 40, 255)
    branco = (240, 228, 210, 255)
    olho_am = (255, 222, 40, 255)
    sombra = (110, 70, 160, 255)

    t.poli([(26, 44), (22, 54), (20, 62), (26, 62), (28, 52), (32, 46)], preto)  # perna longa
    t.poli([(36, 44), (40, 54), (42, 62), (48, 62), (44, 52), (40, 44)], preto)
    t.elipse(33, 36, 10, 12, laranja)              # tronco
    t.poli([(40, 44), (50, 48), (56, 44), (54, 50), (44, 52)], laranja)  # rabo
    t.ret(52, 44, 57, 48, branco)                  # ponta branca do rabo
    t.poli([(25, 29), (16, 35), (9, 41), (13, 45), (20, 41), (29, 37)], preto)   # braços com garra
    t.poli([(40, 29), (48, 35), (55, 39), (52, 44), (44, 41), (37, 37)], preto)
    t.poli([(26, 28), (30, 18), (36, 16), (42, 22), (42, 32), (34, 30)], preto)   # a crina
    t.elipse(26, 18, 7, 6, laranja)                # cabeça
    t.poli([(20, 18), (10, 22), (10, 25), (22, 24)], laranja)   # focinho comprido
    t.poli([(22, 13), (19, 2), (26, 10)], laranja)  # orelhonas
    t.poli([(28, 12), (31, 1), (33, 12)], laranja)

    t.luz()

    t.ret(9, 22, 11, 24, preto)                    # nariz / focinho preto
    t.ret(12, 24, 20, 25, preto)
    t.pxs([(21, 5), (22, 8), (30, 5), (31, 8)], branco)   # dentro das orelhas
    t.elipse(33, 40, 4, 5, laranja_c)              # barriga
    for x, y in ((9, 42), (11, 45), (55, 40), (53, 44)):  # garras
        t.px(x, y, branco)
    t.pxs([(32, 18), (36, 20), (40, 24)], escurecer(preto, 0.4))
    if not costas:
        t.ret(20, 15, 24, 17, olho_am)             # olho bravo, aceso
        t.px(22, 16, PRETO)
        t.linha([(20, 14), (25, 16)], PRETO, 1)    # sobrancelha brava
        t.pxs([(14, 26), (16, 26)], branco)        # presas
    else:
        t.elipse(27, 17, 6, 5, laranja)
    for x, y in ((6, 10), (56, 12), (4, 50), (58, 30), (50, 4)):   # a escuridão em volta
        t.px(x, y, sombra)
    t.contorno()
    return t


DESENHOS = {
    1039: (capivarinha, "capivarinha"),
    1040: (capivarao, "capivarao"),
    1041: (biquinho, "biquinho"),
    1042: (tucanacu, "tucanacu"),
    1043: (tatubola, "tatubola"),
    1044: (taturrao, "taturrao"),
    1058: (macacoeira, "macacoeira"),
    1059: (gingao, "gingao"),
    1075: (araraio, "araraio"),
    1069: (lobisomem, "lobisomem"),
}
