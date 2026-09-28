"""Lote 14: o APPLIN de Braglitch, que em vez de maçã mora num COCO VERDE.

É o coco de beira de praia inteiro: casca verde com faixas, a tampinha cortada
em cima mostrando a polpa branca, um canudinho listrado espetado — e o
dragãozinho botando a cara pra fora pela abertura, como o APPLIN faz com a
maçã. PLANTA/ÁGUA.
"""
from pixelart import Tela, clarear, escurecer  # noqa: F401

BRANCO = (250, 250, 250, 255)
PRETO = (30, 26, 34, 255)

COCO = (92, 178, 58, 255)
COCO_E = (56, 128, 40, 255)
COCO_C = (150, 212, 88, 255)
POLPA = (246, 244, 226, 255)
POLPA_E = (210, 214, 184, 255)
AGUA = (150, 206, 214, 255)
APPLIN = (176, 214, 70, 255)
APPLIN_E = (116, 160, 44, 255)
CANUDO_V = (222, 52, 52, 255)
CANUDO_B = (248, 246, 240, 255)


def _canudo(t):
    """O canudinho listrado, saindo inclinado da abertura pra cima-direita."""
    x0, y0, x1, y1 = 39, 30, 52, 5
    passos = max(abs(x1 - x0), abs(y1 - y0))
    for i in range(passos + 1):
        x = round(x0 + (x1 - x0) * i / passos)
        y = round(y0 + (y1 - y0) * i / passos)
        cor = CANUDO_V if (i // 3) % 2 == 0 else CANUDO_B
        t.ret(x - 1, y, x + 1, y, cor)
    # a dobrinha da ponta
    t.ret(51, 3, 56, 5, CANUDO_V)
    t.ret(54, 3, 56, 5, CANUDO_B)


def _folha(bx, by, tx, ty, larg):
    """Uma folha-lobo do APPLIN: da base (bx, by) até a ponta (tx, ty),
    gordinha no meio."""
    import math
    dx, dy = tx - bx, ty - by
    n = math.hypot(dx, dy)
    ox, oy = -dy / n, dx / n
    lados = []
    for i in range(0, 11):
        f = i / 10
        w = larg * math.sin(math.pi * min(1, f * 1.15)) ** 0.7 + (1.5 if f < .1 else 0)
        lados.append((bx + dx * f, by + dy * f, w))
    a = [(round(x + ox * w), round(y + oy * w)) for x, y, w in lados]
    b = [(round(x - ox * w), round(y - oy * w)) for x, y, w in reversed(lados)]
    return a + b


def applinbrag(t, costas=False):
    """APPLIN-BRAG: o dragãozinho num coco verde com canudinho. PLANTA/ÁGUA."""
    # o coco, um tiquinho mais largo que alto, com a tampa cortada reta em cima
    t.elipse(31, 42, 20, 18, COCO)
    t.ret(10, 20, 54, 27, (0, 0, 0, 0))
    # o dragãozinho saindo pela abertura: pescoço e cabeça com as duas
    # "folhas" do APPLIN
    t.ret(25, 19, 34, 29, APPLIN)
    t.poli(_folha(28, 21, 19, 2, 5), APPLIN)                 # lobo esquerdo
    t.poli(_folha(32, 21, 42, 3, 5), APPLIN)                 # lobo direito
    t.luz(poupar=())

    # faixas escuras da casca (as costuras do coco, curvas)
    for dx in (-12, -5, 3, 11):
        pts = []
        for y in range(31, 59, 2):
            # a faixa acompanha a curvatura: abre no meio, fecha nas pontas
            k = 1 - ((y - 42) / 18) ** 2
            pts.append((round(31 + dx * (0.55 + 0.45 * k)), y))
        t.linha(pts, COCO_E, 1)
    t.linha([(15, 33), (18, 30)], COCO_C, 1)     # brilho da casca
    t.px(14, 36, COCO_C)
    t.px(14, 37, COCO_C)

    # a boca cortada: anel de polpa branca e a água/escuro lá dentro
    t.elipse(31, 28, 17, 4, POLPA)
    t.linha([(15, 29), (47, 29)], POLPA_E, 1)
    t.elipse(31, 28, 12, 2, AGUA)
    t.linha([(20, 28), (42, 28)], escurecer(AGUA, 0.3), 1)

    # o pescoço de novo por cima da água (ele sai de dentro do coco)
    t.ret(25, 18, 34, 28, APPLIN)
    t.linha([(34, 18), (34, 28)], APPLIN_E, 1)
    t.linha([(25, 20), (25, 27)], clarear(APPLIN, 0.3), 1)
    t.linha([(26, 28), (33, 28)], APPLIN_E, 1)

    # nervura das folhas-lobo
    t.linha([(21, 5), (27, 17)], APPLIN_E, 1)
    t.linha([(40, 6), (33, 17)], APPLIN_E, 1)

    _canudo(t)

    if not costas:
        # os olhões redondos do APPLIN, com o aro claro
        for cx, cy in ((23, 13), (35, 13)):
            t.elipse(cx, cy, 3, 3, BRANCO)
            t.elipse(cx, cy, 2, 2, PRETO)
            t.px(cx - 1, cy - 1, BRANCO)
    else:
        # de costas: a pontinha da cauda escapando por baixo do coco
        t.poli([(46, 53), (52, 51), (57, 48), (59, 49),
                (56, 53), (50, 56), (46, 57)], APPLIN)
        t.linha([(48, 56), (53, 54), (57, 51)], APPLIN_E, 1)
        t.pxs([(59, 47), (60, 48)], APPLIN_E)
    t.contorno()
    return t


DESENHOS = {
    21025: (applinbrag, "applinbrag"),
}
