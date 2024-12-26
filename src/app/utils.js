const Utils = {
  style: game.style,
  amp: 15,
  t: 0,
  step: 0.03,
  shake: () => {
    if (!Utils.style) return;
    const rotation = (Math.random() * 2 - 1) * Utils.t;
    const offsetX = (Math.random() * Utils.amp * 2 - Utils.amp) * Utils.t;
    const offsetY = (Math.random() * Utils.amp - Utils.amp * 0.5) * Utils.t;
    const scale = Math.max(1, 1.05 * Utils.t);

    Utils.style.transform =
      Utils.style.webkitTransform =
      `rotate(${rotation}deg) translate(${offsetX}px,${offsetY}px) scale(${scale})`;

    Utils.t -= Utils.step;
    if (Utils.t > 0) {
      requestAnimationFrame(Utils.shake);
    } else {
      Utils.t = 0;
      Utils.style.transform = 'matrix(1,0,0,1,0,0)';
    }
  },
  startShake: () => {
    Utils.t = 1;
    requestAnimationFrame(Utils.shake);
  },
  drawDiamond(x, y, w, h, ctx, colors) {
    if (!ctx || !colors || colors.length < 3) return;

    const top = y - 0.3 * h;
    const halfW = w / 2;
    ctx.fillStyle = colors[0];
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + halfW, y + 0.7 * h);
    ctx.lineTo(x + halfW, y);
    ctx.fill();

    ctx.fillStyle = colors[1];
    ctx.beginPath();
    ctx.moveTo(x + halfW, y);
    ctx.lineTo(x + halfW, y + 0.7 * h);
    ctx.lineTo(x + w, y);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x + w / 4, top);
    ctx.lineTo(x, y);
    ctx.lineTo(x + halfW, y);
    ctx.fill();

    ctx.fillStyle = colors[2];
    ctx.beginPath();
    ctx.moveTo(x + w / 4, top);
    ctx.lineTo(x + halfW, y);
    ctx.lineTo(x + 0.75 * w, top);
    ctx.fill();

    ctx.fillStyle = colors[0];
    ctx.beginPath();
    ctx.moveTo(x + 0.75 * w, top);
    ctx.lineTo(x + halfW, y);
    ctx.lineTo(x + w, y);
    ctx.fill();
  }
};

export { Utils };