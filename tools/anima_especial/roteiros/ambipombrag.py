"""AMBIPOM-BRAG (21006): o mico das DUAS MÃOS NO RABO, que bate palma pra
tudo. As mãos do rabo se juntam lá em cima e PLAC: a palma solta uma
labareda e as mãos PEGAM FOGO. Ele adora: bate de novo, mais rápido, as mãos
vão e voltam pegando fogo, e termina com a palmona maior de todas."""
from efeitos import LABAREDA, FOGO_CORES, BRASA
from efeitos_brag import troca, CHAMINHA, IMPACTO, IMPACTO_CORES

CHAVE = "21006"
MARGEM = (14, 22, 14, 4)

FOGO = {(0xcf, 0xff, 0xfa): "#fff6c8", (0x86, 0xed, 0xd6): "#ffd048", (0x7d, 0xff, 0x9b): "#ffe85a",
        (0x41, 0xc6, 0x60): "#ff9a28", (0x43, 0x84, 0x53): "#e8461e", (0x40, 0xa2, 0x7f): "#e86a1e"}
# quanto cada mão anda: 0 no lugar, 1 no meio do caminho, 2 batendo uma na outra
MEXE_E = [(0, 0), (5, 2), (9, 4)]
MEXE_D = [(0, 0), (-3, -3), (-7, -6)]
RABO_CORES = {"d": "#101010", "h": "#cba133", "k": "#d6b654"}
ESTICA = [   # o rabo da direita esticado até a mão (canto em x, y)
    None,
    (65, 35, ["dkhhd...", ".dkhhd..", "..dkhhd.", "...dkhhd"]),
    (61, 32, ["dkhhd...", ".dkhhd..", "..dkhhd.", "...dkhhd", "....dkhhd", ".....dkhhd", "......dkhhd", ".......dkhhd"]),
]


def quadros(b):
    mao_e = b.parte(lambda x, y, c: x <= 38 and y <= 24 and not (x >= 33 and y >= 21))
    mao_d = b.parte(lambda x, y, c: x >= 49 and y <= 37 and not (x <= 58 and y >= 33))
    sobra = b.parte(lambda x, y, c: 60 <= x <= 68 and y == 38)   # a beirada do punho que ficava no rabo
    corpo = b.menos(b.sprite, mao_e, mao_d, sobra)
    corpo_parado = b.menos(b.sprite, mao_e, mao_d)
    quente_e, quente_d = troca(mao_e, FOGO), troca(mao_d, FOGO)
    fs = []

    def montar(junta=0, fogo=False, t=0, pula=0, extra=None):
        q = b.quadro()
        b.por(q, corpo if junta else corpo_parado, dy=-pula)
        if ESTICA[junta]:
            x, y, g = ESTICA[junta]
            b.grade(q, g, x, y - pula, RABO_CORES)
        e, d = (quente_e, quente_d) if fogo else (mao_e, mao_d)
        (ex, ey), (dx, dy) = MEXE_E[junta], MEXE_D[junta]
        b.por(q, e, dx=ex, dy=ey - pula)
        b.por(q, d, dx=dx, dy=dy - pula)
        if fogo:   # foguinho em cima de cada mão
            b.grade(q, CHAMINHA[t % 3], 22 + ex, -2 + ey - pula, FOGO_CORES)
            b.grade(q, CHAMINHA[(t + 1) % 3], 60 + dx, 9 + dy - pula, FOGO_CORES)
        if extra:
            extra(q)
        return q

    def plac(tam, pula=0):
        g = LABAREDA[tam]
        return lambda q: (b.grade(q, g, 46 - len(g[0]) // 2, 14 - len(g) // 2 - pula, FOGO_CORES),
                          b.grade(q, IMPACTO[1], 42, 3 - pula, IMPACTO_CORES) if tam == 2 else None)

    brasas = lambda k: (lambda q: [b.grade(q, BRASA[(k + j) % 3], 32 + j * 9, 0 - k * 3 + (j % 2) * 4, FOGO_CORES) for j in range(3)])
    # 1) mãos frias, juntando devagar... PLAC!
    fs.append((montar(), 160))
    fs.append((montar(1), 90))
    fs.append((montar(2, pula=2, extra=plac(1, 2)), 80))
    fs.append((montar(2, fogo=True, pula=2, extra=plac(2, 2)), 100))
    # 2) as mãos abrem PEGANDO FOGO, e as brasas sobem
    for k, j in enumerate((1, 0, 0)):
        fs.append((montar(j, fogo=True, t=k, extra=brasas(k)), 90))
    # 3) bate de novo, mais rápido, três vezes
    for vez in range(3):
        for k, j in enumerate((1, 2, 2, 1, 0)):
            p = 2 if k in (1, 2) else 0
            fs.append((montar(j, fogo=True, t=vez * 5 + k, pula=p,
                              extra=plac(2 if k == 1 else 1, p) if k in (1, 2) else None), 60))
    # 4) a PALMONA final: sobe mais, labareda grande, e fica aceso
    fs.append((montar(1, fogo=True, t=1), 80))
    fs.append((montar(2, fogo=True, t=2, pula=5, extra=plac(2, 5)), 110))
    fs.append((montar(2, fogo=True, t=0, pula=3, extra=lambda q: (plac(2, 3)(q), brasas(1)(q))), 90))
    fs.append((montar(1, fogo=True, t=1, extra=brasas(2)), 100))
    fs.append((montar(0, fogo=True, t=2), 300))
    return fs
