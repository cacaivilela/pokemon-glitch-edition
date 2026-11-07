"""BIQUINHO (1041): O BICO PESADO. Ele bate as asas com força e consegue
subir um pouco do chão, todo orgulhoso... mas cansa, PARA de bater asa e —
o bico é maior que o resto do corpo — tomba pra frente e cai DE CARA no
chão: POU! Estrelinhas. Ele levanta a cabeça, sacode e tenta de novo."""
from efeitos_braglitch import (ondula_em_pe, IMPACTO, IMPACTO_CORES, ESTRELA, SINAL_CORES, POEIRA, POEIRA_CORES,
                               SUOR, SUOR_CORES)
from efeitos import VENTO, LINHA_CORES

CHAVE = "1041"
MARGEM = (10, 22, 8, 4)


def quadros(b):
    asa = b.parte(lambda x, y, c: x >= 34 and 34 <= y <= 50 and c[:3] not in ((0xfa, 0xfa, 0xfa),))
    corpo = b.menos(b.sprite, asa)
    fs = []

    def montar(t, sobe=0, bate=0, tomba=0, pou=False, tonto=None, suor=False, vento=False, poeira=None):
        q = b.quadro()
        # tombar = as faixas da frente (bico) descem mais que as de trás
        faixas = [(0, 14, tomba * 3), (15, 24, tomba * 2), (25, 34, tomba), (35, 63, 0)]
        for x0, x1, d in faixas:
            from efeitos_braglitch import corta
            b.por(q, corta(corpo, x0=x0, x1=x1), dy=d - sobe)
        b.por(q, asa, dy=-sobe)        # a asa parada por baixo: quando ela sobe, não abre buraco
        b.por(q, asa, dy=-sobe - bate, dx=bate // 2)
        if vento:
            b.grade(q, VENTO, 44, 52 - sobe, LINHA_CORES)
        if pou:
            b.grade(q, IMPACTO[t % 2], 2, 50, IMPACTO_CORES)
        if tonto is not None:
            for k, (x, y) in enumerate(((14, 26), (24, 22), (34, 26))):
                if (tonto + k) % 3 != 2:
                    b.grade(q, ESTRELA[0], x, y + (tonto + k) % 2, SINAL_CORES)
        if suor:
            b.grade(q, SUOR, 44, 26 - sobe, SUOR_CORES)
        if poeira is not None:
            b.grade(q, POEIRA[poeira], 0, 56, POEIRA_CORES)
        return q

    t = 0
    fs.append((montar(t), 120))
    # 1) bate as asas e sobe
    for k, s in enumerate((1, 3, 5, 7, 9, 10, 11, 11)):
        t += 1
        fs.append((montar(t, sobe=s, bate=[0, 4, 0, 4][k % 4] if k % 2 else 4, vento=k % 2 == 0), 70))
    # 2) cansa (suor), para de bater
    t += 1
    fs.append((montar(t, sobe=11, suor=True), 150))
    t += 1
    fs.append((montar(t, sobe=10, suor=True, tomba=1), 90))
    # 3) tomba e cai de cara
    for s, tb in ((8, 2), (5, 3), (2, 4)):
        t += 1
        fs.append((montar(t, sobe=s, tomba=tb), 60))
    t += 1
    fs.append((montar(t, tomba=4, pou=True, poeira=1), 100))
    t += 1
    fs.append((montar(t, tomba=4, pou=True, poeira=2), 100))
    for k in range(4):
        t += 1
        fs.append((montar(t, tomba=4, tonto=k), 110))
    # 4) levanta e sacode
    for tb in (3, 2, 1, 0):
        t += 1
        fs.append((montar(t, tomba=tb), 70))
    for d in (2, 0, 2, 0):
        t += 1
        fs.append((montar(t, bate=d), 70))
    fs.append((montar(t + 1), 300))
    return fs
