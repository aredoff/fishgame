import { rand } from '../renderer.js';

export class Hazard {
  constructor(type, x, y, w, h) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.collected = false;
    this.wobble = Math.random() * Math.PI * 2;

    if (type === 'shark') {
      this.size = h * 0.075;
      this.vy = rand(-0.00008, 0.00008) * h;
      this.vx = -0.00005 * w;
    } else {
      this.size = h * 0.055;
      this.vy = rand(-0.00004, 0.00004) * h;
      this.vx = 0;
    }
  }

  update(dt, scrollSpeed) {
    this.x -= scrollSpeed * dt;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.wobble += dt * 0.003;

    if (this.y < this.size) {
      this.y = this.size;
      this.vy *= -1;
    }
    if (this.y > this.h - this.size) {
      this.y = this.h - this.size;
      this.vy *= -1;
    }
  }

  get offScreen() {
    return this.x + this.size < -40;
  }

  get radius() {
    return this.type === 'shark' ? this.size * 0.55 : this.size * 0.5;
  }

  draw(ctx) {
    if (this.collected) return;

    if (this.type === 'shark') {
      this.drawShark(ctx);
    } else {
      this.drawPuffer(ctx);
    }
  }

  drawShark(ctx) {
    const s = this.size;
    const wag = Math.sin(this.wobble) * 0.15;

    ctx.save();
    ctx.translate(this.x, this.y);

    ctx.fillStyle = '#78909C';
    ctx.beginPath();
    ctx.ellipse(0, 0, s * 0.6, s * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#90A4AE';
    ctx.beginPath();
    ctx.moveTo(s * 0.5, -s * 0.1);
    ctx.lineTo(s * 0.75, -s * 0.35);
    ctx.lineTo(s * 0.55, -s * 0.05);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#78909C';
    ctx.beginPath();
    ctx.moveTo(-s * 0.5, 0);
    ctx.lineTo(-s * 0.8, -s * 0.15 + wag * s);
    ctx.lineTo(-s * 0.8, s * 0.15 + wag * s);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(s * 0.15, -s * 0.05, s * 0.08, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(s * 0.17, -s * 0.05, s * 0.04, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  drawPuffer(ctx) {
    const s = this.size;
    const puff = 1 + Math.sin(this.wobble * 2) * 0.08;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.scale(puff, puff);

    ctx.fillStyle = '#FFB74D';
    ctx.beginPath();
    ctx.arc(0, 0, s * 0.45, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#E65100';
    ctx.lineWidth = 2;
    for (let i = 0; i < 10; i++) {
      const angle = (Math.PI * 2 * i) / 10;
      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * s * 0.4, Math.sin(angle) * s * 0.4);
      ctx.lineTo(Math.cos(angle) * s * 0.6, Math.sin(angle) * s * 0.6);
      ctx.stroke();
    }

    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(s * 0.12, -s * 0.08, s * 0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(-s * 0.08, -s * 0.08, s * 0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(s * 0.14, -s * 0.08, s * 0.05, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(-s * 0.06, -s * 0.08, s * 0.05, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}
