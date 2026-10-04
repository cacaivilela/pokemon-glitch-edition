"""LOTE 5 — o CUBO ZYGARDE.

Um cubo em perspectiva, verde como as células do ZYGARDE: a face de cima
clara, a da esquerda média, a da direita escura, e o Z das células marcado
em preto na frente, com um brilhinho no núcleo.
"""
from itens_sprites import item, hexa, clarear, escurecer, BRANCO

CUBO = [
    "................",
    ".......kk.......",
    ".....kkTTkk.....",
    "...kkTTHTTTkk...",
    ".kkTTTTTTTTTTkk.",
    ".kLLTTTTTTTTRRk.",
    ".kLLLLTTTTRRRRk.",
    ".kLZZZZLLRRRRRk.",
    ".kLLLZLLLRRRRRk.",
    ".kLLZLLLLRRRRRk.",
    ".kLZZZZLLRRRRRk.",
    ".kLLLLLLLRRRRRk.",
    "..kkLLLLLRRRkk..",
    "....kkLLLRkk....",
    "......kkkk......",
    "................",
]
V = hexa("#38c060")
item("cubo zygarde", CUBO,
     {"T": clarear(V), "H": BRANCO, "L": V, "R": escurecer(V), "Z": hexa("#102818")})
