"""PICHU GALAR (30160): o CHUTE. Uma bola vem rolando lá de longe. Ele
olha ("!"), se prepara (vai pra trás), corre e CHUTA — e o chute é tão forte
que o boné grande sai voando junto com a bola! A bola some pro lado, o boné
cai de volta na cabeça dele, todo torto, e ele comemora pulando."""
from efeitos_braglitch import (partes_pichu, CABECA_PICHU, CABECA_PICHU_CORES, BOLA, BOLA_CORES, EXCLAMA,
                               IMPACTO, IMPACTO_CORES, ESTRELA, SINAL_CORES, POEIRA, POEIRA_CORES)
from efeitos import VENTO, LINHA_CORES

CHAVE = "30160"
MARGEM = (40, 24, 40, 4)


def quadros(b):
    p = partes_pichu(b)
    corpo, bone, rabo = p["corpo"], p["bone"], p["rabo"]
    fs = []

    def montar(t, dx=0, sobe=0, bola=None, bone_d=(0, 0), torto=False, susto=False, pou=False, estrela=None, poeira=None):
        q = b.quadro()
        b.por(q, rabo, dx=dx, dy=-sobe)
        b.grade(q, CABECA_PICHU, 26 + dx, 16 - sobe, CABECA_PICHU_CORES)
        b.por(q, corpo, dx=dx, dy=-sobe)
        b.por(q, bone, dx=dx + bone_d[0], dy=-sobe + bone_d[1], vira=torto)
        if bola is not None:
            b.grade(q, BOLA[t % 2], bola[0], bola[1], BOLA_CORES)
            if bola[0] > 46:
                b.grade(q, VENTO, bola[0] - 9, bola[1] + 1, LINHA_CORES)
        if susto:
            b.grade(q, EXCLAMA, 44, 8, SINAL_CORES)
        if pou:
            b.grade(q, IMPACTO[1], 34 + dx, 36, IMPACTO_CORES)
        if poeira is not None:
            b.grade(q, POEIRA[poeira], 22 + dx, 41, POEIRA_CORES)
        if estrela is not None:
            for k, (x, y) in enumerate(((16, 12), (44, 10))):
                b.grade(q, ESTRELA[(estrela + k) % 2], x, y - sobe, SINAL_CORES)
        return q

    t = 0
    # a bola vem rolando da esquerda
    for x in (-36, -30, -24, -18):
        t += 1
        fs.append((montar(t, bola=(x, 37)), 80))
    t += 1
    fs.append((montar(t, bola=(-14, 37), susto=True), 160))
    # vai pra trás e corre
    for dx, bx in ((3, -10), (5, -6), (2, -2), (-2, 2), (-5, 6)):
        t += 1
        fs.append((montar(t, dx=dx, bola=(bx, 37), poeira=t % 3), 70))
    # CHUTA: a bola e o boné saem voando
    t += 1
    fs.append((montar(t, dx=-5, bola=(16, 34), pou=True, bone_d=(2, -4)), 80))
    for k, (bx, by) in enumerate(((34, 28), (52, 22), (70, 18), (90, 16))):
        t += 1
        fs.append((montar(t, dx=-4 + k, bola=(bx, by), bone_d=(4 + k, -10 - k * 4), torto=k % 2 == 1), 60))
    # o boné cai de volta, torto
    for k, (bd, ms) in enumerate((((4, -18), 70), ((3, -12), 70), ((2, -5), 70), ((1, 0), 100))):
        t += 1
        fs.append((montar(t, bone_d=bd, torto=k % 2 == 0), ms))
    # comemora
    for k, s in enumerate((4, 7, 4, 0, 3, 0)):
        t += 1
        fs.append((montar(t, sobe=s, estrela=k, bone_d=(1, 0), torto=True), 80))
    fs.append((montar(t + 1, bone_d=(1, 0), torto=True), 300))
    return fs
