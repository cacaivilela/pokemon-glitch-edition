"""O CAPIVARÃO ANDANDO, desenhado do zero (o CAIO, nov/2026: "faz do zero").
A capivarona: grande e quadrada, com o PASSARINHO amarelo (de olho de
máscara) nas costas. Mesmas letras da CAPIVARINHA."""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from capivarinha import CORES  # noqa: E402

FRENTE = [
    "..................kkk",
    ".................kyyyk",
    "................kykkyk",
    "................kyyyyok",
    "......kkk.......kkYYkk..kkk",
    ".....kdcck.....kkkkkk..kccdk",
    ".....kdcckkkkkkccccckkkcccdk",
    "......kkcccccccccccccccckk",
    ".....kcccCcccccccccccCccck",
    ".....kccCCcccccccccccCCcck",
    ".....kcCkkkccccccccckkkCck",
    ".....kcckwkccccccccckwkcck",
    ".....kccccccccccccccccccck",
    ".....kcccCCCddddddddCCCccck",
    ".....kccCddnnnddddnnnddCck",
    ".....kccddddnnddddnnddddck",
    "......kcdddddddddddddddck",
    "......kkccCCddddddddCCckk",
    ".....kcckccccccccccccckcck",
    "....kccckcccccccccccccckccck",
    "....kdcckdccccccccccccdkccdk",
    "....kddckddcccccccccccdkcddk",
    "....kdddkkddddddddddddkkdddk",
    "....kDDDk.kkkkkkkkkkkk.kDDDk",
    "....kkkkk..............kkkkk",
]

COSTAS = [
    "......kkk.......kkkk....kkk",
    ".....kdcck.....kyyyyk..kccdk",
    ".....kdcckkkkkkkYkkYkkkcccdk",
    "......kkccccccckyyyyokcckk",
    ".....kccccccccckkYYkkccccck",
    ".....kcccccccccckkkkcccccck",
    ".....kcccccccccccccccccccck",
    ".....kccccccccccccccccccccck",
    ".....kcccccccccccccccccccck",
    ".....kccccdccccccccccdcccck",
    ".....kcccccccccccccccccccck",
    ".....kcccccccccccccccccccck",
    ".....kccccccdddddddcccccccck",
    ".....kcccccddddddddddcccccck",
    "......kccccddddddddddcccck",
    "......kkcccccccccccccccckk",
    ".....kcckccccccccccccckcck",
    "....kccckcccccccccccccckccck",
    "....kdcckdccccccccccccdkccdk",
    "....kddckddcccccccccccdkcddk",
    "....kdddkkddddddddddddkkdddk",
    "....kDDDk.kkkkkkkkkkkk.kDDDk",
    "....kkkkk..............kkkkk",
]

LADO = [
    "....................kkk",
    "...................kyyyk",
    "..................kykkyk",
    "..................kyyyyok",
    ".....kkk.......kkkkYYkkkk",
    "....kdcckkkkkkkcccckkkcccckk",
    "...kkcccccccccdcccccccccccccck",
    "..kccCccccccccdcccccccccccccccck",
    ".kcCcckwkcccccdccccccccccccccccdk",
    ".kcccckkcccccdcccccccccccccccccdk",
    "knnccccccccccdccccccccccccccccddk",
    "knnnccccccccdccccccccccccccccdddk",
    "knnnccccccccdcccccccccccccccccddk",
    ".kkkddddddddddcccccccccccccccdddk",
    "....kkdddddddcccccccccccccccddddk",
    "......kddcccccccccccccccccccdddk",
    "......kdddcccccccccccccccccdddk",
    "......kddddkkkkkkkkkkkkkkkddddk",
    "......kdddk.............kdddk",
    "......kdddk.............kdddk",
    "......kDDDk.............kDDDk",
    "......kkkkk.............kkkkk",
]

PATAS_FRENTE = ((4, 10), (22, 29), 23)
PATAS_LADO = ((6, 12), (24, 31), 18)

if __name__ == "__main__":
    from comum import salvar
    salvar(1040, FRENTE, COSTAS, LADO, CORES, PATAS_FRENTE, PATAS_LADO, previa=os.environ.get("PREVIA"))
    print("CAPIVARÃO: andar feito")
