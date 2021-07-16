import { random, _2PI } from "../utils/math.js";
import Entity from "./Entities.js";

export default class Particle extends Entity {
  /**
   * Creates and particle
   * @param {Number} radius
   * @param {Number} ang
   * @param {Number} x
   * @param {Number} y
   * @param {Number} speed
   * @param {Number} opacity
   */
  constructor(radius, ang, x, y, speed, opacity = 1) {
    super();

    this.ang = ang;
    this.x = x;
    this.y = y;
    this.vy = Math.sin(ang) * speed;
    this.vx = Math.cos(ang) * speed;
    this.radius = radius;
    this.opacity = opacity;
    this.onRemoveList = false;
  }

  /**
   * @param {Number} dt
   */
  update(dt) {
    this.y += this.vy * dt * 0.015;
    this.x += this.vx * dt * 0.015;
  }
  /**
   * @param {CanvasRenderingContext2D} ctx
   */
  render(ctx) {
    ctx.fillStyle = "white";
    ctx.globalAlpha = this.opacity;
    ctx.fillRect(
      this.x - this.radius,
      this.y - this.radius,
      this.radius * 2,
      this.radius * 2
    );
    ctx.globalAlpha = 1;
  }

  /**
   * Generates various particles in a certain point with specific speed. Each particle will have a random direction and a random opacity
   * @param {Number} n
   * @param {Number} x
   * @param {Number} y
   * @param {Number} speed
   * @param {Number} radius
   * @returns Particle[]
   */
  static generateSpreadParticles(n, x, y, speed, radius) {
    const particles = [];
    for (let i = 0; i < n; i++) {
      particles.push(
        new Particle(radius, random(0, _2PI), x, y, speed, random(0.3, 1))
      );
    }
    return particles;
  }
}
