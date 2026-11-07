"""O BOTINHO ANDANDO (pulando, como quem pula da água), desenhado do zero (o
CAIO, nov/2026: "faz do zero"). O boto-cor-de-rosa filhote: o bico comprido,
o melão na testa, a barriga clarinha, as nadadeiras e o rabo; e o respingo
d'água embaixo.
  k contorno   p rosa   P rosa claro   L rosa clarinho   d rosa escuro
  a água   A água clara   e olho   w brilho"""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

CORES = {
    "k": (24, 20, 32), "p": (244, 156, 184), "P": (247, 186, 205), "L": (255, 212, 224), "d": (206, 104, 140),
    "D": (181, 115, 136), "a": (96, 170, 230), "A": (190, 232, 255), "e": (24, 20, 32), "w": (250, 250, 250),
}

FRENTE = [
    "......kkkkkk",
    "....kkPPPpppkk",
    "...kPLLPppppppk",
    "..kPLPpppppppppk",
    "..kppeppppppppepk",
    "..kpPppppppppPppk",
    "..kpppkpppppkppk",
    "...kpppkkkkkpppk",
    "....kpppkLLkppk",
    ".....kppkLLkpk",
    "......kkkLLkk",
    ".kk...kpLLLLpk..kk",
    "kdpkkkpLLLLLLpkkpdk",
    ".kddkpLLLLLLLLpkddk",
    "..kkkpLLLLLLLLpkkk",
    ".....kpLLLLLLpk",
    ".....kdpLLLLpdk",
    "....kdpkkkkkkpdk",
    "...kdpk......kpdk",
    "...kkk........kkk",
    "..kAaAAkAkAkAkAAaAk",
    "...kkkkkkkkkkkkkkk",
]

COSTAS = [
    "......kkkkk",
    ".....kPPPppk",
    "....kPPppppdk",
    "....kPppppppk",
    "...kpppppppppk",
    "...kpppppppppk",
    "...kpppppppppk",
    "....kpppppppk",
    ".....kpppppk",
    "......kpppk",
    ".kk..kpppppk..kk",
    "kdpkkpppPpppkkpdk",
    ".kddkpppPpppkddk",
    "..kkppppPppppkk",
    "....kpppPppk",
    "....kdpppppdk",
    "...kdpkkkkkpdk",
    "..kdpk.....kpdk",
    "..kkk.......kkk",
    ".kAaAAkAkAkAAaAk",
    "..kkkkkkkkkkkkk",
]

LADO = [
    "...........kkkk",
    ".........kkPPPpk",
    "........kPLLPpppk",
    ".kkkkkkkPLPppppppk",
    "kPPPPPPPPpkekppppk",
    "kpppppppppkkkpppppk",
    ".kkkkkkLLppppppppppk..kk",
    "......kkLLLLppppppppkkpk",
    "........kLLLLLppppppppdk",
    ".........kLLLLLLppppppk",
    "..........kkLLLLLpppdk",
    "...........kdpkkkkkdpk",
    "...........kdpk...kdpk",
    "............kk.....kk",
    ".........kAaAAkAkAkAAaAk",
    "..........kkkkkkkkkkkkk",
]

if __name__ == "__main__":
    from comum import salvar
    salvar(1055, FRENTE, COSTAS, LADO, CORES, ((0, 0),) * 2, ((0, 0),) * 2, previa=os.environ.get("PREVIA"), pulo=True)
    print("BOTINHO: andar feito")
