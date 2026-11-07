"""O ANDAR DOS PARADOXOS DA ÁREA ZERO (o CAIO, nov/2026: "faz a animação de andar
beeeeem caprichada pros que faltam").

Cada um anda com os passos do Pokémon de hoje (o andar do Mystery Dungeon dele,
assets/sprites/pokemon/andar/<dex>.png, nas 4 direções e com todos os quadros),
e cada quadro ganha o mesmo que o desenho de batalha (tools/area_zero/paradoxo.py):

  - as CORES trocadas (as mesmas rampas, então a batalha e o mapa batem);
  - do PASSADO: o PELO nascendo na beirada de cima, em cada quadro (o pelo
    acompanha o corpo quando ele sobe e desce no passo);
  - do FUTURO: as EMENDAS do metal, contadas do alto do corpo em cada quadro (a
    placa anda junto com ele) e o olho virando LED;
  - o IRON GHOST: a bola preta do GASTLY vira metal (com a luz de cima), os
    olhos e a boca viram LED e o gás vira plasma.

Desenho grande demais (40 pixels ou mais) fica com a metade do tamanho, como
os outros Paradoxos (tools/encolhe_andar.py). Faz o andar e o voo (andar/voo/).

Rodar: python3 tools/area_zero/andar.py
"""
import json
import os
import sys

from PIL import Image

AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, AQUI)
sys.path.insert(0, os.path.dirname(AQUI))
from paradoxo import PARADOXOS, recolorir, pelo, hexc, luz, ESCURO_PASSADO  # noqa: E402
from encolhe_andar import metade  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(AQUI))
PASTAS = [(os.path.join(ROOT, "assets/sprites/pokemon/andar"), "andar.json"),
          (os.path.join(ROOT, "assets/sprites/pokemon/andar/voo"), "voo.json")]
LIMITE = 40


def chave(dex):
    return f"{int(dex):03d}" if int(dex) < 1000 else str(int(dex))


def emendas(cel, cada):
    """as emendas do metal num quadro: a primeira a meia placa do alto do corpo"""
    b = cel.getbbox()
    if not b:
        return
    px = cel.load()
    W, H = cel.size
    cheio = lambda x, y: 0 <= x < W and 0 <= y < H and px[x, y][3] > 0
    for y in range(b[1] + cada // 2, b[3], cada):
        for x in range(W):
            if cheio(x, y) and cheio(x, y - 1) and cheio(x, y + 1) and cheio(x - 1, y) and cheio(x + 1, y) and luz(px[x, y][:3]) > 60:
                c = px[x, y]
                px[x, y] = tuple(int(v * 0.72) for v in c[:3]) + (255,)


def iron_ghost_quadro(cel, shiny):
    """o GASTLY do Mystery Dungeon virando o IRON GHOST, pixel por pixel"""
    px = cel.load()
    W, H = cel.size
    cheio = lambda x, y: 0 <= x < W and 0 <= y < H and px[x, y][3] > 0
    GAS = {(183, 151, 223): 0, (143, 103, 191): 1, (87, 47, 159): 2}
    PLASMA = ["#f4b0ff", "#c050e0", "#701890"] if shiny else ["#b4f8ff", "#38c0e8", "#1a6a98"]
    LED, CLARO = (hexc("#f0e040"), hexc("#fffbd0")) if shiny else (hexc("#38d0f0"), hexc("#eaffff"))
    VERMELHOS = {(159, 0, 0), (215, 63, 0), (255, 135, 95)}
    # onde fica a bola: o preto que não é contorno do gás (preto com vizinho preto ou olho)
    pretos = [(x, y) for y in range(H) for x in range(W) if px[x, y][:3] == (0, 0, 0) and px[x, y][3] > 0]
    if not pretos:
        return cel
    nucleo = [(x, y) for (x, y) in pretos if all(cheio(x + dx, y + dy) and px[x + dx, y + dy][:3] not in GAS
                                                for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)))]
    if nucleo:
        xs, ys = [p[0] for p in nucleo], [p[1] for p in nucleo]
        x0, x1, y0, y1 = min(xs), max(xs), min(ys), max(ys)
    else:
        x0 = x1 = y0 = y1 = 0
    METAL = [hexc(h) for h in ("#222834", "#343c4a", "#4a5464", "#66727e", "#8a96a2")]
    out = cel.copy()
    po = out.load()
    for y in range(H):
        for x in range(W):
            c = px[x, y]
            if c[3] == 0:
                continue
            k = c[:3]
            if k in GAS:
                po[x, y] = hexc(PLASMA[GAS[k]]) + (255,)
            elif k == (255, 255, 255) or k in VERMELHOS:
                po[x, y] = LED + (255,)
            elif k == (191, 207, 247):
                po[x, y] = CLARO + (255,)
            elif k == (0, 0, 0) and (x, y) in set(nucleo) and x1 > x0 and y1 > y0:
                # a luz vem de cima à esquerda
                t = 1 - (((x - x0) / (x1 - x0)) * 0.45 + ((y - y0) / (y1 - y0)) * 0.55)
                po[x, y] = METAL[max(0, min(len(METAL) - 1, int(t * len(METAL))))] + (255,)
            elif k == (0, 0, 0):
                po[x, y] = hexc("#0a0e14") + (255,)
    # o brilhinho no alto da bola
    if x1 - x0 > 4:
        for (x, y) in ((x0 + 2, y0 + 1), (x0 + 3, y0 + 1), (x0 + 2, y0 + 2)):
            if po[x, y][3] > 0 and po[x, y][:3] in METAL:
                po[x, y] = hexc("#d8e2f0") + (255,)
    return out


def fazer_folha(p, pasta, arq, indice_novo, shiny=False):
    indice = json.load(open(os.path.join(pasta, arq), encoding="utf-8"))
    v = indice.get(chave(p["de"]))
    png = os.path.join(pasta, f"{chave(p['de'])}.png")
    if not v or not os.path.exists(png):
        return None
    fw, fh, n = v[0], v[1], v[2]
    folha = Image.open(png).convert("RGBA")
    # as cores: de uma vez na folha toda (a mesma troca em todos os quadros)
    if p["nome"] != "ironghost":
        folha = recolorir(folha, p["shiny"] if shiny else p["rampas"])
    linhas = folha.height // fh
    # o tamanho: grande demais fica com a metade
    b = folha.crop((0, 0, fw, fh)).getbbox()
    encolhe = b and max(b[2] - b[0], b[3] - b[1]) >= LIMITE
    nw, nh = ((fw + 1) // 2, (fh + 1) // 2) if encolhe else (fw, fh)
    out = Image.new("RGBA", (nw * n, nh * linhas), (0, 0, 0, 0))
    for j in range(linhas):
        for i in range(n):
            cel = folha.crop((i * fw, j * fh, (i + 1) * fw, (j + 1) * fh))
            if p["nome"] == "ironghost":
                cel = iron_ghost_quadro(cel, shiny)
            if encolhe:
                cel = metade(cel)
            # os detalhes depois de encolher, pra ficarem de 1 pixel
            if p["era"] == "passado":
                pelo(cel, hexc(p["pelo_shiny"] if shiny else p["pelo"]), hexc(ESCURO_PASSADO), todo=2)
            elif p["nome"] != "ironghost":
                emendas(cel, max(6, p.get("cada", 9) // 2 + 3))
            out.alpha_composite(cel, (i * nw, j * nh))
    return out, [nw, nh] + v[2:]


def main():
    for pasta, arq in PASTAS:
        indice_p = os.path.join(pasta, arq)
        indice = json.load(open(indice_p, encoding="utf-8"))
        for p in PARADOXOS:
            r = fazer_folha(p, pasta, arq, indice)
            if not r:
                print(arq, p["nome"], "sem a folha do", p["de"])
                continue
            im, entrada = r
            im.save(os.path.join(pasta, f"{p['n']}.png"))
            # (o shiny do andar o jogo faz sozinho, girando a cor: Assets.monAndando)
            indice[str(p["n"])] = entrada
            print(arq, p["nome"], entrada[:3])
        with open(indice_p, "w", encoding="utf-8") as f:
            json.dump(indice, f, separators=(",", ":"), sort_keys=True)


if __name__ == "__main__":
    main()
