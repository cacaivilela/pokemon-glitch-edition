#!/usr/bin/env python3
"""AS FORMAS DE VÍNCULO (src/data/vinculo.js): grava os sprites.

Cada forma sai do 1º QUADRO DA ANIMAÇÃO da espécie, editado em código em
tools/vinculo_desenhos/ (lote_caio.py, lote_lara.py...):
`DESENHOS = {numero: (funcao, "id")}` com `funcao(costas, shiny)` devolvendo
a Tela editada (ver tools/vinculo_desenhos/quadro.py). Também servem desenhos
do zero no formato dos fósseis puros, `funcao(t, costas)` numa Tela 64x64.

O SHINY: o desenho que aceita `shiny=True` pinta a si mesmo com as cores
shiny (é o jeito bom). Sem isso, sai da troca de cor da espécie de verdade:
cada cor do desenho parecida com uma do sprite comum vira a shiny dela.

Forma ainda sem desenho grava o sprite oficial da espécie, sem nada, pra não
ficar buraco no jogo.

O número é 24000 + 100 x treinador (0 CAIO, 1 LARA, 2 VERMELHO, 3 FOLHA) +
a posição na lista dele — a conta de `spriteVinculo` em src/data/vinculo.js.

    python3 tools/vinculo_sprites.py
"""
import importlib.util
import inspect
import os
import sys
from collections import Counter

from PIL import Image

AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, AQUI)
from pixelart import Tela  # noqa: E402,F401
sys.path.insert(0, os.path.join(AQUI, "vinculo_desenhos"))
import quadro  # noqa: E402

RAIZ = os.path.dirname(AQUI)
SPR = os.path.join(RAIZ, "assets", "sprites", "pokemon")
DESENHOS = os.path.join(AQUI, "vinculo_desenhos")

# a mesma ordem de src/data/vinculo.js (VINCULO.especies), com o nº da Pokédex
LISTAS = {
    "caio": [("blastoise", 9), ("feraligatr", 160), ("swampert", 260), ("empoleon", 395),
             ("samurott", 503), ("greninja", 658), ("rillaboom", 812), ("inteleon", 818),
             ("quaquaval", 914), ("raichu", 26), ("tilapiracu", 1038)],
    "lara": [("lopunny", 428), ("clefable", 36), ("wigglytuff", 40), ("togekiss", 468),
             ("sylveon", 700), ("azumarill", 184), ("alcremie", 869), ("whimsicott", 547),
             ("cinccino", 573), ("ribombee", 743)],
    "red": [("venomoth", 49), ("ninetales", 38), ("beedrill", 15), ("primeape", 57),
            ("pinsir", 127), ("hypno", 97), ("marowak", 105), ("weezing", 110),
            ("tentacruel", 73), ("electabuzz", 125)],
    "leaf": [("mew", 151), ("machamp", 68), ("exeggutor", 103), ("farfetchd", 83),
             ("butterfree", 12), ("nidoqueen", 31), ("muk", 89), ("moltres", 146),
             ("lapras", 131), ("kingler", 99)],
}
ORDEM = ["caio", "lara", "red", "leaf"]


def numero(treinador, i):
    return 24000 + 100 * ORDEM.index(treinador) + i


def desenhos():
    out = {}
    for nome in sorted(os.listdir(DESENHOS)):
        if not (nome.startswith("lote_") and nome.endswith(".py")):
            continue
        spec = importlib.util.spec_from_file_location("vd_" + nome[:-3], os.path.join(DESENHOS, nome))
        mod = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(mod)
        out.update(getattr(mod, "DESENHOS", {}))
    return out


def caminho(n, costas=False, shiny=False):
    pasta = os.path.join(SPR, *(["shiny"] if shiny else []), *(["back"] if costas else []))
    return os.path.join(pasta, f"{n:03d}.png")


def troca_shiny(dex, costas):
    """cor comum -> cor shiny da espécie, comparando os dois sprites oficiais"""
    a, b = caminho(dex, costas), caminho(dex, costas, True)
    if not (os.path.exists(a) and os.path.exists(b)):
        return {}
    ia, ib = Image.open(a).convert("RGBA"), Image.open(b).convert("RGBA")
    if ia.size != ib.size:
        return {}
    votos = {}
    for pa, pb in zip(ia.getdata(), ib.getdata()):
        if pa[3] > 128 and pb[3] > 128:
            votos.setdefault(pa[:3], Counter())[pb[:3]] += 1
    return {c: v.most_common(1)[0][0] for c, v in votos.items() if sum(v.values()) >= 4}


def shiny(im, mapa):
    """cada cor do desenho perto de uma cor comum da espécie vira a shiny dela,
    mantendo a diferença de luz que o desenho tinha"""
    if not mapa:
        return im.copy()
    cores = list(mapa)
    out = im.copy()
    px = out.load()
    cache = {}
    for y in range(out.height):
        for x in range(out.width):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            if (r, g, b) not in cache:
                c = min(cores, key=lambda k: (k[0] - r) ** 2 + (k[1] - g) ** 2 + (k[2] - b) ** 2)
                dist = ((c[0] - r) ** 2 + (c[1] - g) ** 2 + (c[2] - b) ** 2) ** 0.5
                if dist > 48:
                    cache[(r, g, b)] = (r, g, b)
                else:
                    s = mapa[c]
                    cache[(r, g, b)] = tuple(max(0, min(255, s[k] + (r, g, b)[k] - c[k])) for k in range(3))
            px[x, y] = cache[(r, g, b)] + (a,)
    return out


def main():
    todos = desenhos()
    feitos, oficiais = 0, 0
    for treinador, lista in LISTAS.items():
        for i, (especie, dex) in enumerate(lista):
            n = numero(treinador, i)
            for costas in (False, True):
                if n in todos:
                    f = todos[n][0]
                    im = quadro.render(f, costas)
                    if "shiny" in inspect.signature(f).parameters:
                        sh = quadro.render(f, costas, shiny=True)
                    else:
                        sh = shiny(im, troca_shiny(dex, costas))
                else:
                    im = Image.open(caminho(dex, costas)).convert("RGBA")
                    p = caminho(dex, costas, True)
                    sh = Image.open(p).convert("RGBA") if os.path.exists(p) else im
                for img, eh_shiny in ((im, False), (sh, True)):
                    destino = caminho(n, costas, eh_shiny)
                    os.makedirs(os.path.dirname(destino), exist_ok=True)
                    img.save(destino, optimize=True)
            if n in todos:
                feitos += 1
            else:
                oficiais += 1
    print(f"{feitos} desenhos novos; {oficiais} ainda com o sprite oficial")


if __name__ == "__main__":
    main()
