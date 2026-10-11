#!/usr/bin/env python3
"""A MESMA COMPACTAÇÃO do tools/compacta.py (PNG de paleta, sem perder um
pixel), só que com o Pillow e em vários processos — pra pasta grande das
animações (assets/sprites/pokemon/anim/, ~2700 folhas), que no png_io puro
levaria quase uma hora.

    python3 tools/compacta_rapido.py assets/sprites/pokemon/anim

Cada arquivo é conferido depois de gravado (o que aparece na tela tem que
ser igual); se não for, o original volta. Mais de 256 cores: fica como está.
"""
import io
import os
import sys
from concurrent.futures import ProcessPoolExecutor

from PIL import Image


def visivel(im):
    """os pixels como aparecem: todo invisível vira o mesmo invisível"""
    return [p if p[3] else (0, 0, 0, 0) for p in im.convert("RGBA").getdata()]


def um(caminho):
    with open(caminho, "rb") as f:
        cru = f.read()
    try:
        im = Image.open(io.BytesIO(cru))
        rgba = im.convert("RGBA")
    except Exception:
        return 0, 0, None
    cores = rgba.getcolors(256)
    if not cores:
        return len(cru), len(cru), None
    # a paleta: cada cor visível uma vez, e um índice só pra "invisível"
    lista = sorted({c if c[3] else (0, 0, 0, 0) for _, c in cores})
    idx = {c: i for i, c in enumerate(lista)}
    p = Image.new("P", rgba.size)
    p.putdata([idx[c if c[3] else (0, 0, 0, 0)] for c in rgba.getdata()])
    p.putpalette([v for c in lista for v in c[:3]])
    bits = 1 if len(lista) <= 2 else 2 if len(lista) <= 4 else 4 if len(lista) <= 16 else 8
    out = io.BytesIO()
    p.save(out, "PNG", optimize=True, bits=bits, transparency=bytes(c[3] for c in lista))
    novo = out.getvalue()
    if len(novo) >= len(cru):
        return len(cru), len(cru), None
    if visivel(Image.open(io.BytesIO(novo))) != visivel(rgba):
        return len(cru), len(cru), f"{caminho}: não bateu, ficou o original"
    with open(caminho, "wb") as f:
        f.write(novo)
    return len(cru), len(novo), None


def main():
    arquivos = []
    for alvo in sys.argv[1:] or ["assets"]:
        if os.path.isfile(alvo):
            arquivos.append(alvo)
            continue
        for base, _, nomes in os.walk(alvo):
            arquivos += [os.path.join(base, n) for n in nomes if n.endswith(".png")]
    antes = depois = 0
    with ProcessPoolExecutor() as ex:
        for a, d, aviso in ex.map(um, arquivos, chunksize=16):
            antes += a
            depois += d
            if aviso:
                print("  !!", aviso)
    print(f"{len(arquivos)} PNG: {antes / 1048576:.1f} MB -> {depois / 1048576:.1f} MB "
          f"({100 - depois * 100 // max(1, antes)}% a menos)")


if __name__ == "__main__":
    main()
