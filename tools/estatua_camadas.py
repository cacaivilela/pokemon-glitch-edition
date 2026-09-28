#!/usr/bin/env python3
"""O RELEVO da cara do ARCEUS REDENTOR (RIO DE JANEEVEE, src/data/braglitch-mundo.js).

A cara da estátua salta pra fora em camadas: são FATIAS recortadas da própria
cara do sprite da estátua, desenhadas uma por cima da outra, cada uma um pixel
mais pra frente (a técnica de "sprite stacking"). Só a CARA — a máscara que a
moldura fecha por dentro; o arco da moldura em volta fica parado na estátua.

As fatias têm o FORMATO DE CABEÇA DE CAVALO: a de baixo é a cara inteira, e
cada uma de cima perde um pedaço da testa e afina em volta do eixo do rosto —
o que sobe é o focinho, comprido, indo pra ponta do escudo. As de baixo vêm
mais escuras (a borda delas que sobra aparecendo é a LATERAL do relevo). Por
último vêm os OLHOS sozinhos, na altura da última fatia que ainda passa por
eles: se ficassem nas fatias, cada uma mostraria um pedaço de olho num lugar
diferente.

Cada fatia é gravada do tamanho da estátua inteira (transparente fora dela),
pra cena só precisar desenhar uma por cima da outra com o deslocamento (ver
`drawEstatua` em src/scenes/overworld.js e `cara` em src/data/braglitch.js):

    assets/sprites/estatuas/arceus_redentor_cara_1.png ... _N.png
    (a última é a dos olhos; ela vai na altura da fatia que o script disser —
    é o `olhos` de `cara` em src/data/braglitch.js)

    python3 tools/estatua_camadas.py                  # grava as fatias
    python3 tools/estatua_camadas.py --previa X.png   # e uma prévia ampliada
"""
import argparse
import glob
import os

from PIL import Image

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PASTA = os.path.join(RAIZ, "assets", "sprites", "estatuas")
BASE = os.path.join(PASTA, "arceus_redentor.png")

CAIXA = (1, 9, 46, 45)            # a cabeça (x0, y0, x1, y1), fim exclusivo
MOLDURA = {(0xe4, 0xd9, 0xb0), (0xc7, 0xb9, 0x8c), (0x9c, 0x8e, 0x66)}
OLHO = {(0xff, 0xd2, 0x3f), (0xf2, 0xa9, 0x00)}    # o dourado dos olhos
FATIAS = 7                        # quantas fatias de cara (fora a dos olhos)
CORTE_TESTA = 0.62                # a fatia de cima perde 62% da altura da cara, por cima
AFINA = 0.45                      # ...e fica 45% mais estreita
PASSO = (-1, 1)                   # quanto cada fatia anda pra frente (pra baixo e pra esquerda)
LUZ_MIN = 0.86                    # a fatia de baixo sai com 86% da luz; a de cima, 100%


def cara(im):
    """A máscara que a moldura fecha por dentro (sem a moldura)."""
    x0, y0, x1, y1 = CAIXA
    px = im.load()
    moldura = {(x, y) for y in range(y0, y1) for x in range(x0, x1)
               if px[x, y][3] and px[x, y][:3] in MOLDURA}
    # fora = o que se alcança da borda da caixa sem atravessar a moldura
    fora, fila = set(), []
    for x in range(x0, x1):
        fila += [(x, y0), (x, y1 - 1)]
    for y in range(y0, y1):
        fila += [(x0, y), (x1 - 1, y)]
    while fila:
        p = fila.pop()
        if p in fora or p in moldura or not (x0 <= p[0] < x1 and y0 <= p[1] < y1):
            continue
        fora.add(p)
        x, y = p
        fila += [(x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)]
    return {(x, y) for y in range(y0, y1) for x in range(x0, x1)
            if (x, y) not in fora and (x, y) not in moldura and px[x, y][3]}


def olhos_de(im, pontos):
    """Os pixels do olho: o dourado e o contorno escuro colado nele."""
    px = im.load()
    olho = set()
    for p in pontos:
        if px[p][:3] not in OLHO:
            continue
        x, y = p
        for dx in (-1, 0, 1):
            for dy in (-1, 0, 1):
                q = (x + dx, y + dy)
                if q in pontos and (px[q][:3] in OLHO or sum(px[q][:3]) < 330):
                    olho.add(q)
    return olho


def fatias(im):
    """As fatias em FORMATO DE CABEÇA DE CAVALO: a de baixo é a cara inteira;
    cada uma de cima perde um pedaço da testa (corta por cima) e afina em volta
    do eixo do rosto, então o que sobe é o FOCINHO, comprido, indo pra ponta do
    escudo. As de baixo vêm mais escuras (a borda que sobra é a lateral). Os
    olhos saem das fatias e voltam numa só, na altura da última fatia que ainda
    passa por eles — no lado da cabeça, como num cavalo."""
    pontos = cara(im)
    px = im.load()
    olho = olhos_de(im, pontos)
    cores = {}
    for p in pontos - olho:
        cores[px[p]] = cores.get(px[p], 0) + 1
    pedra = max(cores, key=cores.get)
    # o eixo do rosto e a largura de cada linha
    linhas = {}
    for (x, y) in pontos:
        lo, hi = linhas.get(y, (x, x))
        linhas[y] = (min(lo, x), max(hi, x))
    y0, y1 = min(linhas), max(linhas)
    alt = y1 - y0 + 1
    out, nivel_olho = [], 1
    for k in range(1, FATIAS + 1):
        t = (k - 1) / (FATIAS - 1)
        luz = LUZ_MIN + (1 - LUZ_MIN) * t
        corte = y0 + t * CORTE_TESTA * alt
        f = Image.new("RGBA", im.size, (0, 0, 0, 0))
        fp = f.load()
        tem_olho = False
        for (x, y) in pontos:
            if y < corte:
                continue
            lo, hi = linhas[y]
            meio, meia = (lo + hi) / 2, (hi - lo) / 2
            if abs(x - meio) > meia * (1 - AFINA * t) + 0.5:
                continue
            if (x, y) in olho:
                tem_olho = True
            r, g, b, a = pedra if (x, y) in olho else px[x, y]
            fp[x, y] = (round(r * luz), round(g * luz), round(b * luz), a)
        if tem_olho:
            nivel_olho = k
        out.append(f)
    olhos = Image.new("RGBA", im.size, (0, 0, 0, 0))
    op = olhos.load()
    for q in olho:
        op[q] = px[q]
    out.append(olhos)
    return out, nivel_olho


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--previa", help="grava também uma prévia ampliada da cabeça montada")
    a = ap.parse_args()
    im = Image.open(BASE).convert("RGBA")
    fs, nivel_olho = fatias(im)
    for velho in glob.glob(os.path.join(PASTA, "arceus_redentor_cara_*.png")):
        os.remove(velho)
    for k, f in enumerate(fs, start=1):
        f.save(os.path.join(PASTA, f"arceus_redentor_cara_{k}.png"))
    print(f"{len(fs)} fatias (a última são os olhos, na altura da fatia {nivel_olho}) "
          f"-> {PASTA}/arceus_redentor_cara_N.png")
    if a.previa:
        # monta como o jogo monta: a estátua e as fatias por cima, andando PASSO
        # cada; os olhos andam junto com a fatia de cima
        tela = Image.new("RGBA", (im.width + 12, im.height + 12), (95, 174, 74, 255))
        tela.alpha_composite(im, (8, 4))
        for k, f in enumerate(fs, start=1):
            if k > FATIAS:
                k = nivel_olho
            tela.alpha_composite(f, (8 + PASSO[0] * k, 4 + PASSO[1] * k))
        cab = tela.crop((0, 0, 64, 60)).resize((256, 240), Image.NEAREST)
        antes = Image.new("RGBA", (64, 60), (95, 174, 74, 255))
        antes.alpha_composite(im.crop((0, 0, 56, 56)), (8, 4))
        lado = Image.new("RGBA", (256 * 2 + 8, 240), (20, 20, 30, 255))
        lado.paste(antes.resize((256, 240), Image.NEAREST), (0, 0))
        lado.paste(cab, (264, 0))
        lado.save(a.previa)
        print("prévia:", a.previa)


if __name__ == "__main__":
    main()
