"""Fósseis puros, lote B: a linha do LILEEP e a do ANORITH.

LILEEP-PURO — o lírio-do-mar branco, sem pedra: pétalas limpas, cálice
perolado, e o pó que acalma (umas faíscas de fada em volta).
CRADILY-PURO — o recife inteiro florescendo nos braços: cada tentáculo
virou um ramo de coral de uma cor, com flor na ponta.
ANORITH-PURO / ARMALDO-PURO — o corpo de opala: branco leitoso com a cor
mudando em faixas (rosa, menta, céu, lilás) conforme a luz.
"""
import math

from pixelart import Tela, clarear, escurecer, mistura  # noqa: F401

BRANCO = (250, 250, 250, 255)
PRETO = (30, 26, 34, 255)

# opala: o leite e as cores que correm por cima dele
OPALA = (222, 228, 238, 255)
FOGO_OPALA = [(250, 196, 222, 255), (186, 240, 216, 255), (176, 214, 250, 255),
              (216, 192, 250, 255), (250, 234, 180, 255)]


def opalizar(t, base, passo=5, quanto=0.55, inclina=1):
    """Troca cada pixel da cor `base` por uma mistura que corre em faixas
    diagonais pelas cores do fogo da opala. `base` pode ser uma lista."""
    alvos = {tuple(c[:3]) for c in (base if isinstance(base, list) else [base])}
    for y in range(64):
        for x in range(64):
            c = t.cor(x, y)
            if c[3] and c[:3] in alvos:
                i = ((x * inclina + y) // passo) % len(FOGO_OPALA)
                t.px(x, y, mistura(c, FOGO_OPALA[i], quanto))


def tentaculo(t, x, y, ang, comp, curva, cor, grossura=3, passos=6):
    """Um braço curvo saindo de (x, y): `ang` em graus, `curva` em graus por passo."""
    pts = [(x, y)]
    a = math.radians(ang)
    d = comp / passos
    for _ in range(passos):
        x += math.cos(a) * d
        y += math.sin(a) * d
        pts.append((round(x), round(y)))
        a += math.radians(curva)
    t.linha(pts, cor, grossura)
    return pts[-1]


LIRIO_TRAS = ((-160, -18), (-128, -16), (-102, -10), (-78, 10), (-52, 16), (-20, 18))
LIRIO_FRENTE = ((180, -24), (155, -26), (0, 24), (25, 26))


def bolo(t, cx, cy, rx, ry, cor):
    """Elipse em três tons: sombra embaixo-direita, cor, brilho em cima-esquerda."""
    t.elipse(cx, cy, rx, ry, escurecer(cor, 0.25))
    t.elipse(cx - 1, cy - 1, rx - 1, ry - 1, cor)
    t.elipse(cx - rx // 3, cy - ry // 3, max(1, rx // 2), max(1, ry // 2), clarear(cor, 0.22))


def poli3(t, pts, cor):
    """Polígono com a borda de baixo-direita na sombra."""
    t.poli(pts, escurecer(cor, 0.25))
    t.poli([(x - 1, y - 1) for x, y in pts], cor)


def coral(t, x, y, ang, comp, curva, cor):
    """Um ramo de coral tubular (sombra, cor e brilho) — devolve a ponta."""
    pts = [(x, y)]
    a = math.radians(ang)
    for _ in range(6):
        x += math.cos(a) * comp / 6
        y += math.sin(a) * comp / 6
        pts.append((round(x), round(y)))
        a += math.radians(curva)
    t.linha(pts, escurecer(cor, 0.3), 4)
    t.linha([(px - 1, py) for px, py in pts], cor, 2)
    t.linha([(px - 1, py - 1) for px, py in pts[1:-1]], clarear(cor, 0.35), 1)
    return pts[-1]


def lamina(t, x1, y1, x2, y2, cor, ponta):
    """Uma asa-lâmina do ARMALDO: cunha fina com a ponta no fogo da opala."""
    t.poli([(x1, y1 - 2), (x2, y2), (x1, y1 + 2)], escurecer(cor, 0.2))
    t.poli([(x1, y1 - 2), (x2, y2), (x1, y1)], cor)
    mx, my = (x1 + 2 * x2) / 3, (y1 + 2 * y2) / 3
    t.poli([(round(mx), round(my) - 1), (x2, y2), (round(mx), round(my) + 1)], ponta)


# -------------------------------------------------------------- LILEEP-PURO
def lileeppuro(t, costas=False):
    """O lírio-do-mar branco: pé de pérola, cálice de madrepérola e a coroa
    de pétalas brancas com a ponta rosada."""
    PEROLA = (236, 230, 244, 255)
    CALICE = (206, 190, 232, 255)
    PETALA = (250, 248, 252, 255)
    PONTA = (250, 200, 222, 255)
    CABECA = (200, 186, 226, 255)
    OURO = (250, 224, 120, 255)
    # pé
    bolo(t, 32, 57, 10, 4, PEROLA)
    t.elipse(24, 58, 4, 3, PEROLA)
    t.elipse(40, 58, 4, 3, PEROLA)
    t.ret(30, 46, 34, 56, PEROLA)
    # pétalas de trás (atrás da cabeça)
    for ang, cv in LIRIO_TRAS:
        tentaculo(t, 32, 22, ang, 21, cv, PETALA, 3)
    # cálice
    bolo(t, 32, 38, 10, 10, CALICE)
    # pétalas dos lados, caindo
    for ang, cv in LIRIO_FRENTE:
        tentaculo(t, 32, 22, ang, 22, cv, PETALA, 3)
    bolo(t, 32, 23, 7, 6, CABECA)
    t.luz()
    # pontas rosadas
    for ang, cv in LIRIO_TRAS:
        px, py = tentaculo(Tela(), 32, 22, ang, 21, cv, PETALA)
        t.elipse(px, py, 1, 1, PONTA)
    for ang, cv in LIRIO_FRENTE:
        px, py = tentaculo(Tela(), 32, 22, ang, 22, cv, PETALA)
        t.elipse(px, py, 1, 1, PONTA)
    # espiral do cálice: ouro claro em vez do amarelo de pedra
    t.anel(30, 39, 4, 4, clarear(OURO, 0.2), 1)
    t.px(30, 39, OURO)
    t.pxs([(25, 34), (26, 33)], BRANCO)
    if not costas:
        t.ret(26, 22, 38, 26, escurecer(CABECA, 0.35))
        olho_c = (250, 236, 120, 255)
        t.elipse(29, 24, 1, 1, olho_c)
        t.elipse(35, 24, 1, 1, olho_c)
    else:
        t.linha([(32, 19), (32, 29)], escurecer(CABECA, 0.2), 1)
    t.contorno((60, 44, 80, 255))
    # o pó que acalma
    for x, y in ((6, 40), (10, 48), (55, 44), (58, 36), (8, 30), (52, 52)):
        t.px(x, y, (255, 230, 250, 255))
        t.pxs([(x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)], (240, 190, 230, 255))
    return t


# ------------------------------------------------------------- CRADILY-PURO
def cradilypuro(t, costas=False):
    """O recife que não existe mais: o CRADILY de jade-claro (pé de sino,
    pescoço curvo, cabeça redonda de boca aberta) e, na coroa, os braços
    viraram coral de toda cor com flor na ponta; no pescoço, uma guirlanda
    de florzinhas em vez do anel amarelo de pedra."""
    J = (204, 236, 216, 255)
    BOCA = (70, 50, 80, 255)
    ANEL = (250, 170, 200, 255)
    CORAIS = [(250, 140, 170, 255), (250, 176, 96, 255), (190, 140, 240, 255),
              (110, 200, 230, 255), (250, 214, 100, 255), (240, 116, 120, 255),
              (140, 222, 150, 255), (246, 160, 220, 255)]
    # coroa de coral: (origem, ângulo, curva, comprimento)
    pontas = []
    for i, a in enumerate((-165, -135, -105, -78, -52, -26, 2)):
        r = math.radians(a)
        ox, oy = round(24 + 8 * math.cos(r)), round(22 + 7 * math.sin(r))
        cv = -14 if a < -95 else 14
        pontas.append((coral(t, ox, oy, a, 18 if i % 2 else 16, cv, CORAIS[i]), CORAIS[i]))
    # o pé de sino com três lóbulos
    for x, y in ((19, 58), (31, 59), (43, 58)):
        bolo(t, x, y, 5, 3, J)
    t.poli([(29, 40), (36, 40), (46, 56), (16, 56)], escurecer(J, 0.2))
    t.poli([(29, 39), (35, 39), (44, 55), (17, 55)], J)
    t.elipse(28, 50, 4, 5, clarear(J, 0.25))
    # pescoço que sai de baixo da cabeça
    t.linha([(34, 30), (36, 36), (33, 42)], escurecer(J, 0.2), 8)
    t.linha([(33, 30), (35, 36), (32, 41)], J, 6)
    # cabeça
    bolo(t, 24, 23, 11, 10, J)
    opalizar(t, J, passo=6, quanto=0.12)
    t.luz(0.22, 0.2)
    # flores nas pontas dos corais: pétalas claras, miolo creme
    for (x, y), c in pontas:
        cl = clarear(c, 0.5)
        t.pxs([(x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)], cl)
        t.pxs([(x - 2, y - 1), (x + 2, y + 1), (x + 1, y - 2), (x - 1, y + 2)], c)
        t.px(x, y, (255, 250, 210, 255))
    # guirlanda no pescoço
    for i, x in enumerate(range(28, 39, 3)):
        c = CORAIS[i % len(CORAIS)]
        y = 41 + (i % 2)
        t.pxs([(x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)], c)
        t.px(x, y, (255, 250, 210, 255))
    # florzinha no sino (no lugar da espiral)
    t.pxs([(24, 51), (26, 51), (25, 50), (25, 52)], CORAIS[0])
    t.px(25, 51, (255, 250, 210, 255))
    if not costas:
        t.elipse(21, 29, 8, 4, BOCA)
        t.elipse(21, 27, 8, 3, J)
        t.linha([(14, 29), (28, 29)], (110, 80, 110, 255), 1)
        t.pxs([(16, 31), (25, 31)], (240, 150, 170, 255))
        t.anel(18, 19, 3, 3, ANEL, 1)
        t.px(18, 19, escurecer(ANEL, 0.3))
        t.anel(28, 19, 2, 3, ANEL, 1)
        t.px(28, 19, escurecer(ANEL, 0.3))
    else:
        t.anel(25, 22, 5, 5, ANEL, 1)
        t.px(25, 22, escurecer(ANEL, 0.3))
    t.contorno((44, 60, 52, 255))
    return t


# ------------------------------------------------------------- ANORITH-PURO
def anorithpuro(t, costas=False):
    """O camarão antigo de perfil, como o ANORITH: corpo em gomos de opala
    deitado na diagonal (cabeça embaixo à esquerda, rabo em forquilha pra
    cima), a fileira de nadadeiras finas brilhando nas cores da opala e as
    duas garras penduradas."""
    GOMO = (140, 146, 186, 255)
    GARRA = (190, 198, 220, 255)
    NADADEIRA = (244, 244, 252, 255)
    # eixo do corpo: da cabeça (embaixo-esq) até o rabo (em cima-dir)
    hx, hy, rx, ry = 20, 36, 44, 18
    CORPO = (196, 204, 230, 255)
    # rabo em forquilha
    t.linha([(rx, ry), (50, 6)], OPALA, 3)
    t.linha([(rx, ry), (58, 12)], OPALA, 3)
    t.linha([(50, 6), (49, 2)], OPALA, 2)
    t.linha([(58, 12), (62, 10)], OPALA, 2)
    # nadadeiras de trás (lado de lá), pequenas, pra cima-esquerda
    for i in range(4):
        bx, by = 24 + i * 5, 30 - i * 4
        c = mistura(NADADEIRA, FOGO_OPALA[(i + 2) % 5], 0.55)
        pts = [(bx, by)]
        a = math.radians(-120)
        for _ in range(5):
            pts.append((round(pts[-1][0] + math.cos(a) * 2.4), round(pts[-1][1] + math.sin(a) * 2.4)))
            a += math.radians(-11)
        t.linha(pts, escurecer(c, 0.2), 3)
        t.linha(pts[:-1], c, 1)
    # garras penduradas
    t.linha([(22, 40), (16, 48), (18, 54)], GARRA, 2)
    t.poli([(14, 52), (20, 52), (22, 58), (19, 60), (17, 56), (15, 58)], GARRA)
    t.linha([(28, 40), (32, 48), (30, 54)], GARRA, 2)
    t.poli([(27, 52), (33, 52), (35, 58), (32, 60), (30, 56), (28, 58)], GARRA)
    # nadadeiras da frente: leque comprido pra direita, finas e separadas,
    # cada uma num tom do fogo da opala (atrás do corpo, que cobre a raiz)
    for i in range(5):
        bx, by = 28 + i * 4, 32 - i * 4
        comp = 24 - i * 2
        a = math.radians(34 - i * 15)
        tx, ty = bx + math.cos(a) * comp, by + math.sin(a) * comp
        nx, ny = -math.sin(a) * 2.5, math.cos(a) * 2.5
        t.poli([(bx, by - 2), (round(tx - nx), round(ty - ny)),
                (round(tx + nx * 0.6), round(ty + ny * 0.6)), (bx, by + 2)],
               mistura(NADADEIRA, FOGO_OPALA[i], 0.75))
    # corpo em gomos
    for k in range(6):
        f = k / 5
        cx = round(hx + (rx - hx) * f)
        cy = round(hy + (ry - hy) * f)
        r = 8 - k
        t.elipse(cx, cy, r + 1, r, CORPO)
    t.elipse(hx - 2, hy + 1, 8, 7, CORPO)                      # cabeça
    opalizar(t, CORPO, passo=3, quanto=0.45)
    opalizar(t, OPALA, passo=3, quanto=0.45)
    t.luz()
    # o fogo da opala nas nadadeiras: ponta colorida e um raio no meio
    for i in range(5):
        bx, by = 28 + i * 4, 32 - i * 4
        comp = 24 - i * 2
        a = math.radians(34 - i * 15)
        c = FOGO_OPALA[i]
        for d in range(8, comp - 1):
            t.px(round(bx + math.cos(a) * d), round(by + math.sin(a) * d - 1), clarear(c, 0.6))
        t.px(round(bx + math.cos(a) * comp), round(by + math.sin(a) * comp), escurecer(c, 0.25))
    # sulcos dos gomos
    for k in range(1, 5):
        f = k / 5 + 0.1
        cx = round(hx + (rx - hx) * f)
        cy = round(hy + (ry - hy) * f)
        r = 8 - k
        t.linha([(cx - r + 1, cy - r + 2), (cx + r - 2, cy + r - 1)], GOMO, 1)
    if not costas:
        t.elipse(hx - 4, hy - 1, 3, 3, (60, 70, 110, 255))
        t.elipse(hx - 4, hy - 1, 2, 2, (250, 130, 190, 255))
        t.px(hx - 5, hy - 2, BRANCO)
        t.linha([(hx - 9, hy + 4), (hx - 4, hy + 5)], GOMO, 1)
    else:
        t.linha([(hx, hy - 5), (rx - 2, ry - 3)], GOMO, 1)
    t.pxs([(hx - 6, hy - 6), (hx - 5, hy - 7), (30, 22)], BRANCO)
    t.contorno((52, 56, 84, 255))
    return t


# ------------------------------------------------------------- ARMALDO-PURO
def armaldopuro(t, costas=False):
    """A armadura de opala inteira, na pose do ARMALDO: curvado pra frente,
    capacete de abas, a garra baixa, rabo em forquilha subindo atrás e as
    asas-lâmina dos dois lados do tronco — brancas com a ponta em fogo de
    opala. O peito é uma placa de opala-de-fogo com o fio de ouro."""
    OP = (204, 210, 236, 255)
    OP_E = escurecer(OP, 0.22)
    PLACA = (248, 232, 220, 255)
    OURO = (232, 196, 110, 255)
    LAMINA = (246, 246, 252, 255)
    UNHA = (252, 252, 252, 255)
    # rabo, subindo atrás à direita, com a forquilha
    t.linha([(34, 46), (44, 46), (52, 38), (55, 30)], OP_E, 7)
    t.linha([(33, 45), (43, 45), (51, 37), (54, 29)], OP, 5)
    poli3(t, [(51, 32), (49, 20), (55, 27), (60, 17), (61, 29), (56, 35)], OP)
    # lâminas de trás (lado direito do tronco)
    for i in range(4):
        lamina(t, 36, 18 + i * 5, 49 - i, 13 + i * 5, LAMINA, FOGO_OPALA[i])
    # pernas: a de trás mais escura
    bolo(t, 38, 46, 6, 7, OP_E)
    poli3(t, [(34, 50), (42, 50), (41, 57), (35, 57)], OP_E)
    t.elipse(38, 58, 6, 2, escurecer(OP_E, 0.1))
    bolo(t, 21, 46, 8, 8, OP)
    poli3(t, [(16, 50), (26, 50), (25, 57), (17, 57)], OP)
    t.elipse(19, 58, 8, 2, OP)
    # carapaça das costas (a parte escura do lado)
    poli3(t, [(26, 16), (36, 18), (41, 28), (40, 42), (34, 50), (28, 46)], OP_E)
    # tronco curvado
    bolo(t, 28, 35, 10, 14, OP)
    # pescoço e cabeça com as abas do capacete
    t.linha([(26, 26), (20, 16)], OP_E, 8)
    t.linha([(25, 25), (19, 15)], OP, 6)
    poli3(t, [(11, 10), (8, 3), (15, 5), (17, 9)], OP)
    poli3(t, [(23, 9), (28, 3), (30, 8), (26, 12)], OP)
    bolo(t, 18, 12, 8, 6, OP)
    # lâminas da frente (lado esquerdo)
    for i in range(4):
        lamina(t, 19, 18 + i * 5, 6 + i, 13 + i * 5, LAMINA, FOGO_OPALA[(i + 2) % 5])
    # braço com a garra baixa
    t.linha([(21, 30), (12, 34), (9, 40)], OP_E, 6)
    t.linha([(20, 29), (11, 33), (8, 39)], OP, 4)
    poli3(t, [(1, 37), (11, 33), (18, 40), (15, 51), (10, 47), (13, 42), (6, 41), (4, 49), (1, 45)], OP)
    if not costas:
        poli3(t, [(19, 21), (29, 21), (34, 31), (33, 44), (27, 51), (21, 46), (17, 33)], PLACA)
    opalizar(t, [OP, OP_E, escurecer(OP, 0.25)], passo=4, quanto=0.38)
    opalizar(t, [PLACA, escurecer(PLACA, 0.25)], passo=3, quanto=0.4, inclina=-1)
    t.luz(0.24, 0.2, poupar=(UNHA[:3],))
    # unhas e joelhos
    for x, y in ((12, 59), (16, 60), (20, 60), (24, 59), (33, 59), (37, 60), (41, 59)):
        t.px(x, y, UNHA)
    t.elipse(21, 50, 2, 2, OP_E)
    t.px(20, 49, clarear(OP, 0.4))
    t.pxs([(4, 48), (14, 50), (3, 47)], UNHA)
    if not costas:
        # o fio de ouro da placa
        t.linha([(19, 21), (17, 33), (21, 46), (27, 51), (33, 44), (34, 31), (29, 21)], OURO, 1)
        t.linha([(22, 24), (25, 34), (28, 24)], OURO, 1)
        t.linha([(25, 34), (25, 47)], OURO, 1)
        for y in (38, 43):
            t.linha([(21, y), (31, y)], escurecer(PLACA, 0.2), 1)
        t.poli([(12, 11), (21, 9), (22, 14), (14, 15)], (60, 70, 110, 255))
        t.elipse(15, 12, 1, 1, (250, 120, 180, 255))
        t.elipse(19, 11, 1, 1, (250, 120, 180, 255))
        t.px(14, 11, BRANCO)
    else:
        for y in (24, 31, 38, 45):
            t.linha([(18, y), (36, y + 1)], escurecer(OP, 0.3), 1)
        t.linha([(22, 14), (28, 48)], escurecer(OP, 0.3), 1)
    t.pxs([(20, 25), (21, 24), (16, 8)], BRANCO)
    t.contorno((52, 56, 84, 255))
    return t


DESENHOS = {
    22006: (lileeppuro, "lileeppuro"),
    22007: (cradilypuro, "cradilypuro"),
    22008: (anorithpuro, "anorithpuro"),
    22009: (armaldopuro, "armaldopuro"),
}
