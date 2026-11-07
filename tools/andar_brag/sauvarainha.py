"""A SAUVARAINHA ANDANDO, desenhada do zero (o CAIO, nov/2026: "faz do zero").
A rainha das saúvas: a COROA de folhas espetadas na cabeça, os olhos grandes,
as ASAS de vidro azul-claro com as manchinhas verdes, o corpo vermelho e o
bumbum creme. Letras da SAUVINHA mais: c creme, C creme escuro, a asa,
A asa clara, j a coroa, J a coroa escura."""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

CORES = {
    "k": (24, 20, 32), "r": (160, 48, 38), "R": (118, 36, 28), "L": (188, 110, 103), "e": (24, 20, 32),
    "c": (236, 226, 196), "C": (196, 184, 150), "a": (206, 226, 236), "A": (240, 248, 252),
    "j": (166, 216, 127), "J": (128, 200, 72), "w": (250, 250, 250), "g": (96, 176, 64),
}

FRENTE = [
    "......k.k.k.k",
    ".....kjkJkjkJk",
    ".....kJjJjJjJk",
    "kk...kkjJJjJkk...kk",
    "kAak..krrrrrk..kaAk",
    "kAAak.krrrrrk.kaAAk",
    ".kaaakrkkrkkrkaaak",
    ".kaAakrkwrkwrkaAak",
    "..kaakrrrrrrrkaak",
    "..kakkkRkkkRkkkak",
    "...kk.krrrrrk.kk",
    ".kk..krrRRRrrk..kk",
    "..kkkkrRRRRRrkkkk",
    "....kkrrrrrrrkk",
    "...kk.kcccccck.kk",
    "..kk.kccCCCcck..kk",
    ".kk..kcccccccck..kk",
    ".....kCcccccCk",
    "......kkkkkkk",
]

COSTAS = [
    "......k.k.k.k",
    ".....kjkJkjkJk",
    ".....kJjJjJjJk",
    "kk...kkjJJjJkk...kk",
    "kAak..krrrrrk..kaAk",
    "kAAak.krrrrrk.kaAAk",
    "kaAAakrrrrrrrkaAAak",
    ".kaAAkrrrrrrrkAAak",
    ".kagAakrrrrrkaAgak",
    "..kaaakRRRRRkaaak",
    "...kkkkrrrrrkkkk",
    ".kk..krrRRRrrk..kk",
    "..kkkkrRRRRRrkkkk",
    "....kkcccccccck",
    "...kk.kccCCCcck.kk",
    "..kk.kccCCCCCcck.kk",
    ".kk..kcccccccccck.kk",
    ".....kCcccccccCk",
    "......kkkkkkkkk",
]

LADO = [
    "....k.k.k.k",
    "...kjkJkjkJk",
    "...kJjJjJjJk",
    "...kkjJJjJkk..kkkk",
    "...krrrrrrk..kaAAAkk",
    "..krwkrrrrrkkaAAAAAak",
    "..krkkrrrrrkaAAgAAaak",
    "..kRkrrrrrkaaAAAaak",
    "...kRkrrrkkkaaaakk",
    "....kkrrrkrrrkkkkkkk",
    "......kkrRRRrkccccccck",
    ".....kk.krRRrkcccCCcccck",
    "....kk.kkkkkkkcCCCCCccck",
    "...kk.kk..kk..kcccccccck",
    "......kk.kk....kCccccCk",
    "..............kkkkkkkk",
]

PATAS_FRENTE = ((0, 6), (13, 20), 14)
PATAS_LADO = ((3, 8), (8, 14), 12)

if __name__ == "__main__":
    from comum import salvar
    salvar(1046, FRENTE, COSTAS, LADO, CORES, PATAS_FRENTE, PATAS_LADO, previa=os.environ.get("PREVIA"))
    print("SAUVARAINHA: andar feito")
