// DLC: FESTIVAL SHINY — a SHINY ZONE.
//
// A ZONA SAFÁRI vira outra coisa: lá dentro nasce TODO POKÉMON DO JOGO — os
// 151, os da fenda, os iniciais das outras regiões, as formas regionais, os
// fósseis vivos —, cada um com a raridade que ele já tem (o peso do sorteio é a
// taxa de captura da espécie: CHANSEY e os lendários continuam raros, RATTATA
// continua em toda parte). E A COR MUDA COM O TEMPO: a cada batalha com um
// selvagem lá dentro, a chance de o próximo sair de COR COMUM cai entre 1 e 10
// pontos. Começa em 100 — ou seja, na chance clássica de 1 em 4096, que é a
// de Kanto inteira enquanto o festival está ligado. Quem fica, fica vendo cor
// trocada — até que TUDO sai shiny. Sair do Safári zera a contagem: é um
// festival, não uma fábrica.
//
// A contagem mora no save (`st.shinyZone.comum`), então fechar o jogo no meio
// do festival não apaga o que já caiu. Uma feirante na entrada explica, e um
// MEDIDOR no canto da tela mostra a chance de shiny de agora, quantos spawns
// faltam (na média) até o próximo e quantos já nasceram desde que você entrou.
//
// E os nove cartões: um shiny em cada um — os três iniciais, o rato, a raposa,
// o gordo, o peixe que vira o de Lago da Fúria, e as duas cores de pedra.
const MAPAS = ["safari_zone_center", "safari_zone_east", "safari_zone_north", "safari_zone_west"];
const ehSafari = (st) => MAPAS.includes(st?.player?.map);

export default {
  id: "festival",
  nome: "FESTIVAL SHINY",

  // A CHANCE CLÁSSICA: com o festival ligado, shiny em Kanto é 1 em 4096 — a
  // conta dos jogos de verdade, e não o 1 em 1024 de sempre daqui. É de onde a
  // SHINY ZONE parte: lá dentro, antes da primeira batalha, é isso também.
  config: { shinyOdds: 1 / 4096 },

  npcs: {
    safari_zone_center: [
      { id: "dlc_feirante", x: 27, y: 24, dir: "down", sprite: "garota",
        lines: [
          "BEM-VINDO À SHINY ZONE! O SAFÁRI ESTÁ DIFERENTE ESTA SEMANA.",
          "AQUI DENTRO NASCE TUDO. TUDO MESMO: O QUE MORA EM KANTO, O QUE VAZOU DA FENDA, O QUE VEIO DE OUTRAS REGIÕES.",
          "CADA UM NA RARIDADE DE SEMPRE — CHANSEY CONTINUA CHANSEY.",
          "LÁ FORA, SHINY É 1 EM 4096. AQUI TAMBÉM — NO COMEÇO.",
          "A CADA BATALHA COM UM SELVAGEM, A COR COMUM FICA MAIS RARA. O MEDIDOR NO CANTO MOSTRA A CONTA.",
          "SAIR DO SAFÁRI ZERA A CONTA. É FESTIVAL, NÃO É FÁBRICA.",
        ] },
    ],
  },

  placas: {
    safari_zone_center: { "33,20": "SHINY ZONE — A COR COMUM É A ÚNICA COISA QUE FICA RARA AQUI." },
  },

  presentes: {
    FESTIVAL001: { titulo: "O RATO DE OURO", texto: "O PRIMEIRO DA FILA DO FESTIVAL. AMARELO DEMAIS PRA SER O DE SEMPRE.", de: "FESTIVAL SHINY", mons: [{ id: "pikachu", nv: 12, shiny: true }] },
    FESTIVAL002: { titulo: "A MUDA DOURADA", texto: "NASCEU DA MESMA HORTA QUE AS OUTRAS. NÃO SE PARECE COM NENHUMA.", de: "FESTIVAL SHINY", mons: [{ id: "bulbasaur", nv: 10, shiny: true }] },
    FESTIVAL003: { titulo: "A CHAMA PRETA", texto: "O RABO QUEIMA IGUAL. A COR É QUE NÃO BATE.", de: "FESTIVAL SHINY", mons: [{ id: "charmander", nv: 10, shiny: true }] },
    FESTIVAL004: { titulo: "O CASCO ROXO", texto: "UMA TARTARUGA QUE SAIU DO MAR ERRADO.", de: "FESTIVAL SHINY", mons: [{ id: "squirtle", nv: 10, shiny: true }] },
    FESTIVAL005: { titulo: "A RAPOSA DE PRATA", texto: "SEIS CAUDAS DA COR DA LUA. NINGUÉM SABE DE QUE OVO SAIU.", de: "FESTIVAL SHINY", mons: [{ id: "vulpix", nv: 18, shiny: true }] },
    FESTIVAL006: { titulo: "O GORDO ESCURO", texto: "DORME IGUAL. RONCA IGUAL. É AZUL-MARINHO.", de: "FESTIVAL SHINY", mons: [{ id: "snorlax", nv: 35, shiny: true }] },
    FESTIVAL007: { titulo: "O PEIXE DE OURO", texto: "UM MAGIKARP QUE NÃO É LARANJA. SE ELE CRESCER, O LAGO VAI OUVIR.", de: "FESTIVAL SHINY", mons: [{ id: "magikarp", nv: 15, shiny: true, apelido: "DOURADO" }] },
    FESTIVAL008: { titulo: "A ESTRELA VERDE", texto: "UM EEVEE DE UMA COR SÓ. AS OITO QUE ELE PODE VIRAR TAMBÉM MUDAM.", de: "FESTIVAL SHINY", mons: [{ id: "eevee", nv: 20, shiny: true }] },
    FESTIVAL009: { titulo: "AS BOLAS DO FESTIVAL", texto: "PRA LEVAR O QUE VOCÊ ACHAR LÁ DENTRO. NÃO ADIANTA VER SE NÃO TROUXER.", de: "FESTIVAL SHINY", itens: [{ item: "ultra ball", qtd: 15 }, { item: "great ball", qtd: 15 }] },
  },

  aplicar(DB, api) {
    // TODO POKÉMON DO JOGO, com o peso da raridade dele. Fora: fusões (não têm
    // dex), formas MEGA (só existem na batalha), e o que não é bicho de
    // verdade (MISSINGNO., ??????????: esses têm os lugares deles).
    const todos = Object.values(DB.SPECIES)
      .filter((sp) => sp.dex > 0 && !sp.mega && !sp.fusao && !sp.types?.includes("GLITCH"))
      .map((sp) => ({ id: sp.id, min: 22, max: 40, w: Math.max(1, sp.catchRate || 45) }));
    for (const m of MAPAS) if (DB.MAPS[m]) DB.MAPS[m].encounters = todos;

    // a cor: a chance de COR COMUM começa em 100 e cai a cada batalha lá dentro
    /** a chance de o próximo selvagem NÃO sair de cor comum */
    const chanceShiny = (st, sorte = 1) => {
      const base = DB.CONFIG?.shinyOdds || 1 / 4096;
      const comum = st.shinyZone?.comum ?? 100;
      return Math.max(base * sorte, Math.min(1, 1 - comum / 100));
    };
    api.gancho("brilho", (st, sorte) => {
      if (!ehSafari(st)) return sorte;
      // cada sorteio é um spawn: conta pro medidor
      const z = (st.shinyZone ||= { comum: 100 });
      z.spawns = (z.spawns || 0) + 1;
      // A COR SAI PRONTA DAQUI. Só o shiny sobe com a conta do festival; o
      // luminoso continua 1 em 9999 (vezes o sanduíche, como sempre) — inflar
      // a sorte inteira fazia TODO spawn virar luminoso depois de um tempo, e
      // luminoso é a cor que tem que continuar sendo história de pescador.
      const luminoso = Math.random() < (DB.CONFIG?.luminosoOdds ?? 0) * sorte;
      return { luminoso, shiny: !luminoso && Math.random() < chanceShiny(st, sorte) };
    });
    // O MEDIDOR, no canto de cima à direita: a chance de agora, quantos spawns
    // faltam na média até um shiny (1 / chance) e quantos já nasceram.
    api.gancho("hud", (ctx, st, g) => {
      if (!ehSafari(st)) return;
      const p = chanceShiny(st);
      const faltam = Math.ceil(1 / p);
      const spawns = st.shinyZone?.spawns || 0;
      const larg = 104, x = g.W - larg - 4, y = 4;
      g.panel(ctx, x, y, larg, 40);
      g.drawText(ctx, "SHINY ZONE", x + 6, y + 5, g.PAL.ink);
      // abaixo de 1% a fração diz mais que a porcentagem: "1 EM 4096"
      const pct = p >= 0.995 ? "100%" : p < 0.01 ? `1 EM ${Math.round(1 / p)}` : Math.round(p * 100) + "%";
      g.drawText(ctx, pct, x + larg - 6 - pct.length * 6, y + 5, g.PAL.ink);
      g.bar(ctx, x + 6, y + 15, larg - 12, 4, Math.min(1, p), p >= 0.5 ? "#ffd166" : p >= 0.15 ? "#b455ff" : "#5a6270");
      const linha = faltam <= 1 ? "PROXIMO E SHINY" : `FALTAM ${faltam > 9999 ? "9999+" : faltam} SPAWNS`;
      g.drawText(ctx, linha, x + 6, y + 22, g.PAL.ink2);
      g.drawText(ctx, `NASCERAM ${spawns}`, x + 6, y + 30, g.PAL.ink2);
    });
    api.gancho("encontrar", (st) => {
      if (!ehSafari(st)) return;
      const z = (st.shinyZone ||= { comum: 100 });
      z.comum = Math.max(0, z.comum - (1 + Math.floor(Math.random() * 10)));
    });
    // sair do Safári zera — é festival, não fábrica
    api.gancho("viajar", (st) => { if (!ehSafari(st) && st.shinyZone) delete st.shinyZone; });
  },
};
