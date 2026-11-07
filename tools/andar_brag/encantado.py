"""O ENCANTADO ANDANDO, desenhado do zero (o CAIO, nov/2026: "faz do zero").
O boto que vira gente na festa: em pé, de CHAPÉU panamá branco com a fita
preta, o COLAR azul, o bico, a barriga clarinha e as pernas. Letras do
BOTINHO mais: h o chapéu, H o chapéu na sombra, f a fita, c o colar."""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from botinho import CORES as BASE  # noqa: E402

CORES = {**BASE, "h": (247, 244, 236), "H": (210, 204, 190), "f": (40, 36, 48), "c": (80, 160, 230)}

FRENTE = [
    ".......kkkkkkk",
    "......khhhhhhhk",
    "......khHhhhHhk",
    "......kfffffffk",
    "....kkhhhhhhhhhkk",
    "...khhhhhhhhhhhhhk",
    "....kkkPPPppppkk",
    ".....kpkekpkekpk",
    ".....kpkkkpkkkpk",
    ".....kppppkppppk",
    "......kppkLkppk",
    ".......kpkLkpk",
    "........kcLck",
    "..kk...kpcckcpk...kk",
    ".kpdkkkpLLcLLpkkkdpk",
    "..kdddpLLLLLLLpdddk",
    "...kkkpLLLLLLLpkkk",
    "......kpLLLLLpk",
    "......kdpLLLpdk",
    "......kdppppppk",
    "......kdpkkkpdk",
    "......kdpk.kpdk",
    "......kdpk.kpdk",
    ".....kddpk.kpddk",
    ".....kkkkk.kkkkk",
]

COSTAS = [
    ".......kkkkkkk",
    "......khhhhhhhk",
    "......khHhhhHhk",
    "......kfffffffk",
    "....kkhhhhhhhhhkk",
    "...khhhhhhhhhhhhhk",
    "....kkkPPPppppkk",
    ".....kppppppppppk",
    ".....kppppppppppk",
    ".....kppppppppppk",
    "......kppppppppk",
    ".......kppppppk",
    "........kccck",
    "..kk...kpcccccpk...kk",
    ".kpdkkkpppppppppkkkdpk",
    "..kdddpppPPPpppdddk",
    "...kkkpppPPPpppkkk",
    "......kppPPPppk",
    "......kdpppppdk",
    "......kdppppppk",
    "......kdpkkkpdk",
    "......kdpk.kpdk",
    "......kdpk.kpdk",
    ".....kddpk.kpddk",
    ".....kkkkk.kkkkk",
]

LADO = [
    "........kkkkkkk",
    ".......khhhhhhhk",
    ".......khHhhhHhk",
    ".......kfffffffk",
    ".....kkhhhhhhhhhkk",
    "....khhhhhhhhhhhhhk",
    "...kkkkPPPPppppkk",
    "kkkPPPPPPpkekppk",
    "kpppppppppkkkppk",
    ".kkkkkkLLppppppk",
    "......kkLLLppppk",
    "........kcLLppk",
    "........kccpk",
    "........kpLccpk",
    ".......kpLLLcppk",
    "......kdkLLLLppk",
    "......kdkLLLLppk",
    ".......kkLLLpppk",
    "........kdpppdk",
    "........kdppppk",
    "........kdpkpdk",
    "........kdpkpdk",
    "........kdpkpdk",
    ".......kddpkddpk",
    ".......kkkkkkkkk",
]

PATAS_FRENTE = ((5, 11), (11, 17), 20)
PATAS_LADO = ((7, 12), (12, 17), 20)

if __name__ == "__main__":
    from comum import salvar
    salvar(1056, FRENTE, COSTAS, LADO, CORES, PATAS_FRENTE, PATAS_LADO, previa=os.environ.get("PREVIA"))
    print("ENCANTADO: andar feito")
