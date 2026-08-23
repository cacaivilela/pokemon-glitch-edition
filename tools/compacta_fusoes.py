#!/usr/bin/env python3
"""Compacta os desenhos das fusoes (assets/fusoes/*.png).

Um desenho de 64x64 feito na oficina usa pouquissimas cores — o pincel escolhe
de uma paleta de dezesseis — mas sai do navegador como PNG de cor verdadeira:
quatro bytes por pixel antes de comprimir. Reescrevendo o mesmo desenho como
PNG de PALETA (um indice por pixel + a lista de cores), pixel por pixel
identico, ele costuma cair pela metade ou menos.

    python3 tools/compacta_fusoes.py            # compacta todos
    python3 tools/compacta_fusoes.py --ver      # so mostra quanto daria

Nada e perdido: se o desenho tiver mais de 256 cores (nao acontece com o que
sai da oficina, mas pode acontecer com um importado), ele fica como esta. O
dev_server chama a mesma funcao ao gravar uma ficha nova.
"""
import os
import sys
import zlib
import struct

AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, AQUI)
from png_io import read_png            # noqa: E402

PASTA = os.path.join(os.path.dirname(AQUI), "assets", "fusoes")


def _chunk(tipo, dados):
    return (struct.pack(">I", len(dados)) + tipo + dados
            + struct.pack(">I", zlib.crc32(tipo + dados) & 0xFFFFFFFF))


def png_paleta(w, h, px):
    """Escreve PNG de paleta a partir de RGBA cru. None se nao couber em 256.

    A profundidade e a MENOR que couber: um desenho de duas cores sai com 1 bit
    por pixel, ate 4 cores com 2 bits, ate 16 com 4 bits (que e o caso normal —
    a paleta da oficina tem dezesseis) e o resto com 8. Um pixel de 64x64 em 4
    bits ocupa metade do que ocupava em 8, e um oitavo do que ocupava em cor
    verdadeira.
    """
    cores, indices = {}, bytearray()
    for i in range(0, len(px), 4):
        cor = bytes(px[i:i + 4])
        if cor[3] == 0:
            cor = b"\0\0\0\0"          # todo transparente e a MESMA cor
        k = cores.get(cor)
        if k is None:
            if len(cores) >= 256:
                return None
            k = len(cores)
            cores[cor] = k
        indices.append(k)

    lista = sorted(cores, key=cores.get)
    plte = b"".join(c[:3] for c in lista)
    trns = bytes(c[3] for c in lista)
    # o tRNS pode parar na ultima cor opaca: o resto do PNG assume 255
    while trns and trns[-1] == 255:
        trns = trns[:-1]

    # a menor profundidade que cabe: 1, 2, 4 ou 8 bits por pixel
    n = len(lista)
    depth = 1 if n <= 2 else 2 if n <= 4 else 4 if n <= 16 else 8
    porbyte = 8 // depth

    linhas = bytearray()
    for y in range(h):
        linhas.append(0)               # filtro "none": paleta nao ganha com filtro
        fila = indices[y * w:(y + 1) * w]
        if depth == 8:
            linhas += fila
        else:
            for i in range(0, w, porbyte):
                byte = 0
                for k in range(porbyte):
                    byte = (byte << depth) | (fila[i + k] if i + k < w else 0)
                linhas.append(byte)

    corpo = (b"\x89PNG\r\n\x1a\n"
             + _chunk(b"IHDR", struct.pack(">IIBBBBB", w, h, depth, 3, 0, 0, 0))
             + _chunk(b"PLTE", plte)
             + (_chunk(b"tRNS", trns) if trns else b"")
             + _chunk(b"IDAT", zlib.compress(bytes(linhas), 9))
             + _chunk(b"IEND", b""))
    return corpo


def compacta(caminho, so_ver=False):
    """Devolve (bytes antes, bytes depois). Reescreve o arquivo se valer a pena."""
    antes = os.path.getsize(caminho)
    try:
        w, h, px = read_png(caminho)
    except Exception:
        return antes, antes
    novo = png_paleta(w, h, px)
    if not novo or len(novo) >= antes:
        return antes, antes
    if not so_ver:
        with open(caminho, "wb") as fh:
            fh.write(novo)
    return antes, len(novo)


def main():
    so_ver = "--ver" in sys.argv
    if not os.path.isdir(PASTA):
        return print("nao ha desenhos de fusao ainda")
    antes = depois = 0
    mexidos = 0
    for nome in sorted(os.listdir(PASTA)):
        if not nome.endswith(".png"):
            continue
        a, d = compacta(os.path.join(PASTA, nome), so_ver)
        antes += a
        depois += d
        if d < a:
            mexidos += 1
            print(f"  {nome:<44} {a/1024:5.1f} KB -> {d/1024:5.1f} KB")
    verbo = "dariam" if so_ver else "viraram"
    print(f"\n{mexidos} desenho(s) {verbo} menor(es): "
          f"{antes/1024:.1f} KB -> {depois/1024:.1f} KB "
          f"({100 - (depois * 100 // max(1, antes))}% a menos)")


if __name__ == "__main__":
    main()
