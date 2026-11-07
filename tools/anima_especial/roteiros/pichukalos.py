"""PICHU KALOS (30098): a DANCINHA. Toca a música (as notas aparecem) e ele
dança: pulinho pra um lado, pulinho pro outro, virando de frente pra cada
lado, abanando o rabo; termina com um giro rápido (vira, vira, vira) e uma
pose final com estrela. O boné grande balança junto, e ele não liga."""
from efeitos_braglitch import (partes_pichu, agachar, CABECA_PICHU, CABECA_PICHU_CORES, NOTA, ESTRELA,
                               SINAL_CORES)

CHAVE = "30098"
MARGEM = (18, 24, 18, 4)


def quadros(b):
    p = partes_pichu(b)
    corpo, bone, rabo = p["corpo"], p["bone"], p["rabo"]
    fs = []

    def montar(t, dx=0, sobe=0, vira=False, abaixa=0, bone_dy=0, notas=True, estrela=None):
        q = b.quadro()
        rx = dx - 9 if vira else dx
        b.por(q, rabo, dx=rx + (t % 2) * (-1 if vira else 1), dy=-sobe, vira=vira)
        b.grade(q, CABECA_PICHU, 26 + dx, 16 - sobe + abaixa, CABECA_PICHU_CORES)
        if abaixa:
            agachar(b, q, corpo, 38, abaixa, dx=dx)
        else:
            b.por(q, corpo, dx=dx, dy=-sobe, vira=vira)
        b.por(q, bone, dx=dx, dy=-sobe + abaixa - bone_dy, vira=vira)
        if notas:
            for k, (x, y) in enumerate(((10, 30), (50, 26))):
                tt = (t + k * 3) % 6
                b.grade(q, NOTA[(t // 3 + k) % 2], x + (tt % 2), y - tt * 3, SINAL_CORES)
        if estrela is not None:
            b.grade(q, ESTRELA[estrela], 44, 8, SINAL_CORES)
        return q

    t = 0
    fs.append((montar(t, notas=False), 150))
    # 1) pulinhos: esquerda, direita, esquerda, direita
    for vez in range(2):
        for lado in (-1, 1):
            for sobe, ms in ((3, 80), (1, 80), (0, 100)):
                t += 1
                fs.append((montar(t, dx=lado * 4, sobe=sobe, vira=lado > 0, bone_dy=1 if sobe == 3 else 0), ms))
    # 2) o giro
    for k in range(6):
        t += 1
        fs.append((montar(t, sobe=2, vira=k % 2 == 0), 60))
    # 3) pose
    t += 1
    fs.append((montar(t, abaixa=2), 100))
    fs.append((montar(t + 1, sobe=1, estrela=0, notas=False), 120))
    fs.append((montar(t + 2, estrela=1, notas=False), 130))
    fs.append((montar(t + 3, notas=False), 300))
    return fs
