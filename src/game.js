import { Player } from './entities/player.js';
import { PipeGenerator } from './world/pipeGenerator.js';
import { Spawner } from './world/spawner.js';
import { Follower } from './entities/follower.js';
import {
  MAX_HEALTH,
  INVINCIBILITY_MS,
  PIPE_DAMAGE,
  HAZARD_SHARK_DAMAGE,
  HAZARD_PUFFER_DAMAGE,
  FRIEND_SCORE_BONUS,
  BASE_SCROLL_SPEED,
  SPEED_INCREASE_EVERY,
  SPEED_INCREASE_AMOUNT,
  MAX_SCROLL_SPEED,
  PLAYER_X_RATIO,
  SHAKE_DURATION_MS,
  SHAKE_INTENSITY,
  MAX_FOLLOWERS,
} from './config.js';
import {
  circleRectOverlap,
  Bubble,
  spawnBurst,
  spawnStars,
} from './renderer.js';
import { drawHUD, drawStartScreen, drawGameOver, drawBackground } from './ui.js';
import { sound } from './audio.js';
import { loadBestScore, saveBestScore } from './storage.js';

const STATE_START = 'start';
const STATE_PLAYING = 'playing';
const STATE_GAMEOVER = 'gameover';

export class Game {
  constructor(ctx) {
    this.ctx = ctx;
    this.player = new Player();
    this.pipes = new PipeGenerator();
    this.spawner = new Spawner();
    this.bubbles = [];
    this.particles = [];
    this.followers = [];
    this.state = STATE_START;
    this.health = MAX_HEALTH;
    this.friends = 0;
    this.score = 0;
    this.bestScore = loadBestScore();
    this.newRecord = false;
    this.scrollSpeed = BASE_SCROLL_SPEED;
    this.invincibleUntil = 0;
    this.shakeUntil = 0;
    this.w = 0;
    this.h = 0;
    this.lastTime = 0;
  }

  resize(w, h) {
    this.w = w;
    this.h = h;
    this.player.resize(h);
    this.player.setScreenX(w * PLAYER_X_RATIO);
    if (this.state === STATE_START && this.bubbles.length === 0) {
      this.initBubbles(w, h);
    }
    this.pipes.resize(w, h);
    this.spawner.resize(w, h);
    for (const b of this.bubbles) {
      b.x = Math.min(b.x, w);
      b.y = Math.min(b.y, h);
    }
    for (const f of this.followers) {
      f.size = h * 0.042;
    }
  }

  initBubbles(w, h) {
    this.bubbles = [];
    const count = Math.floor((w * h) / 28000);
    for (let i = 0; i < count; i++) {
      this.bubbles.push(new Bubble(w, h));
    }
  }

  start() {
    this.state = STATE_PLAYING;
    this.health = MAX_HEALTH;
    this.friends = 0;
    this.score = 0;
    this.newRecord = false;
    this.followers = [];
    this.scrollSpeed = BASE_SCROLL_SPEED;
    this.invincibleUntil = 0;
    this.shakeUntil = 0;
    this.particles = [];
    this.player.reset();
    this.player.resize(this.h);
    this.player.setScreenX(this.w * PLAYER_X_RATIO);
    this.spawner.reset(this.w, this.h);
    const initialSpawns = this.pipes.reset(this.w, this.h);
    for (const info of initialSpawns) {
      this.spawner.onSegmentSpawned(info);
    }
    this.initBubbles(this.w, this.h);
  }

  onTap() {
    sound.unlock();

    if (this.state === STATE_START) {
      this.start();
      this.player.flap();
      sound.play('flap');
      return;
    }
    if (this.state === STATE_GAMEOVER) {
      this.start();
      this.player.flap();
      sound.play('flap');
      return;
    }
    if (this.state === STATE_PLAYING) {
      this.player.flap();
      sound.play('flap');
    }
  }

  handleGameOver() {
    const finalScore = Math.floor(this.score);
    if (finalScore > this.bestScore) {
      this.bestScore = finalScore;
      this.newRecord = true;
      saveBestScore(finalScore);
      sound.play('newRecord');
    } else {
      sound.play('gameOver');
    }
  }

  takeDamage(amount) {
    if (Date.now() < this.invincibleUntil) return;
    this.health -= amount;
    this.invincibleUntil = Date.now() + INVINCIBILITY_MS;
    this.shakeUntil = Date.now() + SHAKE_DURATION_MS;
    this.player.hitFlash = INVINCIBILITY_MS;
    spawnBurst(this.particles, this.player.x, this.player.y, '#FF4757', 6);
    sound.play('hurt');

    if (this.health <= 0) {
      this.health = 0;
      this.state = STATE_GAMEOVER;
      this.handleGameOver();
    }
  }

  update(dt) {
    for (const b of this.bubbles) b.update(dt, this.w, this.h);
    for (const p of this.particles) p.update(dt, this.h);
    this.particles = this.particles.filter((p) => !p.dead);

    if (this.state !== STATE_PLAYING) return;

    const speed = (this.scrollSpeed * this.w) / 1000;
    this.score += this.scrollSpeed * (dt / 1000);

    const speedLevel = Math.floor(this.score / SPEED_INCREASE_EVERY);
    this.scrollSpeed = Math.min(
      BASE_SCROLL_SPEED + speedLevel * SPEED_INCREASE_AMOUNT,
      MAX_SCROLL_SPEED,
    );

    this.player.update(dt);

    let tx = this.player.x;
    let ty = this.player.y;
    for (const fol of this.followers) {
      fol.update(dt, tx, ty);
      tx = fol.x;
      ty = fol.y;
    }

    const spawns = this.pipes.update(dt, speed, this.w);
    for (const info of spawns) {
      this.spawner.onSegmentSpawned(info);
    }
    this.spawner.update(dt, speed);

    this.checkCollisions();
  }

  checkCollisions() {
    const px = this.player.x;
    const py = this.player.y;
    const pr = this.player.radius;

    for (const rect of this.pipes.getCollisionRects()) {
      if (circleRectOverlap(px, py, pr, rect.x, rect.y, rect.w, rect.h)) {
        this.takeDamage(PIPE_DAMAGE);
        break;
      }
    }

    for (const f of this.spawner.friends) {
      if (f.collected) continue;
      const dx = px - f.x;
      const dy = py - f.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < pr + f.radius) {
        f.collected = true;
        this.friends++;
        this.score += FRIEND_SCORE_BONUS;
        spawnStars(this.particles, f.x, f.y);
        spawnBurst(this.particles, f.x, f.y, f.color, 10);
        sound.play('collect');
        if (this.followers.length < MAX_FOLLOWERS) {
          this.followers.push(
            new Follower(f.color, this.h, this.player.x, this.player.y),
          );
        }
      }
    }

    for (const hz of this.spawner.hazards) {
      if (hz.collected) continue;
      const dx = px - hz.x;
      const dy = py - hz.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < pr + hz.radius) {
        hz.collected = true;
        const dmg = hz.type === 'shark' ? HAZARD_SHARK_DAMAGE : HAZARD_PUFFER_DAMAGE;
        this.takeDamage(dmg);
      }
    }
  }

  draw() {
    const ctx = this.ctx;
    const w = this.w;
    const h = this.h;

    let shakeX = 0;
    let shakeY = 0;
    if (Date.now() < this.shakeUntil) {
      shakeX = (Math.random() - 0.5) * SHAKE_INTENSITY;
      shakeY = (Math.random() - 0.5) * SHAKE_INTENSITY;
    }

    ctx.save();
    ctx.translate(shakeX, shakeY);

    drawBackground(ctx, w, h, this.score * 10);

    for (const b of this.bubbles) b.draw(ctx);

    this.pipes.draw(ctx);
    this.spawner.draw(ctx);

    for (const p of this.particles) p.draw(ctx);

    for (const fol of this.followers) fol.draw(ctx);

    const invincible = Date.now() < this.invincibleUntil;
    this.player.draw(ctx, invincible);

    if (this.state === STATE_PLAYING) {
      drawHUD(ctx, w, h, this.friends, this.health, this.score, this.bestScore);
    }

    ctx.restore();

    if (this.state === STATE_START) {
      drawStartScreen(ctx, w, h, this.bestScore);
    } else if (this.state === STATE_GAMEOVER) {
      drawGameOver(ctx, w, h, this.score, this.friends, this.bestScore, this.newRecord);
    }
  }

  loop(timestamp) {
    if (!this.lastTime) this.lastTime = timestamp;
    const dt = Math.min(timestamp - this.lastTime, 50);
    this.lastTime = timestamp;
    this.update(dt);
    this.draw();
    requestAnimationFrame((t) => this.loop(t));
  }

  run() {
    requestAnimationFrame((t) => this.loop(t));
  }
}
