"""Peças comuns dos desenhos dos POKÉMON SECRETOS do PORTAL PARADOXO.

O desenho de cada um é feito em camadas de letras (uma letra por pixel, '.' é
vazio), carimbadas uma por cima da outra num quadro de 96x96; depois vem o
acabamento de sempre dos sprites deste jogo: CONTORNO escuro por fora, LUZ
em cima à esquerda e SOMBRA embaixo à direita (o mesmo do MONSTELA,
tools/monstela/sprite.py). O shiny é a mesma grade com outra paleta.
"""
import os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


class Quadro:
    def __init__(self):
        self.px = {}            # (x, y) -> letra

    def por(self, grade, x0, y0):
        for j, linha in enumerate(grade):
            for i, ch in enumerate(linha):
                if ch != ".":
                    self.px[(x0 + i, y0 + j)] = ch

    def imagem(self, pal, contorno="k", luz=None, sombra=None, chao=True):
        """pal: letra -> (r,g,b); luz/sombra: letra -> letra (a versão clara e
        a escura dela), aplicadas na beirada de cima/esquerda e de baixo/direita"""
        luz, sombra = luz or {}, sombra or {}
        cheio = lambda x, y: (x, y) in self.px
        im = Image.new("RGBA", (96, 96), (0, 0, 0, 0))
        p = im.load()
        if chao:
            ys = [y for _, y in self.px]
            xs = [x for x, _ in self.px]
            base, meio, larg = max(ys) + 1, (min(xs) + max(xs)) / 2, (max(xs) - min(xs)) / 2 * 0.8
            for x in range(96):
                for y in range(base - 2, base + 2):
                    if 0 <= y < 96 and ((x - meio) / max(1, larg)) ** 2 + ((y - base) / 2) ** 2 <= 1:
                        p[x, y] = (0, 0, 0, 60)
        for (x, y), ch in self.px.items():
            if not (0 <= x < 96 and 0 <= y < 96):
                continue
            c = ch
            if ch in luz and (not cheio(x, y - 1) or not cheio(x - 1, y)):
                c = luz[ch]
            elif ch in sombra and (not cheio(x, y + 1) or not cheio(x + 1, y) or not cheio(x + 1, y + 1)):
                c = sombra[ch]
            p[x, y] = pal[c] + (255,)
        # o contorno por fora
        borda = set()
        for (x, y) in self.px:
            for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                if not cheio(x + dx, y + dy):
                    borda.add((x + dx, y + dy))
        for (x, y) in borda:
            if 0 <= x < 96 and 0 <= y < 96:
                p[x, y] = pal[contorno] + (255,)
        return im


def salvar(dex, normal, shiny, previa_nome):
    for im, pasta in ((normal, ""), (shiny, "shiny")):
        im.save(os.path.join(ROOT, "assets", "sprites", "pokemon", pasta, f"{dex}.png"))
    prev = Image.new("RGBA", (192, 96), (236, 240, 244, 255))
    prev.alpha_composite(normal, (0, 0)); prev.alpha_composite(shiny, (96, 0))
    prev.resize((192 * 4, 96 * 4), Image.NEAREST).save(os.environ.get("PREVIA", f"/tmp/{previa_nome}.png"))
