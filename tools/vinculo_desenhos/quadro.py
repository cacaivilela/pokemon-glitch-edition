"""O 1º QUADRO DA ANIMAÇÃO de uma espécie (as folhas do Black/White em
assets/sprites/pokemon/anim/, ver tools/fetch_bw_anim.py), pronto pra ser
editado com as ferramentas de tools/pixelart.py.

O quadro é posto numa tela QUADRADA (os sprites parados do jogo são
quadrados: a batalha desenha o parado em 64x64), centrado e com o pé no
chão. Sem animação de costas, usa o sprite parado de costas.
"""
import json
import os

from PIL import Image

from pixelart import Tela

RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SPR = os.path.join(RAIZ, "assets", "sprites", "pokemon")
ANIM = os.path.join(SPR, "anim")
_indice = None


def indice():
    global _indice
    if _indice is None:
        with open(os.path.join(ANIM, "quadros.json"), encoding="utf-8") as f:
            _indice = json.load(f)
    return _indice


def primeiro(dex, costas=False):
    """o 1º quadro (RGBA, do tamanho dele)"""
    chave = f"{dex:03d}"
    info = indice().get(chave, {}).get("c" if costas else "f")
    folha = os.path.join(ANIM, *(["back"] if costas else []), chave + ".png")
    if info and os.path.exists(folha):
        w, h = info[0], info[1]
        return Image.open(folha).convert("RGBA").crop((0, 0, w, h))
    parado = os.path.join(SPR, *(["back"] if costas else []), chave + ".png")
    im = Image.open(parado).convert("RGBA")
    return im.crop(im.getbbox())


def tela(dex, costas=False, minimo=96):
    """uma Tela quadrada já com o 1º quadro, pé no chão (2 px de folga)"""
    q = primeiro(dex, costas)
    lado = max(minimo, q.width + 4, q.height + 4)
    t = Tela(lado)
    t.img.alpha_composite(q, ((lado - q.width) // 2, lado - q.height - 2))
    return t


def trocar(t, mapa, caixa=None):
    """troca cores exatas (rgb -> rgb), só dentro da `caixa` (x0, y0, x1, y1)
    se ela vier"""
    px = t.img.load()
    x0, y0, x1, y1 = caixa or (0, 0, t.lado, t.lado)
    for y in range(max(0, y0), min(t.lado, y1)):
        for x in range(max(0, x0), min(t.lado, x1)):
            c = px[x, y]
            if c[3] and c[:3] in mapa:
                px[x, y] = tuple(mapa[c[:3]]) + (c[3],)


def cores(t):
    return {p[:3] for p in t.img.getdata() if p[3]}


def _mapa_shiny(dex, costas):
    """cor comum -> shiny, do par de sprites parados oficiais"""
    from collections import Counter
    pasta = ["back"] if costas else []
    a = os.path.join(SPR, *pasta, f"{dex:03d}.png")
    b = os.path.join(SPR, "shiny", *pasta, f"{dex:03d}.png")
    if not (os.path.exists(a) and os.path.exists(b)):
        return {}
    ia, ib = Image.open(a).convert("RGBA"), Image.open(b).convert("RGBA")
    if ia.size != ib.size:
        return {}
    votos = {}
    for pa, pb in zip(ia.getdata(), ib.getdata()):
        if pa[3] > 128 and pb[3] > 128:
            votos.setdefault(pa[:3], Counter())[pb[:3]] += 1
    return {c: v.most_common(1)[0][0] for c, v in votos.items() if sum(v.values()) >= 3}


def shiny(t, dex, costas, originais):
    """pinta de shiny SÓ as cores que vieram do quadro original (`originais`):
    o que a edição pôs (as cores do treinador) fica como está"""
    mapa = _mapa_shiny(dex, costas)
    if not mapa:
        return
    base = list(mapa)
    troca = {}
    for c in originais:
        k = min(base, key=lambda b: sum((b[i] - c[i]) ** 2 for i in range(3)))
        if sum((k[i] - c[i]) ** 2 for i in range(3)) ** 0.5 <= 60:
            s = mapa[k]
            troca[c] = tuple(max(0, min(255, s[i] + c[i] - k[i])) for i in range(3))
    trocar(t, troca)


def render(f, costas=False, shiny=False):
    """a imagem de um desenho, dos dois jeitos que eles existem:
    `f(t, costas)` desenha do zero numa Tela 64 (as costas saem espelhadas);
    `f(costas, shiny)` edita o 1º quadro da animação e devolve a Tela (as
    costas já vêm viradas certo)"""
    import inspect
    params = inspect.signature(f).parameters
    if "t" in params:
        t = Tela()
        kw = {"costas": costas}
        if "shiny" in params:
            kw["shiny"] = shiny
        f(t, **kw)
        return t.img.transpose(Image.FLIP_LEFT_RIGHT) if costas else t.img
    return f(costas=costas, shiny=shiny).img


def tingir(t, hue, rampa, sat_min=0.18, caixa=None, lum=None):
    """troca, pixel por pixel, uma FAMÍLIA DE COR por uma rampa do treinador.
    `hue` = (de, até) em graus (pode dar a volta: (330, 20) é o vermelho);
    `rampa` = tons do mais claro pro mais escuro. Cada pixel da família vai
    pro tom da rampa que corresponde à luz dele dentro da família, então a
    sombra e o brilho do sprite continuam. `lum` = (min, max) limita pela luz
    (0..1), pra separar um branco de um cinza, por exemplo."""
    import colorsys
    px = t.img.load()
    x0, y0, x1, y1 = caixa or (0, 0, t.lado, t.lado)
    a, b = hue

    def dentro(h):
        return a <= h <= b if a <= b else (h >= a or h <= b)

    achados = []
    for y in range(max(0, y0), min(t.lado, y1)):
        for x in range(max(0, x0), min(t.lado, x1)):
            c = px[x, y]
            if not c[3]:
                continue
            h, l, s = colorsys.rgb_to_hls(*(v / 255 for v in c[:3]))
            if s < sat_min or not dentro(h * 360):
                continue
            if lum and not (lum[0] <= l <= lum[1]):
                continue
            achados.append((x, y, l))
    if not achados:
        return 0
    ls = sorted({round(l, 3) for _, _, l in achados}, reverse=True)
    n = len(rampa)
    for x, y, l in achados:
        i = ls.index(round(l, 3))
        k = min(n - 1, int(i * n / max(1, len(ls))))
        px[x, y] = tuple(rampa[k]) + (255,)
    return len(achados)


def neutros(t, rampa, lum=(0.0, 1.0), sat_max=0.18, caixa=None):
    """como `tingir`, mas pros pixels SEM cor (brancos, cinzas): separados
    pela luz em `lum`. O contorno preto (luz < 0.1) nunca entra."""
    import colorsys
    px = t.img.load()
    x0, y0, x1, y1 = caixa or (0, 0, t.lado, t.lado)
    achados = []
    for y in range(max(0, y0), min(t.lado, y1)):
        for x in range(max(0, x0), min(t.lado, x1)):
            c = px[x, y]
            if not c[3]:
                continue
            h, l, s = colorsys.rgb_to_hls(*(v / 255 for v in c[:3]))
            if s > sat_max or l < 0.1 or not (lum[0] <= l <= lum[1]):
                continue
            achados.append((x, y, l))
    ls = sorted({round(l, 3) for _, _, l in achados}, reverse=True)
    for x, y, l in achados:
        i = ls.index(round(l, 3))
        k = min(len(rampa) - 1, int(i * len(rampa) / max(1, len(ls))))
        px[x, y] = tuple(rampa[k]) + (255,)
    return len(achados)
