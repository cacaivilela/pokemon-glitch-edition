"""PAUBRASILISCO (1034): ELE NÃO PERDOA. Ele rosna baixo (a boca abre e
fecha), as rachaduras vermelhas do corpo começam a pulsar acesas, o rabo
chicoteia... e solta um RUGIDO enorme, a bocarra escancarada, tremendo
inteiro, com as ondas do grito saindo. Depois dá dois passos pesados pra
frente, levantando poeira: ele lembra de cada árvore derrubada."""
from efeitos_braglitch import ondula, tinge, GRITO, GRITO_CORES, POEIRA, POEIRA_CORES

CHAVE = "1034"
MARGEM = (26, 10, 8, 6)
BOCA = {"g": "#c4282c", "a": "#181420"}
ACESO = {(0xc4, 0x28, 0x2c): "#ff463c", (0xff, 0x46, 0x3c): "#ffc83c"}


def quadros(b):
    queixo = b.parte(lambda x, y, c: 37 <= y <= 43 and x <= 21)
    rabo = b.parte(lambda x, y, c: x >= 50 and y <= 40)
    corpo = b.menos(b.sprite, queixo, rabo)
    fs = []

    def montar(t, boca=0, aceso=False, treme=0, chicote=0, dx=0, sobe=0, grito=None, poeira=None):
        q = b.quadro()
        x0 = dx + treme
        r = tinge(rabo, ACESO) if aceso else rabo
        ondula(b, q, r, [(0, 26, x0 + chicote), (27, 33, x0 + chicote // 2), (34, 40, x0)], dy=-sobe)
        b.por(q, tinge(corpo, ACESO) if aceso else corpo, dx=x0, dy=-sobe)
        if boca:
            b.grade(q, ["a" + "g" * 15] * boca, 2 + x0, 37 - sobe, BOCA)
        b.por(q, queixo, dx=x0, dy=boca - sobe)
        if grito is not None:
            for k in range(3):
                s = grito - k
                if 0 <= s < 3:
                    g = GRITO[s]
                    b.grade(q, g, -1 - s * 5 + x0, 37 - len(g) // 2, GRITO_CORES)
        if poeira is not None:
            for x in (12, 32):
                b.grade(q, POEIRA[poeira], x + dx, 58, POEIRA_CORES)
        return q

    fs.append((montar(0), 150))
    # 1) rosna baixo: abre e fecha, o rabo começa a chicotear
    for k in range(4):
        fs.append((montar(k, boca=[1, 0, 1, 0][k], chicote=[1, 2, 1, 0][k]), 110))
    # 2) as rachaduras pulsam acesas
    for k in range(4):
        fs.append((montar(k, aceso=k % 2 == 0, chicote=[-1, 1, 2, 1][k], boca=1), 100))
    # 3) o RUGIDO
    fs.append((montar(0, boca=2, aceso=True), 80))
    for k in range(7):
        fs.append((montar(k, boca=4, aceso=k % 2 == 0, treme=[-1, 1][k % 2], grito=k % 5, chicote=2), 70))
    fs.append((montar(0, boca=1), 110))
    # 4) dois passos pesados pra frente
    for k, (dx, s) in enumerate(((-2, 2), (-4, 0), (-6, 2), (-8, 0))):
        fs.append((montar(k, dx=dx, sobe=s, poeira=1 if s == 0 else None, chicote=[1, -1][k % 2]), 110))
    fs.append((montar(0, dx=-8, poeira=2), 120))
    fs.append((montar(0, dx=-8), 300))
    return fs
