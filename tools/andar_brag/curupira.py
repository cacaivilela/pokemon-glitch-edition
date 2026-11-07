"""O CURUPIRA ANDANDO, desenhado do zero (o CAIO, nov/2026: "faz do zero").
O guardião da mata: o CABELO de fogo (laranja por fora, verde por dentro,
tremula), a cara de madeira com os olhos verdes acesos, o corpo de galho
com a saia de folhas e os PÉS VIRADOS PRA TRÁS (de lado, o calcanhar vai na
frente: quem segue o rastro dele vai pro lado errado).
  k contorno   o fogo   y fogo claro   g verde aceso   G folha   l folha clara
  t madeira   T madeira escura   L madeira clara   e olho"""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

CORES = {
    "k": (24, 20, 32), "o": (255, 140, 40), "y": (255, 210, 90), "g": (110, 230, 110), "G": (70, 150, 70),
    "l": (126, 182, 126), "D": (52, 111, 52), "t": (140, 112, 72), "T": (104, 84, 54), "L": (174, 155, 127),
    "e": (24, 20, 32),
}

FRENTE = [
    "...k...k...k...k",
    "..kok.kok.kok.kok",
    "..koyk.kyokkyokoyk",
    ".koyggkkoyggkoggyok",
    ".kogggkgogggogggok",
    "..kkggggggggggggkk",
    "....ktttLLLLtttk",
    "....ktkkgttgkktk",
    "....ktkggttggktk",
    "....kttttkkttttk",
    ".....kttTTTTttk",
    "..kk..kkttttkk..kk",
    ".kLtkkkTttttTkkktLk",
    "..kkk.kGlGlGlGk.kkk",
    "......kGGlGlGGk",
    ".....kDGGGGGGGDk",
    "......kkTtkTtkk",
    ".......kTtkTtk",
    "......kTTkkkTTk",
    "......kkk...kkk",
]

COSTAS = [
    "...k...k...k...k",
    "..kok.kok.kok.kok",
    "..koyk.kyokkyokoyk",
    ".koyggkkoyggkoggyok",
    ".kogggkgogggogggok",
    "..koggggggggggggok",
    "....kogggggggggok",
    "....koggggggggok",
    "....ktoggggggotk",
    "....kttoggggottk",
    ".....kttTTTTttk",
    "..kk..kkttttkk..kk",
    ".kLtkkkTttttTkkktLk",
    "..kkk.kGlGlGlGk.kkk",
    "......kGGlGlGGk",
    ".....kDGGGGGGGDk",
    "......kkTtkTtkk",
    ".......kTtkTtk",
    "......kTTkkkTTk",
    "......kkk...kkk",
]

LADO = [
    "....k...k...k",
    "...kok.kok.kok",
    "...koyk.kyokkyok",
    "..koyggkkoyggkogok",
    "..kogggkgogggoggok",
    "...kkggggggggggok",
    "....kLLttttgggok",
    "....kgkttttggok",
    "...kLttttttgok",
    "...kkkttttttok",
    ".....kttTTTTk",
    "......kttttkk",
    ".....kktttttkk",
    ".....kGlGlGlk",
    ".....kGGlGlGk",
    "....kDGGGGGGDk",
    ".....kkTtkTtk",
    "......kTtkTtk",
    "......kTTTkTTTk",
    "......kkkkkkkkk",
]

PATAS_FRENTE = ((5, 11), (11, 16), 16)
PATAS_LADO = ((5, 10), (10, 16), 16)

if __name__ == "__main__":
    from comum import salvar
    salvar(1078, FRENTE, COSTAS, LADO, CORES, PATAS_FRENTE, PATAS_LADO, fogo=[("o", "y")], previa=os.environ.get("PREVIA"))
    print("CURUPIRA: andar feito")
