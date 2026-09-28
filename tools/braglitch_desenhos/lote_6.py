"""LOTE 6 — CIDADE GRANDE E GLITCH.

Os bichos que nascem do poste, da tomada, da cabine e do concreto: o gato de
luz, a gambiarra de benjamim, o orelhão, a TV de chuvisco e o golem de Brasília.
"""
import math
import random

from pixelart import Tela, clarear, escurecer

BRANCO = (250, 250, 250, 255)
PRETO = (30, 26, 34, 255)
ROXO = (180, 85, 255, 255)
CIANO = (0, 255, 204, 255)
MAGENTA = (255, 0, 102, 255)
FAISCA = (255, 236, 90, 255)
FAISCA_C = (255, 255, 210, 255)


def faisca(t, cx, cy, grande=False):
    """Estrelinha de curto-circuito."""
    t.pxs([(cx, cy - 1), (cx - 1, cy), (cx + 1, cy), (cx, cy + 1)], FAISCA)
    t.px(cx, cy, FAISCA_C)
    if grande:
        t.pxs([(cx, cy - 2), (cx - 2, cy), (cx + 2, cy), (cx, cy + 2)], FAISCA)


def glitch(t, pontos):
    cores = (ROXO, CIANO, MAGENTA)
    for i, (x, y) in enumerate(pontos):
        t.ret(x, y, x + 1, y + 1, cores[i % 3])


# -------------------------------------------------------------- GATONET
def gatonet(t, costas=False):
    """Gato preto de rua, magrelo, sentado e enrolado nos fios do "gato" de luz
    puxado do poste; o rabo é um cabo descascado soltando faísca. ELÉTRICO/SOMBRIO."""
    pelo = (62, 56, 80, 255)
    pelo_e = (42, 38, 56, 255)
    rosa = (210, 120, 150, 255)
    fio_v = (214, 52, 52, 255)
    fio_a = (60, 110, 220, 255)
    cobre = (230, 150, 70, 255)

    # rabo: sobe pela direita e faz um gancho
    t.linha([(38, 56), (46, 55), (51, 50), (53, 42), (52, 34), (55, 28)], pelo, 3)
    t.elipse(30, 46, 10, 12, pelo)                   # corpo magrelo sentado
    t.elipse(30, 55, 11, 5, pelo)                    # ancas
    t.ret(23, 44, 26, 59, pelo)                      # patas da frente
    t.ret(31, 44, 34, 59, pelo)
    t.elipse(29, 26, 11, 9, pelo)                    # cabeça
    t.poli([(19, 22), (17, 10), (26, 18)], pelo)     # orelhas
    t.poli([(32, 18), (40, 9), (39, 22)], pelo)

    t.luz()

    t.poli([(20, 19), (19, 13), (23, 18)], rosa)     # dentro das orelhas
    t.poli([(35, 18), (38, 13), (37, 19)], rosa)
    t.pxs([(24, 59), (25, 59), (32, 59), (33, 59)], pelo_e)   # dedinhos
    # os fios do gato de luz enrolados no corpo
    t.linha([(8, 30), (18, 38), (40, 44), (44, 40)], fio_v, 1)
    t.linha([(8, 32), (18, 40), (40, 46)], escurecer(fio_v), 1)
    t.linha([(6, 40), (20, 50), (40, 52), (46, 48)], fio_a, 1)
    t.linha([(6, 42), (20, 52), (40, 54)], escurecer(fio_a), 1)
    t.anel(44, 44, 3, 3, fio_v, 1)                   # a laçada solta
    t.pxs([(6, 29), (7, 29), (5, 39), (4, 39)], cobre)   # ponta dos fios, descascadas
    faisca(t, 4, 30)
    # a ponta do rabo: cabo descascado com cobre e faísca
    t.ret(54, 24, 56, 28, PRETO)
    t.pxs([(54, 22), (56, 21), (55, 23)], cobre)
    faisca(t, 57, 18, True)
    faisca(t, 51, 20)
    if not costas:
        for cx in (24, 34):                          # olhos amarelos de rua
            t.elipse(cx, 26, 3, 3, (255, 214, 40, 255))
            t.ret(cx, 24, cx, 28, PRETO)
            t.px(cx - 1, 25, BRANCO)
        t.pxs([(29, 29), (28, 30), (30, 30)], rosa)  # nariz
        # sorriso malandro, torto pra um lado
        t.pxs([(25, 32), (26, 33), (27, 33), (28, 32), (29, 33), (30, 33), (31, 33),
               (32, 32), (33, 31)], PRETO)
        t.px(31, 34, BRANCO)                         # dentinho
        for y in (29, 31):                           # bigode
            t.linha([(14, y - 1), (20, y)], (160, 150, 180, 255), 1)
            t.linha([(38, y), (44, y - 1)], (160, 150, 180, 255), 1)
    else:
        t.linha([(29, 20), (29, 40)], pelo_e, 1)     # espinha
    t.contorno()
    return t


# ------------------------------------------------------------ GAMBIARRA
def gambiarra(t, costas=False):
    """Pilha de benjamins encaixados um no outro, amarrada com fita isolante; os
    braços são extensões e os pés, plugues. Solta faísca e pixel. ELÉTRICO/GLITCH."""
    plast = (236, 234, 224, 255)
    plast_e = (190, 186, 176, 255)
    fita = (40, 38, 44, 255)
    fio = (240, 140, 40, 255)
    furo = (60, 56, 64, 255)

    # braços: extensões laranja que saem do corpo e caem
    t.linha([(18, 36), (10, 34), (6, 40), (8, 48)], fio, 3)
    t.linha([(46, 36), (54, 30), (58, 24)], fio, 3)
    t.ret(4, 47, 11, 53, plast)                      # tomada da extensão na mão
    t.ret(55, 17, 61, 23, plast)
    # pernas: fio curto e plugue
    t.linha([(25, 50), (24, 56)], fio, 3)
    t.linha([(39, 50), (40, 56)], fio, 3)
    t.ret(20, 55, 28, 60, plast_e)
    t.ret(36, 55, 44, 60, plast_e)
    # benjamim de baixo: o corpo, com as três tomadas (cara na frente)
    t.ret(17, 30, 47, 52, plast)
    # benjamim do meio, torto
    t.poli([(21, 18), (43, 16), (44, 31), (22, 32)], plast)
    # benjamim de cima, pequeno, escorregado pro lado (o glitch)
    t.ret(28, 6, 42, 17, plast)

    t.luz()

    # a fita isolante dando voltas
    t.ret(17, 40, 47, 42, fita)
    t.poli([(21, 24), (43, 22), (43, 24), (21, 26)], fita)
    t.pxs([(48, 41), (49, 42), (49, 43)], fita)       # a ponta solta da fita
    # tomadas nos benjamins de cima (formato novo, sextavado)
    for cx, cy in ((30, 11), (38, 11)):
        t.px(cx, cy, furo)
    t.px(34, 13, furo)
    t.ret(4, 49, 11, 49, plast_e)
    t.pxs([(6, 50), (9, 50)], furo)
    t.pxs([(57, 20), (59, 20)], furo)
    # pinos dos plugues
    t.pxs([(22, 61), (26, 61), (38, 61), (42, 61)], (200, 200, 210, 255))
    # fios soltos soltando faísca
    t.linha([(34, 6), (33, 2), (36, 0)], fio, 1)
    t.linha([(42, 8), (48, 5), (50, 8)], (60, 110, 220, 255), 1)
    faisca(t, 37, 2, True)
    faisca(t, 51, 9)
    faisca(t, 12, 28)
    faisca(t, 3, 44)
    if not costas:
        # tomada grande do corpo = cara: dois furos são olhos, o terceiro, boca
        t.elipse(32, 42, 12, 9, plast_e)
        t.elipse(32, 42, 11, 8, clarear(plast_e, 0.4))
        for cx in (27, 37):
            t.elipse(cx, 40, 3, 3, furo)
            t.px(cx - 1, 39, (255, 236, 90, 255))    # brilho de faísca no olho
        t.elipse(32, 46, 2, 2, furo)
        t.pxs([(29, 46), (35, 46)], furo)
        # tomadas do benjamim do meio viram bochechas/ornamento
        t.pxs([(26, 28), (29, 28), (35, 27), (38, 27)], furo)
    else:
        t.ret(21, 34, 43, 48, plast_e)               # a tampa de trás, parafusada
        t.pxs([(23, 36), (41, 36), (23, 46), (41, 46)], furo)
    # faixas deslocadas e pixels soltos
    for x in range(29, 43):
        t.px(x + 3, 14, t.cor(x, 14))
    glitch(t, [(14, 12), (52, 44), (8, 20), (56, 54), (48, 2), (14, 58)])
    t.contorno()
    return t


# -------------------------------------------------------------- ORELHAO
def orelhao(t, costas=False):
    """O orelhão da esquina, vivo: cúpula laranja de ovo cortado num poste, a
    cara lá dentro da concha e o fone pendurado pelo fio feito braço. ELÉTRICO/NORMAL."""
    laranja = (244, 130, 32, 255)
    laranja_e = (196, 90, 24, 255)
    dentro = (255, 204, 96, 255)
    poste = (150, 150, 160, 255)
    fone = (92, 96, 110, 255)
    caixa = (170, 176, 186, 255)

    t.ret(28, 42, 34, 58, poste)                     # o poste
    t.poli([(20, 60), (24, 56), (38, 56), (42, 60)], escurecer(poste))   # base
    t.elipse(31, 24, 18, 20, laranja)                # a cúpula-ovo
    t.ret(24, 43, 38, 45, laranja_e)                 # a borda de baixo

    t.luz()

    if not costas:
        t.elipse(31, 28, 13, 15, laranja_e)          # a abertura da concha
        t.elipse(31, 28, 12, 14, dentro)
        t.elipse(31, 21, 10, 7, clarear(dentro, 0.3))
        # o aparelho lá dentro vira o queixo
        t.ret(25, 32, 37, 41, caixa)
        t.ret(25, 32, 37, 32, clarear(caixa))
        for x in (27, 30, 33):                       # teclinhas
            for y in (35, 38):
                t.ret(x, y, x + 1, y, (90, 96, 110, 255))
        t.ret(35, 33, 36, 34, (80, 200, 120, 255))   # visor
        # a cara
        for cx in (26, 36):
            t.elipse(cx, 24, 3, 4, PRETO)
            t.px(cx - 1, 22, BRANCO)
            t.px(cx, 23, BRANCO)
        t.pxs([(21, 28), (22, 28), (40, 28), (41, 28)], (250, 140, 110, 255))   # bochechas
        t.pxs([(29, 29), (30, 30), (31, 30), (32, 30), (33, 29)], PRETO)
    else:
        t.elipse(31, 22, 13, 14, laranja_e)          # o gomo de trás da cúpula
        t.elipse(31, 22, 12, 13, laranja)
        t.linha([(31, 6), (31, 40)], laranja_e, 1)
    # o fio espiral (braço) saindo da concha e o fone pendurado nele
    cabo = (120, 124, 136, 255)
    for i, y in enumerate(range(33, 45, 2)):
        x = 48 + (i % 2)
        t.ret(x, y, x + 2, y + 1, cabo)
        t.px(x + (0 if i % 2 else 2), y, clarear(cabo, 0.4))
    t.ret(49, 45, 51, 46, fone)                      # o fone, de pé
    t.ret(49, 45, 52, 57, fone)
    t.elipse(51, 46, 4, 3, fone)                     # bocal de ouvir
    t.elipse(51, 57, 4, 3, fone)                     # bocal de falar
    t.pxs([(49, 45), (48, 46), (49, 49), (49, 52)], clarear(fone, 0.4))
    t.pxs([(51, 46), (53, 46), (51, 57), (53, 57)], (30, 30, 36, 255))
    faisca(t, 57, 42)
    faisca(t, 10, 12)
    t.contorno()
    return t


# ------------------------------------------------------------- CHUVISCO
def chuvisco(t, costas=False):
    """TV de tubo de madeira com perninhas, antena com bombril na ponta e a
    tela cheia de chuvisco: os olhos são o chiado que se juntou. GLITCH/NORMAL."""
    madeira = (150, 96, 56, 255)
    madeira_e = (110, 68, 40, 255)
    moldura = (70, 66, 74, 255)
    antena = (190, 190, 200, 255)
    bombril = (208, 200, 186, 255)
    botao = (220, 190, 110, 255)

    # antena em V
    t.linha([(30, 20), (18, 5)], antena, 1)
    t.linha([(34, 20), (46, 3)], antena, 1)
    t.elipse(32, 20, 4, 2, moldura)
    # perninhas palito
    for x0, x1 in ((20, 17), (44, 47)):
        t.linha([(x0, 48), (x1, 57)], moldura, 2)
        t.ret(x1 - 3, 57, x1 + 2, 59, moldura)
    # a caixa
    t.ret(10, 21, 54, 50, madeira)
    t.ret(10, 21, 54, 22, madeira_e)

    t.luz()

    # bombril: bolotas de palha de aço nas pontas da antena
    rng = random.Random(1073)
    for cx, cy in ((17, 4), (47, 3)):
        t.elipse(cx, cy, 3, 3, bombril)
        for _ in range(8):
            t.px(cx + rng.randint(-3, 3), cy + rng.randint(-3, 3),
                 rng.choice(((150, 146, 140, 255), BRANCO, bombril)))
    # veio da madeira
    for y in (27, 36, 45):
        t.linha([(12, y), (16, y)], madeira_e, 1)
    # painel dos botões
    t.ret(45, 25, 51, 47, madeira_e)
    for cy in (29, 36):
        t.elipse(48, cy, 2, 2, botao)
        t.px(48, cy - 2, PRETO)
    t.ret(46, 41, 50, 46, (90, 60, 40, 255))         # alto-falante
    for y in (42, 44):
        t.linha([(46, y), (50, y)], PRETO, 1)
    if not costas:
        # a tela: tubo arredondado e chuvisco
        t.ret(13, 24, 43, 47, moldura)
        t.ret(15, 25, 41, 46, (40, 40, 44, 255))
        t.ret(14, 26, 42, 45, (40, 40, 44, 255))
        rng = random.Random(7)
        cinzas = ((40, 40, 44, 255), (110, 110, 116, 255), (180, 180, 186, 255), BRANCO)
        for y in range(26, 46):
            for x in range(15, 42):
                if (x in (15, 41)) and y in (26, 45):
                    continue
                t.px(x, y, rng.choice(cinzas))
        # uma faixa da imagem deslocada (a TV rolando)
        for x in range(15, 42):
            t.px(x, 43, rng.choice((CIANO, (110, 110, 116, 255), BRANCO)))
        # os olhos: chuvisco que se juntou em dois borrões brancos com pupila
        for cx in (22, 34):
            t.ret(cx - 3, 30, cx + 3, 37, BRANCO)
            t.ret(cx - 4, 31, cx + 4, 36, BRANCO)
            t.ret(cx - 1, 32, cx + 1, 35, PRETO)
            t.pxs([(cx + 3, 30), (cx - 4, 36)], (180, 180, 186, 255))
        t.linha([(24, 41), (26, 40), (30, 40), (32, 41)], PRETO, 1)   # boquinha
    else:
        t.ret(16, 24, 42, 46, madeira_e)             # o traseiro com respiros
        for y in range(27, 45, 3):
            t.linha([(20, y), (38, y)], (70, 44, 30, 255), 1)
        t.ret(28, 46, 31, 50, moldura)               # o fio saindo
    glitch(t, [(6, 30), (57, 18), (4, 46), (58, 38), (10, 12)])
    t.contorno()
    return t


# ------------------------------------------------------------ CONCRETAO
def concretao(t, costas=False):
    """Golem de concreto branco de Brasília: cúpula no lugar do tronco, arcos
    de palácio nos braços, colunas nas pernas e rachaduras vazando pixel
    colorido. Os olhos brilham numa fenda. PEDRA/GLITCH."""
    concreto = (228, 228, 220, 255)
    concreto_e = (176, 176, 172, 255)
    sombra = (130, 132, 136, 255)
    vidro = (46, 64, 84, 255)

    # pernas: colunas afinando pra baixo, como as do Alvorada
    for x in (22, 42):
        t.poli([(x - 6, 44), (x + 6, 44), (x + 2, 58), (x - 2, 58)], concreto)
        t.ret(x - 5, 58, x + 5, 61, concreto_e)
    # braços: arcos
    t.linha([(16, 32), (8, 36), (5, 44), (6, 52)], concreto, 5)
    t.linha([(48, 32), (56, 36), (59, 44), (58, 52)], concreto, 5)
    t.elipse(6, 53, 4, 3, concreto_e)
    t.elipse(58, 53, 4, 3, concreto_e)
    # tronco: a cúpula do Congresso
    t.elipse(32, 36, 18, 13, concreto)
    t.ret(14, 36, 50, 46, concreto)
    t.ret(12, 44, 52, 48, concreto_e)                # a laje
    # cabeça: a cuia virada pra cima
    t.poli([(18, 12), (46, 12), (42, 20), (36, 23), (28, 23), (22, 20)], concreto)
    t.ret(30, 22, 34, 25, concreto_e)                # pescoço

    t.luz()

    t.ret(12, 47, 52, 48, sombra)                    # sombra da laje
    for x in (22, 42):                               # frisos das colunas
        t.linha([(x, 46), (x, 56)], concreto_e, 1)
    # arcos da fachada vazados no tronco
    for cx in (20, 26, 32, 38, 44):
        t.ret(cx - 2, 40, cx + 2, 44, vidro)
        t.elipse(cx, 40, 2, 2, vidro)
    t.linha([(19, 13), (45, 13)], BRANCO, 1)        # boca da cuia
    # rachaduras com o glitch vazando
    rachas = (((28, 26), (30, 30), (27, 34), (29, 37)),
              ((44, 28), (41, 32), (43, 36)),
              ((9, 38), (7, 42), (9, 45)),
              ((22, 50), (21, 53), (23, 55)),
              ((40, 15), (38, 18)))
    for pts in rachas:
        t.linha(list(pts), sombra, 1)
    t.pxs([(29, 30), (28, 34), (42, 32), (8, 42), (22, 53), (39, 17)],
          CIANO)
    t.pxs([(30, 31), (28, 35), (43, 33), (8, 43)], MAGENTA)
    t.pxs([(27, 33), (41, 31), (21, 52)], ROXO)
    if not costas:
        # a fenda dos olhos
        t.ret(21, 15, 43, 19, PRETO)
        t.ret(25, 16, 29, 18, CIANO)
        t.ret(35, 16, 39, 18, CIANO)
        t.pxs([(26, 16), (35, 16)], BRANCO)
    else:
        t.linha([(32, 24), (32, 44)], concreto_e, 1)  # junta de dilatação
    # faixa deslocada e pixels soltos
    for x in range(14, 32):
        t.px(x - 2, 34, t.cor(x, 34))
    glitch(t, [(4, 24), (58, 22), (12, 6), (52, 8), (2, 58), (60, 60)])
    t.contorno()
    return t


DESENHOS = {
    1064: (gatonet, "gatonet"),
    1065: (gambiarra, "gambiarra"),
    1066: (orelhao, "orelhao"),
    1073: (chuvisco, "chuvisco"),
    1074: (concretao, "concretao"),
}
