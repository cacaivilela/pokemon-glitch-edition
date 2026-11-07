"""O ZEROGLE ANDANDO (flutuando), desenhado do zero (o CAIO, nov/2026: "faz do
zero"). O cachorro-fantasma: o corpo de lençol branco-azulado em forma de
cachorro, as orelhas caídas, o focinho, os olhos pretos e a LUZINHA laranja
flutuando do lado (ela pisca).
  k contorno   w branco   W branco claro   s sombra   S sombra escura
  e olho   o luz   y luz clara   n focinho"""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

CORES = {
    "k": (70, 80, 120), "w": (226, 236, 250), "W": (235, 242, 252), "s": (168, 186, 216), "S": (150, 166, 204),
    "e": (30, 26, 34), "o": (255, 150, 60), "y": (255, 220, 150), "n": (120, 133, 163),
}

FRENTE = [
    ".....kkkkkk",
    "...kkWWWwwwkk",
    "..kWWwwwwwwwsk.......ky",
    ".kSWwwwwwwwwssk.....kyok",
    ".kSskekwwkekssk......kk",
    ".kSswwwnnwwwssk",
    "..kswwwwwwwwsk",
    "..kswwwkkwwwsk",
    "..kswwwwwwwwsk",
    "..kswwwwwwwwssk",
    "..kswswwwswwssk",
    "..ksskwsskwssk",
    "...kk.kk.kk.kk",
]

COSTAS = [
    ".....kkkkkk",
    "...kkWWWwwwkk",
    "..kWWwwwwwwwsk",
    ".kSWwwwwwwwwssk",
    ".kSswwwwwwwwssk",
    ".kSswwwwwwwwssk",
    "..kswwwwwwwwsk",
    "..kswwwwwwwwsk",
    "..kswwwwwwwwsk",
    "..kswwwwwwwwssk",
    "..kswswwwswwssk",
    "..ksskwsskwssk",
    "...kk.kk.kk.kk",
]

LADO = [
    "....kkkkk",
    "..kkWWWwwkk",
    ".kWWwwwwwwsk",
    "kWwkewwwwwssk",
    "knwwwwwwwwssk.......ky",
    ".kkwwwwwwwwssk.....kyok",
    "...kwwwwwwwwssk.....kk",
    "...kswwwwwwwwssk",
    "...kswwwwwwwwwsskk",
    "...kswwwwwwwwwwswsk",
    "...kswswwwswwwssssk",
    "...ksskwsskwsskkkk",
    "....kk.kk.kk.kk",
]

if __name__ == "__main__":
    from comum import salvar
    salvar(1082, FRENTE, COSTAS, LADO, CORES, ((0, 0),) * 2, ((0, 0),) * 2, fogo=[("o", "y")], previa=os.environ.get("PREVIA"), pulo=True)
    print("ZEROGLE: andar feito")
