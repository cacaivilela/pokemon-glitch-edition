"""O SANDBASH ANDANDO (quicando), desenhado do zero (o CAIO, nov/2026: "faz do
zero"). As três cabeças marrons peludas de chifre em cima da BOLA de futebol
(o corpo dele quica que nem bola).
  k contorno   m marrom   M marrom escuro   c focinho claro   w bola branca
  n gomo preto   g sombra da bola   e olho"""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

CORES = {
    "k": (24, 20, 32), "m": (150, 112, 78), "M": (108, 78, 54), "c": (232, 214, 176), "w": (238, 238, 242),
    "W": (243, 243, 246), "n": (34, 34, 42), "g": (176, 176, 179), "e": (24, 20, 32),
}

FRENTE = [
    ".k.k....k.k....k.k",
    ".kMk...kMMk...kMk",
    "kmmmk.kmmmmk.kmmmk",
    "kmemkkmekemmkkmemk",
    "kmccmkmcccckmkccmk",
    ".kcckkkcnnckkkcck",
    "..kk.kwkcckwk.kk",
    "....kwnnwwwnnwk",
    "...kwwnnwwwnnwwk",
    "...kwwwwnnnwwwwk",
    "...knnwwnnnwwnnk",
    "...kgnwwwwwwwngk",
    "....kgwwnnnwwgk",
    ".....kkggggggkk",
    ".......kkkkkk",
]

COSTAS = [
    ".k.k....k.k....k.k",
    ".kMk...kMMk...kMk",
    "kmmmk.kmmmmk.kmmmk",
    "kmmmkkmmmmmmkkmmmk",
    "kmMmmkmmMmmkmmmMmk",
    ".kmmkkkmmmmkkkmmk",
    "..kk.kwkmmkwk.kk",
    "....kwnnwwwnnwk",
    "...kwwnnwwwnnwwk",
    "...kwwwwnnnwwwwk",
    "...knnwwnnnwwnnk",
    "...kgnwwwwwwwngk",
    "....kgwwnnnwwgk",
    ".....kkggggggkk",
    ".......kkkkkk",
]

LADO = [
    "...k.k....k.k",
    "...kMk...kMMk",
    "..kmmmk.kmmmmk",
    "..kemmkkmemmmk",
    ".kccmmkkcmmmMk",
    "..kkmmkkkmmmk",
    "....kkwkkkwk",
    "....kwnnwwwnwk",
    "...kwwnnwwwnwwk",
    "...kwwwwnnnwwwk",
    "...knnwwnnnwwnk",
    "...kgnwwwwwwwgk",
    "....kgwwnnnwgk",
    ".....kkgggggkk",
    ".......kkkkk",
]

if __name__ == "__main__":
    from comum import salvar
    salvar(1083, FRENTE, COSTAS, LADO, CORES, ((0, 0),) * 2, ((0, 0),) * 2, previa=os.environ.get("PREVIA"), pulo=True)
    print("SANDBASH: andar feito")
