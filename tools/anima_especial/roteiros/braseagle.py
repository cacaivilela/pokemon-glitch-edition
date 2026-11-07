"""BRASEAGLE (1035): o beagle de fogo que sente a lava andando embaixo do
chão. Ele FAREJA (abaixa a cabeça duas vezes, com o snif snif no nariz),
CAVA (a terra voa pra trás em torrões), ACHA O CALOR... e VOMITA LAVA: puxa o
ar, se curva, e a lava cai da boca num jorro até o chão, faz uma poça que
cresce, respinga e solta vapor, e esfria virando casca. O rabo e a ponta da
orelha são chama: tremulam o tempo todo e soltam brasa."""
from efeitos import LABAREDA, FOGO_CORES, BRASA, TERRA_CORES, FAREJA, LINHA_CORES

from efeitos import FUMACA, FUMACA_CORES

# A LAVA: o jorro que cai da boca (do canto de cima à direita, curvando pra
# baixo e pra esquerda), a poça em três tamanhos, a poça fria (casca), as gotas
LAVA_CORES = {"a": "#181420", "r": "#c8321a", "o": "#ff7a1e", "y": "#ffd23a", "w": "#fff3b0",
              "k": "#6a3420", "K": "#3e1e14"}
JORRO = [
    "....aya", "...ayoa", "...aoya", "..ayoa.", "..aoyra", "..ayoa.", ".aoyra.", ".ayoa..",
    ".aoyra.", ".ayoa..", "aoyra..", "ayoa...", "aoyra..", "ayoa...", "aoyra..", "aywoa..",
    "aoyra..", "ayoa...", "aowya..", "ayoa...", "aoyra..", "ayoa...", "aoyra..", ".aoa...",
]
# o mesmo jorro com o brilho trocado de lugar: alternando os dois ele escorre
JORRO_B = [l.translate(str.maketrans("yo", "oy")) for l in JORRO]
COMECO = [".ao.", "aoya", "ayoa", ".ya.", ".o.."]
POCAS = [
    ["...aaaa...", "..aoyyoa..", ".aaaaaaaa."],
    ["....aaaaaa....", "..aaoyywyyoa..", ".aorryoooyrroa", "aaaaaaaaaaaaaa"],
    ["......aaaaaaa......", "...aaoyywwyyyoaa...", ".aaoryyoooooyyroaa.", "aorroooyyyooooorroa", "aaaaaaaaaaaaaaaaaaa"],
]
# esfriando: o amarelo vira casca, e sobram rachaduras laranja
POCA_MORNA = [l.translate(str.maketrans("yr", "oK")) for l in POCAS[2]]
POCA_FRIA = [l.translate(str.maketrans("yowr", "kKoK")) for l in POCAS[2]]
GOTA = [[".a.", "aoa", ".a."], ["y"], ["ao", "oa"]]

# torrões grandes, pra terra que ele cava aparecer voando
TORRAO = [
    [".aa.", "appa", "aPpa", ".aa."],
    ["..a..", ".apa.", "appPa", ".aPa.", "..a.."],
    [".aaa.", "aptpa", "apPPa", ".aaa."],
]

CHAVE = "1035"
MARGEM = (26, 14, 12, 4)       # a lava cai à esquerda, além do focinho


def quadros(b):
    rabo = b.retangulo(55, 7, 63, 36)
    orelha_fogo = b.parte(lambda x, y, c: x <= 8 and 37 <= y <= 49)
    # a cabeça é do focinho até o pescoço, mais as orelhas compridas que descem;
    # o peito fica no corpo (senão ela leva o peito junto e abre um buraco)
    cabeca = b.menos(b.parte(lambda x, y, c: 12 <= y and ((x <= 31 and y <= 36) or (x <= 10 and y <= 49))), orelha_fogo)
    torroes = b.parte(lambda x, y, c: y >= 59)
    corpo = b.menos(b.sprite, rabo, orelha_fogo, cabeca, torroes)
    fs = []

    def chama(q, parte, t, dx=0, dy=0, x0=0, y0=0, alto=10):
        """a chama tremulando: as linhas de cima balançam pros lados"""
        for k in range(alto):
            fatia = b.parte(lambda x, y, c, k=k: parte.getpixel((x, y))[3] and y == y0 + k)
            balanco = [0, 1, 1, 0, -1, -1][(t + k // 3) % 6] if k < alto * 0.6 else 0
            b.por(q, fatia, dx=dx + balanco, dy=dy)
        resto = b.parte(lambda x, y, c: parte.getpixel((x, y))[3] and y >= y0 + alto)
        b.por(q, resto, dx=dx, dy=dy)

    def montar(t, cab_dy=0, cab_dx=0, terra=None, fogo=None, fareja=False, lava=None):
        q = b.quadro()
        # a poça fica no chão, atrás dele (antes das patas)
        for g, x, y in (lava or {}).get("chao", []):
            b.grade(q, g, x, y, LAVA_CORES)
        b.por(q, torroes)
        b.por(q, corpo)
        chama(q, rabo, t, y0=7, alto=18)
        # subindo, a cabeça também fica no lugar por baixo: o pescoço estica
        # em vez de abrir um buraco
        if cab_dy < 0:
            b.por(q, cabeca, dx=cab_dx)
        b.por(q, cabeca, dx=cab_dx, dy=cab_dy)
        chama(q, orelha_fogo, t + 3, dx=cab_dx, dy=cab_dy, y0=37, alto=6)
        # a brasa que sobe da ponta do rabo
        b.grade(q, BRASA[t % 3], 58 + (t % 2), 4 - (t % 4), FOGO_CORES)
        if fareja:
            b.grade(q, FAREJA, -4 + cab_dx, 26 + cab_dy, LINHA_CORES)
        for (k, x, y) in terra or []:
            b.grade(q, TORRAO[k % 3], x, y, TERRA_CORES)
        for (k, x, y) in fogo or []:
            b.grade(q, LABAREDA[k], x, y, FOGO_CORES)
        for g, x, y in (lava or {}).get("ar", []):
            b.grade(q, g, x, y, LAVA_CORES)
        for tam, x, y in (lava or {}).get("vapor", []):
            b.grade(q, FUMACA[tam], x, y, FUMACA_CORES)
        return q

    # 1) parado, o fogo tremulando
    for t in range(3):
        fs.append((montar(t), 110))
    # 2) FAREJA: abaixa a cabeça duas vezes
    for k, (dy, snif) in enumerate([(2, False), (4, True), (4, False), (2, True), (4, True), (2, False)]):
        fs.append((montar(3 + k, cab_dy=dy, fareja=snif), 100))
    # 3) CAVA: a cabeça baixa e a terra voando pra trás em arco
    for k in range(8):
        terra = []
        for j in range(3):
            idade = k - j * 2
            if 0 <= idade < 6:
                terra.append((j + k, 24 + idade * 7, 52 - [0, 8, 13, 15, 12, 6][idade]))
        fs.append((montar(9 + k, cab_dy=5, cab_dx=1 if k % 2 else 0, terra=terra), 80))
    # 4) ACHOU: levanta a cabeça
    fs.append((montar(17, cab_dy=-2), 160))
    # 5) VOMITA LAVA: puxa o ar (a cabeça sobe), se curva, e a lava cai da boca
    #    (x 3, y 34) até o chão (y 58), onde a poça cresce, respinga e esfria
    boca_x, boca_y, chao = -3, 34, 57
    poca = lambda k: (POCAS[k], -6 - len(POCAS[k][0]) // 2 + 2, chao + 3 - len(POCAS[k]))
    cenas = [
        dict(cab=(-3, 0), ms=140),
        dict(cab=(1, -1), ms=90),
        dict(cab=(3, -1), ar=[(COMECO, 0, boca_y)], ms=80),
        dict(cab=(3, -1), ar=[(JORRO, boca_x, boca_y)], chao=[poca(0)], gotas=[(1, -14, 54)], ms=80),
        dict(cab=(3, -1), ar=[(JORRO_B, boca_x, boca_y)], chao=[poca(1)], gotas=[(0, -17, 52), (2, 2, 55)], ms=80),
        dict(cab=(3, -1), ar=[(JORRO, boca_x, boca_y)], chao=[poca(2)], gotas=[(0, -20, 50), (1, 5, 53)], ms=80),
        dict(cab=(3, -1), ar=[(JORRO_B, boca_x, boca_y)], chao=[poca(2)], gotas=[(1, -22, 52), (0, 7, 51)], ms=80),
        dict(cab=(2, 0), ar=[(JORRO[12:], boca_x, boca_y + 12)], chao=[poca(2)], ms=80),
        dict(cab=(0, 0), chao=[poca(2)], vapor=[(0, -8, 50)], ms=100),
        dict(cab=(0, 0), chao=[(POCA_MORNA, *poca(2)[1:])], vapor=[(1, -9, 46), (0, -2, 50)], ms=120),
        dict(cab=(0, 0), chao=[(POCA_FRIA, *poca(2)[1:])], vapor=[(2, -11, 40), (1, -3, 45)], ms=150),
        dict(cab=(0, 0), chao=[(POCA_FRIA, *poca(2)[1:])], vapor=[(3, -13, 33)], ms=200),
    ]
    for k, c in enumerate(cenas):
        ar = list(c.get("ar", [])) + [(GOTA[i], x, y) for i, x, y in c.get("gotas", [])]
        fs.append((montar(18 + k, cab_dy=c["cab"][0], cab_dx=c["cab"][1],
                          lava={"ar": ar, "chao": c.get("chao", []), "vapor": c.get("vapor", [])}), c["ms"]))
    fs.append((montar(25), 300))
    return fs


# ------------------------------------------------------------- DE COSTAS
# Vista de trás: o rabo de fogo fica em cima à esquerda e a cabeça à direita.
# Ele fareja (a cabeça abaixa), cava — e a terra voa pra TRÁS, pra cima de
# quem está vendo (pra esquerda e pra baixo) —, e vomita a lava pra FRENTE: o
# jorro cai depois da cabeça, à direita, e a poça fica na frente dele.
MARGEM_COSTAS = (16, 14, 32, 8)


def quadros_costas(b):
    rabo = b.retangulo(0, 7, 9, 30)
    orelha_fogo = b.parte(lambda x, y, c: x >= 55 and 41 <= y <= 49)
    cabeca = b.menos(b.parte(lambda x, y, c: 12 <= y and ((x >= 33 and y <= 34) or (x >= 53 and y <= 49))), orelha_fogo)
    torroes = b.parte(lambda x, y, c: y >= 59)
    corpo = b.menos(b.sprite, rabo, orelha_fogo, cabeca, torroes)
    fs = []

    def chama(q, parte, t, dx=0, dy=0, y0=0, alto=10):
        for k in range(alto):
            fatia = b.parte(lambda x, y, c, k=k: parte.getpixel((x, y))[3] and y == y0 + k)
            balanco = [0, 1, 1, 0, -1, -1][(t + k // 3) % 6] if k < alto * 0.6 else 0
            b.por(q, fatia, dx=dx + balanco, dy=dy)
        b.por(q, b.parte(lambda x, y, c: parte.getpixel((x, y))[3] and y >= y0 + alto), dx=dx, dy=dy)

    def montar(t, cab_dy=0, terra=None, fogo=None, lava=None):
        q = b.quadro()
        for g, x, y in (lava or {}).get("chao", []):
            b.grade(q, g, x, y, LAVA_CORES)
        b.por(q, torroes)
        b.por(q, corpo)
        chama(q, rabo, t, y0=7, alto=16)
        if cab_dy < 0:
            b.por(q, cabeca)
        b.por(q, cabeca, dy=cab_dy)
        chama(q, orelha_fogo, t + 3, dy=cab_dy, y0=41, alto=5)
        b.grade(q, BRASA[t % 3], 3 + (t % 2), 4 - (t % 4), FOGO_CORES)
        for (k, x, y) in terra or []:
            b.grade(q, TORRAO[k % 3], x, y, TERRA_CORES)
        for (k, x, y) in fogo or []:
            b.grade(q, LABAREDA[k], x, y, FOGO_CORES)
        for g, x, y, esp in (lava or {}).get("ar", []):
            b.grade(q, g, x, y, LAVA_CORES, espelha=esp)
        for tam, x, y in (lava or {}).get("vapor", []):
            b.grade(q, FUMACA[tam], x, y, FUMACA_CORES)
        return q

    for t in range(3):
        fs.append((montar(t), 110))
    for k, dy in enumerate([2, 4, 4, 2, 4, 2]):
        fs.append((montar(3 + k, cab_dy=dy), 100))
    # a terra vem pra cima de você: sai das patas da frente e cai à esquerda, embaixo
    for k in range(8):
        terra = []
        for j in range(3):
            idade = k - j * 2
            if 0 <= idade < 6:
                terra.append((j + k, 30 - idade * 7, 50 - [0, 7, 10, 9, 5, -2][idade] + idade))
        fs.append((montar(9 + k, cab_dy=5, terra=terra), 80))
    fs.append((montar(17, cab_dy=-2), 160))
    # VOMITA LAVA pra frente: o jorro sai depois da cabeça (à direita, espelhado)
    # e cai na frente dele, onde a poça cresce, respinga e esfria
    boca_x, boca_y, chao = 63, 33, 57
    poca = lambda g: (g, 72 - len(g[0]) // 2, chao + 3 - len(g))
    cenas = [
        dict(cab=-3, ms=140), dict(cab=1, ms=90),
        dict(cab=3, ar=[(COMECO, boca_x + 3, boca_y, True)], ms=80),
        dict(cab=3, ar=[(JORRO, boca_x, boca_y, True)], chao=[poca(POCAS[0])], ms=80),
        dict(cab=3, ar=[(JORRO_B, boca_x, boca_y, True)], chao=[poca(POCAS[1])], gotas=[(0, 82, 52)], ms=80),
        dict(cab=3, ar=[(JORRO, boca_x, boca_y, True)], chao=[poca(POCAS[2])], gotas=[(1, 85, 50), (2, 62, 55)], ms=80),
        dict(cab=3, ar=[(JORRO_B, boca_x, boca_y, True)], chao=[poca(POCAS[2])], gotas=[(0, 87, 52)], ms=80),
        dict(cab=2, ar=[(JORRO[12:], boca_x, boca_y + 12, True)], chao=[poca(POCAS[2])], ms=80),
        dict(cab=0, chao=[poca(POCAS[2])], vapor=[(0, 72, 50)], ms=100),
        dict(cab=0, chao=[poca(POCA_MORNA)], vapor=[(1, 71, 46)], ms=120),
        dict(cab=0, chao=[poca(POCA_FRIA)], vapor=[(2, 69, 40)], ms=150),
        dict(cab=0, chao=[poca(POCA_FRIA)], vapor=[(3, 68, 33)], ms=200),
    ]
    for k, c in enumerate(cenas):
        ar = list(c.get("ar", [])) + [(GOTA[i], x, y, False) for i, x, y in c.get("gotas", [])]
        fs.append((montar(18 + k, cab_dy=c["cab"], lava={"ar": ar, "chao": c.get("chao", []), "vapor": c.get("vapor", [])}), c["ms"]))
    fs.append((montar(25), 300))
    return fs
