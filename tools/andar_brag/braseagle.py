"""O BRASEAGLE ANDANDO, desenhado do zero (o CAIO, nov/2026: "faz do zero").
O DIGGLE crescido: perna mais comprida, orelha mais longa com o FOGO pingando
da ponta, a chama grande no rabo e a do quadril. Mesmas letras do DIGGLE
(tools/andar_brag/diggle.py)."""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from diggle import CORES  # noqa: E402

FRENTE = [
    "......................kyk...",
    ".....................kyyok..",
    ".....................kyook..",
    "......kkkkkkkkk.....kyook...",
    "....kkTTTTcTTTTkk...kook....",
    "...kTttttcCcttttTk...kck....",
    "..kETttttcCcttttTEk..kck....",
    "..kEbtttccCccttbbEk..kck....",
    ".kEEbtkkkcccckkkbEEk.kck....",
    ".kEEbkkwkcccckwkkbEEkkck....",
    ".kEEbkkkkcccckkkkbEEkck.....",
    ".kEEbtkkcccccckktbEEkk......",
    ".kEEbtcccckkkcccctEEk.......",
    ".kEEbtccccckccccctEEk.......",
    ".kEEktcccckpkcccctkEEk......",
    ".kEEkkcccccpccccckkEEk......",
    "kyoEk.kccccccccck..kEoyk....",
    "kyook.ktcccccccckt.kooyk....",
    ".kok.kttbcCcccCcbttk.kok....",
    "..k..ktbbcccccccbbtk..k.....",
    "....ktbbbcccccccbbbtk.......",
    "....ktbbscccccccsbbtk.......",
    "....kkcscskkkkkscsckk.......",
    ".....kcck.......kcck........",
    ".....kcck.......kcck........",
    ".....kBBk.......kBBk........",
    ".....kkkk.......kkkk........",
    "............................",
]

COSTAS = [
    "............kyk.............",
    "...........kyyok............",
    "...........kyook............",
    "......kkkkkkoookkkk.........",
    "....kkTTTTkkcCkkTTTkk.......",
    "...kTttttckcCktttttTk.......",
    "..kETtttckcCcktttttTEk......",
    "..kEttttkcCcktttttttEk......",
    ".kEEttttkcCcktttttttEEk.....",
    ".kEEbtttkcCckttttttbEEk.....",
    ".kEEbbttkcCckttttttbEEk.....",
    ".kEEbbbtkcCcktttttbbEEk.....",
    ".kEEbbbbkcCckbbbbbbbEEk.....",
    ".kEEkbbbkcCckbbbbbbkEEk.....",
    ".kEEkkttkcCcktttttkkEEk.....",
    ".kEEk.kttkckttttttk.kEEk....",
    "kyoEk.ktttttttbbbbtk.kEoyk..",
    "kyook.ktttttbbbbbbtk.kooyk..",
    ".kok.kttcttttbbbbbtck.kok...",
    "..k..ktccctttbbbbtcctk.k....",
    "....ktbccccttttttccctk......",
    "....ktbbscccccccccsbbtk.....",
    "....kkcscskkkkkkkscsckk.....",
    ".....kcck........kcck.......",
    ".....kcck........kcck.......",
    ".....kBBk........kBBk.......",
    ".....kkkk........kkkk.......",
    "............................",
]

LADO = [
    "........................kyk.",
    ".......................kyyok",
    ".......................kyook",
    ".......kkkkkk.........kyook.",
    ".....kkTTcTTTkk.......kook..",
    "....kTttcCctttTk.......kck..",
    "...kttttcctttttEk......kck..",
    "..kcttkkcttttEEEk......kck..",
    ".kcccckwkctttEEEEk.....kck..",
    "kkccccckkctttEEEEk.....kck..",
    "kkcccccccctbEEEEEk....kcck..",
    ".kcccckkcctbEEEEEk....kcck..",
    "..kkpkcccbbEEEEEkkkkkkkcck..",
    "....kkcccbbEEEEkTTTTTTttk...",
    "......kccckEEEEktttttbbbtk..",
    "......kcccckEEkttttbbbbbbtk.",
    "......kccccyEoytttbbbbbbbtk.",
    "......kcccckyoyktttbbbbbtyok",
    "......kccccckoktttttbbbbkyyk",
    ".......kcccccckcccccccctkook",
    ".......kscccccccccccccctk.k.",
    ".......ksssccccccccccsssk...",
    "........ksskkkkkkkkkkkssk...",
    "........kcck.......kccck....",
    "........kcck.......kccck....",
    "........kBBk.......kBBBk....",
    "........kkkk.......kkkkk....",
    "............................",
]

PATAS_FRENTE = ((4, 10), (15, 21))
PATAS_LADO = ((7, 13), (18, 25))

if __name__ == "__main__":
    from comum import salvar
    salvar(1035, FRENTE, COSTAS, LADO, CORES, PATAS_FRENTE, PATAS_LADO, fogo=[("o", "y")], previa=os.environ.get("PREVIA"))
    print("BRASEAGLE: andar feito")
