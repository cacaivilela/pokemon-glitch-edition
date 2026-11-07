"""O PAUBRASILISCO ANDANDO, desenhado do zero (o CAIO, nov/2026: "faz do zero").
O lobo de pau-brasil: o corpo de madeira escura com as RACHADURAS vermelhas
acesas, a COPA de folha nas costas com as frutinhas amarelas, os chifres de
galho, os olhos amarelos e a boca vermelha cheia de dentes.
As letras do TRONKY mais: w madeira escura, W a mais escura, R vermelho aceso,
d os dentes."""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from tronky import CORES as BASE  # noqa: E402

CORES = {**BASE, "w": (44, 32, 32), "W": (28, 20, 22), "R": (255, 70, 60), "d": (236, 230, 222)}

FRENTE = [
    "...kk..............kk",
    "...kwk............kwk",
    "....kwk..kkkkkk..kwk",
    "....kwwkkggyggykkwwk",
    ".....kwwgGGggGGgwwk",
    "....kkgggyGGGGygggkk",
    "...kggGGggggggggGGggk",
    "..kgyGGgkwwwwwwkgGGygk",
    "..kggggkwwwwwwwwkggggk",
    "...kkkkwywwwwwwywkkkk",
    "......kwyywwwwyywk",
    "......kwwwwRRwwwwk",
    "......kwwRkkkkRwwk",
    "......kwRkddddkRwk",
    "......kwRkRRRRkRwk",
    ".......kwkddddkwk",
    "......kwwwkkkkwwwk",
    ".....kwRwwwwwwwwRwk",
    ".....kwwRwwwwwwRwwk",
    ".....kwwwRwwwwRwwwk",
    ".....kWwwwwwwwwwwWk",
    ".....kWWwkkkkkkwWWk",
    ".....kWWk......kWWk",
    "....kWWWk......kWWWk",
    "....kkkkk......kkkkk",
]

COSTAS = [
    "...kk..............kk",
    "...kwk............kwk",
    "....kwk..kkkkkk..kwk",
    "....kwwkkggyggykkwwk",
    ".....kwwgGGggGGgwwk",
    "....kkgggyGGGGygggkk",
    "...kggGGggyyggggGGggk",
    "..kgyGGggggGGGgggGGygk",
    "..kggggGGGggggyggggggk",
    "..kgyggggGGGGggggGGgk",
    "...kgggyggggGGGgyggk",
    "....kkggggggggggggkk",
    ".....kwwRkkkkkkRwwk",
    ".....kwwwRwwwwRwwwk",
    ".....kwRwwwwwwwwRwk",
    ".....kwwRwwwwwwRwwk",
    ".....kwwwRwwwwRwwwk",
    ".....kwRwwwwwwwwRwk",
    ".....kwwRwwkkwwRwwk",
    ".....kwwwwwkwkwwwwk",
    ".....kWwwwwwkwwwwWk",
    ".....kWWwkkkkkkwWWk",
    ".....kWWk......kWWk",
    "....kWWWk......kWWWk",
    "....kkkkk......kkkkk",
]

LADO = [
    "......kk..........kk",
    "......kwk........kwk",
    ".......kwk.kkkkkkkwk",
    ".......kwwkggyggggkkkk",
    "..kkkkkwwgGGggyGGgggyk",
    ".kwwwwwwkggGGggggGGGgk",
    "kwwywwwwkgyggGGGggggggk",
    "kwwwwwwwwkggggyggGGGgggk",
    "kRkkkwwwwwkkggggggggyggk",
    "kddddkwwwwwwkkkkkkkkkkkwk",
    "kRRRkwwwwRwwwwwwwRwwwwwwk",
    ".kddkwwwRwwwwwwwRwwwwRwwk",
    "..kkwwwwRwwwwwwRwwwwRwwwk",
    "....kwwwwRwwwwwRwwwRwwwwk",
    "....kWwwwwRwwwwwwwRwwwwWk",
    "....kWWwwwwwwwwwwwwwwwWWk",
    "....kWWWkkkkkkkkkkkkkWWWk",
    ".....kWWk.........kWWWk",
    ".....kWWk.........kWWWk",
    "....kWWWk........kWWWWk",
    "....kkkkk........kkkkkk",
]

PATAS_FRENTE = ((3, 10), (14, 21), 22)
PATAS_LADO = ((3, 10), (17, 25), 17)

if __name__ == "__main__":
    from comum import salvar
    salvar(1034, FRENTE, COSTAS, LADO, CORES, PATAS_FRENTE, PATAS_LADO, fogo=[("R", "r")], previa=os.environ.get("PREVIA"))
    print("PAUBRASILISCO: andar feito")
