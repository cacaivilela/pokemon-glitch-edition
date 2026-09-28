"""LOTE 5 — festa junina, carnaval e folclore: fogueira, balão, Boitatá,
almas penadas, beija-flor, plumas de passista e brigadeiro."""
import math

from pixelart import Tela, clarear, escurecer  # noqa: F401

BRANCO = (250, 250, 250, 255)
PRETO = (30, 26, 34, 255)

# fogo (cores que emitem luz: ficam fora da sombra)
FOGO_V = (226, 60, 32, 255)
FOGO_L = (250, 130, 36, 255)
FOGO_A = (255, 210, 60, 255)
FOGO_C = (255, 246, 190, 255)
CHAMAS = tuple(c[:3] for c in (FOGO_V, FOGO_L, FOGO_A, FOGO_C))

TORA = (126, 80, 48, 255)
TORA_E = (84, 52, 34, 255)
TORA_C = (196, 150, 104, 255)


def olho(t, cx, cy, r=3, iris=PRETO, brilho=BRANCO):
    t.elipse(cx, cy, r, r, iris)
    t.px(cx - 1, cy - 1, brilho)


def chama(t, cx, base, larg, alt, cor, pontas=3, torto=0):
    """Língua de fogo: barriga redonda embaixo e `pontas` bicos em cima."""
    pts = []
    for i in range(13):                      # a barriga (meia elipse de baixo)
        a = math.pi * i / 12
        pts.append((cx + larg * math.cos(a), base - larg * 0.7 + larg * 0.7 * math.sin(a)))
    topo = base - alt
    passo = 2 * larg / pontas
    for k in range(pontas):                  # os bicos, da esquerda pra direita
        x0 = cx - larg + k * passo
        alto = topo + (abs(k - (pontas - 1) / 2) * alt * 0.22)
        pts.append((x0 + passo * 0.5 + torto, alto))
        pts.append((x0 + passo, base - alt * 0.45 - (0 if k == pontas - 1 else alt * 0.1)))
    # borda esquerda, bicos, borda direita e a barriga voltando pela direita
    t.poli([(cx - larg, base - larg * 0.7)] + pts[13:] + [(cx + larg, base - larg * 0.7)]
           + pts[:13], cor)


def tora(t, x1, y1, x2, y2, g=3):
    """Tora de lenha: um pau grosso com as pontas cortadas (o anel claro)."""
    t.linha([(x1, y1), (x2, y2)], TORA, g * 2)
    t.elipse(x1, y1, g, g, TORA_C)
    t.elipse(x2, y2, g, g, TORA_C)


# ----------------------------------------------------------- FOGUEIRINHA
def fogueirinha(t, costas=False):
    """Fogueirinha de São João que anda: duas toras cruzadas são os pezinhos
    e a chama de cima é o corpo, com carinha no miolo amarelo. FOGO."""
    tora(t, 18, 60, 44, 50)
    tora(t, 20, 50, 46, 60)
    chama(t, 32, 52, 14, 38, FOGO_V, 3)
    chama(t, 32, 51, 11, 30, FOGO_L, 3)
    chama(t, 32, 50, 8, 21, FOGO_A, 2)
    t.elipse(32, 46, 5, 4, FOGO_C)
    t.luz(poupar=CHAMAS)
    t.pxs([(22, 51), (24, 52), (40, 58), (38, 57)], TORA_E)          # veio da madeira
    for x, y in ((12, 22), (51, 18), (15, 32), (49, 30), (20, 12), (46, 9)):   # faíscas
        t.px(x, y, FOGO_A)
        t.pxs([(x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)], FOGO_L)
    if not costas:
        olho(t, 28, 38, 2)
        olho(t, 36, 38, 2)
        t.pxs([(25, 42), (26, 42), (38, 42), (39, 42)], FOGO_V)       # bochecha
        t.pxs([(30, 43), (31, 44), (32, 44), (33, 44), (34, 43)], PRETO)
        t.px(32, 45, FOGO_V)
    t.contorno()
    return t


# ------------------------------------------------------------- FOGUEIRAO
def fogueirao(t, costas=False):
    """A fogueira grande do arraial: toras em pirâmide fazem o corpo, as chamas
    sobem altas e um cordão de bandeirinhas passa na frente. FOGO/NORMAL."""
    # as toras em pé, em teepee, formam o corpo
    for x1, x2 in ((12, 26), (20, 30), (52, 38), (44, 34), (30, 32)):
        t.linha([(x1, 61), (x2, 30)], TORA if x1 % 4 else TORA_E, 6)
    t.linha([(10, 58), (54, 58)], TORA, 6)                           # tora de base
    t.elipse(10, 58, 3, 3, TORA_C)
    t.elipse(54, 58, 3, 3, TORA_C)
    # braços: duas toras de lado
    tora(t, 18, 44, 5, 34, 3)
    tora(t, 46, 44, 59, 34, 3)
    # as chamas altas
    chama(t, 32, 42, 20, 42, FOGO_V, 4)
    chama(t, 32, 41, 16, 33, FOGO_L, 3)
    chama(t, 32, 40, 11, 24, FOGO_A, 3)
    t.elipse(32, 34, 7, 5, FOGO_C)
    t.luz(poupar=CHAMAS)
    for x in (22, 28, 36, 42):                                       # nós da madeira
        t.px(x, 52, TORA_E)
    # o cordão de bandeirinhas, de braço a braço
    cores = [(230, 40, 60, 255), (40, 120, 220, 255), (250, 210, 40, 255),
             (60, 180, 80, 255), (240, 120, 200, 255)]
    corda = [(5 + i * 54 / 12, 34 + 12 * math.sin(math.pi * i / 12)) for i in range(13)]
    t.linha(corda, (236, 226, 200, 255), 1)
    for i in range(1, 12):
        x, y = corda[i]
        x, y = int(x), int(y)
        t.poli([(x - 2, y + 1), (x + 2, y + 1), (x, y + 5)], cores[i % 5])
    if not costas:
        olho(t, 27, 28, 3)
        olho(t, 37, 28, 3)
        t.linha([(24, 23), (29, 24)], PRETO, 1)                      # sobrancelha animada
        t.linha([(35, 24), (40, 23)], PRETO, 1)
        t.elipse(32, 34, 3, 2, FOGO_V)                                # bocão aberto
        t.linha([(29, 33), (35, 33)], PRETO, 1)
    for x, y in ((8, 14), (56, 12), (14, 4), (50, 3), (4, 24), (60, 22)):
        t.pxs([(x, y), (x + 1, y - 1)], FOGO_A)
    t.contorno()
    return t


# ------------------------------------------------------------ BALAOZINHO
def balaozinho(t, costas=False):
    """Balãozinho de papel de São João, gomos vermelhos, amarelos e azuis, a
    bucha acesa embaixo e uma carinha no meio. Vai flutuando. FOGO/VOADOR."""
    cx = 32
    marca = (1, 2, 3, 255)
    # a silhueta do balão: cabeça redonda afinando pra boca
    t.elipse(cx, 20, 17, 15, marca)
    t.poli([(cx - 17, 22), (cx + 17, 22), (cx + 8, 42), (cx - 8, 42)], marca)
    gomos = [(222, 44, 48, 255), (252, 206, 48, 255), (44, 104, 214, 255),
             (252, 206, 48, 255)]
    for y in range(64):
        linha = [x for x in range(64) if t.cor(x, y)[:3] == marca[:3]]
        if not linha:
            continue
        a, b = linha[0], linha[-1]
        meio = (b - a) / 2 or 1
        for x in linha:
            u = (x - (a + b) / 2) / meio                  # -1..1, segue a curva
            k = int((math.asin(max(-1, min(1, u))) / math.pi + 0.5) * 7)
            t.px(x, y, gomos[min(k, 6) % 4])
    t.ret(cx - 8, 41, cx + 8, 43, (240, 236, 220, 255))              # a boca de arame
    t.luz(poupar=CHAMAS)
    t.linha([(cx - 7, 43), (cx - 1, 50)], (90, 80, 70, 255), 1)       # arames até a bucha
    t.linha([(cx + 7, 43), (cx + 1, 50)], (90, 80, 70, 255), 1)
    t.ret(cx - 2, 49, cx + 2, 52, TORA)                              # a bucha
    chama(t, cx, 57, 4, 10, FOGO_L, 2)
    chama(t, cx, 56, 2, 6, FOGO_A, 1)
    # frisos de papel de seda na testa
    t.linha([(cx - 12, 11), (cx + 12, 11)], (255, 255, 255, 255), 1)
    if not costas:
        olho(t, cx - 6, 24, 3)
        olho(t, cx + 6, 24, 3)
        t.pxs([(cx - 11, 28), (cx - 10, 28), (cx + 10, 28), (cx + 11, 28)], (255, 130, 140, 255))
        t.pxs([(cx - 2, 29), (cx - 1, 30), (cx, 30), (cx + 1, 30), (cx + 2, 29)], PRETO)
    t.contorno()
    return t


# --------------------------------------------------------------- BOITATA
def boitata(t, costas=False):
    """O BOITATÁ, a cobra de fogo que guarda os campos: corpo em espiral feito
    de fogo azul com lambidas laranja, a cabeça erguida e os olhos enormes que
    alumiam a noite. FOGO/FANTASMA, lendário."""
    azul = (40, 84, 220, 255)
    azul_c = (90, 170, 255, 255)
    ciano = (190, 240, 255, 255)
    roxo = (60, 36, 140, 255)
    # o caminho do corpo: rabo no meio da espiral, duas voltas, pescoço subindo
    pts = []
    for i in range(70):
        a = 0.2 + i * 0.13
        r = 3 + i * 0.3
        pts.append((32 + r * 1.45 * math.cos(a), 50 + r * 0.45 * math.sin(a), 2 + i * 0.07))
    x0, y0, _ = pts[-1]
    for i in range(1, 16):
        u = i / 15
        pts.append((x0 + (26 - x0) * u - 6 * math.sin(math.pi * u), y0 + (20 - y0) * u, 7))
    # a ponta do rabo é uma chaminha solta no meio da espiral
    chama(t, 33, 52, 3, 9, FOGO_A, 1, torto=2)
    # lambidas de fogo por trás do corpo: laranja e azul, alternando
    for i, (x, y, r) in enumerate(pts[6::4]):
        cor = (FOGO_V, azul_c, FOGO_L)[i % 3]
        chama(t, int(x), int(y - r * 0.4), int(r * 0.7) + 2, int(r * 1.6) + 5, cor, 2,
              torto=-2 if x > 32 else 2)
    for x, y, r in pts:
        t.elipse(x, y, r, r, azul)
    for x, y, r in pts:
        t.elipse(x, y - 1, max(1, r - 3), max(1, r - 3), azul_c)
    # a cabeça: larga, com a mandíbula e a crista de fogo
    chama(t, 26, 13, 11, 16, FOGO_V, 3, torto=3)
    chama(t, 26, 12, 7, 12, FOGO_L, 3, torto=2)
    chama(t, 26, 11, 4, 8, FOGO_A, 1, torto=2)
    t.elipse(26, 16, 13, 9, azul)
    t.poli([(14, 18), (40, 18), (34, 26), (20, 26)], azul)
    t.luz(poupar=CHAMAS + (ciano[:3], azul_c[:3]))
    # miolo quente correndo pelo corpo
    for i in range(8, len(pts) - 3, 3):
        x, y, r = pts[i]
        t.px(int(x), int(y - 1), ciano if i % 2 else FOGO_A)
    if not costas:
        for ex in (20, 32):
            t.elipse(ex, 15, 6, 6, roxo)
            t.elipse(ex, 15, 5, 5, FOGO_A)
            t.elipse(ex, 15, 3, 4, FOGO_C)
            t.ret(ex, 11, ex, 19, (255, 110, 20, 255))           # pupila de cobra
            t.px(ex - 2, 12, BRANCO)
            t.px(ex - 3, 13, BRANCO)
        t.linha([(19, 24), (26, 26), (33, 24)], roxo, 1)
        t.pxs([(22, 25), (30, 25)], BRANCO)                      # presinhas
    else:
        t.elipse(26, 15, 8, 5, azul_c)
    for x, y in ((6, 30), (58, 28), (4, 42), (60, 40), (46, 8), (8, 8)):  # fogo-fátuo
        t.ret(x, y, x + 1, y + 1, ciano)
        t.px(x, y - 1, azul_c)
    t.contorno((20, 16, 48, 255))
    return t


# ------------------------------------------------------------- PENADINHA
def penadinha(t, costas=False):
    """Alminha penada pequenina: fantasminha azul-claro meio transparente, de
    sobrancelha caída, segurando uma velinha acesa com as duas mãos. FANTASMA."""
    alma = (176, 216, 246, 200)
    alma_e = (130, 170, 224, 210)
    cera = (246, 240, 220, 255)
    # cabeça redonda que vai afinando num rabinho torto
    t.elipse(31, 28, 12, 12, alma)
    t.poli([(19, 30), (43, 30), (44, 46), (40, 52), (22, 52), (18, 44)], alma)
    for x in (22, 29, 36):                                   # a barra ondulada
        t.elipse(x, 51, 3, 3, alma)
    t.poli([(38, 48), (44, 50), (50, 56), (44, 56), (38, 54)], alma)   # rabinho
    t.luz()
    # a vela, mais baixa, e as mãozinhas segurando
    t.ret(30, 42, 33, 52, cera)
    t.px(30, 44, clarear(cera))
    chama(t, 31, 42, 2, 7, FOGO_L, 1)
    t.px(31, 39, FOGO_A)
    t.px(31, 40, FOGO_C)
    t.elipse(27, 47, 3, 2, alma_e)
    t.elipse(36, 47, 3, 2, alma_e)
    if not costas:
        olho(t, 26, 28, 2)
        olho(t, 36, 28, 2)
        t.pxs([(23, 25), (24, 24), (25, 24), (26, 23)], PRETO)    # sobrancelha triste
        t.pxs([(39, 25), (38, 24), (37, 24), (36, 23)], PRETO)
        t.pxs([(29, 35), (30, 34), (31, 34), (32, 34), (33, 35)], PRETO)   # boquinha triste
        t.pxs([(25, 31), (25, 32), (24, 33)], (70, 150, 255, 255))   # lágrima
    t.contorno((40, 60, 110, 255))
    return t


# ----------------------------------------------------------- ASSOMBRACAO
def assombracao(t, costas=False):
    """Assombração de casarão colonial: um lençol grande arrastando correntes,
    lampião antigo aceso na mão e olhos que são buracos com luz lá dentro.
    FANTASMA/PSÍQUICO."""
    lencol = (226, 222, 244, 220)
    dobra = (180, 172, 214, 220)
    ferro = (120, 120, 132, 255)
    ferro_c = (190, 190, 204, 255)
    vidro = (255, 220, 110, 255)
    # o lençol: cabeça redonda, ombros largos, barra em pontas
    t.elipse(30, 20, 16, 15, lencol)
    t.poli([(14, 22), (46, 22), (52, 44), (56, 58), (8, 58), (10, 42)], lencol)
    t.poli([(14, 26), (2, 34), (4, 40), (16, 36)], lencol)          # braço esquerdo
    t.poli([(44, 26), (54, 30), (54, 36), (44, 34)], lencol)        # braço do lampião
    for x in range(8, 57, 8):
        t.poli([(x, 56), (x + 4, 62), (x + 8, 56)], lencol)
    t.luz()
    for pts in (((20, 36), (18, 56)), ((32, 38), (32, 58)), ((42, 36), (46, 56))):
        t.linha(list(pts), dobra, 1)
    # correntes: pendendo do braço e cruzando o corpo (elo deitado, elo em pé)
    elos = [(4 + i * 0.3, 40 + i * 3) for i in range(7)]
    elos += [(12 + i * 3, 44 + math.sin(i * 0.5) * 3) for i in range(12)]
    for i, (x, y) in enumerate(elos):
        x, y = int(x), int(y)
        if i % 2:
            t.pxs([(x - 1, y), (x, y), (x + 1, y)], ferro_c)
        else:
            t.anel(x, y, 2, 1, (80, 80, 96, 255), 1)
            t.px(x - 1, y - 1, ferro_c)
    # o lampião
    t.linha([(55, 32), (55, 36)], ferro, 1)
    t.poli([(51, 36), (59, 36), (57, 38), (53, 38)], ferro)
    t.ret(52, 38, 58, 46, vidro)
    t.ret(54, 40, 56, 44, FOGO_C)
    t.ret(52, 38, 52, 46, ferro)
    t.ret(58, 38, 58, 46, ferro)
    t.ret(51, 47, 59, 48, ferro)
    if not costas:
        for ex in (24, 36):
            t.elipse(ex, 19, 4, 5, (30, 20, 50, 255))
            t.elipse(ex, 20, 2, 2, (200, 120, 255, 255))           # a luz psíquica lá dentro
            t.px(ex, 20, (250, 230, 255, 255))
        t.elipse(30, 30, 3, 4, (30, 20, 50, 255))                  # a boca de uivo
    t.contorno((40, 30, 70, 255))
    return t


# -------------------------------------------------------- BEIJAFLORZINHA
def beijaflorzinha(t, costas=False):
    """Beija-florzinho verde furta-cor parado no ar, asas borradas de tanto
    bater e o bico comprido enfiado numa flor. FADA/VOADOR."""
    verde = (50, 176, 110, 255)
    verde_c = (120, 230, 170, 255)
    turq = (40, 150, 190, 255)
    peito = (236, 244, 230, 255)
    asa = (150, 230, 200, 200)
    flor = (236, 60, 120, 255)
    flor_c = (255, 150, 190, 255)
    # a flor, com o caule descendo até o chão
    t.linha([(50, 38), (48, 60)], (60, 130, 60, 255), 2)
    t.poli([(48, 52), (40, 48), (44, 54)], (70, 150, 60, 255))
    for a in range(5):
        ang = a * 2 * math.pi / 5 - math.pi / 2
        t.elipse(51 + 4 * math.cos(ang), 34 + 4 * math.sin(ang), 3, 3, flor)
    # asas batendo: três rastros borrados, do mais apagado pro mais nítido
    for dx, cor in ((-6, (200, 246, 230, 110)), (-3, (170, 236, 214, 160)), (0, asa)):
        t.poli([(27, 30), (14 + dx, 14 + abs(dx)), (20 + dx, 8 + abs(dx) // 2),
                (26 + dx // 2, 10), (31, 28)], cor)
    for dx in (0, 4):
        t.linha([(28, 28), (17 + dx, 11)], (240, 255, 250, 200), 1)
    # corpo em gota inclinada e rabo em tesoura
    t.elipse(26, 36, 8, 7, verde)
    t.poli([(20, 40), (12, 52), (16, 52), (22, 44)], turq)
    t.poli([(22, 42), (18, 54), (21, 54), (25, 43)], turq)
    t.elipse(32, 28, 6, 6, verde)                          # cabeça
    t.luz(poupar=((200, 246, 230), (170, 236, 214), asa[:3], (240, 255, 250)))
    t.elipse(28, 39, 4, 3, peito)
    t.linha([(37, 29), (46, 33)], PRETO, 1)                # o bico comprido
    t.linha([(37, 30), (46, 33)], (60, 50, 50, 255), 1)
    t.pxs([(29, 25), (30, 24), (24, 33), (27, 31)], verde_c)   # brilho furta-cor
    t.pxs([(33, 31), (34, 32)], turq)
    t.elipse(51, 34, 2, 2, flor_c)
    t.px(51, 34, (255, 230, 90, 255))
    if not costas:
        olho(t, 34, 27, 1)
        t.px(35, 26, BRANCO)
    t.contorno()
    return t


# -------------------------------------------------------------- PLUMARIO
def plumario(t, costas=False):
    """O passista das aves: um leque enorme de plumas de carnaval (verde,
    amarelo e rosa) abrindo atrás, lantejoulas pelo peito, asas pra cima e um
    pé só no chão, sambando. FADA/VOADOR."""
    plumas = [(60, 190, 90, 255), (252, 214, 48, 255), (240, 90, 170, 255)]
    corpo = (120, 60, 190, 255)
    corpo_c = (170, 110, 230, 255)
    peito = (252, 196, 60, 255)
    perna = (240, 150, 60, 255)
    risco = (40, 26, 60, 255)
    # o leque de plumas atrás: cada pluma é uma folha comprida saindo do quadril
    ox, oy = 32, 42
    n = 11
    for i in range(n):
        a = math.pi * (1.02 + 0.96 * i / (n - 1))
        c, s_ = math.cos(a), math.sin(a)
        comp = 28 + 11 * abs(s_) - (0 if i % 2 else 4)
        larg = 6
        px_, py_ = -s_, c                                   # perpendicular
        meio = (ox + c * comp * 0.7, oy + s_ * comp * 0.7)
        ponta = (ox + c * comp, oy + s_ * comp)
        cor = plumas[i % 3]
        t.poli([(ox, oy), (meio[0] + px_ * larg, meio[1] + py_ * larg), ponta,
                (meio[0] - px_ * larg, meio[1] - py_ * larg)], cor)
    t.luz(forca=0.25, sombra=0.3)
    for i in range(n):                                       # a haste e o olho de cada pluma
        a = math.pi * (1.02 + 0.96 * i / (n - 1))
        c, s_ = math.cos(a), math.sin(a)
        comp = 28 + 11 * abs(s_) - (0 if i % 2 else 4)
        t.linha([(ox + c * 12, oy + s_ * 12), (ox + c * (comp - 3), oy + s_ * (comp - 3))],
                escurecer(plumas[i % 3], 0.3), 1)
        t.elipse(ox + c * comp * 0.72, oy + s_ * comp * 0.72, 2, 2, plumas[(i + 1) % 3])
        t.px(int(ox + c * comp * 0.72), int(oy + s_ * comp * 0.72), (40, 60, 160, 255))
    # tudo que é bicho ganha um risco escuro por fora, pra descolar do leque
    for dx in (-1, 0, 1):
        for dy in (-1, 0, 1):
            t.poli([(24 + dx, 34 + dy), (9 + dx, 20 + dy), (10 + dx, 30 + dy), (22 + dx, 41 + dy)], risco)
            t.poli([(40 + dx, 34 + dy), (55 + dx, 20 + dy), (54 + dx, 30 + dy), (42 + dx, 41 + dy)], risco)
    t.elipse(32, 42, 11, 12, risco)
    t.elipse(32, 25, 7, 7, risco)
    t.ret(28, 26, 36, 34, risco)
    # asas pra cima, em V
    t.poli([(24, 34), (9, 20), (10, 30), (22, 41)], corpo)
    t.poli([(40, 34), (55, 20), (54, 30), (42, 41)], corpo)
    t.linha([(10, 22), (22, 36)], corpo_c, 1)
    t.linha([(54, 22), (42, 36)], corpo_c, 1)
    # corpo, pescoço, cabeça
    t.elipse(32, 42, 10, 11, corpo)
    t.ret(29, 26, 35, 34, corpo)
    t.elipse(32, 25, 6, 6, corpo)
    t.px(29, 21, corpo_c)
    t.px(30, 20, corpo_c)
    t.elipse(32, 44, 6, 7, peito)
    t.elipse(31, 42, 3, 3, clarear(peito, 0.3))
    # pernas: uma no chão, outra dobrada no passo
    t.linha([(30, 53), (29, 61)], perna, 2)
    t.linha([(26, 62), (33, 62)], perna, 1)
    t.linha([(35, 52), (41, 56), (37, 59)], perna, 2)
    # cocar na cabeça
    for dx, cor in ((-3, plumas[2]), (0, plumas[1]), (3, plumas[0])):
        t.linha([(32, 19), (32 + dx * 2, 9)], cor, 2)
    for x, y in ((29, 40), (35, 40), (31, 46), (35, 47), (28, 48), (33, 50),
                 (13, 25), (51, 25), (18, 32), (46, 32)):          # lantejoulas
        t.px(x, y, BRANCO)
        t.px(x + 1, y + 1, (255, 240, 150, 255))
    if not costas:
        t.poli([(37, 24), (43, 26), (37, 28)], (250, 170, 40, 255))    # bico
        olho(t, 34, 23, 2)
        t.pxs([(31, 21), (32, 20), (33, 20)], plumas[2])                # maquiagem
    t.contorno()
    return t


# --------------------------------------------------------- BRIGADEIRINHO
def brigadeirinho(t, costas=False):
    """Brigadeiro vivo: bolinha de chocolate coberta de granulado colorido,
    sentada na forminha de papel pregueada, bochecha corada. FADA."""
    choco = (122, 70, 44, 255)
    forma = (230, 70, 110, 255)
    forma_e = (180, 40, 80, 255)
    t.elipse(32, 36, 16, 15, choco)
    t.poli([(14, 44), (50, 44), (46, 60), (18, 60)], forma)         # a forminha
    t.luz()
    for x in range(17, 49, 3):                                     # pregas
        t.linha([(x, 45), (x + (32 - x) // 8, 59)], forma_e, 1)
    t.linha([(14, 44), (50, 44)], clarear(forma, 0.4), 1)
    cores = [(250, 80, 80, 255), (250, 220, 60, 255), (80, 200, 120, 255),
             (80, 150, 250, 255), (250, 250, 250, 255), (220, 120, 240, 255)]
    rota = [(22, 26), (28, 23), (36, 22), (42, 27), (19, 34), (45, 34), (25, 29),
            (39, 30), (32, 26), (21, 40), (44, 40), (30, 21), (35, 30), (17, 30),
            (47, 31), (26, 42), (38, 41), (41, 22), (24, 21)]
    for i, (x, y) in enumerate(rota):
        c = cores[i % len(cores)]
        if i % 2:
            t.pxs([(x, y), (x + 1, y)], c)
        else:
            t.pxs([(x, y), (x, y + 1)], c)
    if not costas:
        for ex in (26, 38):
            olho(t, ex, 35, 3, (20, 12, 10, 255))
            t.px(ex + 1, 36, BRANCO)
        t.pxs([(23, 39), (24, 39), (40, 39), (41, 39)], (240, 120, 140, 255))
        t.pxs([(31, 39), (32, 40), (33, 39)], PRETO)
    t.contorno()
    return t


DESENHOS = {
    1060: (fogueirinha, "fogueirinha"),
    1061: (fogueirao, "fogueirao"),
    1062: (balaozinho, "balaozinho"),
    1076: (boitata, "boitata"),
    1067: (penadinha, "penadinha"),
    1068: (assombracao, "assombracao"),
    1070: (beijaflorzinha, "beijaflorzinha"),
    1071: (plumario, "plumario"),
    1072: (brigadeirinho, "brigadeirinho"),
}
