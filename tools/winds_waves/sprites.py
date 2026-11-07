#!/usr/bin/env python3
"""OS INICIAIS DE WINDS AND WAVES (src/data/winds-waves.js): BROWT (1112),
POMBON (1113) e GECQUA (1114), desenhados pixel por pixel olhando a ARTE
OFICIAL do anúncio (fev/2026) — ainda não existe sprite oficial.

A primeira versão foi feita só pela descrição dos sites e saiu errada (o CAIO:
"tá feio que só"): BROWT marrom, GECQUA de sapo. Esta copia as imagens:

  BROWT  bolinha AMARELO-LIMÃO, as duas FOLHAS verdes em V por cima dos
         olhos (cara de bravo), o BICO VERDE em triângulo com a boca rosa
         aberta, olhões redondos de íris cinza, topetinho de pena, asinhas
         curtas, a barriga escura embaixo e as perninhas pretas finas.
  POMBON uma BOLA DE PELO dourado espetado, orelhinha pontuda, o coque em
         cima da cabeça, olhinho preto, nariz vermelho, boca aberta com um
         dente e a LÍNGUA pra fora, o peito rosa com as pontas vermelhas.
  GECQUA lagartixa azul baixinha de CABEÇA LARGA e achatada, os olhos com a
         PÁLPEBRA azul-clara meio fechada e a íris rosa, a GOTA azul-clara no
         alto da cabeça, dedos e ponta do rabo azul-claros.

As grades estão em tools/winds_waves/grades.py (uma letra por pixel); aqui
ficam a paleta e o acabamento (o contorno de fora refeito). COSTAS: a mesma
grade espelhada e sem a cara. Sem shiny: eles têm SHINY LOCK.
    python3 tools/winds_waves/sprites.py
"""
import os
import sys
from PIL import Image

AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(os.path.dirname(AQUI), "portal_secretos"))
from comum import ROOT  # noqa: E402


# ====================================================== AS GRADES NOVAS
# (nov/2026) o contorno e as cores vieram da ARTE OFICIAL, reduzida pro tamanho
# de sprite e acertada pixel por pixel em tools/winds_waves/grades.py. (Os
# rascunhos feitos no olho, que ficaram feios, saíram daqui.)
import grades as G  # noqa: E402

PALETAS = {
    1112: {"k": (52, 48, 26), "L": (248, 250, 176), "b": (228, 234, 122), "D": (192, 198, 82), "h": (156, 222, 96),
           "g": (104, 190, 60), "G": (58, 138, 40), "w": (252, 252, 252), "i": (96, 98, 110), "e": (30, 28, 26),
           "m": (214, 92, 104)},
    1113: {"k": (112, 56, 12), "L": (255, 216, 116), "o": (248, 176, 52), "D": (222, 132, 30), "d": (182, 92, 22),
           "r": (222, 62, 52), "t": (242, 122, 142), "e": (40, 26, 20), "w": (252, 246, 236), "c": (255, 236, 192)},
    1114: {"k": (14, 34, 92), "L": (96, 174, 252), "b": (36, 126, 234), "D": (20, 82, 182), "c": (124, 232, 246),
           "C": (206, 250, 255), "p": (212, 62, 172), "e": (22, 22, 52), "w": (252, 252, 255)},
}
# de costas a cara some: cada letra da cara vira a cor do corpo ali
SEM_CARA = {
    1112: {"w": "b", "i": "b", "e": "b", "m": "b", "g": "b", "G": "D", "h": "b", "k": "b"},
    1113: {"w": "o", "e": "o", "r": "o", "t": "o"},
    1114: {"w": "c", "e": "c", "p": "c"},
}
GRADE = {1112: G.BROWT, 1113: G.POMBON, 1114: G.GECQUA}
# até que linha a cara vai (embaixo disso a troca não mexe: as perninhas pretas do BROWT)
CARA_ATE = {1112: 40, 1113: 99, 1114: 99}


def desenha(grade, pal, sem_cara=None, chao=True, cara_ate=99):
    """a grade -> imagem 96x96, no chão e no meio. O contorno de fora é refeito
    (o da grade foi tirado da foto e fica torto depois de mexer)."""
    linhas_ = [list(l) for l in grade]
    if sem_cara:
        linhas_ = [[sem_cara.get(c, c) if y < cara_ate else c for c in l][::-1] for y, l in enumerate(linhas_)]
    h, w = len(linhas_), len(linhas_[0])
    # tira o contorno de fora: todo k encostado no vazio, até não sobrar
    mudou = True
    while mudou:
        mudou = False
        for y in range(h):
            for x in range(w):
                if linhas_[y][x] != "k":
                    continue
                viz = [linhas_[y + b][x + a] if 0 <= y + b < h and 0 <= x + a < w else "."
                       for a, b in ((1, 0), (-1, 0), (0, 1), (0, -1))]
                if "." in viz:
                    linhas_[y][x] = "."
                    mudou = True
    im = Image.new("RGBA", (96, 96), (0, 0, 0, 0))
    p = im.load()
    ys = [y for y in range(h) if any(c != "." for c in linhas_[y])]
    xs = [x for x in range(w) if any(linhas_[y][x] != "." for y in range(h))]
    ox = 48 - (min(xs) + max(xs) + 1) // 2
    oy = 90 - max(ys)
    if chao:
        meio, larg = 48, (max(xs) - min(xs)) / 2 * 0.75
        for x in range(96):
            for y in range(89, 93):
                if ((x - meio) / max(1, larg)) ** 2 + ((y - 91) / 2) ** 2 <= 1:
                    p[x, y] = (0, 0, 0, 60)
    cheio = set()
    for y in range(h):
        for x in range(w):
            c = linhas_[y][x]
            if c != "." and 0 <= x + ox < 96 and 0 <= y + oy < 96:
                p[x + ox, y + oy] = pal[c] + (255,)
                cheio.add((x + ox, y + oy))
    for (x, y) in list(cheio):
        for a, b in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            q = (x + a, y + b)
            if q not in cheio and 0 <= q[0] < 96 and 0 <= q[1] < 96:
                p[q] = pal["k"] + (255,)
    return im


if __name__ == "__main__":
    folha = Image.new("RGBA", (96 * 2, 96 * 3), (236, 240, 244, 255))
    for i, dex in enumerate((1112, 1113, 1114)):
        lados = [(desenha(GRADE[dex], PALETAS[dex]), ""),
                 (desenha(GRADE[dex], PALETAS[dex], SEM_CARA[dex], chao=False, cara_ate=CARA_ATE[dex]), "back")]
        for j, (im, pasta) in enumerate(lados):
            im.save(os.path.join(ROOT, "assets", "sprites", "pokemon", pasta, f"{dex}.png"))
            folha.alpha_composite(im, (96 * j, 96 * i))
    caminho = os.path.join(ROOT, "dev", "captures", "winds_waves.png")
    folha.resize((folha.width * 3, folha.height * 3), Image.NEAREST).save(caminho)
    print(caminho)
