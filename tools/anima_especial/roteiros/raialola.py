"""RAI ALOLA (20099): SURFANDO NO PRÓPRIO RABO. As ondas passam embaixo e
ele vai deslizando em cima do rabo, inclinando o corpo pra se equilibrar.
Vem uma onda maior: ele sobe nela, dá um salto com a prancha-rabo (girando
pro outro lado com a força psíquica, faíscas roxas em volta) e cai de volta
na água espirrando. De boné de Alola, claro."""
from efeitos import BRILHO_ROXO, FAISCA_CORES
from efeitos_braglitch import ONDA, ESPIRRO, AGUA_CORES

CHAVE = "20099"
MARGEM = (16, 26, 16, 10)


def quadros(b):
    prancha = b.parte(lambda x, y, c: y >= 66 or (y >= 52 and x <= 34))
    surfista = b.menos(b.sprite, prancha)
    fs = []

    def montar(t, dx=0, sobe=0, inclina=0, vira=False, onda_alta=0, espirro=None, roxo=False):
        q = b.quadro()
        # o mar: uma fileira de ondinhas andando pra direita (a cada quadro)
        for k in range(-1, 9):
            x = k * 12 + (t * 3) % 12 - 14
            b.grade(q, ONDA[t % 2], x, 79 - (onda_alta if 30 <= x + 6 <= 70 else 0), AGUA_CORES)
        if vira:
            b.por(q, b.sprite, dx=dx, dy=-sobe, vira=True)
        else:
            b.por(q, prancha, dx=dx, dy=-sobe)
            b.por(q, surfista, dx=dx + inclina, dy=-sobe)
        if espirro is not None:
            b.grade(q, ESPIRRO[espirro], 74 + dx, 70 - sobe, AGUA_CORES)
            b.grade(q, ESPIRRO[espirro], 14 + dx, 72 - sobe, AGUA_CORES)
        if roxo:
            for k, (x, y) in enumerate(((20, 30), (70, 24), (76, 52), (16, 58))):
                b.grade(q, BRILHO_ROXO[(t + k) % 3], x + dx, y - sobe, FAISCA_CORES)
        return q

    # 1) deslizando, se equilibrando
    for t in range(8):
        fs.append((montar(t, dx=[0, -1, -2, -2, -1, 0, 1, 1][t], inclina=[0, -1, -1, 0, 1, 1, 0, 0][t], sobe=t % 2), 100))
    # 2) a onda grande chega e ele sobe nela
    for k, h in enumerate((2, 4, 6)):
        fs.append((montar(8 + k, sobe=h, onda_alta=h, inclina=1), 90))
    # 3) o salto girando, com faíscas roxas
    for k, s in enumerate((12, 18, 20, 18, 12)):
        fs.append((montar(11 + k, sobe=s, vira=1 <= k <= 3, roxo=True, espirro=0 if k == 0 else None), 80))
    # 4) cai espirrando água
    fs.append((montar(16, sobe=2, espirro=1), 80))
    fs.append((montar(17, espirro=2, inclina=-1), 90))
    fs.append((montar(18, espirro=1), 100))
    fs.append((montar(19, sobe=1), 110))
    fs.append((montar(20), 300))
    return fs
