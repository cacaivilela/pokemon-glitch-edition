"""SACI (1032): de pé no REDEMOINHO, numa perna só. O redemoinho gira (as
faixas andam pros lados, cada uma pro seu), ele dá duas baforadas no cachimbo
(a fumaça sobe em bolas que crescem), pisca, e GIRA — vira de costas e de
frente duas vezes, com as faíscas roxas acendendo em volta."""
from efeitos import FUMACA, FUMACA_CORES, BRILHO_ROXO, FAISCA_CORES

CHAVE = "1032"


def quadros(b):
    redemoinho = b.parte(lambda x, y, c: y >= 46 and 10 <= x <= 52)
    fumaca = b.parte(lambda x, y, c: 44 <= x <= 58 and y <= 16 and c[:3] in ((0xdc, 0xdc, 0xe6), (0x18, 0x14, 0x20)) and not (x < 49 and y > 9))
    faiscas = b.parte(lambda x, y, c: c[:3] in ((0xb4, 0x55, 0xff),) or (c[:3] == (0x18, 0x14, 0x20) and (x < 14 or x > 52) and (y > 6 or x > 52) and not (44 <= x <= 58 and y <= 16)))
    corpo = b.menos(b.sprite, redemoinho, fumaca, faiscas)
    # as faixas do redemoinho: cada uma é uma tira de linhas
    faixas = [(46, 49), (50, 52), (53, 55), (56, 58), (59, 61), (62, 63)]
    fatias = [b.parte(lambda x, y, c, a=a, z=z: y >= 46 and a <= y <= z and 10 <= x <= 52) for a, z in faixas]
    olhos = [(25, 15, 4, 3), (36, 15, 4, 3)]          # x, y, largura, altura (o amarelo)
    PELE = "#5c3a2c"
    fs = []

    def montar(t, sobe=0, gira=False, pisca=False, baforada=None, brilho=0):
        q = b.quadro()
        # o redemoinho girando: faixa par vai pra um lado, ímpar pro outro
        for k, f in enumerate(fatias):
            d = [0, 1, 2, 1, 0, -1, -2, -1][(t + k * 2) % 8] * (1 if k % 2 else -1)
            b.por(q, f, dx=d)
        b.por(q, corpo, dy=-sobe, vira=gira)
        if pisca and not gira:
            for x, y, w, h in olhos:
                b.grade(q, ["." * w] * 0 + ["a" * w], x, y + 1 - sobe, {"a": "#181420"})
                b.grade(q, [PELE[0] and "p" * w], x, y - sobe, {"p": PELE})
                b.grade(q, [PELE[0] and "p" * w], x, y + 2 - sobe, {"p": PELE})
        # a fumaça: a do desenho, ou as bolas da baforada subindo
        if baforada is None:
            b.por(q, fumaca, dy=-sobe, vira=gira)
        else:
            for k, (tam, dx, dy) in enumerate(baforada):
                b.grade(q, FUMACA[tam], dx, dy - sobe, FUMACA_CORES)
        # as faíscas roxas: as do desenho, piscando
        if brilho:
            b.por(q, faiscas)
            for x, y in ((6, 14), (54, 38), (8, 52), (58, 56)):
                b.grade(q, BRILHO_ROXO[(t + x) % 3], x - 2, y - 2, FAISCA_CORES)
        elif t % 4 < 2:
            b.por(q, faiscas)
        return q

    # 1) parado no redemoinho, subindo e descendo de leve
    for t in range(4):
        fs.append((montar(t, sobe=[0, 1, 1, 0][t]), 110))
    # 2) duas BAFORADAS: as bolas saem do cachimbo (x 50, y 16) e sobem crescendo
    for vez in range(2):
        for k in range(5):
            bolas = [(min(3, k - j), 49 + j * 2 + k, 12 - (k - j) * 5) for j in range(min(k + 1, 3)) if k - j >= 0]
            fs.append((montar(4 + vez * 5 + k, sobe=k % 2, baforada=bolas), 100))
    # 3) pisca
    fs.append((montar(14, pisca=True), 120))
    fs.append((montar(15), 120))
    # 4) GIRA: vira de costas e de frente duas vezes, subindo no redemoinho
    for k in range(8):
        fs.append((montar(16 + k, sobe=[2, 4, 5, 5, 5, 4, 2, 1][k], gira=k % 2 == 1, brilho=1), 70))
    fs.append((montar(24), 300))
    return fs


# ------------------------------------------------------------- DE COSTAS
# A mesma cena vista de trás: o redemoinho girando, a fumaça subindo do lado
# da cabeça (o cachimbo está do outro lado), e no GIRO ele vira e mostra a
# cara — é o desenho de frente, espelhado — antes de voltar de costas.
import os  # noqa: E402
from PIL import Image  # noqa: E402

ROXO = (0xb4, 0x55, 0xff)


def quadros_costas(b):
    sp = b.sprite
    p = sp.load()
    perto_do_roxo = lambda x, y: any(0 <= x + dx < 64 and 0 <= y + dy < 64 and p[x + dx, y + dy][:3] == ROXO
                                     for dx in (-1, 0, 1) for dy in (-1, 0, 1))
    faiscas = b.parte(lambda x, y, c: c[:3] == ROXO or (c[:3] == (0x18, 0x14, 0x20) and perto_do_roxo(x, y)))
    redemoinho = b.parte(lambda x, y, c: y >= 46 and 11 <= x <= 51)
    corpo = b.menos(sp, faiscas, redemoinho)
    faixas = [(46, 49), (50, 52), (53, 55), (56, 58), (59, 61), (62, 63)]
    fatias = [b.parte(lambda x, y, c, a=a, z=z: y >= 46 and a <= y <= z and 11 <= x <= 51) for a, z in faixas]
    # a frente, pro instante em que ele gira e olha pra você (sem o redemoinho)
    frente = Image.open(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
                                     "..", "assets", "sprites", "pokemon", "1032.png")).convert("RGBA")
    fp = frente.load()
    cara = Image.new("RGBA", frente.size, (0, 0, 0, 0))
    cp = cara.load()
    for y in range(46):
        for x in range(64):
            if fp[x, y][3] and fp[x, y][:3] != ROXO and 10 <= x <= 56:
                cp[x, y] = fp[x, y]
    fs = []

    def montar(t, sobe=0, gira=False, olha=False, baforada=None, brilho=0):
        q = b.quadro()
        for k, f in enumerate(fatias):
            d = [0, 1, 2, 1, 0, -1, -2, -1][(t + k * 2) % 8] * (1 if k % 2 else -1)
            b.por(q, f, dx=d)
        if olha:
            b.por(q, cara, dy=-sobe, vira=True)
        else:
            b.por(q, corpo, dy=-sobe, vira=gira)
        for tam, dx, dy in baforada or []:
            b.grade(q, FUMACA[tam], dx, dy - sobe, FUMACA_CORES)
        if brilho:
            b.por(q, faiscas)
            for x, y in ((8, 14), (52, 30), (6, 50), (56, 52)):
                b.grade(q, BRILHO_ROXO[(t + x) % 3], x - 2, y - 2, FAISCA_CORES)
        elif t % 4 < 2:
            b.por(q, faiscas)
        return q

    for t in range(4):
        fs.append((montar(t, sobe=[0, 1, 1, 0][t]), 110))
    # as baforadas: a fumaça aparece do lado esquerdo da cabeça (o cachimbo,
    # visto de trás) e sobe crescendo
    for vez in range(2):
        for k in range(5):
            bolas = [(min(3, k - j), 12 - j * 2 - k, 8 - (k - j) * 5) for j in range(min(k + 1, 3)) if k - j >= 0]
            fs.append((montar(4 + vez * 5 + k, sobe=k % 2, baforada=bolas), 100))
    fs.append((montar(14), 160))
    # O GIRO: de costas, de lado (espelhado), DE FRENTE (a cara!), de lado, de costas
    for k, (olha, gira) in enumerate([(False, True), (True, False), (True, False), (False, True),
                                      (False, False), (False, True), (True, False), (False, True)]):
        fs.append((montar(15 + k, sobe=[2, 4, 5, 5, 5, 4, 2, 1][k], gira=gira, olha=olha, brilho=1), 75))
    fs.append((montar(23), 300))
    return fs
