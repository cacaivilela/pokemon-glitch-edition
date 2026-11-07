"""LOTE 7 — as 20 BERRIES (src/data/pokeblocos.js: CHERI até STARF).

Cada uma com o formato da berry de verdade, em 16x16: a CHERI são duas
cerejinhas, a PECHA um pêssego, a NANAB um cacho de banana, a PINAP um
abacaxi, a PETAYA uma pitaya, a STARF uma estrela... A cor de base é a do
liquidificador (BERRIES_SABOR.cor), com brilho em cima à esquerda e sombra
embaixo à direita, como a comida do lote 3.

Letras: k contorno, B base, H brilho, D sombra, L folha, M folha escura,
S cabinho, W/P/O detalhes de cada uma.
"""
from itens_sprites import item, hexa, clarear, escurecer, tons

FOLHA = hexa("#48b048")
FOLHA_ESC = escurecer(FOLHA, 0.3)
CABO = hexa("#7a5a30")


def berry(nome, linhas, cor, **extra):
    b, h, d = tons(cor)
    pal = {"B": b, "H": clarear(b, 0.5), "D": d, "L": FOLHA, "M": FOLHA_ESC, "S": CABO}
    pal.update({k: (hexa(v) if isinstance(v, str) else v) for k, v in extra.items()})
    item(nome, linhas, pal)


# ------------------------------------------------- CHERI: duas cerejinhas
berry("cheri berry", [
    "................",
    "................",
    ".........kkk....",
    "........kLLLk...",
    ".......SSkkk....",
    "......S..S......",
    ".....S....S.....",
    "..kkSk....kSkk..",
    ".kBBBBk..kBBBBk.",
    "kBHHBBBkkBHHBBBk",
    "kBHBBBBkkBHBBBBk",
    "kBBBBBDkkBBBBBDk",
    "kBBBBDDkkBBBBDDk",
    ".kBBDDk..kBBDDk.",
    "..kkkk....kkkk..",
    "................",
], "#e8403c", S=FOLHA_ESC)

# ------------------------------------------------- CHESTO: dura, de chapéu de folha
berry("chesto berry", [
    "................",
    "......kkkk......",
    "....kkLLLLkk....",
    "...kLLMLLMLLk...",
    "..kLMkLLLLkMLk..",
    "..kkkBkkkkBkkk..",
    "..kBBBBBBBBBBk..",
    ".kBHHBBBBPBBBBk.",
    ".kBHBBPBBBBBBBk.",
    ".kBBBBBBBBBPBDk.",
    ".kBBPBBBBBBBBDk.",
    ".kBBBBBBPBBBDDk.",
    "..kBBBBBBBBDDk..",
    "...kBBBPBDDDk...",
    "....kkkkkkkk....",
    "................",
], "#8a5ad0", P="#5a3a98")

# ------------------------------------------------- PECHA: pêssego
berry("pecha berry", [
    "................",
    "..........kkk...",
    ".........kLLLk..",
    "........SkLMk...",
    "...kkkk.Skkkk...",
    "..kBHHBkkBBBBk..",
    ".kBHHBBBCBBBBBk.",
    ".kBHBBBBCBBBBBk.",
    ".kBBBBBBCBBBBDk.",
    ".kBBBBBBBCBBBDk.",
    ".kBBBBBBBCBBDDk.",
    "..kBBBBBBCBDDk..",
    "...kBBBBBBDDk...",
    "....kkBBDDkk....",
    "......kkkk......",
    "................",
], "#f49ac0", C="#d06890")

# ------------------------------------------------- RAWST: bolota no meio das folhas
berry("rawst berry", [
    "................",
    "......k..k......",
    ".....kLkkLk.....",
    "..k.kLLkLLLk.k..",
    ".kLkLLMLLMLLkLk.",
    ".kLLLMLLLLMLLLk.",
    "..kLLLLLLLLLLk..",
    ".kLLMBBBBBBMLLk.",
    "kLLkBHHBBBBBkLLk",
    ".kkBHBBBBBBBBkk.",
    "..kBBBBBBBBBDk..",
    "..kBBBBBBBBBDk..",
    "...kBBBBBBBDk...",
    "....kBBBBDDk....",
    ".....kkkkkk.....",
    "................",
], "#a8e070", L="#4aa848", M="#2e7a34")

# ------------------------------------------------- ASPEAR: pera
berry("aspear berry", [
    "................",
    ".......kk.......",
    ".......kSk......",
    "......kkSkkk....",
    ".....kBBkLLLk...",
    ".....kHBBkkk....",
    "....kBHBBBk.....",
    "....kBHBBBk.....",
    "...kBHBBBBBk....",
    "..kBHBBBBBBBk...",
    ".kBHBBBBBBBBBk..",
    ".kBHBBBBBBBBDk..",
    ".kBBBBBBBBBBDk..",
    "..kBBBBBBBBDDk..",
    "...kkDDDDDDkk...",
    ".....kkkkkk.....",
], "#f0d040")

# ------------------------------------------------- LEPPA: vermelha em cima, creme embaixo
berry("leppa berry", [
    "................",
    "........kk......",
    "........kSk.....",
    "........kSkkkk..",
    "....kkkkkSLLMk..",
    "..kkBBBBBkkkk...",
    ".kBHHBBBBBBBBk..",
    ".kBHBBBBBBBBBBk.",
    "kBHBBBBBBBBBBBDk",
    "kOOBBOBBBOBBOBDk",
    "kOOOOOOOOOOOOOEk",
    "kOOOOOOOOOOOOEEk",
    ".kOOOOOOOOOOEEk.",
    "..kkOOOOOOEEkk..",
    "....kkkkkkkk....",
    "................",
], "#d8483a", O="#f0d8a8", E="#c8a878")

# ------------------------------------------------- ORAN: azul, duas folhas
berry("oran berry", [
    "................",
    "..kkk......kkk..",
    ".kLLLkk..kkLLLk.",
    "..kMLLLkkLLLMk..",
    "...kkkMSSMkkk...",
    "....kkkSSkkk....",
    "..kkBBBBBBBBkk..",
    ".kBHHBBBBBBBBBk.",
    "kBHHBBBBBBBBBBDk",
    "kBHBBBBBBBBBBBDk",
    "kBBBBBBBBBBBBDDk",
    "kBBBBBBBBBBBBDDk",
    ".kBBBBBBBBBBDDk.",
    "..kkBBBBBBDDkk..",
    "....kkkkkkkk....",
    "................",
], "#4a7ad8")

# ------------------------------------------------- PERSIM: caqui com a coroa verde
berry("persim berry", [
    "................",
    "................",
    "......kkkk......",
    "..kkkkLSSLkkkk..",
    ".kLLLLMSSMLLLLk.",
    "..kkkLLMMLLkkk..",
    "..kBBkkLLkkBBk..",
    ".kBHHBBkkBBBBBk.",
    "kBHHBBBBBBBBBBDk",
    "kBHBBBBBBBBBBBDk",
    "kBBBBBBBBBBBBDDk",
    "kBBBBBBBBBBBBDDk",
    ".kBBBBBBBBBBDDk.",
    "..kkBBBBBBDDkk..",
    "....kkkkkkkk....",
    "................",
], "#f0889a")

# ------------------------------------------------- LUM: cacho de bolinhas
berry("lum berry", [
    "................",
    ".......kk.......",
    "......kSSk......",
    "....kkkkkkkk....",
    "...kBHBkkHBBk...",
    "..kBHBBDkBBBDk..",
    "..kBBBDkBBBBDk..",
    ".kkkDDkHBBBDDkk.",
    "kBHBkkHBBBBDkBBk",
    "kHBBDkBBBBDkHBDk",
    "kBBBDDkDDDkBBBDk",
    ".kBDDkHBBBkkBDDk",
    "..kkkBHBBBDkDDk.",
    "....kBBBBDDkkk..",
    ".....kkDDDkk....",
    ".......kkk......",
], "#8ad860")

# ------------------------------------------------- SITRUS: grandona, casca de laranja
berry("sitrus berry", [
    "................",
    ".......kkk......",
    "......kLLMk.....",
    "....kkkSkkkk....",
    "..kkBBBBBBBBkk..",
    ".kBHHBBBBBBBBBk.",
    "kBHHBBBPBBBBPBDk",
    "kBHBBPBBBBBBBBDk",
    "kBBBBBBBBPBBBBDk",
    "kBPBBBBBBBBBPDDk",
    "kBBBBBPBBBBBBDDk",
    "kBBBBBBBBBPBDDDk",
    ".kBBPBBBBBBBDDk.",
    "..kkBBBBBBDDkk..",
    "....kkkkkkkk....",
    "................",
], "#f0c838", P="#d8a020")

# ------------------------------------------------- FIGY: vermelha cheia de pontinhas
berry("figy berry", [
    "................",
    ".......kk.......",
    "......kSSk......",
    "...k..kkkk..k...",
    "...kkkBBBBkkk...",
    "..kBHBBBBBBBBk..",
    ".kkHHBBPBBBPBkk.",
    "kBHBBPBBBBBBBBDk",
    ".kHBBBBBPBBBBDk.",
    "kBBBPBBBBBBPBDDk",
    ".kBBBBBPBBBBBDk.",
    "kBBBBBBBBBPBDDDk",
    ".kkBBPBBBBBBDkk.",
    "..kBBBBBBBBDDk..",
    "...kkkBBDDkkk...",
    "...k..kkkk..k...",
], "#c8402c", P="#f08060")

# ------------------------------------------------- NANAB: cacho de banana de ponta rosa
berry("nanab berry", [
    "................",
    "......kkk.......",
    "......kSk.......",
    ".....kkSkk......",
    "....kBkSkBk.....",
    "...kBHkBkBBk....",
    "...kBHkBkBBDk...",
    "..kBHBkHBkBBDk..",
    "..kBHBkHBkBBDk..",
    "..kBHBkHBkBBBDk.",
    "..kBBBkBBkkBBDk.",
    "..kBBBkkBBkkBDDk",
    "..kPBBDkkBBDkDPk",
    "...kPPDkkkPPkPk.",
    "....kkk...kkkk..",
    "................",
], "#f0d860", P="#f07898")

# ------------------------------------------------- PINAP: abacaxi
berry("pinap berry", [
    "......k..k......",
    "...k.kLkkLk.k...",
    "..kLkkLMLLkkLk..",
    "...kLLMLLMLLk...",
    "....kkLMMLkk....",
    "....kkkkkkkk....",
    "..kkBBDBBDBBkk..",
    ".kBHHDBBDBBDBBk.",
    "kBHDBBDBBDBBDBDk",
    "kBDHBDBBDBBDBDDk",
    "kDBBDBBDBBDBBDDk",
    "kBBDBBDBBDBBDBDk",
    ".kDBBDBBDBBDBDk.",
    "..kkBBDBBDBDkk..",
    "....kkkkkkkk....",
    "................",
], "#e8d040")

# ------------------------------------------------- LIECHI: lichia vermelha de desenho branco
berry("liechi berry", [
    "................",
    ".......kk.......",
    "......kSSk......",
    "....kkkkkkkk....",
    "..kkBBWBBWBBkk..",
    ".kBHWBBWBBWBBBk.",
    "kBHBBWBBWBBWBBDk",
    "kBWBBBWBBWBBWBDk",
    "kBBWBBBWBBWBBBDk",
    "kBBBWBBBWBBWBDDk",
    "kBWBBWBBBWBBWDDk",
    "kBBWBBWBBBWBDDDk",
    ".kBBWBBWBBBWDDk.",
    "..kkBBBWBBDDkk..",
    "....kkkkkkkk....",
    "................",
], "#e83848", W="#f8d0d8")

# ------------------------------------------------- GANLON: casca dura, faixa clara
berry("ganlon berry", [
    "................",
    ".......kk.......",
    "......kSSk......",
    "....kkkkkkkk....",
    "...kBBBBBBBBk...",
    "..kBHHBBBBBBBk..",
    ".kBHBBBBBBBBBDk.",
    ".kWWBBWWBBWWBWk.",
    ".kBWWWWWWWWWWBk.",
    ".kBBBWBBBWBBBDk.",
    ".kBBBBBBBBBBBDk.",
    ".kBBBBBBBBBBDDk.",
    "..kBBBBBBBBDDk..",
    "...kBBBBBDDDk...",
    "....kkkkkkkk....",
    "................",
], "#4a4ab0", W="#c8c8f0")

# ------------------------------------------------- SALAC: gota verde de gomos
berry("salac berry", [
    "......k.k.k.....",
    ".....kLkLkLk....",
    "....kLMLMLMLk...",
    "...kkkkkkkkkkk..",
    "..kBHBPBBPBBBDk.",
    ".kBHHBPBBPBBBDDk",
    ".kBHBBPBBPBBBDDk",
    ".kBHBBPBBPBBDDDk",
    ".kBBBBPBBPBBDDk.",
    "..kBBBPBBPBBDDk.",
    "..kBBBPBBPBDDk..",
    "...kBBBPBPBDDk..",
    "...kBBBPBPDDk...",
    "....kBBBPDDk....",
    ".....kkBDkk.....",
    ".......kk.......",
], "#48b058", P="#a0e098")

# ------------------------------------------------- PETAYA: pitaya de escama de ponta verde
berry("petaya berry", [
    ".......k........",
    "......kLk.......",
    "...k..kLk..k....",
    "..kLk.kkk.kLk...",
    "...kkkBBBkkk....",
    "..kBHBBLBBBBk...",
    ".kBHHBkBBBLBBk..",
    "kLkBBBBBLkBBBkLk",
    ".kBHBLkBBBBBDk..",
    ".kBBBBBBLkBBDk..",
    "kLkBLkBBBBBDDkLk",
    ".kBBBBBLkBBDDk..",
    "..kBBBBBBBDDk...",
    "..kLkBBBBDDkLk..",
    "...k.kkkkkk.k...",
    "................",
], "#f058a8")

# ------------------------------------------------- APICOT: damasco azul de pintinhas
berry("apicot berry", [
    "................",
    "........kk......",
    ".......kSk......",
    ".......kSkkkk...",
    "....kkkkkLLLMk..",
    "..kkBBBBkkkkk...",
    ".kBHHBBBCBBBBk..",
    "kBHHBWBBCBBWBBk.",
    "kBHBBBBBBCBBBDk.",
    "kBBWBBBBBCBBBDDk",
    "kBBBBBWBBCBWBDDk",
    "kBBBBBBBBCBBDDDk",
    ".kBBWBBBBCBBDDk.",
    "..kkBBBBBCBDkk..",
    "....kkkkkkkk....",
    "................",
], "#3a58b8", C="#2a3a88", W="#a8c0f0")

# ------------------------------------------------- LANSAT: laranja de chaminha em cima
berry("lansat berry", [
    "..........kk....",
    ".........kOOk...",
    "........kOYOk...",
    ".......kOYOk....",
    ".....kkkOOkk....",
    "...kkBBBkkBBkk..",
    "..kBHHBBBBBBBBk.",
    ".kBHHBBBBBBBBBDk",
    ".kBHBBBBBBBBBBDk",
    ".kBBBBBBBBBBBBDk",
    ".kBBBBBBBBBBBDDk",
    ".kBBBBBBBBBBBDDk",
    "..kBBBBBBBBBDDk.",
    "...kkBBBBBDDkk..",
    ".....kkkkkkk....",
    "................",
], "#f08838", O="#e83830", Y="#f8d848")

# ------------------------------------------------- STARF: a estrela
berry("starf berry", [
    ".......kk.......",
    "......kHBk......",
    "......kHBk......",
    ".....kHBBDk.....",
    "kkkkkkHBBDkkkkkk",
    "kHHHHHBBBBBBBBDk",
    ".kHBBBBBBBBBBDk.",
    "..kHBBBBBBBBDk..",
    "...kHBBBBBBDk...",
    "...kHBBBBBBDk...",
    "..kHBBBDBBBBDk..",
    "..kHBBDkkDBBDk..",
    ".kHBBDk..kDBBDk.",
    ".kHBDk....kDBDk.",
    "kHBDk......kDDk.",
    "kkkk........kkk.",
], "#78c848")
