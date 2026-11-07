"""O SUBMARINUM ANDANDO (boiando aos pulinhos), desenhado do zero (o CAIO,
nov/2026: "faz do zero"). O submarino amarelo: o casco com as escotilhas
redondas, os olhos na frente, o PERISCÓPIO em cima, a faixa azul embaixo e a
hélice atrás (ela gira no pulo).
  k contorno   y amarelo   Y amarelo claro   d amarelo escuro   b azul
  B azul escuro   g metal   G metal escuro   w vidro   e olho"""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

CORES = {
    "k": (24, 20, 32), "y": (246, 200, 52), "Y": (249, 216, 113), "d": (196, 150, 30), "b": (52, 110, 200),
    "B": (38, 81, 148), "g": (170, 178, 192), "G": (108, 116, 132), "w": (113, 154, 216), "W": (250, 250, 250),
    "e": (24, 20, 32),
}

FRENTE = [
    ".......kkk",
    "......kgggk",
    ".......kgk",
    ".......kgk",
    ".....kkkgkkk",
    "...kkYYYyyyykk",
    "..kYYyyyyyyyydk",
    ".kYykWkyyykWkydk",
    ".kyykekyyykekydk",
    ".kyyyyyyyyyyyydk",
    ".kbbbbbbbbbbbbBk",
    ".kBbbbbbbbbbbBBk",
    "..kkBBBBBBBBBkk",
    "....kkkkkkkkk",
]

COSTAS = [
    ".......kkk",
    "......kgggk",
    ".......kgk",
    ".......kgk",
    ".....kkkgkkk",
    "...kkYYYyyyykk",
    "..kYYyyyyyyyydk",
    ".kYyyyyykkyyyydk",
    ".kyyyyykGgkyyydk",
    ".kyyyyykgGkyyydk",
    ".kbbbbbbkkbbbbBk",
    ".kBbbbbbbbbbbBBk",
    "..kkBBBBBBBBBkk",
    "....kkkkkkkkk",
]

LADO = [
    "..........kkk",
    ".........kgggk",
    "..........kgk",
    "..........kgk",
    ".......kkkkgkkkk",
    "....kkkYYYyyyyyykk",
    "..kkYYyyyyyyyyyyyydk.kk",
    ".kYYykWkyykwkykwkyydkkgk",
    "kYyyykekyykwkykwkyyydkgGk",
    "kyyyyyyyyyyyyyyyyyyydkgk",
    "kbbbbbbbbbbbbbbbbbbbBkk",
    ".kBbbbbbbbbbbbbbbbbBBk",
    "..kkBBBBBBBBBBBBBBBkk",
    "....kkkkkkkkkkkkkkk",
]

if __name__ == "__main__":
    from comum import salvar
    salvar(1084, FRENTE, COSTAS, LADO, CORES, ((0, 0),) * 2, ((0, 0),) * 2, fogo=[("g", "G")], previa=os.environ.get("PREVIA"), pulo=True)
    print("SUBMARINUM: andar feito")
