"""PICHU KANTO (30094): o boné de Kanto é GRANDE DEMAIS. Ele está parado
balançando o rabinho e o boné vai escorregando... escorregando... até tapar
os olhos. Aparece um "?", ele dá uns pulinhos às cegas pra um lado e pro
outro — e não liga! Fica pulando feliz, cantando (as notinhas sobem), até que
num pulo mais alto o boné volta pro lugar sozinho."""
from efeitos_braglitch import (partes_pichu, CABECA_PICHU, CABECA_PICHU_CORES, NOTA, INTERROGA,
                               SINAL_CORES, POEIRA, POEIRA_CORES)

CHAVE = "30094"
MARGEM = (12, 20, 12, 4)


def quadros(b):
    p = partes_pichu(b)
    corpo, bone, rabo = p["corpo"], p["bone"], p["rabo"]
    fs = []

    def montar(desce=0, dx=0, sobe=0, abana=0, vira=False, nota=None, pergunta=False, poeira=None):
        q = b.quadro()
        b.por(q, rabo, dx=dx + abana, dy=-sobe, vira=False)
        b.grade(q, CABECA_PICHU, 26 + dx, 16 - sobe, CABECA_PICHU_CORES)
        b.por(q, corpo, dx=dx, dy=-sobe, vira=vira)
        b.por(q, bone, dx=dx, dy=desce - sobe, vira=vira)
        if pergunta:
            b.grade(q, INTERROGA, 44 + dx, 8 - sobe, SINAL_CORES)
        if nota is not None:
            for k, (x, y) in enumerate(((46, 20), (16, 14))):
                t = nota - k * 2
                if t >= 0:
                    b.grade(q, NOTA[(t // 2) % 2], x + (t % 2), y - t * 3, SINAL_CORES)
        if poeira is not None:
            b.grade(q, POEIRA[poeira], 26 + dx, 46, POEIRA_CORES)
            b.grade(q, POEIRA[poeira], 36 + dx, 46, POEIRA_CORES)
        return q

    # 1) parado, abanando o rabinho
    for k in range(3):
        fs.append((montar(abana=[0, 1, 0][k]), 120))
    # 2) o boné escorrega até tapar os olhos
    for d in (1, 2, 4, 6, 8):
        fs.append((montar(desce=d, abana=d % 2), 110))
    fs.append((montar(desce=8, pergunta=True), 200))
    # 3) pulinhos às cegas, pra um lado e pro outro
    for k in range(4):
        lado = [-3, -3, 3, 3][k]
        fs.append((montar(desce=8, dx=lado, sobe=[3, 0, 3, 0][k], vira=lado > 0, pergunta=k < 2), 90))
    # 4) não liga: pula feliz cantando
    for k in range(6):
        fs.append((montar(desce=8, sobe=[0, 2, 4, 2, 0, 0][k], abana=k % 2, nota=k), 90))
    # 5) o pulo alto, e o boné volta pro lugar na descida
    fs.append((montar(desce=8, sobe=0, poeira=0), 80))
    fs.append((montar(desce=4, sobe=5), 80))
    fs.append((montar(desce=0, sobe=7), 80))
    fs.append((montar(desce=0, sobe=3), 80))
    fs.append((montar(desce=0, sobe=0, poeira=1), 90))
    fs.append((montar(poeira=2), 90))
    fs.append((montar(), 300))
    return fs
