"""PERSIAN-BRAG (21015): a ONÇA-PINTADA não ruge — ESTURRA. Ela se abaixa,
vem andando de mansinho, para... e solta o ESTURRO: as ondas do som saem da
boca uma atrás da outra, ela treme inteira e os passarinhos da mata fogem
voando. Depois dá o BOTE pra frente, cai firme e balança o rabo."""
from efeitos_brag import ESTURRO, SOM_CORES, PASSARINHO, PASSARINHO_CORES, POEIRA, POEIRA_CORES

CHAVE = "21015"
MARGEM = (28, 22, 10, 4)


def quadros(b):
    rabo = b.parte(lambda x, y, c: x >= 46 and y <= 34)
    corpo = b.menos(b.sprite, rabo)
    fs = []

    def montar(dx=0, dy=0, treme=0, rabo_dy=0, rabo_dx=0, sons=(), aves=(), extra=None):
        q = b.quadro()
        b.por(q, rabo, dx=dx + rabo_dx, dy=dy + rabo_dy)
        b.por(q, corpo, dx=dx + treme, dy=dy)
        for (tam, x) in sons:
            g = ESTURRO[tam]
            b.grade(q, g, x, 25 - len(g) // 2, SOM_CORES)
        for (x, y, t) in aves:
            b.grade(q, PASSARINHO[t % 2], x, y, PASSARINHO_CORES)
        if extra:
            extra(q)
        return q

    # 1) abaixa e vem de mansinho
    for k in range(5):
        fs.append((montar(dx=8 - k * 2, dy=3, rabo_dy=[0, 1, 2, 1, 0][k]), 120))
    fs.append((montar(dy=3), 160))
    # 2) o ESTURRO: as ondas saem da boca, ela treme, os passarinhos fogem
    aves0 = [(-20, 4), (-8, -6), (60, -2)]
    for k in range(8):
        sons = [(min(2, (k - j) // 1), 6 - (k - j) * 6) for j in range(0, k + 1, 2) if 0 <= k - j <= 4]
        aves = [(x - k * 3 if x < 30 else x + k * 2, y - k * 3, k) for x, y in aves0] if k >= 2 else [(x, y + 6, 0) for x, y in aves0]
        fs.append((montar(dy=1, treme=[1, -1][k % 2], sons=sons, aves=aves), 80))
    # 3) o BOTE pra frente
    fs.append((montar(dx=4, dy=4), 90))
    for k, (x, y) in enumerate(((-6, -6), (-14, -8), (-18, -2))):
        fs.append((montar(dx=x, dy=y, rabo_dy=-2), 70))
    fs.append((montar(dx=-20, dy=2, extra=lambda q: (b.grade(q, POEIRA[2], -14, 50, POEIRA_CORES), b.grade(q, POEIRA[2], 18, 50, POEIRA_CORES))), 100))
    # 4) volta pro lugar balançando o rabo
    for k, x in enumerate((-14, -8, -3, 0)):
        fs.append((montar(dx=x, rabo_dy=[-2, 0, 2, 0][k], rabo_dx=[0, 1, 0, -1][k]), 90))
    fs.append((montar(), 300))
    return fs
