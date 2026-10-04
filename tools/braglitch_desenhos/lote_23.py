"""LOTE 23 — as formas da ILHA GRANDULL (a Ilha Grande de Braglitch).

Mata atlântica fechada do costão até o Pico do Papagaio, trilha molhada,
riacho descendo pedra. Quem ficou preso aqui virou bicho de mata: MANKEY vira
macaco-prego de pedra na mão, DODUO um casal de seriemas, LICKITUNG um
tamanduá-bandeira, PINSIR e HERACROSS os besouros grandes do chão da mata
(rinoceronte e titã), YANMA a libélula do riacho, SLAKOTH uma preguiça
coberta de musgo, TROPIUS uma bananeira, PIKIPEK o pica-pau-de-cabeça-amarela,
MORELULL o cogumelo que brilha no escuro e FOMANTIS o louva-a-deus.
Nenhuma evolui.
"""
from pixelart import Tela, clarear, escurecer  # noqa: F401

BRANCO = (250, 250, 250, 255)
PRETO = (30, 26, 34, 255)
VAZIO = (0, 0, 0, 0)

FOLHA = (62, 140, 58, 255)
FOLHA_E = (36, 96, 44, 255)
FOLHA_C = (130, 196, 86, 255)
GALHO = (112, 80, 54, 255)
GALHO_E = (74, 52, 38, 255)


def curva(p0, p1, p2, n=10):
    """Pontos de uma curva quadrática de p0 a p2 puxada por p1."""
    return [(round((1 - u) ** 2 * p0[0] + 2 * (1 - u) * u * p1[0] + u * u * p2[0]),
             round((1 - u) ** 2 * p0[1] + 2 * (1 - u) * u * p1[1] + u * u * p2[1]))
            for u in (i / n for i in range(n + 1))]


def olho(t, cx, cy, r=2, iris=PRETO, brilho=BRANCO):
    t.elipse(cx, cy, r, r, iris)
    t.px(cx - 1, cy - 1, brilho)


def folhinha(t, x, y, dx, dy, cor=FOLHA):
    """Folha pequena em losango, da base (x, y) na direção (dx, dy)."""
    ox, oy = -dy / 2, dx / 2
    t.poli([(x, y), (x + dx / 2 + ox, y + dy / 2 + oy), (x + dx, y + dy),
            (x + dx / 2 - ox, y + dy / 2 - oy)], cor)


# ------------------------------------------------------------ MANKEY-BRAG
def mankeybrag(t, costas=False):
    """MANKEY-BRAG, o macaco-prego: a bola de pelo do MANKEY em marrom, o
    boné preto de topete do macaco-prego, cara creme com o focinho de porco
    bravo, pedra numa mão e coquinho na outra, rabo enrolado com folha na
    ponta. LUTADOR/PLANTA."""
    pelo = (150, 102, 62, 255)
    pelo_e = (100, 66, 42, 255)
    creme = (238, 214, 170, 255)
    bone = (46, 36, 32, 255)
    focinho = (226, 150, 132, 255)
    pedra = (150, 150, 146, 255)
    coco = (126, 84, 44, 255)

    # rabo enroladão pra direita, atrás do corpo
    t.linha(curva((42, 46), (63, 46), (58, 28), 12), pelo_e, 3)
    t.linha(curva((58, 28), (62, 18), (55, 18), 8), pelo_e, 3)
    # pernas e pés
    for x in (24, 40):
        t.ret(x - 3, 48, x + 3, 55, pelo)
        t.elipse(x + (-1 if x < 32 else 1), 57, 5, 2, pelo_e)
    # o corpo-bola
    t.elipse(32, 35, 17, 16, pelo)
    # orelhas de lado
    t.elipse(13, 30, 5, 6, pelo)
    t.elipse(51, 30, 5, 6, pelo)
    # braço esquerdo levantado com a pedra
    t.linha([(18, 38), (10, 30), (8, 20)], pelo, 5)
    t.elipse(8, 16, 6, 5, pedra)
    # braço direito com o coquinho
    t.linha([(46, 40), (54, 44)], pelo, 5)
    t.elipse(56, 45, 4, 4, coco)
    # boné preto com os dois topetes do macaco-prego
    t.poli([(17, 26), (19, 18), (26, 15), (38, 15), (45, 18), (47, 26),
            (40, 23), (24, 23)], bone)
    t.poli([(20, 20), (18, 9), (26, 17)], bone)
    t.poli([(44, 20), (46, 9), (38, 17)], bone)
    t.luz()

    t.elipse(13, 31, 2, 3, creme)
    t.elipse(51, 31, 2, 3, creme)
    t.pxs([(5, 14), (7, 13), (10, 18)], escurecer(pedra, 0.3))
    t.pxs([(55, 43), (57, 44)], escurecer(coco, 0.35))
    # dedos em volta da pedra e do coco
    t.pxs([(11, 20), (12, 19), (4, 19)], pelo)
    t.pxs([(53, 47), (54, 48)], pelo)
    # uma folha na ponta do rabo (PLANTA) e duas no pelo do peito
    folhinha(t, 55, 17, -3, -8, FOLHA)
    t.linha([(55, 17), (53, 11)], FOLHA_E, 1)
    if not costas:
        # a cara creme, a sobrancelha brava e o focinho de porco do MANKEY
        t.elipse(32, 33, 12, 9, creme)
        t.elipse(32, 45, 8, 5, creme)            # a barriga clara
        t.linha([(22, 27), (30, 30)], PRETO, 1)
        t.linha([(42, 27), (34, 30)], PRETO, 1)
        for cx in (26, 38):
            t.elipse(cx, 31, 2, 2, BRANCO)
            t.px(cx + (1 if cx < 32 else -1), 31, PRETO)
            t.px(cx, 31, PRETO)
        t.elipse(32, 37, 5, 3, focinho)
        t.pxs([(30, 37), (34, 37)], escurecer(focinho, 0.45))
        t.linha([(28, 41), (36, 41)], pelo_e, 1)
        folhinha(t, 22, 44, -3, 4, FOLHA)
        folhinha(t, 42, 44, 3, 4, FOLHA)
    else:
        # de costas: o boné cobre a nuca e o pelo tem a risca do lombo
        t.poli([(18, 28), (46, 28), (43, 34), (21, 34)], bone)
        t.linha([(32, 36), (32, 48)], pelo_e, 1)
        t.linha([(26, 40), (29, 46)], pelo_e, 1)
        t.linha([(38, 40), (35, 46)], pelo_e, 1)
    t.contorno()
    return t


# ------------------------------------------------------------ DODUO-BRAG
def _seriema(t, cx, cy, vira, costas, cinza, crista, bico, olho_az):
    """Uma cabeça de seriema: cabeça cinza, crista de penas em pé na testa,
    bico vermelho curto e a pele azul em volta do olho. `vira` = -1 olha pra
    esquerda, 1 pra direita."""
    t.elipse(cx, cy, 6, 5, cinza)
    # a crista: penas espetadas pra cima e pra trás, a marca da seriema
    for i, (dx, alto) in enumerate(((1, 10), (-1, 11), (-3, 9), (3, 8))):
        x0 = cx + vira * dx
        t.linha([(x0, cy - 3), (x0 - vira * 3, cy - 3 - alto)], crista, 1)
    t.poli([(cx + vira * 4, cy - 1), (cx + vira * 12, cy + 1), (cx + vira * 4, cy + 3)], bico)
    t.linha([(cx + vira * 5, cy + 1), (cx + vira * 11, cy + 1)], escurecer(bico, 0.35), 1)
    if not costas:
        t.elipse(cx + vira * 1, cy - 1, 2, 2, olho_az)
        t.px(cx + vira * 1, cy - 1, PRETO)
        t.px(cx + vira * 2, cy - 1, (230, 190, 60, 255))


def doduobrag(t, costas=False):
    """DODUO-BRAG, o casal de seriemas: o corpo redondo e as duas cabeças em
    pescoço comprido do DODUO, mas cinza-palha riscado, com a crista de penas
    em pé, bico e pernas vermelhas de seriema. NORMAL/LUTADOR."""
    palha = (186, 168, 136, 255)
    palha_e = (130, 114, 90, 255)
    cinza = (170, 162, 150, 255)
    crista = (96, 86, 76, 255)
    vermelho = (214, 60, 48, 255)
    azul = (120, 190, 230, 255)
    cauda = (92, 80, 66, 255)

    # a cauda comprida em leque por trás, faixada
    t.poli([(40, 40), (58, 34), (62, 40), (46, 48)], cauda)
    # pernas compridas vermelhas, com os dedos
    for x0, x1 in ((27, 24), (37, 40)):
        t.linha([(x0, 46), (x1, 57)], vermelho, 2)
        t.linha([(x1 - 4, 58), (x1 + 4, 58)], vermelho, 1)
        t.px(x1 - 1, 57, vermelho)
    # corpo
    t.elipse(32, 39, 14, 10, palha)
    # os dois pescoços, tortos cada um pra um lado
    t.linha(curva((27, 33), (20, 28), (18, 16), 8), cinza, 4)
    t.linha(curva((37, 33), (46, 26), (46, 14), 8), cinza, 4)
    t.luz()
    for x in (48, 52, 56):
        t.linha([(x, 37), (x + 1, 44)], palha, 1)
    _seriema(t, 17, 14, -1, costas, cinza, crista, vermelho, azul)
    _seriema(t, 47, 12, 1, costas, cinza, crista, vermelho, azul)
    # peito riscado (as estrias finas da seriema)
    for y in (36, 39, 42, 45):
        for x in range(22, 43, 4):
            t.px(x + (y % 2), y, palha_e)
    # asa dobrada
    t.poli([(34, 34), (44, 36), (40, 44), (32, 42)], palha_e)
    t.linha([(35, 37), (42, 38)], palha, 1)
    if costas:
        t.linha([(32, 30), (32, 46)], palha_e, 1)
    t.contorno()
    return t


# -------------------------------------------------------- LICKITUNG-BRAG
def lickitungbrag(t, costas=False):
    """LICKITUNG-BRAG, o tamanduá-bandeira: o corpo em pé, redondo e
    barrigudo do LICKITUNG, mas cinza com a faixa preta de borda branca
    atravessando o peito, focinho de tubo comprido com a língua enrolada,
    garras e o rabo-bandeira de pelo. NORMAL/TERRA."""
    cinza = (158, 148, 132, 255)
    cinza_e = (108, 100, 90, 255)
    pelo = (82, 66, 52, 255)
    pelo_c = (124, 104, 82, 255)
    preto = (40, 34, 34, 255)
    lingua = (236, 120, 150, 255)
    garra = (236, 230, 214, 255)

    # o rabo-bandeira: um leque enorme de pelo atrás, à direita
    t.poli([(40, 48), (46, 30), (52, 16), (60, 10), (63, 22), (60, 40), (52, 54)], pelo)
    # pés grandes do LICKITUNG
    t.elipse(22, 57, 7, 3, cinza_e)
    t.elipse(40, 57, 7, 3, cinza_e)
    # corpo barrigudo
    t.elipse(31, 40, 15, 16, cinza)
    # cabeça e o focinho de tubo, comprido pra esquerda-baixo
    t.elipse(30, 18, 9, 8, cinza)
    t.poli([(23, 14), (8, 22), (4, 25), (5, 28), (10, 27), (26, 24)], cinza)
    # braços com as garras
    t.linha([(19, 34), (12, 42)], cinza, 5)
    t.linha([(43, 34), (49, 42)], cinza, 5)
    t.luz()
    for x0, x1 in ((47, 53), (51, 58), (55, 61)):   # o pelo do rabo
        t.linha([(x0, 50), (x1, 18)], pelo_c, 1)
    # garras curvas, a arma do tamanduá
    for x in (9, 12, 15):
        t.linha([(x, 44), (x - 1, 48)], garra, 1)
    for x in (47, 50, 53):
        t.linha([(x, 44), (x + 1, 48)], garra, 1)
    # a faixa preta de borda branca, na diagonal do ombro até a barriga
    faixa = [(18, 26), (27, 30), (36, 38), (44, 46)]
    t.linha(faixa, BRANCO, 7)
    t.linha(faixa, preto, 4)
    # a barriga clara do LICKITUNG, com as listrinhas
    t.elipse(28, 46, 7, 6, (216, 204, 180, 255))
    for y in (43, 46, 49):
        t.linha([(24, y), (31, y)], (190, 176, 150, 255), 1)
    # a língua comprida, saindo do tubo e enrolando
    lng = curva((5, 27), (0, 36), (6, 38), 8) + curva((6, 38), (12, 38), (10, 33), 6)
    t.linha(lng, lingua, 2)
    if not costas:
        olho(t, 28, 16, 1)
        t.px(27, 16, PRETO)
        t.px(6, 24, preto)                   # a ponta do focinho
        t.linha([(33, 9), (35, 11)], cinza_e, 1)   # orelhinha
        t.elipse(33, 20, 2, 1, (214, 150, 150, 255))
    else:
        t.elipse(31, 38, 11, 12, cinza)
        faixa = [(20, 26), (31, 34), (42, 30)]
        t.linha(faixa, BRANCO, 7)
        t.linha(faixa, preto, 4)
        t.linha([(31, 40), (31, 52)], cinza_e, 1)
    t.contorno()
    return t


# ------------------------------------------------------------ PINSIR-BRAG
def pinsirbrag(t, costas=False):
    """PINSIR-BRAG, o besouro-rinoceronte: o corpo em pé e as duas pinças do
    PINSIR viraram chifres de pedra de besouro-rinoceronte, curvos e
    grossos, com um terceiro chifre saindo da testa; carapaça de castanha
    brilhante com lascas de rocha. INSETO/PEDRA."""
    casca = (112, 68, 42, 255)
    casca_e = (70, 42, 30, 255)
    rocha = (150, 138, 120, 255)
    rocha_e = (100, 92, 82, 255)
    garra = (60, 44, 36, 255)

    # os dois chifres-pinça, saindo da cabeça e curvando pra dentro
    t.poli([(20, 22), (12, 12), (10, 2), (15, 1), (17, 10), (26, 18)], rocha)
    t.poli([(44, 22), (52, 12), (54, 2), (49, 1), (47, 10), (38, 18)], rocha)
    # pernas
    for x in (23, 41):
        t.ret(x - 3, 50, x + 3, 56, casca_e)
        t.elipse(x, 58, 5, 2, casca_e)
    # corpo largo em barril
    t.elipse(32, 38, 16, 16, casca)
    # braços com garra
    t.linha([(17, 36), (8, 42), (8, 48)], casca, 4)
    t.linha([(47, 36), (56, 42), (56, 48)], casca, 4)
    # o chifre do meio, de besouro-rinoceronte, subindo da testa
    t.poli([(28, 24), (29, 12), (32, 5), (35, 8), (36, 24)], rocha)
    t.luz()
    # dentes das pinças (a lembrança do PINSIR)
    for x, y in ((14, 8), (15, 12), (18, 15)):
        t.px(x + 1, y, rocha_e)
        t.px(x + 2, y, rocha_e)
    for x, y in ((49, 8), (48, 12), (45, 15)):
        t.px(x - 1, y, rocha_e)
        t.px(x - 2, y, rocha_e)
    t.linha([(33, 7), (32, 22)], clarear(rocha, 0.3), 1)
    # garras
    for x in (6, 9):
        t.px(x, 49, garra)
    for x in (55, 58):
        t.px(x, 49, garra)
    if not costas:
        # listras do tórax do PINSIR e a boca de dentinhos
        for y in (40, 45, 50):
            t.linha([(20, y), (44, y)], casca_e, 1)
        t.poli([(19, 30), (27, 28), (27, 32)], (240, 214, 90, 255))   # olhos bravos
        t.poli([(45, 30), (37, 28), (37, 32)], (240, 214, 90, 255))
        t.pxs([(25, 30), (39, 30)], PRETO)
        t.ret(27, 34, 37, 36, PRETO)
        for x in range(28, 37, 2):
            t.px(x, 34, BRANCO)
            t.px(x + 1, 36, BRANCO)
        # lascas de pedra na carapaça
        t.pxs([(18, 43), (19, 44), (46, 42), (45, 43)], rocha)
    else:
        # de costas: os élitros de rocha, com a costura no meio
        t.elipse(32, 38, 14, 14, rocha_e)
        t.elipse(31, 37, 12, 12, rocha)
        t.linha([(32, 25), (32, 52)], casca_e, 1)
        for x, y in ((25, 32), (38, 40), (26, 46), (36, 30)):
            t.pxs([(x, y), (x + 1, y), (x, y + 1)], rocha_e)
    t.contorno()
    return t


# --------------------------------------------------------- HERACROSS-BRAG
def heracrossbrag(t, costas=False):
    """HERACROSS-BRAG, o besouro-titã: a pose em pé e o chifre em forquilha do
    HERACROSS, mas de bronze e aço, com as mandíbulas serrilhadas enormes do
    titã e as antenas compridas. INSETO/AÇO."""
    bronze = (156, 98, 56, 255)
    bronze_e = (104, 62, 38, 255)
    aco = (178, 184, 196, 255)
    aco_e = (118, 124, 140, 255)
    olho_am = (255, 206, 60, 255)

    # élitros de bronze abertos atrás do corpo
    t.poli([(20, 26), (8, 38), (10, 54), (20, 50)], bronze_e)
    t.poli([(44, 26), (56, 38), (54, 54), (44, 50)], bronze_e)
    # pernas
    for x in (25, 39):
        t.ret(x - 3, 48, x + 3, 55, aco_e)
        t.elipse(x, 57, 5, 2, aco_e)
    # corpo
    t.elipse(32, 38, 13, 14, bronze)
    # cabeça
    t.elipse(32, 22, 8, 7, bronze)
    # o chifre do HERACROSS em aço, com a forquilha na ponta
    t.poli([(29, 18), (30, 6), (34, 6), (35, 18)], aco)
    t.poli([(25, 8), (28, 2), (32, 7), (36, 2), (39, 8), (32, 11)], aco)
    # antenas compridas do titã, pra trás
    t.linha(curva((26, 17), (16, 6), (4, 6), 8), aco_e, 1)
    t.linha(curva((38, 17), (48, 6), (60, 6), 8), aco_e, 1)
    # braços
    t.linha([(20, 34), (12, 42), (14, 48)], bronze, 4)
    t.linha([(44, 34), (52, 42), (50, 48)], bronze, 4)
    t.luz()
    t.linha([(31, 7), (31, 17)], clarear(aco, 0.4), 1)
    # as mandíbulas serrilhadas do titã, abertas embaixo da cabeça
    t.poli([(26, 26), (20, 30), (22, 34), (26, 30)], aco)
    t.poli([(38, 26), (44, 30), (42, 34), (38, 30)], aco)
    t.pxs([(22, 31), (24, 30), (42, 31), (40, 30)], aco_e)
    # placas de aço no peito
    t.linha([(22, 40), (42, 40)], aco_e, 1)
    t.linha([(23, 45), (41, 45)], aco_e, 1)
    if not costas:
        t.elipse(27, 22, 2, 2, olho_am)
        t.elipse(37, 22, 2, 2, olho_am)
        t.px(27, 22, PRETO)
        t.px(37, 22, PRETO)
        t.pxs([(25, 45), (39, 45), (13, 49), (51, 49)], aco)
    else:
        # de costas: os élitros fechados, bronze com reflexo de metal
        t.elipse(32, 38, 12, 14, bronze_e)
        t.elipse(31, 37, 10, 12, bronze)
        t.linha([(32, 25), (32, 52)], PRETO, 1)
        t.linha([(26, 30), (26, 46)], clarear(bronze, 0.35), 1)
        t.linha([(37, 30), (37, 46)], clarear(bronze, 0.35), 1)
    t.contorno()
    return t


# ------------------------------------------------------------ YANMA-BRAG
def yanmabrag(t, costas=False):
    """YANMA-BRAG, a libélula de riacho: os olhões compostos e as quatro asas
    do YANMA, corpo azul-turquesa de anéis escuros, a cauda com as duas
    barbatanas, parada em cima da água que respinga. INSETO/ÁGUA."""
    corpo = (48, 164, 196, 255)
    corpo_e = (24, 96, 130, 255)
    asa = (186, 226, 240, 255)
    asa_e = (110, 170, 200, 255)
    olho_v = (220, 70, 52, 255)
    olho_c = (255, 150, 110, 255)
    agua = (80, 150, 220, 255)
    agua_c = (180, 226, 255, 255)

    # a água do riacho embaixo, com o respingo
    t.elipse(32, 59, 18, 3, agua)
    # as quatro asas, duas de cada lado
    t.poli([(28, 26), (8, 12), (2, 16), (6, 22), (26, 30)], asa)
    t.poli([(28, 30), (6, 30), (2, 36), (8, 38), (26, 34)], asa)
    t.poli([(36, 26), (56, 12), (62, 16), (58, 22), (38, 30)], asa)
    t.poli([(36, 30), (58, 30), (62, 36), (56, 38), (38, 34)], asa)
    # corpo e a cauda comprida em anéis, descendo e curvando
    t.elipse(32, 29, 6, 7, corpo)
    t.linha(curva((32, 34), (33, 44), (40, 50), 10), corpo, 4)
    # as barbatanas da ponta do rabo do YANMA
    t.poli([(40, 50), (48, 46), (46, 51)], corpo)
    t.poli([(40, 50), (46, 55), (42, 56)], corpo)
    # a cabeça: praticamente só olho
    t.elipse(32, 17, 10, 7, olho_v)
    t.luz(poupar=(agua_c[:3],))
    # nervuras das asas
    for pts in (((26, 28), (6, 16)), ((26, 32), (5, 34)), ((38, 28), (58, 16)), ((38, 32), (59, 34))):
        t.linha(list(pts), asa_e, 1)
    t.pxs([(12, 15), (52, 15), (10, 33), (54, 33)], asa_e)
    for u in (0.2, 0.45, 0.7):                          # anéis da cauda
        x, y = curva((32, 34), (33, 44), (40, 50), 10)[round(u * 10)]
        t.linha([(x - 2, y), (x + 2, y)], corpo_e, 1)
    # respingo e as gotas subindo
    for x, y in ((20, 55), (44, 55), (24, 52), (41, 53)):
        t.px(x, y, agua_c)
    t.linha([(18, 59), (46, 59)], agua_c, 1)
    # pernas finas penduradas
    for x in (29, 32, 35):
        t.linha([(x, 34), (x + (x - 32), 39)], corpo_e, 1)
    if not costas:
        # os olhões com a faixa escura no meio, como o YANMA
        t.linha([(32, 11), (32, 23)], escurecer(olho_v, 0.45), 1)
        t.elipse(27, 15, 2, 2, olho_c)
        t.elipse(37, 15, 2, 2, olho_c)
        t.pxs([(26, 14), (36, 14)], BRANCO)
        t.pxs([(30, 23), (31, 24), (33, 24), (34, 23)], PRETO)
    else:
        t.linha([(32, 22), (32, 34)], corpo_e, 1)
    t.contorno()
    return t


# ----------------------------------------------------------- SLAKOTH-BRAG
def slakothbrag(t, costas=False):
    """SLAKOTH-BRAG, a preguiça com musgo: deitada de barriga num galho grosso
    como o SLAKOTH, mas é bicho-preguiça de verdade — pelo cinza-palha com
    manchas de musgo verde crescendo, a máscara escura do olho, o sorrisinho
    e as três garras compridas penduradas. NORMAL/PLANTA."""
    pelo = (150, 136, 110, 255)
    pelo_e = (104, 92, 74, 255)
    cara = (222, 210, 180, 255)
    mascara = (70, 54, 42, 255)
    musgo = (96, 150, 66, 255)
    musgo_c = (150, 200, 90, 255)
    garra = (232, 224, 204, 255)

    # o galho, atravessando embaixo
    t.poli([(0, 48), (63, 44), (63, 53), (0, 57)], GALHO)
    # braços pendurados pra baixo do galho, com as garras
    t.linha([(16, 44), (14, 56)], pelo, 5)
    t.linha([(46, 42), (48, 55)], pelo, 5)
    # corpo deitado em cima do galho
    t.elipse(36, 38, 20, 11, pelo)
    # a cabeça redonda na frente
    t.elipse(17, 32, 11, 10, pelo)
    t.luz()
    t.linha([(0, 56), (63, 52)], GALHO_E, 1)
    t.pxs([(8, 51), (30, 49), (55, 47)], GALHO_E)
    # musgo crescendo no pelo e no galho
    for cx, cy, rx, ry in ((38, 30, 6, 3), (50, 34, 4, 3), (28, 36, 3, 2), (22, 23, 4, 2),
                           (5, 50, 4, 2), (58, 46, 4, 2)):
        t.elipse(cx, cy, rx, ry, musgo)
        t.px(cx - rx + 2, cy - ry + 1, musgo_c)
        t.px(cx, cy - ry, musgo_c)
    folhinha(t, 40, 27, 3, -6, FOLHA)
    folhinha(t, 24, 21, -2, -6, FOLHA)
    # garras de três dedos
    for x0 in (12, 46):
        for i in range(3):
            t.linha([(x0 + i * 2, 57), (x0 + i * 2 + 1, 61)], garra, 1)
    if not costas:
        # a cara clara com a máscara escura da preguiça e o sorriso bobo
        t.elipse(16, 34, 8, 6, cara)
        t.poli([(9, 32), (14, 31), (15, 34), (10, 35)], mascara)
        t.poli([(23, 32), (18, 31), (17, 34), (22, 35)], mascara)
        t.linha([(11, 33), (13, 33)], PRETO, 1)        # olhinhos de sono
        t.linha([(19, 33), (21, 33)], PRETO, 1)
        t.pxs([(15, 36), (16, 36)], PRETO)
        t.pxs([(13, 38), (14, 39), (15, 39), (16, 39), (17, 39), (18, 38)], pelo_e)
    else:
        t.elipse(17, 32, 8, 7, pelo_e)
        t.elipse(16, 31, 6, 5, pelo)
        t.linha([(20, 36), (54, 36)], pelo_e, 1)
    t.contorno()
    return t


# ----------------------------------------------------------- TROPIUS-BRAG
def tropiusbrag(t, costas=False):
    """TROPIUS-BRAG, a bananeira: o dinossauro de pescoço comprido do TROPIUS
    com o corpo de tronco de bananeira (bainha listrada), folhas de bananeira
    rasgadas no lugar das asas e, debaixo do queixo, um cacho de banana
    inteiro terminando no coração roxo. PLANTA/FADA."""
    tronco = (150, 170, 96, 255)
    tronco_e = (100, 120, 64, 255)
    folha = (70, 162, 66, 255)
    folha_e = (38, 110, 46, 255)
    banana = (250, 214, 60, 255)
    banana_e = (196, 150, 36, 255)
    coracao = (140, 50, 110, 255)
    coracao_c = (200, 90, 160, 255)
    rosa = (255, 170, 220, 255)

    # as folhas-asa de bananeira, compridas e rasgadas, abertas pra cima
    t.poli([(34, 36), (30, 20), (34, 4), (42, 2), (44, 18), (42, 36)], folha)
    t.poli([(40, 38), (48, 18), (58, 8), (63, 12), (58, 30), (48, 40)], folha)
    # rabo
    t.poli([(46, 44), (62, 48), (62, 51), (46, 50)], tronco)
    # pernas grossas
    for x in (26, 34, 44, 50):
        t.ret(x - 3, 48, x + 2, 57, tronco_e if x in (34, 50) else tronco)
    # corpo
    t.elipse(38, 44, 14, 9, tronco)
    # pescoço comprido e a cabeça virada pra esquerda
    t.linha(curva((28, 42), (16, 36), (14, 14), 10), tronco, 6)
    t.elipse(12, 12, 7, 5, tronco)
    t.luz(poupar=(rosa[:3],))
    # nervura e rasgos das folhas (a bananeira rasga com o vento)
    t.linha([(37, 34), (38, 4)], folha_e, 1)
    t.linha([(44, 37), (60, 10)], folha_e, 1)
    for y in (10, 18, 26):
        t.linha([(31, y + 2), (36, y)], VAZIO, 1)
    for x, y in ((53, 16), (57, 22), (50, 26)):
        t.linha([(x, y), (x + 4, y + 3)], VAZIO, 1)
    # as bainhas listradas do "tronco"
    for x in (28, 34, 40, 46):
        t.linha([(x, 38), (x + 1, 52)], tronco_e, 1)
    # o cacho de banana debaixo do queixo, e o coração roxo na ponta
    t.linha([(12, 17), (12, 22)], tronco_e, 2)
    t.linha([(12, 20), (12, 38)], tronco_e, 1)          # o engaço do cacho
    for i, y in enumerate((22, 27, 32)):
        w = 7 - 2 * i
        for x in range(12 - w, 13 + w, 3):
            # cada banana é gordinha, curva, com a pontinha escura pra cima
            vai = -1 if x < 12 else 1
            t.linha([(x, y + 4), (x + vai, y + 1), (x + vai, y)], banana, 2)
            t.px(x + vai, y - 1, banana_e)
            t.px(x, y + 5, banana_e)
    t.poli([(10, 38), (14, 38), (16, 43), (12, 48), (8, 43)], coracao)
    t.linha([(12, 39), (12, 46)], escurecer(coracao, 0.3), 1)
    t.px(10, 41, coracao_c)
    # brilhinho de FADA em volta
    for x, y in ((4, 26), (22, 22), (26, 8), (2, 40), (20, 44)):
        t.pxs([(x, y - 1), (x - 1, y), (x + 1, y), (x, y + 1)], rosa)
    if not costas:
        olho(t, 10, 10, 1)
        t.px(9, 10, PRETO)
        t.pxs([(5, 14), (6, 14), (7, 14)], tronco_e)
    else:
        t.linha([(12, 8), (12, 16)], tronco_e, 1)
    t.contorno()
    return t


# ----------------------------------------------------------- PIKIPEK-BRAG
def pikipekbrag(t, costas=False):
    """PIKIPEK-BRAG, o pica-pau-de-cabeça-amarela: a bolinha de bico grande do
    PIKIPEK, com a cabeça e o topete amarelos, o corpo preto escamado de
    creme, a bochecha vermelha e pousado num galho com folhas. PLANTA/VOADOR."""
    amarelo = (246, 206, 60, 255)
    amarelo_e = (196, 150, 30, 255)
    preto = (48, 40, 38, 255)
    creme = (236, 214, 140, 255)
    vermelho = (214, 54, 44, 255)
    bico = (220, 204, 170, 255)

    # o galho e as folhas
    t.poli([(0, 54), (63, 50), (63, 56), (0, 60)], GALHO)
    folhinha(t, 6, 56, -5, -7)
    folhinha(t, 54, 52, 7, -6)
    folhinha(t, 58, 52, 5, 5, FOLHA_E)
    # rabo duro de pica-pau, apoiado pra baixo
    t.poli([(40, 44), (50, 52), (46, 55), (38, 50)], preto)
    # corpo preto
    t.elipse(32, 40, 14, 12, preto)
    # cabeça amarela e o topete espetado pra trás
    t.elipse(30, 22, 12, 10, amarelo)
    t.poli([(34, 14), (48, 6), (44, 13), (54, 12), (42, 20)], amarelo)
    # o bico grande do PIKIPEK
    t.poli([(18, 21), (4, 24), (18, 27)], bico)
    # pés no galho
    t.luz()
    t.linha([(0, 59), (63, 55)], GALHO_E, 1)
    t.pxs([(12, 57), (40, 54)], GALHO_E)
    for x in (27, 35):
        t.linha([(x, 51), (x, 54)], (150, 130, 110, 255), 1)
        t.pxs([(x - 1, 54), (x + 1, 54)], (150, 130, 110, 255))
    # as escamas creme no preto
    for y in (34, 39, 44):
        for x in range(22, 44, 5):
            t.px(x + (y % 2) * 2, y, creme)
            t.px(x + (y % 2) * 2 + 1, y + 1, creme)
    t.linha([(5, 24), (17, 24)], escurecer(bico, 0.3), 1)
    t.pxs([(42, 12), (46, 10)], amarelo_e)
    if not costas:
        # a bochecha vermelha, o olho e a asa de lado
        t.poli([(18, 27), (26, 27), (24, 30), (18, 29)], vermelho)
        olho(t, 25, 20, 2)
        t.poli([(36, 32), (46, 36), (42, 46), (34, 42)], escurecer(preto, 0.2))
        t.pxs([(38, 36), (41, 40), (39, 43)], creme)
    else:
        # de costas: nuca amarela, asas fechadas com as pintas creme
        t.linha([(32, 30), (32, 50)], PRETO, 1)
        for y in (38, 44):
            t.pxs([(26, y), (29, y + 1), (35, y + 1), (38, y)], creme)
    t.contorno()
    return t


# ---------------------------------------------------------- MORELULL-BRAG
def morelullbrag(t, costas=False):
    """MORELULL-BRAG, o cogumelo que brilha no escuro da mata (a flor-de-coco):
    o chapéu largo e o pezinho do MORELULL, chapéu cor de palha de dia, mas as
    lamelas, as pintas e os esporos soltos acendem verde-fantasma. PLANTA/
    FANTASMA."""
    chapeu = (206, 186, 130, 255)
    chapeu_e = (150, 130, 86, 255)
    pe = (232, 226, 206, 255)
    pe_e = (180, 172, 150, 255)
    brilho = (130, 255, 150, 255)
    brilho_c = (220, 255, 210, 255)
    brilho_e = (60, 200, 110, 255)

    # a nuvenzinha de luz no chão, onde ele está pisando
    t.elipse(32, 59, 14, 2, brilho_e)
    # o pezinho do cogumelo, com as duas perninhas
    t.elipse(24, 55, 5, 3, pe_e)
    t.elipse(40, 55, 5, 3, pe_e)
    # o chapéu largo em cúpula
    t.elipse(32, 22, 24, 14, chapeu)
    t.ret(6, 27, 58, 36, VAZIO)
    # o corpinho redondo debaixo do chapéu
    t.elipse(32, 43, 12, 13, pe)
    # as lamelas por baixo, acesas
    t.elipse(32, 27, 22, 3, brilho_e)
    # os dois "braços" de fiozinho (como os do MORELULL), soltos
    t.luz(poupar=(brilho[:3], brilho_c[:3], brilho_e[:3]))
    for x in range(12, 54, 3):
        t.linha([(x, 26), (32 + (x - 32) * 0.8, 29)], brilho, 1)
    # pintas acesas no chapéu
    for cx, cy, r in ((20, 16, 2), (32, 11, 3), (44, 16, 2), (26, 22, 1), (39, 22, 1),
                      (13, 22, 1), (51, 22, 1)):
        t.elipse(cx, cy, r, r, brilho)
        t.px(cx, cy, brilho_c)
    # esporos soltos no ar, subindo como fantasma
    for x, y in ((4, 40), (8, 34), (58, 38), (60, 44), (3, 50), (56, 30), (61, 52)):
        t.px(x, y, brilho)
    t.pxs([(7, 44), (57, 47)], brilho_c)
    if not costas:
        # os olhos caídos, sonolentos, do MORELULL — com o brilho no fundo
        for cx in (27, 37):
            t.elipse(cx, 41, 3, 4, (30, 60, 50, 255))
            t.ret(cx - 3, 37, cx + 3, 38, pe)            # a pálpebra pesada
            t.elipse(cx, 42, 1, 2, brilho)
            t.px(cx - 1, 40, brilho_c)
        t.pxs([(31, 48), (32, 49), (33, 48)], pe_e)
    else:
        t.linha([(32, 32), (32, 52)], pe_e, 1)
        for x, y in ((26, 40), (37, 45), (29, 49)):
            t.px(x, y, brilho_e)
        t.linha([(8, 20), (56, 20)], chapeu_e, 1)
    t.contorno(cor=(20, 36, 34, 255))
    return t


# ---------------------------------------------------------- FOMANTIS-BRAG
def fomantisbrag(t, costas=False):
    """FOMANTIS-BRAG, o louva-a-deus: o corpinho rosa-e-verde e as foices de
    folha do FOMANTIS, mas já com cara de louva-a-deus de verdade — cabeça
    triangular de olhões, pescoço comprido, as foices dobradas na frente do
    peito em reza e as asas de folha nas costas. PLANTA/INSETO."""
    verde = (110, 196, 90, 255)
    verde_e = (60, 136, 60, 255)
    rosa = (240, 130, 170, 255)
    rosa_e = (196, 84, 130, 255)
    olho_v = (190, 236, 110, 255)

    # a folha larga onde ele se apoia
    t.poli([(4, 58), (20, 54), (44, 54), (60, 58), (44, 62), (20, 62)], FOLHA)
    # as asas de folha, pendendo pros lados atrás do abdômen
    t.poli([(30, 34), (12, 44), (10, 52), (18, 52), (30, 44)], verde_e)
    t.poli([(34, 34), (52, 44), (54, 52), (46, 52), (34, 44)], verde_e)
    # pernas de trás finas até a folha
    for x0, x1 in ((28, 20), (36, 44), (30, 26), (34, 38)):
        t.linha([(x0, 48), (x1, 57)], verde_e, 1)
    # abdômen rosa do FOMANTIS
    t.elipse(32, 46, 7, 9, rosa)
    # o pescoço comprido
    t.ret(30, 22, 34, 36, verde)
    # a cabeça triangular
    t.poli([(17, 10), (47, 10), (32, 26)], verde)
    # os braços: sobem do peito, dobram no cotovelo e a foice-folha volta pra cima
    t.linha([(30, 30), (20, 38)], verde, 3)
    t.linha([(34, 30), (44, 38)], verde, 3)
    t.poli([(20, 38), (16, 32), (18, 24), (22, 28), (24, 36)], rosa)
    t.poli([(44, 38), (48, 32), (46, 24), (42, 28), (40, 36)], rosa)
    t.luz()
    t.linha([(19, 27), (21, 36)], rosa_e, 1)        # nervura das foices
    t.linha([(45, 27), (43, 36)], rosa_e, 1)
    t.pxs([(16, 30), (15, 34), (48, 30), (49, 34)], BRANCO)   # espinhos da foice
    for y in (42, 46, 50):
        t.linha([(27, y), (37, y)], rosa_e, 1)        # anéis do abdômen
    t.linha([(12, 49), (28, 38)], FOLHA_E, 1)         # veio das asas
    t.linha([(52, 49), (36, 38)], FOLHA_E, 1)
    t.linha([(8, 59), (58, 59)], FOLHA_E, 1)
    # antenas
    t.linha(curva((28, 10), (22, 2), (12, 1), 6), verde_e, 1)
    t.linha(curva((36, 10), (42, 2), (52, 1), 6), verde_e, 1)
    if not costas:
        # os olhões nos cantos do triângulo, com a pupila de louva-a-deus
        t.elipse(21, 13, 4, 3, olho_v)
        t.elipse(43, 13, 4, 3, olho_v)
        t.px(21, 13, PRETO)
        t.px(43, 13, PRETO)
        t.pxs([(29, 20), (30, 21), (31, 21), (32, 21), (33, 21), (34, 21), (35, 20)], verde_e)
        t.poli([(27, 12), (31, 10), (31, 14)], rosa)   # o laço rosa do FOMANTIS
        t.poli([(37, 12), (33, 10), (33, 14)], rosa)
    else:
        # de costas: as asas de folha fechadas por cima do abdômen
        t.poli([(32, 30), (24, 44), (32, 58), (40, 44)], verde)
        t.linha([(32, 31), (32, 57)], verde_e, 1)
        t.linha([(32, 12), (32, 24)], verde_e, 1)
    t.contorno()
    return t


DESENHOS = {
    21401: (mankeybrag, "mankeybrag"),
    21402: (doduobrag, "doduobrag"),
    21403: (lickitungbrag, "lickitungbrag"),
    21404: (pinsirbrag, "pinsirbrag"),
    21405: (heracrossbrag, "heracrossbrag"),
    21406: (yanmabrag, "yanmabrag"),
    21407: (slakothbrag, "slakothbrag"),
    21408: (tropiusbrag, "tropiusbrag"),
    21409: (pikipekbrag, "pikipekbrag"),
    21410: (morelullbrag, "morelullbrag"),
    21411: (fomantisbrag, "fomantisbrag"),
}
