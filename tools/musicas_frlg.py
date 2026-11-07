#!/usr/bin/env python3
"""AS MÚSICAS DE KANTO DO FIRERED: lê os MIDI do próprio FireRed (o projeto
pret/pokefirered, sound/songs/midi/, baixados em tools/midis/frlg/) e grava
src/data/musicas-frlg.js no formato de src/data/music.js.

Os MIDI do pret são as notas exatas do jogo. Cada um tem a marca "[" (onde a
repetição começa) e "]" (onde ela volta): o que vem antes do "[" vira `intro`
(toca uma vez) e o pedaço entre as duas vira `notes` (repete).

Os instrumentos do FireRed não são General MIDI certinho: 80 a 92 são os
canais de chip do GBA (onda quadrada e a onda programável), 0 é a bateria e
126/127 são o chiado do chip. O resto é perto do GM (48 cordas, 56 trompete,
24 violão...) e vira o timbre mais parecido de src/core/timbres.js.

    python3 tools/musicas_frlg.py
"""
import json
import os
import sys

AQUI = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(AQUI)
sys.path.insert(0, AQUI)
import midi_pra_musica as m  # noqa: E402
from musica_lumiose import corta  # noqa: E402

PASTA = os.path.join(AQUI, "midis", "frlg")

# chave no jogo -> arquivo do FireRed
MUSICAS = {
    "frPallet": "mus_pallet",
    "frRota1": "mus_route1",
    "frRota3": "mus_route3",
    "frRota11": "mus_route11",
    "frRota24": "mus_route24",
    "frPewter": "mus_pewter",          # VIRIDIAN, PEWTER e SAFFRON
    "frFuchsia": "mus_fuchsia",        # CERULEAN e FUCHSIA
    "frVermilion": "mus_vermillion",
    "frLavender": "mus_lavender",
    "frCeladon": "mus_celadon",
    "frCinnabar": "mus_cinnabar",
    "frFloresta": "mus_viridian_forest",
    "frTorre": "mus_poke_tower",
    "frSevii": "mus_sevii_123",
    "frLab": "mus_oak_lab",
    "frCentro": "mus_poke_center",
    "frCaverna": "mus_mt_moon",
    "frGinasio": "mus_gym",
    "frSelvagem": "mus_vs_wild",
    "frTreinador": "mus_vs_trainer",
    "frLider": "mus_vs_gym_leader",
    "frCampeao": "mus_vs_champion",
    "frIntroCarvalho": "mus_new_game_intro",   # a fala do PROF. CARVALHO no jogo novo
    "frIntroSaida": "mus_new_game_exit",       # você encolhendo pro mundo
    # AS DAS CONVERSAS DA HISTÓRIA (src/scenes/overworld.js, `musicaDaConversa`)
    "frCarvalho": "mus_oak",                   # o PROF. CARVALHO falando
    "frSiga": "mus_follow_me",                 # alguém te levando pela mão
    "frRival": "mus_encounter_rival",          # o rival aparece
    "frRivalSai": "mus_rival_exit",            # o rival vai embora
    "frTreinadorMenino": "mus_encounter_boy",  # um treinador te viu
    "frTreinadorMenina": "mus_encounter_girl", # uma treinadora te viu
    "frRocket": "mus_encounter_rocket",        # a EQUIPE ROCKET
    "frLiderAparece": "mus_encounter_gym_leader",
    # MAIS LUGARES (31/out/2026, "copie mais músicas")
    "frSurf": "mus_surf",                      # nadando no SURFAR, em Kanto
    "frBicicleta": "mus_cycling",              # a ciclovia (ROTA 17)
    "frSilph": "mus_silph",
    "frEsconderijo": "mus_rocket_hideout",
    "frMansao": "mus_poke_mansion",
    "frCassino": "mus_game_corner",
    "frEstradaVitoria": "mus_victory_road",
    "frTorreTreinador": "mus_trainer_tower",
    "frSeviiRota": "mus_sevii_route",
    "frSevii45": "mus_sevii_45",
    "frSevii67": "mus_sevii_67",
    "frSeviiCaverna": "mus_sevii_cave",
    "frSeviiMasmorra": "mus_sevii_dungeon",
    # O FUNDO DO MAR: a "Underwater" do EMERALD (pret/pokeemerald, mesmo formato de MIDI)
    "fundoMar": "mus_underwater",
    # AS BATALHAS DE LENDÁRIO
    "frLenda": "mus_vs_legend",
    "frMewtwo": "mus_vs_mewtwo",
    "frDeoxys": "mus_vs_deoxys",
    # 01/nov/2026, "copie mais músicas"
    "frNavio": "mus_ss_anne",                  # o S.S. ANNE (o navio ainda não existe: fica guardada)
    # A EVOLUÇÃO (src/scenes/evolution.js): com o nome da música do jogo, então
    # entram NO LUGAR do tema inventado de src/data/music.js
    "evolucao": "mus_evolution",
    "evolucao_fanfarra": "mus_evolved",        # "PARABÉNS! ... EVOLUIU!"
}

# A VELOCIDADE DE AGORA (o CAIO pediu a do FireRed "acelerada na velocidade de
# agora"): a parte antes da repetição da evolução tem 32 tempos — a 150 bpm são
# 12,8 s, exatamente o RACHA + SEPARA + JUNTA + CARREGA da cena, então o BUUM
# cai no fim dela. A fanfarra do "EVOLUIU!" fica na velocidade dela (150): ela
# toca uma vez com a frase e não tem mais festa depois (igual ao FireRed).
BPM = {"evolucao": 150}
# GRADE FINA: a evolução tem fusa na bateria e a fanfarra é quase toda em
# tercina. Na grade de semicolcheia essas notas caíam na mesma casa e
# embolavam ("tá meio atropelado"); aqui a grade é o tick do MIDI.
FINO = {"evolucao", "evolucao_fanfarra"}
# tocam UMA vez: uma pausa longa no fim de cada canal segura o laço
UMA_VEZ = {"evolucao_fanfarra"}

# TROCAS PEDIDAS: [música][trilha do MIDI] -> instrumento no lugar do escolhido
# pelo programa. `segura`: a nota dura até a próxima (sem o silêncio entre
# elas); `vezes`: multiplica o volume; None: a trilha sai.
# O arpejo de LAVENDER (trilha 2): já foi órgão e voltou à harpa original; o
# CAIO pediu que ele DURE MAIS, então cada nota soa até a próxima.
TROCAS = {
    "frLavender": {2: {"timbre": "plk", "segura": True}},
}


def segurar(canal):
    """cada nota dura até a próxima: a pausa depois dela vira nota"""
    out = []
    for nome, d in canal:
        if nome == "-" and out and out[-1][0] != "-":
            out[-1][1] += d
        else:
            out.append([nome, d])
    return out

# a bateria do FireRed (programa 0) é quase o mapa do General MIDI; o que não
# está no kit do jogo vira o chimbal
KIT = dict(m.KIT)
# o TRIÂNGULO tem peça própria (src/core/audio.js, `_trianguloEm`): 80 abafado, 81 aberto
KIT.update({80: "M", 81: "A"})
KIT.update({51: "H", 53: "H", 54: "H", 56: "H", 59: "C", 60: "T", 61: "T", 62: "T", 63: "T",
            64: "T", 65: "T", 66: "T", 69: "H", 70: "H", 75: "H", 76: "T", 77: "T"})


def instrumento(prog, grave):
    """o programa do FireRed -> os campos do canal do jogo"""
    if prog in (80, 84, 88, 81, 85, 89, 83, 87, 82, 86, 90, 92):
        if grave or prog in (82, 86, 90):
            return {"wave": "triangle", "legato": 0.92}
        duty = 0.125 if prog in (80, 84, 88) else 0.5 if prog in (83, 87) else 0.25
        return {"wave": "pulso", "duty": duty, "legato": 0.9, **({"eco": True} if prog == 92 else {})}
    if prog == 12:
        return {"timbre": "mar"}
    if prog == 13:
        return {"timbre": "xil"}
    if 8 <= prog <= 15:
        return {"timbre": "sin"}
    if prog <= 3:
        return {"timbre": "pno"}
    if prog <= 7:
        return {"timbre": "epi"}
    if 16 <= prog <= 23:
        return {"timbre": "org", "legato": 0.9}
    if 24 <= prog <= 31 or prog in (45, 46):
        return {"timbre": "plk"}
    if 32 <= prog <= 39:
        return {"timbre": "slp"}
    if prog == 47:
        return {"wave": "triangle", "legato": 0.5}       # tímpano
    if 40 <= prog <= 51:
        return {"timbre": "vio", "legato": 0.95, "eco": True}
    if 52 <= prog <= 55 or 72 <= prog <= 79:
        return {"timbre": "flt", "legato": 0.92, "eco": True}
    if 56 <= prog <= 63:
        return {"timbre": "bra", "legato": 0.9, "eco": True}
    if 64 <= prog <= 71:
        return {"timbre": "cla", "legato": 0.92}
    return {"wave": "pulso", "duty": 0.25, "legato": 0.9}


def por_programa(ev, notas):
    """as notas da trilha separadas pelo programa que valia quando cada uma
    tocou: {programa: [notas]}. No FireRed a mesma trilha troca de instrumento
    no meio da música."""
    trocas = sorted((e[0], e[3]) for e in ev if e[1] == "instrumento")
    grupos = {}
    for n in notas:
        p = next((pr for t, pr in reversed(trocas) if t <= n[0]), trocas[0][1] if trocas else 0)
        grupos.setdefault(p, []).append(n)
    return grupos


def programa_de(ev, notas):
    """o programa que mais tocou nota nessa trilha"""
    grupos = por_programa(ev, notas)
    return max(grupos, key=lambda p: len(grupos[p])) if grupos else 0


def volume_de(ev):
    """o volume da trilha (controle 7 e a força média das notas), de 0 a 1"""
    cc = [e[3] for e in ev if e[1] == "volume"]
    vel = [e[4] for e in ev if e[1] == "liga"]
    v = (max(cc) if cc else 100) / 127
    f = (sum(vel) / len(vel) if vel else 100) / 127
    return v * f


def juntas(ns):
    pontos = sorted([(a, 1) for a, _, _, _ in ns] + [(z, -1) for _, z, _, _ in ns])
    mx = cur = 0
    for _, d in pontos:
        cur += d
        mx = max(mx, cur)
    return mx


def converte(chave, arq):
    div, tr = m.ler(os.path.join(PASTA, arq + ".mid"))
    bpm = round(60_000_000 / next((e[2] for ev in tr for e in ev if e[1] == "tempo"), 500000))
    marcas = {e[2]: e[0] for ev in tr for e in ev if e[1] == "marca"}
    todas = [m.notas_da_trilha(ev) for ev in tr]
    total = max(f for ns in todas for _, f, _, _ in ns)
    fim = marcas.get("]", total)
    total = max(total, fim)
    ini = marcas.get("[", 0)
    passo = 1 if chave in FINO else div // 4
    casa = passo / div
    INTRO, FIM = round(ini / passo) * casa, round(fim / passo) * casa
    canais = []

    def poe(campos, canal, vol):
        intro, laco = corta(canal, 0, INTRO), corta(canal, INTRO, FIM)
        c = {**campos, "vol": round(vol, 3)}
        if intro:
            c["intro"] = intro
        c["notes"] = laco
        canais.append(c)

    for k, (ev, ns) in enumerate(zip(tr, todas)):
        if not ns:
            continue
        prog = programa_de(ev, ns)
        vol = volume_de(ev)
        if prog in (0, 126, 127):
            # a bateria (e o chiado do chip) no kit do jogo
            if prog == 0:
                grade = {}
                for a, _, nota, _ in ns:
                    grade.setdefault(round(a / passo), set()).add(KIT.get(nota, "H"))
            else:
                grade = {}
                for a, *_ in ns:
                    grade.setdefault(round(a / passo), set()).add("H" if prog == 127 else "O")
            n = (total + passo - 1) // passo
            canal = []
            for k in range(n):
                g = grade.get(k)
                if not g:
                    if canal and canal[-1][0] == "-":
                        canal[-1][1] += casa
                    else:
                        canal.append(["-", casa])
                else:
                    canal.append(["".join(sorted(g, key="KSTHOCMA".index)), casa])
            canal = [[x, round(d, 4)] for x, d in canal]
            poe({"wave": "bateria"}, canal, 0.45 * vol)
            continue
        notas = sorted(x[2] for x in ns)
        grave = notas[len(notas) // 2] < 60
        troca = TROCAS.get(chave, {})
        if k in troca and troca[k] is None:
            continue
        campos = dict(troca.get(k) or instrumento(prog, grave))
        segura, vezes = campos.pop("segura", False), campos.pop("vezes", 1)
        if segura:
            poe(campos, segurar(m.canal_do_jogo(ns, div, total, passo=passo)), 0.6 * vol * vezes)
            continue
        # cada instrumento da trilha vira um canal, tocando só as notas dele
        grupos = {0: ns} if k in troca else por_programa(ev, ns)
        for p, gns in sorted(grupos.items()):
            if p in (0, 126, 127) and k not in troca:
                continue                                  # bateria no meio de trilha: rara, fica de fora
            if k not in troca:
                gn = sorted(x[2] for x in gns)
                campos = instrumento(p, gn[len(gn) // 2] < 60)
            poe(campos, m.canal_do_jogo(gns, div, total, passo=passo), 0.6 * vol)
            if juntas(gns) > 1:   # acorde: a nota de baixo vira outro canal
                poe(campos, m.canal_do_jogo(gns, div, total, grave=True, passo=passo), 0.45 * vol)
    if chave in UMA_VEZ:
        for c in canais:
            c["notes"] = c["notes"] + [["-", 64]]
    return {"bpm": BPM.get(chave, bpm), "tracks": canais}, INTRO, FIM


def main():
    saida = {}
    for chave, arq in MUSICAS.items():
        musica, intro, fim = converte(chave, arq)
        saida[chave] = musica
        print(f"{chave:12} {arq:22} {musica['bpm']:3} bpm, {len(musica['tracks'])} canais, intro {intro}, laço {fim - intro}")
    js = ("// AS MÚSICAS DE KANTO DO FIRERED: copiadas dos MIDI do próprio jogo (o\n"
          "// projeto pret/pokefirered) por tools/musicas_frlg.py. GERADO: não edite\n"
          "// aqui. `intro` toca uma vez; `notes` repete (as marcas [ e ] do MIDI).\n"
          "export const FRLG_MUSIC = {\n")
    for chave, mus in saida.items():
        js += f"  {chave}: {{\n    bpm: {mus['bpm']},\n    tracks: [\n"
        for c in mus["tracks"]:
            js += "      " + json.dumps(c, ensure_ascii=False, separators=(",", ":")) + ",\n"
        js += "    ],\n  },\n"
    js += "};\n"
    dest = os.path.join(ROOT, "src", "data", "musicas-frlg.js")
    open(dest, "w", encoding="utf-8").write(js)
    print(f"-> {dest} ({len(js) // 1024} KB)")


if __name__ == "__main__":
    main()
