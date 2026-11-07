"""O GALLIMIRAGE ANDANDO, desenhado do zero (o CAIO, nov/2026: "faz do zero").
O GALLINY crescido e psíquico: maior, correndo inclinado, a crista e a cauda
de penas roxas maiores e o RASTRO de MIRAGEM roxa (ele pisca: a ilusão dele
some e volta). Letras do GALLINY mais: q a miragem, Q a miragem clara."""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from galliny import CORES as BASE  # noqa: E402

CORES = {**BASE, "q": (186, 132, 236), "Q": (230, 210, 255)}

FRENTE = [
    "....k.k.k",
    "...kpkpkpk",
    "....kpppk",
    "...kcCCck",
    "..kckcckek",
    "..kccbbcck",
    "...kkbbkk",
    "....kccck",
    "...q.kcck.q",
    "..qkkkcckkkq",
    ".qkcCCCCCcckq",
    "qkpcCmmmmcspkq",
    "qkppccmmmcsppk",
    ".qkcccccccccsk",
    "..qkkkkkkkkkq",
    "....kl..kl",
    "....kl..kl",
    "....kl..kl",
    "...kll..kll",
    "...kkk..kkk",
]

COSTAS = [
    "....k.k.k",
    "...kpkpkpk",
    "....kpppk",
    "...kcCCck",
    "..kccccccek",
    "..kccccccck",
    "...kkcckkk",
    "....kccck",
    "...q.kcck.q",
    "..qkkkcckkkq",
    ".qkcCCCCCcckq",
    "qkppppppppppkq",
    "qkpPpppPppPpk",
    ".qkpppppppppk",
    "..qkkkkkkkkkq",
    "....kl..kl",
    "....kl..kl",
    "....kl..kl",
    "...kll..kll",
    "...kkk..kkk",
]

LADO = [
    "....k.k.k",
    "...kpkpkpk",
    "....kpppk",
    "...kcCCck",
    "..kckecccck",
    "kbbbbcccck",
    ".kkkkkccck",
    "......kccck",
    ".......kccck.......qq",
    ".......kcckkkkkk.kkqQ",
    "......kcCCcccccckkpkqQ",
    "......kcCmmmmmcckPppkqQ",
    ".......kcmmmmmccspppkqQ",
    "........kcccccccsskqQ",
    ".........kkkkkkkkkqQ",
    "..........kl..kl",
    ".........kl...kl",
    "........kl....kl",
    ".......kll...kll",
    ".......kkk...kkk",
]

PATAS_FRENTE = ((3, 8), (8, 12), 15)
PATAS_LADO = ((6, 13), (13, 18), 15)

if __name__ == "__main__":
    from comum import salvar
    salvar(1100, FRENTE, COSTAS, LADO, CORES, PATAS_FRENTE, PATAS_LADO, fogo=[("q", "Q")], previa=os.environ.get("PREVIA"))
    print("GALLIMIRAGE: andar feito")
