"""LOTE 6 — o PURIFICADOR e os FÓSSEIS PUROS (src/data/fosseis-puros.js).

O PURIFICADOR é uma lanterninha de mão: corpo de metal, o vidro com a luz
branca acesa e uns raios saindo. O fóssil puro é o mesmo desenho do fóssil
de sempre (lote 1) com a pedra lavada: a rocha bege vira um branco-perolado
azulado e ganha dois brilhinhos — dá pra ver na mochila qual já passou pela luz.
"""
from itens_sprites import item, ITENS, hexa, clarear, escurecer, BRANCO

LANTERNA = [
    "................",
    "..y.....y.......",
    "...y...y........",
    ".....kkkk...y...",
    "....kLLLLk.y....",
    "y..kLHLLLLk.....",
    ".y.kLLLLLLk..yy.",
    "...kGGGGGGk.....",
    "....kMMMMk......",
    "....kMSMMk......",
    "....kMSMMk......",
    "....kMMMDk......",
    "....kMMMDk......",
    "....kDDDDk......",
    ".....kkkk.......",
    "................",
]
item("purificador", LANTERNA, {
    "L": hexa("#eef6ff"), "H": BRANCO, "y": hexa("#fff6a8"), "G": hexa("#d8b048"),
    "M": hexa("#8890a8"), "S": hexa("#c8d0e0"), "D": hexa("#5a6078"),
})

# os PUROS: o fóssil de sempre, com a pedra lavada
PUROS = {
    "fóssil hélix": "fóssil hélix puro", "fóssil domo": "fóssil domo puro", "âmbar velho": "âmbar puro",
    "fóssil raiz": "fóssil raiz puro", "fóssil garra": "fóssil garra puro", "fóssil crânio": "fóssil crânio puro",
    "fóssil escudo": "fóssil escudo puro", "fóssil casco": "fóssil casco puro", "fóssil pluma": "fóssil pluma puro",
    "fóssil de ave": "fóssil de ave puro", "fóssil de peixe": "fóssil de peixe puro",
    "fóssil de dragão": "fóssil de dragão puro",
}


def lavar(img):
    """pedra -> perolado: cada cor vira o tom dela num branco-azulado, o
    contorno escurinho fica, e dois brilhos entram no alto"""
    out = img.copy()
    px = out.load()
    for y in range(out.height):
        for x in range(out.width):
            r, g, b, a = px[x, y]
            if not a:
                continue
            luz = (r * 3 + g * 4 + b * 2) / 9
            if luz < 50:                                  # o contorno
                px[x, y] = (40, 44, 70, a)
                continue
            t = min(1, luz / 230)
            px[x, y] = (round(150 + 100 * t), round(165 + 88 * t), round(200 + 55 * t), a)
    for x, y in ((4, 3), (11, 5)):
        if px[x, y][3]:
            px[x, y] = (255, 255, 255, 255)
    return out


for de, puro in PUROS.items():
    if de in ITENS:
        ITENS[puro] = lavar(ITENS[de])
