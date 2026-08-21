#!/usr/bin/env python3
"""Extrai tiles do FireRed (decomp pret/pokefirered) montando os metatiles 16x16.

    python3 tools/fetch_tileset.py --sheet primary/general      # folha de contato
    python3 tools/fetch_tileset.py --sheet secondary/viridian_city
    python3 tools/fetch_tileset.py --export                     # grava assets/sprites/tiles/

Como funciona: cada metatile de 16x16 são 8 tiles de 8x8 (4 da camada de baixo +
4 da de cima), cada um com id, espelhamento e paleta próprios. Os ids abaixo de
640 vêm do tileset primário; os demais, do secundário.

Arte da Nintendo / Creatures / Game Freak — fica só na sua máquina (gitignored).
"""
import argparse
import os
import struct
import sys
import urllib.request
import zlib

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from png_io import write_png  # noqa: E402

RAW = "https://raw.githubusercontent.com/pret/pokefirered/master/data/tilesets"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE = os.path.join(ROOT, "assets", "sprites", ".cache", "tilesets")
OUT = os.path.join(ROOT, "assets", "sprites", "tiles")
PRIMARY_TILES = 640  # tiles de 8x8 do tileset primário do FRLG


def fetch(path, binary=True):
    dest = os.path.join(CACHE, path.replace("/", "__"))
    if not os.path.exists(dest):
        os.makedirs(CACHE, exist_ok=True)
        req = urllib.request.Request(f"{RAW}/{path}", headers={"User-Agent": "pge/1.0"})
        with urllib.request.urlopen(req, timeout=40) as r:
            data = r.read()
        with open(dest, "wb") as f:
            f.write(data)
    return open(dest, "rb").read() if binary else open(dest).read()


def png_indices(data):
    """Devolve (w, h, índices de paleta) de um PNG indexado de 4 ou 8 bits."""
    pos, idat, w, h, depth = 8, b"", 0, 0, 8
    while pos < len(data):
        ln = struct.unpack(">I", data[pos:pos + 4])[0]
        typ = data[pos + 4:pos + 8]
        if typ == b"IHDR":
            w, h, depth, ctype = struct.unpack(">IIBB", data[pos + 8:pos + 18])[:4]
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
    nums = [l.strip() for l in txt.splitlines()[3:] if l.strip()]
    return [tuple(int(v) for v in l.split()[:3]) for l in nums][:16]


class Tileset:
    def __init__(self, name):
        self.name = name
        self.w, self.h, self.px = png_indices(fetch(f"{name}/tiles.png"))
        self.cols = self.w // 8
        self.meta = fetch(f"{name}/metatiles.bin")
        self.count = len(self.meta) // 16
        self.pals = [load_pal(f"{name}/palettes/{i:02d}.pal") for i in range(16)]

    def tile_px(self, tid, x, y):
        tx, ty = (tid % self.cols) * 8, (tid // self.cols) * 8
        return self.px[ty + y][tx + x]


def render(prim, sec, n, out, ox, oy, ow):
    """Desenha o metatile n (do sec, ou do prim se sec for None) em out."""
    ts = sec or prim
    base = ts.meta[n * 16:n * 16 + 16]
    entries = struct.unpack("<8H", base)
    for layer in range(2):
        for i in range(4):
            e = entries[layer * 4 + i]
            tid, xflip, yflip, pal = e & 0x3FF, (e >> 10) & 1, (e >> 11) & 1, (e >> 12) & 0xF
            src = prim if tid < PRIMARY_TILES else sec
            if src is None:
                continue
            local = tid if tid < PRIMARY_TILES else tid - PRIMARY_TILES
            palette = (sec or prim).pals[pal] if pal >= 7 and sec else prim.pals[pal]
            bx, by = (i % 2) * 8, (i // 2) * 8
            for y in range(8):
                for x in range(8):
                    sxx = 7 - x if xflip else x
                    syy = 7 - y if yflip else y
                    idx = src.tile_px(local, sxx, syy)
                    if layer == 1 and idx == 0:
                        continue
                    r, g, b = palette[idx] if idx < len(palette) else (0, 0, 0)
                    d = ((oy + by + y) * ow + ox + bx + x) * 4
                    out[d:d + 4] = bytes([r, g, b, 255])


def contact_sheet(name, scale=2):
    prim = Tileset("primary/general")
    sec = None if name == "primary/general" else Tileset(name)
    ts = sec or prim
    cols = 16
    rows = (ts.count + cols - 1) // cols
    w, h = cols * 16, rows * 16
    px = bytearray(w * h * 4)
    for n in range(ts.count):
        render(prim, sec, n, px, (n % cols) * 16, (n // cols) * 16, w)
    if scale > 1:
        ow, oh = w * scale, h * scale
        big = bytearray(ow * oh * 4)
        for y in range(oh):
            for x in range(ow):
                s = ((y // scale) * w + (x // scale)) * 4
                big[(y * ow + x) * 4:(y * ow + x) * 4 + 4] = px[s:s + 4]
        w, h, px = ow, oh, big
    os.makedirs(os.path.join(ROOT, "dev", "tilesheets"), exist_ok=True)
    dest = os.path.join(ROOT, "dev", "tilesheets", name.replace("/", "_") + ".png")
    write_png(dest, w, h, px)
    print(f"{name}: {ts.count} metatiles -> {dest}")
    return dest


def export(mapping):
    os.makedirs(OUT, exist_ok=True)
    cache = {}
    for file, (tileset, idx) in mapping.items():
        if tileset not in cache:
            cache[tileset] = (Tileset("primary/general"),
                              None if tileset == "primary/general" else Tileset(tileset))
        prim, sec = cache[tileset]
        px = bytearray(16 * 16 * 4)
        render(prim, sec, idx, px, 0, 0, 16)
        write_png(os.path.join(OUT, f"{file}.png"), 16, 16, px)
    print(f"{len(mapping)} tiles exportados para {OUT}")


# preenchido depois de olhar as folhas de contato
MAPPING = {}

if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--sheet")
    ap.add_argument("--export", action="store_true")
    a = ap.parse_args()
    if a.sheet:
        contact_sheet(a.sheet)
    elif a.export:
        export(MAPPING)
    else:
        ap.print_help()
