#!/usr/bin/env python3
"""A ANIMAÇÃO DO ZYGARDE 200%, quadro a quadro: ele ARRANHA O AR (um braço,
depois o outro), PULA, solta três disparos do núcleo do peito e CORTA OS
PRÓPRIOS DISPAROS no ar antes de cair.

Cada quadro é montado com as partes do desenho (assets/sprites/pokemon/
zygarde200.png, a base do CAIO com o acabamento — o azul do peito é a boca e
o ponto branco dentro dela é o NÚCLEO BRANCO, de onde saem os disparos; o
vermelho é do NÚCLEO VERMELHO (Z1) e o azul, do NÚCLEO AZUL (Z2)): os dois braços recortados
inteiros e postos em outra pose (pra cima, com as garras pro alto; ou
descendo no golpe), o corpo inteiro subindo no pulo e agachando na queda. Os
EFEITOS — os riscos de garra, os três disparos (um de cada núcleo: branco,
azul e vermelho), os disparos partidos e as faíscas —
são grades de pixels desenhadas aqui.

    python3 tools/anima_zygarde200.py            # grava anim/u/zygarde200.png e o índice
    python3 tools/anima_zygarde200.py --costas   # a DE COSTAS (back/zygarde200.png -> anim/back/u/)
"""
import json
import os
import sys
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# de costas (o desenho de tools/costas_zygarde200.py) o núcleo não aparece: os
# disparos saem da frente dele, e o brilho do peito fica escondido
COSTAS = "--costas" in sys.argv
SRC = os.path.join(ROOT, "assets", "sprites", "pokemon", *(["back"] if COSTAS else []), "zygarde200.png")
OUT = os.path.join(ROOT, "assets", "sprites", "pokemon", "anim")
INDICE = os.path.join(OUT, "quadros.json")
CHAVE = "u/zygarde200"
W, H, TOPO = 96, 114, 18          # a folha tem espaço em cima pro pulo
COLUNAS = 16

CORES = {"w": "#fefefe", "c": "#6ae8ff", "C": "#2a9ac8", "h": "#afcf4f", "H": "#d8ec8a", "G": "#7f9f1f", "y": "#ffe46a"}
# OS TRÊS DISPAROS, um de cada núcleo: o de cima é do NÚCLEO BRANCO, o da
# esquerda do NÚCLEO AZUL (Z2, o lado da capa azul) e o da direita do NÚCLEO
# VERMELHO (Z1, o lado da capa vermelha). Nos desenhos dos disparos e das
# faíscas, "a" é a beirada e "b" o meio, na cor do núcleo daquele disparo.
NUCLEOS = {
    "branco": {"a": "#b8c8d8", "b": "#e8f0ff"},
    "azul": {"a": "#3e51a8", "b": "#8ab4f0"},
    "vermelho": {"a": "#a82430", "b": "#ff7a7e"},
}

# --------------------------------------------------------------- os efeitos
DISPARO = [
    "..aba..",
    ".abbba.",
    "abbwbba",
    "bbwwwbb",
    "abbwbba",
    ".abbba.",
    "..aba..",
]
METADE_ESQ = ["..ab", ".abb", "abbw", "bbww", "abbw", ".abb", "..ab"]
METADE_DIR = ["a..", "ba.", "wba", "wbb", "wba", "ba.", "a.."]
FAISCA = ["..w..", ".wbw.", "wbbbw", ".wbw.", "..w.."]
FAISCA_PEQ = [".w.", "wbw", ".w."]
# um risco de garra: da ponta de cima à direita pra de baixo à esquerda
RISCO = [
    "........................cw",
    "......................cww.",
    "....................cwww..",
    "..................cwww....",
    "...............ccwww......",
    "............ccwww.........",
    ".........ccwww............",
    "......ccwww...............",
    "....cwww..................",
    "..cwww....................",
    ".cww......................",
    "cw........................",
]
RISCO_FRACO = [l.replace("w", "c") for l in RISCO]
# o brilho do núcleo quando ele dispara (em volta do branco do peito)
BRILHO = [
    "....cccccc....",
    "..cc......cc..",
    ".c..........c.",
    "c............c",
    "c............c",
    "c............c",
    "c............c",
    ".c..........c.",
    "..cc......cc..",
    "....cccccc....",
]


def grade(q, g, x, y, espelha=False, nucleo=None):
    px = q.load()
    cores = {**CORES, **NUCLEOS.get(nucleo, NUCLEOS["branco"])}
    for j, linha in enumerate(g):
        if espelha:
            linha = linha[::-1]
        for i, ch in enumerate(linha):
            if ch == ".":
                continue
            a, b = x + i, y + j
            if 0 <= a < W and 0 <= b < H:
                h = cores[ch]
                px[a, b] = (int(h[1:3], 16), int(h[3:5], 16), int(h[5:7], 16), 255)


# --------------------------------------------------------------- as partes
def partes():
    im = Image.open(SRC).convert("RGBA")
    corpo = im.copy()
    esq = Image.new("RGBA", im.size, (0, 0, 0, 0))
    dir_ = Image.new("RGBA", im.size, (0, 0, 0, 0))
    p, pc, pe, pd = im.load(), corpo.load(), esq.load(), dir_.load()
    # os braços ficam fora do corpo, dos dois lados (x até 23, linhas 32 a 63)
    for y in range(32, 64):
        for x in range(0, 24):
            if x >= 22 and y < 55:
                continue                     # o ombro verde é do corpo
            if p[x, y][3]:
                pe[x, y] = p[x, y]; pc[x, y] = (0, 0, 0, 0)
            xd = 95 - x
            if p[xd, y][3]:
                pd[xd, y] = p[xd, y]; pc[xd, y] = (0, 0, 0, 0)
    caixa_e = esq.crop((0, 32, 24, 64))
    caixa_d = dir_.crop((72, 32, 96, 64))
    return corpo, caixa_e, caixa_d


def montar(corpo, be, bd, *, dy=0, agacha=0, pose_e="baixo", pose_d="baixo"):
    """um quadro: o corpo (subindo `dy` no pulo, agachando `agacha` na queda) e
    cada braço na pose dele: 'baixo' (onde o CAIO desenhou), 'cima' (virado,
    garras pro alto) ou 'golpe' (descendo, mais pra dentro)."""
    q = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    oy = TOPO - dy
    if agacha:
        q.alpha_composite(corpo.crop((0, 70, 96, 96)), (0, oy + 70))          # as pernas no chão
        q.alpha_composite(corpo.crop((0, 0, 96, 70)), (0, oy + agacha))       # o resto desce
    else:
        q.alpha_composite(corpo, (0, oy))
    for bloco, pose, x0 in ((be, pose_e, 0), (bd, pose_d, 72)):
        lado = 1 if x0 == 0 else -1          # pra dentro: + na esquerda, - na direita
        if pose == "baixo":
            q.alpha_composite(bloco, (x0, oy + 32 + agacha))
        elif pose == "cima":
            q.alpha_composite(bloco.transpose(Image.FLIP_TOP_BOTTOM), (x0 + 2 * lado, oy + 15 + agacha))
        elif pose == "golpe":
            q.alpha_composite(bloco, (x0 + 4 * lado, oy + 37 + agacha))
    return q


def quadros():
    corpo, be, bd = partes()
    fs = []   # (quadro, ms)

    def add(q, ms):
        fs.append((q, ms))

    # 1) parado, pronto
    add(montar(corpo, be, bd), 200)
    # 2) ARRANHA O AR: o braço da direita sobe, desce cortando (os riscos), e
    #    depois o da esquerda
    for lado in ("d", "e"):
        kw = (lambda p: {"pose_d": p}) if lado == "d" else (lambda p: {"pose_e": p})
        esp = lado == "e"
        add(montar(corpo, be, bd, **kw("cima")), 110)
        q = montar(corpo, be, bd, **kw("golpe"))
        x = 62 if lado == "d" else 8
        for k in range(3):
            grade(q, RISCO, x + (-k if esp else k) * 3, TOPO + 16 + k * 5, espelha=esp)
        add(q, 70)
        q = montar(corpo, be, bd, **kw("golpe"))
        for k in range(3):
            grade(q, RISCO_FRACO, x + (-k if esp else k) * 3, TOPO + 19 + k * 5, espelha=esp)
        add(q, 70)
        add(montar(corpo, be, bd), 90)
    # 3) O PULO: agacha, sobe com os dois braços pro alto, e lá em cima o
    #    núcleo acende e solta os três disparos
    add(montar(corpo, be, bd, agacha=3), 110)
    add(montar(corpo, be, bd, dy=8, pose_e="cima", pose_d="cima"), 70)
    q = montar(corpo, be, bd, dy=14, pose_e="cima", pose_d="cima")
    if not COSTAS:
        grade(q, BRILHO, 41, TOPO - 14 + 35)
    add(q, 80)
    # os disparos saem do peito (x 46, y 39 no desenho) pra cima e pros lados
    rumos = [(-38, -16), (0, -38), (38, -16)]
    nucleo = {(-38, -16): "azul", (0, -38): "branco", (38, -16): "vermelho"}
    if COSTAS:   # de trás o lado azul (Z2) fica na direita e o vermelho (Z1) na esquerda
        nucleo = {(-38, -16): "vermelho", (0, -38): "branco", (38, -16): "azul"}
    for passo, dy in ((0.45, 16), (1.0, 17)):
        q = montar(corpo, be, bd, dy=dy, pose_e="cima", pose_d="cima")
        if passo < 1 and not COSTAS:
            grade(q, BRILHO, 41, TOPO - dy + 35)
        for rx, ry in rumos:
            grade(q, DISPARO, 45 + int(rx * passo), TOPO - dy + 36 + int(ry * passo), nucleo=nucleo[(rx, ry)])
        add(q, 80)
    # 4) OS DISPAROS VOLTAM e ele corta cada um: o braço desce no golpe, o
    #    risco passa em cima do disparo e ele se parte em dois, com faísca
    cortes = [("d", rumos[2]), ("e", rumos[0]), ("d", rumos[1])]
    vivos = list(rumos)
    dy = 16
    for i, (lado, alvo) in enumerate(cortes):
        kw = {"pose_d": "golpe", "pose_e": "cima"} if lado == "d" else {"pose_e": "golpe", "pose_d": "cima"}
        if i == 2:
            kw = {"pose_d": "golpe", "pose_e": "golpe"}
        # o quadro do braço subindo pro golpe, com os disparos chegando perto
        q = montar(corpo, be, bd, dy=dy, **{k: "cima" for k in kw})
        for rx, ry in vivos:
            grade(q, DISPARO, 45 + int(rx * 0.8), TOPO - dy + 36 + int(ry * 0.8), nucleo=nucleo[(rx, ry)])
        add(q, 70)
        # o corte
        vivos.remove(alvo)
        q = montar(corpo, be, bd, dy=dy, **kw)
        for rx, ry in vivos:
            grade(q, DISPARO, 45 + int(rx * 0.75), TOPO - dy + 36 + int(ry * 0.75), nucleo=nucleo[(rx, ry)])
        ax, ay = 45 + int(alvo[0] * 0.75), TOPO - dy + 36 + int(alvo[1] * 0.75)
        grade(q, RISCO, ax - 10, ay - 3, espelha=(lado == "e"))
        n = nucleo[alvo]
        grade(q, METADE_ESQ, ax - 2, ay, nucleo=n)
        grade(q, METADE_DIR, ax + 5, ay, nucleo=n)
        grade(q, FAISCA, ax + 1, ay - 6, nucleo=n)
        add(q, 80)
        # as metades se afastando e as faíscas
        q = montar(corpo, be, bd, dy=dy - 2, **kw)
        for rx, ry in vivos:
            grade(q, DISPARO, 45 + int(rx * 0.7), TOPO - dy + 2 + 36 + int(ry * 0.7), nucleo=nucleo[(rx, ry)])
        grade(q, METADE_ESQ, ax - 7, ay + 4, nucleo=n)
        grade(q, METADE_DIR, ax + 10, ay + 4, nucleo=n)
        grade(q, FAISCA_PEQ, ax - 3, ay - 5, nucleo=n); grade(q, FAISCA_PEQ, ax + 7, ay - 7, nucleo=n)
        grade(q, FAISCA, ax + 1, ay + 7, nucleo=n)
        add(q, 80)
        dy -= 4
    # 5) A QUEDA: agacha no chão e volta a ficar parado
    add(montar(corpo, be, bd, agacha=3), 110)
    add(montar(corpo, be, bd, agacha=1), 90)
    add(montar(corpo, be, bd), 400)
    return fs


def salvar(fs):
    qs = [q for q, _ in fs]
    caixa = None
    for q in qs:
        b = q.getbbox()
        if b:
            caixa = b if not caixa else (min(caixa[0], b[0]), min(caixa[1], b[1]), max(caixa[2], b[2]), max(caixa[3], b[3]))
    qs = [q.crop(caixa) for q in qs]
    w, h = qs[0].size
    col = min(COLUNAS, len(qs))
    lin = (len(qs) + col - 1) // col
    folha = Image.new("RGBA", (w * col, h * lin), (0, 0, 0, 0))
    for i, q in enumerate(qs):
        folha.paste(q, ((i % col) * w, (i // col) * h))
    pasta = os.path.join(OUT, "back") if COSTAS else OUT
    os.makedirs(os.path.join(pasta, "u"), exist_ok=True)
    folha.save(os.path.join(pasta, CHAVE + ".png"), optimize=True)
    with open(INDICE, encoding="utf-8") as f:
        idx = json.load(f)
    e = idx.get(CHAVE, {})
    e["c" if COSTAS else "f"] = [w, h, col, [ms for _, ms in fs]]
    e.pop("gerado", None)
    e["feito"] = 1
    idx[CHAVE] = e
    with open(INDICE, "w", encoding="utf-8") as f:
        json.dump(idx, f, separators=(",", ":"), sort_keys=True)
    return qs, w, h


if __name__ == "__main__":
    qs, w, h = salvar(quadros())
    print(f"{len(qs)} quadros de {w}x{h}")
