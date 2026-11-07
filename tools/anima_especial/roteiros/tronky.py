"""TRONKY (1031): a MUDA ACORDA. Ele pisca os olhos amarelos, espreguiça
os galhos (um sobe, o outro desce, e troca), a copa balança pros lados e as
folhas vão caindo girando. Aí ele bate o pé (se abaixa e dá um pulinho) e,
pelas rachaduras da casca escura, pinga a tinta VERMELHA do cerne — a tinta
do pau-brasil que deu nome à terra."""
from efeitos_braglitch import ondula, agachar, FOLHA, FOLHA_CORES, GOTA, POEIRA, POEIRA_CORES

CHAVE = "1031"
MARGEM = (10, 12, 10, 6)
OLHO = ["eeeee", "eeeee", "lllll", "eeeee"]          # o olho fechado
OLHO_CORES = {"e": "#342422", "l": "#ffc83c"}
TINTA = {"a": "#181420", "b": "#c4282c", "B": "#8a1418", "w": "#f46046"}


def quadros(b):
    copa = b.parte(lambda x, y, c: y <= 27 and 10 <= x <= 55 and not (y >= 23 and (x <= 11 or x >= 53)))
    braco_e = b.parte(lambda x, y, c: x <= 22 and 22 <= y <= 38)
    braco_d = b.parte(lambda x, y, c: x >= 43 and 22 <= y <= 36)
    corpo = b.menos(b.sprite, copa, braco_e, braco_d)
    fs = []

    def montar(t, balanca=0, be=0, bd=0, pisca=False, folhas=None, abaixa=0, sobe=0, tinta=None, poeira=None):
        q = b.quadro()
        for img in (braco_e, braco_d):
            dy = (be if img is braco_e else bd) + abaixa - sobe
            b.por(q, img, dy=dy)
        if abaixa:
            agachar(b, q, corpo, 44, abaixa)
        else:
            b.por(q, corpo, dy=-sobe)
        ondula(b, q, copa, [(0, 8, balanca * 2), (9, 18, balanca), (19, 27, 0)], dy=abaixa - sobe)
        if pisca:
            for x in (26, 34):
                b.grade(q, OLHO, x, 36 + abaixa - sobe, OLHO_CORES)
        if folhas is not None:
            for k, (x0, atraso) in enumerate(((6, 0), (50, 2), (20, 4), (40, 6))):
                s = folhas - atraso
                if 0 <= s < 9:
                    b.grade(q, FOLHA[(s + k) % 4], x0 + [0, 2, 3, 2, 0, -2, -3, -2, 0][s], 14 + s * 5, FOLHA_CORES)
        if tinta is not None:
            for k, (x, y) in enumerate(((26, 32), (39, 33), (31, 45))):
                s = tinta - k * 2
                if 0 <= s < 6:
                    b.grade(q, GOTA[1 if s > 1 else 0], x, y + s * 4 - sobe, TINTA)
        if poeira is not None:
            b.grade(q, POEIRA[poeira], 14, 58, POEIRA_CORES)
            b.grade(q, POEIRA[poeira], 44, 58, POEIRA_CORES)
        return q

    fs.append((montar(0), 150))
    fs.append((montar(0, pisca=True), 110))
    fs.append((montar(0), 140))
    # 1) espreguiça: braço sobe, braço desce, copa balança, folhas caem
    for t in range(12):
        lado = [0, 1, 2, 1, 0, -1, -2, -1][t % 8]
        fs.append((montar(t, balanca=lado, be=-lado, bd=lado, folhas=t), 90))
    # 2) bate o pé
    fs.append((montar(0, abaixa=2), 90))
    fs.append((montar(0, abaixa=3), 100))
    fs.append((montar(0, sobe=4, be=-2, bd=-2), 80))
    fs.append((montar(0, abaixa=2, poeira=1, tinta=0), 80))
    # 3) a tinta vermelha pinga das rachaduras
    for t in range(1, 9):
        fs.append((montar(t, poeira=2 if t == 1 else None, tinta=t, pisca=t == 6), 100))
    fs.append((montar(0), 300))
    return fs
