#!/usr/bin/env python3
"""Monta as peças do SPINDA: o sprite SEM MANCHAS e a tabela das manchas.

    python3 tools/fetch_spinda.py

O SPINDA não tem um sprite — ele tem quatro bilhões. As manchas não fazem parte
do desenho: elas são carimbadas na hora, e ONDE cada uma cai sai do valor de
personalidade do bicho. Por isso o sprite que a PokeAPI entrega (e que estava em
assets/sprites/pokemon/327.png) não serve: ele já vem com as manchas de UM
Spinda assadas dentro, e todo Spinda do jogo sairia idêntico àquele.

Esta ferramenta pega do decomp:
  - o sprite LIMPO (pret/pokefirered, graphics/pokemon/spinda/front.png), que é
    o Spinda sem mancha nenhuma, porque no jogo original elas são desenhadas por
    cima em tempo de execução;
  - as paletas normal e shiny do mesmo lugar (o shiny do Spinda tem o corpo da
    MESMA cor — o que muda é só a rampa das manchas e das patas, que vai de
    laranja pra verde);
  - os quatro moldes de mancha (graphics/spinda_spots/spot_N.bin), 16x16 em um
    bit por pixel, que é exatamente o que o jogo carimba.

E escreve:
  - assets/sprites/pokemon/327.png        o Spinda limpo, em RGBA
  - assets/sprites/pokemon/shiny/327.png  o mesmo, na paleta shiny
  - src/data/spinda.js                    moldes, âncoras e as duas rampas

Só stdlib. A arte é da Nintendo / Creatures / Game Freak.
"""
import os
import struct
import sys
import urllib.request

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from png_io import read_png, write_png                       # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FR = "https://raw.githubusercontent.com/pret/pokefirered/master"
ARQUIVOS = {
    "front.png": f"{FR}/graphics/pokemon/spinda/front.png",
    "normal.pal": f"{FR}/graphics/pokemon/spinda/normal.pal",
    "shiny.pal": f"{FR}/graphics/pokemon/spinda/shiny.pal",
    "back.png": f"{FR}/graphics/pokemon/spinda/back.png",
    **{f"spot_{i}.bin": f"{FR}/graphics/spinda_spots/spot_{i}.bin" for i in range(4)},
}
# As âncoras de cada mancha, de sSpindaSpotGraphics (src/pokemon.c do decomp).
ANCORAS = [(16, 7), (40, 8), (22, 25), (34, 26)]


def baixar(destino):
    os.makedirs(destino, exist_ok=True)
    for nome, url in ARQUIVOS.items():
        alvo = os.path.join(destino, nome)
        if os.path.exists(alvo):
            continue
        req = urllib.request.Request(url, headers={"User-Agent": "pokemon-glitch-edition/1.0"})
        with urllib.request.urlopen(req, timeout=30) as r:
            open(alvo, "wb").write(r.read())
        print(f"  baixado {nome}")


def ler_pal(caminho):
    """JASC-PAL -> lista de 16 (r, g, b)."""
    linhas = [l for l in open(caminho).read().split("\n")[3:] if l.strip()]
    return [tuple(int(v) for v in l.split()) for l in linhas]


def main():
    tmp = os.path.join(ROOT, "assets", "sprites", ".cache", "spinda")
    print("baixando do decomp...")
    baixar(tmp)

    normal = ler_pal(os.path.join(tmp, "normal.pal"))
    shiny = ler_pal(os.path.join(tmp, "shiny.pal"))
    w, h, px = read_png(os.path.join(tmp, "front.png"))
    assert (w, h) == (64, 64), f"esperava 64x64, veio {w}x{h}"

    # o PNG vem indexado; read_png já resolveu pra RGBA, então voltamos ao
    # índice comparando com a paleta (a arte é de cor chapada, bate exato)
    por_cor = {c: i for i, c in enumerate(normal)}
    indices = []
    for p in range(0, len(px), 4):
        cor = (px[p], px[p + 1], px[p + 2])
        if cor not in por_cor:
            raise SystemExit(f"cor {cor} fora da paleta do SPINDA — o decomp mudou?")
        indices.append(por_cor[cor])

    def gravar(caminho, pal):
        saida = bytearray(w * h * 4)
        for k, i in enumerate(indices):
            r, g, b = pal[i]
            # o índice 0 é o verde de fundo do decomp: aqui vira transparente
            saida[k * 4:k * 4 + 4] = bytes((r, g, b, 0 if i == 0 else 255))
        os.makedirs(os.path.dirname(caminho), exist_ok=True)
        write_png(caminho, w, h, saida)
        print(f"  {os.path.relpath(caminho, ROOT)}")

    saida_png = os.path.join(ROOT, "assets", "sprites", "pokemon")
    print("gravando o sprite limpo...")
    gravar(os.path.join(saida_png, "327.png"), normal)
    gravar(os.path.join(saida_png, "shiny", "327.png"), shiny)

    # AS COSTAS: no jogo original o carimbo só vale pro sprite de frente, e o de
    # costas tem UMA mancha fixa já desenhada. Então aqui as costas não ganham
    # tabela — só a versão shiny do mesmo desenho, senão um SPINDA shiny de
    # costas cairia no filtro de cor genérico e sairia com a cor errada.
    wb, hb, pxb = read_png(os.path.join(tmp, "back.png"))
    ib = []
    for p in range(0, len(pxb), 4):
        cor = (pxb[p], pxb[p + 1], pxb[p + 2])
        if cor not in por_cor:
            raise SystemExit(f"cor {cor} fora da paleta (costas) — o decomp mudou?")
        ib.append(por_cor[cor])
    saida = bytearray(wb * hb * 4)
    for k, i in enumerate(ib):
        r, g, b = shiny[i]
        saida[k * 4:k * 4 + 4] = bytes((r, g, b, 0 if i == 0 else 255))
    alvo = os.path.join(saida_png, "shiny", "back", "327.png")
    os.makedirs(os.path.dirname(alvo), exist_ok=True)
    write_png(alvo, wb, hb, saida)
    print(f"  {os.path.relpath(alvo, ROOT)}")

    moldes = []
    for i in range(4):
        dados = open(os.path.join(tmp, f"spot_{i}.bin"), "rb").read()
        moldes.append(list(struct.unpack("<16H", dados)))

    hexa = lambda c: "#%02x%02x%02x" % c                         # noqa: E731
    corpo = [hexa(normal[i]) for i in (1, 2, 3)]
    m_comum = [hexa(normal[i]) for i in (5, 6, 7)]
    m_shiny = [hexa(shiny[i]) for i in (5, 6, 7)]

    linhas = []
    for i, (x, y) in enumerate(ANCORAS):
        bits = ", ".join(f"0x{v:04x}" for v in moldes[i])
        linhas.append(f"  {{ x: {x}, y: {y}, linhas: [{bits}] }},")
    tabela = "\n".join(linhas)

    js = f'''// O SPINDA: o Pokémon que não tem um sprite, e sim 4.294.967.296.
//
// GERADO POR tools/fetch_spinda.py a partir do decomp (pret/pokefirered).
// Não edite à mão: rode a ferramenta de novo.
//
// COMO FUNCIONA, que é igualzinho ao dos jogos de verdade (DrawSpindaSpots, em
// src/pokemon.c do decomp): o desenho do SPINDA é LIMPO, sem mancha nenhuma —
// é o 327.png daqui. As quatro manchas são carimbadas por cima na hora de
// desenhar, e a posição de cada uma sai do VALOR DE PERSONALIDADE do bicho:
//
//   os 32 bits da personalidade são lidos de 8 em 8, um naco por mancha;
//   de cada naco, o nibble BAIXO é o deslocamento X e o ALTO é o Y;
//   cada deslocamento vale de 0 a 15 e entra como `âncora + nibble - 8`,
//   ou seja a mancha anda de -8 a +7 em volta da âncora dela.
//
//   4 manchas x 8 bits = 32 bits = 4.294.967.296 combinações.
//
// O carimbo respeita o corpo: um pixel da mancha só pinta se o pixel que está
// embaixo for uma das TRÊS cores claras do corpo (`CORPO` aqui embaixo). É o
// que faz a mancha parar na borda da orelha em vez de vazar pro contorno, pro
// olho ou pras patas. A cor que entra é a da mesma posição em `MANCHA`.
//
// O SHINY do SPINDA tem o corpo da MESMA cor: o que muda é a rampa das manchas
// (e a das patas, que já vem pronta em shiny/327.png).
//
// As COSTAS não têm mancha sorteada — no jogo original o carimbo só vale pro
// sprite de frente, e o de costas tem uma mancha fixa desenhada. É por isso que
// só existe tabela pra frente aqui.

/** Os quatro moldes, 16x16. Cada `linhas[i]` é uma fileira de 16 bits, e o bit
 *  MENOS significativo é a coluna da esquerda. `x`/`y` são a âncora. */
export const SPINDA_MANCHAS = [
{tabela}
];

/** As três cores claras do corpo que aceitam mancha (índices 1, 2 e 3 da
 *  paleta do decomp). Quem não for uma destas não recebe carimbo. */
export const SPINDA_CORPO = {corpo!r};

/** A cor que cada uma das três vira quando é mancha (índices 5, 6 e 7). */
export const SPINDA_MANCHA = {{
  comum: {m_comum!r},
  shiny: {m_shiny!r},
}};
'''.replace("'", '"')

    destino_js = os.path.join(ROOT, "src", "data", "spinda.js")
    open(destino_js, "w", encoding="utf-8").write(js)
    print(f"  {os.path.relpath(destino_js, ROOT)}")
    print(f"\n4 moldes, âncoras {ANCORAS}")
    print(f"corpo {corpo} -> mancha {m_comum} (comum) / {m_shiny} (shiny)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
