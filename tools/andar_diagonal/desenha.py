"""O JOGADOR NA DIAGONAL (pedido do CAIO, nov/2026: "só funde o de lado e de
frente e ajeita"): cada quadro é a FUSÃO do boneco de lado (a metade da esquerda)
com o de frente, ou o de costas (a metade da direita) na CABEÇA, com o corpo do de frente
(ou de costas); e depois a emenda é ajeitada: o que ficou sem contorno ganha contorno, e pixel solto sai.
Folha: 3 colunas (parado, passo A, passo B) x 2 linhas (baixo, cima), de 16x32;
olha pra esquerda (a direita é o espelho).
python3 tools/andar_diagonal/desenha.py [prévia.png] -> assets/sprites/overworld/diagonal/<nome>.png"""
import os, sys
from PIL import Image
RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OW = os.path.join(RAIZ, "assets/sprites/overworld")
FRENTE, COSTAS, LADO = 0, 1, 2          # as linhas da folha de andar
EMENDA = 8                              # até aqui é o de lado; daqui pra frente, o de frente
PRETO = (0, 0, 0, 255)

def quadro(folha, col, linha):
    return folha.crop((col * 16, linha * 32, col * 16 + 16, linha * 32 + 32))

def cheio(im, x, y):
    return 0 <= x < 16 and 0 <= y < 32 and im.getpixel((x, y))[3] > 0

def fundir(lado, outro, pescoco, EMENDA=EMENDA):
    im = Image.new("RGBA", (16, 32), (0, 0, 0, 0))
    # a CABEÇA é a fusão; o CORPO (do pescoço pra baixo) é o de frente inteiro, um
    # pixel pra esquerda: fundido ele ficava picotado, com duas pernas diferentes
    for y in range(pescoco):
        for x in range(16):
            im.putpixel((x, y), (lado if x < EMENDA else outro).getpixel((x, y)))
    for y in range(pescoco, 32):
        for x in range(1, 16):
            im.putpixel((x - 1, y), outro.getpixel((x, y)))
    # AJEITA 1: buraco na emenda (um lado tem pixel e o outro não): tapa com o vizinho
    for y in range(1, 31):
        for x in (EMENDA - 1, EMENDA):
            if not cheio(im, x, y) and cheio(im, x - 1, y) and cheio(im, x + 1, y):
                im.putpixel((x, y), im.getpixel((x - 1, y)))
    # AJEITA 2: pixel solto, sem vizinho nenhum, sai
    for y in range(32):
        for x in range(16):
            if cheio(im, x, y) and not any(cheio(im, x + a, y + b) for a, b in ((1, 0), (-1, 0), (0, 1), (0, -1))):
                im.putpixel((x, y), (0, 0, 0, 0))
    # AJEITA 3: colorido encostado no vazio perto da emenda ganha contorno
    novo = im.copy()
    for y in range(32):
        for x in range(EMENDA - 3, EMENDA + 3):
            p = im.getpixel((x, y))
            if p[3] and p[:3] != (0, 0, 0) and any(not cheio(im, x + a, y + b) for a, b in ((0, 1), (0, -1))):
                novo.putpixel((x, y), PRETO)
    return novo

saidas = {}
for nome in ("hero", "heroina", "hero_brag", "heroina_brag"):
    folha = Image.open(os.path.join(OW, f"{nome}.png")).convert("RGBA")
    out = Image.new("RGBA", (48, 64), (0, 0, 0, 0))
    for r, outro in ((0, FRENTE), (1, COSTAS)):
        for k, col in ((0, 0), (1, 1), (2, 3)):
            # (nos passos a cabeça desce 1 pixel, e o pescoço junto)
            out.paste(fundir(quadro(folha, col, LADO), quadro(folha, col, outro), 23 + (1 if k else 0)), (k * 16, r * 32))
    out.save(os.path.join(OW, "diagonal", f"{nome}.png"))
    saidas[nome] = out
# O MENINO É O DO CAIO: ele desenhou o 1º quadro (base_caio.png), e os outros 5
# seguem o estilo dele. Passos: a cabeça dele 1 pixel mais baixa, com o corpo de
# andar. De costas: o boné dele redondo, com a parte branca e a faixa lá no alto, e o cabelo embaixo.
COR = {"a": (106,41,41), "b": (0,0,0), "c": (197,57,57), "d": (255,106,74), "e": (238,238,255), "f": (180,180,213), "g": (57,57,123), "h": (222,148,115), "j": (123,65,65)}
# (pedido do CAIO: o boné dele virado, "não é pra tanto": o formato redondo
# fica, e só a parte branca e a faixa sobem pro alto; embaixo, a alça e o cabelo)
COSTAS_CAIO = ["....abbbbbba....", "...acfffdddca...", "..acefdddddda...", ".aaeedddddddca..", "baceddddddddcb..", "bacddddddddccb..", "bcccccccccccab..", ".bcccccccccgbb..", "..jjjaaaggghjb..", "..jjjjjjjjjjjb..", "...bjjjjjjjjb..."]

# A MENINA, no mesmo estilo do menino do CAIO: chapéu grande, dois olhos puxados
# pra esquerda e o cabelo à direita; de costas, a faixa vermelha sobe pro alto
COR_M = {"a": (57,57,123), "b": (180,180,213), "c": (238,238,255), "d": (255,106,74), "e": (197,57,57), "f": (0,0,0), "g": (123,65,65),
         "h": (222,148,115), "i": (255,197,148), "k": (65,65,213), "n": (172,123,65)}
FRENTE_M = ["....aaaaaaaa....", "...abccccccba...", "...acccccccca...", "..abccccccccbf..", ".acbbccddccbbbf.", ".acbebebbebbbbf.",
            ".acbbeeeeeebbfgf", "..abbbbbbbbbagff", "..gaaaaaaaaaggnf", "..ghfiifiihgggf.", "...giiigiihggf.."]
COSTAS_M = ["....aaaaaaaa....", "...abeeecccba...", "...aeccccccca...", "..abccccccccbf..", ".acccccccccbbbf.", ".acccccccbbbbbf.",
            ".acbbbbbbbbbbfgf", "..abbbbbbbbbagff", "..gaaaaaaaakggnf", "..gggnnnnnnnggf.", "...gnnnnnnnnggf."]
assert all(len(l) == 16 for l in FRENTE_M + COSTAS_M + COSTAS_CAIO)

def cabeca_de(linhas, cores):
    im = Image.new("RGBA", (16, 32), (0, 0, 0, 0))
    for y, linha in enumerate(linhas):
        for x, ch in enumerate(linha):
            if ch != ".": im.putpixel((x, 12 + y), cores[ch] + (255,))
    return im

def boneco(folha, frente, costas, base=None):
    """os 6 quadros: `base` é o quadro inteiro já pronto (o do CAIO)"""
    out = Image.new("RGBA", (48, 64), (0, 0, 0, 0))
    for r, cabeca, linha in ((0, frente, FRENTE), (1, costas, COSTAS)):
        for k, col in ((0, 0), (1, 1), (2, 3)):
            if base is not None and r == 0 and k == 0:
                out.paste(base, (0, 0)); continue
            q = Image.new("RGBA", (16, 32), (0, 0, 0, 0))
            corpo = quadro(folha, col, linha)
            desce = 1 if k else 0
            for y in range(23 + desce, 32):
                for x in range(1, 16):
                    q.putpixel((x - 1, y), corpo.getpixel((x, y)))
            for y in range(12, 23):
                for x in range(16):
                    p = cabeca.getpixel((x, y))
                    if p[3]: q.putpixel((x, y + desce), p)
            out.paste(q, (k * 16, r * 32))
    return out

base = Image.open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "base_caio.png")).convert("RGBA")
hero = boneco(Image.open(os.path.join(OW, "hero.png")).convert("RGBA"), base, cabeca_de(COSTAS_CAIO, COR), base)
heroina = boneco(Image.open(os.path.join(OW, "heroina.png")).convert("RGBA"), cabeca_de(FRENTE_M, COR_M), cabeca_de(COSTAS_M, COR_M))
# O CAIO e a LARA têm cabeça própria (o cabelo dele, a tiara de orelhas dela): a
# cabeça olhando pra baixo é a FUSÃO do de lado com o de frente, e de costas é o
# quadro de costas deles, um pixel pra esquerda
def de_braglitch(nome):
    folha = Image.open(os.path.join(OW, f"{nome}.png")).convert("RGBA")
    out = Image.new("RGBA", (48, 64), (0, 0, 0, 0))
    for k, col in ((0, 0), (1, 1), (2, 3)):
        # (a LARA tem a franja de lado: a emenda fica antes dela, senão corta a cara)
        out.paste(fundir(quadro(folha, col, LADO), quadro(folha, col, FRENTE), 23 + (1 if k else 0), 3 if "heroina" in nome else EMENDA), (k * 16, 0))
        q = Image.new("RGBA", (16, 32), (0, 0, 0, 0))
        tras = quadro(folha, col, COSTAS)
        for y in range(32):
            for x in range(1, 16):
                q.putpixel((x - 1, y), tras.getpixel((x, y)))
        out.paste(q, (k * 16, 32))
    return out

saidas = {"hero": hero, "heroina": heroina, "hero_brag": de_braglitch("hero_brag"), "heroina_brag": de_braglitch("heroina_brag")}
for nome, im in saidas.items():
    im.save(os.path.join(OW, "diagonal", f"{nome}.png"))
if len(sys.argv) > 1:
    prev = Image.new("RGBA", (48 * 4 + 24, 56), (120, 170, 120, 255))
    for k, nome in enumerate(("hero", "heroina", "hero_brag", "heroina_brag")):
        prev.paste(saidas[nome].crop((0, 8, 48, 64)), (k * 56, 0), saidas[nome].crop((0, 8, 48, 64)))
    prev.resize((prev.width * 4, prev.height * 4), Image.NEAREST).save(sys.argv[1])
print("ok")
