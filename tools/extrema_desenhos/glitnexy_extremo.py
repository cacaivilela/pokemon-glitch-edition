#!/usr/bin/env python3
"""O GLITNEXY EXTREMO, desenhado pixel por pixel (dlc/extrema.js).

A forma solta do GLITNEXY, como o HOOPA desacorrentado: o ROTEADOR EXTREMO
999G liga o sinal no máximo. Quatro arcos de wi-fi em vez de três, a bocona
virou um portal (o anel magenta no meio dos dentes), os olhos de bravo, e
dois braços de cabo de rede, cada mão segurando um anel de fenda flutuando.

O desenho é a METADE ESQUERDA (32 colunas, uma letra por pixel, `.` é
transparente); a direita é o espelho dela, com a luz (L) virando sombra (p)
— a luz vem da esquerda. Depois do espelho entram os GLITCHES, pixel a
pixel, fora da simetria de propósito.

    python3 tools/extrema_desenhos/glitnexy_extremo.py            # grava os PNGs
    python3 tools/extrema_desenhos/glitnexy_extremo.py --ver X.png  # folha pra conferir

Grava dlc/glitnexy_extremo.png, dlc/glitnexy_extremo_costas.png e o shiny em
assets/sprites/pokemon/shiny/(back/)glitnexyextremo.png.
"""
import os
import sys

from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from glitnexy import PAL, SHINY, RAIZ  # noqa: E402  (as mesmas cores do GLITNEXY)

# os quatro arcos (linhas 3-28), iguais na frente e nas costas
ARCOS = [
    "................................",
    "................................",
    "................................",
    "......................KKKKKKKKKK",
    "..................KKKKCCCCCCCCCC",
    "...............KKKCCCCWWWWWWWWWW",
    ".............KKCCCWWWKKKKKKKKKKK",
    "...........KKCCWWKKK............",
    "..........KCCWKK................",
    ".........KCCWK.......KKKKKKKKKKK",
    "........KCCWK....KKKKCCCCCCCCCCC",
    ".......KCCWK...KKCCCCWWWWWWWWWWW",
    "......KcCWK..KKCCCWWWKKKKKKKKKKK",
    ".....KcCCK..KCCWWKKK............",
    "....GKcCK..KCCWKK...............",
    "....KcCK..KCCWK.......KKKKKKKKKK",
    "....KcK..KcCWK....KKKKCCCCCCCCCC",
    ".....K..KcCWK...KKCCCCWWWWWWWWWW",
    ".......KcCCK...KCCCWWWKKKKKKKKKK",
    "......KcCCK..KCCWWKKK...........",
    "......KcCK..KCCWK...............",
    "......KKK..KcCWK......KKKKKKKKKK",
    "..........KcCWK....KKKCCCCCCCCCC",
    ".........KcCCK...KKCCCWWWWWWWWWW",
    ".........KcCK...KCCWWWKKKKKKKKKK",
    ".........KKK...KCCWKKK..........",
    "..............KcCWK.............",
]

FRENTE_ESQ = ARCOS + [
    "...KKKKKK.....KcCK.........KKKKK",
    "..KCCCCCCK....KKK.......KKKLLLLL",
    ".KCCKKKKCCK............KLLLLLLLL",
    ".KCK....KCK..........KKLLLLLLLLP",
    ".KCK.GG.KCK..........KLLKKLLLLPP",
    ".KCK....KCK.........KLLLLKKKLLPP",
    ".KCCKKKKCCK........KLLLKWWWKKKLP",
    "..KCCCCCCK.........KLLKWWGGWWKLP",
    "...KKKKKK.........KLLLKWGGGWWKLP",
    "..KK.KK.KK........KLLLLKWWWWKLLP",
    ".KBBKBBKBBK......KLLLLLLKKKKLLLP",
    ".KBBKBBKBBK......KLLRRLLLLLLLLPP",
    ".KBBBBBBBBK......KLLKKKKKKKKKKKK",
    ".KBBBBBBBBK......KLLKWWWWWWWWWWW",
    "..KbBBBBBBBKKKKKKKLLKMWWMWWMWWMW",
    "...KbbBBBBBBBBBBBKLLKMMMMMMMMMGG",
    "....KKbbbbbbbbbbbKLLKMMMMMMMMGKK",
    "......KKKKKKKKKKKKLLKMMMMMMMGKGG",
    "..................KLKMMMMMMMGKGK",
    "..................KLKMMMMMMMMGKK",
    "...................KLKMWWMWWMWGG",
    "...................KLLKWWWWWWWWW",
    "....................KLLLKKKKKKKK",
    ".....................KLLLLLPPPPP",
    ".....................KKLLLPPPPPP",
    ".......................KLLPPPPPP",
    "........................KKPPPPPP",
    "..........................KKKKKK",
    "...........................KBK..",
    "..........................KBbK..",
    ".........................KBbK...",
    ".......................KKKKKK...",
    ".......................KWWWWK...",
    ".......................KYKYKK...",
    ".......................KWWWWK...",
    ".......................KKKKKK...",
    "................................",
]

# as costas: o mesmo corpo, sem cara (e a luz nas costas)
COSTAS_ESQ = ARCOS + [
    "...KKKKKK.....KcCK.........KKKKK",
    "..KCCCCCCK....KKK.......KKKLLLLL",
    ".KCCKKKKCCK............KLLLLLLLL",
    ".KCK....KCK..........KKLLLLLLLLP",
    ".KCK.GG.KCK..........KLLLLLLLLPP",
    ".KCK....KCK.........KLLLLLLLLLPP",
    ".KCCKKKKCCK........KLLLLLLLLLLLP",
    "..KCCCCCCK.........KLLLLLLLLLLLP",
    "...KKKKKK.........KLLLLLLLLLLLLP",
    "..KK.KK.KK........KLLLLLLLLLLLLP",
    ".KBBKBBKBBK......KLLLLLLLLLLLLPP",
    ".KBBKBBKBBK......KLLLLLLLLLLLPPP",
    ".KBBBBBBBBK......KLLLLLLLLLLPPPP",
    ".KBBBBBBBBK......KLLLLLLLLLPPPPP",
    "..KbBBBBBBBKKKKKKKLLLLLLLLPPPPPP",
    "...KbbBBBBBBBBBBBKLLLLLLLPPPPPPP",
    "....KKbbbbbbbbbbbKLLLLLLLPPPPPPP",
    "......KKKKKKKKKKKKLLLLLLPPPPPPPP",
    "..................KLLLLLLPPPPPPP",
    "..................KLLLLLPPPPPPPP",
    "...................KLLLLLPPPPPPP",
    "...................KLLLLPPPPPPPP",
    "....................KLLLLPPPPPPP",
    ".....................KLLLPPPPPPP",
    ".....................KKLLPPPPPPP",
    ".......................KLLPPPPPP",
    "........................KKPPPPPP",
    "..........................KKKKKK",
    "...........................KBK..",
    "..........................KBbK..",
    ".........................KBbK...",
    ".......................KKKKKK...",
    ".......................KWWWWK...",
    ".......................KYKYKK...",
    ".......................KWWWWK...",
    ".......................KKKKKK...",
    "................................",
]

# os glitches (x, y, letra): fora da simetria, de propósito
GLITCHES = [(58, 11, "G"), (60, 12, "C"), (3, 24, "G"), (61, 41, "G"), (45, 8, "G"),
            (40, 55, "G"), (12, 50, "G"), (13, 50, "C")]


def inteira(metade):
    """A metade esquerda + o espelho dela (a luz da direita vira sombra)."""
    assert len(metade) == 64, len(metade)
    out = []
    for y, linha in enumerate(metade):
        assert len(linha) == 32, f"linha {y} com {len(linha)} pixels"
        direita = linha[::-1].replace("L", "p")
        out.append(list(linha + direita))
    for x, y, c in GLITCHES:
        out[y][x] = c
    return ["".join(l) for l in out]


def imagem(grade, pal):
    im = Image.new("RGBA", (64, 64), (0, 0, 0, 0))
    for y, linha in enumerate(grade):
        for x, ch in enumerate(linha):
            if ch != ".":
                im.putpixel((x, y), (*pal[ch], 255))
    return im


def main():
    frente, costas = inteira(FRENTE_ESQ), inteira(COSTAS_ESQ)
    pares = [(imagem(frente, PAL), imagem(costas, PAL)), (imagem(frente, SHINY), imagem(costas, SHINY))]
    if "--ver" in sys.argv:
        folha = Image.new("RGBA", (64 * 4, 64), (90, 130, 170, 255))
        for i, im in enumerate([pares[0][0], pares[0][1], pares[1][0], pares[1][1]]):
            folha.alpha_composite(im, (64 * i, 0))
        folha.resize((64 * 4 * 3, 64 * 3), Image.NEAREST).save(sys.argv[sys.argv.index("--ver") + 1])
        return
    saidas = [("dlc/glitnexy_extremo.png", pares[0][0]), ("dlc/glitnexy_extremo_costas.png", pares[0][1]),
              ("assets/sprites/pokemon/shiny/glitnexyextremo.png", pares[1][0]),
              ("assets/sprites/pokemon/shiny/back/glitnexyextremo.png", pares[1][1])]
    for caminho, im in saidas:
        destino = os.path.join(RAIZ, caminho)
        os.makedirs(os.path.dirname(destino), exist_ok=True)
        im.save(destino, optimize=True)
        print("gravou", caminho)


if __name__ == "__main__":
    main()
