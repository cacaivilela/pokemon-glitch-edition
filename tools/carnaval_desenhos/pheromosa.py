#!/usr/bin/env python3
"""PHEROMOSA DE CARNAVAL: destaque de carro alegórico.

Sai do 1º quadro da animação (tools/vinculo_desenhos/quadro.py), editado
pixel por pixel: o véu vira rosa tom por tom (o claro vira o rosa claro, a
dobra vira o rosa da dobra, o contorno fica), ganha paetê dourado, e atrás da
coroa abre um leque de plumas — cada pluma é a grade de pixels de PLUMA,
desenhada à mão, com o contorno e o brilho no estilo do sprite.

    python3 tools/carnaval_desenhos/pheromosa.py
"""
import os
import sys

AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(os.path.dirname(AQUI), "vinculo_desenhos"))
sys.path.insert(0, os.path.dirname(AQUI))
import quadro  # noqa: E402

RAIZ = os.path.dirname(os.path.dirname(AQUI))
SAIDA = os.path.join(RAIZ, "assets", "sprites", "pokemon", "carnaval", "pheromosa.png")

# a pluma, de cima pra baixo: K contorno, A a cor clara, a a escura, W o
# brilho, S a haste (o dourado do próprio sprite)
PLUMA = [
    "..KKK..",
    ".KAWAK.",
    "KAWAAaK",
    "KAWASaK",
    "KAASAaK",
    "KAASAaK",
    "KaASAaK",
    "KaASaaK",
    ".KaSaK.",
    ".KaSaK.",
    "..KSK..",
    "..KSK..",
    "..KSK..",
]
# as cores das plumas, da esquerda pra direita: (clara, escura)
ROSA, OURO, CIANO, VERDE = ((255, 106, 213), (208, 32, 122)), ((255, 228, 106), (248, 184, 0)), \
    ((106, 232, 255), (32, 144, 224)), ((125, 255, 122), (32, 176, 64))
# (x da base, y da ponta, cores, inclinação: quantos px pro lado por linha
# subida). Todas nascem atrás da coroa (BASE_Y) e abrem em leque.
LEQUE = [(41, 14, VERDE, -0.9), (44, 8, CIANO, -0.55), (47, 3, ROSA, -0.25), (49, 0, OURO, 0),
         (51, 3, ROSA, 0.25), (54, 8, CIANO, 0.55), (57, 14, VERDE, 0.9)]
BASE_Y = 28        # já contando os 15 px a mais de cima

K = (16, 16, 16)
VEU = {(210, 206, 196): (244, 184, 220), (191, 172, 157): (216, 128, 176)}   # claro e dobra
OURO_SPRITE, BRILHO = (249, 220, 57), (254, 254, 254)


def pluma(t, bx, topo, cores, inclina):
    """carimba uma pluma só onde está vazio (ela fica ATRÁS do bicho): a
    ponta em `topo`, a base em BASE_Y, as linhas do meio esticando"""
    mais = max(0, BASE_Y - topo - len(PLUMA))
    linhas = PLUMA[:6] + [PLUMA[6]] * mais + PLUMA[6:]
    pal = {"K": K, "A": cores[0], "a": cores[1], "W": BRILHO, "S": OURO_SPRITE}
    px = t.img.load()
    fundo = len(linhas)
    for dy, linha in enumerate(linhas):
        # a base fica presa atrás da coroa; quanto mais alto, mais pro lado
        desvio = round(inclina * (fundo - dy))
        for dx, ch in enumerate(linha):
            x, y = bx - 3 + dx + desvio, topo + dy
            if ch == "." or not (0 <= x < t.lado and 0 <= y < t.lado) or px[x, y][3]:
                continue
            px[x, y] = pal[ch] + (255,)


def desenhar():
    t = quadro.tela(795, minimo=112)          # 15 px a mais em cima, pras plumas
    sobe = t.lado - 97                        # o quanto o desenho desceu
    px = t.img.load()
    # o véu rosa, tom por tom
    for y in range(t.lado):
        for x in range(t.lado):
            c = px[x, y]
            if c[3] and c[:3] in VEU:
                px[x, y] = VEU[c[:3]] + (255,)
    # o paetê: um ponto dourado a cada tanto, só no claro do véu, com um
    # brilho branco do lado — não cai em cima de dobra nem de contorno
    for y in range(t.lado):
        for x in range(t.lado):
            if y % 4 or (x + y // 4 * 3) % 6:
                continue
            if px[x, y][:3] == VEU[(210, 206, 196)] and px[x, y][3]:
                px[x, y] = OURO_SPRITE + (255,)
                if x + 1 < t.lado and px[x + 1, y][:3] == VEU[(210, 206, 196)]:
                    px[x + 1, y] = BRILHO + (255,)
    # o leque de plumas atrás da coroa
    for bx, topo, cores, inclina in LEQUE:
        pluma(t, bx, topo + sobe - 15, cores, inclina)
    return t


if __name__ == "__main__":
    t = desenhar()
    os.makedirs(os.path.dirname(SAIDA), exist_ok=True)
    t.img.crop(t.img.getbbox()).save(SAIDA) if "--recorte" in sys.argv else t.img.save(SAIDA)
    print(SAIDA, t.img.size)
