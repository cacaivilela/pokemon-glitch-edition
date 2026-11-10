#!/usr/bin/env python3
"""Os ÍCONES das PEÇAS e da CAIXA DE FERRAMENTAS das POKÉMÁQUINAS (16x16), pra loja e mochila.
(O desenho da máquina no mapa sai da grade que o jogador montou: src/systems/pokemaquinas.js.)
As funções das máquinas fixas de antes (gerador, forno...) ficaram aqui como referência de estilo.

Cada máquina é montada peça por peça num mapa de MATERIAIS; depois cada
material ganha o acabamento de objeto do FireRed: luz em cima/esquerda, sombra
embaixo/direita e contorno escuro por fora. Os detalhes pequenos (o raio do
gerador, o fogo do forno, o visor...) entram por último, pixel a pixel.

    python3 tools/pokemaquinas/desenhos.py      -> assets/sprites/itens/<peça>.png
"""
import math
import os

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
N = 32

# material: base, luz, sombra, contorno
MAT = {
    "metal":   ((150, 158, 170), (200, 206, 216), (104, 110, 124), (40, 44, 56)),
    "escuro":  ((70, 74, 88), (100, 104, 118), (48, 50, 62), (24, 26, 34)),
    "cobre":   ((206, 120, 60), (240, 170, 100), (150, 78, 36), (70, 34, 14)),
    "tijolo":  ((178, 84, 60), (214, 120, 90), (130, 56, 40), (60, 24, 18)),
    "boca":    ((40, 22, 18), (60, 34, 26), (28, 14, 10), (20, 10, 8)),
    "azul":    ((64, 120, 210), (110, 164, 240), (40, 82, 160), (16, 34, 80)),
    "agua":    ((90, 170, 240), (150, 210, 255), (60, 130, 210), (24, 60, 120)),
    "terra":   ((120, 84, 52), (150, 110, 74), (90, 60, 36), (50, 32, 18)),
    "folha":   ((80, 170, 80), (130, 210, 110), (50, 120, 56), (24, 64, 30)),
    "vidro":   ((180, 230, 240), (230, 252, 255), (140, 196, 214), (60, 100, 120)),
    "branco":  ((236, 236, 240), (255, 255, 255), (196, 198, 210), (70, 72, 90)),
    "amarelo": ((236, 196, 40), (255, 230, 110), (186, 140, 20), (90, 60, 8)),
    "pedra":   ((140, 136, 128), (180, 176, 168), (100, 96, 90), (50, 48, 44)),
    "madeira": ((150, 98, 54), (186, 134, 84), (110, 70, 36), (56, 32, 14)),
    "vermelho": ((210, 52, 56), (246, 104, 100), (150, 30, 40), (70, 12, 18)),
    "rosa":    ((240, 150, 190), (255, 196, 222), (200, 106, 150), (100, 40, 70)),
    "roxo":    ((120, 80, 170), (164, 126, 212), (84, 52, 128), (40, 20, 66)),
}


class Tela:
    def __init__(self, n=N):
        self.n = n
        self.m = [[None] * n for _ in range(n)]
        self.px = {}

    def p(self, x, y, mat):
        if 0 <= x < self.n and 0 <= y < self.n:
            self.m[y][x] = mat

    def ret(self, x0, y0, x1, y1, mat):
        for y in range(y0, y1 + 1):
            for x in range(x0, x1 + 1):
                self.p(x, y, mat)

    def elipse(self, cx, cy, rx, ry, mat):
        for y in range(self.n):
            for x in range(self.n):
                if ((x + 0.5 - cx) / rx) ** 2 + ((y + 0.5 - cy) / ry) ** 2 <= 1:
                    self.p(x, y, mat)

    def poli(self, pts, mat):
        for y in range(self.n):
            for x in range(self.n):
                px, py, dentro = x + 0.5, y + 0.5, False
                for i in range(len(pts)):
                    (x1, y1), (x2, y2) = pts[i], pts[i - 1]
                    if (y1 > py) != (y2 > py) and px < (x2 - x1) * (py - y1) / (y2 - y1) + x1:
                        dentro = not dentro
                if dentro:
                    self.p(x, y, mat)

    def linha(self, x0, y0, x1, y1, mat, grossa=1):
        n = max(abs(x1 - x0), abs(y1 - y0)) * 2 + 1
        for i in range(n + 1):
            x, y = x0 + (x1 - x0) * i / n, y0 + (y1 - y0) * i / n
            for d in range(grossa):
                self.p(round(x) + d, round(y), mat)

    def cor(self, x, y, c):
        """detalhe: uma cor fixa, por cima do acabamento"""
        self.px[(x, y)] = c


def acabamento(t):
    N = t.n
    im = Image.new("RGBA", (N, N), (0, 0, 0, 0))
    o = im.load()
    M = t.m
    vazio = lambda x, y: not (0 <= x < N and 0 <= y < N) or M[y][x] is None
    mesmo = lambda x, y, m: 0 <= x < N and 0 <= y < N and M[y][x] == m
    for y in range(N):
        for x in range(N):
            m = M[y][x]
            if m is None:
                continue
            base, luz, sombra, cont = MAT[m]
            if any(vazio(x + dx, y + dy) for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))):
                c = cont
            elif not mesmo(x + 1, y, m) or not mesmo(x, y + 1, m):
                c = sombra
            elif not mesmo(x - 1, y, m) or not mesmo(x, y - 1, m):
                c = luz
            else:
                c = base
            o[x, y] = c + (255,)
    for (x, y), c in t.px.items():
        if 0 <= x < N and 0 <= y < N:
            o[x, y] = c + (255,)
    return im


def gerador():
    t = Tela()
    t.ret(6, 12, 25, 29, "metal")            # a caixa
    t.ret(9, 5, 12, 12, "cobre"); t.ret(19, 5, 22, 12, "cobre")   # as bobinas
    t.ret(8, 4, 13, 5, "escuro"); t.ret(18, 4, 23, 5, "escuro")
    t.ret(10, 16, 21, 25, "escuro")          # o painel
    for x, y in ((16, 17), (15, 18), (14, 19), (15, 19), (16, 19), (17, 19), (16, 20), (15, 21), (14, 22)):
        t.cor(x, y, (255, 226, 60))          # o raio
    t.cor(12, 27, (90, 220, 90)); t.cor(19, 27, (220, 60, 60))     # as luzinhas
    return t


def forno():
    t = Tela()
    t.elipse(16, 20, 12, 11, "tijolo")       # a cúpula
    t.ret(4, 20, 27, 29, "tijolo")
    t.ret(21, 4, 24, 12, "tijolo")           # a chaminé
    t.elipse(16, 23, 6, 5, "boca"); t.ret(10, 23, 21, 28, "boca")   # a boca
    for x in range(5, 27, 4):                # as linhas dos tijolos
        for y in (14, 18, 22):
            if t.m[y][x] == "tijolo":
                t.cor(x, y, (120, 50, 36))
    for x, y in ((13, 27), (15, 26), (16, 25), (17, 26), (19, 27), (14, 26), (18, 26)):
        t.cor(x, y, (255, 150, 40))          # as brasas
    t.cor(16, 26, (255, 230, 120))
    return t


def bomba():
    t = Tela()
    t.ret(3, 24, 28, 29, "terra")            # a horta
    for x in (7, 13, 19, 25):
        t.ret(x, 20, x + 1, 23, "folha")     # as mudinhas
    t.ret(10, 8, 17, 24, "azul")             # o corpo da bomba
    t.ret(9, 6, 18, 8, "escuro")
    t.linha(17, 9, 26, 5, "metal", 2)        # a manivela
    t.ret(5, 11, 10, 13, "azul")             # a bica
    t.ret(5, 14, 6, 16, "agua")              # a água pingando
    t.ret(12, 12, 15, 16, "agua")            # o visor do tanque
    return t


def estufa():
    t = Tela()
    t.poli([(3, 14), (16, 4), (29, 14), (29, 29), (3, 29)], "vidro")
    for x in (3, 10, 16, 22, 28):            # a armação branca
        t.ret(x, 14 if x not in (16,) else 5, x, 29, "branco")
    t.linha(3, 14, 16, 4, "branco"); t.linha(16, 4, 29, 14, "branco")
    t.ret(3, 21, 29, 21, "branco")
    for cx in (7, 13, 19, 25):               # as plantas lá dentro
        t.elipse(cx, 25, 2.5, 3, "folha")
    t.cor(13, 24, (240, 90, 110)); t.cor(25, 24, (250, 220, 70))
    return t


def britadeira():
    t = Tela()
    t.elipse(9, 26, 7, 4, "pedra"); t.elipse(5, 23, 4, 3, "pedra")   # o monte de pedra
    t.ret(15, 8, 26, 20, "amarelo")          # o motor
    t.ret(14, 6, 27, 8, "escuro")
    t.ret(19, 20, 22, 26, "metal")           # a haste
    t.poli([(18, 26), (23, 26), (20.5, 31)], "escuro")   # a ponta
    t.ret(12, 10, 14, 12, "escuro"); t.ret(27, 10, 29, 12, "escuro")   # os cabos
    t.ret(17, 11, 24, 16, "escuro")
    for x in (18, 20, 22):
        t.cor(x, 13, (255, 230, 110))
    return t


def moinho():
    t = Tela()
    t.poli([(11, 30), (13, 16), (19, 16), (21, 30)], "branco")       # a torre
    t.poli([(10, 17), (16, 10), (22, 17)], "vermelho")               # o telhado
    t.ret(14, 24, 17, 30, "madeira")                                 # a porta
    t.ret(15, 19, 16, 21, "vidro")                                   # a janelinha
    for a in (45, 135, 225, 315):                                    # as pás: haste fina e a vela na ponta
        r = math.radians(a)
        ex, ey = 16 + math.cos(r) * 11, 11 + math.sin(r) * 9
        t.linha(16, 11, round(ex), round(ey), "madeira")
        mx, my = 16 + math.cos(r) * 7.5, 11 + math.sin(r) * 6
        t.elipse(mx, my, 2.2, 2.2, "branco")
    t.ret(15, 10, 17, 12, "escuro")                                  # o eixo
    return t


def cura():
    t = Tela()
    t.elipse(16, 18, 13, 9, "rosa"); t.ret(3, 18, 28, 29, "rosa")    # o corpo
    t.ret(6, 7, 25, 13, "escuro")                                     # o visor
    for x in (8, 14, 20, 26):                                         # as bolas, separadinhas
        t.elipse(x - 0.5, 21, 2, 2, "vermelho")
    t.ret(3, 26, 28, 26, "branco")
    for x in range(8, 24):                                            # a linha do batimento
        y = 10 if x not in (13, 14, 15) else (8 if x == 14 else 12)
        t.cor(x, y, (110, 255, 150))
    return t


def sintonizador():
    t = Tela()
    t.ret(5, 14, 26, 29, "madeira")          # a caixa de madeira
    t.elipse(12, 21, 5, 5, "escuro")         # o alto-falante
    t.ret(19, 17, 24, 20, "branco")          # o dial
    t.elipse(21, 25, 2, 2, "metal"); t.elipse(25, 25, 1.6, 1.6, "metal")   # os botões
    t.linha(20, 14, 24, 3, "metal")          # a antena torta
    t.linha(24, 3, 28, 5, "metal")
    for x, y in ((10, 19), (12, 20), (14, 22), (11, 23), (13, 18)):
        t.cor(x, y, (190, 140, 255))         # o brilho de fantasma no alto-falante
    t.cor(21, 18, (220, 40, 40))             # o ponteiro do dial
    for x, y in ((27, 2), (29, 4), (26, 0)):
        t.cor(x, y, (190, 140, 255))         # a onda saindo da antena
    return t


# ---- OS ÍCONES (16x16) das PEÇAS e da CAIXA DE FERRAMENTAS, pra loja e mochila
def i_engrenagem():
    t = Tela(16)
    t.elipse(8, 8, 6.4, 6.4, "metal")
    for a in range(0, 360, 45):                  # os dentes
        r = math.radians(a)
        t.ret(round(8 + math.cos(r) * 6.5) - 1, round(8 + math.sin(r) * 6.5) - 1, round(8 + math.cos(r) * 6.5), round(8 + math.sin(r) * 6.5), "metal")
    t.elipse(8, 8, 2, 2, "escuro")
    return t


def i_parafuso():
    t = Tela(16)
    t.ret(4, 2, 11, 4, "metal")                  # a cabeça
    t.ret(7, 5, 8, 13, "metal")                  # o corpo
    for y in (6, 8, 10, 12):
        t.cor(9, y, (90, 96, 110))               # a rosca
    t.cor(7, 3, (40, 44, 56)); t.cor(8, 3, (40, 44, 56))
    return t


def i_fio():
    t = Tela(16)
    t.elipse(8, 8, 6, 6, "cobre")
    t.elipse(8, 8, 2.4, 2.4, "escuro")
    for k in range(4):                           # as voltas do rolo
        r = math.radians(k * 90 + 30)
        t.cor(round(8 + math.cos(r) * 4), round(8 + math.sin(r) * 4), (255, 200, 140))
    t.ret(13, 11, 15, 12, "cobre")               # a ponta solta
    return t


def i_motor():
    t = Tela(16)
    t.ret(2, 4, 11, 12, "azul")                  # o corpo
    t.ret(11, 7, 14, 9, "metal")                 # o eixo
    t.ret(4, 2, 9, 3, "escuro")
    for x in (4, 6, 8):
        t.cor(x, 8, (40, 82, 160))               # as aletas
    t.ret(3, 13, 10, 13, "escuro")
    return t


def i_placa():
    t = Tela(16)
    t.poli([(2, 4), (13, 2), (14, 12), (3, 14)], "metal")
    for x, y in ((4, 5), (12, 4), (12, 11), (5, 12)):
        t.cor(x, y, (60, 64, 78))                # os furos
    return t


def i_caixa():
    t = Tela(16)
    t.ret(1, 6, 14, 14, "vermelho")              # a caixa
    t.ret(5, 3, 10, 4, "escuro"); t.ret(5, 4, 5, 6, "escuro"); t.ret(10, 4, 10, 6, "escuro")   # a alça
    t.ret(1, 9, 14, 9, "escuro")                 # a tampa
    t.ret(7, 9, 8, 10, "amarelo")                # o fecho
    return t


ICONES = {"engrenagem": i_engrenagem, "parafuso": i_parafuso, "fio": i_fio, "motor": i_motor,
          "placa-de-metal": i_placa, "caixa-de-ferramentas": i_caixa}

MAQUINAS = {"gerador": gerador, "forno": forno, "bomba": bomba, "estufa": estufa,
            "britadeira": britadeira, "moinho": moinho, "cura": cura, "sintonizador": sintonizador}

if __name__ == "__main__":
    icones = os.path.join(ROOT, "assets", "sprites", "itens")
    for j, (nome, fn) in enumerate(ICONES.items()):
        ic = acabamento(fn())
        ic.save(os.path.join(icones, f"{nome}.png"))
    tira = Image.new("RGBA", (20 * len(ICONES), 16), (120, 200, 120, 255))
    for j, nome in enumerate(ICONES):
        tira.alpha_composite(Image.open(os.path.join(icones, f"{nome}.png")).convert("RGBA"), (j * 20 + 2, 0))
    tira.resize((tira.width * 5, tira.height * 5), Image.NEAREST).save(os.environ.get("PREVIA", "/tmp/pecas_prev.png"))
    print(f"{len(ICONES)} ícones -> assets/sprites/itens/")
