"""O GIGANTINY ANDANDO, desenhado do zero (o CAIO, nov/2026: "faz do zero").
O filhote de dinossauro do fóssil: roxo-escuro, a cabeçona com o OLHO amarelo
grande, o dentinho branco pra fora, os bracinhos curtos, o rabo grosso e as
perninhas.
  k contorno   p roxo   P roxo claro   d roxo escuro   D mais escuro
  y olho   w dente   b barriga"""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

CORES = {
    "k": (24, 20, 32), "p": (72, 64, 96), "P": (127, 121, 144), "d": (59, 52, 79), "D": (37, 33, 52),
    "y": (252, 214, 48), "w": (250, 250, 250), "b": (132, 120, 148), "B": (172, 160, 184), "e": (24, 20, 32),
}

FRENTE = [
    "....kkkkkk",
    "..kkPPPpppkk",
    ".kPPppppppppk",
    ".kPkyykppkyykk",
    ".kpkyekppkeykk",
    ".kpkkkkppkkkkpk",
    ".kppppppppppppk",
    "..kpppkkkkpppk",
    "...kpwkkkkwpk",
    "...kkppppppkk",
    "..kdkpbBBbpkdk",
    "..kkkpbBBbpkkk",
    "....kpbbbbpk",
    "....kdppppdk",
    "....kdk..kdk",
    "...kddk..kddk",
    "...kkkk..kkkk",
]

COSTAS = [
    "....kkkkkk",
    "..kkPPPpppkk",
    ".kPPppppppppk",
    ".kPppppppppppk",
    ".kpppppppppppk",
    ".kppppPpppPpppk",
    ".kppppppppppppk",
    "..kpppppppppk",
    "...kpppppppk",
    "...kkppppppkk",
    "..kdkppPPppkdk",
    "..kkkpppppppkk",
    "....kpppppppkk",
    "....kdppppppdkk",
    "....kdk..kdkdk",
    "...kddk..kddkk",
    "...kkkk..kkkk",
]

LADO = [
    "...kkkkkk",
    ".kkPPPpppk",
    "kPPpppppppk",
    "kpkyykppppk",
    "kpkeykpppppk",
    "kpkkkkpppppk",
    "kpppppppppppk",
    ".kkkkpppppppk",
    "..kwkkppppppk",
    "...kkpppppppkk",
    "...kdkbBBpppppkk",
    "...kkkbBBpppppppkk",
    ".....kbbbppppppdddk",
    ".....kdppppppkkkkk",
    ".....kdk...kdk",
    "....kddk...kddk",
    "....kkkk...kkkk",
]

PATAS_FRENTE = ((3, 8), (9, 14), 14)
PATAS_LADO = ((4, 9), (11, 16), 14)

if __name__ == "__main__":
    from comum import salvar
    salvar(1095, FRENTE, COSTAS, LADO, CORES, PATAS_FRENTE, PATAS_LADO, previa=os.environ.get("PREVIA"))
    print("GIGANTINY: andar feito")
