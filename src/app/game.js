import { timestamp, bound, overlap } from './helpers';
import { MAP, TILE, GRAVITY, MAXDX, MAXDY, ACCEL, FRICTION, IMPULSE, DIAMOND_COLORS, KEY, fps, step, canvas, ctx, width, height, assets, font } from './constants';
import { Utils } from './utils';
import { resetCurrentMap, finishCurrentLvl, finishGameOver, life } from './main';
import { TextGen } from './text_gen';
let player = {};
let chest = {};
let enemies = [];
let treasure = [];
let spikes = [];
let cells = [];
let win = false;
let gameOver = false;

const t2p = (t) => t * TILE;
const p2t = (p) => Math.floor(p / TILE);
const cellAvailable = (x, y) => tcell(p2t(x), p2t(y));
function tcell(tx, ty, notRend = true) {
  const c = cells[tx + (ty * MAP.tw)];
  return (notRend && c >= 22) ? 0 : c;
}

function onkey(ev, key, down) {
  switch (key) {
    case KEY.LEFT:
      player.left = down;
      ev.preventDefault();
      return false;
    case KEY.RIGHT:
      player.right = down;
      ev.preventDefault();
      return false;
    case KEY.SPACE:
      player.jump = down;
      ev.preventDefault();
      return false;
  }
}

function update(dt) {
  updatePlayer(dt);
  updateEnemies(dt);
  updateSpikes(dt);
  checkTreasure();
  if (treasure.length === player.collected) checkChest();
}

function updatePlayer(dt) {
  updateEntity(player, dt, true);
}

function updateEnemies(dt) {
  for (const enemy of enemies) {
    updateEnemy(enemy, dt);
  }
}

function updateEnemy(enemy, dt) {
  updateEntity(enemy, dt);
  if (overlap(player.x, player.y, TILE, TILE, enemy.x, enemy.y, TILE, TILE)) {
    Utils.startShake();
    killPlayer(player);
  }
}

function updateSpikes(dt) {
  for (const spike of spikes) {
    if (overlap(player.x, player.y, TILE, TILE, spike.x, spike.y - TILE, TILE, TILE)) {
      Utils.startShake();
      killPlayer(player);
    }
  }
}

function checkTreasure() {
  for (const t of treasure) {
    if (!t.collected && overlap(player.x, player.y, TILE, TILE, t.x, t.y, TILE, TILE)) {
      collectTreasure(t);
    }
  }
}

function checkChest() {
  if (win) return;
  if (overlap(player.x, player.y, TILE, TILE, chest.x, chest.y - TILE, TILE, TILE)) {
    win = true;
    finishCurrentLvl();
  }
}

function killPlayer(p) {
  if (life === 1) {
    gameOver = true;
    finishGameOver();
  }
  player = {};
  enemies = [];
  spikes = [];
  treasure = [];
  cells = [];
  if (life !== 1) {
    resetCurrentMap();
  }
}

function collectTreasure(t) {
  player.collected++;
  t.collected = true;
}

function updateEntity(entity, dt, isPlayer = false) {
  const wasLeft = entity.dx < 0;
  const wasRight = entity.dx > 0;
  const falling = entity.falling;
  const frictionVal = entity.friction * (falling ? 0.5 : 1);
  const accelVal = entity.accel * (falling ? 0.5 : 1);

  if (isPlayer) checkPlayerPositions(entity);

  entity.ddx = 0;
  entity.ddy = entity.gravity;

  if (entity.left) {
    entity.orientation = 'left';
    entity.ddx -= accelVal;
  } else if (wasLeft) {
    entity.ddx += frictionVal;
  }

  if (entity.right) {
    entity.orientation = 'right';
    entity.ddx += accelVal;
  } else if (wasRight) {
    entity.ddx -= frictionVal;
  }

  if (entity.jump && !entity.jumping && !falling) {
    entity.ddy -= entity.impulse;
    entity.jumping = true;
  }

  entity.x += dt * entity.dx;
  entity.y += dt * entity.dy;
  entity.dx = bound(entity.dx + dt * entity.ddx, -entity.maxdx, entity.maxdx);
  entity.dy = bound(entity.dy + dt * entity.ddy, -entity.maxdy, entity.maxdy);

  if ((wasLeft && entity.dx > 0) || (wasRight && entity.dx < 0)) {
    entity.dx = 0;
  }

  let tx = p2t(entity.x);
  let ty = p2t(entity.y);
  let nx = entity.x % TILE;
  let ny = entity.y % TILE;
  let cellVal = tcell(tx, ty);
  let cellRight = tcell(tx + 1, ty);
  let cellDown = tcell(tx, ty + 1);
  let cellDiag = tcell(tx + 1, ty + 1);

  if (entity.dy > 0) {
    if ((cellDown && !cellVal) || (cellDiag && !cellRight && nx)) {
      entity.y = t2p(ty);
      entity.dy = 0;
      entity.falling = false;
      entity.jumping = false;
      ny = 0;
    }
  } else if (entity.dy < 0) {
    if ((cellVal && !cellDown) || (cellRight && !cellDiag && nx)) {
      entity.y = t2p(ty + 1);
      entity.dy = 0;
      cellVal = cellDown;
      cellRight = cellDiag;
      ny = 0;
    }
  }

  if (entity.dx > 0) {
    if ((cellRight && !cellVal) || (cellDiag && !cellDown && ny)) {
      entity.x = t2p(tx);
      entity.dx = 0;
    }
  } else if (entity.dx < 0) {
    if ((cellVal && !cellRight) || (cellDown && !cellDiag && ny)) {
      entity.x = t2p(tx + 1);
      entity.dx = 0;
    }
  }

  if (entity.enemy) {
    if (entity.left && (cellVal || !cellDown)) {
      entity.left = false;
      entity.right = true;
    } else if (entity.right && (cellRight || !cellDiag)) {
      entity.right = false;
      entity.left = true;
    }
  }
  entity.falling = !(cellDown || (nx && cellDiag));
}

function checkPlayerPositions(entity) {
  const maxX = TILE * (MAP.tw - 1);
  const maxY = TILE * (MAP.th - 1);

  if (Math.round(entity.x) >= maxX) {
    if (!cellAvailable(0, entity.y) && !cellAvailable(1, entity.y)) {
      entity.x = 0.5;
    } else {
      entity.x = maxX - 0.5;
    }
  } else if (Math.round(entity.x) <= 0) {
    if (!cellAvailable(maxX, entity.y) && !cellAvailable(maxX - 1, entity.y)) {
      entity.x = maxX - 0.5;
    } else {
      entity.x = 0.5;
    }
  } else if (Math.round(entity.y) >= maxY) {
    if (!cellAvailable(entity.x, 0) && !cellAvailable(entity.x, 1)) {
      entity.y = 0.5;
    } else {
      entity.y = maxY - 0.5;
    }
  } else if (Math.round(entity.y) <= 0) {
    if (!cellAvailable(entity.x, maxY) && !cellAvailable(entity.x, maxY - 1)) {
      entity.y = maxY - 0.5;
    } else {
      entity.y = 0.5;
    }
  }
}

function render(ctx, frame, dt) {
  ctx.clearRect(0, 0, width, height);
  renderMap(ctx);
  renderTreasure(ctx, frame);
  renderPlayer(ctx, dt);
  renderEnemies(ctx, dt);
  renderSpikes(ctx, dt);
  if (treasure.length === player.collected) renderChest(ctx, frame);
}

function renderMap(ctx) {
  for (let y = 0; y < MAP.th; y++) {
    for (let x = 0; x < MAP.tw; x++) {
      const cellVal = tcell(x, y, false);
      if (cellVal === 0) {
        ctx.drawImage(assets, 9 * TILE, 0, TILE, TILE, x * TILE, y * TILE, TILE, TILE);
      } else if (cellVal) {
        ctx.drawImage(assets, (cellVal - 1) * TILE, 0, TILE, TILE, x * TILE, y * TILE, TILE, TILE);
      }
    }
  }
}

function renderPlayer(ctx, dt) {
  const frameIndex = (player.orientation === 'right') ? 27 : 28;
  ctx.drawImage(assets, frameIndex * TILE, 0, TILE, TILE, player.x, player.y, TILE, TILE);
  for (let n = 0; n < life; n++) {
    ctx.drawImage(assets, 26 * TILE, 0, TILE, TILE, n * TILE + 2, 1, TILE * 0.8, TILE * 0.8);
  }
}

function renderChest(ctx, frame) {
  ctx.globalAlpha = 0.45 + tweenTreasure(frame, 60);
  ctx.drawImage(assets, 13 * TILE, 0, TILE, TILE, chest.x, chest.y - (TILE * 1.5), TILE * 1.5, TILE * 1.5);
  ctx.globalAlpha = 1;
}

function renderEnemies(ctx) {
  for (const enemy of enemies) {
    const side = enemy.type === '1' ? (enemy.right ? 14 : 15) : (enemy.right ? 16 : 17);
    ctx.drawImage(assets, side * TILE, 0, TILE, TILE, enemy.x, enemy.y, TILE, TILE);
  }
}

function renderSpikes(ctx) {
  for (const spike of spikes) {
    ctx.drawImage(assets, spike.gid * TILE, 0, TILE, TILE, spike.x, spike.y - TILE, TILE, TILE);
  }
}

function renderTreasure(ctx, frame) {
  ctx.globalAlpha = 0.45 + tweenTreasure(frame, 60);
  for (const t of treasure) {
    if (!t.collected) {
      Utils.drawDiamond(t.x, t.y, 15, 13, ctx, DIAMOND_COLORS[t.color]);
    }
  }
  ctx.globalAlpha = 1;
}

function tweenTreasure(frame, duration) {
  const half = duration / 2;
  const pulse = frame % duration;
  return pulse < half ? (pulse / half) : 1 - (pulse - half) / half;
}

function setup(map) {
  player = {};
  enemies = [];
  spikes = [];
  treasure = [];
  cells = [];
  win = false;
  gameOver = false;

  const data = map.layers[0].data;
  const objects = map.layers[1].objects;

  for (const obj of objects) {
    const entity = setupEntity(obj);
    switch (obj.type) {
      case 'player':
        player = entity;
        break;
      case 'enemy':
        enemies.push(entity);
        break;
      case 'spike':
        spikes.push(entity);
        break;
      case 'coin':
        treasure.push(entity);
        break;
      case 'chest':
        chest = entity;
        break;
    }
  }
  cells = data;
}

function setupEntity(obj) {
  if (!obj.properties) obj.properties = {};

  const entity = {
    x: obj.x,
    y: obj.y,
    dx: 0,
    dy: 0,
    gravity: TILE * (obj.properties.gravity || GRAVITY),
    maxdx: TILE * (obj.properties.maxdx || MAXDX),
    maxdy: TILE * (obj.properties.maxdy || MAXDY),
    impulse: TILE * (obj.properties.impulse || IMPULSE),
    enemy: obj.type === 'enemy',
    player: obj.type === 'player',
    treasure: obj.type === 'coin',
    chest: obj.type === 'chest',
    spike: obj.type === 'spike',
    gid: obj.gid - 1,
    left: obj.properties.left,
    right: obj.properties.right,
    color: obj.properties.color,
    type: obj.properties.type,
    orientation: 'right',
    start: { x: obj.x, y: obj.y },
    killed: 0,
    collected: 0
  };

  entity.accel = entity.maxdx / (obj.properties.accel || ACCEL);
  entity.friction = entity.maxdx / (obj.properties.friction || FRICTION);

  return entity;
}

let counter = 0;
let dt = 0;
let now;
let last = timestamp();

function frame() {
  now = timestamp();
  dt += Math.min(1, (now - last) / 1000);
  while (dt > step) {
    dt -= step;
    update(step);
  }
  if (!win && !gameOver) {
    render(ctx, counter, dt);
  }
  last = now;
  counter++;
  requestAnimationFrame(frame, canvas);
}

export { setup, frame, onkey };
