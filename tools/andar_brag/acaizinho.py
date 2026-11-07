"""O AÇAIZINHO ANDANDO (pulando), desenhado do zero (o CAIO, nov/2026: "faz do
zero"). O cacho de açaí: as bolinhas roxas empilhadas com o brilho, as
folhinhas em cima, os olhos e o sorriso. Sem perna: anda pulando.
  k contorno   b açaí   B brilho   d açaí escuro   L folha clara   l folha
  G folha escura   w branco do olho"""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

CORES = {
    "k": (24, 20, 32), "b": (74, 36, 88), "B": (150, 96, 170), "d": (44, 20, 56),
    "L": (137, 191, 127), "l": (64, 121, 53), "G": (46, 110, 50), "w": (250, 250, 250),
}

FRENTE = [
    "........k.k",
    ".....k.kLkLk.k",
    "....kLkLlLlLkLk",
    "...kLlLlllllLlLk",
    "....kllkllkllk",
    ".....kkkGkkk",
    "....kbbkbbkbbk",
    "...kbBbkbBbkbBbk",
    "..kbbbbbbbbbbbbbk",
    "..kbbkwkbbbkwkbbk",
    "..kbbkkkbbbkkkbbk",
    "..kbBbbbbbbbbbBbk",
    "...kbbbbkkkbbbbk",
    "...kbBbbbbbbbBbk",
    "....kbbdbbbdbbk",
    ".....kbbkbbkbk",
    "......kbdbdbk",
    ".......kkkkk",
]

COSTAS = [
    "........k.k",
    ".....k.kLkLk.k",
    "....kLkLlLlLkLk",
    "...kLlLlllllLlLk",
    "....kllkllkllk",
    ".....kkkGkkk",
    "....kbbkbbkbbk",
    "...kbBbkbBbkbBbk",
    "..kbbbbbbbbbbbbbk",
    "..kbBbkbBbkbBbbbk",
    "..kbbbbbbbbbbbbbk",
    "..kbbkbBbkbBbkbbk",
    "...kbbbbbbbbbbbk",
    "...kbBbkbBbkbBbk",
    "....kbbdbbbdbbk",
    ".....kbbkbbkbk",
    "......kbdbdbk",
    ".......kkkkk",
]

LADO = [
    ".......k.k",
    "....k.kLkLk",
    "...kLkLlLlLk",
    "..kLlLlllllLk",
    "...kllkllkk",
    "....kkkGkk",
    "...kbbkbbkbk",
    "..kbBbkbBbkbk",
    ".kbbbbbbbbbbbk",
    ".kbkwkbbbbbbbk",
    ".kbkkkbbbBbbbk",
    ".kbBbbbbbbbbbk",
    "..kkkbbbbBbbk",
    "..kbBbbbbbbbk",
    "...kbbdbbbdbk",
    "....kbbkbbkk",
    ".....kbdbdk",
    "......kkkk",
]

if __name__ == "__main__":
    from comum import salvar
    salvar(1047, FRENTE, COSTAS, LADO, CORES, ((0, 0),) * 2, ((0, 0),) * 2, previa=os.environ.get("PREVIA"), pulo=True)
    print("AÇAIZINHO: andar feito")
