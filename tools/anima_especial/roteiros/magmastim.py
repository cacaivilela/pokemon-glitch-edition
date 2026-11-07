"""MAGMASTIM (1036): O LATIDO QUENTE. O cão de guarda está sentado, abana o
rabo, e de repente levanta a cabeça e LATE — três vezes, cada latido com as
ondas do som saindo dos dois lados e as orelhas de fogo se acendendo. A cada
latido a terra esquenta um grau: rachaduras se acendem no chão e o ar quente
sobe tremendo. No fim ele se senta satisfeito, abanando o rabo."""
from efeitos_braglitch import (ondula, tinge, GRITO, GRITO_CORES, CALOR, CALOR_CORES, RACHA_QUENTE, CHAMA_CORES)
from efeitos import BRASA, FOGO_CORES

CHAVE = "1036"
MARGEM = (16, 18, 16, 6)
ACESO = {(0xff, 0x78, 0x28): "#ffe85a", (0xff, 0xd6, 0x5a): "#fff6c8"}


def quadros(b):
    orelhas = b.parte(lambda x, y, c: y <= 22 and (x <= 12 or 37 <= x <= 47) and not (13 <= x <= 36))
    cabeca = b.menos(b.parte(lambda x, y, c: y <= 29 and x <= 48), orelhas)
    rabo = b.parte(lambda x, y, c: x >= 57 and y <= 26)
    corpo = b.menos(b.sprite, cabeca, orelhas, rabo)
    fs = []

    def montar(t, late=0, abana=0, aceso=False, grito=None, calor=0):
        q = b.quadro()
        b.por(q, rabo)
        ondula(b, q, rabo, [(0, 20, abana * 2), (21, 26, abana)])
        b.por(q, corpo)
        o = tinge(orelhas, ACESO) if aceso else orelhas
        b.por(q, cabeca)               # por baixo, pra não abrir buraco no pescoço
        b.por(q, cabeca, dy=-late)
        b.por(q, o, dy=-late - (1 if aceso else 0))
        if aceso:
            for x, y in ((5, 1), (41, 1)):
                b.grade(q, BRASA[t % 3], x, y - late - 2, FOGO_CORES)
        if grito is not None:
            g = GRITO[grito]
            b.grade(q, g, 2 - grito * 4, 20 - len(g) // 2 - late, GRITO_CORES)
            b.grade(q, g, 47 + grito * 4, 20 - len(g) // 2 - late, GRITO_CORES, espelha=True)
        # o chão esquentando: um grau por latido
        lugares = [(4, 60), (46, 60), (24, 61)]
        for k in range(min(calor, 3)):
            x, y = lugares[k]
            b.grade(q, RACHA_QUENTE[(t + k) % 2], x, y, CHAMA_CORES)
            b.grade(q, CALOR[(t + k) % 2], x + 3, y - 8 - (t % 3), CALOR_CORES)
        return q

    t = 0
    for k in range(4):
        t += 1
        fs.append((montar(t, abana=[0, 2, 0, -1][k]), 100))
    # três latidos
    for vez in range(3):
        t += 1
        fs.append((montar(t, late=1, calor=vez), 70))
        for g in range(3):
            t += 1
            fs.append((montar(t, late=2 if g < 2 else 1, aceso=True, grito=g, calor=vez + (1 if g == 2 else 0)), 70))
        t += 1
        fs.append((montar(t, calor=vez + 1), 110))
    # sentado, satisfeito, abanando
    for k in range(5):
        t += 1
        fs.append((montar(t, abana=[2, 0, 2, 0, 1][k], calor=3), 100))
    fs.append((montar(t + 1, calor=3), 300))
    return fs
