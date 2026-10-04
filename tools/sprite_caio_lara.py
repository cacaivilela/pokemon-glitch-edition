#!/usr/bin/env python3
"""CAIO e LARA, os gêmeos de BRAGLITCH (quem joga lá: menino e menina).

O corpo e o andar saem das folhas do FireRed (hero.png e heroina.png); a
cabeça é desenhada aqui e a roupa é trocada:

  CAIO  cabelo preto cacheado, roupa de POKÉ BOLA: vermelho em cima, a faixa
        preta com o botão branco na barriga, branco embaixo.
  LARA  a irmã gêmea: cabelo preto e longo, o sensor branco no braço (tipo um Libre), roupa de BUNEARY SHINY — capuz
        rosa com as orelhas e a pelúcia creme, o resto da roupa nas mesmas cores.

Folha: 4 colunas x 3 linhas de 16x32 (baixo, cima, esquerda). Colunas 0 e 2
paradas, 1 e 3 os passos, 1 px abaixo.

    python3 tools/sprite_caio_lara.py
      -> assets/sprites/overworld/hero_brag.png     (CAIO)
      -> assets/sprites/overworld/heroina_brag.png  (LARA)
"""
import os
from PIL import Image

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OW = os.path.join(RAIZ, "assets", "sprites", "overworld")

PAL = {
    "K": (16, 16, 24),      # contorno
    "H": (40, 32, 36),      # cabelo preto
    "m": (78, 58, 58),      # cabelo, meio-tom (o cacho)
    "h": (128, 98, 90),     # brilho do cabelo
    "S": (232, 172, 124),   # pele
    "s": (200, 136, 96),    # pele, sombra
    "c": (112, 60, 44),     # contorno do rosto
    "r": (240, 132, 120),   # bochecha
    "E": (16, 16, 24),      # olho
    "P": (236, 140, 180),   # BUNEARY SHINY: rosa
    "p": (184, 84, 136),    # rosa, sombra
    "C": (250, 236, 176),   # pelúcia creme
    "q": (214, 190, 120),   # pelúcia, sombra
}

PELE = {
    (255, 197, 148): (232, 172, 124),
    (222, 148, 115): (200, 136, 96),
    (246, 189, 148): (216, 154, 108),
}

# ---- CAIO (sobre o hero.png) --------------------------------------------
CAIO_ROUPA = {
    **PELE,
    (123, 65, 65): (168, 100, 66),      # a sombra da pele dos braços
    (115, 164, 197): (236, 236, 244),   # a calça jeans vira o branco da bola
    (57, 57, 123): (28, 28, 36),        # o azul-marinho vira a faixa preta
    (189, 156, 57): (172, 172, 188),    # mochila branca e cinza
    (255, 222, 90): (236, 236, 248),
}
CAIO = {
    # os cachos: bolinhas de brilho (h) com meio-tom (m) embaixo
    "baixo": [
        ".....KK.KKK.....",
        "...KKhmKhmHKK...",
        "..KhmHHhmHHhmK..",
        ".KhmHmhmHHhmHHK.",
        ".KHHhmHHhmHHmHK.",
        "KhmHHHhmHHHhmHHK",
        "KHHmSSSSSSSSmHHK",
        ".KHSSSSSSSSSSHK.",
        ".KHSSESSSSESSHK.",
        ".KmSSESSSSESSmK.",
        "..KmrSSSSSSrmK..",
        "...KcsSSSSscK...",
    ],
    "cima": [
        ".....KK.KKK.....",
        "...KKhmKhmHKK...",
        "..KhmHHhmHHhmK..",
        ".KhmHmhmHHhmHHK.",
        ".KHHhmHHhmHHmHK.",
        "KhmHHHhmHHHhmHHK",
        "KHHmhmHHHhmHHmHK",
        ".KhmHHHhmHHhmHK.",
        ".KHHhmHHHhmHHHK.",
        "..KHHHmHHHmHHK..",
        "..KmHHHHHHHHmK..",
        "...KKsSSSSsKK...",
    ],
    "lado": [
        ".....KK.KKK.....",
        "....KhmKhmHKK...",
        "...KhmHHhmHHhK..",
        "..KhmHmhmHHhmHK.",
        ".KHmhmHHhmHHmHHK",
        ".KhmSHHHhmHHhmHK",
        ".KSSSSHmHHhmHHK.",
        ".KSSSSSHhmHHmK..",
        ".KSESSSHHHmHHK..",
        "KSSESSrsHHmHK...",
        ".KSSSSsHHHHK....",
        "..KcSSsKKKK.....",
    ],
}

# ---- LARA (sobre o heroina.png) -----------------------------------------
LARA_ROUPA = {
    **PELE,
    (123, 65, 65): (40, 32, 36),        # o cabelo castanho dela vira preto e longo
    (172, 123, 65): (40, 32, 36),
    (106, 41, 41): (20, 16, 20),
    (255, 106, 74): PAL["P"],           # a blusa vermelha vira o rosa do BUNEARY
    (197, 57, 57): PAL["p"],
    (65, 65, 213): PAL["C"],            # o azul vira a pelúcia creme
    (115, 164, 197): PAL["C"],
    (57, 57, 123): PAL["p"],
    (180, 180, 213): PAL["q"],
    (238, 238, 255): PAL["C"],
    (189, 156, 57): PAL["q"],           # bolsa creme
    (255, 222, 90): PAL["C"],
}
LARA = {
    # orelhas de BUNEARY: uma em pé, a outra caída, a pelúcia creme na base
    "baixo": [
        "...KK...........",
        "..KPPK..........",
        "..KPpK.....KKK..",
        "..KPpK...KKPPpK.",
        "..KCCKKKKCCKKK..",
        ".KPPPPPPPPPPPPK.",
        ".KPpPPPPPPPPpPK.",
        ".KCCCCCCCCCCCCK.",
        ".KHHHHmHHmHHHHK.",
        ".KHHSSSSSSSSHHK.",
        ".KHSSESSSSESSHK.",
        ".KHSSESSSSESSHK.",
        ".KHrSSSSSSSSrHK.",
        ".KHHsSSSSSSsHHK.",
        ".KHHKcSSSScKHHK.",
    ],
    "cima": [
        "...........KK...",
        "..........KPPK..",
        "..KKK.....KpPK..",
        ".KpPPKK...KpPK..",
        "..KKKCCKKKKCCK..",
        ".KPPPPPPPPPPPPK.",
        ".KPPPPPPPPPPPPK.",
        ".KpCCCCCCCCCCpK.",
        ".KHhHHHhHHHhHHK.",
        ".KHmHHHmHHHmHHK.",
        ".KHmHHHmHHHmHHK.",
        ".KHHHHHHHHHHHHK.",
        ".KHmHHHmHHHmHHK.",
        ".KHmHHHmHHHmHHK.",
        "..KHHHHHHHHHHK..",
    ],
    "lado": [
        "......KK........",
        ".....KPPK.......",
        ".....KPpK..KKK..",
        ".....KPpKKKPPpK.",
        "....KKCCKCCKKK..",
        "...KPPPPPPPPPK..",
        "..KPPPPPPPPPPPK.",
        "..KCCCPPPPPPpPK.",
        ".KCHHHCPPPPPPK..",
        ".KSSHHHCPPPPK...",
        ".KSSSHHHCCPK....",
        ".KSESSHHmHHHK...",
        "KSSESSrHHmHHK...",
        ".KSSSSsHHmHHK...",
        "..KcSSsKHHHHK...",
    ],
}

DIRECOES = ["baixo", "cima", "lado"]

# o SENSOR da LARA (tipo um FreeStyle Libre): o disquinho branco atrás do
# braço, perto do ombro. Quadro a quadro, porque o braço balança no andar:
# (direção, coluna) -> (x, y) dentro do quadro de 16x32
SENSOR_LARA = {
    ("baixo", 0): (11, 24), ("baixo", 1): (10, 25), ("baixo", 2): (11, 24), ("baixo", 3): (11, 24),
    # de costas o braço esquerdo fica do outro lado da tela: o mesmo lugar no corpo é pra direita
    ("cima", 0): (3, 24), ("cima", 1): (3, 24), ("cima", 2): (3, 24), ("cima", 3): (3, 25),
    ("lado", 0): (6, 24), ("lado", 1): (4, 25), ("lado", 2): (6, 24), ("lado", 3): (7, 25),
}


def troca(p, tabela):
    return tabela.get(p[:3], p[:3]) + (p[3],)


def folha(origem, cabecas, roupa, topo, corpo, pixels=None):
    """`topo`: a linha da primeira fileira da cabeça; `corpo[dir]`: a linha
    em que o corpo do FireRed começa (dali pra cima ele some)."""
    base = Image.open(os.path.join(OW, origem)).convert("RGBA")
    out = Image.new("RGBA", (64, 96), (0, 0, 0, 0))
    for r, d in enumerate(DIRECOES):
        cab = cabecas[d]
        for c in range(4):
            desce = c % 2
            q = Image.new("RGBA", (16, 32), (0, 0, 0, 0))
            for y in range(corpo[d] + desce, 32):
                for x in range(16):
                    p = base.getpixel((c * 16 + x, r * 32 + y))
                    if p[3]:
                        q.putpixel((x, y), troca(p, roupa))
            for y, linha in enumerate(cab):
                assert len(linha) == 16, (d, linha)
                for x, ch in enumerate(linha):
                    yy = topo + desce + y
                    if ch != "." and yy < 32:
                        q.putpixel((x, yy), PAL[ch] + (255,))
            if pixels and (d, c) in pixels:
                q.putpixel(pixels[(d, c)], (255, 255, 255, 255))
            out.alpha_composite(q, (c * 16, r * 32))
    return out


def main():
    caio = folha("hero.png", CAIO, CAIO_ROUPA, 11, {"baixo": 23, "cima": 23, "lado": 23})
    lara = folha("heroina.png", LARA, LARA_ROUPA, 9, {"baixo": 24, "cima": 24, "lado": 24},
                 SENSOR_LARA)
    for img, nome in [(caio, "hero_brag.png"), (lara, "heroina_brag.png")]:
        img.save(os.path.join(OW, nome))
        print("ok:", nome)


if __name__ == "__main__":
    main()
