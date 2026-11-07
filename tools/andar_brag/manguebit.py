"""O MANGUEBIT ANDANDO, desenhado do zero (o CAIO, nov/2026: "faz do zero").
O caranguejão do mangue elétrico: a casca roxa grande, as garronas laranja,
a ANTENA PARABÓLICA na cabeça soltando RAIO (o raio pisca no passo). Mesmas
letras do CARANGUEJINHO."""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from caranguejinho import CORES  # noqa: E402

FRENTE = [
    ".......y.......kkkk.....y",
    "......yk.....kkGGGGk....ky",
    ".......yk...kGGgggGk...ky",
    "........k..kGgggGGk...k",
    "..kkkk......kkGGkkk......kkkk",
    ".kOOOok.......kgk.......koOOOk",
    "kOOoooook...kkkgkkk...kooooOOk",
    "kOooookk..kkpppppppkk..kkooooOk",
    ".kkroook.kpPPpppppppDk.koorkk",
    "...kroookpPkwkpppkwkpDkooork",
    "....kooookpkkkpppkkkpDkoook",
    ".....kookpPpppppppppppDkook",
    "......kkpPpppppppppppppDkk",
    ".......kpppppkkkkkpppppDk",
    ".......kpDpppppppppppDDDk",
    "......kokkDDDDDDDDDDDDkkok",
    ".....kok.kok.kok.kok.kok.kok",
    "....kok..kok.kok.kok.kok..kok",
    "....kk...kk...kk...kk...kk..kk",
]

COSTAS = [
    ".......y.......kkkk.....y",
    "......yk.....kkGGGGk....ky",
    ".......yk...kGGgggGk...ky",
    "........k..kGgggGGk...k",
    "..kkkk......kkGGkkk......kkkk",
    ".kOOOok.......kgk.......koOOOk",
    "kOOoooook...kkkgkkk...kooooOOk",
    "kOooookk..kkpppppppkk..kkooooOk",
    ".kkroook.kpPPpppppppDk.koorkk",
    "...kroookpPpppppppppppDkooork",
    "....kooookppppppppppppDkoook",
    ".....kookpPpppppppppppDkook",
    "......kkpPpppppppppppppDkk",
    ".......kpppppppppppppppDk",
    ".......kpDpppppppppppDDDk",
    "......kokkDDDDDDDDDDDDkkok",
    ".....kok.kok.kok.kok.kok.kok",
    "....kok..kok.kok.kok.kok..kok",
    "....kk...kk...kk...kk...kk..kk",
]

LADO = [
    "...y......kkkk",
    "..yk....kkGGGGk",
    "...yk..kGGgggGk",
    "....k.kGgggGGk",
    "..kkkk.kkGGkkk",
    ".kOOOok..kgk",
    "kOOoooookkkgkkk",
    "kOooookkpppppppkk",
    ".kkroookpPPpppppDk",
    "...kroookwkpppppDk",
    "....kooookkpppppDDk",
    ".....kookppppppppDk",
    "......kkPppppppppDk",
    ".......kpppppppppDDk",
    ".......kpDpppppppDDk",
    "......kokkDDDDDDDkkok",
    ".....kok.kok.kok.kok",
    "....kok..kok.kok..kok",
    "....kk...kk...kk...kk",
]

PATAS_FRENTE = ((0, 15), (15, 31), 16)
PATAS_LADO = ((0, 12), (12, 22), 16)

if __name__ == "__main__":
    from comum import salvar
    salvar(1054, FRENTE, COSTAS, LADO, CORES, PATAS_FRENTE, PATAS_LADO, fogo=[("y", "w")], previa=os.environ.get("PREVIA"))
    print("MANGUEBIT: andar feito")
