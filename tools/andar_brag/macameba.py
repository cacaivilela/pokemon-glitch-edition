"""A MACAMEBA ANDANDO, desenhada do zero (o CAIO, nov/2026: "faz do zero"). O
AMEBO virando macaco: o macaquinho roxo de pelo, a cara cor de pele com
orelhas redondas, os braços compridos, a barriga clara e o RABO comprido
enrolado. Letras do AMEBO mais: b barriga."""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from amebo import CORES as BASE  # noqa: E402

CORES = {**BASE, "b": (208, 170, 242)}

FRENTE = [
    ".....kkkkkk",
    "...kkPPpppdkk",
    ".kkkPpppppppkkk",
    "kpPkpkkkkkkpkPpk",
    "kpkkkfffffkkkkpk",
    ".kk.kfefeffk.kk",
    "....kffffffk",
    "....kfffmffk",
    ".....kkkkkk",
    "...kkpppppkk",
    "..kpkpbbbpkpk.........kk",
    ".kpk.kbbbbk.kpk......kpk",
    ".kfk.kbbbbk.kfk.....kpk",
    "..k..kpppppk..k....kpk",
    ".....kppkppk......kpk",
    ".....kppkppkkkkkkkpk",
    "....kppk.kppkkkkkk",
    "....kffk.kffk",
    "....kkkk.kkkk",
]

COSTAS = [
    ".....kkkkkk",
    "...kkPPpppdkk",
    ".kkkPpppppppkkk",
    "kpPkpppppppppkPpk",
    "kpkkpppppppppkkpk",
    ".kk.kppppppppk.kk",
    "....kpppppppk",
    "....kpppppppk",
    ".....kkkkkk",
    "...kkpppppkk",
    "..kpkpppppkpk",
    ".kpk.kppppk.kpk",
    ".kfk.kppppk.kfk",
    "..k..kpppppk..k",
    ".....kppkppkk",
    ".....kppkpkpk",
    "....kppk.kpkpk",
    "....kffk.kffkpk",
    "....kkkk.kkkkpk",
    ".............kpk",
    "..............kk",
]

LADO = [
    "....kkkkkk",
    "..kkPPpppdkk",
    ".kfkkpppppppk",
    "kffffkpppppkPk",
    "kfefffkpppppkk",
    "kfffffkpppppk",
    "kmffffkppppk",
    ".kkkkkkkkkk",
    "....kpppppk",
    "...kpbbbbpk",
    "..kpkbbbbpk...........kk",
    ".kpk.kbbbbpk.........kpk",
    ".kfk.kpppppk........kpk",
    "..k..kpppppkkkkkkkkkpk",
    ".....kppkppkkkkkkkkk",
    "....kppk.kppk",
    "....kffk.kffk",
    "....kkkk.kkkk",
]

PATAS_FRENTE = ((4, 9), (9, 14), 16)
PATAS_LADO = ((4, 9), (9, 14), 15)

if __name__ == "__main__":
    from comum import salvar
    salvar(1116, FRENTE, COSTAS, LADO, CORES, PATAS_FRENTE, PATAS_LADO, previa=os.environ.get("PREVIA"))
    print("MACAMEBA: andar feito")
