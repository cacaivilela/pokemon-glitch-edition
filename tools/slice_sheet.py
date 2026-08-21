#!/usr/bin/env python3
"""Corta uma spritesheet em quadros numerados. Sem dependências externas.

    python3 tools/slice_sheet.py folha.png 64 64 assets/sprites/pokemon --start 1

Lê e escreve PNG diretamente (zlib + struct), então funciona sem Pillow.
"""
import os
import struct
import sys
import zlib


def read_png(path):
    data = open(path, "rb").read()
    assert data[:8] == b"\x89PNG\r\n\x1a\n", "não é um PNG"
    pos, idat, w, h, depth, ctype = 8, b"", 0, 0, 8, 6
    palette, trns = b"", b""
    while pos < len(data):
        ln = struct.unpack(">I", data[pos:pos + 4])[0]
        typ = data[pos + 4:pos + 8]
        chunk = data[pos + 8:pos + 8 + ln]
        if typ == b"IHDR":
            w, h, depth, ctype = struct.unpack(">IIBB", chunk[:10])
        elif typ == b"IDAT":
            idat += chunk
        elif typ == b"PLTE":
            palette = chunk
        elif typ == b"tRNS":
            trns = chunk
        pos += 12 + ln
    assert depth == 8, "só PNG de 8 bits por canal"
    raw = zlib.decompress(idat)
    channels = {0: 1, 2: 3, 3: 1, 4: 2, 6: 4}[ctype]
    stride = w * channels
    out, prev = bytearray(), bytearray(stride)
    i = 0
    for _ in range(h):
        f = raw[i]; i += 1
        line = bytearray(raw[i:i + stride]); i += stride
        for x in range(stride):
            a = line[x - channels] if x >= channels else 0
            b = prev[x]
            c = prev[x - channels] if x >= channels else 0
            if f == 1: line[x] = (line[x] + a) & 255
            elif f == 2: line[x] = (line[x] + b) & 255
            elif f == 3: line[x] = (line[x] + (a + b) // 2) & 255
            elif f == 4:
                p = a + b - c
                pa, pb, pc = abs(p - a), abs(p - b), abs(p - c)
                pr = a if (pa <= pb and pa <= pc) else (b if pb <= pc else c)
                line[x] = (line[x] + pr) & 255
        out += line
        prev = line
    # normaliza tudo pra RGBA
    px = bytearray(w * h * 4)
    for j in range(w * h):
        if ctype == 6: px[j * 4:j * 4 + 4] = out[j * 4:j * 4 + 4]
        elif ctype == 2: px[j * 4:j * 4 + 3] = out[j * 3:j * 3 + 3]; px[j * 4 + 3] = 255
        elif ctype == 0: v = out[j]; px[j * 4:j * 4 + 4] = bytes([v, v, v, 255])
        elif ctype == 4: v, a = out[j * 2], out[j * 2 + 1]; px[j * 4:j * 4 + 4] = bytes([v, v, v, a])
        elif ctype == 3:
            k = out[j]
            px[j * 4:j * 4 + 3] = palette[k * 3:k * 3 + 3]
            px[j * 4 + 3] = trns[k] if k < len(trns) else 255
    return w, h, px


def write_png(path, w, h, px):
    raw = b"".join(b"\x00" + bytes(px[y * w * 4:(y + 1) * w * 4]) for y in range(h))
    def chunk(t, d):
        return struct.pack(">I", len(d)) + t + d + struct.pack(">I", zlib.crc32(t + d) & 0xFFFFFFFF)
    open(path, "wb").write(
        b"\x89PNG\r\n\x1a\n"
        + chunk(b"IHDR", struct.pack(">IIBBBBB", w, h, 8, 6, 0, 0, 0))
        + chunk(b"IDAT", zlib.compress(raw, 9))
        + chunk(b"IEND", b"")
    )


def main():
    if len(sys.argv) < 5:
        print(__doc__)
        return 1
    src, fw, fh, outdir = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), sys.argv[4]
    start = int(sys.argv[sys.argv.index("--start") + 1]) if "--start" in sys.argv else 1
    w, h, px = read_png(src)
    os.makedirs(outdir, exist_ok=True)
    n = start
    for gy in range(h // fh):
        for gx in range(w // fw):
            frame = bytearray(fw * fh * 4)
            empty = True
            for y in range(fh):
                s = ((gy * fh + y) * w + gx * fw) * 4
                row = px[s:s + fw * 4]
                if any(row[3::4]):
                    empty = False
                frame[y * fw * 4:(y + 1) * fw * 4] = row
            if empty:
                continue
            name = f"{n:03d}.png"
            write_png(os.path.join(outdir, name), fw, fh, frame)
            n += 1
    print(f"{n - start} quadro(s) salvo(s) em {outdir}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
