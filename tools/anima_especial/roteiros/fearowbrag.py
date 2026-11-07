"""FEAROW-BRAG (21004): o CARCARÁ de verdade, voando em CÍRCULO em cima do
apagão. Dá uma volta inteira planando (vai pra direita, vira, volta pela
esquerda), batendo as asas grandes... até que um CACO DA TELA cai lá de
cima, piscando. Ele fecha as asas, MERGULHA atrás e pega com a ponta do bico
— e sobe de novo com o caco, de asa aberta."""
from efeitos_brag import IMPACTO, IMPACTO_CORES, VENTO_CORES, RISCO, EXCLAMA, EXCLAMA_CORES

CHAVE = "21004"
MARGEM = (18, 26, 18, 12)

CACO_CORES = {"a": "#181420", "m": "#ff3ce0", "c": "#3cf0ff", "y": "#fff23c", "w": "#ffffff"}
CACO = [   # o caco da tela que caiu do apagão (as cores piscam trocando o quadro)
    ["aaaaaaaaaa", "amccwyymca", "acmmycwcma", "aymcmmcyaa", "aaacyaaaa.", "...aaa...."],
    ["aaaaaaaaaa", "aycmwccyma", "amyycmwmca", "acymyymcaa", "aaamcaaaa.", "...aaa...."],
]


def quadros(b):
    asa_e = b.parte(lambda x, y, c: x <= 20 and y <= 27)
    asa_d = b.parte(lambda x, y, c: x >= 37 and y <= 32)
    corpo = b.menos(b.sprite, asa_e, asa_d)
    fs = []

    def montar(dx=0, dy=0, bate=0, vira=False, caco=None, extra=None):
        """bate: 0 asa parada, 1 lá em cima, 2 lá embaixo (fechando no corpo)"""
        partes = []
        if bate == 1:
            partes = [(asa_e, 0, 0), (asa_d, 0, 0), (asa_e, -1, -4), (asa_d, 1, -4)]
        elif bate == 2:
            partes = [(asa_e, 3, 7), (asa_d, -3, 7)]
        else:
            partes = [(asa_e, 0, 0), (asa_d, 0, 0)]
        # monta o bicho inteiro numa imagem do tamanho do sprite (pra poder virar junto)
        tmp = b.quadro()
        b.por(tmp, corpo)
        for p, x, y in partes:
            b.por(tmp, p, dx=x, dy=y)
        bicho = tmp
        q = b.quadro()
        if vira:
            cx = bicho.getbbox()
            ped = bicho.crop(cx).transpose(0)  # FLIP_LEFT_RIGHT
            q.alpha_composite(ped, (b.W - cx[2] + dx, cx[1] + dy))
        else:
            q.alpha_composite(bicho, (dx, dy))
        if caco:
            x, y, t = caco
            b.grade(q, CACO[t % 2], x, y, CACO_CORES)
        if extra:
            extra(q)
        return q

    # 1) a volta inteira planando (pra direita virado, depois de volta)
    roda = [(0, 0, False), (4, -3, True), (8, -5, True), (10, -6, True), (8, -7, True),
            (4, -7, False), (0, -6, False), (-4, -5, False), (-7, -3, False), (-4, -1, False)]
    for k, (x, y, v) in enumerate(roda):
        fs.append((montar(dx=x, dy=y, bate=[0, 1, 0, 2][k % 4], vira=v), 90))
    # 2) um caco da tela cai lá de cima, piscando — ele vê
    for k, y in enumerate((-22, -14)):
        fs.append((montar(caco=(6, y, k), extra=lambda q: b.grade(q, EXCLAMA, 30, -14, EXCLAMA_CORES)), 110))
    # 3) MERGULHA de asa fechada atrás do caco
    for k, (y, cy) in enumerate(((-2, -4), (2, 10), (4, 26), (6, 44))):
        fs.append((montar(dx=-k, dy=y, bate=2, caco=(6, cy, k), extra=lambda q, k=k: [b.grade(q, RISCO, 44 + j * 3, 2 + j * 5 + k * 3, VENTO_CORES) for j in range(3)]), 70))
    # 4) PEGA com a ponta do bico (o bico acaba em x 8, y 63)
    fs.append((montar(dx=-4, dy=6, bate=1, caco=(-1, 68, 0), extra=lambda q: b.grade(q, IMPACTO[1], -2, 62, IMPACTO_CORES)), 90))
    fs.append((montar(dx=-4, dy=6, bate=1, caco=(-1, 68, 1), extra=lambda q: b.grade(q, IMPACTO[2], -2, 62, IMPACTO_CORES)), 80))
    # 5) sobe de volta com o caco no bico, batendo as asas
    for k, y in enumerate((5, 2, 0, -2, -1, 0)):
        x = -3 + min(k, 3)
        fs.append((montar(dx=x, dy=y, bate=[2, 1, 0, 2, 1, 0][k], caco=(3 + x, 62 + y, k)), 90))
    fs.append((montar(bate=1, caco=(3, 62, 0)), 300))
    return fs
