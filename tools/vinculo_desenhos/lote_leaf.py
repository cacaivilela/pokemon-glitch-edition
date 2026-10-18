"""Formas de vínculo da FOLHA (a LEAF, src/data/vinculo.js): dez de Kanto
sorteados, com a cara dela — o CHAPÉU branco de faixa vermelha, o CABELO
castanho comprido, a BLUSA ciano, a SAIA vermelha e a BOLSA amarela.

Nada é colado por cima: cada parte que o Pokémon JÁ TEM é repintada, pixel
por pixel, numa cor da FOLHA (tools/vinculo_desenhos/quadro.py `tingir` e
`neutros`: a família de cor vira a rampa dela, e a luz e a sombra de cada
pixel continuam). Parte do 1º QUADRO DA ANIMAÇÃO da espécie.
"""
from pixelart import Tela  # noqa: F401
import quadro

# as rampas da FOLHA, do mais claro pro mais escuro
BRANCO = ((252, 252, 254), (234, 234, 242), (198, 202, 218), (150, 154, 172))
VERMELHO = ((244, 98, 104), (224, 56, 62), (170, 32, 44), (108, 18, 28))
CASTANHO = ((198, 140, 88), (150, 90, 50), (110, 62, 32), (70, 38, 20))
CIANO = ((156, 226, 244), (90, 190, 220), (52, 140, 180), (30, 90, 130))
AMARELO = ((255, 232, 120), (248, 208, 64), (200, 156, 30), (140, 100, 16))

ROSA = (290, 350)
ROXO = (250, 320)
AZUL = (180, 250)
AMARELADO = (38, 70)
LARANJA = (14, 40)
VERDE = (70, 160)
VERMELHOS = (340, 14)


def shiny_leaf(t):
    """o shiny da FOLHA: a blusa fica verde-água e a saia, vinho"""
    quadro.tingir(t, (185, 200), ((160, 236, 210), (90, 200, 170), (50, 150, 130), (28, 96, 86)), sat_min=0.3)
    quadro.tingir(t, VERMELHOS, ((200, 90, 120), (150, 40, 80), (100, 20, 56), (60, 10, 34)), sat_min=0.3)


# ------------------------------------------------------------ MEW
def mew(costas=False, shiny=False):
    """FOLHA-MEW: o corpo rosa vira a blusa ciano, e a cauda comprida vira
    o cabelo castanho comprido dela (o olho azul fica)."""
    t = quadro.tela(151, costas)
    cauda = (46, 48, 72, 86) if not costas else (18, 46, 49, 84)
    olho = (23, 65, 29, 69)
    guarda = t.img.crop(olho) if not costas else None
    quadro.tingir(t, ROSA, CASTANHO, sat_min=0.15, caixa=cauda)
    quadro.tingir(t, ROSA, CIANO, sat_min=0.15)
    if guarda:
        t.img.paste(guarda, olho[:2])
    if shiny:
        shiny_leaf(t)
    return t


# ------------------------------------------------------------ MACHAMP
def machamp(costas=False, shiny=False):
    """FOLHA-MACHAMP: os músculos cinza-azulados viram a blusa ciano, o
    topete loiro vira o cabelo castanho, o short preto vira a saia vermelha
    e o cinto dourado o amarelo da bolsa."""
    t = quadro.tela(68, costas)
    quadro.tingir(t, AMARELADO, CASTANHO, sat_min=0.2, caixa=(30, 22, 70, 40))   # o topete
    quadro.tingir(t, AMARELADO, AMARELO, sat_min=0.2)                            # o cinto
    # o short é preto puro, a cor do contorno: só o miolo dele vira saia
    short = (41, 66, 59, 75) if not costas else (24, 60, 72, 80)
    quadro.trocar(t, {(0, 0, 0): VERMELHO[2], (66, 82, 99): VERMELHO[1], (74, 74, 99): VERMELHO[1]}, short)
    quadro.tingir(t, AZUL, CIANO, sat_min=0.04)
    if shiny:
        shiny_leaf(t)
    return t


# ------------------------------------------------------------ EXEGGUTOR
def exeggutor(costas=False, shiny=False):
    """FOLHA-EXEGGUTOR: as folhas da cabeça viram o cabelo castanho
    comprido dela, e o tronco vira a blusa ciano."""
    t = quadro.tela(103, costas)
    quadro.tingir(t, VERDE, CASTANHO, sat_min=0.15)
    quadro.tingir(t, (20, 50), CIANO, sat_min=0.1, caixa=(20, 68, 76, 96), lum=(0.1, 0.5))
    if shiny:
        shiny_leaf(t)
    return t


# ------------------------------------------------------------ FARFETCH'D
def farfetchd(costas=False, shiny=False):
    """FOLHA-FARFETCH'D: o corpo já é castanho como o cabelo dela; a barriga
    clara vira a blusa ciano e o alho-poró vira vermelho com a ponta branca."""
    t = quadro.tela(83, costas)
    quadro.tingir(t, VERDE, VERMELHO, sat_min=0.2)
    quadro.tingir(t, (40, 70), CIANO, sat_min=0.2, lum=(0.6, 1))          # a barriga creme
    if shiny:
        shiny_leaf(t)
    return t


# ------------------------------------------------------------ BUTTERFREE
def butterfree(costas=False, shiny=False):
    """FOLHA-BUTTERFREE: o corpo roxo vira a blusa ciano e as asas ficam
    brancas como o chapéu (os olhos vermelhos ficam)."""
    t = quadro.tela(12, costas)
    quadro.tingir(t, (200, 320), CIANO, sat_min=0.12, lum=(0, 0.6))        # o corpo
    # o lilás claro das asas vira o branco do chapéu (por último: o branco é
    # meio azulado e não pode cair de novo no ciano)
    quadro.tingir(t, (200, 320), BRANCO, sat_min=0.05, lum=(0.6, 1))
    if shiny:
        shiny_leaf(t)
    return t


# ------------------------------------------------------------ NIDOQUEEN
def nidoqueen(costas=False, shiny=False):
    """FOLHA-NIDOQUEEN: o azul vira a blusa ciano, a barriga creme fica
    branca e o dentro das orelhas vira o cabelo castanho."""
    t = quadro.tela(31, costas)
    quadro.tingir(t, AZUL, CIANO, sat_min=0.15)
    quadro.tingir(t, (40, 62), BRANCO, sat_min=0.2, lum=(0.45, 1))
    quadro.tingir(t, (20, 45), CASTANHO, sat_min=0.2, lum=(0.1, 0.6))
    if shiny:
        shiny_leaf(t)
    return t


# ------------------------------------------------------------ MUK
def muk(costas=False, shiny=False):
    """FOLHA-MUK: a gosma roxa vira a blusa ciano, e os brilhos rosa ficam
    brancos."""
    t = quadro.tela(89, costas)
    quadro.tingir(t, ROXO[:1] + (340,), BRANCO, sat_min=0.15, lum=(0.68, 1))
    quadro.tingir(t, (250, 340), CIANO, sat_min=0.12)
    if shiny:
        shiny_leaf(t)
    return t


# ------------------------------------------------------------ MOLTRES
def moltres(costas=False, shiny=False):
    """FOLHA-MOLTRES: o corpo amarelo vira a blusa ciano e o fogo fica no
    vermelho da saia e da faixa do chapéu."""
    t = quadro.tela(146, costas)
    quadro.tingir(t, (36, 60), CIANO, sat_min=0.4, lum=(0.3, 0.75))        # o corpo
    quadro.tingir(t, (340, 60), VERMELHO, sat_min=0.4)                     # o fogo
    if shiny:
        shiny_leaf(t)
    return t


# ------------------------------------------------------------ LAPRAS
def lapras(costas=False, shiny=False):
    """FOLHA-LAPRAS: o azul vira a blusa ciano, o casco fica branco como o
    chapéu e os chifres do casco ficam castanhos."""
    t = quadro.tela(131, costas)
    quadro.tingir(t, AZUL, CIANO, sat_min=0.2)
    quadro.neutros(t, BRANCO, lum=(0.3, 0.95), sat_max=0.2)
    if shiny:
        shiny_leaf(t)
    return t


# ------------------------------------------------------------ KINGLER
def kingler(costas=False, shiny=False):
    """FOLHA-KINGLER: a carapaça vira a saia vermelha, o claro de baixo fica
    branco e as pernas viram a blusa ciano."""
    t = quadro.tela(99, costas)
    quadro.tingir(t, (0, 30), VERMELHO, sat_min=0.25, lum=(0.25, 0.75))
    quadro.tingir(t, (25, 50), CIANO, sat_min=0.2, lum=(0.6, 0.95))
    if shiny:
        shiny_leaf(t)
    return t


DESENHOS = {
    24300: (mew, "mew"),
    24301: (machamp, "machamp"),
    24302: (exeggutor, "exeggutor"),
    24303: (farfetchd, "farfetchd"),
    24304: (butterfree, "butterfree"),
    24305: (nidoqueen, "nidoqueen"),
    24306: (muk, "muk"),
    24307: (moltres, "moltres"),
    24308: (lapras, "lapras"),
    24309: (kingler, "kingler"),
}
