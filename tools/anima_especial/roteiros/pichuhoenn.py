"""PICHU HOENN (30095): o CHOQUINHO QUE VOLTA. Ele fecha a cara, as
bochechas começam a faiscar, ele junta força tremendo... e o choque estoura
NELE mesmo (PICHU ainda não sabe controlar)! Acende inteiro, o boné pula na
cabeça, e ele fica tonto, balançando, com estrelinhas rodando em volta. Sacode
a cabeça e sorri: nem ligou."""
from efeitos import BRILHO, FAISCA_CORES
from efeitos_braglitch import (partes_pichu, so_contorno, ESTALO, ESTRELA, SINAL_CORES,
                               CABECA_PICHU, CABECA_PICHU_CORES)

CHAVE = "30095"
MARGEM = (14, 20, 14, 4)


def quadros(b):
    p = partes_pichu(b)
    corpo, bone, rabo = p["corpo"], p["bone"], p["rabo"]
    fs = []

    def montar(treme=0, faisca=None, clarao=False, bone_pula=0, estalo=None, tonto=None, balanca=0):
        q = b.quadro()
        dx = treme + balanca
        b.por(q, so_contorno(rabo) if clarao else rabo, dx=dx)
        b.grade(q, CABECA_PICHU, 26 + dx, 16, CABECA_PICHU_CORES)
        b.por(q, so_contorno(corpo) if clarao else corpo, dx=dx)
        b.por(q, bone, dx=dx, dy=-bone_pula)
        if faisca is not None:
            b.grade(q, BRILHO[faisca % 3], 22 + dx, 29, FAISCA_CORES)
            b.grade(q, BRILHO[(faisca + 1) % 3], 41 + dx, 29, FAISCA_CORES)
        if estalo is not None:
            cores = {"y": "#ffe85a", "w": "#fefefe"}
            for x, y in ((16, 24), (42, 18), (40, 38), (18, 38)):
                b.grade(q, ESTALO[(estalo + x) % 2], x + dx, y, cores)
        if tonto is not None:
            # três estrelinhas rodando em volta da cabeça (uma roda de 8 posições)
            roda = [(22, 6), (28, 4), (35, 4), (41, 6), (40, 9), (34, 11), (28, 11), (22, 9)]
            for k in range(3):
                x, y = roda[(tonto + k * 3) % 8]
                b.grade(q, ESTRELA[0], x + dx, y, SINAL_CORES)
        return q

    fs.append((montar(), 120))
    # 1) faísca nas bochechas, juntando força
    for k in range(5):
        fs.append((montar(faisca=k, treme=[0, 0, -1, 1, -1][k]), 90))
    # 2) o choque estoura nele
    for k in range(4):
        fs.append((montar(clarao=k % 2 == 0, estalo=k, bone_pula=[3, 2, 1, 0][k]), 70))
    # 3) tonto, balançando, com estrelinhas rodando
    for k in range(10):
        fs.append((montar(tonto=k, balanca=[0, 1, 1, 0, -1, -1, 0, 1, 0, -1][k]), 90))
    # 4) sacode a cabeça e fica bem
    for k in range(3):
        fs.append((montar(treme=[2, -2, 1][k]), 60))
    fs.append((montar(), 300))
    return fs
