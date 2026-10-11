#!/usr/bin/env python3
"""OS FÓSSEIS PUROS, desenhados em código (src/data/fosseis-puros.js).

Cada lote em tools/fosseis_puros/ exporta `DESENHOS = {numero: (funcao, "id")}`,
com `funcao(t, costas=False) -> t` numa Tela 64x64 de tools/pixelart.py — o
mesmo formato de tools/braglitch_desenhos/. Grava a frente e as costas
(espelhadas, como lá) em assets/sprites/pokemon/<numero>.png e back/.

    python3 tools/fosseis_puros_sprites.py                 # grava tudo
    python3 tools/fosseis_puros_sprites.py --ver saida.png [22001,22002]   # só uma folha pra olhar
"""
import importlib.util
import os
import sys

from PIL import Image

AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, AQUI)
from pixelart import Tela  # noqa: E402

RAIZ = os.path.dirname(AQUI)
FRENTE = os.path.join(RAIZ, "assets", "sprites", "pokemon")
COSTAS = os.path.join(FRENTE, "back")


def lotes():
    pasta = os.path.join(AQUI, "fosseis_puros")
    out = {}
    for nome in sorted(os.listdir(pasta)):
        if not nome.endswith(".py") or nome.startswith("_"):
            continue
        spec = importlib.util.spec_from_file_location("fp_" + nome[:-3], os.path.join(pasta, nome))
        mod = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(mod)
        out.update(getattr(mod, "DESENHOS", {}))
    return out


def par(desenho):
    frente = desenho(Tela()).img
    costas = desenho(Tela(), costas=True).img.transpose(Image.FLIP_LEFT_RIGHT)
    return frente, costas


def main():
    todos = lotes()
    if "--ver" in sys.argv:
        i = sys.argv.index("--ver")
        saida = sys.argv[i + 1]
        so = [int(x) for x in sys.argv[i + 2].split(",")] if len(sys.argv) > i + 2 else sorted(todos)
        k = 4
        folha = Image.new("RGBA", (len(so) * 2 * 64 * k + len(so) * 16, 64 * k), (120, 176, 120, 255))
        x = 0
        for n in so:
            for img in par(todos[n][0]):
                folha.alpha_composite(img.resize((64 * k, 64 * k), Image.NEAREST), (x, 0))
                x += 64 * k
            x += 16
        folha.save(saida)
        print("prévia em", saida)
        return
    os.makedirs(COSTAS, exist_ok=True)
    for n, (desenho, nome) in sorted(todos.items()):
        frente, costas = par(desenho)
        frente.save(os.path.join(FRENTE, f"{n}.png"))
        costas.save(os.path.join(COSTAS, f"{n}.png"))
        print(f"  {nome:16} -> {n}.png")


if __name__ == "__main__":
    main()
