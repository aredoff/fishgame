import { FRIEND_COLORS } from '../config.js';
import { rand } from '../renderer.js';

export function drawFriendFish(ctx, x, y, size, color) {
  const bob = 0;
  const s = size;

  ctx.save();
  ctx.translate(x, y + bob);

  ctx.globalAlpha = 0.35;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(0, 0, s * 0.65, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(0, 0, s * 0.5, s * 0.35, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.beginPath();
  ctx.ellipse(s * 0.05, s * 0.04, s * 0.25, s * 0.15, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(-s * 0.4, 0);
  ctx.lineTo(-s * 0.65, -s * 0.15);
  ctx.lineTo(-s * 0.65, s * 0.15);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(s * 0.15, -s * 0.06, s * 0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#333';
  ctx.beginPath();
  ctx.arc(s * 0.17, -s * 0.06, s * 0.05, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

export class FriendFish {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = FRIEND_COLORS[Math.floor(Math.random() * FRIEND_COLORS.length)];
    this.wobble = Math.random() * Math.PI * 2;
    this.size = h * 0.048;
    this.collected = false;
  }

  update(dt, scrollSpeed) {
    this.x -= scrollSpeed * dt;
    this.wobble += dt * 0.005;
  }

  get offScreen() {
    return this.x + this.size < -20;
  }

  get radius() {
    return this.size * 0.5;
  }

  draw(ctx) {
    if (this.collected) return;
    const bob = Math.sin(this.wobble) * 3;
    drawFriendFish(ctx, this.x, this.y + bob, this.size, this.color);
  }
}
