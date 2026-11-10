"""PIDGEOT AERODACTYLITA (a MEGA EMPRESTADA, ideia do CAIO, nov/2026), editado
PIXEL POR PIXEL em cima do desenho do PIDGEOT: a crista e as penas do rabo
recoloridas tom por tom pros roxos da asa da MEGA AERODACTYL, a asa marrom vira
a pele cinza-roxa dela, e os espinhos de pedra são grades feitas à mão
(cada letra é um pixel).
    python3 tools/emprestadas/pidgeot.py
grava assets/fusoes/emprestadas/fus-pidgeot-megaaerodactyl.png (e _costas.png)
"""
import os
from PIL import Image

RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
ID = "fus-pidgeot-megaaerodactyl"

# os roxos e as pedras, tirados da MEGA AERODACTYL (10042.png)
ROXO = {
    (238, 98, 65): (174, 135, 226),   # e: a pena clara da crista
    (213, 49, 24): (151, 103, 210),   # g: a pena do meio
    (139, 57, 32): (121, 85, 159),    # f: a sombra da pena
}
RISCA = (87, 64, 109)                 # d dentro da crista: as riscas escuras
PELE = {
    (172, 123, 90): (149, 127, 160),  # h: a asa vira a pele dela
    (115, 82, 74): (121, 85, 159),    # a: a sombra da asa
}
PEDRA = {"K": (1, 1, 1), "G": (44, 46, 48), "M": (58, 62, 67), "L": (91, 99, 103), "W": (197, 191, 227)}

# OS ESPINHOS DE PEDRA, à mão. '.' = não mexe.
ESPINHO_GRANDE = [
    "........K",
    ".......KL",
    "......KLM",
    ".....KLMK",
    "....KLMGK",
    "...KLMGK.",
    "..KLMMGK.",
    ".KLMMGK..",
    "KMMMGK...",
    "KGGGK....",
]
ESPINHO_MEDIO = [
    "......K",
    ".....KL",
    "....KLM",
    "...KLMK",
    "..KLMGK",
    ".KMMGK.",
    "KGGGK..",
]
ESPINHO_CABECA = [   # pra cima, no alto da cabeça
    "...K...",
    "..KLK..",
    "..KLK..",
    ".KLMGK.",
    ".KLMGK.",
    "KLMMMGK",
]
# (grade, x, y) no quadro de 96x96 — o canto de cima à esquerda da grade
ESPINHOS = [
    (ESPINHO_CABECA, 31, 9),
    (ESPINHO_GRANDE, 50, 13),
    (ESPINHO_GRANDE, 56, 21),
    (ESPINHO_MEDIO, 59, 34),
    (ESPINHO_MEDIO, 63, 40),
]


# O BICO vira a BOCA DE PEDRA da MEGA AERODACTYL, aberta, com dentes (à mão;
# a grade começa em x=20, y=27)
BOCA = [
    "...bLLLMb.",
    "..bLLMMMGb",
    ".bLMMMGGGb",
    "bGbWbWbWbb",
    ".bRRRRRRb.",
    "..bWPWPb..",
    "...bMMGb..",
    "....bbb...",
]
BOCA_CORES = {"b": (16, 16, 16), "G": (44, 46, 48), "M": (58, 62, 67), "L": (91, 99, 103),
              "W": (250, 250, 250), "R": (131, 32, 65), "P": (217, 91, 107)}
# os ESPINHOS da ponta da asa (pra baixo) e o do fim do rabo (pra direita)
ESPINHO_BAIXO = [
    "KLMK",
    "KLMK",
    ".KMK",
    ".KK.",
    ".K..",
]
ESPINHO_RABO = [
    "KKK...",
    "KLMMK.",
    "KMMGGK",
    "KGGK..",
]


def vizinhos(x, y):
    return ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1))


def mancha(px, w, h, semente, cores, caixa=None):
    """os pixels ligados à semente que têm uma dessas cores"""
    vistos, pilha = set(), [semente]
    while pilha:
        x, y = pilha.pop()
        if (x, y) in vistos or not (0 <= x < w and 0 <= y < h):
            continue
        if caixa and not (caixa[0] <= x <= caixa[2] and caixa[1] <= y <= caixa[3]):
            continue
        if px[x, y][3] == 0 or px[x, y][:3] not in cores:
            continue
        vistos.add((x, y))
        pilha.extend(vizinhos(x, y))
    return vistos


def pinta(px, grade, x0, y0):
    for j, linha in enumerate(grade):
        for i, ch in enumerate(linha):
            if ch != ".":
                px[x0 + i, y0 + j] = PEDRA[ch] + (255,)


def frente():
    im = Image.open(os.path.join(RAIZ, "assets/sprites/pokemon/018.png")).convert("RGBA")
    w, h = im.size
    px = im.load()
    # a crista: tudo de pena ligado a um pixel do meio dela (o contorno preto separa do corpo)
    pena = set(ROXO) | {(230, 180, 98)}
    crista = mancha(px, w, h, (19 + 30, 30), pena)
    for (x, y) in crista:
        c = px[x, y][:3]
        px[x, y] = ROXO.get(c, RISCA) + (255,)
    # as penas vermelhas do rabo (lá embaixo) também
    for y in range(h):
        for x in range(w):
            c = px[x, y][:3]
            if px[x, y][3] and c in ROXO:
                px[x, y] = ROXO[c] + (255,)
    # a asa marrom vira a pele da MEGA AERODACTYL
    asa = mancha(px, w, h, (19 + 25, 40), set(PELE), caixa=(19 + 15, 34, 19 + 42, 60))
    # e o marrom atrás da cabeça, em cima da asa
    asa |= mancha(px, w, h, (19 + 18, 25), set(PELE), caixa=(19 + 14, 22, 19 + 24, 33))
    for (x, y) in asa:
        px[x, y] = PELE[px[x, y][:3]] + (255,)
    for g, x, y in ESPINHOS:
        pinta(px, g, x, y)
    for j, linha in enumerate(BOCA):
        for i, ch in enumerate(linha):
            if ch != ".":
                px[20 + i, 27 + j] = BOCA_CORES[ch] + (255,)
    pinta(px, ESPINHO_BAIXO, 41, 57)
    pinta(px, ESPINHO_BAIXO, 37, 55)
    pinta(px, ESPINHO_RABO, 60, 69)
    return im


def costas():
    im = Image.open(os.path.join(RAIZ, "assets/sprites/pokemon/back/018.png")).convert("RGBA")
    px = im.load()
    for y in range(im.height):
        for x in range(im.width):
            c = px[x, y][:3]
            if px[x, y][3] and c in ROXO:
                px[x, y] = ROXO[c] + (255,)
            elif px[x, y][3] and c in PELE:
                px[x, y] = PELE[c] + (255,)
    return im


if __name__ == "__main__":
    pasta = os.path.join(RAIZ, "assets/fusoes/emprestadas")
    os.makedirs(pasta, exist_ok=True)
    frente().save(os.path.join(pasta, ID + ".png"))
    costas().save(os.path.join(pasta, ID + "_costas.png"))
    print("ok", ID)
