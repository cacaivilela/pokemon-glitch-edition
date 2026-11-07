"""A VERSÃO DITTO de cada Pokémon (pedido do CAIO, nov/2026).
Uso: python3 tools/ditto/fazer.py tools/ditto/marcas/ARQUIVO.json [saida_conferir.png]
O JSON: {"NUM": {"o": [[x,y],[x,y]], "b": [x,y]}, ...}  (pixels do desenho de frente 96x96)
   "o" = centro dos 2 olhos, "b" = centro da boca (onde vai o sorriso).
Opcional por Pokémon: "r" (raio do olho velho que some), "mb" ([meia-largura, meia-altura]
da boca velha que some), "sem": [[x0,y0,x1,y1], ...] caixas extras a tapar na cor do corpo.
Só com --gravar grava assets/sprites/pokemon/ditto/NUM.png (o jogo NÃO usa: ele pinta na hora). Mesmo jeito do
src/systems/caraditto.js. Depois dá pra editar o PNG pixel por pixel à vontade."""
import json, sys, os, math
from PIL import Image
RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
def pad(n): return f"{n:03d}" if n < 1000 else str(n)
def luz(c): return (max(c[:3]) + min(c[:3])) / 510

def fazer(n, m):
    im = Image.open(f"{RAIZ}/assets/sprites/pokemon/{pad(n)}.png").convert("RGBA"); p = im.load(); W, H = im.size
    a = lambda x, y: 0 <= x < W and 0 <= y < H and p[x, y][3] > 0
    def pinta(x, y, c):
        if a(x, y): p[x, y] = tuple(c[:3]) + (p[x, y][3],)
    (xa, ya), (xb, yb) = sorted(m["o"])
    dist = max(4, math.hypot(xb-xa, yb-ya))
    r = m.get("r", max(2, round(dist*0.28)))
    bx, by = m.get("b") or [round((xa+xb)/2), round(max(ya, yb)+dist*0.5)]
    buraco = set()
    rx0 = max(3, round(dist*0.5))*1.7; ry0 = max(4, dist*0.45)
    fechar = []
    for y in range(math.floor(by-ry0), math.floor(by+ry0)+1):
        for x in range(math.floor(bx-rx0), math.floor(bx+rx0)+1):
            if not (0 <= x < W and 0 <= y < H) or a(x, y) or ((x-bx)/rx0)**2 + ((y-by)/ry0)**2 > 1: continue
            e = any(a(k, y) for k in range(x-1, math.floor(bx-rx0)-1, -1))
            dd = any(a(k, y) for k in range(x+1, math.floor(bx+rx0)+1))
            c = any(a(x, k) for k in range(y-1, math.floor(by-ry0-2)-1, -1))
            if e and dd and c: fechar.append((x, y))
    for q in fechar: p[q] = (0, 0, 0, 255); buraco.add(q)
    fora = set(); pilha = [(x, 0) for x in range(W)] + [(x, H-1) for x in range(W)] + [(0, y) for y in range(H)] + [(W-1, y) for y in range(H)]
    while pilha:
        x, y = pilha.pop()
        if not (0 <= x < W and 0 <= y < H) or (x, y) in fora or a(x, y): continue
        fora.add((x, y)); pilha += [(x+1, y), (x-1, y), (x, y+1), (x, y-1)]
    vf = lambda x, y: not (0 <= x < W and 0 <= y < H) or (x, y) in fora
    beira = lambda x, y: vf(x-1, y) or vf(x+1, y) or vf(x, y-1) or vf(x, y+1)
    def marca(cx, cy, rx, ry):
        for y in range(math.floor(cy-ry), math.floor(cy+ry)+1):
            for x in range(math.floor(cx-rx), math.floor(cx+rx)+1):
                if ((x-cx)/(rx+0.5))**2 + ((y-cy)/(ry+0.5))**2 <= 1 and a(x, y) and not beira(x, y): buraco.add((x, y))
    marca(xa, ya, r, r+1); marca(xb, yb, r, r+1)
    meia = max(3, round(dist*0.5))
    mbx, mby = m.get("mb", [meia+1, max(2, round(dist*0.22))])
    marca(bx, by, mbx, mby)
    for x0, y0, x1, y1 in m.get("sem", []):
        buraco.update((x, y) for y in range(y0, y1+1) for x in range(x0, x1+1) if a(x, y) and not beira(x, y))
    def perto(x, y):
        return ((x-xa)/(r*2))**2 + ((y-ya)/(r*2+1))**2 <= 1 or ((x-xb)/(r*2))**2 + ((y-yb)/(r*2+1))**2 <= 1 \
            or ((x-bx)/(meia*1.7))**2 + ((y-by)/max(4, dist*0.45))**2 <= 1
    def em_volta(cx, cy):
        cont = {}; R0 = r*2+1; R1 = r*2+4
        for y in range(math.floor(cy-R1), math.floor(cy+R1)+1):
            for x in range(math.floor(cx-R1), math.floor(cx+R1)+1):
                e = math.hypot(x-cx, y-cy)
                if e < R0 or e > R1 or not a(x, y) or luz(p[x, y]) < 0.22: continue
                k = p[x, y][:3]; cont[k] = cont.get(k, 0)+1
        return max(cont, key=cont.get) if cont else None
    olhos_cor = [(xa, ya, em_volta(xa, ya)), (xb, yb, em_volta(xb, yb))]
    def cor_do_olho(x, y, c):
        return any(cc and ((x-cx)/(r*2))**2 + ((y-cy)/(r*2+1))**2 <= 1 and sum(abs(c[j]-cc[j]) for j in range(3)) > 110 for cx, cy, cc in olhos_cor)
    fila = list(buraco)
    while fila:     # o risco escuro grudado entra também
        x, y = fila.pop()
        for q in ((x+1, y), (x-1, y), (x, y+1), (x, y-1)):
            if q in buraco or vf(*q) or beira(*q) or not perto(*q): continue
            c = p[q]
            lingua = (c[0] > c[1]+50 and c[0] > c[2]+20 or luz(c) > 0.8) and abs(q[0]-bx) <= meia and abs(q[1]-by) <= max(3, dist*0.45)
            if c[3] == 0: p[q] = (0, 0, 0, 255)       # buraco de dentro da boca: vira corpo
            elif luz(c) >= 0.3 and not lingua and not cor_do_olho(q[0], q[1], c): continue
            buraco.add(q); fila.append(q)
    while buraco:   # de fora pra dentro, com a cor dos vizinhos (igual ao caraditto.js)
        pintar = []
        for (x, y) in buraco:
            cont = {}
            for dy in (-1, 0, 1):
                for dx in (-1, 0, 1):
                    q = (x+dx, y+dy)
                    if (not dx and not dy) or not a(*q) or q in buraco: continue
                    c = p[q][:3]; peso = (0.01 if luz(c) < 0.22 else 1) * (0.7 if dx and dy else 1)
                    cont[c] = cont.get(c, 0) + peso
            if cont: pintar.append(((x, y), max(cont, key=cont.get)))
        if not pintar: break
        for q, c in pintar: pinta(q[0], q[1], c); buraco.discard(q)
    if fechar:
        cont = {}
        for y in range(H):
            for x in range(W):
                if p[x, y][3] and luz(p[x, y]) < 0.3: cont[p[x, y][:3]] = cont.get(p[x, y][:3], 0) + 1
        if cont:
            c = max(cont, key=cont.get)
            for q in fechar:
                if beira(*q): pinta(q[0], q[1], c)
    fundo = sorted(luz(p[round(x)+i, round(y)+j]) for x, y in ((xa, ya), (xb, yb), (bx, by)) for i in range(-3, 4) for j in range(-3, 4) if a(round(x)+i, round(y)+j)) or [1]
    P = (236, 236, 236) if fundo[len(fundo)//2] < 0.4 else (16, 16, 16)   # a luz do MEIO em volta da cara
    if DEBUG: print(n, fundo[len(fundo)//2], P)
    ew = max(2, round(W/32)); eh = ew+1
    for x, y in ((xa, ya), (xb, yb)):
        for j in range(eh):
            for i in range(ew): pinta(x+i-(ew >> 1), y+j-(eh >> 1), P)
    for x in range(bx-meia, bx+meia+1): pinta(x, by, P)
    pinta(bx-meia-1, by-1, P); pinta(bx+meia+1, by-1, P)
    if W >= 80: pinta(bx-meia-2, by-2, P); pinta(bx+meia+2, by-2, P)
    if GRAVAR: im.save(f"{RAIZ}/assets/sprites/pokemon/ditto/{pad(n)}.png")
    return im

def lista():
    d = f"{RAIZ}/assets/sprites/pokemon/ditto"
    nums = sorted(int(f[:-4]) for f in os.listdir(d) if f.endswith(".png") and f[:-4].isdigit())
    json.dump(nums, open(f"{d}/lista.json", "w"))

GRAVAR = "--gravar" in sys.argv
DEBUG = "--debug" in sys.argv
if __name__ == "__main__":
    sys.argv = [a for a in sys.argv if a not in ("--gravar", "--debug")]
    M = json.load(open(sys.argv[1]))
    feitos = [(int(k), fazer(int(k), v)) for k, v in M.items()]
    if GRAVAR: lista()
    if len(sys.argv) > 2:   # folha pra conferir: antes | depois, 3x
        L = 288; F = Image.new("RGBA", (2*L+8, len(feitos)*(L+8)), (225, 235, 225, 255))
        for i, (n, im) in enumerate(feitos):
            o = Image.open(f"{RAIZ}/assets/sprites/pokemon/{pad(n)}.png").convert("RGBA")
            F.alpha_composite(o.resize((L, L), Image.NEAREST), (0, i*(L+8)))   # (todos do mesmo tamanho na folha)
            F.alpha_composite(im.resize((L, L), Image.NEAREST), (L+8, i*(L+8)))
        F.save(sys.argv[2])
    print("feitos", len(feitos))
