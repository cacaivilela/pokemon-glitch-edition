// Os ícones da EQUIPE pulando, como no menu dos jogos. (Na batalha quem anima
// é o sprite do Black/White: Assets.monAnim, tools/fetch_bw_anim.py.)

/** dois quadros: mais rápido no escolhido, parado no desmaiado */
export function puloDoIcone(t, escolhido, desmaiado) {
  if (desmaiado) return 0;
  return Math.floor(t * (escolhido ? 6 : 2.5)) % 2 ? -2 : 0;
}
