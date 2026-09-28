"""Os desenhos dos Pokémon novos de BRAGLITCH, em lotes (lote_1.py, lote_2.py...).

Cada lote exporta `DESENHOS = {dex: (funcao, "id")}`, e cada função tem a forma
`desenho(t, costas=False) -> t`, desenhando numa `Tela` de tools/pixelart.py.
tools/braglitch_sprites.py junta todos os lotes e grava os PNGs.
"""
import importlib
import os
import pkgutil


def todos():
    out = {}
    pasta = os.path.dirname(os.path.abspath(__file__))
    for m in sorted(pkgutil.iter_modules([pasta]), key=lambda m: m.name):
        if not m.name.startswith("lote_"):
            continue
        mod = importlib.import_module(f"braglitch_desenhos.{m.name}")
        out.update(getattr(mod, "DESENHOS", {}))
    return out


def shinies():
    """Os SHINY desenhados à mão: `SHINIES = {dex: funcao}` em cada lote."""
    out = {}
    pasta = os.path.dirname(os.path.abspath(__file__))
    for m in sorted(pkgutil.iter_modules([pasta]), key=lambda m: m.name):
        if not m.name.startswith("lote_"):
            continue
        mod = importlib.import_module(f"braglitch_desenhos.{m.name}")
        out.update(getattr(mod, "SHINIES", {}))
    return out
