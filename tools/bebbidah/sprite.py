#!/usr/bin/env python3
"""Os sprites do BEBBIDAH (1110) e do BEBBIDÃO (1111).

BEBBIDAH: o desenho é do CAIO (dev/captures/novo_brag_base.png). Aqui só o
vidro da caneca ganha cor (no desenho dele ele ficou vazio) — o buraco da alça
continua vazado.
BEBBIDÃO: a jarra de tools/bebbidah/evolucao.py.

COSTAS: o mesmo desenho virado (a alça e o bico trocam de lado) e sem o rosto,
que fica do lado de lá da água.
SHINY: o vidro fica ÂMBAR; no BEBBIDAH a água fica ROXA. (No BEBBIDÃO a
bebida é pintada no jogo, então o shiny tem que ser no vidro.)

A ÁGUA TEM DUAS CORES-CHAVE, (86,139,220) e (140,184,240): o jogo troca elas
pela cor da bebida (src/core/assets.js, `bebbidao`). Não mexer nelas.

    python3 tools/bebbidah/sprite.py
"""
import os
import sys
from PIL import Image

AQUI = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(AQUI))
sys.path.insert(0, AQUI)
import evolucao  # noqa: E402

PRETO = (8, 8, 8)
AGUA = (86, 139, 220)
VIDRO = (236, 244, 250, 255)

SHINY = {
    (236, 244, 250): (252, 228, 160),   # vidro -> âmbar
    (196, 214, 228): (226, 192, 112),
}
SHINY_AGUA = {AGUA: (176, 104, 220), (140, 184, 240): (212, 160, 240)}


def regioes_vazias(im):
    """as manchas de pixel vazio que não encostam na borda (as fechadas)"""
    w, h = im.size
    px = im.load()
    visto = [[False] * w for _ in range(h)]
    out = []
    for y0 in range(h):
        for x0 in range(w):
            if visto[y0][x0] or px[x0, y0][3]:
                continue
            pilha, mancha, borda = [(x0, y0)], [], False
            visto[y0][x0] = True
            while pilha:
                x, y = pilha.pop()
                mancha.append((x, y))
                if x in (0, w - 1) or y in (0, h - 1):
                    borda = True
                for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    nx, ny = x + dx, y + dy
                    if 0 <= nx < w and 0 <= ny < h and not visto[ny][nx] and not px[nx, ny][3]:
                        visto[ny][nx] = True
                        pilha.append((nx, ny))
            if not borda:
                out.append(mancha)
    return out


def bebbidah():
    im = Image.open(os.path.join(ROOT, "dev/captures/novo_brag_base.png")).convert("RGBA")
    for mancha in regioes_vazias(im):
        # o buraco da alça é a mancha toda do lado esquerdo da caneca: fica vazado
        if max(x for x, _ in mancha) < 28:
            continue
        for p in mancha:
            im.putpixel(p, VIDRO)
    return im


def sem_rosto(im):
    """tira o rosto de dentro da água: todo traço preto que não encosta no
    vidro nem no vazio (o contorno da caneca encosta; o rosto, não)"""
    out = im.copy()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            if im.getpixel((x, y))[:3] != PRETO:
                continue
            viz = [im.getpixel((x + dx, y + dy)) for dx in (-1, 0, 1) for dy in (-1, 0, 1)
                   if 0 <= x + dx < w and 0 <= y + dy < h]
            if all(v[3] and v[:3] in (PRETO, AGUA) for v in viz):
                out.putpixel((x, y), AGUA + (255,))
    return out


def trocar(im, mapa):
    out = im.copy()
    for y in range(im.height):
        for x in range(im.width):
            p = im.getpixel((x, y))
            if p[3] and p[:3] in mapa:
                out.putpixel((x, y), mapa[p[:3]] + (p[3],))
    return out


def gravar(im, pasta, dex):
    d = os.path.join(ROOT, "assets/sprites/pokemon", pasta)
    os.makedirs(d, exist_ok=True)
    im.save(os.path.join(d, f"{dex}.png"))


if __name__ == "__main__":
    frente = {1110: bebbidah(), 1111: evolucao.jarra()}
    costas = {1110: sem_rosto(frente[1110]).transpose(Image.FLIP_LEFT_RIGHT),
              1111: evolucao.jarra(rosto=False).transpose(Image.FLIP_LEFT_RIGHT)}
    folha = Image.new("RGBA", (96 * 4, 96 * 2), (40, 40, 52, 255))
    for i, dex in enumerate((1110, 1111)):
        sh = {**SHINY, **(SHINY_AGUA if dex == 1110 else {})}
        lados = [(frente[dex], ""), (costas[dex], "back"),
                 (trocar(frente[dex], sh), "shiny"), (trocar(costas[dex], sh), "shiny/back")]
        for j, (im, pasta) in enumerate(lados):
            gravar(im, pasta, dex)
            folha.alpha_composite(im, (96 * j, 96 * i))
    caminho = os.path.join(ROOT, "dev/captures/bebbidah_folha.png")
    folha.resize((folha.width * 3, folha.height * 3), Image.NEAREST).save(caminho)
    print(caminho)
