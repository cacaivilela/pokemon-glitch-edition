"""O BLINDINO ANDANDO, desenhado do zero (o CAIO, nov/2026: "faz do zero"). O
filhote de dinossauro blindado: atarracado, cor de pedra, a cabeça redonda de
olhão, os ESPINHOS de aço nas costas e no rabo, a barriga clara e as patinhas.
  k contorno   p pedra   P pedra clara   d pedra escura   c barriga
  s espinho   S espinho claro   e olho   w brilho"""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

CORES = {
    "k": (24, 20, 32), "p": (124, 110, 84), "P": (163, 154, 135), "d": (92, 81, 62), "c": (200, 186, 148),
    "s": (196, 204, 218), "S": (214, 219, 229), "e": (24, 20, 32), "w": (250, 250, 250),
}

FRENTE = [
    "...k..k..k..k",
    "..kSk.kSkkSk.kSk",
    "..kskkkskksk.ksk",
    "...kkpppppppkkk",
    "..kpPPPPPPPPPpk",
    ".kpPkwkPPPkwkPpk",
    ".kpPkekPPPkekPpk",
    ".kpPPPPPPPPPPPpk",
    ".kppPPPkkkPPPppk",
    "..kpppppppppppk",
    ".kpkpcccccccpkpk",
    ".kkkpcccccccpkkk",
    "....kpcccccpk",
    "....kdk...kdk",
    "....kkk...kkk",
]

COSTAS = [
    "...k..k..k..k",
    "..kSk.kSkkSk.kSk",
    "..kskkkskksk.ksk",
    "...kkpppppppkkk",
    "..kpppSpppSpppk",
    ".kppkskpSkskpppk",
    ".kpppppkskppppk",
    ".kppSpppppppSppk",
    ".kpkskppSppkskpk",
    "..kpppkskpppppk",
    ".kpkpppppppppkpk",
    ".kkkppppkkpppkkk",
    "....kpppSppppk",
    "....kdkkskkdk",
    "....kkk.k.kkk",
]

LADO = [
    "........k..k..k",
    ".......kSkkSkkSk",
    "...kkkkkskksksk",
    "..kPPPPkpppppppkk",
    ".kPPwkPPkpppppppkk..k",
    ".kPPekPPPkpppppppkkSk",
    "kPPPPPPPPkppppppppskk",
    "kPkkPPPPPkpppppppppSk",
    ".kkPPPPPkcccccppppkk",
    "...kkkkkpcccccpppk",
    ".....kpkpccccccpk",
    ".....kkk.kkkkkkk",
    ".....kdk....kdk",
    ".....kkk....kkk",
]

PATAS_FRENTE = ((3, 8), (9, 14), 13)
PATAS_LADO = ((4, 9), (11, 16), 12)

if __name__ == "__main__":
    from comum import salvar
    salvar(1097, FRENTE, COSTAS, LADO, CORES, PATAS_FRENTE, PATAS_LADO, previa=os.environ.get("PREVIA"))
    print("BLINDINO: andar feito")
