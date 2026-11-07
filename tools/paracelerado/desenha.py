"""O PARACELERADO (pedido do CAIO, nov/2026; depois: "azul acelerado em 2x" — o
cogumelo azul elétrico e a animação 2x mais rápida): o PARASECT que ficou 15 segundos
acelerando na cena da evolução. Ele pediu: "um PARASECT com animação normal com
RODAS NAS PATAS". Então é o PARASECT de sempre, com a animação dele inteira
(assets/sprites/pokemon/anim/047.png, frente e costas), e em CADA quadro uma
rodinha (desenhada pixel por pixel, embaixo) na ponta de cada pata — achada
quadro a quadro, porque as patas mexem. As rodinhas giram: o raio da roda troca
de posição a cada quadro.

Saída (spriteDex 31004):
  assets/sprites/pokemon/31004.png, back/31004.png     (o 1º quadro, 96x96)
  assets/sprites/pokemon/anim/31004.png, anim/back/31004.png
  e a entrada "31004" em anim/quadros.json (os tempos do PARASECT, 4px mais alto)
Uso: python3 tools/paracelerado/desenha.py [pasta_previa]
"""
import json
import sys
from PIL import Image

RAIZ = "assets/sprites/pokemon"
EXTRA = 5            # a folha cresce isto embaixo: a roda passa do pé
VELOCIDADE = 2       # (ele pediu "azul acelerado em 2x") a animação, 2x mais rápida
# AS PINÇAS FICAM SEM RODA (pedido do CAIO). Marcadas à mão, pose por pose (a
# animação da frente tem 15 poses): as pontas que são das duas pinças, e uma
# ponta falsa embaixo dos olhos (26,45). Nas costas a pinça é sempre a da
# direita (x >= 46); as 4 patas ficam à esquerda dela.
PINCAS_FRENTE = {
    (5, 50), (37, 58), (11, 54), (35, 58), (18, 56), (34, 58), (26, 45), (23, 57), (32, 58), (33, 58),
    (30, 58), (2, 48), (40, 60), (2, 46), (44, 60), (47, 61), (53, 61),
}
PINCA_COSTAS_X = 46

# o cogumelo AZUL ELÉTRICO, tom por tom (o escuro continua escuro); as pintas
# amarelas ficam (viram faísca)
TROCA = {
    (123, 8, 8): (16, 40, 110),
    (189, 49, 66): (40, 90, 190),
    (239, 49, 49): (60, 140, 240),
    (255, 107, 107): (140, 205, 255),
    (255, 214, 82): (255, 255, 150),
    (255, 132, 82): (255, 235, 90),
    (214, 206, 49): (250, 250, 140),
}

# A RODA, pixel por pixel (7x7): k pneu, s aro, G cubo; duas posições do raio
RODA = [
    [
        "..kkk..",
        ".kssSk.",
        "ksSGsSk",
        "ksGGGsk",
        "kSsGSsk",
        ".kSssk.",
        "..kkk..",
    ],
    [
        "..kkk..",
        ".kSssk.",
        "ksSGssk",
        "kSGGGSk",
        "kssGSsk",
        ".kssSk.",
        "..kkk..",
    ],
]
COR = {"k": (24, 24, 30, 255), "s": (110, 118, 130, 255), "S": (70, 76, 88, 255), "G": (210, 216, 224, 255)}


def pontas(q):
    """as pontas das patas: colunas onde o desenho desce mais que as vizinhas
    (na parte de baixo do quadro), uma por pata"""
    W, H = q.size
    px = q.load()
    fundo = [-1] * W
    for x in range(W):
        for y in range(H - 1, -1, -1):
            if px[x, y][3] > 100:
                fundo[x] = y
                break
    corpo = max(fundo)
    if corpo < 0:
        return []
    achadas = []
    for x in range(W):
        y = fundo[x]
        if y < corpo - H * 0.28:            # alto demais: é corpo, não pata
            continue
        viz = [fundo[i] for i in range(max(0, x - 3), min(W, x + 4)) if i != x]
        if all(y >= v for v in viz):
            achadas.append((x, y))
    # juntas (a mesma pata em 2 ou 3 colunas): fica a do meio
    out = []
    for x, y in achadas:
        if out and x - out[-1][0] <= 5:
            px0, py0 = out[-1]
            out[-1] = ((px0 + x) // 2, max(py0, y))
        else:
            out.append((x, y))
    return out[:8]


def azul(q):
    px = q.load()
    for y in range(q.height):
        for x in range(q.width):
            r, g, b, a = px[x, y]
            if a > 100 and (r, g, b) in TROCA:
                px[x, y] = TROCA[(r, g, b)] + (255,)
    return q


def com_rodas(q, i, pinca):
    pontas_q = [p for p in pontas(q) if not pinca(*p)]
    q = azul(q.copy())
    W, H = q.size
    novo = Image.new("RGBA", (W, H + EXTRA), (0, 0, 0, 0))
    novo.paste(q, (0, 0), q)
    px = novo.load()
    roda = RODA[i % 2]
    for (x, y) in pontas_q:
        x0, y0 = x - 3, y - 2                # o pé fica dentro da roda, em cima
        for j, linha in enumerate(roda):
            for k, c in enumerate(linha):
                if c in COR and 0 <= x0 + k < W and 0 <= y0 + j < H + EXTRA:
                    px[x0 + k, y0 + j] = COR[c]
    return novo


def folha(arq, w, h, col, n, pinca):
    img = Image.open(arq).convert("RGBA")
    linhas = (n + col - 1) // col
    out = Image.new("RGBA", (col * w, linhas * (h + EXTRA)), (0, 0, 0, 0))
    quadros = []
    for i in range(n):
        q = img.crop(((i % col) * w, (i // col) * h, (i % col) * w + w, (i // col) * h + h))
        r = com_rodas(q, i, pinca)
        out.paste(r, ((i % col) * w, (i // col) * (h + EXTRA)), r)
        quadros.append(r)
    return out, quadros


def em96(q):
    out = Image.new("RGBA", (96, 96), (0, 0, 0, 0))
    out.paste(q, ((96 - q.width) // 2, 96 - q.height - 6), q)
    return out


def main():
    idx = json.load(open(f"{RAIZ}/anim/quadros.json"))
    e = idx["047"]
    total = lambda t: sum(n for _, n in t) if isinstance(t[0], list) else len(t)
    fw, fh, fcol, ft = e["f"]
    cw, ch, ccol, ct = e["c"]
    frente, qf = folha(f"{RAIZ}/anim/047.png", fw, fh, fcol, total(ft), lambda x, y: (x, y) in PINCAS_FRENTE)
    costas, qc = folha(f"{RAIZ}/anim/back/047.png", cw, ch, ccol, total(ct), lambda x, y: x >= PINCA_COSTAS_X)
    if len(sys.argv) > 1:
        d = sys.argv[1]
        tira = Image.new("RGBA", (8 * (fw + 4), fh + EXTRA), (225, 225, 235, 255))
        for k in range(8):
            q = qf[k * len(qf) // 8]
            tira.paste(q, (k * (fw + 4), 0), q)
        tira.resize((tira.width * 3, tira.height * 3), Image.NEAREST).save(f"{d}/paracelerado_tira.png")
        c2 = Image.new("RGBA", (cw, ch + EXTRA), (225, 225, 235, 255)); c2.paste(qc[0], (0, 0), qc[0])
        c2.resize((cw * 4, (ch + EXTRA) * 4), Image.NEAREST).save(f"{d}/paracelerado_costas.png")
        return
    frente.save(f"{RAIZ}/anim/31004.png")
    costas.save(f"{RAIZ}/anim/back/31004.png")
    em96(qf[0]).save(f"{RAIZ}/31004.png")
    em96(qc[0]).save(f"{RAIZ}/back/31004.png")
    rapido = lambda t: [[max(10, ms // VELOCIDADE), n] for ms, n in t] if isinstance(t[0], list) else [max(10, ms // VELOCIDADE) for ms in t]
    idx["31004"] = {"c": [cw, ch + EXTRA, ccol, rapido(ct)], "f": [fw, fh + EXTRA, fcol, rapido(ft)]}
    with open(f"{RAIZ}/anim/quadros.json", "w") as f:
        json.dump(idx, f, separators=(",", ":"), ensure_ascii=False)


if __name__ == "__main__":
    main()
