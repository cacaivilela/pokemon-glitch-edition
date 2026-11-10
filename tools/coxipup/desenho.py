"""O COXIPUP (criado pelo CAIO, 09/nov/2026, a partir do COXINHA, o cachorro
dele: branco, orelhas dobradas e manchas cor de caramelo). LUTADOR/ELÉTRICO
(sem faixa na testa: "sem esse chapéu"; e sem branco no meio da cara, a cabeça
toda caramelo e só o focinho branco):
patas da frente enfaixadas de amarelo e um raio na
mancha das costas. Desenhado PIXEL POR PIXEL (cada letra é um pixel), olhando
pra esquerda como sprite de frente do GBA.
    python3 tools/coxipup/desenho.py            (grava assets/sprites/pokemon/1128.png e back/1128.png)
    python3 tools/coxipup/desenho.py previa.png (só a prévia, 4x)
"""
import os, sys
from PIL import Image

RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
COR = {
    "k": (44, 30, 30), "w": (252, 250, 246), "W": (214, 212, 220), "g": (168, 164, 178),
    "t": (214, 150, 88), "T": (164, 100, 50), "l": (240, 196, 138),
    "n": (26, 20, 24), "e": (30, 22, 26), "o": (255, 255, 255), "p": (232, 112, 126),
    "y": (252, 222, 60), "Y": (206, 156, 28), "r": (226, 58, 58), "R": (150, 28, 40),
}

COXIPUP = [
    "..........................................",
    "...............................y..kk.y....",
    "..........kk..........kk.........kyYk.y...",
    ".........kTTk........kTTk.....y.kyyk......",
    "........kTttTk......kTttTk......kyYk......",
    ".......kTtttlTkkkkkkTltttTk.....kwwk......",
    ".......kTttllkttttttklltttk.....kwWk......",
    "......kkTtlkttttttttttkltTkk....kwWk......",
    "......kTTtklttttttttttlkTTTk....kwWk......",
    ".....kTtTktltttttttttltTktTtTk..kwwk......",
    ".....kTtklttttttttttttTlktTk....kwWk......",
    "......kkltttttttttttttTlkkk.....kwwk......",
    "......kltttttttttttttttTlk.....kwwk.......",
    "....y.kttkoettttttttekotTk....kwwk........",
    "...y..kttkeetttttttteektTk..kkwWk.........",
    "....y.klttkkttttttttkktTlk.kwwwwkkkk......",
    "...y...kltttttttttttttTlkkkwwwwwwwwwkk....",
    ".......kWlttwwwnnnnwwttlkwwwwtttttwwwWk...",
    "........kWwwwwwknnkwwwwWkwwwtTyyTTtwwwWk..",
    "........kWwwwwwwkkwwwwwkwwwtTyyYyTttwwWk..",
    ".........kWWwwwkppkwwWkwwwwtTyyYTTttwwWk..",
    "..........kkWWwwkkwWkkwwwwwtTTyTTtttwwWk..",
    "...........kgkkWWWkkwwwwwwwwtttttttwwwWk..",
    "..........kwwgkkkkwwwwwwwwwwwwwwwwwwwWk...",
    ".........kwwwwgkwwwwwwwwwwwwwwwwwwwwWWk...",
    ".........kwwwwWkwwwwWWwwwwwwwwwwwwwWWk....",
    "........kyyyyYkwwwwkWWWWWWWWWWWWwwWWk.....",
    "........kyYyyYkkwwkgkWWWWWWWWWkWwwwk......",
    "........kyyYyykkyyyyk.kkkkkkkk.kWwwk......",
    "........kYyyyYkkyYyyYk........kwwWk.......",
    "........kkyyyYkkyyYyYk.......kwwwWk.......",
    ".........kwwwWkkYyyyYk.......kwwWWk.......",
    "........kwwwwWkkkyyYkk......kwwwWk........",
    "........kwkwkWk.kwwWWk......kwkwWk........",
    "........kkkkkkk.kwwwWWk.....kkkkkk........",
    "................kwkwkWk...................",
    "................kkkkkkk...................",
]

def grade(linhas, nome):
    w = len(linhas[0])
    for i, l in enumerate(linhas):
        assert len(l) == w, f"{nome}: linha {i} tem {len(l)} (devia {w})"
    return linhas

def costas(linhas):
    """DE COSTAS: sem cara (olho, nariz, boca e a mancha da cara viram pelo
    branco/caramelo das costas), e virado pro outro lado"""
    troca = {"e": "t", "o": "t", "n": "w", "p": "w"}
    out = []
    for y, l in enumerate(linhas):
        linha = ""
        for x, c in enumerate(l):
            if 13 <= y <= 15 and 9 <= x <= 22 and c in "keo": c = "t"     # os olhos
            elif 16 <= y <= 21 and 12 <= x <= 20 and c in "knp": c = "w"  # o focinho
            linha += troca.get(c, c)
        out.append(linha[::-1])
    return out

def pinta(linhas, ox, oy, tam=64):
    im = Image.new("RGBA", (tam, tam), (0, 0, 0, 0)); px = im.load()
    for y, l in enumerate(linhas):
        for x, c in enumerate(l):
            if c != ".": px[ox + x, oy + y] = COR[c] + (255,)
    return im

def no_chao(linhas, tam=64):
    w, h = len(linhas[0]), len(linhas)
    return pinta(linhas, (tam - w) // 2, tam - 4 - h, tam)

if __name__ == "__main__":
    grade(COXIPUP, "COXIPUP")
    frente, tras = no_chao(COXIPUP), no_chao(costas(COXIPUP))
    if len(sys.argv) > 1:
        folha = Image.new("RGBA", (128, 64), (60, 60, 72, 255))
        folha.alpha_composite(frente, (0, 0)); folha.alpha_composite(tras, (64, 0))
        folha.resize((512, 256), Image.NEAREST).save(sys.argv[1])
    else:
        frente.save(os.path.join(RAIZ, "assets/sprites/pokemon/1128.png"))
        tras.save(os.path.join(RAIZ, "assets/sprites/pokemon/back/1128.png"))
