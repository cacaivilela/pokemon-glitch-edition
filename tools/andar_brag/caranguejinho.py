"""O CARANGUEJINHO ANDANDO, desenhado do zero (o CAIO, nov/2026: "faz do zero").
O caranguejo do mangue: a casca roxa, as GARRAS laranja levantadas, os
olhinhos em pé, a ANTENA de metal na cabeça (é elétrico) e as perninhas.
  k contorno   p roxo   P roxo claro   D roxo escuro   o laranja   O laranja
  claro   r laranja escuro   g antena   G antena clara   y raio   e olho"""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

CORES = {
    "k": (24, 20, 32), "p": (92, 84, 176), "P": (141, 135, 200), "D": (68, 62, 130),
    "o": (240, 128, 48), "O": (244, 166, 110), "r": (178, 95, 36), "g": (120, 128, 142),
    "G": (214, 219, 226), "y": (250, 214, 60), "e": (24, 20, 32), "w": (250, 250, 250),
}

FRENTE = [
    "...........kk",
    "..........kGGk",
    "...........kgk",
    ".kkk.......kgk.......kkk",
    "kOOok.....kkgkk.....koOOk",
    "kOookk..kkpppppkk..kkooOk",
    ".kkrok.kpPPpppppDk.korkk",
    "...kok.kwkpppppkwk.kok",
    "...kok.kkkpppppkkk.kok",
    "....kokpPpppppppppDkok",
    ".....kopppkpppkpppDko",
    "......kpDppkkkppDDDk",
    ".....kokkDDDDDDDDkkok",
    "....kok.kok.kok.kok.kok",
    "...kok..kok.kok.kok..kok",
    "...kk...kk...kk..kk...kk",
]

COSTAS = [
    "...........kk",
    "..........kGGk",
    "...........kgk",
    ".kkk.......kgk.......kkk",
    "kOOok.....kkgkk.....koOOk",
    "kOookk..kkpppppkk..kkooOk",
    ".kkrok.kpPPpppppDk.korkk",
    "...kok.kpPppppppDk.kok",
    "...kok.kpppppppppk.kok",
    "....kokpPpppppppppDkok",
    ".....kopppppppppppDko",
    "......kpDpppppppDDDk",
    ".....kokkDDDDDDDDkkok",
    "....kok.kok.kok.kok.kok",
    "...kok..kok.kok.kok..kok",
    "...kk...kk...kk..kk...kk",
]

LADO = [
    "........kk",
    ".......kGGk",
    "........kgk",
    "..kkk...kgk",
    ".kOOok.kkgkk",
    ".kOookkpppppkk",
    "..kkrokpPPpppDk",
    "....kokwkpppppDk",
    "....kkkkkppppppDk",
    "....kpPppppppppDk",
    "....kppppppppppDDk",
    ".....kpDpppppDDDk",
    "....kokkDDDDDDDkkok",
    "...kok.kok.kok.kok",
    "..kok..kok.kok..kok",
    "..kk...kk...kk...kk",
]

PATAS_FRENTE = ((0, 12), (12, 25), 13)
PATAS_LADO = ((0, 10), (10, 20), 13)

if __name__ == "__main__":
    from comum import salvar
    salvar(1053, FRENTE, COSTAS, LADO, CORES, PATAS_FRENTE, PATAS_LADO, previa=os.environ.get("PREVIA"))
    print("CARANGUEJINHO: andar feito")
