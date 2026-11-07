// O AJUSTE DE VOLUME DE CADA MÚSICA, pra todas soarem na mesma altura: o ganho
// que o fio das músicas (src/core/audio.js, `saidaMusica`) usa enquanto ela
// toca. GERADO a partir de dev/volumes.html (que toca cada uma escondido e
// mede o volume de verdade; alvo = a do meio, 0.0584): não edite à mão.
// (as três fanfarras, curtinhas, foram acertadas depois com o ?conferir=1.)
// As de BRAGLITCH (batalha, SÃO LUCARIO, BR-101) ficam 60% acima, a pedido
// do CAIO ("tá muito baixa"); a batalha agora é do chip do GB, como as de Kanto.
// Música que não está aqui fica com 1 (a dos REGIS é arquivo de áudio, não
// passa pelo fio). A EVOLUÇÃO e a fanfarra dela viraram as do FireRed (nov/2026)
// e ficam com 1, como as outras do FireRed.
export const VOLUMES_MUSICA = {
  // AS MÚSICAS DOS LUGARES DE BRAGLITCH (src/data/musicas-braglitch.js),
  // medidas no dev/volumes.html (?so=b) e postas na altura da BR-101 velha
  // com o ajuste dela (0.0760): as de Braglitch ficam acima das de Kanto,
  // como o CAIO pediu
  bragSaoLucario: 0.85,
  bragBelem: 0.6,
  bragRecife: 0.65,
  bragSalvador: 0.6,
  bragCaruaru: 0.8,
  bragSampa: 0.85,
  bragOuroPreto: 1.46,
  bragRio: 0.7,
  bragBasculinha: 1.15,
  bragCuritiba: 1.25,
  bragFloripa: 0.7,
  bragCarvoriu: 0.84,
  bragLarvanjal: 0.67,
  bragNatal: 0.57,
  bragFortaleza: 0.79,
  bragManaus: 0.55,
  bragCuiaba: 0.8,
  bragIlhas: 0.71,
  bragLiga: 0.71,
  bragBr101: 0.79,
  bragMata: 0.69,
  bragLitoral: 0.72,
  bragSertao: 0.7,
  bragCerrado: 0.74,
  bragSerra: 0.96,
  bragPantanal: 0.73,
  bragChapada: 1.07,
  bragCentro: 0.9,
  bragLoja: 0.81,
  bragGinasio: 0.72,
  bragFundo: 0.95,
  bragCaverna: 1.11,
  // a EVOLUÇÃO e a fanfarra (nov/2026, "música de evolução tá baixa"): no
  // nível das de BRAGLITCH, acertado de ouvido (não medido)
  evolucao: 1.7,
  evolucao_fanfarra: 1.7,
  batalhaBraglitchBaiao: 1.68,
  abertura: 1.12,
  batalha: 0.92,
  batalhaBraglitch: 0.61,
  batalhaGlitch: 0.87,
  batalhaLumiose: 0.89,
  lumioseCidade: 0.89,   // a mesma banda da batalhaLumiose; não medida ainda
  br101: 0.79,   // apelido da bragBr101 (a música velha saiu)
  casa: 1.69,
  cave: 1.6,
  center: 1.52,
  era_fosseis: 1.25,
  era_futuro: 1.03,
  era_paradoxo: 1.06,
  evolucao_festa: 0.47,
  fusao: 0.41,
  fusao_fanfarra: 0.79,
  glitchdim: 0.87,
  gym: 0.91,
  ilha: 2.17,
  kantoFinal: 0.4,
  kantoLider: 0.43,
  kantoSelvagem: 0.38,
  kantoTreinador: 0.41,
  lab: 1.66,
  mart: 1.14,
  megaDescontrolada: 0.19,
  nascimento: 1.01,
  pallet: 1.42,
  route: 1.0,
  saolucario: 0.85,   // apelido da bragSaoLucario (a música velha saiu)
  titulo: 0.98,
  troca: 0.45,
  troca_fanfarra: 0.92,
  vestir: 1.08,
  viridian: 0.98,
};
