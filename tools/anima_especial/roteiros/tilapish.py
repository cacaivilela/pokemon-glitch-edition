"""TILAPISH (1030): CHEGOU E FICOU. Ele vem pulando de lado em pé no rabo,
pula, pula... e cai bem numa poça d'água — SPLASH! Gostou: se ajeita, bate
as nadadeiras e solta bolhas pela boca (abre, fecha, abre), uma atrás da
outra. Qualquer água serve."""
from efeitos_braglitch import POCA, AGUA_CORES, ESPIRRO, BOLHA, POEIRA, POEIRA_CORES

CHAVE = "1030"
MARGEM = (30, 20, 8, 6)


def quadros(b):
    nad_d = b.parte(lambda x, y, c: x >= 47 and 18 <= y <= 34)
    nad_e = b.parte(lambda x, y, c: x <= 21 and 31 <= y <= 41)
    beico = b.parte(lambda x, y, c: x <= 20 and 29 <= y <= 31)
    corpo = b.menos(b.sprite, nad_d, nad_e, beico)
    fs = []

    def montar(dx=0, sobe=0, poca=True, abana=0, boca=0, espirro=None, bolhas=None, poeira=False):
        q = b.quadro()
        b.por(q, nad_d, dx=dx + abana, dy=-sobe - abana)
        b.por(q, corpo, dx=dx, dy=-sobe)
        if boca:
            b.grade(q, ["aaaaaaa", "aaaaaaa"][:boca], 13 + dx, 29 - sobe, {"a": "#181420"})
        b.por(q, beico, dx=dx, dy=boca - sobe)
        b.por(q, nad_e, dx=dx, dy=-sobe + abana)
        if poca:
            b.grade(q, POCA, 16, 59, AGUA_CORES)
        if espirro is not None:
            b.grade(q, ESPIRRO[espirro], 14, 54 - espirro * 2, AGUA_CORES)
            b.grade(q, ESPIRRO[espirro], 40, 54 - espirro * 2, AGUA_CORES)
        if bolhas is not None:
            for k in range(3):
                t = bolhas - k * 3
                if 0 <= t < 8:
                    b.grade(q, BOLHA[min(t // 2 + 1, 2)], 6 - t, 26 - t * 3 - k, AGUA_CORES)
        if poeira:
            b.grade(q, POEIRA[1], 24 + dx, 59, POEIRA_CORES)
        return q

    # 1) vem pulando em pé no rabo (a poça ainda está mais pra frente)
    for k, dx in enumerate((-24, -20, -16, -12, -8, -4)):
        fs.append((montar(dx=dx, sobe=[0, 5, 0, 5, 0, 6][k], poeira=k % 2 == 0), 90))
    # 2) o último pulo e SPLASH na poça
    fs.append((montar(dx=-2, sobe=8), 80))
    fs.append((montar(sobe=3, espirro=0), 70))
    fs.append((montar(espirro=1), 80))
    fs.append((montar(espirro=2, abana=1), 90))
    # 3) bate as nadadeiras e solta bolhas
    for k in range(12):
        fs.append((montar(abana=k % 2, boca=[1, 1, 0, 0][k % 4], bolhas=k), 100))
    fs.append((montar(), 300))
    return fs
