"""O BRITADEIRO ANDANDO (pulando na ponta da broca, como britadeira), desenhado
do zero (o CAIO, nov/2026: "faz do zero"). A britadeira viva: o capacete
amarelo, o corpo de pedra com a cara brava, os dois braços de cano pra cima
segurando as alças e a BROCA de metal embaixo.
  k contorno   y capacete   Y capacete claro   p pedra   P pedra clara
  d pedra escura   g metal   G metal claro   m metal escuro   e olho"""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

CORES = {
    "k": (24, 20, 32), "y": (250, 200, 30), "Y": (253, 226, 110), "p": (150, 136, 120), "P": (182, 172, 160),
    "d": (111, 101, 89), "g": (170, 178, 192), "G": (196, 201, 211), "m": (126, 132, 142), "e": (24, 20, 32),
    "b": (92, 52, 34),
}

FRENTE = [
    "..kk..........kk",
    ".kGgk........kgGk",
    ".kgk..........kgk",
    ".kgk..kkkkkk..kgk",
    ".kgk.kYYYYyyk.kgk",
    ".kgkkYyyyyyyykkgk",
    "..kgkkkkkkkkkkgk",
    "...kpPPPPPPPPpk",
    "...kpkekPPkekpk",
    "...kpdkkppkkdpk",
    "...kpppkkkkpppk",
    "....kdpppppppdk",
    ".....kkkgggkkk",
    "......kGgggmk",
    ".......kGgmk",
    ".......kGgmk",
    "........kgk",
    "........kk",
]

COSTAS = [
    "..kk..........kk",
    ".kGgk........kgGk",
    ".kgk..........kgk",
    ".kgk..kkkkkk..kgk",
    ".kgk.kYYYYyyk.kgk",
    ".kgkkYyyyyyyykkgk",
    "..kgkkkkkkkkkkgk",
    "...kpPPPPPPPPpk",
    "...kpPPPPPPPPpk",
    "...kpppPPPPpppk",
    "...kpppppppppdk",
    "....kdpppppppdk",
    ".....kkkgggkkk",
    "......kGgggmk",
    ".......kGgmk",
    ".......kGgmk",
    "........kgk",
    "........kk",
]

LADO = [
    "....kk",
    "...kGgk..kk",
    "...kgk..kgGk",
    "...kgkkkkgk",
    "...kgkYYYkgk",
    "..kkYyyyyykk",
    "..kkkkkkkkk",
    "..kPPPPPPpk",
    "..kekPPPPpk",
    "..kkdpppppk",
    "..kpppppppk",
    "...kdpppdk",
    "....kkggkk",
    "....kGggmk",
    ".....kGgmk",
    ".....kGgmk",
    "......kgk",
    "......kk",
]

if __name__ == "__main__":
    from comum import salvar
    salvar(1087, FRENTE, COSTAS, LADO, CORES, ((0, 0),) * 2, ((0, 0),) * 2, previa=os.environ.get("PREVIA"), pulo=True)
    print("BRITADEIRO: andar feito")
