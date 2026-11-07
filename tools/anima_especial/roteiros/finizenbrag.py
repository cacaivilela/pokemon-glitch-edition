"""FINIZEN-BRAG (21012): o BOTO-COR-DE-ROSA em noite de festa. Nadando no
rio, só a cabeça pra fora... PULA num espirro d'água e, lá no alto, o
CHAPÉU branco cai certinho na cabeça dele. Aí dança: pulinho pra cá,
pulinho pra lá, dá uma virada, as notas voando. Até que o SOL começa a
nascer — ele se assusta e mergulha de volta, TCHIBUM, e só o chapéu fica
boiando na marola."""
from efeitos_brag import (corta_abaixo, ONDA, ONDA2, FUNDO, AGUA_CORES, RESPINGO, CHAPEU, CHAPEU_CORES,
                          SOL, SOL_CORES, NOTA, NOTA2, NOTA_CORES, EXCLAMA, EXCLAMA_CORES)

CHAVE = "21012"
MARGEM = (2, 4, 2, 2)
AGUA = 68


def quadros(b):
    fs = []

    def rio(q, t):
        for i, x in enumerate((18, 34, 50, 66)):
            b.grade(q, [ONDA, ONDA2][(t + i) % 2], x, AGUA - 1, AGUA_CORES)
            b.grade(q, FUNDO, x, AGUA + 2, AGUA_CORES)

    def montar(dx=0, dy=0, vira=False, n_agua=True, chapeu=None, t=0, extra=None, sol=None):
        q = b.quadro()
        if sol is not None:   # o sol nascendo lá atrás, à direita
            b.grade(q, SOL, 74, sol, SOL_CORES)
            corta = q.copy()
        b.por(q, b.sprite, dx=dx, dy=dy, vira=vira)
        if chapeu is not None:   # o chapéu em cima da cabeça (ou caindo)
            cx, cy = chapeu
            b.grade(q, CHAPEU, cx, cy, CHAPEU_CORES)
        if n_agua:
            corta_abaixo(b, q, AGUA)
        rio(q, t)
        if extra:
            extra(q)
        return q

    # a cabeça fica em x 34-48, topo em y 36; virado, ela vai pra x 57-71
    cab = lambda dx, dy, vira=False: ((60 if vira else 33) + dx, 31 + dy)
    notas = lambda k: (lambda q: (b.grade(q, NOTA, 20 + (k % 3) * 2, 20 - k * 2, NOTA_CORES),
                                  b.grade(q, NOTA2, 74 - (k % 2) * 2, 26 - k * 2, NOTA_CORES)))
    # 1) nadando: só a cabeça pra fora
    for k in range(3):
        fs.append((montar(dy=[18, 17, 18][k], t=k), 120))
    # 2) PULA, e o chapéu cai na cabeça lá no alto
    fs.append((montar(dy=8, t=3, extra=lambda q: b.grade(q, RESPINGO[0], 36, AGUA - 3, AGUA_CORES)), 70))
    fs.append((montar(dy=-8, n_agua=False, t=4, chapeu=(33, -2), extra=lambda q: b.grade(q, RESPINGO[1], 36, AGUA - 5, AGUA_CORES)), 80))
    fs.append((montar(dy=-16, n_agua=False, t=5, chapeu=(33, 8), extra=lambda q: b.grade(q, RESPINGO[2], 35, AGUA - 6, AGUA_CORES)), 80))
    fs.append((montar(dy=-14, n_agua=False, t=6, chapeu=cab(0, -14)), 90))
    fs.append((montar(dy=-6, n_agua=False, t=7, chapeu=cab(0, -6)), 80))
    # 3) a DANÇA: pulinho pra cá, pulinho pra lá, e uma virada
    passos = [(-5, -4, False), (-6, -8, False), (-4, -4, False), (4, -4, True), (6, -8, True), (4, -4, True),
              (0, -10, False), (0, -12, True), (0, -10, False), (0, -5, False)]
    for k, (x, y, v) in enumerate(passos):
        fs.append((montar(dx=x, dy=y, vira=v, n_agua=False, t=8 + k, chapeu=cab(x, y, v), extra=notas(k)), 80))
    # 4) o SOL nasce... susto! e mergulha
    fs.append((montar(dy=-5, n_agua=False, t=18, chapeu=cab(0, -5), sol=AGUA - 4), 120))
    fs.append((montar(dy=-7, n_agua=False, t=19, chapeu=cab(0, -7), sol=AGUA - 7,
                      extra=lambda q: b.grade(q, EXCLAMA, 42, 14, EXCLAMA_CORES)), 140))
    fs.append((montar(dy=-14, n_agua=False, t=20, chapeu=cab(0, -16), sol=AGUA - 9), 70))
    fs.append((montar(dy=10, t=21, chapeu=cab(0, -10), sol=AGUA - 10, extra=lambda q: b.grade(q, RESPINGO[1], 36, AGUA - 5, AGUA_CORES)), 70))
    fs.append((montar(dy=34, t=22, chapeu=(33, AGUA - 8), sol=AGUA - 11, extra=lambda q: b.grade(q, RESPINGO[2], 35, AGUA - 6, AGUA_CORES)), 80))
    for k in range(3):
        fs.append((montar(dy=40, t=23 + k, chapeu=(33 + k, AGUA - 5 + k % 2), sol=AGUA - 12), 110))
    fs.append((montar(dy=40, t=26, chapeu=(36, AGUA - 5), sol=AGUA - 12), 300))
    return fs
