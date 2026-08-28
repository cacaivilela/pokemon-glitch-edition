#!/usr/bin/env python3
"""Importa os mapas de Kanto do decomp pret/pokefirered.

    python3 tools/fetch_maps.py            # tudo que está em MAPS
    python3 tools/fetch_maps.py --only Route2,Route24

Para cada mapa gera:
  assets/maps/<id>.png        chão (fica atrás do jogador)
  assets/maps/<id>_over.png   camada que passa por cima dele (copas, telhados)
  assets/maps/kanto.json      tamanho, colisão, grama, barrancos, portas,
                              conexões, encontros selvagens e NPCs originais

Os diálogos escritos à mão ficam em src/data/maps.js e têm prioridade sobre o
conteúdo gerado aqui.

Arte e dados são da Nintendo / Creatures / Game Freak: ficam só na sua máquina.
"""
import argparse
import json
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from png_io import write_png  # noqa: E402
import tileset as TS  # noqa: E402
from tileset import Tileset, fetch, folder_for, draw_metatile, behavior_of  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "assets", "maps")

# ---------------------------------------------------------------- mapas
OUTDOOR = """
PalletTown Route1 ViridianCity Route2 ViridianForest PewterCity Route3
MtMoon_1F MtMoon_B1F MtMoon_B2F Route4 CeruleanCity Route24 Route25
Route5 Route6 VermilionCity Route11 Route9 Route10 RockTunnel_1F RockTunnel_B1F
LavenderTown Route8 Route7 CeladonCity SaffronCity Route16 Route17 Route18
FuchsiaCity Route12 Route13 Route14 Route15 Route19 Route20 CinnabarIsland
Route21_North Route21_South Route22 Route23 VictoryRoad_1F VictoryRoad_2F
VictoryRoad_3F DiglettsCave_B1F PowerPlant
BirthIsland_Exterior

OneIsland OneIsland_KindleRoad OneIsland_TreasureBeach OneIsland_Harbor
MtEmber_Exterior
TwoIsland TwoIsland_CapeBrink TwoIsland_Harbor
ThreeIsland ThreeIsland_BondBridge ThreeIsland_Port ThreeIsland_Harbor
ThreeIsland_BerryForest
FourIsland FourIsland_Harbor
FiveIsland FiveIsland_Meadow FiveIsland_ResortGorgeous FiveIsland_WaterLabyrinth
FiveIsland_MemorialPillar FiveIsland_Harbor
SixIsland SixIsland_WaterPath SixIsland_GreenPath SixIsland_OutcastIsland
SixIsland_RuinValley SixIsland_Harbor
SevenIsland SevenIsland_Harbor SevenIsland_SevaultCanyon_Entrance
SevenIsland_SevaultCanyon SevenIsland_TanobyRuins
NavelRock_Exterior NavelRock_Harbor NavelRock_Fork NavelRock_Base NavelRock_Summit
NavelRock_1F NavelRock_B1F
NavelRock_SummitPath_2F NavelRock_SummitPath_3F NavelRock_SummitPath_4F
NavelRock_SummitPath_5F
NavelRock_BasePath_B1F NavelRock_BasePath_B2F NavelRock_BasePath_B3F
NavelRock_BasePath_B4F NavelRock_BasePath_B5F NavelRock_BasePath_B6F
NavelRock_BasePath_B7F NavelRock_BasePath_B8F NavelRock_BasePath_B9F
NavelRock_BasePath_B10F NavelRock_BasePath_B11F
""".split()

GATES = """
Route2_ViridianForest_SouthEntrance Route2_ViridianForest_NorthEntrance
Route2_EastBuilding Route5_SouthEntrance Route6_NorthEntrance
Route7_EastEntrance Route8_WestEntrance Route11_EastEntrance_1F
Route12_NorthEntrance_1F Route15_WestEntrance_1F Route16_NorthEntrance_1F
Route18_EastEntrance_1F Route22_NorthEntrance
DiglettsCave_NorthEntrance DiglettsCave_SouthEntrance
""".split()

SERVICES = """
ViridianCity_PokemonCenter_1F ViridianCity_Mart
PewterCity_PokemonCenter_1F PewterCity_Mart
CeruleanCity_PokemonCenter_1F CeruleanCity_Mart
VermilionCity_PokemonCenter_1F VermilionCity_Mart
LavenderTown_PokemonCenter_1F LavenderTown_Mart
CeladonCity_PokemonCenter_1F SaffronCity_PokemonCenter_1F SaffronCity_Mart
FuchsiaCity_PokemonCenter_1F FuchsiaCity_Mart
CinnabarIsland_PokemonCenter_1F CinnabarIsland_Mart
Route4_PokemonCenter_1F Route10_PokemonCenter_1F
PalletTown_PlayersHouse_1F PalletTown_ProfessorOaksLab

OneIsland_PokemonCenter_1F TwoIsland_PokemonCenter_1F
ThreeIsland_PokemonCenter_1F ThreeIsland_Mart
FourIsland_PokemonCenter_1F FourIsland_Mart
FiveIsland_PokemonCenter_1F SixIsland_PokemonCenter_1F SixIsland_Mart
SevenIsland_PokemonCenter_1F SevenIsland_Mart
""".split()

GYMS = """
PewterCity_Gym CeruleanCity_Gym VermilionCity_Gym CeladonCity_Gym
FuchsiaCity_Gym SaffronCity_Gym CinnabarIsland_Gym ViridianCity_Gym
""".split()

# OS LUGARES FECHADOS: as cavernas, torres e prédios que o FireRed tem e que
# ainda não estavam aqui. São 109 mapas de uma vez, e é de propósito que seja de
# uma vez: warp aponta pra mapa, e importar metade de um prédio deixa a outra
# metade com porta que não abre — foi exatamente o que aconteceu com a ROCHA
# NAVEL quando eu trouxe 5 dos 22 andares dela.
#
# Os nomes NÃO foram digitados de cabeça: saíram da lista de `data/maps` do
# próprio decomp. Nome errado aqui não dá erro, dá mapa faltando.
DUNGEONS = """
CeruleanCave_1F CeruleanCave_2F CeruleanCave_B1F
FiveIsland_LostCave_Entrance FiveIsland_LostCave_Room1
FiveIsland_LostCave_Room10 FiveIsland_LostCave_Room11
FiveIsland_LostCave_Room12 FiveIsland_LostCave_Room13
FiveIsland_LostCave_Room14 FiveIsland_LostCave_Room2
FiveIsland_LostCave_Room3 FiveIsland_LostCave_Room4
FiveIsland_LostCave_Room5 FiveIsland_LostCave_Room6
FiveIsland_LostCave_Room7 FiveIsland_LostCave_Room8
FiveIsland_LostCave_Room9 FourIsland_IcefallCave_1F
FourIsland_IcefallCave_B1F FourIsland_IcefallCave_Back
FourIsland_IcefallCave_Entrance FuchsiaCity_SafariZone_Entrance
FuchsiaCity_SafariZone_Office MtEmber_Exterior MtEmber_RubyPath_1F
MtEmber_RubyPath_B1F MtEmber_RubyPath_B1F_Stairs MtEmber_RubyPath_B2F
MtEmber_RubyPath_B2F_Stairs MtEmber_RubyPath_B3F MtEmber_RubyPath_B4F
MtEmber_RubyPath_B5F MtEmber_Summit MtEmber_SummitPath_1F
MtEmber_SummitPath_2F MtEmber_SummitPath_3F PokemonMansion_1F
PokemonMansion_2F PokemonMansion_3F PokemonMansion_B1F PokemonTower_1F
PokemonTower_2F PokemonTower_3F PokemonTower_4F PokemonTower_5F
PokemonTower_6F PokemonTower_7F CeladonCity_GameCorner CeladonCity_GameCorner_PrizeRoom
RocketHideout_B1F RocketHideout_B2F
RocketHideout_B3F RocketHideout_B4F RocketHideout_Elevator SafariZone_Center
SafariZone_Center_RestHouse SafariZone_East SafariZone_East_RestHouse
SafariZone_North SafariZone_North_RestHouse SafariZone_SecretHouse
SafariZone_West SafariZone_West_RestHouse SeafoamIslands_1F
SeafoamIslands_B1F SeafoamIslands_B2F SeafoamIslands_B3F SeafoamIslands_B4F
SevenIsland_SevaultCanyon_TanobyKey SevenIsland_TanobyRuins
SevenIsland_TanobyRuins_DilfordChamber SevenIsland_TanobyRuins_LiptooChamber
SevenIsland_TanobyRuins_MoneanChamber SevenIsland_TanobyRuins_RixyChamber
SevenIsland_TanobyRuins_ScufibChamber SevenIsland_TanobyRuins_ViapoisChamber
SevenIsland_TanobyRuins_WeepthChamber SevenIsland_TrainerTower SilphCo_10F
SilphCo_11F SilphCo_1F SilphCo_2F SilphCo_3F SilphCo_4F SilphCo_5F
SilphCo_6F SilphCo_7F SilphCo_8F SilphCo_9F SilphCo_Elevator
SixIsland_AlteringCave SixIsland_DottedHole_1F SixIsland_DottedHole_B1F
SixIsland_DottedHole_B2F SixIsland_DottedHole_B3F SixIsland_DottedHole_B4F
SixIsland_DottedHole_SapphireRoom SixIsland_PatternBush
ThreeIsland_DunsparceTunnel TrainerTower_1F TrainerTower_2F TrainerTower_3F
TrainerTower_4F TrainerTower_5F TrainerTower_6F TrainerTower_7F
TrainerTower_8F TrainerTower_Elevator TrainerTower_Lobby TrainerTower_Roof
""".split()

MAPS = OUTDOOR + GATES + SERVICES + GYMS + DUNGEONS

# ids curtos para os mapas do começo (compatibilidade com src/data/maps.js)
ALIAS = {
    "PalletTown": "pallet", "Route1": "route1", "ViridianCity": "viridian",
    "PalletTown_PlayersHouse_1F": "home", "PalletTown_ProfessorOaksLab": "lab",
    "ViridianCity_PokemonCenter_1F": "center", "ViridianCity_Mart": "mart",
    "BirthIsland_Exterior": "birth_island",
}

MB_TALL_GRASS = 0x02
MB_JUMP = {0x38: "leste", 0x39: "oeste", 0x3A: "norte", 0x3B: "sul"}
WATER_MB = {0x10, 0x11, 0x12, 0x13, 0x15, 0x17, 0x1A, 0x1B}
FREE, BLOCK, GRASS, WATER_T, L_S, L_E, L_W, L_N = 0, 1, 2, 3, 4, 5, 6, 7
LEDGE_TAG = {"sul": L_S, "leste": L_E, "oeste": L_W, "norte": L_N}
LAND_RATES = [20, 20, 10, 10, 10, 10, 5, 5, 4, 4, 1, 1]

# gráfico original -> papel de sprite do jogo
GFX_ROLE = {
    "YOUNGSTER": "garoto", "BOY": "garoto", "RICH_BOY": "garoto", "CAMPER": "garoto",
    "SITTING_BOY": "garoto", "GBA_KID": "garoto", "SCHOOL_KID": "garoto",
    "LASS": "garota", "GIRL": "garota", "PICNICKER": "garota", "CRUSH_GIRL": "garota",
    "BEAUTY": "garota", "TUBER_F": "menina",
    "WOMAN_1": "mae", "WOMAN_2": "mae", "WOMAN_3": "velha", "MOM": "mae",
    "OLD_WOMAN": "velha", "OLD_MAN_1": "velho", "OLD_MAN_2": "velho",
    "GENTLEMAN": "gentleman", "FAT_MAN": "gentleman", "BALDING_MAN": "velho",
    "MAN": "gentleman", "LITTLE_BOY": "menino", "LITTLE_GIRL": "menina",
    "NURSE": "enfermeira", "CLERK": "balconista", "SCIENTIST": "cientista",
    "POLICEMAN": "policial", "FISHER": "pescador", "BUG_CATCHER": "cacador",
    "PROF_OAK": "prof", "BLUE": "rival", "GYM_GUY": "gentleman",
    "BIKER": "motoqueiro", "SAILOR": "marinheiro", "HIKER": "montanhista",
    "ROCKET_M": "rocket", "ROCKET_F": "rocketf", "BLACK_BELT": "lutador",
    "COOLTRAINER_M": "superm", "COOLTRAINER_F": "superf",
    "WORKER_M": "tecnico", "WORKER_F": "tecnica", "CHANNELER": "canalizadora",
    "POKE_MANIAC": "maniaco", "ROCKER": "roqueiro", "CAPTAIN": "marinheiro",
}
FALLBACK_LINES = {
    "garoto": ["JÁ TREINOU HOJE? EU TREINO TODO DIA.", "UM DIA EU CHEGO NA LIGA POKÉMON."],
    "garota": ["OS POKÉMON DAQUI SÃO DIFERENTES DOS DA MINHA CIDADE.", "ADORO OLHAR A GRAMA ALTA DE LONGE."],
    "mae": ["CUIDADO COM A GRAMA ALTA, VIU?", "VOLTE ANTES DE ESCURECER."],
    "velha": ["NA MINHA ÉPOCA A GENTE ANDAVA TUDO A PÉ.", "DESCANSE NO CENTRO POKÉMON."],
    "velho": ["JÁ ANDEI POR TODA KANTO.", "CADA ROTA TEM SEU PRÓPRIO PERIGO."],
    "gentleman": ["QUE DIA AGRADÁVEL PARA UMA CAMINHADA.", "OS TREINADORES DE HOJE TÊM MUITA PRESSA."],
    "menino": ["EU VOU SER O MELHOR!", "MEU IRMÃO TEM UM POKÉMON GIGANTE."],
    "menina": ["VOCÊ VIU UM POKÉMON COR-DE-ROSA POR AQUI?", "EU QUERO UM POKÉMON FOFINHO."],
    "policial": ["CIRCULANDO, CIRCULANDO. TÁ TUDO EM ORDEM.", "SE VIR ALGO ESTRANHO, ME AVISE."],
    "pescador": ["PEIXE NÃO MORDE HOJE.", "PRECISA DE UMA VARA PRA PESCAR AQUI."],
    "cacador": ["INSETOS SÃO OS MELHORES POKÉMON!", "PEGUEI TRÊS CATERPIE HOJE."],
    "cientista": ["ESTOU ESTUDANDO O COMPORTAMENTO DOS POKÉMON.", "OS DADOS AINDA ESTÃO INCOMPLETOS."],
    "motoqueiro": ["SAI DA FRENTE!", "MINHA BICICLETA É MAIS RÁPIDA QUE VOCÊ."],
    "marinheiro": ["O MAR TÁ BRAVO HOJE.", "JÁ NAVEGUEI ATÉ AS ILHAS SEVII."],
    "montanhista": ["ESSAS PEDRAS NÃO SE MOVEM SOZINHAS.", "SUBIR MONTANHA É COM A GENTE."],
    "lutador": ["FORÇA E DISCIPLINA!", "MEUS POKÉMON TREINAM COMIGO."],
    "rocket": ["NÃO OLHA PRA MIM.", "SOME DAQUI, PIRRALHO."],
    "rocketf": ["ESSE LUGAR É NOSSO AGORA.", "NÃO SE META NO QUE NÃO TE CHAMA."],
    "superm": ["MEU TIME ESTÁ QUASE PRONTO PRA LIGA.", "TREINE MAIS ANTES DE ME DESAFIAR."],
    "superf": ["JÁ DERROTEI TRÊS LÍDERES.", "TIPOS IMPORTAM MAIS QUE NÍVEL."],
    "tecnico": ["O GERADOR TÁ FALHANDO DE NOVO.", "CUIDADO ONDE PISA."],
    "tecnica": ["ESTOU DE PLANTÃO HOJE.", "SE PRECISAR, ME CHAMA."],
    "canalizadora": ["EU SINTO UMA PRESENÇA...", "OS ESPÍRITOS ESTÃO INQUIETOS."],
    "maniaco": ["EU COLECIONO TUDO!", "TROCA COMIGO? NÃO? TUDO BEM."],
    "roqueiro": ["ROCK AND ROLL!", "MEU AMPLIFICADOR TÁ NO MÁXIMO."],
    "prof": ["OS POKÉMON DESTA REGIÃO AINDA GUARDAM SEGREDOS."],
    "rival": ["ANDA LOGO, EU TENHO MAIS O QUE FAZER."],
    "enfermeira": ["BEM-VINDO AO CENTRO POKÉMON!"],
    "balconista": ["OI! BEM-VINDO À LOJA POKÉMON."],
}


def snake(folder):
    """MtMoon_1F -> MT_MOON_1F  |  PewterCity_Mart -> PEWTER_CITY_MART"""
    return re.sub(r"(?<=[a-z])(?=[A-Z])", "_", folder).upper()


def map_const(folder):
    return "MAP_" + snake(folder)


def game_id(folder):
    return ALIAS.get(folder) or snake(folder).lower()


def pretty(folder):
    n = ALIAS.get(folder, folder)
    base = folder.split("_")[0]
    m = re.match(r"Route(\d+)", base)
    if m:
        extra = folder[len(base):].strip("_")
        return f"ROTA {m.group(1)}" + (f" - {extra.replace('_', ' ').upper()}" if extra else "")
    words = re.sub(r"(?<!^)(?=[A-Z])", " ", folder.replace("_", " ")).upper()
    return words.replace("POKEMON CENTER 1 F", "CENTRO POKÉMON").replace("MART", "LOJA POKÉMON") \
                .replace("CITY", "CIDADE").replace("TOWN", "VILA").replace("ISLAND", "ILHA")


def music_for(folder, interior, tileset):
    if "PokemonCenter" in folder:
        return "center"
    if folder.endswith("Mart"):
        return "mart"
    if interior:
        return "casa"
    if "MtMoon" in folder or "Cave" in folder or "RockTunnel" in folder or "VictoryRoad" in folder:
        return "cave"
    if re.match(r"Route\d", folder):
        return "route"
    return "viridian"


def species_slug(const):
    return const.replace("SPECIES_", "").lower().replace("_", "")


def wild_tables():
    data = json.loads(fetch("src/data/wild_encounters.json", binary=False))
    out = {}
    for group in data.get("wild_encounter_groups", []):
        # no Emerald existe um grupo que não é de mapa (pirâmide de batalha)
        if group.get("for_maps") is False:
            continue
        for enc in group.get("encounters", []):
            land = enc.get("land_mons")
            if not land or "map" not in enc:
                continue
            slots = {}
            for i, mon in enumerate(land.get("mons", [])[:12]):
                sid = species_slug(mon["species"])
                w = LAND_RATES[i] if i < len(LAND_RATES) else 1
                cur = slots.setdefault(sid, {"id": sid, "min": 99, "max": 0, "w": 0})
                cur["min"] = min(cur["min"], mon["min_level"])
                cur["max"] = max(cur["max"], mon["max_level"])
                cur["w"] += w
            out[enc["map"]] = list(slots.values())
    return out


def warp_id(v):
    """O número da porta de destino.

    Os ELEVADORES do FireRed usam `WARP_ID_DYNAMIC`: o destino é decidido na
    hora, pelo andar de onde a pessoa entrou. Aqui não existe porta que decide
    nada — então ela vira a porta 0 do mapa de destino, e o elevador anda para
    um andar fixo em vez de não andar para lugar nenhum.

    Sem isto, os dois elevadores não importavam, e um elevador que não existe
    deixa as portas dos onze andares da SILPH abrindo pra lugar nenhum."""
    return 0 if str(v).startswith("WARP_ID") else int(v)


def layouts():
    data = json.loads(fetch("data/layouts/layouts.json", binary=False))["layouts"]
    return {l["id"]: l for l in data if l.get("id")}


def convert(folder, layout_index, dest_index, wild):
    mapjson = json.loads(fetch(f"data/maps/{folder}/map.json", binary=False))
    lay = layout_index[mapjson["layout"]]
    w, h = lay["width"], lay["height"]
    prim = Tileset(folder_for(lay["primary_tileset"]))
    sec = Tileset(folder_for(lay["secondary_tileset"])) if lay.get("secondary_tileset") else None
    interior = lay["primary_tileset"] == "gTileset_Building"

    blocks = fetch(lay["blockdata_filepath"])
    cells = [int.from_bytes(blocks[i * 2:i * 2 + 2], "little") for i in range(w * h)]

    px = bytearray(w * 16 * h * 16 * 4)
    over = bytearray(w * 16 * h * 16 * 4)
    tags = []
    for i, v in enumerate(cells):
        mid, coll = v & 0x3FF, (v >> 10) & 3
        ox, oy = (i % w) * 16, (i // w) * 16
        draw_metatile(prim, sec, mid, px, ox, oy, w * 16, "ground")
        draw_metatile(prim, sec, mid, over, ox, oy, w * 16, "over")
        b = behavior_of(prim, sec, mid)
        if b in MB_JUMP: tags.append(LEDGE_TAG[MB_JUMP[b]])
        elif b == MB_TALL_GRASS: tags.append(GRASS)
        elif b in WATER_MB: tags.append(WATER_T)
        else: tags.append(BLOCK if coll else FREE)

    gid = game_id(folder)
    os.makedirs(OUT, exist_ok=True)
    write_png(os.path.join(OUT, f"{gid}.png"), w * 16, h * 16, px)
    write_png(os.path.join(OUT, f"{gid}_over.png"), w * 16, h * 16, over)

    warps = [{"x": p["x"], "y": p["y"], "to": dest_index.get(p["dest_map"]),
              "toWarp": warp_id(p["dest_warp_id"]), "destName": p["dest_map"]}
             for p in mapjson.get("warp_events", [])]
    conns = [{"dir": c["direction"], "offset": c["offset"], "to": dest_index.get(c["map"]),
              "destName": c["map"]} for c in (mapjson.get("connections") or [])]

    # NPCs: posição e sprite originais, falas genéricas em PT-BR
    npcs = []
    for i, o in enumerate(mapjson.get("object_events", [])):
        gfx = o.get("graphics_id", "").replace("OBJ_EVENT_GFX_", "")
        role = GFX_ROLE.get(gfx)
        if not role:
            continue
        npc = {"id": f"n{i}", "x": o["x"], "y": o["y"], "dir": "down", "sprite": role,
               "lines": FALLBACK_LINES.get(role, ["..."])}
        if role == "enfermeira":
            npc["heal"] = True
        if role == "balconista" and folder.endswith("Mart"):
            npc["shop"] = [{"item": "poké bola", "price": 200}, {"item": "poção", "price": 300}]
        npcs.append(npc)

    content = {
        "name": pretty(folder), "music": music_for(folder, interior, lay), "interior": interior,
        "npcs": npcs,
        # a chave do decomp sai do `map_const`, que já existe e é usado no
        # `dest_index`. Aqui a mesma regra estava reescrita à mão — e escrita
        # errado: ela punha um `_` antes do F de "1F", então MtMoon_1F virava
        # MAP_MT_MOON_1_F e não achava nada. TODO mapa de andar ficou sem
        # selvagem por causa disso: MONTE LUA, TÚNEL DA PEDRA, ESTRADA DA
        # VITÓRIA. Regra copiada é regra que se perde de si mesma.
        "encounters": wild.get(map_const(folder), []),
    }
    return {"w": w, "h": h, "tags": "".join(str(t) for t in tags), "warps": warps,
            "connections": conns, "content": content,
            "objects": [{"x": o["x"], "y": o["y"], "gfx": o.get("graphics_id", "").replace("OBJ_EVENT_GFX_", "")}
                        for o in mapjson.get("object_events", [])],
            "signs": [{"x": s["x"], "y": s["y"]} for s in mapjson.get("bg_events", [])]}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", help="lista separada por vírgula de pastas do decomp")
    ap.add_argument("--repo", help="decomp de origem (pokefirered | pokeemerald)")
    a = ap.parse_args()
    if a.repo:
        TS.set_repo(a.repo)
    lista = MAPS
    folders = a.only.split(",") if a.only else lista
    idx = layouts()
    dest_index = {map_const(f): game_id(f) for f in lista}
    wild = wild_tables()

    existing = {}
    path = os.path.join(OUT, "kanto.json")
    if os.path.exists(path):
        existing = json.load(open(path, encoding="utf-8"))

    ok = 0
    for folder in folders:
        try:
            existing[game_id(folder)] = convert(folder, idx, dest_index, wild)
            m = existing[game_id(folder)]
            print(f"  {game_id(folder):34} {m['w']:3}x{m['h']:<3} warps={len(m['warps']):2} "
                  f"npcs={len(m['content']['npcs']):2} enc={len(m['content']['encounters']):2}")
            ok += 1
        except Exception as e:
            print(f"  {folder:34} FALHOU: {type(e).__name__}: {e}")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(existing, f, ensure_ascii=False, separators=(",", ":"))
    print(f"{ok}/{len(folders)} mapas -> {path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
