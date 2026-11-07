"""A FAMÍLIA DO AMEBO (criada pelo CAIO, nov/2026), desenhada PIXEL POR PIXEL:
cada letra é um pixel (nada de forma colada). AMEBO (1115) → MACAMEBA (1116) →
MACACAVERN (1117). Olhando pra esquerda, como sprite de frente do GBA.
    python3 tools/amebo/desenhos.py      (grava assets/sprites/pokemon/111x.png e back/)
"""
import os, sys
from PIL import Image

RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
COR = {
    "k": (40, 18, 56), "d": (92, 44, 138), "r": (138, 75, 192), "R": (170, 112, 222), "h": (222, 190, 255),
    "f": (238, 200, 156), "F": (196, 150, 106), "w": (250, 250, 250), "p": (24, 18, 30), "m": (120, 40, 60),
    "y": (250, 220, 70), "Y": (210, 160, 30), "b": (110, 70, 30), "g": (208, 170, 242),
    "S": (128, 118, 112), "s": (170, 160, 150), "T": (84, 76, 74), "o": (226, 146, 64), "O": (176, 98, 40),
    "z": (92, 52, 22), "n": (244, 236, 210), "N": (198, 184, 150),
}

AMEBO = [
    "..............kkk...............",
    ".............khRk...............",
    "............khRk................",
    "............kRRk................",
    ".............kRRk...............",
    "........kkkkkkRRkkkkkk..........",
    "......kkRRRRRRRRRRRRRRkk........",
    ".....kRRhhRRRRRRRRRRRRRRk.......",
    "....kRRhhRRRRRRRRRRRRRRRrk......",
    "....kRhRRRRffffffffRRRRRrk......",
    "...kRRRRRRffffffffffRRRRrrk.....",
    "...kRRRRRfffffffffffRRRRrrk.....",
    "...kRRRRffwwffffwwfffRRRrrk.....",
    "...kRRRRffwppfffwppffRRRrrk.....",
    "...kRRRRffwppfffwppffRRRrrk.....",
    "...kRRRRfffffFFffffffRRRrrk.....",
    "...kRRRRRffffFkFfffffRRrrrk.....",
    "..kRRRRRRffmmmmmmfffRRRrrrdk....",
    "..kRRkkRRRffmmmmfffRRRRrrrdk....",
    ".kRRkhRkRRRffffffRRRRRrrkkrdk...",
    ".kRkhRRkRRRRRRRRRRRRRRrkhRkrdk..",
    ".kRkRRkyyyyRRRRRRRRRRrkhRRRkrdk.",
    "kRRRkkyyyyyyYRRRRRRRRrkRRRkrrdk.",
    "kRRRRkYyyyyyYkRRRRRRrrrkkkrrrdk.",
    "kRRRRRkYYYYYkRRRRRRrrrrrrrrrrdk.",
    "kdRRRRRkkkkkRRRRRRrrrrrrrrrrddk.",
    ".kddRRRRRRRRRRRRrrrrrrrrrrrddk..",
    "..kkdddrrrrrrrrrrrrrrrrdddddk...",
    "....kkkkkdddddddddddddddkkkk....",
    "........kkkkkkkkkkkkkkkk........",
]


MACAMEBA = [
    ".................kkk......................",
    "................khRk......................",
    "...............khRk.......................",
    "............kkkkRRkkkk....................",
    "..........kkRRRRRRRRRRkk..................",
    ".....kkk.kRRhhRRRRRRRRRRk.kkk.............",
    "....kRffkRRhRRRRRRRRRRRRRkffRk............",
    "....kRfFkRRffffffffffffRRkFfRk............",
    "....kRFfkRffffffffffffffRkfFRk............",
    ".....kkkRffwwffffffffwwfRkkkk.............",
    ".......kRffwppffffffwppfRk................",
    ".......kRffwppffffffwppfRk................",
    ".......kRfffffffFFffffffRk................",
    ".......kRRffffffkkfffffRRk................",
    "........kRRfffmmmmmmfffRk.................",
    ".........kRRffffffffffRRk.................",
    "..........kkRRRRRRRRRRkk..................",
    ".........kRRRRRRRRRRRRRRk.................",
    "........kRRRRggggggggRRRRk................",
    ".......kRRRkgggggggggkRRRRk...............",
    "......kRRRkkggggggggggkkRRRk..............",
    ".....kRRRk.kggggggggggk.kRRRk.............",
    "....kRRRk..kggggggggggk..kRRRk............",
    "...kRRRk...kRggggggggRk...kRRrk...........",
    "...kRRk....kRRggggggRRk....kRRrk..........",
    "..kRRrk....kRRRRRRRRRRk.....kRrk..........",
    "..kRrrk....kRRRRRRRRRRk.....kRrk..kkkk....",
    "..kRrk.....kRRRRRRRRRRRk....kRrk.kRRRRk...",
    "..kdhk....kRRRRkkkkRRRRk....khdk.kRk.kRk..",
    "..kRRk....kRRRk....kRRRk....kRRk..k...kRk.",
    "...kk.....kRRk......kRRk.....kk.......kRk.",
    "...kRk....kRRk......kRRk....kRk.......kRk.",
    "...khk...kRRrk......kRrRk...khk......kRRk.",
    "....k....kRRrk......kRrRkk...k......kRRk..",
    ".........kRrrk......krrRRRkk......kkRRk...",
    "........kRRrrk......krrRRRRRkkkkkkRRRk....",
    ".......kRRRrrdk....kdrrRRRRRRRRRRRRkk.....",
    ".......kdddddddk..kddddddddkkkkkkkk.......",
    "........kkkkkkk....kkkkkkkk...............",
]

MACACAVERN = [
    "..........................................kkk.......",
    ".........................................knnnk......",
    "........................................knnnnNk.....",
    ".......................................knnnnNNk.....",
    "........................................kNNNNk......",
    ".................kkkkkk.................knNk........",
    "...............kksssSSSkk..............knNk.........",
    "..............ksssSSSSSSSk.............knNk.........",
    ".............ksSSSSSSSSSSSk...........knNk..........",
    "............kTTTTTTTTTTTTTTk..........knNk..........",
    "...........kTTkkkTTTTTkkkTTTk........knNk...........",
    "..........kkSfwwpkfffkwwpfSSkk.......knNk...........",
    ".........kFfSffwpffffffwpffSfFk.....knNk............",
    "..........kkSffffffFFffffffSkk......knNk............",
    "...........kSfffffkkkkfffffSk......knNk.............",
    "............kSfnkknkknkknfSk......kknNkk............",
    "............kSfknnnnnnnnkfSk.....kSsnNsSk...........",
    ".......kkkkkkSSfkkkkkkkkfSSkkkkkkSsssssSk...........",
    ".....kksssSSSSSSSSSSSSSSSSSSoooSSsssSSSSk...........",
    "....ksssSSSSSSSSSSSSSSSSSSSoozoSSSSSSSSSk...........",
    "...ksSSSSSSSSrSSSSSSSSSSSooooooSSSSSSSTk............",
    "..ksSSSSSSSSSrrSSSSSSSSSoozooOSSSSSSSTTk............",
    "..ksSSSkSSSSSSrSSSSSSSoooooOSSSSSSSTTTk.............",
    "..kSSSk.kSSSSSSSSSSSSooozoOSSSSSSSSTTk..............",
    "..kSSSk.kSSSSSSSSSSoooooOSSSSSSSSSSTk...............",
    "..kSSk..kSSSSSSSSoozooOSSSSSrSSSSSTk................",
    "..kSSk..kSSSSSSoooooOSSSSSSrrSSSSSTk................",
    "..kSSk..kSSSSoozooOSSSSSSSSSrSSSSSTk................",
    "..kSSk..kSSSoooooSSSSSSSSSSSSSSSSSTk................",
    ".kSSSk..kSSSSOOSSSSSSSSSSSSSSSSSSSTk................",
    ".kSSSk..kSSSSSSSSSSSSSSSSSSSSSSSSSTk................",
    ".kSSSk...kSSSSSSSSSSSSSSSSSSSSSSSTk.................",
    ".kSSSSk..kooooooooooooooooooooooook.................",
    ".kSSsSk..kozooozoooozooozoooozooook.................",
    ".kSsssSk.kooOoooooOooooooOoooooOok..................",
    "kSSsrsSk.kkOoozoooOkkkkkOoozooOkk...................",
    "kSsssssk..kOoooooOk....kOooooOk.....................",
    "kTSsssTk..kSSSSSSSk....kSSSSSSk.....................",
    ".kTkTkTk..kSSSSSSk......kSSSSSk.....................",
    "..k.k.k...kSSSrSSk......kSSrSSk.....................",
    "..........kSSSSSSk......kSSSSSk.....................",
    ".........kSSSSSSSk......kSSSSSSk....................",
    ".........kSSSSSSSk......kSSSSSSk....................",
    "........kSSSSSSSTk......kTSSSSSSk...................",
    ".......kTSSSSSSTTk......kTTSSSSSSk..................",
    ".......kTTTTTTTTTk......kTTTTTTTTTk.................",
    "........kkkkkkkkk........kkkkkkkkk..................",
]

def grade(linhas, nome):
    w = len(linhas[0])
    for i, l in enumerate(linhas):
        assert len(l) == w, f"{nome}: linha {i} tem {len(l)} (devia {w})"
    return linhas

def costas(linhas, troca, ate_linha=99, ate_col=99, limpa=(), corpo="R"):
    """AS COSTAS: a mesma pose vista de trás — o que é da frente (cara, barriga,
    banana) vira a cor do corpo (`troca`: letra -> letra), e vira pro outro lado"""
    # `limpa`: retângulos (linha de, até, coluna de, até) de dentro da cara: lá
    # até o contorno escuro (boca, testa, olho) vira corpo — de costas não tem cara
    dentro = lambda x, y: any(y0 <= y <= y1 and x0 <= x <= x1 for y0, y1, x0, x1 in limpa)
    out = []
    for y, l in enumerate(linhas):
        linha = ""
        for x, c in enumerate(l):
            if y <= ate_linha and x <= ate_col: c = troca.get(c, c)
            if dentro(x, y) and c in "kT": c = corpo
            linha += c
        out.append(linha[::-1])
    return out

def pinta(linhas, ox, oy, tam=64):
    im = Image.new("RGBA", (tam, tam), (0, 0, 0, 0)); px = im.load()
    for y, l in enumerate(linhas):
        for x, c in enumerate(l):
            if c != ".": px[ox + x, oy + y] = COR[c] + (255,)
    return im

def no_chao(linhas, tam=64):
    """centraliza na largura e põe o pé no chão (como os outros de Braglitch)"""
    w, h = len(linhas[0]), len(linhas)
    return pinta(linhas, (tam - w) // 2, tam - 4 - h, tam)

COSTAS = {
    1115: costas(AMEBO, {c: "R" for c in "fFwpmyY"}, limpa=[(9, 18, 6, 22), (19, 24, 5, 13)]),
    1116: costas(MACAMEBA, {**{c: "R" for c in "fFwpm"}, "g": "R"}),
    1117: costas(MACACAVERN, {c: "S" for c in "fFwpn"}, ate_linha=16, ate_col=31, limpa=[(9, 16, 13, 27)], corpo="S"),
}

if __name__ == "__main__":
    TODOS = {1115: ("AMEBO", AMEBO), 1116: ("MACAMEBA", MACAMEBA), 1117: ("MACACAVERN", MACACAVERN)}
    for dex, (nome, g) in TODOS.items(): grade(g, nome)
    saida = sys.argv[1] if len(sys.argv) > 1 else None
    if saida:   # a prévia: todos lado a lado, 4x
        folha = Image.new("RGBA", (64 * len(TODOS), 128), (60, 60, 72, 255))
        for i, (dex, (nome, g)) in enumerate(TODOS.items()):
            folha.alpha_composite(no_chao(g), (i * 64, 0)); folha.alpha_composite(no_chao(COSTAS[dex]), (i * 64, 64))
        folha.resize((folha.width * 3, folha.height * 3), Image.NEAREST).save(saida)
    else:
        for dex, (nome, g) in TODOS.items(): no_chao(g).save(os.path.join(RAIZ, f"assets/sprites/pokemon/{dex}.png"))
        for dex, g in COSTAS.items(): no_chao(g).save(os.path.join(RAIZ, f"assets/sprites/pokemon/back/{dex}.png"))
