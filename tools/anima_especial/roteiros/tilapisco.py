"""TILAPISCO (1037): CONTRA A CORRENTE. A correnteza do rio passa riscando
pra trás, e ele nada pra frente batendo as nadadeiras com toda força. Vai,
vai... a correnteza empurra ele de volta (gota de suor!) — mas ele insiste,
bate as nadadeiras mais rápido e dá um salto pra frente, espirrando água.
Conseguiu: brilho de vitória. Quase sempre consegue."""
from efeitos_braglitch import CORRENTE, AGUA_CORES, ESPIRRO, SUOR, SUOR_CORES, ESTRELA, SINAL_CORES

CHAVE = "1037"
MARGEM = (22, 14, 16, 6)


def quadros(b):
    nad_e = b.parte(lambda x, y, c: x <= 20 and 30 <= y <= 48)
    nad_d = b.parte(lambda x, y, c: x >= 47 and 25 <= y <= 44)
    corpo = b.menos(b.sprite, nad_e, nad_d)
    fs = []

    def montar(t, dx=0, sobe=0, bate=0, suor=False, espirro=None, brilho=None):
        q = b.quadro()
        # a correnteza: riscos andando pra direita, por trás e pela frente
        for k, (x0, y) in enumerate(((-20, 8), (10, 22), (-6, 40), (24, 52), (-16, 60))):
            x = (x0 + t * 6 + k * 7) % 96 - 22
            b.grade(q, CORRENTE, x, y, AGUA_CORES)
        b.por(q, nad_d, dx=dx + bate, dy=-sobe - bate)
        b.por(q, corpo, dx=dx, dy=-sobe)
        b.por(q, nad_e, dx=dx - bate, dy=-sobe - bate)
        if suor:
            b.grade(q, SUOR, 46 + dx, 8 - sobe, SUOR_CORES)
        if espirro is not None:
            b.grade(q, ESPIRRO[espirro], 20 + dx, 52, AGUA_CORES)
            b.grade(q, ESPIRRO[espirro], 36 + dx, 54, AGUA_CORES)
        if brilho is not None:
            b.grade(q, ESTRELA[brilho], 48 + dx, 4 - sobe, SINAL_CORES)
        return q

    t = 0
    # 1) nadando contra: avança devagar, batendo as nadadeiras
    for dx in (0, -1, -1, -2, -3, -3, -4):
        t += 1
        fs.append((montar(t, dx=dx, bate=t % 2 * 2, sobe=t % 2), 90))
    # 2) a correnteza empurra de volta
    for dx in (-2, 1, 3, 4):
        t += 1
        fs.append((montar(t, dx=dx, suor=True), 80))
    # 3) insiste, bate mais rápido...
    for dx in (3, 2, 1, 0, -1, -2):
        t += 1
        fs.append((montar(t, dx=dx, bate=t % 2 * 3, suor=dx > 1), 60))
    # 4) ...e salta pra frente espirrando
    for k, (dx, s) in enumerate(((-4, 4), (-7, 9), (-9, 10), (-10, 6), (-10, 0))):
        t += 1
        fs.append((montar(t, dx=dx, sobe=s, bate=2 if s > 5 else 0, espirro=min(k, 2) if k < 3 else None), 70))
    t += 1
    fs.append((montar(t, dx=-10, espirro=2), 90))
    for k in range(3):
        t += 1
        fs.append((montar(t, dx=-10, brilho=k % 2), 110))
    fs.append((montar(t + 1, dx=-10), 300))
    return fs
