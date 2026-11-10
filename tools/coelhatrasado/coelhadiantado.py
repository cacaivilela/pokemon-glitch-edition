#!/usr/bin/env python3
"""COELHADIANTADO (nº 1131): a pré-evolução do COELHATRASADO (ideia do CAIO, nov/2026).
Um coelhinho de cabeção com uma CARTOLA GRANDE DEMAIS pra ele (a aba cai até
quase os olhos e as orelhas escapam por baixo, pros lados) abraçando um RELÓGIO
DE BOLSO MAIOR QUE O CORPO. Ao contrário do COELHATRASADO, o relógio dele anda pra frente:
chega sempre ADIANTADO.

Mesmo jeito e mesmas cores do COELHATRASADO (tools/coelhatrasado/sprite.py):
as peças num mapa de MATERIAIS, o acabamento de luz/sombra/contorno, e os
detalhes pixel a pixel no fim.
    python3 tools/coelhatrasado/coelhadiantado.py
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from sprite import Tela, acabamento, NORMAL, SHINY, ROOT  # noqa: E402
from PIL import Image  # noqa: E402

DEX = 1131


def desenho():
    t = Tela()
    # as ORELHAS escapando por baixo da aba, caídas pros lados
    for cx, ang in ((30, -58), (66, 58)):
        t.elipse(cx, 45, 3.6, 9, "pelo", ang)
        t.elipse(cx + (0.5 if ang < 0 else -0.5), 45, 1.6, 6.5, "orelha", ang)
    # o RABINHO
    t.elipse(37, 74, 3.2, 3.2, "pelo")
    # o CORPO e os PÉS (curtinhos)
    t.elipse(48, 71, 10, 9, "pelo")
    t.elipse(42, 80, 5, 2.8, "pelo")
    t.elipse(54, 80, 5, 2.8, "pelo")
    # a CABEÇA (grande)
    t.elipse(48, 51, 12, 10, "pelo")
    # a CARTOLA GRANDE DEMAIS: copa alta e larga, fita e uma aba enorme
    t.ret(35, 14, 61, 37, "chapeu")
    t.ret(35, 32, 61, 36, "fita")
    t.ret(27, 38, 69, 42, "chapeu")
    # o RELÓGIO GIGANTE abraçado na frente da barriga
    t.elipse(48, 69, 11.5, 11.5, "ouro")
    t.elipse(48, 69, 8.8, 8.8, "mostrador")
    t.ret(46, 55, 50, 57, "ouro")                  # a coroa de dar corda
    t.ret(47, 53, 49, 54, "ouro")
    # os BRACINHOS segurando o relógio pelos lados
    t.elipse(36.5, 67, 2.8, 4, "pelo", 20)
    t.elipse(59.5, 67, 2.8, 4, "pelo", -20)
    return t


def detalhes(im, pal):
    px = im.load()
    c = lambda x, y, cor: px.__setitem__((x, y), cor + (255,))
    contorno = pal["pelo"][3]
    # os OLHÕES vermelhos, logo embaixo da aba (grandes, com dois brilhos)
    for ox in (41, 51):
        for y in range(46, 51):
            for x in range(ox, ox + 4):
                c(x, y, (200, 40, 58))
        for x, y in ((ox + 1, 48), (ox + 2, 48), (ox + 1, 49), (ox + 2, 49), (ox + 2, 50)):
            c(x, y, (40, 10, 18))
        c(ox, 46, (255, 255, 255)); c(ox + 1, 46, (255, 255, 255)); c(ox + 3, 49, (255, 255, 255))
        for x in range(ox, ox + 4):
            c(x, 45, contorno)
    # o narizinho e a boquinha (um dentinho só)
    c(47, 52, (238, 128, 150)); c(48, 52, (238, 128, 150))
    c(47, 53, contorno); c(48, 53, contorno)
    c(46, 54, contorno); c(49, 54, contorno)
    c(47, 54, (255, 255, 255)); c(48, 54, (255, 255, 255))
    c(47, 55, contorno); c(48, 55, contorno)
    # as bochechas rosadas
    for x in (39, 40, 55, 56):
        c(x, 52, (250, 200, 210))
    # o RELÓGIO: os quatro risquinhos das horas e os ponteiros ADIANTADOS
    # (já passou do meio-dia e ele já chegou faz tempo)
    ponteiro = pal["ouro"][3]
    for x, y in ((48, 61), (56, 69), (48, 77), (40, 69)):
        c(x, y, ponteiro)
    for x, y in ((48, 69), (49, 68), (50, 67), (51, 66), (52, 65)):   # o ponteiro grande, pra frente
        c(x, y, ponteiro)
    for x, y in ((49, 70), (50, 70), (51, 71)):                        # o pequeno
        c(x, y, ponteiro)
    c(48, 69, (200, 40, 58))
    # as linhas de pressa do relógio correndo (brilhinhos em volta)
    for x, y in ((63, 58), (65, 60), (33, 58), (31, 60)):
        c(x, y, (255, 228, 120))


def gera(pal):
    t = desenho()
    im = acabamento(t, pal)
    detalhes(im, pal)
    return im


if __name__ == "__main__":
    comum, brilho = gera(NORMAL), gera(SHINY)
    pasta = os.path.join(ROOT, "assets", "sprites", "pokemon")
    comum.save(os.path.join(pasta, f"{DEX}.png"))
    brilho.save(os.path.join(pasta, "shiny", f"{DEX}.png"))
    prev = Image.new("RGBA", (104 * 3, 96), (52, 56, 66, 255))
    evolucao = Image.open(os.path.join(pasta, "1130.png")).convert("RGBA")
    for i, im in enumerate((comum, brilho, evolucao)):
        prev.alpha_composite(im, (i * 104, 0))
    prev.resize((prev.width * 4, prev.height * 4), Image.NEAREST).save(os.environ.get("PREVIA", "/tmp/coelhadiantado_prev.png"))
    print(f"COELHADIANTADO -> assets/sprites/pokemon/{DEX}.png (+ shiny)")
