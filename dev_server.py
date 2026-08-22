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


def snapshot():
    out = {}
    for dirpath, dirnames, filenames in os.walk(ROOT):
        dirnames[:] = [d for d in dirnames if not d.startswith((".", "__", "node_modules"))]
        if os.path.basename(dirpath) in ("captures", "save", "online"):
            continue  # smoke tests / save / cartoes do presente: nao disparam reload
        for f in filenames:
            if os.path.splitext(f)[1].lower() in WATCH_EXT:
                p = os.path.join(dirpath, f)
                try:
                    out[p] = os.path.getmtime(p)
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
            for chave, lista in de_la.items():
                minhas = aqui.setdefault(chave, [])
                ids = {f.get("id") for f in minhas}
                for f in lista:
                    if f.get("id") not in ids:
                        minhas.append(f)
                        novas += 1
            if novas:
                self._grava_fichas(aqui)     # o watcher avisa todo mundo: hot-swap
            return self._responde({"ok": True, "novas": novas,
                                   "total": sum(len(v) for v in aqui.values())})

        if acao == "enviar":
            nome = re.sub(r"[^\w .-]", "", str(payload.get("nome", "fusao")))[:40] or "fusao"
            autor = re.sub(r"[^\w .-]", "", str(payload.get("autor", "")))[:20]
            msg = f"fusao: {nome}" + (f" (por {autor})" if autor else "")
            cod, _, err = self._git("add", "--", self.FICHAS_REL)
            if cod:
                return self._responde({"ok": False, "erro": err[:120] or "git add falhou"})
            cod, saida, err = self._git("commit", "-m", msg, "--", self.FICHAS_REL)
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

        caminho = os.path.join(ROOT, "src", "data", "fusoes-feitas.js")
        atual = {}
        try:
            with open(caminho, encoding="utf-8") as fh:
                texto = fh.read()
            corpo = texto.split("FUSOES_FEITAS =", 1)[1].rsplit(";", 1)[0].strip()
            atual = json.loads(corpo) if corpo.startswith("{") else {}
        except (OSError, IndexError, ValueError):
            atual = {}

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
        corpo = json.dumps({"ok": True, "aparelhos": aparelhos}).encode()
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(corpo)))
        self.end_headers()
        self.wfile.write(corpo)

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
