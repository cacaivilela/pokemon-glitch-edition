#!/usr/bin/env python3
"""
Dev server do Pokemon Glitch Edition.
- Serve os arquivos estaticos (ES modules nativos, sem build).
- Live update: observa mtime dos arquivos e avisa o browser via SSE em /__hot.
- Funcoes online (salas, presenca, troca, batalha link, presente misterioso):
  as rotas /__net e /__gift, implementadas em online.py.
Zero dependencias: so a stdlib do Python 3.
"""
import http.server
import json
import os
import queue
import re
import socketserver
import sys
import threading
import time
import urllib.parse

import online

ROOT = os.path.dirname(os.path.abspath(__file__))
WATCH_EXT = {".js", ".html", ".css", ".json", ".png"}
POLL = 0.25

_clients = []
_lock = threading.Lock()
_save_lock = threading.Lock()
_versoes = {}          # perfil -> versao do save (um save por maquina, ver save_file)
_git_lock = threading.Lock()

# Publicar uma ficha manda ela pro codigo SOZINHO: commit + push, aqui no
# servidor, logo depois de gravar. Antes isso dependia de a pagina aberta pedir
# o segundo passo — e uma pagina velha no navegador de alguem simplesmente nao
# pedia, entao a fusao ficava so no arquivo e ninguem sabia. Desligue aqui se
# um dia quiser publicar a mao.
AUTO_PUBLICAR = True

# A SENHA DA FAXINA. Apagar fusao so acontece com ela na mao: o site da faxina
# (faxinamissingno/) pergunta antes de mostrar qualquer botao, e a rota que apaga
# confere de novo — pedir de novo aqui e o que impede um POST solto de levar
# desenho embora. Nao e seguranca de banco: e uma senha de acesso, igual ao
# codigo do giveglitch. Quem mexe no codigo do jogo ve ela; a ideia e que
# apagar exija um passo de proposito, nao que seja impossivel.
SENHA_FAXINA = "giveglitch"

# AS ETERNAS. Fusao com id aqui dentro nao sai NUNCA: nem sem a marca
# `protegida`, nem com a senha certa, nem por um POST na mao. A marca protegida
# e uma decisao (poe e tira pelo site); isto e uma regra escrita no codigo, e
# soltar uma exige mexer no codigo dos dois lados (aqui e src/systems/faxina.js).
ETERNAS = {"laprocuno"}


# Pastas que o vigia NAO percorre. `assets/sprites` sao 576 PNGs baixados de
# fora: eles nao mudam sozinhos, e andar em cima deles quatro vezes por segundo
# era 72% do trabalho do vigia — trabalho que so cresce conforme a arte chega.
# Quem roda os tools/fetch_* de proposito da um F5 e pronto.
WATCH_SKIP = {os.path.join("assets", "sprites"), os.path.join("assets", "music")}


def snapshot():
    """{arquivo: mtime} do que dispara live update.

    Com `scandir` o mtime vem junto da listagem, sem um `stat` por arquivo — o
    vigia roda 4x por segundo, entao o que ele faz por arquivo importa mais do
    que parece. Quanto mais o acervo cresce, mais isso conta.
    """
    out = {}
    pilha = [ROOT]
    while pilha:
        pasta = pilha.pop()
        try:
            with os.scandir(pasta) as itens:
                for it in itens:
                    if it.is_dir(follow_symlinks=False):
                        nome = it.name
                        if nome.startswith((".", "__", "node_modules")):
                            continue
                        if nome in ("captures", "save", "online"):
                            continue  # smoke tests / save / cartoes: nao disparam reload
                        rel = os.path.relpath(it.path, ROOT)
                        if rel in WATCH_SKIP:
                            continue
                        pilha.append(it.path)
                    elif os.path.splitext(it.name)[1].lower() in WATCH_EXT:
                        try:
                            out[it.path] = it.stat(follow_symlinks=False).st_mtime
                        except OSError:
                            pass
        except OSError:
            pass
    return out


def broadcast(payload):
    msg = json.dumps(payload)
    with _lock:
        for q in list(_clients):
            q.put(msg)


def watcher():
    prev = snapshot()
    while True:
        time.sleep(POLL)
        cur = snapshot()
        changed = [p for p, m in cur.items() if prev.get(p) != m]
        changed += [p for p in prev if p not in cur]
        if changed:
            rel = sorted({os.path.relpath(p, ROOT).replace(os.sep, "/") for p in changed})
            print("\033[35m[hot]\033[0m " + ", ".join(rel), flush=True)
            broadcast({"type": "change", "files": rel, "t": time.time()})
        prev = cur


class Handler(http.server.SimpleHTTPRequestHandler):
    # HTTP/1.1 = a conexao FICA ABERTA entre um pedido e outro. Em HTTP/1.0 (o
    # padrao do http.server) cada ping do jogo pagava um aperto de mao TCP novo
    # — de graca na propria maquina, mas um ida-e-volta inteiro no wifi.
    # Com keep-alive TODA resposta precisa dizer o tamanho do corpo, senao o
    # navegador fica esperando o resto pra sempre. Quem nao tem tamanho (a SSE,
    # que e um cano aberto) manda "Connection: close" e fecha no fim.
    protocol_version = "HTTP/1.1"
    # Nagle junta pacotinhos antes de mandar: otimo pra transferir arquivo,
    # pessimo pra mensagem curta de jogo (chega a segurar 40ms).
    disable_nagle_algorithm = True
    # conexao parada solta a thread depois disso
    timeout = 65

    def __init__(self, *a, **kw):
        super().__init__(*a, directory=ROOT, **kw)

    def log_message(self, fmt, *args):
        if "--verbose" in sys.argv:
            super().log_message(fmt, *args)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, max-age=0")
        super().end_headers()

    def do_GET(self):
        route = self.path.split("?")[0]
        if route == "/__hot":
            return self.sse()
        if route == "/__net":
            return self.net_sse()
        if route == "/__gift":
            return self.json_out({"cartoes": online.cartoes()})
        if route == "/__salas":
            return self.json_out({"salas": online.salas_abertas()})
        if route == "/__delay":
            return self.delay()
        if route == "/__save":
            return self.save_get()
        return super().do_GET()

    def delay(self):
        """Segura o evento `load` por N ms — usado pelos smoke tests headless."""
        try:
            ms = int(self.path.split("ms=")[1].split("&")[0])
        except (IndexError, ValueError):
            ms = 1000
        time.sleep(min(30000, ms) / 1000)
        gif = bytes.fromhex("47494638396101000100800000000000ffffff21f90401000000002c00000000010001000002024401003b")
        self.send_response(200)
        self.send_header("Content-Type", "image/gif")
        self.send_header("Content-Length", str(len(gif)))
        self.end_headers()
        self.wfile.write(gif)

    def sse(self):
        self.close_connection = True      # stream sem tamanho: acaba quando fecha
        self.send_response(200)
        self.send_header("Content-Type", "text/event-stream")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Connection", "close")
        self.end_headers()
        q = queue.Queue()
        with _lock:
            _clients.append(q)
        try:
            self.wfile.write(b'event: hello\ndata: {"type":"hello"}\n\n')
            self.wfile.flush()
            while True:
                try:
                    msg = q.get(timeout=15)
                    self.wfile.write(f"data: {msg}\n\n".encode())
                except queue.Empty:
                    self.wfile.write(b": ping\n\n")
                self.wfile.flush()
        except (BrokenPipeError, ConnectionResetError):
            pass
        finally:
            with _lock:
                if q in _clients:
                    _clients.remove(q)


    # ----------------------------------------------------------------- json
    def json_out(self, obj, code=200):
        data = json.dumps(obj, ensure_ascii=False).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def corpo(self):
        n = int(self.headers.get("Content-Length", 0))
        if n > online.MAX_MSG:
            self.close_connection = True     # nao li o corpo: a conexao vai fora
            return None
        try:
            return json.loads(self.rfile.read(n) or b"{}")
        except ValueError:
            return None

    def query(self, chave, padrao=""):
        q = self.path.split("?", 1)[1] if "?" in self.path else ""
        return (urllib.parse.parse_qs(q).get(chave) or [padrao])[0]

    # ---------------------------------------------------------------- online
    def net_sse(self):
        """A sala em tempo real: cada jogador segura uma SSE aberta aqui."""
        sala = online.slug(self.query("sala", "padrao"), 32) or "padrao"
        jid = online.slug(self.query("id"))
        nome = self.query("nome", "?")[:12]
        if not jid:
            return self.send_error(400, "falta o id")
        jogador = online.entrar(sala, jid, nome, self.query("privada") == "1")
        self.close_connection = True      # stream sem tamanho: acaba quando fecha
        self.send_response(200)
        self.send_header("Content-Type", "text/event-stream")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Connection", "close")
        self.end_headers()
        print(f"\033[36m[sala]\033[0m {nome} ({jid}) entrou em {sala}", flush=True)
        try:
            while True:
                try:
                    msg = jogador.fila.get(timeout=10)
                    if msg is None:
                        return          # entrou de novo em outra aba: esta morre
                    self.wfile.write(f"data: {msg}\n\n".encode())
                except queue.Empty:
                    self.wfile.write(b": ping\n\n")   # so pra ver se o socket vive
                self.wfile.flush()
        except (BrokenPipeError, ConnectionResetError):
            pass
        finally:
            online.sair_obj(jogador)

    def net_post(self):
        msg = self.corpo()
        if msg is None:
            return self.send_error(400, "json invalido")
        ok, erro = online.recebe(msg)
        self.json_out({"ok": ok, "erro": erro}, 200 if ok else 409)

    def gift_post(self):
        """Publica um cartao de PRESENTE MISTERIOSO neste servidor."""
        msg = self.corpo()
        if msg is None:
            return self.send_error(400, "json invalido")
        cartao, erro = online.publica(msg.get("cartao"), online.slug(msg.get("sala"), 32))
        if erro:
            return self.json_out({"ok": False, "erro": erro}, 400)
        print(f"\033[36m[gift]\033[0m cartao publicado: {cartao['titulo']}", flush=True)
        self.json_out({"ok": True, "cartao": cartao})

    # ---------------------------------------------------------------- save
    # UM SAVE POR COMPUTADOR. O save mora num arquivo aqui, nao no localStorage
    # do navegador (que e separado por origem: abrir em outra porta criava uma
    # partida paralela). Com as funcoes online passou a existir mais de um
    # computador, entao o arquivo e escolhido por QUEM pediu:
    #
    #   esta maquina (localhost)  -> save/save.json      (o de sempre)
    #   outra maquina na rede     -> save/rede-<ip>.json (a partida dela)
    #   ?perfil=x na URL          -> save/perfil-x.json  (pra testar dois aqui)
    SAVE_DIR = os.path.join(ROOT, "save")

    def save_file(self):
        """Devolve (caminho, perfil) do save de quem esta pedindo."""
        perfil = online.slug(self.query("perfil"), 20)
        if perfil and perfil != "principal":
            return os.path.join(self.SAVE_DIR, f"perfil-{perfil}.json"), perfil
        ip = self.client_address[0] if self.client_address else "127.0.0.1"
        if ip in ("127.0.0.1", "::1", "localhost", ""):
            return os.path.join(self.SAVE_DIR, "save.json"), "principal"
        limpo = re.sub(r"[^0-9a-zA-Z.:-]", "", ip).replace(":", "-")[:40] or "rede"
        return os.path.join(self.SAVE_DIR, f"rede-{limpo}.json"), f"rede-{limpo}"

    def save_get(self):
        caminho, perfil = self.save_file()
        try:
            with open(caminho, "rb") as f:
                data = f.read()
        except FileNotFoundError:
            data = b"null"
        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Save-Version", str(_versoes.get(perfil, 0)))
        self.send_header("X-Save-Perfil", perfil)
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def save_post(self):
        """Grava o save de quem pediu (ver save_file). Quem manda `X-Save-Base`
        com uma versao antiga leva 409: e o caso do jogo aberto tentando
        sobrescrever o que o giveglitch acabou de colocar no arquivo. Depois de
        gravar, avisa as outras abas DAQUELE MESMO save pela SSE."""
        caminho, perfil = self.save_file()
        n = int(self.headers.get("Content-Length", 0))
        raw = self.rfile.read(n) or b"null"
        apagar = "clear" in (self.path.split("?", 1)[1] if "?" in self.path else "")
        base = self.headers.get("X-Save-Base")
        autor = self.headers.get("X-Client", "?")
        with _save_lock:
            atual = _versoes.get(perfil, 0)
            if base is not None and base.isdigit() and int(base) < atual:
                self.send_response(409)              # save mais novo no disco
                self.send_header("X-Save-Version", str(atual))
                self.send_header("X-Save-Perfil", perfil)
                self.send_header("Content-Length", "0")
                self.end_headers()
                return
            try:
                if apagar or raw.strip() in (b"", b"null"):
                    if os.path.exists(caminho):
                        os.remove(caminho)
                    print(f"\033[33m[save]\033[0m {perfil} apagado", flush=True)
                else:
                    json.loads(raw)                  # recusa lixo
                    os.makedirs(os.path.dirname(caminho), exist_ok=True)
                    tmp = caminho + ".tmp"           # grava atomico: nunca meio save
                    with open(tmp, "wb") as f:
                        f.write(raw)
                    os.replace(tmp, caminho)
            except Exception as e:
                self.send_error(400, str(e))
                return
            versao = atual + 1
            _versoes[perfil] = versao
        broadcast({"type": "save", "v": versao, "by": autor, "perfil": perfil, "t": time.time()})
        self.send_response(204)
        self.send_header("X-Save-Version", str(versao))
        self.send_header("X-Save-Perfil", perfil)
        self.end_headers()

    # ------------------------------------------------------------- o mundo
    # As fichas publicadas moram num arquivo de CODIGO, e o codigo deste jogo
    # tem um endereco no mundo: o repositorio de onde todo mundo baixou ele.
    # MANDAR PRO MUNDO e um commit daquele arquivo (so dele) + push; BUSCAR DO
    # MUNDO e um fetch e a juncao do que os outros publicaram com o que voce ja
    # tem. Nenhum outro arquivo seu e tocado nas duas operacoes: o commit e
    # limitado ao caminho, e a juncao so reescreve esse mesmo arquivo.
    FICHAS_REL = "src/data/fusoes-feitas.js"

    def _git(self, *args, timeout=45):
        import subprocess
        try:
            r = subprocess.run(["git", *args], cwd=ROOT, capture_output=True,
                               text=True, timeout=timeout)
            return r.returncode, (r.stdout or "").strip(), (r.stderr or "").strip()
        except (OSError, subprocess.SubprocessError) as e:
            return 1, "", str(e)

    def _fichas_do_texto(self, texto):
        try:
            corpo = texto.split("FUSOES_FEITAS =", 1)[1].rsplit(";", 1)[0].strip()
            return json.loads(corpo) if corpo.startswith("{") else {}
        except (IndexError, ValueError):
            return {}

    def _le_fichas(self):
        try:
            with open(os.path.join(ROOT, self.FICHAS_REL), encoding="utf-8") as fh:
                return self._fichas_do_texto(fh.read())
        except OSError:
            return {}

    def _grava_fichas(self, mapa):
        caminho = os.path.join(ROOT, self.FICHAS_REL)
        try:
            with open(caminho, encoding="utf-8") as fh:
                cabecalho = fh.read().split("export const FUSOES_FEITAS =", 1)[0]
        except OSError:
            cabecalho = ""
        with open(caminho, "w", encoding="utf-8") as fh:
            fh.write(cabecalho + "export const FUSOES_FEITAS = "
                     + json.dumps(mapa, ensure_ascii=False, indent=2) + ";\n")

    def _responde(self, dado, code=200):
        corpo = json.dumps(dado, ensure_ascii=False).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(corpo)))
        self.end_headers()
        self.wfile.write(corpo)

    def mundo_post(self):
        n = int(self.headers.get("Content-Length", 0))
        try:
            payload = json.loads(self.rfile.read(n) or b"{}")
        except ValueError:
            return self.send_error(400)
        acao = payload.get("acao")

        cod, saida, _ = self._git("rev-parse", "--is-inside-work-tree")
        if cod or saida != "true":
            return self._responde({"ok": False, "erro": "esta copia nao e um repositorio git"})
        ramo = re.sub(r"[^\w./-]", "", str(payload.get("ramo") or "main"))[:40] or "main"

        if acao == "buscar":
            cod, _, err = self._git("fetch", "origin", "--quiet")
            if cod:
                pista = err.splitlines()[-1][:120] if err else "nao deu pra falar com o servidor"
                return self._responde({"ok": False, "erro": pista})
            cod, texto, _ = self._git("show", f"origin/{ramo}:{self.FICHAS_REL}")
            if cod:
                return self._responde({"ok": True, "novas": 0,
                                       "aviso": "ninguem publicou nada por la ainda"})
            de_la, aqui = self._fichas_do_texto(texto), self._le_fichas()
            novas = 0
            desenhos = 0
            for chave, lista in de_la.items():
                minhas = aqui.setdefault(chave, [])
                ids = {f.get("id") for f in minhas}
                for f in lista:
                    if f.get("id") not in ids:
                        minhas.append(f)
                        novas += 1
                        if f.get("sprite"):
                            desenhos += 1   # veio com o desenho de quem fez
            if novas:
                self._grava_fichas(aqui)     # o watcher avisa todo mundo: hot-swap
            return self._responde({"ok": True, "novas": novas, "desenhos": desenhos,
                                   "total": sum(len(v) for v in aqui.values())})

        if acao == "enviar":
            nome = re.sub(r"[^\w .-]", "", str(payload.get("nome", "fusao")))[:40] or "fusao"
            autor = re.sub(r"[^\w .-]", "", str(payload.get("autor", "")))[:20]
            msg = f"fusao: {nome}" + (f" (por {autor})" if autor else "")
            # o desenho agora e arquivo: ele vai no mesmo commit da ficha,
            # senao o codigo teria a linha apontando pra um PNG que nao existe
            cod, _, err = self._git("add", "--", self.FICHAS_REL, "assets/fusoes")
            if cod:
                return self._responde({"ok": False, "erro": err[:120] or "git add falhou"})
            cod, saida, err = self._git("commit", "-m", msg, "--", self.FICHAS_REL, "assets/fusoes")
            if cod and "nothing to commit" not in (saida + err).lower():
                pista = (err or saida).splitlines()[-1][:120] if (err or saida) else "commit falhou"
                return self._responde({"ok": False, "erro": pista})
            cod, saida, err = self._git("push", "origin", f"HEAD:{ramo}", timeout=90)
            if cod:
                pista = (err or saida).splitlines()[-1][:120] if (err or saida) else "push falhou"
                return self._responde({"ok": False, "erro": pista, "commitado": True})
            print(f"\033[35m[mundo]\033[0m {msg} -> origin/{ramo}", flush=True)
            return self._responde({"ok": True, "msg": msg})

        return self.send_error(400)

    def faxina_post(self):
        """`{"senha": "..."}` -> `{"ok": true}`. So isso.

        E o portao do site da faxina. A senha nao mora na pagina: ela e digitada
        e vem perguntar aqui, entao quem abre o codigo do site nao acha senha
        nenhuma la dentro. Quem erra nao recebe pista de qual e.
        """
        n = int(self.headers.get("Content-Length", 0))
        try:
            payload = json.loads(self.rfile.read(n) or b"{}")
        except ValueError:
            return self.send_error(400)
        ok = str(payload.get("senha") or "") == SENHA_FAXINA
        return self._responde({"ok": ok}, 200 if ok else 403)

    def ficha_proteger(self, chave, ficha_id, senha="", marcar=True):
        """Poe ou tira a marca `protegida` de uma ficha.

        Tirar exige a senha igual a apagar: a protecao e uma decisao, e desfazer
        uma decisao tambem e uma decisao. O que NAO se desfaz sao as ETERNAS —
        aquelas nao dependem da marca, entao tirar a protecao de uma delas nao
        libera nada (a rota de apagar continua recusando).
        """
        if senha != SENHA_FAXINA:
            return self._responde({"ok": False, "erro": "senha errada"}, 403)
        caminho = os.path.join(ROOT, self.FICHAS_REL)
        try:
            with open(caminho, encoding="utf-8") as fh:
                texto = fh.read()
            cabecalho, corpo = texto.split("export const FUSOES_FEITAS =", 1)
            atual = json.loads(corpo.rsplit(";", 1)[0].strip())
        except (OSError, IndexError, ValueError):
            return self._responde({"ok": False, "erro": "nao consegui ler o arquivo"})

        alvo = next((f for f in atual.get(chave, []) if f.get("id") == ficha_id), None)
        if not alvo:
            return self._responde({"ok": False, "erro": "essa ficha nao esta aqui"})
        if bool(alvo.get("protegida")) == bool(marcar):
            return self._responde({"ok": True, "nome": alvo.get("nome"), "jaestava": True})

        if marcar:
            alvo["protegida"] = True
        else:
            alvo.pop("protegida", None)
        with open(caminho, "w", encoding="utf-8") as fh:
            fh.write(cabecalho + "export const FUSOES_FEITAS = "
                     + json.dumps(atual, ensure_ascii=False, indent=2) + ";\n")
        virou = "nao sai mais na faxina" if marcar else "voltou pra fila da faxina"
        print(f"\033[36m[protege]\033[0m {chave}: {alvo.get('nome')} {virou}", flush=True)
        if AUTO_PUBLICAR:
            self.publicar_sozinho(f"{alvo.get('nome')}", "",
                                  prefixo="protege" if marcar else "desprotege")
        return self._responde({"ok": True, "nome": alvo.get("nome")})

    def ficha_apagar(self, chave, ficha_id, senha=""):
        """A faxina do mes: tira uma ficha do codigo e apaga o desenho dela.

        Vai pro git igual a publicacao — o historico guarda tudo, entao nada e
        perdido de verdade: da pra voltar qualquer uma depois.

        SEM A SENHA NAO APAGA. Quem pede e o site da faxina (que perguntou a
        senha antes de abrir) ou a propria maquina do jogo; os dois mandam ela
        junto. Um POST que nao sabe a senha nao leva desenho de ninguem.
        """
        if senha != SENHA_FAXINA:
            return self._responde({"ok": False, "erro": "senha errada"}, 403)
        if ficha_id in ETERNAS:
            return self._responde({"ok": False, "erro": "essa ficha nao sai nunca"}, 403)
        caminho = os.path.join(ROOT, self.FICHAS_REL)
        try:
            with open(caminho, encoding="utf-8") as fh:
                texto = fh.read()
            cabecalho, corpo = texto.split("export const FUSOES_FEITAS =", 1)
            atual = json.loads(corpo.rsplit(";", 1)[0].strip())
        except (OSError, IndexError, ValueError):
            return self._responde({"ok": False, "erro": "nao consegui ler o arquivo"})

        fora = None
        for f in atual.get(chave, []):
            if f.get("id") == ficha_id:
                fora = f
        if not fora:
            return self._responde({"ok": False, "erro": "essa ficha nao esta aqui"})
        # PROTEGIDA NAO SAI. A faxina passou a ser semanal, e acelerar a faxina
        # nao pode virar desculpa pra jogar fora o que ja estava feito: todo o
        # acervo daquele dia esta marcado com "protegida": true. A recusa e AQUI,
        # e nao so na tela do jogo — assim nem uma pagina velha nem um POST na
        # mao tiram. Pra soltar uma, apague a marca do arquivo, de proposito.
        if fora.get("protegida"):
            return self._responde({"ok": False, "erro": "essa ficha esta protegida"})

        atual[chave] = [f for f in atual.get(chave, []) if f.get("id") != ficha_id]
        if not atual[chave]:
            del atual[chave]
        with open(caminho, "w", encoding="utf-8") as fh:
            fh.write(cabecalho + "export const FUSOES_FEITAS = "
                     + json.dumps(atual, ensure_ascii=False, indent=2) + ";\n")
        desenho = str(fora.get("sprite") or "")
        if desenho.startswith("assets/fusoes/"):
            try:
                os.remove(os.path.join(ROOT, desenho))
            except OSError:
                pass
        print(f"\033[33m[faxina]\033[0m {chave}: {fora.get('nome')} apagada", flush=True)
        if AUTO_PUBLICAR:
            self.publicar_sozinho(f"fora {fora.get('nome')}", "", prefixo="faxina")
        return self._responde({"ok": True, "nome": fora.get("nome")})

    def ficha_post(self):
        """A oficina publicou uma ficha de fusao: ela vira CODIGO.

        O arquivo src/data/fusoes-feitas.js e reescrito inteiro a cada
        publicacao (e um mapa "cabeca+corpo" -> lista de fichas). Como ele mora
        em src/data/, o proprio live update faz hot-swap: a variante nova
        aparece na maquina sem recarregar o jogo.
        """
        n = int(self.headers.get("Content-Length", 0))
        try:
            payload = json.loads(self.rfile.read(n) or b"{}")
        except ValueError:
            return self.send_error(400)
        chave = str(payload.get("chave", ""))
        ficha = payload.get("ficha") or {}
        if not re.fullmatch(r"[a-z0-9]+\+[a-z0-9]+", chave) or not ficha.get("id"):
            return self.send_error(400)
        if payload.get("acao") == "apagar":
            return self.ficha_apagar(chave, str(ficha["id"]), str(payload.get("senha") or ""))
        if payload.get("acao") in ("proteger", "desproteger"):
            return self.ficha_proteger(chave, str(ficha["id"]), str(payload.get("senha") or ""),
                                       payload.get("acao") == "proteger")

        caminho = os.path.join(ROOT, "src", "data", "fusoes-feitas.js")
        atual = {}
        try:
            with open(caminho, encoding="utf-8") as fh:
                texto = fh.read()
            corpo = texto.split("FUSOES_FEITAS =", 1)[1].rsplit(";", 1)[0].strip()
            atual = json.loads(corpo) if corpo.startswith("{") else {}
        except (OSError, IndexError, ValueError):
            atual = {}

        # O DESENHO VIRA ARQUIVO. Ele chega como data:image/png;base64,... e,
        # guardado dentro do JS, cada ficha engordava o modulo em alguns KB —
        # e o modulo inteiro e lido quando o jogo abre. Como arquivo, o JS fica
        # com uma linha de caminho e o PNG so e baixado quando aquela fusao
        # aparece na tela.
        sprite = str(ficha.get("sprite") or "")
        if sprite.startswith("data:image/png;base64,"):
            import base64
            pasta = os.path.join(ROOT, "assets", "fusoes")
            os.makedirs(pasta, exist_ok=True)
            nome = re.sub(r"[^a-z0-9+]", "", chave) + "~" + re.sub(r"[^a-z0-9]", "", ficha["id"]) + ".png"
            try:
                with open(os.path.join(pasta, nome), "wb") as fh:
                    fh.write(base64.b64decode(sprite.split(",", 1)[1]))
                ficha["sprite"] = "assets/fusoes/" + nome
            except (OSError, ValueError):
                pass          # nao deu pra gravar o arquivo: fica embutido mesmo

        # Republicar por cima nao tira a protecao: quem estava protegido continua,
        # senao bastava publicar de novo pra faxina poder levar.
        velha = next((f for f in atual.get(chave, []) if f.get("id") == ficha["id"]), None)
        if velha and velha.get("protegida"):
            ficha["protegida"] = True

        lista = [f for f in atual.get(chave, []) if f.get("id") != ficha["id"]]
        lista.append(ficha)
        atual[chave] = lista

        cabecalho = (
            "// FICHAS PUBLICADAS PELOS JOGADORES.\n"
            "//\n"
            "// Este arquivo e ESCRITO PELO JOGO: ao terminar uma ficha na oficina,\n"
            "// PUBLICAR manda ela pro dev_server, que grava aqui (rota /__ficha). Dai em\n"
            "// diante ela entra na lista de variantes daquela dupla, com o nome de quem\n"
            "// fez, do mesmo jeito que as fusoes que ja vem no jogo (src/data/fusoes.js)\n"
            "// -- e vale pra qualquer partida deste computador, inclusive um jogo novo.\n"
            "//\n"
            "// Da pra editar a mao, e da pra apagar tudo: e so deixar o objeto vazio. O\n"
            "// desenho vem junto, em PNG, dentro do campo `sprite`.\n"
            "//\n"
            "// `protegida`: true e ficha que a FAXINA DA SEMANA nunca leva. Esta marcado\n"
            "// assim todo o acervo que existia quando a faxina virou semanal. Sai so a\n"
            "// mao, tirando a marca daqui.\n"
            "export const FUSOES_FEITAS = "
        )
        with open(caminho, "w", encoding="utf-8") as fh:
            fh.write(cabecalho + json.dumps(atual, ensure_ascii=False, indent=2) + ";\n")
        # Quem esta jogando AGORA, em qualquer aparelho, recebe sozinho: o
        # arquivo mora em src/data/, que e a pasta que o watcher vigia, e o
        # broadcast do live update chega em todos os clientes conectados. Como
        # so mudou dado, e hot-swap: ninguem recarrega, ninguem perde o lugar.
        with _lock:
            aparelhos = len(_clients)
        print(f"\033[35m[ficha]\033[0m {chave}: {ficha.get('nome')} publicada "
              f"({aparelhos} aparelho(s) ligado(s))", flush=True)
        # e daqui ela segue sozinha pro codigo do jogo
        if AUTO_PUBLICAR:
            self.publicar_sozinho(ficha.get("nome"), ficha.get("autor"))
        corpo = json.dumps({"ok": True, "aparelhos": aparelhos, "codigo": bool(AUTO_PUBLICAR)}).encode()
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        # A oficina de fora (o FUSIONGLITCH publicado) fala com ESTE servidor de
        # outro endereco. Servido daqui, `fusionglitch/` e mesma origem e nada
        # disto e preciso; aberto pelo atalho publico, e isto que deixa o
        # PUBLICAR chegar. So a rota da ficha responde assim.
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Private-Network", "true")
        self.send_header("Content-Length", str(len(corpo)))
        self.end_headers()
        self.wfile.write(corpo)

    def publicar_sozinho(self, nome, autor, prefixo="fusao"):
        """Commit + push da ficha recem-gravada, numa thread propria.

        Numa thread porque o `git push` fala com a internet e demora: quem
        clicou em publicar nao pode ficar esperando a tela travada por causa
        disso. O lock evita dois pushes ao mesmo tempo quando alguem publica
        varias seguidas.
        """
        def tarefa():
            with _git_lock:
                limpo = re.sub(r"[^\w .-]", "", str(nome))[:40] or "fusao"
                quem = re.sub(r"[^\w .-]", "", str(autor or ""))[:20]
                msg = f"{prefixo}: {limpo}" + (f" (por {quem})" if quem else "")
                cod, saida, _ = self._git("rev-parse", "--is-inside-work-tree")
                if cod or saida != "true":
                    return print("\033[33m[codigo]\033[0m esta copia nao e um repositorio git", flush=True)
                self._git("add", "--", self.FICHAS_REL, "assets/fusoes")
                cod, saida, err = self._git("commit", "-m", msg, "--", self.FICHAS_REL, "assets/fusoes")
                if cod and "nothing to commit" not in (saida + err).lower():
                    return print(f"\033[33m[codigo]\033[0m nao deu pra gravar: {(err or saida).splitlines()[-1][:120]}", flush=True)
                cod, saida, err = self._git("push", "origin", "HEAD:main", timeout=120)
                if cod:
                    return print(f"\033[33m[codigo]\033[0m commit feito, push nao: {(err or saida).splitlines()[-1][:120]}", flush=True)
                print(f"\033[32m[codigo]\033[0m {msg} -> no jogo publicado", flush=True)

        threading.Thread(target=tarefa, daemon=True).start()

    def do_OPTIONS(self):
        """O navegador pergunta antes de mandar a ficha de outro endereco."""
        if self.path.split("?")[0] != "/__ficha":
            return self.send_error(404)
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Allow-Private-Network", "true")
        self.send_header("Access-Control-Max-Age", "600")
        self.send_header("Content-Length", "0")
        self.end_headers()

    def do_POST(self):
        """/__capture — a pagina de teste manda o canvas e o log de volta pro disco."""
        if self.path.split("?")[0] == "/__save":
            return self.save_post()
        if self.path.split("?")[0] == "/__net":
            return self.net_post()
        if self.path.split("?")[0] == "/__gift":
            return self.gift_post()
        if self.path.split("?")[0] == "/__ficha":
            return self.ficha_post()
        if self.path.split("?")[0] == "/__faxina":
            return self.faxina_post()
        if self.path.split("?")[0] == "/__mundo":
            return self.mundo_post()
        if self.path.split("?")[0] != "/__capture":
            self.send_error(404)
            return
        import base64
        n = int(self.headers.get("Content-Length", 0))
        payload = json.loads(self.rfile.read(n) or b"{}")
        outdir = os.path.join(ROOT, "dev", "captures")
        os.makedirs(outdir, exist_ok=True)
        name = os.path.basename(payload.get("name", "capture")) or "capture"
        data = payload.get("dataUrl", "")
        if "," in data:
            with open(os.path.join(outdir, name + ".png"), "wb") as f:
                f.write(base64.b64decode(data.split(",", 1)[1]))
        with open(os.path.join(outdir, name + ".log"), "w") as f:
            f.write(payload.get("log", ""))
        print(f"\033[36m[capture]\033[0m {name}: {payload.get('log', '')[:400]}", flush=True)
        self.send_response(204)
        self.end_headers()


def lan_ip():
    """O IP desta maquina na rede local — e o endereco que os outros digitam."""
    import socket
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(("10.255.255.255", 1))     # nao manda nada: so escolhe a rota
        return s.getsockname()[0]
    except OSError:
        return "localhost"
    finally:
        s.close()


class Server(socketserver.ThreadingTCPServer):
    daemon_threads = True
    allow_reuse_address = True


def main():
    for f in os.listdir(os.path.join(ROOT, "save")) if os.path.isdir(os.path.join(ROOT, "save")) else []:
        if f == "save.json":
            _versoes["principal"] = 1
        elif f.startswith(("rede-", "perfil-")) and f.endswith(".json"):
            _versoes[f[:-5].replace("perfil-", "", 1)] = 1
    port = 5173
    for i, a in enumerate(sys.argv):
        if a in ("-p", "--port") and i + 1 < len(sys.argv):
            port = int(sys.argv[i + 1])
    threading.Thread(target=watcher, daemon=True).start()
    with Server(("0.0.0.0", port), Handler) as httpd:
        print(f"\n  \033[32mPOKEMON GLITCH EDITION\033[0m  dev server")
        print(f"  ->  http://localhost:{port}/")
        print(f"  live update ativo (observando {len(snapshot())} arquivos)")
        print(f"  online: salas em /__net, presente misterioso em /__gift")
        print(f"  na mesma rede, os outros entram por http://{lan_ip()}:{port}/\n")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nencerrado.")


if __name__ == "__main__":
    main()
