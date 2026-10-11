#!/usr/bin/env python3
"""ARRUMA AS FOLHAS DE ANIMAÇÃO na grade que comprime melhor, sem perder um
pixel (assets/sprites/pokemon/anim/, frente, back/ e u/).

O mesmo quadro em 16 colunas, numa fila só ou numa coluna só dá PNGs de
tamanhos bem diferentes (no teste, a fila só chegou a menos da metade em
folha grande). Aqui cada folha é remontada com várias contagens de colunas,
cada uma passa pelo oxipng, e fica a menor; o `col` do quadros.json muda
junto (o jogo fatia pela grade, src/core/sprites.js `fatiar`). Os quadros, o
tamanho deles e os tempos não mudam — o desenho na tela fica igual.

Precisa do oxipng (https://github.com/shssoichiro/oxipng; binário pronto nas
releases): no PATH, ou em --oxipng CAMINHO.

    python3 tools/compacta_colunas.py [--oxipng CAMINHO] [--pasta DIR] [--ver]

Cada folha nova é conferida quadro a quadro (pixel invisível conta como
invisível, qualquer cor) antes de substituir; se não bater, fica a original.
Largura máxima da folha: LARGURA_MAX (navegador de celular não gosta de
imagem gigante).
"""
import io
import json
import os
import shutil
import subprocess
import sys
import tempfile
from concurrent.futures import ProcessPoolExecutor

from PIL import Image

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ANIM = os.path.join(RAIZ, "assets", "sprites", "pokemon", "anim")
INDICE = os.path.join(ANIM, "quadros.json")
LARGURA_MAX = 8192
COLUNAS = (1, 2, 4, 8, 16, 32, 64, 128)
OXIPNG = None


def contar(tempos):
    return sum(n for _, n in tempos) if tempos and isinstance(tempos[0], list) else len(tempos)


def visivel(q):
    """os bytes RGBA como aparecem: todo invisível vira o mesmo invisível"""
    d = bytearray(q.tobytes())
    for i in range(3, len(d), 4):
        if not d[i]:
            d[i - 3:i] = b"\0\0\0"
    return bytes(d)


def quadros_de(im, w, h, col, n):
    return [im.crop(((i % col) * w, (i // col) * h, (i % col) * w + w, (i // col) * h + h)) for i in range(n)]


def oxi(cru, nivel):
    """roda o oxipng num PNG (bytes) e devolve os bytes menores"""
    with tempfile.TemporaryDirectory() as d:
        p = os.path.join(d, "f.png")
        with open(p, "wb") as f:
            f.write(cru)
        subprocess.run([OXIPNG, "-q", "-t", "1", "-o", nivel, "--strip", "safe", "-a", p], check=True)
        with open(p, "rb") as f:
            return f.read()


def uma(tarefa):
    caminho, (w, h, col, tempos) = tarefa
    with open(caminho, "rb") as f:
        antes = f.read()
    n = contar(tempos)
    im = Image.open(io.BytesIO(antes)).convert("RGBA")
    quadros = quadros_de(im, w, h, col, n)
    certos = [visivel(q) for q in quadros]
    opcoes = sorted({min(c, n) for c in COLUNAS + (n,) if min(c, n) * w <= LARGURA_MAX} or {col})
    melhor = None
    for c in opcoes:
        folha = Image.new("RGBA", (w * c, h * ((n + c - 1) // c)), (0, 0, 0, 0))
        for i, q in enumerate(quadros):
            folha.paste(q, ((i % c) * w, (i // c) * h))
        buf = io.BytesIO()
        folha.save(buf, "PNG", compress_level=1)
        cru = oxi(buf.getvalue(), "2")
        if melhor is None or len(cru) < len(melhor[1]):
            melhor = (c, cru)
    c, cru = melhor
    cru = oxi(cru, "max")
    # folha mais larga que o limite é refeita mesmo que não encolha
    if len(cru) >= len(antes) and w * col <= LARGURA_MAX:
        return caminho, col, len(antes), len(antes), None
    novo = Image.open(io.BytesIO(cru)).convert("RGBA")
    if [visivel(q) for q in quadros_de(novo, w, h, c, n)] != certos:
        return caminho, col, len(antes), len(antes), f"{caminho}: não bateu, ficou a original"
    return caminho, c, len(antes), len(cru), cru


def main():
    global OXIPNG, ANIM, INDICE
    if "--pasta" in sys.argv:          # outra cópia da pasta (pra testar)
        ANIM = sys.argv[sys.argv.index("--pasta") + 1]
        INDICE = os.path.join(ANIM, "quadros.json")
    so_ver = "--ver" in sys.argv
    OXIPNG = sys.argv[sys.argv.index("--oxipng") + 1] if "--oxipng" in sys.argv else shutil.which("oxipng")
    if not OXIPNG:
        sys.exit("precisa do oxipng (no PATH ou em --oxipng CAMINHO)")
    with open(INDICE, encoding="utf-8") as f:
        indice = json.load(f)
    tarefas, onde = [], {}
    for chave, e in indice.items():
        for lado, pasta in (("f", ANIM), ("c", os.path.join(ANIM, "back"))):
            if isinstance(e.get(lado), list):
                caminho = os.path.join(pasta, chave + ".png")
                # --so-largas: só as folhas que passam de LARGURA_MAX
                if os.path.exists(caminho) and ("--so-largas" not in sys.argv or e[lado][0] * e[lado][2] > LARGURA_MAX):
                    tarefas.append((caminho, e[lado]))
                    onde[caminho] = e[lado]
    antes = depois = 0
    with ProcessPoolExecutor() as ex:
        for caminho, c, a, d, cru in ex.map(uma, tarefas, chunksize=4):
            antes += a
            depois += d
            if isinstance(cru, str):
                print("  !!", cru)
            elif cru and not so_ver:
                with open(caminho, "wb") as f:
                    f.write(cru)
                onde[caminho][2] = c
    if not so_ver:
        with open(INDICE, "w", encoding="utf-8") as f:
            json.dump(indice, f, separators=(",", ":"), sort_keys=True)
    print(f"{len(tarefas)} folhas: {antes / 1048576:.1f} MB -> {depois / 1048576:.1f} MB "
          f"({100 - depois * 100 // max(1, antes)}% a menos){' (só vendo)' if so_ver else ''}")


if __name__ == "__main__":
    main()
