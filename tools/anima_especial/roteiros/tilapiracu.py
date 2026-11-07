"""TILAPIRAÇU (1038): O DEFENSOR DO AÇUDE. Faixa azul tremulando no vento,
ele entra em guarda balançando (como boxeador) e solta a sequência: jab,
jab, e um SOCÃO de direita com o corpo todo — POU! Depois levanta os dois
punhos, se estica e bate o pé: o açude tem dono."""
from efeitos_braglitch import agachar, IMPACTO, IMPACTO_CORES, POEIRA, POEIRA_CORES

CHAVE = "1038"
MARGEM = (22, 12, 8, 6)


def quadros(b):
    faixa = b.parte(lambda x, y, c: x >= 48 and 7 <= y <= 17)
    punho_e = b.parte(lambda x, y, c: (x <= 15 and 33 <= y <= 46) or (x <= 4 and 29 <= y <= 46))
    punho_d = b.parte(lambda x, y, c: x >= 48 and 18 <= y <= 41)
    corpo = b.menos(b.sprite, faixa, punho_e, punho_d)
    fs = []

    def montar(t, dx=0, sobe=0, pe=0, pd=(0, 0), ergue=0, pou=None, abaixa=0, poeira=None):
        q = b.quadro()
        # a faixa tremula (a ponta mexe mais)
        for k, (x0, x1) in enumerate(((48, 53), (54, 58), (59, 63))):
            d = [0, 1, 0, -1][(t + k) % 4] * k
            pedaco = b.parte(lambda x, y, c, x0=x0, x1=x1: x0 <= x <= x1 and 7 <= y <= 17)
            pedaco = b.menos(pedaco, b.menos(pedaco, faixa))
            b.por(q, pedaco, dx=dx, dy=d - sobe + abaixa)
        soco = pd[0] < -2          # no socão o punho direito passa NA FRENTE do corpo
        if not soco:
            b.por(q, punho_d, dx=dx + pd[0], dy=pd[1] - sobe - ergue + abaixa)
        if abaixa:
            agachar(b, q, corpo, 46, abaixa, dx=dx)
        else:
            b.por(q, corpo, dx=dx, dy=-sobe)
        if soco:
            b.por(q, punho_d, dx=dx + pd[0], dy=pd[1] - sobe + abaixa)
        b.por(q, punho_e, dx=dx - pe, dy=-sobe - ergue - (1 if pe else 0) + abaixa)
        if pou is not None:
            b.grade(q, IMPACTO[pou], -8 + dx - pe, 33 - sobe, IMPACTO_CORES)
        if poeira is not None:
            for x in (10, 44):
                b.grade(q, POEIRA[poeira], x, 59, POEIRA_CORES)
        return q

    t = 0
    # 1) em guarda, balançando
    for k in range(4):
        t += 1
        fs.append((montar(t, dx=[0, -1, 0, 1][k], sobe=k % 2), 100))
    # 2) jab, jab
    for vez in range(2):
        t += 1
        fs.append((montar(t, pe=5, pou=0), 70))
        t += 1
        fs.append((montar(t, pe=2), 70))
        t += 1
        fs.append((montar(t, sobe=1), 90))
    # 3) o SOCÃO de direita, com o corpo todo
    t += 1
    fs.append((montar(t, dx=2, pd=(1, 0)), 100))
    t += 1
    fs.append((montar(t, dx=-3, pd=(-10, 2), pou=1), 70))
    t += 1
    fs.append((montar(t, dx=-4, pd=(-12, 2), pou=0), 120))
    t += 1
    fs.append((montar(t, dx=-2, pd=(-4, 1)), 90))
    # 4) levanta os punhos e bate o pé
    for k, e in enumerate((2, 4, 5, 5)):
        t += 1
        fs.append((montar(t, ergue=e, sobe=1 if k > 1 else 0), 90))
    t += 1
    fs.append((montar(t, abaixa=2, poeira=1), 90))
    t += 1
    fs.append((montar(t, poeira=2), 110))
    fs.append((montar(t + 1), 300))
    return fs
