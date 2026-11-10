#!/usr/bin/env python3
"""VOZES SINTETIZADAS: um grito "gravado" a partir da onomatopeia, sem microfone.

O Estúdio de Gritos grava a voz de quem joga. Este script faz o mesmo papel sem
ninguém falar: lê a onomatopeia (o `som` do grito, "AUUUUUU! GRRRR") e monta uma
VOZ de verdade — cordas vocais (um pulso com vibrato e um tremor de leve) passando
pelas RESSONÂNCIAS DA BOCA de cada vogal (os formantes do A, E, I, O, U, mudando
devagar de uma pra outra), CHIADO pras consoantes de sopro (S, X, CH, F), ESTALO
pras de batida (T, P, K, B, D, G), som NASAL (M, N, NH), a vibração do RR, e
silêncios nos hífens, espaços e reticências. Letra repetida estica; "!" dá
ênfase (sobe e fica mais forte); "~" treme e cai; "?" sobe no fim.

Python puro (sem numpy): sai um WAV mono 44,1 kHz.

    python3 tools/vozes/voz.py "AUUUUUU! GRRRR" saida.wav --f0 140 [--rouco 0.3]
"""
import argparse
import math
import random
import struct
import wave

TAXA = 44100

# os FORMANTES de cada vogal (Hz) e a largura de cada um: a "forma da boca"
VOGAIS = {
    "a": ((800, 80), (1250, 90), (2600, 120)),
    "e": ((480, 70), (2000, 100), (2650, 120)),
    "i": ((300, 60), (2300, 100), (3000, 120)),
    "o": ((520, 70), (900, 80), (2450, 120)),
    "u": ((330, 60), (750, 80), (2400, 120)),
    "m": ((260, 60), (1200, 150), (2500, 200)),   # nasal: quase tudo grave
    "l": ((380, 70), (1100, 100), (2500, 150)),
}
ACENTO = str.maketrans("ÁÀÂÃÉÊÍÓÔÕÚÇ", "AAAAEEIOOOUC")


def fonemas(texto):
    """A onomatopeia vira uma lista de pedaços: (tipo, valor, duração em s, ênfase)."""
    t = texto.upper().translate(ACENTO)
    seg, i = [], 0
    while i < len(t):
        ch = t[i]
        n = 1
        while i + n < len(t) and t[i + n] == ch:
            n += 1
        nxt = t[i + n] if i + n < len(t) else ""
        if ch in "AEIOU":
            nasal = ch == "A" and texto.upper()[i:i + 1] == "Ã"
            seg.append(("v", ch.lower(), 0.12 + 0.08 * (n - 1), nasal))
        elif ch == "Y":
            seg.append(("v", "i", 0.08 * n, False))
        elif ch == "W":
            seg.append(("v", "u", 0.06 * n, False))
        elif ch == "C" and nxt == "H" or ch == "X":
            seg.append(("ruido", "ch", 0.07 + 0.04 * (n - 1), False))
            if ch == "C":
                n += 1
        elif ch == "N" and nxt == "H":
            seg.append(("v", "m", 0.05, False)); seg.append(("v", "i", 0.03, False)); n += 1
        elif ch in "SZ":
            seg.append(("ruido", "s", 0.07 + 0.05 * (n - 1), ch == "Z"))
        elif ch in "FV":
            seg.append(("ruido", "f", 0.06 + 0.04 * (n - 1), ch == "V"))
        elif ch in "TDPBKQCG":
            seg.append(("batida", ch, 0.035, ch in "DBG"))
            if ch == "Q" and nxt == "U":
                n += 1
        elif ch in "MN":
            seg.append(("v", "m", 0.06 + 0.05 * (n - 1), False))
        elif ch == "L":
            seg.append(("v", "l", 0.05 * n, False))
        elif ch == "R":
            seg.append(("trem", "r", 0.05 if n == 1 else 0.09 + 0.06 * (n - 2), False))
        elif ch == "H":
            seg.append(("ruido", "h", 0.05 * n, False))
        elif ch == "-":
            seg.append(("pausa", "", 0.035, False))
        elif ch == " ":
            seg.append(("pausa", "", 0.07, False))
        elif ch == ".":
            seg.append(("pausa", "", 0.07 * n, False))
        elif ch in "!?~":
            seg.append(("marca", ch, 0, False))
        i += n
    return seg


class Ressonador:
    """filtro de 2 polos (um formante)"""
    def __init__(self):
        self.y1 = self.y2 = 0.0

    def passa(self, x, f, bw):
        r = math.exp(-math.pi * bw / TAXA)
        c = -r * r
        b = 2 * r * math.cos(2 * math.pi * f / TAXA)
        a = 1 - b - c
        y = a * x + b * self.y1 + c * self.y2
        self.y2, self.y1 = self.y1, y
        return y


def sintetiza(texto, f0=220.0, rouco=0.15, semente=1):
    rnd = random.Random(semente)
    seg = fonemas(texto)
    # a ênfase de cada palavra: "!" depois dela sobe e fica mais forte; "~" treme; "?" sobe no fim
    palavras, atual = [], []
    for s in seg:
        if s[0] == "marca":
            for k in atual:
                k["marca"] = s[1]
        elif s[0] == "pausa" and s[2] >= 0.07:
            palavras.append(atual); atual = []
            palavras.append([{"s": s, "marca": ""}])
            continue
        atual.append({"s": s, "marca": ""})
    palavras.append(atual)
    trechos = [k for p in palavras for k in p]

    out = []
    forms = [Ressonador() for _ in range(3)]
    tilt1 = tilt2 = tilt3 = 0.0  # a fonte perde força nos agudos (como as cordas vocais de verdade)
    f_atual = list(VOGAIS["a"])
    fase = 0.0
    total = sum(k["s"][2] for k in trechos) or 0.1
    t_global = 0.0
    for k in trechos:
        tipo, val, dur, extra = k["s"]
        marca = k["marca"]
        n = max(1, int(dur * TAXA))
        alvo = VOGAIS.get(val if tipo == "v" else ("l" if tipo == "trem" else "a"))
        for j in range(n):
            tt = j / n
            # a altura: cai devagar ao longo do grito (como uma frase), sobe no "!" e no "?"
            p = f0 * (1.08 - 0.22 * (t_global / total))
            if marca == "!":
                p *= 1.0 + 0.18 * math.sin(math.pi * min(1, tt * 1.4))
            elif marca == "?":
                p *= 1.0 + 0.35 * tt
            elif marca == "~":
                p *= 1.0 - 0.18 * tt
            vib = 0.035 if marca == "~" else 0.012
            p *= 1 + vib * math.sin(2 * math.pi * (6.0 if marca == "~" else 5.0) * t_global) + rnd.uniform(-0.004, 0.004)
            fase += p / TAXA
            fase -= int(fase)
            # o pulso das cordas vocais (dente de serra suavizado) + o sopro (rouquidão)
            pulso = (1 - 2 * fase) * (1 - math.exp(-8 * fase)) + rouco * rnd.uniform(-1, 1)
            tilt1 += 0.10 * (pulso - tilt1)          # três passa-baixas de um polo: os agudos somem como numa voz
            tilt2 += 0.14 * (tilt1 - tilt2)
            tilt3 += 0.30 * (tilt2 - tilt3)
            pulso = tilt3
            # a boca vai mudando de uma vogal pra outra (não pula)
            for q in range(3):
                fa, ba = f_atual[q]
                ft, bt = alvo[q]
                f_atual[q] = (fa + (ft - fa) * 0.0025, ba + (bt - ba) * 0.0025)
            # a boca: as três ressonâncias EM SEQUÊNCIA (como o trato vocal), não somadas
            voz = pulso
            for r, (f, b) in zip(forms, f_atual):
                voz = r.passa(voz, f, b)
            env = min(1, tt * 12, (1 - tt) * 12) if tipo in ("v", "trem") else 1
            amp = 1.25 if marca == "!" else 1.0
            if tipo == "v":
                s = voz * env * amp * (0.55 if val in "ml" else 1.0)
            elif tipo == "trem":
                s = voz * env * amp * (0.55 + 0.45 * math.sin(2 * math.pi * 28 * t_global))
            elif tipo == "ruido":
                ru = rnd.uniform(-1, 1)
                ganho = {"s": 0.35, "ch": 0.4, "f": 0.22, "h": 0.12}[val]
                if val in ("s", "ch"):     # chiado agudo: diferença (passa-alta)
                    ru = ru - k.setdefault("ant", 0.0); k["ant"] = ru + k["ant"]
                s = ru * ganho * min(1, tt * 8, (1 - tt) * 8) + (voz * 0.4 if extra else 0)
            elif tipo == "batida":
                # um silêncio curtinho e o estalo (o "T" do TOC)
                s = (rnd.uniform(-1, 1) * 0.6 * math.exp(-(tt - 0.55) * 18) if tt > 0.55 else 0) + (voz * 0.3 if extra else 0)
            else:
                s = 0.0
            out.append(s)
            t_global += 1 / TAXA
    # volume: o pico em 0,9
    pico = max(1e-6, max(abs(x) for x in out))
    return [x / pico * 0.9 for x in out]


def grava(amostras, caminho):
    with wave.open(caminho, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(TAXA)
        w.writeframes(b"".join(struct.pack("<h", int(max(-1, min(1, x)) * 32767)) for x in amostras))


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("texto"); ap.add_argument("saida")
    ap.add_argument("--f0", type=float, default=220); ap.add_argument("--rouco", type=float, default=0.15)
    ap.add_argument("--semente", type=int, default=1)
    a = ap.parse_args()
    grava(sintetiza(a.texto, a.f0, a.rouco, a.semente), a.saida)
    print(a.saida)
