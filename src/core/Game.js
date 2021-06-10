import Renderer from "./Renderer.js";
import { KeyboardControl } from "./Control.js";
import { Asteroid, Player } from "./Entities.js";

export default class Game {
  renderer = new Renderer();
  controller = new KeyboardControl();
  onEnd = function () {};

  /**
   * Initialize dependencies
   * @param {Number} platform
   */
  init(platform) {
    this.frameId = null;

    this.renderer.init();
    this.controller.init();

    this.player = new Player();
    this.player.init();
    this.player.onDie = playerDie;

    this.asteroids = [];
    for (let i = 0; i < 1; i++) {
      this.asteroids.push(new Asteroid());
      this.asteroids[i].init();

      this.asteroids[i].vx = 0;
      this.asteroids[i].vy = 0;
      this.asteroids[i].x = 300;
      this.asteroids[i].y = 200;
    }

    this.score = 0;
    this.time = {
      dt: 0,
      last: 0,
      start: Date.now(),
    };
  }

  /**
   * Main game loop
   */
  run(time = 0) {
    this.time.dt = time - this.time.last;

    // Gets game loop
    this.frameId = requestAnimationFrame(this.run.bind(this));

    // Update and draw
    if (this.time.dt > SETTINGS.frmRate) {
      // Updates data
      this.time.last = time;
      this.player.update(this.time.dt, this.controller.commands);
      this.asteroids.forEach((a) => a.update(this.time.dt));

      // Renders everything
      this.renderer.render({
        score: this.score,
        seconds: ((Date.now() - this.time.start) / 1000).toFixed(0),
        player: this.player,
        asteroids: this.asteroids,
      });

      // Checks for collisions
      this.asteroids.forEach((a) => {
        const dis = Math.sqrt(
          Math.pow(a.x - this.player.x, 2) + Math.pow(a.y - this.player.y, 2)
        );
        if (dis < (a.radius + this.player.radius) * 0.8) {
          this.player.die();
          this.end();
        }
      });
    }
  }

  /**
   * Stops game
   */
  end() {
    cancelAnimationFrame(this.frameId);
    this.renderer.end();
    this.controller.end();
    this.onEnd();
  }
}

/**
 * Handles player's death
 * @param {Player} p
 */
function playerDie(p) {}

/**
 * App settings
 */
export const SETTINGS = {
  frmRate: 30,
  maxSpeed: 30,
  platform: { desktop: 1, mobile: 2 },
  virtual: {
    p: 1.618,
    h: 700,
    w: 700 * 1.618,
  },
};
