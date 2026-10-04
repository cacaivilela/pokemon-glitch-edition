"""LOTE 25 — ILHA 6, MARAJOLTEON: as formas -BRAG da Ilha de Marajó.

Campo alagado, búfalo pastando com água no joelho, rio que encontra o mar e
cerâmica marajoara com as gregas vermelhas e pretas. Doze bichos de sempre que
ficaram ilhados ali por gerações: TAUROS virou búfalo, TYNAMO virou poraquê,
BARBOACH virou acari, QWILFISH virou baiacu, FEEBAS virou tambaqui, NATU virou
urutau, BALTOY virou boneca de barro marajoara, NOSEPASS virou muiraquitã,
YUNGOOS virou ariranha, SKWOVET virou cutia, SURSKIT virou jaçanã e SLOWPOKE
virou peixe-boi. Todos desenhados do zero, de pé no chão ou boiando perto da
base da tela.
"""
import math

from pixelart import Tela, clarear, escurecer  # noqa: F401

BRANCO = (250, 250, 250, 255)
PRETO = (30, 26, 34, 255)
VAZIO = (0, 0, 0, 0)

AGUA = (88, 150, 196, 255)
AGUA_C = (170, 216, 240, 255)
FAISCA = (255, 236, 90, 255)
FAISCA_C = (255, 252, 210, 255)
BRILHO_FADA = (255, 170, 220, 255)
BARRO = (226, 190, 138, 255)
BARRO_E = (178, 136, 92, 255)
GREGA = (170, 52, 36, 255)
GREGA_P = (46, 30, 28, 255)


def olho(t, cx, cy, r=2, iris=PRETO, brilho=BRANCO):
    t.elipse(cx, cy, r, r, iris)
    t.px(cx - 1, cy - 1, brilho)


def olhao(t, cx, cy, r, fundo, iris=PRETO):
    """Olho grande: fundo colorido, pupila e brilho."""
    t.elipse(cx, cy, r, r, fundo)
    t.elipse(cx, cy, max(1, r // 2), max(1, r // 2), iris)
    t.px(cx - 1, cy - 1, BRANCO)


def poca(t, cx, cy, rx, cor=AGUA):
    """Poça/lâmina d'água rasa embaixo do bicho."""
    t.elipse(cx, cy, rx, 2, cor)


def ondinhas(t, cx, cy, rx):
    for x in range(cx - rx + 3, cx + rx - 3, 6):
        t.pxs([(x, cy), (x + 1, cy - 1), (x + 2, cy)], AGUA_C)


def faisca(t, x, y, cor=FAISCA):
    """Raiozinho em zigue-zague de 7 px."""
    t.pxs([(x, y), (x + 1, y + 1), (x + 2, y + 2), (x + 1, y + 3),
           (x + 2, y + 4), (x + 3, y + 5), (x + 2, y + 6)], cor)


def estrela(t, x, y, cor=BRILHO_FADA):
    t.pxs([(x, y - 1), (x - 1, y), (x, y), (x + 1, y), (x, y + 1)], cor)


def cobra(t, pontos, r0, r1, cor):
    """Corpo roliço seguindo `pontos` (curva), afinando de r0 até r1."""
    amostras = []
    for (x0, y0), (x1, y1) in zip(pontos, pontos[1:]):
        n = max(2, int(math.hypot(x1 - x0, y1 - y0)))
        for i in range(n):
            amostras.append((x0 + (x1 - x0) * i / n, y0 + (y1 - y0) * i / n))
    amostras.append(pontos[-1])
    tot = len(amostras) - 1
    for i, (x, y) in enumerate(amostras):
        r = r0 + (r1 - r0) * i / tot
        t.elipse(round(x), round(y), round(r), round(r), cor)
    return amostras


def grega(t, x, y, cor=GREGA, passos=3):
    """Uma gregazinha marajoara: degrauzinho em espiral quadrada."""
    for i in range(passos):
        t.pxs([(x + 3 * i, y), (x + 3 * i + 1, y), (x + 3 * i + 2, y),
               (x + 3 * i + 2, y - 1), (x + 3 * i + 2, y - 2)], cor)


# ------------------------------------------------------------- TAUROS-BRAG
def taurosbrag(t, costas=False):
    """TAUROS-BRAG, o búfalo-de-marajó: couro preto-azulado, chifrão em meia-lua
    varrendo pra trás, o topete marrom e os TRÊS rabos do TAUROS, de pé na água
    rasa do campo alagado. NORMAL/ÁGUA."""
    pelo = (66, 66, 78, 255)
    pelo_e = (40, 40, 50, 255)
    focinho = (96, 92, 104, 255)
    chifre = (214, 204, 176, 255)
    chifre_e = (150, 136, 108, 255)
    topete = (132, 86, 50, 255)
    casco = (30, 28, 34, 255)

    poca(t, 33, 58, 29)
    # os três rabos, com o tufo na ponta
    for pts in (((50, 32), (57, 27), (60, 20)), ((52, 35), (59, 34), (62, 29)),
                ((51, 39), (57, 44), (61, 43))):
        t.linha(list(pts), pelo_e, 2)
        t.elipse(pts[-1][0], pts[-1][1], 2, 2, topete)
    # pernas de trás (mais escuras) e da frente
    for x in (27, 45):
        t.poli([(x - 3, 42), (x + 3, 42), (x + 3, 56), (x - 3, 56)], pelo_e)
    for x in (21, 40):
        t.poli([(x - 3, 42), (x + 3, 42), (x + 3, 56), (x - 3, 56)], pelo)
    # corpanzil e a corcova do lombo
    t.elipse(35, 36, 17, 10, pelo)
    t.elipse(26, 30, 10, 6, pelo)
    # cabeça baixa, focinho largo
    t.elipse(14, 35, 8, 7, pelo)
    t.elipse(9, 41, 6, 4, focinho)
    # os chifres: meia-lua saindo da testa pro lado e pra trás
    t.poli([(10, 30), (4, 27), (2, 21), (6, 15), (14, 12), (26, 13),
            (16, 16), (10, 20), (11, 25), (15, 29)], chifre)
    t.poli([(18, 29), (24, 25), (28, 19), (34, 18), (27, 22), (22, 29)], chifre_e)
    t.luz()

    # água batendo na canela
    t.ret(4, 55, 62, 57, AGUA)
    ondinhas(t, 33, 55, 28)
    for x in (18, 24, 37, 42):
        t.pxs([(x, 54), (x + 1, 54)], AGUA_C)
    # anéis do chifre
    for x, y in ((5, 22), (7, 17), (12, 14)):
        t.px(x, y, chifre_e)
        t.px(x + 1, y + 1, chifre_e)
    # topete do TAUROS entre os chifres
    t.poli([(11, 27), (14, 22), (17, 24), (19, 28)], topete)
    t.pxs([(13, 26), (15, 25), (16, 27)], clarear(topete, 0.3))
    # dobra do pescoço
    t.linha([(20, 32), (21, 40)], pelo_e, 1)
    if not costas:
        t.pxs([(4, 41), (7, 41)], PRETO)                          # narinas
        t.linha([(4, 43), (12, 44)], escurecer(focinho, 0.3), 1)    # boca
        t.poli([(10, 32), (15, 31), (15, 34), (11, 34)], BRANCO)   # olho bravo
        t.pxs([(13, 32), (13, 33), (14, 33)], (200, 40, 40, 255))
        t.linha([(9, 30), (16, 31)], PRETO, 1)                     # sobrancelha
    else:
        t.elipse(14, 34, 7, 6, pelo_e)                             # nuca
        t.linha([(22, 26), (44, 28)], clarear(pelo, 0.25), 1)      # espinha
    t.contorno()
    return t


# ------------------------------------------------------------- TYNAMO-BRAG
def tynamobrag(t, costas=False):
    """TYNAMO-BRAG, o poraquê: enguia comprida em S, lombo pardo-oliva, a
    barriga laranja do poraquê, as pintas amarelas do TYNAMO pelo corpo e a
    nadadeira longa por baixo. Solta faísca pra todo lado. ÁGUA/ELÉTRICO."""
    lombo = (92, 86, 64, 255)
    lombo_e = (60, 56, 42, 255)
    barriga = (232, 132, 56, 255)
    cara = (238, 232, 214, 255)
    pinta = (250, 212, 70, 255)

    poca(t, 38, 59, 22)
    caminho = [(19, 17), (33, 22), (38, 31), (28, 40), (26, 48), (38, 55), (54, 54), (60, 48)]
    # a barriga laranja, um tiquinho deslocada pra baixo
    cobra(t, [(x, y + 2) for x, y in caminho], 7, 2, barriga)
    amostras = cobra(t, caminho, 7, 2, lombo)
    # nadadeira anal comprida (acompanha a cauda por baixo)
    for x, y in amostras[len(amostras) * 2 // 3::2]:
        t.px(round(x), round(y) + 4, lombo_e)
        t.px(round(x), round(y) + 5, lombo_e)
    # cabeçona achatada com a cara clara do TYNAMO
    t.elipse(17, 17, 11, 9, lombo)
    t.elipse(15, 20, 9, 6, cara)
    t.luz(poupar=(FAISCA[:3], FAISCA_C[:3]))

    # pintas amarelas ao longo do lombo
    for i in range(6, len(amostras) - 6, 9):
        x, y = amostras[i]
        t.pxs([(round(x), round(y) - 1), (round(x) + 1, round(y) - 1),
               (round(x), round(y)), (round(x) + 1, round(y))], pinta)
    # as faíscas
    for x, y in ((44, 14), (50, 30), (6, 34), (12, 44), (48, 40), (30, 4)):
        faisca(t, x, y)
    t.pxs([(45, 13), (51, 29), (7, 33)], FAISCA_C)
    if not costas:
        # bocarra larga de peixe-elétrico e olhinhos redondos do TYNAMO
        t.linha([(7, 23), (12, 25), (20, 25), (24, 23)], PRETO, 1)
        t.pxs([(10, 24), (21, 24)], (200, 60, 70, 255))
        olho(t, 11, 17, 2)
        olho(t, 21, 17, 2)
        t.pxs([(8, 20), (24, 20)], (236, 120, 140, 255))            # bochecha
    else:
        t.elipse(17, 17, 10, 8, lombo)
        for x, y in ((12, 14), (18, 12), (22, 16), (15, 19)):
            t.pxs([(x, y), (x + 1, y)], pinta)
    t.contorno()
    return t


# ----------------------------------------------------------- BARBOACH-BRAG
def barboachbrag(t, costas=False):
    """BARBOACH-BRAG, o acari/cascudo: peixe de barriga chata com couraça de
    placas de aço, boca de ventosa embaixo, os bigodões do BARBOACH e a
    nadadeira de vela pintada. ÁGUA/AÇO."""
    couro = (104, 98, 88, 255)
    couro_e = (62, 58, 54, 255)
    placa = (156, 168, 180, 255)
    placa_e = (100, 110, 124, 255)
    pinta = (36, 34, 34, 255)
    ventosa = (214, 150, 140, 255)

    # nadadeira de vela (dorsal), levantada
    t.poli([(20, 32), (24, 12), (30, 11), (42, 22), (44, 34)], couro)
    # rabo em forquilha
    t.poli([(50, 42), (62, 30), (61, 40), (58, 44), (61, 50), (62, 56), (50, 48)], couro)
    # corpo: cabeçona larga e chata que vai afinando
    t.poli([(14, 34), (32, 30), (48, 38), (54, 44), (48, 50), (20, 54), (8, 52)], couro)
    t.elipse(16, 44, 13, 10, couro)
    # nadadeira do peito com o espinho grosso
    t.poli([(14, 50), (4, 58), (10, 59), (24, 54)], couro_e)
    t.poli([(30, 52), (26, 59), (36, 58), (38, 52)], couro_e)
    t.luz()

    # as placas de aço do lombo: fileiras de escamas
    for x in range(20, 50, 5):
        topo = 32 + (x - 20) // 4
        t.linha([(x, topo + 1), (x + 3, topo + 4), (x + 2, topo + 12)], placa, 2)
        t.linha([(x + 3, topo + 5), (x + 3, topo + 12)], placa_e, 1)
    t.linha([(18, 42), (52, 44)], placa_e, 1)                         # linha lateral
    # os raios e as pintas da vela
    for x0 in (23, 28, 33, 38):
        t.linha([(x0, 31), (x0 + 1 + (x0 - 23) // 3, 16 + (x0 - 23) // 2)], couro_e, 1)
    for x, y in ((26, 20), (31, 24), (35, 20), (24, 27), (38, 29), (29, 15)):
        t.pxs([(x, y), (x + 1, y)], pinta)
    # pintas pretas do couro
    for x, y in ((10, 40), (14, 46), (20, 49), (27, 47), (35, 50), (43, 47), (55, 36), (56, 50)):
        t.px(x, y, pinta)
    t.linha([(54, 43), (60, 36)], couro_e, 1)
    t.linha([(54, 45), (60, 52)], couro_e, 1)
    # espinho grosso do peito
    t.linha([(14, 50), (5, 57)], placa, 1)
    if not costas:
        # boca de ventosa embaixo do focinho e os bigodes
        t.elipse(8, 51, 4, 3, ventosa)
        t.elipse(8, 51, 2, 1, (120, 60, 60, 255))
        t.linha([(4, 49), (1, 44), (1, 38)], PRETO, 1)
        t.linha([(5, 52), (1, 56)], PRETO, 1)
        t.linha([(11, 53), (13, 58)], PRETO, 1)
        # olhinhos lá em cima da cabeça, como todo cascudo
        t.elipse(13, 38, 3, 2, (230, 214, 150, 255))
        t.pxs([(13, 38), (14, 38)], PRETO)
        t.px(12, 37, BRANCO)
    else:
        t.linha([(8, 42), (50, 38)], placa, 1)                        # crista do lombo
    t.contorno()
    return t


# ----------------------------------------------------------- QWILFISH-BRAG
def qwilfishbrag(t, costas=False):
    """QWILFISH-BRAG, o baiacu: bola estufada cheia de espinho, lombo escuro
    pintado de amarelo, barriga branca, o bico de dente do baiacu e o rabo do
    QWILFISH. SOMBRIO: incha e fica com cara de poucos amigos. ÁGUA/SOMBRIO."""
    lombo = (70, 66, 60, 255)
    lombo_e = (44, 40, 40, 255)
    barriga = (242, 236, 214, 255)
    espinho = (96, 70, 120, 255)
    pinta = (230, 200, 80, 255)

    cx, cy, r = 29, 35, 19
    # espinhos em volta da bola
    for i in range(18):
        a = math.tau * i / 18 + 0.1
        dx, dy = math.cos(a), math.sin(a)
        ox, oy = -dy, dx
        base = (cx + dx * (r - 2), cy + dy * (r - 2))
        ponta = (cx + dx * (r + 6), cy + dy * (r + 6))
        t.poli([(base[0] + ox * 2, base[1] + oy * 2), ponta,
                (base[0] - ox * 2, base[1] - oy * 2)], espinho)
    # rabo do QWILFISH
    t.poli([(46, 34), (60, 24), (58, 34), (61, 44), (46, 38)], lombo)
    # a bola
    t.elipse(cx, cy, r, r, lombo)
    t.elipse(cx, cy + 7, r - 2, r - 8, barriga)
    # nadadeirinha do peito
    t.poli([(32, 38), (40, 35), (39, 41)], espinho)
    t.luz()

    # pintas amarelas e as manchas escuras do lombo
    for x, y in ((18, 22), (26, 19), (34, 21), (40, 26), (22, 28), (30, 26), (14, 30), (42, 32)):
        t.pxs([(x, y), (x + 1, y), (x, y + 1), (x + 1, y + 1)], pinta)
    t.linha([(26, 33), (34, 33), (44, 36)], lombo_e, 1)
    t.linha([(52, 29), (57, 27)], lombo_e, 1)
    t.linha([(52, 38), (58, 41)], lombo_e, 1)
    if not costas:
        # o bico com os dentões do baiacu
        t.elipse(10, 37, 4, 4, (214, 140, 120, 255))
        t.ret(7, 35, 10, 36, BRANCO)
        t.ret(7, 38, 10, 39, BRANCO)
        t.linha([(6, 37), (11, 37)], PRETO, 1)
        # olho bravo e vermelho
        t.elipse(18, 28, 4, 4, BRANCO)
        t.elipse(19, 29, 2, 2, (200, 30, 50, 255))
        t.px(19, 29, PRETO)
        t.linha([(13, 23), (22, 26)], PRETO, 1)
        t.linha([(13, 24), (22, 27)], PRETO, 1)
    else:
        t.elipse(cx, cy, r - 1, r - 1, lombo)
        for x, y in ((22, 26), (30, 22), (36, 30), (26, 36), (34, 40)):
            t.pxs([(x, y), (x + 1, y), (x, y + 1), (x + 1, y + 1)], pinta)
    t.contorno()
    return t


# ------------------------------------------------------------- FEEBAS-BRAG
def feebasbrag(t, costas=False):
    """FEEBAS-BRAG, o tambaqui: peixão redondo e alto, costas pardo-oliva,
    barriga e nadadeiras pretas, as pintas azuis do FEEBAS e as nadadeiras
    esfarrapadas que viraram folha. Anda com uma castanha de seringueira na
    boca. ÁGUA/PLANTA."""
    costas_c = (140, 132, 88, 255)
    lado = (170, 164, 120, 255)
    preto = (46, 44, 42, 255)
    folha = (78, 150, 60, 255)
    folha_e = (44, 100, 40, 255)
    pinta = (70, 110, 190, 255)
    semente = (130, 76, 44, 255)

    # rabo de folha, esfarrapado
    t.poli([(48, 34), (62, 22), (60, 30), (63, 34), (59, 38), (63, 44), (60, 52), (48, 42)], folha)
    # nadadeira de cima e de baixo
    t.poli([(22, 20), (32, 10), (36, 14), (40, 12), (44, 26)], folha)
    t.poli([(30, 50), (36, 60), (40, 55), (44, 58), (46, 46)], preto)
    # o corpão alto
    t.elipse(28, 36, 21, 18, lado)
    t.poli([(10, 30), (30, 18), (48, 30), (26, 28)], costas_c)
    t.elipse(28, 46, 18, 8, preto)
    t.luz()
    t.ret(10, 44, 46, 44, VAZIO)  # fresta entre o lado e a barriga

    t.elipse(28, 46, 18, 8, preto)
    t.linha([(12, 43), (44, 43)], escurecer(lado, 0.2), 1)
    # nervuras das nadadeiras-folha
    t.linha([(49, 38), (61, 30)], folha_e, 1)
    t.linha([(49, 39), (61, 46)], folha_e, 1)
    t.linha([(26, 21), (36, 13)], folha_e, 1)
    # pintas azuis do FEEBAS
    for x, y in ((24, 26), (32, 24), (38, 30), (30, 33), (40, 38), (22, 35)):
        t.pxs([(x, y), (x + 1, y), (x, y + 1), (x + 1, y + 1)], pinta)
    # nadadeira do peito, folha pequena
    t.poli([(20, 40), (30, 38), (26, 46)], folha)
    t.linha([(21, 40), (27, 43)], folha_e, 1)
    if not costas:
        # olhão meio tristonho do FEEBAS
        t.elipse(15, 30, 4, 4, (238, 228, 190, 255))
        t.elipse(15, 31, 2, 2, PRETO)
        t.px(14, 29, BRANCO)
        t.linha([(11, 26), (18, 27)], escurecer(costas_c, 0.3), 1)
        # a boca com a semente
        t.elipse(7, 38, 3, 3, (180, 120, 110, 255))
        t.elipse(4, 40, 4, 4, semente)
        t.px(3, 38, clarear(semente, 0.4))
        t.linha([(1, 42), (6, 42)], escurecer(semente, 0.3), 1)
    else:
        t.linha([(12, 30), (46, 32)], escurecer(costas_c, 0.3), 1)
    t.contorno()
    return t


# --------------------------------------------------------------- NATU-BRAG
def natubrag(t, costas=False):
    """NATU-BRAG, o urutau (mãe-da-lua): a bolota do NATU em cor de casca de
    pau, de pé no toco quebrado, os olhões amarelos arregalados, bico miúdo e
    boca enorme, e a lua pálida atrás. VOADOR/FANTASMA."""
    pena = (138, 132, 110, 255)
    pena_e = (92, 86, 70, 255)
    pena_c = (190, 182, 156, 255)
    pau = (110, 84, 60, 255)
    pau_e = (72, 54, 40, 255)
    lua = (232, 236, 214, 255)
    musgo = (120, 150, 90, 255)

    # a lua lá atrás
    t.elipse(51, 11, 8, 8, lua)
    t.elipse(55, 9, 7, 7, VAZIO)
    # o toco quebrado
    t.poli([(24, 44), (26, 40), (29, 43), (33, 39), (36, 43), (40, 41), (41, 58), (23, 58)], pau)
    t.poli([(21, 58), (43, 58), (41, 55), (23, 55)], pau_e)
    # o rabo comprido do urutau, caindo pela frente do toco
    t.poli([(28, 38), (36, 38), (35, 53), (29, 53)], pena_e)
    # a bolota
    t.elipse(32, 28, 13, 14, pena)
    # tufinhos do NATU no alto da cabeça
    t.poli([(24, 17), (22, 9), (28, 15)], pena)
    t.poli([(40, 17), (42, 9), (36, 15)], pena)
    # asinhas coladas no corpo
    t.poli([(19, 26), (17, 40), (24, 38)], pena_e)
    t.poli([(45, 26), (47, 40), (40, 38)], pena_e)
    t.luz(poupar=(lua[:3],))

    # rajado de casca: é assim que ele some no pau
    for x, y in ((26, 32), (30, 36), (36, 34), (38, 30), (27, 38), (34, 40), (24, 28), (40, 24)):
        t.linha([(x, y), (x + 2, y + 1)], pena_e, 1)
    for x, y in ((29, 33), (35, 37), (33, 30), (25, 35)):
        t.px(x, y, pena_c)
    for y in range(40, 53, 3):
        t.linha([(29, y), (35, y + 1)], pena, 1)
    # veio do toco e o musgo
    t.linha([(27, 45), (27, 55)], pau_e, 1)
    t.linha([(37, 46), (38, 54)], pau_e, 1)
    t.pxs([(24, 47), (25, 48), (39, 50), (40, 49), (33, 56)], musgo)
    # as pontas vermelha e amarela das asas do NATU
    t.pxs([(18, 38), (19, 39), (46, 38), (45, 39)], (220, 70, 50, 255))
    t.pxs([(18, 36), (46, 36)], (240, 200, 70, 255))
    if not costas:
        olhao(t, 27, 24, 5, (250, 214, 60, 255))
        olhao(t, 38, 24, 5, (250, 214, 60, 255))
        # bico miúdo e a boca que rasga a cara
        t.linha([(26, 31), (32, 33), (38, 31)], PRETO, 1)
        t.poli([(31, 29), (34, 29), (32, 32)], (60, 52, 44, 255))
    else:
        t.linha([(32, 16), (32, 40)], pena_e, 1)
        for x, y in ((28, 22), (35, 26), (29, 30)):
            t.linha([(x, y), (x + 3, y + 1)], pena_e, 1)
    t.contorno()
    return t


# ------------------------------------------------------------- BALTOY-BRAG
def baltoybrag(t, costas=False):
    """BALTOY-BRAG, a boneca de cerâmica marajoara: cabeça de pote com a cara
    em T das estatuetas de Marajó, os olhos vermelhos do BALTOY, corpo de urna
    pintado de gregas vermelhas e pretas, os bracinhos e o pé de ponta em que
    ela gira. Das urnas funerárias ela herdou um fogo-fátuo. TERRA/FANTASMA."""
    alma = (170, 150, 230, 255)
    alma_c = (224, 214, 255, 255)

    # o fogo-fátuo girando embaixo do pé
    t.elipse(32, 58, 12, 3, alma)
    t.elipse(32, 58, 7, 1, alma_c)
    # corpo de urna: ombro largo afinando até a ponta
    t.poli([(16, 30), (48, 30), (44, 40), (37, 52), (32, 58), (27, 52), (20, 40)], BARRO)
    t.elipse(32, 32, 16, 5, BARRO)
    # bracinhos do BALTOY
    t.poli([(16, 31), (6, 38), (7, 42), (18, 36)], BARRO)
    t.poli([(48, 31), (58, 38), (57, 42), (46, 36)], BARRO)
    # pescoço e cabeça de pote
    t.ret(27, 22, 37, 28, BARRO_E)
    t.elipse(32, 14, 12, 10, BARRO)
    t.poli([(20, 12), (32, 1), (44, 12)], BARRO)
    t.luz(poupar=(alma_c[:3],))

    # faixas e gregas marajoaras no corpo
    t.linha([(17, 33), (47, 33)], GREGA_P, 1)
    t.linha([(20, 40), (44, 40)], GREGA_P, 1)
    grega(t, 20, 38, GREGA, 3)
    grega(t, 33, 38, GREGA, 3)
    t.linha([(24, 44), (40, 44)], GREGA, 1)
    grega(t, 26, 49, GREGA_P, 2)
    t.linha([(29, 52), (35, 52)], GREGA, 1)
    for x in (21, 26, 31, 36, 41):
        t.pxs([(x, 35), (x + 1, 36), (x + 2, 35)], GREGA)
    # espiral nos bracinhos
    t.pxs([(9, 39), (10, 38), (11, 39), (10, 40)], GREGA)
    t.pxs([(55, 39), (54, 38), (53, 39), (54, 40)], GREGA)
    # linhas da cabeça
    t.linha([(21, 19), (43, 19)], GREGA_P, 1)
    t.linha([(27, 7), (32, 3), (37, 7)], GREGA, 1)
    if not costas:
        # a cara em T: sobrancelha contínua descendo no nariz
        t.linha([(22, 10), (42, 10)], GREGA_P, 2)
        t.linha([(32, 11), (32, 16)], GREGA_P, 2)
        # os olhos vermelhos do BALTOY, redondos, com aro preto
        for cx in (26, 38):
            t.elipse(cx, 14, 3, 2, GREGA_P)
            t.elipse(cx, 14, 2, 1, (230, 60, 50, 255))
            t.px(cx - 1, 13, BRANCO)
        t.linha([(29, 18), (35, 18)], GREGA, 1)                  # boquinha
        # a tanga de barro marajoara na frente da urna
        t.poli([(26, 42), (38, 42), (32, 50)], GREGA)
        t.poli([(29, 43), (35, 43), (32, 47)], BARRO)
    else:
        grega(t, 22, 14, GREGA, 3)
        grega(t, 22, 16, GREGA_P, 3)
    for x, y in ((12, 52), (50, 50), (8, 46)):
        t.px(x, y, alma_c)
    t.contorno()
    return t


# ----------------------------------------------------------- NOSEPASS-BRAG
def nosepassbrag(t, costas=False):
    """NOSEPASS-BRAG, o muiraquitã: sapinho agachado de pedra verde polida, com
    o narigão vermelho do NOSEPASS, os dois furinhos do amuleto e o cordão de
    fibra passado por eles. Dá sorte a quem ele gosta. PEDRA/FADA."""
    jade = (70, 168, 124, 255)
    jade_e = (40, 118, 90, 255)
    jade_c = (160, 226, 190, 255)
    nariz = (212, 60, 56, 255)
    nariz_e = (150, 34, 40, 255)
    cordao = (196, 150, 90, 255)

    # o cordão, laçada por cima da cabeça
    t.anel(32, 15, 17, 13, cordao, 2)
    t.ret(10, 16, 54, 30, VAZIO)
    # pernas de trás dobradas, bem gordas
    t.elipse(13, 47, 9, 10, jade)
    t.elipse(51, 47, 9, 10, jade)
    # corpo agachado
    t.elipse(32, 43, 20, 14, jade)
    # cabeça larga com os dois calombos dos olhos
    t.elipse(32, 29, 17, 10, jade)
    t.elipse(21, 22, 6, 6, jade)
    t.elipse(43, 22, 6, 6, jade)
    # pés da frente, dedões espalhados
    for x in (22, 42):
        t.elipse(x, 56, 6, 3, jade)
    t.ret(6, 55, 20, 58, jade)
    t.ret(44, 55, 58, 58, jade)
    t.luz()

    # dedinhos
    for x in (8, 12, 16, 19, 25, 39, 45, 48, 52, 56):
        t.px(x, 58, jade_e)
    # dobras da perna e o brilho da pedra polida
    t.linha([(8, 42), (13, 38), (19, 42)], jade_e, 1)
    t.linha([(45, 42), (51, 38), (56, 42)], jade_e, 1)
    t.linha([(18, 26), (20, 24)], jade_c, 1)
    t.pxs([(14, 44), (15, 43), (47, 44)], jade_c)
    # os dois furinhos do amuleto nos lados da cabeça, com o cordão entrando
    for x in (16, 48):
        t.elipse(x, 28, 1, 1, jade_e)
    t.linha([(15, 27), (15, 17)], cordao, 1)
    t.linha([(49, 27), (49, 17)], cordao, 1)
    # brilhos de FADA
    for x, y in ((4, 30), (60, 26), (32, 3), (58, 38)):
        estrela(t, x, y)
    if not costas:
        # o narigão do NOSEPASS, bem no meio da cara
        t.poli([(28, 29), (36, 29), (32, 40)], nariz)
        t.poli([(32, 29), (36, 29), (32, 40)], nariz_e)
        t.px(30, 30, clarear(nariz, 0.4))
        # olhinhos nos calombos
        for cx in (21, 43):
            t.elipse(cx, 22, 4, 4, (236, 200, 80, 255))
            t.ret(cx - 4, 22, cx + 4, 22, PRETO)
            t.px(cx - 2, 20, BRANCO)
        # boca larga de sapo
        t.linha([(20, 36), (26, 38)], jade_e, 1)
        t.linha([(44, 36), (38, 38)], jade_e, 1)
    else:
        t.linha([(32, 22), (32, 52)], jade_e, 1)                  # sulco do lombo
        t.linha([(22, 34), (42, 34)], jade_c, 1)
    t.contorno()
    return t


# ------------------------------------------------------------ YUNGOOS-BRAG
def yungoosbrag(t, costas=False):
    """YUNGOOS-BRAG, a ariranha: em pé de guarda com os punhos erguidos, pelo
    marrom molhado, a mancha creme do pescoço (cada uma é diferente), rabo
    achatado de remo e a bocarra cheia de dente do YUNGOOS. ÁGUA/LUTADOR."""
    pelo = (112, 74, 46, 255)
    pelo_e = (74, 48, 30, 255)
    creme = (240, 222, 180, 255)
    faixa = (200, 164, 90, 255)
    boca = (150, 40, 50, 255)

    poca(t, 32, 59, 22)
    # rabo de remo, achatado, saindo pra direita
    t.poli([(38, 46), (54, 50), (61, 56), (56, 58), (38, 54)], pelo_e)
    # pernas e pés de nadadeira
    t.elipse(24, 55, 6, 3, pelo_e)
    t.elipse(40, 55, 6, 3, pelo_e)
    t.ret(23, 46, 29, 54, pelo)
    t.ret(35, 46, 41, 54, pelo)
    # tronco comprido
    t.elipse(32, 38, 11, 14, pelo)
    # braços em guarda
    t.linha([(23, 32), (15, 36), (14, 28)], pelo, 4)
    t.linha([(41, 32), (49, 36), (50, 28)], pelo, 4)
    t.elipse(14, 26, 4, 4, pelo_e)
    t.elipse(50, 26, 4, 4, pelo_e)
    # cabeça larga e achatada, orelhinhas
    t.elipse(32, 17, 12, 9, pelo)
    t.elipse(22, 10, 3, 3, pelo)
    t.elipse(42, 10, 3, 3, pelo)
    t.luz(poupar=(AGUA_C[:3],))

    ondinhas(t, 32, 59, 22)
    # a faixa clara do YUNGOOS na barriga
    t.poli([(29, 36), (35, 36), (36, 48), (28, 48)], faixa)
    # dedos dos punhos
    for x in (12, 48):
        t.linha([(x, 25), (x + 4, 25)], escurecer(pelo_e, 0.3), 1)
    if not costas:
        # a mancha creme do pescoço, irregular
        t.poli([(26, 25), (30, 23), (34, 26), (38, 24), (37, 31), (32, 33), (27, 31)], creme)
        t.pxs([(31, 29), (33, 28), (29, 27)], pelo)
        # a bocarra aberta do YUNGOOS
        t.poli([(23, 18), (41, 18), (38, 23), (26, 23)], boca)
        t.linha([(24, 18), (40, 18)], BRANCO, 1)
        t.pxs([(25, 19), (28, 19), (36, 19), (39, 19), (27, 22), (37, 22)], BRANCO)
        t.elipse(32, 14, 3, 2, PRETO)                                 # narigão
        t.px(31, 13, (120, 110, 120, 255))
        olho(t, 25, 12, 2)
        olho(t, 39, 12, 2)
        t.linha([(22, 9), (27, 11)], PRETO, 1)
        t.linha([(42, 9), (37, 11)], PRETO, 1)
        # bigodes
        t.pxs([(20, 16), (19, 17), (44, 16), (45, 17)], pelo_e)
    else:
        t.elipse(32, 38, 9, 12, pelo)
        t.linha([(32, 10), (32, 50)], pelo_e, 1)                    # risco escuro das costas
        t.linha([(31, 12), (31, 48)], faixa, 1)
    t.contorno()
    return t


# ------------------------------------------------------------ SKWOVET-BRAG
def skwovetbrag(t, costas=False):
    """SKWOVET-BRAG, a cutia: sentada nas pernas finas de corredora, pelo
    laranja-dourado, as bochechas estufadas do SKWOVET (cheias de castanha) e
    abraçada num ouriço de castanha-do-pará aberto. NORMAL/TERRA."""
    pelo = (204, 130, 60, 255)
    pelo_e = (140, 84, 40, 255)
    peito = (240, 196, 130, 255)
    bochecha = (236, 176, 110, 255)
    ourico = (120, 80, 50, 255)
    ourico_e = (80, 52, 34, 255)
    castanha = (180, 120, 70, 255)
    miolo = (246, 236, 214, 255)

    # rabinho curto (o do SKWOVET encolheu)
    t.elipse(50, 48, 6, 5, pelo_e)
    # pernas de trás compridas e finas, pés no chão
    t.poli([(20, 46), (26, 46), (22, 58), (14, 58)], pelo_e)
    t.poli([(38, 46), (44, 46), (50, 58), (42, 58)], pelo_e)
    # corpo em pera
    t.elipse(32, 42, 14, 14, pelo)
    # cabeça e as bochechas estufadas
    t.elipse(32, 20, 10, 9, pelo)
    t.elipse(21, 24, 7, 6, bochecha)
    t.elipse(43, 24, 7, 6, bochecha)
    # orelhinhas redondas
    t.elipse(24, 11, 3, 4, pelo)
    t.elipse(40, 11, 3, 4, pelo)
    t.luz()

    t.elipse(32, 42, 9, 10, peito)
    # o ouriço da castanha, aberto, seguro pelas mãozinhas
    t.elipse(32, 42, 8, 7, ourico)
    t.elipse(32, 40, 5, 4, ourico_e)
    for x, y in ((29, 39), (33, 38), (35, 41), (30, 42)):
        t.poli([(x, y), (x + 2, y - 1), (x + 3, y + 1)], castanha)
        t.px(x + 1, y, miolo)
    for x, y in ((25, 44), (38, 46), (28, 48), (36, 36)):
        t.px(x, y, ourico_e)
    t.elipse(23, 42, 3, 3, pelo)
    t.elipse(41, 42, 3, 3, pelo)
    t.pxs([(22, 42), (24, 43), (40, 43), (42, 42)], pelo_e)
    t.pxs([(14, 58), (16, 58), (48, 58), (50, 58)], PRETO)          # unhas
    # orelha por dentro
    t.pxs([(24, 10), (24, 11), (40, 10), (40, 11)], (220, 130, 120, 255))
    if not costas:
        olho(t, 27, 17, 2)
        olho(t, 37, 17, 2)
        t.elipse(32, 22, 2, 1, (70, 40, 34, 255))                    # nariz
        t.pxs([(31, 25), (33, 25), (32, 24)], (70, 40, 34, 255))
        t.pxs([(31, 26), (32, 26)], BRANCO)                         # dentinhos
        t.pxs([(17, 23), (18, 24), (46, 23), (45, 24)], pelo_e)     # bigode
    else:
        t.elipse(32, 42, 12, 13, pelo)
        t.linha([(32, 14), (32, 54)], pelo_e, 1)
        t.linha([(26, 30), (38, 30)], clarear(pelo, 0.2), 1)
    t.contorno()
    return t


# ------------------------------------------------------------ SURSKIT-BRAG
def surskitbrag(t, costas=False):
    """SURSKIT-BRAG, a jaçanã: ave de lombo castanho e pescoço preto, com o
    escudinho amarelo e a pontinha rosa do SURSKIT na testa, pernas finas e
    uns dedos compridíssimos abertos em X, andando por cima de uma folha de
    vitória-régia como o SURSKIT anda por cima d'água. NORMAL/ÁGUA."""
    castanho = (150, 70, 44, 255)
    castanho_e = (100, 44, 30, 255)
    preto = (40, 36, 44, 255)
    escudo = (250, 214, 60, 255)
    ponta = (240, 120, 170, 255)
    perna = (214, 224, 120, 255)
    asa = (230, 220, 90, 255)
    vit = (52, 120, 64, 255)
    vit_e = (34, 84, 46, 255)
    borda = (200, 70, 80, 255)

    # a vitória-régia: prato com a borda levantada
    t.elipse(32, 57, 30, 5, vit)
    t.linha([(3, 56), (4, 59), (60, 59), (61, 56)], borda, 1)
    # asa aberta pra cima (o amarelo que a jaçanã mostra)
    t.poli([(38, 28), (52, 12), (58, 14), (50, 28), (44, 34)], asa)
    t.poli([(40, 28), (52, 16), (54, 20), (46, 30)], castanho)
    # corpo
    t.elipse(33, 32, 12, 8, castanho)
    t.poli([(42, 30), (52, 34), (44, 36)], castanho_e)                 # cauda
    # pescoço e cabeça pretos
    t.poli([(22, 30), (20, 20), (25, 18), (28, 30)], preto)
    t.elipse(21, 16, 6, 5, preto)
    t.luz(poupar=(ponta[:3],))

    # pernas finas descendo pra folha
    t.linha([(29, 38), (27, 46), (24, 53)], perna, 1)
    t.linha([(37, 38), (39, 46), (42, 53)], perna, 1)
    # os dedos compridíssimos, abertos em X como as pernas do SURSKIT
    for (x, y) in ((24, 53), (42, 53)):
        for dx, dy in ((-14, -1), (-10, 3), (11, 3), (14, -1)):
            t.linha([(x, y), (x + dx, y + dy)], perna, 1)
    # nervuras da folha
    for x in (10, 20, 32, 44, 54):
        t.linha([(32, 57), (x, 55 if x != 32 else 54)], vit_e, 1)
    # penas da asa
    for x in (48, 52, 55):
        t.linha([(x - 6, 28), (x, 16)], (200, 176, 60, 255), 1)
    # o escudinho da testa e o bico
    t.poli([(16, 10), (20, 9), (20, 14), (16, 14)], escudo)
    t.pxs([(16, 8), (17, 8), (17, 7)], ponta)                       # a pontinha do SURSKIT
    t.poli([(16, 15), (10, 17), (16, 18)], escudo)
    t.px(16, 16, (200, 150, 40, 255))
    if not costas:
        olho(t, 20, 15, 1, (230, 180, 40, 255))
        t.px(20, 15, PRETO)
    else:
        t.linha([(26, 30), (42, 32)], castanho_e, 1)
    t.contorno()
    return t


# ----------------------------------------------------------- SLOWPOKE-BRAG
def slowpokebrag(t, costas=False):
    """SLOWPOKE-BRAG, o peixe-boi: corpão cinza-rosado do SLOWPOKE, focinho
    largo de bigode, nadadeirinhas no lugar das patas, o rabo virou remo
    redondo (com a pontinha branca de sempre) e a língua de fora, olhando pro
    nada. Boia num brilho de FADA. ÁGUA/FADA."""
    pele = (206, 150, 170, 255)
    pele_e = (150, 102, 124, 255)
    focinho = (240, 206, 196, 255)
    lingua = (230, 90, 110, 255)

    poca(t, 32, 59, 28)
    # o rabo de remo, saindo pra trás e pra cima
    t.linha([(42, 46), (50, 44), (54, 38)], pele, 5)
    t.elipse(56, 32, 7, 8, pele)
    t.elipse(56, 26, 4, 3, BRANCO)
    # o corpão
    t.elipse(34, 45, 20, 13, pele)
    # nadadeirinhas da frente
    t.elipse(20, 55, 7, 3, pele_e)
    t.elipse(40, 56, 6, 3, pele_e)
    # cabeçona e focinho largo
    t.elipse(18, 28, 13, 11, pele)
    t.elipse(13, 35, 10, 6, focinho)
    t.luz(poupar=(BRILHO_FADA[:3],))

    ondinhas(t, 32, 59, 28)
    t.linha([(26, 50), (46, 52)], pele_e, 1)                        # dobra da barriga
    t.linha([(52, 34), (60, 34)], pele_e, 1)
    for x, y in ((6, 4), (40, 16), (48, 10), (60, 44), (4, 48)):
        estrela(t, x, y)
    if not costas:
        # olhar vago do SLOWPOKE
        for cx in (14, 24):
            t.elipse(cx, 25, 3, 3, BRANCO)
            t.elipse(cx, 26, 1, 1, PRETO)
            t.linha([(cx - 3, 23), (cx + 3, 23)], pele_e, 1)
        # focinho de peixe-boi: bigode e narinas
        t.pxs([(9, 31), (12, 31)], PRETO)
        for x, y in ((6, 34), (8, 36), (18, 34), (20, 36), (10, 37), (16, 37)):
            t.px(x, y, pele_e)
        # a língua de fora
        t.linha([(8, 39), (18, 39)], pele_e, 1)
        t.elipse(11, 41, 3, 2, lingua)
    else:
        t.elipse(18, 28, 11, 9, pele)
        t.linha([(20, 36), (48, 38)], pele_e, 1)
    t.contorno()
    return t


DESENHOS = {
    21601: (taurosbrag, "taurosbrag"),
    21602: (tynamobrag, "tynamobrag"),
    21603: (barboachbrag, "barboachbrag"),
    21604: (qwilfishbrag, "qwilfishbrag"),
    21605: (feebasbrag, "feebasbrag"),
    21606: (natubrag, "natubrag"),
    21607: (baltoybrag, "baltoybrag"),
    21608: (nosepassbrag, "nosepassbrag"),
    21609: (yungoosbrag, "yungoosbrag"),
    21610: (skwovetbrag, "skwovetbrag"),
    21611: (surskitbrag, "surskitbrag"),
    21612: (slowpokebrag, "slowpokebrag"),
}
