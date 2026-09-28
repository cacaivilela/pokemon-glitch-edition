"""LOTE 12 — os lendários de Braglitch: Amazonium, a samaúma viva que guarda a
floresta, e Destroium, a máquina que come a floresta. Mesmo tamanho, mesma
base larga, um de frente pro outro: copa contra fumaça, raiz contra esteira."""
import math

from pixelart import Tela, clarear, escurecer  # noqa: F401

BRANCO = (250, 250, 250, 255)
PRETO = (30, 26, 34, 255)


def curva(p0, p1, p2, n=10):
    """Pontos de uma curva quadrática de p0 a p2 puxada por p1."""
    return [((1 - u) ** 2 * p0[0] + 2 * (1 - u) * u * p1[0] + u * u * p2[0],
             (1 - u) ** 2 * p0[1] + 2 * (1 - u) * u * p1[1] + u * u * p2[1])
            for u in (i / n for i in range(n + 1))]


# -------------------------------------------------------------- AMAZONIUM
def amazonium(t, costas=False):
    """AMAZONIUM, a samaúma sagrada: raízes tabulares enormes com veios de rio,
    tronco largo de olhos verdes gentis, copa imensa em camadas com cipós e
    flores de fada. PLANTA/FADA, lendário."""
    casca = (138, 108, 80, 255)
    casca_e = (90, 66, 50, 255)
    casca_c = (182, 154, 118, 255)
    musgo = (104, 156, 72, 255)
    f1 = (22, 78, 48, 255)        # verde de sombra
    f2 = (40, 124, 60, 255)
    f3 = (78, 168, 70, 255)
    f4 = (160, 220, 96, 255)      # verde de sol
    cipo = (64, 116, 48, 255)
    rio = (50, 140, 226, 255)
    rio_c = (150, 224, 255, 255)
    rosa = (244, 110, 180, 255)
    rosa_c = (255, 206, 234, 255)
    brilho = (255, 250, 214, 255)
    olho_c = (176, 255, 196, 255)

    # tronco reto que se abre embaixo em raízes tabulares até as bordas
    esq = curva((24, 40), (23, 61), (1, 62), 12)
    dir_ = curva((63, 62), (41, 61), (40, 40), 12)
    t.poli([(25, 20), (39, 20)] + dir_[::-1] + esq[::-1], casca)
    # braços: dois galhões abertos debaixo da copa
    t.linha([(26, 30), (16, 24), (6, 26)], casca, 4)
    t.linha([(38, 30), (48, 24), (58, 26)], casca, 4)
    # a copa: tufo por tufo, de trás pra frente, cada um com sombra e sol
    tufos = [(32, 5, 8), (21, 7, 6), (43, 7, 6), (12, 11, 5), (52, 11, 5),
             (7, 18, 5), (18, 14, 7), (32, 13, 8), (46, 14, 7), (57, 18, 5),
             (4, 24, 4), (13, 22, 6), (23, 21, 6), (33, 21, 6), (42, 21, 6),
             (51, 22, 6), (60, 24, 4)]
    for cx, cy, r in tufos:
        rx = r + r // 3
        t.elipse(cx, cy, rx, r, f1)
        t.elipse(cx - 1, cy - 1, rx - 1, r - 1, f2)
        t.elipse(cx - 2, cy - 2, max(1, rx // 2), max(1, r // 2), f3)
    # os vãos entre um pé de raiz e outro, arcos baixos no chão
    for x0, x1, alto in ((9, 13, 58), (19, 22, 57), (42, 45, 57), (51, 55, 58)):
        t.poli([(x0, 63), (x1, 63), ((x0 + x1) / 2, alto)], (0, 0, 0, 0))
    # o igarapé: um poço azul entre as raízes do meio
    t.elipse(32, 61, 8, 2, rio)
    t.linha([(32, 50), (32, 59)], rio, 1)                      # a nascente, do pé do tronco
    t.luz(poupar=(rio_c[:3], brilho[:3], olho_c[:3], rosa[:3], rosa_c[:3], rio[:3]))
    for cx, cy, r in tufos:                      # pontinha de sol em cada tufo
        t.pxs([(cx - 3, cy - r + 1), (cx - 2, cy - r + 1)], f4)
    # veios da casca e musgo
    for x0, x1 in ((27, 26), (36, 37)):
        t.linha([(x0, 22), (x1, 34)], casca_e, 1)
    t.linha([(29, 22), (29, 30)], casca_c, 1)
    t.pxs([(25, 26), (26, 27), (38, 25), (39, 42), (24, 47), (41, 50), (20, 54)], musgo)
    # as raízes: cada lâmina é uma crista clara com o sulco escuro ao lado;
    # no pé do sulco brota a água que desce pro poço
    for xt, yt, xp in ((26, 42, 5), (28, 48, 16), (38, 42, 59), (36, 48, 48)):
        crista = [(round(x), round(y)) for x, y in curva((xt, yt), (xt, 60), (xp, 62), 20)]
        for x, y in crista:
            t.px(x, y, casca_c)
            t.px(x + 1, y, rio if y >= 60 else casca_e)
    t.pxs([(9, 61), (55, 61), (28, 61), (29, 61), (35, 62), (36, 61)], rio_c)
    # cipós pendendo da copa e dos galhões
    for x, y0, y1 in ((4, 27, 44), (9, 27, 40), (15, 27, 48), (49, 27, 47), (55, 27, 41),
                      (60, 27, 45), (21, 26, 34), (43, 26, 34)):
        for y in range(y0, y1):
            t.px(x + (1 if (y // 5) % 2 else 0), y, cipo)
        t.pxs([(x - 1, y1), (x + 1, y1), (x, y1 + 1)], f3)       # folhinha na ponta
    # flores de fada: rosas grandes e branquinhas miúdas
    for x, y in ((9, 17), (19, 11), (29, 4), (40, 5), (48, 12), (56, 17), (26, 18),
                 (38, 17), (14, 23), (50, 22), (33, 11)):
        t.pxs([(x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)], rosa)
        t.px(x, y, rosa_c)
    for x, y in ((21, 17), (45, 18), (32, 7)):                 # flores grandes de samaúma
        t.ret(x - 1, y - 1, x + 1, y + 1, rosa)
        t.pxs([(x - 2, y), (x + 2, y), (x, y - 2), (x, y + 2)], rosa_c)
        t.px(x, y, brilho)
    t.pxs([(15, 8), (24, 13), (44, 11), (36, 3), (5, 21), (59, 22), (30, 23), (20, 22)], BRANCO)
    if not costas:
        # CARA FELIZ: os olhos fechados de sorriso (um arco pra cima, aceso de
        # verde), as bochechas rosadas e a boca aberta rindo
        for ex in (27, 37):
            t.pxs([(ex - 3, 35), (ex - 2, 34), (ex - 1, 33), (ex, 33), (ex + 1, 33),
                   (ex + 2, 34), (ex + 3, 35)], olho_c)          # o arco do olho sorrindo
            t.pxs([(ex - 2, 35), (ex - 1, 34), (ex, 34), (ex + 1, 34), (ex + 2, 35)], (60, 170, 110, 255))
            t.pxs([(ex - 3, 36), (ex + 3, 36)], casca_e)         # os cantinhos do olho
        for bx in (22, 42):                                      # bochechas rosadas
            t.ret(bx - 1, 38, bx + 1, 39, rosa)
        t.linha([(32, 36), (32, 38)], casca_e, 1)                # nariz de nó de madeira
        # a boca aberta rindo: borda escura em U, e dentro o rosa da língua
        t.pxs([(27, 40), (28, 41), (29, 42), (30, 43), (31, 43), (32, 43), (33, 43), (34, 43),
               (35, 42), (36, 41), (37, 40)], casca_e)
        t.pxs([(28, 40), (29, 40), (30, 40), (31, 40), (32, 40), (33, 40), (34, 40), (35, 40), (36, 40)], casca_e)
        t.ret(29, 41, 35, 41, (90, 40, 40, 255))
        t.ret(30, 42, 34, 42, rosa)
    else:
        t.linha([(32, 26), (32, 46)], casca_e, 1)
        t.elipse(32, 36, 2, 3, casca_e)                          # um oco na casca
    # brilhos de fada no ar
    for x, y in ((2, 34), (62, 32), (6, 50), (58, 50), (1, 4), (62, 4)):
        t.px(x, y, brilho)
        t.pxs([(x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)], rosa_c)
    t.contorno((16, 34, 22, 255))
    return t


def glitch(t, faixas, desvio, cor):
    """Fatias da imagem escorregando pro lado, com a cicatriz em cor de erro."""
    for y0, y1, x0, x1 in faixas:
        pedaco = t.img.crop((x0, y0, x1, y1 + 1))
        t.img.paste((0, 0, 0, 0), (x0, y0, x1, y1 + 1))
        t.img.paste(pedaco, (x0 + desvio, y0))
        for y in range(y0, y1 + 1):
            for x in range(x0, x0 + desvio):
                if t.cor(x + desvio, y)[3]:
                    t.px(x, y, cor)


# -------------------------------------------------------------- DESTROIUM
def destroium(t, costas=False):
    """DESTROIUM, o colosso que derruba a mata: esteiras e lâmina de trator,
    corpo de chumbo enferrujado, bocarra de caçamba com dentes de serra, um
    olho vermelho só numa fenda, serra circular num braço e garra no outro,
    chaminés cuspindo fumaça preta e o sprite rachando em glitch. SOMBRIO/AÇO."""
    chumbo = (72, 72, 84, 255)
    chumbo_e = (42, 40, 50, 255)
    chumbo_c = (116, 118, 132, 255)
    aco = (176, 180, 192, 255)
    aco_c = (226, 230, 236, 255)
    ferrugem = (146, 74, 40, 255)
    ferrugem_c = (198, 112, 56, 255)
    fumaca = (50, 44, 56, 255)
    fumaca_c = (80, 72, 88, 255)
    verm = (255, 36, 36, 255)
    verm_e = (170, 20, 30, 255)
    verm_c = (255, 200, 180, 255)
    mag = (236, 40, 206, 255)
    roxo = (128, 48, 224, 255)
    faisca = (255, 226, 90, 255)
    boca = (20, 14, 22, 255)

    # fumaça preta rolando por trás de tudo
    for cx, cy, rx, ry in ((16, 8, 7, 5), (8, 4, 5, 4), (22, 3, 5, 3), (41, 7, 6, 5),
                           (34, 3, 5, 3), (46, 2, 4, 2), (28, 8, 4, 3)):
        t.elipse(cx, cy, rx, ry, fumaca)
    for cx, cy, rx, ry in ((14, 6, 4, 2), (7, 3, 2, 1), (39, 5, 3, 2), (33, 2, 2, 1)):
        t.elipse(cx, cy, rx, ry, fumaca_c)
    # chaminés tortas, abertas pra fora
    t.poli([(19, 24), (25, 24), (20, 10), (14, 10)], chumbo)
    t.poli([(38, 24), (44, 24), (44, 10), (38, 10)], chumbo)
    t.poli([(13, 9), (21, 9), (21, 12), (13, 12)], ferrugem)
    t.poli([(37, 9), (45, 9), (45, 12), (37, 12)], ferrugem)
    # esteiras dos lados
    t.ret(2, 44, 15, 62, chumbo_e)
    t.ret(49, 44, 62, 62, chumbo_e)
    # ombreiras e casco, curvado pra frente
    t.poli([(4, 26), (14, 18), (50, 18), (60, 26), (58, 34), (50, 38), (14, 38), (6, 34)], chumbo)
    t.poli([(14, 36), (50, 36), (46, 52), (18, 52)], chumbo)
    # espetos nas ombreiras
    for x, d in ((8, -1), (12, -1), (48, 1)):
        t.poli([(x - 2, 24), (x + 2, 22), (x + d * 4, 15)], chumbo_c)
    # a cabeça afundada entre os ombros, testa em V
    t.poli([(20, 22), (44, 22), (46, 30), (32, 34), (18, 30)], chumbo_c)
    # bocarra de caçamba
    t.poli([(18, 32), (46, 32), (48, 46), (16, 46)], chumbo_c)
    # lâmina de trator na frente, larga e curva, com dentes
    t.poli([(8, 48), (56, 48), (58, 58), (54, 61), (10, 61), (6, 58)], ferrugem)
    # braço esquerdo: a serra circular (um halo escuro separa ela do casco)
    t.linha([(8, 28), (6, 36), (10, 42)], chumbo, 5)
    t.elipse(10, 41, 11, 11, chumbo_e)
    for i in range(16):
        a = i * math.pi / 8
        t.poli([(10 + 8 * math.cos(a), 41 + 8 * math.sin(a)),
                (10 + 11 * math.cos(a + 0.2), 41 + 11 * math.sin(a + 0.2)),
                (10 + 8 * math.cos(a + 0.39), 41 + 8 * math.sin(a + 0.39))], aco)
    t.elipse(10, 41, 8, 8, chumbo_c)
    # braço direito: a garra erguida lá no alto, uma pinça de aço aberta
    braco = [(52, 26), (59, 22), (58, 14)]
    garra = (((56, 13), (51, 7), (51, 1)), ((60, 13), (63, 7), (61, 0)))
    t.linha(braco, chumbo_e, 7)
    for pts in garra:
        t.linha(list(pts), chumbo_e, 5)
    t.linha(braco, chumbo, 5)
    for pts in garra:
        t.linha(list(pts), aco, 3)
    t.elipse(58, 14, 3, 3, chumbo_c)
    t.luz(poupar=(verm[:3], verm_c[:3], mag[:3], roxo[:3], faisca[:3], aco_c[:3]))
    # esteira: as travessas do rodado
    for x0 in (2, 49):
        for y in range(45, 62, 3):
            t.linha([(x0 + 1, y), (x0 + 12, y)], chumbo_c, 1)
        t.linha([(x0, 44), (x0, 62)], PRETO, 1)
    # lâmina: faixas, rebites e os dentes de baixo
    t.linha([(8, 51), (56, 51)], ferrugem_c, 1)
    t.linha([(8, 55), (57, 55)], escurecer(ferrugem, 0.3), 1)
    for x in range(10, 56, 6):
        t.px(x, 53, ferrugem_c)
        t.poli([(x, 60), (x + 3, 60), (x + 1, 63)], aco)
    # serra: miolo e riscos de giro
    t.anel(10, 41, 7, 7, aco, 1)
    t.anel(10, 41, 4, 4, chumbo_e, 1)
    t.elipse(10, 41, 2, 2, chumbo_e)
    for x, y in ((52, 0), (50, 2), (60, 0), (62, 1)):          # pontas afiadas
        t.px(x, y, aco_c)
    t.linha([(50, 30), (55, 20)], aco, 1)                     # o pistão hidráulico
    t.pxs([(51, 29), (53, 25)], chumbo_e)
    t.pxs([(59, 22), (58, 14)], aco)                          # juntas
    t.pxs([(58, 13), (57, 14)], chumbo_e)
    t.px(10, 41, faisca)
    t.linha([(5, 36), (8, 34)], aco_c, 1)
    t.linha([(13, 47), (16, 45)], aco_c, 1)
    # ferrugem e rebites no casco
    t.pxs([(16, 24), (17, 25), (47, 21), (48, 22), (22, 49), (43, 50), (6, 30), (58, 31)],
          ferrugem)
    t.pxs([(17, 24), (48, 21), (43, 49)], ferrugem_c)
    for x in (16, 24, 40, 48):
        t.px(x, 20, aco)
    # fios soltos com faísca na ponta
    t.linha([(15, 37), (13, 44), (16, 49)], (40, 120, 60, 255), 1)
    t.linha([(49, 37), (52, 44), (48, 48)], (200, 60, 40, 255), 1)
    for x, y in ((16, 49), (48, 48)):
        t.px(x, y, faisca)
        t.pxs([(x - 1, y - 1), (x + 1, y + 1), (x + 1, y - 1)], BRANCO)
    if not costas:
        # testa franzida em V e a fenda do olho
        t.linha([(19, 27), (32, 32), (45, 27)], chumbo_e, 1)
        t.ret(20, 29, 44, 31, boca)
        t.linha([(22, 30), (42, 30)], verm_e, 1)
        t.elipse(32, 30, 3, 1, verm)
        t.ret(31, 29, 33, 30, verm_c)
        t.pxs([(24, 28), (40, 28), (19, 30), (45, 30), (32, 32)], verm_e)   # o clarão
        # a caçamba aberta, dentes de serra em cima e embaixo
        t.poli([(19, 34), (45, 34), (46, 44), (18, 44)], boca)
        for x in range(19, 45, 3):
            t.poli([(x, 34), (x + 3, 34), (x + 1, 38)], aco)
            t.poli([(x, 44), (x + 3, 44), (x + 2, 40)], aco)
        t.pxs([(26, 40), (35, 39)], verm_e)                        # brasa lá no fundo
    else:
        t.ret(20, 26, 44, 44, chumbo_e)
        for y in range(28, 44, 3):
            t.linha([(22, y), (42, y)], chumbo, 1)               # grelha do motor
        t.pxs([(26, 34), (38, 40)], verm_e)
    t.contorno((14, 8, 18, 255))
    # o sprite rachando: fatias fora do lugar e pixels de erro
    glitch(t, ((14, 15, 30, 60), (39, 40, 0, 40), (56, 57, 20, 64)), 2, mag)
    for x, y, c in ((1, 20, mag), (2, 20, roxo), (61, 22, roxo), (62, 22, mag),
                    (30, 14, mag), (0, 46, roxo), (63, 40, mag), (34, 1, roxo),
                    (35, 1, mag), (27, 12, roxo)):
        t.px(x, y, c)
    return t


DESENHOS = {
    1089: (amazonium, "amazonium"),
    1090: (destroium, "destroium"),
}
