"""EFEITOS das formas -BRAG (as versões brasileiras): grades de pixels
desenhadas à mão, como as do efeitos.py, e uns ajudantes pra mexer nas
partes. A letra "a" é sempre o contorno (#181420). Efeito com vários quadros
é uma lista de grades (do começo pro fim)."""
from PIL import Image

CONTORNO = "#181420"


# ------------------------------------------------------------ ajudantes
def gira(b, q, img, voltas=1, dx=0, dy=0, vira=False):
    """cola a parte `img` girada de 90 em 90 graus (voltas=1: um quarto de
    volta pra direita), em volta do MEIO da própria caixa — pra rolar sem
    estragar o pixel."""
    cx = img.getbbox()
    if not cx:
        return
    pedaco = img.crop(cx)
    if vira:
        pedaco = pedaco.transpose(Image.FLIP_LEFT_RIGHT)
    for _ in range(voltas % 4):
        pedaco = pedaco.transpose(Image.ROTATE_270)
    mx, my = (cx[0] + cx[2]) // 2, (cx[1] + cx[3]) // 2
    q.alpha_composite(pedaco, (b.me + mx - pedaco.width // 2 + dx, b.mc + my - pedaco.height // 2 + dy))


def pinta(img, cor):
    """a parte inteira de uma cor só (o "pisca branco" de quando leva ou dá
    um golpe — é o mesmo desenho, pixel por pixel, só trocando a cor)"""
    out = img.copy()
    o = out.load()
    c = (int(cor[1:3], 16), int(cor[3:5], 16), int(cor[5:7], 16), 255)
    for y in range(out.height):
        for x in range(out.width):
            if o[x, y][3]:
                o[x, y] = c
    return out


def troca(img, de_para):
    """troca cores da parte: {(r,g,b): "#rrggbb"} (pra acender a juba, apagar
    a lanterna...)"""
    out = img.copy()
    o = out.load()
    tab = {k: (int(v[1:3], 16), int(v[3:5], 16), int(v[5:7], 16), 255) for k, v in de_para.items()}
    for y in range(out.height):
        for x in range(out.width):
            c = o[x, y]
            if c[3] and c[:3] in tab:
                o[x, y] = tab[c[:3]]
    return out


# --------------------------------------------------------------- poeira
POEIRA_CORES = {"a": CONTORNO, "t": "#d8c09a", "T": "#a8885e", "w": "#f0e4c8"}
POEIRA = [   # a nuvenzinha de poeira do chão, nascendo e sumindo
    [".t.", "tTt"],
    ["..tt..", ".twtt.", "tttTTt"],
    ["...tt....", ".ttwtt.t.", "tttttTtTt", ".tTTTTTt."],
    ["...t.....", ".t..t..t.", "t.t...t.t"],
]

# ----------------------------------------------------------------- água
AGUA_CORES = {"a": CONTORNO, "b": "#4aa8e8", "B": "#2a70c0", "w": "#e8f8ff", "c": "#9ad8f8"}
GOTA = ["..a..", ".aca.", "acwba", "abbBa", ".aaa."]
GOTINHA = ["c", "b"]
RESPINGO = [   # água espirrando pra cima (do chão / da lagoa)
    ["..c..c..", ".cbccbc.", "cbbBBbbc"],
    [".c....c...", "..c..c..c.", "c..cbc..c.", ".cbbBBbbc.", "cbBBBBBBbc"],
    ["c.......c..", "...c...c...", ".c..c.c..c.", "...........", "..c.....c..", "c.bc...cb.c"],
]
ONDA = [   # a marolinha (anda pros lados trocando o quadro)
    "..cww.....cww...",
    ".cbbbw...cbbbw..",
    "cbBBBbbccbBBBbbc",
]
ONDA2 = [
    "......cww.....cw",
    "w....cbbbw...cbb",
    "bbccbBBBbbccbBBB",
]
BOLHA = [["c"], [".c.", "c.w", ".c."], [".cc.", "c..w", "c..c", ".cc."]]

# ---------------------------------------------------------------- folha
FOLHA_CORES = {"a": CONTORNO, "g": "#58b048", "G": "#2e7a30", "l": "#a8e070", "m": "#8a5a2c"}
FOLHINHA = [   # uma folha voando, girando (4 posições)
    [".lg", "lgG", "gG."],
    ["lgg.", ".gGG"],
    ["gG.", "lgG", ".lg"][::-1],
    [".gg", "lG.", "g.."],
]

# ---------------------------------------------------------------- fogo
FOGO_CORES = {"a": CONTORNO, "y": "#ffe85a", "o": "#ff9a28", "r": "#e8461e", "w": "#fff6c8"}
CHAMINHA = [   # foguinho em pé, tremulando (3 quadros)
    ["..y..", ".yoy.", "yowoy", "orwro", ".rrr."],
    [".y...", "..oy.", ".owoy", "oryro", ".rrr."],
    ["...y.", ".yo..", "yowo.", "orwyo", ".rrr."],
]
FAGULHA = [["y"], [".y.", "yoy", ".y."], ["w.y", ".o.", "y.w"]]

# ---------------------------------------------------------- raio e choque
RAIO_CORES = {"a": CONTORNO, "y": "#fff060", "Y": "#f0b020", "w": "#ffffff", "c": "#80e8ff"}
RAIO = [   # um raiozinho em zigue-zague, de cima pra baixo
    "..ay",
    ".ayY",
    "ayYa",
    "awYYa",
    ".aYwa",
    "..aYa",
    "..ayYa",
    "...aYa",
    "...aa.",
]
CHOQUE = [   # as faisquinhas em volta (2 quadros, alternando)
    ["w...c", ".y.y.", "..w..", ".y.y.", "c...w"],
    ["..y..", "c.w.c", "ywcwy", "c.w.c", "..y.."],
]

# ---------------------------------------------------------- impacto e corte
IMPACTO_CORES = {"a": CONTORNO, "w": "#ffffff", "y": "#ffe46a", "o": "#ff9a28"}
IMPACTO = [   # o "POW" de quando bate
    ["..w..", ".wyw.", "wyoyw", ".wyw.", "..w.."],
    ["w...w...w", ".w..y..w.", "..wyoyw..", ".yyowoyy.", "..wyoyw..", ".w..y..w.", "w...w...w"],
    ["w.......w", "...y.y...", "..w...w..", ".y.....y.", "..w...w..", "...y.y...", "w.......w"],
]
CORTE_CORES = {"w": "#ffffff", "c": "#c8e0f0", "C": "#88a8c8"}
CORTE = [   # o risco do golpe (garra, bico): da direita-cima pra esquerda-baixo
    ".........ww",
    ".......wwc.",
    ".....wwcC..",
    "...wwcC....",
    ".wwcC......",
    "wcC........",
]

# ------------------------------------------------- corações, notas, estrelas
CORACAO_CORES = {"a": CONTORNO, "r": "#f04878", "R": "#c02858", "w": "#ffd0e0"}
CORACAO = [".a.a.", "arara", "awrRa", ".aRa.", "..a.."]
CORACAOZINHO = ["r.r", "rRr", ".R."]
NOTA_CORES = {"a": CONTORNO, "n": "#fefefe", "y": "#ffe46a"}
NOTA = ["..aa", "..an", "..a.", ".aa.", "aya.", "aa.."]
NOTA2 = ["aaaa", "a..a", "a..a", "a.aa", "aaya", "aa.."]
TONTO_CORES = {"y": "#ffe46a", "w": "#ffffff"}
ESTRELA = [".y.", "ywy", ".y."]
EXCLAMA_CORES = {"a": CONTORNO, "r": "#f03c3c", "w": "#ffffff"}
EXCLAMA = ["ara", "ara", "ara", "ara", ".a.", "ara", ".a."]
ZZZ_CORES = {"z": "#e8f0ff", "a": CONTORNO}
ZE = ["zzzz", "..z.", ".z..", "zzzz"]

# --------------------------------------------------------------- vento
VENTO_CORES = {"w": "#ffffff", "c": "#c8d8e8"}
RISCO = ["wwccc.."]                          # risco de velocidade
REDEMOINHO_CORES = {"w": "#fefefe", "c": "#d0d8e4", "C": "#98a4b8", "a": CONTORNO}
REDEMOINHO = [   # o rodamoinho de vento (2 quadros, gira alternando)
    ["..cccCCc..", ".cC....wc.", "cC..ccc..C", "c..cC.wc.c", ".wc..ccC..", "...cC..wc.", "....cccc..", ".....cC...", "......c..."],
    ["..cCCccc..", ".cw....Cc.", "C..cccc..c", "c.cw.Cc..c", "..Ccc..cw.", ".cw..Cc...", "..cccc....", "...Cc.....", "...c......"],
]


def corta_abaixo(b, q, y):
    """apaga tudo do quadro da linha `y` (do sprite) pra baixo — é o chão:
    o que afunda some dentro da terra / da água"""
    px = q.load()
    for yy in range(max(0, b.mc + y), b.H):
        for xx in range(b.W):
            px[xx, yy] = (0, 0, 0, 0)


def corta_acima(b, q, y):
    """apaga tudo da linha `y` pra cima (pra sair de dentro de um buraco)"""
    px = q.load()
    for yy in range(0, min(b.H, b.mc + y)):
        for xx in range(b.W):
            px[xx, yy] = (0, 0, 0, 0)


# ---------------------------------------------------------- buraco e terra
BURACO = [   # a boca do túnel no chão, vista de lado
    "....aaaaaaaaaaaa....",
    "..aappPaaaaaaPppaa..",
    ".apPaaaaaaaaaaaaPpa.",
    "atpPPaaaaaaaaaaPPpta",
    ".attppPPPPPPPPpptta.",
    "..aaattttttttttaaa..",
]
MONTINHO = [   # o calombo de terra andando por baixo do chão
    "...aaaa...",
    ".aaptpPaa.",
    "aptppPPPPa",
]
REDEMOINHO_G = [   # o redemoinho grande, em funil (gira espelhando a cada quadro)
    ".cCCccwwccCCc...",
    "cc.w......c.Cc..",
    ".cCccwwwccCCc...",
    "..cc.......cC...",
    "...cCccwwcCc....",
    "....cc....cC....",
    ".....cCcwwc.....",
    "......cc.cC.....",
    "......cCwc......",
    ".......cc.......",
    "......cC........",
    ".......c........",
]

# ------------------------------------------------------------ luz
LUZ_CORES = {"w": "#ffffff", "y": "#fff6b0", "c": "#b8fff0"}
RAIO_V = ["w", "y", "y"]                    # os pedacinhos de raio de luz
RAIO_H = ["wyy"]
RAIO_D = ["c..", ".cc", "..c"]


def raios(b, q, cx, cy, r, cores=None):
    """os 8 raios de luz em volta do ponto (cx, cy), a `r` pixels do meio
    (r maior = a luz estourando pra fora)"""
    cores = cores or LUZ_CORES
    d = r * 7 // 10
    b.grade(q, RAIO_V, cx, cy - r - 2, cores)
    b.grade(q, RAIO_V[::-1], cx, cy + r, cores)
    b.grade(q, RAIO_H, cx - r - 2, cy, cores)
    b.grade(q, RAIO_H, cx + r, cy, cores, espelha=True)
    b.grade(q, RAIO_D, cx - d - 2, cy - d - 2, cores)
    b.grade(q, RAIO_D, cx + d, cy + d, cores)
    b.grade(q, RAIO_D, cx + d, cy - d - 2, cores, espelha=True)
    b.grade(q, RAIO_D, cx - d - 2, cy + d, cores, espelha=True)

# ------------------------------------------------- a folha grande da saúva
FOLHONA = [   # a folha cortada em meia-lua que a formiga carrega (cores FOLHA_CORES)
    "..........aaaaaaa...........",
    "......aaaallllllgaaaa.......",
    "....aallllllgggggggglaa.....",
    "...algggllllgggGgggggglaa...",
    "..aggggggggggGGgggggggggla..",
    ".alggggGgggggGgggGggggggga..",
    ".agggggGGgggGggggGGgggggga..",
    "agggggggGGgGgggGGgggggggga..",
    "aggggggggmmmmmmmmmmmmmmmmaaa",
    ".aggggGGgggggGggggGGgggga.ma",
    ".aagggGgggggGGgggggGgggaa.ma",
    "...aagggggggGgggggggaaa...ma",
    ".....aaaggggggggaaaa......ma",
    "........aaaaaaaa..........a.",
]

# ------------------------------------------------ formiguinha e brotos
FORMIGA_CORES = {"a": CONTORNO, "r": "#d3210d", "l": "#a8e070", "g": "#58b048"}
FORMIGUINHA = [   # saúva operária com um pedacinho de folha (2 passos)
    ["...lgg.", "..lggg.", ".aa.a..", "arraraa", ".a.a.a."],
    ["...lgg.", "..lggg.", ".aa.a..", "arraraa", "a.a.a.."],
]
BROTO_CORES = {"a": CONTORNO, "g": "#58b048", "G": "#2e7a30", "l": "#a8e070", "r": "#ff311b", "R": "#d3210d", "y": "#ffdd07"}
BROTO = [   # do grão pro cogumelinho
    ["l", "G"],
    [".l.", "lgl", ".G."],
    [".aaa.", "aryra", "aRRRa", ".aGa.", ".aGa."],
    ["..aaa..", ".arrya.", "aryrrra", "aRRRRRa", "..aGa..", "..aGa.."],
]
ESPORO_CORES = {"y": "#ffdd07", "w": "#fff6c8"}
ESPORO = [["y"], [".y.", "y.w", ".y."], ["y...w", "..y..", "w...y"]]
FUNDO = [   # a água embaixo da marola (16 de largura, emenda com ONDA/ONDA2)
    "BBbBBBBBBBbBBBBB",
    ".BBBBBbBBBBBBBB.",
]

# ------------------------------------------------ bichos do rio e cheiro
BICHO_CORES = {"a": CONTORNO, "w": "#e8f8ff", "B": "#3a8ad8", "b": "#2a5aa8",
               "g": "#6ab848", "G": "#3a7a30", "y": "#e0e890", "r": "#e04040"}
LIBELULA = [   # a libélula batendo as asas (2 quadros), olhando pra direita
    ["w.w....", "bBBBBaa", "w.w...."],
    [".ww....", "bBBBBaa", ".ww...."],
]
SAPINHO = [   # o sapinho do brejo: sentado e pulando
    ["..aa.aa..", ".awgagwa.", ".aggggga.", "agGgggGga", "agyyyyyga", ".aa...aa."],
    ["..aa.aa..", ".awgagwa.", ".aggggga.", "agGgggGga", ".ayyyyya.", "aa.....aa"],
]
CHEIRO_CORES = {"c": "#a8b878", "C": "#7a8a50"}
CHEIRO = [   # o cheiro subindo, ondulando (3 quadros)
    [".c.", "c..", ".C.", "..c", ".c.", "c.."],
    ["c..", ".c.", "..C", ".c.", "c..", ".c."],
    ["..c", ".c.", "C..", ".c.", "..c", ".c."],
]
VAGALUME_CORES = {"y": "#f8ff70", "Y": "#b8e040", "w": "#ffffff"}
VAGALUME = [[".Y.", "YyY", ".Y."], ["y"], [".Y.", "YwY", ".Y."], ["Y"]]   # acende e apaga

# ------------------------------------------------ chapéu do boto e o sol
CHAPEU_CORES = {"a": CONTORNO, "w": "#f4f4f4", "W": "#c8c8d0", "k": "#2a2a2a"}
CHAPEU = [   # o chapéu branco do boto, de fita preta
    "....aaaaaa....",
    "...awwwwwWa...",
    "...awwwwwWa...",
    "..akkkkkkkka..",
    "aawwwwwwwwWWaa",
    ".aaaaaaaaaaaa.",
]
SOL_CORES = {"a": CONTORNO, "y": "#ffe85a", "o": "#ff9a28", "w": "#fff6c8"}
SOL = [   # o sol nascendo (a metade de cima), com os raios
    "..o...o...o..",
    "o...aaaaa...o",
    "...ayywyya...",
    "..ayywyyyya..",
    ".ayyyyyyyoya.",
    "ayyyyyyyyyooa",
]

# ------------------------------------------------ moeda e interrogação
MOEDA_CORES = {"a": CONTORNO, "y": "#ffe050", "Y": "#d8a020", "w": "#fff8d0"}
MOEDA = [   # a moeda girando no ar: de frente, meio de lado, de lado
    ["..aaa..", ".ayyya.", "aywyyYa", "ayyYyYa", "ayyyYYa", ".aYYYa.", "..aaa.."],
    [".a.", "aya", "awa", "aYa", "aya", "aYa", ".a."],
    ["a", "y", "w", "Y", "y", "Y", "a"],
]
INTERROGA_CORES = {"a": CONTORNO, "w": "#ffffff"}
INTERROGA = [".aaa.", "awwwa", "aa.wa", "..awa", ".awa.", "..a..", ".awa.", "..a.."]

# ------------------------------------------------ esturro e passarinhos
SOM_CORES = {"w": "#ffffff", "c": "#c8d8e8"}
ESTURRO = [   # as ondas do rugido, abrindo pra ESQUERDA (espelha pra direita)
    [".w", "wc", "wc", "wc", ".w"],
    ["..w", ".wc", "wc.", "wc.", "wc.", "wc.", "wc.", ".wc", "..w"],
    ["...w", "..wc", ".wc.", "wc..", "wc..", "wc..", "wc..", "wc..", "wc..", "wc..", ".wc.", "..wc", "...w"],
]
PASSARINHO_CORES = {"a": CONTORNO}
PASSARINHO = [["a...a", ".a.a.", "..a.."], [".....", "aa.aa", "..a.."]]
BENTEVI_CORES = {"a": CONTORNO, "k": "#202020", "w": "#ffffff", "y": "#ffe040", "b": "#8a6a40"}
BENTEVI = [   # o bem-te-vi (olhando pra esquerda): pousado e batendo asa
    [".aaa...", "akwwa..", "akkkaaa", "ayyybba", ".ayybba", "..a.a.."],
    [".aaa.b.", "akwwabb", "akkkaab", "ayyybba", ".ayyya.", "..a.a.."],
]
MARIMBONDO_CORES = {"a": CONTORNO, "y": "#ffd020", "k": "#202020", "w": "#e8f8ff"}
MARIMBONDO = [   # o marimbondo bravo (olhando pra esquerda), batendo asa
    ["..ww...", ".awwa..", "aykyka.", "aykykaa", ".aaaa.."],
    ["...ww..", "..awwa.", "aykyka.", "aykykaa", ".aaaa.."],
]
RAIVA_CORES = {"r": "#f03c3c"}
RAIVA = ["rr.rr", "r...r", ".....", "r...r", "rr.rr"]   # a veinha de bravo
