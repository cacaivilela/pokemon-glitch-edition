"""Leitura dos tilesets do decomp pret/pokefirered (tiles 8x8 -> metatiles 16x16)."""
import os
import struct
import urllib.request
import zlib

# Os dois decomps têm a MESMA estrutura de arquivos; muda o tamanho do tileset
# primário e a largura dos atributos de metatile (FRLG 4 bytes, Emerald 2).
REPOS = {
    # pals: quantas paletas pertencem ao tileset primário (o resto é do secundário)
    "pokefirered": {"primary": 640, "attr": 4, "behavior_mask": 0x1FF, "layer_shift": 29, "pals": 7},
    "pokeemerald": {"primary": 512, "attr": 2, "behavior_mask": 0xFF, "layer_shift": 12, "pals": 6},
}
REPO = "pokefirered"
RAW = f"https://raw.githubusercontent.com/pret/{REPO}/master"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE = os.path.join(ROOT, "assets", "sprites", ".cache", "pret", REPO)
NUM_PRIMARY = REPOS[REPO]["primary"]


def set_repo(nome):
    """Troca o decomp de origem (pokefirered <-> pokeemerald)."""
    global REPO, RAW, CACHE, NUM_PRIMARY
    if nome not in REPOS:
        raise SystemExit(f"decomp desconhecido: {nome}")
    REPO = nome
    RAW = f"https://raw.githubusercontent.com/pret/{REPO}/master"
    CACHE = os.path.join(ROOT, "assets", "sprites", ".cache", "pret", REPO)
    NUM_PRIMARY = REPOS[REPO]["primary"]
    Tileset._cache.clear()
    _mt_cache.clear()


def fetch(path, binary=True):
    dest = os.path.join(CACHE, path.replace("/", "__"))
    if not os.path.exists(dest):
        os.makedirs(CACHE, exist_ok=True)
        req = urllib.request.Request(f"{RAW}/{path}", headers={"User-Agent": "pge/1.0"})
        with urllib.request.urlopen(req, timeout=60) as r:
            data = r.read()
        with open(dest, "wb") as f:
            f.write(data)
    return open(dest, "rb").read() if binary else open(dest, encoding="utf-8", errors="replace").read()


def png_indices(data):
    """(w, h, linhas de índices) de um PNG indexado de 4 ou 8 bits."""
    pos, idat, w, h, depth = 8, b"", 0, 0, 8
    while pos < len(data):
        ln = struct.unpack(">I", data[pos:pos + 4])[0]
        typ = data[pos + 4:pos + 8]
        if typ == b"IHDR":
            w, h, depth = struct.unpack(">IIB", data[pos + 8:pos + 17])
        elif typ == b"IDAT":
            idat += data[pos + 8:pos + 8 + ln]
        pos += 12 + ln
    raw = zlib.decompress(idat)
    stride = (w * depth + 7) // 8
    rows, prev, i = [], bytearray(stride), 0
    for _ in range(h):
        f = raw[i]; i += 1
        line = bytearray(raw[i:i + stride]); i += stride
        for x in range(stride):
            a = line[x - 1] if x >= 1 else 0
            b = prev[x]
            c = prev[x - 1] if x >= 1 else 0
            if f == 1: line[x] = (line[x] + a) & 255
            elif f == 2: line[x] = (line[x] + b) & 255
            elif f == 3: line[x] = (line[x] + (a + b) // 2) & 255
            elif f == 4:
                p = a + b - c
                pa, pb, pc = abs(p - a), abs(p - b), abs(p - c)
                pr = a if (pa <= pb and pa <= pc) else (b if pb <= pc else c)
                line[x] = (line[x] + pr) & 255
        px = []
        if depth == 4:
            for byte in line:
                px += [byte >> 4, byte & 15]
        else:
            px = list(line)
        rows.append(px[:w])
        prev = line
    return w, h, rows


def load_pal(path):
    txt = fetch(path, binary=False)
    vals = [l.strip() for l in txt.splitlines()[3:] if l.strip()]
    return [tuple(int(v) for v in l.split()[:3]) for l in vals][:16]


def folder_for(label):
    """gTileset_GenericBuilding1 -> secondary/generic_building_1"""
    name = label.replace("gTileset_", "")
    out = ""
    for i, ch in enumerate(name):
        if ch.isupper() and i:
            out += "_"
        elif ch.isdigit() and not name[i - 1].isdigit():
            out += "_"
        out += ch.lower()
    kind = "primary" if out in ("general", "building") else "secondary"
    return f"{kind}/{out}"


class Tileset:
    _cache = {}

    def __new__(cls, folder):
        if folder in cls._cache:
            return cls._cache[folder]
        self = super().__new__(cls)
        base = f"data/tilesets/{folder}"
        self.folder = folder
        self.w, self.h, self.px = png_indices(fetch(f"{base}/tiles.png"))
        self.cols = self.w // 8
        self.meta = fetch(f"{base}/metatiles.bin")
        self.attrs = fetch(f"{base}/metatile_attributes.bin")
        self.count = len(self.meta) // 16
        self.pals = [load_pal(f"{base}/palettes/{i:02d}.pal") for i in range(16)]
        cls._cache[folder] = self
        return self

    def tile(self, tid, x, y):
        # metatiles não usados do decomp apontam pra tile inexistente: vira vazio
        tx, ty = (tid % self.cols) * 8, (tid // self.cols) * 8
        if ty + y >= len(self.px):
            return 0
        linha = self.px[ty + y]
        return linha[tx + x] if tx + x < len(linha) else 0

    def attr(self, local_id):
        largura = REPOS[REPO]["attr"]
        o = local_id * largura
        if o + largura > len(self.attrs):
            return 0
        fmt = "<I" if largura == 4 else "<H"
        return struct.unpack(fmt, self.attrs[o:o + largura])[0]

    def layer_type(self, local_id):
        # 0 NORMAL (a camada de cima passa por cima do sprite),
        # 1 COVERED (tudo por baixo), 2 SPLIT (de cima por cima)
        return (self.attr(local_id) >> REPOS[REPO]["layer_shift"]) & 3

    def behavior(self, local_id):
        return self.attr(local_id) & REPOS[REPO]["behavior_mask"]


def behavior_of(prim, sec, mid):
    ts, local = (prim, mid) if mid < NUM_PRIMARY else (sec, mid - NUM_PRIMARY)
    return ts.behavior(local) if ts else 0


_mt_cache = {}


def metatile_rgba(prim, sec, mid, mode):
    """16x16 RGBA de um metatile, com cache (mapas reusam muito)."""
    key = (prim.folder, sec.folder if sec else None, mid, mode)
    hit = _mt_cache.get(key)
    if hit is None:
        buf = bytearray(16 * 16 * 4)
        _draw(prim, sec, mid, buf, 0, 0, 16, mode)
        _mt_cache[key] = hit = buf
    return hit


def blit_metatile(prim, sec, mid, out, ox, oy, ow, mode="all"):
    """Copia o metatile já renderizado para o mapa (linha a linha)."""
    src = metatile_rgba(prim, sec, mid, mode)
    for y in range(16):
        d = ((oy + y) * ow + ox) * 4
        s = y * 64
        out[d:d + 64] = src[s:s + 64]


def draw_metatile(prim, sec, mid, out, ox, oy, ow, mode="all"):
    """Desenha o metatile global `mid` (16x16) em out (RGBA).

    mode: "all" tudo | "ground" só o que fica atrás do jogador
          | "over" só a camada que passa por cima dele.
    """
    blit_metatile(prim, sec, mid, out, ox, oy, ow, mode)


def _draw(prim, sec, mid, out, ox, oy, ow, mode="all"):
    ts, local = (prim, mid) if mid < NUM_PRIMARY else (sec, mid - NUM_PRIMARY)
    if ts is None or local * 16 + 16 > len(ts.meta):
        return
    entries = struct.unpack("<8H", ts.meta[local * 16:local * 16 + 16])
    covered = ts.layer_type(local) == 1  # 1 = tudo por baixo do sprite
    for layer in range(2):
        over = layer == 1 and not covered
        if mode == "ground" and over:
            continue
        if mode == "over" and not over:
            continue
        for i in range(4):
            e = entries[layer * 4 + i]
            tid, xflip, yflip, pal = e & 0x3FF, (e >> 10) & 1, (e >> 11) & 1, (e >> 12) & 0xF
            src, ltid = (prim, tid) if tid < NUM_PRIMARY else (sec, tid - NUM_PRIMARY)
            if src is None:
                continue
            corte = REPOS[REPO]["pals"]
            palette = (sec if (pal >= corte and sec) else prim).pals[pal]
            bx, by = (i % 2) * 8, (i // 2) * 8
            for y in range(8):
                for x in range(8):
                    idx = src.tile(ltid, 7 - x if xflip else x, 7 - y if yflip else y)
                    if layer == 1 and idx == 0:
                        continue
                    r, g, b = palette[idx] if idx < len(palette) else (0, 0, 0)
                    d = ((oy + by + y) * ow + ox + bx + x) * 4
                    out[d:d + 4] = bytes([r, g, b, 255])
