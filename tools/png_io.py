"""Leitura/escrita de PNG sem dependências (usado pelos utilitários de sprite).

read_png devolve sempre (largura, altura, bytearray RGBA).
Suporta grayscale/RGB/paleta/alpha com profundidade 1, 2, 4 ou 8 bits.
"""
import struct
import zlib

__all__ = ["read_png", "write_png"]


def _unfilter(raw, w, h, channels, depth):
    bpp = max(1, (channels * depth) // 8)
    stride = (w * channels * depth + 7) // 8
    out, prev, i = bytearray(), bytearray(stride), 0
    for _ in range(h):
        f = raw[i]; i += 1
        line = bytearray(raw[i:i + stride]); i += stride
        for x in range(stride):
            a = line[x - bpp] if x >= bpp else 0
            b = prev[x]
            c = prev[x - bpp] if x >= bpp else 0
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
    return out, stride


def _samples(row, w, depth, channels):
    """Desempacota uma linha em valores por amostra."""
    if depth == 8:
        return row
    out = []
    per_byte = 8 // depth
    mask = (1 << depth) - 1
    for byte in row:
        for k in range(per_byte):
            out.append((byte >> (8 - depth * (k + 1))) & mask)
    return out[:w * channels]


def read_png(path):
    data = open(path, "rb").read()
    assert data[:8] == b"\x89PNG\r\n\x1a\n", f"{path}: não é PNG"
    pos, idat, palette, trns = 8, b"", b"", b""
    w = h = depth = ctype = 0
    while pos < len(data):
        ln = struct.unpack(">I", data[pos:pos + 4])[0]
        typ = data[pos + 4:pos + 8]
        chunk = data[pos + 8:pos + 8 + ln]
        if typ == b"IHDR":
            w, h, depth, ctype = struct.unpack(">IIBB", chunk[:10])
        elif typ == b"IDAT": idat += chunk
        elif typ == b"PLTE": palette = chunk
        elif typ == b"tRNS": trns = chunk
        pos += 12 + ln
    channels = {0: 1, 2: 3, 3: 1, 4: 2, 6: 4}[ctype]
    raw, stride = _unfilter(zlib.decompress(idat), w, h, channels, depth)

    px = bytearray(w * h * 4)
    maxv = (1 << depth) - 1
    for y in range(h):
        row = _samples(raw[y * stride:(y + 1) * stride], w, depth, channels)
        for x in range(w):
            o = (y * w + x) * 4
            if ctype == 3:
                k = row[x]
                px[o:o + 3] = palette[k * 3:k * 3 + 3] or b"\0\0\0"
                px[o + 3] = trns[k] if k < len(trns) else 255
            elif ctype == 0:
                v = row[x] * 255 // maxv
                px[o:o + 4] = bytes([v, v, v, 255])
            elif ctype == 4:
                v, a = row[x * 2], row[x * 2 + 1]
                px[o:o + 4] = bytes([v, v, v, a])
            elif ctype == 2:
                px[o:o + 3] = bytes(row[x * 3:x * 3 + 3]); px[o + 3] = 255
            else:
                px[o:o + 4] = bytes(row[x * 4:x * 4 + 4])
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
