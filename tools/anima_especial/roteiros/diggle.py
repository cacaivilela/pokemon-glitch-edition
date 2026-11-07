"""DIGGLE (1029): o FARO BOM. Ele abaixa a cabeça e fareja o chão (snif,
snif), abana o rabo de chama e começa a CAVAR — os torrões de terra voam pros
lados. Procurava osso... e acha BRASA: uma labareda sobe do buraco! Ele pula
pra trás de susto com um "!", depois abana o rabo de alegria e a chama da
ponta do rabo cresce: a terra de Braglitch é quente por baixo."""
from efeitos import FAREJA, LINHA_CORES, TORRAO, TERRA_CORES, LABAREDA, BRASA, FOGO_CORES
from efeitos_braglitch import ondula, EXCLAMA, SINAL_CORES, CHAMA, CHAMA_CORES

CHAVE = "1029"
MARGEM = (18, 22, 16, 6)


def quadros(b):
    rabo = b.parte(lambda x, y, c: x >= 50 and y <= 41)
    cabeca = b.parte(lambda x, y, c: y <= 44 and x <= 41 and not (y >= 37 and x >= 18 and x <= 33 and y > 40))
    torroes = b.parte(lambda x, y, c: y >= 57 and (x <= 20 or x >= 43) and not (18 <= x <= 50 and y <= 58))
    corpo = b.menos(b.sprite, rabo, cabeca, torroes)
    fs = []

    def montar(t, abaixa=0, abana=0, sobe=0, dx=0, fareja=False, terra=None, fogo=None, susto=False, chama=None):
        q = b.quadro()
        ondula(b, q, rabo, [(0, 22, dx + abana * 2), (23, 32, dx + abana), (33, 45, dx)], dy=-sobe)
        b.por(q, corpo, dx=dx, dy=-sobe)
        b.por(q, cabeca, dx=dx - (1 if abaixa > 2 else 0), dy=abaixa - sobe)
        b.por(q, torroes)
        if fareja:
            b.grade(q, FAREJA, 14 + dx + (t % 2), 46 + abaixa, LINHA_CORES)
        if terra is not None:
            # os torrões voam em arco pros dois lados do buraco (x 26, y 58)
            for k in range(3):
                s = terra - k
                if 0 <= s < 5:
                    alt = [0, 6, 9, 8, 4][s]
                    b.grade(q, TORRAO[(k + s) % 3], 10 - s * 4 - k, 58 - alt, TERRA_CORES)
                    b.grade(q, TORRAO[(k + s + 1) % 3], 16 + s * 2 + k, 54 - alt * 2, TERRA_CORES)
        if fogo is not None:
            if fogo < 2:
                g = LABAREDA[fogo + 1]
                b.grade(q, g, 13 - len(g[0]) // 2, 62 - len(g), FOGO_CORES)
            else:
                b.grade(q, CHAMA[fogo % 2], 8, 50, CHAMA_CORES)
            if fogo >= 2:
                for k, (x, y) in enumerate(((6, 50), (18, 46), (12, 42))):
                    b.grade(q, BRASA[(fogo + k) % 3], x, y - fogo, FOGO_CORES)
        if susto:
            b.grade(q, EXCLAMA, 6 + dx, 6 - sobe, SINAL_CORES)
        if chama is not None:
            g = LABAREDA[chama]
            b.grade(q, g, 61 + dx + abana * 2 - len(g[0]) // 2, 22 - len(g) - sobe, FOGO_CORES)
        return q

    fs.append((montar(0), 120))
    # 1) fareja o chão
    for k in range(4):
        fs.append((montar(k, abaixa=[2, 3, 3, 3][k], fareja=k > 0, abana=k % 2), 110))
    # 2) cava na frente da pata (x 12): a terra voa
    for k in range(8):
        fs.append((montar(k, abaixa=3 + k % 2, abana=[1, -1][k % 2], terra=k), 70))
    # 3) acha BRASA! e pula pra trás
    fs.append((montar(0, abaixa=3, fogo=0), 90))
    fs.append((montar(1, abaixa=1, fogo=1), 90))
    fs.append((montar(2, sobe=6, dx=4, fogo=2, susto=True), 80))
    fs.append((montar(3, sobe=3, dx=6, fogo=3, susto=True), 90))
    fs.append((montar(4, dx=6, fogo=3, susto=True), 150))
    # 4) abana o rabo de alegria e a chama do rabo cresce
    for k in range(6):
        fs.append((montar(k, dx=6 - k, fogo=2 if k < 3 else None, abana=[2, -1, 2, -1, 1, 0][k], chama=min(k // 2, 2)), 90))
    fs.append((montar(0, chama=1), 300))
    return fs
