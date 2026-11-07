"""A BEIJA-FLORZINHA ANDANDO (voando parada no ar), desenhada do zero (o CAIO,
nov/2026: "faz do zero"). O beija-flor verde: o bico fininho comprido, o
peito clarinho, o rabo azul e as ASAS de vidro batendo (no pulo elas trocam
de brilho, como asa batendo rápido).
  k contorno   g verde   G verde escuro   l verde claro   b azul   w asa
  W asa clara   e olho   p bico"""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

CORES = {
    "k": (24, 20, 32), "g": (50, 176, 110), "G": (37, 130, 81), "l": (150, 230, 200), "L": (200, 246, 230),
    "b": (104, 182, 210), "w": (170, 236, 214), "W": (236, 244, 230), "e": (24, 20, 32), "p": (60, 56, 64),
    "r": (236, 60, 120),
}

FRENTE = [
    ".kk...........kk",
    "kWwk...kkk...kwWk",
    "kWwwk.kgggk.kwwWk",
    ".kWwwkgkgkgkwwWk",
    "..kWwkgggggkwWk",
    "...kkkkgpgkkkk",
    "......kgpgk",
    ".....kgLLLgk",
    ".....kgLLLgk",
    ".....kGgLgGk",
    "......kGgGk",
    "......kbbbk",
    ".....kbkbkbk",
    ".....kk.k.kk",
]

COSTAS = [
    ".kk...........kk",
    "kWwk...kkk...kwWk",
    "kWwwk.kgggk.kwwWk",
    ".kWwwkgggggkwwWk",
    "..kWwkgggggkwWk",
    "...kkkkgggkkkk",
    "......kgggk",
    ".....kggggGk",
    ".....kgGgGgk",
    ".....kGgggGk",
    "......kGgGk",
    "......kbbbk",
    ".....kbkbkbk",
    ".....kk.k.kk",
]

LADO = [
    "........kk",
    ".......kWwk",
    "......kWwwk",
    "......kWwk",
    "..kkkk.kkk",
    "kpppkgggggk",
    ".kkkgekgggGk",
    "....kgLLggGkk",
    ".....kLLLgGbbk",
    ".....kgLgGkbbbk",
    "......kGGk.kbbk",
    ".......kk...kk",
]

if __name__ == "__main__":
    from comum import salvar
    salvar(1070, FRENTE, COSTAS, LADO, CORES, ((0, 0),) * 2, ((0, 0),) * 2, fogo=[("w", "W")], previa=os.environ.get("PREVIA"), pulo=True)
    print("BEIJA-FLORZINHA: andar feito")
