import SETTINGS from "../core/settings.js";
import { _2PI } from "../utils/math.js";
import Entity from "./Entities.js";

const { VIRTUAL, ENTITY_TYPES } = SETTINGS;

export default class Fire extends Entity {
  type = ENTITY_TYPES.FIRE;

  /**
   * @param {Number} ang
   */
  init(ang) {
    super.init();

    this.ang = ang;
    this.x = VIRTUAL.w / 2;
    this.y = VIRTUAL.h / 2;
    this.vx = Math.cos(ang) * 20;
    this.vy = Math.sin(ang) * 20;
    // this.v = Math.sin(ang);
    this.radius = 2;
    this.state = null; // No need for state logic
  }

  /**
   * @param {Number} dt
   */
  update(dt) {
    this.y += this.vy * dt * 0.015;
    this.x += this.vx * dt * 0.015;

    // KILL X
    if (this.x >= VIRTUAL.w + this.radius) this.x = 0;
    else if (this.x < -this.radius) this.x = VIRTUAL.w;

    // KILL Y
    if (this.y >= VIRTUAL.h + this.radius) this.y = 0;
    else if (this.y < -this.radius) this.y = VIRTUAL.h;
  }

  /**
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    ctx.fillStyle = "white";
    ctx.fillRect(-this.radius, -this.radius, this.radius * 2, this.radius * 2);
  }

  /**
   * Kills fire
   */
  kill() {}
}
