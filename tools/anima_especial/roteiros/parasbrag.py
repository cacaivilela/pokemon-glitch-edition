"""PARAS-BRAG (21007): a SAÚVA com a folha dez vezes maior que ela. Vem
andando com a folhona nas costas, as perninhas indo e vindo... e alguém
PUXA a folha! Ela se assusta, fica brava (treme toda), corre atrás e dá uma
TROMBADA — a folha volta voando e cai de novo nas costas dela, que dá
pulinhos de orgulho."""
from efeitos_brag import FOLHONA, FOLHA_CORES, EXCLAMA, EXCLAMA_CORES, IMPACTO, IMPACTO_CORES, POEIRA, POEIRA_CORES

CHAVE = "21007"
MARGEM = (12, 24, 34, 4)


def quadros(b):
    pernas_e = b.parte(lambda x, y, c: x <= 21 and y >= 25)
    pernas_d = b.parte(lambda x, y, c: x >= 38 and y >= 27 and not (x <= 44 and y <= 30))
    corpo = b.menos(b.sprite, pernas_e, pernas_d)
    fs = []

    def montar(dx=0, dy=0, passo=0, folha=(0, 0), treme=0, extra=None):
        q = b.quadro()
        fx, fy = folha
        if fx is not None:   # a folhona por trás, presa no corpo
            b.grade(q, FOLHONA, 14 + fx, 8 + fy, FOLHA_CORES)
        b.por(q, pernas_e, dx=dx + treme, dy=dy - (1 if passo == 1 else 0))
        b.por(q, pernas_d, dx=dx + treme, dy=dy - (1 if passo == 2 else 0))
        b.por(q, corpo, dx=dx - treme, dy=dy + (1 if passo else 0))
        if extra:
            extra(q)
        return q

    # 1) vem andando com a folha (a folha balança junto)
    for k in range(6):
        p = [1, 0, 2, 0, 1, 0][k]
        x = [-4, -3, -2, -1, 0, 0][k]
        fs.append((montar(dx=x, passo=p, folha=(x, 1 if p else 0)), 90))
    # 2) PUXAM a folha pro lado! e ela leva o susto
    fs.append((montar(folha=(6, -2)), 70))
    fs.append((montar(dy=-3, folha=(16, -4), extra=lambda q: b.grade(q, EXCLAMA, 30, 4, EXCLAMA_CORES)), 80))
    fs.append((montar(folha=(26, -3), extra=lambda q: b.grade(q, EXCLAMA, 30, 5, EXCLAMA_CORES)), 120))
    # 3) fica BRAVA: treme toda
    for k in range(4):
        fs.append((montar(treme=[1, -1, 1, -1][k], folha=(28, -3)), 60))
    # 4) corre e dá a TROMBADA
    for k, x in enumerate((3, 7, 11)):
        fs.append((montar(dx=x, passo=[1, 2, 1][k], folha=(28, -3), extra=lambda q, x=x: b.grade(q, POEIRA[1], 4 + x, 42, POEIRA_CORES)), 60))
    fs.append((montar(dx=13, folha=(30, -6), extra=lambda q: b.grade(q, IMPACTO[1], 60, 26, IMPACTO_CORES)), 90))
    fs.append((montar(dx=10, folha=(24, -12), extra=lambda q: b.grade(q, IMPACTO[2], 58, 26, IMPACTO_CORES)), 70))
    # 5) a folha volta voando e cai nas costas dela
    for k, (x, fx, fy) in enumerate(((7, 16, -14), (4, 8, -10), (2, 3, -4), (0, 0, 1))):
        fs.append((montar(dx=x, folha=(fx, fy), passo=[1, 2, 1, 0][k]), 80))
    # 6) pulinhos de orgulho
    for k, y in enumerate((-3, -5, -3, 0, -3, 0)):
        fs.append((montar(dy=y, folha=(0, y - (1 if y else 0))), 70))
    fs.append((montar(), 300))
    return fs
