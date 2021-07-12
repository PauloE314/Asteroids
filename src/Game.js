import SETTINGS from "./core/settings.js";
import Renderer from "./core/Renderer.js";
import { KeyboardControl } from "./core/Control.js";
import Asteroid from "./entities/Asteroid.js";
import Player from "./entities/Player.js";
import { getDistance } from "./utils/math.js";

const { INIt_LIFE_COUNT, FRM_RATE, VIRTUAL } = SETTINGS;

export default class Game {
  renderer = new Renderer();
  controller = new KeyboardControl();
  onEnd = function () {};

  /**
   * Initialize dependencies
   * @param {Number} platform
   * @param {HTMLSpanElement} htmlErrorElement
   */
  init(platform, htmlErrorElement) {
    this.platform = platform;
    this.htmlErrorElement = htmlErrorElement;
    this.frameId = null;

    this.renderer.init();
    this.controller.init();

    this.player = new Player();
    this.player.init();

    // Handle player collisions
    this.player.beforeDestroyAnimation = () => this.life_count--;
    this.player.afterDestroyAnimation = () => {
      if (this.life_count > 0) this.player.respawn();
      else this.gameOver();
    };

    // Asteroids
    this.asteroids = [];
    for (let i = 0; i < 1; i++) {
      this.asteroids.push(new Asteroid());
      this.asteroids[i].init();

      this.asteroids[i].vx = 0;
      this.asteroids[i].vy = 0;
      this.asteroids[i].x = 400;
      this.asteroids[i].y = 250;
    }

    this.score = 0;
    this.life_count = INIt_LIFE_COUNT;
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
          life_count: this.life_count,
          score: this.score,
          seconds: ((Date.now() - this.time.start) / 1000).toFixed(0),
          entities: [this.player, ...this.asteroids],
        });

        // Handles collision and stuff
        this.logic();
      }
    } catch (err) {
      console.log(err);
      // handleErr(this, this.htmlErrorElement, err.message);
    }
  }

  /**
   * Centers the game's main operation logic
   */
  logic() {
    // Checks asteroids for collisions
    this.asteroids.forEach((ast) => {
      const playerDistance = getDistance(ast, this.player);
      const maxPlayerDistance = (this.player.radius + ast.radius) * 0.8;

      // Player collision
      if (playerDistance < maxPlayerDistance)
        this.player.asteroidCollision(ast);

      // Shots collision
      this.player.shots.forEach((shot) => {
        const shotDistance = getDistance(ast, shot);

        if (shotDistance < ast.radius) ast.shotCollision();
      });
    });

    // Handles shots out-of-screen
    const inScreenShots = [];
    this.player.shots.forEach((shot) => {
      if (
        shot.x < VIRTUAL.w &&
        shot.x > 0 &&
        shot.y < VIRTUAL.h &&
        shot.y > 0
      ) {
        inScreenShots.push(shot);
      }
    });
    this.player.shots = inScreenShots;
  }

  /**
   * Handles zero life count
   */
  gameOver() {
    this.end();
    alert("Game Over");
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
