"""O CONCRETÃO ANDANDO, desenhado do zero (o CAIO, nov/2026: "faz do zero").
O robô de concreto: a cabeça de capacete com o VISOR de olhos ciano, o peito
de blocos (cada bloco uma tecla), os braços grossos e as pernas de bloco.
  k contorno   c concreto   C concreto claro   s sombra   S sombra escura
  v visor   n olho ciano   d tecla escura"""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

CORES = {
    "k": (24, 20, 32), "c": (228, 228, 220), "C": (236, 236, 230), "s": (176, 176, 172), "S": (130, 132, 136),
    "v": (46, 64, 84), "n": (80, 220, 220), "d": (130, 130, 127),
}

FRENTE = [
    "......kkkkkkk",
    "....kkCCCCcccskk",
    "...kCCccccccccssk",
    "...kvvvvvvvvvvvvk",
    "...kvnnvvvvvvnnvk",
    "...kvvvvvvvvvvvvk",
    "...kcccccccccccsk",
    ".kkkkkkkkkkkkkkkkkk",
    "kCck.kCcdcdcdcsk.kcsk",
    "kcck.kccccccccsk.kcsk",
    "kcck.kcdcdcdcdsk.kcsk",
    "kcck.kccccccccsk.kcsk",
    "kssk.kSSSSSSSSSk.kSSk",
    ".kk..kkkkkkkkkkk..kk",
    ".....kCcsk..kCcsk",
    ".....kccsk..kccsk",
    ".....kSSSk..kSSSk",
    ".....kkkkk..kkkkk",
]

COSTAS = [
    "......kkkkkkk",
    "....kkCCCCcccskk",
    "...kCCccccccccssk",
    "...kcccccccccccsk",
    "...kcccccccccccsk",
    "...kcccccccccccsk",
    "...kcccccccccccsk",
    ".kkkkkkkkkkkkkkkkkk",
    "kCck.kCcccccccsk.kcsk",
    "kcck.kccssssccsk.kcsk",
    "kcck.kccsddsccsk.kcsk",
    "kcck.kccssssccsk.kcsk",
    "kssk.kSSSSSSSSSk.kSSk",
    ".kk..kkkkkkkkkkk..kk",
    ".....kCcsk..kCcsk",
    ".....kccsk..kccsk",
    ".....kSSSk..kSSSk",
    ".....kkkkk..kkkkk",
]

LADO = [
    "......kkkkkk",
    "....kkCCCcccsk",
    "...kCCcccccccsk",
    "...kvvvvccccsk",
    "...kvnnvccccsk",
    "...kvvvvccccsk",
    "...kccccccccsk",
    "...kkkkkkkkkkkk",
    "....kCcdcckCcsk",
    "....kccccckccsk",
    "....kcdcdckccsk",
    "....kccccckccsk",
    "....kSSSSSkSSSk",
    "....kkkkkkkkkk",
    "....kCcsk.kCcsk",
    "....kccsk.kccsk",
    "....kSSSk.kSSSk",
    "....kkkkk.kkkkk",
]

PATAS_FRENTE = ((5, 10), (12, 17), 14)
PATAS_LADO = ((4, 9), (10, 15), 14)

if __name__ == "__main__":
    from comum import salvar
    salvar(1074, FRENTE, COSTAS, LADO, CORES, PATAS_FRENTE, PATAS_LADO, previa=os.environ.get("PREVIA"))
    print("CONCRETÃO: andar feito")
