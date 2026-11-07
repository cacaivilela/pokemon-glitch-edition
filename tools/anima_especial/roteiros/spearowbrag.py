"""SPEAROW-BRAG (21003): o CARCARÁ pequeno. Olha pra um lado e pro outro,
vê um calanguinho no chão, bate as asas e sobe... e dá o RASANTE: desce
riscando o ar e pega o bicho no bico. Volta pro lugar, e o que não vai comer
agora ele joga num REDEMOINHO de vento que gira, gira e some com a presa
guardada pra depois."""
from efeitos_brag import (VENTO_CORES, RISCO, REDEMOINHO_G, REDEMOINHO_CORES, POEIRA, POEIRA_CORES,
                          EXCLAMA, EXCLAMA_CORES)

CHAVE = "21003"
MARGEM = (22, 26, 22, 4)

CALANGO_CORES = {"a": "#181420", "g": "#9ac070", "G": "#6a9048", "w": "#ffffff"}
CALANGO = [   # o calanguinho (a presa)
    ".aa......",
    "awgaaaa..",
    "agggggGaa",
    ".a.a.a..a",
]
CALANGO_PRESO = [   # pendurado no bico, de cabeça pra baixo
    ".a.",
    "aga",
    "agG",
    "aga",
    "aGa",
    "awa",
    ".a.",
]


def quadros(b):
    asa = b.parte(lambda x, y, c: 33 <= x <= 49 and 18 <= y <= 33 and c[:3] not in ((0x5c, 0x64, 0x26), (0x44, 0x46, 0x14), (0x7c, 0x85, 0x41)))
    corpo = b.menos(b.sprite, asa)
    fs = []

    def montar(dx=0, dy=0, bate=0, vira=False, extra=None):
        q = b.quadro()
        if vira:
            b.por(q, b.sprite, dx=dx, dy=dy, vira=True)
        else:
            # asa: 0 parada, 1 lá em cima, 2 lá embaixo (de ponta-cabeça)
            b.por(q, corpo, dx=dx, dy=dy)
            b.por(q, asa, dx=dx, dy=dy)
            if bate:   # a asa esticada pra cima ou pra baixo (sem deixar buraco)
                b.por(q, asa, dx=dx + (0 if bate == 1 else 1), dy=dy + (-5 if bate == 1 else 5))
        if extra:
            extra(q)
        return q

    def riscos(q, x, y):
        for k in range(3):
            b.grade(q, RISCO, x + k * 3, y + k * 4, VENTO_CORES)

    chao = lambda q: b.grade(q, CALANGO, 2, 48, CALANGO_CORES)
    # 1) olha pra um lado e pro outro... e vê o calango
    fs.append((montar(extra=chao), 140))
    fs.append((montar(vira=True, extra=chao), 140))
    fs.append((montar(extra=lambda q: (chao(q), b.grade(q, EXCLAMA, 18, 4, EXCLAMA_CORES))), 160))
    # 2) bate as asas e sobe
    for k, dy in enumerate((0, -3, -7, -11, -14, -16)):
        fs.append((montar(dy=dy, bate=[1, 2][k % 2], extra=lambda q, k=k: (chao(q), b.grade(q, POEIRA[min(k, 3)], 26, 50, POEIRA_CORES) if k < 3 else None)), 80))
    # 3) o RASANTE: desce riscando o ar e pega o calango
    for k, (x, y) in enumerate(((-4, -10), (-9, -3), (-13, 4))):
        fs.append((montar(dx=x, dy=y, bate=1, extra=lambda q, x=x, y=y: (chao(q), riscos(q, 44 + x, 10 + y))), 60))
    fs.append((montar(dx=-14, dy=4, bate=2, extra=lambda q: b.grade(q, POEIRA[2], 0, 50, POEIRA_CORES)), 80))
    # 4) volta subindo com a presa pendurada no bico
    preso = lambda q, x, y: b.grade(q, CALANGO_PRESO, 17 + x, 29 + y, CALANGO_CORES)
    for k, (x, y) in enumerate(((-11, -2), (-7, -6), (-3, -4), (0, 0))):
        fs.append((montar(dx=x, dy=y, bate=[1, 2][k % 2], extra=lambda q, x=x, y=y: preso(q, x, y)), 80))
    # 5) o REDEMOINHO aparece do lado e ele joga a presa lá dentro
    redem = lambda q, t, x=48, y=32: b.grade(q, REDEMOINHO_G, x, y, REDEMOINHO_CORES, espelha=t % 2 == 1)
    fs.append((montar(extra=lambda q: (preso(q, 0, 0), redem(q, 0))), 100))
    fs.append((montar(bate=1, extra=lambda q: (preso(q, 0, 0), redem(q, 1))), 100))
    voo = [(30, 18), (42, 14), (50, 22), (52, 30)]
    for k, (x, y) in enumerate(voo):
        fs.append((montar(bate=2 if k == 0 else 0, extra=lambda q, k=k, x=x, y=y: (redem(q, k), b.grade(q, CALANGO, x, y, CALANGO_CORES))), 70))
    # 6) o redemoinho gira com a presa dentro e vai embora, subindo
    for k in range(5):
        fs.append((montar(extra=lambda q, k=k: (redem(q, k, 48 + k, 32 - k * 5), b.grade(q, CALANGO_PRESO, 54 + k + (k % 2) * 2, 34 - k * 5, CALANGO_CORES) if k < 3 else None,
                                                b.grade(q, POEIRA[3], 50, 48, POEIRA_CORES) if k == 4 else None)), 90))
    fs.append((montar(bate=1), 120))
    fs.append((montar(), 300))
    return fs
