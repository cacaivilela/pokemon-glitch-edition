#!/usr/bin/env python3
"""
Funções online do Pokemon Glitch Edition — salas, presença, relay e PRESENTE
MISTERIOSO. Zero dependências: só a stdlib, no mesmo espírito do dev_server.py.

O servidor é BURRO de propósito. Ele sabe três coisas:

  1. quem está em cada sala (e a última posição de cada um, pra quem chega
     depois já ver todo mundo no lugar certo);
  2. como entregar uma mensagem — pra sala inteira ou pra um jogador só;
  3. onde ficam os cartões do PRESENTE MISTERIOSO (online/cartoes.json).

Todo o resto — troca, batalha link, chat — é combinado ENTRE os jogadores por
mensagens que o servidor só repassa. Assim dá pra mudar as regras do jogo
mexendo só no JavaScript, que tem hot-swap, sem reiniciar o servidor.

Protocolo (tudo JSON):

  GET  /__net?sala=X&id=Y&nome=Z   SSE. Recebe o que acontece na sala.
  POST /__net                      {sala, de, tipo, para?, ...} manda uma mensagem.
  GET  /__gift                     os cartões que este servidor oferece.
  POST /__gift                     publica um cartão novo pra sala.

Tipos que o servidor entende (o resto ele repassa sem ler):

  pos   guarda a posição e repassa      sai   tira da sala
  ping  só diz que continua vivo        nome  troca o nome na lista
"""
import json
import os
import queue
import re
import threading
import time
import urllib.parse

ROOT = os.path.dirname(os.path.abspath(__file__))
CARTOES = os.path.join(ROOT, "online", "cartoes.json")

SEM_SINAL = 20.0        # sem ping por tanto tempo: caiu
LIMPEZA = 4.0           # de quanto em quanto tempo procuro quem caiu
MAX_FILA = 256          # mensagens presas pra um cliente lento
MAX_CARTOES = 60        # o arquivo de cartões não cresce pra sempre
MAX_MSG = 64 * 1024     # uma mensagem gorda demais é lixo

_lock = threading.RLock()
_salas = {}             # sala -> { id: Jogador }
_meta = {}              # sala -> { privada, criada, dono } — quem criou decide
_limpeza = None


def agora():
    return time.time()


def slug(s, tamanho=24):
    s = re.sub(r"[^a-zA-Z0-9_-]+", "", str(s or ""))
    return s[:tamanho]


class Jogador:
    """Um jogador conectado. `fila` é o que ainda não foi entregue pra ele."""

    def __init__(self, jid, nome, sala):
        self.id = jid
        self.nome = nome
        self.sala = sala
        self.fila = queue.Queue(maxsize=MAX_FILA)
        self.pos = None
        self.visto = agora()

    def cartao(self):
        """Como este jogador aparece na lista dos outros."""
        d = {"id": self.id, "nome": self.nome}
        if self.pos:
            d.update(self.pos)
        return d

    def manda(self, msg):
        try:
            self.fila.put_nowait(msg)
        except queue.Full:
            pass        # cliente travado: perde o evento em vez de travar a sala


# ------------------------------------------------------------------ salas
def entrar(sala, jid, nome, privada=False):
    """Coloca o jogador na sala e avisa quem já estava lá.

    A sala NASCE quando o primeiro entra — criar e entrar são a mesma coisa. Só
    quem cria decide se ela é privada (fora da lista de salas abertas); quem
    chega depois não muda isso, senão qualquer um escondia a sala dos outros.
    """
    with _lock:
        nova = sala not in _salas or not _salas.get(sala)
        quarto = _salas.setdefault(sala, {})
        if nova:
            _meta[sala] = {"privada": bool(privada), "criada": agora(), "dono": jid}
        antigo = quarto.get(jid)
        if antigo:                       # reconectou (F5): a fila velha morre
            antigo.manda(None)
        j = Jogador(jid, nome, sala)
        if antigo and antigo.pos:
            j.pos = antigo.pos           # não pisca de volta pro spawn
        quarto[jid] = j
        outros = [o.cartao() for o in quarto.values() if o.id != jid]
    j.manda(json.dumps({"tipo": "sala", "sala": sala, "eu": jid, "jogadores": outros}))
    espalha(sala, {"tipo": "entrou", "jogador": j.cartao()}, menos=jid)
    _garante_limpeza()
    return j


def sair(sala, jid, motivo="saiu"):
    with _lock:
        quarto = _salas.get(sala)
        j = quarto.pop(jid, None) if quarto else None
        if quarto is not None and not quarto:
            _salas.pop(sala, None)
            _meta.pop(sala, None)          # sala vazia deixa de existir
    if not j:
        return
    j.manda(None)
    espalha(sala, {"tipo": "saiu", "id": jid, "motivo": motivo})


def sair_obj(j, motivo="saiu"):
    """Sai só se este ainda for o jogador que está na sala: quem deu F5 já foi
    substituido por outro objeto, e derrubar aqui mataria a conexão nova."""
    with _lock:
        if _salas.get(j.sala, {}).get(j.id) is not j:
            return
    sair(j.sala, j.id, motivo)


def espalha(sala, msg, menos=None):
    """Manda pra sala inteira (menos, opcionalmente, um jogador)."""
    texto = json.dumps(msg)
    with _lock:
        alvos = [j for j in _salas.get(sala, {}).values() if j.id != menos]
    for j in alvos:
        j.manda(texto)


def manda_pra(sala, jid, msg):
    with _lock:
        j = _salas.get(sala, {}).get(jid)
    if j:
        j.manda(json.dumps(msg))
        return True
    return False


def lista(sala):
    with _lock:
        return [j.cartao() for j in _salas.get(sala, {}).values()]


def salas_abertas():
    """As salas que aparecem pra quem está procurando: as privadas ficam de fora
    (nelas só entra quem sabe o nome)."""
    with _lock:
        return [
            {"sala": nome, "jogadores": len(q), "criada": _meta.get(nome, {}).get("criada", 0)}
            for nome, q in sorted(_salas.items())
            if q and not _meta.get(nome, {}).get("privada")
        ]


def _limpar():
    """Tira da sala quem parou de dar sinal de vida."""
    while True:
        time.sleep(LIMPEZA)
        limite = agora() - SEM_SINAL
        mortos = []
        with _lock:
            for sala, quarto in _salas.items():
                for j in quarto.values():
                    if j.visto < limite:
                        mortos.append((sala, j.id))
        for sala, jid in mortos:
            sair(sala, jid, "caiu")


def _garante_limpeza():
    global _limpeza
    with _lock:
        if _limpeza is None:
            _limpeza = threading.Thread(target=_limpar, daemon=True)
            _limpeza.start()


# --------------------------------------------------------------- mensagens
def recebe(msg):
    """Uma mensagem que chegou pelo POST. Devolve (ok, erro)."""
    sala = slug(msg.get("sala"), 32)
    de = slug(msg.get("de"))
    tipo = str(msg.get("tipo") or "")[:32]
    if not sala or not de or not tipo:
        return False, "sala, de e tipo são obrigatórios"

    with _lock:
        j = _salas.get(sala, {}).get(de)
    if not j:
        return False, "você não está nesta sala"
    j.visto = agora()

    if tipo == "ping":
        return True, None
    if tipo == "sai":
        sair(sala, de)
        return True, None
    if tipo == "nome":
        j.nome = str(msg.get("nome") or j.nome)[:12]
        espalha(sala, {"tipo": "renomeou", "id": de, "nome": j.nome}, menos=de)
        return True, None
    if tipo == "pos":
        j.pos = {
            "mapa": str(msg.get("mapa") or "")[:40],
            "x": int(msg.get("x") or 0),
            "y": int(msg.get("y") or 0),
            "dir": str(msg.get("dir") or "down")[:5],
            "sprite": slug(msg.get("sprite"), 20) or "hero",
            "andando": bool(msg.get("andando")),
        }
        msg = {"tipo": "pos", "de": de, **j.pos}

    msg.setdefault("de", de)
    para = slug(msg.get("para"))
    if para:
        if not manda_pra(sala, para, msg):
            return False, "esse jogador não está mais na sala"
        return True, None
    espalha(sala, msg, menos=de)
    return True, None


# ------------------------------------------------------- presente misterioso
PADRAO = [
    {
        "id": "cartao-boas-vindas",
        "titulo": "CARTÃO DE BOAS-VINDAS",
        "texto": "UM PRESENTE DE QUEM SUBIU ESTE SERVIDOR. GUARDE BEM.",
        "de": "SERVIDOR",
        "itens": [{"item": "poké bola", "qtd": 5}, {"item": "poção", "qtd": 3}],
    },
    {
        "id": "cartao-pedra-perdida",
        "titulo": "PEDRA SEM DONO",
        "texto": "ACHARAM ESTA PEDRA NO CHÃO DA SALA. NINGUÉM SABE DE QUEM É.",
        "de": "SERVIDOR",
        "itens": [{"item": "pedra do trovão", "qtd": 1}],
    },
]


def _le_cartoes():
    try:
        with open(CARTOES, encoding="utf-8") as f:
            dados = json.load(f)
        if isinstance(dados, list):
            return dados
    except (OSError, ValueError):
        pass
    return None


def cartoes():
    """Os cartões deste servidor. Na primeira vez, escreve os padrões."""
    dados = _le_cartoes()
    if dados is None:
        dados = [dict(c) for c in PADRAO]
        _grava_cartoes(dados)
    return dados


def _grava_cartoes(dados):
    os.makedirs(os.path.dirname(CARTOES), exist_ok=True)
    tmp = CARTOES + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(dados[-MAX_CARTOES:], f, ensure_ascii=False, indent=2)
    os.replace(tmp, CARTOES)


def publica(cartao, sala=None):
    """Um jogador (ou o dono do servidor) publica um cartão novo."""
    if not isinstance(cartao, dict):
        return None, "cartão inválido"
    novo = {
        "id": slug(cartao.get("id"), 40) or f"cartao-{int(agora() * 1000):x}",
        "titulo": str(cartao.get("titulo") or "PRESENTE MISTERIOSO")[:30],
        "texto": str(cartao.get("texto") or "")[:180],
        "de": str(cartao.get("de") or "?")[:12],
        "itens": [],
        "mons": [],
    }
    for it in (cartao.get("itens") or [])[:6]:
        nome = str(it.get("item") or "").strip().lower()[:30]
        if nome:
            novo["itens"].append({"item": nome, "qtd": max(1, min(99, int(it.get("qtd") or 1)))})
    for m in (cartao.get("mons") or [])[:2]:
        especie = slug(m.get("id"), 30)
        if especie:
            novo["mons"].append({
                "id": especie,
                "nv": max(1, min(100, int(m.get("nv") or 5))),
                "shiny": bool(m.get("shiny")),
                "apelido": str(m.get("apelido") or "")[:10],
            })
    if not novo["itens"] and not novo["mons"]:
        return None, "o cartão está vazio"

    dados = cartoes()
    dados = [c for c in dados if c.get("id") != novo["id"]]
    dados.append(novo)
    _grava_cartoes(dados)
    if sala:
        espalha(sala, {"tipo": "cartao", "cartao": novo})
    return novo, None
