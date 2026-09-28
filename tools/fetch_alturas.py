#!/usr/bin/env python3
"""As ALTURAS dos mapas, pro modo isométrico (src/core/isometrico.js).

Cada tile do FireRed é um número de 16 bits no blockdata do decomp:
metatile (10 bits), colisão (2) e ELEVAÇÃO (4). O fetch_maps.py usa os dois
primeiros e sempre jogou o terceiro fora, porque o jogo em 2D não precisava
dele. O isométrico precisa: é a elevação que diz que o alto do barranco do
Monte Lua é mais alto que a trilha, que a ponte fica por cima do rio.

Este script lê SÓ isso e grava `assets/maps/alturas.json`:
    { "<mapa>": "3333444...", ... }   (um dígito hex por tile, linha a linha)

Não mexe no kanto.json nem nos PNGs, então dá pra rodar sem medo de desfazer
nada do que foi ajustado neles. Os arquivos baixados ficam no mesmo cache do
fetch_maps.py.

    python3 tools/fetch_alturas.py
"""
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from fetch_maps import MAPS, OUT, game_id, layouts  # noqa: E402
from tileset import fetch  # noqa: E402


def main():
    idx = layouts()
    kanto = json.load(open(os.path.join(OUT, "kanto.json")))
    saida, pulados = {}, []
    for folder in MAPS:
        gid = game_id(folder)
        try:
            mapjson = json.loads(fetch(f"data/maps/{folder}/map.json", binary=False))
            lay = idx[mapjson["layout"]]
            w, h = lay["width"], lay["height"]
            blocks = fetch(lay["blockdata_filepath"])
        except Exception as e:                     # mapa que o decomp não tem
            pulados.append(f"{folder} ({e})")
            continue
        g = kanto.get(gid)
        if g and (g["w"], g["h"]) != (w, h):       # desenho e altura têm que casar
            pulados.append(f"{folder} (tamanho {w}x{h} != {g['w']}x{g['h']})")
            continue
        cells = [int.from_bytes(blocks[i * 2:i * 2 + 2], "little") for i in range(w * h)]
        saida[gid] = "".join("%x" % (v >> 12) for v in cells)
        print(f"  {gid}: {w}x{h}")
    with open(os.path.join(OUT, "alturas.json"), "w") as f:
        json.dump(saida, f, separators=(",", ":"))
    print(f"{len(saida)} mapas -> assets/maps/alturas.json")
    for p in pulados:
        print("  pulado:", p)


if __name__ == "__main__":
    main()
