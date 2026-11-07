"""TRONCUDO (1033): A CASCA RACHA. Ele faz força de braços pra cima, tremendo
todo... e a casca grossa não aguenta: novas rachaduras vão se abrindo no
tronco, uma de cada lado, e a seiva VERMELHA escorre por elas até o chão,
onde forma uma poça que mancha tudo. Ele relaxa os braços, satisfeito, e as
flores amarelas da copa piscam."""
from efeitos_braglitch import POCA, POEIRA, POEIRA_CORES, ESTRELA, SINAL_CORES

CHAVE = "1033"
MARGEM = (10, 14, 10, 6)
TINTA = {"a": "#181420", "b": "#c4282c", "B": "#8a1418", "w": "#f46046", "h": "#c4282c"}
RACHA = ["a..", "ha.", ".ha", "..h", ".ha", "ah.", "ha.", "h..", "ha.", ".h."]


def quadros(b):
    copa = b.parte(lambda x, y, c: y <= 27 and 4 <= x <= 60)
    braco_e = b.parte(lambda x, y, c: x <= 20 and 24 <= y <= 42 and not (y <= 27 and x >= 4))
    braco_d = b.parte(lambda x, y, c: x >= 44 and 24 <= y <= 42 and not (y <= 27 and x <= 60))
    corpo = b.menos(b.sprite, copa, braco_e, braco_d)
    fs = []

    def montar(t, forca=0, treme=0, racha=0, escorre=0, poca=False, flores=None):
        q = b.quadro()
        # o braço parado fica por baixo: quando ele levanta, o ombro "estica"
        b.por(q, braco_e, dx=treme)
        b.por(q, braco_d, dx=treme)
        b.por(q, braco_e, dx=treme - (1 if forca > 1 else 0), dy=-forca)
        b.por(q, braco_d, dx=treme + (1 if forca > 1 else 0), dy=-forca)
        b.por(q, corpo, dx=treme)
        b.por(q, copa, dx=treme)
        b.por(q, copa, dx=treme, dy=-(forca // 2))
        if racha:
            g = RACHA[:racha]
            b.grade(q, g, 20 + treme, 44, TINTA)
            b.grade(q, g, 41 + treme, 42, TINTA, espelha=True)
        if escorre:
            # a seiva desce das rachaduras até o chão (y 60)
            for x, y0 in ((21, 54), (42, 52), (32, 54)):
                n = min(escorre, 6)
                if n > 0:
                    b.grade(q, ["h"] * n, x + treme, y0, TINTA)
                if escorre > 6:
                    from efeitos_braglitch import GOTA
                    b.grade(q, GOTA[0], x - 1 + treme, y0 + escorre, TINTA)
        if poca:
            b.grade(q, [linha[4:28] for linha in POCA], 20, 59, TINTA)
        if flores is not None:
            for k, (x, y) in enumerate(((17, 2), (41, 2), (8, 11), (52, 12), (30, -1))):
                if (flores + k) % 3 == 0:
                    b.grade(q, ESTRELA[0], x, y, SINAL_CORES)
        return q

    fs.append((montar(0), 150))
    # 1) força! braços pra cima, tremendo
    for k, f in enumerate((1, 2, 3, 3, 3, 3)):
        fs.append((montar(k, forca=f, treme=[0, 0, -1, 1, -1, 1][k]), 90))
    # 2) as rachaduras se abrem, linha por linha
    for k, r in enumerate((2, 4, 6, 8, 10)):
        fs.append((montar(k, forca=3, treme=[-1, 1][k % 2], racha=r), 80))
    # 3) a seiva escorre até o chão e faz a poça
    for k, e in enumerate((2, 4, 6, 8, 10)):
        fs.append((montar(k, forca=2, racha=10, escorre=e), 90))
    for k in range(3):
        fs.append((montar(k, forca=1, racha=10, escorre=6, poca=True), 110))
    # 4) relaxa; as flores da copa piscam
    for k in range(4):
        fs.append((montar(k, racha=10, escorre=6, poca=True, flores=k), 120))
    fs.append((montar(0, racha=10, escorre=6, poca=True), 300))
    return fs
