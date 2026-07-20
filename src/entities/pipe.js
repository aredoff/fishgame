import { drawRoundedRect, rand } from '../renderer.js';

function pickRustColor() {
  const colors = ['#8B4513', '#A0522D', '#6B3A1F', '#CD853F', '#704214'];
  return colors[Math.floor(Math.random() * colors.length)];
}

export class PipePair {
  constructor(x, w, h, gaps, thick, isBranch = false) {
    this.x = x;
    this.w = w;
    this.h = h;
    this.gaps = gaps;
    this.thick = thick;
    this.isBranch = isBranch;
    this.rustSpots = this.generateRust();
    this.passed = false;
  }

  generateRust() {
    const spots = [];
    for (let i = 0; i < rand(4, 9); i++) {
      spots.push({
        nx: rand(0.05, 0.95),
        ny: rand(0.05, 0.95),
        r: rand(0.03, 0.1),
        color: pickRustColor(),
      });
    }
    return spots;
  }

  update(dt, scrollSpeed) {
    this.x -= scrollSpeed * dt;
  }

  get offScreen() {
    return this.x + this.w < -60;
  }

  get collisionRects() {
    const rects = [];
    const sorted = [...this.gaps].sort((a, b) => a.y - b.y);
    let prevBottom = 0;

    for (const gap of sorted) {
      if (gap.y - prevBottom > 0.005) {
        rects.push({
          x: this.x,
          y: prevBottom * this.h,
          w: this.w,
          h: (gap.y - prevBottom) * this.h,
        });
      }
      prevBottom = gap.y + gap.h;
    }
    if (1 - prevBottom > 0.005) {
      rects.push({
        x: this.x,
        y: prevBottom * this.h,
        w: this.w,
        h: (1 - prevBottom) * this.h,
      });
    }
    return rects;
  }

  getSpawnPoint(spacing) {
    const gap = this.gaps[Math.floor(this.gaps.length / 2)];
    return {
      x: this.x + this.w + spacing * 0.5,
      y: (gap.y + gap.h / 2) * this.h,
    };
  }

  draw(ctx) {
    for (const rect of this.collisionRects) {
      this.drawPipeWall(ctx, rect.x, rect.y, rect.w, rect.h);
    }
    for (const gap of this.gaps) {
      this.drawPipeLip(ctx, gap);
    }
    if (this.isBranch) {
      ctx.save();
      ctx.fillStyle = 'rgba(255,220,100,0.25)';
      ctx.font = `bold ${Math.max(12, this.w * 0.12)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('↕', this.x + this.w * 0.5, this.h * 0.04);
      ctx.restore();
    }
  }

  drawPipeLip(ctx, gap) {
    const lipH = Math.max(6, this.h * 0.012);
    const gx = this.x;
    const gy = gap.y * this.h;
    const gw = this.w;
    const gh = gap.h * this.h;

    ctx.fillStyle = this.thick ? '#A67C00' : '#C4941A';
    drawRoundedRect(ctx, gx - 3, gy - lipH, gw + 6, lipH, 3);
    ctx.fill();
    drawRoundedRect(ctx, gx - 3, gy + gh, gw + 6, lipH, 3);
    ctx.fill();
  }

  drawPipeWall(ctx, x, y, w, h) {
    const grad = ctx.createLinearGradient(x, y, x + w, y + h);
    grad.addColorStop(0, this.thick ? '#B89020' : '#D4A828');
    grad.addColorStop(0.4, this.thick ? '#9A7818' : '#C4941A');
    grad.addColorStop(1, this.thick ? '#7A5E10' : '#8B6914');

    drawRoundedRect(ctx, x, y, w, h, Math.min(6, w * 0.12));
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = '#5C4A0E';
    ctx.lineWidth = 2;
    ctx.stroke();

    for (const spot of this.rustSpots) {
      const sx = x + spot.nx * w;
      const sy = y + spot.ny * h;
      if (sy < y || sy > y + h) continue;
      ctx.fillStyle = spot.color;
      ctx.globalAlpha = 0.55;
      ctx.beginPath();
      ctx.arc(sx, sy, spot.r * Math.min(w, h), 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    ctx.fillStyle = '#444';
    const bolts = [
      [x + 5, y + 5],
      [x + w - 5, y + 5],
      [x + 5, y + h - 5],
      [x + w - 5, y + h - 5],
    ];
    for (const [bx, by] of bolts) {
      ctx.beginPath();
      ctx.arc(bx, by, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

export function createPipePair(x, w, h, gapY, gapH, thick) {
  return new PipePair(x, w, h, [{ y: gapY, h: gapH }], thick, false);
}

export function createBranchPair(x, w, h, paths, thick) {
  return new PipePair(x, w, h, paths, thick, true);
}
