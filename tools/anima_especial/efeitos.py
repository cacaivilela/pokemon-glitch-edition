"""EFEITOS desenhados à mão, pra todos os roteiros. Cada um é uma grade (lista
de strings) e um dicionário de cores; a letra "a" é o contorno dos sprites de
Braglitch. Um efeito com vários quadros é uma lista de grades."""
CONTORNO = "#181420"

# ------------------------------------------------------------- fumaça
FUMACA_CORES = {"a": CONTORNO, "c": "#dcdce6", "C": "#a8a8bc", "w": "#f4f4fa"}
FUMACA = [   # do pequeno pro grande (ela cresce subindo)
    [".a.", "aca", ".a."],
    [".aa.", "awca", "acCa", ".aa."],
    ["..aaa..", ".awcca.", "awcccCa", "acccCCa", ".aCCCa.", "..aaa.."],
    ["...aaa...", ".aawcccaa.", "awccccCCa", "acccccCCa", "aCccCCCCa", ".aaCCCCa.", "...aaaa.."],
]

# ---------------------------------------------------------------- fogo
FOGO_CORES = {"a": CONTORNO, "y": "#ffe85a", "o": "#ff9a28", "r": "#e8461e", "w": "#fff6c8"}
LABAREDA = [   # uma bola de fogo, três tamanhos
    [".a.", "aya", ".a."],
    ["..a..", ".aoa.", "aoyoa", "aoyya", ".aaa."],
    ["...aa...", "..aoa...", ".aorroa.", "aoryyoa.", "aoywyyra", "aoryyoa.", ".aorroa.", "..aaaa.."],
]
BRASA = [["y"], ["o"], [".o.", "oyo", ".o."]]

# ------------------------------------------------------- terra e pedra
TERRA_CORES = {"a": CONTORNO, "p": "#8a623c", "P": "#5c3e22", "t": "#b08a5c"}
TORRAO = [["ap", "pP"], [".a.", "apa", "pPP"], ["aa", "tp"]]

# ------------------------------------------------------------ faísca
FAISCA_CORES = {"w": "#fefefe", "y": "#ffe46a", "Y": "#e0a820", "g": "#b455ff", "G": "#d9a8ff"}
BRILHO = [[".w.", "wyw", ".w."], ["..w..", "..y..", "wyYyw", "..y..", "..w.."], ["w"]]
BRILHO_ROXO = [[".G.", "GgG", ".G."], ["g"], ["..G..", "..g..", "GgwgG", "..g..", "..G.."]]

# ------------------------------------------------------------- linhas
LINHA_CORES = {"w": "#fefefe", "c": "#c8d8e8"}
FAREJA = ["w.w", ".w.", "w.w"]          # o "snif snif" do nariz
VENTO = ["cccw....", "..cccww.", "....cccw"]
