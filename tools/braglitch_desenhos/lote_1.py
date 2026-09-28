"""LOTE 1: as evoluções dos três iniciais de Braglitch.

TRONKY -> TRONCUDO -> PAUBRASILISCO, DIGGLE -> BRASEAGLE -> MAGMASTIM,
TILAPISH -> TILAPISCO -> TILAPIRAÇU. Mesma paleta das formas base.
"""
from pixelart import Tela, clarear, escurecer  # noqa: F401

BRANCO = (250, 250, 250, 255)
PRETO = (30, 26, 34, 255)

# paleta do pau-brasil (TRONKY)
CASCA = (78, 56, 48, 255)
CASCA_E = (52, 36, 34, 255)
CERNE = (196, 40, 44, 255)
CERNE_C = (244, 96, 70, 255)
FOLHA = (40, 92, 58, 255)
FOLHA_E = (22, 58, 40, 255)
FLOR = (252, 214, 48, 255)
OLHO_PB = (255, 200, 60, 255)

# paleta do beagle (DIGGLE)
CARAMELO = (206, 140, 70, 255)
MARROM = (120, 72, 40, 255)
CREME = (246, 232, 204, 255)
BRASA = (255, 120, 40, 255)
BRASA_C = (255, 214, 90, 255)
TERRA = (138, 98, 60, 255)

# paleta da tilápia (TILAPISH)
PRATA = (164, 178, 190, 255)
PRATA_E = (110, 124, 140, 255)
LISTRA = (90, 102, 120, 255)
BARB = (226, 96, 88, 255)
BARB_C = (250, 170, 140, 255)
BEICO = (214, 150, 150, 255)
OLHO_V = (220, 60, 50, 255)


def olho(t, cx, cy, r=3, iris=PRETO, brilho=BRANCO):
    t.elipse(cx, cy, r, r, iris)
    t.px(cx - 1, cy - 1, brilho)


def flor(t, cx, cy, grande=False):
    """Florzinha amarela de miolo vermelho do pau-brasil."""
    t.pxs([(cx, cy - 1), (cx - 1, cy), (cx + 1, cy), (cx, cy + 1)], FLOR)
    if grande:
        t.pxs([(cx - 1, cy - 1), (cx + 1, cy - 1), (cx - 1, cy + 1), (cx + 1, cy + 1)], FLOR)
    t.px(cx, cy, CERNE)


def chama(t, x, y, alto, largo=3):
    """Labareda em pé com a base em (x, y)."""
    t.poli([(x - largo, y), (x - 1, y - alto), (x + 1, y - alto // 2), (x + largo, y)], BRASA)
    t.poli([(x - largo + 2, y), (x, y - alto // 2 - 1), (x + largo - 1, y)], BRASA_C)


# -------------------------------------------------------------- TRONCUDO
def troncudo(t, costas=False):
    """Pau-brasil jovem: tronco grosso de casca rachada com o cerne vermelho à
    mostra, copa escura e cheia de flores, braços-galho fortes. PLANTA/SOMBRIO."""
    t.poli([(19, 26), (45, 26), (47, 54), (17, 54)], CASCA)                      # tronco
    t.poli([(17, 52), (8, 61), (20, 60), (27, 57), (32, 61), (37, 57), (44, 60), (56, 61), (47, 52)], CASCA_E)
    t.poli([(20, 32), (7, 26), (3, 30), (6, 34), (20, 42)], CASCA)                 # braço esquerdo
    t.poli([(7, 27), (2, 20), (5, 19), (10, 27)], CASCA)                          # graveto do braço
    t.poli([(44, 32), (57, 26), (61, 30), (58, 34), (44, 42)], CASCA)
    t.poli([(57, 27), (62, 20), (59, 19), (54, 27)], CASCA)
    for cx, cy, r in ((32, 15, 17), (15, 19, 10), (49, 19, 10), (32, 5, 10), (22, 9, 8), (42, 9, 8)):
        t.elipse(cx, cy, r, r - 3, FOLHA)
    for cx, cy, r in ((23, 20, 6), (41, 20, 6), (32, 11, 6), (13, 21, 4), (51, 21, 4)):
        t.elipse(cx, cy, r, r - 1, FOLHA_E)

    t.luz()

    for pts in (((22, 30), (24, 37), (21, 44), (23, 50)), ((42, 30), (40, 38), (43, 46)),
                ((33, 46), (31, 53)), ((9, 30), (15, 34)), ((55, 30), (49, 34))):
        t.linha(list(pts), CERNE, 2)
        t.px(pts[0][0], pts[0][1], CERNE_C)
    for cx, cy in ((10, 14), (54, 14), (20, 5), (44, 5), (32, 22), (6, 22), (58, 22), (32, 1), (26, 14), (38, 14)):
        flor(t, cx, cy, grande=True)
    if not costas:
        t.elipse(32, 37, 10, 7, CASCA_E)          # o nó onde moram os olhos
        t.anel(32, 37, 10, 7, escurecer(CASCA_E), 1)
        olho(t, 28, 36, 2, OLHO_PB)
        olho(t, 36, 36, 2, OLHO_PB)
        t.pxs([(26, 33), (27, 33), (37, 33), (38, 33)], PRETO)     # sobrancelha brava
        t.pxs([(29, 41), (30, 42), (31, 42), (32, 42), (33, 42), (34, 42), (35, 41)], CERNE_C)
    else:
        t.linha([(32, 30), (32, 44)], CERNE, 1)
    t.contorno()
    return t


# --------------------------------------------------------- PAUBRASILISCO
def paubrasilisco(t, costas=False):
    """Basilisco de pau-brasil em quatro patas: casca negra com as rachaduras
    em brasa vermelha, juba de copa escura com flores e olhos amarelos de fera.
    PLANTA/SOMBRIO."""
    negra = (44, 32, 32, 255)
    negra_e = (28, 20, 22, 255)
    brilho = (255, 70, 60, 255)
    t.poli([(44, 38), (56, 30), (60, 20), (63, 22), (60, 34), (50, 46)], negra)   # rabo erguido
    t.elipse(36, 40, 18, 10, negra)                                              # corpo
    for x, y in ((24, 46), (46, 46)):                                            # patas de trás (escuras)
        t.poli([(x - 3, y), (x + 4, y), (x + 5, y + 12), (x - 5, y + 12)], negra_e)
    for x, y in ((18, 46), (40, 46)):                                            # patas da frente
        t.poli([(x - 4, y - 2), (x + 4, y - 2), (x + 4, y + 13), (x - 6, y + 13)], negra)
        t.pxs([(x - 6, y + 14), (x - 3, y + 14), (x, y + 14), (x + 3, y + 14)], negra)   # garras
    t.elipse(15, 29, 9, 8, negra)                                                # cabeça
    t.poli([(20, 26), (8, 24), (1, 29), (1, 34), (14, 35), (22, 36)], negra)     # queixada de cima
    t.poli([(3, 38), (14, 37), (22, 40), (18, 44), (6, 42)], negra_e)             # mandíbula
    # juba de copa pelo pescoço e lombo
    for cx, cy, r in ((22, 22, 9), (16, 17, 7), (32, 26, 8), (42, 29, 7), (26, 14, 6), (50, 32, 5)):
        t.elipse(cx, cy, r, r - 2, FOLHA)
    for cx, cy, r in ((20, 22, 5), (32, 26, 4), (42, 30, 3)):
        t.elipse(cx, cy, r, r - 1, FOLHA_E)
    t.poli([(10, 24), (4, 14), (12, 20)], negra)                                  # chifre-galho

    t.luz(poupar=(brilho[:3],))

    for pts in (((28, 36), (32, 42), (30, 48)), ((40, 34), (44, 40), (42, 47)), ((50, 38), (53, 43)),
                ((18, 48), (17, 56)), ((40, 48), (41, 56)), ((56, 26), (59, 22))):
        t.linha(list(pts), CERNE, 2)
        t.linha(list(pts), brilho, 1)
    for cx, cy in ((16, 13), (26, 10), (36, 22), (46, 26), (24, 20), (52, 30), (10, 20)):
        flor(t, cx, cy, grande=True)
    if not costas:
        t.poli([(2, 35), (15, 35), (20, 39), (15, 38), (3, 38)], CERNE)          # bocarra em brasa
        t.pxs([(4, 35), (7, 35), (10, 35), (13, 35), (6, 37), (9, 37), (12, 37)], BRANCO)   # dentes
        t.poli([(9, 27), (16, 28), (16, 31), (10, 30)], OLHO_PB)               # olho de fera
        t.pxs([(13, 28), (13, 29), (13, 30)], PRETO)
        t.linha([(8, 25), (17, 26)], PRETO, 1)                                 # sobrancelha brava
        t.pxs([(2, 30), (3, 30)], PRETO)                                       # narina
    else:
        t.elipse(14, 29, 8, 7, negra)
        t.linha([(10, 26), (16, 32)], CERNE, 1)
        for cx, cy in ((14, 24), (18, 30)):
            flor(t, cx, cy)
    t.contorno()
    return t


# -------------------------------------------------------------- BRASEAGLE
def braseagle(t, costas=False):
    """Beagle adolescente, mais comprido e de perna longa: orelhas enormes com a
    ponta pegando fogo, patas sujas de terra e o rabo inteiro em chama. FOGO/TERRA."""
    t.elipse(36, 40, 17, 10, CREME)                       # corpo
    t.elipse(40, 36, 12, 7, CARAMELO)                     # sela caramelo
    t.elipse(34, 36, 6, 5, MARROM)                        # mancha escura
    for x in (24, 31, 42, 49):                            # patas compridas
        t.ret(x - 3, 44, x + 2, 58, CREME)
    t.poli([(50, 36), (58, 22), (62, 24), (54, 40)], CREME)   # rabo
    t.poli([(14, 36), (24, 34), (26, 44), (16, 46)], CREME)   # peito
    t.elipse(18, 24, 12, 11, CARAMELO)                    # cabeça
    t.poli([(6, 26), (2, 32), (8, 36), (18, 34), (16, 26)], CREME)   # focinho alongado
    t.ret(15, 13, 18, 30, CREME)                          # lista da testa
    t.poli([(8, 18), (2, 34), (5, 44), (12, 30)], MARROM)     # orelhas compridas
    t.poli([(26, 16), (32, 32), (29, 44), (24, 28)], MARROM)

    t.luz()

    for cx, y in ((4, 48), (29, 48)):                     # pontas das orelhas em fogo
        t.elipse(cx, y - 3, 3, 3, BRASA)
        chama(t, cx, y - 3, 8, 3)
    t.poli([(56, 26), (58, 8), (63, 18), (63, 28)], BRASA)   # o rabo em labareda
    t.poli([(58, 25), (59, 14), (62, 22), (62, 27)], BRASA_C)
    for x in (24, 31, 42, 49):                            # meia de terra
        t.ret(x - 3, 55, x + 2, 58, TERRA)
        t.px(x - 1, 54, TERRA)
    for x, y in ((14, 60), (36, 61), (56, 60), (10, 62)):
        t.ret(x, y, x + 2, y + 1, TERRA)
    if not costas:
        olho(t, 13, 23)
        olho(t, 22, 23)
        t.elipse(4, 29, 2, 2, PRETO)                      # nariz
        t.pxs([(6, 33), (7, 34), (8, 34), (9, 34), (10, 33)], PRETO)
        t.pxs([(9, 35), (9, 36)], (230, 90, 110, 255))
    else:
        t.elipse(18, 24, 11, 10, CARAMELO)
        t.ret(15, 14, 18, 30, CREME)
    t.contorno()
    return t


# -------------------------------------------------------------- MAGMASTIM
def magmastim(t, costas=False):
    """Mastim de guarda enorme, peitoral largo e patas de pilão; o caramelo racha
    e mostra o magma por baixo. Coleira de pedra e orelhas em chamas. FOGO/TERRA."""
    pedra = (132, 128, 124, 255)
    pedra_e = (92, 88, 86, 255)
    magma = (255, 96, 30, 255)
    t.poli([(56, 28), (62, 18), (64, 20), (60, 32)], CARAMELO)   # rabo curto
    for x in (44, 55):                                    # patas de trás
        t.poli([(x - 5, 38), (x + 4, 38), (x + 4, 56), (x - 5, 56)], escurecer(CARAMELO, 0.15))
        t.elipse(x, 57, 6, 3, escurecer(CARAMELO, 0.15))
    t.elipse(44, 33, 17, 10, CARAMELO)                    # lombo
    t.elipse(26, 36, 15, 12, CARAMELO)                    # peito largo
    t.elipse(24, 40, 8, 8, CREME)                         # babador creme
    for x in (15, 33):                                    # patas da frente, enormes
        t.poli([(x - 5, 42), (x + 5, 42), (x + 6, 55), (x - 6, 55)], CARAMELO)
        t.elipse(x, 57, 8, 4, CREME)
    t.elipse(24, 18, 14, 12, CARAMELO)                    # cabeção
    t.elipse(24, 26, 11, 7, CREME)                        # focinho com bochecha
    t.poli([(10, 8), (4, 18), (8, 28), (14, 16)], MARROM)     # orelhas
    t.poli([(38, 8), (44, 18), (40, 28), (34, 16)], MARROM)
    t.ret(12, 30, 38, 35, pedra)                          # coleira de pedra

    t.luz(poupar=(magma[:3],))

    for pts in (((44, 26), (48, 32), (46, 38)), ((54, 26), (57, 32), (54, 36)), ((34, 38), (36, 44)),
                ((12, 44), (14, 50)), ((44, 42), (43, 50)), ((55, 44), (56, 50)), ((20, 9), (24, 12))):
        t.linha(list(pts), magma, 1)
        t.px(pts[0][0], pts[0][1], BRASA_C)
    for cx in (6, 42):                                    # orelhas em chamas
        chama(t, cx, 20, 16, 4)
    for x in range(14, 38, 6):                            # blocos da coleira
        t.linha([(x + 4, 30), (x + 4, 35)], pedra_e, 1)
        t.px(x + 1, 31, clarear(pedra))
    for x in (11, 13, 17, 19, 29, 31, 35, 37):            # dedões
        t.px(x, 60, MARROM)
    if not costas:
        olho(t, 18, 18, 2)
        olho(t, 30, 18, 2)
        t.linha([(15, 14), (20, 16)], MARROM, 1)          # sobrancelha franzida
        t.linha([(33, 14), (28, 16)], MARROM, 1)
        t.elipse(24, 23, 3, 2, PRETO)                     # nariz
        t.linha([(24, 25), (24, 27)], PRETO, 1)
        t.pxs([(18, 28), (19, 29), (20, 29), (21, 28), (27, 28), (28, 29), (29, 29), (30, 28)], PRETO)
        t.pxs([(20, 30), (28, 30)], BRANCO)               # presas
    else:
        t.elipse(24, 19, 13, 11, CARAMELO)
        t.linha([(20, 10), (24, 16), (22, 22)], magma, 1)
        t.ret(12, 30, 38, 35, pedra)
        for x in range(14, 38, 6):
            t.linha([(x + 4, 30), (x + 4, 35)], pedra_e, 1)
    t.contorno()
    return t


# -------------------------------------------------------------- TILAPISCO
def tilapisco(t, costas=False):
    """A tilápia cresceu e ficou de pé de vez: corpo alto, leque de cima eriçado
    e as nadadeiras do lado viraram bracinhos prontos pra briga. ÁGUA."""
    t.poli([(18, 14), (30, 6), (44, 12), (50, 28), (44, 44), (22, 46), (14, 30)], PRATA)   # corpo
    t.poli([(22, 45), (42, 45), (38, 52), (26, 52)], PRATA_E)                                # talo
    t.poli([(16, 61), (26, 50), (32, 54), (38, 50), (48, 61), (42, 62), (32, 57), (22, 62)], BARB)   # cauda-pés
    t.poli([(18, 14), (22, 2), (30, 0), (40, 2), (48, 8), (44, 12), (30, 6)], BARB)         # leque
    t.poli([(48, 26), (58, 30), (62, 40), (56, 42), (48, 34)], BARB)                          # braço-barbatana
    t.poli([(16, 32), (8, 36), (4, 46), (10, 46), (20, 38)], BARB)

    t.luz()

    for x in range(24, 47, 5):
        t.linha([(x, 12 + (x - 24) // 3), (x - 2, 43)], LISTRA, 1)
    for x in range(22, 46, 4):                             # raios do leque
        t.linha([(x, 2 + abs(x - 32) // 4), (x - 1, 9)], BARB_C, 1)
    t.linha([(52, 30), (59, 40)], BARB_C, 1)
    t.linha([(12, 38), (7, 45)], BARB_C, 1)
    if not costas:
        olho(t, 24, 18, 4)
        t.elipse(24, 18, 2, 2, OLHO_V)
        t.px(23, 17, BRANCO)
        t.linha([(19, 12), (27, 14)], PRETO, 1)            # sobrancelha valente
        t.elipse(14, 27, 5, 4, BEICO)                      # beiço grosso
        t.ret(10, 27, 18, 27, PRETO)
        t.linha([(21, 26), (21, 38)], PRATA_E, 1)          # guelra
    t.contorno()
    return t


# -------------------------------------------------------------- TILAPIRAÇU
def tilapiracu(t, costas=False):
    """Tilápia-guerreira grande: tronco de peixe musculoso, barbatanas que viraram
    braços de punho fechado, cauda partida em duas pernas e bandana na testa.
    ÁGUA/LUTADOR."""
    bandana = (48, 96, 196, 255)
    bandana_c = (110, 160, 240, 255)
    t.poli([(20, 42), (28, 42), (26, 54), (16, 54)], PRATA_E)        # pernas
    t.poli([(36, 42), (44, 42), (48, 54), (38, 54)], PRATA_E)
    t.poli([(10, 62), (16, 52), (28, 52), (30, 62), (22, 58)], BARB)  # pés-barbatana
    t.poli([(34, 62), (36, 52), (48, 52), (54, 62), (42, 58)], BARB)
    t.poli([(16, 12), (30, 4), (46, 10), (52, 26), (46, 44), (18, 44), (12, 26)], PRATA)   # tronco
    t.poli([(18, 12), (22, 0), (32, 0), (42, 2), (48, 10), (30, 5)], BARB)                # leque
    # braços: ombro de barbatana e punho
    t.poli([(48, 18), (58, 20), (62, 30), (56, 34), (50, 30)], BARB)
    t.elipse(57, 34, 5, 5, PRATA)
    t.poli([(16, 20), (6, 24), (2, 34), (8, 36), (18, 30)], BARB)
    t.elipse(6, 38, 5, 5, PRATA)

    t.luz()

    for x in range(24, 48, 5):
        t.linha([(x, 10 + (x - 24) // 3), (x - 2, 42)], LISTRA, 1)
    for x in range(22, 46, 4):
        t.linha([(x, 1 + abs(x - 32) // 4), (x - 1, 7)], BARB_C, 1)
    for cx, cy in ((57, 34), (6, 38)):                               # dedos do punho
        t.pxs([(cx - 2, cy + 1), (cx, cy + 1), (cx + 2, cy + 1)], PRATA_E)
    t.linha([(14, 11), (50, 13)], bandana, 3)                        # bandana
    t.linha([(15, 10), (49, 12)], bandana_c, 1)
    t.poli([(50, 11), (60, 8), (58, 13), (62, 16), (50, 15)], bandana)   # pontas soltas
    if not costas:
        olho(t, 22, 20, 4)
        t.elipse(22, 20, 2, 2, OLHO_V)
        t.px(21, 19, BRANCO)
        t.linha([(17, 15), (26, 17)], PRETO, 1)
        t.elipse(12, 29, 5, 4, BEICO)
        t.ret(8, 29, 16, 29, PRETO)
        t.linha([(20, 27), (20, 38)], PRATA_E, 1)
    t.contorno()
    return t


DESENHOS = {
    1033: (troncudo, "troncudo"),
    1034: (paubrasilisco, "paubrasilisco"),
    1035: (braseagle, "braseagle"),
    1036: (magmastim, "magmastim"),
    1037: (tilapisco, "tilapisco"),
    1038: (tilapiracu, "tilapiracu"),
}
