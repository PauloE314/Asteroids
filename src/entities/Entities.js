import SETTINGS from "../core/settings.js";
import { _2PI } from "../utils/math.js";

const { VIRTUAL, ENTITY_TYPES } = SETTINGS;

/**
 * Base entity class
 */
export default class Entity {
  type = ENTITY_TYPES.DEFAULT;
  x = 0;
  y = 0;
  vx = 0;
  vy = 0;
  radius = 30;
  ang = 0; // Inclination angle

  onDie = function () {};

  /**
   * Initializes the entity
   */
  init() {}

  /**
   * Renders entity in the canvas screen. It calls directly the entity's "draw" method.
   * @param {CanvasRenderingContext2D} ctx
   */
  render(ctx, ...args) {
    // Initialization
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.ang);

    // Draws entity
    this.draw(ctx, ...args);

    // Restore
    ctx.restore();
  }

  /**
   * Draws entity
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx, ...args) {}

  /**
   * Updates entity's current state
   * @param {number} dt
   */
  update(dt, ...args) {}

  /**
   * Default entity update, common for all entities
   * @param {number} dt
   */
  move(dt) {
    // Move
    this.y += this.vy * dt * 0.015;
    this.x += this.vx * dt * 0.015;

    // Teleport X
    if (this.x >= VIRTUAL.w + this.radius) this.x = 0;
    else if (this.x < -this.radius) this.x = VIRTUAL.w;

    // Teleport Y
    if (this.y >= VIRTUAL.h + this.radius) this.y = 0;
    else if (this.y < -this.radius) this.y = VIRTUAL.h;
  }

  /**
   * Sets entity angle
   * @param {number} n
   */
  setAngle(n) {
    this.ang = n > _2PI ? n - _2PI : n;
  }
}
