"""O GHOTOLT ANDANDO (pulando), desenhado do zero (o CAIO, nov/2026: "faz do
zero"; o desenho de batalha é dele). O toco de pedra assombrado: o tronco
cinza de pedra com a RACHADURA escura no meio, a cruzinha riscada e o
CADEADO roxo flutuando do lado.
  k contorno   g pedra   G pedra clara   d pedra escura   n rachadura
  p cadeado   P cadeado claro   y fechadura"""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

CORES = {
    "k": (8, 8, 8), "g": (92, 94, 102), "G": (124, 126, 134), "d": (64, 66, 74), "n": (19, 19, 22),
    "p": (73, 14, 78), "P": (140, 60, 150), "y": (227, 195, 53), "e": (250, 250, 250),
}

FRENTE = [
    "...k.kk..k.k",
    "..kGkGgk.kGk",
    "..kGggggkkgk",
    "..kGgggggggk.kkk",
    "..kGgggnggdk.kPk",
    "..kGggnnggdkkpppk",
    "..kGgnnngddkkpypk",
    "..kGgnnnggdk.kkk",
    "..kGgnnnggdk",
    "..kGggnnggdk",
    ".kGGgggnggddk",
    "kGgggggggggddk",
    "kddkkddkkddkdk",
    ".kk..kk..kk.kk",
]

COSTAS = [
    "...k.kk..k.k",
    "..kGkGgk.kGk",
    "..kGggggkkgk",
    "kkkGgggggggk",
    "kPkGggggggdk",
    "pppkgggdggdk",
    "pypkggdgggdk",
    "kkkkGgggggdk",
    "..kGggggdgdk",
    "..kGgdggggdk",
    ".kGGgggggdddk",
    "kGgggggggggddk",
    "kddkkddkkddkdk",
    ".kk..kk..kk.kk",
]

LADO = [
    "...k.kk..k",
    "..kGkGgk.k",
    "..kGgggggk",
    "..kGgggggk...kkk",
    "..kGngggdk...kPk",
    "..kGnnggdk..kpppk",
    "..kGnnggdk..kpypk",
    "..kGnnggdk...kkk",
    "..kGnnggdk",
    "..kGngggdk",
    ".kGGgggggddk",
    "kGgggggggggdk",
    "kddkkddkkddk",
    ".kk..kk..kk",
]

if __name__ == "__main__":
    from comum import salvar
    salvar(1103, FRENTE, COSTAS, LADO, CORES, ((0, 0),) * 2, ((0, 0),) * 2, fogo=[("y", "P")], previa=os.environ.get("PREVIA"), pulo=True)
    print("GHOTOLT: andar feito")
