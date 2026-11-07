"""A MONSTELA ANDANDO, desenhada do zero (o CAIO, nov/2026: "faz do zero"; o
desenho de batalha é dele). A criatura de TELA: a cabeça de monitor preto
com os olhos de LED azul (eles piscam), as orelhas pontudas de canto, o
corpo preto de ombreiras, as mãos amarelas e as pernas.
  k contorno   b preto   B preto claro   d tela   l LED   L LED claro
  y mão   Y mão clara"""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

CORES = {
    "k": (8, 8, 8), "b": (34, 32, 44), "B": (60, 57, 76), "d": (10, 22, 40), "l": (86, 139, 220),
    "L": (160, 200, 255), "y": (249, 240, 107), "Y": (216, 236, 138), "e": (204, 182, 68),
}

FRENTE = [
    "..kk.......kk",
    "..kBk.....kBk",
    "..kbbkkkkkbbk",
    "..kdddddddddk",
    "..kdlldddlldk",
    "..kdlldddlldk",
    "..kdddddddddk",
    "..kddlllllddk",
    "..kdddddddddk",
    "...kkkkkkkkk",
    ".kkkbbbbbbbkkk",
    "kBbbkbbbbbkbbBk",
    "kbbk.kbbbk.kbbk",
    "kyYk.kbbbk.kYyk",
    ".kk.kbbbbbk.kk",
    "....kbbkbbk",
    "....kbbkbbk",
    "...kbbk.kbbk",
    "...kkkk.kkkk",
]

COSTAS = [
    "..kk.......kk",
    "..kBk.....kBk",
    "..kbbkkkkkbbk",
    "..kbbbbbbbbbk",
    "..kbBbbbbbBbk",
    "..kbbbbbbbbbk",
    "..kbbbbbbbbbk",
    "..kbbbbbbbbbk",
    "..kbbbbbbbbbk",
    "...kkkkkkkkk",
    ".kkkbbbbbbbkkk",
    "kBbbkbbbbbkbbBk",
    "kbbk.kbbbk.kbbk",
    "kyYk.kbbbk.kYyk",
    ".kk.kbbbbbk.kk",
    "....kbbkbbk",
    "....kbbkbbk",
    "...kbbk.kbbk",
    "...kkkk.kkkk",
]

LADO = [
    "....kk",
    "....kBk",
    "..kkkbbkk",
    ".kdddddbk",
    ".klldddbk",
    ".klldddbk",
    ".kddddddk",
    ".klllddbk",
    ".kddddddk",
    "..kkkkkk",
    "...kkbbbkk",
    "...kBbbbbk",
    "...kbbbbbk",
    "..kyYkbbbk",
    "...kkbbbbk",
    "....kbbkbk",
    "....kbbkbk",
    "...kbbkbbk",
    "...kkkkkkk",
]

PATAS_FRENTE = ((3, 7), (8, 12), 15)
PATAS_LADO = ((3, 7), (7, 11), 15)

if __name__ == "__main__":
    from comum import salvar
    salvar(1104, FRENTE, COSTAS, LADO, CORES, PATAS_FRENTE, PATAS_LADO, fogo=[("l", "L")], previa=os.environ.get("PREVIA"))
    print("MONSTELA: andar feito")
