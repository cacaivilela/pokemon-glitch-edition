"""O PIRARUCU ANDANDO (pulando: peixão fora d'água), desenhado do zero (o
CAIO, nov/2026: "faz do zero"). O peixão da Amazônia: a cabeça verde-cinza
achatada com o olho amarelo, a boca larga, e o corpo que vai ficando
VERMELHO de escama pro rabo (a escama em losango).
  k contorno   v verde   V verde claro   d verde escuro   r vermelho
  R vermelho escuro   L vermelho claro   m boca   y olho   n pupila"""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

CORES = {
    "k": (24, 20, 32), "v": (104, 124, 106), "V": (149, 163, 151), "d": (68, 84, 72),
    "r": (196, 52, 44), "R": (145, 38, 33), "L": (214, 113, 107), "m": (96, 20, 30),
    "y": (230, 200, 70), "n": (24, 20, 32),
}

FRENTE = [
    ".....kkkkkkkk",
    "...kkVVVVVVVVkk",
    "..kVVvvvvvvvvVVk",
    ".kVvkyykvvkyykvVk",
    ".kvvkynkvvkynkvvk",
    ".kvvvkkvvvvkkvvvk",
    ".kvvvvvvvvvvvvvvk",
    ".kdkkkkkkkkkkkkdk",
    ".kdmmmmmmmmmmmmdk",
    "..kdkkkkkkkkkkdk",
    "..kdvvvvvvvvvvdk",
    "...kdrLrrLrrLrk",
    "...krRrrRrrRrrk",
    "....kkrrrrrrkk",
    "......kkkkkk",
]

COSTAS = [
    ".......kkk",
    "......krrrk",
    ".....krLrRrk",
    "....krrrrrrrk",
    "...kkRrLrRrLkk",
    "..kVVrrrrrrrrVk",
    ".kVvvkrrRrrkvvVk",
    ".kvvvvkrrrkvvvvk",
    ".kvvvvvkkkvvvvvk",
    ".kvvvvvvvvvvvvvk",
    ".kdvvvvvvvvvvvdk",
    "..kdvvvvvvvvvdk",
    "...kdddddddddk",
    "....kkkkkkkkk",
]

LADO = [
    ".....kkkkkkkk...........kk",
    "...kkVVVVVVVVkkkkkkkkkkkrrk",
    "..kVVvvvvvvvvvvvvkrLrLrRrrrk",
    ".kVvkyykvvvvvvvvkrrRrrRrLrrk",
    "kVvvkynkvvvvvvvkrLrrLrrRrrrRk",
    "kvvvvkkvvvvvvvvkrrRrrLrrrrRRk",
    "kmmmkvvvvvvvvvvkRrrLrrRrrRRk",
    "kkkkkvvvvvvvvvvkrLrrRrrrRRk",
    ".kdvvvvvvvvvvvvkrrRrrrrRRkrk",
    "..kddvvvvvvvvvkkRRRRRRRRkkrrk",
    "...kkddddddddkk.kkkkkkkk.kkk",
    ".....kkkkkkkk",
]

if __name__ == "__main__":
    from comum import salvar
    salvar(1057, FRENTE, COSTAS, LADO, CORES, ((0, 0),) * 2, ((0, 0),) * 2, previa=os.environ.get("PREVIA"), pulo=True)
    print("PIRARUCU: andar feito")
