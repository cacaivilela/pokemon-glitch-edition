"""RAI HOENN (20095): CAMBALHOTA. Ele se abaixa, pula bem alto, dá uma
cambalhota no ar (fica de cabeça pra baixo lá em cima, com o boné de Hoenn
firme no lugar — apertado serve pra isso!), cai de pé levantando poeira e faz
pose, com uma estrela brilhando no boné."""
from efeitos_braglitch import (partes_rai, agachar, POEIRA, POEIRA_CORES, ESTRELA, SINAL_CORES)
from efeitos import VENTO, LINHA_CORES

CHAVE = "20095"
MARGEM = (14, 40, 14, 4)


def quadros(b):
    tudo = b.sprite
    fs = []

    def montar(sobe=0, abaixa=0, ponta=False, poeira=None, estrela=None, vento=False):
        q = b.quadro()
        if abaixa:
            agachar(b, q, tudo, 46, abaixa)
        else:
            b.por(q, tudo, dy=-sobe, vira=ponta, de_ponta=ponta)
        if vento:
            b.grade(q, VENTO, -8, 30 - sobe, LINHA_CORES)
            b.grade(q, VENTO, 58, 20 - sobe, LINHA_CORES)
        if poeira is not None:
            for x in (14, 44):
                b.grade(q, POEIRA[poeira], x, 58, POEIRA_CORES)
        if estrela is not None:
            b.grade(q, ESTRELA[estrela], 26, 3, SINAL_CORES)
        return q

    fs.append((montar(), 120))
    fs.append((montar(abaixa=2), 90))
    fs.append((montar(abaixa=4), 130))
    # 1) o pulo
    fs.append((montar(sobe=8, poeira=0), 70))
    fs.append((montar(sobe=18, vento=True), 70))
    fs.append((montar(sobe=26, vento=True), 70))
    # 2) a cambalhota lá em cima: de cabeça pra baixo
    fs.append((montar(sobe=30, ponta=True, vento=True), 90))
    fs.append((montar(sobe=32, ponta=True), 110))
    fs.append((montar(sobe=30, ponta=True, vento=True), 90))
    # 3) desvira e cai
    fs.append((montar(sobe=24), 70))
    fs.append((montar(sobe=14, vento=True), 70))
    fs.append((montar(sobe=4), 60))
    fs.append((montar(abaixa=4, poeira=1), 90))
    fs.append((montar(abaixa=2, poeira=2), 100))
    # 4) pose, com a estrela no boné
    fs.append((montar(estrela=0), 110))
    fs.append((montar(estrela=1), 130))
    fs.append((montar(estrela=0), 110))
    fs.append((montar(), 300))
    return fs
