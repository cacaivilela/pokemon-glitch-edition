"""O AMAZONIUM ANDANDO (pulando nas raízes), desenhado do zero (o CAIO,
nov/2026: "faz do zero"). A árvore gigante da Amazônia: a copa enorme com as
FLORES rosa, os CIPÓS pendurados dos lados, o tronco largo com a cara de olho
fechado e as raízes dentro da água azul.
  k contorno   g folha   G folha escura   l folha clara   r flor rosa
  t tronco   T tronco escuro   L tronco claro   v cipó   a água   e olho"""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

CORES = {
    "k": (16, 34, 22), "g": (40, 124, 60), "G": (22, 78, 48), "l": (78, 168, 70), "r": (244, 110, 180),
    "t": (138, 108, 80), "T": (90, 66, 50), "L": (173, 152, 132), "v": (64, 116, 48), "a": (50, 140, 226),
    "A": (140, 200, 250), "e": (16, 34, 22),
}

FRENTE = [
    "......kkkkkkkkkk",
    "....kkllgglggrlgkk",
    "...kllgrgggllggggGk",
    "..klggggrgggggrgggGk",
    ".klgrgggggglggggggGGk",
    ".kgggggrggggggrgggGGk",
    "kgGggggggrgggggggrgGGk",
    "kgGGggrggggggggggGGGGk",
    "kvkGGGGGGGGGGGGGGGGkvk",
    "kvk.kkkkLLttttkkkk.kvk",
    "kvk....kLtttttTk...kvk",
    ".v.....kLkkttkkTk...v",
    ".v.....kLttttttTk...v",
    ".......kLttkkttTk",
    ".......kLtttttTTk",
    "......kLLttttttTTk",
    "....kkTtkkttkkttTTkk",
    "..kAaaTkaaTTaakTaaaAk",
    "..kkAaaaaaaaaaaaaaAkk",
    "....kkkkkkkkkkkkkkk",
]

COSTAS = [
    "......kkkkkkkkkk",
    "....kkllgglggrlgkk",
    "...kllgrgggllggggGk",
    "..klggggrgggggrgggGk",
    ".klgrgggggglggggggGGk",
    ".kgggggrggggggrgggGGk",
    "kgGggggggrgggggggrgGGk",
    "kgGGggrggggggggggGGGGk",
    "kvkGGGGGGGGGGGGGGGGkvk",
    "kvk.kkkkLLttttkkkk.kvk",
    "kvk....kLtttttTk...kvk",
    ".v.....kLtTttttTk...v",
    ".v.....kLttTtttTk...v",
    ".......kLtttTttTk",
    ".......kLttTtttTk",
    "......kLLttttttTTk",
    "....kkTtkkttkkttTTkk",
    "..kAaaTkaaTTaakTaaaAk",
    "..kkAaaaaaaaaaaaaaAkk",
    "....kkkkkkkkkkkkkkk",
]

LADO = [
    ".....kkkkkkkkk",
    "...kkllgglggrlkk",
    "..kllgrgggllgggGk",
    ".klggggrgggggrggGk",
    "klgrgggggglggggGGk",
    "kgggggrggggggrgGGk",
    "kgGggggggrggggggGGk",
    "kgGGggrgggggggggGGk",
    "kvkGGGGGGGGGGGGGGkvk",
    "kvk..kkkLLtttkkk.kvk",
    "kvk....kLkttTk...kvk",
    ".v.....kLtttTk....v",
    ".v.....kLtttTk....v",
    ".......kLttTTk",
    ".......kLttTTk",
    "......kLLtttTTk",
    "....kkTtkkttkTTkk",
    "..kAaaTkaaTTaakTaAk",
    "..kkAaaaaaaaaaaaAkk",
    "....kkkkkkkkkkkkk",
]

if __name__ == "__main__":
    from comum import salvar
    salvar(1089, FRENTE, COSTAS, LADO, CORES, ((0, 0),) * 2, ((0, 0),) * 2, fogo=[("a", "A")], previa=os.environ.get("PREVIA"), pulo=True)
    print("AMAZONIUM: andar feito")
