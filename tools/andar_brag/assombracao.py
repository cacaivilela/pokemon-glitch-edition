"""A ASSOMBRAÇÃO ANDANDO (flutuando), desenhada do zero (o CAIO, nov/2026: "faz
do zero"). O fantasma grande de lençol lilás: os olhos roxos acesos, a boca
de "Ó", as CORRENTES atravessadas e o LAMPIÃO na mão (a luz pisca).
  k contorno   a lençol   A claro   s sombra   S sombra escura   e olho
  E olho aceso   c corrente   C corrente clara   y luz do lampião   l lampião"""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

CORES = {
    "k": (40, 30, 70), "a": (226, 222, 244), "A": (235, 232, 247), "s": (180, 172, 214), "S": (167, 164, 181),
    "e": (30, 20, 50), "E": (200, 120, 255), "c": (80, 80, 96), "C": (120, 120, 132), "y": (255, 220, 110),
    "l": (60, 50, 40), "w": (250, 250, 250),
}

FRENTE = [
    ".......kkkkkkk",
    ".....kkAAAAaaakk",
    "....kAAAaaaaaaask",
    "...kAAaaaaaaaaaask",
    "...kAakkkaaakkkask",
    "..kAakEEEkakEEEkask",
    "..kaakEeEkakEeEkask",
    "..kaaakkkaaakkkaask",
    "..kaaaaaakkkaaaaask",
    "..kaaaaaakekaaaaask",
    "..kaaaaaaakaaaaaask.kk",
    "..kcCcCcCcCcCcCcCckkyk",
    "..kaaaaaaaaaaaaaaskyyk",
    "..kaaaaaaaaaaaaaaskllk",
    "..kcCcCcCcCcCcCcCckk",
    "..kaaaaaaaaaaaaassk",
    "..kaaaaaaaaaaaaassk",
    "..kasaaaaasaaaaassk",
    "..kssakaassakaasssk",
    "...kk.kk..kk.kk.kk",
]

COSTAS = [
    ".......kkkkkkk",
    ".....kkAAAAaaakk",
    "....kAAAaaaaaaask",
    "...kAAaaaaaaaaaask",
    "...kAaaaaaaaaaaask",
    "..kAaaaaaaaaaaaaask",
    "..kaaaaaaaaaaaaaask",
    "..kaaaaaaaaaaaaaask",
    "..kaaaaaaaaaaaaaask",
    "..kaaaaaaaaaaaaaask",
    "kk.kaaaaaaaaaaaaaask",
    "kykkcCcCcCcCcCcCcCck",
    "kyykaaaaaaaaaaaaaask",
    "kllkaaaaaaaaaaaaaask",
    ".kkkcCcCcCcCcCcCcCck",
    "...kaaaaaaaaaaaaassk",
    "...kaaaaaaaaaaaaassk",
    "...kasaaaaasaaaaassk",
    "...kssakaassakaasssk",
    "....kk.kk..kk.kk.kk",
]

LADO = [
    "......kkkkkkk",
    "....kkAAAAaaakk",
    "...kAAAaaaaaaask",
    "..kAAaaaaaaaaaask",
    "..kkkkaaaaaaaaask",
    ".kEEEkaaaaaaaaaask",
    ".kEeEkaaaaaaaaaask",
    ".kkkkaaaaaaaaaaask",
    ".kkkaaaaaaaaaaaask",
    "kekaaaaaaaaaaaaask",
    ".kaaaaaaaaaaaaaask",
    "kkcCcCcCcCcCcCcCck",
    "kykaaaaaaaaaaaaask",
    "kyykaaaaaaaaaaaask",
    "kllcCcCcCcCcCcCcck",
    ".kkaaaaaaaaaaaassk",
    "...kaaaaaaaaaaassk",
    "...kasaaaasaaaassk",
    "...kssakaassakassk",
    "....kk.kk..kk.kkk",
]

if __name__ == "__main__":
    from comum import salvar
    salvar(1068, FRENTE, COSTAS, LADO, CORES, ((0, 0),) * 2, ((0, 0),) * 2, fogo=[("y", "w"), ("E", "e")], previa=os.environ.get("PREVIA"), pulo=True)
    print("ASSOMBRAÇÃO: andar feito")
