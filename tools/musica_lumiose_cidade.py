#!/usr/bin/env python3
"""LUMIOSE (CIDADE): a "Lumiose City" do Pokémon X/Y, copiada de uma
transcrição em MIDI pra piano (o "Lumiose City Theme.mid" do vídeo do
Synthesia no YouTube, que estava no MediaFire), tocada com a banda do Legends
Z-A (sax na melodia, piano elétrico nos acordes, baixo funk), a 115 bpm (o
MIDI é 150), a pedido do CAIO. Grava src/data/musica-lumiose-cidade.js.

O MIDI tem duas trilhas: a 1 é a melodia (mão direita) e a 2 são os acordes
com o baixo (mão esquerda, até 4 notas juntas). A 2 é repartida: a nota mais
grave de cada acorde vai pro baixo, a mais aguda pro piano de cima e as do
meio pro piano do meio.

O MIDI foi APAGADO depois de copiado (o CAIO pediu); pra rodar de novo,
baixe ele outra vez em tools/midis/xy_lumiose_city.mid.

    python3 tools/musica_lumiose_cidade.py
"""
import json
import os
import sys

AQUI = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(AQUI)
sys.path.insert(0, AQUI)
import midi_pra_musica as m  # noqa: E402

MIDI = os.path.join(AQUI, "midis", "xy_lumiose_city.mid")
BPM = 115   # o CAIO pediu; o MIDI é 150


def reparte(notas):
    """os acordes da mão esquerda em três vozes: baixo, meio e cima"""
    por_inicio = {}
    for n in notas:
        por_inicio.setdefault(n[0], []).append(n)
    baixo, meio, cima = [], [], []
    for _, grupo in sorted(por_inicio.items()):
        grupo.sort(key=lambda n: n[2])
        if len(grupo) == 1:
            (baixo if grupo[0][2] < 52 else cima).append(grupo[0])
            continue
        baixo.append(grupo[0])
        cima.append(grupo[-1])
        meio.extend(grupo[1:-1])
    return baixo, meio, cima


def main():
    div, tr = m.ler(MIDI)
    bpm = BPM
    melodia = m.notas_da_trilha(tr[1])
    baixo, meio, cima = reparte(m.notas_da_trilha(tr[2]))
    total = max(f for ns in (melodia, baixo, meio, cima) for _, f, _, _ in ns)
    canais = [
        ('{ timbre: "sax", vol: 0.5, legato: 0.92, eco: true }', m.canal_do_jogo(melodia, div, total)),
        ('{ timbre: "epi", vol: 0.3, legato: 1, eco: true }', m.canal_do_jogo(cima, div, total)),
        ('{ timbre: "epi", vol: 0.24, legato: 1 }', m.canal_do_jogo(meio, div, total)),
        ('{ timbre: "slp", vol: 0.62, legato: 0.9 }', m.canal_do_jogo(baixo, div, total, grave=True)),
    ]
    tempos = total / div
    for _, c in canais:
        assert abs(sum(d for _, d in c) - tempos) < 1e-6, "canal com tamanho errado"
    linhas = "\n".join(f"      {{ ...{i}, notes: {json.dumps(c)} }}," for i, c in canais)
    js = f'''// LUMIOSE (CIDADE): a música de andar por LUMIOSE fora da batalha — a
// "Lumiose City" do Pokémon X/Y, copiada de uma transcrição em MIDI pra piano
// por tools/musica_lumiose_cidade.py. GERADO: não edite aqui. Tocada com a
// banda do Legends Z-A (sax, piano elétrico, baixo funk), a {BPM} bpm (o MIDI
// é 150), a pedido do CAIO.
export const LUMIOSE_CIDADE_MUSIC = {{
  lumioseCidade: {{
    bpm: {bpm},
    tracks: [
{linhas}
    ],
  }},
}};
'''
    dest = os.path.join(ROOT, "src", "data", "musica-lumiose-cidade.js")
    open(dest, "w", encoding="utf-8").write(js)
    print(f"{bpm} bpm, {tempos} tempos, {len(canais)} canais -> {dest}")


if __name__ == "__main__":
    main()
