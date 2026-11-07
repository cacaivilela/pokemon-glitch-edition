#!/usr/bin/env python3
"""A BATALHA EM LUMIOSE: o "Battle! (Wild Pokémon)" do Pokémon X/Y (Kalos),
copiado da transcrição em MIDI do VGMusic (tools/midis/xy_wild_battle.mid, o
Pokemon_XY_Wild_Pokemon.mid de vgmusic.com) com tools/midi_pra_musica.py, e
gravado em src/data/musica-lumiose.js — com os instrumentos do arranjo do
Legends Z-A (jazz-funk: sax, piano elétrico, metais, baixo funk, bateria).

A transcrição tem 20 tempos de introdução e um laço de 104, tocado duas vezes:
aqui a introdução fica no `intro` (toca uma vez) e o laço no `notes`.

    python3 tools/musica_lumiose.py
"""
import json
import os
import sys

AQUI = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(AQUI)
sys.path.insert(0, AQUI)
import midi_pra_musica as m  # noqa: E402

MIDI = os.path.join(AQUI, "midis", "xy_wild_battle.mid")
INTRO, FIM = 20, 124
# [instrumento do jogo, trilhas do MIDI, modo]. Os instrumentos são os do
# arranjo do Legends Z-A: o tema de Lumiose virou jazz-funk (o sax de Carlos
# Eiene, o "insaneintherain"), e as batalhas da Wild Zone são variações dele —
# então a melodia é SAX, o acorde é PIANO ELÉTRICO, o baixo é FUNK, tem naipe de
# METAIS, guitarra limpa beliscada e bateria de verdade (os timbres de
# src/core/timbres.js).
CANAIS = [
    ('{ timbre: "sax", vol: 0.5, legato: 0.92, eco: true }', [5], ""),        # Lead 2: a melodia
    ('{ timbre: "bra", vol: 0.4, legato: 0.8, eco: true }', [4], ""),         # metais
    ('{ timbre: "epi", vol: 0.3, legato: 1, eco: true }', [6], ""),           # cordas -> piano elétrico (de cima)
    ('{ timbre: "epi", vol: 0.26, legato: 1 }', [6], "grave"),                # (e a voz de baixo)
    ('{ timbre: "plk", vol: 0.16, legato: 0.7 }', [3], ""),                   # guitarra limpa
    ('{ timbre: "mar", vol: 0.28, legato: 0.5 }', [7], ""),                   # marimba
    ('{ timbre: "slp", vol: 0.62, legato: 0.85 }', [2], ""),                  # baixo funk
    ('{ wave: "bateria", vol: 0.3 }', [8], "kit"),                            # a bateria inteira
]


def corta(canal, a, z):
    """o pedaço [a, z) em tempos de um canal ([nota, tempos])"""
    out, t = [], 0.0
    for nome, d in canal:
        ini, fim = t, t + d
        t = fim
        x0, x1 = max(ini, a), min(fim, z)
        if x1 - x0 > 1e-9:
            nome2 = nome if ini >= a - 1e-9 else "-"     # nota que começou antes vira pausa
            if out and nome2 == "-" and out[-1][0] == "-":
                out[-1][1] += x1 - x0
            else:
                out.append([nome2, round(x1 - x0, 4)])
    return out


def main():
    div, tr = m.ler(MIDI)
    todas = [m.notas_da_trilha(ev) for ev in tr]
    total = max(f for ns in todas for _, f, _, _ in ns)
    linhas = []
    for instr, ks, modo in CANAIS:
        ns = sorted(n for k in ks for n in todas[k])
        bat = False
        if modo == "kit":
            c = m.canal_kit(ns, div, total)
            intro, laco = corta(c, 0, INTRO), corta(c, INTRO, FIM)
            linhas.append(f"    {{ ...{instr}, intro: {json.dumps(intro)},\n      notes: {json.dumps(laco)} }},")
            continue
        if modo.startswith("bateria="):
            pecas = {int(x) for x in modo.split("=")[1].split(",")}
            ns = [n for n in ns if n[2] in pecas]
            bat = True
        c = m.canal_do_jogo(ns, div, total, grave=modo == "grave", bateria=bat)
        intro, laco = corta(c, 0, INTRO), corta(c, INTRO, FIM)
        soma = lambda x: round(sum(d for _, d in x), 3)
        assert soma(intro) == INTRO and soma(laco) == FIM - INTRO, (instr, soma(intro), soma(laco))
        linhas.append(f"    {{ ...{instr}, intro: {json.dumps(intro)},\n      notes: {json.dumps(laco)} }},")
    bpm = round(60_000_000 / next(e[2] for ev in tr for e in ev if e[1] == "tempo"))
    js = f'''// A BATALHA EM LUMIOSE: o "Battle! (Wild Pokémon)" do Pokémon X/Y (Kalos),
// copiado da transcrição em MIDI do VGMusic (Pokemon_XY_Wild_Pokemon.mid) por
// tools/musica_lumiose.py. GERADO: não edite aqui. Cada instrumento do MIDI
// virou um canal, tocado com os instrumentos do arranjo do Legends Z-A (sax,
// piano elétrico, metais, guitarra limpa, marimba, baixo funk e bateria); as
// cordas, que tocam acorde, viraram dois canais de piano. A introdução (os
// primeiros {INTRO} tempos) toca uma vez; o laço ({FIM - INTRO} tempos) repete.
const melodia = (vol = 0.5) => ({{ wave: "pulso", duty: 0.25, vol, detune: 6, eco: true,
                                  vibrato: {{ hz: 6.2, cents: 13 }} }});
const baixo = (vol = 0.55) => ({{ wave: "triangle", vol, legato: 0.9 }});

export const LUMIOSE_MUSIC = {{
  batalhaLumiose: {{
    bpm: {bpm},
    tracks: [
{chr(10).join(linhas)}
    ],
  }},
}};
'''
    dest = os.path.join(ROOT, "src", "data", "musica-lumiose.js")
    open(dest, "w", encoding="utf-8").write(js)
    print(f"{bpm} bpm, {len(linhas)} canais -> {dest}")


if __name__ == "__main__":
    main()
