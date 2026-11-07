"""O PLUMÁRIO ANDANDO, desenhado do zero (o CAIO, nov/2026: "faz do zero").
O pássaro do carnaval: o corpo roxo, o LEQUE de penas atrás (amarelo, rosa,
verde), o peito amarelo, o bico e as perninhas. Atrás, o leque abre bem.
  k contorno   p roxo   P roxo escuro   y amarelo   Y amarelo claro
  r rosa   g verde   G verde escuro   o bico   e olho   w brilho"""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

CORES = {
    "k": (24, 20, 32), "p": (120, 60, 190), "P": (40, 26, 60), "y": (252, 214, 48), "Y": (253, 224, 100),
    "r": (240, 90, 170), "g": (60, 190, 90), "G": (42, 133, 63), "o": (252, 196, 60), "O": (176, 150, 34),
    "e": (24, 20, 32), "w": (250, 250, 250),
}

FRENTE = [
    "....kk..kkk..kk",
    "...kgyk.kyrk.kygk",
    "..kgyrkkyrrykkrygk",
    ".kgyrygkkkkkgyryygk",
    ".kgyrykpppppkyryygk",
    "kgyrygkpkpkpkgyryygk",
    "kGgyrkpwkpwkpkryygGk",
    ".kGgykppkokppkyggGk",
    "..kGkpppkOkpppkgGk",
    "...kkpyyyyyyypkkk",
    "....kpyYYYYyypk",
    "....kpyYYYYyypk",
    ".....kpyyyyypk",
    "......kpkkkpk",
    "......kok.kok",
    ".....kook.kook",
    ".....kkkk.kkkk",
]

COSTAS = [
    "....kk..kkk..kk",
    "...kgyk.kyrk.kygk",
    "..kgyrkkyrrykkrygk",
    ".kgyrygkyryrykgyryygk",
    ".kgyrygkyryrykgyryygk",
    "kgyrygkgyryrygkgyryygk",
    "kGgyrkgyrypyrygkryygGk",
    ".kGgykgyrpppryykyggGk",
    "..kGkpkgppppprgkpgGk",
    "...kkpppppppppppkkk",
    "....kpppppppppppk",
    "....kpppppppppppk",
    ".....kppppppppk",
    "......kpkkkpk",
    "......kok.kok",
    ".....kook.kook",
    ".....kkkk.kkkk",
]

LADO = [
    "............kk",
    "...........kgyk",
    "..........kgyrk..kk",
    "..........kgyryk.kyk",
    "...kkkk..kgyryyk.kyrk",
    "..kpppkkkgyryygkkyrygk",
    ".kppwkpkkgyryygkgyrygk",
    "kokpkkppkkGgyygkgyryk",
    "kOkppppppkkGgykyrygk",
    ".kkpyyyypppkkkgyrygk",
    "...kpyYYYYyppppkkgk",
    "...kpyYYYYyyppppkk",
    "....kpyyyyypppppk",
    ".....kppkkkkkppk",
    "......kok..kok",
    ".....kook.kook",
    ".....kkkk.kkkk",
]

PATAS_FRENTE = ((5, 10), (10, 15), 14)
PATAS_LADO = ((5, 10), (10, 15), 14)

if __name__ == "__main__":
    from comum import salvar
    salvar(1071, FRENTE, COSTAS, LADO, CORES, PATAS_FRENTE, PATAS_LADO, previa=os.environ.get("PREVIA"))
    print("PLUMÁRIO: andar feito")
