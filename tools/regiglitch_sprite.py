#!/usr/bin/env python3
"""O SPRITE DO REGIGLITCH (src/data/regis.js), desenhado em código.

Ele não existe em jogo nenhum, e a regra deste jogo pra glitch é que ele é o
desenho de OUTRO lido errado (como as formas hackeanas). Então o desenho sai
do REGISTEEL (assets/sprites/pokemon/379.png), lido errado:

- as cores viram ROXO UVA (o corpo) e VERDE CÓDIGO (os braços e as pernas);
- a faixa do rosto fica quase preta, e os sete pontos vermelhos somem: no
  lugar, SETE PONTOS VERDES NUMA LINHA RETA, um traço;
- o corpo ganha a CHUVA DE CÓDIGO: colunas de traços verdes descendo;
- e três faixas de linhas ESCORREGAM pro lado, como uma tela com defeito.

O modelo 3D (src/core/gigante3d.js) é pintado com as mesmas cores.

    python3 tools/regiglitch_sprite.py      # grava assets/sprites/pokemon/regiglitch.png
"""
import os
import random

from PIL import Image

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ORIGEM = os.path.join(RAIZ, "assets/sprites/pokemon/379.png")
DESTINO = os.path.join(RAIZ, "assets/sprites/pokemon/regiglitch.png")

ROXO = ["#9b59d0", "#6f2da8", "#4b1a78", "#2a0a45"]       # roxo uva, do claro pro escuro
VERDE = ["#a0ffb0", "#00ff41", "#00b82e", "#006b1a"]      # verde código
FENDA = "#14051f"
PRETO = "#000000"


def rgb(h):
    return tuple(int(h[i:i + 2], 16) for i in (1, 3, 5))


# as cores do REGISTEEL → as do REGIGLITCH
CORPO = {  # o metal claro do corpo vira roxo, pela claridade
    (255, 255, 255): ROXO[0], (222, 222, 222): ROXO[0], (213, 205, 213): ROXO[0],
    (189, 189, 189): ROXO[1], (180, 172, 172): ROXO[1], (131, 139, 131): ROXO[2],
    (131, 131, 123): ROXO[2],
}
ESCURO = {(74, 90, 90): 2, (74, 74, 74): 2, (57, 65, 82): 3}   # braços, pernas e faixa do rosto
VERMELHO = (255, 65, 65)


def main():
    im = Image.open(ORIGEM).convert("RGBA")
    w, h = im.size
    src = im.load()
    out = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    px = out.load()

    # onde fica o rosto: o meio dos pontos vermelhos da cara (os das mãos ficam
    # embaixo e pros lados)
    rosto = [(x, y) for y in range(h) for x in range(w)
             if src[x, y][3] and src[x, y][:3] == VERMELHO and 30 < x < 66 and y < 50]
    cx = round(sum(x for x, _ in rosto) / len(rosto))
    cy = round(sum(y for _, y in rosto) / len(rosto))
    # a faixa do rosto: o escuro perto do meio, na altura da cara
    faixa = lambda x, y: abs(x - cx) <= 9 and y <= cy + 22
    # os braços e as pernas (o resto do escuro é a sombra da borda do corpo)
    membro = lambda x, y: abs(x - cx) >= 20 and y >= cy + 2 or y >= cy + 36

    for y in range(h):
        for x in range(w):
            r, g, b, a = src[x, y]
            if not a:
                continue
            c = (r, g, b)
            if c in CORPO:
                px[x, y] = rgb(CORPO[c]) + (255,)
            elif c in ESCURO:
                cor = FENDA if faixa(x, y) else VERDE[ESCURO[c]] if membro(x, y) else ROXO[3]
                px[x, y] = rgb(cor) + (255,)
            elif c == VERMELHO:
                # os pontos de antes: na cara viram fenda, nas mãos viram verde
                px[x, y] = rgb(FENDA if faixa(x, y) else VERDE[1]) + (255,)
            else:
                px[x, y] = rgb(PRETO) + (255,)

    # A CHUVA DE CÓDIGO: em umas colunas do corpo roxo, traços verdes descendo
    sorte = random.Random(0x5E7E)
    for x in range(w):
        if sorte.random() < 0.72:
            continue
        fase, comp, vao = sorte.randrange(12), sorte.choice([3, 4, 5]), sorte.choice([6, 8, 10])
        for y in range(h):
            if (y + fase) % (comp + vao) < comp and px[x, y][3] and px[x, y][:3] in [rgb(c) for c in ROXO[:3]]:
                cabeca = (y + fase) % (comp + vao) == comp - 1
                px[x, y] = rgb(VERDE[0] if cabeca else VERDE[1]) + (255,)

    # OS SETE PONTOS NUM TRAÇO, no meio da faixa do rosto
    for i in range(7):
        x0 = cx - 9 + i * 3
        for dx in (0, 1):
            for dy in (0, 1):
                px[x0 + dx, cy + dy] = rgb(VERDE[1]) + (255,)

    # AS FATIAS QUE ESCORREGAM: três faixas de linhas, cada uma pra um lado
    for y0, alt, dx in ((22, 3, 3), (47, 2, -4), (63, 4, 2)):
        linhas = [[px[x, y] for x in range(w)] for y in range(y0, y0 + alt)]
        for k, linha in enumerate(linhas):
            for x in range(w):
                px[x, y0 + k] = linha[(x - dx) % w]

    out.save(DESTINO)
    print("gravado", os.path.relpath(DESTINO, RAIZ))


if __name__ == "__main__":
    main()
