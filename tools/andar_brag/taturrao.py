"""O TATURRÃO ANDANDO, desenhado do zero (o CAIO, nov/2026: "faz do zero").
O tatu grande de armadura cinza-azulada: as PLACAS da casca, o olho vermelho,
as garras creme e o rabo de placa. As letras do TATUBOLA com as cores dele,
mais: r o olho vermelho, c a garra."""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

CORES = {
    "k": (24, 20, 32), "s": (150, 162, 180), "S": (96, 106, 124), "L": (182, 190, 202), "b": (122, 132, 150),
    "h": (170, 140, 120), "H": (126, 104, 89), "p": (200, 170, 150), "e": (24, 20, 32), "r": (220, 50, 50),
    "c": (236, 226, 200), "w": (250, 250, 250),
}

FRENTE = [
    ".......kkkkkkkkkk",
    ".....kkLLLLLLLLLLkk",
    "....kLLsbsbsbsbsbsLk",
    "...kLsbsbsbsbsbsbsbsk",
    "..kLsbsbsbsbsbsbsbsbsk",
    "..ksbsbsbsbsbsbsbsbsbk",
    ".kssbsbkHkkkkkkHkbsbssk",
    ".ksbsbkHhhhhhhhhHkbsbsk",
    ".ksbsbkhhrkhhkrhhkbsbSk",
    ".kSbsbkhhkkhhkkhhkbsbSk",
    ".kSbsbkhhhhhhhhhhkbsbSk",
    ".kSbsbskhhhpphhhksbsbSk",
    "..kSbsbskhhhhhhksbsbSk",
    "..kSSbsbskkkkkksbsbSSk",
    "...kkSSSSSSSSSSSSSSkk",
    "...kHHHk........kHHHk",
    "...kcccck......kcccck",
    "...kkkkkk......kkkkkk",
]

COSTAS = [
    ".......kkkkkkkkkk",
    ".....kkLLLLLLLLLLkk",
    "....kLLsbsbsbsbsbsLk",
    "...kLsbsbsbsbsbsbsbsk",
    "..kLsbsbsbsbsbsbsbsbsk",
    "..ksbsbsbsbsbsbsbsbsbk",
    ".kssbsbsbsbsbsbsbsbsssk",
    ".ksbsbsbsbsbsbsbsbsbssk",
    ".ksbsbsbsbsbsbsbsbsbsSk",
    ".kSbsbsbsbsbsbsbsbsbsSk",
    ".kSbsbsbsbskkbsbsbsbsSk",
    ".kSbsbsbsbkSSkbsbsbsbSk",
    "..kSbsbsbkSbbSkbsbsbSk",
    "..kSSbsbskSbbSksbsbSSk",
    "...kkSSSSkSSSSkSSSSkk",
    "...kHHHk..kSSk..kHHHk",
    "...kcccck..kk..kcccck",
    "...kkkkkk......kkkkkk",
]

LADO = [
    ".........kkkkkkkkkk",
    ".......kkLLLLLLLLLLkk",
    "......kLLsbsbsbsbsbsLk",
    "..kk.kLsbsbsbsbsbsbsbsk",
    ".kHHkkLsbsbsbsbsbsbsbsbk",
    ".kHhhksbsbsbsbsbsbsbsbsSk",
    "khrkhhksbsbsbsbsbsbsbsbSk",
    "khkkhhksbsbsbsbsbsbsbsbSkk",
    "khhhhhhksbsbsbsbsbsbsbsSkSk",
    "kpphhhhkSbsbsbsbsbsbsbsSkSSk",
    ".kkhhhhkSbsbsbsbsbsbsbsSkkSSk",
    "...kkkkkSSSSSSSSSSSSSSSkk.kk",
    ".....kHHHk.........kHHHk",
    ".....kcccck.......kcccck",
    ".....kkkkkk.......kkkkkk",
]

PATAS_FRENTE = ((3, 10), (15, 22), 15)
PATAS_LADO = ((5, 11), (19, 25), 12)

if __name__ == "__main__":
    from comum import salvar
    salvar(1044, FRENTE, COSTAS, LADO, CORES, PATAS_FRENTE, PATAS_LADO, previa=os.environ.get("PREVIA"))
    print("TATURRÃO: andar feito")
