"""RAI JOHTO (20148): CORRIDA RELÂMPAGO. Ele se abaixa, o rabo arma pra
trás, as bochechas soltam faísca... e ele DISPARA pra frente deixando um
rastro de raio e poeira. Freia derrapando, olha pra trás com um "!" — passou
do ponto! — e volta de ré, no passinho, até o lugar."""
from efeitos import BRILHO, FAISCA_CORES
from efeitos_braglitch import (partes_rai, ondula, agachar, RAIO_LADO, RAIO_CORES, POEIRA, POEIRA_CORES,
                               EXCLAMA, SINAL_CORES)

CHAVE = "20148"
MARGEM = (26, 14, 22, 4)


def quadros(b):
    p = partes_rai(b)
    tudo = b.menos(b.sprite, p["rabo"])
    rabo = p["rabo"]
    fs = []

    def montar(dx=0, abaixa=0, sobe=0, arma=0, rastro=None, poeira=None, faisca=None, susto=False):
        q = b.quadro()
        if rastro is not None:
            # o rastro de raio fica pra trás (à direita), do tamanho da corrida
            b.grade(q, RAIO_LADO, 54 + dx + rastro, 30, RAIO_CORES)
            b.grade(q, RAIO_LADO, 50 + dx + rastro * 2, 44, RAIO_CORES)
        ondula(b, q, rabo, [(0, 13, dx + arma * 2), (14, 25, dx + arma), (26, 40, dx)], dy=abaixa - sobe)
        if abaixa:
            agachar(b, q, tudo, 44, abaixa, dx=dx)
        else:
            b.por(q, tudo, dx=dx, dy=-sobe)
        if faisca is not None:
            b.grade(q, BRILHO[faisca % 3], 40 + dx, 22 + abaixa, FAISCA_CORES)
            b.grade(q, BRILHO[(faisca + 1) % 3], 18 + dx, 26 + abaixa, FAISCA_CORES)
        if poeira is not None:
            for k, x in enumerate((44, 52)):
                t = poeira - k
                if 0 <= t < 3:
                    b.grade(q, POEIRA[t], x + dx, 58, POEIRA_CORES)
        if susto:
            b.grade(q, EXCLAMA, 24 + dx, -2, SINAL_CORES)
        return q

    # 1) se abaixa e arma o rabo, faiscando
    for k in range(4):
        fs.append((montar(abaixa=[1, 2, 3, 3][k], arma=[1, 2, 3, 3][k], faisca=k), 100))
    # 2) DISPARA pra frente (esquerda), deixando rastro e poeira
    for k, dx in enumerate((-3, -7, -11, -13)):
        fs.append((montar(dx=dx, sobe=1 if k % 2 else 0, arma=-1, rastro=k * 2, poeira=k), 60))
    # 3) freia derrapando (agacha de novo) e leva um susto
    fs.append((montar(dx=-14, abaixa=2, poeira=1), 90))
    fs.append((montar(dx=-14, abaixa=1, poeira=2, susto=True), 220))
    fs.append((montar(dx=-14, susto=True), 160))
    # 4) volta de ré, no passinho
    for k, dx in enumerate((-12, -10, -8, -6, -4, -2, 0)):
        fs.append((montar(dx=dx, sobe=k % 2, arma=k % 2), 90))
    fs.append((montar(abaixa=1), 100))
    fs.append((montar(), 300))
    return fs
