import SETTINGS from "../core/settings.js";
import { _2PI } from "../utils/math.js";

const { VIRTUAL, ENTITY_TYPES } = SETTINGS;

/**
 * Base entity class
 */
export default class Entity {
  type = ENTITY_TYPES.DEFAULT;

  onDie = function () {};

  /**
   * Initializes the entity
   */
  init() {
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.radius = 30;
    this.ang = 0; // Inclination angle

    // Empty state
    this.state = {
      update() {},
      draw() {},
      collision() {},
    };
  }

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
   * Updates entity's current state
   * @param {number} dt
   */
  update(dt, ...args) {}

  /**
   * Draws entity
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx, ...args) {}

  /**
   * Handles the entity collision
   * @param {Object} collided The element that collided with the entity
   */
  collision(collided, ...args) {}

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

/**
 * Entity's base state
 */
export class EntityState {
  /**
   * @param {{ update: Function, draw: Function, collision: Function }} override
   */
  constructor(override) {
    if (override) {
      this.update = override.update || this.update;
      this.draw = override.draw || this.draw;
      this.collision = override.collision || this.collision;
    }
  }

  /**
   * @param {Entity} entity
   * @param {Number} dt
   */
  update(entity, dt) {}

  /**
   * @param {Entity} entity
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(entity, ctx) {}

  /**
   * @param {Entity} entity
   * @param {Entity} collided
   */
  collision(entity, collided) {}
}
