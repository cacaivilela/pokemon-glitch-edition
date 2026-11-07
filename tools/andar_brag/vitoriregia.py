"""A VITÓRIA-RÉGIA ANDANDO (deslizando aos pulinhos), desenhada do zero (o CAIO,
nov/2026: "faz do zero"). A folha redonda gigante com a BORDA virada pra
cima (vermelha por fora), a FLOR rosa aberta no meio com a carinha de olho
fechado, e a aguinha em volta.
  k contorno   g folha   G folha escura   l folha clara   B a borda
  p flor rosa   P rosa claro   w branco   y miolo   a água   A água clara"""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

CORES = {
    "k": (24, 20, 32), "g": (84, 156, 72), "G": (50, 110, 54), "l": (135, 186, 127), "B": (184, 74, 72),
    "p": (242, 150, 184), "P": (250, 200, 220), "w": (252, 247, 250), "y": (252, 214, 80),
    "a": (62, 111, 155), "A": (84, 150, 210), "e": (60, 40, 60),
}

FRENTE = [
    "..........kk.kk",
    ".........kwkkwk",
    "......kk.kwPPwk.kk",
    ".....kwkkPPppPPkkwk",
    "......kPwPpppppPwPk",
    ".....kwPPpekppekPPwk",
    "......kPpppppppppPk",
    "....kkkkPppkkkppPkkkk",
    "..kkgglkkkPPPPPkkkggkk",
    ".kglllgggkkkkkkkggglllgk",
    "kBglllgggggggggggggllgBk",
    "kBBgggggGgggggGggggggBBk",
    ".kBBBggggggGggggggBBBBk",
    "..kkBBBBBBBBBBBBBBBBkk",
    ".kAAkkkkkkkkkkkkkkkkAAk",
    "kaAaaaAaaaaAaaaaAaaaaAak",
    ".kkaaaaaaaaaaaaaaaaaakk",
    "...kkkkkkkkkkkkkkkkkk",
]

COSTAS = [
    "..........kk.kk",
    ".........kwkkwk",
    "......kk.kwPPwk.kk",
    ".....kwkkPPppPPkkwk",
    "......kPwPpppppPwPk",
    ".....kwPPpppppppPPwk",
    "......kPpppppppppPk",
    "....kkkkPppppppPkkkk",
    "..kkgglkkkPPPPPkkkggkk",
    ".kglllgggkkkkkkkggglllgk",
    "kBglllgggggggggggggllgBk",
    "kBBgggggGgggggGggggggBBk",
    ".kBBBggggggGggggggBBBBk",
    "..kkBBBBBBBBBBBBBBBBkk",
    ".kAAkkkkkkkkkkkkkkkkAAk",
    "kaAaaaAaaaaAaaaaAaaaaAak",
    ".kkaaaaaaaaaaaaaaaaaakk",
    "...kkkkkkkkkkkkkkkkkk",
]

LADO = [
    "..........kk",
    ".........kwk.kk",
    "........kwPkkwk",
    ".......kPPpPPPk",
    "......kwPpppppPk",
    ".......kPekpppPk",
    "......kPppppppPk",
    "....kkkkPppppPkkkk",
    "..kkgglkkPPPPkkgggkk",
    ".kglllgggkkkkkgglllgk",
    "kBglllggggggggggllgBk",
    "kBBgggggGggggGgggggBk",
    ".kBBBggggggGgggggBBk",
    "..kkBBBBBBBBBBBBBBkk",
    ".kAAkkkkkkkkkkkkkkAAk",
    "kaAaaaAaaaaAaaaaAaaAk",
    ".kkaaaaaaaaaaaaaaaakk",
    "...kkkkkkkkkkkkkkkk",
]

if __name__ == "__main__":
    from comum import salvar
    salvar(1050, FRENTE, COSTAS, LADO, CORES, ((0, 0),) * 2, ((0, 0),) * 2, previa=os.environ.get("PREVIA"), pulo=True)
    print("VITÓRIA-RÉGIA: andar feito")
