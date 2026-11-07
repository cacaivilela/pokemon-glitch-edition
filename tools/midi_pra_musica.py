#!/usr/bin/env python3
"""MIDI -> MÚSICA DO JOGO: lê um arquivo .mid (sem biblioteca nenhuma) e
transforma as trilhas escolhidas em canais no formato de src/data/music.js
([nota, tempos], com "-" de pausa). Serve pra trazer pro jogo uma música que só
existe transcrita em MIDI (como a batalha selvagem de Kalos, do X/Y).

Cada canal do jogo toca uma nota de cada vez: se a trilha do MIDI tem acorde,
fica a nota MAIS ALTA (`--grave`: a mais baixa). Tudo é arredondado pra
semicolcheia.

    python3 tools/midi_pra_musica.py <arquivo.mid>                 # mostra as trilhas
    python3 tools/midi_pra_musica.py <arquivo.mid> 2,3 4:grave 9:bateria   # gera os canais (JSON)
    python3 tools/midi_pra_musica.py <arquivo.mid> 8:bateria=35,36           # só essas peças da bateria (bumbo)
    python3 tools/midi_pra_musica.py <arquivo.mid> 8:kit                     # a bateria inteira pro kit do jogo
                                                                             # (`wave: "bateria"`: K S H O C T)
"""
import json
import struct
import sys

NOMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]


def ler(arq):
    dados = open(arq, "rb").read()
    assert dados[:4] == b"MThd"
    _, fmt, ntr, div = struct.unpack(">IHHH", dados[4:14])
    pos, trilhas = 14, []
    for _ in range(ntr):
        assert dados[pos:pos + 4] == b"MTrk", "trilha estragada"
        tam = struct.unpack(">I", dados[pos + 4:pos + 8])[0]
        corpo, pos = dados[pos + 8:pos + 8 + tam], pos + 8 + tam
        ev, i, t, status = [], 0, 0, 0
        while i < len(corpo):
            d = 0
            while True:
                b = corpo[i]; i += 1
                d = (d << 7) | (b & 0x7F)
                if not b & 0x80:
                    break
            t += d
            b = corpo[i]
            if b & 0x80:
                status = b; i += 1
            if status == 0xFF:
                tipo = corpo[i]; i += 1
                n = 0
                while True:
                    c = corpo[i]; i += 1
                    n = (n << 7) | (c & 0x7F)
                    if not c & 0x80:
                        break
                meta = corpo[i:i + n]; i += n
                if tipo == 0x51:
                    ev.append((t, "tempo", int.from_bytes(meta, "big")))
                elif tipo == 0x03:
                    ev.append((t, "nome", meta.decode("latin-1")))
                elif tipo == 0x06:
                    ev.append((t, "marca", meta.decode("latin-1")))
                elif tipo == 0x2F:
                    break
            elif status in (0xF0, 0xF7):
                n = 0
                while True:
                    c = corpo[i]; i += 1
                    n = (n << 7) | (c & 0x7F)
                    if not c & 0x80:
                        break
                i += n
            else:
                tipo, canal = status & 0xF0, status & 0x0F
                if tipo in (0xC0, 0xD0):
                    a = corpo[i]; i += 1
                    if tipo == 0xC0:
                        ev.append((t, "instrumento", canal, a))
                else:
                    a, b2 = corpo[i], corpo[i + 1]; i += 2
                    if tipo == 0xB0 and a == 7:
                        ev.append((t, "volume", canal, b2))
                    if tipo == 0x90 and b2 > 0:
                        ev.append((t, "liga", canal, a, b2))
                    elif tipo == 0x80 or (tipo == 0x90 and b2 == 0):
                        ev.append((t, "desliga", canal, a))
        trilhas.append(ev)
    return div, trilhas


def notas_da_trilha(ev):
    """[(começo, fim, nota, canal)] em ticks"""
    abertas, out = {}, []
    for e in ev:
        if e[1] == "liga":
            abertas.setdefault((e[2], e[3]), []).append(e[0])
        elif e[1] == "desliga" and abertas.get((e[2], e[3])):
            ini = abertas[(e[2], e[3])].pop(0)
            out.append((ini, e[0], e[3], e[2]))
    return sorted(out)


# as peças da bateria do MIDI (General MIDI) -> as do kit do jogo
# (src/core/audio.js, `_bateriaEm`): K bumbo, S caixa, H chimbal fechado,
# O chimbal aberto, C prato, T tom
KIT = {35: "K", 36: "K", 37: "S", 38: "S", 39: "S", 40: "S", 42: "H", 44: "H", 46: "O",
       49: "C", 52: "C", 55: "C", 57: "C", 41: "T", 43: "T", 45: "T", 47: "T", 48: "T", 50: "T"}


def canal_kit(notas, div, total):
    """a bateria inteira: em cada semicolcheia, as peças que batem nela juntas"""
    passo = div // 4
    n = (total + passo - 1) // passo
    grade = [""] * n
    for ini, _, nota, _ in notas:
        k = round(ini / passo)
        p = KIT.get(nota)
        if p and k < n and p not in grade[k]:
            grade[k] += p
    out = []
    for g in grade:
        if not g:
            if out and out[-1][0] == "-":
                out[-1][1] += 0.25
            else:
                out.append(["-", 0.25])
        else:
            out.append(["".join(sorted(g, key="KSTHOC".index)), 0.25])
    return out


def nome_nota(n):
    return f"{NOMES[n % 12]}{n // 12 - 1}"


def canal_do_jogo(notas, div, total, grave=False, bateria=False, passo=None):
    """uma linha só (a nota mais alta, ou a mais baixa), em semicolcheias — ou
    numa grade mais fina (`passo`, em ticks do MIDI), pra música com fusa e
    tercina, que na de semicolcheia caíam todas no mesmo lugar e se embolavam"""
    passo = passo or div // 4
    t = passo / div                     # quanto vale uma casa da grade, em tempos
    n = (total + passo - 1) // passo
    grade = [None] * n
    for ini, fim, nota, _ in notas:
        a, z = round(ini / passo), max(round(ini / passo) + 1, round(fim / passo))
        for k in range(a, min(z, n)):
            atual = grade[k]
            if bateria:
                grade[k] = ("x", k == a) if (atual is None or k == a) else atual
            elif atual is None or (nota < atual[0] if grave else nota > atual[0]) or (k == a and atual[1] is False and atual[0] == nota):
                grade[k] = (nota, k == a)
    # junta as semicolcheias da mesma nota (que não recomeçou) numa só
    out = []
    for k, g in enumerate(grade):
        if g is None:
            if out and out[-1][0] == "-":
                out[-1][1] += t
            else:
                out.append(["-", t])
            continue
        nota, comeca = g
        nome = "x" if bateria else nome_nota(nota)
        if not comeca and out and out[-1][0] == nome:
            out[-1][1] += t
        else:
            out.append([nome, t])
    return [[n, round(d, 4)] for n, d in out]


def main():
    arq = sys.argv[1]
    div, trilhas = ler(arq)
    tempo = next((e[2] for ev in trilhas for e in ev if e[1] == "tempo"), 500000)
    bpm = round(60_000_000 / tempo)
    todas = [notas_da_trilha(ev) for ev in trilhas]
    total = max((f for ns in todas for _, f, _, _ in ns), default=0)
    if len(sys.argv) == 2:
        print(f"{len(trilhas)} trilhas, {div} ticks por tempo, {bpm} bpm, {total / div:.1f} tempos")
        for k, (ev, ns) in enumerate(zip(trilhas, todas)):
            nome = next((e[2] for e in ev if e[1] == "nome"), "")
            instr = sorted({e[3] for e in ev if e[1] == "instrumento"})
            canais = sorted({c for *_, c in ns})
            if not ns:
                print(f"  {k}: {nome!r} (sem notas)")
                continue
            # quantas notas tocam juntas no máximo (acorde)
            pontos = sorted([(a, 1) for a, _, _, _ in ns] + [(z, -1) for _, z, _, _ in ns])
            mx = cur = 0
            for _, d in pontos:
                cur += d; mx = max(mx, cur)
            print(f"  {k}: {nome!r} canal {canais} instrumento {instr} notas {len(ns)} "
                  f"de {nome_nota(min(n for *_, n, _ in ns))} a {nome_nota(max(n for *_, n, _ in ns))}, até {mx} juntas")
        return
    saida = {"bpm": bpm, "tempos": total / div, "canais": []}
    for pedido in sys.argv[2:]:
        partes = pedido.split(":")
        ks = [int(x) for x in partes[0].split(",")]
        modo = partes[1] if len(partes) > 1 else ""
        ns = sorted(n for k in ks for n in todas[k])
        if modo == "kit":
            saida["canais"].append(canal_kit(ns, div, total))
            continue
        if modo.startswith("bateria="):
            pecas = {int(x) for x in modo.split("=")[1].split(",")}
            ns = [n for n in ns if n[2] in pecas]
            modo = "bateria"
        saida["canais"].append(canal_do_jogo(ns, div, total, grave=modo == "grave", bateria=modo == "bateria"))
    print(json.dumps(saida))


if __name__ == "__main__":
    main()
