"""O LOROSE ANDANDO (pulando), desenhado do zero (o CAIO, nov/2026: "faz do
zero"). O papagaio verde de bochecha vermelha: o bico curvo amarelo-marrom, o
olho com o anel branco, o peito verde-claro, a asa acenando e o rabo.
  k contorno   g verde   G verde escuro   l verde claro   r vermelho
  b bico   B bico escuro   w branco   e olho   y amarelo"""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

CORES = {
    "k": (24, 20, 32), "g": (60, 170, 70), "G": (44, 126, 52), "D": (36, 118, 52), "l": (128, 200, 135),
    "L": (118, 196, 126), "r": (230, 70, 60), "b": (170, 120, 80), "B": (126, 89, 59), "w": (250, 250, 250),
    "e": (24, 20, 32), "y": (252, 214, 48),
}

FRENTE = [
    "......kkkkk",
    "....kkgggggkk",
    "...kgglllllggk",
    "...kgwkllllwkgk",
    "..kgrwekbbewrgk",
    "..kgrrkbBBkrrgk.kk",
    "..kgggkbBBkgggkkgk",
    "...kGggkbkgggGkgk",
    "..kgkGgglllggGkgk",
    ".kgk.kglllllgkkk",
    ".kk..kglllllgk",
    ".....kGgllgGGk",
    "......kGGGGGk",
    "......kykkyk",
    ".....kyk..kyk",
    ".....kk....kk",
]

COSTAS = [
    "......kkkkk",
    "....kkgggggkk",
    "...kgggggggggk",
    "...kgggggggggk",
    "..kggggggggggGk",
    "..kggggggggggGk",
    "..kgGgggggggGgk.kk",
    "...kGgggggggGkkgk",
    "..kgkGggggggGkgk",
    ".kgk.kgggggGkkk",
    ".kk..kgGgggGk",
    ".....kGGgGGGk",
    "......kGDDGk",
    "......kGDGk",
    "......kykkyk",
    ".....kyk..kyk",
    ".....kk....kk",
]

LADO = [
    ".....kkkkk",
    "...kkgggggk",
    "..kgglllgggk",
    "..kgwkllgggk",
    ".kbwekllgggk",
    "kbBkrrrggggGk",
    "kBkkrrgggggGk",
    ".kk.kglllgggGk",
    "....kgllllggGGk",
    "....kgllllgGGGGk",
    "....kGgllgGGkkGGk",
    ".....kGGGGGk..kGk",
    "......kykyk....kk",
    ".....kyk.kyk",
    ".....kk...kk",
]

if __name__ == "__main__":
    from comum import salvar
    salvar(1081, FRENTE, COSTAS, LADO, CORES, ((0, 0),) * 2, ((0, 0),) * 2, previa=os.environ.get("PREVIA"), pulo=True)
    print("LOROSE: andar feito")
