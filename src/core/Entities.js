import { random, randomInt } from "../utils/math.js";
import { COMMAND_ENUM } from "./Control.js";
import SETTINGS from "../settings.js";

const _2PI = Math.PI * 2;
const { ALIVE, DYING, DEAD } = SETTINGS.LIFE_STATES;
const { VIRTUAL } = SETTINGS;

/**
 * Base entity class
 */
export class Entity {
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
  }

  /**
   * Updates entity's current state
   * @param {number} dt
   */
  update(dt) {}

  /**
   * Default entity update, common for all entities
   * @param {number} dt
   */
  defaultUpdate(dt) {
    // console.log(this.y, this.y);
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
   * Draws entity
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {}

  /**
   * Kills entity
   */
  die() {}
}

/**
 * Player base class
 */
export class Player extends Entity {
  init() {
    super.init();
    this.x = VIRTUAL.w / 2;
    this.y = VIRTUAL.h / 2;
    this.mov = false;

    this.life = ALIVE;
    this.deathAnimationCounter = 0;
  }

  /**
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    if (this.life == DEAD) return;

    // Initialization
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.ang);

    // Draws animation deatch
    if (this.life == DYING) {
      const c = this.deathAnimationCounter;
      const ptclAmount = 5;
      const angle = _2PI / ptclAmount;

      for (let i = 0; i < ptclAmount; i++) {
        ctx.fillRect(
          c * Math.cos(angle * i) + randomInt(-1, 1),
          c * Math.sin(angle * i) + randomInt(-1, 1),
          4,
          4
        );
      }
    }

    // Draw path
    else {
      ctx.beginPath();
      ctx.moveTo(30, 0);
      ctx.lineTo(-15, -15);
      ctx.lineTo(-10, 0);
      ctx.lineTo(-15, 15);
      ctx.closePath();
      ctx.stroke();

      // Draws "fire"
      if (this.mov) {
        ctx.beginPath();
        ctx.moveTo(-13, -10);
        ctx.lineTo(-25, 0);
        ctx.lineTo(-13, 10);
        ctx.stroke();
      }
    }
    // Restore
    ctx.restore();
  }

  /**
   * @param {Number} dt
   * @param {[Number, Number, Number, Number]} commands
   */
  update(dt, commands) {
    // Life logic
    if (this.life == DEAD) return;
    // DYING duration
    else if (this.life == DYING) {
      this.deathAnimationCounter += 0.05 * dt;
      if (this.deathAnimationCounter > 30) this.life = DEAD;
      return;
    }

    if (commands[COMMAND_ENUM.LEFT]) this.setAngle(this.ang - 0.005 * dt);
    if (commands[COMMAND_ENUM.RIGHT]) this.setAngle(this.ang + 0.005 * dt);

    // Movimentation
    if (commands[COMMAND_ENUM.FORWARDS]) this.mov = true;
    else this.mov = false;

    // Speed
    const nextVY = this.vy + Math.sin(this.ang) * this.mov;
    const nextVX = this.vx + Math.cos(this.ang) * this.mov;

    if (Math.abs(nextVY) <= SETTINGS.MAX_SPEED) this.vy = nextVY;
    if (Math.abs(nextVX) <= SETTINGS.MAX_SPEED) this.vx = nextVX;

    // Default update
    this.defaultUpdate(dt);
  }

  /**
   * Kills Player
   */
  die() {
    this.life = DYING;
  }

  /**
   * Resets player
   */
  reset() {
    this.init();
  }
}

/**
 * Asteroid base class
 */
export class Asteroid extends Entity {
  vr = 0;
  dots = [];

  init() {
    super.init();

    this.size = randomInt(1, 2); // 2 - big, 1 - medium, - 0 small
    this.radius = 25 * Math.pow(2, this.size);

    this.x = random(0, VIRTUAL.w);
    this.y = random(0, VIRTUAL.h);
    this.vx = random(-10, 10);
    this.vy = random(-10, 10);
    this.vr = random(10, 60);

    this.dots = ASTEROID_DOT_PATHS["smb".charAt(this.size)][randomInt(0, 2)];
  }

  /**
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.ang);

    // Draw path
    ctx.strokeStyle = "white";
    ctx.beginPath();
    ctx.moveTo(this.dots[0][0], this.dots[0][1]);
    for (let i = 1; i < 7; i++) ctx.lineTo(this.dots[i][0], this.dots[i][1]);
    ctx.closePath();
    ctx.stroke();

    // Restore
    ctx.restore();
  }

  /**
   * @param {Number} dt
   */
  update(dt) {
    this.setAngle(this.ang + dt * this.vr * 0.00005);

    // Move
    this.defaultUpdate(dt);
  }
}

// Asteroids paths (always have 6 dots)
const ASTEROID_DOT_PATHS = {
  s: [
    // 25 radius
  ],
  m: [
    // 50 radius
    [
      [0, -50],
      [12, -15],
      [50, 0],
      [10, 45],
      [-35, 35],
      [-48, 5],
      [-40, -20],
    ],
    [
      [-30, -50],
      [22, -42],
      [35, 15],
      [0, 50],
      [-20, 15],
      [-50, 5],
      [-40, -20],
    ],
    [
      [-28, -30],
      [32, -30],
      [12, 0],
      [32, 40],
      [-33, 35],
      [-38, 20],
      [-48, -0],
    ],
  ],
  b: [
    // 100 radius
    [
      [-80, -60],
      [30, -90],
      [90, -40],
      [50, 80],
      [-64, 75],
      [-38, 50],
      [-70, -0],
    ],
    [
      [-40, -44],
      [0, -95],
      [88, -44],
      [70, 65],
      [-40, 70],
      [-50, 20],
      [-90, -30],
    ],
    [
      [-42, -83],
      [68, -60],
      [38, 8],
      [60, 75],
      [-50, 53],
      [-68, 68],
      [-98, -0],
    ],
  ],
};
