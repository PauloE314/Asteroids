import Entity, { EntityState } from "./Entities.js";
import Shot from "./Shot.js";
import SETTINGS from "../core/settings.js";
import { COMMAND_ENUM } from "../core/Control.js";
import { _2PI, randomInt } from "../utils/math.js";

const { VIRTUAL, ENTITY_TYPES } = SETTINGS;
const ptclAmount = 5;

/**
 * Player base class
 *
 * @typedef {[Number, Number, Number, Number]} Command
 */
export default class Player extends Entity {
  type = ENTITY_TYPES.PLAYER;

  init() {
    super.init();

    this.shots = [];
    this.shotting = false;
    this.x = VIRTUAL.w / 2;
    this.y = VIRTUAL.h / 2;
    this.mov = false;
    this.counters = {
      stateChange: 0,
      collision: 0,
    };

    this.beforeDestroyAnimation = () => {};
    this.afterDestroyAnimation = () => {};

    this.setState(ALIVE_STATE);
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
  }

  /**
   * Draws player in path
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    this.state.draw(this, ctx);
  }

  /**
   * @param {Number} dt
   * @param {Command} commands
   */
  update(dt, commands) {
    this.counters.stateChange += 0.05 * dt;
    this.counters.collision += 0.05 * dt;

    this.state.update(this, dt, commands);
    this.shots.forEach((shot) => shot.update(dt));
  }

  /**
   * Handles collision
   */
  collision(entity) {
    this.counters.collision = 0;
    this.state.collision(this, entity);
  }

  /**
   * Moves shipt based on it's parameters
   * @param {Number} dt
   * @param {Command} commands
   */
  move(dt, commands) {
    if (commands[COMMAND_ENUM.LEFT]) this.setAngle(this.ang - 0.005 * dt);
    if (commands[COMMAND_ENUM.RIGHT]) this.setAngle(this.ang + 0.005 * dt);

    // Move
    if (commands[COMMAND_ENUM.FORWARDS]) this.mov = true;
    else this.mov = false;

    // Speed
    const nextVY = this.vy + Math.sin(this.ang) * this.mov;
    const nextVX = this.vx + Math.cos(this.ang) * this.mov;

    if (Math.abs(nextVY) <= SETTINGS.MAX_SPEED) this.vy = nextVY;
    if (Math.abs(nextVX) <= SETTINGS.MAX_SPEED) this.vx = nextVX;

    // Default move logic
    super.move(dt);
  }

  /**
   * Draws ship on canvas. It expects that the cursor is on center of where ship is, as well as is rotated in the correct angle.
   * @param {CanvasRenderingContext2D} ctx
   */
  drawShip(ctx) {
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

  /**
   * Reborn player
   */
  respawn() {
    this.setState(RESPAWN_STATE);

    this.x = VIRTUAL.w / 2;
    this.y = VIRTUAL.h / 2;
    this.vx = 0;
    this.vy = 0;
    this.ang = -_2PI / 4;
    this.mov = false;
  }

  /**
   * Changes state
   * @param {Object} next
   */
  setState(next) {
    this.state = next;
    this.counters.stateChange = 0;
  }
}

/**
 * Possible player states
 */
const ALIVE_STATE = new EntityState({
  /**
   * @param {Player} player
   * @param {Number} dt
   * @param {Command} commands
   */
  update: (player, dt, commands) => {
    player.move(dt, commands);

    // Fire logic
    if (commands[COMMAND_ENUM.FIRE]) {
      if (!player.shotting) {
        player.shotting = true;

        const shot = new Shot();
        const initialX = player.x + Math.cos(player.ang) * 30;
        const initialY = player.y + Math.sin(player.ang) * 30;
        const speed =
          Math.sqrt(Math.pow(player.vy, 2) + Math.pow(player.vx, 2)) * 0.9 + 15;

        shot.init(player.ang, initialX, initialY, speed);

        player.shots.push(shot);
      }
    }
    // Resets fire
    else player.shotting = false;
  },

  /**
   * @param {Player} player
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(player, ctx) {
    player.drawShip(ctx);
  },

  /**
   * @param {Player} player
   * @param {Entity} entity
   */
  collision(player, entity) {
    player.beforeDestroyAnimation();
    player.setState(DYING_STATE);
  },
});

const DYING_STATE = new EntityState({
  /**
   * @param {Player} player
   * @param {Number} dt
   * @param {Command} commands
   */
  update(player) {
    if (player.counters.stateChange > 30) {
      player.setState(WAITING_STATE);
    }
  },

  /**
   * @param {Player} player
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(player, ctx) {
    const c = player.counters.stateChange;
    const angle = _2PI / ptclAmount;

    for (let i = 0; i < ptclAmount; i++) {
      ctx.fillRect(
        c * Math.cos(angle * i) + randomInt(-1, 1),
        c * Math.sin(angle * i) + randomInt(-1, 1),
        4,
        4
      );
    }
  },
});

const WAITING_STATE = new EntityState({
  /**
   * @param {Player} player
   * @param {Number} dt
   * @param {Command} commands
   */
  update(player, dt, commands) {
    if (player.counters.stateChange > 30) {
      player.setState(DEAD_STATE);
      player.afterDestroyAnimation();
    }
  },
});

const RESPAWN_STATE = new EntityState({
  /**
   * @param {Player} player
   * @param {Number} dt
   * @param {Command} commands
   */
  update(player, dt, commands) {
    if (player.counters.stateChange > 100 && player.counters.collision > 20)
      player.setState(ALIVE_STATE);
    else player.move(dt, commands);
  },

  /**
   * @param {Player} player
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(player, ctx) {
    if ((player.counters.stateChange / 10).toFixed(0) % 3 == 0) {
      player.drawShip(ctx);
    }
  },
});

const DEAD_STATE = new EntityState();
