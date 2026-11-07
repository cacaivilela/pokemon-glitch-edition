"""MEOWTH-BRAG (21014): o FILHOTE DE ONÇA brincando com a moeda. Joga a
moeda pro alto, ela gira brilhando, ele pega! Aí cava um buraquinho (a terra
voa), ENTERRA a moeda e bate a terra com a pata, todo satisfeito... e logo
depois esquece onde foi. Fareja de um lado, cava do outro, nada — fica
com a cara de "ué?"."""
from efeitos import TORRAO, TERRA_CORES, FAREJA, LINHA_CORES
from efeitos_brag import MOEDA, MOEDA_CORES, MONTINHO, INTERROGA, INTERROGA_CORES
from efeitos import BRILHO, FAISCA_CORES

CHAVE = "21014"
MARGEM = (16, 22, 12, 4)


def quadros(b):
    pata = b.retangulo(13, 32, 24, 42)
    corpo = b.menos(b.sprite, pata)
    fs = []

    def montar(dx=0, dy=0, pata_dy=0, vira=False, moeda=None, monte=None, extra=None):
        q = b.quadro()
        if vira:
            b.por(q, b.sprite, dx=dx, dy=dy, vira=True)
        else:
            b.por(q, corpo, dx=dx, dy=dy)
            b.por(q, pata, dx=dx, dy=dy + pata_dy)
        if monte is not None:
            b.grade(q, MONTINHO, monte, 50, TERRA_CORES)
        if moeda:
            x, y, t = moeda
            g = MOEDA[t % 3]
            b.grade(q, g, x - len(g[0]) // 2, y, MOEDA_CORES)
        if extra:
            extra(q)
        return q

    def terra(q, k, x0):
        for j in range(3):
            d = (k + j) % 3
            b.grade(q, TORRAO[j], x0 - d * 4 - j * 2, 44 - [2, 6, 4][d], TERRA_CORES)

    # 1) joga a moeda pro alto, ela gira, e ele pega
    fs.append((montar(moeda=(19, 30, 0)), 120))
    fs.append((montar(pata_dy=-3, moeda=(17, 22, 1)), 70))
    for k, (x, y) in enumerate(((14, 14), (9, 4), (6, -2), (7, 2), (11, 12), (16, 22))):
        fs.append((montar(dy=-1 if k in (2, 3) else 0, moeda=(x, y, k), extra=lambda q, k=k: b.grade(q, BRILHO[1], 9, -6, FAISCA_CORES) if k == 2 else None), 60))
    fs.append((montar(pata_dy=-2, moeda=(19, 29, 0)), 100))
    # 2) cava o buraquinho (a terra voa pra trás)
    for k in range(5):
        fs.append((montar(dy=2, pata_dy=[4, 7, 4, 7, 4][k], moeda=(30, 40, 0) if k == 0 else None, extra=lambda q, k=k: terra(q, k, 6)), 70))
    # 3) enterra a moeda e bate a terra
    fs.append((montar(dy=2, pata_dy=6, moeda=(18, 46, 0)), 90))
    for k in range(3):
        fs.append((montar(dy=2, pata_dy=[3, 8, 3][k], monte=13), 80))
    fs.append((montar(dy=-2, monte=13, extra=lambda q: b.grade(q, BRILHO[0], 40, 8, FAISCA_CORES)), 140))
    # 4) ...esqueceu! fareja de um lado e do outro, sem achar
    fs.append((montar(monte=None, extra=lambda q: b.grade(q, INTERROGA, 30, 0, INTERROGA_CORES)), 200))
    fs.append((montar(dx=6, dy=2, vira=True, extra=lambda q: b.grade(q, FAREJA, 50, 34, LINHA_CORES)), 110))
    fs.append((montar(dx=6, dy=3, vira=True), 110))
    fs.append((montar(dx=-6, dy=2, extra=lambda q: b.grade(q, FAREJA, 8, 34, LINHA_CORES)), 110))
    fs.append((montar(dx=-6, dy=2, pata_dy=6, extra=lambda q: terra(q, 0, 2)), 80))
    fs.append((montar(dx=-6, dy=2, pata_dy=3, extra=lambda q: terra(q, 1, 2)), 80))
    fs.append((montar(extra=lambda q: (b.grade(q, INTERROGA, 26, -2, INTERROGA_CORES), b.grade(q, INTERROGA, 36, 2, INTERROGA_CORES))), 300))
    return fs
