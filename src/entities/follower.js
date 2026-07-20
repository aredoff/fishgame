import { drawFriendFish } from './friendFish.js';

export class Follower {
  constructor(color, h, startX, startY) {
    this.color = color;
    this.size = h * 0.042;
    this.x = startX;
    this.y = startY;
    this.wobble = Math.random() * Math.PI * 2;
  }

  update(dt, targetX, targetY) {
    this.wobble += dt * 0.005;
    const bob = Math.sin(this.wobble) * 4;
    const goalX = targetX - this.size * 1.8;
    const goalY = targetY + bob;
    this.x += (goalX - this.x) * 0.12;
    this.y += (goalY - this.y) * 0.12;
  }

  draw(ctx) {
    drawFriendFish(ctx, this.x, this.y, this.size, this.color);
  }
}
