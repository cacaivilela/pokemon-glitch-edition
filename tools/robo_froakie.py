#!/usr/bin/env python3
"""O ROBÔ FROAKIE da base secreta: a FOLHA DE POSES feita pixel por pixel a
partir do desenho do CAIO (assets/sprites/bases/robo_froakie.png, a frente
parada). Mesmas 4 cores dele, mesmo tamanho (8 de largura), com uma a mais —
o azul escuro das costas.

    colunas: PARADO, AGACHADO (impulso e pouso), NO AR (esticado, braços pra cima)
    linhas:  FRENTE, COSTAS, DIREITA   (a esquerda é a direita espelhada, no jogo)

Cada quadro tem 10 x 10, com os pés na última linha.
    python3 tools/robo_froakie.py   -> assets/sprites/bases/robo_froakie_folha.png
"""
import os
from PIL import Image

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAL = {
    "a": (0x4a, 0x90, 0xd0, 255),   # o azul dele
    "b": (0xf8, 0xe0, 0x48, 255),   # o amarelo do olho
    "c": (0x08, 0x08, 0x08, 255),   # a pupila
    "d": (0xfe, 0xfe, 0xfe, 255),   # a gola, as mãos e os pés
    "e": (0x2a, 0x6a, 0xa8, 255),   # (novo) o azul escuro das costas
}

FRENTE = [
    [  # parado: o desenho do CAIO
        "..........",
        "...a..a...",
        "..aaaaaa..",
        "..abaaba..",
        "..acaaca..",
        ".daaaaaad.",
        "..dddddd..",
        "..aaaaaa..",
        ".aaaaaaaa.",
        ".d.d..d.d.",
    ],
    [  # agachado: desce 1, perde a linha da barriga, pés abertos
        "..........",
        "..........",
        "...a..a...",
        "..aaaaaa..",
        "..abaaba..",
        "..acaaca..",
        ".daaaaaad.",
        "..dddddd..",
        ".aaaaaaaa.",
        "dd......dd",
    ],
    [  # no ar: braços pra cima, esticado, pés juntos
        ".d.a..a.d.",
        ".daaaaaad.",
        "..abaaba..",
        "..acaaca..",
        "..aaaaaa..",
        "..dddddd..",
        "..aaaaaa..",
        "..aaaaaa..",
        "...aaaa...",
        "...d..d...",
    ],
]
COSTAS = [
    [
        "..........",
        "...a..a...",
        "..aaaaaa..",
        "..aaeeaa..",
        "..aaeeaa..",
        ".daaaaaad.",
        "..dddddd..",
        "..aaeeaa..",
        ".aaaaaaaa.",
        ".d.d..d.d.",
    ],
    [
        "..........",
        "..........",
        "...a..a...",
        "..aaaaaa..",
        "..aaeeaa..",
        "..aaeeaa..",
        ".daaaaaad.",
        "..dddddd..",
        ".aaaeeaaa.",
        "dd......dd",
    ],
    [
        ".d.a..a.d.",
        ".daaaaaad.",
        "..aaeeaa..",
        "..aaeeaa..",
        "..aaaaaa..",
        "..dddddd..",
        "..aaeeaa..",
        "..aaaaaa..",
        "...aaaa...",
        "...d..d...",
    ],
]
DIREITA = [
    [  # de lado: um olho na frente, a mão no meio
        "..........",
        "......a...",
        "....aaaa..",
        "....aaab..",
        "....aaac..",
        "....aada..",
        "...ddddd..",
        "...aaaaa..",
        "..aaaaaa..",
        "..dd..dd..",
    ],
    [
        "..........",
        "..........",
        "......a...",
        "....aaaa..",
        "....aaab..",
        "....aaac..",
        "....aada..",
        "...ddddd..",
        "..aaaaaa..",
        ".dd....dd.",
    ],
    [  # no ar: inclinado pra frente, braço esticado, pernas pra trás
        "......a...",
        "....aaaa..",
        "....aaab..",
        "....aaac.d",
        "....aaaad.",
        "...ddddd..",
        "..aaaaa...",
        ".aaaaa....",
        "dda.......",
        "..........",
    ],
]


def main():
    linhas = [FRENTE, COSTAS, DIREITA]
    folha = Image.new("RGBA", (30, 30), (0, 0, 0, 0))
    for li, poses in enumerate(linhas):
        for co, rows in enumerate(poses):
            assert len(rows) == 10 and all(len(r) == 10 for r in rows), (li, co)
            for y, r in enumerate(rows):
                for x, ch in enumerate(r):
                    if ch != ".":
                        folha.putpixel((co * 10 + x, li * 10 + y), PAL[ch])
    dest = os.path.join(RAIZ, "assets", "sprites", "bases", "robo_froakie_folha.png")
    folha.save(dest)
    print("->", os.path.relpath(dest, RAIZ))


if __name__ == "__main__":
    main()
