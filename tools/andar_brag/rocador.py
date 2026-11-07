"""O ROÇADOR ANDANDO (pulando), desenhado do zero (o CAIO, nov/2026: "faz do
zero"). A moita de roçadeira: a bola de mato verde com o capim espetado em
cima, os ÓCULOS de proteção azuis, o MOTOR laranja nas costas e a lâmina de
roçar no cabo (ela brilha girando).
  k contorno   g verde   G verde escuro   l verde claro   o motor   O motor
  escuro   m metal   M metal claro   b óculos   e olho   w brilho"""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

CORES = {
    "k": (24, 20, 32), "g": (80, 170, 60), "G": (59, 126, 44), "l": (132, 196, 118), "o": (240, 120, 30),
    "O": (178, 89, 22), "m": (108, 116, 132), "M": (152, 158, 169), "b": (80, 160, 230), "e": (24, 20, 32),
    "w": (250, 250, 250), "r": (110, 30, 40),
}

FRENTE = [
    "....k.k..k.k",
    "...kgkgkkgkgk",
    "..kglgglglgglk",
    ".kgllgggggggglk",
    ".kgkkkkgkkkkggk",
    ".kgkbwbkkbwbkgk",
    ".kgkkekkkkekkgk",
    ".kggkkkggkkkggk",
    ".kgggggrrggggGk",
    "kkgggggggggggGkk",
    "kMkGgggggggggGkmk",
    "kmMkGGGGGGGGGkMmk",
    ".kkk.kkkkkkkk.kk",
]

COSTAS = [
    "....k.k..k.k",
    "...kgkgkkgkgk",
    "..kglgglglgglk",
    ".kgllgggggggglk",
    ".kgkkkkkkkkkkggk",
    ".kgkoooooooookgk",
    ".kgkoOOooOOookgk",
    ".kgkoooooooookgk",
    ".kggkkkkkkkkkgGk",
    "kkgggggggggggGkk",
    "kMkGgggggggggGkmk",
    "kmMkGGGGGGGGGkMmk",
    ".kkk.kkkkkkkk.kk",
]

LADO = [
    "....k.k..k",
    "...kgkgkkgk",
    "..kglgglglgk",
    ".kgllgggggglkkkk",
    ".kkkkkgggggkooook",
    "kbwbkkgggggkoOOok",
    "kkekkggggggkooook",
    ".kkggggggggkkkkk",
    ".krrgggggggGk",
    "kkgggggggggGkk",
    "kMkmmmmmmmmmMkk",
    "kmMkGGGGGGGGkMk",
    ".kk.kkkkkkkk.k",
]

if __name__ == "__main__":
    from comum import salvar
    salvar(1088, FRENTE, COSTAS, LADO, CORES, ((0, 0),) * 2, ((0, 0),) * 2, fogo=[("m", "M")], previa=os.environ.get("PREVIA"), pulo=True)
    print("ROÇADOR: andar feito")
