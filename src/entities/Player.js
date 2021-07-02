import Entity from "./Entities.js";
import SETTINGS from "../core/settings.js";
import { COMMAND_ENUM } from "../core/Control.js";
import { _2PI, randomInt } from "../utils/math.js";

const { VIRTUAL } = SETTINGS;

/**
 * Player base class
 */
export default class Player extends Entity {
  init() {
    super.init();

    this.x = VIRTUAL.w / 2;
    this.y = VIRTUAL.h / 2;
    this.mov = false;
    this.counters = {
      stateChange: 0,
      collision: 0,
    };

    this.beforeDestroyAnimation = () => {};
    this.afterDestroyAnimation = () => {};

    this.setState(PLAYER_STATES.ALIVE_STATE);
  }

  /**
   * @param {Number} dt
   * @param {[Number, Number, Number, Number]} commands
   */
  update(dt, commands) {
    this.counters.stateChange += 0.05 * dt;
    this.counters.collision += 0.05 * dt;

    super.update(dt, commands);
  }

  /**
   * Main player's drawing function
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    // Initialization
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.ang);

    // Executes render based on the current state
    this.state.draw(this, ctx);

    // Restore
    ctx.restore();
  }

  /**
   * Handles collision
   */
  collision(entity) {
    this.counters.collision = 0;
    super.collision(this, entity);
  }

  /**
   * Moves shipt based on it's parameters
   * @param {Number} dt
   * @param {[Number, Number, Number, Number]} commands
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
    this.setState(PLAYER_STATES.RESPAWN_STATE);

    this.x = VIRTUAL.w / 2;
    this.y = VIRTUAL.h / 2;
    this.vx = 0;
    this.vy = 0;
    this.ang = -_2PI / 4;
    this.mov = false;
  }

  /**
   * Changes state
   * @param {{ update: Function, render: Function, collision: Function }} next
   */
  setState(next) {
    this.state = next;
    this.counters.stateChange = 0;
  }
}

/**
 * Possible player states
 */
const PLAYER_STATES = {
  ALIVE_STATE: {
    update(player, dt, commands) {
      player.move(dt, commands);
    },
    draw(player, ctx) {
      player.drawShip(ctx);
    },
    collision(player, entity) {
      player.beforeDestroyAnimation();
      player.setState(PLAYER_STATES.DYING_STATE);
    },
  },

  DYING_STATE: {
    update(player) {
      if (player.counters.stateChange > 30) {
        player.setState(PLAYER_STATES.WAITING_STATE);
      }
    },

    draw(player, ctx) {
      const c = player.counters.stateChange;
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
    },
    collision(player, entity) {},
  },

  WAITING_STATE: {
    draw(player, ctx) {},
    update(player, dt, commands) {
      if (player.counters.stateChange > 30) {
        player.setState(PLAYER_STATES.DEAD_STATE);
        player.afterDestroyAnimation();
      }
    },
    collision(player, entity) {},
  },

  RESPAWN_STATE: {
    draw(player, ctx) {
      if ((player.counters.stateChange / 10).toFixed(0) % 3 == 0) {
        player.drawShip(ctx);
      }
    },
    update(player, dt, commands) {
      if (player.counters.stateChange > 100 && player.counters.collision > 20)
        player.setState(PLAYER_STATES.ALIVE_STATE);
      else player.move(dt, commands);
    },
    collision(player, entity) {},
  },

  DEAD_STATE: {
    draw(player, ctx) {},
    update(player, dt, commands) {},
    collision(player, entity) {},
  },
};
