"""EDIÇÃO PIXEL POR PIXEL (PPP).

`mostrar` imprime o quadro como grade de letras (uma letra por cor), pra
enxergar cada pixel. `pintar` põe por cima uma grade escrita à mão, no mesmo
formato: cada letra é uma cor da paleta, `.` deixa o pixel como está e `_`
apaga (vira transparente).
"""
from collections import Counter

LETRAS = "KDNMBbLlWYyTtmopqrsuvwxzACEFGHIJOPQRSUVXZ0123456789"


def paleta_de(t):
    """cor -> letra, as mais usadas primeiro (o preto do contorno é K)"""
    cont = Counter(p[:3] for p in t.img.getdata() if p[3])
    cores = sorted(cont, key=lambda c: (-cont[c]))
    escuro = min(cores, key=lambda c: sum(c))
    cores.remove(escuro)
    pal = {escuro: "K"}
    livres = [c for c in LETRAS if c != "K"]
    for c, letra in zip(cores, livres):
        pal[c] = letra
    return pal


def mostrar(t, caixa=None, pal=None):
    pal = pal or paleta_de(t)
    x0, y0, x1, y1 = caixa or (0, 0, t.lado, t.lado)
    px = t.img.load()
    linhas = ["    " + "".join(str(x // 10 % 10) if x % 10 == 0 else " " for x in range(x0, x1)),
              "    " + "".join(str(x % 10) for x in range(x0, x1))]
    for y in range(y0, y1):
        linhas.append(f"{y:3d} " + "".join(pal.get(px[x, y][:3], "?") if px[x, y][3] else "." for x in range(x0, x1)))
    return "\n".join(linhas), pal


def pintar(t, x0, y0, grade, pal):
    """`grade`: lista de linhas; `pal`: letra -> rgb. `.` mantém, `_` apaga."""
    px = t.img.load()
    for dy, linha in enumerate(grade):
        for dx, ch in enumerate(linha):
            x, y = x0 + dx, y0 + dy
            if ch == "." or not (0 <= x < t.lado and 0 <= y < t.lado):
                continue
            px[x, y] = (0, 0, 0, 0) if ch == "_" else tuple(pal[ch][:3]) + (255,)
