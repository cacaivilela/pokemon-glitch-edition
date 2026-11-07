"""RAI KANTO (20094): o boné de Kanto ficou APERTADO, e boné apertado junta
eletricidade! O rabo balança, as faíscas começam a estalar presas em volta do
boné, ele treme todo (com uma gota de suor), acende inteiro de amarelo e
DESCARREGA: levanta o rabo e solta um raio pro céu pela ponta. Depois ajeita
a postura, e o boné continua lá, brilhando."""
from efeitos import BRILHO, FAISCA_CORES
from efeitos_braglitch import (partes_rai, ondula, so_contorno, RAIO_CEU, RAIO_PONTA, RAIO_CORES,
                               ESTALO, SUOR, SUOR_CORES, ESTRELA, SINAL_CORES)

CHAVE = "20094"
MARGEM = (12, 26, 12, 4)


def quadros(b):
    p = partes_rai(b)
    corpo, pes, bone, orelha, rabo = p["corpo"], p["pes"], p["bone"], p["orelha"], p["rabo"]
    fs = []

    def montar(balanco=0, treme=0, sobe=0, clarao=False, faiscas=None, raio=0, suor=None, brilho=None, rabo_sobe=0):
        q = b.quadro()
        # o rabo dobra em faixas (a ponta mexe mais que a base)
        r = so_contorno(rabo) if clarao else rabo
        ondula(b, q, r, [(0, 13, balanco * 2), (14, 25, balanco), (26, 40, 0)], dy=-rabo_sobe)
        for img in (pes,):
            b.por(q, img)
        for img in (corpo, orelha, bone):
            b.por(q, so_contorno(img) if clarao and img is not bone else img, dx=treme, dy=-sobe)
        if faiscas is not None:
            for k, (x, y) in enumerate(((16, 8), (34, 6), (38, 16), (22, 4))):
                b.grade(q, BRILHO[(faiscas + k) % 3], x + treme, y - sobe, FAISCA_CORES)
        if suor is not None:
            b.grade(q, SUOR, 39 + suor, 14 + suor * 2, SUOR_CORES)
        if raio:
            # o raio sobe da ponta do rabo (x 11, y 4) até o alto da folha
            topo = 4 - rabo_sobe
            b.grade(q, RAIO_PONTA, 10, topo - 4, RAIO_CORES)
            for k in range(raio):
                b.grade(q, RAIO_CEU, 10 - (k % 2), topo - 4 - 10 * (k + 1), RAIO_CORES)
            b.grade(q, ESTALO[raio % 2], 9 - raio % 2, topo - 2 - raio % 2, {"y": "#ffe85a", "w": "#fefefe"})
        if brilho is not None:
            b.grade(q, ESTRELA[brilho], 30, 6, SINAL_CORES)
        return q

    # 1) parado, o rabo balançando
    for k in range(4):
        fs.append((montar(balanco=[0, 1, 0, -1][k]), 120))
    # 2) as faíscas estalam presas em volta do boné apertado
    for k in range(4):
        fs.append((montar(balanco=[0, 1, 0, -1][k], faiscas=k), 100))
    # 3) treme todo, com suor
    for k in range(5):
        fs.append((montar(treme=[-1, 1, -1, 1, 0][k], faiscas=k, suor=k // 2), 70))
    # 4) acende e DESCARREGA pelo rabo, pro céu
    fs.append((montar(clarao=True, sobe=1, rabo_sobe=1), 80))
    for k in range(1, 4):
        fs.append((montar(clarao=k % 2 == 1, sobe=1, rabo_sobe=2, raio=k), 70))
    for k in range(3):
        fs.append((montar(clarao=k % 2 == 0, rabo_sobe=2, raio=3), 70))
    fs.append((montar(rabo_sobe=1), 100))
    # 5) pronto: o boné continua lá, e ainda brilha
    fs.append((montar(brilho=0), 120))
    fs.append((montar(brilho=1, balanco=1), 120))
    fs.append((montar(), 300))
    return fs
