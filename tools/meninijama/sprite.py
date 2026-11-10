#!/usr/bin/env python3
"""NENÊJAMA (nº 1132) -> MENINIJAMA (nº 1133), ideia do CAIO (nov/2026): uma
"pessoa" de TOUCA DE DORMIR e PIJAMA. A NENÊJAMA é a nenê de macacão de pijama
com pezinho, touquinha e o cobertorzinho; a MENINIJAMA já é uma menina de
pijama de estrelinhas, com a touca comprida caída pro lado e o travesseiro
debaixo do braço. As duas com sono (olhinho fechado) e um "Z" flutuando.

Mesmo jeito do COELHATRASADO (tools/coelhatrasado/sprite.py): peças num mapa de
MATERIAIS, acabamento de luz/sombra/contorno e os detalhes pixel a pixel.
    python3 tools/meninijama/sprite.py
"""
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "coelhatrasado"))
from sprite import Tela, acabamento, ROOT  # noqa: E402
from PIL import Image  # noqa: E402

# cada material: base, luz, sombra, contorno
NORMAL = {
    "pele":    ((250, 214, 180), (255, 232, 206), (222, 170, 140), (110, 64, 52)),
    "cabelo":  ((130, 80, 48), (170, 112, 70), (92, 54, 30), (52, 28, 16)),
    "touca":   ((90, 110, 210), (130, 150, 240), (60, 76, 160), (28, 34, 90)),
    "pompom":  ((250, 250, 255), (255, 255, 255), (200, 206, 226), (64, 66, 92)),
    "pijama":  ((170, 200, 255), (210, 226, 255), (128, 156, 220), (44, 56, 110)),
    "chinelo": ((240, 150, 180), (255, 190, 210), (200, 110, 140), (100, 40, 60)),
    "travesseiro": ((250, 250, 240), (255, 255, 255), (214, 214, 200), (90, 90, 80)),
    "cobertor": ((246, 190, 120), (255, 220, 160), (214, 150, 86), (110, 66, 30)),
}
SHINY = dict(NORMAL)
SHINY.update({
    "touca":  ((214, 90, 150), (240, 130, 186), (160, 56, 110), (80, 20, 50)),
    "pijama": ((170, 236, 200), (210, 250, 226), (120, 196, 160), (36, 90, 66)),
    "cabelo": ((236, 200, 96), (255, 230, 140), (196, 156, 60), (100, 70, 20)),
})
ESTRELA, Z = (255, 226, 90), (210, 226, 255)


def menina():
    t = Tela()
    # a TOUCA COMPRIDA: sobe da cabeça e cai pro lado direito, com o pompom
    t.poligono([(37, 22), (59, 22), (66, 13), (73, 11), (78, 17), (77, 27), (73, 31), (71, 22), (63, 24)], "touca")
    t.elipse(74.5, 32, 4.2, 4.2, "pompom")
    # o CABELO (atrás) e a CABEÇA
    t.elipse(48, 29, 12.5, 9, "cabelo")
    t.ret(35, 28, 39, 41, "cabelo")
    t.ret(57, 28, 61, 41, "cabelo")
    t.elipse(48, 34, 9.5, 8.5, "pele")
    t.ret(36, 19, 60, 24, "touca")                 # a barra da touca na testa
    t.ret(45, 42, 51, 44, "pele")                  # o pescoço
    # o PIJAMA: a blusa, as mangas e a calça
    t.poligono([(38, 44), (58, 44), (61, 63), (35, 63)], "pijama")
    t.elipse(34.5, 53, 3.2, 8.5, "pijama", 14)
    t.elipse(61.5, 53, 3.2, 8.5, "pijama", -14)
    t.ret(39, 62, 47, 79, "pijama")
    t.ret(49, 62, 57, 79, "pijama")
    # o TRAVESSEIRO debaixo do braço e as mãos
    t.elipse(67, 60, 8, 5.5, "travesseiro", -12)
    t.elipse(32.5, 61, 2.6, 2.6, "pele")
    t.elipse(63.5, 61, 2.6, 2.6, "pele")
    # os CHINELOS
    t.elipse(43, 82, 5.5, 2.8, "chinelo")
    t.elipse(53, 82, 5.5, 2.8, "chinelo")
    return t


def nene():
    t = Tela()
    # o COBERTORZINHO arrastando, atrás
    t.elipse(65, 74, 9, 6.5, "cobertor", 10)
    # o MACACÃO de pijama com pezinho
    t.elipse(48, 68, 12, 11, "pijama")
    t.elipse(40, 79, 5.2, 3.2, "pijama")
    t.elipse(56, 79, 5.2, 3.2, "pijama")
    t.elipse(37, 66, 3.2, 5, "pijama", 25)
    t.elipse(59, 66, 3.2, 5, "pijama", -25)
    t.elipse(35.5, 70, 2.4, 2.4, "pele")
    t.elipse(61, 70, 2.4, 2.4, "pele")
    # a CABEÇA (grandona) com o topetinho
    t.elipse(48, 40, 6, 3.5, "cabelo")
    t.elipse(48, 48, 11, 10, "pele")
    # a TOUQUINHA caída pro lado esquerdo, com o pompom
    t.poligono([(39, 40), (57, 40), (52, 32), (44, 28), (35, 29), (31, 33), (35, 36)], "touca")
    t.ret(38, 38, 58, 41, "touca")
    t.elipse(30.5, 34, 3.6, 3.6, "pompom")
    return t


def zzz(c, x, y):
    for dx, dy in ((0, 0), (1, 0), (2, 0), (3, 0), (2, 1), (1, 2), (0, 3), (1, 3), (2, 3), (3, 3)):
        c(x + dx, y + dy, Z)


def olho_fechado(c, x, y, contorno):
    """o olhinho de sono: um arquinho pra baixo, com cílio"""
    for dx, dy in ((0, 0), (1, 1), (2, 1), (3, 0)):
        c(x + dx, y + dy, contorno)
    c(x - 1, y - 1, contorno)


def detalhes_menina(im, pal):
    px = im.load()
    c = lambda x, y, cor: px.__setitem__((x, y), cor + (255,))
    k = pal["pele"][3]
    olho_fechado(c, 42, 34, k)
    olho_fechado(c, 51, 34, k)
    for x in (41, 42, 55, 56):                     # as bochechas
        c(x, 37, (250, 170, 170))
    c(47, 38, k); c(48, 38, k); c(47, 39, (200, 90, 90)); c(48, 39, k)   # a boquinha bocejando
    # as ESTRELINHAS do pijama e os botões
    for x, y in ((41, 49), (54, 52), (44, 57), (52, 46), (42, 68), (54, 72), (45, 75), (51, 65)):
        c(x, y, ESTRELA); c(x - 1, y, ESTRELA); c(x + 1, y, ESTRELA); c(x, y - 1, ESTRELA); c(x, y + 1, ESTRELA)
    for y in (48, 53, 58):
        c(48, y, pal["pijama"][3])
    # a costurinha do travesseiro e o "Z"
    for x in range(62, 72, 2):
        c(x, 61, pal["travesseiro"][2])
    zzz(c, 26, 14); zzz(c, 19, 6)


def detalhes_nene(im, pal):
    px = im.load()
    c = lambda x, y, cor: px.__setitem__((x, y), cor + (255,))
    k = pal["pele"][3]
    olho_fechado(c, 42, 48, k)
    olho_fechado(c, 51, 48, k)
    for x in (40, 41, 55, 56):
        c(x, 51, (250, 170, 170))
    # a CHUPETA
    for x in (46, 47, 48, 49):
        c(x, 54, (240, 150, 180))
    c(47, 53, (255, 220, 120)); c(48, 53, (255, 220, 120)); c(47, 55, (200, 110, 140)); c(48, 55, (200, 110, 140))
    # as estrelinhas do macacão e os bolinhos do cobertor
    for x, y in ((43, 64), (53, 69), (47, 74)):
        c(x, y, ESTRELA); c(x - 1, y, ESTRELA); c(x + 1, y, ESTRELA); c(x, y - 1, ESTRELA); c(x, y + 1, ESTRELA)
    for x, y in ((62, 72), (67, 75), (70, 71)):
        c(x, y, (255, 240, 220))
    zzz(c, 60, 30)


def gera(desenho, detalhes, pal):
    im = acabamento(desenho(), pal)
    detalhes(im, pal)
    return im


if __name__ == "__main__":
    pasta = os.path.join(ROOT, "assets", "sprites", "pokemon")
    feitos = []
    for dex, desenho, detalhes in ((1132, nene, detalhes_nene), (1133, menina, detalhes_menina)):
        comum, brilho = gera(desenho, detalhes, NORMAL), gera(desenho, detalhes, SHINY)
        comum.save(os.path.join(pasta, f"{dex}.png"))
        brilho.save(os.path.join(pasta, "shiny", f"{dex}.png"))
        feitos += [comum, brilho]
    prev = Image.new("RGBA", (104 * 4, 96), (52, 56, 66, 255))
    for i, im in enumerate(feitos):
        prev.alpha_composite(im, (i * 104, 0))
    prev.resize((prev.width * 4, prev.height * 4), Image.NEAREST).save(os.environ.get("PREVIA", "/tmp/meninijama_prev.png"))
    print("NENÊJAMA 1132 e MENINIJAMA 1133 -> assets/sprites/pokemon/ (+ shiny)")
