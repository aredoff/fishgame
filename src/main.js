import { Game } from './game.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const game = new Game(ctx);

function resize() {
  const dpr = window.devicePixelRatio || 1;
  const w = document.documentElement.clientWidth;
  const h = document.documentElement.clientHeight;

  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  game.resize(w, h);
}

function handleInput(e) {
  e.preventDefault();
  game.onTap();
}

resize();
window.addEventListener('resize', resize);
window.addEventListener('orientationchange', () => setTimeout(resize, 100));
canvas.addEventListener('pointerdown', handleInput);
canvas.addEventListener('touchstart', handleInput, { passive: false });

game.run();
