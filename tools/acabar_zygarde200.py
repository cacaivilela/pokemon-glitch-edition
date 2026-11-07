# python3 tools/acabar_zygarde200.py tools/zygarde200_base.png assets/sprites/pokemon/zygarde200.png <ampliado.png>
# O ACABAMENTO da base que o CAIO desenhou (dev/captures/zygarde200_base.png):
# o desenho dele fica como está; o preto de dentro vira o corpo do ZYGARDE com
# sombra (luz de cima à esquerda) e cada cor ganha o tom claro e o escuro. SEM
# CONTORNO: a beirada é o tom claro ou o escuro da própria parte.
import sys
from PIL import Image

PRETOS = {(5, 5, 5), (8, 8, 8)}
# cor da base -> (claro, médio, escuro)
RAMPAS = {
    "preto": ("#5e4f50", "#4a3c3d", "#2e2422"),
    (0x3e, 0x51, 0xa8): ("#568bdc", "#3e51a8", "#2a3478"),
    (0x56, 0x8b, 0xdc): ("#8ab4f0", "#568bdc", "#3e51a8"),
    (0xec, 0x48, 0x4d): ("#ff7a7e", "#ec484d", "#a82430"),
    (0x4f, 0x7f, 0x1f): ("#7f9f1f", "#4f7f1f", "#355a12"),
    (0x7f, 0x9f, 0x1f): ("#afcf4f", "#7f9f1f", "#4f7f1f"),
    (0xaf, 0xcf, 0x4f): ("#d8ec8a", "#afcf4f", "#7f9f1f"),
    (0xfe, 0xfe, 0xfe): ("#fefefe", "#fefefe", "#c8c8b8"),
    (0x6a, 0xe8, 0xff): ("#c0f8ff", "#6ae8ff", "#2a9ac8"),
    (0x24, 0x18, 0x13): ("#38302e", "#241813", "#181010"),
}
K = (8, 8, 8, 255)

def rgb(h):
    return (int(h[1:3], 16), int(h[3:5], 16), int(h[5:7], 16), 255)

def acabar(src, dest):
    im = Image.open(src).convert("RGBA")
    W, H = im.size
    p = im.load()
    cor = {}
    for y in range(H):
        for x in range(W):
            r, g, b, a = p[x, y]
            if a >= 128:
                cor[(x, y)] = "preto" if (r, g, b) in PRETOS else (r, g, b)
    out = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    o = out.load()
    vazio = lambda x, y: (x, y) not in cor
    for (x, y), c in cor.items():
        mesma = lambda dx, dy: cor.get((x + dx, y + dy)) == c
        rampa = RAMPAS.get(c)
        if not rampa:
            o[x, y] = (*c, 255) if c != "preto" else K
            continue
        claro, medio, escuro = rampa
        if not mesma(-1, 0) or not mesma(0, -1) or (c == "preto" and (not mesma(-2, 0) or not mesma(0, -2))):
            t = claro
        elif not mesma(1, 0) or not mesma(0, 1) or not mesma(1, 1) or (c == "preto" and (not mesma(2, 0) or not mesma(0, 2))):
            t = escuro
        else:
            t = medio
            # o corpo escurece de cima pra baixo: embaixo dos ombros é sombra
            if c == "preto":
                t = "#4a3c3d" if y < 42 else "#433637" if y < 62 else "#3b2f30"
        o[x, y] = rgb(t)
    out.save(dest)
    return out

if __name__ == "__main__":
    out = acabar(sys.argv[1], sys.argv[2])
    bg = Image.new("RGBA", out.size, (120, 150, 140, 255)); bg.alpha_composite(out)
    bg.resize((576, 576), Image.NEAREST).save(sys.argv[3])
