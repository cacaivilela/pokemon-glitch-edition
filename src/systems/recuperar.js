// RECUPERAR SAVE (tela de título): a "IA" que lê as cópias do save que o
// dev_server guarda em save/copias/ (ver `guardar_copia` lá) e escolhe a que
// devolve a partida como ela era. Ela não inventa nada: só compara as cópias
// (insígnias, Pokémon pegos, nível da equipe, tempo de jogo), acha onde a
// partida encolheu de repente — um jogo novo gravado por cima — e aponta a
// última cópia de antes. A cópia volta inteira, byte por byte.
import { DB } from "../data/index.js";

/** Quanto a partida andou (a mesma conta do `progresso` do dev_server.py). */
export function progresso(st) {
  if (!st?.player) return 0;
  return (st.badges?.length || 0) * 1000 + (st.caught?.length || 0) * 20
    + (st.party || []).reduce((s, m) => s + (m?.level || 0), 0)
    + (st.playtime || 0) / 60;
}

const doisDig = (n) => String(n).padStart(2, "0");

/** "19/10 19:29" */
export function quando(seg) {
  const d = new Date(seg * 1000);
  return `${doisDig(d.getDate())}/${doisDig(d.getMonth() + 1)} ${doisDig(d.getHours())}:${doisDig(d.getMinutes())}`;
}

function tempo(st) {
  const min = Math.floor((st.playtime || 0) / 60);
  return `${Math.floor(min / 60)}H${doisDig(min % 60)}`;
}

const nomeDe = (m) => DB.SPECIES[m.species]?.name || String(m.species).toUpperCase();

/** As linhas que descrevem um save (o painel de baixo da tela). */
export function resumo(st) {
  if (!st?.player) return ["(SAVE VAZIO)"];
  const equipe = (st.party || []).map((m) => `${nomeDe(m)} ${m.level}`).join(", ");
  return [
    `${st.player.name || "?"} - ${(st.regiao || "kanto").toUpperCase()} - ${tempo(st)}`,
    `INSÍGNIAS: ${st.badges?.length || 0}  POKÉDEX: ${st.caught?.length || 0}  NO PC: ${st.box?.length || 0}`,
    `EQUIPE: ${equipe || "NINGUÉM"}`,
  ];
}

/** O que a IA acha. `copias` vem do servidor, a mais nova primeiro;
 *  `atual` é o save de agora (ou null). Devolve { escolhida, falas }:
 *  `escolhida` é o índice da cópia que ela recomenda (-1 = nenhuma). */
export function analisar(copias, atual) {
  if (!copias.length) {
    return {
      escolhida: -1,
      falas: [
        "AINDA NÃO TENHO NENHUMA CÓPIA DO SEU SAVE PRA LER.",
        "O SERVIDOR GUARDA UMA A CADA 10 MINUTOS DE JOGO (DEPOIS DE ABRIR O RUN.SH DE NOVO).",
      ],
    };
  }
  const pontos = copias.map((c) => progresso(c.save));
  const melhor = Math.max(...pontos);
  const agora = progresso(atual);
  if (atual?.player && agora >= melhor * 0.9) {
    return {
      escolhida: -1,
      falas: [
        "SEU SAVE DE AGORA É O MAIS COMPLETO, NÃO SUMIU NADA.",
        "PRA VOLTAR NO TEMPO, ESCOLHE UMA.",
      ],
    };
  }
  // a mais nova que ainda tem (quase) tudo: depois dela a partida encolheu
  const i = pontos.findIndex((p) => p >= melhor * 0.9);
  const st = copias[i].save;
  const falas = [
    `ACHEI! ${quando(copias[i].quando)}: ${st.badges?.length || 0} INSÍGNIAS, ${st.caught?.length || 0} NA DEX.`,
    atual?.player ? "DEPOIS VEIO UM JOGO MENOR POR CIMA." : "DEPOIS O SAVE FOI APAGADO.",
  ];
  return { escolhida: i, falas };
}
