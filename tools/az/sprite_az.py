#!/usr/bin/env python3
"""O AZ andando por LUMIOSE: sprite de 16x24 (um tile e meio de altura, mais
alto que todo mundo, como no X/Y), desenhado pixel por pixel aqui embaixo.

    python3 tools/az/sprite_az.py [saida.png]
"""
import sys
from PIL import Image

COR = {
    "K": (30, 26, 32),      # contorno
    "H": (242, 226, 228),   # cabelo branco rosado
    "h": (204, 176, 184),   # sombra do cabelo
    "S": (206, 160, 118),   # pele morena
    "s": (168, 120, 88),    # sombra da pele
    "E": (40, 30, 30),      # olho
    "D": (40, 36, 46),      # camisa preta (as mangas)
    "L": (150, 204, 64),    # a gravata borboleta verde
    "l": (96, 146, 40),     # o nó da gravata
    "V": (156, 82, 70),     # colete vermelho-marrom
    "v": (116, 56, 50),     # a listra do colete
    "O": (214, 176, 110),   # botão
    "P": (146, 78, 68),     # calça listrada
    "p": (108, 54, 48),     # a listra da calça
    "B": (52, 36, 32),      # sapato
    "N": (92, 60, 40),      # bengala
}

FRENTE = [
    ".....KKKKKK.....",
    "....KHHHHHHK....",
    "...KHHHHHHHHK...",
    "..KHHhHHHHHHHK..",
    "..KHHHHHHSSSHK..",
    "..KHHHHHSSSSHK..",
    "..KHHHhHSSESHK..",
    "..KHHhHHSSSsHK..",
    ".KHHhHHKsSSKHHK.",
    ".KHhHKLLlLLKHhK.",
    ".KHHKDVVDVVDKHK.",
    "..KHDDVVDVVDDHK.",
    "..KDDVVVOVVVDDK.",
    "..KDKVvVvVvVKDK.",
    ".NKDKVvVOVvVKDK.",
    ".NKSKVvVvVvVKSK.",
    ".N..KVvVVVvVK...",
    ".N..KPpPKPpPK...",
    ".N..KPpPKPpPK...",
    ".N..KPpPKPpPK...",
    ".N..KPpPKPpPK...",
    ".N..KPpPKPpPK...",
    ".N.KBBBK.KBBBK..",
    "...KKKKK.KKKKK..",
]


# as pernas da FRENTE e de COSTAS (as 7 últimas linhas) andando: um pé de cada vez
PASSO_A = [   # o pé da direita levantado
    ".N..KPpPKPpPK...",
    ".N..KPpPKPpPK...",
    ".N..KPpPKPpPK...",
    ".N..KPpPKPpPK...",
    ".N..KPpPKKBBBK..",
    ".N.KBBBK.KKKKK..",
    "...KKKKK........",
]
PASSO_B = [   # o da esquerda
    ".N..KPpPKPpPK...",
    ".N..KPpPKPpPK...",
    ".N..KPpPKPpPK...",
    ".N..KPpPKPpPK...",
    ".N.KBBBKKPpPK...",
    ".N.KKKKK.KBBBK..",
    ".........KKKKK..",
]

COSTAS = [
    ".....KKKKKK.....",
    "....KHHHHHHK....",
    "...KHHHHHHHHK...",
    "..KHHhHHHHhHHK..",
    "..KHHHHHHHHHHK..",
    "..KHHhHHHHhHHK..",
    "..KHHHHHHHHHHK..",
    "..KHhHHHHHHhHK..",
    ".KHHHHhHHhHHHHK.",
    ".KHhHHHHHHHHhHK.",
    ".KHHHhHHHHhHHHK.",
    "..KHDHHhHhHHDHK.",
    "..KDDKHHhHHKDDK.",
    "..KDKVVVVVVVKDK.",
    "..KDKVvVVVvVKDKN",
    "..KSKVVVVVVVKSKN",
    "....KVVVVVVVK..N",
    "....KPpPKPpPK..N",
    "....KPpPKPpPK..N",
    "....KPpPKPpPK..N",
    "....KPpPKPpPK..N",
    "....KPpPKPpPK..N",
    "...KBBBK.KBBBK.N",
    "...KKKKK.KKKKK..",
]

LADO = [   # virado pra esquerda (a direita é o espelho, o jogo faz)
    "......KKKKK.....",
    ".....KHHHHHK....",
    "....KHHHHHHHK...",
    "....KHHHHHhHHK..",
    "...KSSHHHHHHHK..",
    "...KSSSHHhHHHK..",
    "...KESSHHHHhHK..",
    "..KSSSSHHHHHHK..",
    "...KsSSHHhHHHHK.",
    "....KLLHHHHhHHK.",
    "....KDVHHHHHHK..",
    "....KDVVHHhHHK..",
    "....KDVVVKHHK...",
    "....KDVvVVKK....",
    "...KSKVVvVK.....",
    "..NKKVVVvVK.....",
    "..N.KVVVVVK.....",
    "..N.KPpPPPK.....",
    "..N.KPpPPPK.....",
    "..N.KPpPPPK.....",
    "..N.KPpPPPK.....",
    "..N.KPpPPPK.....",
    "..NKBBBBBK......",
    "...KKKKKK.......",
]
LADO_PASSO = [   # de lado andando: uma perna na frente, outra atrás
    "..N.KPpPPPK.....",
    "..N.KPpKPPK.....",
    "..NKPpK.KPPK....",
    "..NKPpK.KPPK....",
    "..KPpK...KPPK...",
    ".KBBBK...KBBBK..",
    ".KKKK.....KKKK..",
]


def pernas(grade, novas, cane_direita=False):
    out = grade[:-7] + novas
    if cane_direita:   # de costas a bengala fica do outro lado
        out = grade[:-7] + [l.replace("N", ".")[:15] + ("N" if k < 6 else ".") for k, l in enumerate(novas)]
    return out


def folha():
    """os 12 quadros (16x32, o AZ embaixo) na ordem do jogo: frente, costas e
    lado; em cada linha parado, passo, parado, passo"""
    linhas = [
        [FRENTE, pernas(FRENTE, PASSO_A), FRENTE, pernas(FRENTE, PASSO_B)],
        [COSTAS, pernas(COSTAS, PASSO_B, True), COSTAS, pernas(COSTAS, PASSO_A, True)],
        [LADO, pernas(LADO, LADO_PASSO), LADO, pernas(LADO, LADO_PASSO)],
    ]
    im = Image.new("RGBA", (64, 96), (0, 0, 0, 0))
    for r, quadros in enumerate(linhas):
        for c, g in enumerate(quadros):
            im.alpha_composite(desenha(g), (c * 16, r * 32 + 8))
    return im


def desenha(grade):
    assert all(len(l) == 16 for l in grade) and len(grade) == 24, "grade fora do tamanho"
    im = Image.new("RGBA", (16, 24), (0, 0, 0, 0))
    for y, linha in enumerate(grade):
        for x, ch in enumerate(linha):
            if ch != ".":
                im.putpixel((x, y), COR[ch] + (255,))
    return im


if __name__ == "__main__":
    folha().save("assets/sprites/overworld/az.png")
    # a prévia grande, do lado do cavalheiro do jogo
    gent = Image.open("assets/sprites/overworld/gentleman.png").convert("RGBA")
    tela = Image.new("RGBA", (64 * 2 + 8, 96), (120, 168, 96, 255))
    tela.alpha_composite(gent, (0, 0))
    tela.alpha_composite(folha(), (72, 0))
    saida = sys.argv[1] if len(sys.argv) > 1 else "/tmp/az_folha.png"
    tela.resize((tela.width * 5, tela.height * 5), Image.NEAREST).save(saida)
    print("assets/sprites/overworld/az.png", saida)
