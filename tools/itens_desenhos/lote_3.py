"""LOTE 3 — os ingredientes do acampamento.

O que o jogador colhe, compra e joga na panela: morango, mel, banana,
presunto, queijo, bacon, pimenta, wasabi, limão, picles, café, jiló,
cogumelo, azeitona e hortelã. E a família "comida", um pratinho genérico
pra ingrediente que ainda não tem desenho.

Comida tem que parecer comida em 16x16: cor viva, silhueta cheia, um
brilho em cima à esquerda e sombra embaixo à direita.
"""
from itens_sprites import item, familia, compor, tons, hexa, clarear, escurecer, BRANCO, CINZA

# ============================================================ MORANGO
MORANGO = [
    "................",
    ".......kk.......",
    "......kLLk......",
    "..kkk.kLLk.kkk..",
    ".kLLLkkLLkkLLLk.",
    ".kLLLLLLLLLLLLk.",
    "..kkLLLkkLLLkk..",
    ".kRRRLLRRRLLRRk.",
    ".kRHRRRSRRRRRRk.",
    ".kHRRSRRRRSRRRk.",
    ".kRRRRRRSRRRRDk.",
    ".kRSRRSRRRRSDDk.",
    "..kRRRRRRSRRDk..",
    "..kRSRRSRRRDDk..",
    "...kRRRRRSDDk...",
    "....kkkkkkkk....",
]
R, H, D = tons("#e83840")
item("morango", MORANGO, {"R": R, "H": clarear(R, 0.5), "D": D, "L": hexa("#48b048"), "S": hexa("#f8f0a0")})

# ============================================================ MEL (pote)
MEL = [
    "................",
    "....kkkkkkkk....",
    "...kTITTTTTTk...",
    "...kTTTTTTTEk...",
    "...kkkkkkkkkk...",
    "....kAAAAAAk....",
    "..kkAAAAAAAAkk..",
    ".kAAHAAAAAAAAAk.",
    ".kAHAAAAAAAAAAk.",
    ".kAAAWWWAWWAAAk.",
    ".kAAAWWAAAWAADk.",
    ".kAAAAAAAAAAADk.",
    ".kAAAAAAAAAADDk.",
    "..kAAAAAAAADDk..",
    "...kkkkkkkkkk...",
]
A, H, D = tons("#f0a020")
T, TH, TE = tons("#a86030")
item("mel", MEL, {"A": A, "H": clarear(A, 0.55), "D": D, "T": T, "I": TH, "E": TE, "W": hexa("#fff8e8")})

# ============================================================ BANANA
BANANA = [
    "................",
    "................",
    "................",
    "..kk.........k..",
    ".kBBk.......kDk.",
    ".kBYYk......kDk.",
    "..kYYYk....kYDk.",
    "..kHYYYkk.kYYYk.",
    "...kHYYYYkYYYDk.",
    "...kYYYYYYYYDDk.",
    "....kYYYYYYDDk..",
    ".....kkYYYDDk...",
    ".......kkkkk....",
]
Y, H, D = tons("#f8d838")
item("banana", BANANA, {"Y": Y, "H": clarear(Y, 0.55), "D": escurecer(Y, 0.25), "B": hexa("#a87838")})

# ============================================================ PRESUNTO
PRESUNTO = [
    "................",
    "................",
    "....kkkkkkkk....",
    "..kkFFFFFFFFkk..",
    ".kFFPPPPPPPPFFk.",
    ".kFPPHPPPPPPPFk.",
    "kFPPHPPPPPPPPPFk",
    "kFPPPPPPFPPPPPFk",
    "kFPPPPPPPFPPPPFk",
    "kFPPPPPPPPPPPDFk",
    "kFPPPPPPPPPPDDFk",
    ".kFPPPPPPPPDDFk.",
    ".kFFPPPPPPDDFFk.",
    "..kkFFFFFFFFkk..",
    "....kkkkkkkk....",
]
P, H, D = tons("#f088a0")
item("presunto", PRESUNTO, {"P": P, "H": clarear(P, 0.5), "D": escurecer(P, 0.2), "F": hexa("#f8e8d8")})

# ============================================================ QUEIJO
QUEIJO = [
    "................",
    "................",
    "..........kkkkk.",
    "......kkkkLLLLk.",
    "..kkkkLLLLLLLLk.",
    ".kLLLLLLLLLLLLk.",
    ".kYYYYYYYYYYYYk.",
    ".kYYOOYYYYYYYYk.",
    ".kYYODYYYYYOOYk.",
    ".kYYYYYYYYYODYk.",
    ".kYYYYYYOOYYYYk.",
    ".kYYYYYYODYYYYk.",
    ".kYYYYYYYYYYYDk.",
    ".kYYYYYYYYYYDDk.",
    ".kkkkkkkkkkkkkk.",
]
Y, L, D = tons("#f8c830")
item("queijo", QUEIJO, {"Y": Y, "L": clarear(Y, 0.45), "D": D, "O": escurecer(Y, 0.15)})

# ============================================================ BACON
BACON = [
    "................",
    "................",
    "................",
    "................",
    ".kk....kk....kk.",
    "kHHk..kHHk..kHHk",
    "kRRHkkHRRHkkHRRk",
    "kFFRHHRFFRHHRFFk",
    "kRRFRRFRRFRRFRRk",
    "kRRRFFRRRRFFRRRk",
    "kFFRRRRFFRRRRFFk",
    "kRRFRRFRRFRRFRRk",
    "kDDRFFRDDRFFRDDk",
    "kkkDRRDkkDRRDkkk",
    "...kDDk..kDDk...",
    "....kk....kk....",
]
R, H, D = tons("#c83838")
item("bacon", BACON, {"R": R, "H": hexa("#e86058"), "D": D, "F": hexa("#f8dcc8")})

# ============================================================ PIMENTA
PIMENTA = [
    "................",
    "...kk...........",
    "..kGGk..........",
    "...kGk..........",
    "...kRGkkk.......",
    "..kRHRRRRk......",
    "..kRHRRRRRk.....",
    "..kRRRRRRRRk....",
    "...kRRRRRRRDk...",
    "....kRRRRRRDDk..",
    ".....kkRRRRDDDk.",
    ".......kkRRDDDk.",
    ".........kkkDDk.",
    "............kk..",
]
R, H, D = tons("#e82828")
item("pimenta", PIMENTA, {"R": R, "H": clarear(R, 0.5), "D": D, "G": hexa("#48a838")})

# ============================================================ WASABI
WASABI = [
    "................",
    "................",
    "..........kk....",
    ".........kWWk...",
    "........kWHWk...",
    "......kkWWWDk...",
    ".....kWHWWWDDk..",
    "....kWWHWWWWWDk.",
    "...kWWWWWWWDDDk.",
    "..kWWHWWWWWWWDk.",
    ".kWWWWWWWWDDDDk.",
    ".kWWWWWWWWWWDDk.",
    ".kWWWWWWWDDDDDk.",
    "..kWWWWWWWWDDk..",
    "...kkkkkkkkkk...",
]
W, H, D = tons("#a8d858")
item("wasabi", WASABI, {"W": W, "H": clarear(W, 0.5), "D": escurecer(W, 0.25)})

# ============================================================ LIMÃO (cortado)
LIMAO = [
    "................",
    ".....kkkkk......",
    "...kkLGGGGkk....",
    "..kGGPPWPPGGk...",
    ".kGPWPPWPPWPGk..",
    ".kGPPWPWPWPPGk..",
    ".kGPPPWWWPPPGk..",
    ".kGWWWWWWWWWGk..",
    ".kGPPPWWWPPPGk..",
    ".kGPPWPWPWPPGk..",
    ".kGPWPPWPPWPDk..",
    "..kGGPPWPPGDk...",
    "...kkGGGDDkk....",
    ".....kkkkk......",
]
G, L, D = tons("#48a838")
item("limão", LIMAO, {"G": G, "L": clarear(G, 0.5), "D": D, "P": hexa("#d0e888"), "W": hexa("#f8f8e0")})

# ============================================================ PICLES
PICLES = [
    "................",
    "...........kkk..",
    "..........kGGGk.",
    ".........kGHGGGk",
    "........kGHGSGGk",
    ".......kGGGGGGk.",
    "......kGSGGSGk..",
    ".....kGGGGGGk...",
    "....kGSGGGGk....",
    "...kGGGGSGk.....",
    "..kGGSGGGk......",
    ".kGGGGGDk.......",
    ".kGSGGDk........",
    ".kGGDDk.........",
    "..kkkk..........",
]
G, H, D = tons("#4a9838")
item("picles", PICLES, {"G": G, "H": clarear(G, 0.4), "D": D, "S": hexa("#b0d868")})

# ============================================================ CAFÉ
CAFE = [
    "....V...V.......",
    ".....V...V......",
    "....V...V.......",
    "..kkkkkkkkk.....",
    ".kWkkkkkkkWk....",
    ".kWkCCCCCkWkkkk.",
    ".kWkCLCCCkWkWWk.",
    ".kWkkkkkkkWk.Wk.",
    ".kWWWWWWWWWk.Wk.",
    ".kWWWWWWWWWkWWk.",
    ".kWWWWWWWWSkkk..",
    "..kWWWWWWSSk....",
    "..kWWWWWSSSk....",
    "...kkkkkkkk.....",
]
item("café", CAFE, {"W": BRANCO, "S": CINZA, "C": hexa("#4a2818"), "L": hexa("#8a5838"), "V": hexa("#d8dce8")})

# ============================================================ JILÓ
JILO = [
    "................",
    ".......kk.......",
    "......kSSk......",
    "...kkkkSSkkkk...",
    "..kLLLLLLLLLLk..",
    ".kkLLLLLLLLLLkk.",
    ".kJLLJJLLJJLLJk.",
    ".kJHJJJJJJJJJDk.",
    ".kHJJJJJJJJJJDk.",
    ".kJJJJJJJJJJDDk.",
    ".kJJJJJJJJJDDDk.",
    "..kJJJJJJJDDDk..",
    "..kJJJJJJDDDDk..",
    "...kJJJJDDDDk...",
    "....kkkkkkkk....",
]
J, H, D = tons("#78b840")
item("jiló", JILO, {"J": J, "H": clarear(J, 0.5), "D": D, "L": hexa("#2e7028"), "S": hexa("#3a8030")})

# ============================================================ COGUMELO
COGUMELO = [
    "................",
    ".....kkkkkk.....",
    "...kkCCCCCCkk...",
    "..kCCHCCPPCCCk..",
    ".kCCHCCCPPCCCCk.",
    ".kCPPCCCCCCCPCDk",
    "kCCPPCCCCCCCCDDk",
    "kCCCCCCCPPCCDDDk",
    ".kkkkkkkkkkkkkk.",
    "....kSSSSSSk....",
    "....kSISSSSk....",
    "....kSSSSSEk....",
    "....kSSSSSEk....",
    "...kSSSSSSEEk...",
    "...kkkkkkkkkk...",
]
C, H, D = tons("#b06030")
S, SH, SD = tons("#f0e0c0")
item("cogumelo", COGUMELO, {"C": C, "H": clarear(C, 0.5), "D": D, "P": hexa("#f8e0b8"), "S": S, "I": SH, "E": SD})

# ============================================================ AZEITONA
AZEITONA = [
    "................",
    "................",
    "......kkkk......",
    "....kkOOOOkk....",
    "...kOOHOOOOOk...",
    "..kOOHOOOOOOOk..",
    "..kOOOOEEEOOOk..",
    ".kOOOOERRREOOOk.",
    ".kOOOOERIREOODk.",
    ".kOOOOERRREODDk.",
    "..kOOOOEEEODDk..",
    "..kOOOOOOODDDk..",
    "...kOOOOODDDk...",
    "....kkOODDkk....",
    "......kkkk......",
]
O, H, D = tons("#7a9a30")
item("azeitona", AZEITONA, {"O": O, "H": clarear(O, 0.5), "D": D, "R": hexa("#e83030"), "I": hexa("#f87068"), "E": hexa("#a02020")})

# ============================================================ HORTELÃ
HORTELA = [
    "................",
    "................",
    "...kk.....kk....",
    "..kMMk...kMMk...",
    ".kMHMMk.kMHMMk..",
    ".kMMMMMkMMMMMk..",
    "kMMVMMMkMMMVMMk.",
    "kMMMVMMkMMVMMMk.",
    "kMMMMVMkMVMMMMk.",
    ".kMMMMVkVMMMMk..",
    "..kMMMVkVMMMk...",
    "...kkkkVkkkk....",
    "......kVk.......",
    "......kVk.......",
    "......kkk.......",
]
M, H, D = tons("#40b848")
item("hortelã", HORTELA, {"M": M, "H": clarear(M, 0.55), "V": hexa("#207830")})

# ============================================================ FAMÍLIA: COMIDA (pratinho)
COMIDA = [
    "................",
    "................",
    "................",
    "......kkkk......",
    "....kkFFFFkk....",
    "...kFFHFFFFFk...",
    "..kFFHFFFFFFFk..",
    "..kFFFFFFFFFFk..",
    "..kFFFFFFFFFDk..",
    "kkkFFFFFFFFDDkkk",
    "kWWkkkkkkkkkkWWk",
    "kWWWWWWWWWWWWWSk",
    ".kWWWWWWWWWWSSk.",
    "..kkkkkkkkkkkk..",
]
F, H, D = tons("#d88040")
familia("comida", COMIDA, {"F": F, "H": clarear(F, 0.5), "D": D, "W": BRANCO, "S": CINZA})
