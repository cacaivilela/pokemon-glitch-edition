"""O FOGUEIRÃO ANDANDO (pulando), desenhado do zero (o CAIO, nov/2026: "faz do
zero"). A fogueira grande da festa junina: a chamona com a cara brava-alegre,
o varal de BANDEIRINHAS coloridas atravessado e a pilha de lenha. Letras da
FOGUEIRINHA mais: g verde, b azul, p rosa, R vermelho (as bandeirinhas)."""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from fogueirinha import CORES as BASE  # noqa: E402

CORES = {**BASE, "g": (60, 170, 80), "b": (44, 104, 214), "p": (240, 120, 170), "R": (200, 40, 40), "s": (200, 196, 180)}

FRENTE = [
    "...........k",
    "..........krk......k",
    ".....k....krrk....krk",
    "....krk..krrok...krrk",
    "...kroork.kroork.krook",
    "..kroyyorkroyyorkkroyk",
    "..kroyyyorroyYorkroyyk",
    ".kroyyYYyyyyYYyyyyyyork",
    ".kroyyYYYyyyYYYyyyyyork",
    ".kroyykkkyyyyykkkyyyork",
    ".kroyykekyyyyykekyyyork",
    ".kroyyyyyyyyyyyyyyyyork",
    "kssroyyyyykkkkkyyyyorssk",
    ".kgkbkRkykpkgkbkRkykpk",
    "..kgkbkRkykpkgkbkRkyk",
    "...k.kroooooooooork",
    "..kkLLkkkkkkkkkkkkLLkk",
    ".kLLtttTkkkkkkkkTtttLLk",
    "kLttTTttttLLLLLttttTTttk",
    ".kkTTTtttttttttttttTTTkk",
    "..kkLLtkkkkkkkkkkkkLtLLk",
    ".kLLttk............kttLLk",
    "..kkkk..............kkkk",
]

COSTAS = [
    "...........k",
    "..........krk......k",
    ".....k....krrk....krk",
    "....krk..krrok...krrk",
    "...kroork.kroork.krook",
    "..kroyyorkroyyorkkroyk",
    "..kroyyyorroyYorkroyyk",
    ".kroyyYYyyyyYYyyyyyyork",
    ".kroyyYYYyyyYYYyyyyyork",
    ".kroyyyyyyyyyyyyyyyyork",
    ".kroyyyyyyyyyyyyyyyyork",
    ".kroyyyyyyyyyyyyyyyyork",
    "kssroyyyyyyyyyyyyyyorssk",
    ".kgkbkRkykpkgkbkRkykpk",
    "..kgkbkRkykpkgkbkRkyk",
    "...k.kroooooooooork",
    "..kkLLkkkkkkkkkkkkLLkk",
    ".kLLtttTkkkkkkkkTtttLLk",
    "kLttTTttttLLLLLttttTTttk",
    ".kkTTTtttttttttttttTTTkk",
    "..kkLLtkkkkkkkkkkkkLtLLk",
    ".kLLttk............kttLLk",
    "..kkkk..............kkkk",
]

LADO = [
    "..........k",
    ".........krk.....k",
    "....k....krrk...krk",
    "...krk..krrok..krrk",
    "..kroork.kroorkkrook",
    ".kroyyorkroyyorkroyk",
    ".kroyyyorroyYorroyyk",
    "kroyyYYyyyyYYyyyyyork",
    "kroyyYYYyyyYYYyyyyork",
    "kroykkkyyyyyyyyyyyork",
    "kroykekyyyyyyyyyyyork",
    "kroyyyyyyyyyyyyyyyork",
    "ksroyykkkkyyyyyyyorsk",
    ".kgkbkRkykpkgkbkRkyk",
    "..kgkbkRkykpkgkbkRk",
    "...kroooooooooooork",
    "..kLLkkkkkkkkkkkkLLk",
    ".kLttTkkkkkkkkkkTttLk",
    "kLtTTttttLLLLLtttTTtk",
    ".kTTTtttttttttttTTTk",
    "..kLLtkkkkkkkkkkLtLk",
    ".kLttk..........kttLk",
    "..kkk............kkk",
]

if __name__ == "__main__":
    from comum import salvar
    salvar(1061, FRENTE, COSTAS, LADO, CORES, ((0, 0),) * 2, ((0, 0),) * 2, fogo=[("o", "y"), ("r", "o")], previa=os.environ.get("PREVIA"), pulo=True)
    print("FOGUEIRÃO: andar feito")
