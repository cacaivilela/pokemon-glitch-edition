"""O MACACAVERN ANDANDO, desenhado do zero (o CAIO, nov/2026: "faz do zero").
O macaco homem das cavernas: grandão de pelo cinza, a testa grande com a
sobrancelha grossa, a cara cor de pele, a TANGA de onça laranja de pintinha e
o OSSO de porrete na mão.
  k contorno   g cinza   G cinza claro   d cinza escuro   f cara   F cara clara
  o onça   O onça escura   n pintinha   w osso   W osso na sombra   e olho"""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

CORES = {
    "k": (40, 18, 56), "g": (128, 118, 112), "G": (170, 160, 150), "d": (84, 76, 74), "f": (238, 200, 156),
    "F": (244, 236, 210), "o": (226, 146, 64), "O": (176, 98, 40), "n": (84, 50, 30), "w": (244, 236, 210),
    "W": (198, 184, 150), "e": (40, 18, 56),
}

FRENTE = [
    "......kkkkkk...........kk",
    "....kkGGggggkk........kwwk",
    "...kGgggggggggk......kwwk",
    "...kgkkkkkkkkgk.....kWk",
    "...kgkdfffffdkgk...kWk",
    "...kgkfefffeffkk..kWk",
    "...kgkffffffffk..kWk",
    "....kkfffkkfffk.kWk",
    ".....kffffffffkkWk",
    ".kk..kkkkkkkkkkkWk",
    "kggkkgggggggggggkk",
    "kgggkoooooonoooggk",
    "kgdkkonoooooonokgk",
    "kfk.koooonoooook.k",
    ".k..kOoooooooooOk",
    "....kggggkkggggk",
    "....kgggk..kgggk",
    "...kdggk....kggdk",
    "...kffk......kffk",
    "...kkkk......kkkk",
]

COSTAS = [
    "......kkkkkk",
    "....kkGGggggkk",
    "...kGgggggggggk",
    "...kggggggggggk",
    "...kggGggggGgggk",
    "...kgggggggggggk",
    "...kgggggggggggk",
    "....kggggggggggk",
    "kk...kggggggggkk",
    "kwk..kkkkkkkkkkkk",
    "kwwkkggggggggggggk",
    ".kWkkgggggggggggggk",
    "..kWkgggggggggggkgk",
    "...kWkoooonooooooOk",
    "....kWOoooooonoooOk",
    "....kggggkkgggggk",
    "....kgggk..kgggk",
    "...kdggk....kggdk",
    "...kffk......kffk",
    "...kkkk......kkkk",
]

LADO = [
    "......kkkkkk",
    "....kkGGgggkk",
    "...kGggggggggk",
    "..kkkkkggggggk.........kk",
    ".kdffffkgggggk........kwwk",
    "kfefffffkggggk.......kwwk",
    "kfffffffkgggk.......kWk",
    "kkfffkkfkgggk......kWk",
    ".kfffffffkgk......kWk",
    "..kkkkkkkkkk.....kWk",
    "....kggggggggkkkkWk",
    "...kgoooonoooookkk",
    "...kgonooooonook",
    "...kfoooonoooook",
    "....kOoooooooOk",
    "....kggggkkgggk",
    "....kgggk..kggk",
    "...kdggk...kggdk",
    "...kffk.....kffk",
    "...kkkk.....kkkk",
]

PATAS_FRENTE = ((3, 9), (10, 17), 16)
PATAS_LADO = ((3, 9), (10, 17), 16)

if __name__ == "__main__":
    from comum import salvar
    salvar(1117, FRENTE, COSTAS, LADO, CORES, PATAS_FRENTE, PATAS_LADO, previa=os.environ.get("PREVIA"))
    print("MACACAVERN: andar feito")
