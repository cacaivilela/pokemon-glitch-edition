"""O BOITATÁ ANDANDO (rastejando aos pulinhos), desenhado do zero (o CAIO,
nov/2026: "faz do zero"). A cobra de fogo azul: o corpo enrolado azul com as
pintinhas, a crista de FOGO laranja nas costas (tremula) e os olhões
amarelos de fogo.
  k contorno   b azul   B azul claro   d azul escuro   D azul mais escuro
  r vermelho   o laranja   y amarelo   Y amarelo claro   e pupila"""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

CORES = {
    "k": (20, 16, 48), "b": (40, 84, 220), "B": (90, 170, 255), "d": (30, 62, 163), "D": (60, 36, 140),
    "r": (226, 60, 32), "o": (250, 130, 36), "y": (255, 210, 60), "Y": (255, 246, 190), "e": (20, 16, 48),
}

FRENTE = [
    "....k.k..k.k",
    "...krkokrkok",
    "...kookyoykk",
    "..kkkkkkkkkkk",
    ".kbbbbbbbbbbbk",
    "kbkyyykbkyyykbk",
    "kbkyeykbkyeykbk",
    "kbkyyykbkyyykbk",
    "kbbkkkbbbkkkbbk",
    ".kbbbBbbbBbbbk",
    "..kbbbkkkbbbk",
    "...kkdbbbdkk",
    "..kkobbbbbbokk",
    ".kobbBbbbbBbbok",
    "korbbbbBbbbbbrok",
    "kobbBbbbbbbBbbok",
    ".kdbbbbbbbbbbdk",
    "..kkdddddddddkk",
    "....kkkkkkkkk",
]

COSTAS = [
    "....k.k..k.k",
    "...krkokrkok",
    "...kookyoykk",
    "..kkooyyookkk",
    ".kbbokyyobbbbk",
    "kbbbbkoobbbbbbk",
    "kbbBbbkobbBbbbk",
    "kbbbbbbobbbbbbk",
    "kbbbbbbobbbbbbk",
    ".kbbbBbobbBbbk",
    "..kbbbbobbbbk",
    "...kkdbobdkk",
    "..kkorbobbrokk",
    ".korbbBbbbBbbok",
    "korbbbbBbbbbbrok",
    "kobbBbbbbbbBbbok",
    ".kdbbbbbbbbbbdk",
    "..kkdddddddddkk",
    "....kkkkkkkkk",
]

LADO = [
    "....k.k..k.k",
    "...krkokrkok",
    "...kookyoykk",
    "..kkkkkkkkkk",
    ".kbbbbbbbbbbk",
    "kyyykbbbbbbbk",
    "kyeykbbBbbbbk",
    "kyyykbbbbbbbk",
    "kbkkkbbbbbbbk",
    "kbbbbbbBbbbk",
    ".kkkbbbbbbk.........k.k",
    "...kkdbbbbbkk....kkrkok",
    "..kkobbbbBbbbokkkobbbook",
    ".kobbBbbbbbBbbbbbBbbbbbk",
    "korbbbbBbbbbbbBbbbbbbdk",
    "kobbBbbbbbbBbbbbbbbbddk",
    ".kdbbbbbbbbbbbbbbbddkk",
    "..kkdddddddddddddkk",
    "....kkkkkkkkkkkkk",
]

if __name__ == "__main__":
    from comum import salvar
    salvar(1076, FRENTE, COSTAS, LADO, CORES, ((0, 0),) * 2, ((0, 0),) * 2, fogo=[("o", "y"), ("r", "o")], previa=os.environ.get("PREVIA"), pulo=True)
    print("BOITATÁ: andar feito")
