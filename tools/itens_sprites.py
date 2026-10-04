#!/usr/bin/env python3
"""OS ÍCONES DOS ITENS, desenhados em código, 16x16.

Cada item que cabe na mochila tem um desenho aqui — as bolas, a poção, as
pedras, as megapedras, os cristais Z, os fósseis da mina, os pandeiros, os
ingredientes do acampamento, os itens-chave. Saem em
assets/sprites/itens/<slug>.png, que é onde o jogo procura
(src/core/itens.js). O slug é o nome do item sem acento, minúsculo, com hífen
no lugar de espaço e ponto: "pedra do trovão" -> pedra-do-trovao.png,
"visor-g.l.i.t.c.h" -> visor-g-l-i-t-c-h.png.

Alguns desenhos são de FAMÍLIA, e servem pro que o jogo inventa em tempo de
execução ou pro que uma DLC trouxer depois: ovo.png (os OVOS DA CRECHE: "ovo de
pichu"), megapedra.png, cristal-z.png, fossil.png, pedra.png, bola.png,
pandeiro.png, bilhete.png e, por último, item.png — a sacolinha de quem não
tem desenho nenhum.

    python3 tools/itens_sprites.py                     # grava tudo
    python3 tools/itens_sprites.py --folha=/tmp/f.png  # e a folha de contato
    python3 tools/itens_sprites.py --lista             # só imprime os nomes

Os desenhos são linhas de texto, uma letra por pixel, como o spriteFromRows
de src/core/assets.js: '.' é transparente, 'k' é o contorno, o resto vem da
paleta de cada item. Nada de antialias: em 16x16 borda borrada vira sujeira.
"""
import json
import os
import sys
import unicodedata

from PIL import Image

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DESTINO = os.path.join(RAIZ, "assets", "sprites", "itens")
LADO = 16

K = (30, 26, 34, 255)          # o contorno de tudo
BRANCO = (248, 248, 248, 255)
CINZA = (200, 200, 208, 255)


def slug(nome):
    """Mesma conta de src/core/itens.js — os dois têm que bater."""
    s = unicodedata.normalize("NFD", nome.lower())
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    out, sep = [], False
    for c in s:
        if c.isalnum():
            out.append(c); sep = False
        elif not sep and out:
            out.append("-"); sep = True
    return "".join(out).rstrip("-")


def hexa(h, a=255):
    h = h.lstrip("#")
    return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16), a)


def mistura(c, alvo, q):
    return tuple(round(c[i] + (alvo[i] - c[i]) * q) for i in range(3)) + (255,)


clarear = lambda c, q=0.35: mistura(c, (255, 255, 255), q)
escurecer = lambda c, q=0.30: mistura(c, (0, 0, 0), q)


def compor(*camadas):
    """Sobrepõe desenhos: o que não é '.' na camada de cima cobre a de baixo."""
    base = [list(l.ljust(LADO, ".")) for l in camadas[0]]
    while len(base) < LADO:
        base.append(list("." * LADO))
    for cam in camadas[1:]:
        for y, linha in enumerate(cam):
            for x, ch in enumerate(linha):
                if ch != ".":
                    base[y][x] = ch
    return ["".join(l) for l in base]


def desenhar(linhas, paleta):
    img = Image.new("RGBA", (LADO, LADO), (0, 0, 0, 0))
    pal = dict(paleta)
    pal.setdefault("k", K)
    for y, linha in enumerate(compor(linhas)):
        assert len(linha) == LADO, (y, linha)
        for x, ch in enumerate(linha):
            if ch == ".":
                continue
            cor = pal[ch]
            img.putpixel((x, y), cor)
    return img


def tons(cor):
    """A cor, o claro dela e o escuro dela: base, brilho e sombra."""
    c = hexa(cor) if isinstance(cor, str) else cor
    return c, clarear(c), escurecer(c)


ITENS = {}     # nome do item -> Image
FAMILIAS = {}  # slug da família -> Image


def item(nome, linhas, paleta):
    ITENS[nome] = desenhar(linhas, paleta)


def familia(nome, linhas, paleta):
    FAMILIAS[nome] = desenhar(linhas, paleta)


# ============================================================ AS BOLAS
BOLA = [
    "................",
    ".....kkkkkk.....",
    "...kkTTTTTTkk...",
    "..kTHHTTTTTTTk..",
    ".kTHTTTTTTTTTTk.",
    ".kTTTTTTTTTTTTk.",
    "kTTTTTTTTTTTTTTk",
    "kTTTTTkkkkTTTTTk",
    "kkkkkkkWWkkkkkkk",
    "kWWWWkkWWkkWWWWk",
    "kWWWWWkkkkWWWWWk",
    ".kWWWWWWWWWWWWk.",
    ".kWWWWWWWWWWWWk.",
    "..kWWWWWWWWWSk..",
    "...kkWWWWSSkk...",
    ".....kkkkkk.....",
]
GREAT = [
    "................",
    "................",
    "................",
    "...RR......RR...",
    "..RRR......RRR..",
    "..RR........RR..",
]
ULTRA = [
    "................",
    "................",
    "................",
    "....YY....YY....",
    "...YY......YY...",
    "..YY........YY..",
]
RUIDO = [
    "................",
    "................",
    ".......G........",
    "..........G.....",
    "...G............",
    "............G...",
    "......G.........",
    "..........GG....",
    "..G.............",
    ".........G......",
    "....G.......G...",
    "..............G.",
    "......G.........",
    "...........G....",
    "....G...........",
]
T, H, _ = tons("#e04848")
item("poké bola", BOLA, {"T": T, "H": H, "W": BRANCO, "S": CINZA})
T, H, _ = tons("#3868d8")
item("great ball", compor(BOLA, GREAT), {"T": T, "H": H, "W": BRANCO, "S": CINZA, "R": hexa("#e04848")})
T, H, _ = tons("#383848")
item("ultra ball", compor(BOLA, ULTRA), {"T": T, "H": clarear(T, 0.5), "W": BRANCO, "S": CINZA, "Y": hexa("#f8d030")})
T, H, _ = tons("#a040c0")
item("glitchball", compor(BOLA, RUIDO), {"T": T, "H": H, "W": hexa("#c8b0e0"), "S": hexa("#9880b8"), "G": hexa("#40f0e0")})
T, H, _ = tons("#b04050")
familia("bola", BOLA, {"T": T, "H": H, "W": BRANCO, "S": CINZA})

# ============================================================ REMÉDIO E DOCE
POCAO = [
    "................",
    "......kkk.......",
    ".....kNNNkk.....",
    ".....kNkNNk.....",
    "....kkkkkkk.....",
    "....kPPPPPk.....",
    "...kPPPPPPPk....",
    "..kPPHPPPPPPk...",
    "..kPPHPPPPPPk...",
    "..kPPHPLLLPPk...",
    "..kPPHPLRLPPk...",
    "..kPPPPLLLPPk...",
    "..kPPPPPPPPPk...",
    "..kPPPPPPPPPk...",
    "...kPPPPPPPk....",
    "....kkkkkkk.....",
]
P, H, _ = tons("#a058d8")
item("poção", POCAO, {"P": P, "H": clarear(P, 0.5), "N": hexa("#e8e8f0"), "L": BRANCO, "R": hexa("#e04848")})

DOCE = [
    "................",
    "................",
    "................",
    "................",
    "kk...kkkkkk...kk",
    "kWk.kCCCCCCk.kWk",
    "kWWkCCHCCCCCkWWk",
    ".kWWCCHCCCCCWWk.",
    ".kWWCCCCCCCCWWk.",
    "kWWkCCCCCCCDkWWk",
    "kWk.kCCCCDDk.kWk",
    "kk...kkkkkk...kk",
    "................",
]
C, H, D = tons("#4878e8")
item("doce raro", DOCE, {"C": C, "H": H, "D": D, "W": hexa("#e8f0ff")})

# ============================================================ AS PEDRAS DE EVOLUÇÃO
PEDRA = [
    "................",
    "....kkkkkkk.....",
    "..kkBBBBBBBkk...",
    ".kBBLLBBBBBBBk..",
    ".kBLBBBBBBBBBBk.",
    "kBBBBBBBBBBBBBk.",
    "kBBBBBBBBBBBBBBk",
    "kBBBBBBBBBBBBBDk",
    "kBBBBBBBBBBBBDDk",
    "kBBBBBBBBBBBDDDk",
    ".kBBBBBBBBBDDDk.",
    ".kDBBBBBBBDDDDk.",
    "..kkDDDDDDDDkk..",
    "....kkkkkkkk....",
]
FOGO = [
    "................", "................", "................", "................",
    ".......M........",
    ".......MM.......",
    "......MMM.......",
    "......MNMM......",
    ".....MNNMM......",
    ".....MNNNMM.....",
    "......MMMM......",
]
FOLHA = [
    "................", "................", "................", "................", "................",
    "..........MM....",
    ".........MMMM...",
    "........MNMMM...",
    ".......MMNMM....",
    "......MMMNM.....",
    ".....MM..N......",
]
AGUA = [
    "................", "................", "................", "................",
    ".......M........",
    "......MMM.......",
    "......MMM.......",
    ".....MMNMM......",
    ".....MMNMM......",
    "......MMM.......",
]
TROVAO = [
    "................", "................", "................", "................",
    "........MM......",
    ".......MM.......",
    "......MMMM......",
    ".......MMM......",
    "........MM......",
    ".......MM.......",
    "......M.........",
]
LUA = [
    "................", "................", "................", "................",
    "........MMM.....",
    ".......MM.......",
    "......MM........",
    "......MM........",
    "......MM........",
    ".......MM.......",
    "........MMM.....",
]
GELO = [
    "................", "................", "................", "................", "................",
    "........M.......",
    ".....M..M..M....",
    "......M.M.M.....",
    ".....MMMMMMM....",
    "......M.M.M.....",
    ".....M..M..M....",
    "........M.......",
]
CREPUSCULO = [
    "................", "................", "................", "................", "................", "................",
    "........M.......",
    ".......MNM......",
    "........M.......",
]


def pedra(nome, cor, motivo, m, n=None):
    B, L, D = tons(cor)
    item(nome, compor(PEDRA, motivo), {"B": B, "L": L, "D": D, "M": hexa(m), "N": hexa(n or m)})


pedra("pedra do fogo", "#e8a038", FOGO, "#e83028", "#f8e060")
pedra("pedra da folha", "#78c850", FOLHA, "#286828", "#a8e878")
pedra("pedra da água", "#58a8e8", AGUA, "#2048a8", "#c8e8ff")
pedra("pedra do trovão", "#68c870", TROVAO, "#f8e030")
pedra("pedra da lua", "#5858a0", LUA, "#f8f0c0")
pedra("pedra do gelo", "#a8e0f0", GELO, "#4888c8")
pedra("pedra do crepúsculo", "#302838", CREPUSCULO, "#a060d0", "#e8c8ff")
B, L, D = tons("#9898a8")
familia("pedra", PEDRA, {"B": B, "L": L, "D": D})

# ============================================================ OS ESTRANGEIROS
UPGRADE = [
    "................",
    "................",
    "..kkkkkkkkkkkk..",
    ".kGGGGGGGGGGGGk.",
    ".kGkkkkkkkkkkGk.",
    ".kGkSSSSSSSSkGk.",
    ".kGkSHSSSSSSkGk.",
    ".kGkSSSSSSSSkGk.",
    ".kGkkkkkkkkkkGk.",
    ".kGGGGGGGGGGGGk.",
    ".kGRRGGYYGGBBGk.",
    ".kGRRGGYYGGBBGk.",
    ".kGGGGGGGGGGGGk.",
    "..kkkkkkkkkkkk..",
]
G, _, _ = tons("#a8a8b8")
item("up-grade", UPGRADE, {"G": G, "S": hexa("#40b860"), "H": hexa("#b0f8c0"),
                            "R": hexa("#e04848"), "Y": hexa("#f8d030"), "B": hexa("#3868d8")})
DISCO = [
    "................",
    ".....kkkkkk.....",
    "...kkDDDDDDkk...",
    "..kDDHDDDDDDDk..",
    ".kDDHDDDDDDDDDk.",
    ".kDDDDDkkDDDDDk.",
    "kDDDDDkWWkDDDDDk",
    "kDDDDDkWWkDDDDDk",
    "kDDDDDDkkDDDDDDk",
    ".kDDDDDDDDDDDDk.",
    ".kDDDDDDDDDDEDk.",
    "..kDDDDDDDDEDk..",
    "...kkDDDDDDkk...",
    ".....kkkkkk.....",
]
D, H, E = tons("#b090e0")
item("dubious disc", DISCO, {"D": D, "H": clarear(D, 0.6), "E": E, "W": hexa("#f0e8ff")})

# ============================================================ AS MEGAPEDRAS
MEGA = [
    "................",
    ".....kkkkkk.....",
    "...kkAAAAAAkk...",
    "..kAHAAAAAABBk..",
    ".kAHAAAAAABBBBk.",
    ".kAAAAAAABBBBBk.",
    "kAAAAAAABBBBBBBk",
    "kAAAAAABBBBAAABk",
    "kAAAAABBBAAAAABk",
    "kAAABBBBAAAAAAAk",
    ".kBBBBBAAAAAAAk.",
    ".kBBBBBBAAAAAAk.",
    "..kBBBBBBBAAAk..",
    "...kkBBBBBBkk...",
    ".....kkkkkk.....",
]
MEGAS = {
    "venusaurita": ("#58a848", "#e878a8"),
    "charizardita x": ("#3858c8", "#282838"),
    "charizardita y": ("#f08030", "#f8d030"),
    "blastoisita": ("#58a0f0", "#d8e0f0"),
    "beedrillita": ("#f0c030", "#383838"),
    "pidgeotita": ("#d8a860", "#e04848"),
    "alakazita": ("#f0d060", "#a86838"),
    "slowbronita": ("#f090b8", "#d8d8e0"),
    "gengarita": ("#7848b8", "#e04848"),
    "kangaskhanita": ("#c09878", "#8868a8"),
    "pinsirita": ("#a85838", "#d8d8e0"),
    "gyaradosita": ("#4868d8", "#e04848"),
    "aerodactylita": ("#a898c8", "#485868"),
    "mewtwonita x": ("#a888d8", "#40e0c8"),
    "mewtwonita y": ("#a888d8", "#e85858"),
}
for nome, (a, b) in MEGAS.items():
    A = hexa(a)
    item(nome, MEGA, {"A": A, "B": hexa(b), "H": clarear(A, 0.6)})
A = hexa("#e8e8f0")
item("missingnita", compor(MEGA, RUIDO), {"A": A, "B": hexa("#6858a8"), "H": BRANCO, "G": hexa("#40f0e0")})
A = hexa("#a8a8b0")
familia("megapedra", MEGA, {"A": A, "B": hexa("#686870"), "H": clarear(A, 0.6)})

ANEL = [
    "................",
    "................",
    "......kkkk......",
    ".....kMMMMk.....",
    "....kkkkkkkk....",
    "...kGGkkkkGGk...",
    "..kGGk....kGGk..",
    "..kGk......kGk..",
    "..kGk......kGk..",
    "..kGk......kGk..",
    "..kGGk....kGGk..",
    "...kGGk..kGGk...",
    "....kGGkkGGk....",
    ".....kkGGkk.....",
    ".......kk.......",
]
item("anel mega", ANEL, {"G": hexa("#f0c848"), "M": hexa("#58c8f0")})

# ============================================================ OS CRISTAIS Z
CRISTAL = [
    "................",
    "......kkkk......",
    ".....kCCCCk.....",
    "....kCHCCCCk....",
    "...kCHCCCCCCk...",
    "..kCCCCCCCCCCk..",
    ".kCCCCCCCCCCDDk.",
    ".kCCCCCkkkCCDDk.",
    ".kCCCCCCCkCCDDk.",
    ".kCCCCCCkCCCDDk.",
    ".kCCCCCkkkCCDDk.",
    "..kCCCCCCCCDDk..",
    "...kCCCCCCDDk...",
    "....kCCCCDDk....",
    ".....kCCDDk.....",
    "......kkkk......",
]
TIPOS_Z = {
    "normal": "#a8a878", "fogo": "#f08030", "agua": "#6890f0", "planta": "#78c850",
    "eletrico": "#f8d030", "gelo": "#98d8d8", "lutador": "#c03028", "veneno": "#a040a0",
    "terra": "#e0c068", "voador": "#a890f0", "psiquico": "#f85888", "inseto": "#a8b820",
    "pedra": "#b8a038", "fantasma": "#705898", "sombrio": "#705848", "aco": "#b8b8d0",
    "fada": "#ee99ac",
}
ESPECIAIS_Z = {
    "decidium z": "#58a058", "draconinum z": "#7038f8", "eevium z": "#c08850",
    "incinium z": "#d84838", "mewnium z": "#f0a0c8", "pikanium z": "#f8d030",
    "pikashunium z": "#f0c020", "primarium z": "#48a0e8", "snorlium z": "#489890",
}


def cristal(nome, cor, extra=None):
    C, H, D = tons(cor)
    item(nome, compor(CRISTAL, extra or []), {"C": C, "H": clarear(C, 0.6), "D": D})


for tipo, cor in TIPOS_Z.items():
    cristal(f"cristal z de {tipo}", cor)
for nome, cor in ESPECIAIS_Z.items():
    cristal(nome, cor)
C, H, D = tons("#d048d0")
item("glitchinium", compor(CRISTAL, RUIDO), {"C": C, "H": clarear(C, 0.6), "D": D, "G": hexa("#40f0e0")})
C, H, D = tons("#d8d8e0")
familia("cristal-z", CRISTAL, {"C": C, "H": BRANCO, "D": D})

# ============================================================ OS OVOS
OVO = [
    "................",
    "......kkkk......",
    ".....kEEEEk.....",
    "....kEHEEEEk....",
    "...kEHEEEEEEk...",
    "...kEEEEEEEEk...",
    "..kEEEEEEEEEEk..",
    "..kEEEEEEEEEEk..",
    "..kEEEEEEEEEEk..",
    "..kEEEEEEEEEDk..",
    "...kEEEEEEEDk...",
    "...kEEEEEEDDk...",
    "....kEEEDDDk....",
    ".....kkkkkk.....",
]
PINTAS = [
    "................", "................", "................", "................",
    ".........SS.....",
    "....SS...SS.....",
    "....SS..........",
    "........SS......",
    "...SS...SS......",
    "...SS......SS...",
    "......SS...SS...",
    "......SS........",
]
E, H, D = tons("#f0f0e8")
item("mystery egg", compor(OVO, PINTAS), {"E": E, "H": BRANCO, "D": D, "S": hexa("#68b860")})
item("super mystery egg", compor(OVO, PINTAS), {"E": E, "H": BRANCO, "D": D, "S": hexa("#f0b030")})
familia("ovo", compor(OVO, PINTAS), {"E": E, "H": BRANCO, "D": D, "S": hexa("#a8c8e8")})


# ============================================================ A SAÍDA
def folha_de_contato(pares, escala=4, por_linha=8, fundo=(28, 26, 36, 255)):
    """Todos juntos, ampliados e com o nome embaixo, pra olhar de uma vez."""
    from PIL import ImageDraw
    cel_w, cel_h = LADO * escala + 12, LADO * escala + 24
    linhas = (len(pares) + por_linha - 1) // por_linha
    folha = Image.new("RGBA", (cel_w * min(por_linha, len(pares)), cel_h * linhas), fundo)
    d = ImageDraw.Draw(folha)
    for i, (nome, im) in enumerate(pares):
        x, y = (i % por_linha) * cel_w + 6, (i // por_linha) * cel_h + 4
        folha.alpha_composite(im.resize((LADO * escala, LADO * escala), Image.NEAREST), (x, y))
        d.text((x, y + LADO * escala + 2), nome[:11], fill=(220, 220, 230, 255))
    return folha


def main(argv):
    # os desenhos moram em tools/itens_desenhos/lote_*.py; eles importam ESTE
    # módulo pelo nome, então o registro tem que ser o do módulo, não o do
    # __main__ — por isso o import de si mesmo
    import importlib
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    M = importlib.import_module("itens_sprites")
    pasta = os.path.join(os.path.dirname(os.path.abspath(__file__)), "itens_desenhos")
    for arq in sorted(os.listdir(pasta)):
        if arq.startswith("lote_") and arq.endswith(".py"):
            importlib.import_module("itens_desenhos." + arq[:-3])
    itens, familias = M.ITENS, M.FAMILIAS
    if "--lista" in argv:
        for n in sorted(itens): print(f"{n} -> {slug(n)}.png")
        for n in sorted(familias): print(f"[família] {n}.png")
        return
    os.makedirs(DESTINO, exist_ok=True)
    for nome, im in itens.items():
        im.save(os.path.join(DESTINO, slug(nome) + ".png"))
    for nome, im in familias.items():
        im.save(os.path.join(DESTINO, nome + ".png"))
    with open(os.path.join(DESTINO, "itens.json"), "w", encoding="utf-8") as f:
        json.dump({"itens": {n: slug(n) for n in sorted(itens)}, "familias": sorted(familias)},
                  f, ensure_ascii=False, indent=1)
    print(f"{len(itens)} itens + {len(familias)} famílias em {os.path.relpath(DESTINO, RAIZ)}/")
    for a in argv:
        if a.startswith("--folha="):
            so = [x for x in argv if x.startswith("--so=")]
            pares = sorted(itens.items()) + [(f"[{n}]", im) for n, im in sorted(familias.items())]
            if so:
                filtro = so[0][5:].split(",")
                pares = [(n, im) for n, im in pares if any(f in n for f in filtro)]
            folha_de_contato(pares).save(a[8:])
            print("folha:", a[8:])


if __name__ == "__main__":
    main(sys.argv[1:])
