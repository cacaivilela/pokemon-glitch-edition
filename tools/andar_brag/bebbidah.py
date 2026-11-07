"""O BEBBIDAH ANDANDO (pulando), desenhado do zero (o CAIO, nov/2026: "faz do
zero"; o desenho de batalha é a caneca dele). A caneca de vidro: o vidro
clarinho, a BEBIDA azul dentro (ela balança no pulo), o reflexo e a alça.
  k contorno   w vidro   W vidro claro   b bebida   B bebida clara
  r reflexo"""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

CORES = {
    "k": (8, 8, 8), "w": (236, 244, 250), "W": (250, 252, 255), "b": (86, 139, 220), "B": (140, 184, 240),
    "r": (196, 214, 228),
}

FRENTE = [
    "...kkkkkkkkk",
    "...kWwwwwwwk",
    "...kWwwwwwwkkk",
    "...kWwwwwwwk.k",
    "...kBBBBBBBk.k",
    "...kbbbbbbbk.k",
    "...kbbrbbbbk.k",
    "...kbbrbbbbkkk",
    "...kbbrbbbbk",
    "...kbbbbbbbk",
    "...kkkkkkkkk",
]

COSTAS = [
    "...kkkkkkkkk",
    "...kWwwwwwwk",
    ".kkkWwwwwwwk",
    ".k.kWwwwwwwk",
    ".k.kBBBBBBBk",
    ".k.kbbbbbbbk",
    ".k.kbbbbbrbk",
    ".kkkbbbbbrbk",
    "...kbbbbbrbk",
    "...kbbbbbbbk",
    "...kkkkkkkkk",
]

LADO = [
    "...kkkkkkkkk",
    "...kWwwwwwwk",
    "...kWwwwwwwk",
    "...kWwwwwwwk",
    "...kBBBBBBBk",
    "...kbbbbbbbk",
    "...kbbrbbbbk",
    "...kbbrbbbbk",
    "...kbbrbbbbk",
    "...kbbbbbbbk",
    "...kkkkkkkkk",
]

if __name__ == "__main__":
    from comum import salvar
    salvar(1110, FRENTE, COSTAS, LADO, CORES, ((0, 0),) * 2, ((0, 0),) * 2, fogo=[("B", "b")], previa=os.environ.get("PREVIA"), pulo=True)
    print("BEBBIDAH: andar feito")
