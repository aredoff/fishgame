import { MAX_HEALTH, DORY_BLUE, DORY_YELLOW } from './config.js';

export function drawHUD(ctx, w, h, friends, health, score) {
  drawFriendsCounter(ctx, w, h, friends);
  drawHealthBar(ctx, w, h, health);
  drawScore(ctx, w, h, score);
}

function drawFriendsCounter(ctx, w, h, friends) {
  const pad = Math.max(16, w * 0.03);
  const size = Math.max(28, h * 0.04);

  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  drawPill(ctx, pad, pad, size * 3.2, size * 1.4, size * 0.7);

  drawMiniDory(ctx, pad + size * 0.7, pad + size * 0.7, size * 0.45);

  ctx.fillStyle = '#E0E0E0';
  ctx.font = `bold ${size * 0.65}px sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(String(friends), pad + size * 1.5, pad + size * 0.72);
  ctx.restore();
}

function drawHealthBar(ctx, w, h, health) {
  const pad = Math.max(16, w * 0.03);
  const heartSize = Math.max(22, h * 0.035);
  const startX = w - pad - heartSize * MAX_HEALTH - (MAX_HEALTH - 1) * 6;

  ctx.save();
  for (let i = 0; i < MAX_HEALTH; i++) {
    const x = startX + i * (heartSize + 6);
    const filled = i < health;
    drawHeart(ctx, x + heartSize / 2, pad + heartSize / 2, heartSize * 0.45, filled);
  }
  ctx.restore();
}

function drawScore(ctx, w, h, score) {
  const size = Math.max(20, h * 0.032);
  ctx.save();
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.font = `bold ${size}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText(String(Math.floor(score)), w / 2, Math.max(16, h * 0.02));
  ctx.restore();
}

function drawHeart(ctx, x, y, r, filled) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = filled ? '#FF4757' : 'rgba(255,255,255,0.2)';
  ctx.strokeStyle = filled ? '#C0392B' : 'rgba(255,255,255,0.4)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, r * 0.3);
  ctx.bezierCurveTo(0, -r * 0.5, -r * 1.2, -r * 0.5, -r * 1.2, r * 0.3);
  ctx.bezierCurveTo(-r * 1.2, r, 0, r * 1.4, 0, r * 1.8);
  ctx.bezierCurveTo(0, r * 1.4, r * 1.2, r, r * 1.2, r * 0.3);
  ctx.bezierCurveTo(r * 1.2, -r * 0.5, 0, -r * 0.5, 0, r * 0.3);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawMiniDory(ctx, x, y, s) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = DORY_YELLOW;
  ctx.beginPath();
  ctx.moveTo(-s * 0.4, 0);
  ctx.lineTo(-s * 0.65, -s * 0.15);
  ctx.lineTo(-s * 0.65, s * 0.15);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = DORY_BLUE;
  ctx.beginPath();
  ctx.ellipse(0, 0, s * 0.5, s * 0.35, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawPill(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fill();
}

export function drawStartScreen(ctx, w, h) {
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fillRect(0, 0, w, h);

  const titleSize = Math.max(30, h * 0.055);
  ctx.fillStyle = '#42A5F5';
  ctx.font = `bold ${titleSize}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Dory to the Ocean!', w / 2, h * 0.32);

  const subSize = Math.max(17, h * 0.026);
  ctx.fillStyle = '#E0E0E0';
  ctx.font = `${subSize}px sans-serif`;
  ctx.fillText('Swim through the sewer pipes!', w / 2, h * 0.46);
  ctx.fillText('Tap to swim up — find friends!', w / 2, h * 0.52);

  const pulse = 0.8 + Math.sin(Date.now() * 0.004) * 0.2;
  ctx.globalAlpha = pulse;
  ctx.fillStyle = '#FFD54F';
  ctx.font = `bold ${subSize}px sans-serif`;
  ctx.fillText('Tap to start', w / 2, h * 0.68);
  ctx.restore();
}

export function drawGameOver(ctx, w, h, score, friends) {
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(0, 0, w, h);

  const titleSize = Math.max(26, h * 0.048);
  ctx.fillStyle = '#42A5F5';
  ctx.font = `bold ${titleSize}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Oops! Try again!', w / 2, h * 0.32);

  const subSize = Math.max(19, h * 0.03);
  ctx.fillStyle = '#E0E0E0';
  ctx.font = `bold ${subSize}px sans-serif`;
  ctx.fillText(`Score: ${Math.floor(score)}`, w / 2, h * 0.46);
  ctx.fillText(`Friends: ${friends}`, w / 2, h * 0.52);

  const pulse = 0.8 + Math.sin(Date.now() * 0.004) * 0.2;
  ctx.globalAlpha = pulse;
  ctx.fillStyle = '#FFD54F';
  ctx.font = `${subSize * 0.85}px sans-serif`;
  ctx.fillText('Tap to play again', w / 2, h * 0.66);
  ctx.restore();
}

export function drawBackground(ctx, w, h, offset) {
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, '#1B3A2D');
  grad.addColorStop(0.35, '#2C4A3E');
  grad.addColorStop(0.7, '#3D5A4C');
  grad.addColorStop(1, '#1A2E24');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  const oceanGlow = ctx.createRadialGradient(w * 0.85, h * 0.15, 0, w * 0.85, h * 0.15, w * 0.5);
  oceanGlow.addColorStop(0, 'rgba(66,165,245,0.18)');
  oceanGlow.addColorStop(1, 'rgba(66,165,245,0)');
  ctx.fillStyle = oceanGlow;
  ctx.fillRect(0, 0, w, h);

  drawTunnelWalls(ctx, w, h, offset);
  drawSewerDetails(ctx, w, h, offset);
}

function drawTunnelWalls(ctx, w, h, offset) {
  const wallW = Math.max(18, w * 0.04);

  ctx.save();
  for (const side of ['left', 'right']) {
    const x = side === 'left' ? 0 : w - wallW;
    const grad = ctx.createLinearGradient(x, 0, side === 'left' ? x + wallW : x, 0);
    grad.addColorStop(0, '#3E3E3E');
    grad.addColorStop(0.5, '#555');
    grad.addColorStop(1, 'rgba(85,85,85,0.3)');
    ctx.fillStyle = grad;
    ctx.fillRect(x, 0, wallW, h);

    ctx.strokeStyle = 'rgba(0,0,0,0.3)';
    ctx.lineWidth = 1;
    const brickH = h * 0.06;
    for (let row = 0; row < h / brickH + 1; row++) {
      const by = row * brickH;
      ctx.beginPath();
      ctx.moveTo(x, by);
      ctx.lineTo(x + wallW, by);
      ctx.stroke();
      const shift = row % 2 === 0 ? 0 : wallW * 0.25;
      ctx.beginPath();
      ctx.moveTo(x + shift, by);
      ctx.lineTo(x + shift, by + brickH);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x + shift + wallW * 0.5, by);
      ctx.lineTo(x + shift + wallW * 0.5, by + brickH);
      ctx.stroke();
    }
  }
  ctx.restore();
}

function drawSewerDetails(ctx, w, h, offset) {
  ctx.save();
  ctx.globalAlpha = 0.2;

  for (let i = 0; i < 6; i++) {
    const x = ((offset * 0.015 + i * 130) % (w + 80)) - 40;
    const dripY = h * 0.05 + (i % 3) * h * 0.08;
    ctx.strokeStyle = '#8BC34A';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.quadraticCurveTo(x + 3, dripY, x, dripY + 15 + (i % 4) * 8);
    ctx.stroke();
  }

  ctx.fillStyle = '#2E4A3A';
  for (let i = 0; i < 4; i++) {
    const px = ((offset * 0.01 + i * 180) % w);
    const py = h * (0.75 + (i % 2) * 0.12);
    ctx.beginPath();
    ctx.ellipse(px, py, 20 + i * 5, 8, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}
