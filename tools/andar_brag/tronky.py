"""O TRONKY ANDANDO, desenhado do zero (o CAIO, nov/2026: "faz do zero").
A arvorezinha: a copa redonda com as manchas escuras e as florzinhas amarelas
na beira, os galhos abertos como braços, o tronco com as rachaduras vermelhas,
a cara no buraco do tronco (olhos amarelos, sorriso vermelho) e as raízes de pé.
  k contorno   g folha   G folha escura   l folha clara   t tronco   T tronco
  escuro   b casca clara   r rachadura   y amarelo   h o buraco"""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

CORES = {
    "k": (24, 20, 32), "g": (40, 92, 58), "G": (22, 58, 40), "l": (104, 141, 117),
    "t": (78, 56, 48), "T": (52, 36, 34), "b": (131, 116, 110), "r": (196, 40, 44),
    "y": (252, 214, 48), "h": (38, 27, 25),
}

FRENTE = [
    "........kkkkkkkkk",
    "......kkgggllgggkk",
    "....kkggglllggggggkk",
    "...kgggGGGggggGGGgggk",
    "..ykgggGGGGgllGGGGggky",
    "..kgllggGGggllgGGgglgk",
    ".kggllgggggGGGgggggllgk",
    ".kgggggGGGgGGGgGGGgggggk",
    "ykgGGgGGGGgGyGgGGGGgGGgky",
    ".kgGGGgGGGggGgggGGGgGGgk",
    "..kgGGgggggggggggggGGgk",
    "...kkgggGGGggggGGGggkk",
    "....kkkkkkttttkkkkkk",
    ".kk.....kttrTttk.....kk",
    "kbtkk..ktttrhhhhtk..kktbk",
    ".kbttkkttthyyhyyhtkkttbk",
    "..kkbttttthyyhyyhtttbkk",
    "....kkkttthhhhhhhttkk",
    "......kttrthrhhrhtrtk",
    "......ktrtthhrrhhttrtk",
    "......kttrttttttrtttk",
    "......kTttrtttttrttTk",
    "......kTTttrtttrttTTk",
    ".....kTTTkkkkkkkkTTTk",
    "....kTTTk......kTTTk",
    "...kTTbTk......kTbTTk",
    "...kkkkkk......kkkkkk",
]

COSTAS = [
    "........kkkkkkkkk",
    "......kkgggllgggkk",
    "....kkggglllggggggkk",
    "...kgggGGGggggGGGgggk",
    "..ykgggGGGGgllGGGGggky",
    "..kgllggGGggllgGGgglgk",
    ".kggllgggggGGGgggggllgk",
    ".kgggggGGGgGGGgGGGgggggk",
    "ykgGGgGGGGgGyGgGGGGgGGgky",
    ".kgGGGgGGGggGgggGGGgGGgk",
    "..kgGGgggggggggggggGGgk",
    "...kkgggGGGggggGGGggkk",
    "....kkkkkkttttkkkkkk",
    ".kk.....kttrTttk.....kk",
    "kbtkk..kttttttttrtk..kktbk",
    ".kbttkkttrttttttttkkttbk",
    "..kkbttttrtttttttttttbkk",
    "....kkkttrttttttrttkk",
    "......kttttttttrttk",
    "......ktttttttrtttk",
    "......kttrttttrtttk",
    "......kTttrtttttTtk",
    "......kTTttttttTTTk",
    ".....kTTTkkkkkkkTTTk",
    "....kTTTk......kTTTk",
    "...kTTbTk......kTbTTk",
    "...kkkkkk......kkkkkk",
]

LADO = [
    ".......kkkkkkkkk",
    ".....kkgggllgggkk",
    "...kkggglllggggggk",
    "..kgggGGGggggGGGggk",
    ".ykgggGGGGgllGGGGgky",
    ".kgllggGGggllgGGgglk",
    "kggllgggggGGGgggggllk",
    "kgggggGGGgGGGgGGGgggk",
    "kgGGgGGGGgGyGgGGGGgGk",
    "kgGGGgGGGggGgggGGGgk",
    ".kgGGgggggggggggGGk",
    "..kkgggGGGggggGGkk",
    "...kkkkkkttttkkkk",
    ".kbk...kttrTttk",
    "kbtk..ktttrthhk",
    ".kbtkktttrthyhk",
    "..kbtttttthhhk",
    "...kkktttrthrk",
    ".....ktrttrrtk",
    ".....kttrtttrtk",
    ".....kttrtttrtk",
    ".....kTttrttTtk",
    ".....kTTttrtTTk",
    "....kTTTkkkkTTTk",
    "...kTTTk..kTTTk",
    "..kTTbTk.kTbTTk",
    "..kkkkkk.kkkkkk",
]

# (o CAIO: "o tronky e o troncudo tão espelhados pros lados" — a cara ficou do
# lado direito do tronco, então o desenho de lado é virado aqui pra olhar pra
# esquerda, e as patas de lado vão junto)
_LARG = max(len(l) for l in LADO)
LADO = [l.ljust(_LARG, ".")[::-1] for l in LADO]

PATAS_FRENTE = ((3, 10), (15, 22), 24)
PATAS_LADO = ((_LARG - 16, _LARG - 9), (_LARG - 9, _LARG - 2), 24)

if __name__ == "__main__":
    from comum import salvar
    salvar(1031, FRENTE, COSTAS, LADO, CORES, PATAS_FRENTE, PATAS_LADO, previa=os.environ.get("PREVIA"))
    print("TRONKY: andar feito")
