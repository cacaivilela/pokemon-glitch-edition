"""AS MEGAS EMPRESTADAS desenhadas à mão (ideia do CAIO, nov/2026). Cada uma é
o desenho do bicho editado PIXEL POR PIXEL: as partes que ele já tem
recoloridas tom por tom com as cores da MEGA da pedra (a cor velha -> a nova,
às vezes só numa área), e as peças novas são grades feitas à mão — cada letra
é um pixel. O PIDGEOT AERODACTYLITA mora no pidgeot.py.
    python3 tools/emprestadas/desenhos.py
grava assets/fusoes/emprestadas/<id>.png e <id>_costas.png
"""
import os
from PIL import Image

RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SPR = os.path.join(RAIZ, "assets/sprites/pokemon")
PASTA = os.path.join(RAIZ, "assets/fusoes/emprestadas")
TODA = (0, 0, 96, 96)


def borda(px, x, y, w, h):
    """o pixel encosta no vazio (é o contorno de fora)"""
    for a, b in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
        if not (0 <= a < w and 0 <= b < h) or px[a, b][3] == 0:
            return True
    return False


def recolore(im, regras):
    """regras: [(caixa (x0,y0,x1,y1), {cor velha: cor nova}, só_dentro)] — a
    primeira regra que pega o pixel manda. só_dentro: não mexe no contorno."""
    px = im.load()
    w, h = im.size
    novo = {}
    for y in range(h):
        for x in range(w):
            if px[x, y][3] == 0:
                continue
            c = px[x, y][:3]
            for (x0, y0, x1, y1), mapa, dentro in regras:
                if x0 <= x <= x1 and y0 <= y <= y1 and c in mapa:
                    if dentro and borda(px, x, y, w, h):
                        break
                    novo[x, y] = mapa[c]
                    break
    for (x, y), c in novo.items():
        px[x, y] = c + (255,)


def pinta(im, grade, x0, y0, cores):
    px = im.load()
    for j, linha in enumerate(grade):
        for i, ch in enumerate(linha):
            if ch != "." and 0 <= x0 + i < 96 and 0 <= y0 + j < 96:
                px[x0 + i, y0 + j] = cores[ch] + (255,)


def encosta(im, grade, x, y0, y1, cores, embaixo=True):
    """cola a peça encostada na borda do desenho naquela coluna: `embaixo`
    pendura do pixel mais baixo entre y0 e y1; senão apoia em cima do mais alto"""
    px = im.load()
    cheios = [y for y in range(y0, y1 + 1) if px[x, y][3]]
    if not cheios:
        return
    meio = len(grade[0]) // 2
    if embaixo:
        pinta(im, grade, x - meio, max(cheios), cores)
    else:
        pinta(im, grade, x - meio, min(cheios) - len(grade) + 1, cores)


def abre(nome):
    return Image.open(os.path.join(SPR, nome)).convert("RGBA")


# ------------------------------------------------- CHARIZARD BLASTOISITA
# o fogo do rabo vira ÁGUA, a pele das asas vira o CASCO, a barriga fica creme
# e sai um CANHÃO do ombro, como o das costas da MEGA BLASTOISE
CHAR_FOGO = {(230, 65, 16): (25, 89, 176), (246, 164, 16): (81, 129, 209), (255, 213, 16): (248, 248, 248)}
CHAR_CORES = {
    (32, 115, 148): (139, 98, 65), (8, 65, 82): (90, 57, 24),                                          # as asas
    (238, 222, 123): (241, 209, 152), (238, 180, 90): (206, 168, 75),                                  # a barriga
}
CANHAO = [
    "..........KKKK..",
    ".........KDDDDK.",
    "........KDKKKDDK",
    ".......KLDKKKKDK",
    "......KLMDDKKDK.",
    ".....KLLMMDDDK..",
    "....KLLMMMMDK...",
    "...KWLMMMMDK....",
    "..KWLMMMMDK.....",
    ".KLLMMMMDK......",
    "KLLMMMMDK.......",
    "KMMMMMDK........",
    ".KDDDDK.........",
    "..KKKK..........",
]
CANHAO_CORES = {"K": (16, 16, 16), "D": (74, 74, 74), "M": (148, 148, 148), "L": (205, 205, 213), "W": (248, 248, 248)}


# o CANHÃO GRANDE, saindo do canto da asa e apontando pro alto (à mão)
CANHAO_GRANDE = [
    "..............bbbbb...",
    ".............bmmmmmb..",
    "............bmddddddb.",
    "...........bmdbbbbbdjb",
    "..........bmdbbbbbbdjb",
    "..........bmdbbbbbdjb.",
    ".........bmjddbbbddjb.",
    "........bmjjjdddddjb..",
    ".......bmqjjjjjjjjb...",
    "......bmqjjjjjjjdb....",
    ".....bmqjjjjjjjdb.....",
    "....bmqjjjjjjjdb......",
    "...bmqjjjjjjjdb.......",
    "..bmqjjjjjjjdb........",
    ".bmqjjjjjjjdb.........",
    "bmqjjjjjjjdb..........",
    "bqjjjjjjjdb...........",
    "bjjjjjjjdb............",
    "bdjjjjjdb.............",
    ".bdddddb..............",
]
# o CANHÃO DO BRAÇO, na mão da frente, apontando pra frente (à mão)
CANHAO_BRACO = [
    ".bbb.bbbbbbb.",
    "bmmmbmmmmmmmb",
    "bmbbmqqqqqqqb",
    "bmbbmjjjjjjjb",
    "bmbbmjjjjjjjb",
    "bjddjddddddjb",
    ".bbb.bbbbbbb.",
]
METAL = {"b": (16, 16, 16), "d": (74, 74, 74), "j": (148, 148, 148), "m": (205, 205, 213), "q": (248, 248, 248)}
CASCO, CASCO_ESCURO = (139, 98, 65), (90, 57, 24)
LARANJA = {(238, 131, 41), (205, 82, 65), (131, 49, 24)}


def borda_do_casco(im):
    """a BORDA BRANCA do casco da MEGA BLASTOISE: o casco que encosta na pele
    laranja da asa vira branco, e o de dentro dele, cinza-claro"""
    px = im.load()
    w, h = im.size
    casco = {(x, y) for y in range(h) for x in range(w) if px[x, y][3] and px[x, y][:3] in (CASCO, CASCO_ESCURO)}
    perto = lambda x, y, cores: any(0 <= a < w and 0 <= b < h and px[a, b][3] and px[a, b][:3] in cores
                                    for a, b in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)))
    branco = {p for p in casco if perto(*p, LARANJA)}
    for x, y in branco:
        px[x, y] = (248, 248, 248, 255)
    cinza = {p for p in casco - branco if perto(*p, {(248, 248, 248)})}
    for x, y in cinza:
        px[x, y] = (205, 205, 213, 255)


def placas_da_barriga(im, linhas=(59, 63, 67), creme=(241, 209, 152), risca=(206, 168, 75)):
    """as PLACAS da barriga do BLASTOISE: uma risca a cada 4 linhas no creme"""
    px = im.load()
    for y in linhas:
        for x in range(im.width):
            if px[x, y][3] and px[x, y][:3] == creme:
                px[x, y] = risca + (255,)


def charizard():
    f = abre("006.png")
    # o fogo só na ponta do rabo: a boca tem o mesmo vermelho e fica vermelha
    recolore(f, [((30, 4, 50, 33), CHAR_FOGO, False), (TODA, CHAR_CORES, False)])
    borda_do_casco(f)
    placas_da_barriga(f)
    pinta(f, CANHAO_GRANDE, 50, 0, METAL)
    pinta(f, CANHAO_BRACO, 7, 60, METAL)
    c = abre("back/006.png")
    recolore(c, [((30, 0, 55, 28), CHAR_FOGO, False), (TODA, CHAR_CORES, False)])
    borda_do_casco(c)
    return f, c


# ------------------------------------------------- DARKRAI GARDEVOIRITA
# a fumaça branca da cabeça vira o CABELO VERDE, a parte de baixo vira o
# VESTIDO BRANCO da MEGA GARDEVOIR, a gola e o olho ficam rosa como o chifre dela
DK_CABELO = {(222, 230, 239): (139, 230, 139), (173, 181, 189): (115, 189, 115), (132, 132, 132): (49, 123, 65)}
DK_VESTIDO = {(49, 49, 49): (230, 230, 242), (82, 74, 74): (195, 195, 217), (16, 16, 16): (133, 133, 166)}
DK_GOLA = {(230, 58, 41): (213, 74, 115), (148, 41, 66): (131, 41, 74), (82, 0, 0): (90, 20, 50),
           (16, 140, 173): (213, 74, 115), (41, 230, 255): (255, 123, 148)}


# O VESTIDO RODADO da MEGA GARDEVOIR no lugar das pontas rasgadas. A saia abre
# em curva (fina na cintura, larga embaixo) e cai mais comprida do lado
# direito, como o vestido dela voando. O contorno é preto, o lado de fora tem a
# sombra lilás, as pregas descem abrindo junto com a saia e a barra é ondulada.
SAIA_CORES = {"a": (16, 16, 16), "h": (133, 133, 166), "j": (195, 195, 217), "l": (230, 230, 242), "w": (248, 248, 255)}
# a barra: onde a saia acaba em cada coluna (à mão — mais comprida à direita)
BARRA = {x: y for x, y in zip(range(13, 74), [
    71, 72, 73, 74, 74, 75, 75, 74, 73, 73, 74, 75, 76, 76, 75, 74, 74, 75, 76, 77,
    77, 76, 75, 75, 76, 77, 78, 78, 77, 76, 76, 77, 78, 79, 79, 78, 77, 77, 78, 79,
    79, 79, 78, 78, 79, 79, 79, 79, 78, 79, 79, 79, 79, 79, 78, 77, 76, 74, 72, 70, 68])}
# o CHIFRE do peito, saindo da gola pra frente (à mão)
CHIFRE = [
    (43, 27, "aaa"),
    (44, 24, "aaamkka"),
    (45, 22, "aamkkkkga"),
    (46, 21, "amkkkkkgga"),
    (47, 22, "aakkkggga"),
    (48, 24, "aagggga"),
    (49, 27, "aaa"),
]
CHIFRE_CORES = {"a": (16, 16, 16), "k": (213, 74, 115), "g": (131, 41, 74), "m": (255, 123, 148)}


def saia(im):
    px = im.load()
    for y in range(55, im.height):                  # some com as pontas velhas
        for x in range(10, 78):
            px[x, y] = (0, 0, 0, 0)
    c = SAIA_CORES
    meio = 42
    for y in range(55, 80):
        t = ((y - 55) / 22) ** 1.5                  # a curva: abre devagar e depois rápido
        e = round(26 - 13 * t)
        d = round(58 + 15 * t)
        largura = (d - e) / 32
        pregas = {round(meio + (p - meio) * largura) for p in (31, 37, 47, 53)}
        for x in range(max(e, 13), min(d, 73) + 1):
            if y > BARRA.get(x, 0):
                continue
            if x in (e, d) or y == BARRA.get(x):
                cor = c["a"]
            elif x <= e + 2 or y == BARRA.get(x) - 1:
                cor = c["j"]                        # a sombra do lado de fora e da barra
            elif x in pregas:
                cor = c["h"]                        # a prega
            elif x - 1 in pregas or x >= d - 2:
                cor = c["j"]                        # a sombra da prega
            elif x + 1 in pregas or (x > meio and x < d - 5 and y < 64):
                cor = c["w"]                        # o brilho
            else:
                cor = c["l"]
            px[x, y] = cor + (255,)
    # o contorno nas laterais da barra (onde ela sobe de uma coluna pra outra)
    for x in range(13, 74):
        for y in range(60, 80):
            if px[x, y][3] and px[x, y][:3] != c["a"]:
                for v in (x - 1, x + 1):
                    if 0 <= v < im.width and px[v, y][3] == 0:
                        px[v, y] = c["a"] + (255,)


def darkrai():
    f = abre("491.png")
    recolore(f, [
        ((0, 0, 95, 40), DK_CABELO, False),
        ((0, 0, 95, 95), DK_GOLA, False),
        ((24, 55, 60, 95), DK_VESTIDO, True),
        ((24, 51, 57, 54), DK_VESTIDO, True),
    ])
    saia(f)
    for y, x, linha in CHIFRE:
        pinta(f, [linha], x, y, CHIFRE_CORES)
    c = abre("back/491.png")
    recolore(c, [
        ((0, 0, 95, 46), DK_CABELO, False),
        ((0, 0, 95, 95), DK_GOLA, False),
        ((0, 72, 95, 95), DK_VESTIDO, True),   # de costas só as pontas de baixo: o resto é a capa
    ])
    return f, c


# ------------------------------------------------- GARDEVOIR DARKRAITA
# o cabelo vira a FUMAÇA BRANCA da MEGA DARKRAI (e solta um fio pra cima), os
# braços e o vestido ficam pretos, o chifre vira a gola vermelha, o olho azul,
# e a barra do vestido rasga em pontas
GD_CABELO = {(180, 246, 148): (241, 237, 237), (139, 230, 139): (218, 210, 216),
             (115, 189, 115): (173, 181, 189), (49, 123, 65): (131, 131, 131)}
GD_BRACO = {(180, 246, 148): (135, 130, 133), (139, 230, 139): (86, 81, 90),
            (115, 189, 115): (69, 61, 61), (49, 123, 65): (35, 35, 35)}
GD_VESTIDO = {(238, 238, 255): (86, 81, 90), (205, 205, 230): (69, 61, 61),
              (123, 139, 180): (35, 35, 35), (164, 180, 205): (135, 130, 133)}
GD_OLHO = {(255, 123, 148): (41, 230, 255), (213, 74, 115): (16, 140, 173)}
GD_GOLA = {(213, 74, 115): (230, 58, 41), (131, 41, 74): (148, 41, 66), (255, 123, 148): (255, 120, 90)}
FIO = [
    "...KK.",
    "..KWGK",
    "..KWK.",
    ".KWSK.",
    ".KWK..",
    "KWSK..",
    ".KSWK.",
    "..KSWK",
    "..KSSK",
]
FIO_CORES = {"K": (16, 16, 16), "W": (241, 237, 237), "S": (218, 210, 216), "G": (131, 131, 131)}
PONTA = [
    "KDK",
    "KDK",
    ".K.",
]
PONTA_LONGA = [
    "KDDK",
    ".KDK",
    ".KDK",
    "..K.",
]
PONTA_CORES = {"K": (0, 0, 0), "D": (35, 35, 35)}


# a FUMAÇA BRANCA da MEGA DARKRAI saindo do alto da cabeça, em S (à mão; o
# contorno é cinza como o do cabelo, pra ela nascer DO cabelo)
FUMACA = [
    ".......ii...",
    "......irri..",
    ".....irroi..",
    ".....iroi...",
    "....irroi...",
    "....iroi....",
    "...irroi....",
    "...iroi.....",
    "..irroi.....",
    "...iroi.....",
    "...irroi....",
    "....rro.....",
]
FUMACA_CORES = {"i": (131, 131, 131), "r": (241, 237, 237), "o": (218, 210, 216), "m": (173, 181, 189), "x": (173, 181, 189)}
# as PONTAS RASGADAS penduradas na cauda do vestido e os ESPINHOS dos braços
RASGO = [
    "affda",
    ".afda",
    ".ada.",
    "..a..",
]
ESPINHO_ESQ = [
    "a...",
    "aa..",
    "aga.",
    "agfa",
]
ESPINHO_DIR = [
    "...a",
    "..aa",
    ".aga",
    "afga",
]
SOMBRA = {"a": (0, 0, 0), "d": (35, 35, 35), "f": (69, 61, 61), "g": (86, 81, 90)}


def gardevoir():
    f = abre("282.png")
    recolore(f, [
        ((0, 0, 95, 30), GD_OLHO, False),
        ((0, 0, 95, 31), GD_CABELO, False),
        ((0, 32, 95, 95), GD_BRACO, False),
        ((0, 30, 95, 45), GD_GOLA, False),
        ((0, 40, 95, 95), GD_VESTIDO, False),
    ])
    px = f.load()
    for y in range(0, 11):                          # o fio fino de antes sai
        for x in range(30, 46):
            px[x, y] = (0, 0, 0, 0)
    pinta(f, FUMACA, 31, 0, FUMACA_CORES)
    for x in (58, 65, 72, 79):                      # penduradas na cauda do vestido
        encosta(f, RASGO, x, 60, 80, SOMBRA)
    for x in (24, 33):                              # e na barra da frente
        encosta(f, RASGO, x, 76, 90, SOMBRA)
    for x in (19, 25):                              # em cima do braço esquerdo
        encosta(f, ESPINHO_ESQ, x, 34, 46, SOMBRA, embaixo=False)
    for x in (49, 56, 62):                          # e do direito
        encosta(f, ESPINHO_DIR, x, 34, 48, SOMBRA, embaixo=False)
    c = abre("back/282.png")
    recolore(c, [
        ((0, 0, 95, 46), GD_CABELO, False),
        ((0, 47, 95, 95), GD_BRACO, False),
        ((0, 0, 95, 95), GD_GOLA, False),
        ((0, 0, 95, 95), GD_VESTIDO, False),
    ])
    return f, c


# ------------------------------------------------- TATSUGIRI DIANCIITA
# o laranja vira o ROSA dos cristais da MEGA DIANCIE e nasce uma COROA de três
# cristais em cima da cabeça
TD_ROSA = {
    (255, 105, 44): (242, 145, 178), (209, 72, 27): (217, 87, 152), (154, 52, 32): (166, 58, 112),
    (255, 170, 132): (255, 204, 217), (239, 121, 82): (217, 87, 152), (248, 134, 78): (242, 145, 178),
    (255, 139, 96): (255, 204, 217),
    # as costas
    (243, 115, 54): (242, 145, 178), (117, 39, 16): (166, 58, 112), (204, 117, 87): (217, 87, 152),
    (180, 67, 26): (217, 87, 152), (255, 182, 139): (255, 204, 217), (248, 149, 94): (242, 145, 178),
    (255, 157, 96): (255, 204, 217),
}
CRISTAL_ALTO = [
    ".KK.",
    "KWAK",
    "KWAK",
    "KDAK",
    "KDAK",
    "KDAK",
    "KPAK",
    "KPAK",
]
CRISTAL = [
    ".KK.",
    "KWAK",
    "KDAK",
    "KPAK",
    "KPAK",
]
CRISTAL_CORES = {"K": (16, 16, 16), "W": (255, 249, 251), "D": (255, 204, 217), "P": (242, 145, 178), "A": (166, 58, 112)}


# as FITAS BRANCAS da MEGA DIANCIE, saindo das costas e caindo em curva (à
# mão). Vão ATRÁS do corpo: só pintam onde está vazio.
FITA = [
    "......KKKK........",
    "....KKWWWWKK......",
    "...KWWWWWWWWK.....",
    "..KWWSSSSWWWWK....",
    ".KWSKKKKKSSWWWK...",
    ".KSK.....KKSWWWK..",
    "KSK........KSWWK..",
    "KK..........KSWWK.",
    "............KSWWK.",
    ".............KSWWK",
    ".............KSWWK",
    ".............KSWWK",
    ".............KGSWK",
    "............KGSWWK",
    "............KGSWK.",
    "...........KGSWWK.",
    "...........KGSWK..",
    "..........KGSWWK..",
    "..........KGSWK...",
    ".........KGSWK....",
    ".........KGWK.....",
    "........KGWK......",
    "........KWK.......",
    ".......KWK........",
    ".......KK.........",
]
FITA_CORES = {"K": (24, 24, 24), "W": (255, 249, 251), "S": (227, 219, 224), "G": (179, 161, 179)}
DIAMANTE = [
    "..K..",
    ".KWK.",
    "KDPAK",
    ".KAK.",
    "..K..",
]


def atras(im, grade, x0, y0, cores):
    """pinta só onde está vazio: a peça fica atrás do bicho"""
    px = im.load()
    for j, linha in enumerate(grade):
        for i, ch in enumerate(linha):
            x, y = x0 + i, y0 + j
            if ch != "." and 0 <= x < im.width and 0 <= y < im.height and px[x, y][3] == 0:
                px[x, y] = cores[ch] + (255,)


def tatsugiri():
    f = abre("978.png")
    recolore(f, [(TODA, TD_ROSA, False)])
    pinta(f, CRISTAL, 43, 32, CRISTAL_CORES)
    pinta(f, CRISTAL, 52, 31, CRISTAL_CORES)
    pinta(f, CRISTAL_ALTO, 47, 27, CRISTAL_CORES)
    atras(f, FITA, 50, 30, FITA_CORES)
    atras(f, [linha[::-1] for linha in FITA], 17, 38, FITA_CORES)
    c = abre("back/978.png")
    recolore(c, [(TODA, TD_ROSA, False)])
    return f, c


# ------------------------------------------------- DIANCIE TATSUGIRITA
# os cristais rosa viram o LARANJA da MEGA TATSUGIRI, a saia de diamante ganha
# as listras de arco-íris dela (amarelo, verde, roxo, azul, de cima pra baixo)
# e o corpo cinza vira rosa-choque
DT_LARANJA = {(242, 145, 178): (243, 115, 54), (166, 58, 112): (117, 39, 16),
              (255, 204, 217): (255, 182, 139), (217, 87, 152): (193, 47, 109)}
DT_CORPO = {(179, 161, 179): (252, 93, 142), (128, 115, 128): (193, 47, 109)}
LISTRAS = [((44, 45), (255, 230, 58)), ((46, 47), (98, 246, 149)), ((48, 49), (194, 113, 253)), ((50, 53), (70, 181, 251))]


def listras(im, x0, x1, branco=(242, 242, 242)):
    px = im.load()
    for (y0, y1), cor in LISTRAS:
        for y in range(y0, y1 + 1):
            for x in range(x0, x1 + 1):
                if px[x, y][3] and px[x, y][:3] == branco:
                    px[x, y] = cor + (255,)


# a ONDA DE ARCO-ÍRIS em que o trio da MEGA TATSUGIRI anda, passando atrás
# da saia de diamante; o RAMINHO verde e as OVAS laranja em volta da coroa (à mão)
ONDA = [
    "KKKK........................................................",
    "PPPPKKK..........................................KKKKK......",
    "VVVPPPPKKK..................................KKKKKPPPPPKK....",
    "IIVVVVPPPPKKKK........................KKKKKKPPPPPPVVVVVPPK..",
    "BBIIIIVVVVPPPPKKKKKK..........KKKKKKKPPPPPPVVVVVVIIIIIVVVPK.",
    "KBBBBIIIIVVVVVPPPPPPKKKKKKKKKKPPPPPPPVVVVVVVIIIIIIBBBBBIIVPK",
    ".KKKBBBBBIIIIIVVVVVVPPPPPPPPPPVVVVVVVIIIIIIIBBBBBBKKKKKBBIVK",
    "....KKKKKBBBBBIIIIIIVVVVVVVVVVIIIIIIIBBBBBBBKKKKKK.....KKBBK",
    ".........KKKKKBBBBBBIIIIIIIIIIBBBBBBBKKKKKKK..........KKK..",
    "..............KKKKKKBBBBBBBBBBKKKKKKK.....................",
    "....................KKKKKKKKKK...........................",
]
ONDA_CORES = {"K": (16, 16, 16), "P": (252, 93, 142), "V": (194, 113, 253), "I": (109, 93, 255), "B": (70, 181, 251)}
RAMINHO = [
    "D...D...D",
    "GD..GD.DG",
    ".GD.G.DG.",
    ".GGDGDGG.",
    "..GGGGG..",
    "...DGD...",
]
OVA = [
    ".KK.",
    "KHOK",
    "KOOK",
    ".KK.",
]
ENFEITE_CORES = {"K": (117, 39, 16), "D": (49, 115, 41), "G": (98, 246, 149), "O": (236, 64, 36), "H": (255, 214, 120)}


def diancie():
    f = abre("719.png")
    recolore(f, [(TODA, DT_LARANJA, False), ((0, 54, 95, 95), DT_CORPO, False)])
    listras(f, 27, 68)
    atras(f, ONDA, 18, 66, ONDA_CORES)
    atras(f, RAMINHO, 44, 13, ENFEITE_CORES)        # nasce no vão do meio da coroa
    for x, y in ((35, 18), (37, 15), (56, 15), (59, 18), (58, 12)):   # as ovas grudadas nos lados
        atras(f, OVA, x, y, ENFEITE_CORES)
    c = abre("back/719.png")
    recolore(c, [(TODA, DT_LARANJA, False), ((0, 54, 95, 95), DT_CORPO, False)])
    return f, c


# ------------------------------------------------- GYARADOS RAYQUAZITA
# o azul vira o VERDE da MEGA RAYQUAZA, as barbatanas ficam douradas e da
# cabeça saem as FITAS DOURADAS dela, voando por trás do corpo (à mão)
GY_CORES = {
    (65, 180, 238): (54, 176, 117), (32, 139, 172): (61, 125, 109), (24, 98, 148): (34, 82, 62),
    (24, 65, 115): (24, 60, 45), (123, 213, 238): (96, 210, 147),
    (205, 180, 123): (197, 164, 0), (246, 230, 172): (251, 226, 126), (90, 65, 32): (131, 98, 49),
    (246, 246, 246): (251, 226, 126), (213, 222, 246): (246, 222, 0), (115, 123, 123): (197, 164, 0),
}
FITA_OURO = [
    "..............................................OOOO........",
    ".....................................OOOO....OOYYYYOO......",
    "..........................OOOOO...OOYYYYOOOOYYOOOOYYO.....",
    "...................OOOOOOOYYYYYOOOYYOOOOYYYYOO......OYO....",
    "..............OOOOOYYYYYYYOOOOOYYYOO.....OOOO........OYO...",
    "...........OOOYYYYYOOOOOOO.....OOO....................OYO..",
    ".........OOYYYOOOO.....................................OYO.",
    ".......OOYYOO..........................................OYO.",
    "......OYYOO...........................................OYYO.",
    ".....OYOO...........................................OOYYO..",
    "....OYO............................................OYYOO...",
    "...OYO.............................................OYO.....",
    "..OYO..............................................OO......",
    ".OYO......................................................",
    "OYO.......................................................",
    "OO........................................................",
]
BIGODE = [
    "OO...",
    "OYO..",
    ".OYO.",
    "..OYO",
    "..OYO",
    ".OYO.",
    "OYO..",
    "OO...",
]
OURO = {"O": (252, 148, 54), "Y": (251, 226, 126)}


def gyarados():
    f = abre("130.png")
    recolore(f, [(TODA, GY_CORES, False)])
    atras(f, FITA_OURO, 10, 17, OURO)
    atras(f, BIGODE, 1, 60, OURO)
    c = abre("back/130.png")
    recolore(c, [(TODA, GY_CORES, False)])
    return f, c


# ------------------------------------------------- PIKACHU RAICHITA X
# laranja como a MEGA RAICHU X, o rabo vira um RAIO GIGANTE deitado e nascem
# os ESPINHOS ESCUROS atrás da cabeça (à mão)
PKX_CORES = {(246, 230, 82): (249, 191, 57), (246, 189, 32): (242, 155, 16), (222, 148, 0): (187, 97, 57),
             (98, 49, 8): (134, 65, 32), (255, 246, 164): (255, 227, 98)}
RABO_X = [
    "..........................aaaaaaaa",
    ".........................aYYYYYYYa",
    "........................aYYYYYYYOa",
    ".......................aYYYYYYYOOa",
    "......................aYYYYYYYOOa.",
    ".....................aYYYYYYYOOa..",
    "....................aYYYYYYYOOa...",
    "...................aYYYYYYYOOa....",
    "..................aYYYYYYYOOOaaaa.",
    ".................aYYYYYYYYYOOOOOa.",
    "................aYYYYYYYYYYYOOOa..",
    "...............aaaaaaaYYYYYYOOa...",
    ".....................aYYYYYOOa....",
    "....................aYYYYYOOa.....",
    "...................aYYYYYOOa......",
    "...........aaaaa..aYYYYYOOa.......",
    "..........aOYYYaaaYYYYYOOa........",
    ".........aOYYYYYYYYYYYOOa.........",
    "........aNOYYYYYYYYYYOOa..........",
    ".......aNNOOYYYYYYYOOa............",
    "......aNNNOOOOYYYOOa..............",
    ".....aNNNaaaaaaaaaa...............",
    "....aNNBa.........................",
    "...aNNBa..........................",
    "..aNBBa...........................",
    ".aBBBa............................",
    "aBBa..............................",
]
CRISTA_X = [
    "aaa.........",
    "aGGaa.......",
    "aGGGGaaa....",
    ".aGDGGGGaa..",
    ".aGDDGGGGGa.",
    "..aDDDDDaa..",
    "..aGGDDDGaaa",
    "...aGDDDDGGa",
    "...aDDDDaaa.",
    "....aaaa....",
]
RAIO_CORES = {"a": (0, 0, 0), "Y": (255, 227, 98), "O": (249, 191, 57), "N": (242, 155, 16), "B": (156, 82, 0),
              "G": (91, 85, 86), "D": (50, 43, 42)}


def tira_rabo(im):
    """some com o rabo velho do PIKACHU: tudo à direita das costas, sem
    encostar na orelha (que vai até a linha 36)"""
    px = im.load()
    for y in range(35, 62):
        for x in range(61 if y < 37 else 54, 72):
            px[x, y] = (0, 0, 0, 0)


def pikachu_x():
    f = abre("025.png")
    tira_rabo(f)
    recolore(f, [(TODA, PKX_CORES, False)])
    atras(f, CRISTA_X, 50, 37, RAIO_CORES)
    atras(f, RABO_X, 52, 30, RAIO_CORES)
    c = abre("back/025.png")
    recolore(c, [(TODA, PKX_CORES, False)])
    return f, c


# ------------------------------------------------- PIKACHU RAICHITA Y
# laranja como a MEGA RAICHU Y, das orelhas saem dois RAIOS enormes e o rabo
# vira um fio fino com um raio na ponta (à mão)
PKY_CORES = {(246, 230, 82): (250, 188, 39), (246, 189, 32): (222, 123, 49), (222, 148, 0): (186, 123, 34),
             (156, 82, 0): (161, 101, 40), (98, 49, 8): (123, 74, 41), (255, 246, 164): (255, 241, 92)}
RAIO_ORELHA = [
    "aaaa............",
    "aYYYaa..........",
    ".aYYYYa.........",
    "..aYYYYa........",
    "...aYYYOa.......",
    "...aYYYYOa......",
    "....aYYYYOa.....",
    "....aaaYYYOa....",
    ".......aYYYOa...",
    "......aYYYYOa...",
    ".....aYYYYOa....",
    "....aaaYYYYOa...",
    ".......aYYYYOa..",
    "........aYYYYOa.",
    ".........aYYYOa.",
    "..........aYYOa.",
    "..........aYYOa.",
    "...........aYOa.",
    "...........aYOa.",
    "............aOa.",
    "............aBa.",
    ".............a..",
]
FIO = [
    "aa...................",
    ".aa..................",
    "..aaa................",
    "....aaa..............",
    "......aaaa...........",
    ".........aaaa........",
    "............aaaaaaaaa",
]
RAIO_PONTA = [
    "..........aaaa..........",
    ".........aYYYYa.........",
    "........aYYYYOa.........",
    ".......aYYYYOa..........",
    "......aYYYYOaaaaaaaa....",
    ".....aYYYYYYYYYYYYYOa...",
    "....aYYYYYYYYYYYYYOOa...",
    "...aOOOOOOOYYYYYYOOa....",
    "..aaaaaaaaaYYYYYOOa.....",
    "..........aYYYYOOaaaaaa.",
    ".........aYYYYYYYYYYYYYa",
    "........aYYYYYYYYYYYYOOa",
    ".......aOOOOOYYYYYYOOOa.",
    "......aaaaaaaYYYYOOOa...",
    "............aYYYOOa.....",
    "...........aYYOOa.......",
    "..........aYOOa.........",
    "..........aaa...........",
]
RAIO_Y = {"a": (0, 0, 0), "Y": (255, 242, 59), "O": (249, 182, 37), "B": (186, 123, 34)}


def pikachu_y():
    f = abre("025.png")
    tira_rabo(f)
    recolore(f, [(TODA, PKY_CORES, False)])
    atras(f, RAIO_ORELHA, 20, 3, RAIO_Y)
    atras(f, [l[::-1] for l in RAIO_ORELHA], 57, 10, RAIO_Y)
    atras(f, FIO, 52, 54, RAIO_Y)
    atras(f, RAIO_PONTA, 64, 46, RAIO_Y)
    c = abre("back/025.png")
    recolore(c, [(TODA, PKY_CORES, False)])
    return f, c


# ------------------------------------------------- LUCARIO MEWTWONITA X
# o azul vira o ROXO da MEGA MEWTWO X, o preto vira o lilás dela e nasce o
# RABO GROSSO roxo que ela tem, subindo por trás das costas (à mão)
LU_CORES = {
    (41, 115, 156): (148, 65, 189), (74, 156, 239): (180, 74, 238), (16, 74, 123): (106, 49, 156),
    (58, 58, 58): (131, 123, 156), (90, 90, 90): (180, 172, 197), (132, 132, 132): (222, 213, 230),
    (181, 181, 99): (180, 172, 197), (230, 230, 156): (238, 230, 238), (82, 66, 33): (57, 57, 82),
}
RABO_MEWTWO = [
    "..............aaaa....",
    ".............aLPPDa...",
    "............aLPPPDa...",
    "............aPPPDDa...",
    "............aPPDDa....",
    "...........aLPPDDa....",
    "...........aPPPDa.....",
    "..........aLPPDDa.....",
    "..........aPPPDDa.....",
    "..........aPPPDDa.....",
    "..........aPPPDDa.....",
    "..........aPPPDDVa....",
    "..........aLPPDDVa....",
    "..........aLPPDDVa....",
    "..........aLPPDDVa....",
    ".........aLPPPDDVa....",
    ".........aLPPDDVa.....",
    "........aLPPPDDVa.....",
    ".......aLPPPDDVa......",
    "......aLPPPDDVa.......",
    ".....aLPPPDDVa........",
    "...aaLPPPDDVa.........",
    ".aaLPPPPDDVa..........",
    "aLLPPPDDVVa...........",
    "aPPPDDVVaa............",
    ".aaaaaaa..............",
]
ROXO_MEWTWO = {"a": (16, 16, 16), "P": (148, 65, 189), "D": (106, 49, 156), "V": (57, 32, 82), "L": (180, 74, 238)}


def lucario():
    f = abre("448.png")
    recolore(f, [(TODA, LU_CORES, False)])
    atras(f, RABO_MEWTWO, 44, 30, ROXO_MEWTWO)
    c = abre("back/448.png")
    recolore(c, [(TODA, LU_CORES, False)])
    return f, c


# ------------------------------------------------- STARMIE GLIMMORITA
# os braços viram as PÉTALAS AZUIS de cristal da MEGA GLIMMORA, com a PONTA
# acesa de ciano; a moldura dourada vira cristal verde-água; atrás passa a
# LANÇA escura dela e em volta flutuam CAQUINHOS de cristal (à mão)
ST_CORES = {
    (90, 82, 156): (41, 78, 220), (139, 115, 189): (39, 107, 255), (49, 57, 115): (26, 48, 134),
    (180, 139, 213): (127, 97, 255), (213, 172, 238): (160, 200, 255),
    (197, 148, 32): (0, 165, 207), (238, 197, 74): (92, 237, 221), (90, 65, 49): (8, 94, 85),
    (148, 115, 65): (20, 120, 140), (255, 230, 148): (190, 255, 245),
}
BRACO = {(41, 78, 220), (39, 107, 255), (26, 48, 134), (127, 97, 255), (160, 200, 255)}
CACO = [
    ".C.",
    "CWC",
    ".C.",
]
CACO_GRANDE = [
    "..K..",
    ".KWK.",
    "KCWCK",
    ".KCK.",
    "..K..",
]
CRISTAL_AZUL = {"K": (20, 38, 108), "C": (0, 165, 207), "W": (92, 237, 221)}


def pontas_acesas(im, cx=47, cy=47):
    """a ponta de cada braço acende: quanto mais longe do meio, mais ciano"""
    px = im.load()
    for y in range(im.height):
        for x in range(im.width):
            if not px[x, y][3] or px[x, y][:3] not in BRACO:
                continue
            d = ((x - cx) ** 2 + (y - cy) ** 2) ** 0.5
            if d > 22:
                px[x, y] = (92, 237, 221, 255)
            elif d > 19:
                px[x, y] = (0, 165, 207, 255)


def lanca(im):
    """a LANÇA da MEGA GLIMMORA: reta, entrando por trás, do canto de cima"""
    px = im.load()
    for x in range(2, 44):
        y = round(28 + (x - 2) * 0.42)
        for dy, cor in ((-1, (0, 0, 0)), (0, (8, 94, 85)), (1, (26, 62, 79)), (2, (0, 0, 0))):
            if px[x, y + dy][3] == 0:
                px[x, y + dy] = cor + (255,)
    for dy in range(-1, 3):                         # a ponta, fechada
        if px[1, round(28 - 0.42) + dy][3] == 0 and dy in (0, 1):
            px[1, 28 + dy] = (0, 0, 0, 255)


def starmie():
    f = abre("121.png")
    recolore(f, [(TODA, ST_CORES, False)])
    pontas_acesas(f)
    lanca(f)
    for g, x, y in ((CACO_GRANDE, 76, 14), (CACO, 14, 72), (CACO, 80, 70), (CACO_GRANDE, 10, 12), (CACO, 70, 84)):
        atras(f, g, x, y, CRISTAL_AZUL)
    c = abre("back/121.png")
    recolore(c, [(TODA, ST_CORES, False)])
    pontas_acesas(c)
    return f, c


FEITAS = {
    "fus-starmie-megaglimmora": starmie,
    "fus-gyarados-megarayquaza": gyarados,
    "fus-pikachu-megaraichux": pikachu_x,
    "fus-pikachu-megaraichuy": pikachu_y,
    "fus-lucario-megamewtwox": lucario,
    "fus-charizard-megablastoise": charizard,
    "fus-darkrai-megagardevoir": darkrai,
    "fus-gardevoir-megadarkrai": gardevoir,
    "fus-tatsugiri-megadiancie": tatsugiri,
    "fus-diancie-megatatsugiri": diancie,
}

if __name__ == "__main__":
    os.makedirs(PASTA, exist_ok=True)
    for id_, faz in FEITAS.items():
        f, c = faz()
        f.save(os.path.join(PASTA, id_ + ".png"))
        c.save(os.path.join(PASTA, id_ + "_costas.png"))
        print("ok", id_)
