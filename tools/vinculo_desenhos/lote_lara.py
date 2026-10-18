"""Formas de vínculo da LARA (src/data/vinculo.js): os fofos na forma final e
o LOPUNNY, com a cara da LARA — o capuz de BUNEARY SHINY (rosa, pelúcia
creme, orelhas de coelho), o cabelo preto longo e liso e o sensor branco no
braço.

Cada um parte do 1º QUADRO DA ANIMAÇÃO da espécie (tools/vinculo_desenhos/
quadro.py) e é editado PIXEL POR PIXEL aqui (tools/vinculo_desenhos/ppp.py).
"""
from pixelart import Tela, clarear, escurecer  # noqa: F401
import ppp
import quadro

A = lambda c: tuple(c[:3]) + (255,)   # noqa: E731

# a LARA
ROSA = (236, 140, 180)
ROSA_C = (250, 190, 215)
ROSA_E = (184, 84, 136)
ROSA_EE = (130, 50, 96)
CREME = (250, 236, 176)
CREME_E = (214, 190, 120)
CABELO = (40, 32, 36)
BRANCO = (255, 255, 255)
PRETO = (16, 14, 20)


# ------------------------------------------------------------ LOPUNNY
# a LARA-LOPUNNY é uma MY MELODY meio POKÉMON: a cabeça é o capuz rosa com
# o rosto branco (olhinhos e o nariz amarelo), as orelhas compridas de pelúcia
# viram as orelhas rosa do capuz com a florzinha, e o corpo fica branco.
MARROM_LOPUNNY = ((181, 123, 74), (140, 90, 66), (82, 57, 57))
CREME_LOPUNNY = ((239, 222, 165), (198, 165, 123), (132, 107, 90), (99, 74, 66))
ROSTO_MELODY = [             # x 42..52, y 45..54: o rosto branco dentro do capuz
    "...EEEEE...",
    ".EEWWWWWEE.",
    "EWWWWWWWWWE",
    "EWWKWWWKWWE",
    "EWWKWWWKWWE",
    "EWWWWWWWWWE",
    "EWRWWyWWRWE",
    "EWWWyyyWWWE",
    ".EWWWWWWWE.",
    "..EEEEEEE..",
]
FLOR = [
    "..r..",
    ".rrr.",
    "rrYrr",
    ".rrr.",
    "..r..",
]
PAL_MELODY = {"W": BRANCO, "E": ROSA_E, "K": PRETO, "y": (250, 206, 70), "R": (250, 170, 200),
              "r": (232, 64, 112), "Y": (255, 220, 80)}


def lopunny(costas=False, shiny=False):
    """LARA-LOPUNNY: a MY MELODY meio POKÉMON."""
    t = quadro.tela(428, costas)
    originais = quadro.cores(t)
    capuz = dict(zip(MARROM_LOPUNNY, (ROSA, ROSA_E, ROSA_EE)))
    orelha = dict(zip(CREME_LOPUNNY, (ROSA_C, ROSA, ROSA_E, ROSA_EE)))
    corpo = dict(zip(MARROM_LOPUNNY, (BRANCO, (226, 222, 234), (150, 144, 162))))
    if not costas:
        # a cabeça inteira vira o capuz, e some o olho vermelho de antes
        quadro.trocar(t, capuz, (30, 28, 64, 57))
        quadro.trocar(t, {(198, 90, 123): ROSA_E, (123, 57, 66): ROSA_EE, (239, 90, 74): ROSA,
                          (255, 255, 255): ROSA_C}, (30, 28, 64, 57))
        quadro.trocar(t, orelha)                                   # as orelhas de pelúcia
        quadro.trocar(t, corpo)                                    # o resto do marrom: corpo branco
        ppp.pintar(t, 42, 45, ROSTO_MELODY, PAL_MELODY)
        ppp.pintar(t, 36, 33, FLOR, PAL_MELODY)
    else:
        quadro.trocar(t, capuz, (0, 0, 96, 68))                     # cabeça e orelhas: o capuz
        quadro.trocar(t, orelha)
        quadro.trocar(t, corpo)                                     # as pernas: corpo branco
        ppp.pintar(t, 52, 31, FLOR, PAL_MELODY)
    if shiny:
        shiny_lilas(t)          # o rosa todo foi pintado por cima: o capuz fica lilás
    return t


# ------------------------------------------------------------ o jeito da LARA
# Nada é colado por cima: o cabelo preto liso da LARA sai de uma parte que o
# Pokémon JÁ TEM (asas, topete, cachinhos, pétalas, plumas, chifres), trocada
# tom por tom pelo preto do cabelo; o rosa e a pelúcia creme do capuz de
# BUNEARY SHINY saem do corpo do mesmo jeito. Tudo PIXEL POR PIXEL.
CAB_C = (96, 84, 96)        # o brilho do cabelo
CAB_E = (24, 18, 22)        # a sombra do cabelo


def cabelo(tons):
    """os `tons` de uma parte (do mais claro pro mais escuro) -> o cabelo"""
    alvo = (CAB_C, CABELO, CAB_E, PRETO)
    k = 0 if len(tons) >= 3 else 1
    return dict(zip(tons, alvo[k:]))


def shiny_lilas(t):
    """quando o shiny não tem o que trocar, o rosa da LARA fica lilás"""
    quadro.trocar(t, {ROSA: (196, 160, 232), ROSA_C: (228, 206, 248), ROSA_E: (146, 108, 196),
                      ROSA_EE: (98, 68, 146)})


def protege(t, caixa, fazer):
    """faz as trocas de `fazer(t)` sem mexer no que está dentro da caixa"""
    guarda = t.img.crop(caixa)
    fazer(t)
    t.img.paste(guarda, caixa[:2])


# ------------------------------------------------------------ CLEFABLE
# as asinhas dos lados viram as mechas do cabelo preto da LARA, e as pontas
# das orelhas a pelúcia creme do capuz.
PONTA_CLEFABLE = {(82, 66, 57): CREME_E, (123, 107, 99): CREME, (82, 66, 58): CREME_E}
ASA_CLEFABLE = cabelo(((214, 123, 165), (189, 90, 123), (140, 74, 82), (82, 49, 74)))
ASA_CLEFABLE[(214, 123, 164)] = CAB_C


def clefable(costas=False, shiny=False):
    """LARA-CLEFABLE."""
    t = quadro.tela(36, costas)
    originais = quadro.cores(t)
    quadro.trocar(t, PONTA_CLEFABLE)
    if not costas:
        quadro.trocar(t, ASA_CLEFABLE, (22, 52, 38, 64))
        quadro.trocar(t, ASA_CLEFABLE, (60, 52, 78, 64))
    else:
        quadro.trocar(t, ASA_CLEFABLE, (18, 50, 82, 66))
    if shiny:
        quadro.shiny(t, 36, costas, originais)
    return t


# ------------------------------------------------------------ WIGGLYTUFF
# o topete enrolado da testa vira a franja preta da LARA; as pontas brancas
# das orelhas viram a pelúcia creme.
PONTA_WIGGLYTUFF = {(255, 255, 255): CREME, (231, 222, 231): CREME, (115, 115, 115): CREME_E}
TOPETE_WIGGLYTUFF = cabelo(((255, 173, 189), (247, 123, 148), (206, 107, 99), (140, 66, 66)))


def wigglytuff(costas=False, shiny=False):
    """LARA-WIGGLYTUFF."""
    t = quadro.tela(40, costas)
    originais = quadro.cores(t)
    quadro.trocar(t, PONTA_WIGGLYTUFF, (24, 32, 72, 46))
    quadro.trocar(t, TOPETE_WIGGLYTUFF, (38, 36, 56, 51))
    if shiny:
        quadro.shiny(t, 40, costas, originais)
    return t


# ------------------------------------------------------------ TOGEKISS
# a LARA-TOGEKISS é um PIANO: o corpo nas cores de teclado (branco e cinza),
# as manchas e a coroa vermelhas num vermelho quase preto e as azuis num azul
# quase preto, a beirada de cima das asas vira um TECLADO (teclas brancas com
# o risco entre elas e as pretas em grupos de 2 e 3), e em volta voam
# claves, notas e figuras de ritmo. Tudo PPP.
PIANO_TOGEKISS = {
    (239, 239, 255): (250, 250, 250), (238, 238, 254): (250, 250, 250),     # o branco
    (189, 198, 222): (206, 206, 212), (132, 156, 181): (140, 140, 148),     # os cinzas
    (74, 90, 115): (70, 70, 76),
    (206, 74, 49): (56, 14, 18), (115, 49, 41): (30, 6, 10), (189, 132, 132): (78, 30, 34),   # vermelho quase preto
    (66, 132, 239): (14, 18, 56), (65, 132, 238): (14, 18, 56),             # azul quase preto
    (148, 181, 255): (32, 38, 84), (82, 90, 173): (10, 12, 38),
}
TECLA_BRANCA = (250, 250, 250)
RISCO = (176, 176, 184)
TECLA_PRETA = (24, 22, 28)
# numa oitava de 21 px (7 teclas brancas de 3 px), onde ficam as pretas
PRETAS = {2, 3, 5, 6, 11, 12, 14, 15, 17, 18}


def teclado(t, x0, x1, fundo=6, preta=3):
    """a beirada de cima da asa, de x0 a x1, vira teclado: em cada coluna,
    logo abaixo do contorno de cima, `fundo` pixels de tecla; as pretas
    descem `preta` pixels"""
    px = t.img.load()
    for x in range(x0, x1):
        ys = [y for y in range(t.lado) if px[x, y][3]]
        if not ys:
            continue
        topo = ys[0] + 1                                  # o primeiro abaixo do contorno
        for k in range(fundo):
            y = topo + k
            if not px[x, y][3] or px[x, y][:3] == (16, 16, 16):
                break
            o = (x - x0) % 21
            if o in PRETAS and k < preta:
                px[x, y] = A(TECLA_PRETA)
            elif o % 3 == 0:
                px[x, y] = A(RISCO)
            else:
                px[x, y] = A(TECLA_BRANCA)


# as figuras de música, letra por pixel (K a tinta; o gerador põe a borda clara)
CLAVE = [
    "..K..",
    ".K.K.",
    ".K.K.",
    "..K..",
    ".KK..",
    "K.K..",
    "K.KKK",
    "K.K.K",
    ".KKK.",
    "..K..",
    "KK...",
]
COLCHEIA = [
    "..KK.",
    "..K.K",
    "..K..",
    "..K..",
    "KKK..",
    "KKK..",
    ".K...",
]
COLCHEIAS = [
    "..KKKKK",
    "..K...K",
    "..K...K",
    "..K...K",
    "KKK.KKK",
    "KKK.KKK",
    ".K...K.",
]
SEMINIMA = [
    "..K",
    "..K",
    "..K",
    "..K",
    "KKK",
    "KKK",
    ".K.",
]
MINIMA = [
    "...K",
    "...K",
    "...K",
    ".KKK",
    "K..K",
    "K..K",
    ".KK.",
]
PAUSA = [
    "K..",
    ".K.",
    "K..",
    ".K.",
    "KK.",
    "..K",
    ".K.",
]
SUSTENIDO = [
    ".K.K.",
    "KKKKK",
    ".K.K.",
    "KKKKK",
    ".K.K.",
]


def simbolo(t, x, y, grade, tinta, borda=(250, 246, 252)):
    """uma figura de música voando: a tinta e uma borda clara em volta, pra
    aparecer em qualquer fundo de batalha"""
    px = t.img.load()
    pts = {(x + dx, y + dy) for dy, l in enumerate(grade) for dx, c in enumerate(l) if c == "K"}
    for (a, b) in pts:
        for da, db in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            q = (a + da, b + db)
            if q not in pts and 0 <= q[0] < t.lado and 0 <= q[1] < t.lado and not px[q][3]:
                px[q] = A(borda)
    for q in pts:
        if 0 <= q[0] < t.lado and 0 <= q[1] < t.lado:
            px[q] = A(tinta)


def togekiss(costas=False, shiny=False):
    """LARA-TOGEKISS: o TOGEKISS-PIANO."""
    t = quadro.tela(468, costas)
    quadro.trocar(t, PIANO_TOGEKISS)
    # o shiny: a tinta das figuras é dourada
    tinta = (196, 150, 40) if shiny else (24, 22, 28)
    if not costas:
        teclado(t, 47, 86)                 # a asa grande
        teclado(t, 11, 24, 5, 3)           # a asinha da esquerda
        for g, x, y in ((CLAVE, 12, 30), (COLCHEIAS, 34, 38), (SEMINIMA, 58, 30), (SUSTENIDO, 78, 42),
                        (MINIMA, 6, 76), (PAUSA, 86, 74), (COLCHEIA, 66, 82)):
            simbolo(t, x, y, g, tinta)
    else:
        teclado(t, 10, 58)
        teclado(t, 64, 90, 5, 3)
        for g, x, y in ((CLAVE, 80, 28), (COLCHEIA, 56, 36), (SEMINIMA, 30, 32), (SUSTENIDO, 10, 42),
                        (MINIMA, 86, 76), (PAUSA, 6, 78), (COLCHEIAS, 20, 84)):
            simbolo(t, x, y, g, tinta)
    return t


# ------------------------------------------------------------ SYLVEON
# os laços azuis viram a pelúcia creme do capuz (os olhos azuis ficam).
LACO_SYLVEON = {(100, 200, 243): CREME, (82, 143, 204): CREME, (35, 90, 153): CREME_E}


def sylveon(costas=False, shiny=False):
    """LARA-SYLVEON."""
    t = quadro.tela(700, costas)
    originais = quadro.cores(t)
    if not costas:
        protege(t, (30, 59, 44, 68), lambda t: quadro.trocar(t, LACO_SYLVEON))
    else:
        quadro.trocar(t, LACO_SYLVEON)
    if shiny:
        quadro.shiny(t, 700, costas, originais)
    return t


# ------------------------------------------------------------ AZUMARILL
# o azul vira o rosa do BUNEARY SHINY, as bolinhas e o dentro das orelhas
# viram a pelúcia creme.
AZUL_AZUMARILL = {(140, 189, 247): ROSA_C, (90, 156, 239): ROSA, (66, 132, 206): ROSA,
                  (49, 107, 173): ROSA_E, (24, 57, 115): ROSA_EE, (123, 156, 198): ROSA_E}
BOLINHAS_AZUMARILL = {(255, 255, 255): CREME, (214, 222, 247): CREME}
ORELHA_AZUMARILL = {(222, 66, 82): CREME, (189, 41, 49): CREME_E, (148, 16, 16): (170, 136, 84)}


def azumarill(costas=False, shiny=False):
    """LARA-AZUMARILL: rosa de BUNEARY SHINY."""
    t = quadro.tela(184, costas)
    quadro.trocar(t, AZUL_AZUMARILL)
    if not costas:
        quadro.trocar(t, BOLINHAS_AZUMARILL, (24, 62, 64, 80))
        quadro.trocar(t, ORELHA_AZUMARILL, (24, 34, 66, 58))
    if shiny:
        shiny_lilas(t)
    return t


# ------------------------------------------------------------ ALCREMIE
# o chantili do alto vira o capuz rosa, os morangos viram pompons creme.
CHANTILI_ALCREMIE = {(253, 228, 208): ROSA_C, (251, 226, 206): ROSA_C, (214, 164, 176): ROSA,
                     (212, 162, 174): ROSA, (242, 138, 149): ROSA_E, (133, 84, 89): ROSA_EE}
MORANGO_ALCREMIE = {(251, 93, 116): CREME, (199, 51, 78): CREME_E, (138, 32, 57): (150, 120, 70)}


def alcremie(costas=False, shiny=False):
    """LARA-ALCREMIE."""
    t = quadro.tela(869, costas)
    if not costas:
        protege(t, (37, 64, 52, 74), lambda t: quadro.trocar(t, MORANGO_ALCREMIE))
        quadro.trocar(t, CHANTILI_ALCREMIE, (28, 38, 62, 57))
    else:
        quadro.trocar(t, MORANGO_ALCREMIE)
        quadro.trocar(t, CHANTILI_ALCREMIE, (28, 38, 66, 64))
    if shiny:
        shiny_lilas(t)
    return t


# ------------------------------------------------------------ WHIMSICOTT
# os chifres enrolados dos lados da cabeça viram o cabelo preto; o algodão
# vira o rosa do capuz.
ALGODAO_WHIMSICOTT = {(231, 222, 206): ROSA_C, (198, 181, 140): ROSA, (173, 148, 90): ROSA_E}
CHIFRE_WHIMSICOTT = cabelo(((82, 165, 74), (66, 123, 66), (24, 74, 24)))


def whimsicott(costas=False, shiny=False):
    """LARA-WHIMSICOTT."""
    t = quadro.tela(547, costas)
    quadro.trocar(t, ALGODAO_WHIMSICOTT)
    quadro.trocar(t, CHIFRE_WHIMSICOTT)
    if shiny:
        shiny_lilas(t)
    return t


# ------------------------------------------------------------ CINCCINO
# o cinza vira o rosa, o pelo branco vira a pelúcia creme, e o tufo branco
# as duas mechas brancas da cabeça viram a franja preta.
CINZA_CINCCINO = {(189, 173, 156): ROSA, (132, 123, 115): ROSA_E, (82, 74, 66): ROSA_EE}
PELO_CINCCINO = {(254, 255, 255): CREME, (222, 206, 198): CREME_E, (189, 181, 181): CREME_E}
TUFO_CINCCINO = {(254, 255, 255): CABELO, (222, 206, 198): CAB_C, (189, 181, 181): CAB_E}


def cinccino(costas=False, shiny=False):
    """LARA-CINCCINO."""
    t = quadro.tela(573, costas)
    quadro.trocar(t, CINZA_CINCCINO)
    # as duas mechas brancas que caem na cara (até a linha 57) viram a franja
    quadro.trocar(t, TUFO_CINCCINO, (32, 36, 62, 58) if not costas else (32, 36, 66, 58))
    quadro.trocar(t, PELO_CINCCINO)
    if shiny:
        shiny_lilas(t)
    return t


# ------------------------------------------------------------ RIBOMBEE
# a cabeça amarela fofinha vira o rosa do capuz, o cachecol marrom a pelúcia
# creme (as antenas já são pretas como o cabelo da LARA).
AMARELO_RIBOMBEE = {(255, 229, 102): ROSA_C, (217, 191, 65): ROSA, (115, 101, 34): ROSA_EE}
CACHECOL_RIBOMBEE = {(179, 125, 71): CREME, (179, 116, 54): CREME, (115, 75, 34): CREME_E}


def ribombee(costas=False, shiny=False):
    """LARA-RIBOMBEE."""
    t = quadro.tela(743, costas)
    quadro.trocar(t, AMARELO_RIBOMBEE)
    quadro.trocar(t, CACHECOL_RIBOMBEE, (0, 0, 96, 96) if costas else (24, 64, 60, 84))
    if shiny:
        shiny_lilas(t)
    return t


DESENHOS = {
    24100: (lopunny, "lopunny"),
    24101: (clefable, "clefable"),
    24102: (wigglytuff, "wigglytuff"),
    24103: (togekiss, "togekiss"),
    24104: (sylveon, "sylveon"),
    24105: (azumarill, "azumarill"),
    24106: (alcremie, "alcremie"),
    24107: (whimsicott, "whimsicott"),
    24108: (cinccino, "cinccino"),
    24109: (ribombee, "ribombee"),
}
