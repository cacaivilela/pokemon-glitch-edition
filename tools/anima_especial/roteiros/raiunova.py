"""RAI UNOVA (20097): o TROVÃO. Ele se abaixa firme no chão, as bochechas
começam a faiscar cada vez mais, o rabo se arma pra trás... e ele solta um
raio em zigue-zague pra frente, que vai crescendo até estourar lá longe. O
tranco empurra ele pra trás um pouquinho; depois se arruma, com o boné de
Unova no lugar."""
from efeitos import BRILHO, FAISCA_CORES
from efeitos_braglitch import (partes_rai, ondula, agachar, so_contorno, RAIO_LADO, RAIO_CORES, ESTALO, IMPACTO,
                               IMPACTO_CORES)

CHAVE = "20097"
MARGEM = (34, 14, 12, 4)


def quadros(b):
    p = partes_rai(b)
    tudo = b.menos(b.sprite, p["rabo"])
    rabo = p["rabo"]
    fs = []

    def montar(abaixa=0, arma=0, dx=0, faisca=None, raio=0, estouro=None, clarao=False):
        q = b.quadro()
        r = so_contorno(rabo) if clarao else rabo
        ondula(b, q, r, [(0, 13, dx + arma * 2), (14, 25, dx + arma), (26, 40, dx)], dy=abaixa)
        t = so_contorno(tudo) if clarao else tudo
        if abaixa:
            agachar(b, q, t, 46, abaixa, dx=dx)
        else:
            b.por(q, t, dx=dx)
        if faisca is not None:
            for k, (x, y) in enumerate(((38, 20), (34, 26), (42, 26))[:1 + faisca % 3]):
                b.grade(q, BRILHO[(faisca + k) % 3], x + dx, y + abaixa, FAISCA_CORES)
        if raio:
            # o raio sai da boca (x 20) e cresce pra esquerda
            n = min(raio, 20)
            g = [linha[-n:] for linha in RAIO_LADO]
            b.grade(q, g, 20 + dx - n, 26 + abaixa, RAIO_CORES)
            if raio > 20:
                g2 = [linha[-(raio - 20):] for linha in RAIO_LADO]
                b.grade(q, g2, dx - (raio - 20), 26 + abaixa, RAIO_CORES)
        if estouro is not None:
            b.grade(q, IMPACTO[estouro % 2], -30 + estouro % 2, 24 + abaixa, IMPACTO_CORES)
            b.grade(q, ESTALO[estouro % 2], -28, 20 + abaixa, {"y": "#ffe85a", "w": "#fefefe"})
        return q

    fs.append((montar(), 120))
    # 1) se abaixa, arma o rabo, as faíscas crescem
    for k in range(6):
        fs.append((montar(abaixa=min(k + 1, 3), arma=min(k, 3), faisca=k), 90))
    # 2) SOLTA o raio, que cresce até lá longe
    for k, n in enumerate((6, 12, 20, 27, 34)):
        fs.append((montar(abaixa=3, arma=-1, raio=n, dx=1 if k > 1 else 0, clarao=k % 2 == 0), 60))
    # 3) estoura lá longe; o tranco empurra ele pra trás
    for k in range(4):
        fs.append((montar(abaixa=2, raio=34 if k < 2 else 0, estouro=k, dx=2), 80))
    # 4) se arruma
    fs.append((montar(abaixa=1, dx=1), 100))
    fs.append((montar(), 120))
    fs.append((montar(faisca=2), 110))
    fs.append((montar(), 300))
    return fs
