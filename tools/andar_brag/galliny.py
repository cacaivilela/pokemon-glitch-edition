"""O GALLINY ANDANDO, desenhado do zero (o CAIO, nov/2026: "faz do zero"). A
ave corredora do fóssil: o pescoço comprido creme, a cabeça com a CRISTA roxa
e o bico, o corpo de penas com a mancha marrom, a cauda de penas roxas e as
pernas compridas.
  k contorno   c creme   C creme claro   s creme na sombra   m marrom
  M marrom escuro   p roxo   P roxo claro   b bico   l perna   e olho"""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

CORES = {
    "k": (24, 20, 32), "c": (236, 220, 180), "C": (242, 230, 202), "s": (194, 180, 148), "m": (150, 112, 74),
    "M": (145, 126, 89), "p": (190, 150, 255), "P": (220, 200, 255), "b": (196, 170, 120), "l": (226, 182, 134),
    "e": (24, 20, 32),
}

FRENTE = [
    "....k.k",
    "...kpkpk",
    "....kpk",
    "...kcCck",
    "..kckcekk",
    "..kcbbcck",
    "...kkbkk",
    "....kcck",
    "....kcck",
    "...kkcckk",
    "..kcCCCcck",
    ".kpcCmmmcspk",
    ".kpccmmmcspk",
    "..kccccccsk",
    "...kkkkkkk",
    "....kl.kl",
    "....kl.kl",
    "....kl.kl",
    "...kll.kll",
    "...kkk.kkk",
]

COSTAS = [
    "....k.k",
    "...kpkpk",
    "....kpk",
    "...kcCck",
    "..kcccckk",
    "..kcccccck",
    "...kkcckk",
    "....kcck",
    "....kcck",
    "...kkcckk",
    "..kcCCCcck",
    ".kpcpppppcpk",
    ".kppPpppPppk",
    "..kpppppppk",
    "...kkkkkkk",
    "....kl.kl",
    "....kl.kl",
    "....kl.kl",
    "...kll.kll",
    "...kkk.kkk",
]

LADO = [
    "....k.k",
    "...kpkpk",
    "....kpk",
    "...kcCck",
    "..kckecck",
    "kbbbcccck",
    ".kkkkcck",
    ".....kcck",
    "......kcck",
    "......kcckkkkk.kk",
    ".....kcCCcccckkpk",
    ".....kcCmmmmcckPpk",
    "......kcmmmmccsppk",
    ".......kcccccssk",
    "........kkkkkkk",
    ".........kl.kl",
    "........kl..kl",
    ".......kl...kl",
    "......kll..kll",
    "......kkk..kkk",
]

PATAS_FRENTE = ((3, 7), (7, 11), 15)
PATAS_LADO = ((5, 11), (11, 15), 15)

if __name__ == "__main__":
    from comum import salvar
    salvar(1099, FRENTE, COSTAS, LADO, CORES, PATAS_FRENTE, PATAS_LADO, previa=os.environ.get("PREVIA"))
    print("GALLINY: andar feito")
