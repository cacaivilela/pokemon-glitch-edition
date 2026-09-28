"""LOTE 4 — ÁGUAS DO BRASIL: piranhas, caranguejo-uçá do mangue, boto-cor-de-rosa,
pirarucu e a IARA. Desenhados por forma com tools/pixelart.py, frente e costas."""
import math

from pixelart import Tela, clarear, escurecer

BRANCO = (250, 250, 250, 255)
PRETO = (30, 26, 34, 255)
DENTE = (246, 244, 232, 255)
AGUA = (96, 170, 230, 255)
AGUA_C = (190, 232, 255, 255)
LAMA = (104, 78, 52, 255)
LAMA_E = (74, 54, 38, 255)


def olho(t, cx, cy, r=3, iris=PRETO, brilho=BRANCO):
    t.elipse(cx, cy, r, r, iris)
    t.px(cx - 1, cy - 1, brilho)


def repintar(t, de, para, onde):
    """Troca a cor `de` por `para` nos pixels (x, y) em que `onde(x, y)` vale."""
    img = t.img.load()
    for y in range(t.lado):
        for x in range(t.lado):
            if img[x, y][:3] == de[:3] and onde(x, y):
                img[x, y] = para


def dentes(t, x1, x2, y, altura, cor=DENTE, pra_baixo=True, passo=3):
    """Fileira de dentes triangulares entre x1 e x2."""
    for x in range(x1, x2, passo):
        if pra_baixo:
            t.poli([(x, y), (x + passo - 1, y), (x + (passo - 1) / 2, y + altura)], cor)
        else:
            t.poli([(x, y), (x + passo - 1, y), (x + (passo - 1) / 2, y - altura)], cor)


# ------------------------------------------------------------ PIRANHITA
PRATA = (150, 160, 176, 255)
PRATA_E = (98, 106, 124, 255)
VERMELHO = (214, 54, 50, 255)
VERMELHO_E = (150, 30, 36, 255)
BOCA = (96, 20, 30, 255)


def piranhita(t, costas=False):
    """Piranha pequena e invocada: dorso prateado, barriga vermelha e uma
    mandíbula de baixo enorme, cheia de dente. ÁGUA/SOMBRIO."""
    t.poli([(44, 43), (58, 29), (61, 31), (56, 43), (61, 55), (58, 57)], PRATA_E)   # cauda
    t.poli([(26, 30), (34, 19), (42, 29)], PRATA_E)                    # barbatana de cima
    t.poli([(36, 53), (44, 61), (46, 53)], VERMELHO)                   # de baixo
    t.elipse(31, 42, 17, 14, PRATA)                                    # corpo
    t.poli([(10, 47), (7, 53), (12, 59), (26, 59), (30, 51)], VERMELHO)   # o queixo enorme
    repintar(t, PRATA, VERMELHO, lambda x, y: y > 44 + (x - 20) * 0.15)
    t.poli([(40, 45), (48, 49), (42, 52)], PRATA_E)                    # nadadeira do peito

    t.luz()

    for x, y in ((36, 33), (42, 37), (30, 37), (38, 41), (46, 41)):   # escamas brilhando
        t.px(x, y, clarear(PRATA, 0.5))
    if not costas:
        # a boca aberta, com dente em cima e dente embaixo
        t.poli([(11, 44), (24, 45), (26, 50), (12, 53)], BOCA)
        dentes(t, 11, 24, 44, 3)
        dentes(t, 12, 25, 53, 3, pra_baixo=False)
        olho(t, 22, 37, 3, (250, 210, 60, 255))
        t.elipse(22, 37, 1, 1, PRETO)
        t.linha([(17, 32), (25, 35)], PRETO, 2)                        # sobrancelha brava
        t.linha([(28, 39), (28, 49)], PRATA_E, 1)                      # guelra
    else:
        t.linha([(28, 39), (28, 49)], PRATA_E, 1)
    t.contorno()
    return t


# ----------------------------------------------------------- PIRANHORDA
def mini_piranha(t, x, y, pra_direita=False):
    """Piranhinha do cardume, 9px de comprido."""
    s = 1 if pra_direita else -1
    t.poli([(x - s * 3, y), (x - s * 7, y - 3), (x - s * 7, y + 3)], PRATA_E)
    t.elipse(x, y, 4, 3, PRATA)
    repintar(t, PRATA, VERMELHO, lambda px, py: py > y and abs(px - x) <= 4 and py <= y + 3)


def mini_rosto(t, x, y, pra_direita=False):
    s = 1 if pra_direita else -1
    t.px(x + s * 2, y - 1, PRETO)
    t.px(x + s * 4, y + 1, DENTE)
    t.px(x + s * 3, y + 1, BOCA)


def piranhorda(t, costas=False):
    """A piranha adulta, grandona e cheia de cicatriz, com dente de serra e o
    cardume de piranhinhas rodando em volta dela. ÁGUA/SOMBRIO."""
    t.poli([(46, 34), (62, 18), (63, 22), (58, 34), (63, 48), (62, 52)], PRATA_E)   # cauda
    t.poli([(22, 20), (34, 6), (46, 18)], PRATA_E)                     # barbatana de cima
    t.poli([(24, 22), (32, 13), (38, 20)], VERMELHO_E)                 # rasgada no meio
    t.poli([(38, 50), (48, 58), (52, 48)], VERMELHO)
    t.elipse(32, 34, 21, 18, PRATA)                                    # corpo
    t.poli([(6, 38), (2, 46), (8, 54), (28, 54), (32, 44)], VERMELHO)  # mandíbula
    repintar(t, PRATA, VERMELHO, lambda x, y: y > 38 + (x - 16) * 0.18)
    t.poli([(40, 38), (52, 42), (44, 47)], PRATA_E)
    for x, y, d in ((12, 12, True), (52, 60, False), (6, 60, True), (58, 6, False)):
        mini_piranha(t, x, y, d)

    t.luz()

    cicatriz = (228, 196, 196, 255)
    t.linha([(34, 22), (42, 32)], cicatriz, 1)                          # as cicatrizes
    t.pxs([(36, 23), (38, 26), (40, 29)], escurecer(cicatriz, 0.3))
    t.linha([(44, 24), (48, 30)], cicatriz, 1)
    t.linha([(30, 44), (38, 42)], clarear(VERMELHO, 0.4), 1)
    if not costas:
        t.poli([(7, 37), (24, 38), (28, 45), (9, 49)], BOCA)
        dentes(t, 7, 24, 37, 5, passo=4)
        dentes(t, 8, 27, 49, 5, pra_baixo=False, passo=4)
        olho(t, 22, 29, 3, (255, 60, 50, 255))
        t.elipse(22, 29, 1, 1, PRETO)
        t.linha([(15, 23), (26, 27)], PRETO, 2)
        t.linha([(28, 31), (28, 44)], PRATA_E, 1)
        for x, y, d in ((12, 12, True), (52, 60, False), (6, 60, True), (58, 6, False)):
            mini_rosto(t, x, y, d)
    else:
        t.linha([(28, 31), (28, 44)], PRATA_E, 1)
    t.contorno()
    return t


# -------------------------------------------------------- CARANGUEJINHO
UCA = (92, 84, 176, 255)
UCA_E = (58, 50, 120, 255)
LARANJA = (240, 128, 48, 255)
LARANJA_E = (184, 84, 32, 255)
METAL = (196, 204, 214, 255)
METAL_E = (120, 128, 142, 255)
FAISCA = (255, 236, 80, 255)


def perna(t, x0, y0, joelho, pe, cor=LARANJA, g=3):
    t.linha([(x0, y0), joelho, pe], cor, g)


def caranguejinho(t, costas=False):
    """Caranguejo-uçá filhote: casco azul-arroxeado, perna laranja, garrinhas
    pro alto, uma parabólica miudinha na cabeça e o pé sujo de lama.
    ÁGUA/ELÉTRICO."""
    t.elipse(32, 60, 22, 3, LAMA)                                       # poça de lama
    for s in (-1, 1):                                                   # 3 pernas de cada lado
        for i, dy in enumerate((0, 4, 8)):
            perna(t, 32 + s * 10, 44 + dy, (32 + s * (19 + i * 2), 42 + dy), (32 + s * (22 + i * 2), 58), g=2)
    for s in (-1, 1):                                                   # braços das garras
        perna(t, 32 + s * 11, 42, (32 + s * 17, 40), (32 + s * 18, 32), g=3)
    for cx in (13, 51):                                                 # garras
        t.elipse(cx, 29, 6, 5, LARANJA)
    t.elipse(32, 44, 15, 10, UCA)                                       # o casco
    t.ret(24, 32, 26, 37, UCA)                                          # talos dos olhos
    t.ret(38, 32, 40, 37, UCA)
    t.elipse(25, 31, 3, 3, UCA)
    t.elipse(39, 31, 3, 3, UCA)
    t.ret(31, 26, 32, 35, METAL_E)                                      # o cabinho da antena
    t.poli([(26, 22), (37, 18), (36, 24), (30, 27)], METAL)             # a parabólica

    t.luz()

    for cx, s in ((13, -1), (51, 1)):                                   # a boca da garra
        t.poli([(cx - s * 1, 27), (cx - s * 7, 23), (cx - s * 7, 29)], (0, 0, 0, 0))
        t.pxs([(cx + s * 2, 27), (cx + s * 3, 28)], clarear(LARANJA, 0.4))
    t.px(32, 20, FAISCA)                                                # a antena pegando sinal
    t.pxs([(34, 16), (35, 15), (29, 17)], FAISCA)
    t.elipse(31, 21, 1, 1, METAL_E)
    for x, y in ((12, 57), (50, 57), (20, 58), (44, 58)):               # lama nos pés
        t.ret(x - 2, y, x + 2, y + 2, LAMA_E)
    t.pxs([(9, 55), (55, 54), (27, 57)], LAMA)
    if not costas:
        olho(t, 25, 31, 2)
        olho(t, 39, 31, 2)
        t.linha([(28, 47), (32, 49), (36, 47)], UCA_E, 1)               # boquinha
        t.pxs([(24, 42), (40, 42)], clarear(UCA, 0.45))
    else:
        t.linha([(24, 42), (32, 38), (40, 42)], UCA_E, 1)               # a costura do casco
        t.linha([(22, 48), (42, 48)], UCA_E, 1)
    t.contorno()
    return t


# ------------------------------------------------------------- MANGUEBIT
def manguebit(t, costas=False):
    """Uma parabólica enfiada na lama: caranguejão do mangue com uma antena
    parabólica fincada nas costas cuspindo faísca e garras do tamanho do
    casco. ÁGUA/ELÉTRICO."""
    t.elipse(32, 60, 30, 4, LAMA)                                       # o lamaçal
    for s in (-1, 1):
        for i, dy in enumerate((0, 5, 10)):
            perna(t, 32 + s * 14, 44 + dy, (32 + s * (24 + i * 2), 40 + dy), (32 + s * (27 + i), 59), g=3)
    t.ret(33, 8, 35, 34, METAL_E)                                       # mastro da antena
    t.poli([(20, 12), (46, 0), (50, 8), (44, 16), (30, 20)], METAL)     # o prato
    t.elipse(32, 42, 20, 13, UCA)                                       # casco
    for s in (-1, 1):                                                   # braços grossos
        perna(t, 32 + s * 16, 40, (32 + s * 22, 38), (32 + s * 22, 30), g=5)
    t.elipse(10, 24, 9, 8, LARANJA)                                     # garrona esquerda
    t.elipse(54, 26, 8, 7, LARANJA)                                     # e a direita
    t.ret(24, 28, 26, 32, UCA)
    t.ret(38, 28, 40, 32, UCA)
    t.elipse(25, 27, 3, 3, UCA)
    t.elipse(39, 27, 3, 3, UCA)

    t.luz()

    # boca das garras
    t.poli([(10, 22), (0, 15), (0, 23)], (0, 0, 0, 0))
    t.poli([(54, 24), (64, 18), (64, 25)], (0, 0, 0, 0))
    t.pxs([(7, 20), (8, 19), (52, 23)], clarear(LARANJA, 0.45))
    # dentro do prato e o bico que recebe o sinal
    t.poli([(24, 12), (45, 3), (46, 8), (42, 13), (31, 17)], METAL_E)
    t.linha([(34, 11), (40, 4)], PRETO, 1)
    t.elipse(40, 4, 1, 1, VERMELHO)
    # faíscas em zigue-zague
    for pts in (((44, 2), (50, 0), (48, 3), (55, 2)),
                ((48, 10), (54, 12), (51, 14), (58, 16)),
                ((20, 8), (15, 5), (18, 3), (12, 1))):
        t.linha(list(pts), FAISCA, 1)
    t.pxs([(58, 8), (6, 6), (60, 13)], FAISCA)
    # manchas de lama no casco e nos pés
    for x, y in ((6, 58), (58, 58), (18, 60), (46, 60)):
        t.ret(x - 2, y - 1, x + 2, y + 1, LAMA_E)
    t.elipse(44, 48, 3, 2, LAMA)
    t.elipse(20, 50, 2, 1, LAMA)
    if not costas:
        olho(t, 25, 27, 2)
        olho(t, 39, 27, 2)
        t.linha([(28, 46), (30, 48), (32, 46), (34, 48), (36, 46)], UCA_E, 1)
    else:
        t.linha([(20, 38), (32, 34), (44, 38)], UCA_E, 1)
        t.linha([(18, 46), (46, 46)], UCA_E, 1)
    t.contorno()
    return t


# --------------------------------------------------------------- BOTINHO
ROSA = (244, 156, 184, 255)
ROSA_C = (255, 212, 224, 255)
ROSA_E = (206, 104, 140, 255)


def botinho(t, costas=False):
    """Boto-cor-de-rosa filhote pulando do rio em arco, focinho comprido e
    o sorriso de quem está brincando. ÁGUA/FADA."""
    # a água lá embaixo, espirrando
    t.elipse(32, 58, 24, 4, AGUA)
    for x, y, r in ((10, 52, 2), (54, 50, 2), (14, 47, 1), (50, 45, 1)):
        t.elipse(x, y, r, r, AGUA)
    # o corpo em arco: sai da água à direita e sobe pra esquerda
    caminho = [(44, 56, 5), (46, 48, 7), (44, 40, 9), (38, 33, 10), (30, 28, 10), (24, 24, 9)]
    for x, y, r in caminho:
        t.elipse(x, y, r, r, ROSA)
    t.poli([(40, 58), (38, 62), (52, 62), (48, 56)], ROSA)              # a cauda afundando
    t.elipse(22, 22, 10, 9, ROSA)                                       # cabeça (o melão)
    t.poli([(14, 24), (3, 30), (4, 33), (16, 30)], ROSA)                # o focinho comprido
    t.poli([(30, 34), (24, 44), (34, 40)], ROSA_E)                      # nadadeira
    t.poli([(36, 22), (42, 20), (40, 27)], ROSA_E)                      # corcova de boto

    t.luz()

    t.elipse(36, 38, 5, 4, ROSA_C)                                      # barriga clarinha
    t.elipse(30, 33, 4, 3, ROSA_C)
    for x, y in ((8, 44), (56, 42), (6, 50), (60, 48)):                 # gotas
        t.px(x, y, AGUA_C)
    t.linha([(12, 57), (22, 57)], AGUA_C, 1)
    t.linha([(38, 60), (52, 60)], AGUA_C, 1)
    if not costas:
        olho(t, 20, 20, 2)
        t.linha([(5, 32), (10, 31), (15, 29), (17, 27)], ROSA_E, 1)      # sorriso comprido
        t.pxs([(24, 26), (25, 26)], (255, 120, 150, 255))               # bochecha
        t.pxs([(21, 14), (22, 14)], ROSA_C)
    else:
        t.elipse(22, 22, 9, 8, ROSA)                                    # nuca
        t.elipse(24, 17, 1, 1, ROSA_E)                                  # o espiráculo
    t.contorno()
    return t


# ------------------------------------------------------------- ENCANTADO
def encantado(t, costas=False):
    """O boto encantado: boto rosa grande, de pé na cauda, elegante, com o
    chapéu branco que esconde o espiráculo nas festas. ÁGUA/FADA."""
    chapeu = (244, 240, 228, 255)
    fita = (40, 36, 48, 255)
    t.poli([(16, 62), (28, 52), (36, 52), (48, 62), (32, 58)], ROSA_E)  # cauda de pé
    t.poli([(24, 44), (40, 44), (36, 56), (28, 56)], ROSA)              # a cintura fina
    t.elipse(32, 38, 12, 13, ROSA)                                      # corpo
    t.elipse(31, 22, 11, 10, ROSA)                                      # cabeça
    t.poli([(22, 24), (8, 30), (9, 33), (24, 30)], ROSA)                # focinho
    t.poli([(20, 36), (12, 44), (14, 48), (24, 42)], ROSA)              # nadadeira na cintura
    t.poli([(42, 34), (50, 42), (47, 46), (41, 42)], ROSA)              # e a outra
    t.elipse(31, 13, 15, 3, chapeu)                                     # aba do chapéu
    t.poli([(23, 12), (24, 3), (32, 1), (39, 3), (40, 12)], chapeu)     # copa

    t.luz()

    t.elipse(31, 42, 6, 9, ROSA_C)                                      # peito claro
    t.poli([(27, 30), (31, 33), (35, 30), (31, 36)], (60, 150, 200, 255))   # gravatinha-borboleta
    t.ret(23, 9, 40, 11, fita)                                          # a fita do chapéu
    t.px(31, 3, escurecer(chapeu, 0.2))
    t.linha([(28, 2), (31, 4), (35, 2)], escurecer(chapeu, 0.15), 1)    # o vinco da copa
    # brilhinhos de encanto
    for x, y in ((6, 16), (54, 22), (52, 52), (10, 54)):
        t.pxs([(x, y - 1), (x - 1, y), (x + 1, y), (x, y + 1)], (255, 220, 240, 255))
        t.px(x, y, BRANCO)
    if not costas:
        olho(t, 27, 20, 2)
        t.linha([(24, 18), (28, 17)], PRETO, 1)                         # a sobrancelha de galã
        t.linha([(10, 32), (16, 31), (22, 29), (24, 26)], ROSA_E, 1)    # sorriso de lado
        t.pxs([(33, 24), (34, 24)], (255, 120, 150, 255))
    else:
        t.elipse(31, 22, 10, 7, ROSA)
    t.contorno()
    return t


# -------------------------------------------------------------- PIRARUCU
def pirarucu(t, costas=False):
    """Peixe gigante da Amazônia: corpo comprido cinza-esverdeado, cabeça
    chata de boca grande e a metade de trás toda em placas vermelhas duras.
    ÁGUA/PEDRA."""
    verde = (104, 124, 106, 255)
    verde_e = (68, 84, 72, 255)
    placa = (196, 52, 44, 255)
    placa_c = (236, 110, 86, 255)
    t.poli([(52, 44), (63, 32), (63, 56)], placa)                       # cauda redonda
    t.elipse(58, 44, 5, 11, placa)
    t.poli([(38, 34), (48, 26), (56, 30), (54, 38)], placa)             # dorsal lá atrás
    t.poli([(38, 54), (48, 62), (56, 58), (54, 50)], placa)             # anal
    t.elipse(33, 44, 24, 12, verde)                                     # corpo
    t.poli([(2, 42), (12, 34), (20, 33), (20, 55), (4, 52)], verde)     # cabeça chata
    repintar(t, verde, placa, lambda x, y: x > 36 + (y - 44) * 0.2)
    t.poli([(20, 50), (28, 58), (30, 51)], verde_e)                     # peitoral
    t.luz()

    # as placas: fileiras de escamas com a borda clara
    for fila, y in enumerate(range(35, 54, 4)):
        for x in range(38 + (fila % 2) * 3, 56, 6):
            if t.cor(x, y)[3] and t.cor(x + 3, y + 2)[3]:
                t.linha([(x, y), (x + 2, y + 2), (x, y + 4)], placa_c, 1)
    for fila, y in enumerate(range(36, 54, 4)):                          # escamas verdes miúdas
        for x in range(22 + (fila % 2) * 2, 36, 4):
            t.px(x, y, clarear(verde, 0.25))
    t.linha([(17, 35), (19, 44), (17, 53)], verde_e, 1)                 # opérculo
    if not costas:
        t.poli([(2, 45), (15, 46), (4, 50)], BOCA)                      # a bocarra entreaberta
        t.linha([(2, 45), (15, 46)], PRETO, 1)
        t.px(16, 47, PRETO)
        olho(t, 11, 40, 2, (230, 200, 70, 255))
        t.px(11, 40, PRETO)
        t.linha([(8, 37), (13, 37)], verde_e, 1)
    t.contorno()
    return t


# ------------------------------------------------------------------ IARA
def iara(t, costas=False):
    """A mãe-d'água: serpente-sereia de cauda verde-azulada comprida, cabeleira
    de alga escura escorrendo, pérola brilhando na testa, olhar que puxa pro
    fundo e uma espiral de água rodando em volta. ÁGUA/PSÍQUICO, lendária."""
    cauda = (54, 170, 160, 255)
    cauda_e = (34, 116, 124, 255)
    barriga = (196, 238, 214, 255)
    alga = (26, 72, 70, 255)
    alga_c = (46, 110, 96, 255)
    barbatana = (120, 214, 220, 255)
    perola = (250, 244, 255, 255)
    violeta = (180, 110, 255, 255)

    # a espiral de água por trás (anel inclinado, só a metade de trás)
    for a in range(0, 360, 4):
        r = math.radians(a)
        x = 32 + 27 * math.cos(r)
        y = 40 + 9 * math.sin(r)
        if math.sin(r) < 0:
            t.ret(round(x), round(y), round(x) + 1, round(y), AGUA)
    # a cauda em S, do chão até o peito
    caminho = [(50, 58, 3), (44, 58, 4), (36, 57, 5), (28, 55, 6), (22, 50, 6),
               (22, 44, 6), (27, 39, 7), (33, 34, 7), (35, 28, 7), (33, 22, 7)]
    for x, y, r in caminho:
        t.elipse(x, y, r, r, cauda)
    t.poli([(50, 56), (60, 50), (58, 58), (62, 63), (50, 61)], barbatana)   # a nadadeira da ponta
    # cabeleira de alga escorrendo pelas costas
    t.poli([(24, 10), (16, 20), (12, 34), (8, 44), (14, 40), (16, 48), (20, 36),
            (26, 24), (40, 12), (46, 24), (48, 36), (52, 30), (54, 40), (50, 18), (42, 6)], alga)
    t.elipse(33, 14, 11, 10, cauda)                                      # cabeça
    t.poli([(22, 12), (14, 6), (24, 8)], barbatana)                     # barbatanas-orelha
    t.poli([(44, 12), (52, 6), (42, 8)], barbatana)
    t.poli([(26, 5), (33, 0), (40, 5)], alga_c)                         # a crista da testa

    t.luz(poupar=(AGUA[:3],))

    # barriga clara acompanhando o S
    t.linha([(x - 2, y + 1) for x, y, r in caminho[1:-1]], barriga, 3)
    for x, y, r in caminho[2:-1]:                                       # as escamas da barriga
        t.px(x - 2, y + 1, clarear(barriga, 0.5))
    for x, y in ((18, 22), (14, 32), (46, 22), (50, 32), (12, 40)):     # fios de alga
        t.px(x, y, alga_c)
    t.linha([(54, 52), (60, 51)], cauda_e, 1)                           # raios da nadadeira
    t.linha([(54, 58), (60, 61)], cauda_e, 1)
    # a espiral da frente
    for a in range(0, 360, 4):
        r = math.radians(a)
        x = 32 + 27 * math.cos(r)
        y = 40 + 9 * math.sin(r)
        if math.sin(r) >= 0:
            t.ret(round(x), round(y), round(x) + 1, round(y), AGUA if a % 40 else AGUA_C)
    for x, y in ((6, 30), (58, 34), (4, 46), (60, 44)):
        t.px(x, y, AGUA_C)
    # a pérola na testa
    t.elipse(33, 8, 2, 2, perola)
    t.pxs([(33, 5), (30, 8), (36, 8)], (220, 200, 255, 255))
    if not costas:
        for cx in (28, 38):                                             # olho hipnótico
            t.elipse(cx, 15, 3, 2, violeta)
            t.anel(cx, 15, 3, 2, (110, 50, 190, 255), 1)
            t.px(cx, 15, PRETO)
            t.px(cx - 1, 14, BRANCO)
        t.linha([(31, 20), (33, 21), (35, 20)], cauda_e, 1)
    else:
        t.elipse(33, 14, 9, 8, alga)                                    # a cabeleira por trás
        t.elipse(33, 8, 2, 2, cauda)
    t.contorno()
    return t


DESENHOS = {
    1051: (piranhita, "piranhita"),
    1052: (piranhorda, "piranhorda"),
    1053: (caranguejinho, "caranguejinho"),
    1054: (manguebit, "manguebit"),
    1055: (botinho, "botinho"),
    1056: (encantado, "encantado"),
    1057: (pirarucu, "pirarucu"),
    1077: (iara, "iara"),
}
