#!/usr/bin/env python3
"""AS MÚSICAS DE BATALHA DE KANTO, do Pokémon Red/Blue: lê as músicas da
desmontagem do jogo (pret/pokered, só os arquivos que interessam, copiados em
tools/pokered_musicas/) e grava src/data/musicas-gb.js, que o imitador do chip
de som do Game Boy (src/core/gb.js, `tocarMusicaGB`) toca.

Cada música tem três canais — duas ondas quadradas e o canal de ONDA (uma forma
de onda desenhada de 32 pontos) — e cada canal é seguido como o motor de som
segue: oitava, `note_type` (velocidade, volume e fade; no canal de onda,
velocidade, volume e qual onda), vibrato, `toggle_perfect_pitch`, chamadas e
laços. O laço sem fim (`sound_loop 0`) marca de onde a música volta.

Sai, de cada canal, uma lista de NOTAS já em quadros (59,7275 por segundo):
    [quadros, frequência, volume, fade, formato, vibrato]   (quadradas)
    [quadros, frequência, nível, onda, 0, vibrato]          (onda)
    [quadros, chiado, volume, fade, 0, 0]                   (canal 4, o chiado)
    [quadros]                                                (pausa)
As do Red/Blue não usam o canal 4 nas batalhas; as compostas aqui usam (a
zabumba e o triângulo de Braglitch), com `noise_note duração, volume, fade,
chiado` — a duração em unidades do `note_type`, como a das notas.
com `vibrato` = [espera, sobe, desce, ritmo] ou 0; e o quadro onde o laço
começa e onde termina.

    python3 tools/musicas_gb.py
"""
import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PASTA = os.path.join(ROOT, "tools", "pokered_musicas")
PROPRIAS = os.path.join(ROOT, "tools", "musicas_proprias")
MUSICAS = {   # nome no jogo -> arquivo, rótulo (e a pasta, se não for a do pokered)
    "kantoSelvagem": ("wildbattle", "Music_WildBattle"),
    "kantoTreinador": ("trainerbattle", "Music_TrainerBattle"),
    "kantoLider": ("gymleaderbattle", "Music_GymLeaderBattle"),
    "kantoFinal": ("finalbattle", "Music_FinalBattle"),
    # composta aqui, no mesmo formato (tools/batalha_braglitch.py)
    "braglitchBatalha": ("braglitchbattle", "Music_BraglitchBattle", PROPRIAS),
}
# a tabela das 12 notas (audio/notes.asm): com sinal, deslocada pela oitava
TABELA = [0xF82C, 0xF89D, 0xF907, 0xF96B, 0xF9CA, 0xFA23, 0xFA77, 0xFAC7, 0xFB12, 0xFB58, 0xFB9B, 0xFBDA]
NOMES = ["C_", "C#", "D_", "D#", "E_", "F_", "F#", "G_", "G#", "A_", "A#", "B_"]


def num(t):
    t = t.strip()
    neg = t.startswith("-")
    t = t.lstrip("-")
    v = int(t[1:], 16) if t.startswith("$") else int(t)
    return -v if neg else v


def frequencia(nota, oitava):
    p = TABELA[nota]
    p = p - 0x10000 if p & 0x8000 else p
    return 2048 + (p >> (oitava - 1))


def programa(arq):
    instr, rotulos, ultimo = [], {}, ""
    for linha in open(arq, encoding="utf-8"):
        linha = linha.split(";")[0].rstrip()
        if not linha.strip():
            continue
        m = re.match(r"^(\.?\w+):+$", linha.strip())
        if m:
            nome = m.group(1)
            if nome.startswith("."):
                nome = ultimo + nome
            else:
                ultimo = nome
            rotulos[nome] = len(instr)
            continue
        partes = linha.strip().split(None, 1)
        args = [a.strip() for a in partes[1].split(",")] if len(partes) > 1 else []
        instr.append((partes[0], args, ultimo))
    return instr, rotulos


def canal(instr, rotulos, inicio, onda, tempo_inicial):
    """segue um canal; devolve (notas, quadro do começo do laço, quadro do fim)"""
    notas, pilha, laco = [], [], {}
    pc = rotulos[inicio]
    tempo, velocidade, vol, fade, formato, oitava = tempo_inicial, 12, 10, 0, 2, 4
    vibrato, perfeito = 0, False
    sobra = 0                # a sobra de quadro, de nota pra nota (por canal)
    quadro = 0
    inicio_laco = None
    passos = 0
    while passos < 100000:
        passos += 1
        cmd, args, dono = instr[pc]
        alvo = lambda a: rotulos[(dono + a) if a.startswith(".") else a]
        pc += 1
        if cmd == "tempo":
            tempo = num(args[0])
        elif cmd in ("volume", "stereo_panning"):
            pass
        elif cmd == "duty_cycle":
            formato = num(args[0])
        elif cmd == "vibrato":
            d, prof, ritmo = num(args[0]), num(args[1]), num(args[2])
            vibrato = [d, prof // 2 + prof % 2, prof // 2, ritmo] if prof else 0
        elif cmd == "toggle_perfect_pitch":
            perfeito = not perfeito
        elif cmd == "note_type":
            velocidade, vol, fade = num(args[0]), num(args[1]), num(args[2])
        elif cmd == "octave":
            oitava = num(args[0])
        elif cmd == "noise_note":
            dur, v, fd, valor = map(num, args)
            total = dur * velocidade * tempo + sobra
            q = total >> 8
            sobra = total & 0xff
            notas.append([q, valor, v, fd, 0, 0])
            quadro += q
        elif cmd in ("note", "rest"):
            dur = num(args[-1])
            total = dur * velocidade * tempo + sobra
            q = total >> 8
            sobra = total & 0xff
            if cmd == "rest":
                notas.append([q])
            else:
                f = frequencia(NOMES.index(args[0]), oitava) + (1 if perfeito else 0)
                notas.append([q, f, vol, fade, 0 if onda else formato, vibrato])
            quadro += q
        elif cmd == "sound_call":
            pilha.append(pc)
            pc = alvo(args[0])
        elif cmd == "sound_ret":
            if not pilha:
                return notas, None, quadro
            pc = pilha.pop()
        elif cmd == "sound_loop":
            vezes, lugar = num(args[0]), alvo(args[1])
            if vezes == 0:
                # o laço sem fim: a música volta pra `lugar`. O quadro de lá é
                # onde o laço começa; contar até aqui de novo dá o tamanho
                return notas, lugar, quadro
            k = laco.get(pc, vezes)
            if k > 1:
                laco[pc] = k - 1
                pc = lugar
            else:
                laco.pop(pc, None)
        else:
            raise SystemExit(f"comando que eu não conheço: {cmd}")
    raise SystemExit("o canal não terminou")


def quadro_do_rotulo(instr, rotulos, inicio, onda, tempo_inicial, lugar):
    """em que quadro o canal passa pela instrução `lugar` (a primeira vez) — o
    começo do laço. Roda de novo marcando."""
    notas, pilha, laco = [], [], {}
    # mais simples: refaz o canal anotando o quadro de cada instrução
    pc = rotulos[inicio]
    tempo, velocidade, sobra, quadro = tempo_inicial, 12, 0, 0
    visto = None
    while True:
        if pc == lugar and visto is None:
            return quadro
        cmd, args, dono = instr[pc]
        alvo = lambda a: rotulos[(dono + a) if a.startswith(".") else a]
        pc += 1
        if cmd == "tempo":
            tempo = num(args[0])
        elif cmd == "note_type":
            velocidade = num(args[0])
        elif cmd in ("note", "rest", "noise_note"):
            total = num(args[0] if cmd == "noise_note" else args[-1]) * velocidade * tempo + sobra
            quadro += total >> 8
            sobra = total & 0xff
        elif cmd == "sound_call":
            pilha.append(pc)
            pc = alvo(args[0])
        elif cmd == "sound_ret":
            pc = pilha.pop()
        elif cmd == "sound_loop":
            vezes, l2 = num(args[0]), alvo(args[1])
            if vezes == 0:
                return quadro
            k = laco.get(pc, vezes)
            if k > 1:
                laco[pc] = k - 1
                pc = l2
            else:
                laco.pop(pc, None)


def ondas():
    out = []
    for linha in open(os.path.join(PASTA, "audio", "wave_samples.asm"), encoding="utf-8"):
        m = re.match(r"\s*dn\s+(.+)$", linha.split(";")[0])
        if m and not linha.lstrip().startswith(";"):
            out.append([int(x) for x in m.group(1).split(",")])
    return out[:5]


def main():
    saida = {}
    for nome, (arq, rot, *pasta) in MUSICAS.items():
        caminho = os.path.join(pasta[0], arq + ".asm") if pasta else os.path.join(PASTA, "audio", "music", arq + ".asm")
        instr, rotulos = programa(caminho)
        # o andamento vem do canal 1 e vale pra todos
        tempo = next(num(a[0]) for c, a, _ in instr if c == "tempo")
        canais, lacos = [], []
        for n in (1, 2, 3, 4):
            ini = f"{rot}_Ch{n}"
            if ini not in rotulos:
                continue
            notas, lugar, fim = canal(instr, rotulos, ini, n == 3, tempo)
            comeco = quadro_do_rotulo(instr, rotulos, ini, n == 3, tempo, lugar) if lugar is not None else 0
            canais.append(notas)
            lacos.append((comeco, fim))
        saida[nome] = {"canais": canais, "laco": lacos[0], "lacos": lacos}
        print(nome, "laços (começo, fim) por canal:", lacos)
    dest = os.path.join(ROOT, "src", "data", "musicas-gb.js")
    with open(dest, "w", encoding="utf-8") as f:
        f.write("// AS MÚSICAS DE BATALHA DE KANTO, do Pokémon Red/Blue (e a de BRAGLITCH,\n")
        f.write("// composta aqui no mesmo formato). GERADO por tools/musicas_gb.py a partir\n")
        f.write("// do pret/pokered e de tools/musicas_proprias/: não edite aqui. Quem toca\n")
        f.write("// é src/core/gb.js (`tocarMusicaGB`). O formato está no tools/musicas_gb.py.\n")
        f.write("export const GB_ONDAS = " + json.dumps(ondas(), separators=(",", ":")) + ";\n")
        f.write("export const GB_MUSICAS = " + json.dumps(saida, separators=(",", ":")) + ";\n")
    print("->", dest)


if __name__ == "__main__":
    main()
