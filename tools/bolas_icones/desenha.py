"""OS ÍCONES DAS BOLAS NOVAS DA FÁBRICA (pedido do CAIO, nov/2026: "cada bola tem
uma pixelart"). 16x16, PIXEL POR PIXEL: o contorno é o mesmo da bola.png do jogo,
e o de dentro de cada bola é escrito aqui linha por linha (r2..r7 = a metade de
cima, só o miolo de cada linha). A ROCKET BALL (com os propulsores) é desenhada
à parte, inteira, e não é refeita aqui.  Uso: python3 tools/bolas_icones/desenha.py"""
import os
from PIL import Image
AQUI = os.path.dirname(os.path.abspath(__file__))
DEST = os.path.join(AQUI, "..", "..", "assets", "sprites", "itens")
K = (30, 26, 34); BRANCO = (248, 248, 248); SOMBRA = (200, 200, 208)

# a metade de baixo e o contorno (iguais à bola.png)
BAIXO = ["aaaaaaawwaaaaaaa", "addddaawwaadddda", "adddddaaaaddddda", ".adddddddddddda.",
         ".adddddddddddda.", "..adddddddddea..", "...aaddddeeaa...", ".....aaaaaa....."]
MIOLO = {2: (5, 6), 3: (3, 10), 4: (2, 12), 5: (2, 12), 6: (1, 14)}   # linha: (x inicial, largura)

BOLAS = {
 "net-ball": dict(b=(72,184,208), c=(170,230,240), x=(24,72,96), top=[
   "bbbxbb", "ccxbbxbbxb", "bcbxbbxbbxbb", "xxxxxxxxxxxx", "bbbbxbbxbbxbbb", ("bbbbx", "bxbbb")]),
 "dive-ball": dict(b=(56,104,208), c=(140,180,240), x=(150,210,250), top=[
   "bbbbbb", "ccbbbbbbbb", "bcxxbbbbxxbb", "bxxxxbbxxxxb", "bbbxxbbbbxxbbb", ("bbbbb", "bbbbb")]),
 "nest-ball": dict(b=(96,168,64), c=(170,220,120), x=(232,216,96), d=(240,224,150), e=(200,180,110), top=[
   "bbbbbb", "ccbbxxbbbb", "bcbbxxxxbbbb", "bbbxxxxxxbbb", "bbbbbxxxxbbbbb", ("bbbbb", "bbbbb")]),
 "repeat-ball": dict(b=(224,96,40), c=(248,170,120), x=(248,216,64), d=(248,216,64), e=(208,168,32), top=[
   "bbbbbb", "ccbbbbbbbb", "bcxxbbbbxxbb", "bxbbxbbxbbxb", "bbbxxbbbbxxbbb", ("bbbbb", "bbbbb")]),
 "timer-ball": dict(b=(232,232,236), c=(255,255,255), x=(208,48,48), top=[
   "bbxxbb", "ccbbxxbbbb", "bcbbbxxbbbbb", "xxxxxxxxxxxx", "bbbbbbxxbbbbbb", ("bbbbb", "bbbbb")]),
 "dusk-ball": dict(b=(64,160,72), c=(140,220,140), x=K, d=(56,52,64), e=(36,32,42), top=[
   "bbxxbb", "ccbxbbxbbb", "bcbxbbbbxbbb", "bbxbbbbbbxbb", "bbxbbbbbbbbxbb", ("bxbbb", "bbbxb")]),
 "quick-ball": dict(b=(48,112,208), c=(130,180,250), x=(248,216,48), d=(48,112,208), e=(32,80,160), top=[
   "bbxxbb", "ccbbxxbbbb", "bcxbbbbbbxbb", "bxxbbbbbbxxb", "xxxbbbbbbbbxxx", ("xxbbb", "bbbxx")]),
 "fast-ball": dict(b=(248,248,248), c=(255,255,255), x=(224,48,48), y=(248,200,40), top=[
   "bxxxxb", "cbbxxxxbbb", "ybbbxxxxbbby", "yybbbxxbbbyy", "yyybbbbbbbbyyy", ("yybbb", "bbbyy")]),
 "level-ball": dict(b=(60,56,70), c=(120,112,130), x=(208,48,48), y=(248,208,48), top=[
   "bbbbbb", "ccbbbbbbbb", "yyyyyyyyyyyy", "xxxxxxxxxxxx", "yyyyyyyyyyyyyy", ("bbbbb", "bbbbb")]),
 "heavy-ball": dict(b=(150,160,176), c=(210,216,228), x=(40,40,50), y=(248,208,48), d=(200,204,212), e=(150,156,168), top=[
   "bbbbbb", "ccbbbbbbbb", "xxxxxxxxxxxx", "bbbyyyyyybbb", "xxxxxxxxxxxxxx", ("bbbbb", "bbbbb")]),
 "moon-ball": dict(b=(40,56,120), c=(90,110,180), x=(248,224,96), y=(160,180,230), top=[
   "bbbbyb", "ccbbxxbbbb", "bcbbxxbbbbyb", "bbbbxbbbbybb", "bbbbbbxxbbybbb", ("bbbbb", "bbbbb")]),
 "dream-ball": dict(b=(240,140,190), c=(255,200,230), x=(190,120,220), y=(255,255,255), d=(248,190,220), e=(220,150,190), top=[
   "bbxxbb", "ccbxbbxbyb", "bcxbbyybbxbb", "bbxbbyybbxbb", "bbbxbbbbbbxbbb", ("bbxbb", "bbxbb")]),
 "beast-ball": dict(b=(40,72,160), c=(100,140,220), x=(248,216,48), d=(40,72,160), e=(28,50,120), top=[
   "bxbbxb", "cxbxbbxbxb", "bxbxbbbbxbxb", "bbxbbbbbbxbb", "bbbxbbbbbbxbbb", ("bbbbx", "xbbbb")]),
 "luxury-ball": dict(b=(36,32,40), c=(90,84,100), x=(224,184,56), y=(208,48,48), d=(36,32,40), e=(20,18,24), top=[
   "bbbbbb", "ccbbbbbbbb", "yyyyyyyyyyyy", "xxxxxxxxxxxx", "bbbbbbbbbbbbbb", ("bbbbb", "bbbbb")]),
 "premier-ball": dict(b=(240,240,244), c=(255,255,255), faixa=(224,48,48), top=[
   "bbbbbb", "ccbbbbbbbb", "bcbbbbbbbbbb", "bbbbbbbbbbbb", "bbbbbbbbbbbbbb", ("bbbbb", "bbbbb")]),
 "friend-ball": dict(b=(96,176,72), c=(170,224,140), x=(224,64,48), d=(240,232,180), e=(200,190,140), top=[
   "bbxxbb", "ccbbxxbbbb", "xcbbbbbbbbbx", "xxbbbbbbbbxx", "xxxbbbbbbbbxxx", ("xxbbb", "bbbxx")]),
 "alfa-ball": dict(b=(70,64,80), c=(120,112,130), x=(232,40,48), y=(255,150,150), d=(200,200,210), e=(150,150,165), top=[
   "bbbbbb", "ccbbxxbbbb", "bcbbxyyxbbbb", "bbbxyyyyxbbb", "bbbbbxxxxbbbbb", ("bbbbb", "bbbbb")]),
 "bola-lendaria": dict(b=(232,184,48), c=(255,240,150), x=(255,255,255), d=(255,248,220), e=(220,200,140), top=[
   "bbbbbb", "ccbbxbbbbb", "bcbbbxbbbbbb", "bbbxxxxxbbbb", "bbbbbxxxbbbbbb", ("bbbbb", "bbbbb")]),
}

for nome, d in BOLAS.items():
    pal = {"a": K, "w": BRANCO, "d": d.get("d", BRANCO), "e": d.get("e", SOMBRA)}
    for k in "bcxy":
        if k in d: pal[k] = d[k]
    g = [list("................"), list(".....aaaaaa.....")] + [list("." * 16) for _ in range(6)] + [list(r) for r in BAIXO]
    for i, r in enumerate(d["top"][:5]):
        lin = i + 2; x0, w = MIOLO[lin]
        assert len(r) == w, (nome, lin, r)
        g[lin] = list("." * 16)
        for x in range(16):
            if x0 - (2 if lin == 2 else 1) <= x < x0 or x0 + w <= x < x0 + w + (2 if lin == 2 else 1): g[lin][x] = "a"
        g[lin][x0:x0 + w] = list(r)
        if lin == 6: g[lin][0] = g[lin][15] = "a"
    e, dd = d["top"][5]
    g[7] = list("a" + e + "aaaa" + dd + "a")
    if "faixa" in d:          # a PREMIER: a faixa do meio é vermelha
        pal["f"] = d["faixa"]
        for x in range(1, 15):
            if g[8][x] == "a": g[8][x] = "f"
        for x in range(6, 10): g[7][x] = "f"
    im = Image.new("RGBA", (16, 16))
    for y, r in enumerate(g):
        for x, ch in enumerate(r):
            if ch in pal: im.putpixel((x, y), pal[ch] + (255,))
    im.save(os.path.join(DEST, nome + ".png"))
print(len(BOLAS), "bolas")
