"""GLOOM-BRAG (21010): a flor de vitória-régia que AINDA NÃO ABRIU. Ela
estufa o botão e solta o cheiro de água parada, que sobe ondulando... e os
bichos do rio vêm atrás: uma libélula de cada lado e um sapinho pulando.
Ela fica toda contente, pula e estufa o botão, baba um pouquinho, e os bichos
ficam rodando em volta dela."""
from efeitos_brag import LIBELULA, SAPINHO, BICHO_CORES, CHEIRO, CHEIRO_CORES, GOTINHA

CHAVE = "21010"
MARGEM = (14, 18, 20, 4)
BABA = {"w": "#f6dce0"}


def quadros(b):
    folha_e = b.parte(lambda x, y, c: x <= 22 and 19 <= y <= 38)
    folha_d = b.parte(lambda x, y, c: x >= 43 and 10 <= y <= 37)
    flor = b.menos(b.parte(lambda x, y, c: y <= 26 and 17 <= x <= 46), folha_e, folha_d)
    corpo = b.menos(b.sprite, flor, folha_e, folha_d)
    fs = []

    def montar(estufa=0, abana=0, dy=0, cheiro=None, libs=(), sapo=None, baba=None):
        q = b.quadro()
        b.por(q, folha_e, dy=dy - abana)
        b.por(q, folha_d, dy=dy - abana)
        b.por(q, corpo, dy=dy)
        b.por(q, flor, dy=dy - estufa)
        if baba is not None:
            for k in range(baba):
                b.grade(q, ["w"], 32, 37 + k + dy, BABA)
        if cheiro is not None:
            for j, (x, y) in enumerate(((26, 2), (33, -2), (40, 1))):
                b.grade(q, CHEIRO[(cheiro + j) % 3], x, y - cheiro * 2 + dy, CHEIRO_CORES)
        for (x, y, t, vira) in libs:
            b.grade(q, LIBELULA[t % 2], x, y, BICHO_CORES, espelha=vira)
        if sapo:
            x, y, t = sapo
            b.grade(q, SAPINHO[t], x, y, BICHO_CORES)
        return q

    # 1) estufa o botão e solta o cheiro de água parada
    for k in range(5):
        fs.append((montar(estufa=[0, 1, 2, 1, 0][k], cheiro=k if k > 1 else None), 110))
    # 2) os bichos chegam: libélulas dos lados, o sapinho pulando
    caminho_e = [(-12, 10), (-6, 6), (0, 8), (4, 4), (6, 2), (8, 4)]
    caminho_d = [(64, 20), (58, 16), (54, 18), (52, 12), (50, 10), (52, 12)]
    sapo = [(66, 50, 0), (60, 44, 1), (56, 50, 0), (52, 45, 1), (48, 50, 0), (48, 50, 0)]
    for k in range(6):
        fs.append((montar(cheiro=(k + 2) % 3, libs=[(*caminho_e[k], k, False), (*caminho_d[k], k, True)], sapo=sapo[k]), 90))
    # 3) toda contente: abana as folhas, baba, e os bichos rodam em volta
    volta = [(8, 4, False), (20, -4, False), (34, -6, False), (46, 0, True), (50, 10, True), (40, 4, True), (26, -6, True), (12, -2, False)]
    for k in range(8):
        e = volta[k]
        d = volta[(k + 4) % 8]
        fs.append((montar(estufa=[0, 1, 2, 1][k % 4], dy=[0, -2, -3, -2][k % 4], baba=min(k, 4),
                          libs=[(e[0], e[1], k, e[2]), (d[0], d[1], k + 1, d[2])],
                          sapo=(48, 50 - (3 if k % 4 == 1 else 0), 1 if k % 4 == 1 else 0)), 90))
    fs.append((montar(baba=2, libs=[(8, 4, 0, False), (46, 0, 1, True)], sapo=(48, 50, 0)), 300))
    return fs
