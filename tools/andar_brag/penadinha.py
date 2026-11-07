"""A PENADINHA ANDANDO (flutuando), desenhada do zero (o CAIO, nov/2026: "faz
do zero"). A alminha penada pequena: o lençolzinho azul-claro de barra
ondulada, os olhinhos e a VELA acesa nas mãozinhas (a chama tremula).
  k contorno   a azul   A azul claro   s azul na sombra   e olho   c vela
  o chama   y chama clara"""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

CORES = {
    "k": (40, 60, 110), "a": (176, 216, 246), "A": (200, 228, 249), "s": (130, 170, 224), "S": (130, 160, 182),
    "e": (30, 26, 34), "c": (246, 240, 220), "o": (250, 130, 36), "y": (255, 210, 60),
}

FRENTE = [
    ".....kkkkk",
    "...kkAAAaakk",
    "..kAAaaaaaask",
    ".kAAaaaaaaassk",
    ".kAaakaaakaask",
    ".kaaakaaakaask",
    ".kaaaaaoaaaask",
    ".kaaaaayaaaask",
    ".kaaaakckaaask",
    ".kaaakkckkaask",
    ".kaaaaacaaaask",
    ".kaaaaaaaaassk",
    ".kasaaaaaaassk",
    ".ksskassakassk",
    "..kk.kk.kk.kk",
]

COSTAS = [
    ".....kkkkk",
    "...kkAAAaakk",
    "..kAAaaaaaask",
    ".kAAaaaaaaassk",
    ".kAaaaaaaaaask",
    ".kaaaaaaaaaask",
    ".kaaaaaaaaaask",
    ".kaaaaaaaaaask",
    ".kaaaaaaaaaask",
    ".kaaaaaaaaaask",
    ".kaaaaaaaaaask",
    ".kaaaaaaaaassk",
    ".kasaaaaaaassk",
    ".ksskassakassk",
    "..kk.kk.kk.kk",
]

LADO = [
    "....kkkkk",
    "..kkAAAaakk",
    ".kAAaaaaaask",
    "kAAaaaaaaassk",
    "kAkaaaaaaaask",
    "kakaaaaaaaask",
    "oaaaaaaaaaask",
    "yaaaaaaaaaask",
    "ckkaaaaaaaask",
    "ckaaaaaaaaask",
    "kaaaaaaaaaask",
    ".kaaaaaaaassk",
    ".kasaaaaaassk",
    ".ksskassakssk",
    "..kk.kk.kkkk",
]

if __name__ == "__main__":
    from comum import salvar
    salvar(1067, FRENTE, COSTAS, LADO, CORES, ((0, 0),) * 2, ((0, 0),) * 2, fogo=[("o", "y")], previa=os.environ.get("PREVIA"), pulo=True)
    print("PENADINHA: andar feito")
