"""AS MTs OFICIAIS (pedido do CAIO, nov/2026: "golpes oficiais que só se aprendem
com tm ou sendo alfa"): quem aprende cada MT nos jogos de verdade, LIDO (não
executado) da lista do Pokémon Showdown (data/learnsets.js: fonte "<geração>M" = MÁQUINA).
Uso: python3 -I tools/mt_oficiais/gerar.py <learnsets.js>  ->  src/data/mt-oficiais.json"""
import json, re, sys, os
txt = open(sys.argv[1], encoding="utf-8").read()
txt = txt[txt.index("{"):txt.rindex("}") + 1]
txt = re.sub(r'([{,])\s*([A-Za-z0-9_]+)\s*:', r'\1"\2":', txt)      # as chaves sem aspas ganham aspas
LS = json.loads(txt)
# os golpes das nossas MTs (src/data/maquinas.js), na mesma ordem, com o nome do Showdown
EN = ["dynamicpunch", "dragonclaw", "waterpulse", "swordsdance", "scaryface", "toxic", "hydropump", "bodyslam", "seedbomb", "extrasensory",
      "sunnyday", "xscissor", "icebeam", "blizzard", "hyperbeam", "stealthrock", "hypervoice", "raindance", "energyball", "stomp",
      "takedown", "solarbeam", "irontail", "electroball", "thunder", "earthquake", "headbutt", "dig", "psychic", "shadowball",
      "doublekick", "strugglebug", "psyshock", "shockwave", "flamethrower", "sludgebomb", "rockslide", "fireblast", "rocktomb", "aircutter",
      "poisonjab", "inferno", "leafblade", "scald", "shadowforce", "thief", "steelwing", "headsmash", "dragonpulse", "overheat",
      "gigaimpact", "highhorsepower", "gigadrain", "outrage", "closecombat", "aquatail", "wildcharge", "stoneedge", "hurricane", "moonblast",
      "heatwave", "darkpulse", "ironhead", "sludgewave", "flashcannon", "aurasphere"]
# e as MTs dos 99 golpes oficiais (MT67 em diante), na ordem do src/data/golpes-oficiais.js
_go = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "src", "data", "golpes-oficiais.js"), encoding="utf-8").read()
EN += json.loads(re.search(r"MTS_NOVAS_EN = (\[.*?\]);", _go).group(1))
out = {}
for sid, e in LS.items():
    l = (e or {}).get("learnset") or {}
    mts = [i + 1 for i, m in enumerate(EN) if any(re.match(r"\d+M", s) for s in l.get(m, []))]
    if mts: out[sid] = mts
dest = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "src", "data", "mt-oficiais.json")
json.dump(out, open(dest, "w"), separators=(",", ":"))
print(len(out), "espécies; pikachu:", out.get("pikachu"), "braviaryhisui:", out.get("braviaryhisui"))
