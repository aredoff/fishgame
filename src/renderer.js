export function circleRectOverlap(cx, cy, cr, rx, ry, rw, rh) {
  const closestX = Math.max(rx, Math.min(cx, rx + rw));
  const closestY = Math.max(ry, Math.min(cy, ry + rh));
  const dx = cx - closestX;
  const dy = cy - closestY;
  return dx * dx + dy * dy < cr * cr;
}

export function rand(min, max) {
  return min + Math.random() * (max - min);
}

export function randInt(min, max) {
  return Math.floor(rand(min, max + 1));
}

export function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function drawRoundedRect(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

export class Particle {
  constructor(x, y, vx, vy, color, life, size) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    this.life = life;
    this.maxLife = life;
    this.size = size;
  }

  update(dt, h) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.vy -= 0.0003 * dt * h;
    this.life -= dt;
  }

  draw(ctx) {
    const alpha = Math.max(0, this.life / this.maxLife);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  get dead() {
    return this.life <= 0;
  }
}

export class Bubble {
  constructor(w, h) {
    this.reset(w, h, true);
  }

  reset(w, h, randomY = false) {
    this.x = Math.random() * w;
    this.y = randomY ? Math.random() * h : h + 20;
    this.r = rand(2, 6);
    this.speed = rand(0.012, 0.028);
    this.wobble = Math.random() * Math.PI * 2;
  }

  update(dt, w, h) {
    this.y -= this.speed * dt;
    this.wobble += dt * 0.0006;
    this.x += Math.sin(this.wobble) * 0.008 * dt;
    if (this.y < -20) this.reset(w, h);
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = 0.18;
    ctx.strokeStyle = '#A5D6A7';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}

export function spawnBurst(particles, x, y, color, count = 8) {
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + rand(-0.3, 0.3);
    const speed = rand(0.08, 0.2);
    particles.push(
      new Particle(
        x,
        y,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed,
        color,
        rand(400, 800),
        rand(3, 7),
      ),
    );
  }
}

export function spawnStars(particles, x, y) {
  for (let i = 0; i < 12; i++) {
    particles.push(
      new Particle(
        x + rand(-10, 10),
        y + rand(-10, 10),
        rand(-0.1, 0.1),
        rand(-0.15, -0.05),
        pick(['#FFD700', '#FF69B4', '#87CEEB', '#FFF']),
        rand(500, 1000),
        rand(2, 5),
      ),
    );
  }
}
