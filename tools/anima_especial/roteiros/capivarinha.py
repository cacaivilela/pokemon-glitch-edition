"""CAPIVIRA (1039): SENTA E ESPERA. A capivarinha está sentada na beira do
rio com a frutinha na cabeça, calma, piscando devagar. Um passarinho vem
voando lá de longe, batendo as asas, dá uma volta e pousa nas costas dela.
Ela nem se mexe — só fecha os olhos, contente (um coração), e a frutinha dá
um pulinho na cabeça. Todo bicho que passa acaba sentando do lado."""
from efeitos_braglitch import PASSARINHO, PASSARINHO_CORES, CORACAO, SINAL_CORES

CHAVE = "1039"
MARGEM = (10, 20, 30, 4)
OLHO = ["aaaa", "jjjj"]
OLHO_CORES = {"a": "#aa6640", "j": "#1e1a22"}


def quadros(b):
    fruta = b.parte(lambda x, y, c: y <= 31 and 17 <= x <= 25 and c[:3] in ((0xfa, 0xce, 0x32), (0xc8, 0x64, 0x1e), (0x18, 0x14, 0x20)))
    corpo = b.menos(b.sprite, fruta)
    fs = []

    def montar(pisca=False, fruta_sobe=0, passaro=None, asa=0, vira=False, coracao=None, respira=0):
        q = b.quadro()
        b.por(q, corpo)
        b.por(q, fruta, dy=-fruta_sobe - respira)
        if pisca:
            b.grade(q, OLHO, 19, 38, OLHO_CORES)
        if passaro is not None:
            b.grade(q, PASSARINHO[asa], passaro[0], passaro[1], PASSARINHO_CORES, espelha=vira)
        if coracao is not None:
            b.grade(q, CORACAO[min(coracao, 1)], 8, 26 - coracao * 3, SINAL_CORES)
        return q

    fs.append((montar(), 150))
    # 1) calma, piscando devagar
    fs.append((montar(pisca=True), 220))
    fs.append((montar(), 200))
    # 2) o passarinho vem voando da direita, desce e pousa nas costas
    caminho = [(84, 4), (76, 10), (68, 6), (60, 12), (54, 10), (48, 18), (44, 22), (42, 26), (41, 28)]
    for k, (x, y) in enumerate(caminho):
        fs.append((montar(passaro=(x, y), asa=k % 2 if k < len(caminho) - 1 else 1), 80))
    fs.append((montar(passaro=(41, 28), asa=1), 150))
    # 3) ela fecha os olhos contente; a frutinha pula; o passarinho se ajeita
    for k in range(8):
        fs.append((montar(pisca=k >= 1, passaro=(41, 28 - (k % 2 if k > 3 else 0)), asa=1 if k != 5 else 0,
                          coracao=k - 2 if k >= 2 else None, fruta_sobe=[0, 0, 2, 3, 1, 0, 0, 0][k]), 110))
    fs.append((montar(pisca=True, passaro=(41, 28), asa=1), 300))
    return fs
