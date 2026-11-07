"""PICHU SINNOH (30096): o ESPIRRO. Ele começa a fungar (o nariz coça, ele
se estica pra trás: ah... ah...) e — ATCHIM! — o espirro é tão forte que se
abaixa todo e o boné, grande demais, sai voando, girando lá pro alto. Fica
olhando pra cima, o boné desce rodando e cai de volta na cabeça dele. Ele
nem liga e sorri."""
from efeitos_braglitch import (partes_pichu, agachar, CABECA_PICHU, CABECA_PICHU_CORES, GOTA, AGUA_CORES,
                               EXCLAMA, SINAL_CORES)
from efeitos import FAREJA, LINHA_CORES

CHAVE = "30096"
MARGEM = (16, 40, 12, 4)


def quadros(b):
    p = partes_pichu(b)
    corpo, bone, rabo = p["corpo"], p["bone"], p["rabo"]
    fs = []

    def montar(estica=0, abaixa=0, bone_sobe=0, bone_dx=0, gira=False, fareja=False, gotas=None, susto=False):
        q = b.quadro()
        if abaixa:
            b.por(q, rabo)
            b.grade(q, CABECA_PICHU, 26, 16 + abaixa, CABECA_PICHU_CORES)
            agachar(b, q, corpo, 38, abaixa)
        else:
            b.por(q, rabo)
            b.grade(q, CABECA_PICHU, 26 + estica, 16 - estica, CABECA_PICHU_CORES)
            agachar(b, q, corpo, 38, -estica, dx=0)
        topo = abaixa - estica
        b.por(q, bone, dx=bone_dx + (estica if not bone_sobe else 0), dy=topo - bone_sobe, vira=gira)
        if fareja:
            b.grade(q, FAREJA, 22, 30 - estica, LINHA_CORES)
        if gotas is not None:
            for k, (x, y) in enumerate(((22, 34), (18, 31), (20, 38))):
                b.grade(q, GOTA[0], x - gotas * 3, y + abaixa + gotas, AGUA_CORES)
        if susto:
            b.grade(q, EXCLAMA, 46, 14, SINAL_CORES)
        return q

    fs.append((montar(), 120))
    # 1) ah... ah... (estica pra trás fungando)
    for e in (1, 2, 1, 2, 3):
        fs.append((montar(estica=e, fareja=e % 2 == 1), 120))
    fs.append((montar(estica=3), 180))
    # 2) ATCHIM! se abaixa e o boné sai voando, girando
    fs.append((montar(abaixa=3, bone_sobe=4, gotas=0), 70))
    for k, s in enumerate((10, 16, 21, 24, 25)):
        fs.append((montar(abaixa=2 if k < 2 else 0, bone_sobe=s, bone_dx=[0, 1, 2, 2, 1][k], gira=k % 2 == 1, gotas=k + 1 if k < 3 else None), 70))
    fs.append((montar(bone_sobe=25, susto=True), 200))
    # 3) desce rodando e encaixa na cabeça
    for k, s in enumerate((23, 19, 13, 6, 0)):
        fs.append((montar(bone_sobe=s, bone_dx=[1, 0, -1, 0, 0][k], gira=k % 2 == 0 and s > 0), 70))
    fs.append((montar(abaixa=1), 100))
    fs.append((montar(estica=1), 120))
    fs.append((montar(), 300))
    return fs
