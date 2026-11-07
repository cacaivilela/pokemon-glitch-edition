"""A PIRANHITA ANDANDO (pulando: peixe fora d'água), desenhada do zero (o CAIO,
nov/2026: "faz do zero"). A piranha: o corpo cinza com a BARRIGA vermelha, o
bocão com os DENTES de serra, o olho amarelo bravo e as nadadeiras.
  k contorno   s cinza   S cinza escuro   L cinza claro   r vermelho
  R vermelho escuro   m a boca por dentro   w dente   y olho"""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

CORES = {
    "k": (24, 20, 32), "s": (150, 160, 176), "S": (98, 106, 124), "L": (182, 188, 200), "D": (73, 78, 92),
    "r": (214, 54, 50), "R": (158, 40, 37), "m": (96, 20, 30), "w": (246, 244, 232), "y": (250, 214, 60),
}

FRENTE = [
    ".........kk",
    "........kSSk",
    ".......kSssSk",
    ".....kksssssskk",
    "....kLLsssssssLk",
    "...kLykkssssskkyLk",
    "...ksykkssssskkysk",
    "...kssssssssssssssk",
    "..kSkwkwkwkwkwkwkSk",
    "..kSmmmmmmmmmmmmmSk",
    "..kSmmmmmmmmmmmmmSk",
    "..kRkwkwkwkwkwkwkRk",
    "..kRrrrrrrrrrrrrrRk",
    "...kRrrrrrrrrrrrRk",
    "....kkRRrrrrRRkk",
    "......kkkkkkkk",
]

COSTAS = [
    ".........kk",
    "........kSSk",
    ".......kSssSk",
    ".....kksssssskk",
    "....kLLsssssssLk",
    "...kLsssssssssssLk",
    "...ksssssssssssssk",
    "...kssssssssssssssk",
    "..kSssssssssssssssk",
    "..kSssssssssssssSk",
    "..kSssssSkkSsssssk",
    "..kRrrrrkSSkrrrrrRk",
    "..kRrrrkSSSSkrrrrRk",
    "...kRrkSSSSSSkrRk",
    "....kkSSkkkkSSkk",
    "......kk....kk",
]

LADO = [
    "............kk",
    "...........kSSk",
    "..........kSsssk",
    ".......kkkssssssk",
    ".....kkLLsssssssskk",
    "...kkLLssssssssssssk.kk",
    "..kLkkysssssssssssssskSSk",
    ".kLkkykssssssssssssssSssk",
    "kwkwkwksssssSsssssssSSsk",
    "kmmmmmmksssSsssssssSSk",
    "kmmmmmmkrrrrrrrrrrrSSSk",
    "kwkwkwkrrrrrrrrrrrrRSssk",
    ".kRrrrrrrrrrrrrrrrRRkSSk",
    "..kkRRrrrrrrrrrrRRkk.kk",
    "....kkkkRRRRRkkkk",
    "........kkkkk",
]

if __name__ == "__main__":
    from comum import salvar
    salvar(1051, FRENTE, COSTAS, LADO, CORES, ((0, 0),) * 2, ((0, 0),) * 2, previa=os.environ.get("PREVIA"), pulo=True)
    print("PIRANHITA: andar feito")
