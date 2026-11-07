"""PALAFIN-BRAG (21013): o BOTO HERÓI. Alguém sumiu no rio! Ele olha, dá um
pulo bem alto e MERGULHA de cabeça — TCHIBUM. Lá embaixo só sobem as
bolhas... e ele ESTOURA pra fora d'água trazendo o sapinho resgatado no
ombro. Cai de pé na margem, faz pose de herói e vai embora ASSOBIANDO."""
from efeitos_brag import (corta_abaixo, ONDA, ONDA2, FUNDO, AGUA_CORES, RESPINGO, BOLHA, SAPINHO, BICHO_CORES,
                          NOTA, NOTA2, NOTA_CORES, EXCLAMA, EXCLAMA_CORES)
from efeitos import BRILHO, FAISCA_CORES

CHAVE = "21013"
MARGEM = (2, 24, 2, 2)
AGUA = 86


def quadros(b):
    fs = []

    def rio(q, t):
        for i, x in enumerate((16, 32, 48, 64)):
            b.grade(q, [ONDA, ONDA2][(t + i) % 2], x, AGUA - 1, AGUA_CORES)
            b.grade(q, FUNDO, x, AGUA + 2, AGUA_CORES)

    def montar(dx=0, dy=0, de_ponta=False, vira=False, n_agua=False, t=0, sapo=False, extra=None, mostra=True):
        q = b.quadro()
        if mostra:
            b.por(q, b.sprite, dx=dx, dy=dy, de_ponta=de_ponta, vira=vira)
        if sapo:   # o sapinho resgatado, sentado no ombro direito
            b.grade(q, SAPINHO[0], 58 + dx, 22 + dy, BICHO_CORES)
        if n_agua:
            corta_abaixo(b, q, AGUA)
        rio(q, t)
        if extra:
            extra(q)
        return q

    # 1) alguém sumiu no rio! ele olha
    fs.append((montar(t=0), 140))
    fs.append((montar(t=1, extra=lambda q: b.grade(q, EXCLAMA, 46, -6, EXCLAMA_CORES)), 140))
    fs.append((montar(dy=3, t=2), 90))   # agacha
    # 2) pulo bem alto e MERGULHO de cabeça
    fs.append((montar(dy=-14, t=3), 80))
    fs.append((montar(dy=-20, t=4), 80))
    fs.append((montar(dy=-12, de_ponta=True, t=5), 70))
    fs.append((montar(dy=14, de_ponta=True, n_agua=True, t=6, extra=lambda q: b.grade(q, RESPINGO[0], 42, AGUA - 3, AGUA_CORES)), 60))
    fs.append((montar(dy=44, de_ponta=True, n_agua=True, t=7, extra=lambda q: b.grade(q, RESPINGO[1], 41, AGUA - 5, AGUA_CORES)), 70))
    fs.append((montar(mostra=False, t=8, extra=lambda q: b.grade(q, RESPINGO[2], 40, AGUA - 6, AGUA_CORES)), 80))
    # 3) só as bolhas subindo...
    for k in range(4):
        fs.append((montar(mostra=False, t=9 + k, extra=lambda q, k=k: (b.grade(q, BOLHA[k % 3], 44 + (k % 2) * 3, AGUA - 3 - k, AGUA_CORES),
                                                                         b.grade(q, BOLHA[(k + 1) % 3], 50, AGUA - 2, AGUA_CORES) if k > 1 else None)), 110))
    # 4) ESTOURA pra fora com o sapinho no ombro
    fs.append((montar(dy=30, n_agua=True, sapo=True, t=13, extra=lambda q: b.grade(q, RESPINGO[1], 40, AGUA - 5, AGUA_CORES)), 70))
    fs.append((montar(dy=-6, sapo=True, t=14, extra=lambda q: b.grade(q, RESPINGO[2], 40, AGUA - 6, AGUA_CORES)), 80))
    fs.append((montar(dy=-18, sapo=True, t=15), 90))
    fs.append((montar(dy=-10, sapo=True, t=16), 70))
    fs.append((montar(dy=2, sapo=True, t=17), 80))
    # 5) pose de herói e vai embora assobiando
    fs.append((montar(sapo=True, t=18, extra=lambda q: (b.grade(q, BRILHO[1], 20, 10, FAISCA_CORES), b.grade(q, BRILHO[0], 70, 30, FAISCA_CORES))), 160))
    for k in range(5):
        fs.append((montar(dx=k, dy=-(k % 2), sapo=True, t=19 + k,
                          extra=lambda q, k=k: (b.grade(q, NOTA if k % 2 else NOTA2, 22 - k, 10 - k * 3, NOTA_CORES),
                                                b.grade(q, NOTA2 if k % 2 else NOTA, 14 - k, 18 - k * 2, NOTA_CORES) if k > 1 else None)), 100))
    fs.append((montar(dx=4, sapo=True, t=24), 300))
    return fs
