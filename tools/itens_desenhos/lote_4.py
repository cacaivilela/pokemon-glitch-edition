"""LOTE 4 — os aparelhos e os papéis do enredo, mais as famílias 'bilhete' e
'item' (a sacolinha de quem não tem desenho).

Tema glitch: roxo/magenta com ruído ciano. O ruído aqui não é o RUIDO inteiro
por cima de tudo (ele furaria o contorno): `ruido_em` deixa só os pixels que
caem em cima do corpo do aparelho.
"""
from itens_sprites import item, familia, compor, tons, hexa, clarear, escurecer, BRANCO, CINZA, RUIDO

CIANO = hexa("#40f0e0")
MAGENTA = hexa("#f040c0")


def ruido_em(base, letras):
    """Só os pixels do RUIDO que caem em cima dessas letras da base — o
    contorno e o fundo ficam inteiros."""
    fundo = compor(base)
    saida = []
    for y, linha in enumerate(compor(RUIDO)):
        saida.append("".join(ch if ch != "." and fundo[y][x] in letras else "."
                             for x, ch in enumerate(linha)))
    return saida


# ============================================================ GLITCHBOOSTER
# caixinha roxa: tela com uma onda magenta, dois botões, ruído ciano
BOOSTER = [
    "................",
    ".kkkkkkkkkkkkkk.",
    "kPHPPPPPPPPPPPPk",
    "kPkkkkkkkkkkkkPk",
    "kPkSSSSSSSSSSkPk",
    "kPkLSMMSSSMMSkPk",
    "kPkSMSSMSMSSMkPk",
    "kPkSSSSSMSSSSkPk",
    "kPkSSSSSSSSSSkPk",
    "kPkkkkkkkkkkkkPk",
    "kPPPPPPPPPPPPPPk",
    "kPkkkPPPPPPkkkPk",
    "kPkMkPPPPPPkGkPk",
    "kDkkkPPPPPPkkkDk",
    ".kkkkkkkkkkkkkk.",
]
P, H, D = tons("#8040c0")
item("glitchbooster", compor(BOOSTER, ruido_em(BOOSTER, "PS")),
     {"P": P, "H": H, "D": D, "S": hexa("#1c1030"), "L": hexa("#c0a0f0"), "M": MAGENTA, "G": CIANO})

# ============================================================ VISOR G.L.I.T.C.H
# óculos de proteção: tira roxa em cima, duas lentes ciano-esverdeadas
VISOR = [
    "................",
    "................",
    ".kkkkkkkkkkkkkk.",
    "kTHTTTTTTTTTTTTk",
    "kTTTTTTTTTTTTTTk",
    "kkkkkkkkkkkkkkkk",
    ".kLLCCCkkLLCCCk.",
    ".kLCCCCkkLCCCCk.",
    ".kCCCCCkkCCCCCk.",
    ".kCCCCCkkCCCCCk.",
    ".kCCCCDkkCCCCDk.",
    ".kkCCDkkkkCCDkk.",
    "..kkkkk..kkkkk..",
]
T, H, _ = tons("#503878")
item("visor-g.l.i.t.c.h", VISOR,
     {"T": T, "H": H, "C": hexa("#40e0c0"), "L": hexa("#b0fff0"), "D": hexa("#208070")})

# ============================================================ DECODIFICADOR DE GENOMA
# máquina cinza, tela escura com a dupla hélice (verde e rosa) e dois leds
GENOMA = [
    "................",
    ".kkkkkkkkkkkkkk.",
    "kMHMMMMMMMMMMMMk",
    "kMkkkkkkkkkkkkMk",
    "kMkSSArrrrBSSkMk",
    "kMkSSSArrBSSSkMk",
    "kMkSSSSABSSSSkMk",
    "kMkSSSSBASSSSkMk",
    "kMkSSSBrrASSSkMk",
    "kMkSSBrrrrASSkMk",
    "kMkSSSBrrASSSkMk",
    "kMkkkkkkkkkkkkMk",
    "kMRRMMMMMMMMYYMk",
    "kDMMMMMMMMMMMDDk",
    ".kkkkkkkkkkkkkk.",
]
M, H, D = tons("#a8a8b8")
item("decodificador de genoma", GENOMA,
     {"M": M, "H": H, "D": D, "S": hexa("#182030"), "A": hexa("#58e858"), "B": hexa("#f060a8"),
      "r": hexa("#4a6080"), "R": hexa("#e04848"), "Y": hexa("#f8d030")})

# ============================================================ CATÁLOGO ROTOM
# o aparelho laranja com a carinha: dois olhos azuis e um sorriso na tela
ROTOM = [
    "................",
    "..kkkkkkkkkkkk..",
    ".kOHOOOOOOOOOOk.",
    ".kOkkkkkkkkkkOk.",
    ".kOkSSSSSSSSkOk.",
    ".kOkSWESSWESkOk.",
    ".kOkSEESSEESkOk.",
    ".kOkSSSSSSSSkOk.",
    ".kOkSBSSSSBSkOk.",
    ".kOkSSBBBBSSkOk.",
    ".kOkkkkkkkkkkOk.",
    ".kOOOOOOOOOOOOk.",
    ".kOOOAAAAOOOOOk.",
    ".kDOOOOOOOOODDk.",
    "..kkkkkkkkkkkk..",
]
O, H, D = tons("#f08030")
item("catálogo rotom", ROTOM,
     {"O": O, "H": H, "D": D, "S": hexa("#f8f0d8"), "E": hexa("#3878e8"), "W": BRANCO,
      "B": hexa("#2050b0"), "A": escurecer(O, 0.45)})

# ============================================================ GUIA DO VOID
# livro fechado, capa roxa quase preta, lombada, um olho prateado na capa
GUIA = [
    "................",
    "..kkkkkkkkkkkk..",
    ".kBBVVVVVVVVVVk.",
    ".kBBVHVVVVVVVVk.",
    ".kBBVVVVVVVVVVk.",
    ".kBBVVVSSSVVVVk.",
    ".kBBVVSVVVSVVVk.",
    ".kBBVVSVSVSVVVk.",
    ".kBBVVSVVVSVVVk.",
    ".kBBVVVSSSVVVVk.",
    ".kBBVVVVVVVVVVk.",
    ".kBBVVVVVVVVVDk.",
    ".kBBVVVVVVVVDDk.",
    ".kBBPPPPPPPPPPk.",
    "..kkkkkkkkkkkk..",
]
V = hexa("#46286a")
item("guia do void", GUIA,
     {"V": V, "H": hexa("#6a4890"), "B": hexa("#301a48"), "D": hexa("#341c50"),
      "S": hexa("#d0d0e0"), "P": hexa("#c8c0d8")})

# ============================================================ REGISTRO 0x3f
# folha branca com canto dobrado, linhas de texto e o canto de baixo corrompido
REGISTRO = [
    "................",
    "..kkkkkkkkkk....",
    "..kWWWWWWWWkk...",
    "..kWWWWWWWWkFk..",
    "..kWWWWWWWWkkkk.",
    "..kWLLLLLLWWWWk.",
    "..kWWWWWWWWWWWk.",
    "..kWLLLLLLLLLWk.",
    "..kWWWWWWWWWWWk.",
    "..kWLLLLLLLWWWk.",
    "..kWWWWWWWWWWGk.",
    "..kWLLLLWWWWMGk.",
    "..kWWWWWWWGMGMk.",
    "..kWWWWWWMGMGGk.",
    "..kkkkkkkkkkkkk.",
]
item("registro 0x3f", REGISTRO,
     {"W": BRANCO, "L": hexa("#a0a0b0"), "F": hexa("#d8d8e0"), "M": MAGENTA, "G": CIANO})


# ============================================================ OS BILHETES
def bilhete(fundo, brilho, sombra, marca):
    """Ticket deitado: parte grande à esquerda, picote tracejado, canhoto com
    duas marquinhas à direita."""
    linhas = [
        "................",
        "................",
        ".kkkkkkkkkkkkkk.",
        f"k{brilho}{fundo*9}k{fundo*3}k",
        f"k{fundo*14}k",
        f"k{fundo*10}k{fundo*3}k",
        f"k{fundo*11}{marca*2}{fundo}k",
        f"k{fundo*10}k{fundo*3}k",
        f"k{fundo*14}k",
        f"k{fundo*10}k{marca*2}{fundo}k",
        f"k{fundo*14}k",
        f"k{fundo*10}k{fundo*3}k",
        f"k{sombra}{fundo*12}{sombra}k",
        ".kkkkkkkkkkkkkk.",
    ]
    return linhas


AVIAO = [
    "................", "................", "................", "................",
    ".....W..........",
    ".....W..........",
    "....WWW.........",
    ".WWWWWWW........",
    ".....W..........",
    ".....W..........",
    "...WWWWW........",
]
B, H, D = tons("#78c0f0")
item("bilhete voo", compor(bilhete("B", "H", "D", "N"), AVIAO),
     {"B": B, "H": H, "D": D, "N": hexa("#3878b8"), "W": BRANCO})

# a aurora: uma faixa diagonal verde -> azul -> roxo na parte grande do ticket
AURORA = []
for y in range(16):
    linha = ""
    for x in range(16):
        d = x + y
        if 3 <= y <= 12 and 1 <= x <= 10 and 7 <= d <= 15:
            linha += "GGGBBBVVV"[d - 7]
        else:
            linha += "."
    AURORA.append(linha)
ESTRELAS = [
    "................", "................", "................", "................",
    "..W.............",
    "................", "................", "................", "................", "................",
    ".........W......",
]
P, H, D = tons("#ece4f8")
item("bilhete aurora", compor(bilhete("P", "H", "D", "N"), AURORA, ESTRELAS),
     {"P": P, "H": BRANCO, "D": D, "N": hexa("#7060a0"), "G": hexa("#48e090"), "B": hexa("#4890f0"),
      "V": hexa("#9050d8"), "W": BRANCO})

LINHAS_BILHETE = [
    "................", "................", "................", "................", "................",
    "..LLLLLL........",
    "................",
    "..LLLLLLLL......",
    "................",
    "..LLLLL.........",
]
B, H, D = tons("#e8d8b0")
familia("bilhete", compor(bilhete("B", "H", "D", "N"), LINHAS_BILHETE),
        {"B": B, "H": H, "D": D, "N": hexa("#a89870"), "L": hexa("#b0a080")})

# ============================================================ A SACOLINHA
# o ícone de qualquer item sem desenho: bolsinha marrom, cordão amarrando o
# pescoço e uma ponta solta caindo pela direita
SACOLA = [
    "................",
    "....kk..kk......",
    "...kBBkkBBk.....",
    "...kBBBBBBk.....",
    "...kCCCCCCkCk...",
    "...kBBBBBBkkCk..",
    "..kBHBBBBBBkCk..",
    ".kBBHBBBBBBBkk..",
    "kBBHBBBBBBBBBBk.",
    "kBBBBBBBBBBBBBk.",
    "kBBBBBBBBBBBBBk.",
    "kBBBBBBBBBBBBDk.",
    "kBBBBBBBBBBBDDk.",
    ".kBBBBBBBBBDDk..",
    "..kkBBBBBDDkk...",
    "....kkkkkkk.....",
]
B, H, D = tons("#a06838")
familia("item", SACOLA, {"B": B, "H": H, "D": D, "C": hexa("#e8c060")})
