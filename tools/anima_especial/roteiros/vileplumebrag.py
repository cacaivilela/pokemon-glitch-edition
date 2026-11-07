"""VILEPLUME-BRAG (21011): a noite em que a flor ABRE (só uma por ano!).
Ela começa fechadinha, um botão. Os vaga-lumes da mata vão chegando e
rodando em volta, o sapinho e a libélula vêm ver... o botão treme, treme, e
ABRE pétala por pétala, o miolo acende e a luz estoura em raios. Os
vaga-lumes fazem a festa em volta."""
from efeitos_brag import (VAGALUME, VAGALUME_CORES, SAPINHO, LIBELULA, BICHO_CORES, raios)
from efeitos import BRILHO, FAISCA_CORES

CHAVE = "21011"
MARGEM = (16, 20, 16, 4)


def quadros(b):
    esq = b.parte(lambda x, y, c: x <= 20 and 16 <= y <= 31)
    dir_ = b.parte(lambda x, y, c: x >= 41 and 12 <= y <= 31)
    frente = b.menos(b.parte(lambda x, y, c: 20 <= y <= 34 and 13 <= x <= 41 and c[:3] not in ((0xf0, 0x59, 0x4d), (0xba, 0x2b, 0x2b), (0xcb, 0x58, 0x34))), esq, dir_)
    topo = b.menos(b.parte(lambda x, y, c: y <= 35), esq, dir_, frente)
    corpo = b.menos(b.sprite, esq, dir_, frente, topo)
    fs = []

    def montar(abre=4, treme=0, luz=None, vagas=(), sapo=False, lib=None, dy=0):
        """abre: 0 botão fechado ... 4 flor aberta"""
        f = 4 - abre
        q = b.quadro()
        b.por(q, corpo, dy=dy)
        b.por(q, topo, dx=treme, dy=dy + 2 * f)
        b.por(q, esq, dx=2 * f + treme, dy=dy + f)
        b.por(q, dir_, dx=-2 * f + treme, dy=dy + f)
        b.por(q, frente, dx=treme, dy=dy + f)
        if luz is not None:
            raios(b, q, 31, 20 + dy, 26 + luz * 4)
        for (x, y, t) in vagas:
            b.grade(q, VAGALUME[t % 4], x, y, VAGALUME_CORES)
        if sapo:
            b.grade(q, SAPINHO[0], -12, 46, BICHO_CORES)
        if lib:
            b.grade(q, LIBELULA[lib % 2], 60, 34 + lib % 2, BICHO_CORES, espelha=True)
        return q

    roda = [(-10, 10), (0, -2), (14, -10), (30, -14), (46, -10), (60, -2), (68, 12), (60, 28), (-6, 30)]
    def vagalumes(k, n=5, longe=0):
        return [(roda[(k + j * 2) % len(roda)][0], roda[(k + j * 2) % len(roda)][1] - longe, k + j) for j in range(n)]

    # 1) o botão fechado; os vaga-lumes vão chegando
    for k in range(5):
        fs.append((montar(abre=0, vagas=vagalumes(k, n=1 + k // 2)), 110))
    fs.append((montar(abre=0, vagas=vagalumes(5, 3), sapo=True), 110))
    fs.append((montar(abre=0, vagas=vagalumes(6, 4), sapo=True, lib=1), 110))
    # 2) o botão treme, treme
    for k in range(4):
        fs.append((montar(abre=0, treme=[1, -1][k % 2], vagas=vagalumes(7 + k, 4), sapo=True, lib=k + 1), 70))
    # 3) ABRE pétala por pétala, e o miolo acende
    for k, a in enumerate((1, 2, 3, 4)):
        fs.append((montar(abre=a, vagas=vagalumes(11 + k, 5), sapo=True, lib=k), 90))
    for k in range(3):
        fs.append((montar(luz=k, dy=-1 if k == 1 else 0, vagas=vagalumes(15 + k, 6), sapo=True, lib=k), 90))
    # 4) a festa: brilhos e vaga-lumes rodando
    for k in range(5):
        fs.append((montar(vagas=vagalumes(18 + k, 7), sapo=True, lib=k), 90))
    q = montar(vagas=vagalumes(23, 7), sapo=True, lib=1)
    for x, y in ((8, 8), (52, 6), (30, -6)):
        b.grade(q, BRILHO[1], x - 2, y - 2, FAISCA_CORES)
    fs.append((q, 300))
    return fs
