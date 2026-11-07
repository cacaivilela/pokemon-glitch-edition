"""A CAIXA DE FERRAMENTAS das animações especiais dos fakemons (uma por
criatura, quadro a quadro, como a do ZYGARDE 200%).

Cada criatura tem um ROTEIRO em tools/anima_especial/roteiros/<id>.py com:
    CHAVE = "1032"            # a chave do índice (o número do sprite, ou "u/<nome>")
    def quadros(b):           # b = Base(...) já com o sprite carregado
        ...                   # devolve [(Image, ms), ...]

O quadro é montado com as PARTES do próprio desenho (recortadas e postas em
outra pose) e os EFEITOS são grades de pixels desenhadas à mão (efeitos.py, ou
no próprio roteiro). Nada de forma geométrica colada: o que é novo é grade.

    python3 tools/anima_especial/rodar.py saci braseagle   # gera e grava
    python3 tools/anima_especial/rodar.py saci --ver       # só a prévia em dev/captures/
"""
import fcntl
import json
import os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SPR = os.path.join(ROOT, "assets", "sprites", "pokemon")
ANIM = os.path.join(SPR, "anim")
INDICE = os.path.join(ANIM, "quadros.json")
CONTORNO = "#181420"          # o contorno dos sprites de Braglitch


def rgba(h):
    return (int(h[1:3], 16), int(h[3:5], 16), int(h[5:7], 16), 255)


class Base:
    """O sprite parado numa folha com MARGEM em volta (pra pular, pra soltar
    efeito pra fora). Coordenadas das partes são as do sprite original; a
    margem é somada sozinha."""

    def __init__(self, arquivo, margem=(12, 20, 12, 4)):   # esquerda, cima, direita, baixo
        self.sprite = Image.open(arquivo).convert("RGBA")
        self.me, self.mc, md, mb = margem
        self.W = self.sprite.width + self.me + md
        self.H = self.sprite.height + self.mc + mb

    # ----------------------------------------------------------- partes
    def parte(self, dentro):
        """recorta os pixels do sprite onde `dentro(x, y, cor)` é verdade.
        Devolve uma imagem do tamanho do sprite só com eles."""
        out = Image.new("RGBA", self.sprite.size, (0, 0, 0, 0))
        p, o = self.sprite.load(), out.load()
        for y in range(self.sprite.height):
            for x in range(self.sprite.width):
                if p[x, y][3] and dentro(x, y, p[x, y]):
                    o[x, y] = p[x, y]
        return out

    def retangulo(self, x0, y0, x1, y1):
        """a parte dentro do retângulo (x1, y1 inclusos)"""
        return self.parte(lambda x, y, c: x0 <= x <= x1 and y0 <= y <= y1)

    def menos(self, img, *tirar):
        """`img` sem os pixels das partes `tirar`"""
        out = img.copy()
        o = out.load()
        for t in tirar:
            tp = t.load()
            for y in range(t.height):
                for x in range(t.width):
                    if tp[x, y][3]:
                        o[x, y] = (0, 0, 0, 0)
        return out

    # ----------------------------------------------------------- quadro
    def quadro(self):
        return Image.new("RGBA", (self.W, self.H), (0, 0, 0, 0))

    def por(self, q, img, dx=0, dy=0, vira=False, de_ponta=False):
        """cola a parte `img` (do tamanho do sprite) no quadro, deslocada
        (dx, dy). `vira`: espelha de lado; `de_ponta`: de cabeça pra baixo
        (os dois em volta da caixa da própria parte)."""
        if vira or de_ponta:
            cx = img.getbbox()
            if not cx:
                return
            pedaco = img.crop(cx)
            if vira:
                pedaco = pedaco.transpose(Image.FLIP_LEFT_RIGHT)
            if de_ponta:
                pedaco = pedaco.transpose(Image.FLIP_TOP_BOTTOM)
            q.alpha_composite(pedaco, (self.me + cx[0] + dx, self.mc + cx[1] + dy))
        else:
            q.alpha_composite(img, (self.me + dx, self.mc + dy))

    def grade(self, q, g, x, y, cores, espelha=False):
        """desenha a grade de pixels `g` (lista de strings, "." não pinta) com
        o canto em (x, y) — coordenadas do SPRITE (pode ser negativo: é a
        margem)."""
        px = q.load()
        for j, linha in enumerate(g):
            if espelha:
                linha = linha[::-1]
            for i, ch in enumerate(linha):
                if ch == "." or ch == " ":
                    continue
                a, b = self.me + x + i, self.mc + y + j
                if 0 <= a < self.W and 0 <= b < self.H:
                    px[a, b] = rgba(cores[ch])


def salvar(chave, fs, lado="f"):
    """grava a folha (cortada na caixa de todos os quadros) em anim/<chave>.png
    e o índice — com trava, porque mais de um roteiro pode gravar junto. A
    entrada fica marcada `feito` (feita à mão: o tools/anima_proprios.py não
    mexe). O lado de costas que já existir fica."""
    qs = [q for q, _ in fs]
    caixa = None
    for q in qs:
        b = q.getbbox()
        if b:
            caixa = b if not caixa else (min(caixa[0], b[0]), min(caixa[1], b[1]), max(caixa[2], b[2]), max(caixa[3], b[3]))
    qs = [q.crop(caixa) for q in qs]
    w, h = qs[0].size
    col = min(16, len(qs))
    lin = (len(qs) + col - 1) // col
    folha = Image.new("RGBA", (w * col, h * lin), (0, 0, 0, 0))
    for i, q in enumerate(qs):
        folha.paste(q, ((i % col) * w, (i // col) * h))
    pasta = ANIM if lado == "f" else os.path.join(ANIM, "back")
    dest = os.path.join(pasta, chave + ".png")
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    folha.save(dest, optimize=True)
    with open(INDICE + ".trava", "w") as trava:
        fcntl.flock(trava, fcntl.LOCK_EX)
        with open(INDICE, encoding="utf-8") as f:
            idx = json.load(f)
        e = idx.get(chave, {})
        e[lado] = [w, h, col, [ms for _, ms in fs]]
        e.pop("gerado", None)
        e["feito"] = 1
        idx[chave] = e
        with open(INDICE, "w", encoding="utf-8") as f:
            json.dump(idx, f, separators=(",", ":"), sort_keys=True)
    return qs


def previa(fs, dest, zoom=3, por_linha=8):
    """uma tira com todos os quadros, ampliada, pra olhar"""
    qs = [q for q, _ in fs]
    w, h = qs[0].size
    n = len(qs)
    out = Image.new("RGBA", (w * min(por_linha, n), h * ((n + por_linha - 1) // por_linha)), (120, 150, 140, 255))
    for i, q in enumerate(qs):
        out.alpha_composite(q, ((i % por_linha) * w, (i // por_linha) * h))
    out.resize((out.width * zoom, out.height * zoom), Image.NEAREST).save(dest)
