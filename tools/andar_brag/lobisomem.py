"""O LOBISOMEM ANDANDO, desenhado do zero (o CAIO, nov/2026: "faz do zero").
O lobisomem em pé: o pelo preto com o laranja das costas e do peito, as
orelhas compridas, o focinho comprido com o dente aparecendo, o olho amarelo,
as garras brancas e o rabo.
  k contorno   p preto   P preto claro   D preto escuro   o laranja
  O laranja claro   r laranja escuro   w garra/dente   y olho"""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

CORES = {
    "k": (24, 20, 32), "p": (44, 34, 40), "P": (107, 100, 104), "D": (33, 25, 30), "o": (214, 104, 42),
    "O": (240, 150, 80), "r": (158, 77, 31), "w": (244, 236, 224), "y": (255, 222, 40), "e": (24, 20, 32),
}

FRENTE = [
    "....kk......kk",
    "...kOok....kOok",
    "...kOook..kooOk",
    "...kooookkoooook",
    "....kooooooooook",
    "...kooykkookkyook",
    "...kookkkookkkook",
    "....kooooppooook",
    ".....kopppppppok",
    ".....kpwkppkwpk",
    "......kpppppppk",
    "...kkkkoopppookkkk",
    "..kpppkoOOooookpppk",
    ".kppppkoOooooookpppk",
    ".kwpPpkoooooooookpPpwk",
    "..kwkkkkooooookkkkwk",
    "......kpppppppk",
    ".....kppppkppppk",
    ".....kpppk.kpppk",
    ".....kpppk.kpppk",
    "....kwppk...kppwk",
    "....kkkkk...kkkkk",
]

COSTAS = [
    "....kk......kk",
    "...kOok....kOok",
    "...kOook..kooOk",
    "...kooookkoooook",
    "....kooooooooook",
    "...koooooooooooook",
    "...kooooooooooook",
    "....kooooooooook",
    ".....kooooooook",
    ".....kppppppppk",
    "......kpppppppk",
    "...kkkkpprrrppkkkk",
    "..kpppkprrrrrrpkpppk",
    ".kppppkprrrrrrrpkpppk",
    ".kwpPpkprrrrrrrpkpPpwk",
    "..kwkkkpprrrrrppkkkwk",
    "......kpppppppk",
    ".....kppppkkppppkk",
    ".....kpppk.kpppkook",
    ".....kpppk.kpppkkook",
    "....kwppk...kppwkkok",
    "....kkkkk...kkkkk.k",
]

LADO = [
    "......kk",
    ".....kOok.kk",
    ".....kooOkOok",
    "....kooooooook",
    "...kooooooooook",
    "kkkkooykoooooook",
    "kpppookoooooook",
    "kwpwppooooooook",
    "kkkkpppooooook",
    "...kkpppoooook",
    ".....kkpppppk",
    ".....kpoooooppk",
    "....kwkoOOoooppk",
    "...kwpkoOooooopk.......k",
    "....kkkooooooooppk...kook",
    ".......kooooooopppkkkook",
    "........kpppppppppkook",
    ".......kppppkppppkkk",
    ".......kpppk.kpppk",
    "......kpppk..kpppk",
    ".....kwppk...kppwk",
    ".....kkkkk...kkkkk",
]

PATAS_FRENTE = ((4, 10), (11, 18), 18)
PATAS_LADO = ((5, 11), (13, 19), 18)

if __name__ == "__main__":
    from comum import salvar
    salvar(1069, FRENTE, COSTAS, LADO, CORES, PATAS_FRENTE, PATAS_LADO, previa=os.environ.get("PREVIA"))
    print("LOBISOMEM: andar feito")
