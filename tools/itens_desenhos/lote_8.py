"""LOTE 8 — o VISOR DE CARDUMES (o fundo do mar, src/data/fundo-do-mar.js).

Um visor de mergulho visto de frente: a armação escura, a lente azul-ciano
com o reflexo, a alça cinza dando a volta e, em cima, o sensorzinho que acha
os cardumes (o pontinho amarelo).
"""
from itens_sprites import item, hexa

item("visor de cardumes", [
    "................",
    "................",
    ".......kk.......",
    "......kyyk......",
    ".......kk.......",
    "..kkkkkkkkkkkk..",
    ".kCWccckkcccWCk.",
    "gkcCccckkccccCkg",
    "gkcccDDkkDDcccDg",
    ".kccDDkkkkDDccDk",
    "..kkkkk..kkkkkk.",
    "................",
    "................",
    "................",
    "................",
    "................",
], {"y": hexa("#ffe060"), "c": hexa("#38d8f0"), "C": hexa("#a8f4ff"), "W": hexa("#ffffff"),
    "D": hexa("#1c8aa8"), "g": hexa("#5a5a6a")})
