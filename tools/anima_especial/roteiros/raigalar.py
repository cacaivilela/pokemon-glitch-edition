"""RAI GALAR (20160): FUTEBOL DE BONÉ. Uma bola cai lá do alto e quica no
boné de Galar — ele se abaixa no tranco e joga ela pra cima de novo. Faz
embaixadinha de cabeça três vezes (a bola subindo cada vez mais) e, na
última, dá uma cabeçada forte que manda a bola longe. Comemora com um pulo."""
from efeitos_braglitch import (agachar, BOLA, BOLA_CORES, IMPACTO, IMPACTO_CORES, ESTRELA, SINAL_CORES)
from efeitos import VENTO, LINHA_CORES

CHAVE = "20160"
MARGEM = (40, 40, 14, 4)


def quadros(b):
    tudo = b.sprite
    fs = []
    TOPO = 6          # onde a bola encosta no boné (o y do canto da bola)

    def montar(t, bola=None, abaixa=0, sobe=0, pou=False, vento=False, estrela=None):
        q = b.quadro()
        if abaixa:
            agachar(b, q, tudo, 46, abaixa)
        else:
            b.por(q, tudo, dy=-sobe)
        if bola is not None:
            bx, by = bola
            b.grade(q, BOLA[t % 2], bx, by, BOLA_CORES)
            if vento:
                b.grade(q, VENTO, bx + 8, by + 1, LINHA_CORES)
        if pou:
            b.grade(q, IMPACTO[t % 2], 24, -2, IMPACTO_CORES)
        if estrela is not None:
            b.grade(q, ESTRELA[estrela], 44, 2 - sobe, SINAL_CORES)
        return q

    fs.append((montar(0), 120))
    t = 0
    # a bola cai lá de cima e quica no boné 3 vezes, subindo cada vez mais
    alturas = [(-38, -26, -14, -4), (-8, -20, -28, -20, -8), (-10, -24, -34, -24, -10)]
    for vez, caminho in enumerate(alturas):
        for y in caminho:
            t += 1
            fs.append((montar(t, bola=(25, TOPO + y)), 70))
        t += 1
        fs.append((montar(t, bola=(25, TOPO + 2), abaixa=3, pou=True), 80))
    # a cabeçada: a bola sai voando pra esquerda
    for k, (x, y) in enumerate(((18, -2), (6, -8), (-8, -14), (-22, -18), (-34, -20))):
        t += 1
        fs.append((montar(t, bola=(x, TOPO + y), sobe=2 if k < 2 else 0, vento=k > 0, pou=k == 0), 60))
    # comemora
    for k, s in enumerate((4, 8, 4, 0)):
        t += 1
        fs.append((montar(t, sobe=s, estrela=k % 2), 90))
    fs.append((montar(t + 1), 300))
    return fs
