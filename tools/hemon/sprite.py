#!/usr/bin/env python3
"""HE-MINI (nº 1134) -> HE-MON (nº 1135), ideia do CAIO (nov/2026): o guerreiro
bárbaro LUTADOR/AÇO. O HE-MINI é o menininho de panela na cabeça (o capacete
dele), capinha vermelha e uma ESPADINHA de aço levantada; o HE-MON é o guerreiro
musculoso de peitoral e ombreiras de aço, cinto, short de pele, botas de metal e
a ESPADA GRANDE erguida pro alto.

Mesmo jeito do COELHATRASADO (tools/coelhatrasado/sprite.py): peças num mapa de
MATERIAIS, acabamento de luz/sombra/contorno e os detalhes pixel a pixel.
    python3 tools/hemon/sprite.py
"""
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "coelhatrasado"))
from sprite import Tela, acabamento, ROOT  # noqa: E402
from PIL import Image  # noqa: E402

NORMAL = {
    "pele":   ((232, 170, 120), (250, 200, 156), (196, 130, 86), (96, 52, 30)),
    "cabelo": ((240, 200, 72), (255, 232, 130), (200, 154, 40), (110, 74, 14)),
    "aco":    ((156, 164, 180), (210, 218, 230), (104, 112, 130), (40, 44, 58)),
    "lamina": ((196, 210, 226), (240, 248, 255), (140, 156, 178), (40, 48, 66)),
    "ouro":   ((232, 184, 48), (255, 228, 120), (168, 120, 24), (100, 62, 8)),
    "couro":  ((128, 78, 44), (164, 108, 66), (92, 52, 26), (48, 26, 12)),
    "pelo":   ((176, 120, 70), (206, 152, 100), (136, 86, 44), (66, 40, 18)),
    "capa":   ((210, 50, 50), (240, 90, 86), (150, 28, 34), (70, 12, 16)),
}
SHINY = dict(NORMAL)
SHINY.update({
    "aco":   ((214, 176, 92), (246, 214, 140), (170, 130, 56), (84, 58, 20)),    # a armadura vira dourada
    "pelo":  ((90, 90, 110), (124, 124, 146), (60, 60, 78), (28, 28, 40)),
    "capa":  ((60, 90, 200), (100, 136, 236), (36, 56, 150), (16, 24, 70)),
    "cabelo": ((246, 246, 250), (255, 255, 255), (198, 202, 220), (64, 66, 92)),
})


def hemon():
    t = Tela()
    # a ESPADA GRANDE erguida (fica atrás da mão)
    t.poligono([(64, 9), (66, 3), (68, 9)], "lamina")
    t.ret(64, 8, 68, 33, "lamina")
    t.ret(59, 34, 73, 36, "ouro")
    t.ret(65, 37, 67, 41, "couro")
    # as PERNAS e as BOTAS de aço
    t.elipse(42, 77, 4.5, 6.5, "pele")
    t.elipse(54, 77, 4.5, 6.5, "pele")
    t.ret(37, 81, 46, 86, "aco")
    t.ret(50, 81, 59, 86, "aco")
    # o SHORT DE PELE e o CINTO
    t.poligono([(37, 65), (59, 65), (61, 75), (35, 75)], "pelo")
    t.ret(37, 62, 59, 66, "couro")
    t.ret(46, 62, 50, 66, "ouro")                   # a fivela
    # o TRONCO musculoso
    t.poligono([(33, 44), (63, 44), (58, 63), (38, 63)], "pele")
    # o braço de baixo (flexionado, punho fechado) com a braçadeira
    t.elipse(30.5, 55, 4.2, 9, "pele", 8)
    t.ret(26, 59, 34, 62, "aco")
    t.elipse(29.5, 65, 3.6, 3.6, "pele")
    # o braço de cima, erguendo a espada
    t.elipse(64, 42, 3.8, 6.5, "pele", 12)
    t.ret(61, 42, 67, 44, "aco")
    t.elipse(66, 39, 3.4, 3.2, "pele")
    # o PEITORAL de aço (só a parte de cima) e as OMBREIRAS
    t.poligono([(38, 44), (58, 44), (56, 51), (40, 51)], "aco")
    t.elipse(34, 46, 5.5, 4, "aco")
    t.elipse(62, 46, 5.5, 4, "aco")
    # o pescoço e a CABEÇA, com o cabelo espetado
    t.ret(45, 40, 51, 44, "pele")
    t.elipse(48, 33, 7.5, 8, "pele")
    # o CABELO cheio: o topo, a franja reta na testa e as laterais até a orelha
    t.elipse(48, 27, 9, 5.5, "cabelo")
    t.ret(40, 26, 56, 29, "cabelo")
    t.ret(39, 27, 41, 35, "cabelo")
    t.ret(55, 27, 57, 35, "cabelo")
    return t


def hemini():
    t = Tela()
    # a CAPINHA, atrás de tudo
    t.poligono([(39, 54), (57, 54), (61, 80), (35, 80)], "capa")
    # a ESPADINHA erguida (atrás da mão)
    t.poligono([(63, 33), (64.5, 29), (66, 33)], "lamina")
    t.ret(63, 32, 66, 45, "lamina")
    t.ret(60, 46, 69, 47, "ouro")
    t.ret(64, 48, 65, 50, "couro")
    # as perninhas e as botinhas
    t.elipse(43, 77, 3.6, 4.5, "pele")
    t.elipse(53, 77, 3.6, 4.5, "pele")
    t.ret(39, 80, 46, 84, "couro")
    t.ret(50, 80, 57, 84, "couro")
    # o shortinho de pele e o corpo
    t.ret(40, 68, 56, 75, "pelo")
    t.elipse(48, 63, 8.5, 8, "pele")
    t.ret(40, 67, 56, 69, "couro")                  # o cinto
    # os bracinhos: um pra baixo, um erguendo a espadinha
    t.elipse(38.5, 65, 2.8, 5.5, "pele", 15)
    t.elipse(37.5, 70, 2.6, 2.6, "pele")
    t.elipse(61, 56, 2.8, 5.5, "pele", -35)
    t.elipse(64.5, 51, 2.8, 2.6, "pele")
    # a CABEÇONA, o cabelinho aparecendo e a PANELA de capacete (com o cabo)
    t.elipse(48, 47, 10, 9, "pele")
    t.ret(39, 42, 57, 45, "cabelo")
    t.ret(37, 34, 59, 42, "aco")
    t.ret(59, 37, 67, 39, "aco")
    return t


def detalhes_hemon(im, pal):
    px = im.load()
    c = lambda x, y, cor: px.__setitem__((x, y), cor + (255,))
    k = pal["pele"][3]
    # os olhos de herói (sobrancelha franzida) e o sorriso de dente
    for ox in (44, 50):
        c(ox, 31, k); c(ox + 1, 31, k); c(ox + 2, 31, k)          # a sobrancelha
        c(ox, 33, (255, 255, 255)); c(ox + 1, 33, (40, 70, 150)); c(ox + 2, 33, k)
    c(43, 30, k); c(53, 30, k)
    for x in range(45, 52):
        c(x, 37, k)
    for x in range(46, 51):
        c(x, 36, (255, 255, 255))
    # o queixo quadrado
    c(45, 39, pal["pele"][2]); c(51, 39, pal["pele"][2])
    # os músculos: a risca do peito e os gomos da barriga
    sombra = pal["pele"][2]
    for y in range(52, 62):
        c(48, y, sombra)
    for y in (54, 57, 60):
        for x in (44, 45, 46, 50, 51, 52):
            c(x, y, sombra)
    # o emblema redondo no peitoral e os rebites das ombreiras
    for x, y in ((47, 46), (48, 46), (49, 46), (47, 47), (48, 47), (49, 47), (48, 48)):
        c(x, y, pal["ouro"][0])
    c(48, 45, pal["ouro"][1])
    for x, y in ((31, 45), (36, 45), (60, 45), (65, 45)):
        c(x, y, pal["ouro"][1])
    # o brilho da espada: o risco do meio da lâmina
    for y in range(9, 33):
        c(66, y, pal["lamina"][1])


def detalhes_hemini(im, pal):
    px = im.load()
    c = lambda x, y, cor: px.__setitem__((x, y), cor + (255,))
    k = pal["pele"][3]
    # olhões decididos e o sorrisão banguela
    for ox in (43, 51):
        c(ox, 46, k); c(ox + 1, 46, k); c(ox + 2, 46, k)
        for x in range(ox, ox + 3):
            for y in (47, 48, 49):
                c(x, y, (255, 255, 255))
        c(ox + 1, 48, (40, 70, 150)); c(ox + 2, 48, k); c(ox + 1, 49, k); c(ox + 2, 49, k)
    for x in (46, 47, 49, 50):
        c(x, 52, k)
    c(48, 52, (255, 255, 255)); c(46, 51, k); c(50, 51, k)
    # o curativo na bochecha (já briga muito) e as bochechas
    for x, y in ((54, 51), (55, 51), (56, 51), (54, 52), (56, 52)):
        c(x, y, (250, 236, 210))
    c(55, 52, (220, 150, 150))
    c(41, 51, (240, 150, 130)); c(42, 51, (240, 150, 130))
    # o amassado e o brilho da panela
    c(42, 36, pal["aco"][1]); c(43, 36, pal["aco"][1]); c(52, 38, pal["aco"][2]); c(53, 39, pal["aco"][2])
    for y in range(33, 45):
        c(65, y, pal["lamina"][1])


def gera(desenho, detalhes, pal):
    im = acabamento(desenho(), pal)
    detalhes(im, pal)
    return im


if __name__ == "__main__":
    pasta = os.path.join(ROOT, "assets", "sprites", "pokemon")
    feitos = []
    for dex, desenho, detalhes in ((1134, hemini, detalhes_hemini), (1135, hemon, detalhes_hemon)):
        comum, brilho = gera(desenho, detalhes, NORMAL), gera(desenho, detalhes, SHINY)
        comum.save(os.path.join(pasta, f"{dex}.png"))
        brilho.save(os.path.join(pasta, "shiny", f"{dex}.png"))
        feitos += [comum, brilho]
    prev = Image.new("RGBA", (104 * 4, 96), (52, 56, 66, 255))
    for i, im in enumerate(feitos):
        prev.alpha_composite(im, (i * 104, 0))
    prev.resize((prev.width * 4, prev.height * 4), Image.NEAREST).save(os.environ.get("PREVIA", "/tmp/hemon_prev.png"))
    print("HE-MINI 1134 e HE-MON 1135 -> assets/sprites/pokemon/ (+ shiny)")
