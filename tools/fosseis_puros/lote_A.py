"""Lote A: AS FORMAS PURAS DE KANTO.

OMANYTE e OMASTAR com a concha de madrepérola e a espiral furta-cor; KABUTO e
KABUTOPS de âmbar transparente, com o coração batendo à vista e as foices de
âmbar; AERODACTYL de escamas de cristal azul.
"""
import math

from pixelart import Tela, clarear, escurecer  # noqa: F401

BRANCO = (250, 250, 250, 255)
PRETO = (30, 26, 34, 255)

# a madrepérola: branco rosado, e a espiral que passa por rosa, lilás, água
PEROLA = (248, 228, 238, 255)
PEROLA_E = (214, 190, 206, 255)
FURTA = [(250, 160, 196, 255), (198, 168, 240, 255), (150, 214, 236, 255),
         (176, 240, 210, 255), (250, 214, 170, 255)]

# o âmbar: laranja-mel claro por fora, o bicho mais escuro "por dentro"
AMBAR = (246, 178, 64, 255)
AMBAR_C = (255, 222, 132, 255)
AMBAR_E = (196, 118, 34, 255)
MIOLO = (150, 82, 30, 255)
CORACAO = (232, 46, 74, 255)
OLHO_PSI = (230, 120, 255, 255)

# o cristal azul
CRISTAL = (120, 176, 236, 255)
CRISTAL_C = (196, 232, 255, 255)
CRISTAL_E = (64, 104, 184, 255)


def tom(nx, ny, tons):
    """Luz de cima-esquerda numa superfície curva: escolhe 1 dos `tons`
    (do mais claro pro mais escuro) pela normal do ponto."""
    r2 = nx * nx + ny * ny
    nz = math.sqrt(max(0.0, 1 - r2))
    luz = -0.5 * nx - 0.6 * ny + 0.62 * nz
    if luz > 0.62:
        return tons[0]
    if luz > 0.25:
        return tons[1]
    if luz > -0.15:
        return tons[2]
    return tons[3]


PEROLA_TONS = [(255, 248, 250, 255), (244, 226, 236, 255), (224, 200, 220, 255),
               (184, 158, 190, 255)]


def concha(t, cx, cy, rx, ry, ux, uy, sentido=1, costelas=11):
    """A concha de amonite: madrepérola sombreada em 4 tons, costelas que
    saem do umbigo da espiral e se curvam, a cor furta-cor mudando com o
    ângulo, e o umbigo enrolado do lado de trás."""
    from pixelart import mistura
    g = 2.3                                     # quanto o raio cresce por volta
    for y in range(int(cy - ry), int(cy + ry) + 1):
        for x in range(int(cx - rx), int(cx + rx) + 1):
            nx, ny = (x - cx) / rx, (y - cy) / ry
            if nx * nx + ny * ny > 1:
                continue
            i = PEROLA_TONS.index(tom(nx, ny, PEROLA_TONS))
            d = max(0.6, math.hypot(x - ux, y - uy))
            ang = math.atan2(y - uy, (x - ux) * sentido) / (2 * math.pi)
            w = math.log(d) / math.log(g) - ang          # coordenada do enrolado
            f = w % 1
            # cada volta é um tubo: claro em cima, escuro perto da volta de dentro
            if f < 0.1:
                i = 3
            elif f > 0.78:
                i = min(3, i + 1)
            elif 0.2 < f < 0.45:
                i = max(0, i - 1)
            base = PEROLA_TONS[i]
            costela = (ang * costelas + f * 0.5) % 1
            iri = FURTA[int(ang * 15 + w * 3) % len(FURTA)]
            if f < 0.1:
                cor = mistura(base, FURTA[1], 0.25)
            elif costela < 0.16 and d > 4:
                cor = mistura(escurecer(base, 0.1), iri, 0.3)
            elif costela < 0.3 and d > 4:
                cor = mistura(clarear(base, 0.6), iri, 0.08)
            else:
                cor = mistura(base, iri, 0.12)
            if d < 2.2:
                cor = PEROLA_TONS[3]
            t.px(x, y, cor)


def facetar(t, alvo, tons, passo=7, semente=0, aresta=None):
    """Troca a cor `alvo` por facetas de cristal: células irregulares (cada
    uma num dos `tons`) e, se pedir, a aresta entre elas."""
    import random
    rnd = random.Random(semente)
    pontos = [(gx * passo + rnd.uniform(0, passo), gy * passo + rnd.uniform(0, passo), rnd.randrange(len(tons)))
              for gy in range(-1, 64 // passo + 2) for gx in range(-1, 64 // passo + 2)]
    for y in range(t.lado):
        for x in range(t.lado):
            if t.cor(x, y) != alvo:
                continue
            ds = sorted(((x - px_) ** 2 + (y - py) ** 2, k) for px_, py, k in pontos)
            if aresta and math.sqrt(ds[1][0]) - math.sqrt(ds[0][0]) < 0.9:
                t.px(x, y, aresta)
            else:
                t.px(x, y, tons[ds[0][1]])


def coracao(t, cx, cy, cor=CORACAO):
    t.pxs([(cx - 1, cy - 1), (cx + 1, cy - 1), (cx - 2, cy - 1), (cx + 2, cy - 1)], cor)
    t.ret(cx - 3, cy, cx + 3, cy, cor)
    t.ret(cx - 2, cy + 1, cx + 2, cy + 1, cor)
    t.ret(cx - 1, cy + 2, cx + 1, cy + 2, cor)
    t.px(cx, cy + 3, cor)
    t.px(cx - 1, cy, clarear(cor, 0.5))


def brilho(t, x, y, cor=BRANCO):
    t.pxs([(x, y), (x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)], cor)


# ------------------------------------------------------------ OMANYTE PURA
CORPO_TONS = [(196, 236, 255, 255), (150, 206, 240, 255), (108, 160, 218, 255),
              (72, 110, 180, 255)]


def tentaculo(t, pts, g=3):
    t.linha(pts, CORPO_TONS[2], g)
    t.linha([(x - 1, y - 1) for x, y in pts], CORPO_TONS[1], 1)


def omanytepuro(t, costas=False):
    """O amonite de madrepérola: concha enrolada com o umbigo atrás e a boca
    pra frente, de onde saem os tentáculos claros."""
    for pts in (((14, 46), (6, 54), (8, 59)), ((18, 48), (14, 56), (16, 60)),
                ((24, 50), (22, 57), (26, 60)), ((30, 50), (32, 57), (36, 59)),
                ((36, 48), (42, 55), (44, 58))):
        tentaculo(t, list(pts))
    t.elipse(22, 45, 15, 9, CORPO_TONS[1])                       # corpo
    t.elipse(37, 30, 22, 21, PEROLA)                             # silhueta da concha
    t.luz(forca=0.25)
    for y in range(36, 55):                                      # sombra no corpo
        for x in range(7, 38):
            c = t.cor(x, y)
            if c[:3] == CORPO_TONS[1][:3] and y > 49:
                t.px(x, y, CORPO_TONS[2])
    concha(t, 37, 30, 21, 20, 47, 29, sentido=1, costelas=9)
    # a boca da concha: a beirada de frente, mais clara
    t.linha([(16, 28), (18, 40), (26, 48), (36, 50)], PEROLA_TONS[0], 2)
    t.linha([(18, 26), (20, 38), (27, 46)], PEROLA_TONS[2], 1)
    if not costas:
        for x in (15, 27):
            t.elipse(x, 44, 4, 4, BRANCO)
            t.anel(x, 44, 4, 4, (52, 56, 84, 255), 1)
            t.elipse(x - 1, 44, 1, 1, PRETO)
            t.px(x - 2, 43, BRANCO)
        t.pxs([(19, 50), (20, 51), (21, 51), (22, 50)], CORPO_TONS[3])
    brilho(t, 28, 15)
    t.contorno()
    return t


# ------------------------------------------------------------ OMASTAR PURA
def espinho(t, base_esq, ponta, base_dir):
    meio = ((base_esq[0] + base_dir[0]) / 2, (base_esq[1] + base_dir[1]) / 2)
    t.poli([base_esq, ponta, meio], PEROLA_TONS[1])
    t.poli([meio, ponta, base_dir], PEROLA_TONS[3])
    t.linha([meio, ponta], PEROLA_TONS[0], 1)
    t.px(int(ponta[0]), int(ponta[1]), FURTA[0])


def omastarpuro(t, costas=False):
    """A concha de pérola grande demais, enrolada e com espinhos de pérola
    que cantam; embaixo, o corpo e os tentáculos claros abertos no chão."""
    for pts in (((18, 46), (6, 48), (2, 42), (5, 39)), ((18, 50), (6, 57), (2, 54)),
                ((24, 54), (18, 60), (12, 59)), ((38, 54), (44, 60), (50, 59)),
                ((44, 50), (56, 57), (61, 54)), ((44, 46), (57, 48), (62, 42), (59, 39))):
        tentaculo(t, list(pts))
    t.elipse(31, 48, 16, 9, CORPO_TONS[1])
    t.elipse(33, 26, 22, 20, PEROLA)                             # concha
    t.luz(forca=0.25)
    for y in range(50, 58):
        for x in range(14, 50):
            if t.cor(x, y)[:3] == CORPO_TONS[1][:3]:
                t.px(x, y, CORPO_TONS[2])
    concha(t, 33, 26, 21, 19, 42, 23, sentido=1, costelas=10)
    for be, pt, bd in (((14, 16), (10, 1), (21, 9)), ((26, 8), (28, 0), (33, 7)),
                       ((40, 7), (48, 0), (46, 10)), ((50, 14), (61, 10), (53, 22))):
        espinho(t, be, pt, bd)
    t.linha([(13, 30), (16, 40), (24, 46), (40, 47)], PEROLA_TONS[0], 2)
    if not costas:
        t.elipse(31, 49, 12, 7, CORPO_TONS[1])
        t.elipse(31, 52, 10, 4, CORPO_TONS[2])
        for x in (23, 39):
            t.elipse(x, 43, 4, 4, BRANCO)
            t.anel(x, 43, 4, 4, (52, 56, 84, 255), 1)
            t.elipse(x - 1, 43, 1, 1, PRETO)
            t.px(x - 2, 42, BRANCO)
        # o bico em cruz do OMASTAR
        t.ret(28, 48, 34, 54, PRETO)
        t.linha([(31, 48), (31, 54)], CORPO_TONS[3], 1)
        t.linha([(28, 51), (34, 51)], CORPO_TONS[3], 1)
    brilho(t, 20, 14)
    t.contorno()
    return t


# ------------------------------------------------------------- KABUTO PURO
def kabutopuro(t, costas=False):
    """A cúpula de âmbar transparente: por dentro aparece o corpo escuro e o
    coração vermelho; embaixo, os olhos que veem o que vai acontecer."""
    t.linha([(18, 52), (14, 58)], AMBAR_E, 3)                    # perninhas
    t.linha([(26, 54), (24, 60)], AMBAR_E, 3)
    t.linha([(38, 54), (40, 60)], AMBAR_E, 3)
    t.linha([(46, 52), (50, 58)], AMBAR_E, 3)
    t.elipse(32, 36, 24, 20, AMBAR)                              # cúpula
    t.luz(forca=0.3)
    tons = [AMBAR_C, AMBAR, (228, 146, 44, 255), AMBAR_E]
    for y in range(16, 57):
        for x in range(8, 57):
            nx, ny = (x - 32) / 23, (y - 36) / 19
            if nx * nx + ny * ny <= 1:
                t.px(x, y, tom(nx, ny, tons))
    # o miolo visto através do âmbar, com o brilho do vidro por cima
    t.elipse(32, 35, 15, 11, mistura_ambar(MIOLO))
    t.elipse(31, 34, 12, 8, mistura_ambar(MIOLO, 0.2))
    t.elipse(30, 32, 7, 4, mistura_ambar(MIOLO, 0.4))
    for x in range(20, 46, 5):                                   # o corpo segmentado lá dentro
        t.linha([(x, 28), (x + 1, 42)], mistura_ambar(MIOLO, -0.0), 1)
    t.elipse(32, 33, 5, 4, (255, 120, 120, 255))                 # o brilho do coração
    coracao(t, 32, 32)
    # reflexos do vidro
    t.linha([(14, 30), (20, 22), (28, 18)], AMBAR_C, 2)
    t.px(40, 20, AMBAR_C)
    t.px(42, 21, AMBAR_C)
    if not costas:
        t.poli([(10, 42), (54, 42), (48, 55), (16, 55)], (40, 26, 20, 255))   # a barriga escura
        t.poli([(14, 46), (50, 46), (46, 55), (18, 55)], (58, 38, 28, 255))
        t.elipse(32, 42, 22, 3, (228, 146, 44, 255))
        t.linha([(12, 41), (52, 41)], AMBAR_C, 1)
        for x in (24, 40):
            t.elipse(x, 48, 3, 3, (150, 60, 200, 255))
            t.elipse(x, 48, 2, 2, OLHO_PSI)
            t.px(x - 1, 47, BRANCO)
        t.linha([(28, 48), (36, 48)], AMBAR_E, 1)
    else:
        t.linha([(32, 17), (32, 54)], AMBAR_E, 1)
        t.linha([(12, 44), (52, 44)], AMBAR_E, 1)
    t.contorno()
    return t


def mistura_ambar(cor, q=0.0):
    """O que fica DENTRO do âmbar: puxado pro laranja, como através de mel."""
    from pixelart import mistura
    return mistura(mistura(cor, AMBAR, 0.35), AMBAR_C, q)


# ----------------------------------------------------------- KABUTOPS PURO
def foice(t, cx, cy, r, corte_dx, corte_dy, cor):
    """Um crescente: o círculo inteiro menos outro deslocado."""
    t.elipse(cx, cy, r, r, cor)
    t.elipse(cx + corte_dx, cy + corte_dy, r, r, (0, 0, 0, 0))


def kabutopspuro(t, costas=False):
    """O caçador de âmbar: em pé nas pernas dobradas pra trás, o capacete de
    lâmina, o coração aceso no peito e as duas foices de âmbar cristalino."""
    from pixelart import mistura
    CORPO = (226, 150, 60, 255)
    CORPO_C = (248, 196, 110, 255)
    CORPO_E = (176, 102, 36, 255)
    CORPO_EE = (120, 64, 26, 255)
    FOICE_E = (214, 138, 40, 255)
    FOICE = (255, 204, 100, 255)
    FOICE_C = (255, 240, 190, 255)
    # as foices: crescente escuro, por dentro o claro, e o fio quase branco
    LAMINA_E = [(8, 34), (3, 27), (1, 17), (4, 8), (12, 1), (10, 9), (9, 18), (11, 26), (13, 32)]
    LAMINA_D = [(64 - x, y + 1) for x, y in LAMINA_E]
    t.poli(LAMINA_E, FOICE_E)
    t.poli(LAMINA_D, FOICE_E)
    # a cauda
    t.linha([(36, 44), (46, 50), (56, 56)], CORPO_E, 4)
    t.linha([(52, 54), (61, 58)], CORPO_E, 2)
    # pernas digitígradas: coxa pra frente, canela pra trás, pé pra frente
    for quadril, joelho, tornozelo, dedos in (((27, 42), (19, 48), (25, 56), (17, 60)),
                                               ((37, 42), (44, 48), (40, 56), (47, 60))):
        t.linha([quadril, joelho], CORPO, 5)
        t.linha([joelho, tornozelo], CORPO_E, 3)
        t.poli([(tornozelo[0] - 2, tornozelo[1]), (tornozelo[0] + 2, tornozelo[1]),
                (max(tornozelo[0], dedos[0]) + 1, 61), (min(tornozelo[0], dedos[0]) - 1, 61)], CORPO_E)
    # braços
    t.linha([(25, 26), (14, 33), (6, 30)], CORPO, 4)
    t.linha([(39, 26), (50, 34), (58, 31)], CORPO, 4)
    # tronco largo
    t.poli([(21, 22), (41, 22), (44, 32), (40, 45), (24, 45), (19, 32)], CORPO)
    # capacete
    t.poli([(15, 18), (19, 9), (26, 4), (36, 3), (44, 6), (54, 1), (50, 12), (44, 19),
            (36, 23), (20, 23)], CORPO)
    t.luz(forca=0.32, sombra=0.3)
    # tons extras: o capacete clareia em cima, escurece embaixo da aba
    t.poli([(20, 9), (26, 5), (35, 4), (31, 7), (23, 10)], CORPO_C)
    t.linha([(17, 20), (40, 21)], CORPO_E, 1)
    t.linha([(44, 7), (52, 3)], CORPO_C, 1)
    # dentro das foices: o âmbar claro e o fio quase branco do lado de dentro
    for lam, sx in ((LAMINA_E, 1), (LAMINA_D, -1)):
        t.poli([lam[1], lam[2], lam[3], lam[4], lam[5], lam[6], lam[7]], FOICE)
        t.linha([lam[4], lam[5], lam[6], lam[7], lam[8]], FOICE_C, 1)
        t.linha([(lam[2][0] + sx, lam[2][1]), (lam[3][0] + sx, lam[3][1] + 1)], FOICE_C, 1)
    # o peito transparente e o coração
    t.poli([(25, 25), (37, 25), (39, 35), (31, 41), (23, 35)], mistura_ambar(MIOLO, 0.1))
    t.poli([(27, 27), (33, 27), (30, 30), (26, 31)], mistura_ambar(MIOLO, 0.4))
    t.elipse(31, 32, 4, 3, (240, 110, 100, 255))
    coracao(t, 31, 32)
    for y in (40, 43):                                           # gomos da barriga
        t.linha([(25, y), (38, y)], CORPO_EE, 1)
    for x, y in ((19, 48), (44, 48)):                            # joelhos
        t.px(x, y - 1, CORPO_C)
    for x0 in (15, 19, 39, 43, 47):                              # garras dos pés
        t.px(x0, 61, FOICE_C)
    if not costas:
        # o rosto grande, escuro, debaixo da aba
        t.poli([(17, 18), (33, 18), (30, 27), (21, 27)], (54, 32, 22, 255))
        t.poli([(18, 19), (32, 19), (31, 20), (19, 20)], (80, 50, 32, 255))
        for ex in (20, 28):
            t.ret(ex - 1, 21, ex + 1, 22, (150, 60, 200, 255))
            t.px(ex, 21, OLHO_PSI)
            t.px(ex - 1, 21, BRANCO)
        t.linha([(22, 25), (27, 25)], CORPO_EE, 1)
    else:
        t.linha([(28, 6), (50, 8)], CORPO_E, 1)
        t.linha([(31, 23), (31, 45)], CORPO_EE, 1)
        for y in (28, 33, 38):
            t.linha([(26, y), (36, y)], CORPO_E, 1)
    t.contorno()
    return t


# --------------------------------------------------------- AERODACTYL PURO
def aerodactylpuro(t, costas=False):
    """O pterossauro de cristal azul: asas abertas de vidro facetado, e a luz
    que passa por elas sai colorida embaixo."""
    MEMBRANA = (150, 206, 250, 255)
    OSSO = (70, 112, 196, 255)
    BOCA = (200, 60, 96, 255)
    BOCA_E = (130, 30, 64, 255)
    LINGUA = (240, 120, 150, 255)
    MEMB_TONS = [(176, 222, 255, 255), (140, 196, 246, 255), (112, 166, 232, 255),
                 (196, 236, 255, 255), (150, 180, 244, 255), (168, 214, 236, 255)]
    CORPO_TONS = [CRISTAL_C, (150, 200, 246, 255), CRISTAL, (96, 146, 218, 255)]
    # asas: o dedo comprido em cima, a borda de trás recortada
    t.poli([(26, 32), (20, 10), (10, 0), (0, 6), (2, 14), (8, 13), (8, 20), (14, 19), (16, 28), (22, 34)], MEMBRANA)
    t.poli([(40, 30), (48, 8), (57, 1), (64, 8), (63, 18), (58, 17), (58, 25), (52, 23), (50, 32), (44, 35)], MEMBRANA)
    # rabo
    t.linha([(42, 48), (52, 51), (59, 45), (61, 38)], CRISTAL, 3)
    t.poli([(57, 40), (62, 31), (64, 41)], CRISTAL)
    # pernas
    t.linha([(31, 48), (28, 53), (30, 58)], CORPO_TONS[3], 3)
    t.linha([(41, 48), (44, 53), (42, 58)], CORPO_TONS[3], 3)
    t.linha([(25, 59), (32, 59)], CORPO_TONS[3], 2)
    t.linha([(40, 59), (47, 59)], CORPO_TONS[3], 2)
    # corpo
    t.elipse(36, 40, 10, 11, CRISTAL)
    t.poli([(28, 36), (24, 28), (32, 25), (40, 34)], CRISTAL)    # pescoço
    # cabeça grande: crista atrás, maxila em cima e mandíbula aberta embaixo
    if not costas:
        t.poli([(4, 28), (30, 28), (30, 33), (6, 37)], BOCA)
    t.poli([(28, 18), (44, 12), (36, 22)], CRISTAL)              # a crista
    t.poli([(34, 24), (28, 15), (18, 15), (6, 18), (0, 24), (2, 28), (20, 27), (34, 30)], CRISTAL)
    t.poli([(32, 31), (20, 34), (6, 37), (2, 40), (8, 42), (22, 41), (32, 37)], CRISTAL)
    t.luz(forca=0.32, sombra=0.3)
    facetar(t, MEMBRANA, MEMB_TONS, passo=7, semente=3, aresta=(98, 150, 222, 255))
    facetar(t, CRISTAL, CORPO_TONS[1:], passo=6, semente=5)
    # os ossos dos dedos da asa
    t.linha([(26, 32), (20, 10), (10, 0)], OSSO, 2)
    t.linha([(40, 30), (48, 8), (57, 1)], OSSO, 2)
    t.linha([(20, 11), (6, 14)], OSSO, 1)
    t.linha([(48, 9), (60, 17)], OSSO, 1)
    # a luz colorida que atravessa
    for (x, y), cor in (((8, 6), FURTA[0]), ((12, 15), FURTA[2]), ((18, 24), FURTA[3]),
                        ((54, 8), FURTA[1]), ((57, 20), FURTA[4]), ((50, 24), FURTA[0])):
        t.pxs([(x, y), (x + 1, y), (x, y + 1)], cor)
    for x, y in ((32, 37), (39, 44), (14, 19), (27, 18)):
        brilho(t, x, y, CRISTAL_C)
    if not costas:
        t.poli([(8, 30), (28, 30), (28, 32), (10, 35)], BOCA_E)
        t.poli([(12, 33), (24, 31), (26, 34), (16, 36)], LINGUA)
        for x in range(4, 28, 4):                               # dentes
            t.pxs([(x, 28), (x + 1, 29)], BRANCO)
            t.pxs([(x + 2, 36 - (x // 10)), (x + 2, 35 - (x // 10))], BRANCO)
        t.elipse(22, 20, 2, 2, (250, 220, 90, 255))              # olho
        t.px(23, 20, PRETO)
        t.px(22, 20, PRETO)
        t.linha([(18, 17), (26, 17)], CORPO_TONS[3], 1)          # sobrancelha
        t.pxs([(4, 21), (6, 21)], CORPO_TONS[3])                 # narina
        t.elipse(35, 43, 5, 6, CRISTAL_C)                        # peito
        t.linha([(32, 40), (38, 40)], CORPO_TONS[1], 1)
        t.linha([(32, 44), (38, 44)], CORPO_TONS[1], 1)
    else:
        t.linha([(32, 20), (35, 49)], CORPO_TONS[3], 1)
        for y in (34, 39, 44):
            t.pxs([(34, y), (36, y)], CRISTAL_C)
    t.contorno()
    return t


DESENHOS = {
    22001: (omanytepuro, "omanytepuro"),
    22002: (omastarpuro, "omastarpuro"),
    22003: (kabutopuro, "kabutopuro"),
    22004: (kabutopspuro, "kabutopspuro"),
    22005: (aerodactylpuro, "aerodactylpuro"),
}
