// Pilha de cenas. Cada cena: { enter?, exit?, update(dt), render(ctx), pause?, resume? }
export class SceneStack {
  constructor(game) { this.game = game; this.stack = []; }
  get top() { return this.stack[this.stack.length - 1]; }
  push(scene, args) {
    this.top?.pause?.();
    this.stack.push(scene);
    scene.game = this.game;
    scene.enter?.(args);
    return scene;
  }
  pop(result) {
    const s = this.stack.pop();
    s?.exit?.(result);
    this.top?.resume?.(result);
    return s;
  }
  replace(scene, args) {
    while (this.stack.length) this.stack.pop()?.exit?.();
    return this.push(scene, args);
  }
  update(dt) { this.top?.update?.(dt); }
  render(ctx) {
    // desenha de baixo pra cima ate a ultima cena opaca
    let i = this.stack.length - 1;
    while (i > 0 && this.stack[i].transparent) i--;
    for (; i < this.stack.length; i++) this.stack[i].render?.(ctx);
  }
}
