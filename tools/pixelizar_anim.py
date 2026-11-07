"""PIXELIZAR UMA ANIMAÇÃO 3D (pedido do CAIO, nov/2026: o BRAVIARY DE HISUI só tem
a animação do modelo 3D — "então pelo menos faz parecer 2d").
Cada quadro do GIF do Showdown (sprites/ani/<nome>.gif) vira pixel art:
  1. diminui pro tamanho do DESENHO PARADO do jogo (pela largura do que tem pixel),
     sem borrar (pega o pixel do meio de cada bloco);
  2. troca cada cor pela MAIS PARECIDA da paleta do desenho parado;
  3. sem meia-transparência (ou tem pixel, ou não tem) e com o CONTORNO preto de 1 pixel.
Uso: python3 tools/pixelizar_anim.py <gif> <sprite parado.png> <saida folha.png>
Imprime o [w, h, colunas, tempos] pro anim/quadros.json."""
import sys, json
from PIL import Image, ImageSequence

def paleta(sprite):
    cores = {}
    for p in sprite.getdata():
        if p[3] > 128: cores[p[:3]] = cores.get(p[:3], 0) + 1
    return [c for c, n in cores.items() if n >= 3]

def perto(c, pal):
    return min(pal, key=lambda q: (q[0] - c[0]) ** 2 * 0.3 + (q[1] - c[1]) ** 2 * 0.59 + (q[2] - c[2]) ** 2 * 0.11)

def main(gif, parado, saida):
    sp = Image.open(parado).convert("RGBA")
    pal = paleta(sp)
    contorno = min(pal, key=lambda c: sum(c))
    bb = sp.getbbox(); alvo_w = bb[2] - bb[0]; alvo_h = bb[3] - bb[1]
    g = Image.open(gif)
    quadros, tempos = [], []
    for fr in ImageSequence.Iterator(g):
        quadros.append(fr.convert("RGBA")); tempos.append(fr.info.get("duration", 80) or 80)
    # o tamanho do bicho no GIF: a caixa de todos os quadros juntos
    caixas = [q.getbbox() for q in quadros if q.getbbox()]
    gw = max(b[2] for b in caixas) - min(b[0] for b in caixas)
    gh = max(b[3] for b in caixas) - min(b[1] for b in caixas)
    k = min(alvo_w / gw, alvo_h / gh)
    W, H = max(1, round(quadros[0].width * k)), max(1, round(quadros[0].height * k))
    saidas = []
    for q in quadros:
        # diminui pegando o pixel do MEIO de cada bloco (sem misturar cor)
        peq = Image.new("RGBA", (W, H), (0, 0, 0, 0)); pq = peq.load(); qq = q.load()
        for y in range(H):
            for x in range(W):
                sx = min(q.width - 1, int((x + 0.5) / k)); sy = min(q.height - 1, int((y + 0.5) / k))
                c = qq[sx, sy]
                if c[3] > 110: pq[x, y] = perto(c[:3], pal) + (255,)
        # o CONTORNO: pixel vazio encostado no bicho vira contorno
        cont = []
        for y in range(H):
            for x in range(W):
                if pq[x, y][3]: continue
                if any(0 <= x + dx < W and 0 <= y + dy < H and pq[x + dx, y + dy][3] and pq[x + dx, y + dy][:3] != contorno
                       for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))): cont.append((x, y))
        for x, y in cont: pq[x, y] = contorno + (255,)
        saidas.append(peq)
    col = min(8, len(saidas)); lin = (len(saidas) + col - 1) // col
    folha = Image.new("RGBA", (W * col, H * lin), (0, 0, 0, 0))
    for i, s in enumerate(saidas): folha.alpha_composite(s, ((i % col) * W, (i // col) * H))
    folha.save(saida)
    print(json.dumps([W, H, col, tempos]))

if __name__ == "__main__":
    main(*sys.argv[1:4])
