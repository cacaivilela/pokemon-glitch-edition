#!/usr/bin/env python3
"""O GLITNEXY, desenhado pixel por pixel (GLITCH DIMENSION EXTREMA, dlc/extrema.js).

Um bichinho voador e comilão com o formato do sinal de internet: o pontinho do
wi-fi é o corpo (com a bocona), e os três arcos são as asas. Nas costas, o rabo
é um cabo de rede com o plug na ponta. Uma letra por pixel, 64x64, `.` é
transparente; o desenho é este texto — mexer nele é mexer no bicho.

    python3 tools/extrema_desenhos/glitnexy.py            # grava os PNGs
    python3 tools/extrema_desenhos/glitnexy.py --ver X.png  # folha pra conferir

Grava dlc/glitnexy.png, dlc/glitnexy_costas.png e o shiny em
assets/sprites/pokemon/shiny/glitnexy.png (+ back/), que é onde o jogo procura
a cor trocada de uma espécie sem número.
"""
import os
import sys

from PIL import Image

RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

PAL = {
    "K": (24, 14, 40),      # contorno
    "P": (138, 79, 224),    # o corpo
    "L": (196, 155, 255),   # luz do corpo
    "p": (90, 47, 160),     # sombra do corpo
    "C": (54, 230, 214),    # as asas (os arcos do wi-fi)
    "c": (26, 158, 154),    # sombra das asas
    "W": (255, 255, 255),   # brilho, dentes, olho
    "M": (42, 10, 30),      # dentro da boca
    "R": (255, 92, 154),    # língua e bochecha
    "r": (255, 170, 200),   # brilho da língua
    "G": (255, 46, 136),    # o glitch
    "B": (58, 109, 240),    # o cabo de rede
    "b": (34, 64, 143),     # sombra do cabo
    "Y": (255, 206, 64),    # os contatos do plug
}
# SHINY: o corpo verde-água e as asas magenta (o glitch continua magenta)
SHINY = {**PAL, "P": (63, 217, 160), "L": (168, 255, 216), "p": (31, 138, 104),
         "C": (255, 79, 176), "c": (168, 36, 110)}

FRENTE = [
    "................................................................",
    "................................................................",
    "................................................................",
    "................................................................",
    "................................................................",
    "..........................KKKKKKKKKKKK..........................",
    "......................KKKKccccccccccccKKKK......................",
    "...................KKKcccccCCCCCCCCCCcccGGKKK...................",
    ".................KKcccCCCCCCCCCCCCCCCCCCCCGGcKK.................",
    "...............KKcccCCCCCWWWWWWWWWWWWWWCCCCCcccKK...............",
    ".............KKccCCCCWWWKKKKKKKKKKKKKKKKWWWCCCCccKK.............",
    "............KccCCCCWWKKK................KKKWWCCCCccK......G.....",
    "..........KKccCCCWWKK....KKKKKKKKKKK..K....KKWWCCCccKK.....C....",
    ".........KKcCCCWWKK...KKKccccccccccc..cKKK...KKWWCCCcKK.........",
    "........KKcCCCWKK..KKKccccCCCCCCCCCC..ccccKKK..KKWCCCcKK........",
    ".......KccCCWWKK.KKKccCCCCCCCCCCCCCC..CCCCccKKK.KKWWCCccK.......",
    "......KccCCWWK..KKccCCCCCWWWWWWWWWWW..WCCCCCccKK..KWWCCccK......",
    ".....C.KcCCWKK.KccCCCCWWWKKKKKKKKKKKKKKWWWCCCCccK.KKWCCcK.......",
    "....C...KCKK.KKccCCCWWWKK..............KKWWWCCCccKK.KKCK........",
    ".........KK.KKccCCCWWKK...KKKKKKKKKKKK...KKWWCCCccKK.KK.........",
    "............KcCCCWWKK..KKKccccccccccccKKK..KKWWCCCcK............",
    "............KcCCWWK..KKccccCCCCCCCCCCccccKK..KWWCCcK............",
    ".............KcCWKK.KcccCCCCCCCCCCCCCCCCcccK.KKWCcK.............",
    "..............KKK.KKccCCCCWWWWWWWWWWWWCCCCccKK.KKK..............",
    ".................KKccCCCWWKKKKKKKKKKKKWWCCCccKK.............G...",
    "...G.............KcCCCWWKKK..........KKKWWCCCcK.................",
    ".................KcCCWWK......KKKK......KWWCCcK.................",
    "..................KcCWKK..KKKKKKKKKKKK..KKWCcK..................",
    "...................KKK...KKLLLLLLLLLPKK...KKK...................",
    ".......................KKLLLLLLLLLLPPPPKK.......................",
    "......................KKLLLLLLLLLPPPPPPPKK......................",
    ".....................KKLLLLLLLLLPPPPPPPPPKK.....................",
    ".....................KLLLLKKLLLPPPPPKKPPPPK.....................",
    "....................KLLLLKWKKPPPPPPKWKKPPPPK....................",
    "...................KKLLLLKKKKPPPPPPKKKKGPPPKK...................",
    "...................KLLLLLKKLKPPPPPPKKLKGPPPPK...................",
    "...................KLLLLLPKKPPPPPPPPKKPPPPPPK...................",
    "...................KLLLRRPPPPPPPPPPPPPPRRPPPK...................",
    "..................KKLLLPPPPPPPPPPPPPPPPPPPPpKK..................",
    "..................KKLPPPKKKKKKKKKKKKKKKKPPppKK..................",
    "..................KKPPPKWWWWWWWWWWWWWWWWKpppKK..................",
    "..................KKPPPKMWWMMMMMMMMMMWWMKpppKK..................",
    "...................KPPPKMWMMMMMMMMMMMMWMKpppK...................",
    "...................KPPPKMMMMMMMMMMMMMMMMKpppK...................",
    "...................KPPPPKMMMMRRRRRRMMMMKppppKG..................",
    "...................KKPPPPKMMRrrRRRRMMKpppppKK...................",
    "....................KPPPPPKKMRRRRRRMKKpppppK....................",
    ".....................KPPPPPPKKKKKKKKppppppK.....................",
    ".....................KKPPPPPPPpppppppppppKK.....................",
    "......................KKPPPPPpppppppppppKK......................",
    ".......................KKPPppppppppppppKK.......................",
    ".........................KKppppppppppKK.........................",
    "..........................KKKKKKKKKKKK..........................",
    "................................................................",
    "................................................................",
    "................................................................",
    "................................................................",
    "................................................................",
    "................................................................",
    "................................................................",
    "................................................................",
    "................................................................",
    "................................................................",
    "................................................................",
]

COSTAS = [
    "................................................................",
    "................................................................",
    "................................................................",
    "................................................................",
    "................................................................",
    "..........................KKKKKKKKKKKK..........................",
    "......................KKKKccccccccccccKKKK......................",
    "...................KKKcccccCCCCCCCCCCcccGGKKK...................",
    ".................KKcccCCCCCCCCCCCCCCCCCCCCGGcKK.................",
    "...............KKcccCCCCCWWWWWWWWWWWWWWCCCCCcccKK...............",
    ".............KKccCCCCWWWKKKKKKKKKKKKKKKKWWWCCCCccKK.............",
    "............KccCCCCWWKKK................KKKWWCCCCccK......G.....",
    "..........KKccCCCWWKK....KKKKKKKKKKK..K....KKWWCCCccKK.....C....",
    ".........KKcCCCWWKK...KKKccccccccccc..cKKK...KKWWCCCcKK.........",
    "........KKcCCCWKK..KKKccccCCCCCCCCCC..ccccKKK..KKWCCCcKK........",
    ".......KccCCWWKK.KKKccCCCCCCCCCCCCCC..CCCCccKKK.KKWWCCccK.......",
    "......KccCCWWK..KKccCCCCCWWWWWWWWWWW..WCCCCCccKK..KWWCCccK......",
    ".....C.KcCCWKK.KccCCCCWWWKKKKKKKKKKKKKKWWWCCCCccK.KKWCCcK.......",
    "....C...KCKK.KKccCCCWWWKK..............KKWWWCCCccKK.KKCK........",
    ".........KK.KKccCCCWWKK...KKKKKKKKKKKK...KKWWCCCccKK.KK.........",
    "............KcCCCWWKK..KKKccccccccccccKKK..KKWWCCCcK............",
    "............KcCCWWK..KKccccCCCCCCCCCCccccKK..KWWCCcK............",
    ".............KcCWKK.KcccCCCCCCCCCCCCCCCCcccK.KKWCcK.............",
    "..............KKK.KKccCCCCWWWWWWWWWWWWCCCCccKK.KKK..............",
    ".................KKccCCCWWKKKKKKKKKKKKWWCCCccKK.............G...",
    "...G.............KcCCCWWKKK..........KKKWWCCCcK.................",
    ".................KcCCWWK......KKKK......KWWCCcK.................",
    "..................KcCWKK..KKKKKKKKKKKK..KKWCcK..................",
    "...................KKK...KKLLLLLLLLLPKK...KKK...................",
    ".......................KKLLLLLLLLLLPPPPKK.......................",
    "......................KKLLLLLLLLLPPPPPPPKK......................",
    ".....................KKLLLLLLLLLPPPPPPPPPKK.....................",
    ".....................KLLLLLLLLLPPPPPPPPPPPK.....................",
    "....................KLLLLLLLLPPPPPPPPPPPPPPK....................",
    "...................KKLLLLLLLPPPPPPPPPPPPPPPKK...................",
    "...................KLLLLLLLPPPPPPPPPPPPPPPPPK...................",
    "...................KLLLLLPPPPLLPPPPPPPPPPPPPK...................",
    "...................KLLLLPPPPLPPLPPPPPPPPPPPPK...................",
    "..................KKLLLPPPPPPPPPPPPPPPPPPPPpKK..................",
    "..................KKLPPPPPPPPPPPPPPPPPPPPPppKK..................",
    "..................KKPPPPPPPPPPPPPPPPPPPPPpppKK..................",
    "..................KKPPPPPPPPPPPPPPPPPPPpppppKK..................",
    "...................KPPPPPPPPPPPPPPPPPPppppppK...................",
    "...................KPPPPPPPPPPPPPPPPPpppppppK...................",
    "...................KPPPPPPPPPPPPPPPpppppppppKG..................",
    "...................KKPPPPPPPPPPPPPpppppppppKK...KKKKKK..........",
    "....................KPPPPPPPPPPPPppppppppppK....KWWWWK..........",
    ".....................KPPPPPPPPPpppppppppppK.....KYKYKK..........",
    ".....................KKPPPPPPPpppppppppppKK.....KWWWWK..........",
    "......................KKPPPPPpppppppppppKBb.....KKBBKK..........",
    ".......................KKPPppppppppppppKKBBb.....KBBK...........",
    ".........................KKppppppppppKK..KBBb....KBb............",
    "..........................KKKKKKKKKKKK....KBBbb.KBb.............",
    "...........................................KbBBBbK..............",
    ".............................................KbbbK..............",
    "................................................................",
    "................................................................",
    "................................................................",
    "................................................................",
    "................................................................",
    "................................................................",
    "................................................................",
    "................................................................",
    "................................................................",
]


def imagem(grade, pal):
    im = Image.new("RGBA", (64, 64), (0, 0, 0, 0))
    for y, linha in enumerate(grade):
        assert len(linha) == 64, f"linha {y} com {len(linha)} pixels"
        for x, ch in enumerate(linha):
            if ch != ".":
                im.putpixel((x, y), (*pal[ch], 255))
    return im


def main():
    assert len(FRENTE) == 64 and len(COSTAS) == 64
    pares = [(imagem(FRENTE, PAL), imagem(COSTAS, PAL)), (imagem(FRENTE, SHINY), imagem(COSTAS, SHINY))]
    if "--ver" in sys.argv:
        folha = Image.new("RGBA", (64 * 4, 64), (90, 130, 170, 255))
        for i, im in enumerate([pares[0][0], pares[0][1], pares[1][0], pares[1][1]]):
            folha.alpha_composite(im, (64 * i, 0))
        folha.resize((64 * 4 * 3, 64 * 3), Image.NEAREST).save(sys.argv[sys.argv.index("--ver") + 1])
        return
    saidas = [("dlc/glitnexy.png", pares[0][0]), ("dlc/glitnexy_costas.png", pares[0][1]),
              ("assets/sprites/pokemon/shiny/glitnexy.png", pares[1][0]),
              ("assets/sprites/pokemon/shiny/back/glitnexy.png", pares[1][1])]
    for caminho, im in saidas:
        im.save(os.path.join(RAIZ, caminho), optimize=True)
        print(caminho)


if __name__ == "__main__":
    main()
