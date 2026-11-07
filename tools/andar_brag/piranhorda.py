"""A PIRANHORDA ANDANDO (pulando), desenhada do zero (o CAIO, nov/2026: "faz do
zero"). A piranha grandona com o bocão de dentes, a cicatriz nas costas, e as
PIRANHAZINHAS da horda nadando em volta dela. Mesmas letras da PIRANHITA."""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from piranhita import CORES  # noqa: E402

FRENTE = [
    "kk..........kk...........kk",
    "kSrk.......kSSk.........kSrk",
    ".kk......kkSssSkk........kk",
    "........kssssssssk",
    "......kkLLssssssLLkk",
    ".....kLLykkssssskkyLLk",
    "....kLsyykkssssskkyysLk",
    "....kssssssssssssssssssk",
    "...kSkwkwkwkwkwkwkwkwkSk",
    "...kSmmmmmmmmmmmmmmmmmSk",
    "...kSmmmmmmmmmmmmmmmmmSk",
    "...kSmmmmmmmmmmmmmmmmmSk",
    "...kRkwkwkwkwkwkwkwkwkRk",
    "...kRrrrrrrrrrrrrrrrrrRk",
    "....kRrrrrrrrrrrrrrrrRk",
    "kk...kkRRrrrrrrrrrRRkk...kk",
    "kSrk...kkkkkkkkkkkkk....kSrk",
    ".kk......................kk",
]

COSTAS = [
    "kk..........kk...........kk",
    "kSrk.......kSSk.........kSrk",
    ".kk......kkSssSkk........kk",
    "........kssssssssk",
    "......kkLLssLLssLLkk",
    ".....kLLssssLsssssLLk",
    "....kLsssssssLssssssLk",
    "....kssssssssssLsssssssk",
    "...kSsssssssssssssssssSk",
    "...kSssssssssssssssssssk",
    "...kSsssssssssssssssssSk",
    "...kSsssssSSkkSSssssssSk",
    "...kRrrrrrkSSSSkrrrrrrRk",
    "...kRrrrrkSSSSSSkrrrrrRk",
    "....kRrrkSSSSSSSSkrrrRk",
    "kk...kkSSSkkkkkkSSSkk...kk",
    "kSrk...kkk......kkk.....kSrk",
    ".kk......................kk",
]

LADO = [
    ".kk..............kk",
    "kSrk............kSSk.........kk",
    ".kk...........kkSsssk.......kSrk",
    "...........kkkssssssk........kk",
    ".........kkLLsssLsssskk",
    ".......kkLLssssssLsssssk.kk",
    ".....kkLssssssssssLsssskSSk",
    "....kLkkyssssssssssssssSssk",
    "...kLkkyykssssssssssssSSSsk",
    "..kwkwkwkwksssssSsssssSSsk",
    "..kmmmmmmmmksssSsssssSSSk",
    "..kmmmmmmmmkrrrrrrrrrrSSSk",
    "..kwkwkwkwkrrrrrrrrrrrRSssk",
    "...kRrrrrrrrrrrrrrrrrRRkSSk",
    "....kkRRrrrrrrrrrrrRRkk.kk",
    "kk....kkkkRRRRRRkkkk",
    "kSrk......kkkkkk",
    ".kk",
]

if __name__ == "__main__":
    from comum import salvar
    salvar(1052, FRENTE, COSTAS, LADO, CORES, ((0, 0),) * 2, ((0, 0),) * 2, previa=os.environ.get("PREVIA"), pulo=True)
    print("PIRANHORDA: andar feito")
