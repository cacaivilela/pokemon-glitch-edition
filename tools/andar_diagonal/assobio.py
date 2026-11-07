"""O JOGADOR ASSOBIANDO (pedido do CAIO, nov/2026: "uma animação do sprite, tipo
mover a mão do jogador até a boca"): 3 quadros em cima do quadro de frente de
cada boneco. A mão que estava embaixo sai, e é desenhada de novo no caminho:
  0 = a mão subindo   1 = a mão na boca   2 = na boca, soprando (bochecha cheia)
python3 tools/andar_diagonal/assobio.py [prévia.png] -> assets/sprites/overworld/diagonal/assobio_<nome>.png"""
import os, sys
from PIL import Image
RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OW = os.path.join(RAIZ, "assets/sprites/overworld")
# boca = linha da boca; claro/escuro = as cores da pele; onde a mão de baixo mora
B = {
  "hero":         {"boca": 22, "claro": (255,197,148), "escuro": (222,148,115), "maoY": (23, 27)},
  "heroina":      {"boca": 22, "claro": (255,197,148), "escuro": (222,148,115), "maoY": (24, 28)},
  "hero_brag":    {"boca": 21, "claro": (232,172,124), "escuro": (200,136,96),  "maoY": (23, 28)},
  "heroina_brag": {"boca": 22, "claro": (232,172,124), "escuro": (200,136,96),  "maoY": (23, 28)},
}
K = (16, 16, 24, 255)
MAO = ["kkkk.", "kCCEk", "kCCEk", ".kkk."]     # 5x4: os dedos e a sombra

def mao(im, x, y, c):
    for j, l in enumerate(MAO):
        for i, ch in enumerate(l):
            if ch == "k": im.putpixel((x + i, y + j), K)
            elif ch == "C": im.putpixel((x + i, y + j), c["claro"] + (255,))
            elif ch == "E": im.putpixel((x + i, y + j), c["escuro"] + (255,))

saidas = {}
for nome, c in B.items():
    folha = Image.open(os.path.join(OW, f"{nome}.png")).convert("RGBA")
    base = folha.crop((0, 0, 16, 32))
    pele = {c["claro"], c["escuro"], (123, 65, 65), (168, 100, 66), (112, 60, 44)}
    sem = base.copy()
    # tira a mão de baixo, do lado direito da tela
    for y in range(*c["maoY"]):
        for x in range(11, 16):
            if sem.getpixel((x, y))[:3] in pele and sem.getpixel((x, y))[3]:
                sem.putpixel((x, y), (0, 0, 0, 0))
    out = Image.new("RGBA", (48, 32), (0, 0, 0, 0))
    b = c["boca"]
    q0 = sem.copy(); mao(q0, 11, b + 2, c)                 # subindo
    # na boca: os dedinhos em cima da boca, e o braço subindo do ombro até eles
    q1 = sem.copy()
    for x, y, ch in ((8, b, "C"), (9, b, "C"), (10, b, "E"), (8, b + 1, "C"), (9, b + 1, "E"), (10, b + 1, "E"),
                     (11, b + 1, "E"), (11, b + 2, "C"), (12, b + 2, "E"), (12, b + 3, "C"), (13, b + 3, "E"),
                     (8, b + 2, "k"), (9, b + 2, "k"), (10, b + 2, "k"), (11, b, "k"), (12, b + 1, "k"), (13, b + 2, "k"), (14, b + 3, "k"), (11, b + 3, "k"), (12, b + 4, "k"), (13, b + 4, "k")):
        q1.putpixel((x, y), K if ch == "k" else c["claro" if ch == "C" else "escuro"] + (255,))
    q2 = q1.copy()                                         # soprando: a bochecha do outro lado enche
    q2.putpixel((4, b - 1), (240, 132, 120, 255)); q2.putpixel((5, b - 1), (240, 132, 120, 255)); q2.putpixel((4, b), (240, 132, 120, 255))
    for k, q in enumerate((q0, q1, q2)): out.paste(q, (k * 16, 0))
    out.save(os.path.join(OW, "diagonal", f"assobio_{nome}.png"))
    saidas[nome] = out
if len(sys.argv) > 1:
    prev = Image.new("RGBA", (104, 72), (120, 170, 120, 255))
    for k, nome in enumerate(B):
        im = saidas[nome].crop((0, 8, 48, 32))
        prev.paste(im, ((k % 2) * 56, (k // 2) * 34), im)
    prev.resize((prev.width * 8, prev.height * 8), Image.NEAREST).save(sys.argv[1])
print("ok")
