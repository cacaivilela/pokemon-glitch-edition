"""O BANGVEET ANDANDO (pulando), desenhado do zero (o CAIO, nov/2026: "faz do
zero"). O bem-te-vi grande e barulhento: o mesmo desenho do BANTEVY, maior,
com o MEGAFONE na asa (o grito dele vai longe). Letras do BANTEVY mais:
g/G o megafone."""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from bantevy import CORES as BASE  # noqa: E402

CORES = {**BASE, "y": (252, 206, 30), "G": (182, 182, 187), "s": (111, 111, 117), "p": (150, 150, 158)}

FRENTE = [
    ".....kkkkkkk",
    "....knnnnnnnk",
    "...kwwwwwwwwwk",
    "...knkeknnkekk",
    "...knnnkkknnnk",
    "...kwwwwknkwwwk",
    "..kmkwwwwwwwwkmk",
    ".kmmkyYYYYYYykmmk",
    ".kmmkyYYYYYYykmmkkkk",
    ".kMmkyyYYYYyykmkGGGGk",
    ".kMMkyyyyyyyykkGsssGk",
    "..kkkyyyyyyyykkGsssGk",
    "....kkyyyyyykk.kGGGGk",
    ".....kgkkkkgk...kkkk",
    "....kgk....kgk",
    "....kk......kk",
]

COSTAS = [
    ".....kkkkkkk",
    "....knnnnnnnk",
    "...kwwwwwwwwwk",
    "...knnnnnnnnnk",
    "...knnnnnnnnnk",
    "...kmmmmmmmmmk",
    "..kmmmmmmmmmmmk",
    ".kmmmMmmmmmMmmmk",
    "kkkkMmmmmmmmmMmmk",
    "kGGGGkmmmmmmmMMmk",
    "kGsssGkmmmmmmMMMk",
    "kGsssGkmmmmmmmMk",
    "kGGGGkkkMmmmMkk",
    ".kkkk.kgkkkkgk",
    "....kgk....kgk",
    "....kk......kk",
]

LADO = [
    ".....kkkkkk",
    "....knnnnnnk",
    "...kwwwwwwwwk",
    "kkkknkennnnnk",
    "knnnnkknnnnnk",
    ".kkkkwwwnnnnk",
    "....kYYwmmmmmk",
    "....kyYYmmmmmMk",
    "...kkkkYYmmmmMMk",
    "..kGGGGkYmmmMMMMk",
    "..kGsssGkymMMMMkkk",
    "..kGsssGkyyMMkk",
    "...kGGGGkyykk",
    "....kkkkgkgk",
    "......kgk.kgk",
    "......kk...kk",
]

if __name__ == "__main__":
    from comum import salvar
    salvar(1080, FRENTE, COSTAS, LADO, CORES, ((0, 0),) * 2, ((0, 0),) * 2, previa=os.environ.get("PREVIA"), pulo=True)
    print("BANGVEET: andar feito")
