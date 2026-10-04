"""LOTE 1: os fósseis da mina, a picareta, as pepitas e a estrela.

Todo fóssil é a mesma ROCHA bege com um motivo escuro gravado por cima
(compor(ROCHA, MOTIVO)); o âmbar é a exceção, uma gota alaranjada com um
insetinho preto dentro. A família "fossil" é a rocha lisa, pra fóssil novo
sem desenho.
"""
from itens_sprites import item, familia, compor, tons, hexa, clarear, escurecer, BRANCO, CINZA

# ============================================================ A ROCHA
ROCHA = [
    "................",
    "....kkkkkkk.....",
    "..kkRRRRRRRkk...",
    ".kRLLRRRRRRRRk..",
    ".kRLRRRRRRRRRRk.",
    "kRRRRRRRRRRRRRRk",
    "kRRRRRRRRRRRRRRk",
    "kRRRRRRRRRRRRRSk",
    "kRRRRRRRRRRRRRSk",
    "kRRRRRRRRRRRRSSk",
    "kRRRRRRRRRRRSSSk",
    ".kRRRRRRRRRRSSk.",
    ".kSRRRRRRRSSSSk.",
    "..kkSSSSSSSSkk..",
    "....kkkkkkkk....",
]
R, L, S = tons("#d8c098")
M = hexa("#5a4030")          # o motivo gravado
N = hexa("#9a7a58")          # o meio-tom do motivo (nervura da pena, brilho da garra)
PALETA_ROCHA = {"R": R, "L": L, "S": S, "M": M, "N": N}


def fossil(nome, motivo):
    item(nome, compor(ROCHA, motivo), PALETA_ROCHA)


# a espiral da concha
HELIX = [
    "................", "................", "................",
    ".....MMMMMM.....",
    "....M......M....",
    "...M...MM...M...",
    "...M..M..M..M...",
    "...M.M....M.M...",
    "...M.M.M..M.M...",
    "...M.M..MM..M...",
    "...M..M....M....",
    "....M..MMMM.....",
]
# a cúpula com sulcos radiais
DOMO = [
    "................", "................", "................", "................",
    ".....MMMMMM.....",
    "....M.M..M.M....",
    "...M..M..M..M...",
    "...M..M..M..M...",
    "..M..M....M..M..",
    "..M..M....M..M..",
    "..MMMMMMMMMMMM..",
]
# as raízes ramificadas
RAIZ = [
    "................", "................", "................",
    ".......M........",
    ".......M........",
    "......MMM.......",
    ".....M...M......",
    "....M.M.M.M.....",
    "...M..M.M..M....",
    "..M..M...M..M...",
    "..M..M...M...M..",
]
# a garra curva, grossa na base e afiada na ponta
GARRA = [
    "................", "................", "................",
    "....MMMM........",
    "...MMMMMMM......",
    "..MMM..MMMM.....",
    "..MMM....MMM....",
    "..MMM.....MMM...",
    "...MM......MMM..",
    "............MM..",
    "............MM..",
    "...........MM...",
    "..........MM....",
]
# o crânio: olhos vazados e dentes
CRANIO = [
    "................", "................", "................",
    ".....MMMMMM.....",
    "....MMMMMMMM....",
    "...MMMMMMMMMM...",
    "...M..MMMM..M...",
    "...M..MMMM..M...",
    "...MMMMMMMMMM...",
    "....MMMMMMMM....",
    ".....M.M.M.M....",
]
# o escudo com a cruz
ESCUDO = [
    "................", "................", "................",
    "....MMMMMMMM....",
    "....M..MM..M....",
    "....M..MM..M....",
    "....MMMMMMMM....",
    "....M..MM..M....",
    ".....M.MM.M.....",
    "......MMMM......",
    ".......MM.......",
]
# o casco oval com sulcos
CASCO = [
    "................", "................", "................", "................",
    ".....MMMMMM.....",
    "...MM.M..M.MM...",
    "..M..MMMMMM..M..",
    "..MMMM....MMMM..",
    "..M..MMMMMM..M..",
    "...MM.M..M.MM...",
    ".....MMMMMM.....",
]
# a pena na diagonal, com a nervura clara
PLUMA = [
    "................", "................", "................",
    "...........MM...",
    "..........MMMM..",
    ".........MMNMM..",
    "........MMNMM...",
    ".......MMNMM....",
    "......MMNMM.....",
    ".....MMNMM......",
    ".....MNM........",
    ".....M..........",
    "....M...........",
]
# a fúrcula: o osso em V da asa
AVE = [
    "................", "................", "................",
    "...MMM....MMM...",
    "...MMM....MMM...",
    "....MM....MM....",
    "....MM....MM....",
    ".....MM..MM.....",
    "......MMMM......",
    ".......MM.......",
    ".......MM.......",
    "......MMMM......",
]
# o esqueleto de peixe: cabeça, espinha, costelas, cauda
PEIXE = [
    "................", "................", "................", "................", "................",
    "...MM.........M.",
    "..M.MM.M.M.M.M..",
    "..MMMMMMMMMMM...",
    "..MMMM.M.M.M.M..",
    "...MM.........M.",
]
# o chifre de dragão, grosso embaixo, com anéis
DRAGAO = [
    "................", "................", "................",
    "............M...",
    "...........MM...",
    "..........MMM...",
    ".........MMM....",
    "........MNMM....",
    "......MMMMNM....",
    "....MMNMMM......",
    "...MMMMNMM......",
    "...MMMMMM.......",
    "....MMMM........",
]

fossil("fóssil hélix", HELIX)
fossil("fóssil domo", DOMO)
fossil("fóssil raiz", RAIZ)
fossil("fóssil garra", GARRA)
fossil("fóssil crânio", CRANIO)
fossil("fóssil escudo", ESCUDO)
fossil("fóssil casco", CASCO)
fossil("fóssil pluma", PLUMA)
fossil("fóssil de ave", AVE)
fossil("fóssil de peixe", PEIXE)
fossil("fóssil de dragão", DRAGAO)
familia("fossil", ROCHA, PALETA_ROCHA)

# ============================================================ O ÂMBAR
AMBAR = [
    "................",
    "......kkkk......",
    "....kkAAAAkk....",
    "...kAHAAAAAAk...",
    "..kAHAAAAAAAAk..",
    ".kAHAAAAAAAAAAk.",
    ".kAAAAAAAAAAAADk",
    "kAAAAAAAAAAAAADk",
    "kAAAAAAAAAAAADDk",
    "kAAAAAAAAAAAADDk",
    ".kAAAAAAAAAADDk.",
    ".kAAAAAAAAADDDk.",
    "..kAAAAAAADDDk..",
    "...kkAAADDDkk...",
    ".....kkkkkk.....",
]
INSETO = [
    "................", "................", "................", "................", "................", "................",
    "......k..k......",
    ".......kk.......",
    ".....k.kk.k.....",
    "......kkkk......",
    ".....k.kk.k.....",
    "......k..k......",
]
A, H, D = tons("#f0a038")
item("âmbar velho", compor(AMBAR, INSETO), {"A": A, "H": hexa("#ffe8a0"), "D": escurecer(A, 0.25)})

# ============================================================ A PICARETA
PICARETA = [
    "................",
    ".....kk.........",
    "....kSSkk.......",
    "....kHSSSkk.....",
    ".....kkSSSSkk...",
    "......kkkSSSSk..",
    ".....kWWkkSSSSk.",
    "....kWWk..kSSSk.",
    "...kWWk....kSSk.",
    "..kWWk......kkk.",
    ".kWWk...........",
    ".kWWk...........",
    ".kkkk...........",
]
W = hexa("#b07840")
Sm, Hm, Dm = tons("#b0b8c8")
item("picareta", PICARETA, {"W": W, "S": Sm, "H": hexa("#eef4fa"), "D": Dm})

# ============================================================ AS PEPITAS
PEPITA = [
    "................", "................", "................", "................",
    ".....kkkk.......",
    "....kGHGGkk.....",
    "...kGHGGGGGk....",
    "..kGGGGGGGGGk...",
    "..kGGGGGGGGDk...",
    "..kGGGGGGGDDk...",
    "...kGGGGGDDk....",
    "....kkkkkkk.....",
]
PEPITA_GRANDE = [
    "................",
    "....kkkk.kkk....",
    "..kkGGGGkGGGkk..",
    ".kGHHGGGGGGGGGk.",
    ".kGHGGGGGGGGGGk.",
    "kGGGGGGGGGGGGGGk",
    "kGGGGGGGGGGGGGDk",
    "kGGGGGGDGGGGGDDk",
    "kGGGGGGGGGGGDDDk",
    ".kGGGGGGGGGDDDk.",
    ".kGGGGGGGGGDDDk.",
    "..kGGGGGGGDDDk..",
    "..kkGGGDDDDDkk..",
    "....kkkkkkkk....",
]
G, Hg, Dg = tons("#f0c030")
item("pepita", PEPITA, {"G": G, "H": hexa("#fff0a0"), "D": Dg})
item("pepita grande", PEPITA_GRANDE, {"G": G, "H": hexa("#fff0a0"), "D": Dg})

# ============================================================ A ESTRELA
ESTRELA = [
    "................",
    ".......k........",
    "......kYk.......",
    "......kYk.......",
    ".....kHYYk......",
    ".kkkkkHYYkkkkk..",
    "kYYYHHYYYYYYYYk.",
    ".kkYYYYYYYYYkk..",
    "...kYYYYYYYk....",
    "...kYYYYYYYk....",
    "..kYYYYkYYYYk...",
    "..kYYYk.kYYYk...",
    ".kYYk.....kYYk..",
    ".kkk.......kkk..",
]
Y, Hy, Dy = tons("#f8d030")
item("estrela", ESTRELA, {"Y": Y, "H": hexa("#fff8c0"), "D": Dy})
