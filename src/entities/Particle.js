import SETTINGS from "../core/settings.js";
import { _2PI } from "../utils/math.js";
import Entity from "./Entities.js";

const { VIRTUAL, ENTITY_TYPES } = SETTINGS;

export default class Particle extends Entity {
  /**
   * @param {Number} ang
   */
  init(ang, x, y, speed) {
    super.init();

    this.ang = ang;
    this.opacity = 1;
    this.x = x;
    this.y = y;
    this.vy = Math.sin(ang) * speed;
    this.vx = Math.cos(ang) * speed;
    this.radius = 2;
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
}
