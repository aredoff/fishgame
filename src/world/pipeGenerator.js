import {
  PIPE_WIDTH_RATIO,
  PIPE_SPACING_RATIO,
  BRANCH_WIDTH_RATIO,
  GAP_MIN_RATIO,
  GAP_MAX_RATIO,
  PIPE_SPAWN_AHEAD_RATIO,
  SAFE_ZONE_CHANCE,
  BRANCH_CHANCE,
  THICK_PIPE_CHANCE,
} from '../config.js';
import { createPipePair, createBranchPair } from '../entities/pipe.js';
import { rand, randInt } from '../renderer.js';

export class PipeGenerator {
  constructor() {
    this.pipes = [];
    this.nextX = 0;
    this.w = 0;
    this.h = 0;
  }

  reset(w, h) {
    this.pipes = [];
    this.w = w;
    this.h = h;
    this.nextX = w * 0.85;
    const spawns = [];
    this.fillAhead(spawns);
    return spawns;
  }

  resize(w, h) {
    const scale = w / this.w;
    this.w = w;
    this.h = h;
    for (const p of this.pipes) {
      p.x *= scale;
      p.w *= scale;
      p.h = h;
    }
    this.nextX *= scale;
  }

  get spawnHorizon() {
    return this.w * PIPE_SPAWN_AHEAD_RATIO;
  }

  randomSpacing() {
    return this.w * rand(PIPE_SPACING_RATIO * 0.75, PIPE_SPACING_RATIO * 1.15);
  }

  fillAhead(spawns) {
    while (this.nextX < this.spawnHorizon) {
      const info = this.spawnNext();
      if (info) spawns.push(info);
    }
  }

  spawnNext() {
    const spacing = this.randomSpacing();

    if (Math.random() < SAFE_ZONE_CHANCE) {
      const gap = spacing * rand(0.7, 1.1);
      const info = {
        x: this.nextX + gap * 0.5,
        y: this.h * rand(0.2, 0.7),
      };
      this.nextX += gap;
      return info;
    }

    const isBranch = Math.random() < BRANCH_CHANCE;
    const thick = Math.random() < THICK_PIPE_CHANCE;
    const pipeW = (isBranch ? BRANCH_WIDTH_RATIO : PIPE_WIDTH_RATIO) * this.w * rand(0.9, 1.1);

    if (isBranch) {
      const pathCount = randInt(2, 3);
      const paths = this.generatePaths(pathCount, thick);
      const pair = createBranchPair(this.nextX, pipeW, this.h, paths, thick);
      this.pipes.push(pair);
      const info = pair.getSpawnPoint(spacing);
      this.nextX += pipeW + spacing;
      return info;
    }

    const gapH = thick
      ? rand(GAP_MIN_RATIO * 0.9, GAP_MIN_RATIO + 0.06)
      : rand(GAP_MIN_RATIO + 0.02, GAP_MAX_RATIO);
    const gapY = rand(0.07, 0.93 - gapH);
    const pair = createPipePair(this.nextX, pipeW, this.h, gapY, gapH, thick);
    this.pipes.push(pair);
    const info = pair.getSpawnPoint(spacing);
    this.nextX += pipeW + spacing;
    return info;
  }

  generatePaths(count, thick) {
    const divider = thick ? rand(0.08, 0.12) : rand(0.05, 0.09);
    const paths = [];
    const totalGap = 1 - divider * (count + 1);
    const sizes = [];
    let remaining = totalGap;
    for (let i = 0; i < count; i++) {
      const minG = GAP_MIN_RATIO * 0.6;
      const g = i === count - 1 ? remaining : rand(minG, remaining - minG * (count - i - 1));
      sizes.push(g);
      remaining -= g;
    }
    let y = divider;
    for (let i = 0; i < count; i++) {
      paths.push({ y, h: sizes[i] });
      y += sizes[i] + divider;
    }
    return paths;
  }

  update(dt, scrollSpeed, w) {
    this.w = w;
    this.nextX -= scrollSpeed * dt;

    const spawns = [];
    for (const p of this.pipes) {
      p.update(dt, scrollSpeed);
    }
    this.pipes = this.pipes.filter((p) => !p.offScreen);

    this.fillAhead(spawns);
    return spawns;
  }

  getCollisionRects() {
    const rects = [];
    for (const p of this.pipes) {
      rects.push(...p.collisionRects);
    }
    return rects;
  }

  draw(ctx) {
    for (const p of this.pipes) {
      p.draw(ctx);
    }
  }
}
