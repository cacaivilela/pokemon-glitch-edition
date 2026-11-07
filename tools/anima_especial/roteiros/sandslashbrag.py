"""SANDSLASH-BRAG (21002): o tatu de armadura que cava TÚNEL embaixo da
BR-101. Arranha o chão com as garras (a terra voa), MERGULHA de cabeça no
buraco, o calombo de terra corre por baixo do chão... e ele ESTOURA lá do
outro lado, virado, num pulo cheio de torrão. Cai, vira de volta e dá um
golpe de garra."""
from efeitos import TORRAO, TERRA_CORES
from efeitos_brag import corta_abaixo, BURACO, MONTINHO, CORTE, CORTE_CORES, POEIRA, POEIRA_CORES

CHAVE = "21002"
MARGEM = (12, 26, 30, 4)
CHAO = 58


def quadros(b):
    braco = b.retangulo(8, 30, 17, 45)
    corpo = b.menos(b.sprite, braco)
    fs = []

    def torroes(q, t, x0, y0, lado=1):
        for k in range(3):
            d = (t + k * 2) % 6
            b.grade(q, TORRAO[k], x0 + lado * (d * 3 + k * 2), y0 - [0, 6, 9, 10, 8, 4][d], TERRA_CORES)

    def montar(dy=0, dx=0, braco_dy=0, vira=False, buraco=None, extra=None, corta=False):
        q = b.quadro()
        if vira:
            b.por(q, b.sprite, dx=dx, dy=dy, vira=True)
        else:
            b.por(q, corpo, dx=dx, dy=dy)
            b.por(q, braco, dx=dx - (1 if braco_dy else 0), dy=dy + braco_dy)
        if corta:
            corta_abaixo(b, q, CHAO)
        if buraco is not None:
            b.grade(q, BURACO, buraco, CHAO - 3, TERRA_CORES)
        if extra:
            extra(q)
        return q

    # 1) arranha o chão: a garra sobe e desce, a terra voa pra trás
    for k in range(6):
        fs.append((montar(braco_dy=[-4, 3, -4, 3, -4, 3][k], extra=lambda q, k=k: torroes(q, k, 6, 50, -1) if k % 2 else None), 80))
    # 2) MERGULHA: afunda no buraco (o que passa do chão some)
    for k, dy in enumerate((-4, 4, 14, 26, 40, 56)):
        fs.append((montar(dy=dy, corta=dy > 0, buraco=23, extra=lambda q, k=k: torroes(q, k, 30, 52)), 70))
    # 3) o calombo corre por baixo do chão até o outro lado
    for k in range(5):
        def ex(q, k=k):
            b.grade(q, BURACO, 23, CHAO - 3, TERRA_CORES)
            b.grade(q, MONTINHO, 40 + k * 4, CHAO - 3, TERRA_CORES)
            b.grade(q, POEIRA[k % 3], 38 + k * 4, CHAO - 5, POEIRA_CORES)
        q = b.quadro()
        ex(q)
        fs.append((q, 80))
    # 4) ESTOURA do outro lado, virado, num pulo
    for k, (dy, x) in enumerate(((30, 22), (8, 22), (-10, 20), (-16, 17), (-12, 15), (0, 14))):
        fs.append((montar(dy=dy, dx=x, vira=True, corta=dy > 0, buraco=45 if k < 3 else None,
                          extra=lambda q, k=k: (torroes(q, k, 60, 52), torroes(q, k + 3, 50, 52, -1)) if k < 4 else None), 70))
    fs.append((montar(dx=14, vira=True, extra=lambda q: (b.grade(q, POEIRA[2], 26, 54, POEIRA_CORES), b.grade(q, POEIRA[2], 60, 54, POEIRA_CORES))), 100))
    # 5) vira de volta (num pulinho) e dá o golpe de garra
    fs.append((montar(dx=7, dy=-4), 80))
    fs.append((montar(braco_dy=-6), 90))
    fs.append((montar(dx=-2, braco_dy=4, extra=lambda q: (b.grade(q, CORTE, -2, 24, CORTE_CORES), b.grade(q, CORTE, 1, 28, CORTE_CORES))), 70))
    fs.append((montar(dx=-2, braco_dy=4, extra=lambda q: (b.grade(q, CORTE, -4, 30, CORTE_CORES, espelha=True), b.grade(q, CORTE, -1, 34, CORTE_CORES, espelha=True))), 70))
    fs.append((montar(), 300))
    return fs
