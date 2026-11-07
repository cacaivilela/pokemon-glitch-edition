#!/usr/bin/env python3
"""MAPAS IGUAIS viram um arquivo só (assets/maps/), sem mudar o que aparece.

Os 16 Centros Pokémon do FireRed são o mesmo desenho, as lojas também, e
vários andares do NAVEL ROCK têm a mesma camada de cima: o tools/fetch_maps.py
grava um PNG pra cada mapa mesmo assim. Aqui cada grupo de desenhos IGUAIS
(pixel por pixel; invisível conta como invisível) fica com um arquivo, e os
outros mapas ganham no kanto.json `png` (o chão) / `pngOver` (a camada de
cima) = o id do mapa que tem o arquivo. O jogo acha o arquivo por
src/core/sprites.js `arquivoMapa`.

    python3 tools/compacta_mapas.py          # compacta
    python3 tools/compacta_mapas.py --ver    # só mostra quanto daria

Rode de novo depois do fetch_maps.py (ele grava os arquivos repetidos de volta).
Arquivo de mapa que não está no kanto.json nunca é apagado (nada aponta pra ele).
"""
import json
import os
import sys

from PIL import Image

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MAPAS = os.path.join(RAIZ, "assets", "maps")
KANTO = os.path.join(MAPAS, "kanto.json")


def visivel(caminho):
    im = Image.open(caminho).convert("RGBA")
    return im.size, bytes(b for p in im.getdata() for b in (p if p[3] else (0, 0, 0, 0)))


def main():
    so_ver = "--ver" in sys.argv
    kanto = json.load(open(KANTO, encoding="utf-8"))
    economia = apagados = 0
    for camada, campo, sufixo in (("chão", "png", ".png"), ("cima", "pngOver", "_over.png")):
        grupos = {}
        for nome in sorted(os.listdir(MAPAS)):
            if not nome.endswith(sufixo) or (sufixo == ".png" and nome.endswith("_over.png")):
                continue
            mid = nome[: -len(sufixo)]
            grupos.setdefault(visivel(os.path.join(MAPAS, nome)), []).append(mid)
        for ids in grupos.values():
            if len(ids) < 2:
                continue
            # fica o arquivo de quem não está no kanto.json (ninguém aponta pra
            # ele), senão o de nome mais curto ("center", "mart")
            dono = min(ids, key=lambda i: (i in kanto, len(i), i))
            for mid in ids:
                if mid == dono or mid not in kanto:
                    continue
                caminho = os.path.join(MAPAS, mid + sufixo)
                economia += os.path.getsize(caminho)
                apagados += 1
                print(f"  {camada}: {mid} -> {dono}")
                if not so_ver:
                    kanto[mid][campo] = dono
                    os.remove(caminho)
    if not so_ver:
        with open(KANTO, "w", encoding="utf-8") as f:
            json.dump(kanto, f, ensure_ascii=False, separators=(",", ":"))
    print(f"{apagados} arquivos repetidos, {economia} bytes" + (" (só vendo)" if so_ver else " a menos"))


if __name__ == "__main__":
    main()
