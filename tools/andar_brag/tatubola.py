"""O TATUBOLA ANDANDO, desenhado do zero (o CAIO, nov/2026: "faz do zero").
O tatuzinho bege: a casca em arco com as LISTRAS, a cabecinha de focinho
comprido com as orelhas, o rabinho e as patinhas.
  k contorno   s casca   S casca escura   L casca clara   b a listra
  h cabeça   H cabeça escura (orelha, pata)   p focinho rosado   e olho"""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

CORES = {
    "k": (24, 20, 32), "s": (196, 176, 136), "S": (140, 120, 90), "L": (214, 200, 172), "b": (145, 130, 101),
    "h": (188, 165, 146), "H": (118, 93, 74), "p": (220, 190, 170), "e": (24, 20, 32), "w": (250, 250, 250),
}

FRENTE = [
    "......kkkkkkkk",
    "....kkLLLLLLLLkk",
    "...kLLsbsbsbsbsLk",
    "..kLsbsbsbsbsbsbsk",
    "..ksbsbsbsbsbsbsbk",
    ".kssbskHkkkkHksbssk",
    ".ksbskHhhhhhhHksbsk",
    ".ksbskhhehhehhksbSk",
    ".kSbskhhhhhhhhksbSk",
    ".kSbsskhhpphhkssbSk",
    "..kSbsskhhhhkssbSk",
    "..kSSbsskkkkssbSSk",
    "...kkSSSSSSSSSSkk",
    "....kHHk....kHHk",
    "....kkkk....kkkk",
]

COSTAS = [
    "......kkkkkkkk",
    "....kkLLLLLLLLkk",
    "...kLLsbsbsbsbsLk",
    "..kLsbsbsbsbsbsbsk",
    "..ksbsbsbsbsbsbsbk",
    ".kssbsbsbsbsbsbsssk",
    ".ksbsbsbsbsbsbsbssk",
    ".ksbsbsbsbsbsbsbsSk",
    ".kSbsbsbsbsbsbsbsSk",
    ".kSbsbsbskkbsbsbsSk",
    "..kSbsbskHHkbsbsSk",
    "..kSSbsbkHHkbsbSSk",
    "...kkSSSkHkSSSSkk",
    "....kHHk.k..kHHk",
    "....kkkk....kkkk",
]

LADO = [
    "........kkkkkkkk",
    "......kkLLLLLLLLkk",
    ".....kLLsbsbsbsbsLk",
    "..kk.kLsbsbsbsbsbsbk",
    ".kHHkksbsbsbsbsbsbsk",
    ".kHhhksbsbsbsbsbsbsSk",
    "khehhhksbsbsbsbsbsbSk",
    "khhhhhksbsbsbsbsbsbSkkk",
    "kpphhhksbsbsbsbsbsbSkHHk",
    ".kkhhhkSbsbsbsbsbsbSk.kk",
    "...kkkkSSSSSSSSSSSSkk",
    ".....kHHk......kHHk",
    ".....kkkk......kkkk",
]

PATAS_FRENTE = ((3, 9), (11, 17), 13)
PATAS_LADO = ((4, 10), (14, 20), 11)

if __name__ == "__main__":
    from comum import salvar
    salvar(1043, FRENTE, COSTAS, LADO, CORES, PATAS_FRENTE, PATAS_LADO, previa=os.environ.get("PREVIA"))
    print("TATUBOLA: andar feito")
