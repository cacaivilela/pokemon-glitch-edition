# O COGUMELO MAX (16x16), pixel por pixel: chapéu vermelho-dynamax com
# pintas, talo creme e o brilho rosa da energia dynamax em volta.
# python3 tools/cogumelo_max/desenho.py -> assets/sprites/itens/cogumelo-max.png
from PIL import Image
G = [
    "................",
    ".....kkkkkk.....",
    "...kkRRrRRRkk...",
    "..kRRwwRRRRrRk..",
    ".kRRwwRRRRwwRRk.",
    ".kRRRRRRRRwwRRk.",
    "kRrRRRRwwRRRRRrk",
    "kRRRwwRwwRRRrRRk",
    "kdRRwwRRRRRRRRdk",
    ".kddddddddddddk.",
    "..kkkcCCCCckkk..",
    "....kcCCCCck....",
    "...pkcCCCcck.p..",
    "....kccCCcck....",
    "...p.kkkkkk.p...",
    "................",
]
P = {
    "k": (58, 14, 30, 255),     # contorno
    "R": (226, 40, 70, 255),    # vermelho do chapéu
    "r": (255, 120, 150, 255),  # brilho
    "d": (150, 20, 50, 255),    # sombra embaixo do chapéu
    "w": (255, 230, 240, 255),  # pintas
    "C": (246, 226, 190, 255),  # talo
    "c": (204, 170, 130, 255),  # sombra do talo
    "p": (255, 90, 200, 255),   # faísca dynamax
}
im = Image.new("RGBA", (16, 16))
for y, l in enumerate(G):
    assert len(l) == 16, (y, len(l))
    for x, ch in enumerate(l):
        if ch != ".": im.putpixel((x, y), P[ch])
im.save("assets/sprites/itens/cogumelo-max.png")
im.resize((128, 128), Image.NEAREST).save("dev/captures/cogumelo-max-grande.png")
