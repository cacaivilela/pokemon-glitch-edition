"""As peças comuns do ANDAR DE BRAGLITCH desenhado do zero (tools/andar_brag/<nome>.py).

Cada Pokémon traz FRENTE, COSTAS e LADO (grades de letras, uma letra = um
pixel), as CORES de cada letra e onde ficam as patas. Daqui sai a folha que o
jogo lê (assets/sprites/pokemon/andar/<nº>.png, 4 linhas: baixo, cima,
esquerda, direita; 4 quadros cada) e a linha do andar.json.

O PASSO (4 quadros: parado, um pé, parado, o outro):
  - de FRENTE e de COSTAS: o corpo sobe 1 pixel e a pata de um lado sobe
    junto (levantada); a do outro lado fica plantada e estica 1 pixel;
  - de LADO: o corpo sobe 1 pixel, a pata da FRENTE vai 1 pixel pra frente e a
    de TRÁS 1 pixel pra trás; no outro quadro, ao contrário;
  - o que é FOGO (`fogo`: pares de letras) troca de cor nos quadros do pé:
    ele tremula enquanto anda.
"""
import json
import os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
ANDAR = os.path.join(ROOT, "assets", "sprites", "pokemon", "andar")


def grade(linhas):
    """letras -> {(x, y): letra}"""
    return {(x, y): ch for y, l in enumerate(linhas) for x, ch in enumerate(l) if ch != "."}


def inicio_das_patas(g, cols):
    """a primeira fileira onde só tem pata (abaixo do corpo) nas colunas dadas.
    `cols` pode trazer essa fileira escrita à mão no 3º lugar: ((..), (..), fileira)"""
    if len(cols) > 2:
        return cols[2]
    ys = sorted({y for (x, y) in g})
    fim = max(ys)
    for y in range(fim, -1, -1):
        linha = [x for (x, yy) in g if yy == y]
        if linha and any(not any(a <= x < b for a, b in cols) for x in linha):
            return y + 1
    return fim


def quadro_frente(g, cols, i, fogo):
    """i: 0..3. `cols`: ((x0, x1) da pata da esquerda, (x0, x1) da da direita)"""
    if i in (0, 2):
        out = dict(g)
    else:
        p0 = inicio_das_patas(g, cols)
        sobe = cols[0] if i == 1 else cols[1]
        out = {}
        planta0 = cols[1] if i == 1 else cols[0]
        for (x, y), ch in g.items():
            # só a pata plantada fica no chão; o resto (o corpo, a barriga entre
            # as patas e a pata levantada) sobe
            plantada = y >= p0 and planta0[0] <= x < planta0[1]
            if not plantada:
                out[(x, y - 1)] = ch              # o corpo (e a pata levantada) sobe
            else:
                out[(x, y)] = ch                  # a pata plantada fica
        # a perna plantada estica: a fileira de cima dela desce pra tapar o buraco
        planta = cols[1] if i == 1 else cols[0]
        for x in range(planta[0], planta[1]):
            if (x, p0) in g and (x, p0 - 1) not in out:
                out[(x, p0 - 1)] = g[(x, p0)]
    return trocar_fogo(out, fogo) if i in (1, 3) else out


def quadro_lado(g, cols, i, fogo):
    """`cols`: ((x0, x1) da pata da frente, (x0, x1) da de trás) — virado pra esquerda"""
    if i in (0, 2):
        out = dict(g)
    else:
        p0 = inicio_das_patas(g, cols)
        frente, tras = cols[0], cols[1]
        anda = -1 if i == 1 else 1                # a da frente vai pra frente (esquerda) no 1
        out = {}
        for (x, y), ch in g.items():
            if y < p0:
                out[(x, y - 1)] = ch                  # o corpo sobe
            elif frente[0] <= x < frente[1]:
                out[(x + anda, y)] = ch               # as patas ficam no chão, um passo pro lado
            elif tras[0] <= x < tras[1]:
                out[(x - anda, y)] = ch
            else:
                out[(x, y - 1)] = ch                  # a barriga entre as patas sobe com o corpo
        # a perna estica até o corpo, que subiu: a fileira de cima da pata sobe 1
        for x in {x for (x, y) in out if y == p0}:
            if (x, p0 - 1) not in out:
                out[(x, p0 - 1)] = out[(x, p0)]
    return trocar_fogo(out, fogo) if i in (1, 3) else out


def quadro_pulo(g, cols, i, fogo):
    """quem não tem perna (fruta, flor, peixe) anda PULANDO: no quadro 1 sobe 2
    pixels, no 3 sobe 1; no 0 e no 2 está no chão, um tiquinho achatado (uma
    fileira perto de baixo some e o que está em cima desce: ele "senta" no pulo)"""
    if i in (1, 3):
        sobe = 2 if i == 1 else 1
        return trocar_fogo({(x, y - sobe): ch for (x, y), ch in g.items()}, fogo)
    if i == 2:
        return dict(g)
    ys = sorted({y for (_, y) in g})
    meio = ys[(len(ys) * 3) // 4]          # perto de baixo (no meio ficam os olhos)
    return {(x, y + 1 if y < meio else y): ch for (x, y), ch in g.items() if y != meio or (x, y - 1) not in g}


def trocar_fogo(g, fogo):
    troca = {}
    for a, b in fogo:
        troca[a], troca[b] = b, a
    return {p: troca.get(ch, ch) for p, ch in g.items()}


def imagem(g, cores, w, h, espelha=False):
    im = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    for (x, y), ch in g.items():
        xx = w - 1 - x if espelha else x
        yy = y + 2                                 # 2 pixels de folga em cima (o corpo sobe no passo/pulo)
        if 0 <= xx < w and 0 <= yy < h:
            im.putpixel((xx, yy), cores[ch] + (255,))
    return im


def salvar(dex, frente, costas, lado, cores, patas_frente, patas_lado, fogo=(), tempo=150, previa=None, pulo=False):
    # as linhas mais curtas ganham vazio no fim (todas da mesma largura)
    larg = max(len(l) for l in frente + costas + lado)
    frente, costas, lado = ([l.ljust(larg, ".") for l in g] for g in (frente, costas, lado))
    fq, lq = (quadro_pulo, quadro_pulo) if pulo else (quadro_frente, quadro_lado)
    vistas = [(grade(frente), patas_frente, fq, False),
              (grade(costas), patas_frente, fq, False),
              (grade(lado), patas_lado, lq, False),
              (grade(lado), patas_lado, lq, True)]
    w = max(len(l) for l in frente + costas + lado)
    h = max(len(frente), len(costas), len(lado)) + 2
    folha = Image.new("RGBA", (w * 4, h * 4), (0, 0, 0, 0))
    for j, (g, cols, fn, esp) in enumerate(vistas):
        for i in range(4):
            folha.alpha_composite(imagem(fn(g, cols, i, fogo), cores, w, h, esp), (i * w, j * h))
    folha.save(os.path.join(ANDAR, f"{dex}.png"))
    indice_p = os.path.join(ANDAR, "andar.json")
    indice = json.load(open(indice_p, encoding="utf-8"))
    indice[str(dex)] = [w, h, 4, [tempo] * 4]
    with open(indice_p, "w", encoding="utf-8") as f:
        json.dump(indice, f, separators=(",", ":"), sort_keys=True)
    if previa:
        folha.resize((folha.width * 6, folha.height * 6), Image.NEAREST).save(previa)
    return folha
