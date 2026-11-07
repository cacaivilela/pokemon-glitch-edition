"""OS PARADOXOS GIGANTES NO MAPA (o CAIO, nov/2026: "ele tá sempre gigante" —
o IRON TREADS, o BRUTE BONNET, o IRON JUGULIS, o SLITHER WING...): o andar do
Mystery Dungeon desenha os Paradoxos enormes (o desenho tem 40 a 92 pixels;
um Pokémon comum tem uns 26). Aqui eles ficam com a METADE do tamanho.

O jeito de encolher sem estragar a pixel art: cada quadradinho 2x2 vira um
pixel. Se tiver 2 ou mais pixels cheios, ele fica cheio, com a cor que mais
aparece (no empate, a mais escura, pra não perder o contorno).

Rodar: python3 tools/encolhe_andar.py [dex ...]   (sem nada: os Paradoxos de
40 pixels ou mais). Grava por cima em assets/sprites/pokemon/andar/ (e voo/),
mexe nos tamanhos do andar.json/voo.json e guarda o original em
assets/sprites/pokemon/andar/grande/.
"""
import json
import os
import shutil
import sys
from collections import Counter
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PASTAS = [(os.path.join(ROOT, "assets/sprites/pokemon/andar"), "andar.json"),
          (os.path.join(ROOT, "assets/sprites/pokemon/andar/voo"), "voo.json")]
# (o GREAT TUSK, 984, fica grande: encolhido ficou "nanico", disse o CAIO)
PARADOXOS = [str(x) for x in list(range(985, 996)) + [1005, 1006, 1009, 1010, 1020, 1021, 1022, 1023]]
LIMITE = 40


def metade(cel):
    W, H = cel.size
    out = Image.new("RGBA", ((W + 1) // 2, (H + 1) // 2), (0, 0, 0, 0))
    p, po = cel.load(), out.load()
    for y in range(0, H, 2):
        for x in range(0, W, 2):
            cs = [p[x + i, y + j] for i in (0, 1) for j in (0, 1) if x + i < W and y + j < H and p[x + i, y + j][3] > 0]
            if len(cs) < 2:
                continue
            cont = Counter(c[:3] for c in cs)
            top = max(cont.values())
            cor = min((c for c, n in cont.items() if n == top), key=lambda c: c[0] * 3 + c[1] * 6 + c[2])
            po[x // 2, y // 2] = cor + (255,)
    return out


def tamanho(im, v):
    b = im.crop((0, 0, v[0], v[1])).getbbox()
    return max(b[2] - b[0], b[3] - b[1]) if b else 0


def encolher(pasta, arq, dex, forcar):
    indice_p = os.path.join(pasta, arq)
    if not os.path.exists(indice_p):
        return
    indice = json.load(open(indice_p, encoding="utf-8"))
    for k in dex:
        v = indice.get(k)
        png = os.path.join(pasta, f"{k}.png")
        if not v or not os.path.exists(png):
            continue
        im = Image.open(png).convert("RGBA")
        if not forcar and tamanho(im, v) < LIMITE:
            continue
        fw, fh, n = v[0], v[1], v[2]
        linhas = im.height // fh
        nw, nh = (fw + 1) // 2, (fh + 1) // 2
        out = Image.new("RGBA", (nw * n, nh * linhas), (0, 0, 0, 0))
        for j in range(linhas):
            for i in range(n):
                out.alpha_composite(metade(im.crop((i * fw, j * fh, (i + 1) * fw, (j + 1) * fh))), (i * nw, j * nh))
        guarda = os.path.join(pasta, "grande")
        os.makedirs(guarda, exist_ok=True)
        if not os.path.exists(os.path.join(guarda, f"{k}.png")):
            shutil.copy(png, os.path.join(guarda, f"{k}.png"))
        out.save(png)
        indice[k] = [nw, nh] + v[2:]
        print(arq, k, f"{fw}x{fh} -> {nw}x{nh}")
    with open(indice_p, "w", encoding="utf-8") as f:
        json.dump(indice, f, separators=(",", ":"), sort_keys=True)


if __name__ == "__main__":
    pedidos = sys.argv[1:]
    for pasta, arq in PASTAS:
        encolher(pasta, arq, pedidos or PARADOXOS, bool(pedidos))
