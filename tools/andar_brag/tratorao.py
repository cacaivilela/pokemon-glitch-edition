"""O TRATORÃO ANDANDO (rodando aos solavancos), desenhado do zero (o CAIO,
nov/2026: "faz do zero"). O trator bravo: o capô VERMELHO com os olhos de
farol e a grade de dentes, a cabine verde, o banco, a chaminé soltando fumaça
e as rodonas pretas de calota amarela.
  k contorno   r vermelho   R vermelho claro   v verde   n pneu   N pneu claro
  y calota   g metal   G fumaça   w olho   e pupila"""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

CORES = {
    "k": (24, 20, 32), "r": (214, 50, 44), "R": (226, 112, 107), "v": (60, 150, 64), "n": (50, 46, 52),
    "N": (112, 109, 113), "y": (246, 196, 40), "g": (37, 34, 38), "G": (200, 196, 206), "w": (250, 250, 250),
    "e": (24, 20, 32),
}

FRENTE = [
    "........kGGk",
    ".......kGGGk",
    "........kgk",
    "....kkkkkgkkkk",
    "...kvvvvvvvvvvk",
    "...kvvvvvvvvvvk",
    "..kkkkkkkkkkkkkk",
    "..kRrrrrrrrrrrrk",
    "..krkwwkrrkwwkrk",
    "..krkwekrrkewkrk",
    "..krrkkrrrrkkrrk",
    "kkkrkwkwkwkwkrkkk",
    "knNkrrrrrrrrrrkNnk",
    "knnkkkkkkkkkkkknnk",
    "knyk..........kynk",
    "knnk..........knnk",
    ".kk............kk",
]

COSTAS = [
    "........kGGk",
    ".......kGGGk",
    "........kgk",
    "....kkkkkgkkkk",
    "...kvvvvvvvvvvk",
    "...kvvkkkkkkvvk",
    "..kkkkknnnnkkkkk",
    "..kRrrkknnkkrrrk",
    "..krrrrrrrrrrrrk",
    "..krrrrrrrrrrrrk",
    "kkkkrrrrrrrrrrkkk",
    "knnNkrrrrrrrrkNnnk",
    "knnnkkkkkkkkkknnnk",
    "knyyk........kyynk",
    "knnnk........knnnk",
    "knnnk........knnnk",
    ".kkk..........kkk",
]

LADO = [
    "...kGGk",
    "..kGGGk",
    "...kgk",
    "...kgk...kkkkkkkk",
    "...kgk..kvvvvvvvk",
    "..kkkkkkkvkkkkkvk",
    ".kRrrrrrrkvkgkkvk",
    "kRrwwkrrrkvvvvvvk",
    "krrwekrrrkkkkkkkkk",
    "kwkrrrrrrrrrrrrrrk",
    "kkwkrrrrrrrrrrrkkkkk",
    "kwkkkkkkkkkkkkknnnnk",
    "..knnnk......knNNNnnk",
    ".knNNnnk....knNyyyNnk",
    ".knNyNnk....knNyyyNnk",
    ".knnNnnk....knNNNNnnk",
    "..knnnk......knnnnnk",
    "...kkk........kkkkk",
]

if __name__ == "__main__":
    from comum import salvar
    salvar(1086, FRENTE, COSTAS, LADO, CORES, ((0, 0),) * 2, ((0, 0),) * 2, fogo=[("y", "N")], previa=os.environ.get("PREVIA"), pulo=True)
    print("TRATORÃO: andar feito")
