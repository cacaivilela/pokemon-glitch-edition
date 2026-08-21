#!/usr/bin/env python3
"""Baixa os sprites de personagem do FireRed (decomp pret/pokefirered) e converte
pro formato que o jogo espera: folha de 4 colunas x 3 linhas.

    python3 tools/fetch_overworld.py              # papéis usados no jogo
    python3 tools/fetch_overworld.py --leaders    # só os oito líderes de ginásio
    python3 tools/fetch_overworld.py --list       # todos os sprites disponíveis
    python3 tools/fetch_overworld.py policial=policeman pescador=fisher

Layout do original (tira horizontal de quadros de 16px de largura):
    0 baixo  1 cima  2 esquerda  3-4 passos baixo  5-6 passos cima  7-8 passos esquerda
Layout gerado (o do jogo):
    linha 0 = baixo, linha 1 = cima, linha 2 = esquerda   (direita = espelho)
    colunas = parado, passo A, parado, passo B

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

BASE = "https://raw.githubusercontent.com/pret/pokefirered/master/graphics/object_events/pics/people"
API = "https://api.github.com/repos/pret/pokefirered/contents/graphics/object_events/pics/people"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "assets", "sprites", "overworld")
TMP = os.path.join(ROOT, "assets", "sprites", ".cache")

# papel no jogo -> arquivo no decomp
ROLES = {
    "hero": "red_normal",
    "heroina": "green_normal",
    "rival": "blue",
    "prof": "prof_oak",
    "mae": "mom",
    "enfermeira": "nurse",
    "balconista": "clerk",
    "garoto": "youngster",
    "garota": "lass",
    "velho": "old_man_1",
    "velha": "old_woman",
    "menino": "little_boy",
    "menina": "little_girl",
    "gentleman": "gentleman",
    "cacador": "bug_catcher",
    "policial": "policeman",
    "pescador": "fisher",
    "cientista": "scientist",
    "motoqueiro": "biker",
    "marinheiro": "sailor",
    "montanhista": "hiker",
    "rocket": "rocket_m",
    "rocketf": "rocket_f",
    "lutador": "black_belt",
    "superm": "cooltrainer_m",
    "superf": "cooltrainer_f",
    "tecnico": "worker_m",
    "tecnica": "worker_f",
    "canalizadora": "channeler",
    "maniaco": "poke_maniac",
    "roqueiro": "rocker",
}

# os oito lideres de ginasio (mesma divisao de tools/fetch_trainers.py)
LIDERES = {
    "brock": "brock",
    "misty": "misty",
    "surge": "lt_surge",
    "erika": "erika",
    "koga": "koga",
    "sabrina": "sabrina",
    "blaine": "blaine",
    "giovanni": "giovanni",
}

# (linha, coluna) -> índice do quadro no original; -1 = repete o parado da linha
SHEET = [
    [0, 3, 0, 4],   # baixo
    [1, 5, 1, 6],   # cima
    [2, 7, 2, 8],   # esquerda
]


def download(name, force=False):
    os.makedirs(TMP, exist_ok=True)
    dest = os.path.join(TMP, f"{name}.png")
    if force or not os.path.exists(dest):
        req = urllib.request.Request(f"{BASE}/{name}.png", headers={"User-Agent": "pge/1.0"})
        with urllib.request.urlopen(req, timeout=30) as r:
            data = r.read()
        with open(dest, "wb") as f:
            f.write(data)
    return dest


def convert(role, name, force=False):
    try:
        src = download(name, force)
    except Exception as e:
        return f"{role}: falhou ({type(e).__name__})"
    w, h, px = read_png(src)
    fw, fh = 16, h
    n = w // fw
    out = bytearray(fw * 4 * fh * 3 * 4)
    ow = fw * 4
    for r, row in enumerate(SHEET):
        for c, idx in enumerate(row):
            if idx >= n:
                idx = row[0] if row[0] < n else 0
            for y in range(fh):
                s = ((y) * w + idx * fw) * 4
                d = ((r * fh + y) * ow + c * fw) * 4
                out[d:d + fw * 4] = px[s:s + fw * 4]
    os.makedirs(OUT, exist_ok=True)
    write_png(os.path.join(OUT, f"{role}.png"), ow, fh * 3, out)
    return f"{role}: ok ({name}, {fw}x{fh})"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--list", action="store_true", help="lista os sprites do decomp")
    ap.add_argument("--leaders", action="store_true", help="só os oito líderes de ginásio")
    ap.add_argument("--force", action="store_true", help="rebaixa mesmo se já estiver em cache")
    ap.add_argument("pairs", nargs="*", help="papel=arquivo extra (ex: chefe=giovanni)")
    a = ap.parse_args()

    if a.list:
        with urllib.request.urlopen(API, timeout=30) as r:
            names = sorted(x["name"][:-4] for x in json.load(r) if x["name"].endswith(".png"))
        print(f"{len(names)} sprites:\n" + ", ".join(names))
        return 0

    roles = dict(LIDERES)
    if not a.leaders:
        roles.update(ROLES)
    for p in a.pairs:
        if "=" in p:
            k, v = p.split("=", 1)
            roles[k] = v

    with ThreadPoolExecutor(max_workers=6) as pool:
        for line in pool.map(lambda kv: convert(kv[0], kv[1], a.force), roles.items()):
            print(" ", line)
    print(f"destino: {OUT}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
