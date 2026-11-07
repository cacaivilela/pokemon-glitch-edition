"""O que as fantasias de Carnaval (tools/carnaval_desenhos/) têm em comum.

Cada fantasia sai do 1º quadro da animação do bicho (quadro.tela, em
tools/vinculo_desenhos/), editado pixel por pixel: grades escritas à mão (uma
letra por cor, `.` deixa como está) e trocas de cor tom por tom.
"""
import os
import sys

AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(os.path.dirname(AQUI), "vinculo_desenhos"))
sys.path.insert(0, os.path.dirname(AQUI))
import quadro  # noqa: E402,F401

from PIL import Image  # noqa: E402

RAIZ = os.path.dirname(os.path.dirname(AQUI))
PASTA = os.path.join(RAIZ, "assets", "sprites", "pokemon", "carnaval")

# as cores de Carnaval (as mesmas do pixelart.html?cores=carnaval)
CARNAVAL = {
    "K": (16, 16, 16), "W": (254, 254, 254),
    "G": (255, 228, 106), "g": (248, 184, 0), "h": (200, 120, 0),       # ouro
    "P": (255, 106, 213), "p": (208, 32, 122), "q": (122, 16, 80),      # rosa
    "C": (106, 232, 255), "c": (32, 144, 224), "d": (28, 72, 144),      # azul
    "V": (125, 255, 122), "v": (32, 176, 64), "w": (16, 96, 32),        # verde
    "O": (255, 138, 58), "o": (224, 64, 42), "r": (138, 24, 16),        # laranja / vermelho
    "R": (200, 144, 255), "u": (128, 64, 208), "U": (64, 24, 128),      # roxo
}


def grade(t, x0, y0, linhas, pal=CARNAVAL, so_vazio=False):
    """pinta a grade com o canto de cima em (x0, y0). `so_vazio`: só onde não
    tem bicho (a peça fica ATRÁS dele)."""
    px = t.img.load()
    for dy, linha in enumerate(linhas):
        for dx, ch in enumerate(linha):
            x, y = x0 + dx, y0 + dy
            if ch == "." or not (0 <= x < t.lado and 0 <= y < t.lado):
                continue
            if so_vazio and px[x, y][3]:
                continue
            px[x, y] = (0, 0, 0, 0) if ch == "_" else tuple(pal[ch][:3]) + (255,)


def trocar(t, mapa, caixa=None):
    """troca cor exata por cor (rgb -> rgb), dentro da caixa se vier"""
    quadro.trocar(t, mapa, caixa)


def salvar(t, nome):
    os.makedirs(PASTA, exist_ok=True)
    caminho = os.path.join(PASTA, nome + ".png")
    t.img.save(caminho)
    # a prévia grande, pra olhar (dev/captures/<nome>_carnaval_grande.png)
    bg = Image.new("RGBA", t.img.size, (120, 150, 140, 255))
    bg.alpha_composite(t.img)
    bg.resize((t.lado * 5, t.lado * 5), Image.NEAREST).save(
        os.path.join(RAIZ, "dev", "captures", f"{nome}_carnaval_grande.png"))
    print(caminho, t.img.size)


def tela(dex, cima=0, minimo=96):
    """o 1º quadro, sem o vazio em volta (o BLACEPHALON vem num quadro enorme,
    o espaço da explosão), numa tela quadrada com o pé no chão. `cima`: px de
    folga a mais em cima, pra peça que sobe da cabeça."""
    q = quadro.primeiro(dex)
    q = q.crop(q.getbbox())
    lado = max(minimo, q.width + 4, q.height + 4 + cima)
    t = quadro.Tela(lado)
    t.img.alpha_composite(q, ((lado - q.width) // 2, lado - q.height - 2))
    return t


# A PLUMA do leque (a mesma da PHEROMOSA): K contorno, A clara, a escura, W o
# brilho, S a haste dourada. As linhas do meio esticam até a base.
PLUMA = [
    "..KKK..",
    ".KAWAK.",
    "KAWAAaK",
    "KAWASaK",
    "KAASAaK",
    "KAASAaK",
    "KaASAaK",
    "KaASaaK",
    ".KaSaK.",
    ".KaSaK.",
    "..KSK..",
    "..KSK..",
    "..KSK..",
]


def pluma(t, bx, topo, base_y, cores, inclina):
    """uma pluma do leque, só onde está vazio (fica ATRÁS do bicho): a ponta
    em `topo`, a base em `base_y`, e quanto mais alto, mais pro lado"""
    mais = max(0, base_y - topo - len(PLUMA))
    linhas = PLUMA[:6] + [PLUMA[6]] * mais + PLUMA[6:]
    pal = {"K": CARNAVAL["K"], "A": CARNAVAL[cores[0]], "a": CARNAVAL[cores[1]],
           "W": CARNAVAL["W"], "S": CARNAVAL["g"]}
    px = t.img.load()
    fundo = len(linhas)
    for dy, linha in enumerate(linhas):
        desvio = round(inclina * (fundo - dy))
        for dx, ch in enumerate(linha):
            x, y = bx - 3 + dx + desvio, topo + dy
            if ch == "." or not (0 <= x < t.lado and 0 <= y < t.lado) or px[x, y][3]:
                continue
            px[x, y] = pal[ch] + (255,)
