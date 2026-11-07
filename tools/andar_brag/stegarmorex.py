"""O STEGARMOREX ANDANDO, desenhado do zero (o CAIO, nov/2026: "faz do zero").
O estegossauro de armadura: as PLACAS vermelhas em pé nas costas, os espinhos
de aço, a armadura com os cravos azuis brilhando, a cabeça pequena e as
pernas grossas. Letras do BLINDINO mais: r placa vermelha, R placa escura,
b cravo azul."""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from blindino import CORES as BASE  # noqa: E402

CORES = {**BASE, "r": (178, 92, 60), "R": (130, 64, 40), "b": (120, 170, 255), "g": (128, 138, 158)}

FRENTE = [
    "....kk.kk.kk",
    "...krk.kRk.krk",
    "..kSkrkkrkkrkSk",
    "..kskkrkrkrkksk",
    "...kkpppppppkk",
    "..kpPPPPPPPPPpk",
    ".kpPkwkPPPkwkPpk",
    ".kpPkekPPPkekPpk",
    ".kpgggggggggggpk",
    ".kpgbgggbgggbgpk",
    ".kpggggggggggggk",
    ".kpkcccccccccpkk",
    ".kpkcccccccccpkk",
    ".kpkkkkkkkkkkpk",
    "..kdk.......kdk",
    ".kddk.......kddk",
    ".kkkk.......kkkk",
]

COSTAS = [
    "....kk.kk.kk",
    "...krk.kRk.krk",
    "..kSkrkkrkkrkSk",
    "..kskkrkrkrkksk",
    "...kkpppppppkk",
    "..kpppprrrppppk",
    ".kpppprRRrrpppk",
    ".kpppprrrrppppk",
    ".kpgggggggggggpk",
    ".kpgbgggbgggbgpk",
    ".kpggggggggggggk",
    ".kpggggkkgggggkk",
    ".kpgggksSkgggpkk",
    ".kpkkkksskkkkpk",
    "..kdk..kk...kdk",
    ".kddk.......kddk",
    ".kkkk.......kkkk",
]

LADO = [
    "..........kk.kk.kk",
    ".........krk.krk.krk",
    "........krRkkrRkkrRk",
    "...kkk.kkrkkrkkrkkkk",
    "..kPPPkkpppppppppppkk.kk",
    ".kPwkPkpgggggggggggpkkSk",
    ".kPekPkpgbgggbgggbgppksk",
    "kPPPPPkpgggggggggggpppkk",
    "kkPPPPkpgggggggggggpppSk",
    ".kkkkkpcccccccccccpppkk",
    ".....kpcccccccccccpkk",
    ".....kpkkkkkkkkkkkpk",
    ".....kdk........kdk",
    "....kddk.......kddk",
    "....kkkk.......kkkk",
]

PATAS_FRENTE = ((0, 7), (11, 17), 14)
PATAS_LADO = ((3, 9), (15, 21), 12)

if __name__ == "__main__":
    from comum import salvar
    salvar(1098, FRENTE, COSTAS, LADO, CORES, PATAS_FRENTE, PATAS_LADO, fogo=[("b", "S")], previa=os.environ.get("PREVIA"))
    print("STEGARMOREX: andar feito")
