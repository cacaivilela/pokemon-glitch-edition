"""OS SÍMBOLOS DOS TIPOS, 64x64 (pedido do CAIO, nov/2026). A ÁGUA é dele
(dev/captures/tipo_agua.png); os outros seguem o estilo dela: sem contorno, a
cor forte, uma mancha clara e um brilho branco. PIXEL POR PIXEL: cada linha é
escrita aqui (em pedaços "12." = 12 vazios, "5M" = 5 da cor M). Com `espelho`,
a linha é só a metade da esquerda (32) e a direita é ela virada; `brilho` são
pontinhos postos por cima (x, y, linhas).  Uso: python3 tools/tipos/desenha.py"""
import os, re, sys
from PIL import Image
AQUI = os.path.dirname(os.path.abspath(__file__))
DEST = os.path.join(AQUI, "..", "..", "assets", "sprites", "tipos")
os.makedirs(DEST, exist_ok=True)
W = (255, 255, 255)

def linha(txt, larg):
    out = ""
    for tok in txt.split():
        m = re.fullmatch(r"(\d+)(.)", tok)
        assert m, tok
        out += m.group(2) * int(m.group(1))
    assert len(out) <= larg, (txt, len(out))
    return out.ljust(larg, ".")

def monta(d):
    g = [["."] * 64 for _ in range(64)]
    for y, txt in d["linhas"].items():
        if d.get("espelho"):
            m = linha(txt, 32); r = m + m[::-1]
        else:
            r = linha(txt, 64)
        g[y] = list(r)
    if d.get("espelhoV"):                 # a metade de baixo é a de cima virada (em volta de `espelhoV`)
        c = d["espelhoV"]
        for y in range(64):
            yy = int(round(2 * c - y))
            if y > c and 0 <= yy < 64 and any(ch != "." for ch in g[yy]): g[y] = list(g[yy])
    for x, y, rows in d.get("brilho", []):
        for j, r in enumerate(rows):
            for i, ch in enumerate(r):
                if ch != " ": g[y + j][x + i] = ch
                if ch != " " and d.get("brilhoEspelho"): g[y + j][63 - x - i] = ch
    for x, y, rows in d.get("brilhoSo", []):      # (esses não espelham)
        for j, r in enumerate(rows):
            for i, ch in enumerate(r):
                if ch != " ": g[y + j][x + i] = ch
    return g

# O FUNDO E A BORDA (pedido do CAIO: "cada símbolo de tipo vai ter uma cor de
# fundo e uma borda"; "só o voador fica branco", em cima de azul-claro).
# tipo: (fundo, borda, cores do desenho dos 12 novos: M, L, D)
FUNDO = {
 "agua": ((200, 224, 255), (48, 80, 170), None), "fogo": ((255, 224, 190), (170, 70, 20), None),
 "planta": ((210, 240, 190), (40, 110, 40), None), "eletrico": ((255, 245, 200), (170, 130, 10), None),
 "gelo": ((220, 245, 250), (60, 130, 160), None), "lutador": ((250, 215, 205), (120, 24, 20), None),
 "voador": ((150, 200, 248), (80, 130, 200), None),
 "normal": ((235, 235, 215), (110, 110, 76), ((150, 150, 110), (200, 200, 170), (90, 90, 60))),
 "veneno": ((235, 210, 240), (96, 32, 100), ((150, 60, 160), (200, 130, 210), (80, 20, 90))),
 "terra": ((250, 235, 200), (130, 100, 40), ((200, 160, 72), (240, 210, 130), (130, 95, 40))),
 "pedra": ((240, 230, 200), (110, 90, 30), ((170, 145, 60), (215, 195, 120), (110, 90, 30))),
 "inseto": ((235, 240, 200), (100, 110, 16), ((150, 170, 30), (200, 215, 90), (90, 100, 10))),
 "fantasma": ((225, 215, 240), (64, 48, 96), ((110, 85, 150), (170, 150, 210), (50, 35, 80))),
 "aco": ((235, 235, 245), (100, 100, 130), ((150, 150, 175), (210, 210, 230), (90, 90, 110))),
 "psiquico": ((255, 220, 232), (170, 40, 80), ((240, 90, 140), (255, 170, 200), (150, 30, 70))),
 "dragao": ((225, 215, 255), (64, 24, 160), ((110, 60, 230), (170, 140, 255), (50, 20, 130))),
 "sombrio": ((225, 215, 205), (60, 44, 36), ((100, 80, 65), (160, 135, 115), (50, 36, 28))),
 "fada": ((255, 225, 235), (180, 90, 110), ((230, 120, 160), (255, 190, 215), (170, 70, 110))),
 "glitch": ((30, 15, 45), (120, 255, 200), ((180, 85, 255), (230, 180, 255), (90, 20, 140))),
}

def fundo(nome):
    """o quadrado de cantos redondos: a borda de 3 pixels e o fundo"""
    bg, borda, _ = FUNDO[nome]
    im = Image.new("RGBA", (64, 64))
    R = 10
    for y in range(64):
        for x in range(64):
            cx = min(max(x, R), 63 - R); cy = min(max(y, R), 63 - R)
            d = ((x - cx) ** 2 + (y - cy) ** 2) ** 0.5
            if d > R + 0.5: continue
            dentro = min(x, y, 63 - x, 63 - y) >= 3 and d <= R - 2.5
            im.putpixel((x, y), (bg if dentro else borda) + (255,))
    return im

def salva(nome, g, pal):
    im = fundo(nome)
    for y, r in enumerate(g):
        for x, ch in enumerate(r):
            if ch in pal: im.putpixel((x, y), pal[ch] + (255,))
    im.save(os.path.join(DEST, nome + ".png"))

sys.path.insert(0, AQUI)
from simbolos import TIPOS
from simbolos2 import LINHAS
if __name__ == "__main__":
    # a ÁGUA é a dele, como ele desenhou: só ganha o fundo e a borda
    agua = Image.open(os.path.join(AQUI, "..", "..", "dev", "captures", "tipo_agua.png")).convert("RGBA")
    im = fundo("agua"); im.alpha_composite(agua); im.save(os.path.join(DEST, "agua.png"))
    for nome, d in TIPOS.items():
        pal = dict(d["cores"]); pal.setdefault("W", W)
        if nome == "voador": pal = {"M": (255, 255, 255), "L": (225, 238, 255), "W": (180, 210, 248)}
        salva(nome, monta(d), pal)
    for nome, g in LINHAS.items():
        M, L, D = FUNDO[nome][2]
        salva(nome, g, {"M": M, "L": L, "D": D, "W": W, "R": (255, 60, 120), "C": (60, 240, 255)})
    print(1 + len(TIPOS) + len(LINHAS), "símbolos")
