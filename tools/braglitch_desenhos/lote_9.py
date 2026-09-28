"""Lote 9: ZEROGLE, o beagle fantasma."""
from pixelart import Tela, clarear, escurecer

BRANCO = (250, 250, 250, 255)
PRETO = (30, 26, 34, 255)


def zerogle(t, costas=False):
    """Beagle fantasma flutuando: corpo branco-azulado sem patas de trás (vira
    um rastro de fumaça), orelhas compridas caídas balançando, e o nariz
    aceso como lanterna pra achar o caminho no escuro."""
    corpo = (226, 236, 250, 255)
    sombra = (168, 186, 216, 255)
    orelha = (150, 166, 204, 255)
    nariz = (255, 150, 60, 255)
    brilho = (255, 220, 150, 255)

    # o rastro de fantasma no lugar das patas de trás
    t.poli([(40, 40), (58, 46), (62, 56), (54, 52), (52, 60), (46, 52), (40, 58), (36, 48)], corpo)
    t.elipse(34, 40, 14, 10, corpo)                      # corpo
    t.ret(22, 44, 25, 54, corpo)                         # patinhas da frente
    t.ret(29, 45, 32, 55, corpo)
    t.elipse(22, 24, 13, 12, corpo)                      # cabeça
    t.elipse(12, 30, 9, 5, corpo)                        # focinho comprido de beagle
    t.luz(poupar=())
    # as orelhas compridas, caídas e balançando (por cima da cabeça, mais escuras)
    t.poli([(14, 15), (9, 20), (8, 38), (12, 44), (16, 38), (18, 20)], orelha)
    t.poli([(28, 15), (32, 20), (36, 38), (33, 44), (29, 38), (26, 20)], orelha)
    t.linha([(12, 22), (11, 40)], escurecer(orelha, 0.2), 1)
    t.linha([(31, 22), (33, 40)], escurecer(orelha, 0.2), 1)

    t.linha([(50, 50), (58, 54)], sombra, 1)             # ondas do rastro
    t.linha([(44, 52), (48, 56)], sombra, 1)
    if not costas:
        # olhos vazios de fantasma, bem abertos
        t.elipse(19, 24, 2, 2, PRETO)
        t.elipse(26, 24, 2, 2, PRETO)
        t.px(18, 23, (150, 170, 220, 255))
        t.px(25, 23, (150, 170, 220, 255))
        t.linha([(8, 33), (12, 35), (16, 33)], sombra, 1)   # a boquinha
        # o nariz aceso na ponta do focinho, com o halo
        t.elipse(4, 29, 4, 4, brilho)
        t.elipse(4, 29, 2, 2, nariz)
        t.px(3, 28, BRANCO)
    else:
        t.elipse(22, 20, 6, 4, sombra)                   # a nuca
    for x, y in ((4, 44), (60, 30), (48, 14), (10, 58), (58, 62)):   # brilhos de assombração
        t.px(x, y, (180, 210, 255, 255))
    t.contorno((70, 80, 120, 255))
    return t


DESENHOS = {1082: (zerogle, "zerogle")}
