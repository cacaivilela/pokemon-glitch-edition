"""EFEITOS das criaturas de Braglitch (os fakemons originais), desenhados à
mão, grade por grade — do mesmo jeito do efeitos.py. A letra "a" é sempre o
contorno dos sprites (#181420). Um efeito com vários quadros é uma lista de
grades. Também tem uns ajudantes pra mexer o corpo (agachar, pular) que
vários roteiros usam."""
CONTORNO = "#181420"

# ---------------------------------------------------------------- raio
RAIO_CORES = {"a": CONTORNO, "y": "#ffe85a", "w": "#fff6c8", "o": "#f8c020"}
RAIO = [   # o raio pequeno (de bochecha) e o grande (de rabo)
    ["..aa", ".aya", "ayaa", "aywa", ".aya", "aya.", "aa.."],
    ["....aaaa", "...ayyya", "...aywa.", "..ayya..", "..aywaaa", ".ayyyyya", ".aaawya.", "...aya..", "..aya...", "..aa...."],
]
# o raio que cai do céu: um pedaço que se repete (um embaixo do outro)
RAIO_CEU = [
    "...ayya..",
    "..aywa...",
    ".aywaaa..",
    ".ayywwya.",
    "..aaayya.",
    "....aywa.",
    "...aywa..",
    "...ayya..",
    "..ayywa..",
    "..aywaa..",
]
RAIO_PONTA = ["..ayya.", ".aywa..", "ayya...", "awa....", "aa....."]
# o zigue-zague deitado (raio que sai pro lado)
RAIO_LADO = [
    "aa.....aaa......aa..",
    "ayaa..ayya....aayya.",
    ".aywaaywaya.aaywa.ya",
    "..ayyywa.aywwya....a",
    "...aaaa...aaaa......",
]
# o estalo em volta (quando o choque acerta)
ESTALO = [
    ["y...y", ".y.y.", "..w..", ".y.y.", "y...y"],
    ["y..y..y", ".y.y.y.", "..ywy..", "yyw.wyy", "..ywy..", ".y.y.y.", "y..y..y"],
]

# ---------------------------------------------------------------- água
AGUA_CORES = {"a": CONTORNO, "b": "#5aa8f0", "B": "#2c6cc8", "w": "#e8f6ff"}
GOTA = [
    [".a.", "awa", "aba", ".a."],
    ["..a..", ".aba.", "abwba", "abbBa", ".aaa."],
]
BOLHA = [
    [".a.", "awa", ".a."],
    [".aa.", "aw.a", "a..a", ".aa."],
    ["..aa..", ".aw..a", "aw...a", "a....a", ".a..a.", "..aa.."],
]
ESPIRRO = [   # a água espirrando pra cima (do pequeno pro grande)
    ["b.b", ".b.", "bwb"],
    ["b..b..b", ".b.w.b.", "..bwb..", ".bbwbb."],
    ["w...b...w", ".b..w..b.", "..b.b.b..", "b..bwb..b", ".bbbwbbb."],
]
ONDA = [   # a ondinha deitada (andando: dois quadros)
    ["....aaa.....", "..aawwba....", ".abbbbbbaaa.", "abbbBBbbbbba"],
    [".....aaa....", "...aawwba...", "aaabbbbbbaa.", "abbbbBBbbbba"],
]

# ---------------------------------------------------------------- planta
FOLHA_CORES = {"a": CONTORNO, "g": "#58b048", "G": "#2e7a30", "l": "#9ad85a"}
FOLHA = [   # a folha caindo, virando
    ["..aa.", ".agla", "agGa.", "aa..."],
    [".aaa.", "aglga", ".aGa.", "..a.."],
    [".aa..", "algaa", ".aGga", "...aa"],
    ["aaaa", "algG", "aaaa"],
]

# ---------------------------------------------------------------- sinais
SINAL_CORES = {"a": CONTORNO, "w": "#fefefe", "r": "#e84a5a", "R": "#a82838", "y": "#ffe46a", "Y": "#e0a820"}
ZZZ = [   # o "z" do sono, três tamanhos
    ["aaaa", "awwa", ".aw.", "awwa", "aaaa"],
    ["aaaaa", "awwwa", "aawa.", "awaaa", "awwwa", "aaaaa"],
    ["aaaaaa", "awwwwa", "aaawaa", ".awaa.", "awaaaa", "awwwwa", "aaaaaa"],
]
CORACAO = [
    [".a.a.", "arara", "arrra", ".ara.", "..a.."],
    [".aa.aa.", "arrarra", "arwrrra", "arrrrRa", ".arrRa.", "..ara..", "...a..."],
]
EXCLAMA = ["aaa", "awa", "awa", "awa", "aaa", "awa", "aaa"]
INTERROGA = [".aaa.", "awwwa", "aaawa", ".awaa", ".aaa.", ".awa.", ".aaa."]
NOTA = [
    ["..aaa", "..awa", "..aa.", "aaa..", "awa..", "aaa.."],
    ["...aaaa", "...awwa", "...aaaa", "aa.a..a", "awaaa.a", "aaawa.a", "..aaa.a"],
]
ESTRELA = [   # estrelinha (de tonto, de brilho)
    ["..a..", ".aya.", "ayyya", ".aya.", "..a.."],
    ["...a...", "...a...", "..aya..", "aayyyaa", "..aya..", "...a...", "...a..."],
]
SUOR = [".a.", "awa", "aba", ".a."]
SUOR_CORES = {"a": CONTORNO, "w": "#e8f6ff", "b": "#8ac8f0"}

# ----------------------------------------------------------- futebol
BOLA_CORES = {"a": CONTORNO, "w": "#fefefe", "c": "#c8c8d4"}
BOLA = [   # rolando: dois quadros (os gomos trocam de lugar)
    ["..aaa..", ".awwwa.", "awaawca", "awaawca", "awwwwca", ".awcca.", "..aaa.."],
    ["..aaa..", ".awawa.", "awwwaca", "aaawwca", "awwwaca", ".awcca.", "..aaa.."],
]

# ------------------------------------------------------------- pancada
IMPACTO_CORES = {"a": CONTORNO, "w": "#fefefe", "y": "#ffe46a"}
IMPACTO = [   # o "pou!" de quando bate
    ["w.w.w", ".wyw.", "wy.yw", ".wyw.", "w.w.w"],
    ["w..w..w", ".w.y.w.", "..yyy..", "wyy.yyw", "..yyy..", ".w.y.w.", "w..w..w"],
]
POEIRA_CORES = {"a": CONTORNO, "c": "#d8c8a8", "C": "#a89878"}
POEIRA = [   # a nuvenzinha de poeira do chão
    [".aa.", "acca", ".aa."],
    ["..aa..", ".acCa.", "acccCa", ".aaaa."],
    [".aa.aa.", "accaCCa", "acccCCa", ".aaaaa."],
]


# ------------------------------------------------------- ajudantes
def agachar(b, q, img, corte, desce, dx=0):
    """cola `img` agachado: o que está abaixo da linha `corte` (y do sprite)
    fica no lugar, o que está acima desce `desce` pixels por cima dele."""
    de_baixo = img.copy()
    px = de_baixo.load()
    for y in range(min(corte, img.height)):
        for x in range(img.width):
            px[x, y] = (0, 0, 0, 0)
    de_cima = img.copy()
    px = de_cima.load()
    for y in range(corte, img.height):
        for x in range(img.width):
            px[x, y] = (0, 0, 0, 0)
    b.por(q, de_baixo, dx=dx)
    b.por(q, de_cima, dx=dx, dy=desce)


def corta(img, y0=None, y1=None, x0=None, x1=None):
    """um pedaço de `img` (o que está fora dos limites some)"""
    out = img.copy()
    px = out.load()
    for y in range(img.height):
        for x in range(img.width):
            if (y0 is not None and y < y0) or (y1 is not None and y > y1) or \
               (x0 is not None and x < x0) or (x1 is not None and x > x1):
                px[x, y] = (0, 0, 0, 0)
    return out


def tinge(img, de_para):
    """troca cores da parte (um dicionário (r,g,b) -> "#rrggbb") — pra piscar
    de amarelo no choque, ficar vermelho de raiva... troca cor por cor, sem
    filtro."""
    out = img.copy()
    px = out.load()
    for y in range(img.height):
        for x in range(img.width):
            c = px[x, y]
            if c[3] and c[:3] in de_para:
                h = de_para[c[:3]]
                px[x, y] = (int(h[1:3], 16), int(h[3:5], 16), int(h[5:7], 16), 255)
    return out


def so_contorno(img, cor="#fff6c8"):
    """a parte inteira de uma cor só, menos o contorno (o "clarão" do choque)"""
    out = img.copy()
    px = out.load()
    r, g, bb = int(cor[1:3], 16), int(cor[3:5], 16), int(cor[5:7], 16)
    for y in range(img.height):
        for x in range(img.width):
            c = px[x, y]
            if c[3] and sum(c[:3]) > 300:          # o escuro (contorno) fica
                px[x, y] = (r, g, bb, 255)
    return out


def ondula(b, q, img, faixas, dy=0):
    """cola `img` em faixas deitadas, cada uma com seu deslocamento de lado:
    `faixas` = [(y0, y1, dx), ...] — é assim que o rabo e a chama "dobram"
    sem girar o desenho."""
    for y0, y1, dx in faixas:
        b.por(q, corta(img, y0=y0, y1=y1), dx=dx, dy=dy)


# ------------------------------------------------- RAI e PICHU de boné
# (os dezesseis têm o mesmo desenho: só o símbolo do boné muda de região)
_BONE_RAI = {(0xba, 0x1b, 0x1b), (0xdb, 0x52, 0x41), (0x8f, 0x1b, 0x1b), (0xa6, 0x7e, 0x77),
             (0xcd, 0xba, 0xba), (0xff, 0xfd, 0xea), (0x83, 0xd1, 0x85), (0x60, 0xb5, 0x53), (0, 0, 0)}


def _eh_bone(x, y, c, x0, x1, y1):
    if not (x0 <= x <= x1 and y <= y1):
        return False
    if c[:3] in ((0xff, 0xfd, 0xea), (0, 0, 0)) and y >= y1:
        return False
    return c[:3] in _BONE_RAI or (c[:3] not in ((0x10, 0x10, 0x10),) and False)


def partes_rai(b):
    """as partes do RAI de boné: boné, rabo (o raio), orelha, cabeça, pés"""
    p = {}
    sym = set()
    sp = b.sprite.load()
    p["bone"] = b.parte(lambda x, y, c: _eh_bone(x, y, c, 17, 37, 23))
    # o símbolo da região (as cores que não são do boné comum) entra no boné
    p["bone"] = b.parte(lambda x, y, c: _eh_bone(x, y, c, 17, 37, 23) or
                        (19 <= x <= 33 and 10 <= y <= 17 and c[:3] not in ((0x10, 0x10, 0x10),) and
                         c[:3] not in ((0xf8, 0xc0, 0x20), (0xd8, 0xa0, 0x58), (0x90, 0x60, 0x30), (0x60, 0x40, 0x18), (0xb8, 0x80, 0x40), (0xf8, 0xd8, 0x78))))
    p["rabo"] = b.parte(lambda x, y, c: x <= 17 and y <= 38)
    p["orelha"] = b.menos(b.parte(lambda x, y, c: x >= 35 and y <= 19), p["bone"])
    resto = b.menos(b.sprite, p["bone"], p["rabo"], p["orelha"])
    p["pes"] = corta(resto, y0=51)
    p["corpo"] = corta(resto, y1=50)
    return p


def partes_pichu(b):
    """as partes do PICHU de boné: boné, orelhas, rabo, corpo"""
    p = {}
    p["bone"] = b.parte(lambda x, y, c: (24 <= x <= 41 and y <= 19 and c[:3] in ((0x29, 0x29, 0x29), (0x52, 0x52, 0x5a), (0x3f, 0x7c, 0x3d))) or 22 <= x <= 41 and y <= 23 and
                        (c[:3] in _BONE_RAI or (27 <= x <= 38 and 13 <= y <= 18 and c[:3] not in ((0x10, 0x10, 0x10), (0x52, 0x52, 0x52), (0xff, 0xee, 0x83), (0xe6, 0xb4, 0x41), (0xc5, 0x8b, 0x00), (0x83, 0x52, 0x00)))) and
                        not (y >= 22 and c[:3] == (0, 0, 0)))
    p["rabo"] = b.parte(lambda x, y, c: y >= 44 and x >= 32)
    resto = b.menos(b.sprite, p["bone"], p["rabo"])
    p["corpo"] = resto
    return p


# a cabeça do PICHU por baixo do boné (pra quando o boné sai do lugar):
# vai POR BAIXO do corpo, então só aparece onde o boné deixou buraco
CABECA_PICHU_CORES = {"a": "#101010", "b": "#ffee83", "c": "#e6b441"}
CABECA_PICHU = [   # canto em (26, 16)
    ".....aaaa....",
    "...aabbbbaa..",
    "..abbbbbbbba.",
    ".abbbbbbbbbba",
    "abbbbbbbbbbba",
    "abbbbbbbbbbbb",
    "bbbbbbbbbbbbb",
    "bbbbbbbbbbbbb",
    "bbbbbbbbbbbbb",
]

# ------------------------------------------------------- chama grande
CHAMA_CORES = {"a": CONTORNO, "y": "#ffe85a", "o": "#ff9a28", "r": "#e8461e", "w": "#fff6c8"}
CHAMA = [   # a labareda alta, tremendo (dois quadros); a base é a última linha
    ["....a......", "...aoa.....", "...aoa..a..", "..aoroaaoa.", "..aorroaroa", ".aorryroroa",
     ".aoryyyrroa", "aoryywyyroa", "aoryywwyroa", "aoryywwyyra", ".aoyyyyyoa.", "..aaaaaaa.."],
    ["......a....", ".....aoa...", "..a..aoa...", ".aoaaoroa..", "aoraorroa..", "aororyrroa.",
     "aorryyyrroa", "aoryywyyroa", "aoryywwyroa", "aryywwyyroa", ".aoyyyyyoa.", "..aaaaaaa.."],
]

# a poça d'água no chão (vai POR CIMA dos pés: eles ficam "dentro")
POCA = [
    ".....aaaaaaaaaaaaaaaaaaaaaa.....",
    "...aabbbbwwbbbbbbbbbbbwwbbbbaa..",
    ".aabbBBbbbbbbbBBBbbbbbbbbbBBbbaa",
    "abbbbbbbBBbbbbbbbbbbBBbbbbbbbbba",
    ".aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.",
]

# ------------------------------------------------------------- grito
GRITO_CORES = {"w": "#fefefe", "c": "#c8d8e8"}
GRITO = [   # as ondas do rugido (abrindo pra esquerda; espelhe pra direita)
    [".w", "w.", "w.", "w.", ".w"],
    ["..w", ".w.", "w..", "w..", "w..", ".w.", "..w"],
    ["...w", "..w.", ".w..", "w...", "w...", "w...", ".w..", "..w.", "...w"],
]

# ------------------------------------------------------------- calor
CALOR_CORES = {"o": "#ff9a28", "y": "#ffe85a", "r": "#e8461e"}
CALOR = [   # o ar tremendo de quente, subindo do chão (dois quadros)
    ["o.", ".o", ".o", "o.", "o.", ".o"],
    [".o", "o.", "o.", ".o", ".o", "o."],
]
RACHA_QUENTE = [   # a rachadura do chão acendendo
    ["aaaa.aaa", ".aoaaoa.", "..aoya..", "...aa..."],
    ["aaaa.aaa", ".ayaaya.", "..ayya..", "...aa..."],
]
CORRENTE = ["wbbbbB....", "...wbbbbbB"]   # o risco da correnteza (em AGUA_CORES)

# ------------------------------------------------------- passarinho
PASSARINHO_CORES = {"a": CONTORNO, "b": "#6eb4e6", "B": "#3a7ac0", "k": "#181420", "y": "#ffb030"}
PASSARINHO = [   # olhando pra esquerda: asa em cima, asa embaixo (pousado)
    ["....aaa..", "...aBBa..", "..aaaBa..", ".abkaaaaa", "ayabbbbBa", ".abbbbbba", "..aabbaa.", "...a..a.."],
    [".........", ".........", "..aaa....", ".abkba...", "ayabbbaaa", ".abbBBBBa", "..abBBaa.", "...a..a.."],
]


def ondula_em_pe(b, q, img, faixas, dx=0):
    """como `ondula`, mas em faixas EM PÉ: `faixas` = [(x0, x1, dy), ...] —
    pra inclinar o corpo (o bico desce mais que o rabo) sem girar o desenho."""
    for x0, x1, dy in faixas:
        b.por(q, corta(img, x0=x0, x1=x1), dx=dx, dy=dy)
