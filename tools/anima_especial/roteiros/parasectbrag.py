"""PARASECT-BRAG (21008): a RAINHA DO FORMIGUEIRO. As operárias chegam em
fila, cada uma com um pedacinho de folha; a rainha pega com a pinça e joga
lá pro alto, pro JARDIM do cogumelo das costas. O chapéu treme, solta
esporo... e brotam cogumelinhos, um, dois, três, crescendo. Ela levanta as
pinças, orgulhosa, e as formiguinhas pulam de alegria."""
from efeitos_brag import FORMIGUINHA, FORMIGA_CORES, BROTO, BROTO_CORES, ESPORO, ESPORO_CORES, FOLHINHA, FOLHA_CORES

CHAVE = "21008"
MARGEM = (26, 16, 8, 4)

JARDIM = [(29, 16), (36, 12), (44, 9)]   # onde cada broto nasce (o pé dele, em cima do chapéu)


def quadros(b):
    pinca = b.retangulo(0, 26, 17, 42)
    corpo = b.menos(b.sprite, pinca)
    fs = []

    def montar(pinca_dy=0, pinca_dx=0, treme=0, brotos=(), formigas=(), esporos=(), folhas=(), dy=0):
        q = b.quadro()
        b.por(q, corpo, dx=treme, dy=dy)
        b.por(q, pinca, dx=pinca_dx + treme, dy=pinca_dy + dy)
        for k, est in enumerate(brotos):
            if est is not None:
                g = BROTO[est]
                x, y = JARDIM[k]
                b.grade(q, g, x - len(g[0]) // 2 + treme, y - len(g) + 1 + dy, BROTO_CORES)
        for (x, y, p) in formigas:
            b.grade(q, FORMIGUINHA[p % 2], x, y, FORMIGA_CORES)
        for (x, y, t) in esporos:
            b.grade(q, ESPORO[t % 3], x, y, ESPORO_CORES)
        for (x, y, t) in folhas:
            b.grade(q, FOLHINHA[t % 4], x, y, FOLHA_CORES)
        return q

    # 1) as operárias chegam em fila pela esquerda
    for k in range(6):
        fila = [(-16 + k * 4 - j * 9, 50, k + j) for j in range(3)]
        fs.append((montar(formigas=[f for f in fila if f[0] > -27]), 90))
    chegou = [(4, 50), (-5, 50), (-14, 50)]
    # 2) a rainha pega as folhas com a pinça e joga pro alto, pro jardim
    for vez in range(3):
        fila = [(x, y, 0) for x, y in chegou]
        fs.append((montar(pinca_dy=2, pinca_dx=-1, formigas=fila), 80))
        voo = [(4, 20), (16, 4), (26, 2)]
        for k, (x, y) in enumerate(voo):
            fs.append((montar(pinca_dy=-2 if k == 0 else 0, formigas=fila, brotos=[0 if i < vez else None for i in range(3)],
                              folhas=[(x + vez * 4, y, k)]), 60))
    # 3) o chapéu treme, solta esporo e os brotos crescem
    for k in range(6):
        est = [min(3, 1 + k // 2), min(3, k // 2 + (1 if k > 1 else 0)), min(3, max(0, k // 2))]
        fs.append((montar(treme=[1, -1][k % 2], brotos=est, formigas=[(x, y, 0) for x, y in chegou],
                          esporos=[(26 + k * 3, 4 - k, k), (48 - k * 2, 2 - k, k + 1)]), 80))
    # 4) levanta as pinças, orgulhosa; as formigas pulam
    for k in range(5):
        pula = [0, -3, 0, -3, 0][k]
        fs.append((montar(pinca_dy=-3 if k % 2 else -1, dy=-1 if k % 2 else 0, brotos=[3, 3, 3],
                          formigas=[(x, y + (pula if j % 2 == 0 else -3 - pula), 0) for j, (x, y) in enumerate(chegou)]), 100))
    fs.append((montar(brotos=[3, 3, 3], formigas=[(x, y, 0) for x, y in chegou]), 300))
    return fs
