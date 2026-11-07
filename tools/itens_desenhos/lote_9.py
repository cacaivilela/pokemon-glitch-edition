"""LOTE 9: OS DOCES DO ALCREMIE (src/data/doces.js), um desenho pra cada.

Os 13 de cor: os 7 do Sword/Shield, cada um com a forma do enfeite dele
(morango, frutinha, coração, estrela, trevo, flor, laço) em cima de um
montinho de creme da cor que ele dá, e os 6 novos (oceano, noite, erva, nuvem,
dourado e o glitch). Os 12 DO BRASIL são os doces de verdade: brigadeiro na
forminha, açaí na tigela, paçoca, jabuticaba, goiabada, maracujá, quindim,
caju, cocada, pé-de-moleque, beijinho e o DOCE BRASILEIRO, a bandeira.
Pixel por pixel, como os outros lotes ('k' é o contorno).
"""
from itens_sprites import item, tons, hexa, clarear, escurecer, BRANCO

# ============================================================ O CREME DE BAIXO
# o montinho de creme onde o enfeite de cada doce do Sword/Shield fica em
# cima; C é o creme da cor do doce, H o brilho, D a sombra
def creme(cor):
    c, h, d = tons(cor)
    return {"C": c, "H": h, "D": d}


# MORANGO: o morango vermelho com sementinhas e folhas, no creme rosa
item("doce de morango", [
    "................",
    "......g.g.......",
    ".....ggggg......",
    "....kkGgGkk.....",
    "...kRRRRRRRk....",
    "...kRyRRRyRk....",
    "...kRRRyRRrk....",
    "....kRyRRrk.....",
    ".....krrrk......",
    "..kkkkkkkkkkk...",
    ".kHCCCCCCCCCDk..",
    "kHCCCCCCCCCCCDk.",
    "kCCCCCCCCCCCDDk.",
    ".kDCCCCCCCDDDk..",
    "..kkkkkkkkkkk...",
    "................",
], {**creme("#f8b4cc"), "R": hexa("#e83848"), "r": hexa("#a82030"), "y": hexa("#f8e070"),
    "g": hexa("#58c048"), "G": hexa("#2a8030")})

# FRUTINHA: três bolinhas roxas de frutinha, no creme lilás
item("doce de frutinha", [
    "................",
    "........g.......",
    "....kkk.gkkk....",
    "...kBWBk.kBWBk..",
    "...kBBbk.kBBbk..",
    "....kkkkkkkk....",
    "......kBWBk.....",
    "......kBBbk.....",
    ".......kkk......",
    "..kkkkkkkkkkk...",
    ".kHCCCCCCCCCDk..",
    "kHCCCCCCCCCCCDk.",
    "kCCCCCCCCCCCDDk.",
    ".kDCCCCCCCDDDk..",
    "..kkkkkkkkkkk...",
    "................",
], {**creme("#cca4ec"), "B": hexa("#6a3ab0"), "b": hexa("#40206a"), "W": hexa("#c8a8f0"), "g": hexa("#58c048")})

# AMOR: o coração vermelho, no creme vermelho-claro
item("doce de amor", [
    "................",
    "...kkk...kkk....",
    "..kRWRk.kRRRk...",
    "..kRRRRkRRRRrk..",
    "..kRRRRRRRRRrk..",
    "...kRRRRRRRrk...",
    "....kRRRRRrk....",
    ".....kRRRrk.....",
    "......krrk......",
    "..kkkkkkkkkkk...",
    ".kHCCCCCCCCCDk..",
    "kHCCCCCCCCCCCDk.",
    "kCCCCCCCCCCCDDk.",
    ".kDCCCCCCCDDDk..",
    "..kkkkkkkkkkk...",
    "................",
], {**creme("#f48478"), "R": hexa("#e82848"), "r": hexa("#a01830"), "W": hexa("#ffb0c0")})

# ESTRELA: a estrela amarela de cinco pontas, no creme amarelo
item("doce de estrela", [
    ".......kk.......",
    "......kYYk......",
    "......kYYk......",
    "..kkkkYWYYkkkk..",
    "..kYYYYYYYYYYk..",
    "...kYYYYYYYYk...",
    "....kYYYYYyk....",
    "....kYYkkYyk....",
    "...kYyk..kyyk...",
    "..kkkkkkkkkkk...",
    ".kHCCCCCCCCCDk..",
    "kHCCCCCCCCCCCDk.",
    "kCCCCCCCCCCCDDk.",
    ".kDCCCCCCCDDDk..",
    "..kkkkkkkkkkk...",
    "................",
], {**creme("#f8e88c"), "Y": hexa("#f8c820"), "y": hexa("#c08810"), "W": hexa("#fff4a0")})

# TREVO: o trevo de quatro folhas, no creme verde
item("doce de trevo", [
    "................",
    "....kkk..kkk....",
    "...kGWGk.kGGGk..",
    "...kGGGGkGGGgk..",
    "....kGGGGGGgk...",
    "...kGGGGkGGGGk..",
    "...kGGgk.kGGgk..",
    "....kkk.k.kkk...",
    "........kk......",
    "..kkkkkkkkkkk...",
    ".kHCCCCCCCCCDk..",
    "kHCCCCCCCCCCCDk.",
    "kCCCCCCCCCCCDDk.",
    ".kDCCCCCCCDDDk..",
    "..kkkkkkkkkkk...",
    "................",
], {**creme("#b4e09c"), "G": hexa("#38a840"), "g": hexa("#1c6a28"), "W": hexa("#90e080")})

# FLOR: a flor de cinco pétalas azuis com o miolo amarelo, no creme azul-claro
item("doce de flor", [
    "................",
    "......kkk.......",
    ".....kPWPk......",
    "..kkkkPPPkkkk...",
    ".kPPPkYYYkPPPk..",
    ".kPPPkYOYkPPpk..",
    "..kkkkYYYkkkk...",
    "....kPPkPPpk....",
    "....kPpkkPpk....",
    "..kkkkkkkkkkk...",
    ".kHCCCCCCCCCDk..",
    "kHCCCCCCCCCCCDk.",
    "kCCCCCCCCCCCDDk.",
    ".kDCCCCCCCDDDk..",
    "..kkkkkkkkkkk...",
    "................",
], {**creme("#a8e0f4"), "P": hexa("#58a8f0"), "p": hexa("#2c68b0"), "W": hexa("#c0e8ff"),
    "Y": hexa("#f8d030"), "O": hexa("#e08818")})

# LAÇO: o laço de fita caramelo, no creme caramelo
item("doce de laço", [
    "................",
    "................",
    ".kkk.......kkk..",
    "kLWLkk...kkLLLk.",
    "kLLLLLk.kLLLLLk.",
    "kLLLLLLkLLLLLlk.",
    "kLLLLLkMkLLLLlk.",
    "kLLlkkkMkkkLllk.",
    ".kkk.kLk.kLk.kk.",
    "..kkkkkkkkkkk...",
    ".kHCCCCCCCCCDk..",
    "kHCCCCCCCCCCCDk.",
    "kCCCCCCCCCCCDDk.",
    ".kDCCCCCCCDDDk..",
    "..kkkkkkkkkkk...",
    "................",
], {**creme("#dcac7c"), "L": hexa("#e05878"), "l": hexa("#a03050"), "W": hexa("#ffa8c0"), "M": hexa("#c03858")})

# ============================================================ OS 6 NOVOS (balas embrulhadas)
# a bala de papel torcido nas duas pontas; B é a cor da bala
BALA = [
    "................",
    "................",
    "................",
    "................",
    "kk...kkkkkk...kk",
    "kPk.kBBBBBBk.kPk",
    "kPPkBWBBBBBbkPPk",
    ".kPPBBBBBBBbPPk.",
    ".kPPBBBBBBBbPPk.",
    "kPPkBBBBBBbbkPPk",
    "kPk.kBbbbbbk.kPk",
    "kk...kkkkkk...kk",
    "................",
    "................",
    "................",
    "................",
]


def bala(nome, cor, papel):
    b, w, d = tons(cor)
    item(nome, BALA, {"B": b, "W": w, "b": d, "P": hexa(papel)})


# OCEANO: a bala azul com uma onda branca por cima
item("doce de oceano", [
    "................",
    "................",
    "................",
    "................",
    "kk...kkkkkk...kk",
    "kPk.kBBBBBBk.kPk",
    "kPPkBWBBBWBbkPPk",
    ".kPPWBWBWBWbPPk.",
    ".kPPBBBWBBBbPPk.",
    "kPPkBBBBBBbbkPPk",
    "kPk.kBbbbbbk.kPk",
    "kk...kkkkkk...kk",
    "................",
    "................",
    "................",
    "................",
], {"B": hexa("#3a78e0"), "b": hexa("#1c4898"), "W": hexa("#c8e8ff"), "P": hexa("#8cd0f8")})

# NOITE: a lua minguante anil com duas estrelinhas
item("doce de noite", [
    "................",
    "..y.............",
    ".yyy...kkkk.....",
    "..y...kNNNk.....",
    ".....kNWNk......",
    "....kNNNk.....y.",
    "....kNNNk.......",
    "....kNNNk.......",
    "....kNNNNk......",
    ".....kNNNNkkkk..",
    "......knNNNNNk..",
    ".......knnnnk...",
    "........kkkk....",
    "...........y....",
    "..........yyy...",
    "...........y....",
], {"N": hexa("#6a5ad0"), "n": hexa("#3a2a88"), "W": hexa("#b0a8f0"), "y": hexa("#f8e070")})

# ERVA: a folha oliva com a nervura
item("doce de erva", [
    "................",
    "...........kk...",
    ".........kkOOk..",
    ".......kkOOWOk..",
    ".....kkOOOWOOk..",
    "....kOOOOWOOOk..",
    "...kOOOOWOOOok..",
    "...kOOOWOOOOok..",
    "..kOOOWOOOOok...",
    "..kOOWOOOOok....",
    "..kOWOOOook.....",
    "..kWoooookk.....",
    ".kWkkkkkk.......",
    "kWk.............",
    "kk..............",
    "................",
], {"O": hexa("#98a040"), "o": hexa("#5c6420"), "W": hexa("#d8e088")})

# NUVEM: a nuvem cinza fofinha
item("doce de nuvem", [
    "................",
    "................",
    "................",
    "......kkkk......",
    ".....kWWWNk.....",
    "..kkkWWNNNNkk...",
    ".kWWWNNNNNNNNk..",
    "kWWNNNNNNNNNNNk.",
    "kWNNNNNNNNNNNNk.",
    "kNNNNNNNNNNNNnk.",
    ".kNNNNNNNNNnnk..",
    "..kknnnnnnnkk...",
    "....kkkkkkk.....",
    "................",
    "................",
    "................",
], {"N": hexa("#c0c8d4"), "n": hexa("#8890a0"), "W": hexa("#f4f8fc")})

# DOURADO: a bala de ouro, com um brilho
bala("doce dourado", "#f0c020", "#fff0a0")
from itens_sprites import ITENS, desenhar  # noqa: E402  (o brilho por cima)
ITENS["doce dourado"] = desenhar([
    "..............W.",
    ".............WWW",
    "..............W.",
    "................",
    "kk...kkkkkk...kk",
    "kPk.kBBBBBBk.kPk",
    "kPPkBWWBBBBbkPPk",
    ".kPPBWBBBBBbPPk.",
    ".kPPBBBBBBBbPPk.",
    "kPPkBBBBBBbbkPPk",
    "kPk.kBbbbbbk.kPk",
    "kk...kkkkkk...kk",
    ".W..............",
    "WWW.............",
    ".W..............",
    "................",
], {"B": hexa("#f0c020"), "b": hexa("#b08010"), "W": hexa("#fff8d0"), "P": hexa("#fff0a0")})

# GLITCH: a bala preta quebrada, com pixel magenta e verde fora do lugar
item("doce glitch", [
    "................",
    "...........M....",
    "................",
    "..G.............",
    "kk...kkkkkk..Mkk",
    "kPk.kBBMBBBk.kPk",
    "kPPkBBBBBGBbkPPk",
    ".kPPBMBBBBBbPPk.",
    "...kPPBBBBBBbPPk",
    "kPPkBBBGBBbbkPPk",
    "kPk.kBbbbMbk.kPk",
    "kk...kkkkkk...kk",
    "......G.........",
    "................",
    ".M..............",
    "................",
], {"B": hexa("#30303a"), "b": hexa("#18181e"), "P": hexa("#5c5c70"), "M": hexa("#ff40ff"), "G": hexa("#40ff80")})

# ============================================================ OS DOCES DO BRASIL
# a FORMINHA de papel (do brigadeiro e do beijinho): F é o papel, f a dobra
FORMINHA = [
    "..kFfFfFfFfFk...",
    "..kFfFfFfFfFk...",
    "...kFfFfFfFk....",
    "....kkkkkkk.....",
]

# BRIGADEIRO: a bolinha de chocolate com granulado, na forminha vermelha
item("brigadeiro", [
    "................",
    "................",
    "................",
    ".....kkkkk......",
    "....kCWCCCk.....",
    "...kCWCgCCCk....",
    "...kCCCCCgCk....",
    "...kCgCCCCCk....",
    "...kCCCgCCck....",
    "..kkkCCCCcckk...",
    "..kFfFkkkkfFk...",
    *FORMINHA,
    "................",
], {"C": hexa("#6a3a20"), "c": hexa("#3e2010"), "W": hexa("#a06840"), "g": hexa("#2a1408"),
    "F": hexa("#e04040"), "f": hexa("#a02828")})

# AÇAÍ: a tigela roxa com banana e granola por cima
item("doce de açaí", [
    "................",
    "................",
    "................",
    "................",
    "....kkkkkkkk....",
    "..kkYYAAgAYYkk..",
    ".kAYyYAgAAAYyAk.",
    "kAAAAgAAAWAAgAAk",
    "kkkkkkkkkkkkkkkk",
    ".kTTTTTTTTTTTtk.",
    ".kTTTTTTTTTTttk.",
    "..kTTTTTTTTttk..",
    "...kTTTTTTttk...",
    "....kkkkkkkk....",
    "................",
    "................",
], {"A": hexa("#5a2a70"), "W": hexa("#9a68b0"), "Y": hexa("#f8e890"), "y": hexa("#c8b058"),
    "g": hexa("#c08840"), "T": hexa("#b0784a"), "t": hexa("#7a4e2c")})

# PAÇOCA: o disquinho bege de amendoim, esfarelando
item("paçoca", [
    "................",
    "................",
    "................",
    "....kkkkkkk.....",
    "..kkPPWPPPPkk...",
    ".kPPWPPpPPPPPk..",
    ".kPPPPPPPPpPPk..",
    ".kpPPPpPPPPPpk..",
    ".kSPPPPPPPPPSk..",
    ".kSSSPPPPPSSSk..",
    ".kSSSSSSSSSSSk..",
    "..kkSSSSSSSkk...",
    "....kkkkkkk..p..",
    "...........p....",
    ".............p..",
    "................",
], {"P": hexa("#e8cc98"), "W": hexa("#fff0d0"), "p": hexa("#b08a58"), "S": hexa("#c8a470")})

# JABUTICABA: o cachinho de jabuticabas pretas e brilhantes
item("doce de jabuticaba", [
    "................",
    "................",
    "........g.......",
    ".......gg.......",
    "....kkkg.kkk....",
    "...kJWJk.kJWJk..",
    "...kJJjk.kJJjk..",
    "....kkkkkkkk....",
    "...kJWJkkJWJk...",
    "...kJJJkkJJjk...",
    "...kJJjkkJjjk...",
    "....kkk..kkk....",
    "................",
    "................",
    "................",
    "................",
], {"J": hexa("#3a2840"), "j": hexa("#1c1020"), "W": hexa("#9a80b0"), "g": hexa("#58a040")})

# GOIABADA: a fatia de goiabada, vermelho-tijolo, com um brilho
item("goiabada", [
    "................",
    "................",
    "................",
    "................",
    "......kkkkkkkk..",
    "....kkGWGGGGGk..",
    "..kkGGWGGGGGgk..",
    ".kGGGGGGGGGgGk..",
    ".kGGGGGGGGgGgk..",
    ".kgGGGGGGGGggk..",
    ".kggGGGGGGgggk..",
    ".kgggggggggggk..",
    ".kkkkkkkkkkkkk..",
    "................",
    "................",
    "................",
], {"G": hexa("#c83040"), "g": hexa("#801828"), "W": hexa("#f07888")})

# MARACUJÁ: o maracujá cortado no meio, a polpa amarela com as sementes pretas
item("doce de maracujá", [
    "................",
    "................",
    "....kkkkkkk.....",
    "..kkYYYYYYYkk...",
    ".kYYPPPPPPPYYk..",
    ".kYPPsPPsPPPYk..",
    "kYPPPPPPPsPPPYk.",
    "kYPsPPsPPPPsPYk.",
    "kYPPPPPPsPPPPYk.",
    "kYPPsPPPPPsPPYk.",
    ".kYPPPsPPPPPYk..",
    ".kYYPPPPPPPYYk..",
    "..kkYYYYYYYkk...",
    "....kkkkkkk.....",
    "................",
    "................",
], {"Y": hexa("#e8b020"), "P": hexa("#f8d850"), "s": hexa("#2a1a0a")})

# QUINDIM: o quindim amarelo brilhante, com a base de coco
item("quindim", [
    "................",
    "................",
    "................",
    "................",
    ".....kkkkkk.....",
    "....kQWWQQQk....",
    "...kQWQQQQQqk...",
    "...kQQQQQQQqk...",
    "..kQQQQQQQQqqk..",
    "..kCcCcCcCcCck..",
    "..kCCcCCcCCcCk..",
    "...kkkkkkkkkk...",
    "................",
    "................",
    "................",
    "................",
], {"Q": hexa("#ffd820"), "q": hexa("#d09810"), "W": hexa("#fff8b0"), "C": hexa("#f4e8c8"), "c": hexa("#d8c098")})

# CAJU: o caju laranja-avermelhado com a castanha em cima
item("doce de caju", [
    "................",
    "......kkkk......",
    ".....kNNNNk.....",
    "....kNnNNNk.....",
    ".....kkkkk......",
    "....kCWCCCk.....",
    "...kCWCCCCCk....",
    "...kCCCCCCCk....",
    "...kCCCCCCck....",
    "...kCCCCCCck....",
    "...kCCCCCcck....",
    "....kCCCccck....",
    ".....kcccck.....",
    "......kkkk......",
    "................",
    "................",
], {"C": hexa("#f06830"), "c": hexa("#b03818"), "W": hexa("#ffb070"), "N": hexa("#a8a060"), "n": hexa("#d0c888")})

# COCADA: o pedaço branco e áspero de coco
item("cocada", [
    "................",
    "................",
    "................",
    "................",
    "...kkkkkkkkkk...",
    "..kCWCcCCWCCCk..",
    "..kCCCCcCCCcCk..",
    "..kcCCWCCCCCCk..",
    "..kCCCCCCcCWCk..",
    "..kCcCCWCCCCck..",
    "..kSSSSSSSSSSk..",
    "..kSsSSsSSsSSk..",
    "...kkkkkkkkkk...",
    "................",
    "................",
    "................",
], {"C": hexa("#f6f2e6"), "c": hexa("#d8d0b8"), "W": hexa("#ffffff"), "S": hexa("#e0d6bc"), "s": hexa("#c0b498")})

# PÉ-DE-MOLEQUE: a placa marrom de rapadura com os amendoins
item("pé-de-moleque", [
    "................",
    "................",
    "................",
    "................",
    "..kkkkkkkkkkkk..",
    ".kMAMMMAMMMMAMk.",
    ".kMMMAMMMAMMMMk.",
    ".kAMMMMMMMMAMMk.",
    ".kMMMAMMAMMMMAk.",
    ".kMAMMMMMMAMMMk.",
    ".kmmmmmmmmmmmmk.",
    "..kkkkkkkkkkkk..",
    "................",
    "................",
    "................",
    "................",
], {"M": hexa("#a06030"), "m": hexa("#6a3a18"), "A": hexa("#f0d098")})

# BEIJINHO: a bolinha branca de coco com o cravo em cima, na forminha rosa
item("beijinho", [
    "................",
    "................",
    "......kk........",
    "......kc........",
    ".....kkkkk......",
    "....kBWBBBk.....",
    "...kBWBBbBBk....",
    "...kBBBBBBBk....",
    "...kBbBBBBbk....",
    "...kBBBBBbBk....",
    "..kkkBBBBbbkk...",
    "..kFfFkkkkfFk...",
    *FORMINHA,
], {"B": hexa("#fbf4f6"), "b": hexa("#e0c8d0"), "W": hexa("#ffffff"), "c": hexa("#5a3420"),
    "F": hexa("#f8a0c0"), "f": hexa("#d06890")})

# DOCE BRASILEIRO: a bala com a bandeira do Brasil
item("doce brasileiro", [
    "................",
    "................",
    "................",
    "kk.kkkkkkkkkk.kk",
    "kPkkGGGGGGGGkkPk",
    "kPPkGGGYYGGGkPPk",
    ".kPkGGYYYYGGkPk.",
    ".kPkGYYBBYYGkPk.",
    ".kPkYYBWBBYYkPk.",
    ".kPkGYYBBYYGkPk.",
    ".kPkGGYYYYGGkPk.",
    "kPPkGGGYYGGGkPPk",
    "kPkkGGGGGGGGkkPk",
    "kk.kkkkkkkkkk.kk",
    "................",
    "................",
], {"G": hexa("#20a040"), "Y": hexa("#f8d820"), "B": hexa("#2848b8"), "W": hexa("#f8f8f8"), "P": hexa("#e8f4e8")})
