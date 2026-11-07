#!/usr/bin/env python3
"""AS FORMAS DA MONSTELA: ela entra em aparelhos, como o ROTOM.

O CAIO escolheu os aparelhos: CELULAR, COMPUTADOR e NINTENDO SWITCH. Ele pediu
que fossem desenhadas do zero, "sem ser em cima da MONSTELA". Então cada forma
é o aparelho inteiro virado bicho, desenhado pixel por pixel em linhas de
letras. Da MONSTELA ficam só as marcas dela:
- o ROSTO de pontinhos azuis na tela (os dois olhos de 4 pontos e o sorriso);
- as MÃOS AMARELAS de garra;
- as duas ANTENINHAS tortas da TV;
- os BOTÕES COLORIDOS (verde, azul, amarelo, vermelho);
- o preto arroxeado com luz em cima/esquerda e sombra embaixo/direita.

O lado direito de antena, braço e Joy-Con é o esquerdo espelhado (com a luz e
a sombra trocadas, pra luz continuar vindo da esquerda).

O SHINY segue a regra que ele deu pra MONSTELA: rosto branco, e tudo que era
preto fica azul-claro. Na SWITCH os Joy-Cons trocam de lado as cores.

    python3 tools/monstela/formas.py      # grava em assets/sprites/pokemon/formas_monstela/
"""
import os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DESTINO = os.path.join(ROOT, "assets", "sprites", "pokemon", "formas_monstela")
LADO = 96

# as cores da MONSTELA (tools/monstela/sprite.py) + Joy-Cons e botões
NORMAL = {
    "k": (8, 8, 8), "c": (34, 32, 44), "l": (60, 57, 76), "s": (21, 20, 28),
    "t": (10, 22, 40), "n": (15, 31, 54), "r": (44, 74, 116),
    "f": (86, 139, 220), "F": (176, 210, 255),
    "y": (249, 240, 107), "Y": (252, 248, 175), "o": (204, 182, 68),
    "g": (110, 176, 56), "b": (48, 104, 208), "a": (248, 208, 40), "v": (224, 52, 52),
    "J": (40, 176, 232), "j": (128, 214, 248), "h": (24, 118, 176),
    "R": (240, 72, 64), "q": (252, 146, 132), "w": (172, 38, 40),
}
SHINY = dict(NORMAL, **{
    "k": (34, 70, 120), "c": (122, 182, 232), "l": (172, 216, 250), "s": (84, 138, 200),
    "t": (98, 160, 222), "n": (110, 172, 232), "r": (190, 226, 255),
    "f": (250, 250, 250), "F": (255, 255, 255),
    # os Joy-Cons trocam: o azul vai pra direita e o vermelho pra esquerda
    "J": (240, 72, 64), "j": (252, 146, 132), "h": (172, 38, 40),
    "R": (40, 176, 232), "q": (128, 214, 248), "w": (24, 118, 176),
})

TROCA = str.maketrans("lsjhqwYo", "slhjwqoY")


def espelho(linhas):
    return [l[::-1].translate(TROCA) for l in linhas]


class Grade:
    def __init__(self, w, h):
        self.w, self.h = w, h
        self.px = [["."] * w for _ in range(h)]

    def por(self, x, y, linhas):
        """cola as linhas em (x, y); '.' não mexe no que já tem"""
        for j, linha in enumerate(linhas):
            for i, ch in enumerate(linha):
                if ch != "." and 0 <= x + i < self.w and 0 <= y + j < self.h:
                    self.px[y + j][x + i] = ch

    def par(self, x, y, linhas, eixo):
        """o desenho em (x, y) e o espelho dele do outro lado do eixo"""
        self.por(x, y, linhas)
        larg = max(len(l) for l in linhas)
        self.por(2 * eixo - x - larg, y, espelho([l.ljust(larg, ".") for l in linhas]))

    def tela(self, x0, y0, x1, y1):
        """linhas de TV na tela (uma sim, uma não) e o reflexo no canto"""
        for y in range(y0, y1 + 1):
            for x in range(x0, x1 + 1):
                if self.px[y][x] == "t" and (y - y0) % 2 == 1:
                    self.px[y][x] = "n"
        self.por(x0 + 1, y0 + 1, ["rrr", "r..", "r.."])

    def imagem(self, pal):
        im = Image.new("RGBA", (self.w, self.h), (0, 0, 0, 0))
        for y, linha in enumerate(self.px):
            for x, ch in enumerate(linha):
                if ch != ".":
                    im.putpixel((x, y), pal[ch] + (255,))
        return im


# ------------------------------------------------------------ peças comuns
# o ROSTO: onde fica cada pontinho (canto de cima à esquerda, em pontos de 2)
OLHOS = [(5, 0), (3, 2), (7, 2), (5, 4), (17, 0), (15, 2), (19, 2), (17, 4)]
BOCA = [(0, 6), (22, 6), (2, 8), (20, 8), (6, 10), (16, 10), (11, 11)]
PONTO = {2: ["Ff", "ff"], 3: ["fff", "fFf", "fff"]}


def rosto(g, x, y, d=2):
    for px, py in OLHOS + BOCA:
        g.por(x + px * d // 2, y + py * d // 2, PONTO[d])


ANTENA = [            # a da esquerda; a base encosta no aparelho
    ".kkkkk.....",
    "kllccsk....",
    ".kkkcsk....",
    "....kcsk...",
    ".....kcsk..",
    "......kcsk.",
    ".......kcsk",
]

BRACO = [             # o da esquerda; a coluna da direita encosta no aparelho
    "........k",
    "......kkc",
    "....kkllc",
    "...kllccc",
    "..klcccsk",
    ".klccssk.",
    ".kccsk...",
    "kccsk....",
    "kcsk.....",
    ".kkkkk...",
    "kyYyyyk..",
    "kYyyyyok.",
    "kYyyyyok.",
    "kyyyyook.",
    "kykyykok.",
    "kk.kk.kk.",
]

BOTOES = [            # na beirada direita, saindo pra fora
    "gk", "gk", "kk", "bk", "bk", "kk", "ak", "ak", "kk", "vk", "vk",
]


# ------------------------------------------------------------ CELULAR
def celular():
    W, H = 50, 64
    g = Grade(W, H)
    x0, y0 = 9, 7              # o celular: 32 de largura, a partir daqui
    corpo = [
        ".." + "k" * 28 + "..",
        ".k" + "l" * 28 + "k.",
        "kll" + "c" * 10 + "kkkkkk" + "c" * 11 + "sk",     # o alto-falante
        "kl" + "c" * 28 + "sk",
        "kl" + "k" * 28 + "sk",
    ]
    corpo += ["kl" + "k" + "t" * 26 + "k" + "sk"] * 36
    corpo += [
        "kl" + "k" * 28 + "sk",
        "kl" + "c" * 28 + "sk",
        "kl" + "c" * 10 + "l" * 8 + "c" * 10 + "sk",      # a barrinha de baixo
        "kl" + "c" * 28 + "sk",
        ".k" + "s" * 28 + "k.",
        ".." + "k" * 28 + "..",
    ]
    g.por(x0, y0, corpo)
    g.tela(x0 + 3, y0 + 5, x0 + 28, y0 + 40)
    rosto(g, x0 + 4, y0 + 13)
    g.par(x0 + 2, 0, ANTENA, W // 2)
    g.par(0, y0 + 18, BRACO, W // 2)
    g.por(x0 + 32, y0 + 8, BOTOES)
    # o RABO: o fio do carregador, enrolado, com o plugue amarelo na ponta
    g.por(x0 + 17, y0 + 47, [
        ".kssk......",
        ".kcsk......",
        "..kcsk.....",
        "...kcskkk..",
        "....kccssk.",
        ".....kkkcsk",
        "......kcsk.",
        ".....kyyok.",
        ".....kYyok.",
        "......k.k..",
    ])
    return g


# ------------------------------------------------------------ COMPUTADOR
def computador():
    W, H = 70, 62
    g = Grade(W, H)
    x0, y0 = 9, 7              # o monitor: 52 de largura
    corpo = [
        ".." + "k" * 48 + "..",
        ".k" + "l" * 48 + "k.",
        "kl" + "c" * 48 + "sk",
        "kl" + "c" + "k" * 46 + "c" + "sk",
    ]
    corpo += ["kl" + "c" + "k" + "t" * 44 + "k" + "c" + "sk"] * 26
    corpo += [
        "kl" + "c" + "k" * 46 + "c" + "sk",
        "kl" + "c" * 34 + "gcbcacvc" + "c" * 6 + "sk",   # as luzinhas
        "kl" + "c" * 48 + "sk",
        ".k" + "s" * 48 + "k.",
        ".." + "k" * 48 + "..",
    ]
    g.por(x0, y0, corpo)
    g.tela(x0 + 4, y0 + 4, x0 + 47, y0 + 29)
    rosto(g, x0 + 8, y0 + 6, d=3)
    g.par(x0 + 8, 0, ANTENA, W // 2)
    g.par(0, y0 + 10, BRACO, W // 2)
    # o pé do monitor
    meio = x0 + 26
    g.por(meio - 4, y0 + 35, ["kllccssk"] * 5)
    g.por(meio - 14, y0 + 40, [
        "...kkkkkkkkkkkkkkkkkkkkkk...",
        ".kkllllllllllllllllllllccskk",
        "kllcccccccccccccccccccccccsk",
        ".kssssssssssssssssssssssssk.",
        "..kkkkkkkkkkkkkkkkkkkkkkkk..",
    ])
    # o RABO: o fio do mouse saindo de trás, e o mouse na ponta
    g.por(meio + 16, y0 + 36, [
        "kk.........",
        "kssk.......",
        ".kcsk......",
        "..kcskkkk..",
        "...kccccsk.",
        "....kkkkcsk",
        "........kck",
        ".....kkkkck",
        "....kllcccsk",
        "...klcckccsk",
        "...klcckccsk",
        "...klccccssk",
        "....kssssk..",
        ".....kkkk...",
    ])
    return g


# ------------------------------------------------------------ NINTENDO SWITCH
JOYCON = [            # o da esquerda (azul): direcional embaixo do analógico
    "....kkkkkk",
    "..kkjjjjjk",
    ".kjjjJJJJk",
    ".kjJJJJJJk",
    "kjJJJJJJJk",
    "kjJJkkkJJk",
    "kjJkclckJk",
    "kjJkcsckJk",
    "kjJJkkkJJk",
    "kjJJJJJJJk",
    "kjJJJJJJJk",
    "kjJJJkJJJk",
    "kjJJkckJJk",
    "kjJkcJckJk",
    "kjJJkckJJk",
    "kjJJJkJJJk",
    "kjJJJJJJJk",
    "kjJJJJJJhk",
    "kjJJJJJJhk",
    "kjJJJJJJhk",
    "kjJJJJJJhk",
    "kjJJJJJJhk",
    "kjJJJJJJhk",
    ".kJJJJJhhk",
    ".khhhhhhhk",
    "...kkkkkkk",
]


def joycon_direito():
    """o vermelho: os 4 botões em cima e o analógico mais embaixo"""
    linhas = [l.translate(str.maketrans("Jjh", "Rqw")) for l in JOYCON]
    linhas = linhas[:5] + linhas[11:16] + linhas[10:11] + linhas[5:10] + linhas[16:]
    return espelho(linhas)


def switch():
    W, H = 74, 46
    g = Grade(W, H)
    x0, y0 = 19, 7             # a tela do meio: 36 de largura
    corpo = [
        "k" * 36,
        "k" + "l" * 34 + "k",
        "kl" + "k" * 32 + "sk",
    ]
    corpo += ["kl" + "k" + "t" * 30 + "k" + "sk"] * 20
    corpo += [
        "kl" + "k" * 32 + "sk",
        "k" + "s" * 34 + "k",
        "k" * 36,
    ]
    g.por(x0, y0, corpo)
    g.tela(x0 + 3, y0 + 3, x0 + 32, y0 + 22)
    rosto(g, x0 + 6, y0 + 6)
    g.por(x0 - 10, y0, JOYCON)
    g.por(x0 + 36, y0, joycon_direito())
    g.par(x0 + 4, 0, ANTENA, W // 2)
    g.par(0, y0 + 9, BRACO, W // 2)
    return g


FORMAS = {"celular": celular, "computador": computador, "switch": switch}


def no_quadro(im):
    """centraliza no 96x96, com os pés perto do chão, como os outros sprites"""
    q = Image.new("RGBA", (LADO, LADO), (0, 0, 0, 0))
    caixa = im.getbbox()
    im = im.crop(caixa)
    q.alpha_composite(im, ((LADO - im.width) // 2, LADO - im.height - 4))
    return q


def main():
    os.makedirs(os.path.join(DESTINO, "shiny"), exist_ok=True)
    previa = Image.new("RGBA", (LADO * 3 * len(FORMAS), LADO * 3 * 2), (232, 232, 236, 255))
    for i, (nome, fazer) in enumerate(FORMAS.items()):
        g = fazer()
        for j, (pal, pasta) in enumerate(((NORMAL, ""), (SHINY, "shiny"))):
            im = no_quadro(g.imagem(pal))
            im.save(os.path.join(DESTINO, pasta, f"{nome}.png"))
            previa.alpha_composite(im.resize((LADO * 3, LADO * 3), Image.NEAREST), (i * LADO * 3, j * LADO * 3))
    previa.save(os.environ.get("PREVIA", "/tmp/monstela_formas.png"))
    print("formas em", os.path.relpath(DESTINO, ROOT))


if __name__ == "__main__":
    main()
