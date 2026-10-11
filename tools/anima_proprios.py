#!/usr/bin/env python3
"""ANIMAÇÃO PARA QUEM NÃO TEM GIF: as formas -BRAG, as FORMAS ÚNICAS e todo
sprite que nem o B/W nem o Showdown animam (tools/fetch_bw_anim.py).

Cada desenho vira 24 quadros no jeito do B/W, como um fantoche de partes: os
pés presos no chão, o corpo desce e sobe, a cabeça vem atrasada e inclina, e
os lados (braços, asas) batem no compasso deles. O resultado vai pro mesmo lugar e
no mesmo formato dos GIFs convertidos, então o jogo não distingue um do outro:

    assets/sprites/pokemon/anim/21101.png  (e back/21101.png)
    assets/sprites/pokemon/anim/u/<nome>.png    as FORMAS ÚNICAS (assets/unicas/)
    assets/sprites/pokemon/anim/quadros.json    índice compartilhado

    python3 tools/anima_proprios.py           # só quem ainda não tem animação
    python3 tools/anima_proprios.py --force   # refaz os gerados aqui

Precisa do Pillow.
"""
import argparse
import json
import math
import os
import re
import zlib

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SPR = os.path.join(ROOT, "assets", "sprites", "pokemon")
OUT = os.path.join(SPR, "anim")
INDICE = os.path.join(OUT, "quadros.json")
UNICAS = os.path.join(ROOT, "assets", "unicas")
N = 24          # quadros por volta (80 ms cada: ~2 s, o ritmo do B/W)
COLUNAS = 16


def suave(a, b, x):
    """0 antes de a, 1 depois de b, curva macia no meio"""
    if b == a:
        return 1.0 if x >= b else 0.0
    t = max(0.0, min(1.0, (x - a) / (b - a)))
    return t * t * (3 - 2 * t)


def luz(p):
    return (p[0] * 299 + p[1] * 587 + p[2] * 114) // 1000


def achar_olhos(px, w, h, topo, chao):
    """Os OLHOS: manchas escuras pequenas na metade de cima, com o brilho
    (pixel quase branco) encostado — é assim que olho é desenhado em sprite.
    Devolve as caixas (x0, y0, x1, y1) de até dois; nenhuma se não tiver
    certeza (aí ele só não pisca)."""
    alt = chao - topo
    limite = topo + int(alt * 0.62)
    escuro = lambda x, y: px[x, y][3] and luz(px[x, y]) < 80
    visto, olhos = set(), []
    maximo = max(4, alt // 7)
    for y in range(topo, limite):
        for x in range(w):
            if (x, y) in visto or not escuro(x, y):
                continue
            pilha, comp = [(x, y)], []
            visto.add((x, y))
            while pilha and len(comp) <= 60:
                cx, cy = pilha.pop()
                comp.append((cx, cy))
                for nx, ny in ((cx + 1, cy), (cx - 1, cy), (cx, cy + 1), (cx, cy - 1)):
                    if 0 <= nx < w and topo <= ny < limite and (nx, ny) not in visto and escuro(nx, ny):
                        visto.add((nx, ny))
                        pilha.append((nx, ny))
            if not (2 <= len(comp) <= 40):
                continue
            xs, ys = [c[0] for c in comp], [c[1] for c in comp]
            x0, y0, x1, y1 = min(xs), min(ys), max(xs) + 1, max(ys) + 1
            if x1 - x0 > maximo or y1 - y0 > maximo:
                continue
            # tem que ter o brilho dentro ou encostado, e o resto em volta colorido
            brilho = any(0 <= bx < w and 0 <= by < h and px[bx, by][3] and luz(px[bx, by]) > 200
                         for bx in range(x0 - 1, x1 + 1) for by in range(y0 - 1, y1 + 1))
            if brilho:
                olhos.append((x0, y0, x1, y1))
    if len(olhos) > 2:
        # o par mais alinhado na altura
        olhos.sort(key=lambda o: o[1])
        par = min(((a, b) for i, a in enumerate(olhos) for b in olhos[i + 1:]),
                  key=lambda ab: abs(ab[0][1] - ab[1][1]) * 10 + abs(ab[0][0] - ab[1][0]) * 0.1)
        olhos = list(par)
    # dois pedaços do mesmo olho (caixas encostadas) viram um
    if len(olhos) == 2:
        (a0, b0, a1, b1), (c0, d0, c1, d1) = olhos
        if a0 <= c1 and c0 <= a1 and b0 <= d1 and d0 <= b1:
            olhos = [(min(a0, c0), min(b0, d0), max(a1, c1), max(b1, d1))]
    # dois "olhos" em alturas bem diferentes: um deles não é olho (de perfil
    # só aparece um) — fica o de cima
    if len(olhos) == 2 and abs(olhos[0][1] - olhos[1][1]) > 3:
        olhos = [min(olhos, key=lambda o: o[1])]
    return olhos


def piscando(base, olhos):
    """o mesmo desenho com os olhos fechados: a pele por cima e um risco"""
    img = base.copy()
    px = img.load()
    w, h = img.size
    for x0, y0, x1, y1 in olhos:
        # a pele: a cor mais comum na borda em volta do olho
        cores = {}
        for x in range(x0 - 1, x1 + 1):
            for y in range(y0 - 1, y1 + 1):
                if x0 <= x < x1 and y0 <= y < y1:
                    continue
                if 0 <= x < w and 0 <= y < h and px[x, y][3] and 80 <= luz(px[x, y]) <= 200:
                    cores[px[x, y]] = cores.get(px[x, y], 0) + 1
        if not cores:
            continue
        pele = max(cores, key=cores.get)
        escuro = min((px[x, y] for x in range(x0, x1) for y in range(y0, y1) if px[x, y][3]), key=luz)
        for x in range(x0, x1):
            for y in range(y0, y1):
                if px[x, y][3] and (luz(px[x, y]) < 80 or luz(px[x, y]) > 200):
                    px[x, y] = pele
        meio = y0 + max(0, (y1 - y0) * 3 // 5 - (1 if y1 - y0 > 2 else 0))
        for x in range(x0, x1):
            px[x, meio] = escuro
    return img


def animar(src, nome):
    """sprite parado -> N quadros RGBA. Cada PARTE se mexe do seu jeito, como
    nos fantoches do B/W: os pés presos, o corpo desce e sobe, a cabeça vem
    atrasada e inclina, e os lados (braços, asas) batem no compasso deles."""
    im = Image.open(src).convert("RGBA")
    caixa = im.getbbox()
    if not caixa:
        return None
    m = 6   # margem: nada pode sair da folha
    w, h = im.width + m * 2, im.height + m * 2
    base = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    base.paste(im, (m, m))
    px = base.load()
    caixa_m = (caixa[0] + m, caixa[1] + m, caixa[2] + m, caixa[3] + m)
    olhos = achar_olhos(px, w, h, caixa_m[1], caixa_m[3])
    px_pisca = piscando(base, olhos).load() if olhos else px
    esq, topo, dir_, chao = caixa[0] + m, caixa[1] + m, caixa[2] + m, caixa[3] + m
    alt, larg = max(1, chao - topo), max(1, dir_ - esq)
    meio = (esq + dir_) / 2
    r = (zlib.crc32(nome.encode()) & 0xFFFF) / 0xFFFF
    r2 = (zlib.crc32((nome + "b").encode()) & 0xFFFF) / 0xFFFF
    esc = max(0.6, min(1.6, alt / 48))            # bicho grande mexe mais pixels
    corpo = (1.4 + r * 1.0) * esc                  # quanto o corpo desce
    cabeca = (1.3 + r2 * 1.2) * esc                # a cabeça a mais, atrasada
    inclina = (0.9 + r * 1.2) * esc                # a cabeça pro lado
    asa = (1.6 + r2 * 1.8) * esc * (1.5 if larg > alt * 1.2 else 1.0)   # largo = asa
    # PISCA uma vez por volta, em dois quadros, num momento que é de cada um
    pisca = int(N * (0.55 + r2 * 0.3))
    atraso = 0.5 + r * 0.6
    quadros = []
    for f in range(N):
        a = 2 * math.pi * f / N
        q = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        qp = q.load()
        fonte = px_pisca if f in (pisca, pisca + 1) else px
        for y in range(h):
            v = (chao - y) / alt                   # 0 nos pés, 1 no topo
            preso = suave(0.0, 0.28, v)            # o pé não sai do lugar
            dy_c = -corpo * (0.5 - 0.5 * math.cos(a)) * preso
            pc = suave(0.55, 0.85, v)              # peso da cabeça
            dy_h = -cabeca * (0.5 - 0.5 * math.cos(a - atraso)) * pc
            for x in range(w):
                u = (x - meio) / (larg / 2)        # -1 na esquerda, 1 na direita
                dx = inclina * math.sin(a - atraso) * pc * suave(0.5, 1.0, v)
                pl = suave(0.45, 0.85, abs(u)) * suave(0.25, 0.45, v) * (1 - suave(0.8, 1.0, v))
                lado = 1 if u > 0 else -1
                dy_a = -asa * math.sin(2 * a + lado * 0.4) * pl
                sx = int(round(x - dx))
                sy = int(round(y - (dy_c + dy_h + dy_a)))
                if 0 <= sx < w and 0 <= sy < h:
                    p = fonte[sx, sy]
                    if p[3]:
                        qp[x, y] = p
        quadros.append(q)
    return quadros


def salvar(quadros, dest):
    # corta na caixa de todos os quadros juntos: o chão do desenho é o chão da
    # folha (o jogo põe a borda de baixo no chão), igual aos GIFs convertidos
    caixa = None
    for q in quadros:
        b = q.getbbox()
        if b:
            caixa = b if not caixa else (min(caixa[0], b[0]), min(caixa[1], b[1]), max(caixa[2], b[2]), max(caixa[3], b[3]))
    if caixa:
        quadros = [q.crop(caixa) for q in quadros]
    w, h = quadros[0].size
    col = min(COLUNAS, len(quadros))
    lin = (len(quadros) + col - 1) // col
    out = Image.new("RGBA", (w * col, h * lin), (0, 0, 0, 0))
    for i, q in enumerate(quadros):
        out.paste(q, ((i % col) * w, (i // col) * h))
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    out.save(dest, optimize=True)
    return [w, h, col, [80] * len(quadros)]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--force", action="store_true")
    a = ap.parse_args()
    indice = {}
    if os.path.exists(INDICE):
        with open(INDICE, encoding="utf-8") as f:
            indice = json.load(f)
    alvos = []   # (chave, frente, costas)
    for f in sorted(os.listdir(SPR)):
        m = re.fullmatch(r"(\d{3,5})\.png", f)
        if m:
            costas = os.path.join(SPR, "back", f)
            alvos.append((m.group(1), os.path.join(SPR, f), costas if os.path.exists(costas) else None))
    if os.path.isdir(UNICAS):
        for f in sorted(os.listdir(UNICAS)):
            if f.endswith(".png"):
                alvos.append(("u/" + f[:-4], os.path.join(UNICAS, f), None))
    feitos = 0
    for chave, frente, costas in alvos:
        e = indice.get(chave, {})
        gerado = e.get("gerado")
        # quem veio de GIF (B/W, Showdown) NUNCA é trocado pelo gerado
        if e.get("f") and not (a.force and gerado):
            continue   # já tem animação (do GIF, ou daqui)
        novo = {"gerado": 1}
        for lado, src, pasta in (("f", frente, OUT), ("c", costas, os.path.join(OUT, "back"))):
            if not src:
                continue
            qs = animar(src, chave + lado)
            if qs:
                novo[lado] = salvar(qs, os.path.join(pasta, chave + ".png"))
        if "f" in novo:
            indice[chave] = novo
            feitos += 1
            print(chave, "".join(k for k in novo if k != "gerado"))
    with open(INDICE, "w", encoding="utf-8") as f:
        json.dump(indice, f, separators=(",", ":"), sort_keys=True)
    print(f"{feitos} animações geradas; {len(indice)} no índice")


if __name__ == "__main__":
    main()
