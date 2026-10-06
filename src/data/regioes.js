// AS REGIÕES CRIADAS POR JOGADORES (o REGIOMAKER, regiomaker/).
//
// Cada região é um objeto de dados (src/data/regioes-criadas.js, que o
// dev_server reescreve quando alguém publica — rota /__regiao): nome, mapas
// desenhados com a MESMA planta de texto de Braglitch, NPCs, treinadores,
// ginásios, o CAMPEÃO (um NPC com a equipe montada no editor), os Pokémon
// criados do zero e, se quiser, as duas skins dela.
//
// Aqui isso vira o que o jogo já entende: geometria (pelo `montarGeos` de
// Braglitch), conteúdo no formato de src/data/maps.js e espécies. Tudo que
// vem de jogador é tratado como suspeito: o que não fecha é IGNORADO, nunca
// derruba o jogo. O servidor valida antes de gravar; isto é a segunda rede.
//
// Ids com prefixo, pra nunca bater com nada do jogo:
//   mapas    rc_<regiao>_<mapa>          (interiores: + _pokemon_center_1f, _loja, _ginasio, _casa, _lab)
//   espécies rc<regiao><pokemon>
//   insígnias (flags) insignia_rc_<regiao>_<mapa>, insignia_campeao_<regiao>
import { montarGeos, TAG_DE, placasEPortas } from "./braglitch.js";
import { saidaDe, abrirSaida, fecharSaida, chaoPerto, SALA } from "./braglitch-mundo.js";

/** OS LIMITES — o editor (regiomaker/) e o servidor (dev_server.py) usam os mesmos. */
export const LIMITES = {
  mapas: 12, lado: 40, pokemon: 30, pessoasPorMapa: 20, ginasios: 8, equipe: 6,
  nivel: [1, 100], atributo: [1, 255], somaAtributos: 600, golpes: 12, texto: 120,
};

/** A legenda da planta que o editor oferece (o resto do TAG_DE é de Braglitch:
 *  estátua e barco não entram). A porta `D` vai embaixo de um prédio. */
export const LEGENDA = {
  "#": "ÁRVORE", ".": "GRAMA", ",": "MATO ALTO", P: "CAMINHO", "~": "ÁGUA", "=": "PÍER",
  a: "AREIA", F: "FLOR", Y: "COQUEIRO", o: "PEDRA",
  R: "PAREDÃO", v: "BARRANCO (PULA PRA BAIXO)", "^": "BARRANCO (PULA PRA CIMA)", e: "ESCADARIA",
  H: "CASA", h: "CASARIO (FECHADO)", L: "LABORATÓRIO", C: "CENTRO POKÉMON", M: "LOJA",
  G: "GINÁSIO", I: "IGREJA (FECHADA)", K: "CORETO", D: "PORTA",
};
const VALE = new Set([...Object.keys(LEGENDA), "1", "2", "3", "4", "5", "6", "7", "8", "9"]);
/** que interior de Kanto cada prédio copia */
const PREDIO = {
  C: { sufixo: "pokemon_center_1f", de: "center" },
  M: { sufixo: "loja", de: "mart" },
  G: { sufixo: "ginasio", de: "celadon_city_gym" },
  H: { sufixo: "casa", de: "home" },
  L: { sufixo: "lab", de: "lab" },
};
/** as salas de ginásio que dá pra escolher (as de Braglitch, sem quebra-cabeça) */
export const SALAS_DE_GINASIO = Object.keys(SALA);
export const TEMAS = ["mata", "sertao", "cerrado", "serra", "litoral"];
export const LADOS = ["up", "down", "left", "right"];
const OPOSTO = { up: "down", down: "up", left: "right", right: "left" };
const PORTA_FECHADA = { h: ["NINGUÉM EM CASA."], I: ["A IGREJA ESTÁ FECHADA."] };

const slug = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 16);
const texto = (s, max = LIMITES.texto) => String(s ?? "").toUpperCase().replace(/[\u0000-\u001f"\\`<>]/g, "").slice(0, max);
const falas = (l) => (Array.isArray(l) ? l : [l]).map((t) => texto(t)).filter(Boolean).slice(0, 6);
const inteiro = (n, [a, b]) => Math.max(a, Math.min(b, Math.round(+n) || a));
export const idDoMapa = (rid, mid) => `rc_${rid}_${mid}`;
export const idDaEspecie = (rid, pid) => `rc${rid}${pid}`;

/** A planta limpa: retangular, até 40x40, só com a legenda (o resto vira árvore). */
function limparPlanta(planta) {
  const linhas = (Array.isArray(planta) ? planta : []).slice(0, LIMITES.lado).map((l) => String(l).slice(0, LIMITES.lado));
  if (linhas.length < 4) return null;
  const w = Math.max(...linhas.map((l) => l.length));
  if (w < 4) return null;
  return linhas.map((l) => [...l.padEnd(w, "#")].map((c) => (VALE.has(c) ? c : "#")).join(""));
}

/**
 * Monta todas as regiões criadas.
 * @param kanto   o kanto.json (de onde saem os interiores)
 * @param regioes REGIOES_CRIADAS
 * @param conhece { especie(id): bool, golpe(id): bool, tipo(t): bool } — o que existe no jogo
 * @returns { geos, conteudo, especies, evolucoes, rotulos, lista }
 */
export function montarRegioesCriadas(kanto, regioes, conhece) {
  const out = { geos: {}, conteudo: {}, especies: {}, evolucoes: {}, rotulos: {}, lista: [] };
  if (!kanto) return out;
  let n = 0;
  for (const [chave, R] of Object.entries(regioes || {})) {
    try {
      const r = montarUma(kanto, chave, R, conhece, 40000 + n * 100);
      if (!r) continue;
      n++;
      Object.assign(out.geos, r.geos);
      Object.assign(out.conteudo, r.conteudo);
      Object.assign(out.especies, r.especies);
      Object.assign(out.evolucoes, r.evolucoes);
      Object.assign(out.rotulos, r.rotulos);
      out.lista.push(r.meta);
    } catch (e) {
      console.warn(`[regiões] a região "${chave}" não montou e ficou de fora:`, e);
    }
  }
  return out;
}

function montarUma(kanto, chave, R, conhece, dex0) {
  const rid = slug(R?.id || chave);
  if (!rid || !R || typeof R !== "object") return null;
  const nome = texto(R.nome, 24) || rid.toUpperCase();

  // ---------------------------------------------------- AS ESPÉCIES DELA
  const especies = {}, evolucoes = {}, rotulos = {};
  const minhas = new Set();
  (R.pokemon || []).slice(0, LIMITES.pokemon).forEach((p, i) => {
    const pid = slug(p?.id);
    const tipos = (p?.tipos || []).map((t) => texto(t, 12)).filter((t) => conhece.tipo(t)).slice(0, 2);
    const st = (p?.stats || []).map((v) => inteiro(v, LIMITES.atributo));
    if (!pid || !tipos.length || st.length !== 6 || !p.sprite) return;
    let soma = st.reduce((a, b) => a + b, 0);
    if (soma > LIMITES.somaAtributos) {          // passou do teto: encolhe tudo na mesma proporção
      const k = LIMITES.somaAtributos / soma;
      st.forEach((v, j) => { st[j] = Math.max(1, Math.floor(v * k)); });
      soma = st.reduce((a, b) => a + b, 0);
    }
    const [hp, atk, def, spa, spd, spe] = st;
    const learnset = (p.golpes || []).slice(0, LIMITES.golpes)
      .map(([nv, g]) => [inteiro(nv, LIMITES.nivel), String(g || "")]).filter(([, g]) => conhece.golpe(g))
      .sort((a, b) => a[0] - b[0]);
    const id = idDaEspecie(rid, pid);
    especies[id] = {
      id, dex: dex0 + i, name: texto(p.nome, 16) || pid.toUpperCase(), types: tipos,
      base: { hp, atk, def, spa, spd, spe }, bst: soma,
      foreign: true, regiao: nome, regiaoCriada: rid,
      catchRate: soma >= 550 ? 45 : soma >= 450 ? 60 : 150, xpYield: Math.floor(soma / 4),
      ...(learnset.length ? { learnset } : {}),
      dexText: texto(p.dex, 160) || undefined,
      spriteUrl: String(p.sprite),
      autor: texto(R.autor, 20),
    };
    rotulos[id] = nome;
    minhas.add(pid);
  });
  for (const p of R.pokemon || []) {
    const pid = slug(p?.id), para = slug(p?.evolui?.para);
    if (minhas.has(pid) && minhas.has(para) && pid !== para) {
      evolucoes[idDaEspecie(rid, pid)] = [{ lvl: inteiro(p.evolui.nivel, LIMITES.nivel), to: idDaEspecie(rid, para) }];
    }
  }
  /** "rc:<pid>" (bicho desta região) ou um id do jogo -> o id de verdade, ou null */
  const especie = (e) => {
    const s = String(e || "");
    if (s.startsWith("rc:")) return minhas.has(slug(s.slice(3))) ? idDaEspecie(rid, slug(s.slice(3))) : null;
    return conhece.especie(s) ? s : null;
  };
  const time = (l) => (Array.isArray(l) ? l : []).slice(0, LIMITES.equipe)
    .map(([e, nv]) => ({ id: especie(e), lvl: inteiro(nv, LIMITES.nivel) })).filter((m) => m.id);

  // ---------------------------------------------------- OS MAPAS
  const mapas = (R.mapas || []).slice(0, LIMITES.mapas).map((m) => ({ ...m, mid: slug(m?.id), planta: limparPlanta(m?.planta) }))
    .filter((m) => m.mid && m.planta);
  if (!mapas.length) return null;
  const midOk = new Set(mapas.map((m) => m.mid));
  const plantas = {}, temas = {}, interiores = {};
  for (const m of mapas) {
    const id = idDoMapa(rid, m.mid);
    plantas[id] = m.planta;
    temas[id] = TEMAS.includes(m.tema) ? m.tema : "mata";
    for (const [letra, P] of Object.entries(PREDIO)) {
      if (!m.planta.some((l) => l.includes(letra))) continue;
      const de = letra === "G" && SALAS_DE_GINASIO.includes(m.ginasio?.sala) ? m.ginasio.sala : P.de;
      interiores[`${id}_${P.sufixo}`] = { de, predio: letra, cidade: id };
    }
  }
  // AS LIGAÇÕES pela borda: abre a saída que falta, fecha a que sobra (senão
  // dá pra andar pra fora do mapa e cair no nada)
  for (const m of mapas) {
    const id = idDoMapa(rid, m.mid);
    for (const lado of LADOS) {
      const para = slug(m.liga?.[lado]);
      const quer = para && midOk.has(para) && para !== m.mid;
      const tem = saidaDe(plantas[id], lado) !== null;
      const meio = Math.floor((lado === "up" || lado === "down" ? plantas[id][0].length : plantas[id].length) / 2) - 1;
      if (quer && !tem) plantas[id] = abrirSaida(plantas[id], lado, meio);
      else if (!quer && tem) plantas[id] = fecharSaida(plantas[id], lado);
    }
  }
  const ligacoes = {};
  for (const m of mapas) {
    const id = idDoMapa(rid, m.mid);
    ligacoes[id] = [];
    for (const lado of LADOS) {
      const para = slug(m.liga?.[lado]);
      if (!para || !midOk.has(para) || para === m.mid) continue;
      const outro = idDoMapa(rid, para);
      const a = saidaDe(plantas[id], lado), b = saidaDe(plantas[outro], OPOSTO[lado]);
      if (a !== null && b !== null) ligacoes[id].push({ dir: lado, offset: a - b, to: outro });
    }
  }
  const geos = montarGeos(kanto, { plantas, interiores, ligacoes, temas, cidadePadrao: idDoMapa(rid, mapas[0].mid),
                                   marca: { regiao: rid, regiaoCriada: rid } });

  // ---------------------------------------------------- O CONTEÚDO
  const conteudo = {};
  const insignias = [];
  for (const m of mapas) {
    const id = idDoMapa(rid, m.mid);
    const planta = plantas[id];
    const usados = new Set();
    const lugar = (x, y) => {
      const p = Number.isInteger(x) && Number.isInteger(y) && planta[y]?.[x] && TAG_DE[planta[y][x]] !== 1
        && !usados.has(`${x},${y}`) ? { x, y } : chaoPerto(planta, inteiro(x, [0, planta[0].length - 1]), inteiro(y, [0, planta.length - 1]), usados);
      usados.add(`${p.x},${p.y}`);
      return p;
    };
    const dir = (d) => (LADOS.includes(d) ? d : "down");
    const sprite = (s) => (/^[a-z0-9_]{1,24}$/.test(String(s || "")) ? s : "youngster");
    const npcs = [];
    (m.npcs || []).slice(0, LIMITES.pessoasPorMapa).forEach((p, k) => {
      npcs.push({ id: `npc${k}`, ...lugar(p.x, p.y), dir: dir(p.dir), sprite: sprite(p.sprite), lines: falas(p.fala || "...") });
    });
    (m.treinadores || []).slice(0, LIMITES.pessoasPorMapa).forEach((t, k) => {
      const party = time(t.time);
      if (!party.length) return;
      npcs.push({ id: `treinador${k}`, ...lugar(t.x, t.y), dir: dir(t.dir), sprite: sprite(t.sprite),
                  lines: falas(t.fala || "VAMOS LUTAR!"), afterLines: falas(t.depois || "BOA LUTA!"),
                  trainer: { name: texto(t.nome, 20) || "TREINADOR", prize: 60 + party[0].lvl * 20, sight: 4, party } });
    });
    // O CAMPEÃO: um NPC, montado no editor. Só aceita a luta com todas as
    // insígnias da região; vencido, dá a COROA (uma flag, como a insígnia do VOID)
    const C = R.campeao;
    if (C && slug(C.mapa) === m.mid) {
      const party = time(C.time);
      if (party.length) {
        npcs.push({ id: "campeao", ...lugar(C.x, C.y), dir: dir(C.dir), sprite: sprite(C.sprite),
                    lines: falas(C.fala || `EU SOU O CAMPEÃO DE ${nome}.`), afterLines: falas(C.depois || "VOCÊ É O NOVO CAMPEÃO."),
                    campeaoDe: rid,
                    trainer: { name: `CAMPEÃO ${texto(C.nome, 16) || ""}`.trim(), prize: 5000, sight: 0, party,
                               insigniaSecreta: { id: `campeao_${rid}`, nome: `COROA DE CAMPEÃO DE ${nome}` } } });
      }
    }
    const tabela = (m.encontros || []).slice(0, 20).map(([e, w]) => ({ id: especie(e), w: Math.max(1, +w || 1) })).filter((e) => e.id);
    const [nmin, nmax] = (m.niveis || [3, 8]).map((v) => inteiro(v, LIMITES.nivel));
    const placas = Object.fromEntries(Object.entries(m.placas || {}).filter(([k]) => /^[1-9]$/.test(k)).map(([k, v]) => [k, texto(v, 160)]));
    conteudo[id] = {
      name: texto(m.nome, 24) || nome, music: /^[a-z0-9_]{1,24}$/.test(m.musica || "") ? m.musica : "route",
      encounters: tabela.map((e) => ({ ...e, min: Math.min(nmin, nmax), max: Math.max(nmin, nmax) })),
      npcs, placas, spawn: { ...chaoPerto(planta, Math.floor(planta[0].length / 2), Math.floor(planta.length / 2), usados), dir: "down" },
    };
    // os interiores dos prédios deste mapa
    const nomeMapa = conteudo[id].name;
    const dentro = (suf) => geos[`${id}_${suf}`];
    const spawnDe = (g, recua = 1) => ({ x: g?.warps?.[0]?.x ?? 6, y: (g?.warps?.[0]?.y ?? 10) - recua, dir: "up" });
    if (dentro("pokemon_center_1f")) {
      conteudo[`${id}_pokemon_center_1f`] = {
        name: `CENTRO POKÉMON — ${nomeMapa}`, music: "center", interior: true, encounters: [], spawn: { x: 7, y: 8, dir: "up" },
        lockedWarps: { "1,6": "A ESCADA ESTÁ FECHADA." },
        npcs: [{ id: "enfermeira", x: 7, y: 2, dir: "down", sprite: "enfermeira", heal: true, tutor: true,
                 lines: [`BEM-VINDO AO CENTRO POKÉMON DE ${nomeMapa}!`] }],
      };
    }
    if (dentro("loja")) {
      conteudo[`${id}_loja`] = {
        name: `LOJA — ${nomeMapa}`, music: "mart", interior: true, encounters: [], spawn: { x: 4, y: 7, dir: "up" },
        npcs: [{ id: "balconista", x: 2, y: 3, dir: "down", sprite: "balconista", lines: ["PODE ESCOLHER!"],
                 shop: [{ item: "poké bola", price: 200 }, { item: "poção", price: 300 }, { item: "great ball", price: 600 }] }],
      };
    }
    for (const suf of ["casa", "lab"]) {
      if (dentro(suf)) conteudo[`${id}_${suf}`] = { name: nomeMapa, interior: true, encounters: [], npcs: [], spawn: spawnDe(dentro(suf)) };
    }
    const Gm = m.ginasio, gg = dentro("ginasio");
    if (gg) {
      const sala = SALA[interioresDe(interiores, `${id}_ginasio`)] || SALA.celadon_city_gym;
      const gnpcs = [];
      const lider = time(Gm?.lider?.time);
      if (lider.length) {
        const ins = { id: `rc_${rid}_${m.mid}`, nome: texto(Gm?.insignia, 24) || `INSÍGNIA DE ${nomeMapa}` };
        insignias.push(`insignia_${ins.id}`);
        gnpcs.push({ id: "lider", ...sala.lider, dir: "down", sprite: sprite(Gm.lider.sprite),
                     lines: falas(Gm.lider.fala || "BEM-VINDO AO MEU GINÁSIO!"), afterLines: falas(Gm.lider.depois || "VOCÊ MERECEU."),
                     trainer: { name: `LÍDER ${texto(Gm.lider.nome, 16)}`.trim(), prize: 1500, party: lider, insigniaSecreta: ins } });
      }
      (Gm?.treinadores || []).slice(0, sala.treinadores.length).forEach((t, k) => {
        const party = time(t.time);
        if (!party.length) return;
        gnpcs.push({ id: `treinador${k}`, ...sala.treinadores[k], sprite: sprite(t.sprite), lines: falas(t.fala || "PASSA POR MIM PRIMEIRO!"),
                     afterLines: falas(t.depois || "VAI LÁ, O LÍDER TE ESPERA."),
                     trainer: { name: texto(t.nome, 20) || "TREINADOR", prize: 400, sight: 3, party } });
      });
      conteudo[`${id}_ginasio`] = { name: `GINÁSIO DE ${nomeMapa}`, music: "gym", interior: true, encounters: [], npcs: gnpcs,
                                    spawn: spawnDe(gg) };
    }
  }
  // o CAMPEÃO só luta com todas as insígnias da região
  for (const c of Object.values(conteudo)) {
    for (const p of c.npcs || []) {
      if (p.campeaoDe === rid && insignias.length) {
        p.requerFlags = [...insignias];
        p.trancado = [`AINDA NÃO. SÃO ${insignias.length} INSÍGNIAS EM ${nome}.`, "VOLTA QUANDO TIVER TODAS."];
      }
    }
  }
  // placas e portas fechadas (o mesmo de Braglitch)
  const pp = placasEPortas(geos, conteudo, {}, PORTA_FECHADA);
  for (const [id, c] of Object.entries(conteudo)) {
    const { placas, ...resto } = c;
    conteudo[id] = { ...resto, signs: pp[id]?.signs || {}, lockedWarps: { ...(pp[id]?.lockedWarps || {}), ...(resto.lockedWarps || {}) } };
  }
  for (const id of Object.keys(geos)) if (!conteudo[id]) conteudo[id] = { name: nome, interior: true, encounters: [], npcs: [] };

  const inicio = idDoMapa(rid, midOk.has(slug(R.inicio)) ? slug(R.inicio) : mapas[0].mid);
  const skin = (s) => (/^assets\/regioes\/[a-z0-9]+\/[a-z0-9_]+\.png$/.test(String(s || "")) ? s : null);
  const skins = R.skins && skin(R.skins.menino) && skin(R.skins.menina) ? { menino: R.skins.menino, menina: R.skins.menina } : null;
  return {
    geos, conteudo, especies, evolucoes, rotulos,
    meta: { id: rid, nome, autor: texto(R.autor, 20), inicio, chegada: conteudo[inicio].spawn, skins,
            mapas: Object.keys(geos), insignias, especies: Object.keys(especies) },
  };
}

/** de qual sala de Kanto o ginásio foi copiado */
function interioresDe(interiores, id) { return interiores[id]?.de; }
