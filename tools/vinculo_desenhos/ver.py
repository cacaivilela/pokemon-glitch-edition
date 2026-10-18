#!/usr/bin/env python3
"""Folha pra olhar um lote: frente e costas (espelhada) de cada desenho, 5x.

    python3 tools/vinculo_desenhos/ver.py lote_A saida.png
"""
import importlib.util
import inspect
import os
import sys

AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(AQUI))
sys.path.insert(0, AQUI)
from PIL import Image, ImageDraw  # noqa: E402
from pixelart import Tela  # noqa: E402,F401
import quadro  # noqa: E402


def carregar(nome):
    spec = importlib.util.spec_from_file_location("vd_" + nome, os.path.join(AQUI, nome + ".py"))
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod.DESENHOS


def main():
    nome, saida = sys.argv[1], sys.argv[2]
    des = carregar(nome)
    esc, cel = 5, 64 * 5 + 10
    folha = Image.new("RGBA", (cel * 3 + 10, (cel + 14) * len(des)), (200, 220, 200, 255))
    d = ImageDraw.Draw(folha)
    for k, (n, (f, ident)) in enumerate(sorted(des.items())):
        y = k * (cel + 14)
        d.text((4, y + 1), f"{n} {ident}", fill=(0, 0, 0, 255))
        imgs = [quadro.render(f), quadro.render(f, costas=True)]
        if "shiny" in inspect.signature(f).parameters:
            imgs.append(quadro.render(f, shiny=True))
        for j, im in enumerate(imgs):
            folha.alpha_composite(im.resize((320, 320), Image.NEAREST), (j * cel + 5, y + 14))
    folha.save(saida)
    print(saida)


if __name__ == "__main__":
    main()
