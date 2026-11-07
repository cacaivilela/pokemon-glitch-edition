"""A MACACOEIRA ANDANDO (na ginga), desenhada do zero (o CAIO, nov/2026: "faz
do zero"). O macaco da capoeira: a cara clarinha em coração, as orelhas
redondas, os braços compridos abertos na ginga, a CALÇA branca de capoeira e
o rabo enrolado.
  k contorno   m pelo   M pelo claro   d pelo escuro   D o mais escuro
  f a cara   c a calça   C a calça na sombra   e olho   w brilho"""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

CORES = {
    "k": (24, 20, 32), "m": (140, 92, 56), "M": (174, 141, 116), "d": (104, 68, 41), "D": (64, 41, 28),
    "f": (232, 196, 150), "c": (238, 232, 210), "C": (200, 190, 170), "e": (24, 20, 32), "w": (250, 250, 250),
    "x": (204, 60, 60),
}

FRENTE = [
    ".......kkkkkk",
    ".....kkmMMmmmkk",
    "..kk.kmMmmmmmmk.kk",
    ".kfmkkmffmmffmkkmfk",
    ".kfmkffffffffffkmfk",
    "..kkkffkeffekffkkk",
    "....kfffffffffffk..........kk",
    ".....kfffkxkfffk..........kdk",
    "..kk..kkffffffkk..kk.....kdk",
    ".kmmkkkmmmmmmmmmkkmmk...kdk",
    ".kdmmmmmmMMMmmmmmmmdk..kdk",
    "..kkkdmmMMMMMmmmdkkk..kdk",
    ".....kmmMMMMMmmmk...kkdk",
    ".....kccccccccccckkkdkk",
    ".....kccCccccCcck.kk",
    ".....kccCcckcCcck",
    ".....kcccck.kccck",
    ".....kcccck.kccck",
    "....kdmmmk...kmmmdk",
    "....kkkkkk...kkkkkk",
]

COSTAS = [
    ".......kkkkkk",
    ".....kkmMMmmmkk",
    "..kk.kmMmmmmmmk.kk",
    ".kfmkkmmmmmmmmkkmfk",
    ".kfmkmmmmmmmmmmkmfk",
    "..kkkmmmmmmmmmmkkk",
    "....kmmmmmmmmmmmk",
    ".....kmmmmmmmmmk",
    "..kk..kkmmmmmmkk..kk",
    ".kmmkkkmmmmmmmmmkkmmk",
    ".kdmmmmmmmmmmmmmmmmdk",
    "..kkkdmmmmmmmmmmdkkk",
    ".....kmmmmmkkmmmk",
    ".....kcccccckdkcck",
    ".....kccCccckdkcck",
    ".....kccCcckkdkkck",
    ".....kcccck.kdkcck",
    ".....kcccck..kdkck",
    "....kdmmmk...kmkkdk",
    "....kkkkkk...kkkkkk",
]

LADO = [
    "........kkkkkk",
    "......kkmMMmmmk",
    "......kmMmmmmmmk.kk",
    ".....kffmmmmmmmkkmfk",
    "....kffffmmmmmmmkmfk",
    "....kfekfmmmmmmmkkk",
    "...kffffffmmmmmmk",
    "...kfkxkffmmmmmk",
    "....kkffffmmmmk",
    ".....kkkmmmmmmk",
    ".kkkkkmmmmMMmmk",
    "kfmmmmmmmMMMmmmkk......kk",
    ".kkkkkmmMMMMMmmmdk....kdk",
    "......kmmMMMMmmmdk...kdk",
    "......kcccccccccckkkkdk",
    "......kccCccccCcckkdkk",
    "......kcccck.kcccck",
    ".....kcccck...kccck",
    ".....kcccck...kccck",
    "....kdmmmk....kmmmdk",
    "....kkkkkk....kkkkkk",
]

PATAS_FRENTE = ((4, 11), (11, 20), 16)
PATAS_LADO = ((4, 11), (13, 21), 16)

if __name__ == "__main__":
    from comum import salvar
    salvar(1058, FRENTE, COSTAS, LADO, CORES, PATAS_FRENTE, PATAS_LADO, previa=os.environ.get("PREVIA"))
    print("MACACOEIRA: andar feito")
