#!/usr/bin/env python3
"""Compacta as FOLHAS DE ANIMAÇÃO (assets/sprites/pokemon/anim/), sem mudar o
que aparece na tela.

Os GIFs do B/W e do Showdown repetem muito quadro: o bicho fica parado alguns
quadros seguidos, e cada repetição vira mais um quadro na folha. Aqui cada
sequência de quadros IGUAIS vira um quadro só, com a soma dos tempos — a
animação toca exatamente igual, a folha encolhe. Depois, rode
tools/compacta.py na pasta (PNG de paleta).

    python3 tools/compacta_anim.py           # tudo
    python3 tools/compacta_anim.py --ver     # só mostra quanto daria
"""
import json
import os
import sys

from PIL import Image

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ANIM = os.path.join(RAIZ, "assets", "sprites", "pokemon", "anim")
INDICE = os.path.join(ANIM, "quadros.json")
COLUNAS = 16


def expandir(tempos):
    """[[ms, n], ...] (o jeito compacto) -> [ms, ms, ...]"""
    return [ms for ms, n in tempos for _ in range(n)] if tempos and isinstance(tempos[0], list) else tempos


def em_blocos(tempos):
    """[100, 100, 100, 200] -> [[100, 3], [200, 1]]: o índice fica pequeno (o
    jogo lê os dois jeitos, src/core/sprites.js `fatiar`)"""
    out = []
    for ms in tempos:
        if out and out[-1][0] == ms:
            out[-1][1] += 1
        else:
            out.append([ms, 1])
    return out


def juntar(caminho, entrada, so_ver):
    w, h, col, tempos = entrada
    tempos = expandir(tempos)
    folha = Image.open(caminho).convert("RGBA")
    quadros = [folha.crop(((i % col) * w, (i // col) * h, (i % col) * w + w, (i // col) * h + h)) for i in range(len(tempos))]
    novos, ms = [], []
    for q, t in zip(quadros, tempos):
        if novos and q.tobytes() == novos[-1].tobytes():
            ms[-1] += t
        else:
            novos.append(q)
            ms.append(t)
    if len(novos) == len(quadros):
        return entrada, 0
    if not so_ver:
        c = min(COLUNAS, len(novos))
        out = Image.new("RGBA", (w * c, h * ((len(novos) + c - 1) // c)), (0, 0, 0, 0))
        for i, q in enumerate(novos):
            out.paste(q, ((i % c) * w, (i // c) * h))
        out.save(caminho, optimize=True)
        return [w, h, c, ms], len(quadros) - len(novos)
    return entrada, len(quadros) - len(novos)


def main():
    so_ver = "--ver" in sys.argv
    with open(INDICE, encoding="utf-8") as f:
        indice = json.load(f)
    tirados = 0
    # --so-json: só reescreve o índice em blocos, sem abrir nenhuma folha
    for chave, e in ([] if "--so-json" in sys.argv else indice.items()):
        for lado, pasta in (("f", ANIM), ("c", os.path.join(ANIM, "back"))):
            if not isinstance(e.get(lado), list):
                continue
            caminho = os.path.join(pasta, chave + ".png")
            if not os.path.exists(caminho):
                continue
            e[lado], n = juntar(caminho, e[lado], so_ver)
            tirados += n
    if not so_ver:
        for e in indice.values():
            for lado in ("f", "c"):
                if isinstance(e.get(lado), list):
                    e[lado][3] = em_blocos(expandir(e[lado][3]))
        with open(INDICE, "w", encoding="utf-8") as f:
            json.dump(indice, f, separators=(",", ":"), sort_keys=True)
    print(f"{tirados} quadros repetidos {'dariam pra tirar' if so_ver else 'tirados'}")


if __name__ == "__main__":
    main()
