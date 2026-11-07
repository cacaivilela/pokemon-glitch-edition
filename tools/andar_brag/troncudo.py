"""O TRONCUDO ANDANDO, desenhado do zero (o CAIO, nov/2026: "faz do zero").
O TRONKY crescido: a copa maior cheia de FRUTINHAS quadradas amarelas, os
galhos pra CIMA segurando a copa, o tronco grosso com as rachaduras e a cara
no buraco. Mesmas letras do TRONKY."""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from tronky import CORES  # noqa: E402

FRENTE = [
    "...........kkkkkkkkk",
    "........kkkgggyggggkkk",
    "......kkgggggGGGggggggkk",
    ".....kgggykgGGGGGggyyggggk",
    "....kgggyygGGGGGGggyyggGggk",
    "...kggGGggggGGGgggggggGGGgk",
    "..kgGGGGGggyyggggGGGgggGGggk",
    "..kgGGGGGggyyggggGGGGggggyyk",
    ".kyggGGGgggggggggGGGgggggyyk",
    ".kyygggggGGGGgggggggggGGGgk",
    "..kgggyygGGGGGgyyggggGGGGgk",
    "..kggggyygGGGggyygggggGGgk",
    "...kbkgggggggggggggggggkbk",
    "...kbtkkggggGGGgggggkktbk",
    "....kbtkkkkkkkkkkkkkkktbk",
    ".....kbttktttrTtttktttbk",
    "......kbttttrthhhhhttbk",
    ".......ktttrhhyyhyyhhtk",
    ".......kttrthhyyhyyhhtk",
    ".......ktttthhhhhhhhttk",
    ".......kttrthrhhhhrhtrk",
    ".......ktrtthhrrrrhhttk",
    ".......kttrttthhhhtttrk",
    "......kTttrtttttttrtttk",
    "......kTTtttrtttttrttTTk",
    "......kTTTttrtttttrtTTTk",
    ".....kTTTTkkkkkkkkkkTTTTk",
    "....kTTTTk........kTTTTk",
    "...kTTbTTk........kTTbTTk",
    "...kkkkkkk........kkkkkkk",
]

COSTAS = [
    "...........kkkkkkkkk",
    "........kkkgggyggggkkk",
    "......kkgggggGGGggggggkk",
    ".....kgggykgGGGGGggyyggggk",
    "....kgggyygGGGGGGggyyggGggk",
    "...kggGGggggGGGgggggggGGGgk",
    "..kgGGGGGggyyggggGGGgggGGggk",
    "..kgGGGGGggyyggggGGGGggggyyk",
    ".kyggGGGgggggggggGGGgggggyyk",
    ".kyygggggGGGGgggggggggGGGgk",
    "..kgggyygGGGGGgyyggggGGGGgk",
    "..kggggyygGGGggyygggggGGgk",
    "...kbkgggggggggggggggggkbk",
    "...kbtkkggggGGGgggggkktbk",
    "....kbtkkkkkkkkkkkkkkktbk",
    ".....kbttktttrttttktttbk",
    "......kbttttrttttttttbk",
    ".......ktttrttttrtttttk",
    ".......kttrttttrttttttk",
    ".......ktttrtttrtttrttk",
    ".......kttrtttttrtttrtk",
    ".......ktrttttttrttttrk",
    ".......kttrtttttrttttrk",
    "......kTttrtttttttrtttk",
    "......kTTtttrtttttrttTTk",
    "......kTTTttrtttttrtTTTk",
    ".....kTTTTkkkkkkkkkkTTTTk",
    "....kTTTTk........kTTTTk",
    "...kTTbTTk........kTTbTTk",
    "...kkkkkkk........kkkkkkk",
]

LADO = [
    "..........kkkkkkkk",
    ".......kkkgggyggggkk",
    ".....kkgggggGGGgggggk",
    "....kgggykgGGGGGggyygk",
    "...kgggyygGGGGGGggyyggk",
    "..kggGGggggGGGggggggGGk",
    ".kgGGGGGggyyggggGGGggGk",
    ".kgGGGGGggyyggggGGGGggk",
    "kyggGGGgggggggggGGGggk",
    "kyygggggGGGGggggggGGk",
    ".kgggyygGGGGGgyygggGk",
    ".kggggyygGGGggyyggggk",
    "..kkggggggggggggggkk",
    "....kkkbkkkkkkkbkk",
    ".....kbtktttrTtktk",
    "......kbtttrthhhk",
    "......kttrthhyyhk",
    "......kttrthhyyhk",
    "......ktttthhhhhk",
    "......kttrthhrhhk",
    "......ktrttthhrrk",
    "......kttrttthhhk",
    "......kTttrtttrtk",
    "......kTTtttrtTTk",
    "......kTTTttrTTTk",
    ".....kTTTkkkkkTTk",
    "....kTTTk..kTTTk",
    "...kTTbTk.kTTbTk",
    "...kkkkkk.kkkkkk",
]

# (o CAIO: "o tronky e o troncudo tão espelhados pros lados" — a cara ficou do
# lado direito do tronco, então o desenho de lado é virado aqui pra olhar pra
# esquerda, e as patas de lado vão junto)
_LARG = max(len(l) for l in LADO)
LADO = [l.ljust(_LARG, ".")[::-1] for l in LADO]

PATAS_FRENTE = ((3, 11), (18, 26), 27)
PATAS_LADO = ((_LARG - 17, _LARG - 10), (_LARG - 10, _LARG - 3), 26)

if __name__ == "__main__":
    from comum import salvar
    salvar(1033, FRENTE, COSTAS, LADO, CORES, PATAS_FRENTE, PATAS_LADO, previa=os.environ.get("PREVIA"))
    print("TRONCUDO: andar feito")
