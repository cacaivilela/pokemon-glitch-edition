"""PICHU JOHTO (30148): PULO DE ALEGRIA. Ele se abaixa, toma impulso e pula
bem alto — tão rápido que o boné, grande demais, fica pra trás no ar! Lá em
cima o boné continua subindo sozinho, o PICHU começa a cair e o boné vem
atrás, caindo direitinho na cabeça dele (meio torto, depois ajeita). Uns
coraçõezinhos: ele nem ligou."""
from efeitos_braglitch import (partes_pichu, agachar, CABECA_PICHU, CABECA_PICHU_CORES, CORACAO,
                               SINAL_CORES, POEIRA, POEIRA_CORES)

CHAVE = "30148"
MARGEM = (12, 30, 12, 4)


def quadros(b):
    p = partes_pichu(b)
    corpo, bone, rabo = p["corpo"], p["bone"], p["rabo"]
    fs = []

    def montar(sobe=0, bone_sobe=None, abaixa=0, torto=False, poeira=None, coracao=None):
        q = b.quadro()
        bs = sobe if bone_sobe is None else bone_sobe
        if abaixa:
            b.por(q, rabo)
            b.grade(q, CABECA_PICHU, 26, 16 + abaixa, CABECA_PICHU_CORES)
            agachar(b, q, corpo, 38, abaixa)
        else:
            b.por(q, rabo, dy=-sobe)
            b.grade(q, CABECA_PICHU, 26, 16 - sobe, CABECA_PICHU_CORES)
            b.por(q, corpo, dy=-sobe)
        b.por(q, bone, dx=1 if torto else 0, dy=abaixa - bs, vira=torto)
        if poeira is not None:
            b.grade(q, POEIRA[poeira], 24, 44, POEIRA_CORES)
            b.grade(q, POEIRA[poeira], 38, 44, POEIRA_CORES)
        if coracao is not None:
            for k, (x, y) in enumerate(((14, 18), (46, 14), (44, 30))):
                t = coracao - k
                if t >= 0:
                    b.grade(q, CORACAO[min(t, 1)], x, y - t * 2, SINAL_CORES)
        return q

    fs.append((montar(), 120))
    # 1) se abaixa pra tomar impulso
    fs.append((montar(abaixa=2), 90))
    fs.append((montar(abaixa=4), 120))
    # 2) PULA — o boné fica pra trás
    for sobe, bsobe in ((6, 1), (12, 5), (16, 11), (18, 16)):
        fs.append((montar(sobe=sobe, bone_sobe=bsobe, poeira=0 if sobe == 6 else None), 70))
    # 3) lá em cima o boné passa dele e continua subindo
    for sobe, bsobe in ((18, 20), (17, 23), (14, 24), (10, 23)):
        fs.append((montar(sobe=sobe, bone_sobe=bsobe), 80))
    # 4) cai, e o boné vem atrás e encaixa
    for sobe, bsobe in ((5, 19), (0, 13), (0, 6), (0, 1)):
        fs.append((montar(sobe=sobe, bone_sobe=bsobe, poeira=1 if sobe == 0 and bsobe == 13 else None), 70))
    fs.append((montar(abaixa=2, torto=True, poeira=2), 100))
    fs.append((montar(torto=True), 150))
    # 5) ajeita o boné e solta os coraçõezinhos
    for k in range(4):
        fs.append((montar(coracao=k, sobe=[0, 1, 0, 1][k]), 110))
    fs.append((montar(coracao=4), 300))
    return fs
