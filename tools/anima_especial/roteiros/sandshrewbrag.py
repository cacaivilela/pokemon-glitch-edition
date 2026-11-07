"""SANDSHREW-BRAG (21001): o TATU-BOLA da praia. Fareja o chão, leva um
susto (os meninos!), se encolhe e FECHA A CASCA: vira uma bola perfeita que
rola pro lado. Toma um CHUTE, voa quicando, rola de volta, para tontinha e
abre de novo, sacudindo a areia."""
from efeitos import FAREJA, LINHA_CORES
from efeitos_brag import gira, POEIRA, POEIRA_CORES, EXCLAMA, EXCLAMA_CORES, IMPACTO, IMPACTO_CORES, ESTRELA, TONTO_CORES

CHAVE = "21001"
MARGEM = (14, 22, 18, 4)

BOLA_CORES = {"a": "#181420", "c": "#8e603e", "g": "#533028", "h": "#b08058", "d": "#6b3d31", "j": "#c6beb7"}
BOLA = [   # o tatu fechado: as cintas da casca e a barriguinha aparecendo
    "......aaaaaa......",
    "....aahhgccgaa....",
    "...ahhcgcccgcca...",
    "..ahhccgcccgccda..",
    ".ahcccgccccgcccda.",
    ".ahccgcccccgccdda.",
    "ahccgccccccgcccdda",
    "acccgccccccgccjdda",
    "acccgccccccgcjjjda",
    "acccgccccccgcjjjda",
    "acccgccccccgccjdda",
    "adccgccccccgcccdda",
    ".adcgccccccgccdda.",
    ".addgcccccgcccdda.",
    "..addgccccgccdda..",
    "...addgcccgcdda...",
    "....aaddgdgdaa....",
    "......aaaaaa......",
]


def quadros(b):
    corpo = b.sprite
    fs = []
    # a bola desenhada numa imagem do tamanho do sprite, pra poder girar
    bola = b.quadro().crop((0, 0, 64, 64))
    from base import rgba
    px = bola.load()
    for j, linha in enumerate(BOLA):
        for i, ch in enumerate(linha):
            if ch != ".":
                px[24 + i, 35 + j] = rgba(BOLA_CORES[ch])

    def q_corpo(dy=0, dx=0, extra=None):
        q = b.quadro()
        b.por(q, corpo, dx=dx, dy=dy)
        if extra:
            extra(q)
        return q

    def q_bola(dx=0, dy=0, volta=0, extra=None):
        q = b.quadro()
        gira(b, q, bola, volta, dx=dx, dy=dy)
        if extra:
            extra(q)
        return q

    # 1) fareja a areia (o focinho fica perto de x 22, y 30)
    for k in range(4):
        fs.append((q_corpo(dy=k % 2, extra=lambda q, k=k: b.grade(q, FAREJA, 14 - k % 2, 28, LINHA_CORES) if k % 2 else None), 110))
    # 2) susto! pula um tiquinho com o "!"
    fs.append((q_corpo(dy=-3, extra=lambda q: b.grade(q, EXCLAMA, 22, 6, EXCLAMA_CORES)), 140))
    fs.append((q_corpo(dy=1, extra=lambda q: b.grade(q, EXCLAMA, 22, 7, EXCLAMA_CORES)), 90))
    # 3) se encolhe (a parte de cima afunda) e FECHA: vira bola num puf de poeira
    cima = b.retangulo(0, 0, 63, 40)
    baixo = b.menos(corpo, cima)
    q = b.quadro()
    b.por(q, baixo)
    b.por(q, cima, dy=4)
    fs.append((q, 90))
    fs.append((q_bola(extra=lambda q: (b.grade(q, POEIRA[1], 14, 47, POEIRA_CORES), b.grade(q, POEIRA[1], 42, 47, POEIRA_CORES, espelha=True))), 90))
    fs.append((q_bola(extra=lambda q: (b.grade(q, POEIRA[2], 10, 46, POEIRA_CORES), b.grade(q, POEIRA[2], 44, 46, POEIRA_CORES, espelha=True))), 90))
    # 4) rola pra direita (cada quarto de volta anda 3)
    for k in range(4):
        fs.append((q_bola(dx=3 * (k + 1), volta=k + 1, extra=lambda q, k=k: b.grade(q, POEIRA[min(k, 3)], 26 + 3 * k - 8, 48, POEIRA_CORES) if k < 3 else None), 70))
    # 5) o CHUTE: o "pow" do lado e ela sai voando pra esquerda, quicando
    fs.append((q_bola(dx=12, volta=1, extra=lambda q: b.grade(q, IMPACTO[1], 46, 40, IMPACTO_CORES)), 80))
    voo = [(8, -8), (3, -13), (-2, -15), (-7, -13), (-11, -7), (-14, 0)]
    for k, (x, y) in enumerate(voo):
        fs.append((q_bola(dx=x, dy=y, volta=-k, extra=lambda q, k=k: b.grade(q, IMPACTO[2], 46, 40, IMPACTO_CORES) if k == 0 else None), 60))
    fs.append((q_bola(dx=-14, dy=1, volta=2, extra=lambda q: b.grade(q, POEIRA[2], 0, 47, POEIRA_CORES)), 70))
    fs.append((q_bola(dx=-12, dy=-3, volta=1, extra=lambda q: b.grade(q, POEIRA[3], 0, 47, POEIRA_CORES)), 70))
    # 6) rola de volta pro lugar e para balançando
    for k, x in enumerate((-9, -6, -3, 0)):
        fs.append((q_bola(dx=x, volta=k + 2), 80))
    fs.append((q_bola(dx=1), 110))
    fs.append((q_bola(dx=-1), 110))
    # 7) abre, tontinha (estrelas) e sacode a areia
    fs.append((q_corpo(extra=lambda q: (b.grade(q, POEIRA[1], 14, 48, POEIRA_CORES), b.grade(q, ESTRELA, 20, 12, TONTO_CORES), b.grade(q, ESTRELA, 38, 10, TONTO_CORES))), 120))
    fs.append((q_corpo(extra=lambda q: (b.grade(q, ESTRELA, 29, 8, TONTO_CORES), b.grade(q, ESTRELA, 16, 16, TONTO_CORES))), 120))
    fs.append((q_corpo(dx=-1, extra=lambda q: b.grade(q, POEIRA[3], 12, 46, POEIRA_CORES)), 70))
    fs.append((q_corpo(dx=1, extra=lambda q: b.grade(q, POEIRA[3], 42, 46, POEIRA_CORES)), 70))
    fs.append((q_corpo(), 300))
    return fs
