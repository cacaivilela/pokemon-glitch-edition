"""FERRAMENTAS PRA DESENHAR SPRITE DE FUSÃO, 64x64, NO CÓDIGO.

A oficina do jogo é pro jogador pintar com o mouse. Isto aqui é o contrário:
desenhar por forma — elipse, polígono, linha — e deixar o computador fazer a
parte chata, que é sombrear e contornar.

Duas ideias sustentam o resultado:

LUZ AUTOMÁTICA (`luz`) — a luz vem de cima e da esquerda, sempre. Todo pixel
que tem vazio em cima-esquerda recebe clareada; todo pixel que tem vazio em
baixo-direita recebe escurecida. Isso dá volume ao desenho inteiro de uma vez,
sem escolher tom por tom. Por isso ela roda ANTES dos detalhes: olho e boca não
levam sombra.

CONTORNO (`contorno`) — uma borda escura em volta da silhueta, que é o que faz
o bicho não sumir no fundo da batalha.

Nada aqui usa antialias: em 64x64 borda borrada vira sujeira.
"""
from PIL import Image, ImageDraw

LADO = 64
VAZIO = (0, 0, 0, 0)


def mistura(cor, alvo, quanto):
    """`cor` andando `quanto` (0..1) na direção de `alvo`."""
    r, g, b = cor[:3]
    a = cor[3] if len(cor) > 3 else 255
    return (round(r + (alvo[0] - r) * quanto),
            round(g + (alvo[1] - g) * quanto),
            round(b + (alvo[2] - b) * quanto), a)


clarear = lambda c, q=0.30: mistura(c, (255, 255, 255), q)
escurecer = lambda c, q=0.28: mistura(c, (0, 0, 0), q)


class Tela:
    def __init__(self, lado=LADO):
        self.img = Image.new("RGBA", (lado, lado), VAZIO)
        self.d = ImageDraw.Draw(self.img)
        self.lado = lado

    # --- formas -----------------------------------------------------------
    def elipse(self, cx, cy, rx, ry, cor):
        self.d.ellipse([cx - rx, cy - ry, cx + rx, cy + ry], fill=cor)

    def anel(self, cx, cy, rx, ry, cor, grossura=2):
        self.d.ellipse([cx - rx, cy - ry, cx + rx, cy + ry], outline=cor, width=grossura)

    def ret(self, x1, y1, x2, y2, cor):
        self.d.rectangle([x1, y1, x2, y2], fill=cor)

    def poli(self, pontos, cor):
        self.d.polygon(pontos, fill=cor)

    def linha(self, pontos, cor, grossura=1):
        self.d.line(pontos, fill=cor, width=grossura)

    def px(self, x, y, cor):
        if 0 <= x < self.lado and 0 <= y < self.lado:
            self.img.putpixel((x, y), cor)

    def pxs(self, pontos, cor):
        for x, y in pontos:
            self.px(x, y, cor)

    def cor(self, x, y):
        if 0 <= x < self.lado and 0 <= y < self.lado:
            return self.img.getpixel((x, y))
        return VAZIO

    # --- acabamento -------------------------------------------------------
    def luz(self, forca=0.30, sombra=0.26, poupar=()):
        """Volume de graça: clareia a beirada de cima-esquerda, escurece a de
        baixo-direita. `poupar` são cores que ficam como estão (uma chama, um
        brilho — coisa que emite luz não recebe sombra)."""
        antes = self.img.copy()
        vejo = antes.load()
        novo = self.img.load()
        for y in range(self.lado):
            for x in range(self.lado):
                c = vejo[x, y]
                if c[3] == 0 or c[:3] in poupar:
                    continue
                fora = lambda dx, dy: vejo[x + dx, y + dy][3] == 0 \
                    if 0 <= x + dx < self.lado and 0 <= y + dy < self.lado else True
                if fora(-1, -1) or fora(0, -1) or fora(-1, 0) or fora(-2, -2):
                    novo[x, y] = clarear(c, forca)
                elif fora(1, 1) or fora(0, 1) or fora(1, 0) or fora(2, 2):
                    novo[x, y] = escurecer(c, sombra)

    def contorno(self, cor=(24, 20, 32, 255)):
        """Borda escura por fora da silhueta."""
        vejo = self.img.copy().load()
        for y in range(self.lado):
            for x in range(self.lado):
                if vejo[x, y][3] != 0:
                    continue
                if any(0 <= x + dx < self.lado and 0 <= y + dy < self.lado
                       and vejo[x + dx, y + dy][3] > 128
                       for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))):
                    self.img.putpixel((x, y), cor)

    def salvar(self, caminho):
        self.img.save(caminho)

    def png64(self):
        import base64, io
        buf = io.BytesIO()
        self.img.save(buf, "PNG")
        return "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode()


def folha_de_contato(imagens, escala=4, por_linha=3, fundo=(28, 26, 36, 255)):
    """Todas juntas e ampliadas, pra olhar de uma vez."""
    linhas = (len(imagens) + por_linha - 1) // por_linha
    cel = LADO * escala + 8
    folha = Image.new("RGBA", (cel * min(por_linha, len(imagens)), cel * linhas), fundo)
    for i, im in enumerate(imagens):
        grande = im.resize((LADO * escala, LADO * escala), Image.NEAREST)
        folha.alpha_composite(grande, ((i % por_linha) * cel + 4, (i // por_linha) * cel + 4))
    return folha
