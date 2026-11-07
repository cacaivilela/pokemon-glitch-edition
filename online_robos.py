#!/usr/bin/env python3
"""
OS BONECOS DA IA no online (pedido do CAIO: "uma IA que comanda 5 bonecos
separadamente pra jogar no online"). Cinco jogadores de mentira, cada um com
nome, roupa e jeito próprios, que entram na sala junto com quem está jogando
de verdade e:

  - ANDAM pelos mapas abertos de Kanto (só no chão e no mato: nada de parede,
    água, porta, placa ou NPC), cada um com a sua vontade: passear, ir até
    um jogador, atravessar pro mapa do lado, ou chegar no mapa de quem está
    sozinho;
  - CONVERSAM: falam sozinhos de vez em quando (cada um do seu jeito), um
    responde o outro, e respondem quem fala com eles no chat (pelo nome, ou
    "OI", "TODOS"...). "SEGUE" faz o boneco ir atrás de você; "PARA" faz ele
    ficar;
  - fazem CARINHA (os emotes) de vez em quando.

Eles moram NO SERVIDOR (este arquivo é carregado pelo online.py), então
aparecem pra todo mundo da sala. Toda sala com gente de verdade ganha os
cinco dela, e quando alguém ENTRA, eles aparecem EM VOLTA dele (o CAIO pediu).
Sala vazia, eles saem junto. O nome de todos termina em ".IA" — ninguém confunde boneco
com gente.

A conversa é escrita aqui (`FALAS`, `RESPOSTAS`); dá pra mudar e reiniciar o
servidor (o run.sh).
"""
import json
import os
import random
import threading
import time

ROOT = os.path.dirname(os.path.abspath(__file__))
PASSO = 0.28             # segundos por tile andando
TIQUE = 0.07

BONECOS = [
    {"id": "ia-zeca", "nome": "A-IA", "sprite": "garoto", "jeito": "aventureiro"},
    {"id": "ia-bia", "nome": "B-IA", "sprite": "garota", "jeito": "fofa"},
    {"id": "ia-tonho", "nome": "C-IA", "sprite": "pescador", "jeito": "pescador"},
    {"id": "ia-lulu", "nome": "D-IA", "sprite": "cientista", "jeito": "nerd"},
    {"id": "ia-dudu", "nome": "E-IA", "sprite": "motoqueiro", "jeito": "competitivo"},
]

FALAS = {
    "aventureiro": ["BORA EXPLORAR {MAPA}!", "ALGUÉM JÁ FOI NA FENDA?", "ACHEI UM ATALHO AQUI!",
                    "TÔ INDO PRO MAPA DO LADO, QUEM VEM?", "{MAPA} É MUITO GRANDE"],
    "fofa": ["QUE DIA BONITO EM {MAPA}!", "EU AMO PIKACHU <3", "ALGUÉM QUER SER MEU AMIGO?",
             "VI UM PIDGEY FOFINHO", "OI GENTE!"],
    "pescador": ["SERÁ QUE TEM MAGIKARP AQUI?", "O MAR TÁ CALMO HOJE", "JÁ PESQUEI UM GYARADOS ASSIM, Ó",
                 "{MAPA} TEM ÁGUA BOA", "QUEM TEM ISCA?"],
    "nerd": ["SABIA QUE O MEW TEM O DNA DE TODOS?", "TÔ ANOTANDO OS POKÉMON DE {MAPA}",
             "O TIPO GLITCH É FORTE CONTRA NORMAL", "MEU POKÉDEX TÁ QUASE CHEIO", "HMMM, INTERESSANTE"],
    "competitivo": ["QUEM QUER APOSTAR CORRIDA?", "EU SOU O MAIS RÁPIDO DE {MAPA}!",
                    "MEU TIME TÁ NO NÍVEL 100", "ALGUÉM AÍ É BOM DE BATALHA?", "PERDI SÓ UMA VEZ NA VIDA"],
}
# OS TIMES DE BATALHA de cada jeito (no nível da média do seu time) e o que
# cada um oferece numa TROCA (no nível do que você ofereceu)
TIMES = {
    "aventureiro": ["pidgeot", "arcanine", "dugtrio", "sandslash"],
    "fofa": ["clefable", "wigglytuff", "raichu", "togetic"],
    "pescador": ["gyarados", "starmie", "kingler", "lapras"],
    "nerd": ["alakazam", "porygon2", "magneton", "exeggutor"],
    "competitivo": ["dragonite", "gengar", "snorlax", "machamp", "tyranitar"],
}
TROCAS = {
    "aventureiro": ["eevee", "vulpix", "growlithe", "ponyta"],
    "fofa": ["pikachu", "jigglypuff", "togepi", "oddish"],
    "pescador": ["poliwag", "psyduck", "staryu", "shellder"],
    "nerd": ["abra", "porygon", "magnemite", "voltorb"],
    "competitivo": ["dratini", "gastly", "machop", "larvitar"],
}
# um boneco às vezes responde o que o outro disse
REPLICAS = ["VERDADE!", "HAHAHA", "SÉRIO?", "EU TAMBÉM!", "NADA A VER", "BOA!", "KKKKK", "ÉÉÉ"]
RESPOSTAS = [
    (("OI", "OLÁ", "OLA", "EAI", "E AI", "SALVE"), ["OI, {NOME}!", "OLÁ {NOME}!", "EAÍ {NOME}!", "OI OI!"]),
    (("TCHAU", "FUI", "XAU"), ["TCHAU {NOME}!", "ATÉ MAIS!", "VOLTA LOGO!"]),
    (("BATALHA", "BATALHAR", "LUTA", "LUTAR"), ["BORA! ME CHAMA PELO MENU ONLINE!", "ME DESAFIA NO ONLINE QUE EU ACEITO!"]),
    (("TROCA", "TROCAR"), ["TROCO! ME CHAMA PELO MENU ONLINE", "TENHO UNS POKÉMON BONS PRA TROCAR"]),
    (("QUEM", "VOCÊ", "VC"), ["SOU {EU}, UM BONECO DA IA!", "EU SOU UM ROBÔ DO SERVIDOR"]),
    (("LEGAL", "MASSA", "TOP", "DAORA"), ["NÉ?!", "MUITO!", "DEMAIS"]),
    (("SHINY",), ["EU QUERIA UM SHINY...", "SHINY?! ONDE?!"]),
]
SEGUE = ("SEGUE", "VEM", "VEM COMIGO", "ME SEGUE")
PARA = ("PARA", "FICA", "ESPERA")


# ----------------------------------------------------------------- os mapas
class Mapas:
    """Os mapas de Kanto (assets/maps/kanto.json), abertos e de dentro: onde
    dá pra pisar e pra onde cada beirada leva."""

    def __init__(self):
        self.m = {}
        try:
            with open(os.path.join(ROOT, "assets", "maps", "kanto.json"), encoding="utf-8") as f:
                dados = json.load(f)
        except (OSError, ValueError):
            return
        for mid, g in dados.items():
            c = g.get("content") or {}
            # (os INTERIORES entram também: dentro de casa eles andam em vez de congelar)
            if not g.get("tags"):
                continue
            w, h = int(g["w"]), int(g["h"])
            proibido = {(o["x"], o["y"]) for o in g.get("objects") or []}
            proibido |= {(o["x"], o["y"]) for o in g.get("warps") or []}
            proibido |= {(n.get("x"), n.get("y")) for n in c.get("npcs") or []}
            self.m[mid] = {
                "w": w, "h": h, "tags": g["tags"], "proibido": proibido,
                "lig": [l for l in g.get("connections") or [] if l.get("to")],
                "nome": c.get("name") or mid.upper().replace("_", " "),
            }
        # só fica ligação pra mapa aberto
        for g in self.m.values():
            g["lig"] = [l for l in g["lig"] if l["to"] in self.m]

    def pisa(self, mid, x, y):
        g = self.m.get(mid)
        if not g or not (0 <= x < g["w"] and 0 <= y < g["h"]):
            return False
        return g["tags"][y * g["w"] + x] in "02" and (x, y) not in g["proibido"]

    def caminho(self, mid, de, ate, limite=900):
        """o caminho mais curto (BFS) de `de` até `ate` dentro do mapa"""
        if de == ate:
            return []
        vindo = {de: None}
        fila = [de]
        i = 0
        while i < len(fila) and i < limite:
            x, y = fila[i]
            i += 1
            for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                n = (x + dx, y + dy)
                if n in vindo or not self.pisa(mid, *n):
                    continue
                vindo[n] = (x, y)
                if n == ate:
                    out = []
                    while n != de:
                        out.append(n)
                        n = vindo[n]
                    return out[::-1]
                fila.append(n)
        return None

    def perto(self, mid, x, y, raio=10):
        """um lugar onde dá pra pisar a até `raio` tiles"""
        g = self.m[mid]
        for _ in range(40):
            nx, ny = x + random.randint(-raio, raio), y + random.randint(-raio, raio)
            if self.pisa(mid, nx, ny):
                return nx, ny
        return None

    def qualquer(self, mid):
        g = self.m[mid]
        livres = [(i % g["w"], i // g["w"]) for i in range(g["w"] * g["h"]) if self.pisa(mid, i % g["w"], i // g["w"])]
        return random.choice(livres) if livres else None

    def beirada(self, mid, lig):
        """um tile da beirada do lado da ligação, onde dá pra atravessar"""
        g, d = self.m[mid], lig["dir"]
        if d in ("up", "down"):
            y = 0 if d == "up" else g["h"] - 1
            cands = [(x, y) for x in range(g["w"]) if self.pisa(mid, x, y)]
        else:
            x = 0 if d == "left" else g["w"] - 1
            cands = [(x, y) for y in range(g["h"]) if self.pisa(mid, x, y)]
        return random.choice(cands) if cands else None

    def atravessa(self, lig, x, y):
        """onde se chega do outro lado da ligação (a conta das conexões do FireRed)"""
        to, d, off = lig["to"], lig["dir"], int(lig.get("offset") or 0)
        g = self.m[to]
        if d == "up":
            return to, x - off, g["h"] - 1
        if d == "down":
            return to, x - off, 0
        if d == "left":
            return to, g["w"] - 1, y - off
        return to, 0, y - off


# ----------------------------------------------------------------- um boneco
class Boneco:
    def __init__(self, ficha, mapas, sala):
        self.f = ficha
        self.sala = sala
        self.id, self.nome, self.jeito = ficha["id"], ficha["nome"], ficha["jeito"]
        self.mapas = mapas
        self.mapa, self.x, self.y, self.dir = "pallet", 5, 5, "down"
        self.caminho = []
        self.atravessar = None          # a ligação que ele vai cruzar no fim do caminho
        self.espera = random.uniform(0.5, 3)
        self.tpasso = 0
        self.seguindo = None            # id de um jogador que ele segue
        self.fala_t = random.uniform(15, 50)
        self.sozinho_t = 0
        self.andando = False
        self.escondido = False          # ESCONDE-ESCONDE: só aparece com alguém do lado
        self.esconderijo = None
        self.parceiro = None            # a TROCA ou a BATALHA de agora: {id, modo, formato, estado, t}

    def pos(self):
        return {"mapa": self.mapa, "x": self.x, "y": self.y, "dir": self.dir,
                "sprite": self.f["sprite"], "andando": self.andando, "escondido": self.escondido}

    @property
    def conhece(self):
        """ele sabe andar neste mapa? (só os abertos de Kanto)"""
        return self.mapa in self.mapas.m

    def nasce_perto(self, mapa, x=None, y=None, raio=6):
        if mapa not in self.mapas.m:
            mapa = "pallet"
        lugar = (self.mapas.perto(mapa, x, y, raio) if x is not None else None) or self.mapas.qualquer(mapa)
        if lugar:
            self.mapa, (self.x, self.y) = mapa, lugar
        self.caminho, self.atravessar = [], None


# a VOLTA do jogador: onde cada boneco aparece quando alguém entra na sala
# (num mapa que eles não conhecem — um interior, Braglitch — é aqui mesmo)
EM_VOLTA = [(-2, 0), (2, 0), (0, 2), (-1, -2), (1, -2)]


# ----------------------------------------------------------------- o cérebro
class Robos:
    def __init__(self, online):
        self.on = online
        self.mapas = Mapas()
        self.salas = {}                 # sala -> [Boneco x5]
        self.falas_pendentes = []       # (quando, boneco, texto)
        self.chegadas = []              # (sala, x, y, mapa): alguém entrou e já disse onde está
        self.jogos = {}                 # sala -> o ESCONDE-ESCONDE valendo
        self.vezes = []                 # (quando, boneco, msg): a vez de escolher na batalha
        self._lock = threading.Lock()
        if self.mapas.m:
            threading.Thread(target=self._roda, daemon=True).start()

    def nome_do_mapa(self, mapa):
        g = self.mapas.m.get(mapa)
        return g["nome"] if g else "AQUI"

    # --- quem está em cada sala
    def _humanos_por_sala(self):
        with self.on._lock:
            salas = {s: dict(q) for s, q in self.on._salas.items()}
        out = {}
        for s, q in salas.items():
            h = {jid: j for jid, j in q.items() if not jid.startswith("ia-")}
            if h:
                out[s] = h
        return out

    def _entra(self, sala):
        bonecos = [Boneco(f, self.mapas, sala) for f in BONECOS]
        self.salas[sala] = bonecos
        for b in bonecos:
            b.nasce_perto(random.choice(["pallet", "viridian", "route1"]))
            self.on.entrar(sala, b.id, b.nome).pos = b.pos()

    def _sai(self, sala):
        for b in self.salas.pop(sala, []):
            self.on.sair(sala, b.id)

    def chegou(self, sala, mapa, x, y):
        """alguém de verdade entrou na sala e mandou onde está: os bonecos
        aparecem EM VOLTA dele (o laço é que faz, na vez dele)"""
        with self._lock:
            self.chegadas.append((sala, mapa, int(x), int(y)))

    def _poe_em_volta(self, sala, mapa, x, y):
        bonecos = self.salas.get(sala)
        if not bonecos:
            return
        for b, (dx, dy) in zip(bonecos, EM_VOLTA):
            if mapa in self.mapas.m:
                alvo = (x + dx, y + dy)
                if self.mapas.pisa(mapa, *alvo):
                    b.mapa, (b.x, b.y) = mapa, alvo
                    b.caminho, b.atravessar = [], None
                else:
                    b.nasce_perto(mapa, x, y, raio=3)
            else:
                # mapa que eles não sabem andar: ficam parados ali do lado
                b.mapa, b.x, b.y = mapa, x + dx, y + dy
                b.caminho, b.atravessar = [], None
            b.dir = "down"
            b.espera = random.uniform(2, 5)
            b.sozinho_t = 0
            self._manda_pos(b)
        if bonecos and random.random() < 0.8:
            self._diz(random.choice(bonecos), random.choice(["OI! CHEGOU!", "OLHA QUEM CHEGOU!", "BEM-VINDO!", "OIII"]), 1.2)

    # --- o laço
    def _roda(self):
        ultimo = time.time()
        while True:
            time.sleep(TIQUE)
            agora = time.time()
            dt, ultimo = agora - ultimo, agora
            try:
                humanos = self._humanos_por_sala()
                for sala in humanos:
                    if sala not in self.salas:
                        self._entra(sala)
                for sala in list(self.salas):
                    if sala not in humanos:
                        self._sai(sala)
                with self._lock:
                    chegadas, self.chegadas = self.chegadas, []
                for sala, mapa, x, y in chegadas:
                    self._poe_em_volta(sala, mapa, x, y)
                for sala, bonecos in self.salas.items():
                    # quem caiu da sala volta; e o "visto" é renovado (boneco não manda ping)
                    with self.on._lock:
                        quarto = self.on._salas.get(sala, {})
                        faltam = [b for b in bonecos if b.id not in quarto]
                        for b in bonecos:
                            if b.id in quarto:
                                quarto[b.id].visto = agora
                    for b in faltam:
                        self.on.entrar(sala, b.id, b.nome).pos = b.pos()
                    if sala in self.jogos:
                        self._juiz(sala, dt, humanos.get(sala, {}))
                    for b in bonecos:
                        self._pensa(b, dt, humanos.get(sala, {}))
                self._fala_o_que_falta(agora)
                with self._lock:
                    prontas = [v for v in self.vezes if v[0] <= agora]
                    self.vezes = [v for v in self.vezes if v[0] > agora]
                for _, b, msg in prontas:
                    self._responde_vez(b, msg)
            except Exception as e:      # um boneco com problema não derruba o servidor
                print("\033[33m[ia]\033[0m", e, flush=True)

    def _manda_pos(self, b):
        with self.on._lock:
            j = self.on._salas.get(b.sala, {}).get(b.id)
        if not j:
            return
        j.visto = time.time()
        j.pos = b.pos()
        self.on.espalha(b.sala, {"tipo": "pos", "de": b.id, **j.pos}, menos=b.id)

    def _pensa(self, b, dt, humanos):
        if b.parceiro:
            if time.time() - b.parceiro["t"] > 180:    # o outro sumiu no meio
                b.parceiro = None
            else:
                if b.andando:
                    b.andando = False
                    self._manda_pos(b)
                return
        if b.sala in self.jogos:
            return self._pensa_no_jogo(b, dt, humanos)
        # ---- falar sozinho, de vez em quando
        b.fala_t -= dt
        if b.fala_t <= 0:
            b.fala_t = random.uniform(40, 110)
            if random.random() < 0.3:
                self._emote(b, random.randint(0, 4))
            else:
                self._diz(b, random.choice(FALAS[b.jeito]).replace("{MAPA}", self.nome_do_mapa(b.mapa)))
                # e às vezes outro boneco do mesmo mapa responde
                outros = [o for o in self.salas.get(b.sala, []) if o is not b and o.mapa == b.mapa]
                if outros and random.random() < 0.5:
                    self._diz(random.choice(outros), random.choice(REPLICAS), atraso=random.uniform(1.5, 4))
        # ---- andar (só nos mapas que ele conhece; nos outros ele fica parado)
        b.tpasso -= dt
        if b.tpasso > 0:
            return
        if not b.conhece:
            # seguindo alguém que foi pra um mapa conhecido: vai junto
            j = humanos.get(b.seguindo) if b.seguindo else None
            if j and j.pos and j.pos.get("mapa") != b.mapa:
                self._segue_pra_outro_mapa(b, j)
            b.tpasso = PASSO * 4
            return
        if b.caminho:
            nx, ny = b.caminho.pop(0)
            if not self.mapas.pisa(b.mapa, nx, ny):
                b.caminho = []
                return
            b.dir = "right" if nx > b.x else "left" if nx < b.x else "down" if ny > b.y else "up"
            b.x, b.y, b.andando = nx, ny, True
            b.tpasso = PASSO * (0.6 if b.jeito == "competitivo" else 1)
            if not b.caminho and b.atravessar:
                to, x, y = self.mapas.atravessa(b.atravessar, b.x, b.y)
                b.atravessar = None
                if self.mapas.pisa(to, x, y):
                    b.mapa, b.x, b.y = to, x, y
                else:
                    b.nasce_perto(to, x, y)
            self._manda_pos(b)
            return
        if b.andando:
            b.andando = False
            self._manda_pos(b)
        b.espera -= PASSO
        if b.espera > 0 and not any(j.pos and j.pos.get("mapa") == b.mapa
                                    and abs(j.pos["x"] - b.x) + abs(j.pos["y"] - b.y) <= 2 for j in humanos.values()):
            b.tpasso = PASSO
            return
        b.espera = random.uniform(1, 5)
        self._decide(b, humanos)
        b.tpasso = PASSO

    def _decide(self, b, humanos):
        """o que esse boneco vai fazer agora (o jeito dele pesa)"""
        aqui = [j for j in humanos.values() if j.pos and j.pos.get("mapa") == b.mapa]
        # alguém ENCOSTOU nele: para e olha pra pessoa (pra dar tempo de chamar com Z)
        perto = next((j for j in aqui if abs(j.pos["x"] - b.x) + abs(j.pos["y"] - b.y) <= 2), None)
        if perto:
            dx, dy = perto.pos["x"] - b.x, perto.pos["y"] - b.y
            novo = ("right" if dx > 0 else "left") if abs(dx) >= abs(dy) else ("down" if dy > 0 else "up")
            if novo != b.dir:
                b.dir = novo
                self._manda_pos(b)
            b.caminho, b.espera = [], 3
            return
        # SEGUINDO alguém: vai pra perto dele (ou pro mapa dele)
        if b.seguindo:
            j = humanos.get(b.seguindo)
            if not j or not j.pos:
                b.seguindo = None
            elif j.pos.get("mapa") != b.mapa:
                self._segue_pra_outro_mapa(b, j)
                return
            else:
                self._vai(b, j.pos["x"], j.pos["y"], raio=2)
                return
        b.sozinho_t = 0 if aqui else b.sozinho_t + 5
        # SEM NINGUÉM POR PERTO faz tempo: chega no mapa de alguém (entrando pela beirada)
        if not aqui and b.sozinho_t > 25 and humanos and random.random() < 0.6:
            j = random.choice([h for h in humanos.values() if h.pos and h.pos.get("mapa") in self.mapas.m] or [None])
            if j:
                g = self.mapas.m[j.pos["mapa"]]
                lig = random.choice(g["lig"]) if g["lig"] else None
                lugar = self.mapas.beirada(j.pos["mapa"], lig) if lig else None
                b.mapa = j.pos["mapa"]
                if lugar:
                    b.x, b.y = lugar
                else:
                    b.nasce_perto(b.mapa)
                b.sozinho_t = 0
                self._manda_pos(b)
                self._vai(b, j.pos["x"], j.pos["y"], raio=3)
                return
        r = random.random()
        gosta_de_gente = {"fofa": 0.5, "competitivo": 0.35}.get(b.jeito, 0.25)
        anda_longe = {"aventureiro": 0.3}.get(b.jeito, 0.1)
        if aqui and r < gosta_de_gente:
            j = random.choice(aqui)
            self._vai(b, j.pos["x"], j.pos["y"], raio=3)
        elif r < gosta_de_gente + anda_longe and self.mapas.m[b.mapa]["lig"]:
            # ATRAVESSA pro mapa do lado
            lig = random.choice(self.mapas.m[b.mapa]["lig"])
            alvo = self.mapas.beirada(b.mapa, lig)
            if alvo:
                cam = self.mapas.caminho(b.mapa, (b.x, b.y), alvo, limite=2500)
                if cam is not None:
                    b.caminho, b.atravessar = cam, lig
        else:
            lugar = self.mapas.perto(b.mapa, b.x, b.y, 8 if b.jeito != "pescador" else 4)
            if lugar:
                self._vai(b, *lugar, raio=0)

    # ============================================ TROCA E BATALHA DE VERDADE
    # As mensagens são as mesmas que dois jogadores trocam (src/systems/online.js,
    # src/scenes/trade.js, src/scenes/linkbattle.js). Quem convida é o DONO da
    # batalha: o jogo dele faz as contas; o boneco é o convidado, que manda o
    # time e escolhe o golpe. Na troca, o boneco oferece um Pokémon dele no
    # nível do que você ofereceu, e o jogo de quem trocou faz a troca.
    def _manda_pra(self, b, para, msg):
        msg = {**msg, "de": b.id}
        self.on.manda_pra(b.sala, para, msg)

    @staticmethod
    def _pacote(especie, nivel, apelido=None):
        """um Pokémon no formato que a rede entende (o jogo completa os golpes e o HP)"""
        n = max(2, min(100, int(nivel)))
        return {"species": especie, "nickname": (apelido or especie.upper())[:12], "level": n,
                "ivs": {k: random.randint(10, 31) for k in ("hp", "atk", "def", "spa", "spd", "spe")},
                "moves": [], "shiny": random.random() < 0.02, "seed": random.randint(0, 9999), "hp": 999}

    def privado(self, sala, para, de, msg):
        """uma mensagem mandada SÓ pra um boneco (o convite, a troca, a batalha)"""
        b = next((x for x in self.salas.get(sala, []) if x.id == para), None)
        if not b:
            return
        tipo = msg.get("tipo")
        if tipo == "convite":
            modo = msg.get("modo")
            print(f"\033[36m[ia]\033[0m convite de {de} pra {b.nome}: {modo}", flush=True)
            # a mesma pessoa chamando de novo: o convite velho morreu do lado dela
            if b.parceiro and b.parceiro["id"] == de:
                b.parceiro = None
            ocupado = (b.parceiro and time.time() - b.parceiro["t"] < 180) or sala in self.jogos
            if ocupado:
                return self._manda_pra(b, de, {"tipo": "resposta", "modo": modo, "ok": False, "motivo": "ocupado"})
            topa = random.random() < (1.0 if b.jeito == "competitivo" and modo == "batalha" else 0.9)
            if not topa:
                self._diz(b, "AGORA NÃO, TÔ OCUPADO OLHANDO AS NUVENS", 0.5)
                return self._manda_pra(b, de, {"tipo": "resposta", "modo": modo, "ok": False})
            print(f"\033[36m[ia]\033[0m {b.nome} aceitou ({modo})", flush=True)
            b.parceiro = {"id": de, "modo": modo, "formato": msg.get("formato") or "simples", "estado": None,
                          "t": time.time(), "deu": False}
            b.seguindo, b.caminho = None, []
            self._manda_pra(b, de, {"tipo": "resposta", "modo": modo, "ok": True})
            self._diz(b, {"batalha": random.choice(["BORA BATALHAR!", "VOU TE AMASSAR!", "PREPARA!"]),
                          "troca": random.choice(["BORA TROCAR!", "TROCO SIM!", "MOSTRA O QUE VOCÊ TEM"])}.get(modo, "BORA!"), 0.5)
            return
        # a BATALHA COMUM e a TROCA COMUM (as de treinador e de NPC) rodam no jogo
        # de quem chamou; aqui o boneco só para um pouco e comenta
        if tipo == "vamosBatalhar":
            print(f"\033[36m[ia]\033[0m {b.nome} batalha comum com {de}", flush=True)
            b.caminho, b.seguindo, b.andando = [], None, False
            b.parceiro = {"id": de, "modo": "comum", "t": time.time() - 120}   # fica parado ~1 minuto
            self._manda_pos(b)
            return
        if tipo == "trocaComum":
            print(f"\033[36m[ia]\033[0m {b.nome} troca comum com {de}", flush=True)
            self._diz(b, random.choice(["OBA, POKÉMON NOVO!", "TROCA BOA!", "ADOREI!"]), 4)
            return
        p = b.parceiro
        if not p or p["id"] != de:
            return
        p["t"] = time.time()
        # ---------------------------------------------------------- TROCA
        if tipo == "trocaOferta":
            nivel = (msg.get("mon") or {}).get("level") or 10
            esp = random.choice(TROCAS[b.jeito])
            self._manda_pra(b, de, {"tipo": "trocaOferta", "mon": self._pacote(esp, nivel)})
            self._manda_pra(b, de, {"tipo": "trocaPronto"})
        elif tipo == "trocaPronto":
            self._diz(b, random.choice(["VALEU PELA TROCA!", "CUIDA BEM DELE!", "TROCA FEITA!"]), 2.6)
            b.parceiro = None
        elif tipo == "trocaCancela":
            self._diz(b, "AH, DESISTIU... TUDO BEM", 0.5)
            b.parceiro = None
        # -------------------------------------------------------- BATALHA
        elif tipo == "batalhaTime":
            if not p["deu"]:
                p["deu"] = True
                niveis = [m.get("level") or 5 for m in msg.get("time") or []] or [10]
                nivel = round(sum(niveis) / len(niveis))
                time_ = random.sample(TIMES[b.jeito], min(3, len(TIMES[b.jeito])))
                p["time"] = [self._pacote(e, nivel) for e in time_]
            self._manda_pra(b, de, {"tipo": "batalhaTime", "time": p["time"], "pede": False})
        elif tipo == "batalhaEstado":
            p["estado"] = msg.get("estado")
        elif tipo == "batalhaVez":
            # pensa um pouquinho antes (parece gente)
            with self._lock:
                self.vezes.append((time.time() + random.uniform(0.6, 1.6), b, dict(msg)))
        elif tipo == "batalhaFim":
            ganhou = not msg.get("donoGanhou")
            self._diz(b, random.choice(["GANHEI!!! BOA LUTA!", "EU SOU DEMAIS!", "GG! QUER REVANCHE?"]) if ganhou
                      else random.choice(["PERDI... MAS FOI MUITO BOA!", "GG! VOCÊ É FORTE!", "DA PRÓXIMA EU GANHO!"]), 1)
            b.parceiro = None

    def _responde_vez(self, b, msg):
        p = b.parceiro
        if not p:
            return
        est = p.get("estado") or {}
        meu, dele = est.get("b") or {}, est.get("a") or {}
        time_ = meu.get("time") or []
        vivo = lambda i: 0 <= i < len(time_) and (time_[i].get("hp") or 0) > 0
        turno = msg.get("turno")
        if msg.get("dupla"):
            ativos = meu.get("ativos") or [0, None]
            alvos = [k for k in (0, 1) if (dele.get("ativos") or [None, None])[k] is not None
                     and ((dele.get("time") or [{}])[dele["ativos"][k]] or {}).get("hp", 0) > 0] or [0]
            acoes = []
            for vaga in (0, 1):
                i = ativos[vaga] if vaga < len(ativos) else None
                if i is None or not vivo(i):
                    continue
                acoes.append({"vaga": vaga, "tipo": "golpe", "i": self._golpe(time_[i]), "alvo": random.choice(alvos)})
            acao = {"tipo": "dupla", "acoes": acoes}
        elif msg.get("espera"):
            acao = {"tipo": "nada"}
        elif msg.get("soTroca"):
            ativo = meu.get("ativo", 0)
            fila = [i for i in range(len(time_)) if i != ativo and vivo(i)]
            acao = {"tipo": "trocar", "i": fila[0]} if fila else {"tipo": "desistir"}
        else:
            ativo = meu.get("ativo", 0)
            acao = {"tipo": "golpe", "i": self._golpe(time_[ativo] if vivo(ativo) else {})}
        self._manda_pra(b, p["id"], {"tipo": "batalhaAcao", "turno": turno, "acao": acao})

    @staticmethod
    def _golpe(mon):
        """um golpe que ainda tem PP (sem saber o tipo de nada: o boneco chuta bem)"""
        pps = mon.get("pps") or [1, 1, 1, 1]
        com = [i for i, pp in enumerate(pps) if (pp or 0) > 0]
        return random.choice(com) if com else 0

    # ================================================== O ESCONDE-ESCONDE
    def _humano(self, sala, jid):
        with self.on._lock:
            return self.on._salas.get(sala, {}).get(jid)

    def _pede_jogo(self, sala, de, nome, modo):
        bonecos = self.salas.get(sala) or []
        if not bonecos:
            return
        a = bonecos[0]
        if sala in self.jogos:
            return self._diz(a, "JÁ TEM UM ESCONDE-ESCONDE VALENDO!", 1)
        j = self._humano(sala, de)
        mapa = j.pos.get("mapa") if j and j.pos else None
        if mapa not in self.mapas.m:
            return self._diz(a, "AQUI NÃO DÁ! VAMOS PRUM LUGAR ABERTO, TIPO UMA ROTA!", 1.2)
        jogo = {"modo": modo, "quem": de, "nome": str(nome or "?")[:12], "mapa": mapa,
                "fase": "contando", "t": 0.0, "achados": [], "conta": 0}
        self.jogos[sala] = jogo
        hx, hy = j.pos["x"], j.pos["y"]
        for b in bonecos:
            b.seguindo, b.atravessar, b.escondido = None, None, False
            if b.mapa != mapa:          # quem estava longe chega pra brincar
                b.nasce_perto(mapa, hx, hy, raio=4)
            self._manda_pos(b)
        if modo == "escondem":
            # cada um corre pra um esconderijo diferente: mato alto, longe de você
            usados = set()
            for b in bonecos:
                b.esconderijo = self._esconderijo(mapa, hx, hy, usados)
                if b.esconderijo:
                    usados.add(b.esconderijo)
                    b.caminho = self.mapas.caminho(mapa, (b.x, b.y), b.esconderijo, limite=4000) or []
            self._diz(a, f"BORA! VOCÊ PROCURA, {jogo['nome']}! CONTA ATÉ 10 E NÃO VALE ESPIAR!", 0.8)
            self._diz(bonecos[1], "CORREEEE!", 1.6)
        else:
            for b in bonecos:
                b.caminho = []
            self._diz(a, f"VAI, {jogo['nome']}! SE ESCONDE QUE A GENTE VAI CONTAR ATÉ 10!", 0.8)

    def _esconderijo(self, mapa, hx, hy, usados):
        """um tile de MATO ALTO longe (7+ tiles) de você; sem mato, qualquer chão longe"""
        g = self.mapas.m[mapa]
        mato, chao = [], []
        for i in range(g["w"] * g["h"]):
            x, y = i % g["w"], i // g["w"]
            if (x, y) in usados or not self.mapas.pisa(mapa, x, y) or max(abs(x - hx), abs(y - hy)) < 7:
                continue
            (mato if g["tags"][i] == "2" else chao).append((x, y))
        for lista in (mato, chao):
            random.shuffle(lista)
            for lugar in lista[:30]:
                if self.mapas.caminho(mapa, (hx, hy), lugar, limite=4000) is not None:
                    return lugar
        return None

    def _juiz(self, sala, dt, humanos):
        """o tempo, a contagem e quem achou quem"""
        jogo = self.jogos[sala]
        jogo["t"] += dt
        bonecos = self.salas.get(sala) or []
        j = humanos.get(jogo["quem"])
        if not j or not j.pos:
            return self._fim_do_jogo(sala, "UÉ, CADÊ? O ESCONDE-ESCONDE ACABOU.")
        if j.pos.get("mapa") != jogo["mapa"]:
            return self._fim_do_jogo(sala, "SAIU DO MAPA NÃO VALE! ACABOU O ESCONDE-ESCONDE.")
        hx, hy = j.pos["x"], j.pos["y"]
        if jogo["fase"] == "contando":
            if jogo["modo"] == "procuram" and jogo["t"] >= jogo["conta"] * 2 + 2 and jogo["conta"] < 5:
                jogo["conta"] += 1
                self._diz(bonecos[jogo["conta"] - 1], f"{jogo['conta'] * 2}...")
            if jogo["t"] >= 10:
                jogo["fase"], jogo["t"] = "valendo", 0.0
                if jogo["modo"] == "escondem":
                    self._diz(bonecos[0], "VALENDO! PODE PROCURAR! (TEM 3 MINUTOS)")
                else:
                    self._diz(bonecos[0], "LÁ VAMOS NÓS! PRONTO OU NÃO, AÍ VAMOS!")
            return
        if jogo["modo"] == "escondem":
            # ACHOU: você do lado (até 1 tile) de quem está escondido
            for b in bonecos:
                if b.id in jogo["achados"] or b.mapa != jogo["mapa"]:
                    continue
                if max(abs(b.x - hx), abs(b.y - hy)) <= 1:
                    jogo["achados"].append(b.id)
                    b.escondido, b.caminho = False, []
                    self._manda_pos(b)
                    self._diz(b, random.choice(["AAAH, ME ACHOU!", "DROGA!", "COMO VOCÊ ME VIU?!", "NÃÃÃO!"]))
            if len(jogo["achados"]) >= len(bonecos):
                return self._fim_do_jogo(sala, f"{jogo['nome']} ACHOU TODO MUNDO EM {int(jogo['t'])} SEGUNDOS! GANHOU!")
            if jogo["t"] >= 180:
                faltam = [b.nome for b in bonecos if b.id not in jogo["achados"]]
                return self._fim_do_jogo(sala, "ACABOU O TEMPO! FALTOU ACHAR: " + ", ".join(faltam))
        else:
            # TE ACHARAM: um boneco perto de você (no mato alto você fica mais
            # escondido). Os 3 primeiros segundos de busca não valem: vantagem
            if jogo["t"] < 3:
                return
            no_mato = self.mapas.m[jogo["mapa"]]["tags"][hy * self.mapas.m[jogo["mapa"]]["w"] + hx] == "2"
            alcance = 1 if no_mato else 2
            for b in bonecos:
                if b.mapa == jogo["mapa"] and max(abs(b.x - hx), abs(b.y - hy)) <= alcance:
                    self._diz(b, f"ACHEI {jogo['nome']}!!!")
                    return self._fim_do_jogo(sala, f"{b.nome} GANHOU! ACHOU {jogo['nome']} EM {int(jogo['t'])} SEGUNDOS.", atraso=1.5)
            if jogo["t"] >= 120:
                return self._fim_do_jogo(sala, f"{jogo['nome']} GANHOU! NINGUÉM CONSEGUIU TE ACHAR!")

    def _pensa_no_jogo(self, b, dt, humanos):
        jogo = self.jogos[b.sala]
        b.tpasso -= dt
        if b.tpasso > 0:
            return
        if jogo["modo"] == "escondem":
            if b.id in jogo["achados"]:
                # achado: vai pra perto de quem está procurando, torcendo
                j = humanos.get(jogo["quem"])
                if not b.caminho and j and j.pos and random.random() < 0.2:
                    self._vai(b, j.pos["x"], j.pos["y"], raio=3)
            elif b.caminho:
                nx, ny = b.caminho.pop(0)
                b.dir = "right" if nx > b.x else "left" if nx < b.x else "down" if ny > b.y else "up"
                b.x, b.y, b.andando = nx, ny, True
                b.tpasso = PASSO * 0.55          # correndo pro esconderijo
                if not b.caminho:
                    b.escondido, b.andando = True, False
                self._manda_pos(b)
                return
            elif not b.escondido:
                b.escondido, b.andando = True, False
                self._manda_pos(b)
        else:
            if jogo["fase"] == "contando":
                if b.dir != "up":                # de costas, contando
                    b.dir, b.andando = "up", False
                    self._manda_pos(b)
            elif b.caminho:
                nx, ny = b.caminho.pop(0)
                b.dir = "right" if nx > b.x else "left" if nx < b.x else "down" if ny > b.y else "up"
                b.x, b.y, b.andando = nx, ny, True
                b.tpasso = PASSO * 0.8
                self._manda_pos(b)
                return
            else:
                # procura: um lugar qualquer do mapa (os de jeito "fofa"/"competitivo"
                # chutam mais perto de onde você foi visto pela última vez)
                j = humanos.get(jogo["quem"])
                if j and j.pos and random.random() < (0.35 if b.jeito in ("fofa", "competitivo") else 0.15):
                    self._vai(b, j.pos["x"] + random.randint(-6, 6), j.pos["y"] + random.randint(-6, 6), raio=3)
                else:
                    lugar = self.mapas.qualquer(b.mapa) if b.conhece else None
                    if lugar:
                        cam = self.mapas.caminho(b.mapa, (b.x, b.y), lugar, limite=3000)
                        b.caminho = (cam or [])[:30]
        b.tpasso = PASSO

    def _fim_do_jogo(self, sala, texto, atraso=0.5):
        self.jogos.pop(sala, None)
        bonecos = self.salas.get(sala) or []
        for b in bonecos:
            if b.escondido:
                b.escondido = False
                self._manda_pos(b)
            b.esconderijo, b.caminho = None, []
        if bonecos:
            self._diz(bonecos[0], texto, atraso)
            self._diz(random.choice(bonecos), random.choice(["DE NOVO? É SÓ FALAR ESCONDE-ESCONDE!", "FOI MUITO LEGAL!", "BORA OUTRA?"]), atraso + 2)

    def _segue_pra_outro_mapa(self, b, j):
        """quem ele segue mudou de mapa: aparece do lado dele lá"""
        mapa, x, y = j.pos["mapa"], j.pos["x"], j.pos["y"]
        if mapa in self.mapas.m:
            b.nasce_perto(mapa, x, y, raio=2)
        else:
            b.mapa, b.x, b.y = mapa, x + random.choice((-1, 1)), y
            b.caminho, b.atravessar = [], None
        self._manda_pos(b)

    def _vai(self, b, x, y, raio=0):
        alvo = (x, y) if raio == 0 else self.mapas.perto(b.mapa, x, y, raio)
        if not alvo:
            return
        cam = self.mapas.caminho(b.mapa, (b.x, b.y), alvo)
        if cam:
            b.caminho, b.atravessar = cam[:40], None

    # --- conversa
    def _diz(self, b, texto, atraso=0.0):
        """fala no chat; frase comprida vira várias mensagens (o chat corta em 40)"""
        partes, linha = [], ""
        for palavra in str(texto).split():
            if linha and len(linha) + 1 + len(palavra) > 38:
                partes.append(linha)
                linha = palavra
            else:
                linha = f"{linha} {palavra}".strip()
        if linha:
            partes.append(linha[:40])
        with self._lock:
            for i, parte in enumerate(partes):
                self.falas_pendentes.append((time.time() + atraso + i * 0.9, b, parte))

    def _fala_o_que_falta(self, agora):
        with self._lock:
            prontas = [f for f in self.falas_pendentes if f[0] <= agora]
            self.falas_pendentes = [f for f in self.falas_pendentes if f[0] > agora]
        for _, b, texto in prontas:
            self.on.espalha(b.sala, {"tipo": "chat", "de": b.id, "texto": texto}, menos=b.id)

    def _emote(self, b, i):
        self.on.espalha(b.sala, {"tipo": "emote", "de": b.id, "i": i}, menos=b.id)

    def ouviu(self, sala, de, nome, texto):
        """alguém de verdade falou no chat: quem foi chamado responde"""
        bonecos = self.salas.get(sala)
        if not bonecos or str(de).startswith("ia-"):
            return
        t = " " + str(texto or "").upper() + " "
        # O ESCONDE-ESCONDE: "ESCONDE-ESCONDE" = eles se escondem e você procura;
        # "EU ME ESCONDO" = você se esconde e eles procuram; "PARAR" acaba
        if "ESCONDE" in t or "ME ESCONDO" in t:
            return self._pede_jogo(sala, de, nome, "procuram" if "ME ESCONDO" in t else "escondem")
        if sala in self.jogos and any(k in t for k in ("PARAR", "PARA O JOGO", "ACABOU", "CHEGA")):
            return self._fim_do_jogo(sala, "TÁ BOM, ACABOU O ESCONDE-ESCONDE!")
        # chamado pelo nome inteiro ("A-IA", "A IA" ou "AIA"): só a letra não
        # vale, senão todo "A" de uma frase chamaria o A-IA
        chamados = [b for b in bonecos
                    if any(v in t for v in (b.nome, b.nome.replace("-", " "), b.nome.replace("-", "")))]
        if not chamados and any(k in t for k in ("TODOS", "GALERA", "GENTE", "BOTS", " IA ")):
            chamados = list(bonecos)
        if not chamados and random.random() < 0.35:
            chamados = [random.choice(bonecos)]
        for i, b in enumerate(chamados[:3]):
            atraso = random.uniform(1.0, 2.5) + i * 1.2
            if any(f" {k} " in t for k in SEGUE):
                b.seguindo, b.caminho = de, []
                self._diz(b, random.choice(["TÔ INDO!", "BORA!", "TE SIGO!"]), atraso)
                continue
            if any(f" {k} " in t for k in PARA):
                b.seguindo, b.caminho = None, []
                self._diz(b, random.choice(["OK, FICO AQUI", "PAREI!", "BELEZA"]), atraso)
                continue
            resp = None
            for chaves, frases in RESPOSTAS:
                if any(f" {k} " in t or k in t.split() for k in chaves):
                    resp = random.choice(frases)
                    break
            if not resp:
                resp = random.choice(REPLICAS + FALAS[b.jeito])
            nome_curto = str(nome or "?")[:12]
            self._diz(b, resp.replace("{NOME}", nome_curto).replace("{EU}", b.nome)
                          .replace("{MAPA}", self.nome_do_mapa(b.mapa)), atraso)


_robos = None


def ligar(online):
    """chamado uma vez pelo online.py"""
    global _robos
    if _robos is None:
        _robos = Robos(online)
    return _robos


def ouviu(sala, de, nome, texto):
    if _robos:
        _robos.ouviu(sala, de, nome, texto)


def privado(sala, para, de, msg):
    """o online.py repassa: mensagem pra um boneco só"""
    if _robos:
        _robos.privado(sala, para, de, msg)


def chegou(sala, mapa, x, y):
    """o online.py avisa: alguém de verdade mandou a PRIMEIRA posição na sala"""
    if _robos:
        _robos.chegou(sala, mapa, x, y)
