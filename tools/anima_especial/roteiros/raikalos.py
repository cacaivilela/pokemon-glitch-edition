"""RAI KALOS (20098): o DESFILE. Ele sai andando de lado no passinho
(sobe, desce), dá meia-volta no fim da passarela e volta, todo estiloso.
No meio ele para, faz pose (se abaixa e se estica), dá uma piscadela pra
plateia: uma estrela brilha no boné de Kalos e sobe um coração."""
from efeitos_braglitch import (partes_rai, agachar, ESTRELA, CORACAO, SINAL_CORES, POEIRA, POEIRA_CORES)

CHAVE = "20098"
MARGEM = (24, 22, 24, 4)


def quadros(b):
    tudo = b.sprite
    fs = []

    def montar(dx=0, sobe=0, vira=False, abaixa=0, estrela=None, coracao=None, poeira=None):
        q = b.quadro()
        if abaixa:
            agachar(b, q, tudo, 46, abaixa, dx=dx)
        else:
            b.por(q, tudo, dx=dx, dy=-sobe, vira=vira)
        if poeira is not None:
            b.grade(q, POEIRA[poeira], 30 + dx + (8 if vira else -8), 58, POEIRA_CORES)
        if estrela is not None:
            b.grade(q, ESTRELA[estrela], 26 + dx, 4, SINAL_CORES)
        if coracao is not None:
            b.grade(q, CORACAO[min(coracao, 1)], 44 + dx, 16 - coracao * 4, SINAL_CORES)
        return q

    # 1) desfila pra esquerda, no passinho
    for k, dx in enumerate((-2, -4, -6, -8, -10)):
        fs.append((montar(dx=dx, sobe=k % 2 * 2, poeira=k % 3 if k % 2 == 0 else None), 100))
    # 2) meia-volta e desfila pra direita
    fs.append((montar(dx=-10, vira=True), 140))
    for k, dx in enumerate((-8, -4, 0, 4, 8)):
        fs.append((montar(dx=dx, sobe=k % 2 * 2, vira=True, poeira=k % 3 if k % 2 == 0 else None), 90))
    # 3) meia-volta de novo e volta pro meio
    fs.append((montar(dx=8), 120))
    for dx in (6, 3, 0):
        fs.append((montar(dx=dx, sobe=dx % 2 * 2), 90))
    # 4) POSE: se abaixa, se estica, pisca pra plateia
    fs.append((montar(abaixa=3), 120))
    fs.append((montar(sobe=2), 120))
    for k in range(4):
        fs.append((montar(sobe=1 if k < 2 else 0, estrela=k % 2, coracao=k), 120))
    fs.append((montar(), 300))
    return fs
