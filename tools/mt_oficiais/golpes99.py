"""OS 99 GOLPES OFICIAIS A MAIS (pedido do CAIO, nov/2026: "outros 99 golpes a mais
no jogo"). Lê (sem executar) o moves.js e o learnsets.js do Pokémon Showdown e escreve
src/data/golpes-oficiais.js:
  GOLPES_OFICIAIS   os 99, com nome em português (nomes_pt.py), tipo, força, precisão, PP
  NIVEL_OFICIAL     espécie -> [[nível, golpe]]: quem aprende SUBINDO DE NÍVEL, no nível oficial
  MTS_NOVAS         os que só se aprendem por MÁQUINA: viram MT67 em diante
Uso: python3 -I tools/mt_oficiais/golpes99.py <moves.js> <learnsets.js>"""
import json, re, sys, os, unicodedata
AQUI = os.path.dirname(os.path.abspath(__file__))
exec(open(os.path.join(AQUI, "nomes_pt.py"), encoding="utf-8").read())
def ler(arq):
    t = open(arq, encoding="utf-8").read(); t = t[t.index("{"):t.rindex("}") + 1]
    return json.loads(re.sub(r'([{,])\s*([A-Za-z0-9_]+)\s*:', r'\1"\2":', t))
M, LS = ler(sys.argv[1]), ler(sys.argv[2])
ESCOLHIDOS = """facade doubleedge swift mudslap bulldoze brickbreak aerialace knockoff trailblaze payback thunderbolt stompingtantrum
focusblast megakick megapunch chillingwater superpower throatchop incinerate playrough whirlpool dazzlinggleam foulplay bodypress
smackdown snarl weatherball suckerpunch brutalswing liquidation lashout skittersmack drainpunch lowsweep gunkshot venoshock slash
infestation bounce dualwingbeat muddywater electroweb bugbite brine rockclimb grassyglide drainingkiss thrash avalanche flamecharge
firespin sandtomb megadrain disarmingvoice pounce slam expandingforce scorchingsands scaleshot meteorbeam absorb leechlife twister
nightslash dracometeor breakingswipe bugbuzz temperflare lunge psychicfangs pluck icespinner psychicnoise upperhand alluringvoice
flipturn smartstrike bravebird dualchop skyattack poltergeist burningjealousy risingvoltage iciclespear steelroller triattack
phantomforce solarblade pinmissile gust mysticalfire hammerarm belch supercellslam tripleaxel dragonrush frostbreath doublehit pollenpuff
nuzzle""".split()   # (o CHAMEGO veio depois, a pedido)
TIPO = {"Normal": "NORMAL", "Fire": "FOGO", "Water": "ÁGUA", "Grass": "PLANTA", "Electric": "ELÉTRICO", "Ice": "GELO", "Fighting": "LUTADOR",
        "Poison": "VENENO", "Ground": "TERRA", "Flying": "VOADOR", "Psychic": "PSÍQUICO", "Bug": "INSETO", "Rock": "PEDRA", "Ghost": "FANTASMA",
        "Dragon": "DRAGÃO", "Dark": "SOMBRIO", "Steel": "AÇO", "Fairy": "FADA"}
# os de VÁRIAS PANCADAS batem de uma vez só, com a força somada (o jogo não tem golpe de várias pancadas)
SOMA = {"scaleshot": 75, "iciclespear": 75, "pinmissile": 75, "tripleaxel": 80, "doublehit": 70, "dualchop": 80, "dualwingbeat": 80}
DRENA = {"drainpunch": 0.5, "drainingkiss": 0.75, "megadrain": 0.5, "absorb": 0.5, "leechlife": 0.5}
RECUO = {"doubleedge": 0.33, "bravebird": 0.33}
PRIOR = {"suckerpunch": 1, "upperhand": 1}
PARA = {"nuzzle": 1.0}          # o CHAMEGO sempre paralisa
slug = lambda n: re.sub(r"[^a-z0-9]", "", unicodedata.normalize("NFD", n.lower()).encode("ascii", "ignore").decode())
golpes, en2id = {}, {}
assert len(set(ESCOLHIDOS)) == len(ESCOLHIDOS)
for en in ESCOLHIDOS:
    v = M[en]; nome = PT[en]; gid = slug(nome)
    g = {"name": nome, "type": TIPO[v["type"]], "power": SOMA.get(en, v["basePower"]),
         "acc": 100 if v["accuracy"] is True else v["accuracy"], "pp": v["pp"],
         "category": "fisico" if v["category"] == "Physical" else "especial", "en": en}
    if en in DRENA: g["drena"] = DRENA[en]
    if en in RECUO: g["recoil"] = RECUO[en]
    if en in PRIOR: g["priority"] = PRIOR[en]
    if en in PARA: g["para"] = PARA[en]
    golpes[gid] = g; en2id[en] = gid
nivel, so_maquina = {}, set(ESCOLHIDOS)
for sid, e in LS.items():
    l = (e or {}).get("learnset") or {}
    for en in ESCOLHIDOS:
        fontes = l.get(en, [])
        lv = [(int(m.group(1)), int(m.group(2))) for s in fontes for m in [re.match(r"(\d+)L(\d+)", s)] if m]
        if lv:
            ger = max(g for g, _ in lv); n = min(n for g, n in lv if g == ger)
            nivel.setdefault(sid, []).append([max(1, n), en2id[en]])
            so_maquina.discard(en)
mts = [en2id[en] for en in ESCOLHIDOS if en in so_maquina or any(re.match(r"\d+M", s) for e in LS.values() for s in ((e or {}).get("learnset") or {}).get(en, []))]
dest = os.path.join(AQUI, "..", "..", "src", "data", "golpes-oficiais.js")
with open(dest, "w", encoding="utf-8") as f:
    f.write("// OS 99 GOLPES OFICIAIS A MAIS (pedido do CAIO, nov/2026). GERADO por\n// tools/mt_oficiais/golpes99.py (do Pokémon Showdown, lido como dados). Não edite à mão.\n")
    f.write("export const GOLPES_OFICIAIS = " + json.dumps(golpes, ensure_ascii=False) + ";\n")
    f.write("/** espécie (id do Showdown) -> [[nível, golpe]]: quem aprende subindo de nível */\n")
    f.write("export const NIVEL_OFICIAL = " + json.dumps(nivel, separators=(",", ":")) + ";\n")
    f.write("/** os que também vêm por MÁQUINA: MT67 em diante (src/data/maquinas.js) */\n")
    f.write("export const MTS_NOVAS = " + json.dumps(mts) + ";\n")
    f.write("/** o nome no Showdown de cada MT nova (pro tools/mt_oficiais/gerar.py) */\n")
    f.write("export const MTS_NOVAS_EN = " + json.dumps([golpes[g]["en"] for g in mts]) + ";\n")
print(len(golpes), "golpes;", len(mts), "por MT;", len(nivel), "espécies aprendem subindo de nível")
