import { FriendFish } from '../entities/friendFish.js';
import { Hazard } from '../entities/hazard.js';
import {
  FRIEND_SPAWN_CHANCE,
  PUFFER_SPAWN_CHANCE,
  SHARK_SPAWN_CHANCE,
} from '../config.js';

export class Spawner {
  constructor() {
    this.friends = [];
    this.hazards = [];
    this.w = 0;
    this.h = 0;
  }

  reset(w, h) {
    this.friends = [];
    this.hazards = [];
    this.w = w;
    this.h = h;
  }

  resize(w, h) {
    const scaleX = w / this.w;
    const scaleY = h / this.h;
    this.w = w;
    this.h = h;
    for (const f of this.friends) {
      f.x *= scaleX;
      f.y *= scaleY;
      f.w = w;
      f.h = h;
      f.size = h * 0.048;
    }
    for (const hz of this.hazards) {
      hz.x *= scaleX;
      hz.y *= scaleY;
      hz.w = w;
      hz.h = h;
      hz.size = hz.type === 'shark' ? h * 0.075 : h * 0.055;
    }
  }

  onSegmentSpawned(spawnInfo) {
    if (!spawnInfo) return;

    const roll = Math.random();
    if (roll < FRIEND_SPAWN_CHANCE) {
      this.friends.push(new FriendFish(spawnInfo.x, spawnInfo.y, this.w, this.h));
    } else if (roll < FRIEND_SPAWN_CHANCE + PUFFER_SPAWN_CHANCE) {
      this.hazards.push(new Hazard('puffer', spawnInfo.x, spawnInfo.y, this.w, this.h));
    } else if (roll < FRIEND_SPAWN_CHANCE + PUFFER_SPAWN_CHANCE + SHARK_SPAWN_CHANCE) {
      this.hazards.push(new Hazard('shark', spawnInfo.x, spawnInfo.y, this.w, this.h));
    } else {
      this.friends.push(new FriendFish(spawnInfo.x, spawnInfo.y, this.w, this.h));
    }
  }

  update(dt, scrollSpeed) {
    for (const f of this.friends) f.update(dt, scrollSpeed);
    for (const hz of this.hazards) hz.update(dt, scrollSpeed);
    this.friends = this.friends.filter((f) => !f.offScreen && !f.collected);
    this.hazards = this.hazards.filter((hz) => !hz.offScreen && !hz.collected);
  }

  draw(ctx) {
    for (const f of this.friends) f.draw(ctx);
    for (const hz of this.hazards) hz.draw(ctx);
  }
}
