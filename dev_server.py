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

    def do_POST(self):
        """/__capture — a pagina de teste manda o canvas e o log de volta pro disco."""
        if self.path.split("?")[0] == "/__save":
            return self.save_post()
        if self.path.split("?")[0] == "/__net":
            return self.net_post()
        if self.path.split("?")[0] == "/__gift":
            return self.gift_post()
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
