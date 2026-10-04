"""LOTE 2: os pandeiros da terra, a barraca, a barraca de leilão, a cuia
térmica, o troféu de pallet, o crachá da silph e o amuleto brilhante.

Mesmas regras de tools/itens_sprites.py: uma letra por pixel, '.' vazio, 'k'
contorno, luz de cima-esquerda, sombra embaixo-direita, nada de antialias.
"""
from itens_sprites import item, familia, compor, tons, hexa, clarear, escurecer, BRANCO, CINZA

# ============================================================ OS PANDEIROS DA TERRA
# Visto de frente: aro redondo (A, com brilho L e sombra D), pele de couro (P,
# brilho Q, sombra R) e seis pares de platinelas de metal (S, com brilho W)
# encaixados no aro. O símbolo da região (M, N) vai no meio da pele.
PANDEIRO = [
    ".....kkkkkk.....",
    "...kkLLAAAAkk...",
    "..kLSSAAAASSAk..",
    ".kALSSkkkkSSAAk.",
    ".kAAkPPPPPPkAAk.",
    "kAAkPQPPPPPPkAAk",
    "kAAkPPPPPPPPkAAk",
    "kSSkPPPPPPPPkSSk",
    "kSSkPPPPPPPPkSSk",
    "kAAkPPPPPPPPkADk",
    "kAAkPPPPPPPRkADk",
    ".kAAkPPPPPRRkDk.",
    ".kAASSkkkkSSDDk.",
    "..kASSADDDSSDk..",
    "...kkAADDDDkk...",
    ".....kkkkkk.....",
]
MATO = [
    "................", "................", "................", "................", "................",
    ".........MM.....",
    "........MMM.....",
    ".......MNM......",
    "......MMM.......",
    "......M.........",
]
MAR = [
    "................", "................", "................", "................", "................", "................",
    "....MM..MM......",
    "......MM..MM....",
    "....NN..NN......",
    "......NN..NN....",
]
SERTAO = [
    "................", "................", "................", "................", "................",
    ".....M..M..M....",
    "......MMMM......",
    ".....MMNMMM.....",
    ".....MMMMMM.....",
    "......MMMM......",
    ".....M..M..M....",
]
CEU = [
    "................", "................", "................", "................", "................",
    ".......M........",
    "......MMM.......",
    "....MMMNMMM.....",
    "......MMM.......",
    ".....MM.MM......",
]
SERRA = [
    "................", "................", "................", "................", "................",
    ".......NN.......",
    "......MNNM......",
    ".....MMMMMM.....",
    "....MMMMMMMM....",
    "...MMMMMMMMMM...",
]
PELE = {"P": hexa("#f0dcb0"), "Q": hexa("#fcf0d4"), "R": hexa("#d4b888"),
        "S": hexa("#c0c4cc"), "W": hexa("#f0f0f8")}


def pandeiro(nome, aro, motivo, m, n=None):
    A, L, D = tons(aro)
    pal = dict(PELE, A=A, L=L, D=D, M=hexa(m), N=hexa(n or m))
    item(nome, compor(PANDEIRO, motivo), pal)


pandeiro("pandeiro do mato", "#38a048", MATO, "#288838", "#a0e070")
pandeiro("pandeiro do mar", "#3060d0", MAR, "#2858c0", "#78b8f0")
pandeiro("pandeiro do sertão", "#e07830", SERTAO, "#e05828", "#f8e068")
pandeiro("pandeiro do céu", "#68c0f0", CEU, "#3888d8", "#f8f8ff")
pandeiro("pandeiro da serra", "#8890a0", SERRA, "#606878", "#f0f0f8")
A, L, D = tons("#8a5a30")
familia("pandeiro", PANDEIRO, dict(PELE, A=A, L=L, D=D))

# ============================================================ AS BARRACAS
# A de acampamento: lona verde em triângulo, a face da direita na sombra, a
# porta aberta e escura no meio.
BARRACA = [
    ".......kk.......",
    "......kGGk......",
    "......kGGGk.....",
    ".....kGHGGk.....",
    ".....kGHGGGk....",
    "....kGGGGGGk....",
    "....kGGGkkGGk...",
    "...kGGGkOOkGGk..",
    "...kGGGkOOkGGDk.",
    "..kGGGkOOOOkGDk.",
    "..kGGGkOOOOkGDDk",
    ".kGGGGkOOOOkGDDk",
    ".kGGGkOOOOOOkDDk",
    "kGGGGkOOOOOOkDDk",
    "kkkkkkkkkkkkkkkk",
]
G, H, D = tons("#48a050")
item("barraca", BARRACA, {"G": G, "H": clarear(G, 0.5), "D": D, "O": hexa("#2c3c50")})

# A de leilão: a tenda de feira, toldo listrado de vermelho e branco com a
# barra recortada, bandeirinha no mastro e o balcão de madeira embaixo.
LEILAO = [
    ".......kFFFk....",
    ".......kFFFFk...",
    ".......kFFFk....",
    ".kkkkkkkkkkkkkk.",
    ".kRRRWWWRRRWWWk.",
    ".kRRRWWWRRRWWWk.",
    ".kRRRWWWRRRWWWk.",
    ".kRRRWWWRRRWWWk.",
    ".kkRRkWWkRRkWWk.",
    "..kkk.kk.kk.kk..",
    "..k..........k..",
    "..k..........k..",
    ".kkkkkkkkkkkkkk.",
    ".kBBBBBBBBBBBBk.",
    ".kBDBBBBBBBBDDk.",
    ".kkkkkkkkkkkkkk.",
]
B, _, D = tons("#b07840")
item("barraca de leilão", LEILAO, {"R": hexa("#d83838"), "W": BRANCO, "F": hexa("#f8d030"), "B": B, "D": D})

# ============================================================ A CUIA TÉRMICA
# Cuia de chimarrão que é garrafa térmica: corpo de couro marrom com faixas
# de metal em cima e embaixo, a erva verde aparecendo na boca e a bomba de
# metal saindo pra cima e pra direita.
CUIA = [
    "...........kkk..",
    "..........kSWSk.",
    ".........kSWkk..",
    "....kkkkkSWk....",
    "...kEEEEkSkEk...",
    "..kEENEEkkEEEk..",
    "..kkkkkkkkkkkkk.",
    "..kSWSSSSSSSSSk.",
    "..kBHBBBBBBBBDk.",
    "..kBHBBBBBBBBDk.",
    "..kBHBBBBBBBBDk.",
    "...kBHBBBBBBDk..",
    "...kBBBBBBBBDk..",
    "...kSWSSSSSSSk..",
    "....kkkkkkkkk...",
]
B, H, D = tons("#7a4828")
item("cuia térmica", CUIA, {"B": B, "H": clarear(B, 0.45), "D": D, "S": hexa("#b8bcc8"), "W": hexa("#f0f0f8"),
                            "E": hexa("#68a040"), "N": hexa("#98d060")})

# ============================================================ O TROFÉU DE PALLET
# Taça de lata com duas alças, pé fino e base larga.
TROFEU = [
    "................",
    "....kkkkkkkk....",
    ".kkkSSSSSSSSkkk.",
    "kSkSHSSSSSSSSkSk",
    "kSkSHSSSSSSSDkSk",
    "kSkSHSSSSSSSDkSk",
    ".kkSSSSSSSSSDkk.",
    "...kSSSSSSSDDk..",
    "....kSSSSSDDk...",
    ".....kSSSDDk....",
    "......kSSDk.....",
    "......kSSDk.....",
    ".....kkSSDkk....",
    "...kkSSSSSSDkk..",
    "..kSSSSSSSSDDDk.",
    "..kkkkkkkkkkkkk.",
]
S, H, D = tons("#b0b4bc")
item("troféu de pallet", TROFEU, {"S": S, "H": clarear(S, 0.6), "D": D})

# ============================================================ O CRACHÁ DA SILPH
# Cartão branco com a faixa azul em cima, o clipe de metal, a foto raspada em
# cinza e as linhas do nome.
CRACHA = [
    "......kkkk......",
    "......kSWSk.....",
    ".......kSk......",
    "..kkkkkkkkkkkk..",
    ".kBBBBBBBBBBBBk.",
    ".kBBBBBBBBBBBBk.",
    ".kWWWWWWWWWWWWk.",
    ".kWkkkkkWWWWWWk.",
    ".kWkCCCkWLLLLWk.",
    ".kWkCACkWWWWWWk.",
    ".kWkAAAkWLLLWWk.",
    ".kWkkkkkWWWWWWk.",
    ".kWWWWWWWWWWWWk.",
    ".kWWWWWWWWWWWWk.",
    "..kkkkkkkkkkkk..",
]
item("crachá da silph", CRACHA, {"B": hexa("#3868d8"), "W": BRANCO, "S": hexa("#b8bcc8"), "L": hexa("#a8b0c0"),
                                 "C": hexa("#d0d0d8"), "A": hexa("#909098")})

# ============================================================ O AMULETO BRILHANTE
# Medalhão de ouro redondo, com a pedrinha azul no meio e o cordão de couro
# saindo pela argola; uma faísca no canto pra ele brilhar.
AMULETO = [
    "......CCCC......",
    "....CC....CC....",
    "...C........C...",
    "...C........C.W.",
    "....C..kk..C.WWW",
    ".....kkGGkk...W.",
    "....kGGGGGGk....",
    "...kGHGGGGGGk...",
    "..kGHGGkkGGGGk..",
    "..kGGGkPQkGGGk..",
    "..kGGGkPPkGGGk..",
    "..kGGGGkkGGGDk..",
    "..kGGGGGGGGDDk..",
    "...kGGGGGGDDk...",
    "....kGGGGDDk....",
    ".....kkkkkk.....",
]
G, H, D = tons("#e8b830")
item("amuleto brilhante", AMULETO, {"G": G, "H": clarear(G, 0.6), "D": D, "C": hexa("#6a3820"),
                                    "P": hexa("#48a8f0"), "Q": hexa("#d8f4ff"), "W": hexa("#f8f8e0")})
