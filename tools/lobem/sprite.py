#!/usr/bin/env python3
"""LOBEBÊ (nº 1136) -> LOBEM (nº 1137), ideia do CAIO (nov/2026): o LOBO MAU
que é DO BEM, de calça. O LOBEM fica de pé, sorrindo, de calça jeans com
suspensório, um remendo de coração no joelho e uma florzinha na mão; o LOBEBÊ é
o filhote segurando com as duas patinhas a calça, que é grande demais e embola
no chão.

Mesmo jeito do COELHATRASADO (tools/coelhatrasado/sprite.py): peças num mapa de
MATERIAIS, acabamento de luz/sombra/contorno e os detalhes pixel a pixel.
    python3 tools/lobem/sprite.py
"""
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "coelhatrasado"))
from sprite import Tela, acabamento, ROOT  # noqa: E402
from PIL import Image  # noqa: E402

NORMAL = {
    "pelo":    ((140, 146, 160), (176, 182, 196), (104, 108, 124), (40, 42, 56)),
    "barriga": ((214, 216, 224), (236, 238, 244), (176, 178, 190), (40, 42, 56)),
    "orelha":  ((230, 160, 170), (250, 196, 204), (196, 120, 134), (40, 42, 56)),
    "calca":   ((70, 110, 190), (110, 150, 226), (46, 78, 146), (20, 32, 74)),
    "alca":    ((214, 56, 60), (244, 100, 100), (156, 32, 40), (70, 12, 16)),
}
SHINY = dict(NORMAL)
SHINY.update({
    "pelo":  ((196, 160, 104), (226, 196, 140), (156, 120, 70), (70, 48, 22)),
    "calca": ((70, 160, 100), (110, 200, 140), (40, 116, 70), (16, 56, 30)),
})
CORACAO, FLOR, MIOLO = (232, 60, 80), (255, 255, 255), (255, 214, 60)


def lobem():
    t = Tela()
    # o RABO peludo, atrás
    t.elipse(66, 61, 6.5, 11, "pelo", -32)
    t.elipse(70, 53.5, 3.6, 4.2, "barriga", -32)
    # as PERNAS de calça e as patas
    t.ret(39, 64, 47, 80, "calca")
    t.ret(49, 64, 57, 80, "calca")
    t.elipse(43, 82, 5.5, 2.8, "pelo")
    t.elipse(53, 82, 5.5, 2.8, "pelo")
    # o CORPO e a barriga clara
    t.elipse(48, 54, 11, 12, "pelo")
    t.elipse(48, 56, 6.5, 8, "barriga")
    # a CALÇA (a cintura) e o SUSPENSÓRIO
    t.ret(37, 60, 59, 66, "calca")
    t.ret(40, 44, 42, 60, "alca")
    t.ret(54, 44, 56, 60, "alca")
    # os braços e as mãos
    t.elipse(35, 55, 3.3, 8, "pelo", 12)
    t.elipse(61, 55, 3.3, 8, "pelo", -12)
    t.elipse(33.5, 63, 2.8, 2.8, "pelo")
    t.elipse(62.5, 63, 2.8, 2.8, "pelo")
    # a CABEÇA: orelhas pontudas, cara e o focinho claro
    t.poligono([(37, 29), (39, 15), (46, 25)], "pelo")
    t.poligono([(50, 25), (57, 15), (59, 29)], "pelo")
    t.poligono([(39.5, 26), (40, 19), (44, 25)], "orelha")
    t.poligono([(52, 25), (56, 19), (56.5, 26)], "orelha")
    # a JUBA de pelo nas bochechas e no queixo (cara de lobo), atrás da cabeça
    t.poligono([(38, 33), (31, 44), (37, 42), (36, 47), (42, 43)], "pelo")
    t.poligono([(58, 33), (65, 44), (59, 42), (60, 47), (54, 43)], "pelo")
    t.elipse(48, 32, 10.5, 9, "pelo")
    # o FOCINHO COMPRIDO, descendo da testa até o nariz
    t.poligono([(44, 31), (52, 31), (54, 40), (52, 46), (44, 46), (42, 40)], "barriga")
    return t


def lobebe():
    t = Tela()
    # o rabinho escapando
    t.elipse(63, 63, 3.5, 6, "pelo", -32)
    # a CALÇA ENORME: cobre do peito até o chão e embola embaixo
    t.elipse(39, 83, 10, 3.4, "calca")            # as duas barras embolando no chão
    t.elipse(57, 83, 10, 3.4, "calca")
    t.poligono([(34, 52), (62, 52), (66, 83), (51, 83), (48, 72), (45, 83), (30, 83)], "calca")
    t.ret(33, 51, 63, 55, "calca")                   # o cós, segurado pelas patinhas
    # as patinhas segurando o cós
    t.elipse(37, 52, 3, 3.6, "pelo")
    t.elipse(59, 52, 3, 3.6, "pelo")
    # a CABEÇONA com orelhas grandes
    t.poligono([(38, 37), (39, 23), (45, 32)], "pelo")
    t.poligono([(51, 32), (57, 23), (58, 37)], "pelo")
    t.poligono([(40, 34), (40.5, 27), (44, 32)], "orelha")
    t.poligono([(52, 32), (56, 27), (56, 34)], "orelha")
    t.elipse(48, 41, 10, 8.5, "pelo")
    t.poligono([(45, 40), (51, 40), (53, 45), (51, 49), (45, 49), (43, 45)], "barriga")   # o focinhinho
    return t


def detalhes_lobem(im, pal):
    px = im.load()
    c = lambda x, y, cor: px.__setitem__((x, y), cor + (255,))
    k = pal["pelo"][3]
    # os olhos simpáticos (redondos, com brilho) e a sobrancelha boazinha
    for ox in (40, 53):
        for x in range(ox, ox + 3):
            for y in (30, 31, 32):
                c(x, y, (40, 30, 20))
        c(ox + (0 if ox < 48 else 2), 30, (255, 255, 255))
    c(40, 28, k); c(41, 28, k); c(42, 29, k); c(55, 28, k); c(54, 28, k); c(53, 29, k)   # sobrancelha de boazinho
    # o NARIZ na ponta do focinho e o SORRISÃO com os dois caninos
    for x in (46, 47, 48, 49, 50):
        c(x, 39, (20, 20, 26))
    for x in (47, 48, 49):
        c(x, 40, (20, 20, 26))
    c(48, 41, k)
    for x, y in ((43, 42), (44, 43), (45, 44), (46, 44), (47, 44), (48, 44), (49, 44), (50, 44), (51, 44), (52, 43), (53, 42)):
        c(x, y, k)
    for x in (46, 47, 48, 49, 50):
        c(x, 43, (200, 70, 90))
    c(45, 43, (255, 255, 255)); c(51, 43, (255, 255, 255))    # os caninos
    # os botões do suspensório e a costura da calça
    c(41, 59, pal["calca"][1]); c(55, 59, pal["calca"][1])
    for y in range(67, 80, 2):
        c(48, y, pal["calca"][2])
    # o REMENDO DE CORAÇÃO no joelho
    for x, y in ((51, 70), (52, 70), (54, 70), (55, 70), (50, 71), (51, 71), (52, 71), (53, 71), (54, 71), (55, 71), (56, 71),
                 (51, 72), (52, 72), (53, 72), (54, 72), (55, 72), (52, 73), (53, 73), (54, 73), (53, 74)):
        c(x, y, CORACAO)
    # a FLORZINHA na mão (o caule e as pétalas)
    for y in range(56, 62):
        c(64, y, (60, 150, 60))
    for x, y in ((64, 53), (63, 54), (65, 54), (64, 55), (62, 53), (66, 53), (64, 52)):
        c(x, y, FLOR)
    c(64, 54, MIOLO)


def detalhes_lobebe(im, pal):
    px = im.load()
    c = lambda x, y, cor: px.__setitem__((x, y), cor + (255,))
    k = pal["pelo"][3]
    # os olhões preocupados (a calça tá caindo!) e as bochechas coradas
    for ox in (42, 51):
        for x in range(ox, ox + 3):
            for y in (39, 40, 41):
                c(x, y, (40, 30, 20))
        c(ox, 39, (255, 255, 255)); c(ox + 2, 41, (255, 255, 255))
    c(41, 37, k); c(42, 37, k); c(53, 37, k); c(54, 37, k)    # sobrancelha de "ih..."
    for x in (40, 41, 55, 56):
        c(x, 44, (240, 150, 160))
    # o narizinho na ponta do focinho e a boquinha com um dentinho
    for x in (46, 47, 48, 49):
        c(x, 45, (20, 20, 26))
    c(47, 46, (20, 20, 26)); c(48, 46, (20, 20, 26))
    c(45, 47, k); c(46, 48, k); c(47, 48, k); c(48, 48, k); c(49, 48, k); c(50, 47, k)
    c(47, 47, (255, 255, 255))
    # as dobras da calça enorme e o coração (o mesmo remendo, gigante nele)
    for x, y in ((38, 60), (39, 62), (40, 64), (58, 60), (57, 62), (56, 64), (48, 64), (48, 66), (48, 68)):
        c(x, y, pal["calca"][2])
    for x, y in ((52, 66), (53, 66), (55, 66), (56, 66), (51, 67), (52, 67), (53, 67), (54, 67), (55, 67), (56, 67), (57, 67),
                 (52, 68), (53, 68), (54, 68), (55, 68), (56, 68), (53, 69), (54, 69), (55, 69), (54, 70)):
        c(x, y, CORACAO)
    # a gotinha de suor
    c(60, 36, (150, 200, 255)); c(60, 37, (150, 200, 255)); c(61, 37, (110, 170, 240))


def gera(desenho, detalhes, pal):
    im = acabamento(desenho(), pal)
    detalhes(im, pal)
    return im


if __name__ == "__main__":
    pasta = os.path.join(ROOT, "assets", "sprites", "pokemon")
    feitos = []
    for dex, desenho, detalhes in ((1136, lobebe, detalhes_lobebe), (1137, lobem, detalhes_lobem)):
        comum, brilho = gera(desenho, detalhes, NORMAL), gera(desenho, detalhes, SHINY)
        comum.save(os.path.join(pasta, f"{dex}.png"))
        brilho.save(os.path.join(pasta, "shiny", f"{dex}.png"))
        feitos += [comum, brilho]
    prev = Image.new("RGBA", (104 * 4, 96), (52, 56, 66, 255))
    for i, im in enumerate(feitos):
        prev.alpha_composite(im, (i * 104, 0))
    prev.resize((prev.width * 4, prev.height * 4), Image.NEAREST).save(os.environ.get("PREVIA", "/tmp/lobem_prev.png"))
    print("LOBEBÊ 1136 e LOBEM 1137 -> assets/sprites/pokemon/ (+ shiny)")
