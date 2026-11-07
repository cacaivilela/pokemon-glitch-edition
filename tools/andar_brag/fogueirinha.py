"""A FOGUEIRINHA ANDANDO (pulando), desenhada do zero (o CAIO, nov/2026: "faz
do zero"). A fogueira de São João pequena: a CHAMA com a carinha (olhos e
sorriso), as lenhas cruzadas embaixo e as faíscas. O fogo tremula no pulo.
  k contorno   r vermelho   o laranja   y amarelo   Y amarelo claro
  t lenha   T lenha escura   L lenha clara   e olho   w brilho"""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

CORES = {
    "k": (24, 20, 32), "r": (226, 60, 32), "o": (250, 130, 36), "y": (255, 210, 60), "Y": (255, 246, 190),
    "t": (126, 80, 48), "T": (93, 59, 36), "L": (196, 150, 104), "e": (24, 20, 32), "w": (250, 250, 250),
}

FRENTE = [
    "........k",
    ".......krk.....k",
    ".......krrk...krk",
    "..k...krrok..krrk",
    ".krk..kroork.krok",
    ".kork.kroyorkkrook",
    ".kroorkroyyorkroyk",
    "..kroyyrroyYoyyork",
    "..kroyyYyyyYYyyork",
    "..kroykekyyykekyork",
    "..kroyyyyyyyyyyyork",
    "...kroyyykkkyyyork",
    "...kkroyyyyyyyyrkk",
    ".kkLLkkrooooorkkLLkk",
    "kLLttTkkkkkkkkkTttLLk",
    ".kkTTtttLLLLLtttTTkk",
    "...kkTTTttttttTTTkk",
    ".kkLLtkkkkkkkkkkLtLLk",
    "kLLttk........kttLLk",
    ".kkkk..........kkkk",
]

COSTAS = [
    "........k",
    ".......krk.....k",
    ".......krrk...krk",
    "..k...krrok..krrk",
    ".krk..kroork.krok",
    ".kork.kroyorkkrook",
    ".kroorkroyyorkroyk",
    "..kroyyrroyYoyyork",
    "..kroyyYyyyYYyyork",
    "..kroyyyyyyyyyyyork",
    "..kroyyyyyyyyyyyork",
    "...kroyyyyyyyyyork",
    "...kkroyyyyyyyyrkk",
    ".kkLLkkrooooorkkLLkk",
    "kLLttTkkkkkkkkkTttLLk",
    ".kkTTtttLLLLLtttTTkk",
    "...kkTTTttttttTTTkk",
    ".kkLLtkkkkkkkkkkLtLLk",
    "kLLttk........kttLLk",
    ".kkkk..........kkkk",
]

LADO = [
    ".......k",
    "......krk....k",
    "......krrk..krk",
    ".k...krrok.krrk",
    "krk..kroorkkrok",
    "kork.kroyorkrook",
    "kroorkroyyorroyk",
    ".kroyyrroyYoyyork",
    ".kroyyYyyyYYyyork",
    ".kroykekyyyyyyork",
    ".kroyyyyyyyyyyork",
    "..kroykkkyyyyork",
    "..kkroyyyyyyyrkk",
    ".kLLkkrooooorkkLk",
    "kLttTkkkkkkkkkTtLk",
    ".kTTtttLLLLLtttTk",
    "..kkTTTtttttTTTk",
    ".kLLtkkkkkkkkLtLk",
    "kLttk.......kttLk",
    ".kkk.........kkk",
]

if __name__ == "__main__":
    from comum import salvar
    salvar(1060, FRENTE, COSTAS, LADO, CORES, ((0, 0),) * 2, ((0, 0),) * 2, fogo=[("o", "y"), ("r", "o")], previa=os.environ.get("PREVIA"), pulo=True)
    print("FOGUEIRINHA: andar feito")
