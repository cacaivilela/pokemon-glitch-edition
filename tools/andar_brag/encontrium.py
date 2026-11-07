"""O ENCONTRIUM ANDANDO (deslizando aos pulinhos), desenhado do zero (o CAIO,
nov/2026: "faz do zero"). O dragão do ENCONTRO DAS ÁGUAS: dois corpos de
serpente torcidos um no outro, um MARROM (o rio de barro) e um AZUL (o rio
escuro), com as nadadeiras azul-claras, os chifres e a água em volta.
  k contorno   m marrom   M marrom claro   d marrom escuro   b azul
  B azul claro   D azul escuro   f nadadeira   F nadadeira clara   e olho"""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

CORES = {
    "k": (20, 22, 34), "m": (206, 150, 88), "M": (220, 179, 135), "d": (144, 105, 62), "b": (44, 110, 128),
    "B": (70, 150, 176), "D": (70, 50, 46), "f": (80, 176, 184), "F": (129, 198, 204), "e": (20, 22, 34),
}

FRENTE = [
    "....kk....kk",
    "...kDk....kDk",
    "...kDkkkkkkDk",
    "....kmMMBBbk",
    "...kmekMMkebk",
    "...kmmMMBBbbk",
    "kFk.kkmmbbkk.kFk",
    "kfFk..kmbk..kFfk",
    "kffFk.kbmk.kFffk",
    ".kffkkbbmmkkffk",
    "..kkkbbkkmmkkk",
    "....kbbkkmmk",
    "....kmmkkbbk",
    "....kmmkkbbk",
    "....kkmmbbkk",
    "..kFfkkbmkkfFk",
    "..kffffkkffffk",
    "...kkkkkkkkkk",
]

COSTAS = [
    "....kk....kk",
    "...kDk....kDk",
    "...kDkkkkkkDk",
    "....kmMMBBbk",
    "...kmmMMMBBbk",
    "...kmmMMBBbbk",
    "kFk.kkmmbbkk.kFk",
    "kfFk..kmbk..kFfk",
    "kffFk.kbmk.kFffk",
    ".kffkkbbmmkkffk",
    "..kkkbbkkmmkkk",
    "....kbbkkmmk",
    "....kmmkkbbk",
    "....kmmkkbbk",
    "....kkmmbbkk",
    "..kFfkkbmkkfFk",
    "..kffffkkffffk",
    "...kkkkkkkkkk",
]

LADO = [
    "......kk",
    ".....kDk",
    "....kkDkk",
    "...kmMMBbk",
    "..kekMMBbbk",
    "kkmmMMBBbbk",
    "kdmmkkkbbbk..kFk",
    ".kkk..kbmbk.kFfk",
    "......kmbmk.kFffk",
    ".....kbbmmkkkffk",
    ".....kbbkmmmkkk",
    ".....kmmkbbbbk",
    "......kmmkbbbbk",
    ".......kkmmbbbk",
    "..kFfkkkkbmmkk",
    "..kfffffkkkk",
    "...kkkkkk",
]

if __name__ == "__main__":
    from comum import salvar
    salvar(1091, FRENTE, COSTAS, LADO, CORES, ((0, 0),) * 2, ((0, 0),) * 2, fogo=[("f", "F")], previa=os.environ.get("PREVIA"), pulo=True)
    print("ENCONTRIUM: andar feito")
