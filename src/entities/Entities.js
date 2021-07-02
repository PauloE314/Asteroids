import SETTINGS from "../core/settings.js";
import { _2PI } from "../utils/math.js";

const { VIRTUAL } = SETTINGS;

/**
 * Base entity class
 */
export default class Entity {
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
    this.render = true;

    // Empty state
    this.state = {
      update() {},
      draw() {},
      collision() {},
    };
  }

  /**
   * Draws entity
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx, ...args) {
    this.state.draw(this, ctx, ...args);
  }

  /**
   * Updates entity's current state
   * @param {number} dt
   */
  update(dt, ...args) {
    this.state.update(this, dt, ...args);
  }

  /**
   * Handles the entity collision
   * @param {Object} collided The element that collided with the entity
   */
  collision(collided, ...args) {
    this.state.collision(this, collided, ...args);
  }

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

  /**
   * Sets entity's next state
   * @param {Object} next
   */
  setState(next) {
    this.state = next;
  }
}
