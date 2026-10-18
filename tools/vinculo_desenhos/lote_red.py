"""Formas de vínculo do VERMELHO (o RED, src/data/vinculo.js): dez de Kanto
sorteados, com a cara dele — o BONÉ vermelho de frente branca, o CABELO preto
espetado, o colete vermelho de gola branca, a CALÇA MOLETOM e a MOCHILA amarela.

Nada é colado por cima: cada parte que o Pokémon JÁ TEM é repintada, pixel
por pixel, numa cor do RED (tools/vinculo_desenhos/quadro.py `tingir` e
`neutros`: a família de cor vira a rampa do RED, e a luz e a sombra de cada
pixel continuam). Parte do 1º QUADRO DA ANIMAÇÃO da espécie.
"""
from pixelart import Tela  # noqa: F401
import quadro

# as rampas do RED, do mais claro pro mais escuro
VERMELHO = ((255, 112, 96), (224, 48, 40), (160, 24, 24), (100, 12, 16))
BRANCO = ((255, 255, 255), (232, 232, 238), (196, 196, 206), (150, 150, 162))
MOLETOM = ((118, 146, 214), (72, 100, 182), (46, 66, 136), (28, 40, 88))   # a calça de moletom azul
CABELO = ((92, 86, 98), (54, 48, 54), (32, 28, 32), (16, 14, 18))
AMARELO = ((255, 236, 120), (248, 200, 48), (200, 150, 20), (140, 96, 10))

# as famílias de cor (graus do matiz)
ROXO = (250, 335)
AMARELADO = (40, 70)
LARANJA = (14, 40)
AZUL = (185, 245)
VERMELHOS = (335, 14)


def shiny_red(t):
    """o shiny do RED: o boné e o colete ficam no vermelho-escuro do RED
    mais velho (e o moletom, preto)"""
    quadro.tingir(t, VERMELHOS, ((200, 70, 90), (150, 30, 50), (100, 16, 34), (60, 8, 20)), sat_min=0.3)
    quadro.tingir(t, AZUL, ((90, 90, 104), (60, 60, 72), (40, 40, 50), (24, 24, 30)), sat_min=0.25)


# ------------------------------------------------------------ VENOMOTH
def venomoth(costas=False, shiny=False):
    """VERMELHO-VENOMOTH: asas brancas (a frente do boné) com as veias
    vermelhas, o corpo vermelho e a barriga peluda em moletom azul."""
    t = quadro.tela(49, costas)
    quadro.tingir(t, ROXO, BRANCO, sat_min=0.1, lum=(0.8, 1))       # o claro das asas
    quadro.tingir(t, ROXO, VERMELHO, sat_min=0.1, lum=(0, 0.8))     # as veias e o corpo
    quadro.tingir(t, LARANJA, MOLETOM, sat_min=0.05)                  # a barriga marrom
    if shiny:
        shiny_red(t)
    return t


# ------------------------------------------------------------ NINETALES
def ninetales(costas=False, shiny=False):
    """VERMELHO-NINETALES: vermelha como o boné, as pontas das caudas no
    amarelo da mochila, e o topete da cabeça vira o cabelo preto espetado."""
    t = quadro.tela(38, costas)
    topete = (66, 16, 92, 39) if not costas else (4, 22, 40, 44)
    quadro.tingir(t, AMARELADO, CABELO, caixa=topete)
    quadro.tingir(t, LARANJA, AMARELO, sat_min=0.4)                 # as pontas
    quadro.tingir(t, AMARELADO, VERMELHO, sat_min=0.15)             # caudas e corpo
    if shiny:
        shiny_red(t)
    return t


# ------------------------------------------------------------ BEEDRILL
def beedrill(costas=False, shiny=False):
    """VERMELHO-BEEDRILL: o amarelo vira vermelho (as listras continuam
    pretas como o cabelo do RED) e as asas ficam brancas como a frente do
    boné."""
    t = quadro.tela(15, costas)
    olhos = (40, 54, 60, 66)
    guarda = t.img.crop(olhos) if not costas else None
    quadro.tingir(t, (30, 70), VERMELHO, sat_min=0.3)
    if guarda:
        t.img.paste(guarda, olhos[:2])
    if shiny:
        shiny_red(t)
    return t


# ------------------------------------------------------------ PRIMEAPE
PELO_PRIMEAPE = ((255, 255, 214), (255, 231, 181), (231, 189, 156), (230, 189, 156), (255, 230, 181),
                 (99, 74, 33))
MEMBRO_PRIMEAPE = {(206, 140, 90): MOLETOM[0], (156, 107, 107): MOLETOM[1], (90, 49, 0): MOLETOM[3]}


def primeape(costas=False, shiny=False):
    """VERMELHO-PRIMEAPE: a juba de cima vira o cabelo preto espetado, o
    pelo vira o colete vermelho e os braços e pernas viram o moletom azul."""
    t = quadro.tela(57, costas)
    pelo = {c: VERMELHO[min(3, k)] for k, c in enumerate(PELO_PRIMEAPE)}
    pelo[(230, 189, 156)] = pelo[(231, 189, 156)]
    pelo[(255, 230, 181)] = pelo[(255, 231, 181)]
    juba = {c: CABELO[min(3, k)] for k, c in enumerate(PELO_PRIMEAPE)}
    rosto = (38, 54, 56, 70)
    guarda = t.img.crop(rosto) if not costas else None
    quadro.trocar(t, juba, (30, 36, 76, 47))
    quadro.trocar(t, pelo)
    quadro.trocar(t, MEMBRO_PRIMEAPE)
    if guarda:
        t.img.paste(guarda, rosto[:2])
        quadro.trocar(t, pelo, rosto)
    if shiny:
        shiny_red(t)
    return t


# ------------------------------------------------------------ PINSIR
def pinsir(costas=False, shiny=False):
    """VERMELHO-PINSIR: o corpo marrom vira o vermelho do boné e os chifres
    ficam brancos como a frente dele."""
    t = quadro.tela(127, costas)
    quadro.tingir(t, (20, 50), BRANCO, sat_min=0.0, caixa=(20, 30, 76, 54), lum=(0.6, 1))   # os chifres
    quadro.tingir(t, (10, 50), VERMELHO, sat_min=0.08)
    if shiny:
        shiny_red(t)
    return t


# ------------------------------------------------------------ HYPNO
def hypno(costas=False, shiny=False):
    """VERMELHO-HYPNO: o amarelo de cima vira o colete vermelho (a gola
    branca já é a do RED) e as pernas viram o moletom azul."""
    t = quadro.tela(97, costas)
    quadro.tingir(t, (35, 70), MOLETOM, caixa=(0, 68, 96, 96))
    quadro.tingir(t, (35, 70), VERMELHO)
    if shiny:
        shiny_red(t)
    return t


# ------------------------------------------------------------ MAROWAK
def marowak(costas=False, shiny=False):
    """VERMELHO-MAROWAK: o crânio vira o BONÉ vermelho (a frente fica
    branca), o corpo marrom vira o moletom azul e a barriga o amarelo da mochila."""
    t = quadro.tela(105, costas)
    cranio = (36, 46, 64, 74) if not costas else (36, 44, 70, 70)
    quadro.neutros(t, VERMELHO, lum=(0.55, 1.0), caixa=cranio)
    quadro.tingir(t, (20, 40), AMARELO, sat_min=0.45)               # a barriga
    quadro.tingir(t, (10, 45), MOLETOM, sat_min=0.1)
    if shiny:
        shiny_red(t)
    return t


# ------------------------------------------------------------ WEEZING
def weezing(costas=False, shiny=False):
    """VERMELHO-WEEZING: o roxo vira vermelho; a fumaça já é o amarelo da
    mochila."""
    t = quadro.tela(110, costas)
    quadro.tingir(t, ROXO, VERMELHO, sat_min=0.1)
    if shiny:
        shiny_red(t)
    return t


# ------------------------------------------------------------ TENTACRUEL
def tentacruel(costas=False, shiny=False):
    """VERMELHO-TENTACRUEL: já é vermelho e azul como o RED; o azul vira
    o moletom azul e os tentáculos cinza viram o cabelo preto."""
    t = quadro.tela(73, costas)
    quadro.tingir(t, AZUL, MOLETOM, sat_min=0.2)
    quadro.neutros(t, CABELO, lum=(0.2, 0.75))
    if shiny:
        shiny_red(t)
    return t


# ------------------------------------------------------------ ELECTABUZZ
def electabuzz(costas=False, shiny=False):
    """VERMELHO-ELECTABUZZ: o amarelo vira o vermelho do boné, as listras
    pretas ficam (o cabelo do RED)."""
    t = quadro.tela(125, costas)
    quadro.tingir(t, (35, 70), VERMELHO, sat_min=0.25)
    if shiny:
        shiny_red(t)
    return t


DESENHOS = {
    24200: (venomoth, "venomoth"),
    24201: (ninetales, "ninetales"),
    24202: (beedrill, "beedrill"),
    24203: (primeape, "primeape"),
    24204: (pinsir, "pinsir"),
    24205: (hypno, "hypno"),
    24206: (marowak, "marowak"),
    24207: (weezing, "weezing"),
    24208: (tentacruel, "tentacruel"),
    24209: (electabuzz, "electabuzz"),
}
