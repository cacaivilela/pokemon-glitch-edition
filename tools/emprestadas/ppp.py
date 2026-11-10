"""Ajuda pra editar PIXEL POR PIXEL: imprime um pedaço do sprite como texto
(uma letra por pixel, '.' = vazio) e cola de volta um pedaço escrito à mão.
    python3 tools/emprestadas/ppp.py <png> [x0 y0 x1 y1]   (mostra a grade)
"""
import sys
from PIL import Image

LETRAS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"


def paleta(im):
    cores = {}
    for p in im.getdata():
        if p[3] and p[:3] not in cores:
            cores[p[:3]] = None
    return {LETRAS[i]: c for i, c in enumerate(sorted(cores))}


def mostra(im, caixa=None, pal=None):
    pal = pal or paleta(im)
    inv = {c: k for k, c in pal.items()}
    x0, y0, x1, y1 = caixa or im.getbbox()
    px = im.load()
    linhas = ["    " + "".join(str(x % 10) for x in range(x0, x1))]
    for y in range(y0, y1):
        linhas.append(f"{y:3d} " + "".join("." if px[x, y][3] == 0 else inv.get(px[x, y][:3], "?") for x in range(x0, x1)))
    return "\n".join(linhas), pal


def cola(im, x0, y0, texto, pal, vazio="_"):
    """cola o pedaço: '.' não mexe, '_' apaga (vira transparente)"""
    px = im.load()
    for j, linha in enumerate(texto.strip("\n").split("\n")):
        for i, ch in enumerate(linha):
            if ch == ".":
                continue
            x, y = x0 + i, y0 + j
            if not (0 <= x < im.width and 0 <= y < im.height):
                continue
            px[x, y] = (0, 0, 0, 0) if ch == vazio else pal[ch] + (255,)


if __name__ == "__main__":
    im = Image.open(sys.argv[1]).convert("RGBA")
    caixa = tuple(map(int, sys.argv[2:6])) if len(sys.argv) >= 6 else None
    t, pal = mostra(im, caixa)
    print(t)
    print({k: v for k, v in pal.items()})
