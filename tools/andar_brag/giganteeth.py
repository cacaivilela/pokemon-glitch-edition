"""O GIGANTEETH ANDANDO, desenhado do zero (o CAIO, nov/2026: "faz do zero").
O tiranossauro do fóssil: o corpo roxo-escuro, a cabeçona com o CAPACETE de
aço espetado, a bocarra vermelha cheia de DENTES, o olho vermelho, os
bracinhos, as pernas fortes e o rabo.
  k contorno   p roxo   P roxo claro   d roxo escuro   s aço   S aço claro
  r boca   w dente   y olho"""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

CORES = {
    "k": (24, 20, 32), "p": (72, 64, 96), "P": (127, 121, 144), "d": (50, 44, 70), "D": (37, 33, 52),
    "s": (196, 204, 218), "S": (236, 242, 250), "r": (120, 30, 44), "w": (236, 242, 250), "y": (220, 50, 50),
}

FRENTE = [
    "...k.k.k.k.k",
    "..kSkSkSkSkSk",
    ".kSsssssssssSk",
    ".ksskyysssyyskk",
    ".kpsskkssskksspk",
    ".kppppppppppppk",
    ".kpkwkwkwkwkwkpk",
    ".kpkrrrrrrrrrkpk",
    ".kpkrrrrrrrrrkpk",
    ".kpkwkwkwkwkwkpk",
    "..kppppppppppppk",
    ".kpkkpPPPPPpkkpk",
    ".kpk.kpPPPpk.kpk",
    "..kk.kpPPPpk..kk",
    "....kdppppppdk",
    "...kdpppkkpppdk",
    "...kdpk...kpdk",
    "..kddpk...kpddk",
    "..kkkkk...kkkkk",
]

COSTAS = [
    "...k.k.k.k.k",
    "..kSkSkSkSkSk",
    ".kSsssssssssSk",
    ".ksssssssssssk",
    ".kpssssssssspk",
    ".kppppppppppppk",
    ".kppppppppppppk",
    ".kppppPPPPppppk",
    ".kppppppppppppk",
    ".kppkkkkkkkkppk",
    "..kpppppppppppk",
    ".kpkkpppppppkkpk",
    ".kpk.kppppppkkpk",
    "..kk.kppppppkdpk",
    "....kdppppppdkdk",
    "...kdpppkkpppdkk",
    "...kdpk...kpdk",
    "..kddpk...kpddk",
    "..kkkkk...kkkkk",
]

LADO = [
    "....k.k.k.k",
    "...kSkSkSkSk",
    "..kSsssssssSk",
    ".kssyyssssssk",
    "kpsskkssssssspk",
    "kppppppppppppppk",
    "kwkwkwkwkppppppk",
    "krrrrrrrkpppppppk",
    "kwkwkwkwkpppppppk",
    ".kkkkkkpppppppppk",
    ".....kkpPPPpppppppkk",
    "....kpkpPPPpppppppppkk",
    "....kkkpPPPppppppddddDk",
    "......kdppppppppkkkkk",
    ".....kdpppkkpppdk",
    ".....kdpk...kpdk",
    "....kddpk...kpddk",
    "....kkkkk...kkkkk",
]

PATAS_FRENTE = ((2, 8), (10, 17), 16)
PATAS_LADO = ((4, 10), (11, 17), 15)

if __name__ == "__main__":
    from comum import salvar
    salvar(1096, FRENTE, COSTAS, LADO, CORES, PATAS_FRENTE, PATAS_LADO, previa=os.environ.get("PREVIA"))
    print("GIGANTEETH: andar feito")
