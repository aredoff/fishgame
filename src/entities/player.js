import { GRAVITY, FLAP_VELOCITY, MAX_FALL_VELOCITY, PLAYER_SIZE_RATIO } from '../config.js';

export class Player {
  constructor() {
    this.reset();
  }

  reset() {
    this.yRatio = 0.45;
    this.vy = 0;
    this.wobble = 0;
    this.hitFlash = 0;
    this.tilt = 0;
  }

  resize(h) {
    this.h = h;
    this.size = h * PLAYER_SIZE_RATIO;
    this.yRatio = 0.45;
  }

  flap() {
    this.vy = FLAP_VELOCITY;
  }

  update(dt) {
    const s = dt / 1000;
    this.vy += GRAVITY * s;
    this.vy = Math.min(this.vy, MAX_FALL_VELOCITY);
    this.yRatio += (this.vy * s);
    this.yRatio = Math.max(0.06, Math.min(0.94, this.yRatio));
    this.tilt = this.vy * 0.8;
    this.wobble += dt * 0.006;
    if (this.hitFlash > 0) this.hitFlash -= dt;
  }

  get x() {
    return this._x;
  }

  get y() {
    return this.yRatio * this.h;
  }

  get radius() {
    return this.size * 0.42;
  }

  setScreenX(x) {
    this._x = x;
  }

  draw(ctx, invincible) {
    const x = this._x;
    const y = this.y;
    const s = this.size;
    const tailWag = Math.sin(this.wobble) * 0.25;

    ctx.save();
    if (invincible && Math.floor(Date.now() / 100) % 2 === 0) {
      ctx.globalAlpha = 0.5;
    }
    if (this.hitFlash > 0) {
      ctx.globalAlpha = 0.7;
    }

    ctx.translate(x, y);
    ctx.rotate(this.tilt * 0.35);

    ctx.fillStyle = '#FFD54F';
    ctx.beginPath();
    ctx.moveTo(-s * 0.55, 0);
    ctx.lineTo(-s * 0.85, -s * 0.22 + tailWag * s * 0.08);
    ctx.lineTo(-s * 0.85, s * 0.22 + tailWag * s * 0.08);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#1565C0';
    ctx.beginPath();
    ctx.ellipse(0, 0, s * 0.52, s * 0.36, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#42A5F5';
    ctx.beginPath();
    ctx.ellipse(s * 0.04, s * 0.06, s * 0.32, s * 0.2, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#1E88E5';
    ctx.beginPath();
    ctx.moveTo(-s * 0.05, -s * 0.28);
    ctx.quadraticCurveTo(s * 0.15, -s * 0.45, s * 0.3, -s * 0.2);
    ctx.lineTo(s * 0.1, -s * 0.22);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(s * 0.2, -s * 0.06, s * 0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(s * 0.24, -s * 0.06, s * 0.075, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(s * 0.27, -s * 0.09, s * 0.028, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#0D47A1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(s * 0.3, s * 0.08, s * 0.09, 0.15, Math.PI - 0.15);
    ctx.stroke();

    ctx.restore();
  }
}
