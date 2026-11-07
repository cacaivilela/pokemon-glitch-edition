"""PICHU UNOVA (30097): ATRÁS DO RABO. Ele vê o próprio rabinho balançando
e sai correndo atrás dele, em roda (vira de um lado, vira do outro, uma volta,
duas voltas), cada vez mais rápido... até ficar tonto, com gota de suor. Aí
senta, ri e solta umas notinhas: brincadeira boa."""
from efeitos_braglitch import (partes_pichu, CABECA_PICHU, CABECA_PICHU_CORES, EXCLAMA, NOTA, SINAL_CORES,
                               SUOR, SUOR_CORES, POEIRA, POEIRA_CORES, ESTRELA)

CHAVE = "30097"
MARGEM = (18, 20, 18, 4)


def quadros(b):
    p = partes_pichu(b)
    corpo, bone, rabo = p["corpo"], p["bone"], p["rabo"]
    fs = []

    def montar(dx=0, dy=0, vira=False, abana=0, susto=False, poeira=None, suor=False, nota=None, tonto=None):
        q = b.quadro()
        # o rabo fica do lado de trás de quem está virado
        if vira:
            b.por(q, rabo, dx=dx - 9 - abana, dy=dy, vira=True)
        else:
            b.por(q, rabo, dx=dx + abana, dy=dy)
        b.grade(q, CABECA_PICHU, 26 + dx, 16 + dy, CABECA_PICHU_CORES)
        b.por(q, corpo, dx=dx, dy=dy, vira=vira)
        b.por(q, bone, dx=dx, dy=dy, vira=vira)
        if susto:
            b.grade(q, EXCLAMA, 44 + dx, 8, SINAL_CORES)
        if poeira is not None:
            b.grade(q, POEIRA[poeira], 30 - dx, 46, POEIRA_CORES)
        if suor:
            b.grade(q, SUOR, 44, 18, SUOR_CORES)
        if tonto is not None:
            for k in range(2):
                b.grade(q, ESTRELA[0], [24, 38][k] + (tonto % 2) * (1 - 2 * k), 8 + k, SINAL_CORES)
        if nota is not None:
            b.grade(q, NOTA[nota % 2], 46, 18 - nota * 3, SINAL_CORES)
        return q

    for k in range(3):
        fs.append((montar(abana=[0, 2, 0][k]), 120))
    fs.append((montar(abana=2, susto=True), 220))
    # a roda: (dx, dy, virado) — vai pra direita por baixo, volta por cima
    roda = [(3, 1, True), (7, 0, True), (8, -2, True), (5, -3, False), (0, -3, False), (-5, -3, False),
            (-8, -2, False), (-7, 0, True), (-3, 1, True), (0, 1, True)]
    for volta in range(2):
        for k, (dx, dy, vira) in enumerate(roda):
            if volta == 0 or k % 2 == 0:
                fs.append((montar(dx=dx, dy=dy, vira=vira, abana=k % 2, poeira=k % 3), 80 if volta == 0 else 60))
    # tonto
    for k in range(4):
        fs.append((montar(dx=[1, -1, 1, 0][k], suor=True, tonto=k), 110))
    # ri e canta
    for k in range(4):
        fs.append((montar(dy=[0, -1, 0, -1][k], nota=k), 110))
    fs.append((montar(), 300))
    return fs
