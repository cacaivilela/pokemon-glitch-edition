// Cliente de live update.
//  - Mudou algo em src/data/  -> hot-swap dos dados (o jogo NAO recarrega).
//  - Mudou codigo/HTML/CSS    -> reload preservando o estado da partida.
import { Save } from "./save.js";
import { url as arquivo } from "./base.js";

const badge = () => document.getElementById("hot-badge");

function setBadge(cls, text) {
  const el = badge();
  if (!el) return;
  el.className = cls;
  if (text) el.innerHTML = text;
}

export function initHot(game) {
  if (!location.protocol.startsWith("http")) return;
  // Jogo publicado na web: não existe dev_server pra vigiar arquivo. Sem isto
  // ele ficaria tentando abrir a SSE pra sempre e piscando "servidor offline"
  // na cara de quem só quer jogar.
  if (Save.offline()) return setBadge("dead", "&#9679; jogo publicado");
  let es;
  const connect = () => {
    es = new EventSource(arquivo("__hot"));
    es.addEventListener("hello", () => setBadge("live", "&#9679; live update"));
    es.onerror = () => { setBadge("dead", "&#9679; servidor offline"); es.close(); setTimeout(connect, 1500); };
    es.onmessage = async (ev) => {
      let msg;
      try { msg = JSON.parse(ev.data); } catch { return; }
      if (msg.type === "save") {
        if (msg.by === Save.id()) return;                 // a gravação foi minha
        if (msg.perfil && msg.perfil !== Save.perfil()) return;   // é o save de OUTRO jogador
        const ok = await game.adoptSave?.("giveglitch / outra aba");
        setBadge("flash", ok ? "&#9679; save atualizado" : "&#9679; save mudou no disco");
        setTimeout(() => setBadge("live", "&#9679; live update"), 1600);
        return;
      }
      if (msg.type !== "change") return;
      const files = msg.files || [];
      const onlyData = files.length > 0 && files.every((f) => f.startsWith("src/data/"));
      if (onlyData) {
        try {
          const mod = await import(`/src/data/index.js?t=${msg.t}`);
          game.applyData(mod.buildDB());
          setBadge("flash", "&#9679; dados recarregados");
          setTimeout(() => setBadge("live", "&#9679; live update"), 1200);
          console.log("%c[hot] dados atualizados:", "color:#59d99b", files.join(", "));
        } catch (err) {
          console.error("[hot] falha no hot-swap, recarregando", err);
          reload(game);
        }
      } else {
        console.log("%c[hot] reload:", "color:#ffd166", files.join(", "));
        reload(game);
      }
    };
  };
  connect();
}

function reload(game) {
  try { Save.stash(game.serialize()); } catch {}
  location.reload();
}
