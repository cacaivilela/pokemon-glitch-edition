"""BIDOOF-BRAG (21016): o FILHOTE DE CAPIVARA na beira do rio. Ele senta e
fica quietinho... chega um bem-te-vi e pousa nas costas. Depois o sapinho
pula e senta também. Depois a libélula, na cabeça. Ele? DEIXA: dá um
suspiro bem tranquilo, balança devagar com todo mundo em cima, e solta um
coraçãozinho."""
from efeitos_brag import (BENTEVI, BENTEVI_CORES, SAPINHO, LIBELULA, BICHO_CORES, CORACAOZINHO, CORACAO_CORES)

CHAVE = "21016"
MARGEM = (16, 20, 16, 4)


def quadros(b):
    fs = []

    def montar(dy=0, ave=None, sapo=None, lib=None, cor=None):
        q = b.quadro()
        b.por(q, b.sprite, dy=dy)
        if sapo:
            x, y, t = sapo
            b.grade(q, SAPINHO[t], x, y, BICHO_CORES)
        if ave:
            x, y, t = ave
            b.grade(q, BENTEVI[t % 2], x, y, BENTEVI_CORES)
        if lib:
            x, y, t = lib
            b.grade(q, LIBELULA[t % 2], x, y, BICHO_CORES)
        if cor is not None:
            b.grade(q, CORACAOZINHO, 30 - cor, 14 - cor * 3, CORACAO_CORES)
        return q

    AVE = (46, 19)     # pousada nas costas
    SAPO = (33, 22)    # sentado atrás da cabeça
    LIB = (20, 25)     # em cima da cabeça
    # 1) sentado, quietinho
    fs.append((montar(), 160))
    # 2) o bem-te-vi chega voando e pousa
    for k, (x, y) in enumerate(((72, -12), (62, -4), (54, 6), AVE)):
        fs.append((montar(ave=(x, y, k if k < 3 else 0)), 90))
    fs.append((montar(dy=1, ave=(AVE[0], AVE[1] + 1, 0)), 120))
    # 3) o sapinho pula e senta
    for k, (x, y, t) in enumerate(((-12, 52, 0), (-2, 40, 1), (10, 30, 1), (22, 20, 1), (SAPO[0], SAPO[1], 0))):
        fs.append((montar(ave=(AVE[0], AVE[1], 0), sapo=(x, y, t)), 90))
    fs.append((montar(dy=1, ave=(AVE[0], AVE[1] + 1, 0), sapo=(SAPO[0], SAPO[1] + 1, 0)), 120))
    # 4) a libélula vem e pousa na cabeça
    for k, (x, y) in enumerate(((-14, 4), (0, 10), (12, 14), LIB)):
        fs.append((montar(ave=(AVE[0], AVE[1], 0), sapo=(SAPO[0], SAPO[1], 0), lib=(x, y, k)), 80))
    # 5) ele deixa: suspiro, balança devagar com todo mundo, coraçãozinho
    for k in range(6):
        d = [1, 2, 2, 1, 0, 0][k]
        fs.append((montar(dy=d, ave=(AVE[0], AVE[1] + d, k % 3 == 0), sapo=(SAPO[0], SAPO[1] + d, 0), lib=(LIB[0], LIB[1] + d, k),
                          cor=k - 1 if k >= 1 else None), 130))
    fs.append((montar(ave=(AVE[0], AVE[1], 0), sapo=(SAPO[0], SAPO[1], 0), lib=(LIB[0], LIB[1], 0)), 300))
    return fs
