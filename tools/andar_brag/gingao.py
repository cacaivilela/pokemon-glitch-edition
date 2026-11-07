"""O GINGÃO ANDANDO (na ginga), desenhado do zero (o CAIO, nov/2026: "faz do
zero"). O macaco mestre de capoeira: maior, de braço forte, a calça branca
com o CORDÃO colorido (verde, amarelo, vermelho) e o rabo comprido. Letras
da MACACOEIRA mais: g verde, y amarelo, r vermelho (o cordão)."""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from macacoeira import CORES as BASE  # noqa: E402

CORES = {**BASE, "m": (126, 80, 48), "M": (165, 132, 110), "d": (93, 59, 36), "D": (78, 50, 34),
         "f": (230, 190, 140), "c": (238, 210, 174), "C": (200, 176, 140),
         "g": (60, 170, 80), "y": (250, 210, 50), "r": (230, 50, 50)}

FRENTE = [
    "........kkkkkk",
    "......kkmMMmmmkk",
    "...kk.kmMmmmmmmk.kk",
    "..kfmkkmffmmffmkkmfk",
    "..kfmkffffffffffkmfk",
    "...kkkffkeffekffkkk",
    ".....kfffffffffffk...........kk",
    "......kfffkxkfffk...........kdk",
    "..kkk..kkffffffkk..kkk.....kdk",
    ".kmmmkkkmmmmmmmmmkkmmmk...kdk",
    "kmmdmmmmmmMMMmmmmmmmdmmk.kdk",
    "kkkkkdmmmMMMMMmmmmdkkkkk.kdk",
    "kffk.kmmmMMMMMmmmmk.kffkkdk",
    ".kk..kmmmmMMMmmmmmk..kkkdk",
    "......kgyrgyrgyrgyrkkkkdk",
    "......kccccccccccccck",
    "......kccCcccccCccck",
    "......kccCcckkcCccck",
    "......kcccck..kcccck",
    "......kcccck..kcccck",
    ".....kdmmmmk..kmmmmdk",
    ".....kkkkkkk..kkkkkkk",
]

COSTAS = [
    "........kkkkkk",
    "......kkmMMmmmkk",
    "...kk.kmMmmmmmmk.kk",
    "..kfmkkmmmmmmmmkkmfk",
    "..kfmkmmmmmmmmmmkmfk",
    "...kkkmmmmmmmmmmkkk",
    ".....kmmmmmmmmmmmk",
    "......kmmmmmmmmmk",
    "..kkk..kkmmmmmmkk..kkk",
    ".kmmmkkkmmmmmmmmmkkmmmk",
    "kmmdmmmmmmmmmmmmmmmmdmmk",
    "kkkkkdmmmmmmmmmmmmdkkkkk",
    "kffk.kmmmmmmmmmmmmk.kffk",
    ".kk..kmmmmmmkkmmmmk..kk",
    "......kgyrgykdkgyrgyrk",
    "......kccccckdkccccck",
    "......kccCcckdkcCccck",
    "......kccCckkdkkcCcck",
    "......kcccck.kdkcccck",
    "......kcccck..kdkccck",
    ".....kdmmmmk..kmkmmdk",
    ".....kkkkkkk..kkkkkkk",
]

LADO = [
    ".........kkkkkk",
    ".......kkmMMmmmk",
    ".......kmMmmmmmmk.kk",
    "......kffmmmmmmmkkmfk",
    ".....kffffmmmmmmmkmfk",
    ".....kfekfmmmmmmmkkk",
    "....kffffffmmmmmmk",
    "....kfkxkffmmmmmk",
    ".....kkffffmmmmk",
    "......kkkmmmmmmk",
    ".kkkkkkmmmmMMmmk",
    "kfmmmmmmmmMMMmmmkk.......kk",
    "kffkkkkmmMMMMMmmmdk.....kdk",
    ".kk...kmmmMMMMmmmdk....kdk",
    "......kgyrgyrgyrgyrkkkkkdk",
    "......kcccccccccccckkkdkk",
    "......kccCccccCcccck",
    "......kcccck..kcccck",
    ".....kcccck....kccck",
    ".....kcccck....kccck",
    "....kdmmmmk....kmmmdk",
    "....kkkkkkk....kkkkkk",
]

PATAS_FRENTE = ((5, 13), (13, 22), 18)
PATAS_LADO = ((4, 12), (14, 22), 17)

if __name__ == "__main__":
    from comum import salvar
    salvar(1059, FRENTE, COSTAS, LADO, CORES, PATAS_FRENTE, PATAS_LADO, previa=os.environ.get("PREVIA"))
    print("GINGÃO: andar feito")
