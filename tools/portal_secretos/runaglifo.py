#!/usr/bin/env python3
"""RUNÁGLIFO (nº 1105, PSÍQUICO/FANTASMA) — o Pokémon secreto das quatro runas
UNOWN do PORTAL PARADOXO (src/data/portal-paradoxo.js). Inventado aqui.

Uma PEDRA de pé, flutuando: lisa em cima e lascada embaixo, com as
RACHADURAS acesas em ciano (são runas: o portal escreveu nela), um OLHO
grande no meio — o mesmo olho do UNOWN — e, em volta, quatro letras UNOWN
pequenas rodando. Embaixo, a sombra no chão (ela não encosta).

Tudo grade de letras, pixel por pixel:
  k contorno · L/H pedra clara/brilho · S pedra · s sombra · d sombra funda
  c runa acesa · C miolo da runa · e branco do olho · p pupila · r reflexo
    python3 tools/portal_secretos/runaglifo.py
"""
import os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DEX = 1105

PEDRA = [
    "..............kkkkkkkkkk..............",
    "...........kkkHHHHLLLLLLkkk...........",
    ".........kkHHHHHLLLLLLLLLLLkk.........",
    "........kHHHHLLLLLLLLLLLLLLLSk........",
    ".......kHHHLLLLLLLLLLLLLLLLLSSk.......",
    "......kHHLLLLLLLLLLLLLLLLLLLLSSk......",
    ".....kHHLLLLLLLLcLLLLLLLLLLLLLSSk.....",
    ".....kHLLLLLLLLLcLLLLLLLLLLLLLLSk.....",
    "....kHLLLLLLLLLcCcLLLLLLLLLLLLLSSk....",
    "....kHLLLLLLLLLLcLLLLLLLLLLLLLLLSk....",
    "....kLLLLLLLLLLLcLLLLLLLLLLLLLLLSk....",
    "...kHLLLLLLLLLLkkkkkkkkkkLLLLLLLSSk...",
    "...kLcLLLLLLkkkeeeeeeeeeekkLLLLLcSk...",
    "...kcCcLLLLkeeeeeeeeeeeeeeekLLLcCck...",
    "...kLLLLLLkeeeeeeppppeeeeeeekLLLLSk...",
    "...kLLLLLkeeeeepppppprrpeeeeekLLLSk...",
    "...kLLLLLkeeeeppppppprrppeeeekLLLSk...",
    "...kLLLLLkeeeeppppcppppppeeeekLLLSk...",
    "...kSLLLLkeeeeppppppppppeeeeekLLSSk...",
    "...kSLLLLLkeeeeppppppppeeeeekLLLSSk...",
    "...kSSLLLLLkeeeeeeppppeeeeekLLLLSSk...",
    "...kScLLLLLLkkeeeeeeeeeeekkLLLLcSSk...",
    "...kScLLLLLLLLkkkkkkkkkkkLLLLLLcSSk...",
    "...kSSSLLLLLLLLLLLLLcLLLLLLLLLLSSSk...",
    "...kSSSLLLLLLLLLLLLcCcLLLLLLLLSSSSk...",
    "....kSSSLLLLLLLLLLLLcLLLLLLLLLSSSk....",
    "....kSSSSLLLLLLLLLLLcLLLLLLLLSSSSk....",
    "....kSSSSSLLLLLLLLLcLcLLLLLLSSSSSk....",
    "....ksSSSSSLLLLLLLcLLLcLLLLSSSSSsk....",
    ".....ksSSSSSSLLLLcLLLLLcLLSSSSSsk.....",
    ".....kssSSSSSSSSSSSSSSSSSSSSSSssk.....",
    "......kssSSSSSSSSSSSSSSSSSSSSssk......",
    "......kdssSSSSSSSSSSSSSSSSSSssdk......",
    ".......kdssSSSkSSSSSSSSkSSSssdk.......",
    ".......kddsssk.kSSSSSSk.ksssddk.......",
    "........kddsk...kSSSSk...ksddk........",
    ".........kdk.....kssk.....kdk.........",
    "..........k.......kk.......k..........",
]
# as letras UNOWN que rodam em volta (A, ?, !, O), cada uma com o olhinho
LETRAS = {
    "A": ["...k...", "..kpk..", ".kpppk.", "kppeppk", "kpppppk", "kpk.kpk", "kk...kk"],
    "?": [".kkkkk.", "kpppppk", "kk..kpk", "...kppk", "..kpk..", "..kk...", "..kpk.."],
    "!": ["..kpk..", "..kpk..", "..kek..", "..kpk..", "..kpk..", "...k...", "..kpk.."],
    "O": ["..kkk..", ".kpppk.", "kppppk.", "kpp.epk", "kpppppk", ".kpppk.", "..kkk.."],
}
COR = {
    "k": (26, 20, 40), "H": (190, 186, 214), "L": (142, 136, 172), "S": (106, 100, 136),
    "s": (74, 68, 102), "d": (52, 46, 76), "c": (56, 232, 240), "C": (210, 255, 255),
    "e": (244, 244, 250), "p": (26, 20, 40), "r": (120, 240, 255),
}
SHINY = dict(COR, **{"H": (250, 220, 180), "L": (226, 186, 128), "S": (190, 146, 92), "s": (150, 108, 62),
                     "d": (110, 76, 40), "c": (255, 90, 160), "C": (255, 220, 240), "r": (255, 150, 200)})


def desenha(pal):
    im = Image.new("RGBA", (96, 96), (0, 0, 0, 0))
    px = im.load()

    def por(grade, x0, y0, cores=pal):
        for j, linha in enumerate(grade):
            for i, ch in enumerate(linha):
                if ch != "." and 0 <= x0 + i < 96 and 0 <= y0 + j < 96:
                    px[x0 + i, y0 + j] = cores[ch] + (255,)

    # a sombra no chão (ela flutua: a sombra fica longe dos pés)
    for x in range(30, 66):
        for y in range(86, 90):
            if ((x - 48) / 18) ** 2 + ((y - 88) / 2.2) ** 2 <= 1:
                px[x, y] = (0, 0, 0, 70)
    por(PEDRA, 29, 22)
    # as letras: duas em cima, uma de cada lado, uma embaixo
    for (letra, x, y) in [("A", 14, 20), ("?", 74, 14), ("!", 10, 50), ("O", 78, 46), ("A", 70, 72)]:
        # as letras têm cor própria: corpo cinza-arroxeado e o olhinho aceso
        por(LETRAS[letra], x, y, {"k": pal["k"], "p": pal["S"], "e": pal["C"]})
    return im


def main():
    for pal, pasta in ((COR, ""), (SHINY, "shiny")):
        destino = os.path.join(ROOT, "assets", "sprites", "pokemon", pasta, f"{DEX}.png")
        desenha(pal).save(destino)
    prev = Image.new("RGBA", (192, 96), (236, 240, 244, 255))
    prev.alpha_composite(desenha(COR), (0, 0)); prev.alpha_composite(desenha(SHINY), (96, 0))
    prev.resize((192 * 4, 96 * 4), Image.NEAREST).save(os.environ.get("PREVIA", "/tmp/runaglifo.png"))
    print("ok")


if __name__ == "__main__":
    main()
