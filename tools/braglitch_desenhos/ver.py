#!/usr/bin/env python3
"""Folha de contato de UM lote, sem gravar nada em assets/.

    python3 tools/braglitch_desenhos/ver.py lote_2 /caminho/folha.png

Cada bicho sai duas vezes, frente e costas, ampliado 4x.
"""
import importlib
import os
import sys

AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(AQUI))
from pixelart import Tela, folha_de_contato  # noqa: E402

lote, destino = sys.argv[1], sys.argv[2]
mod = importlib.import_module(f"braglitch_desenhos.{lote}")
imgs = []
for dex, (fn, nome) in mod.DESENHOS.items():
    imgs.append(fn(Tela()).img)
    imgs.append(fn(Tela(), costas=True).img)
    print(dex, nome)
folha_de_contato(imgs, escala=4, por_linha=4).save(destino)
print("folha:", destino)
