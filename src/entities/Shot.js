import SETTINGS from "../core/settings.js";
import { _2PI } from "../utils/math.js";
import Entity from "./Entities.js";

const { VIRTUAL, ENTITY_TYPES } = SETTINGS;

export default class Shot extends Entity {
  type = ENTITY_TYPES.FIRE;

  /**
   * @param {Number} ang
   */
  init(ang, x, y, speed) {
    super.init();

    this.ang = ang;
    this.x = x;
    this.y = y;
    this.vy = Math.sin(ang) * speed;
    this.vx = Math.cos(ang) * speed;
    this.radius = 2;
    this.state = null; // No need for state logic
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
  draw(ctx) {
    ctx.fillStyle = "white";
    ctx.fillRect(-this.radius, -this.radius, this.radius * 2, this.radius * 2);
  }
}
