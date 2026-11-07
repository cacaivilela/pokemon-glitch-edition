"""O VOLTABUM ANDANDO (pulando), desenhado do zero (o CAIO, nov/2026: "faz do
zero"; o desenho de batalha é dele). A bomba elétrica: a bola preta com o
RAIO amarelo, o pavio aceso em cima (a chama tremula) e o punho laranja.
  k contorno   b bomba   B brilho da bomba   y raio   Y raio escuro
  o chama   r chama vermelha   O punho   e olho"""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

CORES = {
    "k": (2, 2, 2), "b": (8, 8, 8), "B": (60, 60, 64), "y": (208, 174, 22), "Y": (150, 120, 10),
    "o": (245, 110, 0), "r": (168, 36, 48), "O": (232, 139, 36), "D": (73, 33, 0), "e": (250, 250, 250),
}

FRENTE = [
    ".......kok",
    "......korok",
    ".......kok",
    "......kDk",
    "....kkkkkkk",
    "...kbBBbbbbbk",
    "..kbBbbbbbbbbk",
    ".kbBbbbbyybbbbk",
    ".kbbbbbyybbbbbk",
    ".kbbbbyyyyybbbk",
    ".kbbbbbbyybbbbk",
    ".kbbbbbyybbbbbk",
    "..kbbbbybbbbbkkk",
    "...kbbbbbbbbkOOOk",
    "....kkkkkkkk.kOOk",
    ".............kkk",
]

COSTAS = [
    ".......kok",
    "......korok",
    ".......kok",
    "......kDk",
    "....kkkkkkk",
    "...kbBBbbbbbk",
    "..kbBbbbbbbbbk",
    ".kbBbbbbbbbbbbk",
    ".kbbbbbbbbbbbbk",
    ".kbbbbbbbbbbbbk",
    ".kbbbbbbbbbbbbk",
    ".kbbbbbbbbbbbbk",
    "kkkbbbbbbbbbbk",
    "kOOOkbbbbbbbbk",
    "kOOk.kkkkkkkk",
    ".kkk",
]

LADO = [
    ".......kok",
    "......korok",
    ".......kok",
    "......kDk",
    "....kkkkkkk",
    "...kbBBbbbbbk",
    "..kbBbbbbbbbbk",
    ".kbBbbybbbbbbbk",
    ".kbbbyybbbbbbbk",
    ".kbbyyyybbbbbbk",
    ".kbbbbyybbbbbbk",
    ".kbbbyybbbbbbbk",
    "kkkbbybbbbbbbk",
    "kOOOkbbbbbbbk",
    "kOOkkkkkkkkk",
    ".kkk",
]

if __name__ == "__main__":
    from comum import salvar
    salvar(1102, FRENTE, COSTAS, LADO, CORES, ((0, 0),) * 2, ((0, 0),) * 2, fogo=[("o", "r"), ("y", "Y")], previa=os.environ.get("PREVIA"), pulo=True)
    print("VOLTABUM: andar feito")
