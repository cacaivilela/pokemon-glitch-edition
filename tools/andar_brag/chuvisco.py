"""O CHUVISCO ANDANDO, desenhado do zero (o CAIO, nov/2026: "faz do zero").
A TV velha de tubo: a caixa de madeira, a tela de CHUVISCO (o chiado muda no
passo) com os olhos, os botões, a antena de coelho e as perninhas de metal.
  k contorno   t madeira   T madeira escura   L madeira clara   w chiado claro
  s chiado escuro   g metal   G metal claro   b botão   e olho"""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

CORES = {
    "k": (24, 20, 32), "t": (150, 96, 56), "T": (110, 68, 40), "L": (154, 124, 104), "w": (250, 250, 250),
    "s": (110, 110, 116), "g": (180, 180, 186), "G": (220, 220, 226), "b": (250, 214, 60), "e": (40, 40, 44),
}

FRENTE = [
    "..kk.........kk",
    "..kGk.......kGk",
    "...kgk.....kgk",
    "....kgk...kgk",
    ".....kgkkkgk",
    "..kkkkkkkkkkkkkk",
    ".kLLLLLLLLLLLLLtk",
    ".kLkkkkkkkkkkLttk",
    ".kLkwswsswswkkbTk",
    ".kLkskkswskkskTtk",
    ".kLkwkkwswkkwkbTk",
    ".kLkswswswswskTtk",
    ".kLkwsswkkswskTtk",
    ".kLkkkkkkkkkkkTtk",
    ".kTttttttttttttTk",
    "..kkkkkkkkkkkkkk",
    "....kgk....kgk",
    "....kgk....kgk",
    "...kGgk....kgGk",
    "...kkkk....kkkk",
]

COSTAS = [
    "..kk.........kk",
    "..kGk.......kGk",
    "...kgk.....kgk",
    "....kgk...kgk",
    ".....kgkkkgk",
    "..kkkkkkkkkkkkkk",
    ".kLLLLLLLLLLLLLtk",
    ".kLttttttttttttTk",
    ".kLtkkkkkkkkkttTk",
    ".kLtkTTTTTTTkttTk",
    ".kLtkTTTTTTTkttTk",
    ".kLtkkkkkkkkkttTk",
    ".kLttttttttttttTk",
    ".kLttttttttttttTk",
    ".kTttttttttttttTk",
    "..kkkkkkkkkkkkkk",
    "....kgk....kgk",
    "....kgk....kgk",
    "...kGgk....kgGk",
    "...kkkk....kkkk",
]

LADO = [
    ".....kk",
    ".....kGk...kk",
    "......kgk.kGk",
    ".......kgkgk",
    "........kgk",
    "...kkkkkkkkkkk",
    "..kLLLLLLLLLtk",
    ".kLkkkkLLLLtTk",
    ".kkwswkLtttTTk",
    ".kkskskLtttTTk",
    ".kkwkwkLtttTTk",
    ".kkswskLtttTTk",
    ".kkwswkLtttTTk",
    ".kLkkkkLtttTTk",
    ".kTtttttttTTk",
    "..kkkkkkkkkkk",
    "....kgk.kgk",
    "....kgk.kgk",
    "...kGgk.kgGk",
    "...kkkk.kkkk",
]

PATAS_FRENTE = ((2, 8), (10, 16), 16)
PATAS_LADO = ((2, 8), (8, 13), 16)

if __name__ == "__main__":
    from comum import salvar
    salvar(1073, FRENTE, COSTAS, LADO, CORES, PATAS_FRENTE, PATAS_LADO, fogo=[("w", "s")], previa=os.environ.get("PREVIA"))
    print("CHUVISCO: andar feito")
