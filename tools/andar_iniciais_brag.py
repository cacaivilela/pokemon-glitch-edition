"""O ANDAR DOS 9 INICIAIS DE BRAGLITCH (o CAIO, nov/2026: "faz os 9 iniciais de
braglitch" — DIGGLE, BRASEAGLE, MAGMASTIM, TILAPISH, TILAPISCO, TILAPIRAÇU,
TRONKY, TRONCUDO e PAUBRASILISCO).

Eles não existem no Mystery Dungeon, então o andar sai do desenho de batalha
deles (assets/sprites/pokemon/<nº>.png e back/<nº>.png):

  - O TAMANHO: o desenho de 64 encolhe pro tamanho do mapa (o 1º estágio menor,
    o 3º maior) sem borrar: cada pixel novo é a cor que MAIS aparece no
    pedaço do original que ele cobre (no empate, a mais escura: o contorno
    não some), e só fica cheio se metade do pedaço era cheia.
  - AS DIREÇÕES: pra baixo é a frente; pra cima são as costas; pro lado é a
    frente (os desenhos de batalha já olham pra esquerda) e a direita é o
    espelho dela.
  - O PASSO, em 4 quadros (parado, um pé, parado, o outro): no quadro do pé o
    corpo sobe 1 pixel e só o pé daquele lado sobe junto (o outro fica
    plantado no chão). Os peixes dão um pulinho maior (eles "nadam" no chão).
  - O QUE MEXE SOZINHO: o FOGO dos cachorros tremula (as cores do fogo giram
    de um quadro pro outro) e as FRUTINHAS das árvores piscam.

Rodar: python3 tools/andar_iniciais_brag.py   (grava andar/<nº>.png e o andar.json)
"""
import json
import os
from collections import Counter
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SPR = os.path.join(ROOT, "assets", "sprites", "pokemon")
ANDAR = os.path.join(SPR, "andar")

# nº, tamanho final (o lado maior do desenho), família
INICIAIS = [
    (1029, 27, "fogo"), (1035, 30, "fogo"), (1036, 33, "fogo"),
    (1030, 24, "peixe"), (1037, 28, "peixe"), (1038, 32, "peixe"),
    (1031, 26, "arvore"), (1033, 30, "arvore"), (1034, 32, "lobo"),
]
TEMPO = 150     # ms por quadro


def encolher(im, lado):
    """o desenho (cortado no que tem) com o lado maior = `lado`, pela cor que mais aparece"""
    im = im.crop(im.getbbox())
    W, H = im.size
    k = lado / max(W, H)
    nw, nh = max(1, round(W * k)), max(1, round(H * k))
    p = im.load()
    out = Image.new("RGBA", (nw, nh), (0, 0, 0, 0))
    po = out.load()
    for y in range(nh):
        for x in range(nw):
            x0, x1 = int(x / k), max(int(x / k) + 1, int((x + 1) / k))
            y0, y1 = int(y / k), max(int(y / k) + 1, int((y + 1) / k))
            cs, total = [], 0
            for yy in range(y0, min(y1, H)):
                for xx in range(x0, min(x1, W)):
                    total += 1
                    if p[xx, yy][3] > 0:
                        cs.append(p[xx, yy][:3])
            if not cs or len(cs) * 2 < total:
                continue
            cont = Counter(cs)
            top = max(cont.values())
            # no empate, a mais escura (o contorno preto ganha da pelagem)
            cor = min((c for c, n in cont.items() if n == top), key=lambda c: c[0] * 3 + c[1] * 6 + c[2])
            # um pedaço com contorno ESCURO em boa parte vira contorno
            escuro = [c for c in cs if c[0] * 3 + c[1] * 6 + c[2] < 300]
            if len(escuro) * 2 > len(cs) and cor not in escuro:
                cor = Counter(escuro).most_common(1)[0][0]
            po[x, y] = cor + (255,)
    return out


def fogo(c):
    r, g, b = c
    # o laranja e o amarelo do fogo: vermelho no máximo e pouco azul (o pelo
    # caramelo, 206,140,70, e a língua, 230,90,110, ficam de fora)
    return r >= 250 and 90 <= g and b <= 95


def fruta(c):
    r, g, b = c
    return r > 200 and g > 180 and b < 90         # o amarelo das frutinhas


def girar_fogo(im, i):
    """o fogo tremula: cada pixel de fogo troca de tom conforme o quadro"""
    p = im.load()
    TONS = [(255, 228, 64), (255, 170, 40), (240, 110, 30)]
    for y in range(im.height):
        for x in range(im.width):
            c = p[x, y]
            if c[3] and fogo(c[:3]):
                lum = c[0] + c[1]
                k = 0 if lum > 440 else 1 if lum > 360 else 2
                p[x, y] = TONS[(k + i + (y // 2)) % 3] + (255,)


def piscar_fruta(im, i):
    p = im.load()
    for y in range(im.height):
        for x in range(im.width):
            c = p[x, y]
            if c[3] and fruta(c[:3]) and (x + y + i) % 4 == 0:
                p[x, y] = (255, 255, 220, 255)


def passo(base, i, lado_frente, pulo):
    """o quadro `i` do passo (0 parado, 1 um pé, 2 parado, 3 o outro).
    `lado_frente`: no desenho de lado, o pé da frente é o da esquerda"""
    W, H = base.size
    out = Image.new("RGBA", (W, H + 2), (0, 0, 0, 0))
    if i in (0, 2):
        out.alpha_composite(base, (0, 2))
        return out
    sobe = 1 + pulo
    faixa = max(2, H // 5)                     # os pés: a faixa de baixo do desenho
    corpo = base.crop((0, 0, W, H - faixa))
    pes = base.crop((0, H - faixa, W, H))
    meio = W // 2
    esq, dir_ = pes.crop((0, 0, meio, faixa)), pes.crop((meio, 0, W, faixa))
    out.alpha_composite(corpo, (0, 2 - sobe))
    levanta_esq = (i == 1) == lado_frente
    # o pé que sobe vai junto com o corpo; o outro fica plantado
    out.alpha_composite(esq, (0, H - faixa + 2 - (sobe if levanta_esq else 0)))
    out.alpha_composite(dir_, (meio, H - faixa + 2 - (0 if levanta_esq else sobe)))
    # o buraco entre o corpo (que subiu) e o pé plantado: a última fileira do
    # corpo desce e tapa (a perna fica um tiquinho mais comprida, como no passo)
    po, pc = out.load(), corpo.load()
    fim = H - faixa + 2 - sobe              # a primeira fileira depois do corpo
    for x in range(W):
        if pc[x, corpo.height - 1][3] == 0:
            continue
        for y in range(fim, fim + sobe):
            if 0 <= y < out.height and po[x, y][3] == 0:
                po[x, y] = pc[x, corpo.height - 1]
    return out


def main():
    indice_p = os.path.join(ANDAR, "andar.json")
    indice = json.load(open(indice_p, encoding="utf-8"))
    for dex, lado, fam in INICIAIS:
        frente = encolher(Image.open(os.path.join(SPR, f"{dex}.png")).convert("RGBA"), lado)
        costas = encolher(Image.open(os.path.join(SPR, "back", f"{dex}.png")).convert("RGBA"), lado)
        vistas = [frente, costas, frente, frente.transpose(Image.FLIP_LEFT_RIGHT)]   # baixo, cima, esq, dir
        pulo = 1 if fam == "peixe" else 0
        W = max(v.width for v in vistas) + 2
        H = max(v.height for v in vistas) + 4
        folha = Image.new("RGBA", (W * 4, H * 4), (0, 0, 0, 0))
        for j, v in enumerate(vistas):
            for i in range(4):
                q = passo(v, i, j != 3, pulo)
                if fam == "fogo":
                    girar_fogo(q, i)
                if fam in ("arvore", "lobo"):
                    piscar_fruta(q, i)
                folha.alpha_composite(q, (i * W + (W - q.width) // 2, j * H + (H - q.height)))
        folha.save(os.path.join(ANDAR, f"{dex}.png"))
        indice[str(dex)] = [W, H, 4, [TEMPO] * 4]
        print(dex, fam, W, H)
    with open(indice_p, "w", encoding="utf-8") as f:
        json.dump(indice, f, separators=(",", ":"), sort_keys=True)


if __name__ == "__main__":
    main()
