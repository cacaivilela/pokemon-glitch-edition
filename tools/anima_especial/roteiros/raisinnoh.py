"""RAI SINNOH (20096): PÁRA-RAIO. Ele levanta o rabo pro céu e espera...
um raio desce lá de cima, pedaço por pedaço, e cai bem na ponta do rabo! O
corpo inteiro acende (pisca, pisca), as bochechas estalam, e ele guarda a
energia: os estalos descem pro chão e somem. Fica todo orgulhoso, de boné."""
from efeitos import BRILHO, FAISCA_CORES
from efeitos_braglitch import (partes_rai, ondula, so_contorno, RAIO_CEU, RAIO_PONTA, RAIO_CORES, ESTALO)

CHAVE = "20096"
MARGEM = (12, 44, 12, 4)


def quadros(b):
    p = partes_rai(b)
    tudo = b.menos(b.sprite, p["rabo"])
    rabo = p["rabo"]
    fs = []
    ESTALO_CORES = {"y": "#ffe85a", "w": "#fefefe"}

    def montar(ergue=0, raio=0, clarao=False, bochecha=None, chao=None, sobe=0):
        q = b.quadro()
        r = so_contorno(rabo) if clarao else rabo
        ondula(b, q, r, [(0, 13, 0), (14, 25, 0), (26, 40, 0)], dy=-ergue - sobe)
        b.por(q, so_contorno(tudo) if clarao else tudo, dy=-sobe)
        if raio:
            # o raio desce do alto da folha: `raio` pedaços já desceram
            topo = -44
            for k in range(min(raio, 4)):
                b.grade(q, RAIO_CEU, 9 + (k % 2), topo + k * 10, RAIO_CORES)
            if raio >= 5:
                b.grade(q, RAIO_PONTA, 10, 0 - ergue - sobe, RAIO_CORES)
                b.grade(q, ESTALO[raio % 2], 9, 1 - ergue - sobe, ESTALO_CORES)
        if bochecha is not None:
            b.grade(q, BRILHO[bochecha % 3], 40, 22 - sobe, FAISCA_CORES)
            b.grade(q, ESTALO[bochecha % 2], 38, 20 - sobe, ESTALO_CORES)
        if chao is not None:
            for x in (18, 34, 48):
                b.grade(q, ESTALO[(chao + x) % 2], x - 3 + chao, 56, ESTALO_CORES)
        return q

    fs.append((montar(), 120))
    # 1) ergue o rabo e espera
    for e in (1, 2, 3):
        fs.append((montar(ergue=e), 90))
    fs.append((montar(ergue=3), 200))
    # 2) o raio desce, pedaço por pedaço
    for k in range(1, 5):
        fs.append((montar(ergue=3, raio=k), 60))
    # 3) acerta a ponta do rabo: acende e pisca
    for k in range(6):
        fs.append((montar(ergue=3, raio=5 + k, clarao=k % 2 == 0, bochecha=k), 70))
    # 4) guarda a energia: os estalos descem pro chão
    for k in range(4):
        fs.append((montar(ergue=2 - min(k, 2), bochecha=k if k < 2 else None, chao=k), 90))
    # 5) orgulhoso
    fs.append((montar(sobe=1), 120))
    fs.append((montar(sobe=2), 140))
    fs.append((montar(sobe=1), 120))
    fs.append((montar(), 300))
    return fs
