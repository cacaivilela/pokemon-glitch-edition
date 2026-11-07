"""O BEBBIDÃO ANDANDO (pulando), desenhado do zero (o CAIO, nov/2026: "faz do
zero"). A jarra de vidro grande: o bico, a alça de vidro, a BEBIDA azul
dentro com o OLHO e o sorriso, e o reflexo. Letras do BEBBIDAH mais: e olho,
p a língua."""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from bebbidah import CORES as BASE  # noqa: E402

CORES = {**BASE, "e": (40, 20, 40), "p": (226, 98, 120)}

FRENTE = [
    "..kkkkkkkkkkkk",
    ".kWkwwwwwwwwwkk",
    "..kWwwwwwwwwwkkkk",
    ".kWwwwwwwwwwwwkrk",
    ".kBBBBBBBBBBBBk.k",
    "kbbbbbkkkbbbbbbk.k",
    "kbbbbkwwwkbbbbbk.k",
    "kbbbbkwekkbbbbbkkk",
    "kbbbbbkkkbbbbbbk",
    "kbbrbbbbbbbbbbbk",
    "kbbrbkkkkkkbbbbk",
    ".kbrbbkppkbbbbk",
    "..kbbbbbbbbbbk",
    "...kkkkkkkkkk",
]

COSTAS = [
    "..kkkkkkkkkkkk",
    "kkWwwwwwwwwwkWk",
    "kkkWwwwwwwwwwk",
    "krkwwwwwwwwwwWk",
    "k.kBBBBBBBBBBBBk",
    "k.kbbbbbbbbbbbbbk",
    "k.kbbbbbbbbbbbbbk",
    "kkkbbbbbbbbbbbbbk",
    "..kbbbbbbbbbbbbbk",
    "..kbbbbbbbbbbbrbk",
    "..kbbbbbbbbbbbrbk",
    "...kbbbbbbbbbrbk",
    "....kbbbbbbbbbk",
    ".....kkkkkkkkk",
]

LADO = [
    "..kkkkkkkkkk",
    "kkWwwwwwwwwwk",
    ".kWwwwwwwwwwkkk",
    ".kwwwwwwwwwwkrk",
    ".kBBBBBBBBBBk.k",
    "kbbbkkkbbbbbbk.k",
    "kbbkwwwkbbbbbk.k",
    "kbbkwekkbbbbbkkk",
    "kbbbkkkbbbbbbk",
    "kbbbbbbbbbbbbk",
    "kkkkkbbbbbbbbk",
    "kppkbbbbbbbbk",
    ".kbbbbbbbbbk",
    "..kkkkkkkkk",
]

if __name__ == "__main__":
    from comum import salvar
    salvar(1111, FRENTE, COSTAS, LADO, CORES, ((0, 0),) * 2, ((0, 0),) * 2, fogo=[("B", "b")], previa=os.environ.get("PREVIA"), pulo=True)
    print("BEBBIDÃO: andar feito")
