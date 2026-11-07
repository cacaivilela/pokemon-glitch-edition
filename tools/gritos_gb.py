#!/usr/bin/env python3
"""OS GRITOS ORIGINAIS DE KANTO E DE JOHTO, do Pokémon Red/Blue e do Crystal:
lê os dados das desmontagens dos jogos (pret/pokered e pret/pokecrystal, só os
arquivos que interessam, copiados em tools/pokered_gritos/ e
tools/pokecrystal_gritos/) e grava src/data/gritos-gb.js, que o imitador do
chip de som do Game Boy (src/core/gb.js) toca.

Nos dois jogos os gritos saem de GRITOS-BASE (duas ondas quadradas e um
chiado, nota por nota) e cada Pokémon usa um deles com o TOM e a VELOCIDADE
dele. No Red/Blue são 38 bases pros 151; no Crystal, 68 pros 251 (e os de
Kanto ganharam outros números lá — aqui eles ficam com os do Red/Blue).

Os comandos são seguidos como o motor de som do jogo segue: rótulo, chamada
(`sound_call`/`sound_ret`), pulo (`sound_jump`), laço que toca N vezes
(`sound_loop`), e um canal que termina sem `sound_ret` CAI no que vem embaixo.

    python3 tools/gritos_gb.py
"""
import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RB = os.path.join(ROOT, "tools", "pokered_gritos")
GSC = os.path.join(ROOT, "tools", "pokecrystal_gritos")


def num(t):
    t = t.strip()
    neg = t.startswith("-")
    t = t.lstrip("-")
    v = int(t[1:], 16) if t.startswith("$") else int(t)
    return -v if neg else v


def programa(*arquivos):
    """os arquivos .asm viram uma lista de instruções e um mapa rótulo -> posição
    (o rótulo local `.body` vira `Rotulo.body`)"""
    instr, rotulos, ultimo = [], {}, ""
    for arq in arquivos:
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
            cmd = partes[0]
            args = [a.strip() for a in partes[1].split(",")] if len(partes) > 1 else []
            instr.append((cmd, args, ultimo))
    return instr, rotulos


def rodar(instr, rotulos, inicio):
    """segue o canal a partir do rótulo e devolve os comandos que tocam"""
    out, pilha, laco = [], [], {}
    pc = rotulos[inicio]
    passos = 0
    while pc < len(instr) and passos < 5000:
        passos += 1
        cmd, args, dono = instr[pc]
        alvo = lambda a: rotulos[(dono + a) if a.startswith(".") else a]
        pc += 1
        if cmd == "square_note":
            out.append(["q", *map(num, args)])
        elif cmd == "noise_note":
            out.append(["n", *map(num, args)])
        elif cmd == "duty_cycle_pattern":
            out.append(["dp", *map(num, args)])
        elif cmd == "duty_cycle":
            out.append(["d", num(args[0]) << 6])
        elif cmd == "pitch_offset":
            out.append(["po", num(args[0])])
        elif cmd == "pitch_sweep":
            periodo, mudanca = num(args[0]) & 7, num(args[1])
            out.append(["s", periodo, 1 if mudanca < 0 else 0, abs(mudanca) & 7])
        elif cmd == "sound_call":
            pilha.append(pc)
            pc = alvo(args[0])
        elif cmd == "sound_jump":
            pc = alvo(args[0])
        elif cmd == "sound_loop":
            vezes, lugar = num(args[0]), alvo(args[1])
            k = laco.get(pc, vezes)
            if vezes == 0 or k > 1:
                laco[pc] = k - 1 if vezes else 1
                pc = lugar
            else:
                laco.pop(pc, None)
        elif cmd == "sound_ret":
            if not pilha:
                break
            pc = pilha.pop()
        elif cmd in ("channel_count", "channel"):
            continue
        else:
            raise SystemExit(f"comando que eu não conheço: {cmd}")
    return out


def id_da_especie(nome):
    n = nome.strip().replace("♀", "f").replace("♂", "m")
    return re.sub(r"[^a-z0-9]", "", n.lower())


def red_blue():
    bases = []
    for i in range(38):
        instr, rot = programa(os.path.join(RB, "audio", "sfx", f"cry{i:02x}_1.asm"))
        canais = []
        for ch in (5, 6, 8):
            nome = f"SFX_Cry{i:02X}_1_Ch{ch}"
            canais.append(rodar(instr, rot, nome) if nome in rot else [])
        bases.append(canais)
    gritos = {}
    for linha in open(os.path.join(RB, "data", "pokemon", "cries.asm"), encoding="utf-8"):
        m = re.match(r"\s*mon_cry SFX_CRY_([0-9A-F]{2}),\s*(\$?\w+),\s*(\$?\w+)\s*;\s*(.+)$", linha)
        if not m:
            continue
        i = id_da_especie(m.group(4))
        if i.startswith("missingno"):
            if "missingno" in gritos:
                continue
            i = "missingno"
        # o andamento das quadradas no Red/Blue é $80 + a velocidade
        gritos[i] = [int(m.group(1), 16), num(m.group(2)), 0x80 + num(m.group(3))]
    return bases, gritos


def crystal():
    instr, rot = programa(os.path.join(GSC, "audio", "cries.asm"))
    # o número de cada CRY_ (constants) -> o rótulo do grito (cry_pointers)
    consts = [l.split()[1] for l in open(os.path.join(GSC, "constants", "cry_constants.asm"), encoding="utf-8")
              if l.strip().startswith("const ") and l.split()[1].startswith("CRY_")]
    ponteiros = [l.split()[1] for l in open(os.path.join(GSC, "audio", "cry_pointers.asm"), encoding="utf-8")
                 if l.strip().startswith("dba ")]
    # os canais de cada grito: o cabeçalho "channel 5, Cry_X_Ch5"
    canais_de, atual = {}, None
    for linha in open(os.path.join(GSC, "audio", "cries.asm"), encoding="utf-8"):
        m = re.match(r"^(Cry_\w+):\s*$", linha)
        if m:
            atual = m.group(1)
        m = re.match(r"\s*channel (\d), (\S+)", linha)
        if m and atual:
            canais_de.setdefault(atual, {})[int(m.group(1))] = m.group(2)
    bases = []
    for rotulo in ponteiros:
        c = canais_de.get(rotulo, {})
        bases.append([rodar(instr, rot, c[ch]) if ch in c else [] for ch in (5, 6, 8)])
    gritos = {}
    for linha in open(os.path.join(GSC, "data", "pokemon", "cries.asm"), encoding="utf-8"):
        m = re.match(r"\s*mon_cry (CRY_\w+),\s*(-?\$?\w+),\s*(-?\$?\w+)\s*;\s*(.+)$", linha)
        if not m:
            continue
        # no Crystal o andamento É a velocidade (e o tom tem sinal)
        gritos[id_da_especie(m.group(4))] = [consts.index(m.group(1)), num(m.group(2)), num(m.group(3))]
    return bases, gritos


def main():
    rb_bases, rb = red_blue()
    gsc_bases, gsc = crystal()
    # os de Kanto ficam com o grito do Red/Blue; do Crystal, só os de Johto
    gsc = {k: v for k, v in gsc.items() if k not in rb}
    dest = os.path.join(ROOT, "src", "data", "gritos-gb.js")
    with open(dest, "w", encoding="utf-8") as f:
        f.write("// OS GRITOS ORIGINAIS DE KANTO (Red/Blue) E DE JOHTO (Crystal). GERADO por\n")
        f.write("// tools/gritos_gb.py a partir do pret/pokered e do pret/pokecrystal: não\n")
        f.write("// edite aqui. Quem toca é src/core/gb.js (o chip de som do Game Boy).\n//\n")
        f.write("// *_BASES: os gritos-base, cada um com três canais — [quadrada 1, quadrada 2,\n")
        f.write("// chiado] — e cada canal uma lista de comandos:\n")
        f.write("//   [\"q\", duração, volume, fade, frequência]   nota da onda quadrada\n")
        f.write("//   [\"n\", duração, volume, fade, chiado]       nota do chiado\n")
        f.write("//   [\"dp\", a, b, c, d]  o formato da quadrada trocando a cada quadro\n")
        f.write("//   [\"d\", x]            o formato da quadrada, fixo (nos 2 bits de cima)\n")
        f.write("//   [\"po\", tom]         o tom deste canal passa a ser este\n")
        f.write("//   [\"s\", período, desce, passo]  o tom escorregando sozinho (só a quadrada 1)\n")
        f.write("// *_GRITOS: espécie -> [grito-base, tom, andamento]\n")
        f.write("export const GB_BASES = " + json.dumps(rb_bases, separators=(",", ":")) + ";\n")
        f.write("export const GB_GRITOS = " + json.dumps(rb, separators=(",", ":"), sort_keys=True) + ";\n")
        f.write("export const GBC_BASES = " + json.dumps(gsc_bases, separators=(",", ":")) + ";\n")
        f.write("export const GBC_GRITOS = " + json.dumps(gsc, separators=(",", ":"), sort_keys=True) + ";\n")
    print(f"Red/Blue: {len(rb_bases)} bases, {len(rb)} espécies; Crystal: {len(gsc_bases)} bases, {len(gsc)} espécies -> {dest}")


if __name__ == "__main__":
    main()
