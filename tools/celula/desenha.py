"""A CÉLULA DE ZYGARDE (pedido do CAIO, nov/2026: os MINI ZYGARDE do espaço
viram CÉLULAS). Desenhada pixel por pixel: a gota verde com contorno escuro,
três tons de verde, o brilho em cima e o NÚCLEO vermelho com o hexágono.
Sai: assets/sprites/pokemon/31050.png (frente), back/31050.png (costas) e
andar/31050.png (andando: baixo, cima, esq, dir; 4 quadros quicando)."""
import json, os
from PIL import Image
R = os.path.join(os.path.dirname(__file__), "..", "..")
K = (16, 48, 24, 255); D = (34, 112, 50, 255); M = (64, 168, 72, 255); L = (128, 220, 104, 255); B = (216, 255, 192, 255)
VR = (200, 32, 40, 255); VC = (255, 96, 88, 255); BR = (255, 240, 220, 255)

def gota(w, h, nucleo=True, olhando=0):
    """uma gota de w x h (base larga, ponta em cima), com contorno de 1 pixel"""
    im = Image.new("RGBA", (w + 2, h + 2), (0, 0, 0, 0)); p = im.load()
    cx = (w + 1) / 2
    import math
    # a GOTA: redonda embaixo, com uma pontinha em cima (a parte mais larga a 60% da altura)
    largura = lambda t: (w / 2) * (math.sin(math.pi * min(1, t ** 0.78)) ** 0.62) if 0 < t < 1 else 0
    dentro = lambda x, y: 1 <= y <= h and abs(x - cx) <= largura(1 - (y - 0.5) / h) + 0.35
    pts = [(x, y) for y in range(h + 2) for x in range(w + 2) if dentro(x, y)]
    S = set(pts)
    for x, y in pts:
        t = (y - 1) / h; lado = (x - cx) / (w / 2 + 0.01)
        c = M
        if lado > 0.4 or t > 0.84: c = D                # a sombra: direita e embaixo
        if lado < -0.2 and t < 0.6: c = L                # a luz: em cima, à esquerda
        p[x, y] = c
    for x, y in pts:                                      # o contorno
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            if (x + dx, y + dy) not in S: p[x, y] = K
    # o brilho
    bx, by = int(cx - w * 0.2), int(h * 0.32)
    for q in ((0, 0), (1, 0), (0, 1)):
        if (bx + q[0], by + q[1]) in S: p[bx + q[0], by + q[1]] = B
    if nucleo:                                            # o NÚCLEO vermelho com o hexágono
        nx, ny = int(cx + olhando), int(h * 0.66)
        hexa = [".kkk.", "kvcvk", "kcbck", "kvcvk", ".kkk."] if w < 20 else ["..kkk..", ".kvvvk.", "kvcccvk", "kvcbcvk", "kvcccvk", ".kvvvk.", "..kkk.."]
        for j, l in enumerate(hexa):
            for i, ch in enumerate(l):
                c = {"k": K, "v": VR, "c": VC, "b": BR}.get(ch)
                o = len(hexa) // 2
                if c and (nx - o + i, ny - o + j) in S: p[nx - o + i, ny - o + j] = c
    return im

def batalha(nucleo):
    c = Image.new("RGBA", (96, 96), (0, 0, 0, 0))
    g = gota(38, 36, nucleo)
    g = g.resize((g.width * 2 // 2, g.height * 2 // 2), Image.NEAREST)
    c.alpha_composite(g, ((96 - g.width) // 2, 96 - g.height - 18))
    return c

os.makedirs(f"{R}/assets/sprites/pokemon/back", exist_ok=True)
batalha(True).save(f"{R}/assets/sprites/pokemon/31050.png")
batalha(False).save(f"{R}/assets/sprites/pokemon/back/31050.png")

# ANDANDO: 4 quadros quicando (achata, normal, estica, normal), 4 direções
FW, FH = 20, 22
folha = Image.new("RGBA", (FW * 4, FH * 4), (0, 0, 0, 0))
for linha, (nuc, olha) in enumerate(((True, 0), (False, 0), (True, -2), (True, 2))):   # baixo, cima, esq, dir
    for q, (w, h) in enumerate(((16, 13), (14, 15), (12, 17), (14, 15))):
        g = gota(w, h, nuc, olha * 0.5)
        folha.alpha_composite(g, (q * FW + (FW - g.width) // 2, linha * FH + FH - g.height - 1))
folha.save(f"{R}/assets/sprites/pokemon/andar/31050.png")
idx = f"{R}/assets/sprites/pokemon/andar/andar.json"
d = json.load(open(idx)); d["31050"] = [FW, FH, 4, [150, 150, 150, 150]]
json.dump(d, open(idx, "w"), separators=(",", ":"), sort_keys=True)
print("ok")
