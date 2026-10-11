"""A BASE DOS POKÉMON ANDANDO NO MAPA: as ferramentas que todo desenho usa
(tools/desenha_andar.py e os lotes de tools/andar_lotes/). Num lote:

    from andar_base import *          # H, sombrear, pes, contorno_gba, olhinho, P_, BR...

    def meu_pokemon(t, lado):         # lado: "frente", "costas" ou "lado" (virado pra ESQUERDA)
        ...                           # desenha numa Tela de 24x24, pés na linha 21-22
        contorno_gba(t)

    DESENHOS = {123: meu_pokemon}     # nº da Pokédex -> função
    TAMANHO = {123: 0.8}              # opcional: menor que 24 (os pequenos)
"""
import os
import sys
from collections import Counter

from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from pixelart import Tela, escurecer, clarear  # noqa: E402,F401

L = 24
PRETO = (30, 26, 34, 255)
BRANCO = (250, 250, 250, 255)
BR = (250, 250, 250, 255)
QUADROS = [0, 1, 0, -1]          # parado, pé esquerdo, parado, pé direito

# O PASSO do quadro que está sendo desenhado: 0 parado, 1 pé esquerdo na
# frente, -1 o direito (quem muda é `quadro`)
estado = {"passo": 0}


def H(c):
    c = c.lstrip("#")
    return (int(c[0:2], 16), int(c[2:4], 16), int(c[4:6], 16), 255)


P_ = H("101010")


def olho(t, x, y, cor=PRETO):
    t.px(x, y, cor)
    t.px(x, y - 1, cor)


def olhinho(t, x, y, cor=P_, brilho=True):
    t.pxs([(x, y), (x, y + 1)], cor)
    if brilho:
        t.px(x, y, BR)


def pes(t, pontos, cor):
    """os pés: no passo, um desce um pixel (vai pra frente) e o outro sobe"""
    passo = estado["passo"]
    meio = sum(x for x, _ in pontos) / max(1, len(pontos))
    for x, y in pontos:
        esquerdo = x < meio
        d = 0 if passo == 0 else (1 if (passo == 1) == esquerdo else -1)
        t.px(x, y + d, cor)


def contorno_gba(t):
    """O JEITO DO TREINADOR (o boneco do FireRed): o contorno PRETO puro. Os
    três tons de cada cor vêm de `sombrear`, com as cores do sprite de batalha."""
    t.contorno((0, 0, 0, 255))


def sombrear(t, tons):
    """VOLUME: tons = {base: (claro, escuro)} — a borda de cima-esquerda no
    claro, a de baixo-direita (dois pixels) no escuro. Só mexe nessas cores."""
    antes = t.img.copy().load()
    novo = t.img.load()
    vazio = lambda x, y: not (0 <= x < t.lado and 0 <= y < t.lado) or antes[x, y][3] == 0
    for y in range(t.lado):
        for x in range(t.lado):
            c = antes[x, y]
            if c not in tons:
                continue
            claro, escuro = tons[c]
            if vazio(x + 1, y) or vazio(x, y + 1) or vazio(x + 1, y + 1) or vazio(x, y + 2):
                novo[x, y] = escuro
            elif vazio(x - 1, y) or vazio(x, y - 1):
                novo[x, y] = claro


def quadro(desenho, lado, passo):
    """um quadro: o desenho no `lado`, no `passo` (no passo o corpo sobe um
    pixel, como o do treinador, e os pés ficam no chão)"""
    estado["passo"] = passo
    t = Tela(L)
    desenho(t, lado)
    img = t.img
    if passo:
        out = Image.new("RGBA", (L, L), (0, 0, 0, 0))
        out.paste(img.crop((0, 1, L, L)), (0, 0))
        out.paste(img.crop((0, L - 3, L, L)), (0, L - 3))
        img = out
    return img


def encolher(img, k):
    """Reduz pixel art sem borrar: cada pixel novo é a cor que mais aparece no
    bloco dele — e o escuro (contorno, olho) tem preferência, senão some. Os
    pés continuam no chão (embaixo, no meio)."""
    caixa = img.getbbox()
    if not caixa or k >= 1:
        return img
    src = img.crop(caixa)
    px = src.load()
    w, h = max(1, round(src.width * k)), max(1, round(src.height * k))
    novo = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    np_ = novo.load()
    for y in range(h):
        for x in range(w):
            x0, x1 = int(x / k), max(int(x / k) + 1, int((x + 1) / k))
            y0, y1 = int(y / k), max(int(y / k) + 1, int((y + 1) / k))
            bloco = [px[i, j] for i in range(x0, min(x1, src.width)) for j in range(y0, min(y1, src.height))]
            vis = [c for c in bloco if c[3] > 128]
            if len(vis) * 2 < len(bloco):
                continue
            esc = [c for c in vis if sum(c[:3]) < 80]
            np_[x, y] = (Counter(esc) if len(esc) * 3 >= len(vis) else Counter(vis)).most_common(1)[0][0]
    out = Image.new("RGBA", img.size, (0, 0, 0, 0))
    meio = (caixa[0] + caixa[2]) // 2
    out.paste(novo, (meio - w // 2, caixa[3] - h), novo)
    return out


def folha_do(desenho, k=1):
    """as 4 linhas (baixo, cima, esquerda, direita) x 4 quadros de um Pokémon"""
    folha = Image.new("RGBA", (L * len(QUADROS), L * 4), (0, 0, 0, 0))
    linhas = [("frente", False), ("costas", False), ("lado", False), ("lado", True)]
    for linha, (lado, espelha) in enumerate(linhas):
        for i, passo in enumerate(QUADROS):
            img = encolher(quadro(desenho, lado, passo), k)
            if espelha:
                img = img.transpose(Image.FLIP_LEFT_RIGHT)
            folha.paste(img, (i * L, linha * L))
    return folha
