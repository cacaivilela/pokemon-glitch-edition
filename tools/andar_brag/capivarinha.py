"""A CAPIVARINHA ANDANDO, desenhada do zero (o CAIO, nov/2026: "faz do zero").
A capivara pequena com o PASSARINHO amarelo sentado na cabeça: a cabeça
quadrada de capivara, as orelhinhas, o focinho grande e escuro, o corpo
redondo e as patinhas curtas.
  k contorno   c pelo   C pelo claro   d pelo escuro   D o mais escuro
  n o focinho   y o passarinho   Y a asa dele   e olho   w brilho"""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

CORES = {
    "k": (24, 20, 32), "c": (170, 102, 64), "C": (196, 148, 121), "d": (126, 75, 47), "D": (92, 56, 40),
    "n": (89, 52, 34), "y": (250, 206, 50), "Y": (200, 140, 30), "e": (24, 20, 32), "w": (250, 250, 250),
    "o": (230, 120, 40),
}

FRENTE = [
    "..........kk",
    ".........kyyk",
    "........kykyyk",
    "........kyyyok",
    "....kk...kYYk...kk",
    "...kdck.kkkkk..kcdk",
    "...kkcckccccckkcckk",
    "....kcccccccccccck",
    "...kcCcccccccccCcck",
    "...kcCkkcccccckkCck",
    "...kcckwkcccckwkcck",
    "...kcccccccccccccck",
    "...kccCCddddddCCcck",
    "...kcCdnnddddnndCck",
    "....kcddddddddddck",
    "....kkcCcccccCckkk",
    "...kcckcccccccckcck",
    "...kdckdcccccccdkcdk",
    "...kddkkdddddddkkddk",
    "...kDDk.kkkkkkk.kDDk",
    "...kkkk.........kkkk",
]

COSTAS = [
    "..........kk",
    ".........kyyk",
    "........kyyyyk",
    "........kYYYyk",
    "....kk...kYYk...kk",
    "...kdck.kkkkk..kcdk",
    "...kkcckccccckkcckk",
    "....kcccccccccccck",
    "...kccccccccccccccck",
    "...kccccdcccccdccccck",
    "...kcccccccccccccccck",
    "...kccccccccccccccck",
    "...kcccccdddddcccccck",
    "...kccccddddddddcccck",
    "....kcccdddddddccck",
    "....kkcccccccccckkk",
    "...kcckcccccccckcck",
    "...kdckdcccccccdkcdk",
    "...kddkkdddddddkkddk",
    "...kDDk.kkkkkkk.kDDk",
    "...kkkk.........kkkk",
]

LADO = [
    ".......kk",
    "......kyyk",
    ".....kyykyk",
    ".....kyyyyok",
    "...kk.kYYk",
    "..kdckkkkkkk",
    ".kkcccccccccck",
    "kccCcccccccccdk",
    "kcCcckwkccccccdkkkkkkk",
    "kccccckkccccccdcccccccck",
    "knnccccccccccdcccccccccck",
    "knnnccccccccdccccccccccdk",
    ".kkkdddddddddcccccccccddk",
    "...kkdddddddccccccccccddk",
    ".....kdcccccccccccccdddk",
    ".....kddcccccccccccdddk",
    ".....kdddkkkkkkkkkddddk",
    ".....kddk.......kddk",
    ".....kDDk.......kDDk",
    ".....kkkk.......kkkk",
]

PATAS_FRENTE = ((3, 9), (14, 21), 17)
PATAS_LADO = ((5, 10), (16, 22), 17)

if __name__ == "__main__":
    from comum import salvar
    salvar(1039, FRENTE, COSTAS, LADO, CORES, PATAS_FRENTE, PATAS_LADO, previa=os.environ.get("PREVIA"))
    print("CAPIVARINHA: andar feito")
