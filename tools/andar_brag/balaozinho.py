"""O BALÃOZINHO ANDANDO (flutuando), desenhado do zero (o CAIO, nov/2026: "faz
do zero"). O balão de São João: os gomos de listra (amarelo, vermelho, azul),
a carinha de bochecha rosada, a boquinha de papel embaixo e a CHAMINHA que
segura ele no ar (ela tremula enquanto ele sobe e desce).
  k contorno   y amarelo   Y amarelo claro   r vermelho   b azul   B azul
  escuro   p bochecha   s a boca de papel   o chama   O chama clara   e olho"""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

CORES = {
    "k": (24, 20, 32), "y": (252, 206, 48), "Y": (253, 221, 110), "r": (222, 44, 48), "b": (44, 104, 214),
    "B": (33, 77, 158), "p": (232, 107, 110), "s": (178, 175, 163), "o": (250, 130, 36), "O": (253, 221, 110),
    "e": (24, 20, 32), "w": (255, 255, 255),
}

FRENTE = [
    ".....kkkkkkk",
    "...kkYyrrbbBkk",
    "..kYyyrrrbbbBBk",
    ".kYyyyrrrbbbbBBk",
    ".kYyyyrrrbbbbBBk",
    "kYyyywkrrrwkbbBBk",
    "kyyyykkrrrkkbbbBk",
    "kyyppyyrrrbbbppBk",
    "kyyyyyrkkkrbbbbBk",
    ".kyyyyrrrrrbbbbBk",
    ".kyyyyrrrrrbbbBk",
    "..kyyyrrrrrbbBk",
    "...kkyrrrrrbkk",
    ".....kkkkkkk",
    ".....kssssk",
    "......kssk",
    "......kook",
    ".......kOk",
    "........k",
]

COSTAS = [
    ".....kkkkkkk",
    "...kkYyrrbbBkk",
    "..kYyyrrrbbbBBk",
    ".kYyyyrrrbbbbBBk",
    ".kYyyyrrrbbbbBBk",
    "kYyyyyrrrrbbbbBBk",
    "kyyyyyrrrrbbbbbBk",
    "kyyyyyrrrrbbbbbBk",
    "kyyyyyrrrrbbbbbBk",
    ".kyyyyrrrrrbbbbBk",
    ".kyyyyrrrrrbbbBk",
    "..kyyyrrrrrbbBk",
    "...kkyrrrrrbkk",
    ".....kkkkkkk",
    ".....kssssk",
    "......kssk",
    "......kook",
    ".......kOk",
    "........k",
]

LADO = [
    ".....kkkkkk",
    "...kkYyrrbbkk",
    "..kYyyrrrbbBBk",
    ".kYyyyrrrbbbBBk",
    ".kYyyyrrrbbbBBk",
    "kYywkyrrrbbbbBBk",
    "kyykkyrrrbbbbbBk",
    "kyppyyrrrbbbbbBk",
    "kykkyyrrrbbbbbBk",
    ".kyyyyrrrrbbbBk",
    ".kyyyyrrrrbbbBk",
    "..kyyyrrrrbbBk",
    "...kkyrrrrbkk",
    ".....kkkkkk",
    ".....ksssk",
    "......ksk",
    "......kok",
    "......kOk",
    ".......k",
]

if __name__ == "__main__":
    from comum import salvar
    salvar(1062, FRENTE, COSTAS, LADO, CORES, ((0, 0),) * 2, ((0, 0),) * 2, fogo=[("o", "O")], previa=os.environ.get("PREVIA"), pulo=True)
    print("BALÃOZINHO: andar feito")
