"""PICHU ALOLA (30099): o COCHILO DE PRAIA. Ele começa a bocejar, fecha os
olhos e pega no sono em pé: a cabeça cai, levanta, cai de novo, e os "z"
vão subindo. De repente o boné escorrega da cabeça — ele acorda num pulo
com um "!", o boné volta pro lugar no susto, e ele dá uma risadinha de
quem nem ligou."""
from efeitos_braglitch import (partes_pichu, agachar, CABECA_PICHU, CABECA_PICHU_CORES, ZZZ, EXCLAMA, NOTA,
                               SINAL_CORES)

CHAVE = "30099"
MARGEM = (14, 26, 14, 4)
OLHO_CORES = {"b": "#ffee83", "a": "#101010", "c": "#e6b441"}
OLHO_D = ["bbb", "bbb", "aaa", "ccc"]       # o olho direito fechado, canto em (33, 27)
OLHO_E = ["bbbb", "bbbb", "aaab"]          # o esquerdo, canto em (23, 27)


def quadros(b):
    p = partes_pichu(b)
    corpo, bone, rabo = p["corpo"], p["bone"], p["rabo"]
    fs = []

    def montar(dorme=False, cochila=0, bone_dx=0, bone_dy=0, z=None, susto=False, sobe=0, nota=None):
        q = b.quadro()
        b.por(q, rabo, dy=-sobe)
        b.grade(q, CABECA_PICHU, 26, 16 + cochila - sobe, CABECA_PICHU_CORES)
        if cochila:
            agachar(b, q, corpo, 34, cochila)
        else:
            b.por(q, corpo, dy=-sobe)
        if dorme:
            b.grade(q, OLHO_D, 33, 27 + cochila, OLHO_CORES)
            b.grade(q, OLHO_E, 23, 27 + cochila, OLHO_CORES)
        b.por(q, bone, dx=bone_dx, dy=cochila + bone_dy - sobe)
        if z is not None:
            for k in range(3):
                t = z - k * 2
                if t >= 0:
                    t = t % 6          # cada "z" sobe, some, e nasce outro
                    b.grade(q, ZZZ[min(t // 2, 2)], 44 + t, 14 - t * 3, SINAL_CORES)
        if susto:
            b.grade(q, EXCLAMA, 46, 8 - sobe, SINAL_CORES)
        if nota is not None:
            b.grade(q, NOTA[nota % 2], 16, 20 - nota * 3, SINAL_CORES)
        return q

    fs.append((montar(), 120))
    # 1) fecha os olhos e pega no sono: a cabeça cai e levanta
    fs.append((montar(dorme=True), 200))
    seq = [1, 2, 3, 2, 1, 2, 3, 3, 2, 3]
    for k, c in enumerate(seq):
        fs.append((montar(dorme=True, cochila=c, z=k), 110))
    # 2) o boné escorrega pro lado...
    for k, (dx, dy) in enumerate(((-1, 1), (-3, 2), (-5, 4))):
        fs.append((montar(dorme=True, cochila=3, bone_dx=dx, bone_dy=dy, z=10 + k), 100))
    # 3) ACORDA no pulo, e o boné volta no susto
    fs.append((montar(sobe=6, bone_dx=-2, bone_dy=-2, susto=True), 80))
    fs.append((montar(sobe=8, susto=True), 100))
    fs.append((montar(sobe=4, susto=True), 80))
    fs.append((montar(), 120))
    # 4) risadinha
    for k in range(3):
        fs.append((montar(sobe=k % 2, nota=k), 110))
    fs.append((montar(), 300))
    return fs
