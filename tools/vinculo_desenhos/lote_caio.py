"""Formas de vínculo do CAIO (src/data/vinculo.js): os iniciais de ÁGUA na
forma final e o RAICHU, com a cara do CAIO — o cabelo preto CACHEADO e a
roupa de POKÉ BOLA (vermelho, faixa preta, botão branco).

Cada um parte do 1º QUADRO DA ANIMAÇÃO da espécie (tools/vinculo_desenhos/
quadro.py) e é editado aqui: cores trocadas e peças desenhadas por cima.
"""
import math

from PIL import Image, ImageDraw

from pixelart import Tela, clarear, escurecer  # noqa: F401
import ppp
import quadro

# o CAIO
CABELO = (40, 32, 36)
CABELO_E = (20, 16, 20)
CABELO_M = (78, 58, 58)
CABELO_B = (128, 98, 90)
VERMELHO = (224, 56, 48)
VERMELHO_E = (160, 32, 32)
VERMELHO_EE = (96, 20, 24)
VERMELHO_C = (255, 120, 104)
FAIXA = (28, 28, 36)
BRANCO = (236, 236, 244)
PRETO = (16, 14, 20)

# o SWITCH
JOY_AZUL = (0, 168, 232)
JOY_VERM = (255, 72, 84)
AMARELO = (255, 216, 40)
AMARELO_C = (255, 250, 190)
AMARELO_E = (200, 150, 20)

A = lambda c: tuple(c[:3]) + (255,)   # noqa: E731












def por_tras(t, desenhar):
    """desenha `desenhar(t)` ATRÁS do que já está na tela"""
    corpo = t.img.copy()
    t.img = Image.new("RGBA", corpo.size, (0, 0, 0, 0))
    t.d = ImageDraw.Draw(t.img)
    desenhar(t)
    t.img.alpha_composite(corpo)
    t.d = ImageDraw.Draw(t.img)


def raio(t, x, y):
    """um raio amarelo de contorno escuro"""
    pts = [(0, 0), (1, 0), (2, 0), (1, 1), (2, 1), (2, 2), (3, 2), (1, 3), (2, 3), (3, 3), (4, 3),
           (3, 4), (4, 4), (3, 5), (4, 6)]
    for a, b in pts:
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            if (a + dx, b + dy) not in pts and t.cor(x + a + dx, y + b + dy)[3] == 0:
                t.px(x + a + dx, y + b + dy, A(AMARELO_E))
    for i, (a, b) in enumerate(pts):
        t.px(x + a, y + b, A(AMARELO_C if i < 3 else AMARELO))


def apagar(t, caixa):
    """some com tudo dentro da caixa (x0, y0, x1, y1)"""
    t.d.rectangle([caixa[0], caixa[1], caixa[2] - 1, caixa[3] - 1], fill=(0, 0, 0, 0))




# ------------------------------------------------------------ GRENINJA
# a língua rosa vira o vermelho da roupa do CAIO; a crista creme vira os
# cachos; as manchas azul-claras viram o amarelo do ELÉTRICO
GRENINJA_FRENTE = {
    (239, 111, 143): VERMELHO, (190, 63, 95): VERMELHO_E, (111, 47, 63): VERMELHO_EE,
    (239, 174, 191): VERMELHO_C, (127, 207, 223): AMARELO,
}
GRENINJA_COSTAS = {
    (242, 121, 141): VERMELHO, (191, 76, 96): VERMELHO_E, (128, 51, 64): VERMELHO_EE,
    (255, 178, 191): VERMELHO_C, (102, 217, 255): AMARELO,
}
CRISTA_FRENTE = {(239, 218, 148): CABELO, (134, 118, 58): CABELO_E}
CRISTA_COSTAS = {(255, 240, 166): CABELO, (191, 177, 105): CABELO_M, (115, 106, 63): CABELO_E}


# o X de JOY-CON (32x32), o azul e o vermelho cruzados, PPP
JOYCON_X = [
    "................................",
    "................................",
    ".....KKK................KKK.....",
    "...KKAzzKK............KKeeCKK...",
    "...KAAAzzKK..........KKeeCCCK...",
    "..KAAAAAzzKK........KKeeCCCCCK..",
    "..KaAAkkkzzKK......KKeekkkCCcK..",
    "..KaaAkgkAzzKK....KKeeCkgkCccK..",
    "...KaakkkAAzzKK..KKeeCCkkkccK...",
    "...KKaaAAAAAzzKKKKeeCCCCCccKK...",
    "....KKaaAAAAAzzKKeeCCCCCccKK....",
    ".....KKaaAAAAAzzeeCCCCCccKK.....",
    "......KKaaAAAAAeeCCCCCccKK......",
    ".......KKaaAAAeeCCCCCccKK.......",
    "........KKaaAeeCCCCCccKK........",
    ".........KKaeeCCCCCccKK.........",
    ".........KKeeCCCCCcczKK.........",
    "........KKeeCCCCCccAzzKK........",
    ".......KKeeCCCCCccAAAzzKK.......",
    "......KKeeCCCCCccAAAAAzzKK......",
    ".....KKeeCCCCCccaaAAAAAzzKK.....",
    "....KKeeCCCCCccKKaaAAAAAzzKK....",
    "...KKeeCkCCCccKKKKaaAAAkAzzKK...",
    "...KeeCkCkCccKK..KKaaAkAkAzzK...",
    "..KeeCCCkCccKK....KKaaAkAAAzzK..",
    "..KeCCCCCccKK......KKaaAAAAAzK..",
    "..KCCCCCccKK........KKaaAAAAAK..",
    "...KCCCccKK..........KKaaAAAK...",
    "...KKCccKK............KKaaAKK...",
    ".....KKK................KKK.....",
    "................................",
    "................................",
]
PAL_X = {"K": PRETO, "A": JOY_AZUL, "a": escurecer(A(JOY_AZUL), 0.3)[:3], "z": clarear(A(JOY_AZUL), 0.4)[:3],
         "C": JOY_VERM, "c": escurecer(A(JOY_VERM), 0.3)[:3], "e": clarear(A(JOY_VERM), 0.4)[:3],
         "k": (24, 24, 32), "g": (110, 110, 124)}
# o cabelo, com cada cacho posto à mão (frente: x 28..48, y 34..46; costas: x 49..71, y 33..44)
CABELO_GRENINJA = [
    "_____KKK__KKK________",
    "___KKhmHKKhmHKKKK____",
    "__KHHmHEHHmHEhmHHK___",
    "_KHhmHEEhmHEEmHEHHK__",
    "_KHmHEHHmHEHHHEEhmHK_",
    "KHHHEEhmHEEHHHHHmHEK_",
    "KHhmHHmHEHHhmHHHHEEHK",
    "KEmHEHHEEHHmHEHhmHHHK",
    ".KHEhmHHHHHHEEHmHEHEK",
    ".KEHmHEEEhmEHHhmEEEK.",
    "..KEEEKKKKKKEHmHhmK..",
    "...KKK......KEEEmK...",
    ".............KKKK....",
]
CABELO_GRENINJA_COSTAS = [
    "______KKK__KKK_________",
    "____KKhmHKKhmHKK_KK____",
    "___KHHmHEHHmHEHHKHHK___",
    "__KHhmHEEhmHEEhmHHhmK__",
    "_KHHmHEHHmHEHHmHEHmHEK_",
    "KHHHHEEhmHEEHHHEEHHEEK_",
    "KEhmHHHmHEHHhmHHHhmHHEK",
    ".KmHEHHHEEHHmHEHHmHhmK.",
    ".KEEEhmHHHhmHEEhmHEmEK.",
    "..KEEmHEEEmEEEEmHEEEK..",
    "...KKEEEKKKKKKKEEEKK...",
    ".....KKK.......KKK.....",
]


def greninja(costas=False, shiny=False):
    """CAIO-GRENINJA, ÁGUA/ELÉTRICO. Como o ASH-GRENINJA, mas do CAIO: a
    crista virou o cabelo cacheado, a língua-cachecol é vermelha com o fecho
    de POKÉ BOLA, os pontos claros acendem em amarelo elétrico e nas costas,
    no lugar da estrela d'água, dois JOY-CON em X. Tudo PPP."""
    t = quadro.tela(658, costas)
    originais = quadro.cores(t)
    if not costas:
        quadro.trocar(t, GRENINJA_FRENTE)
        # a crista do GRENINJA sai: o que passa da cabeça some, o que fica em
        # cima dela vira azul (o cabelo cobre)
        apagar(t, (46, 24, 70, 46))
        quadro.trocar(t, {(239, 218, 148): (32, 63, 159), (134, 118, 58): (16, 32, 80)}, (34, 26, 50, 62))
        por_tras(t, lambda t: ppp.pintar(t, 50, 26, JOYCON_X, PAL_X))
        ppp.pintar(t, 28, 34, CABELO_GRENINJA, PAL_CABELO)
        ppp.pintar(t, 45, 55, BOTAO, PAL_BOTAO)
        for x, y in ((10, 34), (78, 22), (4, 66), (86, 74)):
            raio(t, x, y)
    else:
        quadro.trocar(t, GRENINJA_COSTAS)
        apagar(t, (62, 24, 78, 40))
        quadro.trocar(t, {(255, 240, 166): (46, 73, 153), (191, 177, 105): (27, 42, 89),
                          (115, 106, 63): (27, 42, 89)}, (60, 38, 78, 50))
        ppp.pintar(t, 49, 33, CABELO_GRENINJA_COSTAS, PAL_CABELO)
        ppp.pintar(t, 40, 46, JOYCON_X, PAL_X)
        for x, y in ((8, 30), (80, 22), (4, 76), (86, 60)):
            raio(t, x, y)
    if shiny:
        quadro.shiny(t, 658, costas, originais)
    return t


# ------------------------------------------------------------ EMPOLEON
# tudo aqui é PIXEL POR PIXEL (tools/vinculo_desenhos/ppp.py): as grades são
# desenhadas à mão, letra por pixel, com o contorno (K) do próprio sprite
PAL_CABELO = {"K": (16, 16, 16), "H": CABELO, "m": CABELO_M, "h": CABELO_B, "E": CABELO_E}
CABELO_EMPOLEON = [          # x 39..64, y 17..30: o cabelo no lugar da coroa
    "_______KKK___KKK___KK_____",
    "_____KKhmHKKKhmHKKKhmK____",
    "____KHHmHEHHHmHEHHHmHEK___",
    "___KHhmHEEhmHHEEHHHHEhmK__",
    "__KHHmHEHHmHEHHHhmHHHmHK__",
    "__KHHHEEhmHEEHHHmHEHHHEEK_",
    "_KHhmHHHmHEHHhmHHEEHHHhmK_",
    "_KHmHEHHHEEHHmHEHHhmHHmHK_",
    "_KHHEhmHHHHHHHEhmHmHEHHEK_",
    "_KHHHmHEHHhmHHHmHEHEEHHHK_",
    "__KhmHEEHHmHEHHHEEHHhmHK__",
    "__KmHEHHhmHEEhmHHHHHmHK___",
    "___KEEHKmHEHHmHEKhmHHK____",
    "....KKK.KEhmHHEK.KKKK.....",
]


def pal_joycon(cor):
    """K contorno, C a cor, c a sombra, e o brilho, k preto, g o cinza"""
    return {"K": (16, 16, 16), "C": cor, "c": escurecer(A(cor), 0.3)[:3],
            "e": clarear(A(cor), 0.4)[:3], "k": (24, 24, 32), "g": (110, 110, 124)}


# a mão direita dele (a da esquerda na tela): o JOY-CON VERMELHO, na diagonal
# da nadadeira, com o analógico em cima e os quatro botões embaixo
MAO_VERMELHA = [             # x 6..27, y 56..74
    "......................",
    ".............KKKKK....",
    "............KKeeCKK...",
    "...........KeeeCCCKK..",
    "..........KeekkkCCCK..",
    ".........KeeekgkCCcK..",
    "........KeeeCkkkCccK..",
    ".......KeeeCCCCCccKK..",
    "......KeeeCCCCCcccK...",
    ".....KeeeCCCCCcccK....",
    "....KeeeCCCCCcccK.....",
    "...KeeeCkCCCcccK......",
    "..KKeeCkCkCcccK.......",
    "..KeeCCCkCcccK........",
    "..KeCCCCCcccK.........",
    "..KCCCCCcccK..........",
    "..KKCCCcccK...........",
    "...KKCccKK............",
    "....KKKKK.............",
]
# a mão esquerda (a da direita na tela): o JOY-CON AZUL
MAO_AZUL = [                 # x 61..78, y 72..91
    "..................",
    "......KKK.........",
    "....KKCCcKK.......",
    "....KCCCCcK.......",
    "...KekkkCccK......",
    "...KekgkCCcK......",
    "...KekkkCCccK.....",
    "....KeCCCCccK.....",
    "....KeeCCCCcK.....",
    "....KeeCCCCccK....",
    ".....KeCCCCCcK....",
    ".....KeeCkCCccK...",
    "......KekCkCccK...",
    "......KeekCCCcK...",
    "......KeeCCCCccK..",
    ".......KeCCCCCcK..",
    ".......KeeCCCCcK..",
    "........KeCCCCK...",
    "........KKeCCKK...",
    "..........KKK.....",
]
# o botão de POKÉ BOLA no peito
BOTAO = [
    ".KKK.",
    "KWWWK",
    "KWsWK",
    "KWWWK",
    ".KKK.",
]
# de costas o JOY-CON mostra a traseira lisa: sem analógico nem botões
COSTAS_AZUL = [              # x 9..30, y 65..83
    "......................",
    "..............KKKKK...",
    ".............KKeeCKK..",
    "............KeeeCCCKK.",
    "...........KeeeCCCCCK.",
    "..........KeeeCCCCCcK.",
    ".........KeeeCCCCCccK.",
    "........KeeeCCCCCccKK.",
    ".......KeeeCCCCCcccK..",
    "......KeeeCCCCCcccK...",
    ".....KeeeCCCCCcccK....",
    "....KeeeCCCCCcccK.....",
    "...KKeeCCCCCcccK......",
    "...KeeCCCCCcccK.......",
    "...KeCCCCCcccK........",
    "...KCCCCCcccK.........",
    "...KKCCCcccK..........",
    "....KKCccKK...........",
    ".....KKKKK............",
]
COSTAS_VERMELHA = [          # x 63..82, y 58..80
    "....................",
    ".....KKK............",
    "...KKCCcKK..........",
    "...KCCCCcK..........",
    "..KeCCCCccK.........",
    "..KeCCCCCcK.........",
    "..KeeCCCCccK........",
    "...KeCCCCCcKK.......",
    "...KeeCCCCccK.......",
    "....KeCCCCCccK......",
    "....KeeCCCCccK......",
    ".....KeeCCCCccK.....",
    ".....KeeCCCCccK.....",
    "......KeeCCCCccK....",
    "......KeeCCCCCcK....",
    ".......KeeCCCCccK...",
    ".......KKeCCCCCcK...",
    "........KeeCCCCccK..",
    ".........KeCCCCCcK..",
    ".........KeeCCCCcK..",
    "..........KeCCCCK...",
    "..........KKeCCKK...",
    "............KKK.....",
]
EMPOLEON_COROA = {(255, 231, 132): CABELO, (239, 206, 99): CABELO_M, (189, 140, 107): CABELO_E}


def empoleon(costas=False, shiny=False):
    """CAIO-EMPOLEON. As mãos (a ponta das nadadeiras) viraram JOY-CON — o
    vermelho na mão direita, o azul na esquerda, como no SWITCH; a coroa de
    tridente virou o cabelo cacheado do CAIO (e as pontas dela que descem
    pelo rosto, costeletas); o peito branco virou POKÉ BOLA. Tudo PPP."""
    t = quadro.tela(395, costas)
    originais = quadro.cores(t)
    if not costas:
        # as pontas da coroa que descem pelo rosto viram costeletas
        quadro.trocar(t, EMPOLEON_COROA, (42, 29, 47, 39))
        quadro.trocar(t, EMPOLEON_COROA, (53, 28, 58, 38))
        ppp.pintar(t, 39, 17, CABELO_EMPOLEON, PAL_CABELO)
        # o peito: o branco de cima da faixa vira vermelho, a faixa é preta
        px = t.img.load()
        for y in range(46, 72):
            for x in range(32, 56):
                c = px[x, y][:3]
                if c not in ((255, 255, 255), (222, 239, 255), (156, 206, 255)) or not px[x, y][3]:
                    continue
                if y < 59:
                    px[x, y] = A({(255, 255, 255): VERMELHO, (222, 239, 255): VERMELHO_C}.get(c, VERMELHO_E))
                elif y <= 60:
                    px[x, y] = A(FAIXA)
        ppp.pintar(t, 44, 58, BOTAO, {"K": FAIXA, "W": BRANCO, "s": (255, 255, 255)})
        ppp.pintar(t, 6, 56, MAO_VERMELHA, pal_joycon(JOY_VERM))
        ppp.pintar(t, 61, 72, MAO_AZUL, pal_joycon(JOY_AZUL))
    else:
        quadro.trocar(t, EMPOLEON_COROA, (30, 18, 52, 36))
        ppp.pintar(t, 28, 19, CABELO_EMPOLEON, PAL_CABELO)
        ppp.pintar(t, 9, 65, COSTAS_AZUL, pal_joycon(JOY_AZUL))
        ppp.pintar(t, 63, 58, COSTAS_VERMELHA, pal_joycon(JOY_VERM))
    # o shiny por último: só as cores do Pokémon trocam, as do CAIO ficam
    if shiny:
        quadro.shiny(t, 395, costas, originais)
    return t


# ------------------------------------------------------------ INTELEON
# a crista amarela FICA; os cachos do CAIO nascem em volta dela, e o casaco
# amarelo (a cauda comprida) vira POKÉ BOLA: vermelho em cima, faixa preta,
# branco embaixo e o botão. Tudo PPP.
CABELO_INTELEON = [          # x 33..51, y 23..28
    ".....KKK..KKK......",
    "...KKhmHKKhmHKKK...",
    "..KhmHHEHhmHEHhmHK.",
    ".KHHEhmHHHEHmHHEHHK",
    "KhmHHHEHhmHHHEhmHK.",
    ".KKHEKKHEHKKHEKKK..",
]
CABELO_INTELEON_COSTAS = [   # x 46..64, y 27..32
    "......KKK..KKK.....",
    "...KKhmHKKhmHKKK...",
    "..KhmHHEHhmHEHhmHK.",
    ".KHHEhmHHHEHmHHEHK.",
    "KhmHHHEHhmHHHEhmHHK",
    ".KKHEKKHEHKKHEKKKK.",
]
# o amarelo do casaco: claro, meio, laranja e a sombra marrom
CASACO = ((242, 248, 137), (233, 205, 95), (227, 163, 43), (136, 99, 43))


def casaco_pokebola(t, caixa, y_faixa, tons=CASACO):
    """uma parte do corpo vira POKÉ BOLA, pixel por pixel: cada um dos `tons`
    (do mais claro pro mais escuro, até 4) vira o tom certo do vermelho (em
    cima) ou do branco (embaixo); a linha da faixa fica preta"""
    k = 0 if len(tons) == 4 else 1                    # com menos tons, começa do tom do meio
    vermelho = dict(zip(tons, (VERMELHO_C, VERMELHO, VERMELHO_E, VERMELHO_EE)[k:]))
    branco = dict(zip(tons, ((255, 255, 255), BRANCO, (200, 200, 214), (140, 140, 156))[k:]))
    x0, y0, x1, y1 = caixa
    px = t.img.load()
    for y in range(y0, y1):
        for x in range(x0, x1):
            c = px[x, y]
            if not c[3] or c[:3] not in vermelho:
                continue
            px[x, y] = A(vermelho[c[:3]] if y < y_faixa else FAIXA if y == y_faixa else branco[c[:3]])


def inteleon(costas=False, shiny=False):
    """CAIO-INTELEON. A crista continua; o cabelo cacheado do CAIO cresce em
    volta dela, e o casaco amarelo virou POKÉ BOLA."""
    t = quadro.tela(818, costas)
    originais = quadro.cores(t)
    if not costas:
        casaco_pokebola(t, (44, 34, 60, 82), 64)
        casaco_pokebola(t, (30, 37, 44, 82), 64)     # o pedaço atrás da perna
        ppp.pintar(t, 48, 62, BOTAO, {"K": FAIXA, "W": BRANCO, "s": (255, 255, 255)})
        ppp.pintar(t, 33, 23, CABELO_INTELEON, PAL_CABELO)
    else:
        casaco_pokebola(t, (36, 42, 64, 82), 62)
        ppp.pintar(t, 46, 27, CABELO_INTELEON_COSTAS, PAL_CABELO)
    # o shiny por último: só as cores do Pokémon trocam, as do CAIO ficam
    if shiny:
        quadro.shiny(t, 818, costas, originais)
    return t


# ------------------------------------------------------------ BLASTOISE
# o casco vira uma POKÉ BOLA (vermelho em cima, faixa, branco embaixo e o
# botão grande) e os cachos do CAIO cobrem o alto da cabeça. Tudo PPP.
CABELO_BLASTOISE = [         # x 25..46, y 28..35
    "......KKK..KKK..KK....",
    "....KKhmHKKhmHKKhmK...",
    "...KhmHHEHhmHEHHmHEK..",
    "..KHHEhmHHHEHhmHHEHHK.",
    ".KhmHHHEHhmHHHEHhmHHK.",
    ".KHHEhmHHHHEhmHHHEHHHK",
    "..KHHHEHKKHHHEHKHHEHK.",
    "...KKKK..KKKKKK.KKKK..",
]
CABELO_BLASTOISE_COSTAS = [  # x 45..68, y 26..36
    ".......KKK...KKK..KK....",
    ".....KKhmHKKKhmHKKhmK...",
    "....KhmHHEHhmHHEHHmHEK..",
    "...KHHEhmHHHEHhmHHHEHK..",
    "..KhmHHHEHhmHHHEHhmHHHK.",
    "..KHHEhmHHHHEhmHHHEHHHK.",
    ".KhmHHHEHhmHHHHEHhmHHHHK",
    ".KHHEHHHHHEhmHHHHHEHhmHK",
    "..KHHHEHhmHHHEHhmHHHEHK.",
    "...KKHHHKKHHHEHHKKHHKK..",
    ".....KKK..KKKKKK..KK....",
]
# o botão grande da POKÉ BOLA, com o anel de dentro
BOTAO_GRANDE = [
    ".KKKKK.",
    "KWWWWWK",
    "KWKKKWK",
    "KWKsKWK",
    "KWKKKWK",
    "KWWWWWK",
    ".KKKKK.",
]
PAL_BOTAO = {"K": FAIXA, "W": BRANCO, "s": (255, 255, 255)}
CASCO = ((140, 99, 66), (90, 57, 24))            # o marrom do casco, de frente
CASCO_COSTAS = ((140, 99, 66), (90, 58, 25))


def blastoise(costas=False, shiny=False):
    """CAIO-BLASTOISE. O casco virou POKÉ BOLA; os cachos do CAIO no alto
    da cabeça."""
    t = quadro.tela(9, costas)
    originais = quadro.cores(t)
    if not costas:
        casaco_pokebola(t, (40, 36, 58, 46), 60, CASCO)      # a borda do casco atrás da cabeça
        casaco_pokebola(t, (56, 36, 77, 82), 60, CASCO)
        ppp.pintar(t, 63, 57, BOTAO_GRANDE, PAL_BOTAO)
        ppp.pintar(t, 25, 28, CABELO_BLASTOISE, PAL_CABELO)
    else:
        casaco_pokebola(t, (18, 38, 62, 82), 60, CASCO_COSTAS)
        ppp.pintar(t, 35, 57, BOTAO_GRANDE, PAL_BOTAO)
        ppp.pintar(t, 45, 26, CABELO_BLASTOISE_COSTAS, PAL_CABELO)
    if shiny:
        quadro.shiny(t, 9, costas, originais)
    return t


# ------------------------------------------------------------ FERALIGATR
# os espinhos vermelhos das costas FICAM (já são da cor da roupa do CAIO); os
# da cabeça viram o cabelo cacheado, e a barriga amarela vira POKÉ BOLA. PPP.
CABELO_FERALIGATR = [        # x 17..46, y 24..38
    "______KKK_____________________",
    "____KKhmHK__KKK_______________",
    "___KHHmHEHKKHhmK__KK__________",
    "__KHHHHEEhmHHmHEKKHHK_________",
    "__KhmHHHHmHEHHEEhmHHHK_KK_____",
    "_KHmHEHHHHEEHHHHmHEHHhKHHK____",
    "_KHHEEhmHHHHhmHHHEEHHmHEHHK___",
    "KHHHHHmHEHHHmHEHHHhmHHEEhmHK__",
    "KHhmHHHEEHHHHEEHHHmHEHHHmHEHK_",
    "KEmHEHHHHhmHHHHhmHHEEHHHHEEHK_",
    ".KHEEHHHHmHEHHHmHEHHHhmHHHHEK.",
    ".KEHHhmHHHEEhmHHEEHHHmHEHHEK..",
    "..KEHmHEHHHHmHEEEEhmHHEEEEK...",
    "..KKEEEEEEEEEEEKKKKEEEEEKK....",
    "....KKKKKKKKKKK....KKKKK......",
]
CABELO_FERALIGATR_COSTAS = [ # x 57..77, y 24..36
    "_____KKK__KKK________",
    "___KKhmHKKHhmKK_KK___",
    "__KHHmHEHHHmHEHKHHK__",
    "_KHhmHEEhmHHEEhmHHHK_",
    "_KHmHEHHmHEHHHmHEhmHK",
    "KHHHEEhmHEEHHHHEEmHEK",
    "KHhmHHmHEHHhmHHHHHEEK",
    "KEmHEHHEEHHmHEHhmHHEK",
    ".KHEhmHHHHHHEEHmHEHK.",
    ".KEHmHEHHhmHHhmHEEEK.",
    "..KEEEEhmmHEHmHEEEK..",
    "...KKEEmEEEEEEEEKK...",
    ".....KKKKKKKKKKK.....",
]
ESPINHO = ((255, 140, 132), (247, 82, 90), (132, 0, 8))
BARRIGA_FERALIGATR = ((255, 231, 140), (206, 189, 99), (107, 82, 0))


def apagar_cores(t, caixa, cores):
    """apaga, pixel por pixel, só as `cores` dentro da caixa"""
    px = t.img.load()
    x0, y0, x1, y1 = caixa
    for y in range(y0, y1):
        for x in range(x0, x1):
            if px[x, y][3] and px[x, y][:3] in cores:
                px[x, y] = (0, 0, 0, 0)


def feraligatr(costas=False, shiny=False):
    """CAIO-FERALIGATR. Os espinhos da cabeça viraram os cachos do CAIO; os
    das costas continuam vermelhos; a barriga virou POKÉ BOLA."""
    t = quadro.tela(160, costas)
    originais = quadro.cores(t)
    if not costas:
        apagar(t, (17, 20, 47, 35))                     # os espinhos da cabeça saem (com o contorno)
        apagar_cores(t, (17, 35, 47, 38), ESPINHO)
        quadro.trocar(t, dict(zip(ESPINHO, (CABELO_M, CABELO, CABELO_E))), (17, 38, 33, 42))
        ppp.pintar(t, 17, 24, CABELO_FERALIGATR, PAL_CABELO)
        casaco_pokebola(t, (26, 66, 50, 84), 76, BARRIGA_FERALIGATR)
        ppp.pintar(t, 40, 74, BOTAO, PAL_BOTAO)
    else:
        apagar(t, (61, 18, 78, 33))                     # os espinhos da cabeça saem
        ppp.pintar(t, 57, 24, CABELO_FERALIGATR_COSTAS, PAL_CABELO)
    if shiny:
        quadro.shiny(t, 160, costas, originais)
    return t


# ------------------------------------------------------------ SWAMPERT
# as duas barbatanas pretas da cabeça viram um volume de cachos do CAIO; o
# laranja das bochechas e dos braços vira o vermelho da roupa dele; a barriga
# clara vira POKÉ BOLA. PPP.
CABELO_SWAMPERT = [          # x 20..53, y 38..54 (de costas: x 30..63, y 36..52)
    "______KKK____KKK____KKK___________",
    "____KKhmHKKKKhmHKKKKhmHKK__KK_____",
    "___KHHmHEHHHHmHEHHHHmHEHHKKhmK____",
    "__KhmHHEEhmHHHEEHHHHHEEHHHHmHEK___",
    "_KHmHEHHHmHEHHHHhmHHHHHhmHHHEEHK__",
    "_KHHEEHHHHEEHHHHmHEHHHHmHEHHHhmHK_",
    "KHHHHhmHHHHHhmHHHEEHHHHHEEHHHmHEK_",
    "KHHHHmHEHHHHmHEHHHHhmHHHHHhmHHEEHK",
    "KHhmHHEEHHHHHEEHHHHmHEHHHHmHEHHHHK",
    "KEmHEHHHHhmHHHHhmHHHEEHHHHHEEHHHEK",
    ".KHEEHHHHmHEHHHmHEHHHHhmHHHHhmHHK.",
    ".KEHHhmHHHEEHHHHEEHHHHmHEHHHmHEEK.",
    "..KHHmHEHHHHhmHHHHhmHHHEEHHHHEEK..",
    "..KEHHEEEEEEmEEEEEmEEEHHhmHHHEK...",
    "...KhmHEKKKKKKKKKKKKKKEHmHEEEK....",
    "....KEEK..............KEEEEK......",
    ".....KK................KKKK.......",
]
LARANJA_SWAMPERT = {(247, 181, 66): VERMELHO_C, (239, 132, 66): VERMELHO, (132, 74, 41): VERMELHO_E}
BARRIGA_SWAMPERT = ((222, 239, 231), (173, 189, 181), (107, 123, 115))


def swampert(costas=False, shiny=False):
    """CAIO-SWAMPERT. Barbatanas da cabeça viraram cachos; o laranja virou o
    vermelho do CAIO; a barriga virou POKÉ BOLA."""
    t = quadro.tela(260, costas)
    originais = quadro.cores(t)
    if not costas:
        olhos = t.img.crop((24, 55, 41, 59))           # os olhos laranja ficam como estão
        quadro.trocar(t, LARANJA_SWAMPERT)
        t.img.paste(olhos, (24, 55))
        apagar(t, (20, 33, 55, 50))                     # as barbatanas da cabeça saem
        ppp.pintar(t, 20, 38, CABELO_SWAMPERT, PAL_CABELO)
        casaco_pokebola(t, (38, 62, 56, 86), 74, BARRIGA_SWAMPERT)
        ppp.pintar(t, 46, 72, BOTAO, PAL_BOTAO)
    else:
        quadro.trocar(t, LARANJA_SWAMPERT)
        apagar(t, (30, 30, 76, 47))
        ppp.pintar(t, 30, 36, CABELO_SWAMPERT, PAL_CABELO)
    if shiny:
        quadro.shiny(t, 260, costas, originais)
    return t


# ------------------------------------------------------------ SAMUROTT
# o capacete bege vira o cabelo do CAIO (preto, com o brilho dos cachos
# posto pixel por pixel), o chifre fica vermelho e as conchas-espada das
# patas viram POKÉ BOLAS. PPP.
BEGE_SAMUROTT = ((214, 198, 123), (173, 148, 90), (123, 99, 66))
BEGE_SAMUROTT_COSTAS = BEGE_SAMUROTT
# onde fica o brilho de cada cacho no capacete (x, y), escolhido à mão
CACHOS_SAMUROTT = [(44, 32), (49, 31), (54, 33), (58, 37), (42, 37), (47, 36), (52, 38),
                   (56, 42), (45, 41), (50, 43), (54, 47), (47, 47), (51, 51), (56, 52)]


CACHOS_SAMUROTT_COSTAS = [(42, 24), (47, 26), (52, 24), (40, 30), (45, 31), (50, 33), (55, 29),
                          (43, 37), (48, 39), (53, 37), (38, 43), (44, 45), (49, 47)]


def cachos_no_cabelo(t, pontos):
    """o brilho e o meio-tom de cada cacho, pixel por pixel, só onde já é
    cabelo"""
    px = t.img.load()
    cabelo = {CABELO, CABELO_M, CABELO_E}
    for x, y in pontos:
        for dx, dy, c in ((0, 0, CABELO_B), (1, 0, CABELO_M), (0, 1, CABELO_M), (2, 1, CABELO_E),
                          (1, 2, CABELO_E)):
            if px[x + dx, y + dy][3] and px[x + dx, y + dy][:3] in cabelo | {CABELO_B}:
                px[x + dx, y + dy] = A(c)


def samurott(costas=False, shiny=False):
    """CAIO-SAMUROTT. Capacete de cabelo cacheado, chifre vermelho, as
    conchas-espada viraram POKÉ BOLAS."""
    t = quadro.tela(503, costas)
    originais = quadro.cores(t)
    para_cabelo = dict(zip(BEGE_SAMUROTT, (CABELO, CABELO_M, CABELO_E)))
    para_vermelho = dict(zip(BEGE_SAMUROTT, (VERMELHO, VERMELHO_E, VERMELHO_EE)))
    if not costas:
        quadro.trocar(t, para_vermelho, (18, 15, 37, 38))             # o chifre
        quadro.trocar(t, para_cabelo, (37, 27, 64, 62))               # o capacete
        cachos_no_cabelo(t, CACHOS_SAMUROTT)
        casaco_pokebola(t, (48, 44, 92, 92), 76, BEGE_SAMUROTT)       # as conchas-espada
        ppp.pintar(t, 58, 74, BOTAO, PAL_BOTAO)
        ppp.pintar(t, 74, 74, BOTAO, PAL_BOTAO)
    else:
        quadro.trocar(t, para_vermelho, (57, 13, 76, 28))             # o chifre
        quadro.trocar(t, para_cabelo, (30, 20, 66, 52))               # o capacete
        cachos_no_cabelo(t, CACHOS_SAMUROTT_COSTAS)
        casaco_pokebola(t, (0, 44, 25, 63), 53, BEGE_SAMUROTT)        # as conchas-espada
        casaco_pokebola(t, (52, 55, 80, 96), 72, BEGE_SAMUROTT)
        casaco_pokebola(t, (0, 64, 20, 96), 80, BEGE_SAMUROTT)
        casaco_pokebola(t, (28, 62, 52, 96), 73, BEGE_SAMUROTT)
    if shiny:
        quadro.shiny(t, 503, costas, originais)
    return t


# ------------------------------------------------------------ RILLABOOM
# o cabelão verde vira os cachos pretos do CAIO (o brilho de cada cacho posto
# à mão) e o tambor vira POKÉ BOLA: a pele vermelha em cima, branca embaixo,
# a faixa e o botão grande no lugar da folha. PPP.
CABELO_VERDE_RILLABOOM = {(0, 132, 69): CABELO_M, (0, 89, 47): CABELO, (1, 47, 25): CABELO_E}
PELE_TAMBOR = ((246, 226, 161), (181, 154, 125))
CACHOS_RILLABOOM = [(30, 18), (36, 16), (44, 19), (52, 18), (40, 23), (48, 23), (56, 22), (28, 24),
                    (34, 26), (62, 27), (66, 31), (58, 30), (70, 34), (52, 35), (46, 28), (26, 30),
                    (60, 37), (66, 38), (23, 34)]


CACHOS_RILLABOOM_COSTAS = [(10, 24), (16, 20), (24, 18), (32, 20), (40, 24), (12, 30), (20, 28),
                           (28, 26), (36, 30), (44, 34), (8, 38), (16, 36), (24, 34), (32, 38),
                           (40, 40), (12, 44), (20, 44), (28, 42), (36, 46), (10, 52), (18, 50),
                           (26, 50), (14, 58), (22, 56)]


def rillaboom(costas=False, shiny=False):
    """CAIO-RILLABOOM. Cabelão de cachos pretos e o tambor de POKÉ BOLA."""
    t = quadro.tela(812, costas)
    originais = quadro.cores(t)
    if not costas:
        quadro.trocar(t, CABELO_VERDE_RILLABOOM, (18, 12, 78, 43))
        cachos_no_cabelo(t, CACHOS_RILLABOOM)
        # a folha do meio do tambor some na pele, e a pele vira POKÉ BOLA
        quadro.trocar(t, {(0, 132, 69): PELE_TAMBOR[0], (0, 89, 47): PELE_TAMBOR[1],
                          (1, 47, 25): PELE_TAMBOR[1]}, (10, 64, 30, 82))
        casaco_pokebola(t, (4, 50, 34, 93), 73, PELE_TAMBOR)
        ppp.pintar(t, 16, 70, BOTAO_GRANDE, PAL_BOTAO)
    else:
        quadro.trocar(t, CABELO_VERDE_RILLABOOM, (0, 10, 50, 62))
        cachos_no_cabelo(t, CACHOS_RILLABOOM_COSTAS)
        casaco_pokebola(t, (54, 44, 96, 94), 67, ((246, 226, 161), (181, 154, 125), (133, 117, 80)))
    if shiny:
        quadro.shiny(t, 812, costas, originais)
    return t


# ------------------------------------------------------------ QUAQUAVAL
# o vermelho da cabeça já é o do CAIO e fica; a pluma azul vira os cachos
# pretos, e o peito branco vira POKÉ BOLA. PPP.
PLUMA_QUAQUAVAL = {(72, 97, 236): CABELO_M, (57, 70, 183): CABELO, (39, 45, 107): CABELO_E}
PEITO_QUAQUAVAL = ((252, 252, 252), (190, 193, 199), (90, 101, 118))
CACHOS_QUAQUAVAL = [(50, 19), (54, 17), (57, 21), (52, 24), (56, 26), (59, 22), (50, 27)]


def quaquaval(costas=False, shiny=False):
    """CAIO-QUAQUAVAL. Pluma de cachos pretos, peito de POKÉ BOLA."""
    t = quadro.tela(914, costas)
    originais = quadro.cores(t)
    if not costas:
        quadro.trocar(t, PLUMA_QUAQUAVAL, (47, 13, 63, 32))
        cachos_no_cabelo(t, CACHOS_QUAQUAVAL)
        casaco_pokebola(t, (42, 38, 53, 52), 45, PEITO_QUAQUAVAL)
        ppp.pintar(t, 45, 43, BOTAO, PAL_BOTAO)
    else:
        quadro.trocar(t, {(82, 89, 255): CABELO_M, (132, 142, 247): CABELO_B, (47, 49, 173): CABELO,
                          (26, 27, 107): CABELO_E}, (34, 18, 64, 36))
        cachos_no_cabelo(t, [(40, 24), (45, 22), (50, 24), (42, 28), (47, 27), (52, 29), (44, 32),
                             (49, 31), (55, 27), (57, 23)])
    if shiny:
        quadro.shiny(t, 914, costas, originais)
    return t


# ------------------------------------------------------------ RAICHU
# o CAIO-RAICHU é o PIKACHU DE PELÚCIA do CAIO: amarelo-creme de pano, olhos
# ovais pretos com brilho, bochecha vermelha redonda, nariz de triângulo, a
# boquinha em "w", a ponta da orelha marrom e a costura no meio da cabeça.
# Parte do 1º quadro do PIKACHU, editado PPP.
PANO = {
    (255, 247, 165): (255, 252, 228),   # brilho
    (247, 231, 82): (250, 243, 196),    # o pano
    (247, 189, 33): (236, 224, 166),    # sombra
    (222, 148, 0): (212, 196, 138),
    (156, 82, 0): (176, 158, 110),
    (99, 49, 8): (128, 110, 76),        # a beirada marrom vira costura escura
    (41, 41, 41): (120, 72, 40),        # a ponta da orelha: marrom
    (66, 66, 74): (156, 98, 56),
    (115, 115, 132): (190, 132, 84),
}
# o rosto inteiro, pixel por pixel, por cima da cara de verdade (x 15..31,
# y 27..38 na tela de 64): C pano, Y brilho, S sombra, c costura, K preto,
# T brilho do olho, R/r bochecha
ROSTO_PELUCIA = [
    "SCCYYYYYcYCCCCCCS",
    "SCCYYYYYcYCCCCCCS",
    "SCCCCCCCcCCCCCCCS",
    "SCCKKCCCCCCCCKKCS",
    "SCKTKKCCCCCCKTKKS",
    "SCKKKKCCCCCCKKKKS",
    "SCCKKCCKKKCCCKKCS",
    "RRRCCCCCKCCCCCRRR",
    "RRRCCKCCKCCKCCRRR",
    "SRrCCCKKCKKCCCCRr",
    "SCCCCCCCCCCCCCCCS",
    "SSSSSSSSSSSSSSSSS",
]
PAL_PELUCIA = {"K": (24, 20, 24), "T": (255, 255, 255), "R": (228, 70, 70), "r": (186, 44, 52),
               "C": (250, 243, 196), "Y": (255, 252, 228), "S": (236, 224, 166), "c": (222, 208, 156)}


def raichu(costas=False, shiny=False):
    """CAIO-RAICHU: o PIKACHU DE PELÚCIA."""
    t = quadro.tela(25, costas, minimo=64)
    quadro.trocar(t, PANO)
    if not costas:
        ppp.pintar(t, 15, 27, ROSTO_PELUCIA, PAL_PELUCIA)
    else:
        # a pelúcia não tem as listras das costas: viram pano (só no miolo,
        # a beirada fica com a costura)
        quadro.trocar(t, {(176, 158, 110): (236, 224, 166), (212, 196, 138): (236, 224, 166)},
                      (20, 30, 50, 60))
    # o shiny da pelúcia: o mesmo pano num tom mais quente
    if shiny:
        quadro.trocar(t, {(250, 243, 196): (250, 226, 160), (236, 224, 166): (232, 206, 136),
                          (255, 252, 228): (255, 240, 200)})
    return t


# ------------------------------------------------------------ TILAPIRAÇU
# o inicial de ÁGUA de BRAGLITCH: a barbatana vermelha de cima vira os cachos
# do CAIO, a faixa de karatê vira as cores dos JOY-CON (a faixa azul, a ponta
# solta vermelha) e o corpo cinza vira POKÉ BOLA (vermelho em cima, faixa,
# branco embaixo e o botão). O olho e os punhos ficam. PPP.
BARBATANA_TILAPIRACU = {(226, 96, 88): CABELO, (235, 144, 138): CABELO_M, (250, 170, 140): CABELO_B,
                        (167, 71, 65): CABELO_E}
FAIXA_AZUL = {(48, 96, 196): JOY_AZUL, (110, 160, 240): (120, 214, 250)}
FAIXA_VERMELHA = {(48, 96, 196): JOY_VERM, (110, 160, 240): (255, 160, 168)}
CINZA_TILAPIRACU = ((191, 201, 210), (164, 178, 190), (121, 132, 141), (90, 102, 120))
CACHOS_TILAPIRACU = [(34, 32), (39, 31), (44, 31), (49, 32), (54, 33), (36, 35), (42, 35), (48, 35),
                     (55, 36)]


def tilapiracu(costas=False, shiny=False):
    """CAIO-TILAPIRAÇU."""
    t = quadro.tela(1038, costas)
    if not costas:
        olho = t.img.crop((31, 44, 42, 55))
        quadro.trocar(t, BARBATANA_TILAPIRACU, (31, 29, 62, 39))
        cachos_no_cabelo(t, CACHOS_TILAPIRACU)
        quadro.trocar(t, FAIXA_AZUL, (26, 38, 63, 46))
        quadro.trocar(t, FAIXA_VERMELHA, (63, 34, 80, 48))
        # os cinzas do meio caem no tom vizinho, e o corpo vira POKÉ BOLA
        quadro.trocar(t, {(154, 163, 174): (164, 178, 190), (110, 124, 140): (121, 132, 141)}, (30, 42, 64, 75))
        casaco_pokebola(t, (30, 42, 64, 75), 62, CINZA_TILAPIRACU)
        # devolve só os pixels do olho (o preto, o vermelho e o brilho)
        po, pt = olho.load(), t.img.load()
        for y in range(olho.height):
            for x in range(olho.width):
                if po[x, y][:3] in ((30, 26, 34), (220, 60, 50), (250, 250, 250)):
                    pt[31 + x, 44 + y] = po[x, y]
        ppp.pintar(t, 44, 60, BOTAO, PAL_BOTAO)
    else:
        quadro.trocar(t, BARBATANA_TILAPIRACU, (30, 29, 72, 40))
        cachos_no_cabelo(t, [(x + 12, y) for x, y in CACHOS_TILAPIRACU])
        quadro.trocar(t, FAIXA_VERMELHA, (14, 34, 34, 50))
        quadro.trocar(t, FAIXA_AZUL, (34, 38, 70, 46))
        quadro.trocar(t, {(154, 163, 174): (164, 178, 190), (110, 124, 140): (121, 132, 141)}, (30, 42, 70, 76))
        casaco_pokebola(t, (30, 42, 70, 76), 62, CINZA_TILAPIRACU)
    if shiny:
        # o TILAPIRAÇU não tem arte shiny: a faixa troca os lados dos JOY-CON
        quadro.trocar(t, {JOY_AZUL: JOY_VERM, JOY_VERM: JOY_AZUL})
    return t


DESENHOS = {
    24000: (blastoise, "blastoise"),
    24001: (feraligatr, "feraligatr"),
    24002: (swampert, "swampert"),
    24003: (empoleon, "empoleon"),
    24004: (samurott, "samurott"),
    24005: (greninja, "greninja"),
    24006: (rillaboom, "rillaboom"),
    24007: (inteleon, "inteleon"),
    24008: (quaquaval, "quaquaval"),
    24009: (raichu, "raichu"),
    24010: (tilapiracu, "tilapiracu"),
}
