#!/usr/bin/env python3
"""OS BICHOS DE BRAGLITCH, desenhados em código.

Dois tipos de arte saem daqui:

1. AS ESPÉCIES NOVAS (DIGGLE, TILAPISH, TRONKY e o SACI). Elas não existem em
   jogo nenhum, então não há PNG pra importar: são desenhadas por forma com
   tools/pixelart.py, frente e costas, e gravadas pelo número da Pokédex
   (assets/sprites/pokemon/1029.png etc.), que é onde o jogo procura.

2. AS FORMAS BRAGLITCHIANAS (SANDSHREW-BRAG, SEEL-BRAG...). É o bicho de
   sempre, criado do lado de cá do mar: o desenho é o da base com as cores
   trocadas pela paleta que a forma pede (a onça fica pintada, o boto fica
   rosa). Saem com o `spriteDex` de src/data/braglitch.js (21001.png...).

    python3 tools/braglitch_sprites.py            # grava tudo
    python3 tools/braglitch_sprites.py --folha=/caminho/folha.png   # e uma folha de contato

A lista das formas (id da base, arquivo, paleta) é LIDA de src/data/braglitch.js
— a tabela de lá é a única que existe; aqui só se pinta.
"""
import colorsys
import math
import os
import re
import sys

from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from pixelart import Tela, folha_de_contato, clarear, escurecer  # noqa: E402

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FRENTE = os.path.join(RAIZ, "assets", "sprites", "pokemon")
COSTAS = os.path.join(FRENTE, "back")

BRANCO = (250, 250, 250, 255)
PRETO = (30, 26, 34, 255)


def olho(t, cx, cy, r=3, iris=PRETO, brilho=BRANCO):
    t.elipse(cx, cy, r, r, iris)
    t.px(cx - 1, cy - 1, brilho)


# --------------------------------------------------------------- DIGGLE
def diggle(t, costas=False):
    """Filhote de beagle cavador: orelha comprida com a ponta em brasa, rabo que
    é um pavio aceso e terra voando das patas. FOGO/TERRA."""
    caramelo = (206, 140, 70, 255)
    marrom = (120, 72, 40, 255)
    creme = (246, 232, 204, 255)
    brasa = (255, 120, 40, 255)
    brasa_c = (255, 214, 90, 255)
    terra = (138, 98, 60, 255)

    t.elipse(34, 44, 16, 11, creme)                  # corpo
    t.elipse(40, 41, 10, 8, caramelo)                # a mancha do lombo
    t.elipse(31, 42, 6, 5, marrom)                   # e a mancha escura
    for x in (22, 30, 38, 46):                       # patas
        t.ret(x - 3, 50, x + 2, 57, creme)
    t.poli([(48, 38), (58, 26), (61, 29), (51, 42)], creme)   # rabo em pé
    t.elipse(22, 27, 13, 12, caramelo)               # cabeça
    t.elipse(22, 33, 8, 6, creme)                    # focinho
    t.ret(21, 16, 23, 38, creme)                     # a lista branca da testa
    t.poli([(10, 20), (5, 36), (9, 42), (14, 26)], marrom)    # orelhas caídas
    t.poli([(34, 20), (39, 36), (35, 42), (30, 26)], marrom)

    t.luz(poupar=())

    # pontas das orelhas em brasa e o pavio do rabo
    for cx, cy in ((7, 40), (37, 40)):
        t.elipse(cx, cy, 3, 3, brasa)
        t.px(cx, cy - 1, brasa_c)
    t.poli([(56, 27), (62, 16), (63, 27)], brasa)
    t.poli([(58, 26), (61, 20), (62, 26)], brasa_c)
    for x, y in ((12, 58), (16, 60), (44, 59), (50, 61), (8, 61)):   # terra voando
        t.ret(x, y, x + 2, y + 1, terra)
    if not costas:
        olho(t, 17, 27)
        olho(t, 27, 27)
        t.elipse(22, 32, 3, 2, PRETO)                # nariz
        t.pxs([(20, 36), (21, 37), (22, 37), (23, 37), (24, 36)], PRETO)
        t.pxs([(22, 38), (22, 39)], (230, 90, 110, 255))   # linguinha
    else:
        t.elipse(22, 27, 12, 11, caramelo)           # nuca
        t.ret(21, 17, 23, 30, creme)
    t.contorno()
    return t


# -------------------------------------------------------------- TILAPISH
def tilapish(t, costas=False):
    """Tilápia de pé na cauda, prateada com as listras em pé, barbatana de cima
    em leque e o beiço grosso de quem vive no fundo do açude. ÁGUA."""
    prata = (164, 178, 190, 255)
    prata_e = (110, 124, 140, 255)
    listra = (90, 102, 120, 255)
    barbatana = (226, 96, 88, 255)
    barbatana_c = (250, 170, 140, 255)
    beico = (214, 150, 150, 255)

    t.poli([(20, 12), (30, 8), (44, 16), (48, 30), (40, 44), (24, 44), (16, 30)], prata)   # corpo
    t.poli([(24, 44), (40, 44), (36, 52), (28, 52)], prata_e)            # talo da cauda
    t.poli([(22, 60), (32, 50), (42, 60), (38, 62), (32, 56), (26, 62)], barbatana)  # cauda-pé
    t.poli([(20, 12), (26, 2), (34, 3), (42, 8), (44, 16), (30, 8)], barbatana)       # leque de cima
    t.poli([(46, 26), (58, 20), (56, 32)], barbatana)                    # nadadeira do lado
    t.poli([(18, 30), (8, 36), (14, 40), (22, 36)], barbatana)

    t.luz(poupar=())

    for x in range(24, 45, 5):                                           # listras em pé
        t.linha([(x, 14 + (x - 24) // 3), (x - 2, 40)], listra, 1)
    for x in range(26, 42, 4):                                           # raios do leque
        t.linha([(x, 4 + (abs(x - 32) // 3)), (x - 1, 10)], barbatana_c, 1)
    if not costas:
        olho(t, 25, 20, 4, PRETO)
        t.elipse(25, 20, 2, 2, (220, 60, 50, 255))                       # olho vermelho de tilápia
        t.px(24, 19, BRANCO)
        t.elipse(16, 28, 4, 3, beico)                                    # o beiço
        t.ret(13, 28, 19, 28, PRETO)
        t.linha([(22, 30), (22, 38)], prata_e, 1)                        # guelra
    t.contorno()
    return t


# ---------------------------------------------------------------- TRONKY
def tronky(t, costas=False):
    """Muda de PAU-BRASIL: tronco de casca escura rachada, e pelas rachaduras
    aparece o cerne vermelho — a tinta que deu nome à terra. A copa é escura e
    as flores são amarelas com o miolo vermelho. PLANTA/SOMBRIO."""
    casca = (78, 56, 48, 255)
    casca_e = (52, 36, 34, 255)
    cerne = (196, 40, 44, 255)
    cerne_c = (244, 96, 70, 255)
    folha = (40, 92, 58, 255)
    folha_e = (22, 58, 40, 255)
    flor = (252, 214, 48, 255)

    t.ret(22, 26, 42, 54, casca)                                 # o tronco
    t.poli([(22, 54), (14, 60), (26, 58), (32, 61), (38, 58), (50, 60), (42, 54)], casca_e)   # raízes-pés
    t.poli([(22, 34), (10, 28), (8, 32), (22, 40)], casca)       # galho-braço
    t.poli([(42, 34), (54, 28), (56, 32), (42, 40)], casca)
    for cx, cy, r in ((32, 16, 15), (18, 20, 9), (46, 20, 9), (32, 6, 8)):   # a copa
        t.elipse(cx, cy, r, r - 2, folha)
    for cx, cy, r in ((24, 22, 6), (40, 22, 6), (32, 12, 5)):
        t.elipse(cx, cy, r, r - 1, folha_e)

    t.luz(poupar=())

    # as rachaduras mostrando o cerne vermelho
    for pts in (((26, 30), (28, 38), (26, 46)), ((38, 32), (36, 42), (38, 50)), ((32, 44), (31, 52))):
        t.linha(list(pts), cerne, 2)
        t.px(pts[0][0], pts[0][1], cerne_c)
    for cx, cy in ((12, 12), (50, 12), (22, 6), (42, 5), (32, 22), (8, 24), (56, 24)):   # flores
        t.pxs([(cx, cy - 1), (cx - 1, cy), (cx + 1, cy), (cx, cy + 1)], flor)
        t.px(cx, cy, cerne)
    if not costas:
        # os olhos saem de dentro do nó da madeira: é a parte sombria
        t.elipse(32, 38, 9, 6, casca_e)
        olho(t, 28, 38, 2, (255, 200, 60, 255), BRANCO)
        olho(t, 36, 38, 2, (255, 200, 60, 255), BRANCO)
        t.pxs([(30, 42), (31, 43), (32, 43), (33, 43), (34, 42)], cerne_c)
    t.contorno()
    return t


# ------------------------------------------------------------------ SACI
def saci(t, costas=False):
    """O SACI-GLITCH. Bicho de uma perna só, gorro vermelho pontudo, cachimbo
    soltando fumaça, em cima do próprio redemoinho — e o redemoinho sai
    quebrado, em faixas deslocadas, porque é ele que embaralha os dados de
    Braglitch. SOMBRIO/GLITCH."""
    pele = (92, 58, 44, 255)
    pele_e = (62, 38, 32, 255)
    gorro = (214, 36, 44, 255)
    gorro_c = (255, 104, 96, 255)
    vento = (170, 220, 200, 255)
    vento_e = (96, 150, 150, 255)
    glitch = (180, 85, 255, 255)
    cachimbo = (150, 96, 50, 255)
    fumaca = (220, 220, 230, 255)

    # o redemoinho: faixas que vão alargando pra cima, algumas escorregadas
    for i, y in enumerate(range(62, 44, -3)):
        larg = 4 + i * 3
        dx = (3, -2, 4, -3, 2, 0)[i % 6]
        t.ret(32 - larg + dx, y, 32 + larg + dx, y + 1, vento if i % 2 else vento_e)
    t.ret(28, 32, 35, 46, pele)                       # a perna única
    t.elipse(32, 28, 11, 9, pele)                     # corpo
    t.poli([(22, 26), (12, 20), (13, 24), (22, 30)], pele)   # braços
    t.poli([(42, 26), (50, 18), (52, 21), (42, 30)], pele)
    t.elipse(32, 16, 10, 8, pele)                     # cabeça
    t.poli([(22, 10), (27, 4), (34, 1), (44, 0), (50, 3), (41, 6), (42, 10)], gorro)   # o gorro, caído pro lado
    t.elipse(32, 10, 10, 2, gorro)

    t.luz(poupar=())

    t.pxs([(30, 4), (34, 3), (38, 2), (44, 1)], gorro_c)
    t.linha([(12, 20), (6, 16)], pele_e, 1)           # dedos abertos (a mão que troca as coisas)
    if not costas:
        olho(t, 28, 16, 3, (255, 214, 60, 255), BRANCO)
        olho(t, 36, 16, 3, (255, 214, 60, 255), BRANCO)
        t.px(28, 16, PRETO)
        t.px(36, 16, PRETO)
        t.linha([(28, 21), (32, 23), (36, 21)], PRETO, 1)     # o sorriso de quem aprontou
        # cachimbo e fumaça
        t.ret(38, 21, 46, 22, cachimbo)
        t.ret(45, 17, 48, 22, cachimbo)
        for i, (x, y) in enumerate(((48, 13), (51, 9), (49, 5), (53, 2))):
            t.elipse(x, y, 2, 2, fumaca)
    # os pixels soltos do glitch em volta
    for x, y in ((8, 40), (10, 44), (54, 38), (56, 46), (6, 52), (58, 54), (18, 8), (50, 30)):
        t.ret(x, y, x + 1, y + 1, glitch)
    t.contorno()
    return t


NOVAS = {
    # dex: (desenho, id) — o número é o que src/data/braglitch.js dá à espécie
    1029: (diggle, "diggle"),
    1030: (tilapish, "tilapish"),
    1031: (tronky, "tronky"),
    1032: (saci, "saci"),
}


# os lotes de tools/braglitch_desenhos/ (os bichos novos, as evoluções dos
# iniciais e as lendas) entram na mesma lista
from braglitch_desenhos import todos as _lotes  # noqa: E402
NOVAS.update(_lotes())


# ------------------------------------------------------- AS FORMAS (recolor)
def ler_formas():
    """[(id da base, dex da base, arquivo, [matiz, saturação, luz])] tirado da
    tabela FORMAS de src/data/braglitch.js."""
    texto = open(os.path.join(RAIZ, "src", "data", "braglitch.js"), encoding="utf-8").read()
    bloco = re.search(r"const FORMAS = `(.*?)`", texto, re.S).group(1)
    out = []
    for linha in bloco.strip().splitlines():
        if not linha.strip():
            continue
        cols = [c.strip() for c in linha.split("|")]
        dex, sprite, nome, _tipos, _stats, cor = cols[:6]
        out.append((int(dex), int(sprite), nome, cor))
    return out


def recolorir(img, cor):
    """Gira a cor do bicho pra paleta da forma. `cor` é "matiz sat luz
    [de=N] [pintas]": matiz em graus pra ONDE vai a cor dominante, sat e luz
    multiplicam. `de=N` diz qual é a cor de origem quando a mais comum não é a
    do corpo (o rosto creme do AIPOM ganha do roxo); `pintas` desenha as
    rosetas da onça por cima."""
    partes = cor.split()
    alvo, sat, luz = (float(x) for x in partes[:3])
    de = next((float(x[3:]) / 360 for x in partes[3:] if x.startswith("de=")), None)
    pintas = "pintas" in partes[3:]
    img = img.convert("RGBA")
    px = img.load()
    w, h = img.size
    # a cor dominante (a mais comum entre as saturadas) é a que vira o alvo;
    # as outras giram junto, pelo mesmo tanto, e o desenho continua coerente
    conta = {}
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a < 128:
                continue
            hh, ll, ss = colorsys.rgb_to_hls(r / 255, g / 255, b / 255)
            if ss < 0.25 or ll < 0.15 or ll > 0.9:
                continue
            k = round(hh * 24) % 24
            conta[k] = conta.get(k, 0) + 1
    dominante = de if de is not None else (max(conta, key=conta.get) / 24) if conta else 0
    giro = (alvo / 360) - dominante
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            hh, ll, ss = colorsys.rgb_to_hls(r / 255, g / 255, b / 255)
            if ss < 0.08:          # contorno, branco e cinza ficam como estão
                continue
            hh = (hh + giro) % 1
            ss = max(0, min(1, ss * sat))
            ll = max(0, min(1, ll * luz))
            nr, ng, nb = colorsys.hls_to_rgb(hh, ll, ss)
            px[x, y] = (round(nr * 255), round(ng * 255), round(nb * 255), a)
    if pintas:
        # rosetas: um anel escuro com o miolo um tom abaixo, numa grade torta,
        # só em cima do pelo (cor perto do alvo) e nunca no contorno
        pelo = lambda c: c[3] > 0 and abs(colorsys.rgb_to_hls(*(v / 255 for v in c[:3]))[0] - alvo / 360) < 0.06 \
            and colorsys.rgb_to_hls(*(v / 255 for v in c[:3]))[2] > 0.35
        antes = img.copy().load()
        for cy in range(3, h, 7):
            for cx in range(3 + (cy // 7 % 2) * 3, w, 7):
                if not pelo(antes[cx, cy]):
                    continue
                for dy in range(-2, 3):
                    for dx in range(-2, 3):
                        x, y = cx + dx, cy + dy
                        if not (0 <= x < w and 0 <= y < h) or not pelo(antes[x, y]):
                            continue
                        d = dx * dx + dy * dy
                        if 3 <= d <= 5:
                            px[x, y] = (70, 44, 26, 255)
                        elif d <= 1:
                            r, g, b, a = antes[x, y]
                            px[x, y] = (int(r * 0.8), int(g * 0.72), int(b * 0.6), a)
    return img


# ---------------------------------------------------- os SHINY especiais
# O SHINY de algumas formas não é a cor girada: é outra coisa. O tatu-bola e o
# tatu-bola grande (SANDSHREW-BRAG e SANDSLASH-BRAG) brilham como BOLA DE
# FUTEBOL — branco, com os pentágonos pretos e a costura. É o que os meninos da
# praia de São Lucario sempre acharam que ele era.
SHINY_FUTEBOL = [21001, 21002]


def bola_de_futebol(img, semente=0):
    """Só a CARAPAÇA vira bola (a cor dominante do corpo): couro branco com o
    volume do desenho, pentágonos pretos numa grade larga e a costura cinza.
    Barriga, rosto, garras, olho e contorno ficam como estavam — senão o bicho
    some dentro da estampa."""
    import math
    from PIL import ImageDraw
    img = img.convert("RGBA")
    w, h = img.size
    px = img.load()
    # a cor da carapaça: o matiz mais comum entre os pixels saturados
    conta = {}
    for y in range(h):
        for x in range(w):
            rr, gg, bb, a = px[x, y]
            if a < 128:
                continue
            hh, ll, ss = colorsys.rgb_to_hls(rr / 255, gg / 255, bb / 255)
            if ss > 0.2 and 0.2 < ll < 0.75:
                k = round(hh * 36) % 36
                conta[k] = conta.get(k, 0) + 1
    dom = max(conta, key=conta.get) / 36 if conta else 0

    def casca(c):
        hh, ll, ss = colorsys.rgb_to_hls(c[0] / 255, c[1] / 255, c[2] / 255)
        dist = min(abs(hh - dom), 1 - abs(hh - dom))
        return c[3] >= 128 and ss > 0.18 and 0.24 < ll < 0.72 and dist < 0.07

    estampa = Image.new("L", (w, h), 0)            # 0 couro, 128 costura, 255 pentágono
    d = ImageDraw.Draw(estampa)
    passo, alt, r = 13, 11, 4.2
    centros = [(i * passo + (passo // 2 if j % 2 else 0) + semente % 6, j * alt + semente % 4)
               for j in range(-1, h // alt + 2) for i in range(-1, w // passo + 2)]
    for cx, cy in centros:
        for ox, oy in ((passo, 0), (passo // 2, alt), (-(passo // 2), alt)):
            d.line([(cx, cy), (cx + ox, cy + oy)], fill=128, width=1)
    for cx, cy in centros:
        pts = [(cx + r * math.cos(math.radians(-90 + k * 72)), cy + r * math.sin(math.radians(-90 + k * 72))) for k in range(5)]
        d.polygon(pts, fill=255)
    e = estampa.load()
    antes = img.copy().load()
    for y in range(h):
        for x in range(w):
            c = antes[x, y]
            # as linhas escuras entre as placas da casca viram costura cinza
            hh, ll, ss = colorsys.rgb_to_hls(c[0] / 255, c[1] / 255, c[2] / 255)
            if c[3] >= 128 and 0.1 < ll <= 0.24 and ss > 0.15 and min(abs(hh - dom), 1 - abs(hh - dom)) < 0.08:
                px[x, y] = (86, 86, 92, 255)
                continue
            if not casca(c):
                continue
            _, luz, _ = colorsys.rgb_to_hls(c[0] / 255, c[1] / 255, c[2] / 255)
            tom = 0.74 + 0.26 * min(1, (luz - 0.24) / 0.4)   # o volume do desenho
            if e[x, y] == 255:
                v = int(34 * tom)
                px[x, y] = (v, v, v + 8, 255)
            elif e[x, y] == 128:
                v = int(150 * tom)
                px[x, y] = (v, v, v, 255)
            else:
                v = int(255 * tom)
                px[x, y] = (v, v, min(255, v + 5), 255)
    return img


def base_png(pasta, dex):
    for nome in (f"{dex:03d}.png", f"{dex}.png"):
        p = os.path.join(pasta, nome)
        if os.path.exists(p):
            return Image.open(p)
    return None


def main():
    os.makedirs(COSTAS, exist_ok=True)
    feitas = []
    for dex, (desenho, nome) in NOVAS.items():
        frente = desenho(Tela()).img
        costas = desenho(Tela(), costas=True).img.transpose(Image.FLIP_LEFT_RIGHT)
        frente.save(os.path.join(FRENTE, f"{dex}.png"))
        costas.save(os.path.join(COSTAS, f"{dex}.png"))
        feitas.append(frente)
        print(f"  {nome:10} -> {dex}.png")
    for dex, arquivo, nome, cor in ler_formas():
        for pasta in (FRENTE, COSTAS):
            img = base_png(pasta, dex)
            if img is None:
                print(f"  !! sem sprite da base {dex} em {pasta}")
                continue
            nova = recolorir(img, cor)
            nova.save(os.path.join(pasta, f"{arquivo}.png"))
            if pasta == FRENTE:
                feitas.append(nova)
        print(f"  {nome:18} -> {arquivo}.png")
    from braglitch_desenhos import shinies as _shinies
    for dex, desenho in _shinies().items():      # os SHINY desenhados à mão
        os.makedirs(os.path.join(FRENTE, "shiny", "back"), exist_ok=True)
        frente = desenho(Tela()).img
        frente.save(os.path.join(FRENTE, "shiny", f"{dex}.png"))
        desenho(Tela(), costas=True).img.transpose(Image.FLIP_LEFT_RIGHT).save(
            os.path.join(FRENTE, "shiny", "back", f"{dex}.png"))
        feitas.append(frente)
        print(f"  shiny desenhado -> shiny/{dex}.png")
    for n in SHINY_FUTEBOL:
        for pasta, destino in ((FRENTE, os.path.join(FRENTE, "shiny")), (COSTAS, os.path.join(FRENTE, "shiny", "back"))):
            os.makedirs(destino, exist_ok=True)
            origem = os.path.join(pasta, f"{n}.png")
            if not os.path.exists(origem):
                continue
            bola = bola_de_futebol(Image.open(origem), semente=n)
            bola.save(os.path.join(destino, f"{n}.png"))
            if pasta == FRENTE:
                feitas.append(bola)
        print(f"  shiny bola de futebol -> shiny/{n}.png")
    for arg in sys.argv[1:]:
        if arg.startswith("--folha="):
            folha_de_contato(feitas, escala=3, por_linha=6).save(arg.split("=", 1)[1])
            print("folha:", arg.split("=", 1)[1])


if __name__ == "__main__":
    main()
