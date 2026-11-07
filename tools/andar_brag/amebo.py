"""O AMEBO ANDANDO (pulando, mole que nem gelatina), desenhado do zero (o CAIO,
nov/2026: "faz do zero"). A ameba roxa de antena com a CARINHA de macaco no
meio (a cara cor de pele, os olhos e o sorriso) e o pedacinho amarelo que ela
engoliu boiando dentro.
  k contorno   p roxo   P roxo claro   d roxo escuro   f cara   y amarelo
  e olho   m boca   w brilho"""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

CORES = {
    "k": (40, 18, 56), "p": (170, 112, 222), "P": (222, 190, 255), "d": (138, 75, 192), "D": (92, 44, 138),
    "f": (238, 200, 156), "y": (250, 220, 70), "e": (40, 18, 56), "m": (120, 40, 60), "w": (250, 250, 250),
}

FRENTE = [
    "......kk",
    ".....kPpk",
    "......kpk",
    "....kkkpkkk",
    "..kkPPpppppkk",
    ".kPPpppppppppk",
    ".kPpkkkkkkkppk",
    "kPppkfffffkpppk",
    "kpppkfefeffkppk",
    "kpppkffffffkppk",
    "kpppkffmmffkpdk",
    "kpppkkffffkkpdk",
    "kpyyyppkkkkppdk",
    "kpyyypppppppddk",
    ".kpppppppppdddk",
    "..kkddddddddkk",
    "....kkkkkkkk",
]

COSTAS = [
    "......kk",
    ".....kPpk",
    "......kpk",
    "....kkkpkkk",
    "..kkPPpppppkk",
    ".kPPpppppppppk",
    ".kPppppppppppk",
    "kPpppppppppppk",
    "kppppPppppppppk",
    "kppppppppppPppk",
    "kpppppppppppppk",
    "kppppppppppppdk",
    "kppppppppyyypdk",
    "kpppppppyyyppdk",
    ".kpppppppppdddk",
    "..kkddddddddkk",
    "....kkkkkkkk",
]

LADO = [
    ".....kk",
    "....kPpk",
    ".....kpk",
    "...kkkpkkk",
    ".kkPPpppppkk",
    "kPPpppppppppk",
    "kfkkpppppppppk",
    "kffkppppppppppk",
    "kefkpppppppppk",
    "kffkpppppppppk",
    "kmfkpppppppppdk",
    "kkkpppppppppdk",
    "kpppppyyyppppdk",
    "kppppyyyppppddk",
    ".kpppppppppdddk",
    "..kkddddddddkk",
    "....kkkkkkkk",
]

if __name__ == "__main__":
    from comum import salvar
    salvar(1115, FRENTE, COSTAS, LADO, CORES, ((0, 0),) * 2, ((0, 0),) * 2, previa=os.environ.get("PREVIA"), pulo=True)
    print("AMEBO: andar feito")
