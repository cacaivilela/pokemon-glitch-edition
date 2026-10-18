#!/usr/bin/env python3
"""VÍTOR e ANDRÉ, os dois amigos de SÃO LUCARIO que andam com você por
BRAGLITCH (src/data/amigos.js).

O corpo e o andar saem do hero.png do FireRed, como o CAIO
(tools/sprite_caio_lara.py); a cabeça é desenhada aqui e a roupa é trocada:

  VÍTOR  loiro, cabelo arrumadinho de franja, ÓCULOS de aro escuro. Camiseta
         verde, cinto de ferramentas marrom, bermuda cáqui e a mochila cinza
         de metal (onde mora a chave de fenda).
  ANDRÉ  cabelo castanho espetado (não para quieto nem pra pentear), a boca
         sempre aberta. Camisa amarela de futebol com a gola verde, calção
         azul e a bola branca pendurada no lugar da mochila.

Folha: 4 colunas x 3 linhas de 16x32 (baixo, cima, esquerda), e o retrato de
batalha de 64x64 (a cabeça e os ombros do quadro de frente, 4x).

    python3 tools/sprite_vitor_andre.py [previa.png]
      -> assets/sprites/overworld/vitor.png   assets/sprites/trainers/vitor.png
      -> assets/sprites/overworld/andre.png   assets/sprites/trainers/andre.png
"""
import os
import sys
from PIL import Image

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OW = os.path.join(RAIZ, "assets", "sprites", "overworld")
TR = os.path.join(RAIZ, "assets", "sprites", "trainers")

PAL = {
    "K": (16, 16, 24),      # contorno
    "S": (232, 172, 124),   # pele
    "s": (200, 136, 96),    # pele, sombra
    "c": (112, 60, 44),     # contorno do rosto
    "r": (240, 132, 120),   # bochecha
    "E": (16, 16, 24),      # olho
    # VÍTOR
    "Y": (240, 208, 96),    # loiro
    "y": (196, 156, 56),    # loiro, sombra
    "l": (255, 244, 176),   # loiro, brilho
    "G": (84, 84, 100),     # aro dos óculos (cinza, pra não pesar)
    "L": (238, 188, 146),   # lente: transparente, é a pele com um brilhinho
    # ANDRÉ
    "b": (122, 76, 42),     # castanho
    "B": (78, 46, 26),      # castanho, sombra
    "n": (172, 116, 64),    # castanho, brilho
}

PELE = {
    (255, 197, 148): (232, 172, 124),
    (222, 148, 115): (200, 136, 96),
    (246, 189, 148): (216, 154, 108),
    (123, 65, 65): (168, 100, 66),      # a sombra da pele dos braços
}

VITOR_ROUPA = {
    **PELE,
    (255, 106, 74): (112, 196, 96),     # a camiseta vermelha vira verde
    (197, 57, 57): (64, 150, 72),
    (106, 41, 41): (34, 92, 48),
    (57, 57, 123): (120, 78, 40),       # o azul-marinho vira o cinto de ferramentas
    (115, 164, 197): (206, 184, 128),   # o jeans vira bermuda cáqui
    (189, 156, 57): (128, 132, 148),    # mochila de metal
    (255, 222, 90): (190, 196, 210),
    (172, 123, 65): (120, 78, 40),
}

ANDRE_ROUPA = {
    **PELE,
    (255, 106, 74): (252, 220, 64),     # a camisa vira o amarelo do futebol
    (197, 57, 57): (222, 176, 30),
    (106, 41, 41): (30, 128, 70),       # a gola e os detalhes verdes
    (57, 57, 123): (30, 128, 70),
    (115, 164, 197): (44, 84, 196),     # o jeans vira calção azul
    (189, 156, 57): (190, 190, 206),    # a mochila vira a bola: branca...
    (255, 222, 90): (246, 246, 250),
    (172, 123, 65): (30, 128, 70),
}

VITOR = {
    "baixo": [
        "....KKKKKKK.....",
        "...KllYYYYYKK...",
        "..KlYYYYYYYYYK..",
        ".KlYYYYYYYYYYyK.",
        ".KYYYYYYYYYYyyK.",
        "KYYYyYYYYyYYYyyK",
        "KYYYSSSSSSSSYYyK",
        ".KGGGGGSSGGGGGK.",
        ".KGLELGGGGLELGK.",
        ".KGLLLGSSGLLLGK.",
        ".KSGGGSSSSGGGSK.",
        "...KcrSSSSrcK...",
    ],
    "cima": [
        "....KKKKKKK.....",
        "...KllYYYYYKK...",
        "..KlYYYYYYYYYK..",
        ".KlYYYYYYlYYYyK.",
        ".KYYYYlYYYYYYyK.",
        "KYYYYYYYYYYYYyyK",
        "KYYyYYYYYYyYYyyK",
        ".KyYYYYYYYYYYyK.",
        ".KGyYYYYYYYYyGK.",
        ".KsyyYYYYYYyysK.",
        "..KsSyyyyyySsK..",
        "...KKsSSSSsKK...",
    ],
    "lado": [
        "....KKKKKKK.....",
        "...KlYYYYYYKK...",
        "..KlYYYYYYYYyK..",
        ".KlYYYYYYYYYYyK.",
        "KYYYYYYlYYYYYyK.",
        "KYYYSYYYYYYYyyK.",
        ".KSSSSYYYYYYyyK.",
        "KGGGGGGGYYYYyK..",
        "KLELGSSSYYYyK...",
        "KLLLGSrSyYyK....",
        "KGGGGSsSyyK.....",
        "..KcSSsKKKK.....",
    ],
}

ANDRE = {
    "baixo": [
        "...K...KK...K...",
        "..KnK.KnbK.KnK..",
        "..KbnKnbbbKnbK..",
        ".KbbnbbbBbbnbbK.",
        "KnbbbbnbbbbbnbbK",
        "KbnbSbbSSbbSbnbK",
        "KbBSSSSSSSSSSBbK",
        ".KbSSESSSSESSbK.",
        ".KBSSESSSSESSBK.",
        "..KBrSSSSSSrBK..",
        "...KcsSKKSscK...",
        "....KKSSSSKK....",
    ],
    "cima": [
        "...K...KK...K...",
        "..KnK.KnbK.KnK..",
        "..KbnKnbbbKnbK..",
        ".KbbnbbbBbbnbbK.",
        "KnbbbbnbbbbbnbbK",
        "KbbnbbbbnbbbbbbK",
        "KbBbbnbbbbbnbBbK",
        ".KbbbbbnbbbbbbK.",
        ".KBbbnbbbbnbbBK.",
        "..KBbbbbbbbbBK..",
        "..KsBBBBBBBBsK..",
        "...KKsSSSSsKK...",
    ],
    "lado": [
        "....K..KK..K....",
        "...KnKKnbKKnK...",
        "..KbnbbnbbbnbK..",
        ".KbbbnbbbbnbbbK.",
        "KnbbSbbbnbbbnbbK",
        ".KbSSSbbbbbbbbbK",
        ".KSSSSSbBbbnbbK.",
        ".KSESSSSbbbbbK..",
        "KSSESSrsbbbK....",
        ".KSSKKsBbbbK....",
        "..KcSSsKKKK.....",
        "...KKKK.........",
    ],
}

DIRECOES = ["baixo", "cima", "lado"]
TOPO, CORPO = 11, 23     # a cabeça começa na linha 11; o corpo do FireRed, na 23


def troca(p, tabela):
    return tabela.get(p[:3], p[:3]) + (p[3],)


def folha(cabecas, roupa):
    base = Image.open(os.path.join(OW, "hero.png")).convert("RGBA")
    out = Image.new("RGBA", (64, 96), (0, 0, 0, 0))
    for r, d in enumerate(DIRECOES):
        cab = cabecas[d]
        for c in range(4):
            desce = c % 2
            q = Image.new("RGBA", (16, 32), (0, 0, 0, 0))
            for y in range(CORPO + desce, 32):
                for x in range(16):
                    p = base.getpixel((c * 16 + x, r * 32 + y))
                    if p[3]:
                        q.putpixel((x, y), troca(p, roupa))
            for y, linha in enumerate(cab):
                assert len(linha) == 16, (d, y, linha)
                for x, ch in enumerate(linha):
                    yy = TOPO + desce + y
                    if ch != "." and yy < 32:
                        q.putpixel((x, yy), PAL[ch] + (255,))
            out.alpha_composite(q, (c * 16, r * 32))
    return out


def retrato(f):
    """o retrato de batalha: cabeça e ombros do quadro de frente, 4x"""
    q = f.crop((0, TOPO, 16, TOPO + 15))
    grande = q.resize((64, 60), Image.NEAREST)
    out = Image.new("RGBA", (64, 64), (0, 0, 0, 0))
    out.alpha_composite(grande, (0, 4))
    return out


def main(previa=None):
    feitos = [(n, folha(cab, roupa)) for n, cab, roupa in
              (("vitor", VITOR, VITOR_ROUPA), ("andre", ANDRE, ANDRE_ROUPA))]
    if previa:
        fundo = Image.new("RGBA", (2 * (64 + 72), 96), (90, 140, 90, 255))
        for i, (_, f) in enumerate(feitos):
            fundo.alpha_composite(f, (i * 136, 0))
            fundo.alpha_composite(retrato(f), (i * 136 + 68, 16))
        fundo.resize((fundo.width * 4, fundo.height * 4), Image.NEAREST).save(previa)
        return
    for n, f in feitos:
        f.save(os.path.join(OW, f"{n}.png"))
        retrato(f).save(os.path.join(TR, f"{n}.png"))
        print("ok:", n)


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else None)
