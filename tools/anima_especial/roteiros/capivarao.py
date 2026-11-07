"""CAPIBARÃO (1040): A MAIS CALMA DO MUNDO. Ele cochila, respirando fundo,
com os "z" subindo. O bem-te-vi das costas acorda, sai pulando pelas costas
dele até a cabeça e dá três bicadas — toc, toc, toc! O capibarão abre o olho
devagar... olha... e fecha de novo, sem ligar nem um pouco. O passarinho
desiste, se ajeita na cabeça dele e dorme também."""
from efeitos_braglitch import agachar, ZZZ, SINAL_CORES, IMPACTO, IMPACTO_CORES

CHAVE = "1040"
MARGEM = (8, 20, 8, 4)
OLHO = ["aaaaa", "jjjjj", "aaaaa"]
OLHO_CORES = {"a": "#9c5e3c", "j": "#1e1a22"}


def quadros(b):
    passaro = b.parte(lambda x, y, c: x >= 39 and y <= 29)
    corpo = b.menos(b.sprite, passaro)
    fs = []

    def montar(t, dorme=True, respira=0, p=(0, 0), z=None, z2=None, toc=False, vira=False):
        q = b.quadro()
        agachar(b, q, corpo, 40, respira)
        if dorme:
            b.grade(q, OLHO, 16, 24 + respira, OLHO_CORES)
        b.por(q, passaro, dx=p[0], dy=p[1] + (respira if p == (0, 0) else 0), vira=vira)
        for zz, (x0, y0) in ((z, (6, 16)), (z2, (14 + p[0] + 30, 6 + p[1]))):
            if zz is not None:
                s = zz % 6
                b.grade(q, ZZZ[min(s // 2, 2)], x0 - s, y0 - s * 3, SINAL_CORES)
        if toc:
            b.grade(q, IMPACTO[t % 2], 18, 8, IMPACTO_CORES)
        return q

    t = 0
    # 1) cochilando, respirando fundo
    for k in range(6):
        t += 1
        fs.append((montar(t, respira=[0, 1, 1, 0, 0, 1][k], z=k), 120))
    # 2) o passarinho pula pelas costas até a cabeça
    pulos = [(-2, -3), (-5, -1), (-8, -5), (-11, -6), (-14, -11), (-17, -13), (-18, -14)]
    for k, p in enumerate(pulos):
        t += 1
        fs.append((montar(t, p=p, z=6 + k), 80))
    # 3) toc, toc, toc
    for k in range(3):
        t += 1
        fs.append((montar(t, p=(-19, -12), toc=True, z=None), 80))
        t += 1
        fs.append((montar(t, p=(-18, -14)), 90))
    # 4) abre o olho devagar... olha... fecha
    t += 1
    fs.append((montar(t, dorme=False, p=(-18, -14)), 400))
    t += 1
    fs.append((montar(t, p=(-18, -14)), 150))
    # 5) o passarinho desiste e dorme também
    for k in range(6):
        t += 1
        fs.append((montar(t, p=(-18, -14), vira=k >= 1, respira=[0, 1, 1, 0, 0, 1][k], z=k, z2=k + 3), 120))
    fs.append((montar(t + 1, p=(-18, -14), vira=True), 300))
    return fs
