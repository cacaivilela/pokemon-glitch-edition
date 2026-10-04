#!/usr/bin/env python3
"""A PROFA. IPÊ (antes ela usava a `tecnica`).

O corpo sai do PROF. CARVALHO do FireRed (assets/sprites/overworld/prof.png):
jaleco, braços e o balanço do andar são os dele, que já estão no nível do
jogo. Por cima vai a cabeça dela, desenhada aqui, e as cores trocadas: a
camisa vermelha vira a blusa amarela do ipê, o jaleco vira verde, o
sapato vira tênis preto, a pele e o
cabelo são os dela. Coque castanho com a flor azul e óculos dourados.

Folha: 4 colunas x 3 linhas de 16x32 (baixo, cima, esquerda; a direita é a
esquerda espelhada). Colunas 0 e 2 paradas, 1 e 3 os passos (1 px abaixo).

    python3 tools/sprite_ipe.py      -> assets/sprites/overworld/ipe.png
"""
import os
from PIL import Image

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OW = os.path.join(RAIZ, "assets", "sprites", "overworld")

# a cabeça
PAL = {
    "K": (16, 10, 10),      # contorno (o preto do FireRed puxado pro marrom)
    "D": (62, 32, 22),      # cabelo, sombra
    "H": (98, 54, 34),      # cabelo
    "h": (146, 90, 56),     # cabelo, brilho
    "F": (96, 168, 248),    # a flor no cabelo, azul
    "f": (40, 88, 192),     # flor, miolo e sombra
    "S": (240, 184, 136),   # pele
    "s": (208, 144, 100),   # pele, sombra
    "c": (123, 65, 65),     # contorno do rosto (o marrom-avermelhado do FireRed)
    "r": (236, 136, 120),   # bochecha
    "E": (36, 22, 26),      # olho
    "O": (216, 172, 56),    # armação dourada dos óculos
}

# as cores do CARVALHO que mudam no corpo
PELE = {
    (255, 213, 180): (240, 184, 136),
    (246, 189, 148): (224, 164, 118),
    (222, 148, 115): (208, 144, 100),
    (123, 65, 65): (112, 60, 44),
}
BLUSA = {
    (230, 106, 74): (244, 190, 44),     # camisa vermelha -> blusa amarela
    (148, 57, 41): (190, 124, 22),
}
CABELO = {                                # o que sobra de cabelo dele, embaixo
    (205, 172, 98): PAL["h"],
    (123, 115, 65): PAL["H"],
    (57, 57, 24): PAL["D"],
}
TENIS = {                                 # da linha PERNA pra baixo, o oliva dele é o tênis preto dela
    (123, 115, 65): (52, 52, 60),
    (57, 57, 24): (20, 20, 24),
    (205, 172, 98): (96, 96, 108),
}
JALECO = {                                # o jaleco branco dele vira o verde dela
    (255, 255, 255): (140, 210, 124),
    (197, 197, 213): (92, 168, 96),
    (139, 139, 148): (56, 124, 72),
    (74, 74, 90): (30, 78, 48),
}
PERNA = 27

# ---- as cabeças: da linha TOPO até onde o corpo dele começa ----
BAIXO = [
    ".....KKKKK.KK...",
    "....KhHHHKKFFK..",
    "..KKKHHHHHKFfFK.",
    ".KhhHHHHHHDKFK..",
    ".KhHHHHHHHHHDK..",
    ".KHhHHhHHHHHDK..",
    ".KHSHSSSSSHSDK..",
    ".KHSSESSSESSDK..",
    ".KHSSESSSESSDK..",
    ".KHrSSSSSSSrDK..",
    "..KHSSScSSSDK...",
    "...KcSSSSScK....",
]
CIMA = [
    "...KK.KKKKK.....",
    "..KFFKKhHHHK....",
    ".KFfFKHHHHHKKK..",
    "..KFKHhhHHHHDK..",
    ".KHHhHHHHHHHDK..",
    ".KHhHHHHHHHHDK..",
    ".KHHHHHHHHHHDK..",
    ".KHHHHHHHHHDDK..",
    ".KsHHHHHHHHDsK..",
    "..KHHHHHHHHDK...",
    "...KKHHHHHKK....",
    ".....KsSSsK.....",
]
LADO = [
    ".......KKKK.....",
    "......KhHHHK....",
    "....KKKHHHHKKK..",
    "...KhhHHHHHKFFK.",
    "..KhHHHHHHDKFfFK",
    "..KHhHHHHHHDKFK.",
    "..KHSHHHHHHHDK..",
    ".KSSSSHHHHHHDK..",
    ".KSESSSHHHHHDK..",
    "KSSESSrHHHHHDK..",
    ".KcSSSSHHHHDK...",
    "..KcSSSKHHDK....",
    "...KKcSKKKK.....",
]
TOPO = 10


def troca(cor, x, y, peito):
    rgb = cor[:3]
    # de frente, a pele que aparece no decote do jaleco dele é a blusa dela
    if peito and 4 <= x <= 11 and y < PERNA and rgb in PELE:
        return BLUSA[(230, 106, 74)] + (255,) if rgb != (123, 65, 65) else BLUSA[(148, 57, 41)] + (255,)
    if y >= PERNA and rgb in TENIS:
        return TENIS[rgb] + (255,)
    for tabela in (PELE, BLUSA, CABELO, JALECO):
        if rgb in tabela:
            return tabela[rgb] + (255,)
    return cor


def quadro(base, cabeca, desce, peito=False):
    img = Image.new("RGBA", (16, 32), (0, 0, 0, 0))
    for y in range(TOPO + len(cabeca) + desce, 32):
        for x in range(16):
            p = base.getpixel((x, y))
            if p[3]:
                img.putpixel((x, y), troca(p, x, y, peito))
    for y, linha in enumerate(cabeca):
        assert len(linha) == 16, (linha, len(linha))
        for x, c in enumerate(linha):
            if c != ".":
                img.putpixel((x, TOPO + desce + y), PAL[c] + (255,))
    return img


def main():
    prof = Image.open(os.path.join(OW, "prof.png")).convert("RGBA")
    folha = Image.new("RGBA", (64, 96), (0, 0, 0, 0))
    for r, cabeca in enumerate([BAIXO, CIMA, LADO]):
        for c in range(4):
            base = prof.crop((c * 16, r * 32, c * 16 + 16, r * 32 + 32))
            folha.alpha_composite(quadro(base, cabeca, c % 2, peito=cabeca is BAIXO), (c * 16, r * 32))
    destino = os.path.join(OW, "ipe.png")
    folha.save(destino)
    print("ok:", destino)


if __name__ == "__main__":
    main()
