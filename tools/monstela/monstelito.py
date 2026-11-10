#!/usr/bin/env python3
"""MONSTELITO: a pré-evolução da MONSTELA (criada pelo CAIO).

A MONSTELA é uma TV grande em cima de um corpo preto com mãos amarelas de garra.
O MONSTELITO é a TV PORTÁTIL que ela foi antes: uma telinha de pilha, com duas
antenas, o mesmo rosto de pontinhos azuis (só que de filhote: olhão e boquinha),
três botões do lado e um corpinho preto curto, de garrinhas amarelas.

O desenho é feito aqui com as MESMAS cores-código do desenho da MONSTELA e passa
pelo MESMO acabamento (tools/monstela/sprite.py): o preto vira contorno + volume,
a tela vira vidro de TV com linhas e reflexo, e o SHINY é o dela (rosto branco,
o preto vira azul-claro). Assim os dois parecem da mesma família.

    python3 tools/monstela/monstelito.py
"""
import os
import sys

from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import sprite as monstela  # o acabamento e as paletas da MONSTELA

ROOT = monstela.ROOT
DEX = 1129

PRETO, AZUL, AMARELO, VERDE = monstela.PRETO, monstela.AZUL_ROSTO, monstela.AMARELO, monstela.VERDE_SUPORTE
BOTOES = [(224, 27, 36), (246, 211, 45), (26, 95, 180)]   # as cores dos botões da MONSTELA

# a TELA do MONSTELITO (x0, y0, x1, y1, incluídos): a moldura em volta é preta
TELA = (35, 41, 57, 59)


def desenho():
    im = Image.new("RGBA", (96, 96), (0, 0, 0, 0))
    px = im.load()

    def ret(x0, y0, x1, y1, cor):
        for y in range(y0, y1 + 1):
            for x in range(x0, x1 + 1):
                px[x, y] = cor + (255,)

    # as ANTENAS: duas varetas em V, com a bolinha na ponta
    for k in range(9):
        px[44 - k, 37 - k] = PRETO + (255,)
        px[45 - k, 37 - k] = PRETO + (255,)
        px[51 + k, 37 - k] = PRETO + (255,)
        px[52 + k, 37 - k] = PRETO + (255,)
    ret(33, 26, 36, 29, PRETO)
    ret(60, 26, 63, 29, PRETO)

    # a TV PORTÁTIL: a caixa (cantos arredondados) com a tela e a coluna dos botões
    ret(32, 38, 64, 62, PRETO)
    for x, y in ((32, 38), (64, 38), (32, 62), (64, 62)):
        px[x, y] = (0, 0, 0, 0)

    # os BOTÕES (3x3) na coluna da direita
    for i, cor in enumerate(BOTOES):
        ret(59, 42 + i * 5, 61, 44 + i * 5, cor)

    # o ROSTO de pontinhos (blocos 3x3, como o da MONSTELA): dois olhos 2x2 e a boquinha
    for ox in (37, 49):
        for dx in (0, 4):
            for dy in (0, 4):
                ret(ox + dx, 44 + dy, ox + dx + 2, 46 + dy, AZUL)
    for x, y in ((41, 54), (45, 55), (49, 54)):
        ret(x, y, x + 2, y + 2, AZUL)

    # o SUPORTE verde (o "pescoço" da TV), como o da MONSTELA
    ret(44, 63, 52, 64, VERDE)
    ret(45, 65, 51, 65, VERDE)

    # o CORPINHO preto, curto e redondo
    for y in range(65, 82):
        meia = 10 if 68 <= y <= 78 else (8 if y in (66, 67, 79, 80) else 6)
        ret(48 - meia, y, 48 + meia, y, PRETO)
    # as GARRINHAS amarelas, uma de cada lado
    ret(34, 69, 37, 72, AMARELO); px[33, 70] = AMARELO + (255,); px[33, 72] = AMARELO + (255,)
    ret(59, 69, 62, 72, AMARELO); px[63, 70] = AMARELO + (255,); px[63, 72] = AMARELO + (255,)
    # os PEZINHOS
    ret(40, 82, 45, 85, PRETO)
    ret(51, 82, 56, 85, PRETO)
    return im


if __name__ == "__main__":
    base = desenho()
    monstela.TELA = TELA            # o acabamento olha a tela pela constante do módulo
    comum = monstela.acabamento(base, monstela.NORMAL)
    brilho = monstela.acabamento(base, monstela.SHINY)
    comum.save(os.path.join(ROOT, "assets", "sprites", "pokemon", f"{DEX}.png"))
    os.makedirs(os.path.join(ROOT, "assets", "sprites", "pokemon", "shiny"), exist_ok=True)
    brilho.save(os.path.join(ROOT, "assets", "sprites", "pokemon", "shiny", f"{DEX}.png"))
    # a prévia: o desenho, o acabamento, o shiny e a MONSTELA do lado (a evolução)
    mon = Image.open(os.path.join(ROOT, "assets", "sprites", "pokemon", "1104.png")).convert("RGBA")
    prev = Image.new("RGBA", (104 * 4, 96), (52, 56, 66, 255))
    for i, im in enumerate((base, comum, brilho, mon)):
        prev.alpha_composite(im, (i * 104, 0))
    prev.resize((prev.width * 3, prev.height * 3), Image.NEAREST).save(os.environ.get("PREVIA", "/tmp/monstelito_prev.png"))
    print(f"MONSTELITO -> assets/sprites/pokemon/{DEX}.png (+ shiny)")

    # a PEDRA DO TROVÃO ASSOMBRADA (o item que evolui ele): a pedra do trovão de
    # sempre, com o verde virado roxo de fantasma e o raio no azul-claro do rosto
    ICONES = os.path.join(ROOT, "assets", "sprites", "itens")
    pedra = Image.open(os.path.join(ICONES, "pedra-do-trovao.png")).convert("RGBA")
    troca = {(104, 200, 112): (112, 84, 160), (73, 140, 78): (70, 50, 112),
             (157, 219, 162): (196, 176, 236), (248, 224, 48): (176, 210, 255)}
    pp = pedra.load()
    for y in range(pedra.height):
        for x in range(pedra.width):
            c = pp[x, y]
            if c[3] and c[:3] in troca:
                pp[x, y] = troca[c[:3]] + (c[3],)
    pedra.save(os.path.join(ICONES, "pedra-do-trovao-assombrada.png"))
    print("PEDRA DO TROVÃO ASSOMBRADA -> assets/sprites/itens/pedra-do-trovao-assombrada.png")
