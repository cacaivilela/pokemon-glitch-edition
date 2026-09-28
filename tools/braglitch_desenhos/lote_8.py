"""Lote 8: BANTEVY (o bem-te-vi), BANGVEET (a evolução, que grita) e LOROSÉ
(o papagaio de programa de TV)."""
from pixelart import Tela, clarear, escurecer

BRANCO = (250, 250, 250, 255)
PRETO = (30, 26, 34, 255)


def bantevy(t, costas=False):
    """Bem-te-vi pousado num galho: peito amarelo-ovo, costas marrons, cabeça
    preta com a listra branca em cima do olho e o bico preto reto. Boca aberta
    gritando o próprio nome."""
    amarelo = (252, 214, 48, 255)
    marrom = (140, 100, 60, 255)
    marrom_e = (96, 66, 40, 255)
    preto = (40, 36, 44, 255)
    galho = (110, 76, 46, 255)

    t.ret(6, 54, 58, 57, galho)                           # o galho
    t.poli([(40, 40), (58, 50), (56, 54), (38, 48)], marrom_e)   # rabo
    t.elipse(33, 40, 13, 12, amarelo)                     # peito
    t.poli([(30, 30), (46, 32), (48, 44), (36, 48)], marrom)     # asa/costas
    t.elipse(26, 22, 11, 10, preto)                       # cabeça
    t.luz(poupar=())

    t.linha([(38, 36), (46, 44)], marrom_e, 1)            # penas da asa
    t.linha([(36, 40), (43, 47)], marrom_e, 1)
    for x in (27, 33):                                    # os pés no galho
        t.ret(x, 51, x + 1, 54, preto)
    if not costas:
        # a faixa branca larga que atravessa a cabeça por cima do olho
        t.poli([(14, 17), (34, 13), (37, 17), (15, 21)], BRANCO)
        t.px(26, 11, amarelo)                             # a crista amarela escondida
        t.px(27, 11, amarelo)
        # o olho na máscara preta, com um aro cinza pra aparecer
        t.elipse(21, 25, 3, 3, (110, 104, 116, 255))
        t.elipse(21, 25, 2, 2, (70, 40, 30, 255))
        t.px(20, 24, BRANCO)
        # a garganta branca
        t.poli([(16, 29), (31, 28), (29, 34), (19, 33)], BRANCO)
        # o bico, aberto no grito
        t.poli([(16, 23), (3, 25), (16, 27)], preto)
        t.poli([(16, 28), (5, 30), (16, 31)], preto)
        t.ret(12, 27, 15, 28, (220, 70, 70, 255))
        for x, y in ((3, 19), (6, 16), (2, 14)):          # o grito saindo
            t.px(x, y, (240, 240, 240, 255))
    else:
        t.poli([(16, 17), (36, 13), (38, 17), (17, 21)], BRANCO)   # a faixa vista de trás
        t.px(28, 11, amarelo)
        t.px(29, 11, amarelo)
    t.contorno()
    return t


def bangveet(t, costas=False):
    """BANGVEET: o bem-te-vi crescido, de peito estufado no alto de um poste,
    bico escancarado e as ondas do grito saindo em arcos. Mesmas marcas do
    BANTEVY (faixa branca, máscara preta, peito amarelo), maior e mais bravo."""
    amarelo = (252, 206, 30, 255)
    marrom = (130, 90, 52, 255)
    marrom_e = (86, 58, 34, 255)
    preto = (40, 36, 44, 255)
    poste = (150, 150, 158, 255)

    t.ret(38, 50, 43, 63, poste)                          # o poste
    t.ret(26, 50, 56, 53, poste)                          # a travessa
    t.poli([(44, 34), (62, 44), (60, 50), (42, 44)], marrom_e)   # rabo
    t.elipse(36, 36, 17, 15, amarelo)                     # peito estufado
    t.poli([(34, 22), (54, 26), (56, 42), (42, 48)], marrom)     # asa
    t.poli([(40, 18), (50, 14), (48, 22)], preto)         # topete arrepiado
    t.elipse(28, 18, 13, 12, preto)                       # cabeça
    t.luz(poupar=())

    for i in range(3):                                    # penas da asa
        t.linha([(40 + i * 4, 30 + i * 2), (48 + i * 3, 42 + i)], marrom_e, 1)
    for x in (31, 39):                                    # garras na travessa
        t.ret(x, 48, x + 2, 50, preto)
    if not costas:
        t.poli([(14, 12), (38, 7), (41, 12), (15, 17)], BRANCO)    # a faixa branca
        t.pxs([(28, 5), (29, 5), (30, 5), (29, 4)], amarelo)       # a crista amarela à mostra
        t.elipse(22, 21, 3, 3, (110, 104, 116, 255))
        t.elipse(22, 21, 2, 2, (70, 40, 30, 255))
        t.px(21, 20, BRANCO)
        t.pxs([(17, 17), (19, 18), (21, 18)], BRANCO)             # sobrancelha brava
        t.poli([(15, 26), (32, 25), (30, 31), (19, 30)], BRANCO)   # garganta
        # o bico escancarado
        t.poli([(16, 18), (7, 18), (7, 20), (16, 23)], preto)
        t.poli([(16, 25), (8, 30), (9, 32), (16, 28)], preto)
        t.poli([(14, 22), (9, 21), (9, 29), (14, 26)], (220, 60, 60, 255))
        # as ondas do grito, em arcos na frente do bico
        for x, meia, cor in ((4, 7, (255, 255, 255, 255)), (1, 11, (215, 215, 230, 255))):
            t.linha([(x + 2, 25 - meia), (x, 25), (x + 2, 25 + meia)], cor, 1)
    else:
        t.poli([(16, 12), (40, 7), (42, 12), (17, 17)], BRANCO)
        t.pxs([(30, 5), (31, 5), (32, 5)], amarelo)
    t.contorno()
    return t


def lorose(t, costas=False):
    """LOROSÉ: papagaio verde de programa da manhã, de pé no balcão, com a testa
    amarela, a bochecha vermelha, o bicão curvo e olhos grandes de fantoche.
    Uma asa acena pra câmera e a outra segura o microfone."""
    verde = (60, 170, 70, 255)
    verde_e = (36, 118, 52, 255)
    amarelo = (252, 214, 48, 255)
    vermelho = (226, 60, 50, 255)
    bico = (238, 150, 60, 255)
    azul = (60, 110, 200, 255)

    t.ret(8, 56, 56, 63, (170, 120, 80, 255))             # o balcão do programa
    t.ret(8, 56, 56, 57, (210, 160, 110, 255))
    t.elipse(32, 42, 13, 14, verde)                       # corpo
    t.poli([(26, 54), (38, 54), (40, 60), (24, 60)], verde_e)    # rabo por trás
    t.poli([(44, 38), (58, 22), (60, 28), (48, 46)], verde)       # a asa acenando
    t.poli([(20, 38), (12, 48), (16, 52), (24, 46)], verde)       # a asa do microfone
    t.elipse(32, 20, 13, 12, verde)                       # cabeça
    t.luz(poupar=())

    t.elipse(32, 11, 8, 4, amarelo)                       # a testa amarela
    t.pxs([(28, 7), (30, 6), (32, 5), (34, 6)], amarelo)  # o topetinho
    for i in range(3):                                    # pontas da asa em azul
        t.linha([(54 + i, 24 + i * 2), (58, 24 + i * 2)], azul, 1)
    t.linha([(38, 38), (44, 46)], verde_e, 1)
    # o microfone
    t.ret(10, 44, 12, 52, (70, 70, 80, 255))
    t.elipse(11, 42, 3, 3, (160, 160, 170, 255))
    if not costas:
        t.elipse(24, 24, 4, 3, vermelho)                  # bochechas vermelhas
        t.elipse(40, 24, 4, 3, vermelho)
        for cx in (27, 37):                               # olhos grandes de fantoche
            t.elipse(cx, 17, 4, 5, BRANCO)
            t.elipse(cx + 1, 18, 2, 2, PRETO)
            t.px(cx, 16, BRANCO)
        t.poli([(28, 21), (36, 21), (36, 29), (32, 33), (30, 29)], bico)   # o bicão curvo
        t.poli([(29, 28), (34, 28), (32, 31)], escurecer(bico, 0.3))
        t.elipse(32, 42, 7, 8, clarear(verde, 0.35))      # o peito claro
    else:
        t.elipse(32, 18, 9, 7, verde_e)
    t.contorno()
    return t


DESENHOS = {1079: (bantevy, "bantevy"), 1080: (bangveet, "bangveet"), 1081: (lorose, "lorose")}
