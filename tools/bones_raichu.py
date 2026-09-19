"""OS RAICHU DE BONÉ: monta o sprite de cada um a partir do RAICHU + o boné
recortado do PIKACHU DE BONÉ correspondente.

Boné de RAICHU não existe em jogo nenhum, então não tem sprite na PokeAPI pra
baixar: aqui a gente RECORTA o boné do sprite do Pikachu e COLA na cabeça do
Raichu. Os oito sprites de boné são o mesmo desenho (só o boné muda). De frente
o Raichu olha pro outro lado, então o boné vai espelhado.

Dois recortes, porque foram testados no jogo e cada um serviu pra um bicho:

  SEM ABA (os sete no RAICHU de Kanto) — o boné é o conjunto de pixels em que
  os oito sprites diferem, mais o que gruda nisso e não é pele amarela, numa
  janela apertada. A aba fica de fora. Tentamos com ela, inteira e depois
  curta, e no mapa (o sprite em 28x28) uma aba escura do lado da cabeça virava
  uma mancha preta; sem ela o Raichu lê como Raichu de boné, que é o objetivo.

  COM ABA (o PIKA ALOLA, que evolui pra RAICHU-ALOLA) — uma janela em volta do
  boné inteiro, menos as cores do Pikachu e menos os olhos, com o buraco que a
  orelha deixa na aba preenchido e uma linha de sombra embaixo. O RAICHU-ALOLA
  é 96x96 e olha de frente: a cabeça é grande o bastante pra aba caber.

    python3 tools/bones_raichu.py          # escreve assets/sprites/pokemon/2xxxx.png (+ back/)
    python3 tools/bones_raichu.py --folha  # e uma folha de contato em dev/captures/ pra conferir

Os números de arquivo são os do Pikachu de boné + 10000 (ver src/data/bones.js).

E OS PICHU DE BONÉ (+ 20000): o mesmo recorte sem aba, colado no PICHU — o
boné fica grande demais pra cabeça dele, que é a graça. As ORELHAS ficam na
frente do boné (elas são a metade do Pichu): depois de colar, os pixels das
duas caixas de orelha são redesenhados por cima. Nascem de ovo, na creche
(src/systems/creche.js).
"""
import os
import sys
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SPR = os.path.join(ROOT, "assets", "sprites", "pokemon")
BONES = [10094, 10095, 10096, 10097, 10098, 10099, 10148, 10160]
SALTO = 10000
ALOLA = 10099          # o boné de ALOLA vai no RAICHU-ALOLA, não no RAICHU
RAICHU = {"base": "026", "tam": 64}
RAICHU_ALOLA = {"base": "10100", "tam": 96}
PICHU = {"base": "172", "tam": 64}
PICHU_SALTO = 20000

# cores do Pikachu que NÃO são boné (amarelo, sombra laranja, contorno marrom)
PELE = {(247, 230, 82), (247, 189, 33), (156, 82, 0)}
ABA = (82, 82, 90)          # o cinza da aba
ABA_CLARA = (118, 118, 128)  # o preenchimento onde a orelha estava: mais claro, senão vira um borrão
BORDA_ABA = (41, 41, 41)     # a linha de baixo da aba

# O RECORTE, por lado: a janela (x0, y0, x1, y1) inclusiva, as caixas que
# ficam de fora (os olhos, a ponta da orelha que atravessa o boné) e a caixa da
# aba, onde o buraco da orelha é preenchido. Medido no sprite 10094.
RECORTE = {
    "": {
        "janela": (31, 27, 59, 40),
        "fora": [(35, 38, 38, 41), (44, 38, 59, 41)],     # olho esquerdo, olho direito
        "aba": (48, 33, 59, 36),                           # a orelha passa na frente daqui
    },
    "back": {
        "janela": (43, 27, 63, 39),
        "fora": [],
        "orelha": (45, 33, 50, 37),                        # a ponta da orelha: vira boné
    },
}

# ONDE O BONÉ CAI: (x, y) do canto superior esquerdo do recorte no sprite do
# Raichu, e se vai espelhado. Ajustado no olho, com a folha de contato: de
# frente a aba fica dois pixels acima do olho; de costas o boné senta na coroa,
# entre as orelhas.
POSICAO = {
    ("", "026"):     {"pos": (18, 8),  "espelha": True},      # recorte SEM ABA
    ("back", "026"): {"pos": (18, 9),  "espelha": False},
    ("", "10100"):     {"pos": (34, 13), "espelha": True},    # recorte COM ABA
    ("back", "10100"): {"pos": (36, 21), "espelha": False},
    # PICHU: sem aba, sem espelhar; `orelhas` são as caixas (x0, y0, x1, y1)
    # que voltam por cima do boné
    ("", "172"):       {"pos": (21, 10), "espelha": False, "orelhas": [(20, 13, 29, 23), (36, 15, 47, 24)]},
    ("back", "172"):   {"pos": (20, 14), "espelha": False, "orelhas": [(14, 13, 25, 30), (40, 16, 49, 33)]},
}


def pele(p):
    """amarelo do Pikachu (com as sombras alaranjadas): o que NÃO é boné"""
    r, g, b, a = p
    return a > 8 and r > 185 and g > 140 and b < 140


def recorte_sem_aba(lado):
    """O boné de cada Pikachu SEM a aba: tudo que difere entre os oito sprites,
    mais o que encosta nisso e não é pele, numa janela de 2 pixels em volta."""
    ims = {n: Image.open(os.path.join(SPR, lado, f"{n}.png")).convert("RGBA") for n in BONES}
    w, h = ims[BONES[0]].size
    px = {n: ims[n].load() for n in BONES}
    seeds = set()
    for y in range(h):
        for x in range(w):
            if len({px[n][x, y] for n in BONES}) > 1:
                seeds.add((x, y))
    x0 = min(x for x, _ in seeds) - 2
    x1 = max(x for x, _ in seeds) + 2
    y0 = min(y for _, y in seeds) - 2
    y1 = max(y for _, y in seeds) + 2
    ref = px[BONES[0]]
    mask = set(seeds)
    fila = list(seeds)
    while fila:
        x, y = fila.pop()
        for dx in (-1, 0, 1):
            for dy in (-1, 0, 1):
                nx, ny = x + dx, y + dy
                if (nx, ny) in mask or not (x0 <= nx <= x1 and y0 <= ny <= y1):
                    continue
                if ref[nx, ny][3] > 8 and not pele(ref[nx, ny]):
                    mask.add((nx, ny))
                    fila.append((nx, ny))
    out = {}
    for n in BONES:
        im = Image.new("RGBA", (x1 - x0 + 1, y1 - y0 + 1), (0, 0, 0, 0))
        o = im.load()
        for (x, y) in mask:
            o[x - x0, y - y0] = px[n][x, y]
        out[n] = im
    return out


def dentro(x, y, caixa):
    x0, y0, x1, y1 = caixa
    return x0 <= x <= x1 and y0 <= y <= y1


def recorte(lado):
    """O boné de cada Pikachu, como imagem RGBA só do tamanho da janela."""
    R = RECORTE[lado]
    x0, y0, x1, y1 = R["janela"]
    out = {}
    for n in BONES:
        src = Image.open(os.path.join(SPR, lado, f"{n}.png")).convert("RGBA")
        px = src.load()
        im = Image.new("RGBA", (x1 - x0 + 1, y1 - y0 + 1), (0, 0, 0, 0))
        o = im.load()
        for y in range(y0, y1 + 1):
            for x in range(x0, x1 + 1):
                p = px[x, y]
                if p[3] < 8 or any(dentro(x, y, c) for c in R["fora"]):
                    continue
                if "orelha" in R and dentro(x, y, R["orelha"]):
                    o[x - x0, y - y0] = (186, 27, 27, 255)      # o vermelho do boné
                    continue
                if p[:3] in PELE:
                    continue
                o[x - x0, y - y0] = p
        if "aba" in R:
            # a orelha na frente da aba: onde tinha pele, agora tem aba — e a
            # linha de baixo da aba ganha contorno, que ela perdeu junto
            ax0, ay0, ax1, ay1 = R["aba"]
            for y in range(ay0, ay1 + 1):
                for x in range(ax0, ax1 + 1):
                    if px[x, y][3] > 8 and px[x, y][:3] in PELE and o[x - x0, y - y0][3] == 0:
                        o[x - x0, y - y0] = ABA_CLARA + (255,)
            for x in range(ax0, ax1 + 1):
                if o[x - x0, ay1 - y0][3] and o[x - x0, ay1 - y0][:3] == ABA_CLARA and ay1 + 1 <= y1:
                    if o[x - x0, ay1 + 1 - y0][3] == 0:
                        o[x - x0, ay1 + 1 - y0] = BORDA_ABA + (255,)

        out[n] = im
    return out


def sombra(im, cap, pos):
    """uma linha escurecida no Raichu logo abaixo do boné"""
    px = im.load()
    cp = cap.load()
    ox, oy = pos
    for cx in range(cap.width):
        baixo = None
        for cy in range(cap.height):
            if cp[cx, cy][3] > 8:
                baixo = cy
        if baixo is None:
            continue
        x, y = ox + cx, oy + baixo + 1
        if 0 <= x < im.width and 0 <= y < im.height and px[x, y][3] > 8:
            r, g, b, a = px[x, y]
            px[x, y] = (int(r * 0.72), int(g * 0.72), int(b * 0.72), a)


def montar(lado):
    com_aba = recorte(lado)
    sem_aba = recorte_sem_aba(lado)
    feitos = {}
    for n in BONES:
        alola = n == ALOLA
        cap = (com_aba if alola else sem_aba)[n]
        alvo = RAICHU_ALOLA if alola else RAICHU
        ajuste = POSICAO[(lado, alvo["base"])]
        base = Image.open(os.path.join(SPR, lado, f"{alvo['base']}.png")).convert("RGBA")
        if ajuste["espelha"]:
            cap = cap.transpose(Image.FLIP_LEFT_RIGHT)
        im = base.copy()
        if alola:
            sombra(im, cap, ajuste["pos"])
        im.paste(cap, ajuste["pos"], cap)
        im.save(os.path.join(SPR, lado, f"{n + SALTO}.png"))
        feitos[n + SALTO] = im
    # os PICHU: o recorte sem aba de cada boné, no Pichu
    for n in BONES:
        cap = sem_aba[n]
        ajuste = POSICAO[(lado, PICHU["base"])]
        base = Image.open(os.path.join(SPR, lado, f"{PICHU['base']}.png")).convert("RGBA")
        if ajuste["espelha"]:
            cap = cap.transpose(Image.FLIP_LEFT_RIGHT)
        im = base.copy()
        im.paste(cap, ajuste["pos"], cap)
        # as orelhas na frente do boné
        bp, ip = base.load(), im.load()
        for (x0, y0, x1, y1) in ajuste.get("orelhas", []):
            for y in range(y0, y1 + 1):
                for x in range(x0, x1 + 1):
                    if bp[x, y][3] > 8:
                        ip[x, y] = bp[x, y]
        im.save(os.path.join(SPR, lado, f"{n + PICHU_SALTO}.png"))
        feitos[n + PICHU_SALTO] = im
    return feitos


def folha(frentes, costas):
    k = 3
    cel = 96 * k
    out = Image.new("RGBA", (cel * len(frentes), cel * 2), (28, 26, 36, 255))
    for i, (n, im) in enumerate(sorted(frentes.items())):
        r = im.resize((im.width * k, im.height * k), Image.NEAREST); out.paste(r, (i * cel, 0), r)
        c = costas[n]
        r = c.resize((c.width * k, c.height * k), Image.NEAREST); out.paste(r, (i * cel, cel), r)
    dest = os.path.join(ROOT, "dev", "captures", "raichu-bones.png")
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    out.save(dest)
    print("folha em", dest)


if __name__ == "__main__":
    f = montar("")
    c = montar("back")
    print("escritos:", ", ".join(str(n) for n in sorted(f)), "(+ back/)")
    if "--folha" in sys.argv:
        folha(f, c)
