"""O GATONET ANDANDO, desenhado do zero (o CAIO, nov/2026: "faz do zero").
O gato preto do "gato" de internet: enrolado nos FIOS vermelho e azul, os
olhos amarelos enormes, e o rabo que termina num PLUGUE soltando faísca (a
faísca pisca no passo).
  k contorno   c gato   C gato claro   D gato escuro   y olho   r fio vermelho
  b fio azul   B fio azul escuro   p nariz   w brilho   s faísca"""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

CORES = {
    "k": (24, 20, 32), "c": (62, 56, 80), "C": (120, 116, 132), "D": (46, 41, 59), "y": (255, 214, 40),
    "r": (214, 52, 52), "R": (154, 37, 37), "b": (60, 110, 220), "B": (43, 79, 158), "p": (210, 120, 150),
    "w": (255, 255, 255), "s": (255, 246, 190),
}

FRENTE = [
    "...kk.......kk",
    "..kCck.....kcCk",
    "..kccckkkkkcccck",
    "..kcccccccccccck",
    ".kcckkkcccckkkcck",
    ".kckyykcccckyykck",
    ".kckywkcccckywkck",
    ".kcckkkcckcckkkcck",
    "..kcccccpkccccck..........ks",
    "...kkcckkkkcckk..........ksk",
    "..kcrrrcccccbbbck.......kgk",
    ".kccrRRrrcbbBBcck......kgk",
    ".kcccrrrrbbbbcccckkkkkkkk",
    ".kcbbbcccrrrcccbbkcccck",
    ".kcBBbbccRRrcbbBccck",
    "..kcccbbbccbbbcccck",
    "..kcck.kkkkkk.kcck",
    "..kCck........kCck",
    "..kkkk........kkkk",
]

COSTAS = [
    "...kk.......kk",
    "..kCck.....kcCk",
    "..kccckkkkkcccck",
    "..kcccccccccccck",
    ".kcccccccccccccck",
    ".kcccccccccccccck",
    ".kcccccccccccccck",
    ".kcccccccccccccck",
    "..kcccccccccccck",
    "...kkccccccccck",
    "..kcrrrcccccbbbck",
    ".kccrRRrrcbbBBcck",
    ".kcccrrrrbbbbcccck",
    ".kcbbbcccrrrcccbbk",
    ".kcBBbbccRRrcbbBck",
    "..kcccbbbcckkbbcck",
    "..kcck.kkkkcckkcck",
    "..kCck....kcck.kCck",
    "..kkkk...kgk...kkkk",
    ".........ksk",
    "..........s",
]

LADO = [
    "...kk..kk",
    "..kCckkcCk",
    "..kcccccccck",
    ".kcccccccccck",
    "kcckkkcccccck",
    "kckyykcccccck",
    "kckywkcccccck",
    "kpkkkcccccccck",
    ".kkcccccccccccckkkkkkkkkkk",
    "...kkcrrrcccbbbcccccccccck.ks",
    "....kccrRRrrcbbBBcccccccck.ksk",
    "....kcccrrrrbbbbccccccccckkgk",
    "....kcbbbcccrrrcccbbbcccccgk",
    "....kcBBbbccRRrcbbBBcccccck",
    ".....kcccbbbccbbbccccccck",
    ".....kcck.kkkkkkkkkk.kcck",
    ".....kCck............kCck",
    ".....kkkk............kkkk",
]

PATAS_FRENTE = ((1, 7), (13, 19), 16)
PATAS_LADO = ((4, 10), (20, 26), 15)

if __name__ == "__main__":
    from comum import salvar
    cores = {**CORES, "g": (152, 152, 157)}
    salvar(1064, FRENTE, COSTAS, LADO, cores, PATAS_FRENTE, PATAS_LADO, fogo=[("s", "y")], previa=os.environ.get("PREVIA"))
    print("GATONET: andar feito")
