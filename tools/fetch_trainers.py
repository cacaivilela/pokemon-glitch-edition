#!/usr/bin/env python3
"""Baixa os retratos de batalha dos treinadores do FireRed (decomp
pret/pokefirered) para assets/sprites/trainers/.

    python3 tools/fetch_trainers.py               # líderes de ginásio + papéis usados no jogo
    python3 tools/fetch_trainers.py --list        # todos os retratos disponíveis
    python3 tools/fetch_trainers.py --leaders     # só os oito líderes
    python3 tools/fetch_trainers.py chefe=giovanni  # papel=arquivo extra

O nome do arquivo gerado é o mesmo do sprite de overworld do NPC
(`sprite: "brock"` em src/data/maps.js -> assets/sprites/trainers/brock.png),
então o jogo acha o retrato sozinho. São 64x64, o mesmo tamanho dos Pokémon.

A arte é da Nintendo / Creatures / Game Freak: os arquivos ficam só na sua
máquina e o .gitignore já impede o commit.
"""
import argparse
import json
import os
import sys
import urllib.request
from concurrent.futures import ThreadPoolExecutor

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from png_io import read_png, write_png  # noqa: E402

BASE = "https://raw.githubusercontent.com/pret/pokefirered/master/graphics/trainers/front_pics"
API = "https://api.github.com/repos/pret/pokefirered/contents/graphics/trainers/front_pics"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "assets", "sprites", "trainers")

# papel no jogo (= sprite de overworld do NPC) -> arquivo no decomp
LEADERS = {
    "brock": "leader_brock",
    "misty": "leader_misty",
    "surge": "leader_lt_surge",
    "erika": "leader_erika",
    "koga": "leader_koga",
    "sabrina": "leader_sabrina",
    "blaine": "leader_blaine",
    "giovanni": "leader_giovanni",
}

# os outros treinadores que já andam pelo jogo
ROLES = {
    "cacador": "bug_catcher",
    "garoto": "youngster",
    "garota": "lass",
    "rival": "rival_early",
    "cientista": "scientist",
    "marinheiro": "sailor",
    "pescador": "fisherman",
    "montanhista": "hiker",
    "motoqueiro": "biker",
    "gentleman": "gentleman",
    "rocket": "rocket_grunt_m",
    "rocketf": "rocket_grunt_f",
    "lutador": "tamer",
    "maniaco": "bug_maniac",
}


def listar():
    req = urllib.request.Request(API, headers={"User-Agent": "pokemon-glitch-edition/1.0"})
    with urllib.request.urlopen(req, timeout=30) as r:
        data = json.load(r)
    return sorted(f["name"].replace("_front_pic.png", "") for f in data)


def grab(papel, arquivo, force):
    dest = os.path.join(OUT, papel + ".png")
    if os.path.exists(dest) and not force:
        return "pulado"
    url = f"{BASE}/{arquivo}_front_pic.png"
    tmp = dest + ".tmp"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "pokemon-glitch-edition/1.0"})
        with urllib.request.urlopen(req, timeout=30) as r:
            data = r.read()
        if not data.startswith(b"\x89PNG"):
            return "inválido"
        os.makedirs(OUT, exist_ok=True)
        with open(tmp, "wb") as f:
            f.write(data)
        # normaliza pra RGBA (o decomp usa paleta indexada + tRNS)
        w, h, px = read_png(tmp)
        write_png(dest, w, h, px)
        os.remove(tmp)
        return "ok"
    except Exception as e:
        if os.path.exists(tmp):
            os.remove(tmp)
        return f"{type(e).__name__}"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--list", action="store_true", help="lista os retratos do decomp e sai")
    ap.add_argument("--leaders", action="store_true", help="só os oito líderes de ginásio")
    ap.add_argument("--force", action="store_true")
    ap.add_argument("pairs", nargs="*", help="papel=arquivo extra (ex: chefe=giovanni)")
    a = ap.parse_args()

    if a.list:
        print("\n".join(listar()))
        return 0

    alvos = dict(LEADERS)
    if not a.leaders:
        alvos.update(ROLES)
    for par in a.pairs:
        if "=" not in par:
            print(f"ignorado (use papel=arquivo): {par}")
            continue
        papel, arq = par.split("=", 1)
        alvos[papel] = arq

    tally, faltou = {}, []
    with ThreadPoolExecutor(max_workers=8) as pool:
        res = list(pool.map(lambda kv: (kv[0], grab(kv[0], kv[1], a.force)), alvos.items()))
    for papel, r in res:
        tally[r] = tally.get(r, 0) + 1
        if r not in ("ok", "pulado"):
            faltou.append(f"{papel} ({r})")

    print("  ".join(f"{k}: {v}" for k, v in sorted(tally.items())))
    if faltou:
        print("não baixou:", ", ".join(faltou))
    print(f"destino: {OUT}")
    return 0 if tally.get("ok", 0) or tally.get("pulado", 0) else 1


if __name__ == "__main__":
    sys.exit(main())
