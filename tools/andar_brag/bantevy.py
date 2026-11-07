"""O BANTEVY ANDANDO (pulando, como passarinho no chão), desenhado do zero (o
CAIO, nov/2026: "faz do zero"). O bem-te-vi: a cabeça preta com a faixa
BRANCA em cima do olho, o peito AMARELO, as costas marrons, o bico preto e as
perninhas.
  k contorno   n preto   N preto claro   w branco   y amarelo   Y amarelo
  claro   m marrom   M marrom escuro   g perna   e olho"""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

CORES = {
    "k": (24, 20, 32), "n": (40, 36, 44), "N": (104, 102, 107), "w": (250, 250, 250), "y": (252, 214, 48),
    "Y": (253, 226, 110), "m": (140, 100, 60), "M": (96, 66, 40), "g": (154, 130, 109), "e": (24, 20, 32),
}

FRENTE = [
    "....kkkkkk",
    "...knnnnnnk",
    "..kwwwwwwwwk",
    "..knkeknkekk",
    "..knnnkkknnk",
    "..kwwwknkwwk",
    ".kmkwwwwwwkmk",
    ".kmkyYYYYykmk",
    ".kMkyYYYYykMk",
    ".kMkyyYYyykMk",
    "..kkyyyyyykk",
    "...kkyyyykk",
    "....kgkkgk",
    "...kgk..kgk",
    "...kk....kk",
]

COSTAS = [
    "....kkkkkk",
    "...knnnnnnk",
    "..kwwwwwwwwk",
    "..knnnnnnnnk",
    "..knnnnnnnnk",
    "..kmmmmmmmmk",
    ".kmmmmmmmmmmk",
    ".kmmMmmmmMmmk",
    ".kMmmmmmmmmMk",
    ".kMMmmmmmmMMk",
    "..kkmmmmmmkk",
    "...kkMmmMkk",
    "....kgkkgk",
    "...kgk..kgk",
    "...kk....kk",
]

LADO = [
    "....kkkkk",
    "...knnnnnk",
    "..kwwwwwwwk",
    "kkknkennnnk",
    "knnnnkknnnk",
    ".kkkwwwnnnk",
    "...kYYwmmmmk",
    "...kyYYmmmmMk",
    "...kyYYYmmmMMk",
    "...kyyYYmmMMMMk",
    "....kyyyymMMkkk",
    ".....kkyyykk",
    "......kgkgk",
    ".....kgk.kgk",
    ".....kk...kk",
]

if __name__ == "__main__":
    from comum import salvar
    salvar(1079, FRENTE, COSTAS, LADO, CORES, ((0, 0),) * 2, ((0, 0),) * 2, previa=os.environ.get("PREVIA"), pulo=True)
    print("BANTEVY: andar feito")
