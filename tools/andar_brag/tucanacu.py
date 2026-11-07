"""O TUCANAÇU ANDANDO, desenhado do zero (o CAIO, nov/2026: "faz do zero").
O tucano grande: as ASAS abertas pra cima em V (como no desenho de batalha),
o bico laranja comprido, o peito creme, a faixa vermelha e os pés azuis.
As asas batem no passo: no quadro do pé elas sobem um pouco (o corpo sobe
junto, pelas regras de tools/andar_brag/comum.py). Mesmas letras do BIQUINHO."""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from biquinho import CORES  # noqa: E402

FRENTE = [
    "kkk......................kkk",
    "kbbk....................kbbk",
    "kbbbk..................kbbbk",
    ".kbbbk................kbbbk",
    ".kbgbbk..............kbbgbk",
    "..kbgbbk...kkkkkk...kbbgbk",
    "..kbbgbbk.kbbbbbbk.kbbgbbk",
    "...kbbgbbkbuuubbuuubkbgbbk",
    "...kbbbgbkbukubbukubkgbbbk",
    "....kbbbbkbuuuyyuuubkbbbk",
    "....kbbbbbkbbkOOkbbkbbbbbk",
    ".....kbbbbbbkoOOokbbbbbbk",
    ".....kbbbbbkooooookbbbbbk",
    "......kbbbbkooooookbbbbk",
    "......kbbbbbkooookbbbbbk",
    ".......kbbbcckkookccbbbk",
    "........kbcCCcckkcCCcbk",
    "........kbcCCcccccCCcbk",
    "........kbccccccccccbbk",
    "........kbcccccccccbbk",
    "........kBbccrrrrccbBk",
    ".........kBbbbbbbbbBk",
    "..........kkBBBBBBkk",
    "...........kUk..kUk",
    "..........kUUk..kUUk",
    "..........kkkk..kkkk",
]

COSTAS = [
    "kkk......................kkk",
    "kbbk....................kbbk",
    "kbbbk..................kbbbk",
    ".kbbbk................kbbbk",
    ".kbgbbk..............kbbgbk",
    "..kbgbbk...kkkkkk...kbbgbk",
    "..kbbgbbk.kbgbbbbk.kbbgbbk",
    "...kbbgbbkbgbbbbbbkkbgbbk",
    "...kbbbgbkbbbbbbbbbkgbbbk",
    "....kbbbbkbbbbbbbbbkbbbk",
    "....kbbbbbkbbbbbbbkbbbbbk",
    ".....kbbbbbbbbbbbbbbbbbk",
    ".....kbbbbbbbbbbbbbbbbbk",
    "......kbbbbbbbbbbbbbbbk",
    "......kbbbbbbbbbbbbbbbk",
    ".......kbbbbbbbbbbbbbk",
    "........kbbbbbbbbbbbk",
    "........kbbbbbbbbbbbk",
    "........kbbbbkkkbbbbk",
    "........kbbbkbbbkbbbk",
    "........kBbbkbbbkbbBk",
    ".........kBkbbbbbkBk",
    "..........kkBBBBBkk",
    "...........kUk..kUk",
    "..........kUUk..kUUk",
    "..........kkkk..kkkk",
]

LADO = [
    "..............kkk",
    "..............kbbk",
    "..............kbbbk",
    "..............kbgbbk",
    "..............kbgbbk",
    "...........kkkkbbgbk",
    ".........kkbgbbbbgbbk",
    "........kbgbbbbbbbgbk",
    ".......kuuubbbbbbbbgbk",
    ".......kukubbbbbbbbbgbk",
    "...kkkkkuuubbbbbbbbbbbk",
    "..kOOOOOOOkbbbbbbbbbbbk",
    ".kOOooooooobbbbbbbbbbbk",
    "kooooooooooobbbbbbbbbbk",
    ".kkkooooooookcbbbbbbbbbk",
    "....kkkkkkkccCcbbbbbbbbkk",
    "..........kcCCcbbbbbbbbbbk",
    "..........kccccbbbbbbbbbbk",
    "..........krrrcbbbbbbbbkk",
    "...........kcccbbbbbBBk",
    "............kkBBBBBBkk",
    "..............kUk.kUk",
    ".............kUUkkUUk",
    ".............kkkkkkkk",
]

PATAS_FRENTE = ((9, 15), (16, 22), 23)
PATAS_LADO = ((12, 17), (17, 22), 21)

if __name__ == "__main__":
    from comum import salvar
    salvar(1042, FRENTE, COSTAS, LADO, CORES, PATAS_FRENTE, PATAS_LADO, previa=os.environ.get("PREVIA"))
    print("TUCANAÇU: andar feito")
