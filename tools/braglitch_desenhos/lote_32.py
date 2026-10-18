"""Lote 32: OS FÓSSEIS DE BRAGLITCH (e o SHINY de cada um, no fim).

Bichos que a terra de Braglitch guardou em pedra e que só o laboratório de
OURO GASTLY sabe reviver (src/data/braglitch.js, `FOSSEIS_BRAG`):

GIGANTINY — o filhote que sai do FÓSSIL DENTE GIGANTE. Cabeção, perninha
curta, rabo grosso e um dente só, grande demais pra boca, espetado pra fora.
SOMBRIO.
GALLINY / GALLIMIRAGE — do FÓSSIL PENUGEM MIRAGEM: o dinossauro-avestruz de
penugem, o mais rápido de Braglitch, que deixa MIRAGENS de si pra trás.
GIGANTEETH — o gigantossauro adulto: o maior caçador que andou por aqui. O
crânio e o lombo viraram placa de aço, e a bocarra é uma fileira de dentes de
metal do tamanho de um braço. AÇO/SOMBRIO.
"""
from PIL import Image

from pixelart import Tela, clarear, escurecer  # noqa: F401

BRANCO = (250, 250, 250, 255)
PRETO = (30, 26, 34, 255)

# o couro escuro da linha
COURO = (72, 64, 96, 255)
COURO_E = (50, 44, 70, 255)
BARRIGA = (172, 160, 184, 255)
BARRIGA_S = (132, 120, 148, 255)
# o metal (dente, placa)
ACO = (196, 204, 218, 255)
ACO_C = (236, 242, 250, 255)
ACO_S = (128, 138, 158, 255)
BOCA = (120, 30, 44, 255)
LINGUA = (200, 70, 90, 255)
VERMELHO = (226, 40, 52, 255)
AMARELO = (250, 204, 60, 255)


def olho(t, cx, cy, r=2, iris=PRETO, brilho=BRANCO):
    t.elipse(cx, cy, r, r, iris)
    t.px(cx - 1, cy - 1, brilho)


def volume(t, cx, cy, rx, ry, cor, sombra=0.30):
    t.elipse(cx, cy, rx, ry, escurecer(cor, sombra))
    t.elipse(cx - max(1, rx // 5), cy - max(1, ry // 4), rx - max(1, rx // 5), ry - max(1, ry // 4), cor)


def dente(t, x, y, w, h, para_baixo=True):
    """Um dente de metal: triângulo com o lado da luz mais claro."""
    if para_baixo:
        t.poli([(x, y), (x + w, y), (x + w // 2, y + h)], ACO)
        t.linha([(x, y), (x + w // 2, y + h)], ACO_C, 1)
    else:
        t.poli([(x, y), (x + w, y), (x + w // 2, y - h)], ACO)
        t.linha([(x, y), (x + w // 2, y - h)], ACO_C, 1)


# ------------------------------------------------------------- GIGANTINY
def gigantiny(t, costas=False):
    """O filhote: cabeça do tamanho do corpo, olho grande e um dente só,
    enorme, saindo da boca fechada — o mesmo dente do fóssil."""
    # rabo grosso, deitado pra trás
    t.poli([(40, 38), (58, 44), (60, 48), (42, 52)], COURO)
    t.poli([(44, 47), (60, 47), (60, 48), (42, 52)], COURO_E)
    # perna de trás
    t.elipse(42, 52, 5, 5, COURO_E)
    t.ret(39, 54, 45, 59, COURO_E)
    # corpinho
    volume(t, 33, 45, 11, 10, COURO, 0.22)
    # perna da frente, curta e grossa
    volume(t, 33, 53, 5, 5, COURO, 0.25)
    t.ret(29, 55, 37, 59, COURO)
    # cabeçona redonda com focinho curto
    volume(t, 26, 25, 14, 12, COURO, 0.18)
    t.elipse(13, 30, 8, 6, COURO)                                    # focinho
    if not costas:
        # barriga e queixo claros
        t.elipse(30, 47, 6, 7, BARRIGA)
        t.elipse(31, 49, 4, 5, BARRIGA_S)
        t.elipse(14, 34, 7, 2, BARRIGA)
    # bracinho
    t.poli([(22, 42), (27, 41), (25, 47), (21, 47)], COURO)
    t.luz()
    # placas de crista na nuca (o aço que ainda vai crescer)
    for x, y in ((32, 14), (37, 16), (41, 21)):
        t.poli([(x - 2, y + 2), (x, y - 3), (x + 2, y + 2)], ACO_S)
        t.px(x, y - 2, ACO)
    if costas:
        for x, y in ((32, 33), (38, 37), (46, 42)):              # listras do lombo
            t.linha([(x, y), (x + 3, y + 4)], COURO_E, 2)
    # garrinhas
    t.pxs([(20, 47), (22, 48), (29, 60), (32, 60), (35, 60), (40, 60), (43, 60)], BRANCO)
    if not costas:
        # boca fechada, num sorriso
        t.linha([(6, 32), (12, 33), (20, 32)], COURO_E, 1)
        t.px(7, 28, COURO_E)                                         # narina
        # O DENTE: um só, grande, descendo da boca por cima do queixo
        t.poli([(12, 32), (18, 32), (15, 42)], ACO)
        t.linha([(12, 32), (15, 42)], ACO_C, 1)
        t.linha([(15, 42), (18, 32)], ACO_S, 1)
        # olhão amarelo de pupila fina
        t.elipse(22, 23, 4, 4, BRANCO)
        t.elipse(22, 23, 3, 3, AMARELO)
        t.ret(22, 20, 22, 26, PRETO)
        t.px(21, 21, BRANCO)
        t.linha([(17, 18), (25, 19)], COURO_E, 1)                    # sobrancelha
    t.contorno()
    return t


# ------------------------------------------------------------ GIGANTEETH
def giganteeth(t, costas=False):
    """O gigantossauro: cabeça baixa e pra frente, a bocarra aberta com duas
    fileiras de dentes de aço, capacete de placa no crânio e escamas de metal
    descendo pelo lombo até o rabo."""
    COURO_M = escurecer(COURO, 0.12)
    # rabo comprido, quase reto, afinando
    t.poli([(40, 22), (62, 15), (63, 18), (46, 36)], COURO)
    t.poli([(44, 30), (63, 17), (63, 18), (46, 36)], COURO_M)
    # perna de trás (a do fundo)
    PF = COURO_E
    t.elipse(45, 38, 6, 7, PF)
    t.poli([(41, 41), (49, 40), (52, 50), (47, 52)], PF)
    t.poli([(47, 49), (52, 50), (50, 58), (46, 58)], PF)
    t.poli([(43, 57), (51, 57), (53, 61), (40, 61)], PF)
    # corpo enorme
    volume(t, 34, 30, 14, 10, COURO, 0.15)
    # pescoço grosso
    t.poli([(14, 20), (26, 16), (30, 30), (20, 34), (14, 28)], COURO)
    # perna da frente: coxa forte, canela, pé de três dedos
    volume(t, 36, 39, 8, 9, COURO, 0.25)
    t.poli([(31, 43), (40, 44), (40, 52), (35, 53)], COURO)
    t.poli([(35, 50), (40, 51), (36, 59), (31, 58)], COURO)
    t.poli([(26, 57), (37, 57), (38, 61), (24, 61)], COURO)
    # bracinho, encolhido (é piada antiga: o braço não chega na boca)
    t.poli([(22, 32), (27, 31), (24, 38), (20, 38)], COURO)
    # A CABEÇA: crânio comprido, maxilar de cima e de baixo, boca aberta
    t.poli([(1, 10), (14, 4), (26, 6), (31, 14), (26, 20), (2, 18)], COURO)   # maxilar de cima
    t.poli([(5, 31), (24, 24), (28, 28), (22, 36), (8, 36)], COURO)           # maxilar de baixo
    t.poli([(2, 18), (26, 20), (24, 24), (5, 31)], BOCA)                      # o fundo da boca
    if not costas:
        t.poli([(10, 27), (22, 23), (20, 26), (11, 29)], LINGUA)
        t.poli([(8, 33), (22, 31), (20, 35), (10, 35)], BARRIGA)              # papada
        t.poli([(24, 36), (40, 36), (34, 39), (24, 39)], BARRIGA)             # peito
        t.linha([(25, 38), (34, 38)], BARRIGA_S, 1)
    t.luz(poupar=(BOCA[:3], LINGUA[:3]))
    # o capacete de aço no crânio, com a borda rebitada
    t.poli([(9, 6), (14, 4), (26, 6), (30, 12), (20, 11), (11, 9)], ACO)
    t.linha([(11, 9), (20, 11), (30, 12)], ACO_S, 1)
    t.linha([(14, 5), (25, 7)], ACO_C, 1)
    t.pxs([(16, 8), (21, 9), (26, 10)], ACO_S)
    # escamas de aço pelo lombo e pelo rabo, maiores na nuca
    for x, y, h in ((28, 13, 6), (33, 18, 6), (39, 19, 5), (45, 19, 4), (51, 17, 3), (56, 15, 2)):
        t.poli([(x - 3, y + 2), (x, y - h), (x + 3, y + 2)], ACO)
        t.linha([(x - 3, y + 2), (x, y - h)], ACO_C, 1)
        t.linha([(x, y - h), (x + 3, y + 2)], ACO_S, 1)
    # OS DENTES: fileira de cima pra baixo, de baixo pra cima; o da frente é o maior
    dente(t, 3, 18, 5, 8)
    for x, y in ((9, 18), (14, 19), (19, 19)):
        dente(t, x, y, 4, 4)
    for x, y in ((8, 30), (13, 28), (18, 26)):
        dente(t, x, y, 4, 4, para_baixo=False)
    # garras
    t.pxs([(19, 38), (21, 39), (23, 39)], ACO_C)
    t.linha([(24, 61), (22, 60)], ACO_C, 1)
    t.pxs([(28, 62), (32, 62), (36, 62), (41, 62), (45, 62), (50, 62)], ACO_C)
    if not costas:
        t.px(4, 11, COURO_E)                                     # narina
        t.elipse(20, 14, 3, 2, PRETO)                            # o buraco do olho
        t.elipse(20, 14, 2, 1, VERMELHO)
        t.px(19, 14, BRANCO)
        t.linha([(15, 11), (24, 12)], escurecer(ACO_S, 0.3), 1)  # o cenho de aço
    else:
        # nas costas, a fileira de escamas continua pelo pescoço
        for x, y in ((18, 16), (23, 13)):
            t.poli([(x - 2, y + 2), (x, y - 3), (x + 2, y + 2)], ACO)
    t.contorno()
    return t


# ------------------------------------------------------- a linha BLINDADA
PELE = (124, 110, 84, 255)
PELE_E = (92, 80, 60, 255)
CREME = (200, 186, 148, 255)
CREME_S = (160, 146, 112, 255)
VERDE_O = (88, 196, 120, 255)
PLACA = (178, 92, 60, 255)               # o miolo de pedra das placas do STEGARMOREX


def placa(t, x, y, h, w=3, cor=None):
    """Uma placa das costas: losango de pedra com a borda de aço."""
    cor = cor or ACO
    t.poli([(x - w, y), (x, y - h), (x + w, y), (x, y + 2)], cor)
    t.linha([(x - w, y), (x, y - h)], ACO_C, 1)
    t.linha([(x, y - h), (x + w, y)], ACO_S, 1)


def blindino(t, costas=False):
    """O filhote do FÓSSIL BLINDADO: bolinha de quatro patas com um capacete
    de aço na testa, três placas pequenas nas costas e um rabinho com dois
    espinhos que ainda não machucam ninguém."""
    # rabinho com os dois espinhos
    t.poli([(44, 40), (58, 38), (58, 42), (46, 47)], PELE)
    t.poli([(53, 38), (55, 31), (57, 38)], ACO)
    t.poli([(56, 38), (60, 32), (60, 40)], ACO)
    # patas de trás (fundo)
    t.ret(40, 48, 46, 57, PELE_E)
    # corpo redondo
    volume(t, 34, 42, 14, 10, PELE, 0.20)
    # patas da frente
    t.ret(24, 48, 30, 57, PELE)
    t.ret(34, 49, 40, 57, PELE)
    # cabeça, baixa e grande
    volume(t, 18, 38, 11, 9, PELE, 0.18)
    if not costas:
        t.elipse(30, 47, 9, 3, CREME)
        t.elipse(14, 44, 7, 3, CREME)
    t.luz()
    # placas das costas
    for x, y, h in ((30, 32, 6), (37, 32, 7), (44, 35, 5)):
        placa(t, x, y, h)
    # O CAPACETE: a placa de aço da testa, com três rebites
    t.poli([(10, 32), (16, 27), (26, 29), (28, 34), (12, 35)], ACO)
    t.linha([(12, 35), (28, 34)], ACO_S, 1)
    t.linha([(16, 28), (25, 30)], ACO_C, 1)
    t.pxs([(15, 32), (20, 31), (25, 32)], ACO_S)
    # unhas
    t.pxs([(25, 58), (28, 58), (35, 58), (38, 58), (41, 58), (44, 58)], CREME)
    if not costas:
        t.elipse(18, 39, 3, 3, BRANCO)                          # olhão
        t.elipse(17, 39, 2, 2, PRETO)
        t.px(16, 38, BRANCO)
        t.px(8, 41, PELE_E)                                     # narina
        t.linha([(9, 44), (15, 45)], PELE_E, 1)                 # boca
    t.contorno()
    return t


def stegarmorex(t, costas=False):
    """O STEGARMOREX: corpo de estegossauro coberto de escudos de armadura,
    as placas das costas viradas lâminas largas de aço, a cauda com quatro
    espinhos — e a cabeça de rex, com mandíbula forte e uma coroa de chifres
    no capacete."""
    # as placas das costas primeiro: o corpo cobre o pé delas
    for x, y, w, h in ((22, 30, 5, 9), (31, 28, 6, 15), (41, 28, 6, 16), (50, 31, 5, 10)):
        t.poli([(x - w, y), (x - w + 2, y - h + 4), (x, y - h), (x + w - 2, y - h + 4), (x + w, y)], ACO)
        t.poli([(x - w + 2, y), (x - w + 3, y - h + 6), (x, y - h + 3), (x + w - 3, y - h + 6), (x + w - 2, y)], PLACA)
        t.linha([(x - w, y), (x - w + 2, y - h + 4), (x, y - h)], ACO_C, 1)
    # cauda com os quatro espinhos (o "thagomizer")
    t.poli([(46, 34), (62, 34), (62, 38), (48, 44)], PELE)
    for x, y, dx in ((55, 34, -2), (60, 34, 2)):
        t.poli([(x - 2, y + 1), (x + dx, y - 7), (x + 2, y + 1)], ACO)
        t.linha([(x - 2, y + 1), (x + dx, y - 7)], ACO_C, 1)
    for x, dx in ((55, -2), (60, 2)):
        t.poli([(x - 2, 37), (x + dx, 44), (x + 2, 37)], ACO_S)
    # patas de trás (fundo)
    t.poli([(44, 44), (52, 44), (51, 59), (45, 59)], PELE_E)
    t.poli([(18, 46), (25, 46), (25, 59), (19, 59)], PELE_E)
    # corpo: a carapaça alta
    volume(t, 35, 38, 17, 11, PELE, 0.18)
    # pescoço grosso e a cabeça de rex, grande, baixa e pra frente
    t.poli([(12, 30), (22, 28), (26, 40), (14, 42)], PELE)
    t.poli([(0, 26), (6, 19), (20, 19), (24, 27), (20, 33), (1, 33)], PELE)     # crânio
    t.poli([(2, 34), (19, 33), (21, 39), (6, 40)], PELE_E)                      # mandíbula
    # patas da frente, colunas grossas
    volume(t, 28, 49, 6, 6, PELE, 0.2)
    t.poli([(23, 50), (33, 50), (32, 60), (24, 60)], PELE)
    volume(t, 41, 49, 6, 6, PELE, 0.2)
    t.poli([(36, 50), (46, 50), (45, 60), (37, 60)], PELE)
    if not costas:
        t.poli([(22, 45), (48, 45), (42, 49), (25, 48)], CREME)                 # barriga
        t.linha([(25, 47), (42, 47)], CREME_S, 1)
    t.luz(poupar=(PLACA[:3],))
    # os escudos de armadura no lombo: três fileiras de escamas de aço
    for y, xs in ((33, (26, 34, 42, 49)), (39, (22, 30, 38, 46))):
        for x in xs:
            t.poli([(x - 2, y), (x, y - 2), (x + 2, y), (x, y + 2)], ACO_S)
            t.px(x, y - 1, ACO_C)
    # o capacete com a coroa de chifres (o "rex")
    t.poli([(4, 21), (8, 18), (20, 19), (23, 25), (8, 24)], ACO)
    t.linha([(8, 19), (19, 20)], ACO_C, 1)
    for x in (9, 14, 19):
        t.poli([(x - 2, 20), (x + 1, 12), (x + 2, 20)], ACO)
        t.px(x + 1, 13, ACO_C)
    # dentes de fora da boca fechada
    for x in (3, 7, 11, 15):
        dente(t, x, 33, 3, 3)
    # unhas
    t.pxs([(24, 61), (28, 61), (31, 61), (38, 61), (41, 61), (44, 61)], CREME)
    if not costas:
        t.elipse(13, 25, 2, 2, PRETO)
        t.px(13, 25, VERDE_O)
        t.px(12, 24, BRANCO)
        t.linha([(9, 22), (17, 23)], ACO_S, 1)                  # cenho
        t.px(2, 27, PELE_E)                                     # narina
    t.contorno()
    return t


# ------------------------------------------------------- a linha MIRAGEM
PENA = (236, 220, 180, 255)          # a penugem cor de areia
PENA_S = (196, 170, 120, 255)
DORSO = (150, 112, 74, 255)          # as penas das costas
LILAS = (186, 132, 236, 255)         # a ponta das penas (o psíquico)
LILAS_C = (226, 196, 255, 255)
BICO = (150, 150, 164, 255)
PERNA = (214, 150, 82, 255)
PERNA_E = (166, 108, 56, 255)
OLHO_M = (236, 70, 170, 255)
MIRAGEM = (190, 150, 255, 255)       # a cópia que fica pra trás (meio transparente)


def miragens(t, desenho, costas, deslocamentos):
    """As MIRAGENS: o mesmo bicho, de uma cor só e meio transparente, ficando
    pra trás. Vai por BAIXO do desenho de verdade."""
    sombra = desenho(Tela(t.lado), costas, sem_miragem=True).img
    for dx, alfa in deslocamentos:
        cor = MIRAGEM[:3] + (alfa,)
        copia = Image.new("RGBA", sombra.size, (0, 0, 0, 0))
        mascara = sombra.split()[3].point(lambda a: 255 if a > 128 else 0)
        copia.paste(Image.new("RGBA", sombra.size, cor), (0, 0), mascara)
        fundo = Image.new("RGBA", sombra.size, (0, 0, 0, 0))
        fundo.paste(copia, (dx, 0))
        t.img.alpha_composite(fundo)


def galliny(t, costas=False, sem_miragem=False):
    """O filhote do FÓSSIL PENUGEM MIRAGEM: bolota de penugem em cima de duas
    pernas compridas demais pra ele, pescoço fino, bico pequeno e um topete
    lilás. Já nasce correndo."""
    base = t
    if not sem_miragem:
        t = Tela(t.lado)
    # perna de trás (fundo), esticada pra trás
    t.linha([(36, 40), (42, 48), (47, 56)], PERNA_E, 3)
    t.linha([(47, 56), (52, 57)], PERNA_E, 2)
    # rabo de penugem
    t.poli([(40, 30), (54, 24), (56, 30), (44, 38)], PENA_S)
    t.poli([(50, 24), (56, 22), (57, 28)], LILAS)
    # corpo de penugem
    volume(t, 34, 34, 11, 9, PENA, 0.18)
    t.elipse(37, 30, 7, 4, DORSO)
    # pescoço e cabeça
    t.poli([(22, 30), (25, 18), (29, 18), (29, 32)], PENA)
    volume(t, 22, 16, 7, 6, PENA, 0.15)
    t.poli([(16, 15), (6, 18), (16, 20)], BICO)
    # perna da frente, pra frente (a passada)
    t.linha([(30, 41), (26, 49), (28, 57)], PERNA, 3)
    t.linha([(23, 58), (31, 58)], PERNA, 2)
    # bracinho de pena
    t.poli([(28, 34), (22, 38), (26, 40), (31, 37)], PENA_S)
    t.luz()
    # topete lilás
    t.poli([(22, 10), (20, 3), (25, 8), (28, 2), (28, 11)], LILAS)
    t.px(25, 5, LILAS_C)
    if not costas:
        t.elipse(21, 15, 2, 2, PRETO)
        t.px(21, 15, OLHO_M)
        t.px(20, 14, BRANCO)
        t.linha([(7, 18), (15, 18)], escurecer(BICO, 0.3), 1)
    t.contorno()
    if sem_miragem:
        return t
    miragens(base, galliny, costas, ((10, 70), (5, 120)))
    base.img.alpha_composite(t.img)
    return base


def gallimirage(t, costas=False, sem_miragem=False):
    """O GALLIMIRAGE em disparada: pescoço comprido esticado pra frente, bico
    reto, corpo de penugem com as penas das costas pontudas de lilás, a cauda
    em leque e as pernas longas no meio da passada. Atrás dele, duas
    MIRAGENS — ele corre tão rápido que a imagem dele fica pra trás."""
    base = t
    if not sem_miragem:
        t = Tela(t.lado)
    # perna de trás (fundo), lá atrás no fim da passada
    t.linha([(38, 36), (44, 44), (52, 50)], PERNA_E, 4)
    t.linha([(52, 50), (58, 52)], PERNA_E, 2)
    t.pxs([(59, 52), (59, 53)], BRANCO)
    # cauda em leque, reta pra trás
    t.poli([(40, 24), (60, 16), (62, 22), (60, 28), (44, 32)], PENA_S)
    for x, y in ((56, 16), (60, 21), (58, 27)):
        t.poli([(x - 4, y), (x + 3, y - 2), (x + 2, y + 3)], LILAS)
    # corpo: compacto, de penugem
    volume(t, 34, 28, 12, 8, PENA, 0.16)
    t.poli([(26, 22), (34, 19), (44, 21), (40, 26), (30, 26)], DORSO)
    # pescoço comprido esticado pra frente e cabeça pequena
    t.poli([(14, 14), (18, 11), (28, 22), (24, 28)], PENA)
    volume(t, 12, 11, 5, 4, PENA, 0.12)
    t.poli([(8, 9), (0, 11), (8, 13)], BICO)
    # perna da frente, esticada lá na frente
    volume(t, 32, 35, 5, 6, PENA_S, 0.2)
    t.linha([(30, 39), (22, 46), (16, 54)], PERNA, 4)
    t.linha([(16, 54), (10, 55)], PERNA, 2)
    # braço de penas, jogado pra trás pelo vento
    t.poli([(28, 29), (36, 33), (42, 38), (34, 36)], PENA_S)
    t.luz()
    # as penas pontudas das costas, de lilás
    for x, y in ((28, 20), (33, 18), (38, 18), (43, 20)):
        t.poli([(x - 2, y + 2), (x + 3, y - 4), (x + 2, y + 2)], LILAS)
        t.px(x + 2, y - 2, LILAS_C)
    # penacho atrás da cabeça
    t.poli([(14, 8), (20, 3), (19, 8), (24, 6), (18, 12)], LILAS)
    t.pxs([(9, 55), (10, 56), (15, 56), (51, 51)], BRANCO)
    if not costas:
        t.elipse(12, 10, 2, 1, PRETO)
        t.px(12, 10, OLHO_M)
        t.px(11, 9, BRANCO)
        t.linha([(1, 11), (7, 11)], escurecer(BICO, 0.3), 1)
        t.linha([(22, 25), (28, 26)], PENA_S, 1)               # garganta
    t.contorno()
    if sem_miragem:
        return t
    miragens(base, gallimirage, costas, ((12, 60), (6, 110)))
    base.img.alpha_composite(t.img)
    return base


# ------------------------------------------------------------------ SHINY
# O shiny é o MESMO desenho com a paleta trocada (o jogo anima o shiny
# trocando, quadro a quadro, as cores do parado pelas do shiny — então o
# traço tem que ser igual, pixel por pixel).
#
# A linha do DENTE GIGANTE fica vermelho neon com o ferro verde-limão
# (#99FF55), a pedido de quem criou. A linha BLINDADA vira rocha vulcânica:
# corpo de carvão, placas de lava e a armadura de cobre.
SHINY_DENTE = {
    "COURO": (255, 28, 64, 255), "COURO_E": (186, 8, 42, 255),
    "BARRIGA": (255, 150, 164, 255), "BARRIGA_S": (230, 96, 120, 255),
    "ACO": (153, 255, 85, 255), "ACO_C": (214, 255, 176, 255), "ACO_S": (92, 196, 40, 255),
}
SHINY_BLINDADO = {
    "PELE": (62, 60, 70, 255), "PELE_E": (40, 38, 46, 255),
    "CREME": (150, 140, 136, 255), "CREME_S": (112, 104, 102, 255),
    "PLACA": (255, 112, 28, 255), "VERDE_O": (255, 220, 40, 255),
    "ACO": (214, 126, 82, 255), "ACO_C": (255, 192, 150, 255), "ACO_S": (150, 78, 46, 255),
}

# A linha MIRAGEM vira fantasma de gelo: penugem branca, costas azul-marinho,
# pontas e miragens verde-água.
SHINY_MIRAGEM = {
    "PENA": (240, 244, 255, 255), "PENA_S": (176, 190, 222, 255), "DORSO": (60, 82, 136, 255),
    "LILAS": (50, 226, 204, 255), "LILAS_C": (196, 255, 246, 255),
    "MIRAGEM": (80, 240, 220, 255), "OLHO_M": (255, 200, 40, 255),
}


def com_paleta(desenho, troca):
    """O desenho com as cores globais trocadas enquanto ele roda."""
    def shiny(t, costas=False, **kw):
        g = globals()
        antes = {k: g[k] for k in troca}
        g.update(troca)
        try:
            return desenho(t, costas, **kw)
        finally:
            g.update(antes)
    return shiny


SHINIES = {
    1095: com_paleta(gigantiny, SHINY_DENTE),
    1096: com_paleta(giganteeth, SHINY_DENTE),
    1097: com_paleta(blindino, SHINY_BLINDADO),
    1098: com_paleta(stegarmorex, SHINY_BLINDADO),
    1099: com_paleta(galliny, SHINY_MIRAGEM),
    1100: com_paleta(gallimirage, SHINY_MIRAGEM),
}


DESENHOS = {
    1095: (gigantiny, "gigantiny"),
    1096: (giganteeth, "giganteeth"),
    1097: (blindino, "blindino"),
    1098: (stegarmorex, "stegarmorex"),
    1099: (galliny, "galliny"),
    1100: (gallimirage, "gallimirage"),
}
