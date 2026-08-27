#!/usr/bin/env python3
"""Baixa os sprites de batalha da geração III (FireRed/LeafGreen) para
assets/sprites/pokemon/. Só stdlib.

    python3 tools/fetch_sprites.py                 # 151 de Kanto, frente + costas
    python3 tools/fetch_sprites.py --mega          # as formas MEGA
    python3 tools/fetch_sprites.py --to 151 --force
    python3 tools/fetch_sprites.py --base https://outro/espelho

Os arquivos ficam só na sua máquina — o .gitignore já impede o commit.
A arte é da Nintendo / Creatures / Game Freak; use num projeto pessoal e não
redistribua junto com o jogo.
"""
import argparse
import os
import sys
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor

ROOT_SPRITES = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions"
DEFAULT_BASE = f"{ROOT_SPRITES}/generation-iii/firered-leafgreen"
EMERALD = f"{ROOT_SPRITES}/generation-iii/emerald"
PLATINUM = f"{ROOT_SPRITES}/generation-iv/platinum"
BLACK_WHITE = f"{ROOT_SPRITES}/generation-v/black-white"
# pós-gen V não tem sprite 2D por geração: cai no sprite padrão da PokeAPI
MODERN = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon"

# espécies de fora de Kanto que aparecem na 011GLITCHDIMENSION110
EXTRA_DEX = [201, 233, 235, 292, 337, 338, 345, 347, 382, 383, 384, 386, 408, 409, 410, 411,
             436, 474, 479, 493, 564, 566, 599, 605, 606, 607, 608, 609, 615, 622, 641,
             642, 645, 649,
             716, 717, 718,
             880, 881, 882, 883,
             # os INICIAIS das outras regiões (src/data/iniciais.js): dá pra
             # escolher qualquer um deles como primeiro Pokémon
             152, 155, 158, 252, 255, 258, 387, 390, 393, 495, 498, 501,
             650, 653, 656, 722, 725, 728, 810, 813, 816, 906, 909, 912]
# formas MEGA (ids de FORMA da PokeAPI, não da Pokédex). Nenhuma delas existia
# na geração III, então elas vêm com a arte moderna mesmo — os arquivos saem
# como 10033.png e são achados pelo campo `spriteDex` de src/data/mega.js.
MEGA_DEX = [10033, 10034, 10035, 10036, 10037, 10038, 10039, 10040,
            10041, 10042, 10043, 10044, 10071, 10073, 10090]
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "assets", "sprites", "pokemon")


def grab(urls, dest, force):
    """Tenta os espelhos na ordem: o primeiro que devolver um PNG vale.
    (nem toda espécie tem sprite de costas na geração em que ela estreou)"""
    if os.path.exists(dest) and not force:
        return "pulado"
    last = "vazio"
    for url in urls if isinstance(urls, (list, tuple)) else [urls]:
        last = grab_one(url, dest)
        if last == "ok":
            return "ok"
    return last


def grab_one(url, dest):
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "pokemon-glitch-edition/1.0"})
        with urllib.request.urlopen(req, timeout=30) as r:
            data = r.read()
        if not data.startswith(b"\x89PNG"):
            return "inválido"
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        with open(dest, "wb") as f:
            f.write(data)
        return "ok"
    except urllib.error.HTTPError as e:
        return f"http {e.code}"
    except Exception as e:  # rede fora do ar, timeout...
        return type(e).__name__


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--base", default=DEFAULT_BASE)
    ap.add_argument("--from", dest="lo", type=int, default=1)
    ap.add_argument("--to", dest="hi", type=int, default=151)
    ap.add_argument("--force", action="store_true")
    ap.add_argument("--no-back", action="store_true")
    ap.add_argument("--extra", action="store_true", help="só as espécies de fora de Kanto")
    ap.add_argument("--mega", action="store_true", help="só as formas MEGA")
    a = ap.parse_args()

    jobs = []
    dexes = MEGA_DEX if a.mega else EXTRA_DEX if a.extra else range(a.lo, a.hi + 1)
    for dex in dexes:
        bases = [a.base]
        if a.mega:
            bases = [MODERN]
        elif a.extra:
            # da geração de estreia pra frente, até achar (as antigas não têm
            # sprite de costas em Esmeralda, por exemplo)
            bases = [b for b, hi in ((EMERALD, 386), (PLATINUM, 493), (BLACK_WHITE, 649))
                     if dex <= hi] + [MODERN]
        jobs.append(([f"{b}/{dex}.png" for b in bases], os.path.join(OUT, f"{dex:03d}.png")))
        if not a.no_back:
            jobs.append(([f"{b}/back/{dex}.png" for b in bases],
                         os.path.join(OUT, "back", f"{dex:03d}.png")))

    tally = {}
    with ThreadPoolExecutor(max_workers=8) as pool:
        for res in pool.map(lambda j: grab(j[0], j[1], a.force), jobs):
            tally[res] = tally.get(res, 0) + 1

    print("  ".join(f"{k}: {v}" for k, v in sorted(tally.items())))
    print(f"destino: {OUT}")
    return 0 if tally.get("ok", 0) or tally.get("pulado", 0) else 1


if __name__ == "__main__":
    sys.exit(main())
