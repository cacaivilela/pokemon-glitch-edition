#!/usr/bin/env python3
"""COELHATRASADO: o coelho branco de CARTOLA AZUL com um RELÓGIO DE BOLSO na mão.

O desenho é feito aqui, peça por peça (orelhas, cartola, cabeça, gravatinha,
corpo, pés, rabo, o braço levantado com o relógio e a corrente), num mapa de
MATERIAIS. Depois cada material ganha o acabamento de sprite de batalha: luz em
cima/esquerda, sombra embaixo/direita e contorno escuro na borda — a mesma luz
de todo sprite do jogo. Os detalhes (olhos, nariz, boca, ponteiros) entram por
último, pixel a pixel.

O SHINY troca a cartola e a gravatinha pra vermelho e o pelo pra creme.

    python3 tools/coelhatrasado/sprite.py
"""
import math
import os

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DEX = 1130
W = H = 96

# cada material: base, luz, sombra, contorno
NORMAL = {
    "pelo":   ((246, 246, 250), (255, 255, 255), (198, 202, 220), (64, 66, 92)),
    "orelha": ((246, 170, 186), (255, 204, 214), (214, 128, 150), (64, 66, 92)),
    "chapeu": ((52, 98, 200), (98, 146, 236), (30, 62, 148), (16, 26, 74)),
    "fita":   ((22, 36, 96), (40, 58, 130), (12, 20, 60), (10, 14, 44)),
    "gravata": ((52, 98, 200), (98, 146, 236), (30, 62, 148), (16, 26, 74)),
    "ouro":   ((232, 184, 48), (255, 228, 120), (168, 120, 24), (100, 62, 8)),
    "mostrador": ((255, 244, 214), (255, 252, 238), (226, 210, 170), (100, 62, 8)),
}
SHINY = dict(NORMAL)
SHINY.update({
    "pelo":   ((255, 240, 212), (255, 250, 236), (226, 204, 168), (92, 70, 52)),
    "chapeu": ((200, 46, 62), (240, 96, 108), (140, 24, 40), (70, 10, 20)),
    "fita":   ((70, 14, 26), (110, 30, 44), (44, 8, 16), (30, 4, 10)),
    "gravata": ((200, 46, 62), (240, 96, 108), (140, 24, 40), (70, 10, 20)),
})


class Tela:
    def __init__(self):
        self.mat = [[None] * W for _ in range(H)]

    def pinta(self, x, y, m):
        if 0 <= x < W and 0 <= y < H:
            self.mat[y][x] = m

    def elipse(self, cx, cy, rx, ry, m, ang=0.0):
        a = math.radians(ang)
        ca, sa = math.cos(a), math.sin(a)
        r = int(max(rx, ry)) + 2
        for y in range(int(cy) - r, int(cy) + r + 1):
            for x in range(int(cx) - r, int(cx) + r + 1):
                dx, dy = x + 0.5 - cx, y + 0.5 - cy
                u, v = dx * ca + dy * sa, -dx * sa + dy * ca
                if (u / rx) ** 2 + (v / ry) ** 2 <= 1:
                    self.pinta(x, y, m)

    def ret(self, x0, y0, x1, y1, m):
        for y in range(y0, y1 + 1):
            for x in range(x0, x1 + 1):
                self.pinta(x, y, m)

    def poligono(self, pts, m):
        ys = [p[1] for p in pts]
        for y in range(int(min(ys)), int(max(ys)) + 1):
            for x in range(W):
                px, py, dentro = x + 0.5, y + 0.5, False
                for i in range(len(pts)):
                    (x1, y1), (x2, y2) = pts[i], pts[i - 1]
                    if (y1 > py) != (y2 > py) and px < (x2 - x1) * (py - y1) / (y2 - y1) + x1:
                        dentro = not dentro
                if dentro:
                    self.pinta(x, y, m)


def desenho():
    t = Tela()
    # as ORELHAS (atrás da cartola), com o miolo rosa
    for cx, ang in ((35, -14), (61, 14)):
        t.elipse(cx, 21, 4.6, 13.5, "pelo", ang)
        t.elipse(cx + (0.6 if ang < 0 else -0.6), 22, 2.1, 10, "orelha", ang)
    # o RABO de algodão, atrás do corpo
    t.elipse(35.5, 69, 4.5, 4.5, "pelo")
    # o CORPO e os PÉS
    t.elipse(48, 64, 11, 13, "pelo")
    t.elipse(42, 79, 6.5, 3.6, "pelo")
    t.elipse(55, 79, 6.5, 3.6, "pelo")
    # o braço que fica pra baixo
    t.elipse(37.5, 62, 3, 7, "pelo", 18)
    # a CABEÇA
    t.elipse(48, 40, 13, 11, "pelo")
    # a CARTOLA AZUL: copa, fita e aba
    t.ret(41, 12, 55, 27, "chapeu")
    t.ret(41, 23, 55, 26, "fita")
    t.ret(37, 27, 59, 30, "chapeu")
    # a GRAVATINHA
    t.poligono([(41, 49), (47, 52), (41, 56)], "gravata")
    t.poligono([(55, 49), (49, 52), (55, 56)], "gravata")
    t.ret(46, 50, 50, 54, "gravata")
    # o braço levantado, segurando o RELÓGIO DE BOLSO
    t.elipse(60.5, 59.5, 3, 7.5, "pelo", -62)
    t.elipse(65.5, 56.5, 3, 3, "pelo")
    t.elipse(70, 55, 6.6, 6.6, "ouro")
    t.elipse(70, 55, 4.4, 4.4, "mostrador")
    t.ret(69, 47, 70, 48, "ouro")                 # o pino de dar corda
    # a CORRENTE, do relógio até a gravatinha (de 2 em 2 pixels)
    for i in range(0, 13, 2):
        k = i / 12
        x = round(64 + (52 - 64) * k)
        y = round(60 + 4 * math.sin(k * math.pi) + (57 - 60) * k)
        t.pinta(x, y, "ouro")
    return t


def acabamento(t, pal):
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    px = im.load()
    M = t.mat
    mesmo = lambda x, y, m: 0 <= x < W and 0 <= y < H and M[y][x] == m
    vazio = lambda x, y: not (0 <= x < W and 0 <= y < H) or M[y][x] is None
    for y in range(H):
        for x in range(W):
            m = M[y][x]
            if m is None:
                continue
            base, luz, sombra, contorno = pal[m]
            viz = ((1, 0), (-1, 0), (0, 1), (0, -1))
            if any(vazio(x + dx, y + dy) for dx, dy in viz):
                cor = contorno                                   # a borda de fora
            elif any(not mesmo(x + dx, y + dy, m) for dx, dy in ((1, 0), (0, 1))) and m not in ("orelha", "fita"):
                cor = contorno if m != "pelo" else sombra        # onde uma peça encosta na de baixo
            elif not mesmo(x - 1, y, m) or not mesmo(x, y - 1, m) or not mesmo(x - 1, y - 1, m):
                cor = luz
            elif not mesmo(x + 2, y, m) or not mesmo(x, y + 2, m):
                cor = sombra
            else:
                cor = base
            px[x, y] = cor + (255,)
    return im


def detalhes(im, pal):
    px = im.load()
    c = lambda x, y, cor: px.__setitem__((x, y), cor + (255,))
    contorno = pal["pelo"][3]
    # os OLHOS vermelhos de coelho: íris, pupila e o brilho
    for ox in (42, 52):
        for y in range(37, 41):
            for x in range(ox, ox + 3):
                c(x, y, (200, 40, 58))
        c(ox + 1, 38, (40, 10, 18)); c(ox + 1, 39, (40, 10, 18)); c(ox + 2, 39, (40, 10, 18))
        c(ox, 37, (255, 255, 255))
        for x in range(ox, ox + 3):
            c(x, 36, contorno)
    # o NARIZ rosa e a boca com os dentões
    for x in (47, 48):
        c(x, 43, (238, 128, 150)); c(x, 44, (214, 96, 122))
    c(47, 45, contorno); c(48, 45, contorno)
    c(46, 46, contorno); c(49, 46, contorno)
    c(47, 46, (255, 255, 255)); c(48, 46, (255, 255, 255))
    c(47, 47, (255, 255, 255)); c(48, 47, (255, 255, 255))
    c(46, 47, contorno); c(49, 47, contorno); c(47, 48, contorno); c(48, 48, contorno)
    # as bochechas
    c(40, 43, (250, 200, 210)); c(41, 43, (250, 200, 210)); c(55, 43, (250, 200, 210)); c(56, 43, (250, 200, 210))
    # os PONTEIROS do relógio (atrasado: quase meio-dia e ele ainda aqui)
    ponteiro = pal["ouro"][3]
    for y in (52, 53, 54):
        c(70, y, ponteiro)
    c(71, 55, ponteiro); c(72, 55, ponteiro)
    c(70, 55, (200, 40, 58))
    # um risquinho de "fala" de pressa: três gotinhas de suor
    for x, y in ((62, 33), (64, 31), (63, 36)):
        c(x, y, (150, 200, 255))


def gera(pal):
    t = desenho()
    im = acabamento(t, pal)
    detalhes(im, pal)
    return im


if __name__ == "__main__":
    comum, brilho = gera(NORMAL), gera(SHINY)
    pasta = os.path.join(ROOT, "assets", "sprites", "pokemon")
    comum.save(os.path.join(pasta, f"{DEX}.png"))
    os.makedirs(os.path.join(pasta, "shiny"), exist_ok=True)
    brilho.save(os.path.join(pasta, "shiny", f"{DEX}.png"))
    prev = Image.new("RGBA", (104 * 2, 96), (52, 56, 66, 255))
    for i, im in enumerate((comum, brilho)):
        prev.alpha_composite(im, (i * 104, 0))
    prev.resize((prev.width * 4, prev.height * 4), Image.NEAREST).save(os.environ.get("PREVIA", "/tmp/coelhatrasado_prev.png"))
    print(f"COELHATRASADO -> assets/sprites/pokemon/{DEX}.png (+ shiny)")
