"""OS PARADOXOS DA ÁREA ZERO (pedido do CAIO, nov/2026): cada um sai do
desenho do Pokémon de hoje (assets/sprites/pokemon/<dex>.png), pixel por pixel:

  1. AS CORES: cada cor do desenho original cai num "balde" pelo matiz dela
     (vermelho, laranja, amarelo, verde, azul, roxo, cinza, escuro) e vira a cor
     da RAMPA nova daquele balde, na mesma posição de claro/escuro. A sombra e
     a luz do desenho original continuam onde estavam.
  2. OS DETALHES:
     - do PASSADO: PELO. Em cada pixel da beirada de cima do corpo nasce um fio
       de 1 a 3 pixels pra cima (o tamanho sai de uma conta com x, então fica
       sempre igual), na cor de pelo, com o contorno em volta.
     - do FUTURO: PLACAS. Uma linha escura a cada N fileiras, só por dentro do
       corpo (as emendas do metal), e LUZES ciano em alguns pontos.
  3. O SHINY: a mesma coisa com as rampas do shiny.

Rodar: python3 tools/area_zero/paradoxo.py  (grava assets/sprites/pokemon/<nº>.png,
shiny/<nº>.png e a prévia /tmp/area_zero.png)
"""
import colorsys
import os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SPR = os.path.join(ROOT, "assets", "sprites", "pokemon")


def hexc(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def balde(c):
    r, g, b = (v / 255 for v in c)
    h, s, v = colorsys.rgb_to_hsv(r, g, b)
    if v < 0.2:
        return "escuro"
    if s < 0.16:
        return "cinza"
    d = h * 360
    if d < 18 or d >= 335:
        return "vermelho"
    if d < 42:
        return "laranja"
    if d < 70:
        return "amarelo"
    if d < 170:
        return "verde"
    if d < 255:
        return "azul"
    return "roxo"


def luz(c):
    return 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]


def recolorir(im, rampas):
    """im RGBA; rampas: balde -> [cores escuras..claras]. Balde sem rampa fica."""
    px = im.load()
    W, H = im.size
    cores = {}
    for y in range(H):
        for x in range(W):
            c = px[x, y]
            if c[3] > 0:
                cores.setdefault(balde(c[:3]), set()).add(c[:3])
    troca = {}
    for b, cs in cores.items():
        if b not in rampas:
            continue
        ordem = sorted(cs, key=luz)
        rampa = [hexc(h) for h in rampas[b]]
        for i, c in enumerate(ordem):
            k = 0 if len(ordem) == 1 else round(i * (len(rampa) - 1) / (len(ordem) - 1))
            troca[c] = rampa[k]
    out = im.copy()
    po = out.load()
    for y in range(H):
        for x in range(W):
            c = px[x, y]
            if c[3] > 0 and c[:3] in troca:
                po[x, y] = troca[c[:3]] + (255,)
    return out


def pelo(im, cor, contorno, de=0, ate=96, todo=1):
    """fios de pelo pra cima na beirada de cima do corpo (entre as colunas de..ate)"""
    px = im.load()
    W, H = im.size
    cheio = lambda x, y: 0 <= x < W and 0 <= y < H and px[x, y][3] > 0
    topo = []
    for x in range(max(1, de), min(W - 1, ate)):
        for y in range(1, H):
            if cheio(x, y) and not cheio(x, y - 1):
                topo.append((x, y))
    novos = {}
    for (x, y) in topo:
        if (x * 7 + y * 3) % todo:
            continue
        n = 1 + (x * 5 + y) % 3            # 1, 2 ou 3 pixels
        for k in range(1, n + 1):
            novos[(x, y - k)] = cor
    for (x, y), c in novos.items():
        if 0 <= y < H:
            px[x, y] = c + (255,)
    # o contorno em volta dos fios novos
    for (x, y) in novos:
        for dx, dy in ((1, 0), (-1, 0), (0, -1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < W and 0 <= ny < H and not cheio(nx, ny):
                px[nx, ny] = contorno + (255,)


def placas(im, cor, cada=7, desloca=0):
    """as emendas do metal: uma fileira escura a cada `cada`, só por dentro"""
    px = im.load()
    W, H = im.size
    cheio = lambda x, y: 0 <= x < W and 0 <= y < H and px[x, y][3] > 0
    for y in range(H):
        if (y + desloca) % cada:
            continue
        for x in range(W):
            if cheio(x, y) and cheio(x, y - 1) and cheio(x, y + 1) and cheio(x - 1, y) and cheio(x + 1, y) \
                    and luz(px[x, y][:3]) > 60:
                # a emenda é a MESMA cor um pouco mais escura (e a fileira de
                # baixo dela, um tiquinho mais clara: a beirada da placa)
                c = px[x, y]
                px[x, y] = tuple(int(v * 0.72) for v in c[:3]) + (255,)
                b = px[x, y + 1]
                if cheio(x, y + 2):
                    px[x, y + 1] = tuple(min(255, int(v * 1.12)) for v in b[:3]) + (255,)


def luzes(im, pontos, cor, brilho):
    """LUZES: cada ponto (x, y) vira uma luzinha 2x2 com o miolo claro"""
    px = im.load()
    for (x, y) in pontos:
        for dx in (0, 1):
            for dy in (0, 1):
                if px[x + dx, y + dy][3] > 0:
                    px[x + dx, y + dy] = cor + (255,)
        if px[x, y][3] > 0:
            px[x, y] = brilho + (255,)


def pontos_dentro(im, n, semente):
    """n pontos espalhados por dentro do corpo (sempre os mesmos pra mesma semente)"""
    px = im.load()
    W, H = im.size
    cheio = lambda x, y: 0 <= x < W and 0 <= y < H and px[x, y][3] > 0
    dentro = [(x, y) for y in range(2, H - 3) for x in range(2, W - 3)
              if all(cheio(x + dx, y + dy) for dx in (-1, 0, 1, 2) for dy in (-1, 0, 1, 2))]
    if not dentro:
        return []
    out, s = [], semente
    for _ in range(n * 6):
        s = (s * 1103515245 + 12345) & 0x7FFFFFFF
        p = dentro[s % len(dentro)]
        if all(abs(p[0] - q[0]) + abs(p[1] - q[1]) > 12 for q in out):
            out.append(p)
        if len(out) >= n:
            break
    return out


ESCURO_PASSADO = "#1c120c"
ESCURO_FUTURO = "#0c1218"

# cada um: (nº, de qual desenho, passado/futuro, rampas, rampas do shiny, cor do pelo / ajustes)
PARADOXOS = [
    dict(n=1118, de="890", era="passado", nome="giantdrake",
         rampas={"roxo": ["#24140e", "#3a2416", "#5a3a22", "#7a5634"], "azul": ["#24140e", "#3a2416", "#5a3a22"],
                 "vermelho": ["#2f5a18", "#4e8a24", "#7cc23a", "#b4f060"], "roxo2": [],
                 "escuro": [ESCURO_PASSADO]},
         shiny={"roxo": ["#2a2a14", "#46441e", "#6a662c", "#908a3c"], "azul": ["#2a2a14", "#46441e", "#6a662c"],
                "vermelho": ["#5a1830", "#8a2448", "#c23a6c", "#f060a0"], "escuro": [ESCURO_PASSADO]},
         pelo="#6a4a2c", pelo_shiny="#7a7434"),
    dict(n=1119, de="311", era="passado", nome="mathplus",
         rampas={"amarelo": ["#8a6a3a", "#b08a4e", "#d0ac6a", "#e8cc90"], "laranja": ["#8a6a3a", "#b08a4e", "#d0ac6a", "#e8cc90"],
                 "vermelho": ["#5a2a10", "#8a4218", "#b8642a", "#d88a44"], "escuro": [ESCURO_PASSADO]},
         shiny={"amarelo": ["#5a6a3a", "#7a8a4e", "#9aac6a", "#c0d090"], "laranja": ["#5a6a3a", "#7a8a4e", "#9aac6a", "#c0d090"],
                "vermelho": ["#4a2a5a", "#6a3a8a", "#9058b8", "#b888d8"], "escuro": [ESCURO_PASSADO]},
         pelo="#8a4a1c", pelo_shiny="#6a3a8a"),
    dict(n=1120, de="149", era="passado", nome="stonewings",
         rampas={"laranja": ["#3c3630", "#5c544a", "#7e7466", "#a09682"], "vermelho": ["#3c3630", "#5c544a", "#7e7466"],
                 "amarelo": ["#8a8270", "#aaa28c", "#cac2aa"], "verde": ["#1c3418", "#2c4c24", "#40683a", "#5a8a50"],
                 "escuro": [ESCURO_PASSADO]},
         shiny={"laranja": ["#3a2a3e", "#5a4460", "#7c6280", "#9e84a2"], "vermelho": ["#3a2a3e", "#5a4460", "#7c6280"],
                "amarelo": ["#8a7a90", "#aa9cb0", "#cabed0"], "verde": ["#3a2a10", "#5a4218", "#7a5c26", "#a07c38"],
                "escuro": [ESCURO_PASSADO]},
         pelo="#4a6a3a", pelo_shiny="#7a5c26"),
    dict(n=1121, de="448", era="passado", nome="shaggyfang",
         rampas={"azul": ["#1e1612", "#33261c", "#4a3826", "#644c34"], "amarelo": ["#3a3634", "#56504c", "#76706a"],
                 "cinza": ["#141010", "#241e1c", "#3a3230", "#5a524e"], "escuro": [ESCURO_PASSADO]},
         shiny={"azul": ["#1e1a26", "#2e2840", "#443a5e", "#5e5280"], "amarelo": ["#5a2a2a", "#7a3a3a", "#9a5050"],
                "cinza": ["#141010", "#241e1c", "#3a3230", "#5a524e"], "escuro": [ESCURO_PASSADO]},
         pelo="#3a2a1e", pelo_shiny="#3a3256"),
    dict(n=1122, de="143", era="passado", nome="giantbelly",
         rampas={"azul": ["#2a1a10", "#422a18", "#5e3e24", "#7a5634"], "verde": ["#2a1a10", "#422a18", "#5e3e24", "#7a5634"],
                 "amarelo": ["#8a7458", "#a88e6e", "#c4aa88", "#dcc6a4"], "laranja": ["#5a3a22", "#7a5434", "#9a6e4a"],
                 "cinza": ["#a89478", "#c4b094", "#e0ceb0"], "escuro": [ESCURO_PASSADO]},
         shiny={"azul": ["#3a3a3a", "#585858", "#787878", "#9a9a9a"], "verde": ["#3a3a3a", "#585858", "#787878", "#9a9a9a"],
                "amarelo": ["#8a6a6a", "#a88888", "#c4a6a6", "#dcc4c4"], "laranja": ["#5a3a3a", "#7a5454", "#9a6e6e"],
                "cinza": ["#a88888", "#c4a6a6", "#e0c4c4"], "escuro": [ESCURO_PASSADO]},
         pelo="#4e3220", pelo_shiny="#686868"),
    dict(n=1123, de="312", era="futuro", nome="mathminus",
         rampas={"amarelo": ["#6a7480", "#8c96a2", "#b0bac4", "#d4dce4"], "laranja": ["#6a7480", "#8c96a2", "#b0bac4", "#d4dce4"],
                 "azul": ["#0a5a7a", "#1290b8", "#38d0f0", "#9af4ff"], "escuro": [ESCURO_FUTURO]},
         shiny={"amarelo": ["#80703a", "#a2904e", "#c4b06a", "#e4d290"], "laranja": ["#80703a", "#a2904e", "#c4b06a", "#e4d290"],
                "azul": ["#7a1a5a", "#b82890", "#f050d0", "#ffa0f4"], "escuro": [ESCURO_FUTURO]},
         emenda="#4a525e", luz="#38d0f0", brilho="#eaffff", luz_shiny="#f050d0", nluzes=2, cada=9),
    dict(n=1124, de="006", era="futuro", nome="ironblaze",
         rampas={"laranja": ["#2e343c", "#454d58", "#606a78", "#7e8898", "#a0aab8"], "vermelho": ["#2e343c", "#454d58", "#606a78"],
                 "amarelo": ["#1290b8", "#38d0f0", "#9af4ff", "#eaffff"], "azul": ["#141a22", "#202834", "#2e3a4a", "#3e4e62"],
                 "escuro": [ESCURO_FUTURO]},
         shiny={"laranja": ["#3c2e2e", "#584545", "#786060", "#987e7e", "#b8a0a0"], "vermelho": ["#3c2e2e", "#584545", "#786060"],
                "amarelo": ["#b86a12", "#f0a038", "#ffd89a", "#fff4ea"], "azul": ["#221414", "#342020", "#4a2e2e", "#623e3e"],
                "escuro": [ESCURO_FUTURO]},
         emenda="#1c222a", luz="#38d0f0", brilho="#eaffff", luz_shiny="#f0a038", nluzes=4, cada=13),
    dict(n=1125, de="092", era="futuro", nome="ironghost",
         rampas={"roxo": ["#1a1e26", "#2a303c", "#3e4656", "#566072", "#76808e"], "azul": ["#1a1e26", "#2a303c", "#3e4656", "#566072"],
                 "vermelho": ["#38d0f0", "#9af4ff"], "cinza": ["#38d0f0", "#9af4ff", "#eaffff"], "escuro": [ESCURO_FUTURO]},
         shiny={"roxo": ["#261a1e", "#3c2a30", "#563e46", "#725660", "#8e7680"], "azul": ["#261a1e", "#3c2a30", "#563e46", "#725660"],
                "vermelho": ["#f0e038", "#fff89a"], "cinza": ["#f0e038", "#fff89a", "#ffffea"], "escuro": [ESCURO_FUTURO]},
         emenda="#10141a", luz="#38d0f0", brilho="#eaffff", luz_shiny="#f0e038", nluzes=3, cada=12),
    dict(n=1126, de="130", era="futuro", nome="ironscale",
         rampas={"azul": ["#1e2a36", "#2e3e50", "#44586e", "#5e7690", "#8098b0"], "amarelo": ["#8c96a2", "#b0bac4", "#d4dce4"],
                 "laranja": ["#8c96a2", "#b0bac4", "#d4dce4"], "cinza": ["#38d0f0", "#9af4ff", "#eaffff"],
                 "vermelho": ["#0c3a4a", "#12586e", "#1a7890"], "escuro": [ESCURO_FUTURO]},
         shiny={"azul": ["#36281e", "#503c2e", "#6e5644", "#90745e", "#b09680"], "amarelo": ["#a2968c", "#c4bab0", "#e4dcd4"],
                "laranja": ["#a2968c", "#c4bab0", "#e4dcd4"], "cinza": ["#f05038", "#ff9a8a", "#ffeaea"],
                "vermelho": ["#4a1a0c", "#6e2812", "#90381a"], "escuro": [ESCURO_FUTURO]},
         emenda="#141c26", luz="#38d0f0", brilho="#eaffff", luz_shiny="#f05038", nluzes=5, cada=12),
    dict(n=1127, de="150", era="futuro", nome="ironmind",
         rampas={"cinza": ["#4a525e", "#6a7480", "#8c96a2", "#b0bac4", "#d4dce4"], "roxo": ["#0a5a7a", "#1290b8", "#38d0f0", "#9af4ff"],
                 "azul": ["#4a525e", "#6a7480", "#8c96a2", "#b0bac4"], "escuro": [ESCURO_FUTURO]},
         shiny={"cinza": ["#5e564a", "#807468", "#a2968c", "#c4bab0", "#e4dcd4"], "roxo": ["#7a5a0a", "#b89012", "#f0d038", "#fff49a"],
                "azul": ["#5e564a", "#807468", "#a2968c", "#c4bab0"], "escuro": [ESCURO_FUTURO]},
         emenda="#343a44", luz="#38d0f0", brilho="#eaffff", luz_shiny="#f0d038", nluzes=3, cada=13),
]


# ---------------------------------------------------------------- IRON GHOST
# (o CAIO: "iron ghost vai ser inspirado em gastly", "sem antenas") — o GASTLY
# do futuro: a bola vira uma ESFERA DE METAL com a cara numa TELA de LED, e o
# gás em volta vira PLASMA, com raios saindo da bola. Desenhado pixel por pixel
# em cima do lugar da bola do GASTLY (centro 45,47, raio 13).
OLHO = [
    "cc.....",
    "cccc...",
    "ccbbcc.",
    "cbbbbcc",
    ".cccccc",
    "..cccc.",
]
BOCA = [
    "c...........c",
    "ccccccccccccc",
    ".c.c.c.c.c.c.",
]


def iron_ghost(shiny):
    base = Image.open(os.path.join(SPR, "092.png")).convert("RGBA")
    pb = base.load()
    im = Image.new("RGBA", (96, 96), (0, 0, 0, 0))
    po = im.load()
    CX, CY, R = 45.0, 47.5, 13.2
    dentro = lambda x, y: (x - CX) ** 2 + (y - CY) ** 2 <= R * R
    # O PLASMA: o gás do GASTLY, cor por cor (do mais claro pro mais escuro)
    gas = {(213, 172, 205): 0, (189, 148, 180): 1, (139, 98, 131): 2, (115, 74, 106): 3}
    PLASMA = ["#f4b0ff", "#e070f0", "#a030c0", "#701890"] if shiny else ["#b4f8ff", "#5cd8f4", "#2a9ac8", "#1a6a98"]
    for y in range(96):
        for x in range(96):
            c = pb[x, y]
            if c[3] == 0 or dentro(x, y):
                continue
            k = gas.get(c[:3])
            po[x, y] = hexc(PLASMA[k if k is not None else 2]) + (255,)
    # OS RAIOS: zigue-zague saindo da beira da bola, por cima do plasma
    import math
    RAIO = hexc("#fff4ff" if shiny else "#eaffff")
    for ang, comp in ((25, 24), (150, 22), (215, 26), (320, 20), (95, 16)):
        a = math.radians(ang)
        x, y = CX + math.cos(a) * (R + 1), CY + math.sin(a) * (R + 1)
        for k in range(comp):
            lado = (1 if (k // 3) % 2 else -1) * 0.9
            x += math.cos(a) + math.cos(a + math.pi / 2) * lado
            y += math.sin(a) + math.sin(a + math.pi / 2) * lado
            xi, yi = int(round(x)), int(round(y))
            if 0 <= xi < 96 and 0 <= yi < 96:
                # fora do plasma o raio ganha a beirada escura, pra aparecer no fundo claro
                if po[xi, yi][3] == 0:
                    for ex, ey in ((1, 0), (0, 1)):
                        if 0 <= xi + ex < 96 and 0 <= yi + ey < 96 and po[xi + ex, yi + ey][3] == 0:
                            po[xi + ex, yi + ey] = hexc(PLASMA[3]) + (255,)
                po[xi, yi] = RAIO + (255,)
    # A ESFERA DE METAL: a luz vem de cima à esquerda
    METAL = [hexc(h) for h in ("#141820", "#222834", "#343c4a", "#4a5464", "#66727e", "#8a96a2", "#b4bec8")]
    for y in range(96):
        for x in range(96):
            if not dentro(x, y):
                continue
            nx, ny = (x - CX) / R, (y - CY) / R
            nz = max(0.0, 1 - nx * nx - ny * ny) ** 0.5
            luzv = max(0.0, -0.55 * nx - 0.6 * ny + 0.58 * nz)
            po[x, y] = METAL[min(len(METAL) - 1, int(luzv * (len(METAL) - 0.01)))] + (255,)
    # o contorno da bola e o brilho
    for y in range(96):
        for x in range(96):
            d = ((x - CX) ** 2 + (y - CY) ** 2) ** 0.5
            if R - 1.0 < d <= R + 0.3:
                po[x, y] = hexc("#0a0e14") + (255,)
    for (x, y) in ((37, 38), (38, 38), (36, 39), (37, 39), (39, 37)):
        po[x, y] = hexc("#e8f0ff") + (255,)
    # a EMENDA do metal (um meridiano do lado direito) e dois rebites
    for y in range(36, 60):
        x = int(round(CX + 9 * (1 - ((y - CY) / R) ** 2) ** 0.5))
        if dentro(x, y) and po[x, y][:3] != hexc("#0a0e14"):
            po[x, y] = hexc("#10141a") + (255,)
            if dentro(x + 1, y):
                po[x + 1, y] = hexc("#5a6676") + (255,)
    for (x, y) in ((53, 41), (54, 54)):
        po[x, y] = hexc("#a0aab8") + (255,)
        po[x + 1, y + 1] = hexc("#10141a") + (255,)
    # A TELA: o retângulo preto de cantos redondos, com a beirada acesa de leve
    x0, y0, x1, y1 = 34, 41, 55, 56
    LED = hexc("#f0e040" if shiny else "#38d0f0")
    CLARO = hexc("#fffbd0" if shiny else "#eaffff")
    for y in range(y0, y1 + 1):
        for x in range(x0, x1 + 1):
            canto = (x in (x0, x1)) and (y in (y0, y1))
            if canto:
                continue
            borda = x in (x0, x1) or y in (y0, y1)
            po[x, y] = (hexc("#1e3a4c") if borda else hexc("#060c14")) + (255,)
    # as linhas da tela (bem fraquinhas)
    for y in range(y0 + 2, y1, 3):
        for x in range(x0 + 1, x1):
            po[x, y] = hexc("#0c1824") + (255,)

    def carimbo(grade, gx, gy, espelha=False):
        for j, l in enumerate(grade):
            for i, ch in enumerate(l[::-1] if espelha else l):
                if ch == "c":
                    po[gx + i, gy + j] = LED + (255,)
                elif ch == "b":
                    po[gx + i, gy + j] = CLARO + (255,)
    # os OLHOS bravos do GASTLY (o de lá é o espelho do de cá) e o SORRISO
    carimbo(OLHO, 36, 43)
    carimbo(OLHO, 47, 43, espelha=True)
    carimbo(BOCA, 38, 51)
    return im


def fazer(p, shiny):
    if p["nome"] == "ironghost":
        return iron_ghost(shiny)
    im = Image.open(os.path.join(SPR, f"{p['de']}.png")).convert("RGBA")
    if im.size != (96, 96):                 # (o LUCARIO é 80x80: centrado no 96)
        q = Image.new("RGBA", (96, 96), (0, 0, 0, 0))
        q.alpha_composite(im, ((96 - im.width) // 2, 96 - im.height))
        im = q
    im = recolorir(im, p["shiny"] if shiny else p["rampas"])
    if p["era"] == "passado":
        pelo(im, hexc(p["pelo_shiny"] if shiny else p["pelo"]), hexc(ESCURO_PASSADO))
    else:
        placas(im, hexc(p["emenda"]), p.get("cada", 7))
        luzes(im, pontos_dentro(im, p.get("nluzes", 3), p["n"]), hexc(p["luz_shiny"] if shiny else p["luz"]), hexc(p["brilho"]))
    return im


def main():
    prev = Image.new("RGBA", (96 * 5, 96 * 4), (236, 240, 244, 255))
    for i, p in enumerate(PARADOXOS):
        a, b = fazer(p, False), fazer(p, True)
        a.save(os.path.join(SPR, f"{p['n']}.png"))
        b.save(os.path.join(SPR, "shiny", f"{p['n']}.png"))
        prev.alpha_composite(a, ((i % 5) * 96, (i // 5) * 192))
        prev.alpha_composite(b, ((i % 5) * 96, (i // 5) * 192 + 96))
    prev.resize((96 * 5 * 3, 96 * 4 * 3), Image.NEAREST).save(os.environ.get("PREVIA", "/tmp/area_zero.png"))
    print("feitos:", ", ".join(p["nome"] for p in PARADOXOS))


if __name__ == "__main__":
    main()
