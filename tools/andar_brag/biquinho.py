"""O BIQUINHO ANDANDO, desenhado do zero (o CAIO, nov/2026: "faz do zero").
O filhote de tucano: a bolinha preta com o peito creme, o BICÃO laranja (maior
que a cabeça), o olho com o anel azul, a faixinha vermelha e os pezinhos azuis.
  k contorno   b preto   B preto escuro   g cinza (o brilho da pena)
  c creme   C creme claro   o bico   O bico claro   y amarelo   u anel azul
  U pé azul   r vermelho   w brilho"""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

CORES = {
    "k": (24, 20, 32), "b": (44, 40, 52), "B": (33, 30, 38), "g": (107, 104, 113),
    "c": (252, 236, 180), "C": (253, 242, 202), "o": (248, 140, 36), "O": (255, 196, 90),
    "y": (252, 206, 60), "u": (90, 170, 230), "U": (67, 104, 148), "r": (220, 50, 50), "w": (250, 250, 250),
}

FRENTE = [
    ".......kkkkkk",
    ".....kkbgbbbbkk",
    "....kbgbbbbbbbbk",
    "...kbuuubbbbuuubk",
    "...kbukubbbbukubk",
    "...kbuuubyybuuubk",
    "...kbbbbkOOkbbbbk",
    "..kbbbbkoOOokbbbbk",
    "..kbbbkooooookbbbk",
    "..kbbbkooooookbbbk",
    "..kbbbbkooookbbbbk",
    ".kbbbcckkookkccbbbk",
    ".kbbcCCcckkccCCcbbk",
    ".kbbcCCcccccCCccbbk",
    ".kBbbcccrrrrcccbbBk",
    "..kBbbbcccccccbbBk",
    "...kkBBbbbbbbBBkk",
    ".....kUk....kUk",
    "....kUUk....kUUk",
    "....kkkk....kkkk",
]

COSTAS = [
    ".......kkkkkk",
    ".....kkbgbbbbkk",
    "....kbgbbbbbbbbk",
    "...kbgbbbbbbbbbbk",
    "...kbbbbbbbbbbbbk",
    "...kbbbbbbbbbbbbk",
    "...kbbbbbbbbbbbbk",
    "..kbbgbbbbbbbbbbbk",
    "..kbgbbbbbbbbbbbbk",
    "..kbbbbbbbbbbbbbbk",
    "..kbbbbbbbbbbbbbbk",
    ".kbbbbbbbbbbbbbbbbk",
    ".kbbbbbbbbbbbbbbbbk",
    ".kbbbbbbkkkkbbbbbbk",
    ".kBbbbbkbbbbkbbbbBk",
    "..kBbbkbbbbbbkbbBk",
    "...kkBkbbbbbbkBkk",
    ".....kUkkkkkkUk",
    "....kUUk....kUUk",
    "....kkkk....kkkk",
]

LADO = [
    "...........kkkkk",
    ".........kkbgbbbkk",
    "........kbgbbbbbbbk",
    ".......kbbbbbbbbbbbk",
    "......kuuubbbbbbbbbk",
    "......kukubbbbbbbbbk",
    "..kkkkkuuubbbbbbbbbbk",
    ".kOOOOOOkbbbbbbbbbbbk",
    "kOOooooooobbbbbbbbbbk",
    "kooooooooobbbbbbbbbbk",
    ".kkoooooookcbbbbbbbbbk",
    "...kkkkkkccCcbbbbbbbbkk",
    "........kcCCcbbbbbbbbbbk",
    "........kccccbbbbbbbbbbk",
    "........krrrcbbbbbbbbkk",
    ".........kcccbbbbbBBk",
    "..........kkBBBBBBkk",
    "............kUk.kUk",
    "...........kUUkkUUk",
    "...........kkkkkkkk",
]

PATAS_FRENTE = ((3, 9), (11, 17), 17)
PATAS_LADO = ((10, 15), (15, 20), 17)

if __name__ == "__main__":
    from comum import salvar
    salvar(1041, FRENTE, COSTAS, LADO, CORES, PATAS_FRENTE, PATAS_LADO, previa=os.environ.get("PREVIA"))
    print("BIQUINHO: andar feito")
