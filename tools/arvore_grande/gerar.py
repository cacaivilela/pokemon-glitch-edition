"""A ÁRVORE GRANDE DA FLORESTA DE VIRIDIAN: o bloco que se repete no mapa (3 tiles
de largura por 2 de altura), sem o chão em volta, vira src/core/arvore-grande.js.
É com ele que src/core/arvoreskanto.js acha essas árvores no mapa, e é ele que
vira as camadas em src/core/arvore3d.js.
python3 tools/arvore_grande/gerar.py"""
import json, os
from PIL import Image
RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
b = Image.open(os.path.join(RAIZ, "assets/maps/viridian_forest.png")).convert("RGBA")
b.alpha_composite(Image.open(os.path.join(RAIZ, "assets/maps/viridian_forest_over.png")).convert("RGBA"))
# os 3 pedaços da árvore: o MEIO (que se repete), o TOPO e o PÉ da fila
PEDACOS = {"grande": (192, 0, 240, 32), "grande_topo": (512, 112, 560, 144), "grande_pe": (192, 32, 240, 64)}
CHAO = {(65, 180, 139), (115, 205, 164), (24, 164, 106), (139, 222, 189)}   # (o último é o tufinho da grama)
L = "abcdefghijklmnopqrstuvwxyz"
cores, saida = {}, {}
for nome, caixa in PEDACOS.items():
    bloco = b.crop(caixa)
    rows = []
    for y in range(32):
        t = ""
        for x in range(48):
            p = bloco.getpixel((x, y))[:3]
            if p in CHAO: t += "."; continue
            cores.setdefault(p, L[len(cores)]); t += cores[p]
        rows.append(t)
    saida[nome] = rows
hexa = {v: "#%02x%02x%02x" % k for k, v in cores.items()}
with open(os.path.join(RAIZ, "src/core/arvore-grande.js"), "w") as f:
    f.write("// gerado por tools/arvore_grande/gerar.py: a árvore grande da FLORESTA DE VIRIDIAN\n")
    f.write("export const GRANDE_CORES = " + json.dumps(hexa) + ";\n")
    f.write("export const GRANDES = " + json.dumps(saida, indent=0) + ";\n")
print({k: len(v) for k, v in saida.items()}, len(hexa))
