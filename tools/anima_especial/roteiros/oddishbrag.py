"""ODDISH-BRAG (21009): o BROTO DE VITÓRIA-RÉGIA. Boiando no açude, só as
folhas e o cocuruto pra fora, subindo e descendo na marola... até que PULA
pra fora num espirro d'água e sai andando pela margem, pingando, procurando
outra lagoa. Olha pra trás, não acha nada melhor — e volta correndo pra
mergulhar de novo: TCHIBUM."""
from efeitos_brag import corta_abaixo, ONDA, ONDA2, FUNDO, AGUA_CORES, RESPINGO, GOTINHA, BOLHA

CHAVE = "21009"
MARGEM = (14, 22, 30, 4)
AGUA = 44          # a linha da água do açude


def quadros(b):
    pe_e = b.retangulo(17, 42, 30, 48)
    pe_d = b.retangulo(31, 45, 40, 52)
    corpo = b.menos(b.sprite, pe_e, pe_d)
    fs = []

    def lagoa(q, t):
        for i, x in enumerate((10, 26)):
            b.grade(q, [ONDA, ONDA2][(t + i) % 2], x, AGUA - 1, AGUA_CORES)
            b.grade(q, FUNDO, x, AGUA + 2, AGUA_CORES)

    def montar(dx=0, dy=0, passo=0, vira=False, n_agua=True, t=0, extra=None):
        q = b.quadro()
        bicho = b.quadro()
        b.por(bicho, corpo)
        b.por(bicho, pe_e, dy=-2 if passo == 1 else 0)
        b.por(bicho, pe_d, dy=-2 if passo == 2 else 0)
        if vira:
            cx = bicho.getbbox()
            bicho = bicho.crop(cx).transpose(0)
            tmp = b.quadro()
            tmp.alpha_composite(bicho, (cx[0], cx[1]))
            bicho = tmp
        q.alpha_composite(bicho, (dx, dy))
        if n_agua:   # o que está dentro d'água não aparece
            corta_abaixo(b, q, AGUA)
        lagoa(q, t)
        if extra:
            extra(q)
        return q

    # 1) boiando: só o cocuruto pra fora, subindo e descendo
    for k in range(5):
        fs.append((montar(dy=[8, 9, 10, 9, 8][k], t=k, extra=lambda q, k=k: b.grade(q, BOLHA[k % 3], 40, 34 - k, AGUA_CORES) if k > 1 else None), 110))
    # 2) PULA pra fora num espirro d'água
    fs.append((montar(dy=4, t=5, extra=lambda q: b.grade(q, RESPINGO[0], 24, AGUA - 3, AGUA_CORES)), 70))
    fs.append((montar(dx=3, dy=-8, n_agua=False, t=6, extra=lambda q: b.grade(q, RESPINGO[1], 23, AGUA - 5, AGUA_CORES)), 80))
    fs.append((montar(dx=8, dy=-10, n_agua=False, t=7, extra=lambda q: b.grade(q, RESPINGO[2], 22, AGUA - 6, AGUA_CORES)), 80))
    fs.append((montar(dx=14, dy=-8, n_agua=False, t=8), 70))
    # 3) anda pela margem pingando
    for k in range(6):
        x = 18 + k * 2
        fs.append((montar(dx=x, dy=[-6, -7][k % 2], passo=[1, 2][k % 2], n_agua=False, t=9 + k,
                          extra=lambda q, x=x, k=k: b.grade(q, GOTINHA, 22 + x + (k % 3) * 5, 40 + (k % 2) * 2, AGUA_CORES)), 90))
    # 4) olha pra trás... e volta correndo
    fs.append((montar(dx=28, vira=True, dy=-6, n_agua=False, t=15), 160))
    fs.append((montar(dx=28, dy=-6, n_agua=False, t=16), 120))
    fs.append((montar(dx=28, vira=True, dy=-6, n_agua=False, t=17), 120))
    for k, (x, y) in enumerate(((22, -11), (14, -15), (6, -11))):
        fs.append((montar(dx=x, dy=y, vira=True, n_agua=False, t=18 + k), 70))
    # 5) TCHIBUM
    fs.append((montar(dx=2, dy=6, t=21, extra=lambda q: b.grade(q, RESPINGO[1], 20, AGUA - 5, AGUA_CORES)), 80))
    fs.append((montar(dy=12, t=22, extra=lambda q: b.grade(q, RESPINGO[2], 19, AGUA - 6, AGUA_CORES)), 80))
    fs.append((montar(dy=9, t=23, extra=lambda q: b.grade(q, BOLHA[2], 38, 36, AGUA_CORES)), 100))
    fs.append((montar(dy=8, t=24), 300))
    return fs
