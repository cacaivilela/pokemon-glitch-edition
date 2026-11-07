"""O DESTROIUM ANDANDO (na esteira, aos trancos), desenhado do zero (o CAIO,
nov/2026: "faz do zero"). A máquina destruidora: o casco de ferro cinza com
as CHAMINÉS soltando fumaça, a boca vermelha de dentes, os olhos acesos, a
SERRA redonda do lado (ela gira) e a esteira enferrujada embaixo.
  k contorno   m ferro   M ferro claro   d ferro escuro   r boca   w dente
  y olho aceso   f ferrugem   F ferrugem clara   s serra   S serra clara   g fumaça"""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

CORES = {
    "k": (14, 8, 18), "m": (116, 118, 132), "M": (176, 180, 192), "d": (72, 72, 84), "D": (42, 40, 50),
    "r": (200, 40, 50), "w": (240, 236, 230), "y": (255, 200, 60), "f": (146, 74, 40), "F": (190, 110, 60),
    "s": (127, 127, 135), "S": (200, 204, 214), "g": (112, 107, 116),
}

FRENTE = [
    "...kgk......kgk",
    "..kgggk....kgggk",
    "...kdk......kdk",
    "...kdk......kdk",
    ".kkkdkkkkkkkkdkkk",
    ".kMmmmmmmmmmmmmdk",
    ".kmmkyykmmkyykmdk",
    ".kmmkkkkmmkkkkmdk",
    ".kmkwkwkwkwkwkmdk",
    ".kmkrrrrrrrrrkmdk",
    ".kmkwkwkwkwkwkmdk",
    ".kmmmmmmmmmmmmmdk",
    ".kdddddddddddddDk",
    "kfkkkkkkkkkkkkkkfk",
    "kFfFfFfFfFfFfFfFfk",
    "kfFfFfFfFfFfFfFfFk",
    ".kkkkkkkkkkkkkkkk",
]

COSTAS = [
    "...kgk......kgk",
    "..kgggk....kgggk",
    "...kdk......kdk",
    "...kdk......kdk",
    ".kkkdkkkkkkkkdkkk",
    ".kMmmmmmmmmmmmmdk",
    ".kmmmmmdddmmmmmdk",
    ".kmmmmdkkkdmmmmdk",
    ".kmmmmdkfkdmmmmdk",
    ".kmmmmdkkkdmmmmdk",
    ".kmmmmmdddmmmmmdk",
    ".kmmmmmmmmmmmmmdk",
    ".kdddddddddddddDk",
    "kfkkkkkkkkkkkkkkfk",
    "kFfFfFfFfFfFfFfFfk",
    "kfFfFfFfFfFfFfFfFk",
    ".kkkkkkkkkkkkkkkk",
]

LADO = [
    ".......kgk.kgk",
    "......kgggkgggk",
    ".......kdk.kdk",
    ".......kdk.kdk",
    "...kkkkkdkkkdkkk",
    "..kMmmmmmmmmmmmdk",
    ".kmkyykmmmmmmmmdk",
    "kskkkkkmmmmmmmmdk",
    "kSskwkwmmmmmmmmdk",
    "ksSkrrrmmmmmmmmdk",
    "kSskwkwmmmmmmmmdk",
    ".kkmmmmmmmmmmmmdk",
    "..kddddddddddddDk",
    ".kfkkkkkkkkkkkkkfk",
    ".kFfFfFfFfFfFfFfFk",
    ".kfFfFfFfFfFfFfFfk",
    "..kkkkkkkkkkkkkkk",
]

if __name__ == "__main__":
    from comum import salvar
    salvar(1090, FRENTE, COSTAS, LADO, CORES, ((0, 0),) * 2, ((0, 0),) * 2, fogo=[("f", "F"), ("s", "S")], previa=os.environ.get("PREVIA"), pulo=True)
    print("DESTROIUM: andar feito")
