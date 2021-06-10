import SETTINGS from "../settings.js";
import Renderer from "./Renderer.js";
import { KeyboardControl } from "./Control.js";
import { Asteroid, Player } from "./Entities.js";
import { handleErr } from "./errors.js";
import { getDistance } from "../utils/math.js";

const { LIFES, FRM_RATE, LIFE_STATES } = SETTINGS;

export default class Game {
  renderer = new Renderer();
  controller = new KeyboardControl();
  onEnd = function () {};

  /**
   * Initialize dependencies
   * @param {Number} platform
   * @param {HTMLSpanElement} htmlErrorELement
   */
  init(platform, htmlErrorELement) {
    this.platform = platform;
    this.htmlErrorElement = htmlErrorELement;
    this.frameId = null;

    this.renderer.init();
    this.controller.init();

    this.player = new Player();
    this.player.init();

    this.asteroids = [];
    for (let i = 0; i < 1; i++) {
      this.asteroids.push(new Asteroid());
      this.asteroids[i].init();

      this.asteroids[i].vx = 0;
      this.asteroids[i].vy = 0;
      this.asteroids[i].x = 500;
      this.asteroids[i].y = 250;
    }

    this.score = 0;
    this.lifes = LIFES;
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
    try {
      this.time.dt = time - this.time.last;

      // Gets game loop
      this.frameId = requestAnimationFrame(this.run.bind(this));

      // Update and draw
      if (this.time.dt > FRM_RATE) {
        // Updates data
        this.time.last = time;
        this.player.update(this.time.dt, this.controller.commands);
        this.asteroids.forEach((a) => a.update(this.time.dt));

        // Renders everything
        this.renderer.render({
          lifes: this.lifes,
          score: this.score,
          seconds: ((Date.now() - this.time.start) / 1000).toFixed(0),
          player: this.player,
          asteroids: this.asteroids,
        });

        // Checks for collisions
        if (this.player.life == LIFE_STATES.ALIVE)
          this.asteroids.forEach((aasteroid) => {
            const dis = getDistance(aasteroid, this.player);
            if (dis < (aasteroid.radius + this.player.radius) * 0.8) {
              this.player.die();
              this.lifes--;
              // this.end();
            }
          });
      }
    } catch (err) {
      handleErr(this, this.htmlErrorElement, err.message);
    }
  }

  /**
   * Resets initial configurations and listenners
   */
  reset() {}

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
