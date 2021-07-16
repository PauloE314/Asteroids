import Entity from "./Entities.js";
import Particle from "./Particle.js";
import SETTINGS from "../core/settings.js";
import { COMMAND_ENUM } from "../core/Control.js";
import { _2PI, random } from "../utils/math.js";

const { VIRTUAL } = SETTINGS;

/**
 * @typedef {[Number, Number, Number, Number]} Command
 */

/**
 * Player base class
 * @property {String} shots
 * @property {Particle[]} particles
 */
export default class Player extends Entity {
  x = VIRTUAL.w / 2;
  y = VIRTUAL.h / 2;
  collisionCounter = 0;

  alive = true;
  visible = true;
  canMove = true;
  canShot = true;
  isMoving = false;
  shotting = false;

  /**
   * @type Particle[]
   */
  particles = [];

  /**
   * @type Particle[]
   */
  shots = [];

  /**
   * Renders player state and shots
   * @param {CanvasRenderingContext2D} ctx
   */
  render(ctx) {
    super.render(ctx);

    this.shots.forEach((shot) => shot.render(ctx));
    this.particles.forEach((particle) => particle.render(ctx));
  }

  /**
   * Draws player in path
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    ctx.beginPath();
    ctx.moveTo(30, 0);
    ctx.lineTo(-15, -15);
    ctx.lineTo(-10, 0);
    ctx.lineTo(-15, 15);
    ctx.closePath();
    ctx.stroke();

    // Draws "fire"
    if (this.isMoving) {
      ctx.beginPath();
      ctx.moveTo(-13, -10);
      ctx.lineTo(-25, 0);
      ctx.lineTo(-13, 10);
      ctx.stroke();
    }
  }

  /**
   * @param {Number} dt
   * @param {Command} commands
   */
  update(dt, commands) {
    this.collisionCounter += 0.05 * dt;

    // Move logic
    if (this.canMove) {
      if (commands[COMMAND_ENUM.LEFT]) this.setAngle(this.ang - 0.005 * dt);
      if (commands[COMMAND_ENUM.RIGHT]) this.setAngle(this.ang + 0.005 * dt);

      // Move
      if (commands[COMMAND_ENUM.FORWARDS]) this.isMoving = true;
      else this.isMoving = false;

      // Speed
      const nextVY = this.vy + Math.sin(this.ang) * this.isMoving * dt * 0.06;
      const nextVX = this.vx + Math.cos(this.ang) * this.isMoving * dt * 0.06;

      if (Math.abs(nextVY) <= SETTINGS.MAX_SPEED) this.vy = nextVY;
      if (Math.abs(nextVX) <= SETTINGS.MAX_SPEED) this.vx = nextVX;

      // Default move logic
      super.move(dt);
    }

    // Fire logic
    if (this.canShot) {
      if (commands[COMMAND_ENUM.FIRE]) {
        if (!this.shotting) {
          this.shotting = true;
          const speed =
            Math.sqrt(Math.pow(this.vy, 2) + Math.pow(this.vx, 2)) * 0.9 + 15;

          const shot = new Particle(
            2,
            this.ang,
            this.x + Math.cos(this.ang) * 30,
            this.y + Math.sin(this.ang) * 30,
            speed
          );
          this.shots.push(shot);
        }
      }
      // Resets fire
      else this.shotting = false;
    }

    this.shots.forEach((shot) => shot.update(dt));
    this.particles.forEach((particle) => {
      particle.update(dt);
    });
  }

  /**
   * Sets player's Explosion animation
   * @returns {Promise<undefined>}
   */
  die() {
    return new Promise((resolve, reject) => {
      this.alive = false;
      this.visible = false;
      this.canMove = false;
      this.canShot = false;

      this.particles = Particle.generateSpreadParticles(
        10,
        this.x,
        this.y,
        10,
        2
      );

      setTimeout(() => {
        this.particles = [];
        resolve();
      }, 1000);
    });
  }

  /**
   * Player respawn on middle screen
   */
  respawn() {
    this.reset();
    this.alive = false;
    this.canShot = false;

    const intervalId = setInterval(() => {
      this.visible = !this.visible;
    }, 300);

    const resurrect = () => {
      if (this.collisionCounter > 20) {
        clearInterval(intervalId);
        this.visible = true;
        this.alive = true;
        this.canShot = true;
      } else {
        setTimeout(resurrect, 1000);
      }
    };

    setTimeout(resurrect, 2000);
  }

  /**
   * Resets initial position and parameters
   */
  reset() {
    this.x = VIRTUAL.w / 2;
    this.y = VIRTUAL.h / 2;
    this.vx = 0;
    this.vy = 0;
    this.ang = 0;
    this.collisionCounter = 0;
    this.alive = true;
    this.visible = true;
    this.canMove = true;
    this.canShot = true;
    this.isMoving = false;
    this.shotting = false;
    this.particles = [];
    this.shots = [];
  }
}
