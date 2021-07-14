import Entity from "./Entities.js";
import Particle from "./Particle.js";
import SETTINGS from "../core/settings.js";
import { COMMAND_ENUM } from "../core/Control.js";
import { _2PI, randomInt, random } from "../utils/math.js";

const { VIRTUAL, ENTITY_TYPES } = SETTINGS;

/**
 * Player base class
 *
 * @typedef {[Number, Number, Number, Number]} Command
 */
export default class Player extends Entity {
  type = ENTITY_TYPES.PLAYER;

  init() {
    super.init();

    this.alive = true;
    this.visible = true;
    this.canMove = true;
    this.canShot = true;
    this.particles = [];

    this.shots = [];
    this.shotting = false;
    this.x = VIRTUAL.w / 2;
    this.y = VIRTUAL.h / 2;
    this.isMoving = false;
    this.collisionCounter = 0;

    this.beforeDestroyAnimation = () => {};
    this.afterDestroyAnimation = () => {};
  }

  /**
   * Renders player state and shots
   * @param {CanvasRenderingContext2D} ctx
   */
  render(ctx, ...args) {
    // Default rendering
    super.render(ctx, ...args);

    // Shots rendering
    this.shots.forEach((shot) => shot.render(ctx));
    this.particles.forEach((particle) => particle.render(ctx));
  }

  /**
   * Draws player in path
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    if (this.visible) {
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
      const nextVY = this.vy + Math.sin(this.ang) * this.isMoving;
      const nextVX = this.vx + Math.cos(this.ang) * this.isMoving;

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
          const shot = new Particle();
          const initialX = this.x + Math.cos(this.ang) * 30;
          const initialY = this.y + Math.sin(this.ang) * 30;
          const speed =
            Math.sqrt(Math.pow(this.vy, 2) + Math.pow(this.vx, 2)) * 0.9 + 15;

          shot.init(this.ang, initialX, initialY, speed);
          this.shots.push(shot);
        }
      }
      // Resets fire
      else this.shotting = false;
    }

    this.shots.forEach((shot) => shot.update(dt));
    this.particles.forEach((particle) => {
      particle.update(dt);
      particle.opacity = Math.max(particle.opacity - 0.04, 0);
    });
  }

  /**
   * Sets player's Explosion animation
   */
  die() {
    return new Promise((resolve, reject) => {
      this.alive = false;
      this.visible = false;
      this.canMove = false;
      this.canShot = false;

      this.particles = [];
      for (let i = 0; i < 10; i++) {
        const particle = new Particle();
        particle.init(random(0, _2PI), this.x, this.y, 10);
        this.particles.push(particle);
      }

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
    this.x = VIRTUAL.w / 2;
    this.y = VIRTUAL.h / 2;
    this.vx = 0;
    this.vy = 0;
    this.ang = 0;

    this.alive = false;
    this.isMoving = false;
    this.canMove = true;
    this.shotting = false;

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
}
