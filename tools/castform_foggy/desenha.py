"""O CASTFORM FORMA FOGGY (a forma de NEBLINA, inventada pro jogo, pedido do
CAIO nov/2026): o Castform de nuvem cinza-azulada, com CARA TRISTE (sobrancelha
de triste, olho olhando pra baixo, lágrimas escorrendo, boca virada pra baixo e
uma gota de suor). Feito pixel por pixel em cima do sprite do Castform (351).
Ele passa voando pela tela quando aparece um tornado.
python3 tools/castform_foggy/desenha.py [prévia.png] -> assets/sprites/pokemon/castform-foggy.png"""
import os, sys
from PIL import Image
RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
im = Image.open(os.path.join(RAIZ, "assets/sprites/pokemon/351.png")).convert("RGBA")

# 1) as cores: de nuvem branca pra NEBLINA (cinza-azulado)
NEBLINA = {
    (246, 246, 238): (200, 206, 214),
    (230, 222, 222): (176, 184, 196),
    (205, 189, 189): (140, 148, 162),
    (164, 156, 164): (120, 126, 140),
    (148, 148, 148): (104, 110, 124),
    (90, 82, 82): (60, 64, 78),
    (74, 82, 74): (50, 54, 64),
    (255, 255, 255): (226, 230, 236),
}
for y in range(im.height):
    for x in range(im.width):
        r, g, b, a = im.getpixel((x, y))
        if a and (r, g, b) in NEBLINA:
            im.putpixel((x, y), NEBLINA[(r, g, b)] + (255,))

# 2) a CARA DE MEDO, linha por linha (de x=35 a 49)
P = {
    "F": (226, 230, 236, 255),   # a cara
    "K": (16, 16, 24, 255),      # contorno
    "W": (255, 255, 255, 255),   # o branco do olho arregalado
    "M": (120, 40, 56, 255),     # a boca tremendo
    "S": (120, 190, 240, 255),   # a gota de suor
    "s": (220, 240, 255, 255),   # o brilho da gota
    "n": (200, 206, 214, 255),   # neblina clara (os fiapos em volta)
    "N": (160, 168, 182, 255),   # neblina
}
CARA = {
    42: "....K.....K....",       # a sobrancelha de TRISTE: o lado de dentro sobe
    43: "..KK.......KK..",
    44: ".FFFFFFFFFFFFF.",
    45: "FFFKKKFFFKKKFFF",
    46: "FFKWWWKFKWWWKFF",
    47: "FFKWKWKFKWKWKFF",       # olhando pra baixo
    48: "FFFKKKFFFKKKFFF",
    49: "FFFSFFFFFFFSFFF",       # as lágrimas escorrendo
    50: ".FFSFKKKKKFSFF.",       # a boca virada pra baixo
    51: "...SKFFFFFKS...",
}
for y, linha in CARA.items():
    for i, ch in enumerate(linha):
        if ch != "." and im.getpixel((35 + i, y))[3]:   # só dentro do desenho; "." deixa como está
            im.putpixel((35 + i, y), P[ch])
# a gota de suor, do lado da cabeça
for y, x0, px in [(40, 53, "K"), (41, 52, "KSK"), (42, 52, "KsK"), (43, 52, "KSK"), (44, 53, "K")]:
    for i, ch in enumerate(px):
        im.putpixel((x0 + i, y), P[ch])
# 3) os FIAPOS DE NEBLINA saindo do corpo
for y, x0, px in [(47, 30, "nN"), (48, 29, "nNN"), (52, 31, "nN"), (55, 57, "Nn"), (56, 58, "NNn"),
                  (60, 32, "nN"), (61, 30, "nNN"), (63, 46, "Nn"), (64, 47, "nn"), (58, 60, "n")]:
    for i, ch in enumerate(px):
        if not im.getpixel((x0 + i, y))[3]:
            im.putpixel((x0 + i, y), P[ch])

out = os.path.join(RAIZ, "assets/sprites/pokemon/castform-foggy.png")
im.save(out)
if len(sys.argv) > 1:
    im.crop((24, 24, 72, 72)).resize((384, 384), Image.NEAREST).save(sys.argv[1])
print(out)
