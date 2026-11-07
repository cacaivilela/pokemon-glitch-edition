"""AIPOM-BRAG (21005): o MICO-LEÃO-DOURADO lanterna. Pendurado pela mão do
rabo, tudo brilhando... e vem o APAGÃO: a juba e as mãos apagam. No escuro
ele balança no rabo pra lá e pra cá, pisca, pisca... e ACENDE de uma vez,
mais forte que antes, soltando faísca de luz pra mata toda ver."""
from efeitos import BRILHO, FAISCA_CORES
from efeitos_brag import raios

CHAVE = "21005"
MARGEM = (16, 20, 16, 4)

APAGA = {(0x5d, 0xd6, 0xb5): "#2e5a58", (0xf2, 0xff, 0xfe): "#5a6e70", (0xce, 0xff, 0xfa): "#4a6466",
         (0x6c, 0xfd, 0xe1): "#36605c", (0x3f, 0xa1, 0x7e): "#24443e"}
ACENDE = {(0x5d, 0xd6, 0xb5): "#a8fff0", (0xce, 0xff, 0xfa): "#ffffff", (0x6c, 0xfd, 0xe1): "#c8fff4",
          (0x3f, 0xa1, 0x7e): "#5dd6b5"}


def quadros(b):
    from efeitos_brag import troca
    escuro = troca(b.sprite, APAGA)
    claro = troca(b.sprite, ACENDE)
    fs = []

    def montar(img, d=0, faiscas=None, raio=None):
        """d: o balanço — a mão do rabo fica presa lá em cima, o rabo vai
        metade e o corpo vai tudo"""
        q = b.quadro()
        partes = {"mao": (0, 20), "rabo": (21, 33), "corpo": (34, 63)}
        for nome, (a, z) in partes.items():
            pedaco = img.crop((0, 0, 64, 64))
            px = pedaco.load()
            for y in range(64):
                if not (a <= y <= z):
                    for x in range(64):
                        px[x, y] = (0, 0, 0, 0)
            desloca = {"mao": 0, "rabo": d // 2, "corpo": d}[nome]
            b.por(q, pedaco, dx=desloca)
        if raio is not None:   # os raios de luz em volta da mão acesa (meio em x 27, y 13)
            raios(b, q, 27, 12, 11 + raio * 4)
            raios(b, q, 33 + d, 43, 13 + raio * 4)
        if faiscas:
            for (x, y, t) in faiscas:
                b.grade(q, BRILHO[t % 3], x, y, FAISCA_CORES)
        return q

    # 1) aceso, pendurado
    fs.append((montar(b.sprite), 140))
    fs.append((montar(b.sprite, d=1), 120))
    # 2) o APAGÃO: pisca e apaga
    fs.append((montar(escuro), 80))
    fs.append((montar(b.sprite), 60))
    fs.append((montar(escuro), 160))
    # 3) no escuro, balança no rabo
    for d in (-2, -5, -7, -5, -2, 0, 2, 5, 7, 5, 2, 0):
        fs.append((montar(escuro, d=d), 70))
    # 4) pisca, pisca... ACENDE forte
    fs.append((montar(b.sprite), 60))
    fs.append((montar(escuro), 90))
    fs.append((montar(b.sprite), 60))
    fs.append((montar(escuro), 60))
    luzes = [(14, 2), (30, 0), (12, 22), (44, 20), (14, 34), (48, 36), (8, 46), (50, 50)]
    for k in range(6):
        fs.append((montar(claro if k % 2 == 0 else b.sprite, d=[0, -1, 0, 1, 0, 0][k],
                          faiscas=[(x - 2, y - 2, (k + j) % 3) for j, (x, y) in enumerate(luzes) if (j + k) % 2 == 0],
                          raio=[0, 1, 1, 0, 1, None][k]), 90))
    fs.append((montar(b.sprite, faiscas=[(14, 0, 2), (46, 34, 2)]), 120))
    fs.append((montar(b.sprite), 300))
    return fs
