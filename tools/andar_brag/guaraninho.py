"""O GUARANINHO ANDANDO (pulando), desenhado do zero (o CAIO, nov/2026: "faz do
zero"). O guaraná: a frutinha vermelha redonda que abriu e mostra o OLHO (a
polpa branca com a semente preta no meio), as duas folhinhas em cima.
  k contorno   r vermelho   R vermelho claro   d vermelho escuro
  w a polpa branca   n a semente   L folha clara   l folha   G folha escura"""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

CORES = {
    "k": (24, 20, 32), "r": (206, 44, 40), "R": (221, 107, 104), "d": (140, 24, 30),
    "w": (248, 244, 236), "n": (26, 20, 24), "L": (137, 191, 127), "l": (64, 121, 53), "G": (46, 110, 50),
    "B": (250, 250, 250),
}

FRENTE = [
    "..kk.......kk",
    ".kLLkk...kkLLk",
    ".kLlllkkkllllk",
    "..kklllGkGllkk",
    "....kkkGkGkk",
    "....kkrrkrrkk",
    "..kkrRRrrrrrrkk",
    ".krRRrrrrrrrrrrk",
    ".kRRrkkkkkkkrrrk",
    "krRrkwwwwwwwkrrrk",
    "krrkwwwkkkwwwkrrk",
    "krrkwwknBnkwwkrrk",
    "krrkwwknnnkwwkrdk",
    "krrkwwwkkkwwwkrdk",
    ".krrkwwwwwwwkrrdk",
    ".krrrkkkkkkkrrddk",
    "..krrrrrrrrrrddk",
    "...kkdrrrrrddkk",
    ".....kkkkkkkk",
]

COSTAS = [
    "..kk.......kk",
    ".kLLkk...kkLLk",
    ".kLlllkkkllllk",
    "..kklllGkGllkk",
    "....kkkGkGkk",
    "....kkrrkrrkk",
    "..kkrRRrrrrrrkk",
    ".krRRrrrrrrrrrrk",
    ".kRRrrrrrrrrrrrk",
    "krRrrrrrrrrrrrrrk",
    "krrrrrrrrrrrrrrrk",
    "krrrrrrrrrrrrrrrk",
    "krrrrrrrrrrrrrrdk",
    "krrrrrrrrrrrrrrdk",
    ".krrrrrrrrrrrrrdk",
    ".krrrrrrrrrrrrddk",
    "..krrrrrrrrrrddk",
    "...kkdrrrrrddkk",
    ".....kkkkkkkk",
]

LADO = [
    "....kk.....kk",
    "...kLLkk.kkLLk",
    "...kLlllkllllk",
    "....kklllGllkk",
    "......kkGkkk",
    "......kkrrrkk",
    "....kkrRRrrrrkk",
    "...krRRrrrrrrrrk",
    "..kkkkkRrrrrrrrk",
    ".kwwwwkRrrrrrrrrk",
    "kwwkkkwkrrrrrrrrk",
    "kwknBnkkrrrrrrrrk",
    "kwknnnkkrrrrrrrdk",
    "kwwkkkwkrrrrrrrdk",
    ".kwwwwkrrrrrrrrdk",
    "..kkkkrrrrrrrrddk",
    "...krrrrrrrrrddk",
    "....kkdrrrrrddkk",
    "......kkkkkkkk",
]

if __name__ == "__main__":
    from comum import salvar
    salvar(1049, FRENTE, COSTAS, LADO, CORES, ((0, 0),) * 2, ((0, 0),) * 2, previa=os.environ.get("PREVIA"), pulo=True)
    print("GUARANINHO: andar feito")
